# PROMPT PARA O ANTIGRAVITY — Integrar o "Porto Vitória · Performance Hub" ao meu sistema

> Copie tudo abaixo e cole no Antigravity. Junto com este arquivo, coloque na pasta do projeto a pasta `referencia-porto-vitoria/` com:
> - `SISTEMA-COMPLETO-referencia.html` (o sistema inteiro funcionando, em um arquivo só);
> - `modulos/` (o código-fonte separado por módulo);
> - `dados-e-imagens/` (escudo, dados de exemplo e o desenho dos 104 músculos do mapa corporal);
> - `aplicativo-windows/` (como o sistema virou um .exe com banco local).

---

## 0. Sua missão

Você vai **integrar ao meu sistema atual** um sistema completo de gestão de performance de futebol de base chamado **Porto Vitória · Performance Hub**. Ele já existe e funciona: a referência está em `referencia-porto-vitoria/SISTEMA-COMPLETO-referencia.html` (abra no navegador para ver) e o código separado está em `referencia-porto-vitoria/modulos/`.

Regras de trabalho:
1. **Antes de escrever código**, leia a estrutura do MEU projeto (linguagem, framework, banco de dados, autenticação, rotas, componentes, estilo) e me mostre um **plano de integração** em fases. Use a stack que eu já uso; não troque de framework.
2. Use o HTML de referência como **especificação visual e de regras**: telas, textos, cálculos, cores e relatórios devem ficar iguais. Pode reescrever o código no padrão do meu projeto (componentes, tipagem, banco de verdade), mas **não mude fórmulas, limites, nomes de campos de tela nem textos**, a não ser que eu peça.
3. Todo dado deve ser **salvo no banco de dados do meu sistema** (tabelas/coleções descritas na seção 4), com criação, edição e exclusão.
4. Trabalhe por fases (seção 12). Ao final de cada fase, rode, teste e me mostre o que ficou pronto.
5. Interface toda em **português do Brasil**, datas `dd/mm/aaaa`, números com vírgula decimal (aceitar vírgula ou ponto na digitação).

---

## 1. Visão geral

Sistema web (e opcionalmente aplicativo desktop) para o **Departamento de Futebol de Base do Porto Vitória**. Usuário principal: **Igor Sathler – Fisiologista / Preparador físico**. Usado por preparação física, fisioterapia (DM), nutrição e comissão técnica.

Áreas (menu lateral, nesta ordem):
1. **Início** — painel geral
2. **Notificações** — central de avisos (com contador vermelho no ícone)
3. **Calendário** — mês com treinos, jogos, avaliações, folgas e retornos do DM
4. **Atletas** — Cadastro · Mapa de jogadores · Importar dados (+ ficha individual)
5. **Jogos** — Painel · Cadastro · Relatórios PDF
6. **Minutagem** — Controle de carga (alertas) · Dashboard · Geral · Por jogo · Individual · Relatório atleta · Importar
7. **Fisio / DM** — Dashboard · Visão geral · Lesionados · Histórico · Regiões · Tempo de afastamento · Comparativo · Relatórios em PDF
8. **Nutrição** — Dashboard · Composição corporal · Comparativo · Individual · Hidratação · Necessidades energéticas · Relatórios em PDF
9. **Avaliação física** — Painel geral · Sessões de testes · Ranking e comparativo · Evolução individual · CMJ · 30-15 IFT · Velocidade 10 m · Velocidade 30 m · Agilidade 505 · Maturação · Relatórios em PDF
10. **Monitoramento** — Bem-estar (Dashboard · Histórico · Relatório do dia) · PSE (Dashboard do dia · Carga da semana · Relatórios em PDF)
11. **Planejamento** — Macrociclo · Microciclo · Plano de treino
12. Rodapé do menu: **Configurações**, **Tema claro/escuro**, **Sair**

Barra superior em todas as telas: título da área · filtros **Categoria**, **Sub(categoria)**, **Temporada**, **Período** · botões **Teste / limpar**, **Imprimir / PDF** e o botão de ação principal da tela (ex.: "Registrar lesão", "Nova avaliação", "Lançar PSE").

---

## 2. Identidade visual

