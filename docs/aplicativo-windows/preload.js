// Porto Vitória · banco de dados local do aplicativo
// Imita a API de banco do sistema (collection/doc/set/delete/onSnapshot) e grava tudo em arquivos .json
const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

const DIR = ipcRenderer.sendSync('pv:data-dir');
const DB_DIR = path.join(DIR, 'banco');
fs.mkdirSync(DB_DIR, { recursive: true });

const mem = {};            // { colecao: { id: objeto } }
const subsCol = {};        // { colecao: [callback] }
const subsDoc = {};        // { 'colecao/id': [callback] }
const timers = {};

const arq = c => path.join(DB_DIR, c.replace(/[^a-z0-9_-]/gi, '_') + '.json');
function carregar(c) {
  if (mem[c]) return mem[c];
  try { mem[c] = JSON.parse(fs.readFileSync(arq(c), 'utf8')); } catch (e) { mem[c] = {}; }
  return mem[c];
}
function gravarAgora(c) {
  clearTimeout(timers[c]); delete timers[c];
  const tmp = arq(c) + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(mem[c] || {}));
  fs.renameSync(tmp, arq(c));
}
function gravar(c) { clearTimeout(timers[c]); timers[c] = setTimeout(() => { try { gravarAgora(c); } catch (e) { console.error(e); } }, 150); }
function gravarTudo() { Object.keys(timers).forEach(c => { try { gravarAgora(c); } catch (e) { } }); }
window.addEventListener('beforeunload', gravarTudo);
ipcRenderer.on('pv:flush', () => { gravarTudo(); ipcRenderer.send('pv:flushed'); });

const clone = o => JSON.parse(JSON.stringify(o));
const snapCol = c => { const m = carregar(c); return { size: Object.keys(m).length, empty: !Object.keys(m).length, docs: Object.entries(m).map(([id, v]) => ({ id, exists: true, data: () => clone(v) })) }; };
const snapDoc = (c, id) => { const v = carregar(c)[id]; return { id, exists: v !== undefined, data: () => (v === undefined ? undefined : clone(v)) }; };
function avisar(c, id) {
  queueMicrotask(() => {
    (subsCol[c] || []).forEach(cb => { try { cb(snapCol(c)); } catch (e) { console.error(e); } });
    (subsDoc[c + '/' + id] || []).forEach(cb => { try { cb(snapDoc(c, id)); } catch (e) { console.error(e); } });
  });
}
function docRef(c, id) {
  return {
    id,
    async set(obj) { carregar(c)[id] = clone(obj); gravar(c); avisar(c, id); },
    async update(obj) { const m = carregar(c); m[id] = { ...(m[id] || {}), ...clone(obj) }; gravar(c); avisar(c, id); },
    async delete() { delete carregar(c)[id]; gravar(c); avisar(c, id); },
    async get() { return snapDoc(c, id); },
    onSnapshot(cb) { const k = c + '/' + id; (subsDoc[k] = subsDoc[k] || []).push(cb); queueMicrotask(() => cb(snapDoc(c, id))); return () => { subsDoc[k] = subsDoc[k].filter(x => x !== cb); }; }
  };
}
const db = {
  collection(c) {
    return {
      doc: id => docRef(c, id),
      async get() { return snapCol(c); },
      onSnapshot(cb) { (subsCol[c] = subsCol[c] || []).push(cb); queueMicrotask(() => cb(snapCol(c))); return () => { subsCol[c] = subsCol[c].filter(x => x !== cb); }; }
    };
  },
  doc(p) { const [c, id] = String(p).split('/'); return docRef(c, id); }
};

// salvar arquivos (PDF, Excel, modelos) com a janela "Salvar como"
const downloads = {
  async save({ filename, data }) {
    let buf;
    if (typeof data === 'string') buf = Buffer.from(data, 'utf8');
    else if (data instanceof Blob) buf = Buffer.from(await data.arrayBuffer());
    else if (data instanceof ArrayBuffer) buf = Buffer.from(data);
    else if (ArrayBuffer.isView(data)) buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
    else buf = Buffer.from(String(data));
    const destino = await ipcRenderer.invoke('pv:save-dialog', filename);
    if (!destino) { const e = new Error('cancelled'); e.code = 'cancelled'; throw e; }
    fs.writeFileSync(destino, buf);
    ipcRenderer.send('pv:saved', destino);
  }
};

window.claude = { desktop: true, async use(cap) { if (cap === 'db') return db; if (cap === 'downloads') return downloads; return null; } };

// importar o backup .json do sistema web (Configurações → Geral → Exportar → Backup completo)
ipcRenderer.on('pv:import', (ev, texto) => {
  try {
    const o = JSON.parse(texto); let n = 0;
    const cols = ['atletas', 'lesoes', 'avaliacoes', 'hidratacao', 'testes', 'maturacao', 'bemestar', 'pse', 'micro', 'planos', 'macro', 'jogos', 'energia'];
    cols.forEach(c => { if (!Array.isArray(o[c])) return; const m = carregar(c); o[c].forEach(x => { if (x && x.id) { const { id, ...resto } = x; m[id] = c === 'jogos' ? resto : x; n++; } }); gravarAgora(c); });
    if (o.config && typeof o.config === 'object') { carregar('config').dm = o.config; gravarAgora('config'); }
    ipcRenderer.send('pv:imported', n);
  } catch (e) { ipcRenderer.send('pv:imported', -1); }
});
