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
document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'indAtl') { UI.indAtl = t.value; UI.indA = UI.indB = null; render(); }
  if (t.id === 'indA') { UI.indA = t.value; render(); }
  if (t.id === 'indB') { UI.indB = t.value; render(); }
});
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'ind-from-comp') { UI.indAtl = t.dataset.id; UI.indA = UI.indB = null; go('nut-ind'); }
  if (t.dataset.act === 'print-nutind') printMenu('nutind', t.dataset.id);
});
