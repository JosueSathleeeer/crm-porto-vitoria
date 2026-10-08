/* ================= NUTRIÇÃO: 4 DOBRAS + AVALIAÇÕES ENERGÉTICAS ================= */
// composição corporal só com tricipital, subescapular, suprailíaca e abdominal (Faulkner); sem circunferências
['peitoral', 'axilar', 'coxa', 'panturrilha'].forEach(k => delete DOBRAS[k]);
Object.keys(CIRC).forEach(k => delete CIRC[k]);
['slaughter', 'jp3', 'jp7'].forEach(k => delete PROT[k]);
PROT.faulkner.n = 'Faulkner · 4 dobras (tricipital, subescapular, suprailíaca e abdominal)';

/* ---------- necessidades energéticas: avaliações salvas ---------- */
EXTRA_COLS.push('energia'); S.energia = [];
const FORMULAS = { cunningham: 'Cunningham (massa magra)', schofield: 'Schofield (peso e idade)', harris: 'Harris-Benedict (peso, estatura e idade)', manual: 'Gasto em repouso informado (calorimetria)' };
const enDe = id => (S.energia || []).filter(r => r.atletaId === id).sort((a, b) => a.data.localeCompare(b.data));
function enCalc(r) {
  const a = atl(r.atletaId), ida = idadeEm(a?.nascimento, r.data), p = +r.peso || 0, h = (+r.altura || 0) * 100, g = r.gordura != null && r.gordura !== '' ? +r.gordura : null, mm = g != null && p ? p * (1 - g / 100) : null;
  let tmb = null; if (r.formula === 'cunningham' && mm) tmb = 500 + 22 * mm; else if (r.formula === 'harris' && p && h) tmb = 66.5 + 13.75 * p + 5.003 * h - 6.755 * ida; else if (r.formula === 'manual') tmb = +r.tmbManual || null; else if (p) tmb = ida <= 18 ? 17.686 * p + 658.2 : 15.057 * p + 692.2;
  const get = tmb ? tmb * (+r.fa || 1.6) + (+r.extra || 0) : null, ptn = (+r.ptn || 1.6) * p, lip = get ? (+r.lipPct || 28) / 100 * get / 9 : null, cho = get ? Math.max(0, (get - ptn * 4 - lip * 9) / 4) : null;
  return { ida, mm, tmb, get, ptn, lip, cho, choKg: cho && p ? cho / p : null, agua: p * (+r.agua || 40) / 1000 };
}
const _energia = energia;
energia = function (a, tipo) {
  const r = enDe(a.id).slice(-1)[0];
  if (!r) { const e = _energia(a, tipo); return e ? { ...e, origem: 'est' } : null; }
  const c = enCalc({ ...r, fa: tipo ? DIAS[tipo][1] * ((+r.fa || 1.75) / 1.75) : r.fa });
  return { peso: +r.peso, mm: c.mm, tmb: c.tmb, met: FORMULAS[r.formula]?.split(' (')[0] || 'Avaliação', get: c.get, cho: c.cho, ptn: c.ptn, lip: c.lip, agua: c.agua, origem: 'aval', rec: r };
};
function formEnergia(r = {}, aid) {
  const ats = [...S.atletas].sort((a, b) => a.nome.localeCompare(b.nome)), sel = r.atletaId || aid || UI.nutAtl || '';
  const base = id => { const a = atl(id), v = avsDe(id).slice(-1)[0], c = v ? calcAv(v) : null; return { peso: c?.peso || a?.peso || '', altura: v?.altura || a?.altura || '', gordura: c?.g ?? a?.gordura ?? '' }; };
  const b0 = r.id ? r : { ...base(sel), formula: 'cunningham', fa: 1.75, extra: 0, ptn: 1.6, lipPct: 28, agua: 40 };
  const profs = (S.config.profissionais || []).map(p => p.nome).filter(Boolean);
  openModal(mh(r.id ? 'Editar avaliação energética' : 'Nova avaliação de necessidade energética') + `<form id="fEn" novalidate><div class="mb"><div class="form">
    <div class="f s2"><label for="enA">Atleta *</label><select id="enA" name="atletaId"><option value="">Selecione</option>${ats.map(a => `<option value="${a.id}" ${a.id === sel ? 'selected' : ''}>${esc(a.nome)} · ${esc(a.subcategoria || a.categoria)}</option>`).join('')}</select></div>
    <div class="f"><label for="enD">Data *</label><input id="enD" name="data" type="date" value="${esc(r.data || todayISO())}" max="${todayISO()}"></div>
    <div class="f"><label for="enR">Nutricionista</label><select id="enR" name="responsavel"><option value="">—</option>${opts(profs, r.responsavel)}</select></div>
    <div class="f"><label for="enP">Peso (kg) *</label><input id="enP" name="peso" inputmode="decimal" value="${esc(b0.peso ?? '')}"></div>
    <div class="f"><label for="enH">Estatura (m)</label><input id="enH" name="altura" inputmode="decimal" value="${esc(b0.altura ?? '')}"></div>
    <div class="f"><label for="enG">% gordura</label><input id="enG" name="gordura" inputmode="decimal" value="${esc(b0.gordura ?? '')}"></div>
    <div class="f"><span>Massa magra</span><b id="enMM" style="font-family:var(--fc);font-size:20px">—</b></div>
    <div class="f s2"><label for="enF">Fórmula do gasto em repouso</label><select id="enF" name="formula">${Object.entries(FORMULAS).map(([k, n]) => `<option value="${k}" ${b0.formula === k ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
    <div class="f" id="enTmbBox"><label for="enT">Gasto em repouso (kcal)</label><input id="enT" name="tmbManual" inputmode="decimal" value="${esc(r.tmbManual ?? '')}"></div>
    <div class="f"><label for="enFa">Fator de atividade</label><select id="enFa" name="fa">${[1.4, 1.5, 1.6, 1.7, 1.75, 1.8, 1.9, 1.95, 2.0, 2.2].map(v => `<option value="${v}" ${+b0.fa === v ? 'selected' : ''}>${nf(v, 2)}${v === 1.4 ? ' · descanso' : v === 1.6 ? ' · treino leve' : v === 1.75 ? ' · treino moderado' : v === 1.95 ? ' · treino intenso / jogo' : ''}</option>`).join('')}</select></div>
    <div class="f"><label for="enX">Gasto extra (kcal/dia)</label><input id="enX" name="extra" inputmode="decimal" value="${esc(b0.extra ?? 0)}"></div>
    <div class="f"><label for="enPt">Proteína (g/kg)</label><input id="enPt" name="ptn" inputmode="decimal" value="${esc(b0.ptn ?? 1.6)}"></div>
    <div class="f"><label for="enL">Gordura (% das kcal)</label><input id="enL" name="lipPct" inputmode="decimal" value="${esc(b0.lipPct ?? 28)}"></div>
    <div class="f"><label for="enAg">Água (ml/kg)</label><input id="enAg" name="agua" inputmode="decimal" value="${esc(b0.agua ?? 40)}"></div>
    <div class="f s4" style="grid-column:1/-1"><label for="enO">Observações / conduta</label><textarea id="enO" name="obs">${esc(r.obs || '')}</textarea></div>
  </div><div class="avres" id="enRes"></div></div><div class="mf"><span class="msg" id="enErr"></span>${r.id ? `<button type="button" class="btn danger" id="enDel" style="margin-right:auto">${IC.trash} Excluir</button>` : ''}<button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} ${r.id ? 'Salvar alterações' : 'Salvar avaliação'}</button></div></form>`, true);
  const fm = $('#fEn'); const num = n => { const v = numBR(fm[n].value); return isNaN(v) ? null : v; };
  const read = () => ({ ...r, atletaId: fm.atletaId.value, data: fm.data.value, responsavel: fm.responsavel.value, peso: num('peso'), altura: num('altura'), gordura: num('gordura'), formula: fm.formula.value, tmbManual: num('tmbManual'), fa: +fm.fa.value, extra: num('extra') || 0, ptn: num('ptn') || 1.6, lipPct: num('lipPct') || 28, agua: num('agua') || 40, obs: fm.obs.value.trim() });
  const sync = () => { $('#enTmbBox').style.display = fm.formula.value === 'manual' ? '' : 'none'; const o = read(); if (!o.atletaId || !o.peso) { $('#enRes').innerHTML = ''; $('#enMM').textContent = '—'; return; } const c = enCalc(o); $('#enMM').textContent = c.mm ? nf(c.mm, 1) + ' kg' : '—'; $('#enRes').innerHTML = `<div><span>Gasto em repouso</span><b>${c.tmb ? Math.round(c.tmb) : '—'} kcal</b></div><div><span>Gasto total / dia</span><b>${c.get ? Math.round(c.get) : '—'} kcal</b></div><div><span>Carboidrato</span><b>${c.cho ? Math.round(c.cho) + ' g' : '—'}</b><small>${c.choKg ? nf(c.choKg, 1) + ' g/kg' : ''}</small></div><div><span>Proteína</span><b>${Math.round(c.ptn)} g</b></div><div><span>Gordura</span><b>${c.lip ? Math.round(c.lip) + ' g' : '—'}</b></div><div><span>Água</span><b>${nf(c.agua, 1)} L</b></div>`; };
  fm.addEventListener('input', sync); fm.addEventListener('change', e => { if (e.target.name === 'atletaId' && !r.id) { const b = base(e.target.value); fm.peso.value = b.peso || ''; fm.altura.value = b.altura || ''; fm.gordura.value = b.gordura ?? ''; } sync(); }); sync();
  if (r.id) $('#enDel').onclick = () => confirmar('Excluir esta avaliação energética?', () => { remove('energia', r.id); toast('Avaliação excluída'); });
  fm.onsubmit = e => { e.preventDefault(); const o = read(); if (!o.atletaId) return $('#enErr').textContent = 'Selecione o atleta.'; if (!o.peso) return $('#enErr').textContent = 'Informe o peso.'; if (o.formula === 'cunningham' && o.gordura == null) return $('#enErr').textContent = 'Cunningham precisa do % de gordura.'; if (o.formula === 'manual' && !o.tmbManual) return $('#enErr').textContent = 'Informe o gasto em repouso medido.'; const c = enCalc(o); o.tmb = Math.round(c.tmb || 0); o.get = Math.round(c.get || 0); o.id = r.id || uid('en'); save('energia', o); UI.nutAtl = o.atletaId; closeModal(); toast(r.id ? 'Avaliação atualizada' : 'Avaliação salva'); };
}
const _fNutEnergia = fNutEnergia;
fNutEnergia = function () {
  let h = _fNutEnergia(); const a = atl(UI.nutAtl), L = a ? enDe(a.id) : [];
  h = h.replace('<div class="row r21" style="align-items:start">', `<div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="btn pri" data-act="en-nova">${IC.plus} Nova avaliação energética</button>${a ? `<button class="btn" data-act="en-nova" data-id="${a.id}">${IC.plus} Nova para ${esc(a.apelido || a.nome)}</button>` : ''}<span class="muted" style="font-size:12.5px">Atletas com avaliação salva usam os valores da nutricionista (selo <b>Avaliação</b>); os demais aparecem como <b>Estimativa</b> automática.</span></div></div><div class="row r21" style="align-items:start">`);
  h = h.replace(/<tr class="click ([^"]*)" data-ener="([^"]+)">([\s\S]*?)<\/td>/g, (m, cl, id, td) => { const e = enDe(id).slice(-1)[0]; return `<tr class="click ${cl}" data-ener="${id}">${td}${e ? ` <span class="ensel a">Avaliação ${fmtDs(e.data)}</span>` : ' <span class="ensel">Estimativa</span>'}</td>`; });
  const hist = a ? panel(`Avaliações energéticas · ${esc(a.apelido || a.nome)}`, L.length ? `<table class="t"><thead><tr><th>Data</th><th>Peso</th><th>% G</th><th>Fórmula</th><th>FA</th><th>Repouso</th><th>Gasto total</th><th>CHO</th><th>PTN</th><th>LIP</th><th></th></tr></thead><tbody>${[...L].reverse().map(r => { const c = enCalc(r); return `<tr><td>${fmtD(r.data)}</td><td>${nfx(r.peso, 1)}</td><td>${nfx(r.gordura, 1)}</td><td>${esc((FORMULAS[r.formula] || '').split(' (')[0])}</td><td>${nf(r.fa, 2)}</td><td>${Math.round(c.tmb || 0)}</td><td><b>${Math.round(c.get || 0)}</b></td><td>${Math.round(c.cho || 0)} g</td><td>${Math.round(c.ptn)} g</td><td>${Math.round(c.lip || 0)} g</td><td style="white-space:nowrap"><button class="icon-btn" data-act="en-edit" data-id="${r.id}" aria-label="Editar">${IC.edit}</button><button class="icon-btn" data-act="en-del" data-id="${r.id}" aria-label="Excluir" style="color:var(--red)">${IC.trash}</button></td></tr>`; }).join('')}</tbody></table>` : miniEmpty('Sem avaliação salva', 'Os valores atuais são estimativa automática. Clique em “Nova avaliação energética”.'), { np: !!L.length }) : '';
  return h + '<div style="height:14px"></div>' + hist;
};
document.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'en-nova') formEnergia({}, t.dataset.id); if (t.dataset.act === 'en-edit') formEnergia((S.energia || []).find(r => r.id === t.dataset.id)); if (t.dataset.act === 'en-del') confirmar('Excluir esta avaliação energética?', () => { remove('energia', t.dataset.id); toast('Avaliação excluída'); }); });
