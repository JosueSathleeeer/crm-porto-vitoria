// Porto Vitória · Performance Hub — servidor do CRM com proteções avançadas de segurança
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DB = require('./db');
const { COLECOES, PAPEIS, DEPARTAMENTOS_PADRAO, podeEscrever, podeLer, filtrarParaAtleta } = require('./permissoes');
const { validarColecao, validarComplexidadeSenha } = require('./validacao');

const PORT = +process.env.PORT || 3000;
const SESSAO_H = +process.env.SESSAO_HORAS || 12;
const COOKIE = 'pv_sessao';
const CSRF_COOKIE = 'pv_csrf';
const PUB = path.join(__dirname, '..', 'public');

let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.startsWith('troque')) {
  // gera e guarda uma chave local para não perder as sessões a cada reinício
  const f = path.join(DB.DATA_DIR, '.chave-sessao');
  if (!fs.existsSync(f)) fs.writeFileSync(f, crypto.randomBytes(48).toString('hex'));
  JWT_SECRET = fs.readFileSync(f, 'utf8').trim();
}
const agora = () => new Date().toISOString();
const uid = p => p + '_' + crypto.randomBytes(6).toString('hex');
const gerarTokenCsrf = () => crypto.randomBytes(24).toString('hex');

/* ---------- primeiro uso: departamentos e administrador ---------- */
function semear() {
  DEPARTAMENTOS_PADRAO.forEach(d => {
    if (!DB.um('SELECT id FROM departamentos WHERE id = ?', [d.id])) {
      DB.exec('INSERT INTO departamentos (id, nome, descricao, colecoes_escrita) VALUES (?,?,?,?)', [d.id, d.nome, d.descricao, JSON.stringify(d.colecoes)]);
    }
  });
  if (!DB.um("SELECT id FROM usuarios WHERE papel = 'admin'")) {
    const login = (process.env.ADMIN_LOGIN || 'igor').toLowerCase();
    const senha = process.env.ADMIN_SENHA || 'porto2026';
    DB.exec('INSERT INTO usuarios (id, nome, login, senha_hash, papel, departamento_id, funcao, trocar_senha, criado_em) VALUES (?,?,?,?,?,?,?,?,?)', [
      uid('u'),
      process.env.ADMIN_NOME || 'Igor Sathler',
      login,
      bcrypt.hashSync(senha, 10),
      'admin',
      'preparacao_fisica',
      'Fisiologista',
      1,
      agora()
    ]);
    console.log(`\n  Usuário administrador criado: ${login} / ${senha}  (troque a senha no primeiro acesso)\n`);
  }
}

/* ---------- sessão e permissões ---------- */
function carregarUsuario(id) {
  const u = DB.um('SELECT u.*, d.nome AS departamento_nome, d.colecoes_escrita FROM usuarios u LEFT JOIN departamentos d ON d.id = u.departamento_id WHERE u.id = ?', [id]);
  if (!u) return null;
  u.colecoesEscrita = JSON.parse(u.colecoes_escrita || '[]');
  return u;
}

const publico = u => ({
  id: u.id,
  nome: u.nome,
  login: u.login,
  email: u.email,
  papel: u.papel,
  papelNome: PAPEIS[u.papel]?.nome,
  departamento: u.departamento_id,
  departamentoNome: u.departamento_nome,
  funcao: u.funcao,
  atletaId: u.atleta_id,
  trocarSenha: !!u.trocar_senha,
  podeEscrever: u.papel === 'admin' || u.papel === 'gestor' ? COLECOES : u.papel === 'funcionario' ? u.colecoesEscrita : ['bemestar', 'pse']
});

function emitirSessao(res, u) {
  const token = jwt.sign({ sub: u.id, v: u.token_versao }, JWT_SECRET, { expiresIn: SESSAO_H + 'h' });
  const isSecure = process.env.COOKIE_SECURE === 'true';
  // Cookie de sessão JWT (HttpOnly, SameSite=Lax)
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecure,
    maxAge: SESSAO_H * 3600e3,
    path: '/'
  });
  // Cookie CSRF legível pelo JavaScript cliente para envio no cabeçalho X-CSRF-Token
  const csrfToken = gerarTokenCsrf();
  res.cookie(CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    sameSite: 'lax',
    secure: isSecure,
    maxAge: SESSAO_H * 3600e3,
    path: '/'
  });
}

function autenticar(req, res, next) {
  const t = req.cookies[COOKIE];
  if (!t) return negar(req, res);
  try {
    const p = jwt.verify(t, JWT_SECRET);
    const u = carregarUsuario(p.sub);
    if (!u || !u.ativo || u.token_versao !== p.v) return negar(req, res);
    req.u = u;
    next();
  } catch (e) {
    return negar(req, res);
  }
}

