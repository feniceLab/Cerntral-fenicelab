import type { ReactNode } from 'react';
import { Kicker } from '@fenice/shared';
import { PnIcon } from './PnIcon';

export type TrafegoTab = 'geral' | 'campanhas' | 'criar' | 'renovacao' | 'relatorios';

const TABS: [TrafegoTab, string][] = [
  ['geral', 'Visão geral'],
  ['campanhas', 'Campanhas'],
  ['criar', 'Criar campanha'],
  ['renovacao', 'Renovação'],
  ['relatorios', 'Relatórios'],
];

export interface SubnavProps {
  tab: TrafegoTab;
  setTab: (t: TrafegoTab) => void;
  right?: ReactNode;
}

// Topbar com sub-navegacao por abas (submodulo Trafego Pago).
export function Subnav({ tab, setTab, right }: SubnavProps) {
  return (
    <div className="fen-pn-subnav">
      <div className="fen-pn-subnav__head">
        <div className="fen-pn-subnav__brand">
          <div className="fen-pn-subnav__chip">
            <PnIcon name="target" size={22} />
          </div>
          <div>
            <div style={{ marginBottom: 4 }}>
              <Kicker>Meta Ads · tempo real</Kicker>
            </div>
            <div className="fen-pn-subnav__title">Tráfego Pago</div>
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
            <PnIcon name="refresh" size={14} /> atualizado há 3 min
          </span>
        </div>
      </div>
      <div className="fen-pn-subnav__tabs">
        {TABS.map(([k, l]) => (
          <button
            key={k}
            type="button"
            className={`fen-pn-tab${tab === k ? ' is-on' : ''}`}
            onClick={() => setTab(k)}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
