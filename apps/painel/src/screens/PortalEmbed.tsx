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

  // SITE REAL do cliente (deployado em <cliente>.fenicelab.com.br) — é o que a admin
  // quer ver espelhado: Brand Book, Design System, Cronograma, Performance, Galeria…
  // (NÃO o protótipo React apps/portal, que é só demo do design system com dados fixos.)
  const portalSrc = cliente.portalUrl;

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
      ) : portalSrc ? (
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
      ) : (
        <div
          style={{
            flex: 1, minHeight: 'calc(100vh - 53px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 10,
            color: 'var(--fen-muted)', textAlign: 'center', padding: 32,
          }}
        >
          <div style={{ font: '700 16px/1.3 var(--fen-display, serif)', color: 'var(--fen-caffe)' }}>
            Site ainda não publicado
          </div>
          <div style={{ font: '500 13px/1.5 var(--fen-font)', maxWidth: 360 }}>
            {cliente.nome} ainda não tem portal no ar. Use a aba <strong>Performance</strong> pra ver o tráfego ao vivo, ou gere o site pela skill de onboarding.
          </div>
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
