---
documento: PRD — Product Requirements Document
produto: Sistema Central Fenice Lab ("Fênix")
versao: 1.1
data: 2026-06-01
autor: Dante Martins (Fenice Lab) + Fenice (Claude)
status: finalizado — pronto para plano técnico (Fase 1)
base: 00-Central/Sistema Central Fenice - Ideias e Base do PRD.md
marca: 00-Central/Manual da Marca - Fenice Lab.md
tags: [prd, fenice, sistema-central, multi-tenant, supabase, telegram]
---

# 📘 PRD — Sistema Central Fenice Lab

> Documento de Requisitos de Produto. Define o QUE o sistema faz, PARA QUEM, COM QUAIS REGRAS e RESTRIÇÕES. Não é manual técnico de implementação — é o contrato do produto. Implementação detalhada vem nos planos de cada fase.
>
> **Identidade visual do produto:** definida no Manual da Marca (`00-Central/Manual da Marca - Fenice Lab.md`) — paleta terrosa, Fraunces/Inter, logo `fenice.`. O `shared/` (design system) implementa esses tokens. Toda tela do sistema nasce nessa identidade.

---

## 1. Sumário Executivo

O **Sistema Central Fenice Lab** é a plataforma que centraliza toda a operação da agência: gestão de clientes, conteúdo, aprovações, métricas, agenda, financeiro e a relação com o cliente — incluindo um **conselho de clones de IA** (Hormozi, Sobral, Jobs, etc.) com quem o cliente conversa para gerar ideias.

São **dois produtos no mesmo sistema**, separados por login:
1. **Portal do Cliente** — onde cada cliente (ex: Suprema Pizza) acompanha seu trabalho com total transparência: cronograma, métricas em tempo real, aprovações, brand book, galeria e conselho de IA.
2. **Painel da Fenice (Admin)** — o cockpit onde a agência gerencia todos os clientes, aprovações, calendário consolidado, relatórios, agenda e operação.

O sistema é projetado **multi-tenant desde o início** (preparado para virar produto white-label vendido a outras agências), e integra-se a Instagram/Facebook/Google (métricas e publicação automática), Telegram (notificações, aprovações e clones), e LLMs (Claude Haiku no início; multi-LLM no futuro).

**Objetivo de negócio:** escalar a Fenice de gestão manual cliente-a-cliente para uma operação orquestrada que suporte **15 clientes em 6 meses e 30-50 em 1 ano**, e eventualmente ser licenciada para outras agências.

---

## 2. Problema e Justificativa

### Dores atuais
1. **Design system duplicado e divergindo** entre apps de clientes (cada cliente tem sua cópia; já começaram a divergir).
2. **Informação fragmentada** — aprovações no WhatsApp, agenda no Calendar, materiais no Drive, ideias do cliente perdidas.
3. **Não há central** — gestão cliente-a-cliente não escala.
4. **Ideias do cliente se perdem** — sem canal estruturado para capturá-las e transformá-las em conteúdo.
5. **Sem transparência sistematizada** para o cliente ver o trabalho e a evolução.

### Por que agora
A Fenice tem 2 clientes (Suprema, Arena) e projeta 15 em 6 meses. O custo de NÃO ter o sistema cresce a cada cliente novo. Construir a base agora (com poucos clientes) é barato; refazer depois é caro.

---

## 3. Objetivos e Métricas de Sucesso

### Objetivos do produto
- O1. Centralizar gestão de todos os clientes em um único sistema.
- O2. Dar transparência total ao cliente (métricas, cronograma, evolução).
- O3. Reduzir o tempo de onboarding de cliente novo (de ~2h manuais para minutos assistidos).
- O4. Eliminar perda de informação (aprovações, ideias, materiais centralizados).
- O5. Diferenciar a Fenice com o conselho de IA (recurso único no mercado BR).
- O6. Preparar para escala (15→50 clientes) e para white-label.

### Métricas de sucesso (KPIs do sistema)
- Tempo de cadastro de cliente novo < 30 min (com geração assistida).
- 100% das aprovações com rastro (quem aprovou, quando).
- 0 ideias de cliente perdidas (todas registradas no banco).
- Relatórios mensais gerados automaticamente para 100% dos clientes.
- Sistema suporta 50 clientes sem reescrita de arquitetura.

---

## 4. Escopo

