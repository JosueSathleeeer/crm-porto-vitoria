# Arquitetura · Porto Vitória Performance Hub (CRM)

Leia este arquivo antes de alterar o projeto. Ele explica como as partes se encaixam.

## 1. Visão geral

```
Navegador (computador ou celular)
  ├── /login, /atleta, /admin  → páginas próprias (HTML + JS simples)
  └── /app                     → interface completa (app.html + js/app.js)
          │  js/server-shim.js oferece "window.claude.use('db')" com collection/doc/set/delete/onSnapshot
          ▼
Servidor Node/Express (server/index.js)
  ├── /api/auth/*      login (cookie httpOnly com JWT), sair, trocar senha, quem sou
  ├── /api/db/:col     ler (GET), salvar (PUT /:id), excluir (DELETE /:id) — com permissões
  ├── /api/stream      tempo real (Server-Sent Events): avisa os outros aparelhos a cada alteração
  └── /api/admin/*     usuários, departamentos, auditoria, resumo, backup
          ▼
Banco SQLite embutido (server/db.js → data/porto-vitoria.db)
```

## 2. Banco de dados (tabelas)

- **usuarios**: id, nome, login (único), email, senha_hash (bcrypt), papel (admin|gestor|funcionario|atleta), departamento_id, atleta_id, funcao, ativo, trocar_senha, token_versao (invalida sessões ao trocar senha/perfil), tentativas, bloqueado_ate, criado_em, ultimo_acesso.
- **departamentos**: id, nome, descricao, colecoes_escrita (JSON com as coleções que pode alterar), ativo.
- **documentos**: (colecao, id) chave; dados (JSON do registro); atualizado_em; atualizado_por. Todos os registros do sistema ficam aqui, separados por coleção.
- **auditoria**: quando, usuario, acao (login, login_falhou, criar, alterar, excluir, trocar_senha, admin_*, backup), colecao, doc_id, detalhe, ip.

### Coleções (campos principais de cada registro)

| Coleção | Campos |
|---|---|
| atletas | nome, apelido, numero, nascimento, categoria, subcategoria, posicao (GOL, LAT, ZAG, VOL, MEI, ATA, EXT), posDetalhe, pe, altura (m), peso (kg), gordura, foto, lado (D/E), grupo (G1–G4), alojado |
| lesoes | atletaId, data, tipo, grau, regiao, lado, local, segs, mecanismo, dor, status (tratamento, transicao, retorno, liberado), statusDatas, previsao, tratamentos, exames, recorrente, obs |
| avaliacoes | atletaId, data, peso, altura, protocolo (faulkner), dobras {triceps, subescapular, suprailiaca, abdominal}, avaliador, obs |
| hidratacao | data, tipo, duracao, temp, umidade, categoria, registros [{atletaId, pre, pos, ingerido, urina, cor}] |
| energia | atletaId, data, peso, altura, gordura, formula, fa, extra, ptn, lipPct, agua, tmb, get, obs |
| testes | atletaId, data, cmj_1..3, ift, v10_1..3, v30_1..3, t505d_1..2, t505e_1..2 |
| maturacao | atletaId, data, altura (cm), alturaSentado, peso, alturaPai, alturaMae |
| bemestar | atletaId, data, origem, treinaHoje, motivo, dor, escalaDor, localDor, dorSegs, sono, fadiga, recuperacao, estresse, humor, urina |
| pse | atletaId, data, sessao, sessaoId, pse (0–10), duracao (min), origem |
| micro | categoria, data, hora, tipo, titulo, duracao, pse, conteudo, adversario, mando, competicao |
| macro | categoria, tipo (periodo/meso/bloco), nome, inicio, fim, cor, objetivo |
| planos | data, categoria, local, microciclo, horario, titulo, blocos[...], material[...], obs |
| jogos | data, categoria, competicao, adversario, mando, golsPro, golsContra, relacionados [{atletaId, status, min, gols, assist}] |
| config | documento "dm" (configurações gerais: profissionais, faixas, agenda, capa, comissão técnica...) e "main" (Minutagem) |

> Para migrar para PostgreSQL/MySQL no futuro: troque as funções de `server/db.js` (listar, obter, salvar, excluir, auditar) mantendo a mesma assinatura. O resto do sistema não muda.

## 3. Permissões (server/permissoes.js)

- **Leitura**: funcionário, gestor e administrador leem todas as coleções. Atleta lê só `atletas` (o próprio), `bemestar` e `pse` (os próprios), `micro`, `jogos` (só os próprios minutos) e parte de `config`.
- **Escrita**: administrador e gestor alteram tudo; funcionário altera as coleções do seu departamento; atleta só cria/edita `bemestar` e `pse` com o próprio `atletaId`.
- A regra vale no **servidor** (a tela também esconde, mas quem decide é a API). Erros de permissão retornam 403 e a tela avisa "Seu perfil não tem permissão…".

## 4. Interface

- `public/app.html` é o sistema completo. O código foi gerado a partir dos módulos em `docs/fonte-modulos/` (um arquivo por área: `v2_part2.js` base e banco local, `v2_part3.js` DM e navegação, `v2_nutri.js`, `v2_aval*.js`, `v2_mon.js`, `v2_be.js`, `v2_carga*.js`, `v2_plan*.js`, `v2_cal.js`, `v2_mapa.js`, `v2_relx.js`, etc.).
- `public/js/app.js` = módulos já juntados. Imagens grandes (escudo, mapa corporal) e dados de exemplo ficam em `public/js/dados-base.js` (`PV_ASSETS`, `PV_DATA`).
- **Para alterar uma tela**: procure a função correspondente em `js/app.js` (os nomes são os mesmos dos módulos, ex.: `fMicro`, `relIndAv`, `vMapa`, `formPlano`). Cada módulo costuma "embrulhar" a função anterior (`const _x = x; x = function(){...}`), então a versão final de uma tela é a última definida no arquivo.
- Estilos: `public/css/app.css` (sistema) e `public/css/mobile.css` (celular, até 760 px de largura).
- `js/server-shim.js` substitui o banco do Claude pela API do servidor. Se criar uma nova coleção, inclua o nome em `COLECOES` (server/permissoes.js) e nas permissões dos departamentos.

## 5. Tempo real

Cada alteração salva é enviada pelo `/api/stream` para todos os aparelhos conectados (respeitando as permissões), e a tela se atualiza sozinha.

## 6. Fórmulas e regras

As fórmulas (Faulkner, Mirwald, Cunningham, ACWR, monotonia, strain, prontidão, bem-estar, faixas dos testes, regra do 505, alertas de minutagem) estão descritas em `docs/PROMPT-ANTIGRAVITY.md`, seção 7. **Não altere sem combinar com a preparação física.**
