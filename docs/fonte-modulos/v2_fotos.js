/* ================= IMPORTAR FOTOS DOS ATLETAS (pelo nome do arquivo) ================= */
UI.fotos = null; // [{file, url, nomeArq, atletaId}]
function matchFoto(nomeArq) {
  const base = nomeArq.replace(/\.[a-z0-9]+$/i, '').replace(/[_\-.]+/g, ' ').replace(/\d+/g, ' ');
  const n = nrmName(base); if (!n) return null;
  let a = S.atletas.find(x => nrmName(x.nome) === n || (x.apelido && nrmName(x.apelido) === n)); if (a) return a.id;
  const p = n.split(' ').filter(w => w.length > 1);
  a = S.atletas.find(x => { const q = nrmName(x.nome).split(' '); return p.length >= 2 && q[0] === p[0] && q.includes(p[p.length - 1]); }); if (a) return a.id;
  a = S.atletas.find(x => p.every(w => nrmName(x.nome).split(' ').includes(w))); if (a) return a.id;
  const num = nomeArq.match(/(?:^|\D)(\d{1,2})(?:\D|$)/); if (num && p.length) { a = S.atletas.find(x => String(x.numero) === String(+num[1]) && nrmName(x.nome).includes(p[0])); if (a) return a.id; }
  return null;
}
async function lerFotos(files) {
  const imgs = [...files].filter(f => /^image\//.test(f.type) || /\.(jpe?g|png|webp|heic)$/i.test(f.name));
  if (!imgs.length) { toast('Nenhuma imagem encontrada.', true); return; }
  UI.fotos = imgs.map(f => ({ file: f, url: URL.createObjectURL(f), nomeArq: f.name, atletaId: matchFoto(f.name) }));
  render();
}
function fotosHTML() {
  const L = UI.fotos;
  const sel = (i, v) => `<select data-fidx="${i}" class="search" style="min-width:0;width:100%"><option value="">— não importar —</option>${[...S.atletas].sort((a, b) => a.nome.localeCompare(b.nome)).map(a => `<option value="${a.id}" ${a.id === v ? 'selected' : ''}>${esc(a.nome)} · ${esc(a.subcategoria || a.categoria)}</option>`).join('')}</select>`;
  const ok = L ? L.filter(x => x.atletaId).length : 0;
  return panel('2 · Escolha as fotos', `<label class="drop" id="dropFotos">${IC.upload}<b>Clique para escolher ou arraste várias fotos aqui</b><span>JPG, PNG ou WEBP. O nome do arquivo deve ser o nome do atleta, por exemplo “Arthur Nascimento.jpg” ou “arthur_nascimento_07.png”.</span><input type="file" id="impFotos" accept="image/*" multiple hidden></label>`)
    + `<div style="height:16px"></div>` + panel('3 · Confira antes de importar', L ? `<div class="counters"><span><b>${L.length}</b> fotos</span><span><b>${ok}</b> com atleta encontrado</span><span style="${L.length - ok ? 'color:var(--red);border-color:var(--red)' : ''}"><b>${L.length - ok}</b> sem atleta (escolha na lista ou deixe sem importar)</span></div>
      <div class="fotogrid">${L.map((x, i) => { const a = atl(x.atletaId); return `<div class="fotoc ${x.atletaId ? '' : 'miss'}"><img src="${x.url}" alt=""><div><small>${esc(x.nomeArq)}</small>${sel(i, x.atletaId)}${a && a.foto ? '<em>substitui a foto atual</em>' : ''}</div></div>`; }).join('')}</div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px"><button class="btn" data-act="fotos-cancel">Cancelar</button><button class="btn pri" data-act="fotos-ok" ${ok ? '' : 'disabled'}>${IC.check} Importar ${ok} foto(s)</button></div>` : '<div class="mini-empty">Escolha as fotos no passo 2 para ver a correspondência com os atletas.</div>');
}
const _vImportar = vImportar;
vImportar = function () {
  let h = _vImportar();
  const card = `<label class="rk"><input type="radio" name="impTipo" value="fotos" ${IMP.tipo === 'fotos' ? 'checked' : ''}><span style="flex:1"><b>Fotos dos atletas</b><small>Envie várias fotos de uma vez. O sistema identifica o atleta pelo nome do arquivo e coloca a foto no cadastro (aparece em todos os módulos e relatórios).</small></span></label>`;
  h = h.replace('<div class="rk-list">', '<div class="rk-list">' + card);
  if (IMP.tipo !== 'fotos') return h;
  // troca os passos 2 e 3 pela importação de fotos
  const tmp = document.createElement('div'); tmp.innerHTML = h;
  const ps = [...tmp.querySelectorAll('.panel')];
  const p2 = ps.find(p => p.querySelector('.ph')?.textContent.trim().startsWith('2 ·')), p3 = ps.find(p => p.querySelector('.ph')?.textContent.trim().startsWith('3 ·'));
  const parts = fotosHTML().split('<div style="height:16px"></div>');
  if (p2) p2.outerHTML = parts[0]; if (p3) p3.outerHTML = parts[1];
  return tmp.innerHTML;
};
async function importarFotos() {
  const L = (UI.fotos || []).filter(x => x.atletaId); if (!L.length) return;
  const docs = [];
  for (const x of L) { try { const foto = await prepFotoDM(x.file); const a = atl(x.atletaId); if (a) docs.push({ ...a, foto }); } catch (e) { } }
  await saveMany('atletas', docs); UI.fotos.forEach(x => URL.revokeObjectURL(x.url)); UI.fotos = null; render(); toast(`${docs.length} foto(s) importada(s)`);
}
document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'impFotos' && t.files.length) lerFotos(t.files);
  if (t.dataset.fidx !== undefined && UI.fotos) { UI.fotos[+t.dataset.fidx].atletaId = t.value || null; render(); }
});
document.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'fotos-ok') importarFotos(); if (t.dataset.act === 'fotos-cancel') { UI.fotos = null; render(); } });
document.addEventListener('dragover', e => { const z = e.target.closest && e.target.closest('#dropFotos'); if (z) { e.preventDefault(); z.classList.add('over'); } });
document.addEventListener('drop', e => { const z = e.target.closest && e.target.closest('#dropFotos'); if (z) { e.preventDefault(); z.classList.remove('over'); lerFotos(e.dataTransfer.files); } });
