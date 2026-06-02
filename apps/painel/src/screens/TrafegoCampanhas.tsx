import { useState, type ReactNode } from 'react';
import { Avatar, Card, Tag } from '@fenice/shared';
import { Scroll } from '../components/Chrome';
import { PnIcon } from '../components/PnIcon';
import { PnButton } from '../components/PnButton';
import { StatusDot, ToggleDot } from '../components/LiveBits';
import { photo } from '../assets';
import { TP_CAMPANHAS, brl0 } from '../data';
import type { TrafegoTab } from '../components/Subnav';

const OBJ_COLOR: Record<string, [string, string]> = {
  Vendas: ['var(--fen-success-bg)', '#3c5232'],
  Alcance: ['var(--fen-terra-l)', 'var(--fen-terra-d)'],
  Mensagens: ['var(--fen-warning-bg)', '#7a4520'],
};

function Cell({ children, w, b, c }: { children?: ReactNode; w: number; b?: boolean; c?: string }) {
  return (
    <div className="fen-pn-cell" style={{ width: w, font: `${b ? 700 : 500} 13px/1.2 var(--fen-font)`, color: c ?? 'var(--fen-text)' }}>
      {children}
    </div>
  );
}

export interface TrafegoCampanhasProps {
  go: (t: TrafegoTab) => void;
}

export function TrafegoCampanhas({ go }: TrafegoCampanhasProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({ c1: true, s1: true });
  const tog = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  return (
    <Scroll>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar letter="S" size={32} />
          <span style={{ font: '700 16px/1 var(--fen-font)', color: 'var(--fen-caffe)' }}>Suprema Pizza</span>
          <span className="fen-badge" style={{ background: 'var(--fen-surface)', color: 'var(--fen-muted)', border: '1px solid var(--fen-border)' }}>
            conta act_4920…
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <PnButton variant="ghost" size="sm" pnIcon="filter">
            Filtrar
          </PnButton>
          <PnButton variant="primary" size="sm" pnIcon="plus" onClick={() => go('criar')}>
            Criar campanha
          </PnButton>
        </div>
      </div>

      <Card pad={0} style={{ overflow: 'hidden' }}>
        {/* header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 18px',
            borderBottom: '2px solid var(--fen-border)',
            font: '700 10px/1 var(--fen-font)',
            letterSpacing: '.06em',
            textTransform: 'uppercase',
            color: 'var(--fen-muted)',
          }}
        >
          <span style={{ width: 26, flexShrink: 0 }} />
          <span style={{ flex: 1 }}>Campanha / conjunto / anúncio</span>
          <Cell w={78}>Status</Cell>
          <Cell w={70}>Orçam.</Cell>
          <Cell w={80}>Gasto</Cell>
          <Cell w={80}>Result.</Cell>
          <Cell w={56}>ROAS</Cell>
          <span style={{ width: 24 }} />
        </div>

        {TP_CAMPANHAS.map((camp) => (
          <div key={camp.id}>
            {/* CAMPANHA */}
            <div className="fen-pn-row" style={{ padding: '13px 18px', background: 'var(--fen-surface-2)' }}>
              <button type="button" className="fen-pn-row__caret" onClick={() => tog(camp.id)} aria-label="Expandir">
                <PnIcon name={open[camp.id] ? 'chevD' : 'chevR'} size={18} />
              </button>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <PnIcon name="megaphone" size={17} color="var(--fen-terra-d)" />
                <span style={{ font: '700 14px/1.2 var(--fen-font)', color: 'var(--fen-caffe)' }}>{camp.nome}</span>
                <span className="fen-badge" style={{ background: OBJ_COLOR[camp.objetivo][0], color: OBJ_COLOR[camp.objetivo][1] }}>
                  {camp.objetivo}
                </span>
              </div>
              <div style={{ width: 78, flexShrink: 0 }}>
                <StatusDot on={camp.status} />
              </div>
              <Cell w={70} c="var(--fen-muted)">{camp.budget}</Cell>
              <Cell w={80} b>{brl0(camp.gasto)}</Cell>
              <Cell w={80}>{camp.resultados.toLocaleString('pt-BR')}</Cell>
              <Cell w={56} b c={camp.roas ? 'var(--fen-success)' : 'var(--fen-muted)'}>
                {camp.roas ? camp.roas.toFixed(1) + '×' : '—'}
              </Cell>
              <span style={{ width: 24, color: 'var(--fen-muted)', cursor: 'pointer' }}>
                <PnIcon name="more" size={18} />
              </span>
            </div>

            {/* CONJUNTOS */}
            {open[camp.id] &&
              camp.conjuntos.map((cj) => (
                <div key={cj.id}>
                  <div className="fen-pn-row" style={{ padding: '11px 18px 11px 30px' }}>
                    <button type="button" className="fen-pn-row__caret" onClick={() => tog(cj.id)} aria-label="Expandir">
                      <PnIcon name={open[cj.id] ? 'chevD' : 'chevR'} size={16} />
                    </button>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                      <PnIcon name="layers" size={15} color="var(--fen-cotta-d)" />
                      <span style={{ font: '600 13px/1.2 var(--fen-font)', color: 'var(--fen-text)' }}>{cj.nome}</span>
                    </div>
                    <div style={{ width: 78, flexShrink: 0 }}>
                      <StatusDot on={cj.status} />
                    </div>
                    <Cell w={70} c="var(--fen-muted)">{cj.budget}</Cell>
                    <Cell w={80}>{brl0(cj.gasto)}</Cell>
                    <Cell w={80}>{cj.resultados.toLocaleString('pt-BR')}</Cell>
                    <Cell w={56} c={cj.roas ? 'var(--fen-success)' : 'var(--fen-muted)'}>
                      {cj.roas ? cj.roas.toFixed(1) + '×' : '—'}
                    </Cell>
                    <span style={{ width: 24 }} />
                  </div>

                  {/* ANUNCIOS */}
                  {open[cj.id] &&
                    cj.anuncios.map((ad) => (
                      <div key={ad.id} className="fen-pn-row" style={{ padding: '9px 18px 9px 56px' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                          <img src={photo(ad.img)} alt="" style={{ width: 34, height: 34, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} />
                          <span style={{ font: '500 13px/1.2 var(--fen-font)', color: 'var(--fen-text)' }}>{ad.nome}</span>
                          <Tag tone="info">{ad.formato}</Tag>
                        </div>
                        <div style={{ width: 78, flexShrink: 0 }}>
                          <ToggleDot on={ad.status} />
                        </div>
                        <Cell w={70} />
                        <Cell w={80}>{brl0(ad.gasto)}</Cell>
                        <Cell w={80}>{ad.resultados.toLocaleString('pt-BR')}</Cell>
                        <Cell w={56} />
                        <span style={{ width: 24, color: 'var(--fen-muted)', cursor: 'pointer' }}>
                          <PnIcon name="edit" size={15} />
                        </span>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </Card>
    </Scroll>
  );
}
