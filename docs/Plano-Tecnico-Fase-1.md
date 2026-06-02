---
documento: Plano Técnico — Fase 1 (Fundação)
produto: Sistema Central Fenice Lab
versao: 1.0 (validado por Dante + Willian em 01/06)
data: 2026-06-01
autores: [Dante Martins, Willian, Fenice (Claude)]
base: 00-Central/PRD - Sistema Central Fenice Lab (v1).md
status: validado — pronto para iniciar a Fase 1 (após extração do design system)
tags: [fenice, sistema-central, plano-tecnico, fase-1, supabase, monorepo]
---

# 🏗️ Plano Técnico — Fase 1 (Fundação)

> Ponte entre o **PRD v1.1** e o código. Define a fundação técnica (framework, monorepo, schema multi-tenant, Supabase, migração). **Nada aqui é código ainda** — é especificação validada por Dante + Willian.
> **Princípio:** trabalhar com a verdade — propostas honestas, com prós/contras reais.

---

## PARTE A — Decisões (validadas em 01/06)

### A1. Framework do Frontend → ✅ **DECIDIDO: React + Vite (SPA) + TypeScript**

**Por que esta combinação se encaixa na realidade da Fenice:**
- Os apps atuais (Suprema, Arena) já são **estáticos servidos na VPS via openresty** → React+Vite faz **build estático** e mantém o deploy por `rsync` que já funciona, **sem precisar de servidor Node na VPS** (importante: 6GB RAM, sem folga).
- Backend é **Supabase** → o cliente JS do Supabase (auth, banco, realtime) é first-class em React.
- O portal é **dashboard pesado** (gráficos, métricas em tempo real, aprovações) → React tem o maior ecossistema para isso (gráficos, tabelas, componentes).
- **PWA** (requisito RNF-02) → `vite-plugin-pwa` resolve instalável + offline básico.

**Comparativo honesto:**
| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| **React + Vite (SPA)** ✅ | Build estático, ecossistema enorme, casa com Supabase, PWA fácil, deploy atual mantido | SPA puro = SEO fraco (irrelevante: portal é logado) | **Escolhido** |
| Next.js | Poderoso, SSR | Pede runtime Node na VPS (peso) ou export estático que perde recursos | Evitar por ora |
| Astro | Ótimo p/ estático/conteúdo | Portal é muito interativo; vira força contra | Não como base |
| SvelteKit | Leve, rápido | Menor ecossistema | Descartado |

**Stack de apoio (validada 01/06):**
- **Linguagem:** TypeScript (segurança de tipos no multi-tenant).
- **Estilo:** ✅ **CSS próprio do design system** — o `Fenice-Design-System.html` já traz os tokens como variáveis CSS; eles viram a base do `shared/`. **NÃO usar Tailwind.**
- **Gráficos:** Recharts (ou similar leve) para evolução/seguidores/ROAS.
- **Monorepo:** ✅ **pnpm workspaces** (recomendação da Fenice: mais leve e nativo; Turborepo entra depois sem retrabalho, só se a escala pedir build-cache).
- **PWA:** vite-plugin-pwa.

> ✅ Decidido (01/06): React + Vite confirmado pela dupla fundadora. (Svelte descartado.)

### A2. LLM dos clones e cobrança → ✅ **DECIDIDO (01/06): Claude Haiku, sem cobrança no início**

Decisão do Dante: como há **poucos clientes** e o consumo de token será baixo, no início **não haverá cobrança** pelo conselho de IA. Os clones rodam em **Claude Haiku** (modelo barato e rápido da Anthropic, `claude-haiku-4-5`), na conta da própria Fenice.

**Modelo inicial (agora):**
1. **LLM padrão dos clones = Claude Haiku** (chave Anthropic da Fenice). Barato; cobre o volume atual com folga.
2. **Sem cobrança ao cliente** pelo uso de IA (incluído).
3. A Edge Function chama a API da Anthropic com Haiku, vestindo a personalidade certa (Hormozi, Sobral...).

**Futuro (quando escalar — rever com Hormozi):**
- Adicionar **Groq/Llama** como fallback grátis se o volume crescer.
- Permitir **chave do próprio cliente** (GPT/Claude) e/ou add-on "IA Premium gerenciada" com cobrança.

**Por que assim:** simplicidade máxima no início (uma só LLM, uma só chave), custo controlado e previsível, e a porta de multi-LLM/cobrança fica aberta para quando fizer sentido. Honesto: começamos enxuto, sem cobrar pelo que custa centavos.

---

## PARTE B — Plano Técnico da Fase 1 (Fundação)

