// ============================================================
// Painel · Dashboard AO VIVO por cliente. Numeros sobem via setInterval,
// feed em tempo real, ROAS ~4.3–5.9, espelho do portal do cliente.
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { Card, Avatar, Button, Kicker } from '@fenice/shared';
import { TpIcon, type TpIconName } from '../../lib/icons';
import { StatusDot, LiveNum, HourBar } from '../../components/primitives';
import { brl, brl0, FENICE_FLOR, type Cliente } from '../../lib/data';

interface FeedEv {
  t: string;
  txt: string;
  ic: TpIconName;
  hot?: boolean;
}
interface LiveData {
  gasto: number;
  vendas: number;
  compras: number;
  alcance: number;
  feed: FeedEv[];
}

const INIT: LiveData = {
  gasto: 62.4,
  vendas: 312,
  compras: 8,
  alcance: 9240,
  feed: [
    { t: '18h58', txt: 'Nova compra · R$ 64', ic: 'cart', hot: true },
    { t: '18h55', txt: 'R$ 1,80 investidos', ic: 'dollar' },
    { t: '18h51', txt: '+128 pessoas alcancadas', ic: 'eye' },
  ],
};

const AGORA = 19; // jantar

export function Live({ cliente, voltar }: { cliente: Cliente; voltar: () => void }) {
  const c = cliente;
  const [d, setD] = useState<LiveData>(INIT);
  const [sec, setSec] = useState(0);
  const tickRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current += 1;
      if (tickRef.current < 3) {
        setSec(tickRef.current % 3);
        return;
      }
      tickRef.current = 0;
      setSec(0);
      setD((p) => {
        const dGasto = +(Math.random() * 1.2 + 0.3).toFixed(2);
        const dVenda = Math.round(dGasto * (4.3 + Math.random() * 1.6)); // ROAS ~4.3–5.9
        const compra = Math.random() < 0.4;
        const ordVal = Math.floor(Math.random() * 45 + 28);
        const dAlc = Math.floor(Math.random() * 90 + 30);
        const hh = 18 + Math.floor(Math.random() * 2);
        const mm = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const ev: FeedEv = compra
          ? { t: `${hh}h${mm}`, txt: `Nova compra · R$ ${ordVal}`, ic: 'cart', hot: true }
          : { t: `${hh}h${mm}`, txt: `R$ ${dGasto.toFixed(2)} investidos · +${dAlc} alcance`, ic: 'dollar' };
        return {
          gasto: +(p.gasto + dGasto).toFixed(2),
          vendas: p.vendas + dVenda,
          compras: p.compras + (compra ? 1 : 0),
          alcance: p.alcance + dAlc,
          feed: [ev, ...p.feed].slice(0, 6),
        };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const roas = (d.vendas / d.gasto).toFixed(1);
  const kpis: [string, string, TpIconName, string][] = [
    ['Investido hoje', brl(d.gasto), 'dollar', 'var(--fen-terra)'],
    ['Vendas hoje', brl0(d.vendas), 'cart', 'var(--fen-terra)'],
    ['Compras', String(d.compras), 'check', 'var(--fen-terra)'],
    ['ROAS', roas + '×', 'trend', 'var(--fen-success)'],
  ];
  const camps: { nome: string; janela: [number, number][]; gasto: number }[] = [
    { nome: 'Vendas Delivery · Junho', janela: [[11, 14], [18, 24]], gasto: d.gasto * 0.66 },
    { nome: 'Alcance · Novo Espaco', janela: [[0, 24]], gasto: d.gasto * 0.34 },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* sub-header do cliente */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 28px',
          borderBottom: '1px solid var(--fen-border)',
          background: 'var(--fen-surface)',
        }}
      >
        <div
          onClick={voltar}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            border: '1px solid var(--fen-border)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--fen-caffe)',
            cursor: 'pointer',
            transform: 'scaleX(-1)',
          }}
        >
          <TpIcon name="arrowR" size={18} />
        </div>
        <Avatar letter={c.letter} size={40} />
        <div style={{ flex: 1 }}>
          <div style={{ font: '700 17px/1.1 var(--fen-font)', color: 'var(--fen-caffe)' }}>{c.nome}</div>
          <div style={{ font: '500 12px/1 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 3 }}>
            conta act_4920… · jantar
          </div>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            font: '700 12px/1 var(--fen-font)',
            color: 'var(--fen-success)',
            background: 'var(--fen-success-bg)',
            padding: '8px 13px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ position: 'relative', width: 9, height: 9 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--fen-success)' }} />
            <span
              style={{
                position: 'absolute',
                inset: -4,
                borderRadius: 999,
                border: '2px solid var(--fen-success)',
                opacity: 0.4,
                animation: 'fen-tp-ping 1.6s ease-out infinite',
              }}
            />
          </span>
          AO VIVO · atualizado ha {sec}s
        </span>
        <Button variant="ghost" size="sm">
          <TpIcon name="pause" size={15} sw={2} />
          Pausar tudo
        </Button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', gap: 22 }}>
        {/* COLUNA AGENCIA */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {kpis.map(([l, v, ic, col]) => (
              <Card key={l} pad={15}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--fen-muted)', marginBottom: 9 }}>
                  <TpIcon name={ic} size={15} />
                  <span style={{ font: '600 11px/1 var(--fen-font)' }}>{l}</span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--fen-display)',
                    fontWeight: 900,
                    fontSize: 26,
                    color: col,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <LiveNum k={v}>{v}</LiveNum>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <Kicker>Campanhas ativas agora</Kicker>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
              {camps.map((cp, i) => (
                <div
                  key={cp.nome}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    paddingBottom: i < camps.length - 1 ? 12 : 0,
                    borderBottom: i < camps.length - 1 ? '1px solid var(--fen-border)' : 0,
                  }}
                >
                  <div style={{ width: 200, flexShrink: 0 }}>
                    <div style={{ font: '600 13px/1.2 var(--fen-font)', color: 'var(--fen-caffe)', marginBottom: 6 }}>{cp.nome}</div>
                    <StatusDot on label="No ar" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <HourBar janela={cp.janela} agora={AGORA} live />
                  </div>
                  <div style={{ width: 96, textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ font: '700 16px/1 var(--fen-display)', color: 'var(--fen-terra)' }}>
                      <LiveNum k={cp.gasto.toFixed(0)}>{brl0(cp.gasto)}</LiveNum>
                    </div>
                    <div style={{ font: '500 10px/1 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 4 }}>hoje</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <Kicker>Atividade ao vivo</Kicker>
              <span style={{ font: '600 11px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>Meta · feed em tempo real</span>
            </div>
            <div>
              {d.feed.map((e, i) => (
                <div
                  key={e.t + e.txt + i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 0',
                    borderBottom: i < d.feed.length - 1 ? '1px solid var(--fen-border)' : 0,
                    animation: i === 0 ? 'fen-tp-rise .5s ease-out' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      background: e.hot ? 'var(--fen-flame)' : 'var(--fen-terra-l)',
                      display: 'grid',
                      placeItems: 'center',
                      color: e.hot ? '#fff' : 'var(--fen-terra-d)',
                      flexShrink: 0,
                    }}
                  >
                    <TpIcon name={e.ic} size={15} sw={2} />
                  </div>
                  <span style={{ flex: 1, font: `${e.hot ? 600 : 500} 13px/1.3 var(--fen-font)`, color: 'var(--fen-text)' }}>
                    {e.txt}
                  </span>
                  <span style={{ font: '600 11px/1 var(--fen-mono)', color: 'var(--fen-muted)' }}>{e.t}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* COLUNA ESPELHO — portal do cliente */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--fen-muted)' }}>
            <TpIcon name="eye" size={15} />
            <span style={{ font: '600 12px/1.3 var(--fen-font)' }}>
              O cliente ve isto <b style={{ color: 'var(--fen-terra-d)' }}>agora</b>, no portal
            </span>
          </div>
          {/* moldura de celular */}
          <div style={{ background: 'var(--fen-nero)', borderRadius: 32, padding: 8, boxShadow: 'var(--fen-sh-lg)' }}>
            <div style={{ background: 'var(--fen-avorio)', borderRadius: 26, overflow: 'hidden' }}>
              <div style={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 70, height: 16, background: 'var(--fen-nero)', borderRadius: 12 }} />
              </div>
              <div style={{ padding: '6px 16px 18px' }}>
                <div style={{ font: '700 10px/1 var(--fen-font)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--fen-cotta-d)' }}>
                  {c.nome.split(' ')[0]} · ao vivo
                </div>
                <div style={{ fontFamily: 'var(--fen-display)', fontWeight: 900, fontSize: 22, color: 'var(--fen-caffe)', margin: '6px 0 14px' }}>
                  Trafego pago
                </div>
                {/* hero espelhado */}
                <div style={{ background: 'var(--fen-caffe)', borderRadius: 14, padding: 14, color: 'var(--fen-avorio)', position: 'relative', overflow: 'hidden' }}>
                  <img src={FENICE_FLOR} alt="" style={{ position: 'absolute', right: -30, top: -22, width: 110, opacity: 0.45 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
                    <span style={{ position: 'relative', width: 8, height: 8 }}>
                      <span style={{ position: 'absolute', inset: 0, borderRadius: 999, background: '#7FD17F' }} />
                      <span style={{ position: 'absolute', inset: -3, borderRadius: 999, border: '2px solid #7FD17F', opacity: 0.4, animation: 'fen-tp-ping 1.6s ease-out infinite' }} />
                    </span>
                    <span style={{ font: '700 9px/1 var(--fen-font)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--fen-cotta)' }}>
                      2 campanhas no ar
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 12, position: 'relative' }}>
                    <div>
                      <div style={{ font: '900 19px/1 var(--fen-display)', whiteSpace: 'nowrap' }}>
                        <LiveNum k={d.vendas}>{brl0(d.vendas)}</LiveNum>
                      </div>
                      <div style={{ font: '500 9px/1 var(--fen-font)', color: '#d8cdbd', marginTop: 4 }}>vendas</div>
                    </div>
                    <div>
                      <div style={{ font: '900 19px/1 var(--fen-display)', whiteSpace: 'nowrap' }}>
                        <LiveNum k={d.gasto.toFixed(0)}>{brl0(d.gasto)}</LiveNum>
                      </div>
                      <div style={{ font: '500 9px/1 var(--fen-font)', color: '#d8cdbd', marginTop: 4 }}>investido</div>
                    </div>
                    <div>
                      <div style={{ font: '900 19px/1 var(--fen-display)', color: 'var(--fen-cotta)', whiteSpace: 'nowrap' }}>
                        <LiveNum k={roas}>{roas}×</LiveNum>
                      </div>
                      <div style={{ font: '500 9px/1 var(--fen-font)', color: '#d8cdbd', marginTop: 4 }}>ROAS</div>
                    </div>
                  </div>
                </div>
                {/* ultima atividade espelhada */}
                <div
                  style={{
                    marginTop: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    background: 'var(--fen-surface)',
                    border: '1px solid var(--fen-border)',
                    borderRadius: 12,
                    padding: '10px 12px',
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      background: d.feed[0].hot ? 'var(--fen-flame)' : 'var(--fen-terra-l)',
                      display: 'grid',
                      placeItems: 'center',
                      color: d.feed[0].hot ? '#fff' : 'var(--fen-terra-d)',
                      flexShrink: 0,
                    }}
                  >
                    <TpIcon name={d.feed[0].ic} size={13} sw={2} />
                  </div>
                  <span style={{ flex: 1, font: '500 11px/1.3 var(--fen-font)', color: 'var(--fen-text)' }}>{d.feed[0].txt}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ font: '500 11px/1.5 var(--fen-font)', color: 'var(--fen-muted)', textAlign: 'center', marginTop: 12 }}>
            Mesma fonte de dados · os dois lados
            <br />
            atualizam juntos, sem refresh.
          </div>
        </div>
      </div>
    </div>
  );
}
