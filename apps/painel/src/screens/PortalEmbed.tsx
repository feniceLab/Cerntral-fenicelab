import { type ClienteFenice } from '@fenice/shared';
import { PnIcon } from '../components/PnIcon';

export interface PortalEmbedProps {
  cliente: ClienteFenice;
  onBack: () => void;
}

/**
 * Mini-barra acima do iframe — sem título grande (o portal embutido já tem o próprio header).
 * Mostra apenas: Voltar · domínio · abrir-em-nova-aba.
 */
export function PortalEmbed({ cliente: c, onBack }: PortalEmbedProps) {
  const dominio = c.portalUrl ? c.portalUrl.replace(/^https?:\/\//, '') : null;

  return (
    <>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 20px 10px 64px',
          background: 'var(--fen-avorio)',
          borderBottom: '1px solid var(--fen-border)',
          position: 'sticky', top: 0, zIndex: 3,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            border: '1px solid var(--fen-border)',
            background: 'var(--fen-surface)',
            color: 'var(--fen-caffe)',
            font: '600 13px/1 var(--fen-font)',
            padding: '7px 11px',
            borderRadius: 8, cursor: 'pointer',
          }}
        >
          <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>
            <PnIcon name="chevR" size={14} />
          </span>
          Voltar
        </button>

        {dominio && (
          <a
            href={c.portalUrl!}
            target="_blank"
            rel="noreferrer"
            style={{
              marginLeft: 'auto',
              font: '600 12px/1 var(--fen-font)',
              letterSpacing: '.04em',
              color: 'var(--fen-muted)',
              textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}
          >
            {dominio}
            <span aria-hidden style={{ fontSize: 11 }}>↗</span>
          </a>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, background: '#0A0A0A' }}>
        {c.portalUrl ? (
          <iframe
            title={`Portal — ${c.nome}`}
            src={c.portalUrl}
            style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
            allow="fullscreen"
          />
        ) : (
          <div style={{ padding: 32, background: 'var(--fen-avorio)' }}>
            <div style={{ font: '600 16px/1.3 var(--fen-font)', color: 'var(--fen-caffe)' }}>
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
