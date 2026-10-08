// Painel de administração e segurança
const $ = s => document.querySelector(s);
const esc = s =>
  String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const toast = (m, err) => {
  const t = $('#toast');
  t.textContent = m;
  t.className = 'toast on' + (err ? ' err' : '');
  clearTimeout(t._t);
  t._t = setTimeout(() => (t.className = 'toast'), 3200);
};

function getCsrfToken() {
  const m = document.cookie.match(/(?:^|;\s*)pv_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}

async function api(method, url, body) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  const c = getCsrfToken();
  if (c && !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())) {
    headers['X-CSRF-Token'] = c;
  }
  const r = await fetch(url, {
    method,
    credentials: 'same-origin',
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  if (r.status === 401) {
    location.href = '/login';
    throw new Error('');
  }
  const j = r.headers.get('content-type')?.includes('json') ? await r.json() : null;
  if (!r.ok) throw new Error(j?.erro || 'Erro');
  return j;
}

const fmtDT = s => (s ? new Date(s).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—');
let ME,
  META,
  DEPS = [],
  USERS = [],
  ATLETAS = [],
  aba = location.hash.replace('#', '') || 'usuarios';

const NOMES_COL = {
  atletas: 'Atletas',
  lesoes: 'Lesões (DM)',
  avaliacoes: 'Composição corporal',
  hidratacao: 'Hidratação',
  energia: 'Necessidade energética',
  testes: 'Testes físicos',
  maturacao: 'Maturação',
  bemestar: 'Bem-estar',
  pse: 'PSE / carga',
  micro: 'Microciclo e calendário',
  macro: 'Macrociclo',
  planos: 'Planos de treino',
  jogos: 'Jogos e minutagem',
  config: 'Configurações gerais'
};

function abrir(html) {
  $('#dlgIn').innerHTML = html;
  $('#dlg').classList.add('on');
}
function fechar() {
  $('#dlg').classList.remove('on');
}

async function iniciar() {
  ME = await api('GET', '/api/auth/me');
  $('#quem').textContent = `${ME.nome} · ${ME.papelNome}${ME.departamentoNome ? ' · ' + ME.departamentoNome : ''}`;
  $('#voltar').href = ME.papel === 'atleta' ? '/atleta' : '/app';
  const adm = ['admin', 'gestor'].includes(ME.papel);
  if (adm) {
    META = await api('GET', '/api/admin/meta');
    [DEPS, USERS, ATLETAS] = await Promise.all([
      api('GET', '/api/admin/departamentos'),
      api('GET', '/api/admin/usuarios'),
      api('GET', '/api/admin/atletas')
    ]);
  }
  const tabs = adm
    ? [
        ['usuarios', 'Usuários'],
        ['departamentos', 'Departamentos e permissões'],
        ['auditoria', 'Registro de alterações & LGPD'],
        ['banco', 'Banco de dados'],
        ['senha', 'Minha senha']
      ]
    : [['senha', 'Minha senha']];

  if (!tabs.some(t => t[0] === aba)) aba = tabs[0][0];
  $('#tabs').innerHTML = tabs.map(([k, n]) => `<button data-aba="${k}" class="${k === aba ? 'on' : ''}">${n}</button>`).join('');
  $('#tabs').onclick = e => {
    const b = e.target.closest('[data-aba]');
    if (!b) return;
    aba = b.dataset.aba;
    location.hash = aba;
    iniciar();
  };
  ({ usuarios, departamentos, auditoria, banco, senha })[aba]();
}

function usuarios() {
  const ed = ME.papel === 'admin';
  $('#corpo').innerHTML = `<section class="box"><h3>Usuários (${USERS.length})</h3><div class="in">${
    ed ? '<button class="btn sm" id="novo">+ Novo usuário</button>' : '<span class="muted">Somente o administrador altera usuários.</span>'
  }</div><div class="scroll"><table><thead><tr><th>Nome</th><th>Usuário</th><th>Perfil</th><th class="hide-sm">Departamento / atleta</th><th class="hide-sm">Último acesso</th><th>Situação</th><th></th></tr></thead><tbody>${USERS.map(
    u =>
      `<tr><td><b>${esc(u.nome)}</b><br><small class="muted">${esc(u.funcao || '')}</small></td><td>${esc(u.login)}</td><td><span class="tag ${
        u.papel === 'admin' ? 'r' : u.papel === 'gestor' ? 'y' : u.papel === 'atleta' ? 'b' : 'g'
      }">${esc(META.papeis[u.papel]?.nome || u.papel)}</span></td><td class="hide-sm">${esc(
        u.papel === 'atleta' ? ATLETAS.find(a => a.id === u.atleta_id)?.nome || '—' : u.departamento_nome || '—'
      )}</td><td class="hide-sm">${fmtDT(u.ultimo_acesso)}</td><td>${
        u.ativo ? '<span class="tag g">Ativo</span>' : '<span class="tag">Inativo</span>'
      }</td><td>${ed ? `<button class="btn sec sm" data-ed="${u.id}">Editar</button>` : ''}</td></tr>`
  ).join('')}</tbody></table></div></section>
  <section class="box"><h3>Perfis (atores)</h3><div class="in">${Object.entries(META.papeis)
    .map(([k, p]) => `<p style="margin:4px 0"><b>${esc(p.nome)}</b> — ${esc(p.desc)}</p>`)
    .join('')}</div></section>`;
  if (!ed) return;
  $('#novo').onclick = () => formUsuario();
  document.querySelectorAll('[data-ed]').forEach(b => (b.onclick = () => formUsuario(USERS.find(u => u.id === b.dataset.ed))));
}

