import { Card, Kicker, Badge } from '@fenice/shared';
import { PhoneHeader } from '../components/PhoneHeader';
import { StatPill } from '../components/StatPill';
import { ScreenIcon } from '../lib/ScreenIcon';

const BARS = [38, 52, 41, 67, 73, 60, 88];

export function Relatorios() {
  return (
    <div>
      <PhoneHeader kicker="Maio -> Junho" title="Relatorios" />
      <div className="fen-pt-body">
        <div className="fen-pt-row-gap">
          <StatPill valor="312" label="Seguidores" delta="+31%" />
          <StatPill valor="18,4k" label="Alcance" delta="+212%" />
        </div>

        <Card>
          <div className="fen-pt-card-head">
            <Kicker>Engajamento semanal</Kicker>
            <Badge tone="success">crescendo</Badge>
          </div>
          <div className="fen-pt-bars">
            {BARS.map((h, i) => (
              <div
                key={i}
                className={`fen-pt-bars__bar${i === BARS.length - 1 ? ' is-peak' : ''}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </Card>

        <Card className="fen-pt-ai">
          <div className="fen-pt-ai__ico">
            <ScreenIcon name="sparkles" size={18} />
          </div>
          <div>
            <div className="fen-pt-ai__title">Leitura da Fenice</div>
            <div className="fen-pt-ai__text">
              Video segue sendo seu melhor formato — 3x mais alcance que foto. Vamos dobrar a aposta em
              Reels.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
