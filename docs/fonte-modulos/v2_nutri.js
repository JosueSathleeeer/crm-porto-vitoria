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
document.addEventListener('click', e => {
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
document.addEventListener('change', e => {
  const t = e.target;
  if (t.name === 'diaTipo') { UI.diaTipo = t.value; render(); }
  if (t.id === 'cmpSel') { UI.cmpAtl = t.value; render(); }
  if (t.id === 'cfgAlvoMin' || t.id === 'cfgAlvoMax') { S.config.nutri = { ...(S.config.nutri || {}), alvoMin: +$('#cfgAlvoMin').value || 8, alvoMax: +$('#cfgAlvoMax').value || 14 }; putConfig(); }
});