function formUsuario(u) {
  const n = !u;
  u = u || { papel: 'funcionario', ativo: 1 };
  abrir(`<h4>${n ? 'Novo usuário' : 'Editar · ' + esc(u.nome)}</h4><div class="grid2">
    <label>Nome *<input id="fN" value="${esc(u.nome || '')}"></label><label>Usuário (login) *<input id="fL" value="${esc(
    u.login || ''
  )}" ${n ? '' : 'disabled'} autocapitalize="none"></label>
    <label>E-mail<input id="fE" type="email" value="${esc(u.email || '')}"></label><label>Função / cargo<input id="fF" value="${esc(
    u.funcao || ''
  )}" placeholder="Ex.: Fisioterapeuta"></label>
    <label>Perfil *<select id="fP">${Object.entries(META.papeis)
      .map(([k, p]) => `<option value="${k}" ${u.papel === k ? 'selected' : ''}>${esc(p.nome)}</option>`)
      .join('')}</select></label>
    <label id="lD">Departamento<select id="fD"><option value="">—</option>${DEPS.map(
      d => `<option value="${d.id}" ${u.departamento_id === d.id ? 'selected' : ''}>${esc(d.nome)}</option>`
    ).join('')}</select></label>
    <label id="lA">Atleta vinculado *<select id="fA"><option value="">Selecione</option>${ATLETAS.map(
      a => `<option value="${a.id}" ${u.atleta_id === a.id ? 'selected' : ''}>${esc(a.nome)} · ${esc(a.categoria || '')}</option>`
    ).join('')}</select></label>
    <label>${n ? 'Senha inicial *' : 'Nova senha (deixe em branco para manter)'}<input id="fS" type="password" autocomplete="new-password" placeholder="mínimo 8 caracteres (letras e números)"></label>
    ${
      n
        ? ''
        : `<label>Situação<select id="fAt"><option value="1" ${u.ativo ? 'selected' : ''}>Ativo</option><option value="0" ${
            !u.ativo ? 'selected' : ''
          }>Inativo (bloqueia o acesso)</option></select></label>`
    }
  </div><p class="muted" style="margin:0;font-size:13px">No primeiro acesso, o usuário é obrigado a trocar a senha. Senhas exigem letras e números.</p>
  <p class="erro" id="fErr"></p><div class="acts">${
    n ? '' : '<button class="btn red sm" id="fDel">Excluir</button>'
  }<button class="btn sec" id="fC">Cancelar</button><button class="btn" id="fOk">Salvar</button></div>`);

  const vis = () => {
    const p = $('#fP').value;
    $('#lA').style.display = p === 'atleta' ? '' : 'none';
    $('#lD').style.display = p === 'atleta' ? 'none' : '';
  };
  $('#fP').onchange = vis;
  vis();
  $('#fC').onclick = fechar;
  if (!n) {
    $('#fDel').onclick = async () => {
      if (!confirm('Excluir este usuário?')) return;
      try {
        await api('DELETE', '/api/admin/usuarios/' + u.id);
        fechar();
        toast('Usuário excluído');
        iniciar();
      } catch (e) {
        $('#fErr').textContent = e.message;
      }
    };
  }
  $('#fOk').onclick = async () => {
    const b = {
      nome: $('#fN').value.trim(),
      login: $('#fL').value.trim(),
      email: $('#fE').value.trim(),
      funcao: $('#fF').value.trim(),
      papel: $('#fP').value,
      departamento_id: $('#fD').value || null,
      atleta_id: $('#fA').value || null,
      senha: $('#fS').value
    };
    if (!n) b.ativo = $('#fAt').value === '1';
    if (!n && !b.senha) delete b.senha;
    try {
      await api(n ? 'POST' : 'PUT', '/api/admin/usuarios' + (n ? '' : '/' + u.id), b);
      fechar();
      toast(n ? 'Usuário criado' : 'Usuário atualizado');
      iniciar();
    } catch (e) {
      $('#fErr').textContent = e.message;
    }
  };
}