// Proteção CSRF para requisições de alteração de estado (POST, PUT, DELETE, PATCH)
function verificarCsrf(req, res, next) {
  const metodo = req.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(metodo)) return next();
  
  const tokenCookie = req.cookies[CSRF_COOKIE];
  const tokenHeader = req.headers['x-csrf-token'];
  
  if (!tokenCookie || !tokenHeader || tokenCookie !== tokenHeader) {
    return res.status(403).json({ erro: 'Falha na validação de segurança da requisição (CSRF inválido ou expirado). Recarregue a página.' });
  }
  next();
}

function negar(req, res) {
  if (req.path.startsWith('/api/')) return res.status(401).json({ erro: 'Sessão expirada. Entre novamente.' });
  return res.redirect('/login');
}

const exigir = (...papeis) => (req, res, next) => (papeis.includes(req.u.papel) ? next() : res.status(403).json({ erro: 'Sem permissão para esta área.' }));
const ip = req => (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim();

/* ---------- aplicação Express ---------- */
const app = express();
app.disable('x-powered-by');

// Cabeçalhos HTTP avançados com Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'script-src': ["'self'", 'blob:'],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
        'img-src': ["'self'", 'data:', 'blob:'],
        'worker-src': ["'self'", 'blob:'],
        'connect-src': ["'self'"],
        'frame-ancestors': ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'same-origin' }
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(cookieParser());

/* ---- Rate Limiters adicionais ---- */
const limiteLogin = rateLimit({
  windowMs: 15 * 60e3,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login a partir deste endereço IP. Aguarde alguns minutos.' }
});

const limiteApiGeral = rateLimit({
  windowMs: 60e3,
  max: 600, // 600 req/min por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Limite de requisições excedido. Reduza a frequência de chamadas.' }
});

app.use('/api/', limiteApiGeral);

/* ---- autenticação ---- */
app.post('/api/auth/login', limiteLogin, (req, res) => {
  const login = String(req.body.login || '').trim().toLowerCase();
  const senha = String(req.body.senha || '');
  const u = DB.um('SELECT * FROM usuarios WHERE login = ?', [login]);
  
  if (u && u.bloqueado_ate && u.bloqueado_ate > agora()) {
    return res.status(429).json({ erro: 'Usuário bloqueado temporariamente por tentativas erradas. Tente em alguns minutos.' });
  }
  
  if (!u || !u.ativo || !bcrypt.compareSync(senha, u.senha_hash)) {
    if (u) {
      const t = u.tentativas + 1;
      DB.exec('UPDATE usuarios SET tentativas = ?, bloqueado_ate = ? WHERE id = ?', [
        t >= 5 ? 0 : t,
        t >= 5 ? new Date(Date.now() + 10 * 60e3).toISOString() : null,
        u.id
      ]);
    }
    DB.auditar(u, 'login_falhou', null, null, login, ip(req));
    return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
  }
  
  DB.exec('UPDATE usuarios SET tentativas = 0, bloqueado_ate = NULL, ultimo_acesso = ? WHERE id = ?', [agora(), u.id]);
  DB.auditar(u, 'login', null, null, null, ip(req));
  emitirSessao(res, u);
  res.json({ ok: true, usuario: publico(carregarUsuario(u.id)), destino: u.papel === 'atleta' ? '/atleta' : '/app' });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE, { path: '/' });
  res.clearCookie(CSRF_COOKIE, { path: '/' });
  res.json({ ok: true });
});

app.get('/api/auth/me', autenticar, (req, res) => {
  res.json(publico(req.u));
});

app.post('/api/auth/senha', autenticar, verificarCsrf, (req, res) => {
  const { atual, nova } = req.body || {};
  if (!bcrypt.compareSync(String(atual || ''), req.u.senha_hash)) {
    return res.status(400).json({ erro: 'Senha atual incorreta.' });
  }
  
  const check = validarComplexidadeSenha(String(nova || ''));
  if (!check.valido) {
    return res.status(400).json({ erro: check.erro });
  }
  
  DB.exec('UPDATE usuarios SET senha_hash = ?, trocar_senha = 0, token_versao = token_versao + 1 WHERE id = ?', [
    bcrypt.hashSync(String(nova), 10),
    req.u.id
  ]);
  DB.auditar(req.u, 'trocar_senha', null, null, null, ip(req));
  emitirSessao(res, carregarUsuario(req.u.id));
  res.json({ ok: true });
});

