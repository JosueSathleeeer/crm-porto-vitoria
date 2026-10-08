/* ================= CALENDÁRIO ================= */
IC.calM = I('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h2M12 14h2M16 14h2M8 18h2M12 18h2"/>');
TITLES.cal = ['Calendário', 'Mês'];
NAV.push({ k: 'cal', n: 'Calendário', ic: IC.calM });
UI.calMes = todayISO().slice(0, 7); UI.calDia = todayISO(); UI.calF = new Set(['treino', 'jogo', 'aval', 'folga', 'dm']);
const CALT = { treino: ['Treinos', '#1b8a4a'], jogo: ['Jogos', '#f2b81b'], aval: ['Avaliações', '#7a3fd1'], folga: ['Folgas', '#8a948f'], dm: ['Retornos do DM', '#2f6fd6'] };
function eventosDia(d) {
  const cats = F.categoria === 'Todas' ? Object.keys(GRUPOS) : [F.categoria], ev = [];
  cats.forEach(c => sessoesDia(c, d).forEach(s => ev.push({ k: s.tipo === 'jogo' ? 'jogo' : s.tipo === 'folga' ? 'folga' : s.tipo === 'aval' ? 'aval' : 'treino', t: s.tipo === 'jogo' ? `Jogo${s.adversario ? ' x ' + s.adversario : ''}` : s.tipo === 'folga' ? 'Folga' : (s.titulo || SESS[s.tipo]?.[0] || 'Treino'), h: s.hora || '', c, s, info: [s.duracao ? s.duracao + ' min' : '', s.pse != null ? 'PSE ' + s.pse : '', s.mando ? (s.mando === 'fora' ? 'fora' : 'casa') : ''].filter(Boolean).join(' · ') })));
  (window.MIN?.S.jogos || []).filter(j => j.data === d && cats.includes(j.categoria)).forEach(j => { if (ev.some(e => e.k === 'jogo' && e.c === j.categoria)) return; ev.push({ k: 'jogo', t: `Jogo x ${j.adversario || ''}`, h: j.hora || '', c: j.categoria, j, info: [j.competicao, j.golsPro != null && j.golsPro !== '' ? `${j.golsPro} x ${j.golsContra}` : ''].filter(Boolean).join(' · ') }); });
  const tsc = new Set((S.testes || []).filter(t => t.data === d && cats.includes(atl(t.atletaId)?.categoria)).map(t => atl(t.atletaId).categoria)); tsc.forEach(c => ev.push({ k: 'aval', t: 'Sessão de testes', c, info: 'realizada', nav: 'av-reg' }));
  (S.config.agenda || []).filter(x => x.data === d && cats.includes(x.categoria)).forEach(x => ev.push({ k: 'aval', t: x.teste, c: x.categoria, info: 'agendado', nav: 'av-dash' }));
  if ([...new Set((S.maturacao || []).filter(m => m.data === d).map(m => atl(m.atletaId)?.categoria))].some(c => cats.includes(c))) ev.push({ k: 'aval', t: 'Medição de maturação', c: '', nav: 'mat-dash' });
  lesAtivas().filter(l => l.previsao === d && cats.includes(atl(l.atletaId)?.categoria)).forEach(l => ev.push({ k: 'dm', t: 'Retorno previsto: ' + (atl(l.atletaId)?.apelido || atl(l.atletaId)?.nome || ''), c: atl(l.atletaId)?.categoria, info: lesNome(l), nav: 'dm-lesionados' }));
  return ev.filter(e => UI.calF.has(e.k)).sort((a, b) => String(a.h).localeCompare(String(b.h)));
}
function vCal() {
  const [y, m] = UI.calMes.split('-').map(Number), ini = `${y}-${pad(m)}-01`, g0 = segunda(ini), dias = Array.from({ length: 42 }, (_, i) => addDays(g0, i));
  const nomeMes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][m - 1];
  const mesAnt = m === 1 ? `${y - 1}-12` : `${y}-${pad(m - 1)}`, mesProx = m === 12 ? `${y + 1}-01` : `${y}-${pad(m + 1)}`;
  const doMes = dias.filter(d => d.slice(0, 7) === UI.calMes), E = Object.fromEntries(dias.map(d => [d, eventosDia(d)]));
  const cnt = k => doMes.reduce((s, d) => s + E[d].filter(e => e.k === k).length, 0);
  const cats = F.categoria === 'Todas' ? Object.keys(GRUPOS) : [F.categoria];
  const meso = d => (S.macro || []).filter(b => cats.includes(b.categoria) && b.inicio <= d && b.fim >= d).sort((a, b) => (a.tipo === 'meso' ? 0 : 1) - (b.tipo === 'meso' ? 0 : 1))[0];
  const ev = E[UI.calDia] || eventosDia(UI.calDia);
  return header({ title: 'CALENDÁRIO', sub: 'TREINOS · JOGOS · AVALIAÇÕES', items: hdrItems(), solo: true }) + `
  <div class="kpis k5">${Object.entries(CALT).map(([k, [n, c]]) => `<div class="kpi calk ${UI.calF.has(k) ? '' : 'off'}" data-act="cal-f" data-k="${k}" role="button" tabindex="0" style="--cc:${c}"><i></i><div><div class="k">${n}</div><div class="v">${cnt(k)}</div><div class="s">em ${nomeMes.toLowerCase()} · clique para ${UI.calF.has(k) ? 'ocultar' : 'mostrar'}</div></div></div>`).join('')}</div>
  <div class="row r31b" style="align-items:start">
    <div class="panel"><div class="ph calph"><button class="btn sm" data-act="cal-m" data-v="${mesAnt}" aria-label="Mês anterior">‹</button><b>${nomeMes} ${y}</b><button class="btn sm" data-act="cal-m" data-v="${mesProx}" aria-label="Próximo mês">›</button><button class="btn sm" data-act="cal-m" data-v="${todayISO().slice(0, 7)}">Hoje</button><span class="r">${esc(catLabel())}</span></div>
      <div class="calg">${SEMANA.map(s => `<div class="calh">${s}</div>`).join('')}${dias.map(d => { const out = d.slice(0, 7) !== UI.calMes, l = E[d], mz = meso(d), md = F.categoria !== 'Todas' ? mdLabel(d, F.categoria) : '';
        return `<div class="cald ${out ? 'out' : ''} ${d === todayISO() ? 'hoje' : ''} ${d === UI.calDia ? 'sel' : ''}" data-act="cal-d" data-d="${d}">${mz ? `<span class="calz" style="background:${mz.cor}" title="${esc(mz.nome)}"></span>` : ''}<div class="caln"><b>${+d.slice(8)}</b>${md ? `<em class="${md === 'MD' ? 'g' : ''}">${md}</em>` : ''}</div>${l.slice(0, 4).map(e => `<div class="cale k-${e.k}" style="--cc:${CALT[e.k][1]}" data-tip="${esc(e.t)}${e.c ? ' · ' + esc(e.c) : ''}${e.h ? ' · ' + esc(e.h) : ''}${e.info ? '\n' + esc(e.info) : ''}">${e.h ? `<small>${esc(e.h)}</small>` : ''}${esc(e.t)}</div>`).join('')}${l.length > 4 ? `<div class="calmore">+${l.length - 4}</div>` : ''}</div>`; }).join('')}</div>
      <div class="pb legend-status" style="justify-content:center">${Object.entries(CALT).map(([k, [n, c]]) => `<span><span class="sq" style="background:${c}"></span>${n}</span>`).join('')}<span class="muted">Barrinha colorida no topo do dia = mesociclo do macrociclo</span></div></div>
    <div class="panel"><div class="ph">${diaSemana(UI.calDia)}, ${fmtD(UI.calDia)}${F.categoria !== 'Todas' && mdLabel(UI.calDia, F.categoria) ? ` · ${mdLabel(UI.calDia, F.categoria)}` : ''}</div><div class="pb">
      ${ev.length ? ev.map(e => `<div class="calev" style="--cc:${CALT[e.k][1]}" ${e.s ? `data-act="cal-edit" data-id="${e.s.id}"` : e.nav ? `data-nav="${e.nav}"` : ''}><i></i><div><small>${CALT[e.k][0].replace(/s$/, '')}${e.c ? ' · ' + esc(e.c) : ''}${e.h ? ' · ' + esc(e.h) : ''}</small><b>${esc(e.t)}</b>${e.info ? `<span>${esc(e.info)}</span>` : ''}</div></div>`).join('') : miniEmpty('Nada neste dia', 'Use os botões abaixo para planejar.')}
      <div class="calbtns"><button class="btn sm pri" data-act="cal-add" data-tipo="treino">${IC.plus} Sessão de treino</button><button class="btn sm" data-act="cal-add" data-tipo="jogo">${IC.ball} Jogo</button><button class="btn sm" data-act="cal-add" data-tipo="folga">Folga</button><button class="btn sm" data-act="cal-ag">${IC.stopw} Agendar teste</button><button class="btn sm" data-act="cal-week">${IC.layers} Abrir microciclo</button></div>
      ${F.categoria === 'Todas' ? '<p class="muted" style="font-size:12px;margin:8px 0 0">Escolha uma categoria no topo para adicionar sessões e ver os rótulos MD.</p>' : ''}
    </div></div>
  </div>`;
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  switch (t.dataset.act) {
    case 'cal-m': UI.calMes = t.dataset.v; if (UI.calDia.slice(0, 7) !== UI.calMes) UI.calDia = UI.calMes + '-01'; render(); break;
    case 'cal-d': UI.calDia = t.dataset.d; if (t.dataset.d.slice(0, 7) !== UI.calMes) UI.calMes = t.dataset.d.slice(0, 7); render(); break;
    case 'cal-f': { const k = t.dataset.k; UI.calF.has(k) ? UI.calF.delete(k) : UI.calF.add(k); render(); break; }
    case 'cal-edit': { const s = (S.micro || []).find(x => x.id === t.dataset.id); if (s) { UI.plCat = s.categoria; formSessao(s); } break; }
    case 'cal-add': { if (F.categoria === 'Todas') { toast('Escolha uma categoria no filtro do topo.', true); break; } UI.plCat = F.categoria; const tp = t.dataset.tipo; if (tp === 'folga') save('micro', { id: uid('ms'), categoria: F.categoria, data: UI.calDia, tipo: 'folga', titulo: 'Folga', duracao: 0, pse: null }); else formSessao({}, UI.calDia, tp === 'jogo'); break; }
    case 'cal-ag': formAgenda(); setTimeout(() => { const i = $('#agD'); if (i) i.value = UI.calDia; const c = $('#agC'); if (c && F.categoria !== 'Todas') c.value = F.categoria; }, 30); break;
    case 'cal-week': UI.week = segunda(UI.calDia); if (F.categoria !== 'Todas') UI.plCat = F.categoria; go('pl-micro'); break;
  }
});
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.calk')) { e.preventDefault(); e.target.click(); } });
