// ------------------------------------------------------------
// Navegacao por estado (cliques fake, sem backend / sem router).
// Duas superficies: Portal do Cliente e a aba Trafego Pago.
// ------------------------------------------------------------

/** Abas fixas da bottom-nav do Portal. */
export type PortalTab = 'inicio' | 'calendario' | 'galeria' | 'relatorios';

/** Todas as rotas da superficie Portal (abas + telas modais). */
export type PortalRoute = PortalTab | 'sugestoes' | 'aprovacao' | 'brand';

/** Superficie ativa do app: Portal do Cliente ou Performance (relatório de tráfego). */
export type Surface = 'portal' | 'performance';

/** Abas que renderizam a bottom-nav (telas "raiz" do Portal). */
export const PORTAL_TABS: PortalTab[] = ['inicio', 'calendario', 'galeria', 'relatorios'];

export const isPortalTab = (r: PortalRoute): r is PortalTab =>
  (PORTAL_TABS as string[]).includes(r);
