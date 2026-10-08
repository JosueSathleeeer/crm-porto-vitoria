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
