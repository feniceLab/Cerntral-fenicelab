import { useState } from 'react';
import { type ClienteFenice, clienteBySlug } from '@fenice/shared';
import { Sidebar, type NavKey } from './components/Sidebar';
import { Dashboard } from './screens/Dashboard';
import { Clientes } from './screens/Clientes';
import { Relatorios } from './screens/Relatorios';
import { RelatorioView } from './screens/RelatorioView';
import './styles.css';

const VIEWS: NavKey[] = ['dashboard', 'clientes', 'relatorios'];

interface Rota { view: NavKey; relatorio: ClienteFenice | null }
const rotaFromHash = (): Rota => {
  const h = window.location.hash.replace(/^#/, '');
  const [seg, slug] = h.split('/');
  const view = (VIEWS as string[]).includes(seg) ? (seg as NavKey) : 'dashboard';
  const relatorio = view === 'relatorios' && slug ? clienteBySlug(slug) ?? null : null;
  return { view, relatorio };
};

/** Painel da agência: Dashboard (visão geral), Clientes (cada um leva ao seu
 *  portal próprio) e Relatórios (relatório de performance React por cliente).
 *  Deep-link por hash: #clientes · #relatorios · #relatorios/<slug>. */
export function App() {
  const inicial = rotaFromHash();
  const [view, setView] = useState<NavKey>(inicial.view);
  const [relatorio, setRelatorio] = useState<ClienteFenice | null>(inicial.relatorio);

  const go = (key: NavKey) => {
    setRelatorio(null);
    setView(key);
    window.location.hash = key;
  };

  const abrirRelatorio = (c: ClienteFenice) => {
    setRelatorio(c);
    window.location.hash = `relatorios/${c.slug}`;
  };

  const voltarRelatorios = () => {
    setRelatorio(null);
    window.location.hash = 'relatorios';
  };

  return (
    <div className="fen-pn-stage">
      <div className="fen-pn-frame">
        <Sidebar view={view} go={go} />
        <div className="fen-pn-main">
          {view === 'relatorios' && relatorio ? (
            <RelatorioView cliente={relatorio} onBack={voltarRelatorios} />
          ) : view === 'relatorios' ? (
            <Relatorios onOpen={abrirRelatorio} />
          ) : view === 'clientes' ? (
            <Clientes />
          ) : (
            <Dashboard />
          )}
        </div>
      </div>
    </div>
  );
}
