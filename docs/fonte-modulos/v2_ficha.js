/* ================= ATLETAS: CARTÕES DETALHADOS + FICHA INDIVIDUAL ================= */
Object.assign(IC, {
  goal: I('<circle cx="12" cy="12" r="10"/><path d="m12 7 4.2 3.1-1.6 5H9.4l-1.6-5z"/>'),
  boot: I('<path d="M3 15c0-3 1-7 2-9h5l1 4c3 0 6 1 8 3 1 1 2 2 2 4v1H3z"/><path d="M3 18h18"/>'),
  foot: I('<path d="M9 2c2 0 3 2 3 5s-1 5-1 8 1 7-2 7-4-3-4-7 1-6 1-8 1-5 3-5z"/>'),
  dots: I('<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>', '0 0 24 24', true),
  shirt: I('<path d="M8 3 3 6l2 5 2-1v11h10V10l2 1 2-5-5-3a4 4 0 0 1-8 0z"/>')
});
UI.atPage = 0; UI.atPer = 12; UI.fichaTab = 'geral'; UI.fichaId = null;
const PE_ABR = p => ({ Direito: 'Destro', Esquerdo: 'Canhoto', Ambidestro: 'Ambidestro' }[p] || '—');

/* ---------- números de cada atleta ---------- */
function minStats(aid) {
  const M = window.MIN && MIN.S; const out = { jogos: 0, min: 0, gols: 0, ast: 0, tit: 0, res: 0, ca: 0, cv: 0, rel: 0, possivel: 0, lista: [] };
  if (!M) return out;
  (M.jogos || []).filter(j => noPeriodo(String(j.data || ''))).forEach(j => {
    const r = (j.relacionados || []).find(x => x.atletaId === aid); if (!r) return;
    const m = +r.min || 0, dur = +j.duracao || +(M.config?.duracao?.[j.categoria]) || 90;
    out.rel++; out.possivel += dur; if (m > 0) out.jogos++; out.min += m; out.gols += +r.gols || 0; out.ast += +r.assist || 0; out.ca += +r.ca || 0; out.cv += +r.cv || 0;
    if (r.status === 'T') out.tit++; else out.res++;
    out.lista.push({ j, r, m, dur });
  });
  out.lista.sort((x, y) => String(y.j.data).localeCompare(String(x.j.data)));
  return out;
}
function periodo() {
  const hoje = todayISO();
  if (F.ano === 'Todos') { const d = S.lesoes.map(l => l.data).sort()[0] || hoje.slice(0, 4) + '-01-01'; return [d, hoje]; }
  const p = F.periodo || 'ano', mm = /^\d\d$/.test(p) ? p : null; const ini = F.ano + (p === 's2' ? '-07-01' : mm ? `-${mm}-01` : '-01-01'), fim = F.ano + (p === 's1' ? '-06-30' : mm ? `-${mm}-${new Date(+F.ano, +mm, 0).getDate()}` : '-12-31');
  return [ini, fim < hoje ? fim : hoje];
}
function dispon(aid) {
  const [ini, fim] = periodo(); const tot = Math.max(1, dayDiff(ini, fim) + 1);
  let dm = 0;
  S.lesoes.filter(l => l.atletaId === aid).forEach(l => { const e = l.status === 'liberado' && l.statusDatas?.liberado ? l.statusDatas.liberado : todayISO(); const a = l.data > ini ? l.data : ini, b = e < fim ? e : fim; if (b >= a) dm += dayDiff(a, b); });
  return { pct: Math.max(0, Math.min(100, Math.round((1 - dm / tot) * 100))), dias: dm };
}
function statusFisico(a) {
  const at = ativaDe(a.id), ms = minStats(a.id), hoje = todayISO();
  // carga: minutos dos últimos 28 dias comparados com a média de 28 dias da temporada (relação aguda : crônica)
  const d28 = addDays(hoje, -28); const ag = ms.lista.filter(x => x.j.data >= d28).reduce((s, x) => s + x.m, 0);
  const [ini] = periodo(); const sem = Math.max(1, dayDiff(ini, hoje) / 28); const cr = ms.min / sem;
  let carga = 'Sem dados', cc = 'neu';
  if (ms.lista.length) { const r = cr ? ag / cr : 0; if (r > 1.5) { carga = 'Alta'; cc = 'bad'; } else if (r >= 0.8 || ag === 0 && cr < 30) { carga = 'Adequada'; cc = 'ok'; } else { carga = 'Baixa'; cc = 'warn'; } }
  const ano = addDays(hoje, -365), recs = S.lesoes.filter(l => l.atletaId === a.id && l.data >= ano);
  let risco = 'Baixo', rc = 'ok'; const pts = recs.length + recs.filter(l => l.recorrente).length * 2 + (carga === 'Alta' ? 2 : 0);
  if (at && at.status !== 'liberado') { risco = at.status === 'retorno' ? 'Moderado' : 'Alto'; rc = at.status === 'retorno' ? 'warn' : 'bad'; }
  else if (pts >= 4) { risco = 'Alto'; rc = 'bad'; } else if (pts >= 2) { risco = 'Moderado'; rc = 'warn'; }
  const apto = !at ? ['Sim', 'ok'] : at.status === 'retorno' ? ['Parcial', 'warn'] : ['Não', 'bad'];
  return { carga, cc, risco, rc, apto, at, disp: dispon(a.id) };
}
const ring = (pct, size = 64, cor = 'var(--g500)') => { const r = 26, c = 2 * Math.PI * r; return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true"><circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--line)" stroke-width="7"/><circle cx="32" cy="32" r="${r}" fill="none" stroke="${cor}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c * pct / 100} ${c}" transform="rotate(-90 32 32)"/></svg>`; };
const gauge = pct => { const r = 52, c = Math.PI * r; return `<svg viewBox="0 0 130 74" width="150" aria-hidden="true"><path d="M13 66a52 52 0 0 1 104 0" fill="none" stroke="var(--line)" stroke-width="11" stroke-linecap="round"/><path d="M13 66a52 52 0 0 1 104 0" fill="none" stroke="var(--g500)" stroke-width="11" stroke-linecap="round" stroke-dasharray="${c * pct / 100} ${c}"/><text x="65" y="58" text-anchor="middle" font-size="24" font-weight="800" fill="var(--ink)" style="font-family:var(--fc)">${pct}%</text></svg>`; };
const fotoBox = (a, cls = '') => `<span class="afoto ${cls}">${a.foto ? `<img src="${esc(a.foto)}" alt="">` : `<span class="sil">${IC.shirt}</span>`}</span>`;

/* ---------- cartões ---------- */
function atlCard(a) {
  const at = ativaDe(a.id), ms = minStats(a.id), d = dispon(a.id);
  const lesT = S.lesoes.filter(l => l.atletaId === a.id).length;
  const lesA = S.lesoes.filter(l => l.atletaId === a.id && (noPeriodo(l.data))).length;
  const sel = UI.selMode && UI.sel.has(a.id);
  return `<div class="acard ${sel ? 'picked' : ''}" data-ficha="${a.id}" tabindex="0" role="button" aria-label="Abrir ficha de ${esc(a.nome)}">
    ${UI.selMode ? `<input type="checkbox" class="selchk acheck" data-sel="${a.id}" ${sel ? 'checked' : ''} aria-label="Selecionar ${esc(a.nome)}">` : ''}
    <div class="atop">
      <span class="ainit">${esc(initials(a.apelido || a.nome))}</span>${fotoBox(a)}
      <div class="ainfo"><b>${esc(a.apelido || a.nome)}${subTag(a)}</b><span>${esc(a.posDetalhe || POSN[a.posicao] || '')}${a.numero ? ' · #' + esc(a.numero) : ''}</span>
        <div class="abadges"><span class="bdm" title="Passagens pelo DM na temporada">DM ${lesA}</span><span class="bles" title="Lesões no histórico">${lesT} ${lesT === 1 ? 'lesão' : 'lesões'}</span><span class="bdisp" title="Disponibilidade na temporada">${d.pct}%</span>${at ? chip(at.status) : ''}</div>
        ${a.avData ? `<span class="aval">${IC.apple} Avaliado em ${fmtD(a.avData)}${a.gordura ? ' · ' + nf(a.gordura, 1) + '% G' : ''}</span>` : '<span class="aval no">Sem avaliação corporal</span>'}
      </div>
      <button class="icon-btn amenu" data-act="atl-menu" data-id="${a.id}" aria-label="Opções de ${esc(a.nome)}">${IC.dots}</button>
    </div>
    <div class="astats">
      <div><small>${IC.clock} Minutos</small><b>${ms.min}</b></div>
      <div><small>${IC.goal} Gols</small><b>${ms.gols}</b></div>
      <div><small>${IC.boot} Assist.</small><b>${ms.ast}</b></div>
      <div><small>${IC.med} DM lesão</small><b>${lesA}</b></div>
      <div><small>${IC.foot} Pé</small><b class="pe">${PE_ABR(a.pe)}</b></div>
    </div>
  </div>`;
}
vAtletas = function () {
  const q = UI.atBusca.toLowerCase(), base = atletasCat();
  const list = base.filter(a => (!q || (a.nome + ' ' + (a.apelido || '')).toLowerCase().includes(q)) && (UI.atPos === 'Todas' || a.posicao === UI.atPos) && (!UI.atPend || typeof pendente !== 'function' || pendente(a, UI.atPend)))
    .sort((a, b) => POS.indexOf(a.posicao) - POS.indexOf(b.posicao) || a.nome.localeCompare(b.nome));
  const pages = Math.max(1, Math.ceil(list.length / UI.atPer)); if (UI.atPage >= pages) UI.atPage = pages - 1;
  const pg = list.slice(UI.atPage * UI.atPer, (UI.atPage + 1) * UI.atPer);
  return `<div class="page-h"><div><h2>Atletas</h2><span class="muted">Plantel, perfil individual e histórico completo · ${base.length} atleta(s) · ${esc(catLabel().toLowerCase())}</span></div><span class="sp"></span><input class="search" id="atBusca" placeholder="Buscar atleta" value="${esc(UI.atBusca)}" aria-label="Buscar atleta"><button class="btn" data-go="importar">${IC.upload} Importar</button><button class="btn danger" data-act="limpar-menu">${IC.trash} Limpar dados</button>${btnAtleta(true)}</div>
  <nav class="subtabs"><button class="on" data-go="atletas">Cadastro</button><button data-go="importar">Importar dados</button></nav>
  <div class="pos-tabs">${['Todas', ...POS].map(p => `<button class="chip ${UI.atPos === p ? 'on' : ''}" data-pos="${p}">${p !== 'Todas' ? `<i style="width:10px;height:10px;border-radius:50%;display:inline-block;background:${PC1[p]}"></i>` : ''}${p === 'Todas' ? 'Todas' : POSN[p]}</button>`).join('')}</div>
  ${UI.selMode ? `<div class="selbar"><label class="chk"><input type="checkbox" id="selAll" ${list.length && list.every(a => UI.sel.has(a.id)) ? 'checked' : ''}>Selecionar todos da lista (${list.length})</label><span class="muted">${UI.sel.size} selecionado(s)</span><span style="flex:1"></span><button class="btn" data-act="sel-cancel">Cancelar</button><button class="btn red" data-act="sel-del" ${UI.sel.size ? '' : 'disabled'}>${IC.trash} Excluir selecionados</button></div>` : ''}
  ${typeof pendBar === 'function' && S.atletas.length ? pendBar(base) : ''}
  ${noData()}
  ${pg.length ? `<div class="agrid">${pg.map(atlCard).join('')}</div>
  <div class="apager"><span class="muted">Mostrando ${UI.atPage * UI.atPer + 1} a ${Math.min(list.length, (UI.atPage + 1) * UI.atPer)} de ${list.length} atletas</span><span class="pgs"><button class="btn sm" data-act="at-pg" data-p="${UI.atPage - 1}" ${UI.atPage ? '' : 'disabled'} aria-label="Página anterior">‹</button>${Array.from({ length: pages }, (_, i) => `<button class="btn sm ${i === UI.atPage ? 'pri' : ''}" data-act="at-pg" data-p="${i}">${i + 1}</button>`).join('')}<button class="btn sm" data-act="at-pg" data-p="${UI.atPage + 1}" ${UI.atPage < pages - 1 ? '' : 'disabled'} aria-label="Próxima página">›</button></span><label class="muted" style="display:flex;align-items:center;gap:6px">Itens por página <select id="atPer" class="search" style="min-width:0;padding:5px 8px">${[12, 24, 48].map(n => `<option ${n === UI.atPer ? 'selected' : ''}>${n}</option>`).join('')}</select></label></div>` : S.atletas.length ? `<div class="empty"><h3>Nenhum atleta encontrado</h3>Ajuste a busca, a posição ou a categoria.</div>` : ''}`;
};

/* ---------- ficha individual ---------- */
function fichaDados(a) {
  const ms = minStats(a.id), sf = statusFisico(a), avs = avsDe(a.id), lastAv = avs.slice(-1)[0], cAv = lastAv ? calcAv(lastAv) : null;
  const ls = S.lesoes.filter(l => l.atletaId === a.id).sort((x, y) => y.data.localeCompare(x.data));
  const lesA = ls.filter(l => noPeriodo(l.data)).length;
  return { ms, sf, avs, lastAv, cAv, ls, lesA };
}
function fichaTopo(a, D) {
  const { ms, sf, cAv, ls, lesA } = D;
  const box = (k, v) => `<div class="fk"><small>${k}</small><b>${v}</b></div>`;
  return `<div class="ftop">
    <div class="fphoto">${a.foto ? `<img src="${esc(a.foto)}" alt="Foto de ${esc(a.nome)}">` : `<span class="sil">${IC.shirt}</span>`}<img class="fcrest" src="${LOGO}" alt=""></div>
    <div class="fmain">
      <div class="fname"><span class="ainit">${esc(initials(a.apelido || a.nome))}</span><div><h3>${esc(a.nome)}${a.numero ? ` <span>#${esc(a.numero)}</span>` : ''}</h3><p>${esc(a.subcategoria || a.categoria)} · ${esc(a.posDetalhe || POSN[a.posicao] || '')} · Temporada ${anoLabel() === 'TODAS' ? 'todas' : anoLabel()} · Pé ${esc((a.pe || '—').toLowerCase())}</p>
        <div class="fchips"><span class="fc ok">● Ativo</span><span class="fc ${sf.apto[1]}">${sf.apto[0] === 'Sim' ? '✓ Elegível' : sf.apto[0] === 'Parcial' ? '◐ Retorno gradual' : '✕ No DM'}</span>${ptag(a.posicao)}${subTag(a)}</div></div></div>
      <div class="fkgrid">
        ${box('Idade', (idade(a.nascimento) || '—') + ' anos')}${box('Peso', (cAv ? nf(cAv.peso, 1) : a.peso ? nf(a.peso, 1) : '—') + ' kg')}${box('Altura', (cAv?.altura ? nf(cAv.altura, 2) : a.altura ? nf(a.altura, 2) : '—') + ' m')}${box('Jogos', ms.jogos)}${box('Minutos', ms.min + "'")}
        ${box('Gols', ms.gols)}${box('Assistências', ms.ast)}${box('Lesões', ls.length)}${box('DM (temporada)', lesA)}
        <div class="fk fdisp"><div><small>Dispon. física</small><b>${sf.disp.pct}%</b></div>${ring(sf.disp.pct, 46)}</div>
      </div>
    </div>
  </div>`;
}
function fichaGeral(a, D) {
  const { ms, sf, avs, ls } = D;
  const meses = {}; ms.lista.forEach(x => { const k = String(x.j.data).slice(0, 7); meses[k] = (meses[k] || 0) + x.m; });
  const mk = Object.keys(meses).sort().slice(-8);
  const evo = mk.length ? vbars(mk.map(k => MESES[+k.slice(5, 7) - 1]), mk.map(k => meses[k]), { w: 520, h: 210, min: 30 }) : miniEmpty('Sem jogos na temporada', 'Os minutos vêm do módulo de Minutagem.');
  const part = ms.gols + ms.ast;
  const gp = part ? `<div class="donut-wrap">${donut([{ l: 'Gols', v: ms.gols, c: '#1b8a4a' }, { l: 'Assistências', v: ms.ast, c: '#7bd08f' }], part, 'PARTICIPAÇÕES', 140)}${legend([{ l: 'Gols', v: ms.gols, c: '#1b8a4a' }, { l: 'Assistências', v: ms.ast, c: '#7bd08f' }])}</div>` : miniEmpty('Sem participações em gol', 'na temporada selecionada.');
  const stx = (t, v, c) => `<div class="sfrow"><span>${IC.check} ${t}</span><em class="sfc ${c}">${v}</em></div>`;
  const sfis = `<div style="text-align:center">${gauge(sf.disp.pct)}<div class="muted" style="font-size:12.5px;margin:-4px 0 10px">Disponibilidade na temporada${sf.disp.dias ? ` · ${sf.disp.dias} dias no DM` : ''}</div></div>${stx('Carga de treino', sf.carga, sf.cc)}${stx('Risco de lesão', sf.risco, sf.rc)}${stx('Apto para jogar', sf.apto[0], sf.apto[1])}${sf.bem ? stx('Bem-estar (último)', sf.bem.txt, sf.bem.s) : ''}${sf.at ? `<div class="sfrow"><span>${IC.med} Situação no DM</span>${chip(sf.at.status)}</div>` : ''}`;
  const lesR = ls.slice(0, 4).map(l => `<div class="lrow">${lesThumb(l, 'sm')}<span class="ld">${fmtD(l.data)}</span><span class="ln"><b>${esc(l.tipo)}</b><small>${esc(regLong(l))}</small></span><span class="ldd">${diasFora(l)} dias</span>${l.status === 'liberado' ? '<span class="st st-ok">Resolvida</span>' : chip(l.status)}</div>`).join('') || miniEmpty('Sem lesões registradas');
  const jg = ms.lista.slice(0, 5).map(x => `<tr><td>${fmtDs(x.j.data)}</td><td class="l">${esc(x.j.adversario || '—')}</td><td>${x.j.golsPro ?? '–'} x ${x.j.golsContra ?? '–'}</td><td><b>${x.m}'</b></td><td>${'⚽'.repeat(Math.min(3, +x.r.gols || 0))}${+x.r.assist ? ' 🅰' + (x.r.assist > 1 ? '×' + x.r.assist : '') : ''}</td></tr>`).join('');
  const av = [...avs].reverse().slice(0, 5).map((v, i, arr) => { const c = calcAv(v), p = arr[i + 1] ? calcAv(arr[i + 1]) : null; return `<tr><td>${fmtD(v.data)}</td><td>${nf(c.peso, 1)} kg</td><td><b>${nfx(c.g, 1, '%')}</b></td><td>${p && p.g != null && c.g != null ? deltaTag(c.g - p.g, -1, 1) : '—'}</td><td>${nfx(c.mm, 1, ' kg')}</td></tr>`; }).join('');
  return `<div class="row r3" style="margin-bottom:14px">
    ${panel(`Evolução de minutagem <span class="r">Total: ${ms.min} min</span>`, evo)}
    ${panel('Participações em gol', gp)}
    ${panel('Status físico', sfis)}
  </div>
  <div class="row r3" style="margin:0">
    ${panel('Histórico recente de lesões', `<div class="lrows">${lesR}</div>`, { r: `<button data-act="ftab" data-t="lesoes">Ver tudo</button>` })}
    ${panel('Últimos jogos', jg ? `<table class="t"><thead><tr><th>Data</th><th class="l">Adversário</th><th>Placar</th><th>Min</th><th></th></tr></thead><tbody>${jg}</tbody></table>` : miniEmpty('Sem jogos'), { np: !!jg, r: `<button data-act="ftab" data-t="jogos">Ver todos</button>` })}
    ${panel('Avaliações recentes', av ? `<table class="t"><thead><tr><th>Data</th><th>Peso</th><th>% G</th><th>Δ</th><th>M. magra</th></tr></thead><tbody>${av}</tbody></table>` : miniEmpty('Sem avaliações corporais'), { np: !!av, r: `<button data-act="ftab" data-t="aval">Ver todas</button>` })}
  </div>`;
}
function fichaMin(a, D) {
  const { ms } = D; const porComp = {};
  ms.lista.forEach(x => { const k = x.j.competicao || '—'; const o = porComp[k] = porComp[k] || { rel: 0, jogos: 0, tit: 0, min: 0, pos: 0, gols: 0, ast: 0 }; o.rel++; if (x.m) o.jogos++; if (x.r.status === 'T') o.tit++; o.min += x.m; o.pos += x.dur; o.gols += +x.r.gols || 0; o.ast += +x.r.assist || 0; });
  const rows = Object.entries(porComp);
  const kp = [['Relacionado', ms.rel], ['Jogou', ms.jogos], ['Titular', ms.tit], ['Reserva', ms.res], ['Minutos', ms.min + "'"], ['% dos minutos', pct(ms.min, ms.possivel)], ['Média por jogo', ms.jogos ? Math.round(ms.min / ms.jogos) + "'" : '—'], ['Cartões', `${ms.ca} 🟨 ${ms.cv} 🟥`]];
  return `<div class="fkgrid k8" style="margin-bottom:14px">${kp.map(([k, v]) => `<div class="fk"><small>${k}</small><b>${v}</b></div>`).join('')}</div>
  ${panel('Por competição', rows.length ? `<table class="t"><thead><tr><th class="l">Competição</th><th>Relac.</th><th>Jogos</th><th>Titular</th><th>Minutos</th><th>% minutos</th><th>Gols</th><th>Assist.</th></tr></thead><tbody>${rows.map(([k, o]) => `<tr><td class="l"><b>${esc(k)}</b></td><td>${o.rel}</td><td>${o.jogos}</td><td>${o.tit}</td><td><b>${o.min}</b></td><td>${pct(o.min, o.pos)}</td><td>${o.gols}</td><td>${o.ast}</td></tr>`).join('')}</tbody></table>` : miniEmpty('Sem jogos na temporada', 'Cadastre jogos e minutagem no módulo de Minutagem.'), { np: !!rows.length })}`;
}
function fichaJogos(a, D) {
  const { ms } = D;
  return panel(`Histórico de jogos <span class="r">${ms.lista.length} jogo(s)</span>`, ms.lista.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th>Data</th><th>Competição</th><th class="l">Adversário</th><th>Mando</th><th>Placar</th><th>Situação</th><th>Minutos</th><th>Gols</th><th>Assist.</th><th>Cartões</th></tr></thead><tbody>${ms.lista.map(x => `<tr><td>${fmtD(x.j.data)}</td><td>${esc(x.j.competicao || '')}</td><td class="l">${esc(x.j.adversario || '—')}</td><td>${x.j.mando === 'fora' ? 'Fora' : 'Casa'}</td><td><b>${x.j.golsPro ?? '–'} x ${x.j.golsContra ?? '–'}</b></td><td>${x.r.status === 'T' ? '<span class="st st-ok">Titular</span>' : x.m ? '<span class="st st-liberado">Entrou</span>' : '<span class="st" style="background:var(--card2)">Não entrou</span>'}</td><td><b>${x.m}'</b></td><td>${+x.r.gols || 0}</td><td>${+x.r.assist || 0}</td><td>${+x.r.ca ? '🟨' : ''}${+x.r.cv ? '🟥' : ''}</td></tr>`).join('')}</tbody></table></div>` : miniEmpty('Sem jogos na temporada'), { np: !!ms.lista.length });
}
function fichaLesoes(a, D) {
  const { ls } = D;
  return `<div class="row r12" style="margin:0">${panel('Regiões afetadas', bodyMap({ mode: 'hl', ls }))}${panel(`Todas as lesões <span class="r">${ls.length}</span>`, ls.length ? `<div class="lrows">${ls.map(l => `<div class="lrow">${lesThumb(l, 'sm')}<span class="ld">${fmtD(l.data)}</span><span class="ln"><b>${esc(lesNome(l))}</b><small>${esc(regLong(l))} · ${esc(l.local || '')} · ${esc(l.mecanismo || '')}</small></span><span class="ldd">${diasFora(l)} dias</span>${l.status === 'liberado' ? '<span class="st st-ok">Resolvida</span>' : chip(l.status)}</div>`).join('')}</div>` : miniEmpty('Sem lesões registradas'))}</div>`;
}
function fichaAval(a, D) {
  const { avs } = D; if (!avs.length) return miniEmpty('Sem avaliações corporais', 'Registre em Nutrição → Composição corporal.');
  const cs = avs.map(v => ({ v, c: calcAv(v) }));
  const ch = (k, n, min) => cs.length > 1 ? `<div><h5>${n}</h5>${lineChart(cs.map(x => fmtDs(x.v.data)), cs.map(x => x.c[k] != null ? Math.round(x.c[k] * 10) / 10 : 0), { w: 320, h: 160, min })}</div>` : '';
  return `${cs.length > 1 ? `<div class="minich four" style="margin-bottom:14px">${ch('peso', 'Peso (kg)', 40)}${ch('g', '% de gordura', 5)}${ch('mm', 'Massa magra (kg)', 30)}${ch('soma', 'Σ dobras (mm)', 10)}</div>` : ''}
  ${panel('Avaliações corporais', `<table class="t"><thead><tr><th>Data</th><th>Peso</th><th>Estatura</th><th>IMC</th><th>% gordura</th><th>Massa magra</th><th>Massa gorda</th><th>Σ dobras</th><th>Situação</th></tr></thead><tbody>${[...cs].reverse().map(x => `<tr><td>${fmtD(x.v.data)}</td><td>${nfx(x.c.peso, 1)}</td><td>${nfx(x.c.altura, 2)}</td><td>${nfx(x.c.imc, 1)}</td><td><b>${nfx(x.c.g, 1, '%')}</b></td><td>${nfx(x.c.mm, 1)}</td><td>${nfx(x.c.mg, 1)}</td><td>${nfx(x.c.soma, 1)}</td><td>${faixaChip(x.c.g)}</td></tr>`).join('')}</tbody></table>`, { np: true, r: `<button data-act="ind-from-comp" data-id="${a.id}">Comparar evolução</button>` })}`;
}
const FTABS = [['geral', 'Visão Geral'], ['min', 'Minutagem'], ['jogos', 'Histórico de Jogos'], ['lesoes', 'Lesões / DM'], ['aval', 'Avaliações corporais']];
function fichaHTML(a) {
  const D = fichaDados(a); const t = UI.fichaTab;
  const body = { geral: fichaGeral, min: fichaMin, jogos: fichaJogos, lesoes: fichaLesoes, aval: fichaAval }[t] || fichaGeral;
  return mh('Ficha individual do atleta') + `<div class="mb ficha">
    <div class="fbar"><span class="muted">Clique fora ou em × para fechar</span><span style="flex:1"></span><button class="btn sm" data-act="edit-atleta" data-id="${a.id}">${IC.edit} Editar</button><button class="btn sm" data-act="lesao-atleta" data-id="${a.id}">${IC.plus} Lesão</button><button class="btn sm" data-act="nova-av" data-id="${a.id}">${IC.plus} Avaliação</button><button class="btn sm pri" data-act="print-ficha" data-id="${a.id}">${IC.print} Imprimir ficha</button></div>
    ${fichaTopo(a, D)}
    <div class="ftabs">${FTABS.map(([k, n]) => `<button class="${t === k ? 'on' : ''}" data-act="ftab" data-t="${k}">${n}</button>`).join('')}</div>
    <div class="fbody">${body(a, D)}</div>
  </div>`;
}
function abrirFicha(id, tab) { const a = atl(id); if (!a) return; UI.fichaId = id; if (tab) UI.fichaTab = tab; openModal(fichaHTML(a), true); $('#modal').classList.add('fx'); }
function pFicha(a) {
  const D = fichaDados(a);
  const hdr = cont => header({ title: 'FICHA INDIVIDUAL' + (cont ? ' (CONT.)' : ''), sub: 'PERFORMANCE · DM · NUTRIÇÃO · MINUTAGEM', pill: (a.apelido || a.nome).toUpperCase(), items: [['user', 'Categoria', a.subcategoria || a.categoria], ['cal', 'Temporada', anoLabel()], ['clock', 'Emitido em', fmtD(todayISO())]] }) + '<div style="height:14px"></div>';
  return [
    pageWrap(hdr() + `<div class="panel" style="margin-bottom:14px"><div class="pb ficha">${fichaTopo(a, D)}</div></div><div class="grow">${fichaGeral(a, D)}</div>`),
    pageWrap(hdr(true) + `<div class="row r2" style="margin-bottom:14px">${panel('Minutagem por competição', fichaMin(a, D).replace(/^<div class="fkgrid k8"[^]*?<\/div>\s*/, ''))}${panel('Lesões', `<div class="lrows">${D.ls.slice(0, 6).map(l => `<div class="lrow">${lesThumb(l, 'sm')}<span class="ld">${fmtD(l.data)}</span><span class="ln"><b>${esc(lesNome(l))}</b><small>${esc(regLong(l))}</small></span><span class="ldd">${diasFora(l)} dias</span>${l.status === 'liberado' ? '<span class="st st-ok">Resolvida</span>' : chip(l.status)}</div>`).join('') || miniEmpty('Sem lesões')}</div>`)}</div><div class="grow">${fichaJogos(a, D)}</div>`)
  ];
}

/* ---------- ações ---------- */
document.addEventListener('click', e => {
  const k = e.target.closest('.kmenu button[data-act]'); if (k) { $$('.kmenu').forEach(m => m.remove()); }
  const t = e.target.closest('[data-act]');
  if (t) {
    const id = t.dataset.id;
    switch (t.dataset.act) {
      case 'atl-menu': {
        e.stopPropagation(); const open = t.parentElement.querySelector('.kmenu'); $$('.kmenu').forEach(m => m.remove()); if (open) return;
        const m = document.createElement('div'); m.className = 'kmenu'; m.innerHTML = `<button data-act="ficha" data-id="${id}">${IC.user} Ver ficha</button><button data-act="edit-atleta" data-id="${id}">${IC.edit} Editar cadastro</button><button data-act="lesao-atleta" data-id="${id}">${IC.med} Registrar lesão</button><button data-act="nova-av" data-id="${id}">${IC.apple} Nova avaliação</button><button data-act="hist" data-id="${id}">${IC.hist} Histórico no DM</button><button data-act="print-ficha" data-id="${id}">${IC.print} Imprimir ficha</button><button data-act="del-atleta" data-id="${id}" class="danger">${IC.trash} Excluir</button>`;
        t.parentElement.appendChild(m); return;
      }
      case 'ficha': abrirFicha(id, 'geral'); return;
      case 'ftab': UI.fichaTab = t.dataset.t; if (UI.fichaId && $('#modal .ficha')) { const s = $('#modal .mb').scrollTop; openModal(fichaHTML(atl(UI.fichaId)), true); $('#modal').classList.add('fx'); $('#modal .mb').scrollTop = s; } return;
      case 'print-ficha': printMenu('ficha', id); return;
      case 'at-pg': UI.atPage = Math.max(0, +t.dataset.p); render(); return;
    }
    return;
  }
  if (!e.target.closest('.kmenu')) $$('.kmenu').forEach(m => m.remove());
  const c = e.target.closest('[data-ficha]');
  if (c && !e.target.closest('input,button,label')) { if (UI.selMode) { const cb = c.querySelector('.acheck'); if (cb) { cb.checked = !cb.checked; cb.dispatchEvent(new Event('change', { bubbles: true })); } return; } abrirFicha(c.dataset.ficha, 'geral'); }
});
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.acard')) { e.preventDefault(); abrirFicha(e.target.dataset.ficha, 'geral'); } });
document.addEventListener('change', e => { if (e.target.id === 'atPer') { UI.atPer = +e.target.value; UI.atPage = 0; render(); } });
