import { Card, CLIENTES_FENICE } from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';

// Reposições (renovação de budget) — Junho/2026. Fonte: serviço de tráfego (renovacao-mes).
// Estático por ora; será ligado a /api/renovacao quando o serviço estiver same-domain.
interface Reposicao {
  slug: string;
  campanha: string;
  budgetNovoMes: number | null;
  decisao: string;
  status: 'renovada' | 'manual' | 'pendente';
}
const JUNHO: Reposicao[] = [
  { slug: 'suprema', campanha: '[STARKEN][VENDAS][MAIO][01]', budgetNovoMes: 900, decisao: 'Subir +50% — ROAS forte', status: 'renovada' },
  { slug: 'suprema', campanha: '[STARKEN][VENDAS][FEV]', budgetNovoMes: 1400, decisao: 'Manter ritmo de maio', status: 'renovada' },
  { slug: 'arena', campanha: '(manual — conta bloqueada no MCP)', budgetNovoMes: null, decisao: 'Renovação manual no Gerenciador', status: 'manual' },
];

const brl = (n: number) => 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nome = (slug: string) => CLIENTES_FENICE.find((c) => c.slug === slug)?.nome ?? slug;
const cor = (slug: string) => CLIENTES_FENICE.find((c) => c.slug === slug)?.cor ?? '#9a8c7a';

const STATUS: Record<Reposicao['status'], [string, string, string]> = {
  renovada: ['Renovada', 'var(--fen-success-bg)', '#3c5232'],
  manual: ['Manual', 'rgba(154,140,122,.18)', '#6E5A48'],
  pendente: ['Pendente', 'var(--fen-warning-bg)', '#7a4520'],
};

function Kpi({ valor, label, cor }: { valor: string; label: string; cor?: string }) {
  return (
    <Card pad={16}>
      <div style={{ font: '700 26px/1 var(--fen-font)', color: cor ?? 'var(--fen-ink, #2A211C)' }}>{valor}</div>
      <div style={{ marginTop: 6, font: '600 11px/1.2 var(--fen-font)', letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--fen-muted)' }}>{label}</div>
    </Card>
  );
}

export function Reposicoes() {
  const totalReposto = JUNHO.reduce((s, r) => s + (r.budgetNovoMes || 0), 0);
  const renovadas = JUNHO.filter((r) => r.status === 'renovada').length;
  const manuais = JUNHO.filter((r) => r.status === 'manual').length;

  return (
    <>
      <Topbar kicker="Renovação de budget · Junho 2026" title="Reposições" />
      <Scroll>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          <Kpi valor={brl(totalReposto)} label="Reposto no mês" cor="#B23A2E" />
          <Kpi valor={String(renovadas)} label="Renovadas" cor="#3c5232" />
          <Kpi valor={String(manuais)} label="Manuais" />
        </div>

        <div style={{ marginTop: 22, font: '600 11px/1.2 var(--fen-font)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fen-muted)', marginBottom: 10 }}>
          Campanhas
        </div>
        <Card pad={0}>
          {JUNHO.map((r, i) => {
            const [label, bg, color] = STATUS[r.status];
            return (
              <div
                key={r.slug + r.campanha}
                style={{
                  display: 'grid', gridTemplateColumns: '1.2fr 1.6fr 0.8fr auto', gap: 10, alignItems: 'center',
                  padding: '12px 16px', borderTop: i === 0 ? 'none' : '1px solid rgba(154,140,122,.18)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span aria-hidden style={{ width: 9, height: 9, borderRadius: 99, background: cor(r.slug), flex: '0 0 auto' }} />
                  <strong style={{ font: '600 13px/1.2 var(--fen-font)' }}>{nome(r.slug)}</strong>
                </span>
                <span style={{ font: '500 12px/1.3 var(--fen-font)', color: 'var(--fen-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }} title={r.campanha}>
                  {r.campanha}
                </span>
                <span style={{ font: '600 13px/1 var(--fen-font)', textAlign: 'right' }}>
                  {r.budgetNovoMes != null ? brl(r.budgetNovoMes) : '—'}
                </span>
                <span className="fen-badge" style={{ background: bg, color, justifySelf: 'end' }}>{label}</span>
              </div>
            );
          })}
        </Card>
        <div style={{ marginTop: 12, font: '500 12px/1.5 var(--fen-font)', color: 'var(--fen-muted)' }}>
          Reposição = renovação do lifetime budget no início do mês (gasto histórico + budget do novo mês). Contas bloqueadas no MCP são renovadas manualmente no Gerenciador.
        </div>
      </Scroll>
    </>
  );
}
