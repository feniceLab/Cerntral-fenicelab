// ============================================================
// BattleCard — resumo clicável de um battle (lista ATIVOS).
// ============================================================
import { clienteBySlug } from '@fenice/shared';
import type { BattleSummary } from './types';
import { criterioLabel, estrategiaLabel, fmtBRL, fmtRelativeFuture } from './format';

interface Props {
  battle: BattleSummary;
  onOpen: (id: string) => void;
  /** Mostrar o nome do cliente no card? Default: true. */
  showCliente?: boolean;
}

export function BattleCard({ battle, onOpen, showCliente = true }: Props) {
  const pct = battle.budget_total_cents > 0
    ? Math.min(100, Math.round((battle.spend_total_cents / battle.budget_total_cents) * 100))
    : 0;
  const cliente = clienteBySlug(battle.slug);
  const clienteNome = battle.cliente_nome ?? cliente?.nome ?? battle.slug;

  const isAtivo = battle.status === 'ativo';

  return (
    <button
      type="button"
      className="fen-bt-card"
      onClick={() => onOpen(battle.id)}
      aria-label={`Abrir battle ${battle.nome}`}
    >
      <div className="fen-bt-card__head">
        <div style={{ minWidth: 0 }}>
          <div className="fen-bt-card__title">{battle.nome}</div>
          {showCliente && (
            <div className="fen-bt-card__sub">{clienteNome}</div>
          )}
        </div>
        <span className={`fen-bt-card__badge${isAtivo ? ' fen-bt-card__badge--ativo' : ''}`}>
          {battle.status}
        </span>
      </div>

      <div className="fen-bt-progress">
        <div className="fen-bt-progress__head">
          <span>{fmtBRL(battle.spend_total_cents)} / {fmtBRL(battle.budget_total_cents)}</span>
          <span>{pct}%</span>
        </div>
        <div className="fen-bt-progress__bar">
          <div
            className="fen-bt-progress__fill"
            style={{ width: `${pct}%` }}
          />
        </div>
        {isAtivo && battle.next_eval_at && (
          <div className="fen-bt-progress__sub">
            Próx avaliação em {fmtRelativeFuture(battle.next_eval_at)}
          </div>
        )}
      </div>

      <div className="fen-bt-card__meta">
        <span><strong>{battle.campaigns_count}</strong> campanhas</span>
        <span>Critério <strong>{criterioLabel(battle.criterio)}</strong></span>
        <span>{estrategiaLabel(battle.estrategia)}</span>
      </div>
    </button>
  );
}
