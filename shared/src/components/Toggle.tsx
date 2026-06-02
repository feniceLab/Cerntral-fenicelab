import { useState, type HTMLAttributes } from 'react';

export interface ToggleProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  tone?: 'success' | 'terra';
  label?: string;
}

export function Toggle({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  tone = 'success',
  label,
  className,
  ...rest
}: ToggleProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const on = isControlled ? checked : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !on;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const classes = [
    'fen-toggle',
    `fen-toggle--${tone}`,
    on ? 'fen-toggle--on' : '',
    disabled ? 'fen-toggle--disabled' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      className={classes}
      onClick={toggle}
      {...rest}
    >
      <span className="fen-toggle__knob" />
    </button>
  );
}
