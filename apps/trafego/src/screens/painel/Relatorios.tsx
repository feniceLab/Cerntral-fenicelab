// ============================================================
// Painel · Relatorios & metricas (periodo, KPIs com delta, grafico,
// "Leitura da Fenice").
// ============================================================
import { Card, StatCard, Kicker, Button, Tag } from '@fenice/shared';
import { TpIcon } from '../../lib/icons';
import { brl0, FENICE_FLOR } from '../../lib/data';

const GASTO = [22, 31, 28, 41, 38, 52, 47, 60, 55, 68, 62, 78];
const DIAS = ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23'];

const KPIS: { label: string; value: string; delta: number; deltaLabel: string }[] = [
  { label: 'Investimento', value: brl0(867), delta: 18, deltaLabel: 'vs mes anterior' },
  { label: 'Vendas', value: brl0(4104), delta: 34, deltaLabel: 'vs mes anterior' },
  { label: 'ROAS', value: '4,7×', delta: 11, deltaLabel: '+0,5 vs mes anterior' },
  { label: 'Compras', value: '74', delta: 22, deltaLabel: '+22 vs mes anterior' },
];

export function Relatorios() {
  return (
    <div className="fen-tp-scroll">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Hoje', '7 dias', '30 dias', 'Mes'].map((p, i) => (
            <span
              key={p}
              style={{
                font: '600 13px/1 var(--fen-font)',
                padding: '9px 14px',
                borderRadius: 999,
                cursor: 'pointer',
                background: i === 2 ? 'var(--fen-terra)' : 'var(--fen-surface)',
                color: i === 2 ? '#fff' : 'var(--fen-text)',
                border: '1px solid ' + (i === 2 ? 'var(--fen-terra)' : 'var(--fen-border)'),
              }}
            >
              {p}
            </span>
          ))}
        </div>
        <Button variant="outline" size="sm">
          <TpIcon name="download" size={15} sw={2} />
          Exportar PDF
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 16 }}>
        {KPIS.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} delta={k.delta} deltaLabel={k.deltaLabel} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Kicker>Investimento × dia</Kicker>
            <Tag tone="success">↑ crescendo</Tag>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 150 }}>
            {GASTO.map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: '100%',
                    height: `${h * 1.7}px`,
                    background: i === GASTO.length - 1 ? 'var(--fen-flame)' : 'var(--fen-terra-l)',
                    borderRadius: '5px 5px 0 0',
                  }}
                />
                <span style={{ font: '500 9px/1 var(--fen-mono)', color: 'var(--fen-muted)' }}>{DIAS[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card dark style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={FENICE_FLOR} alt="" style={{ position: 'absolute', right: -40, bottom: -40, width: 150, opacity: 0.4 }} />
          <Kicker style={{ color: 'var(--fen-cotta)' }}>Leitura da Fenice</Kicker>
          <div style={{ fontFamily: 'var(--fen-display)', fontWeight: 900, fontSize: 40, margin: '14px 0 4px', lineHeight: 1, color: 'var(--fen-avorio)' }}>
            4,7×
          </div>
          <div style={{ font: '400 14px/1.5 var(--fen-font)', color: '#d8cdbd', position: 'relative' }}>
            Cada R$ 1 investido virou R$ 4,70 em vendas. O Reel de pepperoni puxa 60% das compras — vale escalar.
          </div>
        </Card>
      </div>
    </div>
  );
}