- **Escudo**: `dados-e-imagens/escudo-porto-vitoria.png` (alta resolução, fundo transparente). Usar em cabeçalhos, capas, login, ícone do app.
- **Cores**: verde escuro `#062a17` / `#0d4f2b`, verde `#1b8a4a`, verde claro `#34b267`, **dourado `#f2b81b`**, vermelho alerta `#e0342b`, laranja `#f39324`, azul `#2f6fd6`, cinza texto `#4b5a52`, fundo claro `#eef2ef`.
- **Fontes**: títulos em fonte condensada forte (ex.: Barlow Condensed 800, maiúsculas); corpo em Barlow/Inter.
- **Cabeçalho de cada tela**: faixa verde com escudo, "PORTO VITÓRIA / DEPARTAMENTO DE FUTEBOL DE BASE / subtítulo da área", título grande centralizado, selo da categoria (ex.: SUB 15) e caixa com Temporada e "Atualizado em".
- **Painéis**: título em faixa verde escura com texto branco maiúsculo; cartões brancos, borda suave, cantos 10–14 px.
- **Indicadores (KPIs)**: ícone + rótulo maiúsculo + número grande + linha de apoio. Nunca cortar números; quebrar em menos colunas se faltar espaço.
- **Temas claro e escuro** (alternar no menu).
- **Planejamento** tem 3 temas de cor escolhíveis: **Verde Porto** (escuro), **Branco e verde**, **Verde claro**.
- Tudo responsivo; o menu lateral mostra submenus ao passar o mouse.

---

## 3. Filtros globais

- **Categoria**: Sub-11, Sub-13, Sub-15, Sub-17, Sub-20 (ou "Todas").
- **Subcategoria** por categoria: Sub-11 → Sub-10/Sub-11; Sub-13 → Sub-12/Sub-13; Sub-15 → Sub-14/Sub-15; Sub-17 → Sub-16/Sub-17; Sub-20 → Sub-18/Sub-19/Sub-20. Opção "Todas".
- **Temporada**: anos com dados ou "Todos".
- **Período**: Ano todo · 1º semestre · 2º semestre · Janeiro … Dezembro. Vale para lesões, nutrição, hidratação, testes, maturação, jogos/minutagem e ficha. Aparece nos cabeçalhos como "2026 · 1º SEM".
- Filtros ficam salvos no navegador.

---

## 4. Banco de dados (tabelas / coleções)

Todas com `id` (texto) e datas em `AAAA-MM-DD`. Marque registros de exemplo com `demo = true`.

| Tabela | Campos principais |
|---|---|
| **atletas** | nome, apelido, numero, nascimento, categoria, subcategoria, posicao (GOL, LAT, ZAG, VOL, MEI, ATA, EXT), posDetalhe (ex.: "Lateral Direito", "Ponta Esquerda", "Centroavante"), pe (Direito/Esquerdo/Ambidestro), altura (m), peso (kg), gordura (%), foto (imagem), lado (D/E, opcional), grupo (G1–G4), alojado (bool), criadoEm |
| **lesoes** | atletaId, data, tipo, grau, regiao, lado, local, segs (índices dos músculos do mapa corporal), mecanismo, dor (0–10), status (tratamento, transicao, retorno, liberado), statusDatas {status: data}, previsao, tratamentos [lista], exames, recorrente, obs |
| **avaliacoes** (composição corporal) | atletaId, data, peso, altura, protocolo ("faulkner" ou "manual"), dobras {triceps, subescapular, suprailiaca, abdominal}, gorduraManual, avaliador, obs |
| **hidratacao** | data, tipo (Treino/Jogo), duracao (min), temp, umidade, categoria, registros [{atletaId, pre, pos, ingerido (ml), urina (ml), cor (1–8)}] |
| **energia** | atletaId, data, peso, altura, gordura, formula (cunningham/schofield/harris/manual), tmbManual, fa (fator atividade), extra (kcal), ptn (g/kg), lipPct (%), agua (ml/kg), responsavel, obs, tmb, get |
| **testes** | atletaId, data, cmj_1, cmj_2, cmj_3, ift, v10_1..3, v30_1..3, t505d_1, t505d_2, t505e_1, t505e_2 (+ médias salvas cmj, v10, v30) |
| **maturacao** | atletaId, data, altura (cm), alturaSentado (cm), peso (kg), alturaPai, alturaMae |
| **bemestar** | atletaId, data, origem (app/manual/forms), treinaHoje (Sim/Não), motivo, dor (Normal/Dolorido/Muito dolorido), escalaDor (0–10), localDor (texto), dorSegs [{regiao, lado, musculo}], sono, fadiga, recuperacao, estresse, humor (textos das opções), urina (1–8), hora |
| **pse** | atletaId, data, sessao (Treino/Jogo/Treino físico/Recuperação), sessaoId (do microciclo), pse (0–10), duracao (min), origem |
| **micro** (sessões do microciclo / calendário) | categoria, data, hora, tipo (treino, tatico, forca, fisico, cond, veloc, matchprep, recup, aval, jogo, folga), titulo, duracao, pse (alvo), conteudo, adversario, mando (casa/fora), competicao |
| **macro** | categoria, tipo (periodo, meso, bloco), nome, inicio, fim, cor, objetivo |
| **planos** (plano de treino) | data, categoria, local, microciclo, horario, titulo, responsavel, blocos [{tipo (academia/campo), nome, metodo, duracao, campo, series, pse, grupo, objetivo, desenvolvimento, regras, coaching, variacoes, exercicios [{nome, series, cadencia, descanso, carga}], pad {campo (inteiro/meio/livre), objs [{t, x, y, s, r, c, n}], setas [{x1,y1,x2,y2,tipo}], area}}], material [{qtd, item}], obs |
| **jogos** (Minutagem) | data, categoria, competicao, adversario, mando, golsPro, golsContra, duracao, relacionados [{atletaId, status (T/R), min, gols, assist}] |
| **config** | profissionais [{nome, funcao}], bandas (faixas dos testes), faixaGordura, agenda [{id, data, teste, categoria}], beNotas {data: texto}, semanas {"cat|segunda": nome}, planTema, capa {depto, responsavel, slogan, titulos{dm,nut,av,mat,mon}}, comissao {categoria: {treinador, aux, prep, prepgol, fisio, massagista}}, usuarios [{u, nome, perfil, h (hash da senha)}], notifLidas [chaves] |

