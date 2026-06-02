import type { ReactNode } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

export interface ApprovalCardProps {
  /** URL da imagem do criativo. */
  image: string;
  imageAlt?: string;
  /** Tags exibidas sobre/abaixo do criativo (formato, IA, etc.). */
  tags?: ReactNode;
  /** Data e hora agendada da publicacao. */
  datetime?: ReactNode;
  /** Legenda/copy do post. */
  caption?: ReactNode;
  /** Layout: 'vertical' (Portal mobile) ou 'horizontal' (Painel). */
  orientation?: 'vertical' | 'horizontal';
  onApprove?: () => void;
  onRequestChange?: () => void;
  approveLabel?: string;
  requestChangeLabel?: string;
  loading?: boolean;
}

export function ApprovalCard({
  image,
  imageAlt = 'Criativo para aprovacao',
  tags,
  datetime,
  caption,
  orientation = 'vertical',
  onApprove,
  onRequestChange,
  approveLabel = 'Aprovar',
  requestChangeLabel = 'Pedir alteracao',
  loading = false,
}: ApprovalCardProps) {
  return (
    <Card className={`fen-approval fen-approval--${orientation}`} pad={0}>
      <div className="fen-approval__media">
        <img className="fen-approval__img" src={image} alt={imageAlt} />
      </div>
      <div className="fen-approval__body">
        {tags && <div className="fen-approval__tags">{tags}</div>}
        {datetime && <div className="fen-approval__datetime">{datetime}</div>}
        {caption && <p className="fen-approval__caption">{caption}</p>}
        <div className="fen-approval__actions">
          <Button variant="primary" icon="check" onClick={onApprove} loading={loading}>
            {approveLabel}
          </Button>
          <Button variant="outline" icon="edit" onClick={onRequestChange} disabled={loading}>
            {requestChangeLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}

/** Conveniencia: tags padrao usadas no ApprovalCard. */
export function ApprovalTags({ format, ai }: { format?: string; ai?: boolean }) {
  return (
    <>
      {format && <Badge tone="outline">{format}</Badge>}
      {ai && <Badge tone="ink">IA</Badge>}
    </>
  );
}
