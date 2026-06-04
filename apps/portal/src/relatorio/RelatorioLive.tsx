import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  computeSobral,
  detectarAlertas,
  margemDoCliente,
  type ClienteTheme,
  type Alerta,
  type MetricasSobral,
} from '@fenice/shared';
import { Tendencia } from './blocks/Tendencia';
import { Campanhas } from './blocks/Campanhas';
import { Criativos } from './blocks/Criativos';
import { Breakdowns } from './blocks/Breakdowns';
import { ComparativoMensal } from './blocks/ComparativoMensal';
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

interface ApiSaldoRow {
  slug: string;
  name: string;
  agencia: string | null;
  ad_account_id: string | null;
  currency: string | null;
  account_status: number | null;
  balance_cents: number | null;
  amount_spent_cents: number | null;
  spend_cap_cents: number | null;
  funding_source: string | null;
  funding_source_details: { id: string; display_string: string; type: number } | null;
  funding_tipo: 'cartao' | 'prepago' | 'outro' | null;
  disponivel_cents: number | null;
}

interface ApiSaldoResponse {
  updated_at: string;
  error: string | null;
  clients: ApiSaldoRow[];
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

async function fetchSaldo(): Promise<ApiSaldoResponse> {
  const r = await fetch(`${API_BASE}/api/saldo`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`saldo ${r.status}`);
  return await r.json();
}

/** Dias de cobertura = saldo disponível / gasto médio diário. */
function calcDiasCobertura(saldoCents: number | null, gastoTotalCents: number, diasPeriodo: number): number | null {
  if (saldoCents == null || diasPeriodo <= 0) return null;
  const gastoDiario = gastoTotalCents / diasPeriodo;
  if (gastoDiario <= 0) return null;
  return saldoCents / gastoDiario;
}

/** Duração em dias do período (aproximada por preset). */
function dursDias(preset: Preset): number {
  if (preset === 'last_7d') return 7;
  if (preset === 'last_30d') return 30;
  // this_month/last_month: assume 30
  return 30;
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
  const [saldo, setSaldo] = useState<ApiSaldoRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [, force] = useState(0);

  const opt = useMemo(() => PERIODS.find((p) => p.preset === period)!, [period]);
  const margemCliente = useMemo(() => margemDoCliente(slug), [slug]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [a, b, s] = await Promise.all([
        fetchInsights(new URLSearchParams({ preset: opt.preset })),
        fetchInsights(new URLSearchParams({ since: opt.prevSince(), until: opt.prevUntil() })),
        fetchSaldo().catch(() => null),
      ]);
      setCurr(a.clients.find((c) => c.slug === slug) ?? null);
      setPrev(b.clients.find((c) => c.slug === slug) ?? null);
      setSaldo(s?.clients.find((c) => c.slug === slug) ?? null);
      setUpdatedAt(new Date(a.updated_at));
    } catch (e: any) {
      setErr(e?.message || 'falha ao carregar');
    } finally {
      setLoading(false);
    }
  }, [opt, slug]);

  // Métricas Sobral derivadas (com margem do cliente)
  const metricas: MetricasSobral | null = useMemo(() => {
    if (!curr) return null;
    return computeSobral({
      faturamento: (curr.revenue_cents || 0) / 100,
      investido: (curr.spend_cents || 0) / 100,
      pedidos: curr.purchases || 0,
      frequencia: curr.frequency || 0,
      margem: margemCliente,
    });
  }, [curr, margemCliente]);

  // Δ ROAS pro detector de alertas
  const deltaRoasPct = useMemo(() => {
    if (!curr || !prev || !prev.roas) return null;
    return ((curr.roas - prev.roas) / prev.roas) * 100;
  }, [curr, prev]);

  // Dias de cobertura
  const diasCobertura = useMemo(() => {
    if (!curr || !saldo) return null;
    return calcDiasCobertura(saldo.disponivel_cents, curr.spend_cents || 0, dursDias(period));
  }, [curr, saldo, period]);

  // Alertas operacionais
  const alertas: Alerta[] = useMemo(() => {
    if (!metricas) return [];
    const gastoDiarioCents = (curr?.spend_cents || 0) / dursDias(period);
    return detectarAlertas({
      metricas,
      deltaRoasPct,
      saldoCents: saldo?.disponivel_cents ?? null,
      gastoDiarioCents,
      addToCart: curr?.add_to_cart ?? null,
      purchases: curr?.purchases ?? null,
    });
  }, [metricas, deltaRoasPct, saldo, curr, period]);

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
    <div className="rep rep-live" style={themeVars}>
      <div className="rep-container">
        {/* HEADER */}
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

        {/* ── BLOCO 9 · ALERTAS OPERACIONAIS ── */}
        {alertas.length > 0 && (
          <div className="rep-alerts rep-no-print">
            {alertas.map((al, i) => (
              <div key={i} className={`rep-alert rep-alert--${al.severidade}`}>
                <span className="rep-alert-icon" aria-hidden>
                  {al.severidade === 'critico' ? '🚨' : al.severidade === 'aviso' ? '⚠' : 'ⓘ'}
                </span>
                <div className="rep-alert-body">
                  <div className="rep-alert-title">{al.titulo}</div>
                  <div className="rep-alert-detail">{al.detalhe}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── BLOCO 1 · HERO LUCRO PÓS-ADS (estilo Sobral) ── */}
        {metricas && curr && (
          <div className={`rep-hero rep-hero--${metricas.semaforo} rep-hero--dec-${metricas.decisao.toLowerCase()}`}>
            <div className="rep-hero-left">
              <div className="rep-hero-label">Lucro pós-ads · {opt.label.toLowerCase()}</div>
              <div className="rep-hero-value">
                {metricas.lucroPosAds >= 0 ? '+' : ''}{fmtBRL(metricas.lucroPosAds * 100)}
              </div>
              <div className="rep-hero-sub">
                {fmtRoas(metricas.roas)} ROAS · CPA {fmtBRL(metricas.cpa * 100)}{' '}
                ({metricas.cpaPctTicket.toFixed(0)}% do ticket)
                {metricas.pedidos > 0 && ` · ${metricas.pedidos} pedidos`}
              </div>
            </div>
            <div className="rep-hero-right">
              <div className={`rep-hero-badge rep-hero-badge--${metricas.decisao.toLowerCase()}`}>
                {metricas.decisao === 'SCALE' ? '🟢 ESCALAR' :
                 metricas.decisao === 'HOLD' ? '🟡 MANTER' : '🔴 CORRIGIR'}
              </div>
              <div className="rep-hero-meta">
                margem seg {(metricas.margemSegCpa * 100).toFixed(0)}%<br />
                ticket {fmtBRL(metricas.ticket * 100)}<br />
                margem op {(metricas.margem * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        )}

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
            <button
              type="button"
              className="rep-refresh-btn rep-print-btn"
              onClick={() => window.print()}
              aria-label="Imprimir relatório"
              title="Imprimir / salvar PDF"
            >
              🖨
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

        {/* ── BLOCO 3 · FUNIL DE CONVERSÃO ── */}
        {curr && (curr.impressions || 0) > 0 && (
          <FunilConversao c={curr} />
        )}

        {/* ── BLOCO 8 · SALDO & REPOSIÇÃO ── */}
        {saldo && (
          <SaldoCard
            saldo={saldo}
            diasCobertura={diasCobertura}
            gastoPeriodoCents={curr?.spend_cents || 0}
            diasPeriodo={dursDias(period)}
          />
        )}

        {/* ── BLOCO 4 · TENDÊNCIA dia a dia ── */}
        <Tendencia slug={slug} preset={opt.preset} margemCliente={margemCliente} />

        {/* ── BLOCO 10 + 5 · SUGESTÕES SOBRAL + CAMPANHAS ── */}
        <Campanhas slug={slug} preset={opt.preset} margemCliente={margemCliente} />

        {/* ── BLOCO 6 · CRIATIVOS top/worst ── */}
        <Criativos slug={slug} preset={opt.preset} />

        {/* ── BLOCO 7 · BREAKDOWNS (idade/gen/placement/DMA/país) ── */}
        <Breakdowns slug={slug} preset={opt.preset} />

        {/* ── BLOCO 11 · COMPARATIVO MENSAL últimos 6 meses ── */}
        <ComparativoMensal slug={slug} margemCliente={margemCliente} monthsBack={6} />

        <div className="rep-footer-note">
          Δ comparado ao período anterior equivalente · Atualiza a cada 5 min · Margem operacional {(margemCliente * 100).toFixed(0)}% (config Sobral)
        </div>
      </div>
    </div>
  );
}

/** Funil de conversão visual: 6 estágios com % step-to-step. Detecta o gargalo. */
function FunilConversao({ c }: { c: ApiClientRow }) {
  const estagios = [
    { label: 'Impressões', value: c.impressions || 0, anchor: true },
    { label: 'Alcance', value: c.reach || 0, anchor: false },
    { label: 'Cliques no link', value: c.link_clicks || 0, anchor: false },
    { label: 'Add to cart', value: c.add_to_cart || 0, anchor: false },
    { label: 'Iniciou checkout', value: c.initiate_checkout || 0, anchor: false },
    { label: 'Compras', value: c.purchases || 0, anchor: false },
  ];
  const topo = estagios[0].value || 1;
  // detecta gargalo (menor conversão step-to-step)
  let gargalo = -1;
  let menorPct = Infinity;
  for (let i = 1; i < estagios.length; i++) {
    const prev = estagios[i - 1].value;
    const cur = estagios[i].value;
    if (prev > 0 && cur > 0) {
      const p = cur / prev;
      if (p < menorPct) { menorPct = p; gargalo = i; }
    }
  }

  return (
    <div className="rep-funil">
      <div className="rep-funil-head">
        <div className="rep-section-kicker">Funil de conversão</div>
        <div className="rep-section-title">Por onde o dinheiro vaza</div>
      </div>
      <div className="rep-funil-body">
        {estagios.map((s, i) => {
          const totalPct = (s.value / topo) * 100;
          const prevValue = i > 0 ? estagios[i - 1].value : null;
          const stepPct = prevValue && prevValue > 0 ? (s.value / prevValue) * 100 : null;
          const isGargalo = i === gargalo;
          return (
            <div key={s.label} className={`rep-funil-row${isGargalo ? ' is-gargalo' : ''}`}>
              <div className="rep-funil-label">
                {s.label}
                {isGargalo && <span className="rep-funil-gargalo-tag">gargalo</span>}
              </div>
              <div className="rep-funil-bar">
                <div className="rep-funil-fill" style={{ width: `${Math.max(2, totalPct)}%` }} />
              </div>
              <div className="rep-funil-value">{fmtNum(s.value)}</div>
              <div className="rep-funil-pct">{stepPct != null ? `${stepPct.toFixed(1)}%` : '—'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Card de saldo da conta de anúncios + dias de cobertura + sugestão de reposição. */
function SaldoCard({
  saldo, diasCobertura, gastoPeriodoCents, diasPeriodo,
}: {
  saldo: ApiSaldoRow;
  diasCobertura: number | null;
  gastoPeriodoCents: number;
  diasPeriodo: number;
}) {
  const gastoDiarioCents = gastoPeriodoCents / Math.max(1, diasPeriodo);
  const isCartao = saldo.funding_tipo === 'cartao';
  const disponivel = saldo.disponivel_cents;
  const sugestao = gastoDiarioCents > 0 ? gastoDiarioCents * 15 : 0; // 15 dias de pista

  let tone: 'ok' | 'aviso' | 'critico' = 'ok';
  if (!isCartao && diasCobertura != null) {
    if (diasCobertura < 3) tone = 'critico';
    else if (diasCobertura < 7) tone = 'aviso';
  }

  return (
    <div className={`rep-saldo rep-saldo--${tone}`}>
      <div className="rep-saldo-head">
        <div className="rep-section-kicker">Saldo & reposição</div>
        <div className="rep-section-title">
          {isCartao ? 'Conta no cartão' :
           disponivel != null ? fmtBRL(disponivel) : 'Saldo indisponível'}
        </div>
      </div>
      <div className="rep-saldo-grid">
        <div>
          <div className="rep-saldo-label">Tipo</div>
          <div className="rep-saldo-val">
            {isCartao ? 'Cartão' :
             saldo.funding_tipo === 'prepago' ? 'Pré-pago' : 'Outro'}
          </div>
          <div className="rep-saldo-detail">{saldo.funding_source_details?.display_string || '—'}</div>
        </div>
        <div>
          <div className="rep-saldo-label">Gasto médio diário</div>
          <div className="rep-saldo-val">{fmtBRL(gastoDiarioCents)}</div>
          <div className="rep-saldo-detail">{fmtBRL(gastoPeriodoCents)} no período</div>
        </div>
        <div>
          <div className="rep-saldo-label">Cobertura</div>
          <div className="rep-saldo-val">
            {isCartao ? '∞' :
             diasCobertura != null ? `${diasCobertura.toFixed(1)}d` : '—'}
          </div>
          <div className="rep-saldo-detail">{isCartao ? 'Sem risco de pausa' : 'até zerar'}</div>
        </div>
        <div>
          <div className="rep-saldo-label">Repor pra 15d</div>
          <div className="rep-saldo-val">
            {isCartao ? '—' : sugestao > 0 ? fmtBRL(sugestao) : '—'}
          </div>
          <div className="rep-saldo-detail">sugestão Sobral</div>
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
