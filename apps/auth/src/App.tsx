import { useState } from 'react';
import './styles.css';
import { BrandPanel } from './components/BrandPanel';
import { LoginScreen } from './screens/LoginScreen';
import type { Role } from './mock';

/**
 * Superfície Auth — split-screen (marca + formulário).
 * Login real via Supabase: ao autenticar, redireciona para /painel ou /portal
 * conforme o papel do usuário. (As telas CreatePassword/Success seguem no
 * projeto para o fluxo de 1º acesso, a serem ligadas numa próxima etapa.)
 */
export function App() {
  const [role, setRole] = useState<Role>('cliente');

  return (
    <div className="fen-auth-split">
      <BrandPanel />

      <div className="fen-auth-pane">
        <div className="fen-auth-card">
          <LoginScreen role={role} onRoleChange={setRole} />
        </div>
      </div>
    </div>
  );
}