---

## 5. Telas e funções (o que cada área faz)

### 5.1 Login e abertura
- Tela **Carregando** (fundo verde, escudo pulsando, barra dourada) → tela de **login** (usuário e senha, "Manter conectado neste aparelho", mostrar senha, erro "Usuário ou senha incorretos").
- Primeiro acesso: usuário `igor`, senha `porto2026` (obrigar troca depois).
- **Configurações → Usuários e senhas**: criar usuário (nome, usuário, perfil: Administrador, Preparação física, Fisioterapia, Nutrição, Comissão técnica), trocar senha, remover. **Use o login real do meu sistema se já existir** (senhas com hash forte no servidor).
- Os links dos formulários dos atletas não pedem login.

### 5.2 Início
KPIs (jogos, vitórias, aproveitamento, gols, minutos, elenco, no DM agora, avaliados físico); aviso de alertas de prontidão/carga do dia; gráficos interativos: desempenho na temporada (resultados/gols/minutagem/aproveitamento), resultados e sequência, minutos por posição (donut clicável que filtra artilheiros/assistências), disponibilidade semanal, lesões por região (mapa de calor), mapa de minutagem dos últimos 10 jogos, evolução física (%), composição corporal (dispersão); quadros de artilheiros, assistências, últimos jogos, DM atual, rankings, pendências, agenda e aniversariantes.

### 5.3 Notificações
Fila do dia com filtros por tipo e "marcar como lida / marcar todas": sem bem-estar hoje; sem PSE da sessão de hoje/ontem; indicador de carga ALTO; prontidão baixa; 5+ treinos seguidos; dor informada; previsão de retorno vencida no DM; sem avaliação física/corporal/maturação na temporada; testes agendados nos próximos 7 dias; aniversários. Painel "O que falta por atleta". Contador vermelho no menu = avisos não lidos (exceto informativos).

### 5.4 Calendário
Mês (segunda a domingo) com eventos: sessões do microciclo (treino/folga), jogos (microciclo + Minutagem, em dourado), avaliações (sessões realizadas, agendadas, maturação), retornos previstos do DM; rótulos **MD, MD-1, MD+1…** por dia; barrinha com a cor do mesociclo. Cartões no topo com totais do mês (clicar mostra/oculta tipo). Clique no dia → detalhe com botões: Sessão de treino, Jogo, Folga, Agendar teste, Abrir microciclo; **lixeira** em cada evento; **Limpar este dia** e **Limpar o mês** (só sessões e agendamentos; não apaga jogos da Minutagem, avaliações nem lesões).

