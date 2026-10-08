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

document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'be-dia') { UI.monDia = t.dataset.d > todayISO() ? todayISO() : t.dataset.d; render(); }
  if (t.dataset.act === 'pse-dia') { UI.pseDia = t.dataset.d > todayISO() ? todayISO() : t.dataset.d; render(); }
  if (t.dataset.act === 'be-lancar') formBe();
  if (t.dataset.act === 'pse-lancar') formPse();
});
document.addEventListener('change', e => { if (e.target.id === 'be-diaIn' && e.target.value) { UI.monDia = e.target.value; render(); } if (e.target.id === 'pse-diaIn' && e.target.value) { UI.pseDia = e.target.value; render(); } });
