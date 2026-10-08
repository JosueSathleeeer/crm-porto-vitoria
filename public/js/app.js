/* Porto Vitória · Performance Hub — código da interface (gerado a partir dos módulos em docs/fonte-modulos) */

"use strict";
window.__APP = "dm";
const dmOn = (type, fn, opt) => window.document.addEventListener(type, e => { if (window.__APP !== "min") return fn(e); }, opt);

const LOGO = PV_ASSETS[0];
const BODY = PV_ASSETS[1];
const SEED = PV_DATA.SEED;
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
const SEGS = PV_DATA.SEGS;
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
dmOn('mouseover', e => { const t = e.target.closest('[data-tip]'); if (t) { tip.textContent = t.dataset.tip; tip.style.opacity = 1; } });
dmOn('mousemove', e => { if (tip.style.opacity === '1') { tip.style.left = Math.min(innerWidth - 250, e.clientX + 14) + 'px'; tip.style.top = (e.clientY + 14) + 'px'; } });
dmOn('mouseout', e => { if (e.target.closest('[data-tip]')) tip.style.opacity = 0; });
dmOn('click', () => { tip.style.opacity = 0; }, true);
let tt; function toast(m, bad) { const t = $('#toast'); t.textContent = m; t.style.background = bad ? 'var(--red)' : 'var(--g800)'; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2800); }

/* ================= NAVEGAÇÃO ================= */
const DM_TABS = [['dashboard', 'Dashboard'], ['dm-visao', 'Visão Geral'], ['dm-lesionados', 'Atletas Lesionados'], ['dm-historico', 'Histórico de Lesões'], ['dm-regioes', 'Regiões'], ['dm-tempo', 'Tempo de Afastamento'], ['dm-comparativo', 'Comparativo']];
const NAV = [{ k: 'dm', n: 'Fisio / DM', ic: IC.med, sub: DM_TABS }, { k: 'atletas', n: 'Atletas', ic: IC.users, sub: [['atletas', 'Cadastro'], ['importar', 'Importar dados']] }];
const TITLES = { dashboard: ['Dashboard', 'Departamento médico'], atletas: ['Atletas', 'Cadastro'], importar: ['Atletas', 'Importar dados'], config: ['Configurações', ''] };
DM_TABS.forEach(([k, n]) => TITLES[k] = ['Lesões / DM', n]);
try { const v = localStorage.getItem('pv_dm_view'); if (v && TITLES[v]) S.view = v; } catch (e) { }
function go(v, arg) { S.view = v; if (arg !== undefined) UI.histAtleta = arg; try { localStorage.setItem('pv_dm_view', v); } catch (e) { } render(); $('#content').scrollTop = 0; }

function renderSide() {
  const item = n => {
    const active = S.view === n.k || (n.sub && n.sub.some(s => s[0] === S.view));
    const isUp = n.up || n.k === 'config';
    return `<div class="nav-item ${isUp ? 'nav-item-up' : ''}"><button class="nav-btn ${active ? 'active' : ''}" data-go="${n.sub ? n.sub[0][0] : n.k}" aria-label="${n.n}">${n.ic}</button>
    <div class="nav-fly ${isUp ? 'nav-fly-up' : ''}" style="${isUp ? 'top:auto!important;bottom:8px!important;' : ''}"><div class="fly-title">${n.n}</div>${n.sub ? n.sub.map(s => `<button data-go="${s[0]}" class="${S.view === s[0] ? 'active' : ''}">${s[1]}</button>`).join('') : `<button data-go="${n.k}" class="${active ? 'active' : ''}">Abrir ${n.n.toLowerCase()}</button>`}</div></div>`;
  };
  $('#side').innerHTML = `<div class="brand"><img src="${LOGO}" alt="Porto Vitória"></div>${NAV.map(item).join('')}<div class="spacer"></div>
   ${item({ k: 'config', n: 'Configurações', ic: IC.gear, up: true })}
   <div class="nav-item nav-item-up"><button class="nav-btn" data-act="theme" aria-label="Alternar tema claro/escuro">${IC.moon}</button><div class="nav-fly nav-fly-up" style="top:auto!important;bottom:8px!important;"><div class="fly-title">Tema</div><button data-act="theme">Alternar claro / escuro</button></div></div>`;
}
function renderTop() {
  const [t, s] = TITLES[S.view] || ['', ''];
  const anos = [...new Set([String(new Date().getFullYear()), ...S.lesoes.map(l => l.data.slice(0, 4))])].sort().reverse();
  const showF = !S.view.startsWith('config') && S.view !== 'importar';
  $('#topbar').innerHTML = `<div class="crumb">${t} ${s ? `<small>· ${s}</small>` : ''}</div>
  ${showF ? `<div class="flt"><label for="fC">Categoria</label><select id="fC"><option>Todas</option>${Object.keys(GRUPOS).map(c => `<option ${c === F.categoria ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
  ${F.categoria !== 'Todas' ? `<div class="flt"><label for="fS">Sub</label><select id="fS"><option value="Todas">Todas</option>${GRUPOS[F.categoria].map(c => `<option ${c === F.sub ? 'selected' : ''}>${c}</option>`).join('')}</select></div>` : ''}
  ${S.view !== 'atletas' ? `<div class="flt"><label for="fA">Temporada</label><select id="fA"><option>Todos</option>${anos.map(a => `<option ${a === F.ano ? 'selected' : ''}>${a}</option>`).join('')}</select></div><div class="flt"><label for="fP">Período</label><select id="fP">${PERIODOS.map(([k, n]) => `<option value="${k}" ${k === (F.periodo || 'ano') ? 'selected' : ''}>${n}</option>`).join('')}</select></div>` : ''}` : ''}
  ${!S.view.startsWith('config') && S.view !== 'importar' ? `<button class="btn sm" data-act="print-menu">${IC.print} Imprimir / PDF</button>` : ''}
  ${S.view.startsWith('mon-be') ? `<button class="btn sm pri" data-act="be-lancar">${IC.plus} Lançar bem-estar</button>` : S.view.startsWith('mon-pse') ? `<button class="btn sm pri" data-act="pse-lancar">${IC.plus} Lançar PSE</button>` : S.view === 'pl-macro' ? `<button class="btn sm pri" data-act="macro-novo">${IC.plus} Novo bloco</button>` : S.view === 'pl-plano' ? `<button class="btn sm pri" data-act="plano-novo">${IC.plus} Novo plano</button>` : S.view === 'pl-micro' ? '' : S.view.startsWith('av-') ? `<button class="btn sm pri" data-act="av-nova">${IC.plus} Nova sessão de testes</button>` : S.view.startsWith('mat-') ? `<button class="btn sm pri" data-act="mat-nova">${IC.plus} Nova medição</button>` : S.view.startsWith('nut-') ? (S.view === 'nut-hidra' ? `<button class="btn sm pri" data-act="nova-hid">${IC.plus} Nova sessão</button>` : `<button class="btn sm pri" data-act="nova-av">${IC.plus} Nova avaliação</button>`) : !S.view.startsWith('config') ? `<button class="btn sm pri" data-act="nova-lesao">${IC.plus} Registrar lesão</button>` : ''}
  <span class="sync ${S.online ? 'ok' : ''}" title="${S.online ? 'Dados sincronizados na nuvem' : 'Dados salvos neste navegador'}"><i></i>${S.online ? (window.PV_SERVER ? 'Salvo no banco de dados' : 'Sincronizado') : 'Local'}</span>`;
  const bind = (id, k) => { const e = $('#' + id); if (e) e.onchange = () => { F[k] = e.value; if (k === 'categoria') F.sub = 'Todas'; try { localStorage.setItem('pv_dm_filtro', JSON.stringify(F)); } catch (x) { } render(); }; };
  bind('fC', 'categoria'); bind('fS', 'sub'); bind('fA', 'ano'); bind('fP', 'periodo');
}
function render() {
  if (!S.ready) return;
  renderSide(); renderTop();
  const v = { atletas: vAtletas, importar: vImportar, inicio: vInicio, notif: vNotif, cal: vCal, minc: vMinc, 'atl-mapa': vMapa }[S.view] || (S.view.startsWith('config') ? vConfig : S.view.startsWith('mon-') ? vMon : S.view.startsWith('pl-') ? vPlan : S.view.startsWith('nut-') ? vNut : S.view.startsWith('av-') ? vAval : S.view.startsWith('mat-') ? vMat : vDM);
  const ct = $('#content'); const st = ct.scrollTop;
  ct.innerHTML = `<div class="report">${v()}${S.view.startsWith('config') ? '' : footer()}</div>`; ct.scrollTop = st;
  $$('[data-fl]').forEach(el => { if (el.tagName === 'SELECT') el.value = UI.fl[el.dataset.fl]; });
}
const footer = () => { const nut = S.view.startsWith('nut-'); return `<div class="rfoot"><img src="${LOGO}" alt=""><div class="club"><b>PORTO VITÓRIA</b><span>Departamento de Futebol de Base · ${nut ? 'Nutrição Esportiva' : S.view.startsWith('av-') ? 'Avaliação Física' : S.view.startsWith('mat-') ? 'Maturação' : S.view === 'inicio' || S.view === 'notif' || S.view === 'cal' ? 'Performance Hub' : S.view === 'minc' ? 'Minutagem' : S.view.startsWith('mon-') ? 'Monitoramento' : S.view.startsWith('pl-') ? 'Planejamento' : 'Fisioterapia'}</span></div><div class="leg">${S.view.startsWith('av-') || S.view.startsWith('mat-') || S.view.startsWith('mon-') || S.view.startsWith('pl-') || S.view === 'inicio' || S.view === 'notif' || S.view === 'cal' || S.view === 'minc' ? '' : nut ? Object.values(FAIXAS).map(f => `<span><span class="sq" style="background:${f[1]}"></span>${f[0]}</span>`).join('') + `<span class="muted">Faixa-alvo de gordura: ${alvo().min}–${alvo().max}%</span>` : ORDER.map(s => `<span><span class="sq" style="background:${SCOL[s]}"></span><b style="color:var(--ink)">${STATUS[s]}:</b> ${STATUS_DESC[s]}</span>`).join('')}</div></div>`; };
const btnAtleta = pri => `<button class="btn ${pri ? 'pri' : ''}" data-act="novo-atleta">${IC.plus} Cadastrar atleta</button>`;
const noData = () => S.atletas.length ? '' : `<div class="empty" style="margin-bottom:16px"><h3>Nenhum atleta cadastrado ainda</h3>Cadastre o elenco para começar a registrar lesões no DM.<div class="acts">${btnAtleta(true)}<button class="btn" data-go="importar">${IC.upload} Importar planilha</button><button class="btn" data-act="seed">Carregar dados de exemplo</button></div></div>`;
const hdrItems = () => [['cal', 'Temporada', anoLabel()], ['clock', 'Atualizado em', fmtD(todayISO())]];

/* ================= DASHBOARD ================= */
function fDashboard() {
  const ats = atletasCat(), at = lesAtivas(), lp = lesPeriodo();
  const noDM = new Set(at.map(l => l.atletaId)).size, disp = ats.length - noDM;
  const prox = [...at].sort((a, b) => (a.previsao || '9').localeCompare(b.previsao || '9'));
  const cats = Object.keys(GRUPOS).filter(c => S.atletas.some(a => a.categoria === c));
  const porCat = cats.map(c => { const as = S.atletas.filter(a => a.categoria === c); const fora = new Set(S.lesoes.filter(l => l.status !== 'liberado' && as.some(a => a.id === l.atletaId)).map(l => l.atletaId)).size; return { l: c, v: (as.length - fora) / as.length * 100, t: `${as.length - fora}/${as.length}`, p: pct(as.length - fora, as.length) }; });
  return `
  <div class="kpis k5">
    ${kpi('users', 'Elenco', ats.length, F.categoria === 'Todas' ? 'Todas as categorias' : catLabel())}
    ${kpi('check', 'Disponíveis', disp, pct(disp, ats.length) + ' do elenco')}
    ${kpi('med', 'No DM agora', noDM, pct(noDM, ats.length) + ' do elenco', 'red')}
    ${kpi('band', 'Lesões na temporada', lp.length, 'Temporada ' + anoLabel(), 'gold')}
    ${kpi('cal', 'Dias de afastamento', lp.reduce((s, l) => s + diasFora(l), 0), 'Acumulado na temporada')}
  </div>
  <div class="row r21">
    ${panel('Quem está no DM', prox.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Pos.</th><th class="l">Lesão</th><th class="l">Região</th><th>Dias fora</th><th>Status</th><th>Previsão de retorno</th></tr></thead><tbody>${prox.map(l => { const a = atl(l.atletaId); return `<tr class="click" data-open-les="${l.id}"><td class="l">${athCell(a)}</td><td>${ptag(a?.posicao)}</td><td class="l">${esc(lesNome(l))}</td><td class="l">${esc(regFull(l))}</td><td><b>${diasFora(l)}</b> dias</td><td>${chip(l.status)}</td><td>${fmtD(l.previsao)}</td></tr>`; }).join('')}</tbody></table></div>` : miniEmpty('DM vazio', 'Nenhum atleta lesionado nesta categoria.'), { np: true, r: `<button data-go="dm-lesionados">Ver todos</button>` })}
    ${panel('Mapa de lesões da temporada', bodyMap({ mode: 'heat', ls: lp }) + `<div class="heatbar">menos<i></i>mais lesões</div>`)}
  </div>
  <div class="row r2">
    ${panel('Disponibilidade por categoria', dist(porCat))}
    ${panel('Lesões por mês · ' + anoLabel(), lineChart(MESES, MESES.map((_, i) => lp.filter(l => +l.data.slice(5, 7) === i + 1).length), { label: 'Lesões por mês' }))}
  </div>`;
}

/* ================= ATLETAS ================= */
function vAtletas() {
  const q = UI.atBusca.toLowerCase();
  const base = atletasCat();
  const list = base.filter(a => (!q || (a.nome + ' ' + (a.apelido || '')).toLowerCase().includes(q)) && (UI.atPos === 'Todas' || a.posicao === UI.atPos));
  const grupos = POS.map(p => [p, list.filter(a => a.posicao === p).sort((a, b) => a.nome.localeCompare(b.nome))]).filter(g => g[1].length);
  return `<div class="page-h"><h2>Atletas</h2><span class="muted">${base.length} atleta(s) · ${catLabel().toLowerCase()}</span><span class="sp"></span><input class="search" id="atBusca" placeholder="Buscar atleta" value="${esc(UI.atBusca)}" aria-label="Buscar atleta"><button class="btn" data-go="importar">${IC.upload} Importar</button><button class="btn danger" data-act="limpar-menu">${IC.trash} Limpar dados</button>${btnAtleta(true)}</div>
  <nav class="subtabs"><button class="on" data-go="atletas">Cadastro</button><button data-go="importar">Importar dados</button></nav>
  <div class="pos-tabs">${['Todas', ...POS].map(p => `<button class="chip ${UI.atPos === p ? 'on' : ''}" data-pos="${p}">${p !== 'Todas' ? `<i style="width:10px;height:10px;border-radius:50%;display:inline-block;background:${PC1[p]}"></i>` : ''}${p === 'Todas' ? 'Todas' : POSN[p]}</button>`).join('')}</div>
  ${UI.selMode ? `<div class="selbar"><label class="chk"><input type="checkbox" id="selAll" ${list.length && list.every(a => UI.sel.has(a.id)) ? 'checked' : ''}>Selecionar todos da lista (${list.length})</label><span class="muted">${UI.sel.size} selecionado(s)</span><span style="flex:1"></span><button class="btn" data-act="sel-cancel">Cancelar</button><button class="btn red" data-act="sel-del" ${UI.sel.size ? '' : 'disabled'}>${IC.trash} Excluir selecionados</button></div>` : ''}
  ${noData()}
  ${grupos.length ? grupos.map(([p, g]) => `<h3 style="font-family:var(--fc);font-size:20px;margin:18px 0 8px;display:flex;align-items:center;gap:8px">${ptag(p)} ${POSN[p]}s <span class="muted" style="font-size:14px">(${g.length})</span></h3>
  <div class="athgrid">${g.map(a => { const at = ativaDe(a.id); const n = S.lesoes.filter(l => l.atletaId === a.id).length; return `<div class="athc ${UI.selMode && UI.sel.has(a.id) ? 'picked' : ''}">${UI.selMode ? `<input type="checkbox" class="selchk" data-sel="${a.id}" ${UI.sel.has(a.id) ? 'checked' : ''} aria-label="Selecionar ${esc(a.nome)}">` : ''}${ava(a)}<div class="i"><b>${a.numero ? esc(a.numero) + ' · ' : ''}${esc(a.apelido || a.nome)}${subTag(a)}</b><span>${esc(a.posDetalhe || POSN[a.posicao] || '')} · Pé ${esc(a.pe || '—')}</span><span>${[idade(a.nascimento) !== '' ? idade(a.nascimento) + ' anos' : '', a.altura ? nf(a.altura, 2) + ' m' : '', a.peso ? nf(a.peso, 1) + ' kg' : '', a.gordura ? nf(a.gordura, 1) + '%\u00a0G' : ''].filter(Boolean).join(' · ') || '&nbsp;'}</span>${a.avData ? `<span class="avtag">${IC.apple} Avaliado em ${fmtD(a.avData)}</span>` : ''}<span style="margin-top:4px">${at ? chip(at.status) : '<span class="st st-ok">Disponível</span>'} <span class="muted" style="font-size:12px;display:inline">${n} lesão(ões)</span></span></div>
  <div class="acts"><div><button class="icon-btn" data-act="hist" data-id="${a.id}" title="Histórico" aria-label="Histórico de ${esc(a.nome)}">${IC.hist}</button><button class="icon-btn" data-act="lesao-atleta" data-id="${a.id}" title="Registrar lesão" aria-label="Registrar lesão de ${esc(a.nome)}">${IC.plus}</button></div><div><button class="icon-btn" data-act="edit-atleta" data-id="${a.id}" aria-label="Editar ${esc(a.nome)}">${IC.edit}</button><button class="icon-btn" data-act="del-atleta" data-id="${a.id}" aria-label="Excluir ${esc(a.nome)}" style="color:var(--red)">${IC.trash}</button></div></div></div>`; }).join('')}</div>`).join('') : S.atletas.length ? `<div class="empty"><h3>Nenhum atleta encontrado</h3>Ajuste a busca, a posição ou a categoria.</div>` : ''}`;
}

/* ================= DM ================= */
const DM_TITLE = { dashboard: 'PAINEL DO DM', 'dm-visao': 'VISÃO GERAL DO DM', 'dm-lesionados': 'ATLETAS LESIONADOS', 'dm-historico': 'HISTÓRICO DE LESÕES', 'dm-regioes': 'LESÕES POR REGIÃO', 'dm-tempo': 'TEMPO DE AFASTAMENTO', 'dm-comparativo': 'COMPARATIVO' };
function vDM() {
  const body = { dashboard: fDashboard, 'dm-visao': fVisao, 'dm-lesionados': fLesionados, 'dm-historico': fHistorico, 'dm-regioes': fRegioes, 'dm-tempo': fTempo, 'dm-comparativo': fComparativo }[S.view] || fVisao;
  if (PRINT) return header({ title: DM_TITLE[S.view], items: hdrItems() }) + `<div style="height:16px"></div>` + body();
  return header({ title: DM_TITLE[S.view], items: hdrItems() }) + `<nav class="rtabs">${DM_TABS.map(([k, n]) => `<button data-go="${k}" class="${S.view === k ? 'on' : ''}">${n}</button>`).join('')}</nav>` + noData() + body();
}
function tabela(ls, opts = {}) {
  if (!ls.length) return miniEmpty('Nenhuma lesão aqui', 'Use “Registrar lesão” para cadastrar um caso.');
  return `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Pos.</th><th class="l">Lesão</th><th class="l">Região</th><th>Data da lesão</th><th>Dias afastado</th><th>Status</th><th>Previsão retorno</th></tr></thead><tbody>
  ${ls.map(l => { const a = atl(l.atletaId); return `<tr class="click ${opts.sel && UI.selLes === l.id ? 'rowsel' : ''}" data-${opts.sel ? 'sel-les' : 'open-les'}="${l.id}"><td class="l">${athCell(a)}</td><td>${ptag(a?.posicao)}</td><td class="l">${esc(lesNome(l))}${l.recorrente ? ' <span title="Recorrente" style="color:var(--red);font-weight:800">●</span>' : ''}</td><td class="l">${esc(regFull(l))}</td><td>${fmtD(l.data)}</td><td><b>${diasFora(l)}</b> dias</td><td>${chip(l.status)}</td><td>${fmtD(l.previsao)}</td></tr>`; }).join('')}</tbody></table></div>`;
}
function fVisao() {
  const lp = lesPeriodo(), ats = atletasCat(), at = lesAtivas();
  const atlLes = new Set(lp.map(l => l.atletaId)).size, dias = lp.reduce((s, l) => s + diasFora(l), 0);
  const ids = idsCat(); const lpPrev = F.ano === 'Todos' ? [] : S.lesoes.filter(l => ids.has(l.atletaId) && l.data.startsWith(String(+F.ano - 1)));
  const delta = lpPrev.length ? Math.round((lp.length - lpPrev.length) / lpPrev.length * 100) : null;
  const rec = lp.filter(l => l.recorrente).length, cir = lp.filter(l => l.cirurgia).length, emTrat = new Set(at.map(l => l.atletaId)).size;
  const grupos = GRUPOS_REG.map((g, i) => ({ l: g, v: lp.filter(l => REG[l.regiao]?.[1] === g).length, c: ['#e0342b', '#f6c21c', '#1b8a4a', '#2f6fd6'][i] }));
  const top = sortEnt(countBy(lp, l => regN(l.regiao))).slice(0, 5);
  const stats = ['tratamento', 'transicao', 'retorno'].map(s => ({ l: STATUS[s], v: new Set(at.filter(l => l.status === s).map(l => l.atletaId)).size, c: SCOL[s] }));
  const mediaDM = at.length ? at.reduce((s, l) => s + diasFora(l), 0) / at.length : 0;
  const tipos = sortEnt(countBy(lp, l => l.tipo));
  return `<div class="kpis">
    ${kpi('med', 'Lesões no período', lp.length, delta !== null ? `<span class="${delta > 0 ? 'up' : 'down'}">${delta > 0 ? '▲' : '▼'} ${Math.abs(delta)}%</span> vs temporada anterior` : 'Total de lesões')}
    ${kpi('user', 'Atletas lesionados', atlLes, pct(atlLes, ats.length) + ' do elenco')}
    ${kpi('cal', 'Dias de afastamento', dias, 'Média ' + nf(lp.length ? dias / lp.length : 0) + ' dias por lesão')}
    ${kpi('cross', 'Lesões recorrentes', rec, pct(rec, lp.length) + ' do total', 'red')}
    ${kpi('scalpel', 'Cirurgias', cir, pct(cir, lp.length) + ' do total')}
    ${kpi('clock', 'Em tratamento (DM)', emTrat, pct(emTrat, ats.length) + ' do elenco', 'blue')}
  </div>
  <div class="row r4">
    ${panel('Evolução de lesões por mês', lineChart(MESES, MESES.map((_, i) => lp.filter(l => +l.data.slice(5, 7) === i + 1).length), { label: 'Lesões por mês', w: 420 }))}
    ${panel('Distribuição por região', `<div class="donut-wrap">${donut(grupos, lp.length, 'LESÕES', 160)}${legend(grupos)}</div>`)}
    ${panel('Top 5 regiões', dist(top.map(([r, n], i) => ({ l: r, v: n, p: pct(n, lp.length), c: i < 2 ? 'linear-gradient(90deg,#b8221b,var(--red))' : 'linear-gradient(90deg,#d77412,var(--orange))' }))))}
    ${panel('Status dos atletas (DM)', `<div class="donut-wrap">${donut(stats, emTrat, 'ATLETAS', 160)}${legend(stats)}</div><div class="mini-stats" style="grid-template-columns:1fr;margin-top:12px"><div><span>Média de dias no DM</span><b>${nf(mediaDM)} dias</b></div></div>`)}
  </div>
  <div class="row r21">
    ${panel('Lesões recentes', tabela([...lp].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 7)), { np: true, r: `<button data-go="dm-lesionados">Ver atletas lesionados</button>` })}
    ${panel('Tipos de lesão', dist(tipos.map(([t, n]) => ({ l: t, v: n, p: pct(n, lp.length) }))) + (lp.length ? `<p style="text-align:center;margin:14px 0 0;font-family:var(--fc);font-size:18px">TOTAL: <b>${lp.length}</b> LESÕES</p>` : ''))}
  </div>`;
}
function fLesionados() {
  const ids = idsCat(), f = UI.fl, q = f.busca.toLowerCase();
  let ls = S.lesoes.filter(l => ids.has(l.atletaId));
  ls = f.status === 'ativos' ? ls.filter(l => l.status !== 'liberado') : f.status === 'todos' ? ls.filter(l => noPeriodo(l.data)) : ls.filter(l => l.status === f.status);
  if (f.regiao) ls = ls.filter(l => l.regiao === f.regiao);
  if (f.tipo) ls = ls.filter(l => l.tipo === f.tipo);
  if (q) ls = ls.filter(l => ((atl(l.atletaId)?.nome || '') + ' ' + (atl(l.atletaId)?.apelido || '')).toLowerCase().includes(q));
  ls.sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status) || b.data.localeCompare(a.data));
  if (!ls.find(l => l.id === UI.selLes)) UI.selLes = ls[0]?.id || null;
  const at = lesAtivas(), ats = atletasCat(); const n = s => new Set(at.filter(l => l.status === s).map(l => l.atletaId)).size; const noDM = new Set(at.map(l => l.atletaId)).size;
  const regs = [...new Set(S.lesoes.map(l => l.regiao))].sort((a, b) => regN(a).localeCompare(regN(b)));
  return `<div class="kpis">
    ${kpi('user', 'Atletas no DM', noDM, pct(noDM, ats.length) + ' do elenco')}
    ${kpi('band', 'Lesões ativas', at.length, 'Em acompanhamento')}
    ${kpi('cal', 'Dias de afastamento', at.reduce((s, l) => s + diasFora(l), 0), 'Somando as lesões ativas')}
    ${kpi('clock', 'Em tratamento', n('tratamento'), pct(n('tratamento'), ats.length) + ' do elenco', 'red')}
    ${kpi('run', 'Transição', n('transicao'), pct(n('transicao'), ats.length) + ' do elenco', 'gold')}
    ${kpi('cycle', 'Retorno gradual', n('retorno'), pct(n('retorno'), ats.length) + ' do elenco')}
  </div>
  <div class="row r21" style="align-items:start">
    <div class="panel"><div class="ph">Lista de lesões<span class="r">${ls.length} ${ls.length === 1 ? 'registro' : 'registros'}</span></div>
      <div class="fbar">
        <div class="f"><label>Status</label><select data-fl="status"><option value="ativos">Ativos (no DM)</option>${ORDER.map(s => `<option value="${s}">${STATUS[s]}</option>`).join('')}<option value="todos">Todas da temporada</option></select></div>
        <div class="f"><label>Região</label><select data-fl="regiao"><option value="">Todas</option>${regs.map(r => `<option value="${r}">${regN(r)}</option>`).join('')}</select></div>
        <div class="f"><label>Tipo de lesão</label><select data-fl="tipo"><option value="">Todos</option>${S.config.tipos.map(t => `<option>${esc(t)}</option>`).join('')}</select></div>
        <div class="f"><label>Buscar atleta</label><input data-fl="busca" placeholder="Nome" value="${esc(f.busca)}"></div>
        <button class="btn" data-act="limpar-fl">${IC.cycle} Limpar</button>
      </div>
      ${tabela(ls, { sel: true })}
    </div>
    <div class="panel" id="detPanel">${detalhe(S.lesoes.find(l => l.id === UI.selLes))}</div>
  </div>`;
}
function steps(l) {
  const keys = ['lesao', 'tratamento', 'transicao', 'retorno', 'liberado'], names = ['Lesão', 'Tratamento', 'Transição', 'Retorno', 'Liberado'];
  const cur = keys.indexOf(l.status);
  return `<div class="steps">${keys.map((k, i) => { const d = k === 'lesao' ? l.data : l.statusDatas?.[k]; const cls = i < cur || (k === 'liberado' && l.status === 'liberado') ? 'done' : i === cur ? 'cur' : ''; return `<div class="s ${cls}"><i>${cls === 'done' ? '✓' : ''}</i><b>${names[i]}</b>${d ? fmtDs(d) : '—'}</div>`; }).join('')}</div>`;
}
function detalhe(l) {
  if (!l) return `<div class="ph">Detalhes da lesão</div><div class="pb">${miniEmpty('Nenhuma lesão selecionada', 'Clique em uma linha da tabela.')}</div>`;
  const a = atl(l.atletaId), nx = ORDER[ORDER.indexOf(l.status) + 1];
  const rows = [['Lesão', esc(lesNome(l))], ['Região', esc(regFull(l))], ['Ponto exato', esc(l.musculo || '—')], ['Data da lesão', fmtD(l.data)], ['Local', esc(l.local)], ['Mecanismo', esc(l.mecanismo)], ['Dor (EVA)', `${l.dor ?? '—'}/10`], ['Dias afastado', `<b>${diasFora(l)}</b> dias`], ['Previsão retorno', fmtD(l.previsao)], ['Condutas', esc((l.tratamentos || []).join(', ') || '—')], ['Exames', esc(l.exames || '—')], ['Cirurgia', l.cirurgia ? 'Sim' : 'Não'], ['Recorrente', l.recorrente ? '<b style="color:var(--red)">Sim</b>' : 'Não'], ['Responsável', esc(l.responsavel || '—')], ['Status atual', chip(l.status)]];
  return `<div class="ph">Detalhes da lesão</div><div class="pb">
  <div class="det-head">${ava(a)}<div><b>${esc(a?.apelido || a?.nome)}${subTag(a)}</b><span class="muted">${a?.numero ? '#' + esc(a.numero) + ' · ' : ''}${esc(a?.categoria || '')} · ${idade(a?.nascimento)} anos</span></div><span style="margin-left:auto">${ptag(a?.posicao)}</span></div>
  <div class="det-loc">${lesThumb(l, 'lg')}<div><h4 style="margin:0 0 4px;font:800 16px var(--fc);text-transform:uppercase">${esc(lesNome(l))}</h4><div style="font-size:13.5px">${esc(regLong(l))}</div><div style="margin-top:4px">${natTag(l)}</div></div></div>
  <div class="det-sec"><h4>Evolução</h4>${steps(l)}</div>
  <div class="det-sec"><h4>Informações da lesão</h4>${rows.map(([k, v]) => `<div class="det-row"><span>${k}</span><div>${v}</div></div>`).join('')}</div>
  ${l.descricao ? `<div class="det-sec"><h4>Descrição</h4><p style="margin:0;font-size:13.5px">${esc(l.descricao)}</p></div>` : ''}
  ${l.obs ? `<div class="det-sec"><h4>Observações</h4><p style="margin:0;font-size:13.5px">${esc(l.obs)}</p></div>` : ''}
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    ${nx ? `<button class="btn pri" data-act="avancar" data-id="${l.id}">${IC.next} ${nx === 'liberado' ? 'Liberar atleta' : 'Avançar para ' + STATUS[nx]}</button>` : ''}
    <button class="btn" data-act="edit-lesao" data-id="${l.id}">${IC.edit} Editar</button>
    <button class="btn" data-act="hist" data-id="${l.atletaId}">${IC.hist} Histórico</button>
    <button class="btn danger" data-act="del-lesao" data-id="${l.id}" aria-label="Excluir lesão">${IC.trash}</button>
  </div></div>`;
}
function fHistorico() {
  const ats = atletasCat().sort((a, b) => a.nome.localeCompare(b.nome));
  if (!UI.histAtleta || !atl(UI.histAtleta)) { const c = countBy(S.lesoes.filter(l => idsCat().has(l.atletaId)), l => l.atletaId); UI.histAtleta = sortEnt(c)[0]?.[0] || ats[0]?.id; }
  const a = atl(UI.histAtleta);
  if (!a) return `<div class="empty"><h3>Nenhum atleta</h3>Cadastre atletas para ver o histórico.</div>`;
  const ls = S.lesoes.filter(l => l.atletaId === a.id).sort((x, y) => y.data.localeCompare(x.data));
  const dias = ls.reduce((s, l) => s + diasFora(l), 0), at = ativaDe(a.id), recs = ls.filter(l => l.recorrente).length;
  const regC = sortEnt(countBy(ls, l => regN(l.regiao)));
  const lsAno = ls.filter(l => noPeriodo(l.data));
  const meses = MESES.map((_, i) => lsAno.filter(l => +l.data.slice(5, 7) === i + 1).reduce((s, l) => s + diasFora(l), 0));
  const prevTxt = at && at.previsao ? (dayDiff(todayISO(), at.previsao) >= 0 ? 'Em ' + dayDiff(todayISO(), at.previsao) + ' dias' : 'Previsão vencida há ' + -dayDiff(todayISO(), at.previsao) + ' dias') : 'Sem afastamento ativo';
  return `<div class="ind-top">
    <div class="panel"><div class="ph">Atleta</div><div class="bio">${ava(a, 'lg')}<div style="min-width:0">${ptag(a.posicao)}${subTag(a)}<h3>${esc(a.apelido || a.nome)}</h3><div class="muted">${esc(a.nome)}</div></div></div>
      <div class="bio2"><div><span>Categoria</span><b>${esc(a.categoria)}${a.subcategoria ? ' · ' + esc(a.subcategoria) : ''}</b></div><div><span>Idade</span><b>${idade(a.nascimento) || '—'} anos</b></div><div><span>Nascimento</span><b>${fmtD(a.nascimento)}</b></div><div><span>Altura · Peso</span><b>${a.altura ? nf(a.altura, 2) + ' m' : '—'} · ${a.peso ? a.peso + ' kg' : '—'}</b></div><div><span>Pé dominante</span><b>${esc(a.pe || '—')}</b></div>${a.gordura ? `<div><span>% de gordura</span><b>${nf(a.gordura, 1)}%${a.avData ? ' <small class="muted" style="font:500 12px var(--fb)">(' + fmtDs(a.avData) + ')</small>' : ''}</b></div>` : ''}</div>
      <div class="pb" style="border-top:1px solid var(--line)"><div class="f"><label for="histSel">Trocar atleta</label><select id="histSel">${ats.map(x => `<option value="${x.id}" ${x.id === a.id ? 'selected' : ''}>${esc(x.nome)} (${esc(x.categoria)})</option>`).join('')}</select></div></div></div>
    <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
      <div class="kpis k4" style="margin:0">
        ${kpi('med', 'Total de lesões', ls.length, 'Histórico completo')}
        ${kpi('cal', 'Dias afastado', dias + '<small>dias</small>', 'Média ' + nf(ls.length ? dias / ls.length : 0) + ' por lesão')}
        ${kpi('clock', 'Situação atual', at ? STATUS[at.status] : 'Disponível', at ? 'Desde ' + fmtD(at.data) : ls[0] ? 'Última lesão em ' + fmtD(ls[0].data) : 'Sem lesões registradas', at ? 'red' : '', 'txt')}
        ${kpi('cycle', 'Retorno previsto', at ? fmtD(at.previsao) : '—', prevTxt, '', 'txt')}
      </div>
      <div class="row r12" style="margin:0">
        ${panel('Regiões afetadas', bodyMap({ mode: 'hl', ls }))}
        <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
          ${panel('Resumo do histórico', `<div class="mini-stats"><div><span>Total de lesões</span><b>${ls.length}</b></div><div><span>Dias afastado</span><b>${dias}</b></div><div><span>Média por lesão</span><b>${nf(ls.length ? dias / ls.length : 0)}</b></div><div><span>Recorrências</span><b>${recs}</b></div></div><div style="margin-top:14px">${dist(regC.map(([r, n]) => ({ l: r, v: n, p: pct(n, ls.length) })))}</div>`)}
          ${panel('Dias afastados por mês · ' + anoLabel(), vbars(MESES, meses, { w: 520 }))}
        </div>
      </div>
    </div>
  </div>
  ${panel('Histórico de lesões', ls.length ? ls.map((l, i) => `<div class="hist-item ${i === 0 ? 'open' : ''}">
    <button class="hist-h" data-toggle aria-expanded="${i === 0}">${lesThumb(l)}<span><b>${esc(lesNome(l))}</b><small>${esc(regLong(l))}</small><small>${natTag(l)}${l.recorrente ? ' <span style="color:var(--red);font-weight:700">· Recorrente</span>' : ''}</small></span><span class="hsm"><b>${fmtD(l.data)}</b><small>${l.local === 'Jogo' ? 'Durante o jogo' : l.local === 'Treino' ? 'Durante o treino' : 'Fora do clube'}</small></span><span><b>${diasFora(l)} dias</b><small>afastado</small></span><span class="hmd"><small>${esc((l.tratamentos || []).slice(0, 3).join(' · ') || '—')}</small></span><span class="hmd"><b>${fmtD(l.statusDatas?.liberado || l.previsao)}</b><small>${l.status === 'liberado' ? 'Retornou' : 'Previsto'}</small></span><span class="hsm">${chip(l.status)}</span><span class="chev">${IC.chev}</span></button>
    <div class="hist-b"><div><h5>Mecanismo</h5><p>${esc(l.mecanismo)}</p><h5>Dor (EVA)</h5><p>${l.dor ?? '—'}/10</p></div><div><h5>Descrição</h5><p>${esc(l.descricao || '—')}</p></div><div><h5>Exames realizados</h5><p>${esc(l.exames || '—')}</p><h5>Cirurgia</h5><p>${l.cirurgia ? 'Sim' : 'Não'}</p></div><div><h5>Observações</h5><p>${esc(l.obs || '—')}</p><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm" data-act="edit-lesao" data-id="${l.id}">${IC.edit} Editar</button>${l.status !== 'liberado' ? `<button class="btn sm pri" data-act="avancar" data-id="${l.id}">${IC.next} Avançar</button>` : ''}</div></div></div>
  </div>`).join('') : miniEmpty('Sem lesões registradas', 'Este atleta não teve passagem pelo DM.'), { np: true, r: `<button data-act="print-ind" data-id="${a.id}">Relatório individual</button> <button data-act="lesao-atleta" data-id="${a.id}">+ Nova lesão</button>` })}`;
}
function fRegioes() {
  const lp = lesPeriodo(), tot = lp.length, dias = lp.reduce((s, l) => s + diasFora(l), 0);
  const byR = sortEnt(countBy(lp, l => l.regiao)); const main = byR.slice(0, 7), rest = byR.slice(7);
  const rows = main.map(([r, n], i) => { const ls = lp.filter(l => l.regiao === r); const d = ls.reduce((s, l) => s + diasFora(l), 0); return { r: regN(r), n, d, m: d / n, at: new Set(ls.map(l => l.atletaId)).size, c: PAL[i] }; });
  if (rest.length) { const ls = lp.filter(l => rest.some(([r]) => r === l.regiao)); const d = ls.reduce((s, l) => s + diasFora(l), 0); rows.push({ r: 'Outras regiões', n: ls.length, d, m: d / ls.length, at: new Set(ls.map(l => l.atletaId)).size, c: '#8a948f' }); }
  const emTrat = new Set(lesAtivas().map(l => l.atletaId)).size, afet = new Set(lp.map(l => l.atletaId)).size;
  const now = new Date(); const endM = F.ano === String(now.getFullYear()) ? now.getMonth() : 11; const ms = []; for (let m = Math.max(0, endM - 5); m <= endM; m++) ms.push(m);
  const topR = byR.slice(0, 5).map(x => x[0]);
  const series = topR.map((r, i) => ({ l: regN(r), c: PAL[i], vals: ms.map(m => lp.filter(l => l.regiao === r && +l.data.slice(5, 7) === m + 1).length) }));
  series.push({ l: 'Outras', c: '#8a948f', vals: ms.map(m => lp.filter(l => !topR.includes(l.regiao) && +l.data.slice(5, 7) === m + 1).length) });
  const top = segTop(lp);
  return `<div class="kpis k5">
    ${kpi('globe', 'Total de lesões', tot, 'Temporada ' + anoLabel())}
    ${kpi('user', 'Atletas afetados', afet, pct(afet, atletasCat().length) + ' do elenco')}
    ${kpi('cal', 'Dias afastados', dias, 'Média ' + nf(tot ? dias / tot : 0) + ' dias por lesão')}
    ${kpi('clock', 'Em tratamento (DM)', emTrat, pct(emTrat, atletasCat().length) + ' do elenco')}
    ${kpi('bars', 'Região mais afetada', byR[0] ? regN(byR[0][0]) : '—', byR[0] ? `${byR[0][1]} lesões (${pct(byR[0][1], tot)})` : 'Sem lesões', '', 'txt')}
  </div>
  <div class="row r2">
    ${panel('Mapa de lesões por região', `<div style="display:grid;grid-template-columns:1fr 200px;gap:14px;align-items:center">${bodyMap({ mode: 'heat', ls: lp })}<div class="legend">${top.map(x => `<div class="li"><span class="sw" style="background:${x.c}"></span><div><b>${esc(x.l)}</b><span>${esc(x.r)} · ${x.v} (${pct(x.v, tot)})</span></div></div>`).join('') || '<span class="muted">Sem lesões no período.</span>'}</div></div><div class="heatbar">Passe o mouse sobre o músculo para ver os detalhes · D = direito, E = esquerdo</div>`)}
    ${panel('Distribuição de lesões por região', tot ? `<div class="donut-wrap" style="margin-bottom:12px">${donut(rows.map(x => ({ l: x.r, v: x.n, c: x.c })), tot, 'LESÕES', 170)}</div><div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Região</th><th>Lesões</th><th>%</th><th>Atletas</th><th>Dias afastados</th><th>Média de dias</th></tr></thead><tbody>${rows.map(x => `<tr><td class="l"><span class="sq" style="background:${x.c}"></span>${esc(x.r)}</td><td>${x.n}</td><td>${pct(x.n, tot)}</td><td>${x.at}</td><td>${x.d}</td><td>${nf(x.m)}</td></tr>`).join('')}</tbody><tfoot><tr><td class="l">TOTAL</td><td>${tot}</td><td>100%</td><td>${afet}</td><td>${dias}</td><td>${nf(dias / tot)}</td></tr></tfoot></table></div>` : miniEmpty('Sem lesões', 'na temporada selecionada.'))}
  </div>
  <div class="row r2">
    ${panel('Evolução por região (últimos 6 meses)', stacked(ms.map(m => MESES[m]), series, { w: 520 }) + `<div class="legend-status" style="margin-top:8px;justify-content:center">${series.map(s => `<span><span class="sq" style="background:${s.c}"></span>${esc(s.l)}</span>`).join('')}</div>`)}
    ${panel('Média de dias afastados por região', dist([...rows].sort((a, b) => b.m - a.m).map(x => ({ l: x.r, v: x.m, t: nf(x.m), sw: x.c, c: x.c }))))}
  </div>`;
}
function fTempo() {
  const lp = lesPeriodo(), tot = lp.length, dl = lp.map(diasFora), dias = dl.reduce((a, b) => a + b, 0);
  const at = lesAtivas(), noDM = new Set(at.map(l => l.atletaId)).size, maior = [...lp].sort((a, b) => diasFora(b) - diasFora(a))[0];
  const faixas = [['1 – 7 dias', 0, 7, '#1b8a4a'], ['8 – 14 dias', 8, 14, '#f6c21c'], ['15 – 30 dias', 15, 30, '#f39324'], ['31 – 60 dias', 31, 60, '#e0342b'], ['+ de 60 dias', 61, 1e9, '#7a3fd1']].map(([l, a, b, c]) => ({ l, c, v: dl.filter(d => d >= a && d <= b).length }));
  let acc = 0; const cum = MESES.map((_, i) => (acc += lp.filter(l => +l.data.slice(5, 7) === i + 1).reduce((s, l) => s + diasFora(l), 0)));
  const nowM = F.ano === String(new Date().getFullYear()) ? new Date().getMonth() : 11;
  const porTipo = sortEnt(sumBy(lp, l => l.tipo, diasFora)), longos = [...lp].sort((a, b) => diasFora(b) - diasFora(a)).slice(0, 7), porAtl = sortEnt(sumBy(lp, l => l.atletaId, diasFora)).slice(0, 8);
  return `<div class="kpis k5">
    ${kpi('cal', 'Dias afastados (acum.)', dias, 'Temporada ' + anoLabel())}
    ${kpi('clock', 'Média por lesão', nf(tot ? dias / tot : 0) + '<small>dias</small>', 'Temporada ' + anoLabel())}
    ${kpi('run', 'Afastados agora', noDM, pct(noDM, atletasCat().length) + ' do elenco')}
    ${kpi('trend', 'Maior afastamento', maior ? diasFora(maior) + '<small>dias</small>' : '—', maior ? esc(lesNome(maior)) + ' · ' + esc((atl(maior.atletaId)?.nome || '').split(' ')[0]) : '', 'red')}
    ${kpi('cal', 'Mediana', nf(median(dl), 0) + '<small>dias</small>', 'Temporada ' + anoLabel())}
  </div>
  <div class="row r3">
    ${panel('Lesões por faixa de afastamento', `<div class="donut-wrap" style="margin-bottom:10px">${donut(faixas, tot, 'LESÕES', 160)}</div><div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Faixa de dias</th><th>Lesões</th><th>%</th></tr></thead><tbody>${faixas.map(f => `<tr><td class="l"><span class="sq" style="background:${f.c}"></span>${f.l}</td><td>${f.v}</td><td>${pct(f.v, tot)}</td></tr>`).join('')}</tbody><tfoot><tr><td class="l">TOTAL</td><td>${tot}</td><td>100%</td></tr></tfoot></table></div>`)}
    ${panel('Dias afastados (acumulado)', lineChart(MESES.slice(0, nowM + 1), cum.slice(0, nowM + 1), { label: 'Dias acumulados', min: 10, w: 440, h: 300, noVal: nowM > 7 }))}
    ${panel('Dias por tipo de lesão', dist(porTipo.map(([t, d]) => ({ l: t, v: d, p: pct(d, dias) }))))}
  </div>
  <div class="row r21">
    ${panel('Maiores tempos de afastamento', tabela(longos), { np: true })}
    ${panel('Tempo por atleta', porAtl.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Dias</th><th>Média</th></tr></thead><tbody>${porAtl.map(([id, d]) => { const n = lp.filter(l => l.atletaId === id).length; return `<tr class="click" data-hist="${id}"><td class="l">${athCell(atl(id))}</td><td><b>${d}</b></td><td>${nf(d / n)}</td></tr>`; }).join('')}</tbody></table></div>` : miniEmpty('Sem dados'), { np: true })}
  </div>`;
}
function fComparativo() {
  const ids = idsCat(); const ano = F.ano === 'Todos' ? String(new Date().getFullYear()) : F.ano, prev = String(+ano - 1);
  const A = S.lesoes.filter(l => ids.has(l.atletaId) && l.data.startsWith(ano)), P = S.lesoes.filter(l => ids.has(l.atletaId) && l.data.startsWith(prev));
  const sd = ls => ls.reduce((s, l) => s + diasFora(l), 0);
  const cmp = (icon, label, a, p, fmt = x => x) => { const d = p ? Math.round((a - p) / p * 100) : null; return kpi(icon, label, `${fmt(a)} <small style="color:var(--ink3)">vs ${fmt(p)}</small>`, d === null ? `Sem base em ${prev}` : `<span class="${d > 0 ? 'up' : 'down'}">${d > 0 ? '▲' : '▼'} ${Math.abs(d)}%</span> em relação a ${prev}`); };
  const cats = Object.keys(GRUPOS).filter(c => S.atletas.some(a => a.categoria === c));
  const catRows = cats.map(c => { const as = S.atletas.filter(a => a.categoria === c); const ls = S.lesoes.filter(l => l.data.startsWith(ano) && as.some(a => a.id === l.atletaId)); const d = sd(ls); return { c, el: as.length, n: ls.length, at: new Set(ls.map(l => l.atletaId)).size, d, m: ls.length ? d / ls.length : 0, taxa: as.length ? ls.length / as.length : 0 }; });
  const maxT = Math.max(.01, ...catRows.map(x => x.taxa));
  const local = LOCAIS.map((l, i) => ({ l, v: A.filter(x => x.local === l).length, c: ['#e0342b', '#1b8a4a', '#2f6fd6'][i] }));
  const pos = POS.map(p => ({ l: POSN[p], v: A.filter(l => atl(l.atletaId)?.posicao === p).length, c: PC1[p] })).filter(x => x.v);
  return `<div class="kpis k4">
    ${cmp('med', 'Lesões', A.length, P.length)}
    ${cmp('user', 'Atletas lesionados', new Set(A.map(l => l.atletaId)).size, new Set(P.map(l => l.atletaId)).size)}
    ${cmp('cal', 'Dias de afastamento', sd(A), sd(P))}
    ${cmp('clock', 'Média por lesão', A.length ? sd(A) / A.length : 0, P.length ? sd(P) / P.length : 0, x => nf(x))}
  </div>
  <div class="row r21">
    ${panel(`Lesões por mês · ${ano} x ${prev}`, lineChart(MESES, MESES.map((_, i) => A.filter(l => +l.data.slice(5, 7) === i + 1).length), { second: MESES.map((_, i) => P.filter(l => +l.data.slice(5, 7) === i + 1).length), label: 'Comparativo mensal' }) + `<div class="legend-status" style="justify-content:center"><span><span class="sq" style="background:var(--g500)"></span>${ano}</span><span><span class="sq" style="background:var(--gold)"></span>${prev} (tracejado)</span></div>`)}
    ${panel('Onde aconteceram · ' + ano, `<div class="donut-wrap">${donut(local, A.length, 'LESÕES', 160)}${legend(local)}</div>`)}
  </div>
  <div class="row" style="grid-template-columns:1fr">${panel('Comparativo entre categorias · ' + ano, catRows.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Categoria</th><th>Elenco</th><th>Lesões</th><th>Atletas lesionados</th><th>% do elenco</th><th>Dias afastados</th><th>Média de dias</th><th style="min-width:200px">Lesões por atleta</th></tr></thead><tbody>${catRows.map(r => `<tr><td class="l"><b>${esc(r.c)}</b></td><td>${r.el}</td><td>${r.n}</td><td>${r.at}</td><td>${pct(r.at, r.el)}</td><td>${r.d}</td><td>${nf(r.m)}</td><td><div style="display:flex;align-items:center;gap:8px"><div class="track" style="flex:1"><i style="width:${(r.taxa / maxT * 100).toFixed(0)}%"></i></div><b style="font-family:var(--fc);font-size:15px">${nf(r.taxa, 2)}</b></div></td></tr>`).join('')}</tbody></table></div>` : miniEmpty('Sem categorias'), { np: true })}</div>
  <div class="row r2">
    ${panel('Por mecanismo da lesão', dist(sortEnt(countBy(A, l => l.mecanismo)).map(([m, n]) => ({ l: m, v: n, p: pct(n, A.length) }))))}
    ${panel('Por posição', dist(pos.map(x => ({ l: x.l, v: x.v, p: pct(x.v, A.length), c: x.c, sw: x.c }))))}
  </div>`;
}

/* ================= CONFIGURAÇÕES ================= */
function vConfig() {
  const th = document.documentElement.dataset.theme || 'auto';
  const tl = (k, arr) => `<div class="taglist">${arr.map((t, i) => `<span>${esc(t)}<button data-act="tagDel" data-k="${k}" data-i="${i}" aria-label="Remover ${esc(t)}">×</button></span>`).join('')}</div><div class="row-add"><input id="add_${k}" placeholder="Adicionar…"><button class="btn sm pri" data-act="tagAdd" data-k="${k}">${IC.plus} Adicionar</button></div>`;
  const thBtn = (v, n, cols) => `<button data-act="setTheme" data-v="${v}" class="${th === v ? 'on' : ''}"><span class="pv">${cols.map(c => `<i style="flex:1;background:${c}"></i>`).join('')}</span>${n}</button>`;
  return `<div class="page-h"><h2>Configurações</h2><span class="muted">Ajustes do módulo de Fisioterapia / DM</span></div><div class="cfg-grid">
    ${panel('Aparência', `<p class="muted" style="margin-top:0">Escolha o tema do sistema. A escolha fica salva neste navegador e vale também para o Sistema de Minutagem.</p><div class="themes">${thBtn('light', 'Claro', ['#0a3a20', '#eef2ef', '#ffffff'])}${thBtn('dark', 'Escuro', ['#0a3a20', '#0c1410', '#141e19'])}${thBtn('auto', 'Automático', ['#0a3a20', '#eef2ef', '#141e19'])}</div>`)}
    ${panel('Temporada e categorias', `<div style="display:flex;align-items:center;gap:10px"><span style="flex:1"><b>Ano-base</b> <span class="muted" style="font-size:12.5px">define a subcategoria pela idade (mesma regra da Minutagem)</span></span><input type="number" id="cfgAno" min="2015" max="2040" value="${S.config.anoBase}" style="width:90px;border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:var(--card2)"></div><p class="muted" style="font-size:12.5px;margin-bottom:0">Categorias: ${Object.entries(GRUPOS).map(([g, s]) => `<b>${g}</b> (${s.join(', ')})`).join(' · ')}</p>`)}
    ${panel('Tipos de lesão', tl('tipos', S.config.tipos))}
    ${panel('Condutas / tratamentos', tl('condutas', S.config.condutas))}
    ${panel('Mecanismos de lesão', tl('mecanismos', S.config.mecanismos))}
    ${panel('Nutrição · faixa-alvo de gordura', `<p class="muted" style="margin-top:0">Usada para classificar as avaliações (abaixo, na faixa, atenção, acima). Referência comum no futebol de base: 8 a 14%.</p><div style="display:flex;gap:12px;align-items:center"><label class="f" style="flex:1"><span>Mínimo (%)</span><input type="number" id="cfgAlvoMin" min="3" max="30" step="0.5" value="${alvo().min}"></label><label class="f" style="flex:1"><span>Máximo (%)</span><input type="number" id="cfgAlvoMax" min="5" max="35" step="0.5" value="${alvo().max}"></label></div>`)}
    ${panel('Profissionais do DM', `<p class="muted" style="margin-top:0">Aparecem como responsável no registro da lesão.</p><div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px">${(S.config.profissionais || []).map((p, i) => `<div style="display:flex;gap:6px;align-items:center"><input data-prof="${i}" data-k="nome" value="${esc(p.nome)}" placeholder="Nome" style="flex:1;min-width:0;border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:var(--card2)"><input data-prof="${i}" data-k="cargo" value="${esc(p.cargo || '')}" placeholder="Cargo" style="flex:1.2;min-width:0;border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:var(--card2)"><button class="icon-btn" data-act="profDel" data-i="${i}" aria-label="Remover">${IC.trash}</button></div>`).join('')}</div><button class="btn sm" data-act="profAdd">${IC.plus} Adicionar profissional</button>`)}
    ${panel('Backup dos dados', `<p class="muted" style="margin-top:0">${S.online ? 'Os dados ficam salvos na nuvem deste sistema e aparecem para todos com acesso.' : 'Os dados estão salvos apenas neste navegador.'} Faça uma cópia de segurança periodicamente.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri" data-act="backup">${IC.down} Baixar backup (.json)</button><label class="btn" style="cursor:pointer">${IC.upload} Restaurar backup<input type="file" id="restore" accept=".json,application/json" hidden></label></div><p class="muted" style="font-size:12.5px;margin-bottom:0">${S.atletas.length} atletas · ${S.lesoes.length} lesões registradas</p>`)}
  </div>`;
}
function setTheme(v) { if (v === 'auto') { delete document.documentElement.dataset.theme; try { localStorage.removeItem('pv_theme'); } catch (e) { } } else { document.documentElement.dataset.theme = v; try { localStorage.setItem('pv_theme', v); } catch (e) { } } render(); }

/* ================= MODAIS ================= */
const modalBg = $('#modalBg'), modal = $('#modal');
function openModal(html, xl) { modal.className = 'modal' + (xl ? ' xl' : ''); modal.innerHTML = html; modalBg.classList.add('open'); setTimeout(() => modal.querySelector('input:not([type=hidden]),select,textarea')?.focus(), 30); }
function closeModal() { modalBg.classList.remove('open'); modal.innerHTML = ''; }
modalBg.addEventListener('mousedown', e => { if (e.target === modalBg) closeModal(); });
dmOn('keydown', e => { if (e.key === 'Escape' && modalBg.classList.contains('open')) closeModal(); });
const opts = (arr, v) => arr.map(x => `<option ${x === v ? 'selected' : ''}>${esc(x)}</option>`).join('');
const mh = t => `<div class="mh"><h3>${t}</h3><button class="icon-btn" data-act="close" aria-label="Fechar">${IC.x}</button></div>`;

function formAtleta(a = {}) {
  const cat = a.categoria || (F.categoria !== 'Todas' ? F.categoria : 'Sub-15'); const pos = a.posicao || 'MEI';
  openModal(mh(a.id ? 'Editar atleta' : 'Cadastrar atleta') + `<form id="fAtl"><div class="mb"><div class="form">
    <div class="f s2"><label for="fNome">Nome completo *</label><input id="fNome" name="nome" required value="${esc(a.nome || '')}"></div>
    <div class="f"><label for="fApel">Apelido</label><input id="fApel" name="apelido" value="${esc(a.apelido || '')}"></div>
    <div class="f"><label for="fNum">Número</label><input id="fNum" name="numero" type="number" min="0" max="99" value="${esc(a.numero ?? '')}"></div>
    <div class="f"><label for="fNasc">Nascimento</label><input id="fNasc" name="nascimento" type="date" value="${esc(a.nascimento || '')}"><span class="hint" id="fIdade">${a.nascimento ? idade(a.nascimento) + ' anos' : ''}</span></div>
    <div class="f"><label for="fCat">Categoria *</label><select id="fCat" name="categoria">${opts(Object.keys(GRUPOS), cat)}</select></div>
    <div class="f"><label for="fSub">Subcategoria</label><select id="fSub" name="subcategoria"><option value="">—</option>${opts(GRUPOS[cat], a.subcategoria)}</select><span class="hint" id="fSubH"></span></div>
    <div class="f"><label for="fPe">Pé dominante</label><select id="fPe" name="pe">${opts(['Direito', 'Esquerdo', 'Ambidestro'], a.pe || 'Direito')}</select></div>
    <div class="f"><label for="fPos">Posição *</label><select id="fPos" name="posicao">${POS.map(p => `<option value="${p}" ${p === pos ? 'selected' : ''}>${p} · ${POSN[p]}</option>`).join('')}</select></div>
    <div class="f"><label for="fPosD">Função</label><select id="fPosD" name="posDetalhe">${opts(POSDET[pos], a.posDetalhe)}</select></div>
    <div class="f"><label for="fAlt">Altura (m)</label><input id="fAlt" name="altura" type="number" step="0.01" min="1" max="2.3" value="${esc(a.altura ?? '')}"></div>
    <div class="f"><label for="fPeso">Peso (kg)</label><input id="fPeso" name="peso" type="number" step="0.1" min="20" max="140" value="${esc(a.peso ?? '')}"></div>
    <div class="f"><label for="fGord">% de gordura</label><input id="fGord" name="gordura" type="number" step="0.1" min="2" max="50" value="${esc(a.gordura ?? '')}"></div>
    ${a.avData ? `<div class="f s4"><span class="hint">Peso, estatura e % de gordura são atualizados automaticamente pela última avaliação corporal (${fmtD(a.avData)}).</span></div>` : ''}
  </div></div><div class="mf"><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} ${a.id ? 'Salvar alterações' : 'Cadastrar atleta'}</button></div></form>`);
  const fm = $('#fAtl');
  fm.categoria.onchange = () => { fm.subcategoria.innerHTML = '<option value="">—</option>' + opts(GRUPOS[fm.categoria.value]); };
  fm.posicao.onchange = () => { fm.posDetalhe.innerHTML = opts(POSDET[fm.posicao.value]); };
  fm.nascimento.oninput = e => { const i = idade(e.target.value); $('#fIdade').textContent = i !== '' ? i + ' anos' : ''; const q = subPorIdade(e.target.value, S.config.anoBase); if (q.cat) { fm.categoria.value = q.cat; fm.subcategoria.innerHTML = '<option value="">—</option>' + opts(GRUPOS[q.cat], q.sub); $('#fSubH').textContent = `Pela idade em ${S.config.anoBase}: ${q.sub}`; } };
  fm.onsubmit = e => {
    e.preventDefault(); const f = new FormData(fm);
    const o = { ...a, id: a.id || uid('a'), nome: f.get('nome').trim(), apelido: f.get('apelido').trim(), numero: f.get('numero'), nascimento: f.get('nascimento'), categoria: f.get('categoria'), subcategoria: f.get('subcategoria'), posicao: f.get('posicao'), posDetalhe: f.get('posDetalhe'), pe: f.get('pe'), altura: f.get('altura'), peso: f.get('peso'), gordura: f.get('gordura') };
    save('atletas', o); closeModal(); toast(a.id ? 'Atleta atualizado' : 'Atleta cadastrado');
  };
}

let pick = { regiao: '', lado: '', musculo: '' };
function formLesao(l = {}, atletaId) {
  if (!S.atletas.length) { toast('Cadastre um atleta antes de registrar lesões', true); return; }
  pick = { regiao: l.regiao || '', lado: l.lado || '', musculo: l.musculo || '' };
  const ats = [...S.atletas].sort((a, b) => a.nome.localeCompare(b.nome)); const sel = l.atletaId || atletaId || '';
  const tipos = [...new Set([...S.config.tipos, ...(l.tipo ? [l.tipo] : [])])], mecs = [...new Set([...S.config.mecanismos, ...(l.mecanismo ? [l.mecanismo] : [])])], conds = [...new Set([...S.config.condutas, ...(l.tratamentos || [])])];
  const profs = (S.config.profissionais || []).map(p => p.nome).filter(Boolean);
  openModal(mh(l.id ? 'Editar lesão' : 'Registrar lesão no DM') + `<form id="fLes"><div class="mb">
    <div class="imp-hint">${IC.upload}<span>Tem um histórico de lesões em planilha? <button type="button" class="linkbtn" data-act="imp-lesoes">Importar lesões do Excel</button></span></div>
    <div class="fsec">Atleta e ocorrência</div>
    <div class="form">
      <div class="f s2"><label for="lAtl">Atleta *</label><select id="lAtl" name="atletaId"><option value="">Selecione o atleta</option>${ats.map(a => `<option value="${a.id}" ${a.id === sel ? 'selected' : ''}>${esc(a.nome)} · ${esc(a.posicao)} · ${esc(a.subcategoria || a.categoria)}</option>`).join('')}</select></div>
      <div class="f"><label for="lData">Data da lesão *</label><input id="lData" type="date" name="data" required value="${esc(l.data || todayISO())}" max="${todayISO()}"></div>
      <div class="f"><label for="lLocal">Onde aconteceu</label><select id="lLocal" name="local">${opts(LOCAIS, l.local || 'Treino')}</select></div>
      <div class="f s2"><label for="lMec">Mecanismo</label><select id="lMec" name="mecanismo">${opts(mecs, l.mecanismo || mecs[0])}</select></div>
      <div class="f s2"><label for="lResp">Responsável pelo atendimento</label><select id="lResp" name="responsavel"><option value="">—</option>${opts(profs, l.responsavel)}</select></div>
    </div>
    <div class="fsec">Local da dor</div>
    <div class="split">
      <div class="mappick"><div id="pickMap">${bodyMap({ mode: 'pick', sel: pick })}</div><div class="picked" id="pickedTxt"></div></div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <p class="muted" style="margin:0;font-size:13px">Clique no músculo exato onde o atleta sente dor: a área entre as linhas fica marcada. Na vista de frente o lado direito do atleta fica à esquerda da tela; na de costas, à direita.</p>
        <div class="form" style="grid-template-columns:1fr 1fr">
          <div class="f"><label for="regSel">Região *</label><select id="regSel"><option value="">Selecione no corpo ou aqui</option>${Object.keys(REG).map(r => `<option value="${r}">${regN(r)}</option>`).join('')}</select></div>
          <div class="f"><label for="muscSel">Músculo / ponto exato</label><select id="muscSel"></select></div>
          <div class="f"><span>Lado</span><div class="seg2" id="ladoSeg">${[['D', 'Direito'], ['E', 'Esquerdo'], ['', 'Central']].map(([v, t]) => `<label><input type="radio" name="lado" value="${v}">${t}</label>`).join('')}</div></div>
          <div class="f"><label for="lTipo">Tipo de lesão *</label><select id="lTipo" name="tipo">${opts(tipos, l.tipo || tipos[0])}</select></div>
          <div class="f"><label for="lGrau">Grau</label><select id="lGrau" name="grau">${opts(GRAUS, l.grau || '—')}</select></div>
        </div>
        <div class="f"><span>Intensidade da dor (EVA 0–10)</span><div class="eva"><input type="range" min="0" max="10" name="dor" value="${l.dor ?? 5}" aria-label="Intensidade da dor"><b id="evaV">${l.dor ?? 5}</b></div></div>
        <div id="recHint" class="hint warn2"></div>
      </div>
    </div>
    <div class="fsec">Afastamento e tratamento</div>
    <div class="form">
      <div class="f"><label for="diasEst">Dias estimados fora</label><input id="diasEst" type="number" min="0" max="400" value="${l.previsao && l.data ? dayDiff(l.data, l.previsao) : ''}"></div>
      <div class="f"><label for="prevInp">Previsão de retorno</label><input id="prevInp" type="date" name="previsao" value="${esc(l.previsao || '')}"></div>
      <div class="f"><label for="lSt">Status *</label><select id="lSt" name="status">${ORDER.map(s => `<option value="${s}" ${(l.status || 'tratamento') === s ? 'selected' : ''}>${STATUS[s]}</option>`).join('')}</select></div>
      <div class="f"><span>Cirurgia</span><div class="seg2"><label><input type="radio" name="cirurgia" value="0" ${!l.cirurgia ? 'checked' : ''}>Não</label><label><input type="radio" name="cirurgia" value="1" ${l.cirurgia ? 'checked' : ''}>Sim</label></div></div>
      <div class="f s4"><span>Condutas / tratamento</span><div class="tchips">${conds.map(t => `<label><input type="checkbox" name="trat" value="${esc(t)}" ${(l.tratamentos || []).includes(t) ? 'checked' : ''}>${esc(t)}</label>`).join('')}</div></div>
      <div class="f s2"><label for="lEx">Exames realizados</label><input id="lEx" name="exames" placeholder="Ex.: Ultrassom muscular (13/05)" value="${esc(l.exames || '')}"></div>
      <div class="f s2" style="justify-content:flex-end"><label class="chk" style="text-transform:none;font-size:14px;color:var(--ink);letter-spacing:0"><input type="checkbox" name="recorrente" id="recChk" ${l.recorrente ? 'checked' : ''}>Lesão recorrente</label></div>
      <div class="f s2"><label for="lDesc">Descrição da lesão</label><textarea id="lDesc" name="descricao" placeholder="Como aconteceu, sintomas, avaliação clínica">${esc(l.descricao || '')}</textarea></div>
      <div class="f s2"><label for="lObs">Observações</label><textarea id="lObs" name="obs" placeholder="Evolução, cuidados, controle de carga">${esc(l.obs || '')}</textarea></div>
    </div>
  </div><div class="mf"><span class="msg" id="lesErr"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} ${l.id ? 'Salvar alterações' : 'Registrar lesão'}</button></div></form>`, true);
  const form = $('#fLes');
  form.dor.oninput = e => $('#evaV').textContent = e.target.value;
  const sync = () => {
    $$('#pickMap [data-seg]').forEach(p => p.classList.toggle('sel', !!pick.regiao && segMatch(SEGS[+p.dataset.seg], pick)));
    $('#regSel').value = pick.regiao;
    const ms = SEGS.filter(sg => sg[0] === pick.regiao && (!pick.lado || !sg[1] || sg[1] === pick.lado));
    $('#muscSel').innerHTML = pick.regiao ? `<option value="">Região inteira</option>` + ms.map(sg => `<option value="${esc(sg[2] + '|' + sg[1])}" ${pick.musculo === sg[2] && (pick.lado || '') === sg[1] ? 'selected' : ''}>${esc(sg[2])}${sg[1] && !pick.lado ? ' (' + sg[1] + ')' : ''}</option>`).join('') : '<option value="">Escolha a região primeiro</option>';
    $('#muscSel').disabled = !pick.regiao;
    $$('#ladoSeg input').forEach(i => { i.checked = i.value === pick.lado; i.disabled = pick.regiao ? (REG[pick.regiao][2] ? i.value === '' : false) : false; });
    $('#pickedTxt').innerHTML = pick.regiao ? `${regN(pick.regiao)}${pick.musculo ? ' · ' + esc(pick.musculo) : ''}${pick.lado ? ` <span>· lado ${pick.lado === 'D' ? 'direito' : 'esquerdo'}</span>` : ''}` : '<span>Nenhuma região selecionada</span>';
    const aid = form.atletaId.value; const prev = aid && pick.regiao ? S.lesoes.filter(x => x.atletaId === aid && x.id !== l.id && x.regiao === pick.regiao && (x.lado || '') === pick.lado && x.data < form.data.value && dayDiff(x.data, form.data.value) <= 365) : [];
    $('#recHint').textContent = prev.length ? `Atenção: este atleta já teve lesão nessa região em ${fmtD(prev[0].data)} (${prev[0].tipo}). Marcada como recorrente.` : '';
    if (prev.length && !l.id) $('#recChk').checked = true;
  };
  const choose = t => { const sg = SEGS[+t.dataset.seg]; pick = { regiao: sg[0], lado: sg[1], musculo: sg[2] }; sync(); };
  $('#pickMap').addEventListener('click', e => { const t = e.target.closest('[data-seg]'); if (t) choose(t); });
  $('#pickMap').addEventListener('keydown', e => { if (e.key !== 'Enter' && e.key !== ' ') return; const t = e.target.closest('[data-seg]'); if (t) { e.preventDefault(); choose(t); } });
  $('#regSel').onchange = e => { const r = e.target.value; pick = { regiao: r, lado: r && REG[r][2] ? (pick.lado || 'D') : '', musculo: '' }; sync(); };
  $('#muscSel').onchange = e => { const [m, ld] = e.target.value.split('|'); pick.musculo = m || ''; if (m) pick.lado = ld || ''; sync(); };
  $$('#ladoSeg input').forEach(i => i.onchange = () => { pick.lado = i.value; if (pick.musculo && !SEGS.some(sg => sg[0] === pick.regiao && sg[2] === pick.musculo && sg[1] === pick.lado)) pick.musculo = ''; sync(); });
  form.atletaId.onchange = sync;
  form.data.onchange = () => { if ($('#diasEst').value) $('#prevInp').value = addDays(form.data.value, +$('#diasEst').value); sync(); };
  $('#diasEst').oninput = e => { if (e.target.value !== '' && form.data.value) $('#prevInp').value = addDays(form.data.value, +e.target.value); };
  $('#prevInp').onchange = e => { if (e.target.value && form.data.value) $('#diasEst').value = dayDiff(form.data.value, e.target.value); };
  sync();
  form.onsubmit = e => {
    e.preventDefault(); const f = new FormData(form); const err = $('#lesErr');
    if (!f.get('atletaId')) return err.textContent = 'Selecione o atleta.';
    if (!pick.regiao) return err.textContent = 'Marque o local da dor no corpo ou escolha a região.';
    if (REG[pick.regiao][2] && !pick.lado) return err.textContent = 'Informe o lado (direito ou esquerdo).';
    const status = f.get('status'); const sd = { ...(l.statusDatas || {}) };
    sd.tratamento = sd.tratamento && l.data === f.get('data') ? sd.tratamento : f.get('data');
    ORDER.slice(1, ORDER.indexOf(status) + 1).forEach(s => { if (!sd[s]) sd[s] = todayISO(); });
    ORDER.slice(ORDER.indexOf(status) + 1).forEach(s => delete sd[s]);
    const o = { ...l, id: l.id || uid('l'), atletaId: f.get('atletaId'), data: f.get('data'), local: f.get('local'), mecanismo: f.get('mecanismo'), responsavel: f.get('responsavel'), tipo: f.get('tipo'), grau: f.get('grau'), regiao: pick.regiao, lado: pick.lado, musculo: pick.musculo || '', dor: +f.get('dor'), descricao: f.get('descricao').trim(), exames: f.get('exames').trim(), tratamentos: f.getAll('trat'), previsao: f.get('previsao') || '', status, statusDatas: sd, cirurgia: f.get('cirurgia') === '1', recorrente: !!f.get('recorrente'), obs: f.get('obs').trim(), criadoEm: l.criadoEm || todayISO() };
    save('lesoes', o); UI.selLes = o.id; closeModal(); toast(l.id ? 'Lesão atualizada' : 'Lesão registrada no DM');
  };
}
function confirmar(msg, onOk) {
  openModal(mh('Confirmar exclusão') + `<div class="mb"><p style="margin:0">${msg}</p></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn red" id="okDel">${IC.trash} Excluir</button></div>`);
  $('#okDel').onclick = () => { onOk(); closeModal(); };
}

/* ================= AÇÕES ================= */
dmOn('click', async e => {
  const t = e.target.closest('[data-go],[data-act],[data-open-les],[data-sel-les],[data-hist],[data-toggle],[data-pos]'); if (!t) return;
  if (t.dataset.go) { go(t.dataset.go); return; }
  if (t.dataset.pos) { UI.atPos = t.dataset.pos; render(); return; }
  if (t.dataset.toggle !== undefined) { const it = t.closest('.hist-item'); it.classList.toggle('open'); t.setAttribute('aria-expanded', it.classList.contains('open')); return; }
  if (t.dataset.openLes) { const l = S.lesoes.find(x => x.id === t.dataset.openLes); UI.selLes = t.dataset.openLes; UI.fl = { status: l && l.status === 'liberado' ? 'todos' : 'ativos', regiao: '', tipo: '', busca: '' }; go('dm-lesionados'); return; }
  if (t.dataset.selLes) { UI.selLes = t.dataset.selLes; $$('tr[data-sel-les]').forEach(r => r.classList.toggle('rowsel', r.dataset.selLes === UI.selLes)); $('#detPanel').innerHTML = detalhe(S.lesoes.find(l => l.id === UI.selLes)); return; }
  if (t.dataset.hist) { go('dm-historico', t.dataset.hist); return; }
  const id = t.dataset.id;
  switch (t.dataset.act) {
    case 'close': closeModal(); break;
    case 'limpar-menu': limparMenu(); break;
    case 'sel-cancel': UI.selMode = false; UI.sel.clear(); render(); break;
    case 'sel-del': { const ids = [...UI.sel]; const nl = S.lesoes.filter(l => UI.sel.has(l.atletaId)).length; confirmar(`Excluir <b>${ids.length} atleta(s)</b>${nl ? ` e as <b>${nl} lesões</b> registradas deles` : ''}? Essa ação não pode ser desfeita.`, async () => { await apagar(ids, S.lesoes.filter(l => ids.includes(l.atletaId)).map(l => l.id)); UI.selMode = false; UI.sel.clear(); render(); toast(`${ids.length} atleta(s) excluído(s)`); }); break; }
    case 'do-limpar': doLimpar(); break;
    case 'print-menu': printMenu(); break;
    case 'print-ind': printMenu('individual', id); break;
    case 'do-print': case 'do-pdf': { const kind = ($('input[name=rk]:checked') || {}).value || 'pagina'; const aid = $('#rkAtl')?.value; closeModal(); const pages = buildPages(kind, aid); if (!pages.length) { toast('Nada para imprimir.', true); break; } if (t.dataset.act === 'do-print') imprimir(pages); else gerarPDF(pages, kind, aid); break; }
    case 'theme': { const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); setTheme(cur === 'dark' ? 'light' : 'dark'); break; }
    case 'setTheme': setTheme(t.dataset.v); break;
    case 'seed': loadSeed(); break;
    case 'novo-atleta': formAtleta(); break;
    case 'edit-atleta': formAtleta(atl(id)); break;
    case 'del-atleta': { const a = atl(id); const n = S.lesoes.filter(l => l.atletaId === id).length; confirmar(`Excluir <b>${esc(a.nome)}</b>${n ? ` e as ${n} lesões registradas dele` : ''}? Essa ação não pode ser desfeita.`, () => { S.lesoes.filter(l => l.atletaId === id).forEach(l => remove('lesoes', l.id)); remove('atletas', id); toast('Atleta excluído'); }); break; }
    case 'nova-lesao': formLesao(); break;
    case 'lesao-atleta': formLesao({}, id); break;
    case 'edit-lesao': formLesao(S.lesoes.find(l => l.id === id)); break;
    case 'del-lesao': confirmar('Excluir este registro de lesão? Essa ação não pode ser desfeita.', () => { remove('lesoes', id); toast('Lesão excluída'); }); break;
    case 'hist': go('dm-historico', id); break;
    case 'limpar-fl': UI.fl = { status: 'ativos', regiao: '', tipo: '', busca: '' }; render(); break;
    case 'avancar': { const l = S.lesoes.find(x => x.id === id); const nx = ORDER[ORDER.indexOf(l.status) + 1]; if (!nx) break; save('lesoes', { ...l, status: nx, statusDatas: { ...(l.statusDatas || {}), [nx]: todayISO() } }); toast(nx === 'liberado' ? 'Atleta liberado para jogos' : 'Status: ' + STATUS[nx]); break; }
    case 'tagAdd': { const k = t.dataset.k, inp = $('#add_' + k), v = inp.value.trim(); if (!v) break; if (!S.config[k].includes(v)) { S.config[k] = [...S.config[k], v]; await putConfig(); } break; }
    case 'tagDel': { const k = t.dataset.k; S.config[k] = S.config[k].filter((_, i) => i !== +t.dataset.i); await putConfig(); break; }
    case 'profAdd': S.config.profissionais = [...(S.config.profissionais || []), { nome: '', cargo: '' }]; await putConfig(); break;
    case 'profDel': S.config.profissionais = S.config.profissionais.filter((_, i) => i !== +t.dataset.i); await putConfig(); break;
    case 'backup': {
      const data = JSON.stringify({ sistema: 'Porto Vitória · Fisio/DM', exportadoEm: new Date().toISOString(), atletas: S.atletas, lesoes: S.lesoes, config: S.config }, null, 1);
      try { const dl = window.claude && await window.claude.use('downloads'); if (!dl) { toast('O download não está disponível nesta visualização.', true); break; } await dl.save({ filename: `backup-dm-porto-vitoria-${todayISO()}.json`, data }); toast('Backup salvo'); } catch (er) { toast('Download cancelado.', true); }
      break;
    }
  }
});
dmOn('change', async e => {
  const t = e.target;
  if (t.dataset.sel) { t.checked ? UI.sel.add(t.dataset.sel) : UI.sel.delete(t.dataset.sel); render(); return; }
  if (t.id === 'selAll') { const q = UI.atBusca.toLowerCase(); atletasCat().filter(a => (!q || (a.nome + ' ' + (a.apelido || '')).toLowerCase().includes(q)) && (UI.atPos === 'Todas' || a.posicao === UI.atPos)).forEach(a => t.checked ? UI.sel.add(a.id) : UI.sel.delete(a.id)); render(); return; }
  if (t.dataset.fl && t.dataset.fl !== 'busca') { UI.fl[t.dataset.fl] = t.value; render(); }
  if (t.id === 'histSel') go('dm-historico', t.value);
  if (t.id === 'cfgAno') { S.config.anoBase = +t.value || new Date().getFullYear(); await putConfig(); }
  if (t.dataset.prof !== undefined) { const i = +t.dataset.prof; S.config.profissionais[i] = { ...S.config.profissionais[i], [t.dataset.k]: t.value.trim() }; await putConfig(); }
  if (t.id === 'restore' && t.files[0]) {
    try {
      const j = JSON.parse(await t.files[0].text()); if (!Array.isArray(j.atletas) || !Array.isArray(j.lesoes)) throw 0;
      confirmar(`Restaurar ${j.atletas.length} atletas e ${j.lesoes.length} lesões deste backup? Registros com o mesmo código serão substituídos.`, async () => { for (const a of j.atletas) await save('atletas', a); for (const l of j.lesoes) await save('lesoes', l); if (j.config) { S.config = fixCfg(j.config); await putConfig(); } toast('Backup restaurado'); });
      $('#okDel').innerHTML = IC.upload + ' Restaurar'; $('#okDel').className = 'btn pri';
    } catch (er) { toast('Arquivo de backup inválido.', true); }
  }
});
let bt; dmOn('input', e => {
  const t = e.target;
  if (t.dataset.fl === 'busca' || t.id === 'atBusca') {
    const isAt = t.id === 'atBusca', v = t.value; clearTimeout(bt);
    bt = setTimeout(() => { if (isAt) UI.atBusca = v; else UI.fl.busca = v; const pos = t.selectionStart; render(); const el = isAt ? $('#atBusca') : $('[data-fl="busca"]'); if (el) { el.focus(); el.setSelectionRange(pos, pos); } }, 250);
  }
});
dmOn('keydown', e => { if (e.key === 'Enter' && e.target.id && e.target.id.startsWith('add_')) { e.preventDefault(); e.target.nextElementSibling.click(); } });


/* ================= LIMPAR DADOS ================= */
async function apagar(atlIds, lesIds) {
  const A = new Set(atlIds), L = new Set(lesIds);
  S.atletas = S.atletas.filter(a => !A.has(a.id)); S.lesoes = S.lesoes.filter(l => !L.has(l.id)); render();
  if (db) { const ops = [...[...A].map(id => ['atletas', id]), ...[...L].map(id => ['lesoes', id])]; for (let i = 0; i < ops.length; i += 20) await Promise.all(ops.slice(i, i + 20).map(([c, id]) => db.collection(c).doc(id).delete().catch(dbErr))); }
  else lsSave();
}
function limparMenu() {
  const cat = atletasCat(), idsC = new Set(cat.map(a => a.id)), lesC = S.lesoes.filter(l => idsC.has(l.atletaId)).length;
  const temFiltro = F.categoria !== 'Todas';
  const op = (v, t, d, n, chk) => `<label class="rk"><input type="radio" name="lp" value="${v}" ${chk ? 'checked' : ''}><span><b>${t}</b><small>${d}</small></span><em class="lp-count">${n}</em></label>`;
  openModal(mh('Limpar dados') + `<div class="mb">
    <div class="warn" style="margin:0">A exclusão é definitiva${S.online ? ' e vale para todos que usam o sistema' : ''}. Se quiser se garantir, baixe um backup antes: dá para restaurar depois em Configurações.</div>
    <div class="rk-list">
      ${op('sel', 'Escolher atletas na lista', 'Marque um por um (ou todos da busca) e exclua só os que entraram errado. As lesões deles também saem.', 'seleção', true)}
      ${temFiltro ? op('cat', `Todos os atletas de ${esc(catLabel().toLowerCase())}`, 'Apaga os atletas do filtro atual e as lesões deles.', `${cat.length} atletas · ${lesC} lesões`) : ''}
      ${op('les', 'Só as lesões' + (temFiltro ? ' de ' + esc(catLabel().toLowerCase()) : ''), 'Mantém o cadastro dos atletas e apaga o histórico de lesões.', `${temFiltro ? lesC : S.lesoes.length} lesões`)}
      ${op('tudo', 'Tudo', 'Apaga todos os atletas e todas as lesões, de todas as categorias. As configurações são mantidas.', `${S.atletas.length} atletas · ${S.lesoes.length} lesões`)}
    </div>
    <div class="f" id="lpTypeBox"><label for="lpConf">Para confirmar, digite EXCLUIR</label><input id="lpConf" autocomplete="off" placeholder="EXCLUIR"></div>
  </div><div class="mf"><button class="btn" data-act="backup">${IC.down} Baixar backup antes</button><span style="flex:1"></span><button class="btn" data-act="close">Cancelar</button><button class="btn red" id="lpOk" data-act="do-limpar">${IC.trash} Continuar</button></div>`);
  const sync = () => { const v = ($('input[name=lp]:checked') || {}).value; $('#lpTypeBox').style.display = v === 'sel' ? 'none' : ''; $('#lpOk').disabled = v !== 'sel' && $('#lpConf').value.trim().toUpperCase() !== 'EXCLUIR'; $('#lpOk').innerHTML = IC.trash + (v === 'sel' ? ' Escolher na lista' : ' Excluir agora'); };
  $$('input[name=lp]').forEach(i => i.addEventListener('change', sync));
  $('#lpConf').addEventListener('input', sync);
  sync();
}
async function doLimpar() {
  const v = ($('input[name=lp]:checked') || {}).value;
  if (v === 'sel') { closeModal(); UI.selMode = true; UI.sel.clear(); go('atletas'); toast('Marque os atletas que quer excluir'); return; }
  if ($('#lpConf').value.trim().toUpperCase() !== 'EXCLUIR') return;
  closeModal();
  if (v === 'cat') { const ids = atletasCat().map(a => a.id); await apagar(ids, S.lesoes.filter(l => ids.includes(l.atletaId)).map(l => l.id)); toast(`${ids.length} atleta(s) e as lesões deles foram excluídos`); }
  if (v === 'les') { const ids = F.categoria !== 'Todas' ? S.lesoes.filter(l => idsCat().has(l.atletaId)).map(l => l.id) : S.lesoes.map(l => l.id); await apagar([], ids); toast(`${ids.length} lesão(ões) excluída(s)`); }
  if (v === 'tudo') { const n = S.atletas.length, m = S.lesoes.length; await apagar(S.atletas.map(a => a.id), S.lesoes.map(l => l.id)); toast(`Dados apagados: ${n} atletas e ${m} lesões`); }
}

/* ================= RELATÓRIOS: IMPRIMIR / PDF ================= */
function printMenu(kind = 'pagina', aid) {
  const ats = [...S.atletas].sort((a, b) => a.nome.localeCompare(b.nome));
  const cur = aid || UI.histAtleta || ats[0]?.id;
  const pagLabel = (TITLES[S.view] || ['Página'])[1] || (TITLES[S.view] || ['Página'])[0];
  const opt = (v, t, d) => `<label class="rk"><input type="radio" name="rk" value="${v}" ${kind === v ? 'checked' : ''}><span><b>${t}</b><small>${d}</small></span></label>`;
  openModal(mh('Imprimir / gerar PDF') + `<div class="mb">
    <div class="rk-list">
      ${opt('pagina', 'Esta página', `${esc(pagLabel)} · do jeito que está na tela, com os filtros atuais`)}
      ${opt('geral', 'Relatório geral do DM', 'Visão geral, atletas no DM, regiões, tempo de afastamento e comparativo · ' + esc(catLabel().toLowerCase()) + ' · temporada ' + anoLabel())}
      ${opt('ficha', 'Ficha individual do atleta', 'Dados, disponibilidade, status físico, minutagem, jogos, lesões e avaliações')}
      ${opt('nutind', 'Relatório individual nutricional', 'Evolução da composição corporal entre avaliações, dobras, circunferências e necessidade nutricional')}
      ${opt('individual', 'Relatório individual do atleta (DM)', 'Ficha completa: dados, mapa do corpo, todas as lesões, condutas, evolução e assinatura')}
    </div>
    <div class="f" id="rkAtlBox" style="${['individual', 'nutind', 'ficha'].includes(kind) ? '' : 'display:none'}"><label for="rkAtl">Atleta</label><select id="rkAtl">${ats.map(a => `<option value="${a.id}" ${a.id === cur ? 'selected' : ''}>${esc(a.nome)} · ${esc(a.subcategoria || a.categoria)}</option>`).join('')}</select></div>
    <p class="muted" style="margin:0;font-size:12.5px">Todas as folhas saem no mesmo tamanho, formato 16:9 deitado (13,33 × 7,5 pol), com o conteúdo encaixado na folha inteira e no tema claro. Se a janela de impressão não abrir, use “Baixar PDF”.</p>
  </div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn" data-act="do-print">${IC.print} Imprimir</button><button class="btn pri" data-act="do-pdf">${IC.pdf} Baixar PDF</button></div>`);
  $$('input[name=rk]').forEach(i => i.onchange = () => { if (i.checked) $('#rkAtlBox').style.display = ['individual', 'nutind', 'ficha'].includes(i.value) ? '' : 'none'; });
}

function renderAs(view) { const v0 = S.view; S.view = view; try { const v = { atletas: vAtletas }[view] || (view.startsWith('nut-') ? vNut : vDM); return v(); } finally { S.view = v0; } }
const pageWrap = (html, cls = '') => `<div class="sheet"><div class="pdfpage fixed ${cls}"><div class="report">${html}${footer()}</div></div></div>`;
// folha 16:9 (13,33 × 7,5 pol = 1280 × 720 px): todas as páginas no mesmo tamanho, conteúdo encaixado sem sobras
const SHEET_W = 1280, SHEET_H = 720;
function fitSheet(sheet, useZoom) {
  const pg = sheet.firstElementChild; let w = 1536, h = 0;
  for (const tw of [1536, 1680, 1840, 2000, 2200, 2400]) {
    w = tw; pg.style.width = w + 'px'; pg.style.height = 'auto'; pg.style.transform = 'none'; pg.style.zoom = '';
    h = pg.scrollHeight; if (h <= w * 9 / 16) break;
  }
  const H = Math.max(h, Math.round(w * 9 / 16)); pg.style.height = H + 'px';
  const s = Math.min(SHEET_W / w, SHEET_H / H), dx = (SHEET_W - w * s) / 2, dy = (SHEET_H - H * s) / 2;
  if (useZoom) { sheet.classList.add('zm'); pg.style.zoom = s.toFixed(4); }  // impressão: o zoom reduz o tamanho real, então nada é cortado entre folhas
  else pg.style.transform = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) scale(${s.toFixed(4)})`;
}

function pLesionados() {
  const at = lesAtivas().sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status) || b.data.localeCompare(a.data)), ats = atletasCat();
  const n = s => new Set(at.filter(l => l.status === s).map(l => l.atletaId)).size, noDM = new Set(at.map(l => l.atletaId)).size;
  const rows = at.map(l => { const a = atl(l.atletaId); return `<tr><td class="l">${athCell(a)}</td><td>${ptag(a?.posicao)}</td><td class="l">${esc(lesNome(l))}</td><td class="l">${esc(regLong(l))}</td><td>${fmtD(l.data)}</td><td>${esc(l.local || '')}</td><td><b>${diasFora(l)}</b></td><td>${chip(l.status)}</td><td>${fmtD(l.previsao)}</td><td class="l" style="white-space:normal;max-width:260px">${esc((l.tratamentos || []).join(', '))}</td></tr>`; }).join('');
  return header({ title: 'ATLETAS NO DM', items: hdrItems() }) + `<div style="height:16px"></div><div class="kpis k4">
    ${kpi('user', 'Atletas no DM', noDM, pct(noDM, ats.length) + ' do elenco')}
    ${kpi('clock', 'Em tratamento', n('tratamento'), 'tratamento no DM', 'red')}
    ${kpi('run', 'Transição', n('transicao'), 'iniciando com o grupo', 'gold')}
    ${kpi('cycle', 'Retorno gradual', n('retorno'), 'aumentando carga')}</div>
    ${panel('Situação de cada atleta', at.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Pos.</th><th class="l">Lesão</th><th class="l">Região · ponto exato</th><th>Data</th><th>Local</th><th>Dias</th><th>Status</th><th>Previsão</th><th class="l">Condutas</th></tr></thead><tbody>${rows}</tbody></table></div>` : miniEmpty('DM vazio', 'Nenhum atleta lesionado no momento.'), { np: true })}`;
}

function pIndividual(a) {
  const ls = S.lesoes.filter(l => l.atletaId === a.id).sort((x, y) => y.data.localeCompare(x.data));
  const dias = ls.reduce((s, l) => s + diasFora(l), 0), at = ativaDe(a.id), recs = ls.filter(l => l.recorrente).length;
  const lsAno = ls.filter(l => noPeriodo(l.data));
  const meses = MESES.map((_, i) => lsAno.filter(l => +l.data.slice(5, 7) === i + 1).reduce((s, l) => s + diasFora(l), 0));
  const regC = sortEnt(countBy(ls, l => regN(l.regiao))), tipos = sortEnt(countBy(ls, l => l.tipo));
  const profs = (S.config.profissionais || []).filter(p => p.nome);
  const hdr = cont => header({ title: 'RELATÓRIO INDIVIDUAL' + (cont ? ' (CONT.)' : ''), pill: (a.apelido || a.nome).toUpperCase(), items: [['user', 'Categoria', a.subcategoria || a.categoria], ['cal', 'Temporada', anoLabel()], ['clock', 'Emitido em', fmtD(todayISO())]] }) + '<div style="height:14px"></div>';
  const tbl = ls.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th></th><th>Data</th><th class="l">Lesão</th><th class="l">Região · ponto exato</th><th>Local</th><th class="l">Mecanismo</th><th>Dor</th><th>Dias</th><th class="l">Condutas</th><th>Retorno</th><th>Status</th></tr></thead><tbody>${ls.map(l => `<tr><td class="l">${lesThumb(l, 'sm')}</td><td>${fmtD(l.data)}</td><td class="l"><b>${esc(lesNome(l))}</b><br>${natTag(l)}${l.recorrente ? ' <span style="color:var(--red);font-weight:800">● recorrente</span>' : ''}${l.cirurgia ? ' <span style="color:var(--purple);font-weight:800">● cirurgia</span>' : ''}</td><td class="l">${esc(regLong(l))}</td><td>${esc(l.local || '')}</td><td class="l">${esc(l.mecanismo || '')}</td><td>${l.dor ?? '—'}/10</td><td><b>${diasFora(l)}</b></td><td class="l" style="white-space:normal;max-width:240px">${esc((l.tratamentos || []).join(', ') || '—')}</td><td>${fmtD(l.statusDatas?.liberado || l.previsao)}</td><td>${chip(l.status)}</td></tr>`).join('')}</tbody></table></div>` : miniEmpty('Sem lesões registradas', 'Este atleta não teve passagem pelo DM.');
  const det1 = l => `<div class="pdet"><div class="pdet-h">${lesThumb(l)}<b>${esc(lesNome(l))}</b><span>${esc(regLong(l))} · ${fmtD(l.data)}</span>${chip(l.status)}</div>${steps(l)}<div class="pdet-g"><div><h5>Descrição</h5><p>${esc(l.descricao || '—')}</p></div><div><h5>Exames realizados</h5><p>${esc(l.exames || '—')}</p></div><div><h5>Observações</h5><p>${esc(l.obs || '—')}</p></div><div><h5>Responsável</h5><p>${esc(l.responsavel || '—')}</p></div></div></div>`;
  const signs = `<div class="signs">${(profs.length ? profs : [{ nome: '', cargo: 'Responsável' }]).slice(0, 3).map(p => `<div><i></i><b>${esc(p.nome || '\u00a0')}</b><span>${esc(p.cargo || '')}</span></div>`).join('')}<div><i></i><b>&nbsp;</b><span>Atleta / responsável legal</span></div></div>`;
  const pages = [];
  // folha 1: ficha, indicadores e corpo
  pages.push(pageWrap(hdr() + `<div class="ind-top">
    <div class="panel"><div class="ph">Atleta</div><div class="bio">${ava(a, 'lg')}<div style="min-width:0">${ptag(a.posicao)}${subTag(a)}<h3>${esc(a.apelido || a.nome)}</h3><div class="muted">${esc(a.nome)}</div></div></div>
      <div class="bio2"><div><span>Categoria</span><b>${esc(a.categoria)}${a.subcategoria ? ' · ' + esc(a.subcategoria) : ''}</b></div><div><span>Número</span><b>${esc(a.numero || '—')}</b></div><div><span>Função</span><b>${esc(a.posDetalhe || POSN[a.posicao] || '—')}</b></div><div><span>Idade</span><b>${idade(a.nascimento) || '—'} anos</b></div><div><span>Nascimento</span><b>${fmtD(a.nascimento)}</b></div><div><span>Altura · Peso</span><b>${a.altura ? nf(a.altura, 2) + ' m' : '—'} · ${a.peso ? a.peso + ' kg' : '—'}</b></div><div><span>Pé dominante</span><b>${esc(a.pe || '—')}</b></div>${a.gordura ? `<div><span>% de gordura</span><b>${nf(a.gordura, 1)}%</b></div>` : ''}<div><span>Situação atual</span><b>${at ? STATUS[at.status] : 'Disponível'}</b></div></div></div>
    <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
      <div class="kpis k4" style="margin:0">
        ${kpi('med', 'Total de lesões', ls.length, 'Histórico completo')}
        ${kpi('cal', 'Dias afastado', dias + '<small>dias</small>', 'Média ' + nf(ls.length ? dias / ls.length : 0) + ' por lesão')}
        ${kpi('cross', 'Recorrências', recs, pct(recs, ls.length) + ' das lesões', 'red')}
        ${kpi('cycle', 'Retorno previsto', at ? fmtD(at.previsao) : '—', at ? 'Em ' + STATUS[at.status].toLowerCase() + ' desde ' + fmtD(at.data) : 'Sem afastamento ativo', '', 'txt')}
      </div>
      <div class="row r12" style="margin:0;flex:1">
        ${panel('Regiões afetadas', bodyMap({ mode: 'hl', ls }))}
        <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
          ${panel('Regiões e tipos de lesão', `<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">${dist(regC.map(([r, n]) => ({ l: r, v: n, p: pct(n, ls.length) })))}${dist(tipos.map(([t, n]) => ({ l: t, v: n, p: pct(n, ls.length), c: 'linear-gradient(90deg,#d77412,var(--orange))' })))}</div>`)}
          ${panel('Dias afastados por mês · ' + anoLabel(), vbars(MESES, meses, { w: 560, h: 190 }))}
        </div>
      </div>
    </div>
  </div>`));
  // folha 2: tabela de lesões; folhas seguintes: detalhes (4 por folha); assinaturas na última
  const dets = ls.map(det1), chunks = [];
  for (let k = 0; k < dets.length; k += 4) chunks.push(dets.slice(k, k + 4));
  pages.push(pageWrap(hdr(true) + `<div class="grow" style="margin-bottom:14px">${panel('Histórico de lesões', tbl, { np: true })}</div>` + (chunks.length ? '' : signs)));
  chunks.forEach((ch, k) => pages.push(pageWrap(hdr(true) + `<div class="grow" style="margin-bottom:12px">${panel('Detalhes e evolução de cada lesão' + (chunks.length > 1 ? ` · ${k + 1}/${chunks.length}` : ''), `<div class="pdet-list">${ch.join('')}</div>`)}</div>` + (k === chunks.length - 1 ? signs : ''))));
  return pages;
}

function buildPages(kind, aid) {
  PRINT = true;
  try {
    if (kind === 'individual') { const a = atl(aid); return a ? pIndividual(a) : []; }
    if (kind === 'nutind') { const a = atl(aid); return a ? pNutInd(a) : []; }
    if (kind === 'ficha') { const a = atl(aid); return a ? pFicha(a) : []; }
    if (S.view === 'nut-ind') return pNutInd(atl(UI.indAtl));
    if (kind === 'geral') return [pageWrap(renderAs('dm-visao')), pageWrap(pLesionados()), pageWrap(renderAs('dm-regioes')), pageWrap(renderAs('dm-tempo')), pageWrap(renderAs('dm-comparativo'))];
    if (S.view === 'config') return [];
    if (S.view === 'dm-lesionados') return [pageWrap(pLesionados())];
    if (S.view === 'dm-historico') { const a = atl(UI.histAtleta); return a ? pIndividual(a) : []; }
    return [pageWrap(renderAs(S.view))];
  } finally { PRINT = false; }
}

function imprimir(pages) {
  let pr = $('#printRoot'); if (pr) pr.remove();
  pr = document.createElement('div'); pr.id = 'printRoot'; pr.innerHTML = pages.join(''); document.body.appendChild(pr);
  // cada folha cabe numa página A4 deitada; a ficha individual longa pode ocupar mais de uma
  pr.querySelectorAll('.sheet').forEach(sh => fitSheet(sh, true));
  document.body.classList.add('printing');
  const done = () => { document.body.classList.remove('printing'); pr.remove(); removeEventListener('afterprint', done); };
  addEventListener('afterprint', done);
  setTimeout(() => { try { window.print(); } catch (e) { toast('A impressão não abriu aqui. Use “Baixar PDF”.', true); } setTimeout(() => { if (document.body.classList.contains('printing')) done(); }, 2000); }, 350);
}

const LIBS = { xlsx: '/libs/xlsx.full.min.js', h2c: '/libs/html2canvas.min.js', jspdf: '/libs/jspdf.umd.min.js' };
function loadLib(k) { return new Promise((res, rej) => { if ((k === 'h2c' && window.html2canvas) || (k === 'jspdf' && window.jspdf) || (k === 'xlsx' && window.XLSX)) return res(); const sc = document.createElement('script'); sc.src = LIBS[k]; sc.onload = res; sc.onerror = rej; document.head.appendChild(sc); }); }
function progress(msg) { let p = $('#pdfProg'); if (!p) { p = document.createElement('div'); p.id = 'pdfProg'; document.body.appendChild(p); } p.innerHTML = `<div><span class="spin"></span>${esc(msg)}</div>`; }
const progressEnd = () => $('#pdfProg')?.remove();
// o gerador de PDF não entende variáveis CSS dentro de SVG: grava as cores já calculadas
function fixSvg(root) {
  root.querySelectorAll('svg *').forEach(n => {
    const cs = getComputedStyle(n);
    if (n.tagName === 'image' || n.tagName === 'defs' || n.tagName === 'stop' || n.tagName === 'linearGradient' || n.tagName === 'title') return;
    const f = n.getAttribute('fill') || ''; if (!f.startsWith('url(')) n.setAttribute('fill', cs.fill);
    const s = n.getAttribute('stroke') || ''; if (!s.startsWith('url(')) n.setAttribute('stroke', cs.stroke);
    if (n.tagName === 'text') { n.setAttribute('font-family', cs.fontFamily); n.setAttribute('font-weight', cs.fontWeight); n.setAttribute('font-size', cs.fontSize); }
    if (cs.fillOpacity !== '1') n.setAttribute('fill-opacity', cs.fillOpacity);
    n.removeAttribute('class'); n.removeAttribute('style');
  });
}
async function gerarPDF(pages, kind, aid) {
  progress('Preparando o PDF…');
  try { await Promise.all([loadLib('h2c'), loadLib('jspdf')]); } catch (e) { progressEnd(); toast('Não foi possível carregar o gerador de PDF. Verifique a conexão ou use Imprimir.', true); return; }
  try { await document.fonts.ready; } catch (e) { }
  const holder = document.createElement('div'); holder.id = 'pdfHolder'; document.body.appendChild(holder);
  const { jsPDF } = window.jspdf; let pdf = null;
  try {
    for (let i = 0; i < pages.length; i++) {
      progress(`Gerando página ${i + 1} de ${pages.length}…`);
      holder.innerHTML = pages[i]; const el = holder.firstElementChild;
      await new Promise(r => setTimeout(r, 120)); fitSheet(el); fixSvg(el);
      const cv = await html2canvas(el, { scale: 2, backgroundColor: '#eef2ef', useCORS: true, logging: false, windowWidth: 2500, windowHeight: 1600, scrollX: 0, scrollY: 0, width: SHEET_W, height: SHEET_H });
      const pw = 960, ph = 540, fmt = [pw, ph], ori = 'landscape';
      if (!pdf) pdf = new jsPDF({ orientation: ori, unit: 'pt', format: fmt, compress: true }); else pdf.addPage(fmt, ori);
      pdf.addImage(cv.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, pw, ph, undefined, 'FAST');
    }
    progress('Finalizando…');
    const blob = pdf.output('blob'); holder.remove();
    const a = aid ? atl(aid) : null;
    const nome = kind === 'ficha' && a ? `Ficha-${a.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}-${todayISO()}.pdf` : kind === 'nutind' && a ? `Relatorio-Nutricional-${a.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}-${todayISO()}.pdf` : kind === 'individual' && a ? `Relatorio-Individual-${a.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}-${todayISO()}.pdf` : `Relatorio-DM-${kind === 'geral' ? 'Geral' : (TITLES[S.view] || ['Pagina'])[1].replace(/\s+/g, '-') || 'Pagina'}-${todayISO()}.pdf`;
    progressEnd();
    const dl = window.claude && await window.claude.use('downloads');
    if (dl) { try { await dl.save({ filename: nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ''), data: blob }); toast('PDF salvo'); } catch (e) { if (e && e.code !== 'declined') toast('Não foi possível salvar o PDF.', true); } }
    else { const u = URL.createObjectURL(blob); const ln = document.createElement('a'); ln.href = u; ln.download = nome; document.body.appendChild(ln); ln.click(); ln.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); }
  } catch (e) { console.error(e); holder.remove(); progressEnd(); toast('Erro ao gerar o PDF. Tente usar Imprimir.', true); }
}

/* ================= IMPORTAR DADOS ================= */
const IMP = { tipo: 'atletas', file: null, sheets: null, sheet: 0, rows: null, res: null, opts: { categoria: 'Sub-15', posicao: 'MEI', criar: true }, busy: false };
const nrm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9%]/g, '');
const nrmName = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
const ALIAS_ATL = {
  nome: ['nome', 'nomecompleto', 'atleta', 'jogador', 'nomedoatleta'], apelido: ['apelido', 'nomedeguerra', 'nomecamisa', 'nomenacamisa'],
  numero: ['numero', 'n', 'no', 'num', 'camisa', 'ncamisa', 'numerodacamisa'], nascimento: ['nascimento', 'datadenascimento', 'datanascimento', 'dn', 'dtnasc', 'datanasc', 'nasc', 'datadenasc'],
  categoria: ['categoria', 'cat'], subcategoria: ['subcategoria', 'sub'], posicao: ['posicao', 'pos', 'posicaoprincipal'], posDetalhe: ['funcao', 'posicaodetalhada', 'posicaoespecifica'],
  pe: ['pe', 'pedominante', 'perna', 'pernadominante', 'lateralidade'], altura: ['altura', 'alt', 'estatura', 'alturam'], peso: ['peso', 'massa', 'massacorporal', 'pesokg']
};
const ALIAS_LES = {
  atleta: ['atleta', 'nome', 'jogador', 'nomedoatleta', 'nomecompleto'], data: ['data', 'datadalesao', 'datalesao', 'dia', 'datainicio', 'datadeinicio', 'inicio'],
  tipo: ['tipo', 'lesao', 'tipodelesao', 'tipolesao', 'diagnostico'], grau: ['grau', 'graudalesao'], regiao: ['regiao', 'localdador', 'regiaodocorpo', 'regiaodalesao', 'area', 'parte', 'partedocorpo'],
  lado: ['lado', 'membro', 'lateralidade'], musculo: ['musculo', 'pontoexato', 'estrutura', 'musculoexato'], local: ['ondeaconteceu', 'ocorrencia', 'contexto', 'local', 'situacaodalesao', 'momento'],
  mecanismo: ['mecanismo', 'mecanismodalesao', 'causa'], dor: ['dor', 'eva', 'intensidade', 'intensidadedador'], dias: ['dias', 'diasafastado', 'diasfora', 'diasdeafastamento', 'afastamento', 'tempoafastado', 'diasafastamento'],
  previsao: ['previsao', 'previsaoderetorno', 'retorno', 'dataretorno', 'datadealta', 'alta', 'datadoretorno', 'previsaoretorno'], status: ['status', 'situacao', 'fase', 'situacaoatual'],
  tratamentos: ['condutas', 'tratamento', 'tratamentos', 'conduta'], exames: ['exames', 'exame', 'examesrealizados'], descricao: ['descricao', 'historico', 'relato'],
  obs: ['obs', 'observacoes', 'observacao'], cirurgia: ['cirurgia', 'cirurgico'], recorrente: ['recorrente', 'recidiva', 'recorrencia'], responsavel: ['responsavel', 'fisioterapeuta', 'profissional']
};
const REQ = { atletas: ['nome'], lesoes: ['atleta', 'data', 'regiao'] };
const FIELD_LABEL = { nome: 'Nome', apelido: 'Apelido', numero: 'Número', nascimento: 'Nascimento', categoria: 'Categoria', subcategoria: 'Subcategoria', posicao: 'Posição', posDetalhe: 'Função', pe: 'Pé dominante', altura: 'Altura', peso: 'Peso', atleta: 'Atleta', data: 'Data da lesão', tipo: 'Tipo de lesão', grau: 'Grau', regiao: 'Região', lado: 'Lado', musculo: 'Músculo', local: 'Onde aconteceu', mecanismo: 'Mecanismo', dor: 'Dor (0–10)', dias: 'Dias afastado', previsao: 'Previsão / retorno', status: 'Status', tratamentos: 'Condutas', exames: 'Exames', descricao: 'Descrição', obs: 'Observações', cirurgia: 'Cirurgia', recorrente: 'Recorrente', responsavel: 'Responsável' };

function parseDate(v) {
  if (v == null || v === '') return '';
  if (v instanceof Date && !isNaN(v)) return v.getFullYear() + '-' + pad(v.getMonth() + 1) + '-' + pad(v.getDate());
  if (typeof v === 'number' && v > 20000 && v < 80000) { const d = new Date(Date.UTC(1899, 11, 30) + v * 864e5); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); }
  const s = String(v).trim(); let m;
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  if ((m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/))) { let y = +m[3]; if (y < 100) y += y > 40 ? 1900 : 2000; return `${y}-${pad(m[2])}-${pad(m[1])}`; }
  return '';
}
const numOr = v => { if (v === '' || v == null) return ''; const n = parseFloat(String(v).replace(',', '.').replace(/[^\d.\-]/g, '')); return isNaN(n) ? '' : n; };
function mapPos(v) {
  const s = nrm(v); if (!s) return '';
  if (POS.includes(s.toUpperCase())) return s.toUpperCase();
  if (/^(ld|le|lat|lateral)/.test(s)) return 'LAT'; if (/^(pd|pe|ponta|extremo|ext)/.test(s)) return 'EXT';
  if (/gol/.test(s)) return 'GOL'; if (/zag|beque|defensor/.test(s)) return 'ZAG'; if (/vol/.test(s)) return 'VOL'; if (/mei|meio|armador/.test(s)) return 'MEI'; if (/ata|centroav|cent|ca$/.test(s)) return 'ATA';
  return '';
}
function mapPe(v) { const s = nrm(v); if (!s) return ''; if (/^(d|dir|destro|direito)/.test(s)) return 'Direito'; if (/^(e|esq|canhoto|esquerdo)/.test(s)) return 'Esquerdo'; if (/amb/.test(s)) return 'Ambidestro'; return ''; }
function mapCat(v, nasc) { const m = String(v ?? '').match(/(\d{1,2})/); if (m) { const sub = 'Sub-' + +m[1]; if (GRUPO_DE[sub]) return { cat: GRUPO_DE[sub], sub: GRUPOS[sub] ? '' : sub }; if (GRUPOS[sub]) return { cat: sub, sub: '' }; } const q = subPorIdade(nasc, S.config.anoBase); return q.cat ? { cat: q.cat, sub: q.sub } : {}; }
const REG_SYN = [
  ['posterior', /posterior|isquio|isquiotib|hamstring|biceps femoral|semitend|semimemb/], ['adutor', /adut|gracil/], ['quadriceps', /quadric|reto femoral|vasto|coxa anterior|anterior da coxa/],
  ['aquiles', /aquiles|calcane[oa]? tend/], ['panturrilha', /pantur|gastroc|soleo|batata/], ['tornozelo', /tornoz|maleol/], ['joelho', /joelho|patela|menisco|lca|lcp|ligamento cruzado|ligamento colateral/],
  ['canela', /tibia|fibula|canela|perna/], ['gluteo', /glute/], ['virilha', /virilha|quadril|pubis|pubalgia|iliopsoas|inguinal/], ['lombar', /lombar|coluna lombar|lombo/],
  ['dorsal', /dorsal|costas|escapul|trapezio medio|grande dorsal/], ['abdomen', /abdom|obliqu|reto abdominal/], ['torax', /torax|peit|costela|esterno/], ['pescoco', /pescoco|cervical|trapezio/],
  ['cabeca', /cabeca|face|crani|nariz|olho|boca/], ['ombro', /ombro|deltoid|clavic|manguito/], ['antebraco', /antebraco|cotovelo|braquiorrad/], ['mao', /mao|punho|dedo|polegar/], ['braco', /braco|biceps|triceps|umero/], ['pe', /\bpe\b|pes|calcanhar|metatars|halux|dedo do pe/], ['quadriceps', /coxa/]
];
function mapRegiao(v) { const s = nrmName(v); if (!s) return ''; for (const [k] of REG_SYN) if (nrm(regN(k)) === nrm(v) || k === nrm(v)) return k; for (const [k, re] of REG_SYN) if (re.test(s)) return k; return ''; }
function mapLado(v, ctx) { const s = nrm(v); if (/^(d|dir|direit|dto|r$|right)/.test(s)) return 'D'; if (/^(e|esq|esquerd|l$|left)/.test(s)) return 'E'; const c = nrmName(ctx); if (/\bdireit|\(d\)|\bdir\b|\bd$|\bdto\b/.test(c)) return 'D'; if (/\besquerd|\(e\)|\besq\b|\be$/.test(c)) return 'E'; return ''; }
function mapStatus(v) { const s = nrm(v); if (!s) return ''; if (/libera|alta|apto|recuperad/.test(s)) return 'liberado'; if (/gradual|retorno/.test(s)) return 'retorno'; if (/transi/.test(s)) return 'transicao'; if (/trat|dm|ativ|fisio/.test(s)) return 'tratamento'; return ''; }
const mapBool = v => /^(s|sim|x|1|true|yes)/.test(nrm(v));
function mapTipo(v) { const s = nrm(v); if (!s) return ''; const hit = S.config.tipos.find(t => nrm(t) === s) || S.config.tipos.find(t => s.includes(nrm(t).slice(0, 6))); if (hit) return hit; if (/distens/.test(s)) return 'Distensão Muscular'; if (/estira/.test(s)) return 'Estiramento'; if (/ruptura|rotura/.test(s)) return /lig/.test(s) ? 'Ruptura Ligamentar' : 'Ruptura Muscular'; if (/sobrecarga|fadiga/.test(s)) return 'Sobrecarga Muscular'; if (/entorse|torcao/.test(s)) return 'Entorse'; if (/contus|pancada|trauma/.test(s)) return 'Contusão'; if (/tendin|tendino/.test(s)) return 'Tendinite'; if (/fratur/.test(s)) return 'Fratura'; if (/luxa/.test(s)) return 'Luxação'; return String(v).trim(); }
function mapGrau(v) { const m = String(v ?? '').match(/[123]/); return m ? 'Grau ' + m[0] : '—'; }
function mapLocal(v) { const s = nrm(v); if (/jogo|partida|competi/.test(s)) return 'Jogo'; if (/trein/.test(s)) return 'Treino'; if (s) return 'Fora do clube'; return ''; }
function findMusc(reg, lado, txt) { const s = nrm(txt); if (!s || !reg) return ''; const c = SEGS.filter(sg => sg[0] === reg && (!lado || !sg[1] || sg[1] === lado)); const h = c.find(sg => nrm(sg[2]) === s) || c.find(sg => s.includes(nrm(sg[2]))) || c.find(sg => s.length > 5 && s.includes(nrm(sg[2]).slice(0, 7))); return h ? h[2] : ''; }

function headerMap(hdr, alias) {
  const map = {}; hdr.forEach((h, i) => { const n = nrm(h); if (!n) return; for (const [f, list] of Object.entries(alias)) { if (map[f] !== undefined) continue; if (list.includes(n)) { map[f] = i; return; } } });
  hdr.forEach((h, i) => { const n = nrm(h); if (!n || Object.values(map).includes(i)) return; for (const [f, list] of Object.entries(alias)) { if (map[f] !== undefined) continue; if (list.some(a => a.length > 3 && n.startsWith(a))) { map[f] = i; return; } } });
  return map;
}
function findAtleta(nome) {
  const n = nrmName(nome); if (!n) return null;
  let a = S.atletas.find(x => nrmName(x.nome) === n || (x.apelido && nrmName(x.apelido) === n)); if (a) return a;
  const p = n.split(' '); if (p.length >= 2) a = S.atletas.find(x => { const q = nrmName(x.nome).split(' '); return q[0] === p[0] && q[q.length - 1] === p[p.length - 1]; });
  return a || null;
}

function analisar() {
  const I = IMP, sh = I.sheets[I.sheet]; if (!sh) return;
  const alias = I.tipo === 'atletas' ? ALIAS_ATL : ALIAS_LES;
  // procura a linha de cabeçalho nas 10 primeiras linhas
  let hi = 0, best = -1; for (let r = 0; r < Math.min(10, sh.rows.length); r++) { const n = Object.keys(headerMap(sh.rows[r], alias)).length; if (n > best) { best = n; hi = r; } }
  const hdr = sh.rows[hi] || [], map = headerMap(hdr, alias);
  const falta = REQ[I.tipo].filter(f => map[f] === undefined);
  const out = [];
  const g = (row, f) => map[f] === undefined ? '' : row[map[f]];
  const novosAtl = new Map();
  for (const row of sh.rows.slice(hi + 1)) {
    if (!row.some(c => String(c ?? '').trim() !== '')) continue;
    if (I.tipo === 'atletas') {
      const nome = String(g(row, 'nome') ?? '').trim(); if (!nome) { out.push({ err: 'Sem nome', raw: row }); continue; }
      const nasc = parseDate(g(row, 'nascimento')); const c = mapCat(g(row, 'subcategoria') || g(row, 'categoria'), nasc); const pos = mapPos(g(row, 'posicao')) || I.opts.posicao;
      let alt = numOr(g(row, 'altura')); if (alt && alt > 3) alt = alt / 100;
      const ex = findAtleta(nome);
      const o = { ...(ex || {}), id: ex ? ex.id : uid('a'), nome, apelido: String(g(row, 'apelido') ?? '').trim() || ex?.apelido || '', numero: String(g(row, 'numero') ?? '').trim() || ex?.numero || '', nascimento: nasc || ex?.nascimento || '', categoria: c.cat || ex?.categoria || I.opts.categoria, subcategoria: c.sub || ex?.subcategoria || '', posicao: pos, posDetalhe: String(g(row, 'posDetalhe') ?? '').trim() || (POSDET[pos] || []).find(x => nrm(x) === nrm(g(row, 'posicao'))) || ex?.posDetalhe || (POSDET[pos] || [''])[0], pe: mapPe(g(row, 'pe')) || ex?.pe || 'Direito', altura: alt ? String(alt) : ex?.altura || '', peso: numOr(g(row, 'peso')) !== '' ? String(numOr(g(row, 'peso'))) : ex?.peso || '' };
      if (!o.subcategoria && o.nascimento) { const q = subPorIdade(o.nascimento, S.config.anoBase); if (q.cat === o.categoria) o.subcategoria = q.sub; }
      out.push({ obj: o, acao: ex ? 'atualiza' : 'novo' });
    } else {
      const nome = String(g(row, 'atleta') ?? '').trim(), data = parseDate(g(row, 'data'));
      const regTxt = String(g(row, 'regiao') ?? ''), reg = mapRegiao(regTxt);
      const errs = []; if (!nome) errs.push('sem atleta'); if (!data) errs.push('data inválida'); if (!reg) errs.push(regTxt ? `região “${regTxt}” não reconhecida` : 'sem região');
      if (errs.length) { out.push({ err: errs.join(', '), raw: row, nome }); continue; }
      let a = findAtleta(nome), criado = false;
      if (!a) { const k = nrmName(nome); if (!I.opts.criar) { out.push({ err: `atleta “${nome}” não cadastrado`, raw: row, nome }); continue; } a = novosAtl.get(k); if (!a) { a = { id: uid('a'), nome, apelido: '', numero: '', nascimento: '', categoria: I.opts.categoria, subcategoria: '', posicao: I.opts.posicao, posDetalhe: (POSDET[I.opts.posicao] || [''])[0], pe: 'Direito', altura: '', peso: '' }; novosAtl.set(k, a); } criado = true; }
      let lado = mapLado(g(row, 'lado'), regTxt); if (!REG[reg][2] && !/^(d|e)/.test(nrm(g(row, 'lado')))) lado = lado || '';
      const musc = findMusc(reg, lado, g(row, 'musculo') || regTxt);
      const dias = numOr(g(row, 'dias')); let prev = parseDate(g(row, 'previsao')); if (!prev && dias !== '') prev = addDays(data, Math.round(dias));
      let st = mapStatus(g(row, 'status')); if (!st) st = prev && prev < todayISO() ? 'liberado' : 'tratamento';
      const sd = { tratamento: data }; if (st !== 'tratamento') { ORDER.slice(1, ORDER.indexOf(st) + 1).forEach(s2 => sd[s2] = s2 === 'liberado' ? (prev && prev <= todayISO() ? prev : todayISO()) : (prev && prev <= todayISO() ? prev : todayISO())); }
      const trat = String(g(row, 'tratamentos') ?? '').split(/[;,\/\n]+/).map(t => t.trim()).filter(Boolean).map(t => S.config.condutas.find(c => nrm(c) === nrm(t)) || t);
      const dup = S.lesoes.find(l => l.atletaId === a.id && l.data === data && l.regiao === reg && (l.lado || '') === lado);
      const o = { ...(dup || {}), id: dup ? dup.id : uid('l'), atletaId: a.id, data, local: mapLocal(g(row, 'local')) || 'Treino', mecanismo: String(g(row, 'mecanismo') ?? '').trim() || 'Outro', responsavel: String(g(row, 'responsavel') ?? '').trim(), tipo: mapTipo(g(row, 'tipo')) || 'Outros', grau: mapGrau(g(row, 'grau')), regiao: reg, lado, musculo: musc, dor: numOr(g(row, 'dor')) !== '' ? Math.max(0, Math.min(10, Math.round(numOr(g(row, 'dor'))))) : 5, descricao: String(g(row, 'descricao') ?? '').trim(), exames: String(g(row, 'exames') ?? '').trim(), tratamentos: trat, previsao: prev, status: st, statusDatas: sd, cirurgia: mapBool(g(row, 'cirurgia')), recorrente: mapBool(g(row, 'recorrente')), obs: String(g(row, 'obs') ?? '').trim(), criadoEm: todayISO() };
      if (REG[reg][2] && !lado) { out.push({ err: 'sem lado (direito/esquerdo)', raw: row, nome }); continue; }
      out.push({ obj: o, atleta: a, criado, acao: dup ? 'atualiza' : 'novo' });
    }
  }
  I.res = { hdr, map, falta, out, novosAtl: [...novosAtl.values()] };
}

async function lerArquivo(file) {
  IMP.file = file.name; IMP.sheets = null; IMP.res = null; IMP.busy = true; render();
  try {
    if (/\.json$/i.test(file.name)) {
      const j = JSON.parse(await file.text());
      const atls = Array.isArray(j.atletas) ? j.atletas : Array.isArray(j) ? j : null;
      if (!atls) throw new Error('json');
      IMP.tipo = 'atletas';
      const hdr = ['nome', 'apelido', 'numero', 'nascimento', 'categoria', 'subcategoria', 'posicao', 'funcao', 'pe', 'altura', 'peso'];
      IMP.sheets = [{ name: j.sistema || 'Backup', rows: [hdr, ...atls.map(a => [a.nome, a.apelido, a.numero, a.nascimento, a.categoria, a.subcategoria, a.posicao, a.posDetalhe, a.pe, a.altura, a.peso])], fotos: atls.map(a => a.foto || '') }];
      if (Array.isArray(j.lesoes) && j.lesoes.length) toast('Este é um backup do DM: use Configurações → Restaurar backup para trazer as lesões.', false);
    } else {
      await loadLib('xlsx');
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true });
      IMP.sheets = wb.SheetNames.map(n => ({ name: n, rows: XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: '', raw: true }) })).filter(s => s.rows.length);
      if (!IMP.sheets.length) throw new Error('vazio');
    }
    IMP.sheet = 0; analisar();
  } catch (e) { console.warn(e); IMP.sheets = null; toast(e.message === 'json' ? 'Esse arquivo JSON não tem uma lista de atletas.' : 'Não consegui ler esse arquivo. Use Excel (.xlsx/.xls), CSV ou o backup .json da Minutagem.', true); }
  IMP.busy = false; render();
}

async function saveMany(col, objs) {
  if (!objs.length) return;
  const m = new Map(S[col].map(x => [x.id, x])); objs.forEach(o => m.set(o.id, o)); S[col] = [...m.values()];
  if (db) { for (let i = 0; i < objs.length; i += 20) { await Promise.all(objs.slice(i, i + 20).map(o => db.collection(col).doc(o.id).set(JSON.parse(JSON.stringify(o))).catch(dbErr))); } } else lsSave();
}
async function confirmarImport() {
  const R = IMP.res; if (!R) return; const ok = R.out.filter(x => x.obj);
  if (!ok.length) { toast('Nenhuma linha válida para importar.', true); return; }
  IMP.busy = true; render();
  try {
    if (IMP.tipo === 'atletas') {
      const fotos = IMP.sheets[IMP.sheet].fotos; if (fotos) ok.forEach((x, i) => { if (fotos[i] && !x.obj.foto) x.obj.foto = fotos[i]; });
      await saveMany('atletas', ok.map(x => x.obj));
      toast(`${ok.length} atleta(s) importado(s)`);
    } else {
      await saveMany('atletas', R.novosAtl);
      await saveMany('lesoes', ok.map(x => x.obj));
      toast(`${ok.length} lesão(ões) importada(s)${R.novosAtl.length ? ` · ${R.novosAtl.length} atleta(s) novo(s)` : ''}`);
    }
    IMP.sheets = null; IMP.res = null; IMP.file = null;
  } catch (e) { toast('Erro ao importar. Tente novamente.', true); }
  IMP.busy = false;
  go(IMP.tipo === 'atletas' ? 'atletas' : 'dm-lesionados');
}
async function baixarModelo(tipo) {
  const linhas = tipo === 'atletas'
    ? [['Nome', 'Apelido', 'Número', 'Nascimento', 'Categoria', 'Posição', 'Função', 'Pé dominante', 'Altura', 'Peso'], ['João da Silva', 'Joãozinho', '10', '15/03/2011', 'Sub-15', 'MEI', 'Meia Armador', 'Direito', '1,70', '60']]
    : [['Atleta', 'Data da lesão', 'Tipo de lesão', 'Grau', 'Região', 'Lado', 'Músculo', 'Onde aconteceu', 'Mecanismo', 'Dor', 'Dias afastado', 'Previsão de retorno', 'Status', 'Condutas', 'Exames', 'Descrição', 'Observações', 'Cirurgia', 'Recorrente', 'Responsável'],
       ['João da Silva', '12/09/2026', 'Distensão Muscular', '2', 'Posterior de Coxa', 'Direito', 'Bíceps femoral', 'Jogo', 'Corrida / Sprint', '7', '21', '', 'Em tratamento', 'Fisioterapia; Fortalecimento', 'Ultrassom', 'Dor súbita no sprint', '', 'Não', 'Não', (S.config.profissionais[0] || {}).nome || '']];
  const csv = '\ufeff' + linhas.map(r => r.map(c => /[;"\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c).join(';')).join('\r\n');
  try { const dl = window.claude && await window.claude.use('downloads'); if (!dl) { toast('O download não está disponível nesta visualização.', true); return; } await dl.save({ filename: `modelo-importacao-${tipo}.csv`, data: csv }); } catch (e) { if (e && e.code !== 'declined') toast('Não foi possível baixar o modelo.', true); }
}

function vImportar() {
  const I = IMP, R = I.res;
  const tabs = `<nav class="subtabs"><button data-go="atletas">Cadastro</button><button class="on" data-go="importar">Importar dados</button></nav>`;
  const tipoCard = (v, t, d, cols) => `<label class="rk"><input type="radio" name="impTipo" value="${v}" ${I.tipo === v ? 'checked' : ''}><span style="flex:1"><b>${t}</b><small>${d}</small><span class="cols">${cols.map(c => `<i class="${REQ[v].includes(c) ? 'req' : ''}">${FIELD_LABEL[c]}</i>`).join('')}</span></span></label>`;
  let prev = '';
  if (I.busy) prev = `<div class="mini-empty"><span class="spin" style="display:inline-block;border-top-color:var(--g500);border-color:var(--line);border-top-color:var(--g500)"></span><br>Processando…</div>`;
  else if (R) {
    const ok = R.out.filter(x => x.obj), nov = ok.filter(x => x.acao === 'novo').length, upd = ok.length - nov, bad = R.out.filter(x => x.err);
    const rec = Object.entries(R.map).map(([f, i]) => `<span class="mapc"><b>${esc(R.hdr[i])}</b> → ${FIELD_LABEL[f]}</span>`).join('');
    const rowsA = r => `<tr class="${r.err ? 'bad' : ''}"><td>${r.err ? `<span class="st st-tratamento">Erro</span>` : r.acao === 'novo' ? '<span class="st st-ok">Novo</span>' : '<span class="st st-liberado">Atualiza</span>'}</td>${r.obj ? `<td class="l"><b>${esc(r.obj.nome)}</b></td><td>${esc(r.obj.numero || '—')}</td><td>${ptag(r.obj.posicao)}</td><td>${esc(r.obj.categoria)}${r.obj.subcategoria ? ' · ' + esc(r.obj.subcategoria) : ''}</td><td>${fmtD(r.obj.nascimento)}</td><td>${esc(r.obj.pe)}</td><td>${r.obj.altura ? nf(r.obj.altura, 2) : '—'}</td><td>${esc(r.obj.peso || '—')}</td>` : `<td class="l" colspan="8" style="color:var(--red)">${esc(r.err)}</td>`}</tr>`;
    const rowsL = r => `<tr class="${r.err ? 'bad' : ''}"><td>${r.err ? `<span class="st st-tratamento">Erro</span>` : r.acao === 'novo' ? '<span class="st st-ok">Nova</span>' : '<span class="st st-liberado">Atualiza</span>'}</td>${r.obj ? `<td class="l"><b>${esc(r.atleta.nome)}</b>${r.criado ? ' <span class="subtag" style="background:#fff3cd;color:#8a6200;border-color:#f1d27a">novo atleta</span>' : ''}</td><td>${fmtD(r.obj.data)}</td><td class="l">${esc(lesNome(r.obj))}</td><td class="l">${esc(regLong(r.obj))}</td><td>${esc(r.obj.local)}</td><td>${diasFora(r.obj)}</td><td>${chip(r.obj.status)}</td><td>${fmtD(r.obj.previsao)}</td>` : `<td class="l">${esc(r.nome || '—')}</td><td class="l" colspan="7" style="color:var(--red)">${esc(r.err)}</td>`}</tr>`;
    prev = `${R.falta.length ? `<div class="warn">Não encontrei a(s) coluna(s) obrigatória(s): <b>${R.falta.map(f => FIELD_LABEL[f]).join(', ')}</b>. Confira o cabeçalho da planilha ou baixe o modelo.</div>` : ''}
      <div class="counters"><span><b>${ok.length}</b> prontos</span><span><b>${nov}</b> ${I.tipo === 'atletas' ? 'novos' : 'novas'}</span><span><b>${upd}</b> atualizam registros existentes</span>${I.tipo === 'lesoes' ? `<span><b>${R.novosAtl.length}</b> atleta(s) a cadastrar</span>` : ''}<span style="${bad.length ? 'color:var(--red);border-color:var(--red)' : ''}"><b>${bad.length}</b> com erro (serão ignorados)</span></div>
      <div class="mapline"><span class="muted">Colunas reconhecidas:</span> ${rec || '<span class="muted">nenhuma</span>'}</div>
      <div class="tbl-wrap" style="max-height:440px;overflow:auto;border:1px solid var(--line);border-radius:8px"><table class="t"><thead><tr><th>Situação</th>${I.tipo === 'atletas' ? '<th class="l">Nome</th><th>Nº</th><th>Pos.</th><th>Categoria</th><th>Nascimento</th><th>Pé</th><th>Altura</th><th>Peso</th>' : '<th class="l">Atleta</th><th>Data</th><th class="l">Lesão</th><th class="l">Região · ponto exato</th><th>Local</th><th>Dias</th><th>Status</th><th>Previsão</th>'}</tr></thead><tbody>${R.out.slice(0, 300).map(I.tipo === 'atletas' ? rowsA : rowsL).join('')}</tbody></table></div>
      ${R.out.length > 300 ? `<p class="muted" style="font-size:12.5px">Mostrando as primeiras 300 de ${R.out.length} linhas; todas serão importadas.</p>` : ''}
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px;flex-wrap:wrap"><button class="btn" data-act="imp-cancel">Cancelar</button><button class="btn pri" data-act="imp-ok" ${ok.length && !R.falta.length ? '' : 'disabled'}>${IC.check} Importar ${ok.length} ${I.tipo === 'atletas' ? 'atleta(s)' : 'lesão(ões)'}</button></div>`;
  } else prev = `<div class="mini-empty">Escolha um arquivo no passo 2 para ver a prévia aqui.</div>`;
  return `<div class="page-h"><h2>Atletas</h2><span class="muted">Importar dados de planilhas</span></div>${tabs}
  <div class="row r2" style="align-items:start">
    ${panel('1 · O que você quer importar?', `<div class="rk-list">
      ${tipoCard('atletas', 'Atletas', 'Cadastro do elenco. Atletas que já existem (mesmo nome) são atualizados. Aceita também o backup .json do Sistema de Minutagem.', ['nome', 'apelido', 'numero', 'nascimento', 'categoria', 'posicao', 'pe', 'altura', 'peso'])}
      ${tipoCard('lesoes', 'Lesões', 'Histórico de lesões do DM. O atleta é encontrado pelo nome; região e lado são reconhecidos pelo texto (ex.: “Posterior de coxa D”).', ['atleta', 'data', 'regiao', 'lado', 'tipo', 'grau', 'musculo', 'local', 'dias', 'previsao', 'status', 'tratamentos'])}
    </div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn sm" data-act="imp-modelo" data-t="atletas">${IC.down} Modelo de atletas (.csv)</button><button class="btn sm" data-act="imp-modelo" data-t="lesoes">${IC.down} Modelo de lesões (.csv)</button></div><p class="muted" style="font-size:12.5px;margin:10px 0 0">Colunas em verde são obrigatórias. Os nomes das colunas podem variar; o sistema reconhece os mais comuns.</p>`)}
    ${panel('2 · Escolha o arquivo', `<label class="drop" id="dropZone">${IC.upload}<b>${I.file ? esc(I.file) : 'Clique para escolher ou arraste o arquivo aqui'}</b><span>Excel (.xlsx, .xls), CSV${I.tipo === 'atletas' ? ' ou backup .json da Minutagem' : ''}</span><input type="file" id="impFile" accept=".xlsx,.xls,.csv,.json" hidden></label>
      ${I.sheets && I.sheets.length > 1 ? `<div class="f" style="margin-top:12px"><label for="impSheet">Aba da planilha</label><select id="impSheet">${I.sheets.map((s, i) => `<option value="${i}" ${i === I.sheet ? 'selected' : ''}>${esc(s.name)} (${s.rows.length} linhas)</option>`).join('')}</select></div>` : ''}
      <div class="form" style="grid-template-columns:1fr 1fr;margin-top:12px">
        <div class="f"><label for="impCat">Categoria quando não houver</label><select id="impCat">${opts(Object.keys(GRUPOS), I.opts.categoria)}</select></div>
        <div class="f"><label for="impPos">Posição quando não houver</label><select id="impPos">${POS.map(p => `<option value="${p}" ${p === I.opts.posicao ? 'selected' : ''}>${p} · ${POSN[p]}</option>`).join('')}</select></div>
        ${I.tipo === 'lesoes' ? `<label class="chk f s2" style="text-transform:none;letter-spacing:0;font-size:14px;color:var(--ink)"><input type="checkbox" id="impCriar" ${I.opts.criar ? 'checked' : ''}>Cadastrar automaticamente atletas que ainda não existem</label>` : ''}
      </div>`)}
  </div>
  ${panel('3 · Confira antes de importar', prev)}`;
}
dmOn('change', e => {
  const t = e.target;
  if (t.name === 'impTipo') { IMP.tipo = t.value; if (IMP.sheets) analisar(); render(); }
  if (t.id === 'impFile' && t.files[0]) lerArquivo(t.files[0]);
  if (t.id === 'impSheet') { IMP.sheet = +t.value; analisar(); render(); }
  if (t.id === 'impCat') { IMP.opts.categoria = t.value; if (IMP.sheets) analisar(); render(); }
  if (t.id === 'impPos') { IMP.opts.posicao = t.value; if (IMP.sheets) analisar(); render(); }
  if (t.id === 'impCriar') { IMP.opts.criar = t.checked; if (IMP.sheets) analisar(); render(); }
});
dmOn('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'imp-ok') confirmarImport();
  if (t.dataset.act === 'imp-cancel') { IMP.sheets = null; IMP.res = null; IMP.file = null; render(); }
  if (t.dataset.act === 'imp-modelo') baixarModelo(t.dataset.t);
  if (t.dataset.act === 'imp-lesoes') { closeModal(); IMP.tipo = 'lesoes'; go('importar'); }
});
dmOn('dragover', e => { const z = e.target.closest && e.target.closest('#dropZone'); if (z) { e.preventDefault(); z.classList.add('over'); } });
dmOn('dragleave', e => { const z = e.target.closest && e.target.closest('#dropZone'); if (z) z.classList.remove('over'); });
dmOn('drop', e => { const z = e.target.closest && e.target.closest('#dropZone'); if (z) { e.preventDefault(); z.classList.remove('over'); const f = e.dataTransfer.files[0]; if (f) lerArquivo(f); } });

/* ================= NUTRIÇÃO ================= */
Object.assign(IC, {
  apple: I('<path d="M12 7c-1.5-1.3-4-1.6-5.6-.4C4.2 8.2 4.3 12 5.6 15c1.2 2.7 3.2 5.6 5 5.4.6-.1.9-.4 1.4-.4s.8.3 1.4.4c1.8.2 3.8-2.7 5-5.4 1.3-3 1.4-6.8-.8-8.4C16 5.4 13.5 5.7 12 7z"/><path d="M12 7c0-2 1-3.5 3-4"/>'),
  drop: I('<path d="M12 2.7s-6 6.6-6 11.3a6 6 0 0 0 12 0c0-4.7-6-11.3-6-11.3z"/>'),
  flame: I('<path d="M12 22c4 0 7-2.7 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2.5-2-4-3 2.5-5 5.5-5 8 0 4.3 3 7 7 7z"/>'),
  ruler: I('<path d="M3 17 17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>'),
  pct: I('<circle cx="7" cy="7" r="3"/><circle cx="17" cy="17" r="3"/><path d="M19 5 5 19"/>')
});
const NUT_TABS = [['nut-dash', 'Dashboard'], ['nut-comp', 'Composição Corporal'], ['nut-comparativo', 'Comparativo'], ['nut-hidra', 'Hidratação'], ['nut-energia', 'Necessidades Energéticas']];
NUT_TABS.forEach(([k, n]) => TITLES[k] = ['Nutrição', n]);
NAV.splice(1, 0, { k: 'nut', n: 'Nutrição', ic: IC.apple, sub: NUT_TABS });
const NUT_TITLE = { 'nut-dash': 'PAINEL DA NUTRIÇÃO', 'nut-comp': 'COMPOSIÇÃO CORPORAL', 'nut-comparativo': 'COMPARATIVO CORPORAL', 'nut-hidra': 'HIDRATAÇÃO', 'nut-energia': 'NECESSIDADES ENERGÉTICAS' };
S.avaliacoes = S.avaliacoes || []; S.hidratacao = S.hidratacao || [];
UI.nutSel = null; UI.hidSel = null; UI.diaTipo = 'moderado'; UI.nutAtl = null; UI.cmpAtl = null;

const DOBRAS = { triceps: 'Tricipital', subescapular: 'Subescapular', suprailiaca: 'Suprailíaca', abdominal: 'Abdominal', peitoral: 'Peitoral', axilar: 'Axilar média', coxa: 'Coxa', panturrilha: 'Panturrilha medial' };
const CIRC = { cintura: 'Cintura', quadril: 'Quadril', braco: 'Braço relaxado', coxa: 'Coxa medial', panturrilha: 'Panturrilha' };
const PROT = {
  slaughter: { n: 'Slaughter · 2 dobras (crianças e adolescentes)', d: ['triceps', 'panturrilha'] },
  faulkner: { n: 'Faulkner · 4 dobras (atletas)', d: ['triceps', 'subescapular', 'suprailiaca', 'abdominal'] },
  jp3: { n: 'Jackson & Pollock · 3 dobras (adultos)', d: ['peitoral', 'abdominal', 'coxa'] },
  jp7: { n: 'Jackson & Pollock · 7 dobras (adultos)', d: ['peitoral', 'axilar', 'triceps', 'subescapular', 'abdominal', 'suprailiaca', 'coxa'] },
  manual: { n: '% de gordura informado (bioimpedância, DEXA)', d: [] }
};
const FAIXAS = { abaixo: ['Abaixo da faixa', 'var(--blue)', 'st-liberado'], ideal: ['Na faixa-alvo', 'var(--g500)', 'st-ok'], atencao: ['Atenção', 'var(--yellow)', 'st-transicao'], acima: ['Acima da faixa', 'var(--red)', 'st-tratamento'] };
const alvo = () => ({ min: +(S.config.nutri?.alvoMin ?? 8), max: +(S.config.nutri?.alvoMax ?? 14) });
const faixa = g => { if (g == null) return null; const { min, max } = alvo(); return g < min ? 'abaixo' : g <= max ? 'ideal' : g <= max + 4 ? 'atencao' : 'acima'; };
const faixaChip = g => { const f = faixa(g); return f ? `<span class="st ${FAIXAS[f][2]}">${FAIXAS[f][0]}</span>` : '<span class="muted">—</span>'; };
const idadeEm = (nasc, data) => { if (!nasc) return 16; const a = new Date(nasc + 'T12:00'), b = new Date((data || todayISO()) + 'T12:00'); let n = b.getFullYear() - a.getFullYear(); if (b.getMonth() < a.getMonth() || (b.getMonth() === a.getMonth() && b.getDate() < a.getDate())) n--; return n; };
function calcAv(av) {
  const a = atl(av.atletaId), d = av.dobras || {}, p = +av.peso || 0, h = +av.altura || 0, ida = idadeEm(a?.nascimento, av.data);
  const v = k => +d[k] || 0; const req = PROT[av.protocolo]?.d || []; const tem = req.every(k => v(k) > 0);
  let g = null;
  if (av.protocolo === 'manual') g = av.gorduraManual != null && av.gorduraManual !== '' ? +av.gorduraManual : null;
  else if (tem) {
    if (av.protocolo === 'slaughter') { const s = v('triceps') + v('panturrilha'); g = s > 35 ? 0.783 * s + 1.6 : 0.735 * s + 1.0; }
    if (av.protocolo === 'faulkner') g = 0.153 * (v('triceps') + v('subescapular') + v('suprailiaca') + v('abdominal')) + 5.783;
    if (av.protocolo === 'jp3') { const s = v('peitoral') + v('abdominal') + v('coxa'); const D = 1.10938 - 0.0008267 * s + 0.0000016 * s * s - 0.0002574 * ida; g = (4.95 / D - 4.5) * 100; }
    if (av.protocolo === 'jp7') { const s = req.reduce((t, k) => t + v(k), 0); const D = 1.112 - 0.00043499 * s + 0.00000055 * s * s - 0.00028826 * ida; g = (4.95 / D - 4.5) * 100; }
  }
  const soma = Object.values(d).reduce((t, x) => t + (+x || 0), 0);
  return { g: g != null ? Math.round(g * 10) / 10 : null, mg: g != null && p ? p * g / 100 : null, mm: g != null && p ? p * (1 - g / 100) : null, imc: p && h ? p / (h * h) : null, soma, peso: p, altura: h, idade: ida };
}
const avsCat = () => { const ids = idsCat(); return S.avaliacoes.filter(v => ids.has(v.atletaId) && (noPeriodo(v.data))); };
const avsDe = id => S.avaliacoes.filter(v => v.atletaId === id).sort((a, b) => a.data.localeCompare(b.data));
function ultimas() { const m = new Map(); avsCat().sort((a, b) => a.data.localeCompare(b.data)).forEach(v => m.set(v.atletaId, v)); return m; }
const mean = arr => { const a = arr.filter(x => x != null && !isNaN(x)); return a.length ? a.reduce((s, x) => s + x, 0) / a.length : null; };
const nfx = (v, d = 1, suf = '') => v == null ? '—' : nf(v, d) + suf;
const delta = (v, d = 1, bomNeg = false) => { if (v == null || isNaN(v)) return '<span class="muted">—</span>'; const z = Math.abs(v) < 0.05; const bom = bomNeg ? v < 0 : v > 0; return `<span class="${z ? 'muted' : bom ? 'down' : 'up'}">${z ? '=' : v > 0 ? '▲' : '▼'} ${nf(Math.abs(v), d)}</span>`; };
// hidratação
function hidCalc(r, dur) {
  const pre = +r.pre, pos = +r.pos; if (!pre || !pos) return null;
  const perda = pre - pos, pct = perda / pre * 100, ing = (+r.ingerido || 0) / 1000, ur = (+r.urina || 0) / 1000;
  const sud = dur ? (perda + ing - ur) / (dur / 60) : null;
  return { perda, pct, sud, repor: Math.max(0, perda * 1.5), st: pct < 1 ? 'ok' : pct <= 2 ? 'atencao' : 'alto' };
}
const HSTAT = { ok: ['Hidratado', 'st-ok'], atencao: ['Atenção', 'st-transicao'], alto: ['Desidratação', 'st-tratamento'] };
const URINA = ['#fdfbe3', '#f9f4b8', '#f5ec8c', '#efdd5c', '#e8cb3a', '#d9ae22', '#c08f19', '#9c6d12'];
const corChip = c => c ? `<span class="ucor" style="background:${URINA[c - 1]}" title="Cor ${c}${c >= 6 ? ' · desidratado' : c >= 4 ? ' · atenção' : ' · ok'}">${c}</span>` : '—';
const hidCat = () => { const ids = idsCat(); return S.hidratacao.filter(s => (noPeriodo(s.data)) && (s.registros || []).some(r => ids.has(r.atletaId))).sort((a, b) => b.data.localeCompare(a.data)); };
// energia
const DIAS = { descanso: ['Descanso', 1.4], leve: ['Treino leve', 1.6], moderado: ['Treino moderado', 1.75], jogo: ['Treino intenso / jogo', 1.95] };
function energia(a, tipo) {
  const v = avsDe(a.id).slice(-1)[0], c = v ? calcAv(v) : null; const peso = c?.peso || +a.peso || 0; if (!peso) return null;
  const ida = idadeEm(a.nascimento); let tmb, met;
  if (c && c.mm) { tmb = 500 + 22 * c.mm; met = 'Cunningham'; } else { tmb = ida <= 18 ? 17.686 * peso + 658.2 : 15.057 * peso + 692.2; met = 'Schofield'; }
  const fa = DIAS[tipo][1]; const get = tmb * fa; const ptn = 1.6 * peso, lip = 0.28 * get / 9, cho = Math.max(0, (get - ptn * 4 - lip * 9) / 4);
  return { peso, mm: c?.mm, tmb, met, get, cho, ptn, lip, agua: peso * 40 / 1000 };
}

/* ---------- telas ---------- */
function vNut() {
  const body = { 'nut-dash': fNutDash, 'nut-ind': fNutInd, 'nut-comp': fNutComp, 'nut-comparativo': fNutCmp, 'nut-hidra': fNutHidra, 'nut-energia': fNutEnergia }[S.view] || fNutDash;
  const h = header({ title: NUT_TITLE[S.view], sub: 'NUTRIÇÃO ESPORTIVA', items: hdrItems() });
  if (PRINT) return h + '<div style="height:16px"></div>' + body();
  return h + `<nav class="rtabs">${NUT_TABS.map(([k, n]) => `<button data-go="${k}" class="${S.view === k ? 'on' : ''}">${n}</button>`).join('')}</nav>` + noData() + body();
}
function fNutDash() {
  const ats = atletasCat(), U = ultimas(), lst = [...U.values()].map(v => ({ v, c: calcAv(v) }));
  const gs = lst.map(x => x.c.g).filter(x => x != null), fx = countBy(lst.filter(x => x.c.g != null), x => faixa(x.c.g));
  const fora = lst.filter(x => x.c.g != null && faixa(x.c.g) !== 'ideal').sort((a, b) => b.c.g - a.c.g);
  const segs = Object.keys(FAIXAS).map(k => ({ l: FAIXAS[k][0], v: fx[k] || 0, c: FAIXAS[k][1] }));
  const porPos = POS.map(p => { const g = mean(lst.filter(x => atl(x.v.atletaId)?.posicao === p).map(x => x.c.g)); return g == null ? null : { l: POSN[p], v: g, t: nf(g) + '%', sw: PC1[p], c: PC1[p] }; }).filter(Boolean);
  const avs = avsCat(); const meses = MESES.map((_, i) => mean(avs.filter(v => +v.data.slice(5, 7) === i + 1).map(v => calcAv(v).g)));
  const mi = meses.map((v, i) => [i, v]).filter(x => x[1] != null);
  const hs = hidCat(); const ids = idsCat(); const regs = hs.flatMap(s => (s.registros || []).filter(r => ids.has(r.atletaId)).map(r => hidCalc(r, s.duracao)).filter(Boolean));
  const { min, max } = alvo();
  return `<div class="kpis">
    ${kpi('users', 'Atletas avaliados', `${U.size}<small>/ ${ats.length}</small>`, pct(U.size, ats.length) + ' do elenco')}
    ${kpi('pct', '% de gordura médio', nfx(mean(gs), 1, '%'), `Faixa-alvo: ${min}–${max}%`)}
    ${kpi('check', 'Na faixa-alvo', fx.ideal || 0, pct(fx.ideal || 0, gs.length) + ' dos avaliados')}
    ${kpi('trend', 'Fora da faixa', fora.length, pct(fora.length, gs.length) + ' dos avaliados', 'red')}
    ${kpi('scale', 'Peso médio', nfx(mean(lst.map(x => x.c.peso)), 1, '<small>kg</small>'), 'Massa magra ' + nfx(mean(lst.map(x => x.c.mm)), 1, ' kg'))}
    ${kpi('drop', 'Perda hídrica média', nfx(mean(regs.map(r => r.pct)), 1, '%'), `${regs.filter(r => r.st === 'alto').length} registro(s) acima de 2%`, 'blue')}
  </div>
  <div class="row r4">
    ${panel('Faixa de gordura do elenco', gs.length ? `<div class="donut-wrap">${donut(segs, gs.length, 'AVALIADOS', 160)}${legend(segs)}</div>` : miniEmpty('Sem avaliações', 'Registre a primeira avaliação.'))}
    ${panel('% de gordura por posição', dist(porPos))}
    ${panel('Evolução do % de gordura (média)', mi.length > 1 ? lineChart(mi.map(x => MESES[x[0]]), mi.map(x => +nf(x[1]).replace(',', '.')), { w: 420, label: '% gordura médio', min: 10 }) : miniEmpty('Poucos dados', 'São precisas avaliações em pelo menos dois meses.'))}
    ${panel('Hidratação recente', hs.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th>Data</th><th>Sessão</th><th>Perda média</th><th>&gt; 2%</th></tr></thead><tbody>${hs.slice(0, 6).map(s => { const rr = (s.registros || []).filter(r => ids.has(r.atletaId)).map(r => hidCalc(r, s.duracao)).filter(Boolean); return `<tr class="click" data-hid="${s.id}"><td>${fmtD(s.data)}</td><td>${esc(s.tipo)}</td><td><b>${nfx(mean(rr.map(r => r.pct)), 1, '%')}</b></td><td>${rr.filter(r => r.st === 'alto').length}</td></tr>`; }).join('')}</tbody></table></div>` : miniEmpty('Sem sessões', 'Registre a hidratação de um treino.'), { np: !!hs.length })}
  </div>
  <div class="row" style="grid-template-columns:1fr">
    ${panel('Atletas fora da faixa-alvo', fora.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Pos.</th><th>Avaliação</th><th>Peso</th><th>% gordura</th><th>Massa magra</th><th>Variação do %G</th><th>Situação</th></tr></thead><tbody>${fora.map(x => { const a = atl(x.v.atletaId), h = avsDe(a.id), prev = h.length > 1 ? calcAv(h[h.length - 2]) : null; return `<tr class="click" data-nut="${a.id}"><td class="l">${athCell(a)}</td><td>${ptag(a.posicao)}</td><td>${fmtD(x.v.data)}</td><td>${nfx(x.c.peso, 1, ' kg')}</td><td><b>${nfx(x.c.g, 1, '%')}</b></td><td>${nfx(x.c.mm, 1, ' kg')}</td><td>${prev ? delta(x.c.g - prev.g, 1, true) : '<span class="muted">1ª avaliação</span>'}</td><td>${faixaChip(x.c.g)}</td></tr>`; }).join('')}</tbody></table></div>` : miniEmpty('Todos na faixa-alvo', 'Nenhum atleta avaliado está fora da faixa.'), { np: !!fora.length, r: `<button data-go="nut-comp">Ver composição corporal</button>` })}
  </div>`;
}
function fNutComp() {
  const U = ultimas(), lst = [...U.values()].map(v => ({ v, c: calcAv(v), a: atl(v.atletaId) })).sort((x, y) => x.a.nome.localeCompare(y.a.nome));
  if (!UI.nutSel || !atl(UI.nutSel)) UI.nutSel = lst[0]?.a.id || atletasCat()[0]?.id;
  const semAv = atletasCat().filter(a => !U.has(a.id));
  return `<div class="row r21" style="align-items:start">
    ${panel('Última avaliação de cada atleta', (lst.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Pos.</th><th>Data</th><th>Peso</th><th>IMC</th><th>% gordura</th><th>Massa magra</th><th>Σ dobras</th><th>Δ %G</th><th>Situação</th></tr></thead><tbody>${lst.map(x => { const h = avsDe(x.a.id), prev = h.length > 1 ? calcAv(h[h.length - 2]) : null; return `<tr class="click ${UI.nutSel === x.a.id ? 'rowsel' : ''}" data-nut="${x.a.id}"><td class="l">${athCell(x.a)}</td><td>${ptag(x.a.posicao)}</td><td>${fmtD(x.v.data)}</td><td>${nfx(x.c.peso, 1)}</td><td>${nfx(x.c.imc, 1)}</td><td><b>${nfx(x.c.g, 1, '%')}</b></td><td>${nfx(x.c.mm, 1)}</td><td>${nfx(x.c.soma, 1)}</td><td>${prev && prev.g != null && x.c.g != null ? delta(x.c.g - prev.g, 1, true) : '<span class="muted">—</span>'}</td><td>${faixaChip(x.c.g)}</td></tr>`; }).join('')}</tbody></table></div>` : miniEmpty('Nenhuma avaliação na temporada', 'Clique em “Nova avaliação” para começar.')) + (semAv.length ? `<div class="pb" style="border-top:1px solid var(--line);font-size:13px"><b>Sem avaliação na temporada (${semAv.length}):</b> ${semAv.map(a => `<button class="linkbtn" data-act="nova-av" data-id="${a.id}">${esc(a.apelido || a.nome)}</button>`).join(', ')}</div>` : ''), { np: true, r: `<button data-act="nova-av">+ Nova avaliação</button>` })}
    <div class="panel" id="nutPanel">${nutDetalhe(atl(UI.nutSel))}</div>
  </div>`;
}
function nutDetalhe(a) {
  if (!a) return `<div class="ph">Atleta</div><div class="pb">${miniEmpty('Selecione um atleta')}</div>`;
  const h = avsDe(a.id), cs = h.map(v => ({ v, c: calcAv(v) })), last = cs[cs.length - 1];
  const graf = cs.length > 1 ? `<div class="minich"><div><h5>% de gordura</h5>${lineChart(cs.map(x => fmtDs(x.v.data)), cs.map(x => x.c.g != null ? Math.round(x.c.g * 10) / 10 : 0), { w: 300, h: 170, min: 5, label: '% gordura' })}</div><div><h5>Peso (kg)</h5>${lineChart(cs.map(x => fmtDs(x.v.data)), cs.map(x => Math.round(x.c.peso * 10) / 10), { w: 300, h: 170, min: 40, label: 'peso' })}</div></div>` : '';
  return `<div class="ph">Composição corporal</div><div class="pb">
    <div class="det-head">${ava(a)}<div><b>${esc(a.apelido || a.nome)}${subTag(a)}</b><span class="muted">${esc(a.categoria)} · ${idade(a.nascimento)} anos</span></div><span style="margin-left:auto">${ptag(a.posicao)}</span></div>
    ${last ? `<div class="mini-stats" style="grid-template-columns:repeat(3,1fr)"><div><span>Peso</span><b>${nfx(last.c.peso, 1)} kg</b></div><div><span>% gordura</span><b>${nfx(last.c.g, 1, '%')}</b></div><div><span>Massa magra</span><b>${nfx(last.c.mm, 1)} kg</b></div><div><span>Massa gorda</span><b>${nfx(last.c.mg, 1)} kg</b></div><div><span>IMC</span><b>${nfx(last.c.imc, 1)}</b></div><div><span>Σ dobras</span><b>${nfx(last.c.soma, 1)} mm</b></div></div>
    <div style="margin:10px 0">${faixaChip(last.c.g)} <span class="muted" style="font-size:12.5px">${esc(PROT[last.v.protocolo]?.n || '')}</span></div>${graf}
    <div class="det-sec" style="margin-top:10px"><h4>Histórico de avaliações</h4><div class="tbl-wrap"><table class="t"><thead><tr><th>Data</th><th>Peso</th><th>%G</th><th>MM</th><th>Σ dobras</th><th></th></tr></thead><tbody>${[...cs].reverse().map(x => `<tr><td>${fmtD(x.v.data)}</td><td>${nfx(x.c.peso, 1)}</td><td><b>${nfx(x.c.g, 1)}</b></td><td>${nfx(x.c.mm, 1)}</td><td>${nfx(x.c.soma, 1)}</td><td style="white-space:nowrap"><button class="icon-btn" data-act="edit-av" data-id="${x.v.id}" aria-label="Editar avaliação">${IC.edit}</button><button class="icon-btn" data-act="del-av" data-id="${x.v.id}" aria-label="Excluir avaliação" style="color:var(--red)">${IC.trash}</button></td></tr>`).join('')}</tbody></table></div></div>` : miniEmpty('Sem avaliações', 'Este atleta ainda não foi avaliado.')}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px"><button class="btn pri" data-act="nova-av" data-id="${a.id}">${IC.plus} Nova avaliação</button>${h.length > 1 ? `<button class="btn" data-act="ind-from-comp" data-id="${a.id}">${IC.trend} Comparar avaliações</button>` : ''}</div></div>`;
}
function fNutCmp() {
  const U = ultimas(), lst = [...U.values()].map(v => ({ v, c: calcAv(v), a: atl(v.atletaId) }));
  const cats = Object.keys(GRUPOS).filter(c => lst.some(x => x.a.categoria === c));
  const porCat = cats.map(c => { const l = lst.filter(x => x.a.categoria === c); const ok = l.filter(x => faixa(x.c.g) === 'ideal').length; return `<tr><td class="l"><b>${c}</b></td><td>${l.length}</td><td>${nfx(mean(l.map(x => x.c.peso)), 1)}</td><td>${nfx(mean(l.map(x => x.c.altura)), 2)}</td><td>${nfx(mean(l.map(x => x.c.imc)), 1)}</td><td><b>${nfx(mean(l.map(x => x.c.g)), 1, '%')}</b></td><td>${nfx(mean(l.map(x => x.c.mm)), 1)}</td><td>${pct(ok, l.length)}</td></tr>`; }).join('');
  const porPos = POS.map(p => { const l = lst.filter(x => x.a.posicao === p); return l.length ? { p, n: l.length, peso: mean(l.map(x => x.c.peso)), g: mean(l.map(x => x.c.g)), mm: mean(l.map(x => x.c.mm)) } : null; }).filter(Boolean);
  const evol = atletasCat().map(a => { const h = avsDe(a.id).filter(v => noPeriodo(v.data)); if (h.length < 2) return null; const p = calcAv(h[0]), u = calcAv(h[h.length - 1]); return { a, p, u, d0: h[0].data, d1: h[h.length - 1].data }; }).filter(Boolean).sort((x, y) => (x.u.g - x.p.g) - (y.u.g - y.p.g));
  if (!UI.cmpAtl || !U.has(UI.cmpAtl)) UI.cmpAtl = lst[0]?.a.id;
  const sel = lst.find(x => x.a.id === UI.cmpAtl);
  let cmpBox = miniEmpty('Sem avaliações');
  if (sel) {
    const pos = lst.filter(x => x.a.posicao === sel.a.posicao), all = lst;
    const met = [['Peso (kg)', x => x.c.peso, 1], ['% gordura', x => x.c.g, 1], ['Massa magra (kg)', x => x.c.mm, 1], ['Massa gorda (kg)', x => x.c.mg, 1], ['Σ dobras (mm)', x => x.c.soma, 1]];
    cmpBox = `<div class="f" style="margin-bottom:12px"><label for="cmpSel">Atleta</label><select id="cmpSel">${lst.sort((a, b) => a.a.nome.localeCompare(b.a.nome)).map(x => `<option value="${x.a.id}" ${x.a.id === UI.cmpAtl ? 'selected' : ''}>${esc(x.a.nome)} · ${x.a.posicao}</option>`).join('')}</select></div>
    <div class="cmpg">${met.map(([l, f, d]) => { const v = [f(sel), mean(pos.map(f)), mean(all.map(f))]; const mx = Math.max(...v.filter(x => x != null), 0.01); return `<div class="lb">${l}</div><div class="bars">${[['Atleta', 'var(--g500)'], [POSN[sel.a.posicao], PC1[sel.a.posicao]], ['Elenco', '#8a948f']].map(([n, c], i) => `<div><i style="width:${(v[i] / mx * 100 || 0).toFixed(0)}%;background:${c}"></i><b>${nfx(v[i], d)}</b><span>${esc(n)}</span></div>`).join('')}</div>`; }).join('')}</div>`;
  }
  return `<div class="row r2">
    ${panel('Comparativo entre categorias', porCat ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Categoria</th><th>Avaliados</th><th>Peso</th><th>Altura</th><th>IMC</th><th>% gordura</th><th>Massa magra</th><th>Na faixa</th></tr></thead><tbody>${porCat}</tbody></table></div>` : miniEmpty('Sem avaliações'), { np: !!porCat })}
    ${panel('Por posição', porPos.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Posição</th><th>Avaliados</th><th>Peso</th><th>% gordura</th><th>Massa magra</th></tr></thead><tbody>${porPos.map(x => `<tr><td class="l">${ptag(x.p)} ${POSN[x.p]}</td><td>${x.n}</td><td>${nfx(x.peso, 1)}</td><td><b>${nfx(x.g, 1, '%')}</b></td><td>${nfx(x.mm, 1)}</td></tr>`).join('')}</tbody></table></div><div class="pb">${dist(porPos.map(x => ({ l: POSN[x.p], v: x.g, t: nf(x.g) + '%', c: PC1[x.p], sw: PC1[x.p] })))}</div>` : miniEmpty('Sem avaliações'), { np: true })}
  </div>
  <div class="row r21">
    ${panel('Evolução na temporada · primeira x última avaliação', evol.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Pos.</th><th>Período</th><th>Peso</th><th>Δ peso</th><th>% gordura</th><th>Δ %G</th><th>Massa magra</th><th>Δ MM</th><th>Δ massa gorda</th></tr></thead><tbody>${evol.map(x => `<tr class="click" data-nut="${x.a.id}"><td class="l">${athCell(x.a)}</td><td>${ptag(x.a.posicao)}</td><td>${fmtDs(x.d0)} → ${fmtDs(x.d1)}</td><td>${nfx(x.u.peso, 1)}</td><td>${delta(x.u.peso - x.p.peso, 1)}</td><td><b>${nfx(x.u.g, 1, '%')}</b></td><td>${delta(x.u.g - x.p.g, 1, true)}</td><td>${nfx(x.u.mm, 1)}</td><td>${delta(x.u.mm - x.p.mm, 1)}</td><td>${delta(x.u.mg - x.p.mg, 1, true)}</td></tr>`).join('')}</tbody></table></div>` : miniEmpty('Sem dados', 'São necessárias pelo menos duas avaliações do mesmo atleta na temporada.'), { np: !!evol.length })}
    ${panel('Atleta x média da posição e do elenco', cmpBox)}
  </div>`;
}
function fNutHidra() {
  const hs = hidCat(), ids = idsCat();
  if (!hs.find(s => s.id === UI.hidSel)) UI.hidSel = hs[0]?.id;
  const all = hs.flatMap(s => (s.registros || []).filter(r => ids.has(r.atletaId)).map(r => ({ r, c: hidCalc(r, s.duracao) }))).filter(x => x.c);
  const s = hs.find(x => x.id === UI.hidSel);
  const rows = s ? (s.registros || []).filter(r => ids.has(r.atletaId)).map(r => ({ r, c: hidCalc(r, s.duracao), a: atl(r.atletaId) })).filter(x => x.c && x.a).sort((x, y) => y.c.pct - x.c.pct) : [];
  return `<div class="kpis k5">
    ${kpi('cal', 'Sessões avaliadas', hs.length, 'Temporada ' + anoLabel())}
    ${kpi('drop', 'Perda de peso média', nfx(mean(all.map(x => x.c.pct)), 2, '%'), 'por sessão', 'blue')}
    ${kpi('trend', 'Taxa de sudorese', nfx(mean(all.map(x => x.c.sud)), 2, '<small>L/h</small>'), 'média dos atletas')}
    ${kpi('cross', 'Acima de 2%', all.filter(x => x.c.st === 'alto').length, 'registros com desidratação', 'red')}
    ${kpi('pct', 'Urina escura', all.filter(x => +x.r.cor >= 6).length, 'cor 6 ou mais na escala', 'gold')}
  </div>
  <div class="row r21" style="align-items:start">
    <div class="panel"><div class="ph">${s ? `Sessão de ${fmtD(s.data)} · ${esc(s.tipo)}` : 'Sessão'}<span class="r">${s ? `<button data-act="edit-hid" data-id="${s.id}">Editar</button> <button data-act="del-hid" data-id="${s.id}">Excluir</button> ` : ''}<button data-act="nova-hid">+ Nova sessão</button></span></div>
      ${s ? `<div class="pb" style="display:flex;gap:18px;flex-wrap:wrap;font-size:13.5px;border-bottom:1px solid var(--line)"><span><b>Duração:</b> ${s.duracao} min</span><span><b>Temperatura:</b> ${s.temp ?? '—'} °C</span><span><b>Umidade:</b> ${s.umidade ?? '—'}%</span><span><b>Atletas:</b> ${rows.length}</span><span><b>Perda média:</b> ${nfx(mean(rows.map(x => x.c.pct)), 2, '%')}</span></div>
      <div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Antes</th><th>Depois</th><th>% perdido</th><th>Ingerido</th><th>Sudorese</th><th>Repor após</th><th>Cor urina</th><th>Situação</th></tr></thead><tbody>${rows.map(x => `<tr><td class="l">${athCell(x.a)}</td><td>${nfx(+x.r.pre, 1)} kg</td><td>${nfx(+x.r.pos, 1)} kg</td><td><b>${nfx(x.c.pct, 2, '%')}</b><br><small class="muted">−${nfx(x.c.perda, 1)} kg</small></td><td>${x.r.ingerido || 0} ml</td><td>${nfx(x.c.sud, 2)} L/h</td><td><b>${nfx(x.c.repor, 1)} L</b></td><td>${corChip(+x.r.cor)}</td><td><span class="st ${HSTAT[x.c.st][1]}">${HSTAT[x.c.st][0]}</span></td></tr>`).join('')}</tbody></table></div>` : `<div class="pb">${miniEmpty('Nenhuma sessão registrada', 'Pese os atletas antes e depois do treino e registre aqui.')}</div>`}
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
      ${panel('Sessões', hs.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th>Data</th><th>Tipo</th><th>Atl.</th><th>Perda média</th></tr></thead><tbody>${hs.map(x => { const rr = (x.registros || []).filter(r => ids.has(r.atletaId)).map(r => hidCalc(r, x.duracao)).filter(Boolean); return `<tr class="click ${x.id === UI.hidSel ? 'rowsel' : ''}" data-hid="${x.id}"><td>${fmtD(x.data)}</td><td>${esc(x.tipo)}</td><td>${rr.length}</td><td><b>${nfx(mean(rr.map(r => r.pct)), 2, '%')}</b></td></tr>`; }).join('')}</tbody></table></div>` : miniEmpty('Sem sessões'), { np: !!hs.length })}
      ${panel('Como interpretar', `<div class="det-row"><span><span class="st st-ok">&lt; 1%</span></span><div>Bem hidratado</div></div><div class="det-row"><span><span class="st st-transicao">1 a 2%</span></span><div>Atenção: reforçar a ingestão durante o treino</div></div><div class="det-row"><span><span class="st st-tratamento">&gt; 2%</span></span><div>Desidratação com queda de desempenho</div></div>
        <p style="font-size:12.5px;margin:10px 0 6px"><b>Escala de cor da urina</b> (1–3 ok · 4–5 atenção · 6–8 desidratado)</p><div class="uscale">${URINA.map((c, i) => `<span style="background:${c}">${i + 1}</span>`).join('')}</div>
        <p class="muted" style="font-size:12.5px;margin:10px 0 0">Reposição após o treino: 1,5 L para cada kg perdido. Sudorese = (perda de peso + líquido ingerido − urina) ÷ horas de treino.</p>`)}
    </div>
  </div>`;
}
function fNutEnergia() {
  const ats = atletasCat().sort((a, b) => a.nome.localeCompare(b.nome)); const t = UI.diaTipo;
  const rows = ats.map(a => ({ a, e: energia(a, t) })).filter(x => x.e);
  if (!UI.nutAtl || !atl(UI.nutAtl)) UI.nutAtl = rows[0]?.a.id;
  const sel = rows.find(x => x.a.id === UI.nutAtl); const p = sel?.e.peso || 60;
  const g = (lo, hi, u = 'g') => `${Math.round(lo * p)}–${Math.round(hi * p)} ${u}`;
  return `<div class="panel" style="margin-bottom:16px"><div class="pb" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><b style="font-family:var(--fc);font-size:18px;text-transform:uppercase">Tipo de dia</b><div class="seg2">${Object.entries(DIAS).map(([k, [n]]) => `<label><input type="radio" name="diaTipo" value="${k}" ${t === k ? 'checked' : ''}>${n}</label>`).join('')}</div><span class="muted" style="font-size:12.5px">Gasto total = gasto em repouso × ${nf(DIAS[t][1], 2)} · proteína 1,6 g/kg · gordura 28% das calorias · carboidrato completa o restante · água 40 ml/kg</span></div></div>
  <div class="row r21" style="align-items:start">
    ${panel('Estimativa diária por atleta · ' + DIAS[t][0], rows.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Pos.</th><th>Peso</th><th>Gasto em repouso</th><th>Gasto total</th><th>Carboidrato</th><th>Proteína</th><th>Gordura</th><th>Água</th></tr></thead><tbody>${rows.map(x => `<tr class="click ${x.a.id === UI.nutAtl ? 'rowsel' : ''}" data-ener="${x.a.id}"><td class="l">${athCell(x.a)}</td><td>${ptag(x.a.posicao)}</td><td>${nfx(x.e.peso, 1)} kg</td><td>${Math.round(x.e.tmb)} kcal<br><small class="muted">${x.e.met}${x.e.mm ? ' · MM ' + nf(x.e.mm, 1) + ' kg' : ''}</small></td><td><b>${Math.round(x.e.get)} kcal</b></td><td>${Math.round(x.e.cho)} g<br><small class="muted">${nf(x.e.cho / x.e.peso, 1)} g/kg</small></td><td>${Math.round(x.e.ptn)} g</td><td>${Math.round(x.e.lip)} g</td><td>${nf(x.e.agua, 1)} L</td></tr>`).join('')}</tbody></table></div>` : miniEmpty('Sem dados', 'Cadastre o peso dos atletas ou registre avaliações.'), { np: !!rows.length })}
    ${panel('Estratégia para dia de jogo' + (sel ? ' · ' + esc(sel.a.apelido || sel.a.nome) : ''), sel ? `<p class="muted" style="margin:0 0 10px;font-size:12.5px">Valores calculados para ${nf(p, 1)} kg. Clique em outro atleta na tabela para recalcular.</p>
      <div class="plan">
        <div><h5>Véspera</h5><p>Carboidrato de <b>${g(6, 8)}</b> ao longo do dia; água <b>${nf(p * 0.04, 1)} L</b> ou mais.</p></div>
        <div><h5>3 a 4 h antes</h5><p>Refeição com <b>${g(1, 3)}</b> de carboidrato, pouca gordura e fibra; <b>${g(5, 7, 'ml')}</b> de líquido.</p></div>
        <div><h5>Até 1 h antes</h5><p>Lanche leve com <b>${g(0.5, 1)}</b> de carboidrato; mais <b>${g(3, 5, 'ml')}</b> se a urina estiver escura.</p></div>
        <div><h5>Intervalo / durante</h5><p><b>30–60 g</b> de carboidrato por hora (bebida esportiva, gel, fruta) e <b>400–800 ml</b> por hora de líquido.</p></div>
        <div><h5>Até 1 h depois</h5><p>Carboidrato <b>${g(1, 1.2)}</b> + proteína <b>${g(0.3, 0.4)}</b>; repor <b>1,5 L</b> por kg perdido no jogo.</p></div>
        <div><h5>Recuperação (24 h)</h5><p>Carboidrato de <b>${g(6, 8)}</b>, proteína distribuída em 4–5 refeições de <b>${g(0.3, 0.4)}</b>.</p></div>
      </div><p class="muted" style="font-size:12px;margin:10px 0 0">Estimativas de referência para atletas jovens. Ajuste individual com o nutricionista do clube.</p>` : miniEmpty('Selecione um atleta'))}
  </div>`;
}

/* ---------- formulários ---------- */
function formAval(av = {}, atletaId) {
  if (!S.atletas.length) { toast('Cadastre um atleta antes.', true); return; }
  const ats = [...S.atletas].sort((a, b) => a.nome.localeCompare(b.nome)); const sel = av.atletaId || atletaId || UI.nutSel || '';
  const prof = av.protocolo && PROT[av.protocolo] ? av.protocolo : 'faulkner';
  const d = av.dobras || {}, ci = av.circ || {}; const profs = (S.config.profissionais || []).map(p => p.nome).filter(Boolean);
  openModal(mh(av.id ? 'Editar avaliação' : 'Nova avaliação corporal') + `<form id="fAv" novalidate><div class="mb">
    <div class="form">
      <div class="f s2"><label for="avAtl">Atleta *</label><select id="avAtl" name="atletaId"><option value="">Selecione</option>${ats.map(a => `<option value="${a.id}" ${a.id === sel ? 'selected' : ''}>${esc(a.nome)} · ${esc(a.subcategoria || a.categoria)}</option>`).join('')}</select></div>
      <div class="f"><label for="avData">Data *</label><input id="avData" type="date" name="data" value="${esc(av.data || todayISO())}" max="${todayISO()}" required></div>
      <div class="f"><label for="avResp">Avaliador</label><select id="avResp" name="responsavel"><option value="">—</option>${opts(profs, av.responsavel)}</select></div>
      <div class="f"><label for="avPeso">Peso (kg) *</label><input id="avPeso" name="peso" type="number" step="0.1" min="20" max="150" value="${esc(av.peso ?? '')}" required></div>
      <div class="f"><label for="avAlt">Altura (m)</label><input id="avAlt" name="altura" type="number" step="0.01" min="1" max="2.3" value="${esc(av.altura ?? '')}"></div>
      <div class="f s2"><label for="avProt">Protocolo</label><select id="avProt" name="protocolo">${Object.entries(PROT).map(([k, p]) => `<option value="${k}" ${k === prof ? 'selected' : ''}>${p.n}</option>`).join('')}</select></div>
    </div>
    <div class="fsec">Dobras cutâneas (mm) · tricipital, subescapular, suprailíaca e abdominal</div>
    <div class="form" id="avDobras">${Object.entries(DOBRAS).map(([k, n]) => `<div class="f" data-dob="${k}"><label for="dob_${k}">${n}</label><input id="dob_${k}" name="dob_${k}" type="number" step="0.1" min="2" max="80" value="${esc(d[k] ?? '')}"></div>`).join('')}
      <div class="f" id="avManBox"><label for="avMan">% de gordura medido</label><input id="avMan" name="gorduraManual" type="number" step="0.1" min="2" max="50" value="${esc(av.gorduraManual ?? '')}"></div></div>
    <div class="form">
      <div class="f s4" style="grid-column:1/-1"><label for="avObs">Observações</label><input id="avObs" name="obs" value="${esc(av.obs || '')}"></div></div>
    <div class="avres" id="avRes"></div>
  </div><div class="mf"><span class="msg" id="avErr"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} ${av.id ? 'Salvar alterações' : 'Salvar avaliação'}</button></div></form>`, true);
  const fm = $('#fAv');
  const read = () => { const f = new FormData(fm); const dob = {}; Object.keys(DOBRAS).forEach(k => { const v = f.get('dob_' + k); if (v !== '' && v != null) dob[k] = +v; }); const circ = {}; Object.keys(CIRC).forEach(k => { const v = f.get('ci_' + k); if (v !== '' && v != null) circ[k] = +v; }); return { ...av, atletaId: f.get('atletaId'), data: f.get('data'), responsavel: f.get('responsavel'), peso: f.get('peso') ? +f.get('peso') : '', altura: f.get('altura') ? +f.get('altura') : '', protocolo: f.get('protocolo'), dobras: dob, circ, gorduraManual: f.get('gorduraManual') !== '' ? +f.get('gorduraManual') : null, obs: f.get('obs').trim() }; };
  const sync = () => {
    const pr = fm.protocolo.value, req = PROT[pr].d;
    $$('#avDobras [data-dob]').forEach(el => { const on = req.includes(el.dataset.dob); el.classList.toggle('need', on); el.classList.toggle('opt', !on); });
    $('#avManBox').style.display = pr === 'manual' ? '' : 'none';
    const o = read(), c = o.atletaId && o.peso ? calcAv(o) : null;
    $('#avRes').innerHTML = c ? `<div><span>IMC</span><b>${nfx(c.imc, 1)}</b></div><div><span>% gordura</span><b>${nfx(c.g, 1, '%')}</b></div><div><span>Massa gorda</span><b>${nfx(c.mg, 1, ' kg')}</b></div><div><span>Massa magra</span><b>${nfx(c.mm, 1, ' kg')}</b></div><div><span>Σ dobras</span><b>${nfx(c.soma, 1, ' mm')}</b></div><div><span>Situação</span><b style="font-size:14px">${faixaChip(c.g)}</b></div>` : '<p class="muted" style="margin:0">Escolha o atleta e informe o peso para ver o resultado.</p>';
  };
  fm.addEventListener('input', sync); fm.addEventListener('change', e => { if (e.target.name === 'atletaId' && !av.id) { const a = atl(e.target.value); if (a) { if (!fm.altura.value && a.altura) fm.altura.value = a.altura; const last = avsDe(a.id).slice(-1)[0]; if (last && !fm.altura.value) fm.altura.value = last.altura; } } sync(); });
  sync();
  fm.onsubmit = e => {
    e.preventDefault(); const o = read();
    if (!o.atletaId) return $('#avErr').textContent = 'Selecione o atleta.';
    if (!o.peso) return $('#avErr').textContent = 'Informe o peso.';
    if (o.protocolo !== 'manual' && !PROT[o.protocolo].d.every(k => o.dobras[k] > 0)) return $('#avErr').textContent = 'Preencha as dobras destacadas do protocolo.';
    if (o.protocolo === 'manual' && o.gorduraManual == null) return $('#avErr').textContent = 'Informe o % de gordura medido.';
    o.id = av.id || uid('n'); save('avaliacoes', o).then(() => syncAtletaCorpo(o.atletaId)); UI.nutSel = o.atletaId; closeModal(); toast(av.id ? 'Avaliação atualizada' : 'Avaliação salva');
  };
}
function formHidra(s = {}) {
  if (!S.atletas.length) { toast('Cadastre um atleta antes.', true); return; }
  const cat = s.categoria || (F.categoria !== 'Todas' ? F.categoria : (S.atletas[0]?.categoria || 'Sub-15'));
  openModal(mh(s.id ? 'Editar sessão de hidratação' : 'Nova sessão de hidratação') + `<form id="fHid" novalidate><div class="mb">
    <div class="form" style="grid-template-columns:repeat(6,1fr)">
      <div class="f"><label for="hData">Data *</label><input id="hData" type="date" name="data" value="${esc(s.data || todayISO())}" max="${todayISO()}"></div>
      <div class="f"><label for="hTipo">Sessão</label><select id="hTipo" name="tipo">${opts(['Treino', 'Jogo', 'Treino físico', 'Recreativo'], s.tipo || 'Treino')}</select></div>
      <div class="f"><label for="hDur">Duração (min) *</label><input id="hDur" type="number" name="duracao" min="10" max="240" value="${esc(s.duracao ?? 90)}"></div>
      <div class="f"><label for="hTemp">Temperatura (°C)</label><input id="hTemp" type="number" name="temp" min="0" max="50" value="${esc(s.temp ?? '')}"></div>
      <div class="f"><label for="hUmi">Umidade (%)</label><input id="hUmi" type="number" name="umidade" min="0" max="100" value="${esc(s.umidade ?? '')}"></div>
      <div class="f"><label for="hCat">Categoria</label><select id="hCat" name="categoria">${opts(Object.keys(GRUPOS), cat)}</select></div>
    </div>
    <p class="muted" style="margin:0;font-size:12.5px">Pese os atletas antes e depois (sem roupa molhada). Deixe em branco quem não participou. Ingerido e urina em ml.</p>
    <div class="tbl-wrap" style="max-height:420px;overflow:auto;border:1px solid var(--line);border-radius:8px"><table class="t hidin"><thead><tr><th class="l">Atleta</th><th>Peso antes</th><th>Peso depois</th><th>Ingerido (ml)</th><th>Urina (ml)</th><th>Cor urina</th><th>% perdido</th><th>Situação</th></tr></thead><tbody id="hidRows"></tbody></table></div>
  </div><div class="mf"><span class="msg" id="hErr"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar sessão</button></div></form>`, true);
  const fm = $('#fHid'); const prev = new Map((s.registros || []).map(r => [r.atletaId, r]));
  const fill = () => { const as = S.atletas.filter(a => a.categoria === fm.categoria.value || prev.has(a.id)).sort((a, b) => a.nome.localeCompare(b.nome)); $('#hidRows').innerHTML = as.map(a => { const r = prev.get(a.id) || {}; return `<tr data-a="${a.id}"><td class="l">${athCell(a)}</td><td><input type="number" step="0.1" data-k="pre" value="${esc(r.pre ?? '')}" aria-label="Peso antes"></td><td><input type="number" step="0.1" data-k="pos" value="${esc(r.pos ?? '')}" aria-label="Peso depois"></td><td><input type="number" step="50" data-k="ingerido" value="${esc(r.ingerido ?? '')}" aria-label="Ingerido"></td><td><input type="number" step="50" data-k="urina" value="${esc(r.urina ?? '')}" aria-label="Urina"></td><td><select data-k="cor" aria-label="Cor da urina"><option value="">—</option>${URINA.map((c, i) => `<option value="${i + 1}" ${+r.cor === i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}</select></td><td class="hp">—</td><td class="hs"></td></tr>`; }).join(''); calc(); };
  const calc = () => { $$('#hidRows tr').forEach(tr => { const g = k => tr.querySelector(`[data-k=${k}]`).value; const c = hidCalc({ pre: g('pre'), pos: g('pos'), ingerido: g('ingerido'), urina: g('urina') }, +fm.duracao.value); tr.querySelector('.hp').innerHTML = c ? `<b>${nf(c.pct, 2)}%</b>` : '—'; tr.querySelector('.hs').innerHTML = c ? `<span class="st ${HSTAT[c.st][1]}">${HSTAT[c.st][0]}</span>` : ''; }); };
  fm.categoria.onchange = fill; fm.addEventListener('input', calc); fill();
  fm.onsubmit = e => {
    e.preventDefault(); const f = new FormData(fm);
    const regs = $$('#hidRows tr').map(tr => { const g = k => tr.querySelector(`[data-k=${k}]`).value; return { atletaId: tr.dataset.a, pre: g('pre') ? +g('pre') : '', pos: g('pos') ? +g('pos') : '', ingerido: g('ingerido') ? +g('ingerido') : 0, urina: g('urina') ? +g('urina') : 0, cor: g('cor') ? +g('cor') : '' }; }).filter(r => r.pre && r.pos);
    if (!regs.length) return $('#hErr').textContent = 'Preencha o peso antes e depois de pelo menos um atleta.';
    const o = { ...s, id: s.id || uid('h'), data: f.get('data'), tipo: f.get('tipo'), duracao: +f.get('duracao') || 90, temp: f.get('temp') ? +f.get('temp') : null, umidade: f.get('umidade') ? +f.get('umidade') : null, categoria: f.get('categoria'), registros: regs, obs: s.obs || '' };
    save('hidratacao', o); UI.hidSel = o.id; closeModal(); toast('Sessão de hidratação salva');
  };
}

/* ---------- ações ---------- */
dmOn('click', e => {
  const t = e.target.closest('[data-nut],[data-hid],[data-ener],[data-act]'); if (!t) return;
  if (t.dataset.nut) { UI.nutSel = t.dataset.nut; if (S.view !== 'nut-comp') go('nut-comp'); else { $$('tr[data-nut]').forEach(r => r.classList.toggle('rowsel', r.dataset.nut === UI.nutSel)); $('#nutPanel').innerHTML = nutDetalhe(atl(UI.nutSel)); } return; }
  if (t.dataset.hid) { UI.hidSel = t.dataset.hid; if (S.view !== 'nut-hidra') go('nut-hidra'); else render(); return; }
  if (t.dataset.ener) { UI.nutAtl = t.dataset.ener; render(); return; }
  const id = t.dataset.id;
  switch (t.dataset.act) {
    case 'nova-av': formAval({}, id); break;
    case 'edit-av': formAval(S.avaliacoes.find(v => v.id === id)); break;
    case 'del-av': confirmar('Excluir esta avaliação corporal?', () => { const aid = S.avaliacoes.find(v => v.id === id)?.atletaId; remove('avaliacoes', id).then(() => syncAtletaCorpo(aid)); toast('Avaliação excluída'); }); break;
    case 'nova-hid': formHidra(); break;
    case 'edit-hid': formHidra(S.hidratacao.find(s => s.id === id)); break;
    case 'del-hid': confirmar('Excluir esta sessão de hidratação e todos os registros dela?', () => { remove('hidratacao', id); toast('Sessão excluída'); }); break;
  }
});
dmOn('change', e => {
  const t = e.target;
  if (t.name === 'diaTipo') { UI.diaTipo = t.value; render(); }
  if (t.id === 'cmpSel') { UI.cmpAtl = t.value; render(); }
  if (t.id === 'cfgAlvoMin' || t.id === 'cfgAlvoMax') { S.config.nutri = { ...(S.config.nutri || {}), alvoMin: +$('#cfgAlvoMin').value || 8, alvoMax: +$('#cfgAlvoMax').value || 14 }; putConfig(); }
});

/* ================= NUTRIÇÃO · COMPARAÇÃO INDIVIDUAL ================= */
NUT_TABS.splice(3, 0, ['nut-ind', 'Individual']);
TITLES['nut-ind'] = ['Nutrição', 'Individual'];
NUT_TITLE['nut-ind'] = 'EVOLUÇÃO INDIVIDUAL';
UI.indAtl = null; UI.indA = null; UI.indB = null;

// vínculo: a última avaliação atualiza peso, estatura e % de gordura no cadastro do atleta
async function syncAtletaCorpo(atletaId) {
  const a = atl(atletaId); if (!a) return;
  const last = avsDe(atletaId).slice(-1)[0]; if (!last) return;
  const c = calcAv(last);
  const o = { ...a, peso: c.peso ? String(Math.round(c.peso * 10) / 10) : a.peso, altura: c.altura ? String(c.altura) : a.altura, gordura: c.g != null ? String(c.g) : (a.gordura || ''), avData: last.data };
  if (o.peso !== a.peso || o.altura !== a.altura || o.gordura !== a.gordura || o.avData !== a.avData) await save('atletas', o);
}

const MET = [
  { k: 'peso', n: 'Peso', u: 'kg', d: 1, bom: 0 }, { k: 'g', n: '% de gordura', u: '%', d: 1, bom: -1 }, { k: 'mm', n: 'Massa magra', u: 'kg', d: 1, bom: 1 },
  { k: 'mg', n: 'Massa gorda', u: 'kg', d: 1, bom: -1 }, { k: 'soma', n: 'Σ dobras', u: 'mm', d: 1, bom: -1 }, { k: 'imc', n: 'IMC', u: '', d: 1, bom: 0 }
];
function deltaTag(v, bom, d = 1, u = '') {
  if (v == null || isNaN(v)) return '<span class="muted">—</span>';
  if (Math.abs(v) < 0.05) return '<span class="muted">= 0</span>';
  const cls = bom === 0 ? 'neu' : (v > 0) === (bom > 0) ? 'down' : 'up';
  return `<span class="${cls}">${v > 0 ? '▲ +' : '▼ −'}${nf(Math.abs(v), d)}${u ? ' ' + u : ''}</span>`;
}
function mesesEntre(a, b) { const d = dayDiff(a, b); return d < 45 ? `${d} dias` : `${Math.round(d / 30.4)} meses`; }
function parecer(a, A, B, ca, cb) {
  if (!A || !B || A.id === B.id) return 'Selecione duas avaliações diferentes para ver o resumo da evolução.';
  const p = [];
  const dp = cb.peso - ca.peso;
  p.push(`Entre ${fmtD(A.data)} e ${fmtD(B.data)} (${mesesEntre(A.data, B.data)}), ${esc((a.apelido || a.nome).split(' ')[0])} ${Math.abs(dp) < 0.1 ? 'manteve o peso' : (dp > 0 ? 'ganhou ' : 'perdeu ') + nf(Math.abs(dp), 1) + ' kg'}`);
  if (ca.mm != null && cb.mm != null) { const dm = cb.mm - ca.mm, dg = cb.mg - ca.mg; p[0] += `, com ${dm >= 0 ? '+' : '−'}${nf(Math.abs(dm), 1)} kg de massa magra e ${dg >= 0 ? '+' : '−'}${nf(Math.abs(dg), 1)} kg de massa gorda.`; }
  else p[0] += '.';
  if (ca.g != null && cb.g != null) { const d = cb.g - ca.g; p.push(`O % de gordura ${Math.abs(d) < 0.1 ? 'ficou estável' : (d < 0 ? 'caiu' : 'subiu')} de ${nf(ca.g, 1)}% para ${nf(cb.g, 1)}%${Math.abs(d) >= 0.1 ? ` (${d < 0 ? '−' : '+'}${nf(Math.abs(d), 1)} ponto${Math.abs(d) >= 2 ? 's' : ''})` : ''} e hoje está ${faixa(cb.g) === 'ideal' ? 'dentro' : 'fora'} da faixa-alvo (${alvo().min}–${alvo().max}%).`); }
  if (cb.altura && ca.altura && cb.altura - ca.altura >= 0.01) p.push(`Cresceu ${Math.round((cb.altura - ca.altura) * 100)} cm no período, o que explica parte do ganho de peso.`);
  if (ca.mm != null && cb.mm != null) { const dm = cb.mm - ca.mm, dg = cb.mg - ca.mg; p.push(dm > 0 && dg <= 0 ? 'Evolução positiva: ganho de massa magra sem aumento de gordura.' : dg > 0.8 ? 'Ponto de atenção: aumento de massa gorda; vale revisar a alimentação e a carga.' : dm < -0.5 ? 'Ponto de atenção: perda de massa magra; verificar ingestão de proteína e energia.' : 'Composição corporal estável no período.'); }
  return p.join(' ');
}
function indData() {
  const ats = atletasCat().filter(a => avsDe(a.id).length).sort((x, y) => x.nome.localeCompare(y.nome));
  if (!UI.indAtl || !atl(UI.indAtl) || !avsDe(UI.indAtl).length) UI.indAtl = (UI.nutSel && avsDe(UI.nutSel).length ? UI.nutSel : ats[0]?.id) || null;
  const a = atl(UI.indAtl); if (!a) return { ats };
  const h = avsDe(a.id);
  if (!h.find(v => v.id === UI.indA)) UI.indA = h[0].id;
  if (!h.find(v => v.id === UI.indB)) UI.indB = h[h.length - 1].id;
  let A = h.find(v => v.id === UI.indA), B = h.find(v => v.id === UI.indB);
  if (A.data > B.data) [A, B] = [B, A];
  const per = h.filter(v => v.data >= A.data && v.data <= B.data);
  return { ats, a, h, A, B, ca: calcAv(A), cb: calcAv(B), per };
}
function indPartes(D) {
  const { a, A, B, ca, cb, per } = D;
  const cards = MET.map(m => `<div class="kpi ind-k"><div style="min-width:0;width:100%"><div class="k">${m.n}</div><div class="v">${nfx(cb[m.k], m.d)}<small>${m.u}</small></div><div class="s">antes ${nfx(ca[m.k], m.d)} ${m.u} · ${deltaTag(cb[m.k] - ca[m.k], m.bom, m.d, m.u)}</div></div></div>`).join('');
  const cs = per.map(v => ({ v, c: calcAv(v) }));
  const linhas = cs.map((x, i) => { const p = i ? cs[i - 1].c : null; return `<tr class="${x.v.id === A.id || x.v.id === B.id ? 'rowsel' : ''}"><td>${fmtD(x.v.data)}</td><td>${nfx(x.c.peso, 1)}</td><td>${nfx(x.c.altura, 2)}</td><td>${nfx(x.c.imc, 1)}</td><td><b>${nfx(x.c.g, 1, '%')}</b></td><td>${p ? deltaTag(x.c.g - p.g, -1, 1) : '—'}</td><td>${nfx(x.c.mm, 1)}</td><td>${p ? deltaTag(x.c.mm - p.mm, 1, 1) : '—'}</td><td>${nfx(x.c.mg, 1)}</td><td>${nfx(x.c.soma, 1)}</td><td class="l">${esc(PROT[x.v.protocolo]?.n.split(' ·')[0] || '')}</td></tr>`; }).join('');
  const ch = (k, nome, min) => cs.length > 1 ? `<div><h5>${nome}</h5>${lineChart(cs.map(x => fmtDs(x.v.data)), cs.map(x => x.c[k] != null ? Math.round(x.c[k] * 10) / 10 : 0), { w: 320, h: 170, min, label: nome })}</div>` : '';
  const graf = cs.length > 1 ? `<div class="minich four">${ch('peso', 'Peso (kg)', 40)}${ch('g', '% de gordura', 5)}${ch('mm', 'Massa magra (kg)', 30)}${ch('mg', 'Massa gorda (kg)', 3)}</div>` : miniEmpty('Só uma avaliação no período', 'Com duas ou mais avaliações aparecem os gráficos de evolução.');
  const pares = (obj, labels, ua, ub) => { const ks = Object.keys(labels).filter(k => (+ua[k] || 0) || (+ub[k] || 0)); if (!ks.length) return miniEmpty('Sem medidas registradas'); const mx = Math.max(...ks.flatMap(k => [+ua[k] || 0, +ub[k] || 0]), 1); return `<div class="pairs">${ks.map(k => { const x = +ua[k] || 0, y = +ub[k] || 0; return `<div class="pl">${labels[k]}</div><div class="pb2"><div><i style="width:${(x / mx * 100).toFixed(0)}%;background:#8a948f"></i><b>${x ? nf(x, 1) : '—'}</b></div><div><i style="width:${(y / mx * 100).toFixed(0)}%;background:var(--g500)"></i><b>${y ? nf(y, 1) : '—'}</b></div></div><div class="pd">${x && y ? deltaTag(y - x, obj === 'dob' ? -1 : 0, 1) : ''}</div>`; }).join('')}</div><div class="legend-status" style="justify-content:center;margin-top:8px"><span><span class="sq" style="background:#8a948f"></span>${fmtD(A.data)}</span><span><span class="sq" style="background:var(--g500)"></span>${fmtD(B.data)}</span></div>`; };
  const eA = energia({ ...a, peso: ca.peso }, 'moderado'), eB = energia(a, 'moderado');
  const eAx = (() => { if (!ca.peso) return null; const tmb = ca.mm ? 500 + 22 * ca.mm : (idadeEm(a.nascimento, A.data) <= 18 ? 17.686 * ca.peso + 658.2 : 15.057 * ca.peso + 692.2); const get = tmb * DIAS.moderado[1]; const ptn = 1.6 * ca.peso, lip = 0.28 * get / 9; return { get, ptn, cho: Math.max(0, (get - ptn * 4 - lip * 9) / 4), agua: ca.peso * 0.04 }; })();
  const nutri = eB && eAx ? `<table class="t"><thead><tr><th class="l">Treino moderado</th><th>${fmtDs(A.data)}</th><th>${fmtDs(B.data)}</th><th>Variação</th></tr></thead><tbody>${[['Gasto total (kcal)', eAx.get, eB.get, 0], ['Carboidrato (g)', eAx.cho, eB.cho, 0], ['Proteína (g)', eAx.ptn, eB.ptn, 0], ['Água (L)', eAx.agua, eB.agua, 1]].map(([n, x, y, d]) => `<tr><td class="l">${n}</td><td>${nf(x, d)}</td><td><b>${nf(y, d)}</b></td><td>${deltaTag(y - x, 0, d)}</td></tr>`).join('')}</tbody></table>` : miniEmpty('Sem dados');
  const ids = new Set([a.id]); const hs = S.hidratacao.filter(s => (s.registros || []).some(r => r.atletaId === a.id)).sort((x, y) => y.data.localeCompare(x.data)).slice(0, 6);
  const hid = hs.length ? `<table class="t"><thead><tr><th>Data</th><th>Sessão</th><th>% perdido</th><th>Sudorese</th><th>Situação</th></tr></thead><tbody>${hs.map(s => { const r = s.registros.find(x => x.atletaId === a.id), c = hidCalc(r, s.duracao); return c ? `<tr><td>${fmtD(s.data)}</td><td>${esc(s.tipo)}</td><td><b>${nf(c.pct, 2)}%</b></td><td>${nfx(c.sud, 2)} L/h</td><td><span class="st ${HSTAT[c.st][1]}">${HSTAT[c.st][0]}</span></td></tr>` : ''; }).join('')}</tbody></table>` : miniEmpty('Sem registros de hidratação');
  const ficha = `<div class="det-head" style="margin:0">${ava(a)}<div><b>${esc(a.apelido || a.nome)}${subTag(a)}</b><span class="muted">${esc(a.categoria)} · ${idade(a.nascimento)} anos · ${D.h.length} avaliação(ões)</span></div><span style="margin-left:auto">${ptag(a.posicao)}</span></div>`;
  return { cards, linhas, graf, dob: pares('dob', DOBRAS, A.dobras || {}, B.dobras || {}), circ: pares('circ', CIRC, A.circ || {}, B.circ || {}), nutri, hid, ficha, txt: parecer(a, A, B, ca, cb) };
}
function fNutInd() {
  const D = indData();
  if (!D.a) return `<div class="empty"><h3>Nenhum atleta avaliado</h3>Registre avaliações em Composição Corporal para comparar a evolução.<div class="acts"><button class="btn pri" data-act="nova-av">${IC.plus} Nova avaliação</button></div></div>`;
  const P = indPartes(D), { a, h, A, B } = D;
  return `<div class="panel" style="margin-bottom:16px"><div class="pb indbar">
      ${P.ficha}
      <div class="f"><label for="indAtl">Atleta</label><select id="indAtl">${D.ats.map(x => `<option value="${x.id}" ${x.id === a.id ? 'selected' : ''}>${esc(x.nome)} · ${esc(x.subcategoria || x.categoria)}</option>`).join('')}</select></div>
      <div class="f"><label for="indA">Comparar de</label><select id="indA">${h.map(v => `<option value="${v.id}" ${v.id === A.id ? 'selected' : ''}>${fmtD(v.data)}</option>`).join('')}</select></div>
      <div class="f"><label for="indB">até</label><select id="indB">${h.map(v => `<option value="${v.id}" ${v.id === B.id ? 'selected' : ''}>${fmtD(v.data)}</option>`).join('')}</select></div>
      <button class="btn" data-act="print-nutind" data-id="${a.id}">${IC.print} Relatório individual</button>
    </div></div>
  <div class="kpis">${P.cards}</div>
  <div class="row r21">
    ${panel(`Evolução no período · ${fmtD(A.data)} a ${fmtD(B.data)}`, P.graf)}
    ${panel('Resumo da evolução', `<p class="parecer">${P.txt}</p>`)}
  </div>
  <div class="row" style="grid-template-columns:1fr">${panel('Avaliação por avaliação', `<div class="tbl-wrap"><table class="t"><thead><tr><th>Data</th><th>Peso</th><th>Estatura</th><th>IMC</th><th>% gordura</th><th>Δ %G</th><th>Massa magra</th><th>Δ MM</th><th>Massa gorda</th><th>Σ dobras</th><th class="l">Protocolo</th></tr></thead><tbody>${P.linhas}</tbody></table></div>`, { np: true })}</div>
  <div class="row" style="grid-template-columns:1fr">
    ${panel(`Dobras cutâneas (mm) · ${fmtDs(A.data)} x ${fmtDs(B.data)}`, P.dob)}
  </div>
  <div class="row r2">
    ${panel('Necessidade nutricional estimada', P.nutri, { np: true })}
    ${panel('Hidratação do atleta', P.hid, { np: true })}
  </div>`;
}
function pNutInd(a) {
  const keep = UI.indAtl; if (a) UI.indAtl = a.id; const D = indData(); UI.indAtl = keep;
  if (!D.a) return [];
  const P = indPartes(D), { A, B } = D;
  const hdr = cont => header({ title: 'RELATÓRIO NUTRICIONAL' + (cont ? ' (CONT.)' : ''), sub: 'NUTRIÇÃO ESPORTIVA', pill: (D.a.apelido || D.a.nome).toUpperCase(), items: [['user', 'Categoria', D.a.subcategoria || D.a.categoria], ['cal', 'Período', `${fmtDs(A.data)} a ${fmtDs(B.data)}`], ['clock', 'Emitido em', fmtD(todayISO())]] }) + '<div style="height:14px"></div>';
  const v0 = S.view; S.view = 'nut-ind';
  try {
    return [
      pageWrap(hdr() + `<div class="panel" style="margin-bottom:14px"><div class="pb">${P.ficha}</div></div><div class="kpis">${P.cards}</div><div class="row r21">${panel(`Evolução no período · ${fmtD(A.data)} a ${fmtD(B.data)}`, P.graf)}${panel('Resumo da evolução', `<p class="parecer">${P.txt}</p>`)}</div>`),
      pageWrap(hdr(true) + `<div class="row" style="grid-template-columns:1fr">${panel('Avaliação por avaliação', `<div class="tbl-wrap"><table class="t"><thead><tr><th>Data</th><th>Peso</th><th>Estatura</th><th>IMC</th><th>% gordura</th><th>Δ %G</th><th>Massa magra</th><th>Δ MM</th><th>Massa gorda</th><th>Σ dobras</th><th class="l">Protocolo</th></tr></thead><tbody>${P.linhas}</tbody></table></div>`, { np: true })}</div><div class="row r3">${panel('Dobras cutâneas (mm)', P.dob)}${panel('Circunferências (cm)', P.circ)}${panel('Necessidade nutricional', P.nutri, { np: true })}</div>`)
    ];
  } finally { S.view = v0; }
}
dmOn('change', e => {
  const t = e.target;
  if (t.id === 'indAtl') { UI.indAtl = t.value; UI.indA = UI.indB = null; render(); }
  if (t.id === 'indA') { UI.indA = t.value; render(); }
  if (t.id === 'indB') { UI.indB = t.value; render(); }
});
dmOn('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'ind-from-comp') { UI.indAtl = t.dataset.id; UI.indA = UI.indB = null; go('nut-ind'); }
  if (t.dataset.act === 'print-nutind') printMenu('nutind', t.dataset.id);
});

/* ================= ATLETAS: CARTÕES DETALHADOS + FICHA INDIVIDUAL ================= */
Object.assign(IC, {
  goal: I('<circle cx="12" cy="12" r="10"/><path d="m12 7 4.2 3.1-1.6 5H9.4l-1.6-5z"/>'),
  boot: I('<path d="M3 15c0-3 1-7 2-9h5l1 4c3 0 6 1 8 3 1 1 2 2 2 4v1H3z"/><path d="M3 18h18"/>'),
  foot: I('<path d="M9 2c2 0 3 2 3 5s-1 5-1 8 1 7-2 7-4-3-4-7 1-6 1-8 1-5 3-5z"/>'),
  dots: I('<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>', '0 0 24 24', true),
  shirt: I('<path d="M8 3 3 6l2 5 2-1v11h10V10l2 1 2-5-5-3a4 4 0 0 1-8 0z"/>')
});
UI.atPage = 0; UI.atPer = 12; UI.fichaTab = 'geral'; UI.fichaId = null;
const PE_ABR = p => ({ Direito: 'Destro', Esquerdo: 'Canhoto', Ambidestro: 'Ambidestro' }[p] || '—');

/* ---------- números de cada atleta ---------- */
function minStats(aid) {
  const M = window.MIN && MIN.S; const out = { jogos: 0, min: 0, gols: 0, ast: 0, tit: 0, res: 0, ca: 0, cv: 0, rel: 0, possivel: 0, lista: [] };
  if (!M) return out;
  (M.jogos || []).filter(j => noPeriodo(String(j.data || ''))).forEach(j => {
    const r = (j.relacionados || []).find(x => x.atletaId === aid); if (!r) return;
    const m = +r.min || 0, dur = +j.duracao || +(M.config?.duracao?.[j.categoria]) || 90;
    out.rel++; out.possivel += dur; if (m > 0) out.jogos++; out.min += m; out.gols += +r.gols || 0; out.ast += +r.assist || 0; out.ca += +r.ca || 0; out.cv += +r.cv || 0;
    if (r.status === 'T') out.tit++; else out.res++;
    out.lista.push({ j, r, m, dur });
  });
  out.lista.sort((x, y) => String(y.j.data).localeCompare(String(x.j.data)));
  return out;
}
function periodo() {
  const hoje = todayISO();
  if (F.ano === 'Todos') { const d = S.lesoes.map(l => l.data).sort()[0] || hoje.slice(0, 4) + '-01-01'; return [d, hoje]; }
  const p = F.periodo || 'ano', mm = /^\d\d$/.test(p) ? p : null; const ini = F.ano + (p === 's2' ? '-07-01' : mm ? `-${mm}-01` : '-01-01'), fim = F.ano + (p === 's1' ? '-06-30' : mm ? `-${mm}-${new Date(+F.ano, +mm, 0).getDate()}` : '-12-31');
  return [ini, fim < hoje ? fim : hoje];
}
function dispon(aid) {
  const [ini, fim] = periodo(); const tot = Math.max(1, dayDiff(ini, fim) + 1);
  let dm = 0;
  S.lesoes.filter(l => l.atletaId === aid).forEach(l => { const e = l.status === 'liberado' && l.statusDatas?.liberado ? l.statusDatas.liberado : todayISO(); const a = l.data > ini ? l.data : ini, b = e < fim ? e : fim; if (b >= a) dm += dayDiff(a, b); });
  return { pct: Math.max(0, Math.min(100, Math.round((1 - dm / tot) * 100))), dias: dm };
}
function statusFisico(a) {
  const at = ativaDe(a.id), ms = minStats(a.id), hoje = todayISO();
  // carga: minutos dos últimos 28 dias comparados com a média de 28 dias da temporada (relação aguda : crônica)
  const d28 = addDays(hoje, -28); const ag = ms.lista.filter(x => x.j.data >= d28).reduce((s, x) => s + x.m, 0);
  const [ini] = periodo(); const sem = Math.max(1, dayDiff(ini, hoje) / 28); const cr = ms.min / sem;
  let carga = 'Sem dados', cc = 'neu';
  if (ms.lista.length) { const r = cr ? ag / cr : 0; if (r > 1.5) { carga = 'Alta'; cc = 'bad'; } else if (r >= 0.8 || ag === 0 && cr < 30) { carga = 'Adequada'; cc = 'ok'; } else { carga = 'Baixa'; cc = 'warn'; } }
  const ano = addDays(hoje, -365), recs = S.lesoes.filter(l => l.atletaId === a.id && l.data >= ano);
  let risco = 'Baixo', rc = 'ok'; const pts = recs.length + recs.filter(l => l.recorrente).length * 2 + (carga === 'Alta' ? 2 : 0);
  if (at && at.status !== 'liberado') { risco = at.status === 'retorno' ? 'Moderado' : 'Alto'; rc = at.status === 'retorno' ? 'warn' : 'bad'; }
  else if (pts >= 4) { risco = 'Alto'; rc = 'bad'; } else if (pts >= 2) { risco = 'Moderado'; rc = 'warn'; }
  const apto = !at ? ['Sim', 'ok'] : at.status === 'retorno' ? ['Parcial', 'warn'] : ['Não', 'bad'];
  return { carga, cc, risco, rc, apto, at, disp: dispon(a.id) };
}
const ring = (pct, size = 64, cor = 'var(--g500)') => { const r = 26, c = 2 * Math.PI * r; return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true"><circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--line)" stroke-width="7"/><circle cx="32" cy="32" r="${r}" fill="none" stroke="${cor}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c * pct / 100} ${c}" transform="rotate(-90 32 32)"/></svg>`; };
const gauge = pct => { const r = 52, c = Math.PI * r; return `<svg viewBox="0 0 130 74" width="150" aria-hidden="true"><path d="M13 66a52 52 0 0 1 104 0" fill="none" stroke="var(--line)" stroke-width="11" stroke-linecap="round"/><path d="M13 66a52 52 0 0 1 104 0" fill="none" stroke="var(--g500)" stroke-width="11" stroke-linecap="round" stroke-dasharray="${c * pct / 100} ${c}"/><text x="65" y="58" text-anchor="middle" font-size="24" font-weight="800" fill="var(--ink)" style="font-family:var(--fc)">${pct}%</text></svg>`; };
const fotoBox = (a, cls = '') => `<span class="afoto ${cls}">${a.foto ? `<img src="${esc(a.foto)}" alt="">` : `<span class="sil">${IC.shirt}</span>`}</span>`;

/* ---------- cartões ---------- */
function atlCard(a) {
  const at = ativaDe(a.id), ms = minStats(a.id), d = dispon(a.id);
  const lesT = S.lesoes.filter(l => l.atletaId === a.id).length;
  const lesA = S.lesoes.filter(l => l.atletaId === a.id && (noPeriodo(l.data))).length;
  const sel = UI.selMode && UI.sel.has(a.id);
  return `<div class="acard ${sel ? 'picked' : ''}" data-ficha="${a.id}" tabindex="0" role="button" aria-label="Abrir ficha de ${esc(a.nome)}">
    ${UI.selMode ? `<input type="checkbox" class="selchk acheck" data-sel="${a.id}" ${sel ? 'checked' : ''} aria-label="Selecionar ${esc(a.nome)}">` : ''}
    <div class="atop">
      <span class="ainit">${esc(initials(a.apelido || a.nome))}</span>${fotoBox(a)}
      <div class="ainfo"><b>${esc(a.apelido || a.nome)}${subTag(a)}</b><span>${esc(a.posDetalhe || POSN[a.posicao] || '')}${a.numero ? ' · #' + esc(a.numero) : ''}</span>
        <div class="abadges"><span class="bdm" title="Passagens pelo DM na temporada">DM ${lesA}</span><span class="bles" title="Lesões no histórico">${lesT} ${lesT === 1 ? 'lesão' : 'lesões'}</span><span class="bdisp" title="Disponibilidade na temporada">${d.pct}%</span>${at ? chip(at.status) : ''}</div>
        ${a.avData ? `<span class="aval">${IC.apple} Avaliado em ${fmtD(a.avData)}${a.gordura ? ' · ' + nf(a.gordura, 1) + '% G' : ''}</span>` : '<span class="aval no">Sem avaliação corporal</span>'}
      </div>
      <button class="icon-btn amenu" data-act="atl-menu" data-id="${a.id}" aria-label="Opções de ${esc(a.nome)}">${IC.dots}</button>
    </div>
    <div class="astats">
      <div><small>${IC.clock} Minutos</small><b>${ms.min}</b></div>
      <div><small>${IC.goal} Gols</small><b>${ms.gols}</b></div>
      <div><small>${IC.boot} Assist.</small><b>${ms.ast}</b></div>
      <div><small>${IC.med} DM lesão</small><b>${lesA}</b></div>
      <div><small>${IC.foot} Pé</small><b class="pe">${PE_ABR(a.pe)}</b></div>
    </div>
  </div>`;
}
vAtletas = function () {
  const q = UI.atBusca.toLowerCase(), base = atletasCat();
  const list = base.filter(a => (!q || (a.nome + ' ' + (a.apelido || '')).toLowerCase().includes(q)) && (UI.atPos === 'Todas' || a.posicao === UI.atPos) && (!UI.atPend || typeof pendente !== 'function' || pendente(a, UI.atPend)))
    .sort((a, b) => POS.indexOf(a.posicao) - POS.indexOf(b.posicao) || a.nome.localeCompare(b.nome));
  const pages = Math.max(1, Math.ceil(list.length / UI.atPer)); if (UI.atPage >= pages) UI.atPage = pages - 1;
  const pg = list.slice(UI.atPage * UI.atPer, (UI.atPage + 1) * UI.atPer);
  return `<div class="page-h"><div><h2>Atletas</h2><span class="muted">Plantel, perfil individual e histórico completo · ${base.length} atleta(s) · ${esc(catLabel().toLowerCase())}</span></div><span class="sp"></span><input class="search" id="atBusca" placeholder="Buscar atleta" value="${esc(UI.atBusca)}" aria-label="Buscar atleta"><button class="btn" data-go="importar">${IC.upload} Importar</button><button class="btn danger" data-act="limpar-menu">${IC.trash} Limpar dados</button>${btnAtleta(true)}</div>
  <nav class="subtabs"><button class="on" data-go="atletas">Cadastro</button><button data-go="importar">Importar dados</button></nav>
  <div class="pos-tabs">${['Todas', ...POS].map(p => `<button class="chip ${UI.atPos === p ? 'on' : ''}" data-pos="${p}">${p !== 'Todas' ? `<i style="width:10px;height:10px;border-radius:50%;display:inline-block;background:${PC1[p]}"></i>` : ''}${p === 'Todas' ? 'Todas' : POSN[p]}</button>`).join('')}</div>
  ${UI.selMode ? `<div class="selbar"><label class="chk"><input type="checkbox" id="selAll" ${list.length && list.every(a => UI.sel.has(a.id)) ? 'checked' : ''}>Selecionar todos da lista (${list.length})</label><span class="muted">${UI.sel.size} selecionado(s)</span><span style="flex:1"></span><button class="btn" data-act="sel-cancel">Cancelar</button><button class="btn red" data-act="sel-del" ${UI.sel.size ? '' : 'disabled'}>${IC.trash} Excluir selecionados</button></div>` : ''}
  ${typeof pendBar === 'function' && S.atletas.length ? pendBar(base) : ''}
  ${noData()}
  ${pg.length ? `<div class="agrid">${pg.map(atlCard).join('')}</div>
  <div class="apager"><span class="muted">Mostrando ${UI.atPage * UI.atPer + 1} a ${Math.min(list.length, (UI.atPage + 1) * UI.atPer)} de ${list.length} atletas</span><span class="pgs"><button class="btn sm" data-act="at-pg" data-p="${UI.atPage - 1}" ${UI.atPage ? '' : 'disabled'} aria-label="Página anterior">‹</button>${Array.from({ length: pages }, (_, i) => `<button class="btn sm ${i === UI.atPage ? 'pri' : ''}" data-act="at-pg" data-p="${i}">${i + 1}</button>`).join('')}<button class="btn sm" data-act="at-pg" data-p="${UI.atPage + 1}" ${UI.atPage < pages - 1 ? '' : 'disabled'} aria-label="Próxima página">›</button></span><label class="muted" style="display:flex;align-items:center;gap:6px">Itens por página <select id="atPer" class="search" style="min-width:0;padding:5px 8px">${[12, 24, 48].map(n => `<option ${n === UI.atPer ? 'selected' : ''}>${n}</option>`).join('')}</select></label></div>` : S.atletas.length ? `<div class="empty"><h3>Nenhum atleta encontrado</h3>Ajuste a busca, a posição ou a categoria.</div>` : ''}`;
};

/* ---------- ficha individual ---------- */
function fichaDados(a) {
  const ms = minStats(a.id), sf = statusFisico(a), avs = avsDe(a.id), lastAv = avs.slice(-1)[0], cAv = lastAv ? calcAv(lastAv) : null;
  const ls = S.lesoes.filter(l => l.atletaId === a.id).sort((x, y) => y.data.localeCompare(x.data));
  const lesA = ls.filter(l => noPeriodo(l.data)).length;
  return { ms, sf, avs, lastAv, cAv, ls, lesA };
}
function fichaTopo(a, D) {
  const { ms, sf, cAv, ls, lesA } = D;
  const box = (k, v) => `<div class="fk"><small>${k}</small><b>${v}</b></div>`;
  return `<div class="ftop">
    <div class="fphoto">${a.foto ? `<img src="${esc(a.foto)}" alt="Foto de ${esc(a.nome)}">` : `<span class="sil">${IC.shirt}</span>`}<img class="fcrest" src="${LOGO}" alt=""></div>
    <div class="fmain">
      <div class="fname"><span class="ainit">${esc(initials(a.apelido || a.nome))}</span><div><h3>${esc(a.nome)}${a.numero ? ` <span>#${esc(a.numero)}</span>` : ''}</h3><p>${esc(a.subcategoria || a.categoria)} · ${esc(a.posDetalhe || POSN[a.posicao] || '')} · Temporada ${anoLabel() === 'TODAS' ? 'todas' : anoLabel()} · Pé ${esc((a.pe || '—').toLowerCase())}</p>
        <div class="fchips"><span class="fc ok">● Ativo</span><span class="fc ${sf.apto[1]}">${sf.apto[0] === 'Sim' ? '✓ Elegível' : sf.apto[0] === 'Parcial' ? '◐ Retorno gradual' : '✕ No DM'}</span>${ptag(a.posicao)}${subTag(a)}</div></div></div>
      <div class="fkgrid">
        ${box('Idade', (idade(a.nascimento) || '—') + ' anos')}${box('Peso', (cAv ? nf(cAv.peso, 1) : a.peso ? nf(a.peso, 1) : '—') + ' kg')}${box('Altura', (cAv?.altura ? nf(cAv.altura, 2) : a.altura ? nf(a.altura, 2) : '—') + ' m')}${box('Jogos', ms.jogos)}${box('Minutos', ms.min + "'")}
        ${box('Gols', ms.gols)}${box('Assistências', ms.ast)}${box('Lesões', ls.length)}${box('DM (temporada)', lesA)}
        <div class="fk fdisp"><div><small>Dispon. física</small><b>${sf.disp.pct}%</b></div>${ring(sf.disp.pct, 46)}</div>
      </div>
    </div>
  </div>`;
}
function fichaGeral(a, D) {
  const { ms, sf, avs, ls } = D;
  const meses = {}; ms.lista.forEach(x => { const k = String(x.j.data).slice(0, 7); meses[k] = (meses[k] || 0) + x.m; });
  const mk = Object.keys(meses).sort().slice(-8);
  const evo = mk.length ? vbars(mk.map(k => MESES[+k.slice(5, 7) - 1]), mk.map(k => meses[k]), { w: 520, h: 210, min: 30 }) : miniEmpty('Sem jogos na temporada', 'Os minutos vêm do módulo de Minutagem.');
  const part = ms.gols + ms.ast;
  const gp = part ? `<div class="donut-wrap">${donut([{ l: 'Gols', v: ms.gols, c: '#1b8a4a' }, { l: 'Assistências', v: ms.ast, c: '#7bd08f' }], part, 'PARTICIPAÇÕES', 140)}${legend([{ l: 'Gols', v: ms.gols, c: '#1b8a4a' }, { l: 'Assistências', v: ms.ast, c: '#7bd08f' }])}</div>` : miniEmpty('Sem participações em gol', 'na temporada selecionada.');
  const stx = (t, v, c) => `<div class="sfrow"><span>${IC.check} ${t}</span><em class="sfc ${c}">${v}</em></div>`;
  const sfis = `<div style="text-align:center">${gauge(sf.disp.pct)}<div class="muted" style="font-size:12.5px;margin:-4px 0 10px">Disponibilidade na temporada${sf.disp.dias ? ` · ${sf.disp.dias} dias no DM` : ''}</div></div>${stx('Carga de treino', sf.carga, sf.cc)}${stx('Risco de lesão', sf.risco, sf.rc)}${stx('Apto para jogar', sf.apto[0], sf.apto[1])}${sf.bem ? stx('Bem-estar (último)', sf.bem.txt, sf.bem.s) : ''}${sf.at ? `<div class="sfrow"><span>${IC.med} Situação no DM</span>${chip(sf.at.status)}</div>` : ''}`;
  const lesR = ls.slice(0, 4).map(l => `<div class="lrow">${lesThumb(l, 'sm')}<span class="ld">${fmtD(l.data)}</span><span class="ln"><b>${esc(l.tipo)}</b><small>${esc(regLong(l))}</small></span><span class="ldd">${diasFora(l)} dias</span>${l.status === 'liberado' ? '<span class="st st-ok">Resolvida</span>' : chip(l.status)}</div>`).join('') || miniEmpty('Sem lesões registradas');
  const jg = ms.lista.slice(0, 5).map(x => `<tr><td>${fmtDs(x.j.data)}</td><td class="l">${esc(x.j.adversario || '—')}</td><td>${x.j.golsPro ?? '–'} x ${x.j.golsContra ?? '–'}</td><td><b>${x.m}'</b></td><td>${'⚽'.repeat(Math.min(3, +x.r.gols || 0))}${+x.r.assist ? ' 🅰' + (x.r.assist > 1 ? '×' + x.r.assist : '') : ''}</td></tr>`).join('');
  const av = [...avs].reverse().slice(0, 5).map((v, i, arr) => { const c = calcAv(v), p = arr[i + 1] ? calcAv(arr[i + 1]) : null; return `<tr><td>${fmtD(v.data)}</td><td>${nf(c.peso, 1)} kg</td><td><b>${nfx(c.g, 1, '%')}</b></td><td>${p && p.g != null && c.g != null ? deltaTag(c.g - p.g, -1, 1) : '—'}</td><td>${nfx(c.mm, 1, ' kg')}</td></tr>`; }).join('');
  return `<div class="row r3" style="margin-bottom:14px">
    ${panel(`Evolução de minutagem <span class="r">Total: ${ms.min} min</span>`, evo)}
    ${panel('Participações em gol', gp)}
    ${panel('Status físico', sfis)}
  </div>
  <div class="row r3" style="margin:0">
    ${panel('Histórico recente de lesões', `<div class="lrows">${lesR}</div>`, { r: `<button data-act="ftab" data-t="lesoes">Ver tudo</button>` })}
    ${panel('Últimos jogos', jg ? `<table class="t"><thead><tr><th>Data</th><th class="l">Adversário</th><th>Placar</th><th>Min</th><th></th></tr></thead><tbody>${jg}</tbody></table>` : miniEmpty('Sem jogos'), { np: !!jg, r: `<button data-act="ftab" data-t="jogos">Ver todos</button>` })}
    ${panel('Avaliações recentes', av ? `<table class="t"><thead><tr><th>Data</th><th>Peso</th><th>% G</th><th>Δ</th><th>M. magra</th></tr></thead><tbody>${av}</tbody></table>` : miniEmpty('Sem avaliações corporais'), { np: !!av, r: `<button data-act="ftab" data-t="aval">Ver todas</button>` })}
  </div>`;
}
function fichaMin(a, D) {
  const { ms } = D; const porComp = {};
  ms.lista.forEach(x => { const k = x.j.competicao || '—'; const o = porComp[k] = porComp[k] || { rel: 0, jogos: 0, tit: 0, min: 0, pos: 0, gols: 0, ast: 0 }; o.rel++; if (x.m) o.jogos++; if (x.r.status === 'T') o.tit++; o.min += x.m; o.pos += x.dur; o.gols += +x.r.gols || 0; o.ast += +x.r.assist || 0; });
  const rows = Object.entries(porComp);
  const kp = [['Relacionado', ms.rel], ['Jogou', ms.jogos], ['Titular', ms.tit], ['Reserva', ms.res], ['Minutos', ms.min + "'"], ['% dos minutos', pct(ms.min, ms.possivel)], ['Média por jogo', ms.jogos ? Math.round(ms.min / ms.jogos) + "'" : '—'], ['Cartões', `${ms.ca} 🟨 ${ms.cv} 🟥`]];
  return `<div class="fkgrid k8" style="margin-bottom:14px">${kp.map(([k, v]) => `<div class="fk"><small>${k}</small><b>${v}</b></div>`).join('')}</div>
  ${panel('Por competição', rows.length ? `<table class="t"><thead><tr><th class="l">Competição</th><th>Relac.</th><th>Jogos</th><th>Titular</th><th>Minutos</th><th>% minutos</th><th>Gols</th><th>Assist.</th></tr></thead><tbody>${rows.map(([k, o]) => `<tr><td class="l"><b>${esc(k)}</b></td><td>${o.rel}</td><td>${o.jogos}</td><td>${o.tit}</td><td><b>${o.min}</b></td><td>${pct(o.min, o.pos)}</td><td>${o.gols}</td><td>${o.ast}</td></tr>`).join('')}</tbody></table>` : miniEmpty('Sem jogos na temporada', 'Cadastre jogos e minutagem no módulo de Minutagem.'), { np: !!rows.length })}`;
}
function fichaJogos(a, D) {
  const { ms } = D;
  return panel(`Histórico de jogos <span class="r">${ms.lista.length} jogo(s)</span>`, ms.lista.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th>Data</th><th>Competição</th><th class="l">Adversário</th><th>Mando</th><th>Placar</th><th>Situação</th><th>Minutos</th><th>Gols</th><th>Assist.</th><th>Cartões</th></tr></thead><tbody>${ms.lista.map(x => `<tr><td>${fmtD(x.j.data)}</td><td>${esc(x.j.competicao || '')}</td><td class="l">${esc(x.j.adversario || '—')}</td><td>${x.j.mando === 'fora' ? 'Fora' : 'Casa'}</td><td><b>${x.j.golsPro ?? '–'} x ${x.j.golsContra ?? '–'}</b></td><td>${x.r.status === 'T' ? '<span class="st st-ok">Titular</span>' : x.m ? '<span class="st st-liberado">Entrou</span>' : '<span class="st" style="background:var(--card2)">Não entrou</span>'}</td><td><b>${x.m}'</b></td><td>${+x.r.gols || 0}</td><td>${+x.r.assist || 0}</td><td>${+x.r.ca ? '🟨' : ''}${+x.r.cv ? '🟥' : ''}</td></tr>`).join('')}</tbody></table></div>` : miniEmpty('Sem jogos na temporada'), { np: !!ms.lista.length });
}
function fichaLesoes(a, D) {
  const { ls } = D;
  return `<div class="row r12" style="margin:0">${panel('Regiões afetadas', bodyMap({ mode: 'hl', ls }))}${panel(`Todas as lesões <span class="r">${ls.length}</span>`, ls.length ? `<div class="lrows">${ls.map(l => `<div class="lrow">${lesThumb(l, 'sm')}<span class="ld">${fmtD(l.data)}</span><span class="ln"><b>${esc(lesNome(l))}</b><small>${esc(regLong(l))} · ${esc(l.local || '')} · ${esc(l.mecanismo || '')}</small></span><span class="ldd">${diasFora(l)} dias</span>${l.status === 'liberado' ? '<span class="st st-ok">Resolvida</span>' : chip(l.status)}</div>`).join('')}</div>` : miniEmpty('Sem lesões registradas'))}</div>`;
}
function fichaAval(a, D) {
  const { avs } = D; if (!avs.length) return miniEmpty('Sem avaliações corporais', 'Registre em Nutrição → Composição corporal.');
  const cs = avs.map(v => ({ v, c: calcAv(v) }));
  const ch = (k, n, min) => cs.length > 1 ? `<div><h5>${n}</h5>${lineChart(cs.map(x => fmtDs(x.v.data)), cs.map(x => x.c[k] != null ? Math.round(x.c[k] * 10) / 10 : 0), { w: 320, h: 160, min })}</div>` : '';
  return `${cs.length > 1 ? `<div class="minich four" style="margin-bottom:14px">${ch('peso', 'Peso (kg)', 40)}${ch('g', '% de gordura', 5)}${ch('mm', 'Massa magra (kg)', 30)}${ch('soma', 'Σ dobras (mm)', 10)}</div>` : ''}
  ${panel('Avaliações corporais', `<table class="t"><thead><tr><th>Data</th><th>Peso</th><th>Estatura</th><th>IMC</th><th>% gordura</th><th>Massa magra</th><th>Massa gorda</th><th>Σ dobras</th><th>Situação</th></tr></thead><tbody>${[...cs].reverse().map(x => `<tr><td>${fmtD(x.v.data)}</td><td>${nfx(x.c.peso, 1)}</td><td>${nfx(x.c.altura, 2)}</td><td>${nfx(x.c.imc, 1)}</td><td><b>${nfx(x.c.g, 1, '%')}</b></td><td>${nfx(x.c.mm, 1)}</td><td>${nfx(x.c.mg, 1)}</td><td>${nfx(x.c.soma, 1)}</td><td>${faixaChip(x.c.g)}</td></tr>`).join('')}</tbody></table>`, { np: true, r: `<button data-act="ind-from-comp" data-id="${a.id}">Comparar evolução</button>` })}`;
}
const FTABS = [['geral', 'Visão Geral'], ['min', 'Minutagem'], ['jogos', 'Histórico de Jogos'], ['lesoes', 'Lesões / DM'], ['aval', 'Avaliações corporais']];
function fichaHTML(a) {
  const D = fichaDados(a); const t = UI.fichaTab;
  const body = { geral: fichaGeral, min: fichaMin, jogos: fichaJogos, lesoes: fichaLesoes, aval: fichaAval }[t] || fichaGeral;
  return mh('Ficha individual do atleta') + `<div class="mb ficha">
    <div class="fbar"><span class="muted">Clique fora ou em × para fechar</span><span style="flex:1"></span><button class="btn sm" data-act="edit-atleta" data-id="${a.id}">${IC.edit} Editar</button><button class="btn sm" data-act="lesao-atleta" data-id="${a.id}">${IC.plus} Lesão</button><button class="btn sm" data-act="nova-av" data-id="${a.id}">${IC.plus} Avaliação</button><button class="btn sm pri" data-act="print-ficha" data-id="${a.id}">${IC.print} Imprimir ficha</button></div>
    ${fichaTopo(a, D)}
    <div class="ftabs">${FTABS.map(([k, n]) => `<button class="${t === k ? 'on' : ''}" data-act="ftab" data-t="${k}">${n}</button>`).join('')}</div>
    <div class="fbody">${body(a, D)}</div>
  </div>`;
}
function abrirFicha(id, tab) { const a = atl(id); if (!a) return; UI.fichaId = id; if (tab) UI.fichaTab = tab; openModal(fichaHTML(a), true); $('#modal').classList.add('fx'); }
function pFicha(a) {
  const D = fichaDados(a);
  const hdr = cont => header({ title: 'FICHA INDIVIDUAL' + (cont ? ' (CONT.)' : ''), sub: 'PERFORMANCE · DM · NUTRIÇÃO · MINUTAGEM', pill: (a.apelido || a.nome).toUpperCase(), items: [['user', 'Categoria', a.subcategoria || a.categoria], ['cal', 'Temporada', anoLabel()], ['clock', 'Emitido em', fmtD(todayISO())]] }) + '<div style="height:14px"></div>';
  return [
    pageWrap(hdr() + `<div class="panel" style="margin-bottom:14px"><div class="pb ficha">${fichaTopo(a, D)}</div></div><div class="grow">${fichaGeral(a, D)}</div>`),
    pageWrap(hdr(true) + `<div class="row r2" style="margin-bottom:14px">${panel('Minutagem por competição', fichaMin(a, D).replace(/^<div class="fkgrid k8"[^]*?<\/div>\s*/, ''))}${panel('Lesões', `<div class="lrows">${D.ls.slice(0, 6).map(l => `<div class="lrow">${lesThumb(l, 'sm')}<span class="ld">${fmtD(l.data)}</span><span class="ln"><b>${esc(lesNome(l))}</b><small>${esc(regLong(l))}</small></span><span class="ldd">${diasFora(l)} dias</span>${l.status === 'liberado' ? '<span class="st st-ok">Resolvida</span>' : chip(l.status)}</div>`).join('') || miniEmpty('Sem lesões')}</div>`)}</div><div class="grow">${fichaJogos(a, D)}</div>`)
  ];
}

/* ---------- ações ---------- */
dmOn('click', e => {
  const k = e.target.closest('.kmenu button[data-act]'); if (k) { $$('.kmenu').forEach(m => m.remove()); }
  const t = e.target.closest('[data-act]');
  if (t) {
    const id = t.dataset.id;
    switch (t.dataset.act) {
      case 'atl-menu': {
        e.stopPropagation(); const open = t.parentElement.querySelector('.kmenu'); $$('.kmenu').forEach(m => m.remove()); if (open) return;
        const m = document.createElement('div'); m.className = 'kmenu'; m.innerHTML = `<button data-act="ficha" data-id="${id}">${IC.user} Ver ficha</button><button data-act="edit-atleta" data-id="${id}">${IC.edit} Editar cadastro</button><button data-act="lesao-atleta" data-id="${id}">${IC.med} Registrar lesão</button><button data-act="nova-av" data-id="${id}">${IC.apple} Nova avaliação</button><button data-act="hist" data-id="${id}">${IC.hist} Histórico no DM</button><button data-act="print-ficha" data-id="${id}">${IC.print} Imprimir ficha</button><button data-act="del-atleta" data-id="${id}" class="danger">${IC.trash} Excluir</button>`;
        t.parentElement.appendChild(m); return;
      }
      case 'ficha': abrirFicha(id, 'geral'); return;
      case 'ftab': UI.fichaTab = t.dataset.t; if (UI.fichaId && $('#modal .ficha')) { const s = $('#modal .mb').scrollTop; openModal(fichaHTML(atl(UI.fichaId)), true); $('#modal').classList.add('fx'); $('#modal .mb').scrollTop = s; } return;
      case 'print-ficha': printMenu('ficha', id); return;
      case 'at-pg': UI.atPage = Math.max(0, +t.dataset.p); render(); return;
    }
    return;
  }
  if (!e.target.closest('.kmenu')) $$('.kmenu').forEach(m => m.remove());
  const c = e.target.closest('[data-ficha]');
  if (c && !e.target.closest('input,button,label')) { if (UI.selMode) { const cb = c.querySelector('.acheck'); if (cb) { cb.checked = !cb.checked; cb.dispatchEvent(new Event('change', { bubbles: true })); } return; } abrirFicha(c.dataset.ficha, 'geral'); }
});
dmOn('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.acard')) { e.preventDefault(); abrirFicha(e.target.dataset.ficha, 'geral'); } });
dmOn('change', e => { if (e.target.id === 'atPer') { UI.atPer = +e.target.value; UI.atPage = 0; render(); } });

/* ================= AVALIAÇÕES FÍSICAS + MATURAÇÃO ================= */
Object.assign(IC, {
  jump: I('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 21h14"/><circle cx="12" cy="18" r="1.5"/>'),
  bolt: I('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
  heart: I('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>'),
  turn: I('<path d="M4 20V10a6 6 0 0 1 12 0v4"/><path d="m12 10 4 4 4-4"/>'),
  grow: I('<path d="M12 22V8"/><path d="M12 8c0-3 2-6 6-6 0 4-3 6-6 6zM12 12c0-3-2-6-6-6 0 4 3 6 6 6z"/>'),
  stopw: I('<circle cx="12" cy="14" r="8"/><path d="M12 10v4l2 2M10 2h4M12 2v4"/>')
});
S.testes = S.testes || []; S.maturacao = S.maturacao || [];
const TESTS = {
  cmj: { n: 'CMJ', l: 'Salto com contramovimento (média de 3)', u: 'cm', d: 1, up: 1, ic: 'jump' },
  ift: { n: '30-15 IFT', l: 'Velocidade final (VIFT)', u: 'km/h', d: 1, up: 1, ic: 'heart' },
  v10: { n: 'Velocidade 10 m', l: 'Sprint 10 metros', u: 's', d: 2, up: -1, ic: 'bolt' },
  v30: { n: 'Velocidade 30 m', l: 'Sprint 30 metros', u: 's', d: 2, up: -1, ic: 'stopw' },
  t505: { n: 'Teste 505', l: 'Mudança de direção (melhor média entre D e E)', u: 's', d: 2, up: -1, ic: 'turn' }
};
const AV_TABS = [['av-dash', 'Painel'], ['av-reg', 'Sessões de testes'], ['av-rank', 'Ranking e comparativo'], ['av-ind', 'Evolução individual']];
const MAT_TABS = [['mat-dash', 'Painel maturacional'], ['mat-ind', 'Individual']];
AV_TABS.forEach(([k, n]) => TITLES[k] = ['Avaliações físicas', n]); MAT_TABS.forEach(([k, n]) => TITLES[k] = ['Maturação', n]);
NAV.splice(2, 0, { k: 'aval', n: 'Avaliações físicas', ic: IC.stopw, sub: AV_TABS }, { k: 'mat', n: 'Maturação', ic: IC.grow, sub: MAT_TABS });
const AV_TITLE = { 'av-dash': 'PAINEL DE AVALIAÇÕES FÍSICAS', 'av-reg': 'SESSÕES DE TESTES', 'av-rank': 'RANKING E COMPARATIVO', 'av-ind': 'EVOLUÇÃO INDIVIDUAL · TESTES', 'mat-dash': 'PAINEL MATURACIONAL', 'mat-ind': 'MATURAÇÃO INDIVIDUAL' };
UI.avSel = null; UI.avTest = 'cmj'; UI.avAtl = null; UI.matAtl = null;

/* ---------- cálculos dos testes ---------- */
const numBR = x => x == null || x === '' ? NaN : Number(String(x).replace(',', '.'));
const avgT = arr => { const v = arr.map(numBR).filter(x => x > 0); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; };
const lado505 = (t, s) => { const m = avgT([t['t505' + s + '_1'], t['t505' + s + '_2']]); return m != null ? m : (+t['t505' + s] || null); };
const tval = (t, k) => { if (k === 't505') { const v = [lado505(t, 'd'), lado505(t, 'e')].filter(x => x != null); return v.length ? Math.min(...v) : null; } if (k === 'cmj' || k === 'v10' || k === 'v30') { const m = avgT([t[k + '_1'], t[k + '_2'], t[k + '_3']]); return m != null ? m : (+t[k] || null); } const v = +t[k]; return v ? v : null; };
const tsDe = id => S.testes.filter(t => t.atletaId === id).sort((a, b) => a.data.localeCompare(b.data));
const tsCat = () => { const ids = idsCat(); return S.testes.filter(t => ids.has(t.atletaId) && (noPeriodo(t.data))); };
function ultimoTeste(id, k, antes) { const l = tsDe(id).filter(t => tval(t, k) != null && (!antes || t.data < antes)); return l[l.length - 1] || null; }
function vo2(a, vift, data) { const idd = idadeEm(a.nascimento, data); const av = avsDe(a.id).filter(v => v.data <= (data || todayISO())).slice(-1)[0]; const w = av ? +av.peso : +a.peso || 60; return 28.3 - 2.15 * 1 - 0.741 * idd - 0.0357 * w + 0.0586 * idd * vift + 1.03 * vift; }
const fmtT = (k, v) => v == null ? '—' : nf(v, TESTS[k].d);
function grupoStats(k) { const vals = atletasCat().map(a => { const t = ultimoTeste(a.id, k); return t ? tval(t, k) : null; }).filter(v => v != null); const m = mean(vals); const sd = vals.length > 1 ? Math.sqrt(vals.reduce((s, v) => s + (v - m) ** 2, 0) / (vals.length - 1)) : 0; return { m, sd, n: vals.length, vals }; }
function zDe(k, v, g) { if (v == null || !g.sd) return null; const z = (v - g.m) / g.sd; return TESTS[k].up > 0 ? z : -z; }
function pctl(k, v, g) { if (v == null || !g.vals.length) return null; const better = g.vals.filter(x => TESTS[k].up > 0 ? x < v : x > v).length, eq = g.vals.filter(x => x === v).length; return Math.round((better + eq / 2) / g.vals.length * 100); }
const tierChip = z => z == null ? '<span class="muted">—</span>' : z >= 0.5 ? '<span class="st st-ok">Acima da média</span>' : z <= -0.5 ? '<span class="st st-tratamento">Abaixo da média</span>' : '<span class="st st-transicao">Na média</span>';
function varPct(k, a, b) { if (a == null || b == null || !a) return null; return (b - a) / a * 100; }
const varTag = (k, a, b) => { const v = varPct(k, a, b); if (v == null) return '<span class="muted">—</span>'; if (Math.abs(v) < 0.05) return '<span class="muted">= 0%</span>'; const bom = TESTS[k].up > 0 ? v > 0 : v < 0; return `<span class="${bom ? 'down' : 'up'}">${v > 0 ? '↑ +' : '↓ −'}${nf(Math.abs(v), 1)}%</span>`; };
function sessoes() { const m = new Map(); tsCat().forEach(t => { const s = m.get(t.data) || { data: t.data, ts: [] }; s.ts.push(t); m.set(t.data, s); }); return [...m.values()].sort((a, b) => b.data.localeCompare(a.data)); }

/* ---------- cálculos maturacionais ---------- */
const idadeDec = (nasc, data) => nasc ? dayDiff(nasc, data || todayISO()) / 365.25 : null;
function calcMat(m) {
  const a = atl(m.atletaId); if (!a) return null; const ida = idadeDec(a.nascimento, m.data); const H = +m.altura, SH = +m.alturaSentado, W = +m.peso;
  if (!ida || !H || !SH) return { ida, H, SH, W };
  const LL = H - SH;
  const mir = -9.236 + 0.0002708 * (LL * SH) - 0.001663 * (ida * LL) + 0.007216 * (ida * SH) + (W ? 0.02292 * (W / H * 100) : 0);
  const moo = -8.128741 + 0.0070346 * (ida * SH);
  const mo = mir, aphv = ida - mo;
  const alvo = +m.alturaPai && +m.alturaMae ? (+m.alturaPai + +m.alturaMae + 13) / 2 : null;
  const st = mo < -1 ? 'pre' : mo <= 1 ? 'circa' : 'pos';
  return { ida, H, SH, W, LL, mo, moo, aphv, alvo, pctAd: alvo ? H / alvo * 100 : null, st };
}
const MSTAT = { pre: ['Pré-PHV', 'var(--blue)', 'st-liberado', 'Antes do pico de crescimento'], circa: ['Circa-PHV', 'var(--yellow)', 'st-transicao', 'No pico de crescimento (±1 ano)'], pos: ['Pós-PHV', 'var(--g500)', 'st-ok', 'Depois do pico de crescimento'] };
const mstChip = s => s ? `<span class="st ${MSTAT[s][2]}">${MSTAT[s][0]}</span>` : '<span class="muted">—</span>';
const matDe = id => S.maturacao.filter(m => m.atletaId === id).sort((a, b) => a.data.localeCompare(b.data));
function velCresc(id) { const h = matDe(id).filter(m => +m.altura); if (h.length < 2) return null; const a = h[h.length - 2], b = h[h.length - 1]; const d = dayDiff(a.data, b.data); if (d < 60) return null; return (b.altura - a.altura) / (d / 365.25); }
function matUltimas() { const ids = idsCat(), m = new Map(); S.maturacao.filter(x => ids.has(x.atletaId)).sort((a, b) => a.data.localeCompare(b.data)).forEach(x => m.set(x.atletaId, x)); return m; }

/* ---------- telas: avaliações físicas ---------- */
function vAval() {
  const body = { 'av-dash': fAvDash, 'av-reg': fAvReg, 'av-rank': fAvRank, 'av-ind': fAvInd }[S.view] || fAvDash;
  const h = header({ title: AV_TITLE[S.view], sub: 'AVALIAÇÃO FÍSICA · PREPARAÇÃO FÍSICA', items: hdrItems() });
  if (PRINT) return h + '<div style="height:16px"></div>' + body();
  return h + `<nav class="rtabs">${AV_TABS.map(([k, n]) => `<button data-go="${k}" class="${S.view === k ? 'on' : ''}">${n}</button>`).join('')}</nav>` + noData() + body();
}
function fAvDash() {
  const ats = atletasCat(), ss = sessoes(), aval = new Set(tsCat().map(t => t.atletaId));
  const G = Object.fromEntries(Object.keys(TESTS).map(k => [k, grupoStats(k)]));
  const vo = mean(ats.map(a => { const t = ultimoTeste(a.id, 'ift'); return t ? vo2(a, tval(t, 'ift'), t.data) : null; }));
  const porPos = POS.map(p => { const as = ats.filter(a => a.posicao === p); if (!as.length) return ''; const c = k => mean(as.map(a => { const t = ultimoTeste(a.id, k); return t ? tval(t, k) : null; })); return `<tr><td class="l">${ptag(p)} ${POSN[p]}</td>${Object.keys(TESTS).map(k => `<td>${fmtT(k, c(k))}</td>`).join('')}</tr>`; }).join('');
  const top = k => { const l = ats.map(a => { const t = ultimoTeste(a.id, k); return t ? { a, v: tval(t, k) } : null; }).filter(Boolean).sort((x, y) => TESTS[k].up > 0 ? y.v - x.v : x.v - y.v).slice(0, 3); return `<div class="podio"><h5>${IC[TESTS[k].ic]} ${TESTS[k].n}</h5>${l.map((x, i) => `<div><span class="pp p${i + 1}">${i + 1}º</span><span class="pn">${esc(x.a.apelido || x.a.nome)}</span><b>${fmtT(k, x.v)} <small>${TESTS[k].u}</small></b></div>`).join('') || '<span class="muted">Sem dados</span>'}</div>`; };
  const sl = [...ss].reverse().slice(-6); const sm = s => Object.fromEntries(Object.keys(TESTS).map(k => [k, mean(s.ts.map(t => tval(t, k)))]));
  const sms = sl.map(sm); const evoTab = sl.length ? `<table class="t"><thead><tr><th>Sessão</th><th>Atletas</th>${Object.values(TESTS).map(t => `<th>${t.n.replace('Velocidade ', '')} (${t.u})</th>`).join('')}</tr></thead><tbody>${sl.map((s, i) => `<tr><td>${fmtD(s.data)}</td><td>${s.ts.length}</td>${Object.keys(TESTS).map(k => `<td><b>${fmtT(k, sms[i][k])}</b>${i ? '<br>' + varTag(k, sms[i - 1][k], sms[i][k]) : ''}</td>`).join('')}</tr>`).join('')}</tbody></table>` : '';
  return `<div class="kpis">
    ${kpi('users', 'Atletas avaliados', `${aval.size}<small>/ ${ats.length}</small>`, ss[0] ? 'Última sessão em ' + fmtD(ss[0].data) : 'Nenhuma sessão')}
    ${kpi('jump', 'CMJ médio', nfx(G.cmj.m, 1, '<small>cm</small>'), G.cmj.n + ' atletas')}
    ${kpi('heart', 'VIFT médio', nfx(G.ift.m, 1, '<small>km/h</small>'), 'VO₂máx estimado ' + nfx(vo, 1, ' ml/kg/min'))}
    ${kpi('bolt', 'Sprint 10 m', nfx(G.v10.m, 2, '<small>s</small>'), G.v10.n + ' atletas', 'gold')}
    ${kpi('stopw', 'Sprint 30 m', nfx(G.v30.m, 2, '<small>s</small>'), G.v30.n + ' atletas', 'gold')}
    ${kpi('turn', 'Teste 505', nfx(G.t505.m, 2, '<small>s</small>'), 'melhor lado (média de 2)', 'blue')}
  </div>
  <div class="row r21">
    ${panel('Média da equipe por sessão', evoTab || miniEmpty('Nenhuma sessão'), { np: !!evoTab })}
    ${panel('Melhores do elenco', `<div class="podios">${Object.keys(TESTS).map(top).join('')}</div>`)}
  </div>
  <div class="row" style="grid-template-columns:1fr">${panel('Médias por posição (último teste de cada atleta)', porPos ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Posição</th>${Object.values(TESTS).map(t => `<th>${t.n} (${t.u})</th>`).join('')}</tr></thead><tbody>${porPos}</tbody><tfoot><tr><td class="l">ELENCO</td>${Object.keys(TESTS).map(k => `<td>${fmtT(k, G[k].m)}</td>`).join('')}</tr></tfoot></table></div>` : miniEmpty('Sem testes'), { np: !!porPos })}</div>`;
}
function fAvReg() {
  const ss = sessoes(); if (!ss.find(s => s.data === UI.avSel)) UI.avSel = ss[0]?.data;
  const s = ss.find(x => x.data === UI.avSel);
  const rows = s ? s.ts.map(t => ({ t, a: atl(t.atletaId) })).filter(x => x.a).sort((x, y) => POS.indexOf(x.a.posicao) - POS.indexOf(y.a.posicao) || x.a.nome.localeCompare(y.a.nome)) : [];
  return `<div class="row r21" style="align-items:start">
    <div class="panel"><div class="ph">${s ? 'Sessão de ' + fmtD(s.data) : 'Sessão'}<span class="r">${s ? `<button data-act="av-edit" data-d="${s.data}">Editar</button> <button data-act="av-del" data-d="${s.data}">Excluir</button> ` : ''}<button data-act="av-nova">+ Nova sessão</button></span></div>
      ${s ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Pos.</th><th>CMJ (cm)</th><th>VIFT (km/h)</th><th>VO₂máx</th><th>10 m (s)</th><th>30 m (s)</th><th>505 D (média)</th><th>505 E (média)</th><th>Déficit COD</th></tr></thead><tbody>${rows.map(x => { const t = x.t, ift = tval(t, 'ift'), b5 = tval(t, 't505'), v10 = tval(t, 'v10'); return `<tr class="click" data-avatl="${x.a.id}"><td class="l">${athCell(x.a)}</td><td>${ptag(x.a.posicao)}</td><td><b>${fmtT('cmj', tval(t, 'cmj'))}</b></td><td><b>${fmtT('ift', ift)}</b></td><td>${ift ? nf(vo2(x.a, ift, t.data), 1) : '—'}</td><td>${fmtT('v10', v10)}</td><td>${fmtT('v30', tval(t, 'v30'))}</td><td>${lado505(t, 'd') != null ? nf(lado505(t, 'd'), 2) : '—'}</td><td>${lado505(t, 'e') != null ? nf(lado505(t, 'e'), 2) : '—'}</td><td>${b5 && v10 ? nf(b5 - v10, 2) + ' s' : '—'}</td></tr>`; }).join('')}</tbody></table></div><p class="muted pb" style="font-size:12px;margin:0">VO₂máx estimado pela equação de Buchheit (30-15 IFT). Déficit de mudança de direção = tempo do 505 − sprint de 10 m (quanto menor, melhor).</p>` : `<div class="pb">${miniEmpty('Nenhuma sessão registrada', 'Clique em “Nova sessão” para lançar os testes do grupo.')}</div>`}
    </div>
    ${panel('Sessões', ss.length ? `<table class="t"><thead><tr><th>Data</th><th>Atletas</th><th>Testes</th></tr></thead><tbody>${ss.map(x => `<tr class="click ${x.data === UI.avSel ? 'rowsel' : ''}" data-avses="${x.data}"><td>${fmtD(x.data)}</td><td>${x.ts.length}</td><td>${Object.keys(TESTS).filter(k => x.ts.some(t => tval(t, k) != null)).map(k => TESTS[k].n.replace('Velocidade ', '')).join(', ')}</td></tr>`).join('')}</tbody></table>` : miniEmpty('Sem sessões'), { np: !!ss.length })}
  </div>`;
}
function fAvRank() {
  const k = UI.avTest, T = TESTS[k], g = grupoStats(k);
  const l = atletasCat().map(a => { const t = ultimoTeste(a.id, k); if (!t) return null; const v = tval(t, k), p = ultimoTeste(a.id, k, t.data); return { a, t, v, pv: p ? tval(p, k) : null, z: zDe(k, v, g), pc: pctl(k, v, g) }; }).filter(Boolean).sort((x, y) => T.up > 0 ? y.v - x.v : x.v - y.v);
  const mx = Math.max(...l.map(x => x.v), 0.01), mn = Math.min(...l.map(x => x.v), 0);
  const cats = Object.keys(GRUPOS).filter(c => S.atletas.some(a => a.categoria === c));
  const catRow = c => { const as = S.atletas.filter(a => a.categoria === c); return `<tr><td class="l"><b>${c}</b></td>${Object.keys(TESTS).map(kk => `<td>${fmtT(kk, mean(as.map(a => { const t = ultimoTeste(a.id, kk); return t ? tval(t, kk) : null; })))}</td>`).join('')}</tr>`; };
  return `<div class="panel" style="margin-bottom:16px"><div class="pb" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><b style="font-family:var(--fc);font-size:18px;text-transform:uppercase">Teste</b><div class="seg2">${Object.entries(TESTS).map(([kk, t]) => `<label><input type="radio" name="avTest" value="${kk}" ${kk === k ? 'checked' : ''}>${t.n}</label>`).join('')}</div><span class="muted" style="font-size:12.5px">${T.l} · ${T.up > 0 ? 'quanto maior, melhor' : 'quanto menor, melhor'} · média ${nfx(g.m, T.d)} ${T.u} (±${nfx(g.sd, T.d)})</span></div></div>
  <div class="row r21">
    ${panel(`Ranking · ${T.n}`, l.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th>#</th><th class="l">Atleta</th><th>Pos.</th><th>Data</th><th>Resultado</th><th style="min-width:160px"></th><th>Variação</th><th>Percentil</th><th>Classificação</th></tr></thead><tbody>${l.map((x, i) => `<tr class="click" data-avatl="${x.a.id}"><td><b>${i + 1}</b></td><td class="l">${athCell(x.a)}</td><td>${ptag(x.a.posicao)}</td><td>${fmtDs(x.t.data)}</td><td><b>${fmtT(k, x.v)} ${T.u}</b></td><td><div class="track"><i style="width:${(T.up > 0 ? x.v / mx : mn / x.v) * 100}%"></i></div></td><td>${varTag(k, x.pv, x.v)}</td><td>${x.pc ?? '—'}</td><td>${tierChip(x.z)}</td></tr>`).join('')}</tbody></table></div>` : miniEmpty('Sem resultados para este teste'), { np: !!l.length })}
    ${panel('Comparativo entre categorias', cats.length ? `<table class="t"><thead><tr><th class="l">Categoria</th>${Object.values(TESTS).map(t => `<th>${t.n.replace('Velocidade ', '')}</th>`).join('')}</tr></thead><tbody>${cats.map(catRow).join('')}</tbody></table>` : miniEmpty('Sem dados'), { np: !!cats.length })}
  </div>`;
}
function avIndPartes(a) {
  const ts = tsDe(a.id);
  const cards = Object.entries(TESTS).map(([k, T]) => { const t = ultimoTeste(a.id, k); const v = t ? tval(t, k) : null; const p = t ? ultimoTeste(a.id, k, t.data) : null; const g = grupoStats(k); const pc = pctl(k, v, g); return `<div class="kpi ind-k"><div style="min-width:0;width:100%"><div class="k">${IC[T.ic].replace('<svg', '<svg width="16" height="16" style="vertical-align:-2px"')} ${T.n}</div><div class="v">${fmtT(k, v)}<small>${T.u}</small></div><div class="s">${t ? fmtD(t.data) + ' · ' + varTag(k, p ? tval(p, k) : null, v) : 'Sem teste'}${pc != null ? ` · percentil ${pc}` : ''}</div></div></div>`; }).join('');
  const perf = Object.entries(TESTS).map(([k, T]) => { const t = ultimoTeste(a.id, k); const pc = t ? pctl(k, tval(t, k), grupoStats(k)) : null; return { l: T.n, v: pc ?? 0, t: pc == null ? '—' : pc, c: pc == null ? '#8a948f' : pc >= 67 ? 'var(--g500)' : pc >= 34 ? 'var(--yellow)' : 'var(--red)' }; });
  const ch = k => { const l = ts.filter(t => tval(t, k) != null); return l.length > 1 ? `<div><h5>${TESTS[k].n} (${TESTS[k].u})</h5>${lineChart(l.map(t => fmtDs(t.data)), l.map(t => Math.round(tval(t, k) * 100) / 100), { w: 300, h: 160, fit: true, label: TESTS[k].n })}</div>` : ''; };
  const graf = ['cmj', 'ift', 'v10', 'v30', 't505'].map(ch).join('');
  const tab = ts.length ? `<table class="t"><thead><tr><th>Data</th>${Object.values(TESTS).map(t => `<th>${t.n.replace('Velocidade ', '')} (${t.u})</th>`).join('')}<th>VO₂máx</th></tr></thead><tbody>${[...ts].reverse().map(t => `<tr><td>${fmtD(t.data)}</td>${Object.keys(TESTS).map(k => `<td>${fmtT(k, tval(t, k))}</td>`).join('')}<td>${tval(t, 'ift') ? nf(vo2(a, tval(t, 'ift'), t.data), 1) : '—'}</td></tr>`).join('')}</tbody></table>` : miniEmpty('Sem testes registrados');
  return { cards, perf, graf, tab };
}
function fAvInd() {
  const ats = atletasCat().filter(a => tsDe(a.id).length).sort((x, y) => x.nome.localeCompare(y.nome));
  if (!UI.avAtl || !atl(UI.avAtl) || !tsDe(UI.avAtl).length) UI.avAtl = ats[0]?.id;
  const a = atl(UI.avAtl); if (!a) return `<div class="empty"><h3>Nenhum atleta testado</h3>Lance uma sessão de testes para ver a evolução individual.</div>`;
  const P = avIndPartes(a);
  return `<div class="panel" style="margin-bottom:16px"><div class="pb indbar" style="grid-template-columns:minmax(220px,1.3fr) minmax(220px,1fr) auto">
    <div class="det-head" style="margin:0">${ava(a)}<div><b>${esc(a.apelido || a.nome)}${subTag(a)}</b><span class="muted">${esc(a.categoria)} · ${idade(a.nascimento)} anos · ${tsDe(a.id).length} sessão(ões)</span></div><span style="margin-left:auto">${ptag(a.posicao)}</span></div>
    <div class="f"><label for="avAtlSel">Atleta</label><select id="avAtlSel">${ats.map(x => `<option value="${x.id}" ${x.id === a.id ? 'selected' : ''}>${esc(x.nome)} · ${esc(x.subcategoria || x.categoria)}</option>`).join('')}</select></div>
    <button class="btn" data-act="ficha-tab" data-id="${a.id}" data-t="fis">${IC.user} Abrir ficha</button></div></div>
  <div class="kpis k5">${P.cards}</div>
  <div class="row r21">${panel('Evolução por teste', P.graf ? `<div class="minich four">${P.graf}</div>` : miniEmpty('Só uma sessão', 'Com duas ou mais sessões aparecem os gráficos.'))}${panel('Perfil em relação ao elenco (percentil)', dist(P.perf) + '<p class="muted" style="font-size:12px;margin:10px 0 0">Percentil 100 = melhor resultado do grupo filtrado. Verde ≥ 67 · amarelo 34–66 · vermelho ≤ 33.</p>')}</div>
  <div class="row" style="grid-template-columns:1fr">${panel('Histórico de testes', P.tab, { np: true })}</div>`;
}

/* ---------- telas: maturação ---------- */
function vMat() {
  const body = { 'mat-dash': fMatDash, 'mat-ind': fMatInd }[S.view] || fMatDash;
  const h = header({ title: AV_TITLE[S.view], sub: 'MATURAÇÃO BIOLÓGICA · CRESCIMENTO', items: hdrItems() });
  if (PRINT) return h + '<div style="height:16px"></div>' + body();
  return h + `<nav class="rtabs">${MAT_TABS.map(([k, n]) => `<button data-go="${k}" class="${S.view === k ? 'on' : ''}">${n}</button>`).join('')}</nav>` + noData() + body();
}
function fMatDash() {
  const ats = atletasCat(), U = matUltimas();
  const l = [...U.values()].map(m => ({ m, c: calcMat(m), a: atl(m.atletaId), vc: velCresc(m.atletaId) })).filter(x => x.a && x.c);
  const cnt = countBy(l.filter(x => x.c.st), x => x.c.st);
  const segs = Object.keys(MSTAT).map(k => ({ l: MSTAT[k][0], v: cnt[k] || 0, c: MSTAT[k][1] }));
  l.sort((x, y) => (x.c.mo ?? 99) - (y.c.mo ?? 99));
  const bio = Object.keys(MSTAT).map(k => `<div class="bioband"><h5 style="color:${MSTAT[k][1]}">${MSTAT[k][0]} <small>${MSTAT[k][3]}</small></h5><div>${l.filter(x => x.c.st === k).map(x => `<span class="bchip" data-matatl="${x.a.id}">${esc(x.a.apelido || x.a.nome.split(' ')[0])} <small>${x.c.mo >= 0 ? '+' : ''}${nf(x.c.mo, 1)}</small></span>`).join('') || '<span class="muted">—</span>'}</div></div>`).join('');
  return `<div class="kpis k5">
    ${kpi('users', 'Atletas medidos', `${l.length}<small>/ ${ats.length}</small>`, 'última medição de cada um')}
    ${kpi('grow', 'Pré-PHV', cnt.pre || 0, 'antes do pico', 'blue')}
    ${kpi('trend', 'Circa-PHV', cnt.circa || 0, 'no pico de crescimento', 'gold')}
    ${kpi('check', 'Pós-PHV', cnt.pos || 0, 'depois do pico')}
    ${kpi('ruler', 'Idade do pico (média)', nfx(mean(l.map(x => x.c.aphv)), 1, '<small>anos</small>'), 'velocidade média ' + nfx(mean(l.map(x => x.vc)), 1, ' cm/ano'))}
  </div>
  <div class="row r21">
    ${panel('Bio-banding · grupos por maturação', bio + '<p class="muted" style="font-size:12px;margin:10px 0 0">Número ao lado do nome = anos em relação ao pico de crescimento (maturity offset). Atletas no pico (circa-PHV) pedem atenção a cargas de impacto e saltos: maior risco de dores no joelho e calcanhar (Osgood-Schlatter, Sever).</p>')}
    ${panel('Distribuição maturacional', l.length ? `<div class="donut-wrap">${donut(segs, l.length, 'ATLETAS', 150)}${legend(segs)}</div>` : miniEmpty('Sem medições'))}
  </div>
  <div class="row" style="grid-template-columns:1fr">${panel('Situação maturacional de cada atleta', l.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Pos.</th><th>Medição</th><th>Idade</th><th>Estatura</th><th>Alt. sentado</th><th>Peso</th><th>Offset (anos)</th><th>Idade do pico</th><th>Estatura-alvo</th><th>% estatura adulta</th><th>Crescimento</th><th>Situação</th></tr></thead><tbody>${l.map(x => `<tr class="click" data-matatl="${x.a.id}"><td class="l">${athCell(x.a)}</td><td>${ptag(x.a.posicao)}</td><td>${fmtDs(x.m.data)}</td><td>${nf(x.c.ida, 1)}</td><td>${nfx(x.c.H, 1)} cm</td><td>${nfx(x.c.SH, 1)} cm</td><td>${nfx(x.c.W, 1)} kg</td><td><b>${x.c.mo >= 0 ? '+' : ''}${nfx(x.c.mo, 2)}</b></td><td>${nfx(x.c.aphv, 1)}</td><td>${x.c.alvo ? nf(x.c.alvo, 1) + ' cm' : '—'}</td><td>${x.c.pctAd ? nf(x.c.pctAd, 1) + '%' : '—'}</td><td>${x.vc != null ? nf(x.vc, 1) + ' cm/ano' : '—'}</td><td>${mstChip(x.c.st)}</td></tr>`).join('')}</tbody></table></div><p class="muted pb" style="font-size:12px;margin:0">Offset maturacional pela equação de Mirwald (2002). Estatura-alvo = (altura do pai + altura da mãe + 13) ÷ 2.</p>` : miniEmpty('Nenhuma medição registrada', 'Clique em “Nova medição” para lançar estatura, altura sentado e peso do grupo.'), { np: !!l.length, r: `<button data-act="mat-nova">+ Nova medição</button>` })}</div>`;
}
function matIndPartes(a) {
  const h = matDe(a.id), cs = h.map(m => ({ m, c: calcMat(m) })).filter(x => x.c), last = cs[cs.length - 1], vc = velCresc(a.id);
  if (!last) return null;
  const c = last.c;
  const txt = c.mo == null ? 'Informe a altura sentado para calcular a maturação.' : `${esc((a.apelido || a.nome).split(' ')[0])} está ${c.st === 'pre' ? `a cerca de ${nf(Math.abs(c.mo), 1)} ano(s) antes do pico de crescimento` : c.st === 'circa' ? `no período do pico de crescimento (${c.mo >= 0 ? '+' : ''}${nf(c.mo, 1)} ano)` : `cerca de ${nf(c.mo, 1)} ano(s) depois do pico de crescimento`}. A idade estimada do pico (PHV) é ${nf(c.aphv, 1)} anos${c.aphv < 13.3 ? ', mais cedo que a média dos meninos (≈ 13,8 anos): maturação precoce' : c.aphv > 14.3 ? ', mais tarde que a média dos meninos (≈ 13,8 anos): maturação tardia' : ', dentro da média dos meninos (≈ 13,8 anos)'}.${c.alvo ? ` Já atingiu ${nf(c.pctAd, 1)}% da estatura-alvo (${nf(c.alvo, 1)} cm).` : ''}${vc != null ? ` Velocidade de crescimento recente: ${nf(vc, 1)} cm/ano.` : ''}${c.st === 'circa' ? ' Recomendação: controlar volume de saltos, sprints e impacto, reforçar mobilidade e acompanhar dores em joelho e calcanhar.' : ''}`;
  const graf = cs.length > 1 ? `<div class="minich four" style="grid-template-columns:repeat(3,1fr)"><div><h5>Estatura (cm)</h5>${lineChart(cs.map(x => fmtDs(x.m.data)), cs.map(x => Math.round(x.c.H * 10) / 10), { w: 300, h: 160, fit: true })}</div><div><h5>Peso (kg)</h5>${lineChart(cs.map(x => fmtDs(x.m.data)), cs.map(x => Math.round((x.c.W || 0) * 10) / 10), { w: 300, h: 160, fit: true })}</div><div><h5>Offset maturacional</h5>${lineChart(cs.map(x => fmtDs(x.m.data)), cs.map(x => Math.round((x.c.mo || 0) * 100) / 100), { w: 300, h: 160, fit: true })}</div></div>` : miniEmpty('Só uma medição', 'Com duas ou mais aparecem as curvas de crescimento.');
  const tab = `<table class="t"><thead><tr><th>Data</th><th>Idade</th><th>Estatura</th><th>Alt. sentado</th><th>Perna</th><th>Peso</th><th>Offset Mirwald</th><th>Offset Moore</th><th>Idade do pico</th><th>Situação</th><th></th></tr></thead><tbody>${[...cs].reverse().map(x => `<tr><td>${fmtD(x.m.data)}</td><td>${nf(x.c.ida, 1)}</td><td>${nfx(x.c.H, 1)}</td><td>${nfx(x.c.SH, 1)}</td><td>${nfx(x.c.LL, 1)}</td><td>${nfx(x.c.W, 1)}</td><td><b>${nfx(x.c.mo, 2)}</b></td><td>${nfx(x.c.moo, 2)}</td><td>${nfx(x.c.aphv, 1)}</td><td>${mstChip(x.c.st)}</td><td><button class="icon-btn" data-act="mat-del" data-id="${x.m.id}" aria-label="Excluir medição" style="color:var(--red)">${IC.trash}</button></td></tr>`).join('')}</tbody></table>`;
  const cards = [['Idade', nf(c.ida, 1) + ' anos'], ['Estatura', nfx(c.H, 1) + ' cm'], ['Offset', (c.mo >= 0 ? '+' : '') + nfx(c.mo, 2) + ' anos'], ['Idade do pico', nfx(c.aphv, 1) + ' anos'], ['% estatura adulta', c.pctAd ? nf(c.pctAd, 1) + '%' : '—'], ['Crescimento', vc != null ? nf(vc, 1) + ' cm/ano' : '—']];
  return { c, txt, graf, tab, cards, last };
}
function fMatInd() {
  const ats = atletasCat().filter(a => matDe(a.id).length).sort((x, y) => x.nome.localeCompare(y.nome));
  if (!UI.matAtl || !atl(UI.matAtl) || !matDe(UI.matAtl).length) UI.matAtl = ats[0]?.id;
  const a = atl(UI.matAtl); if (!a) return `<div class="empty"><h3>Nenhuma medição</h3>Lance uma medição em Painel maturacional.<div class="acts"><button class="btn pri" data-act="mat-nova">${IC.plus} Nova medição</button></div></div>`;
  const P = matIndPartes(a);
  return `<div class="panel" style="margin-bottom:16px"><div class="pb indbar" style="grid-template-columns:minmax(220px,1.3fr) minmax(220px,1fr) auto">
    <div class="det-head" style="margin:0">${ava(a)}<div><b>${esc(a.apelido || a.nome)}${subTag(a)}</b><span class="muted">${esc(a.categoria)} · nascido em ${fmtD(a.nascimento)}</span></div><span style="margin-left:auto">${mstChip(P.c.st)}</span></div>
    <div class="f"><label for="matAtlSel">Atleta</label><select id="matAtlSel">${ats.map(x => `<option value="${x.id}" ${x.id === a.id ? 'selected' : ''}>${esc(x.nome)} · ${esc(x.subcategoria || x.categoria)}</option>`).join('')}</select></div>
    <button class="btn" data-act="ficha-tab" data-id="${a.id}" data-t="mat">${IC.user} Abrir ficha</button></div></div>
  <div class="fkgrid" style="grid-template-columns:repeat(6,1fr);margin-bottom:16px">${P.cards.map(([k, v]) => `<div class="fk"><small>${k}</small><b>${v}</b></div>`).join('')}</div>
  <div class="row r21">${panel('Curvas de crescimento', P.graf)}${panel('Interpretação', `<div class="matline">${matLinha(P.c.mo)}</div><p class="parecer">${P.txt}</p>`)}</div>
  <div class="row" style="grid-template-columns:1fr">${panel('Histórico de medições', P.tab, { np: true })}</div>`;
}
function matLinha(mo) { if (mo == null) return ''; const x = Math.max(0, Math.min(100, (mo + 4) / 8 * 100)); return `<div class="mline"><span style="left:0;width:37.5%;background:color-mix(in srgb,var(--blue) 25%,transparent)">Pré-PHV</span><span style="left:37.5%;width:25%;background:color-mix(in srgb,var(--yellow) 30%,transparent)">Pico</span><span style="left:62.5%;width:37.5%;background:color-mix(in srgb,var(--g500) 25%,transparent)">Pós-PHV</span><i style="left:${x}%"></i></div><div class="mscale"><span>−4</span><span>−2</span><span>0</span><span>+2</span><span>+4 anos</span></div>`; }

/* ---------- formulários em lote ---------- */
function formTestes(data) {
  if (!S.atletas.length) { toast('Cadastre um atleta antes.', true); return; }
  const cat = F.categoria !== 'Todas' ? F.categoria : (S.atletas[0]?.categoria || 'Sub-15');
  const ex = data ? new Map(S.testes.filter(t => t.data === data).map(t => [t.atletaId, t])) : new Map();
  openModal(mh(data ? 'Editar sessão de testes' : 'Nova sessão de testes') + `<form id="fTs" novalidate><div class="mb">
    <div class="form" style="grid-template-columns:repeat(4,1fr)"><div class="f"><label for="tsData">Data *</label><input id="tsData" type="date" value="${esc(data || todayISO())}" max="${todayISO()}" ${data ? 'readonly' : ''}></div><div class="f"><label for="tsCat">Categoria</label><select id="tsCat">${opts(Object.keys(GRUPOS), cat)}</select></div><div class="f s2"><span>Testes</span><div class="tchips">${Object.entries(TESTS).map(([k, t]) => `<label><input type="checkbox" class="tsOn" value="${k}" checked>${t.n}</label>`).join('')}</div></div></div>
    <p class="muted" style="margin:0;font-size:12.5px">CMJ em centímetros (melhor de 3 saltos). 30-15 IFT: velocidade do último estágio completo, em km/h. Sprints e 505 em segundos (505 nos dois lados). Deixe em branco quem não fez.</p>
    <div class="tbl-wrap" style="max-height:440px;overflow:auto;border:1px solid var(--line);border-radius:8px"><table class="t hidin"><thead><tr><th class="l">Atleta</th><th data-k="cmj">CMJ (cm)</th><th data-k="ift">VIFT (km/h)</th><th data-k="v10">10 m (s)</th><th data-k="v30">30 m (s)</th><th data-k="t505">505 D (s)</th><th data-k="t505">505 E (s)</th></tr></thead><tbody id="tsRows"></tbody></table></div>
  </div><div class="mf"><span class="msg" id="tsErr"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar sessão</button></div></form>`, true);
  const fill = () => { const as = S.atletas.filter(a => a.categoria === $('#tsCat').value || ex.has(a.id)).sort((a, b) => POS.indexOf(a.posicao) - POS.indexOf(b.posicao) || a.nome.localeCompare(b.nome)); $('#tsRows').innerHTML = as.map(a => { const t = ex.get(a.id) || {}; const inp = (k, st) => `<td data-k="${k === 't505d' || k === 't505e' ? 't505' : k}"><input type="number" step="${st}" data-f="${k}" value="${esc(t[k] ?? '')}" aria-label="${k} de ${esc(a.nome)}"></td>`; return `<tr data-a="${a.id}"><td class="l">${athCell(a)}</td>${inp('cmj', 0.1)}${inp('ift', 0.5)}${inp('v10', 0.01)}${inp('v30', 0.01)}${inp('t505d', 0.01)}${inp('t505e', 0.01)}</tr>`; }).join(''); vis(); };
  const vis = () => { const on = new Set($$('.tsOn').filter(c => c.checked).map(c => c.value)); $$('#fTs [data-k]').forEach(el => el.style.display = on.has(el.dataset.k) ? '' : 'none'); };
  $('#tsCat').onchange = fill; $$('.tsOn').forEach(c => c.onchange = vis); fill();
  $('#fTs').onsubmit = async e => {
    e.preventDefault(); const d = $('#tsData').value; if (!d) return $('#tsErr').textContent = 'Informe a data.';
    const docs = $$('#tsRows tr').map(tr => { const o = { atletaId: tr.dataset.a, data: d }; let tem = false; tr.querySelectorAll('[data-f]').forEach(i => { if (i.closest('td').style.display !== 'none' && i.value !== '') { o[i.dataset.f] = +i.value; tem = true; } }); const old = ex.get(tr.dataset.a); return tem ? { ...(old || {}), ...o, id: old?.id || `t_${tr.dataset.a}_${d}` } : null; }).filter(Boolean);
    if (!docs.length) return $('#tsErr').textContent = 'Preencha o resultado de pelo menos um atleta.';
    await saveMany('testes', docs); UI.avSel = d; closeModal(); render(); toast(`${docs.length} resultado(s) salvo(s)`);
  };
}
function formMat() {
  if (!S.atletas.length) { toast('Cadastre um atleta antes.', true); return; }
  const cat = F.categoria !== 'Todas' ? F.categoria : (S.atletas[0]?.categoria || 'Sub-15');
  openModal(mh('Nova medição maturacional') + `<form id="fMt" novalidate><div class="mb">
    <div class="form" style="grid-template-columns:repeat(4,1fr)"><div class="f"><label for="mtData">Data *</label><input id="mtData" type="date" value="${todayISO()}" max="${todayISO()}"></div><div class="f"><label for="mtCat">Categoria</label><select id="mtCat">${opts(Object.keys(GRUPOS), cat)}</select></div><div class="f s2"><span class="hint">Estatura e altura sentado em cm, peso em kg. A altura dos pais é opcional e fica guardada para as próximas medições.</span></div></div>
    <div class="tbl-wrap" style="max-height:440px;overflow:auto;border:1px solid var(--line);border-radius:8px"><table class="t hidin"><thead><tr><th class="l">Atleta</th><th>Estatura</th><th>Alt. sentado</th><th>Peso</th><th>Altura pai</th><th>Altura mãe</th><th>Offset</th></tr></thead><tbody id="mtRows"></tbody></table></div>
  </div><div class="mf"><span class="msg" id="mtErr"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar medições</button></div></form>`, true);
  const fill = () => { const as = S.atletas.filter(a => a.categoria === $('#mtCat').value).sort((a, b) => a.nome.localeCompare(b.nome)); $('#mtRows').innerHTML = as.map(a => { const l = matDe(a.id).slice(-1)[0] || {}; const av = avsDe(a.id).slice(-1)[0]; return `<tr data-a="${a.id}"><td class="l">${athCell(a)}</td><td><input type="number" step="0.1" data-f="altura" placeholder="${l.altura || (av?.altura ? Math.round(av.altura * 1000) / 10 : '')}"></td><td><input type="number" step="0.1" data-f="alturaSentado" placeholder="${l.alturaSentado || ''}"></td><td><input type="number" step="0.1" data-f="peso" placeholder="${l.peso || av?.peso || ''}"></td><td><input type="number" step="0.5" data-f="alturaPai" value="${l.alturaPai || ''}"></td><td><input type="number" step="0.5" data-f="alturaMae" value="${l.alturaMae || ''}"></td><td class="mo">—</td></tr>`; }).join(''); calc(); };
  const calc = () => $$('#mtRows tr').forEach(tr => { const g = f => +tr.querySelector(`[data-f=${f}]`).value || 0; const c = calcMat({ atletaId: tr.dataset.a, data: $('#mtData').value, altura: g('altura'), alturaSentado: g('alturaSentado'), peso: g('peso') }); tr.querySelector('.mo').innerHTML = c && c.mo != null ? `${c.mo >= 0 ? '+' : ''}${nf(c.mo, 2)} ${mstChip(c.st)}` : '—'; });
  $('#mtCat').onchange = fill; $('#fMt').addEventListener('input', calc); fill();
  $('#fMt').onsubmit = async e => {
    e.preventDefault(); const d = $('#mtData').value;
    const docs = $$('#mtRows tr').map(tr => { const g = f => tr.querySelector(`[data-f=${f}]`).value; if (!g('altura') || !g('alturaSentado')) return null; return { id: `m_${tr.dataset.a}_${d}`, atletaId: tr.dataset.a, data: d, altura: +g('altura'), alturaSentado: +g('alturaSentado'), peso: g('peso') ? +g('peso') : null, alturaPai: g('alturaPai') ? +g('alturaPai') : null, alturaMae: g('alturaMae') ? +g('alturaMae') : null }; }).filter(Boolean);
    if (!docs.length) return $('#mtErr').textContent = 'Preencha estatura e altura sentado de pelo menos um atleta.';
    await saveMany('maturacao', docs); closeModal(); render(); toast(`${docs.length} medição(ões) salva(s)`);
  };
}

/* ---------- ficha: novas abas ---------- */
FTABS.splice(4, 0, ['fis', 'Avaliações físicas'], ['mat', 'Maturação']);
function fichaFis(a) { const P = avIndPartes(a); if (!tsDe(a.id).length) return miniEmpty('Sem testes físicos', 'Lance em Avaliações físicas → Sessões de testes.'); return `<div class="kpis k5" style="margin-bottom:14px">${P.cards}</div><div class="row r21" style="margin-bottom:14px">${panel('Evolução por teste', P.graf ? `<div class="minich four">${P.graf}</div>` : miniEmpty('Só uma sessão'))}${panel('Perfil no elenco (percentil)', dist(P.perf))}</div>${panel('Histórico de testes', P.tab, { np: true })}`; }
function fichaMat(a) { const P = matIndPartes(a); if (!P) return miniEmpty('Sem medições maturacionais', 'Lance em Maturação → Painel maturacional.'); return `<div class="fkgrid" style="grid-template-columns:repeat(6,1fr);margin-bottom:14px">${P.cards.map(([k, v]) => `<div class="fk"><small>${k}</small><b>${v}</b></div>`).join('')}</div><div class="row r21" style="margin-bottom:14px">${panel('Curvas de crescimento', P.graf)}${panel('Interpretação', `<div class="matline">${matLinha(P.c.mo)}</div><p class="parecer" style="font-size:14px">${P.txt}</p>`)}</div>${panel('Histórico de medições', P.tab, { np: true })}`; }
const _fichaHTML = fichaHTML;
fichaHTML = function (a) {
  if (UI.fichaTab === 'fis' || UI.fichaTab === 'mat') { const h = _fichaHTML.call(null, { ...a }); const tmp = document.createElement('div'); tmp.innerHTML = h; tmp.querySelector('.fbody').innerHTML = UI.fichaTab === 'fis' ? fichaFis(a) : fichaMat(a); return tmp.innerHTML; }
  return _fichaHTML(a);
};
// "Avaliações recentes" da visão geral: testes físicos (como na referência) e, sem testes, a composição corporal
const _fichaGeral = fichaGeral;
fichaGeral = function (a, D) {
  let h = _fichaGeral(a, D);
  const rows = Object.entries(TESTS).map(([k, T]) => { const t = ultimoTeste(a.id, k); if (!t) return ''; const p = ultimoTeste(a.id, k, t.data); return `<tr><td class="l"><b>${T.n.replace('Velocidade ', '')}</b></td><td>${fmtT(k, tval(t, k))} ${T.u}</td><td>(${fmtDs(t.data)})</td><td>${varTag(k, p ? tval(p, k) : null, tval(t, k))}</td></tr>`; }).join('');
  if (rows) { const mm = [...h.matchAll(/<div class="panel"\s*><div class="ph">Avaliações recentes/g)].pop(); const i = mm ? mm.index : -1; if (i >= 0) { const j = h.indexOf('</div></div>', h.indexOf('<div class="pb', i)) + 12; h = h.slice(0, i) + panel('Avaliações recentes', `<table class="t"><tbody>${rows}</tbody></table>`, { np: true, r: `<button data-act="ftab" data-t="fis">Ver todas</button>` }) + h.slice(j); } }
  return h;
};
const _renderAs = renderAs;
renderAs = function (view) { if (view.startsWith('av-') || view.startsWith('mat-')) { const v0 = S.view; S.view = view; try { return view.startsWith('av-') ? vAval() : vMat(); } finally { S.view = v0; } } return _renderAs(view); };

/* ---------- ações ---------- */
dmOn('click', e => {
  const s = e.target.closest('[data-avses]'); if (s) { UI.avSel = s.dataset.avses; render(); return; }
  const at = e.target.closest('[data-avatl]'); if (at) { UI.avAtl = at.dataset.avatl; go('av-ind'); return; }
  const mt = e.target.closest('[data-matatl]'); if (mt) { UI.matAtl = mt.dataset.matatl; go('mat-ind'); return; }
  const t = e.target.closest('[data-act]'); if (!t) return;
  switch (t.dataset.act) {
    case 'av-nova': formTestes(); break;
    case 'av-edit': formTestes(t.dataset.d); break;
    case 'av-del': { const d = t.dataset.d; confirmar(`Excluir a sessão de testes de ${fmtD(d)} e todos os resultados dela?`, async () => { for (const x of S.testes.filter(x => x.data === d)) await remove('testes', x.id); toast('Sessão excluída'); }); break; }
    case 'mat-nova': formMat(); break;
    case 'mat-del': confirmar('Excluir esta medição maturacional?', () => { remove('maturacao', t.dataset.id); toast('Medição excluída'); }); break;
    case 'ficha-tab': abrirFicha(t.dataset.id, t.dataset.t); break;
  }
});
dmOn('change', e => {
  const t = e.target;
  if (t.name === 'avTest') { UI.avTest = t.value; render(); }
  if (t.id === 'avAtlSel') { UI.avAtl = t.value; render(); }
  if (t.id === 'matAtlSel') { UI.matAtl = t.value; render(); }
});

/* ================= AVALIAÇÃO FÍSICA · PÁGINAS POR TESTE, PAINEL GERAL, PENDÊNCIAS ================= */
const BANDS = ['Excelente', 'Muito Bom', 'Bom', 'Regular', 'Atenção'];
const BCOL = ['#1b8a4a', '#2f6fd6', '#159aa8', '#f39324', '#e0342b'];
const BCLS = ['b-exc', 'b-mb', 'b-bom', 'b-reg', 'b-at'];
const DEF_BANDAS = { cmj: [40, 35, 30, 25], ift: [20, 19, 18, 17], v10: [1.79, 1.89, 1.99, 2.19], v30: [4.00, 4.20, 4.40, 4.60], t505: [2.20, 2.35, 2.50, 2.70] };
const TINFO = {
  cmj: { p: 'CMJ – salto com contramovimento, mãos na cintura', e: 'Plataforma de salto / app My Jump 2', o: 'Média de 3 saltos' },
  ift: { p: '30-15 Intermittent Fitness Test (Buchheit, 2008)', e: 'Cones a 40 m, áudio do teste', o: 'VIFT = velocidade do último estágio completo' },
  v10: { p: 'Sprint 10 metros, partida em pé', e: 'Fotocélulas / cronômetro', o: 'Média de 3 sprints' },
  v30: { p: 'Sprint 30 metros, partida em pé', e: 'Fotocélulas / cronômetro', o: 'Média de 3 sprints' },
  t505: { p: 'Teste de agilidade 505 (mudança de direção a 180°)', e: 'Cones e fotocélulas', o: '2 tentativas com o pé direito e 2 com o esquerdo; média de cada lado e vale o melhor lado' }
};
const bandas = k => (S.config.bandas && S.config.bandas[k] && S.config.bandas[k].length === 4) ? S.config.bandas[k].map(Number) : DEF_BANDAS[k];
function bandIdx(k, v) { if (v == null) return null; const b = bandas(k); if (TESTS[k].up > 0) { for (let i = 0; i < 4; i++) if (v >= b[i]) return i; return 4; } for (let i = 0; i < 4; i++) if (v <= b[i]) return i; return 4; }
const bandTxt = (k, v) => { const i = bandIdx(k, v); return i == null ? '' : `<small class="btx" style="color:${BCOL[i]}">${BANDS[i]}</small>`; };
const bandChip = i => i == null ? '<span class="muted">—</span>' : `<span class="bchip2 ${BCLS[i]}">${BANDS[i]}</span>`;
function bandRange(k, i) { const b = bandas(k), d = TESTS[k].d, u = TESTS[k].u, f = v => nf(v, d); if (TESTS[k].up > 0) return i === 0 ? `≥ ${f(b[0])} ${u}` : i === 4 ? `< ${f(b[3])} ${u}` : `${f(b[i])} – ${f(b[i - 1] - (d ? 1 / 10 ** d : 1))} ${u}`; return i === 0 ? `≤ ${f(b[0])} ${u}` : i === 4 ? `> ${f(b[3])} ${u}` : `${f(b[i - 1] + 1 / 10 ** d)} – ${f(b[i])} ${u}`; }
function relIdx(k, v, vals) { if (v == null || !vals.length) return null; const p = pctl(k, v, { vals }); return p >= 80 ? 0 : p >= 60 ? 1 : p >= 40 ? 2 : p >= 20 ? 3 : 4; }
const diasDesde = d => { const n = dayDiff(d, todayISO()); return n === 0 ? 'Hoje' : n === 1 ? 'Há 1 dia' : `Há ${n} dias`; };
const evoTxt = (k, a, b) => { if (a == null || b == null) return '<span class="muted">—</span>'; const dlt = b - a, bom = TESTS[k].up > 0 ? dlt > 0 : dlt < 0; if (Math.abs(dlt) < 1e-9) return '<span class="muted">=</span>'; const s = k === 'cmj' || k === 'ift' ? `${dlt > 0 ? '+' : '−'}${nf(Math.abs(dlt / a * 100), 1)}%` : `${dlt > 0 ? '+' : '−'}${nf(Math.abs(dlt), 2)} s`; return `<span class="${bom ? 'down' : 'up'}">${s} ${dlt > 0 ? '↗' : '↘'}</span>`; };

/* ---------- abas do módulo ---------- */
const TEST_ROUTES = { 'av-t-cmj': 'cmj', 'av-t-ift': 'ift', 'av-t-v10': 'v10', 'av-t-v30': 'v30', 'av-t-t505': 't505' };
AV_TABS.length = 0;
AV_TABS.push(['av-dash', 'Painel geral'], ['av-reg', 'Sessões de testes'], ['av-rank', 'Ranking e comparativo'], ['av-ind', 'Evolução individual'], ['av-t-cmj', 'CMJ (salto)'], ['av-t-ift', '30-15 IFT'], ['av-t-v10', 'Velocidade 10 m'], ['av-t-v30', 'Velocidade 30 m'], ['av-t-t505', 'Agilidade 505'], ['mat-dash', 'Maturação']);
AV_TABS.forEach(([k, n]) => TITLES[k] = ['Avaliação física', n]); TITLES['mat-ind'] = ['Avaliação física', 'Maturação individual'];
for (let i = NAV.length - 1; i >= 0; i--) if (NAV[i].k === 'mat') NAV.splice(i, 1);
const avNav = NAV.find(n => n.k === 'aval'); if (avNav) { avNav.n = 'Avaliação física'; avNav.sub = AV_TABS; }
Object.assign(AV_TITLE, { 'av-dash': 'PAINEL DE AVALIAÇÃO FÍSICA', 'av-t-cmj': 'CMJ · SALTO COM CONTRAMOVIMENTO', 'av-t-ift': '30-15 IFT · INTERMITTENT FITNESS TEST', 'av-t-v10': 'VELOCIDADE 10 METROS', 'av-t-v30': 'VELOCIDADE 30 METROS', 'av-t-t505': 'TESTE DE AGILIDADE 505', 'mat-dash': 'MATURAÇÃO BIOLÓGICA', 'mat-ind': 'MATURAÇÃO INDIVIDUAL' });
const avTabsHTML = cur => `<nav class="rtabs">${AV_TABS.map(([k, n]) => `<button data-go="${k}" class="${cur === k || (k === 'mat-dash' && cur.startsWith('mat-')) ? 'on' : ''}">${n}</button>`).join('')}</nav>`;
vAval = function () {
  const k = TEST_ROUTES[S.view];
  const body = k ? () => fTeste(k) : ({ 'av-dash': fAvDash, 'av-reg': fAvReg, 'av-rank': fAvRank, 'av-ind': fAvInd }[S.view] || fAvDash);
  const h = header({ title: AV_TITLE[S.view] || 'AVALIAÇÃO FÍSICA', sub: 'AVALIAÇÃO FÍSICA · PREPARAÇÃO FÍSICA', items: hdrItems() });
  if (PRINT) return h + '<div style="height:16px"></div>' + body();
  return h + avTabsHTML(S.view) + noData() + body();
};
vMat = function () {
  const body = { 'mat-dash': fMatDash, 'mat-ind': fMatInd }[S.view] || fMatDash;
  const h = header({ title: AV_TITLE[S.view], sub: 'AVALIAÇÃO FÍSICA · MATURAÇÃO BIOLÓGICA', items: hdrItems() });
  if (PRINT) return h + '<div style="height:16px"></div>' + body();
  return h + avTabsHTML(S.view) + `<nav class="subtabs" style="margin-top:-6px"><button data-go="mat-dash" class="${S.view === 'mat-dash' ? 'on' : ''}">Painel maturacional</button><button data-go="mat-ind" class="${S.view === 'mat-ind' ? 'on' : ''}">Individual</button></nav>` + noData() + body();
};

/* ---------- página de cada teste (padrão das imagens) ---------- */
UI.tsDate = {}; UI.tsCmp = 'anterior'; UI.tsPos = 'Todas'; UI.tsSt = 'Todos'; UI.tsBusca = '';
function fTeste(k) {
  const T = TESTS[k], ats = atletasCat(), ids = new Set(ats.map(a => a.id));
  const datas = [...new Set(tsCat().filter(t => tval(t, k) != null).map(t => t.data))].sort().reverse();
  if (!datas.includes(UI.tsDate[k])) UI.tsDate[k] = datas[0];
  const D = UI.tsDate[k];
  if (!D) return `<div class="empty"><h3>Nenhum resultado de ${T.n}</h3>Lance os resultados em “Sessões de testes”.<div class="acts"><button class="btn pri" data-act="av-nova">${IC.plus} Nova sessão de testes</button></div></div>`;
  const cur = S.testes.filter(t => t.data === D && ids.has(t.atletaId) && tval(t, k) != null);
  const vals = cur.map(t => tval(t, k));
  const ref = t => { const h = tsDe(t.atletaId).filter(x => tval(x, k) != null && x.data < D); return UI.tsCmp === 'primeira' ? h[0] : h[h.length - 1]; };
  let rows = cur.map(t => { const a = atl(t.atletaId), v = tval(t, k), r = ref(t); return { a, t, v, pv: r ? tval(r, k) : null, pd: r?.data, bi: bandIdx(k, v), ri: relIdx(k, v, vals) }; }).filter(x => x.a);
  rows.sort((x, y) => T.up > 0 ? y.v - x.v : x.v - y.v);
  rows.forEach((x, i) => x.pos = i + 1);
  const filt = rows.filter(x => (UI.tsPos === 'Todas' || x.a.posicao === UI.tsPos) && (UI.tsSt === 'Todos' || BANDS[x.bi] === UI.tsSt) && (!UI.tsBusca || x.a.nome.toLowerCase().includes(UI.tsBusca.toLowerCase())));
  const m = mean(vals), best = rows[0];
  const prevD = datas[datas.indexOf(D) + 1]; const mPrev = prevD ? mean(S.testes.filter(t => t.data === prevD && ids.has(t.atletaId)).map(t => tval(t, k))) : null;
  const evoM = mPrev != null ? (k === 'cmj' || k === 'ift' ? `${m - mPrev >= 0 ? '+' : '−'}${nf(Math.abs((m - mPrev) / mPrev * 100), 1)}%` : `${m - mPrev >= 0 ? '+' : '−'}${nf(Math.abs(m - mPrev), 2)} s`) : '—';
  const nao = ats.filter(a => !cur.some(t => t.atletaId === a.id));
  const serie = [...datas].reverse().slice(-6).map(d => ({ d, v: mean(S.testes.filter(t => t.data === d && ids.has(t.atletaId)).map(t => tval(t, k))) })).filter(x => x.v != null);
  const dist = BANDS.map((n, i) => ({ l: `${n} (${bandRange(k, i)})`, v: rows.filter(x => x.bi === i).length, c: BCOL[i] }));
  const sel = (id, list, v) => `<select id="${id}" class="search" style="min-width:0">${list.map(([val, txt]) => `<option value="${val}" ${val === v ? 'selected' : ''}>${txt}</option>`).join('')}</select>`;
  return `<div class="kpis k5">
    ${kpi('users', 'Atletas testados', rows.length, pct(rows.length, ats.length) + ' do elenco')}
    ${kpi('stopw', 'Média geral', fmtT(k, m) + `<small>${T.u}</small>`, BANDS[bandIdx(k, m)] || '—')}
    ${kpi('check', 'Melhor resultado', best ? fmtT(k, best.v) + `<small>${T.u}</small>` : '—', best ? esc(best.a.apelido || best.a.nome) + (best.a.numero ? ' (#' + esc(best.a.numero) + ')' : '') : '')}
    ${kpi('trend', 'Evolução média geral', evoM, prevD ? 'comparado a ' + fmtD(prevD) : 'primeira avaliação')}
    ${kpi('cal', 'Última avaliação', fmtD(datas[0]), diasDesde(datas[0]))}
  </div>
  <div class="row r21" style="align-items:start">
    <div class="panel"><div class="ph">Resultados · ${T.n}<span class="r"><button data-act="ts-xls" data-k="${k}">Exportar Excel</button></span></div>
      <div class="fbar">
        <div class="f"><label for="tsD">Data da avaliação</label>${sel('tsD', datas.map(d => [d, fmtD(d)]), D)}</div>
        <div class="f"><label for="tsC">Comparar com</label>${sel('tsC', [['anterior', 'Avaliação anterior'], ['primeira', 'Primeira avaliação']], UI.tsCmp)}</div>
        <div class="f"><label for="tsP">Posição</label>${sel('tsP', [['Todas', 'Todas'], ...POS.map(p => [p, POSN[p]])], UI.tsPos)}</div>
        <div class="f"><label for="tsS">Status</label>${sel('tsS', [['Todos', 'Todos'], ...BANDS.map(b => [b, b])], UI.tsSt)}</div>
        <div class="f"><label for="tsB">Buscar</label><input id="tsB" class="search" style="min-width:0" placeholder="Atleta" value="${esc(UI.tsBusca)}"></div>
      </div>
      <div class="tbl-wrap"><table class="t"><thead><tr><th>#</th><th class="l">Atleta</th><th>Idade</th><th>${T.n.replace('Velocidade ', '')} (${T.u})<br><small>${fmtD(D)}</small></th><th>${UI.tsCmp === 'primeira' ? 'Primeira' : 'Av. anterior'}</th><th>Evolução</th><th>Status</th><th>Classificação no grupo</th></tr></thead><tbody>
      ${filt.map(x => `<tr class="click" data-avatl="${x.a.id}"><td><b>${x.pos}</b></td><td class="l"><div class="athcell">${fotoBox(x.a, 'mini')}<div><b>${esc(x.a.apelido || x.a.nome)}${subTag(x.a)}</b><small>${x.a.numero ? '#' + esc(x.a.numero) + ' · ' : ''}${esc(POSN[x.a.posicao] || '')}</small></div></div></td><td>${nf(idadeDec(x.a.nascimento, D) || 0, 1)}</td><td><b style="font-size:15px;color:${BCOL[x.bi]}">${fmtT(k, x.v)}</b>${bandTxt(k, x.v)}</td><td>${fmtT(k, x.pv)}${x.pd ? `<br><small class="muted">${fmtDs(x.pd)}</small>` : ''}</td><td>${evoTxt(k, x.pv, x.v)}</td><td>${bandChip(x.bi)}</td><td>${bandChip(x.ri)}</td></tr>`).join('') || `<tr><td colspan="8" class="muted">Nenhum atleta com esses filtros.</td></tr>`}
      </tbody></table></div>
      ${nao.length ? `<div class="pb pend"><b>${IC.cross} Não avaliados em ${fmtD(D)} (${nao.length}):</b> ${nao.map(a => `<span class="bchip" data-ficha-open="${a.id}">${esc(a.apelido || a.nome)}</span>`).join('')}</div>` : `<div class="pb pend ok"><b>${IC.check} Todo o elenco filtrado fez o teste nesta data.</b></div>`}
      <p class="muted pb" style="font-size:12px;margin:0">* ${T.l}: ${T.up > 0 ? 'maior valor = melhor resultado' : 'menor tempo = melhor resultado'}. Status = faixa de referência (ajustável em Configurações → Avaliação física). Classificação no grupo = posição em relação aos colegas avaliados (quintis).</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
      ${panel(`Evolução média geral · ${T.n.replace('Velocidade ', '')}`, serie.length > 1 ? lineChart(serie.map(x => fmtDs(x.d)), serie.map(x => Math.round(x.v * 100) / 100), { w: 420, h: 220, fit: true, label: 'média' }) : miniEmpty('Uma avaliação só', 'A curva aparece a partir da segunda sessão.'))}
      ${panel('Distribuição dos atletas', `<div class="donut-wrap">${donut(dist, rows.length, 'ATLETAS', 150)}${legend(dist)}</div>`)}
      ${panel('Informações do teste', `<div class="det-row"><span>Protocolo</span><div>${esc(TINFO[k].p)}</div></div><div class="det-row"><span>Equipamento</span><div>${esc(TINFO[k].e)}</div></div><div class="det-row"><span>Unidade</span><div>${T.u === 's' ? 'Segundos (s)' : T.u === 'cm' ? 'Centímetros (cm)' : 'km/h'}</div></div><div class="det-row"><span>Observações</span><div>${esc(TINFO[k].o)}</div></div>`)}
    </div>
  </div>`;
}

/* ---------- painel geral ---------- */
function evoGeral(a) { const p = []; Object.keys(TESTS).forEach(k => { const t = ultimoTeste(a.id, k); if (!t) return; const q = ultimoTeste(a.id, k, t.data); if (!q) return; const v = varPct(k, tval(q, k), tval(t, k)); p.push(TESTS[k].up > 0 ? v : -v); }); return p.length ? mean(p) : null; }
fAvDash = function () {
  const ats = atletasCat(), testados = ats.filter(a => tsDe(a.id).some(t => noPeriodo(t.data)));
  const nRes = tsCat().reduce((s, t) => s + Object.keys(TESTS).filter(k => tval(t, k) != null).length, 0);
  const evs = ats.map(evoGeral).filter(v => v != null);
  const ag = (S.config.agenda || []).filter(x => x.data >= todayISO()).sort((a, b) => a.data.localeCompare(b.data));
  const prox7 = ag.filter(x => dayDiff(todayISO(), x.data) <= 7);
  const resumo = Object.entries(TESTS).map(([k, T]) => { const l = ats.map(a => { const t = ultimoTeste(a.id, k); if (!t) return null; const q = ultimoTeste(a.id, k, t.data); return q ? (T.up > 0 ? 1 : -1) * varPct(k, tval(q, k), tval(t, k)) : null; }).filter(v => v != null); const mm = mean(ats.map(a => { const t = ultimoTeste(a.id, k); return t ? tval(t, k) : null; })); return { k, T, ev: mean(l), m: mm, bi: bandIdx(k, mm) }; });
  const top = k => ats.map(a => { const t = ultimoTeste(a.id, k); return t ? { a, v: tval(t, k) } : null; }).filter(Boolean).sort((x, y) => TESTS[k].up > 0 ? y.v - x.v : x.v - y.v).slice(0, 3);
  const podio = k => { const l = top(k); return `<div class="podx"><h5>${IC[TESTS[k].ic]} ${TESTS[k].n}</h5><div class="podrow">${[1, 0, 2].map(i => l[i] ? `<div class="pod p${i + 1}" data-avatl="${l[i].a.id}">${fotoBox(l[i].a, 'pod')}<span class="pm">${i + 1}º</span><b>${esc((l[i].a.apelido || l[i].a.nome).split(' ')[0])}</b><em>${fmtT(k, l[i].v)} ${TESTS[k].u}</em></div>` : '<div class="pod empty"></div>').join('')}</div></div>`; };
  const tabRows = ats.filter(a => tsDe(a.id).length).map(a => ({ a, ev: evoGeral(a), last: tsDe(a.id).slice(-1)[0], mc: (() => { const m = matDe(a.id).slice(-1)[0]; return m ? calcMat(m) : null; })() })).sort((x, y) => (y.ev ?? -99) - (x.ev ?? -99));
  const mainTab = tabRows.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Idade</th>${Object.values(TESTS).map(t => `<th>${t.n.replace('Velocidade ', '').replace('Teste ', '')}<br><small>(${t.u})</small></th>`).join('')}<th>Maturação</th><th>Última avaliação</th><th>Evolução</th></tr></thead><tbody>${tabRows.map(x => `<tr class="click" data-avatl="${x.a.id}"><td class="l"><div class="athcell">${fotoBox(x.a, 'mini')}<div><b>${esc(x.a.apelido || x.a.nome)}${subTag(x.a)}</b><small>${x.a.numero ? '#' + esc(x.a.numero) + ' · ' : ''}${esc(POSN[x.a.posicao] || '')}</small></div></div></td><td>${nf(idadeDec(x.a.nascimento) || 0, 1)}</td>${Object.keys(TESTS).map(k => { const t = ultimoTeste(x.a.id, k); const v = t ? tval(t, k) : null; return `<td><b>${fmtT(k, v)}</b>${bandTxt(k, v)}</td>`; }).join('')}<td>${x.mc && x.mc.mo != null ? `<b>${x.mc.mo >= 0 ? '+' : ''}${nf(x.mc.mo, 1)} anos</b><small class="btx" style="color:${MSTAT[x.mc.st][1]}">${MSTAT[x.mc.st][0]}</small>` : '—'}</td><td>${fmtD(x.last.data)}</td><td>${x.ev != null ? `<b class="${x.ev >= 0 ? 'down' : 'up'}">${x.ev >= 0 ? '+' : '−'}${nf(Math.abs(x.ev), 1)}% ${x.ev >= 0 ? '↗' : '↘'}</b>` : '—'}</td></tr>`).join('')}</tbody></table></div>` : miniEmpty('Sem testes', 'Lance a primeira sessão de testes.');
  const evChart = resumo.filter(r => r.ev != null);
  return `<div class="kpis k5">
    ${kpi('users', 'Atletas testados', testados.length, pct(testados.length, ats.length) + ' do elenco')}
    ${kpi('med', 'Testes realizados', nRes, 'resultados na temporada')}
    ${kpi('trend', 'Evolução média', evs.length ? `${mean(evs) >= 0 ? '+' : '−'}${nf(Math.abs(mean(evs)), 1)}%` : '—', 'em relação à avaliação anterior')}
    ${kpi('cal', 'Próximos testes', prox7.length, 'nos próximos 7 dias', 'gold')}
    ${kpi('cross', 'Pendentes', ats.length - testados.length, 'atletas sem teste na temporada', 'red')}
  </div>
  <div class="row r21" style="align-items:start">
    ${panel('Ranking dos melhores · último teste de cada atleta', `<div class="podgrid">${Object.keys(TESTS).map(podio).join('')}</div>`)}
    <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
      ${panel('Evolução média por teste (%)', evChart.length ? lineChart(evChart.map(r => r.T.n.replace('Velocidade ', '').replace('Teste ', '')), evChart.map(r => Math.round(r.ev * 10) / 10), { w: 420, h: 200, fit: true, label: 'evolução %' }) : miniEmpty('Sem comparação', 'Precisa de duas sessões.'))}
      ${panel('Resumo dos testes', `<div class="dist">${resumo.map(r => `<div class="nm">${r.T.n.replace('Velocidade ', 'Vel. ')}</div><div class="track"><i style="width:${Math.min(100, Math.max(4, ((r.ev ?? 0) + 2) * 8))}%;background:${r.bi != null ? BCOL[r.bi] : '#8a948f'}"></i></div><div class="vv" style="font-size:14px">${r.ev != null ? (r.ev >= 0 ? '+' : '−') + nf(Math.abs(r.ev), 1) + '%' : '—'}</div><div class="pp" style="color:${r.bi != null ? BCOL[r.bi] : 'inherit'};font-weight:700">${r.bi != null ? BANDS[r.bi] : '—'}</div>`).join('')}</div>`)}
      ${panel('Próximos testes agendados', (ag.length ? ag.slice(0, 6).map(x => `<div class="sfrow"><span>${IC.cal} ${fmtD(x.data)}</span><span>${esc(x.teste)}</span><span class="muted">${esc(x.categoria)}</span><button class="icon-btn" data-act="ag-del" data-id="${x.id}" aria-label="Remover agendamento">${IC.x}</button></div>`).join('') : miniEmpty('Nada agendado')) + `<button class="btn pri" data-act="ag-novo" style="width:100%;justify-content:center;margin-top:10px">${IC.cal} Agendar novo teste</button>`)}
    </div>
  </div>
  <div class="row" style="grid-template-columns:1fr">${panel('Todos os atletas · últimos resultados', mainTab, { np: tabRows.length > 0, r: `<button data-act="ts-xls" data-k="all">Exportar Excel</button>` })}</div>
  <p class="muted" style="font-size:12px">CMJ = salto com contramovimento · 30-15 IFT = Intermittent Fitness Test (VIFT) · PHV = pico de velocidade de crescimento.</p>`;
};

/* ---------- maturação no padrão da referência ---------- */
// status maturacional (mesmo critério do relatório do clube): idade biológica = idade cronológica + offset; desvio = offset (Mirwald)
function matStatus(mo) { if (mo == null || isNaN(mo)) return ['Sem classificação', '#2f7fd8', 0, 'Sem classificação']; return mo > 1 ? ['Adiantado', '#7a3fd1', 5, 'Adiantado (Pós-PHV)'] : mo > 0 ? ['Normal', '#2f6fd6', 4, 'Normal (Pós-PHV)'] : mo > -1 ? ['Normal', '#159aa8', 3, 'Normal (PHV / Pré-PHV)'] : mo > -1.5 ? ['Atrasado', '#f39324', 2, 'Atrasado (Pré-PHV)'] : ['Muito atrasado', '#e0342b', 1, 'Muito Atrasado (Pré-PHV)']; }
function timing(c) { if (!c || c.mo == null) return null; const bio = c.ida + c.mo, d = c.mo; return { bio, d, t: matStatus(c.mo) }; }
const fase = st => st === 'pre' ? 'Pré-PHV' : st === 'circa' ? 'PHV' : 'Pós-PHV';
const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
fMatDash = function () {
  const ats = atletasCat(), U = matUltimas();
  const l = [...U.values()].map(m => ({ m, c: calcMat(m), a: atl(m.atletaId), vc: velCresc(m.atletaId) })).filter(x => x.a && x.c && x.c.mo != null).map(x => ({ ...x, tm: timing(x.c) }));
  l.sort((x, y) => y.tm.d - x.tm.d);
  const grp = {}; l.forEach(x => { const key = x.tm.t[3]; grp[key] = grp[key] || { v: 0, c: x.tm.t[1] }; grp[key].v++; });
  const segs = Object.entries(grp).map(([k, o]) => ({ l: k, v: o.v, c: o.c }));
  const bins = [['≤ −1,5', -99, -1.5, '#e0342b'], ['−1,5 a −1,0', -1.5, -1, '#f39324'], ['−1,0 a −0,5', -1, -0.5, '#f6c21c'], ['−0,5 a 0', -0.5, 0, '#2f6fd6'], ['0 a +0,5', 0, 0.5, '#1b8a4a'], ['> +0,5', 0.5, 99, '#7a3fd1']];
  const binv = bins.map(b => l.filter(x => x.tm.d > b[1] && x.tm.d <= b[2]).length);
  const last = [...U.values()].map(m => m.data).sort().pop();
  const nao = ats.filter(a => !U.has(a.id));
  return `<div class="kpis k5">
    ${kpi('users', 'Atletas avaliados', l.length, pct(l.length, ats.length) + ' do elenco')}
    ${kpi('cal', 'Idade cronológica média', nfx(mean(l.map(x => x.c.ida)), 1, '<small>anos</small>'), '')}
    ${kpi('grow', 'Idade biológica média', nfx(mean(l.map(x => x.tm.bio)), 1, '<small>anos</small>'), 'estimada pelo offset')}
    ${kpi('bars', 'Desvio médio', (() => { const v = mean(l.map(x => x.tm.d)); return v == null ? '—' : (v >= 0 ? '+' : '−') + nf(Math.abs(v), 1) + '<small>anos</small>'; })(), (() => { const v = mean(l.map(x => x.tm.d)); return v == null ? '' : v > 0.5 ? 'adiantado' : v < -0.5 ? 'atrasado' : 'dentro do esperado'; })())}
    ${kpi('clock', 'Última avaliação', last ? fmtD(last) : '—', last ? diasDesde(last) : '')}
  </div>
  <div class="row r21" style="align-items:start">
    ${panel('Status maturacional de cada atleta', l.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th>#</th><th class="l">Atleta</th><th>Idade cronológica</th><th>Idade biológica</th><th>Estatura</th><th>Tronco<br><small>(alt. sentado)</small></th><th>Perna</th><th>Desvio</th><th>Offset (PHV)</th><th>Status de maturação</th><th>Classificação</th></tr></thead><tbody>${l.map((x, i) => `<tr class="click" data-matatl="${x.a.id}"><td>${i + 1}</td><td class="l"><div class="athcell">${fotoBox(x.a, 'mini')}<div><b>${esc(x.a.apelido || x.a.nome)}${subTag(x.a)}</b><small>${x.a.numero ? '#' + esc(x.a.numero) : ''}</small></div></div></td><td>${nf(x.c.ida, 1)}</td><td><b style="color:${x.tm.t[1]}">${nf(x.tm.bio, 1)}</b></td><td>${nfx(x.c.H, 1)}</td><td>${nfx(x.c.SH, 1)}</td><td>${nfx(x.c.LL, 1)}</td><td><b class="${x.tm.d >= 0 ? 'down' : 'up'}">${x.tm.d >= 0 ? '+' : '−'}${nf(Math.abs(x.tm.d), 1)}</b></td><td>${x.c.mo >= 0 ? '+' : ''}${nf(x.c.mo, 2)}</td><td><span class="mst" style="background:${x.tm.t[1]}22;color:${x.tm.t[1]};border-color:${x.tm.t[1]}66">${x.tm.t[3]}</span></td><td class="stars" style="color:${x.tm.t[1]}">${stars(x.tm.t[2])}</td></tr>`).join('')}</tbody></table></div>${nao.length ? `<div class="pb pend"><b>${IC.cross} Sem medição (${nao.length}):</b> ${nao.map(a => `<span class="bchip" data-ficha-open="${a.id}">${esc(a.apelido || a.nome)}</span>`).join('')}</div>` : ''}` : miniEmpty('Nenhuma medição', 'Clique em “Nova medição”.'), { np: !!l.length, r: `<button data-act="mat-nova">+ Nova medição</button>` })}
    <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
      ${panel('Distribuição por status de maturação', l.length ? `<div class="donut-wrap">${donut(segs, l.length, 'ATLETAS', 150)}${legend(segs)}</div>` : miniEmpty('Sem dados'))}
      ${panel('Distribuição por desvio (anos)', l.length ? vbars(bins.map(b => b[0]), binv, { w: 440, h: 200, min: 3 }) : miniEmpty('Sem dados'))}
      ${panel('Informações da avaliação', `<div class="det-row"><span>Protocolo</span><div>Mirwald et al. (2002) · maturity offset</div></div><div class="det-row"><span>Medidas</span><div>Estatura, altura sentado e peso</div></div><div class="det-row"><span>Idade biológica</span><div>Idade cronológica + offset (desvio do PHV)</div></div><div class="det-row"><span>Desvio</span><div>Offset maturacional: negativo = antes do PHV, positivo = depois</div></div><div class="det-row"><span>Próxima avaliação</span><div>${last ? fmtD(addDays(last, 90)) : '—'} (a cada 3 meses)</div></div>`)}
    </div>
  </div>
  <div class="row r21">${panel('Bio-banding · grupos por fase de crescimento', Object.keys(MSTAT).map(k => `<div class="bioband"><h5 style="color:${MSTAT[k][1]}">${MSTAT[k][0]} <small>${MSTAT[k][3]}</small></h5><div>${l.filter(x => x.c.st === k).map(x => `<span class="bchip" data-matatl="${x.a.id}">${esc(x.a.apelido || x.a.nome.split(' ')[0])} <small>${x.c.mo >= 0 ? '+' : ''}${nf(x.c.mo, 1)}</small></span>`).join('') || '<span class="muted">—</span>'}</div></div>`).join(''))}${panel('Cuidados no pico de crescimento', `<p class="parecer" style="font-size:14px">Atletas em PHV (offset entre −1 e +1 ano) crescem mais rápido e ficam mais vulneráveis a dores no joelho (Osgood-Schlatter), no calcanhar (Sever) e na coluna. Ajuste volume de saltos, sprints e impacto, priorize mobilidade e técnica, e acompanhe as queixas junto ao DM.</p>`)}</div>`;
};

/* ---------- agenda, exportação e pendências ---------- */
function formAgenda() {
  openModal(mh('Agendar teste') + `<form id="fAg"><div class="mb"><div class="form" style="grid-template-columns:repeat(3,1fr)"><div class="f"><label for="agD">Data *</label><input id="agD" type="date" value="${addDays(todayISO(), 7)}" min="${todayISO()}" required></div><div class="f"><label for="agT">Teste</label><select id="agT">${opts([...Object.values(TESTS).map(t => t.n), 'Velocidade (10 m e 30 m)', 'Avaliação de maturação', 'Bateria completa'], 'Bateria completa')}</select></div><div class="f"><label for="agC">Categoria</label><select id="agC">${opts(Object.keys(GRUPOS), F.categoria !== 'Todas' ? F.categoria : 'Sub-15')}</select></div></div></div><div class="mf"><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Agendar</button></div></form>`);
  $('#fAg').onsubmit = e => { e.preventDefault(); S.config.agenda = [...(S.config.agenda || []).filter(x => x.data >= addDays(todayISO(), -60)), { id: uid('g'), data: $('#agD').value, teste: $('#agT').value, categoria: $('#agC').value }]; putConfig(); closeModal(); toast('Teste agendado'); };
}
async function exportarXLS(k) {
  try { await loadLib('xlsx'); } catch (e) { toast('Não foi possível carregar o gerador de Excel.', true); return; }
  const ats = atletasCat(); let rows;
  if (k === 'all') rows = ats.filter(a => tsDe(a.id).length).map(a => { const o = { Atleta: a.nome, Posição: POSN[a.posicao] || a.posicao, Categoria: a.subcategoria || a.categoria }; Object.entries(TESTS).forEach(([kk, T]) => { const t = ultimoTeste(a.id, kk); const v = t ? tval(t, kk) : null; o[`${T.n} (${T.u})`] = v ?? ''; o[`${T.n} – status`] = v != null ? BANDS[bandIdx(kk, v)] : ''; }); return o; });
  else { const D = UI.tsDate[k]; rows = S.testes.filter(t => t.data === D && tval(t, k) != null).map(t => { const a = atl(t.atletaId); if (!a || !ats.includes(a)) return null; const v = tval(t, k); return { Atleta: a.nome, Posição: POSN[a.posicao] || a.posicao, Data: fmtD(D), [`${TESTS[k].n} (${TESTS[k].u})`]: v, Status: BANDS[bandIdx(k, v)] }; }).filter(Boolean); }
  const ws = XLSX.utils.json_to_sheet(rows), wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Testes');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  try { const dl = window.claude && await window.claude.use('downloads'); if (!dl) { toast('O download não está disponível nesta visualização.', true); return; } await dl.save({ filename: `testes-fisicos-${k === 'all' ? 'geral' : k}-${todayISO()}.xlsx`, data: blob }); } catch (e) { if (e && e.code !== 'declined') toast('Não foi possível salvar o arquivo.', true); }
}
const naTemporada = d => noPeriodo(d);
function pendente(a, tipo) { if (tipo === 'fis') return !tsDe(a.id).some(t => naTemporada(t.data)); if (tipo === 'corp') return !avsDe(a.id).some(v => naTemporada(v.data)); if (tipo === 'mat') return !matDe(a.id).some(m => naTemporada(m.data)); return false; }
function pendBar(base) {
  const n = t => base.filter(a => pendente(a, t)).length;
  const b = (t, lbl) => `<button class="chip ${UI.atPend === t ? 'on' : ''}" data-act="at-pend" data-t="${t}"><i class="pdot ${n(t) ? 'bad' : 'ok'}"></i>${lbl}: ${n(t) ? n(t) + ' pendente(s)' : 'todos em dia'}</button>`;
  return `<div class="pendbar"><b>Avaliações na temporada ${anoLabel() === 'TODAS' ? '' : anoLabel()}</b>${b('fis', 'Física')}${b('corp', 'Corporal')}${b('mat', 'Maturação')}${UI.atPend ? `<button class="btn sm" data-act="at-pend" data-t="">Mostrar todos</button>` : ''}</div>`;
}
function evalBadges(a) {
  const tf = tsDe(a.id).filter(t => naTemporada(t.data)).slice(-1)[0], cv = avsDe(a.id).filter(v => naTemporada(v.data)).slice(-1)[0], mm = matDe(a.id).filter(m => naTemporada(m.data)).slice(-1)[0];
  const b = (ok, lbl, d) => `<i class="ev ${ok ? 'ok' : 'no'}" title="${lbl}: ${ok ? 'avaliado em ' + fmtD(d) : 'pendente na temporada'}">${ok ? '✓' : '✕'} ${lbl}${ok ? ' ' + fmtDs(d) : ''}</i>`;
  return `<span class="evrow">${b(tf, 'Física', tf?.data)}${b(cv, 'Corporal', cv?.data)}${b(mm, 'Maturação', mm?.data)}</span>`;
}
const _atlCard = atlCard;
atlCard = function (a) { return _atlCard(a).replace(/<span class="aval[^"]*">[\s\S]*?<\/span>/, evalBadges(a)); };
UI.atPend = '';

/* ---------- configuração: faixas de classificação ---------- */
function avCfgHTML() {
  return `<div class="cfg-grid">${panel('Faixas de classificação dos testes', `<p class="muted" style="margin-top:0">Limites usados para o status (Excelente, Muito Bom, Bom, Regular, Atenção). Em CMJ e 30-15 IFT, valores maiores são melhores; nos sprints e no 505, tempos menores são melhores.</p>
    <table class="t"><thead><tr><th class="l">Teste</th>${BANDS.slice(0, 4).map((b, i) => `<th style="color:#fff">${b}<br><small>${i === 0 ? 'a partir de' : 'até'}</small></th>`).join('')}<th>Atenção</th></tr></thead><tbody>${Object.entries(TESTS).map(([k, T]) => `<tr><td class="l"><b>${T.n}</b> <small class="muted">(${T.u}, ${T.up > 0 ? 'maior melhor' : 'menor melhor'})</small></td>${bandas(k).map((v, i) => `<td><input type="number" step="${T.d ? 1 / 10 ** T.d : 1}" data-band="${k}" data-i="${i}" value="${v}" style="width:80px;border:1px solid var(--line);border-radius:6px;padding:4px 6px;background:var(--card2);text-align:center"></td>`).join('')}<td class="muted">${T.up > 0 ? '<' : '>'} ${nf(bandas(k)[3], T.d)}</td></tr>`).join('')}</tbody></table>
    <div style="display:flex;gap:8px;margin-top:10px"><button class="btn sm" data-act="band-reset">Voltar ao padrão (Sub-15)</button></div>`)}
    ${panel('Testes da bateria', Object.entries(TESTS).map(([k, T]) => `<div class="det-row"><span>${T.n}</span><div>${esc(TINFO[k].p)} · ${esc(TINFO[k].o)}</div></div>`).join(''))}</div>`;
}
var CFG_INFO_EXTRA = ['config-aval', 'Avaliação física', 'Faixas de classificação dos testes físicos (Excelente a Atenção).'];

/* ---------- ações ---------- */
dmOn('click', e => {
  const fo = e.target.closest('[data-ficha-open]'); if (fo) { abrirFicha(fo.dataset.fichaOpen, S.view.startsWith('av-') || S.view.startsWith('mat-') ? 'fis' : 'geral'); return; }
  const t = e.target.closest('[data-act]'); if (!t) return;
  switch (t.dataset.act) {
    case 'ag-novo': formAgenda(); break;
    case 'ag-del': S.config.agenda = (S.config.agenda || []).filter(x => x.id !== t.dataset.id); putConfig(); break;
    case 'ts-xls': exportarXLS(t.dataset.k); break;
    case 'at-pend': UI.atPend = UI.atPend === t.dataset.t ? '' : t.dataset.t; UI.atPage = 0; render(); break;
    case 'band-reset': S.config.bandas = JSON.parse(JSON.stringify(DEF_BANDAS)); putConfig(); toast('Faixas restauradas'); break;
  }
});
dmOn('change', e => {
  const t = e.target;
  if (t.id === 'tsD') { const k = TEST_ROUTES[S.view]; if (k) UI.tsDate[k] = t.value; render(); }
  if (t.id === 'tsC') { UI.tsCmp = t.value; render(); }
  if (t.id === 'tsP') { UI.tsPos = t.value; render(); }
  if (t.id === 'tsS') { UI.tsSt = t.value; render(); }
  if (t.dataset.band) { const k = t.dataset.band; const b = [...bandas(k)]; b[+t.dataset.i] = +t.value; S.config.bandas = { ...(S.config.bandas || {}), [k]: b }; putConfig(); }
});
let tsbt; dmOn('input', e => { if (e.target.id === 'tsB') { const v = e.target.value; clearTimeout(tsbt); tsbt = setTimeout(() => { UI.tsBusca = v; const p = e.target.selectionStart; render(); const el = $('#tsB'); if (el) { el.focus(); el.setSelectionRange(p, p); } }, 250); } });

/* ================= INÍCIO · DASHBOARD GERAL ================= */
IC.home = I('<path d="M3 11 12 3l9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>');
IC.trophy = I('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>');
TITLES.inicio = ['Início', 'Dashboard geral'];
NAV.unshift({ k: 'inicio', n: 'Início', ic: IC.home });

// pendências: só aparece o que falta (sem selos quando está tudo em dia)
evalBadges = function (a) {
  const f = []; if (pendente(a, 'fis')) f.push('Física'); if (pendente(a, 'corp')) f.push('Corporal'); if (pendente(a, 'mat')) f.push('Maturação');
  return f.length ? `<span class="evfalta" title="Avaliações pendentes na temporada">${IC.cross} Falta: ${f.join(', ')}</span>` : '';
};

function jogosCat() {
  const M = window.MIN && MIN.S; if (!M) return [];
  return (M.jogos || []).filter(j => (F.categoria === 'Todas' || j.categoria === F.categoria) && (noPeriodo(String(j.data || ''))));
}
function resultado(j) { const p = j.golsPro, c = j.golsContra; if (p === '' || p == null || c === '' || c == null) return null; return +p > +c ? 'V' : +p < +c ? 'D' : 'E'; }
function lideres(campo, n = 5) {
  const js = jogosCat(), m = new Map();
  js.forEach(j => (j.relacionados || []).forEach(r => { const v = campo === 'min' ? +r.min || 0 : campo === 'gols' ? +r.gols || 0 : +r.assist || 0; if (!v) return; const o = m.get(r.atletaId) || { v: 0, j: 0 }; o.v += v; if (+r.min) o.j++; m.set(r.atletaId, o); }));
  return [...m.entries()].map(([id, o]) => ({ a: atl(id) || (window.MIN && MIN.S.atletas.find(x => x.id === id)), ...o })).filter(x => x.a).sort((x, y) => y.v - x.v).slice(0, n);
}
const lidList = (l, u) => l.length ? `<div class="lid">${l.map((x, i) => `<div class="lidr" data-ficha-open="${x.a.id}"><span class="lpos p${i + 1}">${i + 1}</span>${fotoBox(x.a, 'mini')}<span class="lnm"><b>${esc(x.a.apelido || x.a.nome)}</b><small>${esc(POSN[x.a.posicao] || '')} · ${x.j} jogo(s)</small></span><b class="lv">${x.v}<small>${u}</small></b></div>`).join('')}</div>` : miniEmpty('Sem dados', 'Os números vêm dos jogos minutados.');

function vInicio() {
  const ats = atletasCat(), js = jogosCat().sort((a, b) => String(b.data).localeCompare(String(a.data)));
  const res = js.map(resultado).filter(Boolean), v = res.filter(r => r === 'V').length, e = res.filter(r => r === 'E').length, d = res.filter(r => r === 'D').length;
  const gp = js.reduce((s, j) => s + (+j.golsPro || 0), 0), gc = js.reduce((s, j) => s + (+j.golsContra || 0), 0);
  const minTot = js.reduce((s, j) => s + (j.relacionados || []).reduce((t, r) => t + (+r.min || 0), 0), 0);
  const aprov = res.length ? Math.round((v * 3 + e) / (res.length * 3) * 100) : null;
  // DM
  const at = lesAtivas(), noDM = new Set(at.map(l => l.atletaId)).size, lesTemp = lesPeriodo();
  // nutrição
  const U = ultimas(), lst = [...U.values()].map(x => calcAv(x)), gs = lst.map(c => c.g).filter(x => x != null);
  const fora = lst.filter(c => c.g != null && faixa(c.g) !== 'ideal').length;
  // avaliação física
  const testados = ats.filter(a => tsDe(a.id).some(t => naTemporada(t.data))).length;
  const topT = k => ats.map(a => { const t = ultimoTeste(a.id, k); return t ? { a, v: tval(t, k) } : null; }).filter(Boolean).sort((x, y) => TESTS[k].up > 0 ? y.v - x.v : x.v - y.v)[0];
  // maturação
  const mats = [...matUltimas().values()].map(m => ({ m, c: calcMat(m), a: atl(m.atletaId) })).filter(x => x.a && x.c && x.c.mo != null).map(x => ({ ...x, tm: timing(x.c) }));
  const mcnt = countBy(mats, x => x.c.st);
  const adi = [...mats].sort((x, y) => y.tm.d - x.tm.d);
  // pendências
  const pend = t => ats.filter(a => pendente(a, t));
  const ag = (S.config.agenda || []).filter(x => x.data >= todayISO()).sort((a, b) => a.data.localeCompare(b.data)).slice(0, 4);
  const mes = todayISO().slice(5, 7); const aniv = ats.filter(a => a.nascimento && a.nascimento.slice(5, 7) === mes).sort((a, b) => a.nascimento.slice(8).localeCompare(b.nascimento.slice(8)));
  const link = (nav, t) => `<button data-nav="${nav}">${t}</button>`;
  const res5 = js.slice(0, 6).map(j => { const r = resultado(j); return `<div class="jgr"><span class="rs r${r || 'N'}">${r || '–'}</span><span class="jd">${fmtDs(j.data)}</span><span class="ja"><b>${esc(j.adversario || '—')}</b><small>${esc(j.competicao || '')} · ${j.mando === 'fora' ? 'fora' : 'casa'}</small></span><b class="jp">${j.golsPro ?? '–'} x ${j.golsContra ?? '–'}</b></div>`; }).join('');
  const kp = (ic, k, val, s, cls = '') => kpi(ic, k, val, s, cls);
  return header({ title: 'PAINEL GERAL', sub: 'PERFORMANCE HUB · VISÃO GERAL', items: hdrItems(), solo: true }) + noData() + `
  <div class="kpis k8">
    ${kp('ball', 'Jogos', js.length, `${res.length} com placar`)}
    ${kp('trophy', 'Vitórias', v, `${e} empates · ${d} derrotas`)}
    ${kp('trend', 'Aproveitamento', aprov != null ? aprov + '%' : '—', 'pontos conquistados')}
    ${kp('goal', 'Gols', `${gp}<small>pró</small>`, `${gc} sofridos · saldo ${gp - gc >= 0 ? '+' : ''}${gp - gc}`)}
    ${kp('clock', 'Minutos jogados', minTot.toLocaleString('pt-BR'), 'soma do elenco')}
    ${kp('users', 'Elenco', ats.length, F.categoria === 'Todas' ? 'todas as categorias' : catLabel().toLowerCase())}
    ${kp('med', 'No DM agora', noDM, `${lesTemp.length} lesões na temporada`, 'red')}
    ${kp('stopw', 'Avaliados (físico)', `${testados}<small>/ ${ats.length}</small>`, pct(testados, ats.length) + ' do elenco', 'blue')}
  </div>
  <div class="row r4h">
    ${panel('Últimos jogos', res5 ? `<div class="jgl">${res5}</div>` : miniEmpty('Sem jogos', 'Cadastre jogos na Minutagem.'), { r: link('m-jogos-painel', 'Ver jogos') })}
    ${panel(`${IC.goal.replace('<svg', '<svg width="18" height="18"')} Artilheiros`, lidList(lideres('gols'), 'gols'), { r: link('m-min-geral', 'Minutagem') })}
    ${panel('Assistências', lidList(lideres('ast'), 'ast.'), { r: link('m-min-geral', 'Minutagem') })}
    ${panel('Mais minutos', lidList(lideres('min'), "'"), { r: link('m-min-geral', 'Minutagem') })}
  </div>
  <div class="row r4h">
    ${panel('Departamento médico', `<div class="hstat"><div><b>${noDM}</b><span>no DM agora</span></div><div><b>${pct(ats.length - noDM, ats.length)}</b><span>disponíveis</span></div><div><b>${lesTemp.length}</b><span>lesões na temporada</span></div></div>${at.length ? `<div class="lid">${at.slice(0, 5).map(l => { const a = atl(l.atletaId); return a ? `<div class="lidr" data-open-les="${l.id}">${lesThumb(l, 'sm')}<span class="lnm"><b>${esc(a.apelido || a.nome)}</b><small>${esc(lesNome(l))} · ${esc(regFull(l))}</small></span>${chip(l.status)}</div>` : ''; }).join('')}</div>` : miniEmpty('DM vazio', 'Ninguém lesionado agora.')}`, { r: link('dashboard', 'Abrir DM') })}
    ${panel('Nutrição', `<div class="hstat"><div><b>${U.size}</b><span>avaliados</span></div><div><b>${nfx(mean(gs), 1, '%')}</b><span>% gordura médio</span></div><div><b class="${fora ? 'up' : 'down'}">${fora}</b><span>fora da faixa</span></div></div>${gs.length ? `<div class="donut-wrap">${donut(Object.keys(FAIXAS).map(k => ({ l: FAIXAS[k][0], v: lst.filter(c => faixa(c.g) === k).length, c: FAIXAS[k][1] })), gs.length, 'AVALIADOS', 120)}${legend(Object.keys(FAIXAS).map(k => ({ l: FAIXAS[k][0], v: lst.filter(c => faixa(c.g) === k).length, c: FAIXAS[k][1] })))}</div>` : miniEmpty('Sem avaliações corporais')}`, { r: link('nut-dash', 'Abrir nutrição') })}
    ${panel('Ranking das avaliações físicas', `<div class="lid">${Object.keys(TESTS).map(k => { const x = topT(k); return x ? `<div class="lidr" data-avatl="${x.a.id}">${fotoBox(x.a, 'mini')}<span class="lnm"><b>${esc(x.a.apelido || x.a.nome)}</b><small>Melhor em ${TESTS[k].n}</small></span><b class="lv">${fmtT(k, x.v)}<small>${TESTS[k].u}</small></b></div>` : ''; }).join('') || miniEmpty('Sem testes')}</div>`, { r: link('av-dash', 'Abrir avaliação física') })}
    ${panel('Ranking de maturação', mats.length ? `<div class="hstat"><div><b>${mcnt.pre || 0}</b><span>pré-PHV</span></div><div><b>${mcnt.circa || 0}</b><span>no pico</span></div><div><b>${mcnt.pos || 0}</b><span>pós-PHV</span></div></div><div class="lid">${adi.slice(0, 2).concat(adi.length > 3 ? adi.slice(-2) : []).map(x => `<div class="lidr" data-matatl="${x.a.id}">${fotoBox(x.a, 'mini')}<span class="lnm"><b>${esc(x.a.apelido || x.a.nome)}</b><small>Idade biológica ${nf(x.tm.bio, 1)} · ${x.tm.t[0]}</small></span><b class="lv" style="color:${x.tm.t[1]}">${x.tm.d >= 0 ? '+' : '−'}${nf(Math.abs(x.tm.d), 1)}<small>anos</small></b></div>`).join('')}</div>` : miniEmpty('Sem medições'), { r: link('mat-dash', 'Abrir maturação') })}
  </div>
  <div class="row r3">
    ${panel('Avaliações pendentes na temporada', ['fis', 'corp', 'mat'].map(t => { const l = pend(t); const nm = { fis: 'Física', corp: 'Corporal', mat: 'Maturação' }[t]; return `<div class="pendl"><b class="${l.length ? 'up' : 'down'}">${l.length ? l.length + ' sem ' + nm.toLowerCase() : nm + ': todos em dia'}</b>${l.length ? `<div>${l.slice(0, 12).map(a => `<span class="bchip" data-ficha-open="${a.id}">${esc(a.apelido || a.nome.split(' ')[0])}</span>`).join('')}${l.length > 12 ? `<span class="muted"> +${l.length - 12}</span>` : ''}</div>` : ''}</div>`; }).join(''), { r: link('atletas', 'Ver atletas') })}
    ${panel('Próximos testes agendados', ag.length ? ag.map(x => `<div class="sfrow"><span>${IC.cal} ${fmtD(x.data)}</span><span>${esc(x.teste)}</span><span class="muted">${esc(x.categoria)}</span></div>`).join('') : miniEmpty('Nada agendado', 'Agende em Avaliação física → Painel geral.'), { r: link('av-dash', 'Agendar') })}
    ${panel(`Aniversariantes de ${MESES[+mes - 1].toLowerCase()}`, aniv.length ? `<div class="lid">${aniv.map(a => `<div class="lidr" data-ficha-open="${a.id}">${fotoBox(a, 'mini')}<span class="lnm"><b>${esc(a.apelido || a.nome)}</b><small>${esc(a.subcategoria || a.categoria)}</small></span><b class="lv">${a.nascimento.slice(8, 10)}/${mes}<small>${idade(a.nascimento) + (a.nascimento.slice(5) > todayISO().slice(5) ? 1 : 0)} anos</small></b></div>`).join('')}</div>` : miniEmpty('Ninguém faz aniversário este mês'))}
  </div>`;
}

const _renderAs2 = renderAs;
renderAs = function (view) { if (view === 'inicio') { const v0 = S.view; S.view = 'inicio'; try { return vInicio(); } finally { S.view = v0; } } return _renderAs2(view); };

/* ================= INÍCIO · GRÁFICOS INTERATIVOS ================= */
UI.hChart = 'res'; UI.hPos = null; UI.hTests = new Set(['cmj', 'ift', 'v10', 'v30', 't505']);
const MESL = k => MESES[+k.slice(5, 7) - 1] + '/' + k.slice(2, 4);
// eixos e grade comuns
function axes(W, H, L, R, T, B, lo, hi, n, fmt) { let g = ''; for (let i = 0; i <= n; i++) { const v = lo + (hi - lo) / n * i, y = T + (H - T - B) * (1 - (v - lo) / (hi - lo || 1)); g += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${L - 6}" y="${y + 4}" text-anchor="end" font-size="11" fill="var(--ink2)">${fmt ? fmt(v) : Math.round(v)}</text>`; } return g; }
function iBars(labels, series, o = {}) {
  const W = o.w || 900, H = o.h || 270, L = 36, R = 10, T = 16, B = 30, n = labels.length || 1;
  const tots = labels.map((_, i) => o.stacked ? series.reduce((s, x) => s + (x.vals[i] || 0), 0) : Math.max(0, ...series.map(x => x.vals[i] || 0)));
  const hi0 = Math.max(o.min || 3, ...tots) * 1.12, hi = o.fmt ? hi0 : Math.ceil(hi0), nt = o.fmt ? 4 : Math.min(4, hi), bw = (W - L - R) / n, inner = bw * (o.stacked ? 0.56 : 0.72);
  const Y = v => T + (H - T - B) * (1 - v / hi);
  let bars = '';
  labels.forEach((lb, i) => {
    const x0 = L + i * bw + (bw - inner) / 2;
    if (o.stacked) { let y = H - B; series.forEach(s => { const v = s.vals[i] || 0; if (!v) return; const h = (H - T - B) * v / hi; y -= h; bars += `<rect class="ibar" x="${x0}" y="${y}" width="${inner}" height="${h}" rx="2" fill="${s.c}" data-tip="${esc(lb)} · ${esc(s.n)}: ${o.fmt ? o.fmt(v) : v}${o.tip ? '\n' + o.tip(i) : ''}"/>`; }); if (tots[i]) bars += `<text x="${x0 + inner / 2}" y="${y - 5}" text-anchor="middle" font-size="11.5" font-weight="700" fill="var(--ink)">${o.fmt ? o.fmt(tots[i]) : tots[i]}</text>`; }
    else { const w = inner / series.length; series.forEach((s, k) => { const v = s.vals[i] || 0; const y = Y(v); bars += `<rect class="ibar" x="${x0 + k * w}" y="${y}" width="${w - 2}" height="${H - B - y}" rx="2" fill="${s.c}" data-tip="${esc(lb)} · ${esc(s.n)}: ${o.fmt ? o.fmt(v) : v}"/>${v ? `<text x="${x0 + k * w + (w - 2) / 2}" y="${y - 4}" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--ink)">${o.fmt ? o.fmt(v) : v}</text>` : ''}`; }); }
    bars += `<text x="${L + i * bw + bw / 2}" y="${H - 9}" text-anchor="middle" font-size="11" fill="var(--ink2)">${esc(lb)}</text>`;
  });
  let line = '';
  if (o.line) { const lv = o.line.vals, lhi = Math.max(...lv.filter(v => v != null), 1) * 1.15; const LY = v => T + (H - T - B) * (1 - v / lhi); const pts = lv.map((v, i) => v == null ? null : [L + i * bw + bw / 2, LY(v), v]).filter(Boolean); line = `<polyline points="${pts.map(p => p[0] + ',' + p[1]).join(' ')}" fill="none" stroke="${o.line.c}" stroke-width="2.5"/>` + pts.map((p, j) => `<circle class="ipt" cx="${p[0]}" cy="${p[1]}" r="5" fill="${o.line.c}" stroke="var(--card)" stroke-width="2" data-tip="${esc(o.line.n)}: ${o.line.fmt ? o.line.fmt(p[2]) : p[2]}"/>`).join(''); }
  return `<svg class="chart ich" viewBox="0 0 ${W} ${H}">${axes(W, H, L, R, T, B, 0, hi, nt, o.fmt)}${bars}${line}</svg>`;
}
function iLine(labels, series, o = {}) {
  const W = o.w || 640, H = o.h || 250, L = 40, R = 14, T = 18, B = 30;
  const all = series.flatMap(s => s.vals).filter(v => v != null); if (!all.length) return miniEmpty('Sem dados');
  let lo = o.lo ?? Math.min(...all), hi = o.hi ?? Math.max(...all); const pad = Math.max((hi - lo) * 0.15, 0.5); if (o.lo == null) lo -= pad; if (o.hi == null) hi += pad;
  const step = (W - L - R) / Math.max(1, labels.length - 1), X = i => L + i * step, Y = v => T + (H - T - B) * (1 - (v - lo) / (hi - lo || 1));
  let g = axes(W, H, L, R, T, B, lo, hi, 4, o.fmt);
  if (o.zero && lo < 0 && hi > 0) g += `<line x1="${L}" x2="${W - R}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--ink3)" stroke-width="1.2"/>`;
  series.forEach(s => {
    const pts = s.vals.map((v, i) => v == null ? null : [X(i), Y(v), v, i]).filter(Boolean); if (!pts.length) return;
    if (o.area) g += `<polygon points="${pts[0][0]},${Y(Math.max(lo, 0))} ${pts.map(p => p[0] + ',' + p[1]).join(' ')} ${pts[pts.length - 1][0]},${Y(Math.max(lo, 0))}" fill="${s.c}" opacity=".14"/>`;
    g += `<polyline points="${pts.map(p => p[0] + ',' + p[1]).join(' ')}" fill="none" stroke="${s.c}" stroke-width="2.6" stroke-linejoin="round"/>`;
    g += pts.map(p => `<circle class="ipt" cx="${p[0]}" cy="${p[1]}" r="${o.r || 4.5}" fill="${s.c}" stroke="var(--card)" stroke-width="2" data-tip="${esc(labels[p[3]])} · ${esc(s.n)}: ${o.fmt ? o.fmt(p[2]) : p[2]}${o.tip ? '\n' + o.tip(p[3], s) : ''}"/>`).join('');
  });
  const every = Math.ceil(labels.length / 12);
  g += labels.map((l, i) => i % every ? '' : `<text x="${X(i)}" y="${H - 9}" text-anchor="middle" font-size="11" fill="var(--ink2)">${esc(l)}</text>`).join('');
  return `<svg class="chart ich" viewBox="0 0 ${W} ${H}">${g}</svg>`;
}
function iDonut(segs, big, small, size, act) {
  const tot = segs.reduce((s, x) => s + x.v, 0); const r = 62, c = 2 * Math.PI * r; let off = 0;
  const arcs = tot ? segs.filter(s => s.v > 0).map(s => { const len = s.v / tot * c; const el = `<circle class="islice ${s.on ? 'on' : ''} ${s.dim ? 'dim' : ''}" r="${r}" cx="85" cy="85" fill="none" stroke="${s.c}" stroke-width="26" stroke-dasharray="${len} ${c - len}" stroke-dashoffset="${-off}" transform="rotate(-90 85 85)" data-tip="${esc(s.l)}: ${s.t ?? s.v} (${pct(s.v, tot)})" ${act && s.key ? `data-act="${act}" data-v="${s.key}" role="button" tabindex="0" aria-label="${esc(s.l)}"` : ''}/>`; off += len; return el; }).join('') : `<circle r="${r}" cx="85" cy="85" fill="none" stroke="var(--line)" stroke-width="26"/>`;
  return `<svg class="ich" viewBox="0 0 170 170" width="${size}" height="${size}">${arcs}<text pointer-events="none" x="85" y="88" text-anchor="middle" font-size="30" font-weight="800" fill="var(--ink)" style="font-family:var(--fc)">${big}</text><text pointer-events="none" x="85" y="108" text-anchor="middle" font-size="11.5" fill="var(--ink2)">${esc(small)}</text></svg>`;
}
const chips = (act, list, cur) => `<div class="hchips">${list.map(([v, n]) => `<button class="${(cur instanceof Set ? cur.has(v) : cur === v) ? 'on' : ''}" data-act="${act}" data-v="${v}">${n}</button>`).join('')}</div>`;

function homeCharts() {
  const ats = atletasCat(), js = jogosCat().filter(j => j.data).sort((a, b) => String(a.data).localeCompare(String(b.data)));
  // 1. desempenho mês a mês
  const ms = [...new Set(js.map(j => String(j.data).slice(0, 7)))].sort(); const ml = ms.map(MESL);
  const by = k => js.filter(j => String(j.data).startsWith(k));
  let graf = '';
  if (!js.length) graf = miniEmpty('Sem jogos no filtro', 'Cadastre jogos no módulo de Jogos/Minutagem.');
  else if (UI.hChart === 'res') graf = iBars(ml, [{ n: 'Vitórias', c: '#1b8a4a', vals: ms.map(k => by(k).filter(j => resultado(j) === 'V').length) }, { n: 'Empates', c: '#8a948f', vals: ms.map(k => by(k).filter(j => resultado(j) === 'E').length) }, { n: 'Derrotas', c: '#e0342b', vals: ms.map(k => by(k).filter(j => resultado(j) === 'D').length) }], { stacked: true, tip: i => by(ms[i]).map(j => `${fmtDs(j.data)} ${j.golsPro ?? '–'}x${j.golsContra ?? '–'} ${j.adversario || ''}`).join('\n') });
  else if (UI.hChart === 'gols') graf = iBars(ml, [{ n: 'Gols pró', c: '#1b8a4a', vals: ms.map(k => by(k).reduce((s, j) => s + (+j.golsPro || 0), 0)) }, { n: 'Gols sofridos', c: '#e0342b', vals: ms.map(k => by(k).reduce((s, j) => s + (+j.golsContra || 0), 0)) }]);
  else if (UI.hChart === 'min') { const tot = ms.map(k => by(k).reduce((s, j) => s + (j.relacionados || []).reduce((t, r) => t + (+r.min || 0), 0), 0)); graf = iBars(ml, [{ n: 'Minutos do elenco', c: '#2f6fd6', vals: tot }], { line: { n: 'Atletas utilizados (média por jogo)', c: '#f39324', vals: ms.map(k => { const l = by(k); return l.length ? Math.round(l.reduce((s, j) => s + (j.relacionados || []).filter(r => +r.min).length, 0) / l.length * 10) / 10 : null; }) }, fmt: v => Math.round(v).toLocaleString('pt-BR') }); }
  else { let p = 0, n = 0; const ap = js.map(j => { const r = resultado(j); if (r) { n++; p += r === 'V' ? 3 : r === 'E' ? 1 : 0; } return n ? Math.round(p / (n * 3) * 100) : null; }); graf = iLine(js.map(j => fmtDs(j.data)), [{ n: 'Aproveitamento acumulado', c: '#1b8a4a', vals: ap }], { w: 900, h: 270, lo: 0, hi: 100, area: true, fmt: v => Math.round(v) + '%', tip: i => `${js[i].golsPro ?? '–'} x ${js[i].golsContra ?? '–'} ${js[i].adversario || ''} (${js[i].competicao || ''})` }); }
  const seq = js.slice(-12).map(j => { const r = resultado(j); return `<span class="seq r${r || 'N'}" data-tip="${fmtD(j.data)} · ${esc(j.adversario || '')}\n${j.golsPro ?? '–'} x ${j.golsContra ?? '–'} · ${esc(j.competicao || '')}">${r || '–'}</span>`; }).join('');
  const res = js.map(resultado).filter(Boolean);
  const vedSeg = [{ l: 'Vitórias', v: res.filter(r => r === 'V').length, c: '#1b8a4a' }, { l: 'Empates', v: res.filter(r => r === 'E').length, c: '#8a948f' }, { l: 'Derrotas', v: res.filter(r => r === 'D').length, c: '#e0342b' }];
  // 2. minutos por posição (clicável)
  const mp = {}; js.forEach(j => (j.relacionados || []).forEach(r => { const a = atl(r.atletaId) || (window.MIN && MIN.S.atletas.find(x => x.id === r.atletaId)); if (!a) return; mp[a.posicao] = (mp[a.posicao] || 0) + (+r.min || 0); }));
  const totMin = Object.values(mp).reduce((s, v) => s + v, 0);
  const posSeg = POS.filter(p => mp[p]).map(p => ({ l: POSN[p], key: p, v: mp[p], t: mp[p].toLocaleString('pt-BR') + ' min', c: PC1[p], on: UI.hPos === p, dim: UI.hPos && UI.hPos !== p }));
  // 3. disponibilidade semanal
  const [ini, fim] = periodo(); const semanas = []; for (let d = ini; d <= fim; d = addDays(d, 7)) semanas.push(d);
  const ativosEm = d => S.lesoes.filter(l => ats.some(a => a.id === l.atletaId) && l.data <= d && (l.status === 'liberado' && l.statusDatas?.liberado ? l.statusDatas.liberado : todayISO()) >= d);
  const disp = semanas.map(d => ats.length ? Math.round((1 - new Set(ativosEm(d).map(l => l.atletaId)).size / ats.length) * 100) : null);
  const dispG = semanas.length > 1 ? iLine(semanas.map(fmtDs), [{ n: 'Disponíveis', c: '#1b8a4a', vals: disp }], { w: 440, h: 250, lo: Math.min(70, ...disp.filter(v => v != null)) - 5, hi: 100, area: true, r: 3.5, fmt: v => Math.round(v) + '%', tip: i => { const l = ativosEm(semanas[i]); return l.length ? 'No DM: ' + [...new Set(l.map(x => (atl(x.atletaId)?.apelido || atl(x.atletaId)?.nome || '').split(' ')[0]))].join(', ') : 'Ninguém no DM'; } }) : miniEmpty('Sem dados');
  // 4. mapa de minutagem (últimos 10 jogos)
  const ult = js.slice(-10);
  const rk = new Map(); ult.forEach(j => (j.relacionados || []).forEach(r => rk.set(r.atletaId, (rk.get(r.atletaId) || 0) + (+r.min || 0))));
  const linhas = [...rk.entries()].map(([id, m]) => ({ a: atl(id) || (window.MIN && MIN.S.atletas.find(x => x.id === id)), m })).filter(x => x.a && (!UI.hPos || x.a.posicao === UI.hPos)).sort((x, y) => y.m - x.m).slice(0, 18);
  const heat = ult.length && linhas.length ? `<div class="hgrid" style="grid-template-columns:150px repeat(${ult.length},1fr) 56px"><span></span>${ult.map(j => `<span class="hh" data-tip="${fmtD(j.data)} · ${esc(j.adversario || '')} ${j.golsPro ?? ''}x${j.golsContra ?? ''}">${fmtDs(j.data)}<small>${esc((j.adversario || '').slice(0, 8))}</small></span>`).join('')}<span class="hh">Total</span>${linhas.map(x => `<span class="hn" data-ficha-open="${x.a.id}">${ptag(x.a.posicao)} ${esc(x.a.apelido || x.a.nome.split(' ').slice(0, 2).join(' '))}</span>${ult.map(j => { const r = (j.relacionados || []).find(y => y.atletaId === x.a.id); const dur = +j.duracao || 90; const m = r ? +r.min || 0 : null; const t = m == null ? 'Não relacionado' : !m ? 'Relacionado, não entrou' : `${m} min${r.status === 'T' ? ' · titular' : ' · entrou'}${+r.gols ? ' · ' + r.gols + ' gol(s)' : ''}`; return `<span class="hc" style="background:${m == null ? 'var(--card2)' : !m ? 'var(--line)' : `rgba(27,138,74,${(0.18 + 0.82 * Math.min(1, m / dur)).toFixed(2)})`};color:${m && m / dur > 0.55 ? '#fff' : 'var(--ink2)'}" data-tip="${esc(x.a.apelido || x.a.nome)} · ${fmtDs(j.data)} ${esc(j.adversario || '')}\n${t}">${m == null ? '' : m || '0'}${r && +r.gols ? '<i>⚽</i>' : ''}</span>`; }).join('')}<b class="ht">${x.m}'</b>`).join('')}</div><div class="hleg"><span><i style="background:var(--card2)"></i>Não relacionado</span><span><i style="background:var(--line)"></i>Não entrou</span><span><i style="background:rgba(27,138,74,.3)"></i>Poucos minutos</span><span><i style="background:rgba(27,138,74,1)"></i>Jogo inteiro</span></div>` : miniEmpty('Sem jogos minutados');
  // 5. evolução física da equipe (% em relação à 1ª sessão; positivo = melhorou)
  const ses = [...new Set(tsCat().map(t => t.data))].sort();
  const ids = new Set(ats.map(a => a.id));
  const tSeries = Object.entries(TESTS).filter(([k]) => UI.hTests.has(k)).map(([k, T], i) => { const ms2 = ses.map(d => mean(S.testes.filter(t => t.data === d && ids.has(t.atletaId)).map(t => tval(t, k)))); const base = ms2.find(v => v != null); return { n: T.n, c: ['#1b8a4a', '#2f6fd6', '#f39324', '#7a3fd1', '#e0342b'][Object.keys(TESTS).indexOf(k)], vals: ms2.map(v => v == null || !base ? null : Math.round((T.up > 0 ? (v - base) / base : (base - v) / base) * 1000) / 10), raw: ms2, k }; });
  const fisG = ses.length > 1 ? iLine(ses.map(fmtDs), tSeries, { w: 560, h: 260, zero: true, fmt: v => (v > 0 ? '+' : '') + nf(v, 1) + '%', tip: (i, s) => `média ${fmtT(s.k, s.raw[i])} ${TESTS[s.k].u}` }) : miniEmpty('Uma sessão só', 'A evolução aparece a partir da segunda sessão de testes.');
  // 6. dispersão: % de gordura x massa magra
  const pts = [...ultimas().values()].map(v => ({ v, c: calcAv(v), a: atl(v.atletaId) })).filter(x => x.a && x.c.g != null && x.c.mm != null);
  let scat = miniEmpty('Sem avaliações corporais');
  if (pts.length) { const W = 520, H = 260, L = 42, R = 12, T = 14, B = 34; const xs = pts.map(p => p.c.g), ys = pts.map(p => p.c.mm); const x0 = Math.min(...xs) - 1, x1 = Math.max(...xs) + 1, y0 = Math.min(...ys) - 2, y1 = Math.max(...ys) + 2; const X = v => L + (W - L - R) * (v - x0) / (x1 - x0), Y = v => T + (H - T - B) * (1 - (v - y0) / (y1 - y0)); const { min, max } = alvo();
    scat = `<svg class="chart ich" viewBox="0 0 ${W} ${H}">${axes(W, H, L, R, T, B, y0, y1, 4)}<rect x="${X(Math.max(min, x0))}" y="${T}" width="${Math.max(0, X(Math.min(max, x1)) - X(Math.max(min, x0)))}" height="${H - T - B}" fill="#1b8a4a" opacity=".07"/><text x="${X((Math.max(min, x0) + Math.min(max, x1)) / 2)}" y="${T + 12}" text-anchor="middle" font-size="10.5" fill="var(--g500)" font-weight="700">faixa-alvo ${min}–${max}%</text>${[0, 1, 2, 3, 4].map(i => { const v = x0 + (x1 - x0) / 4 * i; return `<text x="${X(v)}" y="${H - 16}" text-anchor="middle" font-size="11" fill="var(--ink2)">${nf(v, 1)}%</text>`; }).join('')}<text x="${(L + W - R) / 2}" y="${H - 2}" text-anchor="middle" font-size="11" fill="var(--ink2)">% de gordura →</text>${pts.map(p => `<circle class="ipt" cx="${X(p.c.g)}" cy="${Y(p.c.mm)}" r="7" fill="${FAIXAS[faixa(p.c.g)][1]}" fill-opacity=".85" stroke="var(--card)" stroke-width="2" data-tip="${esc(p.a.apelido || p.a.nome)} (${p.a.posicao})\n${nf(p.c.g, 1)}% gordura · ${nf(p.c.mm, 1)} kg massa magra\n${nf(p.c.peso, 1)} kg · avaliado em ${fmtDs(p.v.data)}" data-ficha-open="${p.a.id}"/>`).join('')}</svg><div class="muted" style="font-size:11.5px;text-align:center">Cada ponto é um atleta · eixo vertical = massa magra (kg) · clique para abrir a ficha</div>`; }
  // 7. lesões por região
  const lp = lesPeriodo();
  return `<div class="row r21">
    ${panel('Desempenho ao longo da temporada', chips('h-chart', [['res', 'Resultados'], ['gols', 'Gols'], ['min', 'Minutagem'], ['aprov', 'Aproveitamento']], UI.hChart) + graf, { r: '<span style="font-size:12px;opacity:.85">passe o mouse para ver os detalhes</span>' })}
    ${panel('Resultados e sequência', `<div class="donut-wrap">${iDonut(vedSeg, res.length, 'JOGOS', 150)}${legend(vedSeg)}</div><div class="seqbox"><small>Últimos ${Math.min(12, js.length)} jogos (mais recente à direita)</small><div class="seqrow">${seq || '<span class="muted">—</span>'}</div></div>`)}
  </div>
  <div class="row r3">
    ${panel('Minutos por posição', posSeg.length ? `<div class="donut-wrap">${iDonut(posSeg, UI.hPos ? Math.round(mp[UI.hPos] / totMin * 100) + '%' : totMin.toLocaleString('pt-BR'), UI.hPos ? POSN[UI.hPos].toUpperCase() : 'MINUTOS', 160, 'h-pos')}<div class="legend">${posSeg.map(s => `<div class="li clk ${s.dim ? 'dim' : ''}" data-act="h-pos" data-v="${s.key}"><span class="sw" style="background:${s.c}"></span><div><b>${s.l}</b><span>${s.t} (${pct(s.v, totMin)})</span></div></div>`).join('')}</div></div><p class="muted" style="font-size:12px;margin:8px 0 0;text-align:center">${UI.hPos ? `Filtrando os rankings por <b>${POSN[UI.hPos]}</b> · <button class="linkbtn" data-act="h-pos" data-v="">mostrar todos</button>` : 'Clique numa posição para filtrar os rankings e o mapa de minutagem.'}</p>` : miniEmpty('Sem minutagem'))}
    ${panel('Disponibilidade do elenco por semana', dispG + '<div class="muted" style="font-size:11.5px;text-align:center">% do elenco fora do DM · passe o mouse para ver quem estava lesionado</div>', { r: `<button data-nav="dashboard">Abrir DM</button>` })}
    ${panel('Lesões por região (temporada)', bodyMap({ mode: 'heat', ls: lp }) + `<div class="heatbar">menos<i></i>mais lesões</div>`)}
  </div>
  <div class="row" style="grid-template-columns:1fr">${panel(`Mapa de minutagem · últimos ${ult.length} jogos${UI.hPos ? ' · ' + POSN[UI.hPos] : ''}`, heat, { r: `<button data-nav="m-min-jogo">Minutagem por jogo</button>` })}</div>
  <div class="row r2">
    ${panel('Evolução física da equipe (%)', chips('h-test', Object.entries(TESTS).map(([k, T]) => [k, T.n.replace('Velocidade ', '')]), UI.hTests) + fisG + '<div class="muted" style="font-size:11.5px;text-align:center">Variação da média do grupo em relação à primeira sessão · acima de zero = melhorou</div>', { r: `<button data-nav="av-dash">Avaliação física</button>` })}
    ${panel('Composição corporal do elenco', scat, { r: `<button data-nav="nut-comp">Nutrição</button>` })}
  </div>`;
}
const _vInicioBase = vInicio;
vInicio = function () { const h = _vInicioBase(); const i = h.indexOf('<div class="row r4h">'); return i < 0 ? h + homeCharts() : h.slice(0, i) + homeCharts() + h.slice(i); };
// rankings da página inicial respeitam a posição escolhida no gráfico
const _lideres = lideres;
lideres = function (campo, n = 5) { return UI.hPos ? _lideres(campo, 999).filter(x => x.a.posicao === UI.hPos).slice(0, n) : _lideres(campo, n); };

dmOn('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'h-chart') { UI.hChart = t.dataset.v; render(); }
  if (t.dataset.act === 'h-pos') { UI.hPos = !t.dataset.v || UI.hPos === t.dataset.v ? null : t.dataset.v; render(); }
  if (t.dataset.act === 'h-test') { const k = t.dataset.v; if (UI.hTests.has(k)) { if (UI.hTests.size > 1) UI.hTests.delete(k); } else UI.hTests.add(k); render(); }
});
dmOn('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.islice[data-act]')) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });

/* ================= MONITORAMENTO · BEM-ESTAR E PERCEPÇÃO DE ESFORÇO ================= */
IC.clip = I('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h4"/>');
IC.smile = I('<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>');
IC.gauge = I('<path d="M12 14l4-4"/><path d="M3.3 16a9 9 0 1 1 17.4 0"/>');
const MON_TABS = [['mon-be', 'Bem-estar'], ['mon-pse', 'Percepção de esforço (PSE)']];
MON_TABS.forEach(([k, n]) => TITLES[k] = ['Monitoramento', n]);
NAV.push({ k: 'mon', n: 'Monitoramento', ic: IC.clip, sub: MON_TABS });
UI.monDia = todayISO(); UI.pseDia = todayISO();

/* ---------- bem-estar (modelo de Hooper/McLean, escala 1–5, maior = melhor) ---------- */
const BE_ITENS = {
  fadiga: { n: 'Fadiga', esc: ['Muito cansado', 'Cansado', 'Normal', 'Descansado', 'Muito descansado'] },
  sono: { n: 'Qualidade do sono', esc: ['Péssima', 'Ruim', 'Normal', 'Boa', 'Muito boa'] },
  dor: { n: 'Dor muscular', esc: ['Muita dor', 'Dor', 'Normal', 'Pouca dor', 'Sem dor'] },
  estresse: { n: 'Estresse', esc: ['Muito estressado', 'Estressado', 'Normal', 'Tranquilo', 'Muito tranquilo'] },
  humor: { n: 'Humor', esc: ['Muito irritado', 'Irritado', 'Normal', 'Bem-humorado', 'Muito bem-humorado'] }
};
const BEK = Object.keys(BE_ITENS);
const ECOL = ['#e0342b', '#f39324', '#f6c21c', '#7bd08f', '#1b8a4a'];
const beTotal = r => BEK.reduce((s, k) => s + (+r[k] || 0), 0);
const beDe = id => (S.bemestar || []).filter(r => r.atletaId === id).sort((a, b) => a.data.localeCompare(b.data));
function beBase(id, ate) { const l = beDe(id).filter(r => r.data < ate && r.data >= addDays(ate, -28)).map(beTotal); if (l.length < 3) return null; const m = mean(l), sd = Math.sqrt(l.reduce((s, v) => s + (v - m) ** 2, 0) / (l.length - 1)) || 1; return { m, sd }; }
function beStatus(r) { const t = beTotal(r), b = beBase(r.atletaId, r.data), z = b ? (t - b.m) / b.sd : null; const baixo = BEK.filter(k => +r[k] <= 2); if (t <= 12 || (z != null && z <= -1.5) || baixo.length >= 2) return { s: 'bad', n: 'Alerta', z, baixo }; if (t <= 15 || (z != null && z <= -1) || baixo.length) return { s: 'warn', n: 'Atenção', z, baixo }; return { s: 'ok', n: 'Bem', z, baixo }; }
const stTag = st => `<span class="sfc ${st.s}">${st.n}</span>`;
const escCel = v => v ? `<span class="esc" style="background:${ECOL[v - 1]}">${v}</span>` : '<span class="muted">—</span>';

/* ---------- percepção de esforço (Foster: carga = PSE × minutos) ---------- */
const PSE_ESC = ['Repouso', 'Muito, muito leve', 'Muito leve', 'Moderado', 'Pouco intenso', 'Intenso', 'Intenso +', 'Muito intenso', 'Muito intenso +', 'Máximo -', 'Máximo'];
const pseDe = id => (S.pse || []).filter(r => r.atletaId === id).sort((a, b) => a.data.localeCompare(b.data));
const carga = r => (+r.pse || 0) * (+r.duracao || 0);
function cargas(id, ate) {
  const l = pseDe(id).filter(r => r.data <= ate);
  const sum = (a, b) => l.filter(r => r.data > a && r.data <= b).reduce((s, r) => s + carga(r), 0);
  const ag = sum(addDays(ate, -7), ate), cr4 = sum(addDays(ate, -28), ate) / 4;
  const dias = Array.from({ length: 7 }, (_, i) => { const d = addDays(ate, -i); return l.filter(r => r.data === d).reduce((s, r) => s + carga(r), 0); });
  const md = mean(dias), sd = Math.sqrt(dias.reduce((s, v) => s + (v - md) ** 2, 0) / 6);
  const mono = sd ? md / sd : null;
  return { ag, cr4, acwr: cr4 ? ag / cr4 : null, mono, strain: mono != null ? ag * mono : null, n28: l.filter(r => r.data > addDays(ate, -28)).length };
}
function acwrSt(v) { if (v == null) return { s: 'neu', n: 'Sem base' }; if (v > 1.5) return { s: 'bad', n: 'Risco alto' }; if (v > 1.3) return { s: 'warn', n: 'Atenção' }; if (v < 0.8) return { s: 'warn', n: 'Carga baixa' }; return { s: 'ok', n: 'Ideal' }; }

/* ---------- telas ---------- */
function vMon() {
  const body = S.view === 'mon-pse' ? fPse : fBe;
  const h = header({ title: S.view === 'mon-pse' ? 'PERCEPÇÃO SUBJETIVA DE ESFORÇO' : 'QUESTIONÁRIO DE BEM-ESTAR', sub: 'MONITORAMENTO · CARGA E RECUPERAÇÃO', items: hdrItems() });
  if (PRINT) return h + '<div style="height:16px"></div>' + body();
  return h + `<nav class="rtabs">${MON_TABS.map(([k, n]) => `<button data-go="${k}" class="${S.view === k ? 'on' : ''}">${n}</button>`).join('')}</nav>` + noData() + body();
}
function diaNav(id, d) { return `<div class="dnav"><button class="btn sm" data-act="${id}" data-d="${addDays(d, -1)}" aria-label="Dia anterior">‹</button><input type="date" id="${id}In" value="${d}" max="${todayISO()}" class="search" style="min-width:0"><button class="btn sm" data-act="${id}" data-d="${addDays(d, 1)}" ${d >= todayISO() ? 'disabled' : ''} aria-label="Próximo dia">›</button><button class="btn sm" data-act="${id}" data-d="${todayISO()}">Hoje</button></div>`; }
function fBe() {
  const ats = atletasCat(), d = UI.monDia, ids = new Set(ats.map(a => a.id));
  const dia = (S.bemestar || []).filter(r => r.data === d && ids.has(r.atletaId));
  const rows = dia.map(r => ({ r, a: atl(r.atletaId), t: beTotal(r), st: beStatus(r) })).filter(x => x.a).sort((x, y) => x.t - y.t);
  const nao = ats.filter(a => !dia.some(r => r.atletaId === a.id));
  const dias14 = Array.from({ length: 14 }, (_, i) => addDays(d, i - 13));
  const serie = BEK.map((k, i) => ({ n: BE_ITENS[k].n, c: ['#e0342b', '#2f6fd6', '#f39324', '#7a3fd1', '#1b8a4a'][i], vals: dias14.map(x => { const l = (S.bemestar || []).filter(r => r.data === x && ids.has(r.atletaId)); return l.length ? Math.round(mean(l.map(r => +r[k])) * 10) / 10 : null; }) }));
  const tot14 = dias14.map(x => { const l = (S.bemestar || []).filter(r => r.data === x && ids.has(r.atletaId)); return l.length ? Math.round(mean(l.map(beTotal)) * 10) / 10 : null; });
  const cnt = { ok: rows.filter(x => x.st.s === 'ok').length, warn: rows.filter(x => x.st.s === 'warn').length, bad: rows.filter(x => x.st.s === 'bad').length };
  const itemMed = BEK.map(k => ({ l: BE_ITENS[k].n, v: mean(rows.map(x => +x.r[k])) || 0 }));
  return `<div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><b style="font-family:var(--fc);font-size:18px;text-transform:uppercase">Dia</b>${diaNav('be-dia', d)}<span class="muted" style="font-size:12.5px">Escala de 1 a 5 em cada item (5 = melhor). Total de 5 a 25.</span><span style="flex:1"></span><button class="btn pri" data-act="be-lancar">${IC.plus} Lançar bem-estar</button></div></div>
  <div class="kpis k5">
    ${kpi('users', 'Responderam', `${rows.length}<small>/ ${ats.length}</small>`, pct(rows.length, ats.length) + ' do elenco · ' + fmtD(d))}
    ${kpi('smile', 'Bem-estar médio', nfx(mean(rows.map(x => x.t)), 1, '<small>/ 25</small>'), 'quanto maior, melhor')}
    ${kpi('cross', 'Em alerta', cnt.bad, `${cnt.warn} em atenção`, 'red')}
    ${kpi('clock', 'Horas de sono', nfx(mean(rows.map(x => +x.r.horasSono).filter(Boolean)), 1, '<small>h</small>'), 'média do grupo')}
    ${kpi('med', 'Dor muscular', nfx(mean(rows.map(x => +x.r.dor)), 1, '<small>/ 5</small>'), rows.filter(x => +x.r.dor <= 2).length + ' com dor alta', 'gold')}
  </div>
  <div class="row r21" style="align-items:start">
    ${panel(`Respostas de ${fmtD(d)}`, (rows.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th>${BEK.map(k => `<th>${BE_ITENS[k].n.replace('Qualidade do ', '')}</th>`).join('')}<th>Sono (h)</th><th>Total</th><th>vs. habitual</th><th>Situação</th></tr></thead><tbody>${rows.map(x => `<tr><td class="l"><div class="athcell">${fotoBox(x.a, 'mini')}<div><b>${esc(x.a.apelido || x.a.nome)}${subTag(x.a)}</b><small>${esc(POSN[x.a.posicao] || '')}</small></div></div></td>${BEK.map(k => `<td data-tip="${esc(BE_ITENS[k].n)}: ${esc(BE_ITENS[k].esc[(+x.r[k] || 1) - 1])}">${escCel(+x.r[k])}</td>`).join('')}<td>${x.r.horasSono ? nf(x.r.horasSono, 1) : '—'}</td><td><b style="font-size:16px">${x.t}</b></td><td>${x.st.z != null ? `<b class="${x.st.z >= 0 ? 'down' : 'up'}">${x.st.z >= 0 ? '+' : '−'}${nf(Math.abs(x.st.z), 1)} DP</b>` : '<span class="muted">sem base</span>'}</td><td>${stTag(x.st)}${x.r.obs ? `<br><small class="muted">${esc(x.r.obs)}</small>` : ''}</td></tr>`).join('')}</tbody></table></div>` : miniEmpty('Nenhuma resposta neste dia', 'Clique em “Lançar bem-estar”.')) + (nao.length && rows.length ? `<div class="pb pend"><b>${IC.cross} Não responderam (${nao.length}):</b> ${nao.map(a => `<span class="bchip">${esc(a.apelido || a.nome)}</span>`).join('')}</div>` : rows.length ? `<div class="pb pend ok"><b>${IC.check} Todo o elenco respondeu.</b></div>` : ''), { np: true })}
    <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
      ${panel('Situação do grupo', `<div class="donut-wrap">${iDonut([{ l: 'Bem', v: cnt.ok, c: '#1b8a4a' }, { l: 'Atenção', v: cnt.warn, c: '#f6c21c' }, { l: 'Alerta', v: cnt.bad, c: '#e0342b' }], rows.length, 'RESPOSTAS', 140)}${legend([{ l: 'Bem', v: cnt.ok, c: '#1b8a4a' }, { l: 'Atenção', v: cnt.warn, c: '#f6c21c' }, { l: 'Alerta', v: cnt.bad, c: '#e0342b' }])}</div>`)}
      ${panel('Média por item', dist(itemMed.map((x, i) => ({ l: x.l, v: x.v, t: x.v ? nf(x.v, 1) : '—', c: ECOL[Math.max(0, Math.round(x.v) - 1)] }))))}
    </div>
  </div>
  <div class="row r2">
    ${panel('Bem-estar do grupo · últimos 14 dias', iLine(dias14.map(fmtDs), [{ n: 'Total médio', c: '#1b8a4a', vals: tot14 }], { w: 600, h: 230, lo: 5, hi: 25, area: true }))}
    ${panel('Itens do questionário · últimos 14 dias', iLine(dias14.map(fmtDs), serie, { w: 600, h: 230, lo: 1, hi: 5 }) + `<div class="legend-status" style="justify-content:center">${serie.map(s => `<span><span class="sq" style="background:${s.c}"></span>${s.n}</span>`).join('')}</div>`)}
  </div>
  <p class="muted" style="font-size:12px">Questionário de bem-estar (Hooper & Mackinnon; McLean et al., 2010). “vs. habitual” compara o total do dia com a média do próprio atleta nos últimos 28 dias, em desvios-padrão (DP). Alerta: total ≤ 12, queda ≥ 1,5 DP ou dois itens com nota ≤ 2.</p>`;
}
function fPse() {
  const ats = atletasCat(), d = UI.pseDia, ids = new Set(ats.map(a => a.id));
  const dia = (S.pse || []).filter(r => r.data === d && ids.has(r.atletaId));
  const rows = ats.map(a => ({ a, s: dia.filter(r => r.atletaId === a.id), c: cargas(a.id, d) })).filter(x => x.s.length || x.c.n28);
  rows.sort((x, y) => (y.c.acwr ?? 0) - (x.c.acwr ?? 0));
  const dias28 = Array.from({ length: 28 }, (_, i) => addDays(d, i - 27));
  const tot = dias28.map(x => { const l = (S.pse || []).filter(r => r.data === x && ids.has(r.atletaId)); return l.length ? Math.round(mean(l.map(carga))) : 0; });
  const acw = dias28.map(x => { const v = mean(ats.map(a => cargas(a.id, x).acwr)); return v == null ? null : Math.round(v * 100) / 100; });
  const risco = rows.filter(x => x.c.acwr != null && (x.c.acwr > 1.5 || x.c.acwr < 0.8)).length;
  const nao = ats.filter(a => !dia.some(r => r.atletaId === a.id));
  return `<div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><b style="font-family:var(--fc);font-size:18px;text-transform:uppercase">Dia</b>${diaNav('pse-dia', d)}<span class="muted" style="font-size:12.5px">PSE da sessão (escala CR-10 de Borg) respondida 30 min após o treino. Carga = PSE × minutos (UA).</span><span style="flex:1"></span><button class="btn pri" data-act="pse-lancar">${IC.plus} Lançar PSE</button></div></div>
  <div class="kpis k5">
    ${kpi('users', 'Responderam', `${new Set(dia.map(r => r.atletaId)).size}<small>/ ${ats.length}</small>`, fmtD(d))}
    ${kpi('gauge', 'PSE média do dia', nfx(mean(dia.map(r => +r.pse)), 1, '<small>/ 10</small>'), dia.length ? PSE_ESC[Math.round(mean(dia.map(r => +r.pse)))] : 'sem respostas')}
    ${kpi('bars', 'Carga média do dia', nfx(mean(dia.map(carga)), 0, '<small>UA</small>'), 'PSE × minutos')}
    ${kpi('trend', 'ACWR médio', nfx(mean(rows.map(x => x.c.acwr)), 2), 'carga aguda ÷ crônica (zona ideal 0,8–1,3)')}
    ${kpi('cross', 'Fora da zona', risco, 'atletas com ACWR < 0,8 ou > 1,5', 'red')}
  </div>
  <div class="row" style="grid-template-columns:1fr">${panel('Carga do grupo · últimos 28 dias', iBars(dias28.map(fmtDs), [{ n: 'Carga média (UA)', c: '#2f6fd6', vals: tot }], { w: 1100, h: 250, line: { n: 'ACWR médio', c: '#f39324', vals: acw, fmt: v => nf(v, 2) }, fmt: v => Math.round(v) }) + '<div class="legend-status" style="justify-content:center"><span><span class="sq" style="background:#2f6fd6"></span>Carga média por atleta (UA)</span><span><span class="sq" style="background:#f39324"></span>ACWR médio (escala própria)</span></div>')}</div>
  <div class="row r21" style="align-items:start">
    ${panel('Carga por atleta', rows.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>PSE do dia</th><th>Minutos</th><th>Carga do dia</th><th>Carga 7 dias</th><th>Crônica (média semanal 28 d)</th><th>ACWR</th><th>Monotonia</th><th>Strain</th><th>Situação</th></tr></thead><tbody>${rows.map(x => { const st = acwrSt(x.c.acwr); const cd = x.s.reduce((s, r) => s + carga(r), 0); return `<tr><td class="l"><div class="athcell">${fotoBox(x.a, 'mini')}<div><b>${esc(x.a.apelido || x.a.nome)}${subTag(x.a)}</b><small>${esc(POSN[x.a.posicao] || '')}</small></div></div></td><td>${x.s.length ? x.s.map(r => `<span class="esc" style="background:${r.pse >= 8 ? '#e0342b' : r.pse >= 6 ? '#f39324' : r.pse >= 4 ? '#f6c21c' : '#1b8a4a'}" data-tip="${esc(r.sessao || 'Sessão')}: ${PSE_ESC[r.pse]}">${r.pse}</span>`).join(' ') : '—'}</td><td>${x.s.length ? x.s.reduce((s, r) => s + (+r.duracao || 0), 0) : '—'}</td><td><b>${cd || '—'}</b></td><td>${Math.round(x.c.ag)}</td><td>${Math.round(x.c.cr4)}</td><td><b>${x.c.acwr != null ? nf(x.c.acwr, 2) : '—'}</b></td><td>${x.c.mono != null ? nf(x.c.mono, 2) : '—'}</td><td>${x.c.strain != null ? Math.round(x.c.strain) : '—'}</td><td><span class="sfc ${st.s}">${st.n}</span></td></tr>`; }).join('')}</tbody></table></div>${nao.length && dia.length ? `<div class="pb pend"><b>${IC.cross} Sem PSE em ${fmtD(d)} (${nao.length}):</b> ${nao.map(a => `<span class="bchip">${esc(a.apelido || a.nome)}</span>`).join('')}</div>` : ''}` : miniEmpty('Sem registros de PSE', 'Clique em “Lançar PSE”.'), { np: !!rows.length })}
    ${panel('Como interpretar', `<div class="det-row"><span>Carga (UA)</span><div>PSE da sessão × duração em minutos (Foster, 2001)</div></div><div class="det-row"><span>ACWR</span><div>Carga dos últimos 7 dias ÷ média semanal dos últimos 28 dias</div></div><div class="det-row"><span><span class="sfc ok">0,8 – 1,3</span></span><div>Zona ideal de progressão</div></div><div class="det-row"><span><span class="sfc warn">&gt; 1,3</span></span><div>Atenção: aumento rápido de carga</div></div><div class="det-row"><span><span class="sfc bad">&gt; 1,5</span></span><div>Risco alto de lesão</div></div><div class="det-row"><span>Monotonia</span><div>Média diária ÷ desvio-padrão da semana; acima de 2 indica pouca variação</div></div><div class="det-row"><span>Strain</span><div>Carga semanal × monotonia</div></div>
      <p style="margin:10px 0 4px;font-size:12.5px"><b>Escala CR-10</b></p><div class="pscale">${PSE_ESC.map((n, i) => `<span style="background:${i >= 8 ? '#e0342b' : i >= 6 ? '#f39324' : i >= 4 ? '#f6c21c' : '#1b8a4a'}" data-tip="${i} · ${n}">${i}</span>`).join('')}</div>`)}
  </div>`;
}

/* ---------- lançamento em lote ---------- */
function formBe() {
  const cat = F.categoria !== 'Todas' ? F.categoria : (S.atletas[0]?.categoria || 'Sub-15'); const d = UI.monDia;
  openModal(mh('Lançar questionário de bem-estar') + `<form id="fBe" novalidate><div class="mb">
    <div class="form" style="grid-template-columns:repeat(4,1fr)"><div class="f"><label for="beD">Data *</label><input id="beD" type="date" value="${d}" max="${todayISO()}"></div><div class="f"><label for="beC">Categoria</label><select id="beC">${opts(Object.keys(GRUPOS), cat)}</select></div><div class="f s2"><span class="hint">Notas de 1 (pior) a 5 (melhor). Deixe a linha em branco para quem não respondeu.</span></div></div>
    <div class="tbl-wrap" style="max-height:460px;overflow:auto;border:1px solid var(--line);border-radius:8px"><table class="t hidin"><thead><tr><th class="l">Atleta</th>${BEK.map(k => `<th>${BE_ITENS[k].n.replace('Qualidade do ', '')}</th>`).join('')}<th>Sono (h)</th><th>Obs.</th><th>Total</th></tr></thead><tbody id="beRows"></tbody></table></div>
  </div><div class="mf"><span class="msg" id="beErr"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar respostas</button></div></form>`, true);
  const fill = () => { const dd = $('#beD').value; const as = S.atletas.filter(a => a.categoria === $('#beC').value).sort((a, b) => a.nome.localeCompare(b.nome)); $('#beRows').innerHTML = as.map(a => { const r = (S.bemestar || []).find(x => x.atletaId === a.id && x.data === dd) || {}; return `<tr data-a="${a.id}"><td class="l">${athCell(a)}</td>${BEK.map(k => `<td><select data-f="${k}" aria-label="${BE_ITENS[k].n} de ${esc(a.nome)}"><option value="">–</option>${BE_ITENS[k].esc.map((e, i) => `<option value="${i + 1}" ${+r[k] === i + 1 ? 'selected' : ''}>${i + 1} · ${e}</option>`).join('')}</select></td>`).join('')}<td><input type="number" step="0.5" min="0" max="14" data-f="horasSono" value="${r.horasSono ?? ''}"></td><td><input data-f="obs" value="${esc(r.obs || '')}" style="width:120px"></td><td class="bt">—</td></tr>`; }).join(''); calc(); };
  const calc = () => $$('#beRows tr').forEach(tr => { const v = BEK.map(k => +tr.querySelector(`[data-f=${k}]`).value || 0); tr.querySelector('.bt').innerHTML = v.every(Boolean) ? `<b>${v.reduce((a, b) => a + b, 0)}</b>` : '—'; tr.querySelectorAll('select').forEach(s => s.style.background = s.value ? ECOL[s.value - 1] + '33' : ''); });
  $('#beC').onchange = fill; $('#beD').onchange = fill; $('#fBe').addEventListener('change', calc); fill();
  $('#fBe').onsubmit = async e => {
    e.preventDefault(); const dd = $('#beD').value;
    const docs = $$('#beRows tr').map(tr => { const g = f => tr.querySelector(`[data-f=${f}]`).value; if (!BEK.every(k => g(k))) return null; const o = { id: `be_${tr.dataset.a}_${dd}`, atletaId: tr.dataset.a, data: dd, horasSono: g('horasSono') ? +g('horasSono') : null, obs: g('obs').trim() }; BEK.forEach(k => o[k] = +g(k)); return o; }).filter(Boolean);
    if (!docs.length) return $('#beErr').textContent = 'Preencha os 5 itens de pelo menos um atleta.';
    await saveMany('bemestar', docs); UI.monDia = dd; closeModal(); render(); toast(`${docs.length} resposta(s) salva(s)`);
  };
}
function formPse() {
  const cat = F.categoria !== 'Todas' ? F.categoria : (S.atletas[0]?.categoria || 'Sub-15'); const d = UI.pseDia;
  openModal(mh('Lançar percepção de esforço (PSE)') + `<form id="fPs" novalidate><div class="mb">
    <div class="form" style="grid-template-columns:repeat(5,1fr)"><div class="f"><label for="psD">Data *</label><input id="psD" type="date" value="${d}" max="${todayISO()}"></div><div class="f"><label for="psC">Categoria</label><select id="psC">${opts(Object.keys(GRUPOS), cat)}</select></div><div class="f"><label for="psS">Sessão</label><select id="psS">${opts(['Treino', 'Jogo', 'Treino físico', 'Recuperação'], 'Treino')}</select></div><div class="f"><label for="psM">Duração padrão (min)</label><input id="psM" type="number" min="5" max="240" value="90"></div><div class="f"><span class="hint" id="psHint">PSE de 0 a 10. Em jogos, a duração vem dos minutos da Minutagem.</span></div></div>
    <div class="tbl-wrap" style="max-height:460px;overflow:auto;border:1px solid var(--line);border-radius:8px"><table class="t hidin"><thead><tr><th class="l">Atleta</th><th>PSE (0–10)</th><th>Minutos</th><th>Carga (UA)</th></tr></thead><tbody id="psRows"></tbody></table></div>
  </div><div class="mf"><span class="msg" id="psErr"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar PSE</button></div></form>`, true);
  const jogoMin = (aid, dd) => { const j = (window.MIN?.S.jogos || []).find(x => x.data === dd && (x.relacionados || []).some(r => r.atletaId === aid)); const r = j && j.relacionados.find(x => x.atletaId === aid); return r ? +r.min || 0 : null; };
  const fill = () => { const dd = $('#psD').value, ses = $('#psS').value, dur = $('#psM').value; const as = S.atletas.filter(a => a.categoria === $('#psC').value).sort((a, b) => a.nome.localeCompare(b.nome)); $('#psRows').innerHTML = as.map(a => { const r = (S.pse || []).find(x => x.atletaId === a.id && x.data === dd && (x.sessao || 'Treino') === ses) || {}; const jm = ses === 'Jogo' ? jogoMin(a.id, dd) : null; return `<tr data-a="${a.id}"><td class="l">${athCell(a)}</td><td><select data-f="pse"><option value="">–</option>${PSE_ESC.map((e, i) => `<option value="${i}" ${r.pse === i ? 'selected' : ''}>${i} · ${e}</option>`).join('')}</select></td><td><input type="number" data-f="duracao" min="0" max="240" value="${r.duracao ?? (jm ?? dur)}"></td><td class="pc">—</td></tr>`; }).join(''); calc(); };
  const calc = () => $$('#psRows tr').forEach(tr => { const p = tr.querySelector('[data-f=pse]').value, m = +tr.querySelector('[data-f=duracao]').value || 0; tr.querySelector('.pc').innerHTML = p !== '' ? `<b>${+p * m}</b>` : '—'; });
  ['#psC', '#psD', '#psS'].forEach(s => $(s).onchange = fill); $('#psM').oninput = () => $$('#psRows [data-f=duracao]').forEach(i => i.value = $('#psM').value); $('#fPs').addEventListener('input', calc); $('#fPs').addEventListener('change', calc); fill();
  $('#fPs').onsubmit = async e => {
    e.preventDefault(); const dd = $('#psD').value, ses = $('#psS').value;
    const docs = $$('#psRows tr').map(tr => { const p = tr.querySelector('[data-f=pse]').value; if (p === '') return null; return { id: `pse_${tr.dataset.a}_${dd}_${ses.replace(/\s/g, '')}`, atletaId: tr.dataset.a, data: dd, sessao: ses, pse: +p, duracao: +tr.querySelector('[data-f=duracao]').value || 0 }; }).filter(Boolean);
    if (!docs.length) return $('#psErr').textContent = 'Informe a PSE de pelo menos um atleta.';
    await saveMany('pse', docs); UI.pseDia = dd; closeModal(); render(); toast(`${docs.length} registro(s) de PSE salvo(s)`);
  };
}

/* ---------- carga de treino na ficha passa a usar a PSE quando houver ---------- */
const _statusFisico = statusFisico;
statusFisico = function (a) {
  const r = _statusFisico(a); const c = cargas(a.id, todayISO());
  if (c.n28 >= 3 && c.acwr != null) { const st = acwrSt(c.acwr); r.carga = `${st.n === 'Ideal' ? 'Adequada' : st.n} · ACWR ${nf(c.acwr, 2)}`; r.cc = st.s; }
  const b = beDe(a.id).slice(-1)[0]; if (b && dayDiff(b.data, todayISO()) <= 3) { const st = beStatus(b); r.bem = { txt: `${beTotal(b)}/25 · ${st.n}`, s: st.s }; }
  return r;
};

dmOn('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'be-dia') { UI.monDia = t.dataset.d > todayISO() ? todayISO() : t.dataset.d; render(); }
  if (t.dataset.act === 'pse-dia') { UI.pseDia = t.dataset.d > todayISO() ? todayISO() : t.dataset.d; render(); }
  if (t.dataset.act === 'be-lancar') formBe();
  if (t.dataset.act === 'pse-lancar') formPse();
});
dmOn('change', e => { if (e.target.id === 'be-diaIn' && e.target.value) { UI.monDia = e.target.value; render(); } if (e.target.id === 'pse-diaIn' && e.target.value) { UI.pseDia = e.target.value; render(); } });

/* ================= BEM-ESTAR DIÁRIO (modelo do Forms do Porto Vitória) ================= */
MON_TABS.length = 0;
MON_TABS.push(['mon-be', 'Bem-estar · Dashboard'], ['mon-be-hist', 'Bem-estar · Histórico'], ['mon-be-rel', 'Bem-estar · Relatório do dia'], ['mon-pse', 'Percepção de esforço (PSE)']);
MON_TABS.forEach(([k, n]) => TITLES[k] = ['Monitoramento', n]);
const BEF = {
  treinaHoje: ['Sim', 'Não'],
  dor: ['Normal', 'Dolorido', 'Muito dolorido'],
  fadiga: ['Muito descansado', 'Descansado', 'Normal', 'Mais cansado que o normal', 'Sempre cansado'],
  recuperacao: ['Totalmente recuperado', 'Recuperado', 'Normal', 'Pouca recuperação', 'Não recuperado'],
  sono: ['Muito bom', 'Bom', 'Normal', 'Dificuldade em adormecer', 'Sono agitado / ruim'],
  estresse: ['Muito relaxado', 'Relaxado', 'Normal', 'Moderado', 'Alto', 'Muito alto'],
  humor: ['Muito bem humorado', 'Geralmente com bom humor', 'Normal', 'Irritado / baixo', 'Muito irritado']
};
const nrmB = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const numB = v => { if (v == null || v === '') return null; const m = String(v).replace(',', '.').match(/-?\d+(?:\.\d+)?/); return m ? +m[0] : null; };
// mesma conversão do sistema de Bem-Estar (texto do Forms → nota 0–10, usada só para cor e status)
function beScore(text, type) {
  const t = nrmB(text); if (!t) return null;
  if (type === 'sono') { if (/muito bom|otimo|excelente/.test(t)) return 9; if (/^bom/.test(t)) return 8; if (/^normal/.test(t)) return 6; if (/dificuldade|agitado|ruim|insonia/.test(t)) return 4; }
  if (type === 'fad') { if (/muito descans/.test(t)) return 9; if (/^descansado/.test(t)) return 8; if (/^normal/.test(t)) return 7; if (/mais cansado/.test(t)) return 4; if (/sempre cansado/.test(t)) return 2; }
  if (type === 'rec') { if (/totalmente recuper/.test(t)) return 10; if (/^recuperado/.test(t)) return 8; if (/^normal/.test(t)) return 5; if (/pouca recuper/.test(t)) return 3; if (/nao recuper|nenhuma recuper/.test(t)) return 0; }
  if (type === 'est') { if (/relaxado|normal|muito baixo/.test(t)) return 8; if (/moderado|medio/.test(t)) return 6; if (/muito alto/.test(t)) return 1; if (/alto/.test(t)) return 3; }
  if (type === 'hum') { if (/muito bem|excelente/.test(t)) return 9; if (/bem humor|bom humor/.test(t)) return 8; if (/normal/.test(t)) return 6; if (/baixo|ruim|mal|irritad/.test(t)) return 3; }
  return numB(t);
}
const temDor = r => { const a = nrmB(r?.dor), sc = numB(r?.escalaDor); return a.includes('dolor') || a === 'sim' || (sc != null && sc > 0); };
function beSt(r) {
  if (!r) return { st: 'NÃO RESPONDEU', flags: [], sc: {} };
  const sc = { s: beScore(r.sono, 'sono'), fad: beScore(r.fadiga, 'fad'), rec: beScore(r.recuperacao, 'rec'), est: beScore(r.estresse, 'est'), hum: beScore(r.humor, 'hum'), u: numB(r.urina), dor: temDor(r) ? numB(r.escalaDor) : null };
  const f = [];
  if (temDor(r)) f.push('dor'); if (sc.s != null && sc.s <= 4) f.push('sono'); if (sc.rec != null && sc.rec <= 3) f.push('recuperação'); if (sc.est != null && sc.est <= 3) f.push('estresse'); if (sc.fad != null && sc.fad <= 4) f.push('fadiga'); if (sc.u != null && sc.u >= 6) f.push('hidratação');
  const st = (sc.dor != null && sc.dor >= 7) || f.length >= 2 ? 'INTERVENÇÃO' : (f.length === 1 || (sc.s != null && sc.s <= 6) || (sc.rec != null && sc.rec <= 5)) ? 'ATENÇÃO' : 'NORMAL';
  const vals = [sc.s, sc.fad, sc.rec, sc.est, sc.hum].filter(v => v != null);
  return { st, flags: f, sc, media: vals.length ? mean(vals) : null };
}
const FLAGN = { dor: 'Dor/desconforto', sono: 'Sono ruim', recuperação: 'Recuperação baixa', estresse: 'Estresse elevado', fadiga: 'Fadiga elevada', hidratação: 'Hidratação inadequada' };
const STC = { NORMAL: ['s-nor', '#15933d'], 'ATENÇÃO': ['s-ate', '#f0b30c'], 'INTERVENÇÃO': ['s-int', '#e62925'], 'NÃO RESPONDEU': ['s-nr', '#aab5af'] };
const stChipB = st => `<span class="bst ${STC[st][0]}">${st}</span>`;
const clsB = (txt, type) => { const v = String(txt ?? '').trim(); if (!v) return '<span class="muted">—</span>'; const n = beScore(v, type); return `<span class="bcls ${n == null ? 'mid' : n >= 7 ? 'good' : n >= 4 ? 'mid' : 'bad'}">${esc(v)}</span>`; };
const hidB = u => { const n = numB(u); if (n == null) return '<span class="muted">—</span>'; const c = n <= 3 ? ['boa', 'Boa'] : n <= 5 ? ['ate', 'Atenção'] : ['ina', 'Inadequada']; return `<span class="bhid ${c[0]}">💧 ${c[1]}</span>`; };
const URINAB = ['#fffef1', '#fffbd3', '#fff2a2', '#f5d76e', '#e6b94f', '#c98c2c', '#a9661f', '#75421d'];
const uriB = u => { const n = numB(u); if (n == null) return '<span class="muted">—</span>'; const c = Math.max(1, Math.min(8, Math.round(n))); return `<span class="buri"><i style="background:${URINAB[c - 1]}"></i><b>${c}</b></span>`; };
const dorB = r => { const n = temDor(r) ? numB(r.escalaDor) : null; if (n == null) return temDor(r) ? `<span class="bcls mid">${esc(r.dor || 'Sim')}</span>${r.localDor ? `<small class="bloc">${esc(r.localDor)}</small>` : ''}` : '<span class="bpain p0">0</span>'; const c = n <= 2 ? 'p0' : n <= 5 ? 'p1' : n <= 7 ? 'p2' : 'p3'; return `<span class="bpain ${c}">${n}</span>${r.localDor ? `<small class="bloc">${esc(r.localDor)}</small>` : ''}`; };
const obsB = (r, s) => { if (!r) return '<span class="muted">Aguardando resposta</span>'; if (r.observacao) return esc(r.observacao); const p = s.flags.map(x => FLAGN[x]); if (r.localDor && temDor(r)) p.push('Local: ' + esc(r.localDor)); if (nrmB(r.treinaHoje) === 'nao') p.push('Não vai treinar/jogar' + (r.motivo ? ': ' + esc(r.motivo) : '')); return p.join(' • ') || 'Condições gerais adequadas.'; };
const recNum = r => { const n = beScore(r?.recuperacao, 'rec'); return n == null ? '<span class="muted">—</span>' : `<span class="bnum ${n >= 7 ? 'good' : n >= 4 ? 'mid' : 'bad'}">${n}</span>`; };
UI.beFiltro = { atleta: '', treina: '', busca: '' };

function beDia(d) {
  const ats = atletasCat().sort((a, b) => POS.indexOf(a.posicao) - POS.indexOf(b.posicao) || a.nome.localeCompare(b.nome));
  const map = new Map((S.bemestar || []).filter(r => r.data === d && r.sono !== undefined).map(r => [r.atletaId, r]));
  return ats.map(a => ({ a, r: map.get(a.id) || null, s: beSt(map.get(a.id) || null) }));
}
function beFiltrar(rows) { const f = UI.beFiltro; return rows.filter(x => (!f.atleta || x.a.id === f.atleta) && (!f.treina || (x.r && nrmB(x.r.treinaHoje) === nrmB(f.treina))) && (!f.busca || nrmB(x.a.nome).includes(nrmB(f.busca)))); }
function beTabela(rows, ini = 0) {
  return `<table class="t btab"><thead><tr><th>#</th><th class="l">Atleta</th><th>Posição</th><th>Sono</th><th>Hidratação</th><th>Dor /<br>desconforto</th><th>Fadiga</th><th>Estresse</th><th>Recuperação<br><small>(0–10)</small></th><th>Humor</th><th>Cor da<br>urina</th><th>Status</th><th class="l">Observação</th></tr></thead><tbody>${rows.map((x, i) => `<tr class="${x.r ? '' : 'nr'}"><td>${ini + i + 1}</td><td class="l"><div class="athcell">${fotoBox(x.a, 'mini')}<div><b>${esc(x.a.apelido || x.a.nome)}</b><small>${x.a.numero ? '#' + esc(x.a.numero) : ''}</small></div></div></td><td><b>${esc(x.a.posicao)}</b></td>${x.r ? `<td>${clsB(x.r.sono, 'sono')}</td><td>${hidB(x.r.urina)}</td><td>${dorB(x.r)}</td><td>${clsB(x.r.fadiga, 'fad')}</td><td>${clsB(x.r.estresse, 'est')}</td><td>${recNum(x.r)}</td><td>${clsB(x.r.humor, 'hum')}</td><td>${uriB(x.r.urina)}</td>` : '<td>—</td>'.repeat(8)}<td>${stChipB(x.s.st)}</td><td class="l bobs">${obsB(x.r, x.s)}</td></tr>`).join('') || '<tr><td colspan="13" class="muted">Nenhum atleta com esses filtros.</td></tr>'}</tbody></table>`;
}
function beAlertas(rows, compact) {
  const resp = rows.filter(x => x.r), lst = st => resp.filter(x => x.s.st === st);
  const it = x => `<div class="bai"><b>${esc(x.a.apelido || x.a.nome)}</b>${x.s.flags.map(f => `<span>– ${FLAGN[f]}</span>`).join('')}</div>`;
  const nr = rows.filter(x => !x.r), dor = resp.filter(x => temDor(x.r)), nt = resp.filter(x => nrmB(x.r.treinaHoje) === 'nao');
  const lim = compact ? 8 : 40, more = (l) => l.length > lim ? `<div class="bai muted">+ ${l.length - lim} atleta(s)</div>` : '';
  return `<div class="balert red"><h4>Intervenção (${lst('INTERVENÇÃO').length})</h4>${lst('INTERVENÇÃO').slice(0, lim).map(it).join('') || '<small>Nenhum atleta.</small>'}${more(lst('INTERVENÇÃO'))}</div>
  <div class="balert yel"><h4>Atenção (${lst('ATENÇÃO').length})</h4>${lst('ATENÇÃO').slice(0, lim).map(it).join('') || '<small>Nenhum atleta.</small>'}${more(lst('ATENÇÃO'))}</div>
  <div class="balert pain"><h4>Dor / desconforto (${dor.length})</h4>${dor.slice(0, lim).map(x => `<div class="bai"><b>${esc(x.a.apelido || x.a.nome)}</b><span>${esc(x.r.dor || 'Dor')}${x.r.escalaDor ? ' • intensidade ' + esc(x.r.escalaDor) : ''}</span><span>Local: ${esc(x.r.localDor || 'não informado')}</span></div>`).join('') || '<small>Ninguém informou dor.</small>'}</div>
  <div class="balert gray"><h4>Não vai treinar / jogar (${nt.length})</h4>${nt.map(x => `<div class="bai"><b>${esc(x.a.apelido || x.a.nome)}</b><span>${esc(x.r.motivo || 'Motivo não informado')}</span></div>`).join('') || '<small>Todos vão treinar/jogar.</small>'}</div>
  <div class="balert grn"><h4>Não responderam (${nr.length})</h4>${nr.length ? `<div class="bnr">${nr.slice(0, compact ? 24 : 80).map(x => `<span>${esc(x.a.apelido || x.a.nome)}</span>`).join('')}${nr.length > (compact ? 24 : 80) ? `<span>+${nr.length - (compact ? 24 : 80)}</span>` : ''}</div>` : '<small>Todos responderam.</small>'}</div>`;
}
function beMapa(rows) {
  if (!rows.length) return miniEmpty('Nenhum atleta cadastrado');
  const W = 1100, H = 280, L = 34, R = 20, T = 20, B = 28, iw = W - L - R, ih = H - T - B;
  const X = i => L + (rows.length === 1 ? iw / 2 : i / (rows.length - 1) * iw), Y = v => T + ih - v / 10 * ih;
  const grid = [0, 2, 4, 6, 8, 10].map(v => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${L - 8}" y="${Y(v) + 4}" text-anchor="end" font-size="11" fill="var(--ink2)">${v}</text>`).join('');
  const pts = rows.map((x, i) => ({ x, i, v: x.s.media }));
  const path = pts.filter(p => p.v != null).map((p, k) => `${k ? 'L' : 'M'}${X(p.i).toFixed(1)} ${Y(p.v).toFixed(1)}`).join(' ');
  const dots = pts.map(p => { const c = STC[p.x.s.st][1], r = p.x.r; const tip = `${p.x.a.nome} (${p.x.a.posicao}${p.x.a.numero ? ' #' + p.x.a.numero : ''})\n${p.x.s.st}${r ? `\nSono: ${r.sono || '—'}\nHidratação: urina ${r.urina || '—'}\nDor: ${temDor(r) ? (r.escalaDor || r.dor) + (r.localDor ? ' · ' + r.localDor : '') : 'não'}\nFadiga: ${r.fadiga || '—'}\nEstresse: ${r.estresse || '—'} · Recuperação: ${r.recuperacao || '—'}\nHumor: ${r.humor || '—'}${nrmB(r.treinaHoje) === 'nao' ? '\nNÃO VAI TREINAR: ' + (r.motivo || '') : ''}` : ''}`; return `<g class="ipt" data-tip="${esc(tip)}" data-ficha-open="${p.x.a.id}"><circle cx="${X(p.i)}" cy="${Y(p.v ?? 5)}" r="13" fill="transparent" stroke="${c}" opacity=".3"/><circle cx="${X(p.i)}" cy="${Y(p.v ?? 5)}" r="7" fill="${c}" stroke="var(--card)" stroke-width="3"/></g>`; }).join('');
  const names = rows.length <= 40 ? pts.map(p => `<text x="${X(p.i)}" y="${H - 8}" text-anchor="middle" font-size="9.5" fill="var(--ink2)">${esc((p.x.a.apelido || p.x.a.nome).split(' ')[0].slice(0, 9))}</text>`).join('') : '';
  return `<svg class="chart ich" viewBox="0 0 ${W} ${H}">${grid}<path d="${path}" fill="none" stroke="#2d8b63" stroke-width="2.5" opacity=".7"/>${dots}${names}</svg>`;
}
function beDatas() { return [...new Set((S.bemestar || []).filter(r => r.sono !== undefined).map(r => r.data))].sort().reverse(); }
function beDateBar(extra = '') {
  const ds = beDatas(); return `<div class="panel" style="margin-bottom:14px"><div class="pb bebar"><div><b>Data do monitoramento</b><small>${fmtD(UI.monDia)} · ${['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'][new Date(UI.monDia + 'T12:00').getDay()]}</small></div>${diaNav('be-dia', UI.monDia)}${ds.length ? `<select id="beDatas" class="search" style="min-width:0"><option value="">Dias com respostas…</option>${ds.slice(0, 60).map(d => `<option value="${d}" ${d === UI.monDia ? 'selected' : ''}>${fmtD(d)}</option>`).join('')}</select>` : ''}${extra}<span style="flex:1"></span><label class="btn" style="cursor:pointer">${IC.upload} Importar respostas do Forms<input type="file" id="beImport" accept=".xlsx,.xls,.csv" hidden></label><button class="btn pri" data-act="be-lancar">${IC.plus} Lançar manualmente</button></div></div>`;
}
fBe = function () {
  const all = beDia(UI.monDia), rows = beFiltrar(all), resp = all.filter(x => x.r);
  const c = st => all.filter(x => x.s.st === st).length;
  const f = UI.beFiltro;
  const seg = [{ l: 'Normal', v: c('NORMAL'), c: '#15933d' }, { l: 'Atenção', v: c('ATENÇÃO'), c: '#f0b30c' }, { l: 'Intervenção', v: c('INTERVENÇÃO'), c: '#e62925' }, { l: 'Não respondeu', v: c('NÃO RESPONDEU'), c: '#aab5af' }];
  return beDateBar() + `<div class="kpis k4">
    ${kpi('users', 'Atletas cadastrados', all.length, 'elenco oficial')}
    ${kpi('check', 'Responderam', resp.length, 'no dia selecionado')}
    ${kpi('cross', 'Falta responder', all.length - resp.length, 'atletas para cobrar hoje', 'red')}
    ${kpi('trend', 'Adesão do dia', pct(resp.length, all.length), 'respostas / elenco')}
  </div>
  <div class="bstatus"><div class="bsc nor"><i>✓</i><div><small>Atletas normais</small><b>${c('NORMAL')}</b><span>Condições adequadas</span></div></div><div class="bsc ate"><i>!</i><div><small>Atletas em atenção</small><b>${c('ATENÇÃO')}</b><span>Monitorar</span></div></div><div class="bsc int"><i>!</i><div><small>Atletas em intervenção</small><b>${c('INTERVENÇÃO')}</b><span>Avaliação individual</span></div></div><div class="bsc don">${iDonut(seg, resp.length, 'RESPONDERAM', 110)}</div></div>
  ${panel('Mapa de bem-estar do elenco', `<div class="legend-status" style="margin-bottom:6px"><span><span class="sq" style="background:#15933d"></span>Normal</span><span><span class="sq" style="background:#f0b30c"></span>Atenção</span><span><span class="sq" style="background:#e62925"></span>Intervenção</span><span><span class="sq" style="background:#aab5af"></span>Não respondeu</span><span class="muted">Passe o mouse sobre um ponto para ver as respostas · clique para abrir a ficha</span></div>${beMapa(all)}`)}
  <div style="height:14px"></div>
  <div class="row r31b" style="align-items:start">
    <div class="panel"><div class="ph">Status dos atletas · ${fmtD(UI.monDia)}<span class="r">${rows.length} atleta(s)</span></div>
      <div class="fbar"><div class="f"><label for="beFa">Atleta</label><select id="beFa"><option value="">Todos os atletas</option>${all.map(x => `<option value="${x.a.id}" ${f.atleta === x.a.id ? 'selected' : ''}>${esc(x.a.nome)}</option>`).join('')}</select></div><div class="f"><label for="beFt">Participação</label><select id="beFt"><option value="">Todos</option><option ${f.treina === 'Sim' ? 'selected' : ''}>Sim</option><option ${f.treina === 'Não' ? 'selected' : ''}>Não</option></select></div><div class="f"><label for="beFb">Pesquisar</label><input id="beFb" placeholder="Nome do atleta" value="${esc(f.busca)}"></div></div>
      <div class="tbl-wrap">${beTabela(rows)}</div></div>
    <aside class="panel"><div class="ph">Alertas do dia</div><div class="pb">${beAlertas(all, true)}</div></aside>
  </div>
  <div class="row r3" style="margin-top:14px">
    ${panel('Legenda de hidratação', `<div style="display:flex;gap:14px;flex-wrap:wrap"><span class="bhid boa">💧 Boa (urina 1–3)</span><span class="bhid ate">💧 Atenção (4–5)</span><span class="bhid ina">💧 Inadequada (6–8)</span></div><div class="uscale" style="margin-top:10px">${URINAB.map((c, i) => `<span style="background:${c}">${i + 1}</span>`).join('')}</div>`)}
    ${panel('Recomendações gerais para hoje', `<p class="brec">☑ Manter rotina de sono e hidratação.</p><p class="brec">☑ Atenção especial aos atletas em alerta.</p><p class="brec">☑ Monitoramento individual dos atletas em intervenção.</p><p class="brec">☑ Comunicação contínua entre comissão técnica, departamento médico e preparadores.</p>`)}
    ${panel('Notas do dia', `<textarea id="beNota" class="bnota" placeholder="Anotações da comissão sobre o dia">${esc((S.config.beNotas || {})[UI.monDia] || '')}</textarea><small class="muted">Salvo automaticamente ao sair do campo.</small>`)}
  </div>`;
};
function fBeHist() {
  const ats = atletasCat().sort((a, b) => a.nome.localeCompare(b.nome));
  if (!UI.beAtl || !atl(UI.beAtl)) UI.beAtl = ats.find(a => (S.bemestar || []).some(r => r.atletaId === a.id && r.sono !== undefined))?.id || ats[0]?.id;
  const a = atl(UI.beAtl); if (!a) return miniEmpty('Nenhum atleta cadastrado');
  const rs = (S.bemestar || []).filter(r => r.atletaId === a.id && r.sono !== undefined).sort((x, y) => x.data.localeCompare(y.data));
  const ss = rs.map(r => ({ r, s: beSt(r) }));
  const lab = ss.map(x => fmtDs(x.r.data));
  const ser = [['s', 'Sono', '#2f6fd6'], ['fad', 'Fadiga', '#f39324'], ['rec', 'Recuperação', '#1b8a4a'], ['est', 'Estresse', '#7a3fd1'], ['hum', 'Humor', '#159aa8']].map(([k, n, c]) => ({ n, c, vals: ss.map(x => x.s.sc[k]) }));
  const cnt = st => ss.filter(x => x.s.st === st).length;
  const mini = (n, v) => `<div class="fk"><small>${n}</small><b>${v == null ? '—' : nf(v, 1)}</b></div>`;
  const av = k => { const l = ss.map(x => x.s.sc[k]).filter(v => v != null); return l.length ? mean(l) : null; };
  return `<div class="panel" style="margin-bottom:14px"><div class="pb indbar" style="grid-template-columns:minmax(220px,1.3fr) minmax(220px,1fr) auto"><div class="det-head" style="margin:0">${ava(a)}<div><b>${esc(a.apelido || a.nome)}${subTag(a)}</b><span class="muted">${esc(POSN[a.posicao] || '')} · ${rs.length} resposta(s)</span></div></div><div class="f"><label for="beAtlSel">Atleta</label><select id="beAtlSel">${ats.map(x => `<option value="${x.id}" ${x.id === a.id ? 'selected' : ''}>${esc(x.nome)}</option>`).join('')}</select></div><button class="btn" data-act="ficha-tab" data-id="${a.id}" data-t="geral">${IC.user} Abrir ficha</button></div></div>
  <div class="fkgrid" style="grid-template-columns:repeat(8,1fr);margin-bottom:14px">${mini('Sono (média)', av('s'))}${mini('Fadiga', av('fad'))}${mini('Recuperação', av('rec'))}${mini('Estresse', av('est'))}${mini('Humor', av('hum'))}${mini('Dor (média)', av('dor'))}<div class="fk"><small>Dias normais</small><b style="color:#15933d">${cnt('NORMAL')}</b></div><div class="fk"><small>Atenção / interv.</small><b style="color:#e62925">${cnt('ATENÇÃO')} / ${cnt('INTERVENÇÃO')}</b></div></div>
  <div class="row r21">${panel('Evolução das respostas (nota 0–10)', ss.length > 1 ? iLine(lab, ser, { w: 900, h: 260, lo: 0, hi: 10 }) + `<div class="legend-status" style="justify-content:center">${ser.map(s => `<span><span class="sq" style="background:${s.c}"></span>${s.n}</span>`).join('')}</div>` : miniEmpty('Poucas respostas', 'A evolução aparece com duas ou mais respostas.'))}${panel('Cor da urina e dor', ss.length > 1 ? iLine(lab, [{ n: 'Cor da urina', c: '#c98c2c', vals: ss.map(x => x.s.sc.u) }, { n: 'Escala de dor', c: '#e62925', vals: ss.map(x => x.s.sc.dor ?? 0) }], { w: 520, h: 260, lo: 0, hi: 10 }) : miniEmpty('Sem dados'))}</div>
  <div class="row" style="grid-template-columns:1fr">${panel('Histórico de respostas', rs.length ? `<div class="tbl-wrap"><table class="t btab"><thead><tr><th>Data</th><th>Treina?</th><th>Sono</th><th>Hidratação</th><th>Dor</th><th>Fadiga</th><th>Estresse</th><th>Recuperação</th><th>Humor</th><th>Urina</th><th>Status</th><th class="l">Observação</th></tr></thead><tbody>${[...ss].reverse().map(x => `<tr><td>${fmtD(x.r.data)}</td><td>${esc(x.r.treinaHoje || '—')}</td><td>${clsB(x.r.sono, 'sono')}</td><td>${hidB(x.r.urina)}</td><td>${dorB(x.r)}</td><td>${clsB(x.r.fadiga, 'fad')}</td><td>${clsB(x.r.estresse, 'est')}</td><td>${recNum(x.r)}</td><td>${clsB(x.r.humor, 'hum')}</td><td>${uriB(x.r.urina)}</td><td>${stChipB(x.s.st)}</td><td class="l bobs">${obsB(x.r, x.s)}</td></tr>`).join('')}</tbody></table></div>` : miniEmpty('Sem histórico'), { np: !!rs.length })}</div>`;
}
UI.bePorPag = 20;
function beRelPaginas() {
  const all = beDia(UI.monDia), resp = all.filter(x => x.r), c = st => all.filter(x => x.s.st === st).length, n = UI.bePorPag, tot = Math.max(1, Math.ceil(all.length / n));
  const pages = [];
  for (let p = 0; p < tot; p++) {
    const fat = all.slice(p * n, p * n + n);
    pages.push(`<div class="brel">
      <div class="brel-head"><img src="${LOGO}" alt=""><div class="bt"><small>Porto Vitória • Saúde & Performance</small><h2>BEM-ESTAR DIÁRIO</h2><span>Relatório do dia · ${esc(catLabel())}</span></div><div class="bdc"><small>Data</small><b>${fmtD(UI.monDia)}</b><span>${['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][new Date(UI.monDia + 'T12:00').getDay()]}</span></div><div class="bdc"><small>Elenco</small><b>${all.length}</b><span>atletas</span></div><div class="bdc"><small>Responderam</small><b>${resp.length}</b><span>${pct(resp.length, all.length)}</span></div><div class="bpg">Página ${p + 1} de ${tot}</div></div>
      <div class="brel-sum"><div class="bsc nor"><i>✓</i><div><small>Normal</small><b>${c('NORMAL')}</b></div></div><div class="bsc ate"><i>!</i><div><small>Atenção</small><b>${c('ATENÇÃO')}</b></div></div><div class="bsc int"><i>!</i><div><small>Intervenção</small><b>${c('INTERVENÇÃO')}</b></div></div><div class="bsc nr"><i>?</i><div><small>Não responderam</small><b>${c('NÃO RESPONDEU')}</b></div></div><div class="brel-leg"><b>Como interpretar</b><span><i style="background:#15933d"></i>Normal: boas condições</span><span><i style="background:#f0b30c"></i>Atenção: monitorar</span><span><i style="background:#e62925"></i>Intervenção: avaliação individual</span></div></div>
      <div class="brel-body"><div class="brel-tab">${beTabela(fat, p * n)}</div><aside class="brel-side">${beAlertas(all, true)}${(S.config.beNotas || {})[UI.monDia] ? `<div class="balert gray"><h4>Notas</h4><small>${esc(S.config.beNotas[UI.monDia])}</small></div>` : ''}</aside></div>
      <div class="brel-foot"><span>PORTO VITÓRIA ESPORTE CLUBE</span><span>${resp.length} de ${all.length} responderam · atletas ${p * n + 1}–${Math.min(all.length, p * n + n)}</span><span>SAÚDE • PERFORMANCE • RESULTADOS</span></div>
    </div>`);
  }
  return pages;
}
function fBeRel() {
  const pages = beRelPaginas();
  return beDateBar(`<label class="muted" style="display:flex;align-items:center;gap:6px">Atletas por página <select id="bePorPag" class="search" style="min-width:0">${[10, 15, 20, 25, 30].map(n => `<option ${n === UI.bePorPag ? 'selected' : ''}>${n}</option>`).join('')}</select></label><button class="btn" data-act="be-print">${IC.print} Imprimir</button><button class="btn" data-act="be-pdf">${IC.pdf} Baixar PDF</button>`) + `<p class="muted" style="margin:0 0 10px;font-size:12.5px">${pages.length} página(s) · cada página traz ${UI.bePorPag} atletas e o painel lateral completo (alertas, dor, quem não vai treinar e quem não respondeu).</p>` + pages.map((h, i) => `<div class="brel-prev">${h}</div>`).join('');
}
const _vMon = vMon;
vMon = function () {
  if (S.view === 'mon-pse') return _vMon();
  const body = S.view === 'mon-be-hist' ? fBeHist : S.view === 'mon-be-rel' ? fBeRel : fBe;
  const h = header({ title: 'BEM-ESTAR DIÁRIO', sub: 'MONITORAMENTO DE SAÚDE E PERFORMANCE', items: hdrItems() });
  if (PRINT) return h + '<div style="height:16px"></div>' + body();
  return h + `<nav class="rtabs">${MON_TABS.map(([k, n]) => `<button data-go="${k}" class="${S.view === k ? 'on' : ''}">${n}</button>`).join('')}</nav>` + noData() + body();
};
function bePrint(pdf) {
  const pages = beRelPaginas().map(h => `<div class="sheet"><div class="pdfpage fixed bepg"><div class="report">${h}</div></div></div>`);
  if (pdf) gerarPDF(pages, 'bemestar'); else imprimir(pages);
}

/* ---------- lançamento manual no formato do Forms ---------- */
formBe = function () {
  const cat = F.categoria !== 'Todas' ? F.categoria : (S.atletas[0]?.categoria || 'Sub-15'); const d = UI.monDia;
  const sel = (f, v) => `<select data-f="${f}"><option value="">–</option>${BEF[f].map(o => `<option ${o === v ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
  openModal(mh('Lançar bem-estar (mesmas perguntas do Forms)') + `<form id="fBe" novalidate><div class="mb">
    <div class="form" style="grid-template-columns:repeat(4,1fr)"><div class="f"><label for="beD">Data *</label><input id="beD" type="date" value="${d}" max="${todayISO()}"></div><div class="f"><label for="beC">Categoria</label><select id="beC">${opts(Object.keys(GRUPOS), cat)}</select></div><div class="f s2"><span class="hint">Deixe a linha em branco para quem não respondeu. Status calculado automaticamente.</span></div></div>
    <div class="tbl-wrap" style="max-height:470px;overflow:auto;border:1px solid var(--line);border-radius:8px"><table class="t hidin bein"><thead><tr><th class="l">Atleta</th><th>Treina?</th><th>Sono</th><th>Fadiga</th><th>Recuperação</th><th>Estresse</th><th>Humor</th><th>Dor</th><th>Escala dor</th><th>Local da dor</th><th>Urina</th><th>Motivo / obs.</th><th>Status</th></tr></thead><tbody id="beRows"></tbody></table></div>
  </div><div class="mf"><span class="msg" id="beErr"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar respostas</button></div></form>`, true);
  const fill = () => { const dd = $('#beD').value; const as = S.atletas.filter(a => a.categoria === $('#beC').value).sort((a, b) => a.nome.localeCompare(b.nome)); $('#beRows').innerHTML = as.map(a => { const r = (S.bemestar || []).find(x => x.atletaId === a.id && x.data === dd && x.sono !== undefined) || {}; return `<tr data-a="${a.id}"><td class="l">${athCell(a)}</td><td>${sel('treinaHoje', r.treinaHoje)}</td><td>${sel('sono', r.sono)}</td><td>${sel('fadiga', r.fadiga)}</td><td>${sel('recuperacao', r.recuperacao)}</td><td>${sel('estresse', r.estresse)}</td><td>${sel('humor', r.humor)}</td><td>${sel('dor', r.dor)}</td><td><input type="number" min="0" max="10" data-f="escalaDor" value="${r.escalaDor ?? ''}" style="width:56px"></td><td><input data-f="localDor" value="${esc(r.localDor || '')}" style="width:110px"></td><td><select data-f="urina"><option value="">–</option>${[1, 2, 3, 4, 5, 6, 7, 8].map(n => `<option ${+r.urina === n ? 'selected' : ''}>${n}</option>`).join('')}</select></td><td><input data-f="motivo" value="${esc(r.motivo || r.observacao || '')}" style="width:130px"></td><td class="bst2">—</td></tr>`; }).join(''); calc(); };
  const read = tr => { const o = {}; tr.querySelectorAll('[data-f]').forEach(i => o[i.dataset.f] = i.value); return o; };
  const calc = () => $$('#beRows tr').forEach(tr => { const o = read(tr); const has = o.sono || o.fadiga || o.recuperacao || o.estresse || o.humor; tr.querySelector('.bst2').innerHTML = has ? stChipB(beSt(o).st) : '—'; });
  $('#beC').onchange = fill; $('#beD').onchange = fill; $('#fBe').addEventListener('change', calc); $('#fBe').addEventListener('input', calc); fill();
  $('#fBe').onsubmit = async e => {
    e.preventDefault(); const dd = $('#beD').value;
    const docs = $$('#beRows tr').map(tr => { const o = read(tr); if (!(o.sono || o.fadiga || o.recuperacao || o.estresse || o.humor)) return null; return { id: `be_${tr.dataset.a}_${dd}`, atletaId: tr.dataset.a, data: dd, origem: 'manual', treinaHoje: o.treinaHoje || 'Sim', dor: o.dor || 'Normal', escalaDor: o.escalaDor === '' ? null : +o.escalaDor, localDor: o.localDor.trim(), fadiga: o.fadiga, recuperacao: o.recuperacao, sono: o.sono, estresse: o.estresse, humor: o.humor, urina: o.urina ? +o.urina : null, motivo: o.motivo.trim() }; }).filter(Boolean);
    if (!docs.length) return $('#beErr').textContent = 'Preencha as respostas de pelo menos um atleta.';
    await saveMany('bemestar', docs); UI.monDia = dd; closeModal(); render(); toast(`${docs.length} resposta(s) salva(s)`);
  };
};

/* ---------- importar respostas do Google Forms (planilha baixada) ---------- */
const FORMS_COLS = { timestamp: ['carimbo de data/hora', 'timestamp', 'data'], atleta: ['atletas', 'atleta', 'nome'], treinaHoje: ['voce ira treinar/ jogar hoje?', 'voce ira treinar/jogar hoje?', 'treina hoje'], dor: ['dor muscular/ articular?', 'dor muscular/articular?', 'dor'], localDor: ['local da dor?', 'local da dor'], escalaDor: ['escala de dor'], fadiga: ['fadiga'], recuperacao: ['recuperacao'], sono: ['sono'], estresse: ['nivel de estresse', 'estresse'], humor: ['humor'], motivo: ['motivo'], urina: ['cor da urina', 'urina'] };
function parseTs(v) { if (v instanceof Date && !isNaN(v)) return v.getFullYear() + '-' + pad(v.getMonth() + 1) + '-' + pad(v.getDate()); return parseDate(v); }
async function beImportar(file) {
  try { await loadLib('xlsx'); } catch (e) { toast('Não foi possível carregar o leitor de planilhas.', true); return; }
  let rows; try { const wb = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true }); const ws = wb.Sheets[wb.SheetNames.find(n => /respostas/i.test(n)) || wb.SheetNames[0]]; rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: true }); } catch (e) { toast('Não consegui ler o arquivo.', true); return; }
  const hdr = (rows[0] || []).map(h => nrmB(h).replace(/\s+/g, ' ')); const idx = {};
  Object.entries(FORMS_COLS).forEach(([k, al]) => { const i = hdr.findIndex(h => al.includes(h)); if (i >= 0) idx[k] = i; });
  if (idx.timestamp == null || idx.atleta == null) { toast('Não encontrei as colunas “Carimbo de data/hora” e “Atletas”. Baixe a planilha de respostas do Forms (.xlsx ou .csv).', true); return; }
  const map = new Map(), sem = new Map();
  rows.slice(1).forEach(r => { const nome = String(r[idx.atleta] ?? '').trim(), d = parseTs(r[idx.timestamp]); if (!nome || !d) return; const a = findAtleta(nome); const o = { data: d }; Object.keys(FORMS_COLS).forEach(k => { if (k !== 'timestamp' && k !== 'atleta' && idx[k] != null) o[k] = String(r[idx[k]] ?? '').trim(); }); o.escalaDor = numB(o.escalaDor); o.urina = numB(o.urina); o.nomeForms = nome; if (!a) { sem.set(nome, (sem.get(nome) || 0) + 1); return; } map.set(a.id + '|' + d, { ...o, id: `be_${a.id}_${d}`, atletaId: a.id, origem: 'forms' }); });
  const docs = [...map.values()], dias = [...new Set(docs.map(x => x.data))].sort();
  openModal(mh('Importar respostas do Forms') + `<div class="mb"><div class="counters"><span><b>${docs.length}</b> respostas reconhecidas</span><span><b>${dias.length}</b> dia(s): ${dias.length ? fmtD(dias[0]) + ' a ' + fmtD(dias[dias.length - 1]) : '—'}</span><span style="${sem.size ? 'color:var(--red);border-color:var(--red)' : ''}"><b>${sem.size}</b> nome(s) sem atleta cadastrado</span></div>${sem.size ? `<div class="warn" style="margin:0">Estes nomes do Forms não batem com nenhum atleta do cadastro e serão ignorados: <b>${[...sem.keys()].map(esc).join(', ')}</b>. Ajuste o nome no cadastro do atleta (ou o apelido) e importe de novo.</div>` : ''}<p class="muted" style="margin:0;font-size:12.5px">Se o atleta respondeu mais de uma vez no mesmo dia, vale a última resposta. Respostas já importadas são atualizadas, não duplicadas.</p></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn pri" id="beImpOk" ${docs.length ? '' : 'disabled'}>${IC.check} Importar ${docs.length} resposta(s)</button></div>`);
  $('#beImpOk').onclick = async () => { closeModal(); await saveMany('bemestar', docs); if (dias.length) UI.monDia = dias[dias.length - 1]; render(); toast(`${docs.length} resposta(s) importada(s)`); };
}

/* ---------- ficha: último bem-estar no novo modelo ---------- */
const _sfBe = statusFisico;
statusFisico = function (a) { const r = _sfBe(a); const last = (S.bemestar || []).filter(x => x.atletaId === a.id && x.sono !== undefined).sort((x, y) => x.data.localeCompare(y.data)).pop(); if (last && dayDiff(last.data, todayISO()) <= 3) { const st = beSt(last); r.bem = { txt: `${st.st} · ${fmtDs(last.data)}`, s: st.st === 'NORMAL' ? 'ok' : st.st === 'ATENÇÃO' ? 'warn' : 'bad' }; } else delete r.bem; return r; };

dmOn('change', e => {
  const t = e.target;
  if (t.id === 'beImport' && t.files[0]) { beImportar(t.files[0]); t.value = ''; }
  if (t.id === 'beDatas' && t.value) { UI.monDia = t.value; render(); }
  if (t.id === 'beFa') { UI.beFiltro.atleta = t.value; render(); }
  if (t.id === 'beFt') { UI.beFiltro.treina = t.value; render(); }
  if (t.id === 'beAtlSel') { UI.beAtl = t.value; render(); }
  if (t.id === 'bePorPag') { UI.bePorPag = +t.value; render(); }
  if (t.id === 'beNota') { S.config.beNotas = { ...(S.config.beNotas || {}), [UI.monDia]: t.value.trim() }; putConfig(); toast('Nota salva'); }
});
let bebt; dmOn('input', e => { if (e.target.id === 'beFb') { const v = e.target.value; clearTimeout(bebt); bebt = setTimeout(() => { UI.beFiltro.busca = v; const p = e.target.selectionStart; render(); const el = $('#beFb'); if (el) { el.focus(); el.setSelectionRange(p, p); } }, 250); } });
dmOn('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'be-print') bePrint(false); if (t.dataset.act === 'be-pdf') bePrint(true); });

/* ================= CARGA INTERNA (PSE) + MICROCICLO EM CALENDÁRIO ================= */
MON_TABS.splice(MON_TABS.findIndex(x => x[0] === 'mon-pse'), 1, ['mon-pse', 'PSE · Dashboard do dia'], ['mon-pse-sem', 'PSE · Carga da semana'], ['mon-pse-rel', 'PSE · Reports']);
MON_TABS.forEach(([k, n]) => TITLES[k] = ['Monitoramento', n]);
IC.sun = I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>');
IC.moonS = I('<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>');
IC.copy = I('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>');
IC.dumb = I('<path d="M6 7v10M18 7v10M3 9v6M21 9v6M6 12h12"/>');
IC.wave = I('<path d="M2 12h3l3-8 4 16 3-8h7"/>');
const SESS = {
  treino: ['Treino de campo', 'ball', '#1b8a4a'], tatico: ['Treino tático', 'layers', '#2f6fd6'], forca: ['Força', 'dumb', '#7a3fd1'], fisico: ['Treino físico', 'run', '#7a3fd1'],
  cond: ['Condicionamento', 'wave', '#f39324'], veloc: ['Velocidade', 'bolt', '#f39324'], matchprep: ['Match preparation', 'trophy', '#159aa8'], recup: ['Recuperação', 'cycle', '#159aa8'],
  aval: ['Teste físico', 'stopw', '#8a948f'], jogo: ['Jogo', 'ball', '#e0342b'], folga: ['Folga', 'moonS', '#1b8a4a']
};
const sIc = k => IC[(SESS[k] || SESS.treino)[1]] || IC.ball;
const periodoH = h => { const n = +String(h || '10').slice(0, 2); return n < 12 ? 'manhã' : n < 18 ? 'tarde' : 'noite'; };
// sessões do dia (o modelo antigo com 1 registro por dia continua valendo como uma sessão)
const sessoesDia = (cat, d) => (S.micro || []).filter(m => m.categoria === cat && m.data === d).sort((a, b) => String(a.hora || '10:00').localeCompare(String(b.hora || '10:00')));
const ativas = l => l.filter(s => s.tipo !== 'folga');
function progDia(cat, d) { const l = ativas(sessoesDia(cat, d)); const au = l.reduce((s, x) => s + (+x.pse || 0) * (+x.duracao || 0), 0), du = l.reduce((s, x) => s + (+x.duracao || 0), 0); return { au, pse: du ? au / du : null, n: l.length, folga: sessoesDia(cat, d).some(s => s.tipo === 'folga') }; }
const elencoCat = cat => S.atletas.filter(a => a.categoria === cat);
function realDia(cat, d) {
  const ids = new Set(elencoCat(cat).map(a => a.id)); const l = (S.pse || []).filter(r => r.data === d && ids.has(r.atletaId));
  const por = new Map(); l.forEach(r => { const o = por.get(r.atletaId) || { au: 0, du: 0 }; o.au += carga(r); o.du += +r.duracao || 0; por.set(r.atletaId, o); });
  const v = [...por.values()]; const au = v.length ? mean(v.map(x => x.au)) : null, du = v.reduce((s, x) => s + x.du, 0);
  return { au, pse: du ? v.reduce((s, x) => s + x.au, 0) / du : null, resp: por.size, elenco: ids.size };
}
const mono = arr => { const m = mean(arr), sd = Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length); return sd ? m / sd : null; };
const monoSt = v => v == null ? ['—', 'neu', 'Dados insuficientes'] : v > 2 ? [nf(v, 1), 'bad', 'Alta'] : v > 1.5 ? [nf(v, 1), 'warn', 'Moderada'] : [nf(v, 1), 'ok', 'Equilibrado'];
function semana(cat, w0) {
  const dias = Array.from({ length: 7 }, (_, i) => addDays(w0, i)); const P = dias.map(d => progDia(cat, d)), R = dias.map(d => realDia(cat, d));
  const pAU = P.map(x => x.au), rAU = R.map(x => x.au || 0);
  const temReal = R.filter(x => x.au != null).length;
  const pp = P.filter(x => x.pse != null), rp = R.filter(x => x.pse != null);
  return { dias, P, R, monoP: P.some(x => x.au) ? mono(pAU) : null, monoR: temReal >= 3 ? mono(rAU) : null, psePm: pp.length ? mean(pp.map(x => x.pse)) : null, pseRm: rp.length ? mean(rp.map(x => x.pse)) : null, auP: pAU.reduce((a, b) => a + b, 0), auR: rAU.reduce((a, b) => a + b, 0), temReal };
}
// status de risco do atleta (carga + bem-estar do dia)
function riscoAtl(a, d) {
  const c = cargas(a.id, d); const l7 = Array.from({ length: 7 }, (_, i) => pseDe(a.id).filter(r => r.data === addDays(d, -6 + i)).reduce((s, r) => s + carga(r), 0));
  const mo = l7.some(Boolean) ? mono(l7) : null; const be = (S.bemestar || []).find(r => r.atletaId === a.id && r.data === d && r.sono !== undefined); const bst = be ? beSt(be).st : null;
  let st = ['Sem alertas', 'ok'], mot = [];
  if (c.acwr != null && c.acwr > 1.5) mot.push(`ACWR ${nf(c.acwr, 2)} (aumento brusco)`); if (mo != null && mo > 2) mot.push(`monotonia ${nf(mo, 1)}`); if (bst === 'INTERVENÇÃO') mot.push('bem-estar em intervenção');
  if (mot.length) st = ['Risco alto', 'bad'];
  else { if (c.acwr != null && (c.acwr > 1.3 || c.acwr < 0.8)) mot.push(`ACWR ${nf(c.acwr, 2)}`); if (mo != null && mo > 1.5) mot.push(`monotonia ${nf(mo, 1)}`); if (bst === 'ATENÇÃO') mot.push('bem-estar em atenção'); if (mot.length) st = ['Requer atenção', 'warn']; }
  return { c, l7, mo, strain: mo != null ? l7.reduce((a, b) => a + b, 0) * mo : null, st, mot, bst };
}
const spark = (vals, cor = '#1b8a4a') => { const mx = Math.max(1, ...vals); return `<span class="spark">${vals.map((v, i) => `<i style="height:${Math.max(2, v / mx * 26)}px;background:${v ? cor : 'var(--line)'}" data-tip="${SEMANA[i] || ''}: ${Math.round(v)} UA"></i>`).join('')}</span>`; };
// gráfico combinado: barras de UA (realizada x programada) + linhas de PSE (realizada x programada)
function comboSem(W0, o = {}) {
  const W = o.w || 1000, H = o.h || 300, L = 50, R = 46, T = 30, B = 34, dias = W0.dias, n = 7, bw = (W - L - R) / n;
  const auMax = Math.max(100, ...W0.P.map(x => x.au), ...W0.R.map(x => x.au || 0)) * 1.15, Y = v => T + (H - T - B) * (1 - v / auMax), YP = v => T + (H - T - B) * (1 - v / 10);
  let g = `<line x1="${L}" x2="${W - R}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--line)"/><text x="${L - 6}" y="${T + 4}" text-anchor="end" font-size="11" fill="var(--ink2)">${Math.round(auMax)} UA</text><text x="${W - R + 6}" y="${T + 4}" font-size="11" fill="var(--ink2)">10 PSE</text><line x1="${L}" x2="${W - R}" y1="${T}" y2="${T}" stroke="var(--line)" stroke-dasharray="3 4"/><line x1="${L}" x2="${W - R}" y1="${(T + Y(0)) / 2}" y2="${(T + Y(0)) / 2}" stroke="var(--line)" stroke-dasharray="3 4"/>`;
  dias.forEach((d, i) => { const x = L + i * bw, w = bw * 0.28, r = W0.R[i].au || 0, p = W0.P[i].au;
    g += `<rect class="ibar" x="${x + bw / 2 - w - 2}" y="${Y(r)}" width="${w}" height="${Y(0) - Y(r)}" rx="3" fill="#e0342b" data-tip="${SEMANA[i]} ${fmtDs(d)} · UA realizada (média por atleta): ${Math.round(r)}"/><rect class="ibar" x="${x + bw / 2 + 2}" y="${Y(p)}" width="${w}" height="${Y(0) - Y(p)}" rx="3" fill="var(--ink)" data-tip="${SEMANA[i]} ${fmtDs(d)} · UA programada: ${Math.round(p)}"/>`;
    if (r) g += `<text x="${x + bw / 2 - w / 2 - 2}" y="${Y(0) - 6}" text-anchor="middle" font-size="10.5" font-weight="800" fill="#fff">${Math.round(r)}</text>`; if (p) g += `<text x="${x + bw / 2 + w / 2 + 2}" y="${Y(0) - 6}" text-anchor="middle" font-size="10.5" font-weight="800" fill="var(--card)">${Math.round(p)}</text>`;
    g += `<text x="${x + bw / 2}" y="${H - 10}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink2)">${SEMANA[i].toLowerCase()} ${fmtDs(d)}</text>`; });
  const line = (vals, c, lbl, dy) => { const pts = vals.map((v, i) => v == null ? null : [L + i * bw + bw / 2, YP(v), v]).filter(Boolean); if (!pts.length) return ''; return `<polyline points="${pts.map(p => p[0] + ',' + p[1]).join(' ')}" fill="none" stroke="${c}" stroke-width="3"/>` + pts.map(p => `<circle class="ipt" cx="${p[0]}" cy="${p[1]}" r="5" fill="${c}" stroke="var(--card)" stroke-width="2" data-tip="${lbl}: ${nf(p[2], 1)}"/><rect x="${p[0] - 17 + dy}" y="${p[1] - 30}" width="34" height="20" rx="6" fill="${c}"/><text x="${p[0] + dy}" y="${p[1] - 16}" text-anchor="middle" font-size="11.5" font-weight="800" fill="${c === '#f6c21c' ? '#3d2d00' : '#fff'}">${nf(p[2], 1)}</text>`).join(''); };
  g += line(W0.R.map(x => x.pse), '#1b8a4a', 'PSE realizada', -18) + line(W0.P.map(x => x.pse), '#f6c21c', 'PSE programada', 18);
  return `<svg class="chart ich" viewBox="0 0 ${W} ${H}">${g}</svg><div class="legend-status" style="justify-content:center"><span><span class="sq" style="background:#e0342b"></span>UA realizada (média por atleta)</span><span><span class="sq" style="background:var(--ink)"></span>UA programada</span><span><span class="sq" style="background:#1b8a4a"></span>PSE realizada</span><span><span class="sq" style="background:#f6c21c"></span>PSE programada</span></div>`;
}

/* ---------- PSE · dashboard do dia ---------- */
const catMon = () => F.categoria !== 'Todas' ? F.categoria : (S.atletas[0]?.categoria || 'Sub-15');
const barG = (v, max, grad) => `<div class="gbarx"><i style="width:${Math.max(0, Math.min(100, v / max * 100))}%;background:${grad}"></i></div>`;
fPse = function () {
  const cat = catMon(), d = UI.pseDia, ats = atletasCat(), W0 = semana(cat, segunda(d)), iD = W0.dias.indexOf(d), P = progDia(cat, d), R = realDia(cat, d);
  const rows = ats.map(a => { const l = (S.pse || []).filter(r => r.atletaId === a.id && r.data === d); const au = l.reduce((s, r) => s + carga(r), 0), du = l.reduce((s, r) => s + (+r.duracao || 0), 0); return { a, l, au, pse: du ? au / du : null, rk: riscoAtl(a, d) }; });
  const resp = rows.filter(x => x.l.length).sort((x, y) => y.au - x.au), maxAU = Math.max(1, ...resp.map(x => x.au));
  const risco = rows.filter(x => x.rk.st[1] === 'bad').length, aten = rows.filter(x => x.rk.st[1] === 'warn').length;
  const ms = monoSt(W0.monoR);
  return `<div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><b style="font-family:var(--fc);font-size:18px;text-transform:uppercase">Dia</b>${diaNav('pse-dia', d)}<span class="muted" style="font-size:12.5px">${P.n ? `Planejado para hoje: <b>${ativas(sessoesDia(cat, d)).map(s => esc((SESS[s.tipo] || SESS.treino)[0])).join(' + ')}</b> · PSE alvo ${nfx(P.pse, 1)} · ${Math.round(P.au)} UA` : 'Nenhuma sessão planejada hoje no microciclo.'}</span><span style="flex:1"></span><button class="btn" data-act="pse-rep" data-k="dia">${IC.print} Report diário</button><button class="btn pri" data-act="pse-lancar">${IC.plus} Lançar PSE</button></div></div>
  <div class="kpis k5">
    <div class="kpi"><div class="ringk">${ring(R.elenco ? R.resp / R.elenco * 100 : 0, 58, '#e0342b')}<b>${R.resp}/${R.elenco}</b></div><div><div class="k">Coleta pós-treino</div><div class="s">${pct(R.resp, R.elenco)} responderam</div></div></div>
    ${kpi('gauge', 'PSE média', nfx(R.pse, 1), `programada ${nfx(P.pse, 1)}${R.pse != null ? ' · ' + PSE_ESC[Math.round(R.pse)] : ''}`)}
    ${kpi('bars', 'Média de carga do elenco', nfx(R.au, 0, '<small>UA</small>'), `programada ${Math.round(P.au)} UA`)}
    ${kpi('trend', 'Monotonia da semana', ms[0], ms[2], ms[1] === 'bad' ? 'red' : ms[1] === 'warn' ? 'gold' : '')}
    ${kpi('cross', 'Atletas em risco', risco, `${aten} requerem atenção`, 'red')}
  </div>
  <div class="row r21" style="align-items:start">
    ${panel('Monitoramento dos jogadores hoje', resp.length ? `<div class="pmon">${resp.map(x => `<div class="pmr" data-ficha-open="${x.a.id}"><span class="pmn">${fotoBox(x.a, 'mini')}<b>${esc(x.a.apelido || x.a.nome)}</b></span><div class="pmb"><span>PSE</span>${barG(x.pse || 0, 10, 'linear-gradient(90deg,#1b8a4a,#f6c21c,#e0342b)')}<b>${nf(x.pse, 1)}</b><span>UA</span>${barG(x.au, maxAU, 'linear-gradient(90deg,#22d3ee,#2f6fd6)')}<b>${Math.round(x.au)} UA</b></div><span class="sfc ${x.rk.st[1]}" data-tip="${esc(x.rk.mot.join(' · ') || 'Sem alertas')}">${x.rk.st[0]}</span></div>`).join('')}</div>${rows.length - resp.length ? `<div class="pb pend"><b>${IC.cross} Sem resposta (${rows.length - resp.length}):</b> ${rows.filter(x => !x.l.length).map(x => `<span class="bchip">${esc(x.a.apelido || x.a.nome)}</span>`).join('')}</div>` : ''}` : miniEmpty('Sem respostas de PSE neste dia', 'Clique em “Lançar PSE”.'), { np: !!resp.length })}
    ${panel(`Variação semanal de carga · ${fmtDs(W0.dias[0])} a ${fmtDs(W0.dias[6])}`, comboSem(W0, { w: 640, h: 300 }) + `<div class="mini-stats" style="margin-top:10px"><div><span>Monotonia planejada</span><b>${monoSt(W0.monoP)[0]}</b></div><div><span>Monotonia realizada</span><b>${ms[0]}</b></div><div><span>PSE média programada</span><b>${nfx(W0.psePm, 1)}</b></div><div><span>PSE média realizada</span><b>${nfx(W0.pseRm, 1)}</b></div></div>`)}
  </div>
  ${tabelaCarga(rows.map(x => ({ a: x.a, rk: x.rk, au: x.au, pse: x.pse })), d)}`;
};
function tabelaCarga(rows, d) {
  const grp = POS.map(p => [p, rows.filter(x => x.a.posicao === p)]).filter(g => g[1].length);
  return panel('Tabela de carga do elenco', `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Jogador</th><th>PSE hoje</th><th>UA hoje</th><th>UA 7 dias</th><th>Últimos 7 dias</th><th>Crônica (sem.)</th><th>ACWR</th><th>Monotonia</th><th>Strain</th><th>Bem-estar</th><th>Status</th></tr></thead><tbody>${grp.map(([p, l]) => `<tr class="grph"><td colspan="11" class="l"><span class="sq" style="background:${PC1[p]}"></span><b>${POSN[p]}s</b> <span class="muted">${l.length}</span></td></tr>` + l.map(x => `<tr class="click" data-ficha-carga="${x.a.id}"><td class="l"><div class="athcell">${fotoBox(x.a, 'mini')}<div><b>${esc(x.a.apelido || x.a.nome)}${subTag(x.a)}</b><small>${esc(x.a.posicao)}</small></div></div></td><td>${x.pse != null ? `<span class="pill2 y">${nf(x.pse, 1)}</span>` : '—'}</td><td>${x.au ? `<span class="pill2 c">${Math.round(x.au)} UA</span>` : '—'}</td><td><b>${Math.round(x.rk.c.ag)}</b></td><td>${spark(x.rk.l7)}</td><td>${Math.round(x.rk.c.cr4)}</td><td><b>${x.rk.c.acwr != null ? nf(x.rk.c.acwr, 2) : '—'}</b></td><td>${x.rk.mo != null ? nf(x.rk.mo, 1) : '—'}</td><td>${x.rk.strain != null ? Math.round(x.rk.strain) : '—'}</td><td>${x.rk.bst ? stChipB(x.rk.bst) : '<span class="muted">—</span>'}</td><td><span class="sfc ${x.rk.st[1]}" data-tip="${esc(x.rk.mot.join(' · ') || 'Carga dentro do esperado')}">${x.rk.st[0]}</span></td></tr>`).join('')).join('')}</tbody></table></div><p class="muted pb" style="font-size:12px;margin:0">Status: <b>Risco alto</b> = ACWR acima de 1,5, monotonia acima de 2 ou bem-estar em intervenção · <b>Requer atenção</b> = ACWR fora de 0,8–1,3, monotonia acima de 1,5 ou bem-estar em atenção. Apenas monitoramento: não é diagnóstico médico.</p>`, { np: true });
}
function fPseSem() {
  const cat = catMon(); if (!UI.week) UI.week = segunda(todayISO()); const w0 = UI.week, W0 = semana(cat, w0), fim = W0.dias[6] < todayISO() ? W0.dias[6] : todayISO();
  const ats = atletasCat().map(a => ({ a, rk: riscoAtl(a, fim) }));
  const tot = ats.map(x => x.rk.l7.reduce((s, v) => s + v, 0)).filter(Boolean);
  const monos = ats.map(x => x.rk.mo).filter(v => v != null), strains = ats.map(x => x.rk.strain).filter(v => v != null);
  return `<div class="panel" style="margin-bottom:14px"><div class="pb wkbar"><button class="btn sm" data-act="wk" data-d="${addDays(w0, -7)}" aria-label="Semana anterior">‹</button><b>Semana de ${fmtD(W0.dias[0])} a ${fmtD(W0.dias[6])}</b><button class="btn sm" data-act="wk" data-d="${addDays(w0, 7)}" aria-label="Próxima semana">›</button><button class="btn sm" data-act="wk" data-d="${segunda(todayISO())}">Esta semana</button><span style="flex:1"></span><button class="btn pri" data-act="pse-rep" data-k="sem">${IC.print} Report semanal</button></div></div>
  <div class="kpis k5">
    ${kpi('bars', 'Carga média por atleta', nfx(mean(tot), 0, '<small>UA</small>'), `programada ${Math.round(W0.auP)} UA na semana`)}
    ${kpi('gauge', 'PSE médio', nfx(W0.pseRm, 1), W0.pseRm != null ? PSE_ESC[Math.round(W0.pseRm)] : 'sem dados')}
    ${kpi('trend', 'Mediana da monotonia', monos.length ? nf(median(monos), 1) : '—', monoSt(monos.length ? median(monos) : null)[2])}
    ${kpi('wave', 'Mediana do strain', strains.length ? Math.round(median(strains)).toLocaleString('pt-BR') : '—', 'carga semanal × monotonia')}
    ${kpi('cross', 'Atletas com monotonia alta', `${monos.filter(v => v > 2).length}<small>/ ${ats.length}</small>`, 'acima de 2,0', 'red')}
  </div>
  ${panel('Variação semanal de carga', comboSem(W0, { w: 1100, h: 320 }))}
  <div style="height:14px"></div>
  ${panel('Carga diária por atleta (UA)', `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th>${W0.dias.map((d, i) => `<th>${SEMANA[i]}<br><small>${fmtDs(d)}</small></th>`).join('')}<th>Total</th><th>Monotonia</th><th>Strain</th><th>ACWR</th><th>Status</th></tr></thead><tbody>${ats.map(x => { const l = W0.dias.map(d => pseDe(x.a.id).filter(r => r.data === d).reduce((s, r) => s + carga(r), 0)); const t = l.reduce((a, b) => a + b, 0), mo = l.some(Boolean) ? mono(l) : null; return `<tr class="click" data-ficha-carga="${x.a.id}"><td class="l"><div class="athcell">${fotoBox(x.a, 'mini')}<div><b>${esc(x.a.apelido || x.a.nome)}</b><small>${esc(x.a.posicao)}</small></div></div></td>${l.map((v, i) => { const p = W0.P[i].au; const c = !v ? '' : p && v > p * 1.2 ? 'hi' : p && v < p * 0.7 ? 'lo' : 'ok'; return `<td><span class="auc ${c}" data-tip="${SEMANA[i]}: ${Math.round(v)} UA (programado ${Math.round(p)})">${v ? Math.round(v) : '—'}</span></td>`; }).join('')}<td><b>${Math.round(t)}</b></td><td>${mo != null ? nf(mo, 1) : '—'}</td><td>${mo != null ? Math.round(t * mo) : '—'}</td><td>${x.rk.c.acwr != null ? nf(x.rk.c.acwr, 2) : '—'}</td><td><span class="sfc ${x.rk.st[1]}" data-tip="${esc(x.rk.mot.join(' · ') || 'Sem alertas')}">${x.rk.st[0]}</span></td></tr>`; }).join('')}<tr class="grph"><td class="l"><b>Programado</b></td>${W0.P.map(p => `<td><b>${p.au ? Math.round(p.au) : p.folga ? 'Folga' : '—'}</b></td>`).join('')}<td><b>${Math.round(W0.auP)}</b></td><td colspan="4">${monoSt(W0.monoP)[0]} (${monoSt(W0.monoP)[2]})</td></tr></tbody></table></div><p class="muted pb" style="font-size:12px;margin:0">Cores: verde = perto do programado · vermelho = mais de 20% acima · azul = menos de 70% do programado.</p>`, { np: true })}`;
}
function fPseRel() {
  return `<div class="cfgmods">${[['dia', 'Report diário de carga interna', 'KPIs do dia, PSE e UA de cada atleta, quem não respondeu e status de risco. Paginado por número de atletas.'], ['sem', 'Report semanal de carga interna', 'Carga média por atleta, PSE médio, monotonia, strain, gráfico da semana (programado x realizado) e a tabela de carga de cada atleta.'], ['micro', 'Microciclo da semana', 'O calendário da semana com as sessões planejadas, PSE e UA programados x realizados, para mandar para a comissão.']].map(([k, t, d]) => `<button class="cfgmod" data-act="pse-rep" data-k="${k}"><span class="ci">${IC.pdf}</span><span class="ct"><b>${t}</b><small>${d}</small><em>Folhas 16:9 · imprimir ou PDF</em></span><span class="cg">${IC.next}</span></button>`).join('')}</div><p class="muted" style="margin-top:12px;font-size:12.5px">O report diário usa o dia selecionado em “PSE · Dashboard do dia”; o semanal e o microciclo usam a semana escolhida em “PSE · Carga da semana” ou no Planejamento.</p>`;
}
const _vMon2 = vMon;
vMon = function () {
  if (S.view !== 'mon-pse-sem' && S.view !== 'mon-pse-rel' && S.view !== 'mon-pse') return _vMon2();
  const body = S.view === 'mon-pse-sem' ? fPseSem : S.view === 'mon-pse-rel' ? fPseRel : fPse;
  const h = header({ title: 'CARGA INTERNA · PSE', sub: 'MONITORAMENTO · CONTROLE DE CARGA', items: hdrItems() });
  if (PRINT) return h + '<div style="height:16px"></div>' + body();
  return h + `<nav class="rtabs">${MON_TABS.map(([k, n]) => `<button data-go="${k}" class="${S.view === k ? 'on' : ''}">${n}</button>`).join('')}</nav>` + noData() + body();
};

/* ---------- reports 16:9 ---------- */
function repHead(t, sub) { return `<div class="rphead"><div><h2>${t}</h2><p>${sub}</p></div><img src="${LOGO}" alt=""></div>`; }
function repDia() {
  const cat = catMon(), d = UI.pseDia, ats = atletasCat(), P = progDia(cat, d), R = realDia(cat, d);
  const rows = ats.map(a => { const l = (S.pse || []).filter(r => r.atletaId === a.id && r.data === d); const au = l.reduce((s, r) => s + carga(r), 0), du = l.reduce((s, r) => s + (+r.duracao || 0), 0); return { a, l, au, pse: du ? au / du : null, rk: riscoAtl(a, d) }; }).sort((x, y) => y.au - x.au);
  const be = ats.filter(a => (S.bemestar || []).some(r => r.atletaId === a.id && r.data === d && r.sono !== undefined)).length;
  const maxAU = Math.max(1, ...rows.map(x => x.au)), N = 24, pags = Math.max(1, Math.ceil(rows.length / N));
  const kp = `<div class="rpk"><div class="g"><small>Bem-estar (pré-treino)</small><b>${be}/${ats.length}</b><span>${be === ats.length ? 'Todos responderam' : ats.length - be + ' sem resposta'}</span></div><div class="y"><small>PSE média</small><b>${nfx(R.pse, 1)}</b><span>programada ${nfx(P.pse, 1)}</span></div><div class="g"><small>Pós-treino (PSE)</small><b>${R.resp}/${ats.length}</b><span>${R.resp === ats.length ? 'Todos responderam' : ats.length - R.resp + ' sem resposta'}</span></div><div class="y"><small>Carga média do elenco</small><b>${nfx(R.au, 0)} UA</b><span>programada ${Math.round(P.au)} UA</span></div><div class="b"><small>Atletas em risco</small><b>${rows.filter(x => x.rk.st[1] === 'bad').length}</b><span>${rows.filter(x => x.rk.st[1] === 'warn').length} requerem atenção</span></div></div>`;
  return Array.from({ length: pags }, (_, p) => { const l = rows.slice(p * N, p * N + N), half = Math.ceil(l.length / 2); const col = arr => arr.map(x => `<div class="rpr"><b>${esc(x.a.apelido || x.a.nome)}</b><div><span>PSE</span>${barG(x.pse || 0, 10, 'linear-gradient(90deg,#1b8a4a,#f6c21c,#e0342b)')}<em>${x.pse != null ? nf(x.pse, 1) : '—'}</em><span>UA</span>${barG(x.au, maxAU, 'linear-gradient(90deg,#22d3ee,#2f6fd6)')}<em>${x.au ? Math.round(x.au) + ' UA' : '—'}</em></div><i class="sfc ${x.l.length ? x.rk.st[1] : 'neu'}">${x.l.length ? x.rk.st[0] : 'Sem resposta'}</i></div>`).join('');
    return pageWrap(repHead('Report diário de carga interna', `Porto Vitória · ${esc(catLabel())} · ${fmtD(d)}${pags > 1 ? ` · página ${p + 1} de ${pags}` : ''}`) + kp + `<div class="rpcols"><div class="rpcol"><h4>Monitoramento dos jogadores</h4>${col(l.slice(0, half))}</div><div class="rpcol"><h4>&nbsp;</h4>${col(l.slice(half))}</div></div>`); });
}
function repSem() {
  const cat = catMon(); if (!UI.week) UI.week = segunda(todayISO()); const W0 = semana(cat, UI.week), fim = W0.dias[6] < todayISO() ? W0.dias[6] : todayISO();
  const ats = atletasCat().map(a => ({ a, rk: riscoAtl(a, fim), l: W0.dias.map(d => pseDe(a.id).filter(r => r.data === d).reduce((s, r) => s + carga(r), 0)) }));
  const tot = ats.map(x => x.l.reduce((s, v) => s + v, 0)).filter(Boolean), monos = ats.map(x => x.l.some(Boolean) ? mono(x.l) : null).filter(v => v != null), strains = ats.map(x => { const m = x.l.some(Boolean) ? mono(x.l) : null; return m != null ? x.l.reduce((a, b) => a + b, 0) * m : null; }).filter(v => v != null);
  const sub = `Porto Vitória · ${esc(catLabel())} · ${fmtD(W0.dias[0])} a ${fmtD(W0.dias[6])}`;
  const kp = `<div class="rpk"><div class="y"><small>Carga média por atleta</small><b>${nfx(mean(tot), 0)} UA</b><span>${mean(tot) != null && W0.auP ? (mean(tot) < W0.auP * 0.9 ? 'Abaixo da faixa planejada' : mean(tot) > W0.auP * 1.1 ? 'Acima da faixa planejada' : 'Dentro do planejado') : ''}</span></div><div class="y"><small>RPE médio</small><b>${nfx(W0.pseRm, 1)}</b><span>${W0.pseRm != null ? PSE_ESC[Math.round(W0.pseRm)] : ''}</span></div><div class="g"><small>Mediana da monotonia</small><b>${monos.length ? nf(median(monos), 1) : '—'}</b><span>${monoSt(monos.length ? median(monos) : null)[2]}</span></div><div class="y"><small>Mediana do strain</small><b>${strains.length ? Math.round(median(strains)).toLocaleString('pt-BR') : '—'}</b><span>carga × monotonia</span></div><div class="b"><small>Atletas com monotonia alta</small><b>${monos.filter(v => v > 2).length}/${ats.length}</b><span>monotonia &gt; 2,0</span></div></div>`;
  const pages = [pageWrap(repHead('Report semanal de carga interna', sub) + kp + `<div class="rpbox"><h4>Variação semanal de carga</h4>${comboSem(W0, { w: 1100, h: 330 })}<p class="muted" style="font-size:12px;margin:4px 0 0">UA diária por atleta (barras) e PSE ponderada pela duração (linhas).</p></div>`)];
  const N = 20; for (let p = 0; p * N < ats.length; p++) pages.push(pageWrap(repHead('Report semanal de carga interna', sub + ` · atletas ${p * N + 1}–${Math.min(ats.length, p * N + N)}`) + `<div class="rpbox"><h4>Carga diária por atleta (UA)</h4><table class="t"><thead><tr><th class="l">Atleta</th>${W0.dias.map((d, i) => `<th>${SEMANA[i]} ${fmtDs(d)}</th>`).join('')}<th>Total</th><th>Monotonia</th><th>ACWR</th><th>Status</th></tr></thead><tbody>${ats.slice(p * N, p * N + N).map(x => { const t = x.l.reduce((a, b) => a + b, 0), mo = x.l.some(Boolean) ? mono(x.l) : null; return `<tr><td class="l"><b>${esc(x.a.apelido || x.a.nome)}</b> <small class="muted">${x.a.posicao}</small></td>${x.l.map((v, i) => { const pr = W0.P[i].au; return `<td><span class="auc ${!v ? '' : pr && v > pr * 1.2 ? 'hi' : pr && v < pr * 0.7 ? 'lo' : 'ok'}">${v ? Math.round(v) : '—'}</span></td>`; }).join('')}<td><b>${Math.round(t)}</b></td><td>${mo != null ? nf(mo, 1) : '—'}</td><td>${x.rk.c.acwr != null ? nf(x.rk.c.acwr, 2) : '—'}</td><td><span class="sfc ${x.rk.st[1]}">${x.rk.st[0]}</span></td></tr>`; }).join('')}<tr class="grph"><td class="l"><b>Programado</b></td>${W0.P.map(q => `<td><b>${q.au ? Math.round(q.au) : q.folga ? 'Folga' : '—'}</b></td>`).join('')}<td><b>${Math.round(W0.auP)}</b></td><td colspan="3">monotonia planejada ${monoSt(W0.monoP)[0]}</td></tr></tbody></table></div>`));
  return pages;
}
function repMicro() { const cat = catPl(); if (!UI.week) UI.week = segunda(todayISO()); const tt = (S.config.semanas || {})[cat + '|' + UI.week] || 'Planejamento semanal'; return [pageWrap(`<div class="rphead"><div><small style="color:#f39324;font:800 12px var(--fc);letter-spacing:1px">PLANEJAMENTO SEMANAL · ${esc(cat.toUpperCase())}</small><h2>${esc(tt)}</h2><p>Porto Vitória · ${fmtD(UI.week)} a ${fmtD(addDays(UI.week, 6))}</p></div><img src="${LOGO}" alt=""></div><div class="mcwrap">` + microGrid(cat, UI.week, true) + `</div>`)]; }
function abrirRep(k) {
  openModal(mh({ dia: 'Report diário de carga interna', sem: 'Report semanal de carga interna', micro: 'Microciclo da semana' }[k]) + `<div class="mb"><p style="margin:0">${k === 'dia' ? 'Dia ' + fmtD(UI.pseDia) : 'Semana de ' + fmtD(UI.week || segunda(todayISO())) + ' a ' + fmtD(addDays(UI.week || segunda(todayISO()), 6))} · ${esc(k === 'micro' ? catPl() : catLabel())} · folhas 16:9.</p></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn" data-act="rep-go" data-k="${k}" data-pdf="0">${IC.print} Imprimir</button><button class="btn pri" data-act="rep-go" data-k="${k}" data-pdf="1">${IC.pdf} Baixar PDF</button></div>`);
}
function gerarRep(k, pdf) { const v0 = S.view; PRINT = true; let pages; try { pages = k === 'dia' ? repDia() : k === 'sem' ? repSem() : repMicro(); } finally { PRINT = false; S.view = v0; } if (pdf) gerarPDF(pages, 'carga-' + k); else imprimir(pages); }

/* ---------- microciclo no estilo calendário ---------- */
const MDCOR = l => !l ? 'linear-gradient(90deg,#0d5a31,#178a4a)' : l === 'MD' ? 'linear-gradient(90deg,#c98a0c,#f2b81b)' : l.startsWith('MD+') ? 'linear-gradient(90deg,#0b5a50,#118a7a)' : l === 'MD-1' ? 'linear-gradient(90deg,#1b8a4a,#34b267)' : l === 'MD-2' ? 'linear-gradient(90deg,#14753e,#1f9d55)' : 'linear-gradient(90deg,#0f6635,#178a4a)';
const _mdLabel = mdLabel;
mdLabel = function (d, cat) { const js = [...jogosDaCat(cat).map(j => j.data), ...(S.micro || []).filter(m => m.categoria === cat && m.tipo === 'jogo').map(m => m.data)]; const u = [...new Set(js)].sort(); if (u.includes(d)) return 'MD'; const prox = u.find(x => x > d), ant = [...u].reverse().find(x => x < d); const dp = prox ? dayDiff(d, prox) : 99, da = ant ? dayDiff(ant, d) : 99; if (da <= 2 && da <= dp) return 'MD+' + da; if (dp <= 6) return 'MD-' + dp; return ''; };
function microGrid(cat, w0, print) {
  const W0 = semana(cat, w0), mp = monoSt(W0.monoP), mr = monoSt(W0.monoR);
  const sumStrip = `<div class="mcsum"><div><small>Monitoramento de 7 dias</small><b>${fmtD(W0.dias[0])} a ${fmtD(W0.dias[6])}</b></div><div class="${mp[1]}"><small>Monotonia planejada</small><b>${mp[1] === 'ok' ? '✓ ' : ''}${mp[0]}</b><span>${mp[2]}</span></div><div class="bl"><small>Média de PSE programada</small><b>${nfx(W0.psePm, 1)}</b></div><div class="${W0.temReal >= 3 ? mr[1] : 'neu'}"><small>Monotonia realizada</small><b>${W0.temReal >= 3 ? (mr[1] === 'ok' ? '✓ ' : '') + mr[0] : 'Em andamento'}</b><span>${W0.temReal >= 3 ? mr[2] : 'Apenas monitoramento'}</span></div><div><small>Média de PSE realizada</small><b>${nfx(W0.pseRm, 1)}</b></div></div>`;
  const col = (d, i) => { const ss = sessoesDia(cat, d), md = mdLabel(d, cat), P = W0.P[i], R = W0.R[i], folga = ss.some(s => s.tipo === 'folga') && !ativas(ss).length;
    const card = s => { const T = SESS[s.tipo] || SESS.treino; if (s.tipo === 'folga') return `<div class="mcs folga">${IC.moonS}<b>Folga</b>${print ? '' : `<button class="mcx" data-act="ms-del" data-id="${s.id}" aria-label="Remover">×</button>`}</div>`; const jogo = s.tipo === 'jogo';
      return `<div class="mcs ${jogo ? 'jogo' : ''}" ${print ? '' : `data-act="ms-edit" data-id="${s.id}" role="button" tabindex="0"`}><div class="mch"><span class="mct">${periodoH(s.hora) === 'manhã' ? IC.sun : IC.moonS} ${esc(s.hora || '10:00')} ${periodoH(s.hora).toUpperCase()}</span>${jogo ? '<span class="mdt2">MD</span>' : ''}${print ? '' : `<button class="mcx" data-act="ms-del" data-id="${s.id}" aria-label="Remover">×</button>`}</div><div class="mcn">${sIc(s.tipo)}<b>${esc(jogo ? (s.adversario ? 'Jogo vs ' + s.adversario : 'Jogo') : (s.titulo || T[0]))}</b></div>${jogo ? `<small>${s.mando === 'fora' ? 'Fora' : 'Casa'}${s.competicao ? ' · ' + esc(s.competicao) : ''}</small>` : s.titulo && s.titulo !== T[0] ? `<small>${T[0]}</small>` : ''}${s.conteudo ? (print ? `<p class="mcd">${esc(s.conteudo)}</p>` : `<details><summary>Detalhes</summary><p class="mcd">${esc(s.conteudo)}</p></details>`) : ''}<div class="mcm">${s.duracao ? `<b>${s.duracao} min</b>` : ''}${s.pse != null ? `<span>PSE ${s.pse}</span>` : ''}${s.pse != null && s.duracao ? `<span>${s.pse * s.duracao} UA</span>` : ''}</div></div>`; };
    const pl = (S.planos || []).find(p => p.categoria === cat && p.data === d);
    return `<div class="mcc ${folga ? 'isfolga' : ''} ${d === todayISO() ? 'today' : ''}"><div class="mchd ${md === 'MD' ? 'md' : ''}" style="background:${folga ? 'linear-gradient(90deg,#24382d,#3b5446)' : MDCOR(md)}"><div><b>${SEMANA[i].toUpperCase()}.</b><span>${fmtDs(d)}</span>${md ? `<em>${md}</em>` : ''}</div>${print ? '' : `<div class="mchb"><button data-act="ms-dup" data-d="${d}" data-tip="Copiar para o dia seguinte">${IC.copy}</button><button data-act="ms-add" data-d="${d}" data-tip="Adicionar sessão">${IC.plus}</button></div>`}</div>
      <div class="mcb">${ss.length ? ss.map(card).join('') : (print ? '<div class="mcempty">Sem planos</div>' : `<div class="mcempty">Sem planos<button data-act="ms-add" data-d="${d}">Adicionar sessão</button><button data-act="ms-folga" data-d="${d}">Folga</button><button data-act="ms-jogo" data-d="${d}">Match day</button></div>`)}${pl && !print ? `<button class="mdpl" data-act="plano-ver" data-id="${pl.id}">${IC.clip} ${esc(pl.titulo)}</button>` : ''}</div>
      <div class="mcf">${folga && !R.resp ? '<div class="mcnr">Folga</div>' : `<div class="mcg"><div class="p"><small>PSE programado</small><b>${nfx(P.pse, 1)}</b></div><div class="r"><small>PSE realizado</small><b>${nfx(R.pse, 1)}</b></div><div class="p"><small>UA programado</small><b>${P.au ? Math.round(P.au) : '—'}</b></div><div class="r ${R.au != null && P.au && R.au > P.au * 1.2 ? 'hi' : ''}"><small>UA realizado</small><b>${R.au != null ? Math.round(R.au) : '—'}</b></div></div>${R.resp ? `<div class="mcresp"><span>Respostas PSE</span><span>${R.resp}/${R.elenco}</span></div><div class="mcpb"><i style="width:${R.resp / Math.max(1, R.elenco) * 100}%"></i></div>` : '<div class="mcnr">Sem respostas dos jogadores</div>'}`}</div></div>`; };
  return sumStrip + `<div class="mcgrid">${W0.dias.map(col).join('')}</div>`;
}
fMicro = function () {
  const cat = catPl(); if (!UI.week) UI.week = segunda(todayISO()); const w0 = UI.week, key = cat + '|' + w0, tt = (S.config.semanas || {})[key] || '';
  const W0 = semana(cat, w0);
  const meso = (S.macro || []).filter(b => b.categoria === cat && b.inicio <= addDays(w0, 6) && b.fim >= w0);
  return `<div class="panel" style="margin-bottom:14px"><div class="pb wkbar"><button class="btn sm" data-act="wk" data-d="${addDays(w0, -7)}" aria-label="Semana anterior">‹</button><b>${fmtD(w0)} a ${fmtD(addDays(w0, 6))}</b><button class="btn sm" data-act="wk" data-d="${addDays(w0, 7)}" aria-label="Próxima semana">›</button><button class="btn sm" data-act="wk" data-d="${segunda(todayISO())}">Hoje</button><input id="wkTitle" class="search" placeholder="Nome da semana (ex.: Semana jogo x Rio Branco)" value="${esc(tt)}" style="min-width:260px">${meso.map(b => `<span class="mesotag" style="background:${b.cor}22;color:${b.cor};border-color:${b.cor}66">${esc(b.nome)}</span>`).join('')}<span style="flex:1"></span><button class="btn sm" data-act="wk2-copy">${IC.copy} Copiar semana anterior</button><button class="btn sm red" data-act="pse-rep" data-k="micro">${IC.pdf} PDF</button></div></div>
  <div class="mcwrap">${microGrid(cat, w0)}</div>
  <div class="row r21" style="margin-top:14px">${panel('Variação semanal de carga · programado x realizado', comboSem(W0, { w: 900, h: 280 }))}${panel('Resumo da semana', `<div class="mini-stats"><div><span>UA programada (semana)</span><b>${Math.round(W0.auP)}</b></div><div><span>UA realizada (média atleta)</span><b>${W0.auR ? Math.round(W0.auR) : '—'}</b></div><div><span>Sessões</span><b>${W0.P.reduce((s, x) => s + x.n, 0)}</b></div><div><span>Folgas</span><b>${W0.P.filter(x => x.folga).length}</b></div></div><p class="muted" style="font-size:12px;margin:10px 0 0">UA = PSE × minutos (unidades arbitrárias). Monotonia = média diária ÷ desvio-padrão da semana (acima de 2 = pouca variação). MD = dia de jogo; MD-1, MD-2… = dias antes; MD+1 = dia seguinte.</p>`)}</div>`;
};
function formSessao(s = {}, d, jogo) {
  const cat = s.categoria || (F.categoria !== 'Todas' ? F.categoria : catPl()); const tipo = s.tipo || (jogo ? 'jogo' : 'treino'); const isJ = tipo === 'jogo';
  openModal(mh((s.id ? 'Editar ' : 'Nova ') + (isJ ? 'sessão de jogo' : 'sessão') + ` · ${SEMANA[(new Date((s.data || d) + 'T12:00').getDay() + 6) % 7]} ${fmtD(s.data || d)}`) + `<form id="fSs" novalidate><div class="mb"><div class="form">
    <div class="f"><label for="ssCat">Categoria</label><select id="ssCat">${Object.keys(GRUPOS).map(c => `<option value="${c}" ${(s.categoria || cat) === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
    <div class="f"><label for="ssT">Tipo</label><select id="ssT">${Object.entries(SESS).filter(([k]) => k !== 'folga').map(([k, v]) => `<option value="${k}" ${k === tipo ? 'selected' : ''}>${v[0]}</option>`).join('')}</select></div>
    <div class="f s2 js-n"><label for="ssN">Título / descrição curta</label><input id="ssN" value="${esc(s.titulo || '')}" placeholder="Ex.: Elenco completo · jogos reduzidos"></div>
    <div class="f js-j"><label for="ssA">Adversário</label><input id="ssA" value="${esc(s.adversario || '')}" placeholder="Ex.: Rio Branco"></div>
    <div class="f js-j"><label for="ssM">Casa / fora</label><select id="ssM">${[['casa', 'Casa'], ['fora', 'Fora']].map(([k, n]) => `<option value="${k}" ${(s.mando || 'casa') === k ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
    <div class="f js-j"><label for="ssC">Competição</label><input id="ssC" value="${esc(s.competicao || '')}" placeholder="Estadual"></div>
    <div class="f"><label for="ssH">Início</label><input id="ssH" type="time" value="${esc(s.hora || (isJ ? '15:00' : '10:00'))}"></div>
    <div class="f"><label for="ssD">Duração planejada (min)</label><input id="ssD" type="number" min="0" max="240" value="${s.duracao ?? (isJ ? 90 : 75)}"></div>
    <div class="f"><label for="ssP">PSE planejada</label><select id="ssP"><option value="">—</option>${PSE_ESC.map((e, i) => `<option value="${i}" ${(s.pse ?? (isJ ? 8 : '')) === i ? 'selected' : ''}>${i} · ${e}</option>`).join('')}</select></div>
    <div class="f"><span>UA alvo</span><b id="ssU" style="font-family:var(--fc);font-size:24px">—</b><small class="muted">duração × PSE</small></div>
    <div class="f s4"><label for="ssCo">Detalhes</label><textarea id="ssCo" placeholder="Conteúdo, grupos, observações">${esc(s.conteudo || '')}</textarea></div>
  </div></div><div class="mf"><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar sessão</button></div></form>`);
  const vis = () => { const j = $('#ssT').value === 'jogo'; $$('#fSs .js-j').forEach(e => e.style.display = j ? '' : 'none'); }; const uu = () => { const p = $('#ssP').value, du = +$('#ssD').value || 0; $('#ssU').textContent = p !== '' ? (+p * du) + ' UA' : '—'; };
  $('#ssT').onchange = () => { vis(); }; $('#fSs').addEventListener('input', uu); $('#fSs').addEventListener('change', uu); vis(); uu();
  $('#fSs').onsubmit = e => { e.preventDefault(); const selCat = $('#ssCat') ? $('#ssCat').value : (s.categoria || cat); UI.plCat = selCat; const o = { ...s, id: s.id || uid('ms'), categoria: selCat, data: s.data || d, tipo: $('#ssT').value, titulo: $('#ssN').value.trim(), hora: $('#ssH').value, duracao: +$('#ssD').value || 0, pse: $('#ssP').value === '' ? null : +$('#ssP').value, conteudo: $('#ssCo').value.trim() }; if (o.tipo === 'jogo') { o.adversario = $('#ssA').value.trim(); o.mando = $('#ssM').value; o.competicao = $('#ssC').value.trim(); } save('micro', o); closeModal(); toast((o.tipo === 'jogo' ? 'Jogo salvo' : 'Sessão salva') + ' · ' + selCat); };
}


/* ---------- ficha: aba de carga ---------- */
FTABS.splice(FTABS.findIndex(x => x[0] === 'lesoes'), 0, ['carga', 'Carga (PSE)']);
function fichaCarga(a) {
  const d = todayISO(), rk = riscoAtl(a, d), l = pseDe(a.id); if (!l.length) return miniEmpty('Sem registros de PSE', 'Lance em Monitoramento → PSE.');
  const dias = Array.from({ length: 28 }, (_, i) => addDays(d, i - 27)), au = dias.map(x => l.filter(r => r.data === x).reduce((s, r) => s + carga(r), 0));
  return `<div class="fkgrid" style="grid-template-columns:repeat(6,1fr);margin-bottom:14px"><div class="fk"><small>Status de carga</small><b><span class="sfc ${rk.st[1]}">${rk.st[0]}</span></b></div><div class="fk"><small>UA 7 dias</small><b>${Math.round(rk.c.ag)}</b></div><div class="fk"><small>Crônica (sem.)</small><b>${Math.round(rk.c.cr4)}</b></div><div class="fk"><small>ACWR</small><b>${rk.c.acwr != null ? nf(rk.c.acwr, 2) : '—'}</b></div><div class="fk"><small>Monotonia</small><b>${rk.mo != null ? nf(rk.mo, 1) : '—'}</b></div><div class="fk"><small>Strain</small><b>${rk.strain != null ? Math.round(rk.strain) : '—'}</b></div></div>${rk.mot.length ? `<div class="warn" style="margin:0 0 12px">Motivo: ${esc(rk.mot.join(' · '))}</div>` : ''}
  ${panel('Carga diária · últimos 28 dias (UA)', iBars(dias.map(fmtDs), [{ n: 'UA', c: '#2f6fd6', vals: au }], { w: 1100, h: 230 }))}<div style="height:12px"></div>
  ${panel('Últimas sessões', `<table class="t"><thead><tr><th>Data</th><th>Sessão</th><th>PSE</th><th>Minutos</th><th>UA</th></tr></thead><tbody>${[...l].reverse().slice(0, 12).map(r => `<tr><td>${fmtD(r.data)}</td><td>${esc(r.sessao || 'Treino')}</td><td>${r.pse}</td><td>${r.duracao}</td><td><b>${carga(r)}</b></td></tr>`).join('')}</tbody></table>`, { np: true })}`;
}
const _fichaHTML2 = fichaHTML;
fichaHTML = function (a) { if (UI.fichaTab === 'carga') { const tmp = document.createElement('div'); tmp.innerHTML = _fichaHTML2({ ...a }); tmp.querySelector('.fbody').innerHTML = fichaCarga(a); return tmp.innerHTML; } return _fichaHTML2(a); };
// cartão do atleta: só aparece quando a carga está em risco
const _atlCard2 = atlCard;
atlCard = function (a) { const h = _atlCard2(a); const pl = pseDe(a.id); if (!pl.length || !pl.some(r => r.data >= addDays(todayISO(), -10))) return h; const rk = riscoAtl(a, todayISO()); if (rk.st[1] === 'ok') return h; return h.replace('<span class="bdisp"', `<span class="bcarga ${rk.st[1]}" title="${esc(rk.mot.join(' · '))}">⚠ ${rk.st[0]}</span><span class="bdisp"`); };

/* ---------- PSE ligada à sessão planejada ---------- */
const _formPse = formPse;
formPse = function () {
  _formPse();
  const box = document.createElement('div'); box.className = 'f'; box.innerHTML = `<label for="psSes">Sessão do microciclo</label><select id="psSes"></select>`;
  $('#fPs .form').insertBefore(box, $('#fPs .form').children[2]);
  const fillS = () => { const l = ativas(sessoesDia($('#psC').value, $('#psD').value)); $('#psSes').innerHTML = `<option value="">${l.length ? 'Escolha a sessão planejada' : 'Nenhuma sessão planejada neste dia'}</option>` + l.map(s => `<option value="${s.id}">${esc(s.hora || '')} · ${esc(s.tipo === 'jogo' ? 'Jogo' + (s.adversario ? ' vs ' + s.adversario : '') : (s.titulo || SESS[s.tipo]?.[0] || 'Treino'))} · ${s.duracao} min</option>`).join(''); };
  $('#psSes').onchange = () => { const s = (S.micro || []).find(x => x.id === $('#psSes').value); if (!s) return; $('#psS').value = s.tipo === 'jogo' ? 'Jogo' : s.tipo === 'recup' ? 'Recuperação' : ['forca', 'fisico', 'cond', 'veloc'].includes(s.tipo) ? 'Treino físico' : 'Treino'; $('#psS').dispatchEvent(new Event('change')); if (s.duracao && s.tipo !== 'jogo') { $('#psM').value = s.duracao; $('#psM').dispatchEvent(new Event('input')); } };
  $('#psC').addEventListener('change', fillS); $('#psD').addEventListener('change', fillS); fillS();
};

/* ---------- ações ---------- */
dmOn('click', e => {
  const fc = e.target.closest('[data-ficha-carga]'); if (fc) { abrirFicha(fc.dataset.fichaCarga, 'carga'); return; }
  const t = e.target.closest('[data-act]'); if (!t) return; const cat = catPl();
  switch (t.dataset.act) {
    case 'pse-rep': abrirRep(t.dataset.k); break;
    case 'rep-go': closeModal(); gerarRep(t.dataset.k, t.dataset.pdf === '1'); break;
    case 'ms-add': e.stopPropagation(); formSessao({}, t.dataset.d); break;
    case 'ms-jogo': formSessao({}, t.dataset.d, true); break;
    case 'ms-folga': save('micro', { id: uid('ms'), categoria: cat, data: t.dataset.d, tipo: 'folga', titulo: 'Folga', duracao: 0, pse: null }); break;
    case 'ms-edit': if (e.target.closest('summary,details,.mcx')) break; formSessao((S.micro || []).find(s => s.id === t.dataset.id)); break;
    case 'ms-del': e.stopPropagation(); remove('micro', t.dataset.id); break;
    case 'ms-dup': { e.stopPropagation(); const d = t.dataset.d, n = addDays(d, 1), l = sessoesDia(cat, d); if (!l.length) { toast('Esse dia não tem sessões para copiar.', true); break; } saveMany('micro', l.map(s => ({ ...s, id: uid('ms'), data: n }))).then(() => { render(); toast(`${l.length} sessão(ões) copiada(s) para ${fmtDs(n)}`); }); break; }
    case 'wk2-copy': { const w0 = UI.week, docs = []; for (let i = 0; i < 7; i++) sessoesDia(cat, addDays(w0, i - 7)).forEach(s => docs.push({ ...s, id: uid('ms'), data: addDays(w0, i) })); if (!docs.length) { toast('A semana anterior está vazia.', true); break; } saveMany('micro', docs).then(() => { render(); toast(`${docs.length} sessão(ões) copiada(s)`); }); break; }
  }
});
dmOn('change', e => { if (e.target.id === 'wkTitle') { const k = catPl() + '|' + UI.week; S.config.semanas = { ...(S.config.semanas || {}), [k]: e.target.value.trim() }; putConfig(); toast('Nome da semana salvo'); } });
dmOn('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.mcs[data-act="ms-edit"]')) { e.preventDefault(); formSessao((S.micro || []).find(s => s.id === e.target.dataset.id)); } });

/* ================= PSE · PRONTIDÃO, ALERTAS E GRÁFICOS DE CARGA ================= */
// prontidão (0–100%) e PSR (0–10) a partir do questionário de bem-estar do dia
function prontidao(aid, d) {
  const r = (S.bemestar || []).find(x => x.atletaId === aid && x.data === d && x.sono !== undefined); if (!r) return null;
  const s = beSt(r).sc, v = [s.s, s.fad, s.rec, s.est, s.hum].filter(x => x != null); if (!v.length) return null;
  const p = Math.round(Math.max(0, Math.min(100, mean(v) * 10 - (s.dor || 0) * 3 - (s.u != null && s.u >= 6 ? 5 : 0))));
  return { p, psr: s.rec, st: p < 50 ? ['Baixa', 'bad'] : p < 70 ? ['Moderada', 'warn'] : ['Boa', 'ok'], r };
}
// status de carga para os cartões: ALTA / ELEVADA / NORMAL / BAIXA
function statusCarga(a, d = todayISO()) {
  const pl = pseDe(a.id); if (!pl.some(r => r.data >= addDays(d, -14))) return null;
  const rk = riscoAtl(a, d), v = rk.c.acwr;
  if (rk.st[1] === 'bad' || (v != null && v > 1.5)) return { t: 'ALTA', c: 'bad', rk };
  if (v != null && v > 1.3) return { t: 'ELEVADA', c: 'warn', rk };
  if (v != null && v < 0.8) return { t: 'BAIXA', c: 'low', rk };
  return { t: 'NORMAL', c: 'ok', rk };
}
const _atlCard3 = atlCard;
atlCard = function (a) { let h = _atlCard3(a).replace(/<span class="bcarga[^"]*"[^>]*>[^<]*<\/span>/, ''); const sc = statusCarga(a); if (!sc) return h; return h.replace('<span class="bdisp"', `<span class="bcarga2 ${sc.c}" title="${esc(sc.rk.mot.join(' · ') || 'Carga dentro do esperado')}${sc.rk.c.acwr != null ? ' · ACWR ' + nf(sc.rk.c.acwr, 2) : ''}">Carga: ${sc.t}</span><span class="bdisp"`); };

/* ---------- séries de carga ---------- */
function serieDiaria(cat, ids, ini, fim) {
  const dias = []; for (let d = ini; d <= fim; d = addDays(d, 1)) dias.push(d);
  return dias.map(d => { const l = (S.pse || []).filter(r => r.data === d && ids.has(r.atletaId)); const por = new Map(); l.forEach(r => { const o = por.get(r.atletaId) || { au: 0, du: 0 }; o.au += carga(r); o.du += +r.duracao || 0; por.set(r.atletaId, o); }); const v = [...por.values()], du = v.reduce((s, x) => s + x.du, 0);
    const ps = [...ids].map(id => prontidao(id, d)).filter(Boolean);
    return { d, plan: progDia(cat, d).au, real: v.length ? mean(v.map(x => x.au)) : 0, pse: du ? v.reduce((s, x) => s + x.au, 0) / du : null, psr: ps.length ? mean(ps.map(x => x.psr).filter(x => x != null)) : null, pront: ps.length ? mean(ps.map(x => x.p)) : null }; });
}
// gráfico estilo “carga diária”: colunas (planejada x realizada) + linhas PSE e PSR (escala 0–10 à direita)
function graficoDiario(S2, o = {}) {
  const W = o.w || 1200, H = o.h || 320, L = 50, R = 40, T = 26, B = 34, n = S2.length || 1, bw = (W - L - R) / n;
  const mx = Math.max(100, ...S2.map(x => Math.max(x.plan, x.real))) * 1.12, Y = v => T + (H - T - B) * (1 - v / mx), Y2 = v => T + (H - T - B) * (1 - v / 10);
  let g = ''; for (let i = 0; i <= 4; i++) { const v = mx / 4 * i; g += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end" font-size="10.5" fill="var(--ink2)">${Math.round(v)}</text><text x="${W - R + 6}" y="${Y(v) + 4}" font-size="10.5" fill="var(--ink2)">${nf(10 / 4 * i, 0)}</text>`; }
  const every = Math.ceil(n / 16);
  S2.forEach((x, i) => { const cx = L + i * bw + bw / 2, w = Math.min(16, bw * 0.34);
    if (x.plan) g += `<rect class="ibar" x="${cx - w - 1}" y="${Y(x.plan)}" width="${w}" height="${Y(0) - Y(x.plan)}" rx="2" fill="#9fd8ae" data-tip="${fmtD(x.d)} · carga planejada: ${Math.round(x.plan)} UA"/>`;
    if (x.real) g += `<rect class="ibar" x="${cx + 1}" y="${Y(x.real)}" width="${w}" height="${Y(0) - Y(x.real)}" rx="2" fill="#0b3d22" data-tip="${fmtD(x.d)} · carga realizada: ${Math.round(x.real)} UA${x.plan ? ' (' + Math.round(x.real / x.plan * 100) + '% do planejado)' : ''}"/>${bw > 26 ? `<text x="${cx + 1 + w / 2}" y="${Y(x.real) + 13}" text-anchor="middle" font-size="9.5" font-weight="800" fill="#fff">${Math.round(x.real)}</text>` : ''}`;
    if (i % every === 0) g += `<text x="${cx}" y="${H - 10}" text-anchor="middle" font-size="10.5" fill="var(--ink2)">${fmtDs(x.d)}</text>`; });
  const ln = (k, c, lbl) => { const p = S2.map((x, i) => x[k] == null ? null : [L + i * bw + bw / 2, Y2(x[k]), x[k], x.d]).filter(Boolean); if (!p.length) return ''; return `<polyline points="${p.map(q => q[0] + ',' + q[1]).join(' ')}" fill="none" stroke="${c}" stroke-width="2.6" stroke-linejoin="round"/>` + p.map(q => `<g class="ipt" data-tip="${fmtD(q[3])} · ${lbl}: ${nf(q[2], 1)}"><rect x="${q[0] - 13}" y="${q[1] - 9}" width="26" height="18" rx="5" fill="${c}"/><text x="${q[0]}" y="${q[1] + 4}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">${nf(q[2], 1)}</text></g>`).join(''); };
  g += ln('pse', '#e0342b', 'PSE') + ln('psr', '#34a853', 'PSR (recuperação)');
  return `<svg class="chart ich" viewBox="0 0 ${W} ${H}">${g}</svg><div class="legend-status" style="justify-content:center"><span><span class="sq" style="background:#34a853"></span>PSR (recuperação percebida)</span><span><span class="sq" style="background:#e0342b"></span>PSE</span><span><span class="sq" style="background:#9fd8ae"></span>Carga planejada</span><span><span class="sq" style="background:#0b3d22"></span>Carga realizada (média por atleta)</span></div>`;
}
// carga das últimas semanas: colunas planejada / realizada / strain + linhas monotonia e ACWR
function serieSemanal(cat, ids, fimW0, nW = 6) {
  return Array.from({ length: nW }, (_, k) => { const w0 = addDays(fimW0, -(nW - 1 - k) * 7), dias = Array.from({ length: 7 }, (_, i) => addDays(w0, i)), fim = dias[6] < todayISO() ? dias[6] : todayISO();
    const plan = dias.reduce((s, d) => s + progDia(cat, d).au, 0);
    const per = [...ids].map(id => { const l = dias.map(d => (S.pse || []).filter(r => r.atletaId === id && r.data === d).reduce((s, r) => s + carga(r), 0)); const t = l.reduce((a, b) => a + b, 0); const m = l.some(Boolean) ? mono(l) : null; return { t, m, s: m != null ? t * m : null, acwr: cargas(id, fim).acwr }; }).filter(x => x.t);
    return { w0, plan, real: per.length ? mean(per.map(x => x.t)) : 0, mono: per.filter(x => x.m != null).length ? median(per.map(x => x.m).filter(v => v != null)) : null, strain: per.filter(x => x.s != null).length ? median(per.map(x => x.s).filter(v => v != null)) : null, acwr: per.filter(x => x.acwr != null).length ? mean(per.map(x => x.acwr).filter(v => v != null)) : null }; });
}
function graficoSemanal(SW, o = {}) {
  const W = o.w || 1200, H = o.h || 320, L = 56, R = 40, T = 26, B = 40, n = SW.length, bw = (W - L - R) / n;
  const mx = Math.max(500, ...SW.map(x => Math.max(x.plan, x.real, x.strain || 0))) * 1.12, Y = v => T + (H - T - B) * (1 - v / mx), Y2 = v => T + (H - T - B) * (1 - v / 3);
  let g = ''; for (let i = 0; i <= 4; i++) { const v = mx / 4 * i; g += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end" font-size="10.5" fill="var(--ink2)">${Math.round(v)}</text><text x="${W - R + 6}" y="${Y(v) + 4}" font-size="10.5" fill="var(--ink2)">${nf(3 / 4 * i, 1)}</text>`; }
  SW.forEach((x, i) => { const cx = L + i * bw + bw / 2, w = Math.min(34, bw * 0.22);
    [[x.plan, '#9fd8ae', 'Carga planejada', -1.5], [x.real, '#0b3d22', 'Carga realizada (média por atleta)', -0.5], [x.strain || 0, '#f39324', 'Strain (mediana)', 0.5]].forEach(([v, c, l, off]) => { if (!v) return; g += `<rect class="ibar" x="${cx + off * w}" y="${Y(v)}" width="${w - 2}" height="${Y(0) - Y(v)}" rx="3" fill="${c}" data-tip="Semana de ${fmtDs(x.w0)} · ${l}: ${Math.round(v).toLocaleString('pt-BR')}"/><text x="${cx + off * w + (w - 2) / 2}" y="${Y(v) - 4}" text-anchor="middle" font-size="10" font-weight="800" fill="var(--ink)">${Math.round(v)}</text>`; });
    const prev = SW[i - 1]; const vct = prev && prev.real ? (x.real - prev.real) / prev.real * 100 : null;
    g += `<text x="${cx}" y="${H - 22}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink2)">${fmtDs(x.w0)} – ${fmtDs(addDays(x.w0, 6))}</text>${vct != null ? `<text x="${cx}" y="${H - 8}" text-anchor="middle" font-size="10" font-weight="700" fill="${Math.abs(vct) > 15 ? '#e0342b' : 'var(--ink3)'}">var. ${vct >= 0 ? '+' : ''}${nf(vct, 1)}%</text>` : ''}`; });
  const ln = (k, c, lbl) => { const p = SW.map((x, i) => x[k] == null ? null : [L + i * bw + bw / 2, Y2(Math.min(3, x[k])), x[k]]).filter(Boolean); if (!p.length) return ''; return `<polyline points="${p.map(q => q[0] + ',' + q[1]).join(' ')}" fill="none" stroke="${c}" stroke-width="2.6"/>` + p.map(q => `<g class="ipt" data-tip="${lbl}: ${nf(q[2], 2)}"><rect x="${q[0] - 15}" y="${q[1] - 9}" width="30" height="18" rx="5" fill="${c}"/><text x="${q[0]}" y="${q[1] + 4}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">${nf(q[2], 1)}</text></g>`).join(''); };
  g += ln('acwr', '#e0342b', 'ACWR (aguda:crônica)') + ln('mono', '#1b8a4a', 'Monotonia (mediana)');
  return `<svg class="chart ich" viewBox="0 0 ${W} ${H}">${g}</svg><div class="legend-status" style="justify-content:center"><span><span class="sq" style="background:#e0342b"></span>ACWR</span><span><span class="sq" style="background:#1b8a4a"></span>Monotonia</span><span><span class="sq" style="background:#9fd8ae"></span>Carga planejada</span><span><span class="sq" style="background:#0b3d22"></span>Carga realizada</span><span><span class="sq" style="background:#f39324"></span>Strain</span></div>`;
}
// alertas do grupo: prontidão, monotonia, strain, UA x planejado, ACWR
function alertasGrupo(cat, d) {
  const ats = atletasCat(), p7 = Array.from({ length: 7 }, (_, i) => progDia(cat, addDays(d, -i)).au).reduce((a, b) => a + b, 0);
  const L = ats.map(a => ({ a, rk: riscoAtl(a, d), pr: prontidao(a.id, d) }));
  const strains = L.map(x => x.rk.strain).filter(v => v != null), stMed = strains.length ? median(strains) : null;
  const G = [
    ['Prontidão baixa', 'bad', L.filter(x => x.pr && x.pr.p < 60).map(x => [x, x.pr.p + '%']), 'abaixo de 60% hoje'],
    ['ACWR alto', 'bad', L.filter(x => x.rk.c.acwr != null && x.rk.c.acwr > 1.5).map(x => [x, nf(x.rk.c.acwr, 2)]), 'aumento brusco (> 1,5)'],
    ['Monotonia alta', 'warn', L.filter(x => x.rk.mo != null && x.rk.mo > 2).map(x => [x, nf(x.rk.mo, 1)]), 'pouca variação (> 2,0)'],
    ['Strain alto', 'warn', L.filter(x => x.rk.strain != null && stMed && x.rk.strain > stMed * 1.4).map(x => [x, Math.round(x.rk.strain)]), 'acima de 140% da mediana'],
    ['UA acima do planejado', 'warn', p7 ? L.filter(x => x.rk.c.ag > p7 * 1.2).map(x => [x, Math.round(x.rk.c.ag / p7 * 100) + '%']) : [], '7 dias > 120% do plano'],
    ['UA abaixo do planejado', 'low', p7 ? L.filter(x => x.rk.c.ag > 0 && x.rk.c.ag < p7 * 0.7).map(x => [x, Math.round(x.rk.c.ag / p7 * 100) + '%']) : [], '7 dias < 70% do plano']
  ];
  const tot = new Set(G.slice(0, 4).flatMap(g => g[2].map(y => y[0].a.id))).size;
  return { html: `<div class="agrp">${G.map(([t, c, l, s]) => `<div class="agc a-${c}"><div class="agh"><b>${l.length}</b><div><span>${t}</span><small>${s}</small></div></div><div class="agl">${l.length ? l.slice(0, 10).map(([x, v]) => `<span class="agp" data-ficha-carga="${x.a.id}">${esc((x.a.apelido || x.a.nome).split(' ').slice(0, 2).join(' '))} <b>${v}</b></span>`).join('') + (l.length > 10 ? `<span class="muted">+${l.length - 10}</span>` : '') : '<small class="muted">Ninguém</small>'}</div></div>`).join('')}</div>`, tot, L };
}
function prontPanel(L, d) {
  const l = L.filter(x => x.pr).sort((x, y) => x.pr.p - y.pr.p); if (!l.length) return miniEmpty('Sem questionário de bem-estar hoje', 'A prontidão vem do Bem-estar (pré-treino).');
  return `<div class="prl">${l.map(x => `<div class="prr" data-ficha-carga="${x.a.id}"><span class="pmn">${fotoBox(x.a, 'mini')}<b>${esc(x.a.apelido || x.a.nome)}</b></span><div class="prb"><span>Prontidão</span>${barG(x.pr.p, 100, 'linear-gradient(90deg,#e0342b,#f6c21c 55%,#1b8a4a)')}<b>${x.pr.p}%</b><span>PSR</span>${barG(x.pr.psr || 0, 10, 'linear-gradient(90deg,#7a3fd1,#22d3ee)')}<b>${x.pr.psr ?? '—'}</b></div><span class="sfc ${x.pr.st[1]}">${x.pr.st[0]}</span></div>`).join('')}</div>`;
}

/* ---------- encaixe nas telas de PSE ---------- */
const _fPse2 = fPse;
fPse = function () {
  const cat = catMon(), d = UI.pseDia, ids = new Set(atletasCat().map(a => a.id)), A = alertasGrupo(cat, d);
  const pr = A.L.map(x => x.pr).filter(Boolean), baixa = pr.filter(x => x.p < 60).length;
  const top = `${baixa || A.tot ? `<div class="abanner bad">${IC.cross}<div><b>${baixa ? baixa + ' atleta(s) com prontidão baixa hoje' : ''}${baixa && A.tot ? ' · ' : ''}${A.tot ? A.tot + ' atleta(s) com alerta de carga' : ''}</b><span>Veja os grupos abaixo e clique no nome para abrir a carga do atleta.</span></div></div>` : `<div class="abanner ok">${IC.check}<div><b>Nenhum alerta de prontidão ou carga hoje</b><span>Grupo dentro das faixas de monitoramento.</span></div></div>`}`;
  const extra = `${top}${panel('Alertas do grupo · ' + fmtD(d), A.html)}<div style="height:14px"></div>
  <div class="row r12" style="align-items:start">${panel('Prontidão do elenco (pré-treino)', prontPanel(A.L, d) + `<p class="muted pb" style="font-size:11.5px;margin:0">Prontidão = média das respostas do bem-estar (0–100%), descontando dor e hidratação ruim. PSR = recuperação percebida (0–10).</p>`, { np: true })}${panel('Carga diária · últimos 30 dias', graficoDiario(serieDiaria(cat, ids, addDays(d, -29), d), { w: 1000, h: 320 }))}</div><div style="height:14px"></div>`;
  const h = _fPse2(); const i = h.indexOf('<div class="row r21"'); return i < 0 ? h + extra : h.slice(0, i) + extra + h.slice(i);
};
const _fPseSem2 = fPseSem;
fPseSem = function () {
  const cat = catMon(); if (!UI.week) UI.week = segunda(todayISO()); const ids = new Set(atletasCat().map(a => a.id)); const fim = addDays(UI.week, 6) < todayISO() ? addDays(UI.week, 6) : todayISO(); const A = alertasGrupo(cat, fim);
  const extra = `${panel('Carga das últimas 6 semanas', graficoSemanal(serieSemanal(cat, ids, UI.week, 6), { w: 1200, h: 330 }))}<div style="height:14px"></div>${panel('Alertas do grupo · fim da semana', A.html)}<div style="height:14px"></div>`;
  const h = _fPseSem2(); const i = h.indexOf('<div class="panel"><div class="ph">Variação semanal de carga'); const j = h.search(/<div class="panel"\s*><div class="ph">Variação semanal de carga/); const k = j >= 0 ? j : i; return k < 0 ? h + extra : h.slice(0, k) + extra + h.slice(k);
};
// ficha do atleta · aba Carga com o gráfico diário individual e as semanas
const _fichaCarga = fichaCarga;
fichaCarga = function (a) {
  const h = _fichaCarga(a); if (!pseDe(a.id).length) return h; const d = todayISO(), ids = new Set([a.id]);
  const pr = prontidao(a.id, d);
  const g = panel('Carga diária · últimos 30 dias', graficoDiario(serieDiaria(a.categoria, ids, addDays(d, -29), d), { w: 1100, h: 300 })) + '<div style="height:12px"></div>' + panel('Carga das últimas 6 semanas', graficoSemanal(serieSemanal(a.categoria, ids, segunda(d), 6), { w: 1100, h: 300 }));
  const m = h.search(/<div class="panel"\s*><div class="ph">Carga diária · últimos 28 dias/); const e = h.search(/<div class="panel"\s*><div class="ph">Últimas sessões/);
  const head = pr ? `<div class="abanner ${pr.st[1]}" style="margin-bottom:12px">${pr.st[1] === 'ok' ? IC.check : IC.cross}<div><b>Prontidão hoje: ${pr.p}% (${pr.st[0]})</b><span>PSR ${pr.psr ?? '—'} · ${esc(beSt(pr.r).st)}</span></div></div>` : '';
  return m >= 0 && e > m ? head + h.slice(0, m) + g + '<div style="height:12px"></div>' + h.slice(e) : head + h;
};
// alerta de prontidão também no Início
const _vInicio3 = vInicio;
vInicio = function () {
  const h = _vInicio3(); const d = todayISO(), cat = catMon(); const A = alertasGrupo(cat, d); const baixa = A.L.filter(x => x.pr && x.pr.p < 60);
  if (!baixa.length && !A.tot) return h;
  const box = `<div class="abanner bad" style="margin-bottom:14px">${IC.cross}<div><b>Alertas de hoje: ${baixa.length} com prontidão baixa · ${A.tot} com alerta de carga</b><span>${[...baixa.map(x => (x.a.apelido || x.a.nome).split(' ')[0] + ' (' + x.pr.p + '%)')].slice(0, 8).join(', ')}${baixa.length ? ' · ' : ''}<button class="linkbtn" data-nav="mon-pse">abrir monitoramento</button></span></div></div>`;
  const i = h.indexOf('<div class="kpis k8">'); return i < 0 ? h : h.slice(0, i) + box + h.slice(i);
};

/* ================= PLANEJAMENTO · MACROCICLO, MICROCICLO, PLANO DE TREINO ================= */
IC.layers = I('<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>');
const PL_TABS = [['pl-macro', 'Macrociclo'], ['pl-micro', 'Microciclo'], ['pl-plano', 'Plano de treino']];
PL_TABS.forEach(([k, n]) => TITLES[k] = ['Planejamento', n]);
NAV.push({ k: 'plan', n: 'Planejamento', ic: IC.layers, sub: PL_TABS });
const MACRO_TIPOS = { periodo: 'Período', meso: 'Mesociclo', bloco: 'Evento / bloco' };
const MACRO_PER = ['Preparatório geral', 'Preparatório específico', 'Pré-competitivo', 'Competitivo', 'Transição'];
const MCOR = ['#1b8a4a', '#2f6fd6', '#f39324', '#7a3fd1', '#159aa8', '#e0342b', '#8a948f', '#ec3f93'];
const DIA_TIPOS = { treino: ['Treino', '#1b8a4a'], jogo: ['Jogo', '#e0342b'], recup: ['Recuperação', '#159aa8'], fisico: ['Treino físico', '#2f6fd6'], folga: ['Folga', '#8a948f'], aval: ['Avaliação', '#7a3fd1'] };
const SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const PARTES = ['Aquecimento', 'Parte inicial', 'Parte principal', 'Parte final', 'Volta à calma'];
UI.plCat = null; UI.week = null; UI.planoSel = null;
const catPl = () => UI.plCat || (F.categoria !== 'Todas' ? F.categoria : (S.atletas[0]?.categoria || 'Sub-15'));
const segunda = d => { const x = new Date(d + 'T12:00'); const w = (x.getDay() + 6) % 7; return addDays(d, -w); };
function jogosDaCat(cat) { return (window.MIN?.S.jogos || []).filter(j => j.categoria === cat && j.data); }
function mdLabel(d, cat) {
  const js = jogosDaCat(cat).map(j => j.data).sort(); if (js.includes(d)) return 'MD';
  const prox = js.find(x => x > d), ant = [...js].reverse().find(x => x < d);
  const dp = prox ? dayDiff(d, prox) : 99, da = ant ? dayDiff(ant, d) : 99;
  if (da <= 2 && da <= dp) return 'MD+' + da; if (dp <= 6) return 'MD-' + dp; return '';
}
function vPlan() {
  const body = { 'pl-macro': fMacro, 'pl-micro': fMicro, 'pl-plano': fPlano }[S.view] || fMacro;
  const h = header({ title: { 'pl-macro': 'MACROCICLO DA TEMPORADA', 'pl-micro': 'MICROCICLO SEMANAL', 'pl-plano': 'PLANO DE TREINO' }[S.view], sub: 'PLANEJAMENTO · PERIODIZAÇÃO', pill: catPl().toUpperCase().replace('-', ' '), items: hdrItems() });
  const catSel = `<div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><b style="font-family:var(--fc);font-size:18px;text-transform:uppercase">Categoria</b><div class="seg2">${Object.keys(GRUPOS).map(c => `<label><input type="radio" name="plCat" value="${c}" ${c === catPl() ? 'checked' : ''}>${c}</label>`).join('')}</div></div></div>`;
  if (PRINT) return h + '<div style="height:16px"></div>' + body();
  return h + `<nav class="rtabs">${PL_TABS.map(([k, n]) => `<button data-go="${k}" class="${S.view === k ? 'on' : ''}">${n}</button>`).join('')}</nav>` + catSel + body();
}

/* ---------- macrociclo ---------- */
function fMacro() {
  const cat = catPl(), ano = F.ano === 'Todos' ? todayISO().slice(0, 4) : F.ano, ini = ano + '-01-01', fim = ano + '-12-31', tot = dayDiff(ini, fim) + 1;
  const bl = (S.macro || []).filter(b => b.categoria === cat && b.fim >= ini && b.inicio <= fim).sort((a, b) => a.inicio.localeCompare(b.inicio));
  const pos = d => Math.max(0, Math.min(100, dayDiff(ini, d < ini ? ini : d > fim ? fim : d) / tot * 100));
  const bar = b => `<div class="gbar" style="left:${pos(b.inicio)}%;width:${Math.max(0.8, pos(b.fim) - pos(b.inicio) + 100 / tot)}%;background:${b.cor || MCOR[0]}" data-act="macro-edit" data-id="${b.id}" data-tip="${esc(b.nome)}\n${fmtD(b.inicio)} a ${fmtD(b.fim)} (${Math.round((dayDiff(b.inicio, b.fim) + 1) / 7)} sem.)${b.objetivo ? '\n' + esc(b.objetivo) : ''}">${esc(b.nome)}</div>`;
  const lane = (t, lbl) => `<div class="glane"><span class="gl">${lbl}</span><div class="gtrack">${bl.filter(b => b.tipo === t).map(bar).join('')}</div></div>`;
  const js = jogosDaCat(cat).filter(j => j.data >= ini && j.data <= fim);
  const tests = [...new Set((S.testes || []).filter(t => atl(t.atletaId)?.categoria === cat && t.data >= ini && t.data <= fim).map(t => t.data))];
  const hoje = todayISO();
  const months = MESES.map((m, i) => `<span style="left:${pos(ano + '-' + pad(i + 1) + '-01')}%">${m}</span>`).join('');
  const atual = bl.filter(b => b.inicio <= hoje && b.fim >= hoje);
  return `<div class="row r21" style="align-items:start">
    ${panel(`Linha do tempo · ${cat} · ${ano}`, `<div class="gantt"><div class="gmonths">${months}</div>${lane('periodo', 'Períodos')}${lane('meso', 'Mesociclos')}${lane('bloco', 'Eventos')}
      <div class="glane"><span class="gl">Jogos</span><div class="gtrack">${js.map(j => `<i class="gdot" style="left:${pos(j.data)}%;background:${resultado(j) === 'V' ? '#1b8a4a' : resultado(j) === 'D' ? '#e0342b' : '#8a948f'}" data-tip="${fmtD(j.data)} · ${esc(j.adversario || '')}\n${esc(j.competicao || '')} ${j.golsPro ?? ''}x${j.golsContra ?? ''}"></i>`).join('')}</div></div>
      <div class="glane"><span class="gl">Testes</span><div class="gtrack">${tests.map(d => `<i class="gdot sq" style="left:${pos(d)}%" data-tip="Sessão de testes · ${fmtD(d)}"></i>`).join('')}${(S.config.agenda || []).filter(x => x.categoria === cat && x.data >= ini && x.data <= fim).map(x => `<i class="gdot sq ag" style="left:${pos(x.data)}%" data-tip="Agendado · ${fmtD(x.data)}\n${esc(x.teste)}"></i>`).join('')}</div></div>
      ${hoje >= ini && hoje <= fim ? `<div class="ghoje" style="left:calc(110px + (100% - 110px) * ${pos(hoje) / 100})"><span>hoje</span></div>` : ''}
    </div><p class="muted" style="font-size:12px;margin:8px 0 0">Passe o mouse nas barras e pontos para ver os detalhes. Clique numa barra para editar.</p>`, { r: `<button data-act="macro-novo">+ Novo bloco</button>` })}
    ${panel('Momento atual', (atual.length ? atual.map(b => `<div class="sfrow"><span><i class="sq" style="background:${b.cor}"></i><b>${esc(b.nome)}</b></span><span class="muted">${MACRO_TIPOS[b.tipo]} · até ${fmtD(b.fim)}</span></div>${b.objetivo ? `<p style="margin:2px 0 8px;font-size:13px">${esc(b.objetivo)}</p>` : ''}`).join('') : miniEmpty('Nenhum bloco na data de hoje', 'Cadastre os períodos e mesociclos da temporada.')) + (() => { const pj = js.filter(j => j.data >= hoje)[0]; return `<div class="mini-stats" style="margin-top:10px"><div><span>Jogos no ano</span><b>${js.length}</b></div><div><span>Próximo jogo</span><b style="font-size:16px">${pj ? fmtDs(pj.data) + ' · ' + esc(pj.adversario || '') : '—'}</b></div></div>`; })())}
  </div>
  ${panel('Blocos do planejamento', bl.length ? `<table class="t"><thead><tr><th>Tipo</th><th class="l">Nome</th><th>Início</th><th>Fim</th><th>Semanas</th><th class="l">Objetivo</th><th></th></tr></thead><tbody>${bl.map(b => `<tr><td>${MACRO_TIPOS[b.tipo]}</td><td class="l"><span class="sq" style="background:${b.cor}"></span><b>${esc(b.nome)}</b></td><td>${fmtD(b.inicio)}</td><td>${fmtD(b.fim)}</td><td>${Math.round((dayDiff(b.inicio, b.fim) + 1) / 7)}</td><td class="l" style="white-space:normal">${esc(b.objetivo || '')}</td><td style="white-space:nowrap"><button class="icon-btn" data-act="macro-edit" data-id="${b.id}" aria-label="Editar">${IC.edit}</button><button class="icon-btn" data-act="macro-del" data-id="${b.id}" aria-label="Excluir" style="color:var(--red)">${IC.trash}</button></td></tr>`).join('')}</tbody></table>` : miniEmpty('Nenhum bloco cadastrado', 'Comece pelos períodos (preparatório, competitivo, transição) e depois os mesociclos.'), { np: !!bl.length, r: `<button data-act="macro-novo">+ Novo bloco</button>` })}`;
}
function formMacro(b = {}) {
  openModal(mh(b.id ? 'Editar bloco' : 'Novo bloco do macrociclo') + `<form id="fMc" novalidate><div class="mb"><div class="form">
    <div class="f"><label for="mcT">Tipo</label><select id="mcT">${Object.entries(MACRO_TIPOS).map(([k, n]) => `<option value="${k}" ${(b.tipo || 'periodo') === k ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
    <div class="f s2"><label for="mcN">Nome *</label><input id="mcN" list="mcSug" value="${esc(b.nome || '')}" required><datalist id="mcSug">${MACRO_PER.map(p => `<option value="${p}">`).join('')}<option value="Mesociclo 1 · Base"><option value="Mesociclo 2 · Desenvolvimento"><option value="Mesociclo 3 · Polimento"></datalist></div>
    <div class="f"><label for="mcCat">Categoria</label><select id="mcCat">${opts(Object.keys(GRUPOS), b.categoria || catPl())}</select></div>
    <div class="f"><label for="mcI">Início *</label><input id="mcI" type="date" value="${esc(b.inicio || todayISO())}" required></div>
    <div class="f"><label for="mcF">Fim *</label><input id="mcF" type="date" value="${esc(b.fim || addDays(todayISO(), 27))}" required></div>
    <div class="f s2"><span>Cor</span><div class="cores">${MCOR.map(c => `<label><input type="radio" name="mcCor" value="${c}" ${(b.cor || MCOR[0]) === c ? 'checked' : ''}><i style="background:${c}"></i></label>`).join('')}</div></div>
    <div class="f s4"><label for="mcO">Objetivo / ênfase</label><textarea id="mcO" placeholder="Ex.: base aeróbia, força geral, adaptação técnica">${esc(b.objetivo || '')}</textarea></div>
  </div></div><div class="mf"><span class="msg" id="mcErr"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar</button></div></form>`);
  $('#fMc').onsubmit = e => { e.preventDefault(); const o = { ...b, id: b.id || uid('mc'), tipo: $('#mcT').value, nome: $('#mcN').value.trim(), categoria: $('#mcCat').value, inicio: $('#mcI').value, fim: $('#mcF').value, cor: ($('input[name=mcCor]:checked') || {}).value || MCOR[0], objetivo: $('#mcO').value.trim() }; if (o.fim < o.inicio) return $('#mcErr').textContent = 'O fim precisa ser depois do início.'; save('macro', o); closeModal(); toast('Bloco salvo'); };
}

/* ---------- microciclo ---------- */
function fMicro() {
  const cat = catPl(); if (!UI.week) UI.week = segunda(todayISO()); const w0 = UI.week; const dias = Array.from({ length: 7 }, (_, i) => addDays(w0, i));
  const reg = d => (S.micro || []).find(m => m.categoria === cat && m.data === d);
  const ids = new Set(S.atletas.filter(a => a.categoria === cat).map(a => a.id));
  const real = d => { const l = (S.pse || []).filter(r => r.data === d && ids.has(r.atletaId)); return l.length ? Math.round(mean(l.map(carga))) : null; };
  const meso = (S.macro || []).filter(b => b.categoria === cat && b.inicio <= dias[6] && b.fim >= dias[0]);
  const prev = dias.map(d => { const r = reg(d); return r && r.pse && r.duracao ? r.pse * r.duracao : 0; }), exe = dias.map(real);
  const card = (d, i) => { const r = reg(d), md = mdLabel(d, cat), tp = r ? DIA_TIPOS[r.tipo] || DIA_TIPOS.treino : null, pl = (S.planos || []).find(p => p.categoria === cat && p.data === d), jg = jogosDaCat(cat).find(j => j.data === d);
    return `<div class="mday ${d === todayISO() ? 'today' : ''}" data-act="micro-edit" data-d="${d}" role="button" tabindex="0" aria-label="Editar ${SEMANA[i]} ${fmtDs(d)}"><div class="mdh"><b>${SEMANA[i]}</b><span>${fmtDs(d)}</span>${md ? `<em class="${md === 'MD' ? 'mdg' : ''}">${md}</em>` : ''}</div>
      ${r ? `<div class="mdt" style="background:${tp[1]}">${tp[0]}</div><div class="mdb"><b>${esc(r.titulo || '')}</b>${r.conteudo ? `<p>${esc(r.conteudo)}</p>` : ''}<div class="mdm">${r.duracao ? `<span>${IC.clock}${r.duracao}'</span>` : ''}${r.pse ? `<span>${IC.gauge}PSE ${r.pse}</span>` : ''}${r.pse && r.duracao ? `<span>${r.pse * r.duracao} UA</span>` : ''}</div></div>` : `<div class="mdempty">${jg ? `Jogo · ${esc(jg.adversario || '')}` : '+ planejar dia'}</div>`}
      ${pl ? `<button class="mdpl" data-act="plano-ver" data-id="${pl.id}">${IC.clip} ${esc(pl.titulo)}</button>` : r && r.tipo !== 'folga' && r.tipo !== 'jogo' ? `<button class="mdpl add" data-act="plano-novo" data-d="${d}">+ plano de treino</button>` : ''}</div>`; };
  const totP = prev.reduce((a, b) => a + b, 0), totE = exe.reduce((a, b) => a + (b || 0), 0);
  return `<div class="panel" style="margin-bottom:14px"><div class="pb wkbar"><button class="btn sm" data-act="wk" data-d="${addDays(w0, -7)}" aria-label="Semana anterior">‹</button><b>Semana de ${fmtD(dias[0])} a ${fmtD(dias[6])}</b><button class="btn sm" data-act="wk" data-d="${addDays(w0, 7)}" aria-label="Próxima semana">›</button><button class="btn sm" data-act="wk" data-d="${segunda(todayISO())}">Esta semana</button>${meso.map(b => `<span class="mesotag" style="background:${b.cor}22;color:${b.cor};border-color:${b.cor}66">${esc(b.nome)}</span>`).join('')}<span style="flex:1"></span><button class="btn sm" data-act="wk-copy">${IC.cycle} Copiar semana anterior</button></div></div>
  <div class="mweek">${dias.map(card).join('')}</div>
  <div class="row r21" style="margin-top:14px">
    ${panel('Carga planejada x executada', iBars(dias.map((d, i) => SEMANA[i] + ' ' + fmtDs(d)), [{ n: 'Planejada (PSE alvo × min)', c: '#9aa5a0', vals: prev }, { n: 'Executada (média PSE da equipe)', c: '#1b8a4a', vals: exe.map(v => v || 0) }], { w: 900, h: 240 }) + `<div class="legend-status" style="justify-content:center"><span><span class="sq" style="background:#9aa5a0"></span>Planejada</span><span><span class="sq" style="background:#1b8a4a"></span>Executada (PSE)</span></div>`)}
    ${panel('Resumo da semana', `<div class="mini-stats"><div><span>Carga planejada</span><b>${totP} UA</b></div><div><span>Carga executada</span><b>${totE || '—'} ${totE ? 'UA' : ''}</b></div><div><span>Sessões</span><b>${dias.filter(d => reg(d) && !['folga'].includes(reg(d).tipo)).length}</b></div><div><span>Jogos</span><b>${dias.filter(d => jogosDaCat(cat).some(j => j.data === d)).length}</b></div></div><p class="muted" style="font-size:12px;margin:10px 0 0">MD = dia de jogo; MD-1, MD-2… = dias antes do jogo; MD+1 = dia seguinte. Calculado a partir dos jogos cadastrados.</p>`)}
  </div>`;
}
function formMicro(d) {
  const cat = catPl(), r = (S.micro || []).find(m => m.categoria === cat && m.data === d) || {}, md = mdLabel(d, cat);
  openModal(mh(`Planejar ${SEMANA[(new Date(d + 'T12:00').getDay() + 6) % 7]} ${fmtD(d)}${md ? ' · ' + md : ''}`) + `<form id="fMi" novalidate><div class="mb"><div class="form">
    <div class="f"><label for="miT">Tipo do dia</label><select id="miT">${Object.entries(DIA_TIPOS).map(([k, [n]]) => `<option value="${k}" ${(r.tipo || (md === 'MD' ? 'jogo' : 'treino')) === k ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
    <div class="f s3" style="grid-column:span 3"><label for="miTi">Título / ênfase</label><input id="miTi" value="${esc(r.titulo || '')}" placeholder="Ex.: Força + jogos reduzidos 4x4"></div>
    <div class="f"><label for="miD">Duração prevista (min)</label><input id="miD" type="number" min="0" max="240" value="${r.duracao ?? (md === 'MD' ? 90 : 75)}"></div>
    <div class="f"><label for="miP">PSE alvo (0–10)</label><select id="miP"><option value="">—</option>${PSE_ESC.map((e, i) => `<option value="${i}" ${r.pse === i ? 'selected' : ''}>${i} · ${e}</option>`).join('')}</select></div>
    <div class="f s2"><span>Carga prevista</span><b id="miC" style="font-family:var(--fc);font-size:22px">—</b></div>
    <div class="f s4"><label for="miCo">Conteúdo / observações</label><textarea id="miCo" placeholder="Objetivos técnicos, táticos e físicos do dia">${esc(r.conteudo || '')}</textarea></div>
  </div></div><div class="mf">${r.id ? `<button type="button" class="btn danger" data-act="micro-del" data-id="${r.id}" style="margin-right:auto">${IC.trash} Limpar dia</button>` : ''}<button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar</button></div></form>`);
  const c = () => { const p = $('#miP').value, du = +$('#miD').value || 0; $('#miC').textContent = p !== '' ? (+p * du) + ' UA' : '—'; }; $('#fMi').addEventListener('input', c); $('#fMi').addEventListener('change', c); c();
  $('#fMi').onsubmit = e => { e.preventDefault(); const o = { ...r, id: r.id || `mi_${cat}_${d}`, categoria: cat, data: d, tipo: $('#miT').value, titulo: $('#miTi').value.trim(), duracao: +$('#miD').value || 0, pse: $('#miP').value === '' ? null : +$('#miP').value, conteudo: $('#miCo').value.trim() }; save('micro', o); closeModal(); toast('Dia planejado'); };
}

/* ---------- plano de treino ---------- */
function planoHTML(p, print) {
  const ex = p.exercicios || []; const tot = ex.reduce((s, x) => s + (+x.duracao || 0), 0);
  return `<div class="plano">
    <div class="plh"><div><h3>${esc(p.titulo)}</h3><p>${fmtD(p.data)} · ${esc(p.categoria)} · ${p.duracao || tot} min${p.local ? ' · ' + esc(p.local) : ''}${p.responsavel ? ' · ' + esc(p.responsavel) : ''}</p></div>${(() => { const md = mdLabel(p.data, p.categoria); return md ? `<span class="mdbig">${md}</span>` : ''; })()}</div>
    <div class="plk"><div><small>Objetivo</small><b>${esc(p.objetivo || '—')}</b></div><div><small>PSE alvo</small><b>${p.pse != null && p.pse !== '' ? p.pse + ' · ' + PSE_ESC[p.pse] : '—'}</b></div><div><small>Carga prevista</small><b>${p.pse && (p.duracao || tot) ? p.pse * (p.duracao || tot) + ' UA' : '—'}</b></div><div><small>Materiais</small><b>${esc(p.materiais || '—')}</b></div></div>
    ${PARTES.filter(pt => ex.some(x => x.parte === pt)).map(pt => `<div class="plp"><h4>${pt} <small>${ex.filter(x => x.parte === pt).reduce((s, x) => s + (+x.duracao || 0), 0)} min</small></h4>${ex.filter(x => x.parte === pt).map((x, i) => `<div class="plx"><span class="pxn">${i + 1}</span><div><b>${esc(x.nome)}</b>${x.desc ? `<p>${esc(x.desc)}</p>` : ''}<div class="pxm">${x.duracao ? `<span>${IC.clock} ${x.duracao} min</span>` : ''}${x.series ? `<span>${esc(x.series)}</span>` : ''}${x.espaco ? `<span>${esc(x.espaco)}</span>` : ''}${x.pse ? `<span>PSE ${x.pse}</span>` : ''}</div></div></div>`).join('')}</div>`).join('') || miniEmpty('Sem exercícios', 'Edite o plano para adicionar as atividades.')}
    ${p.obs ? `<div class="plp"><h4>Observações</h4><p style="margin:0">${esc(p.obs)}</p></div>` : ''}
  </div>`;
}
function fPlano() {
  const cat = catPl(); const l = (S.planos || []).filter(p => p.categoria === cat).sort((a, b) => b.data.localeCompare(a.data));
  if (!l.find(p => p.id === UI.planoSel)) UI.planoSel = l[0]?.id;
  const p = l.find(x => x.id === UI.planoSel);
  return `<div class="row r12" style="align-items:start">
    ${panel(`Planos · ${cat}`, l.length ? `<table class="t"><thead><tr><th>Data</th><th class="l">Título</th><th>Min</th></tr></thead><tbody>${l.map(x => `<tr class="click ${x.id === UI.planoSel ? 'rowsel' : ''}" data-act="plano-sel" data-id="${x.id}"><td>${fmtDs(x.data)}<br><small class="muted">${mdLabel(x.data, x.categoria)}</small></td><td class="l"><b>${esc(x.titulo)}</b><br><small class="muted">${esc(x.objetivo || '')}</small></td><td>${typeof durEf === 'function' ? durEf(x) : x.duracao || 0}</td></tr>`).join('')}</tbody></table>` : miniEmpty('Nenhum plano de treino', 'Crie o primeiro plano.'), { np: !!l.length, r: `<button data-act="plano-novo">+ Novo plano</button>` })}
    ${p ? `<div class="panel"><div class="ph">Plano de treino<span class="r"><button data-act="plano-edit" data-id="${p.id}">Editar</button> <button data-act="plano-dup" data-id="${p.id}">Duplicar</button> <button data-act="plano-print" data-id="${p.id}">Imprimir / PDF</button> <button data-act="plano-del" data-id="${p.id}">Excluir</button></span></div><div class="pb">${planoHTML(p)}</div></div>` : panel('Plano de treino', `<div class="empty" style="border:0"><h3>Monte o plano da sessão</h3>Aquecimento, parte principal e volta à calma, com tempo, organização e PSE alvo de cada atividade.<div class="acts"><button class="btn pri" data-act="plano-novo">${IC.plus} Novo plano de treino</button></div></div>`)}
  </div>`;
}
function formPlano(p = {}, data) {
  const cat = p.categoria || catPl(); const profs = (S.config.profissionais || []).map(x => x.nome).filter(Boolean);
  let ex = (p.exercicios || [{ parte: 'Aquecimento', nome: '', duracao: 15 }, { parte: 'Parte principal', nome: '', duracao: 45 }, { parte: 'Volta à calma', nome: '', duracao: 10 }]).map(x => ({ ...x }));
  openModal(mh(p.id ? 'Editar plano de treino' : 'Novo plano de treino') + `<form id="fPl"><div class="mb"><div class="form">
    <div class="f s2"><label for="plT">Título *</label><input id="plT" value="${esc(p.titulo || '')}" placeholder="Ex.: Transição ofensiva + força" required></div>
    <div class="f"><label for="plD">Data *</label><input id="plD" type="date" value="${esc(p.data || data || todayISO())}" required></div>
    <div class="f"><label for="plC">Categoria</label><select id="plC">${opts(Object.keys(GRUPOS), cat)}</select></div>
    <div class="f s2"><label for="plO">Objetivo</label><input id="plO" value="${esc(p.objetivo || '')}" placeholder="Ex.: melhorar a reação após a perda da bola"></div>
    <div class="f"><label for="plP">PSE alvo</label><select id="plP"><option value="">—</option>${PSE_ESC.map((e, i) => `<option value="${i}" ${p.pse === i ? 'selected' : ''}>${i} · ${e}</option>`).join('')}</select></div>
    <div class="f"><label for="plR">Responsável</label><select id="plR"><option value="">—</option>${opts(profs, p.responsavel)}</select></div>
    <div class="f s2"><label for="plM">Materiais</label><input id="plM" value="${esc(p.materiais || '')}" placeholder="Bolas, cones, coletes, mini-gols"></div>
    <div class="f s2"><label for="plL">Local</label><input id="plL" value="${esc(p.local || '')}" placeholder="Campo 1"></div>
  </div><div class="fsec">Atividades</div><div id="plEx"></div><button type="button" class="btn sm" data-act="plx-add">${IC.plus} Adicionar atividade</button>
  <div class="f"><label for="plOb">Observações</label><textarea id="plOb">${esc(p.obs || '')}</textarea></div>
  </div><div class="mf"><span class="msg" id="plErr"></span><span class="muted" id="plTot" style="margin-right:auto"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar plano</button></div></form>`, true);
  const draw = () => { $('#plEx').innerHTML = ex.map((x, i) => `<div class="plrow" data-i="${i}"><select data-k="parte">${opts(PARTES, x.parte)}</select><input data-k="nome" value="${esc(x.nome || '')}" placeholder="Atividade (ex.: Rondo 5x2)"><input data-k="duracao" type="number" min="0" max="120" value="${esc(x.duracao ?? '')}" placeholder="min"><input data-k="series" value="${esc(x.series || '')}" placeholder="Séries / reps"><input data-k="espaco" value="${esc(x.espaco || '')}" placeholder="Espaço"><select data-k="pse"><option value="">PSE</option>${PSE_ESC.map((e, k) => `<option value="${k}" ${+x.pse === k && x.pse !== '' && x.pse != null ? 'selected' : ''}>${k}</option>`).join('')}</select><button type="button" class="icon-btn" data-act="plx-up" data-i="${i}" aria-label="Subir">↑</button><button type="button" class="icon-btn" data-act="plx-del" data-i="${i}" aria-label="Remover" style="color:var(--red)">${IC.trash}</button><textarea data-k="desc" placeholder="Organização / regras / pontos de atenção">${esc(x.desc || '')}</textarea></div>`).join(''); tot(); };
  const tot = () => { $('#plTot').textContent = `Total: ${ex.reduce((s, x) => s + (+x.duracao || 0), 0)} min`; };
  $('#plEx').addEventListener('input', e => { const r = e.target.closest('.plrow'); if (!r || !e.target.dataset.k) return; ex[+r.dataset.i][e.target.dataset.k] = e.target.value; tot(); });
  $('#plEx').addEventListener('change', e => { const r = e.target.closest('.plrow'); if (!r || !e.target.dataset.k) return; ex[+r.dataset.i][e.target.dataset.k] = e.target.value; });
  $('#fPl').addEventListener('click', e => { const b = e.target.closest('[data-act^="plx-"]'); if (!b) return; e.preventDefault(); e.stopPropagation(); const i = +b.dataset.i; if (b.dataset.act === 'plx-add') ex.push({ parte: ex[ex.length - 1]?.parte || 'Parte principal', nome: '', duracao: 10 }); if (b.dataset.act === 'plx-del') ex.splice(i, 1); if (b.dataset.act === 'plx-up' && i > 0) [ex[i - 1], ex[i]] = [ex[i], ex[i - 1]]; draw(); });
  draw();
  $('#fPl').onsubmit = e => { e.preventDefault(); const exs = ex.filter(x => (x.nome || '').trim()).map(x => ({ parte: x.parte, nome: x.nome.trim(), duracao: +x.duracao || 0, series: x.series || '', espaco: x.espaco || '', pse: x.pse === '' || x.pse == null ? null : +x.pse, desc: x.desc || '' })); const o = { ...p, id: p.id || uid('pl'), titulo: $('#plT').value.trim(), data: $('#plD').value, categoria: $('#plC').value, objetivo: $('#plO').value.trim(), pse: $('#plP').value === '' ? null : +$('#plP').value, responsavel: $('#plR').value, materiais: $('#plM').value.trim(), local: $('#plL').value.trim(), obs: $('#plOb').value.trim(), exercicios: exs, duracao: exs.reduce((s, x) => s + x.duracao, 0) }; if (!o.titulo) return $('#plErr').textContent = 'Informe o título.'; save('planos', o); UI.planoSel = o.id; UI.plCat = o.categoria; closeModal(); if (S.view !== 'pl-plano') go('pl-plano'); toast('Plano salvo'); };
}
function imprimirPlano(id, pdf) {
  const p = (S.planos || []).find(x => x.id === id); if (!p) return;
  const v0 = S.view; S.view = 'pl-plano'; PRINT = true;
  const pages = [pageWrap(header({ title: 'PLANO DE TREINO', sub: 'PLANEJAMENTO · SESSÃO DE TREINO', pill: p.categoria.toUpperCase().replace('-', ' '), items: [['cal', 'Data', fmtD(p.data)], ['clock', 'Duração', (p.duracao || 0) + ' min']] }) + '<div style="height:14px"></div>' + `<div class="panel grow"><div class="pb">${planoHTML(p, true)}</div></div>`)];
  PRINT = false; S.view = v0;
  if (pdf) gerarPDF(pages, 'plano'); else imprimir(pages);
}

/* ---------- ações ---------- */
dmOn('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return; const id = t.dataset.id;
  switch (t.dataset.act) {
    case 'macro-novo': formMacro(); break;
    case 'macro-edit': formMacro((S.macro || []).find(b => b.id === id)); break;
    case 'macro-del': confirmar('Excluir este bloco do planejamento?', () => { remove('macro', id); toast('Bloco excluído'); }); break;
    case 'wk': UI.week = segunda(t.dataset.d); render(); break;
    case 'wk-copy': { const cat = catPl(), w0 = UI.week, docs = []; for (let i = 0; i < 7; i++) { const src = (S.micro || []).find(m => m.categoria === cat && m.data === addDays(w0, i - 7)); if (src) docs.push({ ...src, id: `mi_${cat}_${addDays(w0, i)}`, data: addDays(w0, i) }); } if (!docs.length) { toast('A semana anterior está vazia.', true); break; } saveMany('micro', docs).then(() => { render(); toast(`${docs.length} dia(s) copiado(s)`); }); break; }
    case 'micro-edit': if (e.target.closest('.mdpl')) break; formMicro(t.dataset.d); break;
    case 'micro-del': remove('micro', id); closeModal(); toast('Dia limpo'); break;
    case 'plano-novo': e.stopPropagation(); formPlano({}, t.dataset.d); break;
    case 'plano-ver': e.stopPropagation(); UI.planoSel = id; go('pl-plano'); break;
    case 'plano-sel': UI.planoSel = id; render(); break;
    case 'plano-edit': formPlano((S.planos || []).find(p => p.id === id)); break;
    case 'plano-dup': { const p = (S.planos || []).find(x => x.id === id); formPlano({ ...p, id: undefined, titulo: p.titulo + ' (cópia)', data: todayISO() }); break; }
    case 'plano-del': confirmar('Excluir este plano de treino?', () => { remove('planos', id); toast('Plano excluído'); }); break;
    case 'plano-print': openModal(mh('Imprimir plano de treino') + `<div class="mb"><p style="margin:0">Folha 16:9 com o plano completo.</p></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn" data-act="plano-imp" data-id="${id}">${IC.print} Imprimir</button><button class="btn pri" data-act="plano-pdf" data-id="${id}">${IC.pdf} Baixar PDF</button></div>`); break;
    case 'plano-imp': closeModal(); imprimirPlano(id); break;
    case 'plano-pdf': closeModal(); imprimirPlano(id, true); break;
  }
});
dmOn('change', e => { if (e.target.name === 'plCat') { UI.plCat = e.target.value; render(); } });
dmOn('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.mday')) { e.preventDefault(); formMicro(e.target.dataset.d); } });

/* ================= PLANO DE TREINO · FICHA DO CLUBE + PRANCHETA TÁTICA + ACADEMIA ================= */
const METODOS_CAMPO = ['Ativação', 'Aquecimento', 'Rondo', 'Posse de bola', 'Jogo reduzido', 'Jogo condicionado', 'Circuito técnico', 'Finalização', 'Cruzamento e finalização', 'Transição', 'Organização ofensiva', 'Organização defensiva', 'Bola parada', 'Velocidade / agilidade', 'Coordenação', 'Resistência intermitente', 'Coletivo (11x11)', 'Recuperação', 'Volta à calma'];
const METODOS_ACAD = ['Força MMII e core', 'Força MMSS', 'Força total', 'Potência', 'Pliometria', 'Prevenção de lesões', 'Mobilidade', 'Estabilidade / core', 'Hipertrofia', 'Recuperação'];
const EXER_LIB = ['Agachamento livre', 'Agachamento unilateral', 'Agachamento búlgaro', 'Barra hexagonal isometria', 'Levantamento terra', 'Stiff', 'Stiff unilateral', 'Nórdico', 'Afundo', 'Afundo em isometria', 'Elevação pélvica', 'Elevação pélvica unilateral', 'Panturrilha no Smith', 'Panturrilha unilateral', 'Subida na caixa com barra', 'Jump squat', 'Salto na caixa', 'Bound com reatividade', 'Dobradiça de quadril', 'Copenhagen (adutor)', 'Core - prancha frontal', 'Core - prancha lateral', 'Supino', 'Remada', 'Desenvolvimento', 'Puxada', 'Mobilidade de tornozelo', 'Mobilidade de quadril', 'FIFA 11+'];
const PAD_OBJS = {
  jA: ['Jogador (verde)', '#1b8a4a'], jB: ['Jogador (amarelo)', '#f2b81b'], jC: ['Jogador (vermelho)', '#e0342b'], gk: ['Goleiro', '#2f6fd6'], cur: ['Coringa', '#ffffff'],
  cone: ['Cone', '#f39324'], prato: ['Pratinho', '#f6c21c'], estaca: ['Estaca', '#e0342b'], bola: ['Bola', '#ffffff'], mini: ['Mini-gol', '#ffffff'], gol: ['Gol', '#ffffff'], escada: ['Escada', '#f6c21c'], barreira: ['Barreira', '#e0342b'], manequim: ['Manequim', '#8a948f']
};
UI.pad = null; // estado do editor da prancheta
function campoSVG(pad = {}, o = {}) {
  const W = 600, H = 390; const objs = pad.objs || [], setas = pad.setas || [];
  const meio = pad.campo === 'meio';
  const stripes = Array.from({ length: 10 }, (_, i) => `<rect x="${i * W / 10}" y="0" width="${W / 10}" height="${H}" fill="${i % 2 ? '#2f8f3a' : '#36a043'}"/>`).join('');
  const lines = meio
    ? `<rect x="20" y="20" width="${W - 40}" height="${H - 40}" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M${W / 2 - 120} 20v80h240v-80M${W / 2 - 55} 20v32h110v-32" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M${W / 2 - 50} 100a50 50 0 0 0 100 0" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="${W / 2}" cy="${H - 20}" r="50" fill="none" stroke="#fff" stroke-width="2.5"/>`
    : `<rect x="15" y="15" width="${W - 30}" height="${H - 30}" fill="none" stroke="#fff" stroke-width="2.5"/><line x1="${W / 2}" y1="15" x2="${W / 2}" y2="${H - 15}" stroke="#fff" stroke-width="2.5"/><circle cx="${W / 2}" cy="${H / 2}" r="45" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="${W / 2}" cy="${H / 2}" r="3" fill="#fff"/><path d="M15 ${H / 2 - 95}h85v190h-85M15 ${H / 2 - 45}h32v90h-32M${W - 15} ${H / 2 - 95}h-85v190h85M${W - 15} ${H / 2 - 45}h-32v90h32" fill="none" stroke="#fff" stroke-width="2.5"/>`;
  const X = v => v / 100 * W, Y = v => v / 100 * H;
  const obj = (b, i) => { const x = X(b.x), y = Y(b.y), t = b.t, c = (PAD_OBJS[t] || [, '#fff'])[1]; let g = '';
    if (t.startsWith('j') || t === 'gk' || t === 'cur') g = `<circle r="11" fill="${c}" stroke="#14201a" stroke-width="2"/>${b.n ? `<text y="4" text-anchor="middle" font-size="11" font-weight="800" fill="${t === 'jB' || t === 'cur' ? '#14201a' : '#fff'}">${esc(b.n)}</text>` : ''}`;
    else if (t === 'cone') g = `<path d="M0 -11 L9 9 H-9 Z" fill="${c}" stroke="#8a3b00" stroke-width="1.5"/>`;
    else if (t === 'prato') g = `<ellipse rx="9" ry="5" fill="${c}" stroke="#8a6200" stroke-width="1.5"/>`;
    else if (t === 'estaca') g = `<rect x="-2.5" y="-14" width="5" height="28" rx="2" fill="${c}" stroke="#fff" stroke-width="1"/>`;
    else if (t === 'bola') g = `<circle r="6" fill="#fff" stroke="#14201a" stroke-width="1.5"/><circle r="2.2" fill="#14201a"/>`;
    else if (t === 'mini') g = `<rect x="-13" y="-7" width="26" height="14" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M-13 -7l4 -4h18l4 4" fill="none" stroke="#fff" stroke-width="1.5"/>`;
    else if (t === 'gol') g = `<rect x="-24" y="-9" width="48" height="18" fill="rgba(255,255,255,.15)" stroke="#fff" stroke-width="3"/>`;
    else if (t === 'escada') g = `<rect x="-30" y="-8" width="60" height="16" fill="none" stroke="${c}" stroke-width="2"/>${[-15, 0, 15].map(v => `<line x1="${v}" y1="-8" x2="${v}" y2="8" stroke="${c}" stroke-width="2"/>`).join('')}`;
    else if (t === 'barreira') g = `<path d="M-12 8V-6H12V8" fill="none" stroke="${c}" stroke-width="3"/>`;
    else if (t === 'manequim') g = `<rect x="-6" y="-14" width="12" height="28" rx="5" fill="${c}" stroke="#fff" stroke-width="1"/>`;
    return `<g class="pobj" data-i="${i}" transform="translate(${x} ${y}) rotate(${b.r || 0})" ${o.edit ? 'style="cursor:move"' : ''}>${g}</g>`; };
  const seta = (s, i) => `<line class="pseta" data-s="${i}" x1="${X(s.x1)}" y1="${Y(s.y1)}" x2="${X(s.x2)}" y2="${Y(s.y2)}" stroke="${s.tipo === 'passe' ? '#fff' : s.tipo === 'conducao' ? '#f6c21c' : '#14201a'}" stroke-width="3" ${s.tipo === 'movimento' ? 'stroke-dasharray="8 6"' : s.tipo === 'conducao' ? 'stroke-dasharray="2 5" stroke-linecap="round"' : ''} marker-end="url(#ah-${s.tipo || 'passe'})"/>`;
  const defs = `<defs>${['passe', 'movimento', 'conducao'].map(k => `<marker id="ah-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${k === 'passe' ? '#fff' : k === 'conducao' ? '#f6c21c' : '#14201a'}"/></marker>`).join('')}</defs>`;
  const area = pad.area ? `<rect x="${X(pad.area.x)}" y="${Y(pad.area.y)}" width="${X(pad.area.w)}" height="${Y(pad.area.h)}" fill="rgba(255,255,255,.12)" stroke="#fff" stroke-width="2" stroke-dasharray="6 5"/>` : '';
  return `<svg class="padsvg" viewBox="0 0 ${W} ${H}" ${o.id ? `id="${o.id}"` : ''} xmlns="http://www.w3.org/2000/svg">${defs}${stripes}${lines}${area}${setas.map(seta).join('')}${objs.map(obj).join('')}</svg>`;
}
function abrirPrancheta(bloco, onSave) {
  UI.pad = { pad: JSON.parse(JSON.stringify(bloco.pad || { campo: 'inteiro', objs: [], setas: [] })), tool: 'jA', onSave, seta: null, num: 1 };
  const ov = document.createElement('div'); ov.className = 'padov'; ov.innerHTML = `<div class="padbox"><div class="padhd"><b>Prancheta tática</b><span class="muted">Escolha um item e clique no campo para colocar · arraste para mover · clique com o botão direito (ou na lixeira) para remover</span><span style="flex:1"></span><button class="btn sm" data-pad="clear">${IC.trash} Limpar</button><button class="btn sm" data-pad="cancel">Cancelar</button><button class="btn sm pri" data-pad="ok">${IC.check} Usar no plano</button></div>
    <div class="padtools">${Object.entries(PAD_OBJS).map(([k, [n, c]]) => `<button data-tool="${k}" class="${k === 'jA' ? 'on' : ''}" title="${n}"><svg viewBox="-16 -16 32 32" width="26" height="26">${campoSVG({ objs: [{ t: k, x: 50, y: 50 }] }).match(/<g class="pobj"[^>]*>([\s\S]*?)<\/g>/)[1]}</svg><span>${n}</span></button>`).join('')}<span class="padsep"></span>${[['passe', 'Seta de passe'], ['movimento', 'Movimento'], ['conducao', 'Condução']].map(([k, n]) => `<button data-tool="seta-${k}" title="${n}"><svg width="26" height="26" viewBox="0 0 26 26"><line x1="3" y1="20" x2="22" y2="6" stroke="${k === 'passe' ? '#14201a' : k === 'conducao' ? '#d99c1f' : '#14201a'}" stroke-width="3" ${k === 'movimento' ? 'stroke-dasharray="4 3"' : k === 'conducao' ? 'stroke-dasharray="1 4" stroke-linecap="round"' : ''}/></svg><span>${n}</span></button>`).join('')}<button data-tool="area" title="Área do exercício"><svg width="26" height="26" viewBox="0 0 26 26"><rect x="3" y="5" width="20" height="16" fill="none" stroke="#14201a" stroke-width="2" stroke-dasharray="3 2"/></svg><span>Área</span></button><button data-tool="del" title="Apagar"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e0342b" stroke-width="2">${I('<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>').match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1]}</svg><span>Apagar</span></button></div>
    <div class="padopts"><label>Campo <select data-padopt="campo"><option value="inteiro">Campo inteiro</option><option value="meio" ${UI.pad.pad.campo === 'meio' ? 'selected' : ''}>Meio-campo</option></select></label><label>Nº do próximo jogador <input type="number" min="0" max="99" value="1" data-padopt="num" style="width:60px"></label><label><input type="checkbox" data-padopt="numerar" checked> Numerar jogadores</label></div>
    <div class="padstage" id="padStage">${campoSVG(UI.pad.pad, { edit: true, id: 'padSvg' })}</div></div>`;
  document.body.appendChild(ov);
  const redraw = () => { $('#padStage').innerHTML = campoSVG(UI.pad.pad, { edit: true, id: 'padSvg' }); };
  const pt = e => { const s = $('#padSvg'), r = s.getBoundingClientRect(); return { x: Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)), y: Math.max(0, Math.min(100, (e.clientY - r.top) / r.height * 100)) }; };
  let drag = null;
  ov.addEventListener('click', e => { const b = e.target.closest('[data-tool]'); if (b) { UI.pad.tool = b.dataset.tool; ov.querySelectorAll('[data-tool]').forEach(x => x.classList.toggle('on', x === b)); UI.pad.seta = null; } const a = e.target.closest('[data-pad]'); if (a) { if (a.dataset.pad === 'ok') { UI.pad.onSave(UI.pad.pad); ov.remove(); } if (a.dataset.pad === 'cancel') ov.remove(); if (a.dataset.pad === 'clear') { UI.pad.pad.objs = []; UI.pad.pad.setas = []; delete UI.pad.pad.area; redraw(); } } });
  ov.addEventListener('change', e => { const o = e.target.dataset.padopt; if (o === 'campo') { UI.pad.pad.campo = e.target.value; redraw(); } if (o === 'num') UI.pad.num = +e.target.value || 0; });
  ov.addEventListener('pointerdown', e => {
    const stage = e.target.closest('#padSvg'); if (!stage) return; e.preventDefault(); const p = pt(e), tool = UI.pad.tool;
    const g = e.target.closest('.pobj'), sl = e.target.closest('.pseta');
    if (e.button === 2 || tool === 'del') { if (g) UI.pad.pad.objs.splice(+g.dataset.i, 1); else if (sl) UI.pad.pad.setas.splice(+sl.dataset.s, 1); redraw(); return; }
    if (g && !tool.startsWith('seta') && tool !== 'area') { drag = { i: +g.dataset.i }; return; }
    if (tool.startsWith('seta-') || tool === 'area') { drag = { novo: tool, x0: p.x, y0: p.y }; return; }
    const numerar = ov.querySelector('[data-padopt="numerar"]').checked; const o = { t: tool, x: p.x, y: p.y };
    if ((tool.startsWith('j') || tool === 'gk') && numerar) { o.n = String(UI.pad.num || ''); UI.pad.num = (UI.pad.num || 0) + 1; ov.querySelector('[data-padopt="num"]').value = UI.pad.num; }
    if (tool === 'escada' && UI.pad.pad.campo !== 'meio') o.r = 0;
    UI.pad.pad.objs.push(o); redraw();
  });
  ov.addEventListener('pointermove', e => { if (!drag || !$('#padSvg')) return; const p = pt(e); if (drag.i != null) { const b = UI.pad.pad.objs[drag.i]; b.x = p.x; b.y = p.y; redraw(); } else if (drag.novo) { drag.x1 = p.x; drag.y1 = p.y; const tmp = JSON.parse(JSON.stringify(UI.pad.pad)); if (drag.novo === 'area') tmp.area = { x: Math.min(drag.x0, p.x), y: Math.min(drag.y0, p.y), w: Math.abs(p.x - drag.x0), h: Math.abs(p.y - drag.y0) }; else tmp.setas.push({ x1: drag.x0, y1: drag.y0, x2: p.x, y2: p.y, tipo: drag.novo.slice(5) }); $('#padStage').innerHTML = campoSVG(tmp, { edit: true, id: 'padSvg' }); } });
  ov.addEventListener('pointerup', e => { if (drag && drag.novo && drag.x1 != null && (Math.abs(drag.x1 - drag.x0) > 1.5 || Math.abs(drag.y1 - drag.y0) > 1.5)) { if (drag.novo === 'area') UI.pad.pad.area = { x: Math.min(drag.x0, drag.x1), y: Math.min(drag.y0, drag.y1), w: Math.abs(drag.x1 - drag.x0), h: Math.abs(drag.y1 - drag.y0) }; else UI.pad.pad.setas.push({ x1: drag.x0, y1: drag.y0, x2: drag.x1, y2: drag.y1, tipo: drag.novo.slice(5) }); } drag = null; redraw(); });
  ov.addEventListener('contextmenu', e => { if (e.target.closest('#padSvg')) e.preventDefault(); });
}

/* ---------- visual da ficha (tela e impressão) ---------- */
const diaSemana = d => ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][new Date(d + 'T12:00').getDay()];
function blocosDe(p) { if (p.blocos && p.blocos.length) return p.blocos; const ex = p.exercicios || []; return ex.length ? [{ tipo: 'campo', nome: 'Atividade 1', metodo: p.objetivo || '', duracao: ex.reduce((s, x) => s + (+x.duracao || 0), 0), campo: '', desenvolvimento: ex.map(x => `${x.parte}: ${x.nome}${x.series ? ' · ' + x.series : ''}${x.duracao ? ' (' + x.duracao + ' min)' : ''}`).join('\n'), pad: null }] : []; }
const durEf = p => blocosDe(p).reduce((s, b) => s + (+b.duracao || 0), 0);
planoHTML = function (p) {
  const bl = blocosDe(p), mat = (p.material || []).filter(m => m.item);
  const row = (k, v) => `<tr><th>${k}</th><td>${v}</td></tr>`;
  return `<div class="pfx">
    <div class="pfh"><img src="${LOGO}" alt=""><b>PLANO DE TREINO · ${esc((p.categoria || '').toUpperCase())}</b><img src="${LOGO}" alt=""></div>
    <div class="pfi"><div><small>Data</small><b>${fmtD(p.data)}</b></div><div><small>Local</small><b>${esc(p.local || '—')}</b></div><div><small>Microciclo</small><b>${esc(p.microciclo || '—')}</b></div><div><small>Dia da semana</small><b>${diaSemana(p.data)}</b></div><div><small>Horário</small><b>${esc(p.horario || '—')}</b></div><div><small>Duração efetiva</small><b>${durEf(p)}'</b></div></div>
    ${p.titulo ? `<div class="pft">${esc(p.titulo)}</div>` : ''}
    ${bl.map((b, i) => `<div class="pfb"><div class="pfbt">${esc((b.nome || (b.tipo === 'academia' ? 'Academia' : 'Atividade ' + (i + 1))).toUpperCase())}</div><div class="pfbg"><div class="pfl"><table>${row('Método', esc(b.metodo || '—'))}${row('Duração', (b.duracao || 0) + "'")}${row(b.tipo === 'academia' ? 'Local' : 'Campo', esc(b.campo || '—'))}${b.tipo !== 'academia' && b.series ? row('Séries', esc(b.series)) : ''}${b.tipo !== 'academia' && b.pse != null && b.pse !== '' ? row('PSE alvo', esc(b.pse)) : ''}</table><div class="pfdh">Desenvolvimento</div><div class="pfd">${esc(b.desenvolvimento || '').replace(/\n/g, '<br>') || '—'}</div></div>
      <div class="pfr">${b.tipo === 'academia' ? `<table class="pfex"><thead><tr><th>Exercícios</th><th>Séries/reps</th><th>Cadência</th><th>Descanso</th><th>Carga</th></tr></thead><tbody>${(b.exercicios || []).filter(x => x.nome).map(x => `<tr><td>${esc(x.nome)}</td><td>${esc(x.series || '')}</td><td>${esc(x.cadencia || '')}</td><td>${esc(x.descanso || '')}</td><td>${esc(x.carga || 'Individual')}</td></tr>`).join('') || '<tr><td colspan="5">Sem exercícios</td></tr>'}</tbody></table>` : campoSVG(b.pad || { campo: 'inteiro', objs: [] })}</div></div></div>`).join('') || '<div class="mini-empty">Sem atividades. Edite o plano para adicionar academia e atividades de campo.</div>'}
    ${mat.length ? `<div class="pfb"><div class="pfbt">MATERIAL</div><table class="pfmat">${mat.map(m => `<tr><td>${esc(m.qtd || '')}</td><td>${esc(m.item)}</td></tr>`).join('')}</table></div>` : ''}
    ${p.obs ? `<div class="pfb"><div class="pfbt">OBSERVAÇÕES</div><div class="pfd" style="padding:8px 12px">${esc(p.obs).replace(/\n/g, '<br>')}</div></div>` : ''}
  </div>`;
};

/* ---------- editor ---------- */
function semanasOpc(d, cat) { const out = []; for (let k = -4; k <= 6; k++) { const w = addDays(segunda(d), k * 7); const nm = (S.config.semanas || {})[cat + '|' + w]; out.push(`Semana de ${fmtDs(w)}${nm ? ' · ' + nm : ''}`); } const ms = (S.macro || []).filter(b => b.categoria === cat && b.tipo === 'meso' && b.inicio <= d && b.fim >= d).map(b => b.nome); return [...ms, ...out]; }
formPlano = function (p = {}, data) {
  const cat = p.categoria || catPl(); const d0 = p.data || data || todayISO();
  let bl = JSON.parse(JSON.stringify(blocosDe(p).length ? blocosDe(p) : [{ tipo: 'academia', nome: 'Academia', metodo: '', duracao: 30, campo: 'Academia', desenvolvimento: '', exercicios: [{ nome: '', series: '', cadencia: '', descanso: '', carga: 'Individual' }] }, { tipo: 'campo', nome: 'Atividade 1', metodo: 'Ativação', duracao: 10, campo: '', desenvolvimento: '', pad: { campo: 'inteiro', objs: [], setas: [] } }]));
  let mat = JSON.parse(JSON.stringify(p.material || [{ qtd: '', item: '' }]));
  const ses = sessoesDia(cat, d0).filter(s => s.tipo !== 'folga');
  openModal(mh(p.id ? 'Editar plano de treino' : 'Novo plano de treino') + `<form id="fPl2" novalidate><div class="mb">
    <div class="form" style="grid-template-columns:repeat(6,1fr)">
      <div class="f"><label for="pD">Data *</label><input id="pD" type="date" value="${esc(d0)}" required></div>
      <div class="f"><label for="pC">Categoria</label><select id="pC">${opts(Object.keys(GRUPOS), cat)}</select></div>
      <div class="f"><label for="pL">Local</label><input id="pL" list="pLs" value="${esc(p.local || '')}" placeholder="Academia / campo"><datalist id="pLs"><option value="Academia/campo"><option value="Campo 1"><option value="Campo 2"><option value="Academia"><option value="Estádio"></datalist></div>
      <div class="f s2"><label for="pM">Microciclo</label><input id="pM" list="pMs" value="${esc(p.microciclo || '')}" placeholder="Selecione ou escreva"><datalist id="pMs">${semanasOpc(d0, cat).map(x => `<option value="${esc(x)}">`).join('')}</datalist></div>
      <div class="f"><label for="pH">Horário</label><input id="pH" type="time" value="${esc(p.horario || (ses[0]?.hora || '14:00'))}"></div>
      <div class="f s3" style="grid-column:span 3"><label for="pT">Título (opcional)</label><input id="pT" value="${esc(p.titulo || '')}" placeholder="Ex.: Força MMII + ativação"></div>
      <div class="f"><span>Dia da semana</span><b id="pDs" style="font-family:var(--fc);font-size:20px">${diaSemana(d0)}</b></div>
      <div class="f"><span>Duração efetiva</span><b id="pDe" style="font-family:var(--fc);font-size:20px">—</b></div>
      <div class="f"><label for="pR">Responsável</label><select id="pR"><option value="">—</option>${opts((S.config.profissionais || []).map(x => x.nome).filter(Boolean), p.responsavel)}</select></div>
    </div>
    <div class="fsec">Atividades da sessão</div><div id="pBl"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn sm" data-pb="add-acad">${IC.dumb} + Academia</button><button type="button" class="btn sm" data-pb="add-campo">${IC.ball} + Atividade de campo</button></div>
    <div class="fsec">Material</div><div id="pMat"></div><button type="button" class="btn sm" data-pb="add-mat" style="align-self:flex-start">${IC.plus} Adicionar material</button>
    <div class="f"><label for="pO">Observações</label><textarea id="pO">${esc(p.obs || '')}</textarea></div>
  </div><div class="mf"><span class="msg" id="pErr"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar plano</button></div></form>`, true);
  const draw = () => {
    $('#pBl').innerHTML = bl.map((b, i) => `<div class="pbk ${b.tipo}" data-b="${i}"><div class="pbkh"><span class="pbkt">${b.tipo === 'academia' ? IC.dumb : IC.ball}</span><input data-bk="nome" value="${esc(b.nome || '')}" placeholder="${b.tipo === 'academia' ? 'Academia' : 'Atividade ' + (i + 1)}"><span style="flex:1"></span><button type="button" class="icon-btn" data-pb="up" data-i="${i}" aria-label="Subir">↑</button><button type="button" class="icon-btn" data-pb="down" data-i="${i}" aria-label="Descer">↓</button><button type="button" class="icon-btn" data-pb="del" data-i="${i}" aria-label="Remover" style="color:var(--red)">${IC.trash}</button></div>
      <div class="form" style="grid-template-columns:repeat(${b.tipo === 'campo' ? 6 : 4},minmax(0,1fr))"><div class="f" style="grid-column:1/-1"><label>Método da atividade · escolha um ou digite</label><div class="metsel">${(b.tipo === 'academia' ? METODOS_ACAD : METODOS_CAMPO).map(m => `<button type="button" class="${b.metodo === m ? 'on' : ''}" data-pb="met" data-i="${i}" data-v="${esc(m)}">${esc(m)}</button>`).join('')}</div><input data-bk="metodo" class="metin" value="${esc(b.metodo || '')}" placeholder="Outro método (digite)"></div><div class="f"><label>Duração (min)</label><input data-bk="duracao" type="number" min="0" max="180" value="${esc(b.duracao ?? '')}"></div><div class="f"><label>${b.tipo === 'academia' ? 'Local' : 'Campo (dimensão)'}</label><input data-bk="campo" value="${esc(b.campo || '')}" placeholder="${b.tipo === 'academia' ? 'Academia' : '15x15 m'}"></div>${b.tipo === 'campo' ? `<div class="f"><label>Séries</label><input data-bk="series" value="${esc(b.series || '')}" placeholder="4 x 3 min"></div><div class="f"><label>PSE alvo</label><input data-bk="pse" type="number" min="0" max="10" value="${esc(b.pse ?? '')}"></div>` : ''}<div class="f"><label>Grupo</label><input data-bk="grupo" list="grpL" value="${esc(b.grupo || '')}" placeholder="Todos / G1 / G2"><datalist id="grpL"><option value="Todos"><option value="G1"><option value="G2"><option value="Titulares"><option value="Reservas"><option value="Transição (DM)"></datalist></div><div class="f" style="grid-column:span 2"><label>Objetivo da atividade</label><input data-bk="objetivo" value="${esc(b.objetivo || '')}" placeholder="Ex.: pressão pós-perda em até 5 s"></div><div class="f" style="grid-column:1/-1"><label>Organização / desenvolvimento</label><textarea data-bk="desenvolvimento" placeholder="${b.tipo === 'academia' ? 'Ex.: Força MMII (G1) e core; mobilidade (G2)' : 'Organização, regras, variações e pontos de atenção'}">${esc(b.desenvolvimento || '')}</textarea></div>${b.tipo === 'campo' ? `<div class="f" style="grid-column:span 2"><label>Regras</label><textarea data-bk="regras" placeholder="Ex.: 2 toques; gol só após 5 passes">${esc(b.regras || '')}</textarea></div><div class="f" style="grid-column:span 2"><label>Pontos de atenção (coaching)</label><textarea data-bk="coaching" placeholder="Ex.: orientação corporal, comunicação, apoio">${esc(b.coaching || '')}</textarea></div><div class="f" style="grid-column:1/-1"><label>Variações / progressões</label><input data-bk="variacoes" value="${esc(b.variacoes || '')}" placeholder="Ex.: reduzir espaço; limitar toques"></div>` : `<div class="f" style="grid-column:1/-1"><label>Pontos de atenção</label><input data-bk="coaching" value="${esc(b.coaching || '')}" placeholder="Ex.: amplitude completa, controle excêntrico"></div>`}</div>
      ${b.tipo === 'academia' ? `<table class="t pexed"><thead><tr><th class="l">Exercício</th><th>Séries / reps</th><th>Cadência</th><th>Descanso</th><th>Carga</th><th></th></tr></thead><tbody>${(b.exercicios || []).map((x, k) => `<tr data-k="${k}"><td class="l"><input data-ex="nome" list="exLib" value="${esc(x.nome || '')}" placeholder="Exercício"></td><td><input data-ex="series" value="${esc(x.series || '')}" placeholder="3x8"></td><td><input data-ex="cadencia" value="${esc(x.cadencia || '')}" placeholder="2010"></td><td><input data-ex="descanso" value="${esc(x.descanso || '')}" placeholder="60s"></td><td><input data-ex="carga" value="${esc(x.carga || '')}" placeholder="Individual / RIR 2"></td><td style="white-space:nowrap"><button type="button" class="icon-btn" data-pb="ex-up" data-i="${i}" data-k="${k}">↑</button><button type="button" class="icon-btn" data-pb="ex-del" data-i="${i}" data-k="${k}" style="color:var(--red)">${IC.x}</button></td></tr>`).join('')}</tbody></table><button type="button" class="btn sm" data-pb="ex-add" data-i="${i}">${IC.plus} Exercício</button>` : `<div class="pbpad">${campoSVG(b.pad || { campo: 'inteiro', objs: [] })}<button type="button" class="btn pri" data-pb="pad" data-i="${i}">${IC.edit} Montar na prancheta tática</button></div>`}</div>`).join('') + `<datalist id="mAc">${METODOS_ACAD.map(m => `<option value="${m}">`).join('')}</datalist><datalist id="mCa">${METODOS_CAMPO.map(m => `<option value="${m}">`).join('')}</datalist><datalist id="exLib">${EXER_LIB.map(m => `<option value="${m}">`).join('')}</datalist>`;
    $('#pMat').innerHTML = mat.map((m, k) => `<div class="pmat" data-m="${k}"><input data-mt="qtd" value="${esc(m.qtd || '')}" placeholder="Qtd" style="width:80px"><input data-mt="item" value="${esc(m.item || '')}" placeholder="Ex.: Pratos, cones, coletes, mini-gols" list="matLib" style="flex:1"><button type="button" class="icon-btn" data-pb="mat-del" data-k="${k}" style="color:var(--red)">${IC.x}</button></div>`).join('') + `<datalist id="matLib">${['Bolas', 'Cones', 'Pratos', 'Estacas', 'Coletes', 'Mini-gols', 'Escada de agilidade', 'Barreiras', 'Manequins', 'Material da academia', 'Elásticos', 'Medicine ball'].map(m => `<option value="${m}">`).join('')}</datalist>`;
    $('#pDe').textContent = bl.reduce((s, b) => s + (+b.duracao || 0), 0) + "'";
  };
  const fm = $('#fPl2');
  fm.addEventListener('input', e => { const t = e.target, bk = t.closest('[data-b]'); if (t.dataset.bk && bk) { bl[+bk.dataset.b][t.dataset.bk] = t.value; if (t.dataset.bk === 'duracao') $('#pDe').textContent = bl.reduce((s, b) => s + (+b.duracao || 0), 0) + "'"; } if (t.dataset.ex && bk) bl[+bk.dataset.b].exercicios[+t.closest('[data-k]').dataset.k][t.dataset.ex] = t.value; if (t.dataset.mt) mat[+t.closest('[data-m]').dataset.m][t.dataset.mt] = t.value; if (t.id === 'pD') $('#pDs').textContent = t.value ? diaSemana(t.value) : '—'; });
  fm.addEventListener('click', e => { const b = e.target.closest('[data-pb]'); if (!b) return; e.preventDefault(); e.stopPropagation(); const i = +b.dataset.i, k = +b.dataset.k, a = b.dataset.pb;
    if (a === 'add-acad') bl.push({ tipo: 'academia', nome: 'Academia', metodo: '', duracao: 30, campo: 'Academia', desenvolvimento: '', exercicios: [{ nome: '', series: '', cadencia: '', descanso: '', carga: 'Individual' }] });
    if (a === 'add-campo') bl.push({ tipo: 'campo', nome: 'Atividade ' + (bl.filter(x => x.tipo === 'campo').length + 1), metodo: '', duracao: 15, campo: '', desenvolvimento: '', pad: { campo: 'inteiro', objs: [], setas: [] } });
    if (a === 'up' && i > 0) [bl[i - 1], bl[i]] = [bl[i], bl[i - 1]]; if (a === 'down' && i < bl.length - 1) [bl[i + 1], bl[i]] = [bl[i], bl[i + 1]]; if (a === 'del') bl.splice(i, 1);
    if (a === 'ex-add') bl[i].exercicios.push({ nome: '', series: '', cadencia: '', descanso: '', carga: 'Individual' }); if (a === 'ex-del') bl[i].exercicios.splice(k, 1); if (a === 'ex-up' && k > 0) { const ex = bl[i].exercicios; [ex[k - 1], ex[k]] = [ex[k], ex[k - 1]]; }
    if (a === 'add-mat') mat.push({ qtd: '', item: '' }); if (a === 'mat-del') mat.splice(k, 1);
    if (a === 'met') bl[i].metodo = b.dataset.v;
    if (a === 'pad') { abrirPrancheta(bl[i], pad => { bl[i].pad = pad; draw(); }); return; }
    draw(); });
  draw();
  fm.onsubmit = e => { e.preventDefault(); const o = { ...p, id: p.id || uid('pl'), data: $('#pD').value, categoria: $('#pC').value, local: $('#pL').value.trim(), microciclo: $('#pM').value.trim(), horario: $('#pH').value, titulo: $('#pT').value.trim(), responsavel: $('#pR').value, blocos: bl.map(b => ({ ...b, duracao: +b.duracao || 0, exercicios: b.tipo === 'academia' ? (b.exercicios || []).filter(x => (x.nome || '').trim()) : undefined })).map(b => { if (b.exercicios === undefined) delete b.exercicios; return b; }), material: mat.filter(m => (m.item || '').trim()), obs: $('#pO').value.trim() }; delete o.exercicios; o.duracao = durEf(o); if (!o.data) return $('#pErr').textContent = 'Informe a data.'; save('planos', o); UI.planoSel = o.id; UI.plCat = o.categoria; closeModal(); if (S.view !== 'pl-plano') go('pl-plano'); toast('Plano salvo'); };
};

/* ---------- impressão em A4 (retrato) e fichas de academia (paisagem) ---------- */
async function imprimirA4(html, nome, paisagem, pdf, margem = 8) {
  const pageW = paisagem ? 1123 : 794; // px a 96 dpi
  let pr = $('#printRoot'); if (pr) pr.remove(); pr = document.createElement('div'); pr.id = 'printRoot'; pr.innerHTML = html; document.body.appendChild(pr);
  if (!pdf) {
    const st = document.createElement('style'); st.id = 'a4style'; st.textContent = `@media print{@page{size:A4 ${paisagem ? 'landscape' : 'portrait'};margin:${margem}mm}#printRoot .a4pg{${margem ? 'width:auto!important;' : ''}break-after:page}#printRoot .a4pg:last-child{break-after:auto}}`; document.head.appendChild(st);
    document.body.classList.add('printing');
    const done = () => { document.body.classList.remove('printing'); pr.remove(); st.remove(); removeEventListener('afterprint', done); }; addEventListener('afterprint', done);
    setTimeout(() => { try { window.print(); } catch (e) { toast('Use “Baixar PDF”.', true); } setTimeout(() => { if (document.body.classList.contains('printing')) done(); }, 2000); }, 300); return;
  }
  progress('Gerando PDF…');
  try { await Promise.all([loadLib('h2c'), loadLib('jspdf')]); } catch (e) { progressEnd(); pr.remove(); toast('Não foi possível carregar o gerador de PDF.', true); return; }
  pr.style.cssText = 'position:fixed;left:0;top:0;z-index:140'; const { jsPDF } = window.jspdf; const pdfd = new jsPDF({ orientation: paisagem ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' }); const PW = paisagem ? 297 : 210, PH = paisagem ? 210 : 297, M = margem;
  try {
    const pgs = [...pr.querySelectorAll('.a4pg')]; let first = true;
    for (const el of pgs) { fixSvg(el); const cv = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', logging: false, width: pageW, windowWidth: pageW + 50 }); const iw = PW - 2 * M, ratio = cv.height / cv.width, ph = (PH - 2 * M) / iw * cv.width; for (let y = 0; y < cv.height; y += ph) { const sl = document.createElement('canvas'); sl.width = cv.width; sl.height = Math.min(ph, cv.height - y); sl.getContext('2d').drawImage(cv, 0, -y); if (!first) pdfd.addPage(); first = false; pdfd.addImage(sl.toDataURL('image/jpeg', 0.92), 'JPEG', M, M, iw, sl.height / cv.width * iw); } }
    const blob = pdfd.output('blob'); progressEnd(); pr.remove();
    const dl = window.claude && await window.claude.use('downloads'); if (dl) { try { await dl.save({ filename: nome, data: blob }); toast('PDF salvo'); } catch (e) { } } else toast('Download indisponível nesta visualização.', true);
  } catch (e) { progressEnd(); pr.remove(); toast('Erro ao gerar o PDF.', true); }
}
imprimirPlano = function (id, pdf) { const p = (S.planos || []).find(x => x.id === id); if (!p) return; imprimirA4(`<div class="a4pg" style="width:794px">${planoHTML(p)}</div>`, `Plano-de-treino-${p.categoria}-${p.data}.pdf`, false, pdf); };
function fichaAcadHTML(a, p, b) {
  const ex = (b.exercicios || []).filter(x => x.nome);
  return `<div class="a4pg" style="width:1123px"><div class="fac"><div class="fach"><div><h2>PORTO VITÓRIA</h2><b>${esc(a ? a.apelido || a.nome : '______________________')}</b><span>${esc(b.nome || 'Treino')}${b.metodo ? ' · ' + esc(b.metodo) : ''}</span><small>${fmtD(p.data)} · ${esc(p.categoria)}${b.desenvolvimento ? ' · ' + esc(b.desenvolvimento.split('\n')[0]) : ''}</small></div><img src="${LOGO}" alt=""></div>
    <table class="facx"><thead><tr><th></th><th class="l">Exercícios</th><th>Séries e repetições</th><th>Cadência</th><th>Descanso</th><th>Carga</th><th>Carga</th></tr></thead><tbody>${ex.map((x, i) => `<tr><td>${i + 1}</td><td class="l">${esc(x.nome)}</td><td>${esc(x.series || '')}</td><td>${esc(x.cadencia || '')}</td><td>${esc(x.descanso || '')}</td><td class="blank">${x.carga && !/individual/i.test(x.carga) ? esc(x.carga) : ''}</td><td class="blank"></td></tr>`).join('')}</tbody></table>
    <div class="facf"><table class="rir"><thead><tr><th colspan="2">Escala de repetições de reserva (RIR)</th></tr><tr><th>Escore</th><th>Descrição do esforço percebido</th></tr></thead><tbody>${[['10', 'Máximo esforço'], ['9,5', 'Nenhuma repetição a mais poderia ser executada'], ['9', '1 repetição remanescente'], ['8,5', '1–2 repetições remanescentes'], ['8', '2 repetições remanescentes'], ['7,5', '2–3 repetições remanescentes'], ['7', '3 repetições remanescentes'], ['5–6', '4–6 repetições remanescentes'], ['3–4', 'Pouco esforço'], ['1–2', 'Pouco ou nenhum esforço']].map(([s, t]) => `<tr><td>${s}</td><td>${t}</td></tr>`).join('')}</tbody></table>
    <div class="facbar"><small>Fadiga</small><div><span>Muito alta</span><span>Alta</span><span>Moderada</span><span>Baixa</span></div></div>
    <div class="pesada"><b>O quão pesada está a carga?</b><svg viewBox="0 0 330 120">${Array.from({ length: 11 }, (_, i) => `<rect x="${10 + i * 28}" y="${100 - i * 8}" width="22" height="${8 + i * 8}" rx="3" fill="${i < 4 ? '#7bd08f' : i < 7 ? '#f6c21c' : i < 9 ? '#f39324' : '#e0342b'}"/><text x="${21 + i * 28}" y="${95 - i * 8}" text-anchor="middle" font-size="11" font-weight="800" fill="#14201a">${i}</text>`).join('')}<text x="10" y="117" font-size="10" fill="#4b5a52">Extremamente leve</text><text x="320" y="117" text-anchor="end" font-size="10" fill="#4b5a52">Extremamente pesado</text></svg></div></div></div></div>`;
}
function fichasAcademia(id) {
  const p = (S.planos || []).find(x => x.id === id); if (!p) return; const acs = blocosDe(p).map((b, i) => ({ b, i })).filter(x => x.b.tipo === 'academia'); if (!acs.length) { toast('Este plano não tem bloco de academia.', true); return; }
  const ats = S.atletas.filter(a => a.categoria === p.categoria).sort((a, b) => a.nome.localeCompare(b.nome));
  openModal(mh('Fichas de academia por atleta') + `<div class="mb"><div class="form" style="grid-template-columns:1fr 1fr"><div class="f"><label for="faB">Bloco</label><select id="faB">${acs.map(x => `<option value="${x.i}">${esc(x.b.nome || 'Academia')} · ${esc(x.b.metodo || '')}</option>`).join('')}</select></div><div class="f"><span>Atletas</span><label class="chk" style="text-transform:none;letter-spacing:0;color:var(--ink)"><input type="checkbox" id="faAll" checked> Todos da categoria (${ats.length})</label></div></div><div class="tchips" id="faList">${ats.map(a => `<label><input type="checkbox" value="${a.id}" checked>${esc(a.apelido || a.nome)}</label>`).join('')}<label><input type="checkbox" value="__branco"> Ficha em branco</label></div><p class="muted" style="margin:0;font-size:12.5px">Uma página A4 deitada por atleta, no modelo da ficha do clube, com colunas de carga para anotar e as escalas de RIR e de esforço.</p></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn" id="faImp">${IC.print} Imprimir</button><button class="btn pri" id="faPdf">${IC.pdf} Baixar PDF</button></div>`);
  $('#faAll').onchange = e => $$('#faList input').forEach(i => { if (i.value !== '__branco') i.checked = e.target.checked; });
  const go2 = pdf => { const b = blocosDe(p)[+$('#faB').value]; const sel = $$('#faList input:checked').map(i => i.value); const html = sel.map(v => fichaAcadHTML(v === '__branco' ? null : atl(v), p, b)).join(''); if (!html) { toast('Escolha ao menos um atleta.', true); return; } closeModal(); imprimirA4(html, `Fichas-academia-${p.data}.pdf`, true, pdf); };
  $('#faImp').onclick = () => go2(false); $('#faPdf').onclick = () => go2(true);
}
const _fPlanoBase = fPlano;
fPlano = function () { let h = _fPlanoBase(); return h.replace('<button data-act="plano-print"', '<button data-act="plano-fichas" data-id="' + (UI.planoSel || '') + '">Fichas de academia</button> <button data-act="plano-print"'); };
dmOn('click', e => { const t = e.target.closest('[data-act="plano-fichas"]'); if (t) fichasAcademia(t.dataset.id); });

/* ================= IMPORTAR FOTOS DOS ATLETAS (pelo nome do arquivo) ================= */
UI.fotos = null; // [{file, url, nomeArq, atletaId}]
function matchFoto(nomeArq) {
  const base = nomeArq.replace(/\.[a-z0-9]+$/i, '').replace(/[_\-.]+/g, ' ').replace(/\d+/g, ' ');
  const n = nrmName(base); if (!n) return null;
  let a = S.atletas.find(x => nrmName(x.nome) === n || (x.apelido && nrmName(x.apelido) === n)); if (a) return a.id;
  const p = n.split(' ').filter(w => w.length > 1);
  a = S.atletas.find(x => { const q = nrmName(x.nome).split(' '); return p.length >= 2 && q[0] === p[0] && q.includes(p[p.length - 1]); }); if (a) return a.id;
  a = S.atletas.find(x => p.every(w => nrmName(x.nome).split(' ').includes(w))); if (a) return a.id;
  const num = nomeArq.match(/(?:^|\D)(\d{1,2})(?:\D|$)/); if (num && p.length) { a = S.atletas.find(x => String(x.numero) === String(+num[1]) && nrmName(x.nome).includes(p[0])); if (a) return a.id; }
  return null;
}
async function lerFotos(files) {
  const imgs = [...files].filter(f => /^image\//.test(f.type) || /\.(jpe?g|png|webp|heic)$/i.test(f.name));
  if (!imgs.length) { toast('Nenhuma imagem encontrada.', true); return; }
  UI.fotos = imgs.map(f => ({ file: f, url: URL.createObjectURL(f), nomeArq: f.name, atletaId: matchFoto(f.name) }));
  render();
}
function fotosHTML() {
  const L = UI.fotos;
  const sel = (i, v) => `<select data-fidx="${i}" class="search" style="min-width:0;width:100%"><option value="">— não importar —</option>${[...S.atletas].sort((a, b) => a.nome.localeCompare(b.nome)).map(a => `<option value="${a.id}" ${a.id === v ? 'selected' : ''}>${esc(a.nome)} · ${esc(a.subcategoria || a.categoria)}</option>`).join('')}</select>`;
  const ok = L ? L.filter(x => x.atletaId).length : 0;
  return panel('2 · Escolha as fotos', `<label class="drop" id="dropFotos">${IC.upload}<b>Clique para escolher ou arraste várias fotos aqui</b><span>JPG, PNG ou WEBP. O nome do arquivo deve ser o nome do atleta, por exemplo “Arthur Nascimento.jpg” ou “arthur_nascimento_07.png”.</span><input type="file" id="impFotos" accept="image/*" multiple hidden></label>`)
    + `<div style="height:16px"></div>` + panel('3 · Confira antes de importar', L ? `<div class="counters"><span><b>${L.length}</b> fotos</span><span><b>${ok}</b> com atleta encontrado</span><span style="${L.length - ok ? 'color:var(--red);border-color:var(--red)' : ''}"><b>${L.length - ok}</b> sem atleta (escolha na lista ou deixe sem importar)</span></div>
      <div class="fotogrid">${L.map((x, i) => { const a = atl(x.atletaId); return `<div class="fotoc ${x.atletaId ? '' : 'miss'}"><img src="${x.url}" alt=""><div><small>${esc(x.nomeArq)}</small>${sel(i, x.atletaId)}${a && a.foto ? '<em>substitui a foto atual</em>' : ''}</div></div>`; }).join('')}</div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px"><button class="btn" data-act="fotos-cancel">Cancelar</button><button class="btn pri" data-act="fotos-ok" ${ok ? '' : 'disabled'}>${IC.check} Importar ${ok} foto(s)</button></div>` : '<div class="mini-empty">Escolha as fotos no passo 2 para ver a correspondência com os atletas.</div>');
}
const _vImportar = vImportar;
vImportar = function () {
  let h = _vImportar();
  const card = `<label class="rk"><input type="radio" name="impTipo" value="fotos" ${IMP.tipo === 'fotos' ? 'checked' : ''}><span style="flex:1"><b>Fotos dos atletas</b><small>Envie várias fotos de uma vez. O sistema identifica o atleta pelo nome do arquivo e coloca a foto no cadastro (aparece em todos os módulos e relatórios).</small></span></label>`;
  h = h.replace('<div class="rk-list">', '<div class="rk-list">' + card);
  if (IMP.tipo !== 'fotos') return h;
  // troca os passos 2 e 3 pela importação de fotos
  const tmp = document.createElement('div'); tmp.innerHTML = h;
  const ps = [...tmp.querySelectorAll('.panel')];
  const p2 = ps.find(p => p.querySelector('.ph')?.textContent.trim().startsWith('2 ·')), p3 = ps.find(p => p.querySelector('.ph')?.textContent.trim().startsWith('3 ·'));
  const parts = fotosHTML().split('<div style="height:16px"></div>');
  if (p2) p2.outerHTML = parts[0]; if (p3) p3.outerHTML = parts[1];
  return tmp.innerHTML;
};
async function importarFotos() {
  const L = (UI.fotos || []).filter(x => x.atletaId); if (!L.length) return;
  const docs = [];
  for (const x of L) { try { const foto = await prepFotoDM(x.file); const a = atl(x.atletaId); if (a) docs.push({ ...a, foto }); } catch (e) { } }
  await saveMany('atletas', docs); UI.fotos.forEach(x => URL.revokeObjectURL(x.url)); UI.fotos = null; render(); toast(`${docs.length} foto(s) importada(s)`);
}
dmOn('change', e => {
  const t = e.target;
  if (t.id === 'impFotos' && t.files.length) lerFotos(t.files);
  if (t.dataset.fidx !== undefined && UI.fotos) { UI.fotos[+t.dataset.fidx].atletaId = t.value || null; render(); }
});
dmOn('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'fotos-ok') importarFotos(); if (t.dataset.act === 'fotos-cancel') { UI.fotos = null; render(); } });
dmOn('dragover', e => { const z = e.target.closest && e.target.closest('#dropFotos'); if (z) { e.preventDefault(); z.classList.add('over'); } });
dmOn('drop', e => { const z = e.target.closest && e.target.closest('#dropFotos'); if (z) { e.preventDefault(); z.classList.remove('over'); lerFotos(e.dataTransfer.files); } });

/* ================= PLANO DE TREINO (LAYOUT NOVO) + TEMAS DE COR ================= */
const TEMAS = [['verde', 'Verde Porto'], ['branco', 'Branco e verde'], ['claro', 'Verde claro']];
const temaPl = () => S.config.planTema || 'verde';
const temaSel = () => `<label class="temasel"><span>Tema</span>${TEMAS.map(([k, n]) => `<button type="button" class="tsw t-${k} ${temaPl() === k ? 'on' : ''}" data-act="tema" data-v="${k}" title="${n}" aria-label="Tema ${n}"><i></i></button>`).join('')}</label>`;
const BCOR = { academia: '#7a3fd1', campo: '#1b8a4a' };
const cargaPlano = p => blocosDe(p).reduce((s, b) => s + ((b.pse !== '' && b.pse != null ? +b.pse : (p.pse ?? 0)) || 0) * (+b.duracao || 0), 0);
planoHTML = function (p) {
  const bl = blocosDe(p), mat = (p.material || []).filter(m => m.item), tot = durEf(p) || 1, md = mdLabel(p.data, p.categoria), ua = cargaPlano(p);
  const chip = (k, v) => v ? `<div class="pc2"><small>${k}</small><b>${v}</b></div>` : '';
  const sec = (t, v) => v ? `<div class="p2s"><h6>${t}</h6><p>${esc(v).replace(/\n/g, '<br>')}</p></div>` : '';
  return `<div class="pf2 t-${temaPl()}">
    <div class="p2h"><img src="${LOGO}" alt=""><div class="p2ht"><small>Porto Vitória · Departamento de Futebol de Base</small><h3>Plano de treino${p.titulo ? ' · ' + esc(p.titulo) : ''}</h3><span>${esc(p.categoria || '')}${p.microciclo ? ' · ' + esc(p.microciclo) : ''}</span></div><div class="p2d"><b>${fmtD(p.data).slice(0, 5)}</b><span>${diaSemana(p.data)}</span>${p.horario ? `<em>${esc(p.horario)}</em>` : ''}${md ? `<i>${md}</i>` : ''}</div></div>
    <div class="p2c">${chip('Local', esc(p.local || ''))}${chip('Duração efetiva', tot + ' min')}${chip('Atividades', bl.length)}${ua ? chip('Carga planejada', ua + ' UA') : ''}${chip('Responsável', esc(p.responsavel || ''))}</div>
    ${bl.length ? `<div class="p2tl">${bl.map((b, i) => `<span style="flex:${Math.max(1, +b.duracao || 1)};background:${BCOR[b.tipo] || '#1b8a4a'}" title="${esc(b.nome || '')}: ${b.duracao || 0} min"><b>${i + 1}</b> ${esc(b.nome || (b.tipo === 'academia' ? 'Academia' : 'Atividade'))} · ${b.duracao || 0}'</span>`).join('')}</div>` : ''}
    ${bl.map((b, i) => { const ac = b.tipo === 'academia'; const ex = (b.exercicios || []).filter(x => x.nome);
      return `<div class="p2b"><div class="p2bh" style="--bc:${BCOR[b.tipo] || '#1b8a4a'}"><span class="p2n">${i + 1}</span><div><b>${esc(b.nome || (ac ? 'Academia' : 'Atividade ' + (i + 1)))}</b><small>${ac ? 'Academia' : 'Atividade de campo'}</small></div>${b.metodo ? `<span class="p2met"><small>Método</small>${esc(b.metodo)}</span>` : ''}<div class="p2m">${b.duracao ? `<span>${IC.clock}${b.duracao} min</span>` : ''}${b.campo ? `<span>${ac ? IC.dumb : IC.ruler}${esc(b.campo)}</span>` : ''}${b.series ? `<span>${IC.cycle}${esc(b.series)}</span>` : ''}${b.pse !== '' && b.pse != null ? `<span>${IC.gauge}PSE ${esc(b.pse)}</span>` : ''}${b.grupo ? `<span>${IC.users}${esc(b.grupo)}</span>` : ''}</div></div>
        <div class="p2bg ${ac ? 'ac' : ''}"><div class="p2l">${b.objetivo ? `<div class="p2obj">${IC.check}<span>${esc(b.objetivo)}</span></div>` : ''}${sec(ac ? 'Desenvolvimento' : 'Organização', b.desenvolvimento)}${sec('Regras', b.regras)}${sec('Pontos de atenção', b.coaching)}${sec('Variações / progressões', b.variacoes)}${!b.objetivo && !b.desenvolvimento && !b.regras && !b.coaching && !b.variacoes ? '<p class="muted" style="margin:6px 0">Sem descrição.</p>' : ''}</div>
        <div class="p2r">${ac ? `<table class="p2ex"><thead><tr><th>#</th><th class="l">Exercício</th><th>Séries / reps</th><th>Cadência</th><th>Descanso</th><th>Carga</th></tr></thead><tbody>${ex.map((x, k) => `<tr><td>${k + 1}</td><td class="l">${esc(x.nome)}</td><td>${esc(x.series || '—')}</td><td>${esc(x.cadencia || '—')}</td><td>${esc(x.descanso || '—')}</td><td>${esc(x.carga || 'Individual')}</td></tr>`).join('') || '<tr><td colspan="6">Sem exercícios</td></tr>'}</tbody></table>` : campoSVG(b.pad || { campo: 'inteiro', objs: [] })}</div></div></div>`; }).join('') || '<div class="mini-empty">Sem atividades. Edite o plano para adicionar academia e atividades de campo.</div>'}
    ${mat.length || p.obs ? `<div class="p2f">${mat.length ? `<div><h6>Material</h6><div class="p2mat">${mat.map(m => `<span>${m.qtd ? `<b>${esc(m.qtd)}</b> ` : ''}${esc(m.item)}</span>`).join('')}</div></div>` : ''}${p.obs ? `<div><h6>Observações</h6><p>${esc(p.obs).replace(/\n/g, '<br>')}</p></div>` : ''}</div>` : ''}
    <div class="p2foot"><span>PORTO VITÓRIA</span><span>Disciplina · Evolução · Alto rendimento</span></div>
  </div>`;
};
const _fPlano3 = fPlano;
fPlano = function () { const h = _fPlano3(); return h.replace('<div class="row r12"', `<div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><b style="font-family:var(--fc);font-size:16px;text-transform:uppercase">Aparência do plano e do microciclo</b>${temaSel()}<span class="muted" style="font-size:12.5px">O tema vale para a tela, a impressão e o PDF.</span></div></div><div class="row r12"`); };
// microciclo com tema
const _fMicro3 = fMicro;
fMicro = function () { return _fMicro3().replace('<div class="mcwrap">', `<div class="mctema">${temaSel()}</div><div class="mcwrap t-${temaPl()}">`); };
const _repMicro3 = repMicro;
repMicro = function () { return _repMicro3().map(h => h.replace('<div class="mcwrap">', `<div class="mcwrap t-${temaPl()}">`)); };
dmOn('click', e => { const t = e.target.closest('[data-act="tema"]'); if (!t) return; S.config.planTema = t.dataset.v; putConfig(); render(); });

/* ================= NOTIFICAÇÕES + ALERTAS DO ATLETA + DADOS DE TESTE ================= */
IC.bell = I('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>');
TITLES.notif = ['Notificações', 'Central de avisos'];
NAV.push({ k: 'notif', n: 'Notificações', ic: IC.bell });
UI.nfTipo = 'Todas'; UI.nfLidas = false;

/* ---------- alertas de um atleta ---------- */
function diasSeguidos(aid, d) { let n = 0; for (let k = 0; k < 30; k++) { const x = addDays(d, -k); if ((S.pse || []).some(r => r.atletaId === aid && r.data === x && carga(r) > 0)) n++; else if (k === 0) continue; else break; } return n; }
function alertasAtleta(a, d = todayISO()) {
  const out = [], sc = statusCarga(a, d), rk = sc ? sc.rk : riscoAtl(a, d), pr = prontidao(a.id, d);
  if (rk.c.acwr != null) { if (rk.c.acwr > 1.5) out.push(['bad', `ACWR = ${nf(rk.c.acwr, 2)} (risco de lesão)`]); else if (rk.c.acwr > 1.3) out.push(['warn', `ACWR = ${nf(rk.c.acwr, 2)} (aumento rápido de carga)`]); else if (rk.c.acwr < 0.8 && rk.c.n28 >= 3) out.push(['warn', `ACWR = ${nf(rk.c.acwr, 2)} (destreino / carga baixa)`]); }
  if (rk.mo != null && rk.mo > 2) out.push(['warn', `Monotonia ${nf(rk.mo, 1)} (pouca variação na semana)`]);
  const ds = diasSeguidos(a.id, d); if (ds >= 5) out.push(['warn', `${ds} treinos consecutivos sem descanso`]);
  if (pr && pr.p < 60) out.push(['bad', `Prontidão ${pr.p}% hoje (PSR ${pr.psr ?? '—'})`]);
  if (pr) { const st = beSt(pr.r); if (st.st === 'INTERVENÇÃO') out.push(['bad', 'Bem-estar em intervenção: ' + st.flags.map(f => FLAGN[f]).join(', ')]); if (temDor(pr.r)) out.push(['warn', `Dor informada${pr.r.escalaDor ? ' (' + pr.r.escalaDor + '/10)' : ''}${pr.r.localDor ? ': ' + pr.r.localDor : ''}`]); if (nrmB(pr.r.treinaHoje) === 'nao') out.push(['warn', 'Informou que não vai treinar' + (pr.r.motivo ? ': ' + pr.r.motivo : '')]); }
  const at = ativaDe(a.id); if (at) out.push(['info', `No DM: ${STATUS[at.status]} · ${lesNome(at)}`]);
  return { sc, rk, pr, lista: out };
}
function pendAtleta(a, d = todayISO()) {
  const p = [];
  if (!(S.bemestar || []).some(r => r.atletaId === a.id && r.data === d && r.sono !== undefined)) p.push('Bem-estar de hoje');
  const ont = [d, addDays(d, -1)].find(x => ativas(sessoesDia(a.categoria, x)).length && x <= d);
  if (ont && !(S.pse || []).some(r => r.atletaId === a.id && r.data === ont)) p.push('PSE de ' + (ont === d ? 'hoje' : 'ontem'));
  if (pendente(a, 'fis')) p.push('Avaliação física'); if (pendente(a, 'corp')) p.push('Avaliação corporal'); if (pendente(a, 'mat')) p.push('Maturação');
  return p;
}
function alertaBox(a) {
  const A = alertasAtleta(a), pend = pendAtleta(a), sc = A.sc;
  const nv = sc ? sc.t : 'SEM DADOS', cls = sc ? sc.c : 'neu';
  const n = A.lista.filter(x => x[0] !== 'info').length;
  return `<div class="falert"><div class="find ${cls}">${IC.med}<div><small>Indicador de carga</small><b>${nv === 'ELEVADA' ? 'ELEVADO' : nv === 'ALTA' ? 'ALTO' : nv === 'BAIXA' ? 'BAIXO' : nv}</b><span>Composto de carga (ACWR, monotonia e PSE)${sc && sc.rk.c.acwr != null ? ' · ACWR ' + nf(sc.rk.c.acwr, 2) : ''}</span></div></div>
    <div class="flist ${n ? 'has' : ''}"><h5>${IC.cross} ${n ? `${n} alerta(s) ativo(s)` : 'Nenhum alerta ativo'}</h5>${A.lista.map(([c, t]) => `<div class="fa f-${c}"><i></i>${esc(t)}</div>`).join('') || '<div class="fa f-ok"><i></i>Carga, prontidão e bem-estar dentro do esperado</div>'}</div>
    <div class="flist pend"><h5>${IC.bell} ${pend.length ? `Falta (${pend.length})` : 'Nada pendente'}</h5>${pend.map(t => `<div class="fa f-info"><i></i>${esc(t)}</div>`).join('') || '<div class="fa f-ok"><i></i>Questionários e avaliações em dia</div>'}</div></div>`;
}
const _fichaHTML3 = fichaHTML;
fichaHTML = function (a) { const h = _fichaHTML3(a); const tmp = document.createElement('div'); tmp.innerHTML = h; const top = tmp.querySelector('.ftop'); if (top) top.insertAdjacentHTML('afterend', alertaBox(a)); return tmp.innerHTML; };
const _atlCard4 = atlCard;
atlCard = function (a) { const h = _atlCard4(a); const n = alertasAtleta(a).lista.filter(x => x[0] !== 'info').length; return n ? h.replace('<span class="ainit">', `<span class="alcount" title="${n} alerta(s) ativo(s)">${n}</span><span class="ainit">`) : h; };

/* ---------- central de notificações ---------- */
function notificacoes() {
  const d = todayISO(), ats = atletasCat(), L = [];
  const add = (key, tipo, nivel, titulo, det, lista, nav) => L.push({ key: key + '|' + d, tipo, nivel, titulo, det, lista: lista || [], nav });
  const semBe = ats.filter(a => !(S.bemestar || []).some(r => r.atletaId === a.id && r.data === d && r.sono !== undefined));
  if (semBe.length) add('be', 'Questionários', semBe.length === ats.length ? 'info' : 'warn', `${semBe.length} atleta(s) sem questionário de bem-estar hoje`, `${ats.length - semBe.length} de ${ats.length} responderam`, semBe, 'mon-be');
  const cats = [...new Set(ats.map(a => a.categoria))];
  cats.forEach(c => { [d, addDays(d, -1)].forEach(x => { const ss = ativas(sessoesDia(c, x)); if (!ss.length) return; const el = ats.filter(a => a.categoria === c), sem = el.filter(a => !(S.pse || []).some(r => r.atletaId === a.id && r.data === x)); if (sem.length) add('pse' + c + x, 'Questionários', 'warn', `${sem.length} atleta(s) do ${c} sem PSE da sessão de ${x === d ? 'hoje' : 'ontem'}`, ss.map(s => (SESS[s.tipo] || SESS.treino)[0]).join(' + ') + ' · ' + fmtD(x), sem, 'mon-pse'); }); });
  const AL = ats.map(a => ({ a, A: alertasAtleta(a, d) }));
  const risco = AL.filter(x => x.A.sc && x.A.sc.c === 'bad'); if (risco.length) add('carga', 'Carga', 'bad', `${risco.length} atleta(s) com indicador de carga ALTO`, 'ACWR acima de 1,5, monotonia alta ou bem-estar em intervenção', risco.map(x => x.a), 'mon-pse');
  const seg = AL.filter(x => x.A.lista.some(l => /consecutivos/.test(l[1]))); if (seg.length) add('seguidos', 'Carga', 'warn', `${seg.length} atleta(s) com 5 ou mais treinos seguidos sem descanso`, 'Considere uma folga ou sessão regenerativa', seg.map(x => x.a), 'mon-pse-sem');
  const pr = AL.filter(x => x.A.pr && x.A.pr.p < 60); if (pr.length) add('pront', 'Carga', 'bad', `${pr.length} atleta(s) com prontidão baixa hoje`, 'Prontidão abaixo de 60% no bem-estar', pr.map(x => x.a), 'mon-pse');
  const dor = AL.filter(x => x.A.lista.some(l => /^Dor informada/.test(l[1]))); if (dor.length) add('dor', 'Departamento médico', 'warn', `${dor.length} atleta(s) informaram dor hoje`, 'Avaliar com o DM antes da atividade', dor.map(x => x.a), 'mon-be');
  const venc = lesAtivas().filter(l => l.previsao && l.previsao < d && ats.some(a => a.id === l.atletaId)); if (venc.length) add('dmprev', 'Departamento médico', 'warn', `${venc.length} lesão(ões) com previsão de retorno vencida`, 'Atualize o status ou a previsão no DM', venc.map(l => atl(l.atletaId)).filter(Boolean), 'dm-lesionados');
  [['fis', 'avaliação física', 'av-dash'], ['corp', 'avaliação corporal', 'nut-comp'], ['mat', 'medição de maturação', 'mat-dash']].forEach(([t, n, nav]) => { const l = ats.filter(a => pendente(a, t)); if (l.length) add('pend' + t, 'Avaliações', 'info', `${l.length} atleta(s) sem ${n} na temporada`, 'Pendência da temporada ' + anoLabel(), l, nav); });
  (S.config.agenda || []).filter(x => x.data >= d && dayDiff(d, x.data) <= 7).forEach(x => add('ag' + x.id, 'Agenda', 'info', `Teste agendado: ${x.teste}`, `${fmtD(x.data)} · ${x.categoria}`, [], 'av-dash'));
  const aniv = ats.filter(a => a.nascimento && a.nascimento.slice(5) === d.slice(5)); if (aniv.length) add('aniv', 'Agenda', 'info', `Aniversário hoje: ${aniv.map(a => a.apelido || a.nome.split(' ')[0]).join(', ')}`, '', aniv, null);
  return L;
}
const lidas = () => new Set(S.config.notifLidas || []);
function vNotif() {
  const L = notificacoes(), rd = lidas(), tipos = ['Todas', ...new Set(L.map(n => n.tipo))];
  const vis = L.filter(n => (UI.nfTipo === 'Todas' || n.tipo === UI.nfTipo) && (UI.nfLidas || !rd.has(n.key)));
  const nao = L.filter(n => !rd.has(n.key)).length;
  const ats = atletasCat().map(a => ({ a, p: pendAtleta(a), al: alertasAtleta(a).lista.filter(x => x[0] !== 'info') })).filter(x => x.p.length || x.al.length).sort((x, y) => y.al.length - x.al.length || y.p.length - x.p.length);
  return header({ title: 'NOTIFICAÇÕES', sub: 'CENTRAL DE AVISOS DA COMISSÃO', items: hdrItems(), solo: true }) + `
  <div class="kpis k4">${kpi('bell', 'Não lidas', nao, 'avisos de hoje')}${kpi('cross', 'Alertas de carga', L.filter(n => n.tipo === 'Carga').reduce((s, n) => s + n.lista.length, 0), 'atletas citados', 'red')}${kpi('clip', 'Questionários', L.filter(n => n.tipo === 'Questionários').reduce((s, n) => s + n.lista.length, 0), 'respostas faltando', 'gold')}${kpi('stopw', 'Avaliações pendentes', L.filter(n => n.tipo === 'Avaliações').reduce((s, n) => s + n.lista.length, 0), 'física, corporal e maturação', 'blue')}</div>
  <div class="row r21" style="align-items:start">
    <div class="panel"><div class="ph">Fila de atenção · ${fmtD(todayISO())}<span class="r"><button data-act="nf-all">Marcar todas como lidas</button></span></div>
      <div class="pb nfbar"><div class="hchips">${tipos.map(t => `<button class="${UI.nfTipo === t ? 'on' : ''}" data-act="nf-tipo" data-v="${t}">${t}</button>`).join('')}</div><label class="chk" style="margin-left:auto"><input type="checkbox" id="nfLidas" ${UI.nfLidas ? 'checked' : ''}> Mostrar lidas</label></div>
      <div class="nfl">${vis.map(n => `<div class="nfi n-${n.nivel} ${rd.has(n.key) ? 'lida' : ''}"><i></i><div class="nft"><small>${esc(n.tipo)}</small><b>${esc(n.titulo)}</b>${n.det ? `<span>${esc(n.det)}</span>` : ''}${n.lista.length ? `<div class="nfa">${n.lista.slice(0, 14).map(a => `<span class="agp" data-ficha-open="${a.id}">${esc((a.apelido || a.nome).split(' ').slice(0, 2).join(' '))}</span>`).join('')}${n.lista.length > 14 ? `<span class="muted">+${n.lista.length - 14}</span>` : ''}</div>` : ''}</div><div class="nfb">${n.nav ? `<button class="btn sm" data-nav="${n.nav}">Abrir</button>` : ''}${rd.has(n.key) ? '' : `<button class="btn sm" data-act="nf-lida" data-k="${esc(n.key)}">Marcar como lida</button>`}</div></div>`).join('') || `<div class="pb">${miniEmpty(L.length ? 'Tudo lido por hoje' : 'Nenhum aviso hoje', L.length ? 'Marque “Mostrar lidas” para ver de novo.' : 'Questionários, avaliações e cargas em dia.')}</div>`}</div></div>
    <div class="panel"><div class="ph">O que falta por atleta<span class="r">${ats.length}</span></div><div class="nfpa">${ats.map(x => `<div class="nfp" data-ficha-open="${x.a.id}">${fotoBox(x.a, 'mini')}<div><b>${esc(x.a.apelido || x.a.nome)}</b><div>${x.al.map(l => `<span class="nfc c-${l[0]}">${esc(l[1])}</span>`).join('')}${x.p.map(t => `<span class="nfc c-info">Falta: ${esc(t)}</span>`).join('')}</div></div></div>`).join('') || `<div class="pb">${miniEmpty('Nenhuma pendência', 'Todos os atletas em dia.')}</div>`}</div><p class="muted pb" style="font-size:11.5px;margin:0">Apenas monitoramento: não é diagnóstico médico nem previsão de lesão.</p></div>
  </div>`;
}
const notifCount = () => { try { const rd = lidas(); return notificacoes().filter(n => !rd.has(n.key) && n.nivel !== 'info').length; } catch (e) { return 0; } };
dmOn('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'nf-tipo') { UI.nfTipo = t.dataset.v; render(); }
  if (t.dataset.act === 'nf-lida') { S.config.notifLidas = [...(S.config.notifLidas || []).slice(-300), t.dataset.k]; putConfig(); render(); }
  if (t.dataset.act === 'nf-all') { S.config.notifLidas = [...new Set([...(S.config.notifLidas || []).slice(-300), ...notificacoes().map(n => n.key)])]; putConfig(); render(); }
});
dmOn('change', e => { if (e.target.id === 'nfLidas') { UI.nfLidas = e.target.checked; render(); } });

/* ---------- dados de teste do monitoramento (para ver como fica; dá para limpar depois) ---------- */
function catTeste() { if (F.categoria !== 'Todas') return F.categoria; const c = countBy(S.atletas, a => a.categoria); return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sub-15'; }
async function carregarTeste() {
  const cat = catTeste(), ats = S.atletas.filter(a => a.categoria === cat); if (!ats.length) { toast('Cadastre atletas nessa categoria antes.', true); return; }
  progress('Gerando dados de teste…');
  let s = 17; const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; const pick = a => a[Math.floor(r() * a.length)];
  const plan = [['recup', 'Recuperação', '09:00', 45, 3], ['treino', 'Treino de campo', '10:00', 75, 6], ['forca', 'Força', '10:00', 80, 7], ['cond', 'Condicionamento', '10:00', 70, 6], ['matchprep', 'Match preparation', '10:00', 60, 4], ['jogo', 'Jogo', '15:00', 90, 8], ['folga', 'Folga', '', 0, null]];
  const w0 = segunda(todayISO()), micro = [], pse = [], be = [];
  for (let wk = -4; wk <= 0; wk++) plan.forEach((p, i) => { const d = addDays(w0, wk * 7 + i); if (!sessoesDia(cat, d).length) micro.push({ id: `demo_ms_${cat}_${d}`, demo: true, categoria: cat, data: d, tipo: p[0], titulo: p[0] === 'jogo' ? '' : p[1], hora: p[2], duracao: p[3], pse: p[4], adversario: p[0] === 'jogo' ? pick(['Rio Branco', 'Desportiva', 'Vitória', 'Serra', 'Real Noroeste']) : '', mando: r() < 0.5 ? 'casa' : 'fora' });
    if (p[0] !== 'folga' && d <= todayISO()) ats.forEach((a, k) => { if (r() < 0.08) return; const extra = k % 7 === 0 && wk === 0 ? 2.5 : 0; pse.push({ id: `demo_pse_${a.id}_${d}`, demo: true, atletaId: a.id, data: d, sessao: p[0] === 'jogo' ? 'Jogo' : p[0] === 'recup' ? 'Recuperação' : 'Treino', pse: Math.max(1, Math.min(10, Math.round(p[4] + r() * 2 - 1 + extra))), duracao: p[3] + (extra ? 20 : 0) }); }); });
  for (let k = 0; k < 14; k++) { const d = addDays(todayISO(), -k); ats.forEach((a, j) => { if (r() < (k === 0 ? 0.25 : 0.12)) return; const ruim = j % 6 === 0 && k < 3; be.push({ id: `demo_be_${a.id}_${d}`, demo: true, atletaId: a.id, data: d, origem: 'teste', treinaHoje: r() < 0.05 ? 'Não' : 'Sim', dor: ruim && r() < 0.6 ? 'Dolorido' : 'Normal', escalaDor: ruim ? 3 + Math.floor(r() * 5) : null, localDor: ruim ? pick(['Coxa direita', 'Panturrilha esquerda', 'Joelho', 'Lombar']) : '', fadiga: ruim ? pick(BEF.fadiga.slice(3)) : pick(BEF.fadiga.slice(0, 3)), recuperacao: ruim ? pick(BEF.recuperacao.slice(3)) : pick(BEF.recuperacao.slice(0, 3)), sono: ruim ? pick(BEF.sono.slice(3)) : pick(BEF.sono.slice(0, 3)), estresse: pick(BEF.estresse.slice(0, 4)), humor: pick(BEF.humor.slice(0, 3)), urina: ruim ? 5 + Math.floor(r() * 3) : 1 + Math.floor(r() * 4), motivo: '' }); }); }
  try { progress(`Salvando ${micro.length} sessões…`); await saveMany('micro', micro); progress(`Salvando ${pse.length} registros de PSE…`); await saveMany('pse', pse); progress(`Salvando ${be.length} questionários…`); await saveMany('bemestar', be); } catch (e) { }
  progressEnd(); render(); toast(`Dados de teste do ${cat}: ${micro.length} sessões, ${pse.length} PSE e ${be.length} questionários`);
}
async function limparTeste() {
  const cols = ['micro', 'pse', 'bemestar'], ops = cols.flatMap(c => (S[c] || []).filter(x => x.demo || String(x.id).startsWith('demo_')).map(x => [c, x.id]));
  if (!ops.length) { toast('Não há dados de teste para limpar.'); return; }
  progress('Limpando dados de teste…'); cols.forEach(c => S[c] = (S[c] || []).filter(x => !(x.demo || String(x.id).startsWith('demo_'))));
  if (db) { for (let i = 0; i < ops.length; i += 20) await Promise.all(ops.slice(i, i + 20).map(([c, id]) => db.collection(c).doc(id).delete().catch(() => { }))); } else lsSave();
  progressEnd(); render(); toast(`${ops.length} registro(s) de teste removido(s)`);
}
const temTeste = () => ['micro', 'pse', 'bemestar'].some(c => (S[c] || []).some(x => x.demo || String(x.id).startsWith('demo_')));
const _vMon3 = vMon;
vMon = function () {
  const h = _vMon3(); if (PRINT) return h;
  const box = !(S.pse || []).length ? `<div class="abanner warn">${IC.clip}<div><b>Ainda não há dados de PSE</b><span>Quer ver como fica? Carregue dados de teste do ${esc(catTeste())} (5 semanas de microciclo, PSE e bem-estar). Depois é só limpar. <button class="btn sm pri" data-act="teste-on" style="margin-left:8px">Carregar dados de teste</button></span></div></div>` : temTeste() ? `<div class="abanner warn">${IC.clip}<div><b>Você está vendo dados de teste</b><span>Quando quiser começar com os dados reais: <button class="btn sm" data-act="teste-off" style="margin-left:8px">${IC.trash} Limpar dados de teste</button></span></div></div>` : '';
  if (!box) return h; const i = h.indexOf('</nav>'); return i < 0 ? box + h : h.slice(0, i + 6) + box + h.slice(i + 6);
};
dmOn('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'teste-on') carregarTeste(); if (t.dataset.act === 'teste-off') confirmar('Apagar todos os dados de teste (sessões, PSE e questionários de exemplo)? Os dados reais não são afetados.', limparTeste); });

/* ================= PRANCHETA TÁTICA 2.0 ================= */
const PAD2 = {
  jA: ['Jogador verde', '#1b8a4a', 'j'], jB: ['Jogador amarelo', '#f2b81b', 'j'], jC: ['Jogador vermelho', '#e0342b', 'j'], jD: ['Jogador azul', '#2f6fd6', 'j'], gk: ['Goleiro', '#f39324', 'j'], cur: ['Coringa', '#ffffff', 'j'], man: ['Manequim', '#9aa5a0', 'j'],
  cone: ['Cone', '#f39324', 'm'], prato: ['Pratinho', '#f6c21c', 'm'], estaca: ['Estaca', '#e0342b', 'm'], arco: ['Arco', '#2f6fd6', 'm'], barreira: ['Mini-barreira', '#e0342b', 'm'], escada: ['Escada', '#f6c21c', 'm'], bandeira: ['Bandeira', '#f6c21c', 'm'],
  bola: ['Bola', '#ffffff', 'm'], mini: ['Mini-gol', '#ffffff', 'm'], gol: ['Gol', '#ffffff', 'm']
};
function padIcon(b) {
  const t = b.t, c = b.c || (PAD2[t] || PAD2.cone)[1], dk = '#14201a';
  if ((PAD2[t] || [])[2] === 'j') { const txt = ['jB', 'cur'].includes(t) ? dk : '#fff'; return `<ellipse cx="0" cy="15" rx="9" ry="2.6" fill="rgba(0,0,0,.28)"/><rect x="-5.5" y="4" width="4.2" height="11" rx="2" fill="${t === 'man' ? '#7d8782' : '#1d2a23'}"/><rect x="1.3" y="4" width="4.2" height="11" rx="2" fill="${t === 'man' ? '#7d8782' : '#1d2a23'}"/><path d="M-8 -6 Q-8 -10 -4 -10 H4 Q8 -10 8 -6 V6 H-8 Z" fill="${c}" stroke="${dk}" stroke-width="1.4"/><path d="M-8 -5 l-3 7 M8 -5 l3 7" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/><circle cy="-15" r="4.8" fill="${t === 'man' ? '#7d8782' : '#e9c29b'}" stroke="${dk}" stroke-width="1.3"/>${b.n ? `<text y="2.5" text-anchor="middle" font-size="8.5" font-weight="900" fill="${txt}" font-family="Arial">${esc(b.n)}</text>` : ''}`; }
  if (t === 'cone') return `<ellipse cy="10" rx="9" ry="3" fill="rgba(0,0,0,.25)"/><rect x="-10" y="7" width="20" height="4" rx="1.5" fill="${c}" stroke="#8a3b00" stroke-width="1"/><path d="M-6.5 8 L-1.6 -13 H1.6 L6.5 8 Z" fill="${c}" stroke="#8a3b00" stroke-width="1"/><path d="M-4.2 -1 H4.2 L5 2.6 H-5 Z" fill="#fff"/>`;
  if (t === 'prato') return `<circle r="9" fill="${c}" stroke="rgba(0,0,0,.35)" stroke-width="1.2"/><circle r="9" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1" stroke-dasharray="2 2"/><circle r="3.4" fill="#2f8f3a" stroke="rgba(0,0,0,.35)" stroke-width="1"/>`;
  if (t === 'estaca') return `<ellipse cy="13" rx="5" ry="2" fill="rgba(0,0,0,.25)"/><rect x="-2" y="-16" width="4" height="29" rx="2" fill="${c}"/><rect x="-2" y="-8" width="4" height="4" fill="#fff"/><rect x="-2" y="2" width="4" height="4" fill="#fff"/>`;
  if (t === 'arco') return `<circle r="11" fill="none" stroke="${c}" stroke-width="3"/>`;
  if (t === 'barreira') return `<path d="M-12 9 V-4 H12 V9" fill="none" stroke="${c}" stroke-width="3.2" stroke-linejoin="round"/><path d="M-15 9 H-9 M9 9 H15" stroke="#14201a" stroke-width="2.4"/>`;
  if (t === 'escada') return `<rect x="-32" y="-8" width="64" height="16" fill="none" stroke="${c}" stroke-width="2.4"/>${[-21, -11, 0, 11, 21].map(v => `<line x1="${v}" y1="-8" x2="${v}" y2="8" stroke="${c}" stroke-width="2.2"/>`).join('')}`;
  if (t === 'bandeira') return `<line x1="0" y1="12" x2="0" y2="-14" stroke="#fff" stroke-width="2"/><path d="M0 -14 L12 -9 L0 -4 Z" fill="${c}" stroke="#14201a" stroke-width=".8"/>`;
  if (t === 'bola') return `<circle r="6.5" fill="#fff" stroke="#14201a" stroke-width="1.4"/><path d="M0 -3 l2.8 2 -1 3.3 h-3.6 l-1 -3.3 z" fill="#14201a"/>`;
  if (t === 'mini') return `<rect x="-14" y="-8" width="28" height="16" fill="rgba(255,255,255,.12)" stroke="#fff" stroke-width="2.6"/><path d="M-14 -8 l5 -5 h18 l5 5" fill="none" stroke="#fff" stroke-width="1.4"/><path d="M-9 -13 V3 M9 -13 V3" stroke="rgba(255,255,255,.5)" stroke-width="1"/>`;
  if (t === 'gol') return `<rect x="-26" y="-10" width="52" height="20" fill="rgba(255,255,255,.15)" stroke="#fff" stroke-width="3.2"/>${[-16, -6, 4, 14].map(v => `<line x1="${v}" y1="-10" x2="${v}" y2="10" stroke="rgba(255,255,255,.45)" stroke-width="1"/>`).join('')}`;
  return `<circle r="6" fill="${c}"/>`;
}
campoSVG = function (pad = {}, o = {}) {
  const W = 600, H = 390, objs = pad.objs || [], setas = pad.setas || [], meio = pad.campo === 'meio';
  const stripes = Array.from({ length: 10 }, (_, i) => `<rect x="${i * W / 10}" y="0" width="${W / 10}" height="${H}" fill="${i % 2 ? '#2f8f3a' : '#36a043'}"/>`).join('');
  const lines = meio
    ? `<rect x="20" y="20" width="${W - 40}" height="${H - 40}" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M${W / 2 - 120} 20v80h240v-80M${W / 2 - 55} 20v32h110v-32" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M${W / 2 - 50} 100a50 50 0 0 0 100 0" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="${W / 2}" cy="${H - 20}" r="50" fill="none" stroke="#fff" stroke-width="2.5"/>`
    : pad.campo === 'livre' ? '' : `<rect x="15" y="15" width="${W - 30}" height="${H - 30}" fill="none" stroke="#fff" stroke-width="2.5"/><line x1="${W / 2}" y1="15" x2="${W / 2}" y2="${H - 15}" stroke="#fff" stroke-width="2.5"/><circle cx="${W / 2}" cy="${H / 2}" r="45" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="${W / 2}" cy="${H / 2}" r="3" fill="#fff"/><path d="M15 ${H / 2 - 95}h85v190h-85M15 ${H / 2 - 45}h32v90h-32M${W - 15} ${H / 2 - 95}h-85v190h85M${W - 15} ${H / 2 - 45}h-32v90h32" fill="none" stroke="#fff" stroke-width="2.5"/>`;
  const X = v => v / 100 * W, Y = v => v / 100 * H;
  const defs = `<defs>${['passe', 'movimento', 'conducao'].map(k => `<marker id="ah-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${k === 'passe' ? '#fff' : k === 'conducao' ? '#f6c21c' : '#14201a'}"/></marker>`).join('')}</defs>`;
  const area = pad.area ? `<rect x="${X(pad.area.x)}" y="${Y(pad.area.y)}" width="${X(pad.area.w)}" height="${Y(pad.area.h)}" fill="rgba(255,255,255,.12)" stroke="#fff" stroke-width="2" stroke-dasharray="6 5"/>` : '';
  const seta = (s, i) => `<line class="pseta" data-s="${i}" x1="${X(s.x1)}" y1="${Y(s.y1)}" x2="${X(s.x2)}" y2="${Y(s.y2)}" stroke="${s.tipo === 'passe' ? '#fff' : s.tipo === 'conducao' ? '#f6c21c' : '#14201a'}" stroke-width="3" ${s.tipo === 'movimento' ? 'stroke-dasharray="8 6"' : s.tipo === 'conducao' ? 'stroke-dasharray="2 5" stroke-linecap="round"' : ''} marker-end="url(#ah-${s.tipo || 'passe'})"/>`;
  const obj = (b, i) => `<g class="pobj ${o.sel === i ? 'psel' : ''}" data-i="${i}" transform="translate(${X(b.x)} ${Y(b.y)}) rotate(${b.r || 0}) scale(${b.s || 1})">${o.sel === i ? '<circle r="22" fill="rgba(242,184,27,.18)" stroke="#f2b81b" stroke-width="2" stroke-dasharray="4 3"/>' : ''}${padIcon(b)}</g>`;
  return `<svg class="padsvg" viewBox="0 0 ${W} ${H}" ${o.id ? `id="${o.id}"` : ''} xmlns="http://www.w3.org/2000/svg">${defs}${stripes}${lines}${area}${setas.map(seta).join('')}${objs.map(obj).join('')}</svg>`;
};
abrirPrancheta = function (bloco, onSave) {
  const P = { pad: JSON.parse(JSON.stringify(bloco.pad || { campo: 'inteiro', objs: [], setas: [] })), tool: 'jA', sel: null, num: 1, tam: 1.2 };
  P.pad.objs = (P.pad.objs || []).map(b => ({ ...b, t: b.t === 'jA' || PAD2[b.t] ? b.t : b.t === 'manequim' ? 'man' : b.t }));
  const ico = k => `<svg viewBox="-24 -22 48 44" width="34" height="32"><rect x="-24" y="-22" width="48" height="44" rx="6" fill="#2f8f3a"/><g transform="scale(${['escada', 'gol'].includes(k) ? .62 : 1.05})">${padIcon({ t: k, n: (PAD2[k] || [])[2] === 'j' && k !== 'man' ? '7' : '' })}</g></svg>`;
  const ov = document.createElement('div'); ov.className = 'padov';
  ov.innerHTML = `<div class="padbox">
    <div class="padhd"><b>Prancheta tática</b><span class="muted">1) escolha o item · 2) clique no campo para colocar · 3) clique num item para selecionar e arrastar · roda do mouse aumenta/diminui</span><span style="flex:1"></span><button class="btn sm" data-pad="clear">${IC.trash} Limpar</button><button class="btn sm" data-pad="cancel">Cancelar</button><button class="btn sm pri" data-pad="ok">${IC.check} Usar no plano</button></div>
    <div class="padgrid"><aside class="padside">
      <h6>Jogadores</h6><div class="ptg">${Object.entries(PAD2).filter(([, v]) => v[2] === 'j').map(([k, [n]]) => `<button data-tool="${k}" class="${k === 'jA' ? 'on' : ''}">${ico(k)}<span>${n}</span></button>`).join('')}</div>
      <h6>Materiais</h6><div class="ptg">${Object.entries(PAD2).filter(([, v]) => v[2] === 'm').map(([k, [n]]) => `<button data-tool="${k}">${ico(k)}<span>${n}</span></button>`).join('')}</div>
      <h6>Desenho</h6><div class="ptg">${[['seta-passe', 'Passe', '<line x1="-16" y1="10" x2="14" y2="-10" stroke="#fff" stroke-width="3"/>'], ['seta-movimento', 'Movimento', '<line x1="-16" y1="10" x2="14" y2="-10" stroke="#14201a" stroke-width="3" stroke-dasharray="5 4"/>'], ['seta-conducao', 'Condução', '<line x1="-16" y1="10" x2="14" y2="-10" stroke="#f6c21c" stroke-width="3" stroke-dasharray="1 5" stroke-linecap="round"/>'], ['area', 'Área', '<rect x="-15" y="-11" width="30" height="22" fill="rgba(255,255,255,.15)" stroke="#fff" stroke-width="2" stroke-dasharray="4 3"/>'], ['del', 'Apagar', '<path d="M-9 -9 L9 9 M9 -9 L-9 9" stroke="#ff8a80" stroke-width="3.5"/>']].map(([k, n, s]) => `<button data-tool="${k}"><svg viewBox="-24 -22 48 44" width="34" height="32"><rect x="-24" y="-22" width="48" height="44" rx="6" fill="#2f8f3a"/>${s}</svg><span>${n}</span></button>`).join('')}</div>
      <h6>Opções</h6><label class="popt">Campo <select data-padopt="campo"><option value="inteiro">Campo inteiro</option><option value="meio" ${P.pad.campo === 'meio' ? 'selected' : ''}>Meio-campo</option><option value="livre" ${P.pad.campo === 'livre' ? 'selected' : ''}>Sem marcação</option></select></label>
      <label class="popt">Tamanho dos novos itens <input type="range" min="0.6" max="2.2" step="0.1" value="${P.tam}" data-padopt="tam"></label>
      <label class="popt"><input type="checkbox" data-padopt="numerar" checked> Numerar jogadores · próximo nº <input type="number" min="0" max="99" value="1" data-padopt="num" style="width:54px"></label>
    </aside><div class="padmain"><div class="padsel" id="padSel"></div><div class="padstage" id="padStage"></div></div></div></div>`;
  document.body.appendChild(ov);
  const selBar = () => { const b = P.sel != null ? P.pad.objs[P.sel] : null; $('#padSel').innerHTML = b ? `<b>Selecionado: ${(PAD2[b.t] || [b.t])[0]}${b.n ? ' nº ' + esc(b.n) : ''}</b><button class="btn sm" data-ps="menos">− Menor</button><button class="btn sm" data-ps="mais">+ Maior</button><button class="btn sm" data-ps="gira">↻ Girar 45°</button><label class="pcolor">Cor <input type="color" value="${b.c || (PAD2[b.t] || ['', '#ffffff'])[1]}" data-ps="cor"></label>${(PAD2[b.t] || [])[2] === 'j' ? `<label class="pcolor">Nº <input value="${esc(b.n || '')}" data-ps="num" style="width:44px"></label>` : ''}<button class="btn sm" data-ps="dup">Duplicar</button><button class="btn sm danger" data-ps="del">${IC.trash} Remover</button>` : '<span class="muted">Nenhum item selecionado. Clique em um item do campo para mudar tamanho, giro, cor ou número.</span>'; };
  const redraw = () => { $('#padStage').innerHTML = campoSVG(P.pad, { edit: true, id: 'padSvg', sel: P.sel }); selBar(); };
  const pt = e => { const s = $('#padSvg'), r = s.getBoundingClientRect(); return { x: Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)), y: Math.max(0, Math.min(100, (e.clientY - r.top) / r.height * 100)) }; };
  let drag = null;
  ov.addEventListener('click', e => {
    const b = e.target.closest('[data-tool]'); if (b) { P.tool = b.dataset.tool; ov.querySelectorAll('[data-tool]').forEach(x => x.classList.toggle('on', x === b)); }
    const a = e.target.closest('[data-pad]'); if (a) { if (a.dataset.pad === 'ok') { onSave(P.pad); ov.remove(); } if (a.dataset.pad === 'cancel') ov.remove(); if (a.dataset.pad === 'clear') { P.pad.objs = []; P.pad.setas = []; delete P.pad.area; P.sel = null; redraw(); } }
    const s = e.target.closest('[data-ps]'); if (s && P.sel != null) { const o = P.pad.objs[P.sel]; if (s.dataset.ps === 'menos') o.s = Math.max(0.4, Math.round(((o.s || 1) - 0.15) * 100) / 100); if (s.dataset.ps === 'mais') o.s = Math.min(3, Math.round(((o.s || 1) + 0.15) * 100) / 100); if (s.dataset.ps === 'gira') o.r = ((o.r || 0) + 45) % 360; if (s.dataset.ps === 'dup') { P.pad.objs.push({ ...o, x: Math.min(97, o.x + 4), y: Math.min(97, o.y + 4) }); P.sel = P.pad.objs.length - 1; } if (s.dataset.ps === 'del') { P.pad.objs.splice(P.sel, 1); P.sel = null; } if (['menos', 'mais', 'gira', 'dup', 'del'].includes(s.dataset.ps)) redraw(); }
  });
  ov.addEventListener('input', e => { const s = e.target.dataset.ps; if (s && P.sel != null) { const o = P.pad.objs[P.sel]; if (s === 'cor') o.c = e.target.value; if (s === 'num') o.n = e.target.value; $('#padStage').innerHTML = campoSVG(P.pad, { edit: true, id: 'padSvg', sel: P.sel }); } const op = e.target.dataset.padopt; if (op === 'tam') P.tam = +e.target.value; if (op === 'num') P.num = +e.target.value || 0; });
  ov.addEventListener('change', e => { if (e.target.dataset.padopt === 'campo') { P.pad.campo = e.target.value; redraw(); } });
  ov.addEventListener('pointerdown', e => {
    if (!e.target.closest('#padSvg')) return; e.preventDefault(); const p = pt(e), tool = P.tool, g = e.target.closest('.pobj'), sl = e.target.closest('.pseta');
    if (e.button === 2 || tool === 'del') { if (g) { P.pad.objs.splice(+g.dataset.i, 1); P.sel = null; } else if (sl) P.pad.setas.splice(+sl.dataset.s, 1); redraw(); return; }
    if (g && !tool.startsWith('seta') && tool !== 'area') { P.sel = +g.dataset.i; drag = { i: P.sel, moved: false }; redraw(); return; }
    if (tool.startsWith('seta-') || tool === 'area') { drag = { novo: tool, x0: p.x, y0: p.y }; return; }
    const o = { t: tool, x: p.x, y: p.y, s: P.tam };
    if ((PAD2[tool] || [])[2] === 'j' && tool !== 'man' && ov.querySelector('[data-padopt="numerar"]').checked) { o.n = String(P.num || ''); P.num = (P.num || 0) + 1; ov.querySelector('[data-padopt="num"]').value = P.num; }
    P.pad.objs.push(o); P.sel = P.pad.objs.length - 1; redraw();
  });
  ov.addEventListener('pointermove', e => { if (!drag || !$('#padSvg')) return; const p = pt(e); if (drag.i != null) { const b = P.pad.objs[drag.i]; b.x = p.x; b.y = p.y; $('#padStage').innerHTML = campoSVG(P.pad, { edit: true, id: 'padSvg', sel: P.sel }); } else if (drag.novo) { drag.x1 = p.x; drag.y1 = p.y; const tmp = JSON.parse(JSON.stringify(P.pad)); if (drag.novo === 'area') tmp.area = { x: Math.min(drag.x0, p.x), y: Math.min(drag.y0, p.y), w: Math.abs(p.x - drag.x0), h: Math.abs(p.y - drag.y0) }; else tmp.setas.push({ x1: drag.x0, y1: drag.y0, x2: p.x, y2: p.y, tipo: drag.novo.slice(5) }); $('#padStage').innerHTML = campoSVG(tmp, { edit: true, id: 'padSvg', sel: P.sel }); } });
  ov.addEventListener('pointerup', () => { if (drag && drag.novo && drag.x1 != null && (Math.abs(drag.x1 - drag.x0) > 1.5 || Math.abs(drag.y1 - drag.y0) > 1.5)) { if (drag.novo === 'area') P.pad.area = { x: Math.min(drag.x0, drag.x1), y: Math.min(drag.y0, drag.y1), w: Math.abs(drag.x1 - drag.x0), h: Math.abs(drag.y1 - drag.y0) }; else P.pad.setas.push({ x1: drag.x0, y1: drag.y0, x2: drag.x1, y2: drag.y1, tipo: drag.novo.slice(5) }); } if (drag) redraw(); drag = null; });
  ov.addEventListener('wheel', e => { const g = e.target.closest('.pobj'); if (!g) return; e.preventDefault(); const o = P.pad.objs[+g.dataset.i]; P.sel = +g.dataset.i; o.s = Math.max(0.4, Math.min(3, Math.round(((o.s || 1) + (e.deltaY < 0 ? 0.1 : -0.1)) * 100) / 100)); redraw(); }, { passive: false });
  ov.addEventListener('contextmenu', e => { if (e.target.closest('#padSvg')) e.preventDefault(); });
  ov.addEventListener('keydown', e => { if ((e.key === 'Delete' || e.key === 'Backspace') && P.sel != null && !/INPUT|SELECT/.test(e.target.tagName)) { P.pad.objs.splice(P.sel, 1); P.sel = null; redraw(); } });
  ov.tabIndex = -1; ov.focus(); redraw();
};

/* ================= CALENDÁRIO ================= */
IC.calM = I('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h2M12 14h2M16 14h2M8 18h2M12 18h2"/>');
TITLES.cal = ['Calendário', 'Mês'];
NAV.push({ k: 'cal', n: 'Calendário', ic: IC.calM });
UI.calMes = todayISO().slice(0, 7); UI.calDia = todayISO(); UI.calF = new Set(['treino', 'jogo', 'aval', 'folga', 'dm']);
const CALT = { treino: ['Treinos', '#1b8a4a'], jogo: ['Jogos', '#f2b81b'], aval: ['Avaliações', '#7a3fd1'], folga: ['Folgas', '#8a948f'], dm: ['Retornos do DM', '#2f6fd6'] };
function eventosDia(d) {
  const cats = F.categoria === 'Todas' ? Object.keys(GRUPOS) : [F.categoria], ev = [];
  cats.forEach(c => sessoesDia(c, d).forEach(s => ev.push({ k: s.tipo === 'jogo' ? 'jogo' : s.tipo === 'folga' ? 'folga' : s.tipo === 'aval' ? 'aval' : 'treino', t: s.tipo === 'jogo' ? `Jogo${s.adversario ? ' x ' + s.adversario : ''}` : s.tipo === 'folga' ? 'Folga' : (s.titulo || SESS[s.tipo]?.[0] || 'Treino'), h: s.hora || '', c, s, info: [s.duracao ? s.duracao + ' min' : '', s.pse != null ? 'PSE ' + s.pse : '', s.mando ? (s.mando === 'fora' ? 'fora' : 'casa') : ''].filter(Boolean).join(' · ') })));
  (window.MIN?.S.jogos || []).filter(j => j.data === d && cats.includes(j.categoria)).forEach(j => { if (ev.some(e => e.k === 'jogo' && e.c === j.categoria)) return; ev.push({ k: 'jogo', t: `Jogo x ${j.adversario || ''}`, h: j.hora || '', c: j.categoria, j, info: [j.competicao, j.golsPro != null && j.golsPro !== '' ? `${j.golsPro} x ${j.golsContra}` : ''].filter(Boolean).join(' · ') }); });
  const tsc = new Set((S.testes || []).filter(t => t.data === d && cats.includes(atl(t.atletaId)?.categoria)).map(t => atl(t.atletaId).categoria)); tsc.forEach(c => ev.push({ k: 'aval', t: 'Sessão de testes', c, info: 'realizada', nav: 'av-reg' }));
  (S.config.agenda || []).filter(x => x.data === d && cats.includes(x.categoria)).forEach(x => ev.push({ k: 'aval', t: x.teste, c: x.categoria, info: 'agendado', nav: 'av-dash' }));
  if ([...new Set((S.maturacao || []).filter(m => m.data === d).map(m => atl(m.atletaId)?.categoria))].some(c => cats.includes(c))) ev.push({ k: 'aval', t: 'Medição de maturação', c: '', nav: 'mat-dash' });
  lesAtivas().filter(l => l.previsao === d && cats.includes(atl(l.atletaId)?.categoria)).forEach(l => ev.push({ k: 'dm', t: 'Retorno previsto: ' + (atl(l.atletaId)?.apelido || atl(l.atletaId)?.nome || ''), c: atl(l.atletaId)?.categoria, info: lesNome(l), nav: 'dm-lesionados' }));
  return ev.filter(e => UI.calF.has(e.k)).sort((a, b) => String(a.h).localeCompare(String(b.h)));
}
function vCal() {
  const [y, m] = UI.calMes.split('-').map(Number), ini = `${y}-${pad(m)}-01`, g0 = segunda(ini), dias = Array.from({ length: 42 }, (_, i) => addDays(g0, i));
  const nomeMes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][m - 1];
  const mesAnt = m === 1 ? `${y - 1}-12` : `${y}-${pad(m - 1)}`, mesProx = m === 12 ? `${y + 1}-01` : `${y}-${pad(m + 1)}`;
  const doMes = dias.filter(d => d.slice(0, 7) === UI.calMes), E = Object.fromEntries(dias.map(d => [d, eventosDia(d)]));
  const cnt = k => doMes.reduce((s, d) => s + E[d].filter(e => e.k === k).length, 0);
  const cats = F.categoria === 'Todas' ? Object.keys(GRUPOS) : [F.categoria];
  const meso = d => (S.macro || []).filter(b => cats.includes(b.categoria) && b.inicio <= d && b.fim >= d).sort((a, b) => (a.tipo === 'meso' ? 0 : 1) - (b.tipo === 'meso' ? 0 : 1))[0];
  const ev = E[UI.calDia] || eventosDia(UI.calDia);
  return header({ title: 'CALENDÁRIO', sub: 'TREINOS · JOGOS · AVALIAÇÕES', items: hdrItems(), solo: true }) + `
  <div class="kpis k5">${Object.entries(CALT).map(([k, [n, c]]) => `<div class="kpi calk ${UI.calF.has(k) ? '' : 'off'}" data-act="cal-f" data-k="${k}" role="button" tabindex="0" style="--cc:${c}"><i></i><div><div class="k">${n}</div><div class="v">${cnt(k)}</div><div class="s">em ${nomeMes.toLowerCase()} · clique para ${UI.calF.has(k) ? 'ocultar' : 'mostrar'}</div></div></div>`).join('')}</div>
  <div class="row r31b" style="align-items:start">
    <div class="panel"><div class="ph calph"><button class="btn sm" data-act="cal-m" data-v="${mesAnt}" aria-label="Mês anterior">‹</button><b>${nomeMes} ${y}</b><button class="btn sm" data-act="cal-m" data-v="${mesProx}" aria-label="Próximo mês">›</button><button class="btn sm" data-act="cal-m" data-v="${todayISO().slice(0, 7)}">Hoje</button><span class="r">${esc(catLabel())}</span></div>
      <div class="calg">${SEMANA.map(s => `<div class="calh">${s}</div>`).join('')}${dias.map(d => { const out = d.slice(0, 7) !== UI.calMes, l = E[d], mz = meso(d), md = F.categoria !== 'Todas' ? mdLabel(d, F.categoria) : '';
        return `<div class="cald ${out ? 'out' : ''} ${d === todayISO() ? 'hoje' : ''} ${d === UI.calDia ? 'sel' : ''}" data-act="cal-d" data-d="${d}">${mz ? `<span class="calz" style="background:${mz.cor}" title="${esc(mz.nome)}"></span>` : ''}<div class="caln"><b>${+d.slice(8)}</b>${md ? `<em class="${md === 'MD' ? 'g' : ''}">${md}</em>` : ''}</div>${l.slice(0, 4).map(e => `<div class="cale k-${e.k}" style="--cc:${CALT[e.k][1]}" data-tip="${esc(e.t)}${e.c ? ' · ' + esc(e.c) : ''}${e.h ? ' · ' + esc(e.h) : ''}${e.info ? '\n' + esc(e.info) : ''}">${e.h ? `<small>${esc(e.h)}</small>` : ''}${esc(e.t)}</div>`).join('')}${l.length > 4 ? `<div class="calmore">+${l.length - 4}</div>` : ''}</div>`; }).join('')}</div>
      <div class="pb legend-status" style="justify-content:center">${Object.entries(CALT).map(([k, [n, c]]) => `<span><span class="sq" style="background:${c}"></span>${n}</span>`).join('')}<span class="muted">Barrinha colorida no topo do dia = mesociclo do macrociclo</span></div></div>
    <div class="panel"><div class="ph">${diaSemana(UI.calDia)}, ${fmtD(UI.calDia)}${F.categoria !== 'Todas' && mdLabel(UI.calDia, F.categoria) ? ` · ${mdLabel(UI.calDia, F.categoria)}` : ''}</div><div class="pb">
      ${ev.length ? ev.map(e => `<div class="calev" style="--cc:${CALT[e.k][1]}" ${e.s ? `data-act="cal-edit" data-id="${e.s.id}"` : e.nav ? `data-nav="${e.nav}"` : ''}><i></i><div><small>${CALT[e.k][0].replace(/s$/, '')}${e.c ? ' · ' + esc(e.c) : ''}${e.h ? ' · ' + esc(e.h) : ''}</small><b>${esc(e.t)}</b>${e.info ? `<span>${esc(e.info)}</span>` : ''}</div></div>`).join('') : miniEmpty('Nada neste dia', 'Use os botões abaixo para planejar.')}
      <div class="calbtns"><button class="btn sm pri" data-act="cal-add" data-tipo="treino">${IC.plus} Sessão de treino</button><button class="btn sm" data-act="cal-add" data-tipo="jogo">${IC.ball} Jogo</button><button class="btn sm" data-act="cal-add" data-tipo="folga">Folga</button><button class="btn sm" data-act="cal-ag">${IC.stopw} Agendar teste</button><button class="btn sm" data-act="cal-week">${IC.layers} Abrir microciclo</button></div>
      ${F.categoria === 'Todas' ? '<p class="muted" style="font-size:12px;margin:8px 0 0">Exibindo todas as categorias · Você pode criar sessões e escolher a categoria diretamente no formulário.</p>' : ''}
    </div></div>
  </div>`;
}
function abrirModalFolga(d) {
  const cats = Object.keys(GRUPOS);
  openModal(mh(`Marcar folga · ${diaSemana(d)}, ${fmtD(d)}`) + `<form id="fFolga" novalidate><div class="mb"><div class="form">
    <div class="f s4"><label for="flgCat">Categoria</label><select id="flgCat">
      <option value="todas">Todas as categorias (${cats.join(', ')})</option>
      ${cats.map(c => `<option value="${c}">${c}</option>`).join('')}
    </select></div>
    <div class="f s4"><p class="muted" style="margin:4px 0 0;font-size:13px">A folga será registrada no calendário e na programação das equipes selecionadas.</p></div>
  </div></div><div class="mf"><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Confirmar folga</button></div></form>`);
  $('#fFolga').onsubmit = e => {
    e.preventDefault();
    const val = $('#flgCat').value;
    if (val === 'todas') {
      cats.forEach(c => save('micro', { id: uid('ms'), categoria: c, data: d, tipo: 'folga', titulo: 'Folga', duracao: 0, pse: null }));
      toast('Folga registrada para todas as categorias');
    } else {
      save('micro', { id: uid('ms'), categoria: val, data: d, tipo: 'folga', titulo: 'Folga', duracao: 0, pse: null });
      toast('Folga registrada para ' + val);
    }
    closeModal();
  };
}
dmOn('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  switch (t.dataset.act) {
    case 'cal-m': UI.calMes = t.dataset.v; if (UI.calDia.slice(0, 7) !== UI.calMes) UI.calDia = UI.calMes + '-01'; render(); break;
    case 'cal-d': UI.calDia = t.dataset.d; if (t.dataset.d.slice(0, 7) !== UI.calMes) UI.calMes = t.dataset.d.slice(0, 7); render(); break;
    case 'cal-f': { const k = t.dataset.k; UI.calF.has(k) ? UI.calF.delete(k) : UI.calF.add(k); render(); break; }
    case 'cal-edit': { const s = (S.micro || []).find(x => x.id === t.dataset.id); if (s) { UI.plCat = s.categoria; formSessao(s); } break; }
    case 'cal-add': { const tp = t.dataset.tipo; if (tp === 'folga') { if (F.categoria !== 'Todas') { save('micro', { id: uid('ms'), categoria: F.categoria, data: UI.calDia, tipo: 'folga', titulo: 'Folga', duracao: 0, pse: null }); toast('Folga registrada para ' + F.categoria); } else { abrirModalFolga(UI.calDia); } } else { if (F.categoria !== 'Todas') UI.plCat = F.categoria; formSessao({}, UI.calDia, tp === 'jogo'); } break; }
    case 'cal-ag': formAgenda(); setTimeout(() => { const i = $('#agD'); if (i) i.value = UI.calDia; const c = $('#agC'); if (c && F.categoria !== 'Todas') c.value = F.categoria; }, 30); break;
    case 'cal-week': UI.week = segunda(UI.calDia); if (F.categoria !== 'Todas') UI.plCat = F.categoria; go('pl-micro'); break;
  }
});
dmOn('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.calk')) { e.preventDefault(); e.target.click(); } });

/* ================= FORMULÁRIOS DOS ATLETAS (bem-estar e PSE) ================= */
const ART_URL = 'https://claude.ai/artifact/KRM2XQBkZhyYDbzFd8psid';
let FM = null;
const fmLink = (tipo, cat) => `${ART_URL}#form=${tipo}${cat ? '&cat=' + encodeURIComponent(cat) : ''}`;
function abrirForm(tipo, cat, kiosk) {
  const fixo = (location.hash.match(/aid=([^&]+)/) || [])[1] || '';
  FM = { tipo, cat: cat || '', aid: fixo ? decodeURIComponent(fixo) : '', lock: !!fixo, a: { treinaHoje: 'Sim', dor: 'Normal' }, segs: [], done: false, kiosk: !!kiosk, d: todayISO() };
  let ov = $('#athForm'); if (!ov) { ov = document.createElement('div'); ov.id = 'athForm'; document.body.appendChild(ov); bindForm(ov); }
  ov.style.display = 'block'; renderForm();
}
function fecharForm() { const ov = $('#athForm'); if (ov) ov.style.display = 'none'; FM = null; }
const fopt = (campo, lista, cur) => `<div class="fqo">${lista.map(o => `<button type="button" class="${cur === o ? 'on' : ''}" data-fq="${campo}" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
function renderForm() {
  const ov = $('#athForm'); if (!ov || !FM) return;
  const cats = Object.keys(GRUPOS).filter(c => S.atletas.some(a => a.categoria === c));
  const ats = S.atletas.filter(a => !FM.cat || a.categoria === FM.cat).sort((a, b) => a.nome.localeCompare(b.nome));
  const a = atl(FM.aid), be = FM.tipo === 'bemestar';
  const head = `<div class="fmh"><img src="${LOGO}" alt=""><div><small>Porto Vitória · ${be ? 'pré-treino' : 'pós-treino'}</small><h2>${be ? 'Bem-estar diário' : 'Percepção de esforço (PSE)'}</h2><span>${diaSemana(FM.d)}, ${fmtD(FM.d)}</span></div><button class="fmx" data-fm="sair" aria-label="Sair">×</button></div>`;
  if (FM.done) { ov.innerHTML = `<div class="fmw">${head}<div class="fmok">${IC.check}<h3>Obrigado${a ? ', ' + esc((a.apelido || a.nome).split(' ')[0]) : ''}!</h3><p>Sua resposta foi registrada.</p>${FM.kiosk ? `<button class="fmbig" data-fm="outro">Responder outro atleta</button>` : ''}<button class="fmsec" data-fm="sair">${FM.lock ? 'Voltar' : FM.kiosk ? 'Sair do modo atleta' : 'Fechar'}</button></div></div>`; return; }
  const jaResp = a && (be ? (S.bemestar || []).some(r => r.atletaId === a.id && r.data === FM.d && r.sono !== undefined) : false);
  let body = FM.lock && a ? `<div class="fq"><h4>Atleta</h4><b style="font-size:18px">${esc(a.nome)}</b>${jaResp ? '<p class="fmwarn">Você já respondeu hoje. Se enviar de novo, a resposta anterior será substituída.</p>' : ''}</div>` : `<div class="fq"><h4>1. Quem é você?</h4>${!FM.cat && cats.length > 1 ? `<div class="fqo">${cats.map(c => `<button type="button" class="${FM.catSel === c ? 'on' : ''}" data-fm="cat" data-v="${c}">${c}</button>`).join('')}</div>` : ''}<select class="fmsel" data-fm="aid"><option value="">Escolha seu nome</option>${ats.filter(x => !FM.catSel || x.categoria === FM.catSel).map(x => `<option value="${x.id}" ${x.id === FM.aid ? 'selected' : ''}>${esc(x.nome)}${x.numero ? ' · #' + esc(x.numero) : ''}</option>`).join('')}</select>${jaResp ? '<p class="fmwarn">Você já respondeu hoje. Se enviar de novo, a resposta anterior será substituída.</p>' : ''}</div>`;
  if (be) {
    const q = (n, t, campo, lista) => `<div class="fq"><h4>${n}. ${t}</h4>${fopt(campo, lista, FM.a[campo])}</div>`;
    body += q(2, 'Você vai treinar / jogar hoje?', 'treinaHoje', BEF.treinaHoje) + (FM.a.treinaHoje === 'Não' ? `<div class="fq"><h4>Motivo</h4><input class="fmin" data-fa="motivo" value="${esc(FM.a.motivo || '')}" placeholder="Por que não vai treinar?"></div>` : '')
      + q(3, 'Como foi o seu sono?', 'sono', BEF.sono) + q(4, 'Fadiga', 'fadiga', BEF.fadiga) + q(5, 'Recuperação', 'recuperacao', BEF.recuperacao) + q(6, 'Nível de estresse', 'estresse', BEF.estresse) + q(7, 'Humor', 'humor', BEF.humor)
      + q(8, 'Dor muscular / articular?', 'dor', BEF.dor)
      + (FM.a.dor && FM.a.dor !== 'Normal' ? `<div class="fq"><h4>Onde está a dor? Toque no músculo</h4><div class="fmbody" id="fmBody">${bodyMap({ mode: 'pick' })}</div><p class="fmsel2">${FM.segs.length ? FM.segs.map(i => `<span>${esc(segTip(SEGS[i]))} <button type="button" data-fm="unseg" data-v="${i}" aria-label="Remover">×</button></span>`).join('') : '<em>Nenhum local escolhido</em>'}</p><h4>Intensidade da dor (0 a 10)</h4><div class="fsc">${Array.from({ length: 11 }, (_, i) => `<button type="button" class="${+FM.a.escalaDor === i && FM.a.escalaDor !== '' && FM.a.escalaDor != null ? 'on' : ''}" style="--c:${i <= 2 ? '#1b8a4a' : i <= 5 ? '#f0b30c' : i <= 7 ? '#f39324' : '#e0342b'}" data-fq="escalaDor" data-v="${i}">${i}</button>`).join('')}</div></div>` : '')
      + `<div class="fq"><h4>9. Cor da urina hoje</h4><div class="furi">${URINAB.map((c, i) => `<button type="button" class="${+FM.a.urina === i + 1 ? 'on' : ''}" style="background:${c}" data-fq="urina" data-v="${i + 1}">${i + 1}</button>`).join('')}</div><small class="muted">1 = bem clara (bem hidratado) · 8 = bem escura</small></div>`;
  } else {
    const cat = a ? a.categoria : (FM.catSel || FM.cat); const ss = cat ? ativas(sessoesDia(cat, FM.d)) : [];
    body += `<div class="fq"><h4>2. Qual sessão?</h4><div class="fqo">${ss.map(s => `<button type="button" class="${FM.a.sid === s.id ? 'on' : ''}" data-fm="ses" data-v="${s.id}">${esc(s.hora || '')} ${esc(s.tipo === 'jogo' ? 'Jogo' + (s.adversario ? ' x ' + s.adversario : '') : (s.titulo || SESS[s.tipo]?.[0] || 'Treino'))}</button>`).join('')}${['Treino', 'Jogo', 'Treino físico', 'Recuperação'].map(o => `<button type="button" class="${!FM.a.sid && FM.a.sessao === o ? 'on' : ''}" data-fm="sesl" data-v="${o}">${o}</button>`).join('')}</div></div>
      <div class="fq"><h4>3. Quanto tempo durou (minutos)?</h4><input class="fmin" type="number" min="5" max="240" data-fa="duracao" value="${esc(FM.a.duracao ?? '')}" placeholder="Ex.: 75"></div>
      <div class="fq"><h4>4. Como foi o treino para você?</h4><div class="fpse">${PSE_ESC.map((n, i) => `<button type="button" class="${+FM.a.pse === i && FM.a.pse !== '' && FM.a.pse != null ? 'on' : ''}" style="--c:${i <= 2 ? '#1b8a4a' : i <= 4 ? '#7bd08f' : i <= 6 ? '#f0b30c' : i <= 8 ? '#f39324' : '#e0342b'}" data-fq="pse" data-v="${i}"><b>${i}</b><span>${n}</span></button>`).join('')}</div><small class="muted">Responda cerca de 30 minutos depois do fim da sessão.</small></div>`;
  }
  ov.innerHTML = `<div class="fmw">${head}<div class="fmf">${body}<p class="fmerr" id="fmErr"></p><button class="fmbig" data-fm="enviar">${IC.check} Enviar resposta</button></div></div>`;
  ov.querySelectorAll('#fmBody [data-seg]').forEach(p => p.classList.toggle('sel', FM.segs.includes(+p.dataset.seg)));
}
async function enviarForm() {
  const a = atl(FM.aid), err = t => { $('#fmErr').textContent = t; };
  if (!a) return err('Escolha o seu nome.');
  if (FM.tipo === 'bemestar') {
    const f = FM.a; const falta = ['sono', 'fadiga', 'recuperacao', 'estresse', 'humor'].filter(k => !f[k]); if (falta.length) return err('Responda todas as perguntas (faltou: ' + falta.join(', ') + ').'); if (!f.urina) return err('Escolha a cor da urina.');
    if (f.dor !== 'Normal' && !FM.segs.length) return err('Toque no corpo para mostrar onde está a dor.');
    const loc = FM.segs.map(i => segTip(SEGS[i])).join(' · ');
    const o = { id: `be_${a.id}_${FM.d}`, atletaId: a.id, data: FM.d, origem: 'app', treinaHoje: f.treinaHoje, motivo: (f.motivo || '').trim(), dor: f.dor, escalaDor: f.dor !== 'Normal' && f.escalaDor !== '' && f.escalaDor != null ? +f.escalaDor : null, localDor: f.dor !== 'Normal' ? loc : '', dorSegs: f.dor !== 'Normal' ? FM.segs.map(i => ({ regiao: SEGS[i][0], lado: SEGS[i][1], musculo: SEGS[i][2] })) : [], sono: f.sono, fadiga: f.fadiga, recuperacao: f.recuperacao, estresse: f.estresse, humor: f.humor, urina: +f.urina, hora: new Date().toTimeString().slice(0, 5) };
    await save('bemestar', o);
  } else {
    const f = FM.a; if (f.pse === '' || f.pse == null) return err('Escolha o quanto o treino foi intenso (0 a 10).'); if (!+f.duracao) return err('Informe quantos minutos durou.');
    const s = (S.micro || []).find(x => x.id === f.sid); const ses = s ? (s.tipo === 'jogo' ? 'Jogo' : s.tipo === 'recup' ? 'Recuperação' : ['forca', 'fisico', 'cond', 'veloc'].includes(s.tipo) ? 'Treino físico' : 'Treino') : (f.sessao || 'Treino');
    await save('pse', { id: `pse_${a.id}_${FM.d}_${ses.replace(/\s/g, '')}`, atletaId: a.id, data: FM.d, sessao: ses, sessaoId: f.sid || '', pse: +f.pse, duracao: +f.duracao, origem: 'app' });
  }
  FM.done = true; renderForm();
}
function bindForm(ov) {
  ov.addEventListener('click', e => {
    if (!FM) return; const seg = e.target.closest('#fmBody [data-seg]'); if (seg) { const i = +seg.dataset.seg; FM.segs = FM.segs.includes(i) ? FM.segs.filter(x => x !== i) : [...FM.segs, i]; renderForm(); return; }
    const q = e.target.closest('[data-fq]'); if (q) { FM.a[q.dataset.fq] = q.dataset.v; if (q.dataset.fq === 'dor' && q.dataset.v === 'Normal') { FM.segs = []; FM.a.escalaDor = null; } renderForm(); return; }
    const b = e.target.closest('[data-fm]'); if (!b) return; const k = b.dataset.fm;
    if (k === 'sair') { if (FM.lock && window.PV_SERVER) { location.href = '/atleta'; return; } if (!FM.kiosk || FM.done || confirm('Sair do modo atleta?')) fecharForm(); }
    if (k === 'outro') { const t = FM.tipo, c = FM.cat, ki = FM.kiosk, cs = FM.catSel; abrirForm(t, c, ki); FM.catSel = cs; renderForm(); }
    if (k === 'cat') { FM.catSel = b.dataset.v; FM.aid = ''; renderForm(); }
    if (k === 'ses') { const s = (S.micro || []).find(x => x.id === b.dataset.v); FM.a.sid = b.dataset.v; FM.a.sessao = ''; if (s && s.duracao && !FM.a.duracao) FM.a.duracao = s.duracao; if (s && s.tipo === 'jogo') { const j = (window.MIN?.S.jogos || []).find(x => x.data === FM.d && (x.relacionados || []).some(r => r.atletaId === FM.aid)); const r = j && j.relacionados.find(x => x.atletaId === FM.aid); if (r && +r.min) FM.a.duracao = +r.min; } renderForm(); }
    if (k === 'sesl') { FM.a.sid = ''; FM.a.sessao = b.dataset.v; renderForm(); }
    if (k === 'enviar') enviarForm();
  });
  ov.addEventListener('change', e => { if (!FM) return; if (e.target.dataset.fm === 'aid') { FM.aid = e.target.value; renderForm(); } });
  ov.addEventListener('input', e => { if (!FM) return; const k = e.target.dataset.fa; if (k) FM.a[k] = e.target.value; });
}
function formsCfgHTML() {
  const cats = Object.keys(GRUPOS).filter(c => S.atletas.some(a => a.categoria === c)); const c0 = UI.fmCat ?? '';
  const card = (tipo, t, d) => `<div class="panel"><div class="ph">${t}</div><div class="pb fmcfg"><p>${d}</p><label class="f"><span>Link para os atletas</span><div class="fmlink"><input readonly value="${esc(fmLink(tipo, c0))}" id="lk-${tipo}"><button class="btn sm" data-act="fm-copy" data-t="${tipo}">${IC.copy} Copiar</button></div></label><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri" data-act="fm-open" data-t="${tipo}">${IC.clip} Abrir no modo atleta (tablet / celular)</button></div></div></div>`;
  return `<div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><b style="font-family:var(--fc);font-size:16px;text-transform:uppercase">Categoria do link</b><div class="seg2"><label><input type="radio" name="fmCat" value="" ${!c0 ? 'checked' : ''}>Atleta escolhe</label>${cats.map(c => `<label><input type="radio" name="fmCat" value="${c}" ${c0 === c ? 'checked' : ''}>${c}</label>`).join('')}</div></div></div>
  <div class="cfg-grid">${card('bemestar', 'Bem-estar diário (pré-treino)', 'Sono, fadiga, recuperação, estresse, humor, dor (o atleta toca no músculo no boneco) e cor da urina. As respostas entram direto em Monitoramento → Bem-estar.')}${card('pse', 'Percepção de esforço (pós-treino)', 'O atleta escolhe a sessão do dia (vem do microciclo), informa os minutos e a PSE de 0 a 10. Entra direto em Monitoramento → PSE e na carga do atleta.')}
  ${panel('Como usar', `<div class="det-row"><span>Modo atleta</span><div>No tablet ou celular do clube, abra o modo atleta: os atletas respondem um depois do outro (“Responder outro atleta”) e só veem o formulário.</div></div><div class="det-row"><span>Pelo link</span><div>Para cada atleta responder no próprio celular, compartilhe este sistema com eles (botão Compartilhar do Claude) e envie o link acima. Quem abre pelo link vê só o formulário.</div></div><div class="det-row"><span>Privacidade</span><div>Quem tem acesso ao sistema pode abrir as outras telas; para uso pelos atletas, prefira o modo atleta no aparelho do clube.</div></div>`)}</div>`;
}
dmOn('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'fm-open') abrirForm(t.dataset.t, UI.fmCat || '', true); if (t.dataset.act === 'fm-copy') { const i = $('#lk-' + t.dataset.t); try { navigator.clipboard.writeText(i.value).then(() => toast('Link copiado')); } catch (er) { i.select(); toast('Selecione e copie o link'); } } });
dmOn('change', e => { if (e.target.name === 'fmCat') { UI.fmCat = e.target.value; render(); } });
// abrir direto pelo link (#form=bemestar&cat=Sub-15)
function checarLinkForm() { const h = (location.hash || '') + '&' + (location.search || ''); const m = h.match(/form=(bemestar|pse)/); if (!m) return; const c = decodeURIComponent((h.match(/cat=([^&]+)/) || [])[1] || ''); let n = 0; const tick = () => { n++; if (S.atletas.length || n > 30) abrirForm(m[1], c, false); else setTimeout(tick, 200); }; tick(); }

/* ================= TESTES COM TENTATIVAS + IMPORTAÇÃO + MATURAÇÃO AUTOMÁTICA ================= */
const TCOLS = [['cmj', 'CMJ (cm)', 3, 'any'], ['ift', 'VIFT 30-15 (km/h)', 1, 'any'], ['v10', '10 m (s)', 3, 'any'], ['v30', '30 m (s)', 3, 'any'], ['t505', '505 (s) · pé direito e esquerdo', 4, 'any']];
const tFields = k => k === 't505' ? ['t505d_1', 't505d_2', 't505e_1', 't505e_2'] : k === 'ift' ? ['ift'] : [k + '_1', k + '_2', k + '_3'];
const tLbl = (k, i) => k === 't505' ? ['D 1', 'D 2', 'E 1', 'E 2'][i] : k === 'ift' ? 'final' : (i + 1) + 'ª';
formTestes = function (data) {
  if (!S.atletas.length) { toast('Cadastre um atleta antes.', true); return; }
  const cat = F.categoria !== 'Todas' ? F.categoria : (S.atletas[0]?.categoria || 'Sub-15');
  const ex = data ? new Map(S.testes.filter(t => t.data === data).map(t => [t.atletaId, t])) : new Map();
  openModal(mh(data ? 'Editar sessão de testes' : 'Nova sessão de testes') + `<form id="fTs2" novalidate><div class="mb">
    <div class="form" style="grid-template-columns:repeat(4,1fr)"><div class="f"><label for="ts2D">Data *</label><input id="ts2D" type="date" value="${esc(data || todayISO())}" max="${todayISO()}" ${data ? 'readonly' : ''}></div><div class="f"><label for="ts2C">Categoria</label><select id="ts2C">${opts(Object.keys(GRUPOS), cat)}</select></div><div class="f s2"><span>Testes desta sessão</span><div class="tchips">${TCOLS.map(([k, n]) => `<label><input type="checkbox" class="ts2On" value="${k}" checked>${TESTS[k].n}</label>`).join('')}</div></div></div>
    <p class="muted" style="margin:0;font-size:12.5px">CMJ: 3 saltos (média) · 10 m e 30 m: 3 sprints (média) · 505: 2 com o pé direito e 2 com o esquerdo — média de cada lado e vale o <b>melhor lado</b> · 30-15 IFT: velocidade final. Use vírgula ou ponto; os cálculos aparecem na hora.</p>
    <div class="tbl-wrap" style="max-height:470px;overflow:auto;border:1px solid var(--line);border-radius:8px"><table class="t hidin tsin"><thead><tr><th class="l" rowspan="2">Atleta</th>${TCOLS.map(([k, n, q]) => `<th colspan="${q + (q > 1 ? 1 : 0)}" data-k="${k}">${n}</th>`).join('')}</tr><tr>${TCOLS.map(([k, , q]) => tFields(k).map((f, i) => `<th data-k="${k}"><small>${tLbl(k, i)}</small></th>`).join('') + (q > 1 ? `<th data-k="${k}" class="tsm"><small>média</small></th>` : '')).join('')}</tr></thead><tbody id="ts2Rows"></tbody></table></div>
  </div><div class="mf"><span class="msg" id="ts2Err"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar sessão</button></div></form>`, true);
  const fill = () => { const as = S.atletas.filter(a => a.categoria === $('#ts2C').value || ex.has(a.id)).sort((a, b) => POS.indexOf(a.posicao) - POS.indexOf(b.posicao) || a.nome.localeCompare(b.nome)); $('#ts2Rows').innerHTML = as.map(a => { const t = ex.get(a.id) || {}; const leg = { t505d_1: t.t505d_1 ?? t.t505d ?? '', t505e_1: t.t505e_1 ?? t.t505e ?? '', cmj_1: t.cmj_1 ?? (t.cmj && !t.cmj_1 ? t.cmj : ''), v10_1: t.v10_1 ?? (t.v10 && !t.v10_1 ? t.v10 : ''), v30_1: t.v30_1 ?? (t.v30 && !t.v30_1 ? t.v30 : '') };
      return `<tr data-a="${a.id}"><td class="l">${athCell(a)}</td>${TCOLS.map(([k, , q, st]) => tFields(k).map(f => `<td data-k="${k}"><input type="text" data-f="${f}" inputmode="decimal" autocomplete="off" value="${esc(t[f] ?? leg[f] ?? '')}" aria-label="${f} de ${esc(a.nome)}"></td>`).join('') + (q > 1 ? `<td data-k="${k}" class="tsm" data-m="${k}">—</td>` : '')).join('')}</tr>`; }).join(''); calc(); vis(); };
  const calc = () => $$('#ts2Rows tr').forEach(tr => TCOLS.forEach(([k, , q]) => { if (q < 2) return; const g = f => tr.querySelector(`[data-f="${f}"]`).value; let html; if (k === 't505') { const d = avgT([g('t505d_1'), g('t505d_2')]), e = avgT([g('t505e_1'), g('t505e_2')]); const best = [d, e].filter(x => x != null); html = best.length ? `<small>D ${d != null ? nf(d, 2) : '—'} · E ${e != null ? nf(e, 2) : '—'}</small><br><b>${nf(Math.min(...best), 2)}</b>` : '—'; } else { const v = avgT(tFields(k).map(g)); html = v != null ? `<b>${nf(v, TESTS[k].d)}</b>` : '—'; } tr.querySelector(`[data-m="${k}"]`).innerHTML = html; }));
  const vis = () => { const on = new Set($$('.ts2On').filter(c => c.checked).map(c => c.value)); $$('#fTs2 [data-k]').forEach(el => el.style.display = on.has(el.dataset.k) ? '' : 'none'); };
  $('#ts2C').onchange = fill; $$('.ts2On').forEach(c => c.onchange = vis); $('#fTs2').addEventListener('input', calc); fill();
  $('#fTs2').onsubmit = async e => {
    e.preventDefault(); const d = $('#ts2D').value; if (!d) return $('#ts2Err').textContent = 'Informe a data.';
    const docs = $$('#ts2Rows tr').map(tr => { const old = ex.get(tr.dataset.a) || {}; const o = { ...old, atletaId: tr.dataset.a, data: d }; let tem = false; tr.querySelectorAll('[data-f]').forEach(i => { if (i.closest('td').style.display === 'none') return; const f = i.dataset.f; const nv = numBR(i.value); if (i.value !== '' && !isNaN(nv)) { o[f] = nv; tem = true; } else delete o[f]; }); ['cmj', 'v10', 'v30'].forEach(k => { const m = avgT(tFields(k).map(f => o[f])); if (m != null) o[k] = Math.round(m * 100) / 100; }); return tem ? { ...o, id: old.id || `t_${tr.dataset.a}_${d}` } : null; }).filter(Boolean);
    if (!docs.length) return $('#ts2Err').textContent = 'Preencha o resultado de pelo menos um atleta.';
    await saveMany('testes', docs); UI.avSel = d; closeModal(); render(); toast(`${docs.length} resultado(s) salvo(s)`);
  };
};
// maturação: estatura e peso vêm sozinhos do cadastro / avaliação corporal; só falta a altura sentado
function baseCorpo(a, d) { const mt = matDe(a.id).filter(m => m.data <= d).slice(-1)[0], av = avsDe(a.id).filter(v => v.data <= d).slice(-1)[0]; const H = av?.altura ? Math.round(av.altura * 1000) / 10 : mt?.altura || (a.altura ? Math.round(+a.altura * 1000) / 10 : ''); const W = av?.peso || mt?.peso || a.peso || ''; return { H, W, fonte: av ? 'avaliação corporal de ' + fmtDs(av.data) : mt ? 'medição anterior' : a.altura ? 'cadastro do atleta' : '', pai: mt?.alturaPai || '', mae: mt?.alturaMae || '', sh: '' }; }
formMat = function () {
  if (!S.atletas.length) { toast('Cadastre um atleta antes.', true); return; }
  const cat = F.categoria !== 'Todas' ? F.categoria : (S.atletas[0]?.categoria || 'Sub-15');
  openModal(mh('Nova medição maturacional') + `<form id="fMt2" novalidate><div class="mb">
    <div class="form" style="grid-template-columns:repeat(4,1fr)"><div class="f"><label for="mt2D">Data *</label><input id="mt2D" type="date" value="${todayISO()}" max="${todayISO()}"></div><div class="f"><label for="mt2C">Categoria</label><select id="mt2C">${opts(Object.keys(GRUPOS), cat)}</select></div><div class="f s2"><span class="hint">Estatura e peso já vêm da avaliação corporal (nutrição) ou do cadastro. Você só precisa informar a <b>altura sentado</b>. Perna, offset (desvio do PHV), idade do pico e situação são calculados na hora.</span></div></div>
    <div class="tbl-wrap" style="max-height:470px;overflow:auto;border:1px solid var(--line);border-radius:8px"><table class="t hidin mtin"><thead><tr><th class="l">Atleta</th><th>Idade</th><th>Estatura (cm)</th><th>Peso (kg)</th><th class="hl2">Altura sentado (cm)</th><th>Tronco</th><th>Perna</th><th>Pai</th><th>Mãe</th><th>Offset</th><th>Idade PHV</th><th>Situação</th></tr></thead><tbody id="mt2Rows"></tbody></table></div>
  </div><div class="mf"><span class="msg" id="mt2Err"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar medições</button></div></form>`, true);
  const fill = () => { const d = $('#mt2D').value; const as = S.atletas.filter(a => a.categoria === $('#mt2C').value).sort((a, b) => a.nome.localeCompare(b.nome)); $('#mt2Rows').innerHTML = as.map(a => { const b = baseCorpo(a, d); return `<tr data-a="${a.id}"><td class="l">${athCell(a)}${b.fonte ? `<small class="muted" style="display:block;font-size:10.5px">dados de ${b.fonte}</small>` : ''}</td><td class="ida">${nf(idadeDec(a.nascimento, d) || 0, 1)}</td><td><input type="text" inputmode="decimal" data-f="altura" value="${b.H}"></td><td><input type="text" inputmode="decimal" data-f="peso" value="${b.W}"></td><td class="hl2"><input type="text" inputmode="decimal" data-f="alturaSentado" placeholder="cm"></td><td class="tr">—</td><td class="pn">—</td><td><input type="text" inputmode="decimal" data-f="alturaPai" value="${b.pai}" style="width:62px"></td><td><input type="text" inputmode="decimal" data-f="alturaMae" value="${b.mae}" style="width:62px"></td><td class="mo">—</td><td class="ap">—</td><td class="st2">—</td></tr>`; }).join(''); calc(); };
  const calc = () => $$('#mt2Rows tr').forEach(tr => { const g = f => numBR(tr.querySelector(`[data-f=${f}]`).value) || 0; const H = g('altura'), SH = g('alturaSentado'); tr.querySelector('.tr').textContent = SH ? nf(SH, 1) : '—'; tr.querySelector('.pn').textContent = H && SH ? nf(H - SH, 1) : '—'; const c = calcMat({ atletaId: tr.dataset.a, data: $('#mt2D').value, altura: H, alturaSentado: SH, peso: g('peso'), alturaPai: g('alturaPai'), alturaMae: g('alturaMae') }); tr.querySelector('.mo').innerHTML = c && c.mo != null ? `<b>${c.mo >= 0 ? '+' : ''}${nf(c.mo, 2)}</b>` : '—'; tr.querySelector('.ap').textContent = c && c.aphv ? nf(c.aphv, 1) : '—'; tr.querySelector('.st2').innerHTML = c && c.st ? mstChip(c.st) : '—'; });
  $('#mt2C').onchange = fill; $('#mt2D').onchange = fill; $('#fMt2').addEventListener('input', calc); fill();
  $('#fMt2').onsubmit = async e => {
    e.preventDefault(); const d = $('#mt2D').value;
    const docs = $$('#mt2Rows tr').map(tr => { const g = f => tr.querySelector(`[data-f=${f}]`).value, n = f => { const v = numBR(g(f)); return isNaN(v) ? null : v; }; if (!n('altura') || !n('alturaSentado')) return null; return { id: `m_${tr.dataset.a}_${d}`, atletaId: tr.dataset.a, data: d, altura: n('altura'), alturaSentado: n('alturaSentado'), peso: n('peso'), alturaPai: n('alturaPai'), alturaMae: n('alturaMae') }; }).filter(Boolean);
    if (!docs.length) return $('#mt2Err').textContent = 'Informe a altura sentado de pelo menos um atleta.';
    await saveMany('maturacao', docs); closeModal(); render(); toast(`${docs.length} medição(ões) salva(s)`);
  };
};


/* ---------- importar planilhas de testes e de maturação ---------- */
const nh = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const TMAP = { atleta: ['atleta', 'nome', 'jogador'], data: ['data', 'dia', 'datadoteste'], cmj_1: ['cmj1', 'cmj01', 'salto1', 'cmjtentativa1'], cmj_2: ['cmj2', 'cmj02', 'salto2', 'cmjtentativa2'], cmj_3: ['cmj3', 'cmj03', 'salto3', 'cmjtentativa3'], cmj: ['cmj', 'cmjcm', 'cmjmedia'], ift: ['ift', 'vift', '3015', '3015ift', 'vifkmh', 'viftkmh', '3015vift'], v10_1: ['10m1', 'v101', 'velocidade10m1', '10metros1', 'sprint10m1'], v10_2: ['10m2', 'v102', 'velocidade10m2', '10metros2', 'sprint10m2'], v10_3: ['10m3', 'v103', 'velocidade10m3', '10metros3', 'sprint10m3'], v10: ['10m', 'v10', 'velocidade10m', '10ms'], v30_1: ['30m1', 'v301', 'velocidade30m1', '30metros1', 'sprint30m1'], v30_2: ['30m2', 'v302', 'velocidade30m2', '30metros2', 'sprint30m2'], v30_3: ['30m3', 'v303', 'velocidade30m3', '30metros3', 'sprint30m3'], v30: ['30m', 'v30', 'velocidade30m', '30ms'], t505d_1: ['505d1', '505direito1', '505dir1', '505pedireito1', 't505d1'], t505d_2: ['505d2', '505direito2', '505dir2', '505pedireito2', 't505d2'], t505e_1: ['505e1', '505esquerdo1', '505esq1', '505peesquerdo1', 't505e1'], t505e_2: ['505e2', '505esquerdo2', '505esq2', '505peesquerdo2', 't505e2'], t505d: ['505d', '505direito', '505dir', '505pedireito', 't505d'], t505e: ['505e', '505esquerdo', '505esq', '505peesquerdo', 't505e'] };
const MMAP = { atleta: ['atleta', 'nome', 'jogador'], data: ['data', 'dia'], altura: ['estatura', 'altura', 'estaturacm', 'alturacm'], alturaSentado: ['alturasentado', 'alturasentadocm', 'sentado', 'tronco'], peso: ['peso', 'pesokg', 'massa'], alturaPai: ['alturapai', 'pai'], alturaMae: ['alturamae', 'mae'] };
async function importarAval(file, tipo) {
  try { await loadLib('xlsx'); } catch (e) { toast('Não foi possível carregar o leitor de planilhas.', true); return; }
  let rows; try { const wb = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true }); rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '', raw: true }); } catch (e) { toast('Não consegui ler o arquivo.', true); return; }
  const MAP = tipo === 'testes' ? TMAP : MMAP; let hi = 0, best = -1, idx = {};
  for (let r = 0; r < Math.min(8, rows.length); r++) { const h = rows[r].map(nh), m = {}; Object.entries(MAP).forEach(([k, al]) => { const i = h.findIndex(x => al.includes(x)); if (i >= 0) m[k] = i; }); if (Object.keys(m).length > best) { best = Object.keys(m).length; hi = r; idx = m; } }
  if (idx.atleta == null || idx.data == null) { toast('A planilha precisa das colunas “Atleta” e “Data”. Baixe o modelo para ver o formato.', true); return; }
  const docs = [], sem = new Set(); const num = v => { const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : n; };
  rows.slice(hi + 1).forEach(r => { const nome = String(r[idx.atleta] ?? '').trim(), d = parseDate(r[idx.data]); if (!nome || !d) return; const a = findAtleta(nome); if (!a) { sem.add(nome); return; }
    if (tipo === 'testes') { const old = S.testes.find(t => t.atletaId === a.id && t.data === d) || {}; const o = { ...old, id: old.id || `t_${a.id}_${d}`, atletaId: a.id, data: d }; let tem = false; Object.keys(TMAP).forEach(k => { if (k === 'atleta' || k === 'data' || idx[k] == null) return; const v = num(r[idx[k]]); if (v != null && v > 0) { o[k] = v; tem = true; } }); ['cmj', 'v10', 'v30'].forEach(k => { const m = avgT(tFields(k).map(f => o[f])); if (m != null) o[k] = Math.round(m * 100) / 100; }); if (tem) docs.push(o); }
    else { const o = { id: `m_${a.id}_${d}`, atletaId: a.id, data: d }; Object.keys(MMAP).forEach(k => { if (k === 'atleta' || k === 'data' || idx[k] == null) return; const v = num(r[idx[k]]); if (v != null) o[k] = v; }); if (o.altura && o.altura < 3) o.altura = Math.round(o.altura * 1000) / 10; if (!o.altura) { const b = baseCorpo(a, d); if (b.H) o.altura = b.H; if (!o.peso && b.W) o.peso = +b.W; } if (o.altura && o.alturaSentado) docs.push(o); } });
  const cols = Object.keys(idx).filter(k => k !== 'atleta' && k !== 'data');
  openModal(mh(tipo === 'testes' ? 'Importar testes físicos' : 'Importar medições de maturação') + `<div class="mb"><div class="counters"><span><b>${docs.length}</b> registro(s) prontos</span><span><b>${[...new Set(docs.map(x => x.data))].length}</b> data(s)</span><span style="${sem.size ? 'color:var(--red);border-color:var(--red)' : ''}"><b>${sem.size}</b> nome(s) sem atleta</span></div><div class="mapline"><span class="muted">Colunas reconhecidas:</span> ${cols.map(c => `<span class="mapc">${c.replace('t505d_', '505 D').replace('t505e_', '505 E').replace('_', ' tentativa ').replace('t505d', '505 D').replace('t505e', '505 E')}</span>`).join('') || '—'}</div>${sem.size ? `<div class="warn" style="margin:0">Não encontrei no cadastro: <b>${[...sem].map(esc).join(', ')}</b>. Esses serão ignorados.</div>` : ''}<p class="muted" style="margin:0;font-size:12.5px">${tipo === 'testes' ? 'As médias (CMJ, 10 m, 30 m e 505) são calculadas automaticamente. Registros do mesmo atleta e data são atualizados.' : 'Sem estatura na planilha, o sistema usa a da avaliação corporal ou do cadastro. É obrigatório ter a altura sentado.'}</p></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn pri" id="impAvOk" ${docs.length ? '' : 'disabled'}>${IC.check} Importar ${docs.length}</button></div>`);
  $('#impAvOk').onclick = async () => { closeModal(); await saveMany(tipo === 'testes' ? 'testes' : 'maturacao', docs); render(); toast(`${docs.length} registro(s) importado(s)`); };
}
async function modeloAval(tipo) {
  const L = tipo === 'testes' ? [['Atleta', 'Data', 'CMJ 1', 'CMJ 2', 'CMJ 3', 'VIFT', '10m 1', '10m 2', '10m 3', '30m 1', '30m 2', '30m 3', '505 D1', '505 D2', '505 E1', '505 E2'], ['João da Silva', '14/09/2026', '33,5', '34,1', '32,8', '18,5', '1,82', '1,80', '1,84', '4,45', '4,41', '4,48', '2,38', '2,41', '2,44', '2,42']] : [['Atleta', 'Data', 'Estatura', 'Altura sentado', 'Peso', 'Altura pai', 'Altura mãe'], ['João da Silva', '14/09/2026', '172,5', '88,0', '61,2', '178', '164']];
  const csv = '\ufeff' + L.map(r => r.join(';')).join('\r\n');
  try { const dl = window.claude && await window.claude.use('downloads'); if (!dl) { toast('Download indisponível nesta visualização.', true); return; } await dl.save({ filename: `modelo-${tipo}.csv`, data: csv }); } catch (e) { }
}
const _fAvReg2 = fAvReg;
fAvReg = function () { return `<div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><b style="font-family:var(--fc);font-size:16px;text-transform:uppercase">Planilha</b><label class="btn" style="cursor:pointer">${IC.upload} Importar testes (Excel/CSV)<input type="file" accept=".xlsx,.xls,.csv" id="impTst" hidden></label><button class="btn sm" data-act="mdl-av" data-t="testes">${IC.down} Modelo de testes</button><span class="muted" style="font-size:12.5px">Colunas: Atleta, Data, CMJ 1–3, VIFT, 10m 1–3, 30m 1–3, 505 D1, D2, E1, E2</span></div></div>` + _fAvReg2(); };
const _fMatDashI = fMatDash;
fMatDash = function () { return `<div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="btn pri" data-act="mat-nova">${IC.plus} Nova medição (só altura sentado)</button><label class="btn" style="cursor:pointer">${IC.upload} Importar planilha<input type="file" accept=".xlsx,.xls,.csv" id="impMat" hidden></label><button class="btn sm" data-act="mdl-av" data-t="maturacao">${IC.down} Modelo</button><span class="muted" style="font-size:12.5px">Estatura e peso entram automaticamente da avaliação corporal.</span></div></div>` + _fMatDashI(); };
dmOn('change', e => { if (e.target.id === 'impTst' && e.target.files[0]) { importarAval(e.target.files[0], 'testes'); e.target.value = ''; } if (e.target.id === 'impMat' && e.target.files[0]) { importarAval(e.target.files[0], 'maturacao'); e.target.value = ''; } });
dmOn('click', e => { const t = e.target.closest('[data-act="mdl-av"]'); if (t) modeloAval(t.dataset.t); });

/* ================= PSE · COMPARATIVO POR ATLETA + O QUE FAZER ================= */
UI.cmpM = 'mono';
function minJogo(aid, ini, fim) { return (window.MIN?.S.jogos || []).filter(j => j.data >= ini && j.data <= fim).reduce((s, j) => { const r = (j.relacionados || []).find(x => x.atletaId === aid); return s + (r ? +r.min || 0 : 0); }, 0); }
function metricasAtl(a, ini, fim) {
  const l = pseDe(a.id).filter(r => r.data >= ini && r.data <= fim), dias = []; for (let d = ini; d <= fim; d = addDays(d, 1)) dias.push(d);
  const auD = dias.map(d => l.filter(r => r.data === d).reduce((s, r) => s + carga(r), 0)), ua = auD.reduce((x, y) => x + y, 0), du = l.reduce((s, r) => s + (+r.duracao || 0), 0);
  const rk = riscoAtl(a, fim), mo = rk.mo;
  const mt = l.filter(r => r.sessao !== 'Jogo').reduce((s, r) => s + (+r.duracao || 0), 0), mjP = l.filter(r => r.sessao === 'Jogo').reduce((s, r) => s + (+r.duracao || 0), 0), mjM = minJogo(a.id, ini, fim);
  return { ua, pse: du ? ua / du : null, mono: mo, strain: rk.strain, acwr: rk.c.acwr, mt, mj: Math.max(mjP, mjM), ses: l.length, rk };
}
const CMPM = {
  ua: ['UA (carga)', v => Math.round(v), (v, ref) => ref && v > ref * 1.2 ? '#e0342b' : ref && v < ref * 0.7 ? '#2f6fd6' : '#1b8a4a'],
  pse: ['PSE média', v => nf(v, 1), v => v >= 8 ? '#e0342b' : v >= 6 ? '#f39324' : v >= 4 ? '#f6c21c' : '#1b8a4a'],
  mono: ['Monotonia', v => nf(v, 2), v => v > 2 ? '#e0342b' : v > 1.5 ? '#f39324' : '#1b8a4a'],
  strain: ['Strain', v => Math.round(v), (v, ref) => ref && v > ref * 1.4 ? '#e0342b' : '#1b8a4a'],
  acwr: ['ACWR', v => nf(v, 2), v => v > 1.5 ? '#e0342b' : v > 1.3 ? '#f39324' : v < 0.8 ? '#2f6fd6' : '#1b8a4a'],
  mt: ['Minutos de treino', v => Math.round(v), () => '#1b8a4a'], mj: ['Minutos de jogo', v => Math.round(v), () => '#f2b81b']
};
function comparativoAtletas(ini, fim, titulo, plano) {
  const L = atletasCat().map(a => ({ a, m: metricasAtl(a, ini, fim) })).filter(x => x.m.ses || x.m.mj), k = UI.cmpM;
  const vals = L.map(x => ({ ...x, v: x.m[k] })).filter(x => x.v != null && !isNaN(x.v)).sort((p, q) => q.v - p.v);
  const med = vals.length ? median(vals.map(x => x.v)) : null; const ref = k === 'ua' ? plano : k === 'strain' ? med : null;
  const W = 1200, H = 300, L0 = 46, R0 = 16, T0 = 18, B0 = 70, n = Math.max(1, vals.length), bw = (W - L0 - R0) / n;
  const lines = { mono: [[1.5, 'atenção 1,5', '#f39324'], [2, 'alta 2,0', '#e0342b']], acwr: [[0.8, '0,8', '#2f6fd6'], [1.3, '1,3', '#f39324'], [1.5, '1,5', '#e0342b']], ua: plano ? [[plano, 'planejado', '#14201a']] : [], strain: med ? [[med * 1.4, '140% da mediana', '#e0342b']] : [] }[k] || [];
  const mx = Math.max(...vals.map(x => x.v), ...lines.map(l => l[0]), k === 'mono' ? 2.5 : k === 'acwr' ? 2 : k === 'pse' ? 10 : 1) * 1.1, Y = v => T0 + (H - T0 - B0) * (1 - v / mx);
  let g = ''; for (let i = 0; i <= 4; i++) { const v = mx / 4 * i; g += `<line x1="${L0}" x2="${W - R0}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${L0 - 6}" y="${Y(v) + 4}" text-anchor="end" font-size="10.5" fill="var(--ink2)">${k === 'mono' || k === 'acwr' ? nf(v, 1) : Math.round(v)}</text>`; }
  vals.forEach((x, i) => { const cx = L0 + i * bw + bw / 2, w = Math.min(34, bw * 0.7), c = CMPM[k][2](x.v, ref); g += `<rect class="ibar" x="${cx - w / 2}" y="${Y(x.v)}" width="${w}" height="${Y(0) - Y(x.v)}" rx="3" fill="${c}" data-tip="${esc(x.a.apelido || x.a.nome)} · ${CMPM[k][0]}: ${CMPM[k][1](x.v)}\nUA ${Math.round(x.m.ua)} · PSE ${x.m.pse != null ? nf(x.m.pse, 1) : '—'} · monotonia ${x.m.mono != null ? nf(x.m.mono, 2) : '—'}\nTreino ${Math.round(x.m.mt)} min · jogo ${Math.round(x.m.mj)} min" data-ficha-carga="${x.a.id}"/><text x="${cx}" y="${Y(x.v) - 4}" text-anchor="middle" font-size="10" font-weight="800" fill="var(--ink)">${CMPM[k][1](x.v)}</text><text transform="translate(${cx + 3} ${H - B0 + 10}) rotate(55)" font-size="10.5" fill="var(--ink2)">${esc((x.a.apelido || x.a.nome).split(' ').slice(0, 2).join(' '))}</text>`; });
  lines.forEach(([v, l, c]) => { g += `<line x1="${L0}" x2="${W - R0}" y1="${Y(v)}" y2="${Y(v)}" stroke="${c}" stroke-width="1.6" stroke-dasharray="6 4"/><text x="${W - R0 - 4}" y="${Y(v) - 4}" text-anchor="end" font-size="10.5" font-weight="700" fill="${c}">${l}</text>`; });
  const chips = `<div class="hchips">${Object.entries(CMPM).map(([kk, v]) => `<button class="${k === kk ? 'on' : ''}" data-act="cmp-m" data-v="${kk}">${v[0]}</button>`).join('')}</div>`;
  return panel(titulo, chips + (vals.length ? `<svg class="chart ich" viewBox="0 0 ${W} ${H}">${g}</svg><p class="muted" style="font-size:11.5px;margin:4px 0 0;text-align:center">Cada coluna é um atleta (maior → menor). Passe o mouse para ver UA, PSE, monotonia e minutos de treino e jogo; clique para abrir a carga do atleta.</p>` : miniEmpty('Sem dados no período', 'Lance a PSE ou carregue os dados de teste.')));
}
// recomendações práticas para a comissão
function recomendar(a, rk, pr) {
  const r = [], v = rk.c.acwr;
  if (v != null && v > 1.5) r.push(['bad', 'Reduzir o volume 20–30% nos próximos 3–4 dias e evitar sprints máximos']);
  else if (v != null && v > 1.3) r.push(['warn', 'Segurar a progressão: manter a carga da semana, sem novos picos']);
  else if (v != null && v < 0.8 && rk.c.n28 >= 3) r.push(['low', 'Progredir a carga aos poucos (até +10% por semana) e incluir estímulos de alta velocidade']);
  if (rk.mo != null && rk.mo > 2) r.push(['warn', 'Variar a intensidade: inserir um dia leve ou de folga na semana']);
  else if (rk.mo != null && rk.mo > 1.5) r.push(['warn', 'Atenção à monotonia: alternar dias fortes e leves']);
  if (rk.bst === 'INTERVENÇÃO') r.push(['bad', 'Avaliação individual antes do treino (bem-estar em intervenção)']); else if (rk.bst === 'ATENÇÃO') r.push(['warn', 'Acompanhar o bem-estar e ajustar o volume se necessário']);
  if (diasSeguidos(a.id, todayISO()) >= 5) r.push(['warn', 'Programar folga ou sessão regenerativa (5+ dias seguidos)']);
  if (pr && pr.p < 60) r.push(['bad', 'Conversar antes do treino; considerar sessão regenerativa ou individual']);
  if (pr && temDor(pr.r)) r.push(['bad', 'Encaminhar ao DM antes da atividade' + (pr.r.localDor ? ` (${pr.r.localDor})` : '')]);
  if (!r.length) r.push(['ok', 'Manter o planejamento']);
  return r;
}
tabelaCarga = function (rows, d) {
  const grp = POS.map(p => [p, rows.filter(x => x.a.posicao === p)]).filter(g => g[1].length);
  return panel('Tabela de carga do elenco · o que fazer com cada atleta', `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Jogador</th><th>PSE hoje</th><th>UA hoje</th><th>UA 7 dias</th><th>Últimos 7 dias</th><th>ACWR</th><th>Monotonia</th><th>Strain</th><th>Prontidão</th><th>Status</th><th class="l" style="min-width:260px">O que fazer</th></tr></thead><tbody>${grp.map(([p, l]) => `<tr class="grph"><td colspan="11" class="l"><span class="sq" style="background:${PC1[p]}"></span><b>${POSN[p]}s</b> <span class="muted">${l.length}</span></td></tr>` + l.map(x => { const pr = prontidao(x.a.id, d), rc = recomendar(x.a, x.rk, pr); return `<tr class="click" data-ficha-carga="${x.a.id}"><td class="l"><div class="athcell">${fotoBox(x.a, 'mini')}<div><b>${esc(x.a.apelido || x.a.nome)}${subTag(x.a)}</b><small>${esc(x.a.posicao)}</small></div></div></td><td>${x.pse != null ? `<span class="pill2 y">${nf(x.pse, 1)}</span>` : '—'}</td><td>${x.au ? `<span class="pill2 c">${Math.round(x.au)} UA</span>` : '—'}</td><td><b>${Math.round(x.rk.c.ag)}</b></td><td>${spark(x.rk.l7)}</td><td><b class="${x.rk.c.acwr > 1.5 ? 'up' : ''}">${x.rk.c.acwr != null ? nf(x.rk.c.acwr, 2) : '—'}</b></td><td>${x.rk.mo != null ? `<b class="${x.rk.mo > 2 ? 'up' : ''}">${nf(x.rk.mo, 2)}</b>` : '—'}</td><td>${x.rk.strain != null ? Math.round(x.rk.strain) : '—'}</td><td>${pr ? `<span class="sfc ${pr.st[1]}">${pr.p}%</span>` : '<span class="muted">—</span>'}</td><td><span class="sfc ${x.rk.st[1]}" data-tip="${esc(x.rk.mot.join(' · ') || 'Carga dentro do esperado')}">${x.rk.st[0]}</span></td><td class="l rec">${rc.slice(0, 2).map(([c, t]) => `<span class="rcm r-${c}">${esc(t)}</span>`).join('')}</td></tr>`; }).join('')).join('')}</tbody></table></div><p class="muted pb" style="font-size:12px;margin:0">Recomendações automáticas a partir de ACWR, monotonia, dias seguidos, prontidão e dor. Servem de apoio à comissão; não substituem a avaliação do DM.</p>`, { np: true });
};
const _fPse3 = fPse;
fPse = function () { const d = UI.pseDia, h = _fPse3(); const W0 = semana(catMon(), segunda(d)); const add = comparativoAtletas(d, d, `Comparativo dos atletas · ${fmtD(d)}`, progDia(catMon(), d).au) + '<div style="height:14px"></div>'; const i = h.search(/<div class="panel"\s*><div class="ph">Tabela de carga do elenco/); return i < 0 ? h + add : h.slice(0, i) + add + h.slice(i); };
const _fPseSem3 = fPseSem;
fPseSem = function () { if (!UI.week) UI.week = segunda(todayISO()); const ini = UI.week, fim = addDays(ini, 6) < todayISO() ? addDays(ini, 6) : todayISO(); const h = _fPseSem3(); const add = comparativoAtletas(ini, fim, `Comparativo dos atletas na semana · ${fmtDs(ini)} a ${fmtDs(addDays(ini, 6))}`, semana(catMon(), ini).auP) + '<div style="height:14px"></div>' + tabelaCarga(atletasCat().map(a => { const rk = riscoAtl(a, fim); return { a, rk, au: 0, pse: null }; }), fim) + '<div style="height:14px"></div>'; const i = h.search(/<div class="panel"\s*><div class="ph">Carga diária por atleta/); return i < 0 ? h + add : h.slice(0, i) + add + h.slice(i); };
dmOn('click', e => { const t = e.target.closest('[data-act="cmp-m"]'); if (t) { UI.cmpM = t.dataset.v; render(); } });

/* ================= MINUTAGEM · CONTROLE DE CARGA ================= */
TITLES.minc = ['Minutagem', 'Controle de carga'];
UI.mcComp = 'Todas';
function analiseMin() {
  const jsAll = jogosCat().filter(j => j.data).sort((a, b) => String(a.data).localeCompare(String(b.data)));
  const comps = ['Todas', ...new Set(jsAll.map(j => j.competicao).filter(Boolean))];
  const js = jsAll.filter(j => UI.mcComp === 'Todas' || j.competicao === UI.mcComp);
  const semMin = js.filter(j => !(j.relacionados || []).length || (j.relacionados || []).reduce((s, r) => s + (+r.min || 0), 0) === 0);
  const ok = js.filter(j => !semMin.includes(j));
  const ats = atletasCat(), hoje = todayISO();
  const L = ats.map(a => {
    const lista = ok.map(j => { const r = (j.relacionados || []).find(x => x.atletaId === a.id); const dur = +j.duracao || 90; return { j, r, m: r ? +r.min || 0 : null, dur }; });
    const rel = lista.filter(x => x.r), jogou = rel.filter(x => x.m > 0), min = jogou.reduce((s, x) => s + x.m, 0), poss = lista.reduce((s, x) => s + x.dur, 0);
    const ult5 = lista.slice(-5), pct5 = ult5.length ? ult5.reduce((s, x) => s + (x.m || 0), 0) / ult5.reduce((s, x) => s + x.dur, 0) * 100 : null;
    const ultimo = jogou.length ? jogou[jogou.length - 1].j.data : null;
    let seq = 0; for (let i = lista.length - 1; i >= 0; i--) { if (lista[i].m >= 60) seq++; else break; }
    const curtos = []; for (let i = 1; i < jogou.length; i++) { const dd = dayDiff(jogou[i - 1].j.data, jogou[i].j.data); if (dd <= 3 && jogou[i].m >= 60 && jogou[i - 1].m >= 60) curtos.push([jogou[i - 1].j.data, jogou[i].j.data]); }
    const recCurto = curtos.filter(c => dayDiff(c[1], hoje) <= 21);
    let semJogar = 0; for (let i = lista.length - 1; i >= 0; i--) { if (!(lista[i].m > 0)) semJogar++; else break; }
    const m14 = jogou.filter(x => dayDiff(x.j.data, hoje) <= 14).reduce((s, x) => s + x.m, 0);
    const al = [];
    if (seq >= 3 && ultimo && dayDiff(ultimo, hoje) <= 14) al.push(['bad', `${seq} jogos seguidos com 60+ minutos`]); else if (seq >= 3) al.push(['warn', `${seq} jogos seguidos com 60+ min (último há ${dayDiff(ultimo, hoje)} dias)`]);
    if (recCurto.length) al.push(['bad', `${recCurto.length}× dois jogos em até 72 h com 60+ min (último ${fmtDs(recCurto[recCurto.length - 1][1])})`]);
    if (pct5 != null && pct5 >= 85 && ult5.length >= 3) al.push(['warn', `${Math.round(pct5)}% dos minutos possíveis nos últimos ${ult5.length} jogos`]);
    if (m14 >= 300) al.push(['warn', `${m14} minutos nos últimos 14 dias`]);
    if (!jogou.length && lista.length) al.push(['low', 'Nenhum minuto na seleção']);
    else if (semJogar >= 3) al.push(['low', `${semJogar} jogos seguidos sem entrar em campo`]);
    if (ultimo && dayDiff(ultimo, hoje) >= 21 && lista.length) al.push(['low', `${dayDiff(ultimo, hoje)} dias sem jogar`]);
    const st = al.some(x => x[0] === 'bad') ? ['ALTA', 'bad'] : al.some(x => x[0] === 'warn') ? ['ELEVADA', 'warn'] : al.some(x => x[0] === 'low') ? ['BAIXA', 'low'] : jogou.length ? ['NORMAL', 'ok'] : ['SEM DADOS', 'neu'];
    const rec = st[1] === 'bad' ? 'Poupar ou reduzir minutos no próximo jogo; priorizar recuperação (MD+1/MD+2)' : st[1] === 'warn' ? 'Monitorar: alternar minutagem e acompanhar PSE e bem-estar' : st[1] === 'low' ? 'Dar minutos (jogo ou coletivo) ou compensar com treino de alta intensidade' : st[1] === 'ok' ? 'Manter' : '—';
    return { a, rel: rel.length, jogou: jogou.length, tit: rel.filter(x => x.r.status === 'T').length, min, poss, pct: poss ? min / poss * 100 : 0, ult5, seq, semJogar, ultimo, m14, al, st, rec, lista };
  });
  return { js, ok, semMin, L, comps };
}
function vMinc() {
  const { js, ok, semMin, L, comps } = analiseMin();
  const usados = L.filter(x => x.jogou), med = usados.length ? mean(usados.map(x => x.min)) : null;
  const G = [['ALTA', 'bad', 'Carga de jogo alta'], ['ELEVADA', 'warn', 'Atenção'], ['BAIXA', 'low', 'Pouca utilização'], ['SEM DADOS', 'neu', 'Sem minutos']];
  const chart = (() => { const v = [...L].filter(x => x.lista.length).sort((p, q) => q.min - p.min); if (!v.length) return miniEmpty('Sem jogos minutados'); const W = 1200, H = 300, L0 = 46, R0 = 16, T0 = 16, B0 = 70, bw = (W - L0 - R0) / v.length, mx = Math.max(90, ...v.map(x => x.min)) * 1.1, Y = n => T0 + (H - T0 - B0) * (1 - n / mx); let g = ''; for (let i = 0; i <= 4; i++) { const n = mx / 4 * i; g += `<line x1="${L0}" x2="${W - R0}" y1="${Y(n)}" y2="${Y(n)}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${L0 - 6}" y="${Y(n) + 4}" text-anchor="end" font-size="10.5" fill="var(--ink2)">${Math.round(n)}</text>`; }
    v.forEach((x, i) => { const cx = L0 + i * bw + bw / 2, w = Math.min(32, bw * 0.7), c = { bad: '#e0342b', warn: '#f39324', low: '#2f6fd6', ok: '#1b8a4a', neu: '#9aa5a0' }[x.st[1]]; g += `<rect class="ibar" x="${cx - w / 2}" y="${Y(x.min)}" width="${w}" height="${Y(0) - Y(x.min)}" rx="3" fill="${c}" data-tip="${esc(x.a.apelido || x.a.nome)} · ${x.min} min (${Math.round(x.pct)}% do possível)\n${x.jogou} de ${x.lista.length} jogos · ${x.tit} como titular${x.al.length ? '\n' + x.al.map(l => l[1]).join('\n') : ''}" data-ficha-open="${x.a.id}"/><text x="${cx}" y="${Y(x.min) - 4}" text-anchor="middle" font-size="10" font-weight="800" fill="var(--ink)">${x.min}</text><text transform="translate(${cx + 3} ${H - B0 + 10}) rotate(55)" font-size="10.5" fill="var(--ink2)">${esc((x.a.apelido || x.a.nome).split(' ').slice(0, 2).join(' '))}</text>`; });
    if (med) g += `<line x1="${L0}" x2="${W - R0}" y1="${Y(med)}" y2="${Y(med)}" stroke="#14201a" stroke-width="1.5" stroke-dasharray="6 4"/><text x="${W - R0 - 4}" y="${Y(med) - 4}" text-anchor="end" font-size="10.5" font-weight="700" fill="var(--ink)">média ${Math.round(med)} min</text>`;
    return `<svg class="chart ich" viewBox="0 0 ${W} ${H}">${g}</svg>`; })();
  const ult = ok.slice(-8);
  return header({ title: 'CONTROLE DE CARGA DA MINUTAGEM', sub: 'MINUTAGEM · ALERTAS E SEQUÊNCIA DE JOGOS', items: hdrItems(), solo: true }) + `
  <div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><b style="font-family:var(--fc);font-size:16px;text-transform:uppercase">Competição</b><div class="hchips" style="margin:0">${comps.map(c => `<button class="${UI.mcComp === c ? 'on' : ''}" data-act="mc-comp" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div><span style="flex:1"></span><button class="btn sm" data-nav="m-jogos-lista">${IC.ball} Minutar jogos</button></div></div>
  ${semMin.length ? `<div class="abanner warn">${IC.clock}<div><b>Falta minutar ${semMin.length} jogo(s)</b><span>${semMin.slice(-6).map(j => `${fmtDs(j.data)} x ${esc(j.adversario || '?')}`).join(' · ')} · <button class="linkbtn" data-nav="m-jogos-lista">abrir cadastro de jogos</button></span></div></div>` : ''}
  <div class="kpis k5">${kpi('ball', 'Jogos minutados', `${ok.length}<small>/ ${js.length}</small>`, semMin.length ? semMin.length + ' sem minutagem' : 'todos minutados')}${kpi('users', 'Atletas utilizados', `${usados.length}<small>/ ${L.length}</small>`, 'com minutos em campo')}${kpi('clock', 'Média por atleta', nfx(med, 0, '<small>min</small>'), 'entre os utilizados')}${kpi('cross', 'Carga de jogo alta', L.filter(x => x.st[1] === 'bad').length, 'sequência / jogos próximos', 'red')}${kpi('trend', 'Pouca utilização', L.filter(x => x.st[1] === 'low' || x.st[0] === 'SEM DADOS').length, 'sem minutos ou poucos', 'blue')}</div>
  ${panel('Alertas de minutagem', `<div class="agrp">${G.map(([t, c, n]) => { const l = L.filter(x => x.st[0] === t); return `<div class="agc a-${c === 'neu' ? 'low' : c}"><div class="agh"><b>${l.length}</b><div><span>${n}</span><small>${t === 'ALTA' ? '3+ jogos seguidos com 60+ min ou 2 jogos em 72 h' : t === 'ELEVADA' ? '≥85% dos minutos nos últimos jogos ou 300+ min em 14 dias' : t === 'BAIXA' ? '3+ jogos sem entrar ou 21+ dias sem jogar' : 'sem minutos na seleção'}</small></div></div><div class="agl">${l.slice(0, 14).map(x => `<span class="agp" data-ficha-open="${x.a.id}">${esc((x.a.apelido || x.a.nome).split(' ').slice(0, 2).join(' '))}${x.al[0] ? ` <b>${esc(x.al[0][1].split(' ').slice(0, 3).join(' '))}</b>` : ''}</span>`).join('') || '<small class="muted">Ninguém</small>'}</div></div>`; }).join('')}</div>`)}
  <div style="height:14px"></div>${panel('Minutos por atleta', chart + '<div class="legend-status" style="justify-content:center"><span><span class="sq" style="background:#e0342b"></span>Carga alta</span><span><span class="sq" style="background:#f39324"></span>Atenção</span><span><span class="sq" style="background:#1b8a4a"></span>Normal</span><span><span class="sq" style="background:#2f6fd6"></span>Pouca utilização</span></div>')}
  <div style="height:14px"></div>${panel('Controle por atleta', `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Relac.</th><th>Jogou</th><th>Titular</th><th>Minutos</th><th>% possível</th><th>Últimos jogos</th><th>Seguidos 60+</th><th>Sem jogar</th><th>Min 14 dias</th><th>Último jogo</th><th>Status</th><th class="l" style="min-width:240px">Alertas e o que fazer</th></tr></thead><tbody>${L.sort((p, q) => ({ bad: 0, warn: 1, low: 2, ok: 3, neu: 4 }[p.st[1]] - { bad: 0, warn: 1, low: 2, ok: 3, neu: 4 }[q.st[1]]) || q.min - p.min).map(x => `<tr class="click" data-ficha-open="${x.a.id}"><td class="l"><div class="athcell">${fotoBox(x.a, 'mini')}<div><b>${esc(x.a.apelido || x.a.nome)}${subTag(x.a)}</b><small>${esc(x.a.posicao)}</small></div></div></td><td>${x.rel}</td><td>${x.jogou}</td><td>${x.tit}</td><td><b>${x.min}</b></td><td>${x.poss ? Math.round(x.pct) + '%' : '—'}</td><td><span class="spark">${x.ult5.map(u => `<i style="height:${Math.max(2, (u.m || 0) / u.dur * 26)}px;background:${u.m == null ? 'var(--line)' : u.m >= 60 ? '#e0342b' : u.m > 0 ? '#1b8a4a' : '#9aa5a0'}" data-tip="${fmtDs(u.j.data)} x ${esc(u.j.adversario || '')}: ${u.m == null ? 'não relacionado' : u.m + ' min'}"></i>`).join('')}</span></td><td>${x.seq >= 3 ? `<b class="up">${x.seq}</b>` : x.seq}</td><td>${x.semJogar >= 3 ? `<b style="color:var(--blue)">${x.semJogar}</b>` : x.semJogar}</td><td>${x.m14}</td><td>${x.ultimo ? fmtDs(x.ultimo) : '—'}</td><td><span class="bcarga2 ${x.st[1] === 'neu' ? 'low' : x.st[1]}">${x.st[0]}</span></td><td class="l rec">${x.al.map(l => `<span class="rcm r-${l[0]}">${esc(l[1])}</span>`).join('')}<span class="rcm r-ok">${esc(x.rec)}</span></td></tr>`).join('')}</tbody></table></div><p class="muted pb" style="font-size:12px;margin:0">Últimos jogos: vermelho = 60+ min · verde = entrou · cinza = relacionado sem entrar · claro = não relacionado. Os minutos vêm do módulo de Minutagem (${ult.length ? 'último jogo em ' + fmtD(ult[ult.length - 1].data) : 'nenhum jogo minutado'}).</p>`, { np: true })}`;
}
dmOn('click', e => { const t = e.target.closest('[data-act="mc-comp"]'); if (t) { UI.mcComp = t.dataset.v; render(); } });

/* ================= EXPORTAR TODOS OS DADOS ================= */
const EXPS = [['atletas', 'Atletas'], ['lesoes', 'Lesões / DM'], ['avaliacoes', 'Avaliações corporais'], ['hidratacao', 'Hidratação'], ['testes', 'Testes físicos'], ['maturacao', 'Maturação'], ['bemestar', 'Bem-estar'], ['pse', 'PSE / carga'], ['micro', 'Microciclo'], ['planos', 'Planos de treino'], ['macro', 'Macrociclo'], ['jogos', 'Jogos e minutagem']];
UI.expSel = new Set(EXPS.map(x => x[0]));
function linhasExport(k) {
  const nm = id => { const a = atl(id); return a ? a.nome : id; }, ct = id => atl(id)?.categoria || '';
  if (k === 'atletas') return S.atletas.map(a => ({ Nome: a.nome, Apelido: a.apelido || '', Número: a.numero || '', Nascimento: a.nascimento || '', Categoria: a.categoria, Subcategoria: a.subcategoria || '', Posição: a.posicao, Função: a.posDetalhe || '', Pé: a.pe || '', Altura: a.altura || '', Peso: a.peso || '', 'Gordura %': a.gordura || '' }));
  if (k === 'lesoes') return S.lesoes.map(l => ({ Atleta: nm(l.atletaId), Categoria: ct(l.atletaId), Data: l.data, Tipo: l.tipo, Grau: l.grau, Região: regLong(l), Local: l.local, Mecanismo: l.mecanismo, Dor: l.dor, Status: STATUS[l.status], Previsão: l.previsao || '', 'Dias fora': diasFora(l), Condutas: (l.tratamentos || []).join(', '), Exames: l.exames || '', Recorrente: l.recorrente ? 'Sim' : 'Não', Observações: l.obs || '' }));
  if (k === 'avaliacoes') return S.avaliacoes.map(v => { const c = calcAv(v); return { Atleta: nm(v.atletaId), Data: v.data, Peso: v.peso, Altura: v.altura, Protocolo: v.protocolo, '% gordura': c.g, 'Massa magra': c.mm != null ? Math.round(c.mm * 10) / 10 : '', 'Massa gorda': c.mg != null ? Math.round(c.mg * 10) / 10 : '', IMC: c.imc != null ? Math.round(c.imc * 10) / 10 : '', 'Soma dobras': c.soma, ...Object.fromEntries(Object.entries(v.dobras || {}).map(([d, x]) => ['Dobra ' + d, x])) }; });
  if (k === 'hidratacao') return S.hidratacao.flatMap(s => (s.registros || []).map(r => { const c = hidCalc(r, s.duracao); return { Data: s.data, Sessão: s.tipo, Duração: s.duracao, Atleta: nm(r.atletaId), 'Peso antes': r.pre, 'Peso depois': r.pos, 'Ingerido (ml)': r.ingerido, 'Urina (ml)': r.urina, 'Cor urina': r.cor, '% perdido': c ? Math.round(c.pct * 100) / 100 : '', 'Sudorese (L/h)': c && c.sud != null ? Math.round(c.sud * 100) / 100 : '' }; }));
  if (k === 'testes') return S.testes.map(t => ({ Atleta: nm(t.atletaId), Categoria: ct(t.atletaId), Data: t.data, 'CMJ 1': t.cmj_1 ?? '', 'CMJ 2': t.cmj_2 ?? '', 'CMJ 3': t.cmj_3 ?? '', 'CMJ média': tval(t, 'cmj') != null ? Math.round(tval(t, 'cmj') * 10) / 10 : '', VIFT: t.ift ?? '', '10m 1': t.v10_1 ?? '', '10m 2': t.v10_2 ?? '', '10m 3': t.v10_3 ?? '', '10m média': tval(t, 'v10') != null ? Math.round(tval(t, 'v10') * 100) / 100 : '', '30m 1': t.v30_1 ?? '', '30m 2': t.v30_2 ?? '', '30m 3': t.v30_3 ?? '', '30m média': tval(t, 'v30') != null ? Math.round(tval(t, 'v30') * 100) / 100 : '', '505 D1': t.t505d_1 ?? t.t505d ?? '', '505 D2': t.t505d_2 ?? '', '505 E1': t.t505e_1 ?? t.t505e ?? '', '505 E2': t.t505e_2 ?? '', '505 D (média)': lado505(t, 'd') != null ? Math.round(lado505(t, 'd') * 100) / 100 : '', '505 E (média)': lado505(t, 'e') != null ? Math.round(lado505(t, 'e') * 100) / 100 : '', '505 melhor lado': tval(t, 't505') != null ? Math.round(tval(t, 't505') * 100) / 100 : '' }));
  if (k === 'maturacao') return S.maturacao.map(m => { const c = calcMat(m) || {}; return { Atleta: nm(m.atletaId), Data: m.data, Estatura: m.altura, 'Altura sentado': m.alturaSentado, Perna: c.LL != null ? Math.round(c.LL * 10) / 10 : '', Peso: m.peso ?? '', 'Idade': c.ida != null ? Math.round(c.ida * 10) / 10 : '', 'Offset (Mirwald)': c.mo != null ? Math.round(c.mo * 100) / 100 : '', 'Idade PHV': c.aphv != null ? Math.round(c.aphv * 10) / 10 : '', Situação: c.st ? MSTAT[c.st][0] : '', 'Altura pai': m.alturaPai ?? '', 'Altura mãe': m.alturaMae ?? '' }; });
  if (k === 'bemestar') return (S.bemestar || []).filter(r => r.sono !== undefined).map(r => ({ Atleta: nm(r.atletaId), Data: r.data, 'Treina hoje': r.treinaHoje, Sono: r.sono, Fadiga: r.fadiga, Recuperação: r.recuperacao, Estresse: r.estresse, Humor: r.humor, Dor: r.dor, 'Escala dor': r.escalaDor ?? '', 'Local dor': r.localDor || '', Urina: r.urina ?? '', Status: beSt(r).st, Origem: r.origem || '' }));
  if (k === 'pse') return (S.pse || []).map(r => ({ Atleta: nm(r.atletaId), Categoria: ct(r.atletaId), Data: r.data, Sessão: r.sessao || '', PSE: r.pse, Minutos: r.duracao, UA: carga(r) }));
  if (k === 'micro') return (S.micro || []).map(s => ({ Categoria: s.categoria, Data: s.data, Hora: s.hora || '', Tipo: (SESS[s.tipo] || [s.tipo])[0], Título: s.titulo || '', Adversário: s.adversario || '', 'Duração planejada': s.duracao, 'PSE planejada': s.pse ?? '', 'UA alvo': s.pse != null ? s.pse * (s.duracao || 0) : '', Detalhes: s.conteudo || '' }));
  if (k === 'planos') return (S.planos || []).flatMap(p => blocosDe(p).map((b, i) => ({ Data: p.data, Categoria: p.categoria, Local: p.local || '', Microciclo: p.microciclo || '', Horário: p.horario || '', Atividade: (i + 1) + '. ' + (b.nome || ''), Tipo: b.tipo, Método: b.metodo || '', Duração: b.duracao, Campo: b.campo || '', Objetivo: b.objetivo || '', Desenvolvimento: b.desenvolvimento || '', Exercícios: (b.exercicios || []).map(x => `${x.nome} ${x.series || ''}`).join(' | ') })));
  if (k === 'macro') return (S.macro || []).map(b => ({ Categoria: b.categoria, Tipo: MACRO_TIPOS[b.tipo] || b.tipo, Nome: b.nome, Início: b.inicio, Fim: b.fim, Objetivo: b.objetivo || '' }));
  if (k === 'jogos') return (window.MIN?.S.jogos || []).flatMap(j => (j.relacionados || []).length ? j.relacionados.map(r => ({ Data: j.data, Categoria: j.categoria, Competição: j.competicao || '', Adversário: j.adversario || '', Mando: j.mando || '', 'Gols pró': j.golsPro ?? '', 'Gols contra': j.golsContra ?? '', Atleta: nm(r.atletaId), Situação: r.status === 'T' ? 'Titular' : 'Reserva', Minutos: +r.min || 0, Gols: +r.gols || 0, Assistências: +r.assist || 0 })) : [{ Data: j.data, Categoria: j.categoria, Competição: j.competicao || '', Adversário: j.adversario || '', Atleta: '(sem minutagem)' }]);
  return [];
}
async function exportarTudo(fmt) {
  const sel = EXPS.filter(([k]) => UI.expSel.has(k)); if (!sel.length) { toast('Escolha pelo menos um item.', true); return; }
  const dl = window.claude && await window.claude.use('downloads'); if (!dl) { toast('O download não está disponível nesta visualização.', true); return; }
  try {
    if (fmt === 'json') { const o = { sistema: 'Porto Vitória · Performance Hub', geradoEm: new Date().toISOString() }; sel.forEach(([k]) => { o[k] = k === 'jogos' ? (window.MIN?.S.jogos || []) : (S[k] || []); }); o.config = S.config; await dl.save({ filename: `porto-vitoria-dados-${todayISO()}.json`, data: JSON.stringify(o, null, 1) }); toast('Backup salvo'); return; }
    await loadLib('xlsx'); const wb = XLSX.utils.book_new(); sel.forEach(([k, n]) => { const rows = linhasExport(k); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows.length ? rows : [{ Aviso: 'Sem dados' }]), n.slice(0, 31).replace(/[\\/?*[\]:]/g, '-')); });
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }); await dl.save({ filename: `porto-vitoria-dados-${todayISO()}.xlsx`, data: new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) }); toast('Planilha salva');
  } catch (e) { if (e && e.code !== 'declined') toast('Não foi possível exportar.', true); }
}
function exportHTML() { return panel('Exportar todos os dados', `<p class="muted" style="margin-top:0">Escolha o que entra no arquivo. A planilha Excel sai com uma aba para cada item (com as médias e cálculos já feitos); o backup JSON guarda tudo para restaurar depois.</p><div class="tchips">${EXPS.map(([k, n]) => `<label><input type="checkbox" data-exp="${k}" ${UI.expSel.has(k) ? 'checked' : ''}>${n} <small class="muted">(${k === 'jogos' ? (window.MIN?.S.jogos || []).length : (S[k] || []).length})</small></label>`).join('')}</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn pri" data-act="exp-go" data-f="xlsx">${IC.down} Exportar Excel (.xlsx)</button><button class="btn" data-act="exp-go" data-f="json">${IC.down} Backup completo (.json)</button><button class="btn sm" data-act="exp-all">Marcar todos</button></div>`); }

dmOn('change', e => { const k = e.target.dataset.exp; if (k) e.target.checked ? UI.expSel.add(k) : UI.expSel.delete(k); });
dmOn('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'exp-go') exportarTudo(t.dataset.f); if (t.dataset.act === 'exp-all') { UI.expSel = new Set(EXPS.map(x => x[0])); render(); } });

/* ================= AVALIAÇÃO FÍSICA · RELATÓRIOS EM PDF ================= */
AV_TABS.splice(4, 0, ['av-rel', 'Relatórios em PDF']); TITLES['av-rel'] = ['Avaliação física', 'Relatórios em PDF']; AV_TITLE['av-rel'] = 'RELATÓRIOS DE AVALIAÇÃO FÍSICA';
UI.ar = { capa: true, painel: true, tabela: true, testes: new Set(Object.keys(TESTS)), mat: true, ind: new Set(), titulo: 'AVALIAÇÃO FÍSICA', sub: '', profs: null };
function arCfg() { const c = S.config.avRel || {}; return { titulo: c.titulo || 'AVALIAÇÃO FÍSICA', sub: c.sub || '', profs: c.profs || (S.config.profissionais || []).filter(p => p.nome).map(p => `${p.nome}${p.funcao ? ' · ' + p.funcao : ''}`).join('\n') }; }
function capaAv() {
  const c = arCfg(), ats = atletasCat(), ds = [...new Set(tsCat().map(t => t.data))].sort();
  return pageWrap(`<div class="avcapa"><div class="avc-l"><img src="${LOGO}" alt=""><small>Porto Vitória · Departamento de Futebol de Base</small><h1>${esc(c.titulo)}</h1><h2>${esc(c.sub || 'Relatório de testes físicos · ' + catLabel())}</h2><div class="avc-k"><div><b>${ats.filter(a => tsDe(a.id).some(t => naTemporada(t.data))).length}</b><span>atletas avaliados</span></div><div><b>${ds.length}</b><span>sessões de testes</span></div><div><b>${Object.keys(TESTS).length}</b><span>testes na bateria</span></div></div><p>${ds.length ? `Período: ${fmtD(ds[0])} a ${fmtD(ds[ds.length - 1])}` : ''}</p><div class="avc-t">${Object.values(TESTS).map(t => `<span>${t.n}</span>`).join('')}<span>Maturação</span></div></div><div class="avc-r"><b>${anoLabel() === 'TODAS' ? todayISO().slice(0, 4) : anoLabel()}</b><div class="avc-p">${esc(c.profs).split('\n').filter(Boolean).map(l => `<span>${esc(l)}</span>`).join('')}</div><small>Emitido em ${fmtD(todayISO())}</small></div></div>`);
}
function arHead(t, sub) { return header({ title: t, sub: 'AVALIAÇÃO FÍSICA · PREPARAÇÃO FÍSICA', pill: sub || catLabel().toUpperCase(), items: hdrItems() }) + '<div style="height:14px"></div>'; }
function tabelaGeral(lista) {
  return `<table class="t avtg"><thead><tr><th class="l">Atleta</th><th>Pos.</th><th>Idade</th>${Object.values(TESTS).map(t => `<th>${t.n.replace('Velocidade ', '').replace('Teste ', '')}<br><small>(${t.u})</small></th>`).join('')}<th>Maturação</th><th>Última</th></tr></thead><tbody>${lista.map(a => { const mc = (() => { const m = matDe(a.id).slice(-1)[0]; return m ? calcMat(m) : null; })(); return `<tr><td class="l"><b>${esc(a.apelido || a.nome)}</b></td><td>${ptag(a.posicao)}</td><td>${nf(idadeDec(a.nascimento) || 0, 1)}</td>${Object.keys(TESTS).map(k => { const t = ultimoTeste(a.id, k), v = t ? tval(t, k) : null, bi = bandIdx(k, v); return `<td><b style="color:${bi != null ? BCOL[bi] : 'inherit'}">${fmtT(k, v)}</b>${v != null ? `<small class="btx" style="color:${BCOL[bi]}">${BANDS[bi]}</small>` : ''}</td>`; }).join('')}<td>${mc && mc.mo != null ? `${mc.mo >= 0 ? '+' : ''}${nf(mc.mo, 1)}<small class="btx" style="color:${MSTAT[mc.st][1]}">${MSTAT[mc.st][0]}</small>` : '—'}</td><td>${tsDe(a.id).length ? fmtDs(tsDe(a.id).slice(-1)[0].data) : '—'}</td></tr>`; }).join('')}</tbody></table>`;
}
// relatório individual do atleta (uma folha por atleta)
function relIndAv(a) {
  const ts = tsDe(a.id), mt = matDe(a.id).slice(-1)[0], mc = mt ? calcMat(mt) : null, tm = mc && mc.mo != null ? timing(mc) : null, av = avsDe(a.id).slice(-1)[0], ca = av ? calcAv(av) : null;
  const card = k => { const T = TESTS[k], t = ultimoTeste(a.id, k), v = t ? tval(t, k) : null, p = t ? ultimoTeste(a.id, k, t.data) : null, pv = p ? tval(p, k) : null, g = grupoStats(k), pc = pctl(k, v, g), bi = bandIdx(k, v);
    const hist = ts.filter(x => tval(x, k) != null); const extra = k === 't505' && t ? `<div class="ric-x">D ${fmtT(k, lado505(t, 'd'))} · E ${fmtT(k, lado505(t, 'e'))}</div>` : (k === 'cmj' || k === 'v10' || k === 'v30') && t && t[k + '_1'] ? `<div class="ric-x">${[1, 2, 3].map(i => t[k + '_' + i] != null ? nf(t[k + '_' + i], T.d) : '—').join(' · ')}</div>` : '';
    return `<div class="ric" style="--bc:${bi != null ? BCOL[bi] : '#9aa5a0'}"><div class="ric-h">${IC[T.ic]}<b>${T.n}</b><span>${T.u}</span></div><div class="ric-v">${fmtT(k, v)}</div>${extra}<div class="ric-b">${bi != null ? `<span class="bchip2 ${BCLS[bi]}">${BANDS[bi]}</span>` : '<span class="muted">sem teste</span>'}</div><div class="ric-m"><span>Anterior <b>${fmtT(k, pv)}</b></span><span>${varTag(k, pv, v)}</span><span>Percentil <b>${pc ?? '—'}</b></span></div>${hist.length > 1 ? `<div class="ric-g">${lineChart(hist.map(x => fmtDs(x.data)), hist.map(x => Math.round(tval(x, k) * 100) / 100), { w: 300, h: 110, fit: true })}</div>` : '<div class="ric-g muted" style="font-size:11px;text-align:center;padding:20px 0">Uma avaliação</div>'}</div>`; };
  const perf = Object.entries(TESTS).map(([k, T]) => { const t = ultimoTeste(a.id, k); const pc = t ? pctl(k, tval(t, k), grupoStats(k)) : null; return `<div class="rip"><span>${T.n.replace('Velocidade ', 'Vel. ')}</span><div><i style="width:${pc ?? 0}%;background:${pc == null ? '#cfd8d3' : pc >= 67 ? '#1b8a4a' : pc >= 34 ? '#f6c21c' : '#e0342b'}"></i></div><b>${pc ?? '—'}</b></div>`; }).join('');
  const destaques = Object.entries(TESTS).map(([k, T]) => { const t = ultimoTeste(a.id, k); const pc = t ? pctl(k, tval(t, k), grupoStats(k)) : null; return { n: T.n, pc }; }).filter(x => x.pc != null);
  const fortes = destaques.filter(x => x.pc >= 67).map(x => x.n), fracos = destaques.filter(x => x.pc <= 33).map(x => x.n);
  return pageWrap(`<div class="rin">
    <div class="rin-h"><div class="rin-f">${a.foto ? `<img src="${esc(a.foto)}" alt="">` : `<span class="sil">${IC.shirt}</span>`}<img class="rin-e" src="${LOGO}" alt=""></div>
      <div class="rin-n"><small>Relatório individual · Avaliação física</small><h2>${esc(a.nome)}${a.numero ? ` <span>#${esc(a.numero)}</span>` : ''}</h2><p>${esc(a.posDetalhe || POSN[a.posicao] || '')} · ${esc(a.subcategoria || a.categoria)} · ${idade(a.nascimento) || '—'} anos · pé ${esc((a.pe || '—').toLowerCase())}</p>
        <div class="rin-k"><div><small>Estatura</small><b>${mc?.H ? nf(mc.H, 1) + ' cm' : a.altura ? nf(+a.altura * 100, 0) + ' cm' : '—'}</b></div><div><small>Peso</small><b>${ca ? nf(ca.peso, 1) : a.peso ? nf(a.peso, 1) : '—'} kg</b></div><div><small>% gordura</small><b>${ca && ca.g != null ? nf(ca.g, 1) + '%' : '—'}</b></div><div><small>Maturação</small><b>${tm ? `${tm.t[0]} · ${fase(mc.st)}` : '—'}</b></div><div><small>Idade biológica</small><b>${tm ? nf(tm.bio, 1) : '—'}</b></div><div><small>Avaliações</small><b>${ts.length}</b></div></div></div>
      <div class="rin-pf"><h5>Perfil no grupo (percentil)</h5>${perf}</div></div>
    <div class="rin-c">${Object.keys(TESTS).map(card).join('')}</div>
    <div class="rin-s"><div><h5>Pontos fortes</h5><p>${fortes.length ? fortes.join(', ') : 'Sem destaques acima do percentil 67.'}</p></div><div><h5>A desenvolver</h5><p>${fracos.length ? fracos.join(', ') : 'Nenhum teste abaixo do percentil 33.'}</p></div><div><h5>Maturação</h5><p>${tm ? `Offset ${mc.mo >= 0 ? '+' : ''}${nf(mc.mo, 2)} ano(s) · idade do pico ${nf(mc.aphv, 1)} · ${tm.t[0].toLowerCase()} em relação à idade cronológica.` : 'Sem medição maturacional.'}</p></div></div>
  </div>`);
}
function paginasAv(opt) {
  const ats = atletasCat().filter(a => tsDe(a.id).length).sort((x, y) => POS.indexOf(x.posicao) - POS.indexOf(y.posicao) || x.nome.localeCompare(y.nome)), P = [];
  const v0 = S.view; PRINT = true;
  try {
    if (opt.capa) P.push(capaAv());
    if (opt.painel) { S.view = 'av-dash'; P.push(pageWrap(arHead('PAINEL DE AVALIAÇÃO FÍSICA') + fAvDash())); }
    if (opt.tabela) for (let i = 0; i < ats.length; i += 18) P.push(pageWrap(arHead('RESULTADOS GERAIS', ats.length > 18 ? `ATLETAS ${i + 1}–${Math.min(ats.length, i + 18)}` : '') + `<div class="panel"><div class="pb np">${tabelaGeral(ats.slice(i, i + 18))}</div></div>`));
    [...opt.testes].forEach(k => { const r = 'av-t-' + k; S.view = r; P.push(pageWrap(arHead(AV_TITLE[r]) + fTeste(k))); });
    if (opt.mat) { S.view = 'mat-dash'; P.push(pageWrap(arHead('MATURAÇÃO BIOLÓGICA') + fMatDash())); }
    [...opt.ind].forEach(id => { const a = atl(id); if (a) P.push(relIndAv(a)); });
  } finally { PRINT = false; S.view = v0; }
  return P;
}
function fAvRel() {
  const o = UI.ar, c = arCfg(), ats = atletasCat().filter(a => tsDe(a.id).length).sort((x, y) => x.nome.localeCompare(y.nome));
  const nT = Math.ceil(ats.length / 18) || 0, nPag = (o.capa ? 1 : 0) + (o.painel ? 1 : 0) + (o.tabela ? nT : 0) + o.testes.size + (o.mat ? 1 : 0) + o.ind.size;
  const ck = (k, t, d, on) => `<label class="arck"><input type="checkbox" data-ar="${k}" ${on ? 'checked' : ''}><span><b>${t}</b><small>${d}</small></span></label>`;
  return `<div class="row r21" style="align-items:start">
    <div class="panel"><div class="ph">Montar o relatório<span class="r">${nPag} página(s) 16:9</span></div><div class="pb">
      <h5 class="arh">Relatório geral</h5>
      ${ck('capa', 'Capa', 'Título, categoria, período, testes da bateria e profissionais', o.capa)}
      ${ck('painel', 'Painel geral', 'Indicadores, melhores do elenco, médias da equipe e por posição', o.painel)}
      ${ck('tabela', 'Resultados gerais', `Todos os atletas com todos os testes e faixas (${nT} página(s))`, o.tabela)}
      <div class="arts">${Object.entries(TESTS).map(([k, T]) => `<label><input type="checkbox" data-art="${k}" ${o.testes.has(k) ? 'checked' : ''}>${T.n}</label>`).join('')}</div>
      ${ck('mat', 'Maturação', 'Status maturacional, distribuição e bio-banding', o.mat)}
      <h5 class="arh">Relatório individual <small>(uma folha por atleta)</small></h5>
      <div class="arind"><label class="arall"><input type="checkbox" id="arAll" ${ats.length && ats.every(a => o.ind.has(a.id)) ? 'checked' : ''}> Selecionar todos (${ats.length})</label>${ats.map(a => `<label class="${o.ind.has(a.id) ? 'on' : ''}"><input type="checkbox" data-ari="${a.id}" ${o.ind.has(a.id) ? 'checked' : ''}>${fotoBox(a, 'mini')}<span><b>${esc(a.apelido || a.nome)}</b><small>${esc(a.posicao)} · ${tsDe(a.id).length} aval.</small></span></label>`).join('') || '<span class="muted">Nenhum atleta com testes.</span>'}</div>
      <div class="arbtn"><button class="btn" data-act="ar-go" data-pdf="0" ${nPag ? '' : 'disabled'}>${IC.print} Imprimir</button><button class="btn pri" data-act="ar-go" data-pdf="1" ${nPag ? '' : 'disabled'}>${IC.pdf} Baixar PDF</button>${o.ind.size === 1 && !o.capa && !o.painel && !o.tabela && !o.testes.size && !o.mat ? '' : `<button class="btn sm" data-act="ar-only">Só os individuais</button>`}</div>
    </div></div>
    <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
      <!--RBPREV-->
    </div>
  </div>`;
}
const _vAvalR = vAval;
vAval = function () { if (S.view !== 'av-rel') return _vAvalR(); const h = header({ title: AV_TITLE['av-rel'], sub: 'AVALIAÇÃO FÍSICA · PREPARAÇÃO FÍSICA', items: hdrItems() }); return h + avTabsHTML(S.view) + fAvRel(); };
// botão no relatório de cada atleta e na evolução individual
const _fAvIndR = fAvInd;
fAvInd = function () { return _fAvIndR().replace(`data-t="fis">${IC.user} Abrir ficha</button>`, `data-t="fis">${IC.user} Abrir ficha</button><button class="btn pri" data-act="ar-one" data-id="${UI.avAtl}">${IC.pdf} Relatório individual</button>`); };
dmOn('change', e => {
  const t = e.target, o = UI.ar;
  if (t.dataset.ar) { o[t.dataset.ar] = t.checked; render(); }
  if (t.dataset.art) { t.checked ? o.testes.add(t.dataset.art) : o.testes.delete(t.dataset.art); render(); }
  if (t.dataset.ari) { t.checked ? o.ind.add(t.dataset.ari) : o.ind.delete(t.dataset.ari); render(); }
  if (t.id === 'arAll') { atletasCat().filter(a => tsDe(a.id).length).forEach(a => t.checked ? o.ind.add(a.id) : o.ind.delete(a.id)); render(); }
  if (['arT', 'arS', 'arP'].includes(t.id)) { S.config.avRel = { titulo: $('#arT').value.trim(), sub: $('#arS').value.trim(), profs: $('#arP').value }; putConfig(); toast('Capa salva'); }
});
dmOn('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'ar-go') { const p = paginasAv(UI.ar); if (!p.length) return; if (t.dataset.pdf === '1') gerarPDF(p, 'avaliacao-fisica'); else imprimir(p); }
  if (t.dataset.act === 'ar-only') { Object.assign(UI.ar, { capa: false, painel: false, tabela: false, mat: false }); UI.ar.testes.clear(); render(); }
  if (t.dataset.act === 'ar-one') { const a = atl(t.dataset.id); if (!a) return; openModal(mh('Relatório individual · ' + esc(a.nome)) + `<div class="mb"><p style="margin:0">Uma folha 16:9 com foto, dados, todos os testes, histórico, percentis e maturação.</p></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn" data-act="ar-one-go" data-id="${a.id}" data-pdf="0">${IC.print} Imprimir</button><button class="btn pri" data-act="ar-one-go" data-id="${a.id}" data-pdf="1">${IC.pdf} Baixar PDF</button></div>`); }
  if (t.dataset.act === 'ar-one-go') { closeModal(); const p = paginasAv({ capa: false, painel: false, tabela: false, testes: new Set(), mat: false, ind: new Set([t.dataset.id]) }); if (t.dataset.pdf === '1') gerarPDF(p, 'avaliacao-individual'); else imprimir(p); }
});

/* ================= RELATÓRIO INDIVIDUAL · LAYOUT DA ARTE DO CLUBE ================= */
const LOGOBIG = PV_ASSETS[2];
const RXI = {
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4.5" fill="currentColor"/><path d="M3 22c0-5 4-8 9-8s9 3 9 8z" fill="currentColor"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/><path d="M7 14h2M11 14h2M15 14h2M7 17h2M11 17h2" stroke-width="1.6"/></svg>',
  ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M12 5h3M12 9h2M12 13h3M12 17h2" stroke-width="1.6"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z"/></svg>',
  group: '<svg viewBox="0 0 32 24"><circle cx="16" cy="6" r="4" fill="currentColor"/><circle cx="7" cy="8" r="3" fill="currentColor"/><circle cx="25" cy="8" r="3" fill="currentColor"/><rect x="2" y="13" width="28" height="11" rx="3" fill="currentColor"/></svg>',
  bars: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V9M10 21V13M15 21V7M20 21V11"/><path d="M4 8l6-4 4 3 6-5" stroke-width="1.8"/></svg>',
  clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V2h6v2M8 9h8M8 13h8M8 17h5"/></svg>',
  run: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="4" r="2" fill="currentColor"/><path d="M8 9l4-2 3 3 3 1M12 7l-2 6 4 3-1 6M10 13l-4 7M5 11l3-2"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M2 18l6-6 4 4 9-9"/></svg>',
  gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M3 17a9 9 0 0 1 18 0"/><path d="M12 17l4-6"/><circle cx="12" cy="17" r="1.6" fill="currentColor"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 21 3.5 12.5a5 5 0 0 1 7-7L12 7l1.5-1.5a5 5 0 0 1 7 7z" fill="currentColor"/></svg>',
  person: '<svg viewBox="0 0 24 24"><circle cx="12" cy="4" r="2.6" fill="currentColor"/><path d="M8 8h8l-1 7h-2v7h-2v-7H9z" fill="currentColor"/></svg>'
};
const POS_XY = { GOL: [7, 50], ZAG: [21, 50], LAT: [30, 82], VOL: [37, 50], MEI: [55, 50], EXT: [74, 18], ATA: [86, 50] };
function posXY(a) { let [x, y] = POS_XY[a.posicao] || [50, 50]; const d = nrmB(a.posDetalhe || ''); if (a.posicao === 'LAT' || a.posicao === 'EXT') y = /esquerd/.test(d) ? 18 : 82; if (/meia direit|ponta direit/.test(d)) y = 82; if (/esquerd/.test(d) && a.posicao === 'MEI') y = 25; return [x, y]; }
const BWORD = ['EXCELENTE', 'MUITO BOM', 'BOM', 'REGULAR', 'ABAIXO'], BWCOL = ['#1fd03a', '#1a73ff', '#1a73ff', '#1a73ff', '#ff2a2a'];
const sgn = (v, d) => v == null || isNaN(v) ? '' : (v >= 0 ? '+' : '−') + nf(Math.abs(v), d);
relIndAv = function (a) {
  const ts = tsDe(a.id), last = ts[ts.length - 1], mt = matDe(a.id).slice(-1)[0], mc = mt ? calcMat(mt) : null, av = avsDe(a.id).slice(-1)[0], ca = av ? calcAv(av) : null;
  const partes = (a.nome || '').trim().split(/\s+/), primeiro = (a.apelido && !a.apelido.includes(' ') ? a.apelido : partes[0] || '').toUpperCase(), sobre = (partes.length > 1 ? partes[partes.length - 1] : '').toUpperCase() || primeiro;
  const alt = mc?.H ? mc.H / 100 : av?.altura ? +av.altura : a.altura ? +a.altura : null, peso = ca ? ca.peso : a.peso ? +a.peso : null, gord = ca && ca.g != null ? ca.g : a.gordura ? +a.gordura : null;
  const elenco = S.atletas.filter(x => x.categoria === a.categoria), pres = last ? new Set(S.testes.filter(t => t.data === last.data && elenco.some(x => x.id === t.atletaId)).map(t => t.atletaId)).size : 0;
  const nT = last ? Object.keys(TESTS).filter(k => tval(last, k) != null).length : 0;
  const mesAno = last ? ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][+last.data.slice(5, 7) - 1] + '/' + last.data.slice(0, 4) : '—';
  const res = k => { const t = ultimoTeste(a.id, k), v = t ? tval(t, k) : null, p = t ? ultimoTeste(a.id, k, t.data) : null, pv = p ? tval(p, k) : null, bi = bandIdx(k, v); return { t, v, dv: v != null && pv != null ? v - pv : null, bi, w: bi != null ? BWORD[bi] : '—', c: bi != null ? BWCOL[bi] : '#8fb59a' }; };
  const card = (ic, l1, l2, k) => { const r = res(k); return `<div class="rxc"><div class="rxch">${RXI[ic]}<span>${l1}<br>${l2}</span></div><div class="rxv">${fmtT(k, r.v)}${r.dv != null ? `<sup>${sgn(r.dv, TESTS[k].d === 2 ? 1 : 1)}</sup>` : ''}</div><div class="rxw" style="color:${r.c}">${r.w}</div></div>`; };
  const r505 = res('t505'), dD = r505.t ? lado505(r505.t, 'd') : null, dE = r505.t ? lado505(r505.t, 'e') : null;
  const pcs = Object.keys(TESTS).map(k => { const t = ultimoTeste(a.id, k); return t ? pctl(k, tval(t, k), grupoStats(k)) : null; }).filter(v => v != null), ind = pcs.length ? Math.round(mean(pcs)) : null;
  const iw = ind == null ? ['—', '#8fb59a'] : ind >= 80 ? ['EXCELENTE', '#1fd03a'] : ind >= 65 ? ['MUITO BOM', '#1a73ff'] : ind >= 55 ? ['BOM', '#1a73ff'] : ind >= 35 ? ['REGULAR', '#1a73ff'] : ['ABAIXO', '#ff2a2a'];
  const [px, py] = posXY(a), FX = x => 30 + x / 100 * 340, FYt = y => { const t = y / 100; return { y: 18 + t * 128, l: 52 - t * 42, r: 348 + t * 42 }; };
  const fy = FYt(py), dotx = fy.l + (fy.r - fy.l) * px / 100;
  const pool = S.atletas.filter(x => x.categoria === a.categoria && x.posicao === a.posicao).sort((p, q) => p.nome.localeCompare(q.nome)); const NV = 7; const ix = Math.max(0, pool.findIndex(x => x.id === a.id)); const ini = Math.max(0, Math.min(ix - 3, pool.length - NV)); const car = pool.slice(ini, ini + NV);
  const foto = x => x.foto ? `<img src="${esc(x.foto)}" alt="">` : `<span class="rxsil">${IC.shirt}</span>`;
  return `<div class="sheet"><div class="pdfpage fixed rxpg"><div class="rx">
    <img class="rxcrest" src="${LOGOBIG}" alt="">
    <div class="rxph">${a.foto ? `<img src="${esc(a.foto)}" alt="">` : `<span class="rxsil big">${IC.shirt}</span>`}</div>
    <img class="rxlogo" src="${LOGOBIG}" alt="">
    <div class="rxname"><small>${esc(primeiro === sobre ? '' : primeiro)}</small><b>${esc(sobre)}</b></div>
    <div class="rxinfo"><span>${RXI.user}${esc((a.subcategoria || a.categoria || '').replace('-', ' ').toUpperCase())}</span><i></i><span>${RXI.cal}${idade(a.nascimento) || '—'} ANOS</span><i></i><span>${RXI.ruler}${alt ? nf(alt, 2) : '—'}</span><i></i><span>${RXI.bag}${peso ? nf(peso, 1) + ' kg' : '—'}</span></div>
    <div class="rxpos"><div class="rxposh">${RXI.shield}<div><small>POSIÇÃO</small><b>${esc((a.posDetalhe || POSN[a.posicao] || '').toUpperCase())}</b></div></div><h6>POSICIONAMENTO EM CAMPO</h6>
      <img class="rxfield" alt="Posicionamento em campo" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 412 182" width="700" height="310"><g transform="translate(6 6)"><path d="M52 18 H348 L390 146 H10 Z" fill="none" stroke="#fff" stroke-width="3"/><line x1="200" y1="18" x2="200" y2="146" stroke="#fff" stroke-width="3"/><ellipse cx="200" cy="82" rx="46" ry="30" fill="none" stroke="#fff" stroke-width="3"/><path d="M45 40 H100 L92 124 H22 Z M37 62 H62 L58 102 H30 Z" fill="none" stroke="#fff" stroke-width="3"/><path d="M355 40 H300 L308 124 H378 Z M363 62 H338 L342 102 H370 Z" fill="none" stroke="#fff" stroke-width="3"/><path d="M100 64 Q118 82 98 102 M300 64 Q282 82 302 102" fill="none" stroke="#fff" stroke-width="3"/><circle cx="${dotx}" cy="${fy.y}" r="10" fill="#1fd03a" stroke="#0a4d17" stroke-width="2.5"/><circle cx="${dotx}" cy="${fy.y}" r="18" fill="none" stroke="#1fd03a" stroke-width="1.5" opacity=".5"/></g></svg>`)}"></div>
    <div class="rxant"><h6>ANTROPOMETRIA</h6><div><span>${RXI.bag}<small>PESO</small><b>${peso ? nf(peso, 1) : '—'}</b><em>KG</em></span><i></i><span>${RXI.ruler}<small>ALTURA</small><b>${alt ? nf(alt, 2) : '—'}</b><em>m</em></span><i></i><span>${RXI.person}<small>%GORDURA</small><b>${gord != null ? nf(gord, 2) : '—'}</b><em>&nbsp;</em></span></div></div>
    <div class="rxst"><div>${RXI.group}<b>${elenco.length}</b><span>ATLETAS</span></div><i></i><div>${RXI.bars}<b>${nT}</b><span>TESTES<br>REALIZADOS</span></div><i></i><div>${RXI.clip}<b>${pres}</b><span>PRESENÇA<br>NA AVALIAÇÃO</span></div><i></i><div>${RXI.cal}<b class="sm">${mesAno}</b><span>DATA DA<br>AVALIAÇÃO</span></div></div>
    <div class="rxres"><h5>RESULTADOS DAS AVALIAÇÕES</h5><div class="rxg">
      ${card('run', 'CMJ', 'SALTO VERTICAL', 'cmj')}${card('run', 'VELOCIDADE 10m', 'TEMPO', 'v10')}${card('run', 'VELOCIDADE 30m', 'TEMPO', 'v30')}
      <div class="rxc"><div class="rxch">${RXI.trend}<span>AGILIDADE T505<br>TEMPO</span></div><div class="rx505"><div><b>${dD != null ? nf(dD, 2) : '—'}</b><em>DIREITA</em></div><div><b>${dE != null ? nf(dE, 2) : '—'}</b><em>ESQUERDA</em></div></div></div>
      ${card('gauge', 'APTIDÃO FÍSICA', '30-15 IFT', 'ift')}
      <div class="rxc"><div class="rxch">${RXI.heart}<span>ÍNDICE GERAL<br><small>DESEMPENHO FÍSICO</small></span></div><div class="rxv">${ind != null ? ind + '%' : '—'}</div><div class="rxw" style="color:${iw[1]}">${iw[0]}</div></div>
    </div></div>
    <div class="rxcar"><span class="rxcap">${esc((POSN[a.posicao] || a.posicao).toUpperCase())}S · ${esc((a.subcategoria || a.categoria || '').replace('-', ' ').toUpperCase())} <em>${pool.length}</em></span><span class="rxar l">&lt;</span>${car.map(x => `<div class="rxct ${x.id === a.id ? 'on' : ''}">${foto(x)}<b>${esc((x.apelido || x.nome).split(' ')[0])}</b></div>`).join('')}<span class="rxar r">&gt;</span></div>
  </div></div></div>`;
};

/* ================= RELATÓRIO DE MATURAÇÃO BIOLÓGICA · A4 DEITADO ================= */
const MR_ORDEM = ['Adiantado (Pós-PHV)', 'Normal (Pós-PHV)', 'Normal (PHV / Pré-PHV)', 'Atrasado (Pré-PHV)', 'Muito Atrasado (Pré-PHV)', 'Sem classificação'];
function mrAss() { return (typeof capaCfg === 'function' ? capaCfg().responsavel : null) || ((S.config.profissionais || [])[0]?.nome ? `${S.config.profissionais[0].nome}${S.config.profissionais[0].funcao ? ' - ' + S.config.profissionais[0].funcao : ''}` : 'Departamento de Performance'); }
function mrDados(cat, f = {}) {
  const ats = S.atletas.filter(a => a.categoria === cat && (!f.sub || a.subcategoria === f.sub) && (!f.poss || !f.poss.size || f.poss.has(a.posicao))).sort((a, b) => a.nome.localeCompare(b.nome));
  const rows = ats.map(a => { const m = matDe(a.id).slice(-1)[0], c = m ? calcMat(m) : null, ok = c && c.mo != null; return { a, m, c, ok, ida: idadeDec(a.nascimento, m?.data || todayISO()), st: matStatus(ok ? c.mo : null) }; });
  const av = rows.filter(r => r.ok), datas = av.map(r => r.m.data).sort();
  const lbl = String(f.sub || cat || '').toUpperCase().replace(/SUB\s/, 'SUB-'), posTxt = f.poss && f.poss.size && f.poss.size < POS.length ? [...f.poss].map(p => POSN[p] + 's').join(', ').toUpperCase() : '';
  return { cat, lbl, posTxt, ats, rows, av, data: datas[datas.length - 1] || todayISO(), mIda: mean(rows.map(r => r.ida)), mBio: mean(av.map(r => r.c.ida + r.c.mo)), mMo: mean(av.map(r => r.c.mo)) };
}
const mrCatTxt = cat => 'CATEGORIA ' + String(cat || '').toUpperCase().replace(' ', '-');
function mrCapa(D) { return `<div class="a4pg mrpg mrcapa"><small>DEPARTAMENTO DE PERFORMANCE DE BASE</small><div class="mrc-m"><h1>AVALIAÇÃO MATURACIONAL</h1><b>${esc(mrAss().toUpperCase())}</b><span>${esc(D.lbl)}${D.posTxt ? ' · ' + esc(D.posTxt) : ''}</span></div><img src="${LOGO}" alt=""><em>${D.data.slice(0, 2)}<br>${D.data.slice(2, 4)}</em></div>`; }
function mrHead(D) { return `<div class="mrh"><div class="mrh-l"><img src="${LOGO}" alt=""><b>PORTO<br>VITÓRIA</b><span>DEPARTAMENTO DE<br>PERFORMANCE</span></div><div class="mrh-c"><h2>RELATÓRIO DE MATURAÇÃO BIOLÓGICA<br>CATEGORIA ${esc(D.lbl)}${D.posTxt ? ' · ' + esc(D.posTxt) : ''}</h2><small>AVALIAÇÃO REALIZADA EM ${fmtD(D.data)}</small></div><div class="mrh-r">MAIS QUE UM CLUBE,<br><b>UMA IDENTIDADE.</b></div></div>`; }
function mrKpis(D) { const k = (t, v, s) => `<div><small>${t}</small><b>${v}</b><span>${s}</span></div>`; return `<div class="mrk">${k('ATLETAS AVALIADOS', D.av.length, `de ${D.ats.length} atletas`)}${k('IDADE CRONOLÓGICA MÉDIA', D.mIda != null ? nf(D.mIda, 1) + ' anos' : '—', 'da avaliação')}${k('IDADE BIOLÓGICA MÉDIA', D.mBio != null ? nf(D.mBio, 1) + ' anos' : '—', 'da avaliação')}${k('DESVIO MÉDIO (PHV)', D.mMo != null ? (D.mMo >= 0 ? '+' : '') + nf(D.mMo, 1) + ' anos' : '—', 'média do grupo')}${k('CATEGORIA', D.lbl, D.posTxt ? D.posTxt.toLowerCase() : `${D.ats.length} atletas no elenco`)}</div>`; }
const mrFoot = (p, t) => `<div class="mrf"><span>PORTO VITÓRIA — DEPARTAMENTO DE PERFORMANCE</span><span>Página ${p} de ${t}</span><span>Relatório gerado pelo sistema</span></div>`;
function mrTabela(D, rows, ini) {
  return `<table class="mrt"><thead><tr><th>FOTO</th><th class="l">ATLETA</th><th>POS</th><th>IDADE CRONOLÓGICA</th><th>IDADE BIOLÓGICA</th><th>IDADE ESTIMADA PHV</th><th>DESVIO PHV</th><th>STATUS</th></tr></thead><tbody>${rows.map(r => `<tr><td class="mrfo">${r.a.foto ? `<img src="${esc(r.a.foto)}" alt="">` : ''}</td><td class="l">${esc(r.a.nome)}</td><td>${esc(r.a.posicao || '—')}</td><td>${r.ida != null ? nf(r.ida, 1) : '—'}</td><td>${r.ok ? nf(r.c.ida + r.c.mo, 1) : '—'}</td><td>${r.ok ? nf(r.c.aphv, 1) : '—'}</td><td style="color:${r.ok ? (r.c.mo < 0 ? '#16833a' : '#7a3fd1') : '#6b7a72'}">${r.ok ? (r.c.mo > 0 ? '+' : '') + nf(r.c.mo, 1) : '—'}</td><td><span class="mrs" style="background:${r.st[1]}">${r.st[3]}</span></td></tr>`).join('')}</tbody></table>`;
}
function mrFinal(D) {
  const cnt = MR_ORDEM.map(s => ({ s, n: D.rows.filter(r => r.st[3] === s).length, c: matStatus(s === 'Adiantado (Pós-PHV)' ? 2 : s === 'Normal (Pós-PHV)' ? .5 : s === 'Normal (PHV / Pré-PHV)' ? -.5 : s === 'Atrasado (Pré-PHV)' ? -1.2 : s === 'Muito Atrasado (Pré-PHV)' ? -2 : null)[1] }));
  const bins = [['≤ −1,5', -99, -1.5, '#e0342b'], ['−1,5 a −1,0', -1.5, -1, '#f39324'], ['−1,0 a −0,5', -1, -0.5, '#f6c21c'], ['−0,5 a 0', -0.5, 0, '#159aa8'], ['0 a +0,5', 0, 0.5, '#2f6fd6'], ['> +0,5', 0.5, 99, '#7a3fd1']].map(b => ({ l: b[0], v: D.av.filter(r => r.c.mo > b[1] && r.c.mo <= b[2]).length, c: b[3] }));
  const mx = Math.max(1, ...bins.map(b => b.v));
  const bars = `<svg viewBox="0 0 480 200" width="480" height="200">${bins.map((b, i) => { const x = 30 + i * 74, h = b.v / mx * 140; return `<rect x="${x}" y="${170 - h}" width="50" height="${h}" rx="4" fill="${b.c}"/><text x="${x + 25}" y="${164 - h}" text-anchor="middle" font-size="14" font-weight="800" fill="#14201a">${b.v}</text><text x="${x + 25}" y="190" text-anchor="middle" font-size="11" fill="#4b5a52">${b.l}</text>`; }).join('')}<line x1="20" x2="470" y1="170" y2="170" stroke="#cfd8d3"/></svg>`;
  const tot = D.rows.length || 1; let off = 0; const r = 52, C = 2 * Math.PI * r;
  const donut = `<svg viewBox="0 0 140 140" width="140" height="140">${cnt.filter(x => x.n).map(x => { const len = x.n / tot * C, el = `<circle cx="70" cy="70" r="${r}" fill="none" stroke="${x.c}" stroke-width="22" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}" transform="rotate(-90 70 70)"/>`; off += len; return el; }).join('')}<text x="70" y="70" text-anchor="middle" font-size="26" font-weight="800" fill="#14201a">${D.av.length}</text><text x="70" y="88" text-anchor="middle" font-size="10" fill="#4b5a52">AVALIADOS</text></svg>`;
  const pico = D.av.filter(r => r.c.mo > -1 && r.c.mo <= 1), pre = D.av.filter(r => r.c.mo <= -1), pos = D.av.filter(r => r.c.mo > 1);
  const nomes = l => l.length ? l.map(r => esc(r.a.apelido || r.a.nome.split(' ').slice(0, 2).join(' '))).join(', ') : 'nenhum atleta';
  const p1 = `<div class="a4pg mrpg">${mrHead(D)}<div class="mrfin">
    <div class="mrbox"><h4>Distribuição por status de maturação</h4><div class="mrdist">${donut}<ul>${cnt.map(x => `<li><i style="background:${x.c}"></i>${x.s === 'Sem classificação' ? 'Não avaliados' : x.s} — <b>${x.n}</b></li>`).join('')}</ul></div></div>
    <div class="mrbox"><h4>Como entender a maturação</h4><p><b>PHV (pico de velocidade de crescimento):</b> é o período em que a velocidade de crescimento em estatura atinge seu pico. A avaliação ajuda a identificar em que momento do processo maturacional o atleta se encontra.</p><p><b>Importante:</b> os termos “adiantado”, “normal”, “atrasado” e “muito atrasado” descrevem o momento da maturação em relação ao esperado para a idade cronológica. Não são notas de qualidade, talento ou desempenho.</p><p><b>Para a comissão:</b> atletas mais adiantados podem apresentar vantagens físicas temporárias, enquanto atletas pré-PHV ou mais atrasados ainda podem ter crescimento e mudanças corporais pela frente. Isso não determina quem será mais alto, mais forte ou melhor jogador no futuro.</p></div>
    <div class="mrbox"><h4>Distribuição por desvio (PHV)</h4>${bars}</div>
    <div class="mrbox"><h4>Como ler o desvio / maturação</h4><p><b>Desvio negativo:</b> o atleta ainda está antes do PHV estimado; o pico de crescimento ainda está à frente.</p><p><b>Próximo de 0:</b> o atleta está próximo do período estimado do PHV.</p><p><b>Desvio positivo:</b> o atleta já passou do PHV estimado; quanto maior o valor, maior o tempo desde esse pico.</p><p><b>Idade estimada no PHV:</b> indica aproximadamente em que idade ocorreu ou ocorrerá o pico, conforme o método utilizado (Mirwald et al., 2002).</p></div>
  </div>${mrFoot('__P__', '__T__')}</div>`;
  const st = [['ADIANTADO (PÓS-PHV)', '#7a3fd1', 'O atleta já passou pelo pico de crescimento e está mais avançado no processo maturacional. Pode apresentar desenvolvimento físico temporariamente à frente de colegas da mesma idade cronológica.'], ['NORMAL (PÓS-PHV)', '#2f6fd6', 'O atleta já passou pelo PHV dentro de uma faixa esperada para o processo maturacional.'], ['NORMAL (PHV / PRÉ-PHV)', '#159aa8', 'O atleta está próximo do PHV ou ainda antes dele, dentro de uma faixa considerada esperada.'], ['ATRASADO (PRÉ-PHV)', '#f39324', 'O atleta ainda está antes do PHV e seu desenvolvimento maturacional está mais atrasado em relação ao padrão esperado para a idade cronológica. Ainda há mudanças de crescimento e desenvolvimento pela frente.'], ['MUITO ATRASADO (PRÉ-PHV)', '#e0342b', 'O atleta apresenta um atraso maturacional mais acentuado e ainda está antes do PHV. Pode haver maior período de desenvolvimento pela frente, mas o resultado não permite prever sozinho a estatura adulta ou o desempenho futuro.']];
  const p2 = `<div class="a4pg mrpg">${mrHead(D)}<div class="mrfin2">
    <div class="mrbox"><h4>Como interpretar os status</h4>${st.map(([t, c, d]) => `<div class="mrst"><b style="background:${c}">${t}</b><p>${d}</p></div>`).join('')}</div>
    <div class="mrbox"><h4>Recomendações para a comissão</h4>
      <div class="mrrec"><b style="color:#e0342b">Antes do PHV (${pre.length})</b><p>Priorizar coordenação, técnica, velocidade e agilidade, força com o peso do corpo e jogos variados. Não comparar desempenho físico com colegas mais maduros; avaliar pelo progresso individual.</p><small>${nomes(pre)}</small></div>
      <div class="mrrec"><b style="color:#159aa8">No período do PHV (${pico.length})</b><p>Fase de crescimento rápido: controlar o volume de saltos, sprints e impacto, reforçar mobilidade e controle motor e acompanhar dores em joelho (Osgood-Schlatter), calcanhar (Sever) e coluna junto ao DM. Repetir a medição a cada 3 meses.</p><small>${nomes(pico)}</small></div>
      <div class="mrrec"><b style="color:#7a3fd1">Depois do PHV (${pos.length})</b><p>Janela favorável para progressão de força e potência com técnica adequada. Atenção para não superestimar o talento por vantagens físicas temporárias.</p><small>${nomes(pos)}</small></div>
      <div class="mrrec"><b>Bio-banding</b><p>Quando possível, organizar parte dos treinos e jogos por maturação (e não só por idade) para equilibrar o confronto físico e dar oportunidade técnica a todos.</p></div></div>
  </div><div class="mrnote"><p>A maturação biológica deve ser usada para contextualizar o desenvolvimento do atleta e não para classificá-lo como melhor ou pior. Dois atletas com a mesma idade cronológica podem estar em momentos maturacionais diferentes e, por isso, apresentar diferenças temporárias de estatura, massa corporal e capacidades físicas.</p><p><b>Atenção:</b> “adiantado”, “atrasado” e “muito atrasado” não significam bom ou ruim e não determinam, isoladamente, a estatura adulta, o potencial esportivo ou o desempenho futuro. A interpretação deve considerar avaliações seriadas, o crescimento ao longo do tempo e o contexto individual.</p></div>${mrFoot('__P__', '__T__')}</div>`;
  return [p1, p2];
}
function relMatHTML(cat, f = UI.mrF || {}) {
  const D = mrDados(cat, f), N = 20, pags = [mrCapa(D)];
  for (let i = 0; i < Math.max(1, D.rows.length); i += N) pags.push(`<div class="a4pg mrpg">${mrHead(D)}${i === 0 ? mrKpis(D) : ''}${mrTabela(D, D.rows.slice(i, i + N), i)}${mrFoot('__P__', '__T__')}</div>`);
  pags.push(...mrFinal(D));
  return pags.map((h, i) => h.replace('__P__', i + 1).replace('__T__', pags.length)).join('');
}
UI.mrF = { cat: null, sub: '', poss: new Set() };
function mrFiltrosHTML(cats) { const f = UI.mrF, cat = f.cat || (F.categoria !== 'Todas' ? F.categoria : cats[0]); f.cat = cat; const subs = GRUPOS[cat] || []; return `<div class="mrfil"><label>Categoria <select data-mrf="cat">${opts(cats, cat)}</select></label>${subs.length > 1 ? `<label>Subcategoria <select data-mrf="sub"><option value="">Todas (${subs.join(' e ')})</option>${subs.map(s => `<option ${f.sub === s ? 'selected' : ''}>${s}</option>`).join('')}</select></label>` : ''}<div class="mrpos"><span>Posições</span><button type="button" class="${!f.poss.size ? 'on' : ''}" data-mrp="">Todas</button>${POS.map(p => `<button type="button" class="${f.poss.has(p) ? 'on' : ''}" data-mrp="${p}">${POSN[p]}s</button>`).join('')}</div></div>`; }
function abrirRelMat() {
  const cats = Object.keys(GRUPOS).filter(c => S.atletas.some(a => a.categoria === c));
  const draw = () => { const f = UI.mrF, D = mrDados(f.cat || cats[0], f); $('#mrBody').innerHTML = mrFiltrosHTML(cats) + `<div class="form" style="grid-template-columns:1fr"><div class="f"><label for="mrA">Responsável na capa</label><input id="mrA" value="${esc(mrAss())}"></div></div><p class="muted" style="margin:0;font-size:12.5px"><b>${D.ats.length}</b> atleta(s) no filtro · <b>${D.av.length}</b> com medição · ${Math.ceil(Math.max(1, D.rows.length) / 20)} folha(s) de tabela (20 por folha) + capa + 2 folhas de interpretação.</p>`; };
  openModal(mh('Relatório de maturação biológica (A4 deitado)') + `<div class="mb" id="mrBody"></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn" id="mrImp">${IC.print} Imprimir</button><button class="btn pri" id="mrPdf">${IC.pdf} Baixar PDF</button></div>`);
  draw(); $('#mrBody').addEventListener('change', e => { if (e.target.dataset.mrf) { UI.mrF[e.target.dataset.mrf] = e.target.value; if (e.target.dataset.mrf === 'cat') UI.mrF.sub = ''; draw(); } });
  $('#mrBody').addEventListener('click', e => { const b = e.target.closest('[data-mrp]'); if (!b) return; const p = b.dataset.mrp, s = UI.mrF.poss; if (!p) s.clear(); else s.has(p) ? s.delete(p) : s.add(p); draw(); });
  const go2 = pdf => { const as = $('#mrA').value.trim(); if (as && as !== mrAss()) { S.config.capa = { ...(S.config.capa || {}), responsavel: as }; putConfig(); } const f = UI.mrF; closeModal(); imprimirA4(relMatHTML(f.cat, f), `Maturacao-Biologica-${(f.sub || f.cat).replace(/\s/g, '')}${f.poss.size ? '-' + [...f.poss].join('-') : ''}-${todayISO()}.pdf`, true, pdf, 0); };
  $('#mrImp').onclick = () => go2(false); $('#mrPdf').onclick = () => go2(true);
}
const _fMatDashR = fMatDash;
fMatDash = function () { return _fMatDashR().replace(`<button class="btn pri" data-act="mat-nova">`, `<button class="btn" data-act="mr-rel">${IC.pdf} Relatório A4 (capa + tabela)</button><button class="btn pri" data-act="mat-nova">`); };
const _fAvRelM = fAvRel;
fAvRel = function () { return _fAvRelM().replace('<h5 class="arh">Relatório individual', `<label class="arck" data-act="mr-rel" style="border-color:#f2b81b;background:#fffbe9"><span style="font-size:20px">📄</span><span><b>Relatório de maturação biológica · A4 deitado</b><small>Capa, tabela de 20 em 20 atletas e interpretação para a comissão — clique para gerar</small></span></label><h5 class="arh">Relatório individual`); };
dmOn('click', e => { const t = e.target.closest('[data-act="mr-rel"]'); if (t) { e.preventDefault(); abrirRelMat(); } });

/* ================= RELATÓRIOS EM PDF COM PRÉVIA (todas as áreas) + CAPA CONFIGURÁVEL ================= */
// Avaliação física: "Relatórios em PDF" vai para depois de Maturação
{ const i = AV_TABS.findIndex(x => x[0] === 'av-rel'); if (i >= 0) { const [t] = AV_TABS.splice(i, 1); AV_TABS.push(t); } }
DM_TABS.push(['dm-rel', 'Relatórios em PDF']); TITLES['dm-rel'] = ['Fisio / DM', 'Relatórios em PDF']; DM_TITLE['dm-rel'] = 'RELATÓRIOS EM PDF';
NUT_TABS.push(['nut-rel', 'Relatórios em PDF']); TITLES['nut-rel'] = ['Nutrição', 'Relatórios em PDF']; NUT_TITLE['nut-rel'] = 'RELATÓRIOS EM PDF';
{ const i = MON_TABS.findIndex(x => x[0] === 'mon-pse-rel'); if (i >= 0) MON_TABS[i][1] = 'Relatórios em PDF'; TITLES['mon-pse-rel'] = ['Monitoramento', 'Relatórios em PDF']; }

/* ---------- capa (editável em Configurações → Geral) ---------- */
const CAPA_DEF = { depto: 'DEPARTAMENTO DE PERFORMANCE DE BASE', responsavel: 'IGOR SATHLER - FISIOLOGISTA', slogan: 'MAIS QUE UM CLUBE, UMA IDENTIDADE.', titulos: { dm: 'DEPARTAMENTO MÉDICO', nut: 'AVALIAÇÃO NUTRICIONAL', av: 'AVALIAÇÃO FÍSICA', mat: 'AVALIAÇÃO MATURACIONAL', mon: 'MONITORAMENTO DE CARGA' } };
function capaCfg() { const c = S.config.capa || {}; const p0 = (S.config.profissionais || []).find(p => p.nome); return { depto: c.depto || CAPA_DEF.depto, responsavel: c.responsavel || CAPA_DEF.responsavel, slogan: c.slogan || CAPA_DEF.slogan, titulos: { ...CAPA_DEF.titulos, ...(c.titulos || {}) } }; }
function capaGeral(mod, extra) {
  const c = capaCfg(), ano = anoLabel() === 'TODAS' ? todayISO().slice(0, 4) : String(anoLabel());
  return `<div class="sheet"><div class="pdfpage fixed rxpg"><div class="cvx"><small>${esc(c.depto)}</small><div class="cvm"><h1>${esc(c.titulos[mod] || mod)}</h1><b>${esc(c.responsavel.toUpperCase())}</b><span>${esc(extra || catLabel().toUpperCase().replace(/SUB\s/g, 'SUB-'))}</span></div><img src="${LOGO}" alt=""><em>${ano.slice(0, 2)}<br>${ano.slice(2, 4)}</em><i>${esc(c.slogan)}</i></div></div></div>`;
}
capaAv = function () { return capaGeral('av'); };

// maturação: páginas em lista (para a prévia) e capa com o título editável
function relMatPages(cat, f) { const tmp = document.createElement('div'); tmp.innerHTML = relMatHTML(cat, f); const t = capaCfg().titulos.mat; tmp.querySelectorAll('.mrcapa h1').forEach(h => h.textContent = t); tmp.querySelectorAll('.mrcapa>small').forEach(s => s.textContent = capaCfg().depto); return [...tmp.children].map(e => e.outerHTML); }

/* ---------- componente: seções + prévia ---------- */
UI.rb = {}; UI.rbPages = []; UI.rbFmt = '169';
const RB = {
  dm: { titulo: 'Fisio / DM', secs: [['capa', 'Capa', 'Título, responsável, categoria e ano', () => [capaGeral('dm')]], ['dash', 'Dashboard do DM', 'Quem está no DM, indicadores e mapa da temporada', () => [pageWrap(renderAs('dashboard'))]], ['visao', 'Visão geral', 'Evolução, regiões, status do elenco', () => [pageWrap(renderAs('dm-visao'))]], ['les', 'Atletas no DM', 'Lista com previsão de retorno', () => [pageWrap(pLesionados())]], ['reg', 'Regiões', 'Mapa de calor e ranking de regiões', () => [pageWrap(renderAs('dm-regioes'))]], ['tempo', 'Tempo de afastamento', 'Dias fora por lesão e atleta', () => [pageWrap(renderAs('dm-tempo'))]], ['comp', 'Comparativo', 'Entre categorias e temporadas', () => [pageWrap(renderAs('dm-comparativo'))]]], ind: ['Relatório individual (DM)', a => pIndividual(a), () => atletasCat().filter(a => S.lesoes.some(l => l.atletaId === a.id))] },
  nut: { titulo: 'Nutrição', secs: [['capa', 'Capa', 'Título, responsável, categoria e ano', () => [capaGeral('nut')]], ['dash', 'Dashboard', 'Faixas de gordura, médias e fora da faixa', () => [pageWrap(renderAs('nut-dash'))]], ['comp', 'Composição corporal', 'Última avaliação de cada atleta', () => [pageWrap(renderAs('nut-comp'))]], ['cmp', 'Comparativo', 'Categorias, posições e evolução', () => [pageWrap(renderAs('nut-comparativo'))]], ['hid', 'Hidratação', 'Sessões, perda de peso e sudorese', () => [pageWrap(renderAs('nut-hidra'))]], ['ener', 'Necessidades energéticas', 'Calorias, macronutrientes e estratégia de jogo', () => [pageWrap(renderAs('nut-energia'))]]], ind: ['Relatório individual nutricional', a => pNutInd(a), () => atletasCat().filter(a => avsDe(a.id).length)] },
  mon: { titulo: 'Monitoramento', secs: [['capa', 'Capa', 'Título, responsável, categoria e ano', () => [capaGeral('mon')]], ['be', 'Bem-estar · relatório do dia', `Dia ${fmtD(UI.monDia)} · ${UI.bePorPag || 20} atletas por folha`, () => beRelPaginas().map(h => `<div class="sheet"><div class="pdfpage fixed bepg"><div class="report">${h}</div></div></div>`)], ['pdia', 'PSE · report diário', `Dia ${fmtD(UI.pseDia)}`, () => repDia()], ['psem', 'PSE · report semanal', `Semana de ${fmtD(UI.week || segunda(todayISO()))}`, () => repSem()], ['micro', 'Microciclo da semana', 'Calendário com programado x realizado', () => repMicro()]] }
};
function rbState(mod) { if (!UI.rb[mod]) UI.rb[mod] = { sel: new Set(RB[mod].secs.map(s => s[0])), ind: new Set() }; return UI.rb[mod]; }
function rbPages(mod) { const st = rbState(mod), M = RB[mod], v0 = S.view, out = []; PRINT = true; try { M.secs.forEach(([k, , , fn]) => { if (st.sel.has(k)) { try { out.push(...fn()); } catch (e) { console.warn(e); } } }); if (M.ind) [...st.ind].forEach(id => { const a = atl(id); if (a) { try { out.push(...M.ind[1](a)); } catch (e) { } } }); } finally { PRINT = false; S.view = v0; } return out; }
function rbPreview(pages, a4) { UI.rbPages = pages; UI.rbFmt = a4 ? 'a4' : '169'; if (!pages.length) return miniEmpty('Nada selecionado', 'Marque ao menos uma parte do relatório.'); const N = 24; return `<div class="rbgrid">${pages.slice(0, N).map((p, i) => `<div class="rbthumb ${a4 ? 'a4' : ''}" data-act="rb-zoom" data-i="${i}" role="button" tabindex="0" aria-label="Ver página ${i + 1}"><div class="rbsc">${p}</div><span>${i + 1}</span></div>`).join('')}</div>${pages.length > N ? `<p class="muted" style="font-size:12px;margin:8px 0 0">Mostrando ${N} de ${pages.length} páginas.</p>` : ''}`; }
function rbUI(mod) {
  const st = rbState(mod), M = RB[mod], pages = rbPages(mod), pool = M.ind ? M.ind[2]().sort((a, b) => a.nome.localeCompare(b.nome)) : [];
  return `<div class="row r12" style="align-items:start">
    <div class="panel"><div class="ph">Montar o relatório<span class="r">${pages.length} folha(s) 16:9</span></div><div class="pb">
      ${M.secs.map(([k, t, d]) => `<label class="arck"><input type="checkbox" data-rb="${mod}" data-k="${k}" ${st.sel.has(k) ? 'checked' : ''}><span><b>${t}</b><small>${d}</small></span></label>`).join('')}
      ${M.ind ? `<h5 class="arh">${M.ind[0]} <small>(uma ou mais folhas por atleta)</small></h5><div class="arind"><label class="arall"><input type="checkbox" data-rball="${mod}" ${pool.length && pool.every(a => st.ind.has(a.id)) ? 'checked' : ''}> Selecionar todos (${pool.length})</label>${pool.map(a => `<label class="${st.ind.has(a.id) ? 'on' : ''}"><input type="checkbox" data-rbi="${mod}" data-id="${a.id}" ${st.ind.has(a.id) ? 'checked' : ''}>${fotoBox(a, 'mini')}<span><b>${esc(a.apelido || a.nome)}</b><small>${esc(a.posicao)}</small></span></label>`).join('') || '<span class="muted">Nenhum atleta com dados.</span>'}</div>` : ''}
      <div class="arbtn"><button class="btn" data-act="rb-go" data-m="${mod}" data-pdf="0" ${pages.length ? '' : 'disabled'}>${IC.print} Imprimir</button><button class="btn pri" data-act="rb-go" data-m="${mod}" data-pdf="1" ${pages.length ? '' : 'disabled'}>${IC.pdf} Baixar PDF</button><button class="btn sm" data-nav="config-geral">Editar capa</button></div>
    </div></div>
    ${panel(`Prévia · ${pages.length} folha(s) <span class="r" style="font-size:12px">clique numa folha para ampliar</span>`, rbPreview(pages))}
  </div>`;
}
function rbHeader(titulo, sub, tabs) { return header({ title: titulo, sub, items: hdrItems() }) + `<nav class="rtabs">${tabs.map(([k, n]) => `<button data-go="${k}" class="${S.view === k ? 'on' : ''}">${n}</button>`).join('')}</nav>`; }
const _vDMr = vDM; vDM = function () { if (S.view !== 'dm-rel' || PRINT) return _vDMr(); return rbHeader('RELATÓRIOS EM PDF', 'FISIOTERAPIA · DEPARTAMENTO MÉDICO', DM_TABS) + rbUI('dm'); };
const _vNutR = vNut; vNut = function () { if (S.view !== 'nut-rel' || PRINT) return _vNutR(); return rbHeader('RELATÓRIOS EM PDF', 'NUTRIÇÃO ESPORTIVA', NUT_TABS) + rbUI('nut'); };
fPseRel = function () { return rbUI('mon'); };
// avaliação física: prévia das folhas e do relatório de maturação A4
UI.mrPrevCat = null;
const _fAvRelP = fAvRel;
fAvRel = function () {
  const h = _fAvRelP(), pages = paginasAv(UI.ar); const cats = Object.keys(GRUPOS).filter(c => S.atletas.some(a => a.categoria === c && matDe(a.id).length)); const mc = UI.mrPrevCat || (F.categoria !== 'Todas' ? F.categoria : cats[0]);
  const prev = panel(`Prévia do relatório · ${pages.length} folha(s) <span class="r" style="font-size:12px">clique para ampliar</span>`, rbPreview(pages));
  if (!UI.mrF.cat || !cats.includes(UI.mrF.cat)) UI.mrF.cat = mc;
  const mat = cats.length ? panel(`Prévia · relatório de maturação (A4 deitado)`, `<div class="mrprevf">${mrFiltrosHTML(cats)}<button class="btn sm pri" data-act="mr-rel">${IC.pdf} Gerar este relatório</button></div><div data-a4prev="1">${(() => { const p = relMatPages(UI.mrF.cat, UI.mrF); return `<div class="rbgrid">${p.map((x, i) => `<div class="rbthumb a4" data-act="rb-zoom-a4" data-i="${i}" role="button" tabindex="0"><div class="rbsc">${x}</div><span>${i + 1}</span></div>`).join('')}</div>`; })()}</div>`) : '';
  return h.replace('<div class="row r21" style="align-items:start">', '<div class="row r12" style="align-items:start">').replace('<!--RBPREV-->', prev + mat);
};
UI.mrPages = [];
const _relMatPages = relMatPages; relMatPages = function (cat, f) { const p = _relMatPages(cat, f); UI.mrPages = p; return p; };

/* ---------- ampliar uma folha ---------- */
function rbZoom(pages, i, a4) {
  if (!pages[i]) return; openModal(mh(`Página ${i + 1} de ${pages.length}`) + `<div class="mb"><div class="rbzoom ${a4 ? 'a4' : ''}"><div class="rbzs">${pages[i]}</div></div></div><div class="mf"><button class="btn" data-act="${a4 ? 'rb-zoom-a4' : 'rb-zoom'}" data-i="${Math.max(0, i - 1)}" ${i ? '' : 'disabled'}>‹ Anterior</button><span style="flex:1"></span><button class="btn" data-act="close">Fechar</button><button class="btn" data-act="${a4 ? 'rb-zoom-a4' : 'rb-zoom'}" data-i="${Math.min(pages.length - 1, i + 1)}" ${i < pages.length - 1 ? '' : 'disabled'}>Próxima ›</button></div>`, true);
  $('#modal').classList.add('fx'); requestAnimationFrame(() => window.rbFit && window.rbFit());
}
dmOn('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'rb-zoom') rbZoom(UI.rbPages, +t.dataset.i, false);
  if (t.dataset.act === 'rb-zoom-a4') rbZoom(UI.mrPages, +t.dataset.i, true);
  if (t.dataset.act === 'rb-go') { const p = rbPages(t.dataset.m); if (!p.length) return; if (t.dataset.pdf === '1') gerarPDF(p, 'relatorio-' + t.dataset.m); else imprimir(p); }
});
dmOn('change', e => {
  const t = e.target;
  if (t.dataset.rb) { const st = rbState(t.dataset.rb); t.checked ? st.sel.add(t.dataset.k) : st.sel.delete(t.dataset.k); render(); }
  if (t.dataset.rbi) { const st = rbState(t.dataset.rbi); t.checked ? st.ind.add(t.dataset.id) : st.ind.delete(t.dataset.id); render(); }
  if (t.dataset.rball) { const m = t.dataset.rball, st = rbState(m); RB[m].ind[2]().forEach(a => t.checked ? st.ind.add(a.id) : st.ind.delete(a.id)); render(); }
  if (t.dataset.mrf && !t.closest('#mrBody')) { UI.mrF[t.dataset.mrf] = t.value; if (t.dataset.mrf === 'cat') UI.mrF.sub = ''; render(); }
});

dmOn('click', e => { const mp = e.target.closest('[data-mrp]'); if (mp && !mp.closest('#mrBody')) { const p = mp.dataset.mrp, s = UI.mrF.poss; if (!p) s.clear(); else s.has(p) ? s.delete(p) : s.add(p); render(); } });

/* ================= CALENDÁRIO: APAGAR / LIMPAR · PSE: EDITAR MINUTOS ================= */
// eventos do calendário com referência para apagar
const _eventosDia2 = eventosDia;
eventosDia = function (d) { const ev = _eventosDia2(d); const ags = (S.config.agenda || []).filter(x => x.data === d); ev.forEach(e => { if (e.k === 'aval' && e.info === 'agendado') { const a = ags.find(x => x.teste === e.t && x.categoria === e.c); if (a) e.ag = a.id; } }); return ev; };
const _vCal2 = vCal;
vCal = function () {
  let h = _vCal2(); const ev = eventosDia(UI.calDia);
  // botão de apagar em cada evento do dia selecionado
  ev.forEach(e => { if (e.s) h = h.replace(`data-act="cal-edit" data-id="${e.s.id}"><i></i>`, `data-act="cal-edit" data-id="${e.s.id}"><i></i><button class="caldel" data-act="cal-del" data-id="${e.s.id}" title="Apagar" aria-label="Apagar">${IC.trash}</button>`); });
  const agEv = ev.filter(e => e.ag); agEv.forEach(e => { h = h.replace(`<b>${esc(e.t)}</b><span>agendado</span>`, `<b>${esc(e.t)}</b><span>agendado</span><button class="caldel inl" data-act="cal-delag" data-id="${e.ag}" title="Apagar agendamento">${IC.trash}</button>`); });
  const nD = ev.filter(e => e.s || e.ag).length, mes = UI.calMes;
  const cats = F.categoria === 'Todas' ? Object.keys(GRUPOS) : [F.categoria];
  const nM = (S.micro || []).filter(s => s.data.slice(0, 7) === mes && cats.includes(s.categoria)).length + (S.config.agenda || []).filter(x => x.data.slice(0, 7) === mes && cats.includes(x.categoria)).length;
  return h.replace('<div class="calbtns">', `<div class="calclean"><button class="btn sm danger" data-act="cal-clr" data-v="dia" ${nD ? '' : 'disabled'}>${IC.trash} Limpar este dia (${nD})</button><button class="btn sm danger" data-act="cal-clr" data-v="mes" ${nM ? '' : 'disabled'}>${IC.trash} Limpar o mês (${nM})</button></div><div class="calbtns">`);
};
async function calLimpar(tipo) {
  const cats = F.categoria === 'Todas' ? Object.keys(GRUPOS) : [F.categoria], ok = d => tipo === 'dia' ? d === UI.calDia : d.slice(0, 7) === UI.calMes;
  const ses = (S.micro || []).filter(s => ok(s.data) && cats.includes(s.categoria)), ags = (S.config.agenda || []).filter(x => ok(x.data) && cats.includes(x.categoria));
  for (let i = 0; i < ses.length; i += 20) await Promise.all(ses.slice(i, i + 20).map(s => remove('micro', s.id)));
  if (ags.length) { S.config.agenda = (S.config.agenda || []).filter(x => !ags.includes(x)); putConfig(); }
  render(); toast(`${ses.length} sessão(ões) e ${ags.length} agendamento(s) apagados`);
}
dmOn('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'cal-del') { e.stopPropagation(); const s = (S.micro || []).find(x => x.id === t.dataset.id); confirmar(`Apagar “${esc(s ? (s.tipo === 'jogo' ? 'Jogo' + (s.adversario ? ' x ' + s.adversario : '') : s.titulo || (SESS[s.tipo] || ['Sessão'])[0]) : 'evento')}” de ${fmtD(UI.calDia)}?`, () => { remove('micro', t.dataset.id); toast('Evento apagado'); }); }
  if (t.dataset.act === 'cal-delag') { e.stopPropagation(); confirmar('Apagar este teste agendado?', () => { S.config.agenda = (S.config.agenda || []).filter(x => x.id !== t.dataset.id); putConfig(); render(); toast('Agendamento apagado'); }); }
  if (t.dataset.act === 'cal-clr') { const dia = t.dataset.v === 'dia'; confirmar(dia ? `Apagar todas as sessões e testes agendados de ${fmtD(UI.calDia)}${F.categoria !== 'Todas' ? ' (' + F.categoria + ')' : ''}?` : `Apagar todas as sessões do microciclo e testes agendados do mês${F.categoria !== 'Todas' ? ' (' + F.categoria + ')' : ' (todas as categorias)'}? Jogos da Minutagem, avaliações realizadas e lesões não são apagados.`, () => calLimpar(t.dataset.v)); }
});

/* ---------- PSE: editar PSE e minutos de cada atleta ---------- */
function editarPseDia(aid) {
  const d = UI.pseDia, ats = atletasCat().sort((a, b) => a.nome.localeCompare(b.nome));
  let L = (S.pse || []).filter(r => r.data === d && (!aid || r.atletaId === aid) && ats.some(a => a.id === r.atletaId)).map(r => ({ ...r }));
  const del = new Set();
  const sessOpts = cur => ['Treino', 'Jogo', 'Treino físico', 'Recuperação', ...(cur && !['Treino', 'Jogo', 'Treino físico', 'Recuperação'].includes(cur) ? [cur] : [])].map(o => `<option ${o === cur ? 'selected' : ''}>${o}</option>`).join('');
  const jogoMin = id => { const j = (window.MIN?.S.jogos || []).find(x => x.data === d && (x.relacionados || []).some(r => r.atletaId === id)); const r = j && j.relacionados.find(x => x.atletaId === id); return r ? +r.min || 0 : null; };
  openModal(mh(aid ? `Editar PSE · ${esc(atl(aid)?.nome || '')} · ${fmtD(d)}` : `Editar PSE e minutos · ${fmtD(d)}`) + `<form id="fPe" novalidate><div class="mb"><p class="muted" style="margin:0;font-size:12.5px">Corrija a PSE, os minutos ou a sessão de cada atleta. A carga (UA = PSE × minutos) é recalculada na hora. Em jogo, o botão ⟲ puxa os minutos da Minutagem.</p>
    <div class="tbl-wrap" style="max-height:460px;overflow:auto;border:1px solid var(--line);border-radius:8px"><table class="t hidin"><thead><tr><th class="l">Atleta</th><th>Sessão</th><th>PSE (0–10)</th><th>Minutos</th><th>UA</th><th>Origem</th><th></th></tr></thead><tbody id="peRows"></tbody></table></div>
    ${!aid ? `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><select id="peAdd" class="search" style="min-width:0"><option value="">+ Adicionar atleta sem registro…</option>${ats.filter(a => !L.some(r => r.atletaId === a.id)).map(a => `<option value="${a.id}">${esc(a.nome)}</option>`).join('')}</select><label class="muted" style="font-size:12.5px;display:flex;gap:6px;align-items:center">Aplicar minutos a todos <input type="text" inputmode="numeric" id="peAll" style="width:70px;border:1px solid var(--line);border-radius:6px;padding:5px 8px"><button type="button" class="btn sm" id="peAllOk">Aplicar</button></label></div>` : `<button type="button" class="btn sm" id="peNovo" style="align-self:flex-start">${IC.plus} Adicionar outra sessão</button>`}
  </div><div class="mf"><span class="msg" id="peErr"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar alterações</button></div></form>`, true);
  const draw = () => { $('#peRows').innerHTML = L.map((r, i) => { const a = atl(r.atletaId), x = del.has(i); return `<tr data-i="${i}" class="${x ? 'pedel' : ''}"><td class="l">${a ? athCell(a) : '—'}</td><td><select data-f="sessao">${sessOpts(r.sessao || 'Treino')}</select></td><td><select data-f="pse">${PSE_ESC.map((e, k) => `<option value="${k}" ${+r.pse === k ? 'selected' : ''}>${k} · ${e}</option>`).join('')}</select></td><td style="white-space:nowrap"><input type="text" inputmode="numeric" data-f="duracao" value="${esc(r.duracao ?? '')}" style="width:70px">${(r.sessao === 'Jogo' && jogoMin(r.atletaId) != null) ? `<button type="button" class="icon-btn" data-pe="jm" title="Minutos da Minutagem (${jogoMin(r.atletaId)})">⟲</button>` : ''}</td><td class="ua"><b>${(+r.pse || 0) * (+r.duracao || 0)}</b></td><td><small class="muted">${r.origem === 'app' ? 'atleta' : r.demo ? 'teste' : r.novo ? 'novo' : 'comissão'}</small></td><td><button type="button" class="icon-btn" data-pe="del" title="${x ? 'Desfazer' : 'Apagar registro'}" style="color:var(--red)">${x ? '↺' : IC.trash}</button></td></tr>`; }).join('') || '<tr><td colspan="7" class="muted">Nenhum registro neste dia.</td></tr>'; };
  draw();
  const fm = $('#fPe');
  fm.addEventListener('input', e => { const tr = e.target.closest('[data-i]'); if (!tr || !e.target.dataset.f) return; const r = L[+tr.dataset.i]; r[e.target.dataset.f] = e.target.dataset.f === 'sessao' ? e.target.value : numBR(e.target.value); tr.querySelector('.ua b').textContent = (+r.pse || 0) * (+r.duracao || 0); });
  fm.addEventListener('change', e => { const tr = e.target.closest('[data-i]'); if (tr && e.target.dataset.f === 'sessao') { L[+tr.dataset.i].sessao = e.target.value; draw(); } if (e.target.id === 'peAdd' && e.target.value) { const id = e.target.value; L.push({ atletaId: id, data: d, sessao: 'Treino', pse: 5, duracao: 75, novo: true }); e.target.querySelector(`option[value="${id}"]`).remove(); e.target.value = ''; draw(); } });
  fm.addEventListener('click', e => { const b = e.target.closest('[data-pe]'); if (b) { e.preventDefault(); const i = +b.closest('[data-i]').dataset.i; if (b.dataset.pe === 'del') del.has(i) ? del.delete(i) : del.add(i); if (b.dataset.pe === 'jm') L[i].duracao = jogoMin(L[i].atletaId); draw(); }
    if (e.target.id === 'peAllOk') { e.preventDefault(); const v = numBR($('#peAll').value); if (v > 0) { L.forEach(r => r.duracao = v); draw(); } }
    if (e.target.id === 'peNovo') { e.preventDefault(); L.push({ atletaId: aid, data: d, sessao: 'Treino', pse: 5, duracao: 60, novo: true }); draw(); } });
  fm.onsubmit = async e => {
    e.preventDefault(); const rem = [], up = [];
    L.forEach((r, i) => { if (del.has(i)) { if (r.id) rem.push(r.id); return; } if (!(+r.duracao >= 0) || r.pse === '' || r.pse == null) return; const id = `pse_${r.atletaId}_${d}_${String(r.sessao || 'Treino').replace(/\s/g, '')}`; if (r.id && r.id !== id) rem.push(r.id); const o = { ...r, id, pse: +r.pse, duracao: +r.duracao || 0, editadoEm: todayISO() }; delete o.novo; up.push(o); });
    const dup = up.map(o => o.id).filter((x, i, a) => a.indexOf(x) !== i); if (dup.length) return $('#peErr').textContent = 'Há dois registros do mesmo atleta na mesma sessão. Mude a sessão ou apague um deles.';
    for (const id of rem.filter(x => !up.some(o => o.id === x))) await remove('pse', id);
    if (up.length) await saveMany('pse', up); closeModal(); render(); toast(`${up.length} registro(s) salvo(s)${rem.length ? ' · ' + rem.length + ' apagado(s)' : ''}`);
  };
}
const _fPseE = fPse;
fPse = function () { let h = _fPseE(); h = h.replace('<button class="btn pri" data-act="pse-lancar">', `<button class="btn" data-act="pse-editar">${IC.edit} Editar PSE e minutos</button><button class="btn pri" data-act="pse-lancar">`);
  return h.replace(/<div class="pmr" data-ficha-open="([^"]+)">/g, (m, id) => `<div class="pmr" data-ficha-open="${id}"><button class="pmedit" data-act="pse-edit1" data-id="${id}" title="Editar PSE e minutos deste atleta" aria-label="Editar">${IC.edit}</button>`); };
dmOn('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'pse-editar') editarPseDia(); if (t.dataset.act === 'pse-edit1') { e.stopPropagation(); editarPseDia(t.dataset.id); } }, true);

/* ================= NUTRIÇÃO: 4 DOBRAS + AVALIAÇÕES ENERGÉTICAS ================= */
// composição corporal só com tricipital, subescapular, suprailíaca e abdominal (Faulkner); sem circunferências
['peitoral', 'axilar', 'coxa', 'panturrilha'].forEach(k => delete DOBRAS[k]);
Object.keys(CIRC).forEach(k => delete CIRC[k]);
['slaughter', 'jp3', 'jp7'].forEach(k => delete PROT[k]);
PROT.faulkner.n = 'Faulkner · 4 dobras (tricipital, subescapular, suprailíaca e abdominal)';

/* ---------- necessidades energéticas: avaliações salvas ---------- */
EXTRA_COLS.push('energia'); S.energia = [];
const FORMULAS = { cunningham: 'Cunningham (massa magra)', schofield: 'Schofield (peso e idade)', harris: 'Harris-Benedict (peso, estatura e idade)', manual: 'Gasto em repouso informado (calorimetria)' };
const enDe = id => (S.energia || []).filter(r => r.atletaId === id).sort((a, b) => a.data.localeCompare(b.data));
function enCalc(r) {
  const a = atl(r.atletaId), ida = idadeEm(a?.nascimento, r.data), p = +r.peso || 0, h = (+r.altura || 0) * 100, g = r.gordura != null && r.gordura !== '' ? +r.gordura : null, mm = g != null && p ? p * (1 - g / 100) : null;
  let tmb = null; if (r.formula === 'cunningham' && mm) tmb = 500 + 22 * mm; else if (r.formula === 'harris' && p && h) tmb = 66.5 + 13.75 * p + 5.003 * h - 6.755 * ida; else if (r.formula === 'manual') tmb = +r.tmbManual || null; else if (p) tmb = ida <= 18 ? 17.686 * p + 658.2 : 15.057 * p + 692.2;
  const get = tmb ? tmb * (+r.fa || 1.6) + (+r.extra || 0) : null, ptn = (+r.ptn || 1.6) * p, lip = get ? (+r.lipPct || 28) / 100 * get / 9 : null, cho = get ? Math.max(0, (get - ptn * 4 - lip * 9) / 4) : null;
  return { ida, mm, tmb, get, ptn, lip, cho, choKg: cho && p ? cho / p : null, agua: p * (+r.agua || 40) / 1000 };
}
const _energia = energia;
energia = function (a, tipo) {
  const r = enDe(a.id).slice(-1)[0];
  if (!r) { const e = _energia(a, tipo); return e ? { ...e, origem: 'est' } : null; }
  const c = enCalc({ ...r, fa: tipo ? DIAS[tipo][1] * ((+r.fa || 1.75) / 1.75) : r.fa });
  return { peso: +r.peso, mm: c.mm, tmb: c.tmb, met: FORMULAS[r.formula]?.split(' (')[0] || 'Avaliação', get: c.get, cho: c.cho, ptn: c.ptn, lip: c.lip, agua: c.agua, origem: 'aval', rec: r };
};
function formEnergia(r = {}, aid) {
  const ats = [...S.atletas].sort((a, b) => a.nome.localeCompare(b.nome)), sel = r.atletaId || aid || UI.nutAtl || '';
  const base = id => { const a = atl(id), v = avsDe(id).slice(-1)[0], c = v ? calcAv(v) : null; return { peso: c?.peso || a?.peso || '', altura: v?.altura || a?.altura || '', gordura: c?.g ?? a?.gordura ?? '' }; };
  const b0 = r.id ? r : { ...base(sel), formula: 'cunningham', fa: 1.75, extra: 0, ptn: 1.6, lipPct: 28, agua: 40 };
  const profs = (S.config.profissionais || []).map(p => p.nome).filter(Boolean);
  openModal(mh(r.id ? 'Editar avaliação energética' : 'Nova avaliação de necessidade energética') + `<form id="fEn" novalidate><div class="mb"><div class="form">
    <div class="f s2"><label for="enA">Atleta *</label><select id="enA" name="atletaId"><option value="">Selecione</option>${ats.map(a => `<option value="${a.id}" ${a.id === sel ? 'selected' : ''}>${esc(a.nome)} · ${esc(a.subcategoria || a.categoria)}</option>`).join('')}</select></div>
    <div class="f"><label for="enD">Data *</label><input id="enD" name="data" type="date" value="${esc(r.data || todayISO())}" max="${todayISO()}"></div>
    <div class="f"><label for="enR">Nutricionista</label><select id="enR" name="responsavel"><option value="">—</option>${opts(profs, r.responsavel)}</select></div>
    <div class="f"><label for="enP">Peso (kg) *</label><input id="enP" name="peso" inputmode="decimal" value="${esc(b0.peso ?? '')}"></div>
    <div class="f"><label for="enH">Estatura (m)</label><input id="enH" name="altura" inputmode="decimal" value="${esc(b0.altura ?? '')}"></div>
    <div class="f"><label for="enG">% gordura</label><input id="enG" name="gordura" inputmode="decimal" value="${esc(b0.gordura ?? '')}"></div>
    <div class="f"><span>Massa magra</span><b id="enMM" style="font-family:var(--fc);font-size:20px">—</b></div>
    <div class="f s2"><label for="enF">Fórmula do gasto em repouso</label><select id="enF" name="formula">${Object.entries(FORMULAS).map(([k, n]) => `<option value="${k}" ${b0.formula === k ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
    <div class="f" id="enTmbBox"><label for="enT">Gasto em repouso (kcal)</label><input id="enT" name="tmbManual" inputmode="decimal" value="${esc(r.tmbManual ?? '')}"></div>
    <div class="f"><label for="enFa">Fator de atividade</label><select id="enFa" name="fa">${[1.4, 1.5, 1.6, 1.7, 1.75, 1.8, 1.9, 1.95, 2.0, 2.2].map(v => `<option value="${v}" ${+b0.fa === v ? 'selected' : ''}>${nf(v, 2)}${v === 1.4 ? ' · descanso' : v === 1.6 ? ' · treino leve' : v === 1.75 ? ' · treino moderado' : v === 1.95 ? ' · treino intenso / jogo' : ''}</option>`).join('')}</select></div>
    <div class="f"><label for="enX">Gasto extra (kcal/dia)</label><input id="enX" name="extra" inputmode="decimal" value="${esc(b0.extra ?? 0)}"></div>
    <div class="f"><label for="enPt">Proteína (g/kg)</label><input id="enPt" name="ptn" inputmode="decimal" value="${esc(b0.ptn ?? 1.6)}"></div>
    <div class="f"><label for="enL">Gordura (% das kcal)</label><input id="enL" name="lipPct" inputmode="decimal" value="${esc(b0.lipPct ?? 28)}"></div>
    <div class="f"><label for="enAg">Água (ml/kg)</label><input id="enAg" name="agua" inputmode="decimal" value="${esc(b0.agua ?? 40)}"></div>
    <div class="f s4" style="grid-column:1/-1"><label for="enO">Observações / conduta</label><textarea id="enO" name="obs">${esc(r.obs || '')}</textarea></div>
  </div><div class="avres" id="enRes"></div></div><div class="mf"><span class="msg" id="enErr"></span>${r.id ? `<button type="button" class="btn danger" id="enDel" style="margin-right:auto">${IC.trash} Excluir</button>` : ''}<button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} ${r.id ? 'Salvar alterações' : 'Salvar avaliação'}</button></div></form>`, true);
  const fm = $('#fEn'); const num = n => { const v = numBR(fm[n].value); return isNaN(v) ? null : v; };
  const read = () => ({ ...r, atletaId: fm.atletaId.value, data: fm.data.value, responsavel: fm.responsavel.value, peso: num('peso'), altura: num('altura'), gordura: num('gordura'), formula: fm.formula.value, tmbManual: num('tmbManual'), fa: +fm.fa.value, extra: num('extra') || 0, ptn: num('ptn') || 1.6, lipPct: num('lipPct') || 28, agua: num('agua') || 40, obs: fm.obs.value.trim() });
  const sync = () => { $('#enTmbBox').style.display = fm.formula.value === 'manual' ? '' : 'none'; const o = read(); if (!o.atletaId || !o.peso) { $('#enRes').innerHTML = ''; $('#enMM').textContent = '—'; return; } const c = enCalc(o); $('#enMM').textContent = c.mm ? nf(c.mm, 1) + ' kg' : '—'; $('#enRes').innerHTML = `<div><span>Gasto em repouso</span><b>${c.tmb ? Math.round(c.tmb) : '—'} kcal</b></div><div><span>Gasto total / dia</span><b>${c.get ? Math.round(c.get) : '—'} kcal</b></div><div><span>Carboidrato</span><b>${c.cho ? Math.round(c.cho) + ' g' : '—'}</b><small>${c.choKg ? nf(c.choKg, 1) + ' g/kg' : ''}</small></div><div><span>Proteína</span><b>${Math.round(c.ptn)} g</b></div><div><span>Gordura</span><b>${c.lip ? Math.round(c.lip) + ' g' : '—'}</b></div><div><span>Água</span><b>${nf(c.agua, 1)} L</b></div>`; };
  fm.addEventListener('input', sync); fm.addEventListener('change', e => { if (e.target.name === 'atletaId' && !r.id) { const b = base(e.target.value); fm.peso.value = b.peso || ''; fm.altura.value = b.altura || ''; fm.gordura.value = b.gordura ?? ''; } sync(); }); sync();
  if (r.id) $('#enDel').onclick = () => confirmar('Excluir esta avaliação energética?', () => { remove('energia', r.id); toast('Avaliação excluída'); });
  fm.onsubmit = e => { e.preventDefault(); const o = read(); if (!o.atletaId) return $('#enErr').textContent = 'Selecione o atleta.'; if (!o.peso) return $('#enErr').textContent = 'Informe o peso.'; if (o.formula === 'cunningham' && o.gordura == null) return $('#enErr').textContent = 'Cunningham precisa do % de gordura.'; if (o.formula === 'manual' && !o.tmbManual) return $('#enErr').textContent = 'Informe o gasto em repouso medido.'; const c = enCalc(o); o.tmb = Math.round(c.tmb || 0); o.get = Math.round(c.get || 0); o.id = r.id || uid('en'); save('energia', o); UI.nutAtl = o.atletaId; closeModal(); toast(r.id ? 'Avaliação atualizada' : 'Avaliação salva'); };
}
const _fNutEnergia = fNutEnergia;
fNutEnergia = function () {
  let h = _fNutEnergia(); const a = atl(UI.nutAtl), L = a ? enDe(a.id) : [];
  h = h.replace('<div class="row r21" style="align-items:start">', `<div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="btn pri" data-act="en-nova">${IC.plus} Nova avaliação energética</button>${a ? `<button class="btn" data-act="en-nova" data-id="${a.id}">${IC.plus} Nova para ${esc(a.apelido || a.nome)}</button>` : ''}<span class="muted" style="font-size:12.5px">Atletas com avaliação salva usam os valores da nutricionista (selo <b>Avaliação</b>); os demais aparecem como <b>Estimativa</b> automática.</span></div></div><div class="row r21" style="align-items:start">`);
  h = h.replace(/<tr class="click ([^"]*)" data-ener="([^"]+)">([\s\S]*?)<\/td>/g, (m, cl, id, td) => { const e = enDe(id).slice(-1)[0]; return `<tr class="click ${cl}" data-ener="${id}">${td}${e ? ` <span class="ensel a">Avaliação ${fmtDs(e.data)}</span>` : ' <span class="ensel">Estimativa</span>'}</td>`; });
  const hist = a ? panel(`Avaliações energéticas · ${esc(a.apelido || a.nome)}`, L.length ? `<table class="t"><thead><tr><th>Data</th><th>Peso</th><th>% G</th><th>Fórmula</th><th>FA</th><th>Repouso</th><th>Gasto total</th><th>CHO</th><th>PTN</th><th>LIP</th><th></th></tr></thead><tbody>${[...L].reverse().map(r => { const c = enCalc(r); return `<tr><td>${fmtD(r.data)}</td><td>${nfx(r.peso, 1)}</td><td>${nfx(r.gordura, 1)}</td><td>${esc((FORMULAS[r.formula] || '').split(' (')[0])}</td><td>${nf(r.fa, 2)}</td><td>${Math.round(c.tmb || 0)}</td><td><b>${Math.round(c.get || 0)}</b></td><td>${Math.round(c.cho || 0)} g</td><td>${Math.round(c.ptn)} g</td><td>${Math.round(c.lip || 0)} g</td><td style="white-space:nowrap"><button class="icon-btn" data-act="en-edit" data-id="${r.id}" aria-label="Editar">${IC.edit}</button><button class="icon-btn" data-act="en-del" data-id="${r.id}" aria-label="Excluir" style="color:var(--red)">${IC.trash}</button></td></tr>`; }).join('')}</tbody></table>` : miniEmpty('Sem avaliação salva', 'Os valores atuais são estimativa automática. Clique em “Nova avaliação energética”.'), { np: !!L.length }) : '';
  return h + '<div style="height:14px"></div>' + hist;
};
dmOn('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'en-nova') formEnergia({}, t.dataset.id); if (t.dataset.act === 'en-edit') formEnergia((S.energia || []).find(r => r.id === t.dataset.id)); if (t.dataset.act === 'en-del') confirmar('Excluir esta avaliação energética?', () => { remove('energia', t.dataset.id); toast('Avaliação excluída'); }); });

/* ================= DADOS DE TESTE E LIMPEZA (todas as áreas) ================= */
IC.flask = I('<path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7 15h10"/>');
const isDemo = x => x && (x.demo || String(x.id).startsWith('demo_'));
const AREAS = {
  atletas: { n: 'Atletas', cols: ['atletas'], d: 'Elenco de exemplo da categoria (18 atletas)' },
  dm: { n: 'Fisio / DM', cols: ['lesoes'], d: 'Lesões de exemplo com status e previsão de retorno' },
  nut: { n: 'Nutrição', cols: ['avaliacoes', 'hidratacao', 'energia'], d: 'Composição corporal (4 dobras), hidratação e necessidade energética' },
  av: { n: 'Avaliação física', cols: ['testes', 'maturacao'], d: 'Duas sessões de testes (com tentativas) e maturação' },
  mon: { n: 'Monitoramento', cols: ['bemestar', 'pse'], d: 'Bem-estar e PSE de 5 semanas (junto com o microciclo)' },
  plan: { n: 'Planejamento e calendário', cols: ['macro', 'micro', 'planos'], d: 'Macrociclo, microciclo e um plano de treino' }
};
const areaDaView = v => v === 'atletas' || v === 'importar' ? 'atletas' : v === 'dashboard' || v.startsWith('dm-') ? 'dm' : v.startsWith('nut-') ? 'nut' : v.startsWith('av-') || v.startsWith('mat-') ? 'av' : v.startsWith('mon-') ? 'mon' : v.startsWith('pl-') || v === 'cal' ? 'plan' : null;
function rndGen(seed) { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
const catAlvo = () => F.categoria !== 'Todas' ? F.categoria : (Object.entries(countBy(S.atletas, a => a.categoria)).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sub-15');
async function gerarTeste(area) {
  const cat = catAlvo(), ats = S.atletas.filter(a => a.categoria === cat), r = rndGen(31), pick = l => l[Math.floor(r() * l.length)], hoje = todayISO(), ano = +hoje.slice(0, 4);
  if (area !== 'atletas' && !ats.length) { toast(`Cadastre atletas no ${cat} ou carregue os atletas de teste primeiro.`, true); return; }
  progress('Gerando dados de teste…');
  try {
    if (area === 'atletas') {
      const nomes = ['Lucas Andrade', 'Gabriel Moura', 'Pedro Lacerda', 'Rafael Coutinho', 'João Paulo Reis', 'Matheus Prado', 'Enzo Barcelos', 'Davi Fontana', 'Miguel Teixeira', 'Arthur Pimentel', 'Heitor Brandão', 'Bernardo Lins', 'Samuel Duarte', 'Lorenzo Vidal', 'Theo Cardoso', 'Isaac Moreira', 'Benício Farias', 'Vinícius Rocha'];
      const pos = ['GOL', 'GOL', 'LAT', 'LAT', 'ZAG', 'ZAG', 'ZAG', 'VOL', 'VOL', 'MEI', 'MEI', 'MEI', 'EXT', 'EXT', 'ATA', 'ATA', 'ATA', 'LAT'], subs = GRUPOS[cat] || [cat];
      const docs = nomes.map((n, i) => { const sub = subs[i % subs.length], nascAno = ano - (+String(sub).match(/\d+/)?.[0] || 15); return { id: `demo_a_${cat}_${i}`, demo: true, nome: n, numero: String(i + 1), posicao: pos[i], posDetalhe: { GOL: 'Goleiro', LAT: i % 2 ? 'Lateral Esquerdo' : 'Lateral Direito', ZAG: 'Zagueiro', VOL: 'Volante', MEI: 'Meio-campista', EXT: i % 2 ? 'Ponta Esquerda' : 'Ponta Direita', ATA: 'Centroavante' }[pos[i]], categoria: cat, subcategoria: sub, nascimento: `${nascAno}-${pad(1 + Math.floor(r() * 12))}-${pad(1 + Math.floor(r() * 27))}`, altura: (1.55 + r() * 0.3).toFixed(2), peso: (48 + r() * 22).toFixed(1), pe: pick(['Direito', 'Direito', 'Esquerdo']), criadoEm: hoje }; });
      await saveMany('atletas', docs);
    }
    if (area === 'dm') { const base = SEED.lesoes.slice(0, 10); const docs = base.map((l, i) => { const a = ats[(i * 3) % ats.length], d = addDays(hoje, -Math.floor(5 + r() * 120)), ativa = i < 3; return { ...l, id: `demo_l_${cat}_${i}`, demo: true, atletaId: a.id, data: d, previsao: addDays(d, 10 + Math.floor(r() * 25)), status: ativa ? pick(['tratamento', 'transicao', 'retorno']) : 'liberado', statusDatas: { tratamento: d }, criadoEm: d }; }); await saveMany('lesoes', docs); }
    if (area === 'nut') {
      const av = [], en = []; ats.forEach((a, i) => [-75, -10].forEach((k, j) => { const g = (3 + r() * 5) - j * 0.6; av.push({ id: `demo_n_${a.id}_${j}`, demo: true, atletaId: a.id, data: addDays(hoje, k), peso: +(+a.peso || 58 + r() * 8 + j * 0.8).toFixed(1), altura: +(+a.altura || 1.68).toFixed(2), protocolo: 'faulkner', dobras: { triceps: +(g + 2 + r() * 2).toFixed(1), subescapular: +(g + 1 + r() * 2).toFixed(1), suprailiaca: +(g + 1 + r() * 3).toFixed(1), abdominal: +(g + 3 + r() * 4).toFixed(1) } }); }));
      const hid = [0, 1].map(k => ({ id: `demo_h_${cat}_${k}`, demo: true, data: addDays(hoje, -3 - k * 7), tipo: 'Treino', duracao: 90, temp: 28, umidade: 70, categoria: cat, registros: ats.map(a => { const pre = +(+a.peso || 60).toFixed(1); return { atletaId: a.id, pre, pos: +(pre - 0.4 - r() * 1.2).toFixed(1), ingerido: Math.round(400 + r() * 600), urina: Math.round(r() * 200), cor: 1 + Math.floor(r() * 6) }; }) }));
      await saveMany('avaliacoes', av); await saveMany('hidratacao', hid);
    }
    if (area === 'av') {
      const ts = [], mt = []; ats.forEach((a, i) => [-60, -5].forEach((k, j) => { const f = 1 + j * 0.03, cmj = 26 + r() * 12; ts.push({ id: `demo_t_${a.id}_${j}`, demo: true, atletaId: a.id, data: addDays(hoje, k), cmj_1: +(cmj * f).toFixed(1), cmj_2: +((cmj + r() * 2) * f).toFixed(1), cmj_3: +((cmj - r()) * f).toFixed(1), ift: +(16 + r() * 4 + j * 0.5).toFixed(1), v10_1: +(1.95 - r() * 0.2 - j * 0.02).toFixed(2), v10_2: +(1.93 - r() * 0.2 - j * 0.02).toFixed(2), v10_3: +(1.96 - r() * 0.2 - j * 0.02).toFixed(2), v30_1: +(4.9 - r() * 0.5).toFixed(2), v30_2: +(4.85 - r() * 0.5).toFixed(2), v30_3: +(4.92 - r() * 0.5).toFixed(2), t505d_1: +(2.55 - r() * 0.2).toFixed(2), t505d_2: +(2.5 - r() * 0.2).toFixed(2), t505e_1: +(2.6 - r() * 0.2).toFixed(2), t505e_2: +(2.58 - r() * 0.2).toFixed(2) }); }));
      ats.forEach(a => { const H = Math.round((+a.altura || 1.68) * 1000) / 10; mt.push({ id: `demo_m_${a.id}`, demo: true, atletaId: a.id, data: addDays(hoje, -5), altura: H, alturaSentado: +(H * (0.51 + r() * 0.03)).toFixed(1), peso: +(+a.peso || 58).toFixed(1), alturaPai: 172 + Math.round(r() * 12), alturaMae: 158 + Math.round(r() * 10) }); });
      await saveMany('testes', ts); await saveMany('maturacao', mt);
    }
    if (area === 'mon') { progressEnd(); await carregarTeste(); return; }
    if (area === 'plan') {
      const y = String(ano), w0 = segunda(hoje); await saveMany('macro', [{ id: `demo_mc_${cat}_1`, demo: true, tipo: 'periodo', nome: 'Preparatório geral', categoria: cat, inicio: y + '-01-05', fim: y + '-02-28', cor: '#2f6fd6', objetivo: 'Base aeróbia e força geral' }, { id: `demo_mc_${cat}_2`, demo: true, tipo: 'periodo', nome: 'Competitivo', categoria: cat, inicio: y + '-03-01', fim: y + '-11-29', cor: '#1b8a4a', objetivo: 'Manutenção e picos para os jogos' }, { id: `demo_mc_${cat}_3`, demo: true, tipo: 'meso', nome: 'Meso · Potência e velocidade', categoria: cat, inicio: addDays(w0, -14), fim: addDays(w0, 13), cor: '#f39324', objetivo: 'Sprints, saltos e jogos reduzidos' }]);
      await saveMany('planos', [{ id: `demo_pl_${cat}`, demo: true, data: addDays(w0, 1), categoria: cat, local: 'Academia/campo', microciclo: 'Semana de ' + fmtDs(w0), horario: '15:00', titulo: 'Força + jogos reduzidos', blocos: [{ tipo: 'academia', nome: 'Academia', metodo: 'Força MMII e core', duracao: 30, campo: 'Academia', grupo: 'G1', objetivo: 'Força de membros inferiores', desenvolvimento: 'Força MMII (G1) e core; mobilidade (G2)', exercicios: [{ nome: 'Agachamento livre', series: '3x8', cadencia: '2010', descanso: '60s', carga: 'RIR 2' }, { nome: 'Elevação pélvica', series: '3x12', descanso: '45s', carga: 'Individual' }, { nome: 'Nórdico', series: '3x5', descanso: '60s', carga: 'Peso corporal' }] }, { tipo: 'campo', nome: 'Atividade 1', metodo: 'Jogo reduzido', duracao: 25, campo: '30x25 m', series: '5 x 4 min', pse: 8, grupo: 'Todos', objetivo: 'Pressão pós-perda em até 5 s', desenvolvimento: '4x4 + 2 coringas', regras: 'Recuperou em 5 s = 1 ponto', coaching: 'Reação à perda, compactação', pad: { campo: 'meio', objs: [{ t: 'jA', x: 35, y: 40, n: '1', s: 1.2 }, { t: 'jA', x: 50, y: 60, n: '2', s: 1.2 }, { t: 'jB', x: 60, y: 35, n: '3', s: 1.2 }, { t: 'jB', x: 45, y: 25, n: '4', s: 1.2 }, { t: 'cone', x: 20, y: 15, s: 1.2 }, { t: 'cone', x: 80, y: 15, s: 1.2 }, { t: 'mini', x: 50, y: 92, s: 1.2 }], setas: [{ x1: 35, y1: 40, x2: 50, y2: 58, tipo: 'passe' }] } }], material: [{ qtd: '10', item: 'Cones' }, { qtd: '2', item: 'Mini-gols' }, { qtd: '', item: 'Material da academia' }] }]);
      progressEnd(); await carregarTeste(); return;
    }
  } finally { progressEnd(); }
  render(); toast(`Dados de teste de ${AREAS[area].n} carregados (${cat})`);
}
async function limparArea(area, soTeste, soCat) {
  const cols = AREAS[area].cols, cat = F.categoria, ids = new Set(S.atletas.filter(a => cat === 'Todas' || a.categoria === cat).map(a => a.id));
  const doCat = x => !soCat || cat === 'Todas' || (x.atletaId ? ids.has(x.atletaId) : x.categoria ? x.categoria === cat : x.registros ? x.registros.some(r => ids.has(r.atletaId)) : true);
  let n = 0; progress('Limpando…');
  try { for (const c of cols) { const l = (S[c] || []).filter(x => (!soTeste || isDemo(x)) && doCat(x)); for (let i = 0; i < l.length; i += 20) await Promise.all(l.slice(i, i + 20).map(x => remove(c, x.id))); n += l.length; } }
  finally { progressEnd(); }
  render(); toast(`${n} registro(s) apagado(s) em ${AREAS[area].n}`);
}
function abrirDados(foco) {
  const cat = catAlvo();
  openModal(mh('Dados de teste e limpeza') + `<div class="mb"><p class="muted" style="margin:0;font-size:12.5px">Os dados de teste são marcados e podem ser apagados depois sem mexer nos dados reais. Categoria usada: <b>${esc(cat)}</b>${F.categoria === 'Todas' ? ' (escolha uma no filtro do topo para mudar)' : ''}.</p>
    <div class="dtl">${Object.entries(AREAS).map(([k, A]) => { const nT = A.cols.reduce((s, c) => s + (S[c] || []).filter(isDemo).length, 0), nR = A.cols.reduce((s, c) => s + (S[c] || []).filter(x => !isDemo(x)).length, 0); return `<div class="dti ${k === foco ? 'on' : ''}"><div><b>${A.n}</b><small>${A.d}</small><span class="muted">${nT} de teste · ${nR} reais</span></div><div class="dtb"><button class="btn sm pri" data-act="dt-gen" data-a="${k}">${IC.flask} Carregar teste</button><button class="btn sm" data-act="dt-clr" data-a="${k}" ${nT ? '' : 'disabled'}>Limpar teste</button><button class="btn sm danger" data-act="dt-all" data-a="${k}" ${nR + nT ? '' : 'disabled'}>${IC.trash} Limpar tudo</button></div></div>`; }).join('')}</div>
    <p class="muted" style="margin:0;font-size:12px">“Limpar tudo” apaga também os dados reais da área (da categoria filtrada, ou de todas quando o filtro está em Todas) e pede confirmação escrita. Jogos e minutagem têm limpeza própria no módulo de Jogos.</p></div><div class="mf"><button class="btn" data-act="close">Fechar</button></div>`, true);
}
dmOn('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return; const a = t.dataset.a;
  if (t.dataset.act === 'dados-teste') abrirDados(areaDaView(S.view));
  if (t.dataset.act === 'dt-gen') { closeModal(); gerarTeste(a); }
  if (t.dataset.act === 'dt-clr') { closeModal(); confirmar(`Apagar os dados de teste de ${AREAS[a].n}?`, () => limparArea(a, true, false)); }
  if (t.dataset.act === 'dt-all') { openModal(mh('Limpar todos os dados · ' + AREAS[a].n) + `<div class="mb"><div class="warn" style="margin:0">Isto apaga <b>todos</b> os registros de ${AREAS[a].n}${F.categoria !== 'Todas' ? ' da categoria <b>' + esc(F.categoria) + '</b>' : ' de <b>todas as categorias</b>'}, inclusive os reais. Não dá para desfazer. Se quiser guardar, exporte antes em Configurações → Geral.</div><div class="f"><label for="dtX">Digite EXCLUIR para confirmar</label><input id="dtX" autocomplete="off"></div></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn red" id="dtGo">${IC.trash} Apagar tudo</button></div>`); $('#dtGo').onclick = () => { if ($('#dtX').value.trim().toUpperCase() !== 'EXCLUIR') { toast('Digite EXCLUIR para confirmar.', true); return; } closeModal(); limparArea(a, false, true); }; }
});
// botão no topo de todas as abas
const _renderTopDT = renderTop;
renderTop = function () { _renderTopDT(); const tb = $('#topbar'); if (!tb || tb.querySelector('[data-act="dados-teste"]') || !areaDaView(S.view)) return; const pr = tb.querySelector('[data-act="print-menu"]'); const b = `<button class="btn sm" data-act="dados-teste" title="Carregar dados de teste ou limpar dados">${IC.flask} Teste / limpar</button>`; if (pr) pr.insertAdjacentHTML('beforebegin', b); else tb.insertAdjacentHTML('beforeend', b); };

/* ---------- composição corporal: editar direto na tabela ---------- */
const _fNutCompE = fNutComp;
fNutComp = function () {
  const h = _fNutCompE(), U = ultimas(), tmp = document.createElement('div'); tmp.innerHTML = h;
  const th = tmp.querySelector('table.t thead tr'); if (th) th.insertAdjacentHTML('beforeend', '<th>Ações</th>');
  tmp.querySelectorAll('table.t tbody tr[data-nut]').forEach(tr => { const v = U.get(tr.dataset.nut); if (v) tr.insertAdjacentHTML('beforeend', `<td style="white-space:nowrap"><button class="icon-btn" data-act="edit-av" data-id="${v.id}" title="Editar a última avaliação" aria-label="Editar">${IC.edit}</button><button class="icon-btn" data-act="nova-av" data-id="${tr.dataset.nut}" title="Nova avaliação" aria-label="Nova">${IC.plus}</button><button class="icon-btn" data-act="del-av" data-id="${v.id}" title="Excluir a última avaliação" aria-label="Excluir" style="color:var(--red)">${IC.trash}</button></td>`); });
  return tmp.innerHTML;
};

/* ---------- filtro de período (ano todo, semestres e meses) ---------- */
const PERIODOS = [['ano', 'Ano todo'], ['s1', '1º semestre'], ['s2', '2º semestre'], ...['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((n, i) => [pad(i + 1), n])];

/* ================= ATLETAS · MAPA DE JOGADORES (A4 deitado) ================= */
TITLES['atl-mapa'] = ['Atletas', 'Mapa de jogadores'];
{ const n = NAV.find(x => x.k === 'atletas'); if (n) n.sub.splice(1, 0, ['atl-mapa', 'Mapa de jogadores']); }
const GRP = { G1: '#1b8a4a', G2: '#f2b81b', G3: '#2f6fd6', G4: '#e0342b' };
const COMISSAO = [['treinador', 'Treinador'], ['aux', 'Aux. técnico'], ['prep', 'Prep. físico'], ['prepgol', 'Prep. goleiros'], ['fisio', 'Fisioterapeuta'], ['massagista', 'Massagista']];
// lado do atleta: escolha manual > função cadastrada > pé
function ladoAtl(a) { if (a.lado === 'D' || a.lado === 'E') return a.lado; const d = nrmB(a.posDetalhe || ''); if (/direit/.test(d)) return 'D'; if (/esquerd/.test(d)) return 'E'; return /esquer|canhot/.test(nrmB(a.pe || '')) ? 'E' : 'D'; }
function slotDe(a) { const p = a.posicao, l = ladoAtl(a); if (p === 'GOL') return 'gol'; if (p === 'LAT') return l === 'E' ? 'le' : 'ld'; if (p === 'ZAG') return l === 'E' ? 'z4' : 'z3'; if (p === 'VOL') return 'vol'; if (p === 'MEI') return 'mei'; if (p === 'EXT') return l === 'E' ? 'ee' : 'ed'; if (p === 'ATA') return 'ata'; return 'mei'; }
const SLOTS = { gol: 'Goleiro (01)', ld: 'Lateral direito (02)', z3: 'Zagueiro (03) · lado direito', z4: 'Zagueiro (04) · lado esquerdo', le: 'Lateral esquerdo (06)', vol: 'Volante (05)', ed: 'Extremo direito (07)', mei: 'Meio-campo (10)', ee: 'Extremo esquerdo (11)', ata: 'Atacante (09)' };
UI.mapaSub = 'Todas';
function mapaDados() {
  const cat = F.categoria !== 'Todas' ? F.categoria : (Object.entries(countBy(S.atletas, a => a.categoria)).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sub-15');
  const ats = S.atletas.filter(a => a.categoria === cat && (UI.mapaSub === 'Todas' || a.subcategoria === UI.mapaSub)).sort((a, b) => a.nome.localeCompare(b.nome));
  const by = {}; Object.keys(SLOTS).forEach(k => by[k] = []); ats.forEach(a => by[slotDe(a)].push(a));
  return { cat, ats, by };
}
function mapaHTML(edit) {
  const D = mapaDados(), com = (S.config.comissao || {})[D.cat] || {}, ano = F.ano === 'Todos' ? todayISO().slice(0, 4) : F.ano;
  const n = { al: D.ats.filter(a => a.alojado).length, gol: D.by.gol.length, linha: D.ats.length - D.by.gol.length };
  // colunas de cartões por bloco e altura do cartão para caber numa folha A4 deitada
  const cc = n => n <= 1 ? 1 : n <= 4 ? 2 : 3, cG = Math.min(3, Math.max(1, D.by.gol.length)), cV = cc(D.by.vol.length), cM = cc(D.by.mei.length), cA = cc(D.by.ata.length);
  const rows = [Math.max(1, Math.ceil(D.by.gol.length / cG)), Math.max(D.by.ld.length, D.by.z3.length, D.by.z4.length, D.by.le.length, 1), Math.max(1, Math.ceil(D.by.vol.length / cV)), Math.max(1, Math.ceil(D.by.mei.length / cM)), Math.max(D.by.ed.length, Math.ceil(D.by.ata.length / cA), D.by.ee.length, 1)];
  const totR = rows.reduce((s, x) => s + x, 0), disp = 794 - 62 - 20 - 16 - 4 * 12 - 5 * 24 - 5 * 8, cardH = Math.max(20, Math.min(52, Math.floor((disp - totR * 4) / totR))), xs = cardH < 34 ? 'xs' : cardH >= 44 ? 'lg' : '';
  const card = a => `<div class="mpc ${edit ? 'ed' : ''} ${xs}" style="--gc:${GRP[a.grupo] || '#cfd8d3'};height:${cardH}px" ${edit ? `data-act="mp-edit" data-id="${a.id}" role="button" tabindex="0"` : ''}><span class="mpf">${a.foto ? `<img src="${esc(a.foto)}" alt="">` : `<i>${esc(initials(a.nome))}</i>`}</span><div class="mpt"><b>${esc(a.nome)}${a.apelido ? ` <small>“${esc(a.apelido)}”</small>` : ''}</b><span>${a.nascimento ? fmtD(a.nascimento) : '—'} · Pé ${esc((a.pe || '—').slice(0, 1).toUpperCase())}${xs ? ` · ${a.altura ? nf(+a.altura, 2) + ' m' : '—'} · ${a.peso ? nf(+a.peso, 1) + ' kg' : '—'}` : ''}</span>${xs ? '' : `<span>${a.altura ? nf(+a.altura, 2) + ' m' : '— m'} · ${a.peso ? nf(+a.peso, 1) + ' kg' : '— kg'}</span>`}</div><em class="${a.alojado ? 'al' : ''}">${a.alojado ? 'AL' : 'NA'}</em>${a.grupo ? `<u>${a.grupo}</u>` : ''}</div>`;
  const box = (k, cols) => `<div class="mpb mpb-${k}"><h6>${SLOTS[k]} <small>${D.by[k].length}</small></h6><div class="mpl" style="grid-template-columns:repeat(${cols || 1},minmax(0,1fr))">${D.by[k].map(card).join('') || '<div class="mpv">—</div>'}</div></div>`;
  return `<div class="a4pg mapa">
    <svg class="mpfield" viewBox="0 0 1123 794" preserveAspectRatio="none"><g fill="none" stroke="#cfe6d6" stroke-width="2"><rect x="18" y="74" width="1087" height="702" rx="6"/><line x1="18" y1="425" x2="1105" y2="425"/><circle cx="561" cy="425" r="58"/><rect x="371" y="74" width="380" height="96"/><rect x="471" y="74" width="180" height="38"/><rect x="371" y="680" width="380" height="96"/><rect x="471" y="738" width="180" height="38"/></g></svg>
    <div class="mph"><img src="${LOGO}" alt=""><div><b>MAPA DE JOGADORES · ${ano}</b><span>Porto Vitória · Departamento de Futebol de Base · ${esc(String(D.cat).toUpperCase())}${UI.mapaSub !== 'Todas' ? ' · ' + esc(UI.mapaSub.toUpperCase()) : ''}</span></div><div class="mpleg"><span>Legenda</span>${Object.entries(GRP).map(([g, c]) => `<i style="background:${c}">${g}</i>`).join('')}<span class="mptag"><em class="al">AL</em> alojado</span><span class="mptag"><em>NA</em> não alojado</span></div></div>
    <div class="mpsides"><span>◀ LADO DIREITO</span><span>▼ sentido do ataque</span><span>LADO ESQUERDO ▶</span></div>
    <div class="mpg">
      <div class="mpinfo"><img src="${LOGO}" alt=""><div><b>${esc(String(D.cat).toUpperCase())}</b><dl><dt>Atletas alojados</dt><dd>${n.al}</dd><dt>Goleiros</dt><dd>${n.gol}</dd><dt>Atletas de linha</dt><dd>${n.linha}</dd><dt>Total</dt><dd><b>${D.ats.length}</b></dd></dl></div></div>
      ${box('gol', cG)}
      <div class="mpcom"><h6>Comissão técnica</h6>${COMISSAO.map(([k, l]) => `<div><span>${l}</span><b>${esc(com[k] || '—')}</b></div>`).join('')}${edit ? `<button class="mpcomed" data-act="mp-com">${IC.edit} Editar</button>` : ''}</div>
      ${box('ld')}${box('z3')}${box('z4')}${box('le')}
      ${box('vol', cV)}
      ${box('mei', cM)}
      ${box('ed')}${box('ata', cA)}${box('ee')}
    </div>
  </div>`;
}
function vMapa() {
  const D = mapaDados(), subs = GRUPOS[D.cat] || [];
  return `<div class="page-h"><div><h2>Atletas</h2><span class="muted">Mapa de jogadores por posição e lado · ${esc(D.cat)}</span></div></div>
  <nav class="subtabs"><button data-go="atletas">Cadastro</button><button class="on" data-go="atl-mapa">Mapa de jogadores</button><button data-go="importar">Importar dados</button></nav>
  <div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${F.categoria === 'Todas' ? `<span class="muted">Mostrando ${esc(D.cat)} — escolha a categoria no filtro do topo.</span>` : ''}${subs.length > 1 ? `<label class="muted" style="display:flex;gap:6px;align-items:center">Subcategoria <select id="mpSub" class="search" style="min-width:0"><option>Todas</option>${subs.map(s => `<option ${UI.mapaSub === s ? 'selected' : ''}>${s}</option>`).join('')}</select></label>` : ''}<span class="muted" style="font-size:12.5px">Clique num atleta para definir <b>lado</b>, <b>grupo (G1–G4)</b> e se é <b>alojado</b>.</span><span style="flex:1"></span><button class="btn" data-act="mp-com">${IC.users} Comissão técnica</button><button class="btn" data-act="mp-print" data-pdf="0">${IC.print} Imprimir (A4 deitado)</button><button class="btn pri" data-act="mp-print" data-pdf="1">${IC.pdf} Baixar PDF</button></div></div>
  <div class="mpwrap"><div class="mpscale">${mapaHTML(true)}</div></div>`;
}
function formMapaAtl(a) {
  openModal(mh(esc(a.nome)) + `<div class="mb"><div class="form" style="grid-template-columns:1fr 1fr"><div class="f"><label for="mpP">Posição</label><select id="mpP">${POS.map(p => `<option value="${p}" ${a.posicao === p ? 'selected' : ''}>${POSN[p]}</option>`).join('')}</select></div><div class="f"><span>Lado</span><div class="seg2"><label><input type="radio" name="mpL" value="D" ${ladoAtl(a) === 'D' ? 'checked' : ''}>Direito</label><label><input type="radio" name="mpL" value="E" ${ladoAtl(a) === 'E' ? 'checked' : ''}>Esquerdo</label></div><small class="muted">Vale para laterais, zagueiros e extremos.</small></div><div class="f"><span>Grupo</span><div class="seg2"><label><input type="radio" name="mpG" value="" ${!a.grupo ? 'checked' : ''}>—</label>${Object.keys(GRP).map(g => `<label><input type="radio" name="mpG" value="${g}" ${a.grupo === g ? 'checked' : ''}><i style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${GRP[g]};margin-right:4px"></i>${g}</label>`).join('')}</div></div><div class="f"><span>Alojamento</span><div class="seg2"><label><input type="radio" name="mpA" value="1" ${a.alojado ? 'checked' : ''}>Alojado (AL)</label><label><input type="radio" name="mpA" value="" ${!a.alojado ? 'checked' : ''}>Não alojado (NA)</label></div></div><div class="f"><label for="mpAp">Apelido</label><input id="mpAp" value="${esc(a.apelido || '')}"></div></div></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn" data-act="mp-ficha" data-id="${a.id}">${IC.user} Abrir ficha</button><button class="btn pri" id="mpOk">${IC.check} Salvar</button></div>`);
  $('#mpOk').onclick = () => { const o = { ...a, posicao: $('#mpP').value, lado: ($('input[name=mpL]:checked') || {}).value || '', grupo: ($('input[name=mpG]:checked') || {}).value || '', alojado: !!($('input[name=mpA]:checked') || {}).value, apelido: $('#mpAp').value.trim() }; save('atletas', o); closeModal(); toast('Atleta atualizado'); };
}
function formComissao() {
  const cat = mapaDados().cat, c = (S.config.comissao || {})[cat] || {}, profs = (S.config.profissionais || []).map(p => p.nome).filter(Boolean);
  openModal(mh('Comissão técnica · ' + esc(cat)) + `<div class="mb"><div class="form" style="grid-template-columns:1fr 1fr">${COMISSAO.map(([k, l]) => `<div class="f"><label for="cm_${k}">${l}</label><input id="cm_${k}" list="cmL" value="${esc(c[k] || '')}"></div>`).join('')}<datalist id="cmL">${profs.map(p => `<option value="${esc(p)}">`).join('')}</datalist></div></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn pri" id="cmOk">${IC.check} Salvar</button></div>`);
  $('#cmOk').onclick = () => { const o = {}; COMISSAO.forEach(([k]) => o[k] = $('#cm_' + k).value.trim()); S.config.comissao = { ...(S.config.comissao || {}), [cat]: o }; putConfig(); closeModal(); render(); toast('Comissão técnica salva'); };
}
dmOn('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'mp-edit') { const a = atl(t.dataset.id); if (a) formMapaAtl(a); }
  if (t.dataset.act === 'mp-com') formComissao();
  if (t.dataset.act === 'mp-ficha') { closeModal(); abrirFicha(t.dataset.id, 'geral'); }
  if (t.dataset.act === 'mp-print') { const D = mapaDados(); imprimirA4(mapaHTML(false), `Mapa-de-jogadores-${(UI.mapaSub !== 'Todas' ? UI.mapaSub : D.cat).replace(/\s/g, '')}-${todayISO()}.pdf`, true, t.dataset.pdf === '1', 0); }
});
dmOn('change', e => { if (e.target.id === 'mpSub') { UI.mapaSub = e.target.value; render(); } });
// abas Cadastro / Mapa / Importar também nas outras telas de Atletas
const _vAtletasM = vAtletas; vAtletas = function () { return _vAtletasM().replace('<button data-go="importar">Importar dados</button>', '<button data-go="atl-mapa">Mapa de jogadores</button><button data-go="importar">Importar dados</button>'); };
const _vImportarM = vImportar; vImportar = function () { return _vImportarM().replace('<button data-go="atletas">Cadastro</button>', '<button data-go="atletas">Cadastro</button><button data-go="atl-mapa">Mapa de jogadores</button>'); };

window.MIN=(function(){

const MIN_VIEWS=new Set(['dashboard','jogos-painel','jogos-lista','jogos-arquivos','min-geral','min-jogo','min-pos','min-atl','relatorio','importar','config']);
// os ouvintes de evento deste módulo só agem quando a Minutagem está na tela
const __W=new WeakMap();
const document=new Proxy(window.document,{get(t,p){
  if(p==='addEventListener')return (type,fn,opt)=>{const w=e=>{if(window.__APP==='min')return fn(e);};__W.set(fn,w);t.addEventListener(type,w,opt);};
  if(p==='removeEventListener')return (type,fn,opt)=>{t.removeEventListener(type,__W.get(fn)||fn,opt);};
  const v=t[p];return typeof v==='function'?v.bind(t):v;}});
const LOGO=PV_ASSETS[3];
;

"use strict";
/* ================= ÍCONES ================= */
const I=(p,vb='0 0 24 24',fill=false)=>`<svg viewBox="${vb}" fill="${fill?'currentColor':'none'}" stroke="${fill?'none':'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const IC={
  dash:I('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'),
  users:I('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
  ball:I('<circle cx="12" cy="12" r="10"/><path d="m12 7 4.2 3.1-1.6 5H9.4l-1.6-5z"/><path d="M12 2v5M21.5 9.2l-5.3.9M18.5 20l-3.9-4.9M5.5 20l3.9-4.9M2.5 9.2l5.3.9"/>'),
  clock:I('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
  gear:I('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),
  file:I('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/>'),
  upload:I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>'),
  moon:I('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'),
  print:I('<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>'),
  plus:I('<path d="M12 5v14M5 12h14"/>'),
  edit:I('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  trash:I('<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>'),
  x:I('<path d="M18 6 6 18M6 6l12 12"/>'),
  up:I('<path d="M12 19V5M5 12l7-7 7 7"/>'),
  down:I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>'),
  /* KPI cheios */
  kClock:I('<circle cx="12" cy="12" r="10" stroke-width="2.6"/><path d="M12 6.5V12l3.6 2.2" stroke-width="2.6"/>'),
  kUser2:I('<circle cx="8.5" cy="7" r="4"/><path d="M1 21v-1.5A5.5 5.5 0 0 1 6.5 14h4A5.5 5.5 0 0 1 16 19.5V21z"/><circle cx="17" cy="8" r="3.2"/><path d="M17.5 13.5h.5A5 5 0 0 1 23 18.5V21h-5.5v-1.5a7 7 0 0 0-2-5z"/>','0 0 24 24',true),
  kCal:I('<rect x="2.5" y="4" width="19" height="17.5" rx="2.5" stroke-width="2.4"/><path d="M2.5 9.5h19M7.5 2v4M16.5 2v4" stroke-width="2.4"/><path d="M7 13h2M11 13h2M15 13h2M7 17h2M11 17h2M15 17h2" stroke-width="2.4"/>'),
  kCalPlus:I('<rect x="2.5" y="4" width="19" height="17.5" rx="2.5" stroke-width="2.4"/><path d="M2.5 9.5h19M7.5 2v4M16.5 2v4" stroke-width="2.4"/><path d="M8 15.5h8M12 12v7M8 12v7M16 12v7" stroke-width="2"/>'),
  kBars:I('<rect x="2" y="13" width="5" height="9" rx="1"/><rect x="9.5" y="8" width="5" height="14" rx="1"/><rect x="17" y="2" width="5" height="20" rx="1"/>','0 0 24 24',true),
  kTeam:I('<circle cx="12" cy="6.5" r="3.6"/><circle cx="4.8" cy="8.5" r="2.7"/><circle cx="19.2" cy="8.5" r="2.7"/><path d="M6.5 21v-3.5A5.5 5.5 0 0 1 12 12a5.5 5.5 0 0 1 5.5 5.5V21z"/><path d="M0 21v-2.5A4 4 0 0 1 4 14.5h1.7a7.5 7.5 0 0 0-1.2 3V21zM24 21v-2.5a4 4 0 0 0-4-4h-1.7a7.5 7.5 0 0 1 1.2 3V21z"/>','0 0 24 24',true),
  kPie:I('<path d="M11 2.05A10 10 0 1 0 21.95 13H11z"/><path d="M13 0.05V11h10.95A11 11 0 0 0 13 .05z"/>','0 0 24 24',true),
  kShirt:I('<path d="M8 2 2 5.5l2.5 5L7 9.5V22h10V9.5l2.5 1 2.5-5L16 2c-.5 1.7-2 3-4 3S8.5 3.7 8 2z"/>','0 0 24 24',true),
  kSwap:I('<path d="M3.5 10a8.5 8.5 0 0 1 15-4.5L21 8" stroke-width="2.8"/><path d="M21 3v5h-5" stroke-width="2.8"/><path d="M20.5 14a8.5 8.5 0 0 1-15 4.5L3 16" stroke-width="2.8"/><path d="M3 21v-5h5" stroke-width="2.8"/>'),
  kUserX:I('<circle cx="9" cy="7" r="4.2"/><path d="M1 21v-1.2A5.8 5.8 0 0 1 6.8 14h4.4a6 6 0 0 1 1.8.3A7 7 0 0 0 12.5 21z"/><circle cx="18" cy="17.5" r="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="m14.6 14.1 6.8 6.8" stroke="currentColor" stroke-width="2"/>','0 0 24 24',true),
  trophy:I('<path d="M6 3h12v5a6 6 0 0 1-12 0z"/><path d="M6 5H3v2a4 4 0 0 0 4 4M18 5h3v2a4 4 0 0 1-4 4M12 14v4M8 21h8M9 18h6"/>'),
  pin:I('<path d="M3 21h18M5 21V10l7-5 7 5v11"/><path d="M9 21v-6h6v6"/>'),
  stadium:I('<ellipse cx="12" cy="8" rx="9" ry="3.5"/><path d="M3 8v8c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5V8"/><path d="M7 11v4M12 11.5v4.5M17 11v4"/>'),
  foot:I('<ellipse cx="12" cy="16" rx="5" ry="7.5"/><circle cx="7.5" cy="4.2" r="1.7"/><circle cx="11" cy="2.8" r="1.6"/><circle cx="14.4" cy="3.1" r="1.4"/><circle cx="17.2" cy="4.6" r="1.2"/><circle cx="19" cy="7" r="1"/>','0 0 24 24',true),
  stShirt:I('<path d="M8 2 2 5.5l2.5 5L7 9.5V22h10V9.5l2.5 1 2.5-5L16 2c-.5 1.7-2 3-4 3S8.5 3.7 8 2z"/>','0 0 24 24',true),
  bench:I('<circle cx="6" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><path d="M3 9h18v3H3zM4 14h16v2H4zM5 16v5M19 16v5M5 12v2M19 12v2"/>','0 0 24 24',true),
  boot:I('<path d="M2 15c0-2 1-3 3-3l4-1 3-5h4l1 4 4 2c1.5.8 2 2 2 3.5V17H2z"/><path d="M3 19h2M8 19h2M14 19h2M19 19h2" stroke="currentColor" stroke-width="2"/>','0 0 24 24',true),
  ballF:I('<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="m12 7 4.2 3.1-1.6 5H9.4l-1.6-5z"/><path d="M12 2v5M21.5 9.2l-5.3.9M18.5 20l-3.9-4.9M5.5 20l3.9-4.9M2.5 9.2l5.3.9" fill="none" stroke="currentColor" stroke-width="1.6"/>','0 0 24 24',true),
  run:I('<circle cx="14" cy="4" r="2"/><path d="M8 21l3-6 3 2v4M7 11l3-3 4 1 2 3h3M10 8l-2 5"/>'),
  glove:I('<path d="M7 22v-5L4 12V7a1.5 1.5 0 0 1 3 0v3V4a1.5 1.5 0 0 1 3 0v6V3a1.5 1.5 0 0 1 3 0v7V4.5a1.5 1.5 0 0 1 3 0V14l2-2a1.6 1.6 0 0 1 2.3 2.2L15 19v3z"/>','0 0 24 24',true),
};
/* ================= POSIÇÕES ================= */
const POS=['GOL','LAT','ZAG','VOL','MEI','ATA','EXT'];
const POSN={GOL:'Goleiro',LAT:'Lateral',ZAG:'Zagueiro',VOL:'Volante',MEI:'Meio-campista',ATA:'Atacante',EXT:'Extremo'};
const POSP={GOL:'Goleiros',LAT:'Laterais',ZAG:'Zagueiros',VOL:'Volantes',MEI:'Meio-campistas',ATA:'Atacantes',EXT:'Extremos'};
const POSS={GOL:'Goleiros',LAT:'Laterais',ZAG:'Zagueiros',VOL:'Volantes',MEI:'Meias',ATA:'Atacantes',EXT:'Extremos'};
/* paleta do Dashboard (imagem 1) */
const PC1={GOL:'#3368d9',LAT:'#f4b91f',ZAG:'#e2322b',VOL:'#17824a',MEI:'#f58a1f',ATA:'#7b3fd3',EXT:'#ef3e95'};
const PCELL={GOL:'#8db8f2',LAT:'#ffd970',ZAG:'#f37575',VOL:'#5fca85',MEI:'#ffaa5e',ATA:'#b48bf5',EXT:'#ffa3d0'};
/* paleta das demais (imagens 2-3) */
const PC2={GOL:'#f2bd12',LAT:'#1d7fe0',ZAG:'#1655c4',VOL:'#17a15a',MEI:'#f7a325',ATA:'#e4241d',EXT:'#ec3f93'};
const PC3={GOL:'#f6c21c',ZAG:'#1e7ae6',LAT:'#13a3a3',VOL:'#2fb257',MEI:'#f6a92a',ATA:'#e52a20',EXT:'#ec3f93'};
const POSDET={GOL:['Goleiro'],LAT:['Lateral Direito','Lateral Esquerdo'],ZAG:['Zagueiro','Zagueiro Direito','Zagueiro Esquerdo'],VOL:['Volante','Primeiro Volante','Segundo Volante'],MEI:['Meio-campista','Meia Central','Meia Armador'],ATA:['Atacante','Centroavante','Segundo Atacante'],EXT:['Extremo','Ponta Direita','Ponta Esquerda']};
const POSICON={GOL:IC.glove,LAT:IC.run,ZAG:IC.run,VOL:IC.run,MEI:IC.run,ATA:IC.run,EXT:IC.run};
const MESES=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const MESESU=['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
const MOTIVOS=['Opção técnica','Lesão','Suspensão','Transição física','Convocação','Questão pessoal','Outro'];
const FORMACOES={
 '4-2-3-1':[[50,88,'GOL'],[12,70,'LAT'],[37,72,'ZAG'],[63,72,'ZAG'],[88,70,'LAT'],[38,53,'VOL'],[62,53,'VOL'],[16,33,'MEI'],[50,33,'MEI'],[84,33,'MEI'],[50,13,'ATA']],
 '4-4-2':[[50,88,'GOL'],[12,70,'LAT'],[37,72,'ZAG'],[63,72,'ZAG'],[88,70,'LAT'],[12,45,'MEI'],[37,48,'VOL'],[63,48,'VOL'],[88,45,'MEI'],[36,17,'ATA'],[64,17,'ATA']],
 '4-3-3':[[50,88,'GOL'],[12,70,'LAT'],[37,72,'ZAG'],[63,72,'ZAG'],[88,70,'LAT'],[50,55,'VOL'],[27,42,'MEI'],[73,42,'MEI'],[16,18,'EXT'],[50,14,'ATA'],[84,18,'EXT']],
 '4-1-4-1':[[50,88,'GOL'],[12,71,'LAT'],[37,73,'ZAG'],[63,73,'ZAG'],[88,71,'LAT'],[50,57,'VOL'],[12,38,'MEI'],[37,40,'MEI'],[63,40,'MEI'],[88,38,'MEI'],[50,14,'ATA']],
 '4-3-1-2':[[50,88,'GOL'],[12,70,'LAT'],[37,72,'ZAG'],[63,72,'ZAG'],[88,70,'LAT'],[26,52,'VOL'],[50,55,'VOL'],[74,52,'MEI'],[50,34,'MEI'],[36,15,'ATA'],[64,15,'ATA']],
 '3-5-2':[[50,88,'GOL'],[25,72,'ZAG'],[50,74,'ZAG'],[75,72,'ZAG'],[9,45,'LAT'],[34,52,'VOL'],[66,52,'VOL'],[91,45,'LAT'],[50,34,'MEI'],[36,15,'ATA'],[64,15,'ATA']],
 '3-4-3':[[50,88,'GOL'],[25,72,'ZAG'],[50,74,'ZAG'],[75,72,'ZAG'],[11,46,'LAT'],[37,50,'VOL'],[63,50,'VOL'],[89,46,'LAT'],[16,19,'EXT'],[50,14,'ATA'],[84,19,'EXT']],
 '5-3-2':[[50,88,'GOL'],[8,66,'LAT'],[29,72,'ZAG'],[50,74,'ZAG'],[71,72,'ZAG'],[92,66,'LAT'],[26,46,'MEI'],[50,50,'VOL'],[74,46,'MEI'],[36,17,'ATA'],[64,17,'ATA']],
};
/* ================= UTIL ================= */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nf=(n,d=0)=>Number(n||0).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d});
const pct=(a,b)=>b?Math.round(a/b*100):0;
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const idade=n=>{if(!n)return '';const d=new Date(n+'T12:00:00'),h=new Date();let a=h.getFullYear()-d.getFullYear();const m=h.getMonth()-d.getMonth();if(m<0||(m===0&&h.getDate()<d.getDate()))a--;return a;};
const fmtData=d=>{if(!d)return '';const [y,m,dd]=d.split('-');return `${dd}/${m}/${y}`;};
const hoje=()=>{const d=new Date();return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;};
/* confirmação própria (o confirm() do navegador é bloqueado na página publicada) */
function ask(msg,{ok='Confirmar',danger=true}={}){return new Promise(res=>{
  const d=document.createElement('div');d.className='modal-bg';d.style.zIndex='300';d.setAttribute('role','alertdialog');d.setAttribute('aria-modal','true');
  d.innerHTML=`<div class="modal" style="max-width:460px"><div class="mb" style="padding:22px 22px 8px"><p style="margin:0;font-size:15.5px;line-height:1.5">${esc(msg)}</p></div><div class="mf" style="border:0"><button class="btn" data-a="0">Cancelar</button><button class="btn pri" data-a="1" ${danger?'style="background:var(--red);border-color:var(--red)"':''}>${esc(ok)}</button></div></div>`;
  const fim=v=>{d.remove();document.removeEventListener('keydown',kd,true);res(v);};
  const kd=e=>{if(e.key==='Escape'){e.stopPropagation();fim(false);}};
  d.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b){e.stopPropagation();fim(b.dataset.a==='1');}});
  document.addEventListener('keydown',kd,true);document.body.appendChild(d);d.querySelector('[data-a="1"]').focus();});}
function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2600);}
function avatarSVG(color='#145c33'){
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140"><defs><radialGradient id="g" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#2d3330"/><stop offset="1" stop-color="#121614"/></radialGradient></defs><rect width="120" height="140" fill="url(#g)"/><circle cx="60" cy="52" r="23" fill="#8b9a92"/><path d="M14 140c2-30 18-46 46-46s44 16 46 46z" fill="${color}"/><path d="M48 94l12 14 12-14" fill="none" stroke="#0b3d22" stroke-width="4"/></svg>`);
}
let AVA=avatarSVG();
function svgToPng(src,w,h){return new Promise(res=>{const im=new Image();im.onload=()=>{try{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);res(c.toDataURL('image/png'));}catch(e){res(src);}};im.onerror=()=>res(src);im.src=src;});}
svgToPng(AVA,240,280).then(p=>{AVA=p;});
const fotoDe=a=>a&&a.foto?a.foto:AVA;
function shieldSVG(txt){
  const t=esc((txt||'?').trim().split(/\s+/).map(w=>w[0]).join('').slice(0,3).toUpperCase());
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 70"><path d="M30 2 56 10v24c0 17-11 28-26 34C15 62 4 51 4 34V10z" fill="#e8ecea" stroke="#56635c" stroke-width="3"/><text x="30" y="42" font-family="Arial" font-weight="700" font-size="17" text-anchor="middle" fill="#2c3a33">${t}</text></svg>`);
}
/* foto do atleta: mantém a imagem inteira e o fundo transparente do PNG, cabendo no limite do banco */
async function prepFoto(file){
  for(const [w,h] of [[520,650],[440,550],[360,450],[300,375]]){
    let d=await resizeImage(file,w,h,'image/webp',.86);
    if(!d.startsWith('data:image/webp'))d=await resizeImage(file,w,h,'image/png');
    if(d.length<190000)return d;}
  return resizeImage(file,280,350,'image/jpeg',.82);
}
function resizeImage(file,maxW,maxH,type='image/jpeg',q=.82){
  return new Promise((res,rej)=>{const r=new FileReader();r.onerror=rej;r.onload=()=>{const img=new Image();img.onerror=rej;img.onload=()=>{let w=img.width,h=img.height;const s=Math.min(1,maxW/w,maxH/h);w=Math.round(w*s);h=Math.round(h*s);const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');if(type==='image/jpeg'){x.fillStyle='#151a17';x.fillRect(0,0,w,h);}x.drawImage(img,0,0,w,h);res(c.toDataURL(type,q));};img.src=r.result;};r.readAsDataURL(file);});
}

/* ================= ESTADO / ARMAZENAMENTO ================= */
const GRUPOS={'Sub-11':['Sub-10','Sub-11'],'Sub-13':['Sub-12','Sub-13'],'Sub-15':['Sub-14','Sub-15'],'Sub-17':['Sub-16','Sub-17'],'Sub-20':['Sub-18','Sub-19','Sub-20']};
const GRUPO_DE={};Object.entries(GRUPOS).forEach(([g,l])=>l.forEach(s=>GRUPO_DE[s]=g));
/* "sub 16", "SUB-16", "U16", "16" -> {cat:'Sub-17', sub:'Sub-16'} */
function parseCat(v){const s=String(v??'').toLowerCase();const m=s.match(/(\d{1,2})/);if(!m)return {};const n=+m[1];const sub='Sub-'+n;if(GRUPO_DE[sub])return {cat:GRUPO_DE[sub],sub};
  const g=Object.keys(GRUPOS).find(k=>+k.slice(4)>=n);return g?{cat:g,sub:''}:{};}
function subPorIdade(nasc,anoBase){if(!nasc)return {};const y=+String(nasc).slice(0,4);if(!y)return {};const n=(+anoBase||new Date().getFullYear())-y;if(n<10)return {cat:'Sub-11',sub:'Sub-10'};if(n>20)return {cat:'Sub-20',sub:'Sub-20'};return {cat:GRUPO_DE['Sub-'+n],sub:'Sub-'+n};}
function normAtleta(a){if(!a)return a;if(!GRUPOS[a.categoria]){const p=parseCat(a.categoria);const q=subPorIdade(a.nascimento,S.config.anoBase);a.subcategoria=a.subcategoria||p.sub||q.sub||'';a.categoria=p.cat||q.cat||'Sub-17';}
  if(!a.subcategoria||GRUPO_DE[a.subcategoria]!==a.categoria){const q=subPorIdade(a.nascimento,S.config.anoBase);a.subcategoria=q.cat===a.categoria?q.sub:(a.subcategoria&&GRUPO_DE[a.subcategoria]===a.categoria?a.subcategoria:'');}return a;}
function normJogo(j){if(j&&!GRUPOS[j.categoria]){const p=parseCat(j.categoria);j.categoria=p.cat||'Sub-17';}return j;}
const subTag=a=>a&&a.subcategoria?`<span class="subtag" title="${esc(a.subcategoria)}">${esc(a.subcategoria.replace('Sub-','S'))}</span>`:'';
const DEFAULT_CFG={capaTopo:'Preparação Física - Departamento de Futebol de Base',profissionais:[{nome:'Igor Sathler',cargo:'Preparador Físico / Fisiologista',ativo:true}],categorias:Object.keys(GRUPOS),anoBase:new Date().getFullYear(),competicoes:['Estadual','Copa Espírito Santo','Brasileiro','Amistoso'],duracao:{'Sub-11':50,'Sub-13':60,'Sub-15':70,'Sub-17':90,'Sub-20':90}};
const S={atletas:[],jogos:[],config:JSON.parse(JSON.stringify(DEFAULT_CFG)),
  filtro:{categoria:'Sub-17',sub:'Todas',competicao:'Todas',ano:'Todos',per:'ano'},
  view:'dashboard',carPag:0,mesDest:null,selMode:false,sel:new Set(),jogoSel:null,posSel:'VOL',atlSel:null,busca:'',online:false,canWrite:true,loaded:false};
try{const f=JSON.parse(localStorage.getItem('pv_filtro')||'null');if(f)Object.assign(S.filtro,f);const v=localStorage.getItem('pv_view');if(v)S.view=v;const th=localStorage.getItem('pv_theme');if(th)document.documentElement.dataset.theme=th;}catch(e){}

function fixCfg(c){const o={...DEFAULT_CFG,...c};o.categorias=Object.keys(GRUPOS);o.duracao={...DEFAULT_CFG.duracao,...(c.duracao||{})};o.anoBase=+o.anoBase||new Date().getFullYear();if(!Array.isArray(o.profissionais))o.profissionais=DEFAULT_CFG.profissionais;return o;}
const Store={db:null,
  local(){try{return JSON.parse(localStorage.getItem('pv_data')||'null');}catch(e){return null;}},
  saveLocal(){try{localStorage.setItem('pv_data',JSON.stringify({atletas:S.atletas,jogos:S.jogos,config:S.config}));}catch(e){}},
  async init(){
    const l=this.local();if(l){if(l.config)S.config=fixCfg(l.config);S.atletas=(l.atletas||[]).map(normAtleta);S.jogos=(l.jogos||[]).map(normJogo);}
    S.loaded=!!l;render();
    let db=null;
    try{ if(window.claude&&typeof window.claude.use==='function') db=await window.claude.use('db'); }catch(e){db=null;}
    if(!db){S.loaded=true;render();return;}
    this.db=db;S.online=true;
    try{const u=await window.claude.use('user');if(u&&typeof u.can==='function'){const c=await u.can('data.write');if(c===false)S.canWrite=false;}}catch(e){}
    let got=0;const done=()=>{got++;if(got>=3){S.loaded=true;}this.saveLocal();render();};
    db.collection('atletas').onSnapshot(s=>{S.atletas=s.docs.map(d=>normAtleta({...d.data(),id:d.id}));done();},e=>console.warn(e));
    db.collection('jogos').onSnapshot(s=>{S.jogos=s.docs.map(d=>normJogo({...d.data(),id:d.id}));done();},e=>console.warn(e));
    db.doc('config/main').onSnapshot(s=>{if(s.exists){S.config=fixCfg(s.data());S.atletas.forEach(normAtleta);}done();},e=>console.warn(e));
  },
  async put(col,obj){
    if(col==='atletas')normAtleta(obj);if(col==='jogos')normJogo(obj);const clean=JSON.parse(JSON.stringify(obj));
    const arr=S[col];const i=arr.findIndex(x=>x.id===obj.id);if(i>=0)arr[i]=clean;else arr.push(clean);
    this.saveLocal();
    if(this.db){const {id,...body}=clean;try{await this.db.collection(col).doc(id).set(body);}catch(e){this.err(e);throw e;}}
  },
  async del(col,id){
    S[col]=S[col].filter(x=>x.id!==id);this.saveLocal();
    if(this.db){try{await this.db.collection(col).doc(id).delete();}catch(e){this.err(e);}}
  },
  async putConfig(){
    this.saveLocal();
    if(this.db){try{await this.db.doc('config/main').set(JSON.parse(JSON.stringify(S.config)));}catch(e){this.err(e);}}
  },
  err(e){const c=e&&e.code;if(c==='invalid_argument'){S.canWrite=false;toast('Você não tem permissão para editar os dados deste sistema.');}else if(c==='quota_exceeded')toast('Limite de armazenamento atingido. Remova fotos ou registros antigos.');else toast('Não foi possível salvar agora. Tente novamente.');}
};

/* ================= CÁLCULOS ================= */
const anoDe=j=>(j.data||'').slice(0,4);
function noPeriodo(j,per){if(!per||per==='ano')return true;const m=+String(j.data||'').slice(5,7);if(!m)return false;if(per==='s1')return m<=6;if(per==='s2')return m>=7;if(per[0]==='m')return m===+per.slice(1);return true;}
function jogosFiltrados(){
  const f=S.filtro;
  return S.jogos.filter(j=>(f.categoria==='Todas'||j.categoria===f.categoria)&&(f.competicao==='Todas'||j.competicao===f.competicao)&&(f.ano==='Todos'||anoDe(j)===f.ano)&&noPeriodo(j,f.per))
    .sort((a,b)=>(a.data+(a.hora||'')).localeCompare(b.data+(b.hora||'')));
}
const subAtivo=()=>S.filtro.categoria!=='Todas'&&S.filtro.sub&&S.filtro.sub!=='Todas';
function atletasCat(){const c=S.filtro.categoria,sb=subAtivo()?S.filtro.sub:null;return S.atletas.filter(a=>(c==='Todas'||a.categoria===c)&&(!sb||a.subcategoria===sb));}
const dur=j=>Number(j.duracao)||S.config.duracao?.[j.categoria]||90;
function resultado(j){if(j.golsPro===''||j.golsPro==null||j.golsContra===''||j.golsContra==null)return ['V','E','D'].includes(j.resultado)?j.resultado:'N';const p=+j.golsPro,c=+j.golsContra;return p>c?'V':p<c?'D':'E';}
function calc(jogos,atletas){
  const byId={};atletas.forEach(a=>byId[a.id]={a,GS:0,min:0,J:0,T:0,R:0,NR:0,G:0,A:0,CA:0,CV:0,minT:0,minR:0});
  let tot=0,minT=0,minR=0,disp=0,nrCount=0;const mes=Array(12).fill(0);const porPos={};POS.forEach(p=>porPos[p]=0);
  jogos.forEach(j=>{
    const d=dur(j);const so=subAtivo();const rel=(j.relacionados||[]).filter(r=>!so||byId[r.atletaId]);disp+=rel.length*d;const relIds=new Set();
    rel.forEach(r=>{relIds.add(r.atletaId);const s=byId[r.atletaId];const m=Number(r.min)||0;
      tot+=m;if(r.status==='T')minT+=m;else minR+=m;const mm=parseInt((j.data||'').slice(5,7))-1;if(mm>=0)mes[mm]+=m;
      if(!s)return; s.min+=m;if(m>0)s.J++;if(r.status==='T'){s.T++;s.minT+=m;}else{s.R++;s.minR+=m;}
      s.G+=Number(r.gols)||0;s.GS+=Number(r.gs)||0;s.A+=Number(r.assist)||0;s.CA+=Number(r.ca)||0;s.CV+=Number(r.cv)||0;
      porPos[s.a.posicao]=(porPos[s.a.posicao]||0)+m;});
    atletas.forEach(a=>{if(!relIds.has(a.id)){byId[a.id].NR++;nrCount++;}});
  });
  const nJ=jogos.length;const lista=Object.values(byId);const totDur=jogos.reduce((t,j)=>t+dur(j),0);
  lista.forEach(s=>{s.disp=pct(s.min,totDur);s.mpj=s.J?s.min/s.J:0;});
  const usados=lista.filter(s=>s.min>0).length;
  return {totDur,lista,tot,minT,minR,nrCount,disp,nJ,mes,porPos,usados,mediaAtleta:usados?tot/usados:0,mediaJogo:nJ?tot/nJ:0,dispPct:pct(tot,disp)};
}
function periodo(jogos){
  const per=S.filtro.per;if(per&&per!=='ano'){const y=S.filtro.ano!=='Todos'?' '+S.filtro.ano:(jogos[0]?' '+jogos[0].data.slice(0,4):'');if(per==='s1')return '1º SEMESTRE'+y;if(per==='s2')return '2º SEMESTRE'+y;return MESESU[+per.slice(1)-1]+y;}
  if(!jogos.length)return '—';
  const a=jogos[0].data,b=jogos[jogos.length-1].data;if(!a||!b)return '—';
  const m1=MESESU[+a.slice(5,7)-1],m2=MESESU[+b.slice(5,7)-1],y1=a.slice(0,4),y2=b.slice(0,4);
  if(y1===y2)return m1===m2?`${m1} ${y1}`:`${m1} A ${m2} ${y1}`;return `${m1} ${y1} A ${m2} ${y2}`;
}
const compLabel=()=>S.filtro.competicao==='Todas'?'TODAS':S.filtro.competicao.toUpperCase();
const catLabel=()=>S.filtro.categoria==='Todas'?'TODAS':subAtivo()?S.filtro.sub.toUpperCase():S.filtro.categoria.toUpperCase();
const catLabelSp=()=>catLabel().replace('-',' ');

;

"use strict";
/* ================= COMPONENTES ================= */
function header(o){
  const left=`<img class="logo" src="${LOGO}" alt="Escudo Porto Vitória"><div><div class="t1">PORTO VITÓRIA</div><div class="t2">DEPARTAMENTO DE FUTEBOL DE BASE</div><div class="t3">${esc(o.sub)}</div></div>`;
  const center=o.title?`<div class="center"><div class="bigtitle">${esc(o.title)}</div>${o.subcat?`<div class="subcat">${esc(o.subcat)}</div>`:`<div class="pill">${esc(catLabelSp())}</div>`}</div>`:'<div class="center"></div>';
  let meta='';
  if(o.meta==='plain'){meta=`<div class="meta">${o.items.map(([k,v])=>`<div class="mi"><div><small>${k}</small><b>${esc(v)}</b></div></div>`).join('')}</div>`;}
  else if(o.meta==='icons'){meta=`<div class="meta">${o.items.map(([ic,k,v])=>`<div class="mi">${ic}<div><small>${k}</small><b>${esc(v)}</b></div></div>`).join('')}</div>`;}
  const slogan=`<div class="slogan ${o.sloganBar?'bar':''}">Disciplina<br>Desenvolvimento<br>Performance</div>`;
  return `<header class="rhead">${left}${center}${meta}${slogan}</header>`;
}
let PG={i:1,n:1},PDFMODE=false;
function footer(label,legend){
  return `<footer class="rfoot"><img src="${LOGO}" alt=""><div class="club"><b>PORTO VITÓRIA</b><span>DEPARTAMENTO DE FUTEBOL DE BASE</span></div>
  ${legend?`<div class="leg">${legend}</div>`:`<div class="mid"><hr><span>${esc(label)}</span><hr></div>`}
  <div style="white-space:nowrap">DATA DE EMISSÃO: ${hoje()}</div><div style="white-space:nowrap">PÁGINA <b>${PG.i}</b> DE ${PG.n}</div></footer>`;
}
const kpi=(ic,k,v,s)=>`<div class="kpi">${ic}<div style="min-width:0"><div class="k">${k}</div><div class="v">${v}</div><div class="s">${s}</div></div></div>`;
function donut(segs,size=190,th=34,big='',small=''){
  const r=(size-th)/2,C=2*Math.PI*r,total=segs.reduce((t,s)=>t+s.v,0)||1;let off=0;
  const arcs=segs.map(s=>{const len=s.v/total*C;const a=`<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${s.c}" stroke-width="${th}" stroke-dasharray="${len} ${C-len}" stroke-dashoffset="${-off}" transform="rotate(-90 ${size/2} ${size/2})"/>`;off+=len;return a;}).join('');
  return `<div class="donut" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(big)} ${esc(small)}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="${th}"/>${arcs}</svg><div class="c"><b>${big}</b><span>${small}</span></div></div>`;
}
function ring(p,size=56){
  const th=6,r=(size-th)/2,C=2*Math.PI*r,len=Math.min(100,p)/100*C;const col=p>=70?'#39b54a':p>=50?'#f6c21c':'#e3342b';
  return `<div class="r"><svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="${th}"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${col}" stroke-width="${th}" stroke-dasharray="${len} ${C}" transform="rotate(-90 ${size/2} ${size/2})" stroke-linecap="round"/></svg><b>${p}%</b></div>`;
}
const dispColor=p=>p>=70?'linear-gradient(90deg,#2a9d4b,#46c06a)':p>=50?'linear-gradient(90deg,#f2b51b,#f8cd3c)':p>=35?'linear-gradient(90deg,#f0782b,#f59a48)':'linear-gradient(90deg,#e3342b,#ef5a4f)';
function emptyReport(msg){
  return `<div class="empty"><h3>${msg||'Ainda não há jogos para este filtro'}</h3><p>Cadastre atletas e jogos para gerar os relatórios de minutagem, ou mude o filtro de categoria, competição e ano no topo.</p>
  <div class="acts">${S.canWrite?`<button class="btn pri" data-go="importar">${IC.up} Importar planilha de minutagem</button><button class="btn" data-go="jogos-lista">${IC.plus} Cadastrar jogo</button><button class="btn" data-go="atletas">${IC.users} Cadastrar atletas</button>${!S.atletas.length&&!S.jogos.length?`<button class="btn gold" data-act="demo">Carregar dados de exemplo</button>`:''}`:''}</div></div>`;
}

/* ================= 1. DASHBOARD (imagem 1) ================= */
function viewDashboard(o={}){
  const jogos=jogosFiltrados(),ats=atletasCat(),c=calc(jogos,ats);
  const h=header({sub:'RELATÓRIO DE MINUTAGEM — TODO O ELENCO',meta:'plain',items:[['Categoria',catLabelSp()],['Competição',compLabel()],['Período',periodo(jogos)],['Total de jogos',String(c.nJ)]]});
  if(!jogos.length)return `<div class="report">${h}<div class="rbody">${emptyReport()}</div></div>`;
  const kp=`<div class="kpis">
    ${kpi(IC.kClock,'Minutos totais',nf(c.tot),'Total do elenco')}
    ${kpi(IC.kUser2,'Média por atleta',nf(c.mediaAtleta),'Minutos / atleta')}
    ${kpi(IC.kCal,'Jogos disputados',c.nJ,'Total de jogos')}
    ${kpi(IC.kBars,'Média por jogo',nf(c.mediaJogo),'Minutos por partida')}
    ${kpi(IC.kTeam,'Atletas utilizados',c.usados,'Do elenco total')}
    ${kpi(IC.kPie,'% Minutos disponíveis',c.dispPct+'%','De '+nf(c.disp)+' minutos')}</div>`;
  const maxPos=Math.max(1,...POS.map(p=>c.porPos[p]));
  const dist=`<div class="panel"><div class="ph">Distribuição de minutos por posição</div><div class="pb"><div class="dist">
    ${POS.map(p=>`<div class="nm"><span class="dot" style="background:${PC1[p]}">${POSICON[p]}</span>${POSN[p]}</div><div class="track"><i style="width:${c.porPos[p]/maxPos*100}%"></i></div><div class="vv">${nf(c.porPos[p])}</div><div class="pp">${nf(c.tot?c.porPos[p]/c.tot*100:0,1)}%</div>`).join('')}</div></div></div>`;
  // evolução por mês: meses entre primeiro e último jogo
  const m1=+jogos[0].data.slice(5,7)-1,m2=+jogos[jogos.length-1].data.slice(5,7)-1;
  const sameYear=jogos[0].data.slice(0,4)===jogos[jogos.length-1].data.slice(0,4);
  const meses=[];if(sameYear){for(let m=m1;m<=m2;m++)meses.push(m);}else{for(let m=0;m<12;m++)meses.push(m);}
  const maxM=Math.max(500,...meses.map(m=>c.mes[m]));const step=maxM>4000?1000:500;const top=Math.ceil(maxM/step)*step;const ticks=[];for(let v=top;v>=0;v-=step)ticks.push(v);
  const evo=`<div class="panel"><div class="ph">Evolução de minutos por mês</div><div class="pb"><div class="vchart">
    <div class="yaxis">${ticks.map(t=>`<span>${nf(t)}</span>`).join('')}</div>
    <div class="plot">${ticks.slice(0,-1).map(t=>`<div class="gl" style="bottom:${t/top*100}%"></div>`).join('')}
    ${meses.map(m=>`<div class="col"><div class="bar" style="height:${c.mes[m]/top*100}%">${c.mes[m]?`<b>${nf(c.mes[m])}</b>`:''}<small>${MESES[m]}</small></div></div>`).join('')}</div></div></div></div>`;
  const tot3=c.minT+c.minR;
  const sit=`<div class="panel"><div class="ph">Minutos por situação</div><div class="pb"><div class="donut-wrap">
    ${donut([{v:c.minT,c:'#0f6a35'},{v:c.minR,c:'#5fd06c'}],180,34,nf(c.tot),'minutos')}
    <div class="legend"><div class="li"><span class="sw" style="background:#0f6a35"></span><div><b>Titular</b><span>${nf(c.minT)} (${pct(c.minT,tot3)}%)</span></div></div>
    <div class="li"><span class="sw" style="background:#5fd06c"></span><div><b>Reserva</b><span>${nf(c.minR)} (${pct(c.minR,tot3)}%)</span></div></div>
    <div class="li"><span class="sw" style="background:#b5bcb8"></span><div><b>Não relacionado</b><span>${nf(c.nrCount)} ${c.nrCount===1?'ocorrência':'ocorrências'}</span></div></div></div></div></div></div>`;
  const pcs=POS.map(p=>{const at=c.lista.filter(s=>s.a.posicao===p);const us=at.filter(s=>s.min>0).length;const m=c.porPos[p];
    return `<div class="pc"><div class="pch" style="background:${PC1[p]}">${POSICON[p]}${POSP[p]}</div><div class="pv"><b>${nf(m)}</b><span>Minutos totais</span></div>
    <div class="ps"><div><b>${us}</b><span>Atletas utilizados</span></div><div><b>${nf(us?m/us:0)}</b><span>Média por atleta</span></div></div></div>`;}).join('');
  const allRows=c.lista.filter(s=>s.T+s.R>0).sort((a,b)=>b.min-a.min);const rows=o.rows?allRows.slice(0,o.rows):allRows;
  const tbl=`<div class="panel" style="margin-top:16px"><div class="ph">Detalhamento por atleta<span class="r">${o.rows&&allRows.length>rows.length?`Top ${rows.length} de ${allRows.length} atletas`:rows.length+' atletas'}</span></div><div class="tbl-frame"><div class="tbl-wrap"><table class="t">
   <thead><tr><th>#</th><th style="min-width:180px">Atleta</th><th style="min-width:140px">Posição</th><th>Jogos</th><th>Titular</th><th>Reserva</th><th>Não rel.</th><th>Minutos</th><th>% Disp.</th><th>Média/Jogo</th><th>Gols</th><th>Assist.</th><th>Amar.</th><th>Verm.</th></tr></thead><tbody>
   ${rows.map((s,i)=>`<tr><td>${i+1}</td><td class="l">${esc(s.a.nome)}${subTag(s.a)}</td><td class="poscell" style="background:${PCELL[s.a.posicao]}!important">${esc(s.a.posDetalhe||POSN[s.a.posicao])}</td><td>${s.J}</td><td>${s.T}</td><td>${s.R}</td><td>${s.NR}</td><td>${nf(s.min)}</td><td>${s.disp}%</td><td>${nf(s.mpj,1)}</td><td>${s.G}</td><td>${s.A}</td><td>${s.CA}</td><td>${s.CV}</td></tr>`).join('')}
   </tbody></table></div></div></div>`;
  return `<div class="report">${h}<div class="rbody">${kp}<div class="grid3">${dist}${evo}${sit}</div>
    <div class="panel"><div class="ph">Minutagem por posição</div><div class="poscards">${pcs}</div></div>${tbl}${footer('RELATÓRIO DE MINUTAGEM')}</div></div>`;
}

/* ================= 2. MINUTAGEM GERAL (imagem 2) ================= */
function viewGeral(){
  const jogos=jogosFiltrados(),ats=atletasCat(),c=calc(jogos,ats);
  const h=header({sub:'RELATÓRIO DE MINUTAGEM — GERAL DOS ATLETAS',title:'MINUTAGEM GERAL',meta:'icons',sloganBar:true,items:[[IC.trophy,'Competição',compLabel()],[IC.kCalPlus,'Período',periodo(jogos)],[IC.ballF,'Total de jogos',String(c.nJ)]]});
  if(!jogos.length)return `<div class="report">${h}<div class="rbody">${emptyReport()}</div></div>`;
  const kp=`<div class="kpis">
    ${kpi(IC.kClock,'Minutos totais',nf(c.totDur),'Soma da duração dos '+c.nJ+' jogos')}
    ${kpi(IC.kTeam,'Média por atleta',nf(c.mediaAtleta),'Minutos / atleta')}
    ${kpi(IC.kCalPlus,'Jogos disputados',c.nJ,'Total de jogos')}
    ${kpi(IC.kTeam,'Atletas utilizados',c.usados,'Do elenco')}
    ${kpi(IC.kPie,'% Minutos disponíveis',c.dispPct+'%','De '+nf(c.disp)+' minutos')}
    ${kpi(IC.kBars,'Média por jogo',nf(c.mediaJogo),'Minutos por partida')}</div>`;
  const rows=c.lista.slice().sort((a,b)=>b.min-a.min||b.T-a.T);
  const half=Math.ceil(rows.length/2);
  const tb=(arr,start)=>`<div class="panel"><div class="tbl-wrap"><table class="t"><thead><tr><th>#</th><th style="min-width:150px">Atleta</th><th>Pos</th><th>Min</th><th>J</th><th>T</th><th>R</th><th>NR</th><th style="min-width:130px">% Disp.</th><th>G</th><th>A</th><th><span class="sq" style="display:inline-block;width:12px;height:15px;background:var(--yellow);border-radius:2px;vertical-align:middle"></span></th><th><span style="display:inline-block;width:12px;height:15px;background:var(--red);border-radius:2px;vertical-align:middle"></span></th><th>Méd/J</th></tr></thead><tbody>
   ${arr.map((s,i)=>`<tr><td>${start+i+1}</td><td class="l"><div class="athcell"><img class="ava" src="${fotoDe(s.a)}" alt="">${esc(s.a.nome)}${subTag(s.a)}</div></td><td><span class="ptag" style="background:${PC2[s.a.posicao]}">${s.a.posicao}</span></td><td>${nf(s.min)}</td><td>${s.J}</td><td>${s.T}</td><td>${s.R}</td><td>${s.NR}</td>
   <td><div class="mbar"><span style="min-width:30px;text-align:right">${s.disp}%</span><span class="track"><i style="width:${s.disp}%;background:${dispColor(s.disp)}"></i></span></div></td><td>${s.G}</td><td>${s.A}</td><td>${s.CA}</td><td>${s.CV}</td><td>${nf(s.mpj)}</td></tr>`).join('')}</tbody></table></div></div>`;
  const posL=POS.filter(p=>p!=='EXT'||c.porPos.EXT>0);const order=['GOL','ZAG','LAT','VOL','MEI','ATA','EXT'].filter(p=>posL.includes(p));
  const maxP=Math.max(1,...order.map(p=>c.porPos[p]));
  const mp=`<div class="panel"><div class="ph">Minutos por posição</div><div class="pb"><div class="vbars">${order.map(p=>`<div class="vb"><i style="height:${c.porPos[p]/maxP*100}%;background:${PC2[p]}"></i></div>`).join('')}</div>
    <div class="vlabels">${order.map(p=>`<div><b>${POSS[p]}</b><strong>${nf(c.porPos[p])}</strong><span>(${pct(c.porPos[p],c.tot)}%)</span></div>`).join('')}</div></div></div>`;
  const tot3=c.minT+c.minR;
  const dm=`<div class="panel"><div class="ph">Distribuição de minutos</div><div class="pb"><div class="donut-wrap">${donut([{v:c.minT,c:'#0b4a28'},{v:c.minR,c:'#2fbf5f'}],160,24,nf(c.tot),'minutos')}
    <div class="legend"><div class="li"><span class="sw round" style="background:#0b4a28"></span><div><b>Titular</b><span>${nf(c.minT)} (${pct(c.minT,tot3)}%)</span></div></div>
    <div class="li"><span class="sw round" style="background:#2fbf5f"></span><div><b>Reserva</b><span>${nf(c.minR)} (${pct(c.minR,tot3)}%)</span></div></div>
    <div class="li"><span class="sw round" style="background:#b5bcb8"></span><div><b>Não relacionado</b><span>${nf(c.nrCount)} ocorrências</span></div></div></div></div></div></div>`;
  const occ=c.lista.reduce((t,s)=>t+s.T+s.R+s.NR,0)||1;const tT=c.lista.reduce((t,s)=>t+s.T,0),tR=c.lista.reduce((t,s)=>t+s.R,0);
  const sit=`<div class="panel"><div class="ph">Minutos por situação</div><div class="pb"><div class="hsit">
    <div class="lb">Titular</div><div class="hb"><i style="width:${pct(c.minT,tot3)}%;background:linear-gradient(90deg,#062a17,#0e6a35)"></i><b>${pct(c.minT,tot3)}%</b></div><div class="nv">${nf(c.minT)}</div>
    <div class="lb">Reserva</div><div class="hb"><i style="width:${pct(c.minR,tot3)}%;background:linear-gradient(90deg,#2a8f45,#4cc06a)"></i><b>${pct(c.minR,tot3)}%</b></div><div class="nv">${nf(c.minR)}</div>
    <div class="lb">Não relacionado</div><div class="hb"><i style="width:${pct(c.nrCount,occ)}%;background:#a9b1ad"></i><b>${pct(c.nrCount,occ)}%</b></div><div class="nv">${nf(c.nrCount)} oc.</div>
  </div><div class="muted" style="font-size:12px;padding:0 6px">Titular e Reserva em minutos jogados · Não relacionado em % das convocações possíveis (${tT} titular, ${tR} reserva, ${c.nrCount} fora).</div></div></div>`;
  const legend=`<b>LEGENDA:</b> <span>J = Jogos disputados</span><span>T = Titular</span><span>R = Reserva</span><span>NR = Não relacionado</span><span><b>% DISP.</b> = Percentual de minutos disponíveis</span><span>G = Gols</span><span>A = Assistências</span><span><i class="sq" style="background:var(--yellow)"></i>= Cartão amarelo</span><span><i class="sq" style="background:var(--red)"></i>= Cartão vermelho</span><span><b>MÉD/J</b> = Média por jogo</span>`;
  return `<div class="report">${h}<div class="rbody">${kp}<div class="duo">${tb(rows.slice(0,half),0)}${rows.length>1?tb(rows.slice(half),half):''}</div>
   <div class="grid3b">${mp}${dm}${sit}</div>${footer('',legend)}</div></div>`;
}

;

"use strict";
/* ================= CAMPO / ESCALAÇÃO ================= */
function shirt(num,gk){
  const body=gk?'#f2c218':'#ffffff',txt=gk?'#1b1b1b':'#0e4a29';
  return `<svg viewBox="0 0 48 48"><path d="M16 4 5 10l4 9 4-2v25h22V17l4 2 4-9-11-6c-1 3-4 5-8 5s-7-2-8-5z" fill="${body}" stroke="#0b2b18" stroke-width="1.2"/><text x="24" y="33" text-anchor="middle" font-family="Barlow Condensed,Arial" font-weight="800" font-size="17" fill="${txt}">${esc(num)}</text></svg>`;
}
function pitchLines(){
  return `<svg class="lines" viewBox="0 0 100 90" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="rgba(255,255,255,.85)" stroke-width=".5">
  <line x1="0" y1="45" x2="100" y2="45"/><circle cx="50" cy="45" r="9"/><rect x="22" y="0" width="56" height="14"/><rect x="36" y="0" width="28" height="5"/><rect x="22" y="76" width="56" height="14"/><rect x="36" y="85" width="28" height="5"/>
  <path d="M40 14a10 7 0 0 0 20 0"/><path d="M40 76a10 7 0 0 1 20 0"/></g><circle cx="50" cy="45" r=".8" fill="#fff"/></svg>`;
}
function pitch(jogo,editable=false,sel=-1,extra=null){
  const f=FORMACOES[jogo.formacao]||FORMACOES['4-2-3-1'];const esc_=jogo.escalacao||[];
  return `<div class="pitch">${pitchLines()}${f.map(([x,y,p],i)=>{const a=S.atletas.find(t=>t.id===esc_[i]);
    const num=a&&a.numero?a.numero:i+1;
    return `<div class="pl-tok ${a?'':'empty'} ${sel===i?'sel':''}" style="left:${x}%;top:${y}%" ${editable?`data-slot="${i}" role="button" tabindex="0" aria-label="Posição ${i+1}"`:''}>${shirt(num,p==='GOL')}<span class="nm">${a?esc(a.apelido||a.nome):(editable?POSN[p]:'—')}</span>${extra&&a?extra(a):''}</div>`;}).join('')}</div>`;
}

/* ================= 3. MINUTAGEM POR JOGO (imagem 3) ================= */
function viewPorJogo(jid){
  const jogos=jogosFiltrados();
  const h=header({sub:'RELATÓRIO DE MINUTAGEM — POR JOGO',title:'MINUTAGEM POR JOGO',sloganBar:true});
  if(!jogos.length)return `<div class="report">${h}<div class="rbody">${emptyReport()}</div></div>`;
  let j=jogos.find(x=>x.id===(jid||S.jogoSel));if(!j){j=jogos[jogos.length-1];if(!jid)S.jogoSel=j.id;}
  const ats=S.atletas.filter(a=>a.categoria===j.categoria);const d=dur(j);
  const rel=(j.relacionados||[]).map(r=>({...r,a:S.atletas.find(a=>a.id===r.atletaId)})).filter(r=>r.a);
  const ordem=r=>(r.status==='T'?0:1)*1000+POS.indexOf(r.a.posicao);
  const tit=rel.filter(r=>r.status==='T').sort((a,b)=>(j.escalacao||[]).indexOf(a.atletaId)-(j.escalacao||[]).indexOf(b.atletaId)||ordem(a)-ordem(b));
  const res=rel.filter(r=>r.status==='R').sort((a,b)=>(b.min||0)-(a.min||0));
  const relIds=new Set(rel.map(r=>r.atletaId));const nrl=ats.filter(a=>!relIds.has(a.id)).sort((a,b)=>POS.indexOf(a.posicao)-POS.indexOf(b.posicao)||a.nome.localeCompare(b.nome));
  const tot=rel.reduce((t,r)=>t+(+r.min||0),0),usados=rel.filter(r=>+r.min>0).length,resUs=res.filter(r=>+r.min>0).length;
  const minT=tit.reduce((t,r)=>t+(+r.min||0),0),minR=tot-minT;
  const casa=j.mando!=='fora';const adv={n:j.adversario,l:j.logoAdv||shieldSVG(j.adversario)},pv={n:'Porto Vitória',l:LOGO};
  const A=casa?pv:adv,B=casa?adv:pv;const gA=casa?j.golsPro:j.golsContra,gB=casa?j.golsContra:j.golsPro;
  const bar=`<div class="gamebar">
    <div class="gb sel"><label for="selJogo">Selecione o jogo:</label>${PDFMODE?`<div class="fakesel">${esc(j.mando==='fora'?`${j.adversario} x Porto Vitória`:`Porto Vitória x ${j.adversario}`)}<span>▾</span></div>`:`<select id="selJogo">${jogos.slice().reverse().map(x=>`<option value="${x.id}" ${x.id===j.id?'selected':''}>${esc(x.mando==='fora'?`${x.adversario} x Porto Vitória`:`Porto Vitória x ${x.adversario}`)} · ${fmtData(x.data)}</option>`).join('')}</select>`}</div>
    <div class="gb">${IC.trophy}<div><small>Competição</small><b>${esc(j.competicao)} ${esc((j.categoria||'').replace('-',' '))}</b></div></div>
    <div class="gb">${IC.kCalPlus}<div><small>Data</small><b>${fmtData(j.data)}${j.hora?' · '+esc(j.hora):''}</b></div></div>
    <div class="gb">${IC.stadium}<div><small>Local</small><b>${esc(j.local||'—')}</b></div></div>
    <div class="gb score"><div class="tm"><img src="${A.l}" alt="">${esc(A.n)}</div><div class="pl">${gA??'-'}<em>x</em>${gB??'-'}</div><div class="tm"><img src="${B.l}" alt="">${esc(B.n)}</div></div></div>`;
  const kp=`<div class="kpis k6b">
    ${kpi(IC.kClock,'Minutos totais',d+"'",'Duração do jogo')}
    ${kpi(IC.kTeam,'Média por atleta',nf(usados?tot/usados:0,1),'Minutos / atleta')}
    ${kpi(IC.kTeam,'Atletas utilizados',usados,'De '+rel.length+' relacionados')}
    ${kpi(IC.kShirt,'Titulares',tit.length,pct(tit.length,rel.length)+'% dos relacionados')}
    ${kpi(IC.kSwap,'Reservas utilizadas',resUs,pct(resUs,rel.length)+'% dos relacionados')}
    ${kpi(IC.kUserX,'Não relacionados',nrl.length,pct(nrl.length,ats.length)+'% do elenco ('+ats.length+')')}</div>`;
  const all=[...tit,...res];
  const relT=`<div class="panel"><div class="ph">Atletas relacionados (${rel.length})</div><div class="tbl-wrap"><table class="t"><thead><tr><th>#</th><th style="min-width:160px">Atleta</th><th>Pos</th><th>Status</th><th>Min</th></tr></thead><tbody>
   ${all.map((r,i)=>`<tr><td>${i+1}</td><td class="l"><div class="athcell"><img class="ava" src="${fotoDe(r.a)}" alt="">${esc(r.a.nome)}${subTag(r.a)}${+r.gols?` <span title="Gols">⚽${+r.gols>1?'×'+r.gols:''}</span>`:''}${+r.assist?` <span class="ico-boot" title="Assistências">${IC.boot}${+r.assist>1?'×'+r.assist:''}</span>`:''}</div></td><td><span class="ptag" style="background:${PC2[r.a.posicao]}">${r.a.posicao}</span></td><td><span class="st-badge st-${r.status}">${r.status==='T'?'Titular':'Reserva'}</span></td><td>${+r.min||0}</td></tr>`).join('')}</tbody></table></div></div>`;
  const form=`<div class="panel"><div class="ph">Formação inicial (${esc(j.formacao||'4-2-3-1')})</div><div style="background:#0f3d22;padding:2px">${pitch(j)}</div></div>`;
  const pp={};POS.forEach(p=>pp[p]=0);rel.forEach(r=>pp[r.a.posicao]+=(+r.min||0));
  const ordP=['GOL','ZAG','LAT','VOL','MEI','ATA','EXT'].filter(p=>p!=='EXT'||pp.EXT>0);const mx=Math.max(1,...ordP.map(p=>pp[p]));
  const mpos=`<div class="panel" style="margin-bottom:12px"><div class="ph">Minutos por posição</div><div class="pb"><div class="hbars">${ordP.map(p=>`<div class="lb">${POSS[p]}</div><div class="hb"><i style="width:${pp[p]/mx*72}%;background:${PC3[p]}"></i><b>${nf(pp[p])} <span>(${pct(pp[p],tot)}%)</span></b></div>`).join('')}</div></div></div>`;
  const dist=`<div class="panel"><div class="ph">Distribuição de minutos</div><div class="pb"><div class="donut-wrap">${donut([{v:minT,c:'#0b4a28'},{v:minR,c:'#2fae57'}],150,26,nf(tot),'minutos')}
    <div class="legend"><div class="li"><span class="sw round" style="background:#0b4a28"></span><div><b>Titulares</b><span>${nf(minT)} (${pct(minT,tot)}%)</span></div></div><div class="li"><span class="sw round" style="background:#2fae57"></span><div><b>Reservas</b><span>${nf(minR)} (${pct(minR,tot)}%)</span></div></div></div></div></div></div>`;
  const half=Math.ceil(nrl.length/2);const mot=j.motivos||{};
  const nrT=(arr,st)=>`<div class="tbl-wrap" style="flex:1;min-width:300px"><table class="t"><thead><tr><th>#</th><th style="min-width:150px">Atleta</th><th>Pos</th><th style="min-width:160px">Motivo</th></tr></thead><tbody>${arr.map((a,i)=>`<tr><td>${rel.length+st+i+1}</td><td class="l"><div class="athcell"><img class="ava" src="${fotoDe(a)}" alt="">${esc(a.nome)}${subTag(a)}</div></td><td><span class="ptag" style="background:${PC2[a.posicao]}">${a.posicao}</span></td><td class="l">${esc(mot[a.id]||'Opção técnica')}</td></tr>`).join('')}</tbody></table></div>`;
  const nr=`<div class="panel"><div class="ph">Não relacionados (${nrl.length})</div>${nrl.length?`<div style="display:flex;gap:12px;flex-wrap:wrap;padding:0">${nrT(nrl.slice(0,half),0)}${nrT(nrl.slice(half),half)}</div>`:'<div class="pb muted">Todo o elenco da categoria foi relacionado.</div>'}</div>`;
  return `<div class="report">${h}<div class="rbody">${bar}${kp}<div class="pj-grid">${relT}${form}<div>${mpos}${dist}</div></div>${nr}${footer('RELATÓRIO DE MINUTAGEM — POR JOGO — '+catLabelSp())}</div></div>`;
}

/* ================= 4. INDIVIDUAL POR POSIÇÃO (imagem 4) ================= */
/* divide n atletas em páginas de no máximo 5, o mais equilibrado possível (8→4+4, 9→5+4, 6→3+3, 11→4+4+3) */
function dividir(n,max=5){const k=Math.max(1,Math.ceil(n/max));const base=Math.floor(n/k),extra=n%k;const out=[];let i=0;for(let x=0;x<k;x++){const t=base+(x<extra?1:0);out.push([i,i+t]);i+=t;}return out;}
function viewPosicao(pp,part){
  const jogos=jogosFiltrados(),ats=atletasCat();const p=pp||S.posSel;
  const c=calc(jogos,ats);
  const h=header({sub:'RELATÓRIO DE MINUTAGEM — POR POSIÇÃO',title:POSP[p].toUpperCase(),subcat:catLabelSp(),meta:'icons',sloganBar:true,items:[[IC.trophy,'Competição',compLabel()],[IC.kCalPlus,'Período',periodo(jogos)],[IC.ballF,'Total de jogos',String(c.nJ)]]});
  const tabs=PDFMODE?'':`<div class="pos-tabs no-print">${POS.map(x=>`<button class="chip ${x===p?'on':''}" data-pos="${x}"><i style="background:${PC1[x]}"></i>${POSP[x]}</button>`).join('')}</div>`;
  const lst=c.lista.filter(s=>s.a.posicao===p).sort((a,b)=>b.min-a.min);
  if(!jogos.length||!lst.length)return `${tabs}<div class="report">${h}<div class="rbody">${!jogos.length?emptyReport():emptyReport('Nenhum atleta cadastrado como '+POSN[p].toLowerCase()+' nesta categoria')}</div></div>`;
  const partes=dividir(lst.length);const pi=part!=null?Math.min(part,partes.length-1):null;const lstCards=pi!=null?lst.slice(partes[pi][0],partes[pi][1]):lst;
  const cards=lstCards.map(s=>{const a=s.a;const bio=[a.subcategoria||'',idade(a.nascimento)!==''?idade(a.nascimento)+' anos':'',a.altura?nf(a.altura,2)+' m':'',a.peso?nf(a.peso,1).replace(',0','')+' kg':'',a.gordura!==''&&a.gordura!=null?nf(a.gordura,1)+'% G':''].filter(Boolean).join(' | ');
    return `<div class="acard"><div class="photo"><img src="${fotoDe(a)}" alt="Foto de ${esc(a.nome)}"><div class="foot">${IC.foot}<span>Pé<br>${esc((a.pe||'—').toUpperCase())}</span></div><div class="ring">${ring(s.disp)}<div style="margin-top:4px">DISP.</div></div></div>
    <div class="name">${esc(a.nome)}</div><div class="bio">${esc(bio)||'&nbsp;'}</div>
    <div class="st"><div>${IC.clock}Minutos<b>${nf(s.min)}</b></div><div>${IC.ballF}Jogos<b>${s.J}</b></div><div>${IC.stShirt}Titular<b>${s.T}</b></div><div>${IC.bench}Reserva<b>${s.R}</b></div><div>${IC.ballF}${p==='GOL'?'Gols sofridos':'Gols'}<b>${p==='GOL'?s.GS:s.G}</b></div><div>${IC.boot}Assistências<b>${s.A}</b></div></div>
    <div class="cards"><span><i style="background:var(--yellow)"></i>${s.CA}</span><span><i style="background:var(--red)"></i>${s.CV}</span></div></div>`;}).join('');
  const tot=lst.reduce((t,s)=>t+s.min,0),us=lst.filter(s=>s.min>0).length,disp=lst.length*c.totDur;
  const mT=lst.reduce((t,s)=>t+s.minT,0),mR=lst.reduce((t,s)=>t+s.minR,0),nrc=lst.reduce((t,s)=>t+s.NR,0);
  const res=`<div class="panel"><div class="ph">Resumo dos ${POSP[p].toLowerCase()}</div><div class="pb"><div class="mini-kpis">
    ${kpi(IC.kClock,'Minutos totais',nf(tot),'Total da posição')}${kpi(IC.kTeam,'Média por atleta',nf(us?tot/us:0),'Minutos / atleta')}${kpi(IC.kCalPlus,'Jogos disputados',c.nJ,'Total de jogos')}
    ${kpi(IC.kBars,'Média por jogo',nf(c.nJ?tot/c.nJ:0),'Minutos por partida')}${kpi(IC.kTeam,'Atletas utilizados',us,'Da posição')}${kpi(IC.kPie,'% Minutos disponíveis',pct(tot,disp)+'%','De '+nf(disp)+' minutos')}</div></div></div>`;
  const mx=Math.max(500,...lst.map(s=>s.min));const step=mx>2500?1000:500;const top=Math.ceil(mx/step)*step;const tk=[];for(let v=0;v<=top;v+=step)tk.push(v);
  const dist=`<div class="panel"><div class="ph">Distribuição de minutos</div><div class="pb"><div class="hdist">${lst.map(s=>`<div>${esc(s.a.nome)}</div><div class="track"><i style="width:${s.min/top*100}%;background:linear-gradient(90deg,#17834a,#2fb064)"></i></div><div class="vv">${nf(s.min)}</div>`).join('')}
    <div></div><div class="axis">${tk.map(t=>`<span>${nf(t)}</span>`).join('')}</div><div></div></div></div></div>`;
  const t3=mT+mR;
  const sit=`<div class="panel"><div class="ph">Minutos por situação</div><div class="pb"><div class="donut-wrap" style="flex-wrap:wrap">${donut([{v:mT,c:'#0b4a28'},{v:mR,c:'#5fd06c'}],170,30,nf(tot),'minutos')}
    <div class="legend"><div class="li"><span class="sw round" style="background:#0b4a28"></span><div><b>Titular</b><span>${nf(mT)} (${pct(mT,t3)}%)</span></div></div><div class="li"><span class="sw round" style="background:#5fd06c"></span><div><b>Reserva</b><span>${nf(mR)} (${pct(mR,t3)}%)</span></div></div><div class="li"><span class="sw round" style="background:#b5bcb8"></span><div><b>Não relacionado</b><span>${nrc} ocorrências</span></div></div></div></div></div></div>`;
  return `${tabs}<div class="report">${h}<div class="rbody"><div class="pcards"${pi!=null?` style="grid-auto-flow:row;grid-template-columns:repeat(${lstCards.length},calc((100% - 64px) / 5));justify-content:center"`:''}>${cards}</div><div class="pos-grid">${res}${dist}${sit}</div>${footer('RELATÓRIO DE MINUTAGEM — POR POSIÇÃO'+(pi!=null&&partes.length>1?` — ${POSP[p].toUpperCase()} ${pi+1}/${partes.length}`:''))}</div></div>`;
}

;

"use strict";
/* ================= ATLETAS ================= */
function viewAtletas(){
  const q=S.busca.toLowerCase();const c=S.filtro.categoria;
  const list=atletasCat().filter(a=>(!q||a.nome.toLowerCase().includes(q))).sort((a,b)=>POS.indexOf(a.posicao)-POS.indexOf(b.posicao)||a.nome.localeCompare(b.nome));
  const subs=c!=='Todas'?GRUPOS[c].map(sb=>`${sb}: <b>${list.filter(a=>a.subcategoria===sb).length}</b>`).join(' · ')+(list.some(a=>!a.subcategoria)?` · sem sub: <b>${list.filter(a=>!a.subcategoria).length}</b>`:''):'';
  const head=`<div class="page-h"><h2>Atletas ${c!=='Todas'?'· '+esc(subAtivo()?S.filtro.sub:c):''}</h2><span class="muted">${list.length} cadastrados${subs?' · '+subs:''}</span><span class="sp"></span><input class="search" id="busca" placeholder="Buscar atleta" value="${esc(S.busca)}" aria-label="Buscar atleta">${S.canWrite&&S.atletas.length?`<button class="btn ${S.selMode?'gold':''}" data-act="selMode">${S.selMode?'Cancelar seleção':'☑ Selecionar'}</button><button class="btn danger" data-act="limpar">${IC.trash} Limpar dados</button>`:''}<button class="btn" data-act="expAtletas">${IC.down} Exportar Excel</button>${S.canWrite?`<label class="btn" style="cursor:pointer">🖼️ Importar fotos<input type="file" id="fotosLote" accept="image/png,image/jpeg,image/webp" multiple hidden></label><button class="btn" data-go="importar">${IC.up} Importar Excel</button><button class="btn pri" data-act="novoAtleta">${IC.plus} Novo atleta</button>`:''}</div>`;
  if(!list.length)return head+`<div class="empty"><h3>Nenhum atleta ${q?'encontrado':'cadastrado nesta categoria'}</h3><p>O cadastro do atleta alimenta todos os relatórios: posição e pé aparecem nos cards por posição, e idade, estatura, peso e % de gordura entram na ficha individual.</p><div class="acts">${S.canWrite?`<button class="btn pri" data-go="importar">${IC.up} Importar planilha Excel</button><button class="btn" data-act="novoAtleta">${IC.plus} Cadastrar atleta</button>${!S.atletas.length&&!S.jogos.length?'<button class="btn gold" data-act="demo">Carregar dados de exemplo</button>':''}`:''}</div></div>`;
  const selBar=S.selMode?`<div class="panel" style="padding:10px 14px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:6px;position:sticky;top:0;z-index:5"><label style="display:flex;gap:8px;align-items:center;font-weight:700;cursor:pointer"><input type="checkbox" id="selAll" ${list.length&&list.every(a=>S.sel.has(a.id))?'checked':''} style="width:18px;height:18px;accent-color:var(--g500)">Selecionar todos (${list.length})</label><span class="muted">${S.sel.size} selecionado(s)</span><span style="flex:1"></span><button class="btn danger" data-act="delSel" ${S.sel.size?'':'disabled'}>${IC.trash} Excluir selecionados</button></div>`:'';
  const groups=POS.map(p=>{const g=list.filter(a=>a.posicao===p);if(!g.length)return '';
    return `<h3 style="font-family:var(--fc);font-size:20px;margin:18px 0 8px;display:flex;align-items:center;gap:8px"><span class="ptag" style="background:${PC1[p]}">${p}</span>${POSP[p]} <span class="muted" style="font-size:14px">(${g.length})</span></h3><div class="athgrid">${g.map(a=>`<div class="athc">${S.selMode?`<input type="checkbox" data-sel="${a.id}" ${S.sel.has(a.id)?'checked':''} aria-label="Selecionar ${esc(a.nome)}" style="width:18px;height:18px;accent-color:var(--g500);flex:0 0 18px">`:''}<img src="${fotoDe(a)}" alt=""><div class="i"><b>${a.numero?a.numero+' · ':''}${esc(a.nome)}${subTag(a)}</b><span>${esc(a.posDetalhe||POSN[a.posicao])} · Pé ${esc(a.pe||'—')}</span><span>${[idade(a.nascimento)!==''?idade(a.nascimento)+' anos':'',a.altura?nf(a.altura,2)+' m':'',a.peso?a.peso+' kg':'',a.gordura?a.gordura+'% G':''].filter(Boolean).join(' · ')||'&nbsp;'}</span></div>${S.canWrite?`<button class="icon-btn" data-act="editAtleta" data-id="${a.id}" aria-label="Editar ${esc(a.nome)}">${IC.edit}</button>`:''}</div>`).join('')}</div>`;}).join('');
  return head+selBar+groups;
}
function modalAtleta(id){
  const a=id?{...S.atletas.find(x=>x.id===id)}:{id:uid(),nome:'',apelido:'',nascimento:'',posicao:'VOL',posDetalhe:'',pe:'Direito',altura:'',peso:'',gordura:'',categoria:S.filtro.categoria!=='Todas'?S.filtro.categoria:'Sub-17',subcategoria:subAtivo()?S.filtro.sub:'',numero:'',foto:''};
  const opts=(arr,v)=>arr.map(x=>`<option ${x===v?'selected':''}>${esc(x)}</option>`).join('');
  openModal(`<div class="modal"><div class="mh"><h3>${id?'Editar atleta':'Novo atleta'}</h3><button class="icon-btn" data-close aria-label="Fechar">${IC.x}</button></div><div class="mb">
   <div class="form">
    <div class="f s4"><div class="upl"><img id="fPrev" src="${fotoDe(a)}" alt=""><div><label class="btn sm" style="cursor:pointer">Escolher foto<input type="file" id="fFoto" accept="image/*" hidden></label> ${a.foto?'<button class="btn sm danger" id="fFotoRm" type="button">Remover</button>':''}<div class="muted" style="font-size:12px;margin-top:6px">Foto em pé, de frente, fundo escuro fica igual ao relatório.</div></div></div></div>
    <div class="f s2"><label for="fNome">Nome completo *</label><input id="fNome" value="${esc(a.nome)}" required></div>
    <div class="f"><label for="fApel">Nome no campo</label><input id="fApel" value="${esc(a.apelido||'')}" placeholder="Ex.: Pedro H."></div>
    <div class="f"><label for="fNum">Camisa</label><input id="fNum" type="number" min="1" max="99" value="${esc(a.numero||'')}"></div>
    <div class="f"><label for="fNasc">Data de nascimento</label><input id="fNasc" type="date" value="${esc(a.nascimento)}"><span class="hint" id="fIdade">${a.nascimento?idade(a.nascimento)+' anos':''}</span></div>
    <div class="f"><label for="fCat">Categoria</label><select id="fCat">${opts(Object.keys(GRUPOS),a.categoria)}</select></div>
    <div class="f"><label for="fSub">Subcategoria</label><select id="fSub"><option value="">—</option>${opts(GRUPOS[a.categoria]||[],a.subcategoria)}</select><span class="hint" id="fSubH"></span></div>
    <div class="f"><label for="fPos">Posição</label><select id="fPos">${POS.map(p=>`<option value="${p}" ${p===a.posicao?'selected':''}>${POSN[p]}</option>`).join('')}</select></div>
    <div class="f"><label for="fPosD">Posição detalhada</label><select id="fPosD">${opts(POSDET[a.posicao],a.posDetalhe)}</select></div>
    <div class="f"><label for="fPe">Pé dominante</label><select id="fPe">${opts(['Direito','Esquerdo','Ambidestro'],a.pe)}</select></div>
    <div class="f"><label for="fAlt">Estatura (m)</label><input id="fAlt" type="number" step="0.01" min="1" max="2.3" value="${esc(a.altura)}" placeholder="1,78"></div>
    <div class="f"><label for="fPeso">Peso (kg)</label><input id="fPeso" type="number" step="0.1" value="${esc(a.peso)}"></div>
    <div class="f"><label for="fGord">% de gordura</label><input id="fGord" type="number" step="0.1" value="${esc(a.gordura)}"></div>
   </div></div>
   <div class="mf">${id?`<button class="btn danger" id="fDel">${IC.trash} Excluir</button>`:''}<span class="msg" id="fMsg"></span><button class="btn" data-close>Cancelar</button><button class="btn pri" id="fSave">Salvar atleta</button></div></div>`);
  let foto=a.foto||'';
  $('#fPos').onchange=e=>{$('#fPosD').innerHTML=opts(POSDET[e.target.value],'');};
  const subOpts=(c,v)=>'<option value="">—</option>'+opts(GRUPOS[c]||[],v);
  $('#fCat').onchange=e=>{$('#fSub').innerHTML=subOpts(e.target.value,'');};
  $('#fNasc').oninput=e=>{const i=idade(e.target.value);$('#fIdade').textContent=i!==''?i+' anos':'';const q=subPorIdade(e.target.value,S.config.anoBase);if(q.cat){$('#fCat').value=q.cat;$('#fSub').innerHTML=subOpts(q.cat,q.sub);$('#fSubH').textContent=`Pela idade em ${S.config.anoBase}: ${q.sub}`;}};
  $('#fFoto').onchange=async e=>{const f=e.target.files[0];if(!f)return;foto=await prepFoto(f);$('#fPrev').src=foto;};
  const rm=$('#fFotoRm');if(rm)rm.onclick=()=>{foto='';$('#fPrev').src=AVA;};
  if(id)$('#fDel').onclick=async()=>{if(!await ask('Excluir '+a.nome+'? As participações nos jogos deixam de aparecer nos relatórios.'))return;await Store.del('atletas',id);closeModal();render();toast('Atleta excluído');};
  $('#fSave').onclick=async()=>{const nome=$('#fNome').value.trim();if(!nome){$('#fMsg').textContent='Informe o nome do atleta.';$('#fNome').focus();return;}
    const o={...a,nome,apelido:$('#fApel').value.trim(),numero:$('#fNum').value,nascimento:$('#fNasc').value,categoria:$('#fCat').value,subcategoria:$('#fSub').value,posicao:$('#fPos').value,posDetalhe:$('#fPosD').value,pe:$('#fPe').value,altura:$('#fAlt').value,peso:$('#fPeso').value,gordura:$('#fGord').value,foto};
    $('#fSave').disabled=true;try{await Store.put('atletas',o);closeModal();render();toast('Atleta salvo');}catch(e){$('#fSave').disabled=false;}};
}

/* ================= JOGOS · PAINEL ================= */
function viewJogosPainel(){
  const jogos=jogosFiltrados(),ats=atletasCat(),c=calc(jogos,ats);
  const h=header({sub:'RELATÓRIO DE JOGOS — DESEMPENHO DA EQUIPE',title:'PAINEL DE JOGOS',meta:'icons',sloganBar:true,items:[[IC.trophy,'Competição',compLabel()],[IC.kCalPlus,'Período',periodo(jogos)],[IC.ballF,'Total de jogos',String(jogos.length)]]});
  if(!jogos.length)return `<div class="report">${h}<div class="rbody">${emptyReport()}</div></div>`;
  const r={V:0,E:0,D:0,N:0};let gp=0,gc=0;const casa={V:0,E:0,D:0,n:0},fora={V:0,E:0,D:0,n:0};
  jogos.forEach(j=>{const x=resultado(j);r[x]++;gp+=+j.golsPro||0;gc+=+j.golsContra||0;const t=j.mando==='fora'?fora:casa;if(x!=='N'){t[x]++;t.n++;}});
  const disp=r.V+r.E+r.D;const aprov=disp?Math.round((r.V*3+r.E)/(disp*3)*100):0;
  const A=c.lista.reduce((t,s)=>t+s.A,0),CA=c.lista.reduce((t,s)=>t+s.CA,0),CV=c.lista.reduce((t,s)=>t+s.CV,0);
  const kk=(ic,k,v,s)=>kpi(ic,k,v,s);
  const kp=`<div class="gp-grid">${kk(IC.kCal,'Jogos',jogos.length,`${disp} com placar`)}${kk(IC.trophy,'Vitórias',r.V,`${pct(r.V,disp)}% dos jogos`)}${kk(IC.kSwap,'Empates',r.E,`${pct(r.E,disp)}% dos jogos`)}${kk(IC.kUserX,'Derrotas',r.D,`${pct(r.D,disp)}% dos jogos`)}${kk(IC.kPie,'Aproveitamento',aprov+'%',`${r.V*3+r.E} de ${disp*3} pontos`)}${kk(IC.kBars,'Saldo de gols',(gp-gc>0?'+':'')+(gp-gc),`${gp} pró · ${gc} contra`)}</div>
  <div class="gp-grid">${kk(IC.ballF,'Gols marcados',gp,nf(jogos.length?gp/jogos.length:0,2)+' por jogo')}${kk(IC.ballF,'Gols sofridos',gc,nf(jogos.length?gc/jogos.length:0,2)+' por jogo')}${kk(IC.boot,'Assistências',A,'Total da equipe')}
  ${kpi(`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2" fill="#f6c21c"/></svg>`,'Cartões amarelos',CA,nf(jogos.length?CA/jogos.length:0,1)+' por jogo')}
  ${kpi(`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2" fill="#e3342b"/></svg>`,'Cartões vermelhos',CV,'Total da equipe')}${kk(IC.kTeam,'Atletas utilizados',c.usados,'De '+ats.length+' no elenco')}</div>`;
  return `<div class="report">${h}<div class="rbody">${kp}${destaqueMes(jogos,ats)}
    <div class="pn-row">${desempenhoTemporada(jogos)}${distribuicaoResultados(jogos)}</div>
    ${golsPorJogo(jogos)}${rankingIndividual(c)}${resumoJogos(jogos)}${footer('RELATÓRIO DE JOGOS')}</div></div>`;
}
/* ---------- carrossel "Resumo de jogos" (do mais recente para o mais antigo, 5 por vez) ---------- */
const DIAS=d=>new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long'});
function resumoJogos(jogos){
  const rev=jogos.slice().reverse();const n=rev.length;const per=5;
  const maxIdx=Math.max(0,Math.ceil(n/per)-1);S.carPag=Math.min(S.carPag||0,maxIdx);const ini=S.carPag*per;const vis=rev.slice(ini,ini+per);
  const card=j=>{const casa=j.mando!=='fora';const x=resultado(j);const adv={n:j.adversario,l:j.logoAdv||shieldSVG(j.adversario)},pv={n:'Porto Vitória',l:LOGO};
    const A=casa?pv:adv,B=casa?adv:pv;const gA=casa?j.golsPro:j.golsContra,gB=casa?j.golsContra:j.golsPro;const tem=gA!==''&&gA!=null&&gB!==''&&gB!=null;
    return `<div class="gcard res-${x}" data-act="detJogo" data-id="${j.id}" role="button" tabindex="0" title="Ver detalhes do jogo">
     <div class="gc-top"><div><span class="catb">${esc((j.categoria||'').toUpperCase())}</span><div class="comp">${esc(j.competicao||'')}</div></div><div class="dt"><b>${fmtData(j.data).slice(0,5)}</b><small>${esc(j.hora||'')}</small></div></div>
     <div class="gc-mid"><div class="tm"><img src="${A.l}" alt=""><span>${esc(A.n)}</span></div><div class="sc">${tem?`${gA}<em>x</em>${gB}`:'<em class="vs">VS</em>'}</div><div class="tm"><img src="${B.l}" alt=""><span>${esc(B.n)}</span></div></div>
     <div class="gc-bot"><span class="muted">📅 ${esc(DIAS(j.data))}</span><span style="display:flex;gap:8px;align-items:center"><span class="${casa?'casa':'fora'}">${casa?'Em Casa':'Fora'}</span><span class="res ${x}" style="width:22px;height:22px;font-size:13px">${x==='N'?'–':x}</span></span></div></div>`;};
  const ult5=rev.slice(0,5);
  return `<div class="panel" style="margin-bottom:14px"><div class="ph">🏆 Resumo de jogos<span class="r" style="display:flex;align-items:center;gap:10px">
    <span style="font-size:13px">Últimos ${ult5.length}:</span>${ult5.map(j=>{const x=resultado(j);return `<span class="res ${x}" style="width:22px;height:22px;font-size:13px" title="${esc(j.adversario)} ${fmtData(j.data)}">${x==='N'?'–':x}</span>`;}).join('')}
    <span style="font-size:13px;margin-left:8px">${n?`${ini+1}–${Math.min(n,ini+per)} de ${n}`:''}</span>
    <button class="carbtn" data-act="carPrev" ${S.carPag<=0?'disabled':''} aria-label="Jogos mais recentes">‹</button><button class="carbtn" data-act="carNext" ${S.carPag>=maxIdx?'disabled':''} aria-label="Jogos anteriores">›</button></span></div>
    <div class="pb"><div class="gcards">${vis.map(card).join('')}</div></div></div>`;
}
/* ---------- destaque do mês ---------- */
const MESL=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const pontos=s=>s.G*3+s.A*2+s.min/90-s.CA*0.5-s.CV*2;
function destaqueMes(jogos,ats){
  const meses=[...new Set(jogos.map(j=>j.data.slice(0,7)))].sort();if(!meses.length)return '';
  if(S.mesDest==null||!meses.includes(S.mesDest))S.mesDest=meses[meses.length-1];
  const temp=S.destEsc==='temp';const mi=meses.indexOf(S.mesDest);
  const jm=temp?jogos:jogos.filter(j=>j.data.slice(0,7)===S.mesDest);const c=calc(jm,ats);
  const lst=c.lista.filter(s=>s.min>0).map(s=>({...s,pts:pontos(s)}));
  const rk=lst.slice().sort((a,b)=>b.pts-a.pts||b.min-a.min);
  const [y,m]=S.mesDest.split('-');const lab=temp?'Temporada':`${MESL[+m-1]} ${y}`;
  const r={V:0,E:0,D:0};jm.forEach(j=>{const x=resultado(j);if(r[x]!=null)r[x]++;});
  const top=rk[0];const st=(v,l)=>`<div class="dm-st"><b>${v}</b><span>${l}</span></div>`;
  const best=(f)=>lst.slice().sort((a,b)=>f(b)-f(a)||b.min-a.min)[0];
  const hl=(lab,f,un,fmt=v=>v)=>{const s=best(f);const v=s?f(s):0;return s&&v>0?`<div class="hl hlc"><img src="${fotoDe(s.a)}" alt=""><div class="x"><small>${lab}</small><b title="${esc(s.a.nome)}">${esc(s.a.apelido||s.a.nome)}</b><span>${POSN[s.a.posicao]}</span><div><strong>${fmt(v)}</strong> <span>${un}</span></div></div></div>`:`<div class="hl hlc"><img src="${AVA}" alt=""><div class="x"><small>${lab}</small><b>—</b><span>Sem registros</span></div></div>`;};
  const fila=`<div class="hl-row">${hl('Artilheiro',s=>s.G,'gols')}${hl('Líder em assistências',s=>s.A,'assist.')}${hl('Maior minutagem',s=>s.min,'min',v=>nf(v))}${hl('Participações em gol',s=>s.G+s.A,'G + A')}${hl('Mais jogos',s=>s.J,'jogos')}${hl('Mais cartões amarelos',s=>s.CA,'amarelos')}</div>`;
  return `<div class="panel" style="margin-bottom:14px"><div class="ph">⭐ Destaque ${temp?'da temporada':'do mês'}<span class="r" style="display:flex;align-items:center;gap:8px">
    <span class="seg"><button data-act="destEsc" data-v="mes" class="${temp?'':'on'}">Mês</button><button data-act="destEsc" data-v="temp" class="${temp?'on':''}">Temporada</button></span>
    ${temp?'':`<button class="carbtn" data-act="mesPrev" ${mi<=0?'disabled':''} aria-label="Mês anterior">‹</button><b style="min-width:130px;text-align:center;font-size:15px">${lab}</b><button class="carbtn" data-act="mesNext" ${mi>=meses.length-1?'disabled':''} aria-label="Próximo mês">›</button>`}</span></div>
   <div class="pb">${top?`<div class="dm">
     <div class="dm-main"><img src="${fotoDe(top.a)}" alt="Foto de ${esc(top.a.nome)}"><div class="dm-info"><span class="catb">⭐ DESTAQUE ${temp?'DA TEMPORADA':'DE '+esc(MESL[+m-1].toUpperCase())}</span><div class="dm-nome">${esc(top.a.nome)}${subTag(top.a)}</div><div class="muted">${esc(top.a.posDetalhe||POSN[top.a.posicao])}</div>
       <div class="dm-sts">${st(top.J,'jogos')}${st(nf(top.min),'minutos')}${st(top.G,'gols')}${st(top.A,'assist.')}${top.a.posicao==='GOL'?st(top.GS,'gols sofridos'):''}${st(nf(top.pts,1),'pontos')}</div></div></div>
     <div class="dm-side"><div class="muted" style="font-size:12.5px;margin-bottom:6px">${jm.length} jogo(s) ${temp?'na temporada':'no mês'} · ${r.V}V ${r.E}E ${r.D}D</div><div class="ranklist">${rk.slice(1,5).map((s,i)=>`<div><em>${i+2}</em><img class="ava round" src="${fotoDe(s.a)}" alt="">${esc(s.a.nome)} <span class="muted" style="font-size:12px">${s.G}G ${s.A}A · ${nf(s.min)}'</span><b>${nf(s.pts,1)}</b></div>`).join('')}</div>
       <div class="muted" style="font-size:11.5px;margin-top:6px">Pontos = gols×3 + assistências×2 + minutos÷90 − amarelo×0,5 − vermelho×2</div></div></div>${fila}`:'<span class="muted">Sem minutagem neste período.</span>'}</div></div>`;
}
/* ---------- desempenho ao longo da temporada ---------- */
function desempenhoTemporada(jogos){
  const js=jogos.filter(j=>resultado(j)!=='N');if(!js.length)return `<div class="panel"><div class="ph">📈 Desempenho ao longo da temporada</div><div class="pb muted">Cadastre placares para ver o desempenho.</div></div>`;
  let pts=0;const P=js.map((j,i)=>{const x=resultado(j);pts+=x==='V'?3:x==='E'?1:0;return {j,x,ap:Math.round(pts/((i+1)*3)*100),pts,saldo:(+j.golsPro||0)-(+j.golsContra||0)};});
  if(S.perfSel==null||S.perfSel>=P.length)S.perfSel=P.length-1;
  const W=800,H=250,L=40,R=14,T=16,B=34,iw=W-L-R,ih=H-T-B;const X=i=>L+(P.length===1?iw/2:i*iw/(P.length-1)),Y=v=>T+ih-(v/100)*ih;
  const maxS=Math.max(1,...P.map(p=>Math.abs(p.saldo)));const bw=Math.max(4,Math.min(18,iw/P.length*0.45));
  const line=P.map((p,i)=>`${i?'L':'M'}${X(i).toFixed(1)},${Y(p.ap).toFixed(1)}`).join(' ');
  const area=line+` L${X(P.length-1).toFixed(1)},${Y(0)} L${X(0).toFixed(1)},${Y(0)} Z`;
  const col={V:'#22a355',E:'#8a948f',D:'#e3342b'};const step=Math.ceil(P.length/10);
  const sel=P[S.perfSel];const sj=sel.j;const casa=sj.mando!=='fora';
  const svg=`<svg viewBox="0 0 ${W} ${H}" class="perf" role="img" aria-label="Aproveitamento acumulado por jogo">
   <defs><linearGradient id="perfG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22a355" stop-opacity=".35"/><stop offset="1" stop-color="#22a355" stop-opacity="0"/></linearGradient></defs>
   ${[0,25,50,75,100].map(v=>`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="currentColor" stroke-opacity=".12"/><text x="${L-6}" y="${Y(v)+4}" text-anchor="end" font-size="11" fill="currentColor" fill-opacity=".6">${v}%</text>`).join('')}
   ${P.map((p,i)=>{const h=Math.abs(p.saldo)/maxS*(ih*0.28);return p.saldo?`<rect x="${X(i)-bw/2}" y="${p.saldo>0?Y(0)-h:Y(0)-h}" width="${bw}" height="${h}" rx="2" fill="${p.saldo>0?'#22a355':'#e3342b'}" fill-opacity=".22"/>`:'';}).join('')}
   <path d="${area}" fill="url(#perfG)"/><path d="${line}" fill="none" stroke="#22a355" stroke-width="2.5" stroke-linejoin="round"/>
   ${P.map((p,i)=>`<g data-act="perfPt" data-i="${i}" style="cursor:pointer"><circle cx="${X(i)}" cy="${Y(p.ap)}" r="11" fill="transparent"/><circle cx="${X(i)}" cy="${Y(p.ap)}" r="${i===S.perfSel?7:5}" fill="${col[p.x]}" stroke="${i===S.perfSel?'#f2b81b':'#fff'}" stroke-width="${i===S.perfSel?3:1.5}"/></g>`).join('')}
   ${P.map((p,i)=>i%step===0||i===P.length-1?`<text x="${X(i)}" y="${H-12}" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity=".65">${fmtData(p.j.data).slice(0,5)}</text>`:'').join('')}</svg>`;
  return `<div class="panel"><div class="ph">📈 Desempenho ao longo da temporada<span class="r">aproveitamento acumulado · barras = saldo de gols</span></div><div class="pb">${svg}
   <div class="perf-info"><span class="res ${sel.x}">${sel.x}</span><div style="min-width:0;flex:1"><b>Jogo ${S.perfSel+1} · ${fmtData(sj.data)} · ${casa?`Porto Vitória ${sj.golsPro} x ${sj.golsContra} ${esc(sj.adversario)}`:`${esc(sj.adversario)} ${sj.golsContra} x ${sj.golsPro} Porto Vitória`}</b>
    <div class="muted" style="font-size:12.5px">${esc(sj.competicao)} · ${casa?'Em casa':'Fora'}${sj.local?' · '+esc(sj.local):''} · ${sel.pts} pontos somados · aproveitamento ${sel.ap}%</div></div><button class="btn sm" data-act="detJogo" data-id="${sj.id}">Ver jogo</button></div></div></div>`;
}
/* ---------- distribuição de resultados ---------- */
function distribuicaoResultados(jogos){
  const js=jogos.filter(j=>resultado(j)!=='N');const r={V:0,E:0,D:0},casa={V:0,E:0,D:0},fora={V:0,E:0,D:0};
  js.forEach(j=>{const x=resultado(j);r[x]++;(j.mando==='fora'?fora:casa)[x]++;});const n=js.length;
  let inv=0,maxInv=0,vit=0,maxVit=0;js.forEach(j=>{const x=resultado(j);inv=x==='D'?0:inv+1;vit=x==='V'?vit+1:0;maxInv=Math.max(maxInv,inv);maxVit=Math.max(maxVit,vit);});
  const li=(k,l,c)=>`<div class="li"><span class="sw round" style="background:${c}"></span><div><b>${l}</b><span>${r[k]} (${pct(r[k],n)}%)</span></div></div>`;
  return `<div class="panel"><div class="ph">🥧 Distribuição de resultados</div><div class="pb"><div class="donut-wrap" style="flex-wrap:wrap">${donut([{v:r.V,c:'#22a355'},{v:r.E,c:'#8a948f'},{v:r.D,c:'#e3342b'}],160,28,n,n===1?'jogo':'jogos')}
   <div class="legend" style="gap:10px">${li('V','Vitórias','#22a355')}${li('E','Empates','#8a948f')}${li('D','Derrotas','#e3342b')}</div></div>
   <table class="t" style="margin-top:12px"><thead><tr><th></th><th>V</th><th>E</th><th>D</th><th>Aprov.</th></tr></thead><tbody>
    ${[['Em casa',casa],['Fora',fora]].map(([l,o])=>{const t=o.V+o.E+o.D;return `<tr><td class="l"><b>${l}</b></td><td>${o.V}</td><td>${o.E}</td><td>${o.D}</td><td>${t?Math.round((o.V*3+o.E)/(t*3)*100):0}%</td></tr>`;}).join('')}</tbody></table>
   <div class="muted" style="font-size:12.5px;margin-top:8px">Maior sequência invicta: <b>${maxInv}</b> · de vitórias: <b>${maxVit}</b> · atual: <b>${inv}</b> sem perder</div></div></div>`;
}
/* ---------- gols por jogo (últimos N) ---------- */
function golsPorJogo(jogos){
  const N=S.golsN||10;const js=jogos.filter(j=>resultado(j)!=='N').slice(-N);if(!js.length)return '';
  const mx=Math.max(1,...js.map(j=>Math.max(+j.golsPro||0,+j.golsContra||0)));
  const gp=js.reduce((t,j)=>t+(+j.golsPro||0),0),gc=js.reduce((t,j)=>t+(+j.golsContra||0),0);
  return `<div class="panel" style="margin:14px 0"><div class="ph">⚽ Gols por jogo<span class="r" style="display:flex;align-items:center;gap:10px"><span class="seg">${[8,10].map(n=>`<button data-act="golsN" data-v="${n}" class="${N===n?'on':''}">Últimos ${n}</button>`).join('')}</span>
    <span><i style="display:inline-block;width:10px;height:10px;background:#22a355;border-radius:2px"></i> Pró &nbsp;<i style="display:inline-block;width:10px;height:10px;background:#e3342b;border-radius:2px"></i> Contra</span></span></div>
   <div class="pb"><div class="gbars">${js.map(j=>{const p=+j.golsPro||0,c=+j.golsContra||0,x=resultado(j);return `<div class="gb2" data-act="detJogo" data-id="${j.id}" title="Ver detalhes">
     <div class="pair"><div class="bwrap"><b>${p}</b><i style="height:${p/mx*100}%;background:#22a355"></i></div><div class="bwrap"><b>${c}</b><i style="height:${c/mx*100}%;background:#e3342b"></i></div></div>
     <span class="res ${x}" style="width:20px;height:20px;font-size:12px">${x}</span><small title="${esc(j.adversario)}">${esc(j.adversario)}</small><small class="muted">${fmtData(j.data).slice(0,5)}</small></div>`;}).join('')}</div>
   <div class="muted" style="font-size:13px;margin-top:10px">Nos últimos ${js.length} jogos: <b>${gp}</b> gols pró (${nf(gp/js.length,1)}/jogo) · <b>${gc}</b> contra (${nf(gc/js.length,1)}/jogo) · saldo <b>${gp-gc>0?'+':''}${gp-gc}</b></div></div></div>`;
}
/* ---------- ranking individual ---------- */
function rankingIndividual(c){
  const k=S.rankSort||'pts';const lst=c.lista.filter(s=>s.T+s.R>0).map(s=>({...s,ga:s.G+s.A,pts:pontos(s)}));
  lst.sort((a,b)=>(b[k]-a[k])||b.min-a.min);const vis=S.rankAll?lst:lst.slice(0,10);
  const col=(key,l)=>`<th><button class="thsort ${k===key?'on':''}" data-act="rankSort" data-v="${key}">${l}${k===key?' ▼':''}</button></th>`;
  return `<div class="panel" style="margin-bottom:14px"><div class="ph">🏅 Ranking individual${PDFMODE?'':'<span class="r">clique no título da coluna para ordenar</span>'}</div><div class="tbl-wrap"><table class="t rank"><thead><tr><th>#</th><th style="min-width:200px">Atleta</th><th>Pos</th>${col('J','Jogos')}${col('min','Min')}${col('G','Gols')}${col('A','Assist.')}${col('ga','G + A')}${col('CA','Amar.')}${col('CV','Verm.')}${col('pts','Pontos')}</tr></thead><tbody>
   ${vis.map((s,i)=>`<tr class="${i<3?'top'+(i+1):''}"><td>${i<3?['🥇','🥈','🥉'][i]:i+1}</td><td class="l"><div class="athcell"><img class="ava round" src="${fotoDe(s.a)}" alt="">${esc(s.a.nome)}${subTag(s.a)}</div></td><td><span class="ptag" style="background:${PC2[s.a.posicao]}">${s.a.posicao}</span></td><td>${s.J}</td><td>${nf(s.min)}</td><td>${s.G}</td><td>${s.A}</td><td>${s.ga}</td><td>${s.CA}</td><td>${s.CV}</td><td><b>${nf(s.pts,1)}</b></td></tr>`).join('')}</tbody></table></div>
   ${lst.length>10?`<div style="padding:10px 14px"><button class="btn sm" data-act="rankAll">${S.rankAll?'Mostrar só os 10 primeiros':'Mostrar todos ('+lst.length+')'}</button></div>`:''}</div>`;
}
function gameRow(j,actions){
  const x=resultado(j);const goals=(j.relacionados||[]).filter(r=>+r.gols>0).map(r=>{const a=S.atletas.find(t=>t.id===r.atletaId);return a?(a.apelido||a.nome)+(+r.gols>1?` (${r.gols})`:''):null;}).filter(Boolean);
  const assists=(j.relacionados||[]).filter(r=>+r.assist>0).map(r=>{const a=S.atletas.find(t=>t.id===r.atletaId);return a?(a.apelido||a.nome)+(+r.assist>1?` (${r.assist})`:''):null;}).filter(Boolean);
  const casa=j.mando!=='fora';
  return `<div class="gl-row click" data-act="detJogo" data-id="${j.id}" role="button" tabindex="0" title="Ver detalhes do jogo"><div class="dt">${fmtData(j.data)}<small>${esc(j.hora||'')} ${casa?'· Casa':'· Fora'}</small></div>
   <div class="mt">${casa?`<img src="${LOGO}" alt=""><b>Porto Vitória</b>`:`<img src="${j.logoAdv||shieldSVG(j.adversario)}" alt=""><b>${esc(j.adversario)}</b>`}<span class="sc">${casa?(j.golsPro??'-'):(j.golsContra??'-')} x ${casa?(j.golsContra??'-'):(j.golsPro??'-')}</span>${casa?`<b>${esc(j.adversario)}</b><img src="${j.logoAdv||shieldSVG(j.adversario)}" alt="">`:`<b>Porto Vitória</b><img src="${LOGO}" alt="">`}
   <div class="info">${esc(j.competicao)} · ${esc(j.categoria)} · ${esc(j.local||'')}${goals.length?' · ⚽ '+esc(goals.join(', ')):''}${assists.length?` · <span class="ico-boot">${IC.boot}</span> `+esc(assists.join(', ')):''}</div></div>
   ${j.arquivo?'<span title="Relatório PDF arquivado" style="font-size:17px">📎</span>':''}<span class="res ${x}" title="${({V:'Vitória',E:'Empate',D:'Derrota',N:'Sem placar'})[x]}">${x==='N'?'–':x}</span>
   ${actions?`<div class="acts"><button class="btn sm" data-act="verJogo" data-id="${j.id}">Minutagem</button>${S.canWrite?`<button class="icon-btn" data-act="editJogo" data-id="${j.id}" aria-label="Editar jogo">${IC.edit}</button>`:''}</div>`:'<span></span>'}</div>`;
}

/* ================= JOGOS · LISTA ================= */
function viewJogosLista(){
  const jogos=jogosFiltrados().slice().reverse();
  const head=`<div class="page-h"><h2>Jogos</h2><span class="muted">${jogos.length} no filtro atual</span><span class="sp"></span>${S.canWrite?`<label class="btn" style="cursor:pointer">📄 Importar relatório (PDF)<input type="file" id="pdfJogo" accept="application/pdf,.pdf" hidden></label><button class="btn pri" data-act="novoJogo">${IC.plus} Cadastrar jogo</button>`:''}</div>`;
  if(!jogos.length)return head+emptyReport();
  return head+`<div class="games-list">${jogos.map(j=>gameRow(j,true)).join('')}</div>`;
}

/* ================= EDITOR DE JOGO ================= */
let EJ=null,EJtab='dados',EJslot=-1;
function modalJogo(id){
  const base=id?JSON.parse(JSON.stringify(S.jogos.find(x=>x.id===id))):{id:uid(),categoria:S.filtro.categoria!=='Todas'?S.filtro.categoria:'Sub-17',competicao:S.filtro.competicao!=='Todas'?S.filtro.competicao:S.config.competicoes[0],data:new Date().toISOString().slice(0,10),hora:'15:00',local:'',mando:'casa',adversario:'',logoAdv:'',golsPro:'',golsContra:'',duracao:'',formacao:'4-2-3-1',relacionados:[],escalacao:[],motivos:{},obs:''};
  base.relacionados=base.relacionados||[];base.escalacao=base.escalacao||[];base.motivos=base.motivos||{};
  EJ=base;EJtab='dados';EJslot=-1;EJ._isNew=!id;
  openModal(`<div class="modal xl"><div class="mh"><h3>${id?'Editar jogo':'Cadastrar jogo'}</h3><button class="icon-btn" data-close aria-label="Fechar">${IC.x}</button></div><div class="mb" id="ejBody"></div>
  <div class="mf">${id?`<button class="btn danger" id="ejDel">${IC.trash} Excluir jogo</button>`:''}<span class="msg" id="ejMsg"></span><button class="btn" data-close>Cancelar</button><button class="btn pri" id="ejSave">Salvar jogo</button></div></div>`);
  renderEJ();
  if(id)$('#ejDel').onclick=async()=>{if(!await ask('Excluir este jogo e toda a minutagem dele?'))return;await Store.del('jogos',id);closeModal();render();toast('Jogo excluído');};
  $('#ejSave').onclick=saveEJ;
}
function syncEJ(){ // lê campos da aba dados
  const g=i=>{const e=$('#'+i);return e?e.value:undefined;};
  if($('#jAdv')){Object.assign(EJ,{categoria:g('jCat'),competicao:g('jComp'),data:g('jData'),hora:g('jHora'),local:g('jLocal'),mando:g('jMando'),adversario:g('jAdv').trim(),golsPro:g('jGP'),golsContra:g('jGC'),duracao:g('jDur'),obs:g('jObs')});}
}
function renderEJ(){
  const tabs=`<div class="tabs" role="tablist">${[['dados','Dados do jogo'],['rel','Relacionados e estatísticas'],['esc','Escalação']].map(([k,l])=>`<button role="tab" class="${EJtab===k?'on':''}" data-ejtab="${k}">${l}</button>`).join('')}</div>`;
  let body='';
  if(EJtab==='dados'){
    const opts=(arr,v)=>arr.map(x=>`<option ${x===v?'selected':''}>${esc(x)}</option>`).join('');
    body=`<div class="form">
     <div class="f s2"><label for="jAdv">Adversário *</label><input id="jAdv" value="${esc(EJ.adversario)}" list="advList" placeholder="Ex.: Rio Branco"><datalist id="advList">${[...new Set(S.jogos.map(j=>j.adversario))].map(a=>`<option value="${esc(a)}">`).join('')}</datalist></div>
     <div class="f s2"><label>Escudo do adversário</label><div class="upl logo"><img id="jLogoPrev" src="${EJ.logoAdv||shieldSVG(EJ.adversario)}" alt=""><label class="btn sm" style="cursor:pointer">Enviar escudo<input type="file" id="jLogo" accept="image/*" hidden></label>${EJ.logoAdv?'<button class="btn sm danger" id="jLogoRm" type="button">Remover</button>':''}</div></div>
     <div class="f"><label for="jMando">Mando</label><select id="jMando"><option value="casa" ${EJ.mando!=='fora'?'selected':''}>Em casa</option><option value="fora" ${EJ.mando==='fora'?'selected':''}>Fora de casa</option></select></div>
     <div class="f"><label for="jCat">Categoria</label><select id="jCat">${opts(S.config.categorias,EJ.categoria)}</select></div>
     <div class="f"><label for="jComp">Competição</label><select id="jComp">${opts(S.config.competicoes,EJ.competicao)}</select></div>
     <div class="f"><label for="jDur">Duração (min)</label><input id="jDur" type="number" min="10" max="130" value="${esc(EJ.duracao)}" placeholder="${S.config.duracao?.[EJ.categoria]||90} (padrão)"></div>
     <div class="f"><label for="jData">Data</label><input id="jData" type="date" value="${esc(EJ.data)}"></div>
     <div class="f"><label for="jHora">Horário</label><input id="jHora" type="time" value="${esc(EJ.hora)}"></div>
     <div class="f s2"><label for="jLocal">Local / campo</label><input id="jLocal" value="${esc(EJ.local)}" list="locList" placeholder="Ex.: Estádio Kleber Andrade"><datalist id="locList">${[...new Set(S.jogos.map(j=>j.local).filter(Boolean))].map(a=>`<option value="${esc(a)}">`).join('')}</datalist></div>
     <div class="f"><label for="jGP">Gols Porto Vitória</label><input id="jGP" type="number" min="0" value="${esc(EJ.golsPro)}"><span class="hint" id="jGPh"></span></div>
     <div class="f"><label for="jGC">Gols adversário</label><input id="jGC" type="number" min="0" value="${esc(EJ.golsContra)}"></div>
     <div class="f s2"><label for="jObs">Observações</label><input id="jObs" value="${esc(EJ.obs||'')}" placeholder="Arbitragem, clima, ocorrências"></div>
     <div class="f s4 muted" style="font-size:13px">Não achou a competição ou a categoria? Adicione em <b>Configurações</b> (ícone de engrenagem no menu).</div></div>`;
  } else if(EJtab==='rel'){
    const ats=S.atletas.filter(a=>a.categoria===EJ.categoria).sort((a,b)=>POS.indexOf(a.posicao)-POS.indexOf(b.posicao)||a.nome.localeCompare(b.nome));
    const map={};EJ.relacionados.forEach(r=>map[r.atletaId]=r);const d=Number(EJ.duracao)||S.config.duracao?.[EJ.categoria]||90;
    const nT=EJ.relacionados.filter(r=>r.status==='T').length,nR=EJ.relacionados.filter(r=>r.status==='R').length,nE=EJ.relacionados.filter(r=>r.status==='R'&&+r.min>0).length;
    const sg=EJ.relacionados.reduce((t,r)=>t+(+r.gols||0),0);
    body=`<div class="counters"><span>Titulares <b>${nT}</b>/11</span><span>Reservas <b>${nR}</b></span><span>Reservas que entraram <b>${nE}</b></span><span>Não relacionados <b>${ats.length-nT-nR}</b></span><span>Gols dos atletas <b>${sg}</b></span>
     <span style="margin-left:auto;padding:0;border:0;background:none;display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm" data-act="titMin">Titulares = ${d} min</button><button class="btn sm" data-act="relAll">Limpar relacionados</button></span></div>
     ${nT>11?'<div style="color:var(--red);font-weight:600;margin-bottom:8px">Há mais de 11 titulares marcados.</div>':''}
     ${!ats.length?`<div class="empty"><h3>Nenhum atleta na categoria ${esc(EJ.categoria)}</h3><p>Cadastre os atletas dessa categoria para montar os relacionados.</p></div>`:
     `<div class="tbl-wrap"><table class="t reltbl"><thead><tr><th>Atleta</th><th>Pos</th><th>Situação</th><th>Min</th><th>Gols</th><th>Assist.</th><th>Amar.</th><th>Verm.</th><th>Motivo (não relacionado)</th></tr></thead><tbody>
     ${ats.map(a=>{const r=map[a.id];const st=r?r.status:'';return `<tr class="${st||'nr'}" data-aid="${a.id}"><td class="l"><div class="athcell"><img class="ava" src="${fotoDe(a)}" alt="">${esc(a.nome)}${subTag(a)}</div></td><td><span class="ptag" style="background:${PC2[a.posicao]}">${a.posicao}</span></td>
      <td><select data-f="status" aria-label="Situação de ${esc(a.nome)}"><option value="" ${!st?'selected':''}>Não relacionado</option><option value="T" ${st==='T'?'selected':''}>Titular</option><option value="R" ${st==='R'?'selected':''}>Reserva</option></select></td>
      ${['min','gols','assist','ca','cv'].map(k=>`<td><input type="number" min="0" ${k==='min'?`max="${d+30}"`:k==='ca'?'max="2"':k==='cv'?'max="1"':''} data-f="${k}" value="${r?esc(r[k]??''):''}" ${r?'':'disabled'} aria-label="${k} ${esc(a.nome)}"></td>`).join('')}
      <td>${r?'<span class="muted">—</span>':`<select data-f="motivo" aria-label="Motivo">${MOTIVOS.map(m=>`<option ${(EJ.motivos[a.id]||'Opção técnica')===m?'selected':''}>${m}</option>`).join('')}</select>`}</td></tr>`;}).join('')}</tbody></table></div>
     <p class="muted" style="font-size:12.5px;margin-top:8px">Reserva com 0 minutos = ficou no banco sem entrar. Quem não for marcado entra automaticamente como não relacionado.</p>`}`;
  } else {
    const tit=EJ.relacionados.filter(r=>r.status==='T').map(r=>S.atletas.find(a=>a.id===r.atletaId)).filter(Boolean);
    body=`<div class="esc-wrap"><div><div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap"><label class="f" style="flex-direction:row;align-items:center;gap:8px"><span style="font-weight:700;font-size:12px;color:var(--ink2)">FORMAÇÃO</span><select id="jForm" style="border:1px solid var(--line);border-radius:8px;padding:6px 10px;background:var(--card2)">${Object.keys(FORMACOES).map(f=>`<option ${f===EJ.formacao?'selected':''}>${f}</option>`).join('')}</select></label><button class="btn sm" data-act="autoEsc">Posicionar automaticamente</button><button class="btn sm" data-act="clrEsc">Limpar campo</button></div>
     <div style="background:#0f3d22;padding:2px;border-radius:6px">${pitch(EJ,true,EJslot)}</div></div>
     <div><b style="font-family:var(--fc);font-size:18px">TITULARES (${tit.length})</b><p class="muted" style="font-size:12.5px;margin:4px 0 10px">${EJslot>=0?'Agora toque no atleta para colocar na posição selecionada.':'Toque numa posição do campo e depois no atleta.'}</p>
     ${tit.length?`<div class="bench">${tit.map(a=>`<button data-pick="${a.id}" class="${EJ.escalacao.includes(a.id)?'used':''}"><img class="ava" src="${fotoDe(a)}" alt=""><span class="ptag" style="background:${PC2[a.posicao]};min-width:0">${a.posicao}</span>${esc(a.nome)}</button>`).join('')}</div>`:'<div class="empty" style="padding:20px">Marque os titulares na aba <b>Relacionados</b> primeiro.</div>'}</div></div>`;
  }
  $('#ejBody').innerHTML=tabs+body;
  bindEJ();
}
function bindEJ(){
  document.querySelectorAll('[data-ejtab]').forEach(b=>b.onclick=()=>{syncEJ();EJtab=b.dataset.ejtab;renderEJ();});
  const lg=$('#jLogo');if(lg)lg.onchange=async e=>{const f=e.target.files[0];if(!f)return;EJ.logoAdv=await resizeImage(f,120,120,'image/png');syncEJ();renderEJ();};
  const lr=$('#jLogoRm');if(lr)lr.onclick=()=>{EJ.logoAdv='';syncEJ();renderEJ();};
  const adv=$('#jAdv');if(adv)adv.oninput=()=>{if(!EJ.logoAdv){const prev=S.jogos.find(j=>j.adversario===adv.value.trim()&&j.logoAdv);$('#jLogoPrev').src=prev?prev.logoAdv:shieldSVG(adv.value);}};
  const gp=$('#jGPh');if(gp){const sg=EJ.relacionados.reduce((t,r)=>t+(+r.gols||0),0);if(sg)gp.textContent=sg+' gol(s) lançados nos atletas';}
  document.querySelectorAll('.reltbl tr[data-aid]').forEach(tr=>{const aid=tr.dataset.aid;
    tr.querySelectorAll('[data-f]').forEach(el=>{el.onchange=el.oninput=e=>{const f=el.dataset.f;
      if(f==='status'){const v=el.value;let r=EJ.relacionados.find(x=>x.atletaId===aid);
        if(!v){EJ.relacionados=EJ.relacionados.filter(x=>x.atletaId!==aid);EJ.escalacao=EJ.escalacao.map(x=>x===aid?null:x);}
        else if(r){r.status=v;if(v==='R')EJ.escalacao=EJ.escalacao.map(x=>x===aid?null:x);}
        else{const d=Number(EJ.duracao)||S.config.duracao?.[EJ.categoria]||90;EJ.relacionados.push({atletaId:aid,status:v,min:v==='T'?d:0,gols:0,assist:0,ca:0,cv:0});delete EJ.motivos[aid];}
        if(e.type==='change')renderEJ();return;}
      if(f==='motivo'){EJ.motivos[aid]=el.value;return;}
      const r=EJ.relacionados.find(x=>x.atletaId===aid);if(r)r[f]=el.value===''?0:Number(el.value);};});});
  document.querySelectorAll('[data-slot]').forEach(s=>{const fn=()=>{const i=+s.dataset.slot;if(EJslot===i){EJ.escalacao[i]=null;EJslot=-1;}else EJslot=i;renderEJ();};s.onclick=fn;s.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();}};});
  document.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{const id=b.dataset.pick;let i=EJslot;
    if(i<0){const f=FORMACOES[EJ.formacao];const a=S.atletas.find(x=>x.id===id);i=f.findIndex((s,k)=>!EJ.escalacao[k]&&s[2]===a.posicao);if(i<0)i=f.findIndex((s,k)=>!EJ.escalacao[k]);if(i<0)return;}
    EJ.escalacao=EJ.escalacao.map(x=>x===id?null:x);EJ.escalacao[i]=id;EJslot=-1;renderEJ();});
  const jf=$('#jForm');if(jf)jf.onchange=()=>{EJ.formacao=jf.value;autoEsc(true);renderEJ();};
}
function computeEsc(formacao,relacionados){
  const f=FORMACOES[formacao]||FORMACOES['4-2-3-1'];const tit=relacionados.filter(r=>r.status==='T').map(r=>S.atletas.find(a=>a.id===r.atletaId)).filter(Boolean);
  const out=Array(11).fill(null);const used=new Set();
  f.forEach((s,i)=>{const a=tit.find(t=>!used.has(t.id)&&t.posicao===s[2]);if(a){out[i]=a.id;used.add(a.id);}});
  const near={LAT:['ZAG','VOL'],ZAG:['VOL','LAT'],VOL:['MEI','ZAG'],MEI:['VOL','EXT','ATA'],EXT:['MEI','ATA'],ATA:['EXT','MEI'],GOL:[]};
  f.forEach((s,i)=>{if(out[i])return;const a=tit.find(t=>!used.has(t.id)&&(near[s[2]]||[]).includes(t.posicao))||tit.find(t=>!used.has(t.id));if(a){out[i]=a.id;used.add(a.id);}});
  return out;
}
function autoEsc(){EJ.escalacao=computeEsc(EJ.formacao,EJ.relacionados);}
async function saveEJ(){
  syncEJ();const msg=$('#ejMsg');
  if(!EJ.adversario){EJtab='dados';renderEJ();msg.textContent='Informe o adversário.';return;}
  if(!EJ.data){EJtab='dados';renderEJ();msg.textContent='Informe a data do jogo.';return;}
  if(EJ.golsPro!==''&&EJ.golsPro!=null)EJ.golsPro=Number(EJ.golsPro);if(EJ.golsContra!==''&&EJ.golsContra!=null)EJ.golsContra=Number(EJ.golsContra);
  if(EJ.relacionados.some(r=>r.status==='T')&&!EJ.escalacao.some(Boolean))autoEsc();
  const o={...EJ};delete o._isNew;
  $('#ejSave').disabled=true;
  try{await Store.put('jogos',o);S.jogoSel=o.id;closeModal();render();toast('Jogo salvo');}catch(e){$('#ejSave').disabled=false;}
}

/* ================= CONFIGURAÇÕES ================= */
function viewConfig(){
  const tl=(k,arr)=>`<div class="taglist">${arr.map((x,i)=>`<span>${esc(x)}${S.canWrite?`<button data-rm="${k}" data-i="${i}" aria-label="Remover ${esc(x)}">×</button>`:''}</span>`).join('')}</div>${S.canWrite?`<div class="row-add"><input id="add_${k}" placeholder="Adicionar ${k==='categorias'?'categoria (ex.: Sub-14)':'competição'}"><button class="btn pri" data-add="${k}">${IC.plus} Adicionar</button></div>`:''}`;
  return `<div class="page-h"><h2>Configurações</h2></div><div class="cfg-grid">
   <div class="panel"><div class="ph">Categorias e subcategorias</div><div class="pb"><table class="t"><thead><tr><th>Categoria</th><th>Subcategorias (idades)</th></tr></thead><tbody>${Object.entries(GRUPOS).map(([g,l])=>`<tr><td><b>${g}</b></td><td class="l">${l.map(x=>`${x} (${x.slice(4)} anos)`).join(' · ')}</td></tr>`).join('')}</tbody></table>
    <div style="display:flex;align-items:center;gap:10px;margin-top:12px"><span style="flex:1"><b>Ano-base</b> <span class="muted" style="font-size:12.5px">idade no ano = ano-base − ano de nascimento; define a subcategoria automática</span></span><input type="number" id="cfgAno" min="2015" max="2040" value="${S.config.anoBase}" style="width:90px;border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:var(--card2)" ${S.canWrite?'':'disabled'}></div>
    ${S.canWrite?`<button class="btn sm" data-act="recalcSub" style="margin-top:10px">Recalcular subcategorias pela data de nascimento</button>`:''}</div></div>
   <div class="panel"><div class="ph">Competições</div><div class="pb">${tl('competicoes',S.config.competicoes)}</div></div>
   <div class="panel"><div class="ph">Duração padrão do jogo</div><div class="pb"><p class="muted" style="margin-top:0">Usada para calcular os minutos disponíveis. Cada jogo pode ter a sua própria duração.</p>
    ${S.config.categorias.map(c=>`<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><span style="flex:1;font-weight:600">${esc(c)}</span><input type="number" min="10" max="130" data-dur="${esc(c)}" value="${S.config.duracao?.[c]||90}" style="width:80px;border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:var(--card2)" ${S.canWrite?'':'disabled'}> min</div>`).join('')}</div></div>
   <div class="panel"><div class="ph">Capa dos relatórios</div><div class="pb">
    <div class="f" style="margin-bottom:12px"><label for="cfgTopo">Texto do topo</label><input id="cfgTopo" value="${esc(S.config.capaTopo||'')}" ${S.canWrite?'':'disabled'}></div>
    <label style="font-size:11.5px;font-weight:700;color:var(--ink2);text-transform:uppercase">Profissionais (aparecem abaixo do título)</label>
    <div id="profList" style="display:flex;flex-direction:column;gap:6px;margin:6px 0 10px">${(S.config.profissionais||[]).map((p,i)=>`<div style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-prof="${i}" data-k="ativo" ${p.ativo!==false?'checked':''} title="Mostrar na capa" style="width:18px;height:18px;accent-color:var(--g500)" ${S.canWrite?'':'disabled'}><input data-prof="${i}" data-k="nome" value="${esc(p.nome)}" placeholder="Nome" style="flex:1;min-width:0;border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:var(--card2)" ${S.canWrite?'':'disabled'}><input data-prof="${i}" data-k="cargo" value="${esc(p.cargo||'')}" placeholder="Cargo" style="flex:1.2;min-width:0;border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:var(--card2)" ${S.canWrite?'':'disabled'}>${S.canWrite?`<button class="icon-btn" data-act="profDel" data-i="${i}" aria-label="Remover">${IC.trash}</button>`:''}</div>`).join('')}</div>
    ${S.canWrite?`<button class="btn sm" data-act="profAdd">${IC.plus} Adicionar profissional</button>`:''}
    <div style="margin-top:12px;border-radius:8px;overflow:hidden;width:100%;max-width:360px;aspect-ratio:3/2;position:relative" id="capaMini"></div></div></div>
   <div class="panel"><div class="ph">Backup dos dados</div><div class="pb"><p class="muted" style="margin-top:0">${S.online?'Os dados ficam salvos na nuvem deste sistema e aparecem para todos com acesso.':'Os dados estão salvos apenas neste navegador.'} Faça uma cópia de segurança periodicamente.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="export">${IC.down} Exportar backup (JSON)</button>${S.canWrite?`<label class="btn" style="cursor:pointer">${IC.up} Importar backup<input type="file" id="impFile" accept="application/json,.json" hidden></label>`:''}</div>
    <p class="muted" style="font-size:12.5px">${S.atletas.length} atletas · ${S.jogos.length} jogos cadastrados</p></div></div></div>`;
}

;

"use strict";
/* ================= RELATÓRIO INDIVIDUAL DO ATLETA ================= */
function viewAtleta(aid){
  const jogos=jogosFiltrados(),ats=atletasCat();
  let id=aid||S.atlSel;let a=ats.find(x=>x.id===id);if(!a){a=ats.slice().sort((x,y)=>x.nome.localeCompare(y.nome))[0];if(!aid&&a)S.atlSel=a.id;}
  const c=calc(jogos,ats);
  const h=header({sub:'RELATÓRIO DE MINUTAGEM — INDIVIDUAL',title:'RELATÓRIO INDIVIDUAL',meta:'icons',sloganBar:true,items:[[IC.trophy,'Competição',compLabel()],[IC.kCalPlus,'Período',periodo(jogos)],[IC.ballF,'Total de jogos',String(c.nJ)]]});
  const sel=PDFMODE?'':`<div class="pos-tabs no-print" style="align-items:center"><label for="selAtl" style="font-weight:700;font-size:13px;color:var(--ink2)">ATLETA</label><select id="selAtl" class="search" style="min-width:260px">${ats.slice().sort((x,y)=>POS.indexOf(x.posicao)-POS.indexOf(y.posicao)||x.nome.localeCompare(y.nome)).map(x=>`<option value="${x.id}" ${a&&x.id===a.id?'selected':''}>${esc(x.nome)} · ${POSN[x.posicao]}</option>`).join('')}</select></div>`;
  if(!a)return `<div class="report">${h}<div class="rbody">${emptyReport('Nenhum atleta cadastrado nesta categoria')}</div></div>`;
  if(!jogos.length)return `${sel}<div class="report">${h}<div class="rbody">${emptyReport()}</div></div>`;
  const s=c.lista.find(x=>x.a.id===a.id);
  const bioRows=[['Idade',idade(a.nascimento)!==''?idade(a.nascimento)+' anos':'—'],['Nascimento',a.nascimento?fmtData(a.nascimento):'—'],['Posição',a.posDetalhe||POSN[a.posicao]],['Pé dominante',a.pe||'—'],['Estatura',a.altura?nf(a.altura,2)+' m':'—'],['Peso',a.peso?nf(a.peso,1).replace(',0','')+' kg':'—'],['% de gordura',a.gordura!==''&&a.gordura!=null?nf(a.gordura,1)+'%':'—'],['Categoria',(a.categoria||'—')+(a.subcategoria&&a.subcategoria!==a.categoria?' ('+a.subcategoria+')':'')]];
  const card=`<div class="acard ind-card"><div class="photo"><img src="${fotoDe(a)}" alt="Foto de ${esc(a.nome)}"><div class="foot">${IC.foot}<span>Pé<br>${esc((a.pe||'—').toUpperCase())}</span></div><div class="ring">${ring(s.disp,62)}<div style="margin-top:4px">DISP.</div></div></div>
    <div class="name">${a.numero?`<span style="color:var(--g500)">${esc(a.numero)}</span> `:''}${esc(a.nome)}</div><div class="bio"><span class="ptag" style="background:${PC1[a.posicao]}">${POSN[a.posicao].toUpperCase()}</span></div>
    <div class="bio2">${bioRows.map(([k,v])=>`<div><span>${k}</span><b>${esc(v)}</b></div>`).join('')}</div></div>`;
  const kp=`<div class="ind-kpis">
   ${kpi(IC.kClock,'Minutos',nf(s.min),'Total no período')}${kpi(IC.ballF,'Jogos',s.J,'Em campo de '+c.nJ)}${kpi(IC.kShirt,'Titular',s.T,pct(s.T,c.nJ)+'% dos jogos')}${kpi(IC.kSwap,'Reserva',s.R,'Entrou em '+(s.J-s.T>0?s.J-s.T:0))}${kpi(IC.kUserX,'Não relac.',s.NR,pct(s.NR,c.nJ)+'% dos jogos')}
   ${kpi(IC.kPie,'% Disponível',s.disp+'%','De '+nf(c.totDur)+' min')}${kpi(IC.kBars,'Média/jogo',nf(s.mpj,1),'Minutos por jogo')}${a.posicao==='GOL'?kpi(IC.ballF,'Gols sofridos',s.GS,s.J?nf(s.GS/s.J,2)+' por jogo':'—'):kpi(IC.ballF,'Gols',s.G,s.J?nf(s.G/s.J,2)+' por jogo':'—')}${kpi(IC.boot,'Assistências',s.A,'Part. em gol: '+(s.G+s.A))}
   ${kpi(`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="3" width="9" height="16" rx="1.5" fill="#f6c21c"/><rect x="13" y="5" width="9" height="16" rx="1.5" fill="#e3342b"/></svg>`,'Cartões',`${s.CA} <span style="font-size:18px;color:var(--ink3)">/</span> ${s.CV}`,'Amarelos / vermelhos')}</div>`;
  // evolução mensal do atleta
  const mes=Array(12).fill(0);jogos.forEach(j=>{const r=(j.relacionados||[]).find(r=>r.atletaId===a.id);if(r){const m=+j.data.slice(5,7)-1;mes[m]+=+r.min||0;}});
  const m1=+jogos[0].data.slice(5,7)-1,m2=+jogos[jogos.length-1].data.slice(5,7)-1;const same=jogos[0].data.slice(0,4)===jogos[jogos.length-1].data.slice(0,4);
  const meses=[];if(same){for(let m=m1;m<=m2;m++)meses.push(m);}else for(let m=0;m<12;m++)meses.push(m);
  const mx=Math.max(90,...meses.map(m=>mes[m]));const step=mx>600?200:mx>300?100:50;const top=Math.ceil(mx/step)*step;const tk=[];for(let v=top;v>=0;v-=step)tk.push(v);
  const evo=`<div class="panel"><div class="ph">Evolução de minutos por mês</div><div class="pb"><div class="vchart" style="height:180px"><div class="yaxis">${tk.map(t=>`<span>${nf(t)}</span>`).join('')}</div><div class="plot">${tk.slice(0,-1).map(t=>`<div class="gl" style="bottom:${t/top*100}%"></div>`).join('')}${meses.map(m=>`<div class="col"><div class="bar" style="height:${mes[m]/top*100}%">${mes[m]?`<b>${nf(mes[m])}</b>`:''}<small>${MESES[m]}</small></div></div>`).join('')}</div></div></div></div>`;
  const t3=s.minT+s.minR;
  const sit=`<div class="panel"><div class="ph">Minutos por situação</div><div class="pb"><div class="donut-wrap" style="flex-wrap:wrap">${donut([{v:s.minT,c:'#0b4a28'},{v:s.minR,c:'#5fd06c'}],150,26,nf(s.min),'minutos')}
    <div class="legend" style="gap:10px"><div class="li"><span class="sw round" style="background:#0b4a28"></span><div><b>Titular</b><span>${nf(s.minT)} (${pct(s.minT,t3)}%)</span></div></div><div class="li"><span class="sw round" style="background:#5fd06c"></span><div><b>Reserva</b><span>${nf(s.minR)} (${pct(s.minR,t3)}%)</span></div></div><div class="li"><span class="sw round" style="background:#b5bcb8"></span><div><b>Não relacionado</b><span>${s.NR} jogos</span></div></div></div></div></div></div>`;
  const grp=c.lista.filter(x=>x.a.posicao===a.posicao);const avg=k=>grp.length?grp.reduce((t,x)=>t+(typeof k==='function'?k(x):x[k]),0)/grp.length:0;
  const rank=grp.slice().sort((x,y)=>y.min-x.min).findIndex(x=>x.a.id===a.id)+1;
  const metr=[['Minutos',s.min,avg('min'),v=>nf(v)],['Jogos',s.J,avg('J'),v=>nf(v,v%1?1:0)],['% Disponível',s.disp,avg('disp'),v=>nf(v)+'%'],['Gols + Assist.',s.G+s.A,avg(x=>x.G+x.A),v=>nf(v,v%1?1:0)]];
  const cmp=`<div class="panel"><div class="ph">Comparativo com a posição</div><div class="pb"><div class="cmp">${metr.map(([l,v,m,f])=>{const M=Math.max(v,m,1);return `<div class="lb">${l}</div><div class="bars"><div><i style="width:${v/M*70}%;background:linear-gradient(90deg,#17834a,#2fb064)"></i><b>${f(v)}</b></div><div><i style="width:${m/M*70}%;background:#b5bcb8"></i><span class="muted">${f(m)} média</span></div></div>`;}).join('')}</div>
    <div class="muted" style="font-size:13px;margin-top:10px">${rank}º em minutos entre ${grp.length} ${POSP[a.posicao].toLowerCase()} · <i style="display:inline-block;width:10px;height:10px;background:#2fb064;border-radius:2px"></i> atleta &nbsp;<i style="display:inline-block;width:10px;height:10px;background:#b5bcb8;border-radius:2px"></i> média da posição</div></div></div>`;
  const hist=jogos.map(j=>{const r=(j.relacionados||[]).find(r=>r.atletaId===a.id);return {j,r};});
  const half=Math.ceil(hist.length/2);
  const ht=(arr,st)=>`<div class="tbl-wrap"><table class="t"><thead><tr><th>#</th><th>Data</th><th style="min-width:150px">Adversário</th><th>Situação</th><th>Min</th><th>G</th><th>A</th><th><span style="display:inline-block;width:10px;height:13px;background:var(--yellow);border-radius:2px;vertical-align:middle"></span></th><th><span style="display:inline-block;width:10px;height:13px;background:var(--red);border-radius:2px;vertical-align:middle"></span></th></tr></thead><tbody>
   ${arr.map(({j,r},i)=>`<tr><td>${st+i+1}</td><td>${fmtData(j.data).slice(0,5)}</td><td class="l">${j.mando==='fora'?'@ ':''}${esc(j.adversario)}</td><td>${r?`<span class="st-badge st-${r.status}" style="max-width:80px">${r.status==='T'?'Titular':(+r.min>0?'Reserva':'Banco')}</span>`:`<span class="muted" style="font-size:12px">${esc((j.motivos||{})[a.id]||'Não relac.')}</span>`}</td><td>${r?+r.min||0:'—'}</td><td>${r?+r.gols||0:'—'}</td><td>${r?+r.assist||0:'—'}</td><td>${r?+r.ca||0:'—'}</td><td>${r?+r.cv||0:'—'}</td></tr>`).join('')}</tbody></table></div>`;
  const histP=`<div class="panel" style="margin-top:14px"><div class="ph">Histórico jogo a jogo<span class="r">${hist.length} jogos no período</span></div><div class="ind-hist">${ht(hist.slice(0,half),0)}${hist.length>1?ht(hist.slice(half),half):''}</div></div>`;
  return `${sel}<div class="report">${h}<div class="rbody"><div class="ind-top">${card}<div class="ind-right">${kp}<div class="ind-mid">${evo}${sit}${cmp}</div></div></div>${histP}${footer('RELATÓRIO DE MINUTAGEM — INDIVIDUAL DO ATLETA')}</div></div>`;
}

/* ================= CARREGAMENTO DE BIBLIOTECAS ================= */
const LIBS={xlsx:'/libs/xlsx.full.min.js',h2c:'/libs/html2canvas.min.js',jspdf:'/libs/jspdf.umd.min.js'};
const _libP={};
function loadLib(k){if(_libP[k])return _libP[k];_libP[k]=new Promise((res,rej)=>{const s=document.createElement('script');s.src=LIBS[k];s.onload=res;s.onerror=()=>{delete _libP[k];rej(new Error('lib'));};document.head.appendChild(s);});return _libP[k];}
async function saveFile(filename,data){
  try{const dl=window.claude&&await window.claude.use('downloads');
    if(dl){await dl.save({filename,data});toast('Arquivo pronto: '+filename);return true;}}
  catch(e){if(e&&e.code==='declined')return false;if(e&&e.code==='rate_limited'){toast('Aguarde a janela de download anterior.');return false;}}
  try{const blob=data instanceof Blob?data:new Blob([data]);const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);return true;}catch(e){toast('Não foi possível baixar o arquivo aqui.');return false;}
}

/* ================= PÁGINA DE RELATÓRIOS ================= */
S.rep={capa:true,capaTit:'auto',dash:true,dashRows:10,geral:true,jogo:false,jogos:[],pos:true,poss:['GOL','LAT','ZAG','VOL','MEI','ATA','EXT'],atl:false,atls:[],atlBusca:''};
try{const r=JSON.parse(localStorage.getItem('pv_rep')||'null');if(r)Object.assign(S.rep,r,{atlBusca:''});}catch(e){}
const saveRep=()=>{try{localStorage.setItem('pv_rep',JSON.stringify(S.rep));}catch(e){}};
function capaAno(){if(S.filtro.ano!=='Todos')return S.filtro.ano;const js=jogosFiltrados();return js.length?js[js.length-1].data.slice(0,4):String(new Date().getFullYear());}
function capaSpec(specs,titulo){
  let t=titulo&&titulo!=='auto'?titulo:null,sub='';
  const jogosSp=specs.filter(x=>x.t==='jogo');
  if(!t){if(specs.length&&specs.every(x=>x.t==='jogo'))t=jogosSp.length===1?'Painel do jogo':'Relatório de jogos';else if(specs.length&&specs.every(x=>x.t==='painel'||x.t==='jogo'))t='Painel de jogos';else t='Minutagem';}
  if(jogosSp.length===1&&specs.every(x=>x.t==='jogo')){const j=S.jogos.find(x=>x.id===jogosSp[0].id);if(j){const casa=j.mando!=='fora';sub=`${casa?'Porto Vitória':j.adversario} ${casa?(j.golsPro??'-'):(j.golsContra??'-')} x ${casa?(j.golsContra??'-'):(j.golsPro??'-')} ${casa?j.adversario:'Porto Vitória'} · ${fmtData(j.data)} · ${j.categoria}`;}}
  const ano=jogosSp.length===1&&specs.every(x=>x.t==='jogo')?(S.jogos.find(x=>x.id===jogosSp[0].id)?.data||'').slice(0,4)||capaAno():capaAno();
  return {t:'capa',titulo:t,sub,ano,label:'Capa'};
}
function capaHTML(sp){
  const profs=(S.config.profissionais||[]).filter(p=>p.ativo!==false&&p.nome);
  const tl=sp.titulo.length;const cls=tl>16?'s':tl>11?'m':'';const a=String(sp.ano||'');
  return `<div class="pdfpage capa"><div class="c-top">${esc(S.config.capaTopo||'')}</div>
   <div class="c-mid"><div class="c-tit ${cls}">${esc(sp.titulo)}</div>${sp.sub?`<div class="c-sub">${esc(sp.sub)}</div>`:''}${profs.length?`<div class="c-prof">${profs.map(p=>esc(p.nome)+(p.cargo?' - '+esc(p.cargo):'')).join('<br>')}</div>`:''}</div>
   <img class="c-logo" src="${LOGO}" alt=""><div class="c-ano">${esc(a.slice(0,2))}<br>${esc(a.slice(2))}</div></div>`;
}
function comCapa(specs,titulo){if(!S.rep.capa||!specs.length||specs[0].t==='capa')return specs;return [capaSpec(specs,titulo),...specs];}
function repSpecs(){
  const R=S.rep,out=[];const jogos=jogosFiltrados(),ats=atletasCat();
  if(R.dash)out.push({t:'dash',rows:R.dashRows,label:'Dashboard'});
  if(R.geral)out.push({t:'geral',label:'Minutagem geral'});
  if(R.painel)out.push({t:'painel',label:'Painel de jogos (página única)'});
  if(R.jogo)jogos.filter(j=>R.jogos.includes(j.id)).forEach(j=>out.push({t:'jogo',id:j.id,label:'Jogo · '+j.adversario+' '+fmtData(j.data)}));
  if(R.pos)POS.filter(p=>R.poss.includes(p)&&ats.some(a=>a.posicao===p)).forEach(p=>{const pts=dividir(ats.filter(a=>a.posicao===p).length);pts.forEach((_,k)=>out.push({t:'pos',p,part:k,label:'Posição · '+POSP[p]+(pts.length>1?` (${k+1}/${pts.length})`:'')}));});
  if(R.atl)ats.filter(a=>R.atls.includes(a.id)).sort((x,y)=>POS.indexOf(x.posicao)-POS.indexOf(y.posicao)||x.nome.localeCompare(y.nome)).forEach(a=>out.push({t:'atl',id:a.id,label:'Atleta · '+a.nome}));
  return comCapa(out,R.capaTit);
}
function specHTML(sp,i,n){
  PDFMODE=true;PG={i,n};let h='';
  if(sp.t==='capa'){PDFMODE=false;return capaHTML(sp);}
  if(sp.t==='painel'){try{h=viewJogosPainel();}finally{PDFMODE=false;PG={i:1,n:1};}return `<div class="pdfpage tall"><div class="pg-fit"><div class="rwrap">${h}</div></div></div>`;}
  try{h=sp.t==='dash'?viewDashboard({rows:sp.rows}):sp.t==='geral'?viewGeral():sp.t==='jogo'?viewPorJogo(sp.id):sp.t==='pos'?viewPosicao(sp.p,sp.part??0):viewAtleta(sp.id);}
  finally{PDFMODE=false;PG={i:1,n:1};}
  return `<div class="pdfpage"><div class="pg-fit"><div class="rwrap">${h}</div></div></div>`;
}
function fitPage(el){
  if(el.classList.contains('tall'))return;
  const fit=el.querySelector('.pg-fit');if(!fit)return;fit.style.transform='';fit.style.width='100%';
  const avail=el.clientHeight-20;let h=fit.scrollHeight;if(h<=avail)return;
  let s=avail/h;for(let k=0;k<4;k++){fit.style.width=(100/s)+'%';h=fit.scrollHeight;const ns=avail/h;if(ns>=s*0.995&&ns<=s*1.005)break;s=Math.min(1,ns);}
  s=Math.min(1,avail/fit.scrollHeight);fit.style.width=(100/s)+'%';fit.style.transformOrigin='top left';fit.style.transform=`scale(${s})`;
}
function viewRelatorio(){
  const R=S.rep,jogos=jogosFiltrados(),ats=atletasCat();
  const specs=repSpecs();
  const opt=(k,t,sub,extra='')=>`<div class="rep-opt"><label><input type="checkbox" data-rep="${k}" ${R[k]?'checked':''}>${t}<small>${extra}</small></label>${R[k]&&sub?`<div class="rep-sub">${sub}</div>`:''}</div>`;
  const jogosSub=jogos.length?`<div class="tools"><button data-repall="jogos">Marcar todos</button><button data-repnone="jogos">Limpar</button></div>${jogos.slice().reverse().map(j=>`<label><input type="checkbox" data-repj="${j.id}" ${R.jogos.includes(j.id)?'checked':''}>${fmtData(j.data)} · ${esc(j.adversario)} <span class="muted">${j.golsPro??'-'}x${j.golsContra??'-'}</span></label>`).join('')}`:'<span class="muted">Sem jogos no filtro.</span>';
  const posSub=`<div class="tools"><button data-repall="poss">Marcar todas</button><button data-repnone="poss">Limpar</button></div>${POS.map(p=>`<label><input type="checkbox" data-repp="${p}" ${R.poss.includes(p)?'checked':''}><i style="width:10px;height:10px;border-radius:50%;background:${PC1[p]};display:inline-block"></i>${POSP[p]} <span class="muted">(${ats.filter(a=>a.posicao===p).length})</span></label>`).join('')}`;
  const q=R.atlBusca.toLowerCase();
  const atlSub=`<input class="search" id="repBusca" placeholder="Buscar atleta" value="${esc(R.atlBusca)}"><div class="tools"><button data-repall="atls">Marcar todos</button><button data-repnone="atls">Limpar</button></div>${ats.filter(a=>!q||a.nome.toLowerCase().includes(q)).sort((x,y)=>POS.indexOf(x.posicao)-POS.indexOf(y.posicao)||x.nome.localeCompare(y.nome)).map(a=>`<label><input type="checkbox" data-repa="${a.id}" ${R.atls.includes(a.id)?'checked':''}><span class="ptag" style="background:${PC2[a.posicao]};min-width:0;font-size:11px">${a.posicao}</span>${esc(a.nome)}${subTag(a)}</label>`).join('')}`;
  const side=`<div class="rep-side">
   <div class="muted" style="font-size:13px">Escolha o que entra no PDF. Os filtros do topo (categoria, competição e ano) valem para todas as páginas. Cada página sai no formato das imagens (paisagem 3:2).</div>
   <div class="rep-opt"><label><input type="checkbox" data-rep="capa" ${R.capa?'checked':''}>Capa<small>também no "PDF desta página"</small></label>${R.capa?`<div class="rep-sub"><label>Título <select id="repCapaTit">${[['auto','Automático'],['Minutagem','Minutagem'],['Painel de jogos','Painel de jogos'],['Painel do jogo','Painel do jogo'],['Relatório de jogos','Relatório de jogos']].map(([v,l])=>`<option value="${v}" ${R.capaTit===v?'selected':''}>${l}</option>`).join('')}</select></label><span class="muted" style="font-size:12px">Profissionais e texto do topo: Configurações → Capa dos relatórios.</span></div>`:''}</div>
   ${opt('dash','Dashboard',`<label>Linhas no detalhamento <select id="repRows">${[10,15,20,0].map(n=>`<option value="${n}" ${R.dashRows===n?'selected':''}>${n?'Top '+n:'Todos'}</option>`).join('')}</select></label>`,'1 página')}
   ${opt('geral','Minutagem geral','','1 página')}
   ${opt('painel','Painel de jogos','','página única, inteira')}
   ${opt('jogo','Minutagem por jogo',jogosSub,R.jogos.filter(id=>jogos.some(j=>j.id===id)).length+' jogo(s)')}
   ${opt('pos','Individual por posição',posSub,R.poss.filter(p=>ats.some(a=>a.posicao===p)).length+' posição(ões)')}
   ${opt('atl','Relatório individual do atleta',atlSub,R.atls.filter(id=>ats.some(a=>a.id===id)).length+' atleta(s)')}
   <div class="rep-actions"><button class="btn pri" data-act="pdf" ${specs.length?'':'disabled'}>${IC.down} Gerar PDF (${specs.length} ${specs.length===1?'página':'páginas'})</button><button class="btn" data-act="printRep" ${specs.length?'':'disabled'}>${IC.print} Imprimir</button></div></div>`;
  const prev=!jogos.length?emptyReport():!specs.length?`<div class="empty"><h3>Nenhuma página selecionada</h3><p>Marque ao menos um relatório ao lado.</p></div>`:
    `<div class="rep-prev" id="repPrev">${specs.slice(0,12).map((sp,i)=>`<div class="pg-thumb" data-pg="${i}"><span class="pgn">${i+1} / ${specs.length} · ${esc(sp.label)}</span><div class="pg-scale">${specHTML(sp,i+1,specs.length)}</div></div>`).join('')}${specs.length>12?`<div class="empty" style="padding:20px">+ ${specs.length-12} páginas (a prévia mostra as 12 primeiras; o PDF inclui todas).</div>`:''}</div>`;
  return `<div class="page-h no-print"><h2>Relatórios em PDF</h2><span class="muted">${esc(catLabelSp())} · ${esc(compLabel())} · ${esc(periodo(jogos))}</span></div><div class="rep-layout">${side}${prev}</div>`;
}
function layoutPreview(){
  const box=$('#repPrev');if(!box)return;
  box.querySelectorAll('.pg-thumb').forEach(t=>{const w=t.clientWidth;const sc=w/1536;const inner=t.querySelector('.pg-scale');inner.style.transform=`scale(${sc})`;const pg=inner.querySelector('.pdfpage');fitPage(pg);t.style.height=((pg.classList.contains('tall')?pg.offsetHeight:1024)*sc)+'px';});
}
function bindRelatorio(){
  if(S.view!=='relatorio')return;
  const R=S.rep;const re=()=>{saveRep();render();};
  document.querySelectorAll('[data-rep]').forEach(i=>i.onchange=()=>{const k=i.dataset.rep;R[k]=i.checked;
    if(k==='jogo'&&i.checked&&!R.jogos.length){const j=jogosFiltrados();if(j.length)R.jogos=[j[j.length-1].id];}
    if(k==='atl'&&i.checked&&!R.atls.length){const a=atletasCat()[0];if(a)R.atls=[a.id];}re();});
  const tog=(attr,key)=>document.querySelectorAll(`[${attr}]`).forEach(i=>i.onchange=()=>{const v=i.getAttribute(attr);R[key]=i.checked?[...new Set([...R[key],v])]:R[key].filter(x=>x!==v);re();});
  tog('data-repj','jogos');tog('data-repp','poss');tog('data-repa','atls');
  document.querySelectorAll('[data-repall]').forEach(b=>b.onclick=()=>{const k=b.dataset.repall;R[k]=k==='jogos'?jogosFiltrados().map(j=>j.id):k==='poss'?POS.slice():atletasCat().filter(a=>!R.atlBusca||a.nome.toLowerCase().includes(R.atlBusca.toLowerCase())).map(a=>a.id);re();});
  document.querySelectorAll('[data-repnone]').forEach(b=>b.onclick=()=>{R[b.dataset.repnone]=[];re();});
  const ct=$('#repCapaTit');if(ct)ct.onchange=()=>{R.capaTit=ct.value;re();};
  const rr=$('#repRows');if(rr)rr.onchange=()=>{R.dashRows=+rr.value;re();};
  const rb=$('#repBusca');if(rb)rb.oninput=()=>{R.atlBusca=rb.value;const p=rb.selectionStart;render();const n=$('#repBusca');if(n){n.focus();n.setSelectionRange(p,p);}};
  requestAnimationFrame(layoutPreview);
}
window.addEventListener('resize',()=>{if(window.__APP!=='min')return;if(S.view==='relatorio')layoutPreview();});

/* ---------- preparação para captura (html2canvas) ---------- */
async function prepCapture(root){
  for(const img of root.querySelectorAll('img')){if(img.src.startsWith('data:image/svg')){let vw=120,vh=140;try{const m=decodeURIComponent(img.src.split(',')[1]).match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);if(m){vw=+m[1];vh=+m[2];}}catch(e){}const w=Math.round(vw*4),h=Math.round(vh*4);img.src=await svgToPng(img.src,w,h);await new Promise(z=>img.complete?z():(img.onload=img.onerror=z));}}
  root.querySelectorAll('svg').forEach(svg=>{svg.querySelectorAll('*').forEach(el=>{const cs=getComputedStyle(el);
      if(['path','circle','rect','line','ellipse','polygon','polyline','text','g'].includes(el.tagName)){if(cs.fill)el.setAttribute('fill',cs.fill);if(cs.stroke)el.setAttribute('stroke',cs.stroke);}});
    const cs=getComputedStyle(svg);if(cs.fill)svg.setAttribute('fill',cs.fill);if(cs.stroke&&svg.getAttribute('stroke'))svg.setAttribute('stroke',cs.stroke);
});
  root.querySelectorAll('img').forEach(img=>{const cs=getComputedStyle(img);if(cs.objectFit==='cover'||cs.objectFit==='contain'){
    const d=document.createElement('div');d.className=img.className;d.style.cssText=`background-image:url("${img.src}");background-size:${cs.objectFit};background-repeat:no-repeat;background-position:${cs.objectPosition||'center'};width:${img.offsetWidth}px;height:${img.offsetHeight}px;display:${cs.display==='inline'?'inline-block':cs.display};border-radius:${cs.borderRadius};vertical-align:middle;flex:${cs.flex};margin:${cs.margin};background-color:${cs.backgroundColor}`;img.replaceWith(d);}});
}
function imgsLoaded(el){return Promise.all([...el.querySelectorAll('img')].map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r;})));}
function progress(txt,p){let o=$('#progBox');if(!o){o=document.createElement('div');o.id='progBox';o.className='prog';document.body.appendChild(o);}o.innerHTML=`<div><b style="font-family:var(--fc);font-size:20px">${esc(txt)}</b><div class="bar"><i style="width:${Math.round(p*100)}%"></i></div></div>`;}
function progressEnd(){const o=$('#progBox');if(o)o.remove();}
async function gerarPDF(specs){
  specs=specs?comCapa(specs):repSpecs();if(!specs.length)return;
  progress('Preparando o PDF…',0);
  try{await Promise.all([loadLib('h2c'),loadLib('jspdf')]);}catch(e){progressEnd();toast('Não foi possível carregar o gerador de PDF. Verifique a conexão.');return;}
  try{await document.fonts.ready;}catch(e){}
  const holder=document.createElement('div');holder.style.cssText='position:fixed;left:0;top:0;z-index:140;width:1536px;height:1024px;pointer-events:none';document.body.appendChild(holder);
  const {jsPDF}=window.jspdf;let pdf=null;
  try{
    for(let i=0;i<specs.length;i++){
      progress(`Gerando página ${i+1} de ${specs.length}…`,i/specs.length);
      holder.innerHTML=specHTML(specs[i],i+1,specs.length);const el=holder.firstElementChild;
      await imgsLoaded(el);fitPage(el);await prepCapture(el);
      const tall=el.classList.contains('tall');const hpx=tall?Math.ceil(el.offsetHeight):1024;
      if(tall)holder.style.height=hpx+'px';
      const cv=await html2canvas(el,{scale:tall?1.4:1.6,backgroundColor:'#eef2ef',useCORS:true,logging:false,windowWidth:1700,windowHeight:Math.max(1100,hpx+50),scrollX:0,scrollY:0,width:1536,height:hpx});
      holder.style.height='1024px';
      const pw=1152,ph=Math.round(1152*hpx/1536);const fmt=[pw,ph];const ori=pw>=ph?'landscape':'portrait';
      if(!pdf)pdf=new jsPDF({orientation:ori,unit:'pt',format:fmt,compress:true});else pdf.addPage(fmt,ori);
      pdf.addImage(cv.toDataURL('image/jpeg',0.9),'JPEG',0,0,pw,ph,undefined,'FAST');
      await new Promise(r=>setTimeout(r,10));
    }
    progress('Finalizando…',1);
    const blob=pdf.output('blob');holder.remove();progressEnd();
    const nome=`Relatorio-Minutagem-${(S.filtro.categoria||'').replace(/\s/g,'')}-${new Date().toISOString().slice(0,10)}.pdf`;
    await saveFile(nome,blob);
  }catch(e){console.error(e);holder.remove();progressEnd();toast('Erro ao gerar o PDF. Tente com menos páginas ou use Imprimir.');}
}
function imprimirRel(specs){
  specs=specs?comCapa(specs):repSpecs();if(!specs.length)return;
  let pr=$('#printRoot');if(pr)pr.remove();pr=document.createElement('div');pr.id='printRoot';
  pr.innerHTML=specs.map((sp,i)=>specHTML(sp,i+1,specs.length)).join('');document.body.appendChild(pr);
  pr.querySelectorAll('.pdfpage').forEach(fitPage);const tallP=pr.querySelector('.pdfpage.tall');
  const st=document.createElement('style');st.id='printStyle';st.textContent=(specs.length===1&&tallP?`@page{size:1536px ${tallP.offsetHeight+4}px;margin:0}`:'@page{size:1536px 1024px;margin:0}')+'@media print{body.printing .app,body.printing #modalRoot,body.printing .toast{display:none!important}body.printing{height:auto!important;background:#eef2ef}#printRoot .pdfpage{page-break-after:always;break-after:page}}@media screen{#printRoot{position:fixed;left:-30000px;top:0}}';
  document.head.appendChild(st);document.body.classList.add('printing');
  const done=()=>{document.body.classList.remove('printing');pr.remove();st.remove();window.removeEventListener('afterprint',done);};
  window.addEventListener('afterprint',done);
  setTimeout(()=>{try{window.print();}catch(e){toast('Use Gerar PDF.');}setTimeout(done,1500);},300);
}

;

"use strict";
/* ================= IMPORTAÇÃO / EXPORTAÇÃO EXCEL ================= */
const nrm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9%]/g,'');
const ALIAS={
 nome:['nome','atleta','jogador','nomecompleto','nomedoatleta','nomeatleta'],apelido:['apelido','nomenocampo','nomedecampo','nomecamisa'],
 numero:['camisa','numero','n','num','numerocamisa'],nascimento:['datadenascimento','nascimento','datanascimento','dn','dtnasc','datanasc','datadenasc'],
 categoria:['categoria','cat'],posicao:['posicao','pos','funcao'],posDetalhe:['posicaodetalhada','posicaoespecifica','funcaoespecifica','subposicao'],
 pe:['pe','pedominante','pepreferido','lateralidade','perna'],altura:['estatura','altura','alturam','estaturam','alturacm','estaturacm'],
 peso:['peso','pesokg','massa','massacorporal'],gordura:['gordura','%gordura','percentualdegordura','gorduracorporal','%g','bf','%bf','percentualgordura','%degordura','gordura%'],
 data:['data','datadojogo','dia','date','datajogo'],minutos:['minutos','min','minutagem','tempo','minutosjogados','minjogados','minutagemjogada'],
 situacao:['situacao','condicao','titularreserva','tipo','relacionado'],status:['status','statusatleta'],gs:['golsofrido','golsofridos','golssofridos','gs','golsofridogoleiro'],gols:['gols','g','gol'],assist:['assistencias','assist','a','assistencia','ass'],
 ca:['amarelo','amarelos','cartaoamarelo','ca','cartoesamarelos'],cv:['vermelho','vermelhos','cartaovermelho','cv','cartoesvermelhos'],
 adversario:['adversario','oponente','contra','adv','rival'],jogo:['jogo','partida','confronto'],mes:['mes'],periodo:['periodo','tempodojogo'],atividade:['atividade','tipodeatividade','evento'],jg:['jg','jogou','jogos'],competicao:['competicao','campeonato','torneio','comp'],
 local:['local','estadio','campo'],mando:['mando','casafora','mandante'],hora:['hora','horario'],placar:['placar','resultado'],
 golsPro:['golspro','golsporto','golsmarcados','gp','golsfeitos'],golsContra:['golscontra','gc','golstomados'],motivo:['motivo','observacao','obs','justificativa'],
 duracao:['duracao','duracaojogo','tempototal','tempojogo','tempodejogo','tempoporjogo']
};
function mapHeaders(row){const m={};row.forEach((h,i)=>{const n=nrm(h);if(!n)return;for(const k in ALIAS){if(m[k]===undefined&&ALIAS[k].includes(n)){m[k]=i;return;}}});return m;}
const pad=n=>String(n).padStart(2,'0');
function parseDate(v,defY){
  if(v==null||v==='')return null;
  if(v instanceof Date&&!isNaN(v)){const d=new Date(v.getTime()+12*3600e3);return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;}
  if(typeof v==='number'&&v>20000&&v<80000){const d=new Date(Math.round((v-25569)*86400e3));return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;}
  const s=String(v).trim();let m;
  if((m=s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/)))return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  if((m=s.match(/^(\d{1,2})[\/.\-](\d{1,2})(?:[\/.\-](\d{2,4}))?/))){let y=m[3]?+m[3]:+defY;if(y<100)y+=2000;const dd=+m[1],mm=+m[2];if(mm<1||mm>12||dd<1||dd>31)return null;return `${y}-${pad(mm)}-${pad(dd)}`;}
  return null;
}
function parsePos(v){const n=nrm(v);if(!n)return {};
  if(/^(gol|goleiro|gk|gl)/.test(n))return {p:'GOL'};
  if(n==='ld'||n.includes('lateraldireito'))return {p:'LAT',d:'Lateral Direito'};if(n==='le'||n.includes('lateralesquerdo'))return {p:'LAT',d:'Lateral Esquerdo'};
  if(/^(lat|ala)/.test(n))return {p:'LAT'};if(/^(zag|zg|defensor|beque)/.test(n))return {p:'ZAG',d:n.includes('direit')?'Zagueiro Direito':n.includes('esquerd')?'Zagueiro Esquerdo':''};
  if(/^(vol|primeirovolante|segundovolante|cabeca)/.test(n))return {p:'VOL'};
  if(/^(ext|extremo|ponta|pd$|pe$|wing)/.test(n))return {p:'EXT',d:n.includes('direit')||n==='pd'?'Ponta Direita':n.includes('esquerd')?'Ponta Esquerda':''};
  if(/^(mei|meia|meio|armador|mc|me)/.test(n))return {p:'MEI'};if(/^(ata|atacante|centroavante|ca$|cent|seg|ponteiro|avante|ca9)/.test(n))return {p:'ATA',d:n.includes('centro')?'Centroavante':''};
  return {};}
function parsePe(v){const n=nrm(v);if(!n)return '';if(n.startsWith('d'))return 'Direito';if(n.startsWith('e'))return 'Esquerdo';if(n.startsWith('a'))return 'Ambidestro';return '';}
function parseSit(v){const n=nrm(v);if(!n)return '';if(['t','titular','tit','1','sim','s'].includes(n)||n.startsWith('titular'))return 'T';
  if(['r','reserva','res','banco','b','suplente','sup','entrou'].includes(n)||n.startsWith('reserva')||n.startsWith('banco'))return 'R';
  if(['nr','naorelacionado','nao','n','ausente','fora','x','naorel','0'].includes(n)||n.startsWith('nao'))return 'NR';return '';}
/* "Rio Branco 0 x 2 Porto Vitória", "Porto Vitória 2x0 Rio Branco", "Rio Branco 0 x Porto Vitória 2", "Rio Branco 0 X 2" */
function parseJogo(v){
  const t=String(v??'').replace(/\s+/g,' ').trim();if(!t)return {};
  const isPV=x=>/porto/i.test(x);const clean=x=>x.replace(/^[\s\-–:|]+|[\s\-–:|]+$/g,'').replace(/\s*\(?\b(sub|u)[\s\-]?\d{2}\)?$/i,'').trim();
  let m=t.match(/^(.*?)\s*(\d+)\s*[x×X]\s*(\d+)\s*(.*)$/),A,B,gA,gB;
  if(m){A=clean(m[1]);gA=+m[2];gB=+m[3];B=clean(m[4]);}
  else if((m=t.match(/^(.*?)\s*(\d+)\s*[x×X]\s*(.*?)\s*(\d+)$/))){A=clean(m[1]);gA=+m[2];B=clean(m[3]);gB=+m[4];}
  else{const p=t.split(/\s+[x×X]\s+|\s+vs\.?\s+/i);if(p.length===2){const a=clean(p[0]),b=clean(p[1]);if(isPV(a))return {adv:b,mando:'casa'};if(isPV(b))return {adv:a,mando:'fora'};}return {};}
  if(isPV(A)&&!isPV(B))return {adv:B||'',gp:gA,gc:gB,mando:'casa'};
  if(isPV(B)&&!isPV(A))return {adv:A||'',gp:gB,gc:gA,mando:'fora'};
  if(A&&!B)return {adv:A,gp:gB,gc:gA,mando:'fora'};   // "Rio Branco 0 x 2" → 2 é do Porto Vitória
  if(B&&!A)return {adv:B,gp:gA,gc:gB,mando:'casa'};
  return {};
}
function parseRes(v){const s=String(v??'').trim();if(!s)return {};const m=s.match(/(\d+)\s*[x×\-:]\s*(\d+)/i);const r={};if(m){r.gp=+m[1];r.gc=+m[2];}const n=nrm(s);if(/^(v|vit|vitoria|ganhou|g)/.test(n))r.res='V';else if(/^(d|der|derrota|perdeu|p)/.test(n))r.res='D';else if(/^(e|emp|empate)/.test(n))r.res='E';return r;}
const num=v=>{if(v==null||v==='')return null;if(typeof v==='number')return v;const x=parseFloat(String(v).replace(',','.').replace(/[^0-9.\-]/g,''));return isNaN(x)?null:x;};
async function lerPlanilha(file){
  await loadLib('xlsx');const buf=await file.arrayBuffer();let wb;
  if(/\.(csv|txt)$/i.test(file.name)){let txt;try{txt=new TextDecoder('utf-8',{fatal:true}).decode(buf);}catch(e){txt=new TextDecoder('windows-1252').decode(buf);}
    txt=txt.replace(/^\uFEFF/,'');const l1=txt.split(/\r?\n/)[0]||'';const cnt=c=>l1.split(c).length;const FS=cnt(';')>=cnt(',')&&cnt(';')>=cnt('\t')?';':cnt('\t')>cnt(',')?'\t':',';
    wb=XLSX.read(txt,{type:'string',FS,raw:true});}
  else wb=XLSX.read(buf,{type:'array',cellDates:true});
  return wb.SheetNames.map(n=>({nome:n,rows:XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1,raw:true,defval:''}).filter(r=>r.some(c=>c!==''&&c!=null))})).filter(s=>s.rows.length);
}
function acharCabecalho(rows,need){for(let i=0;i<Math.min(15,rows.length);i++){const m=mapHeaders(rows[i]);if(need.every(k=>m[k]!==undefined))return {i,m};}return null;}
const findAtleta=(nome,cat)=>{const n=nrm(nome);if(!n)return null;return S.atletas.find(a=>nrm(a.nome)===n&&a.categoria===cat)||S.atletas.find(a=>nrm(a.apelido)===n&&a.categoria===cat)||S.atletas.find(a=>nrm(a.nome)===n)||null;};

/* ---------- Atletas ---------- */
let IMP=null;
function parseAtletas(sheet,opts){
  const hd=acharCabecalho(sheet.rows,['nome']);if(!hd)return {erro:'Não encontrei a coluna "Nome" (ou "Atleta") nas primeiras linhas da planilha.'};
  const {i,m}=hd;const out=[],avisos=[];const g=(r,k)=>m[k]!==undefined?r[m[k]]:'';
  sheet.rows.slice(i+1).forEach((r,ix)=>{const nome=String(g(r,'nome')||'').trim();if(!nome)return;
    const pp=parsePos(g(r,'posicao'));const pd=parsePos(g(r,'posDetalhe'));
    let alt=num(g(r,'altura'));if(alt&&alt>3)alt=alt/100;let gord=num(g(r,'gordura'));if(gord!=null&&gord>0&&gord<1)gord=Math.round(gord*1000)/10;
    const nasc=parseDate(g(r,'nascimento'),2000);const pc=parseCat(g(r,'categoria'));const pi=subPorIdade(nasc,S.config.anoBase);const cat=pc.cat||pi.cat||opts.categoria;const sub=pc.sub||(pi.cat===cat?pi.sub:'');
    const posicao=pp.p||pd.p||null;if(!posicao)avisos.push(`Linha ${i+ix+2}: posição de ${nome} não reconhecida ("${g(r,'posicao')}") — usarei ${POSN[opts.posicao]}.`);
    const ex=findAtleta(nome,cat);
    out.push({ex,dados:{nome,apelido:String(g(r,'apelido')||'').trim(),numero:num(g(r,'numero'))??'',nascimento:nasc||'',categoria:cat,subcategoria:sub,posicao:posicao||opts.posicao,posDetalhe:String(g(r,'posDetalhe')||'').trim()&&!pd.p?String(g(r,'posDetalhe')).trim():(pd.d||pp.d||''),pe:parsePe(g(r,'pe')),altura:alt?Math.round(alt*100)/100:'',peso:num(g(r,'peso'))??'',gordura:gord??''},cols:m});});
  return {lista:out,avisos,cols:Object.keys(m)};
}
/* ---------- Minutagem ---------- */
function parseMinutagem(sheet,opts){
  const avisos=[];const recs=[];
  let hd=acharCabecalho(sheet.rows,['nome','data']);
  if(hd&&(hd.m.minutos!==undefined||hd.m.situacao!==undefined)){
    const {i,m}=hd;const g=(r,k)=>m[k]!==undefined?r[m[k]]:'';
    let treinos=0;
    sheet.rows.slice(i+1).forEach((r,ix)=>{const nome=String(g(r,'nome')||'').trim();const data=parseDate(g(r,'data'),opts.ano);
      if(!nome&&!data)return;if(!nome||!data){avisos.push(`Linha ${i+ix+2} ignorada: ${!nome?'sem atleta':'data inválida ("'+g(r,'data')+'")'}.`);return;}
      const ativ=String(g(r,'atividade')||'').trim();const na=nrm(ativ);if(na&&na.startsWith('treino')&&!na.includes('jogo')){treinos++;return;}
      let gp=num(g(r,'golsPro')),gc=num(g(r,'golsContra'));const pr=parseRes(g(r,'placar'));if(pr.gp!=null){gp=pr.gp;gc=pr.gc;}
      const s1=parseSit(g(r,'situacao')),s2=parseSit(g(r,'status'));const sit=s1==='NR'||s2==='NR'?'NR':(s1==='T'||s2==='T')?'T':(s1||s2);
      const resLetra=pr.res||parseRes(g(r,'situacao')).res||'';
      let adv=String(g(r,'adversario')||'').trim();const jogo=String(g(r,'jogo')||'').trim();
      const pj=parseJogo(jogo);if(!adv&&pj.adv)adv=pj.adv;if(pj.gp!=null){gp=pj.gp;gc=pj.gc;}
      const mn=g(r,'minutos');let md=nrm(g(r,'mando'));if(!md&&pj.mando)md=pj.mando;
      recs.push({data,nome,min:num(mn),minVazio:mn===''||mn==null,sit,gols:num(g(r,'gols'))||0,gs:num(g(r,'gs'))||0,assist:num(g(r,'assist'))||0,ca:num(g(r,'ca'))||0,cv:num(g(r,'cv'))||0,
        adv,jogo,ativ,comp:String(g(r,'competicao')||'').trim(),cat:String(g(r,'categoria')||'').trim()||(/sub|^u\s?\d/i.test(String(g(r,'periodo')))?String(g(r,'periodo')).trim():''),local:String(g(r,'local')||'').trim(),
        mando:/^(f|visit)/.test(md)?'fora':(md?'casa':''),hora:g(r,'hora') instanceof Date?`${pad(g(r,'hora').getHours())}:${pad(g(r,'hora').getMinutes())}`:String(g(r,'hora')||'').slice(0,5),
        gp,gc,res:resLetra,motivo:String(g(r,'motivo')||'').trim()||(sit==='NR'&&!s2?String(g(r,'status')||'').trim():''),pos:g(r,'posicao'),dur:num(g(r,'duracao'))});});
    if(treinos)avisos.push(`${treinos} linha(s) de treino ignoradas (coluna Atividade).`);
    return montarJogos(recs,opts,avisos,'linhas',hd.m.situacao!==undefined||hd.m.status!==undefined);
  }
  // formato em colunas: atleta + uma coluna por jogo (data)
  for(let i=0;i<Math.min(15,sheet.rows.length);i++){const row=sheet.rows[i];const m=mapHeaders(row);if(m.nome===undefined)continue;
    const cols=[];row.forEach((h,ci)=>{if(ci===m.nome)return;const d=parseDate(h,opts.ano);if(d){const rest=typeof h==='string'?h.replace(/^\s*\d{1,4}[\/.\-]\d{1,2}([\/.\-]\d{2,4})?\s*/,'').replace(/^[\s\-–·x×:|]+/i,'').trim():'';cols.push({ci,data:d,adv:rest});}});
    if(cols.length<1)continue;
    sheet.rows.slice(i+1).forEach(r=>{const nome=String(r[m.nome]||'').trim();if(!nome||/^total/i.test(nome))return;
      cols.forEach(c=>{const v=r[c.ci];if(v===''||v==null)return;const s=String(v).trim();let sit='',mn=num(v);
        const mm=s.match(/^([TRtr])\s*(\d+)?$/);if(mm){sit=mm[1].toUpperCase();mn=mm[2]?+mm[2]:0;}else if(parseSit(s)==='NR'&&mn==null){sit='NR';}
        recs.push({data:c.data,nome,min:mn,minVazio:false,sit,gols:0,assist:0,ca:0,cv:0,adv:c.adv,comp:'',cat:m.categoria!==undefined?String(r[m.categoria]||'').trim():'',local:'',mando:'',hora:'',gp:null,gc:null,motivo:'',pos:m.posicao!==undefined?r[m.posicao]:''});});});
    return montarJogos(recs,opts,avisos,'colunas',recs.some(r=>r.sit==='T'||r.sit==='R'));
  }
  return {erro:'Não reconheci o formato. Use colunas "Data", "Atleta" e "Minutos" (uma linha por atleta por jogo), ou "Atleta" seguido de uma coluna por data. Baixe o modelo para ver o formato.'};
}
function montarJogos(recs,opts,avisos,formato,temSit){
  const grupos=new Map();
  recs.forEach(r=>{const pc=parseCat(r.cat);const cat=pc.cat||opts.categoria;r._sub=pc.sub||'';const k=`${cat}|${r.data}|${nrm(r.adv)}|${nrm(r.jogo||'')}`;if(!grupos.has(k))grupos.set(k,{cat,data:r.data,adv:r.adv,linhas:[]});grupos.get(k).linhas.push(r);});
  const novosAt=new Map();const jogos=[];let inferidos=0,somados=0;
  for(const [k,gp] of grupos){
    const first=x=>gp.linhas.map(l=>l[x]).find(v=>v!==''&&v!=null);
    const rel=[],motivos={},porAt=new Map();
    gp.linhas.forEach(l=>{let a=findAtleta(l.nome,gp.cat);
      if(!a){const key=gp.cat+'|'+nrm(l.nome);if(!novosAt.has(key)){const pp=parsePos(l.pos);novosAt.set(key,{id:'at_'+uid(),nome:l.nome,apelido:'',numero:'',nascimento:'',categoria:gp.cat,subcategoria:l._sub||'',posicao:pp.p||opts.posicao,posDetalhe:pp.d||'',pe:'',altura:'',peso:'',gordura:'',foto:'',_semPos:!pp.p});}a=novosAt.get(key);}
      const cur=porAt.get(a.id);
      if(!cur){porAt.set(a.id,{a,linhas:[l]});}else{cur.linhas.push(l);somados++;}});
    for(const {a,linhas} of porAt.values()){
      const sits=linhas.map(l=>l.sit);const algumMin=linhas.some(l=>!l.minVazio);
      let st=sits.includes('T')?'T':sits.includes('R')?'R':sits.includes('NR')?'NR':'';
      const sum=f=>linhas.reduce((t,l)=>t+(+l[f]||0),0);const mn=Math.max(0,Math.round(sum('min')));
      if(st==='NR'&&mn>0)st='';                        // jogou: não pode ser não relacionado
      if(st==='NR'){const mo=linhas.map(l=>l.motivo).find(Boolean);if(mo)motivos[a.id]=mo;continue;}
      if(!st&&!algumMin&&formato==='linhas')continue;  // sem minutos e sem situação = não relacionado
      rel.push({atletaId:a.id,status:st,min:mn,gols:sum('gols'),gs:sum('gs'),assist:sum('assist'),ca:Math.min(2,sum('ca')),cv:Math.min(1,sum('cv'))});}
    if(rel.some(r=>!r.status)){inferidos++;const sem=rel.filter(r=>!r.status).sort((a,b)=>b.min-a.min);let nT=rel.filter(r=>r.status==='T').length;sem.forEach(r=>{if(nT<11&&r.min>0){r.status='T';nT++;}else r.status='R';});}
    const advNome=gp.adv||first('jogo')||('Jogo '+fmtData(gp.data));
    const id='imp_'+nrm(gp.cat)+'_'+gp.data.replace(/-/g,'')+'_'+(nrm(advNome).slice(0,24)||'x');
    const ex=S.jogos.find(j=>j.id===id)||S.jogos.find(j=>j.categoria===gp.cat&&j.data===gp.data&&nrm(j.adversario)===nrm(advNome));
    const gpv=first('gp'),gcv=first('gc');
    jogos.push({ex,jogo:{id:ex?ex.id:id,categoria:gp.cat,competicao:first('comp')||opts.competicao,data:gp.data,hora:first('hora')||'',local:first('local')||'',mando:first('mando')||'casa',adversario:advNome,atividade:first('ativ')||'',
      logoAdv:ex?.logoAdv||'',golsPro:gpv??(ex?ex.golsPro:''),golsContra:gcv??(ex?ex.golsContra:''),resultado:first('res')||'',duracao:first('dur')||'',formacao:ex?.formacao||'4-2-3-1',relacionados:rel,escalacao:[],motivos,obs:'',origem:'planilha'}});
  }
  if(somados)avisos.push(`${somados} linha(s) repetidas do mesmo atleta no mesmo jogo (ex.: 1º e 2º tempo) foram somadas.`);
  jogos.sort((a,b)=>a.jogo.data.localeCompare(b.jogo.data));
  if(inferidos&&!temSit)avisos.unshift(`A planilha não tem coluna "Situação": em ${inferidos} jogo(s) considerei titulares os 11 com mais minutos e os demais como reservas. Inclua a coluna Situação (Titular/Reserva/Não relacionado) para ficar exato.`);
  return {jogos,novos:[...novosAt.values()],avisos,formato,registros:recs.length};
}
/* ---------- tela de importação ---------- */
function viewImportar(){
  const card=(k,t,desc,cols,req)=>`<div class="panel imp-card"><div class="ph">${t}</div><div class="pb"><p>${desc}</p>
    <div class="cols">${cols.map(c=>`<code class="${req.includes(c)?'req':''}">${c}</code>`).join('')}</div>
    <label class="drop" data-drop="${k}"><b>Selecionar planilha</b><span class="muted">Excel (.xlsx, .xls) ou CSV — clique ou arraste o arquivo aqui</span><input type="file" accept=".xlsx,.xls,.csv,.ods" data-imp="${k}" hidden></label>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn sm" data-act="modelo" data-k="${k}">${IC.down} Baixar modelo</button><button class="btn sm" data-act="${k==='atl'?'expAtletas':'expMinutagem'}">${IC.down} Exportar dados atuais</button></div></div></div>`;
  return `<div class="page-h"><h2>Importar planilhas</h2><span class="muted">Os nomes das colunas podem variar; o sistema reconhece os mais comuns. Colunas em verde são obrigatórias.</span></div>
  ${!S.canWrite?'<div class="warn">Você não tem permissão de edição neste sistema.</div>':''}
  <div class="imp-grid">
  ${card('atl','Atletas','Cadastra ou atualiza o elenco. Atletas com o mesmo nome na mesma categoria são atualizados, não duplicados.',['Nome','Data de nascimento','Categoria (Sub-16, Sub-17…)','Posição','Posição detalhada','Pé','Estatura','Peso','% Gordura','Camisa','Apelido'],['Nome'])}
  ${card('min','Minutagem','Cada data (e adversário, se houver) vira um jogo automaticamente. Reimportar o mesmo jogo substitui a minutagem dele.',['Data','Mês','Atleta','Periodo','Competição','Atividade','Posição','Minutagem','Adversário','Jogo','GOLS','GOL SOFRIDO','ASS','CA','CV','Situação','Casa/Fora','Resultado','Status','Tempo/Jogo','JG'],['Data','Atleta','Minutagem'])}
  </div>
  <div class="imp-grid" style="margin-top:16px">
   <div class="panel imp-card"><div class="ph">Fotos dos atletas</div><div class="pb"><p>Selecione várias imagens (PNG) de uma vez. O nome de cada arquivo identifica o atleta: <code>Pedro Henrique.png</code>, <code>pedro_henrique_souza.png</code> ou só o primeiro nome, se for único.</p>
    <label class="drop"><b>Selecionar fotos</b><span class="muted">PNG, JPG ou WebP · várias de uma vez</span><input type="file" id="fotosLote" accept="image/png,image/jpeg,image/webp" multiple hidden></label></div></div>
   <div class="panel imp-card"><div class="ph">Relatório do jogo (PDF)</div><div class="pb"><p>Envie o PDF do jogo: placar, data, horário, local, minutagem, gols, assistências, cartões e substituições são lidos automaticamente, e o arquivo fica guardado no jogo.</p>
    <label class="drop"><b>Selecionar PDF</b><span class="muted">Categoria atual: ${esc(S.filtro.categoria!=='Todas'?S.filtro.categoria:'Sub-17')}</span><input type="file" id="pdfJogo" accept="application/pdf,.pdf" hidden></label></div></div>
  </div>
  <div class="panel" style="margin-top:16px"><div class="ph">Formatos aceitos na minutagem</div><div class="pb" style="font-size:14px;line-height:1.55">
   <p style="margin-top:0"><b>1. Uma linha por atleta por jogo</b> (recomendado): colunas Data, Atleta, Minutos e, se possível, Situação (Titular, Reserva, Não relacionado). Reserva com 0 minuto = ficou no banco.</p>
   <p><b>2. Tabela de minutagem</b>: primeira coluna Atleta e uma coluna para cada jogo com a data no cabeçalho (ex.: <code>15/03</code> ou <code>15/03 Rio Branco</code>). Nas células, os minutos; use <code>T90</code>, <code>R20</code> ou <code>NR</code> para indicar a situação. Célula vazia = não relacionado.</p>
   <p style="margin-bottom:0">Atletas da planilha que ainda não existem no cadastro podem ser criados automaticamente na importação.</p></div></div>`;
}
function bindImportar(){
  document.querySelectorAll('[data-imp]').forEach(inp=>inp.onchange=()=>{const f=inp.files[0];if(f)abrirImport(inp.dataset.imp,f);inp.value='';});
  document.querySelectorAll('[data-drop]').forEach(d=>{d.ondragover=e=>{e.preventDefault();d.classList.add('over');};d.ondragleave=()=>d.classList.remove('over');d.ondrop=e=>{e.preventDefault();d.classList.remove('over');const f=e.dataTransfer.files[0];if(f)abrirImport(d.dataset.drop,f);};});
}
async function abrirImport(tipo,file){
  if(!S.canWrite){toast('Sem permissão de edição.');return;}
  progress('Lendo planilha…',.3);let sheets;
  try{sheets=await lerPlanilha(file);}catch(e){progressEnd();toast('Não consegui ler o arquivo. Salve como .xlsx e tente de novo.');return;}
  progressEnd();if(!sheets.length){toast('A planilha está vazia.');return;}
  IMP={tipo,file:file.name,sheets,sheet:0,opts:{categoria:S.filtro.categoria!=='Todas'?S.filtro.categoria:'Sub-17',competicao:S.filtro.competicao!=='Todas'?S.filtro.competicao:S.config.competicoes[0],ano:S.filtro.ano!=='Todos'?S.filtro.ano:String(new Date().getFullYear()),posicao:'MEI',criar:true}};
  renderImport();
}
function renderImport(){
  const I=IMP,sh=I.sheets[I.sheet];const R=I.tipo==='atl'?parseAtletas(sh,I.opts):parseMinutagem(sh,I.opts);I.res=R;
  const opts=(arr,v)=>arr.map(x=>`<option ${x===v?'selected':''}>${esc(x)}</option>`).join('');
  const top=`<div class="form" style="margin-bottom:12px">
   ${I.sheets.length>1?`<div class="f"><label for="iSheet">Aba da planilha</label><select id="iSheet">${I.sheets.map((s,i)=>`<option value="${i}" ${i===I.sheet?'selected':''}>${esc(s.nome)}</option>`).join('')}</select></div>`:''}
   <div class="f"><label for="iCat">Categoria (se a planilha não tiver)</label><select id="iCat">${opts(Object.keys(GRUPOS),I.opts.categoria)}</select></div>
   ${I.tipo==='min'?`<div class="f"><label for="iComp">Competição (se não houver coluna)</label><select id="iComp">${opts(S.config.competicoes,I.opts.competicao)}</select></div><div class="f"><label for="iAno">Ano (datas sem ano)</label><input id="iAno" type="number" value="${esc(I.opts.ano)}"></div>`:''}
   <div class="f"><label for="iPos">Posição quando não informada</label><select id="iPos">${POS.map(p=>`<option value="${p}" ${p===I.opts.posicao?'selected':''}>${POSN[p]}</option>`).join('')}</select></div></div>`;
  let body='',n=0;
  if(R.erro)body=`<div class="warn">${esc(R.erro)}</div>`;
  else if(I.tipo==='atl'){const novos=R.lista.filter(x=>!x.ex).length;n=R.lista.length;
    body=`<div class="okmsg">${R.lista.length} atletas encontrados: <b>${novos} novos</b> e <b>${R.lista.length-novos} para atualizar</b>.</div>${R.avisos.slice(0,6).map(a=>`<div class="warn">${esc(a)}</div>`).join('')}${R.avisos.length>6?`<div class="warn">+ ${R.avisos.length-6} avisos semelhantes.</div>`:''}
    <div class="tbl-wrap" style="max-height:360px;overflow:auto"><table class="t"><thead><tr><th></th><th>Nome</th><th>Categoria</th><th>Posição</th><th>Pé</th><th>Nascimento</th><th>Idade</th><th>Estatura</th><th>Peso</th><th>% G</th></tr></thead><tbody>
    ${R.lista.map(x=>{const d=x.dados;return `<tr><td><span class="st-badge ${x.ex?'st-R':'st-T'}" style="width:70px">${x.ex?'Atualizar':'Novo'}</span></td><td class="l">${esc(d.nome)}</td><td>${esc(d.categoria)}${d.subcategoria?' <span class="subtag">'+esc(d.subcategoria)+'</span>':''}</td><td><span class="ptag" style="background:${PC2[d.posicao]}">${d.posicao}</span> ${esc(d.posDetalhe)}</td><td>${esc(d.pe||'—')}</td><td>${d.nascimento?fmtData(d.nascimento):'—'}</td><td>${d.nascimento?idade(d.nascimento):'—'}</td><td>${d.altura?nf(d.altura,2):'—'}</td><td>${d.peso||'—'}</td><td>${d.gordura!==''?d.gordura:'—'}</td></tr>`;}).join('')}</tbody></table></div>`;}
  else{n=R.jogos.length;const subs=R.jogos.filter(x=>x.ex).length;
    body=`<div class="okmsg">${R.registros} registros lidos (formato em ${R.formato}) → <b>${R.jogos.length} jogos</b>${subs?`, sendo ${subs} já existentes que serão substituídos`:''}.</div>
    ${R.avisos.slice(0,6).map(a=>`<div class="warn">${esc(a)}</div>`).join('')}${R.avisos.length>6?`<div class="warn">+ ${R.avisos.length-6} avisos semelhantes.</div>`:''}
    ${R.novos.length?`<div class="warn"><label style="display:flex;gap:8px;align-items:flex-start;cursor:pointer"><input type="checkbox" id="iCriar" ${I.opts.criar?'checked':''}><span><b>${R.novos.length} atleta(s) não estão cadastrados</b> e serão criados${R.novos.some(a=>a._semPos)?` (sem posição na planilha → ${POSN[I.opts.posicao]}, ajuste depois em Atletas)`:''}: ${esc(R.novos.slice(0,12).map(a=>a.nome).join(', '))}${R.novos.length>12?'…':''}. Desmarque para ignorar esses atletas.</span></label></div>`:''}
    <div class="tbl-wrap" style="max-height:340px;overflow:auto"><table class="t"><thead><tr><th></th><th>Data</th><th>Adversário</th><th>Competição</th><th>Categoria</th><th>Placar</th><th>Relac.</th><th>Titulares</th><th>Reservas</th><th>Minutos</th></tr></thead><tbody>
    ${R.jogos.map(x=>{const j=x.jogo;const t=j.relacionados.filter(r=>r.status==='T').length;return `<tr><td><span class="st-badge ${x.ex?'st-R':'st-T'}" style="width:76px">${x.ex?'Substituir':'Novo'}</span></td><td>${fmtData(j.data)}</td><td class="l">${esc(j.adversario)}</td><td>${esc(j.competicao)}</td><td>${esc(j.categoria)}</td><td>${j.golsPro!==''&&j.golsPro!=null?j.golsPro+' x '+j.golsContra:(j.resultado||'—')}</td><td>${j.relacionados.length}</td><td style="${t>11?'color:var(--red);font-weight:700':''}">${t}</td><td>${j.relacionados.length-t}</td><td>${nf(j.relacionados.reduce((s,r)=>s+r.min,0))}</td></tr>`;}).join('')}</tbody></table></div>`;}
  openModal(`<div class="modal xl"><div class="mh"><h3>Importar ${I.tipo==='atl'?'atletas':'minutagem'} · ${esc(I.file)}</h3><button class="icon-btn" data-close aria-label="Fechar">${IC.x}</button></div><div class="mb">${top}${body}</div>
   <div class="mf"><span class="msg">Confira a prévia antes de importar.</span><button class="btn" data-close>Cancelar</button><button class="btn pri" id="iGo" ${n?'':'disabled'}>Importar ${n} ${I.tipo==='atl'?'atletas':'jogos'}</button></div></div>`);
  const on=(id,k,f=v=>v)=>{const e=$('#'+id);if(e)e.onchange=()=>{I.opts[k]=f(e.value);renderImport();};};
  on('iCat','categoria');on('iComp','competicao');on('iAno','ano');on('iPos','posicao');
  const sh2=$('#iSheet');if(sh2)sh2.onchange=()=>{I.sheet=+sh2.value;renderImport();};
  const cr=$('#iCriar');if(cr)cr.onchange=()=>{I.opts.criar=cr.checked;};
  $('#iGo').onclick=confirmarImport;
}
async function putMany(col,arr){
  arr.forEach(o=>{const c=JSON.parse(JSON.stringify(o));const i=S[col].findIndex(x=>x.id===c.id);if(i>=0)S[col][i]=c;else S[col].push(c);});
  Store.saveLocal();
  if(Store.db){for(let i=0;i<arr.length;i+=20){await Promise.all(arr.slice(i,i+20).map(o=>{const {id,...b}=JSON.parse(JSON.stringify(o));return Store.db.collection(col).doc(id).set(b);}));progress(`Salvando… ${Math.min(arr.length,i+20)} de ${arr.length}`,Math.min(1,(i+20)/arr.length));}}
}
async function confirmarImport(){
  const I=IMP,R=I.res;$('#iGo').disabled=true;
  try{
    if(I.tipo==='atl'){
      const arr=R.lista.map(x=>{if(x.ex){const o={...x.ex};for(const k in x.dados){const v=x.dados[k];if(v!==''&&v!=null)o[k]=v;}return o;}return {id:'at_'+uid(),foto:'',...x.dados};});
      progress('Salvando atletas…',.1);await putMany('atletas',arr);progressEnd();closeModal();
      const cats=[...new Set(arr.map(a=>a.categoria))].filter(c=>!S.config.categorias.includes(c));if(cats.length){S.config.categorias=[...S.config.categorias,...cats];await Store.putConfig();}
      toast(`${arr.length} atletas importados`);go('atletas');
    }else{
      const ids=new Set(S.atletas.map(a=>a.id));const criar=I.opts.criar;
      const novos=criar?R.novos.map(a=>{const {_semPos,...o}=a;return o;}):[];
      const novoIds=new Set(R.novos.map(a=>a.id));
      progress('Salvando atletas…',.05);if(novos.length)await putMany('atletas',novos);
      const jogos=R.jogos.map(x=>{const j={...x.jogo};j.relacionados=j.relacionados.filter(r=>ids.has(r.atletaId)||(criar&&novoIds.has(r.atletaId)));j.motivos=Object.fromEntries(Object.entries(j.motivos).filter(([k])=>ids.has(k)||(criar&&novoIds.has(k))));j.escalacao=computeEsc(j.formacao,j.relacionados);return j;});
      progress('Salvando jogos…',.1);await putMany('jogos',jogos);progressEnd();
      const cats=[...new Set(jogos.map(j=>j.categoria))].filter(c=>!S.config.categorias.includes(c)),comps=[...new Set(jogos.map(j=>j.competicao))].filter(c=>!S.config.competicoes.includes(c));
      if(cats.length||comps.length){S.config.categorias=[...S.config.categorias,...cats];S.config.competicoes=[...S.config.competicoes,...comps];await Store.putConfig();}
      closeModal();toast(`${jogos.length} jogos importados`);
      S.filtro.categoria=jogos[0]?.categoria||S.filtro.categoria;S.filtro.competicao='Todas';S.filtro.ano='Todos';go('dashboard');
    }
  }catch(e){progressEnd();console.error(e);Store.err(e);const b=$('#iGo');if(b)b.disabled=false;}
}
/* ---------- exportações e modelos ---------- */
async function xlsxSave(nome,sheets){
  try{await loadLib('xlsx');}catch(e){toast('Não foi possível carregar o gerador de Excel.');return;}
  const wb=XLSX.utils.book_new();sheets.forEach(([n,aoa,w])=>{const ws=XLSX.utils.aoa_to_sheet(aoa);ws['!cols']=(w||aoa[0].map(()=>14)).map(x=>({wch:x}));XLSX.utils.book_append_sheet(wb,ws,n);});
  const buf=XLSX.write(wb,{bookType:'xlsx',type:'array'});await saveFile(nome,new Blob([buf]));
}
const ATL_H=['Nome','Apelido','Camisa','Data de nascimento','Categoria','Posição','Posição detalhada','Pé','Estatura (m)','Peso (kg)','% Gordura'];
const MIN_H=['Data','Mês','Atleta','Periodo','Competição','Atividade','Posição','Minutagem','Adversário','Jogo','GOLS','GOL SOFRIDO','ASS','CA','CV','Situação','Casa/Fora','Resultado','Status','Tempo/Jogo','JG'];
const MESNOME=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
function exportarAtletas(){const c=S.filtro.categoria;const l=S.atletas.filter(a=>c==='Todas'||a.categoria===c).sort((a,b)=>POS.indexOf(a.posicao)-POS.indexOf(b.posicao)||a.nome.localeCompare(b.nome));
  xlsxSave(`Atletas-${c.replace(/\s/g,'')}.xlsx`,[['Atletas',[ATL_H,...l.map(a=>[a.nome,a.apelido||'',a.numero||'',a.nascimento?fmtData(a.nascimento):'',a.categoria,POSN[a.posicao],a.posDetalhe||'',a.pe||'',a.altura||'',a.peso||'',a.gordura||''])],[28,14,8,16,10,14,18,11,12,10,10]]]);}
function exportarMinutagem(){const jogos=jogosFiltrados();const rows=[MIN_H];
  jogos.forEach(j=>{const ats=S.atletas.filter(a=>a.categoria===j.categoria);const rel={};(j.relacionados||[]).forEach(r=>rel[r.atletaId]=r);
    ats.sort((a,b)=>POS.indexOf(a.posicao)-POS.indexOf(b.posicao)||a.nome.localeCompare(b.nome)).forEach(a=>{const r=rel[a.id];
      const pl=j.golsPro!==''&&j.golsPro!=null?`${j.golsPro}x${j.golsContra}`:(j.resultado||'');
      rows.push([fmtData(j.data),MESNOME[+j.data.slice(5,7)-1],a.nome,'',j.competicao,j.atividade||'Jogo',POSN[a.posicao],r?+r.min||0:0,j.adversario,`Porto Vitória x ${j.adversario}`,r?+r.gols||0:0,r?+r.gs||0:0,r?+r.assist||0:0,r?+r.ca||0:0,r?+r.cv||0:0,r?(r.status==='T'?'Titular':'Reserva'):'Não relacionado',j.mando==='fora'?'Fora':'Casa',pl,r?(+r.min>0?'Jogou':'Banco'):((j.motivos||{})[a.id]||'Não relacionado'),dur(j),r&&+r.min>0?1:0]);});});
  if(rows.length===1){toast('Não há jogos no filtro atual.');return;}
  xlsxSave(`Minutagem-${S.filtro.categoria.replace(/\s/g,'')}.xlsx`,[['Minutagem',rows,[11,10,24,9,14,10,14,11,20,28,7,12,6,5,5,15,9,10,14,11,5]]]);}
function baixarModelo(k){
  if(k==='atl')xlsxSave('Modelo-Atletas.xlsx',[['Atletas',[ATL_H,['Pedro Henrique Souza','Pedro H.',5,'14/03/2008','Sub-17','Volante','Primeiro Volante','Direito',1.78,68.5,9.8],['Enzo Martins Lima','Enzo',6,'02/07/2008','Sub-17','Lateral','Lateral Esquerdo','Esquerdo',1.72,63,10.4]],[28,14,8,16,10,14,18,11,12,10,10]]]);
  else xlsxSave('Modelo-Minutagem.xlsx',[['Minutagem',[MIN_H,
    ['15/03/2026','Março','Pedro Henrique Souza','','Estadual','Jogo','Volante',90,'Rio Branco','Porto Vitória x Rio Branco',1,0,0,0,0,'Titular','Casa','2x1','Jogou',90,1],
    ['15/03/2026','Março','Enzo Martins Lima','','Estadual','Jogo','Lateral',25,'Rio Branco','Porto Vitória x Rio Branco',0,0,1,1,0,'Reserva','Casa','2x1','Jogou',90,1],
    ['15/03/2026','Março','Lucas Andrade','','Estadual','Jogo','Goleiro',90,'Rio Branco','Porto Vitória x Rio Branco',0,1,0,0,0,'Titular','Casa','2x1','Jogou',90,1],
    ['15/03/2026','Março','Caio Lima','','Estadual','Jogo','Atacante',0,'Rio Branco','Porto Vitória x Rio Branco',0,0,0,0,0,'Não relacionado','Casa','2x1','Lesão',90,0]],
    [11,10,24,9,14,10,14,11,20,28,7,12,6,5,5,15,9,10,14,11,5]]]);
}

;

"use strict";
/* ================= DETALHES DO JOGO ================= */
function substituicoes(j){
  const d=dur(j);const rel=(j.relacionados||[]).map(r=>({...r,a:S.atletas.find(a=>a.id===r.atletaId)})).filter(r=>r.a);
  const outs=rel.filter(r=>r.status==='T'&&(+r.min||0)<d).map(r=>({a:r.a,m:+r.min||0}));
  const ins=rel.filter(r=>r.status==='R'&&(+r.min||0)>0).map(r=>({a:r.a,m:Math.max(0,d-(+r.min||0))}));
  outs.sort((x,y)=>x.m-y.m);ins.sort((x,y)=>x.m-y.m);
  const pares=[],usados=new Set();
  ins.forEach(i=>{let best=-1,bd=99;outs.forEach((o,k)=>{if(usados.has(k))return;const df=Math.abs(o.m-i.m);if(df<bd){bd=df;best=k;}});
    if(best>=0&&bd<=3){usados.add(best);pares.push({m:i.m,entra:i.a,sai:outs[best].a});}else pares.push({m:i.m,entra:i.a,sai:null});});
  outs.forEach((o,k)=>{if(!usados.has(k))pares.push({m:o.m,entra:null,sai:o.a});});
  return pares.sort((x,y)=>x.m-y.m);
}
function modalDetalheJogo(id){
  const j=S.jogos.find(x=>x.id===id);if(!j)return;const d=dur(j);
  const rel=(j.relacionados||[]).map(r=>({...r,a:S.atletas.find(a=>a.id===r.atletaId)})).filter(r=>r.a);
  const byA={};rel.forEach(r=>byA[r.a.id]=r);
  const casa=j.mando!=='fora';const adv={n:j.adversario,l:j.logoAdv||shieldSVG(j.adversario)},pv={n:'Porto Vitória',l:LOGO};
  const A=casa?pv:adv,B=casa?adv:pv;const gA=casa?j.golsPro:j.golsContra,gB=casa?j.golsContra:j.golsPro;const x=resultado(j);
  const subs=substituicoes(j);const saiu={};subs.forEach(s=>{if(s.sai)saiu[s.sai.id]=s.m;});
  const nome=a=>esc(a.apelido||a.nome);
  const badges=a=>{const r=byA[a.id];if(!r)return '';const b=[];
    if(+r.gols)b.push(`⚽${+r.gols>1?r.gols:''}`);if(+r.assist)b.push(`<span class="ico-boot">${IC.boot}${+r.assist>1?r.assist:''}</span>`);
    if(+r.ca)b.push('<i style="background:#f6c21c"></i>'.repeat(Math.min(2,+r.ca)));if(+r.cv)b.push('<i style="background:#e3342b"></i>');
    if(saiu[a.id]!=null)b.push(`<span class="sub-out">▼${saiu[a.id]}'</span>`);
    return b.length?`<span class="tok-badges">${b.join(' ')}</span>`:'';};
  const lista=(arr,fn,vazio)=>arr.length?`<div class="det-list">${arr.map(fn).join('')}</div>`:`<div class="muted" style="font-size:13px">${vazio}</div>`;
  const gols=rel.filter(r=>+r.gols>0).sort((a,b)=>b.gols-a.gols),ass=rel.filter(r=>+r.assist>0).sort((a,b)=>b.assist-a.assist);
  const cart=rel.filter(r=>+r.ca>0||+r.cv>0);
  const banco=rel.filter(r=>r.status==='R'&&!(+r.min>0));
  const relIds=new Set(rel.map(r=>r.a.id));const nr=S.atletas.filter(a=>a.categoria===j.categoria&&!relIds.has(a.id));
  const gs=rel.filter(r=>+r.gs>0);
  const semEsc=!(j.escalacao||[]).some(Boolean);const jj=semEsc?{...j,escalacao:computeEsc(j.formacao,j.relacionados||[])}:j;
  openModal(`<div class="modal xl"><div class="mh"><h3>Detalhes do jogo</h3><button class="icon-btn" data-close aria-label="Fechar">${IC.x}</button></div><div class="mb">
   <div class="det-head"><div class="tm"><img src="${A.l}" alt="">${esc(A.n)}</div><div style="text-align:center"><div class="pl">${gA??'-'} <span style="font-size:26px">x</span> ${gB??'-'}</div>
     <span class="res ${x}" style="display:inline-grid;width:auto;padding:0 10px">${({V:'VITÓRIA',E:'EMPATE',D:'DERROTA',N:'SEM PLACAR'})[x]}</span></div><div class="tm"><img src="${B.l}" alt="">${esc(B.n)}</div></div>
   <div class="muted" style="text-align:center;margin:-6px 0 14px;font-size:13.5px">${fmtData(j.data)}${j.hora?' · '+esc(j.hora):''} · ${esc(j.competicao)} · ${esc(j.categoria)}${j.local?' · '+esc(j.local):''} · ${j.mando==='fora'?'Fora':'Casa'} · ${d} min</div>
   <div class="det-grid">
    <div><div class="det-sec"><h4>${IC.kShirt.replace('<svg','<svg width="18" height="18"')} Escalação inicial (${esc(j.formacao||'4-2-3-1')})</h4><div style="background:#0f3d22;padding:2px;border-radius:6px">${pitch(jj,false,-1,badges)}</div>
     ${semEsc?'<div class="muted" style="font-size:12px;margin-top:4px">Posições sugeridas automaticamente — ajuste em Editar → Escalação.</div>':''}</div></div>
    <div>
     <div class="det-sec"><h4>⚽ Gols (${gols.reduce((t,r)=>t+(+r.gols),0)}${j.golsPro!==''&&j.golsPro!=null&&+j.golsPro!==gols.reduce((t,r)=>t+(+r.gols),0)?` de ${j.golsPro}`:''})</h4>${lista(gols,r=>`<div><b>${r.gols}×</b>${nome(r.a)} <span class="ptag" style="background:${PC2[r.a.posicao]};min-width:0;font-size:11px">${r.a.posicao}</span></div>`,'Nenhum gol registrado.')}</div>
     <div class="det-sec"><h4><span class="ico-boot">${IC.boot}</span> Assistências</h4>${lista(ass,r=>`<div><b>${r.assist}×</b>${nome(r.a)}</div>`,'Nenhuma assistência registrada.')}</div>
     <div class="det-sec"><h4>🔄 Substituições</h4>${lista(subs,s=>`<div><span class="min">${s.m}'</span>${s.entra?`<span class="sub-in">▲</span> ${nome(s.entra)}`:''}${s.entra&&s.sai?' <span class="muted">por</span> ':''}${s.sai?`<span class="sub-out">▼</span> ${nome(s.sai)}`:''}</div>`,'Sem substituições — titulares jogaram os '+d+' minutos.')}
       <div class="muted" style="font-size:12px;margin-top:4px">Minuto calculado pela minutagem: quem saiu jogou até o minuto indicado; quem entrou jogou o restante.</div></div>
     <div class="det-sec"><h4><i style="display:inline-block;width:11px;height:15px;background:#f6c21c;border-radius:2px"></i> Cartões</h4>${lista(cart,r=>`<div>${'<i style="display:inline-block;width:11px;height:15px;background:#f6c21c;border-radius:2px"></i>'.repeat(Math.min(2,+r.ca||0))}${+r.cv?'<i style="display:inline-block;width:11px;height:15px;background:#e3342b;border-radius:2px"></i>':''} ${nome(r.a)}</div>`,'Nenhum cartão.')}</div>
     ${gs.length?`<div class="det-sec"><h4>🧤 Gols sofridos (goleiro)</h4>${lista(gs,r=>`<div><b>${r.gs}</b>${nome(r.a)}</div>`,'')}</div>`:''}
     <div class="det-sec"><h4>Banco sem entrar (${banco.length})</h4><div class="muted" style="font-size:13.5px">${banco.length?banco.map(r=>nome(r.a)).join(', '):'Todos os reservas entraram.'}</div></div>
     <div class="det-sec"><h4>Não relacionados (${nr.length})</h4><div class="muted" style="font-size:13.5px">${nr.length?nr.map(a=>nome(a)+((j.motivos||{})[a.id]&&(j.motivos||{})[a.id]!=='Opção técnica'?` (${esc(j.motivos[a.id])})`:'')).join(', '):'—'}</div></div>
    </div></div></div>
   <div class="mf">${j.arquivo?`<button class="btn" data-act="verPdf" data-id="${j.id}" data-closefirst="1">📄 Relatório do jogo (PDF)</button>`:''}<button class="btn" data-act="pdfJogoDet" data-id="${j.id}" data-closefirst="1">${IC.down} PDF do jogo</button><button class="btn" data-act="verJogo" data-id="${j.id}" data-closefirst="1">${IC.clock} Ver minutagem do jogo</button>${S.canWrite?`<button class="btn" data-act="editJogo" data-id="${j.id}" data-closefirst="1">${IC.edit} Editar jogo</button>`:''}<button class="btn pri" data-close>Fechar</button></div></div>`);
}

;

"use strict";
/* ================= CORRESPONDÊNCIA DE NOMES ================= */
const STOP=new Set(['de','da','do','das','dos','e','jr','junior','filho','neto']);
const toks=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ').split(/\s+/).filter(t=>t&&!STOP.has(t)&&!/^\d+$/.test(t));
function fuzzyAtleta(nome,pool){
  const t=toks(nome);if(!t.length)return null;const key=t.join(' ');
  let c=pool.filter(a=>toks(a.nome).join(' ')===key||toks(a.apelido).join(' ')===key);if(c.length===1)return c[0];
  // todos os termos do arquivo estão no nome do atleta (ex.: "pedro henrique" em "Pedro Henrique Souza")
  c=pool.filter(a=>{const n=toks(a.nome).concat(toks(a.apelido));return t.every(x=>n.includes(x));});if(c.length===1)return c[0];
  // primeiro + último nome
  if(t.length>=2){c=pool.filter(a=>{const n=toks(a.nome);return n[0]===t[0]&&n[n.length-1]===t[t.length-1];});if(c.length===1)return c[0];}
  // todos os termos do atleta estão no arquivo (ex.: arquivo com nome completo, cadastro só com nome e sobrenome)
  c=pool.filter(a=>{const n=toks(a.nome);return n.length&&n.every(x=>t.includes(x));});if(c.length===1)return c[0];
  // só o primeiro nome, se for único
  if(t.length===1){c=pool.filter(a=>toks(a.nome)[0]===t[0]||toks(a.apelido)[0]===t[0]);if(c.length===1)return c[0];}
  return null;
}

/* ================= FOTOS EM LOTE ================= */
let FOT=null;
function abrirFotos(files){
  if(!S.canWrite){toast('Sem permissão de edição.');return;}
  const lista=[...files].filter(f=>/^image\//.test(f.type)||/\.(png|jpe?g|webp)$/i.test(f.name));
  if(!lista.length){toast('Selecione imagens PNG ou JPG.');return;}
  const pool=atletasCat().length?atletasCat():S.atletas;
  FOT=lista.map(f=>{const base=f.name.replace(/\.[^.]+$/,'').replace(/[_\-.]+/g,' ');const a=fuzzyAtleta(base,pool)||fuzzyAtleta(base,S.atletas);return {f,base,aid:a?a.id:'',url:URL.createObjectURL(f)};});
  renderFotos();
}
function renderFotos(){
  const ats=S.atletas.slice().sort((a,b)=>a.nome.localeCompare(b.nome));
  const ok=FOT.filter(x=>x.aid).length;
  openModal(`<div class="modal xl"><div class="mh"><h3>Importar fotos dos atletas</h3><button class="icon-btn" data-close aria-label="Fechar">${IC.x}</button></div><div class="mb">
   <div class="${ok===FOT.length?'okmsg':'warn'}">${FOT.length} imagem(ns) · <b>${ok} reconhecida(s)</b> pelo nome do arquivo${ok<FOT.length?` · ${FOT.length-ok} sem atleta: escolha na lista ou deixe em branco para ignorar`:''}.</div>
   <div class="foto-grid">${FOT.map((x,i)=>{const a=S.atletas.find(t=>t.id===x.aid);return `<div class="foto-it ${x.aid?'':'nok'}"><img src="${x.url}" alt=""><div class="fn" title="${esc(x.f.name)}">${esc(x.f.name)}</div>
     <select data-fot="${i}" aria-label="Atleta da foto ${esc(x.f.name)}"><option value="">— ignorar —</option>${ats.map(t=>`<option value="${t.id}" ${t.id===x.aid?'selected':''}>${esc(t.nome)} · ${t.categoria}${t.subcategoria&&t.subcategoria!==t.categoria?' ('+t.subcategoria+')':''}</option>`).join('')}</select>${a&&a.foto?'<div class="muted" style="font-size:11px">substitui a foto atual</div>':''}</div>`;}).join('')}</div>
   <p class="muted" style="font-size:12.5px">Dica: nomeie cada arquivo com o nome do atleta (ex.: <code>Pedro Henrique.png</code>, <code>pedro_henrique_souza.png</code> ou só <code>Kauê.png</code> se o primeiro nome for único).</p></div>
   <div class="mf"><button class="btn" data-close>Cancelar</button><button class="btn pri" id="fotGo" ${ok?'':'disabled'}>Salvar ${ok} foto(s)</button></div></div>`);
  document.querySelectorAll('[data-fot]').forEach(s=>s.onchange=()=>{FOT[+s.dataset.fot].aid=s.value;renderFotos();});
  $('#fotGo').onclick=async()=>{const sel=FOT.filter(x=>x.aid);$('#fotGo').disabled=true;const arr=[];
    try{for(let i=0;i<sel.length;i++){progress(`Preparando foto ${i+1} de ${sel.length}…`,i/sel.length);const a=S.atletas.find(t=>t.id===sel[i].aid);if(!a)continue;arr.push({...a,foto:await prepFoto(sel[i].f)});}
      progress('Salvando…',.9);await putMany('atletas',arr);progressEnd();FOT.forEach(x=>URL.revokeObjectURL(x.url));FOT=null;closeModal();render();toast(`${arr.length} foto(s) salvas`);}
    catch(e){progressEnd();Store.err(e);}};
}

/* ================= PDF: leitura ================= */
const PDFJS={lib:'/libs/pdf.min.js',worker:'/libs/pdf.worker.min.js'};
let _pdfP=null;
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
function loadPdfJs(){if(!_pdfP)_pdfP=(async()=>{await loadScript(PDFJS.worker);await loadScript(PDFJS.lib);window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS.worker;return window.pdfjsLib;})().catch(e=>{_pdfP=null;throw e;});return _pdfP;}
async function abrirPdf(data){const lib=await loadPdfJs();return lib.getDocument({data,isEvalSupported:false}).promise;}
async function textoPdf(doc){
  const out=[];for(let p=1;p<=doc.numPages;p++){const pg=await doc.getPage(p);const tc=await pg.getTextContent();let line='',lastY=null;const lines=[];
    tc.items.forEach(it=>{const y=Math.round(it.transform[5]);if(lastY!==null&&Math.abs(y-lastY)>3){lines.push(line.trim());line='';}line+=(line&&!line.endsWith(' ')?' ':'')+it.str;lastY=y;if(it.hasEOL){lines.push(line.trim());line='';lastY=null;}});
    if(line.trim())lines.push(line.trim());out.push(`--- Página ${p} ---\n`+lines.filter(Boolean).join('\n'));}
  return out.join('\n\n');
}
async function paginasComoImagens(doc,max){const blobs=[];for(let p=1;p<=Math.min(max,doc.numPages);p++){const pg=await doc.getPage(p);const vp=pg.getViewport({scale:1.6});const c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;await pg.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;blobs.push(await new Promise(r=>c.toBlob(r,'image/jpeg',.85)));}return blobs;}

/* ================= RELATÓRIO DO JOGO (PDF) → JOGO ================= */
let RJ=null;
async function importarRelatorioJogo(file){
  if(!S.canWrite){toast('Sem permissão de edição.');return;}
  const cat=S.filtro.categoria!=='Todas'?S.filtro.categoria:'Sub-17';
  progress('Lendo o PDF…',.1);let doc,texto='',buf;
  try{buf=await file.arrayBuffer();doc=await abrirPdf(buf.slice(0));texto=await textoPdf(doc);}catch(e){console.error(e);progressEnd();toast('Não consegui abrir este PDF.');return;}
  const roster=S.atletas.filter(a=>a.categoria===cat);
  let dados=null,via='ia';
  let sample=null;try{sample=window.claude&&await window.claude.use('sample');}catch(e){}
  if(sample){
    const limpo=texto.replace(/[ \t]+/g,' ').slice(0,90000);const poucoTexto=limpo.replace(/--- Página \d+ ---/g,'').trim().length<150;
    let images;if(poucoTexto){try{const lim=await sample.limits();if(lim&&lim.images){progress('PDF escaneado: preparando imagens…',.3);images=await paginasComoImagens(doc,Math.min(lim.images.maxCount||4,4));}}catch(e){}}
    progress('Claude está lendo o relatório do jogo…',.45);
    const prompt=`Você recebe o RELATÓRIO DE UM JOGO de futebol de base do clube PORTO VITÓRIA (nosso time), categoria ${cat}. Extraia os dados do jogo e a participação de cada atleta do Porto Vitória.

ELENCO CADASTRADO (${cat}) — use EXATAMENTE estes nomes no campo "nome" quando o atleta do documento for um deles (o documento pode trazer só o primeiro nome, apelido ou nome e sobrenome):
${roster.map(a=>`- ${a.nome}${a.apelido?' (apelido: '+a.apelido+')':''} · ${POSN[a.posicao]}${a.numero?' · camisa '+a.numero:''}`).join('\n')||'(nenhum cadastrado)'}

REGRAS
- golsPro = gols do Porto Vitória; golsContra = gols do adversário. "mando" = "casa" se o Porto Vitória foi mandante, senão "fora".
- situacao: "T" titular, "R" reserva/banco (mesmo que não tenha entrado), "NR" não relacionado (se o documento listar).
- minutos: minutos jogados. Se o documento não trouxer minutos, calcule pelas substituições: titular que não saiu = duração do jogo; titular que saiu aos X' = X; reserva que entrou aos Y' = duração − Y; reserva que não entrou = 0.
- Inclua TODOS os atletas do Porto Vitória citados (titulares e reservas). Não inclua jogadores do adversário.
- Gols contra a favor do Porto Vitória não contam para nenhum atleta. Use null para o que não estiver no documento. Datas no formato AAAA-MM-DD; horas HH:MM.

Responda SOMENTE com JSON neste formato:
{"data":"2026-03-15","hora":"15:00","local":"Estádio X","adversario":"Rio Branco","mando":"casa","golsPro":2,"golsContra":1,"competicao":"Estadual","duracao":90,"formacao":"4-2-3-1",
"atletas":[{"nome":"Pedro Henrique Souza","nomeNoDocumento":"Pedro","posicao":"Volante","situacao":"T","minutos":90,"gols":1,"assistencias":0,"amarelos":0,"vermelhos":0,"golsSofridos":0,"entrou":null,"saiu":null,"motivo":null}],
"substituicoes":[{"minuto":65,"entrou":"Nome","saiu":"Nome"}],
"observacoes":"resumo curto de outras informações relevantes"}

${poucoTexto?'O texto do PDF veio vazio (documento escaneado): leia as imagens das páginas anexadas.':'TEXTO DO RELATÓRIO:\n'+limpo}`;
    try{dados=await sample.json(prompt,{images,modelTier:'default'});}
    catch(e){console.warn(e);if(e.code==='not_granted'){progressEnd();toast('Leitura com IA não autorizada. Vou ler só o básico do PDF.');}via='basico';}
  }else via='basico';
  if(!dados||typeof dados!=='object'){dados=leituraBasica(texto,roster);via='basico';}
  progressEnd();
  RJ={file,buf,cat,dados,via,linhas:montarLinhasRJ(dados,roster,cat)};
  renderRJ();
}
function leituraBasica(texto,roster){
  const d={atletas:[]};const dt=texto.match(/(\d{1,2})[\/.](\d{1,2})[\/.](\d{2,4})/);if(dt){let y=+dt[3];if(y<100)y+=2000;d.data=`${y}-${pad(dt[2])}-${pad(dt[1])}`;}
  const hr=texto.match(/\b(\d{1,2})[:h](\d{2})\b/);if(hr)d.hora=`${pad(hr[1])}:${hr[2]}`;
  const lc=texto.match(/(?:local|est[aá]dio|campo)\s*[:\-]?\s*([^\n]{3,60})/i);if(lc)d.local=lc[1].trim();
  for(const l of texto.split('\n')){if(/porto/i.test(l)&&/\d+\s*[x×X]\s*\d+/.test(l)){const pj=parseJogo(l);if(pj.adv){d.adversario=pj.adv;d.golsPro=pj.gp;d.golsContra=pj.gc;d.mando=pj.mando;break;}}}
  const tn=' '+toks(texto).join(' ')+' ';
  roster.forEach(a=>{const n=toks(a.nome);if(n.length>=2&&tn.includes(' '+n[0]+' '+n[1]+' '))d.atletas.push({nome:a.nome,situacao:null,minutos:null});});
  return d;
}
function montarLinhasRJ(d,roster,cat){
  const dur0=+d.duracao||S.config.duracao?.[cat]||90;const vistos=new Set();
  return (Array.isArray(d.atletas)?d.atletas:[]).map(x=>{
    const a=fuzzyAtleta(x.nome,roster)||fuzzyAtleta(x.nomeNoDocumento,roster)||fuzzyAtleta(x.nome,S.atletas);
    let st=['T','R','NR'].includes(x.situacao)?x.situacao:(x.entrou!=null?'R':'T');
    let mn=x.minutos!=null&&x.minutos!==''?Math.round(+x.minutos):null;
    if(mn==null){if(st==='T')mn=x.saiu!=null?+x.saiu:dur0;else if(st==='R')mn=x.entrou!=null?Math.max(0,dur0-(+x.entrou)):0;else mn=0;}
    const aid=a&&!vistos.has(a.id)?a.id:'';if(aid)vistos.add(aid);
    return {doc:x.nomeNoDocumento||x.nome||'',nome:x.nome||'',pos:parsePos(x.posicao).p||'',aid:aid||(x.nome?'__novo':''),st,min:Math.max(0,mn||0),g:+x.gols||0,as:+x.assistencias||0,ca:+x.amarelos||0,cv:+x.vermelhos||0,gs:+x.golsSofridos||0,motivo:x.motivo||''};});
}
function renderRJ(){
  const R=RJ,d=R.dados;const opts=(arr,v)=>arr.map(x=>`<option ${x===v?'selected':''}>${esc(x)}</option>`).join('');
  const ats=S.atletas.filter(a=>a.categoria===R.cat).sort((a,b)=>a.nome.localeCompare(b.nome));
  const comps=S.config.competicoes.includes(d.competicao)||!d.competicao?S.config.competicoes:[...S.config.competicoes,d.competicao];
  const subs=Array.isArray(d.substituicoes)?d.substituicoes.filter(s=>s&&(s.entrou||s.saiu)):[];
  const nT=R.linhas.filter(l=>l.aid&&l.st==='T').length;
  openModal(`<div class="modal xl"><div class="mh"><h3>Relatório do jogo · ${esc(R.file.name)}</h3><button class="icon-btn" data-close aria-label="Fechar">${IC.x}</button></div><div class="mb">
   ${R.via==='ia'?'<div class="okmsg">Dados lidos automaticamente do PDF. Confira e corrija o que for preciso antes de salvar.</div>':'<div class="warn">Leitura automática completa indisponível aqui: preenchi só o que deu para identificar no texto. Complete os campos e a minutagem abaixo.</div>'}
   <div class="form" style="margin-bottom:14px">
    <div class="f s2"><label for="rAdv">Adversário</label><input id="rAdv" value="${esc(d.adversario||'')}"></div>
    <div class="f"><label for="rGP">Gols Porto Vitória</label><input id="rGP" type="number" min="0" value="${d.golsPro??''}"></div>
    <div class="f"><label for="rGC">Gols adversário</label><input id="rGC" type="number" min="0" value="${d.golsContra??''}"></div>
    <div class="f"><label for="rData">Data</label><input id="rData" type="date" value="${esc(d.data||'')}"></div>
    <div class="f"><label for="rHora">Horário</label><input id="rHora" type="time" value="${esc(d.hora||'')}"></div>
    <div class="f s2"><label for="rLocal">Local</label><input id="rLocal" value="${esc(d.local||'')}"></div>
    <div class="f"><label for="rMando">Mando</label><select id="rMando"><option value="casa" ${d.mando!=='fora'?'selected':''}>Em casa</option><option value="fora" ${d.mando==='fora'?'selected':''}>Fora</option></select></div>
    <div class="f"><label for="rComp">Competição</label><select id="rComp">${opts(comps,d.competicao||comps[0])}</select></div>
    <div class="f"><label for="rCat">Categoria</label><select id="rCat">${opts(Object.keys(GRUPOS),R.cat)}</select></div>
    <div class="f"><label for="rDur">Duração (min)</label><input id="rDur" type="number" value="${+d.duracao||S.config.duracao?.[R.cat]||90}"></div>
   </div>
   <div class="counters"><span>Atletas no relatório <b>${R.linhas.length}</b></span><span>Titulares <b>${nT}</b></span><span>Novos a cadastrar <b>${R.linhas.filter(l=>l.aid==='__novo').length}</b></span>${d.formacao?`<span>Formação <b>${esc(d.formacao)}</b></span>`:''}</div>
   <div class="tbl-wrap" style="max-height:380px;overflow:auto"><table class="t reltbl"><thead><tr><th>No documento</th><th>Atleta</th><th>Situação</th><th>Min</th><th>Gols</th><th>Assist.</th><th>Amar.</th><th>Verm.</th><th>G. sof.</th></tr></thead><tbody>
   ${R.linhas.map((l,i)=>`<tr class="${l.aid&&l.aid!=='__novo'?l.st:''}"><td class="l">${esc(l.doc)}</td><td><select data-rj="${i}" data-k="aid"><option value="">— ignorar —</option><option value="__novo" ${l.aid==='__novo'?'selected':''}>+ Cadastrar "${esc(l.nome)}"</option>${ats.map(a=>`<option value="${a.id}" ${a.id===l.aid?'selected':''}>${esc(a.nome)}</option>`).join('')}</select></td>
     <td><select data-rj="${i}" data-k="st"><option value="T" ${l.st==='T'?'selected':''}>Titular</option><option value="R" ${l.st==='R'?'selected':''}>Reserva</option><option value="NR" ${l.st==='NR'?'selected':''}>Não relacionado</option></select></td>
     ${['min','g','as','ca','cv','gs'].map(k=>`<td><input type="number" min="0" data-rj="${i}" data-k="${k}" value="${l[k]}"></td>`).join('')}</tr>`).join('')}
   </tbody></table></div>
   ${subs.length?`<div class="det-sec" style="margin-top:12px"><h4>🔄 Substituições no relatório</h4><div class="det-list">${subs.map(s=>`<div><span class="min">${s.minuto??'?'}'</span>${s.entrou?`<span class="sub-in">▲</span> ${esc(s.entrou)}`:''} ${s.saiu?`<span class="muted">por</span> <span class="sub-out">▼</span> ${esc(s.saiu)}`:''}</div>`).join('')}</div></div>`:''}
   ${d.observacoes?`<div class="muted" style="margin-top:10px;font-size:13px"><b>Observações:</b> ${esc(d.observacoes)}</div>`:''}
   <p class="muted" style="font-size:12.5px;margin-bottom:0">Quem é da categoria e não aparece no relatório fica como não relacionado. O PDF fica arquivado no jogo.</p></div>
   <div class="mf"><span class="msg" id="rMsg"></span><button class="btn" data-close>Cancelar</button><button class="btn pri" id="rGo">Salvar jogo</button></div></div>`);
  document.querySelectorAll('[data-rj]').forEach(el=>el.onchange=()=>{const l=R.linhas[+el.dataset.rj],k=el.dataset.k;l[k]=['aid','st'].includes(k)?el.value:(+el.value||0);if(k==='aid'||k==='st')renderRJ();});
  $('#rCat').onchange=()=>{R.cat=$('#rCat').value;R.linhas=montarLinhasRJ(R.dados,S.atletas.filter(a=>a.categoria===R.cat),R.cat);renderRJ();};
  $('#rGo').onclick=salvarRJ;
}
async function salvarRJ(){
  const R=RJ,g=id=>$('#'+id).value;
  const adv=g('rAdv').trim(),data=g('rData');if(!adv||!data){$('#rMsg').textContent='Informe adversário e data.';return;}
  $('#rGo').disabled=true;
  try{
    const cat=g('rCat');const novos=[];
    R.linhas.forEach(l=>{if(l.aid==='__novo'){const a={id:'at_'+uid(),nome:l.nome||l.doc,apelido:'',numero:'',nascimento:'',categoria:cat,subcategoria:'',posicao:l.pos||'MEI',posDetalhe:'',pe:'',altura:'',peso:'',gordura:'',foto:''};novos.push(a);l.aid=a.id;}});
    if(novos.length){progress('Cadastrando atletas novos…',.1);await putMany('atletas',novos);}
    const rel=[],motivos={},seen=new Set();
    R.linhas.forEach(l=>{if(!l.aid||seen.has(l.aid))return;seen.add(l.aid);if(l.st==='NR'){if(l.motivo)motivos[l.aid]=l.motivo;return;}
      rel.push({atletaId:l.aid,status:l.st,min:l.min,gols:l.g,assist:l.as,ca:l.ca,cv:l.cv,gs:l.gs});});
    const ex=S.jogos.find(j=>j.categoria===cat&&j.data===data&&nrm(j.adversario)===nrm(adv));
    let arquivo=ex?.arquivo||null;
    try{const assets=window.claude&&await window.claude.use('assets');if(assets){progress('Arquivando o PDF…',.5);const up=await assets.upload(new Blob([R.buf],{type:'application/pdf'}));arquivo={id:up.id,url:up.url,nome:R.file.name,tamanho:up.sizeBytes,em:new Date().toISOString()};}}catch(e){console.warn('asset',e);toast('Jogo salvo, mas não foi possível arquivar o PDF.');}
    const form=FORMACOES[R.dados.formacao]?R.dados.formacao:(ex?.formacao||'4-2-3-1');
    const j={...(ex||{}),id:ex?ex.id:'pdf_'+uid(),categoria:cat,competicao:g('rComp'),data,hora:g('rHora'),local:g('rLocal').trim(),mando:g('rMando'),adversario:adv,logoAdv:ex?.logoAdv||'',
      golsPro:g('rGP')===''?'':+g('rGP'),golsContra:g('rGC')===''?'':+g('rGC'),duracao:+g('rDur')||'',formacao:form,relacionados:rel,motivos,escalacao:computeEsc(form,rel),obs:R.dados.observacoes||ex?.obs||'',origem:'pdf',arquivo};
    progress('Salvando jogo…',.8);await Store.put('jogos',j);progressEnd();closeModal();
    S.filtro.categoria=cat;S.jogoSel=j.id;go(S.view==='jogos-arquivos'?'jogos-arquivos':'jogos-lista');toast('Jogo salvo a partir do relatório');modalDetalheJogo(j.id);
  }catch(e){progressEnd();console.error(e);Store.err(e);const b=$('#rGo');if(b)b.disabled=false;}
}

/* ================= VISUALIZAR PDF ARQUIVADO ================= */
async function verPdfJogo(id){
  const j=S.jogos.find(x=>x.id===id);if(!j||!j.arquivo)return;
  openModal(`<div class="modal xl"><div class="mh"><h3>📄 ${esc(j.arquivo.nome||'Relatório do jogo')}</h3><button class="icon-btn" data-close aria-label="Fechar">${IC.x}</button></div><div class="mb"><div id="pdfView" class="pdf-view"><div class="muted">Carregando…</div></div></div>
   <div class="mf"><span class="msg">${esc(j.adversario)} · ${fmtData(j.data)}</span><button class="btn" id="pdfDl">${IC.down} Baixar PDF</button><button class="btn pri" data-close>Fechar</button></div></div>`);
  let bytes;
  try{const r=await fetch(j.arquivo.url||('/_blob/'+j.arquivo.id));if(!r.ok)throw 0;bytes=await r.arrayBuffer();
    const doc=await abrirPdf(bytes.slice(0));const box=$('#pdfView');if(!box)return;box.innerHTML='';
    for(let p=1;p<=doc.numPages;p++){const pg=await doc.getPage(p);const vp=pg.getViewport({scale:1.4});const c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;box.appendChild(c);await pg.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;}
  }catch(e){const box=$('#pdfView');if(box)box.innerHTML='<div class="warn">Não foi possível abrir o PDF arquivado neste dispositivo.</div>';}
  const dl=$('#pdfDl');if(dl)dl.onclick=()=>{if(bytes)saveFile(j.arquivo.nome||'relatorio-jogo.pdf',new Blob([bytes]));};
}

/* ================= ABA: RELATÓRIOS DOS JOGOS ================= */
function viewJogosArquivos(){
  const jogos=jogosFiltrados().slice().reverse();const com=jogos.filter(j=>j.arquivo);
  return `<div class="page-h"><h2>Relatórios dos jogos (PDF)</h2><span class="muted">${com.length} de ${jogos.length} jogos com relatório arquivado</span></div>
  ${S.canWrite?`<div class="panel" style="margin-bottom:16px"><div class="ph">Adicionar relatório de jogo</div><div class="pb">
   <p style="margin-top:0">Envie o PDF do relatório do jogo. O sistema lê placar, data, horário, local, adversário, escalação, minutagem, gols, assistências, cartões e substituições, mostra tudo para você conferir e cria (ou atualiza) o jogo com o arquivo anexado.</p>
   <label class="drop" data-droppdf="1"><b>Selecionar PDF do jogo</b><span class="muted">Clique ou arraste o arquivo aqui · categoria atual: ${esc(S.filtro.categoria!=='Todas'?S.filtro.categoria:'Sub-17')}</span><input type="file" accept="application/pdf,.pdf" id="pdfJogo" hidden></label></div></div>`:''}
  ${com.length?`<div class="games-list">${com.map(j=>`<div class="gl-row"><div class="dt">${fmtData(j.data)}<small>${esc(j.hora||'')}</small></div><div class="mt" style="flex-direction:column;align-items:flex-start;gap:2px"><b>📄 ${esc(j.arquivo.nome||'Relatório')}</b><div class="info">Porto Vitória ${j.golsPro??'-'} x ${j.golsContra??'-'} ${esc(j.adversario)} · ${esc(j.competicao)} · ${esc(j.categoria)}</div></div><span class="res ${resultado(j)}">${resultado(j)==='N'?'–':resultado(j)}</span><div class="acts"><button class="btn sm" data-act="verPdf" data-id="${j.id}">Abrir PDF</button><button class="btn sm" data-act="detJogo" data-id="${j.id}">Detalhes</button></div></div>`).join('')}</div>`:'<div class="empty"><h3>Nenhum relatório arquivado ainda</h3><p>Os PDFs enviados aparecem aqui, ligados ao jogo correspondente.</p></div>'}`;
}
function bindArquivos(){
  const inp=$('#pdfJogo');if(inp)inp.onchange=()=>{const f=inp.files[0];if(f)importarRelatorioJogo(f);inp.value='';};
  document.querySelectorAll('[data-droppdf]').forEach(d=>{d.ondragover=e=>{e.preventDefault();d.classList.add('over');};d.ondragleave=()=>d.classList.remove('over');d.ondrop=e=>{e.preventDefault();d.classList.remove('over');const f=e.dataTransfer.files[0];if(f)importarRelatorioJogo(f);};});
  const fi=$('#fotosLote');if(fi)fi.onchange=()=>{if(fi.files.length)abrirFotos(fi.files);fi.value='';};
}

;

"use strict";
/* ================= NAVEGAÇÃO ================= */
const NAV=[
  {k:'dashboard',n:'Dashboard',ic:IC.dash},
  {k:'atletas',n:'Atletas',ic:IC.users},
  {k:'jogos',n:'Jogos',ic:IC.ball,sub:[['jogos-painel','Painel de jogos'],['jogos-lista','Cadastro de jogos'],['jogos-arquivos','Relatórios dos jogos (PDF)']]},
  {k:'min',n:'Minutagem',ic:IC.clock,sub:[['min-geral','Minutagem geral'],['min-jogo','Minutagem por jogo'],['min-pos','Individual por posição'],['min-atl','Relatório do atleta']]},
  {k:'relatorio',n:'Relatórios em PDF',ic:IC.file},
  {k:'importar',n:'Importar Excel',ic:IC.upload},
];
const TITLES={dashboard:['Dashboard','Todo o elenco'],atletas:['Atletas','Cadastro'],'jogos-painel':['Jogos','Painel'],'jogos-lista':['Jogos','Cadastro'],'jogos-arquivos':['Jogos','Relatórios em PDF'],'min-geral':['Minutagem','Geral'],'min-jogo':['Minutagem','Por jogo'],'min-pos':['Minutagem','Por posição'],'min-atl':['Minutagem','Relatório do atleta'],relatorio:['Relatórios','PDF'],importar:['Importar','Planilhas Excel'],config:['Configurações','']};
function renderSide(){return window.UNI.renderSide();
  const item=n=>{const active=S.view===n.k||(n.sub&&n.sub.some(s=>s[0]===S.view));
    return `<div class="nav-item"><button class="nav-btn ${active?'active':''}" ${n.sub?`data-go="${n.sub[0][0]}"`:`data-go="${n.k}"`} aria-label="${n.n}">${n.ic}</button>
    <div class="nav-fly"><div class="fly-title">${n.n}</div>${n.sub?n.sub.map(s=>`<button data-go="${s[0]}" class="${S.view===s[0]?'active':''}">${s[1]}</button>`).join(''):`<button data-go="${n.k}" class="${active?'active':''}">Abrir ${n.n.toLowerCase()}</button>`}</div></div>`;};
  $('#side').innerHTML=`<div class="brand"><img src="${LOGO}" alt="Porto Vitória"></div>${NAV.map(item).join('')}<div class="spacer"></div>
   ${item({k:'config',n:'Configurações',ic:IC.gear})}
   <div class="nav-item"><button class="nav-btn" data-act="theme" aria-label="Alternar tema claro/escuro">${IC.moon}</button><div class="nav-fly"><div class="fly-title">Tema</div><button data-act="theme">Alternar claro / escuro</button></div></div>`;
}
function renderTop(){
  const anos=[...new Set(S.jogos.map(anoDe).filter(Boolean))].sort().reverse();
  const cats=S.config.categorias,comps=S.config.competicoes;
  const [t,s]=TITLES[S.view]||['',''];
  const showF=!['config','importar'].includes(S.view);
  $('#topbar').innerHTML=`<div class="crumb">${t} ${s?`<small>· ${s}</small>`:''}</div>
   ${showF?`<div class="flt"><label for="fC">Categoria</label><select id="fC"><option>Todas</option>${cats.map(c=>`<option ${c===S.filtro.categoria?'selected':''}>${esc(c)}</option>`).join('')}</select></div>
   ${S.filtro.categoria!=='Todas'?`<div class="flt"><label for="fS">Sub</label><select id="fS"><option value="Todas">Todas (${GRUPOS[S.filtro.categoria].join(' e ')})</option>${GRUPOS[S.filtro.categoria].map(c=>`<option ${c===S.filtro.sub?'selected':''}>${c}</option>`).join('')}</select></div>`:''}
   ${S.view!=='atletas'?`<div class="flt"><label for="fM">Competição</label><select id="fM"><option>Todas</option>${comps.map(c=>`<option ${c===S.filtro.competicao?'selected':''}>${esc(c)}</option>`).join('')}</select></div>
   <div class="flt"><label for="fA">Ano</label><select id="fA"><option>Todos</option>${anos.map(a=>`<option ${a===S.filtro.ano?'selected':''}>${a}</option>`).join('')}</select></div>
   <div class="flt"><label for="fP">Período</label><select id="fP">${[['ano','Ano todo'],['s1','1º semestre'],['s2','2º semestre']].map(([v,l])=>`<option value="${v}" ${S.filtro.per===v?'selected':''}>${l}</option>`).join('')}<optgroup label="Mês">${MESL.map((m,i)=>{const v='m'+String(i+1).padStart(2,'0');const tem=S.jogos.some(j=>+String(j.data||'').slice(5,7)===i+1&&(S.filtro.ano==='Todos'||anoDe(j)===S.filtro.ano));return `<option value="${v}" ${S.filtro.per===v?'selected':''}>${m}${tem?'':' (sem jogos)'}</option>`;}).join('')}</optgroup></select></div>`:''}`:''}
   ${['dashboard','min-geral','min-jogo','min-pos','min-atl','jogos-painel'].includes(S.view)?`<button class="btn sm pri" data-act="pdfView">${IC.down} PDF desta página</button>`:''}
   <span class="sync ${S.online?'ok':''}" title="${S.online?'Dados sincronizados na nuvem':'Dados salvos neste navegador'}"><i></i>${S.online?'Sincronizado':'Local'}</span>`;
  const bind=(id,k)=>{const e=$('#'+id);if(e)e.onchange=()=>{S.filtro[k]=e.value;try{localStorage.setItem('pv_filtro',JSON.stringify(S.filtro));}catch(x){}render();};};
  bind('fC','categoria');bind('fS','sub');{const e=$('#fC');if(e)e.addEventListener('change',()=>{S.filtro.sub='Todas';try{localStorage.setItem('pv_filtro',JSON.stringify(S.filtro));}catch(x){}render();});}bind('fM','competicao');bind('fA','ano');bind('fP','per');
}
function render(){if(window.__APP!=='min')return;try{__render();}finally{window.UNI&&window.UNI.afterMinRender();}}
function __render(){
  if(S.filtro.categoria!=='Todas'&&!S.config.categorias.includes(S.filtro.categoria))S.filtro.categoria=S.config.categorias[0]||'Todas';
  renderSide();renderTop();
  const v={'jogos-arquivos':viewJogosArquivos,'min-atl':()=>viewAtleta(),relatorio:viewRelatorio,importar:viewImportar,dashboard:()=>viewDashboard(),atletas:viewAtletas,'jogos-painel':viewJogosPainel,'jogos-lista':viewJogosLista,'min-geral':viewGeral,'min-jogo':()=>viewPorJogo(),'min-pos':()=>viewPosicao(),config:viewConfig}[S.view]||viewDashboard;
  const ct=$('#content');const st=ct.scrollTop;
  if(!S.loaded&&!S.atletas.length){ct.innerHTML='<div class="empty"><h3>Carregando dados…</h3></div>';return;}
  ct.innerHTML=`<div class="rwrap">${v()}</div>`;ct.scrollTop=st;
  const sa=$('#selAtl');if(sa)sa.onchange=()=>{S.atlSel=sa.value;render();};
  bindRelatorio();if(S.view==='importar')bindImportar();bindArquivos();
  const sj=$('#selJogo');if(sj)sj.onchange=()=>{S.jogoSel=sj.value;render();};
  const b=$('#busca');if(b){b.oninput=()=>{S.busca=b.value;const pos=b.selectionStart;render();const nb=$('#busca');nb.focus();nb.setSelectionRange(pos,pos);};}
  document.querySelectorAll('[data-sel]').forEach(c=>c.onchange=()=>{c.checked?S.sel.add(c.dataset.sel):S.sel.delete(c.dataset.sel);render();});
  const sall=$('#selAll');if(sall)sall.onchange=()=>{const q=S.busca.toLowerCase();atletasCat().filter(a=>!q||a.nome.toLowerCase().includes(q)).forEach(a=>sall.checked?S.sel.add(a.id):S.sel.delete(a.id));render();};
  const imp=$('#impFile');if(imp)imp.onchange=importar;
  const tp=$('#cfgTopo');if(tp)tp.onchange=async()=>{S.config.capaTopo=tp.value;await Store.putConfig();render();};
  document.querySelectorAll('[data-prof]').forEach(el=>el.onchange=async()=>{const i=+el.dataset.prof,k=el.dataset.k;const l=(S.config.profissionais||[]).map(p=>({...p}));l[i][k]=k==='ativo'?el.checked:el.value.trim();S.config.profissionais=l;await Store.putConfig();render();});
  const cm=$('#capaMini');if(cm){cm.innerHTML=`<div style="transform-origin:0 0;transform:scale(${cm.clientWidth/1536})">${capaHTML(capaSpec([],'Minutagem'))}</div>`;}
  const ca=$('#cfgAno');if(ca)ca.onchange=async()=>{S.config.anoBase=+ca.value||new Date().getFullYear();await Store.putConfig();toast('Ano-base atualizado');};
  document.querySelectorAll('[data-dur]').forEach(i=>i.onchange=async()=>{S.config.duracao={...S.config.duracao,[i.dataset.dur]:Number(i.value)||90};await Store.putConfig();toast('Duração atualizada');});
}
function go(v){if(v==='atletas')return window.UNI.go('atletas');if(!MIN_VIEWS.has(v))return window.UNI.go(v);S.view=v;try{localStorage.setItem('pv_view',v);}catch(e){}$('#content').scrollTop=0;render();}

/* ================= MODAL ================= */
let lastFocus=null;
function openModal(html){lastFocus=document.activeElement;$('#modalRoot').innerHTML=`<div class="modal-bg" role="dialog" aria-modal="true">${html}</div>`;const f=$('#modalRoot input,#modalRoot select');if(f)f.focus();}
function closeModal(){$('#modalRoot').innerHTML='';if(lastFocus&&lastFocus.focus)lastFocus.focus();}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#modalRoot').innerHTML)closeModal();});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('.gl-row.click,.gcard,.gb2')){e.preventDefault();modalDetalheJogo(e.target.dataset.id);}});

/* ================= EVENTOS GLOBAIS ================= */
document.addEventListener('click',async e=>{
  const g=e.target.closest('[data-go]');if(g){go(g.dataset.go);return;}
  if(e.target.closest('[data-close]')){closeModal();return;}
  if(e.target.classList.contains('modal-bg')){return;}
  const p=e.target.closest('[data-pos]');if(p){S.posSel=p.dataset.pos;render();return;}
  const rm=e.target.closest('[data-rm]');if(rm){const k=rm.dataset.rm,i=+rm.dataset.i;const nm=S.config[k][i];
    const inUse=k==='categorias'?S.atletas.some(a=>a.categoria===nm)||S.jogos.some(j=>j.categoria===nm):S.jogos.some(j=>j.competicao===nm);
    if(inUse&&!await ask(`"${nm}" está em uso em cadastros. Remover mesmo assim? Os registros continuam salvos.`))return;
    S.config[k]=S.config[k].filter((_,x)=>x!==i);await Store.putConfig();render();return;}
  const ad=e.target.closest('[data-add]');if(ad){const k=ad.dataset.add;const inp=$('#add_'+k);const v=inp.value.trim();if(!v)return;if(S.config[k].includes(v)){toast('Já existe');return;}
    S.config[k]=[...S.config[k],v];if(k==='categorias'&&!S.config.duracao[v])S.config.duracao={...S.config.duracao,[v]:90};await Store.putConfig();render();toast('Adicionado');return;}
  const a=e.target.closest('[data-act]');if(!a)return;const act=a.dataset.act,id=a.dataset.id;
  if(act==='theme'){const cur=document.documentElement.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');const n=cur==='dark'?'light':'dark';document.documentElement.dataset.theme=n;try{localStorage.setItem('pv_theme',n);}catch(x){}}
  else if(act==='print'){try{window.print();}catch(x){toast('Use o menu do navegador para imprimir.');}}
  else if(act==='novoAtleta')modalAtleta();
  else if(act==='editAtleta')modalAtleta(id);
  else if(act==='novoJogo')modalJogo();
  else if(act==='editJogo'){if(a.dataset.closefirst)closeModal();modalJogo(id);}
  else if(act==='destEsc'){S.destEsc=a.dataset.v;render();}
  else if(act==='perfPt'){S.perfSel=+a.dataset.i;render();}
  else if(act==='golsN'){S.golsN=+a.dataset.v;render();}
  else if(act==='rankSort'){S.rankSort=a.dataset.v;render();}
  else if(act==='rankAll'){S.rankAll=!S.rankAll;render();}
  else if(act==='carPrev'){S.carPag=Math.max(0,(S.carPag||0)-1);render();}
  else if(act==='carNext'){S.carPag=(S.carPag||0)+1;render();}
  else if(act==='mesPrev'||act==='mesNext'){const ms=[...new Set(jogosFiltrados().map(j=>j.data.slice(0,7)))].sort();const i=ms.indexOf(S.mesDest)+(act==='mesNext'?1:-1);if(ms[i])S.mesDest=ms[i];render();}
  else if(act==='detJogo'){if(a.dataset.closefirst)closeModal();modalDetalheJogo(id);}
  else if(act==='verPdf'){if(a.dataset.closefirst)closeModal();verPdfJogo(id);}
  else if(act==='verJogo'){if(a.dataset.closefirst)closeModal();S.jogoSel=id;go('min-jogo');}
  else if(act==='titMin'){const d=Number(EJ.duracao)||S.config.duracao?.[EJ.categoria]||90;EJ.relacionados.forEach(r=>{if(r.status==='T'&&!+r.min)r.min=d;});renderEJ();}
  else if(act==='relAll'){if(await ask('Limpar todos os relacionados deste jogo?')){EJ.relacionados=[];EJ.escalacao=[];renderEJ();}}
  else if(act==='autoEsc'){autoEsc();renderEJ();}
  else if(act==='clrEsc'){EJ.escalacao=[];EJslot=-1;renderEJ();}
  else if(act==='demo')carregarDemo();
  else if(act==='recalcSub'){const l=S.atletas.filter(a=>a.nascimento);if(!l.length){toast('Nenhum atleta com data de nascimento.');return;}
    if(!await ask(`Recalcular categoria e subcategoria de ${l.length} atletas pela idade em ${S.config.anoBase}?`))return;
    const arr=l.map(a=>{const q=subPorIdade(a.nascimento,S.config.anoBase);return q.cat?{...a,categoria:q.cat,subcategoria:q.sub}:a;});progress('Salvando…',.2);await putMany('atletas',arr);progressEnd();render();toast('Subcategorias atualizadas');}
  else if(act==='selMode'){S.selMode=!S.selMode;S.sel=new Set();render();}
  else if(act==='delSel'){const n=S.sel.size;if(!n)return;if(!await ask(`Excluir ${n} atleta(s)? Os minutos deles nos jogos também serão removidos.`))return;await apagarAtletas([...S.sel]);S.sel=new Set();S.selMode=false;render();toast(`${n} atleta(s) excluído(s)`);}
  else if(act==='limpar')modalLimpar();
  else if(act==='profAdd'){S.config.profissionais=[...(S.config.profissionais||[]),{nome:'',cargo:'',ativo:true}];await Store.putConfig();render();}
  else if(act==='profDel'){S.config.profissionais=(S.config.profissionais||[]).filter((_,i)=>i!==+a.dataset.i);await Store.putConfig();render();}
  else if(act==='pdfJogoDet'){if(a.dataset.closefirst)closeModal();gerarPDF([{t:'jogo',id}]);}
  else if(act==='pdf')gerarPDF();
  else if(act==='printRep')imprimirRel();
  else if(act==='pdfView'){const sp={'jogos-painel':{t:'painel'},dashboard:{t:'dash',rows:S.rep.dashRows||0},'min-geral':{t:'geral'},'min-jogo':{t:'jogo',id:S.jogoSel},'min-pos':{t:'pos',p:S.posSel},'min-atl':{t:'atl',id:S.atlSel}}[S.view];if(S.view==='min-pos'){const n=atletasCat().filter(a=>a.posicao===S.posSel).length;gerarPDF(dividir(n).map((_,k)=>({t:'pos',p:S.posSel,part:k})));return;}if(sp)gerarPDF([sp]);}
  else if(act==='modelo')baixarModelo(a.dataset.k);
  else if(act==='expAtletas')exportarAtletas();
  else if(act==='expMinutagem')exportarMinutagem();
  else if(act==='export')exportar();
});

/* ================= EXCLUSÃO EM MASSA ================= */
async function delMany(col,ids){
  if(!ids.length)return 0;let falhas=0;
  if(Store.db){for(let i=0;i<ids.length;i+=25){const r=await Promise.allSettled(ids.slice(i,i+25).map(id=>Store.db.collection(col).doc(id).delete()));
      r.forEach((x,k)=>{if(x.status==='rejected'){falhas++;console.warn('delete',ids[i+k],x.reason);}});
      progress(`Excluindo… ${Math.min(ids.length,i+25)} de ${ids.length}`,Math.min(1,(i+25)/ids.length));}}
  const set=new Set(ids);S[col]=S[col].filter(x=>!set.has(x.id));Store.saveLocal();
  if(falhas){toast(`${falhas} registro(s) não puderam ser apagados (sem permissão ou sem conexão).`);}
  return falhas;
}
async function apagarAtletas(ids){
  const set=new Set(ids);
  const afet=S.jogos.filter(j=>(j.relacionados||[]).some(r=>set.has(r.atletaId))||(j.escalacao||[]).some(x=>set.has(x))||Object.keys(j.motivos||{}).some(k=>set.has(k)))
    .map(j=>({...j,relacionados:(j.relacionados||[]).filter(r=>!set.has(r.atletaId)),escalacao:(j.escalacao||[]).map(x=>set.has(x)?null:x),motivos:Object.fromEntries(Object.entries(j.motivos||{}).filter(([k])=>!set.has(k)))}));
  progress('Excluindo…',.1);await delMany('atletas',ids);if(afet.length)await putMany('jogos',afet);progressEnd();
}
function modalLimpar(){
  const c=S.filtro.categoria;const escopoCat=c!=='Todas';
  const contar=sc=>({ats:S.atletas.filter(a=>sc==='todas'||a.categoria===c).length,js:S.jogos.filter(j=>sc==='todas'||j.categoria===c).length});
  openModal(`<div class="modal"><div class="mh"><h3>Limpar dados</h3><button class="icon-btn" data-close aria-label="Fechar">${IC.x}</button></div><div class="mb">
   <p style="margin-top:0">Marque o que deseja apagar. <b>Essa ação não pode ser desfeita</b> — se quiser, exporte um backup antes em Configurações.</p>
   <div class="rep-opt" style="margin-bottom:10px"><label><input type="checkbox" id="lAtl" checked>Atletas<small id="lAtlN"></small></label></div>
   <div class="rep-opt" style="margin-bottom:10px"><label><input type="checkbox" id="lJog" checked>Jogos e minutagem<small id="lJogN"></small></label></div>
   <div class="f" style="margin-top:14px"><label for="lEsc">Abrangência</label><select id="lEsc">${escopoCat?`<option value="cat">Somente a categoria ${esc(c)}</option>`:''}<option value="todas">Todas as categorias</option></select></div>
  </div><div class="mf"><span class="msg" id="lMsg"></span><button class="btn" data-close>Cancelar</button><button class="btn pri" id="lGo" style="background:var(--red);border-color:var(--red)">${IC.trash} Limpar selecionados</button></div></div>`);
  const upd=()=>{const n=contar($('#lEsc').value);$('#lAtlN').textContent=n.ats+' atleta(s)';$('#lJogN').textContent=n.js+' jogo(s)';};
  ['lEsc','lAtl','lJog'].forEach(id=>{$('#'+id).onchange=upd;});upd();
  $('#lGo').onclick=async()=>{
    const sc=$('#lEsc').value,doA=$('#lAtl').checked,doJ=$('#lJog').checked;
    if(!doA&&!doJ){$('#lMsg').textContent='Marque Atletas e/ou Jogos.';return;}
    if(!S.canWrite){$('#lMsg').textContent='Você não tem permissão para apagar dados.';return;}
    const n=contar(sc);const txt=[doA?n.ats+' atleta(s)':'',doJ?n.js+' jogo(s) com a minutagem':''].filter(Boolean).join(' e ');
    if(!await ask(`Apagar ${txt}${sc==='cat'?' da categoria '+c:' de todas as categorias'}? Não dá para desfazer.`,{ok:'Apagar'}))return;
    $('#lGo').disabled=true;
    try{
      if(doJ){progress('Excluindo jogos…',.1);await delMany('jogos',S.jogos.filter(j=>sc==='todas'||j.categoria===c).map(j=>j.id));}
      if(doA){const ids=S.atletas.filter(a=>sc==='todas'||a.categoria===c).map(a=>a.id);progress('Excluindo atletas…',.5);if(doJ)await delMany('atletas',ids);else await apagarAtletas(ids);}
      progressEnd();closeModal();S.selMode=false;S.sel=new Set();render();toast('Dados apagados');
    }catch(e){progressEnd();console.error(e);Store.err(e);const b=$('#lGo');if(b)b.disabled=false;}};
}

/* ================= BACKUP ================= */
async function exportar(){
  const data=JSON.stringify({sistema:'Porto Vitória Minutagem',versao:1,exportado:new Date().toISOString(),config:S.config,atletas:S.atletas,jogos:S.jogos});
  const fn=`porto-vitoria-backup-${new Date().toISOString().slice(0,10)}.json`;
  try{const dl=window.claude&&await window.claude.use('downloads');if(dl){await dl.save({filename:fn,data});return;}}catch(e){if(e&&e.code&&e.code!=='cancelled'){}}
  openModal(`<div class="modal"><div class="mh"><h3>Backup</h3><button class="icon-btn" data-close aria-label="Fechar">${IC.x}</button></div><div class="mb"><p>Copie o conteúdo abaixo e salve em um arquivo <b>.json</b>.</p><textarea style="width:100%;height:260px;font-size:11px;border:1px solid var(--line);border-radius:8px;background:var(--card2);padding:8px" readonly>${esc(data)}</textarea></div></div>`);
}
async function importar(e){
  const f=e.target.files[0];if(!f)return;
  try{const d=JSON.parse(await f.text());if(!Array.isArray(d.atletas)||!Array.isArray(d.jogos))throw 0;
    if(!await ask(`Importar ${d.atletas.length} atletas e ${d.jogos.length} jogos? Registros com o mesmo código serão substituídos.`))return;
    toast('Importando…');if(d.config){S.config={...DEFAULT_CFG,...d.config};await Store.putConfig();}
    for(const a of d.atletas)await Store.put('atletas',a);for(const j of d.jogos)await Store.put('jogos',j);render();toast('Backup importado');
  }catch(x){toast('Arquivo inválido. Use um backup exportado por este sistema.');}
}

/* ================= DADOS DE EXEMPLO ================= */
async function carregarDemo(){
  if(!await ask('Carregar um elenco Sub-17 fictício com 40 atletas e 28 jogos do Estadual 2024? Você pode apagar depois.'))return;
  let seed=17;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;const ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
  const nomes=[['Gabriel Lima','GOL'],['Lucas Andrade','GOL'],['Pedro Henrique','VOL'],['Felipe Rocha','VOL'],['Igor Mendes','VOL'],['Miguel Costa','VOL'],['Thiago Santos','VOL'],['Vinícius Souza','VOL'],['João Lucas','VOL'],
   ['Enzo Martins','LAT','Lateral Esquerdo'],['Luca Barros','LAT','Lateral Direito'],['Gustavo Reis','LAT','Lateral Direito'],['Ryan Alves','LAT','Lateral Esquerdo'],['Lucca Silva','LAT','Lateral Direito'],['Kauan Oliveira','LAT','Lateral Esquerdo'],
   ['João Vitor','ZAG'],['Lucas Ferreira','ZAG'],['Matheus Dias','ZAG'],['Rikelme Santos','ZAG'],['Arthur Gomes','ZAG'],['Eric Souza','ZAG'],
   ['Matheus Ribeiro','MEI'],['Rafael Nunes','MEI'],['Bruno Alves','MEI'],['Kauê Dias','MEI'],['André Souza','MEI'],['Felipe Lima','MEI'],['Davi Santos','MEI'],['João Pedro','MEI'],
   ['Davi Lucas','ATA','Centroavante'],['Arthur Silva','ATA'],['Caio Pereira','ATA'],['Pedro Lucas','ATA'],['Felipe Nunes','ATA'],['Pedro Alves','ATA'],['Kauan Santos','ATA'],
   ['Gustavo Nunes','EXT','Ponta Direita'],['Kauã Santos','EXT','Ponta Esquerda'],['Breno Ferreira','EXT','Ponta Direita'],['Matheus Alves','EXT','Ponta Esquerda']];
  const ats=nomes.map(([n,p,d],i)=>({id:'demo_a'+i,nome:n,apelido:'',numero:'',nascimento:`${i%3===0?2010:2009}-${String(ri(1,12)).padStart(2,'0')}-${String(ri(1,28)).padStart(2,'0')}`,categoria:'Sub-17',subcategoria:'',posicao:p,posDetalhe:d||POSN[p],pe:rnd()<.72?'Direito':'Esquerdo',altura:(p==='GOL'?ri(184,193):p==='ZAG'?ri(180,190):ri(166,182))/100,peso:p==='GOL'||p==='ZAG'?ri(72,82):ri(60,73),gordura:(ri(80,130)/10),foto:''}));
  // prioridade de titularidade por ordem dentro da posição
  const byP={};POS.forEach(p=>byP[p]=ats.filter(a=>a.posicao===p));
  const advs=['Rio Branco','Vitória FC','Desportiva Ferroviária','Serra FC','Real Noroeste','Estrela do Norte','Nova Venécia','Vilavelhense','Capixaba SC','Jaguaré','São Mateus','Linhares FC','Atlético Itapemirim','Rio Branco VN'];
  const locs=['Estádio Kleber Andrade','Estádio Salvador Costa','CT Porto Vitória','Estádio Engenheiro Araripe','Estádio Robertão'];
  const jogos=[];const start=new Date('2024-01-20T12:00:00');
  const need={GOL:1,LAT:2,ZAG:2,VOL:2,MEI:2,ATA:1,EXT:1};
  for(let g=0;g<28;g++){
    const d=new Date(start.getTime()+g*9.6*86400000);const casa=g%2===0;
    const pick=(p,n)=>{const l=byP[p].slice();const out=[];for(let i=0;i<l.length&&out.length<n;i++){if(rnd()<(i===0?.86:i===1?.68:.5))out.push(l[i]);}for(const x of l){if(out.length>=n)break;if(!out.includes(x))out.push(x);}return out;};
    const tit=[];POS.forEach(p=>tit.push(...pick(p,need[p])));
    const resto=ats.filter(a=>!tit.includes(a));resto.sort((a,b)=>(byP[a.posicao].indexOf(a)+rnd()*2.5)-(byP[b.posicao].indexOf(b)+rnd()*2.5));
    const res=resto.slice(0,9);const entram=res.slice(0,5);
    const rel=[];let sub=0;
    tit.forEach(a=>{const sai=a.posicao!=='GOL'&&sub<5&&rnd()<.5;const m=sai?ri(50,80):90;if(sai)sub++;rel.push({atletaId:a.id,status:'T',min:m,gols:0,assist:0,ca:rnd()<.12?1:0,cv:rnd()<.01?1:0});});
    res.forEach((a,i)=>rel.push({atletaId:a.id,status:'R',min:entram.includes(a)?ri(10,40):0,gols:0,assist:0,ca:entram.includes(a)&&rnd()<.06?1:0,cv:0}));
    const gp=[0,1,1,2,2,2,3,3,4][ri(0,8)],gc=[0,0,1,1,1,2,3][ri(0,6)];
    const ofens=rel.filter(r=>+r.min>0&&['ATA','EXT','MEI','VOL','ZAG','LAT'].includes(ats.find(a=>a.id===r.atletaId).posicao));
    const w=r=>({ATA:6,EXT:4,MEI:3,VOL:1.2,ZAG:1,LAT:.8})[ats.find(a=>a.id===r.atletaId).posicao]*(r.min/90);
    const wpick=()=>{const t=ofens.reduce((s,r)=>s+w(r),0);let x=rnd()*t;for(const r of ofens){x-=w(r);if(x<=0)return r;}return ofens[0];};
    for(let k=0;k<gp;k++){const sc=wpick();sc.gols++;if(rnd()<.7){let as=wpick();if(as!==sc)as.assist++;}}
    const ord={GOL:0,LAT:1,ZAG:2,VOL:3,MEI:4,EXT:5,ATA:6};
    const f=FORMACOES['4-2-3-1'];const escal=Array(11).fill(null);const tl=tit.slice();
    f.forEach((s,i)=>{const want=s[2]==='MEI'&&i!==8?['EXT','MEI']:[s[2]];const a=tl.find(t=>want.includes(t.posicao)&&!escal.includes(t.id));if(a)escal[i]=a.id;});
    f.forEach((s,i)=>{if(!escal[i]){const a=tl.find(t=>!escal.includes(t.id));if(a)escal[i]=a.id;}});
    const relIds=new Set(rel.map(r=>r.atletaId));const motivos={};ats.forEach(a=>{if(!relIds.has(a.id)){const r=rnd();motivos[a.id]=r<.85?'Opção técnica':r<.95?'Lesão':'Suspensão';}});
    jogos.push({id:'demo_j'+g,categoria:'Sub-17',competicao:'Estadual',data:d.toISOString().slice(0,10),hora:['09:00','10:00','15:00','15:30'][ri(0,3)],local:casa?'CT Porto Vitória':locs[ri(0,locs.length-1)],mando:casa?'casa':'fora',adversario:advs[g%advs.length],logoAdv:'',golsPro:gp,golsContra:gc,duracao:'',formacao:'4-2-3-1',relacionados:rel,escalacao:escal,motivos,obs:''});
  }
  toast('Carregando dados de exemplo…');
  S.filtro={categoria:'Sub-17',competicao:'Todas',ano:'Todos'};
  try{await Promise.all(ats.map(a=>Store.put('atletas',a)));await Promise.all(jogos.map(j=>Store.put('jogos',j)));}catch(e){}
  render();toast('Dados de exemplo carregados');
}

Store.init();
return {go,render,closeModal,S,Store};

})();

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
      const isUp = n.up || n.k === 'config';
      return `<div class="nav-item ${isUp ? 'nav-item-up' : ''}"><button class="nav-btn ${active ? 'active' : ''}" data-nav="${n.sub ? n.sub[0][0] : n.k}" aria-label="${n.n}">${n.ic}</button>
      <div class="nav-fly ${isUp ? 'nav-fly-up' : ''}" style="${isUp ? 'top:auto!important;bottom:8px!important;' : ''}"><div class="fly-title">${n.n}</div>${n.sub ? n.sub.map(s => `<button data-nav="${s[0]}" class="${cur === s[0] ? 'active' : ''}">${s[1]}</button>`).join('') : `<button data-nav="${n.k}" class="${active ? 'active' : ''}">Abrir ${n.n.toLowerCase()}</button>`}</div></div>`;
    };
    $('#side').innerHTML = `<div class="brand"><img src="${LOGO}" alt="Porto Vitória"></div>${NAV.map(item).join('')}<div class="spacer"></div>
     ${item({ k: 'config', n: 'Configurações', ic: IC.gear, up: true, sub: [['config', 'Todos os módulos'], ...CFG_TABS] })}
     <div class="nav-item nav-item-up"><button class="nav-btn" data-nav-act="theme" aria-label="Alternar tema claro/escuro">${IC.moon}</button><div class="nav-fly nav-fly-up" style="top:auto!important;bottom:8px!important;"><div class="fly-title">Tema</div><button data-nav-act="theme">Alternar claro / escuro</button></div></div>`;
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

// Previne que submenus laterais (flyout) ultrapassem a borda inferior da janela
window.document.addEventListener('mouseover', e => {
  const item = e.target.closest && e.target.closest('.nav-item');
  if (!item) return;
  const fly = item.querySelector('.nav-fly');
  if (!fly) return;
  const rect = fly.getBoundingClientRect();
  if (rect.bottom > window.innerHeight - 6) {
    fly.style.top = 'auto';
    fly.style.bottom = '0';
  }
}, { passive: true });

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

/* sobreposições que precisam vir depois do sistema único */
const _vConfigX = vConfig;
vConfig = function () { const h = _vConfigX(); if (S.view !== 'config-geral') return h; return h + '<div style="height:14px"></div>' + exportHTML(); };

// capa dos relatórios: editável em Configurações → Geral
const _vConfigC = vConfig;
vConfig = function () { const h = _vConfigC(); if (S.view !== 'config-geral') return h; const c = capaCfg(); return h + '<div style="height:14px"></div>' + panel('Capa dos relatórios em PDF', `<p class="muted" style="margin-top:0">Vale para as capas de todos os relatórios (DM, nutrição, avaliação física, maturação e monitoramento).</p><div class="form" style="grid-template-columns:1fr 1fr"><div class="f"><label for="cpD">Linha do topo</label><input id="cpD" data-cap="depto" value="${esc(c.depto)}"></div><div class="f"><label for="cpR">Responsável (nome - função)</label><input id="cpR" data-cap="responsavel" value="${esc(c.responsavel)}"></div><div class="f s2" style="grid-column:1/-1"><label for="cpS">Frase da capa</label><input id="cpS" data-cap="slogan" value="${esc(c.slogan)}"></div>${Object.entries(c.titulos).map(([k, v]) => `<div class="f"><label>Título · ${{ dm: 'Fisio / DM', nut: 'Nutrição', av: 'Avaliação física', mat: 'Maturação', mon: 'Monitoramento' }[k]}</label><input data-capt="${k}" value="${esc(v)}"></div>`).join('')}</div><div style="margin-top:12px"><b style="font:800 13px var(--fc);text-transform:uppercase;color:var(--ink2)">Prévia da capa</b><div class="rbgrid" style="margin-top:6px"><div class="rbthumb big"><div class="rbsc">${capaGeral('av')}</div></div></div></div>`); };
window.document.addEventListener('change', e => { const t = e.target; if (t.dataset.cap || t.dataset.capt) { const c = S.config.capa || {}; if (t.dataset.cap) c[t.dataset.cap] = t.value.trim(); else c.titulos = { ...(c.titulos || {}), [t.dataset.capt]: t.value.trim() }; S.config.capa = c; putConfig(); toast('Capa atualizada'); render(); } });
// ajusta as folhas da prévia depois de desenhar a tela
const _renderRB = render;
function rbFit() { document.querySelectorAll('.rbthumb .sheet, .rbzoom .sheet').forEach(s => { try { fitSheet(s); } catch (e) { } }); document.querySelectorAll('.rbthumb, .rbzoom').forEach(t => { const a4 = t.classList.contains('a4'); const el = t.querySelector('.rbsc, .rbzs'); if (el) el.style.transform = `scale(${t.clientWidth / (a4 ? 1123 : 1280)})`; }); }
window.rbFit = rbFit;
render = function () { _renderRB(); requestAnimationFrame(rbFit); };
window.addEventListener('resize', () => requestAnimationFrame(rbFit));

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
UNI.renderSide = function () { _rsLogin(); const side = document.getElementById('side'); if (!side || side.querySelector('[data-nav-act="logout"]')) return; const th = side.querySelector('[data-nav-act="theme"]'); const item = th ? th.closest('.nav-item') : null; const u = window.usuarioAtualPV && usuarioAtualPV(); const html = `<div class="nav-item nav-item-up"><button class="nav-btn" data-nav-act="logout" aria-label="Sair">${I('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>')}</button><div class="nav-fly nav-fly-up" style="top:auto!important;bottom:10px!important;"><div class="fly-title">${u ? esc(u.nome) : 'Conta'}</div><button data-nav-act="logout">Sair do sistema</button></div></div>`; if (item) item.insertAdjacentHTML('afterend', html); else side.insertAdjacentHTML('beforeend', html); };
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


// inicia: restaura a última tela (de qualquer módulo)
let __startView = 'inicio';
try { const v = localStorage.getItem('pv_dm_view'); if (v && (TITLES[v] || MIN_ROUTES[v])) __startView = v; } catch (e) { }
if (!MIN_ROUTES[__startView]) S.view = __startView;
injectBodyDefs();
initStore();
if (MIN_ROUTES[__startView]) setTimeout(() => UNI.go(__startView), 0);
checkLF: try { checarLinkForm(); } catch (e) { }

