// ============================================================
// BattleTrend — gráfico SVG inline (linhas por campanha).
// Sem libs externas — escala manual + paleta terrosa Fenice.
// ============================================================
import { useMemo } from 'react';
import type { BattleDetail } from './types';

interface Props {
  trend: NonNullable<BattleDetail['trend']>;
}

const SERIES_COLORS = [
  '#BE6E38', // cotta
  '#B23A2E', // terra
  '#7A5230', // caffe-mid
  '#4F8A52', // success
  '#8A6E3F', // tan
];

const W = 640;
const H = 180;
const PAD_L = 36;
const PAD_R = 12;
const PAD_T = 14;
const PAD_B = 22;

const fmtAxisBRL = (cents: number): string => {
  if (cents >= 100_000_00) return `R$${Math.round(cents / 100_000_00)}M`;
  if (cents >= 1_000_00) return `R$${Math.round(cents / 1_000_00)}k`;
  return `R$${Math.round(cents / 100)}`;
};

export function BattleTrend({ trend }: Props) {
  const { paths, xLabels, yLabels, legend, hasData } = useMemo(() => {
    const allPoints = trend.flatMap((s) =>
      s.points.map((p) => ({ t: new Date(p.t).getTime(), v: p.spend_cents })),
    );

    if (allPoints.length === 0) {
      return { paths: [], xLabels: [], yLabels: [], legend: [], hasData: false };
    }

    const tMin = Math.min(...allPoints.map((p) => p.t));
    const tMax = Math.max(...allPoints.map((p) => p.t));
    const vMin = 0;
    const vMaxRaw = Math.max(...allPoints.map((p) => p.v));
    const vMax = vMaxRaw <= 0 ? 100 : vMaxRaw * 1.08;

    const innerW = W - PAD_L - PAD_R;
    const innerH = H - PAD_T - PAD_B;

    const xOf = (t: number) => {
      if (tMax === tMin) return PAD_L + innerW / 2;
      return PAD_L + ((t - tMin) / (tMax - tMin)) * innerW;
    };
    const yOf = (v: number) => {
      if (vMax === vMin) return PAD_T + innerH / 2;
      return PAD_T + innerH - ((v - vMin) / (vMax - vMin)) * innerH;
    };

    const localPaths = trend.map((s, idx) => {
      const color = SERIES_COLORS[idx % SERIES_COLORS.length];
      const pts = s.points
        .slice()
        .sort((a, b) => new Date(a.t).getTime() - new Date(b.t).getTime());
      if (pts.length === 0) return { color, name: s.name, d: '', last: null as null | { x: number; y: number } };
      const d = pts
        .map((p, i) => {
          const x = xOf(new Date(p.t).getTime());
          const y = yOf(p.spend_cents);
          return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(' ');
      const lastPt = pts[pts.length - 1];
      const last = { x: xOf(new Date(lastPt.t).getTime()), y: yOf(lastPt.spend_cents) };
      return { color, name: s.name, d, last };
    });

    const localXLabels = [
      { x: xOf(tMin), label: new Date(tMin).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) },
      { x: xOf(tMax), label: new Date(tMax).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) },
    ];

    const localYLabels = [
      { y: yOf(vMax), label: fmtAxisBRL(vMax) },
      { y: yOf(vMax / 2), label: fmtAxisBRL(vMax / 2) },
      { y: yOf(0), label: 'R$0' },
    ];

    const localLegend = trend.map((s, idx) => ({
      name: s.name,
      color: SERIES_COLORS[idx % SERIES_COLORS.length],
    }));

    return { paths: localPaths, xLabels: localXLabels, yLabels: localYLabels, legend: localLegend, hasData: true };
  }, [trend]);

  if (!hasData) {
    return (
      <div className="fen-bt-trend">
        <div className="fen-bt-trend__title">Tendência de gasto por campanha</div>
        <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--fen-muted)', font: '500 12px/1.4 var(--fen-font)' }}>
          Sem dados de tendência ainda.
        </div>
      </div>
    );
  }

  return (
    <div className="fen-bt-trend">
      <div className="fen-bt-trend__title">Tendência de gasto por campanha</div>
      <svg
        className="fen-bt-trend__chart"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Gráfico de gasto acumulado por campanha"
      >
        {/* grid Y */}
        {yLabels.map((l, i) => (
          <g key={i}>
            <line
              x1={PAD_L}
              x2={W - PAD_R}
              y1={l.y}
              y2={l.y}
              stroke="var(--fen-border)"
              strokeDasharray="2 4"
            />
            <text
              x={PAD_L - 6}
              y={l.y + 3}
              textAnchor="end"
              fontSize="9"
              fill="var(--fen-muted)"
              fontFamily="var(--fen-font)"
            >
              {l.label}
            </text>
          </g>
        ))}
        {/* x labels */}
        {xLabels.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={H - 6}
            textAnchor={i === 0 ? 'start' : 'end'}
            fontSize="9"
            fill="var(--fen-muted)"
            fontFamily="var(--fen-font)"
          >
            {l.label}
          </text>
        ))}
        {/* paths */}
        {paths.map((p, idx) => (
          <g key={idx}>
            <path d={p.d} fill="none" stroke={p.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {p.last && (
              <circle cx={p.last.x} cy={p.last.y} r="3" fill={p.color} />
            )}
          </g>
        ))}
      </svg>
      <div className="fen-bt-trend__legend">
        {legend.map((l) => (
          <span key={l.name}>
            <span className="fen-bt-trend__swatch" style={{ background: l.color }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }} title={l.name}>
              {l.name}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
