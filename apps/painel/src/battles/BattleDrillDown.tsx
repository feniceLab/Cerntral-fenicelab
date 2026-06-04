// ============================================================
// BattleDrillDown — modal de detalhe do battle ao vivo.
// Atualiza a cada 30s; permite cancelar, decidir manualmente e reverter.
// ============================================================
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { clienteBySlug } from '@fenice/shared';
import type { BattleDetail } from './types';
import {
  cancelBattle,
  decidirBattle,
  getBattle,
  revertBattle,
} from './api';
import {
  criterioLabel,
  estrategiaLabel,
  fmtBRL,
  fmtMetric,
  fmtRelativeFuture,
  fmtShortDate,
} from './format';
import { BattleRanking } from './BattleRanking';
import { BattleTrend } from './BattleTrend';

const REFRESH_MS = 30_000;

interface Props {
  battleId: string;
  isAdmin: boolean;
  actorEmail: string | null;
  onClose: () => void;
  /** Disparado quando o battle muda (cancelado/decidido/revertido) — invalida lista. */
  onMutate: () => void;
}

type SubModal = null | 'cancel-confirm' | 'decidir' | 'revert-confirm';

export function BattleDrillDown({ battleId, isAdmin, actorEmail, onClose, onMutate }: Props) {
  const [battle, setBattle] = useState<BattleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subModal, setSubModal] = useState<SubModal>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [chosenWinner, setChosenWinner] = useState<string | null>(null);
  const [manterPausadas, setManterPausadas] = useState(false);
  const aborter = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    aborter.current?.abort();
    const ctrl = new AbortController();
    aborter.current = ctrl;
    const res = await getBattle(battleId, ctrl.signal);
    if (res.ok) {
      setBattle(res.data);
      setError(null);
    } else if (res.error !== 'aborted') {
      setError(res.error);
    }
    setLoading(false);
  }, [battleId]);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => { void load(); }, REFRESH_MS);
    return () => {
      window.clearInterval(id);
      aborter.current?.abort();
    };
  }, [load]);

  // ESC fecha
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (subModal) setSubModal(null);
        else onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [subModal, onClose]);

  const pct = useMemo(() => {
    if (!battle) return 0;
    if (battle.budget_total_cents <= 0) return 0;
    return Math.min(100, Math.round((battle.spend_total_cents / battle.budget_total_cents) * 100));
  }, [battle]);

  const handleCancel = async () => {
    setActionBusy(true);
    setActionError(null);
    const res = await cancelBattle(battleId, actorEmail);
    if (res.ok) {
      onMutate();
      setSubModal(null);
      await load();
    } else {
      setActionError(res.error);
    }
    setActionBusy(false);
  };

  const handleDecidir = async () => {
    if (!chosenWinner) {
      setActionError('Escolha a vencedora.');
      return;
    }
    setActionBusy(true);
    setActionError(null);
    const res = await decidirBattle(battleId, {
      vencedora_campaign_id: chosenWinner,
      manter_pausadas: manterPausadas,
      actor_email: actorEmail,
    });
    if (res.ok) {
      onMutate();
      setSubModal(null);
      await load();
    } else {
      setActionError(res.error);
    }
    setActionBusy(false);
  };

  const handleRevert = async () => {
    setActionBusy(true);
    setActionError(null);
    const res = await revertBattle(battleId, actorEmail);
    if (res.ok) {
      onMutate();
      setSubModal(null);
      await load();
    } else {
      setActionError(res.error);
    }
    setActionBusy(false);
  };

  const clienteNome = battle
    ? (battle.cliente_nome ?? clienteBySlug(battle.slug)?.nome ?? battle.slug)
    : '';
  const winnerId = battle?.vencedora?.campaign_id ?? null;
  const isAtivo = battle?.status === 'ativo';
  const isFinalizado = battle?.status === 'finalizado';

  return (
    <div
      className="fen-bt-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fen-bt-dd-title"
    >
      <div className="fen-bt-modal fen-bt-modal--lg" onClick={(e) => e.stopPropagation()}>
        <div className="fen-bt-modal__head">
          <div>
            <div className="fen-bt-modal__kicker">
              Battle · {clienteNome || '—'}
            </div>
            <div id="fen-bt-dd-title" className="fen-bt-modal__title">
              {battle?.nome || 'Carregando…'}
            </div>
          </div>
          <button type="button" className="fen-bt-modal__close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <div className="fen-bt-modal__body">
          {loading && !battle && (
            <div className="fen-bt-empty">Carregando battle…</div>
          )}
          {error && (
            <div className="fen-bt-error">
              Falha ao carregar battle: {error}
            </div>
          )}

          {battle && isFinalizado && battle.vencedora && (
            <div className="fen-bt-winner">
              <span className="fen-bt-winner__trophy" aria-hidden>🏆</span>
              <div>
                <div style={{ font: '700 10px/1.2 var(--fen-font)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fen-muted)' }}>
                  Vencedora
                </div>
                <div className="fen-bt-winner__name">{battle.vencedora.name}</div>
                <div style={{ font: '500 11.5px/1.3 var(--fen-font)', color: 'var(--fen-muted)' }}>
                  {criterioLabel(battle.criterio)}: {fmtMetric(battle.vencedora.metric_value, battle.criterio)}
                </div>
              </div>
            </div>
          )}

          {battle && (
            <>
              {/* Progresso */}
              <div className="fen-bt-dd-progress">
                <div className="fen-bt-dd-progress__head">
                  <span>Progresso · {fmtBRL(battle.spend_total_cents)} / {fmtBRL(battle.budget_total_cents)}</span>
                  <span>{pct}%</span>
                </div>
                <div className="fen-bt-progress__bar">
                  <div className="fen-bt-progress__fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="fen-bt-dd-progress__sub">
                  <span>Critério: <strong style={{ color: 'var(--fen-caffe)' }}>{criterioLabel(battle.criterio)}</strong></span>
                  <span>Estratégia: <strong style={{ color: 'var(--fen-caffe)' }}>{estrategiaLabel(battle.estrategia)}</strong></span>
                  {isAtivo && battle.next_eval_at && (
                    <span>Próx avaliação em <strong style={{ color: 'var(--fen-caffe)' }}>{fmtRelativeFuture(battle.next_eval_at)}</strong></span>
                  )}
                  {!isAtivo && battle.ended_at && (
                    <span>Terminou em <strong style={{ color: 'var(--fen-caffe)' }}>{fmtShortDate(battle.ended_at)}</strong></span>
                  )}
                </div>
              </div>

              {/* Ranking */}
              <div>
                <div style={{ font: '700 12px/1.2 var(--fen-font)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fen-muted)', marginBottom: 8 }}>
                  Ranking ao vivo
                </div>
                <BattleRanking
                  campaigns={battle.campaigns}
                  criterio={battle.criterio}
                  winnerId={winnerId}
                />
              </div>

              {/* Trend */}
              {battle.trend && battle.trend.length > 0 && (
                <BattleTrend trend={battle.trend} />
              )}
            </>
          )}
        </div>

        <div className="fen-bt-modal__foot">
          {battle && isAtivo && (
            <>
              <button
                type="button"
                className="fen-bt-btn fen-bt-btn--danger"
                onClick={() => { setActionError(null); setSubModal('cancel-confirm'); }}
              >
                ⏸ Cancelar Battle
              </button>
              <button
                type="button"
                className="fen-bt-btn fen-bt-btn--primary"
                onClick={() => {
                  setActionError(null);
                  setChosenWinner(null);
                  setManterPausadas(false);
                  setSubModal('decidir');
                }}
              >
                ✋ Decidir Manualmente
              </button>
            </>
          )}
          {battle && isFinalizado && isAdmin && (
            <button
              type="button"
              className="fen-bt-btn fen-bt-btn--danger"
              onClick={() => { setActionError(null); setSubModal('revert-confirm'); }}
              title="Reverter a decisão (até 24h após o fim)"
            >
              ↺ Reverter (24h)
            </button>
          )}
        </div>

        {/* Sub-modal: confirmar cancelar */}
        {subModal === 'cancel-confirm' && (
          <SubConfirm
            title="Cancelar este battle?"
            body="As campanhas voltam ao estado anterior. O agente não vai pausar nem escalar nada."
            confirmLabel={actionBusy ? 'Cancelando…' : 'Sim, cancelar'}
            danger
            busy={actionBusy}
            error={actionError}
            onClose={() => setSubModal(null)}
            onConfirm={handleCancel}
          />
        )}

        {/* Sub-modal: revert */}
        {subModal === 'revert-confirm' && (
          <SubConfirm
            title="Reverter a decisão deste battle?"
            body="As campanhas pausadas pelo agente serão reativadas e a vencedora perde o status. Disponível só por 24h após o fim."
            confirmLabel={actionBusy ? 'Revertendo…' : 'Sim, reverter'}
            danger
            busy={actionBusy}
            error={actionError}
            onClose={() => setSubModal(null)}
            onConfirm={handleRevert}
          />
        )}

        {/* Sub-modal: decidir manualmente */}
        {subModal === 'decidir' && battle && (
          <div
            className="fen-bt-overlay"
            onClick={() => !actionBusy && setSubModal(null)}
            style={{ zIndex: 90 }}
          >
            <div
              className="fen-bt-modal"
              onClick={(e) => e.stopPropagation()}
              style={{ width: 'min(520px, 100%)' }}
            >
              <div className="fen-bt-modal__head">
                <div className="fen-bt-modal__title">Decidir vencedora</div>
                <button
                  type="button"
                  className="fen-bt-modal__close"
                  onClick={() => setSubModal(null)}
                  disabled={actionBusy}
                  aria-label="Fechar"
                >×</button>
              </div>
              <div className="fen-bt-modal__body">
                <div className="fen-bt-field__hint">
                  Escolha qual campanha será marcada como <strong style={{ color: 'var(--fen-caffe)' }}>vencedora</strong>.
                  As outras serão pausadas pelo agente.
                </div>
                <div className="fen-bt-radios" style={{ gridTemplateColumns: '1fr' }} role="radiogroup">
                  {battle.campaigns.map((c) => (
                    <label key={c.campaign_id} className={`fen-bt-radio${chosenWinner === c.campaign_id ? ' is-on' : ''}`}>
                      <input
                        type="radio"
                        name="winner"
                        value={c.campaign_id}
                        checked={chosenWinner === c.campaign_id}
                        onChange={() => setChosenWinner(c.campaign_id)}
                      />
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span className="fen-bt-radio__title" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.name}
                        </span>
                        <span className="fen-bt-radio__sub">
                          {criterioLabel(battle.criterio)}: {fmtMetric(c.metric_value, battle.criterio)} · Gasto {fmtBRL(c.spend_cents)}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                <label className="fen-bt-radio" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={manterPausadas}
                    onChange={(e) => setManterPausadas(e.target.checked)}
                  />
                  <span>
                    <span className="fen-bt-radio__title">Manter as outras pausadas</span>
                    <span className="fen-bt-radio__sub">Se desmarcado, o agente reativa as perdedoras com o budget anterior.</span>
                  </span>
                </label>
                {actionError && <div className="fen-bt-form-error">{actionError}</div>}
              </div>
              <div className="fen-bt-modal__foot">
                <button
                  type="button"
                  className="fen-bt-btn fen-bt-btn--ghost"
                  onClick={() => setSubModal(null)}
                  disabled={actionBusy}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="fen-bt-btn fen-bt-btn--primary"
                  onClick={handleDecidir}
                  disabled={actionBusy || !chosenWinner}
                >
                  {actionBusy ? 'Aplicando…' : 'Confirmar vencedora'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface SubConfirmProps {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

function SubConfirm({ title, body, confirmLabel, danger, busy, error, onClose, onConfirm }: SubConfirmProps) {
  return (
    <div
      className="fen-bt-overlay"
      onClick={() => !busy && onClose()}
      style={{ zIndex: 90 }}
    >
      <div
        className="fen-bt-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 'min(460px, 100%)' }}
      >
        <div className="fen-bt-modal__head">
          <div className="fen-bt-modal__title">{title}</div>
          <button
            type="button"
            className="fen-bt-modal__close"
            onClick={onClose}
            disabled={busy}
            aria-label="Fechar"
          >×</button>
        </div>
        <div className="fen-bt-modal__body">
          <div style={{ font: '500 13px/1.5 var(--fen-font)', color: 'var(--fen-caffe)' }}>
            {body}
          </div>
          {error && <div className="fen-bt-form-error">{error}</div>}
        </div>
        <div className="fen-bt-modal__foot">
          <button
            type="button"
            className="fen-bt-btn fen-bt-btn--ghost"
            onClick={onClose}
            disabled={busy}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`fen-bt-btn ${danger ? 'fen-bt-btn--danger' : 'fen-bt-btn--primary'}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
