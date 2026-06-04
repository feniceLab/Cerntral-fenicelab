import { useState, type FormEvent } from 'react';
import { useAuth } from './useAuth';
import './auth.css';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    const { error: err } = await signIn(email.trim(), password);
    setBusy(false);
    if (err) {
      setError(traduzErro(err));
    }
  };

  return (
    <div className="fen-auth-stage">
      <div className="fen-auth-card">
        <div className="fen-auth-brand">
          <span className="fen-auth-brand-kicker">Fenice Lab</span>
          <span className="fen-auth-brand-mark">Central</span>
        </div>
        <h1 className="fen-auth-title">Entrar no Painel</h1>
        <p className="fen-auth-sub">Acesso restrito à agência e clientes Fenice.</p>

        <form className="fen-auth-form" onSubmit={onSubmit} noValidate>
          <div className="fen-auth-field">
            <label className="fen-auth-label" htmlFor="fen-auth-email">E-mail</label>
            <input
              id="fen-auth-email"
              className="fen-auth-input"
              type="email"
              autoComplete="email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              placeholder="seu@email.com"
            />
          </div>
          <div className="fen-auth-field">
            <label className="fen-auth-label" htmlFor="fen-auth-password">Senha</label>
            <input
              id="fen-auth-password"
              className="fen-auth-input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              placeholder="••••••••"
            />
          </div>

          {error && <div className="fen-auth-error">{error}</div>}

          <button type="submit" className="fen-auth-btn" disabled={busy || !email || !password}>
            {busy ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className="fen-auth-foot">
          Esqueceu a senha? Fale com a equipe Fenice.
        </div>
      </div>
    </div>
  );
}

function traduzErro(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login') || m.includes('invalid credentials')) {
    return 'E-mail ou senha incorretos.';
  }
  if (m.includes('email not confirmed')) {
    return 'E-mail ainda não confirmado.';
  }
  if (m.includes('rate limit')) {
    return 'Muitas tentativas. Aguarde alguns minutos.';
  }
  return msg;
}
