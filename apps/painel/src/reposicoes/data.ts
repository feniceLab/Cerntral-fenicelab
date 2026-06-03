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
export type NivelSaldo = 'critico' | 'baixo' | 'ok' | 'sincronizar';

const TRAFEGO = (import.meta as any).env?.VITE_TRAFEGO_URL || 'https://relatorios.fenicelab.com.br';

// gasto/dia ≈ investido de maio ÷ 31 (base p/ cobertura em dias enquanto não há gasto diário ao vivo)
const GASTO_DIA: Record<string, number | null> = { suprema: 75.83, arena: 36.68, oca: null };

export interface SaldoLive {
  slug: string; name: string; ad_account_id: string;
  balance_cents: number | null; amount_spent_cents: number | null; spend_cap_cents: number | null;
  account_status: number | null; found: boolean; currency: string;
}
export interface Saldo {
  slug: string; nome: string; cor: string;
  saldo: number | null; gastoDiaMedio: number | null;
  diasCobertura: number | null; nivel: NivelSaldo; obs?: string;
}

const meta = (slug: string) => CLIENTES_FENICE.find((c) => c.slug === slug);

/** Busca o saldo ao vivo do serviço de tráfego (me/adaccounts.balance). */
export async function fetchSaldosLive(): Promise<SaldoLive[]> {
  const r = await fetch(`${TRAFEGO}/api/saldo`);
  const d = await r.json();
  return (d.clients ?? []) as SaldoLive[];
}

// Alerta de saldo baixo: 🔴 < 3 dias de cobertura · 🟡 < 7 dias · 🟢 ≥ 7.
function nivelSaldo(saldo: number | null, gastoDia: number | null): { nivel: NivelSaldo; dias: number | null } {
  if (saldo == null || gastoDia == null || gastoDia <= 0) return { nivel: 'sincronizar', dias: null };
  const dias = saldo / gastoDia;
  return { nivel: dias < 3 ? 'critico' : dias < 7 ? 'baixo' : 'ok', dias };
}

/** Monta os cards de saldo a partir da resposta ao vivo (ou vazio = sincronizar). */
export function buildSaldos(live: SaldoLive[]): Saldo[] {
  const bySlug: Record<string, SaldoLive> = {};
  for (const l of live) bySlug[l.slug] = l;
  // ordem: clientes Fenice com conta de anúncios
  const slugs = ['suprema', 'arena', 'oca'];
  return slugs.map((slug) => {
    const m = meta(slug);
    const l = bySlug[slug];
    const saldo = l?.balance_cents != null ? l.balance_cents / 100 : null;
    const gastoDia = GASTO_DIA[slug] ?? null;
    const { nivel, dias } = nivelSaldo(saldo, gastoDia);
    const obs = saldo == null ? (slug === 'arena' ? 'Conta bloqueada no MCP — saldo via serviço.' : 'Aguardando saldo do serviço.') : undefined;
    return { slug, nome: m?.nome ?? slug, cor: m?.cor ?? '#9a8c7a', saldo, gastoDiaMedio: gastoDia, diasCobertura: dias, nivel, obs };
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
