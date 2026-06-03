// ============================================================
// Reposições — saldo das contas + renovação de budget mensal.
// Renovações: dados reais (services/relatorios/data/renovacao-mes.json).
// Saldo: o MCP NÃO expõe `balance` — só o serviço de tráfego (token) puxa via
// me/adaccounts. Por ora `saldo` fica null (estado "sincronizar"); o alerta de
// saldo baixo já está implementado (cobertura em dias). Gasto/dia ≈ maio real.
// ============================================================
import { CLIENTES_FENICE } from '@fenice/shared';

export const MES = 'Junho 2026';

// ---------- SALDO (tempo real via /api/saldo) ----------
// cartao = cobra no cartão (sem "saldo baixo"); cap = disponível = cap − gasto.
export type NivelSaldo = 'critico' | 'baixo' | 'ok' | 'cartao' | 'sincronizar';

// same-domain por padrão (OpenResty proxy /api → serviço). Dev: VITE_TRAFEGO_URL no .env.local.
const TRAFEGO = (import.meta as any).env?.VITE_TRAFEGO_URL || '';

// gasto/dia ≈ investido de maio ÷ 31 (base p/ cobertura em dias enquanto não há gasto diário ao vivo)
const GASTO_DIA: Record<string, number | null> = { suprema: 75.83, arena: 36.68, oca: null };

export interface SaldoLive {
  slug: string; name: string; ad_account_id: string;
  balance_cents: number | null; amount_spent_cents: number | null; spend_cap_cents: number | null;
  funding_tipo: 'cartao' | 'prepago' | 'outro' | null;
  disponivel_cents: number | null;   // saldo pré-pago disponível (Meta display_string)
  a_faturar_cents: number | null;    // valor a faturar no cartão
  account_status: number | null; found: boolean; currency: string;
}
export interface Saldo {
  slug: string; nome: string; cor: string;
  funding: 'cartao' | 'cap' | 'prepago' | null;
  /** disponível em R$ (cap − gasto) p/ contas com limite; null p/ cartão. */
  disponivel: number | null;
  /** valor acumulado a faturar no cartão (balance) — só p/ funding cartao. */
  noCartao: number | null;
  gastoDiaMedio: number | null;
  diasCobertura: number | null; nivel: NivelSaldo; obs?: string;
}

const meta = (slug: string) => CLIENTES_FENICE.find((c) => c.slug === slug);

/** Busca o saldo ao vivo do serviço de tráfego (me/adaccounts). */
export async function fetchSaldosLive(): Promise<SaldoLive[]> {
  const r = await fetch(`${TRAFEGO}/api/saldo`);
  const d = await r.json();
  return (d.clients ?? []) as SaldoLive[];
}

const cents = (c: number | null | undefined) => (c != null ? c / 100 : null);

/** Monta os cards de saldo a partir do serviço (autoritativo):
 *  cartão → "a faturar" (sem alerta); pré-pago → saldo disponível real + cobertura/alerta. */
export function buildSaldos(live: SaldoLive[]): Saldo[] {
  const bySlug: Record<string, SaldoLive> = {};
  for (const l of live) bySlug[l.slug] = l;
  const slugs = ['suprema', 'arena', 'oca'];
  return slugs.map((slug) => {
    const m = meta(slug);
    const l = bySlug[slug];
    const base = { slug, nome: m?.nome ?? slug, cor: m?.cor ?? '#9a8c7a', gastoDiaMedio: GASTO_DIA[slug] ?? null };

    if (!l || !l.found) {
      return { ...base, funding: m?.funding ?? null, disponivel: null, noCartao: null, diasCobertura: null, nivel: 'sincronizar' as NivelSaldo, obs: 'Aguardando saldo do serviço.' };
    }

    // tipo do serviço (autoritativo); fallback no cadastro
    const funding = (l.funding_tipo as Saldo['funding']) ?? m?.funding ?? null;

    if (funding === 'cartao') {
      return { ...base, funding, disponivel: null, noCartao: cents(l.a_faturar_cents) ?? cents(l.balance_cents), diasCobertura: null, nivel: 'cartao' as NivelSaldo, obs: 'Cobra no cartão — sem saldo a zerar.' };
    }

    // pré-pago → saldo disponível real (Meta) + cobertura
    const disponivel = cents(l.disponivel_cents);
    const gastoDia = base.gastoDiaMedio;
    const dias = disponivel != null && gastoDia ? disponivel / gastoDia : null;
    let nivel: NivelSaldo;
    if (disponivel == null) nivel = 'sincronizar';
    else if (disponivel <= 0.5 || (dias != null && dias < 3)) nivel = 'critico';
    else if (dias != null && dias < 7) nivel = 'baixo';
    else nivel = 'ok';
    const obs = disponivel != null && disponivel <= 0.5
      ? 'Saldo zerado — repor via PIX.'
      : (gastoDia ? undefined : 'Gasto/dia não estimado.');
    return { ...base, funding, disponivel, noCartao: null, diasCobertura: dias, nivel, obs };
  });
}

// ---------- RENOVAÇÕES (reais — junho) ----------
export type StatusReposicao = 'renovada' | 'manual' | 'pendente';
export interface Reposicao {
  slug: string; campanha: string; tipo: string;
  gastoHistorico: number | null;   // = lifetime antes (o já gasto)
  budgetNovoMes: number | null;    // budget do novo mês
  novoLifetime: number | null;     // = histórico + novo mês (fórmula da skill)
  decisao: string | null; justificativa: string | null; status: StatusReposicao;
}
// novoLifetime = gastoHistorico + budgetNovoMes  (regra: gasto_total_historico + budget_do_novo_mes)
export const REPOSICOES: Reposicao[] = [
  { slug: 'suprema', campanha: '[STARKEN][VENDAS][MAIO][01]', tipo: 'CBO',
    gastoHistorico: 600, budgetNovoMes: 900, novoLifetime: 1500,
    decisao: 'Subir +50% (R$ 900)', justificativa: 'ROAS histórico 29,15× — campanha jovem (lua de mel). Escalar 50% captura demanda sem destruir ROAS.', status: 'renovada' },
  { slug: 'suprema', campanha: '[STARKEN][VENDAS][FEV]', tipo: 'CBO',
    gastoHistorico: 3000, budgetNovoMes: 1400, novoLifetime: 4400,
    decisao: 'Manter ritmo (R$ 1.400)', justificativa: 'Campanha madura (4 meses). ROAS 21,57× histórico / 16,34× maio. Manter evita fadiga.', status: 'renovada' },
  { slug: 'arena', campanha: '(manual — conta bloqueada no MCP)', tipo: 'manual',
    gastoHistorico: null, budgetNovoMes: null, novoLifetime: null,
    decisao: 'Renovação manual no Gerenciador', justificativa: null, status: 'manual' },
];

export const nomeCliente = (slug: string) => meta(slug)?.nome ?? slug;
export const corCliente = (slug: string) => meta(slug)?.cor ?? '#9a8c7a';
