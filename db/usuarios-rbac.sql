-- ============================================================
-- usuarios-rbac.sql
-- RBAC pra Auth Supabase no Painel Fenice Lab.
-- ATENÇÃO: NÃO rodar automático. Adelia revisa e roda manualmente
-- no SQL Editor do Supabase (projeto dfwcselivuwtacsirnbo).
--
-- Decisão Adelia:
--   - admin_fenice → vê tudo + pode tudo (pause + escalate)
--   - cliente      → vê só o próprio + pode pausar, NÃO escalar
-- ============================================================

-- 1) Garantir colunas necessárias em `public.usuarios`.
--    Se a tabela já tem `papel`, deixar role como alias/nova fonte de verdade.
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'cliente',
  ADD COLUMN IF NOT EXISTS cliente_slug text,
  ADD COLUMN IF NOT EXISTS nome_exibicao text;

-- 2) Restringir valores de role.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_role_check'
  ) THEN
    ALTER TABLE public.usuarios
      ADD CONSTRAINT usuarios_role_check
      CHECK (role IN ('admin_fenice', 'cliente'));
  END IF;
END $$;

-- 3) (Opcional) Backfill: se a tabela tinha `papel`, copia pra role.
--    Descomente se for o caso.
-- UPDATE public.usuarios
--   SET role = CASE
--     WHEN papel ILIKE 'admin%' OR papel ILIKE 'agencia%' THEN 'admin_fenice'
--     ELSE 'cliente'
--   END
--   WHERE role IS NULL OR role = 'cliente';

-- 4) Index pra lookup rápido por auth_id.
CREATE INDEX IF NOT EXISTS idx_usuarios_auth_id ON public.usuarios(auth_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_cliente_slug ON public.usuarios(cliente_slug);

-- 5) RLS — habilitar.
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 5a) Cliente lê só o próprio registro.
DROP POLICY IF EXISTS usuarios_self_select ON public.usuarios;
CREATE POLICY usuarios_self_select
  ON public.usuarios
  FOR SELECT
  USING (auth_id = auth.uid());

-- 5b) Admin Fenice lê tudo.
--     Usa EXISTS pra evitar recursão de policy.
DROP POLICY IF EXISTS usuarios_admin_select_all ON public.usuarios;
CREATE POLICY usuarios_admin_select_all
  ON public.usuarios
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u2
      WHERE u2.auth_id = auth.uid() AND u2.role = 'admin_fenice'
    )
  );

-- 5c) Admin Fenice gerencia (insert/update/delete) qualquer registro.
DROP POLICY IF EXISTS usuarios_admin_manage ON public.usuarios;
CREATE POLICY usuarios_admin_manage
  ON public.usuarios
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u2
      WHERE u2.auth_id = auth.uid() AND u2.role = 'admin_fenice'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios u2
      WHERE u2.auth_id = auth.uid() AND u2.role = 'admin_fenice'
    )
  );

-- ============================================================
-- Próximos passos manuais (Supabase Auth → Users):
--   1. Criar user admin (ex: contato@fenicelab.com.br).
--      INSERT INTO usuarios (auth_id, role, nome_exibicao)
--      VALUES ('<uuid-do-auth>', 'admin_fenice', 'Adelia');
--
--   2. Criar user cliente (ex: arena@exemplo.com).
--      INSERT INTO usuarios (auth_id, role, cliente_slug, nome_exibicao)
--      VALUES ('<uuid-do-auth>', 'cliente', 'arena', 'Arena Gourmet');
--
--   3. RBAC do backend (services/relatorios) deve ainda validar canEscalate
--      server-side antes de aceitar budget_up/budget_down — não confiar só no front.
-- ============================================================
