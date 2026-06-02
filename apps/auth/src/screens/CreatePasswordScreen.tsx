import { useMemo, useState } from 'react';
import { Button, Field } from '@fenice/shared';
import { PasswordField } from '../components/PasswordField';
import { ShieldIcon, CheckMini } from '../components/icons';
import { PASSWORD_REQS } from '../mock';

interface CreatePasswordScreenProps {
  onSubmit: () => void;
}

/** Etapa 2 — criação de senha no 1º acesso, com checklist ao vivo. */
export function CreatePasswordScreen({ onSubmit }: CreatePasswordScreenProps) {
  const [nova, setNova] = useState('');
  const [conf, setConf] = useState('');

  const checks = useMemo(
    () => PASSWORD_REQS.map((req) => ({ ...req, ok: req.test(nova) })),
    [nova],
  );
  const allOk = checks.every((c) => c.ok);
  const matches = nova.length > 0 && nova === conf;
  const canSubmit = allOk && matches;

  return (
    <div className="fen-auth-view">
      <h2 className="fen-auth-title">Crie sua senha</h2>
      <p className="fen-auth-lead">
        Primeiro acesso detectado. Defina uma senha só sua para continuar.
      </p>

      <div className="fen-auth-hint">
        <ShieldIcon />
        <span>
          A senha inicial enviada pela Fenice é temporária. Por segurança, ela precisa ser
          trocada no 1º acesso.
        </span>
      </div>

      <PasswordField id="nova" label="Nova senha" value={nova} onChange={setNova} />

      <ul className="fen-auth-reqs">
        {checks.map((c) => (
          <li key={c.id} className={c.ok ? 'ok' : ''}>
            <span className="dot">{c.ok && <CheckMini />}</span>
            {c.label}
          </li>
        ))}
      </ul>

      <div className="fen-auth-field">
        <Field
          id="conf"
          label="Confirmar senha"
          type="password"
          placeholder="••••••••"
          value={conf}
          onChange={(e) => setConf(e.target.value)}
          error={conf.length > 0 && !matches ? 'As senhas não conferem.' : undefined}
        />
      </div>

      <Button
        variant="primary"
        size="lg"
        className="fen-auth-submit"
        disabled={!canSubmit}
        onClick={onSubmit}
      >
        Salvar e entrar →
      </Button>
    </div>
  );
}
