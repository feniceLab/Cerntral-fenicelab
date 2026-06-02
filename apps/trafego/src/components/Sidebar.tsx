// ============================================================
// Sidebar do Painel Fenice (Trafego Pago ativo). Apenas visual.
// ============================================================
import { Avatar } from '@fenice/shared';
import { TpIcon, type TpIconName } from '../lib/icons';
import { FENICE_SELO_TERRA } from '../lib/data';

type Item = [label: string, icon: TpIconName, badge: number, on?: boolean];

const ITEMS: Item[] = [
  ['Dashboard', 'grid', 0],
  ['Aprovacoes', 'check', 3],
  ['Clientes', 'users', 0],
  ['Trafego Pago', 'target', 0, true],
  ['Relatorios', 'file', 0],
];

export function Sidebar() {
  return (
    <div
      style={{
        width: 232,
        background: 'var(--fen-caffe)',
        color: 'var(--fen-avorio)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '22px 16px',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 4px' }}>
        <img src={FENICE_SELO_TERRA} width="30" height="30" alt="Fenice" />
        <div>
          <div
            style={{
              fontFamily: 'var(--fen-display)',
              fontWeight: 900,
              fontSize: 22,
              lineHeight: 1,
              color: 'var(--fen-avorio)',
            }}
          >
            fenice<span style={{ color: 'var(--fen-cotta)' }}>.</span>
          </div>
          <div
            style={{
              font: '700 8px/1 var(--fen-font)',
              letterSpacing: '.24em',
              color: 'var(--fen-cotta)',
              marginTop: 2,
            }}
          >
            PAINEL
          </div>
        </div>
      </div>
      <div
        style={{
          font: '700 9px/1 var(--fen-font)',
          letterSpacing: '.18em',
          color: '#9a8f7f',
          textTransform: 'uppercase',
          margin: '26px 8px 8px',
        }}
      >
        Operacao
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {ITEMS.map(([label, icon, badge, on]) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '10px 10px',
              borderRadius: 10,
              cursor: 'pointer',
              color: on ? 'var(--fen-avorio)' : '#d8cdbd',
              background: on ? 'rgba(204,122,77,.18)' : 'transparent',
              font: `${on ? 600 : 500} 14px/1 var(--fen-font)`,
            }}
          >
            <TpIcon name={icon} size={19} sw={on ? 2.1 : 1.8} color={on ? 'var(--fen-cotta)' : '#bcae9d'} />
            <span style={{ flex: 1 }}>{label}</span>
            {badge ? (
              <span
                style={{
                  font: '700 10px/1 var(--fen-font)',
                  background: 'var(--fen-terra)',
                  color: '#fff',
                  borderRadius: 999,
                  padding: '3px 7px',
                }}
              >
                {badge}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 8px',
          borderTop: '1px solid rgba(255,255,255,.08)',
        }}
      >
        <Avatar letter="D" size={34} />
        <div style={{ flex: 1 }}>
          <div style={{ font: '600 13px/1.1 var(--fen-font)', color: 'var(--fen-avorio)' }}>Dante</div>
          <div style={{ font: '500 11px/1 var(--fen-font)', color: '#9a8f7f' }}>Admin Central</div>
        </div>
        <TpIcon name="settings" size={17} color="#9a8f7f" />
      </div>
    </div>
  );
}
