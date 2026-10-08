/* ================= PLANEJAMENTO · MACROCICLO, MICROCICLO, PLANO DE TREINO ================= */
IC.layers = I('<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>');
const PL_TABS = [['pl-macro', 'Macrociclo'], ['pl-micro', 'Microciclo'], ['pl-plano', 'Plano de treino']];
PL_TABS.forEach(([k, n]) => TITLES[k] = ['Planejamento', n]);
NAV.push({ k: 'plan', n: 'Planejamento', ic: IC.layers, sub: PL_TABS });
const MACRO_TIPOS = { periodo: 'Período', meso: 'Mesociclo', bloco: 'Evento / bloco' };
const MACRO_PER = ['Preparatório geral', 'Preparatório específico', 'Pré-competitivo', 'Competitivo', 'Transição'];
const MCOR = ['#1b8a4a', '#2f6fd6', '#f39324', '#7a3fd1', '#159aa8', '#e0342b', '#8a948f', '#ec3f93'];
const DIA_TIPOS = { treino: ['Treino', '#1b8a4a'], jogo: ['Jogo', '#e0342b'], recup: ['Recuperação', '#159aa8'], fisico: ['Treino físico', '#2f6fd6'], folga: ['Folga', '#8a948f'], aval: ['Avaliação', '#7a3fd1'] };
const SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const PARTES = ['Aquecimento', 'Parte inicial', 'Parte principal', 'Parte final', 'Volta à calma'];
UI.plCat = null; UI.week = null; UI.planoSel = null;
const catPl = () => UI.plCat || (F.categoria !== 'Todas' ? F.categoria : (S.atletas[0]?.categoria || 'Sub-15'));
const segunda = d => { const x = new Date(d + 'T12:00'); const w = (x.getDay() + 6) % 7; return addDays(d, -w); };
function jogosDaCat(cat) { return (window.MIN?.S.jogos || []).filter(j => j.categoria === cat && j.data); }
function mdLabel(d, cat) {
  const js = jogosDaCat(cat).map(j => j.data).sort(); if (js.includes(d)) return 'MD';
  const prox = js.find(x => x > d), ant = [...js].reverse().find(x => x < d);
  const dp = prox ? dayDiff(d, prox) : 99, da = ant ? dayDiff(ant, d) : 99;
  if (da <= 2 && da <= dp) return 'MD+' + da; if (dp <= 6) return 'MD-' + dp; return '';
}
function vPlan() {
  const body = { 'pl-macro': fMacro, 'pl-micro': fMicro, 'pl-plano': fPlano }[S.view] || fMacro;
  const h = header({ title: { 'pl-macro': 'MACROCICLO DA TEMPORADA', 'pl-micro': 'MICROCICLO SEMANAL', 'pl-plano': 'PLANO DE TREINO' }[S.view], sub: 'PLANEJAMENTO · PERIODIZAÇÃO', pill: catPl().toUpperCase().replace('-', ' '), items: hdrItems() });
  const catSel = `<div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><b style="font-family:var(--fc);font-size:18px;text-transform:uppercase">Categoria</b><div class="seg2">${Object.keys(GRUPOS).map(c => `<label><input type="radio" name="plCat" value="${c}" ${c === catPl() ? 'checked' : ''}>${c}</label>`).join('')}</div></div></div>`;
  if (PRINT) return h + '<div style="height:16px"></div>' + body();
  return h + `<nav class="rtabs">${PL_TABS.map(([k, n]) => `<button data-go="${k}" class="${S.view === k ? 'on' : ''}">${n}</button>`).join('')}</nav>` + catSel + body();
}

