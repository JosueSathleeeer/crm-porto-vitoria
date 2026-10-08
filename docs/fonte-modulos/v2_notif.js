/* ================= NOTIFICAÇÕES + ALERTAS DO ATLETA + DADOS DE TESTE ================= */
IC.bell = I('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>');
TITLES.notif = ['Notificações', 'Central de avisos'];
NAV.push({ k: 'notif', n: 'Notificações', ic: IC.bell });
UI.nfTipo = 'Todas'; UI.nfLidas = false;

/* ---------- alertas de um atleta ---------- */
function diasSeguidos(aid, d) { let n = 0; for (let k = 0; k < 30; k++) { const x = addDays(d, -k); if ((S.pse || []).some(r => r.atletaId === aid && r.data === x && carga(r) > 0)) n++; else if (k === 0) continue; else break; } return n; }
function alertasAtleta(a, d = todayISO()) {
  const out = [], sc = statusCarga(a, d), rk = sc ? sc.rk : riscoAtl(a, d), pr = prontidao(a.id, d);
  if (rk.c.acwr != null) { if (rk.c.acwr > 1.5) out.push(['bad', `ACWR = ${nf(rk.c.acwr, 2)} (risco de lesão)`]); else if (rk.c.acwr > 1.3) out.push(['warn', `ACWR = ${nf(rk.c.acwr, 2)} (aumento rápido de carga)`]); else if (rk.c.acwr < 0.8 && rk.c.n28 >= 3) out.push(['warn', `ACWR = ${nf(rk.c.acwr, 2)} (destreino / carga baixa)`]); }
  if (rk.mo != null && rk.mo > 2) out.push(['warn', `Monotonia ${nf(rk.mo, 1)} (pouca variação na semana)`]);
  const ds = diasSeguidos(a.id, d); if (ds >= 5) out.push(['warn', `${ds} treinos consecutivos sem descanso`]);
  if (pr && pr.p < 60) out.push(['bad', `Prontidão ${pr.p}% hoje (PSR ${pr.psr ?? '—'})`]);
  if (pr) { const st = beSt(pr.r); if (st.st === 'INTERVENÇÃO') out.push(['bad', 'Bem-estar em intervenção: ' + st.flags.map(f => FLAGN[f]).join(', ')]); if (temDor(pr.r)) out.push(['warn', `Dor informada${pr.r.escalaDor ? ' (' + pr.r.escalaDor + '/10)' : ''}${pr.r.localDor ? ': ' + pr.r.localDor : ''}`]); if (nrmB(pr.r.treinaHoje) === 'nao') out.push(['warn', 'Informou que não vai treinar' + (pr.r.motivo ? ': ' + pr.r.motivo : '')]); }
  const at = ativaDe(a.id); if (at) out.push(['info', `No DM: ${STATUS[at.status]} · ${lesNome(at)}`]);
  return { sc, rk, pr, lista: out };
}
function pendAtleta(a, d = todayISO()) {
  const p = [];
  if (!(S.bemestar || []).some(r => r.atletaId === a.id && r.data === d && r.sono !== undefined)) p.push('Bem-estar de hoje');
  const ont = [d, addDays(d, -1)].find(x => ativas(sessoesDia(a.categoria, x)).length && x <= d);
  if (ont && !(S.pse || []).some(r => r.atletaId === a.id && r.data === ont)) p.push('PSE de ' + (ont === d ? 'hoje' : 'ontem'));
  if (pendente(a, 'fis')) p.push('Avaliação física'); if (pendente(a, 'corp')) p.push('Avaliação corporal'); if (pendente(a, 'mat')) p.push('Maturação');
  return p;
}
function alertaBox(a) {
  const A = alertasAtleta(a), pend = pendAtleta(a), sc = A.sc;
  const nv = sc ? sc.t : 'SEM DADOS', cls = sc ? sc.c : 'neu';
  const n = A.lista.filter(x => x[0] !== 'info').length;
  return `<div class="falert"><div class="find ${cls}">${IC.med}<div><small>Indicador de carga</small><b>${nv === 'ELEVADA' ? 'ELEVADO' : nv === 'ALTA' ? 'ALTO' : nv === 'BAIXA' ? 'BAIXO' : nv}</b><span>Composto de carga (ACWR, monotonia e PSE)${sc && sc.rk.c.acwr != null ? ' · ACWR ' + nf(sc.rk.c.acwr, 2) : ''}</span></div></div>
    <div class="flist ${n ? 'has' : ''}"><h5>${IC.cross} ${n ? `${n} alerta(s) ativo(s)` : 'Nenhum alerta ativo'}</h5>${A.lista.map(([c, t]) => `<div class="fa f-${c}"><i></i>${esc(t)}</div>`).join('') || '<div class="fa f-ok"><i></i>Carga, prontidão e bem-estar dentro do esperado</div>'}</div>
    <div class="flist pend"><h5>${IC.bell} ${pend.length ? `Falta (${pend.length})` : 'Nada pendente'}</h5>${pend.map(t => `<div class="fa f-info"><i></i>${esc(t)}</div>`).join('') || '<div class="fa f-ok"><i></i>Questionários e avaliações em dia</div>'}</div></div>`;
}
const _fichaHTML3 = fichaHTML;
fichaHTML = function (a) { const h = _fichaHTML3(a); const tmp = document.createElement('div'); tmp.innerHTML = h; const top = tmp.querySelector('.ftop'); if (top) top.insertAdjacentHTML('afterend', alertaBox(a)); return tmp.innerHTML; };
const _atlCard4 = atlCard;
atlCard = function (a) { const h = _atlCard4(a); const n = alertasAtleta(a).lista.filter(x => x[0] !== 'info').length; return n ? h.replace('<span class="ainit">', `<span class="alcount" title="${n} alerta(s) ativo(s)">${n}</span><span class="ainit">`) : h; };