### Dentro do escopo (v1)
- Autenticação (login/senha) e controle de acesso por agência/cliente.
- Portal do Cliente (7 menus — ver §7).
- Painel da Fenice (9 menus — ver §8).
- Integração de métricas (Instagram/Facebook/Google) com sync horário.
- Aprovação de criativos (portal + Telegram) com rastro.
- Conselho de clones de IA (Claude Haiku no início).
- Notificações e bot do Telegram (1 bot, multi-grupo).
- Calendário de postagens (cliente vê o dele; Fenice vê todos).
- Upload de material pelo cliente com triagem invisível.
- Onboarding assistido de cliente novo.
- Design system compartilhado (monorepo).
- Módulo financeiro (Fase 1: notas/custos/alertas).
- PWA responsivo.

### Fora do escopo (v1 — futuro)
- Publicação automática no Instagram (entra em fase posterior, mas arquitetura preparada).
- Cobrança/boleto/Pix via API de banco (Fase 2 do financeiro).
- Multi-LLM (Groq/Llama fallback + chave do cliente) e cobrança de IA.
- TikTok (add-on futuro).
- White-label comercializado (arquitetura preparada, venda depois).
- App nativo iOS/Android (PWA cobre por ora).

---

## 5. Personas e Papéis

| Persona | Quem é | O que faz no sistema |
|---|---|---|
| **Admin Central** (Dante + 1) | Donos/gestores da Fenice | Acesso total a tudo, todos os clientes, financeiro |
| **Admin de Cliente** (equipe Fenice) | Gestor responsável por um cliente | Acesso só ao(s) cliente(s) sob responsabilidade dele |
| **Membro Fenice** | Equipe operacional | Acesso por cliente (sem financeiro) |
| **Cliente** (ex: Toko/Suprema) | Dono do negócio cliente | Vê só o conteúdo dele; aprova; conversa com clones; envia material/sugestões |
| **Clones de IA** *(ator, não usuário)* | Personalidades (Hormozi, etc.) | Conversam com o cliente, dão sugestões, têm contexto dos dados do cliente — não têm login próprio |

### Regras de acesso (RBAC)
- **Multi-tenant:** todo dado pertence a uma `agência` e a um `cliente`. Isolamento total entre agências (white-label) e entre clientes.
- Financeiro: **só Admin Central**.
- Dentro de um cliente: todos os usuários daquele cliente veem tudo (sem subníveis).
- Canal central da Fenice: todos da equipe veem tudo.

---

## 6. Requisitos Funcionais por Módulo

### 6.1 Autenticação & Acesso
- RF-01. Login por **e-mail + senha** (sem link mágico na v1).
- RF-02. Senha inicial genérica no padrão `nomeempresa123`, com troca obrigatória no 1º acesso (recomendado).
- RF-03. Recuperação de senha por e-mail automática.
- RF-04. Papéis: Admin Central, Admin de Cliente, Membro, Cliente (ver §5).
- RF-05. Isolamento multi-tenant: usuário só acessa dados da sua agência/cliente.

### 6.2 Portal do Cliente — Dashboard (Início)
- RF-06. Exibir nº de seguidores **hoje** + variação (semana/mês).
- RF-07. Gráfico de evolução de seguidores ao longo do tempo.
- RF-08. Engajamento médio (curtidas/comentários por post).
- RF-09. Resumo: próximos posts + aprovações pendentes.
- RF-10. Atalhos rápidos (aprovar, falar com conselho).

### 6.3 Portal do Cliente — Calendário/Cronograma
- RF-11. Visão mensal (calendário) e semanal, posts marcados por dia.
- RF-12. Cada post mostra: tipo (Reel/Carrossel/Foto), tema/sabor, status (rascunho/aguardando aprovação/aprovado/postado).
- RF-13. Cliente tem acesso **somente visual** (não edita/arrasta) — transparência.
- RF-14. Abrir post → ver criativo + legenda + botões Aprovar / Pedir Alteração.
- RF-15. Histórico de posts publicados.

