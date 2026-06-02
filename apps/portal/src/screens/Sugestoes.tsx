import { Card } from '@fenice/shared';
import { PhoneHeader } from '../components/PhoneHeader';
import { ScreenIcon } from '../lib/ScreenIcon';
import type { PortalRoute } from '../navigation';

const IDEIAS = [
  'Que tal um Reel dos bastidores da cozinha?',
  'Promocao de terca pode virar carrossel.',
  'Depoimento de cliente em video curto.',
];

interface SugestoesProps {
  go: (route: PortalRoute) => void;
}

export function Sugestoes({ go }: SugestoesProps) {
  return (
    <div>
      <PhoneHeader
        kicker="Conselho de IA"
        title="Sugestoes"
        right={
          <button type="button" className="fen-pt-iconbtn" onClick={() => go('inicio')} aria-label="Fechar">
            <ScreenIcon name="x" size={20} />
          </button>
        }
      />
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Card className="fen-pt-sug-hero">
          <div className="fen-pt-sug-hero__ico">
            <ScreenIcon name="sparkles" size={18} color="#fff" />
          </div>
          <div style={{ font: '400 14px/1.55 var(--fen-font)' }}>
            Tem uma ideia pro proximo post? Manda pra gente que o Conselho de IA transforma em criativo.
          </div>
        </Card>

        {IDEIAS.map((s, i) => (
          <Card key={i} className="fen-pt-sug-row">
            <div className="fen-pt-sug-row__text">{s}</div>
            <div style={{ color: 'var(--fen-terra)' }}>
              <ScreenIcon name="plus" size={20} sw={2.2} />
            </div>
          </Card>
        ))}

        <div className="fen-pt-composer">
          <input placeholder="Escreva uma sugestao..." />
          <button type="button" className="fen-pt-composer__send" aria-label="Enviar">
            <ScreenIcon name="arrowR" size={18} sw={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}
