// ============================================================
// BattlesList — separa ATIVOS (cards) e FINALIZADOS (tabela).
// ============================================================
import { clienteBySlug } from '@fenice/shared';
import { BattleCard } from './BattleCard';
import type { BattleSummary } from './types';
import { criterioLabel, fmtBRL, fmtMetric, fmtShortDate } from './format';

interface Props {
  battles: BattleSummary[];
  onOpen: (id: string) => void;
  /** false esconde nome do cliente (modo cliente, ele só vê o próprio). */
  showCliente?: boolean;
}

export function BattlesList({ battles, onOpen, showCliente = true }: Props) {
  const ativos = battles.filter((b) => b.status === 'ativo');
  const finalizados = battles.filter((b) => b.status === 'finalizado');
  const cancelados = battles.filter((b) => b.status === 'cancelado');

  if (battles.length === 0) {
    return (
      <div className="fen-bt-empty">
        Nenhum battle encontrado. Crie um clicando em <strong>+ Novo Battle</strong>.
      </div>
    );
  }

  return (
    <>
      {ativos.length > 0 && (
        <section className="fen-bt-section">
          <div className="fen-bt-section__head">
            <div className="fen-bt-section__title">
              <span className="fen-bt-status-dot fen-bt-status-dot--ativo" />
              Ativos
            </div>
            <span className="fen-bt-section__count">
              {ativos.length} {ativos.length === 1 ? 'battle' : 'battles'}
            </span>
          </div>
          <div className="fen-bt-cards">
            {ativos.map((b) => (
              <BattleCard key={b.id} battle={b} onOpen={onOpen} showCliente={showCliente} />
            ))}
          </div>
        </section>
      )}

      {finalizados.length > 0 && (
        <section className="fen-bt-section">
          <div className="fen-bt-section__head">
            <div className="fen-bt-section__title">
              <span className="fen-bt-status-dot fen-bt-status-dot--finalizado" />
              Finalizados
            </div>
            <span className="fen-bt-section__count">
              {finalizados.length} {finalizados.length === 1 ? 'battle' : 'battles'}
            </span>
          </div>
          <FinalizadosTable battles={finalizados} onOpen={onOpen} showCliente={showCliente} />
        </section>
      )}

      {cancelados.length > 0 && (
        <section className="fen-bt-section">
          <div className="fen-bt-section__head">
            <div className="fen-bt-section__title">
              <span className="fen-bt-status-dot fen-bt-status-dot--cancelado" />
              Cancelados
            </div>
            <span className="fen-bt-section__count">{cancelados.length}</span>
          </div>
          <FinalizadosTable battles={cancelados} onOpen={onOpen} showCliente={showCliente} />
        </section>
      )}
    </>
  );
}

interface TableProps {
  battles: BattleSummary[];
  onOpen: (id: string) => void;
  showCliente: boolean;
}

function FinalizadosTable({ battles, onOpen, showCliente }: TableProps) {
  return (
    <div className="fen-bt-table">
      <div className="fen-bt-row fen-bt-row--head">
        <div>Battle</div>
        <div className="fen-bt-row__hide-sm">{showCliente ? 'Cliente' : 'Critério'}</div>
        <div className="ta-r fen-bt-row__hide-sm">Vencedora</div>
        <div className="ta-r fen-bt-row__hide-sm">Métrica final</div>
        <div className="ta-r">Gasto</div>
        <div className="ta-c">Quando</div>
      </div>
      {battles.map((b) => {
        const cliente = clienteBySlug(b.slug);
        const clienteNome = b.cliente_nome ?? cliente?.nome ?? b.slug;
        const venc = b.vencedora;
        return (
          <div
            key={b.id}
            className="fen-bt-row fen-bt-row--click"
            role="button"
            tabIndex={0}
            onClick={() => onOpen(b.id)}
            onKeyDown={(e) => { if (e.key === 'Enter') onOpen(b.id); }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{b.nome}</div>
              <div style={{ font: '500 11px/1.2 var(--fen-font)', color: 'var(--fen-muted)' }}>
                {b.campaigns_count} campanhas · {criterioLabel(b.criterio)}
              </div>
            </div>
            <div className="fen-bt-row__hide-sm">
              {showCliente ? clienteNome : criterioLabel(b.criterio)}
            </div>
            <div className="ta-r fen-bt-row__hide-sm" title={venc?.name || ''}>
              {venc?.name ? (
                <span style={{ maxWidth: 180, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'bottom' }}>
                  {venc.name}
                </span>
              ) : '—'}
            </div>
            <div className="ta-r fen-bt-row__hide-sm">
              {fmtMetric(venc?.metric_value ?? null, b.criterio)}
            </div>
            <div className="ta-r">{fmtBRL(b.spend_total_cents)}</div>
            <div className="ta-c" style={{ font: '500 11px/1.2 var(--fen-font)', color: 'var(--fen-muted)' }}>
              {fmtShortDate(b.ended_at ?? b.created_at)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