/* ---- tempo real (SSE) ---- */
const clientes = new Set();
app.get('/api/stream', autenticar, (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no'
  });
  res.flushHeaders();
  res.write('retry: 3000\n\n');
  const c = { res, u: req.u };
  clientes.add(c);
  const ping = setInterval(() => res.write(': ping\n\n'), 25000);
  req.on('close', () => {
    clearInterval(ping);
    clientes.delete(c);
  });
});

function avisar(colecao, id, op, dados, origemId) {
  for (const c of clientes) {
    if (!podeLer(c.u, colecao)) continue;
    let d = dados;
    if (c.u.papel === 'atleta' && d) {
      const f = filtrarParaAtleta(c.u, colecao, [d]);
      if (!f.length) continue;
      d = f[0];
    }
    c.res.write(`data: ${JSON.stringify({ colecao, id, op, dados: d, origem: origemId })}\n\n`);
  }
}

/* ---- dados do sistema (CRUD com validação e auditoria LGPD de saúde) ---- */
app.get('/api/db/:col', autenticar, (req, res) => {
  const col = req.params.col;
  if (!podeLer(req.u, col)) return res.status(403).json({ erro: 'Sem permissão.' });
  
  // Auditoria de conformidade LGPD para dados sensíveis de saúde quando consultados por funcionários/gestores
  if (['lesoes', 'avaliacoes', 'hidratacao', 'energia'].includes(col) && req.u.papel !== 'atleta') {
    DB.auditar(req.u, 'consulta_saude', col, null, `Consulta aos registros de ${col}`, ip(req));
  }
  
  res.json(filtrarParaAtleta(req.u, col, DB.listar(col)));
});

app.put('/api/db/:col/:id', autenticar, verificarCsrf, (req, res) => {
  const { col, id } = req.params;
  const dados = req.body || {};
  
  if (!/^[\w.\-|:@+~]{1,200}$/.test(id)) {
    return res.status(400).json({ erro: 'Código de registro inválido.' });
  }
  
  // Validação estrutural de dados e limites por coleção
  const val = validarColecao(col, id, dados);
  if (!val.valido) {
    return res.status(400).json({ erro: val.erro });
  }
  const sanitizado = val.sanitizado;
  
  if (!podeEscrever(req.u, col, sanitizado, id)) {
    return res.status(403).json({ erro: 'Seu perfil não pode alterar esta área.' });
  }
  
  const novo = !DB.obter(col, id);
  delete sanitizado.id;
  DB.salvar(col, id, { ...sanitizado, id }, req.u.id);
  DB.auditar(req.u, novo ? 'criar' : 'alterar', col, id, null, ip(req));
  avisar(col, id, 'set', { ...sanitizado, id }, req.u.id);
  res.json({ ok: true });
});

app.delete('/api/db/:col/:id', autenticar, verificarCsrf, (req, res) => {
  const { col, id } = req.params;
  const atual = DB.obter(col, id);
  
  if (!podeEscrever(req.u, col, atual, id)) {
    return res.status(403).json({ erro: 'Seu perfil não pode excluir nesta área.' });
  }
  
  DB.excluir(col, id);
  DB.auditar(req.u, 'excluir', col, id, null, ip(req));
  avisar(col, id, 'delete', null, req.u.id);
  res.json({ ok: true });
});

/* ---- administração: usuários, departamentos, auditoria, backup ---- */
app.get('/api/admin/meta', autenticar, exigir('admin', 'gestor'), (req, res) => {
  res.json({ papeis: PAPEIS, colecoes: COLECOES });
});

app.get('/api/admin/usuarios', autenticar, exigir('admin', 'gestor'), (req, res) => {
  res.json(
    DB.todos(
      'SELECT u.id, u.nome, u.login, u.email, u.papel, u.departamento_id, u.atleta_id, u.funcao, u.ativo, u.ultimo_acesso, u.criado_em, d.nome AS departamento_nome FROM usuarios u LEFT JOIN departamentos d ON d.id = u.departamento_id ORDER BY u.nome'
    )
  );
});

