// Uso: npm run backup  → copia o banco para data/backups/<data-hora>.db
require('dotenv').config();
const DB = require('./db');
(async () => { await DB.abrir(); console.log('Backup criado em', DB.backupAgora()); process.exit(0); })();
