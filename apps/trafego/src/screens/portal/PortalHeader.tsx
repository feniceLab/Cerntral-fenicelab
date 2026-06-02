// ============================================================
// Portal · cabecalho mobile (kicker + titulo + voltar opcional).
// ============================================================
import type { ReactNode } from 'react';
import { Kicker } from '@fenice/shared';
import { TpIcon } from '../../lib/icons';

export function PortalHeader({
  title,
  kicker,
  onBack,
}: {
  title: ReactNode;
  kicker: ReactNode;
  onBack?: () => void;
}) {
  return (
    <div
      style={{
        padding: '54px 18px 12px',
        background: 'var(--fen-avorio)',
        position: 'sticky',
        top: 0,
        zIndex: 4,
        borderBottom: '1px solid var(--fen-border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onBack && (
          <div
            onClick={onBack}
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              background: 'var(--fen-surface)',
              border: '1px solid var(--fen-border)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--fen-caffe)',
              transform: 'scaleX(-1)',
              cursor: 'pointer',
            }}
          >
            <TpIcon name="arrowR" size={18} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 4 }}>
            <Kicker>{kicker}</Kicker>
          </div>
          <div
            style={{
              fontFamily: 'var(--fen-display)',
              fontWeight: 900,
              fontSize: 26,
              letterSpacing: '-.02em',
              color: 'var(--fen-caffe)',
              lineHeight: 1,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}
