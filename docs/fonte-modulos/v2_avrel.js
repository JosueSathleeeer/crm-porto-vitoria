/* ================= AVALIAÇÃO FÍSICA · RELATÓRIOS EM PDF ================= */
AV_TABS.splice(4, 0, ['av-rel', 'Relatórios em PDF']); TITLES['av-rel'] = ['Avaliação física', 'Relatórios em PDF']; AV_TITLE['av-rel'] = 'RELATÓRIOS DE AVALIAÇÃO FÍSICA';
UI.ar = { capa: true, painel: true, tabela: true, testes: new Set(Object.keys(TESTS)), mat: true, ind: new Set(), titulo: 'AVALIAÇÃO FÍSICA', sub: '', profs: null };
function arCfg() { const c = S.config.avRel || {}; return { titulo: c.titulo || 'AVALIAÇÃO FÍSICA', sub: c.sub || '', profs: c.profs || (S.config.profissionais || []).filter(p => p.nome).map(p => `${p.nome}${p.funcao ? ' · ' + p.funcao : ''}`).join('\n') }; }
function capaAv() {
  const c = arCfg(), ats = atletasCat(), ds = [...new Set(tsCat().map(t => t.data))].sort();
  return pageWrap(`<div class="avcapa"><div class="avc-l"><img src="${LOGO}" alt=""><small>Porto Vitória · Departamento de Futebol de Base</small><h1>${esc(c.titulo)}</h1><h2>${esc(c.sub || 'Relatório de testes físicos · ' + catLabel())}</h2><div class="avc-k"><div><b>${ats.filter(a => tsDe(a.id).some(t => naTemporada(t.data))).length}</b><span>atletas avaliados</span></div><div><b>${ds.length}</b><span>sessões de testes</span></div><div><b>${Object.keys(TESTS).length}</b><span>testes na bateria</span></div></div><p>${ds.length ? `Período: ${fmtD(ds[0])} a ${fmtD(ds[ds.length - 1])}` : ''}</p><div class="avc-t">${Object.values(TESTS).map(t => `<span>${t.n}</span>`).join('')}<span>Maturação</span></div></div><div class="avc-r"><b>${anoLabel() === 'TODAS' ? todayISO().slice(0, 4) : anoLabel()}</b><div class="avc-p">${esc(c.profs).split('\n').filter(Boolean).map(l => `<span>${esc(l)}</span>`).join('')}</div><small>Emitido em ${fmtD(todayISO())}</small></div></div>`);
}
function arHead(t, sub) { return header({ title: t, sub: 'AVALIAÇÃO FÍSICA · PREPARAÇÃO FÍSICA', pill: sub || catLabel().toUpperCase(), items: hdrItems() }) + '<div style="height:14px"></div>'; }
function tabelaGeral(lista) {
  return `<table class="t avtg"><thead><tr><th class="l">Atleta</th><th>Pos.</th><th>Idade</th>${Object.values(TESTS).map(t => `<th>${t.n.replace('Velocidade ', '').replace('Teste ', '')}<br><small>(${t.u})</small></th>`).join('')}<th>Maturação</th><th>Última</th></tr></thead><tbody>${lista.map(a => { const mc = (() => { const m = matDe(a.id).slice(-1)[0]; return m ? calcMat(m) : null; })(); return `<tr><td class="l"><b>${esc(a.apelido || a.nome)}</b></td><td>${ptag(a.posicao)}</td><td>${nf(idadeDec(a.nascimento) || 0, 1)}</td>${Object.keys(TESTS).map(k => { const t = ultimoTeste(a.id, k), v = t ? tval(t, k) : null, bi = bandIdx(k, v); return `<td><b style="color:${bi != null ? BCOL[bi] : 'inherit'}">${fmtT(k, v)}</b>${v != null ? `<small class="btx" style="color:${BCOL[bi]}">${BANDS[bi]}</small>` : ''}</td>`; }).join('')}<td>${mc && mc.mo != null ? `${mc.mo >= 0 ? '+' : ''}${nf(mc.mo, 1)}<small class="btx" style="color:${MSTAT[mc.st][1]}">${MSTAT[mc.st][0]}</small>` : '—'}</td><td>${tsDe(a.id).length ? fmtDs(tsDe(a.id).slice(-1)[0].data) : '—'}</td></tr>`; }).join('')}</tbody></table>`;
}
// relatório individual do atleta (uma folha por atleta)
function relIndAv(a) {
  const ts = tsDe(a.id), mt = matDe(a.id).slice(-1)[0], mc = mt ? calcMat(mt) : null, tm = mc && mc.mo != null ? timing(mc) : null, av = avsDe(a.id).slice(-1)[0], ca = av ? calcAv(av) : null;
  const card = k => { const T = TESTS[k], t = ultimoTeste(a.id, k), v = t ? tval(t, k) : null, p = t ? ultimoTeste(a.id, k, t.data) : null, pv = p ? tval(p, k) : null, g = grupoStats(k), pc = pctl(k, v, g), bi = bandIdx(k, v);
    const hist = ts.filter(x => tval(x, k) != null); const extra = k === 't505' && t ? `<div class="ric-x">D ${fmtT(k, lado505(t, 'd'))} · E ${fmtT(k, lado505(t, 'e'))}</div>` : (k === 'cmj' || k === 'v10' || k === 'v30') && t && t[k + '_1'] ? `<div class="ric-x">${[1, 2, 3].map(i => t[k + '_' + i] != null ? nf(t[k + '_' + i], T.d) : '—').join(' · ')}</div>` : '';
    return `<div class="ric" style="--bc:${bi != null ? BCOL[bi] : '#9aa5a0'}"><div class="ric-h">${IC[T.ic]}<b>${T.n}</b><span>${T.u}</span></div><div class="ric-v">${fmtT(k, v)}</div>${extra}<div class="ric-b">${bi != null ? `<span class="bchip2 ${BCLS[bi]}">${BANDS[bi]}</span>` : '<span class="muted">sem teste</span>'}</div><div class="ric-m"><span>Anterior <b>${fmtT(k, pv)}</b></span><span>${varTag(k, pv, v)}</span><span>Percentil <b>${pc ?? '—'}</b></span></div>${hist.length > 1 ? `<div class="ric-g">${lineChart(hist.map(x => fmtDs(x.data)), hist.map(x => Math.round(tval(x, k) * 100) / 100), { w: 300, h: 110, fit: true })}</div>` : '<div class="ric-g muted" style="font-size:11px;text-align:center;padding:20px 0">Uma avaliação</div>'}</div>`; };
  const perf = Object.entries(TESTS).map(([k, T]) => { const t = ultimoTeste(a.id, k); const pc = t ? pctl(k, tval(t, k), grupoStats(k)) : null; return `<div class="rip"><span>${T.n.replace('Velocidade ', 'Vel. ')}</span><div><i style="width:${pc ?? 0}%;background:${pc == null ? '#cfd8d3' : pc >= 67 ? '#1b8a4a' : pc >= 34 ? '#f6c21c' : '#e0342b'}"></i></div><b>${pc ?? '—'}</b></div>`; }).join('');
  const destaques = Object.entries(TESTS).map(([k, T]) => { const t = ultimoTeste(a.id, k); const pc = t ? pctl(k, tval(t, k), grupoStats(k)) : null; return { n: T.n, pc }; }).filter(x => x.pc != null);
  const fortes = destaques.filter(x => x.pc >= 67).map(x => x.n), fracos = destaques.filter(x => x.pc <= 33).map(x => x.n);
  return pageWrap(`<div class="rin">
    <div class="rin-h"><div class="rin-f">${a.foto ? `<img src="${esc(a.foto)}" alt="">` : `<span class="sil">${IC.shirt}</span>`}<img class="rin-e" src="${LOGO}" alt=""></div>
      <div class="rin-n"><small>Relatório individual · Avaliação física</small><h2>${esc(a.nome)}${a.numero ? ` <span>#${esc(a.numero)}</span>` : ''}</h2><p>${esc(a.posDetalhe || POSN[a.posicao] || '')} · ${esc(a.subcategoria || a.categoria)} · ${idade(a.nascimento) || '—'} anos · pé ${esc((a.pe || '—').toLowerCase())}</p>
        <div class="rin-k"><div><small>Estatura</small><b>${mc?.H ? nf(mc.H, 1) + ' cm' : a.altura ? nf(+a.altura * 100, 0) + ' cm' : '—'}</b></div><div><small>Peso</small><b>${ca ? nf(ca.peso, 1) : a.peso ? nf(a.peso, 1) : '—'} kg</b></div><div><small>% gordura</small><b>${ca && ca.g != null ? nf(ca.g, 1) + '%' : '—'}</b></div><div><small>Maturação</small><b>${tm ? `${tm.t[0]} · ${fase(mc.st)}` : '—'}</b></div><div><small>Idade biológica</small><b>${tm ? nf(tm.bio, 1) : '—'}</b></div><div><small>Avaliações</small><b>${ts.length}</b></div></div></div>
      <div class="rin-pf"><h5>Perfil no grupo (percentil)</h5>${perf}</div></div>
    <div class="rin-c">${Object.keys(TESTS).map(card).join('')}</div>
    <div class="rin-s"><div><h5>Pontos fortes</h5><p>${fortes.length ? fortes.join(', ') : 'Sem destaques acima do percentil 67.'}</p></div><div><h5>A desenvolver</h5><p>${fracos.length ? fracos.join(', ') : 'Nenhum teste abaixo do percentil 33.'}</p></div><div><h5>Maturação</h5><p>${tm ? `Offset ${mc.mo >= 0 ? '+' : ''}${nf(mc.mo, 2)} ano(s) · idade do pico ${nf(mc.aphv, 1)} · ${tm.t[0].toLowerCase()} em relação à idade cronológica.` : 'Sem medição maturacional.'}</p></div></div>
  </div>`);
}
function paginasAv(opt) {
  const ats = atletasCat().filter(a => tsDe(a.id).length).sort((x, y) => POS.indexOf(x.posicao) - POS.indexOf(y.posicao) || x.nome.localeCompare(y.nome)), P = [];
  const v0 = S.view; PRINT = true;
  try {
    if (opt.capa) P.push(capaAv());
    if (opt.painel) { S.view = 'av-dash'; P.push(pageWrap(arHead('PAINEL DE AVALIAÇÃO FÍSICA') + fAvDash())); }
    if (opt.tabela) for (let i = 0; i < ats.length; i += 18) P.push(pageWrap(arHead('RESULTADOS GERAIS', ats.length > 18 ? `ATLETAS ${i + 1}–${Math.min(ats.length, i + 18)}` : '') + `<div class="panel"><div class="pb np">${tabelaGeral(ats.slice(i, i + 18))}</div></div>`));
    [...opt.testes].forEach(k => { const r = 'av-t-' + k; S.view = r; P.push(pageWrap(arHead(AV_TITLE[r]) + fTeste(k))); });
    if (opt.mat) { S.view = 'mat-dash'; P.push(pageWrap(arHead('MATURAÇÃO BIOLÓGICA') + fMatDash())); }
    [...opt.ind].forEach(id => { const a = atl(id); if (a) P.push(relIndAv(a)); });
  } finally { PRINT = false; S.view = v0; }
  return P;
}
function fAvRel() {
  const o = UI.ar, c = arCfg(), ats = atletasCat().filter(a => tsDe(a.id).length).sort((x, y) => x.nome.localeCompare(y.nome));
  const nT = Math.ceil(ats.length / 18) || 0, nPag = (o.capa ? 1 : 0) + (o.painel ? 1 : 0) + (o.tabela ? nT : 0) + o.testes.size + (o.mat ? 1 : 0) + o.ind.size;
  const ck = (k, t, d, on) => `<label class="arck"><input type="checkbox" data-ar="${k}" ${on ? 'checked' : ''}><span><b>${t}</b><small>${d}</small></span></label>`;
  return `<div class="row r21" style="align-items:start">
    <div class="panel"><div class="ph">Montar o relatório<span class="r">${nPag} página(s) 16:9</span></div><div class="pb">
      <h5 class="arh">Relatório geral</h5>
      ${ck('capa', 'Capa', 'Título, categoria, período, testes da bateria e profissionais', o.capa)}
      ${ck('painel', 'Painel geral', 'Indicadores, melhores do elenco, médias da equipe e por posição', o.painel)}
      ${ck('tabela', 'Resultados gerais', `Todos os atletas com todos os testes e faixas (${nT} página(s))`, o.tabela)}
      <div class="arts">${Object.entries(TESTS).map(([k, T]) => `<label><input type="checkbox" data-art="${k}" ${o.testes.has(k) ? 'checked' : ''}>${T.n}</label>`).join('')}</div>
      ${ck('mat', 'Maturação', 'Status maturacional, distribuição e bio-banding', o.mat)}
      <h5 class="arh">Relatório individual <small>(uma folha por atleta)</small></h5>
      <div class="arind"><label class="arall"><input type="checkbox" id="arAll" ${ats.length && ats.every(a => o.ind.has(a.id)) ? 'checked' : ''}> Selecionar todos (${ats.length})</label>${ats.map(a => `<label class="${o.ind.has(a.id) ? 'on' : ''}"><input type="checkbox" data-ari="${a.id}" ${o.ind.has(a.id) ? 'checked' : ''}>${fotoBox(a, 'mini')}<span><b>${esc(a.apelido || a.nome)}</b><small>${esc(a.posicao)} · ${tsDe(a.id).length} aval.</small></span></label>`).join('') || '<span class="muted">Nenhum atleta com testes.</span>'}</div>
      <div class="arbtn"><button class="btn" data-act="ar-go" data-pdf="0" ${nPag ? '' : 'disabled'}>${IC.print} Imprimir</button><button class="btn pri" data-act="ar-go" data-pdf="1" ${nPag ? '' : 'disabled'}>${IC.pdf} Baixar PDF</button>${o.ind.size === 1 && !o.capa && !o.painel && !o.tabela && !o.testes.size && !o.mat ? '' : `<button class="btn sm" data-act="ar-only">Só os individuais</button>`}</div>
    </div></div>
    <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
      <!--RBPREV-->
    </div>
  </div>`;
}
const _vAvalR = vAval;
vAval = function () { if (S.view !== 'av-rel') return _vAvalR(); const h = header({ title: AV_TITLE['av-rel'], sub: 'AVALIAÇÃO FÍSICA · PREPARAÇÃO FÍSICA', items: hdrItems() }); return h + avTabsHTML(S.view) + fAvRel(); };
// botão no relatório de cada atleta e na evolução individual
const _fAvIndR = fAvInd;
fAvInd = function () { return _fAvIndR().replace(`data-t="fis">${IC.user} Abrir ficha</button>`, `data-t="fis">${IC.user} Abrir ficha</button><button class="btn pri" data-act="ar-one" data-id="${UI.avAtl}">${IC.pdf} Relatório individual</button>`); };
document.addEventListener('change', e => {
  const t = e.target, o = UI.ar;
  if (t.dataset.ar) { o[t.dataset.ar] = t.checked; render(); }
  if (t.dataset.art) { t.checked ? o.testes.add(t.dataset.art) : o.testes.delete(t.dataset.art); render(); }
  if (t.dataset.ari) { t.checked ? o.ind.add(t.dataset.ari) : o.ind.delete(t.dataset.ari); render(); }
  if (t.id === 'arAll') { atletasCat().filter(a => tsDe(a.id).length).forEach(a => t.checked ? o.ind.add(a.id) : o.ind.delete(a.id)); render(); }
  if (['arT', 'arS', 'arP'].includes(t.id)) { S.config.avRel = { titulo: $('#arT').value.trim(), sub: $('#arS').value.trim(), profs: $('#arP').value }; putConfig(); toast('Capa salva'); }
});
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'ar-go') { const p = paginasAv(UI.ar); if (!p.length) return; if (t.dataset.pdf === '1') gerarPDF(p, 'avaliacao-fisica'); else imprimir(p); }
  if (t.dataset.act === 'ar-only') { Object.assign(UI.ar, { capa: false, painel: false, tabela: false, mat: false }); UI.ar.testes.clear(); render(); }
  if (t.dataset.act === 'ar-one') { const a = atl(t.dataset.id); if (!a) return; openModal(mh('Relatório individual · ' + esc(a.nome)) + `<div class="mb"><p style="margin:0">Uma folha 16:9 com foto, dados, todos os testes, histórico, percentis e maturação.</p></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn" data-act="ar-one-go" data-id="${a.id}" data-pdf="0">${IC.print} Imprimir</button><button class="btn pri" data-act="ar-one-go" data-id="${a.id}" data-pdf="1">${IC.pdf} Baixar PDF</button></div>`); }
  if (t.dataset.act === 'ar-one-go') { closeModal(); const p = paginasAv({ capa: false, painel: false, tabela: false, testes: new Set(), mat: false, ind: new Set([t.dataset.id]) }); if (t.dataset.pdf === '1') gerarPDF(p, 'avaliacao-individual'); else imprimir(p); }
});
