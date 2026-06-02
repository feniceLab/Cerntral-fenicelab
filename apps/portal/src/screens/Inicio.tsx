import { Card, Kicker, Badge, type BadgeTone } from '@fenice/shared';
import { PhoneHeader } from '../components/PhoneHeader';
import { StatPill } from '../components/StatPill';
import { ScreenIcon, type ScreenIconName } from '../lib/ScreenIcon';
import { photo, florFenice } from '../lib/assets';
import type { PortalRoute } from '../navigation';

interface FeedItem {
  img: string;
  formato: string;
  dia: string;
  status: 'pendente' | 'aprovado' | 'rascunho';
}

const FEED: FeedItem[] = [
  { img: photo('40'), formato: 'Reel', dia: 'Qua 11', status: 'pendente' },
  { img: photo('01'), formato: 'Foto', dia: 'Sex 13', status: 'aprovado' },
  { img: photo('50'), formato: 'Carrossel', dia: 'Seg 16', status: 'rascunho' },
];

const STATUS_TONE: Record<FeedItem['status'], [string, BadgeTone]> = {
  pendente: ['Pendente', 'warning'],
  aprovado: ['Aprovado', 'success'],
  rascunho: ['Rascunho', 'outline'],
};

interface InicioProps {
  go: (route: PortalRoute) => void;
}

export function Inicio({ go }: InicioProps) {
  return (
    <div>
      <PhoneHeader
        kicker="Suprema Pizza"
        title="Bom dia, Dani"
        right={
          <div style={{ position: 'relative' }}>
            <div className="fen-pt-iconbtn">
              <ScreenIcon name="bell" size={20} />
            </div>
            <div className="fen-pt-bell-dot" />
          </div>
        }
      />
      <div className="fen-pt-body">
        {/* Hero — post aguardando aprovacao */}
        <div className="fen-pt-hero fen-pt-hero--click" onClick={() => go('aprovacao')}>
          <img src={florFenice} alt="" className="fen-pt-hero__flor" />
          <Kicker style={{ color: 'var(--fen-cotta)' }}>Aguardando voce</Kicker>
          <div className="fen-pt-hero__title">1 post para aprovar</div>
          <div className="fen-pt-hero__sub">Reel de quarta as 18h30. Aprove em 1 toque.</div>
          <div className="fen-pt-hero__cta">
            Revisar agora <ScreenIcon name="arrowR" size={16} sw={2.2} />
          </div>
        </div>

        {/* Metricas vs Marco Zero */}
        <div>
          <div className="fen-pt-section-head">
            <Kicker>Seu mes · vs Marco Zero</Kicker>
            <span className="fen-pt-link" onClick={() => go('relatorios')}>
              Ver tudo
            </span>
          </div>
          <div className="fen-pt-row-gap">
            <StatPill valor="312" label="Seguidores" delta="+31%" />
            <StatPill valor="6,1%" label="Engajamento" delta="+157%" />
            <StatPill valor="12" label="Posts no mes" delta="+9" />
          </div>
        </div>

        {/* Atalhos */}
        <div className="fen-pt-row-gap">
          <ShortcutCard icon="palette" label="Brand Book" onClick={() => go('brand')} />
          <ShortcutCard icon="upload" label="Enviar material" onClick={() => go('galeria')} />
        </div>

        {/* Proximos posts */}
        <div>
          <Kicker>Proximos no cronograma</Kicker>
          <div className="fen-pt-col-gap" style={{ marginTop: 10 }}>
            {FEED.map((p, i) => (
              <FeedRow key={i} item={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShortcutCard({ icon, label, onClick }: { icon: ScreenIconName; label: string; onClick: () => void }) {
  return (
    <Card className="fen-pt-shortcut" pad={14} onClick={onClick}>
      <div className="fen-pt-shortcut__ico">
        <ScreenIcon name={icon} size={19} />
      </div>
      <span className="fen-pt-shortcut__label">{label}</span>
    </Card>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  const [label, tone] = STATUS_TONE[item.status];
  return (
    <Card className="fen-pt-feed" pad={10}>
      <img className="fen-pt-feed__thumb" src={item.img} alt="" />
      <div style={{ flex: 1 }}>
        <div className="fen-pt-feed__title">{item.formato}</div>
        <div className="fen-pt-feed__meta">{item.dia} · jun</div>
      </div>
      <Badge tone={tone}>{label}</Badge>
    </Card>
  );
}