function departamentos() {
  const ed = ME.papel === 'admin';
  $('#corpo').innerHTML = `<section class="box"><h3>Departamentos e o que cada um pode alterar</h3><div class="in"><p class="muted" style="margin-top:0">Todos os funcionários <b>leem</b> todos os módulos. Marque o que cada departamento pode <b>criar, editar e excluir</b>. Administrador e gestor alteram tudo.</p>${
    ed ? '<button class="btn sm" id="novoD">+ Novo departamento</button>' : ''
  }</div>${DEPS.map(
    d =>
      `<div class="in" style="border-top:1px solid #dfe6e2"><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><b style="font-size:16px">${esc(
        d.nome
      )}</b><span class="muted">${esc(d.descricao || '')}</span><span style="flex:1"></span>${
        ed ? `<button class="btn sec sm" data-dep="${d.id}">Editar</button>` : ''
      }</div><div class="chk" style="margin-top:6px">${(d.colecoes_escrita || []).map(c => `<span class="tag g">${esc(NOMES_COL[c] || c)}</span>`).join(' ') ||
        '<span class="tag">Somente consulta</span>'}</div></div>`
  ).join('')}</section>`;
  if (!ed) return;
  $('#novoD').onclick = () => formDep();
  document.querySelectorAll('[data-dep]').forEach(b => (b.onclick = () => formDep(DEPS.find(d => d.id === b.dataset.dep))));
}

function formDep(d) {
  const n = !d;
  d = d || { colecoes_escrita: [] };
  abrir(`<h4>${n ? 'Novo departamento' : 'Editar · ' + esc(d.nome)}</h4><div class="grid2"><label>Nome *<input id="dN" value="${esc(
    d.nome || ''
  )}"></label><label>Descrição<input id="dDs" value="${esc(d.descricao || '')}"></label></div><b style="font-size:13px">Pode alterar:</b><div class="chk">${META.colecoes
    .map(c => `<label><input type="checkbox" value="${c}" ${d.colecoes_escrita.includes(c) ? 'checked' : ''}>${esc(NOMES_COL[c] || c)}</label>`)
    .join('')}</div><p class="erro" id="dErr"></p><div class="acts">${
    n ? '' : '<button class="btn red sm" id="dDel">Excluir</button>'
  }<button class="btn sec" id="dC">Cancelar</button><button class="btn" id="dOk">Salvar</button></div>`);
  $('#dC').onclick = fechar;
  if (!n) {
    $('#dDel').onclick = async () => {
      if (!confirm('Excluir este departamento?')) return;
      try {
        await api('DELETE', '/api/admin/departamentos/' + d.id);
        fechar();
        toast('Departamento excluído');
        iniciar();
      } catch (e) {
        $('#dErr').textContent = e.message;
      }
    };
  }
  $('#dOk').onclick = async () => {
    const nome = $('#dN').value.trim();
    const id = n
      ? nome
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '_')
      : d.id;
    try {
      await api('PUT', '/api/admin/departamentos/' + id, {
        nome,
        descricao: $('#dDs').value.trim(),
        colecoes_escrita: [...document.querySelectorAll('#dlgIn .chk input:checked')].map(i => i.value)
      });
      fechar();
      toast('Departamento salvo');
      iniciar();
    } catch (e) {
      $('#dErr').textContent = e.message;
    }
  };
}

