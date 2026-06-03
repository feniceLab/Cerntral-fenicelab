import { useEffect, useState } from 'react';
import { Card, CLIENTES_FENICE, type ClienteFenice } from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';

// Identidade vem do módulo canônico (só Fenice Lab). A API só ENRIQUECE o
// status ao vivo — clientes de outras agências (Starken) nunca aparecem aqui.
const API =
  `${(import.meta as any).env?.VITE_TRAFEGO_URL || 'https://relatorios.fenicelab.com.br'}/api/clients`;

interface ApiCliente {
  slug: string;
  validated?: boolean;
  pending_status?: string | null;
  instagram?: { username?: string } | null;
}

function badge(bg: string, color: string, label: string) {
  return (
    <span className="fen-badge" style={{ background: bg, color }}>
      {label}
    </span>
  );
}

export function Clientes() {
  // status ao vivo por slug (vindo da API). null = ainda não carregou / indisponível.
  const [live, setLive] = useState<Record<string, ApiCliente> | null>(null);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, ApiCliente> = {};
        for (const c of (d.clients ?? []) as ApiCliente[]) map[c.slug] = c;
        setLive(map);
      })
      .catch(() => setLive({})); // sem API: cai no status estático do módulo
  }, []);

  const total = CLIENTES_FENICE.length;

  const isAtivo = (c: ClienteFenice): boolean => {
    const l = live?.[c.slug];
    if (l && typeof l.validated === 'boolean') return l.validated;
    return c.status === 'ativo';
  };

  // cada cliente leva pro PORTAL próprio dele (subdomínio white-label).
  const abrirPortal = (c: ClienteFenice) => {
    if (c.portalUrl) window.open(c.portalUrl, '_blank', 'noopener');
  };

  return (
    <>
      <Topbar kicker={`${total} clientes · Fenice Lab`} title="Clientes" />
      <Scroll>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(248px, 1fr))',
            gap: 14,
          }}
        >
          {CLIENTES_FENICE.map((c) => {
            const igUser = live?.[c.slug]?.instagram?.username ?? c.ig;
            const ig = igUser ? '@' + igUser.replace(/^@/, '') : c.slug;
            const dominio = c.portalUrl ? c.portalUrl.replace(/^https?:\/\//, '') : null;
            const ativo = isAtivo(c);
            const temPortal = Boolean(c.portalUrl);
            return (
              <Card
                key={c.slug}
                onClick={temPortal ? () => abrirPortal(c) : undefined}
                style={temPortal ? { cursor: 'pointer' } : undefined}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <span
                      aria-hidden
                      style={{ width: 9, height: 9, borderRadius: 99, flex: '0 0 auto', background: c.cor }}
                    />
                    <strong style={{ font: '600 15px/1.2 var(--fen-font)' }}>{c.nome}</strong>
                  </span>
                  {badge('rgba(178,58,46,.14)', '#B23A2E', c.agencia)}
                </div>
                <div style={{ font: '500 12px/1.4 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 6 }}>
                  {dominio ?? ig}
                </div>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  {ativo
                    ? badge('var(--fen-success-bg)', '#3c5232', 'Ativo')
                    : badge('var(--fen-warning-bg)', '#7a4520', c.statusLabel)}
                  <span style={{ font: '600 12px/1 var(--fen-font)', color: temPortal ? c.cor : 'var(--fen-muted)' }}>
                    {temPortal ? 'abrir portal →' : 'portal em breve'}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </Scroll>
    </>
  );
}
