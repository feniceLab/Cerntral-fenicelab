// ============================================================
// Painel · Criar campanha — wizard de 4 passos
// (Objetivo → Conjunto c/ publico + dayparting → Anuncio c/ preview → Revisar).
// ============================================================
import { Fragment, useState, type ReactNode } from 'react';
import { Card, Button, Field } from '@fenice/shared';
import { TpIcon, type TpIconName } from '../../lib/icons';
import { photo } from '../../lib/data';
import type { PainelTab } from '../../lib/nav';

const STEPS = ['Objetivo', 'Conjunto', 'Anuncio', 'Revisar'];

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        font: '700 11px/1 var(--fen-font)',
        letterSpacing: '.04em',
        textTransform: 'uppercase',
        color: 'var(--fen-muted)',
        marginBottom: 9,
      }}
    >
      {children}
    </div>
  );
}

function Chip({ children, on }: { children: ReactNode; on?: boolean }) {
  return (
    <span
      style={{
        font: '600 13px/1 var(--fen-font)',
        padding: '9px 13px',
        borderRadius: 999,
        cursor: 'pointer',
        background: on ? 'var(--fen-terra)' : 'var(--fen-surface)',
        color: on ? '#fff' : 'var(--fen-text)',
        border: '1px solid ' + (on ? 'var(--fen-terra)' : 'var(--fen-border)'),
      }}
    >
      {children}
    </span>
  );
}

const OBJETIVOS: [TpIconName, string, string, boolean][] = [
  ['cart', 'Vendas', 'Compras no delivery', true],
  ['users', 'Trafego', 'Visitas ao cardapio', false],
  ['eye', 'Alcance', 'Mostrar pra mais gente', false],
  ['msg', 'Mensagens', 'Conversas no WhatsApp', false],
];

const REVISAO: [string, string][] = [
  ['Objetivo', 'Vendas (compras no delivery)'],
  ['Campanha', 'Vendas Delivery · Julho'],
  ['Orcamento', 'R$ 30,00/dia'],
  ['Publico', 'Blumenau +5km · 25–45 · Pizza, Delivery'],
  ['Agenda', 'Almoco 11–14h e jantar 18–23h'],
  ['Criativo', 'Reel — Pepperoni recheada · CTA Pedir agora'],
];

