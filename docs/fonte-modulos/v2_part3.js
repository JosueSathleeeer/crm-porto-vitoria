/* ================= NAVEGAÇÃO ================= */
const DM_TABS = [['dashboard', 'Dashboard'], ['dm-visao', 'Visão Geral'], ['dm-lesionados', 'Atletas Lesionados'], ['dm-historico', 'Histórico de Lesões'], ['dm-regioes', 'Regiões'], ['dm-tempo', 'Tempo de Afastamento'], ['dm-comparativo', 'Comparativo']];
const NAV = [{ k: 'dm', n: 'Fisio / DM', ic: IC.med, sub: DM_TABS }, { k: 'atletas', n: 'Atletas', ic: IC.users, sub: [['atletas', 'Cadastro'], ['importar', 'Importar dados']] }];
const TITLES = { dashboard: ['Dashboard', 'Departamento médico'], atletas: ['Atletas', 'Cadastro'], importar: ['Atletas', 'Importar dados'], config: ['Configurações', ''] };
DM_TABS.forEach(([k, n]) => TITLES[k] = ['Lesões / DM', n]);
try { const v = localStorage.getItem('pv_dm_view'); if (v && TITLES[v]) S.view = v; } catch (e) { }
function go(v, arg) { S.view = v; if (arg !== undefined) UI.histAtleta = arg; try { localStorage.setItem('pv_dm_view', v); } catch (e) { } render(); $('#content').scrollTop = 0; }

