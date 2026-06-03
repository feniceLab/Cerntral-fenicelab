import { useState } from 'react';
import { clienteBySlug, themeBySlug } from '@fenice/shared';
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
import { Relatorio } from './relatorio/Relatorio';
import { REPORTS } from './relatorio/report-data';
import {
  isPortalTab,
  type PortalRoute,
  type PortalTab,
  type Surface,
} from './navigation';

// cliente do portal: vem de ?c=<slug> (default suprema). No futuro vem da sessão.
const PARAMS = new URLSearchParams(window.location.search);
const SLUG = PARAMS.get('c') || 'suprema';
const SURFACE_INICIAL: Surface = PARAMS.get('surface') === 'performance' ? 'performance' : 'portal';

export function App() {
  const [surface, setSurface] = useState<Surface>(SURFACE_INICIAL);
  const [portal, setPortal] = useState<PortalRoute>('inicio');

  const goPortalTab = (tab: PortalTab) => setPortal(tab);
  const showNav = surface === 'portal' && isPortalTab(portal);

  return (
    <DeviceFrame>
      <SurfaceSwitch surface={surface} onChange={setSurface} />

      <div className="fen-pt-scroll">
        {surface === 'portal' ? (
          <PortalSurface route={portal} go={setPortal} />
        ) : (
          <PerformanceSurface />
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
        className={`fen-pt-switch__btn${surface === 'performance' ? ' is-on' : ''}`}
        onClick={() => onChange('performance')}
      >
        Performance
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

// Aba Performance: relatório de tráfego do cliente (React nativo, no DS do cliente).
function PerformanceSurface() {
  const cliente = clienteBySlug(SLUG);
  const report = REPORTS[SLUG];
  const theme = themeBySlug(SLUG, cliente?.cor || '#B23A2E');

  if (!report) {
    return (
      <div style={{ padding: 24, color: '#6b5d4f', font: '500 14px/1.6 var(--fen-font, system-ui)' }}>
        <strong style={{ display: 'block', fontSize: 16, marginBottom: 8, color: '#2A211C' }}>
          Performance em breve
        </strong>
        {cliente?.status === 'setup'
          ? 'Cliente em fase de setup — o relatório aparece aqui assim que houver dados de campanha.'
          : 'Ainda não há relatório de performance publicado para este período.'}
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', inset: 0, top: 0 }}>
      <Relatorio data={report} theme={theme} />
    </div>
  );
}
