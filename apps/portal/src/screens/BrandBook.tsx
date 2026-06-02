import { Card, Kicker } from '@fenice/shared';
import { PhoneHeader } from '../components/PhoneHeader';
import { ScreenIcon } from '../lib/ScreenIcon';
import type { PortalRoute } from '../navigation';

// Paleta da marca do CLIENTE (Suprema Pizza) — escura/vermelha,
// deliberadamente distinta da paleta terrosa da Fenice.
const PALETTE: [string, string][] = [
  ['#0F0F0F', 'Carvao'],
  ['#D62828', 'Vermelho'],
  ['#FFEBDC', 'Bege'],
  ['#FFFFFF', 'Branco'],
];

interface BrandBookProps {
  go: (route: PortalRoute) => void;
}

export function BrandBook({ go }: BrandBookProps) {
  return (
    <div>
      <PhoneHeader
        kicker="Sua identidade"
        title="Brand Book"
        right={
          <button type="button" className="fen-pt-iconbtn" onClick={() => go('inicio')} aria-label="Fechar">
            <ScreenIcon name="x" size={20} />
          </button>
        }
      />
      <div className="fen-pt-body">
        {/* logo do cliente */}
        <div className="fen-pt-brand-hero">
          <div className="fen-pt-brand-hero__name">SUPREMA</div>
          <div className="fen-pt-brand-hero__sub">PIZZA</div>
        </div>

        {/* paleta do cliente */}
        <div>
          <Kicker>Paleta</Kicker>
          <div className="fen-pt-swatches">
            {PALETTE.map(([c, n]) => (
              <div key={n} className="fen-pt-swatch">
                <div className="fen-pt-swatch__chip" style={{ background: c }} />
                <div className="fen-pt-swatch__name">{n}</div>
              </div>
            ))}
          </div>
        </div>

        {/* tipografia do cliente */}
        <Card style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div className="fen-pt-type-aa">Aa</div>
          <div>
            <div style={{ font: '700 14px/1.2 var(--fen-font)' }}>Poppins</div>
            <div style={{ font: '400 12px/1.4 var(--fen-font)', color: 'var(--fen-muted)' }}>
              Titulos em caixa-alta · 300 a 800.
            </div>
          </div>
        </Card>

        {/* tom de voz */}
        <Card style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <ScreenIcon name="msg" size={20} color="var(--fen-terra)" />
          <div style={{ font: '400 13px/1.5 var(--fen-font)', color: 'var(--fen-muted)' }}>
            <b style={{ color: 'var(--fen-text)' }}>Tom de voz:</b> conversa que da fome. Gancho na 1a
            linha, punchline na 2a. Sem preco na arte.
          </div>
        </Card>
      </div>
    </div>
  );
}
