# Fase 2 — Consolidação do Tráfego no repo (1 repo só)

> Data: 2026-06-02 · branch `feat/area-clientes-fenice`.
> Objetivo: trazer o serviço de tráfego (`feniceLab/dashboard-tr-fego-pago`) **pra dentro** do
> `Cerntral-fenicelab`, já filtrado pros 5 clientes Fenice Lab.

## O que foi feito
- Importado o serviço para **`services/relatorios/`** (sem `.git`, `.env`, `node_modules`).
- Removido tudo que é **Starken**: pastas `feio/ centro/ garcia/ eventos/` e relatórios `feio-report.html`, `web-report-feio.html`.
- **Dados Fenice-only**:
  - `data/clients-mapping.json` → 5 clientes (suprema, oca, arena, cotafacil, imperio).
  - `data/client-aliases.json` → só os 5 slugs Fenice → pastas de assets.
  - `data/crons.json` → removida a cron da Academia (Starken).
  - `data/renovacao-mes.json` → removida a campanha do Feio (Starken).
- **Integração no monorepo**: script `pnpm dev:relatorios` (rodava `@fenice/trafego` inexistente → agora `node services/relatorios/server.mjs`); `.env.example` raiz documenta `PORT/META_GRAPH_TOKEN/ADMIN_*` e `VITE_TRAFEGO_URL`; `.gitignore` ignora `.devlogs`.
- Doc do serviço: `services/relatorios/_LEIA-FENICE.md`.

## Validação (local, sem token)
- `node services/relatorios/server.mjs` (PORT 3030) sobe com 5 aliases.
- `GET /api/clients` → **5 clientes, todos Fenice Lab, 0 Starken** (`by_agencia.Starken = 0`).
- `GET /suprema-report.html` → 200.

## Pendente (Fase 2b — produção, com o Willian)
- PM2 (porta interna) na VPS Fenix + OpenResty `proxy_pass` `/relatorios` e `/api/*` no vhost da central.
- Trocar o iframe externo por **same-domain** (`apps/portal` `TrafegoSurface` e `apps/painel` `Clientes`).
- Job de deploy do serviço no `.github/workflows/deploy.yml`.
- Destino do vhost `relatorios.fenicelab.com.br`: **DESATIVAR** (decisão do Juan, 02/06) — o
  serviço passa a viver só dentro da central. ⚠️ Só desativar **depois** do same-domain no ar,
  senão o iframe de produção quebra. A origem do tráfego no front é configurável (`VITE_TRAFEGO_URL`).

## Snapshot
`data/snapshot.json` é cache gerado (stale, 29/05) — regenera no próximo pull de dados; não foi editado à mão.
