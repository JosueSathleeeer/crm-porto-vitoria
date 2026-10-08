// Porto Vitória · Performance Hub (aplicativo para Windows)
const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

app.setAppUserModelId('br.com.portovitoria.performancehub');
const DATA_DIR = path.join(app.getPath('documents'), 'Porto Vitória - Dados');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
fs.mkdirSync(path.join(DATA_DIR, 'banco'), { recursive: true });
fs.mkdirSync(BACKUP_DIR, { recursive: true });

let win;
if (!app.requestSingleInstanceLock()) { app.quit(); }
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

function copiarPasta(de, para) { fs.mkdirSync(para, { recursive: true }); for (const f of fs.readdirSync(de)) { const a = path.join(de, f); if (fs.statSync(a).isFile()) fs.copyFileSync(a, path.join(para, f)); } }
function backup(manual) {
  const nome = new Date().toISOString().slice(0, 10) + (manual ? '_' + new Date().toTimeString().slice(0, 8).replace(/:/g, '-') : '');
  const dest = path.join(BACKUP_DIR, nome);
  if (!manual && fs.existsSync(dest)) return null;
  copiarPasta(path.join(DATA_DIR, 'banco'), dest);
  const lista = fs.readdirSync(BACKUP_DIR).sort(); while (lista.length > 40) { fs.rmSync(path.join(BACKUP_DIR, lista.shift()), { recursive: true, force: true }); }
  return dest;
}
function atalhoAreaDeTrabalho() {
  if (process.platform !== 'win32') return;
  const flag = path.join(DATA_DIR, '.atalho-criado');
  if (fs.existsSync(flag)) return;
  try { shell.writeShortcutLink(path.join(app.getPath('desktop'), 'Porto Vitória.lnk'), 'create', { target: process.execPath, icon: process.execPath, iconIndex: 0, description: 'Porto Vitória · Performance Hub' }); fs.writeFileSync(flag, '1'); } catch (e) { }
}
async function importar() {
  const r = await dialog.showOpenDialog(win, { title: 'Importar backup do sistema web', filters: [{ name: 'Backup do sistema (.json)', extensions: ['json'] }], properties: ['openFile'] });
  if (r.canceled || !r.filePaths[0]) return;
  const ok = await dialog.showMessageBox(win, { type: 'question', buttons: ['Importar', 'Cancelar'], defaultId: 0, cancelId: 1, title: 'Importar backup', message: 'Importar os dados deste backup?', detail: 'Os registros com o mesmo código serão atualizados. Antes, é feita uma cópia de segurança automática.' });
  if (ok.response !== 0) return;
  backup(true); win.webContents.send('pv:import', fs.readFileSync(r.filePaths[0], 'utf8'));
}
function criarMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: 'Arquivo', submenu: [
      { label: 'Abrir pasta dos dados', click: () => shell.openPath(DATA_DIR) },
      { label: 'Fazer backup agora', click: () => { const d = backup(true); dialog.showMessageBox(win, { type: 'info', message: 'Backup feito', detail: d }); } },
      { label: 'Abrir pasta de backups', click: () => shell.openPath(BACKUP_DIR) },
      { label: 'Importar backup do sistema web (.json)…', click: importar },
      { type: 'separator' }, { label: 'Imprimir', accelerator: 'Ctrl+P', click: () => win.webContents.print() },
      { type: 'separator' }, { label: 'Sair', role: 'quit' }] },
    { label: 'Exibir', submenu: [{ label: 'Recarregar', role: 'reload' }, { label: 'Tela cheia', role: 'togglefullscreen' }, { type: 'separator' }, { label: 'Aumentar zoom', role: 'zoomIn' }, { label: 'Diminuir zoom', role: 'zoomOut' }, { label: 'Zoom normal', role: 'resetZoom' }] },
    { label: 'Ajuda', submenu: [{ label: 'Sobre', click: () => dialog.showMessageBox(win, { type: 'info', title: 'Porto Vitória', message: 'Porto Vitória · Performance Hub', detail: `Versão ${app.getVersion()}\nDados salvos em:\n${DATA_DIR}` }) }, { label: 'Ferramentas do desenvolvedor', role: 'toggleDevTools', visible: false }] }
  ]));
}
function criarJanela() {
  win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 1100, minHeight: 680, show: false, backgroundColor: '#022a0f', title: 'Porto Vitória · Performance Hub',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: false, nodeIntegration: false, sandbox: false, spellcheck: false }
  });
  win.once('ready-to-show', () => { win.maximize(); win.show(); });
  win.loadFile(path.join(__dirname, 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  let fechando = false;
  win.on('close', e => { if (fechando) return; e.preventDefault(); fechando = true; win.webContents.send('pv:flush'); setTimeout(() => win.destroy(), 1500); });
  ipcMain.once('pv:flushed', () => { if (fechando && win && !win.isDestroyed()) win.destroy(); });
}
ipcMain.on('pv:data-dir', e => { e.returnValue = DATA_DIR; });
ipcMain.handle('pv:save-dialog', async (e, nome) => { const r = await dialog.showSaveDialog(win, { title: 'Salvar arquivo', defaultPath: path.join(app.getPath('documents'), nome || 'arquivo') }); return r.canceled ? null : r.filePath; });
ipcMain.on('pv:saved', (e, p) => { shell.showItemInFolder(p); });
ipcMain.on('pv:imported', async (e, n) => { await dialog.showMessageBox(win, { type: n >= 0 ? 'info' : 'error', message: n >= 0 ? `${n} registro(s) importado(s).` : 'Não consegui ler esse arquivo de backup.' }); if (n >= 0) win.reload(); });
app.whenReady().then(() => { try { backup(false); } catch (e) { } atalhoAreaDeTrabalho(); criarMenu(); criarJanela(); });
app.on('window-all-closed', () => app.quit());
