/* ================= IMPORTAR DADOS ================= */
const IMP = { tipo: 'atletas', file: null, sheets: null, sheet: 0, rows: null, res: null, opts: { categoria: 'Sub-15', posicao: 'MEI', criar: true }, busy: false };
const nrm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9%]/g, '');
const nrmName = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
const ALIAS_ATL = {
  nome: ['nome', 'nomecompleto', 'atleta', 'jogador', 'nomedoatleta'], apelido: ['apelido', 'nomedeguerra', 'nomecamisa', 'nomenacamisa'],
  numero: ['numero', 'n', 'no', 'num', 'camisa', 'ncamisa', 'numerodacamisa'], nascimento: ['nascimento', 'datadenascimento', 'datanascimento', 'dn', 'dtnasc', 'datanasc', 'nasc', 'datadenasc'],
  categoria: ['categoria', 'cat'], subcategoria: ['subcategoria', 'sub'], posicao: ['posicao', 'pos', 'posicaoprincipal'], posDetalhe: ['funcao', 'posicaodetalhada', 'posicaoespecifica'],
  pe: ['pe', 'pedominante', 'perna', 'pernadominante', 'lateralidade'], altura: ['altura', 'alt', 'estatura', 'alturam'], peso: ['peso', 'massa', 'massacorporal', 'pesokg']
};
const ALIAS_LES = {
  atleta: ['atleta', 'nome', 'jogador', 'nomedoatleta', 'nomecompleto'], data: ['data', 'datadalesao', 'datalesao', 'dia', 'datainicio', 'datadeinicio', 'inicio'],
  tipo: ['tipo', 'lesao', 'tipodelesao', 'tipolesao', 'diagnostico'], grau: ['grau', 'graudalesao'], regiao: ['regiao', 'localdador', 'regiaodocorpo', 'regiaodalesao', 'area', 'parte', 'partedocorpo'],
  lado: ['lado', 'membro', 'lateralidade'], musculo: ['musculo', 'pontoexato', 'estrutura', 'musculoexato'], local: ['ondeaconteceu', 'ocorrencia', 'contexto', 'local', 'situacaodalesao', 'momento'],
  mecanismo: ['mecanismo', 'mecanismodalesao', 'causa'], dor: ['dor', 'eva', 'intensidade', 'intensidadedador'], dias: ['dias', 'diasafastado', 'diasfora', 'diasdeafastamento', 'afastamento', 'tempoafastado', 'diasafastamento'],
  previsao: ['previsao', 'previsaoderetorno', 'retorno', 'dataretorno', 'datadealta', 'alta', 'datadoretorno', 'previsaoretorno'], status: ['status', 'situacao', 'fase', 'situacaoatual'],
  tratamentos: ['condutas', 'tratamento', 'tratamentos', 'conduta'], exames: ['exames', 'exame', 'examesrealizados'], descricao: ['descricao', 'historico', 'relato'],
  obs: ['obs', 'observacoes', 'observacao'], cirurgia: ['cirurgia', 'cirurgico'], recorrente: ['recorrente', 'recidiva', 'recorrencia'], responsavel: ['responsavel', 'fisioterapeuta', 'profissional']
};
const REQ = { atletas: ['nome'], lesoes: ['atleta', 'data', 'regiao'] };
const FIELD_LABEL = { nome: 'Nome', apelido: 'Apelido', numero: 'Número', nascimento: 'Nascimento', categoria: 'Categoria', subcategoria: 'Subcategoria', posicao: 'Posição', posDetalhe: 'Função', pe: 'Pé dominante', altura: 'Altura', peso: 'Peso', atleta: 'Atleta', data: 'Data da lesão', tipo: 'Tipo de lesão', grau: 'Grau', regiao: 'Região', lado: 'Lado', musculo: 'Músculo', local: 'Onde aconteceu', mecanismo: 'Mecanismo', dor: 'Dor (0–10)', dias: 'Dias afastado', previsao: 'Previsão / retorno', status: 'Status', tratamentos: 'Condutas', exames: 'Exames', descricao: 'Descrição', obs: 'Observações', cirurgia: 'Cirurgia', recorrente: 'Recorrente', responsavel: 'Responsável' };

