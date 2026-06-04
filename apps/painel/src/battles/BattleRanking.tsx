// ============================================================
// BattleRanking — tabela ranqueada das campanhas no battle.
// ============================================================
import type { BattleCampaign, BattleCriterio } from './types';
import { fmtBRL, fmtMetric, isHigherBetter } from './format';

interface Props {
  campaigns: BattleCampaign[];
  criterio: BattleCriterio;
  /** Quando o battle terminou, qual campanha venceu? */
  winnerId?: string | null;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function BattleRanking({ campaigns, criterio, winnerId }: Props) {
  const sorted = [...campaigns].sort((a, b) => {
    const va = a.metric_value;
    const vb = b.metric_value;
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    return isHigherBetter(criterio) ? vb - va : va - vb;
  });

  return (
    <div className="fen-bt-rank" role="table" aria-label="Ranking ao vivo">
      <div className="fen-bt-rank__row fen-bt-rank__row--head" role="row">
        <div role="columnheader">#</div>
        <div role="columnheader">Campanha</div>
        <div className="fen-bt-rank__metric" role="columnheader">Métrica</div>
        <div className="fen-bt-rank__spend" role="columnheader">Gasto</div>
      </div>
      {sorted.map((c, i) => {
        const isWinner = winnerId === c.campaign_id;
        const medal = i < 3 ? MEDALS[i] : `${i + 1}`;
        return (
          <div
            key={c.campaign_id}
            className={`fen-bt-rank__row${isWinner ? ' fen-bt-rank__row--winner' : ''}`}
            role="row"
          >
            <div className="fen-bt-rank__pos" role="cell">{medal}</div>
            <div role="cell" title={c.name} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {c.name}
              {c.status === 'pausada' && (
                <span style={{ marginLeft: 6, font: '600 10px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>
                  (pausada)
                </span>
              )}
            </div>
            <div className="fen-bt-rank__metric" role="cell">{fmtMetric(c.metric_value, criterio)}</div>
            <div className="fen-bt-rank__spend" role="cell">{fmtBRL(c.spend_cents)}</div>
          </div>
        );
      })}
      {sorted.length === 0 && (
        <div className="fen-bt-rank__row" style={{ gridTemplateColumns: '1fr', textAlign: 'center', color: 'var(--fen-muted)' }}>
          Sem dados de ranking ainda.
        </div>
      )}
    </div>
  );
}
