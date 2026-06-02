import { ScreenIcon, type ScreenIconName } from '../lib/ScreenIcon';
import type { PortalTab } from '../navigation';

interface BottomNavProps {
  tab: PortalTab;
  onNavigate: (tab: PortalTab) => void;
  /** Acao do FAB central (abre Sugestoes). */
  onFab: () => void;
}

const ITEMS: ([PortalTab, ScreenIconName, string] | null)[] = [
  ['inicio', 'home', 'Inicio'],
  ['calendario', 'calendar', 'Agenda'],
  null,
  ['galeria', 'image', 'Galeria'],
  ['relatorios', 'chart', 'Relatorios'],
];

/** Barra inferior do Portal com FAB central de Sugestoes. */
export function BottomNav({ tab, onNavigate, onFab }: BottomNavProps) {
  return (
    <nav className="fen-pt-nav">
      {ITEMS.map((it, i) => {
        if (!it) {
          return (
            <div key="fab" className="fen-pt-nav__fab-slot">
              <button type="button" className="fen-pt-fab" onClick={onFab} aria-label="Sugestoes">
                <ScreenIcon name="sparkles" size={26} sw={2} />
              </button>
            </div>
          );
        }
        const [key, icon, label] = it;
        const active = tab === key;
        return (
          <button
            key={key}
            type="button"
            className={`fen-pt-nav__item${active ? ' is-active' : ''}`}
            onClick={() => onNavigate(key)}
          >
            <ScreenIcon name={icon} size={23} sw={active ? 2.2 : 1.8} />
            <span className="fen-pt-nav__label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
