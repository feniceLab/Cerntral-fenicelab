# Auditoria — estado atual da Central (Fase 0)

> Data: 2026-06-02 · Levantamento visual + de código do `Cerntral-fenicelab` antes de estruturar a área dos clientes Fenice Lab.
> Screenshots em `.devlogs/shots/` (auth.png · painel.png · portal.png), capturados dos dev servers locais.

## Como foi levantado
- `corepack pnpm install` (78 pacotes; esbuild.exe presente no store pnpm).
- 3 dev servers Vite: auth `:5180/`, painel `:5181/painel/`, portal `:5182/portal/`.
- Screenshots via Chrome headless.

## Mapa das áreas

### `apps/auth` → `/` — ✅ pronto
Login real (Supabase). Toggle **Sou cliente / Sou da agência**, e-mail + senha, "Lembrar de mim",
"Esqueci a senha", primeiro acesso. Marca terrosa aplicada (Fraunces/Inter, selo flor-da-vida).
Sem gaps relevantes para esta frente.

### `apps/painel` → `/painel/` — ⚠️ mistura agências
Tela única **Clientes** (sidebar só tem "Clientes"; rodapé "Dante · Admin Central").
Busca ao vivo `GET {VITE_TRAFEGO_URL||relatorios.fenicelab.com.br}/api/clients`.

**🔴 Gap principal:** o card-header mostra **10 clientes**, misturando **Starken** (Academia São Pedro,
Hamburgueria Feio, Madrugão Centro/Garcia/Fortaleza) **e Fenice** (Suprema, Oca, Arena, Império, cotafácil).
A central da Fenice deveria listar **só os 5 Fenice** — hoje o filtro por agência só muda a cor do badge,
não esconde os outros.

Outros gaps:
- Cards **não abrem nada** (`go={() => {}}` em `App.tsx`; comentário diz que deveriam abrir o portal embutido).
- **Sem central de tráfego pago** (visão cross-client de gasto/ROAS/vendas). Há um `data.ts` com mock
  (inclui "Feio Burguer", que é Starken) e ícones de tráfego, mas nada renderizado.

### `apps/portal` → `/portal/` — 🟡 mock
Portal mobile (device frame) fixo em **Suprema Pizza** ("Bom dia, Dani"). Abas **Início / Agenda /
Galeria / Relatórios** + FAB. Toggle de superfície **Portal do Cliente / Trafego Pago**.
- Dados **mockados** (seguidores, engajamento, posts, fila de aprovação).
- Superfície **Trafego Pago** = `<iframe>` para `relatorios.fenicelab.com.br/**suprema-report.html**`
  com **slug fixo** (não é por-cliente; virá da sessão).

### `shared` — ✅ base ok
Design system: tokens da marca, componentes (Button/Card/Badge/StatCard/Field/Toggle/Avatar…),
fontes, `lib/supabase.ts`, assets (selo/flor + fotos). Serve os 3 apps via alias `@fenice/shared`.

## Conclusão (o que estruturar a seguir)
1. **Filtrar a central para Fenice Lab** (5 clientes) — fim da mistura com Starken. → Fase 1
2. **Módulo canônico dos clientes Fenice** no repo (identidade/slug/ad_account/status/URLs). → Fase 1
3. **Consolidar o serviço de tráfego** dentro do repo (1 repo só, same-domain). → Fase 2
4. **Central de tráfego + card→dashboard do cliente + slug dinâmico no portal**. → Fase 3

## Backend de tráfego (referência, hoje fora do repo)
`feniceLab/dashboard-tr-fego-pago` (local `g:\...\dashboard\`): Node `server.mjs` + hubs/relatórios HTML + `data/`.
Hubs Fenice prontos: `arena/`, `suprema/`. Vazios: `oca/`, `cotafacil/`, `imperio/`. Starken (`feio/`,`centro/`,`garcia/`) e `eventos/` Hamburger Day **não** entram na Fenice.
