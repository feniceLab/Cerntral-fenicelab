import { useEffect, useState } from 'react';
import { Card } from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';
import { MES, fetchSaldosLive, buildSaldos, REPOSICOES, nomeCliente, corCliente, type Saldo, type NivelSaldo, type StatusReposicao } from '../reposicoes/data';

const brl = (n: number) => 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const brl0 = (n: number) => 'R$ ' + n.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

const SALDO_UI: Record<NivelSaldo, { dot: string; label: string; bg: string; fg: string }> = {
  critico: { dot: '#B23A2E', label: 'Repor', bg: 'rgba(178,58,46,.14)', fg: '#B23A2E' },
  baixo: { dot: '#C8742B', label: 'Atenção', bg: 'var(--fen-warning-bg)', fg: '#7a4520' },
  ok: { dot: '#3c8a3c', label: 'Disponível ok', bg: 'var(--fen-success-bg)', fg: '#3c5232' },
  cartao: { dot: '#3C6E8F', label: 'No cartão', bg: 'rgba(60,110,143,.14)', fg: '#3C6E8F' },
  sincronizar: { dot: '#9a8c7a', label: 'Sincronizar', bg: 'rgba(154,140,122,.18)', fg: '#6E5A48' },
};
const STATUS_UI: Record<StatusReposicao, [string, string, string]> = {
  renovada: ['Renovada', 'var(--fen-success-bg)', '#3c5232'],
  manual: ['Manual', 'rgba(154,140,122,.18)', '#6E5A48'],
  pendente: ['Pendente', 'var(--fen-warning-bg)', '#7a4520'],
};

