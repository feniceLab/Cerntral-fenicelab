import { WarRoomShell, themeBySlug, type ClienteFenice } from '@fenice/shared';
import { PnIcon } from '../components/PnIcon';

export interface PerformanceProps {
  cliente: ClienteFenice;
  onBack: () => void;
}

/**
 * War room de Performance direto no Painel admin (sem iframe duplo).
 * Reusa WarRoomShell de shared/components/performance.
 * Surface = 'painel' (não escreve no hash, header sem live indicator).
 */
export function Performance({ cliente, onBack }: PerformanceProps) {
  const theme = themeBySlug(cliente.slug, cliente.cor);
  const logo = cliente.logo ? cliente.logo : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: theme.bg }}>
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
          Performance · {cliente.nome}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <WarRoomShell
          slug={cliente.slug}
          clienteNome={cliente.nome}
          logo={logo}
          theme={theme}
          surface="painel"
        />
      </div>
    </div>
  );
}
