/* ================= RELATÓRIO INDIVIDUAL · LAYOUT DA ARTE DO CLUBE ================= */
const LOGOBIG = '__LOGOBIG__';
const RXI = {
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4.5" fill="currentColor"/><path d="M3 22c0-5 4-8 9-8s9 3 9 8z" fill="currentColor"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/><path d="M7 14h2M11 14h2M15 14h2M7 17h2M11 17h2" stroke-width="1.6"/></svg>',
  ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M12 5h3M12 9h2M12 13h3M12 17h2" stroke-width="1.6"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z"/></svg>',
  group: '<svg viewBox="0 0 32 24"><circle cx="16" cy="6" r="4" fill="currentColor"/><circle cx="7" cy="8" r="3" fill="currentColor"/><circle cx="25" cy="8" r="3" fill="currentColor"/><rect x="2" y="13" width="28" height="11" rx="3" fill="currentColor"/></svg>',
  bars: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V9M10 21V13M15 21V7M20 21V11"/><path d="M4 8l6-4 4 3 6-5" stroke-width="1.8"/></svg>',
  clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V2h6v2M8 9h8M8 13h8M8 17h5"/></svg>',
  run: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="4" r="2" fill="currentColor"/><path d="M8 9l4-2 3 3 3 1M12 7l-2 6 4 3-1 6M10 13l-4 7M5 11l3-2"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M2 18l6-6 4 4 9-9"/></svg>',
  gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M3 17a9 9 0 0 1 18 0"/><path d="M12 17l4-6"/><circle cx="12" cy="17" r="1.6" fill="currentColor"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 21 3.5 12.5a5 5 0 0 1 7-7L12 7l1.5-1.5a5 5 0 0 1 7 7z" fill="currentColor"/></svg>',
  person: '<svg viewBox="0 0 24 24"><circle cx="12" cy="4" r="2.6" fill="currentColor"/><path d="M8 8h8l-1 7h-2v7h-2v-7H9z" fill="currentColor"/></svg>'
};
const POS_XY = { GOL: [7, 50], ZAG: [21, 50], LAT: [30, 82], VOL: [37, 50], MEI: [55, 50], EXT: [74, 18], ATA: [86, 50] };
function posXY(a) { let [x, y] = POS_XY[a.posicao] || [50, 50]; const d = nrmB(a.posDetalhe || ''); if (a.posicao === 'LAT' || a.posicao === 'EXT') y = /esquerd/.test(d) ? 18 : 82; if (/meia direit|ponta direit/.test(d)) y = 82; if (/esquerd/.test(d) && a.posicao === 'MEI') y = 25; return [x, y]; }
const BWORD = ['EXCELENTE', 'MUITO BOM', 'BOM', 'REGULAR', 'ABAIXO'], BWCOL = ['#1fd03a', '#1a73ff', '#1a73ff', '#1a73ff', '#ff2a2a'];
const sgn = (v, d) => v == null || isNaN(v) ? '' : (v >= 0 ? '+' : '−') + nf(Math.abs(v), d);
relIndAv = function (a) {
  const ts = tsDe(a.id), last = ts[ts.length - 1], mt = matDe(a.id).slice(-1)[0], mc = mt ? calcMat(mt) : null, av = avsDe(a.id).slice(-1)[0], ca = av ? calcAv(av) : null;
  const partes = (a.nome || '').trim().split(/\s+/), primeiro = (a.apelido && !a.apelido.includes(' ') ? a.apelido : partes[0] || '').toUpperCase(), sobre = (partes.length > 1 ? partes[partes.length - 1] : '').toUpperCase() || primeiro;
  const alt = mc?.H ? mc.H / 100 : av?.altura ? +av.altura : a.altura ? +a.altura : null, peso = ca ? ca.peso : a.peso ? +a.peso : null, gord = ca && ca.g != null ? ca.g : a.gordura ? +a.gordura : null;
  const elenco = S.atletas.filter(x => x.categoria === a.categoria), pres = last ? new Set(S.testes.filter(t => t.data === last.data && elenco.some(x => x.id === t.atletaId)).map(t => t.atletaId)).size : 0;
  const nT = last ? Object.keys(TESTS).filter(k => tval(last, k) != null).length : 0;
  const mesAno = last ? ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][+last.data.slice(5, 7) - 1] + '/' + last.data.slice(0, 4) : '—';
  const res = k => { const t = ultimoTeste(a.id, k), v = t ? tval(t, k) : null, p = t ? ultimoTeste(a.id, k, t.data) : null, pv = p ? tval(p, k) : null, bi = bandIdx(k, v); return { t, v, dv: v != null && pv != null ? v - pv : null, bi, w: bi != null ? BWORD[bi] : '—', c: bi != null ? BWCOL[bi] : '#8fb59a' }; };
  const card = (ic, l1, l2, k) => { const r = res(k); return `<div class="rxc"><div class="rxch">${RXI[ic]}<span>${l1}<br>${l2}</span></div><div class="rxv">${fmtT(k, r.v)}${r.dv != null ? `<sup>${sgn(r.dv, TESTS[k].d === 2 ? 1 : 1)}</sup>` : ''}</div><div class="rxw" style="color:${r.c}">${r.w}</div></div>`; };
  const r505 = res('t505'), dD = r505.t ? lado505(r505.t, 'd') : null, dE = r505.t ? lado505(r505.t, 'e') : null;
  const pcs = Object.keys(TESTS).map(k => { const t = ultimoTeste(a.id, k); return t ? pctl(k, tval(t, k), grupoStats(k)) : null; }).filter(v => v != null), ind = pcs.length ? Math.round(mean(pcs)) : null;
  const iw = ind == null ? ['—', '#8fb59a'] : ind >= 80 ? ['EXCELENTE', '#1fd03a'] : ind >= 65 ? ['MUITO BOM', '#1a73ff'] : ind >= 55 ? ['BOM', '#1a73ff'] : ind >= 35 ? ['REGULAR', '#1a73ff'] : ['ABAIXO', '#ff2a2a'];
  const [px, py] = posXY(a), FX = x => 30 + x / 100 * 340, FYt = y => { const t = y / 100; return { y: 18 + t * 128, l: 52 - t * 42, r: 348 + t * 42 }; };
  const fy = FYt(py), dotx = fy.l + (fy.r - fy.l) * px / 100;
  const pool = S.atletas.filter(x => x.categoria === a.categoria && x.posicao === a.posicao).sort((p, q) => p.nome.localeCompare(q.nome)); const NV = 7; const ix = Math.max(0, pool.findIndex(x => x.id === a.id)); const ini = Math.max(0, Math.min(ix - 3, pool.length - NV)); const car = pool.slice(ini, ini + NV);
  const foto = x => x.foto ? `<img src="${esc(x.foto)}" alt="">` : `<span class="rxsil">${IC.shirt}</span>`;
  return `<div class="sheet"><div class="pdfpage fixed rxpg"><div class="rx">
    <img class="rxcrest" src="${LOGOBIG}" alt="">
    <div class="rxph">${a.foto ? `<img src="${esc(a.foto)}" alt="">` : `<span class="rxsil big">${IC.shirt}</span>`}</div>
    <img class="rxlogo" src="${LOGOBIG}" alt="">
    <div class="rxname"><small>${esc(primeiro === sobre ? '' : primeiro)}</small><b>${esc(sobre)}</b></div>
    <div class="rxinfo"><span>${RXI.user}${esc((a.subcategoria || a.categoria || '').replace('-', ' ').toUpperCase())}</span><i></i><span>${RXI.cal}${idade(a.nascimento) || '—'} ANOS</span><i></i><span>${RXI.ruler}${alt ? nf(alt, 2) : '—'}</span><i></i><span>${RXI.bag}${peso ? nf(peso, 1) + ' kg' : '—'}</span></div>
    <div class="rxpos"><div class="rxposh">${RXI.shield}<div><small>POSIÇÃO</small><b>${esc((a.posDetalhe || POSN[a.posicao] || '').toUpperCase())}</b></div></div><h6>POSICIONAMENTO EM CAMPO</h6>
      <img class="rxfield" alt="Posicionamento em campo" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 412 182" width="700" height="310"><g transform="translate(6 6)"><path d="M52 18 H348 L390 146 H10 Z" fill="none" stroke="#fff" stroke-width="3"/><line x1="200" y1="18" x2="200" y2="146" stroke="#fff" stroke-width="3"/><ellipse cx="200" cy="82" rx="46" ry="30" fill="none" stroke="#fff" stroke-width="3"/><path d="M45 40 H100 L92 124 H22 Z M37 62 H62 L58 102 H30 Z" fill="none" stroke="#fff" stroke-width="3"/><path d="M355 40 H300 L308 124 H378 Z M363 62 H338 L342 102 H370 Z" fill="none" stroke="#fff" stroke-width="3"/><path d="M100 64 Q118 82 98 102 M300 64 Q282 82 302 102" fill="none" stroke="#fff" stroke-width="3"/><circle cx="${dotx}" cy="${fy.y}" r="10" fill="#1fd03a" stroke="#0a4d17" stroke-width="2.5"/><circle cx="${dotx}" cy="${fy.y}" r="18" fill="none" stroke="#1fd03a" stroke-width="1.5" opacity=".5"/></g></svg>`)}"></div>
    <div class="rxant"><h6>ANTROPOMETRIA</h6><div><span>${RXI.bag}<small>PESO</small><b>${peso ? nf(peso, 1) : '—'}</b><em>KG</em></span><i></i><span>${RXI.ruler}<small>ALTURA</small><b>${alt ? nf(alt, 2) : '—'}</b><em>m</em></span><i></i><span>${RXI.person}<small>%GORDURA</small><b>${gord != null ? nf(gord, 2) : '—'}</b><em>&nbsp;</em></span></div></div>
    <div class="rxst"><div>${RXI.group}<b>${elenco.length}</b><span>ATLETAS</span></div><i></i><div>${RXI.bars}<b>${nT}</b><span>TESTES<br>REALIZADOS</span></div><i></i><div>${RXI.clip}<b>${pres}</b><span>PRESENÇA<br>NA AVALIAÇÃO</span></div><i></i><div>${RXI.cal}<b class="sm">${mesAno}</b><span>DATA DA<br>AVALIAÇÃO</span></div></div>
    <div class="rxres"><h5>RESULTADOS DAS AVALIAÇÕES</h5><div class="rxg">
      ${card('run', 'CMJ', 'SALTO VERTICAL', 'cmj')}${card('run', 'VELOCIDADE 10m', 'TEMPO', 'v10')}${card('run', 'VELOCIDADE 30m', 'TEMPO', 'v30')}
      <div class="rxc"><div class="rxch">${RXI.trend}<span>AGILIDADE T505<br>TEMPO</span></div><div class="rx505"><div><b>${dD != null ? nf(dD, 2) : '—'}</b><em>DIREITA</em></div><div><b>${dE != null ? nf(dE, 2) : '—'}</b><em>ESQUERDA</em></div></div></div>
      ${card('gauge', 'APTIDÃO FÍSICA', '30-15 IFT', 'ift')}
      <div class="rxc"><div class="rxch">${RXI.heart}<span>ÍNDICE GERAL<br><small>DESEMPENHO FÍSICO</small></span></div><div class="rxv">${ind != null ? ind + '%' : '—'}</div><div class="rxw" style="color:${iw[1]}">${iw[0]}</div></div>
    </div></div>
    <div class="rxcar"><span class="rxcap">${esc((POSN[a.posicao] || a.posicao).toUpperCase())}S · ${esc((a.subcategoria || a.categoria || '').replace('-', ' ').toUpperCase())} <em>${pool.length}</em></span><span class="rxar l">&lt;</span>${car.map(x => `<div class="rxct ${x.id === a.id ? 'on' : ''}">${foto(x)}<b>${esc((x.apelido || x.nome).split(' ')[0])}</b></div>`).join('')}<span class="rxar r">&gt;</span></div>
  </div></div></div>`;
};