function parseDate(v) {
  if (v == null || v === '') return '';
  if (v instanceof Date && !isNaN(v)) return v.getFullYear() + '-' + pad(v.getMonth() + 1) + '-' + pad(v.getDate());
  if (typeof v === 'number' && v > 20000 && v < 80000) { const d = new Date(Date.UTC(1899, 11, 30) + v * 864e5); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); }
  const s = String(v).trim(); let m;
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  if ((m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/))) { let y = +m[3]; if (y < 100) y += y > 40 ? 1900 : 2000; return `${y}-${pad(m[2])}-${pad(m[1])}`; }
  return '';
}
const numOr = v => { if (v === '' || v == null) return ''; const n = parseFloat(String(v).replace(',', '.').replace(/[^\d.\-]/g, '')); return isNaN(n) ? '' : n; };
function mapPos(v) {
  const s = nrm(v); if (!s) return '';
  if (POS.includes(s.toUpperCase())) return s.toUpperCase();
  if (/^(ld|le|lat|lateral)/.test(s)) return 'LAT'; if (/^(pd|pe|ponta|extremo|ext)/.test(s)) return 'EXT';
  if (/gol/.test(s)) return 'GOL'; if (/zag|beque|defensor/.test(s)) return 'ZAG'; if (/vol/.test(s)) return 'VOL'; if (/mei|meio|armador/.test(s)) return 'MEI'; if (/ata|centroav|cent|ca$/.test(s)) return 'ATA';
  return '';
}
function mapPe(v) { const s = nrm(v); if (!s) return ''; if (/^(d|dir|destro|direito)/.test(s)) return 'Direito'; if (/^(e|esq|canhoto|esquerdo)/.test(s)) return 'Esquerdo'; if (/amb/.test(s)) return 'Ambidestro'; return ''; }
function mapCat(v, nasc) { const m = String(v ?? '').match(/(\d{1,2})/); if (m) { const sub = 'Sub-' + +m[1]; if (GRUPO_DE[sub]) return { cat: GRUPO_DE[sub], sub: GRUPOS[sub] ? '' : sub }; if (GRUPOS[sub]) return { cat: sub, sub: '' }; } const q = subPorIdade(nasc, S.config.anoBase); return q.cat ? { cat: q.cat, sub: q.sub } : {}; }
const REG_SYN = [
  ['posterior', /posterior|isquio|isquiotib|hamstring|biceps femoral|semitend|semimemb/], ['adutor', /adut|gracil/], ['quadriceps', /quadric|reto femoral|vasto|coxa anterior|anterior da coxa/],
  ['aquiles', /aquiles|calcane[oa]? tend/], ['panturrilha', /pantur|gastroc|soleo|batata/], ['tornozelo', /tornoz|maleol/], ['joelho', /joelho|patela|menisco|lca|lcp|ligamento cruzado|ligamento colateral/],
  ['canela', /tibia|fibula|canela|perna/], ['gluteo', /glute/], ['virilha', /virilha|quadril|pubis|pubalgia|iliopsoas|inguinal/], ['lombar', /lombar|coluna lombar|lombo/],
  ['dorsal', /dorsal|costas|escapul|trapezio medio|grande dorsal/], ['abdomen', /abdom|obliqu|reto abdominal/], ['torax', /torax|peit|costela|esterno/], ['pescoco', /pescoco|cervical|trapezio/],
  ['cabeca', /cabeca|face|crani|nariz|olho|boca/], ['ombro', /ombro|deltoid|clavic|manguito/], ['antebraco', /antebraco|cotovelo|braquiorrad/], ['mao', /mao|punho|dedo|polegar/], ['braco', /braco|biceps|triceps|umero/], ['pe', /\bpe\b|pes|calcanhar|metatars|halux|dedo do pe/], ['quadriceps', /coxa/]
];
function mapRegiao(v) { const s = nrmName(v); if (!s) return ''; for (const [k] of REG_SYN) if (nrm(regN(k)) === nrm(v) || k === nrm(v)) return k; for (const [k, re] of REG_SYN) if (re.test(s)) return k; return ''; }
function mapLado(v, ctx) { const s = nrm(v); if (/^(d|dir|direit|dto|r$|right)/.test(s)) return 'D'; if (/^(e|esq|esquerd|l$|left)/.test(s)) return 'E'; const c = nrmName(ctx); if (/\bdireit|\(d\)|\bdir\b|\bd$|\bdto\b/.test(c)) return 'D'; if (/\besquerd|\(e\)|\besq\b|\be$/.test(c)) return 'E'; return ''; }
function mapStatus(v) { const s = nrm(v); if (!s) return ''; if (/libera|alta|apto|recuperad/.test(s)) return 'liberado'; if (/gradual|retorno/.test(s)) return 'retorno'; if (/transi/.test(s)) return 'transicao'; if (/trat|dm|ativ|fisio/.test(s)) return 'tratamento'; return ''; }
const mapBool = v => /^(s|sim|x|1|true|yes)/.test(nrm(v));
function mapTipo(v) { const s = nrm(v); if (!s) return ''; const hit = S.config.tipos.find(t => nrm(t) === s) || S.config.tipos.find(t => s.includes(nrm(t).slice(0, 6))); if (hit) return hit; if (/distens/.test(s)) return 'Distensão Muscular'; if (/estira/.test(s)) return 'Estiramento'; if (/ruptura|rotura/.test(s)) return /lig/.test(s) ? 'Ruptura Ligamentar' : 'Ruptura Muscular'; if (/sobrecarga|fadiga/.test(s)) return 'Sobrecarga Muscular'; if (/entorse|torcao/.test(s)) return 'Entorse'; if (/contus|pancada|trauma/.test(s)) return 'Contusão'; if (/tendin|tendino/.test(s)) return 'Tendinite'; if (/fratur/.test(s)) return 'Fratura'; if (/luxa/.test(s)) return 'Luxação'; return String(v).trim(); }
function mapGrau(v) { const m = String(v ?? '').match(/[123]/); return m ? 'Grau ' + m[0] : '—'; }
function mapLocal(v) { const s = nrm(v); if (/jogo|partida|competi/.test(s)) return 'Jogo'; if (/trein/.test(s)) return 'Treino'; if (s) return 'Fora do clube'; return ''; }
function findMusc(reg, lado, txt) { const s = nrm(txt); if (!s || !reg) return ''; const c = SEGS.filter(sg => sg[0] === reg && (!lado || !sg[1] || sg[1] === lado)); const h = c.find(sg => nrm(sg[2]) === s) || c.find(sg => s.includes(nrm(sg[2]))) || c.find(sg => s.length > 5 && s.includes(nrm(sg[2]).slice(0, 7))); return h ? h[2] : ''; }

