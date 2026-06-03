# services/relatorios — Serviço de Tráfego/Relatórios (Fenice Lab)

> Importado de `feniceLab/dashboard-tr-fego-pago` e consolidado **dentro** do monorepo
> `Cerntral-fenicelab` em 2026-06-02 (Fase 2). **Escopo: só clientes Fenice Lab.**
> A versão Starken vive em outro repo (`ferramentastecnologia/central-clientes`).

## O que é
Servidor Node puro (sem dependências — `server.mjs`) que serve:
- **Relatórios/hubs estáticos por cliente** (`<slug>-report.html`, `<slug>/index.html`).
- **APIs**: `/api/clients` (público, sem $), `/api/agendamentos`, `/api/renovacao`, `/api/admin/status`.
- **Admin** (`/admin/`, Basic Auth) — agendamentos e renovação.

É a fonte das **métricas ao vivo** que o `apps/painel` e `apps/portal` consomem (o front só renderiza).

## Clientes (Fenice-only)
`data/clients-mapping.json` → suprema · oca · arena · cotafacil · imperio (em setup).
`data/client-aliases.json` → mapeia slug → pasta de assets do cliente.
> Hubs prontos: `arena/`, `suprema/`. Faltam criar: `oca/`, `cotafacil/`, `imperio/` (Fase 3).

## Rodar local
```bash
# da raiz do monorepo:
pnpm dev:relatorios            # node services/relatorios/server.mjs
# variáveis (ver .env.example da raiz): PORT, META_GRAPH_TOKEN, ADMIN_USER, ADMIN_PASS
```
Sem `META_GRAPH_TOKEN`, o `/api/clients` ainda responde (cai no `ig_username` do mapping);
dados ao vivo do Instagram/Meta só com o token.

Para o front apontar pra cá em dev: `VITE_TRAFEGO_URL=http://localhost:3030`.

## Pendências de produção (com o Willian — Fase 2b)
Conforme o ADR de 02/06 (mover o serviço pra dentro da central):
- [ ] Rodar como backend da central via **PM2** (porta interna) na VPS Fenix.
- [ ] **OpenResty** com `proxy_pass` em `/relatorios` e `/api/*` no vhost `central.fenicelab.com.br`.
- [ ] Trocar o iframe externo (`relatorios.fenicelab.com.br`) por **same-domain**.
- [ ] Novo job no `.github/workflows/deploy.yml` pro serviço (hoje só builda os 3 apps estáticos).
- [ ] Decidir o fim do vhost `relatorios.fenicelab.com.br` (301 → central) ou mantê-lo.

## Notas
- `data/snapshot.json` é um **cache gerado** (stale) — regenera no próximo pull de dados.
- `README.md`/`DEPLOY.md` aqui são os do repo de origem (referência histórica).
