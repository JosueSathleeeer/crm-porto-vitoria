// Uso: npm run reset-senha-admin -- <login> <nova-senha>
// Redefine a senha de um usuário (ex.: quando o administrador esquecer a senha). Rode com o servidor parado.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const DB = require('./db');
(async () => {
  const [login, senha] = process.argv.slice(2);
  if (!login || !senha || senha.length < 8) { console.log('Uso: npm run reset-senha-admin -- <login> <nova-senha (mín. 8)>'); process.exit(1); }
  await DB.abrir();
  const u = DB.um('SELECT id FROM usuarios WHERE login = ?', [login.toLowerCase()]);
  if (!u) { console.log('Usuário não encontrado:', login); process.exit(1); }
  DB.exec('UPDATE usuarios SET senha_hash = ?, trocar_senha = 1, tentativas = 0, bloqueado_ate = NULL, ativo = 1, token_versao = token_versao + 1 WHERE id = ?', [bcrypt.hashSync(senha, 10), u.id]);
  DB.gravarAgora(); console.log('Senha redefinida para', login, '(será pedida a troca no próximo acesso)'); process.exit(0);
})();
