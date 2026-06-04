import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ClienteTheme } from '@fenice/shared';
import './relatorio.css';

// ============================================================
// Relatório AO VIVO — puxa /api/insights real (Meta Graph)
// Suporta seletor de período, comparativo Δ e auto-refresh.
// Pacotes A+B+F do plano "Performance vira centro de operação".
// ============================================================

const API_BASE = (import.meta as any).env?.VITE_TRAFEGO_URL || '';
const REFRESH_MS = 5 * 60 * 1000; // 5 min

type Preset = 'this_month' | 'last_month' | 'last_7d' | 'last_30d';

interface PeriodOption {
  preset: Preset;
  label: string;
  /** Período anterior pra comparativo (since/until em YYYY-MM-DD). */
  prevSince: () => string;
  prevUntil: () => string;
}

const fmtDate = (d: Date): string => d.toISOString().slice(0, 10);
const daysAgo = (n: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};
const monthStart = (offset: number): Date => {
  const d = new Date();
  d.setMonth(d.getMonth() + offset, 1);
  return d;
};
const monthEnd = (offset: number): Date => {
  const d = new Date();
  d.setMonth(d.getMonth() + offset + 1, 0);
  return d;
};

const PERIODS: PeriodOption[] = [
  {
    preset: 'this_month',
    label: 'Este mês',
    prevSince: () => fmtDate(monthStart(-1)),
    prevUntil: () => fmtDate(monthEnd(-1)),
  },
  {
    preset: 'last_month',
    label: 'Mês passado',
    prevSince: () => fmtDate(monthStart(-2)),
    prevUntil: () => fmtDate(monthEnd(-2)),
  },
  {
    preset: 'last_7d',
    label: '7 dias',
    prevSince: () => fmtDate(daysAgo(14)),
    prevUntil: () => fmtDate(daysAgo(8)),
  },
  {
    preset: 'last_30d',
    label: '30 dias',
    prevSince: () => fmtDate(daysAgo(60)),
    prevUntil: () => fmtDate(daysAgo(31)),
  },
];

interface ApiClientRow {
  slug: string;
  name: string;
  agencia: string | null;
  ad_account_id: string | null;
  found: boolean;
  error: string | null;
  spend_cents: number;
  revenue_cents: number;
  purchases: number;
  roas: number;
  impressions: number;
  reach: number;
  frequency: number;
  clicks: number;
  ctr: number;
  cpm: number;
  cpc: number;
  link_clicks: number;
  add_to_cart: number;
  initiate_checkout: number;
}
interface ApiInsightsResponse {
  updated_at: string;
  period: string;
  clients: ApiClientRow[];
}

