import { useState } from 'react';
import { Subnav, type TrafegoTab } from '../components/Subnav';
import { ClienteLive } from '../components/ClienteLive';
import { TrafegoGeral } from './TrafegoGeral';
import { TrafegoCampanhas } from './TrafegoCampanhas';
import { TrafegoCriar } from './TrafegoCriar';
import { TrafegoRenovacao } from './TrafegoRenovacao';
import { TrafegoRelatorios } from './TrafegoRelatorios';
import { TP_CLIENTES, type TPCliente } from '../data';

// Submodulo Tráfego Pago: subnav por abas + dashboard ao vivo por cliente.
export function Trafego() {
  const [tab, setTab] = useState<TrafegoTab>('geral');
  const [cli, setCli] = useState<TPCliente>(TP_CLIENTES[0]);
  const [live, setLive] = useState(false);

  const openLive = (c: TPCliente) => {
    setCli(c);
    setLive(true);
  };

  if (live) {
    return <ClienteLive cliente={cli} voltar={() => setLive(false)} />;
  }

  const view = {
    geral: <TrafegoGeral openLive={openLive} />,
    campanhas: <TrafegoCampanhas go={setTab} />,
    criar: <TrafegoCriar go={setTab} />,
    renovacao: <TrafegoRenovacao />,
    relatorios: <TrafegoRelatorios />,
  }[tab];

  return (
    <>
      <Subnav tab={tab} setTab={setTab} />
      {view}
    </>
  );
}
