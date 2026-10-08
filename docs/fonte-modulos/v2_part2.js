"use strict";
const LOGO = '__LOGO__';
const BODY = '__BODY__';
const SEED = __SEED__;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n ?? '').padStart(2, '0');
function todayISO() { const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
const fmtD = iso => iso ? iso.split('-').reverse().join('/') : '—';
const fmtDs = iso => iso ? iso.slice(8, 10) + '/' + iso.slice(5, 7) : '—';
const dayDiff = (a, b) => Math.round((Date.parse(b + 'T12:00') - Date.parse(a + 'T12:00')) / 864e5);
const addDays = (iso, n) => { const d = new Date(iso + 'T12:00'); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
const nf = (n, d = 1) => Number(n || 0).toFixed(d).replace('.', ',');
const pct = (a, b) => b ? nf(a / b * 100) + '%' : '0%';
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MESESU = MESES.map(m => m.toUpperCase());

/* ---------- mesmo padrão do Sistema de Minutagem ---------- */
const GRUPOS = { 'Sub-11': ['Sub-10', 'Sub-11'], 'Sub-13': ['Sub-12', 'Sub-13'], 'Sub-15': ['Sub-14', 'Sub-15'], 'Sub-17': ['Sub-16', 'Sub-17'], 'Sub-20': ['Sub-18', 'Sub-19', 'Sub-20'] };
const GRUPO_DE = {}; Object.entries(GRUPOS).forEach(([g, s]) => s.forEach(x => GRUPO_DE[x] = g));
const POS = ['GOL', 'LAT', 'ZAG', 'VOL', 'MEI', 'ATA', 'EXT'];
const POSN = { GOL: 'Goleiro', LAT: 'Lateral', ZAG: 'Zagueiro', VOL: 'Volante', MEI: 'Meio-campista', ATA: 'Atacante', EXT: 'Extremo' };
const POSDET = { GOL: ['Goleiro'], LAT: ['Lateral Direito', 'Lateral Esquerdo'], ZAG: ['Zagueiro', 'Zagueiro Direito', 'Zagueiro Esquerdo'], VOL: ['Volante', 'Primeiro Volante', 'Segundo Volante'], MEI: ['Meio-campista', 'Meia Central', 'Meia Armador'], ATA: ['Atacante', 'Centroavante', 'Segundo Atacante'], EXT: ['Extremo', 'Ponta Direita', 'Ponta Esquerda'] };
const PC1 = { GOL: '#3368d9', LAT: '#f4b91f', ZAG: '#e2322b', VOL: '#17824a', MEI: '#f58a1f', ATA: '#7b3fd3', EXT: '#ef3e95' };
function subPorIdade(nasc, anoBase) { if (!nasc) return {}; const y = +String(nasc).slice(0, 4); if (!y) return {}; const n = (+anoBase || new Date().getFullYear()) - y; if (n < 10) return { cat: 'Sub-11', sub: 'Sub-10' }; if (n > 20) return { cat: 'Sub-20', sub: 'Sub-20' }; return { cat: GRUPO_DE['Sub-' + n], sub: 'Sub-' + n }; }
const idade = n => { if (!n) return ''; const d = new Date(n + 'T12:00:00'), h = new Date(); let a = h.getFullYear() - d.getFullYear(); const m = h.getMonth() - d.getMonth(); if (m < 0 || (m === 0 && h.getDate() < d.getDate())) a--; return a; };
const subTag = a => a && a.subcategoria ? `<span class="subtag" title="${esc(a.subcategoria)}">${esc(a.subcategoria.replace('Sub-', 'S'))}</span>` : '';
const ptag = p => `<span class="ptag" style="background:${PC1[p] || '#6b7a72'}">${esc(p || '—')}</span>`;

const DEFAULT_CFG = {
  tipos: ['Distensão Muscular', 'Estiramento', 'Ruptura Muscular', 'Sobrecarga Muscular', 'Entorse', 'Contusão', 'Tendinite', 'Fratura', 'Ruptura Ligamentar', 'Luxação', 'Outros'],
  condutas: ['Fisioterapia', 'Fortalecimento', 'Crioterapia', 'Liberação miofascial', 'Mobilidade', 'Propriocepção', 'Controle de carga', 'Eletroterapia', 'Imobilização', 'Cirurgia'],
  mecanismos: ['Corrida / Sprint', 'Mudança de direção', 'Chute', 'Salto / Aterrissagem', 'Contato / Trauma', 'Sobrecarga', 'Outro'],
  profissionais: [{ nome: 'Igor Sathler', cargo: 'Preparador Físico / Fisiologista' }],
  anoBase: new Date().getFullYear()
};
const GRAUS = ['—', 'Grau 1', 'Grau 2', 'Grau 3'];
const LOCAIS = ['Jogo', 'Treino', 'Fora do clube'];
const STATUS = { tratamento: 'Em Tratamento', transicao: 'Transição', retorno: 'Retorno Gradual', liberado: 'Liberado' };
const STATUS_DESC = { tratamento: 'em tratamento no DM', transicao: 'iniciando trabalhos com o grupo', retorno: 'aumentando carga', liberado: 'disponível para jogos' };
const ORDER = ['tratamento', 'transicao', 'retorno', 'liberado'];
const SCOL = { tratamento: 'var(--red)', transicao: 'var(--yellow)', retorno: 'var(--g500)', liberado: 'var(--blue)' };
const PAL = ['#e0342b', '#f39324', '#f6c21c', '#1b8a4a', '#159aa8', '#2f6fd6', '#7a3fd1', '#ec3f93', '#8a948f'];
const REG = {
  cabeca: ['Cabeça', 'Cabeça / Pescoço', 0], pescoco: ['Pescoço / Cervical', 'Cabeça / Pescoço', 0],
  ombro: ['Ombro', 'Membros Superiores', 1], braco: ['Braço', 'Membros Superiores', 1], antebraco: ['Antebraço / Cotovelo', 'Membros Superiores', 1], mao: ['Mão / Punho', 'Membros Superiores', 1],
  torax: ['Tórax / Peitoral', 'Tronco', 1], abdomen: ['Abdômen', 'Tronco', 0], dorsal: ['Costas (dorsal)', 'Tronco', 1], lombar: ['Lombar', 'Tronco', 0],
  virilha: ['Quadril / Virilha', 'Membros Inferiores', 1], gluteo: ['Glúteo', 'Membros Inferiores', 1], quadriceps: ['Quadríceps', 'Membros Inferiores', 1], adutor: ['Adutor da Coxa', 'Membros Inferiores', 1],
  posterior: ['Posterior de Coxa', 'Membros Inferiores', 1], joelho: ['Joelho', 'Membros Inferiores', 1], canela: ['Tíbia / Fíbula', 'Membros Inferiores', 1], panturrilha: ['Panturrilha', 'Membros Inferiores', 1],
  aquiles: ['Tendão de Aquiles', 'Membros Inferiores', 1], tornozelo: ['Tornozelo', 'Membros Inferiores', 1], pe: ['Pé', 'Membros Inferiores', 1]
};
const GRUPOS_REG = ['Membros Inferiores', 'Tronco', 'Membros Superiores', 'Cabeça / Pescoço'];
const regN = r => REG[r] ? REG[r][0] : r;
const regFull = l => regN(l.regiao) + (l.lado ? ` (${l.lado})` : '');
const lesNome = l => l.tipo + (l.grau && l.grau !== '—' ? ' ' + l.grau : '');

/* ---------- ícones (mesmo traço da Minutagem) ---------- */
const I = (p, vb = '0 0 24 24', fill = false) => `<svg viewBox="${vb}" fill="${fill ? 'currentColor' : 'none'}" stroke="${fill ? 'none' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const IC = {
  dash: I('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'),
  users: I('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
  user: I('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
  med: I('<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M9 5V3h6v2M12 9v8M8 13h8"/>'),
  cross: I('<circle cx="12" cy="12" r="10"/><path d="M12 7v10M7 12h10"/>'),
  clock: I('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
  cal: I('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 15h2M14 15h2"/>'),
  gear: I('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),
  moon: I('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'),
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  edit: I('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  trash: I('<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>'),
  x: I('<path d="M18 6 6 18M6 6l12 12"/>'),
  down: I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>'),
  upload: I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>'),
  hist: I('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 8v4l3 2"/>'),
  chev: I('<path d="m6 9 6 6 6-6"/>'),
  next: I('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  check: I('<path d="M20 6 9 17l-5-5"/>'),
  band: I('<rect x="2" y="8.5" width="20" height="7" rx="3.5" transform="rotate(-40 12 12)"/><path d="M10.5 10.5h.01M13.5 13.5h.01M13.5 10.5h.01M10.5 13.5h.01"/>'),
  scalpel: I('<path d="M3 21 14 10M14 10l6-6 1 1-6 6-1-1zM7 17l-2 2"/>'),
  run: I('<circle cx="14" cy="4" r="2"/><path d="M8 21l3-6 3 2v4M7 11l3-3 4 1 2 3h3M10 8l-2 5"/>'),
  cycle: I('<path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>'),
  trend: I('<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>'),
  globe: I('<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20"/>'),
  bars: I('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  body: I('<circle cx="12" cy="4" r="2"/><path d="M12 7v7M6 9l6 1 6-1M9 22l3-8 3 8"/>'),
  leg: I('<path d="M9 2v8l-1.5 6L9 22M15 2v8l1.5 6L15 22"/>'),
  shield: I('<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/>'),
  print: I('<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>'),
  pdf: I('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/>'),
  scale: I('<path d="M12 3v18M5 7h14M5 7l-3 7a4 4 0 0 0 6 0zM19 7l-3 7a4 4 0 0 0 6 0z"/>')
};

/* ---------- estado e armazenamento ---------- */
let PRINT = false;
const EXTRA_COLS = ['bemestar', 'pse', 'macro', 'micro', 'planos'];
const S = { atletas: [], lesoes: [], avaliacoes: [], hidratacao: [], testes: [], maturacao: [], bemestar: [], pse: [], macro: [], micro: [], planos: [], config: JSON.parse(JSON.stringify(DEFAULT_CFG)), ready: false, online: false, view: 'dashboard', sub: 'visao', arg: null, canWrite: true };
const F = { categoria: 'Todas', sub: 'Todas', ano: String(new Date().getFullYear()), periodo: 'ano' };
// período dentro da temporada: ano todo, semestres ou um mês
const noPeriodo = d => { d = String(d || ''); if (F.ano !== 'Todos' && !d.startsWith(F.ano)) return false; const p = F.periodo || 'ano'; if (p === 'ano') return true; const m = +d.slice(5, 7); return p === 's1' ? m <= 6 : p === 's2' ? m >= 7 : m === +p; };
const PER_NOMES = { s1: '1º SEM', s2: '2º SEM', '01': 'JAN', '02': 'FEV', '03': 'MAR', '04': 'ABR', '05': 'MAI', '06': 'JUN', '07': 'JUL', '08': 'AGO', '09': 'SET', '10': 'OUT', '11': 'NOV', '12': 'DEZ' };
const UI = { fl: { status: 'ativos', regiao: '', tipo: '', busca: '' }, selLes: null, histAtleta: null, atBusca: '', atPos: 'Todas', selMode: false, sel: new Set() };
try { const f = JSON.parse(localStorage.getItem('pv_dm_filtro') || 'null'); if (f) Object.assign(F, f); } catch (e) { }
let db = null;
const LS = 'pv_dm_data';
const fixCfg = c => { const o = { ...DEFAULT_CFG, ...(c || {}) }; ['tipos', 'condutas', 'mecanismos'].forEach(k => { if (!Array.isArray(o[k]) || !o[k].length) o[k] = [...DEFAULT_CFG[k]]; }); if (!Array.isArray(o.profissionais)) o.profissionais = []; return o; };
function lsLoad() { try { const j = JSON.parse(localStorage.getItem(LS) || 'null'); if (j) { S.atletas = j.atletas || []; S.lesoes = j.lesoes || []; S.avaliacoes = j.avaliacoes || []; S.hidratacao = j.hidratacao || []; S.testes = j.testes || []; S.maturacao = j.maturacao || []; EXTRA_COLS.forEach(c => S[c] = j[c] || []); S.config = fixCfg(j.config); } } catch (e) { } }
function lsSave() { try { localStorage.setItem(LS, JSON.stringify({ atletas: S.atletas, lesoes: S.lesoes, avaliacoes: S.avaliacoes, hidratacao: S.hidratacao, testes: S.testes, maturacao: S.maturacao, ...Object.fromEntries(EXTRA_COLS.map(c => [c, S[c]])), config: S.config })); } catch (e) { } }
function dbErr(e) { const c = e && e.code; if (c === 'invalid_argument') { S.canWrite = false; toast('Você não tem permissão para editar os dados deste sistema.', true); } else if (c === 'quota_exceeded') toast('Limite de armazenamento atingido.', true); else toast('Não foi possível salvar agora. Tente novamente.', true); }
async function save(col, obj) {
  const arr = S[col]; const i = arr.findIndex(x => x.id === obj.id);
  if (i >= 0) arr[i] = obj; else arr.push(obj);
  render();
  if (db) { try { await db.collection(col).doc(obj.id).set(JSON.parse(JSON.stringify(obj))); } catch (e) { dbErr(e); } } else lsSave();
}
async function remove(col, id) {
  S[col] = S[col].filter(x => x.id !== id); render();
  if (db) { try { await db.collection(col).doc(id).delete(); } catch (e) { dbErr(e); } } else lsSave();
}
async function putConfig() {
  render();
  if (db) { try { await db.doc('config/dm').set(JSON.parse(JSON.stringify(S.config))); } catch (e) { dbErr(e); } } else lsSave();
}
async function loadSeed() {
  if (typeof progress === 'function') progress('Carregando dados de exemplo…');
  try { for (const c of ['atletas', 'lesoes', 'avaliacoes', 'hidratacao', 'testes', 'maturacao']) await saveMany(c, (SEED[c] || []).map(x => ({ ...x }))); }
  finally { if (typeof progressEnd === 'function') progressEnd(); }
  render(); toast('Dados de exemplo carregados');
}
async function initStore() {
  lsLoad(); S.ready = true; render();
  try { db = window.claude && await window.claude.use('db'); } catch (e) { db = null; }
  if (!db) return;
  S.online = true; const got = { atletas: 0, lesoes: 0, cfg: 0, av: 0, hid: 0, ts: 0, mt: 0 };
  const done = () => { if (got.atletas && got.lesoes && got.cfg && got.av && got.hid && got.ts && got.mt) render(); };
  EXTRA_COLS.forEach(c => db.collection(c).onSnapshot(s => { S[c] = s.docs.map(d => ({ ...d.data(), id: d.id })); if (got.atletas && got.lesoes) render(); }, () => { }));
  db.collection('testes').onSnapshot(s => { S.testes = s.docs.map(d => ({ ...d.data(), id: d.id })); got.ts = 1; done(); }, () => { got.ts = 1; done(); });
  db.collection('maturacao').onSnapshot(s => { S.maturacao = s.docs.map(d => ({ ...d.data(), id: d.id })); got.mt = 1; done(); }, () => { got.mt = 1; done(); });
  db.collection('avaliacoes').onSnapshot(s => { S.avaliacoes = s.docs.map(d => ({ ...d.data(), id: d.id })); got.av = 1; done(); }, () => { got.av = 1; done(); });
  db.collection('hidratacao').onSnapshot(s => { S.hidratacao = s.docs.map(d => ({ ...d.data(), id: d.id })); got.hid = 1; done(); }, () => { got.hid = 1; done(); });
  db.collection('atletas').onSnapshot(s => { S.atletas = s.docs.map(d => ({ ...d.data(), id: d.id })); got.atletas = 1; done(); }, () => { });
  db.collection('lesoes').onSnapshot(s => { S.lesoes = s.docs.map(d => ({ ...d.data(), id: d.id })); got.lesoes = 1; done(); }, () => { });
  db.doc('config/dm').onSnapshot(s => { if (s.exists) S.config = fixCfg(s.data()); got.cfg = 1; done(); }, () => { got.cfg = 1; done(); });
}

/* ---------- consultas ---------- */
const atl = id => S.atletas.find(a => a.id === id);
const atletasCat = () => S.atletas.filter(a => (F.categoria === 'Todas' || a.categoria === F.categoria) && (F.sub === 'Todas' || F.categoria === 'Todas' || a.subcategoria === F.sub));
const idsCat = () => new Set(atletasCat().map(a => a.id));
const lesPeriodo = () => { const ids = idsCat(); return S.lesoes.filter(l => ids.has(l.atletaId) && (noPeriodo(l.data))); };
const lesAtivas = () => { const ids = idsCat(); return S.lesoes.filter(l => ids.has(l.atletaId) && l.status !== 'liberado'); };
function diasFora(l) { const end = l.status === 'liberado' && l.statusDatas?.liberado ? l.statusDatas.liberado : todayISO(); return Math.max(0, dayDiff(l.data, end)); }
const ativaDe = id => S.lesoes.filter(l => l.atletaId === id && l.status !== 'liberado').sort((a, b) => b.data.localeCompare(a.data))[0];
const countBy = (arr, fn) => arr.reduce((m, x) => { const k = fn(x); m[k] = (m[k] || 0) + 1; return m; }, {});
const sumBy = (arr, fn, val) => arr.reduce((m, x) => { const k = fn(x); m[k] = (m[k] || 0) + val(x); return m; }, {});
const sortEnt = o => Object.entries(o).sort((a, b) => b[1] - a[1]);
const initials = n => (n || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const median = a => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const catLabel = () => F.categoria === 'Todas' ? 'TODAS AS CATEGORIAS' : (F.sub !== 'Todas' ? F.sub : F.categoria).toUpperCase().replace('-', ' ');
const anoLabel = () => F.ano === 'Todos' ? 'TODAS' : F.ano + (F.periodo && F.periodo !== 'ano' ? ' · ' + PER_NOMES[F.periodo] : '');

/* ---------- componentes ---------- */
const chip = st => `<span class="st st-${st}">${STATUS[st]}</span>`;
const ava = (a, cls = '') => `<span class="ava ${cls}">${a && a.foto ? `<img src="${esc(a.foto)}" alt="">` : esc(initials(a?.nome))}</span>`;
const athCell = a => `<div class="athcell">${ava(a)}<div><b>${esc(a?.apelido || a?.nome || 'Atleta removido')}${subTag(a)}</b><small>${a?.numero ? '#' + esc(a.numero) + ' · ' : ''}${esc(a?.categoria || '')}</small></div></div>`;
const kpi = (icon, k, v, s = '', cls = '', vcls = '') => `<div class="kpi ${cls}">${IC[icon]}<div style="min-width:0"><div class="k">${k}</div><div class="v ${vcls}">${v}</div><div class="s">${s}</div></div></div>`;
const panel = (title, body, opts = {}) => `<div class="panel" ${opts.id ? `id="${opts.id}"` : ''}><div class="ph">${title}${opts.r ? `<span class="r">${opts.r}</span>` : ''}</div><div class="pb ${opts.np ? 'np' : ''}">${body}</div></div>`;
const miniEmpty = (t, s = '') => `<div class="mini-empty"><b style="display:block;color:var(--ink);font-family:var(--fc);font-size:18px">${t}</b>${s}</div>`;
function header(o) {
  const left = `<img class="logo" src="${LOGO}" alt="Escudo Porto Vitória"><div class="lt"><div class="t1">PORTO VITÓRIA</div><div class="t2">DEPARTAMENTO DE FUTEBOL DE BASE</div><div class="t3">${esc(o.sub || 'FISIOTERAPIA · DEPARTAMENTO MÉDICO')}</div></div>`;
  const center = `<div class="center"><div class="bigtitle">${esc(o.title)}</div><div class="pill">${esc(o.pill || catLabel())}</div></div>`;
  const meta = o.items ? `<div class="meta">${o.items.map(([ic, k, v]) => `<div class="mi">${IC[ic]}<div><small>${k}</small><b>${esc(v)}</b></div></div>`).join('')}</div>` : '';
  const slogan = `<div class="slogan">Disciplina<br>Desenvolvimento<br>Performance</div>`;
  return `<header class="rhead ${o.solo ? 'solo' : ''}">${left}${center}${meta}${slogan}</header>`;
}
function dist(rows, opts = {}) {
  if (!rows.length) return miniEmpty('Sem dados', 'no período selecionado.');
  const max = Math.max(1, ...rows.map(r => r.v));
  return `<div class="dist">${rows.map(r => `<div class="nm">${r.sw ? `<span class="sq" style="background:${r.sw}"></span>` : ''}${esc(r.l)}</div><div class="track"><i style="width:${(r.v / max * 100).toFixed(1)}%;${r.c ? `background:${r.c}` : ''}"></i></div><div class="vv">${r.t ?? r.v}</div><div class="pp">${r.p ?? ''}</div>`).join('')}</div>`;
}
function donut(segs, big, small, size = 180) {
  const tot = segs.reduce((s, x) => s + x.v, 0); const r = 62, c = 2 * Math.PI * r; let off = 0;
  const arcs = tot ? segs.filter(s => s.v > 0).map(s => { const len = s.v / tot * c; const el = `<circle r="${r}" cx="85" cy="85" fill="none" stroke="${s.c}" stroke-width="26" stroke-dasharray="${len} ${c - len}" stroke-dashoffset="${-off}" transform="rotate(-90 85 85)"><title>${esc(s.l)}: ${s.v}</title></circle>`; off += len; return el; }).join('') : `<circle r="${r}" cx="85" cy="85" fill="none" stroke="var(--line)" stroke-width="26"/>`;
  return `<svg viewBox="0 0 170 170" width="${size}" height="${size}" role="img" aria-label="${esc(small)}">${arcs}<text x="85" y="90" text-anchor="middle" font-size="38" font-weight="800" fill="var(--ink)" style="font-family:var(--fc)">${big}</text><text x="85" y="111" text-anchor="middle" font-size="13" fill="var(--ink2)">${esc(small)}</text></svg>`;
}
const legend = segs => { const t = segs.reduce((s, x) => s + x.v, 0); return `<div class="legend">${segs.map(s => `<div class="li"><span class="sw" style="background:${s.c}"></span><div><b>${esc(s.l)}</b><span>${s.v} (${pct(s.v, t)})</span></div></div>`).join('')}</div>`; };
function lineChart(labels, values, opts = {}) {
  const W = opts.w || 600, H = opts.h || 230, L = 34, R = 14, T = 24, B = 28;
  const all = [...values, ...(opts.second || [])]; let lo = 0, max = Math.max(opts.min || 4, ...all) * 1.15;
  if (opts.fit) { const mn = Math.min(...all), mx = Math.max(...all), pad = Math.max((mx - mn) * 0.35, Math.abs(mx) * 0.03, 0.05); lo = mn - pad; max = mx + pad; }
  const step = (W - L - R) / (labels.length - 1 || 1); const X = i => L + i * step, Y = v => T + (H - T - B) * (1 - (v - lo) / (max - lo));
  const dec = opts.fit && max - lo < 5 ? 2 : 0;
  let g = ''; for (let i = 0; i <= 5; i++) { const v = lo + (max - lo) / 5 * i, y = Y(v); g += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${L - 6}" y="${y + 4}" text-anchor="end" font-size="11" fill="var(--ink2)">${dec ? nf(v, dec) : Math.round(v)}</text>`; }
  const pts = values.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
  const id = 'lg' + Math.random().toString(36).slice(2, 7);
  const dots = values.map((v, i) => `<circle cx="${X(i)}" cy="${Y(v)}" r="4.5" fill="var(--g500)" stroke="var(--card)" stroke-width="2"><title>${labels[i]}: ${v}</title></circle>${opts.noVal ? '' : `<text x="${X(i)}" y="${Y(v) - 10}" text-anchor="middle" font-size="12.5" font-weight="700" fill="var(--ink)">${Number.isInteger(v) ? v : nf(v, Math.abs(v) < 10 ? 2 : 1)}</text>`}`).join('');
  const xl = labels.map((l, i) => `<text x="${X(i)}" y="${H - 8}" text-anchor="middle" font-size="11.5" fill="var(--ink2)">${l}</text>`).join('');
  const second = opts.second ? `<polyline points="${opts.second.map((v, i) => `${X(i)},${Y(v)}`).join(' ')}" fill="none" stroke="var(--gold)" stroke-width="2.5" stroke-dasharray="6 4"/>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label || 'gráfico')}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b8a4a" stop-opacity=".45"/><stop offset="1" stop-color="#1b8a4a" stop-opacity="0"/></linearGradient></defs>${g}<polygon points="${X(0)},${Y(lo)} ${pts} ${X(values.length - 1)},${Y(lo)}" fill="url(#${id})"/>${second}<polyline points="${pts}" fill="none" stroke="var(--g500)" stroke-width="3"/>${dots}${xl}</svg>`;
}
function vbars(labels, values, opts = {}) {
  const W = opts.w || 600, H = opts.h || 210, L = 30, R = 8, T = 22, B = 26; const max = Math.max(opts.min || 5, ...values) * 1.15;
  const bw = (W - L - R) / labels.length; let g = '';
  for (let i = 0; i <= 4; i++) { const v = max / 4 * i, y = T + (H - T - B) * (1 - v / max); g += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${L - 5}" y="${y + 4}" text-anchor="end" font-size="11" fill="var(--ink2)">${Math.round(v)}</text>`; }
  const id = 'vg' + Math.random().toString(36).slice(2, 7);
  const bars = values.map((v, i) => { const h = (H - T - B) * v / max, x = L + i * bw + bw * .2, y = H - B - h; return `<rect x="${x}" y="${y}" width="${bw * .6}" height="${h}" rx="2" fill="url(#${id})"><title>${labels[i]}: ${v}</title></rect>${v ? `<text x="${x + bw * .3}" y="${y - 5}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">${v}</text>` : ''}<text x="${x + bw * .3}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--ink2)">${labels[i]}</text>`; }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b8a4a"/><stop offset="1" stop-color="#0e4a29"/></linearGradient></defs>${g}${bars}</svg>`;
}
function stacked(labels, series, opts = {}) {
  const W = opts.w || 600, H = 240, L = 30, R = 8, T = 22, B = 26;
  const tots = labels.map((_, i) => series.reduce((s, x) => s + x.vals[i], 0));
  const max = Math.max(4, ...tots) * 1.15, bw = (W - L - R) / labels.length; let g = '', bars = '';
  for (let i = 0; i <= 4; i++) { const v = max / 4 * i, y = T + (H - T - B) * (1 - v / max); g += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${L - 5}" y="${y + 4}" text-anchor="end" font-size="11" fill="var(--ink2)">${Math.round(v)}</text>`; }
  labels.forEach((lb, i) => {
    let y = H - B; const x = L + i * bw + bw * .22, w = bw * .56;
    series.forEach(s => { const v = s.vals[i]; if (!v) return; const h = (H - T - B) * v / max; y -= h; bars += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${s.c}" stroke="var(--card)" stroke-width="1"><title>${lb} · ${esc(s.l)}: ${v}</title></rect>`; });
    bars += `<text x="${x + w / 2}" y="${y - 6}" text-anchor="middle" font-size="12.5" font-weight="700" fill="var(--ink)">${tots[i]}</text><text x="${x + w / 2}" y="${H - 8}" text-anchor="middle" font-size="11.5" fill="var(--ink2)">${lb}</text>`;
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}">${g}${bars}</svg>`;
}

/* ---------- mapa corporal: cada músculo recortado entre as linhas da ilustração ---------- */
// [regiao, lado, músculo, contorno SVG] em coordenadas da imagem (900 x 807)
const SEGS = __SEGS__;
const regLong = l => regN(l.regiao) + (l.musculo ? ' · ' + l.musculo : '') + (l.lado ? ` (${l.lado})` : '');
const segMatch = (sg, l) => sg[0] === l.regiao && (l.musculo ? (sg[2] === l.musculo && sg[1] === (l.lado || '')) : (REG[l.regiao]?.[2] ? sg[1] === (l.lado || '') : true));
const heatColor = t => `hsla(${(48 * (1 - t)).toFixed(0)},95%,${54 - t * 8}%,${(.62 + t * .28).toFixed(2)})`;
const segTip = sg => regN(sg[0]) + ' · ' + sg[2] + (sg[1] ? ` (${sg[1] === 'D' ? 'direito' : 'esquerdo'})` : '');
// contagem de lesões por ponto do corpo (chave = índice do segmento)
const segCounts = ls => SEGS.map(sg => ls.filter(l => segMatch(sg, l)).length);
// o: {mode:'heat'|'pick'|'hl', ls:[lesões], sel:{regiao,lado,musculo}}
function bodyMap(o) {
  const cnt = o.mode === 'heat' || o.mode === 'hl' ? segCounts(o.ls || []) : [];
  const max = Math.max(1, ...cnt);
  const paths = SEGS.map((sg, i) => {
    const c = cnt[i] || 0; let cls = 'zone', st = '';
    if (o.mode === 'heat' && c) { cls += ' heat'; st = `style="fill:${heatColor(c / max)}"`; }
    if (o.mode === 'hl' && c) cls += ' hl';
    if (o.mode === 'pick' && o.sel && o.sel.regiao && segMatch(sg, o.sel)) cls += ' sel';
    const tip = segTip(sg) + (o.mode === 'heat' || o.mode === 'hl' ? ` · ${c} ${c === 1 ? 'lesão' : 'lesões'}` : '');
    return `<path class="${cls}" ${st} d="${sg[3]}" data-seg="${i}" data-tip="${esc(tip)}" ${o.mode === 'pick' ? `tabindex="0" role="button" aria-label="${esc(segTip(sg))}"` : ''}/>`;
  }).join('');
  return `<svg class="bodymap ${o.mode === 'pick' ? 'pick' : ''}" viewBox="0 0 900 850" role="img" aria-label="Mapa corporal">
    ${PRINT ? `<image href="${BODY}" x="0" y="0" width="900" height="807"/>` : '<use href="#bodyImg"/>'}<g>${paths}</g>
    <text class="lbl" x="225" y="838">FRENTE</text><text class="lbl" x="675" y="838">COSTAS</text>
    <text class="side-l" x="40" y="520">D</text><text class="side-l" x="410" y="520">E</text><text class="side-l" x="490" y="520">E</text><text class="side-l" x="860" y="520">D</text></svg>`;
}
// legenda do mapa de calor: pontos mais afetados
function segTop(ls, n = 8) {
  const cnt = segCounts(ls); const max = Math.max(1, ...cnt);
  return cnt.map((c, i) => [i, c]).filter(x => x[1]).sort((a, b) => b[1] - a[1]).slice(0, n).map(([i, c]) => ({ l: SEGS[i][2] + (SEGS[i][1] ? ` (${SEGS[i][1]})` : ''), r: regN(SEGS[i][0]), v: c, c: heatColor(c / max) }));
}
function injectBodyDefs() {
  const d = document.createElement('div');
  d.innerHTML = `<svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true"><defs><image id="bodyImg" href="${BODY}" x="0" y="0" width="900" height="807"/><mask id="bodyMask" maskUnits="userSpaceOnUse" x="0" y="0" width="900" height="807" style="mask-type:alpha"><use href="#bodyImg"/></mask></defs></svg>`;
  document.body.appendChild(d.firstChild);
}


// miniatura: recorte do corpo centrado na lesão, com o músculo pintado
const SEG_BB = SEGS.map(sg => { const n = sg[3].match(/-?\d+(\.\d+)?/g).map(Number); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let i = 0; i < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]); } return [x0, y0, x1, y1]; });
const NATUREZA = t => /entorse|luxa|ligament/i.test(t) ? ['Articular', 'var(--orange)'] : /fratura/i.test(t) ? ['Óssea', 'var(--purple)'] : /tendin/i.test(t) ? ['Tendínea', 'var(--blue)'] : /contus/i.test(t) ? ['Traumática', 'var(--yellow)'] : ['Muscular', 'var(--red)'];
const natTag = l => { const [n, c] = NATUREZA(l.tipo || ''); return `<span class="nat"><i style="background:${c}"></i>${n}</span>`; };
function lesThumb(l, cls = '') {
  let idx = SEGS.map((sg, i) => segMatch(sg, l) ? i : -1).filter(i => i >= 0);
  if (!idx.length) return `<span class="thumb ${cls}">${IC.body}</span>`;
  // se a região aparece na frente e nas costas, mostra a vista com mais área marcada
  const area = i => (SEG_BB[i][2] - SEG_BB[i][0]) * (SEG_BB[i][3] - SEG_BB[i][1]);
  const fr = idx.filter(i => SEG_BB[i][0] < 450), bk = idx.filter(i => SEG_BB[i][0] >= 450);
  if (fr.length && bk.length) idx = fr.reduce((s, i) => s + area(i), 0) >= bk.reduce((s, i) => s + area(i), 0) ? fr : bk;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; idx.forEach(i => { const b = SEG_BB[i]; x0 = Math.min(x0, b[0]); y0 = Math.min(y0, b[1]); x1 = Math.max(x1, b[2]); y1 = Math.max(y1, b[3]); });
  const s = Math.max(130, Math.max(x1 - x0, y1 - y0) * 1.7), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const x = Math.min(Math.max(cx - s / 2, -20), 920 - s), y = Math.min(Math.max(cy - s / 2, -20), 827 - s);
  const img = PRINT ? `<image href="${BODY}" x="0" y="0" width="900" height="807"/>` : '<use href="#bodyImg"/>';
  const hl = idx.map(i => `<path d="${SEGS[i][3]}" fill="rgba(224,52,43,.85)" stroke="#ff8a80" stroke-width="${(s / 90).toFixed(1)}"/>`).join('');
  return `<span class="thumb ${cls}" title="${esc(regLong(l))}"><svg viewBox="${x.toFixed(0)} ${y.toFixed(0)} ${s.toFixed(0)} ${s.toFixed(0)}" aria-hidden="true">${img}${hl}</svg></span>`;
}

/* ---------- tooltip / toast ---------- */
const tip = $('#tip');
document.addEventListener('mouseover', e => { const t = e.target.closest('[data-tip]'); if (t) { tip.textContent = t.dataset.tip; tip.style.opacity = 1; } });
document.addEventListener('mousemove', e => { if (tip.style.opacity === '1') { tip.style.left = Math.min(innerWidth - 250, e.clientX + 14) + 'px'; tip.style.top = (e.clientY + 14) + 'px'; } });
document.addEventListener('mouseout', e => { if (e.target.closest('[data-tip]')) tip.style.opacity = 0; });
document.addEventListener('click', () => { tip.style.opacity = 0; }, true);
let tt; function toast(m, bad) { const t = $('#toast'); t.textContent = m; t.style.background = bad ? 'var(--red)' : 'var(--g800)'; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2800); }
