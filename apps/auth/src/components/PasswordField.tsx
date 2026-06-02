import { useState } from 'react';
import { Field } from '@fenice/shared';
import { EyeIcon } from './icons';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

/** Campo de senha do shared (Field) acrescido do botão mostrar/ocultar. */
export function PasswordField({ id, label, value, placeholder = '••••••••', onChange }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="fen-auth-eyefield">
      <Field
        id={id}
        label={label}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <button
        type="button"
        className={`fen-auth-eye${visible ? ' on' : ''}`}
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
      >
        <EyeIcon />
      </button>
    </div>
  );
}
