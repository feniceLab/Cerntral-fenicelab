import { Avatar } from '@fenice/shared';
import { PnIcon, type PnIconName } from './PnIcon';
import { SELO_TERRA } from '../assets';

export type NavKey = 'dashboard' | 'aprovacoes' | 'clientes' | 'triagem' | 'calendario' | 'trafego';

interface NavItem {
  key: NavKey;
  icon: PnIconName;
  label: string;
  badge?: number;
}

const ITEMS: NavItem[] = [
  { key: 'dashboard', icon: 'grid', label: 'Dashboard' },
  { key: 'aprovacoes', icon: 'checkSq', label: 'Aprovações', badge: 3 },
  { key: 'clientes', icon: 'users', label: 'Clientes' },
  { key: 'triagem', icon: 'inbox', label: 'Triagem', badge: 3 },
  { key: 'calendario', icon: 'calendar', label: 'Calendário' },
  { key: 'trafego', icon: 'target', label: 'Tráfego Pago' },
];

export interface SidebarProps {
  view: NavKey;
  go: (key: NavKey) => void;
}

export function Sidebar({ view, go }: SidebarProps) {
  return (
    <nav className="fen-pn-side">
      <div className="fen-pn-side__brand">
        <img src={SELO_TERRA} width={30} height={30} alt="" />
        <div>
          <div className="fen-pn-side__word">
            fenice<span className="dot">.</span>
          </div>
          <div className="fen-pn-side__tag">PAINEL</div>
        </div>
      </div>

      <div className="fen-pn-side__group">Operação</div>
      <div className="fen-pn-side__nav">
        {ITEMS.map((item) => {
          const on = view === item.key;
          return (
            <button
              key={item.key}
              type="button"
              className={`fen-pn-side__item${on ? ' is-on' : ''}`}
              onClick={() => go(item.key)}
            >
              <PnIcon
                name={item.icon}
                size={19}
                sw={on ? 2.1 : 1.8}
                color={on ? 'var(--fen-cotta)' : '#bcae9d'}
              />
              <span>{item.label}</span>
              {item.badge ? <span className="fen-pn-side__badge">{item.badge}</span> : null}
            </button>
          );
        })}
      </div>

      <div className="fen-pn-side__foot">
        <Avatar letter="D" size={34} />
        <div style={{ flex: 1 }}>
          <div className="fen-pn-side__name">Dante</div>
          <div className="fen-pn-side__role">Admin Central</div>
        </div>
        <PnIcon name="settings" size={17} color="#9a8f7f" />
      </div>
    </nav>
  );
}
