---
documento: Plano Técnico — Fase 1 (Fundação)
produto: Sistema Central Fenice Lab
versao: 0.1 (proposta para validar com Willian)
data: 2026-06-01
autores: [Dante Martins, Fenice (Claude)]
base: 00-Central/PRD - Sistema Central Fenice Lab (v1).md
status: proposta — aguardando validação técnica do Willian
tags: [fenice, sistema-central, plano-tecnico, fase-1, supabase, monorepo]
---

# 🏗️ Plano Técnico — Fase 1 (Fundação)

> Ponte entre o **PRD v1.1** e o código. Resolve as 2 pendências que sobraram e desenha a fundação técnica (framework, monorepo, schema multi-tenant, Supabase, migração). **Nada aqui é código ainda** — é especificação para o Willian validar antes de construir.
> **Princípio:** trabalhar com a verdade — propostas honestas, com prós/contras reais; o Willian (dev) tem a palavra final na parte técnica.

---

## PARTE A — Decisões Pendentes (proposta para o Willian validar)

### A1. Framework do Frontend → **proposta: React + Vite (SPA) + TypeScript**

**Por que esta combinação se encaixa na realidade da Fenice:**
- Os apps atuais (Suprema, Arena) já são **estáticos servidos na VPS via openresty** → React+Vite faz **build estático** e mantém o deploy por `rsync` que já funciona, **sem precisar de servidor Node na VPS** (importante: 6GB RAM, sem folga).
- Backend é **Supabase** → o cliente JS do Supabase (auth, banco, realtime) é first-class em React.
- O portal é **dashboard pesado** (gráficos, métricas em tempo real, aprovações) → React tem o maior ecossistema para isso (gráficos, tabelas, componentes).
- **PWA** (requisito RNF-02) → `vite-plugin-pwa` resolve instalável + offline básico.

**Comparativo honesto:**
| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| **React + Vite (SPA)** ✅ | Build estático, ecossistema enorme, casa com Supabase, PWA fácil, deploy atual mantido | SPA puro = SEO fraco (irrelevante: portal é logado) | **Recomendado** |
| Next.js | Poderoso, SSR | Pede runtime Node na VPS (peso) ou export estático que perde recursos | Evitar por ora |
| Astro | Ótimo p/ estático/conteúdo | Portal é muito interativo; vira força contra | Não como base |
| SvelteKit | Leve, rápido | Menor ecossistema; depende de familiaridade do Willian | Alternativa se o Willian preferir |

**Stack de apoio proposta (validar com Willian):**
- **Linguagem:** TypeScript (segurança de tipos no multi-tenant).
- **Estilo:** Tailwind CSS configurado com os **tokens da marca** (Terra, Cotta, Avorio, Caffè, Flame, Fraunces/Inter) → o `shared/` vira a fonte desses tokens.
- **Gráficos:** Recharts (ou similar leve) para evolução/seguidores/ROAS.
- **Monorepo:** **pnpm workspaces** (mais leve que Turborepo para começar).
- **PWA:** vite-plugin-pwa.

> ⚠️ Pergunta para o Willian: você tem mais fluência em React ou Svelte? Se Svelte, trocamos a base sem mudar o resto do plano (Supabase, schema e deploy continuam iguais).

### A2. Modelo de Cobrança das Chaves de LLM → **proposta: simples e transparente**

A decisão de produto (PRD) já trava: **Llama/Groq grátis como padrão**, GPT/Claude com **chave do próprio cliente**. Falta só o modelo comercial:

**Proposta (validar comercialmente / sessão Hormozi):**
1. **Conselho de IA incluído (sem custo extra)** nos planos que têm Portal (Combustão e Renascimento), rodando em **Llama/Groq** — custo marginal ≈ zero para a Fenice (tier grátis).
2. **GPT/Claude = chave do cliente** → o cliente paga o próprio uso. A Fenice **não cobra** por isso (é conveniência dele).
3. **Add-on futuro opcional — "IA Premium Gerenciada":** para o cliente que NÃO quer trazer chave própria, a Fenice oferece GPT/Claude com a chave dela, cobrando **+R$ X/mês** (cobre o uso + margem). Só ativar quando houver demanda.

**Por que assim:** mantém o diferencial (conselho de IA) sem risco de custo descontrolado, sem fricção de cobrança, e deixa uma porta de upsell (IA Premium) para depois. Honesto: ninguém paga por token escondido.

---

## PARTE B — Plano Técnico da Fase 1 (Fundação)

> Objetivo da Fase 1: ter **monorepo + design system `shared/` + Supabase (auth e schema multi-tenant)** de pé, com Suprema/Arena migrados para o `shared/` **sem quebrar o que está no ar**.

### B1. Stack definida (a confirmar em A1)
- Front: React + Vite + TypeScript + Tailwind (tokens da marca) + vite-plugin-pwa.
- Backend: Supabase (Postgres + Auth + Edge Functions + Storage de metadados).
- Deploy: build estático → `rsync`/SSH → VPS Fenix (openresty), domínio por cliente (como hoje).
- Materiais pesados: VPS (fora do Git).