async function auditoria() {
  const l = await api('GET', '/api/admin/auditoria?limite=400');
  const nomeAcao = {
    login: 'Entrou',
    login_falhou: 'Tentativa de login errada',
    trocar_senha: 'Trocou a senha',
    criar: 'Criou',
    alterar: 'Alterou',
    excluir: 'Excluiu',
    backup: 'Baixou backup',
    consulta_saude: 'Consulta de dados clínicos (LGPD)'
  };
  $('#corpo').innerHTML = `<section class="box"><h3>Registro de alterações & LGPD (últimas ${l.length})</h3><div class="scroll"><table><thead><tr><th>Quando</th><th>Quem</th><th>Ação</th><th>Área</th><th class="hide-sm">Registro / Detalhe</th><th class="hide-sm">IP</th></tr></thead><tbody>${l.map(
    a =>
      `<tr><td>${fmtDT(a.quando)}</td><td>${esc(a.usuario_nome || '—')}</td><td>${
        a.acao === 'consulta_saude' ? '<span class="tag b">' + esc(nomeAcao[a.acao]) + '</span>' : esc(nomeAcao[a.acao] || a.acao)
      }</td><td>${esc(NOMES_COL[a.colecao] || a.colecao || '')}</td><td class="hide-sm"><small>${esc(
        a.doc_id || a.detalhe || ''
      )}</small></td><td class="hide-sm"><small>${esc(a.ip || '')}</small></td></tr>`
  ).join('')}</tbody></table></div></section>`;
}

async function banco() {
  const r = await api('GET', '/api/admin/resumo');
  $('#corpo').innerHTML = `<section class="box"><h3>Banco de dados & Backups</h3><div class="in"><p style="margin-top:0">Arquivo do banco: <code>${esc(
    r.banco
  )}</code><br><span class="muted">Backup automático todos os dias na pasta <code>data/backups</code> (mantém 45 cópias diárias com rotação automática).</span></p><div class="scroll"><table><thead><tr><th>Área</th><th>Registros</th></tr></thead><tbody><tr><td>Usuários</td><td><b>${
    r.usuarios
  }</b></td></tr>${Object.entries(r.colecoes)
    .map(([c, n]) => `<tr><td>${esc(NOMES_COL[c] || c)}</td><td><b>${n}</b></td></tr>`)
    .join('')}</tbody></table></div>${
    ME.papel === 'admin'
      ? '<form method="post" action="/api/admin/backup" style="margin-top:12px"><button class="btn">Baixar backup agora (.db)</button></form>'
      : ''
  }</div></section>`;
}

function senha() {
  $('#corpo').innerHTML = `<section class="box" style="max-width:520px"><h3>Trocar minha senha</h3><div class="in">${
    ME.trocarSenha ? '<p class="tag y" style="display:block;padding:8px">Por segurança, troque a senha inicial antes de continuar.</p>' : ''
  }<div class="grid2" style="grid-template-columns:1fr"><label>Senha atual<input id="sA" type="password" autocomplete="current-password"></label><label>Nova senha (mínimo 8, letras e números)<input id="sN" type="password" autocomplete="new-password"></label><label>Repetir nova senha<input id="sR" type="password" autocomplete="new-password"></label></div><p class="erro" id="sErr"></p><button class="btn" id="sOk">Salvar nova senha</button></div></section>`;
  $('#sOk').onclick = async () => {
    if ($('#sN').value !== $('#sR').value) return ($('#sErr').textContent = 'As senhas não conferem.');
    try {
      await api('POST', '/api/auth/senha', { atual: $('#sA').value, nova: $('#sN').value });
      toast('Senha alterada');
      setTimeout(() => (location.href = ME.papel === 'atleta' ? '/atleta' : '/app'), 900);
    } catch (e) {
      $('#sErr').textContent = e.message;
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const sairBtn = $('#sair');
  if (sairBtn) {
    sairBtn.onclick = () => fetch('/api/auth/logout', { method: 'POST' }).finally(() => (location.href = '/login'));
  }
  const dlg = $('#dlg');
  if (dlg) {
    dlg.onclick = e => {
      if (e.target.id === 'dlg') fechar();
    };
  }
  iniciar().catch(e => toast(e.message || 'Erro', true));
});
