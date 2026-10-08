/* sobreposições que precisam vir depois do sistema único */
const _vConfigX = vConfig;
vConfig = function () { const h = _vConfigX(); if (S.view !== 'config-geral') return h; return h + '<div style="height:14px"></div>' + exportHTML(); };

// capa dos relatórios: editável em Configurações → Geral
const _vConfigC = vConfig;
vConfig = function () { const h = _vConfigC(); if (S.view !== 'config-geral') return h; const c = capaCfg(); return h + '<div style="height:14px"></div>' + panel('Capa dos relatórios em PDF', `<p class="muted" style="margin-top:0">Vale para as capas de todos os relatórios (DM, nutrição, avaliação física, maturação e monitoramento).</p><div class="form" style="grid-template-columns:1fr 1fr"><div class="f"><label for="cpD">Linha do topo</label><input id="cpD" data-cap="depto" value="${esc(c.depto)}"></div><div class="f"><label for="cpR">Responsável (nome - função)</label><input id="cpR" data-cap="responsavel" value="${esc(c.responsavel)}"></div><div class="f s2" style="grid-column:1/-1"><label for="cpS">Frase da capa</label><input id="cpS" data-cap="slogan" value="${esc(c.slogan)}"></div>${Object.entries(c.titulos).map(([k, v]) => `<div class="f"><label>Título · ${{ dm: 'Fisio / DM', nut: 'Nutrição', av: 'Avaliação física', mat: 'Maturação', mon: 'Monitoramento' }[k]}</label><input data-capt="${k}" value="${esc(v)}"></div>`).join('')}</div><div style="margin-top:12px"><b style="font:800 13px var(--fc);text-transform:uppercase;color:var(--ink2)">Prévia da capa</b><div class="rbgrid" style="margin-top:6px"><div class="rbthumb big"><div class="rbsc">${capaGeral('av')}</div></div></div></div>`); };
window.document.addEventListener('change', e => { const t = e.target; if (t.dataset.cap || t.dataset.capt) { const c = S.config.capa || {}; if (t.dataset.cap) c[t.dataset.cap] = t.value.trim(); else c.titulos = { ...(c.titulos || {}), [t.dataset.capt]: t.value.trim() }; S.config.capa = c; putConfig(); toast('Capa atualizada'); render(); } });
// ajusta as folhas da prévia depois de desenhar a tela
const _renderRB = render;
function rbFit() { document.querySelectorAll('.rbthumb .sheet, .rbzoom .sheet').forEach(s => { try { fitSheet(s); } catch (e) { } }); document.querySelectorAll('.rbthumb, .rbzoom').forEach(t => { const a4 = t.classList.contains('a4'); const el = t.querySelector('.rbsc, .rbzs'); if (el) el.style.transform = `scale(${t.clientWidth / (a4 ? 1123 : 1280)})`; }); }
window.rbFit = rbFit;
render = function () { _renderRB(); requestAnimationFrame(rbFit); };
window.addEventListener('resize', () => requestAnimationFrame(rbFit));
