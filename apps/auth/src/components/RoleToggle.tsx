import type { Role } from '../mock';

interface RoleToggleProps {
  value: Role;
  onChange: (role: Role) => void;
}

/** Alternância segmentada cliente / agência (specific da tela de login). */
export function RoleToggle({ value, onChange }: RoleToggleProps) {
  return (
    <div className="fen-auth-role" role="tablist" aria-label="Tipo de acesso">
      <button
        type="button"
        role="tab"
        aria-selected={value === 'cliente'}
        className={value === 'cliente' ? 'on' : ''}
        onClick={() => onChange('cliente')}
      >
        Sou cliente
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === 'agencia'}
        className={value === 'agencia' ? 'on' : ''}
        onClick={() => onChange('agencia')}
      >
        Sou da agência
      </button>
    </div>
  );
}
