// ============================================================
// Trafego Pago — app standalone. Duas superficies navegaveis:
// Painel (agencia, desktop) e Portal (cliente, mobile, read-only).
// Sem backend: cliques fake, dados mockados, "ao vivo" via setInterval.
// ============================================================
import { useState } from 'react';
import './styles/trafego.css';
import { PainelApp } from './screens/PainelApp';
import { PortalApp } from './screens/PortalApp';
import type { Surface } from './lib/nav';

export function App() {
  const [surface, setSurface] = useState<Surface>('painel');

  return (
    <>
      <div className="fen-tp-surface-switch">
        <button data-on={surface === 'painel'} onClick={() => setSurface('painel')}>
          Painel
        </button>
        <button data-on={surface === 'portal'} onClick={() => setSurface('portal')}>
          Portal
        </button>
      </div>
      <div className={`fen-tp-stage fen-tp-stage--${surface}`}>
        {surface === 'painel' ? <PainelApp /> : <PortalApp />}
      </div>
    </>
  );
}
