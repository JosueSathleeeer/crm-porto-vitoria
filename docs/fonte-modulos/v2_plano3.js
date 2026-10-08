/* ================= PLANO DE TREINO (LAYOUT NOVO) + TEMAS DE COR ================= */
const TEMAS = [['verde', 'Verde Porto'], ['branco', 'Branco e verde'], ['claro', 'Verde claro']];
const temaPl = () => S.config.planTema || 'verde';
const temaSel = () => `<label class="temasel"><span>Tema</span>${TEMAS.map(([k, n]) => `<button type="button" class="tsw t-${k} ${temaPl() === k ? 'on' : ''}" data-act="tema" data-v="${k}" title="${n}" aria-label="Tema ${n}"><i></i></button>`).join('')}</label>`;
const BCOR = { academia: '#7a3fd1', campo: '#1b8a4a' };
const cargaPlano = p => blocosDe(p).reduce((s, b) => s + ((b.pse !== '' && b.pse != null ? +b.pse : (p.pse ?? 0)) || 0) * (+b.duracao || 0), 0);
planoHTML = function (p) {
  const bl = blocosDe(p), mat = (p.material || []).filter(m => m.item), tot = durEf(p) || 1, md = mdLabel(p.data, p.categoria), ua = cargaPlano(p);
  const chip = (k, v) => v ? `<div class="pc2"><small>${k}</small><b>${v}</b></div>` : '';
  const sec = (t, v) => v ? `<div class="p2s"><h6>${t}</h6><p>${esc(v).replace(/\n/g, '<br>')}</p></div>` : '';
  return `<div class="pf2 t-${temaPl()}">
    <div class="p2h"><img src="${LOGO}" alt=""><div class="p2ht"><small>Porto Vitória · Departamento de Futebol de Base</small><h3>Plano de treino${p.titulo ? ' · ' + esc(p.titulo) : ''}</h3><span>${esc(p.categoria || '')}${p.microciclo ? ' · ' + esc(p.microciclo) : ''}</span></div><div class="p2d"><b>${fmtD(p.data).slice(0, 5)}</b><span>${diaSemana(p.data)}</span>${p.horario ? `<em>${esc(p.horario)}</em>` : ''}${md ? `<i>${md}</i>` : ''}</div></div>
    <div class="p2c">${chip('Local', esc(p.local || ''))}${chip('Duração efetiva', tot + ' min')}${chip('Atividades', bl.length)}${ua ? chip('Carga planejada', ua + ' UA') : ''}${chip('Responsável', esc(p.responsavel || ''))}</div>
    ${bl.length ? `<div class="p2tl">${bl.map((b, i) => `<span style="flex:${Math.max(1, +b.duracao || 1)};background:${BCOR[b.tipo] || '#1b8a4a'}" title="${esc(b.nome || '')}: ${b.duracao || 0} min"><b>${i + 1}</b> ${esc(b.nome || (b.tipo === 'academia' ? 'Academia' : 'Atividade'))} · ${b.duracao || 0}'</span>`).join('')}</div>` : ''}
    ${bl.map((b, i) => { const ac = b.tipo === 'academia'; const ex = (b.exercicios || []).filter(x => x.nome);
      return `<div class="p2b"><div class="p2bh" style="--bc:${BCOR[b.tipo] || '#1b8a4a'}"><span class="p2n">${i + 1}</span><div><b>${esc(b.nome || (ac ? 'Academia' : 'Atividade ' + (i + 1)))}</b><small>${ac ? 'Academia' : 'Atividade de campo'}</small></div>${b.metodo ? `<span class="p2met"><small>Método</small>${esc(b.metodo)}</span>` : ''}<div class="p2m">${b.duracao ? `<span>${IC.clock}${b.duracao} min</span>` : ''}${b.campo ? `<span>${ac ? IC.dumb : IC.ruler}${esc(b.campo)}</span>` : ''}${b.series ? `<span>${IC.cycle}${esc(b.series)}</span>` : ''}${b.pse !== '' && b.pse != null ? `<span>${IC.gauge}PSE ${esc(b.pse)}</span>` : ''}${b.grupo ? `<span>${IC.users}${esc(b.grupo)}</span>` : ''}</div></div>
        <div class="p2bg ${ac ? 'ac' : ''}"><div class="p2l">${b.objetivo ? `<div class="p2obj">${IC.check}<span>${esc(b.objetivo)}</span></div>` : ''}${sec(ac ? 'Desenvolvimento' : 'Organização', b.desenvolvimento)}${sec('Regras', b.regras)}${sec('Pontos de atenção', b.coaching)}${sec('Variações / progressões', b.variacoes)}${!b.objetivo && !b.desenvolvimento && !b.regras && !b.coaching && !b.variacoes ? '<p class="muted" style="margin:6px 0">Sem descrição.</p>' : ''}</div>
        <div class="p2r">${ac ? `<table class="p2ex"><thead><tr><th>#</th><th class="l">Exercício</th><th>Séries / reps</th><th>Cadência</th><th>Descanso</th><th>Carga</th></tr></thead><tbody>${ex.map((x, k) => `<tr><td>${k + 1}</td><td class="l">${esc(x.nome)}</td><td>${esc(x.series || '—')}</td><td>${esc(x.cadencia || '—')}</td><td>${esc(x.descanso || '—')}</td><td>${esc(x.carga || 'Individual')}</td></tr>`).join('') || '<tr><td colspan="6">Sem exercícios</td></tr>'}</tbody></table>` : campoSVG(b.pad || { campo: 'inteiro', objs: [] })}</div></div></div>`; }).join('') || '<div class="mini-empty">Sem atividades. Edite o plano para adicionar academia e atividades de campo.</div>'}
    ${mat.length || p.obs ? `<div class="p2f">${mat.length ? `<div><h6>Material</h6><div class="p2mat">${mat.map(m => `<span>${m.qtd ? `<b>${esc(m.qtd)}</b> ` : ''}${esc(m.item)}</span>`).join('')}</div></div>` : ''}${p.obs ? `<div><h6>Observações</h6><p>${esc(p.obs).replace(/\n/g, '<br>')}</p></div>` : ''}</div>` : ''}
    <div class="p2foot"><span>PORTO VITÓRIA</span><span>Disciplina · Evolução · Alto rendimento</span></div>
  </div>`;
};
const _fPlano3 = fPlano;
fPlano = function () { const h = _fPlano3(); return h.replace('<div class="row r12"', `<div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><b style="font-family:var(--fc);font-size:16px;text-transform:uppercase">Aparência do plano e do microciclo</b>${temaSel()}<span class="muted" style="font-size:12.5px">O tema vale para a tela, a impressão e o PDF.</span></div></div><div class="row r12"`); };
// microciclo com tema
const _fMicro3 = fMicro;
fMicro = function () { return _fMicro3().replace('<div class="mcwrap">', `<div class="mctema">${temaSel()}</div><div class="mcwrap t-${temaPl()}">`); };
const _repMicro3 = repMicro;
repMicro = function () { return _repMicro3().map(h => h.replace('<div class="mcwrap">', `<div class="mcwrap t-${temaPl()}">`)); };
document.addEventListener('click', e => { const t = e.target.closest('[data-act="tema"]'); if (!t) return; S.config.planTema = t.dataset.v; putConfig(); render(); });
