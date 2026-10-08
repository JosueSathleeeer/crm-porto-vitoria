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
document.addEventListener('click', e => { const t = e.target.closest('[data-act="cmp-m"]'); if (t) { UI.cmpM = t.dataset.v; render(); } });