### 5.5 Atletas
- **Cadastro**: cartões com foto/iniciais, nome, função, número, etiquetas (DM, lesões, disponibilidade), **selo de carga (ALTA/ELEVADA/NORMAL/BAIXA)**, número vermelho de alertas, aviso vermelho só quando falta avaliação ("✕ Falta: Física"), minutos, gols, assistências. Barra de pendências (Física/Corporal/Maturação). Formulário com foto (recorte/compressão).
- **Ficha individual** (abas): Visão geral · Minutagem · Histórico de jogos · Carga (PSE) · Lesões/DM · Avaliações físicas · Maturação · Avaliações corporais. No topo: **Indicador de carga** (ALTO/ELEVADO/NORMAL/BAIXO, com ACWR), **alertas ativos** (ex.: "ACWR = 1,6 (risco de lesão)", "5 treinos consecutivos sem descanso", prontidão baixa, bem-estar em intervenção, dor, DM) e **"Falta"** (bem-estar de hoje, PSE, avaliações). Botão Imprimir ficha (2 folhas 16:9).
- **Mapa de jogadores** (ver seção 8.6).
- **Importar dados**: Excel/CSV/backup JSON de atletas e lesões com mapeamento automático de colunas, prévia (Novo/Atualiza/Erro) e criação automática de atletas; **fotos em lote** reconhecendo o atleta pelo nome do arquivo (ex.: "arthur_nascimento_07.png"), com prévia e correção manual.

### 5.6 Jogos e Minutagem
Cadastro de jogos (competição, adversário, mando, placar, relacionados com titular/reserva, minutos, gols, assistências), dashboards e relatórios em PDF com prévia (já existentes na referência em `modulos/minutagem-original.html`).
**Controle de carga (alertas)**: filtro por competição; aviso "Falta minutar X jogo(s)"; grupos de alerta; gráfico de minutos por atleta com linha da média; tabela por atleta (relacionado, jogou, titular, minutos, % do possível, mini-gráfico dos últimos 5 jogos, jogos seguidos 60+, jogos sem jogar, minutos em 14 dias, último jogo, status, alertas e recomendação). Regras na seção 7.6.

### 5.7 Fisio / DM
Registro de lesão com **mapa corporal anatômico clicável** (104 músculos, frente e costas; `dados-e-imagens/segs.json` tem os contornos), tipo, grau, lado, mecanismo, dor, condutas, exames, previsão de retorno, aviso automático de **recorrência**; linha de evolução **Lesão → Tratamento → Transição → Retorno gradual → Liberado**; mapa de calor das regiões; dashboards (visão geral, lesionados, histórico, regiões, tempo de afastamento, comparativo); relatórios PDF.

### 5.8 Nutrição
- **Composição corporal**: só **4 dobras** — tricipital, subescapular, suprailíaca, abdominal (protocolo **Faulkner**), sem circunferências. Ao salvar, atualiza peso/altura/% gordura no cadastro. Tabela "Última avaliação de cada atleta" com **Ações: editar, nova avaliação, excluir**; painel com histórico do atleta. Faixa-alvo de gordura configurável.
- **Comparativo** e **Individual** (variação período a período, dobras comparadas, necessidade estimada).
- **Hidratação**: % de perda, taxa de sudorese, reposição, escala de cor da urina.
- **Necessidades energéticas**: tabela por atleta (repouso, gasto total, CHO, PTN, LIP, água) por tipo de dia (descanso 1,4 · leve 1,6 · moderado 1,75 · intenso/jogo 1,95) e estratégia de dia de jogo; **Nova avaliação energética** (salva, editável e excluível) — atletas com avaliação mostram selo "Avaliação dd/mm", os demais "Estimativa".

### 5.9 Avaliação física
Testes: **CMJ** (3 saltos → média), **30-15 IFT** (VIFT final), **10 m** (3 sprints → média), **30 m** (3 → média), **505** (2 pé direito + 2 pé esquerdo → média de cada lado → **vale o melhor lado**). Lançamento em lote com a média aparecendo na hora, nome do atleta fixo à esquerda e botão Salvar sempre visível. **Importar planilha** (Atleta, Data, CMJ 1–3, VIFT, 10m 1–3, 30m 1–3, 505 D1, D2, E1, E2) com modelo para baixar.
Páginas por teste: KPIs, filtros (data, comparar com anterior/primeira, posição, status, busca), ranking com faixa colorida, anterior, evolução, quintis do grupo, não avaliados em vermelho, gráfico de evolução média, distribuição por faixa, ficha do teste, exportar Excel. **Painel geral** com pódio por teste, tabela geral, agenda de testes. **Faixas configuráveis**.
**Maturação**: nova medição em lote — **estatura e peso vêm sozinhos** da avaliação corporal/cadastro; o usuário digita só a **altura sentado**; mostra na hora tronco, perna, offset (desvio do PHV), idade do PHV e status. Painel com idade biológica, desvio, estrelas, distribuição por status, histograma, bio-banding, cuidados no pico; individual com curvas e interpretação. Importar planilha.

