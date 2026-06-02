interface StatusDotProps {
  on: boolean;
  label?: string;
}

/** Pilula de status ativo/pausado com anel pulsante "ao vivo". */
export function StatusDot({ on, label }: StatusDotProps) {
  return (
    <span className={`fen-pt-status ${on ? 'is-on' : 'is-off'}`}>
      <span style={{ position: 'relative', width: 9, height: 9 }}>
        <span className="fen-pt-status__core" />
        {on && <span className="fen-pt-status__ring" />}
      </span>
      {label ?? (on ? 'Ativo' : 'Pausado')}
    </span>
  );
}

/** Indicador "N campanhas no ar" com bolinha verde pulsante. */
export function PulseFlag({ label }: { label: string }) {
  return (
    <div className="fen-pt-live-flag">
      <span className="fen-pt-pulse">
        <span className="fen-pt-pulse__core" />
        <span className="fen-pt-pulse__ring" />
      </span>
      <span className="fen-pt-live-flag__label">{label}</span>
    </div>
  );
}
