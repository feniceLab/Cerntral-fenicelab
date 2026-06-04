// ============================================================
// Battles — helpers de formatação (BRL, datas, métricas).
// ============================================================
import type { BattleCriterio } from './types';

export const fmtBRL = (cents: number | null | undefined): string => {
  if (cents == null) return '—';
  return 'R$ ' + (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const fmtBRLPrecise = (cents: number | null | undefined): string => {
  if (cents == null) return '—';
  return 'R$ ' + (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const fmtPct = (n: number | null | undefined): string => {
  if (n == null) return '—';
  return n.toFixed(1) + '%';
};

export const fmtMetric = (value: number | null | undefined, criterio: BattleCriterio): string => {
  if (value == null) return '—';
  switch (criterio) {
    case 'roas':
      return value.toFixed(2) + '×';
    case 'cpa':
      return fmtBRL(Math.round(value));
    case 'compras':
      return value.toLocaleString('pt-BR');
    case 'ctr':
      return value.toFixed(2) + '%';
  }
};

export const criterioLabel = (c: BattleCriterio): string => ({
  roas: 'ROAS',
  cpa: 'CPA',
  compras: 'Compras',
  ctr: 'CTR',
})[c];

export const estrategiaLabel = (e: 'auto_kill' | 'manual' | 'auto_scale'): string => ({
  auto_kill: 'Auto-Kill',
  manual: 'Manual',
  auto_scale: 'Auto-Scale',
})[e];

/** Retorna "3h 14min" ou "agora". */
export const fmtRelativeFuture = (iso?: string | null): string => {
  if (!iso) return '—';
  const target = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = target - now;
  if (diffMs <= 0) return 'agora';
  const totalMin = Math.floor(diffMs / 60_000);
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const mins = totalMin % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}min`;
  return `${mins}min`;
};

export const fmtShortDate = (iso?: string | null): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

/** Higher-is-better? CPA é o único onde menor é melhor. */
export const isHigherBetter = (c: BattleCriterio): boolean => c !== 'cpa';
