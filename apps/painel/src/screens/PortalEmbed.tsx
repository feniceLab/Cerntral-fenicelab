import { type ClienteFenice } from '@fenice/shared';
import { Topbar } from '../components/Chrome';
import { PnIcon } from '../components/PnIcon';

// portal servido same-domain (/portal). Em dev, aponte VITE_PORTAL_URL pro :5182.
const PORTAL = (import.meta as any).env?.VITE_PORTAL_URL || '/portal';

export interface PortalEmbedProps {
  cliente: ClienteFenice;
  onBack: () => void;
}

export function PortalEmbed({ cliente: c, onBack }: PortalEmbedProps) {
  return (
    <>
      <Topbar kicker={`Portal · ${c.nome}`} title="Portal do cliente">
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            border: '1px solid var(--fen-line, rgba(154,140,122,.35))',
            background: 'transparent', color: 'var(--fen-ink, #2A211C)',
            font: '600 13px/1 var(--fen-font)', padding: '8px 12px',
            borderRadius: 10, cursor: 'pointer',
          }}
        >
          <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>
            <PnIcon name="chevR" size={15} />
          </span>
          Voltar
        </button>
      </Topbar>

      <div style={{ flex: 1, minHeight: 0, background: '#EFE7DC' }}>
        <iframe
          title={`Portal — ${c.nome}`}
          src={`${PORTAL}/?c=${c.slug}`}
          style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
          allow="fullscreen"
        />
      </div>
    </>
  );
}
