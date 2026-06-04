import { useState } from 'react';
import { type ClienteFenice } from '@fenice/shared';
import { PnIcon } from '../components/PnIcon';
import { useAuth } from '../auth/useAuth';
import { Performance } from './Performance';

export interface PortalEmbedProps {
  cliente: ClienteFenice;
  onBack: () => void;
}

type EmbedView = 'portal' | 'performance';

/**
 * Espelhamento do PORTAL COMPLETO do cliente dentro do painel admin.
 *
 * - Aba "Portal completo": <iframe> same-origin pra /portal/?c=<slug> (sem embed=1),
 *   que renderiza o PortalApp inteiro (DeviceFrame + todas as abas: Início, Calendário,
 *   Galeria, Relatórios, Brand Book, etc). Como central.fenicelab.com.br serve tanto
 *   /painel quanto /portal, o iframe é same-origin e compartilha o mesmo localStorage →
 *   a sessão Supabase do admin já está disponível dentro do portal (vê tudo, já logada).
 * - Aba "Performance (war room)": o <Performance> de dado vivo Meta Graph, atalho rápido.
 *
 * Default = Portal completo.
 *
 * Nota: as abas Calendário/Galeria/Brand Book do portal usam dados MOCKADOS
 * (report-data.ts). Só Performance é dado vivo. Isso é esperado.
 */
export function PortalEmbed({ cliente, onBack }: PortalEmbedProps) {
  const { email, nomeExibicao } = useAuth();
  const actor = nomeExibicao || email || undefined;
  const [active, setActive] = useState<EmbedView>('portal');

  // PRODUÇÃO: /painel e /portal vivem no mesmo domínio (central.fenicelab.com.br),
  // então `/portal/` é same-origin e o iframe herda o localStorage (sessão Supabase).
  // DEV/PREVIEW: painel (5172) e portal (5171) são dev servers SEPARADOS — `/portal/`
  // não existe no server do painel. Usa VITE_PORTAL_BASE (ex http://localhost:5171)
  // ou cai no dev server padrão do portal. (Em dev é cross-origin → sem sessão, só visual.)
  const env = (import.meta as any).env || {};
  const portalBase: string = env.VITE_PORTAL_BASE
    ? env.VITE_PORTAL_BASE.replace(/\/$/, '')
    : env.DEV
      ? 'http://localhost:5171/portal'
      : '/portal';
  const portalSrc = `${portalBase}/?c=${encodeURIComponent(cliente.slug)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PortalEmbedHeader
        cliente={cliente}
        actor={actor}
        active={active}
        onSelect={setActive}
        onBack={onBack}
      />

      {active === 'performance' ? (
        // Atalho war room: componente nativo, sem iframe duplo.
        <div style={{ flex: 1, minHeight: 0 }}>
          <Performance cliente={cliente} onBack={onBack} />
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <iframe
            key={cliente.slug}
            src={portalSrc}
            title={`Portal completo · ${cliente.nome}`}
            loading="eager"
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              minHeight: 'calc(100vh - 53px)',
              border: 0,
              background: 'var(--fen-bg, #f4efe7)',
            }}
          />
        </div>
      )}
    </div>
  );
}

function PortalEmbedHeader({
  cliente,
  actor,
  active,
  onSelect,
  onBack,
}: {
  cliente: ClienteFenice;
  actor: string | undefined;
  active: EmbedView;
  onSelect: (v: EmbedView) => void;
  onBack: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 20px 10px 64px',
        background: 'var(--fen-avorio)',
        borderBottom: '1px solid var(--fen-border)',
        position: 'sticky', top: 0, zIndex: 30,
      }}
    >
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar para a lista de clientes"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          border: '1px solid var(--fen-border)',
          background: 'var(--fen-surface)',
          color: 'var(--fen-caffe)',
          font: '600 13px/1 var(--fen-font)',
          padding: '7px 11px',
          borderRadius: 8, cursor: 'pointer',
        }}
      >
        <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>
          <PnIcon name="chevR" size={14} />
        </span>
        Voltar
      </button>

      <div style={{ marginLeft: 4, font: '600 12px/1 var(--fen-font)', color: 'var(--fen-muted)', letterSpacing: '.04em' }}>
        {cliente.nome}
      </div>

      <div
        role="tablist"
        aria-label="Visualização do cliente"
        style={{
          marginLeft: 16,
          display: 'inline-flex',
          gap: 4,
          padding: 3,
          borderRadius: 10,
          background: 'var(--fen-surface)',
          border: '1px solid var(--fen-border)',
        }}
      >
        <EmbedTab
          label="Portal completo"
          selected={active === 'portal'}
          onClick={() => onSelect('portal')}
        />
        <EmbedTab
          label="Performance (war room)"
          selected={active === 'performance'}
          onClick={() => onSelect('performance')}
        />
      </div>

      {actor && (
        <div style={{ marginLeft: 'auto', font: '500 12px/1 var(--fen-font)', color: 'var(--fen-muted)' }}>
          {actor}
        </div>
      )}
    </div>
  );
}

function EmbedTab({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      style={{
        border: 'none',
        cursor: 'pointer',
        borderRadius: 8,
        padding: '6px 12px',
        font: '600 12px/1 var(--fen-font)',
        letterSpacing: '.01em',
        color: selected ? 'var(--fen-avorio)' : 'var(--fen-caffe)',
        background: selected ? 'var(--fen-caffe)' : 'transparent',
        transition: 'background .15s ease, color .15s ease',
      }}
    >
      {label}
    </button>
  );
}
