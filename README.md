# 🔥 Cerntral-fenicelab — Sistema Central Fenice Lab

Monorepo do **Sistema Central da Fenice Lab** — a plataforma que centraliza toda a operação da agência (clientes, conteúdo, aprovações, métricas, agenda) + o **Portal do Cliente** com o **Conselho de Clones de IA**.

> Status: **documentação concluída · construção ainda não iniciada** (aguardando validação técnica do Willian).
> Princípio do projeto: *trabalhar sempre com a verdade — transparência total é o produto.*

## 📚 Documentação (`/docs`)

| Documento | O que é |
|---|---|
| [Manual da Marca](docs/Manual-da-Marca.md) | Identidade da Fenice — posicionamento, tom de voz, paleta terrosa, planos da Fênix |
| [PRD — Sistema Central](docs/PRD-Sistema-Central.md) | Contrato do produto (v1.1): escopo, 87 requisitos, arquitetura, modelo de dados |
| [Plano Técnico — Fase 1](docs/Plano-Tecnico-Fase-1.md) | Fundação: framework, monorepo, schema multi-tenant + RLS, migração (proposta) |
| [Plano de Implementação da Marca](docs/Plano-de-Implementacao-Marca.md) | Como a marca vira a base visual do app |
| [Validação — Willian](docs/Validacao-Willian-Fase-1.md) | Leitura de 5 min: 2 vereditos + 8 perguntas para liberar a construção |

## 🏗️ Stack (proposta — a validar)
- **Frontend:** React + Vite + TypeScript + Tailwind (tokens da marca) · PWA
- **Backend:** Supabase (Postgres + Auth + Edge Functions) — multi-tenant com RLS
- **Deploy:** build estático → VPS Fenix (openresty), domínio por cliente
- **IA:** Groq/Llama (padrão) + GPT/Claude (chave do cliente)
- **Mensageria:** Telegram (1 bot `@fenicebot_bot`)

## 📂 Estrutura planejada do monorepo
```
shared/        → design system único (tokens da marca + componentes + clones/)
central-app/   → painel da Fenice (admin)
portal/        → portal do cliente
clientes/      → dados/branding por cliente (suprema, arena...)
supabase/      → migrations + edge functions
deploy.sh      → deploy por domínio
```

## ▶️ Próximo passo
Validar o [pacote do Willian](docs/Validacao-Willian-Fase-1.md) → coletar credenciais → iniciar a Fase 1 (Fundação).

---
*Fenice Lab · contato@fenicelab.com.br*
