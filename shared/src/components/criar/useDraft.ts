// ============================================================
// Hook que salva/carrega rascunho via /api/campaign/draft.
// Auto-save: chama save() a cada mudança de step.
// Persistência local: localStorage como fallback offline.
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import type { DraftCampanha, DraftSaveStatus } from './types';

const LS_KEY = (slug: string, draftId?: string) =>
  `fenice.criar.draft.${slug}.${draftId || 'novo'}`;

interface UseDraftOptions {
  apiBase: string;
  slug: string;
  initialDraftId?: string;
  /** Permite injetar um draft inicial — útil pra carregar de URL/admin. */
  initial?: DraftCampanha;
}

interface UseDraftReturn {
  draft: DraftCampanha;
  setDraft: React.Dispatch<React.SetStateAction<DraftCampanha>>;
  status: DraftSaveStatus;
  save: () => Promise<void>;
  reload: () => Promise<void>;
  submit: () => Promise<{ ok: boolean; error?: string }>;
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function useDraft({ apiBase, slug, initialDraftId, initial }: UseDraftOptions): UseDraftReturn {
  const [draft, setDraft] = useState<DraftCampanha>(() => {
    if (initial) return initial;
    // tenta restaurar do localStorage
    try {
      const raw = localStorage.getItem(LS_KEY(slug, initialDraftId));
      if (raw) return JSON.parse(raw) as DraftCampanha;
    } catch {}
    return { slug, status: 'rascunho' };
  });

  const [status, setStatus] = useState<DraftSaveStatus>({
    saving: false,
    saved_at: null,
    error: null,
  });

  const draftRef = useRef(draft);
  draftRef.current = draft;

  // Sempre persiste localmente
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY(slug, draft.id || initialDraftId), JSON.stringify(draft));
    } catch {}
  }, [draft, slug, initialDraftId]);

  const save = useCallback(async () => {
    setStatus((s) => ({ ...s, saving: true, error: null }));
    try {
      const payload = draftRef.current;
      const resp = await fetchJSON<{ ok: boolean; draft: DraftCampanha }>(
        `${apiBase}/api/campaign/draft`,
        { method: 'POST', body: JSON.stringify(payload) }
      );
      if (resp.draft?.id && !draftRef.current.id) {
        setDraft((d) => ({ ...d, id: resp.draft.id }));
      }
      setStatus({ saving: false, saved_at: new Date(), error: null });
    } catch (err) {
      setStatus({
        saving: false,
        saved_at: null,
        error: (err as Error).message || 'Falha ao salvar',
      });
    }
  }, [apiBase]);

  const reload = useCallback(async () => {
    const id = draftRef.current.id || initialDraftId;
    if (!id) return;
    try {
      const resp = await fetchJSON<{ ok: boolean; draft: DraftCampanha }>(
        `${apiBase}/api/campaign/draft/${id}`
      );
      if (resp.draft) setDraft(resp.draft);
    } catch (err) {
      setStatus((s) => ({ ...s, error: (err as Error).message || 'Falha ao recarregar' }));
    }
  }, [apiBase, initialDraftId]);

  const submit = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    try {
      // salva uma última vez antes de submeter
      await save();
      const payload = { id: draftRef.current.id, slug: draftRef.current.slug };
      await fetchJSON<{ ok: boolean }>(`${apiBase}/api/campaign/submit`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setDraft((d) => ({ ...d, status: 'aguardando_aprovacao' }));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: (err as Error).message || 'Falha ao submeter' };
    }
  }, [apiBase, save]);

  return { draft, setDraft, status, save, reload, submit };
}
