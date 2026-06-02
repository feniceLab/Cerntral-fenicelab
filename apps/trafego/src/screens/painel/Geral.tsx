// ============================================================
// Painel · Visao geral (KPIs cross-client + card por cliente).
// ============================================================
import { Card, Kicker, Avatar } from '@fenice/shared';
import { TpIcon, type TpIconName } from '../../lib/icons';
import { Spark } from '../../components/primitives';
import { CLIENTES, brl, brl0, type Cliente, type AlertaTipo } from '../../lib/data';

const ALERTA_MAP: Record<Exclude<AlertaTipo, null>, [string, string, string]> = {
  pacing: ['Pacing baixo', 'var(--fen-warning-bg)', '#7a4520'],
  setup: ['Em setup', 'var(--fen-surface-2)', 'var(--fen-muted)'],
  budget: ['Budget 95%', 'var(--fen-danger-bg)', 'var(--fen-terra-d)'],
};

export function Geral({ openLive }: { openLive: (c: Cliente) => void }) {
  const totGasto = CLIENTES.reduce((s, c) => s + c.gasto, 0);
  const totVendas = CLIENTES.reduce((s, c) => s + c.vendas, 0);
  const totAtivas = CLIENTES.reduce((s, c) => s + c.ativas, 0);
  const kpis: [string, string, TpIconName][] = [
    ['Gasto hoje', brl(totGasto), 'dollar'],
    ['Vendas atribuidas', brl0(totVendas), 'cart'],
    ['ROAS medio', '4,6×', 'trend'],
    ['Campanhas ativas', totAtivas + ' de 8', 'activity'],
  ];

  return (
    <div className="fen-tp-scroll">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {kpis.map(([l, v, ic]) => (
          <Card key={l} pad={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fen-muted)', marginBottom: 10 }}>
              <TpIcon name={ic} size={16} />
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
        <span style={{ font: '600 12px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>
          clique para ver ao vivo →
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
        {CLIENTES.map((c) => (
          <Card
            key={c.nome}
            onClick={() => openLive(c)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', cursor: 'pointer' }}
          >
            {c.alerta && (
              <div style={{ position: 'absolute', top: 14, right: 14 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    font: '700 11px/1 var(--fen-font)',
                    borderRadius: 999,
                    padding: '4px 10px',
                    background: ALERTA_MAP[c.alerta][1],
                    color: ALERTA_MAP[c.alerta][2],
                  }}
                >
                  {ALERTA_MAP[c.alerta][0]}
                </span>
              </div>
            )}
            <Avatar letter={c.letter} size={44} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ font: '700 15px/1.2 var(--fen-font)', color: 'var(--fen-caffe)', whiteSpace: 'nowrap' }}>
                {c.nome}
              </span>
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
    </div>
  );
}