### 6.4 Portal do Cliente — Aprovações
- RF-16. Aprovação **por post** + aprovação do **cronograma completo**.
- RF-17. Ao "Aprovar": confirmação positiva, registro com identidade e timestamp.
- RF-18. Ao "Pedir Alteração": abrir campo de texto; o sistema deve **fazer perguntas de esclarecimento** para entender 100% a mudança e evitar retrabalho (anti-alteração-desperdiçada).
- RF-19. Alterações ilimitadas (favorecem o cliente), mas registradas.
- RF-20. Prazo de aprovação: **24h** → auto-aprova se não houver resposta.
- RF-21. Aprovar/Alterar disponível tanto no **portal** quanto no **Telegram**. A confirmação/resposta aparece **nos dois lugares**: grupo do cliente (confirmação "recebido") + painel central da Fenice (controle).

### 6.5 Portal do Cliente — Identidade/Brand Book
- RF-22. Logo (versões + download), paleta, tipografia, grafismos, tom de voz.
- RF-23. Conteúdo puxado do design system do cliente.

### 6.6 Portal do Cliente — Galeria/Acervo
- RF-24. Fotos por categoria, vídeos, posts publicados, download.
- RF-25. Botão **Enviar Material** (upload) com campo de sugestão anexável.
- RF-26. Material enviado vai para **triagem** (não entra direto no acervo oficial) — invisível ao cliente.
- RF-27. Upload dispara notificação no Telegram.

### 6.7 Portal do Cliente — Conselho (Clones IA)
- RF-28. Conversar com clone específico (13 clones) via seleção/comando.
- RF-29. `/reuniao`: convocar todos para debater um tema.
- RF-30. Clone padrão = **"Gerente de Operação"** (contexto de todos os clones + foco em operação/crescimento; dá métricas e sugestões).
- RF-31. Clones acessam dados do cliente (métricas, cronograma) para respostas contextualizadas.
- RF-32. LLM dos clones: **Claude Haiku** (`claude-haiku-4-5`) como padrão inicial (conta Fenice, sem cobrança ao cliente — poucos clientes/baixo consumo). Botão multi-LLM (Groq/Llama + GPT/Claude com chave do cliente) = **fase futura**.
- RF-33. Sem limite de mensagens (custo controlado pelo modelo barato; multi-LLM/fallback no futuro).
- RF-34. Histórico de conversas + área "Sugestões dos clones" derivada das conversas.
- RF-35. Fenice lê todas as conversas (não são privadas ao cliente).

### 6.8 Portal do Cliente — Relatórios/Métricas
- RF-36. Seguidores (hoje, ganhos/perdidos), evolução (gráficos), engajamento, salvamentos, cliques no link.
- RF-37. ROAS **semanal e mensal** (via Meta Ads API).
- RF-38. Comparativo com o **Marco Zero** (de onde saiu → onde chegou).
- RF-39. Relatório mensal em PDF para download.

### 6.9 Portal do Cliente — Configurações
- RF-40. Dados da conta/empresa, endereço, links, cardápio.
- RF-41. (Futuro) Campo seguro para colar chave de LLM (GPT/Claude) + escolher modelo padrão — quando o multi-LLM for ativado.
- RF-42. Tema claro/escuro.
- RF-43. Troca de senha.

### 6.10 Portal do Cliente — Sugestões
- RF-44. Botão "Sugestões" visível: cliente envia ideia a qualquer hora.
- RF-45. Sugestão salva no banco (cliente+data+texto) e dispara notificação no Telegram (grupo do cliente + central).

### 6.11 Painel Fenice — Dashboard Geral
- RF-46. Cards de todos os clientes (seguidores hoje, evolução, status do mês).
- RF-47. Fila de aprovações pendentes de todos os clientes.
- RF-48. Alertas (post atrasado, aprovação parada há X dias).
- RF-49. Resumo do dia (o que postar, calls, pendências).

### 6.12 Painel Fenice — Clientes
- RF-50. Lista de clientes + status do contrato/plano.
- RF-51. Adicionar cliente novo (onboarding assistido — ver §6.18).
- RF-52. Abrir cliente → tudo dele (cronograma, métricas, materiais, acessos).

### 6.13 Painel Fenice — Triagem de Uploads
- RF-53. Itens enviados pelos clientes (cliente + mídia + sugestão).
- RF-54. Ações: aprovar (move pro acervo oficial), descartar, marcar.

### 6.14 Painel Fenice — Calendário Geral
- RF-55. Calendário consolidado de TODOS os clientes.
- RF-56. Filtros por cliente e por status.
- RF-57. Editar/planejar posts (a Fenice edita; o cliente só vê).

