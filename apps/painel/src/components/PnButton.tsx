import { Button, type ButtonProps } from '@fenice/shared';
import { PnIcon, type PnIconName } from './PnIcon';

export interface PnButtonProps extends Omit<ButtonProps, 'icon'> {
  /** Icone do set local (PnIcon) — cobre nomes que a shared Icon nao tem (plus, filter...). */
  pnIcon?: PnIconName;
}

// Botao da shared com um icone do set local renderizado como filho.
// Mantem o gap/estilo do .fen-btn (que ja espaca o primeiro filho).
export function PnButton({ pnIcon, size = 'md', children, ...rest }: PnButtonProps) {
  return (
    <Button size={size} {...rest}>
      {pnIcon && <PnIcon name={pnIcon} size={size === 'sm' ? 15 : 17} sw={2} />}
      {children}
    </Button>
  );
}
