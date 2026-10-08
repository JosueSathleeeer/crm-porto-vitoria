/* ================= INÍCIO · DASHBOARD GERAL ================= */
IC.home = I('<path d="M3 11 12 3l9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>');
IC.trophy = I('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>');
TITLES.inicio = ['Início', 'Dashboard geral'];
NAV.unshift({ k: 'inicio', n: 'Início', ic: IC.home });

// pendências: só aparece o que falta (sem selos quando está tudo em dia)
evalBadges = function (a) {
  const f = []; if (pendente(a, 'fis')) f.push('Física'); if (pendente(a, 'corp')) f.push('Corporal'); if (pendente(a, 'mat')) f.push('Maturação');
  return f.length ? `<span class="evfalta" title="Avaliações pendentes na temporada">${IC.cross} Falta: ${f.join(', ')}</span>` : '';
};

function jogosCat() {
  const M = window.MIN && MIN.S; if (!M) return [];
  return (M.jogos || []).filter(j => (F.categoria === 'Todas' || j.categoria === F.categoria) && (noPeriodo(String(j.data || ''))));
}
function resultado(j) { const p = j.golsPro, c = j.golsContra; if (p === '' || p == null || c === '' || c == null) return null; return +p > +c ? 'V' : +p < +c ? 'D' : 'E'; }
function lideres(campo, n = 5) {
  const js = jogosCat(), m = new Map();
  js.forEach(j => (j.relacionados || []).forEach(r => { const v = campo === 'min' ? +r.min || 0 : campo === 'gols' ? +r.gols || 0 : +r.assist || 0; if (!v) return; const o = m.get(r.atletaId) || { v: 0, j: 0 }; o.v += v; if (+r.min) o.j++; m.set(r.atletaId, o); }));
  return [...m.entries()].map(([id, o]) => ({ a: atl(id) || (window.MIN && MIN.S.atletas.find(x => x.id === id)), ...o })).filter(x => x.a).sort((x, y) => y.v - x.v).slice(0, n);
}
const lidList = (l, u) => l.length ? `<div class="lid">${l.map((x, i) => `<div class="lidr" data-ficha-open="${x.a.id}"><span class="lpos p${i + 1}">${i + 1}</span>${fotoBox(x.a, 'mini')}<span class="lnm"><b>${esc(x.a.apelido || x.a.nome)}</b><small>${esc(POSN[x.a.posicao] || '')} · ${x.j} jogo(s)</small></span><b class="lv">${x.v}<small>${u}</small></b></div>`).join('')}</div>` : miniEmpty('Sem dados', 'Os números vêm dos jogos minutados.');

