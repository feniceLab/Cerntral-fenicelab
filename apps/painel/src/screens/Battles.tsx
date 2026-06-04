// ============================================================
// Battles — tela principal.
// Lista battles do cliente (cliente) ou todos (admin Fenice).
// CTA "+ Novo Battle" e filtros por status.
// ============================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import { Topbar, Scroll } from '../components/Chrome';
import { useAuth } from '../auth/useAuth';
import { listBattles } from '../battles/api';
import type { BattleStatus, BattleSummary } from '../battles/types';
import { BattlesList } from '../battles/BattlesList';
import { CriarBattleModal } from '../battles/CriarBattleModal';
import { BattleDrillDown } from '../battles/BattleDrillDown';
import '../battles/battles.css';

const REFRESH_MS = 30_000;
type StatusFilter = 'todos' | BattleStatus;

const FILTERS: Array<{ key: StatusFilter; label: string }> = [
  { key: 'todos', label: 'Todos' },
  { key: 'ativo', label: 'Ativos' },
  { key: 'finalizado', label: 'Finalizados' },
  { key: 'cancelado', label: 'Cancelados' },
];

export function Battles() {
  const { role, clienteSlug, email, user } = useAuth();
  const isAdmin = role === 'admin_fenice';
  const isCliente = role === 'cliente';

  const [battles, setBattles] = useState<BattleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [showCreate, setShowCreate] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const aborter = useRef<AbortController | null>(null);

  // Cliente vê só os seus; admin vê todos.
  const slugParam = isCliente ? clienteSlug ?? undefined : undefined;

  const load = useCallback(async () => {
    aborter.current?.abort();
    const ctrl = new AbortController();
    aborter.current = ctrl;
    const res = await listBattles(
      { slug: slugParam, status: statusFilter },
      ctrl.signal,
    );
    if (res.ok) {
      setBattles(res.data);
      setError(null);
      setLastFetch(new Date());
    } else if (res.error !== 'aborted') {
      setError(res.error);
    }
    setLoading(false);
  }, [slugParam, statusFilter]);

  useEffect(() => {
    setLoading(true);
    void load();
    const id = window.setInterval(() => { void load(); }, REFRESH_MS);
    return () => {
      window.clearInterval(id);
      aborter.current?.abort();
    };
  }, [load]);

  const stamp = lastFetch
    ? lastFetch.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';

  const kicker = isAdmin
    ? `Disputas entre campanhas · ${battles.length} battles · atualizado ${stamp}`
    : `Suas disputas · ${battles.length} battles · atualizado ${stamp}`;

  return (
    <>
      <Topbar kicker={kicker} title="Battles" />
      <Scroll>
        <div className="fen-bt-actions">
          <button
            type="button"
            className="fen-bt-btn fen-bt-btn--primary"
            onClick={() => setShowCreate(true)}
            disabled={isCliente && !clienteSlug}
            title={isCliente && !clienteSlug ? 'Conta sem cliente vinculado' : undefined}
          >
            + Novo Battle
          </button>
          <div className="fen-bt-filters" role="tablist" aria-label="Filtrar por status">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={statusFilter === f.key}
                className={`fen-bt-filter${statusFilter === f.key ? ' is-on' : ''}`}
                onClick={() => setStatusFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="fen-bt-error">
            Falha ao buscar battles: {error}. Tentando de novo em {REFRESH_MS / 1000}s.
            {' '}<em>(Backend pode estar em deploy.)</em>
          </div>
        )}

        {loading && battles.length === 0 && !error ? (
          <div className="fen-bt-empty">Carregando battles…</div>
        ) : (
          <BattlesList
            battles={battles}
            onOpen={setOpenId}
            showCliente={isAdmin}
          />
        )}
      </Scroll>

      {showCreate && (
        <CriarBattleModal
          isAdmin={isAdmin}
          forcedSlug={isCliente ? clienteSlug : null}
          actorEmail={email}
          actorAuthId={user?.id ?? null}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            void load();
          }}
        />
      )}

      {openId && (
        <BattleDrillDown
          battleId={openId}
          isAdmin={isAdmin}
          actorEmail={email}
          onClose={() => setOpenId(null)}
          onMutate={() => { void load(); }}
        />
      )}
    </>
  );
}
