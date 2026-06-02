import { Card } from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';
import { CALENDAR_EVENTS, CLIENT_COLOR, CLIENT_SHORT } from '../data';

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function Calendario() {
  const cells: (number | null)[] = [];
  for (let d = 1; d <= 30; d++) cells.push(d);

  return (
    <>
      <Topbar kicker="Junho 2026 · todos os clientes" title="Calendário geral">
        <div style={{ display: 'flex', gap: 14 }}>
          {Object.entries(CLIENT_COLOR).map(([k, c]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, font: '500 12px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: c }} />
              {CLIENT_SHORT[k]}
            </div>
          ))}
        </div>
      </Topbar>
      <Scroll>
        <Card pad={16}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginBottom: 8 }}>
            {DAYS.map((d) => (
              <div key={d} style={{ font: '700 10px/1 var(--fen-font)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fen-muted)' }}>
                {d}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
            {cells.map((d, i) => (
              <div
                key={i}
                style={{
                  minHeight: 78,
                  borderRadius: 10,
                  border: '1px solid var(--fen-border)',
                  background: d === 11 ? 'var(--fen-terra-l)' : 'var(--fen-surface-2)',
                  padding: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                }}
              >
                {d && <span style={{ font: '600 12px/1 var(--fen-font)', color: 'var(--fen-text)' }}>{d}</span>}
                {d &&
                  CALENDAR_EVENTS[d]?.map((cKey, j) => (
                    <div
                      key={j}
                      style={{
                        font: '600 10px/1 var(--fen-font)',
                        color: '#fff',
                        background: CLIENT_COLOR[cKey],
                        borderRadius: 5,
                        padding: '3px 5px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {CLIENT_SHORT[cKey]}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </Card>
      </Scroll>
    </>
  );
}