function renderSide() {
  const item = n => {
    const active = S.view === n.k || (n.sub && n.sub.some(s => s[0] === S.view));
    return `<div class="nav-item"><button class="nav-btn ${active ? 'active' : ''}" data-go="${n.sub ? n.sub[0][0] : n.k}" aria-label="${n.n}">${n.ic}</button>
    <div class="nav-fly"><div class="fly-title">${n.n}</div>${n.sub ? n.sub.map(s => `<button data-go="${s[0]}" class="${S.view === s[0] ? 'active' : ''}">${s[1]}</button>`).join('') : `<button data-go="${n.k}" class="${active ? 'active' : ''}">Abrir ${n.n.toLowerCase()}</button>`}</div></div>`;
  };
  $('#side').innerHTML = `<div class="brand"><img src="${LOGO}" alt="Porto Vitória"></div>${NAV.map(item).join('')}<div class="spacer"></div>
   ${item({ k: 'config', n: 'Configurações', ic: IC.gear })}
   <div class="nav-item"><button class="nav-btn" data-act="theme" aria-label="Alternar tema claro/escuro">${IC.moon}</button><div class="nav-fly"><div class="fly-title">Tema</div><button data-act="theme">Alternar claro / escuro</button></div></div>`;
}
function renderTop() {
  const [t, s] = TITLES[S.view] || ['', ''];
  const anos = [...new Set([String(new Date().getFullYear()), ...S.lesoes.map(l => l.data.slice(0, 4))])].sort().reverse();
  const showF = S.view !== 'config' && S.view !== 'importar';
  $('#topbar').innerHTML = `<div class="crumb">${t} ${s ? `<small>· ${s}</small>` : ''}</div>
  ${showF ? `<div class="flt"><label for="fC">Categoria</label><select id="fC"><option>Todas</option>${Object.keys(GRUPOS).map(c => `<option ${c === F.categoria ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
  ${F.categoria !== 'Todas' ? `<div class="flt"><label for="fS">Sub</label><select id="fS"><option value="Todas">Todas</option>${GRUPOS[F.categoria].map(c => `<option ${c === F.sub ? 'selected' : ''}>${c}</option>`).join('')}</select></div>` : ''}
  ${S.view !== 'atletas' ? `<div class="flt"><label for="fA">Temporada</label><select id="fA"><option>Todos</option>${anos.map(a => `<option ${a === F.ano ? 'selected' : ''}>${a}</option>`).join('')}</select></div><div class="flt"><label for="fP">Período</label><select id="fP">${PERIODOS.map(([k, n]) => `<option value="${k}" ${k === (F.periodo || 'ano') ? 'selected' : ''}>${n}</option>`).join('')}</select></div>` : ''}` : ''}
  ${S.view !== 'config' && S.view !== 'importar' ? `<button class="btn sm" data-act="print-menu">${IC.print} Imprimir / PDF</button>` : ''}
  ${S.view.startsWith('mon-be') ? `<button class="btn sm pri" data-act="be-lancar">${IC.plus} Lançar bem-estar</button>` : S.view.startsWith('mon-pse') ? `<button class="btn sm pri" data-act="pse-lancar">${IC.plus} Lançar PSE</button>` : S.view === 'pl-macro' ? `<button class="btn sm pri" data-act="macro-novo">${IC.plus} Novo bloco</button>` : S.view === 'pl-plano' ? `<button class="btn sm pri" data-act="plano-novo">${IC.plus} Novo plano</button>` : S.view === 'pl-micro' ? '' : S.view.startsWith('av-') ? `<button class="btn sm pri" data-act="av-nova">${IC.plus} Nova sessão de testes</button>` : S.view.startsWith('mat-') ? `<button class="btn sm pri" data-act="mat-nova">${IC.plus} Nova medição</button>` : S.view.startsWith('nut-') ? (S.view === 'nut-hidra' ? `<button class="btn sm pri" data-act="nova-hid">${IC.plus} Nova sessão</button>` : `<button class="btn sm pri" data-act="nova-av">${IC.plus} Nova avaliação</button>`) : S.view !== 'config' ? `<button class="btn sm pri" data-act="nova-lesao">${IC.plus} Registrar lesão</button>` : ''}
  <span class="sync ${S.online ? 'ok' : ''}" title="${S.online ? 'Dados sincronizados na nuvem' : 'Dados salvos neste navegador'}"><i></i>${S.online ? 'Sincronizado' : 'Local'}</span>`;
  const bind = (id, k) => { const e = $('#' + id); if (e) e.onchange = () => { F[k] = e.value; if (k === 'categoria') F.sub = 'Todas'; try { localStorage.setItem('pv_dm_filtro', JSON.stringify(F)); } catch (x) { } render(); }; };
  bind('fC', 'categoria'); bind('fS', 'sub'); bind('fA', 'ano'); bind('fP', 'periodo');
}
function render() {
  if (!S.ready) return;
  renderSide(); renderTop();
  const v = { atletas: vAtletas, importar: vImportar, config: vConfig }[S.view] || (S.view.startsWith('nut-') ? vNut : S.view.startsWith('av-') ? vAval : S.view.startsWith('mat-') ? vMat : vDM);
  const ct = $('#content'); const st = ct.scrollTop;
  ct.innerHTML = `<div class="report">${v()}${footer()}</div>`; ct.scrollTop = st;
  $$('[data-fl]').forEach(el => { if (el.tagName === 'SELECT') el.value = UI.fl[el.dataset.fl]; });
}
const footer = () => { const nut = S.view.startsWith('nut-'); return `<div class="rfoot"><img src="${LOGO}" alt=""><div class="club"><b>PORTO VITÓRIA</b><span>Departamento de Futebol de Base · ${nut ? 'Nutrição Esportiva' : S.view.startsWith('av-') ? 'Avaliação Física' : S.view.startsWith('mat-') ? 'Maturação' : S.view === 'inicio' || S.view === 'notif' || S.view === 'cal' ? 'Performance Hub' : S.view === 'minc' ? 'Minutagem' : S.view.startsWith('mon-') ? 'Monitoramento' : S.view.startsWith('pl-') ? 'Planejamento' : 'Fisioterapia'}</span></div><div class="leg">${S.view.startsWith('av-') || S.view.startsWith('mat-') || S.view.startsWith('mon-') || S.view.startsWith('pl-') || S.view === 'inicio' || S.view === 'notif' || S.view === 'cal' || S.view === 'minc' ? '' : nut ? Object.values(FAIXAS).map(f => `<span><span class="sq" style="background:${f[1]}"></span>${f[0]}</span>`).join('') + `<span class="muted">Faixa-alvo de gordura: ${alvo().min}–${alvo().max}%</span>` : ORDER.map(s => `<span><span class="sq" style="background:${SCOL[s]}"></span><b style="color:var(--ink)">${STATUS[s]}:</b> ${STATUS_DESC[s]}</span>`).join('')}</div></div>`; };
const btnAtleta = pri => `<button class="btn ${pri ? 'pri' : ''}" data-act="novo-atleta">${IC.plus} Cadastrar atleta</button>`;
const noData = () => S.atletas.length ? '' : `<div class="empty" style="margin-bottom:16px"><h3>Nenhum atleta cadastrado ainda</h3>Cadastre o elenco para começar a registrar lesões no DM.<div class="acts">${btnAtleta(true)}<button class="btn" data-go="importar">${IC.upload} Importar planilha</button><button class="btn" data-act="seed">Carregar dados de exemplo</button></div></div>`;
const hdrItems = () => [['cal', 'Temporada', anoLabel()], ['clock', 'Atualizado em', fmtD(todayISO())]];

/* ================= DASHBOARD ================= */
function fDashboard() {
  const ats = atletasCat(), at = lesAtivas(), lp = lesPeriodo();
  const noDM = new Set(at.map(l => l.atletaId)).size, disp = ats.length - noDM;
  const prox = [...at].sort((a, b) => (a.previsao || '9').localeCompare(b.previsao || '9'));
  const cats = Object.keys(GRUPOS).filter(c => S.atletas.some(a => a.categoria === c));
  const porCat = cats.map(c => { const as = S.atletas.filter(a => a.categoria === c); const fora = new Set(S.lesoes.filter(l => l.status !== 'liberado' && as.some(a => a.id === l.atletaId)).map(l => l.atletaId)).size; return { l: c, v: (as.length - fora) / as.length * 100, t: `${as.length - fora}/${as.length}`, p: pct(as.length - fora, as.length) }; });
  return `
  <div class="kpis k5">
    ${kpi('users', 'Elenco', ats.length, F.categoria === 'Todas' ? 'Todas as categorias' : catLabel())}
    ${kpi('check', 'Disponíveis', disp, pct(disp, ats.length) + ' do elenco')}
    ${kpi('med', 'No DM agora', noDM, pct(noDM, ats.length) + ' do elenco', 'red')}
    ${kpi('band', 'Lesões na temporada', lp.length, 'Temporada ' + anoLabel(), 'gold')}
    ${kpi('cal', 'Dias de afastamento', lp.reduce((s, l) => s + diasFora(l), 0), 'Acumulado na temporada')}
  </div>
  <div class="row r21">
    ${panel('Quem está no DM', prox.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Pos.</th><th class="l">Lesão</th><th class="l">Região</th><th>Dias fora</th><th>Status</th><th>Previsão de retorno</th></tr></thead><tbody>${prox.map(l => { const a = atl(l.atletaId); return `<tr class="click" data-open-les="${l.id}"><td class="l">${athCell(a)}</td><td>${ptag(a?.posicao)}</td><td class="l">${esc(lesNome(l))}</td><td class="l">${esc(regFull(l))}</td><td><b>${diasFora(l)}</b> dias</td><td>${chip(l.status)}</td><td>${fmtD(l.previsao)}</td></tr>`; }).join('')}</tbody></table></div>` : miniEmpty('DM vazio', 'Nenhum atleta lesionado nesta categoria.'), { np: true, r: `<button data-go="dm-lesionados">Ver todos</button>` })}
    ${panel('Mapa de lesões da temporada', bodyMap({ mode: 'heat', ls: lp }) + `<div class="heatbar">menos<i></i>mais lesões</div>`)}
  </div>
  <div class="row r2">
    ${panel('Disponibilidade por categoria', dist(porCat))}
    ${panel('Lesões por mês · ' + anoLabel(), lineChart(MESES, MESES.map((_, i) => lp.filter(l => +l.data.slice(5, 7) === i + 1).length), { label: 'Lesões por mês' }))}
  </div>`;
}

/* ================= ATLETAS ================= */
function vAtletas() {
  const q = UI.atBusca.toLowerCase();
  const base = atletasCat();
  const list = base.filter(a => (!q || (a.nome + ' ' + (a.apelido || '')).toLowerCase().includes(q)) && (UI.atPos === 'Todas' || a.posicao === UI.atPos));
  const grupos = POS.map(p => [p, list.filter(a => a.posicao === p).sort((a, b) => a.nome.localeCompare(b.nome))]).filter(g => g[1].length);
  return `<div class="page-h"><h2>Atletas</h2><span class="muted">${base.length} atleta(s) · ${catLabel().toLowerCase()}</span><span class="sp"></span><input class="search" id="atBusca" placeholder="Buscar atleta" value="${esc(UI.atBusca)}" aria-label="Buscar atleta"><button class="btn" data-go="importar">${IC.upload} Importar</button><button class="btn danger" data-act="limpar-menu">${IC.trash} Limpar dados</button>${btnAtleta(true)}</div>
  <nav class="subtabs"><button class="on" data-go="atletas">Cadastro</button><button data-go="importar">Importar dados</button></nav>
  <div class="pos-tabs">${['Todas', ...POS].map(p => `<button class="chip ${UI.atPos === p ? 'on' : ''}" data-pos="${p}">${p !== 'Todas' ? `<i style="width:10px;height:10px;border-radius:50%;display:inline-block;background:${PC1[p]}"></i>` : ''}${p === 'Todas' ? 'Todas' : POSN[p]}</button>`).join('')}</div>
  ${UI.selMode ? `<div class="selbar"><label class="chk"><input type="checkbox" id="selAll" ${list.length && list.every(a => UI.sel.has(a.id)) ? 'checked' : ''}>Selecionar todos da lista (${list.length})</label><span class="muted">${UI.sel.size} selecionado(s)</span><span style="flex:1"></span><button class="btn" data-act="sel-cancel">Cancelar</button><button class="btn red" data-act="sel-del" ${UI.sel.size ? '' : 'disabled'}>${IC.trash} Excluir selecionados</button></div>` : ''}
  ${noData()}
  ${grupos.length ? grupos.map(([p, g]) => `<h3 style="font-family:var(--fc);font-size:20px;margin:18px 0 8px;display:flex;align-items:center;gap:8px">${ptag(p)} ${POSN[p]}s <span class="muted" style="font-size:14px">(${g.length})</span></h3>
  <div class="athgrid">${g.map(a => { const at = ativaDe(a.id); const n = S.lesoes.filter(l => l.atletaId === a.id).length; return `<div class="athc ${UI.selMode && UI.sel.has(a.id) ? 'picked' : ''}">${UI.selMode ? `<input type="checkbox" class="selchk" data-sel="${a.id}" ${UI.sel.has(a.id) ? 'checked' : ''} aria-label="Selecionar ${esc(a.nome)}">` : ''}${ava(a)}<div class="i"><b>${a.numero ? esc(a.numero) + ' · ' : ''}${esc(a.apelido || a.nome)}${subTag(a)}</b><span>${esc(a.posDetalhe || POSN[a.posicao] || '')} · Pé ${esc(a.pe || '—')}</span><span>${[idade(a.nascimento) !== '' ? idade(a.nascimento) + ' anos' : '', a.altura ? nf(a.altura, 2) + ' m' : '', a.peso ? nf(a.peso, 1) + ' kg' : '', a.gordura ? nf(a.gordura, 1) + '%\u00a0G' : ''].filter(Boolean).join(' · ') || '&nbsp;'}</span>${a.avData ? `<span class="avtag">${IC.apple} Avaliado em ${fmtD(a.avData)}</span>` : ''}<span style="margin-top:4px">${at ? chip(at.status) : '<span class="st st-ok">Disponível</span>'} <span class="muted" style="font-size:12px;display:inline">${n} lesão(ões)</span></span></div>
  <div class="acts"><div><button class="icon-btn" data-act="hist" data-id="${a.id}" title="Histórico" aria-label="Histórico de ${esc(a.nome)}">${IC.hist}</button><button class="icon-btn" data-act="lesao-atleta" data-id="${a.id}" title="Registrar lesão" aria-label="Registrar lesão de ${esc(a.nome)}">${IC.plus}</button></div><div><button class="icon-btn" data-act="edit-atleta" data-id="${a.id}" aria-label="Editar ${esc(a.nome)}">${IC.edit}</button><button class="icon-btn" data-act="del-atleta" data-id="${a.id}" aria-label="Excluir ${esc(a.nome)}" style="color:var(--red)">${IC.trash}</button></div></div></div>`; }).join('')}</div>`).join('') : S.atletas.length ? `<div class="empty"><h3>Nenhum atleta encontrado</h3>Ajuste a busca, a posição ou a categoria.</div>` : ''}`;
}

/* ================= DM ================= */
const DM_TITLE = { dashboard: 'PAINEL DO DM', 'dm-visao': 'VISÃO GERAL DO DM', 'dm-lesionados': 'ATLETAS LESIONADOS', 'dm-historico': 'HISTÓRICO DE LESÕES', 'dm-regioes': 'LESÕES POR REGIÃO', 'dm-tempo': 'TEMPO DE AFASTAMENTO', 'dm-comparativo': 'COMPARATIVO' };
function vDM() {
  const body = { dashboard: fDashboard, 'dm-visao': fVisao, 'dm-lesionados': fLesionados, 'dm-historico': fHistorico, 'dm-regioes': fRegioes, 'dm-tempo': fTempo, 'dm-comparativo': fComparativo }[S.view] || fVisao;
  if (PRINT) return header({ title: DM_TITLE[S.view], items: hdrItems() }) + `<div style="height:16px"></div>` + body();
  return header({ title: DM_TITLE[S.view], items: hdrItems() }) + `<nav class="rtabs">${DM_TABS.map(([k, n]) => `<button data-go="${k}" class="${S.view === k ? 'on' : ''}">${n}</button>`).join('')}</nav>` + noData() + body();
}
function tabela(ls, opts = {}) {
  if (!ls.length) return miniEmpty('Nenhuma lesão aqui', 'Use “Registrar lesão” para cadastrar um caso.');
  return `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Pos.</th><th class="l">Lesão</th><th class="l">Região</th><th>Data da lesão</th><th>Dias afastado</th><th>Status</th><th>Previsão retorno</th></tr></thead><tbody>
  ${ls.map(l => { const a = atl(l.atletaId); return `<tr class="click ${opts.sel && UI.selLes === l.id ? 'rowsel' : ''}" data-${opts.sel ? 'sel-les' : 'open-les'}="${l.id}"><td class="l">${athCell(a)}</td><td>${ptag(a?.posicao)}</td><td class="l">${esc(lesNome(l))}${l.recorrente ? ' <span title="Recorrente" style="color:var(--red);font-weight:800">●</span>' : ''}</td><td class="l">${esc(regFull(l))}</td><td>${fmtD(l.data)}</td><td><b>${diasFora(l)}</b> dias</td><td>${chip(l.status)}</td><td>${fmtD(l.previsao)}</td></tr>`; }).join('')}</tbody></table></div>`;
}
function fVisao() {
  const lp = lesPeriodo(), ats = atletasCat(), at = lesAtivas();
  const atlLes = new Set(lp.map(l => l.atletaId)).size, dias = lp.reduce((s, l) => s + diasFora(l), 0);
  const ids = idsCat(); const lpPrev = F.ano === 'Todos' ? [] : S.lesoes.filter(l => ids.has(l.atletaId) && l.data.startsWith(String(+F.ano - 1)));
  const delta = lpPrev.length ? Math.round((lp.length - lpPrev.length) / lpPrev.length * 100) : null;
  const rec = lp.filter(l => l.recorrente).length, cir = lp.filter(l => l.cirurgia).length, emTrat = new Set(at.map(l => l.atletaId)).size;
  const grupos = GRUPOS_REG.map((g, i) => ({ l: g, v: lp.filter(l => REG[l.regiao]?.[1] === g).length, c: ['#e0342b', '#f6c21c', '#1b8a4a', '#2f6fd6'][i] }));
  const top = sortEnt(countBy(lp, l => regN(l.regiao))).slice(0, 5);
  const stats = ['tratamento', 'transicao', 'retorno'].map(s => ({ l: STATUS[s], v: new Set(at.filter(l => l.status === s).map(l => l.atletaId)).size, c: SCOL[s] }));
  const mediaDM = at.length ? at.reduce((s, l) => s + diasFora(l), 0) / at.length : 0;
  const tipos = sortEnt(countBy(lp, l => l.tipo));
  return `<div class="kpis">
    ${kpi('med', 'Lesões no período', lp.length, delta !== null ? `<span class="${delta > 0 ? 'up' : 'down'}">${delta > 0 ? '▲' : '▼'} ${Math.abs(delta)}%</span> vs temporada anterior` : 'Total de lesões')}
    ${kpi('user', 'Atletas lesionados', atlLes, pct(atlLes, ats.length) + ' do elenco')}
    ${kpi('cal', 'Dias de afastamento', dias, 'Média ' + nf(lp.length ? dias / lp.length : 0) + ' dias por lesão')}
    ${kpi('cross', 'Lesões recorrentes', rec, pct(rec, lp.length) + ' do total', 'red')}
    ${kpi('scalpel', 'Cirurgias', cir, pct(cir, lp.length) + ' do total')}
    ${kpi('clock', 'Em tratamento (DM)', emTrat, pct(emTrat, ats.length) + ' do elenco', 'blue')}
  </div>
  <div class="row r4">
    ${panel('Evolução de lesões por mês', lineChart(MESES, MESES.map((_, i) => lp.filter(l => +l.data.slice(5, 7) === i + 1).length), { label: 'Lesões por mês', w: 420 }))}
    ${panel('Distribuição por região', `<div class="donut-wrap">${donut(grupos, lp.length, 'LESÕES', 160)}${legend(grupos)}</div>`)}
    ${panel('Top 5 regiões', dist(top.map(([r, n], i) => ({ l: r, v: n, p: pct(n, lp.length), c: i < 2 ? 'linear-gradient(90deg,#b8221b,var(--red))' : 'linear-gradient(90deg,#d77412,var(--orange))' }))))}
    ${panel('Status dos atletas (DM)', `<div class="donut-wrap">${donut(stats, emTrat, 'ATLETAS', 160)}${legend(stats)}</div><div class="mini-stats" style="grid-template-columns:1fr;margin-top:12px"><div><span>Média de dias no DM</span><b>${nf(mediaDM)} dias</b></div></div>`)}
  </div>
  <div class="row r21">
    ${panel('Lesões recentes', tabela([...lp].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 7)), { np: true, r: `<button data-go="dm-lesionados">Ver atletas lesionados</button>` })}
    ${panel('Tipos de lesão', dist(tipos.map(([t, n]) => ({ l: t, v: n, p: pct(n, lp.length) }))) + (lp.length ? `<p style="text-align:center;margin:14px 0 0;font-family:var(--fc);font-size:18px">TOTAL: <b>${lp.length}</b> LESÕES</p>` : ''))}
  </div>`;
}
function fLesionados() {
  const ids = idsCat(), f = UI.fl, q = f.busca.toLowerCase();
  let ls = S.lesoes.filter(l => ids.has(l.atletaId));
  ls = f.status === 'ativos' ? ls.filter(l => l.status !== 'liberado') : f.status === 'todos' ? ls.filter(l => noPeriodo(l.data)) : ls.filter(l => l.status === f.status);
  if (f.regiao) ls = ls.filter(l => l.regiao === f.regiao);
  if (f.tipo) ls = ls.filter(l => l.tipo === f.tipo);
  if (q) ls = ls.filter(l => ((atl(l.atletaId)?.nome || '') + ' ' + (atl(l.atletaId)?.apelido || '')).toLowerCase().includes(q));
  ls.sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status) || b.data.localeCompare(a.data));
  if (!ls.find(l => l.id === UI.selLes)) UI.selLes = ls[0]?.id || null;
  const at = lesAtivas(), ats = atletasCat(); const n = s => new Set(at.filter(l => l.status === s).map(l => l.atletaId)).size; const noDM = new Set(at.map(l => l.atletaId)).size;
  const regs = [...new Set(S.lesoes.map(l => l.regiao))].sort((a, b) => regN(a).localeCompare(regN(b)));
  return `<div class="kpis">
    ${kpi('user', 'Atletas no DM', noDM, pct(noDM, ats.length) + ' do elenco')}
    ${kpi('band', 'Lesões ativas', at.length, 'Em acompanhamento')}
    ${kpi('cal', 'Dias de afastamento', at.reduce((s, l) => s + diasFora(l), 0), 'Somando as lesões ativas')}
    ${kpi('clock', 'Em tratamento', n('tratamento'), pct(n('tratamento'), ats.length) + ' do elenco', 'red')}
    ${kpi('run', 'Transição', n('transicao'), pct(n('transicao'), ats.length) + ' do elenco', 'gold')}
    ${kpi('cycle', 'Retorno gradual', n('retorno'), pct(n('retorno'), ats.length) + ' do elenco')}
  </div>
  <div class="row r21" style="align-items:start">
    <div class="panel"><div class="ph">Lista de lesões<span class="r">${ls.length} ${ls.length === 1 ? 'registro' : 'registros'}</span></div>
      <div class="fbar">
        <div class="f"><label>Status</label><select data-fl="status"><option value="ativos">Ativos (no DM)</option>${ORDER.map(s => `<option value="${s}">${STATUS[s]}</option>`).join('')}<option value="todos">Todas da temporada</option></select></div>
        <div class="f"><label>Região</label><select data-fl="regiao"><option value="">Todas</option>${regs.map(r => `<option value="${r}">${regN(r)}</option>`).join('')}</select></div>
        <div class="f"><label>Tipo de lesão</label><select data-fl="tipo"><option value="">Todos</option>${S.config.tipos.map(t => `<option>${esc(t)}</option>`).join('')}</select></div>
        <div class="f"><label>Buscar atleta</label><input data-fl="busca" placeholder="Nome" value="${esc(f.busca)}"></div>
        <button class="btn" data-act="limpar-fl">${IC.cycle} Limpar</button>
      </div>
      ${tabela(ls, { sel: true })}
    </div>
    <div class="panel" id="detPanel">${detalhe(S.lesoes.find(l => l.id === UI.selLes))}</div>
  </div>`;
}
function steps(l) {
  const keys = ['lesao', 'tratamento', 'transicao', 'retorno', 'liberado'], names = ['Lesão', 'Tratamento', 'Transição', 'Retorno', 'Liberado'];
  const cur = keys.indexOf(l.status);
  return `<div class="steps">${keys.map((k, i) => { const d = k === 'lesao' ? l.data : l.statusDatas?.[k]; const cls = i < cur || (k === 'liberado' && l.status === 'liberado') ? 'done' : i === cur ? 'cur' : ''; return `<div class="s ${cls}"><i>${cls === 'done' ? '✓' : ''}</i><b>${names[i]}</b>${d ? fmtDs(d) : '—'}</div>`; }).join('')}</div>`;
}
function detalhe(l) {
  if (!l) return `<div class="ph">Detalhes da lesão</div><div class="pb">${miniEmpty('Nenhuma lesão selecionada', 'Clique em uma linha da tabela.')}</div>`;
  const a = atl(l.atletaId), nx = ORDER[ORDER.indexOf(l.status) + 1];
  const rows = [['Lesão', esc(lesNome(l))], ['Região', esc(regFull(l))], ['Ponto exato', esc(l.musculo || '—')], ['Data da lesão', fmtD(l.data)], ['Local', esc(l.local)], ['Mecanismo', esc(l.mecanismo)], ['Dor (EVA)', `${l.dor ?? '—'}/10`], ['Dias afastado', `<b>${diasFora(l)}</b> dias`], ['Previsão retorno', fmtD(l.previsao)], ['Condutas', esc((l.tratamentos || []).join(', ') || '—')], ['Exames', esc(l.exames || '—')], ['Cirurgia', l.cirurgia ? 'Sim' : 'Não'], ['Recorrente', l.recorrente ? '<b style="color:var(--red)">Sim</b>' : 'Não'], ['Responsável', esc(l.responsavel || '—')], ['Status atual', chip(l.status)]];
  return `<div class="ph">Detalhes da lesão</div><div class="pb">
  <div class="det-head">${ava(a)}<div><b>${esc(a?.apelido || a?.nome)}${subTag(a)}</b><span class="muted">${a?.numero ? '#' + esc(a.numero) + ' · ' : ''}${esc(a?.categoria || '')} · ${idade(a?.nascimento)} anos</span></div><span style="margin-left:auto">${ptag(a?.posicao)}</span></div>
  <div class="det-loc">${lesThumb(l, 'lg')}<div><h4 style="margin:0 0 4px;font:800 16px var(--fc);text-transform:uppercase">${esc(lesNome(l))}</h4><div style="font-size:13.5px">${esc(regLong(l))}</div><div style="margin-top:4px">${natTag(l)}</div></div></div>
  <div class="det-sec"><h4>Evolução</h4>${steps(l)}</div>
  <div class="det-sec"><h4>Informações da lesão</h4>${rows.map(([k, v]) => `<div class="det-row"><span>${k}</span><div>${v}</div></div>`).join('')}</div>
  ${l.descricao ? `<div class="det-sec"><h4>Descrição</h4><p style="margin:0;font-size:13.5px">${esc(l.descricao)}</p></div>` : ''}
  ${l.obs ? `<div class="det-sec"><h4>Observações</h4><p style="margin:0;font-size:13.5px">${esc(l.obs)}</p></div>` : ''}
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    ${nx ? `<button class="btn pri" data-act="avancar" data-id="${l.id}">${IC.next} ${nx === 'liberado' ? 'Liberar atleta' : 'Avançar para ' + STATUS[nx]}</button>` : ''}
    <button class="btn" data-act="edit-lesao" data-id="${l.id}">${IC.edit} Editar</button>
    <button class="btn" data-act="hist" data-id="${l.atletaId}">${IC.hist} Histórico</button>
    <button class="btn danger" data-act="del-lesao" data-id="${l.id}" aria-label="Excluir lesão">${IC.trash}</button>
  </div></div>`;
}
function fHistorico() {
  const ats = atletasCat().sort((a, b) => a.nome.localeCompare(b.nome));
  if (!UI.histAtleta || !atl(UI.histAtleta)) { const c = countBy(S.lesoes.filter(l => idsCat().has(l.atletaId)), l => l.atletaId); UI.histAtleta = sortEnt(c)[0]?.[0] || ats[0]?.id; }
  const a = atl(UI.histAtleta);
  if (!a) return `<div class="empty"><h3>Nenhum atleta</h3>Cadastre atletas para ver o histórico.</div>`;
  const ls = S.lesoes.filter(l => l.atletaId === a.id).sort((x, y) => y.data.localeCompare(x.data));
  const dias = ls.reduce((s, l) => s + diasFora(l), 0), at = ativaDe(a.id), recs = ls.filter(l => l.recorrente).length;
  const regC = sortEnt(countBy(ls, l => regN(l.regiao)));
  const lsAno = ls.filter(l => noPeriodo(l.data));
  const meses = MESES.map((_, i) => lsAno.filter(l => +l.data.slice(5, 7) === i + 1).reduce((s, l) => s + diasFora(l), 0));
  const prevTxt = at && at.previsao ? (dayDiff(todayISO(), at.previsao) >= 0 ? 'Em ' + dayDiff(todayISO(), at.previsao) + ' dias' : 'Previsão vencida há ' + -dayDiff(todayISO(), at.previsao) + ' dias') : 'Sem afastamento ativo';
  return `<div class="ind-top">
    <div class="panel"><div class="ph">Atleta</div><div class="bio">${ava(a, 'lg')}<div style="min-width:0">${ptag(a.posicao)}${subTag(a)}<h3>${esc(a.apelido || a.nome)}</h3><div class="muted">${esc(a.nome)}</div></div></div>
      <div class="bio2"><div><span>Categoria</span><b>${esc(a.categoria)}${a.subcategoria ? ' · ' + esc(a.subcategoria) : ''}</b></div><div><span>Idade</span><b>${idade(a.nascimento) || '—'} anos</b></div><div><span>Nascimento</span><b>${fmtD(a.nascimento)}</b></div><div><span>Altura · Peso</span><b>${a.altura ? nf(a.altura, 2) + ' m' : '—'} · ${a.peso ? a.peso + ' kg' : '—'}</b></div><div><span>Pé dominante</span><b>${esc(a.pe || '—')}</b></div>${a.gordura ? `<div><span>% de gordura</span><b>${nf(a.gordura, 1)}%${a.avData ? ' <small class="muted" style="font:500 12px var(--fb)">(' + fmtDs(a.avData) + ')</small>' : ''}</b></div>` : ''}</div>
      <div class="pb" style="border-top:1px solid var(--line)"><div class="f"><label for="histSel">Trocar atleta</label><select id="histSel">${ats.map(x => `<option value="${x.id}" ${x.id === a.id ? 'selected' : ''}>${esc(x.nome)} (${esc(x.categoria)})</option>`).join('')}</select></div></div></div>
    <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
      <div class="kpis k4" style="margin:0">
        ${kpi('med', 'Total de lesões', ls.length, 'Histórico completo')}
        ${kpi('cal', 'Dias afastado', dias + '<small>dias</small>', 'Média ' + nf(ls.length ? dias / ls.length : 0) + ' por lesão')}
        ${kpi('clock', 'Situação atual', at ? STATUS[at.status] : 'Disponível', at ? 'Desde ' + fmtD(at.data) : ls[0] ? 'Última lesão em ' + fmtD(ls[0].data) : 'Sem lesões registradas', at ? 'red' : '', 'txt')}
        ${kpi('cycle', 'Retorno previsto', at ? fmtD(at.previsao) : '—', prevTxt, '', 'txt')}
      </div>
      <div class="row r12" style="margin:0">
        ${panel('Regiões afetadas', bodyMap({ mode: 'hl', ls }))}
        <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
          ${panel('Resumo do histórico', `<div class="mini-stats"><div><span>Total de lesões</span><b>${ls.length}</b></div><div><span>Dias afastado</span><b>${dias}</b></div><div><span>Média por lesão</span><b>${nf(ls.length ? dias / ls.length : 0)}</b></div><div><span>Recorrências</span><b>${recs}</b></div></div><div style="margin-top:14px">${dist(regC.map(([r, n]) => ({ l: r, v: n, p: pct(n, ls.length) })))}</div>`)}
          ${panel('Dias afastados por mês · ' + anoLabel(), vbars(MESES, meses, { w: 520 }))}
        </div>
      </div>
    </div>
  </div>
  ${panel('Histórico de lesões', ls.length ? ls.map((l, i) => `<div class="hist-item ${i === 0 ? 'open' : ''}">
    <button class="hist-h" data-toggle aria-expanded="${i === 0}">${lesThumb(l)}<span><b>${esc(lesNome(l))}</b><small>${esc(regLong(l))}</small><small>${natTag(l)}${l.recorrente ? ' <span style="color:var(--red);font-weight:700">· Recorrente</span>' : ''}</small></span><span class="hsm"><b>${fmtD(l.data)}</b><small>${l.local === 'Jogo' ? 'Durante o jogo' : l.local === 'Treino' ? 'Durante o treino' : 'Fora do clube'}</small></span><span><b>${diasFora(l)} dias</b><small>afastado</small></span><span class="hmd"><small>${esc((l.tratamentos || []).slice(0, 3).join(' · ') || '—')}</small></span><span class="hmd"><b>${fmtD(l.statusDatas?.liberado || l.previsao)}</b><small>${l.status === 'liberado' ? 'Retornou' : 'Previsto'}</small></span><span class="hsm">${chip(l.status)}</span><span class="chev">${IC.chev}</span></button>
    <div class="hist-b"><div><h5>Mecanismo</h5><p>${esc(l.mecanismo)}</p><h5>Dor (EVA)</h5><p>${l.dor ?? '—'}/10</p></div><div><h5>Descrição</h5><p>${esc(l.descricao || '—')}</p></div><div><h5>Exames realizados</h5><p>${esc(l.exames || '—')}</p><h5>Cirurgia</h5><p>${l.cirurgia ? 'Sim' : 'Não'}</p></div><div><h5>Observações</h5><p>${esc(l.obs || '—')}</p><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm" data-act="edit-lesao" data-id="${l.id}">${IC.edit} Editar</button>${l.status !== 'liberado' ? `<button class="btn sm pri" data-act="avancar" data-id="${l.id}">${IC.next} Avançar</button>` : ''}</div></div></div>
  </div>`).join('') : miniEmpty('Sem lesões registradas', 'Este atleta não teve passagem pelo DM.'), { np: true, r: `<button data-act="print-ind" data-id="${a.id}">Relatório individual</button> <button data-act="lesao-atleta" data-id="${a.id}">+ Nova lesão</button>` })}`;
}
function fRegioes() {
  const lp = lesPeriodo(), tot = lp.length, dias = lp.reduce((s, l) => s + diasFora(l), 0);
  const byR = sortEnt(countBy(lp, l => l.regiao)); const main = byR.slice(0, 7), rest = byR.slice(7);
  const rows = main.map(([r, n], i) => { const ls = lp.filter(l => l.regiao === r); const d = ls.reduce((s, l) => s + diasFora(l), 0); return { r: regN(r), n, d, m: d / n, at: new Set(ls.map(l => l.atletaId)).size, c: PAL[i] }; });
  if (rest.length) { const ls = lp.filter(l => rest.some(([r]) => r === l.regiao)); const d = ls.reduce((s, l) => s + diasFora(l), 0); rows.push({ r: 'Outras regiões', n: ls.length, d, m: d / ls.length, at: new Set(ls.map(l => l.atletaId)).size, c: '#8a948f' }); }
  const emTrat = new Set(lesAtivas().map(l => l.atletaId)).size, afet = new Set(lp.map(l => l.atletaId)).size;
  const now = new Date(); const endM = F.ano === String(now.getFullYear()) ? now.getMonth() : 11; const ms = []; for (let m = Math.max(0, endM - 5); m <= endM; m++) ms.push(m);
  const topR = byR.slice(0, 5).map(x => x[0]);
  const series = topR.map((r, i) => ({ l: regN(r), c: PAL[i], vals: ms.map(m => lp.filter(l => l.regiao === r && +l.data.slice(5, 7) === m + 1).length) }));
  series.push({ l: 'Outras', c: '#8a948f', vals: ms.map(m => lp.filter(l => !topR.includes(l.regiao) && +l.data.slice(5, 7) === m + 1).length) });
  const top = segTop(lp);
  return `<div class="kpis k5">
    ${kpi('globe', 'Total de lesões', tot, 'Temporada ' + anoLabel())}
    ${kpi('user', 'Atletas afetados', afet, pct(afet, atletasCat().length) + ' do elenco')}
    ${kpi('cal', 'Dias afastados', dias, 'Média ' + nf(tot ? dias / tot : 0) + ' dias por lesão')}
    ${kpi('clock', 'Em tratamento (DM)', emTrat, pct(emTrat, atletasCat().length) + ' do elenco')}
    ${kpi('bars', 'Região mais afetada', byR[0] ? regN(byR[0][0]) : '—', byR[0] ? `${byR[0][1]} lesões (${pct(byR[0][1], tot)})` : 'Sem lesões', '', 'txt')}
  </div>
  <div class="row r2">
    ${panel('Mapa de lesões por região', `<div style="display:grid;grid-template-columns:1fr 200px;gap:14px;align-items:center">${bodyMap({ mode: 'heat', ls: lp })}<div class="legend">${top.map(x => `<div class="li"><span class="sw" style="background:${x.c}"></span><div><b>${esc(x.l)}</b><span>${esc(x.r)} · ${x.v} (${pct(x.v, tot)})</span></div></div>`).join('') || '<span class="muted">Sem lesões no período.</span>'}</div></div><div class="heatbar">Passe o mouse sobre o músculo para ver os detalhes · D = direito, E = esquerdo</div>`)}
    ${panel('Distribuição de lesões por região', tot ? `<div class="donut-wrap" style="margin-bottom:12px">${donut(rows.map(x => ({ l: x.r, v: x.n, c: x.c })), tot, 'LESÕES', 170)}</div><div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Região</th><th>Lesões</th><th>%</th><th>Atletas</th><th>Dias afastados</th><th>Média de dias</th></tr></thead><tbody>${rows.map(x => `<tr><td class="l"><span class="sq" style="background:${x.c}"></span>${esc(x.r)}</td><td>${x.n}</td><td>${pct(x.n, tot)}</td><td>${x.at}</td><td>${x.d}</td><td>${nf(x.m)}</td></tr>`).join('')}</tbody><tfoot><tr><td class="l">TOTAL</td><td>${tot}</td><td>100%</td><td>${afet}</td><td>${dias}</td><td>${nf(dias / tot)}</td></tr></tfoot></table></div>` : miniEmpty('Sem lesões', 'na temporada selecionada.'))}
  </div>
  <div class="row r2">
    ${panel('Evolução por região (últimos 6 meses)', stacked(ms.map(m => MESES[m]), series, { w: 520 }) + `<div class="legend-status" style="margin-top:8px;justify-content:center">${series.map(s => `<span><span class="sq" style="background:${s.c}"></span>${esc(s.l)}</span>`).join('')}</div>`)}
    ${panel('Média de dias afastados por região', dist([...rows].sort((a, b) => b.m - a.m).map(x => ({ l: x.r, v: x.m, t: nf(x.m), sw: x.c, c: x.c }))))}
  </div>`;
}
function fTempo() {
  const lp = lesPeriodo(), tot = lp.length, dl = lp.map(diasFora), dias = dl.reduce((a, b) => a + b, 0);
  const at = lesAtivas(), noDM = new Set(at.map(l => l.atletaId)).size, maior = [...lp].sort((a, b) => diasFora(b) - diasFora(a))[0];
  const faixas = [['1 – 7 dias', 0, 7, '#1b8a4a'], ['8 – 14 dias', 8, 14, '#f6c21c'], ['15 – 30 dias', 15, 30, '#f39324'], ['31 – 60 dias', 31, 60, '#e0342b'], ['+ de 60 dias', 61, 1e9, '#7a3fd1']].map(([l, a, b, c]) => ({ l, c, v: dl.filter(d => d >= a && d <= b).length }));
  let acc = 0; const cum = MESES.map((_, i) => (acc += lp.filter(l => +l.data.slice(5, 7) === i + 1).reduce((s, l) => s + diasFora(l), 0)));
  const nowM = F.ano === String(new Date().getFullYear()) ? new Date().getMonth() : 11;
  const porTipo = sortEnt(sumBy(lp, l => l.tipo, diasFora)), longos = [...lp].sort((a, b) => diasFora(b) - diasFora(a)).slice(0, 7), porAtl = sortEnt(sumBy(lp, l => l.atletaId, diasFora)).slice(0, 8);
  return `<div class="kpis k5">
    ${kpi('cal', 'Dias afastados (acum.)', dias, 'Temporada ' + anoLabel())}
    ${kpi('clock', 'Média por lesão', nf(tot ? dias / tot : 0) + '<small>dias</small>', 'Temporada ' + anoLabel())}
    ${kpi('run', 'Afastados agora', noDM, pct(noDM, atletasCat().length) + ' do elenco')}
    ${kpi('trend', 'Maior afastamento', maior ? diasFora(maior) + '<small>dias</small>' : '—', maior ? esc(lesNome(maior)) + ' · ' + esc((atl(maior.atletaId)?.nome || '').split(' ')[0]) : '', 'red')}
    ${kpi('cal', 'Mediana', nf(median(dl), 0) + '<small>dias</small>', 'Temporada ' + anoLabel())}
  </div>
  <div class="row r3">
    ${panel('Lesões por faixa de afastamento', `<div class="donut-wrap" style="margin-bottom:10px">${donut(faixas, tot, 'LESÕES', 160)}</div><div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Faixa de dias</th><th>Lesões</th><th>%</th></tr></thead><tbody>${faixas.map(f => `<tr><td class="l"><span class="sq" style="background:${f.c}"></span>${f.l}</td><td>${f.v}</td><td>${pct(f.v, tot)}</td></tr>`).join('')}</tbody><tfoot><tr><td class="l">TOTAL</td><td>${tot}</td><td>100%</td></tr></tfoot></table></div>`)}
    ${panel('Dias afastados (acumulado)', lineChart(MESES.slice(0, nowM + 1), cum.slice(0, nowM + 1), { label: 'Dias acumulados', min: 10, w: 440, h: 300, noVal: nowM > 7 }))}
    ${panel('Dias por tipo de lesão', dist(porTipo.map(([t, d]) => ({ l: t, v: d, p: pct(d, dias) }))))}
  </div>
  <div class="row r21">
    ${panel('Maiores tempos de afastamento', tabela(longos), { np: true })}
    ${panel('Tempo por atleta', porAtl.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Atleta</th><th>Dias</th><th>Média</th></tr></thead><tbody>${porAtl.map(([id, d]) => { const n = lp.filter(l => l.atletaId === id).length; return `<tr class="click" data-hist="${id}"><td class="l">${athCell(atl(id))}</td><td><b>${d}</b></td><td>${nf(d / n)}</td></tr>`; }).join('')}</tbody></table></div>` : miniEmpty('Sem dados'), { np: true })}
  </div>`;
}
function fComparativo() {
  const ids = idsCat(); const ano = F.ano === 'Todos' ? String(new Date().getFullYear()) : F.ano, prev = String(+ano - 1);
  const A = S.lesoes.filter(l => ids.has(l.atletaId) && l.data.startsWith(ano)), P = S.lesoes.filter(l => ids.has(l.atletaId) && l.data.startsWith(prev));
  const sd = ls => ls.reduce((s, l) => s + diasFora(l), 0);
  const cmp = (icon, label, a, p, fmt = x => x) => { const d = p ? Math.round((a - p) / p * 100) : null; return kpi(icon, label, `${fmt(a)} <small style="color:var(--ink3)">vs ${fmt(p)}</small>`, d === null ? `Sem base em ${prev}` : `<span class="${d > 0 ? 'up' : 'down'}">${d > 0 ? '▲' : '▼'} ${Math.abs(d)}%</span> em relação a ${prev}`); };
  const cats = Object.keys(GRUPOS).filter(c => S.atletas.some(a => a.categoria === c));
  const catRows = cats.map(c => { const as = S.atletas.filter(a => a.categoria === c); const ls = S.lesoes.filter(l => l.data.startsWith(ano) && as.some(a => a.id === l.atletaId)); const d = sd(ls); return { c, el: as.length, n: ls.length, at: new Set(ls.map(l => l.atletaId)).size, d, m: ls.length ? d / ls.length : 0, taxa: as.length ? ls.length / as.length : 0 }; });
  const maxT = Math.max(.01, ...catRows.map(x => x.taxa));
  const local = LOCAIS.map((l, i) => ({ l, v: A.filter(x => x.local === l).length, c: ['#e0342b', '#1b8a4a', '#2f6fd6'][i] }));
  const pos = POS.map(p => ({ l: POSN[p], v: A.filter(l => atl(l.atletaId)?.posicao === p).length, c: PC1[p] })).filter(x => x.v);
  return `<div class="kpis k4">
    ${cmp('med', 'Lesões', A.length, P.length)}
    ${cmp('user', 'Atletas lesionados', new Set(A.map(l => l.atletaId)).size, new Set(P.map(l => l.atletaId)).size)}
    ${cmp('cal', 'Dias de afastamento', sd(A), sd(P))}
    ${cmp('clock', 'Média por lesão', A.length ? sd(A) / A.length : 0, P.length ? sd(P) / P.length : 0, x => nf(x))}
  </div>
  <div class="row r21">
    ${panel(`Lesões por mês · ${ano} x ${prev}`, lineChart(MESES, MESES.map((_, i) => A.filter(l => +l.data.slice(5, 7) === i + 1).length), { second: MESES.map((_, i) => P.filter(l => +l.data.slice(5, 7) === i + 1).length), label: 'Comparativo mensal' }) + `<div class="legend-status" style="justify-content:center"><span><span class="sq" style="background:var(--g500)"></span>${ano}</span><span><span class="sq" style="background:var(--gold)"></span>${prev} (tracejado)</span></div>`)}
    ${panel('Onde aconteceram · ' + ano, `<div class="donut-wrap">${donut(local, A.length, 'LESÕES', 160)}${legend(local)}</div>`)}
  </div>
  <div class="row" style="grid-template-columns:1fr">${panel('Comparativo entre categorias · ' + ano, catRows.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th class="l">Categoria</th><th>Elenco</th><th>Lesões</th><th>Atletas lesionados</th><th>% do elenco</th><th>Dias afastados</th><th>Média de dias</th><th style="min-width:200px">Lesões por atleta</th></tr></thead><tbody>${catRows.map(r => `<tr><td class="l"><b>${esc(r.c)}</b></td><td>${r.el}</td><td>${r.n}</td><td>${r.at}</td><td>${pct(r.at, r.el)}</td><td>${r.d}</td><td>${nf(r.m)}</td><td><div style="display:flex;align-items:center;gap:8px"><div class="track" style="flex:1"><i style="width:${(r.taxa / maxT * 100).toFixed(0)}%"></i></div><b style="font-family:var(--fc);font-size:15px">${nf(r.taxa, 2)}</b></div></td></tr>`).join('')}</tbody></table></div>` : miniEmpty('Sem categorias'), { np: true })}</div>
  <div class="row r2">
    ${panel('Por mecanismo da lesão', dist(sortEnt(countBy(A, l => l.mecanismo)).map(([m, n]) => ({ l: m, v: n, p: pct(n, A.length) }))))}
    ${panel('Por posição', dist(pos.map(x => ({ l: x.l, v: x.v, p: pct(x.v, A.length), c: x.c, sw: x.c }))))}
  </div>`;
}

/* ================= CONFIGURAÇÕES ================= */
function vConfig() {
  const th = document.documentElement.dataset.theme || 'auto';
  const tl = (k, arr) => `<div class="taglist">${arr.map((t, i) => `<span>${esc(t)}<button data-act="tagDel" data-k="${k}" data-i="${i}" aria-label="Remover ${esc(t)}">×</button></span>`).join('')}</div><div class="row-add"><input id="add_${k}" placeholder="Adicionar…"><button class="btn sm pri" data-act="tagAdd" data-k="${k}">${IC.plus} Adicionar</button></div>`;
  const thBtn = (v, n, cols) => `<button data-act="setTheme" data-v="${v}" class="${th === v ? 'on' : ''}"><span class="pv">${cols.map(c => `<i style="flex:1;background:${c}"></i>`).join('')}</span>${n}</button>`;
  return `<div class="page-h"><h2>Configurações</h2><span class="muted">Ajustes do módulo de Fisioterapia / DM</span></div><div class="cfg-grid">
    ${panel('Aparência', `<p class="muted" style="margin-top:0">Escolha o tema do sistema. A escolha fica salva neste navegador e vale também para o Sistema de Minutagem.</p><div class="themes">${thBtn('light', 'Claro', ['#0a3a20', '#eef2ef', '#ffffff'])}${thBtn('dark', 'Escuro', ['#0a3a20', '#0c1410', '#141e19'])}${thBtn('auto', 'Automático', ['#0a3a20', '#eef2ef', '#141e19'])}</div>`)}
    ${panel('Temporada e categorias', `<div style="display:flex;align-items:center;gap:10px"><span style="flex:1"><b>Ano-base</b> <span class="muted" style="font-size:12.5px">define a subcategoria pela idade (mesma regra da Minutagem)</span></span><input type="number" id="cfgAno" min="2015" max="2040" value="${S.config.anoBase}" style="width:90px;border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:var(--card2)"></div><p class="muted" style="font-size:12.5px;margin-bottom:0">Categorias: ${Object.entries(GRUPOS).map(([g, s]) => `<b>${g}</b> (${s.join(', ')})`).join(' · ')}</p>`)}
    ${panel('Tipos de lesão', tl('tipos', S.config.tipos))}
    ${panel('Condutas / tratamentos', tl('condutas', S.config.condutas))}
    ${panel('Mecanismos de lesão', tl('mecanismos', S.config.mecanismos))}
    ${panel('Nutrição · faixa-alvo de gordura', `<p class="muted" style="margin-top:0">Usada para classificar as avaliações (abaixo, na faixa, atenção, acima). Referência comum no futebol de base: 8 a 14%.</p><div style="display:flex;gap:12px;align-items:center"><label class="f" style="flex:1"><span>Mínimo (%)</span><input type="number" id="cfgAlvoMin" min="3" max="30" step="0.5" value="${alvo().min}"></label><label class="f" style="flex:1"><span>Máximo (%)</span><input type="number" id="cfgAlvoMax" min="5" max="35" step="0.5" value="${alvo().max}"></label></div>`)}
    ${panel('Profissionais do DM', `<p class="muted" style="margin-top:0">Aparecem como responsável no registro da lesão.</p><div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px">${(S.config.profissionais || []).map((p, i) => `<div style="display:flex;gap:6px;align-items:center"><input data-prof="${i}" data-k="nome" value="${esc(p.nome)}" placeholder="Nome" style="flex:1;min-width:0;border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:var(--card2)"><input data-prof="${i}" data-k="cargo" value="${esc(p.cargo || '')}" placeholder="Cargo" style="flex:1.2;min-width:0;border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:var(--card2)"><button class="icon-btn" data-act="profDel" data-i="${i}" aria-label="Remover">${IC.trash}</button></div>`).join('')}</div><button class="btn sm" data-act="profAdd">${IC.plus} Adicionar profissional</button>`)}
    ${panel('Backup dos dados', `<p class="muted" style="margin-top:0">${S.online ? 'Os dados ficam salvos na nuvem deste sistema e aparecem para todos com acesso.' : 'Os dados estão salvos apenas neste navegador.'} Faça uma cópia de segurança periodicamente.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri" data-act="backup">${IC.down} Baixar backup (.json)</button><label class="btn" style="cursor:pointer">${IC.upload} Restaurar backup<input type="file" id="restore" accept=".json,application/json" hidden></label></div><p class="muted" style="font-size:12.5px;margin-bottom:0">${S.atletas.length} atletas · ${S.lesoes.length} lesões registradas</p>`)}
  </div>`;
}
function setTheme(v) { if (v === 'auto') { delete document.documentElement.dataset.theme; try { localStorage.removeItem('pv_theme'); } catch (e) { } } else { document.documentElement.dataset.theme = v; try { localStorage.setItem('pv_theme', v); } catch (e) { } } render(); }

/* ================= MODAIS ================= */
const modalBg = $('#modalBg'), modal = $('#modal');
function openModal(html, xl) { modal.className = 'modal' + (xl ? ' xl' : ''); modal.innerHTML = html; modalBg.classList.add('open'); setTimeout(() => modal.querySelector('input:not([type=hidden]),select,textarea')?.focus(), 30); }
function closeModal() { modalBg.classList.remove('open'); modal.innerHTML = ''; }
modalBg.addEventListener('mousedown', e => { if (e.target === modalBg) closeModal(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && modalBg.classList.contains('open')) closeModal(); });
const opts = (arr, v) => arr.map(x => `<option ${x === v ? 'selected' : ''}>${esc(x)}</option>`).join('');
const mh = t => `<div class="mh"><h3>${t}</h3><button class="icon-btn" data-act="close" aria-label="Fechar">${IC.x}</button></div>`;

function formAtleta(a = {}) {
  const cat = a.categoria || (F.categoria !== 'Todas' ? F.categoria : 'Sub-15'); const pos = a.posicao || 'MEI';
  openModal(mh(a.id ? 'Editar atleta' : 'Cadastrar atleta') + `<form id="fAtl"><div class="mb"><div class="form">
    <div class="f s2"><label for="fNome">Nome completo *</label><input id="fNome" name="nome" required value="${esc(a.nome || '')}"></div>
    <div class="f"><label for="fApel">Apelido</label><input id="fApel" name="apelido" value="${esc(a.apelido || '')}"></div>
    <div class="f"><label for="fNum">Número</label><input id="fNum" name="numero" type="number" min="0" max="99" value="${esc(a.numero ?? '')}"></div>
    <div class="f"><label for="fNasc">Nascimento</label><input id="fNasc" name="nascimento" type="date" value="${esc(a.nascimento || '')}"><span class="hint" id="fIdade">${a.nascimento ? idade(a.nascimento) + ' anos' : ''}</span></div>
    <div class="f"><label for="fCat">Categoria *</label><select id="fCat" name="categoria">${opts(Object.keys(GRUPOS), cat)}</select></div>
    <div class="f"><label for="fSub">Subcategoria</label><select id="fSub" name="subcategoria"><option value="">—</option>${opts(GRUPOS[cat], a.subcategoria)}</select><span class="hint" id="fSubH"></span></div>
    <div class="f"><label for="fPe">Pé dominante</label><select id="fPe" name="pe">${opts(['Direito', 'Esquerdo', 'Ambidestro'], a.pe || 'Direito')}</select></div>
    <div class="f"><label for="fPos">Posição *</label><select id="fPos" name="posicao">${POS.map(p => `<option value="${p}" ${p === pos ? 'selected' : ''}>${p} · ${POSN[p]}</option>`).join('')}</select></div>
    <div class="f"><label for="fPosD">Função</label><select id="fPosD" name="posDetalhe">${opts(POSDET[pos], a.posDetalhe)}</select></div>
    <div class="f"><label for="fAlt">Altura (m)</label><input id="fAlt" name="altura" type="number" step="0.01" min="1" max="2.3" value="${esc(a.altura ?? '')}"></div>
    <div class="f"><label for="fPeso">Peso (kg)</label><input id="fPeso" name="peso" type="number" step="0.1" min="20" max="140" value="${esc(a.peso ?? '')}"></div>
    <div class="f"><label for="fGord">% de gordura</label><input id="fGord" name="gordura" type="number" step="0.1" min="2" max="50" value="${esc(a.gordura ?? '')}"></div>
    ${a.avData ? `<div class="f s4"><span class="hint">Peso, estatura e % de gordura são atualizados automaticamente pela última avaliação corporal (${fmtD(a.avData)}).</span></div>` : ''}
  </div></div><div class="mf"><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} ${a.id ? 'Salvar alterações' : 'Cadastrar atleta'}</button></div></form>`);
  const fm = $('#fAtl');
  fm.categoria.onchange = () => { fm.subcategoria.innerHTML = '<option value="">—</option>' + opts(GRUPOS[fm.categoria.value]); };
  fm.posicao.onchange = () => { fm.posDetalhe.innerHTML = opts(POSDET[fm.posicao.value]); };
  fm.nascimento.oninput = e => { const i = idade(e.target.value); $('#fIdade').textContent = i !== '' ? i + ' anos' : ''; const q = subPorIdade(e.target.value, S.config.anoBase); if (q.cat) { fm.categoria.value = q.cat; fm.subcategoria.innerHTML = '<option value="">—</option>' + opts(GRUPOS[q.cat], q.sub); $('#fSubH').textContent = `Pela idade em ${S.config.anoBase}: ${q.sub}`; } };
  fm.onsubmit = e => {
    e.preventDefault(); const f = new FormData(fm);
    const o = { ...a, id: a.id || uid('a'), nome: f.get('nome').trim(), apelido: f.get('apelido').trim(), numero: f.get('numero'), nascimento: f.get('nascimento'), categoria: f.get('categoria'), subcategoria: f.get('subcategoria'), posicao: f.get('posicao'), posDetalhe: f.get('posDetalhe'), pe: f.get('pe'), altura: f.get('altura'), peso: f.get('peso'), gordura: f.get('gordura') };
    save('atletas', o); closeModal(); toast(a.id ? 'Atleta atualizado' : 'Atleta cadastrado');
  };
}

let pick = { regiao: '', lado: '', musculo: '' };
function formLesao(l = {}, atletaId) {
  if (!S.atletas.length) { toast('Cadastre um atleta antes de registrar lesões', true); return; }
  pick = { regiao: l.regiao || '', lado: l.lado || '', musculo: l.musculo || '' };
  const ats = [...S.atletas].sort((a, b) => a.nome.localeCompare(b.nome)); const sel = l.atletaId || atletaId || '';
  const tipos = [...new Set([...S.config.tipos, ...(l.tipo ? [l.tipo] : [])])], mecs = [...new Set([...S.config.mecanismos, ...(l.mecanismo ? [l.mecanismo] : [])])], conds = [...new Set([...S.config.condutas, ...(l.tratamentos || [])])];
  const profs = (S.config.profissionais || []).map(p => p.nome).filter(Boolean);
  openModal(mh(l.id ? 'Editar lesão' : 'Registrar lesão no DM') + `<form id="fLes"><div class="mb">
    <div class="imp-hint">${IC.upload}<span>Tem um histórico de lesões em planilha? <button type="button" class="linkbtn" data-act="imp-lesoes">Importar lesões do Excel</button></span></div>
    <div class="fsec">Atleta e ocorrência</div>
    <div class="form">
      <div class="f s2"><label for="lAtl">Atleta *</label><select id="lAtl" name="atletaId"><option value="">Selecione o atleta</option>${ats.map(a => `<option value="${a.id}" ${a.id === sel ? 'selected' : ''}>${esc(a.nome)} · ${esc(a.posicao)} · ${esc(a.subcategoria || a.categoria)}</option>`).join('')}</select></div>
      <div class="f"><label for="lData">Data da lesão *</label><input id="lData" type="date" name="data" required value="${esc(l.data || todayISO())}" max="${todayISO()}"></div>
      <div class="f"><label for="lLocal">Onde aconteceu</label><select id="lLocal" name="local">${opts(LOCAIS, l.local || 'Treino')}</select></div>
      <div class="f s2"><label for="lMec">Mecanismo</label><select id="lMec" name="mecanismo">${opts(mecs, l.mecanismo || mecs[0])}</select></div>
      <div class="f s2"><label for="lResp">Responsável pelo atendimento</label><select id="lResp" name="responsavel"><option value="">—</option>${opts(profs, l.responsavel)}</select></div>
    </div>
    <div class="fsec">Local da dor</div>
    <div class="split">
      <div class="mappick"><div id="pickMap">${bodyMap({ mode: 'pick', sel: pick })}</div><div class="picked" id="pickedTxt"></div></div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <p class="muted" style="margin:0;font-size:13px">Clique no músculo exato onde o atleta sente dor: a área entre as linhas fica marcada. Na vista de frente o lado direito do atleta fica à esquerda da tela; na de costas, à direita.</p>
        <div class="form" style="grid-template-columns:1fr 1fr">
          <div class="f"><label for="regSel">Região *</label><select id="regSel"><option value="">Selecione no corpo ou aqui</option>${Object.keys(REG).map(r => `<option value="${r}">${regN(r)}</option>`).join('')}</select></div>
          <div class="f"><label for="muscSel">Músculo / ponto exato</label><select id="muscSel"></select></div>
          <div class="f"><span>Lado</span><div class="seg2" id="ladoSeg">${[['D', 'Direito'], ['E', 'Esquerdo'], ['', 'Central']].map(([v, t]) => `<label><input type="radio" name="lado" value="${v}">${t}</label>`).join('')}</div></div>
          <div class="f"><label for="lTipo">Tipo de lesão *</label><select id="lTipo" name="tipo">${opts(tipos, l.tipo || tipos[0])}</select></div>
          <div class="f"><label for="lGrau">Grau</label><select id="lGrau" name="grau">${opts(GRAUS, l.grau || '—')}</select></div>
        </div>
        <div class="f"><span>Intensidade da dor (EVA 0–10)</span><div class="eva"><input type="range" min="0" max="10" name="dor" value="${l.dor ?? 5}" aria-label="Intensidade da dor"><b id="evaV">${l.dor ?? 5}</b></div></div>
        <div id="recHint" class="hint warn2"></div>
      </div>
    </div>
    <div class="fsec">Afastamento e tratamento</div>
    <div class="form">
      <div class="f"><label for="diasEst">Dias estimados fora</label><input id="diasEst" type="number" min="0" max="400" value="${l.previsao && l.data ? dayDiff(l.data, l.previsao) : ''}"></div>
      <div class="f"><label for="prevInp">Previsão de retorno</label><input id="prevInp" type="date" name="previsao" value="${esc(l.previsao || '')}"></div>
      <div class="f"><label for="lSt">Status *</label><select id="lSt" name="status">${ORDER.map(s => `<option value="${s}" ${(l.status || 'tratamento') === s ? 'selected' : ''}>${STATUS[s]}</option>`).join('')}</select></div>
      <div class="f"><span>Cirurgia</span><div class="seg2"><label><input type="radio" name="cirurgia" value="0" ${!l.cirurgia ? 'checked' : ''}>Não</label><label><input type="radio" name="cirurgia" value="1" ${l.cirurgia ? 'checked' : ''}>Sim</label></div></div>
      <div class="f s4"><span>Condutas / tratamento</span><div class="tchips">${conds.map(t => `<label><input type="checkbox" name="trat" value="${esc(t)}" ${(l.tratamentos || []).includes(t) ? 'checked' : ''}>${esc(t)}</label>`).join('')}</div></div>
      <div class="f s2"><label for="lEx">Exames realizados</label><input id="lEx" name="exames" placeholder="Ex.: Ultrassom muscular (13/05)" value="${esc(l.exames || '')}"></div>
      <div class="f s2" style="justify-content:flex-end"><label class="chk" style="text-transform:none;font-size:14px;color:var(--ink);letter-spacing:0"><input type="checkbox" name="recorrente" id="recChk" ${l.recorrente ? 'checked' : ''}>Lesão recorrente</label></div>
      <div class="f s2"><label for="lDesc">Descrição da lesão</label><textarea id="lDesc" name="descricao" placeholder="Como aconteceu, sintomas, avaliação clínica">${esc(l.descricao || '')}</textarea></div>
      <div class="f s2"><label for="lObs">Observações</label><textarea id="lObs" name="obs" placeholder="Evolução, cuidados, controle de carga">${esc(l.obs || '')}</textarea></div>
    </div>
  </div><div class="mf"><span class="msg" id="lesErr"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} ${l.id ? 'Salvar alterações' : 'Registrar lesão'}</button></div></form>`, true);
  const form = $('#fLes');
  form.dor.oninput = e => $('#evaV').textContent = e.target.value;
  const sync = () => {
    $$('#pickMap [data-seg]').forEach(p => p.classList.toggle('sel', !!pick.regiao && segMatch(SEGS[+p.dataset.seg], pick)));
    $('#regSel').value = pick.regiao;
    const ms = SEGS.filter(sg => sg[0] === pick.regiao && (!pick.lado || !sg[1] || sg[1] === pick.lado));
    $('#muscSel').innerHTML = pick.regiao ? `<option value="">Região inteira</option>` + ms.map(sg => `<option value="${esc(sg[2] + '|' + sg[1])}" ${pick.musculo === sg[2] && (pick.lado || '') === sg[1] ? 'selected' : ''}>${esc(sg[2])}${sg[1] && !pick.lado ? ' (' + sg[1] + ')' : ''}</option>`).join('') : '<option value="">Escolha a região primeiro</option>';
    $('#muscSel').disabled = !pick.regiao;
    $$('#ladoSeg input').forEach(i => { i.checked = i.value === pick.lado; i.disabled = pick.regiao ? (REG[pick.regiao][2] ? i.value === '' : false) : false; });
    $('#pickedTxt').innerHTML = pick.regiao ? `${regN(pick.regiao)}${pick.musculo ? ' · ' + esc(pick.musculo) : ''}${pick.lado ? ` <span>· lado ${pick.lado === 'D' ? 'direito' : 'esquerdo'}</span>` : ''}` : '<span>Nenhuma região selecionada</span>';
    const aid = form.atletaId.value; const prev = aid && pick.regiao ? S.lesoes.filter(x => x.atletaId === aid && x.id !== l.id && x.regiao === pick.regiao && (x.lado || '') === pick.lado && x.data < form.data.value && dayDiff(x.data, form.data.value) <= 365) : [];
    $('#recHint').textContent = prev.length ? `Atenção: este atleta já teve lesão nessa região em ${fmtD(prev[0].data)} (${prev[0].tipo}). Marcada como recorrente.` : '';
    if (prev.length && !l.id) $('#recChk').checked = true;
  };
  const choose = t => { const sg = SEGS[+t.dataset.seg]; pick = { regiao: sg[0], lado: sg[1], musculo: sg[2] }; sync(); };
  $('#pickMap').addEventListener('click', e => { const t = e.target.closest('[data-seg]'); if (t) choose(t); });
  $('#pickMap').addEventListener('keydown', e => { if (e.key !== 'Enter' && e.key !== ' ') return; const t = e.target.closest('[data-seg]'); if (t) { e.preventDefault(); choose(t); } });
  $('#regSel').onchange = e => { const r = e.target.value; pick = { regiao: r, lado: r && REG[r][2] ? (pick.lado || 'D') : '', musculo: '' }; sync(); };
  $('#muscSel').onchange = e => { const [m, ld] = e.target.value.split('|'); pick.musculo = m || ''; if (m) pick.lado = ld || ''; sync(); };
  $$('#ladoSeg input').forEach(i => i.onchange = () => { pick.lado = i.value; if (pick.musculo && !SEGS.some(sg => sg[0] === pick.regiao && sg[2] === pick.musculo && sg[1] === pick.lado)) pick.musculo = ''; sync(); });
  form.atletaId.onchange = sync;
  form.data.onchange = () => { if ($('#diasEst').value) $('#prevInp').value = addDays(form.data.value, +$('#diasEst').value); sync(); };
  $('#diasEst').oninput = e => { if (e.target.value !== '' && form.data.value) $('#prevInp').value = addDays(form.data.value, +e.target.value); };
  $('#prevInp').onchange = e => { if (e.target.value && form.data.value) $('#diasEst').value = dayDiff(form.data.value, e.target.value); };
  sync();
  form.onsubmit = e => {
    e.preventDefault(); const f = new FormData(form); const err = $('#lesErr');
    if (!f.get('atletaId')) return err.textContent = 'Selecione o atleta.';
    if (!pick.regiao) return err.textContent = 'Marque o local da dor no corpo ou escolha a região.';
    if (REG[pick.regiao][2] && !pick.lado) return err.textContent = 'Informe o lado (direito ou esquerdo).';
    const status = f.get('status'); const sd = { ...(l.statusDatas || {}) };
    sd.tratamento = sd.tratamento && l.data === f.get('data') ? sd.tratamento : f.get('data');
    ORDER.slice(1, ORDER.indexOf(status) + 1).forEach(s => { if (!sd[s]) sd[s] = todayISO(); });
    ORDER.slice(ORDER.indexOf(status) + 1).forEach(s => delete sd[s]);
    const o = { ...l, id: l.id || uid('l'), atletaId: f.get('atletaId'), data: f.get('data'), local: f.get('local'), mecanismo: f.get('mecanismo'), responsavel: f.get('responsavel'), tipo: f.get('tipo'), grau: f.get('grau'), regiao: pick.regiao, lado: pick.lado, musculo: pick.musculo || '', dor: +f.get('dor'), descricao: f.get('descricao').trim(), exames: f.get('exames').trim(), tratamentos: f.getAll('trat'), previsao: f.get('previsao') || '', status, statusDatas: sd, cirurgia: f.get('cirurgia') === '1', recorrente: !!f.get('recorrente'), obs: f.get('obs').trim(), criadoEm: l.criadoEm || todayISO() };
    save('lesoes', o); UI.selLes = o.id; closeModal(); toast(l.id ? 'Lesão atualizada' : 'Lesão registrada no DM');
  };
}
function confirmar(msg, onOk) {
  openModal(mh('Confirmar exclusão') + `<div class="mb"><p style="margin:0">${msg}</p></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn red" id="okDel">${IC.trash} Excluir</button></div>`);
  $('#okDel').onclick = () => { onOk(); closeModal(); };
}

