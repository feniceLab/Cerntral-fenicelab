// ============================================================
// Painel · Campanhas (tabela hierarquica Campanha ▸ Conjunto ▸ Anuncio).
// ============================================================
import { useState, type ReactNode } from 'react';
import { Card, Avatar, Button, Tag, Toggle } from '@fenice/shared';
import { TpIcon } from '../../lib/icons';
import { StatusDot } from '../../components/primitives';
import { CAMPANHAS, photo, brl0, type Campanha } from '../../lib/data';
import type { PainelTab } from '../../lib/nav';

const OBJ_COLOR: Record<Campanha['objetivo'], [string, string]> = {
  Vendas: ['var(--fen-success-bg)', '#3c5232'],
  Alcance: ['var(--fen-terra-l)', 'var(--fen-terra-d)'],
  Mensagens: ['var(--fen-warning-bg)', '#7a4520'],
};

function Cell({ children, w, b, c }: { children?: ReactNode; w: number; b?: boolean; c?: string }) {
  return (
    <div
      className="fen-tp-num"
      style={{
        width: w,
        font: `${b ? 700 : 500} 13px/1.2 var(--fen-font)`,
        color: c || 'var(--fen-text)',
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children, bg, color }: { children: ReactNode; bg: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        font: '700 11px/1 var(--fen-font)',
        borderRadius: 999,
        padding: '4px 10px',
        background: bg,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

export function Campanhas({ go }: { go: (t: PainelTab) => void }) {
  const [open, setOpen] = useState<Record<string, boolean>>({ c1: true, s1: true });
  const tog = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  return (
    <div className="fen-tp-scroll">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar letter="S" size={32} />
          <span style={{ font: '700 16px/1 var(--fen-font)', color: 'var(--fen-caffe)' }}>Suprema Pizza</span>
          <Tag tone="outline">conta act_4920…</Tag>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="ghost" size="sm">
            <TpIcon name="filter" size={15} sw={2} />
            Filtrar
          </Button>
          <Button variant="primary" size="sm" onClick={() => go('criar')}>
            <TpIcon name="plus" size={15} sw={2} />
            Criar campanha
          </Button>
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
          <span style={{ flex: 1 }}>Campanha / conjunto / anuncio</span>
          <Cell w={78}>Status</Cell>
          <Cell w={70}>Orcam.</Cell>
          <Cell w={80}>Gasto</Cell>
          <Cell w={80}>Result.</Cell>
          <Cell w={56}>ROAS</Cell>
          <span style={{ width: 24 }} />
        </div>

        {CAMPANHAS.map((camp) => (
          <div key={camp.id}>
            {/* CAMPANHA */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '13px 18px',
                borderBottom: '1px solid var(--fen-border)',
                background: 'var(--fen-surface-2)',
              }}
            >
              <span onClick={() => tog(camp.id)} style={{ width: 26, flexShrink: 0, cursor: 'pointer', color: 'var(--fen-muted)' }}>
                <TpIcon name={open[camp.id] ? 'chevD' : 'chevR'} size={18} />
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <TpIcon name="megaphone" size={17} color="var(--fen-terra-d)" />
                <span style={{ font: '700 14px/1.2 var(--fen-font)', color: 'var(--fen-caffe)' }}>{camp.nome}</span>
                <Pill bg={OBJ_COLOR[camp.objetivo][0]} color={OBJ_COLOR[camp.objetivo][1]}>
                  {camp.objetivo}
                </Pill>
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
                <TpIcon name="more" size={18} />
              </span>
            </div>

            {/* CONJUNTOS */}
            {open[camp.id] &&
              camp.conjuntos.map((cj) => (
                <div key={cj.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '11px 18px 11px 30px',
                      borderBottom: '1px solid var(--fen-border)',
                    }}
                  >
                    <span onClick={() => tog(cj.id)} style={{ width: 26, flexShrink: 0, cursor: 'pointer', color: 'var(--fen-muted)' }}>
                      <TpIcon name={open[cj.id] ? 'chevD' : 'chevR'} size={16} />
                    </span>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                      <TpIcon name="layers" size={15} color="var(--fen-cotta-d)" />
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
                      <div
                        key={ad.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '9px 18px 9px 56px',
                          borderBottom: '1px solid var(--fen-border)',
                        }}
                      >
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                          <img
                            src={photo(ad.img)}
                            alt=""
                            style={{ width: 34, height: 34, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }}
                          />
                          <span style={{ font: '500 13px/1.2 var(--fen-font)', color: 'var(--fen-text)' }}>{ad.nome}</span>
                          <Pill bg="var(--fen-surface-2)" color="var(--fen-muted)">{ad.formato}</Pill>
                        </div>
                        <div style={{ width: 78, flexShrink: 0 }}>
                          <Toggle defaultChecked={ad.status} label={`Ligar ${ad.nome}`} />
                        </div>
                        <Cell w={70} />
                        <Cell w={80}>{brl0(ad.gasto)}</Cell>
                        <Cell w={80}>{ad.resultados.toLocaleString('pt-BR')}</Cell>
                        <Cell w={56} />
                        <span style={{ width: 24, color: 'var(--fen-muted)', cursor: 'pointer' }}>
                          <TpIcon name="edit" size={15} />
                        </span>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </Card>
    </div>
  );
}
