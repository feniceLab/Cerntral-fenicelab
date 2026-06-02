import type { HTMLAttributes, ReactNode } from 'react';

export interface KickerProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

/** Rotulo de secao em CAIXA-ALTA, terracota, sem quebra de linha. */
export function Kicker({ className, children, ...rest }: KickerProps) {
  const classes = ['fen-kicker', className ?? ''].filter(Boolean).join(' ');
  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
