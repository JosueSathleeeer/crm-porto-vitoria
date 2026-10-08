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
document.addEventListener('click', e => {
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
document.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'pse-editar') editarPseDia(); if (t.dataset.act === 'pse-edit1') { e.stopPropagation(); editarPseDia(t.dataset.id); } }, true);