### 5.10 Monitoramento
- **Bem-estar** (perguntas do Google Forms do clube): Treina hoje? · Sono · Fadiga · Recuperação · Estresse · Humor · Dor (+ local no **boneco do corpo** e escala 0–10) · Cor da urina (1–8) · Motivo. Dashboard (KPIs de adesão, quadros Normal/Atenção/Intervenção, mapa de bem-estar do elenco, tabela colorida, alertas laterais, legenda de hidratação, recomendações, notas do dia), Histórico individual, **Relatório do dia** paginado (10/15/20/25/30 atletas por folha, painel lateral em todas as folhas). Importar respostas do Forms (.xlsx/.csv) e lançamento manual.
- **PSE**: lançamento em lote (escolhendo a sessão planejada; em jogo os minutos vêm da Minutagem); **Editar PSE e minutos** de cada atleta (sessão, PSE, minutos, apagar, aplicar minutos a todos, puxar minutos da Minutagem); dashboard do dia (coleta, PSE média programada x realizada, carga média, monotonia, atletas em risco, alerta de prontidão, **alertas do grupo**, prontidão do elenco, **carga diária 30 dias** com colunas planejada x realizada e linhas PSE e PSR, barras PSE/UA por atleta, **comparativo dos atletas em colunas** por métrica selecionável, **tabela de carga com "O que fazer"**); carga da semana (KPIs, carga das últimas 6 semanas, variação semanal programado x realizado, UA diária por atleta com cores); reports diário/semanal/microciclo.
- **Formulários dos atletas** (Configurações → Formulários dos atletas): bem-estar e PSE em tela de celular (botões grandes), por **link** (`#form=bemestar&cat=Sub-15`) ou **modo atleta** (tablet do clube, "Responder outro atleta"). Gravam direto nas tabelas.
- **Dados de teste**: botão para carregar 5 semanas de exemplo e "Limpar dados de teste".

### 5.11 Planejamento
- **Macrociclo**: linha do tempo do ano (períodos, mesociclos, eventos, jogos, testes, marcador de hoje), CRUD de blocos.
- **Microciclo** (estilo calendário, cores do Porto): faixa com período, **monotonia planejada**, PSE média programada, **monotonia realizada**, PSE média realizada; 7 colunas com cabeçalho colorido por MD (MD dourado); cartões de sessão (horário "10:00 MANHÃ", tipo, detalhes, duração, PSE, UA, ×); dia vazio com **Adicionar sessão / Folga / Match day** (jogo: adversário, casa/fora, horário, duração, PSE planejada, UA alvo); rodapé por dia: PSE e UA programado x realizado e barra de respostas; copiar dia, copiar semana anterior, nome da semana, gráfico programado x realizado, PDF.
- **Plano de treino** (ver seção 8.5) com **prancheta tática**: jogadores em forma de boneco (verde, amarelo, vermelho, azul, goleiro, coringa, manequim), cone, **pratinho (disco visto de cima, com furo)**, estaca, arco, mini-barreira, escada, bandeira, bola, mini-gol, gol; setas de passe/movimento/condução; área do exercício; campo inteiro/meio/sem marcação; selecionar item → aumentar/diminuir, girar 45°, cor, número, duplicar, remover; roda do mouse muda tamanho; tamanho padrão dos novos itens. **Método** escolhido por botões (Ativação, Rondo, Posse de bola, Jogo reduzido…; academia: Força MMII e core, Potência, Pliometria…). Fichas de academia por atleta.

### 5.12 Configurações
Geral (profissionais, **capa dos relatórios**, **usuários e senhas**, **exportar todos os dados** em Excel com uma aba por área ou backup JSON, limpeza de dados com confirmação "EXCLUIR"), Fisioterapia, Nutrição (faixa de gordura), Avaliação física (faixas), Formulários dos atletas, Minutagem.

### 5.13 Teste / limpar (todas as áreas)
Botão no topo: por área (Atletas, DM, Nutrição, Avaliação física, Monitoramento, Planejamento) → **Carregar teste** (dados marcados como teste na categoria filtrada), **Limpar teste**, **Limpar tudo** (dados reais da área, exige digitar EXCLUIR).