/* ---------- central de notificações ---------- */
function notificacoes() {
  const d = todayISO(), ats = atletasCat(), L = [];
  const add = (key, tipo, nivel, titulo, det, lista, nav) => L.push({ key: key + '|' + d, tipo, nivel, titulo, det, lista: lista || [], nav });
  const semBe = ats.filter(a => !(S.bemestar || []).some(r => r.atletaId === a.id && r.data === d && r.sono !== undefined));
  if (semBe.length) add('be', 'Questionários', semBe.length === ats.length ? 'info' : 'warn', `${semBe.length} atleta(s) sem questionário de bem-estar hoje`, `${ats.length - semBe.length} de ${ats.length} responderam`, semBe, 'mon-be');
  const cats = [...new Set(ats.map(a => a.categoria))];
  cats.forEach(c => { [d, addDays(d, -1)].forEach(x => { const ss = ativas(sessoesDia(c, x)); if (!ss.length) return; const el = ats.filter(a => a.categoria === c), sem = el.filter(a => !(S.pse || []).some(r => r.atletaId === a.id && r.data === x)); if (sem.length) add('pse' + c + x, 'Questionários', 'warn', `${sem.length} atleta(s) do ${c} sem PSE da sessão de ${x === d ? 'hoje' : 'ontem'}`, ss.map(s => (SESS[s.tipo] || SESS.treino)[0]).join(' + ') + ' · ' + fmtD(x), sem, 'mon-pse'); }); });
  const AL = ats.map(a => ({ a, A: alertasAtleta(a, d) }));
  const risco = AL.filter(x => x.A.sc && x.A.sc.c === 'bad'); if (risco.length) add('carga', 'Carga', 'bad', `${risco.length} atleta(s) com indicador de carga ALTO`, 'ACWR acima de 1,5, monotonia alta ou bem-estar em intervenção', risco.map(x => x.a), 'mon-pse');
  const seg = AL.filter(x => x.A.lista.some(l => /consecutivos/.test(l[1]))); if (seg.length) add('seguidos', 'Carga', 'warn', `${seg.length} atleta(s) com 5 ou mais treinos seguidos sem descanso`, 'Considere uma folga ou sessão regenerativa', seg.map(x => x.a), 'mon-pse-sem');
  const pr = AL.filter(x => x.A.pr && x.A.pr.p < 60); if (pr.length) add('pront', 'Carga', 'bad', `${pr.length} atleta(s) com prontidão baixa hoje`, 'Prontidão abaixo de 60% no bem-estar', pr.map(x => x.a), 'mon-pse');
  const dor = AL.filter(x => x.A.lista.some(l => /^Dor informada/.test(l[1]))); if (dor.length) add('dor', 'Departamento médico', 'warn', `${dor.length} atleta(s) informaram dor hoje`, 'Avaliar com o DM antes da atividade', dor.map(x => x.a), 'mon-be');
  const venc = lesAtivas().filter(l => l.previsao && l.previsao < d && ats.some(a => a.id === l.atletaId)); if (venc.length) add('dmprev', 'Departamento médico', 'warn', `${venc.length} lesão(ões) com previsão de retorno vencida`, 'Atualize o status ou a previsão no DM', venc.map(l => atl(l.atletaId)).filter(Boolean), 'dm-lesionados');
  [['fis', 'avaliação física', 'av-dash'], ['corp', 'avaliação corporal', 'nut-comp'], ['mat', 'medição de maturação', 'mat-dash']].forEach(([t, n, nav]) => { const l = ats.filter(a => pendente(a, t)); if (l.length) add('pend' + t, 'Avaliações', 'info', `${l.length} atleta(s) sem ${n} na temporada`, 'Pendência da temporada ' + anoLabel(), l, nav); });
  (S.config.agenda || []).filter(x => x.data >= d && dayDiff(d, x.data) <= 7).forEach(x => add('ag' + x.id, 'Agenda', 'info', `Teste agendado: ${x.teste}`, `${fmtD(x.data)} · ${x.categoria}`, [], 'av-dash'));
  const aniv = ats.filter(a => a.nascimento && a.nascimento.slice(5) === d.slice(5)); if (aniv.length) add('aniv', 'Agenda', 'info', `Aniversário hoje: ${aniv.map(a => a.apelido || a.nome.split(' ')[0]).join(', ')}`, '', aniv, null);
  return L;
}
const lidas = () => new Set(S.config.notifLidas || []);
function vNotif() {
  const L = notificacoes(), rd = lidas(), tipos = ['Todas', ...new Set(L.map(n => n.tipo))];
  const vis = L.filter(n => (UI.nfTipo === 'Todas' || n.tipo === UI.nfTipo) && (UI.nfLidas || !rd.has(n.key)));
  const nao = L.filter(n => !rd.has(n.key)).length;
  const ats = atletasCat().map(a => ({ a, p: pendAtleta(a), al: alertasAtleta(a).lista.filter(x => x[0] !== 'info') })).filter(x => x.p.length || x.al.length).sort((x, y) => y.al.length - x.al.length || y.p.length - x.p.length);
  return header({ title: 'NOTIFICAÇÕES', sub: 'CENTRAL DE AVISOS DA COMISSÃO', items: hdrItems(), solo: true }) + `
  <div class="kpis k4">${kpi('bell', 'Não lidas', nao, 'avisos de hoje')}${kpi('cross', 'Alertas de carga', L.filter(n => n.tipo === 'Carga').reduce((s, n) => s + n.lista.length, 0), 'atletas citados', 'red')}${kpi('clip', 'Questionários', L.filter(n => n.tipo === 'Questionários').reduce((s, n) => s + n.lista.length, 0), 'respostas faltando', 'gold')}${kpi('stopw', 'Avaliações pendentes', L.filter(n => n.tipo === 'Avaliações').reduce((s, n) => s + n.lista.length, 0), 'física, corporal e maturação', 'blue')}</div>
  <div class="row r21" style="align-items:start">
    <div class="panel"><div class="ph">Fila de atenção · ${fmtD(todayISO())}<span class="r"><button data-act="nf-all">Marcar todas como lidas</button></span></div>
      <div class="pb nfbar"><div class="hchips">${tipos.map(t => `<button class="${UI.nfTipo === t ? 'on' : ''}" data-act="nf-tipo" data-v="${t}">${t}</button>`).join('')}</div><label class="chk" style="margin-left:auto"><input type="checkbox" id="nfLidas" ${UI.nfLidas ? 'checked' : ''}> Mostrar lidas</label></div>
      <div class="nfl">${vis.map(n => `<div class="nfi n-${n.nivel} ${rd.has(n.key) ? 'lida' : ''}"><i></i><div class="nft"><small>${esc(n.tipo)}</small><b>${esc(n.titulo)}</b>${n.det ? `<span>${esc(n.det)}</span>` : ''}${n.lista.length ? `<div class="nfa">${n.lista.slice(0, 14).map(a => `<span class="agp" data-ficha-open="${a.id}">${esc((a.apelido || a.nome).split(' ').slice(0, 2).join(' '))}</span>`).join('')}${n.lista.length > 14 ? `<span class="muted">+${n.lista.length - 14}</span>` : ''}</div>` : ''}</div><div class="nfb">${n.nav ? `<button class="btn sm" data-nav="${n.nav}">Abrir</button>` : ''}${rd.has(n.key) ? '' : `<button class="btn sm" data-act="nf-lida" data-k="${esc(n.key)}">Marcar como lida</button>`}</div></div>`).join('') || `<div class="pb">${miniEmpty(L.length ? 'Tudo lido por hoje' : 'Nenhum aviso hoje', L.length ? 'Marque “Mostrar lidas” para ver de novo.' : 'Questionários, avaliações e cargas em dia.')}</div>`}</div></div>
    <div class="panel"><div class="ph">O que falta por atleta<span class="r">${ats.length}</span></div><div class="nfpa">${ats.map(x => `<div class="nfp" data-ficha-open="${x.a.id}">${fotoBox(x.a, 'mini')}<div><b>${esc(x.a.apelido || x.a.nome)}</b><div>${x.al.map(l => `<span class="nfc c-${l[0]}">${esc(l[1])}</span>`).join('')}${x.p.map(t => `<span class="nfc c-info">Falta: ${esc(t)}</span>`).join('')}</div></div></div>`).join('') || `<div class="pb">${miniEmpty('Nenhuma pendência', 'Todos os atletas em dia.')}</div>`}</div><p class="muted pb" style="font-size:11.5px;margin:0">Apenas monitoramento: não é diagnóstico médico nem previsão de lesão.</p></div>
  </div>`;
}
const notifCount = () => { try { const rd = lidas(); return notificacoes().filter(n => !rd.has(n.key) && n.nivel !== 'info').length; } catch (e) { return 0; } };
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'nf-tipo') { UI.nfTipo = t.dataset.v; render(); }
  if (t.dataset.act === 'nf-lida') { S.config.notifLidas = [...(S.config.notifLidas || []).slice(-300), t.dataset.k]; putConfig(); render(); }
  if (t.dataset.act === 'nf-all') { S.config.notifLidas = [...new Set([...(S.config.notifLidas || []).slice(-300), ...notificacoes().map(n => n.key)])]; putConfig(); render(); }
});
document.addEventListener('change', e => { if (e.target.id === 'nfLidas') { UI.nfLidas = e.target.checked; render(); } });

