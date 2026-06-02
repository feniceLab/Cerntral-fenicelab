import { useEffect, useState } from 'react';
import { Card, Kicker, Button } from '@fenice/shared';
import { PhoneHeader } from '../components/PhoneHeader';
import { HourBar } from '../components/HourBar';
import { StatusDot, PulseFlag } from '../components/LiveStatus';
import { ScreenIcon, type ScreenIconName } from '../lib/ScreenIcon';
import { florFenice } from '../lib/assets';
import type { TrafegoRoute } from '../navigation';

interface Campanha {
  nome: string;
  on: boolean;
  janela: [number, number][];
  texto: string;
  vendas: number;
}

const CAMPANHAS: Campanha[] = [
  { nome: 'Vendas Delivery', on: true, janela: [[11, 14], [18, 24]], texto: 'Ativa agora · almoco e jantar', vendas: 6 },
  { nome: 'Alcance · Novo Espaco', on: true, janela: [[0, 24]], texto: 'Ativa o dia todo', vendas: 0 },
  { nome: 'Mensagens · WhatsApp', on: false, janela: [], texto: 'Pausada', vendas: 0 },
];

type TLItem = [string, string, ScreenIconName];

const INITIAL_TL: TLItem[] = [
  ['18h41', 'Nova compra · R$ 58', 'cart'],
  ['18h12', 'Reativou para o jantar', 'play'],
  ['14h05', 'Pausou — fim do almoco', 'pause'],
  ['13h10', 'R$ 120 investidos · 4 compras', 'cart'],
];

interface TrafegoDashProps {
  go: (route: TrafegoRoute) => void;
}

export function TrafegoDash({ go }: TrafegoDashProps) {
  const [d, setD] = useState({ vendas: 312, gasto: 60.0, compras: 8 });
  const [timeline, setTimeline] = useState<TLItem[]>(INITIAL_TL);

  // simulacao "ao vivo": numeros sobem, feed cresce, ROAS ~5x
  useEffect(() => {
    const id = setInterval(() => {
      const dG = +(Math.random() * 1.2 + 0.3).toFixed(2);
      const dV = Math.round(dG * (4.3 + Math.random() * 1.6));
      const compra = Math.random() < 0.4;
      setD((p) => ({
        vendas: p.vendas + dV,
        gasto: +(p.gasto + dG).toFixed(2),
        compras: p.compras + (compra ? 1 : 0),
      }));
      const hh = 18 + Math.floor(Math.random() * 2);
      const mm = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      const ev: TLItem = compra
        ? [`${hh}h${mm}`, `Nova compra · R$ ${Math.floor(Math.random() * 45 + 28)}`, 'cart']
        : [`${hh}h${mm}`, `R$ ${dG.toFixed(2)} investidos · +${Math.floor(Math.random() * 90 + 30)} alcance`, 'dollar'];
      setTimeline((prev) => [ev, ...prev].slice(0, 6));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const roas = (d.vendas / d.gasto).toFixed(1).replace('.', ',');

  return (
    <div>
      <PhoneHeader kicker="Suprema · ao vivo" title="Trafego pago" />
      <div className="fen-pt-body">
        {/* hero ao vivo */}
        <div className="fen-pt-hero">
          <img src={florFenice} alt="" className="fen-pt-hero__flor" style={{ opacity: 0.45 }} />
          <PulseFlag label="2 campanhas no ar" />
          <div className="fen-pt-live-stats">
            <div>
              <div className="fen-pt-live-stats__num">
                <span key={d.vendas} className="fen-pt-flash">{`R$ ${d.vendas.toLocaleString('pt-BR')}`}</span>
              </div>
              <div className="fen-pt-live-stats__cap">vendas hoje</div>
            </div>
            <div>
              <div className="fen-pt-live-stats__num">
                <span key={d.gasto.toFixed(0)} className="fen-pt-flash">{`R$ ${d.gasto.toFixed(0)}`}</span>
              </div>
              <div className="fen-pt-live-stats__cap">investido</div>
            </div>
            <div>
              <div className="fen-pt-live-stats__num fen-pt-live-stats__num--accent">
                <span key={roas} className="fen-pt-flash">{`${roas}x`}</span>
              </div>
              <div className="fen-pt-live-stats__cap">ROAS</div>
            </div>
          </div>
        </div>

        {/* campanhas no ar */}
        <div>
          <Kicker>Campanhas</Kicker>
          <div className="fen-pt-col-gap" style={{ marginTop: 10 }}>
            {CAMPANHAS.map((c, i) => (
              <Card key={i} pad={14} onClick={() => go('detalhe')} style={{ cursor: 'pointer' }}>
                <div className="fen-pt-camp__head">
                  <span className="fen-pt-camp__name">{c.nome}</span>
                  <StatusDot on={c.on} />
                </div>
                {c.on && (
                  <div style={{ marginTop: 12 }}>
                    <HourBar janela={c.janela} />
                  </div>
                )}
                <div className="fen-pt-camp__foot">
                  <span className="fen-pt-camp__meta">{c.texto}</span>
                  {c.on && (
                    <span className="fen-pt-camp__kpi">{c.vendas > 0 ? `${c.vendas} vendas` : 'alcance'}</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* timeline */}
        <div>
          <Kicker>O que aconteceu hoje</Kicker>
          <div className="fen-pt-timeline">
            {timeline.map(([t, txt, ic], i) => {
              const live = i === 0;
              const last = i === timeline.length - 1;
              return (
                <div
                  key={`${t}${txt}${i}`}
                  className={`fen-pt-tl${live ? ' is-live fen-pt-rise' : ''}`}
                  style={{ paddingBottom: last ? 0 : 16 }}
                >
                  {!last && <div className="fen-pt-tl__line" />}
                  <div className="fen-pt-tl__node">
                    <ScreenIcon name={ic} size={15} sw={2} />
                  </div>
                  <div className="fen-pt-tl__body">
                    <div className="fen-pt-tl__time">{t}</div>
                    <div className="fen-pt-tl__txt">{txt}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Button variant="soft" style={{ width: '100%' }} onClick={() => go('relatorio')}>
          <ScreenIcon name="file" size={17} sw={2} />
          Ver relatorio do mes
        </Button>
      </div>
    </div>
  );
}
