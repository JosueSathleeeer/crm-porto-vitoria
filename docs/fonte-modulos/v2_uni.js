/* ================= SISTEMA ÚNICO: FISIO/DM + NUTRIÇÃO + JOGOS/MINUTAGEM ================= */
IC.ball = I('<circle cx="12" cy="12" r="10"/><path d="m12 7 4.2 3.1-1.6 5H9.4l-1.6-5z"/><path d="M12 2v5M21.5 9.2l-5.3.9M18.5 20l-3.9-4.9M5.5 20l3.9-4.9M2.5 9.2l5.3.9"/>');
IC.sliders = I('<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>');
// rotas que pertencem ao módulo de Jogos / Minutagem (motor original da Minutagem)
const MIN_ROUTES = { 'm-dashboard': 'dashboard', 'm-jogos-painel': 'jogos-painel', 'm-jogos-lista': 'jogos-lista', 'm-jogos-arquivos': 'jogos-arquivos', 'm-min-geral': 'min-geral', 'm-min-jogo': 'min-jogo', 'm-min-pos': 'min-pos', 'm-min-atl': 'min-atl', 'm-relatorio': 'relatorio', 'm-importar': 'importar', 'config-min': 'config' };
const MIN_BACK = Object.fromEntries(Object.entries(MIN_ROUTES).map(([k, v]) => [v, k]));
const JOGOS_TABS = [['m-jogos-painel', 'Painel de jogos'], ['m-jogos-lista', 'Cadastro de jogos'], ['m-jogos-arquivos', 'Relatórios dos jogos (PDF)']];
const MINUT_TABS = [['minc', 'Controle de carga (alertas)'], ['m-dashboard', 'Dashboard da minutagem'], ['m-min-geral', 'Minutagem geral'], ['m-min-jogo', 'Minutagem por jogo'], ['m-min-pos', 'Individual por posição'], ['m-min-atl', 'Relatório do atleta'], ['m-relatorio', 'Relatórios em PDF'], ['m-importar', 'Importar planilhas']];
NAV.splice(2, 0, { k: 'jogos', n: 'Jogos', ic: IC.ball, sub: JOGOS_TABS }, { k: 'minut', n: 'Minutagem', ic: IC.clock, sub: MINUT_TABS });
const CFG_TABS = [['config-geral', 'Geral'], ['config-fisio', 'Fisioterapia'], ['config-nutri', 'Nutrição'], ['config-aval', 'Avaliação física'], ['config-forms', 'Formulários dos atletas'], ['config-min', 'Minutagem']];
TITLES.config = ['Configurações', 'Módulos']; CFG_TABS.forEach(([k, n]) => TITLES[k] = ['Configurações', n]);

const UNI = window.UNI = {
  cur: S.view,
  view() { if (window.__APP === 'min' && window.MIN) { const v = MIN.S.view; return v === 'config' ? 'config-min' : (MIN_BACK[v] || 'm-' + v); } return S.view; },
  go(v) {
    if (MIN_ROUTES[v]) {
      if (!window.MIN) { toast('O módulo de minutagem não carregou.', true); return; }
      closeModal(); window.__APP = 'min'; document.body.classList.add('m-on'); UNI.cur = v;
      try { localStorage.setItem('pv_dm_view', v); } catch (e) { }
      MIN.go(MIN_ROUTES[v]); return;
    }
    if (window.__APP === 'min' && window.MIN) MIN.closeModal();
    window.__APP = 'dm'; document.body.classList.remove('m-on'); UNI.cur = v;
    _dmGo(v);
  },
  renderSide() {
    const cur = UNI.view();
    const item = n => {
      const active = cur === n.k || (n.sub && n.sub.some(s => s[0] === cur)) || (n.k === 'config' && cur.startsWith('config'));
      return `<div class="nav-item"><button class="nav-btn ${active ? 'active' : ''}" data-nav="${n.sub ? n.sub[0][0] : n.k}" aria-label="${n.n}">${n.ic}</button>
      <div class="nav-fly"><div class="fly-title">${n.n}</div>${n.sub ? n.sub.map(s => `<button data-nav="${s[0]}" class="${cur === s[0] ? 'active' : ''}">${s[1]}</button>`).join('') : `<button data-nav="${n.k}" class="${active ? 'active' : ''}">Abrir ${n.n.toLowerCase()}</button>`}</div></div>`;
    };
    $('#side').innerHTML = `<div class="brand"><img src="${LOGO}" alt="Porto Vitória"></div>${NAV.map(item).join('')}<div class="spacer"></div>
     ${item({ k: 'config', n: 'Configurações', ic: IC.gear, sub: [['config', 'Todos os módulos'], ...CFG_TABS] })}
     <div class="nav-item"><button class="nav-btn" data-nav-act="theme" aria-label="Alternar tema claro/escuro">${IC.moon}</button><div class="nav-fly"><div class="fly-title">Tema</div><button data-nav-act="theme">Alternar claro / escuro</button></div></div>`;
  },
  afterMinRender() {
    const v = MIN.S.view; const key = v === 'config' ? 'config-min' : (MIN_BACK[v] || 'm-' + v);
    UNI.cur = key; try { localStorage.setItem('pv_dm_view', key); } catch (e) { }
    if (v === 'config') {
      const ct = $('#content'); const rw = ct.querySelector('.rwrap');
      if (rw && !ct.querySelector('.cfg-head')) { const h = document.createElement('div'); h.className = 'cfg-head'; h.innerHTML = cfgHead('config-min'); ct.insertBefore(h, rw); const ph = rw.querySelector('.page-h'); if (ph) ph.remove(); }
      const cr = $('#topbar .crumb'); if (cr) cr.innerHTML = 'Configurações <small>· Minutagem</small>';
    }
  },
  rerender() { if (window.__APP === 'min' && window.MIN) MIN.render(); else render(); }
};
const _dmGo = go;
go = function (v, arg) { if (MIN_ROUTES[v]) return UNI.go(v); if (window.__APP === 'min') { window.__APP = 'dm'; document.body.classList.remove('m-on'); if (window.MIN) MIN.closeModal(); } return _dmGo(v, arg); };
renderSide = UNI.renderSide;
const _dmRender = render;
render = function () { if (window.__APP === 'min') return; _dmRender(); };

