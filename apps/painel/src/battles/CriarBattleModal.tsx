// ============================================================
// CriarBattleModal — formulário de criação de battle.
// Admin escolhe cliente; cliente é forçado ao próprio slug.
// ============================================================
import { useEffect, useMemo, useState } from 'react';
import { CLIENTES_FENICE, clienteBySlug } from '@fenice/shared';
import type { BattleCriterio, BattleEstrategia, CampaignListItem } from './types';
import { criterioLabel, estrategiaLabel, fmtBRL } from './format';
import { createBattle, listCampaignsForBattle } from './api';

const MIN_BUDGET_CENTS = 30_000; // R$300
const MIN_CAMPS = 2;
const MAX_CAMPS = 5;

interface Props {
  isAdmin: boolean;
  forcedSlug: string | null;
  actorEmail: string | null;
  actorAuthId: string | null;
  onClose: () => void;
  onCreated: () => void;
}

interface CriterioOption {
  value: BattleCriterio;
  title: string;
  sub: string;
}
const CRITERIOS: CriterioOption[] = [
  { value: 'roas', title: 'ROAS', sub: 'Maior retorno por real investido (padrão)' },
  { value: 'cpa', title: 'CPA', sub: 'Menor custo por compra é melhor' },
  { value: 'compras', title: 'Compras', sub: 'Volume absoluto de conversões' },
  { value: 'ctr', title: 'CTR', sub: 'Taxa de clique no anúncio' },
];

interface EstrategiaOption {
  value: BattleEstrategia;
  title: string;
  sub: string;
}
const ESTRATEGIAS: EstrategiaOption[] = [
  { value: 'auto_kill', title: 'Auto-Kill (padrão)', sub: 'Agente pausa as perdedoras automaticamente ao fim.' },
  { value: 'manual', title: 'Manual', sub: 'Você decide a vencedora ao fim do battle.' },
  { value: 'auto_scale', title: 'Auto-Scale', sub: 'Vencedora ganha +20% de budget; resto pausa.' },
];