/* ================= AÇÕES ================= */
document.addEventListener('click', async e => {
  const t = e.target.closest('[data-go],[data-act],[data-open-les],[data-sel-les],[data-hist],[data-toggle],[data-pos]'); if (!t) return;
  if (t.dataset.go) { go(t.dataset.go); return; }
  if (t.dataset.pos) { UI.atPos = t.dataset.pos; render(); return; }
  if (t.dataset.toggle !== undefined) { const it = t.closest('.hist-item'); it.classList.toggle('open'); t.setAttribute('aria-expanded', it.classList.contains('open')); return; }
  if (t.dataset.openLes) { const l = S.lesoes.find(x => x.id === t.dataset.openLes); UI.selLes = t.dataset.openLes; UI.fl = { status: l && l.status === 'liberado' ? 'todos' : 'ativos', regiao: '', tipo: '', busca: '' }; go('dm-lesionados'); return; }
  if (t.dataset.selLes) { UI.selLes = t.dataset.selLes; $$('tr[data-sel-les]').forEach(r => r.classList.toggle('rowsel', r.dataset.selLes === UI.selLes)); $('#detPanel').innerHTML = detalhe(S.lesoes.find(l => l.id === UI.selLes)); return; }
  if (t.dataset.hist) { go('dm-historico', t.dataset.hist); return; }
  const id = t.dataset.id;
  switch (t.dataset.act) {
    case 'close': closeModal(); break;
    case 'limpar-menu': limparMenu(); break;
    case 'sel-cancel': UI.selMode = false; UI.sel.clear(); render(); break;
    case 'sel-del': { const ids = [...UI.sel]; const nl = S.lesoes.filter(l => UI.sel.has(l.atletaId)).length; confirmar(`Excluir <b>${ids.length} atleta(s)</b>${nl ? ` e as <b>${nl} lesões</b> registradas deles` : ''}? Essa ação não pode ser desfeita.`, async () => { await apagar(ids, S.lesoes.filter(l => ids.includes(l.atletaId)).map(l => l.id)); UI.selMode = false; UI.sel.clear(); render(); toast(`${ids.length} atleta(s) excluído(s)`); }); break; }
    case 'do-limpar': doLimpar(); break;
    case 'print-menu': printMenu(); break;
    case 'print-ind': printMenu('individual', id); break;
    case 'do-print': case 'do-pdf': { const kind = ($('input[name=rk]:checked') || {}).value || 'pagina'; const aid = $('#rkAtl')?.value; closeModal(); const pages = buildPages(kind, aid); if (!pages.length) { toast('Nada para imprimir.', true); break; } if (t.dataset.act === 'do-print') imprimir(pages); else gerarPDF(pages, kind, aid); break; }
    case 'theme': { const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); setTheme(cur === 'dark' ? 'light' : 'dark'); break; }
    case 'setTheme': setTheme(t.dataset.v); break;
    case 'seed': loadSeed(); break;
    case 'novo-atleta': formAtleta(); break;
    case 'edit-atleta': formAtleta(atl(id)); break;
    case 'del-atleta': { const a = atl(id); const n = S.lesoes.filter(l => l.atletaId === id).length; confirmar(`Excluir <b>${esc(a.nome)}</b>${n ? ` e as ${n} lesões registradas dele` : ''}? Essa ação não pode ser desfeita.`, () => { S.lesoes.filter(l => l.atletaId === id).forEach(l => remove('lesoes', l.id)); remove('atletas', id); toast('Atleta excluído'); }); break; }
    case 'nova-lesao': formLesao(); break;
    case 'lesao-atleta': formLesao({}, id); break;
    case 'edit-lesao': formLesao(S.lesoes.find(l => l.id === id)); break;
    case 'del-lesao': confirmar('Excluir este registro de lesão? Essa ação não pode ser desfeita.', () => { remove('lesoes', id); toast('Lesão excluída'); }); break;
    case 'hist': go('dm-historico', id); break;
    case 'limpar-fl': UI.fl = { status: 'ativos', regiao: '', tipo: '', busca: '' }; render(); break;
    case 'avancar': { const l = S.lesoes.find(x => x.id === id); const nx = ORDER[ORDER.indexOf(l.status) + 1]; if (!nx) break; save('lesoes', { ...l, status: nx, statusDatas: { ...(l.statusDatas || {}), [nx]: todayISO() } }); toast(nx === 'liberado' ? 'Atleta liberado para jogos' : 'Status: ' + STATUS[nx]); break; }
    case 'tagAdd': { const k = t.dataset.k, inp = $('#add_' + k), v = inp.value.trim(); if (!v) break; if (!S.config[k].includes(v)) { S.config[k] = [...S.config[k], v]; await putConfig(); } break; }
    case 'tagDel': { const k = t.dataset.k; S.config[k] = S.config[k].filter((_, i) => i !== +t.dataset.i); await putConfig(); break; }
    case 'profAdd': S.config.profissionais = [...(S.config.profissionais || []), { nome: '', cargo: '' }]; await putConfig(); break;
    case 'profDel': S.config.profissionais = S.config.profissionais.filter((_, i) => i !== +t.dataset.i); await putConfig(); break;
    case 'backup': {
      const data = JSON.stringify({ sistema: 'Porto Vitória · Fisio/DM', exportadoEm: new Date().toISOString(), atletas: S.atletas, lesoes: S.lesoes, config: S.config }, null, 1);
      try { const dl = window.claude && await window.claude.use('downloads'); if (!dl) { toast('O download não está disponível nesta visualização.', true); break; } await dl.save({ filename: `backup-dm-porto-vitoria-${todayISO()}.json`, data }); toast('Backup salvo'); } catch (er) { toast('Download cancelado.', true); }
      break;
    }
  }
});
document.addEventListener('change', async e => {
  const t = e.target;
  if (t.dataset.sel) { t.checked ? UI.sel.add(t.dataset.sel) : UI.sel.delete(t.dataset.sel); render(); return; }
  if (t.id === 'selAll') { const q = UI.atBusca.toLowerCase(); atletasCat().filter(a => (!q || (a.nome + ' ' + (a.apelido || '')).toLowerCase().includes(q)) && (UI.atPos === 'Todas' || a.posicao === UI.atPos)).forEach(a => t.checked ? UI.sel.add(a.id) : UI.sel.delete(a.id)); render(); return; }
  if (t.dataset.fl && t.dataset.fl !== 'busca') { UI.fl[t.dataset.fl] = t.value; render(); }
  if (t.id === 'histSel') go('dm-historico', t.value);
  if (t.id === 'cfgAno') { S.config.anoBase = +t.value || new Date().getFullYear(); await putConfig(); }
  if (t.dataset.prof !== undefined) { const i = +t.dataset.prof; S.config.profissionais[i] = { ...S.config.profissionais[i], [t.dataset.k]: t.value.trim() }; await putConfig(); }
  if (t.id === 'restore' && t.files[0]) {
    try {
      const j = JSON.parse(await t.files[0].text()); if (!Array.isArray(j.atletas) || !Array.isArray(j.lesoes)) throw 0;
      confirmar(`Restaurar ${j.atletas.length} atletas e ${j.lesoes.length} lesões deste backup? Registros com o mesmo código serão substituídos.`, async () => { for (const a of j.atletas) await save('atletas', a); for (const l of j.lesoes) await save('lesoes', l); if (j.config) { S.config = fixCfg(j.config); await putConfig(); } toast('Backup restaurado'); });
      $('#okDel').innerHTML = IC.upload + ' Restaurar'; $('#okDel').className = 'btn pri';
    } catch (er) { toast('Arquivo de backup inválido.', true); }
  }
});
let bt; document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.fl === 'busca' || t.id === 'atBusca') {
    const isAt = t.id === 'atBusca', v = t.value; clearTimeout(bt);
    bt = setTimeout(() => { if (isAt) UI.atBusca = v; else UI.fl.busca = v; const pos = t.selectionStart; render(); const el = isAt ? $('#atBusca') : $('[data-fl="busca"]'); if (el) { el.focus(); el.setSelectionRange(pos, pos); } }, 250);
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id && e.target.id.startsWith('add_')) { e.preventDefault(); e.target.nextElementSibling.click(); } });


