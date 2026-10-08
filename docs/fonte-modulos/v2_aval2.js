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
document.addEventListener('click', e => {
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
document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'tsD') { const k = TEST_ROUTES[S.view]; if (k) UI.tsDate[k] = t.value; render(); }
  if (t.id === 'tsC') { UI.tsCmp = t.value; render(); }
  if (t.id === 'tsP') { UI.tsPos = t.value; render(); }
  if (t.id === 'tsS') { UI.tsSt = t.value; render(); }
  if (t.dataset.band) { const k = t.dataset.band; const b = [...bandas(k)]; b[+t.dataset.i] = +t.value; S.config.bandas = { ...(S.config.bandas || {}), [k]: b }; putConfig(); }
});
let tsbt; document.addEventListener('input', e => { if (e.target.id === 'tsB') { const v = e.target.value; clearTimeout(tsbt); tsbt = setTimeout(() => { UI.tsBusca = v; const p = e.target.selectionStart; render(); const el = $('#tsB'); if (el) { el.focus(); el.setSelectionRange(p, p); } }, 250); } });
