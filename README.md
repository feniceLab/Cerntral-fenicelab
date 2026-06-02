# 🔥 Cerntral-fenicelab — Sistema Central Fenice Lab

Monorepo do **Sistema Central da Fenice Lab** — a plataforma que centraliza toda a operação da agência (clientes, conteúdo, aprovações, métricas, agenda) + o **Portal do Cliente** com o **Conselho de Clones de IA**.

> Status: **documentação concluída · construção ainda não iniciada** (aguardando extração do design system).
> Princípio do projeto: *trabalhar sempre com a verdade — transparência total é o produto.*

## 📚 Documentação (`/docs`)

| Documento | O que é |
|---|---|
| [Manual da Marca](docs/Manual-da-Marca.md) | Identidade da Fenice — posicionamento, tom de voz, paleta terrosa, narrativa da Fênix |
| [Escopo & Planos da Fênix](docs/Escopo-Planos-Fenix.md) | Oferta oficial — 3 planos (R$1.5k/2k/3k), escopo de entrega, valor ancorado |
| [PRD — Sistema Central](docs/PRD-Sistema-Central.md) | Contrato do produto (v1.1): escopo, 87 requisitos, arquitetura, modelo de dados |
| [Plano Técnico — Fase 1](docs/Plano-Tecnico-Fase-1.md) | Fundação: React+Vite, CSS do design system, pnpm, Supabase multi-tenant + RLS, Claude Haiku |
| [Plano de Implementação da Marca](docs/Plano-de-Implementacao-Marca.md) | Como a marca vira a base visual do app |
| [Validação — Willian](docs/Validacao-Willian-Fase-1.md) | Decisões técnicas validadas (framework, stack, LLM) |

## 🏗️ Stack (validada)
- **Frontend:** React + Vite + TypeScript + **CSS do design system** (não Tailwind) · PWA · pnpm workspaces
- **Backend:** Supabase (Postgres + Auth + Edge Functions) — multi-tenant com RLS
- **Deploy:** build estático → VPS Fenix (openresty), domínio por cliente
- **IA dos clones:** Claude Haiku (`claude-haiku-4-5`) — sem cobrança no início
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
Extração do design system → montar o `shared/` → iniciar a Fase 1 (Fundação).

---
*Fenice Lab · contato@fenicelab.com.br*