/* ================= LIMPAR DADOS ================= */
async function apagar(atlIds, lesIds) {
  const A = new Set(atlIds), L = new Set(lesIds);
  S.atletas = S.atletas.filter(a => !A.has(a.id)); S.lesoes = S.lesoes.filter(l => !L.has(l.id)); render();
  if (db) { const ops = [...[...A].map(id => ['atletas', id]), ...[...L].map(id => ['lesoes', id])]; for (let i = 0; i < ops.length; i += 20) await Promise.all(ops.slice(i, i + 20).map(([c, id]) => db.collection(c).doc(id).delete().catch(dbErr))); }
  else lsSave();
}
function limparMenu() {
  const cat = atletasCat(), idsC = new Set(cat.map(a => a.id)), lesC = S.lesoes.filter(l => idsC.has(l.atletaId)).length;
  const temFiltro = F.categoria !== 'Todas';
  const op = (v, t, d, n, chk) => `<label class="rk"><input type="radio" name="lp" value="${v}" ${chk ? 'checked' : ''}><span><b>${t}</b><small>${d}</small></span><em class="lp-count">${n}</em></label>`;
  openModal(mh('Limpar dados') + `<div class="mb">
    <div class="warn" style="margin:0">A exclusão é definitiva${S.online ? ' e vale para todos que usam o sistema' : ''}. Se quiser se garantir, baixe um backup antes: dá para restaurar depois em Configurações.</div>
    <div class="rk-list">
      ${op('sel', 'Escolher atletas na lista', 'Marque um por um (ou todos da busca) e exclua só os que entraram errado. As lesões deles também saem.', 'seleção', true)}
      ${temFiltro ? op('cat', `Todos os atletas de ${esc(catLabel().toLowerCase())}`, 'Apaga os atletas do filtro atual e as lesões deles.', `${cat.length} atletas · ${lesC} lesões`) : ''}
      ${op('les', 'Só as lesões' + (temFiltro ? ' de ' + esc(catLabel().toLowerCase()) : ''), 'Mantém o cadastro dos atletas e apaga o histórico de lesões.', `${temFiltro ? lesC : S.lesoes.length} lesões`)}
      ${op('tudo', 'Tudo', 'Apaga todos os atletas e todas as lesões, de todas as categorias. As configurações são mantidas.', `${S.atletas.length} atletas · ${S.lesoes.length} lesões`)}
    </div>
    <div class="f" id="lpTypeBox"><label for="lpConf">Para confirmar, digite EXCLUIR</label><input id="lpConf" autocomplete="off" placeholder="EXCLUIR"></div>
  </div><div class="mf"><button class="btn" data-act="backup">${IC.down} Baixar backup antes</button><span style="flex:1"></span><button class="btn" data-act="close">Cancelar</button><button class="btn red" id="lpOk" data-act="do-limpar">${IC.trash} Continuar</button></div>`);
  const sync = () => { const v = ($('input[name=lp]:checked') || {}).value; $('#lpTypeBox').style.display = v === 'sel' ? 'none' : ''; $('#lpOk').disabled = v !== 'sel' && $('#lpConf').value.trim().toUpperCase() !== 'EXCLUIR'; $('#lpOk').innerHTML = IC.trash + (v === 'sel' ? ' Escolher na lista' : ' Excluir agora'); };
  $$('input[name=lp]').forEach(i => i.addEventListener('change', sync));
  $('#lpConf').addEventListener('input', sync);
  sync();
}
async function doLimpar() {
  const v = ($('input[name=lp]:checked') || {}).value;
  if (v === 'sel') { closeModal(); UI.selMode = true; UI.sel.clear(); go('atletas'); toast('Marque os atletas que quer excluir'); return; }
  if ($('#lpConf').value.trim().toUpperCase() !== 'EXCLUIR') return;
  closeModal();
  if (v === 'cat') { const ids = atletasCat().map(a => a.id); await apagar(ids, S.lesoes.filter(l => ids.includes(l.atletaId)).map(l => l.id)); toast(`${ids.length} atleta(s) e as lesões deles foram excluídos`); }
  if (v === 'les') { const ids = F.categoria !== 'Todas' ? S.lesoes.filter(l => idsCat().has(l.atletaId)).map(l => l.id) : S.lesoes.map(l => l.id); await apagar([], ids); toast(`${ids.length} lesão(ões) excluída(s)`); }
  if (v === 'tudo') { const n = S.atletas.length, m = S.lesoes.length; await apagar(S.atletas.map(a => a.id), S.lesoes.map(l => l.id)); toast(`Dados apagados: ${n} atletas e ${m} lesões`); }
}
