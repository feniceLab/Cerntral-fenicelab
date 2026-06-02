import { ROLE_PROFILES, type Role } from '../mock';
import { CheckIcon } from '../components/icons';

interface SuccessScreenProps {
  role: Role;
}

/** Etapa 3 — confirmação de senha definida e atalho para o portal. */
export function SuccessScreen({ role }: SuccessScreenProps) {
  const profile = ROLE_PROFILES[role];

  return (
    <div className="fen-auth-view">
      <div className="fen-auth-success">
        <div className="ring">
          <CheckIcon />
        </div>
        <h2 className="fen-auth-title">Tudo pronto!</h2>
        <p className="fen-auth-lead">
          Sua senha foi definida. Bem-vindo ao seu portal Fenice.
        </p>
        <a className="fen-btn fen-btn--primary fen-btn--lg fen-auth-submit" href={profile.portalHref}>
          Ir para o portal →
        </a>
      </div>
    </div>
  );
}
