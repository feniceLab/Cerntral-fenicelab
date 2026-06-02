import type { ReactNode } from 'react';
import { Card } from './Card';

export interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  /** Variacao percentual/absoluta; positivo = verde, negativo = terra. */
  delta?: number;
  deltaLabel?: ReactNode;
  hint?: ReactNode;
}

export function StatCard({ label, value, delta, deltaLabel, hint }: StatCardProps) {
  const hasDelta = delta !== undefined;
  const positive = (delta ?? 0) >= 0;

  return (
    <Card className="fen-statcard" pad={18}>
      <div className="fen-statcard__label">{label}</div>
      <div className="fen-statcard__value">{value}</div>
      {(hasDelta || hint) && (
        <div className="fen-statcard__foot">
          {hasDelta && (
            <span
              className={`fen-statcard__delta ${positive ? 'is-up' : 'is-down'}`}
            >
              {positive ? '+' : ''}
              {delta}
              {typeof delta === 'number' ? '%' : ''}
            </span>
          )}
          {deltaLabel && <span className="fen-statcard__delta-label">{deltaLabel}</span>}
          {hint && <span className="fen-statcard__hint">{hint}</span>}
        </div>
      )}
    </Card>
  );
}