### 6.15 Painel Fenice — Aprovações
- RF-58. Fila (qual cliente, qual post, qual ação) + texto das alterações + histórico/auditoria.

### 6.16 Painel Fenice — Relatórios Gerais
- RF-59. Visão de todos os clientes, ranking de desempenho, geração de relatórios mensais, métricas da própria Fenice.

### 6.17 Painel Fenice — Agenda
- RF-60. Reuniões/calls/visitas; integração Google Calendar.
- RF-61. Lembretes automáticos em cascata (3 dias / 1 dia / 2h antes) via Telegram. Destinatário: **Fenice sempre**; **cliente só quando o evento o envolve** (call/reunião com ele).
- RF-62. Comando ao bot: "agenda call com X dia/hora/local/obs" → cria evento + posta na agenda + programa lembretes.
- RF-63. Relatório mensal gerado dispara alerta para marcar a reunião de apresentação.

### 6.18 Painel Fenice — Onboarding de Cliente
- RF-64. Ao cadastrar: criar login + grupo Telegram automaticamente.
- RF-65. Pedir SEMPRE o **relatório de análise do Instagram** do cliente (gerar via Apify/MCP).
- RF-66. Gerar **ficha** para o cliente preencher (alimenta brand book): dados, cores, concorrentes, tom de voz, produtos/cardápio, persona, objetivo, restrições, histórico.
- RF-67. Gerar **brand book + design system** a partir da ficha + análise do Instagram.
- RF-68. Perguntar se deseja gerar **e-commerce** automático com os dados.
- RF-69. Pedir **domínio a espelhar** + **GitHub do projeto**.
- RF-70. Coletar acessos (Meta Business, Google, conta de anúncios), logo em alta, links, endereço.

### 6.19 Painel Fenice — Bots/Conselho
- RF-71. Gestão das personalidades dos clones. **Formato:** 1 arquivo Markdown por clone (frontmatter: nome, especialidade, prompt) em `shared/clones/`, carregado pela Edge Function conforme o comando (reaproveita os agents de `~/.claude/agents/`).
- RF-72. Configuração dos grupos Telegram por cliente.
- RF-73. Logs de conversas dos clientes com os clones.

### 6.20 Painel Fenice — Configurações/Operação
- RF-74. Editar design system compartilhado (reflete em todos os clientes).
- RF-75. Template de cliente.
- RF-76. Gestão de acessos da equipe.
- RF-77. Integrações (Meta, Telegram, Supabase, Anthropic/Claude, Drive).

### 6.21 Módulo Financeiro (só Admin Central)
- RF-78. Subir notas fiscais de ferramentas/serviços.
- RF-79. Cadastro de custos fixos e variáveis.
- RF-80. Alertas de datas de pagamento via Telegram.
- RF-81. (Fase 2) Cobrança/boleto/Pix via API de banco.

### 6.22 Telegram (transversal)
- RF-82. **1 bot** da Fenice (username **@fenicebot_bot** — já criado; nome de exibição "Fenice • Operação" + avatar logo `fenice.`) em todos os grupos (1 grupo por cliente + canal central). Painel central = **1 grupo único com TÓPICOS** (Aprovações / Agenda / Urgente / Relatórios), não canais separados.
- RF-83. Comandos de clones (`/hormozi`, `/reuniao`, etc.) + aprovação (`/aprovar`, `/alterar`).
- RF-84. Notificações ao cliente: lembrete de aprovação + relatório mensal.
- RF-85. Canal central: todos da equipe veem tudo; carimba [CLIENTE] em cada evento.

### 6.23 Publicação Automática (fase posterior, arquitetura preparada)
- RF-86. Agendar e publicar posts no Instagram via Meta API (feed/Reels).
- RF-87. Horário estratégico por cliente (configurável).

---

## 7. Estrutura de Navegação — Portal do Cliente (7 menus)
1. 🏠 Início (Dashboard)
2. 📅 Calendário/Cronograma
3. 🎨 Identidade/Brand Book
4. 🖼️ Galeria/Acervo (+ Enviar Material)
5. 💬 Conselho (clones IA)
6. 📊 Relatórios/Métricas
7. ⚙️ Configurações
(+ botão flutuante "Sugestões")

