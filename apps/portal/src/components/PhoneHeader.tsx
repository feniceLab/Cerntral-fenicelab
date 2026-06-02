import type { ReactNode } from 'react';
import { Kicker } from '@fenice/shared';
import { ScreenIcon } from '../lib/ScreenIcon';

interface PhoneHeaderProps {
  title: string;
  kicker?: ReactNode;
  right?: ReactNode;
  /** Seta de voltar a esquerda (telas de trafego/detalhe). */
  onBack?: () => void;
}

/** Header sticky padrao das telas do Portal. */
export function PhoneHeader({ title, kicker, right, onBack }: PhoneHeaderProps) {
  return (
    <div className="fen-pt-header">
      <div className="fen-pt-header__row" style={onBack ? { alignItems: 'center' } : undefined}>
        {onBack && (
          <button type="button" className="fen-pt-iconbtn fen-pt-iconbtn--back" onClick={onBack} aria-label="Voltar">
            <ScreenIcon name="arrowR" size={18} />
          </button>
        )}
        <div style={{ flex: onBack ? 1 : undefined }}>
          {kicker && (
            <div style={{ marginBottom: 5 }}>
              <Kicker>{kicker}</Kicker>
            </div>
          )}
          <div className="fen-pt-header__title">{title}</div>
        </div>
        {right}
      </div>
    </div>
  );
}
