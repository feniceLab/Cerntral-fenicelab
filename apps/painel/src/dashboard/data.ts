// ============================================================
// Dashboard de Tráfego Pago — dados + math (Pedro Sobral + Hormozi).
// Snapshot Maio/2026 (dados reais fechados). A camada live virá do
// serviço /api/dashboard quando o same-domain (Fase 2b) estiver no ar.
// Margens de contribuição (m): input do dono (Juan, 2026-06).
// ============================================================
import { CLIENTES_FENICE } from '@fenice/shared';

export type Nivel = 'verde' | 'amarelo' | 'vermelho';
export type Decisao = 'SCALE' | 'HOLD' | 'KILL';
export type Estado = 'ok' | 'sem-dados' | 'sem-conta' | 'setup';

export interface TPRaw {
  slug: string;
  estado: Estado;
  faturamento?: number;
  investido?: number;
  pedidos?: number;
  frequencia?: number;
  margem?: number; // m (margem de contribuição)
  obs?: string;
}

export const PERIODO = 'Maio 2026';

// Snapshot real fechado de maio. Oca tem conta mas sem relatório do período;
// cotafácil sem ad_account; Império em onboarding. Nada inventado.
export const SNAPSHOT: TPRaw[] = [
  { slug: 'suprema', estado: 'ok', faturamento: 39789.72, investido: 2350.84, pedidos: 324, frequencia: 4.26, margem: 0.35 },
  { slug: 'arena', estado: 'ok', faturamento: 7851.59, investido: 1137.10, pedidos: 84, frequencia: 2.37, margem: 0.33 },
  { slug: 'oca', estado: 'sem-dados', obs: 'Conta ativa, sem relatório consolidado do período.' },
  { slug: 'cotafacil', estado: 'sem-conta', obs: 'Sem ad_account vinculada ainda.' },
  { slug: 'imperio', estado: 'setup', obs: 'Cliente em onboarding.' },
];

export interface TPMetrics {
  slug: string; nome: string; cor: string; estado: Estado; obs?: string;
  faturamento: number; investido: number; pedidos: number; frequencia: number; margem: number;
  ticket: number; cpa: number; cpaPctTicket: number; roas: number;
  beCpa: number; contribPedido: number; lucroPosAds: number; margemSegCpa: number; roasMin: number;
  semaforo: Nivel; saturando: boolean; decisao: Decisao;
}

const meta = (slug: string) => CLIENTES_FENICE.find((c) => c.slug === slug);

// Thresholds Pedro Sobral (delivery BR)
const nivelRoas = (r: number): Nivel => (r < 3 ? 'vermelho' : r <= 5 ? 'amarelo' : 'verde');
const nivelFreq = (f: number): Nivel => (f > 5 ? 'vermelho' : f >= 3.5 ? 'amarelo' : 'verde');
const nivelCpaPct = (p: number): Nivel => (p > 30 ? 'vermelho' : p >= 15 ? 'amarelo' : 'verde');

/** Semáforo composto hierárquico (ROAS manda; freq antecipa o próximo problema). */
function semaforoComposto(roas: Nivel, freq: Nivel, cpa: Nivel): Nivel {
  if (roas === 'vermelho') return 'vermelho';
  if (roas === 'verde') return freq === 'vermelho' ? 'amarelo' : 'verde';
  // roas amarelo → desempate pelo CPA
  return cpa === 'vermelho' ? 'vermelho' : 'amarelo';
}

const decisaoPorSeg = (seg: number): Decisao => (seg >= 0.5 ? 'SCALE' : seg >= 0.2 ? 'HOLD' : 'KILL');

