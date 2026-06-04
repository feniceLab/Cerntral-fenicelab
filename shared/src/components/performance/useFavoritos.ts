// ============================================================
// useFavoritos — hook persistente em localStorage.
// Chave: fenice.perf.favoritos.<slug>
// Guarda array de ad_ids (strings) marcados como favoritos.
// SSR safe.
// ============================================================

import { useCallback, useEffect, useState } from 'react';

const storageKey = (slug: string) => `fenice.perf.favoritos.${slug}`;

function readStorage(slug: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === 'string');
    }
    return [];
  } catch {
    return [];
  }
}

function writeStorage(slug: string, list: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey(slug), JSON.stringify(list));
  } catch {
    // quota / acesso negado — silenciamos pra não quebrar a UI
  }
}

export interface UseFavoritosResult {
  favoritos: string[];
  isFav: (adId: string) => boolean;
  toggleFav: (adId: string) => void;
  clearFavs: () => void;
}

export function useFavoritos(slug: string): UseFavoritosResult {
  const [favoritos, setFavoritos] = useState<string[]>(() => readStorage(slug));

  // Resync quando troca o slug (cliente diferente)
  useEffect(() => {
    setFavoritos(readStorage(slug));
  }, [slug]);

  // Persistir toda mudança
  useEffect(() => {
    writeStorage(slug, favoritos);
  }, [slug, favoritos]);

  const isFav = useCallback(
    (adId: string) => favoritos.includes(adId),
    [favoritos]
  );

  const toggleFav = useCallback((adId: string) => {
    setFavoritos((prev) =>
      prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
    );
  }, []);

  const clearFavs = useCallback(() => {
    setFavoritos([]);
  }, []);

  return { favoritos, isFav, toggleFav, clearFavs };
}