app.post('/api/admin/usuarios', autenticar, exigir('admin'), verificarCsrf, (req, res) => {
  const b = req.body || {};
  const login = String(b.login || '').trim().toLowerCase();
  
  if (!b.nome || !/^[a-z0-9._-]{3,40}$/.test(login)) {
    return res.status(400).json({ erro: 'Informe nome e um usuário válido (letras, números, ponto ou traço).' });
  }
  if (!PAPEIS[b.papel]) return res.status(400).json({ erro: 'Perfil inválido.' });
  
  const checkSenha = validarComplexidadeSenha(String(b.senha || ''));
  if (!checkSenha.valido) {
    return res.status(400).json({ erro: checkSenha.erro });
  }
  
  if (DB.um('SELECT id FROM usuarios WHERE login = ?', [login])) {
    return res.status(400).json({ erro: 'Esse usuário já existe.' });
  }
  if (b.papel === 'atleta' && !b.atleta_id) {
    return res.status(400).json({ erro: 'Escolha o atleta vinculado.' });
  }
  
  const id = uid('u');
  DB.exec(
    'INSERT INTO usuarios (id, nome, login, email, senha_hash, papel, departamento_id, atleta_id, funcao, trocar_senha, criado_em) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [
      id,
      b.nome.trim(),
      login,
      b.email || null,
      bcrypt.hashSync(String(b.senha), 10),
      b.papel,
      b.papel === 'funcionario' ? b.departamento_id || null : b.departamento_id || null,
      b.papel === 'atleta' ? b.atleta_id : null,
      b.funcao || null,
      b.trocar_senha === false ? 0 : 1,
      agora()
    ]
  );
  DB.auditar(req.u, 'admin_criar_usuario', 'usuarios', id, login, ip(req));
  res.json({ ok: true, id });
});

app.put('/api/admin/usuarios/:id', autenticar, exigir('admin'), verificarCsrf, (req, res) => {
  const b = req.body || {};
  const u = DB.um('SELECT * FROM usuarios WHERE id = ?', [req.params.id]);
  if (!u) return res.status(404).json({ erro: 'Usuário não encontrado.' });
  
  if (
    u.papel === 'admin' &&
    (b.papel !== 'admin' || b.ativo === false) &&
    DB.um("SELECT COUNT(*) n FROM usuarios WHERE papel = 'admin' AND ativo = 1").n <= 1
  ) {
    return res.status(400).json({ erro: 'Precisa existir pelo menos um administrador ativo.' });
  }
  
  DB.exec(
    'UPDATE usuarios SET nome = ?, email = ?, papel = ?, departamento_id = ?, atleta_id = ?, funcao = ?, ativo = ?, token_versao = token_versao + ? WHERE id = ?',
    [
      b.nome || u.nome,
      b.email ?? u.email,
      PAPEIS[b.papel] ? b.papel : u.papel,
      b.departamento_id ?? u.departamento_id,
      b.papel === 'atleta' ? b.atleta_id || u.atleta_id : null,
      b.funcao ?? u.funcao,
      b.ativo === false ? 0 : 1,
      b.ativo === false || b.papel !== u.papel ? 1 : 0,
      u.id
    ]
  );
  
  if (b.senha) {
    const check = validarComplexidadeSenha(String(b.senha));
    if (!check.valido) return res.status(400).json({ erro: check.erro });
    DB.exec('UPDATE usuarios SET senha_hash = ?, trocar_senha = 1, token_versao = token_versao + 1, tentativas = 0, bloqueado_ate = NULL WHERE id = ?', [
      bcrypt.hashSync(String(b.senha), 10),
      u.id
    ]);
  }
  
  DB.auditar(req.u, 'admin_alterar_usuario', 'usuarios', u.id, u.login, ip(req));
  res.json({ ok: true });
});

app.delete('/api/admin/usuarios/:id', autenticar, exigir('admin'), verificarCsrf, (req, res) => {
  const u = DB.um('SELECT * FROM usuarios WHERE id = ?', [req.params.id]);
  if (!u) return res.status(404).json({ erro: 'Usuário não encontrado.' });
  if (u.id === req.u.id) return res.status(400).json({ erro: 'Você não pode excluir o próprio usuário.' });
  if (u.papel === 'admin' && DB.um("SELECT COUNT(*) n FROM usuarios WHERE papel = 'admin'").n <= 1) {
    return res.status(400).json({ erro: 'Precisa existir pelo menos um administrador.' });
  }
  
  DB.exec('DELETE FROM usuarios WHERE id = ?', [u.id]);
  DB.auditar(req.u, 'admin_excluir_usuario', 'usuarios', u.id, u.login, ip(req));
  res.json({ ok: true });
});

app.get('/api/admin/departamentos', autenticar, (req, res) => {
  res.json(DB.todos('SELECT * FROM departamentos ORDER BY nome').map(d => ({ ...d, colecoes_escrita: JSON.parse(d.colecoes_escrita || '[]') })));
});

