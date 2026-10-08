/* ================= RELATÓRIOS EM PDF COM PRÉVIA (todas as áreas) + CAPA CONFIGURÁVEL ================= */
// Avaliação física: "Relatórios em PDF" vai para depois de Maturação
{ const i = AV_TABS.findIndex(x => x[0] === 'av-rel'); if (i >= 0) { const [t] = AV_TABS.splice(i, 1); AV_TABS.push(t); } }
DM_TABS.push(['dm-rel', 'Relatórios em PDF']); TITLES['dm-rel'] = ['Fisio / DM', 'Relatórios em PDF']; DM_TITLE['dm-rel'] = 'RELATÓRIOS EM PDF';
NUT_TABS.push(['nut-rel', 'Relatórios em PDF']); TITLES['nut-rel'] = ['Nutrição', 'Relatórios em PDF']; NUT_TITLE['nut-rel'] = 'RELATÓRIOS EM PDF';
{ const i = MON_TABS.findIndex(x => x[0] === 'mon-pse-rel'); if (i >= 0) MON_TABS[i][1] = 'Relatórios em PDF'; TITLES['mon-pse-rel'] = ['Monitoramento', 'Relatórios em PDF']; }

/* ---------- capa (editável em Configurações → Geral) ---------- */
const CAPA_DEF = { depto: 'DEPARTAMENTO DE PERFORMANCE DE BASE', responsavel: 'IGOR SATHLER - FISIOLOGISTA', slogan: 'MAIS QUE UM CLUBE, UMA IDENTIDADE.', titulos: { dm: 'DEPARTAMENTO MÉDICO', nut: 'AVALIAÇÃO NUTRICIONAL', av: 'AVALIAÇÃO FÍSICA', mat: 'AVALIAÇÃO MATURACIONAL', mon: 'MONITORAMENTO DE CARGA' } };
function capaCfg() { const c = S.config.capa || {}; const p0 = (S.config.profissionais || []).find(p => p.nome); return { depto: c.depto || CAPA_DEF.depto, responsavel: c.responsavel || CAPA_DEF.responsavel, slogan: c.slogan || CAPA_DEF.slogan, titulos: { ...CAPA_DEF.titulos, ...(c.titulos || {}) } }; }
function capaGeral(mod, extra) {
  const c = capaCfg(), ano = anoLabel() === 'TODAS' ? todayISO().slice(0, 4) : String(anoLabel());
  return `<div class="sheet"><div class="pdfpage fixed rxpg"><div class="cvx"><small>${esc(c.depto)}</small><div class="cvm"><h1>${esc(c.titulos[mod] || mod)}</h1><b>${esc(c.responsavel.toUpperCase())}</b><span>${esc(extra || catLabel().toUpperCase().replace(/SUB\s/g, 'SUB-'))}</span></div><img src="${LOGO}" alt=""><em>${ano.slice(0, 2)}<br>${ano.slice(2, 4)}</em><i>${esc(c.slogan)}</i></div></div></div>`;
}
capaAv = function () { return capaGeral('av'); };

// maturação: páginas em lista (para a prévia) e capa com o título editável
function relMatPages(cat, f) { const tmp = document.createElement('div'); tmp.innerHTML = relMatHTML(cat, f); const t = capaCfg().titulos.mat; tmp.querySelectorAll('.mrcapa h1').forEach(h => h.textContent = t); tmp.querySelectorAll('.mrcapa>small').forEach(s => s.textContent = capaCfg().depto); return [...tmp.children].map(e => e.outerHTML); }

