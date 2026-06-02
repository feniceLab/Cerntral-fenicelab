---
documento: Pacote de Validação — Willian (Fase 1)
data: 2026-06-01
de: Dante + Fenice
para: Willian
status: aguardando validação
referencias: ["00-Central/PRD - Sistema Central Fenice Lab (v1).md", "00-Central/Plano Tecnico - Fase 1 (Sistema Central).md", "00-Central/Manual da Marca - Fenice Lab.md"]
tags: [fenice, validacao, fase-1, willian]
---

# ✅ Pacote de Validação — Willian (Fase 1)

> **Will, leitura de 5 min.** O PRD do Sistema Central está finalizado (v1.1) e o Plano Técnico da Fase 1 está pronto. Não precisa ler tudo agora — preciso só do seu aval/ajuste nos **2 vereditos** e nas **8 perguntas** abaixo. Depois disso, começamos a construir.
> Docs completos: `PRD-Sistema-Central.md` · `Plano-Tecnico-Fase-1.md` · `Manual-da-Marca.md`.

---

## 🎯 2 vereditos para você bater o martelo

### 1. Framework do frontend → proposta: **React + Vite + TypeScript + Tailwind**
- **Por quê:** build estático (mantém deploy rsync na VPS, sem servidor Node nos 6GB), casa com Supabase, forte em dashboard, PWA fácil.
- **Plano B:** se você curte mais Svelte, trocamos só a base do front — Supabase, schema e deploy não mudam.
- ➡️ **Você aprova React+Vite ou prefere outro?**

### 2. Cobrança de LLM (conselho de clones) → proposta: **simples**
- Llama/Groq **grátis** incluído no Portal · GPT/Claude = **chave do cliente** (ele paga o uso) · add-on "IA Premium gerenciada" só no futuro.
- ➡️ **Fecha assim, ou já quer o add-on no lançamento?**

---

## ❓ 8 perguntas técnicas para a reunião

1. **Framework:** React+Vite ok? Ou Svelte/outro?
2. **Monorepo:** pnpm workspaces serve? Ou prefere Turborepo / npm workspaces?
3. **Estilo:** Tailwind com tokens da marca, ou CSS próprio do design system?
4. **Schema/RLS:** revisar as 5 tabelas-núcleo da Fase 1 (`agencias`, `usuarios`, `clientes`, `marca_designsystem`, `telegram_grupos`) + o conceito de RLS. Falta alguma tabela?
5. **Migração:** começamos pela Arena ou pela Suprema? Tem subdomínio de staging pra testar?
6. **Supabase:** quem cria o projeto e guarda as keys (service_role)? Definir dono dos secrets.
7. **Deploy:** o `deploy.sh` atual cobre build estático do Vite, ou precisa ajustar?
8. **Cobrança LLM:** o modelo do veredito 2 fecha pra você?

---

## 📦 O que já está definido (não precisa rediscutir — só ciência)
- **Arquitetura:** monorepo `Cerntral-fenicelab` + Supabase (auth/banco/edge) + VPS p/ front e materiais. n8n descartado.
- **Multi-tenant** desde já (RLS obrigatório — risco crítico de vazar dado entre clientes).
- **Telegram:** 1 bot `@fenicebot_bot` em vários grupos; painel central = 1 grupo com tópicos.
- **Identidade:** tudo segue o Manual da Marca (paleta terrosa, Fraunces/Inter, `fenice.`).
- **Definição de Pronto da Fase 1:** monorepo + `shared/` + Supabase(auth/schema/RLS) + 1 cliente migrado em staging sem downtime.

---

## ▶️ Depois do seu aval
1. Coletar as 5 credenciais 🟢 (Supabase, Telegram, Groq, VPS, GitHub).
2. Criar monorepo + `shared/` (tokens da marca).
3. Supabase no ar (auth + schema + RLS) + teste de isolamento.
4. Migrar 1 cliente para `shared/` em staging → validar → produção.

*Aguardando: ✅ aval do Willian nos 2 vereditos + 8 respostas → liberamos a construção da Fase 1.*