---

## 6. Status e classificações

- **DM**: tratamento (vermelho), transição (amarelo), retorno gradual (verde), liberado (azul).
- **Faixas dos testes** (configuráveis; ordem Excelente, Muito Bom, Bom, Regular, Atenção): CMJ ≥40/35/30/25 cm; VIFT ≥20/19/18/17 km/h; 10 m ≤1,79/1,89/1,99/2,19 s; 30 m ≤4,00/4,20/4,40/4,60 s; 505 ≤2,20/2,35/2,50/2,70 s. Cores: #1b8a4a, #2f6fd6, #159aa8, #f39324, #e0342b.
- **Maturação (status)** pelo offset (desvio): > +1,0 Adiantado (Pós-PHV); 0 a +1,0 Normal (Pós-PHV); −1,0 a 0 Normal (PHV / Pré-PHV); −1,5 a −1,0 Atrasado (Pré-PHV); ≤ −1,5 Muito Atrasado (Pré-PHV); sem medição = Sem classificação. Fase: pré-PHV < −1; PHV −1 a +1; pós-PHV > +1.

---

## 7. Fórmulas e regras (implementar exatamente)

### 7.1 Composição corporal
- Faulkner: **%G = 0,153 × (tricipital + subescapular + suprailíaca + abdominal) + 5,783**.
- Massa gorda = peso × %G/100; massa magra = peso − massa gorda; IMC = peso / altura².

### 7.2 Hidratação
perda = pré − pós; % perda = perda / pré × 100; **taxa de sudorese (L/h) = (perda + ingerido(L) − urina(L)) / (duração/60)**; reposição ≈ 150% da perda. Cor da urina: 1–3 boa, 4–5 atenção, 6–8 inadequada.

### 7.3 Necessidade energética
Repouso: **Cunningham = 500 + 22 × massa magra**; Schofield (≤18 anos) = 17,686 × peso + 658,2 (adulto 15,057 × peso + 692,2); Harris-Benedict = 66,5 + 13,75 × peso + 5,003 × altura(cm) − 6,755 × idade; ou valor medido. Gasto total = repouso × fator de atividade + gasto extra. Proteína = g/kg × peso (padrão 1,6); gordura = % das kcal (padrão 28%) / 9; carboidrato = (total − PTN×4 − LIP×9)/4; água = ml/kg × peso (padrão 40).

### 7.4 Maturação (Mirwald, 2002)
Perna = estatura − altura sentado.
**Offset = −9,236 + 0,0002708 × (perna × sentado) − 0,001663 × (idade × perna) + 0,007216 × (idade × sentado) + 0,02292 × (peso / estatura × 100)**.
Idade do PHV = idade − offset. **Idade biológica = idade cronológica + offset**. Estatura-alvo = (pai + mãe + 13)/2.

### 7.5 Testes
CMJ, 10 m, 30 m = média das tentativas preenchidas. 505 = média(D1,D2) e média(E1,E2); resultado = **menor** das duas médias. VIFT = valor final. Percentil no grupo = posição do atleta entre os resultados mais recentes da categoria. **Índice geral** = média dos percentis (≥80 Excelente, ≥65 Muito bom, ≥55 Bom, ≥35 Regular, abaixo = Abaixo).

### 7.6 Carga interna (PSE)
- **UA (carga) = PSE (0–10, escala CR-10 de Borg) × minutos.**
- Aguda = soma 7 dias; crônica = soma 28 dias ÷ 4; **ACWR = aguda ÷ crônica**.
- **Monotonia = média diária ÷ desvio-padrão (7 dias)**; **Strain = carga semanal × monotonia**.
- Monotonia planejada/realizada da semana com as UAs diárias do microciclo / da média dos atletas.
- **Status do atleta**: Risco alto = ACWR > 1,5 ou monotonia > 2 ou bem-estar em intervenção; Requer atenção = ACWR fora de 0,8–1,3 ou monotonia > 1,5 ou bem-estar em atenção; senão Sem alertas.
- **Selo de carga**: ALTA (risco alto ou ACWR > 1,5), ELEVADA (ACWR > 1,3), BAIXA (ACWR < 0,8), NORMAL.
- **Alertas do grupo**: prontidão < 60%; ACWR > 1,5; monotonia > 2; strain > 140% da mediana; UA 7 dias > 120% ou < 70% do planejado.
- **Recomendações ("O que fazer")**: ACWR > 1,5 → reduzir volume 20–30% por 3–4 dias e evitar sprints máximos; ACWR 1,3–1,5 → segurar a progressão; ACWR < 0,8 → progredir até +10%/semana; monotonia > 2 → inserir dia leve/folga; 1,5–2 → alternar dias fortes e leves; 5+ dias seguidos → folga/regenerativo; prontidão < 60% → conversa e sessão regenerativa; dor → encaminhar ao DM; senão "Manter o planejamento".
- **MD**: dia de jogo = MD; dias antes MD-1…MD-6; até 2 dias depois MD+1/MD+2.

