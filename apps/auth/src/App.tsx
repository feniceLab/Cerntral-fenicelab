import { useState } from 'react';
import './styles.css';
import { BrandPanel } from './components/BrandPanel';
import { LoginScreen } from './screens/LoginScreen';
import { CreatePasswordScreen } from './screens/CreatePasswordScreen';
import { SuccessScreen } from './screens/SuccessScreen';
import type { Role } from './mock';

type Step = 'login' | 'create-password' | 'success';

/**
 * Superfície Auth — split-screen (marca + formulário).
 * Navegação por estado, sem backend: o login simula um 1º acesso
 * e encaminha para a criação de senha; ao salvar, exibe o sucesso.
 */
export function App() {
  const [step, setStep] = useState<Step>('login');
  const [role, setRole] = useState<Role>('cliente');

  return (
    <div className="fen-auth-split">
      <BrandPanel />

      <div className="fen-auth-pane">
        <div className="fen-auth-card">
          {step === 'login' && (
            <LoginScreen
              role={role}
              onRoleChange={setRole}
              onSubmit={() => setStep('create-password')}
            />
          )}

          {step === 'create-password' && (
            <CreatePasswordScreen onSubmit={() => setStep('success')} />
          )}

          {step === 'success' && <SuccessScreen role={role} />}
        </div>
      </div>
    </div>
  );
}
