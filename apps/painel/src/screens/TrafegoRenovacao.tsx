import { Fragment } from 'react';
import { Avatar, Button, Card, Kicker } from '@fenice/shared';
import { Scroll } from '../components/Chrome';
import { PnIcon } from '../components/PnIcon';
import { brl0 } from '../data';

const PASSOS = ['Coleta', 'Análise', 'Decisão', 'Execução', 'Verificação'];

export function TrafegoRenovacao() {
  return (
    <Scroll>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar letter="S" size={32} />
          <span style={{ font: '700 16px/1 var(--fen-font)', color: 'var(--fen-caffe)' }}>Suprema · renovação de Julho</span>
        </div>
        <Button variant="primary" size="sm" icon="sparkles">
          Executar renovação
        </Button>
      </div>

      {/* stepper SOP */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {PASSOS.map((p, i) => (
            <Fragment key={p}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div
                  className="fen-pn-step-node"
                  style={{
                    width: 30,
                    height: 30,
                    background: i < 3 ? 'var(--fen-flame)' : 'var(--fen-surface-2)',
                    border: i < 3 ? 0 : '1.5px solid var(--fen-border)',
                    color: i < 3 ? '#fff' : 'var(--fen-muted)',
                    font: '700 13px/1 var(--fen-font)',
                  }}
                >
                  {i < 3 ? '✓' : i + 1}
                </div>
                <span style={{ font: `${i === 3 ? 700 : 500} 13px/1 var(--fen-font)`, color: i === 3 ? 'var(--fen-terra-d)' : 'var(--fen-text)' }}>
                  {p}
                </span>
              </div>
              {i < PASSOS.length - 1 && (
                <div className="fen-pn-step-line" style={{ background: i < 2 ? 'var(--fen-cotta)' : 'var(--fen-border)', margin: '0 14px' }} />
              )}
            </Fragment>
          ))}
        </div>
      </Card>

      {/* antes x depois */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 1fr', gap: 16, alignItems: 'center' }}>
        <Card style={{ background: 'var(--fen-surface-2)' }}>
          <Kicker style={{ color: 'var(--fen-muted)' }}>Antes · Junho</Kicker>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(
              [
                ['Gasto total histórico', brl0(2480)],
                ['Gasto no mês', brl0(900)],
                ['ROAS do mês', '4,8×'],
                ['lifetime_budget atual', brl0(2480)],
              ] as [string, string][]
            ).map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ font: '500 13px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>{l}</span>
                <span style={{ font: '700 17px/1 var(--fen-display)', color: 'var(--fen-caffe)' }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'grid', placeItems: 'center', color: 'var(--fen-cotta)' }}>
          <PnIcon name="arrowR" size={28} sw={2.2} />
        </div>

        <Card style={{ borderColor: 'var(--fen-terra)', boxShadow: 'var(--fen-sh-md)' }}>
          <Kicker>Depois · Julho</Kicker>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(
              [
                ['Budget pretendido', brl0(1200), false],
                ['Novo lifetime_budget', brl0(3680), true],
                ['Fim do conjunto', '31/jul', false],
                ['Stop da campanha', '31/jul', false],
              ] as [string, string, boolean][]
            ).map(([l, v, hot]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ font: '500 13px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>{l}</span>
                <span style={{ font: `700 ${hot ? 20 : 17}px/1 var(--fen-display)`, color: hot ? 'var(--fen-terra)' : 'var(--fen-caffe)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '10px 12px', background: 'var(--fen-terra-l)', borderRadius: 10, font: '500 11.5px/1.45 var(--fen-mono)', color: 'var(--fen-terra-d)' }}>
            novo = histórico (2.480) + pretendido (1.200) · ordem: conjunto→budget→stop
          </div>
        </Card>
      </div>
    </Scroll>
  );
}
