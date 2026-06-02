import type { ReactNode } from 'react';

// ---------- Ponto pulsante "ao vivo" ----------
export interface LiveDotProps {
  size?: number;
  color?: string;
  ring?: string;
}
export function LiveDot({ size = 9, color = 'var(--fen-success)', ring }: LiveDotProps) {
  const r = size / 2 + 0.5;
  return (
    <span className="fen-pn-dot" style={{ width: size, height: size }}>
      <span className="fen-pn-dot__core" style={{ background: color }} />
      <span
        className="fen-pn-dot__ring"
        style={{ inset: -Math.round(r * 0.9), border: `2px solid ${ring ?? color}`, opacity: 0.4 }}
      />
    </span>
  );
}

// ---------- Numero que "pisca" ao mudar (key remonta -> reanima) ----------
export function LiveNum({ children, flashKey }: { children: ReactNode; flashKey: string | number }) {
  return (
    <span key={flashKey} className="fen-pn-live">
      {children}
    </span>
  );
}

// ---------- Pilula de status ativo/pausado ----------
export function StatusDot({ on = true, label }: { on?: boolean; label?: string }) {
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
      {on ? (
        <LiveDot />
      ) : (
        <span style={{ width: 9, height: 9, borderRadius: 999, background: 'var(--fen-neutral-300)', display: 'inline-block' }} />
      )}
      {label ?? (on ? 'Ativo' : 'Pausado')}
    </span>
  );
}

// ---------- Toggle puramente visual (sem estado) ----------
export function ToggleDot({ on }: { on: boolean }) {
  return (
    <span
      style={{
        width: 42,
        height: 24,
        borderRadius: 20,
        background: on ? 'var(--fen-success)' : 'var(--fen-argilla)',
        position: 'relative',
        flexShrink: 0,
        display: 'inline-block',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 20 : 2,
          width: 20,
          height: 20,
          borderRadius: 999,
          background: '#fff',
          boxShadow: '0 1px 2px rgba(0,0,0,.2)',
        }}
      />
    </span>
  );
}

// ---------- Sparkline SVG ----------
export interface SparkProps {
  data: number[];
  color?: string;
  w?: number;
  h?: number;
  fill?: boolean;
}
export function Spark({ data, color = 'var(--fen-terra)', w = 120, h = 36, fill = true }: SparkProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / rng) * (h - 6) - 3]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${w} ${h} L0 ${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: 'block' }} aria-hidden="true">
      {fill && <path d={area} fill={color} opacity="0.12" />}
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------- Barra de 24h com hora atual destacada ----------
export function HourBar({ janela, agora }: { janela: [number, number][]; agora: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
      {Array.from({ length: 24 }).map((_, h) => {
        const on = janela.some(([a, b]) => h >= a && h < b);
        const now = h === agora;
        return (
          <div
            key={h}
            style={{
              flex: 1,
              height: now ? 18 : 11,
              borderRadius: 2,
              background: now ? 'var(--fen-terra)' : on ? 'var(--fen-cotta)' : 'var(--fen-argilla)',
              animation: now ? 'fen-pn-pulse 1.4s ease-in-out infinite' : 'none',
            }}
          />
        );
      })}
    </div>
  );
}