## 8. Estrutura de Navegação — Painel Fenice (9 menus)
1. 🏠 Dashboard Geral
2. 👥 Clientes
3. 📥 Triagem de Uploads
4. 📅 Calendário Geral
5. ✅ Aprovações
6. 📈 Relatórios Gerais
7. 📆 Agenda
8. 🤖 Bots/Conselho
9. ⚙️ Configurações/Operação (+ 💰 Financeiro, só Admin Central)

---

## 9. Requisitos Não-Funcionais

- RNF-01. **Multi-tenant** com isolamento total (agência → cliente). RLS (Row Level Security) no banco.
- RNF-02. **PWA responsivo** (instalável no celular, funciona bem em mobile).
- RNF-03. **Segurança:** credenciais nunca no código; variáveis de ambiente/secrets; chaves de LLM (incl. futuras dos clientes) criptografadas no banco.
- RNF-04. **Performance:** dashboard carrega < 3s; métricas servidas de cache do banco (não chamar API externa a cada visita).
- RNF-05. **Escala:** suportar 50 clientes sem reescrita.
- RNF-06. **Backup automático** dos dados (cronogramas, aprovações, materiais metadados).
- RNF-07. **Disponibilidade:** Claude Haiku como LLM dos clones; se indisponível, tratar erro graciosamente (multi-LLM/fallback no futuro).
- RNF-08. **Auditoria:** toda aprovação/decisão com usuário + timestamp.
- RNF-09. **Temas:** claro/escuro por cliente.
- RNF-10. **Acessibilidade básica** (contraste, navegação) e i18n preparado (PT-BR padrão).

---

## 10. Arquitetura Técnica

