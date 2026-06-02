// ============================================================
// Portal · Detalhe de campanha (status + janela de horario, KPIs,
// sparkline de vendas, leitura). Read-only.
// ============================================================
import { Card, Kicker, Tag } from '@fenice/shared';
import { TpIcon, type TpIconName } from '../../lib/icons';
import { StatusDot, Spark, HourBar } from '../../components/primitives';
import { PortalHeader } from './PortalHeader';
import type { PortalView } from '../../lib/nav';

const KPIS: [string, string, TpIconName][] = [
  ['Investido', 'R$ 318', 'dollar'],
  ['Vendas', 'R$ 1.656', 'cart'],
  ['Compras', '41', 'check'],
  ['Alcance', '9.240', 'eye'],
];

export function Detalhe({ go }: { go: (v: PortalView) => void }) {
  return (
    <div>
      <PortalHeader kicker="Campanha · Vendas" title="Vendas Delivery" onBack={() => go('dash')} />
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ font: '600 12px/1 var(--fen-font)', color: 'var(--fen-muted)', marginBottom: 6 }}>Status agora</div>
            <StatusDot on label="No ar · jantar" />
          </div>
          <Tag tone="success">Objetivo: Vendas</Tag>
        </Card>

        <Card pad={14}>
          <div style={{ font: '600 12px/1 var(--fen-font)', color: 'var(--fen-muted)', marginBottom: 10 }}>
            Horarios de hoje · ativo das 11–14h e 18–24h
          </div>
          <HourBar janela={[[11, 14], [18, 24]]} agora={19} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              font: '500 9px/1 var(--fen-mono)',
              color: 'var(--fen-muted)',
              marginTop: 6,
            }}
          >
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {KPIS.map(([l, v, ic]) => (
            <Card key={l} pad={14}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--fen-muted)', marginBottom: 8 }}>
                <TpIcon name={ic} size={15} />
                <span style={{ font: '600 11px/1 var(--fen-font)' }}>{l}</span>
              </div>
              <div style={{ font: '900 24px/1 var(--fen-display)', color: 'var(--fen-terra)' }}>{v}</div>
            </Card>
          ))}
        </div>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <Kicker>Vendas · ultimos 7 dias</Kicker>
            <Tag tone="success">5,2× ROAS</Tag>
          </div>
          <Spark data={[120, 180, 150, 240, 210, 320, 312]} w={320} h={70} />
        </Card>

        <Card dark style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--fen-flame)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <TpIcon name="trend" size={17} color="#fff" />
          </div>
          <div style={{ font: '400 14px/1.5 var(--fen-font)', color: 'var(--fen-avorio)' }}>
            Cada R$ 1 virou R$ 5,20 em pedidos. O Reel da pepperoni e o que mais converte.
          </div>
        </Card>
      </div>
    </div>
  );
}
