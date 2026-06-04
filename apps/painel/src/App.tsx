import { useEffect, useState } from 'react';
import { type ClienteFenice } from '@fenice/shared';
import { Sidebar, type NavKey } from './components/Sidebar';
import { Dashboard } from './screens/Dashboard';
import { Clientes } from './screens/Clientes';
import { Reposicoes } from './screens/Reposicoes';
import { Relatorios } from './screens/Relatorios';
import { Performance } from './screens/Performance';
import './styles.css';

const VIEWS: NavKey[] = ['clientes', 'dashboard', 'reposicoes', 'relatorios'];
const viewFromHash = (): NavKey => {
  const h = window.location.hash.replace(/^#/, '');
  return (VIEWS as string[]).includes(h) ? (h as NavKey) : 'dashboard';
};

const LS_COLLAPSED = 'fenice.sidebar.collapsed';
const MOBILE_BREAK = 880;
const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAK;

/** Painel da agência:
 *  - Operação → Clientes (cada card abre o PORTAL real do cliente embutido)
 *  - Tráfego Pago → Dashboard · Reposições · Relatórios (consolidado da empresa) */
export function App() {
  const [view, setView] = useState<NavKey>(viewFromHash);
  const [portalCliente, setPortalCliente] = useState<ClienteFenice | null>(null);

  // Sidebar — desktop usa `collapsed` (persistido); mobile usa `mobileOpen` (sessão).
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem(LS_COLLAPSED) === '1'; } catch { return false; }
  });
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    try { localStorage.setItem(LS_COLLAPSED, collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  const go = (key: NavKey) => {
    setPortalCliente(null);
    setView(key);
    setMobileOpen(false);
    window.location.hash = key;
  };

  const toggleSidebar = () => {
    if (isMobile()) setMobileOpen((v) => !v);
    else setCollapsed((v) => !v);
  };

  return (
    <div className="fen-pn-stage">
      <div className="fen-pn-frame">
        <Sidebar view={view} go={go} collapsed={collapsed} mobileOpen={mobileOpen} onToggle={toggleSidebar} />
        <div
          className={`fen-pn-backdrop${mobileOpen ? ' is-open' : ''}`}
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
        <div className="fen-pn-main">
          <button
            type="button"
            className="fen-pn-collapse-btn"
            onClick={toggleSidebar}
            aria-label={collapsed || !mobileOpen ? 'Abrir menu' : 'Recolher menu'}
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          {portalCliente ? (
            <Performance cliente={portalCliente} onBack={() => setPortalCliente(null)} />
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
