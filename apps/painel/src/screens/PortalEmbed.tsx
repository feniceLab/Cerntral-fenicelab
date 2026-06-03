import { type ClienteFenice } from '@fenice/shared';
import { Topbar } from '../components/Chrome';
import { PnIcon } from '../components/PnIcon';

export interface PortalEmbedProps {
  cliente: ClienteFenice;
  onBack: () => void;
}

export function PortalEmbed({ cliente: c, onBack }: PortalEmbedProps) {
  const dominio = c.portalUrl ? c.portalUrl.replace(/^https?:\/\//, '') : null;

  return (
    <>
      <Topbar kicker={dominio ? `Portal · ${dominio}` : `Portal · ${c.nome}`} title={c.nome}>
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

      <div style={{ flex: 1, minHeight: 0, background: '#0A0A0A' }}>
        {c.portalUrl ? (
          // portal REAL do cliente (subdomínio próprio), embutido na central.
          <iframe
            title={`Portal — ${c.nome}`}
            src={c.portalUrl}
            style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
            allow="fullscreen"
          />
        ) : (
          <div style={{ padding: 32 }}>
            <div style={{ font: '600 16px/1.3 var(--fen-font)', color: 'var(--fen-ink, #2A211C)' }}>
              Portal em construção
            </div>
            <div style={{ marginTop: 8, color: 'var(--fen-muted)', font: '500 13px/1.5 var(--fen-font)' }}>
              {c.nome} ainda não tem portal próprio publicado.
              {c.status === 'setup' ? ' Cliente em fase de setup.' : ' Em breve aqui.'}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
