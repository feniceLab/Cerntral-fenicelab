import type { ReactNode } from 'react';
import { Kicker } from '@fenice/shared';
import { PnIcon } from './PnIcon';

// ---------- Topbar ----------
export interface TopbarProps {
  title: ReactNode;
  kicker?: ReactNode;
  children?: ReactNode;
}

export function Topbar({ title, kicker, children }: TopbarProps) {
  return (
    <div className="fen-pn-top">
      <div>
        {kicker && <div style={{ marginBottom: 5 }}><Kicker>{kicker}</Kicker></div>}
        <div className="fen-pn-top__title">{title}</div>
      </div>
      <div className="fen-pn-top__actions">
        {children}
        <div className="fen-pn-bell">
          <PnIcon name="bell" size={19} />
          <span className="fen-pn-bell__dot" />
        </div>
      </div>
    </div>
  );
}

// ---------- Search ----------
export function Search({ ph }: { ph: string }) {
  return (
    <div className="fen-pn-search">
      <div className="fen-pn-search__icon">
        <PnIcon name="search" size={17} />
      </div>
      <input placeholder={ph} />
    </div>
  );
}

// ---------- Scroll ----------
export function Scroll({ children }: { children: ReactNode }) {
  return <div className="fen-pn-scroll">{children}</div>;
}
