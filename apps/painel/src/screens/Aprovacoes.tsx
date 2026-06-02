import { useState } from 'react';
import { Avatar, Button, Card, Tag } from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';
import { PnIcon } from '../components/PnIcon';
import { PnButton } from '../components/PnButton';
import { photo } from '../assets';
import { QUEUE } from '../data';

export function Aprovacoes() {
  const [done, setDone] = useState<number[]>([]);
  const list = QUEUE.map((q, i) => ({ q, i })).filter(({ i }) => !done.includes(i));

  return (
    <>
      <Topbar kicker={`${list.length} aguardando`} title="Fila de aprovações">
        <PnButton variant="ghost" pnIcon="filter" size="sm">
          Filtrar
        </PnButton>
      </Topbar>
      <Scroll>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>
          {list.length === 0 && (
            <Card style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ font: '700 16px/1 var(--fen-display)', color: 'var(--fen-success)' }}>Tudo aprovado ✦</div>
              <div style={{ font: '400 13px/1.5 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 8 }}>
                Nenhum post na fila. Bom trabalho.
              </div>
            </Card>
          )}
          {list.map(({ q, i }) => (
            <Card key={q.cliente + q.quando} pad={0} style={{ overflow: 'hidden', display: 'flex' }}>
              <img src={photo(q.img)} alt="" style={{ width: 180, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ padding: 18, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Avatar letter={q.letter} size={30} />
                  <span style={{ font: '600 14px/1 var(--fen-font)', flex: 1 }}>{q.cliente}</span>
                  <Tag tone="ink">{q.formato}</Tag>
                  <Tag tone="warning">
                    <PnIcon name="clock" size={12} sw={2} /> {q.tempo}
                  </Tag>
                </div>
                <div style={{ font: '400 14px/1.55 var(--fen-font)', color: 'var(--fen-text)' }}>{q.legenda}</div>
                <div style={{ font: '500 12px/1 var(--fen-font)', color: 'var(--fen-muted)', margin: '10px 0 16px' }}>
                  Agendado: {q.quando}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Button variant="primary" icon="check" onClick={() => setDone((p) => [...p, i])}>
                    Aprovar &amp; agendar
                  </Button>
                  <Button variant="soft" icon="edit">
                    Editar
                  </Button>
                  <Button variant="ghost" icon="x">
                    Recusar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Scroll>
    </>
  );
}
