import { useState } from 'react';
import { type ClienteFenice } from '@fenice/shared';
import { Sidebar, type NavKey } from './components/Sidebar';
import { Dashboard } from './screens/Dashboard';
import { Clientes } from './screens/Clientes';
import { Reposicoes } from './screens/Reposicoes';
import { Relatorios } from './screens/Relatorios';
import { PortalEmbed } from './screens/PortalEmbed';
import './styles.css';

const VIEWS: NavKey[] = ['clientes', 'dashboard', 'reposicoes', 'relatorios'];
const viewFromHash = (): NavKey => {
  const h = window.location.hash.replace(/^#/, '');
  return (VIEWS as string[]).includes(h) ? (h as NavKey) : 'dashboard';
};

/** Painel da agência:
 *  - Operação → Clientes (cada card abre o PORTAL real do cliente embutido)
 *  - Tráfego Pago → Dashboard · Reposições · Relatórios (consolidado da empresa) */
export function App() {
  const [view, setView] = useState<NavKey>(viewFromHash);
  const [portalCliente, setPortalCliente] = useState<ClienteFenice | null>(null);

  const go = (key: NavKey) => {
    setPortalCliente(null);
    setView(key);
    window.location.hash = key;
  };

  return (
    <div className="fen-pn-stage">
      <div className="fen-pn-frame">
        <Sidebar view={view} go={go} />
        <div className="fen-pn-main">
          {portalCliente ? (
            <PortalEmbed cliente={portalCliente} onBack={() => setPortalCliente(null)} />
          ) : view === 'clientes' ? (
            <Clientes onOpen={setPortalCliente} />
          ) : view === 'reposicoes' ? (
            <Reposicoes />
          ) : view === 'relatorios' ? (
            <Relatorios />
          ) : (
            <Dashboard />
          )}
        </div>
      </div>
    </div>
  );
}
