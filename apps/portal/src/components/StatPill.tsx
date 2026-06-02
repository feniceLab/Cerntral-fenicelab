import { Card } from '@fenice/shared';

interface StatPillProps {
  valor: string;
  label: string;
  delta?: string;
}

/** Metrica compacta vs Marco Zero (usada em Inicio e Relatorios). */
export function StatPill({ valor, label, delta }: StatPillProps) {
  const up = delta?.startsWith('+');
  return (
    <Card className="fen-pt-stat" pad={13} style={{ boxShadow: 'none' }}>
      <div className="fen-pt-stat__value">{valor}</div>
      <div className="fen-pt-stat__label">{label}</div>
      {delta && (
        <div className={`fen-pt-stat__delta ${up ? 'is-up' : 'is-down'}`}>{delta} vs Marco Zero</div>
      )}
    </Card>
  );
}
