const TRAFEGO_URL =
  ((import.meta as any).env?.VITE_TRAFEGO_URL as string) || 'https://relatorios.fenicelab.com.br';

/** Tráfego Pago — dashboard real (Meta Ads) embutido no painel. */
export function Trafego() {
  return (
    <div style={{ height: 'calc(100vh - 84px)', width: '100%' }}>
      <iframe
        title="Tráfego Pago — Fenice"
        src={TRAFEGO_URL}
        style={{ border: 0, width: '100%', height: '100%', display: 'block', borderRadius: 12, background: '#F3ECE2' }}
        allow="clipboard-read; clipboard-write; fullscreen"
      />
    </div>
  );
}
