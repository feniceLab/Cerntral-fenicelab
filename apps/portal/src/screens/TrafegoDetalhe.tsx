import { Card, Kicker, Badge } from '@fenice/shared';
import { PhoneHeader } from '../components/PhoneHeader';
import { HourBar } from '../components/HourBar';
import { StatusDot } from '../components/LiveStatus';
import { Sparkline } from '../components/Sparkline';
import { ScreenIcon, type ScreenIconName } from '../lib/ScreenIcon';
import type { TrafegoRoute } from '../navigation';

const METRICS: [string, string, ScreenIconName][] = [
  ['Investido', 'R$ 318', 'dollar'],
  ['Vendas', 'R$ 1.656', 'cart'],
  ['Compras', '41', 'check'],
  ['Alcance', '9.240', 'eye'],
];

interface TrafegoDetalheProps {
  go: (route: TrafegoRoute) => void;
}

export function TrafegoDetalhe({ go }: TrafegoDetalheProps) {
  return (
    <div>
      <PhoneHeader kicker="Campanha · Vendas" title="Vendas Delivery" onBack={() => go('dash')} />
      <div className="fen-pt-body">
        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ font: '600 12px/1 var(--fen-font)', color: 'var(--fen-muted)', marginBottom: 6 }}>
              Status agora
            </div>
            <StatusDot on label="No ar · jantar" />
          </div>
          <Badge tone="success">Objetivo: Vendas</Badge>
        </Card>

        <Card pad={14}>
          <div style={{ font: '600 12px/1 var(--fen-font)', color: 'var(--fen-muted)', marginBottom: 10 }}>
            Horarios de hoje · ativo das 11–14h e 18–24h
          </div>
          <HourBar janela={[[11, 14], [18, 24]]} />
          <div className="fen-pt-hourbar__scale">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>
          </div>
        </Card>

        <div className="fen-pt-metric-grid">
          {METRICS.map(([label, value, ic], i) => (
            <Card key={i} pad={14}>
              <div className="fen-pt-metric__head">
                <ScreenIcon name={ic} size={15} />
                <span className="fen-pt-metric__label">{label}</span>
              </div>
              <div className="fen-pt-metric__value">{value}</div>
            </Card>
          ))}
        </div>

        <Card>
          <div className="fen-pt-card-head">
            <Kicker>Vendas · ultimos 7 dias</Kicker>
            <Badge tone="success">5,2x ROAS</Badge>
          </div>
          <Sparkline data={[120, 180, 150, 240, 210, 320, 312]} w={320} h={70} />
        </Card>

        <Card className="fen-pt-insight">
          <div className="fen-pt-insight__ico">
            <ScreenIcon name="trend" size={17} color="#fff" />
          </div>
          <div className="fen-pt-insight__text">
            Cada R$ 1 virou R$ 5,20 em pedidos. O Reel da pepperoni e o que mais converte.
          </div>
        </Card>
      </div>
    </div>
  );
}