function vInicio() {
  const ats = atletasCat(), js = jogosCat().sort((a, b) => String(b.data).localeCompare(String(a.data)));
  const res = js.map(resultado).filter(Boolean), v = res.filter(r => r === 'V').length, e = res.filter(r => r === 'E').length, d = res.filter(r => r === 'D').length;
  const gp = js.reduce((s, j) => s + (+j.golsPro || 0), 0), gc = js.reduce((s, j) => s + (+j.golsContra || 0), 0);
  const minTot = js.reduce((s, j) => s + (j.relacionados || []).reduce((t, r) => t + (+r.min || 0), 0), 0);
  const aprov = res.length ? Math.round((v * 3 + e) / (res.length * 3) * 100) : null;
  // DM
  const at = lesAtivas(), noDM = new Set(at.map(l => l.atletaId)).size, lesTemp = lesPeriodo();
  // nutrição
  const U = ultimas(), lst = [...U.values()].map(x => calcAv(x)), gs = lst.map(c => c.g).filter(x => x != null);
  const fora = lst.filter(c => c.g != null && faixa(c.g) !== 'ideal').length;
  // avaliação física
  const testados = ats.filter(a => tsDe(a.id).some(t => naTemporada(t.data))).length;
  const topT = k => ats.map(a => { const t = ultimoTeste(a.id, k); return t ? { a, v: tval(t, k) } : null; }).filter(Boolean).sort((x, y) => TESTS[k].up > 0 ? y.v - x.v : x.v - y.v)[0];
  // maturação
  const mats = [...matUltimas().values()].map(m => ({ m, c: calcMat(m), a: atl(m.atletaId) })).filter(x => x.a && x.c && x.c.mo != null).map(x => ({ ...x, tm: timing(x.c) }));
  const mcnt = countBy(mats, x => x.c.st);
  const adi = [...mats].sort((x, y) => y.tm.d - x.tm.d);
  // pendências
  const pend = t => ats.filter(a => pendente(a, t));
  const ag = (S.config.agenda || []).filter(x => x.data >= todayISO()).sort((a, b) => a.data.localeCompare(b.data)).slice(0, 4);
  const mes = todayISO().slice(5, 7); const aniv = ats.filter(a => a.nascimento && a.nascimento.slice(5, 7) === mes).sort((a, b) => a.nascimento.slice(8).localeCompare(b.nascimento.slice(8)));
  const link = (nav, t) => `<button data-nav="${nav}">${t}</button>`;
  const res5 = js.slice(0, 6).map(j => { const r = resultado(j); return `<div class="jgr"><span class="rs r${r || 'N'}">${r || '–'}</span><span class="jd">${fmtDs(j.data)}</span><span class="ja"><b>${esc(j.adversario || '—')}</b><small>${esc(j.competicao || '')} · ${j.mando === 'fora' ? 'fora' : 'casa'}</small></span><b class="jp">${j.golsPro ?? '–'} x ${j.golsContra ?? '–'}</b></div>`; }).join('');
  const kp = (ic, k, val, s, cls = '') => kpi(ic, k, val, s, cls);
  return header({ title: 'PAINEL GERAL', sub: 'PERFORMANCE HUB · VISÃO GERAL', items: hdrItems(), solo: true }) + noData() + `
  <div class="kpis k8">
    ${kp('ball', 'Jogos', js.length, `${res.length} com placar`)}
    ${kp('trophy', 'Vitórias', v, `${e} empates · ${d} derrotas`)}
    ${kp('trend', 'Aproveitamento', aprov != null ? aprov + '%' : '—', 'pontos conquistados')}
    ${kp('goal', 'Gols', `${gp}<small>pró</small>`, `${gc} sofridos · saldo ${gp - gc >= 0 ? '+' : ''}${gp - gc}`)}
    ${kp('clock', 'Minutos jogados', minTot.toLocaleString('pt-BR'), 'soma do elenco')}
    ${kp('users', 'Elenco', ats.length, F.categoria === 'Todas' ? 'todas as categorias' : catLabel().toLowerCase())}
    ${kp('med', 'No DM agora', noDM, `${lesTemp.length} lesões na temporada`, 'red')}
    ${kp('stopw', 'Avaliados (físico)', `${testados}<small>/ ${ats.length}</small>`, pct(testados, ats.length) + ' do elenco', 'blue')}
  </div>
  <div class="row r4h">
    ${panel('Últimos jogos', res5 ? `<div class="jgl">${res5}</div>` : miniEmpty('Sem jogos', 'Cadastre jogos na Minutagem.'), { r: link('m-jogos-painel', 'Ver jogos') })}
    ${panel(`${IC.goal.replace('<svg', '<svg width="18" height="18"')} Artilheiros`, lidList(lideres('gols'), 'gols'), { r: link('m-min-geral', 'Minutagem') })}
    ${panel('Assistências', lidList(lideres('ast'), 'ast.'), { r: link('m-min-geral', 'Minutagem') })}
    ${panel('Mais minutos', lidList(lideres('min'), "'"), { r: link('m-min-geral', 'Minutagem') })}
  </div>
  <div class="row r4h">
    ${panel('Departamento médico', `<div class="hstat"><div><b>${noDM}</b><span>no DM agora</span></div><div><b>${pct(ats.length - noDM, ats.length)}</b><span>disponíveis</span></div><div><b>${lesTemp.length}</b><span>lesões na temporada</span></div></div>${at.length ? `<div class="lid">${at.slice(0, 5).map(l => { const a = atl(l.atletaId); return a ? `<div class="lidr" data-open-les="${l.id}">${lesThumb(l, 'sm')}<span class="lnm"><b>${esc(a.apelido || a.nome)}</b><small>${esc(lesNome(l))} · ${esc(regFull(l))}</small></span>${chip(l.status)}</div>` : ''; }).join('')}</div>` : miniEmpty('DM vazio', 'Ninguém lesionado agora.')}`, { r: link('dashboard', 'Abrir DM') })}
    ${panel('Nutrição', `<div class="hstat"><div><b>${U.size}</b><span>avaliados</span></div><div><b>${nfx(mean(gs), 1, '%')}</b><span>% gordura médio</span></div><div><b class="${fora ? 'up' : 'down'}">${fora}</b><span>fora da faixa</span></div></div>${gs.length ? `<div class="donut-wrap">${donut(Object.keys(FAIXAS).map(k => ({ l: FAIXAS[k][0], v: lst.filter(c => faixa(c.g) === k).length, c: FAIXAS[k][1] })), gs.length, 'AVALIADOS', 120)}${legend(Object.keys(FAIXAS).map(k => ({ l: FAIXAS[k][0], v: lst.filter(c => faixa(c.g) === k).length, c: FAIXAS[k][1] })))}</div>` : miniEmpty('Sem avaliações corporais')}`, { r: link('nut-dash', 'Abrir nutrição') })}
    ${panel('Ranking das avaliações físicas', `<div class="lid">${Object.keys(TESTS).map(k => { const x = topT(k); return x ? `<div class="lidr" data-avatl="${x.a.id}">${fotoBox(x.a, 'mini')}<span class="lnm"><b>${esc(x.a.apelido || x.a.nome)}</b><small>Melhor em ${TESTS[k].n}</small></span><b class="lv">${fmtT(k, x.v)}<small>${TESTS[k].u}</small></b></div>` : ''; }).join('') || miniEmpty('Sem testes')}</div>`, { r: link('av-dash', 'Abrir avaliação física') })}
    ${panel('Ranking de maturação', mats.length ? `<div class="hstat"><div><b>${mcnt.pre || 0}</b><span>pré-PHV</span></div><div><b>${mcnt.circa || 0}</b><span>no pico</span></div><div><b>${mcnt.pos || 0}</b><span>pós-PHV</span></div></div><div class="lid">${adi.slice(0, 2).concat(adi.length > 3 ? adi.slice(-2) : []).map(x => `<div class="lidr" data-matatl="${x.a.id}">${fotoBox(x.a, 'mini')}<span class="lnm"><b>${esc(x.a.apelido || x.a.nome)}</b><small>Idade biológica ${nf(x.tm.bio, 1)} · ${x.tm.t[0]}</small></span><b class="lv" style="color:${x.tm.t[1]}">${x.tm.d >= 0 ? '+' : '−'}${nf(Math.abs(x.tm.d), 1)}<small>anos</small></b></div>`).join('')}</div>` : miniEmpty('Sem medições'), { r: link('mat-dash', 'Abrir maturação') })}
  </div>
  <div class="row r3">
    ${panel('Avaliações pendentes na temporada', ['fis', 'corp', 'mat'].map(t => { const l = pend(t); const nm = { fis: 'Física', corp: 'Corporal', mat: 'Maturação' }[t]; return `<div class="pendl"><b class="${l.length ? 'up' : 'down'}">${l.length ? l.length + ' sem ' + nm.toLowerCase() : nm + ': todos em dia'}</b>${l.length ? `<div>${l.slice(0, 12).map(a => `<span class="bchip" data-ficha-open="${a.id}">${esc(a.apelido || a.nome.split(' ')[0])}</span>`).join('')}${l.length > 12 ? `<span class="muted"> +${l.length - 12}</span>` : ''}</div>` : ''}</div>`; }).join(''), { r: link('atletas', 'Ver atletas') })}
    ${panel('Próximos testes agendados', ag.length ? ag.map(x => `<div class="sfrow"><span>${IC.cal} ${fmtD(x.data)}</span><span>${esc(x.teste)}</span><span class="muted">${esc(x.categoria)}</span></div>`).join('') : miniEmpty('Nada agendado', 'Agende em Avaliação física → Painel geral.'), { r: link('av-dash', 'Agendar') })}
    ${panel(`Aniversariantes de ${MESES[+mes - 1].toLowerCase()}`, aniv.length ? `<div class="lid">${aniv.map(a => `<div class="lidr" data-ficha-open="${a.id}">${fotoBox(a, 'mini')}<span class="lnm"><b>${esc(a.apelido || a.nome)}</b><small>${esc(a.subcategoria || a.categoria)}</small></span><b class="lv">${a.nascimento.slice(8, 10)}/${mes}<small>${idade(a.nascimento) + (a.nascimento.slice(5) > todayISO().slice(5) ? 1 : 0)} anos</small></b></div>`).join('')}</div>` : miniEmpty('Ninguém faz aniversário este mês'))}
  </div>`;
}

const _renderAs2 = renderAs;
renderAs = function (view) { if (view === 'inicio') { const v0 = S.view; S.view = 'inicio'; try { return vInicio(); } finally { S.view = v0; } } return _renderAs2(view); };
