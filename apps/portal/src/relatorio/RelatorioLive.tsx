import { WarRoomShell, type ClienteTheme } from '@fenice/shared';

export interface RelatorioLiveProps {
  slug: string;
  clienteNome: string;
  logo: string | null;
  theme: ClienteTheme;
}

/**
 * Wrapper do war room compartilhado (shared/components/performance).
 * Surface = portal (cliente final). Painel admin usa o mesmo WarRoomShell
 * com surface='painel' direto em apps/painel/screens/Performance.tsx.
 */
export function RelatorioLive(props: RelatorioLiveProps) {
  return <WarRoomShell {...props} surface="portal" />;
}
