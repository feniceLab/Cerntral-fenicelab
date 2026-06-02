import { useEffect, useState } from 'react';
import { Card } from '@fenice/shared';
import { Topbar, Scroll } from '../components/Chrome';

const API =
  `${(import.meta as any).env?.VITE_TRAFEGO_URL || 'https://relatorios.fenicelab.com.br'}/api/clients`;

interface ApiCliente {
  name: string;
  slug: string;
  agencia?: string;
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
  const [clients, setClients] = useState<ApiCliente[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((d) => setClients(d.clients ?? []))
      .catch((e) => setErro(String(e)));
  }, []);

  const total = clients?.length ?? 0;

  return (
    <>
      <Topbar kicker={clients ? `${total} clientes` : erro ? 'erro' : 'carregando…'} title="Clientes" />
      <Scroll>
        {erro && <Card>Não consegui carregar os clientes: {erro}</Card>}
        {!clients && !erro && <Card>Carregando clientes…</Card>}
        {clients && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(248px, 1fr))',
              gap: 14,
            }}
          >
            {clients.map((c) => {
              const fenice = c.agencia === 'Fenice Lab';
              const ig = c.instagram?.username
                ? '@' + c.instagram.username.replace(/^@/, '')
                : c.slug;
              return (
                <Card key={c.slug}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <strong style={{ font: '600 15px/1.2 var(--fen-font)' }}>{c.name}</strong>
                    {badge(
                      fenice ? 'rgba(178,58,46,.14)' : 'rgba(154,140,122,.18)',
                      fenice ? '#B23A2E' : '#6E5A48',
                      c.agencia || '—',
                    )}
                  </div>
                  <div style={{ font: '500 12px/1.4 var(--fen-font)', color: 'var(--fen-muted)', marginTop: 6 }}>
                    {ig}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    {c.validated
                      ? badge('var(--fen-success-bg)', '#3c5232', 'Ativo')
                      : badge('var(--fen-warning-bg)', '#7a4520', c.pending_status || 'Em setup')}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Scroll>
    </>
  );
}
