/* ================= RELATÓRIOS: IMPRIMIR / PDF ================= */
function printMenu(kind = 'pagina', aid) {
  const ats = [...S.atletas].sort((a, b) => a.nome.localeCompare(b.nome));
  const cur = aid || UI.histAtleta || ats[0]?.id;
  const pagLabel = (TITLES[S.view] || ['Página'])[1] || (TITLES[S.view] || ['Página'])[0];
  const opt = (v, t, d) => `<label class="rk"><input type="radio" name="rk" value="${v}" ${kind === v ? 'checked' : ''}><span><b>${t}</b><small>${d}</small></span></label>`;
  openModal(mh('Imprimir / gerar PDF') + `<div class="mb">
    <div class="rk-list">
      ${opt('pagina', 'Esta página', `${esc(pagLabel)} · do jeito que está na tela, com os filtros atuais`)}
      ${opt('geral', 'Relatório geral do DM', 'Visão geral, atletas no DM, regiões, tempo de afastamento e comparativo · ' + esc(catLabel().toLowerCase()) + ' · temporada ' + anoLabel())}
      ${opt('ficha', 'Ficha individual do atleta', 'Dados, disponibilidade, status físico, minutagem, jogos, lesões e avaliações')}
      ${opt('nutind', 'Relatório individual nutricional', 'Evolução da composição corporal entre avaliações, dobras, circunferências e necessidade nutricional')}
      ${opt('individual', 'Relatório individual do atleta (DM)', 'Ficha completa: dados, mapa do corpo, todas as lesões, condutas, evolução e assinatura')}
    </div>
    <div class="f" id="rkAtlBox" style="${['individual', 'nutind', 'ficha'].includes(kind) ? '' : 'display:none'}"><label for="rkAtl">Atleta</label><select id="rkAtl">${ats.map(a => `<option value="${a.id}" ${a.id === cur ? 'selected' : ''}>${esc(a.nome)} · ${esc(a.subcategoria || a.categoria)}</option>`).join('')}</select></div>
    <p class="muted" style="margin:0;font-size:12.5px">Todas as folhas saem no mesmo tamanho, formato 16:9 deitado (13,33 × 7,5 pol), com o conteúdo encaixado na folha inteira e no tema claro. Se a janela de impressão não abrir, use “Baixar PDF”.</p>
  </div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn" data-act="do-print">${IC.print} Imprimir</button><button class="btn pri" data-act="do-pdf">${IC.pdf} Baixar PDF</button></div>`);
  $$('input[name=rk]').forEach(i => i.onchange = () => { if (i.checked) $('#rkAtlBox').style.display = ['individual', 'nutind', 'ficha'].includes(i.value) ? '' : 'none'; });
}