function headerMap(hdr, alias) {
  const map = {}; hdr.forEach((h, i) => { const n = nrm(h); if (!n) return; for (const [f, list] of Object.entries(alias)) { if (map[f] !== undefined) continue; if (list.includes(n)) { map[f] = i; return; } } });
  hdr.forEach((h, i) => { const n = nrm(h); if (!n || Object.values(map).includes(i)) return; for (const [f, list] of Object.entries(alias)) { if (map[f] !== undefined) continue; if (list.some(a => a.length > 3 && n.startsWith(a))) { map[f] = i; return; } } });
  return map;
}
function findAtleta(nome) {
  const n = nrmName(nome); if (!n) return null;
  let a = S.atletas.find(x => nrmName(x.nome) === n || (x.apelido && nrmName(x.apelido) === n)); if (a) return a;
  const p = n.split(' '); if (p.length >= 2) a = S.atletas.find(x => { const q = nrmName(x.nome).split(' '); return q[0] === p[0] && q[q.length - 1] === p[p.length - 1]; });
  return a || null;
}

function analisar() {
  const I = IMP, sh = I.sheets[I.sheet]; if (!sh) return;
  const alias = I.tipo === 'atletas' ? ALIAS_ATL : ALIAS_LES;
  // procura a linha de cabeçalho nas 10 primeiras linhas
  let hi = 0, best = -1; for (let r = 0; r < Math.min(10, sh.rows.length); r++) { const n = Object.keys(headerMap(sh.rows[r], alias)).length; if (n > best) { best = n; hi = r; } }
  const hdr = sh.rows[hi] || [], map = headerMap(hdr, alias);
  const falta = REQ[I.tipo].filter(f => map[f] === undefined);
  const out = [];
  const g = (row, f) => map[f] === undefined ? '' : row[map[f]];
  const novosAtl = new Map();
  for (const row of sh.rows.slice(hi + 1)) {
    if (!row.some(c => String(c ?? '').trim() !== '')) continue;
    if (I.tipo === 'atletas') {
      const nome = String(g(row, 'nome') ?? '').trim(); if (!nome) { out.push({ err: 'Sem nome', raw: row }); continue; }
      const nasc = parseDate(g(row, 'nascimento')); const c = mapCat(g(row, 'subcategoria') || g(row, 'categoria'), nasc); const pos = mapPos(g(row, 'posicao')) || I.opts.posicao;
      let alt = numOr(g(row, 'altura')); if (alt && alt > 3) alt = alt / 100;
      const ex = findAtleta(nome);
      const o = { ...(ex || {}), id: ex ? ex.id : uid('a'), nome, apelido: String(g(row, 'apelido') ?? '').trim() || ex?.apelido || '', numero: String(g(row, 'numero') ?? '').trim() || ex?.numero || '', nascimento: nasc || ex?.nascimento || '', categoria: c.cat || ex?.categoria || I.opts.categoria, subcategoria: c.sub || ex?.subcategoria || '', posicao: pos, posDetalhe: String(g(row, 'posDetalhe') ?? '').trim() || (POSDET[pos] || []).find(x => nrm(x) === nrm(g(row, 'posicao'))) || ex?.posDetalhe || (POSDET[pos] || [''])[0], pe: mapPe(g(row, 'pe')) || ex?.pe || 'Direito', altura: alt ? String(alt) : ex?.altura || '', peso: numOr(g(row, 'peso')) !== '' ? String(numOr(g(row, 'peso'))) : ex?.peso || '' };
      if (!o.subcategoria && o.nascimento) { const q = subPorIdade(o.nascimento, S.config.anoBase); if (q.cat === o.categoria) o.subcategoria = q.sub; }
      out.push({ obj: o, acao: ex ? 'atualiza' : 'novo' });
    } else {
      const nome = String(g(row, 'atleta') ?? '').trim(), data = parseDate(g(row, 'data'));
      const regTxt = String(g(row, 'regiao') ?? ''), reg = mapRegiao(regTxt);
      const errs = []; if (!nome) errs.push('sem atleta'); if (!data) errs.push('data inválida'); if (!reg) errs.push(regTxt ? `região “${regTxt}” não reconhecida` : 'sem região');
      if (errs.length) { out.push({ err: errs.join(', '), raw: row, nome }); continue; }
      let a = findAtleta(nome), criado = false;
      if (!a) { const k = nrmName(nome); if (!I.opts.criar) { out.push({ err: `atleta “${nome}” não cadastrado`, raw: row, nome }); continue; } a = novosAtl.get(k); if (!a) { a = { id: uid('a'), nome, apelido: '', numero: '', nascimento: '', categoria: I.opts.categoria, subcategoria: '', posicao: I.opts.posicao, posDetalhe: (POSDET[I.opts.posicao] || [''])[0], pe: 'Direito', altura: '', peso: '' }; novosAtl.set(k, a); } criado = true; }
      let lado = mapLado(g(row, 'lado'), regTxt); if (!REG[reg][2] && !/^(d|e)/.test(nrm(g(row, 'lado')))) lado = lado || '';
      const musc = findMusc(reg, lado, g(row, 'musculo') || regTxt);
      const dias = numOr(g(row, 'dias')); let prev = parseDate(g(row, 'previsao')); if (!prev && dias !== '') prev = addDays(data, Math.round(dias));
      let st = mapStatus(g(row, 'status')); if (!st) st = prev && prev < todayISO() ? 'liberado' : 'tratamento';
      const sd = { tratamento: data }; if (st !== 'tratamento') { ORDER.slice(1, ORDER.indexOf(st) + 1).forEach(s2 => sd[s2] = s2 === 'liberado' ? (prev && prev <= todayISO() ? prev : todayISO()) : (prev && prev <= todayISO() ? prev : todayISO())); }
      const trat = String(g(row, 'tratamentos') ?? '').split(/[;,\/\n]+/).map(t => t.trim()).filter(Boolean).map(t => S.config.condutas.find(c => nrm(c) === nrm(t)) || t);
      const dup = S.lesoes.find(l => l.atletaId === a.id && l.data === data && l.regiao === reg && (l.lado || '') === lado);
      const o = { ...(dup || {}), id: dup ? dup.id : uid('l'), atletaId: a.id, data, local: mapLocal(g(row, 'local')) || 'Treino', mecanismo: String(g(row, 'mecanismo') ?? '').trim() || 'Outro', responsavel: String(g(row, 'responsavel') ?? '').trim(), tipo: mapTipo(g(row, 'tipo')) || 'Outros', grau: mapGrau(g(row, 'grau')), regiao: reg, lado, musculo: musc, dor: numOr(g(row, 'dor')) !== '' ? Math.max(0, Math.min(10, Math.round(numOr(g(row, 'dor'))))) : 5, descricao: String(g(row, 'descricao') ?? '').trim(), exames: String(g(row, 'exames') ?? '').trim(), tratamentos: trat, previsao: prev, status: st, statusDatas: sd, cirurgia: mapBool(g(row, 'cirurgia')), recorrente: mapBool(g(row, 'recorrente')), obs: String(g(row, 'obs') ?? '').trim(), criadoEm: todayISO() };
      if (REG[reg][2] && !lado) { out.push({ err: 'sem lado (direito/esquerdo)', raw: row, nome }); continue; }
      out.push({ obj: o, atleta: a, criado, acao: dup ? 'atualiza' : 'novo' });
    }
  }
  I.res = { hdr, map, falta, out, novosAtl: [...novosAtl.values()] };
}

