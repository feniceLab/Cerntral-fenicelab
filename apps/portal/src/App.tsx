import { useState } from 'react';
import './portal.css';
import { DeviceFrame } from './components/DeviceFrame';
import { BottomNav } from './components/BottomNav';
import { Inicio } from './screens/Inicio';
import { Calendario } from './screens/Calendario';
import { Galeria } from './screens/Galeria';
import { Relatorios } from './screens/Relatorios';
import { BrandBook } from './screens/BrandBook';
import { Aprovacao } from './screens/Aprovacao';
import { Sugestoes } from './screens/Sugestoes';
import { TrafegoDash } from './screens/TrafegoDash';
import { TrafegoDetalhe } from './screens/TrafegoDetalhe';
import { TrafegoRelatorio } from './screens/TrafegoRelatorio';
import {
  isPortalTab,
  type PortalRoute,
  type PortalTab,
  type Surface,
  type TrafegoRoute,
} from './navigation';

export function App() {
  const [surface, setSurface] = useState<Surface>('portal');
  const [portal, setPortal] = useState<PortalRoute>('inicio');
  const [trafego, setTrafego] = useState<TrafegoRoute>('dash');

  const goPortalTab = (tab: PortalTab) => setPortal(tab);

  // bottom-nav so aparece nas telas-raiz do Portal (abas)
  const showNav = surface === 'portal' && isPortalTab(portal);

  return (
    <DeviceFrame>
      {/* alternador de superficie (Portal / Trafego) — clique fake, sem backend */}
      <SurfaceSwitch surface={surface} onChange={setSurface} />

      <div className="fen-pt-scroll">
        {surface === 'portal' ? (
          <PortalSurface route={portal} go={setPortal} />
        ) : (
          <TrafegoSurface route={trafego} go={setTrafego} />
        )}
      </div>

      {showNav && (
        <BottomNav
          tab={portal as PortalTab}
          onNavigate={goPortalTab}
          onFab={() => setPortal('sugestoes')}
        />
      )}
    </DeviceFrame>
  );
}

function SurfaceSwitch({ surface, onChange }: { surface: Surface; onChange: (s: Surface) => void }) {
  return (
    <div className="fen-pt-switch" style={{ marginTop: 46 }}>
      <button
        type="button"
        className={`fen-pt-switch__btn${surface === 'portal' ? ' is-on' : ''}`}
        onClick={() => onChange('portal')}
      >
        Portal do Cliente
      </button>
      <button
        type="button"
        className={`fen-pt-switch__btn${surface === 'trafego' ? ' is-on' : ''}`}
        onClick={() => onChange('trafego')}
      >
        Trafego Pago
      </button>
    </div>
  );
}

function PortalSurface({ route, go }: { route: PortalRoute; go: (r: PortalRoute) => void }) {
  switch (route) {
    case 'inicio':
      return <Inicio go={go} />;
    case 'calendario':
      return <Calendario />;
    case 'galeria':
      return <Galeria />;
    case 'relatorios':
      return <Relatorios />;
    case 'brand':
      return <BrandBook go={go} />;
    case 'aprovacao':
      return <Aprovacao go={go} />;
    case 'sugestoes':
      return <Sugestoes go={go} />;
    default:
      return <Inicio go={go} />;
  }
}

function TrafegoSurface({ route, go }: { route: TrafegoRoute; go: (r: TrafegoRoute) => void }) {
  switch (route) {
    case 'dash':
      return <TrafegoDash go={go} />;
    case 'detalhe':
      return <TrafegoDetalhe go={go} />;
    case 'relatorio':
      return <TrafegoRelatorio go={go} />;
    default:
      return <TrafegoDash go={go} />;
  }
}
