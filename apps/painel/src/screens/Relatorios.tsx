import { Card, CLIENTES_FENICE, type ClienteFenice } from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';

function badge(bg: string, color: string, label: string) {
  return (
    <span className="fen-badge" style={{ background: bg, color }}>
      {label}
    </span>
  );
}

export interface RelatoriosProps {
  /** abre o relatório/dashboard embutido do cliente. */
  onOpen: (c: ClienteFenice) => void;
}

export function Relatorios({ onOpen }: RelatoriosProps) {
  const prontos = CLIENTES_FENICE.filter((c) => c.relatorioPronto).length;

  return (
    <>
      <Topbar kicker={`${prontos} de ${CLIENTES_FENICE.length} com relatório`} title="Relatórios" />
      <Scroll>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(248px, 1fr))',
            gap: 14,
          }}
        >
          {CLIENTES_FENICE.map((c) => {
            const pronto = c.relatorioPronto;
            return (
              <Card
                key={c.slug}
                onClick={pronto ? () => onOpen(c) : undefined}
                style={pronto ? { cursor: 'pointer' } : { opacity: 0.7 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span aria-hidden style={{ width: 9, height: 9, borderRadius: 99, flex: '0 0 auto', background: c.cor }} />
                  <strong style={{ font: '600 15px/1.2 var(--fen-font)' }}>{c.nome}</strong>
                </div>
                <div style={{ font: '500 12px/1.4 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 6 }}>
                  {c.seg}
                </div>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  {pronto
                    ? badge('var(--fen-success-bg)', '#3c5232', 'Publicado')
                    : badge('var(--fen-warning-bg)', '#7a4520', c.status === 'setup' ? 'Em setup' : 'Em preparação')}
                  <span style={{ font: '600 12px/1 var(--fen-font)', color: pronto ? c.cor : 'var(--fen-muted)' }}>
                    {pronto ? 'ver relatório →' : '—'}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </Scroll>
    </>
  );
}
