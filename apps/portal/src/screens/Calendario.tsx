import { Card } from '@fenice/shared';
import { PhoneHeader } from '../components/PhoneHeader';
import { ScreenIcon } from '../lib/ScreenIcon';

type DotStatus = 'aprovado' | 'pendente' | 'postado' | 'rascunho';

const DOW = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const DOTS: Record<number, DotStatus> = {
  3: 'aprovado',
  6: 'postado',
  9: 'aprovado',
  11: 'pendente',
  13: 'aprovado',
  16: 'rascunho',
  18: 'aprovado',
  20: 'pendente',
  23: 'aprovado',
  27: 'aprovado',
};

const CMAP: Record<DotStatus, string> = {
  aprovado: 'var(--fen-success)',
  pendente: 'var(--fen-warning)',
  postado: 'var(--fen-caffe)',
  rascunho: 'var(--fen-neutral-300)',
};

const LEGEND: [string, DotStatus][] = [
  ['Aprovado', 'aprovado'],
  ['Pendente', 'pendente'],
  ['Postado', 'postado'],
  ['Rascunho', 'rascunho'],
];

export function Calendario() {
  // junho/2026 comeca numa segunda -> 1 celula vazia antes (domingo)
  const cells: (number | null)[] = [null];
  for (let d = 1; d <= 30; d++) cells.push(d);

  return (
    <div>
      <PhoneHeader kicker="Junho 2026" title="Calendario" />
      <div style={{ padding: 18 }}>
        <div className="fen-pt-legend">
          {LEGEND.map(([label, key]) => (
            <div key={key} className="fen-pt-legend__item">
              <span className="fen-pt-legend__dot" style={{ background: CMAP[key] }} />
              {label}
            </div>
          ))}
        </div>

        <Card pad={14}>
          <div className="fen-pt-cal__head">
            {DOW.map((d, i) => (
              <div key={i} className="fen-pt-cal__dow">
                {d}
              </div>
            ))}
          </div>
          <div className="fen-pt-cal__grid">
            {cells.map((d, i) => (
              <div key={i} className={`fen-pt-cal__cell${d === 11 ? ' is-today' : ''}`}>
                {d && <span className="fen-pt-cal__num">{d}</span>}
                {d && DOTS[d] && <span className="fen-pt-cal__dot" style={{ background: CMAP[DOTS[d]] }} />}
              </div>
            ))}
          </div>
        </Card>

        <div className="fen-pt-cal__foot">
          <ScreenIcon name="clock" size={15} /> 10 posts agendados este mes · cadencia Seg/Qua/Sex.
        </div>
      </div>
    </div>
  );
}
