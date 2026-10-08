# Segurança · Diretrizes, Implementações e Boas Práticas

## 1. O que já está implementado e ativo no sistema

### Autenticação & Sessão
- **Criptografia de senhas**: Hash com **bcrypt** (salt rounds = 10) e troca obrigatória no primeiro acesso.
- **Política de senhas**: Validação de complexidade no servidor e no cliente (mínimo de 8 caracteres, exigindo letras e números).
- **Proteção contra força bruta**: 
  - Rate limiting no login (máximo 30 tentativas por IP a cada 15 minutos).
  - Bloqueio temporário da conta por 10 minutos após 5 senhas consecutivas incorretas.
- **Sessões seguras**: Token JWT assinado com chave de alta entropia (`JWT_SECRET` com 96 caracteres hexadecimais), guardado em **cookie HttpOnly + SameSite=Lax**.
- **Invalidação imediata de sessões**: Campo `token_versao` invalida tokens ativos instantaneamente ao trocar senha, mudar de perfil ou desativar usuário.

### Proteção de Requisições & Headers (OWASP)
- **Proteção contra CSRF**: Token aleatório anti-CSRF emitido em cookie `pv_csrf` e validado via cabeçalho `X-CSRF-Token` em todas as operações de mutação (`POST`, `PUT`, `DELETE`).
- **Política de Segurança de Conteúdo (CSP) rígida**:
  - Scripts inline e `eval` desabilitados (`'unsafe-inline'` e `'unsafe-eval'` eliminados de `script-src`).
  - Todos os scripts foram modularizados em arquivos dedicados (`/js/login.js`, `/js/admin.js`, `/js/atleta-area.js`, `/js/theme-init.js`).
  - Atributos de script como `onclick` desabilitados na CSP (`script-src-attr: 'none'`).
- **Proteção contra Clickjacking e Framing**: `frame-ancestors: 'none'` e `X-Frame-Options: DENY`.
- **Prevenção de MIME Sniffing**: `X-Content-Type-Options: nosniff`.
- **Referrer Policy**: Restrito a `same-origin`.
- **Rate Limit na API**: Limite global de 600 requisições/minuto por IP para evitar ataques DoS/raspagem.

### Controle de Acesso e Integridade de Dados
- **Permissões baseadas em papel (RBAC)**:
  - `admin`: acesso irrestrito, gestão de credenciais, auditoria e backups.
  - `gestor`: consulta e alteração de todos os módulos de desempenho; visualização de auditoria.
  - `funcionario`: alteração estritamente restrita às coleções do seu departamento (`server/permissoes.js`).
  - `atleta`: isolamento rígido; só lê e responde aos próprios registros (`bemestar` e `pse`).
- **Validação e Sanitização no Servidor** (`server/validacao.js`):
  - Validação de campos e tipos por coleção.
  - Limite rigoroso de tamanho para uploads/fotos em base64 (máx. 2.5 MB).
  - Limite máximo de tamanho por registro (5 MB).
  - Sanitização de strings para evitar injeção de scripts persistentes.

### Privacidade & LGPD (Dados Sensíveis de Saúde)
- **Registro de consulta a prontuários e dados de saúde**: O servidor audita acessos a coleções sensíveis (`lesoes`, `avaliacoes`, `hidratacao`, `energia`).
- **Trilha de auditoria completa**: Registro em banco de todas as ações (`login`, `login_falhou`, `criar`, `alterar`, `excluir`, `backup`, `trocar_senha`, `consulta_saude`) com data/hora, ID do usuário, nome e IP.
- **Minimização de dados**: Atletas menores e comissão só têm acesso aos dados estritamente necessários para o desempenho desportivo.

### Banco de Dados e Backups
- **SQLite embutido** com isolamento local em `data/porto-vitoria.db`.
- **Backup automático diário**: Rotina periódica que guarda até 45 dias de histórico com rotação automática em `data/backups/`.
- **Backup manual**: Download sob demanda na área administrativa ou via CLI com `npm run backup`.
- **Recuperação de credencial**: CLI de redefinição de emergência `npm run reset-senha-admin -- <usuario> <novaSenha>`.

---

## 2. Recomendações para Ambiente de Produção

1. **HTTPS / TLS Obrigatório**:
   - Rodar atrás de um proxy reverso (Nginx, Caddy ou Traefik) com certificado SSL/TLS (ex.: Let's Encrypt).
   - Definir `COOKIE_SECURE=true` no arquivo `.env` para que os cookies de sessão trafeguem exclusivamente sob HTTPS com a flag `Secure`.
2. **Backups Externos (Nuvem / Off-site)**:
   - Sincronizar a pasta `data/backups` periodicamente com armazenamento em nuvem seguro (AWS S3, Google Cloud Storage ou rclone).
3. **Gerenciador de Processos**:
   - Em servidor Linux/Windows Server, rodar a aplicação através de `pm2` (`pm2 start server/index.js --name porto-hub`) para reinício automático e monitoramento de falhas.
4. **Termo de Consentimento LGPD**:
   - Para atletas das categorias de base (Sub-11 a Sub-17), manter o termo assinado pelos pais/responsáveis legais autorizando o tratamento de dados fisiológicos e de saúde para fins de acompanhamento esportivo.
