import { useState } from 'react';
import { Button, Field, signIn, meuPapel } from '@fenice/shared';
import { RoleToggle } from '../components/RoleToggle';
import { PasswordField } from '../components/PasswordField';
import { ROLE_PROFILES, INITIAL_PASSWORD, type Role } from '../mock';

interface LoginScreenProps {
  role: Role;
  onRoleChange: (role: Role) => void;
}

/** Etapa 1 — login real (Supabase) com alternância cliente/agência. */
export function LoginScreen({ role, onRoleChange }: LoginScreenProps) {
  const profile = ROLE_PROFILES[role];
  const [email, setEmail] = useState(profile.email);
  const [senha, setSenha] = useState(INITIAL_PASSWORD);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleEntrar() {
    setErro(null);
    setCarregando(true);
    try {
      await signIn(email.trim(), senha);
      const papel = await meuPapel();
      window.location.assign(papel === 'cliente' ? '/portal/' : '/painel/');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErro(msg.includes('Invalid login') ? 'E-mail ou senha incorretos.' : msg);
      setCarregando(false);
    }
  }

  // ao trocar de papel, reflete o e-mail-exemplo do papel selecionado
  const handleRole = (next: Role) => {
    onRoleChange(next);
    setEmail(ROLE_PROFILES[next].email);
  };

  return (
    <div className="fen-auth-view">
      <RoleToggle value={role} onChange={handleRole} />

      <h2 className="fen-auth-title">{profile.title}</h2>
      <p className="fen-auth-lead">{profile.sub}</p>

      <div className="fen-auth-field">
        <Field
          id="email"
          label="E-mail"
          type="email"
          placeholder="voce@empresa.com.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <PasswordField id="senha" label="Senha" value={senha} onChange={setSenha} />

      <div className="fen-auth-rowbetween">
        <label className="fen-auth-check">
          <input type="checkbox" defaultChecked /> Lembrar de mim
        </label>
        <button type="button" className="fen-auth-link">
          Esqueci a senha
        </button>
      </div>

      {erro && (
        <div className="fen-auth-err" role="alert" style={{ color: '#B23A2E', fontSize: 13, margin: '0 0 10px' }}>
          {erro}
        </div>
      )}

      <Button variant="primary" size="lg" className="fen-auth-submit" disabled={carregando} onClick={handleEntrar}>
        {carregando ? 'Entrando…' : 'Entrar →'}
      </Button>

      <div className="fen-auth-foot">
        Primeiro acesso? A Fenice enviou sua senha inicial. Você vai trocá-la agora.
      </div>
    </div>
  );
}
