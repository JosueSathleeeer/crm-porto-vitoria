// Banco de dados embutido (SQLite via sql.js, sem instalação de servidor de banco)
// O arquivo fica em DATA_DIR/porto-vitoria.db e é gravado automaticamente após cada alteração.
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, '..', 'data'));
const DB_FILE = path.join(DATA_DIR, 'porto-vitoria.db');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
fs.mkdirSync(BACKUP_DIR, { recursive: true });

let db = null, timer = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS departamentos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  colecoes_escrita TEXT NOT NULL DEFAULT '[]',   -- JSON: coleções que o departamento pode alterar
  ativo INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  login TEXT NOT NULL UNIQUE,
  email TEXT,
  senha_hash TEXT NOT NULL,
  papel TEXT NOT NULL,                 -- admin | gestor | funcionario | atleta
  departamento_id TEXT REFERENCES departamentos(id),
  atleta_id TEXT,                      -- quando papel = atleta
  funcao TEXT,                         -- cargo exibido (ex.: Fisiologista)
  ativo INTEGER NOT NULL DEFAULT 1,
  trocar_senha INTEGER NOT NULL DEFAULT 0,
  token_versao INTEGER NOT NULL DEFAULT 1,
  tentativas INTEGER NOT NULL DEFAULT 0,
  bloqueado_ate TEXT,
  criado_em TEXT NOT NULL,
  ultimo_acesso TEXT
);
CREATE TABLE IF NOT EXISTS documentos (
  colecao TEXT NOT NULL,
  id TEXT NOT NULL,
  dados TEXT NOT NULL,                 -- JSON do registro
  atualizado_em TEXT NOT NULL,
  atualizado_por TEXT,
  PRIMARY KEY (colecao, id)
);
CREATE INDEX IF NOT EXISTS idx_doc_colecao ON documentos(colecao);
CREATE TABLE IF NOT EXISTS auditoria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quando TEXT NOT NULL,
  usuario_id TEXT,
  usuario_nome TEXT,
  acao TEXT NOT NULL,                  -- login, logout, criar, alterar, excluir, admin...
  colecao TEXT,
  doc_id TEXT,
  detalhe TEXT,
  ip TEXT
);
CREATE INDEX IF NOT EXISTS idx_aud_quando ON auditoria(quando);
`;

async function abrir() {
  const SQL = await initSqlJs({ locateFile: f => path.join(path.dirname(require.resolve('sql.js')), f) });
  db = fs.existsSync(DB_FILE) ? new SQL.Database(fs.readFileSync(DB_FILE)) : new SQL.Database();
  db.run('PRAGMA foreign_keys = ON;');
  db.run(SCHEMA);
  gravarAgora();
  backupDiario();
  return db;
}
function gravarAgora() {
  clearTimeout(timer); timer = null;
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, Buffer.from(db.export()));
  fs.renameSync(tmp, DB_FILE);
}
function gravar() { clearTimeout(timer); timer = setTimeout(() => { try { gravarAgora(); } catch (e) { console.error('Erro ao gravar banco:', e); } }, 400); }
function backupDiario() {
  const nome = new Date().toISOString().slice(0, 10) + '.db', dest = path.join(BACKUP_DIR, nome);
  if (!fs.existsSync(dest) && fs.existsSync(DB_FILE)) fs.copyFileSync(DB_FILE, dest);
  const l = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.db')).sort();
  while (l.length > 45) fs.rmSync(path.join(BACKUP_DIR, l.shift()));
}
function backupAgora() { gravarAgora(); const dest = path.join(BACKUP_DIR, new Date().toISOString().replace(/[:.]/g, '-') + '.db'); fs.copyFileSync(DB_FILE, dest); return dest; }

// utilitários de consulta
function todos(sql, params = []) { const st = db.prepare(sql); st.bind(params); const out = []; while (st.step()) out.push(st.getAsObject()); st.free(); return out; }
function um(sql, params = []) { return todos(sql, params)[0] || null; }
function exec(sql, params = []) { db.run(sql, params); gravar(); }

// documentos (registros do sistema)
function listar(colecao) { return todos('SELECT id, dados FROM documentos WHERE colecao = ?', [colecao]).map(r => ({ ...JSON.parse(r.dados), id: r.id })); }
function obter(colecao, id) { const r = um('SELECT dados FROM documentos WHERE colecao = ? AND id = ?', [colecao, id]); return r ? { ...JSON.parse(r.dados), id } : null; }
function salvar(colecao, id, dados, usuarioId) { exec('INSERT INTO documentos (colecao, id, dados, atualizado_em, atualizado_por) VALUES (?,?,?,?,?) ON CONFLICT(colecao, id) DO UPDATE SET dados = excluded.dados, atualizado_em = excluded.atualizado_em, atualizado_por = excluded.atualizado_por', [colecao, id, JSON.stringify(dados), new Date().toISOString(), usuarioId || null]); }
function excluir(colecao, id) { exec('DELETE FROM documentos WHERE colecao = ? AND id = ?', [colecao, id]); }
function auditar(u, acao, colecao, docId, detalhe, ip) { exec('INSERT INTO auditoria (quando, usuario_id, usuario_nome, acao, colecao, doc_id, detalhe, ip) VALUES (?,?,?,?,?,?,?,?)', [new Date().toISOString(), u?.id || null, u?.nome || null, acao, colecao || null, docId || null, detalhe || null, ip || null]); }

process.on('exit', () => { try { if (db) gravarAgora(); } catch (e) { } });
['SIGINT', 'SIGTERM'].forEach(s => process.on(s, () => { try { if (db) gravarAgora(); } catch (e) { } process.exit(0); }));

module.exports = { abrir, todos, um, exec, listar, obter, salvar, excluir, auditar, backupAgora, backupDiario, gravarAgora, DB_FILE, DATA_DIR, BACKUP_DIR };