> Objetivo da Fase 1: ter **monorepo + design system `shared/` + Supabase (auth e schema multi-tenant)** de pé, com Suprema/Arena migrados para o `shared/` **sem quebrar o que está no ar**.

### B1. Stack definida (validada 01/06)
- Front: React + Vite + TypeScript + **CSS próprio do design system** (não Tailwind) + vite-plugin-pwa.
- Monorepo: **pnpm workspaces**.
- Backend: Supabase (Postgres + Auth + Edge Functions + Storage de metadados) — **projeto no Supabase da empresa**.
- LLM dos clones: **Claude Haiku** (`claude-haiku-4-5`, chave Anthropic da Fenice) — sem cobrança ao cliente no início.
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
1. Criar projeto `fenice-central` **na conta Supabase da empresa**. Dono dos segredos: **Dante (admin central)**.
2. Guardar `Project URL`, `anon key`, `service_role key` em **Supabase Secrets** + `.env` local (fora do Git). Adicionar também a **chave Anthropic (Claude Haiku)** aos secrets.
3. Configurar **Auth** (e-mail+senha; recuperação por e-mail; sem signup público — Fenice cria os logins).
4. Aplicar migrations do schema B3 + ligar RLS.
5. Validar com 2 usuários de teste (1 admin central, 1 cliente) que o isolamento funciona.

### B5. Migração Suprema/Arena para `shared/` (sem quebrar produção)
> ⏳ **Sequência decidida (01/06):** a migração só começa **depois** que o Dante enviar a **extração do design system** (em andamento). Primeiro montamos o `shared/` a partir dela, depois migramos.
> Risco "alto" no PRD — fazer incremental:
1. Receber a extração do design system (Dante envia) → montar `shared/tokens` + `shared/components` **sem tocar no que está no ar**.
2. Migrar **UM** cliente (ex: Arena) para consumir o `shared/` em **staging** (subdomínio de teste).
3. Validar visualmente (paridade com produção) → só então apontar o domínio real.
4. Repetir para a Suprema.
5. `deploy.sh` continua publicando por domínio o tempo todo.

### B6. Ambiente e segredos
- `.env.example` versionado (só nomes das variáveis).
- Valores reais em Supabase Secrets / `.env` local **nunca no Git**.
- Chaves de LLM de cliente → criptografadas na tabela `chaves_llm` (fase futura).

### B7. Definição de Pronto da Fase 1 (Definition of Done)
- [ ] Monorepo criado com pnpm workspaces + estrutura B2.
- [ ] `shared/` com tokens da marca aplicáveis (paleta terrosa, Fraunces/Inter).
- [ ] Supabase no ar: auth + schema multi-tenant + RLS ligado.
- [ ] Teste de isolamento passando (cliente A não vê dado de B).
- [ ] Arena OU Suprema rodando do `shared/` em staging, com paridade visual.
- [ ] `deploy.sh` publicando por domínio sem downtime.
- [ ] `.env.example` + segredos fora do Git.

---

## PARTE C — Status das decisões (validado 01/06)

1. **Framework:** ✅ React + Vite.
2. **Monorepo:** ✅ pnpm workspaces (recomendação da Fenice).
3. **Estilo:** ✅ CSS próprio do design system (não Tailwind).
4. **Schema/RLS:** ⏳ Willian revisa as 5 tabelas-núcleo na construção (seguimos com a proposta, ajustável).
5. **Migração:** ✅ inicia após o Dante enviar a extração do design system. Cliente-piloto a definir (recomendação: Arena, por ser mais simples).
6. **Supabase:** ✅ projeto na conta da empresa; dono dos segredos = Dante (admin central).
7. **Deploy:** ⏳ confirmar com o Willian se o `deploy.sh` atual cobre o build do Vite.
8. **LLM/cobrança:** ✅ Claude Haiku, sem cobrança no início (poucos clientes, baixo consumo).

---

## Sequência sugerida
1. ✅ Validar Parte A + B (feito 01/06).
2. Coletar as 5 credenciais 🟢 do PRD §12.1 (Supabase, Telegram, Groq/—, VPS, GitHub) + chave Anthropic.
3. Criar monorepo + `shared/` (tokens da marca) — **após extração do design system**.
4. Subir Supabase (auth + schema + RLS) + teste de isolamento.
5. Migrar 1 cliente para `shared/` em staging → validar → produção.
6. Fechar a Fase 1 (Definition of Done B7) → seguir para a Fase 2 (Portal do Cliente — núcleo).

---

*Plano Técnico Fase 1 · v1.0 (validado) · Fenice Lab · 01/06/2026 · aguardando: extração do design system (Dante) + confirmação do deploy.sh (Willian) → inicia a Fase 1. Sem código nesta etapa.*
