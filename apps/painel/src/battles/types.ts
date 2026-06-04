// ============================================================
// Battles — tipos compartilhados pelo módulo.
// Espelha o contrato da API de battles (em construção pelo backend).
// ============================================================

export type BattleStatus = 'ativo' | 'finalizado' | 'cancelado';

export type BattleCriterio = 'roas' | 'cpa' | 'compras' | 'ctr';

export type BattleEstrategia = 'auto_kill' | 'manual' | 'auto_scale';

export interface BattleCampaign {
  campaign_id: string;
  name: string;
  /** Métrica acumulada no battle conforme `criterio`. */
  metric_value: number | null;
  spend_cents: number | null;
  status: 'ativa' | 'pausada' | 'vencedora' | null;
}

/** Resumo retornado por `GET /api/battle/list`. */
export interface BattleSummary {
  id: string;
  slug: string;
  cliente_nome?: string | null;
  nome: string;
  status: BattleStatus;
  criterio: BattleCriterio;
  estrategia: BattleEstrategia;
  budget_total_cents: number;
  spend_total_cents: number;
  /** ISO. */
  created_at: string;
  /** ISO. Quando finalizado/cancelado. */
  ended_at?: string | null;
  /** ISO. Próxima avaliação automática (auto_kill / auto_scale). */
  next_eval_at?: string | null;
  campaigns_count: number;
  /** Quando finalizado, métrica curta da vencedora — pra tabela "Finalizados". */
  vencedora?: {
    campaign_id: string;
    name: string;
    metric_value: number | null;
  } | null;
}

/** Detalhe completo retornado por `GET /api/battle/:id`. */
export interface BattleDetail extends BattleSummary {
  campaigns: BattleCampaign[];
  /** Tendência de gasto por campanha, pontos `[timestamp, spend_cents]`. */
  trend?: Array<{
    campaign_id: string;
    name: string;
    points: Array<{ t: string; spend_cents: number }>;
  }>;
}

/** Item retornado por `GET /api/campaigns?slug=X` (já existe). */
export interface CampaignListItem {
  campaign_id: string;
  name: string;
  status: string | null;
  effective_status: string | null;
  daily_budget_cents: number | null;
  /** flag computada se já está em algum battle ativo. */
  in_active_battle?: boolean;
}

/** Payload de criação de battle (POST /api/battle/create). */
export interface CreateBattlePayload {
  slug: string;
  nome: string;
  budget_total_cents: number;
  criterio: BattleCriterio;
  estrategia: BattleEstrategia;
  campaign_ids: string[];
  actor_email: string | null;
  actor_auth_id: string | null;
}

/** Payload de decisão manual (POST /api/battle/:id/decidir). */
export interface DecidirBattlePayload {
  vencedora_campaign_id: string;
  manter_pausadas: boolean;
  actor_email: string | null;
}
