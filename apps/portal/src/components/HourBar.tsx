interface HourBarProps {
  /** Janelas ativas no formato [inicio, fim) em horas. */
  janela: [number, number][];
  /** Hora "agora" destacada. */
  agora?: number;
}

/** Barra de 24h read-only (dayparting) — janela ativa + marcador "agora". */
export function HourBar({ janela, agora = 19 }: HourBarProps) {
  return (
    <div className="fen-pt-hourbar">
      {Array.from({ length: 24 }).map((_, h) => {
        const on = janela.some(([a, b]) => h >= a && h < b);
        const now = h === agora;
        const bg = now ? 'var(--fen-terra)' : on ? 'var(--fen-cotta)' : 'var(--fen-argilla)';
        return (
          <div key={h} className="fen-pt-hourbar__h" style={{ height: now ? 20 : 12, background: bg }} />
        );
      })}
    </div>
  );
}
