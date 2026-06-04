import type { Alerta } from '../../../trafego';

export function AlertasList({ alertas }: { alertas: Alerta[] }) {
  if (alertas.length === 0) {
    return (
      <div className="perf-alerts-empty">
        <span className="perf-alerts-empty-icon">✓</span>
        <div>
          <div className="perf-alerts-empty-title">Sem alertas operacionais</div>
          <div className="perf-alerts-empty-sub">Operação dentro dos parâmetros Sobral.</div>
        </div>
      </div>
    );
  }
  return (
    <div className="perf-alerts">
      {alertas.map((al, i) => (
        <div key={i} className={`perf-alert perf-alert--${al.severidade}`}>
          <span className="perf-alert-icon" aria-hidden>
            {al.severidade === 'critico' ? '🚨' : al.severidade === 'aviso' ? '⚠' : 'ⓘ'}
          </span>
          <div className="perf-alert-body">
            <div className="perf-alert-title">{al.titulo}</div>
            <div className="perf-alert-detail">{al.detalhe}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
