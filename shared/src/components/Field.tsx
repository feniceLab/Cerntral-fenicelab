import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode;
  error?: string;
  hint?: ReactNode;
}

/** Campo de formulario com label, estado de erro e anel de foco terracota. */
export function Field({ label, error, hint, id, className, disabled, ...rest }: FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errId = `${inputId}-err`;
  const hasError = Boolean(error);

  const inputClasses = ['fen-input', hasError ? 'fen-input--error' : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className="fen-field">
      {label && (
        <label className="fen-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={inputClasses}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? errId : undefined}
        {...rest}
      />
      {hint && !hasError && <div className="fen-field__hint">{hint}</div>}
      {hasError && (
        <div className="fen-field__err" id={errId} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

/** Alias: o atomo de input cru tambem e exportado como Input. */
export { Field as Input };
export type InputProps = FieldProps;