// navegação do menu lateral e das abas de configuração funciona nos dois motores
window.document.addEventListener('click', e => {
  const n = e.target.closest('[data-nav]'); if (n) { e.preventDefault(); e.stopPropagation(); UNI.go(n.dataset.nav); return; }
  const t = e.target.closest('[data-nav-act="theme"]'); if (t) { e.stopPropagation(); const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); const nv = cur === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = nv; try { localStorage.setItem('pv_theme', nv); } catch (x) { } UNI.rerender(); }
}, true);

/* ---------- configurações divididas por módulo ---------- */
const CFG_INFO = {
  'config-geral': ['Geral', IC.sliders, 'Tema claro/escuro, ano-base das categorias e backup dos dados de Fisioterapia e Nutrição.'],
  'config-fisio': ['Fisioterapia', IC.med, 'Tipos de lesão, condutas de tratamento, mecanismos de lesão e profissionais do DM.'],
  'config-nutri': ['Nutrição', IC.apple, 'Faixa-alvo de gordura usada para classificar as avaliações corporais.'],
  'config-aval': ['Avaliação física', IC.stopw, 'Faixas de classificação dos testes físicos (CMJ, 30-15 IFT, velocidade e 505).'],
  'config-forms': ['Formulários dos atletas', IC.clip, 'Links e modo tablet para os atletas responderem o bem-estar (com mapa de dor) e a PSE.'],
  'config-min': ['Minutagem', IC.clock, 'Competições, categorias, duração dos jogos, ano-base, capa dos relatórios e backup dos jogos.']
};
function cfgHead(cur) { return `<div class="page-h"><h2>Configurações</h2><span class="muted">${esc(CFG_INFO[cur]?.[0] || 'Módulos')}</span></div><nav class="subtabs"><button data-nav="config">Todos os módulos</button>${CFG_TABS.map(([k, n]) => `<button data-nav="${k}" class="${cur === k ? 'on' : ''}">${n}</button>`).join('')}</nav>`; }
const _dmConfig = vConfig;
vConfig = function () {
  if (S.view === 'config-aval') return cfgHead(S.view) + avCfgHTML();
  if (S.view === 'config-forms') return cfgHead(S.view) + formsCfgHTML();
  if (S.view === 'config') {
    const resumo = { 'config-geral': `Tema: ${document.documentElement.dataset.theme === 'dark' ? 'escuro' : document.documentElement.dataset.theme === 'light' ? 'claro' : 'automático'} · ano-base ${S.config.anoBase}`, 'config-fisio': `${S.config.tipos.length} tipos de lesão · ${S.config.condutas.length} condutas · ${S.config.mecanismos.length} mecanismos · ${(S.config.profissionais || []).filter(p => p.nome).length} profissional(is)`, 'config-nutri': `Faixa-alvo: ${alvo().min}–${alvo().max}% de gordura`, 'config-aval': `${Object.keys(TESTS).length} testes com faixas de classificação`, 'config-forms': 'Bem-estar (pré-treino) e PSE (pós-treino)', 'config-min': window.MIN ? `${MIN.S.config.competicoes.length} competições · ${MIN.S.config.categorias.length} categorias · ano-base ${MIN.S.config.anoBase}` : '' };
    return `<div class="page-h"><h2>Configurações</h2><span class="muted">Escolha o módulo que você quer ajustar</span></div><div class="cfgmods">${CFG_TABS.map(([k]) => `<button class="cfgmod" data-nav="${k}"><span class="ci">${CFG_INFO[k][1]}</span><span class="ct"><b>${CFG_INFO[k][0]}</b><small>${CFG_INFO[k][2]}</small><em>${esc(resumo[k])}</em></span><span class="cg">${IC.next}</span></button>`).join('')}</div>`;
  }
  // monta as seções reaproveitando os painéis originais e filtra pelo módulo escolhido
  const tmp = document.createElement('div'); tmp.innerHTML = _dmConfig();
  const sec = { 'config-geral': ['Aparência', 'Temporada e categorias', 'Backup dos dados'], 'config-fisio': ['Tipos de lesão', 'Condutas / tratamentos', 'Mecanismos de lesão', 'Profissionais do DM'], 'config-nutri': ['Nutrição · faixa-alvo de gordura'] }[S.view] || [];
  const panels = [...tmp.querySelectorAll('.cfg-grid > .panel')].filter(p => sec.some(t => p.querySelector('.ph').textContent.trim().startsWith(t)));
  return cfgHead(S.view) + `<div class="cfg-grid">${panels.map(p => p.outerHTML).join('')}</div>`;
};