### 7.7 Bem-estar e prontidão
Notas 0–10 por resposta (sono: muito bom 9, bom 8, normal 6, dificuldade/agitado 4; fadiga: muito descansado 9, descansado 8, normal 7, mais cansado 4, sempre cansado 2; recuperação: totalmente 10, recuperado 8, normal 5, pouca 3, não recuperado 0; estresse: relaxado/normal 8, moderado 6, alto 3, muito alto 1; humor: muito bem 9, bom humor 8, normal 6, irritado/baixo 3).
Sinais: dor; sono ≤ 4; recuperação ≤ 3; estresse ≤ 3; fadiga ≤ 4; urina ≥ 6.
**INTERVENÇÃO** se escala de dor ≥ 7 ou 2+ sinais; **ATENÇÃO** se 1 sinal ou sono ≤ 6 ou recuperação ≤ 5; senão **NORMAL**.
**Prontidão (%) = média das notas × 10 − (escala de dor × 3) − 5 (se urina ≥ 6)**, limitada a 0–100: < 50 Baixa, 50–69 Moderada, ≥ 70 Boa. **PSR** = nota de recuperação.

### 7.8 Minutagem (controle de carga)
ALTA: 3+ jogos seguidos com 60+ min (último jogo há ≤ 14 dias) ou 2 jogos em ≤ 72 h com 60+ min nas últimas 3 semanas. ELEVADA: ≥ 85% dos minutos possíveis nos últimos 5 jogos ou 300+ min em 14 dias. BAIXA: 3+ jogos seguidos sem entrar ou 21+ dias sem jogar. Recomendações: poupar/reduzir minutos e priorizar recuperação; alternar minutagem; dar minutos ou compensar com treino de alta intensidade.

---

## 8. Relatórios e impressão

Todos com **prévia** (miniaturas clicáveis que ampliam, anterior/próxima), **Imprimir** e **Baixar PDF**. Formato **16:9** (folhas de painel) salvo indicação.

