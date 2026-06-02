// ============================================================
// Topbar do Painel com sub-navegacao por abas (Trafego Pago).
// ============================================================
import type { ReactNode } from 'react';
import { Kicker } from '@fenice/shared';
import { TpIcon } from '../lib/icons';
import type { PainelTab } from '../lib/nav';

const TABS: [PainelTab, string][] = [
  ['geral', 'Visao geral'],
  ['campanhas', 'Campanhas'],
  ['criar', 'Criar campanha'],
  ['renovacao', 'Renovacao'],
  ['relatorios', 'Relatorios'],
];

export function Topbar({
  tab,
  setTab,
  right,
}: {
  tab: PainelTab;
  setTab: (t: PainelTab) => void;
  right?: ReactNode;
}) {
  return (
    <div
      style={{
        borderBottom: '1px solid var(--fen-border)',
        background: 'var(--fen-avorio)',
        position: 'sticky',
        top: 0,
        zIndex: 3,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 28px 12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: 'var(--fen-terra-l)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--fen-terra-d)',
            }}
          >
            <TpIcon name="target" size={22} />
          </div>
          <div>
            <div style={{ marginBottom: 4 }}>
              <Kicker>Meta Ads · tempo real</Kicker>
            </div>
            <div
              style={{
                fontFamily: 'var(--fen-display)',
                fontWeight: 900,
                fontSize: 24,
                letterSpacing: '-.015em',
                color: 'var(--fen-caffe)',
                lineHeight: 1,
              }}
            >
              Trafego Pago
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {right}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              font: '600 12px/1 var(--fen-font)',
              color: 'var(--fen-muted)',
            }}
          >
            <TpIcon name="refresh" size={14} /> atualizado ha 3 min
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, padding: '0 28px' }}>
        {TABS.map(([k, l]) => {
          const on = tab === k;
          return (
            <div
              key={k}
              onClick={() => setTab(k)}
              style={{
                padding: '10px 14px',
                font: `${on ? 700 : 500} 13px/1 var(--fen-font)`,
                color: on ? 'var(--fen-terra-d)' : 'var(--fen-muted)',
                borderBottom: '2px solid ' + (on ? 'var(--fen-terra)' : 'transparent'),
                marginBottom: -1,
                cursor: 'pointer',
              }}
            >
              {l}
            </div>
          );
        })}
      </div>
    </div>
  );
}