/* ---------- componente: seções + prévia ---------- */
UI.rb = {}; UI.rbPages = []; UI.rbFmt = '169';
const RB = {
  dm: { titulo: 'Fisio / DM', secs: [['capa', 'Capa', 'Título, responsável, categoria e ano', () => [capaGeral('dm')]], ['dash', 'Dashboard do DM', 'Quem está no DM, indicadores e mapa da temporada', () => [pageWrap(renderAs('dashboard'))]], ['visao', 'Visão geral', 'Evolução, regiões, status do elenco', () => [pageWrap(renderAs('dm-visao'))]], ['les', 'Atletas no DM', 'Lista com previsão de retorno', () => [pageWrap(pLesionados())]], ['reg', 'Regiões', 'Mapa de calor e ranking de regiões', () => [pageWrap(renderAs('dm-regioes'))]], ['tempo', 'Tempo de afastamento', 'Dias fora por lesão e atleta', () => [pageWrap(renderAs('dm-tempo'))]], ['comp', 'Comparativo', 'Entre categorias e temporadas', () => [pageWrap(renderAs('dm-comparativo'))]]], ind: ['Relatório individual (DM)', a => pIndividual(a), () => atletasCat().filter(a => S.lesoes.some(l => l.atletaId === a.id))] },
  nut: { titulo: 'Nutrição', secs: [['capa', 'Capa', 'Título, responsável, categoria e ano', () => [capaGeral('nut')]], ['dash', 'Dashboard', 'Faixas de gordura, médias e fora da faixa', () => [pageWrap(renderAs('nut-dash'))]], ['comp', 'Composição corporal', 'Última avaliação de cada atleta', () => [pageWrap(renderAs('nut-comp'))]], ['cmp', 'Comparativo', 'Categorias, posições e evolução', () => [pageWrap(renderAs('nut-comparativo'))]], ['hid', 'Hidratação', 'Sessões, perda de peso e sudorese', () => [pageWrap(renderAs('nut-hidra'))]], ['ener', 'Necessidades energéticas', 'Calorias, macronutrientes e estratégia de jogo', () => [pageWrap(renderAs('nut-energia'))]]], ind: ['Relatório individual nutricional', a => pNutInd(a), () => atletasCat().filter(a => avsDe(a.id).length)] },
  mon: { titulo: 'Monitoramento', secs: [['capa', 'Capa', 'Título, responsável, categoria e ano', () => [capaGeral('mon')]], ['be', 'Bem-estar · relatório do dia', `Dia ${fmtD(UI.monDia)} · ${UI.bePorPag || 20} atletas por folha`, () => beRelPaginas().map(h => `<div class="sheet"><div class="pdfpage fixed bepg"><div class="report">${h}</div></div></div>`)], ['pdia', 'PSE · report diário', `Dia ${fmtD(UI.pseDia)}`, () => repDia()], ['psem', 'PSE · report semanal', `Semana de ${fmtD(UI.week || segunda(todayISO()))}`, () => repSem()], ['micro', 'Microciclo da semana', 'Calendário com programado x realizado', () => repMicro()]] }
};
function rbState(mod) { if (!UI.rb[mod]) UI.rb[mod] = { sel: new Set(RB[mod].secs.map(s => s[0])), ind: new Set() }; return UI.rb[mod]; }
function rbPages(mod) { const st = rbState(mod), M = RB[mod], v0 = S.view, out = []; PRINT = true; try { M.secs.forEach(([k, , , fn]) => { if (st.sel.has(k)) { try { out.push(...fn()); } catch (e) { console.warn(e); } } }); if (M.ind) [...st.ind].forEach(id => { const a = atl(id); if (a) { try { out.push(...M.ind[1](a)); } catch (e) { } } }); } finally { PRINT = false; S.view = v0; } return out; }
function rbPreview(pages, a4) { UI.rbPages = pages; UI.rbFmt = a4 ? 'a4' : '169'; if (!pages.length) return miniEmpty('Nada selecionado', 'Marque ao menos uma parte do relatório.'); const N = 24; return `<div class="rbgrid">${pages.slice(0, N).map((p, i) => `<div class="rbthumb ${a4 ? 'a4' : ''}" data-act="rb-zoom" data-i="${i}" role="button" tabindex="0" aria-label="Ver página ${i + 1}"><div class="rbsc">${p}</div><span>${i + 1}</span></div>`).join('')}</div>${pages.length > N ? `<p class="muted" style="font-size:12px;margin:8px 0 0">Mostrando ${N} de ${pages.length} páginas.</p>` : ''}`; }
function rbUI(mod) {
  const st = rbState(mod), M = RB[mod], pages = rbPages(mod), pool = M.ind ? M.ind[2]().sort((a, b) => a.nome.localeCompare(b.nome)) : [];
  return `<div class="row r12" style="align-items:start">
    <div class="panel"><div class="ph">Montar o relatório<span class="r">${pages.length} folha(s) 16:9</span></div><div class="pb">
      ${M.secs.map(([k, t, d]) => `<label class="arck"><input type="checkbox" data-rb="${mod}" data-k="${k}" ${st.sel.has(k) ? 'checked' : ''}><span><b>${t}</b><small>${d}</small></span></label>`).join('')}
      ${M.ind ? `<h5 class="arh">${M.ind[0]} <small>(uma ou mais folhas por atleta)</small></h5><div class="arind"><label class="arall"><input type="checkbox" data-rball="${mod}" ${pool.length && pool.every(a => st.ind.has(a.id)) ? 'checked' : ''}> Selecionar todos (${pool.length})</label>${pool.map(a => `<label class="${st.ind.has(a.id) ? 'on' : ''}"><input type="checkbox" data-rbi="${mod}" data-id="${a.id}" ${st.ind.has(a.id) ? 'checked' : ''}>${fotoBox(a, 'mini')}<span><b>${esc(a.apelido || a.nome)}</b><small>${esc(a.posicao)}</small></span></label>`).join('') || '<span class="muted">Nenhum atleta com dados.</span>'}</div>` : ''}
      <div class="arbtn"><button class="btn" data-act="rb-go" data-m="${mod}" data-pdf="0" ${pages.length ? '' : 'disabled'}>${IC.print} Imprimir</button><button class="btn pri" data-act="rb-go" data-m="${mod}" data-pdf="1" ${pages.length ? '' : 'disabled'}>${IC.pdf} Baixar PDF</button><button class="btn sm" data-nav="config-geral">Editar capa</button></div>
    </div></div>
    ${panel(`Prévia · ${pages.length} folha(s) <span class="r" style="font-size:12px">clique numa folha para ampliar</span>`, rbPreview(pages))}
  </div>`;
}
function rbHeader(titulo, sub, tabs) { return header({ title: titulo, sub, items: hdrItems() }) + `<nav class="rtabs">${tabs.map(([k, n]) => `<button data-go="${k}" class="${S.view === k ? 'on' : ''}">${n}</button>`).join('')}</nav>`; }
const _vDMr = vDM; vDM = function () { if (S.view !== 'dm-rel' || PRINT) return _vDMr(); return rbHeader('RELATÓRIOS EM PDF', 'FISIOTERAPIA · DEPARTAMENTO MÉDICO', DM_TABS) + rbUI('dm'); };
const _vNutR = vNut; vNut = function () { if (S.view !== 'nut-rel' || PRINT) return _vNutR(); return rbHeader('RELATÓRIOS EM PDF', 'NUTRIÇÃO ESPORTIVA', NUT_TABS) + rbUI('nut'); };
fPseRel = function () { return rbUI('mon'); };
// avaliação física: prévia das folhas e do relatório de maturação A4
UI.mrPrevCat = null;
const _fAvRelP = fAvRel;
fAvRel = function () {
  const h = _fAvRelP(), pages = paginasAv(UI.ar); const cats = Object.keys(GRUPOS).filter(c => S.atletas.some(a => a.categoria === c && matDe(a.id).length)); const mc = UI.mrPrevCat || (F.categoria !== 'Todas' ? F.categoria : cats[0]);
  const prev = panel(`Prévia do relatório · ${pages.length} folha(s) <span class="r" style="font-size:12px">clique para ampliar</span>`, rbPreview(pages));
  if (!UI.mrF.cat || !cats.includes(UI.mrF.cat)) UI.mrF.cat = mc;
  const mat = cats.length ? panel(`Prévia · relatório de maturação (A4 deitado)`, `<div class="mrprevf">${mrFiltrosHTML(cats)}<button class="btn sm pri" data-act="mr-rel">${IC.pdf} Gerar este relatório</button></div><div data-a4prev="1">${(() => { const p = relMatPages(UI.mrF.cat, UI.mrF); return `<div class="rbgrid">${p.map((x, i) => `<div class="rbthumb a4" data-act="rb-zoom-a4" data-i="${i}" role="button" tabindex="0"><div class="rbsc">${x}</div><span>${i + 1}</span></div>`).join('')}</div>`; })()}</div>`) : '';
  return h.replace('<div class="row r21" style="align-items:start">', '<div class="row r12" style="align-items:start">').replace('<!--RBPREV-->', prev + mat);
};
UI.mrPages = [];
const _relMatPages = relMatPages; relMatPages = function (cat, f) { const p = _relMatPages(cat, f); UI.mrPages = p; return p; };