app.put('/api/admin/departamentos/:id', autenticar, exigir('admin'), verificarCsrf, (req, res) => {
  const b = req.body || {};
  const id = String(req.params.id).toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const cols = (b.colecoes_escrita || []).filter(c => COLECOES.includes(c));
  
  if (!b.nome) return res.status(400).json({ erro: 'Informe o nome do departamento.' });
  
  if (DB.um('SELECT id FROM departamentos WHERE id = ?', [id])) {
    DB.exec('UPDATE departamentos SET nome = ?, descricao = ?, colecoes_escrita = ?, ativo = ? WHERE id = ?', [
      b.nome,
      b.descricao || '',
      JSON.stringify(cols),
      b.ativo === false ? 0 : 1,
      id
    ]);
  } else {
    DB.exec('INSERT INTO departamentos (id, nome, descricao, colecoes_escrita) VALUES (?,?,?,?)', [
      id,
      b.nome,
      b.descricao || '',
      JSON.stringify(cols)
    ]);
  }
  
  DB.auditar(req.u, 'admin_departamento', 'departamentos', id, b.nome, ip(req));
  res.json({ ok: true, id });
});

app.delete('/api/admin/departamentos/:id', autenticar, exigir('admin'), verificarCsrf, (req, res) => {
  if (DB.um('SELECT COUNT(*) n FROM usuarios WHERE departamento_id = ?', [req.params.id]).n) {
    return res.status(400).json({ erro: 'Há usuários neste departamento. Mude-os antes de excluir.' });
  }
  DB.exec('DELETE FROM departamentos WHERE id = ?', [req.params.id]);
  DB.auditar(req.u, 'admin_excluir_departamento', 'departamentos', req.params.id, null, ip(req));
  res.json({ ok: true });
});

app.get('/api/admin/auditoria', autenticar, exigir('admin', 'gestor'), (req, res) => {
  res.json(DB.todos('SELECT * FROM auditoria ORDER BY id DESC LIMIT ?', [Math.min(1000, +req.query.limite || 300)]));
});

app.get('/api/admin/atletas', autenticar, exigir('admin', 'gestor'), (req, res) => {
  res.json(DB.listar('atletas').map(a => ({ id: a.id, nome: a.nome, categoria: a.categoria, posicao: a.posicao })).sort((a, b) => a.nome.localeCompare(b.nome)));
});

app.get('/api/admin/resumo', autenticar, exigir('admin', 'gestor'), (req, res) => {
  res.json({
    usuarios: DB.um('SELECT COUNT(*) n FROM usuarios').n,
    colecoes: Object.fromEntries(COLECOES.map(c => [c, DB.um('SELECT COUNT(*) n FROM documentos WHERE colecao = ?', [c]).n])),
    banco: DB.DB_FILE
  });
});

app.post('/api/admin/backup', autenticar, exigir('admin'), (req, res) => {
  const f = DB.backupAgora();
  DB.auditar(req.u, 'backup', null, null, path.basename(f), ip(req));
  res.download(f, 'porto-vitoria-backup-' + agora().slice(0, 10) + '.db');
});

/* ---- páginas estáticas / rotas ---- */
const pagina = f => (req, res) => res.sendFile(path.join(PUB, f));
app.get('/login', pagina('login.html'));
app.get('/', (req, res) => {
  const t = req.cookies[COOKIE];
  try {
    const p = jwt.verify(t, JWT_SECRET);
    const u = carregarUsuario(p.sub);
    if (u && u.ativo) return res.redirect(u.papel === 'atleta' ? '/atleta' : '/app');
  } catch (e) {}
  res.redirect('/login');
});
app.get('/app', autenticar, (req, res, next) => (req.u.papel === 'atleta' ? res.redirect('/atleta') : next()), pagina('app.html'));
app.get('/atleta', autenticar, pagina('atleta.html'));
app.get('/formulario', autenticar, pagina('app.html'));
app.get('/admin', autenticar, pagina('admin.html'));
app.use(express.static(PUB, { index: false, extensions: ['html'] }));
app.use((req, res) => res.status(404).send('Página não encontrada'));

/* ---- inicialização e backup periódico ---- */
DB.abrir().then(() => {
  semear();
  setInterval(() => {
    try {
      DB.backupDiario();
    } catch (e) {}
  }, 3600e3);
  
  app.listen(PORT, '0.0.0.0', () => {
    const nets = Object.values(require('os').networkInterfaces())
      .flat()
      .filter(n => n && n.family === 'IPv4' && !n.internal)
      .map(n => n.address);
    console.log(`\n  Porto Vitória · Performance Hub rodando`);
    console.log(`  Neste computador:  http://localhost:${PORT}`);
    nets.forEach(a => console.log(`  Na rede (celular): http://${a}:${PORT}`));
    console.log(`  Banco de dados:    ${DB.DB_FILE}\n`);
  });
});
