import { useEffect, useMemo, useState } from 'react';
import { nivelRoas } from '@fenice/shared';

interface CampaignRow {
  campaign_id: string;
  name: string;
  status: string | null;
  effective_status: string | null;
  objective: string | null;
  daily_budget_cents: number | null;
  lifetime_budget_cents: number | null;
  start_time: string | null;
  stop_time: string | null;
  spend_cents: number | null;
  revenue_cents: number | null;
  purchases: number | null;
  roas: number | null;
  impressions: number | null;
  reach: number | null;
  frequency: number | null;
  clicks: number | null;
  ctr: number | null;
  cpc: number | null;
  cpa_cents: number | null;
}

interface Sugestao {
  acao: 'ESCALAR' | 'PAUSAR' | 'RENOVAR' | 'OBSERVAR';
  campaign: string;
  motivo: string;
}

const API_BASE = (import.meta as any).env?.VITE_TRAFEGO_URL || '';

const fmtBRL = (cents: number | null) =>
  cents == null ? '—' : 'R$ ' + (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtRoas = (n: number | null) => (n == null ? '—' : n.toFixed(2) + '×');

interface Props {
  slug: string;
  preset?: string;
  since?: string;
  until?: string;
  margemCliente: number;
}

export function Campanhas({ slug, preset, since, until, margemCliente }: Props) {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    const params = new URLSearchParams({ slug });
    if (since && until) { params.set('since', since); params.set('until', until); }
    else if (preset) params.set('preset', preset);
    fetch(`${API_BASE}/api/campaigns?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErr(d.error);
        else setCampaigns(d.campaigns || []);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [slug, preset, since, until]);

  const sugestoes: Sugestao[] = useMemo(() => {
    if (campaigns.length === 0) return [];
    const roasMin = 1 / margemCliente;
    const out: Sugestao[] = [];
    const ativas = campaigns.filter((c) => c.effective_status === 'ACTIVE');

    // Top ativas com ROAS folgado → ESCALAR
    ativas
      .filter((c) => (c.roas || 0) >= roasMin * 1.8) // >1.8x break-even
      .slice(0, 3)
      .forEach((c) => {
        out.push({
          acao: 'ESCALAR',
          campaign: c.name,
          motivo: `ROAS ${fmtRoas(c.roas)} (break-even ${roasMin.toFixed(1)}×) — folga pra +20% de budget`,
        });
      });

    // Ativas com ROAS ruim → PAUSAR
    ativas
      .filter((c) => (c.roas || 0) > 0 && (c.roas || 0) < roasMin)
      .forEach((c) => {
        out.push({
          acao: 'PAUSAR',
          campaign: c.name,
          motivo: `ROAS ${fmtRoas(c.roas)} abaixo do break-even (${roasMin.toFixed(1)}×) — está queimando dinheiro`,
        });
      });

    // Frequência alta → RENOVAR criativo
    ativas
      .filter((c) => (c.frequency || 0) > 4)
      .forEach((c) => {
        out.push({
          acao: 'RENOVAR',
          campaign: c.name,
          motivo: `Frequência ${c.frequency?.toFixed(2)} — público vendo demais, renovar criativo`,
        });
      });

    // ATC=0 com gasto alto = problema
    ativas
      .filter((c) => (c.purchases || 0) === 0 && (c.spend_cents || 0) > 5000)
      .forEach((c) => {
        out.push({
          acao: 'OBSERVAR',
          campaign: c.name,
          motivo: `${fmtBRL(c.spend_cents)} gasto sem conversão — verificar pixel ou pausar`,
        });
      });

    return out.slice(0, 10);
  }, [campaigns, margemCliente]);

  if (loading) return <div className="rep-block-loading">Carregando campanhas...</div>;
  if (err) return <div className="rep-empty">Campanhas indisponíveis: {err}</div>;
  if (campaigns.length === 0) return null;

  return (
    <>
      {/* BLOCO 10 · SUGESTÕES SOBRAL */}
      {sugestoes.length > 0 && (
        <div className="rep-block rep-sugestoes">
          <div className="rep-block-head">
            <div>
              <div className="rep-section-kicker">Recomendações Sobral</div>
              <div className="rep-section-title">O que fazer agora</div>
            </div>
          </div>
          <div className="rep-sugestoes-list">
            {sugestoes.map((s, i) => (
              <div key={i} className={`rep-sugestao rep-sugestao--${s.acao.toLowerCase()}`}>
                <span className="rep-sugestao-acao">{s.acao}</span>
                <div className="rep-sugestao-body">
                  <div className="rep-sugestao-camp">{s.campaign}</div>
                  <div className="rep-sugestao-motivo">{s.motivo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOCO 5 · TABELA DE CAMPANHAS */}
      <div className="rep-block rep-campanhas">
        <div className="rep-block-head">
          <div>
            <div className="rep-section-kicker">Campanhas</div>
            <div className="rep-section-title">Por ROAS (Pareto)</div>
          </div>
          <div className="rep-block-meta">{campaigns.length} campanhas</div>
        </div>
        <div className="rep-campanhas-table">
          <div className="rep-camp-row rep-camp-row--head">
            <div>Nome</div>
            <div className="ta-c">Status</div>
            <div className="ta-r">Gasto</div>
            <div className="ta-r">Compras</div>
            <div className="ta-r">CPA</div>
            <div className="ta-r">Freq</div>
            <div className="ta-r">CTR</div>
            <div className="ta-r">ROAS</div>
          </div>
          {campaigns.map((c) => {
            const tone = c.roas != null ? nivelRoas(c.roas) : 'amarelo';
            return (
              <div key={c.campaign_id} className={`rep-camp-row rep-camp-tone-${tone}`}>
                <div className="rep-camp-name" title={c.name}>{c.name}</div>
                <div className="ta-c">
                  <span className={`rep-camp-status rep-camp-status--${(c.effective_status || 'OFF').toLowerCase()}`}>
                    {c.effective_status === 'ACTIVE' ? '● ATIVA' :
                     c.effective_status === 'PAUSED' ? '○ pausada' :
                     c.effective_status || '—'}
                  </span>
                </div>
                <div className="ta-r mono">{fmtBRL(c.spend_cents)}</div>
                <div className="ta-r mono">{c.purchases ?? 0}</div>
                <div className="ta-r mono">{fmtBRL(c.cpa_cents)}</div>
                <div className="ta-r mono">{c.frequency != null ? c.frequency.toFixed(2) : '—'}</div>
                <div className="ta-r mono">{c.ctr != null ? c.ctr.toFixed(2) + '%' : '—'}</div>
                <div className="ta-r mono rep-camp-roas">{fmtRoas(c.roas)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