/* ---------- foto do atleta (mesmo campo da Minutagem) ---------- */
function prepFotoDM(file) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => { const img = new Image(); img.onload = () => { const H = 360, sc = Math.min(1, H / img.height), w = Math.round(img.width * sc), h = Math.round(img.height * sc); const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0, w, h); res(c.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85)); }; img.onerror = rej; img.src = r.result; }; r.onerror = rej; r.readAsDataURL(file); });
}
const _formAtleta = formAtleta;
formAtleta = function (a = {}) {
  _formAtleta(a);
  let foto = a.foto || '';
  const box = document.createElement('div'); box.className = 'f s4';
  box.innerHTML = `<label>Foto</label><div class="fotobox"><span class="fprev">${foto ? `<img src="${esc(foto)}" alt="">` : esc(initials(a.nome))}</span><div style="display:flex;gap:8px;flex-wrap:wrap"><label class="btn sm" style="cursor:pointer">${IC.upload} Escolher foto<input type="file" id="fFotoDM" accept="image/*" hidden></label><button type="button" class="btn sm danger" id="fFotoRmDM" ${foto ? '' : 'hidden'}>Remover</button><span class="muted" style="font-size:12px;align-self:center">A mesma foto aparece na Minutagem e nos relatórios.</span></div></div>`;
  const form = $('#fAtl .form'); form.insertBefore(box, form.firstChild);
  const prev = () => { box.querySelector('.fprev').innerHTML = foto ? `<img src="${esc(foto)}" alt="">` : esc(initials($('#fNome').value)); $('#fFotoRmDM').hidden = !foto; };
  $('#fFotoDM').onchange = async e => { const f = e.target.files[0]; if (!f) return; try { foto = await prepFotoDM(f); prev(); } catch (er) { toast('Não foi possível ler a imagem.', true); } };
  $('#fFotoRmDM').onclick = () => { foto = ''; prev(); };
  const fm = $('#fAtl'); const sub = fm.onsubmit;
  fm.onsubmit = e => { e.preventDefault(); const f = new FormData(fm); const o = { ...a, id: a.id || uid('a'), nome: f.get('nome').trim(), apelido: f.get('apelido').trim(), numero: f.get('numero'), nascimento: f.get('nascimento'), categoria: f.get('categoria'), subcategoria: f.get('subcategoria'), posicao: f.get('posicao'), posDetalhe: f.get('posDetalhe'), pe: f.get('pe'), altura: f.get('altura'), peso: f.get('peso'), gordura: f.get('gordura'), foto }; if (!o.nome) return; save('atletas', o); closeModal(); toast(a.id ? 'Atleta atualizado' : 'Atleta cadastrado'); };
};

// ordem do menu lateral pedida: Atletas, Jogos, Minutagem, Fisio/DM, Nutrição, Avaliação física
const NAV_ORDER = ['inicio', 'notif', 'cal', 'atletas', 'jogos', 'minut', 'dm', 'nut', 'aval', 'mon', 'plan'];
NAV.sort((a, b) => NAV_ORDER.indexOf(a.k) - NAV_ORDER.indexOf(b.k));

// selo de notificações não lidas no menu
const _rsBase = UNI.renderSide;
UNI.renderSide = function () { _rsBase(); try { const n = typeof notifCount === 'function' ? notifCount() : 0; const b = document.querySelector('#side .nav-btn[data-nav="notif"]'); if (b && n) b.insertAdjacentHTML('beforeend', `<span class="nbadge">${n > 99 ? '99+' : n}</span>`); } catch (e) { } };
renderSide = UNI.renderSide;
