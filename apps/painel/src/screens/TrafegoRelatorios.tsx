import { Button, Card, Kicker, Tag } from '@fenice/shared';
import { Scroll } from '../components/Chrome';
import { FLOR } from '../assets';
import { brl0 } from '../data';

const GASTO = [22, 31, 28, 41, 38, 52, 47, 60, 55, 68, 62, 78];
const DIAS = ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23'];
const PERIODOS = ['Hoje', '7 dias', '30 dias', 'Mês'];

export function TrafegoRelatorios() {
  return (
    <Scroll>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {PERIODOS.map((p, i) => (
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
        <Button variant="outline" size="sm" icon="copy">
          Exportar PDF
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 16 }}>
        {(
          [
            ['Investimento', brl0(867), '+18%'],
            ['Vendas', brl0(4104), '+34%'],
            ['ROAS', '4,7×', '+0,5'],
            ['Compras', '74', '+22'],
          ] as [string, string, string][]
        ).map(([l, v, d]) => (
          <Card key={l} pad={16}>
            <div style={{ font: '600 12px/1 var(--fen-font)', color: 'var(--fen-muted)', marginBottom: 8 }}>{l}</div>
            <div style={{ fontFamily: 'var(--fen-display)', fontWeight: 900, fontSize: 28, color: 'var(--fen-terra)', lineHeight: 1 }}>{v}</div>
            <div style={{ font: '700 11px/1 var(--fen-font)', color: 'var(--fen-success)', marginTop: 8 }}>{d} vs mês anterior</div>
          </Card>
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
          <img src={FLOR} alt="" style={{ position: 'absolute', right: -40, bottom: -40, width: 150, opacity: 0.4 }} />
          <Kicker style={{ color: 'var(--fen-cotta)' }}>Leitura da Fenice</Kicker>
          <div style={{ fontFamily: 'var(--fen-display)', fontWeight: 900, fontSize: 40, margin: '14px 0 4px', lineHeight: 1 }}>4,7×</div>
          <div style={{ font: '400 14px/1.5 var(--fen-font)', color: '#d8cdbd', position: 'relative' }}>
            Cada R$ 1 investido virou R$ 4,70 em vendas. O Reel de pepperoni puxa 60% das compras — vale escalar.
          </div>
        </Card>
      </div>
    </Scroll>
  );
}