async function lerArquivo(file) {
  IMP.file = file.name; IMP.sheets = null; IMP.res = null; IMP.busy = true; render();
  try {
    if (/\.json$/i.test(file.name)) {
      const j = JSON.parse(await file.text());
      const atls = Array.isArray(j.atletas) ? j.atletas : Array.isArray(j) ? j : null;
      if (!atls) throw new Error('json');
      IMP.tipo = 'atletas';
      const hdr = ['nome', 'apelido', 'numero', 'nascimento', 'categoria', 'subcategoria', 'posicao', 'funcao', 'pe', 'altura', 'peso'];
      IMP.sheets = [{ name: j.sistema || 'Backup', rows: [hdr, ...atls.map(a => [a.nome, a.apelido, a.numero, a.nascimento, a.categoria, a.subcategoria, a.posicao, a.posDetalhe, a.pe, a.altura, a.peso])], fotos: atls.map(a => a.foto || '') }];
      if (Array.isArray(j.lesoes) && j.lesoes.length) toast('Este é um backup do DM: use Configurações → Restaurar backup para trazer as lesões.', false);
    } else {
      await loadLib('xlsx');
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true });
      IMP.sheets = wb.SheetNames.map(n => ({ name: n, rows: XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: '', raw: true }) })).filter(s => s.rows.length);
      if (!IMP.sheets.length) throw new Error('vazio');
    }
    IMP.sheet = 0; analisar();
  } catch (e) { console.warn(e); IMP.sheets = null; toast(e.message === 'json' ? 'Esse arquivo JSON não tem uma lista de atletas.' : 'Não consegui ler esse arquivo. Use Excel (.xlsx/.xls), CSV ou o backup .json da Minutagem.', true); }
  IMP.busy = false; render();
}