/* ---------- macrociclo ---------- */
function fMacro() {
  const cat = catPl(), ano = F.ano === 'Todos' ? todayISO().slice(0, 4) : F.ano, ini = ano + '-01-01', fim = ano + '-12-31', tot = dayDiff(ini, fim) + 1;
  const bl = (S.macro || []).filter(b => b.categoria === cat && b.fim >= ini && b.inicio <= fim).sort((a, b) => a.inicio.localeCompare(b.inicio));
  const pos = d => Math.max(0, Math.min(100, dayDiff(ini, d < ini ? ini : d > fim ? fim : d) / tot * 100));
  const bar = b => `<div class="gbar" style="left:${pos(b.inicio)}%;width:${Math.max(0.8, pos(b.fim) - pos(b.inicio) + 100 / tot)}%;background:${b.cor || MCOR[0]}" data-act="macro-edit" data-id="${b.id}" data-tip="${esc(b.nome)}\n${fmtD(b.inicio)} a ${fmtD(b.fim)} (${Math.round((dayDiff(b.inicio, b.fim) + 1) / 7)} sem.)${b.objetivo ? '\n' + esc(b.objetivo) : ''}">${esc(b.nome)}</div>`;
  const lane = (t, lbl) => `<div class="glane"><span class="gl">${lbl}</span><div class="gtrack">${bl.filter(b => b.tipo === t).map(bar).join('')}</div></div>`;
  const js = jogosDaCat(cat).filter(j => j.data >= ini && j.data <= fim);
  const tests = [...new Set((S.testes || []).filter(t => atl(t.atletaId)?.categoria === cat && t.data >= ini && t.data <= fim).map(t => t.data))];
  const hoje = todayISO();
  const months = MESES.map((m, i) => `<span style="left:${pos(ano + '-' + pad(i + 1) + '-01')}%">${m}</span>`).join('');
  const atual = bl.filter(b => b.inicio <= hoje && b.fim >= hoje);
  return `<div class="row r21" style="align-items:start">
    ${panel(`Linha do tempo · ${cat} · ${ano}`, `<div class="gantt"><div class="gmonths">${months}</div>${lane('periodo', 'Períodos')}${lane('meso', 'Mesociclos')}${lane('bloco', 'Eventos')}
      <div class="glane"><span class="gl">Jogos</span><div class="gtrack">${js.map(j => `<i class="gdot" style="left:${pos(j.data)}%;background:${resultado(j) === 'V' ? '#1b8a4a' : resultado(j) === 'D' ? '#e0342b' : '#8a948f'}" data-tip="${fmtD(j.data)} · ${esc(j.adversario || '')}\n${esc(j.competicao || '')} ${j.golsPro ?? ''}x${j.golsContra ?? ''}"></i>`).join('')}</div></div>
      <div class="glane"><span class="gl">Testes</span><div class="gtrack">${tests.map(d => `<i class="gdot sq" style="left:${pos(d)}%" data-tip="Sessão de testes · ${fmtD(d)}"></i>`).join('')}${(S.config.agenda || []).filter(x => x.categoria === cat && x.data >= ini && x.data <= fim).map(x => `<i class="gdot sq ag" style="left:${pos(x.data)}%" data-tip="Agendado · ${fmtD(x.data)}\n${esc(x.teste)}"></i>`).join('')}</div></div>
      ${hoje >= ini && hoje <= fim ? `<div class="ghoje" style="left:calc(110px + (100% - 110px) * ${pos(hoje) / 100})"><span>hoje</span></div>` : ''}
    </div><p class="muted" style="font-size:12px;margin:8px 0 0">Passe o mouse nas barras e pontos para ver os detalhes. Clique numa barra para editar.</p>`, { r: `<button data-act="macro-novo">+ Novo bloco</button>` })}
    ${panel('Momento atual', (atual.length ? atual.map(b => `<div class="sfrow"><span><i class="sq" style="background:${b.cor}"></i><b>${esc(b.nome)}</b></span><span class="muted">${MACRO_TIPOS[b.tipo]} · até ${fmtD(b.fim)}</span></div>${b.objetivo ? `<p style="margin:2px 0 8px;font-size:13px">${esc(b.objetivo)}</p>` : ''}`).join('') : miniEmpty('Nenhum bloco na data de hoje', 'Cadastre os períodos e mesociclos da temporada.')) + (() => { const pj = js.filter(j => j.data >= hoje)[0]; return `<div class="mini-stats" style="margin-top:10px"><div><span>Jogos no ano</span><b>${js.length}</b></div><div><span>Próximo jogo</span><b style="font-size:16px">${pj ? fmtDs(pj.data) + ' · ' + esc(pj.adversario || '') : '—'}</b></div></div>`; })())}
  </div>
  ${panel('Blocos do planejamento', bl.length ? `<table class="t"><thead><tr><th>Tipo</th><th class="l">Nome</th><th>Início</th><th>Fim</th><th>Semanas</th><th class="l">Objetivo</th><th></th></tr></thead><tbody>${bl.map(b => `<tr><td>${MACRO_TIPOS[b.tipo]}</td><td class="l"><span class="sq" style="background:${b.cor}"></span><b>${esc(b.nome)}</b></td><td>${fmtD(b.inicio)}</td><td>${fmtD(b.fim)}</td><td>${Math.round((dayDiff(b.inicio, b.fim) + 1) / 7)}</td><td class="l" style="white-space:normal">${esc(b.objetivo || '')}</td><td style="white-space:nowrap"><button class="icon-btn" data-act="macro-edit" data-id="${b.id}" aria-label="Editar">${IC.edit}</button><button class="icon-btn" data-act="macro-del" data-id="${b.id}" aria-label="Excluir" style="color:var(--red)">${IC.trash}</button></td></tr>`).join('')}</tbody></table>` : miniEmpty('Nenhum bloco cadastrado', 'Comece pelos períodos (preparatório, competitivo, transição) e depois os mesociclos.'), { np: !!bl.length, r: `<button data-act="macro-novo">+ Novo bloco</button>` })}`;
}
function formMacro(b = {}) {
  openModal(mh(b.id ? 'Editar bloco' : 'Novo bloco do macrociclo') + `<form id="fMc" novalidate><div class="mb"><div class="form">
    <div class="f"><label for="mcT">Tipo</label><select id="mcT">${Object.entries(MACRO_TIPOS).map(([k, n]) => `<option value="${k}" ${(b.tipo || 'periodo') === k ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
    <div class="f s2"><label for="mcN">Nome *</label><input id="mcN" list="mcSug" value="${esc(b.nome || '')}" required><datalist id="mcSug">${MACRO_PER.map(p => `<option value="${p}">`).join('')}<option value="Mesociclo 1 · Base"><option value="Mesociclo 2 · Desenvolvimento"><option value="Mesociclo 3 · Polimento"></datalist></div>
    <div class="f"><label for="mcCat">Categoria</label><select id="mcCat">${opts(Object.keys(GRUPOS), b.categoria || catPl())}</select></div>
    <div class="f"><label for="mcI">Início *</label><input id="mcI" type="date" value="${esc(b.inicio || todayISO())}" required></div>
    <div class="f"><label for="mcF">Fim *</label><input id="mcF" type="date" value="${esc(b.fim || addDays(todayISO(), 27))}" required></div>
    <div class="f s2"><span>Cor</span><div class="cores">${MCOR.map(c => `<label><input type="radio" name="mcCor" value="${c}" ${(b.cor || MCOR[0]) === c ? 'checked' : ''}><i style="background:${c}"></i></label>`).join('')}</div></div>
    <div class="f s4"><label for="mcO">Objetivo / ênfase</label><textarea id="mcO" placeholder="Ex.: base aeróbia, força geral, adaptação técnica">${esc(b.objetivo || '')}</textarea></div>
  </div></div><div class="mf"><span class="msg" id="mcErr"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar</button></div></form>`);
  $('#fMc').onsubmit = e => { e.preventDefault(); const o = { ...b, id: b.id || uid('mc'), tipo: $('#mcT').value, nome: $('#mcN').value.trim(), categoria: $('#mcCat').value, inicio: $('#mcI').value, fim: $('#mcF').value, cor: ($('input[name=mcCor]:checked') || {}).value || MCOR[0], objetivo: $('#mcO').value.trim() }; if (o.fim < o.inicio) return $('#mcErr').textContent = 'O fim precisa ser depois do início.'; save('macro', o); closeModal(); toast('Bloco salvo'); };
}

/* ---------- microciclo ---------- */
function fMicro() {
  const cat = catPl(); if (!UI.week) UI.week = segunda(todayISO()); const w0 = UI.week; const dias = Array.from({ length: 7 }, (_, i) => addDays(w0, i));
  const reg = d => (S.micro || []).find(m => m.categoria === cat && m.data === d);
  const ids = new Set(S.atletas.filter(a => a.categoria === cat).map(a => a.id));
  const real = d => { const l = (S.pse || []).filter(r => r.data === d && ids.has(r.atletaId)); return l.length ? Math.round(mean(l.map(carga))) : null; };
  const meso = (S.macro || []).filter(b => b.categoria === cat && b.inicio <= dias[6] && b.fim >= dias[0]);
  const prev = dias.map(d => { const r = reg(d); return r && r.pse && r.duracao ? r.pse * r.duracao : 0; }), exe = dias.map(real);
  const card = (d, i) => { const r = reg(d), md = mdLabel(d, cat), tp = r ? DIA_TIPOS[r.tipo] || DIA_TIPOS.treino : null, pl = (S.planos || []).find(p => p.categoria === cat && p.data === d), jg = jogosDaCat(cat).find(j => j.data === d);
    return `<div class="mday ${d === todayISO() ? 'today' : ''}" data-act="micro-edit" data-d="${d}" role="button" tabindex="0" aria-label="Editar ${SEMANA[i]} ${fmtDs(d)}"><div class="mdh"><b>${SEMANA[i]}</b><span>${fmtDs(d)}</span>${md ? `<em class="${md === 'MD' ? 'mdg' : ''}">${md}</em>` : ''}</div>
      ${r ? `<div class="mdt" style="background:${tp[1]}">${tp[0]}</div><div class="mdb"><b>${esc(r.titulo || '')}</b>${r.conteudo ? `<p>${esc(r.conteudo)}</p>` : ''}<div class="mdm">${r.duracao ? `<span>${IC.clock}${r.duracao}'</span>` : ''}${r.pse ? `<span>${IC.gauge}PSE ${r.pse}</span>` : ''}${r.pse && r.duracao ? `<span>${r.pse * r.duracao} UA</span>` : ''}</div></div>` : `<div class="mdempty">${jg ? `Jogo · ${esc(jg.adversario || '')}` : '+ planejar dia'}</div>`}
      ${pl ? `<button class="mdpl" data-act="plano-ver" data-id="${pl.id}">${IC.clip} ${esc(pl.titulo)}</button>` : r && r.tipo !== 'folga' && r.tipo !== 'jogo' ? `<button class="mdpl add" data-act="plano-novo" data-d="${d}">+ plano de treino</button>` : ''}</div>`; };
  const totP = prev.reduce((a, b) => a + b, 0), totE = exe.reduce((a, b) => a + (b || 0), 0);
  return `<div class="panel" style="margin-bottom:14px"><div class="pb wkbar"><button class="btn sm" data-act="wk" data-d="${addDays(w0, -7)}" aria-label="Semana anterior">‹</button><b>Semana de ${fmtD(dias[0])} a ${fmtD(dias[6])}</b><button class="btn sm" data-act="wk" data-d="${addDays(w0, 7)}" aria-label="Próxima semana">›</button><button class="btn sm" data-act="wk" data-d="${segunda(todayISO())}">Esta semana</button>${meso.map(b => `<span class="mesotag" style="background:${b.cor}22;color:${b.cor};border-color:${b.cor}66">${esc(b.nome)}</span>`).join('')}<span style="flex:1"></span><button class="btn sm" data-act="wk-copy">${IC.cycle} Copiar semana anterior</button></div></div>
  <div class="mweek">${dias.map(card).join('')}</div>
  <div class="row r21" style="margin-top:14px">
    ${panel('Carga planejada x executada', iBars(dias.map((d, i) => SEMANA[i] + ' ' + fmtDs(d)), [{ n: 'Planejada (PSE alvo × min)', c: '#9aa5a0', vals: prev }, { n: 'Executada (média PSE da equipe)', c: '#1b8a4a', vals: exe.map(v => v || 0) }], { w: 900, h: 240 }) + `<div class="legend-status" style="justify-content:center"><span><span class="sq" style="background:#9aa5a0"></span>Planejada</span><span><span class="sq" style="background:#1b8a4a"></span>Executada (PSE)</span></div>`)}
    ${panel('Resumo da semana', `<div class="mini-stats"><div><span>Carga planejada</span><b>${totP} UA</b></div><div><span>Carga executada</span><b>${totE || '—'} ${totE ? 'UA' : ''}</b></div><div><span>Sessões</span><b>${dias.filter(d => reg(d) && !['folga'].includes(reg(d).tipo)).length}</b></div><div><span>Jogos</span><b>${dias.filter(d => jogosDaCat(cat).some(j => j.data === d)).length}</b></div></div><p class="muted" style="font-size:12px;margin:10px 0 0">MD = dia de jogo; MD-1, MD-2… = dias antes do jogo; MD+1 = dia seguinte. Calculado a partir dos jogos cadastrados.</p>`)}
  </div>`;
}
function formMicro(d) {
  const cat = catPl(), r = (S.micro || []).find(m => m.categoria === cat && m.data === d) || {}, md = mdLabel(d, cat);
  openModal(mh(`Planejar ${SEMANA[(new Date(d + 'T12:00').getDay() + 6) % 7]} ${fmtD(d)}${md ? ' · ' + md : ''}`) + `<form id="fMi" novalidate><div class="mb"><div class="form">
    <div class="f"><label for="miT">Tipo do dia</label><select id="miT">${Object.entries(DIA_TIPOS).map(([k, [n]]) => `<option value="${k}" ${(r.tipo || (md === 'MD' ? 'jogo' : 'treino')) === k ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
    <div class="f s3" style="grid-column:span 3"><label for="miTi">Título / ênfase</label><input id="miTi" value="${esc(r.titulo || '')}" placeholder="Ex.: Força + jogos reduzidos 4x4"></div>
    <div class="f"><label for="miD">Duração prevista (min)</label><input id="miD" type="number" min="0" max="240" value="${r.duracao ?? (md === 'MD' ? 90 : 75)}"></div>
    <div class="f"><label for="miP">PSE alvo (0–10)</label><select id="miP"><option value="">—</option>${PSE_ESC.map((e, i) => `<option value="${i}" ${r.pse === i ? 'selected' : ''}>${i} · ${e}</option>`).join('')}</select></div>
    <div class="f s2"><span>Carga prevista</span><b id="miC" style="font-family:var(--fc);font-size:22px">—</b></div>
    <div class="f s4"><label for="miCo">Conteúdo / observações</label><textarea id="miCo" placeholder="Objetivos técnicos, táticos e físicos do dia">${esc(r.conteudo || '')}</textarea></div>
  </div></div><div class="mf">${r.id ? `<button type="button" class="btn danger" data-act="micro-del" data-id="${r.id}" style="margin-right:auto">${IC.trash} Limpar dia</button>` : ''}<button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar</button></div></form>`);
  const c = () => { const p = $('#miP').value, du = +$('#miD').value || 0; $('#miC').textContent = p !== '' ? (+p * du) + ' UA' : '—'; }; $('#fMi').addEventListener('input', c); $('#fMi').addEventListener('change', c); c();
  $('#fMi').onsubmit = e => { e.preventDefault(); const o = { ...r, id: r.id || `mi_${cat}_${d}`, categoria: cat, data: d, tipo: $('#miT').value, titulo: $('#miTi').value.trim(), duracao: +$('#miD').value || 0, pse: $('#miP').value === '' ? null : +$('#miP').value, conteudo: $('#miCo').value.trim() }; save('micro', o); closeModal(); toast('Dia planejado'); };
}

/* ---------- plano de treino ---------- */
function planoHTML(p, print) {
  const ex = p.exercicios || []; const tot = ex.reduce((s, x) => s + (+x.duracao || 0), 0);
  return `<div class="plano">
    <div class="plh"><div><h3>${esc(p.titulo)}</h3><p>${fmtD(p.data)} · ${esc(p.categoria)} · ${p.duracao || tot} min${p.local ? ' · ' + esc(p.local) : ''}${p.responsavel ? ' · ' + esc(p.responsavel) : ''}</p></div>${(() => { const md = mdLabel(p.data, p.categoria); return md ? `<span class="mdbig">${md}</span>` : ''; })()}</div>
    <div class="plk"><div><small>Objetivo</small><b>${esc(p.objetivo || '—')}</b></div><div><small>PSE alvo</small><b>${p.pse != null && p.pse !== '' ? p.pse + ' · ' + PSE_ESC[p.pse] : '—'}</b></div><div><small>Carga prevista</small><b>${p.pse && (p.duracao || tot) ? p.pse * (p.duracao || tot) + ' UA' : '—'}</b></div><div><small>Materiais</small><b>${esc(p.materiais || '—')}</b></div></div>
    ${PARTES.filter(pt => ex.some(x => x.parte === pt)).map(pt => `<div class="plp"><h4>${pt} <small>${ex.filter(x => x.parte === pt).reduce((s, x) => s + (+x.duracao || 0), 0)} min</small></h4>${ex.filter(x => x.parte === pt).map((x, i) => `<div class="plx"><span class="pxn">${i + 1}</span><div><b>${esc(x.nome)}</b>${x.desc ? `<p>${esc(x.desc)}</p>` : ''}<div class="pxm">${x.duracao ? `<span>${IC.clock} ${x.duracao} min</span>` : ''}${x.series ? `<span>${esc(x.series)}</span>` : ''}${x.espaco ? `<span>${esc(x.espaco)}</span>` : ''}${x.pse ? `<span>PSE ${x.pse}</span>` : ''}</div></div></div>`).join('')}</div>`).join('') || miniEmpty('Sem exercícios', 'Edite o plano para adicionar as atividades.')}
    ${p.obs ? `<div class="plp"><h4>Observações</h4><p style="margin:0">${esc(p.obs)}</p></div>` : ''}
  </div>`;
}
function fPlano() {
  const cat = catPl(); const l = (S.planos || []).filter(p => p.categoria === cat).sort((a, b) => b.data.localeCompare(a.data));
  if (!l.find(p => p.id === UI.planoSel)) UI.planoSel = l[0]?.id;
  const p = l.find(x => x.id === UI.planoSel);
  return `<div class="row r12" style="align-items:start">
    ${panel(`Planos · ${cat}`, l.length ? `<table class="t"><thead><tr><th>Data</th><th class="l">Título</th><th>Min</th></tr></thead><tbody>${l.map(x => `<tr class="click ${x.id === UI.planoSel ? 'rowsel' : ''}" data-act="plano-sel" data-id="${x.id}"><td>${fmtDs(x.data)}<br><small class="muted">${mdLabel(x.data, x.categoria)}</small></td><td class="l"><b>${esc(x.titulo)}</b><br><small class="muted">${esc(x.objetivo || '')}</small></td><td>${typeof durEf === 'function' ? durEf(x) : x.duracao || 0}</td></tr>`).join('')}</tbody></table>` : miniEmpty('Nenhum plano de treino', 'Crie o primeiro plano.'), { np: !!l.length, r: `<button data-act="plano-novo">+ Novo plano</button>` })}
    ${p ? `<div class="panel"><div class="ph">Plano de treino<span class="r"><button data-act="plano-edit" data-id="${p.id}">Editar</button> <button data-act="plano-dup" data-id="${p.id}">Duplicar</button> <button data-act="plano-print" data-id="${p.id}">Imprimir / PDF</button> <button data-act="plano-del" data-id="${p.id}">Excluir</button></span></div><div class="pb">${planoHTML(p)}</div></div>` : panel('Plano de treino', `<div class="empty" style="border:0"><h3>Monte o plano da sessão</h3>Aquecimento, parte principal e volta à calma, com tempo, organização e PSE alvo de cada atividade.<div class="acts"><button class="btn pri" data-act="plano-novo">${IC.plus} Novo plano de treino</button></div></div>`)}
  </div>`;
}
function formPlano(p = {}, data) {
  const cat = p.categoria || catPl(); const profs = (S.config.profissionais || []).map(x => x.nome).filter(Boolean);
  let ex = (p.exercicios || [{ parte: 'Aquecimento', nome: '', duracao: 15 }, { parte: 'Parte principal', nome: '', duracao: 45 }, { parte: 'Volta à calma', nome: '', duracao: 10 }]).map(x => ({ ...x }));
  openModal(mh(p.id ? 'Editar plano de treino' : 'Novo plano de treino') + `<form id="fPl"><div class="mb"><div class="form">
    <div class="f s2"><label for="plT">Título *</label><input id="plT" value="${esc(p.titulo || '')}" placeholder="Ex.: Transição ofensiva + força" required></div>
    <div class="f"><label for="plD">Data *</label><input id="plD" type="date" value="${esc(p.data || data || todayISO())}" required></div>
    <div class="f"><label for="plC">Categoria</label><select id="plC">${opts(Object.keys(GRUPOS), cat)}</select></div>
    <div class="f s2"><label for="plO">Objetivo</label><input id="plO" value="${esc(p.objetivo || '')}" placeholder="Ex.: melhorar a reação após a perda da bola"></div>
    <div class="f"><label for="plP">PSE alvo</label><select id="plP"><option value="">—</option>${PSE_ESC.map((e, i) => `<option value="${i}" ${p.pse === i ? 'selected' : ''}>${i} · ${e}</option>`).join('')}</select></div>
    <div class="f"><label for="plR">Responsável</label><select id="plR"><option value="">—</option>${opts(profs, p.responsavel)}</select></div>
    <div class="f s2"><label for="plM">Materiais</label><input id="plM" value="${esc(p.materiais || '')}" placeholder="Bolas, cones, coletes, mini-gols"></div>
    <div class="f s2"><label for="plL">Local</label><input id="plL" value="${esc(p.local || '')}" placeholder="Campo 1"></div>
  </div><div class="fsec">Atividades</div><div id="plEx"></div><button type="button" class="btn sm" data-act="plx-add">${IC.plus} Adicionar atividade</button>
  <div class="f"><label for="plOb">Observações</label><textarea id="plOb">${esc(p.obs || '')}</textarea></div>
  </div><div class="mf"><span class="msg" id="plErr"></span><span class="muted" id="plTot" style="margin-right:auto"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar plano</button></div></form>`, true);
  const draw = () => { $('#plEx').innerHTML = ex.map((x, i) => `<div class="plrow" data-i="${i}"><select data-k="parte">${opts(PARTES, x.parte)}</select><input data-k="nome" value="${esc(x.nome || '')}" placeholder="Atividade (ex.: Rondo 5x2)"><input data-k="duracao" type="number" min="0" max="120" value="${esc(x.duracao ?? '')}" placeholder="min"><input data-k="series" value="${esc(x.series || '')}" placeholder="Séries / reps"><input data-k="espaco" value="${esc(x.espaco || '')}" placeholder="Espaço"><select data-k="pse"><option value="">PSE</option>${PSE_ESC.map((e, k) => `<option value="${k}" ${+x.pse === k && x.pse !== '' && x.pse != null ? 'selected' : ''}>${k}</option>`).join('')}</select><button type="button" class="icon-btn" data-act="plx-up" data-i="${i}" aria-label="Subir">↑</button><button type="button" class="icon-btn" data-act="plx-del" data-i="${i}" aria-label="Remover" style="color:var(--red)">${IC.trash}</button><textarea data-k="desc" placeholder="Organização / regras / pontos de atenção">${esc(x.desc || '')}</textarea></div>`).join(''); tot(); };
  const tot = () => { $('#plTot').textContent = `Total: ${ex.reduce((s, x) => s + (+x.duracao || 0), 0)} min`; };
  $('#plEx').addEventListener('input', e => { const r = e.target.closest('.plrow'); if (!r || !e.target.dataset.k) return; ex[+r.dataset.i][e.target.dataset.k] = e.target.value; tot(); });
  $('#plEx').addEventListener('change', e => { const r = e.target.closest('.plrow'); if (!r || !e.target.dataset.k) return; ex[+r.dataset.i][e.target.dataset.k] = e.target.value; });
  $('#fPl').addEventListener('click', e => { const b = e.target.closest('[data-act^="plx-"]'); if (!b) return; e.preventDefault(); e.stopPropagation(); const i = +b.dataset.i; if (b.dataset.act === 'plx-add') ex.push({ parte: ex[ex.length - 1]?.parte || 'Parte principal', nome: '', duracao: 10 }); if (b.dataset.act === 'plx-del') ex.splice(i, 1); if (b.dataset.act === 'plx-up' && i > 0) [ex[i - 1], ex[i]] = [ex[i], ex[i - 1]]; draw(); });
  draw();
  $('#fPl').onsubmit = e => { e.preventDefault(); const exs = ex.filter(x => (x.nome || '').trim()).map(x => ({ parte: x.parte, nome: x.nome.trim(), duracao: +x.duracao || 0, series: x.series || '', espaco: x.espaco || '', pse: x.pse === '' || x.pse == null ? null : +x.pse, desc: x.desc || '' })); const o = { ...p, id: p.id || uid('pl'), titulo: $('#plT').value.trim(), data: $('#plD').value, categoria: $('#plC').value, objetivo: $('#plO').value.trim(), pse: $('#plP').value === '' ? null : +$('#plP').value, responsavel: $('#plR').value, materiais: $('#plM').value.trim(), local: $('#plL').value.trim(), obs: $('#plOb').value.trim(), exercicios: exs, duracao: exs.reduce((s, x) => s + x.duracao, 0) }; if (!o.titulo) return $('#plErr').textContent = 'Informe o título.'; save('planos', o); UI.planoSel = o.id; UI.plCat = o.categoria; closeModal(); if (S.view !== 'pl-plano') go('pl-plano'); toast('Plano salvo'); };
}
function imprimirPlano(id, pdf) {
  const p = (S.planos || []).find(x => x.id === id); if (!p) return;
  const v0 = S.view; S.view = 'pl-plano'; PRINT = true;
  const pages = [pageWrap(header({ title: 'PLANO DE TREINO', sub: 'PLANEJAMENTO · SESSÃO DE TREINO', pill: p.categoria.toUpperCase().replace('-', ' '), items: [['cal', 'Data', fmtD(p.data)], ['clock', 'Duração', (p.duracao || 0) + ' min']] }) + '<div style="height:14px"></div>' + `<div class="panel grow"><div class="pb">${planoHTML(p, true)}</div></div>`)];
  PRINT = false; S.view = v0;
  if (pdf) gerarPDF(pages, 'plano'); else imprimir(pages);
}

/* ---------- ações ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return; const id = t.dataset.id;
  switch (t.dataset.act) {
    case 'macro-novo': formMacro(); break;
    case 'macro-edit': formMacro((S.macro || []).find(b => b.id === id)); break;
    case 'macro-del': confirmar('Excluir este bloco do planejamento?', () => { remove('macro', id); toast('Bloco excluído'); }); break;
    case 'wk': UI.week = segunda(t.dataset.d); render(); break;
    case 'wk-copy': { const cat = catPl(), w0 = UI.week, docs = []; for (let i = 0; i < 7; i++) { const src = (S.micro || []).find(m => m.categoria === cat && m.data === addDays(w0, i - 7)); if (src) docs.push({ ...src, id: `mi_${cat}_${addDays(w0, i)}`, data: addDays(w0, i) }); } if (!docs.length) { toast('A semana anterior está vazia.', true); break; } saveMany('micro', docs).then(() => { render(); toast(`${docs.length} dia(s) copiado(s)`); }); break; }
    case 'micro-edit': if (e.target.closest('.mdpl')) break; formMicro(t.dataset.d); break;
    case 'micro-del': remove('micro', id); closeModal(); toast('Dia limpo'); break;
    case 'plano-novo': e.stopPropagation(); formPlano({}, t.dataset.d); break;
    case 'plano-ver': e.stopPropagation(); UI.planoSel = id; go('pl-plano'); break;
    case 'plano-sel': UI.planoSel = id; render(); break;
    case 'plano-edit': formPlano((S.planos || []).find(p => p.id === id)); break;
    case 'plano-dup': { const p = (S.planos || []).find(x => x.id === id); formPlano({ ...p, id: undefined, titulo: p.titulo + ' (cópia)', data: todayISO() }); break; }
    case 'plano-del': confirmar('Excluir este plano de treino?', () => { remove('planos', id); toast('Plano excluído'); }); break;
    case 'plano-print': openModal(mh('Imprimir plano de treino') + `<div class="mb"><p style="margin:0">Folha 16:9 com o plano completo.</p></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn" data-act="plano-imp" data-id="${id}">${IC.print} Imprimir</button><button class="btn pri" data-act="plano-pdf" data-id="${id}">${IC.pdf} Baixar PDF</button></div>`); break;
    case 'plano-imp': closeModal(); imprimirPlano(id); break;
    case 'plano-pdf': closeModal(); imprimirPlano(id, true); break;
  }
});
document.addEventListener('change', e => { if (e.target.name === 'plCat') { UI.plCat = e.target.value; render(); } });
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.mday')) { e.preventDefault(); formMicro(e.target.dataset.d); } });
