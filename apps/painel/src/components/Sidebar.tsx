import { Avatar } from '@fenice/shared';
import { PnIcon, type PnIconName } from './PnIcon';
import { SELO_TERRA } from '../assets';

export type NavKey =
  | 'clientes'
  | 'audit_central'
  | 'dashboard'
  | 'reposicoes'
  | 'relatorios'
  | 'criar_campanha'
  | 'aprovar_campanhas'
  | 'battles';

interface NavItem {
  key: NavKey;
  icon: PnIconName;
  label: string;
  badge?: number;
  /** Visível apenas pra admin_fenice. */
  adminOnly?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    label: 'Operação',
    items: [
      { key: 'clientes', icon: 'users', label: 'Clientes' },
      { key: 'audit_central', icon: 'activity', label: 'Audit Central' },
    ],
  },
  {
    label: 'Tráfego Pago',
    items: [
      { key: 'dashboard', icon: 'grid', label: 'Dashboard' },
      { key: 'battles', icon: 'swords', label: 'Battles' },
      { key: 'criar_campanha', icon: 'plus', label: 'Criar campanha' },
      { key: 'aprovar_campanhas', icon: 'checkSq', label: 'Aprovar campanhas', adminOnly: true },
      { key: 'reposicoes', icon: 'refresh', label: 'Reposições' },
      { key: 'relatorios', icon: 'file', label: 'Relatórios' },
    ],
  },
];

export interface SidebarProps {
  view: NavKey;
  go: (key: NavKey) => void;
  collapsed?: boolean;
  mobileOpen?: boolean;
  onToggle?: () => void;
  /** Role do usuário logado — filtra itens admin-only. */
  isAdmin?: boolean;
}

export function Sidebar({ view, go, collapsed = false, mobileOpen = false, onToggle, isAdmin = false }: SidebarProps) {
  return (
    <nav className={`fen-pn-side${collapsed ? ' is-collapsed' : ''}${mobileOpen ? ' is-open' : ''}`}>
      <div className="fen-pn-side__brand">
        <img src={SELO_TERRA} width={30} height={30} alt="" />
        <div>
          <div className="fen-pn-side__word">
            fenice<span className="dot">.</span>
          </div>
          <div className="fen-pn-side__tag">PAINEL</div>
        </div>
        {onToggle && (
          <button
            type="button"
            className="fen-pn-side__close"
            onClick={onToggle}
            aria-label="Recolher menu"
            title="Recolher menu"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </div>

      {GROUPS.map((group) => (
        <div key={group.label}>
          <div className="fen-pn-side__group">{group.label}</div>
          <div className="fen-pn-side__nav">
            {group.items.filter((it) => !it.adminOnly || isAdmin).map((item) => {
              const on = view === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`fen-pn-side__item${on ? ' is-on' : ''}`}
                  onClick={() => go(item.key)}
                  title={collapsed ? item.label : undefined}
                  aria-label={item.label}
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
        </div>
      ))}

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
