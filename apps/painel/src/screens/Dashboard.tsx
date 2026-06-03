import { Card, CLIENTES_FENICE } from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';

function Kpi({ valor, label, cor }: { valor: number | string; label: string; cor?: string }) {
  return (
    <Card pad={16}>
      <div style={{ font: '700 28px/1 var(--fen-font)', color: cor ?? 'var(--fen-ink, #2A211C)' }}>{valor}</div>
      <div style={{ marginTop: 6, font: '600 11px/1.2 var(--fen-font)', letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--fen-muted)' }}>
        {label}
      </div>
    </Card>
  );
}

export function Dashboard() {
  const total = CLIENTES_FENICE.length;
  const ativos = CLIENTES_FENICE.filter((c) => c.status === 'ativo').length;
  const comPortal = CLIENTES_FENICE.filter((c) => c.portalUrl).length;
  const comRelatorio = CLIENTES_FENICE.filter((c) => c.relatorioPronto).length;
  const emSetup = CLIENTES_FENICE.filter((c) => c.status === 'setup').length;

  return (
    <>
      <Topbar kicker="Visão geral · Fenice Lab" title="Dashboard" />
      <Scroll>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
          <Kpi valor={total} label="Clientes" />
          <Kpi valor={ativos} label="Ativos" cor="#3c5232" />
          <Kpi valor={comPortal} label="Com portal" cor="#B23A2E" />
          <Kpi valor={comRelatorio} label="Com relatório" />
          <Kpi valor={emSetup} label="Em setup" cor="#7a4520" />
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ font: '600 11px/1.2 var(--fen-font)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fen-muted)', marginBottom: 10 }}>
            Clientes
          </div>
          <Card pad={0}>
            {CLIENTES_FENICE.map((c, i) => (
              <div
                key={c.slug}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  borderTop: i === 0 ? 'none' : '1px solid rgba(154,140,122,.18)',
                }}
              >
                <span aria-hidden style={{ width: 10, height: 10, borderRadius: 99, background: c.cor, flex: '0 0 auto' }} />
                <strong style={{ font: '600 14px/1.2 var(--fen-font)', flex: 1, minWidth: 0 }}>{c.nome}</strong>
                <span style={{ font: '500 12px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>{c.seg}</span>
                <span
                  className="fen-badge"
                  style={
                    c.status === 'ativo'
                      ? { background: 'var(--fen-success-bg)', color: '#3c5232' }
                      : { background: 'var(--fen-warning-bg)', color: '#7a4520' }
                  }
                >
                  {c.status === 'ativo' ? 'Ativo' : c.statusLabel}
                </span>
              </div>
            ))}
          </Card>
          <div style={{ marginTop: 12, font: '500 12px/1.5 var(--fen-font)', color: 'var(--fen-muted)' }}>
            Métricas de tráfego ao vivo (gasto · ROAS · vendas) entram aqui na integração com o serviço de relatórios.
          </div>
        </div>
      </Scroll>
    </>
  );
}
