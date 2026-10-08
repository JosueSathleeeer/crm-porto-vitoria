/* ================= ABERTURA: CARREGANDO + LOGIN ================= */
(function () {
  // modo servidor (CRM com banco de dados): o login é feito pelo servidor em /login
  if (window.PV_SERVER) {
    window.sairPV = () => { fetch('/api/auth/logout', { method: 'POST' }).finally(() => { location.href = '/login'; }); };
    window.usuarioAtualPV = () => window.PV_ME ? { u: PV_ME.login, nome: PV_ME.nome, perfil: PV_ME.papelNome || PV_ME.papel } : null;
    window.usuariosPV = () => []; window.hashPV = () => '';
    return;
  }
  const AUTH_KEY = 'pv-auth';
  const hash = s => { let h1 = 0xdeadbeef ^ 7, h2 = 0x41c6ce57 ^ 7; for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); } h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909); h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909); return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36); };
  const hs = (u, p) => hash('pv|' + String(u).toLowerCase().trim() + '|' + p);
  const DEF = [{ u: 'igor', nome: 'Igor Sathler', perfil: 'Administrador', h: hs('igor', 'porto2026') }];
  window.usuariosPV = () => (S.config.usuarios && S.config.usuarios.length ? S.config.usuarios : DEF);
  const lerAuth = () => { try { const v = JSON.parse(localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY) || 'null'); if (v && v.exp > Date.now()) return v; } catch (e) { } return null; };
  const salvarAuth = (u, lembrar) => { const v = JSON.stringify({ u, exp: Date.now() + (lembrar ? 30 : 1) * 864e5 }); try { (lembrar ? localStorage : sessionStorage).setItem(AUTH_KEY, v); } catch (e) { } };
  const limparAuth = () => { try { localStorage.removeItem(AUTH_KEY); sessionStorage.removeItem(AUTH_KEY); } catch (e) { } };
  const formLink = /form=(bemestar|pse)/.test((location.hash || '') + (location.search || ''));
  const gate = document.createElement('div'); gate.id = 'gate';
  gate.innerHTML = `<div class="gt-bg"></div><div class="gt-splash"><img src="${LOGO}" alt="Porto Vitória"><h1>PORTO VITÓRIA</h1><p>Performance Hub · Departamento de Futebol de Base</p><div class="gt-bar"><i></i></div><small>Carregando…</small></div>`;
  document.body.appendChild(gate);
  const t0 = Date.now();
  function mostrarLogin(msg) {
    gate.classList.add('login');
    gate.innerHTML = `<div class="gt-bg"></div><form class="gt-card" id="gtForm" novalidate><img src="${LOGO}" alt=""><h2>PORTO VITÓRIA</h2><p>Performance Hub</p><label>Usuário<input id="gtU" autocomplete="username" autocapitalize="none" spellcheck="false"></label><label>Senha<div class="gt-pw"><input id="gtP" type="password" autocomplete="current-password"><button type="button" id="gtEye" aria-label="Mostrar senha">👁</button></div></label><label class="gt-rem"><input type="checkbox" id="gtR" checked> Manter conectado neste aparelho</label><p class="gt-err" id="gtE">${msg || ''}</p><button class="gt-btn" type="submit">Entrar</button><small class="gt-foot">Departamento de Futebol de Base · ${todayISO().slice(0, 4)}</small></form>`;
    $('#gtU').focus();
    $('#gtEye').onclick = () => { const i = $('#gtP'); i.type = i.type === 'password' ? 'text' : 'password'; };
    $('#gtForm').onsubmit = e => { e.preventDefault(); const u = $('#gtU').value.trim().toLowerCase(), p = $('#gtP').value; const us = usuariosPV().find(x => x.u === u); if (!u || !p) return $('#gtE').textContent = 'Informe usuário e senha.'; if (!us || us.h !== hs(u, p)) { $('#gtE').textContent = 'Usuário ou senha incorretos.'; $('#gtForm').classList.remove('shake'); void $('#gtForm').offsetWidth; $('#gtForm').classList.add('shake'); return; } salvarAuth(u, $('#gtR').checked); entrar(); };
  }
  function entrar() { gate.classList.add('out'); setTimeout(() => { gate.style.display = 'none'; }, 450); try { render(); } catch (e) { } }
  function pronto() { return S.atletas.length || (S.config && Object.keys(S.config).length > 2) || Date.now() - t0 > 3500; }
  (function esperar() { if (Date.now() - t0 < 1300 || !pronto()) return setTimeout(esperar, 150); if (formLink) { gate.style.display = 'none'; return; } const a = lerAuth(); if (a && usuariosPV().some(x => x.u === a.u)) entrar(); else mostrarLogin(); })();
  window.sairPV = () => { limparAuth(); gate.style.display = ''; gate.classList.remove('out'); mostrarLogin('Você saiu do sistema.'); };
  window.usuarioAtualPV = () => { const a = lerAuth(); return a ? usuariosPV().find(x => x.u === a.u) : null; };
  window.hashPV = hs;
})();
// botão "Sair" no menu lateral
const _rsLogin = UNI.renderSide;
UNI.renderSide = function () { _rsLogin(); const side = document.getElementById('side'); if (!side || side.querySelector('[data-nav-act="logout"]')) return; const th = side.querySelector('[data-nav-act="theme"]'); const item = th ? th.closest('.nav-item') : null; const u = window.usuarioAtualPV && usuarioAtualPV(); const html = `<div class="nav-item"><button class="nav-btn" data-nav-act="logout" aria-label="Sair">${I('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>')}</button><div class="nav-fly"><div class="fly-title">${u ? esc(u.nome) : 'Conta'}</div><button data-nav-act="logout">Sair do sistema</button></div></div>`; if (item) item.insertAdjacentHTML('afterend', html); else side.insertAdjacentHTML('beforeend', html); };
renderSide = UNI.renderSide;
document.addEventListener('click', e => { if (e.target.closest('[data-nav-act="logout"]')) { e.stopPropagation(); confirmar('Sair do sistema?', () => sairPV()); } }, true);
// gestão de usuários em Configurações → Geral
const _vConfigU = vConfig;
vConfig = function () {
  const h = _vConfigU(); if (S.view !== 'config-geral') return h;
  if (window.PV_SERVER) { const me = window.PV_ME || {}; return h + '<div style="height:14px"></div>' + panel('Usuários, departamentos e segurança', `<p class="muted" style="margin-top:0">Conectado como <b>${esc(me.nome || '')}</b> (${esc(me.papelNome || me.papel || '')}${me.departamentoNome ? ' · ' + esc(me.departamentoNome) : ''}). Usuários, perfis, departamentos e o registro de alterações ficam na área de administração.</p><div style="display:flex;gap:8px;flex-wrap:wrap">${['admin', 'gestor'].includes(me.papel) ? '<a class="btn pri" href="/admin">Abrir administração</a>' : ''}<a class="btn" href="/admin#senha">Trocar minha senha</a></div>`); }
  const L = usuariosPV(), eu = usuarioAtualPV();
  return h + '<div style="height:14px"></div>' + panel('Usuários e senhas', `<p class="muted" style="margin-top:0">Quem pode entrar no sistema. A senha é guardada de forma codificada.</p><table class="t"><thead><tr><th class="l">Nome</th><th>Usuário</th><th>Perfil</th><th></th></tr></thead><tbody>${L.map(x => `<tr><td class="l"><b>${esc(x.nome)}</b>${eu && eu.u === x.u ? ' <span class="bchip">você</span>' : ''}</td><td>${esc(x.u)}</td><td>${esc(x.perfil || '')}</td><td style="white-space:nowrap"><button class="btn sm" data-act="us-pw" data-u="${esc(x.u)}">Trocar senha</button> ${L.length > 1 ? `<button class="btn sm danger" data-act="us-del" data-u="${esc(x.u)}">${IC.trash}</button>` : ''}</td></tr>`).join('')}</tbody></table><button class="btn pri" data-act="us-novo" style="margin-top:10px">${IC.plus} Novo usuário</button>`);
};
function formUsuario(u) {
  const ed = u ? usuariosPV().find(x => x.u === u) : null;
  openModal(mh(ed ? 'Trocar senha · ' + esc(ed.nome) : 'Novo usuário') + `<form id="fUs" novalidate><div class="mb"><div class="form" style="grid-template-columns:1fr 1fr">${ed ? '' : `<div class="f"><label for="usN">Nome *</label><input id="usN"></div><div class="f"><label for="usU">Usuário *</label><input id="usU" autocapitalize="none"></div><div class="f"><label for="usP2">Perfil</label><select id="usP2">${opts(['Administrador', 'Preparação física', 'Fisioterapia', 'Nutrição', 'Comissão técnica'], 'Comissão técnica')}</select></div>`}<div class="f"><label for="usS">Nova senha * (mín. 6)</label><input id="usS" type="password"></div><div class="f"><label for="usS2">Repetir senha *</label><input id="usS2" type="password"></div></div></div><div class="mf"><span class="msg" id="usE"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar</button></div></form>`);
  $('#fUs').onsubmit = e => { e.preventDefault(); const s = $('#usS').value; if (s.length < 6) return $('#usE').textContent = 'A senha precisa ter pelo menos 6 caracteres.'; if (s !== $('#usS2').value) return $('#usE').textContent = 'As senhas não conferem.'; let L = usuariosPV().map(x => ({ ...x }));
    if (ed) L = L.map(x => x.u === ed.u ? { ...x, h: hashPV(x.u, s) } : x);
    else { const nu = $('#usU').value.trim().toLowerCase(), nn = $('#usN').value.trim(); if (!nn || !nu) return $('#usE').textContent = 'Informe nome e usuário.'; if (!/^[a-z0-9._-]{3,}$/.test(nu)) return $('#usE').textContent = 'Usuário: só letras, números, ponto ou traço (mín. 3).'; if (L.some(x => x.u === nu)) return $('#usE').textContent = 'Esse usuário já existe.'; L.push({ u: nu, nome: nn, perfil: $('#usP2').value, h: hashPV(nu, s) }); }
    S.config.usuarios = L; putConfig(); closeModal(); render(); toast(ed ? 'Senha alterada' : 'Usuário criado'); };
}
document.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'us-novo') formUsuario(); if (t.dataset.act === 'us-pw') formUsuario(t.dataset.u); if (t.dataset.act === 'us-del') confirmar(`Remover o usuário “${esc(t.dataset.u)}”?`, () => { S.config.usuarios = usuariosPV().filter(x => x.u !== t.dataset.u); putConfig(); render(); toast('Usuário removido'); }); });
