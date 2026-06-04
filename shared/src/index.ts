// ============================================================
// @fenice/shared — Design System Fenice Lab
// Atomos + componentes compostos React + TS.
// Importe os estilos uma vez no app:
//   import '@fenice/shared/styles/tokens.css';
//   import '@fenice/shared/styles/components.css';
// ============================================================

export { Icon, ICON_PATHS } from './components/Icon';
export type { IconName, IconProps } from './components/Icon';

export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';

export { Card } from './components/Card';
export type { CardProps } from './components/Card';

export { Badge, Tag } from './components/Badge';
export type { BadgeProps, BadgeTone, TagProps } from './components/Badge';

export { Field, Input } from './components/Field';
export type { FieldProps, InputProps } from './components/Field';

export { Avatar } from './components/Avatar';
export type { AvatarProps } from './components/Avatar';

export { Kicker } from './components/Kicker';
export type { KickerProps } from './components/Kicker';

export { Toggle } from './components/Toggle';
export type { ToggleProps } from './components/Toggle';

export { StatCard } from './components/StatCard';
export type { StatCardProps } from './components/StatCard';

export { ApprovalCard, ApprovalTags } from './components/ApprovalCard';
export type { ApprovalCardProps } from './components/ApprovalCard';

// Tokens da marca (objeto JSON) — disponivel para uso programatico.
export { default as tokens } from './tokens.json';

export * from './lib/supabase';

// Clientes Fenice Lab — fonte da verdade (identidade canônica).
export {
  CLIENTES_FENICE,
  SLUGS_FENICE,
  AGENCIA,
  clienteBySlug,
  reportPath,
  hubPath,
} from './clientes/fenice';
export type { ClienteFenice, ClienteStatus } from './clientes/fenice';
export { CLIENTE_THEMES, themeBySlug, themeFromCor } from './clientes/themes';
export type { ClienteTheme } from './clientes/themes';

// Performance war room — dashboard reusável (portal cliente + painel admin).
export * from './components/performance';

// Tráfego pago — fórmulas Pedro Sobral + Hormozi (delivery BR).
export {
  computeSobral,
  detectarAlertas,
  margemDoCliente,
  nivelRoas,
  nivelFreq,
  nivelCpaPct,
  MARGEM_POR_SLUG,
} from './trafego';
export type {
  Nivel,
  Decisao,
  MetricasSobral,
  ComputeInput,
  AlertaSeveridade,
  Alerta,
  AlertaInput,
} from './trafego';

// Criar campanha — Templates Sobral por vertical + tooltips PT-BR
// (consumido pelo wizard em central.fenicelab/criar).
export {
  TEMPLATES_SOBRAL,
  VERTICAL_KEYS,
  TOOLTIPS_GERAL,
  pickTemplate,
  getTooltips,
  validateBudget,
  suggestDuration,
} from './components/criar/templates';
export type {
  VerticalKey,
  ObjetivoMeta,
  OptimizationGoal,
  CTAType,
  AudienceSpec,
  CreativeSpec,
  SobralTooltips,
  TemplateSobral,
} from './components/criar/templates';

// Wizard "Criar campanha" — shell + steps + hooks + utils.
export {
  Wizard,
  WizardShell,
  ProgressBar as CriarProgressBar,
  EstimativaCard,
  GuardrailToast,
  Tooltip as CriarTooltip,
  CreativeUpload,
  useDraft,
  useEstimativa,
  validateStep,
  getValidSteps,
  TOOLTIPS as CRIAR_TOOLTIPS,
  tip,
  STEP_ORDER,
  STEP_LABELS,
  OBJETIVOS,
} from './components/criar';
export type {
  WizardProps,
  WizardShellProps,
  WizardStepKey,
  ObjetivoKey,
  ObjetivoOption,
  Genero,
  CriativoUpload,
  DraftCampanha,
  EstimativaResposta,
  ValidacaoResultado,
  DraftSaveStatus,
} from './components/criar';
// ci: re-trigger deploy (rebuild esbuild + steps build/rsync separados)
