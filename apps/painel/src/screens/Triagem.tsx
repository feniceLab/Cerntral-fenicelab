import { Avatar, Button, Card, Tag } from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';
import { photo } from '../assets';
import { TRIAGE } from '../data';

export function Triagem() {
  return (
    <>
      <Topbar kicker="Uploads dos clientes" title="Triagem">
        <Tag tone="terra">Invisível ao cliente</Tag>
      </Topbar>
      <Scroll>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {TRIAGE.map((t) => (
            <Card key={t.cliente + t.arq} pad={0} style={{ overflow: 'hidden' }}>
              <img src={photo(t.img)} alt="" style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Avatar letter={t.letter} size={26} />
                  <span style={{ font: '600 13px/1 var(--fen-font)', flex: 1 }}>{t.cliente}</span>
                  <span style={{ font: '500 11px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>{t.quando}</span>
                </div>
                <div style={{ font: '500 12px/1 var(--fen-mono)', color: 'var(--fen-terra-d)', marginBottom: t.nota ? 7 : 0 }}>
                  {t.arq}
                </div>
                {t.nota && (
                  <div style={{ font: '400 13px/1.45 var(--fen-font)', color: 'var(--fen-muted)' }}>“{t.nota}”</div>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <Button variant="soft" size="sm" icon="check">
                    Aproveitar
                  </Button>
                  <Button variant="ghost" size="sm">
                    Arquivar
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