function renderAs(view) { const v0 = S.view; S.view = view; try { const v = { atletas: vAtletas }[view] || (view.startsWith('nut-') ? vNut : vDM); return v(); } finally { S.view = v0; } }
const pageWrap = (html, cls = '') => `<div class="sheet"><div class="pdfpage fixed ${cls}"><div class="report">${html}${footer()}</div></div></div>`;
// folha 16:9 (13,33 × 7,5 pol = 1280 × 720 px): todas as páginas no mesmo tamanho, conteúdo encaixado sem sobras
const SHEET_W = 1280, SHEET_H = 720;
function fitSheet(sheet, useZoom) {
  const pg = sheet.firstElementChild; let w = 1536, h = 0;
  for (const tw of [1536, 1680, 1840, 2000, 2200, 2400]) {
    w = tw; pg.style.width = w + 'px'; pg.style.height = 'auto'; pg.style.transform = 'none'; pg.style.zoom = '';
    h = pg.scrollHeight; if (h <= w * 9 / 16) break;
  }
  const H = Math.max(h, Math.round(w * 9 / 16)); pg.style.height = H + 'px';
  const s = Math.min(SHEET_W / w, SHEET_H / H), dx = (SHEET_W - w * s) / 2, dy = (SHEET_H - H * s) / 2;
  if (useZoom) { sheet.classList.add('zm'); pg.style.zoom = s.toFixed(4); }  // impressão: o zoom reduz o tamanho real, então nada é cortado entre folhas
  else pg.style.transform = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) scale(${s.toFixed(4)})`;
}

function pLesionados() {
  const at = lesAtivas().sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status) || b.data.localeCompare(a.data)), ats = atletasCat();
  const n = s => new Set(at.filter(l => l.status === s).map(l => l.atletaId)).size, noDM = new Set(at.map(l => l.atletaId)).size;
  const rows = at.map(l => { const a = atl(l.atletaId); return `<tr><td class="l">${athCell(a)}</td><td>${ptag(a?.posicao)}</td><td class="l">${esc(lesNome(l))}</td><td class="l">${esc(regLong(l))}</td><td>${fmtD(l.data)}</td><td>${esc(l.local || '')}</td><td><b>${diasFora(l)}</b></td><td>${chip(l.status)}</td><td>${fmtD(l.previsao)}</td><td class="l" style="white-space:normal;max-width:260px">${esc((l.tratamentos || []).join(', '))}</td></tr>`; }).join('');
  return header({ title: 'ATLETAS NO DM', items: hdrItems() }) + `<div style="height:16px"></div><div class="kpis k4">
    ${kpi('user', 'Atletas no DM', noDM, pct(noDM, ats.length) + ' do elenco')}
    ${kpi('clock', 'Em tratamento', n('tratamento'), 'tratamento no DM', 'red')}
    ${kpi('run', 'Transição', n('transicao'), 'iniciando com o grupo', 'gold')}
    ${kpi('cycle', 'Retorno gradual', n('retorno'), 'aumentando carga')}</div>
    ${panel('Situação de cada atleta', at.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Pos.</th><th class="l">Lesão</th><th class="l">Região · ponto exato</th><th>Data</th><th>Local</th><th>Dias</th><th>Status</th><th>Previsão</th><th class="l">Condutas</th></tr></thead><tbody>${rows}</tbody></table></div>` : miniEmpty('DM vazio', 'Nenhum atleta lesionado no momento.'), { np: true })}`;
}

function pIndividual(a) {
  const ls = S.lesoes.filter(l => l.atletaId === a.id).sort((x, y) => y.data.localeCompare(x.data));
  const dias = ls.reduce((s, l) => s + diasFora(l), 0), at = ativaDe(a.id), recs = ls.filter(l => l.recorrente).length;
  const lsAno = ls.filter(l => noPeriodo(l.data));
  const meses = MESES.map((_, i) => lsAno.filter(l => +l.data.slice(5, 7) === i + 1).reduce((s, l) => s + diasFora(l), 0));
  const regC = sortEnt(countBy(ls, l => regN(l.regiao))), tipos = sortEnt(countBy(ls, l => l.tipo));
  const profs = (S.config.profissionais || []).filter(p => p.nome);
  const hdr = cont => header({ title: 'RELATÓRIO INDIVIDUAL' + (cont ? ' (CONT.)' : ''), pill: (a.apelido || a.nome).toUpperCase(), items: [['user', 'Categoria', a.subcategoria || a.categoria], ['cal', 'Temporada', anoLabel()], ['clock', 'Emitido em', fmtD(todayISO())]] }) + '<div style="height:14px"></div>';
  const tbl = ls.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th></th><th>Data</th><th class="l">Lesão</th><th class="l">Região · ponto exato</th><th>Local</th><th class="l">Mecanismo</th><th>Dor</th><th>Dias</th><th class="l">Condutas</th><th>Retorno</th><th>Status</th></tr></thead><tbody>${ls.map(l => `<tr><td class="l">${lesThumb(l, 'sm')}</td><td>${fmtD(l.data)}</td><td class="l"><b>${esc(lesNome(l))}</b><br>${natTag(l)}${l.recorrente ? ' <span style="color:var(--red);font-weight:800">● recorrente</span>' : ''}${l.cirurgia ? ' <span style="color:var(--purple);font-weight:800">● cirurgia</span>' : ''}</td><td class="l">${esc(regLong(l))}</td><td>${esc(l.local || '')}</td><td class="l">${esc(l.mecanismo || '')}</td><td>${l.dor ?? '—'}/10</td><td><b>${diasFora(l)}</b></td><td class="l" style="white-space:normal;max-width:240px">${esc((l.tratamentos || []).join(', ') || '—')}</td><td>${fmtD(l.statusDatas?.liberado || l.previsao)}</td><td>${chip(l.status)}</td></tr>`).join('')}</tbody></table></div>` : miniEmpty('Sem lesões registradas', 'Este atleta não teve passagem pelo DM.');
  const det1 = l => `<div class="pdet"><div class="pdet-h">${lesThumb(l)}<b>${esc(lesNome(l))}</b><span>${esc(regLong(l))} · ${fmtD(l.data)}</span>${chip(l.status)}</div>${steps(l)}<div class="pdet-g"><div><h5>Descrição</h5><p>${esc(l.descricao || '—')}</p></div><div><h5>Exames realizados</h5><p>${esc(l.exames || '—')}</p></div><div><h5>Observações</h5><p>${esc(l.obs || '—')}</p></div><div><h5>Responsável</h5><p>${esc(l.responsavel || '—')}</p></div></div></div>`;
  const signs = `<div class="signs">${(profs.length ? profs : [{ nome: '', cargo: 'Responsável' }]).slice(0, 3).map(p => `<div><i></i><b>${esc(p.nome || '\u00a0')}</b><span>${esc(p.cargo || '')}</span></div>`).join('')}<div><i></i><b>&nbsp;</b><span>Atleta / responsável legal</span></div></div>`;
  const pages = [];
  // folha 1: ficha, indicadores e corpo
  pages.push(pageWrap(hdr() + `<div class="ind-top">
    <div class="panel"><div class="ph">Atleta</div><div class="bio">${ava(a, 'lg')}<div style="min-width:0">${ptag(a.posicao)}${subTag(a)}<h3>${esc(a.apelido || a.nome)}</h3><div class="muted">${esc(a.nome)}</div></div></div>
      <div class="bio2"><div><span>Categoria</span><b>${esc(a.categoria)}${a.subcategoria ? ' · ' + esc(a.subcategoria) : ''}</b></div><div><span>Número</span><b>${esc(a.numero || '—')}</b></div><div><span>Função</span><b>${esc(a.posDetalhe || POSN[a.posicao] || '—')}</b></div><div><span>Idade</span><b>${idade(a.nascimento) || '—'} anos</b></div><div><span>Nascimento</span><b>${fmtD(a.nascimento)}</b></div><div><span>Altura · Peso</span><b>${a.altura ? nf(a.altura, 2) + ' m' : '—'} · ${a.peso ? a.peso + ' kg' : '—'}</b></div><div><span>Pé dominante</span><b>${esc(a.pe || '—')}</b></div>${a.gordura ? `<div><span>% de gordura</span><b>${nf(a.gordura, 1)}%</b></div>` : ''}<div><span>Situação atual</span><b>${at ? STATUS[at.status] : 'Disponível'}</b></div></div></div>
    <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
      <div class="kpis k4" style="margin:0">
        ${kpi('med', 'Total de lesões', ls.length, 'Histórico completo')}
        ${kpi('cal', 'Dias afastado', dias + '<small>dias</small>', 'Média ' + nf(ls.length ? dias / ls.length : 0) + ' por lesão')}
        ${kpi('cross', 'Recorrências', recs, pct(recs, ls.length) + ' das lesões', 'red')}
        ${kpi('cycle', 'Retorno previsto', at ? fmtD(at.previsao) : '—', at ? 'Em ' + STATUS[at.status].toLowerCase() + ' desde ' + fmtD(at.data) : 'Sem afastamento ativo', '', 'txt')}
      </div>
      <div class="row r12" style="margin:0;flex:1">
        ${panel('Regiões afetadas', bodyMap({ mode: 'hl', ls }))}
        <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
          ${panel('Regiões e tipos de lesão', `<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">${dist(regC.map(([r, n]) => ({ l: r, v: n, p: pct(n, ls.length) })))}${dist(tipos.map(([t, n]) => ({ l: t, v: n, p: pct(n, ls.length), c: 'linear-gradient(90deg,#d77412,var(--orange))' })))}</div>`)}
          ${panel('Dias afastados por mês · ' + anoLabel(), vbars(MESES, meses, { w: 560, h: 190 }))}
        </div>
      </div>
    </div>
  </div>`));
  // folha 2: tabela de lesões; folhas seguintes: detalhes (4 por folha); assinaturas na última
  const dets = ls.map(det1), chunks = [];
  for (let k = 0; k < dets.length; k += 4) chunks.push(dets.slice(k, k + 4));
  pages.push(pageWrap(hdr(true) + `<div class="grow" style="margin-bottom:14px">${panel('Histórico de lesões', tbl, { np: true })}</div>` + (chunks.length ? '' : signs)));
  chunks.forEach((ch, k) => pages.push(pageWrap(hdr(true) + `<div class="grow" style="margin-bottom:12px">${panel('Detalhes e evolução de cada lesão' + (chunks.length > 1 ? ` · ${k + 1}/${chunks.length}` : ''), `<div class="pdet-list">${ch.join('')}</div>`)}</div>` + (k === chunks.length - 1 ? signs : ''))));
  return pages;
}

function buildPages(kind, aid) {
  PRINT = true;
  try {
    if (kind === 'individual') { const a = atl(aid); return a ? pIndividual(a) : []; }
    if (kind === 'nutind') { const a = atl(aid); return a ? pNutInd(a) : []; }
    if (kind === 'ficha') { const a = atl(aid); return a ? pFicha(a) : []; }
    if (S.view === 'nut-ind') return pNutInd(atl(UI.indAtl));
    if (kind === 'geral') return [pageWrap(renderAs('dm-visao')), pageWrap(pLesionados()), pageWrap(renderAs('dm-regioes')), pageWrap(renderAs('dm-tempo')), pageWrap(renderAs('dm-comparativo'))];
    if (S.view === 'config') return [];
    if (S.view === 'dm-lesionados') return [pageWrap(pLesionados())];
    if (S.view === 'dm-historico') { const a = atl(UI.histAtleta); return a ? pIndividual(a) : []; }
    return [pageWrap(renderAs(S.view))];
  } finally { PRINT = false; }
}

function imprimir(pages) {
  let pr = $('#printRoot'); if (pr) pr.remove();
  pr = document.createElement('div'); pr.id = 'printRoot'; pr.innerHTML = pages.join(''); document.body.appendChild(pr);
  // cada folha cabe numa página A4 deitada; a ficha individual longa pode ocupar mais de uma
  pr.querySelectorAll('.sheet').forEach(sh => fitSheet(sh, true));
  document.body.classList.add('printing');
  const done = () => { document.body.classList.remove('printing'); pr.remove(); removeEventListener('afterprint', done); };
  addEventListener('afterprint', done);
  setTimeout(() => { try { window.print(); } catch (e) { toast('A impressão não abriu aqui. Use “Baixar PDF”.', true); } setTimeout(() => { if (document.body.classList.contains('printing')) done(); }, 2000); }, 350);
}

const LIBS = { xlsx: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', h2c: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', jspdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js' };
function loadLib(k) { return new Promise((res, rej) => { if ((k === 'h2c' && window.html2canvas) || (k === 'jspdf' && window.jspdf) || (k === 'xlsx' && window.XLSX)) return res(); const sc = document.createElement('script'); sc.src = LIBS[k]; sc.onload = res; sc.onerror = rej; document.head.appendChild(sc); }); }
function progress(msg) { let p = $('#pdfProg'); if (!p) { p = document.createElement('div'); p.id = 'pdfProg'; document.body.appendChild(p); } p.innerHTML = `<div><span class="spin"></span>${esc(msg)}</div>`; }
const progressEnd = () => $('#pdfProg')?.remove();
// o gerador de PDF não entende variáveis CSS dentro de SVG: grava as cores já calculadas
function fixSvg(root) {
  root.querySelectorAll('svg *').forEach(n => {
    const cs = getComputedStyle(n);
    if (n.tagName === 'image' || n.tagName === 'defs' || n.tagName === 'stop' || n.tagName === 'linearGradient' || n.tagName === 'title') return;
    const f = n.getAttribute('fill') || ''; if (!f.startsWith('url(')) n.setAttribute('fill', cs.fill);
    const s = n.getAttribute('stroke') || ''; if (!s.startsWith('url(')) n.setAttribute('stroke', cs.stroke);
    if (n.tagName === 'text') { n.setAttribute('font-family', cs.fontFamily); n.setAttribute('font-weight', cs.fontWeight); n.setAttribute('font-size', cs.fontSize); }
    if (cs.fillOpacity !== '1') n.setAttribute('fill-opacity', cs.fillOpacity);
    n.removeAttribute('class'); n.removeAttribute('style');
  });
}
async function gerarPDF(pages, kind, aid) {
  progress('Preparando o PDF…');
  try { await Promise.all([loadLib('h2c'), loadLib('jspdf')]); } catch (e) { progressEnd(); toast('Não foi possível carregar o gerador de PDF. Verifique a conexão ou use Imprimir.', true); return; }
  try { await document.fonts.ready; } catch (e) { }
  const holder = document.createElement('div'); holder.id = 'pdfHolder'; document.body.appendChild(holder);
  const { jsPDF } = window.jspdf; let pdf = null;
  try {
    for (let i = 0; i < pages.length; i++) {
      progress(`Gerando página ${i + 1} de ${pages.length}…`);
      holder.innerHTML = pages[i]; const el = holder.firstElementChild;
      await new Promise(r => setTimeout(r, 120)); fitSheet(el); fixSvg(el);
      const cv = await html2canvas(el, { scale: 2, backgroundColor: '#eef2ef', useCORS: true, logging: false, windowWidth: 2500, windowHeight: 1600, scrollX: 0, scrollY: 0, width: SHEET_W, height: SHEET_H });
      const pw = 960, ph = 540, fmt = [pw, ph], ori = 'landscape';
      if (!pdf) pdf = new jsPDF({ orientation: ori, unit: 'pt', format: fmt, compress: true }); else pdf.addPage(fmt, ori);
      pdf.addImage(cv.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, pw, ph, undefined, 'FAST');
    }
    progress('Finalizando…');
    const blob = pdf.output('blob'); holder.remove();
    const a = aid ? atl(aid) : null;
    const nome = kind === 'ficha' && a ? `Ficha-${a.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}-${todayISO()}.pdf` : kind === 'nutind' && a ? `Relatorio-Nutricional-${a.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}-${todayISO()}.pdf` : kind === 'individual' && a ? `Relatorio-Individual-${a.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}-${todayISO()}.pdf` : `Relatorio-DM-${kind === 'geral' ? 'Geral' : (TITLES[S.view] || ['Pagina'])[1].replace(/\s+/g, '-') || 'Pagina'}-${todayISO()}.pdf`;
    progressEnd();
    const dl = window.claude && await window.claude.use('downloads');
    if (dl) { try { await dl.save({ filename: nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ''), data: blob }); toast('PDF salvo'); } catch (e) { if (e && e.code !== 'declined') toast('Não foi possível salvar o PDF.', true); } }
    else { const u = URL.createObjectURL(blob); const ln = document.createElement('a'); ln.href = u; ln.download = nome; document.body.appendChild(ln); ln.click(); ln.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); }
  } catch (e) { console.error(e); holder.remove(); progressEnd(); toast('Erro ao gerar o PDF. Tente usar Imprimir.', true); }
}
