import { useMemo } from 'react';
import type { AuditEntry } from './AuditKPIs';

export interface AuditChartProps {
  entries: AuditEntry[];
}

type ActionKey = 'pause' | 'resume' | 'budget' | 'other';

interface DayBucket {
  date: Date;
  label: string;
  pause: number;
  resume: number;
  budget: number;
  other: number;
  total: number;
}

const COLOR: Record<ActionKey, string> = {
  pause: 'var(--fen-cotta)',
  resume: 'var(--fen-success)',
  budget: 'var(--fen-terra)',
  other: 'rgba(154,140,122,.6)',
};

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function AuditChart({ entries }: AuditChartProps) {
  const buckets = useMemo<DayBucket[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: DayBucket[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push({
        date: d,
        label: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
        pause: 0,
        resume: 0,
        budget: 0,
        other: 0,
        total: 0,
      });
    }
    const byKey = new Map<string, DayBucket>();
    days.forEach((b) => byKey.set(ymd(b.date), b));

    entries.forEach((e) => {
      const t = new Date(e.ts);
      if (Number.isNaN(t.getTime())) return;
      t.setHours(0, 0, 0, 0);
      const key = ymd(t);
      const b = byKey.get(key);
      if (!b) return;
      if (e.action === 'pause') b.pause++;
      else if (e.action === 'resume') b.resume++;
      else if (e.action === 'budget_up' || e.action === 'budget_down') b.budget++;
      else b.other++;
      b.total++;
    });

    return days;
  }, [entries]);

  const maxV = Math.max(1, ...buckets.map((b) => b.total));
  const W = 720;
  const H = 220;
  const padL = 18;
  const padR = 8;
  const padTop = 22;
  const padBottom = 28;
  const innerW = W - padL - padR;
  const innerH = H - padTop - padBottom;
  const slot = innerW / buckets.length;
  const barW = Math.min(46, slot * 0.62);

  const totalAll = buckets.reduce((s, b) => s + b.total, 0);

  return (
    <div className="fen-audit-chart">
      <div className="fen-audit-chart__head">
        <div className="fen-audit-chart__title">Atividade · últimos 7 dias ({totalAll} eventos)</div>
        <div className="fen-audit-chart__legend">
          <span><i style={{ background: COLOR.pause }} />pause</span>
          <span><i style={{ background: COLOR.resume }} />resume</span>
          <span><i style={{ background: COLOR.budget }} />budget</span>
          <span><i style={{ background: COLOR.other }} />outros</span>
        </div>
      </div>
      <svg className="fen-audit-chart__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {/* grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((g) => {
          const y = padTop + innerH * (1 - g);
          return (
            <line
              key={g}
              x1={padL}
              x2={padL + innerW}
              y1={y}
              y2={y}
              stroke="rgba(154,140,122,.18)"
              strokeWidth={1}
              strokeDasharray={g === 0 ? '' : '3 4'}
            />
          );
        })}

        {buckets.map((b, i) => {
          const cx = padL + slot * i + slot / 2;
          const x = cx - barW / 2;
          const totalH = (b.total / maxV) * innerH;
          // stack order: pause (bottom) → resume → budget → other (top)
          const stacks: { k: ActionKey; v: number }[] = [
            { k: 'pause', v: b.pause },
            { k: 'resume', v: b.resume },
            { k: 'budget', v: b.budget },
            { k: 'other', v: b.other },
          ];
          let cursorY = padTop + innerH;
          return (
            <g key={i}>
              {stacks.map((s, idx) => {
                if (s.v === 0) return null;
                const h = (s.v / maxV) * innerH;
                cursorY -= h;
                return (
                  <rect
                    key={idx}
                    x={x}
                    y={cursorY}
                    width={barW}
                    height={h}
                    fill={COLOR[s.k]}
                    rx={idx === stacks.length - 1 ? 3 : 0}
                  >
                    <title>{`${b.label} · ${s.k}: ${s.v}`}</title>
                  </rect>
                );
              })}
              {/* count label on top */}
              {b.total > 0 && (
                <text
                  x={cx}
                  y={padTop + innerH - totalH - 6}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  fill="var(--fen-caffe)"
                >
                  {b.total}
                </text>
              )}
              {/* x axis label */}
              <text
                x={cx}
                y={padTop + innerH + 18}
                textAnchor="middle"
                fontSize={10.5}
                fill="var(--fen-muted)"
              >
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