function Kpi({ valor, label, cor }: { valor: string; label: string; cor?: string }) {
  return (
    <Card pad={16}>
      <div style={{ font: '700 24px/1 var(--fen-font)', color: cor ?? 'var(--fen-ink, #2A211C)' }}>{valor}</div>
      <div style={{ marginTop: 6, font: '600 11px/1.2 var(--fen-font)', letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--fen-muted)' }}>{label}</div>
    </Card>
  );
}

export function Reposicoes() {
  const [sds, setSds] = useState<Saldo[]>(() => buildSaldos([]));
  useEffect(() => {
    fetchSaldosLive()
      .then((live) => setSds(buildSaldos(live)))
      .catch(() => setSds(buildSaldos([])));
  }, []);
  const alertas = sds.filter((s) => s.nivel === 'critico' || s.nivel === 'baixo');
  const reps = REPOSICOES;
  const totalReposto = reps.reduce((s, r) => s + (r.budgetNovoMes || 0), 0);
  const renovadas = reps.filter((r) => r.status === 'renovada').length;

  return (
    <>
      <Topbar kicker={`Saldo & renovação de budget · ${MES}`} title="Reposições" />
      <Scroll>
        {/* ALERTA DE SALDO BAIXO */}
        {alertas.length > 0 && (
          <Card style={{ borderColor: 'rgba(178,58,46,.35)', background: 'rgba(178,58,46,.05)' }}>
            <div style={{ font: '700 13px/1.3 var(--fen-font)', color: '#B23A2E' }}>
              ⚠ {alertas.length} conta(s) com saldo baixo
            </div>
            <div style={{ marginTop: 4, font: '500 12px/1.4 var(--fen-font)', color: 'var(--fen-muted)' }}>
              {alertas.map((a) => `${a.nome} (${a.diasCobertura != null ? a.diasCobertura.toFixed(0) + 'd' : 'limite atingido'})`).join(' · ')} — repor antes de pausar veiculação.
            </div>
          </Card>
        )}

        {/* SALDO DAS CONTAS */}
        <div style={{ marginTop: alertas.length ? 16 : 0, font: '600 11px/1.2 var(--fen-font)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fen-muted)', marginBottom: 10 }}>
          Saldo das contas
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {sds.map((s) => {
            const ui = SALDO_UI[s.nivel];
            return (
              <Card key={s.slug}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <span aria-hidden style={{ width: 9, height: 9, borderRadius: 99, background: s.cor, flex: '0 0 auto' }} />
                    <strong style={{ font: '600 14px/1.2 var(--fen-font)' }}>{s.nome}</strong>
                  </span>
                  <span aria-hidden title={ui.label} style={{ width: 10, height: 10, borderRadius: 99, background: ui.dot }} />
                </div>
                <div style={{ marginTop: 10, font: '600 10px/1 var(--fen-font)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fen-muted)' }}>
                  {s.funding === 'cartao' ? 'A faturar no cartão' : 'Saldo disponível (pré-pago)'}
                </div>
                <div style={{ marginTop: 3, font: '700 22px/1 var(--fen-font)', color: s.nivel === 'critico' ? '#B23A2E' : 'var(--fen-ink, #2A211C)' }}>
                  {s.funding === 'cartao'
                    ? (s.noCartao != null ? brl(s.noCartao) : '—')
                    : (s.disponivel != null ? brl(s.disponivel) : '— sincronizar')}
                </div>
                <div style={{ marginTop: 6, font: '500 11px/1.4 var(--fen-font)', color: 'var(--fen-muted)' }}>
                  {s.funding === 'cartao'
                    ? (s.obs || 'Cobra no cartão.')
                    : s.diasCobertura != null
                      ? `~${s.diasCobertura.toFixed(0)} dias de cobertura · gasto ${brl0(s.gastoDiaMedio || 0)}/dia`
                      : (s.obs || 'Aguardando saldo do serviço.')}
                </div>
                <div style={{ marginTop: 10 }}>
                  <span className="fen-badge" style={{ background: ui.bg, color: ui.fg }}>{ui.label}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* RENOVAÇÃO DE BUDGET */}
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          <Kpi valor={brl(totalReposto)} label="Reposto no mês" cor="#B23A2E" />
          <Kpi valor={String(renovadas)} label="Renovadas" cor="#3c5232" />
          <Kpi valor={String(reps.length)} label="Campanhas" />
        </div>

        <div style={{ marginTop: 18, font: '600 11px/1.2 var(--fen-font)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fen-muted)', marginBottom: 10 }}>
          Renovação de budget
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reps.map((r, i) => {
            const [label, bg, color] = STATUS_UI[r.status];
            return (
              <Card key={r.slug + i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <span aria-hidden style={{ width: 9, height: 9, borderRadius: 99, background: corCliente(r.slug), flex: '0 0 auto' }} />
                    <strong style={{ font: '600 14px/1.2 var(--fen-font)' }}>{nomeCliente(r.slug)}</strong>
                    <span style={{ font: '500 12px/1.2 var(--fen-font)', color: 'var(--fen-muted)' }}>· {r.campanha}</span>
                  </span>
                  <span className="fen-badge" style={{ background: bg, color }}>{label}</span>
                </div>

                {r.novoLifetime != null ? (
                  <>
                    {/* math: histórico + novo mês = novo lifetime */}
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <Bloco label="Gasto histórico" valor={brl0(r.gastoHistorico || 0)} />
                      <span style={{ font: '700 16px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>+</span>
                      <Bloco label="Budget novo mês" valor={brl0(r.budgetNovoMes || 0)} destaque />
                      <span style={{ font: '700 16px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>=</span>
                      <Bloco label="Novo lifetime" valor={brl0(r.novoLifetime)} forte />
                    </div>
                    {r.decisao && <div style={{ marginTop: 10, font: '600 12px/1.3 var(--fen-font)', color: corCliente(r.slug) }}>{r.decisao}</div>}
                    {r.justificativa && <div style={{ marginTop: 4, font: '500 12px/1.5 var(--fen-font)', color: 'var(--fen-muted)' }}>{r.justificativa}</div>}
                  </>
                ) : (
                  <div style={{ marginTop: 10, font: '500 12px/1.4 var(--fen-font)', color: 'var(--fen-muted)' }}>{r.decisao}</div>
                )}
              </Card>
            );
          })}
        </div>

        <div style={{ marginTop: 14, font: '500 12px/1.5 var(--fen-font)', color: 'var(--fen-muted)' }}>
          Fórmula da reposição: <strong>novo lifetime = gasto histórico + budget do novo mês</strong> (senão o lifetime fica menor que o já gasto e a campanha não roda). Saldo vem do serviço de tráfego (Meta) — o MCP não expõe `balance`.
        </div>
      </Scroll>
    </>
  );
}

function Bloco({ label, valor, destaque, forte }: { label: string; valor: string; destaque?: boolean; forte?: boolean }) {
  return (
    <div style={{
      background: forte ? 'rgba(178,58,46,.10)' : destaque ? 'rgba(154,140,122,.14)' : 'rgba(154,140,122,.08)',
      border: forte ? '1px solid rgba(178,58,46,.3)' : '1px solid transparent',
      borderRadius: 10, padding: '8px 12px', minWidth: 110,
    }}>
      <div style={{ font: '600 9px/1 var(--fen-font)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fen-muted)' }}>{label}</div>
      <div style={{ marginTop: 3, font: `${forte ? 800 : 700} 16px/1 var(--fen-font)`, color: forte ? '#B23A2E' : 'var(--fen-ink, #2A211C)' }}>{valor}</div>
    </div>
  );
}