### B2. Estrutura do monorepo `Cerntral-fenicelab` (proposta)
```
Cerntral-fenicelab/
├── package.json                 # raiz (pnpm workspaces)
├── pnpm-workspace.yaml
├── shared/                      # DESIGN SYSTEM ÚNICO (implementa o Manual da Marca)
│   ├── tokens/                  # cores terrosas, tipografia, espaçamento, raios
│   ├── components/              # botões, inputs, cards, tabelas, alertas...
│   └── clones/                  # 1 .md por clone (frontmatter: nome, especialidade, prompt)
├── central-app/                 # Painel da Fenice (admin)
├── portal/                      # Portal do cliente (template; consome dados por cliente)
├── clientes/
│   ├── suprema/                 # só dados/branding específicos
│   └── arena/
├── template-cliente/            # molde p/ cliente novo
├── supabase/                    # migrations (SQL), edge functions, config
├── deploy.sh                    # deploy unificado por domínio
└── .env.example                 # nomes das variáveis (sem valores!)
```

### B3. Schema multi-tenant + RLS (spec — DDL escrito só na execução)
> Regra de ouro: **toda tabela carrega `agencia_id`** (white-label) e, quando aplicável, `cliente_id`. **RLS (Row Level Security) liga em TODAS as tabelas** — é o que impede vazar dado entre clientes/agências (risco crítico do PRD).

Tabelas da Fase 1 (núcleo de auth/tenancy; demais entram nas fases seguintes):
| Tabela | Campos-chave | Observação |
|---|---|---|
| `agencias` | id, nome, branding, dominio, plano_licenca | Fenice = 1ª linha |
| `usuarios` | id, agencia_id, email, papel, cliente_id? | papel: admin_central / admin_cliente / membro / cliente |
| `clientes` | id, agencia_id, nome, slug, dominio, status, plano, addons | |
| `marca_designsystem` | cliente_id, cores, tipografia, logos, tom_de_voz | alimenta o brand book |
| `telegram_grupos` | id, cliente_id, chat_id | criado no onboarding |

**Política RLS (conceito):** um usuário só enxerga linhas onde `agencia_id = sua agência` E (`cliente_id = seu cliente` OU papel é admin_central/admin_cliente com escopo). Escrever as policies + **teste de isolamento** (tentar ler dado de outro cliente e falhar) é tarefa obrigatória da Fase 1.

### B4. Setup do Supabase (Fase 1)
1. Criar projeto `fenice-central`.
2. Guardar `Project URL`, `anon key`, `service_role key` em **Supabase Secrets** + `.env` local (fora do Git).
3. Configurar **Auth** (e-mail+senha; recuperação por e-mail; sem signup público — Fenice cria os logins).
4. Aplicar migrations do schema B3 + ligar RLS.
5. Validar com 2 usuários de teste (1 admin central, 1 cliente) que o isolamento funciona.

### B5. Migração Suprema/Arena para `shared/` (sem quebrar produção)
> Risco "alto" no PRD — fazer incremental:
1. Extrair o design system mais rico (Suprema) para `shared/tokens` + `shared/components` **sem tocar no que está no ar**.
2. Migrar **UM** cliente (ex: Arena) para consumir o `shared/` em **staging** (subdomínio de teste).
3. Validar visualmente (paridade com produção) → só então apontar o domínio real.
4. Repetir para a Suprema.
5. `deploy.sh` continua publicando por domínio o tempo todo.

### B6. Ambiente e segredos
- `.env.example` versionado (só nomes das variáveis).
- Valores reais em Supabase Secrets / `.env` local **nunca no Git**.
- Chaves de LLM de cliente → criptografadas na tabela `chaves_llm` (fase do Conselho).

### B7. Definição de Pronto da Fase 1 (Definition of Done)
- [ ] Monorepo criado com pnpm workspaces + estrutura B2.
- [ ] `shared/` com tokens da marca aplicáveis (paleta terrosa, Fraunces/Inter).
- [ ] Supabase no ar: auth + schema multi-tenant + RLS ligado.
- [ ] Teste de isolamento passando (cliente A não vê dado de B).
- [ ] Arena OU Suprema rodando do `shared/` em staging, com paridade visual.
- [ ] `deploy.sh` publicando por domínio sem downtime.
- [ ] `.env.example` + segredos fora do Git.

---

## PARTE C — Checklist de Validação com o Willian

> Levar estas perguntas para a reunião de validação:

1. **Framework:** React+Vite ok? Ou prefere Svelte/outro? (muda só a base do front)
2. **Monorepo:** pnpm workspaces serve, ou prefere Turborepo/npm workspaces?
3. **Estilo:** Tailwind com tokens da marca, ou CSS próprio do design system?
4. **Schema/RLS:** revisar as tabelas da Fase 1 e o conceito de RLS; falta alguma tabela no núcleo?
5. **Migração:** Arena ou Suprema primeiro? Tem staging/subdomínio de teste disponível?
6. **Supabase:** quem cria o projeto e guarda as keys? (definir dono dos secrets)
7. **Deploy:** o `deploy.sh` atual cobre build estático do Vite, ou precisa ajustar?
8. **Cobrança LLM (A2):** o modelo proposto fecha, ou querem o add-on "IA Premium" já no lançamento?

---

## Sequência sugerida (sem datas fixas — depende do aval do Willian)
1. Validar Parte A + B com o Willian (esta reunião).
2. Coletar as 5 credenciais 🟢 do PRD §12.1 (Supabase, Telegram, Groq, VPS, GitHub).
3. Criar monorepo + `shared/` (tokens da marca).
4. Subir Supabase (auth + schema + RLS) + teste de isolamento.
5. Migrar 1 cliente para `shared/` em staging → validar → produção.
6. Fechar a Fase 1 (Definition of Done B7) → seguir para a Fase 2 (Portal do Cliente — núcleo).

---

*Plano Técnico Fase 1 · v0.1 (proposta) · Fenice Lab · 01/06/2026 · validar com Willian antes de construir. Sem código nesta etapa.*