export function CriarBattleModal({ isAdmin, forcedSlug, actorEmail, actorAuthId, onClose, onCreated }: Props) {
  // Slugs disponíveis (admin escolhe; cliente é fixo).
  const slugOptions = useMemo(() => {
    if (!isAdmin && forcedSlug) {
      const c = clienteBySlug(forcedSlug);
      return c ? [c] : [];
    }
    return CLIENTES_FENICE.filter((c) => c.status === 'ativo');
  }, [isAdmin, forcedSlug]);

  const [slug, setSlug] = useState<string>(() => forcedSlug ?? slugOptions[0]?.slug ?? '');
  const [nome, setNome] = useState('');
  const [budgetStr, setBudgetStr] = useState('500'); // BRL inteiros (input)
  const [criterio, setCriterio] = useState<BattleCriterio>('roas');
  const [estrategia, setEstrategia] = useState<BattleEstrategia>('auto_kill');
  const [campaigns, setCampaigns] = useState<CampaignListItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loadingCamps, setLoadingCamps] = useState(false);
  const [campsError, setCampsError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Recarrega campanhas quando o slug muda.
  useEffect(() => {
    if (!slug) {
      setCampaigns([]);
      setSelectedIds(new Set());
      return;
    }
    const ctrl = new AbortController();
    setLoadingCamps(true);
    setCampsError(null);
    listCampaignsForBattle(slug, ctrl.signal).then((res) => {
      if (res.ok) {
        setCampaigns(res.data);
        setSelectedIds(new Set());
      } else if (res.error !== 'aborted') {
        setCampsError(res.error);
        setCampaigns([]);
      }
      setLoadingCamps(false);
    });
    return () => ctrl.abort();
  }, [slug]);

  const budgetCents = useMemo(() => {
    const n = Number(budgetStr.replace(/[^\d]/g, ''));
    if (!Number.isFinite(n) || n <= 0) return 0;
    return n * 100;
  }, [budgetStr]);

  const validation = useMemo((): { ok: true } | { ok: false; reason: string } => {
    if (!slug) return { ok: false, reason: 'Escolha o cliente.' };
    if (nome.trim().length < 3) return { ok: false, reason: 'Dê um nome ao battle (mín 3 caracteres).' };
    if (budgetCents < MIN_BUDGET_CENTS) {
      return { ok: false, reason: `Budget mínimo é ${fmtBRL(MIN_BUDGET_CENTS)}.` };
    }
    if (selectedIds.size < MIN_CAMPS) {
      return { ok: false, reason: `Selecione no mínimo ${MIN_CAMPS} campanhas.` };
    }
    if (selectedIds.size > MAX_CAMPS) {
      return { ok: false, reason: `Selecione no máximo ${MAX_CAMPS} campanhas.` };
    }
    return { ok: true };
  }, [slug, nome, budgetCents, selectedIds]);

  const toggleCampaign = (id: string, disabled: boolean) => {
    if (disabled) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (next.size >= MAX_CAMPS) return prev;
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!validation.ok) {
      setSubmitError(validation.reason);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    const res = await createBattle({
      slug,
      nome: nome.trim(),
      budget_total_cents: budgetCents,
      criterio,
      estrategia,
      campaign_ids: Array.from(selectedIds),
      actor_email: actorEmail,
      actor_auth_id: actorAuthId,
    });
    if (res.ok) {
      onCreated();
    } else {
      setSubmitError(res.error);
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fen-bt-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fen-bt-create-title"
    >
      <div className="fen-bt-modal fen-bt-modal--lg" onClick={(e) => e.stopPropagation()}>
        <div className="fen-bt-modal__head">
          <div>
            <div className="fen-bt-modal__kicker">Novo battle</div>
            <div id="fen-bt-create-title" className="fen-bt-modal__title">
              Configurar nova disputa entre campanhas
            </div>
          </div>
          <button type="button" className="fen-bt-modal__close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <div className="fen-bt-modal__body">
          {/* Nome */}
          <div className="fen-bt-field">
            <label htmlFor="bt-nome" className="fen-bt-field__label">Nome do battle</label>
            <input
              id="bt-nome"
              type="text"
              className="fen-bt-input"
              placeholder="Ex: Hamb vs Pizza · Junho"
              value={nome}
              maxLength={80}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          {/* Cliente */}
          <div className="fen-bt-field">
            <label htmlFor="bt-slug" className="fen-bt-field__label">Cliente</label>
            {isAdmin ? (
              <select
                id="bt-slug"
                className="fen-bt-select"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              >
                <option value="" disabled>Selecione…</option>
                {slugOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.nome}</option>
                ))}
              </select>
            ) : (
              <input
                id="bt-slug"
                type="text"
                className="fen-bt-input"
                value={slugOptions[0]?.nome ?? slug}
                readOnly
                disabled
              />
            )}
          </div>

          {/* Budget */}
          <div className="fen-bt-field">
            <label htmlFor="bt-budget" className="fen-bt-field__label">Budget total (R$)</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ font: '600 13px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>R$</span>
              <input
                id="bt-budget"
                type="text"
                inputMode="numeric"
                className="fen-bt-input"
                value={budgetStr}
                onChange={(e) => setBudgetStr(e.target.value.replace(/[^\d]/g, ''))}
              />
            </div>
            <div className="fen-bt-field__hint">
              Mínimo {fmtBRL(MIN_BUDGET_CENTS)} · será distribuído entre as campanhas selecionadas.
            </div>
          </div>

          {/* Critério */}
          <div className="fen-bt-field">
            <div className="fen-bt-field__label">Critério de vitória</div>
            <div className="fen-bt-radios" role="radiogroup" aria-label="Critério de vitória">
              {CRITERIOS.map((opt) => (
                <label
                  key={opt.value}
                  className={`fen-bt-radio${criterio === opt.value ? ' is-on' : ''}`}
                >
                  <input
                    type="radio"
                    name="bt-criterio"
                    value={opt.value}
                    checked={criterio === opt.value}
                    onChange={() => setCriterio(opt.value)}
                  />
                  <span>
                    <span className="fen-bt-radio__title">{opt.title}</span>
                    <span className="fen-bt-radio__sub">{opt.sub}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Estratégia */}
          <div className="fen-bt-field">
            <div className="fen-bt-field__label">Estratégia ao fim</div>
            <div className="fen-bt-radios" role="radiogroup" aria-label="Estratégia ao fim">
              {ESTRATEGIAS.map((opt) => (
                <label
                  key={opt.value}
                  className={`fen-bt-radio${estrategia === opt.value ? ' is-on' : ''}`}
                >
                  <input
                    type="radio"
                    name="bt-estrategia"
                    value={opt.value}
                    checked={estrategia === opt.value}
                    onChange={() => setEstrategia(opt.value)}
                  />
                  <span>
                    <span className="fen-bt-radio__title">{opt.title}</span>
                    <span className="fen-bt-radio__sub">{opt.sub}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Campanhas */}
          <div className="fen-bt-field">
            <div className="fen-bt-field__label">
              Campanhas participantes ({selectedIds.size}/{MAX_CAMPS})
            </div>
            <div className="fen-bt-field__hint">
              Mínimo {MIN_CAMPS}, máximo {MAX_CAMPS}. Campanhas já em battle ativo ficam bloqueadas.
            </div>
            {loadingCamps ? (
              <div className="fen-bt-empty" style={{ padding: '20px 16px' }}>Carregando campanhas…</div>
            ) : campsError ? (
              <div className="fen-bt-form-error">Falha ao carregar campanhas: {campsError}</div>
            ) : campaigns.length === 0 ? (
              <div className="fen-bt-empty" style={{ padding: '20px 16px' }}>
                Nenhuma campanha disponível para esse cliente.
              </div>
            ) : (
              <div className="fen-bt-checklist">
                {campaigns.map((c) => {
                  const isSel = selectedIds.has(c.campaign_id);
                  const lockedByOther = !!c.in_active_battle;
                  const lockedByLimit = !isSel && selectedIds.size >= MAX_CAMPS;
                  const disabled = lockedByOther || lockedByLimit;
                  const isActive = c.effective_status === 'ACTIVE';
                  return (
                    <label
                      key={c.campaign_id}
                      className={`fen-bt-checklist__item${disabled ? ' is-disabled' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isSel}
                        disabled={disabled}
                        onChange={() => toggleCampaign(c.campaign_id, disabled)}
                      />
                      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.name}
                      </span>
                      <span className="fen-bt-checklist__meta">
                        {c.daily_budget_cents != null ? `${fmtBRL(c.daily_budget_cents)}/dia` : 'sem budget'}
                        {' · '}
                        {isActive ? 'ativa' : (c.effective_status || 'off').toLowerCase()}
                        {lockedByOther ? ' · em battle' : ''}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {submitError && <div className="fen-bt-form-error">{submitError}</div>}

          {/* Resumo da escolha */}
          <div className="fen-bt-field__hint" aria-live="polite">
            Resumo: <strong style={{ color: 'var(--fen-caffe)' }}>{nome.trim() || '—'}</strong> · {fmtBRL(budgetCents)} ·
            {' '}{criterioLabel(criterio)} · {estrategiaLabel(estrategia)} · {selectedIds.size} campanhas.
          </div>
        </div>

        <div className="fen-bt-modal__foot">
          <button
            type="button"
            className="fen-bt-btn fen-bt-btn--ghost"
            onClick={onClose}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="fen-bt-btn fen-bt-btn--primary"
            onClick={handleSubmit}
            disabled={submitting || !validation.ok}
            title={validation.ok ? undefined : validation.reason}
          >
            {submitting ? 'Criando…' : 'Criar Battle'}
          </button>
        </div>
      </div>
    </div>
  );
}
