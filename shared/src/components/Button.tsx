import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from './Icon';

export type ButtonVariant = 'primary' | 'ink' | 'outline' | 'ghost' | 'soft' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const classes = [
    'fen-btn',
    `fen-btn--${variant}`,
    `fen-btn--${size}`,
    loading ? 'fen-btn--loading' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={isDisabled} aria-busy={loading || undefined} {...rest}>
      {loading && <span className="fen-spinner" aria-hidden="true" />}
      {!loading && icon && <Icon name={icon} size={16} strokeWidth={2} />}
      {children}
    </button>
  );
}
