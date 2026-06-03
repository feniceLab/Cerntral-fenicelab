import { Card, type ClienteFenice, themeBySlug } from '@fenice/shared';
import { Topbar } from '../components/Chrome';
import { PnIcon } from '../components/PnIcon';
import { Relatorio } from '../relatorio/Relatorio';
import { REPORTS } from '../relatorio/report-data';

export interface RelatorioViewProps {
  cliente: ClienteFenice;
  onBack: () => void;
}

export function RelatorioView({ cliente: c, onBack }: RelatorioViewProps) {
  const data = REPORTS[c.slug];
  const theme = themeBySlug(c.slug, c.cor);

  return (
    <>
      <Topbar kicker={`Relatório · ${c.nome}`} title="Performance">
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            border: '1px solid var(--fen-line, rgba(154,140,122,.35))',
            background: 'transparent', color: 'var(--fen-ink, #2A211C)',
            font: '600 13px/1 var(--fen-font)', padding: '8px 12px',
            borderRadius: 10, cursor: 'pointer',
          }}
        >
          <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>
            <PnIcon name="chevR" size={15} />
          </span>
          Voltar
        </button>
      </Topbar>

      <div style={{ flex: 1, minHeight: 0 }}>
        {data ? (
          <Relatorio data={data} theme={theme} />
        ) : (
          <div style={{ padding: 28 }}>
            <Card>
              <div style={{ font: '600 16px/1.3 var(--fen-font)' }}>
                {c.status === 'setup' ? 'Cliente em setup' : 'Relatório em preparação'}
              </div>
              <div style={{ marginTop: 8, color: 'var(--fen-muted)', font: '500 13px/1.5 var(--fen-font)' }}>
                {c.status === 'setup'
                  ? 'Cliente em fase de criação (conta de anúncios não provisionada). O relatório aparece aqui assim que houver dados.'
                  : 'Ainda não há relatório publicado para este cliente neste período.'}
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
