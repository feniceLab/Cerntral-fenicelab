import { Card, CLIENTES_FENICE } from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';

// Consolidado da AGÊNCIA (Maio/2026) — visão da empresa, não de cliente.
// Os relatórios detalhados de cada cliente ficam no portal do cliente (aba Performance).
interface LinhaCliente { slug: string; faturamento: number | null; investido: number | null; compras: number | null }
const MAIO: Record<string, LinhaCliente> = {
  suprema: { slug: 'suprema', faturamento: 39789.72, investido: 2350.84, compras: 324 },
  arena: { slug: 'arena', faturamento: 7851.59, investido: 1137.10, compras: 84 },
  oca: { slug: 'oca', faturamento: null, investido: null, compras: null },
  cotafacil: { slug: 'cotafacil', faturamento: null, investido: null, compras: null },
  imperio: { slug: 'imperio', faturamento: null, investido: null, compras: null },
};

const brl = (n: number) => 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const brl0 = (n: number) => 'R$ ' + n.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

function Kpi({ valor, label, cor }: { valor: string; label: string; cor?: string }) {
  return (
    <Card pad={16}>
      <div style={{ font: '700 26px/1 var(--fen-font)', color: cor ?? 'var(--fen-ink, #2A211C)' }}>{valor}</div>
      <div style={{ marginTop: 6, font: '600 11px/1.2 var(--fen-font)', letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--fen-muted)' }}>
        {label}
      </div>
    </Card>
  );
}

export function Relatorios() {
  const linhas = Object.values(MAIO);
  const comDados = linhas.filter((l) => l.faturamento != null);
  const fatTotal = comDados.reduce((s, l) => s + (l.faturamento || 0), 0);
  const invTotal = comDados.reduce((s, l) => s + (l.investido || 0), 0);
  const comprasTotal = comDados.reduce((s, l) => s + (l.compras || 0), 0);
  const roas = invTotal ? fatTotal / invTotal : 0;
  const nome = (slug: string) => CLIENTES_FENICE.find((c) => c.slug === slug)?.nome ?? slug;
  const cor = (slug: string) => CLIENTES_FENICE.find((c) => c.slug === slug)?.cor ?? '#9a8c7a';

  return (
    <>
      <Topbar kicker="Consolidado da agência · Maio 2026" title="Relatórios da Empresa" />
      <Scroll>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          <Kpi valor={brl0(fatTotal)} label="Faturamento rastreado" cor="#3c5232" />
          <Kpi valor={brl0(invTotal)} label="Investimento" />
          <Kpi valor={`${roas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}×`} label="ROAS médio" cor="#B23A2E" />
          <Kpi valor={String(comprasTotal)} label="Vendas" />
        </div>

        <div style={{ marginTop: 22, font: '600 11px/1.2 var(--fen-font)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fen-muted)', marginBottom: 10 }}>
          Por cliente
        </div>
        <Card pad={0}>
          {linhas.map((l, i) => (
            <div
              key={l.slug}
              style={{
                display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 0.8fr', gap: 10, alignItems: 'center',
                padding: '12px 16px', borderTop: i === 0 ? 'none' : '1px solid rgba(154,140,122,.18)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span aria-hidden style={{ width: 9, height: 9, borderRadius: 99, background: cor(l.slug), flex: '0 0 auto' }} />
                <strong style={{ font: '600 13px/1.2 var(--fen-font)' }}>{nome(l.slug)}</strong>
              </span>
              <span style={{ font: '600 13px/1 var(--fen-font)', textAlign: 'right', color: l.faturamento != null ? '#3c5232' : 'var(--fen-muted)' }}>
                {l.faturamento != null ? brl(l.faturamento) : '—'}
              </span>
              <span style={{ font: '500 12px/1 var(--fen-font)', textAlign: 'right', color: 'var(--fen-muted)' }}>
                {l.investido != null ? brl(l.investido) : '—'}
              </span>
              <span style={{ font: '600 13px/1 var(--fen-font)', textAlign: 'right' }}>
                {l.faturamento != null && l.investido ? (l.faturamento / l.investido).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '×' : '—'}
              </span>
            </div>
          ))}
        </Card>
        <div style={{ marginTop: 12, font: '500 12px/1.5 var(--fen-font)', color: 'var(--fen-muted)' }}>
          O relatório detalhado de cada cliente (funil, campanhas, criativos) fica no <strong>portal do cliente → aba Performance</strong>.
        </div>
      </Scroll>
    </>
  );
}
