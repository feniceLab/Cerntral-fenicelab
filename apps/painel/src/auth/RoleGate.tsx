import { type ReactNode } from 'react';
import { useAuth } from './useAuth';
import type { FeniceRole } from './AuthProvider';

export interface RoleGateProps {
  allow: FeniceRole[];
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Renderiza children apenas se o role atual está em `allow`.
 * Caso contrário, mostra fallback (ou null).
 */
export function RoleGate({ allow, fallback = null, children }: RoleGateProps) {
  const { role } = useAuth();
  if (role && allow.includes(role)) return <>{children}</>;
  return <>{fallback}</>;
}
