import { useEffect, useRef, useState } from 'react';
import { Topbar, Scroll } from '../components/Chrome';
import { AuditKPIs, type AuditEntry } from '../audit/AuditKPIs';
import { AuditChart } from '../audit/AuditChart';
import { AuditTable, type AuditTableFilters } from '../audit/AuditTable';
import '../audit/audit.css';

const ENDPOINT = 'https://relatorios.fenicelab.com.br/api/audit-log?limit=500';
const REFRESH_MS = 30_000;

interface AuditResponse {
  ok?: boolean;
  entries?: AuditEntry[];
}

const INITIAL_FILTERS: AuditTableFilters = {
  cliente: '',
  tipos: new Set(),
  acoes: new Set(),
  actor: '',
  periodo: 'all',
};

export function AuditCentral() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [filters, setFilters] = useState<AuditTableFilters>(INITIAL_FILTERS);
  const aborter = useRef<AbortController | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      aborter.current?.abort();
      const ctrl = new AbortController();
      aborter.current = ctrl;
      try {
        const res = await fetch(ENDPOINT, { signal: ctrl.signal, cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as AuditResponse;
        if (!alive) return;
        setEntries(Array.isArray(data.entries) ? data.entries : []);
        setError(null);
        setLastFetch(new Date());
      } catch (err) {
        if (!alive) return;
        if ((err as Error)?.name === 'AbortError') return;
        setError((err as Error)?.message || 'erro desconhecido');
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    const id = window.setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      window.clearInterval(id);
      aborter.current?.abort();
    };
  }, []);

  const stamp = lastFetch
    ? lastFetch.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';

  return (
    <>
      <Topbar
        kicker={`Atividade da agência · ${entries.length} eventos · atualizado ${stamp}`}
        title="Audit Central"
      />
      <Scroll>
        {error && (
          <div
            style={{
              padding: '12px 16px',
              marginBottom: 16,
              borderRadius: 10,
              border: '1px solid rgba(178,58,46,.35)',
              background: 'var(--fen-danger-bg)',
              color: 'var(--fen-terra-d)',
              font: '500 12.5px/1.4 var(--fen-font)',
            }}
          >
            Falha ao buscar audit-log: {error}. Tentando de novo em {REFRESH_MS / 1000}s.
          </div>
        )}

        {loading && entries.length === 0 ? (
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              color: 'var(--fen-muted)',
              font: '500 13px/1.4 var(--fen-font)',
            }}
          >
            Carregando audit-log…
          </div>
        ) : (
          <>
            <AuditKPIs entries={entries} />
            <AuditChart entries={entries} />
            <AuditTable entries={entries} filters={filters} setFilters={setFilters} />
          </>
        )}
      </Scroll>
    </>
  );
}
