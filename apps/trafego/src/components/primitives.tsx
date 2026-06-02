// ============================================================
// Primitivas visuais especificas do Trafego Pago que nao existem
// como atomo no @fenice/shared: sparkline, status "ao vivo",
// numero que pisca e a barra de dayparting (24h).
// ============================================================
import type { ReactNode } from 'react';

// ---- sparkline svg ----
export function Spark({
  data,
  color = 'var(--fen-terra)',
  w = 120,
  h = 36,
  fill = true,
}: {
  data: number[];
  color?: string;
  w?: number;
  h?: number;
  fill?: boolean;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / rng) * (h - 6) - 3,
  ]);
  const line = pts
    .map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1))
    .join(' ');
  const area = line + ` L${w} ${h} L0 ${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: 'block' }} aria-hidden="true">
      {fill && <path d={area} fill={color} opacity="0.12" />}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---- pilula de status ativo/pausado com ping "ao vivo" ----
export function StatusDot({ on, label }: { on: boolean; label?: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        font: '700 12px/1 var(--fen-font)',
        color: on ? 'var(--fen-success)' : 'var(--fen-muted)',
      }}
    >
      <span style={{ position: 'relative', width: 9, height: 9 }}>
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            background: on ? 'var(--fen-success)' : 'var(--fen-neutral-300)',
          }}
        />
        {on && (
          <span
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: 999,
              border: '2px solid var(--fen-success)',
              opacity: 0.35,
              animation: 'fen-tp-ping 1.6s ease-out infinite',
            }}
          />
        )}
      </span>
      {label || (on ? 'Ativo' : 'Pausado')}
    </span>
  );
}

// ---- numero que pisca ao mudar (key forca o reflow da animacao) ----
export function LiveNum({ children, k }: { children: ReactNode; k: string | number }) {
  return (
    <span key={k} style={{ display: 'inline-block', animation: 'fen-tp-flash .7s ease-out' }}>
      {children}
    </span>
  );
}

// ---- barra de 24h (dayparting) com janela ativa + hora atual ----
export function HourBar({
  janela,
  agora,
  live = false,
}: {
  janela: [number, number][];
  agora?: number;
  live?: boolean;
}) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
      {Array.from({ length: 24 }).map((_, h) => {
        const on = janela.some(([a, b]) => h >= a && h < b);
        const now = h === agora;
        const baseH = live ? 11 : 12;
        const nowH = live ? 18 : 20;
        return (
          <div
            key={h}
            style={{
              flex: 1,
              height: now ? nowH : baseH,
              borderRadius: 2,
              background: now
                ? 'var(--fen-terra)'
                : on
                  ? 'var(--fen-cotta)'
                  : 'var(--fen-argilla)',
              animation: now && live ? 'fen-tp-pulse 1.4s ease-in-out infinite' : 'none',
            }}
          />
        );
      })}
    </div>
  );
}
