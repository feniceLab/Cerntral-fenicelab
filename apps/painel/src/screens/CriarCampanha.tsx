// Tela "Criar campanha" do painel.
// - Admin Fenice: pode escolher pra qual cliente criar.
// - Cliente: usa próprio slug.
import { useEffect, useMemo, useState } from 'react';
import { CLIENTES_FENICE, Wizard } from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';
import { useAuth } from '../auth/useAuth';

const TRAFEGO = (import.meta as any).env?.VITE_TRAFEGO_URL || '';

interface CriarCampanhaProps {
  /** Slug do cliente — se admin, pode trocar; se cliente, vem do auth. */
  initialSlug?: string;
  /** Draft id (resume) — vem da URL `?draft_id=…`. */
  draftId?: string;
  /** Callback ao fechar/finalizar. */
  onDone?: () => void;
}

const readSlugFromHash = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  const q = new URLSearchParams(window.location.hash.split('?')[1] || '');
  return q.get('slug') || undefined;
};

const readDraftIdFromHash = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  const q = new URLSearchParams(window.location.hash.split('?')[1] || '');
  return q.get('draft_id') || undefined;
};

export function CriarCampanha({ initialSlug, draftId, onDone }: CriarCampanhaProps) {
  const { role, email, clienteSlug, nomeExibicao, user } = useAuth();
  const isAdmin = role === 'admin_fenice';

  const slugFromUrl = readSlugFromHash();
  const draftFromUrl = readDraftIdFromHash();

  const [slug, setSlug] = useState<string>(
    initialSlug || slugFromUrl || clienteSlug || CLIENTES_FENICE[0]?.slug || 'arena'
  );

  useEffect(() => {
    if (!isAdmin && clienteSlug && slug !== clienteSlug) {
      setSlug(clienteSlug);
    }
  }, [isAdmin, clienteSlug, slug]);

  const handleApproveAndPublish = useMemo(() => {
    if (!isAdmin) return undefined;
    return async (id: string) => {
      try {
        const res = await fetch(`${TRAFEGO}/api/campaign/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, slug, aprovado_por: email || 'admin' }),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          return { ok: false, error: text || `HTTP ${res.status}` };
        }
        return { ok: true };
      } catch (err) {
        return { ok: false, error: (err as Error).message || 'Falha ao publicar' };
      }
    };
  }, [isAdmin, slug, email]);

  return (
    <>
      <Topbar
        kicker={`Wizard de criação · Sobral guardrails ativos${isAdmin ? ' · admin Fenice' : ''}`}
        title="Criar campanha"
      >
        {isAdmin && (
          <select
            className="fen-pn-tab"
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--fen-argilla)',
              background: 'var(--fen-surface)',
              color: 'var(--fen-caffe)',
              font: '600 13px/1 var(--fen-font)',
              cursor: 'pointer',
            }}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            aria-label="Cliente"
          >
            {CLIENTES_FENICE.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nome}
              </option>
            ))}
          </select>
        )}
      </Topbar>
      <Scroll>
        <Wizard
          key={`${slug}:${draftId || draftFromUrl || 'novo'}`}
          slug={slug}
          apiBase={TRAFEGO}
          initialDraftId={draftId || draftFromUrl}
          userRole={role || undefined}
          userEmail={email || nomeExibicao || undefined}
          userAuthId={user?.id}
          onClose={onDone}
          onApproveAndPublish={handleApproveAndPublish}
        />
      </Scroll>
    </>
  );
}
