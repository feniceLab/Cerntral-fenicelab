import { useEffect, useState } from 'react';
import { CLIENTES_FENICE, clienteBySlug, type ClienteFenice } from '@fenice/shared';
import { Sidebar, type NavKey } from './components/Sidebar';
import { Dashboard } from './screens/Dashboard';
import { Clientes } from './screens/Clientes';
import { Reposicoes } from './screens/Reposicoes';
import { Relatorios } from './screens/Relatorios';
import { Performance } from './screens/Performance';
import { AuditCentral } from './screens/AuditCentral';
import { AuthProvider } from './auth/AuthProvider';
import { useAuth } from './auth/useAuth';
import { LoginScreen } from './auth/LoginScreen';
import './styles.css';
import './auth/auth.css';

const VIEWS: NavKey[] = ['clientes', 'audit_central', 'dashboard', 'reposicoes', 'relatorios'];
const viewFromHash = (): NavKey => {
  const h = window.location.hash.replace(/^#/, '');
  return (VIEWS as string[]).includes(h) ? (h as NavKey) : 'dashboard';
};

const LS_COLLAPSED = 'fenice.sidebar.collapsed';
const MOBILE_BREAK = 880;
const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAK;

/** Painel da agência:
 *  - Operação → Clientes (cada card abre o PORTAL real do cliente embutido)
 *  - Tráfego Pago → Dashboard · Reposições · Relatórios (consolidado da empresa)
 *
 *  Auth + RBAC:
 *  - admin_fenice → vê tudo (sidebar + screens completas).
 *  - cliente      → vê só o próprio Performance (sem sidebar).
 */
export function App() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  );
}

function AppGate() {
  const { loading, session, role, clienteSlug } = useAuth();

  if (loading) {
    return (
      <div className="fen-auth-splash" aria-live="polite">
        Carregando…
      </div>
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  // Cliente vê só o próprio Performance.
  if (role === 'cliente') {
    return <ClienteShell clienteSlug={clienteSlug} />;
  }

  // Admin Fenice (ou role não mapeado mas autenticado → trata como admin).
  return <AdminShell />;
}

/** Cliente — sem sidebar, direto no Performance do próprio. */
function ClienteShell({ clienteSlug }: { clienteSlug: string | null }) {
  const { signOut, email, nomeExibicao } = useAuth();
  const cliente = clienteSlug ? clienteBySlug(clienteSlug) : undefined;

  if (!cliente) {
    return (
      <div className="fen-auth-stage">
        <div className="fen-auth-card">
          <h1 className="fen-auth-title">Conta sem cliente vinculado</h1>
          <p className="fen-auth-sub">
            {nomeExibicao || email}, sua conta não está vinculada a nenhum cliente Fenice.
            Fale com a equipe Fenice pra liberar acesso.
          </p>
          <button type="button" className="fen-auth-btn" onClick={() => signOut()}>
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fen-pn-stage">
      <div className="fen-pn-frame">
        <div className="fen-pn-main">
          <Performance cliente={cliente} onBack={() => signOut()} />
        </div>
      </div>
    </div>
  );
}

/** Admin Fenice — shell completo com sidebar. */
function AdminShell() {
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

  // Mantém referência pra evitar tree-shake de CLIENTES_FENICE no admin shell.
  void CLIENTES_FENICE;

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
          ) : view === 'audit_central' ? (
            <AuditCentral />
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