### 10.1 Visão
- **Código:** monorepo `Cerntral-fenicelab` (GitHub org feniceLab).
  - `shared/` — design system único (tokens + componentes visuais), **implementando o Manual da Marca** (Terra #B23A2E, Cotta #CC7A4D, Avorio #F3ECE2, Caffè #2A211C, gradiente Flame; Fraunces/Inter/JetBrains Mono; logo `fenice.`).
  - `shared/clones/` — 1 arquivo `.md` por clone (frontmatter: nome, especialidade, prompt), carregado pela Edge Function.
  - `central-app/` — painel da Fenice.
  - `portal/` — portal do cliente (template + dados por cliente).
  - `clientes/<slug>/` — dados/branding específicos de cada cliente.
  - `template-cliente/` — molde para cliente novo.
  - `deploy.sh` — deploy unificado por domínio.
- **Frontend:** **React + Vite + TypeScript** (SPA/PWA), **CSS próprio do design system** (não Tailwind), **pnpm workspaces**. Hospedado na **VPS Fenix** via openresty (deploy rsync/SSH), domínio por cliente.
- **Backend/Dados/Auth:** **Supabase** (conta da empresa) — Postgres + Auth + Storage(metadados) + **Edge Functions** (cérebro: clones, gateway LLM, webhooks Telegram, jobs de métricas).
- **Materiais pesados** (vídeos/fotos): na **VPS Fenix** (não no Git, não no Supabase Storage por custo).
- **Cérebro de automação:** **Supabase Edge Functions** (n8n DESCARTADO — ver §13). n8n permanece disponível no painel ICP caso futuro precise.
- **LLMs:** **Claude Haiku (Anthropic)** como padrão inicial dos clones (conta Fenice, sem cobrança — decisão 01/06). Futuro: gateway multi-LLM (Groq/Llama como fallback grátis + GPT + chave do próprio cliente).
- **Mensageria:** Telegram Bot API (1 bot).
- **Métricas:** Meta Graph API (IG/FB) + Google APIs; sync horário via cron/Edge Function → grava histórico no Postgres.

### 10.2 Por que esta stack
- Supabase resolve auth + banco + cérebro sem instalar nada pesado na VPS (6GB RAM é limite).
- VPS mantém o que já funciona (front estático/PWA + materiais).
- Híbrido: front+materiais na VPS, dados/lógica no Supabase.

---

## 11. Modelo de Dados (multi-tenant — alto nível)

> Toda tabela carrega `agencia_id` (white-label) e, quando aplicável, `cliente_id`. RLS garante isolamento.

- **agencias** (id, nome, marca/branding, domínio, plano_licenca) — Fenice = primeira linha.
- **usuarios** (id, agencia_id, email, senha_hash, papel [admin_central|admin_cliente|membro|cliente], cliente_id?).
- **clientes** (id, agencia_id, nome, slug, dominio, status, plano [faísca|combustão|renascimento], addons [tiktok|ecommerce], dados_marca).
- **marca_designsystem** (cliente_id, cores, tipografia, logos, grafismos, tom_de_voz).
- **posts** (id, cliente_id, data, tipo, tema, status, criativo_url, legenda, horario?).
- **aprovacoes** (id, post_id, usuario_id, acao [aprovado|alteracao], texto_alteracao?, timestamp).
- **materiais** (id, cliente_id, tipo, url_vps, categoria, origem [fenice|upload_cliente], status_triagem).
- **sugestoes** (id, cliente_id, usuario_id, texto, anexo_url?, data, status).
- **metricas** (id, cliente_id, rede, data, seguidores, alcance, engajamento, cliques, roas?) — histórico horário.
- **conversas_clones** (id, cliente_id, clone, llm, mensagem, resposta, timestamp).
- **sugestoes_clones** (id, cliente_id, clone, texto, origem_conversa_id).
- **agenda** (id, agencia_id, cliente_id?, titulo, data_hora, local, obs, lembretes_status).
- **financeiro** (id, agencia_id, tipo [nota|custo_fixo|custo_variavel], valor, vencimento, anexo_url, status) — só admin central.
- **chaves_llm** (id, cliente_id, provedor [openai|anthropic], chave_criptografada) — só quando multi-LLM for ativado (futuro).
- **telegram_grupos** (id, cliente_id, chat_id).

---

## 12. Integrações Externas

| Integração | Uso | Credencial |
|---|---|---|
| **Supabase** | auth, banco, edge functions, storage | URL + anon + service_role |
| **Telegram Bot API** | notificações, aprovações, clones | bot token + chat_ids |
| **Anthropic (Claude Haiku)** | LLM dos clones (padrão inicial) | API key (conta Fenice) |
| **Meta Graph API** | métricas IG/FB, ROAS, publicação | App ID/Secret/Token + permissões |
| **Google APIs** | métricas (Business/Analytics) | Cloud project + OAuth/API key |
| **Groq / OpenAI / chave do cliente** | multi-LLM (futuro) | API key (futuro) |
| **Apify** | análise de Instagram no onboarding | token |
| **Google Drive** | upload/repositório de imagens | MCP/OAuth |
| **Asaas/Inter** (Fase 2) | cobrança Pix/boleto | API key |
| **VPS Fenix** | hospedagem front + materiais | SSH (~/.ssh/fenix) |

### 12.1 Credenciais a coletar — checklist (responde "o que preciso pegar para tocar do início ao fim")

> Regra de ouro: **nenhuma credencial vai pro Git.** Tudo em variáveis de ambiente / Supabase Secrets.

**🟢 PEGAR AGORA (mínimo para começar Fases 1-3 sem interromper):**
1. **Supabase** — criar projeto na conta da empresa → `Project URL`, `anon key`, `service_role key`. (auth + banco + Edge Functions)
2. **Telegram Bot** — @fenicebot_bot já criado → `bot token`. + pegar o `chat_id` de cada grupo (cliente + canal central).
3. **Anthropic** — conta → `API key` (Claude Haiku = LLM dos clones, conta Fenice).
4. **VPS Fenix** — já temos: IP `207.58.172.147`, chave `~/.ssh/fenix`, container openresty `ic-openresty-mVOb`. (confirmar acesso)
5. **GitHub (feniceLab)** — já temos via MCP `github-fenicelab`. Repo `Cerntral-fenicelab`.

**🟡 PEGAR NA FASE DE MÉTRICAS/ANÚNCIOS (Fase 5):**
6. **Meta (Facebook/Instagram)** — criar App no Meta for Developers → `App ID`, `App Secret`, `Access Token` (longa duração) + permissões: `instagram_basic`, `instagram_manage_insights`, `pages_read_engagement`, `ads_read` (ROAS) e, p/ publicar depois, `instagram_content_publish`. Conectar a conta @asupremapizza ao Business.
7. **Google** — projeto no Google Cloud → habilitar APIs (Business Profile / Analytics) → `OAuth client` ou `API key`.

**🟠 OPCIONAL / FUTURO:**
8. **Groq / OpenAI / chave do cliente** — só quando o multi-LLM for ativado (futuro).
9. **Apify** — já temos token (uso só no onboarding p/ análise de Instagram; **não salvar em arquivo**).
10. **Asaas/Inter** (cobrança Pix/boleto) — só na Fase 2 do financeiro.

**Onde guardar:** as 🟢 viram secrets no Supabase + um `.env` local fora do Git.

---

## 13. Decisões de Arquitetura (TRAVADAS)
- ✅ Monorepo em `Cerntral-fenicelab`.
- ✅ Design system único e compartilhado (`shared/`), com componentes visuais.
- ✅ Deploy por domínio na VPS Fenix (não muda).
- ✅ **Supabase** = auth + banco + Edge Functions (cérebro). **n8n DESCARTADO** (disponível no ICP se um dia precisar de automação visual complexa).
- ✅ Telegram: **1 bot** em vários grupos (não 1 por cliente).
- ✅ Clones = personalidades/prompts no mesmo bot (não bots separados).
- ✅ LLM (inicial, 01/06): **Claude Haiku** (`claude-haiku-4-5`, conta Fenice, sem cobrança ao cliente — poucos clientes/baixo token). Multi-LLM (Groq/Llama fallback + chave do cliente) = **futuro**. **Llama local na VPS descartado** (6GB sem GPU).
- ✅ Login e-mail+senha; Fenice cria os logins; senha inicial `nomeempresa123`.
- ✅ Portal completo do cliente; calendário só-visual pro cliente.
- ✅ Aprovação por post + cronograma completo; 24h auto-aprova; portal+Telegram.
- ✅ Upload do cliente com triagem invisível.
- ✅ Métricas automáticas (sync horário) IG+FB+Google; ROAS Meta Ads.
- ✅ Multi-tenant desde já (preparado para white-label).
- ✅ Materiais pesados na VPS; PWA responsivo; backup automático.
- ✅ **Bot:** username @fenicebot_bot (já criado); nome de exibição branded "Fenice • Operação". (01/06)
- ✅ **Aprovação:** resposta aparece nos dois (grupo do cliente + central). (01/06)
- ✅ **Painel central:** 1 grupo com tópicos (não canais separados). (01/06)
- ✅ **Lembretes de agenda:** Fenice sempre; cliente só quando o envolve. (01/06)
- ✅ **Clones:** 1 `.md` por clone em `shared/clones/` (frontmatter + prompt). (01/06)
- ✅ **Identidade visual:** segue o Manual da Marca (paleta terrosa, Fraunces/Inter, `fenice.`). (01/06)
- ✅ **Stack (01/06, validada Dante+Willian):** React + Vite + TypeScript, **CSS próprio do design system** (não Tailwind), **pnpm workspaces**, Supabase **da conta da empresa** (dono dos segredos: Dante). LLM dos clones: **Claude Haiku** sem cobrança no início.

---

## 14. Planos Comerciais (o que o sistema precisa suportar)

> O sistema deve permitir marcar o plano de cada cliente e liberar/bloquear módulos conforme o plano.

- **🔥 FAÍSCA (base, R$2.500/mês):** identidade visual + design + cronograma + criativos com narração + presença orgânica + postagem automática. (sem tráfego, sem portal completo, sem e-commerce)
- **🔥🔥 COMBUSTÃO (~R$4-5k/mês + mídia):** tudo da Faísca + tráfego pago (Meta/Google) + landing + **acesso ao portal** (métricas, aprovações, conselho IA).
- **🔥🔥🔥 RENASCIMENTO (sob proposta):** tudo + e-commerce + site + portal premium.
- **Add-ons:** TikTok +R$500/mês · E-commerce +R$1.000.
- Conselho de IA (Claude Haiku) **incluído sem custo extra** no início — sem cobrança ao cliente pelo uso.
- Apresentação: ancorar no Renascimento; traduzir feature em sensação; portal/IA como diferencial-magia.
- ⚠️ Revisar margem real com 15 clientes (consultar Hormozi).

---

## 15. Fases de Construção (roadmap)

> Reformulado (n8n removido do plano original). Cada fase entrega algo usável.

- **Fase 0 — PRD + credenciais** (este documento + coletar as 5 credenciais 🟢 do checklist §12.1: Supabase, Telegram, Anthropic, VPS, GitHub).
- **Fase 1 — Fundação:** monorepo + `shared/` (design system) + Supabase (projeto, schema multi-tenant, auth). Migrar Suprema/Arena para usar `shared/` sem quebrar produção.
- **Fase 2 — Portal do Cliente (núcleo):** login, dashboard, calendário (visual), brand book, galeria. Dados da Suprema como piloto.
- **Fase 3 — Aprovações + Telegram:** bot único, fluxo aprovar/alterar (portal+Telegram), notificações, canal central.
- **Fase 4 — Conselho de Clones (IA):** Edge Functions + Claude Haiku + 13 personalidades + Gerente de Operação + `/reuniao`. (multi-LLM = futuro)
- **Fase 5 — Métricas:** integração Meta/Google, sync horário, gráficos de evolução, ROAS, relatório mensal automático.
- **Fase 6 — Painel Fenice completo:** dashboard geral, calendário consolidado, triagem de uploads, agenda + lembretes, relatórios gerais.
- **Fase 7 — Onboarding assistido:** ficha + análise IG + geração de brand book/design system + criação automática (login, grupo, estrutura).
- **Fase 8 — Financeiro (Fase 1):** notas, custos, alertas de pagamento.
- **Fase 9 — Publicação automática (Meta):** agendamento + publicação via API.
- **Futuro:** multi-LLM + cobrança de IA, TikTok, cobrança via banco (Asaas/Inter), white-label comercial.

---

## 16. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Migrar Suprema/Arena quebrar produção | alto | migração incremental, testar em staging, manter deploy atual no ar |
| Custo de IA dos clones escalar | baixo→médio | Claude Haiku (barato) no início; multi-LLM/fallback e chave do cliente quando crescer |
| VPS 6GB RAM estourar | médio | backend pesado no Supabase (nuvem), não na VPS |
| Sistema central virar "ruído" (Telegram) | médio | curadoria do que notifica; hierarquia de canais |
| Meta API mudar/limitar | médio | cache local das métricas; fallback Apify |
| Multi-tenant mal feito (vazar dado entre clientes) | **crítico** | RLS rigoroso no Supabase + testes de isolamento |
| Escopo inchar (over-engineering) | alto | seguir fases; cada fase entrega algo usável antes da próxima |

---

## 17. Pendências para fechar antes/durante construção
- [x] Resposta de aprovação: **nos dois** (grupo do cliente + central). ✅ 01/06
- [x] Painel central: **1 grupo com tópicos** (não canais separados). ✅ 01/06
- [x] Lembretes de agenda: **Fenice sempre; cliente só quando o envolve**. ✅ 01/06
- [x] Bot: **@fenicebot_bot** (criado) + permissões da §5 (RBAC). ✅ 01/06
- [x] Formato de exportação das 13 personalidades: **1 `.md` por clone em `shared/clones/`**. ✅ 01/06
- [x] Framework do frontend: **React + Vite + TS, CSS do design system, pnpm workspaces** (validado Dante+Willian). ✅ 01/06
- [x] LLM/cobrança: **Claude Haiku, sem cobrança no início**; multi-LLM e cobrança = futuro (rever com Hormozi). ✅ 01/06

> ✅ **Todas as pendências resolvidas (01/06).** Restam apenas itens de execução a confirmar com o Willian durante a construção: revisão fina do schema/RLS e se o `deploy.sh` cobre o build do Vite.

---

## 18. Glossário
- **Tenant/Agência:** uma agência usando o sistema (Fenice = a primeira; white-label = outras).
- **Cliente:** o negócio atendido pela agência (ex: Suprema Pizza).
- **Clone:** personalidade de IA do conselho (Hormozi, Sobral, etc.).
- **Gerente de Operação:** clone padrão com contexto consolidado, foco em crescimento.
- **Marco Zero:** baseline de métricas do cliente no início (ex: Suprema 5,1 curtidas/post).
- **Triagem:** etapa invisível onde a Fenice revisa material enviado pelo cliente antes do acervo oficial.
- **RLS:** Row Level Security (isolamento de dados por linha no banco).

---

*PRD v1.1 · Fenice Lab · 01/06/2026 · decisões de 01/06 incorporadas (Claude Haiku sem cobrança; stack validada). Vinculado ao Manual da Marca. Próximo passo: Fase 1 (Fundação) após extração do design system.*
