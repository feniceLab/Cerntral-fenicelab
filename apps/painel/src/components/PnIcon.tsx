import type { CSSProperties } from 'react';

// Conjunto de icones (tipo Lucide) usado pelas telas do Painel + submodulo Trafego.
// A shared/Icon cobre poucos paths; aqui replicamos o set completo do prototipo.
export const PN_PATHS = {
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM13 13h7v7h-7zM4 13h7v7H4z',
  users:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11',
  inbox:
    'M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z',
  calendar: 'M8 2v3M16 2v3M3.5 8.5h17M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  checkSq: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM21 21l-4.3-4.3',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  check: 'M20 6 9 17l-5-5',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z',
  x: 'M18 6 6 18M6 6l12 12',
  plus: 'M12 5v14M5 12h14',
  chevR: 'M9 6l6 6-6 6',
  chevD: 'M6 9l6 6 6-6',
  more: 'M12 5.5h.01M12 12h.01M12 18.5h.01',
  clock: 'M12 7v5l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3Z',
  download: 'M12 3v12m0 0 4-4m-4 4-4-4M5 21h14',
  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15H4.5a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 6 9.4l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 12 3.5V3a2 2 0 0 1 4 0v.09c0 .66.39 1.26 1 1.51.61.26 1.32.13 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 21 12.4',
  // submodulo trafego
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  megaphone: 'M3 11v2a1 1 0 0 0 1 1h2l3.5 4V6L6 10H4a1 1 0 0 0-1 1ZM14 7s3 1.5 3 5-3 5-3 5M18 4s4 2 4 8-4 8-4 8',
  layers: 'M12 3 2 8l10 5 10-5-10-5ZM2 13l10 5 10-5M2 18l10 5 10-5',
  rocket: 'M5 13l-2 6 6-2M9 15l-3-3a13 13 0 0 1 9-9c2.5 0 4 1.5 4 4a13 13 0 0 1-9 9l-1-1ZM14 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  pause: 'M8 5h3v14H8zM15 5h3v14h-3z',
  trend: 'M3 17l6-6 4 4 8-8M21 7v5h-5',
  dollar: 'M12 2v20M17 6.5C17 4.6 14.8 3.5 12 3.5S7 4.6 7 6.5 9.2 9.5 12 10s5 1.6 5 3.5-2.2 3-5 3-5-1.1-5-3',
  cart: 'M3 4h2l2.5 13h11l2-9H6M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  msg: 'M21 11.5a8.4 8.4 0 0 1-12 7.6L3 21l1.9-6A8.4 8.4 0 1 1 21 11.5Z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  refresh: 'M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6M8 13h8M8 17h6',
  arrowR: 'M5 12h14M13 6l6 6-6 6',
  // espadas cruzadas — Battles
  swords:
    'M14.5 17.5 17 20l3-3-2.5-2.5M14.5 17.5 8 11M14.5 17.5 13 19M9.5 6.5 7 4 4 7l2.5 2.5M9.5 6.5 16 13M9.5 6.5 11 5M3 21l3-3M21 3l-3 3',
} as const;

export type PnIconName = keyof typeof PN_PATHS;

export interface PnIconProps {
  name: PnIconName;
  size?: number;
  color?: string;
  sw?: number;
  style?: CSSProperties;
}

export function PnIcon({ name, size = 20, color = 'currentColor', sw = 1.8, style }: PnIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <path d={PN_PATHS[name]} />
    </svg>
  );
}
