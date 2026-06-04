// Tela "Aprovar campanhas" (admin Fenice only).
// Lista drafts em status=aguardando_aprovacao, drilldown + aprovar/rejeitar.
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  clienteBySlug,
  type DraftCampanha,
  OBJETIVOS,
  TEMPLATES_SOBRAL,
} from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';
import { useAuth } from '../auth/useAuth';
import { RoleGate } from '../auth/RoleGate';

const TRAFEGO = (import.meta as any).env?.VITE_TRAFEGO_URL || '';

interface DraftListItem extends DraftCampanha {
  id: string;
}

const fmtBRL = (cents: number): string =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

const fmtDate = (iso?: string): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
};

export function AprovarCampanhas() {
  return (
    <RoleGate
      allow={['admin_fenice']}
      fallback={
        <>
          <Topbar title="Acesso restrito" kicker="Aprovação de campanhas" />
          <Scroll>
            <div className="criar-aprovar-empty">
              Essa tela é só pra equipe Fenice (admin_fenice).
            </div>
          </Scroll>
        </>
      }
    >
      <AprovarInner />
    </RoleGate>
  );
}

function AprovarInner() {
  const { email } = useAuth();
  const [drafts, setDrafts] = useState<DraftListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actioning, setActioning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${TRAFEGO}/api/campaign/drafts?status=aguardando_aprovacao`,
        { cache: 'no-store' }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { drafts?: DraftCampanha[] };
      const list = (data.drafts || []).filter((d): d is DraftListItem => !!d.id);
      setDrafts(list);
    } catch (err) {
      setError((err as Error).message || 'Falha ao carregar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const selected = useMemo(
    () => drafts.find((d) => d.id === selectedId) || null,
    [drafts, selectedId]
  );

  const aprovar = useCallback(async (draft: DraftListItem) => {
    setActioning(true);
    try {
      const res = await fetch(`${TRAFEGO}/api/campaign/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: draft.id, slug: draft.slug, aprovado_por: email || 'admin' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSelectedId(null);
      await load();
    } catch (err) {
      alert(`Falha ao aprovar: ${(err as Error).message}`);
    } finally {
      setActioning(false);
    }
  }, [email, load]);

  const rejeitar = useCallback(async (draft: DraftListItem) => {
    const motivo = window.prompt('Motivo da rejeição (será mostrado ao cliente):');
    if (!motivo || !motivo.trim()) return;
    setActioning(true);
    try {
      const res = await fetch(`${TRAFEGO}/api/campaign/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: draft.id,
          slug: draft.slug,
          motivo: motivo.trim(),
          rejeitado_por: email || 'admin',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSelectedId(null);
      await load();
    } catch (err) {
      alert(`Falha ao rejeitar: ${(err as Error).message}`);
    } finally {
      setActioning(false);
    }
  }, [email, load]);

  return (
    <>
      <Topbar
        title="Aprovar campanhas"
        kicker={`${drafts.length} aguardando · admin Fenice`}
      >
        <button
          type="button"
          className="wiz-btn-secondary"
          onClick={load}
          disabled={loading}
        >
          {loading ? '↻ …' : '↻ Recarregar'}
        </button>
      </Topbar>
      <Scroll>
        <div className="criar-aprovar">
          {error && (
            <div className="criar-guard criar-guard--erro" role="alert" style={{ marginBottom: 16 }}>
              <div className="criar-guard-icon">!</div>
              <div className="criar-guard-body">
                <div className="criar-guard-title">Falha ao carregar drafts</div>
                <div className="criar-guard-detail">{error}</div>
              </div>
            </div>
          )}

          {loading && drafts.length === 0 ? (
            <div className="criar-aprovar-empty">Carregando…</div>
          ) : drafts.length === 0 ? (
            <div className="criar-aprovar-empty">
              Nenhuma campanha aguardando aprovação.
            </div>
          ) : (
            <div className="criar-aprovar-list">
              <div className="criar-aprovar-row criar-aprovar-row--head">
                <div>Campanha</div>
                <div>Cliente</div>
                <div>Orçamento</div>
                <div>Enviado</div>
                <div>Ações</div>
              </div>
              {drafts.map((d) => (
                <DraftRow
                  key={d.id}
                  draft={d}
                  onSelect={() => setSelectedId(d.id === selectedId ? null : d.id)}
                  selected={d.id === selectedId}
                  onAprovar={() => aprovar(d)}
                  onRejeitar={() => rejeitar(d)}
                  disabled={actioning}
                />
              ))}
            </div>
          )}

          {selected && (
            <DraftDetail
              draft={selected}
              onClose={() => setSelectedId(null)}
              onAprovar={() => aprovar(selected)}
              onRejeitar={() => rejeitar(selected)}
              disabled={actioning}
            />
          )}
        </div>
      </Scroll>
    </>
  );
}

interface DraftRowProps {
  draft: DraftListItem;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
  onAprovar: () => void;
  onRejeitar: () => void;
}

function DraftRow({ draft, selected, disabled, onSelect, onAprovar, onRejeitar }: DraftRowProps) {
  const cliente = clienteBySlug(draft.slug);
  return (
    <div
      className="criar-aprovar-row"
      style={selected ? { borderColor: 'var(--fen-terra)' } : undefined}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
    >
      <div>
        <div className="criar-aprovar-name">{draft.nome_campanha || '(sem nome)'}</div>
        <div className="criar-aprovar-meta">
          {draft.vertical || '?'} · {draft.objetivo || '?'}
        </div>
      </div>
      <div className="criar-aprovar-cell">{cliente?.nome || draft.slug}</div>
      <div className="criar-aprovar-cell">
        {draft.budget ? `${fmtBRL(draft.budget.diario_cents)}/dia` : '—'}
      </div>
      <div className="criar-aprovar-cell">{fmtDate(draft.submitted_at || draft.updated_at)}</div>
      <div className="criar-aprovar-actions" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="wiz-btn-primary"
          style={{ padding: '6px 12px', fontSize: 12 }}
          onClick={onAprovar}
          disabled={disabled}
        >
          Aprovar
        </button>
        <button
          type="button"
          className="wiz-btn-secondary"
          style={{ padding: '6px 12px', fontSize: 12 }}
          onClick={onRejeitar}
          disabled={disabled}
        >
          Rejeitar
        </button>
      </div>
    </div>
  );
}

interface DraftDetailProps {
  draft: DraftListItem;
  disabled: boolean;
  onClose: () => void;
  onAprovar: () => void;
  onRejeitar: () => void;
}

function DraftDetail({ draft, disabled, onClose, onAprovar, onRejeitar }: DraftDetailProps) {
  const cliente = clienteBySlug(draft.slug);
  const tpl = draft.vertical ? TEMPLATES_SOBRAL[draft.vertical] : null;
  const objetivoLabel = OBJETIVOS.find((o) => o.key === draft.objetivo)?.label || '—';

  return (
    <div
      style={{
        marginTop: 24,
        padding: 24,
        background: 'var(--fen-surface)',
        border: '1px solid var(--fen-argilla)',
        borderRadius: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
        <div>
          <div style={{ font: '700 10px/1 var(--fen-font)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--fen-cotta-d)', marginBottom: 6 }}>
            Detalhe da campanha
          </div>
          <h3 style={{ margin: 0, font: '700 22px/1.2 var(--fen-font)', color: 'var(--fen-terra-d)' }}>
            {draft.nome_campanha || '(sem nome)'}
          </h3>
          <div style={{ font: '500 13px/1.4 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 6 }}>
            Cliente: <strong>{cliente?.nome || draft.slug}</strong> · {tpl?.nome_exibicao || draft.vertical}
          </div>
        </div>
        <button
          type="button"
          className="criar-wiz-close"
          onClick={onClose}
          aria-label="Fechar detalhe"
        >×</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 18 }}>
        <DetailField label="Objetivo" value={objetivoLabel} />
        <DetailField label="Vertical" value={tpl?.nome_exibicao || draft.vertical || '—'} />
        <DetailField label="Idade" value={draft.publico ? `${draft.publico.idade_min}-${draft.publico.idade_max} anos` : '—'} />
        <DetailField label="Gênero" value={draft.publico?.generos.join(' + ') || '—'} />
        <DetailField label="Cidade" value={draft.publico?.cidade || '—'} />
        <DetailField label="Raio" value={draft.publico ? `${draft.publico.raio_km} km` : '—'} />
        <DetailField label="Interesses" value={draft.publico?.interesses?.length ? draft.publico.interesses.join(', ') : '—'} />
        <DetailField label="Orçamento diário" value={draft.budget ? fmtBRL(draft.budget.diario_cents) : '—'} />
        <DetailField label="Início" value={draft.periodo?.data_inicio || '—'} />
        <DetailField label="Fim" value={draft.periodo?.data_fim || 'sem data fim'} />
        <DetailField label="CTA" value={draft.mensagem?.cta || '—'} />
        <DetailField label="Criativo" value={draft.criativo ? `${draft.criativo.tipo} · ${draft.criativo.filename || 'arquivo'}` : '—'} />
      </div>

      <div style={{ padding: 16, background: 'var(--fen-surface-2)', borderRadius: 8, marginBottom: 18 }}>
        <div style={{ font: '700 11px/1 var(--fen-font)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--fen-cotta-d)', marginBottom: 8 }}>
          Mensagem
        </div>
        <div style={{ font: '700 16px/1.3 var(--fen-font)', color: 'var(--fen-caffe)', marginBottom: 6 }}>
          {draft.mensagem?.titulo || '(sem título)'}
        </div>
        <div style={{ font: '500 13px/1.5 var(--fen-font)', color: 'var(--fen-muted)' }}>
          {draft.mensagem?.descricao || '(sem descrição)'}
        </div>
      </div>

      {draft.criativo?.preview_url && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ font: '700 11px/1 var(--fen-font)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--fen-cotta-d)', marginBottom: 8 }}>
            Criativo
          </div>
          {draft.criativo.tipo === 'video' ? (
            <video src={draft.criativo.preview_url} controls style={{ maxWidth: 320, borderRadius: 8 }} />
          ) : (
            <img src={draft.criativo.preview_url} alt="" style={{ maxWidth: 320, borderRadius: 8 }} />
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="wiz-btn-secondary"
          onClick={onRejeitar}
          disabled={disabled}
        >
          Rejeitar
        </button>
        <button
          type="button"
          className="wiz-btn-primary"
          onClick={onAprovar}
          disabled={disabled}
        >
          Aprovar e publicar
        </button>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ font: '700 10px/1 var(--fen-font)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--fen-muted)', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ font: '500 13.5px/1.4 var(--fen-font)', color: 'var(--fen-caffe)' }}>
        {value}
      </div>
    </div>
  );
}
