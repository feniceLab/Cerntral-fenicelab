import { Card, Kicker, Tag } from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';
import { PnButton } from '../components/PnButton';
import { FLOR, photo } from '../assets';
import { QUEUE } from '../data';
import type { NavKey } from '../components/Sidebar';

const KPIS: [string, string, string | null][] = [
  ['3', 'clientes ativos', null],
  ['6', 'aprovações pendentes', '2 vencendo hoje'],
  ['29', 'posts no mês', '+12 vs mês anterior'],
  ['96%', 'aprovados sem atrito', '+8pp'],
];

export interface DashboardProps {
  go: (key: NavKey) => void;
}

export function Dashboard({ go }: DashboardProps) {
  return (
    <>
      <Topbar kicker="Bom dia, Dante" title="Dashboard geral">
        <PnButton variant="primary" pnIcon="plus">
          Novo post
        </PnButton>
      </Topbar>
      <Scroll>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
          {KPIS.map(([v, l, d]) => (
            <Card key={l} pad={16}>
              <div style={{ fontFamily: 'var(--fen-display)', fontWeight: 900, fontSize: 32, color: 'var(--fen-terra)', lineHeight: 1 }}>
                {v}
              </div>
              <div style={{ font: '500 12px/1.3 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 6 }}>{l}</div>
              {d && <div style={{ font: '700 11px/1 var(--fen-font)', color: 'var(--fen-success)', marginTop: 8 }}>{d}</div>}
            </Card>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <Kicker>Fila de aprovações</Kicker>
              <span
                onClick={() => go('aprovacoes')}
                style={{ font: '600 12px/1 var(--fen-font)', color: 'var(--fen-terra-d)', cursor: 'pointer' }}
              >
                Abrir fila →
              </span>
            </div>
            {QUEUE.map((q, i) => (
              <div
                key={q.cliente + q.quando}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 0',
                  borderBottom: i < QUEUE.length - 1 ? '1px solid var(--fen-border)' : 'none',
                }}
              >
                <img src={photo(q.img)} alt="" style={{ width: 42, height: 42, borderRadius: 9, objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: '600 13px/1.2 var(--fen-font)' }}>{q.cliente}</div>
                  <div style={{ font: '500 12px/1 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 3 }}>
                    {q.formato} · {q.quando}
                  </div>
                </div>
                <Tag tone="warning">{q.tempo}</Tag>
              </div>
            ))}
          </Card>

          <Card dark style={{ position: 'relative', overflow: 'hidden' }}>
            <img src={FLOR} alt="" style={{ position: 'absolute', right: -50, bottom: -50, width: 180, opacity: 0.45 }} />
            <Kicker style={{ color: 'var(--fen-cotta)' }}>Meta do trimestre</Kicker>
            <div style={{ fontFamily: 'var(--fen-display)', fontWeight: 900, fontSize: 40, margin: '12px 0 2px', lineHeight: 1 }}>
              3 / 15
            </div>
            <div style={{ font: '400 13px/1.5 var(--fen-font)', color: '#d8cdbd', maxWidth: 200 }}>
              clientes ativos. Faltam 12 para a meta de 6 meses.
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,.14)', borderRadius: 20, marginTop: 16, overflow: 'hidden' }}>
              <div style={{ width: '20%', height: '100%', background: 'var(--fen-flame)' }} />
            </div>
          </Card>
        </div>
      </Scroll>
    </>
  );
}
