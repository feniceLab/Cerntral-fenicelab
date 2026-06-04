import { useEffect, useState } from 'react';
import { Card, CLIENTES_FENICE, type ClienteFenice } from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';
import { ClienteAvatar } from '../components/ClienteAvatar';

// Identidade vem do módulo canônico (só Fenice Lab). A API só ENRIQUECE o
// status ao vivo — clientes de outras agências (Starken) nunca aparecem aqui.
// same-domain por padrão (OpenResty proxy /api → serviço). Dev: VITE_TRAFEGO_URL no .env.local.
const API = `${(import.meta as any).env?.VITE_TRAFEGO_URL || ''}/api/clients`;

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

export interface ClientesProps {
  /** abre o portal do cliente EMBUTIDO na central (sem nova guia). */
  onOpen: (c: ClienteFenice) => void;
}

export function Clientes({ onOpen }: ClientesProps) {
  const [live, setLive] = useState<Record<string, ApiCliente> | null>(null);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, ApiCliente> = {};
        for (const c of (d.clients ?? []) as ApiCliente[]) map[c.slug] = c;
        setLive(map);
      })
      .catch(() => setLive({}));
  }, []);

  const total = CLIENTES_FENICE.length;
  const isAtivo = (c: ClienteFenice): boolean => {
    const l = live?.[c.slug];
    if (l && typeof l.validated === 'boolean') return l.validated;
    return c.status === 'ativo';
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
            const ativo = isAtivo(c);
            return (
              <Card key={c.slug} onClick={() => onOpen(c)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <ClienteAvatar c={c} size={44} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <strong style={{ font: '900 16px/1.15 var(--fen-display)', color: 'var(--fen-caffe)', letterSpacing: '-0.01em' }}>
                        {c.nome}
                      </strong>
                      {badge('var(--fen-terra-l)', 'var(--fen-terra-d)', c.agencia)}
                    </div>
                    <div style={{ font: '500 12px/1.4 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 4 }}>
                      {ig}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  {ativo
                    ? badge('var(--fen-success-bg)', 'var(--fen-success)', 'Ativo')
                    : badge('var(--fen-warning-bg)', 'var(--fen-cotta-d)', c.statusLabel)}
                  <span style={{ font: '600 12px/1 var(--fen-font)', color: 'var(--fen-terra)' }}>abrir portal →</span>
                </div>
              </Card>
            );
          })}
        </div>
      </Scroll>
    </>
  );
}