async function saveMany(col, objs) {
  if (!objs.length) return;
  const m = new Map(S[col].map(x => [x.id, x])); objs.forEach(o => m.set(o.id, o)); S[col] = [...m.values()];
  if (db) { for (let i = 0; i < objs.length; i += 20) { await Promise.all(objs.slice(i, i + 20).map(o => db.collection(col).doc(o.id).set(JSON.parse(JSON.stringify(o))).catch(dbErr))); } } else lsSave();
}
async function confirmarImport() {
  const R = IMP.res; if (!R) return; const ok = R.out.filter(x => x.obj);
  if (!ok.length) { toast('Nenhuma linha válida para importar.', true); return; }
  IMP.busy = true; render();
  try {
    if (IMP.tipo === 'atletas') {
      const fotos = IMP.sheets[IMP.sheet].fotos; if (fotos) ok.forEach((x, i) => { if (fotos[i] && !x.obj.foto) x.obj.foto = fotos[i]; });
      await saveMany('atletas', ok.map(x => x.obj));
      toast(`${ok.length} atleta(s) importado(s)`);
    } else {
      await saveMany('atletas', R.novosAtl);
      await saveMany('lesoes', ok.map(x => x.obj));
      toast(`${ok.length} lesão(ões) importada(s)${R.novosAtl.length ? ` · ${R.novosAtl.length} atleta(s) novo(s)` : ''}`);
    }
    IMP.sheets = null; IMP.res = null; IMP.file = null;
  } catch (e) { toast('Erro ao importar. Tente novamente.', true); }
  IMP.busy = false;
  go(IMP.tipo === 'atletas' ? 'atletas' : 'dm-lesionados');
}
async function baixarModelo(tipo) {
  const linhas = tipo === 'atletas'
    ? [['Nome', 'Apelido', 'Número', 'Nascimento', 'Categoria', 'Posição', 'Função', 'Pé dominante', 'Altura', 'Peso'], ['João da Silva', 'Joãozinho', '10', '15/03/2011', 'Sub-15', 'MEI', 'Meia Armador', 'Direito', '1,70', '60']]
    : [['Atleta', 'Data da lesão', 'Tipo de lesão', 'Grau', 'Região', 'Lado', 'Músculo', 'Onde aconteceu', 'Mecanismo', 'Dor', 'Dias afastado', 'Previsão de retorno', 'Status', 'Condutas', 'Exames', 'Descrição', 'Observações', 'Cirurgia', 'Recorrente', 'Responsável'],
       ['João da Silva', '12/09/2026', 'Distensão Muscular', '2', 'Posterior de Coxa', 'Direito', 'Bíceps femoral', 'Jogo', 'Corrida / Sprint', '7', '21', '', 'Em tratamento', 'Fisioterapia; Fortalecimento', 'Ultrassom', 'Dor súbita no sprint', '', 'Não', 'Não', (S.config.profissionais[0] || {}).nome || '']];
  const csv = '\ufeff' + linhas.map(r => r.map(c => /[;"\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c).join(';')).join('\r\n');
  try { const dl = window.claude && await window.claude.use('downloads'); if (!dl) { toast('O download não está disponível nesta visualização.', true); return; } await dl.save({ filename: `modelo-importacao-${tipo}.csv`, data: csv }); } catch (e) { if (e && e.code !== 'declined') toast('Não foi possível baixar o modelo.', true); }
}

function vImportar() {
  const I = IMP, R = I.res;
  const tabs = `<nav class="subtabs"><button data-go="atletas">Cadastro</button><button class="on" data-go="importar">Importar dados</button></nav>`;
  const tipoCard = (v, t, d, cols) => `<label class="rk"><input type="radio" name="impTipo" value="${v}" ${I.tipo === v ? 'checked' : ''}><span style="flex:1"><b>${t}</b><small>${d}</small><span class="cols">${cols.map(c => `<i class="${REQ[v].includes(c) ? 'req' : ''}">${FIELD_LABEL[c]}</i>`).join('')}</span></span></label>`;
  let prev = '';
  if (I.busy) prev = `<div class="mini-empty"><span class="spin" style="display:inline-block;border-top-color:var(--g500);border-color:var(--line);border-top-color:var(--g500)"></span><br>Processando…</div>`;
  else if (R) {
    const ok = R.out.filter(x => x.obj), nov = ok.filter(x => x.acao === 'novo').length, upd = ok.length - nov, bad = R.out.filter(x => x.err);
    const rec = Object.entries(R.map).map(([f, i]) => `<span class="mapc"><b>${esc(R.hdr[i])}</b> → ${FIELD_LABEL[f]}</span>`).join('');
    const rowsA = r => `<tr class="${r.err ? 'bad' : ''}"><td>${r.err ? `<span class="st st-tratamento">Erro</span>` : r.acao === 'novo' ? '<span class="st st-ok">Novo</span>' : '<span class="st st-liberado">Atualiza</span>'}</td>${r.obj ? `<td class="l"><b>${esc(r.obj.nome)}</b></td><td>${esc(r.obj.numero || '—')}</td><td>${ptag(r.obj.posicao)}</td><td>${esc(r.obj.categoria)}${r.obj.subcategoria ? ' · ' + esc(r.obj.subcategoria) : ''}</td><td>${fmtD(r.obj.nascimento)}</td><td>${esc(r.obj.pe)}</td><td>${r.obj.altura ? nf(r.obj.altura, 2) : '—'}</td><td>${esc(r.obj.peso || '—')}</td>` : `<td class="l" colspan="8" style="color:var(--red)">${esc(r.err)}</td>`}</tr>`;
    const rowsL = r => `<tr class="${r.err ? 'bad' : ''}"><td>${r.err ? `<span class="st st-tratamento">Erro</span>` : r.acao === 'novo' ? '<span class="st st-ok">Nova</span>' : '<span class="st st-liberado">Atualiza</span>'}</td>${r.obj ? `<td class="l"><b>${esc(r.atleta.nome)}</b>${r.criado ? ' <span class="subtag" style="background:#fff3cd;color:#8a6200;border-color:#f1d27a">novo atleta</span>' : ''}</td><td>${fmtD(r.obj.data)}</td><td class="l">${esc(lesNome(r.obj))}</td><td class="l">${esc(regLong(r.obj))}</td><td>${esc(r.obj.local)}</td><td>${diasFora(r.obj)}</td><td>${chip(r.obj.status)}</td><td>${fmtD(r.obj.previsao)}</td>` : `<td class="l">${esc(r.nome || '—')}</td><td class="l" colspan="7" style="color:var(--red)">${esc(r.err)}</td>`}</tr>`;
    prev = `${R.falta.length ? `<div class="warn">Não encontrei a(s) coluna(s) obrigatória(s): <b>${R.falta.map(f => FIELD_LABEL[f]).join(', ')}</b>. Confira o cabeçalho da planilha ou baixe o modelo.</div>` : ''}
      <div class="counters"><span><b>${ok.length}</b> prontos</span><span><b>${nov}</b> ${I.tipo === 'atletas' ? 'novos' : 'novas'}</span><span><b>${upd}</b> atualizam registros existentes</span>${I.tipo === 'lesoes' ? `<span><b>${R.novosAtl.length}</b> atleta(s) a cadastrar</span>` : ''}<span style="${bad.length ? 'color:var(--red);border-color:var(--red)' : ''}"><b>${bad.length}</b> com erro (serão ignorados)</span></div>
      <div class="mapline"><span class="muted">Colunas reconhecidas:</span> ${rec || '<span class="muted">nenhuma</span>'}</div>
      <div class="tbl-wrap" style="max-height:440px;overflow:auto;border:1px solid var(--line);border-radius:8px"><table class="t"><thead><tr><th>Situação</th>${I.tipo === 'atletas' ? '<th class="l">Nome</th><th>Nº</th><th>Pos.</th><th>Categoria</th><th>Nascimento</th><th>Pé</th><th>Altura</th><th>Peso</th>' : '<th class="l">Atleta</th><th>Data</th><th class="l">Lesão</th><th class="l">Região · ponto exato</th><th>Local</th><th>Dias</th><th>Status</th><th>Previsão</th>'}</tr></thead><tbody>${R.out.slice(0, 300).map(I.tipo === 'atletas' ? rowsA : rowsL).join('')}</tbody></table></div>
      ${R.out.length > 300 ? `<p class="muted" style="font-size:12.5px">Mostrando as primeiras 300 de ${R.out.length} linhas; todas serão importadas.</p>` : ''}
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px;flex-wrap:wrap"><button class="btn" data-act="imp-cancel">Cancelar</button><button class="btn pri" data-act="imp-ok" ${ok.length && !R.falta.length ? '' : 'disabled'}>${IC.check} Importar ${ok.length} ${I.tipo === 'atletas' ? 'atleta(s)' : 'lesão(ões)'}</button></div>`;
  } else prev = `<div class="mini-empty">Escolha um arquivo no passo 2 para ver a prévia aqui.</div>`;
  return `<div class="page-h"><h2>Atletas</h2><span class="muted">Importar dados de planilhas</span></div>${tabs}
  <div class="row r2" style="align-items:start">
    ${panel('1 · O que você quer importar?', `<div class="rk-list">
      ${tipoCard('atletas', 'Atletas', 'Cadastro do elenco. Atletas que já existem (mesmo nome) são atualizados. Aceita também o backup .json do Sistema de Minutagem.', ['nome', 'apelido', 'numero', 'nascimento', 'categoria', 'posicao', 'pe', 'altura', 'peso'])}
      ${tipoCard('lesoes', 'Lesões', 'Histórico de lesões do DM. O atleta é encontrado pelo nome; região e lado são reconhecidos pelo texto (ex.: “Posterior de coxa D”).', ['atleta', 'data', 'regiao', 'lado', 'tipo', 'grau', 'musculo', 'local', 'dias', 'previsao', 'status', 'tratamentos'])}
    </div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn sm" data-act="imp-modelo" data-t="atletas">${IC.down} Modelo de atletas (.csv)</button><button class="btn sm" data-act="imp-modelo" data-t="lesoes">${IC.down} Modelo de lesões (.csv)</button></div><p class="muted" style="font-size:12.5px;margin:10px 0 0">Colunas em verde são obrigatórias. Os nomes das colunas podem variar; o sistema reconhece os mais comuns.</p>`)}
    ${panel('2 · Escolha o arquivo', `<label class="drop" id="dropZone">${IC.upload}<b>${I.file ? esc(I.file) : 'Clique para escolher ou arraste o arquivo aqui'}</b><span>Excel (.xlsx, .xls), CSV${I.tipo === 'atletas' ? ' ou backup .json da Minutagem' : ''}</span><input type="file" id="impFile" accept=".xlsx,.xls,.csv,.json" hidden></label>
      ${I.sheets && I.sheets.length > 1 ? `<div class="f" style="margin-top:12px"><label for="impSheet">Aba da planilha</label><select id="impSheet">${I.sheets.map((s, i) => `<option value="${i}" ${i === I.sheet ? 'selected' : ''}>${esc(s.name)} (${s.rows.length} linhas)</option>`).join('')}</select></div>` : ''}
      <div class="form" style="grid-template-columns:1fr 1fr;margin-top:12px">
        <div class="f"><label for="impCat">Categoria quando não houver</label><select id="impCat">${opts(Object.keys(GRUPOS), I.opts.categoria)}</select></div>
        <div class="f"><label for="impPos">Posição quando não houver</label><select id="impPos">${POS.map(p => `<option value="${p}" ${p === I.opts.posicao ? 'selected' : ''}>${p} · ${POSN[p]}</option>`).join('')}</select></div>
        ${I.tipo === 'lesoes' ? `<label class="chk f s2" style="text-transform:none;letter-spacing:0;font-size:14px;color:var(--ink)"><input type="checkbox" id="impCriar" ${I.opts.criar ? 'checked' : ''}>Cadastrar automaticamente atletas que ainda não existem</label>` : ''}
      </div>`)}
  </div>
  ${panel('3 · Confira antes de importar', prev)}`;
}
document.addEventListener('change', e => {
  const t = e.target;
  if (t.name === 'impTipo') { IMP.tipo = t.value; if (IMP.sheets) analisar(); render(); }
  if (t.id === 'impFile' && t.files[0]) lerArquivo(t.files[0]);
  if (t.id === 'impSheet') { IMP.sheet = +t.value; analisar(); render(); }
  if (t.id === 'impCat') { IMP.opts.categoria = t.value; if (IMP.sheets) analisar(); render(); }
  if (t.id === 'impPos') { IMP.opts.posicao = t.value; if (IMP.sheets) analisar(); render(); }
  if (t.id === 'impCriar') { IMP.opts.criar = t.checked; if (IMP.sheets) analisar(); render(); }
});
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'imp-ok') confirmarImport();
  if (t.dataset.act === 'imp-cancel') { IMP.sheets = null; IMP.res = null; IMP.file = null; render(); }
  if (t.dataset.act === 'imp-modelo') baixarModelo(t.dataset.t);
  if (t.dataset.act === 'imp-lesoes') { closeModal(); IMP.tipo = 'lesoes'; go('importar'); }
});
document.addEventListener('dragover', e => { const z = e.target.closest && e.target.closest('#dropZone'); if (z) { e.preventDefault(); z.classList.add('over'); } });
document.addEventListener('dragleave', e => { const z = e.target.closest && e.target.closest('#dropZone'); if (z) z.classList.remove('over'); });
document.addEventListener('drop', e => { const z = e.target.closest && e.target.closest('#dropZone'); if (z) { e.preventDefault(); z.classList.remove('over'); const f = e.dataTransfer.files[0]; if (f) lerArquivo(f); } });
