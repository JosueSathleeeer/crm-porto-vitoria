/* ================= DADOS DE TESTE E LIMPEZA (todas as áreas) ================= */
IC.flask = I('<path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7 15h10"/>');
const isDemo = x => x && (x.demo || String(x.id).startsWith('demo_'));
const AREAS = {
  atletas: { n: 'Atletas', cols: ['atletas'], d: 'Elenco de exemplo da categoria (18 atletas)' },
  dm: { n: 'Fisio / DM', cols: ['lesoes'], d: 'Lesões de exemplo com status e previsão de retorno' },
  nut: { n: 'Nutrição', cols: ['avaliacoes', 'hidratacao', 'energia'], d: 'Composição corporal (4 dobras), hidratação e necessidade energética' },
  av: { n: 'Avaliação física', cols: ['testes', 'maturacao'], d: 'Duas sessões de testes (com tentativas) e maturação' },
  mon: { n: 'Monitoramento', cols: ['bemestar', 'pse'], d: 'Bem-estar e PSE de 5 semanas (junto com o microciclo)' },
  plan: { n: 'Planejamento e calendário', cols: ['macro', 'micro', 'planos'], d: 'Macrociclo, microciclo e um plano de treino' }
};
const areaDaView = v => v === 'atletas' || v === 'importar' ? 'atletas' : v === 'dashboard' || v.startsWith('dm-') ? 'dm' : v.startsWith('nut-') ? 'nut' : v.startsWith('av-') || v.startsWith('mat-') ? 'av' : v.startsWith('mon-') ? 'mon' : v.startsWith('pl-') || v === 'cal' ? 'plan' : null;
function rndGen(seed) { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
const catAlvo = () => F.categoria !== 'Todas' ? F.categoria : (Object.entries(countBy(S.atletas, a => a.categoria)).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sub-15');
async function gerarTeste(area) {
  const cat = catAlvo(), ats = S.atletas.filter(a => a.categoria === cat), r = rndGen(31), pick = l => l[Math.floor(r() * l.length)], hoje = todayISO(), ano = +hoje.slice(0, 4);
  if (area !== 'atletas' && !ats.length) { toast(`Cadastre atletas no ${cat} ou carregue os atletas de teste primeiro.`, true); return; }
  progress('Gerando dados de teste…');
  try {
    if (area === 'atletas') {
      const nomes = ['Lucas Andrade', 'Gabriel Moura', 'Pedro Lacerda', 'Rafael Coutinho', 'João Paulo Reis', 'Matheus Prado', 'Enzo Barcelos', 'Davi Fontana', 'Miguel Teixeira', 'Arthur Pimentel', 'Heitor Brandão', 'Bernardo Lins', 'Samuel Duarte', 'Lorenzo Vidal', 'Theo Cardoso', 'Isaac Moreira', 'Benício Farias', 'Vinícius Rocha'];
      const pos = ['GOL', 'GOL', 'LAT', 'LAT', 'ZAG', 'ZAG', 'ZAG', 'VOL', 'VOL', 'MEI', 'MEI', 'MEI', 'EXT', 'EXT', 'ATA', 'ATA', 'ATA', 'LAT'], subs = GRUPOS[cat] || [cat];
      const docs = nomes.map((n, i) => { const sub = subs[i % subs.length], nascAno = ano - (+String(sub).match(/\d+/)?.[0] || 15); return { id: `demo_a_${cat}_${i}`, demo: true, nome: n, numero: String(i + 1), posicao: pos[i], posDetalhe: { GOL: 'Goleiro', LAT: i % 2 ? 'Lateral Esquerdo' : 'Lateral Direito', ZAG: 'Zagueiro', VOL: 'Volante', MEI: 'Meio-campista', EXT: i % 2 ? 'Ponta Esquerda' : 'Ponta Direita', ATA: 'Centroavante' }[pos[i]], categoria: cat, subcategoria: sub, nascimento: `${nascAno}-${pad(1 + Math.floor(r() * 12))}-${pad(1 + Math.floor(r() * 27))}`, altura: (1.55 + r() * 0.3).toFixed(2), peso: (48 + r() * 22).toFixed(1), pe: pick(['Direito', 'Direito', 'Esquerdo']), criadoEm: hoje }; });
      await saveMany('atletas', docs);
    }
    if (area === 'dm') { const base = SEED.lesoes.slice(0, 10); const docs = base.map((l, i) => { const a = ats[(i * 3) % ats.length], d = addDays(hoje, -Math.floor(5 + r() * 120)), ativa = i < 3; return { ...l, id: `demo_l_${cat}_${i}`, demo: true, atletaId: a.id, data: d, previsao: addDays(d, 10 + Math.floor(r() * 25)), status: ativa ? pick(['tratamento', 'transicao', 'retorno']) : 'liberado', statusDatas: { tratamento: d }, criadoEm: d }; }); await saveMany('lesoes', docs); }
    if (area === 'nut') {
      const av = [], en = []; ats.forEach((a, i) => [-75, -10].forEach((k, j) => { const g = (3 + r() * 5) - j * 0.6; av.push({ id: `demo_n_${a.id}_${j}`, demo: true, atletaId: a.id, data: addDays(hoje, k), peso: +(+a.peso || 58 + r() * 8 + j * 0.8).toFixed(1), altura: +(+a.altura || 1.68).toFixed(2), protocolo: 'faulkner', dobras: { triceps: +(g + 2 + r() * 2).toFixed(1), subescapular: +(g + 1 + r() * 2).toFixed(1), suprailiaca: +(g + 1 + r() * 3).toFixed(1), abdominal: +(g + 3 + r() * 4).toFixed(1) } }); }));
      const hid = [0, 1].map(k => ({ id: `demo_h_${cat}_${k}`, demo: true, data: addDays(hoje, -3 - k * 7), tipo: 'Treino', duracao: 90, temp: 28, umidade: 70, categoria: cat, registros: ats.map(a => { const pre = +(+a.peso || 60).toFixed(1); return { atletaId: a.id, pre, pos: +(pre - 0.4 - r() * 1.2).toFixed(1), ingerido: Math.round(400 + r() * 600), urina: Math.round(r() * 200), cor: 1 + Math.floor(r() * 6) }; }) }));
      await saveMany('avaliacoes', av); await saveMany('hidratacao', hid);
    }
    if (area === 'av') {
      const ts = [], mt = []; ats.forEach((a, i) => [-60, -5].forEach((k, j) => { const f = 1 + j * 0.03, cmj = 26 + r() * 12; ts.push({ id: `demo_t_${a.id}_${j}`, demo: true, atletaId: a.id, data: addDays(hoje, k), cmj_1: +(cmj * f).toFixed(1), cmj_2: +((cmj + r() * 2) * f).toFixed(1), cmj_3: +((cmj - r()) * f).toFixed(1), ift: +(16 + r() * 4 + j * 0.5).toFixed(1), v10_1: +(1.95 - r() * 0.2 - j * 0.02).toFixed(2), v10_2: +(1.93 - r() * 0.2 - j * 0.02).toFixed(2), v10_3: +(1.96 - r() * 0.2 - j * 0.02).toFixed(2), v30_1: +(4.9 - r() * 0.5).toFixed(2), v30_2: +(4.85 - r() * 0.5).toFixed(2), v30_3: +(4.92 - r() * 0.5).toFixed(2), t505d_1: +(2.55 - r() * 0.2).toFixed(2), t505d_2: +(2.5 - r() * 0.2).toFixed(2), t505e_1: +(2.6 - r() * 0.2).toFixed(2), t505e_2: +(2.58 - r() * 0.2).toFixed(2) }); }));
      ats.forEach(a => { const H = Math.round((+a.altura || 1.68) * 1000) / 10; mt.push({ id: `demo_m_${a.id}`, demo: true, atletaId: a.id, data: addDays(hoje, -5), altura: H, alturaSentado: +(H * (0.51 + r() * 0.03)).toFixed(1), peso: +(+a.peso || 58).toFixed(1), alturaPai: 172 + Math.round(r() * 12), alturaMae: 158 + Math.round(r() * 10) }); });
      await saveMany('testes', ts); await saveMany('maturacao', mt);
    }
    if (area === 'mon') { progressEnd(); await carregarTeste(); return; }
    if (area === 'plan') {
      const y = String(ano), w0 = segunda(hoje); await saveMany('macro', [{ id: `demo_mc_${cat}_1`, demo: true, tipo: 'periodo', nome: 'Preparatório geral', categoria: cat, inicio: y + '-01-05', fim: y + '-02-28', cor: '#2f6fd6', objetivo: 'Base aeróbia e força geral' }, { id: `demo_mc_${cat}_2`, demo: true, tipo: 'periodo', nome: 'Competitivo', categoria: cat, inicio: y + '-03-01', fim: y + '-11-29', cor: '#1b8a4a', objetivo: 'Manutenção e picos para os jogos' }, { id: `demo_mc_${cat}_3`, demo: true, tipo: 'meso', nome: 'Meso · Potência e velocidade', categoria: cat, inicio: addDays(w0, -14), fim: addDays(w0, 13), cor: '#f39324', objetivo: 'Sprints, saltos e jogos reduzidos' }]);
      await saveMany('planos', [{ id: `demo_pl_${cat}`, demo: true, data: addDays(w0, 1), categoria: cat, local: 'Academia/campo', microciclo: 'Semana de ' + fmtDs(w0), horario: '15:00', titulo: 'Força + jogos reduzidos', blocos: [{ tipo: 'academia', nome: 'Academia', metodo: 'Força MMII e core', duracao: 30, campo: 'Academia', grupo: 'G1', objetivo: 'Força de membros inferiores', desenvolvimento: 'Força MMII (G1) e core; mobilidade (G2)', exercicios: [{ nome: 'Agachamento livre', series: '3x8', cadencia: '2010', descanso: '60s', carga: 'RIR 2' }, { nome: 'Elevação pélvica', series: '3x12', descanso: '45s', carga: 'Individual' }, { nome: 'Nórdico', series: '3x5', descanso: '60s', carga: 'Peso corporal' }] }, { tipo: 'campo', nome: 'Atividade 1', metodo: 'Jogo reduzido', duracao: 25, campo: '30x25 m', series: '5 x 4 min', pse: 8, grupo: 'Todos', objetivo: 'Pressão pós-perda em até 5 s', desenvolvimento: '4x4 + 2 coringas', regras: 'Recuperou em 5 s = 1 ponto', coaching: 'Reação à perda, compactação', pad: { campo: 'meio', objs: [{ t: 'jA', x: 35, y: 40, n: '1', s: 1.2 }, { t: 'jA', x: 50, y: 60, n: '2', s: 1.2 }, { t: 'jB', x: 60, y: 35, n: '3', s: 1.2 }, { t: 'jB', x: 45, y: 25, n: '4', s: 1.2 }, { t: 'cone', x: 20, y: 15, s: 1.2 }, { t: 'cone', x: 80, y: 15, s: 1.2 }, { t: 'mini', x: 50, y: 92, s: 1.2 }], setas: [{ x1: 35, y1: 40, x2: 50, y2: 58, tipo: 'passe' }] } }], material: [{ qtd: '10', item: 'Cones' }, { qtd: '2', item: 'Mini-gols' }, { qtd: '', item: 'Material da academia' }] }]);
      progressEnd(); await carregarTeste(); return;
    }
  } finally { progressEnd(); }
  render(); toast(`Dados de teste de ${AREAS[area].n} carregados (${cat})`);
}
async function limparArea(area, soTeste, soCat) {
  const cols = AREAS[area].cols, cat = F.categoria, ids = new Set(S.atletas.filter(a => cat === 'Todas' || a.categoria === cat).map(a => a.id));
  const doCat = x => !soCat || cat === 'Todas' || (x.atletaId ? ids.has(x.atletaId) : x.categoria ? x.categoria === cat : x.registros ? x.registros.some(r => ids.has(r.atletaId)) : true);
  let n = 0; progress('Limpando…');
  try { for (const c of cols) { const l = (S[c] || []).filter(x => (!soTeste || isDemo(x)) && doCat(x)); for (let i = 0; i < l.length; i += 20) await Promise.all(l.slice(i, i + 20).map(x => remove(c, x.id))); n += l.length; } }
  finally { progressEnd(); }
  render(); toast(`${n} registro(s) apagado(s) em ${AREAS[area].n}`);
}
function abrirDados(foco) {
  const cat = catAlvo();
  openModal(mh('Dados de teste e limpeza') + `<div class="mb"><p class="muted" style="margin:0;font-size:12.5px">Os dados de teste são marcados e podem ser apagados depois sem mexer nos dados reais. Categoria usada: <b>${esc(cat)}</b>${F.categoria === 'Todas' ? ' (escolha uma no filtro do topo para mudar)' : ''}.</p>
    <div class="dtl">${Object.entries(AREAS).map(([k, A]) => { const nT = A.cols.reduce((s, c) => s + (S[c] || []).filter(isDemo).length, 0), nR = A.cols.reduce((s, c) => s + (S[c] || []).filter(x => !isDemo(x)).length, 0); return `<div class="dti ${k === foco ? 'on' : ''}"><div><b>${A.n}</b><small>${A.d}</small><span class="muted">${nT} de teste · ${nR} reais</span></div><div class="dtb"><button class="btn sm pri" data-act="dt-gen" data-a="${k}">${IC.flask} Carregar teste</button><button class="btn sm" data-act="dt-clr" data-a="${k}" ${nT ? '' : 'disabled'}>Limpar teste</button><button class="btn sm danger" data-act="dt-all" data-a="${k}" ${nR + nT ? '' : 'disabled'}>${IC.trash} Limpar tudo</button></div></div>`; }).join('')}</div>
    <p class="muted" style="margin:0;font-size:12px">“Limpar tudo” apaga também os dados reais da área (da categoria filtrada, ou de todas quando o filtro está em Todas) e pede confirmação escrita. Jogos e minutagem têm limpeza própria no módulo de Jogos.</p></div><div class="mf"><button class="btn" data-act="close">Fechar</button></div>`, true);
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return; const a = t.dataset.a;
  if (t.dataset.act === 'dados-teste') abrirDados(areaDaView(S.view));
  if (t.dataset.act === 'dt-gen') { closeModal(); gerarTeste(a); }
  if (t.dataset.act === 'dt-clr') { closeModal(); confirmar(`Apagar os dados de teste de ${AREAS[a].n}?`, () => limparArea(a, true, false)); }
  if (t.dataset.act === 'dt-all') { openModal(mh('Limpar todos os dados · ' + AREAS[a].n) + `<div class="mb"><div class="warn" style="margin:0">Isto apaga <b>todos</b> os registros de ${AREAS[a].n}${F.categoria !== 'Todas' ? ' da categoria <b>' + esc(F.categoria) + '</b>' : ' de <b>todas as categorias</b>'}, inclusive os reais. Não dá para desfazer. Se quiser guardar, exporte antes em Configurações → Geral.</div><div class="f"><label for="dtX">Digite EXCLUIR para confirmar</label><input id="dtX" autocomplete="off"></div></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn red" id="dtGo">${IC.trash} Apagar tudo</button></div>`); $('#dtGo').onclick = () => { if ($('#dtX').value.trim().toUpperCase() !== 'EXCLUIR') { toast('Digite EXCLUIR para confirmar.', true); return; } closeModal(); limparArea(a, false, true); }; }
});
// botão no topo de todas as abas
const _renderTopDT = renderTop;
renderTop = function () { _renderTopDT(); const tb = $('#topbar'); if (!tb || tb.querySelector('[data-act="dados-teste"]') || !areaDaView(S.view)) return; const pr = tb.querySelector('[data-act="print-menu"]'); const b = `<button class="btn sm" data-act="dados-teste" title="Carregar dados de teste ou limpar dados">${IC.flask} Teste / limpar</button>`; if (pr) pr.insertAdjacentHTML('beforebegin', b); else tb.insertAdjacentHTML('beforeend', b); };

/* ---------- composição corporal: editar direto na tabela ---------- */
const _fNutCompE = fNutComp;
fNutComp = function () {
  const h = _fNutCompE(), U = ultimas(), tmp = document.createElement('div'); tmp.innerHTML = h;
  const th = tmp.querySelector('table.t thead tr'); if (th) th.insertAdjacentHTML('beforeend', '<th>Ações</th>');
  tmp.querySelectorAll('table.t tbody tr[data-nut]').forEach(tr => { const v = U.get(tr.dataset.nut); if (v) tr.insertAdjacentHTML('beforeend', `<td style="white-space:nowrap"><button class="icon-btn" data-act="edit-av" data-id="${v.id}" title="Editar a última avaliação" aria-label="Editar">${IC.edit}</button><button class="icon-btn" data-act="nova-av" data-id="${tr.dataset.nut}" title="Nova avaliação" aria-label="Nova">${IC.plus}</button><button class="icon-btn" data-act="del-av" data-id="${v.id}" title="Excluir a última avaliação" aria-label="Excluir" style="color:var(--red)">${IC.trash}</button></td>`); });
  return tmp.innerHTML;
};

/* ---------- filtro de período (ano todo, semestres e meses) ---------- */
const PERIODOS = [['ano', 'Ano todo'], ['s1', '1º semestre'], ['s2', '2º semestre'], ...['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((n, i) => [pad(i + 1), n])];
