interface SparklineProps {
  data: number[];
  color?: string;
  w?: number;
  h?: number;
  fill?: boolean;
}

/** Mini-grafico de linha (svg) com area preenchida opcional. */
export function Sparkline({ data, color = 'var(--fen-terra)', w = 120, h = 36, fill = true }: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / rng) * (h - 6) - 3]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: 'block' }} aria-hidden="true">
      {fill && <path d={area} fill={color} opacity="0.12" />}
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
