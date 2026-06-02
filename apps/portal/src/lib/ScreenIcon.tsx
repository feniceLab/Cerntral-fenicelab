import type { CSSProperties } from 'react';

// ------------------------------------------------------------
// Icones especificos das telas do Portal (estilo Lucide, stroke round).
// O design system @fenice/shared expoe so um subconjunto de icones;
// aqui ficam os glyphs extras usados nas telas (home, chart, palette,
// upload, megaphone, dollar, etc.). Mesmas paths dos prototipos.
// ------------------------------------------------------------
export const SCREEN_ICON_PATHS = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V20h5v-6h4v6h5V9.5',
  calendar:
    'M8 2v3M16 2v3M3.5 8.5h17M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  image:
    'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM3.5 16l4.5-4 3.5 3 4-4.5 5 5.5M9 9.5a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  sparkles:
    'M12 3l1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5L12 3ZM18.5 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z',
  check: 'M20 6 9 17l-5-5',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z',
  upload: 'M12 16V4m0 0L7 9m5-5 5 5M5 18v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  chevR: 'M9 6l6 6-6 6',
  chevL: 'M15 6l-6 6 6 6',
  plus: 'M12 5v14M5 12h14',
  x: 'M18 6 6 18M6 6l12 12',
  palette:
    'M12 3a9 9 0 1 0 0 18c1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8Z',
  clock: 'M12 7v5l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z',
  msg: 'M21 11.5a8.4 8.4 0 0 1-12 7.6L3 21l1.9-6A8.4 8.4 0 1 1 21 11.5Z',
  arrowR: 'M5 12h14M13 6l6 6-6 6',
  // ---- Trafego pago ----
  play: 'M7 4v16l13-8z',
  pause: 'M8 5h3v14H8zM15 5h3v14h-3z',
  trend: 'M3 17l6-6 4 4 8-8M21 7v5h-5',
  dollar:
    'M12 2v20M17 6.5C17 4.6 14.8 3.5 12 3.5S7 4.6 7 6.5 9.2 9.5 12 10s5 1.6 5 3.5-2.2 3-5 3-5-1.1-5-3',
  cart: 'M3 4h2l2.5 13h11l2-9H6M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6M8 13h8M8 17h6',
  download: 'M12 3v12m0 0 4-4m-4 4-4-4M5 21h14',
} as const;

export type ScreenIconName = keyof typeof SCREEN_ICON_PATHS;

export interface ScreenIconProps {
  name: ScreenIconName;
  size?: number;
  color?: string;
  sw?: number;
  fill?: string;
  style?: CSSProperties;
}

export function ScreenIcon({
  name,
  size = 22,
  color = 'currentColor',
  sw = 1.8,
  fill = 'none',
  style,
}: ScreenIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <path d={SCREEN_ICON_PATHS[name]} />
    </svg>
  );
}
