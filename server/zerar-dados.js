// Script para zerar todos os dados do Porto Vitória CRM
// Limpa coleções, documentos, auditorias e reseta usuários para o estado inicial de fábrica
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const DB = require('./db');
const { DEPARTAMENTOS_PADRAO } = require('./permissoes');

async function zerar() {
  await DB.abrir();

  // 1. Fazer backup de segurança antes de zerar
  const backupPath = DB.backupAgora();
  console.log('✔ Backup de segurança criado em:', backupPath);

  // 2. Limpar todos os documentos (atletas, lesões, avaliações, testes, bem-estar, PSE, minutagem, jogos, etc.)
  const totalDocs = DB.um('SELECT count(*) as total FROM documentos').total;
  DB.exec('DELETE FROM documentos');
  console.log(`✔ Tabela documentos limpa (${totalDocs} registros removidos)`);

  // 3. Limpar logs de auditoria
  const totalAud = DB.um('SELECT count(*) as total FROM auditoria').total;
  DB.exec('DELETE FROM auditoria');
  console.log(`✔ Tabela auditoria limpa (${totalAud} registros removidos)`);

  // 4. Limpar e recriar departamentos padrão
  DB.exec('DELETE FROM departamentos');
  DEPARTAMENTOS_PADRAO.forEach(d => {
    DB.exec('INSERT INTO departamentos (id, nome, descricao, colecoes_escrita, ativo) VALUES (?,?,?,?,1)', [
      d.id,
      d.nome,
      d.descricao,
      JSON.stringify(d.colecoes)
    ]);
  });
  console.log(`✔ Departamentos resetados para o padrão de fábrica (${DEPARTAMENTOS_PADRAO.length} departamentos)`);

  // 5. Resetar usuários: manter somente o administrador 'igor' com senha 'porto2026'
  DB.exec("DELETE FROM usuarios WHERE papel != 'admin' OR login != 'igor'");
  const adminExiste = DB.um("SELECT id FROM usuarios WHERE login = 'igor'");
  const agora = new Date().toISOString();
  const senhaHash = bcrypt.hashSync('porto2026', 10);

  if (adminExiste) {
    DB.exec(
      "UPDATE usuarios SET nome = 'Igor Sathler', senha_hash = ?, papel = 'admin', departamento_id = 'preparacao_fisica', funcao = 'Fisiologista', ativo = 1, trocar_senha = 0, token_versao = token_versao + 1, tentativas = 0, bloqueado_ate = NULL WHERE id = ?",
      [senhaHash, adminExiste.id]
    );
  } else {
    DB.exec(
      "INSERT INTO usuarios (id, nome, login, senha_hash, papel, departamento_id, funcao, ativo, trocar_senha, token_versao, tentativas, criado_em) VALUES (?,?,?,?,?,?,?,1,0,1,0,?)",
      ['u_admin_master', 'Igor Sathler', 'igor', senhaHash, 'admin', 'preparacao_fisica', 'Fisiologista', agora]
    );
  }
  console.log("✔ Usuário administrador resetado: login 'igor' / senha 'porto2026'");

  // 6. Gravar alterações imediatamente
  DB.gravarAgora();
  console.log('✔ Banco de dados porto-vitoria.db 100% zerado e salvo com sucesso!');
}

zerar().catch(err => {
  console.error('Erro ao zerar dados:', err);
  process.exit(1);
});
