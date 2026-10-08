/* ================= BEM-ESTAR DIÁRIO (modelo do Forms do Porto Vitória) ================= */
MON_TABS.length = 0;
MON_TABS.push(['mon-be', 'Bem-estar · Dashboard'], ['mon-be-hist', 'Bem-estar · Histórico'], ['mon-be-rel', 'Bem-estar · Relatório do dia'], ['mon-pse', 'Percepção de esforço (PSE)']);
MON_TABS.forEach(([k, n]) => TITLES[k] = ['Monitoramento', n]);
const BEF = {
  treinaHoje: ['Sim', 'Não'],
  dor: ['Normal', 'Dolorido', 'Muito dolorido'],
  fadiga: ['Muito descansado', 'Descansado', 'Normal', 'Mais cansado que o normal', 'Sempre cansado'],
  recuperacao: ['Totalmente recuperado', 'Recuperado', 'Normal', 'Pouca recuperação', 'Não recuperado'],
  sono: ['Muito bom', 'Bom', 'Normal', 'Dificuldade em adormecer', 'Sono agitado / ruim'],
  estresse: ['Muito relaxado', 'Relaxado', 'Normal', 'Moderado', 'Alto', 'Muito alto'],
  humor: ['Muito bem humorado', 'Geralmente com bom humor', 'Normal', 'Irritado / baixo', 'Muito irritado']
};
const nrmB = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const numB = v => { if (v == null || v === '') return null; const m = String(v).replace(',', '.').match(/-?\d+(?:\.\d+)?/); return m ? +m[0] : null; };
// mesma conversão do sistema de Bem-Estar (texto do Forms → nota 0–10, usada só para cor e status)
function beScore(text, type) {
  const t = nrmB(text); if (!t) return null;
  if (type === 'sono') { if (/muito bom|otimo|excelente/.test(t)) return 9; if (/^bom/.test(t)) return 8; if (/^normal/.test(t)) return 6; if (/dificuldade|agitado|ruim|insonia/.test(t)) return 4; }
  if (type === 'fad') { if (/muito descans/.test(t)) return 9; if (/^descansado/.test(t)) return 8; if (/^normal/.test(t)) return 7; if (/mais cansado/.test(t)) return 4; if (/sempre cansado/.test(t)) return 2; }
  if (type === 'rec') { if (/totalmente recuper/.test(t)) return 10; if (/^recuperado/.test(t)) return 8; if (/^normal/.test(t)) return 5; if (/pouca recuper/.test(t)) return 3; if (/nao recuper|nenhuma recuper/.test(t)) return 0; }
  if (type === 'est') { if (/relaxado|normal|muito baixo/.test(t)) return 8; if (/moderado|medio/.test(t)) return 6; if (/muito alto/.test(t)) return 1; if (/alto/.test(t)) return 3; }
  if (type === 'hum') { if (/muito bem|excelente/.test(t)) return 9; if (/bem humor|bom humor/.test(t)) return 8; if (/normal/.test(t)) return 6; if (/baixo|ruim|mal|irritad/.test(t)) return 3; }
  return numB(t);
}
const temDor = r => { const a = nrmB(r?.dor), sc = numB(r?.escalaDor); return a.includes('dolor') || a === 'sim' || (sc != null && sc > 0); };
function beSt(r) {
  if (!r) return { st: 'NÃO RESPONDEU', flags: [], sc: {} };
  const sc = { s: beScore(r.sono, 'sono'), fad: beScore(r.fadiga, 'fad'), rec: beScore(r.recuperacao, 'rec'), est: beScore(r.estresse, 'est'), hum: beScore(r.humor, 'hum'), u: numB(r.urina), dor: temDor(r) ? numB(r.escalaDor) : null };
  const f = [];
  if (temDor(r)) f.push('dor'); if (sc.s != null && sc.s <= 4) f.push('sono'); if (sc.rec != null && sc.rec <= 3) f.push('recuperação'); if (sc.est != null && sc.est <= 3) f.push('estresse'); if (sc.fad != null && sc.fad <= 4) f.push('fadiga'); if (sc.u != null && sc.u >= 6) f.push('hidratação');
  const st = (sc.dor != null && sc.dor >= 7) || f.length >= 2 ? 'INTERVENÇÃO' : (f.length === 1 || (sc.s != null && sc.s <= 6) || (sc.rec != null && sc.rec <= 5)) ? 'ATENÇÃO' : 'NORMAL';
  const vals = [sc.s, sc.fad, sc.rec, sc.est, sc.hum].filter(v => v != null);
  return { st, flags: f, sc, media: vals.length ? mean(vals) : null };
}
const FLAGN = { dor: 'Dor/desconforto', sono: 'Sono ruim', recuperação: 'Recuperação baixa', estresse: 'Estresse elevado', fadiga: 'Fadiga elevada', hidratação: 'Hidratação inadequada' };
const STC = { NORMAL: ['s-nor', '#15933d'], 'ATENÇÃO': ['s-ate', '#f0b30c'], 'INTERVENÇÃO': ['s-int', '#e62925'], 'NÃO RESPONDEU': ['s-nr', '#aab5af'] };
const stChipB = st => `<span class="bst ${STC[st][0]}">${st}</span>`;
const clsB = (txt, type) => { const v = String(txt ?? '').trim(); if (!v) return '<span class="muted">—</span>'; const n = beScore(v, type); return `<span class="bcls ${n == null ? 'mid' : n >= 7 ? 'good' : n >= 4 ? 'mid' : 'bad'}">${esc(v)}</span>`; };
const hidB = u => { const n = numB(u); if (n == null) return '<span class="muted">—</span>'; const c = n <= 3 ? ['boa', 'Boa'] : n <= 5 ? ['ate', 'Atenção'] : ['ina', 'Inadequada']; return `<span class="bhid ${c[0]}">💧 ${c[1]}</span>`; };
const URINAB = ['#fffef1', '#fffbd3', '#fff2a2', '#f5d76e', '#e6b94f', '#c98c2c', '#a9661f', '#75421d'];
const uriB = u => { const n = numB(u); if (n == null) return '<span class="muted">—</span>'; const c = Math.max(1, Math.min(8, Math.round(n))); return `<span class="buri"><i style="background:${URINAB[c - 1]}"></i><b>${c}</b></span>`; };
const dorB = r => { const n = temDor(r) ? numB(r.escalaDor) : null; if (n == null) return temDor(r) ? `<span class="bcls mid">${esc(r.dor || 'Sim')}</span>${r.localDor ? `<small class="bloc">${esc(r.localDor)}</small>` : ''}` : '<span class="bpain p0">0</span>'; const c = n <= 2 ? 'p0' : n <= 5 ? 'p1' : n <= 7 ? 'p2' : 'p3'; return `<span class="bpain ${c}">${n}</span>${r.localDor ? `<small class="bloc">${esc(r.localDor)}</small>` : ''}`; };
const obsB = (r, s) => { if (!r) return '<span class="muted">Aguardando resposta</span>'; if (r.observacao) return esc(r.observacao); const p = s.flags.map(x => FLAGN[x]); if (r.localDor && temDor(r)) p.push('Local: ' + esc(r.localDor)); if (nrmB(r.treinaHoje) === 'nao') p.push('Não vai treinar/jogar' + (r.motivo ? ': ' + esc(r.motivo) : '')); return p.join(' • ') || 'Condições gerais adequadas.'; };
const recNum = r => { const n = beScore(r?.recuperacao, 'rec'); return n == null ? '<span class="muted">—</span>' : `<span class="bnum ${n >= 7 ? 'good' : n >= 4 ? 'mid' : 'bad'}">${n}</span>`; };
UI.beFiltro = { atleta: '', treina: '', busca: '' };

