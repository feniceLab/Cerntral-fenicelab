// ============================================================
// Superficie PAINEL (agencia, desktop). Navegacao por estado.
// ============================================================
import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { Geral } from './painel/Geral';
import { Campanhas } from './painel/Campanhas';
import { Criar } from './painel/Criar';
import { Renovacao } from './painel/Renovacao';
import { Relatorios } from './painel/Relatorios';
import { Live } from './painel/Live';
import { CLIENTES, type Cliente } from '../lib/data';
import type { PainelTab } from '../lib/nav';

export function PainelApp() {
  const [tab, setTab] = useState<PainelTab>('geral');
  const [cli, setCli] = useState<Cliente>(CLIENTES[0]);

  const go = (t: PainelTab) => setTab(t);
  const openLive = (c: Cliente) => {
    setCli(c);
    setTab('live');
  };

  const view = {
    geral: <Geral openLive={openLive} />,
    campanhas: <Campanhas go={go} />,
    criar: <Criar go={go} />,
    renovacao: <Renovacao />,
    relatorios: <Relatorios />,
    live: <Live cliente={cli} voltar={() => setTab('geral')} />,
  }[tab];

  return (
    <div className="fen-tp-window">
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar tab={tab === 'live' ? 'geral' : tab} setTab={setTab} />
        {view}
      </div>
    </div>
  );
}
