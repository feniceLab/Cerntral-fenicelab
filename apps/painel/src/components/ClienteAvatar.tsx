import { useState } from 'react';
import type { ClienteFenice } from '@fenice/shared';

export interface ClienteAvatarProps {
  c: ClienteFenice;
  size?: number;
}

export function ClienteAvatar({ c, size = 40 }: ClienteAvatarProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const hasLogo = !!c.logo && !logoFailed;

  const base: React.CSSProperties = {
    width: size,
    height: size,
    flex: '0 0 auto',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    overflow: 'hidden',
    border: '1px solid var(--fen-border)',
    background: hasLogo ? '#FFFFFF' : c.cor,
  };

  if (hasLogo) {
    // Painel tem base='/painel/' — assets do public/ ficam sob BASE_URL.
    const baseUrl = (import.meta as any).env?.BASE_URL || '/';
    const src = c.logo!.startsWith('/') ? baseUrl.replace(/\/$/, '') + c.logo : c.logo!;
    return (
      <span aria-hidden style={base}>
        <img
          src={src}
          alt=""
          onError={() => setLogoFailed(true)}
          style={{ width: '78%', height: '78%', objectFit: 'contain' }}
        />
      </span>
    );
  }

  return (
    <span aria-hidden style={base}>
      <span
        style={{
          font: `900 ${Math.round(size * 0.42)}px/1 var(--fen-display)`,
          color: 'var(--fen-avorio)',
          letterSpacing: '-0.02em',
        }}
      >
        {c.letter}
      </span>
    </span>
  );
}