function beDia(d) {
  const ats = atletasCat().sort((a, b) => POS.indexOf(a.posicao) - POS.indexOf(b.posicao) || a.nome.localeCompare(b.nome));
  const map = new Map((S.bemestar || []).filter(r => r.data === d && r.sono !== undefined).map(r => [r.atletaId, r]));
  return ats.map(a => ({ a, r: map.get(a.id) || null, s: beSt(map.get(a.id) || null) }));
}
function beFiltrar(rows) { const f = UI.beFiltro; return rows.filter(x => (!f.atleta || x.a.id === f.atleta) && (!f.treina || (x.r && nrmB(x.r.treinaHoje) === nrmB(f.treina))) && (!f.busca || nrmB(x.a.nome).includes(nrmB(f.busca)))); }
function beTabela(rows, ini = 0) {
  return `<table class="t btab"><thead><tr><th>#</th><th class="l">Atleta</th><th>Posição</th><th>Sono</th><th>Hidratação</th><th>Dor /<br>desconforto</th><th>Fadiga</th><th>Estresse</th><th>Recuperação<br><small>(0–10)</small></th><th>Humor</th><th>Cor da<br>urina</th><th>Status</th><th class="l">Observação</th></tr></thead><tbody>${rows.map((x, i) => `<tr class="${x.r ? '' : 'nr'}"><td>${ini + i + 1}</td><td class="l"><div class="athcell">${fotoBox(x.a, 'mini')}<div><b>${esc(x.a.apelido || x.a.nome)}</b><small>${x.a.numero ? '#' + esc(x.a.numero) : ''}</small></div></div></td><td><b>${esc(x.a.posicao)}</b></td>${x.r ? `<td>${clsB(x.r.sono, 'sono')}</td><td>${hidB(x.r.urina)}</td><td>${dorB(x.r)}</td><td>${clsB(x.r.fadiga, 'fad')}</td><td>${clsB(x.r.estresse, 'est')}</td><td>${recNum(x.r)}</td><td>${clsB(x.r.humor, 'hum')}</td><td>${uriB(x.r.urina)}</td>` : '<td>—</td>'.repeat(8)}<td>${stChipB(x.s.st)}</td><td class="l bobs">${obsB(x.r, x.s)}</td></tr>`).join('') || '<tr><td colspan="13" class="muted">Nenhum atleta com esses filtros.</td></tr>'}</tbody></table>`;
}
function beAlertas(rows, compact) {
  const resp = rows.filter(x => x.r), lst = st => resp.filter(x => x.s.st === st);
  const it = x => `<div class="bai"><b>${esc(x.a.apelido || x.a.nome)}</b>${x.s.flags.map(f => `<span>– ${FLAGN[f]}</span>`).join('')}</div>`;
  const nr = rows.filter(x => !x.r), dor = resp.filter(x => temDor(x.r)), nt = resp.filter(x => nrmB(x.r.treinaHoje) === 'nao');
  const lim = compact ? 8 : 40, more = (l) => l.length > lim ? `<div class="bai muted">+ ${l.length - lim} atleta(s)</div>` : '';
  return `<div class="balert red"><h4>Intervenção (${lst('INTERVENÇÃO').length})</h4>${lst('INTERVENÇÃO').slice(0, lim).map(it).join('') || '<small>Nenhum atleta.</small>'}${more(lst('INTERVENÇÃO'))}</div>
  <div class="balert yel"><h4>Atenção (${lst('ATENÇÃO').length})</h4>${lst('ATENÇÃO').slice(0, lim).map(it).join('') || '<small>Nenhum atleta.</small>'}${more(lst('ATENÇÃO'))}</div>
  <div class="balert pain"><h4>Dor / desconforto (${dor.length})</h4>${dor.slice(0, lim).map(x => `<div class="bai"><b>${esc(x.a.apelido || x.a.nome)}</b><span>${esc(x.r.dor || 'Dor')}${x.r.escalaDor ? ' • intensidade ' + esc(x.r.escalaDor) : ''}</span><span>Local: ${esc(x.r.localDor || 'não informado')}</span></div>`).join('') || '<small>Ninguém informou dor.</small>'}</div>
  <div class="balert gray"><h4>Não vai treinar / jogar (${nt.length})</h4>${nt.map(x => `<div class="bai"><b>${esc(x.a.apelido || x.a.nome)}</b><span>${esc(x.r.motivo || 'Motivo não informado')}</span></div>`).join('') || '<small>Todos vão treinar/jogar.</small>'}</div>
  <div class="balert grn"><h4>Não responderam (${nr.length})</h4>${nr.length ? `<div class="bnr">${nr.slice(0, compact ? 24 : 80).map(x => `<span>${esc(x.a.apelido || x.a.nome)}</span>`).join('')}${nr.length > (compact ? 24 : 80) ? `<span>+${nr.length - (compact ? 24 : 80)}</span>` : ''}</div>` : '<small>Todos responderam.</small>'}</div>`;
}
function beMapa(rows) {
  if (!rows.length) return miniEmpty('Nenhum atleta cadastrado');
  const W = 1100, H = 280, L = 34, R = 20, T = 20, B = 28, iw = W - L - R, ih = H - T - B;
  const X = i => L + (rows.length === 1 ? iw / 2 : i / (rows.length - 1) * iw), Y = v => T + ih - v / 10 * ih;
  const grid = [0, 2, 4, 6, 8, 10].map(v => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${L - 8}" y="${Y(v) + 4}" text-anchor="end" font-size="11" fill="var(--ink2)">${v}</text>`).join('');
  const pts = rows.map((x, i) => ({ x, i, v: x.s.media }));
  const path = pts.filter(p => p.v != null).map((p, k) => `${k ? 'L' : 'M'}${X(p.i).toFixed(1)} ${Y(p.v).toFixed(1)}`).join(' ');
  const dots = pts.map(p => { const c = STC[p.x.s.st][1], r = p.x.r; const tip = `${p.x.a.nome} (${p.x.a.posicao}${p.x.a.numero ? ' #' + p.x.a.numero : ''})\n${p.x.s.st}${r ? `\nSono: ${r.sono || '—'}\nHidratação: urina ${r.urina || '—'}\nDor: ${temDor(r) ? (r.escalaDor || r.dor) + (r.localDor ? ' · ' + r.localDor : '') : 'não'}\nFadiga: ${r.fadiga || '—'}\nEstresse: ${r.estresse || '—'} · Recuperação: ${r.recuperacao || '—'}\nHumor: ${r.humor || '—'}${nrmB(r.treinaHoje) === 'nao' ? '\nNÃO VAI TREINAR: ' + (r.motivo || '') : ''}` : ''}`; return `<g class="ipt" data-tip="${esc(tip)}" data-ficha-open="${p.x.a.id}"><circle cx="${X(p.i)}" cy="${Y(p.v ?? 5)}" r="13" fill="transparent" stroke="${c}" opacity=".3"/><circle cx="${X(p.i)}" cy="${Y(p.v ?? 5)}" r="7" fill="${c}" stroke="var(--card)" stroke-width="3"/></g>`; }).join('');
  const names = rows.length <= 40 ? pts.map(p => `<text x="${X(p.i)}" y="${H - 8}" text-anchor="middle" font-size="9.5" fill="var(--ink2)">${esc((p.x.a.apelido || p.x.a.nome).split(' ')[0].slice(0, 9))}</text>`).join('') : '';
  return `<svg class="chart ich" viewBox="0 0 ${W} ${H}">${grid}<path d="${path}" fill="none" stroke="#2d8b63" stroke-width="2.5" opacity=".7"/>${dots}${names}</svg>`;
}
function beDatas() { return [...new Set((S.bemestar || []).filter(r => r.sono !== undefined).map(r => r.data))].sort().reverse(); }
function beDateBar(extra = '') {
  const ds = beDatas(); return `<div class="panel" style="margin-bottom:14px"><div class="pb bebar"><div><b>Data do monitoramento</b><small>${fmtD(UI.monDia)} · ${['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'][new Date(UI.monDia + 'T12:00').getDay()]}</small></div>${diaNav('be-dia', UI.monDia)}${ds.length ? `<select id="beDatas" class="search" style="min-width:0"><option value="">Dias com respostas…</option>${ds.slice(0, 60).map(d => `<option value="${d}" ${d === UI.monDia ? 'selected' : ''}>${fmtD(d)}</option>`).join('')}</select>` : ''}${extra}<span style="flex:1"></span><label class="btn" style="cursor:pointer">${IC.upload} Importar respostas do Forms<input type="file" id="beImport" accept=".xlsx,.xls,.csv" hidden></label><button class="btn pri" data-act="be-lancar">${IC.plus} Lançar manualmente</button></div></div>`;
}
fBe = function () {
  const all = beDia(UI.monDia), rows = beFiltrar(all), resp = all.filter(x => x.r);
  const c = st => all.filter(x => x.s.st === st).length;
  const f = UI.beFiltro;
  const seg = [{ l: 'Normal', v: c('NORMAL'), c: '#15933d' }, { l: 'Atenção', v: c('ATENÇÃO'), c: '#f0b30c' }, { l: 'Intervenção', v: c('INTERVENÇÃO'), c: '#e62925' }, { l: 'Não respondeu', v: c('NÃO RESPONDEU'), c: '#aab5af' }];
  return beDateBar() + `<div class="kpis k4">
    ${kpi('users', 'Atletas cadastrados', all.length, 'elenco oficial')}
    ${kpi('check', 'Responderam', resp.length, 'no dia selecionado')}
    ${kpi('cross', 'Falta responder', all.length - resp.length, 'atletas para cobrar hoje', 'red')}
    ${kpi('trend', 'Adesão do dia', pct(resp.length, all.length), 'respostas / elenco')}
  </div>
  <div class="bstatus"><div class="bsc nor"><i>✓</i><div><small>Atletas normais</small><b>${c('NORMAL')}</b><span>Condições adequadas</span></div></div><div class="bsc ate"><i>!</i><div><small>Atletas em atenção</small><b>${c('ATENÇÃO')}</b><span>Monitorar</span></div></div><div class="bsc int"><i>!</i><div><small>Atletas em intervenção</small><b>${c('INTERVENÇÃO')}</b><span>Avaliação individual</span></div></div><div class="bsc don">${iDonut(seg, resp.length, 'RESPONDERAM', 110)}</div></div>
  ${panel('Mapa de bem-estar do elenco', `<div class="legend-status" style="margin-bottom:6px"><span><span class="sq" style="background:#15933d"></span>Normal</span><span><span class="sq" style="background:#f0b30c"></span>Atenção</span><span><span class="sq" style="background:#e62925"></span>Intervenção</span><span><span class="sq" style="background:#aab5af"></span>Não respondeu</span><span class="muted">Passe o mouse sobre um ponto para ver as respostas · clique para abrir a ficha</span></div>${beMapa(all)}`)}
  <div style="height:14px"></div>
  <div class="row r31b" style="align-items:start">
    <div class="panel"><div class="ph">Status dos atletas · ${fmtD(UI.monDia)}<span class="r">${rows.length} atleta(s)</span></div>
      <div class="fbar"><div class="f"><label for="beFa">Atleta</label><select id="beFa"><option value="">Todos os atletas</option>${all.map(x => `<option value="${x.a.id}" ${f.atleta === x.a.id ? 'selected' : ''}>${esc(x.a.nome)}</option>`).join('')}</select></div><div class="f"><label for="beFt">Participação</label><select id="beFt"><option value="">Todos</option><option ${f.treina === 'Sim' ? 'selected' : ''}>Sim</option><option ${f.treina === 'Não' ? 'selected' : ''}>Não</option></select></div><div class="f"><label for="beFb">Pesquisar</label><input id="beFb" placeholder="Nome do atleta" value="${esc(f.busca)}"></div></div>
      <div class="tbl-wrap">${beTabela(rows)}</div></div>
    <aside class="panel"><div class="ph">Alertas do dia</div><div class="pb">${beAlertas(all, true)}</div></aside>
  </div>
  <div class="row r3" style="margin-top:14px">
    ${panel('Legenda de hidratação', `<div style="display:flex;gap:14px;flex-wrap:wrap"><span class="bhid boa">💧 Boa (urina 1–3)</span><span class="bhid ate">💧 Atenção (4–5)</span><span class="bhid ina">💧 Inadequada (6–8)</span></div><div class="uscale" style="margin-top:10px">${URINAB.map((c, i) => `<span style="background:${c}">${i + 1}</span>`).join('')}</div>`)}
    ${panel('Recomendações gerais para hoje', `<p class="brec">☑ Manter rotina de sono e hidratação.</p><p class="brec">☑ Atenção especial aos atletas em alerta.</p><p class="brec">☑ Monitoramento individual dos atletas em intervenção.</p><p class="brec">☑ Comunicação contínua entre comissão técnica, departamento médico e preparadores.</p>`)}
    ${panel('Notas do dia', `<textarea id="beNota" class="bnota" placeholder="Anotações da comissão sobre o dia">${esc((S.config.beNotas || {})[UI.monDia] || '')}</textarea><small class="muted">Salvo automaticamente ao sair do campo.</small>`)}
  </div>`;
};
function fBeHist() {
  const ats = atletasCat().sort((a, b) => a.nome.localeCompare(b.nome));
  if (!UI.beAtl || !atl(UI.beAtl)) UI.beAtl = ats.find(a => (S.bemestar || []).some(r => r.atletaId === a.id && r.sono !== undefined))?.id || ats[0]?.id;
  const a = atl(UI.beAtl); if (!a) return miniEmpty('Nenhum atleta cadastrado');
  const rs = (S.bemestar || []).filter(r => r.atletaId === a.id && r.sono !== undefined).sort((x, y) => x.data.localeCompare(y.data));
  const ss = rs.map(r => ({ r, s: beSt(r) }));
  const lab = ss.map(x => fmtDs(x.r.data));
  const ser = [['s', 'Sono', '#2f6fd6'], ['fad', 'Fadiga', '#f39324'], ['rec', 'Recuperação', '#1b8a4a'], ['est', 'Estresse', '#7a3fd1'], ['hum', 'Humor', '#159aa8']].map(([k, n, c]) => ({ n, c, vals: ss.map(x => x.s.sc[k]) }));
  const cnt = st => ss.filter(x => x.s.st === st).length;
  const mini = (n, v) => `<div class="fk"><small>${n}</small><b>${v == null ? '—' : nf(v, 1)}</b></div>`;
  const av = k => { const l = ss.map(x => x.s.sc[k]).filter(v => v != null); return l.length ? mean(l) : null; };
  return `<div class="panel" style="margin-bottom:14px"><div class="pb indbar" style="grid-template-columns:minmax(220px,1.3fr) minmax(220px,1fr) auto"><div class="det-head" style="margin:0">${ava(a)}<div><b>${esc(a.apelido || a.nome)}${subTag(a)}</b><span class="muted">${esc(POSN[a.posicao] || '')} · ${rs.length} resposta(s)</span></div></div><div class="f"><label for="beAtlSel">Atleta</label><select id="beAtlSel">${ats.map(x => `<option value="${x.id}" ${x.id === a.id ? 'selected' : ''}>${esc(x.nome)}</option>`).join('')}</select></div><button class="btn" data-act="ficha-tab" data-id="${a.id}" data-t="geral">${IC.user} Abrir ficha</button></div></div>
  <div class="fkgrid" style="grid-template-columns:repeat(8,1fr);margin-bottom:14px">${mini('Sono (média)', av('s'))}${mini('Fadiga', av('fad'))}${mini('Recuperação', av('rec'))}${mini('Estresse', av('est'))}${mini('Humor', av('hum'))}${mini('Dor (média)', av('dor'))}<div class="fk"><small>Dias normais</small><b style="color:#15933d">${cnt('NORMAL')}</b></div><div class="fk"><small>Atenção / interv.</small><b style="color:#e62925">${cnt('ATENÇÃO')} / ${cnt('INTERVENÇÃO')}</b></div></div>
  <div class="row r21">${panel('Evolução das respostas (nota 0–10)', ss.length > 1 ? iLine(lab, ser, { w: 900, h: 260, lo: 0, hi: 10 }) + `<div class="legend-status" style="justify-content:center">${ser.map(s => `<span><span class="sq" style="background:${s.c}"></span>${s.n}</span>`).join('')}</div>` : miniEmpty('Poucas respostas', 'A evolução aparece com duas ou mais respostas.'))}${panel('Cor da urina e dor', ss.length > 1 ? iLine(lab, [{ n: 'Cor da urina', c: '#c98c2c', vals: ss.map(x => x.s.sc.u) }, { n: 'Escala de dor', c: '#e62925', vals: ss.map(x => x.s.sc.dor ?? 0) }], { w: 520, h: 260, lo: 0, hi: 10 }) : miniEmpty('Sem dados'))}</div>
  <div class="row" style="grid-template-columns:1fr">${panel('Histórico de respostas', rs.length ? `<div class="tbl-wrap"><table class="t btab"><thead><tr><th>Data</th><th>Treina?</th><th>Sono</th><th>Hidratação</th><th>Dor</th><th>Fadiga</th><th>Estresse</th><th>Recuperação</th><th>Humor</th><th>Urina</th><th>Status</th><th class="l">Observação</th></tr></thead><tbody>${[...ss].reverse().map(x => `<tr><td>${fmtD(x.r.data)}</td><td>${esc(x.r.treinaHoje || '—')}</td><td>${clsB(x.r.sono, 'sono')}</td><td>${hidB(x.r.urina)}</td><td>${dorB(x.r)}</td><td>${clsB(x.r.fadiga, 'fad')}</td><td>${clsB(x.r.estresse, 'est')}</td><td>${recNum(x.r)}</td><td>${clsB(x.r.humor, 'hum')}</td><td>${uriB(x.r.urina)}</td><td>${stChipB(x.s.st)}</td><td class="l bobs">${obsB(x.r, x.s)}</td></tr>`).join('')}</tbody></table></div>` : miniEmpty('Sem histórico'), { np: !!rs.length })}</div>`;
}
UI.bePorPag = 20;
function beRelPaginas() {
  const all = beDia(UI.monDia), resp = all.filter(x => x.r), c = st => all.filter(x => x.s.st === st).length, n = UI.bePorPag, tot = Math.max(1, Math.ceil(all.length / n));
  const pages = [];
  for (let p = 0; p < tot; p++) {
    const fat = all.slice(p * n, p * n + n);
    pages.push(`<div class="brel">
      <div class="brel-head"><img src="${LOGO}" alt=""><div class="bt"><small>Porto Vitória • Saúde & Performance</small><h2>BEM-ESTAR DIÁRIO</h2><span>Relatório do dia · ${esc(catLabel())}</span></div><div class="bdc"><small>Data</small><b>${fmtD(UI.monDia)}</b><span>${['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][new Date(UI.monDia + 'T12:00').getDay()]}</span></div><div class="bdc"><small>Elenco</small><b>${all.length}</b><span>atletas</span></div><div class="bdc"><small>Responderam</small><b>${resp.length}</b><span>${pct(resp.length, all.length)}</span></div><div class="bpg">Página ${p + 1} de ${tot}</div></div>
      <div class="brel-sum"><div class="bsc nor"><i>✓</i><div><small>Normal</small><b>${c('NORMAL')}</b></div></div><div class="bsc ate"><i>!</i><div><small>Atenção</small><b>${c('ATENÇÃO')}</b></div></div><div class="bsc int"><i>!</i><div><small>Intervenção</small><b>${c('INTERVENÇÃO')}</b></div></div><div class="bsc nr"><i>?</i><div><small>Não responderam</small><b>${c('NÃO RESPONDEU')}</b></div></div><div class="brel-leg"><b>Como interpretar</b><span><i style="background:#15933d"></i>Normal: boas condições</span><span><i style="background:#f0b30c"></i>Atenção: monitorar</span><span><i style="background:#e62925"></i>Intervenção: avaliação individual</span></div></div>
      <div class="brel-body"><div class="brel-tab">${beTabela(fat, p * n)}</div><aside class="brel-side">${beAlertas(all, true)}${(S.config.beNotas || {})[UI.monDia] ? `<div class="balert gray"><h4>Notas</h4><small>${esc(S.config.beNotas[UI.monDia])}</small></div>` : ''}</aside></div>
      <div class="brel-foot"><span>PORTO VITÓRIA ESPORTE CLUBE</span><span>${resp.length} de ${all.length} responderam · atletas ${p * n + 1}–${Math.min(all.length, p * n + n)}</span><span>SAÚDE • PERFORMANCE • RESULTADOS</span></div>
    </div>`);
  }
  return pages;
}
function fBeRel() {
  const pages = beRelPaginas();
  return beDateBar(`<label class="muted" style="display:flex;align-items:center;gap:6px">Atletas por página <select id="bePorPag" class="search" style="min-width:0">${[10, 15, 20, 25, 30].map(n => `<option ${n === UI.bePorPag ? 'selected' : ''}>${n}</option>`).join('')}</select></label><button class="btn" data-act="be-print">${IC.print} Imprimir</button><button class="btn" data-act="be-pdf">${IC.pdf} Baixar PDF</button>`) + `<p class="muted" style="margin:0 0 10px;font-size:12.5px">${pages.length} página(s) · cada página traz ${UI.bePorPag} atletas e o painel lateral completo (alertas, dor, quem não vai treinar e quem não respondeu).</p>` + pages.map((h, i) => `<div class="brel-prev">${h}</div>`).join('');
}
const _vMon = vMon;
vMon = function () {
  if (S.view === 'mon-pse') return _vMon();
  const body = S.view === 'mon-be-hist' ? fBeHist : S.view === 'mon-be-rel' ? fBeRel : fBe;
  const h = header({ title: 'BEM-ESTAR DIÁRIO', sub: 'MONITORAMENTO DE SAÚDE E PERFORMANCE', items: hdrItems() });
  if (PRINT) return h + '<div style="height:16px"></div>' + body();
  return h + `<nav class="rtabs">${MON_TABS.map(([k, n]) => `<button data-go="${k}" class="${S.view === k ? 'on' : ''}">${n}</button>`).join('')}</nav>` + noData() + body();
};
function bePrint(pdf) {
  const pages = beRelPaginas().map(h => `<div class="sheet"><div class="pdfpage fixed bepg"><div class="report">${h}</div></div></div>`);
  if (pdf) gerarPDF(pages, 'bemestar'); else imprimir(pages);
}

/* ---------- lançamento manual no formato do Forms ---------- */
formBe = function () {
  const cat = F.categoria !== 'Todas' ? F.categoria : (S.atletas[0]?.categoria || 'Sub-15'); const d = UI.monDia;
  const sel = (f, v) => `<select data-f="${f}"><option value="">–</option>${BEF[f].map(o => `<option ${o === v ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
  openModal(mh('Lançar bem-estar (mesmas perguntas do Forms)') + `<form id="fBe" novalidate><div class="mb">
    <div class="form" style="grid-template-columns:repeat(4,1fr)"><div class="f"><label for="beD">Data *</label><input id="beD" type="date" value="${d}" max="${todayISO()}"></div><div class="f"><label for="beC">Categoria</label><select id="beC">${opts(Object.keys(GRUPOS), cat)}</select></div><div class="f s2"><span class="hint">Deixe a linha em branco para quem não respondeu. Status calculado automaticamente.</span></div></div>
    <div class="tbl-wrap" style="max-height:470px;overflow:auto;border:1px solid var(--line);border-radius:8px"><table class="t hidin bein"><thead><tr><th class="l">Atleta</th><th>Treina?</th><th>Sono</th><th>Fadiga</th><th>Recuperação</th><th>Estresse</th><th>Humor</th><th>Dor</th><th>Escala dor</th><th>Local da dor</th><th>Urina</th><th>Motivo / obs.</th><th>Status</th></tr></thead><tbody id="beRows"></tbody></table></div>
  </div><div class="mf"><span class="msg" id="beErr"></span><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${IC.check} Salvar respostas</button></div></form>`, true);
  const fill = () => { const dd = $('#beD').value; const as = S.atletas.filter(a => a.categoria === $('#beC').value).sort((a, b) => a.nome.localeCompare(b.nome)); $('#beRows').innerHTML = as.map(a => { const r = (S.bemestar || []).find(x => x.atletaId === a.id && x.data === dd && x.sono !== undefined) || {}; return `<tr data-a="${a.id}"><td class="l">${athCell(a)}</td><td>${sel('treinaHoje', r.treinaHoje)}</td><td>${sel('sono', r.sono)}</td><td>${sel('fadiga', r.fadiga)}</td><td>${sel('recuperacao', r.recuperacao)}</td><td>${sel('estresse', r.estresse)}</td><td>${sel('humor', r.humor)}</td><td>${sel('dor', r.dor)}</td><td><input type="number" min="0" max="10" data-f="escalaDor" value="${r.escalaDor ?? ''}" style="width:56px"></td><td><input data-f="localDor" value="${esc(r.localDor || '')}" style="width:110px"></td><td><select data-f="urina"><option value="">–</option>${[1, 2, 3, 4, 5, 6, 7, 8].map(n => `<option ${+r.urina === n ? 'selected' : ''}>${n}</option>`).join('')}</select></td><td><input data-f="motivo" value="${esc(r.motivo || r.observacao || '')}" style="width:130px"></td><td class="bst2">—</td></tr>`; }).join(''); calc(); };
  const read = tr => { const o = {}; tr.querySelectorAll('[data-f]').forEach(i => o[i.dataset.f] = i.value); return o; };
  const calc = () => $$('#beRows tr').forEach(tr => { const o = read(tr); const has = o.sono || o.fadiga || o.recuperacao || o.estresse || o.humor; tr.querySelector('.bst2').innerHTML = has ? stChipB(beSt(o).st) : '—'; });
  $('#beC').onchange = fill; $('#beD').onchange = fill; $('#fBe').addEventListener('change', calc); $('#fBe').addEventListener('input', calc); fill();
  $('#fBe').onsubmit = async e => {
    e.preventDefault(); const dd = $('#beD').value;
    const docs = $$('#beRows tr').map(tr => { const o = read(tr); if (!(o.sono || o.fadiga || o.recuperacao || o.estresse || o.humor)) return null; return { id: `be_${tr.dataset.a}_${dd}`, atletaId: tr.dataset.a, data: dd, origem: 'manual', treinaHoje: o.treinaHoje || 'Sim', dor: o.dor || 'Normal', escalaDor: o.escalaDor === '' ? null : +o.escalaDor, localDor: o.localDor.trim(), fadiga: o.fadiga, recuperacao: o.recuperacao, sono: o.sono, estresse: o.estresse, humor: o.humor, urina: o.urina ? +o.urina : null, motivo: o.motivo.trim() }; }).filter(Boolean);
    if (!docs.length) return $('#beErr').textContent = 'Preencha as respostas de pelo menos um atleta.';
    await saveMany('bemestar', docs); UI.monDia = dd; closeModal(); render(); toast(`${docs.length} resposta(s) salva(s)`);
  };
};

/* ---------- importar respostas do Google Forms (planilha baixada) ---------- */
const FORMS_COLS = { timestamp: ['carimbo de data/hora', 'timestamp', 'data'], atleta: ['atletas', 'atleta', 'nome'], treinaHoje: ['voce ira treinar/ jogar hoje?', 'voce ira treinar/jogar hoje?', 'treina hoje'], dor: ['dor muscular/ articular?', 'dor muscular/articular?', 'dor'], localDor: ['local da dor?', 'local da dor'], escalaDor: ['escala de dor'], fadiga: ['fadiga'], recuperacao: ['recuperacao'], sono: ['sono'], estresse: ['nivel de estresse', 'estresse'], humor: ['humor'], motivo: ['motivo'], urina: ['cor da urina', 'urina'] };
function parseTs(v) { if (v instanceof Date && !isNaN(v)) return v.getFullYear() + '-' + pad(v.getMonth() + 1) + '-' + pad(v.getDate()); return parseDate(v); }
async function beImportar(file) {
  try { await loadLib('xlsx'); } catch (e) { toast('Não foi possível carregar o leitor de planilhas.', true); return; }
  let rows; try { const wb = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true }); const ws = wb.Sheets[wb.SheetNames.find(n => /respostas/i.test(n)) || wb.SheetNames[0]]; rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: true }); } catch (e) { toast('Não consegui ler o arquivo.', true); return; }
  const hdr = (rows[0] || []).map(h => nrmB(h).replace(/\s+/g, ' ')); const idx = {};
  Object.entries(FORMS_COLS).forEach(([k, al]) => { const i = hdr.findIndex(h => al.includes(h)); if (i >= 0) idx[k] = i; });
  if (idx.timestamp == null || idx.atleta == null) { toast('Não encontrei as colunas “Carimbo de data/hora” e “Atletas”. Baixe a planilha de respostas do Forms (.xlsx ou .csv).', true); return; }
  const map = new Map(), sem = new Map();
  rows.slice(1).forEach(r => { const nome = String(r[idx.atleta] ?? '').trim(), d = parseTs(r[idx.timestamp]); if (!nome || !d) return; const a = findAtleta(nome); const o = { data: d }; Object.keys(FORMS_COLS).forEach(k => { if (k !== 'timestamp' && k !== 'atleta' && idx[k] != null) o[k] = String(r[idx[k]] ?? '').trim(); }); o.escalaDor = numB(o.escalaDor); o.urina = numB(o.urina); o.nomeForms = nome; if (!a) { sem.set(nome, (sem.get(nome) || 0) + 1); return; } map.set(a.id + '|' + d, { ...o, id: `be_${a.id}_${d}`, atletaId: a.id, origem: 'forms' }); });
  const docs = [...map.values()], dias = [...new Set(docs.map(x => x.data))].sort();
  openModal(mh('Importar respostas do Forms') + `<div class="mb"><div class="counters"><span><b>${docs.length}</b> respostas reconhecidas</span><span><b>${dias.length}</b> dia(s): ${dias.length ? fmtD(dias[0]) + ' a ' + fmtD(dias[dias.length - 1]) : '—'}</span><span style="${sem.size ? 'color:var(--red);border-color:var(--red)' : ''}"><b>${sem.size}</b> nome(s) sem atleta cadastrado</span></div>${sem.size ? `<div class="warn" style="margin:0">Estes nomes do Forms não batem com nenhum atleta do cadastro e serão ignorados: <b>${[...sem.keys()].map(esc).join(', ')}</b>. Ajuste o nome no cadastro do atleta (ou o apelido) e importe de novo.</div>` : ''}<p class="muted" style="margin:0;font-size:12.5px">Se o atleta respondeu mais de uma vez no mesmo dia, vale a última resposta. Respostas já importadas são atualizadas, não duplicadas.</p></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn pri" id="beImpOk" ${docs.length ? '' : 'disabled'}>${IC.check} Importar ${docs.length} resposta(s)</button></div>`);
  $('#beImpOk').onclick = async () => { closeModal(); await saveMany('bemestar', docs); if (dias.length) UI.monDia = dias[dias.length - 1]; render(); toast(`${docs.length} resposta(s) importada(s)`); };
}

