import { Card } from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';
import { PERIODO, METRICS, carteira, plantao, type TPMetrics, type Nivel, type Decisao } from '../dashboard/data';

const brl = (n: number) => 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const brl0 = (n: number) => 'R$ ' + n.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

const DOT: Record<Nivel, string> = { verde: '#3c8a3c', amarelo: '#C8742B', vermelho: '#B23A2E' };
const DEC: Record<Decisao, [string, string, string]> = {
  SCALE: ['Escalar', 'var(--fen-success-bg)', '#3c5232'],
  HOLD: ['Manter', 'var(--fen-warning-bg)', '#7a4520'],
  KILL: ['Corrigir', 'rgba(178,58,46,.14)', '#B23A2E'],
};
const ESTADO_LABEL: Record<string, string> = {
  'sem-dados': 'Sem dados no período',
  'sem-conta': 'Sem conta de anúncios',
  setup: 'Em setup',
};

function Kpi({ valor, label, cor, hero }: { valor: string; label: string; cor?: string; hero?: boolean }) {
  return (
    <Card pad={16}>
      <div style={{ font: `700 ${hero ? 30 : 24}px/1 var(--fen-font)`, color: cor ?? 'var(--fen-ink, #2A211C)' }}>{valor}</div>
      <div style={{ marginTop: 6, font: '600 11px/1.2 var(--fen-font)', letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--fen-muted)' }}>{label}</div>
    </Card>
  );
}

function Plantao() {
  const acoes = plantao();
  return (
    <Card pad={0}>
      <div style={{ padding: '14px 16px 4px', font: '600 11px/1.2 var(--fen-font)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fen-muted)' }}>
        ☕ Plantão de hoje — onde agir
      </div>
      {acoes.length === 0 && (
        <div style={{ padding: '8px 16px 16px', color: 'var(--fen-muted)', font: '500 13px/1.5 var(--fen-font)' }}>Carteira estável — nenhuma ação urgente.</div>
      )}
      {acoes.map((a, i) => (
        <div key={a.slug + i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', borderTop: '1px solid rgba(154,140,122,.16)' }}>
          <span aria-hidden style={{ width: 10, height: 10, borderRadius: 99, background: DOT[a.nivel], flex: '0 0 auto', marginTop: 4 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: '600 13px/1.3 var(--fen-font)' }}>
              {a.nome} <span style={{ color: 'var(--fen-muted)', fontWeight: 500 }}>— {a.problema}</span>
            </div>
            <div style={{ marginTop: 2, font: '500 12px/1.4 var(--fen-font)', color: a.cor }}>{a.acao}</div>
          </div>
          <span style={{ font: '500 11px/1.3 var(--fen-font)', color: 'var(--fen-muted)', whiteSpace: 'nowrap' }}>{brl0(a.emJogo)} em jogo</span>
        </div>
      ))}
    </Card>
  );
}

function ClienteCard({ c }: { c: TPMetrics }) {
  if (c.estado !== 'ok') {
    return (
      <Card style={{ opacity: 0.75 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span aria-hidden style={{ width: 9, height: 9, borderRadius: 99, background: c.cor, flex: '0 0 auto' }} />
          <strong style={{ font: '600 15px/1.2 var(--fen-font)' }}>{c.nome}</strong>
        </div>
        <div style={{ marginTop: 10, font: '600 12px/1.3 var(--fen-font)', color: 'var(--fen-muted)' }}>{ESTADO_LABEL[c.estado]}</div>
        {c.obs && <div style={{ marginTop: 4, font: '500 11px/1.4 var(--fen-font)', color: 'var(--fen-muted)' }}>{c.obs}</div>}
      </Card>
    );
  }
  const [decLabel, decBg, decColor] = DEC[c.decisao];
  const lucroCor = c.lucroPosAds >= 0 ? '#3c8a3c' : '#B23A2E';
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span aria-hidden style={{ width: 9, height: 9, borderRadius: 99, background: DOT[c.semaforo], flex: '0 0 auto' }} />
          <strong style={{ font: '600 15px/1.2 var(--fen-font)' }}>{c.nome}</strong>
        </span>
        <span className="fen-badge" style={{ background: decBg, color: decColor }}>{decLabel}</span>
      </div>

      {/* HERÓI: lucro pós-ads */}
      <div style={{ marginTop: 12 }}>
        <div style={{ font: '500 10px/1 var(--fen-font)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fen-muted)', marginBottom: 4 }}>Lucro pós-ads · {PERIODO}</div>
        <div style={{ font: '800 26px/1 var(--fen-font)', color: lucroCor }}>{c.lucroPosAds >= 0 ? '+' : ''}{brl(c.lucroPosAds)}</div>
        <div style={{ marginTop: 4, font: '500 11px/1.4 var(--fen-font)', color: 'var(--fen-muted)' }}>
          ROAS {c.roas.toFixed(1)}× · margem {Math.round(c.margem * 100)}% · {brl0(c.investido)} investido
        </div>
      </div>

      {/* métricas de decisão */}
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <Mini label="Ticket" valor={brl0(c.ticket)} />
        <Mini label="CPA" valor={`${c.cpaPctTicket.toFixed(0)}% tkt`} />
        <Mini label="Freq" valor={c.frequencia.toFixed(2)} alerta={c.saturando} />
      </div>
      {c.saturando && (
        <div style={{ marginTop: 8, font: '500 11px/1.3 var(--fen-font)', color: '#7a4520' }}>⚠ Público saturando — renovar criativo.</div>
      )}
    </Card>
  );
}

function Mini({ label, valor, alerta }: { label: string; valor: string; alerta?: boolean }) {
  return (
    <div style={{ background: alerta ? 'var(--fen-warning-bg)' : 'rgba(154,140,122,.10)', borderRadius: 8, padding: '8px 10px' }}>
      <div style={{ font: '600 9px/1 var(--fen-font)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fen-muted)' }}>{label}</div>
      <div style={{ marginTop: 3, font: '700 13px/1 var(--fen-font)', color: alerta ? '#7a4520' : 'var(--fen-ink, #2A211C)' }}>{valor}</div>
    </div>
  );
}

export function Dashboard() {
  const ct = carteira();
  return (
    <>
      <Topbar kicker={`Operação · ${PERIODO}`} title="Dashboard" />
      <Scroll>
        <Plantao />

        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
          <Kpi valor={`+${brl0(ct.lucro)}`} label="Lucro pós-ads (carteira)" cor="#3c8a3c" hero />
          <Kpi valor={brl0(ct.fat)} label="Faturamento" />
          <Kpi valor={brl0(ct.inv)} label="Investido" />
          <Kpi valor={`${ct.roasPond.toFixed(1)}×`} label="ROAS ponderado" cor="#B23A2E" />
          <Kpi valor={`${ct.verdes}/${ct.comDados}`} label="Clientes saudáveis" />
        </div>

        <div style={{ marginTop: 22, font: '600 11px/1.2 var(--fen-font)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fen-muted)', marginBottom: 10 }}>
          Por cliente
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(248px, 1fr))', gap: 14 }}>
          {METRICS.map((c) => <ClienteCard key={c.slug} c={c} />)}
        </div>

        <div style={{ marginTop: 14, font: '500 12px/1.5 var(--fen-font)', color: 'var(--fen-muted)' }}>
          Snapshot fechado de {PERIODO}. Dados ao vivo (período selecionável) entram quando o serviço de tráfego ligar same-domain. Margens: input do dono.
        </div>
      </Scroll>
    </>
  );
}
