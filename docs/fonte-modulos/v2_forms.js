/* ================= FORMULÁRIOS DOS ATLETAS (bem-estar e PSE) ================= */
const ART_URL = 'https://claude.ai/artifact/KRM2XQBkZhyYDbzFd8psid';
let FM = null;
const fmLink = (tipo, cat) => `${ART_URL}#form=${tipo}${cat ? '&cat=' + encodeURIComponent(cat) : ''}`;
function abrirForm(tipo, cat, kiosk) {
  const fixo = (location.hash.match(/aid=([^&]+)/) || [])[1] || '';
  FM = { tipo, cat: cat || '', aid: fixo ? decodeURIComponent(fixo) : '', lock: !!fixo, a: { treinaHoje: 'Sim', dor: 'Normal' }, segs: [], done: false, kiosk: !!kiosk, d: todayISO() };
  let ov = $('#athForm'); if (!ov) { ov = document.createElement('div'); ov.id = 'athForm'; document.body.appendChild(ov); bindForm(ov); }
  ov.style.display = 'block'; renderForm();
}
function fecharForm() { const ov = $('#athForm'); if (ov) ov.style.display = 'none'; FM = null; }
const fopt = (campo, lista, cur) => `<div class="fqo">${lista.map(o => `<button type="button" class="${cur === o ? 'on' : ''}" data-fq="${campo}" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
function renderForm() {
  const ov = $('#athForm'); if (!ov || !FM) return;
  const cats = Object.keys(GRUPOS).filter(c => S.atletas.some(a => a.categoria === c));
  const ats = S.atletas.filter(a => !FM.cat || a.categoria === FM.cat).sort((a, b) => a.nome.localeCompare(b.nome));
  const a = atl(FM.aid), be = FM.tipo === 'bemestar';
  const head = `<div class="fmh"><img src="${LOGO}" alt=""><div><small>Porto Vitória · ${be ? 'pré-treino' : 'pós-treino'}</small><h2>${be ? 'Bem-estar diário' : 'Percepção de esforço (PSE)'}</h2><span>${diaSemana(FM.d)}, ${fmtD(FM.d)}</span></div><button class="fmx" data-fm="sair" aria-label="Sair">×</button></div>`;
  if (FM.done) { ov.innerHTML = `<div class="fmw">${head}<div class="fmok">${IC.check}<h3>Obrigado${a ? ', ' + esc((a.apelido || a.nome).split(' ')[0]) : ''}!</h3><p>Sua resposta foi registrada.</p>${FM.kiosk ? `<button class="fmbig" data-fm="outro">Responder outro atleta</button>` : ''}<button class="fmsec" data-fm="sair">${FM.lock ? 'Voltar' : FM.kiosk ? 'Sair do modo atleta' : 'Fechar'}</button></div></div>`; return; }
  const jaResp = a && (be ? (S.bemestar || []).some(r => r.atletaId === a.id && r.data === FM.d && r.sono !== undefined) : false);
  let body = FM.lock && a ? `<div class="fq"><h4>Atleta</h4><b style="font-size:18px">${esc(a.nome)}</b>${jaResp ? '<p class="fmwarn">Você já respondeu hoje. Se enviar de novo, a resposta anterior será substituída.</p>' : ''}</div>` : `<div class="fq"><h4>1. Quem é você?</h4>${!FM.cat && cats.length > 1 ? `<div class="fqo">${cats.map(c => `<button type="button" class="${FM.catSel === c ? 'on' : ''}" data-fm="cat" data-v="${c}">${c}</button>`).join('')}</div>` : ''}<select class="fmsel" data-fm="aid"><option value="">Escolha seu nome</option>${ats.filter(x => !FM.catSel || x.categoria === FM.catSel).map(x => `<option value="${x.id}" ${x.id === FM.aid ? 'selected' : ''}>${esc(x.nome)}${x.numero ? ' · #' + esc(x.numero) : ''}</option>`).join('')}</select>${jaResp ? '<p class="fmwarn">Você já respondeu hoje. Se enviar de novo, a resposta anterior será substituída.</p>' : ''}</div>`;
  if (be) {
    const q = (n, t, campo, lista) => `<div class="fq"><h4>${n}. ${t}</h4>${fopt(campo, lista, FM.a[campo])}</div>`;
    body += q(2, 'Você vai treinar / jogar hoje?', 'treinaHoje', BEF.treinaHoje) + (FM.a.treinaHoje === 'Não' ? `<div class="fq"><h4>Motivo</h4><input class="fmin" data-fa="motivo" value="${esc(FM.a.motivo || '')}" placeholder="Por que não vai treinar?"></div>` : '')
      + q(3, 'Como foi o seu sono?', 'sono', BEF.sono) + q(4, 'Fadiga', 'fadiga', BEF.fadiga) + q(5, 'Recuperação', 'recuperacao', BEF.recuperacao) + q(6, 'Nível de estresse', 'estresse', BEF.estresse) + q(7, 'Humor', 'humor', BEF.humor)
      + q(8, 'Dor muscular / articular?', 'dor', BEF.dor)
      + (FM.a.dor && FM.a.dor !== 'Normal' ? `<div class="fq"><h4>Onde está a dor? Toque no músculo</h4><div class="fmbody" id="fmBody">${bodyMap({ mode: 'pick' })}</div><p class="fmsel2">${FM.segs.length ? FM.segs.map(i => `<span>${esc(segTip(SEGS[i]))} <button type="button" data-fm="unseg" data-v="${i}" aria-label="Remover">×</button></span>`).join('') : '<em>Nenhum local escolhido</em>'}</p><h4>Intensidade da dor (0 a 10)</h4><div class="fsc">${Array.from({ length: 11 }, (_, i) => `<button type="button" class="${+FM.a.escalaDor === i && FM.a.escalaDor !== '' && FM.a.escalaDor != null ? 'on' : ''}" style="--c:${i <= 2 ? '#1b8a4a' : i <= 5 ? '#f0b30c' : i <= 7 ? '#f39324' : '#e0342b'}" data-fq="escalaDor" data-v="${i}">${i}</button>`).join('')}</div></div>` : '')
      + `<div class="fq"><h4>9. Cor da urina hoje</h4><div class="furi">${URINAB.map((c, i) => `<button type="button" class="${+FM.a.urina === i + 1 ? 'on' : ''}" style="background:${c}" data-fq="urina" data-v="${i + 1}">${i + 1}</button>`).join('')}</div><small class="muted">1 = bem clara (bem hidratado) · 8 = bem escura</small></div>`;
  } else {
    const cat = a ? a.categoria : (FM.catSel || FM.cat); const ss = cat ? ativas(sessoesDia(cat, FM.d)) : [];
    body += `<div class="fq"><h4>2. Qual sessão?</h4><div class="fqo">${ss.map(s => `<button type="button" class="${FM.a.sid === s.id ? 'on' : ''}" data-fm="ses" data-v="${s.id}">${esc(s.hora || '')} ${esc(s.tipo === 'jogo' ? 'Jogo' + (s.adversario ? ' x ' + s.adversario : '') : (s.titulo || SESS[s.tipo]?.[0] || 'Treino'))}</button>`).join('')}${['Treino', 'Jogo', 'Treino físico', 'Recuperação'].map(o => `<button type="button" class="${!FM.a.sid && FM.a.sessao === o ? 'on' : ''}" data-fm="sesl" data-v="${o}">${o}</button>`).join('')}</div></div>
      <div class="fq"><h4>3. Quanto tempo durou (minutos)?</h4><input class="fmin" type="number" min="5" max="240" data-fa="duracao" value="${esc(FM.a.duracao ?? '')}" placeholder="Ex.: 75"></div>
      <div class="fq"><h4>4. Como foi o treino para você?</h4><div class="fpse">${PSE_ESC.map((n, i) => `<button type="button" class="${+FM.a.pse === i && FM.a.pse !== '' && FM.a.pse != null ? 'on' : ''}" style="--c:${i <= 2 ? '#1b8a4a' : i <= 4 ? '#7bd08f' : i <= 6 ? '#f0b30c' : i <= 8 ? '#f39324' : '#e0342b'}" data-fq="pse" data-v="${i}"><b>${i}</b><span>${n}</span></button>`).join('')}</div><small class="muted">Responda cerca de 30 minutos depois do fim da sessão.</small></div>`;
  }
  ov.innerHTML = `<div class="fmw">${head}<div class="fmf">${body}<p class="fmerr" id="fmErr"></p><button class="fmbig" data-fm="enviar">${IC.check} Enviar resposta</button></div></div>`;
  ov.querySelectorAll('#fmBody [data-seg]').forEach(p => p.classList.toggle('sel', FM.segs.includes(+p.dataset.seg)));
}
async function enviarForm() {
  const a = atl(FM.aid), err = t => { $('#fmErr').textContent = t; };
  if (!a) return err('Escolha o seu nome.');
  if (FM.tipo === 'bemestar') {
    const f = FM.a; const falta = ['sono', 'fadiga', 'recuperacao', 'estresse', 'humor'].filter(k => !f[k]); if (falta.length) return err('Responda todas as perguntas (faltou: ' + falta.join(', ') + ').'); if (!f.urina) return err('Escolha a cor da urina.');
    if (f.dor !== 'Normal' && !FM.segs.length) return err('Toque no corpo para mostrar onde está a dor.');
    const loc = FM.segs.map(i => segTip(SEGS[i])).join(' · ');
    const o = { id: `be_${a.id}_${FM.d}`, atletaId: a.id, data: FM.d, origem: 'app', treinaHoje: f.treinaHoje, motivo: (f.motivo || '').trim(), dor: f.dor, escalaDor: f.dor !== 'Normal' && f.escalaDor !== '' && f.escalaDor != null ? +f.escalaDor : null, localDor: f.dor !== 'Normal' ? loc : '', dorSegs: f.dor !== 'Normal' ? FM.segs.map(i => ({ regiao: SEGS[i][0], lado: SEGS[i][1], musculo: SEGS[i][2] })) : [], sono: f.sono, fadiga: f.fadiga, recuperacao: f.recuperacao, estresse: f.estresse, humor: f.humor, urina: +f.urina, hora: new Date().toTimeString().slice(0, 5) };
    await save('bemestar', o);
  } else {
    const f = FM.a; if (f.pse === '' || f.pse == null) return err('Escolha o quanto o treino foi intenso (0 a 10).'); if (!+f.duracao) return err('Informe quantos minutos durou.');
    const s = (S.micro || []).find(x => x.id === f.sid); const ses = s ? (s.tipo === 'jogo' ? 'Jogo' : s.tipo === 'recup' ? 'Recuperação' : ['forca', 'fisico', 'cond', 'veloc'].includes(s.tipo) ? 'Treino físico' : 'Treino') : (f.sessao || 'Treino');
    await save('pse', { id: `pse_${a.id}_${FM.d}_${ses.replace(/\s/g, '')}`, atletaId: a.id, data: FM.d, sessao: ses, sessaoId: f.sid || '', pse: +f.pse, duracao: +f.duracao, origem: 'app' });
  }
  FM.done = true; renderForm();
}
function bindForm(ov) {
  ov.addEventListener('click', e => {
    if (!FM) return; const seg = e.target.closest('#fmBody [data-seg]'); if (seg) { const i = +seg.dataset.seg; FM.segs = FM.segs.includes(i) ? FM.segs.filter(x => x !== i) : [...FM.segs, i]; renderForm(); return; }
    const q = e.target.closest('[data-fq]'); if (q) { FM.a[q.dataset.fq] = q.dataset.v; if (q.dataset.fq === 'dor' && q.dataset.v === 'Normal') { FM.segs = []; FM.a.escalaDor = null; } renderForm(); return; }
    const b = e.target.closest('[data-fm]'); if (!b) return; const k = b.dataset.fm;
    if (k === 'sair') { if (FM.lock && window.PV_SERVER) { location.href = '/atleta'; return; } if (!FM.kiosk || FM.done || confirm('Sair do modo atleta?')) fecharForm(); }
    if (k === 'outro') { const t = FM.tipo, c = FM.cat, ki = FM.kiosk, cs = FM.catSel; abrirForm(t, c, ki); FM.catSel = cs; renderForm(); }
    if (k === 'cat') { FM.catSel = b.dataset.v; FM.aid = ''; renderForm(); }
    if (k === 'ses') { const s = (S.micro || []).find(x => x.id === b.dataset.v); FM.a.sid = b.dataset.v; FM.a.sessao = ''; if (s && s.duracao && !FM.a.duracao) FM.a.duracao = s.duracao; if (s && s.tipo === 'jogo') { const j = (window.MIN?.S.jogos || []).find(x => x.data === FM.d && (x.relacionados || []).some(r => r.atletaId === FM.aid)); const r = j && j.relacionados.find(x => x.atletaId === FM.aid); if (r && +r.min) FM.a.duracao = +r.min; } renderForm(); }
    if (k === 'sesl') { FM.a.sid = ''; FM.a.sessao = b.dataset.v; renderForm(); }
    if (k === 'enviar') enviarForm();
  });
  ov.addEventListener('change', e => { if (!FM) return; if (e.target.dataset.fm === 'aid') { FM.aid = e.target.value; renderForm(); } });
  ov.addEventListener('input', e => { if (!FM) return; const k = e.target.dataset.fa; if (k) FM.a[k] = e.target.value; });
}
function formsCfgHTML() {
  const cats = Object.keys(GRUPOS).filter(c => S.atletas.some(a => a.categoria === c)); const c0 = UI.fmCat ?? '';
  const card = (tipo, t, d) => `<div class="panel"><div class="ph">${t}</div><div class="pb fmcfg"><p>${d}</p><label class="f"><span>Link para os atletas</span><div class="fmlink"><input readonly value="${esc(fmLink(tipo, c0))}" id="lk-${tipo}"><button class="btn sm" data-act="fm-copy" data-t="${tipo}">${IC.copy} Copiar</button></div></label><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri" data-act="fm-open" data-t="${tipo}">${IC.clip} Abrir no modo atleta (tablet / celular)</button></div></div></div>`;
  return `<div class="panel" style="margin-bottom:14px"><div class="pb" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><b style="font-family:var(--fc);font-size:16px;text-transform:uppercase">Categoria do link</b><div class="seg2"><label><input type="radio" name="fmCat" value="" ${!c0 ? 'checked' : ''}>Atleta escolhe</label>${cats.map(c => `<label><input type="radio" name="fmCat" value="${c}" ${c0 === c ? 'checked' : ''}>${c}</label>`).join('')}</div></div></div>
  <div class="cfg-grid">${card('bemestar', 'Bem-estar diário (pré-treino)', 'Sono, fadiga, recuperação, estresse, humor, dor (o atleta toca no músculo no boneco) e cor da urina. As respostas entram direto em Monitoramento → Bem-estar.')}${card('pse', 'Percepção de esforço (pós-treino)', 'O atleta escolhe a sessão do dia (vem do microciclo), informa os minutos e a PSE de 0 a 10. Entra direto em Monitoramento → PSE e na carga do atleta.')}
  ${panel('Como usar', `<div class="det-row"><span>Modo atleta</span><div>No tablet ou celular do clube, abra o modo atleta: os atletas respondem um depois do outro (“Responder outro atleta”) e só veem o formulário.</div></div><div class="det-row"><span>Pelo link</span><div>Para cada atleta responder no próprio celular, compartilhe este sistema com eles (botão Compartilhar do Claude) e envie o link acima. Quem abre pelo link vê só o formulário.</div></div><div class="det-row"><span>Privacidade</span><div>Quem tem acesso ao sistema pode abrir as outras telas; para uso pelos atletas, prefira o modo atleta no aparelho do clube.</div></div>`)}</div>`;
}
document.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'fm-open') abrirForm(t.dataset.t, UI.fmCat || '', true); if (t.dataset.act === 'fm-copy') { const i = $('#lk-' + t.dataset.t); try { navigator.clipboard.writeText(i.value).then(() => toast('Link copiado')); } catch (er) { i.select(); toast('Selecione e copie o link'); } } });
document.addEventListener('change', e => { if (e.target.name === 'fmCat') { UI.fmCat = e.target.value; render(); } });
// abrir direto pelo link (#form=bemestar&cat=Sub-15)
function checarLinkForm() { const h = (location.hash || '') + '&' + (location.search || ''); const m = h.match(/form=(bemestar|pse)/); if (!m) return; const c = decodeURIComponent((h.match(/cat=([^&]+)/) || [])[1] || ''); let n = 0; const tick = () => { n++; if (S.atletas.length || n > 30) abrirForm(m[1], c, false); else setTimeout(tick, 200); }; tick(); }
