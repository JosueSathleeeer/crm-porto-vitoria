# Porto Vitória · Performance Hub (CRM)

Sistema do Departamento de Futebol de Base do Porto Vitória: atletas, fisioterapia/DM, nutrição, avaliação física e maturação, monitoramento (bem-estar e PSE), planejamento (macro, micro, plano de treino), calendário, jogos e minutagem, relatórios em PDF — com **banco de dados embutido**, **login com perfis** (administrador, gestor, funcionário por departamento e atleta) e **layout para celular**.

## Como rodar

Pré-requisito: **Node.js 18 ou mais novo** (https://nodejs.org).

```bash
npm install
npm start
```

Abra **http://localhost:3000**. No celular (mesma rede Wi-Fi), use o endereço "Na rede" que aparece no terminal, por exemplo `http://192.168.0.10:3000`.

**Primeiro acesso:** usuário `igor`, senha `porto2026`. O sistema obriga a trocar a senha.
Para carregar dados de exemplo, entre no sistema com o banco vazio e clique em "Carregar dados de exemplo" (ou use "Teste / limpar" em qualquer área).

Configurações em `.env` (copie de `.env.example`): porta, chave das sessões, validade da sessão, pasta do banco e usuário administrador inicial.

## Perfis (atores)

| Perfil | O que acessa |
|---|---|
| **Administrador** | Tudo, inclusive usuários, departamentos, auditoria e backup |
| **Gestor / Coordenação** | Lê e altera todos os módulos; vê usuários e auditoria |
| **Funcionário** | Lê todos os módulos e altera os do seu **departamento** |
| **Atleta** | Área do atleta no celular: responde bem-estar e PSE e vê só os próprios dados |

Departamentos padrão (editáveis em **/admin → Departamentos e permissões**): Diretoria (só consulta), Comissão técnica, Preparação física / Fisiologia, Fisioterapia / DM, Nutrição, Administrativo.

## Endereços

| Endereço | Página |
|---|---|
| `/login` | Entrar |
| `/app` | Sistema completo (funcionários, gestores, administrador) |
| `/atleta` | Área do atleta (celular) |
| `/formulario#form=bemestar` · `#form=pse` | Formulários do atleta |
| `/admin` | Usuários, departamentos, registro de alterações, banco de dados, trocar senha |

## Banco de dados

SQLite embutido (biblioteca `sql.js`, sem instalar servidor de banco). Arquivo: `data/porto-vitoria.db`.
Backup automático diário em `data/backups` (guarda 45). Backup manual: `npm run backup` ou em /admin → Banco de dados.
Esqueceu a senha do administrador? Pare o servidor e rode `npm run reset-senha-admin -- igor NovaSenha123`.

## Estrutura

```
server/            servidor Express (API, login, permissões, tempo real)
  index.js         rotas: /api/auth, /api/db/:colecao, /api/stream, /api/admin
  db.js            banco SQLite embutido (tabelas, gravação, backups, auditoria)
  permissoes.js    perfis, departamentos e regras de acesso
public/
  app.html         sistema completo (carrega css/app.css, js/dados-base.js, js/app.js)
  js/server-shim.js liga a interface ao banco do servidor (API + tempo real)
  js/mobile.js     barra inferior e menu completo no celular
  css/mobile.css   ajustes de layout para celular
  login.html, atleta.html, admin.html, css/portal.css
  libs/            bibliotecas de PDF e Excel (funciona sem internet)
docs/              arquitetura, segurança, prompt e código-fonte por módulo
```

Veja **docs/ARQUITETURA.md** para os detalhes e **docs/SEGURANCA.md** para os próximos passos de segurança.
