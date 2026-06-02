import { Avatar, Card, Kicker } from '@fenice/shared';
import { Scroll } from '../components/Chrome';
import { PnIcon, type PnIconName } from '../components/PnIcon';
import { Spark } from '../components/LiveBits';
import { TP_CLIENTES, brl, brl0, type TPCliente } from '../data';

const ALERTA_MAP: Record<string, [string, string, string]> = {
  pacing: ['Pacing baixo', 'var(--fen-warning-bg)', '#7a4520'],
  setup: ['Em setup', 'var(--fen-surface-2)', 'var(--fen-muted)'],
  budget: ['Budget 95%', 'var(--fen-danger-bg)', 'var(--fen-terra-d)'],
};

export interface TrafegoGeralProps {
  openLive: (c: TPCliente) => void;
}

export function TrafegoGeral({ openLive }: TrafegoGeralProps) {
  const totGasto = TP_CLIENTES.reduce((s, c) => s + c.gasto, 0);
  const totVendas = TP_CLIENTES.reduce((s, c) => s + c.vendas, 0);
  const totAtivas = TP_CLIENTES.reduce((s, c) => s + c.ativas, 0);
  const kpis: [string, string, PnIconName][] = [
    ['Gasto hoje', brl(totGasto), 'dollar'],
    ['Vendas atribuídas', brl0(totVendas), 'cart'],
    ['ROAS médio', '4,6×', 'trend'],
    ['Campanhas ativas', totAtivas + ' de 8', 'activity'],
  ];

  return (
    <Scroll>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {kpis.map(([l, v, ic]) => (
          <Card key={l} pad={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fen-muted)', marginBottom: 10 }}>
              <PnIcon name={ic} size={16} />
              <span style={{ font: '600 12px/1 var(--fen-font)' }}>{l}</span>
            </div>
            <div style={{ fontFamily: 'var(--fen-display)', fontWeight: 900, fontSize: 30, color: 'var(--fen-terra)', lineHeight: 1 }}>
              {v}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Kicker>Por cliente</Kicker>
        <span style={{ font: '600 12px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>clique para ver ao vivo →</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
        {TP_CLIENTES.map((c) => (
          <Card
            key={c.nome}
            onClick={() => openLive(c)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}
          >
            {c.alerta && (
              <div style={{ position: 'absolute', top: 14, right: 14 }}>
                <span className="fen-badge" style={{ background: ALERTA_MAP[c.alerta][1], color: ALERTA_MAP[c.alerta][2] }}>
                  {ALERTA_MAP[c.alerta][0]}
                </span>
              </div>
            )}
            <Avatar letter={c.letter} size={44} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ font: '700 15px/1.2 var(--fen-font)', color: 'var(--fen-caffe)', whiteSpace: 'nowrap' }}>{c.nome}</span>
              <div style={{ display: 'flex', gap: 18, marginTop: 12 }}>
                <div>
                  <div style={{ font: '700 18px/1 var(--fen-display)', color: 'var(--fen-caffe)' }}>{brl0(c.gasto)}</div>
                  <div style={{ font: '500 11px/1 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 3 }}>gasto</div>
                </div>
                <div>
                  <div style={{ font: '700 18px/1 var(--fen-display)', color: c.roas ? 'var(--fen-success)' : 'var(--fen-muted)' }}>
                    {c.roas ? c.roas.toFixed(1) + '×' : '—'}
                  </div>
                  <div style={{ font: '500 11px/1 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 3 }}>ROAS</div>
                </div>
                <div>
                  <div style={{ font: '700 18px/1 var(--fen-display)', color: 'var(--fen-caffe)' }}>
                    {c.ativas}/{c.total}
                  </div>
                  <div style={{ font: '500 11px/1 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 3 }}>ativas</div>
                </div>
              </div>
            </div>
            <Spark data={c.tend} color={c.roas ? 'var(--fen-terra)' : 'var(--fen-neutral-300)'} w={68} h={42} />
          </Card>
        ))}
      </div>
    </Scroll>
  );
}