1. **Capa padrão** (editável em Configurações → Capa): fundo verde, linha do topo "DEPARTAMENTO DE PERFORMANCE DE BASE" em dourado, título grande dourado (ex.: AVALIAÇÃO FÍSICA), responsável "IGOR SATHLER - FISIOLOGISTA", só a categoria ("SUB-15"), escudo embaixo, ano grande no canto ("20/26"), frase "MAIS QUE UM CLUBE, UMA IDENTIDADE.".
2. **Relatórios em PDF** em DM, Nutrição, Avaliação física e Monitoramento: o usuário marca as partes (capa, painéis, páginas por teste, individuais por atleta com seleção múltipla / selecionar todos).
3. **Relatório individual de avaliação física** (16:9, arte do clube): fundo verde escuro com escudo grande à direita e **foto do atleta recortada** sobre ele; primeiro nome pequeno em amarelo e **sobrenome grande**; linha com categoria, idade, altura, peso; quadro de posição com **campo em perspectiva e ponto verde na posição**; antropometria (peso, altura, %G); indicadores (atletas, testes realizados, presença na avaliação, data MÊS/ANO); 6 cartões (CMJ, 10 m, 30 m, 505 direita/esquerda, 30-15 IFT, índice geral) com valor, variação pequena em azul e classificação (REGULAR/MUITO BOM em azul, ABAIXO em vermelho); faixa de baixo com as fotos dos atletas **da mesma posição** e o atleta destacado em verde.
4. **Relatório de maturação biológica — A4 deitado, sem margem**: capa; folhas com cabeçalho verde (escudo, "Relatório de maturação biológica · Categoria SUB-15", data, "Mais que um clube, uma identidade."), KPIs, tabela **20 atletas por folha** (foto, atleta, posição, idade cronológica, idade biológica, idade estimada do PHV, desvio, status colorido); folhas finais com distribuição por status (donut), distribuição por desvio (barras ≤−1,5 … >+0,5), textos "Como entender", "Como ler o desvio", "Como interpretar os status", **recomendações por fase com os nomes dos atletas** e aviso final. Filtros: categoria, subcategoria, posições.
5. **Plano de treino — A4 retrato**: cabeçalho verde com escudo, data/dia/horário/MD; faixa local, duração efetiva (soma), atividades, carga planejada (UA), responsável; linha do tempo colorida das atividades; cada atividade em cartão numerado com selo **MÉTODO** (letras brancas sobre verde), duração, campo, séries, PSE, grupo, objetivo, organização, regras, pontos de atenção, variações; tabela de exercícios (academia) ou desenho da prancheta (campo); material e observações. **Fichas de academia por atleta (A4 deitado)**: exercícios, séries, cadência, descanso, 2 colunas de carga em branco, escala RIR, barra de fadiga e gráfico "O quão pesada está a carga?".
6. **Bem-estar · relatório do dia** (paginado, painel lateral em todas as folhas); **PSE report diário e semanal**; **Microciclo da semana**.
7. **Mapa de jogadores — A4 deitado, fundo branco**: cabeçalho verde com legenda G1 (verde) G2 (amarelo) G3 (azul) G4 (vermelho), AL (alojado) / NA (não alojado); marcações "◀ LADO DIREITO", "sentido do ataque", "LADO ESQUERDO ▶"; campo em linhas verde-claras; quadro da categoria (alojados, goleiros, de linha, total) e **comissão técnica** (treinador, aux. técnico, prep. físico, prep. goleiros, fisioterapeuta, massagista); posições: **Goleiro (01)** em cima; **Lateral direito (02) · Zagueiro (03) · Zagueiro (04) · Lateral esquerdo (06)**; **Volante (05)**; **Meio-campo (10)**; na frente **Extremo direito (07) · Atacante (09) · Extremo esquerdo (11)**. Lado do atleta = escolha manual > função cadastrada > pé. Cartão: foto, nome, apelido, nascimento · pé, altura · peso, AL/NA, faixa com a cor do grupo. Cartões se ajustam para caber em 1 folha. Clicar no atleta edita posição, lado, grupo, alojamento e apelido.

---

## 9. Exportação e backup
Exportar Excel (uma aba por área, com médias e cálculos) e backup JSON completo; importar backup JSON.

## 10. Aplicativo para Windows (opcional)
Se eu pedir: empacotar com **Electron** (ver `aplicativo-windows/`): janela maximizada, ícone do escudo, menu Arquivo (abrir pasta dos dados, backup agora, abrir backups, importar backup do sistema web, imprimir), atalho na área de trabalho, banco local em `Documentos\Porto Vitória - Dados\banco` com backup diário, bibliotecas de PDF/Excel embutidas (funciona sem internet), janela "Salvar como" para PDF/Excel. Se meu sistema já tem servidor e banco, prefira o app apontar para o meu servidor.

## 11. Qualidade
- Nada de texto cortado ou desalinhado; números nunca cortados; tabelas com rolagem horizontal e nome do atleta fixo à esquerda nos lançamentos em lote; botão Salvar sempre visível.
- Formulários aceitam vírgula; sem bloqueio de validação do navegador.
- Confirmação antes de excluir; mensagens de sucesso ("toast").
- Acessível (rótulos, foco por teclado) e responsivo.

## 12. Ordem de implementação sugerida
1. Banco (seção 4), login, layout base, filtros globais, Atletas (cadastro, ficha básica, importação, fotos em lote).
2. Fisio/DM com mapa corporal.
3. Nutrição (4 dobras, hidratação, energia).
4. Avaliação física (tentativas, faixas, páginas por teste) e Maturação.
5. Jogos/Minutagem + controle de carga.
6. Monitoramento (bem-estar, PSE, formulários dos atletas).
7. Planejamento (macro, micro, plano de treino, prancheta) e Calendário.
8. Início, Notificações, Teste/limpar, exportação.
9. Todos os relatórios com prévia (seção 8) e Mapa de jogadores.
10. (Opcional) app Windows.

Comece pela **fase 0**: leia meu projeto e a pasta `referencia-porto-vitoria/`, e me apresente o plano de integração (quais arquivos vai criar/alterar, quais tabelas, quais componentes) antes de codificar.
