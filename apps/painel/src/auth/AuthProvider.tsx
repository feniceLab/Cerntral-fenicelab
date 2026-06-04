import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@fenice/shared';

export type FeniceRole = 'admin_fenice' | 'cliente';

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  email: string | null;
  role: FeniceRole | null;
  clienteSlug: string | null;
  nomeExibicao: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface UsuarioRow {
  role?: string | null;
  papel?: string | null;
  cliente_slug?: string | null;
  nome_exibicao?: string | null;
}

const normalizeRole = (raw: string | null | undefined): FeniceRole | null => {
  if (!raw) return null;
  const v = raw.toLowerCase().trim();
  if (v === 'admin_fenice' || v === 'admin' || v === 'agencia' || v === 'fenice') return 'admin_fenice';
  if (v === 'cliente' || v === 'client') return 'cliente';
  return null;
};

async function fetchProfile(userId: string): Promise<{
  role: FeniceRole | null;
  clienteSlug: string | null;
  nomeExibicao: string | null;
}> {
  try {
    const { data } = await supabase
      .from('usuarios')
      .select('role, papel, cliente_slug, nome_exibicao')
      .eq('auth_id', userId)
      .maybeSingle();
    const row = (data ?? null) as UsuarioRow | null;
    const role = normalizeRole(row?.role ?? row?.papel ?? null);
    return {
      role,
      clienteSlug: row?.cliente_slug ?? null,
      nomeExibicao: row?.nome_exibicao ?? null,
    };
  } catch {
    return { role: null, clienteSlug: null, nomeExibicao: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<FeniceRole | null>(null);
  const [clienteSlug, setClienteSlug] = useState<string | null>(null);
  const [nomeExibicao, setNomeExibicao] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async (s: Session | null) => {
      if (!s?.user) {
        if (mounted) {
          setRole(null);
          setClienteSlug(null);
          setNomeExibicao(null);
        }
        return;
      }
      const profile = await fetchProfile(s.user.id);
      if (!mounted) return;
      setRole(profile.role);
      setClienteSlug(profile.clienteSlug);
      setNomeExibicao(profile.nomeExibicao);
    };

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      await loadProfile(data.session ?? null);
      if (mounted) setLoading(false);
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
      if (!mounted) return;
      setSession(s);
      await loadProfile(s);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return {};
    } catch (e: any) {
      return { error: e?.message || 'Erro inesperado ao entrar' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    email: session?.user?.email ?? null,
    role,
    clienteSlug,
    nomeExibicao,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
