import { useMemo } from 'react';

export interface AuditEntry {
  ts: string;
  slug: string;
  entity_type: 'campaign' | 'adset' | 'ad' | null;
  entity_id: string | null;
  entity_name: string | null;
  action: 'pause' | 'resume' | 'budget_up' | 'budget_down' | null;
  factor: number | null;
  actor: string | null;
  ok: boolean;
  error: string | null;
}

export interface AuditKPIsProps {
  entries: AuditEntry[];
}

export function AuditKPIs({ entries }: AuditKPIsProps) {
  const { last24h, errPct, topActor, topCliente } = useMemo(() => {
    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;

    const last24hEntries = entries.filter((e) => {
      const t = new Date(e.ts).getTime();
      return !Number.isNaN(t) && t >= dayAgo;
    });

    const total = entries.length || 1;
    const errors = entries.filter((e) => !e.ok).length;
    const pct = (errors / total) * 100;

    const actorCount = new Map<string, number>();
    entries.forEach((e) => {
      const key = (e.actor || '').trim() || '—';
      actorCount.set(key, (actorCount.get(key) || 0) + 1);
    });
    let bestActor = '—';
    let bestActorN = 0;
    actorCount.forEach((n, k) => {
      if (n > bestActorN && k !== '—') {
        bestActorN = n;
        bestActor = k;
      }
    });

    const cliCount = new Map<string, number>();
    entries.forEach((e) => {
      const key = (e.slug || '').trim() || '—';
      cliCount.set(key, (cliCount.get(key) || 0) + 1);
    });
    let bestCli = '—';
    let bestCliN = 0;
    cliCount.forEach((n, k) => {
      if (n > bestCliN && k !== '—') {
        bestCliN = n;
        bestCli = k;
      }
    });

    void bestActorN;
    void bestCliN;
    return {
      last24h: last24hEntries.length,
      errPct: pct,
      topActor: bestActor,
      topCliente: bestCli,
    };
  }, [entries]);

  return (
    <div className="fen-audit-kpis">
      <div className="fen-audit-kpi">
        <div className="fen-audit-kpi__label">Ações 24h</div>
        <div className="fen-audit-kpi__value">{last24h}</div>
        <div className="fen-audit-kpi__sub">eventos no último dia</div>
      </div>
      <div className="fen-audit-kpi">
        <div className="fen-audit-kpi__label">% erros</div>
        <div className={`fen-audit-kpi__value ${errPct > 5 ? 'is-danger' : errPct > 0 ? 'is-cotta' : 'is-success'}`}>
          {errPct.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
        </div>
        <div className="fen-audit-kpi__sub">sobre {entries.length} eventos</div>
      </div>
      <div className="fen-audit-kpi">
        <div className="fen-audit-kpi__label">Top actor</div>
        <div className="fen-audit-kpi__value" title={topActor}>{topActor}</div>
        <div className="fen-audit-kpi__sub">mais ativo no período</div>
      </div>
      <div className="fen-audit-kpi">
        <div className="fen-audit-kpi__label">Top cliente mexido</div>
        <div className="fen-audit-kpi__value is-cotta" title={topCliente}>{topCliente}</div>
        <div className="fen-audit-kpi__sub">slug com mais ações</div>
      </div>
    </div>
  );
}
