// ============================================================
// Portal · Dashboard tempo real (hero ao vivo, campanhas c/ dayparting,
// timeline "o que aconteceu hoje"). Anima via setInterval.
// ============================================================
import { useEffect, useState } from 'react';
import { Card, Kicker, Button } from '@fenice/shared';
import { TpIcon, type TpIconName } from '../../lib/icons';
import { StatusDot, LiveNum, HourBar } from '../../components/primitives';
import { FENICE_FLOR } from '../../lib/data';
import { PortalHeader } from './PortalHeader';
import type { PortalView } from '../../lib/nav';

type Campanha = {
  nome: string;
  on: boolean;
  janela: [number, number][];
  texto: string;
  gasto: number;
  vendas: number;
};
const CAMPANHAS: Campanha[] = [
  { nome: 'Vendas Delivery', on: true, janela: [[11, 14], [18, 24]], texto: 'Ativa agora · almoco e jantar', gasto: 28.4, vendas: 6 },
  { nome: 'Alcance · Novo Espaco', on: true, janela: [[0, 24]], texto: 'Ativa o dia todo', gasto: 14.4, vendas: 0 },
  { nome: 'Mensagens · WhatsApp', on: false, janela: [], texto: 'Pausada', gasto: 0, vendas: 0 },
];

type Tl = [string, string, TpIconName];

export function Dash({ go }: { go: (v: PortalView) => void }) {
  const [d, setD] = useState({ vendas: 312, gasto: 60.0, compras: 8 });
  const [timeline, setTimeline] = useState<Tl[]>([
    ['18h41', 'Nova compra · R$ 58', 'cart'],
    ['18h12', 'Reativou para o jantar', 'play'],
    ['14h05', 'Pausou — fim do almoco', 'pause'],
    ['13h10', 'R$ 120 investidos · 4 compras', 'cart'],
  ]);

  useEffect(() => {
    const id = setInterval(() => {
      const dG = +(Math.random() * 1.2 + 0.3).toFixed(2);
      const dV = Math.round(dG * (4.3 + Math.random() * 1.6));
      const compra = Math.random() < 0.4;
      setD((p) => ({ vendas: p.vendas + dV, gasto: +(p.gasto + dG).toFixed(2), compras: p.compras + (compra ? 1 : 0) }));
      const hh = 18 + Math.floor(Math.random() * 2);
      const mm = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      const ev: Tl = compra
        ? [`${hh}h${mm}`, `Nova compra · R$ ${Math.floor(Math.random() * 45 + 28)}`, 'cart']
        : [`${hh}h${mm}`, `R$ ${dG.toFixed(2)} investidos · +${Math.floor(Math.random() * 90 + 30)} alcance`, 'dollar'];
      setTimeline((prev) => [ev, ...prev].slice(0, 6));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const roas = (d.vendas / d.gasto).toFixed(1).replace('.', ',');

  return (
    <div>
      <PortalHeader kicker="Suprema · ao vivo" title="Trafego pago" />
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* hero ao vivo */}
        <div style={{ background: 'var(--fen-caffe)', borderRadius: 'var(--fen-r-lg)', padding: 18, color: 'var(--fen-avorio)', position: 'relative', overflow: 'hidden' }}>
          <img src={FENICE_FLOR} alt="" style={{ position: 'absolute', right: -40, top: -30, width: 150, opacity: 0.45 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, position: 'relative' }}>
            <span style={{ position: 'relative', width: 9, height: 9 }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: 999, background: '#7FD17F' }} />
              <span style={{ position: 'absolute', inset: -4, borderRadius: 999, border: '2px solid #7FD17F', opacity: 0.4, animation: 'fen-tp-ping 1.6s ease-out infinite' }} />
            </span>
            <span style={{ font: '700 11px/1 var(--fen-font)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--fen-cotta)' }}>
              2 campanhas no ar
            </span>
          </div>
          <div style={{ display: 'flex', gap: 22, marginTop: 16, position: 'relative' }}>
            <div>
              <div style={{ font: '900 26px/1 var(--fen-display)', whiteSpace: 'nowrap' }}>
                <LiveNum k={d.vendas}>{'R$ ' + d.vendas.toLocaleString('pt-BR')}</LiveNum>
              </div>
              <div style={{ font: '500 11px/1 var(--fen-font)', color: '#d8cdbd', marginTop: 5 }}>vendas hoje</div>
            </div>
            <div>
              <div style={{ font: '900 26px/1 var(--fen-display)', whiteSpace: 'nowrap' }}>
                <LiveNum k={d.gasto.toFixed(0)}>{'R$ ' + d.gasto.toFixed(0)}</LiveNum>
              </div>
              <div style={{ font: '500 11px/1 var(--fen-font)', color: '#d8cdbd', marginTop: 5 }}>investido</div>
            </div>
            <div>
              <div style={{ font: '900 26px/1 var(--fen-display)', color: 'var(--fen-cotta)', whiteSpace: 'nowrap' }}>
                <LiveNum k={roas}>{roas}×</LiveNum>
              </div>
              <div style={{ font: '500 11px/1 var(--fen-font)', color: '#d8cdbd', marginTop: 5 }}>ROAS</div>
            </div>
          </div>
        </div>

        {/* campanhas no ar */}
        <div>
          <Kicker>Campanhas</Kicker>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            {CAMPANHAS.map((c) => (
              <Card key={c.nome} onClick={() => go('detalhe')} pad={14} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ font: '700 15px/1.2 var(--fen-font)', color: 'var(--fen-caffe)' }}>{c.nome}</span>
                  <StatusDot on={c.on} />
                </div>
                {c.on && (
                  <div style={{ marginTop: 12 }}>
                    <HourBar janela={c.janela} agora={19} />
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <span style={{ font: '500 12px/1.3 var(--fen-font)', color: 'var(--fen-muted)' }}>{c.texto}</span>
                  {c.on && (
                    <span style={{ font: '700 12px/1 var(--fen-font)', color: 'var(--fen-terra-d)' }}>
                      {c.vendas > 0 ? c.vendas + ' vendas' : 'alcance'}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* timeline */}
        <div>
          <Kicker>O que aconteceu hoje</Kicker>
          <div style={{ marginTop: 12, position: 'relative', paddingLeft: 8 }}>
            {timeline.map(([t, txt, ic], i) => {
              const live = i === 0;
              return (
                <div
                  key={t + txt + i}
                  style={{
                    display: 'flex',
                    gap: 13,
                    paddingBottom: i < timeline.length - 1 ? 16 : 0,
                    position: 'relative',
                    animation: live ? 'fen-tp-rise .5s ease-out' : 'none',
                  }}
                >
                  {i < timeline.length - 1 && (
                    <div style={{ position: 'absolute', left: 13, top: 28, bottom: 0, width: 2, background: 'var(--fen-border)' }} />
                  )}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: live ? 'var(--fen-flame)' : 'var(--fen-terra-l)',
                      display: 'grid',
                      placeItems: 'center',
                      color: live ? '#fff' : 'var(--fen-terra-d)',
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  >
                    <TpIcon name={ic} size={15} sw={2} />
                  </div>
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <div style={{ font: '700 12px/1 var(--fen-mono)', color: live ? 'var(--fen-terra)' : 'var(--fen-muted)' }}>{t}</div>
                    <div style={{ font: '500 13px/1.4 var(--fen-font)', color: 'var(--fen-text)', marginTop: 3 }}>{txt}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Button variant="soft" style={{ width: '100%' }} onClick={() => go('relatorio')}>
          <TpIcon name="file" size={16} sw={2} />
          Ver relatorio do mes
        </Button>
      </div>
    </div>
  );
}
