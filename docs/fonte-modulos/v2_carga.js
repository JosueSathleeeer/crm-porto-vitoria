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
  const cat = catPl(); const tipo = s.tipo || (jogo ? 'jogo' : 'treino'); const isJ = tipo === 'jogo';
  openModal(mh((s.id ? 'Editar ' : 'Nova ') + (isJ ? 'sessão de jogo' : 'sessão') + ` · ${SEMANA[(new Date((s.data || d) + 'T12:00').getDay() + 6) % 7]} ${fmtD(s.data || d)}`) + `<form id="fSs" novalidate><div class="mb"><div class="form">
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
  $('#fSs').onsubmit = e => { e.preventDefault(); const o = { ...s, id: s.id || uid('ms'), categoria: s.categoria || cat, data: s.data || d, tipo: $('#ssT').value, titulo: $('#ssN').value.trim(), hora: $('#ssH').value, duracao: +$('#ssD').value || 0, pse: $('#ssP').value === '' ? null : +$('#ssP').value, conteudo: $('#ssCo').value.trim() }; if (o.tipo === 'jogo') { o.adversario = $('#ssA').value.trim(); o.mando = $('#ssM').value; o.competicao = $('#ssC').value.trim(); } save('micro', o); closeModal(); toast('Sessão salva'); };
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
document.addEventListener('click', e => {
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
document.addEventListener('change', e => { if (e.target.id === 'wkTitle') { const k = catPl() + '|' + UI.week; S.config.semanas = { ...(S.config.semanas || {}), [k]: e.target.value.trim() }; putConfig(); toast('Nome da semana salvo'); } });
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.mcs[data-act="ms-edit"]')) { e.preventDefault(); formSessao((S.micro || []).find(s => s.id === e.target.dataset.id)); } });