export function Criar({ go }: { go: (t: PainelTab) => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="fen-tp-scroll">
        <div style={{ maxWidth: 480, margin: '60px auto 0', textAlign: 'center' }}>
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: 999,
              background: 'var(--fen-success-bg)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 22px',
            }}
          >
            <TpIcon name="rocket" size={42} color="var(--fen-success)" sw={2} />
          </div>
          <div style={{ fontFamily: 'var(--fen-display)', fontWeight: 900, fontSize: 30, color: 'var(--fen-caffe)' }}>
            Campanha no ar! 🔥
          </div>
          <p style={{ font: '400 15px/1.55 var(--fen-font)', color: 'var(--fen-muted)', maxWidth: 360, margin: '12px auto 26px' }}>
            "Vendas Delivery · Julho" foi publicada na Meta. Os primeiros dados aparecem em ~15 min e o cliente ja ve no
            portal dele.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button variant="primary" onClick={() => go('campanhas')}>
              Ver campanhas
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setDone(false);
                setStep(0);
              }}
            >
              Criar outra
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* progresso */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '20px 28px 0', maxWidth: 760 }}>
        {STEPS.map((s, i) => (
          <Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: i <= step ? 'var(--fen-flame)' : 'var(--fen-surface-2)',
                  border: i <= step ? 0 : '1.5px solid var(--fen-border)',
                  color: i <= step ? '#fff' : 'var(--fen-muted)',
                  display: 'grid',
                  placeItems: 'center',
                  font: '700 12px/1 var(--fen-font)',
                }}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span
                style={{
                  font: `${i === step ? 700 : 500} 13px/1 var(--fen-font)`,
                  color: i === step ? 'var(--fen-terra-d)' : 'var(--fen-muted)',
                }}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < step ? 'var(--fen-cotta)' : 'var(--fen-border)', margin: '0 12px' }} />
            )}
          </Fragment>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        <div style={{ maxWidth: 760 }}>
          {step === 0 && (
            <>
              <FieldLabel>Objetivo da campanha</FieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 22 }}>
                {OBJETIVOS.map(([ic, t, d, on]) => (
                  <div
                    key={t}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 13,
                      padding: 16,
                      border: '1.5px solid ' + (on ? 'var(--fen-terra)' : 'var(--fen-border)'),
                      borderRadius: 'var(--fen-r-lg)',
                      background: on ? 'var(--fen-terra-l)' : 'var(--fen-surface)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 11,
                        background: on ? 'var(--fen-flame)' : 'var(--fen-surface-2)',
                        display: 'grid',
                        placeItems: 'center',
                        color: on ? '#fff' : 'var(--fen-muted)',
                      }}
                    >
                      <TpIcon name={ic} size={20} />
                    </div>
                    <div>
                      <div style={{ font: '700 15px/1.2 var(--fen-font)', color: 'var(--fen-caffe)' }}>{t}</div>
                      <div style={{ font: '500 12px/1.3 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 3 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <Field label="Nome da campanha" defaultValue="Vendas Delivery · Julho" />
                <div>
                  <FieldLabel>Orcamento</FieldLabel>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <Field defaultValue="30,00" />
                    </div>
                    <Chip on>Diario</Chip>
                    <Chip>Vitalicio</Chip>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <FieldLabel>Localizacao</FieldLabel>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <Field defaultValue="Blumenau, SC" />
                </div>
                <Chip on>+5 km</Chip>
                <Chip>+10 km</Chip>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
                <div>
                  <FieldLabel>Idade</FieldLabel>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Field defaultValue="25" />
                    <span style={{ color: 'var(--fen-muted)' }}>—</span>
                    <Field defaultValue="45" />
                  </div>
                </div>
                <Field label="Orcamento do conjunto" defaultValue="18,00 /dia" />
              </div>
              <FieldLabel>Interesses</FieldLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
                {['Pizza', 'Delivery de comida', 'Gastronomia', 'iFood', 'Sair pra jantar'].map((t, i) => (
                  <Chip key={t} on={i < 3}>
                    {t}
                  </Chip>
                ))}
                <Chip>+ adicionar</Chip>
              </div>
              <FieldLabel>Agenda · horarios de exibicao (dayparting)</FieldLabel>
              <Card pad={14}>
                <div style={{ display: 'grid', gridTemplateColumns: '46px repeat(24,1fr)', gap: 2, alignItems: 'center' }}>
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((d) => (
                    <Fragment key={d}>
                      <span style={{ font: '600 11px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>{d}</span>
                      {Array.from({ length: 24 }).map((_, h) => {
                        const on = (h >= 11 && h <= 14) || (h >= 18 && h <= 23);
                        return (
                          <div
                            key={h}
                            style={{
                              height: 16,
                              borderRadius: 3,
                              background: on ? 'var(--fen-cotta)' : 'var(--fen-surface-2)',
                              border: '1px solid var(--fen-border)',
                            }}
                          />
                        );
                      })}
                    </Fragment>
                  ))}
                  <span />
                  {[0, 6, 12, 18].map((h) => (
                    <span
                      key={h}
                      style={{ gridColumn: 'span 6', font: '500 9px/1 var(--fen-mono)', color: 'var(--fen-muted)', marginTop: 4 }}
                    >
                      {h}h
                    </span>
                  ))}
                </div>
                <div style={{ font: '500 12px/1 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 12 }}>
                  Ativo nos horarios de almoco (11–14h) e jantar (18–23h) — quando a fome bate.
                </div>
              </Card>
            </>
          )}

          {step === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 26 }}>
              <div>
                <FieldLabel>Criativo · da galeria do cliente</FieldLabel>
                <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
                  {['40', '50', '01', '60'].map((n, i) => (
                    <img
                      key={n}
                      src={photo(n)}
                      alt=""
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 10,
                        objectFit: 'cover',
                        border: i === 0 ? '2.5px solid var(--fen-terra)' : '2.5px solid transparent',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 10,
                      border: '1.5px dashed var(--fen-border)',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--fen-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <TpIcon name="plus" size={20} />
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <Field label="Titulo" defaultValue="Pepperoni recheada, quentinha 🍕" />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <FieldLabel>Texto principal</FieldLabel>
                  <textarea
                    className="fen-tp-textarea"
                    defaultValue="Aquela fome de fim de tarde tem nome. Peca agora e receba quentinho em casa."
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <Field label="Botao (CTA)" defaultValue="Pedir agora" />
                  <Field label="Destino" defaultValue="wa.me/55479…" />
                </div>
              </div>

              {/* preview */}
              <div>
                <FieldLabel>Previa · Feed</FieldLabel>
                <div
                  style={{
                    border: '1px solid var(--fen-border)',
                    borderRadius: 'var(--fen-r-lg)',
                    overflow: 'hidden',
                    background: 'var(--fen-surface)',
                    boxShadow: 'var(--fen-sh-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--fen-flame)' }} />
                    <div>
                      <div style={{ font: '700 12px/1 var(--fen-font)' }}>Suprema Pizza</div>
                      <div style={{ font: '500 10px/1 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 2 }}>Patrocinado</div>
                    </div>
                  </div>
                  <div style={{ font: '500 12.5px/1.4 var(--fen-font)', padding: '0 10px 8px' }}>
                    Aquela fome de fim de tarde tem nome. 🍕
                  </div>
                  <img src={photo('40')} alt="" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 10,
                      background: 'var(--fen-surface-2)',
                    }}
                  >
                    <span style={{ font: '600 12px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>supremapizza.com.br</span>
                    <span
                      style={{
                        font: '700 12px/1 var(--fen-font)',
                        background: 'var(--fen-caffe)',
                        color: '#fff',
                        padding: '7px 11px',
                        borderRadius: 7,
                      }}
                    >
                      Pedir agora
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <>
              <FieldLabel>Revisao final</FieldLabel>
              <Card style={{ marginBottom: 16 }}>
                {REVISAO.map(([l, v], i, arr) => (
                  <div
                    key={l}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 20,
                      padding: '11px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--fen-border)' : 0,
                    }}
                  >
                    <span style={{ font: '600 13px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>{l}</span>
                    <span style={{ font: '600 13px/1.3 var(--fen-font)', color: 'var(--fen-text)', textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </Card>
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  background: 'var(--fen-terra-l)',
                  borderRadius: 'var(--fen-r-md)',
                  padding: '13px 15px',
                }}
              >
                <TpIcon name="rocket" size={18} color="var(--fen-terra-d)" />
                <span style={{ font: '500 13px/1.5 var(--fen-font)', color: 'var(--fen-terra-d)' }}>
                  Ao publicar, a campanha e criada na Meta (Marketing API) e entra em analise — costuma liberar em minutos.
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* footer nav */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 28px',
          borderTop: '1px solid var(--fen-border)',
          background: 'var(--fen-surface)',
        }}
      >
        <Button variant="ghost" onClick={() => (step === 0 ? go('campanhas') : setStep(step - 1))}>
          {step === 0 ? 'Cancelar' : 'Voltar'}
        </Button>
        {step < 3 ? (
          <Button variant="primary" onClick={() => setStep(step + 1)}>
            Proximo
            <TpIcon name="arrowR" size={16} sw={2} />
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setDone(true)}>
            <TpIcon name="rocket" size={16} sw={2} />
            Subir campanha
          </Button>
        )}
      </div>
    </div>
  );
}