const fmtBRL = (cents: number): string =>
  'R$ ' + (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtBRL0 = (cents: number): string =>
  'R$ ' + Math.round(cents / 100).toLocaleString('pt-BR');
const fmtNum = (n: number): string => Math.round(n).toLocaleString('pt-BR');
const fmtRoas = (n: number): string => n.toFixed(2) + '×';
const fmtPct = (n: number): string => n.toFixed(2) + '%';

async function fetchInsights(params: URLSearchParams): Promise<ApiInsightsResponse> {
  const url = `${API_BASE}/api/insights?${params.toString()}`;
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return await r.json();
}

function pctDelta(curr: number, prev: number): number | null {
  if (!isFinite(prev) || prev === 0) return null;
  return ((curr - prev) / prev) * 100;
}

function ageString(date: Date | null): string {
  if (!date) return '—';
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return 'agora';
  if (s < 3600) return `há ${Math.floor(s / 60)} min`;
  return `há ${Math.floor(s / 3600)}h`;
}

export interface RelatorioLiveProps {
  slug: string;
  clienteNome: string;
  logo: string | null;
  theme: ClienteTheme;
}

export function RelatorioLive({ slug, clienteNome, logo, theme }: RelatorioLiveProps) {
  const [period, setPeriod] = useState<Preset>('last_month');
  const [curr, setCurr] = useState<ApiClientRow | null>(null);
  const [prev, setPrev] = useState<ApiClientRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [, force] = useState(0);

  const opt = useMemo(() => PERIODS.find((p) => p.preset === period)!, [period]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [a, b] = await Promise.all([
        fetchInsights(new URLSearchParams({ preset: opt.preset })),
        fetchInsights(new URLSearchParams({ since: opt.prevSince(), until: opt.prevUntil() })),
      ]);
      setCurr(a.clients.find((c) => c.slug === slug) ?? null);
      setPrev(b.clients.find((c) => c.slug === slug) ?? null);
      setUpdatedAt(new Date(a.updated_at));
    } catch (e: any) {
      setErr(e?.message || 'falha ao carregar');
    } finally {
      setLoading(false);
    }
  }, [opt, slug]);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh a cada 5min
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    intervalRef.current = setInterval(() => load(), REFRESH_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [load]);

  // Faz o "há X min" virar reativo (re-render por segundo de baixo custo)
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 30 * 1000);
    return () => clearInterval(t);
  }, []);

  const themeVars: React.CSSProperties = {
    ['--r-bg' as any]: theme.bg,
    ['--r-card' as any]: theme.card,
    ['--r-card2' as any]: theme.card2,
    ['--r-line' as any]: theme.line,
    ['--r-ink' as any]: theme.ink,
    ['--r-muted' as any]: theme.muted,
    ['--r-faint' as any]: theme.faint,
    ['--r-accent' as any]: theme.accent,
    ['--r-accent2' as any]: theme.accent2,
    ['--r-ok' as any]: theme.ok,
    ['--r-warn' as any]: theme.warn,
    ['--r-bad' as any]: theme.bad,
    ['--r-font-display' as any]: theme.fontDisplay,
    ['--r-font-body' as any]: theme.fontBody,
  };

  // Carrega fonte do cliente
  useEffect(() => {
    if (!theme.googleFonts) return;
    const id = `gf-${slug}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id; link.rel = 'stylesheet'; link.href = theme.googleFonts;
    document.head.appendChild(link);
  }, [theme.googleFonts, slug]);

  return (
    <div className="rep" style={themeVars}>
      <div className="rep-container">
        {/* HEADER (igual relatório estático, mas com seletor + refresh) */}
        <header className="rep-header">
          {logo ? (
            <img src={logo} alt={clienteNome} className="rep-header-logo" />
          ) : (
            <span className="rep-header-brand">{clienteNome}</span>
          )}
          <div className="rep-header-meta">
            <div className="rep-kicker">Fenice Lab</div>
            <div className="rep-header-title">Performance · ao vivo</div>
            <div className="rep-header-sub">Dados Meta Graph</div>
          </div>
        </header>

        {/* SELETOR DE PERÍODO + REFRESH */}
        <div className="rep-toolbar">
          <div className="rep-period-group" role="tablist" aria-label="Período do relatório">
            {PERIODS.map((p) => (
              <button
                key={p.preset}
                type="button"
                role="tab"
                aria-selected={p.preset === period}
                className={`rep-period-btn${p.preset === period ? ' is-on' : ''}`}
                onClick={() => setPeriod(p.preset)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="rep-toolbar-right">
            <span className="rep-updated" aria-live="polite">
              {err ? `⚠ ${err}` : `atualizado ${ageString(updatedAt)}`}
            </span>
            <button
              type="button"
              className="rep-refresh-btn"
              onClick={load}
              disabled={loading}
              aria-label="Atualizar agora"
            >
              {loading ? '…' : '↻'}
            </button>
          </div>
        </div>

        {/* KPI grid */}
        {!curr && !loading ? (
          <div className="rep-empty">
            Sem dados para <strong>{clienteNome}</strong> neste período.
          </div>
        ) : (
          <div className="rep-kpi-grid">
            <KpiCard label="Faturamento" value={curr ? fmtBRL(curr.revenue_cents) : '—'}
              delta={curr && prev ? pctDelta(curr.revenue_cents, prev.revenue_cents) : null} />
            <KpiCard label="Investido" value={curr ? fmtBRL(curr.spend_cents) : '—'}
              delta={curr && prev ? pctDelta(curr.spend_cents, prev.spend_cents) : null} invert />
            <KpiCard label="ROAS" value={curr ? fmtRoas(curr.roas) : '—'}
              delta={curr && prev ? pctDelta(curr.roas, prev.roas) : null} emphasis />
            <KpiCard label="Compras" value={curr ? fmtNum(curr.purchases) : '—'}
              delta={curr && prev ? pctDelta(curr.purchases, prev.purchases) : null} />
            <KpiCard label="Alcance" value={curr ? fmtNum(curr.reach) : '—'}
              delta={curr && prev ? pctDelta(curr.reach, prev.reach) : null} />
            <KpiCard label="Impressões" value={curr ? fmtNum(curr.impressions) : '—'}
              delta={curr && prev ? pctDelta(curr.impressions, prev.impressions) : null} />
            <KpiCard label="Frequência" value={curr ? curr.frequency.toFixed(2) : '—'}
              delta={curr && prev ? pctDelta(curr.frequency, prev.frequency) : null} invert />
            <KpiCard label="CTR" value={curr ? fmtPct(curr.ctr) : '—'}
              delta={curr && prev ? pctDelta(curr.ctr, prev.ctr) : null} />
            <KpiCard label="CPM" value={curr ? fmtBRL0(curr.cpm * 100) : '—'}
              delta={curr && prev ? pctDelta(curr.cpm, prev.cpm) : null} invert />
            <KpiCard label="CPC" value={curr ? `R$ ${curr.cpc.toFixed(2)}` : '—'}
              delta={curr && prev ? pctDelta(curr.cpc, prev.cpc) : null} invert />
          </div>
        )}

        <div className="rep-footer-note">
          Δ comparado ao período anterior equivalente. Atualiza automaticamente a cada 5 min.
        </div>
      </div>
    </div>
  );
}

/** Card de KPI com Δ (seta + cor). `invert` = quando "menos é melhor" (CPA, freq, CPM). */
function KpiCard({
  label,
  value,
  delta,
  invert = false,
  emphasis = false,
}: {
  label: string;
  value: string;
  delta: number | null;
  /** Quando true, "menor é melhor" (ex: CPM, CPC, frequência). */
  invert?: boolean;
  emphasis?: boolean;
}) {
  let tone: 'ok' | 'bad' | 'neutral' = 'neutral';
  if (delta !== null && Math.abs(delta) >= 0.5) {
    const better = invert ? delta < 0 : delta > 0;
    tone = better ? 'ok' : 'bad';
  }
  const arrow = delta === null ? '' : delta > 0 ? '↑' : delta < 0 ? '↓' : '·';
  const deltaStr = delta === null ? '—' : `${arrow} ${Math.abs(delta).toFixed(1)}%`;

  return (
    <div className={`rep-kpi${emphasis ? ' is-emphasis' : ''}`}>
      <div className="rep-kpi-label">{label}</div>
      <div className="rep-kpi-value">{value}</div>
      <div className={`rep-kpi-delta rep-kpi-delta--${tone}`}>{deltaStr}</div>
    </div>
  );
}
