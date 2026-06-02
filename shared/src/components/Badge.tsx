import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeTone =
  | 'terra'
  | 'cotta'
  | 'ink'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone = 'terra', className, children, ...rest }: BadgeProps) {
  const classes = ['fen-badge', `fen-badge--${tone}`, className ?? ''].filter(Boolean).join(' ');
  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}

/** Alias semantico — no design system "Tag" e "Badge" sao o mesmo atomo (pilula). */
export const Tag = Badge;
export type TagProps = BadgeProps;
