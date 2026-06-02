import { useState } from 'react';
import { Card, Kicker, Button, ApprovalCard, ApprovalTags } from '@fenice/shared';
import { PhoneHeader } from '../components/PhoneHeader';
import { ScreenIcon } from '../lib/ScreenIcon';
import { photo } from '../lib/assets';
import type { PortalRoute } from '../navigation';

const PENDING = {
  img: photo('40'),
  formato: 'Reel',
  data: 'Qua, 11 jun',
  hora: '18h30',
  legenda:
    'Aquela fome de fim de tarde tem nome... Pepperoni recheada, saindo quentinha do forno. Bora pedir? 🍕',
};

const MOTIVOS = ['Legenda', 'Foto', 'Horario', 'Hashtags', 'Tom'];

type State = 'review' | 'done' | 'alter';

interface AprovacaoProps {
  go: (route: PortalRoute) => void;
}

export function Aprovacao({ go }: AprovacaoProps) {
  const [state, setState] = useState<State>('review');
  const [motivo, setMotivo] = useState('');

  return (
    <div>
      <PhoneHeader
        kicker="Revisao · Reel"
        title="Aprovar post"
        right={
          <button type="button" className="fen-pt-iconbtn" onClick={() => go('inicio')} aria-label="Fechar">
            <ScreenIcon name="x" size={20} />
          </button>
        }
      />
      <div style={{ padding: 18 }}>
        {state === 'review' && (
          <ApprovalCard
            image={PENDING.img}
            tags={<ApprovalTags format={PENDING.formato} ai />}
            datetime={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <ScreenIcon name="calendar" size={14} sw={2} />
                {PENDING.data} · {PENDING.hora}
              </span>
            }
            caption={PENDING.legenda}
            onApprove={() => setState('done')}
            onRequestChange={() => setState('alter')}
          />
        )}

        {state === 'done' && (
          <div className="fen-pt-success">
            <div className="fen-pt-success__ico">
              <ScreenIcon name="check" size={36} color="var(--fen-success)" sw={2.4} />
            </div>
            <div className="fen-pt-success__title">Post aprovado!</div>
            <div className="fen-pt-success__text">
              A equipe Fenice ja foi avisada. Vai pro ar quarta as 18h30.
            </div>
            <Button variant="outline" onClick={() => go('inicio')}>
              Voltar ao inicio
            </Button>
          </div>
        )}

        {state === 'alter' && (
          <div>
            <Card style={{ marginBottom: 14 }}>
              <Kicker>O que ajustar?</Kicker>
              <div className="fen-pt-chips">
                {MOTIVOS.map((t) => (
                  <span
                    key={t}
                    className={`fen-pt-chip${motivo === t ? ' is-on' : ''}`}
                    onClick={() => setMotivo(t)}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <textarea className="fen-pt-textarea" placeholder="Conta pra gente o que mudar..." />
            </Card>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="ghost" style={{ flex: 1 }} onClick={() => setState('review')}>
                Voltar
              </Button>
              <Button variant="primary" icon="check" style={{ flex: 1 }} onClick={() => setState('done')}>
                Enviar pedido
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