/* ---------- ficha: último bem-estar no novo modelo ---------- */
const _sfBe = statusFisico;
statusFisico = function (a) { const r = _sfBe(a); const last = (S.bemestar || []).filter(x => x.atletaId === a.id && x.sono !== undefined).sort((x, y) => x.data.localeCompare(y.data)).pop(); if (last && dayDiff(last.data, todayISO()) <= 3) { const st = beSt(last); r.bem = { txt: `${st.st} · ${fmtDs(last.data)}`, s: st.st === 'NORMAL' ? 'ok' : st.st === 'ATENÇÃO' ? 'warn' : 'bad' }; } else delete r.bem; return r; };

document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'beImport' && t.files[0]) { beImportar(t.files[0]); t.value = ''; }
  if (t.id === 'beDatas' && t.value) { UI.monDia = t.value; render(); }
  if (t.id === 'beFa') { UI.beFiltro.atleta = t.value; render(); }
  if (t.id === 'beFt') { UI.beFiltro.treina = t.value; render(); }
  if (t.id === 'beAtlSel') { UI.beAtl = t.value; render(); }
  if (t.id === 'bePorPag') { UI.bePorPag = +t.value; render(); }
  if (t.id === 'beNota') { S.config.beNotas = { ...(S.config.beNotas || {}), [UI.monDia]: t.value.trim() }; putConfig(); toast('Nota salva'); }
});
let bebt; document.addEventListener('input', e => { if (e.target.id === 'beFb') { const v = e.target.value; clearTimeout(bebt); bebt = setTimeout(() => { UI.beFiltro.busca = v; const p = e.target.selectionStart; render(); const el = $('#beFb'); if (el) { el.focus(); el.setSelectionRange(p, p); } }, 250); } });
document.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'be-print') bePrint(false); if (t.dataset.act === 'be-pdf') bePrint(true); });
