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