/* ---------- ampliar uma folha ---------- */
function rbZoom(pages, i, a4) {
  if (!pages[i]) return; openModal(mh(`Página ${i + 1} de ${pages.length}`) + `<div class="mb"><div class="rbzoom ${a4 ? 'a4' : ''}"><div class="rbzs">${pages[i]}</div></div></div><div class="mf"><button class="btn" data-act="${a4 ? 'rb-zoom-a4' : 'rb-zoom'}" data-i="${Math.max(0, i - 1)}" ${i ? '' : 'disabled'}>‹ Anterior</button><span style="flex:1"></span><button class="btn" data-act="close">Fechar</button><button class="btn" data-act="${a4 ? 'rb-zoom-a4' : 'rb-zoom'}" data-i="${Math.min(pages.length - 1, i + 1)}" ${i < pages.length - 1 ? '' : 'disabled'}>Próxima ›</button></div>`, true);
  $('#modal').classList.add('fx'); requestAnimationFrame(() => window.rbFit && window.rbFit());
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'rb-zoom') rbZoom(UI.rbPages, +t.dataset.i, false);
  if (t.dataset.act === 'rb-zoom-a4') rbZoom(UI.mrPages, +t.dataset.i, true);
  if (t.dataset.act === 'rb-go') { const p = rbPages(t.dataset.m); if (!p.length) return; if (t.dataset.pdf === '1') gerarPDF(p, 'relatorio-' + t.dataset.m); else imprimir(p); }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.rb) { const st = rbState(t.dataset.rb); t.checked ? st.sel.add(t.dataset.k) : st.sel.delete(t.dataset.k); render(); }
  if (t.dataset.rbi) { const st = rbState(t.dataset.rbi); t.checked ? st.ind.add(t.dataset.id) : st.ind.delete(t.dataset.id); render(); }
  if (t.dataset.rball) { const m = t.dataset.rball, st = rbState(m); RB[m].ind[2]().forEach(a => t.checked ? st.ind.add(a.id) : st.ind.delete(a.id)); render(); }
  if (t.dataset.mrf && !t.closest('#mrBody')) { UI.mrF[t.dataset.mrf] = t.value; if (t.dataset.mrf === 'cat') UI.mrF.sub = ''; render(); }
});

document.addEventListener('click', e => { const mp = e.target.closest('[data-mrp]'); if (mp && !mp.closest('#mrBody')) { const p = mp.dataset.mrp, s = UI.mrF.poss; if (!p) s.clear(); else s.has(p) ? s.delete(p) : s.add(p); render(); } });