/* ---------- dados de teste do monitoramento (para ver como fica; dá para limpar depois) ---------- */
function catTeste() { if (F.categoria !== 'Todas') return F.categoria; const c = countBy(S.atletas, a => a.categoria); return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sub-15'; }
async function carregarTeste() {
  const cat = catTeste(), ats = S.atletas.filter(a => a.categoria === cat); if (!ats.length) { toast('Cadastre atletas nessa categoria antes.', true); return; }
  progress('Gerando dados de teste…');
  let s = 17; const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; const pick = a => a[Math.floor(r() * a.length)];
  const plan = [['recup', 'Recuperação', '09:00', 45, 3], ['treino', 'Treino de campo', '10:00', 75, 6], ['forca', 'Força', '10:00', 80, 7], ['cond', 'Condicionamento', '10:00', 70, 6], ['matchprep', 'Match preparation', '10:00', 60, 4], ['jogo', 'Jogo', '15:00', 90, 8], ['folga', 'Folga', '', 0, null]];
  const w0 = segunda(todayISO()), micro = [], pse = [], be = [];
  for (let wk = -4; wk <= 0; wk++) plan.forEach((p, i) => { const d = addDays(w0, wk * 7 + i); if (!sessoesDia(cat, d).length) micro.push({ id: `demo_ms_${cat}_${d}`, demo: true, categoria: cat, data: d, tipo: p[0], titulo: p[0] === 'jogo' ? '' : p[1], hora: p[2], duracao: p[3], pse: p[4], adversario: p[0] === 'jogo' ? pick(['Rio Branco', 'Desportiva', 'Vitória', 'Serra', 'Real Noroeste']) : '', mando: r() < 0.5 ? 'casa' : 'fora' });
    if (p[0] !== 'folga' && d <= todayISO()) ats.forEach((a, k) => { if (r() < 0.08) return; const extra = k % 7 === 0 && wk === 0 ? 2.5 : 0; pse.push({ id: `demo_pse_${a.id}_${d}`, demo: true, atletaId: a.id, data: d, sessao: p[0] === 'jogo' ? 'Jogo' : p[0] === 'recup' ? 'Recuperação' : 'Treino', pse: Math.max(1, Math.min(10, Math.round(p[4] + r() * 2 - 1 + extra))), duracao: p[3] + (extra ? 20 : 0) }); }); });
  for (let k = 0; k < 14; k++) { const d = addDays(todayISO(), -k); ats.forEach((a, j) => { if (r() < (k === 0 ? 0.25 : 0.12)) return; const ruim = j % 6 === 0 && k < 3; be.push({ id: `demo_be_${a.id}_${d}`, demo: true, atletaId: a.id, data: d, origem: 'teste', treinaHoje: r() < 0.05 ? 'Não' : 'Sim', dor: ruim && r() < 0.6 ? 'Dolorido' : 'Normal', escalaDor: ruim ? 3 + Math.floor(r() * 5) : null, localDor: ruim ? pick(['Coxa direita', 'Panturrilha esquerda', 'Joelho', 'Lombar']) : '', fadiga: ruim ? pick(BEF.fadiga.slice(3)) : pick(BEF.fadiga.slice(0, 3)), recuperacao: ruim ? pick(BEF.recuperacao.slice(3)) : pick(BEF.recuperacao.slice(0, 3)), sono: ruim ? pick(BEF.sono.slice(3)) : pick(BEF.sono.slice(0, 3)), estresse: pick(BEF.estresse.slice(0, 4)), humor: pick(BEF.humor.slice(0, 3)), urina: ruim ? 5 + Math.floor(r() * 3) : 1 + Math.floor(r() * 4), motivo: '' }); }); }
  try { progress(`Salvando ${micro.length} sessões…`); await saveMany('micro', micro); progress(`Salvando ${pse.length} registros de PSE…`); await saveMany('pse', pse); progress(`Salvando ${be.length} questionários…`); await saveMany('bemestar', be); } catch (e) { }
  progressEnd(); render(); toast(`Dados de teste do ${cat}: ${micro.length} sessões, ${pse.length} PSE e ${be.length} questionários`);
}
async function limparTeste() {
  const cols = ['micro', 'pse', 'bemestar'], ops = cols.flatMap(c => (S[c] || []).filter(x => x.demo || String(x.id).startsWith('demo_')).map(x => [c, x.id]));
  if (!ops.length) { toast('Não há dados de teste para limpar.'); return; }
  progress('Limpando dados de teste…'); cols.forEach(c => S[c] = (S[c] || []).filter(x => !(x.demo || String(x.id).startsWith('demo_'))));
  if (db) { for (let i = 0; i < ops.length; i += 20) await Promise.all(ops.slice(i, i + 20).map(([c, id]) => db.collection(c).doc(id).delete().catch(() => { }))); } else lsSave();
  progressEnd(); render(); toast(`${ops.length} registro(s) de teste removido(s)`);
}
const temTeste = () => ['micro', 'pse', 'bemestar'].some(c => (S[c] || []).some(x => x.demo || String(x.id).startsWith('demo_')));
const _vMon3 = vMon;
vMon = function () {
  const h = _vMon3(); if (PRINT) return h;
  const box = !(S.pse || []).length ? `<div class="abanner warn">${IC.clip}<div><b>Ainda não há dados de PSE</b><span>Quer ver como fica? Carregue dados de teste do ${esc(catTeste())} (5 semanas de microciclo, PSE e bem-estar). Depois é só limpar. <button class="btn sm pri" data-act="teste-on" style="margin-left:8px">Carregar dados de teste</button></span></div></div>` : temTeste() ? `<div class="abanner warn">${IC.clip}<div><b>Você está vendo dados de teste</b><span>Quando quiser começar com os dados reais: <button class="btn sm" data-act="teste-off" style="margin-left:8px">${IC.trash} Limpar dados de teste</button></span></div></div>` : '';
  if (!box) return h; const i = h.indexOf('</nav>'); return i < 0 ? box + h : h.slice(0, i + 6) + box + h.slice(i + 6);
};
document.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'teste-on') carregarTeste(); if (t.dataset.act === 'teste-off') confirmar('Apagar todos os dados de teste (sessões, PSE e questionários de exemplo)? Os dados reais não são afetados.', limparTeste); });
