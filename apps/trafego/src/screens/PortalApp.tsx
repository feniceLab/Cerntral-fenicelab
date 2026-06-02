// ============================================================
// Superficie PORTAL (cliente, mobile, read-only). iPhone + navegacao por estado.
// ============================================================
import { useState } from 'react';
import { IOSFrame } from '../components/IOSFrame';
import { Dash } from './portal/Dash';
import { Detalhe } from './portal/Detalhe';
import { Relatorio } from './portal/Relatorio';
import type { PortalView } from '../lib/nav';

export function PortalApp() {
  const [view, setView] = useState<PortalView>('dash');
  const go = (v: PortalView) => setView(v);

  const screen = {
    dash: <Dash go={go} />,
    detalhe: <Detalhe go={go} />,
    relatorio: <Relatorio go={go} />,
  }[view];

  return <IOSFrame>{screen}</IOSFrame>;
}
