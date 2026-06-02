import { Avatar, Card, Tag } from '@fenice/shared';
import { Topbar, Search, Scroll } from '../components/Chrome';
import { PnIcon } from '../components/PnIcon';
import { PnButton } from '../components/PnButton';
import { CLIENTS, type Cliente } from '../data';

export interface ClientesProps {
  onCliente: (c: Cliente) => void;
}

export function Clientes({ onCliente }: ClientesProps) {
  const cols = '2.2fr 1fr 1fr 1fr 40px';
  return (
    <>
      <Topbar kicker="3 ativos · meta 15" title="Clientes">
        <Search ph="Buscar cliente…" />
        <PnButton variant="primary" pnIcon="plus">
          Adicionar
        </PnButton>
      </Topbar>
      <Scroll>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <span style={{ font: '600 12px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>
            clique num cliente para ver o tráfego ao vivo →
          </span>
        </div>
        <Card pad={0} style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: cols,
              gap: 12,
              padding: '14px 20px',
              borderBottom: '2px solid var(--fen-border)',
              font: '700 10px/1 var(--fen-font)',
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: 'var(--fen-muted)',
            }}
          >
            <span>Cliente</span>
            <span>Plano</span>
            <span>Status</span>
            <span>Posts/mês</span>
            <span />
          </div>
          {CLIENTS.map((c, i) => (
            <div
              key={c.nome}
              onClick={() => onCliente(c)}
              style={{
                display: 'grid',
                gridTemplateColumns: cols,
                gap: 12,
                padding: '14px 20px',
                borderBottom: i < CLIENTS.length - 1 ? '1px solid var(--fen-border)' : 'none',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar letter={c.letter} />
                <div>
                  <div style={{ font: '600 14px/1.2 var(--fen-font)' }}>{c.nome}</div>
                  <div style={{ font: '500 12px/1 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 3 }}>{c.seg}</div>
                </div>
                {c.pend > 0 && <Tag tone="terra">{c.pend} pend.</Tag>}
              </div>
              <span style={{ font: '500 13px/1 var(--fen-font)' }}>{c.plano}</span>
              <span>
                <span
                  className="fen-badge"
                  style={{ background: c.status[1], color: c.status[2] }}
                >
                  {c.status[0]}
                </span>
              </span>
              <span style={{ font: '600 14px/1 var(--fen-mono)' }}>{c.posts}</span>
              <div style={{ color: 'var(--fen-muted)' }}>
                <PnIcon name="chevR" size={18} />
              </div>
            </div>
          ))}
        </Card>
      </Scroll>
    </>
  );
}
