import { Card, Kicker, Button } from '@fenice/shared';
import { PhoneHeader } from '../components/PhoneHeader';
import { ScreenIcon } from '../lib/ScreenIcon';
import type { TrafegoRoute } from '../navigation';

const METRICS: [string, string, string][] = [
  ['Investido', 'R$ 867', '+18%'],
  ['Vendas', 'R$ 4.104', '+34%'],
  ['Compras', '74', '+22'],
  ['Alcance', '38,2 mil', '+2,1x'],
];

const WEEKS = [44, 58, 52, 70];

interface TrafegoRelatorioProps {
  go: (route: TrafegoRoute) => void;
}

export function TrafegoRelatorio({ go }: TrafegoRelatorioProps) {
  return (
    <div>
      <PhoneHeader kicker="Junho 2026" title="Relatorio" onBack={() => go('dash')} />
      <div className="fen-pt-body">
        {/* ROAS do mes */}
        <div className="fen-pt-roas">
          <div className="fen-pt-roas__kicker">Retorno do mes</div>
          <div className="fen-pt-roas__big">4,7x</div>
          <div className="fen-pt-roas__sub">Cada R$ 1 investido virou R$ 4,70 em vendas</div>
        </div>

        <div className="fen-pt-metric-grid">
          {METRICS.map(([label, value, delta], i) => (
            <Card key={i} pad={14}>
              <div className="fen-pt-report-metric__label">{label}</div>
              <div className="fen-pt-report-metric__value">{value}</div>
              <div className="fen-pt-report-metric__delta">{delta} vs maio</div>
            </Card>
          ))}
        </div>

        <Card>
          <Kicker>Investimento x semana</Kicker>
          <div className="fen-pt-wbars">
            {WEEKS.map((h, i) => (
              <div key={i} className="fen-pt-wbar">
                <div
                  className={`fen-pt-wbar__col${i === WEEKS.length - 1 ? ' is-peak' : ''}`}
                  style={{ height: `${h * 0.95}px` }}
                />
                <span className="fen-pt-wbar__label">S{i + 1}</span>
              </div>
            ))}
          </div>
        </Card>

        <Button variant="primary" style={{ width: '100%' }} onClick={() => go('dash')}>
          <ScreenIcon name="download" size={17} sw={2} color="var(--fen-avorio)" />
          Baixar relatorio (PDF)
        </Button>
      </div>
    </div>
  );
}
