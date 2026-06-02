// ============================================================
// Portal · Relatorio do mes (retorno ROAS, KPIs vs mes anterior,
// grafico semanal, exportar PDF). Read-only.
// ============================================================
import { Card, Kicker, Button } from '@fenice/shared';
import { TpIcon } from '../../lib/icons';
import { PortalHeader } from './PortalHeader';
import type { PortalView } from '../../lib/nav';

const KPIS: [string, string, string][] = [
  ['Investido', 'R$ 867', '+18%'],
  ['Vendas', 'R$ 4.104', '+34%'],
  ['Compras', '74', '+22'],
  ['Alcance', '38,2 mil', '+2,1×'],
];

export function Relatorio({ go }: { go: (v: PortalView) => void }) {
  return (
    <div>
      <PortalHeader kicker="Junho 2026" title="Relatorio" onBack={() => go('dash')} />
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'var(--fen-flame)', borderRadius: 'var(--fen-r-lg)', padding: 20, color: '#fff', textAlign: 'center' }}>
          <div style={{ font: '700 11px/1 var(--fen-font)', letterSpacing: '.14em', textTransform: 'uppercase', opacity: 0.85 }}>
            Retorno do mes
          </div>
          <div style={{ font: '900 52px/1 var(--fen-display)', margin: '10px 0 2px' }}>4,7×</div>
          <div style={{ font: '500 14px/1.4 var(--fen-font)', opacity: 0.9 }}>
            Cada R$ 1 investido virou R$ 4,70 em vendas
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {KPIS.map(([l, v, delta]) => (
            <Card key={l} pad={14}>
              <div style={{ font: '600 11px/1 var(--fen-font)', color: 'var(--fen-muted)', marginBottom: 7 }}>{l}</div>
              <div style={{ font: '900 22px/1 var(--fen-display)', color: 'var(--fen-caffe)' }}>{v}</div>
              <div style={{ font: '700 11px/1 var(--fen-font)', color: 'var(--fen-success)', marginTop: 6 }}>{delta} vs maio</div>
            </Card>
          ))}
        </div>

        <Card>
          <Kicker>Investimento × semana</Kicker>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 90, marginTop: 14 }}>
            {[44, 58, 52, 70].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: '100%',
                    height: `${h * 0.95}px`,
                    background: i === 3 ? 'var(--fen-flame)' : 'var(--fen-terra-l)',
                    borderRadius: '6px 6px 0 0',
                  }}
                />
                <span style={{ font: '500 10px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>S{i + 1}</span>
              </div>
            ))}
          </div>
        </Card>

        <Button variant="primary" style={{ width: '100%' }} onClick={() => go('dash')}>
          <TpIcon name="download" size={16} sw={2} />
          Baixar relatorio (PDF)
        </Button>
      </div>
    </div>
  );
}
