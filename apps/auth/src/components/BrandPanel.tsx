import { useEffect, useState } from 'react';
import florUrl from '@fenice/shared/assets/fenice-flor.svg';
import { TESTIMONIALS } from '../mock';

/** Painel de marca (lado esquerdo do split). Depoimentos rotacionam ao vivo. */
export function BrandPanel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const t = TESTIMONIALS[idx];

  return (
    <div className="fen-auth-brand">
      <img className="fen-auth-brand__flor" src={florUrl} alt="" />

      <div className="fen-auth-brand__wm">
        fenice<span className="dot">.</span>
      </div>

      <div className="fen-auth-brand__mid">
        <h1>
          Bem-vindo de volta. Sua marca <em>renasce</em> aqui.
        </h1>
        <p>
          O cockpit único da Fenice: aprove conteúdo, acompanhe métricas e converse com o
          Conselho de IA — tudo num lugar só.
        </p>
      </div>

      <div className="fen-auth-quote">
        <p key={idx} className="fen-auth-view">
          “{t.quote}”
        </p>
        <span>{t.source}</span>
      </div>
    </div>
  );
}