/** Calcula as métricas derivadas de um cliente com dados. null se sem dados. */
export function compute(raw: TPRaw): TPMetrics | null {
  const m = meta(raw.slug);
  const base = {
    slug: raw.slug,
    nome: m?.nome ?? raw.slug,
    cor: m?.cor ?? '#9a8c7a',
    estado: raw.estado,
    obs: raw.obs,
  };
  if (raw.estado !== 'ok' || raw.faturamento == null || raw.investido == null || raw.pedidos == null) {
    return { ...base, faturamento: 0, investido: 0, pedidos: 0, frequencia: 0, margem: 0,
      ticket: 0, cpa: 0, cpaPctTicket: 0, roas: 0, beCpa: 0, contribPedido: 0,
      lucroPosAds: 0, margemSegCpa: 0, roasMin: 0, semaforo: 'amarelo', saturando: false, decisao: 'HOLD' } as TPMetrics;
  }
  const fat = raw.faturamento, inv = raw.investido, ped = raw.pedidos;
  const freq = raw.frequencia ?? 0, mg = raw.margem ?? 0;
  const ticket = fat / ped;
  const cpa = inv / ped;
  const cpaPctTicket = (cpa / ticket) * 100;
  const roas = fat / inv;
  const beCpa = ticket * mg;
  const contribPedido = beCpa - cpa;
  const lucroPosAds = fat * mg - inv;
  const margemSegCpa = beCpa ? (beCpa - cpa) / beCpa : 0;
  const roasMin = mg ? 1 / mg : 0;
  const semaforo = semaforoComposto(nivelRoas(roas), nivelFreq(freq), nivelCpaPct(cpaPctTicket));
  const saturando = freq >= 3.5;
  return {
    ...base, faturamento: fat, investido: inv, pedidos: ped, frequencia: freq, margem: mg,
    ticket, cpa, cpaPctTicket, roas, beCpa, contribPedido, lucroPosAds, margemSegCpa, roasMin,
    semaforo, saturando, decisao: decisaoPorSeg(margemSegCpa),
  };
}

export const METRICS: TPMetrics[] = SNAPSHOT.map((r) => compute(r)!).filter(Boolean);
export const COM_DADOS = METRICS.filter((c) => c.estado === 'ok');

/** Agregado da carteira (visão agência). */
export function carteira() {
  const fat = COM_DADOS.reduce((s, c) => s + c.faturamento, 0);
  const inv = COM_DADOS.reduce((s, c) => s + c.investido, 0);
  const lucro = COM_DADOS.reduce((s, c) => s + c.lucroPosAds, 0);
  const pedidos = COM_DADOS.reduce((s, c) => s + c.pedidos, 0);
  const roasPond = inv ? fat / inv : 0; // ponderado por investido
  const verdes = COM_DADOS.filter((c) => c.semaforo === 'verde').length;
  return { fat, inv, lucro, pedidos, roasPond, verdes, total: METRICS.length, comDados: COM_DADOS.length };
}

export interface Acao { slug: string; nome: string; cor: string; nivel: Nivel; problema: string; acao: string; emJogo: number; prioridade: number }

/** "Plantão de Hoje" — fila de ação priorizada por severidade × R$ investido. */
export function plantao(): Acao[] {
  const out: Acao[] = [];
  for (const c of COM_DADOS) {
    const emJogo = c.investido;
    if (c.semaforo === 'vermelho') {
      out.push({ slug: c.slug, nome: c.nome, cor: c.cor, nivel: 'vermelho',
        problema: `ROAS ${c.roas.toFixed(1)}× / CPA ${c.cpaPctTicket.toFixed(0)}% do ticket`,
        acao: 'Investigar pixel/oferta e pausar o que sangra.', emJogo, prioridade: emJogo * 3 });
    } else if (c.saturando) {
      out.push({ slug: c.slug, nome: c.nome, cor: c.cor, nivel: 'amarelo',
        problema: `Frequência ${c.frequencia.toFixed(2)} (saturando público)`,
        acao: 'Renovar criativo antes do ROAS cair. Escalar com cautela.', emJogo, prioridade: emJogo * 2 });
    } else if (c.decisao === 'SCALE') {
      out.push({ slug: c.slug, nome: c.nome, cor: c.cor, nivel: 'verde',
        problema: `Folga de CPA ${(c.margemSegCpa * 100).toFixed(0)}% · freq ${c.frequencia.toFixed(2)}`,
        acao: 'Oportunidade: escalar budget (+20%).', emJogo, prioridade: emJogo });
    }
  }
  return out.sort((a, b) => b.prioridade - a.prioridade);
}
