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

document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'h-chart') { UI.hChart = t.dataset.v; render(); }
  if (t.dataset.act === 'h-pos') { UI.hPos = !t.dataset.v || UI.hPos === t.dataset.v ? null : t.dataset.v; render(); }
  if (t.dataset.act === 'h-test') { const k = t.dataset.v; if (UI.hTests.has(k)) { if (UI.hTests.size > 1) UI.hTests.delete(k); } else UI.hTests.add(k); render(); }
});
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.islice[data-act]')) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
