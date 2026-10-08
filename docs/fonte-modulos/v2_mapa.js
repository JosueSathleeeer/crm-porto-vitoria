/* ================= ATLETAS · MAPA DE JOGADORES (A4 deitado) ================= */
TITLES['atl-mapa'] = ['Atletas', 'Mapa de jogadores'];
{ const n = NAV.find(x => x.k === 'atletas'); if (n) n.sub.splice(1, 0, ['atl-mapa', 'Mapa de jogadores']); }
const GRP = { G1: '#1b8a4a', G2: '#f2b81b', G3: '#2f6fd6', G4: '#e0342b' };
const COMISSAO = [['treinador', 'Treinador'], ['aux', 'Aux. técnico'], ['prep', 'Prep. físico'], ['prepgol', 'Prep. goleiros'], ['fisio', 'Fisioterapeuta'], ['massagista', 'Massagista']];
// lado do atleta: escolha manual > função cadastrada > pé
function ladoAtl(a) { if (a.lado === 'D' || a.lado === 'E') return a.lado; const d = nrmB(a.posDetalhe || ''); if (/direit/.test(d)) return 'D'; if (/esquerd/.test(d)) return 'E'; return /esquer|canhot/.test(nrmB(a.pe || '')) ? 'E' : 'D'; }
function slotDe(a) { const p = a.posicao, l = ladoAtl(a); if (p === 'GOL') return 'gol'; if (p === 'LAT') return l === 'E' ? 'le' : 'ld'; if (p === 'ZAG') return l === 'E' ? 'z4' : 'z3'; if (p === 'VOL') return 'vol'; if (p === 'MEI') return 'mei'; if (p === 'EXT') return l === 'E' ? 'ee' : 'ed'; if (p === 'ATA') return 'ata'; return 'mei'; }
const SLOTS = { gol: 'Goleiro (01)', ld: 'Lateral direito (02)', z3: 'Zagueiro (03) · lado direito', z4: 'Zagueiro (04) · lado esquerdo', le: 'Lateral esquerdo (06)', vol: 'Volante (05)', ed: 'Extremo direito (07)', mei: 'Meio-campo (10)', ee: 'Extremo esquerdo (11)', ata: 'Atacante (09)' };
UI.mapaSub = 'Todas';
function mapaDados() {
  const cat = F.categoria !== 'Todas' ? F.categoria : (Object.entries(countBy(S.atletas, a => a.categoria)).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sub-15');
  const ats = S.atletas.filter(a => a.categoria === cat && (UI.mapaSub === 'Todas' || a.subcategoria === UI.mapaSub)).sort((a, b) => a.nome.localeCompare(b.nome));
  const by = {}; Object.keys(SLOTS).forEach(k => by[k] = []); ats.forEach(a => by[slotDe(a)].push(a));
  return { cat, ats, by };
}
function mapaHTML(edit) {
  const D = mapaDados(), com = (S.config.comissao || {})[D.cat] || {}, ano = F.ano === 'Todos' ? todayISO().slice(0, 4) : F.ano;
  const n = { al: D.ats.filter(a => a.alojado).length, gol: D.by.gol.length, linha: D.ats.length - D.by.gol.length };
  // colunas de cartões por bloco e altura do cartão para caber numa folha A4 deitada
  const cc = n => n <= 1 ? 1 : n <= 4 ? 2 : 3, cG = Math.min(3, Math.max(1, D.by.gol.length)), cV = cc(D.by.vol.length), cM = cc(D.by.mei.length), cA = cc(D.by.ata.length);
  const rows = [Math.max(1, Math.ceil(D.by.gol.length / cG)), Math.max(D.by.ld.length, D.by.z3.length, D.by.z4.length, D.by.le.length, 1), Math.max(1, Math.ceil(D.by.vol.length / cV)), Math.max(1, Math.ceil(D.by.mei.length / cM)), Math.max(D.by.ed.length, Math.ceil(D.by.ata.length / cA), D.by.ee.length, 1)];
  const totR = rows.reduce((s, x) => s + x, 0), disp = 794 - 62 - 20 - 16 - 4 * 12 - 5 * 24 - 5 * 8, cardH = Math.max(20, Math.min(52, Math.floor((disp - totR * 4) / totR))), xs = cardH < 34 ? 'xs' : cardH >= 44 ? 'lg' : '';
  const card = a => `<div class="mpc ${edit ? 'ed' : ''} ${xs}" style="--gc:${GRP[a.grupo] || '#cfd8d3'};height:${cardH}px" ${edit ? `data-act="mp-edit" data-id="${a.id}" role="button" tabindex="0"` : ''}><span class="mpf">${a.foto ? `<img src="${esc(a.foto)}" alt="">` : `<i>${esc(initials(a.nome))}</i>`}</span><div class="mpt"><b>${esc(a.nome)}${a.apelido ? ` <small>“${esc(a.apelido)}”</small>` : ''}</b><span>${a.nascimento ? fmtD(a.nascimento) : '—'} · Pé ${esc((a.pe || '—').slice(0, 1).toUpperCase())}${xs ? ` · ${a.altura ? nf(+a.altura, 2) + ' m' : '—'} · ${a.peso ? nf(+a.peso, 1) + ' kg' : '—'}` : ''}</span>${xs ? '' : `<span>${a.altura ? nf(+a.altura, 2) + ' m' : '— m'} · ${a.peso ? nf(+a.peso, 1) + ' kg' : '— kg'}</span>`}</div><em class="${a.alojado ? 'al' : ''}">${a.alojado ? 'AL' : 'NA'}</em>${a.grupo ? `<u>${a.grupo}</u>` : ''}</div>`;
  const box = (k, cols) => `<div class="mpb mpb-${k}"><h6>${SLOTS[k]} <small>${D.by[k].length}</small></h6><div class="mpl" style="grid-template-columns:repeat(${cols || 1},minmax(0,1fr))">${D.by[k].map(card).join('') || '<div class="mpv">—</div>'}</div></div>`;
  return `<div class="a4pg mapa">
    <svg class="mpfield" viewBox="0 0 1123 794" preserveAspectRatio="none"><g fill="none" stroke="#cfe6d6" stroke-width="2"><rect x="18" y="74" width="1087" height="702" rx="6"/><line x1="18" y1="425" x2="1105" y2="425"/><circle cx="561" cy="425" r="58"/><rect x="371" y="74" width="380" height="96"/><rect x="471" y="74" width="180" height="38"/><rect x="371" y="680" width="380" height="96"/><rect x="471" y="738" width="180" height="38"/></g></svg>
    <div class="mph"><img src="${LOGO}" alt=""><div><b>MAPA DE JOGADORES · ${ano}</b><span>Porto Vitória · Departamento de Futebol de Base · ${esc(String(D.cat).toUpperCase())}${UI.mapaSub !== 'Todas' ? ' · ' + esc(UI.mapaSub.toUpperCase()) : ''}</span></div><div class="mpleg"><span>Legenda</span>${Object.entries(GRP).map(([g, c]) => `<i style="background:${c}">${g}</i>`).join('')}<span class="mptag"><em class="al">AL</em> alojado</span><span class="mptag"><em>NA</em> não alojado</span></div></div>
    <div class="mpsides"><span>◀ LADO DIREITO</span><span>▼ sentido do ataque</span><span>LADO ESQUERDO ▶</span></div>
    <div class="mpg">
      <div class="mpinfo"><img src="${LOGO}" alt=""><div><b>${esc(String(D.cat).toUpperCase())}</b><dl><dt>Atletas alojados</dt><dd>${n.al}</dd><dt>Goleiros</dt><dd>${n.gol}</dd><dt>Atletas de linha</dt><dd>${n.linha}</dd><dt>Total</dt><dd><b>${D.ats.length}</b></dd></dl></div></div>
      ${box('gol', cG)}
      <div class="mpcom"><h6>Comissão técnica</h6>${COMISSAO.map(([k, l]) => `<div><span>${l}</span><b>${esc(com[k] || '—')}</b></div>`).join('')}${edit ? `<button class="mpcomed" data-act="mp-com">${IC.edit} Editar</button>` : ''}</div>
      ${box('ld')}${box('z3')}${box('z4')}${box('le')}
      ${box('vol', cV)}
      ${box('mei', cM)}
      ${box('ed')}${box('ata', cA)}${box('ee')}
    </div>
  </div>`;
}
function vMapa() {
  const D = mapaDados(), subs = GRUPOS[D.cat] || [];
  return `<div class="page-h"><div><h2>Atletas</h2><span class="muted">Mapa de jogadores por posição e lado · ${esc(D.cat)}</span></div></div>
  <nav class="subtabs"><button data-go="atletas">Cadastro</button><button class="on" data-go="atl-mapa">Mapa de jogadores</button><button data-go="importar">Importar dados</button></nav>
  <div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${F.categoria === 'Todas' ? `<span class="muted">Mostrando ${esc(D.cat)} — escolha a categoria no filtro do topo.</span>` : ''}${subs.length > 1 ? `<label class="muted" style="display:flex;gap:6px;align-items:center">Subcategoria <select id="mpSub" class="search" style="min-width:0"><option>Todas</option>${subs.map(s => `<option ${UI.mapaSub === s ? 'selected' : ''}>${s}</option>`).join('')}</select></label>` : ''}<span class="muted" style="font-size:12.5px">Clique num atleta para definir <b>lado</b>, <b>grupo (G1–G4)</b> e se é <b>alojado</b>.</span><span style="flex:1"></span><button class="btn" data-act="mp-com">${IC.users} Comissão técnica</button><button class="btn" data-act="mp-print" data-pdf="0">${IC.print} Imprimir (A4 deitado)</button><button class="btn pri" data-act="mp-print" data-pdf="1">${IC.pdf} Baixar PDF</button></div></div>
  <div class="mpwrap"><div class="mpscale">${mapaHTML(true)}</div></div>`;
}
function formMapaAtl(a) {
  openModal(mh(esc(a.nome)) + `<div class="mb"><div class="form" style="grid-template-columns:1fr 1fr"><div class="f"><label for="mpP">Posição</label><select id="mpP">${POS.map(p => `<option value="${p}" ${a.posicao === p ? 'selected' : ''}>${POSN[p]}</option>`).join('')}</select></div><div class="f"><span>Lado</span><div class="seg2"><label><input type="radio" name="mpL" value="D" ${ladoAtl(a) === 'D' ? 'checked' : ''}>Direito</label><label><input type="radio" name="mpL" value="E" ${ladoAtl(a) === 'E' ? 'checked' : ''}>Esquerdo</label></div><small class="muted">Vale para laterais, zagueiros e extremos.</small></div><div class="f"><span>Grupo</span><div class="seg2"><label><input type="radio" name="mpG" value="" ${!a.grupo ? 'checked' : ''}>—</label>${Object.keys(GRP).map(g => `<label><input type="radio" name="mpG" value="${g}" ${a.grupo === g ? 'checked' : ''}><i style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${GRP[g]};margin-right:4px"></i>${g}</label>`).join('')}</div></div><div class="f"><span>Alojamento</span><div class="seg2"><label><input type="radio" name="mpA" value="1" ${a.alojado ? 'checked' : ''}>Alojado (AL)</label><label><input type="radio" name="mpA" value="" ${!a.alojado ? 'checked' : ''}>Não alojado (NA)</label></div></div><div class="f"><label for="mpAp">Apelido</label><input id="mpAp" value="${esc(a.apelido || '')}"></div></div></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn" data-act="mp-ficha" data-id="${a.id}">${IC.user} Abrir ficha</button><button class="btn pri" id="mpOk">${IC.check} Salvar</button></div>`);
  $('#mpOk').onclick = () => { const o = { ...a, posicao: $('#mpP').value, lado: ($('input[name=mpL]:checked') || {}).value || '', grupo: ($('input[name=mpG]:checked') || {}).value || '', alojado: !!($('input[name=mpA]:checked') || {}).value, apelido: $('#mpAp').value.trim() }; save('atletas', o); closeModal(); toast('Atleta atualizado'); };
}
function formComissao() {
  const cat = mapaDados().cat, c = (S.config.comissao || {})[cat] || {}, profs = (S.config.profissionais || []).map(p => p.nome).filter(Boolean);
  openModal(mh('Comissão técnica · ' + esc(cat)) + `<div class="mb"><div class="form" style="grid-template-columns:1fr 1fr">${COMISSAO.map(([k, l]) => `<div class="f"><label for="cm_${k}">${l}</label><input id="cm_${k}" list="cmL" value="${esc(c[k] || '')}"></div>`).join('')}<datalist id="cmL">${profs.map(p => `<option value="${esc(p)}">`).join('')}</datalist></div></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn pri" id="cmOk">${IC.check} Salvar</button></div>`);
  $('#cmOk').onclick = () => { const o = {}; COMISSAO.forEach(([k]) => o[k] = $('#cm_' + k).value.trim()); S.config.comissao = { ...(S.config.comissao || {}), [cat]: o }; putConfig(); closeModal(); render(); toast('Comissão técnica salva'); };
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'mp-edit') { const a = atl(t.dataset.id); if (a) formMapaAtl(a); }
  if (t.dataset.act === 'mp-com') formComissao();
  if (t.dataset.act === 'mp-ficha') { closeModal(); abrirFicha(t.dataset.id, 'geral'); }
  if (t.dataset.act === 'mp-print') { const D = mapaDados(); imprimirA4(mapaHTML(false), `Mapa-de-jogadores-${(UI.mapaSub !== 'Todas' ? UI.mapaSub : D.cat).replace(/\s/g, '')}-${todayISO()}.pdf`, true, t.dataset.pdf === '1', 0); }
});
document.addEventListener('change', e => { if (e.target.id === 'mpSub') { UI.mapaSub = e.target.value; render(); } });
// abas Cadastro / Mapa / Importar também nas outras telas de Atletas
const _vAtletasM = vAtletas; vAtletas = function () { return _vAtletasM().replace('<button data-go="importar">Importar dados</button>', '<button data-go="atl-mapa">Mapa de jogadores</button><button data-go="importar">Importar dados</button>'); };
const _vImportarM = vImportar; vImportar = function () { return _vImportarM().replace('<button data-go="atletas">Cadastro</button>', '<button data-go="atletas">Cadastro</button><button data-go="atl-mapa">Mapa de jogadores</button>'); };
