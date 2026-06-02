import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  pad?: number | string;
  dark?: boolean;
}

export function Card({ pad = 18, dark = false, className, style, children, ...rest }: CardProps) {
  const classes = [
    'fen-card',
    dark ? 'fen-card--dark' : '',
    rest.onClick ? 'fen-card--clickable' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={{ padding: pad, ...style }} {...rest}>
      {children}
    </div>
  );
}
