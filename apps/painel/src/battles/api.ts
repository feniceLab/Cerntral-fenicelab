// ============================================================
// Battles — wrapper de fetch contra o serviço de tráfego.
// Mesmo padrão dos outros módulos (TRAFEGO base via VITE_TRAFEGO_URL).
// ============================================================
import type {
  BattleDetail,
  BattleStatus,
  BattleSummary,
  CampaignListItem,
  CreateBattlePayload,
  DecidirBattlePayload,
} from './types';

const TRAFEGO: string = (import.meta as unknown as { env?: Record<string, string> })?.env?.VITE_TRAFEGO_URL || '';

interface ApiOk<T> { ok: true; data: T; }
interface ApiErr { ok: false; error: string; status?: number; }
export type ApiResult<T> = ApiOk<T> | ApiErr;

const safeError = async (res: Response): Promise<string> => {
  try {
    const j = await res.json() as { error?: string };
    if (j?.error) return j.error;
  } catch { /* noop */ }
  return `HTTP ${res.status}`;
};

const url = (path: string): string => `${TRAFEGO}${path}`;

/** Lista battles. Se slug, filtra; se status, filtra. */
export async function listBattles(
  params: { slug?: string; status?: BattleStatus | 'todos' },
  signal?: AbortSignal,
): Promise<ApiResult<BattleSummary[]>> {
  const qs = new URLSearchParams();
  if (params.slug) qs.set('slug', params.slug);
  if (params.status && params.status !== 'todos') qs.set('status', params.status);
  try {
    const res = await fetch(url(`/api/battle/list?${qs.toString()}`), {
      signal,
      cache: 'no-store',
    });
    if (!res.ok) return { ok: false, error: await safeError(res), status: res.status };
    const j = await res.json() as { battles?: BattleSummary[] };
    return { ok: true, data: Array.isArray(j.battles) ? j.battles : [] };
  } catch (err) {
    const e = err as Error;
    if (e.name === 'AbortError') return { ok: false, error: 'aborted' };
    return { ok: false, error: e.message || 'Erro de rede' };
  }
}

export async function getBattle(
  id: string,
  signal?: AbortSignal,
): Promise<ApiResult<BattleDetail>> {
  try {
    const res = await fetch(url(`/api/battle/${encodeURIComponent(id)}`), {
      signal,
      cache: 'no-store',
    });
    if (!res.ok) return { ok: false, error: await safeError(res), status: res.status };
    const j = await res.json() as { battle?: BattleDetail };
    if (!j.battle) return { ok: false, error: 'Battle não retornado' };
    return { ok: true, data: j.battle };
  } catch (err) {
    const e = err as Error;
    if (e.name === 'AbortError') return { ok: false, error: 'aborted' };
    return { ok: false, error: e.message || 'Erro de rede' };
  }
}

export async function listCampaignsForBattle(
  slug: string,
  signal?: AbortSignal,
): Promise<ApiResult<CampaignListItem[]>> {
  const qs = new URLSearchParams({ slug });
  try {
    const res = await fetch(url(`/api/campaigns?${qs.toString()}`), {
      signal,
      cache: 'no-store',
    });
    if (!res.ok) return { ok: false, error: await safeError(res), status: res.status };
    const j = await res.json() as { campaigns?: CampaignListItem[] };
    return { ok: true, data: Array.isArray(j.campaigns) ? j.campaigns : [] };
  } catch (err) {
    const e = err as Error;
    if (e.name === 'AbortError') return { ok: false, error: 'aborted' };
    return { ok: false, error: e.message || 'Erro de rede' };
  }
}

export async function createBattle(payload: CreateBattlePayload): Promise<ApiResult<BattleSummary>> {
  try {
    const res = await fetch(url('/api/battle/create'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: await safeError(res), status: res.status };
    const j = await res.json() as { battle?: BattleSummary };
    if (!j.battle) return { ok: false, error: 'Resposta inválida' };
    return { ok: true, data: j.battle };
  } catch (err) {
    return { ok: false, error: (err as Error).message || 'Erro de rede' };
  }
}

export async function cancelBattle(id: string, actor_email: string | null): Promise<ApiResult<true>> {
  try {
    const res = await fetch(url(`/api/battle/${encodeURIComponent(id)}/cancel`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor_email }),
    });
    if (!res.ok) return { ok: false, error: await safeError(res), status: res.status };
    return { ok: true, data: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message || 'Erro de rede' };
  }
}

export async function decidirBattle(id: string, payload: DecidirBattlePayload): Promise<ApiResult<true>> {
  try {
    const res = await fetch(url(`/api/battle/${encodeURIComponent(id)}/decidir`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: await safeError(res), status: res.status };
    return { ok: true, data: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message || 'Erro de rede' };
  }
}

export async function revertBattle(id: string, actor_email: string | null): Promise<ApiResult<true>> {
  try {
    const res = await fetch(url(`/api/battle/${encodeURIComponent(id)}/revert`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor_email }),
    });
    if (!res.ok) return { ok: false, error: await safeError(res), status: res.status };
    return { ok: true, data: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message || 'Erro de rede' };
  }
}
