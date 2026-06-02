import { useState } from 'react';
import { Sidebar, type NavKey } from './components/Sidebar';
import { ClienteLive } from './components/ClienteLive';
import { Dashboard } from './screens/Dashboard';
import { Clientes } from './screens/Clientes';
import { Triagem } from './screens/Triagem';
import { Aprovacoes } from './screens/Aprovacoes';
import { Calendario } from './screens/Calendario';
import { Trafego } from './screens/Trafego';
import type { Cliente } from './data';
import './styles.css';

export function App() {
  const [view, setView] = useState<NavKey>('dashboard');
  const [liveCli, setLiveCli] = useState<Cliente | null>(null);

  const go = (v: NavKey) => {
    setLiveCli(null);
    setView(v);
  };

  let main;
  if (liveCli) {
    main = <ClienteLive cliente={liveCli} voltar={() => setLiveCli(null)} />;
  } else {
    main = {
      dashboard: <Dashboard go={go} />,
      aprovacoes: <Aprovacoes />,
      clientes: <Clientes onCliente={(c) => setLiveCli(c)} />,
      triagem: <Triagem />,
      calendario: <Calendario />,
      trafego: <Trafego />,
    }[view];
  }

  return (
    <div className="fen-pn-stage">
      <div className="fen-pn-frame">
        <Sidebar view={liveCli ? 'clientes' : view} go={go} />
        <div className="fen-pn-main">{main}</div>
      </div>
    </div>
  );
}
