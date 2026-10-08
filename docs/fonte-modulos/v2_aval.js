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
document.addEventListener('click', e => {
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
document.addEventListener('change', e => {
  const t = e.target;
  if (t.name === 'avTest') { UI.avTest = t.value; render(); }
  if (t.id === 'avAtlSel') { UI.avAtl = t.value; render(); }
  if (t.id === 'matAtlSel') { UI.matAtl = t.value; render(); }
});
