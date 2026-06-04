import { useMemo, useState } from 'react';
import { CLIENTES_FENICE } from '@fenice/shared';
import type { AuditEntry } from './AuditKPIs';

export type EntityType = 'campaign' | 'adset' | 'ad';
export type ActionType = 'pause' | 'resume' | 'budget_up' | 'budget_down';
export type Period = '24h' | '7d' | '30d' | 'all';

export interface AuditTableFilters {
  cliente: string;
  tipos: Set<EntityType>;
  acoes: Set<ActionType>;
  actor: string;
  periodo: Period;
}

export interface AuditTableProps {
  entries: AuditEntry[];
  filters: AuditTableFilters;
  setFilters: (next: AuditTableFilters) => void;
}

const ACTION_LABEL: Record<ActionType, string> = {
  pause: 'pause',
  resume: 'resume',
  budget_up: 'budget ↑',
  budget_down: 'budget ↓',
};

const TIPO_LABEL: Record<EntityType, string> = {
  campaign: 'campanha',
  adset: 'adset',
  ad: 'ad',
};

const PERIODO_LABEL: Record<Period, string> = {
  '24h': '24h',
  '7d': '7 dias',
  '30d': '30 dias',
  all: 'tudo',
};

function nomeCli(slug: string): string {
  return CLIENTES_FENICE.find((c) => c.slug === slug)?.nome ?? slug ?? '—';
}
function corCli(slug: string): string {
  return CLIENTES_FENICE.find((c) => c.slug === slug)?.cor ?? 'var(--fen-muted)';
}

function relativeWhen(iso: string): { rel: string; full: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { rel: '—', full: iso };
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return { rel: `${sec}s atrás`, full: d.toLocaleString('pt-BR') };
  const min = Math.floor(sec / 60);
  if (min < 60) return { rel: `${min}min atrás`, full: d.toLocaleString('pt-BR') };
  const h = Math.floor(min / 60);
  if (h < 24) return { rel: `${h}h atrás`, full: d.toLocaleString('pt-BR') };
  const dys = Math.floor(h / 24);
  if (dys < 30) return { rel: `${dys}d atrás`, full: d.toLocaleString('pt-BR') };
  return { rel: d.toLocaleDateString('pt-BR'), full: d.toLocaleString('pt-BR') };
}

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = String(v).replace(/"/g, '""');
  if (/[",\n;]/.test(s)) return `"${s}"`;
  return s;
}

function downloadCsv(filename: string, rows: string[][]) {
  const body = rows.map((r) => r.map(csvEscape).join(',')).join('\n');
  const blob = new Blob(['﻿' + body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const PAGE = 50;
const TIPOS: EntityType[] = ['campaign', 'adset', 'ad'];
const ACOES: ActionType[] = ['pause', 'resume', 'budget_up', 'budget_down'];
const PERIODOS: Period[] = ['24h', '7d', '30d', 'all'];

export function AuditTable({ entries, filters, setFilters }: AuditTableProps) {
  const [shown, setShown] = useState(PAGE);

  const toggleTipo = (t: EntityType) => {
    const next = new Set(filters.tipos);
    if (next.has(t)) next.delete(t);
    else next.add(t);
    setFilters({ ...filters, tipos: next });
  };
  const toggleAcao = (a: ActionType) => {
    const next = new Set(filters.acoes);
    if (next.has(a)) next.delete(a);
    else next.add(a);
    setFilters({ ...filters, acoes: next });
  };

  const filtered = useMemo(() => {
    const now = Date.now();
    const cutoff =
      filters.periodo === '24h'
        ? now - 24 * 3600 * 1000
        : filters.periodo === '7d'
          ? now - 7 * 24 * 3600 * 1000
          : filters.periodo === '30d'
            ? now - 30 * 24 * 3600 * 1000
            : 0;
    const actorLow = filters.actor.trim().toLowerCase();

    return entries.filter((e) => {
      if (filters.cliente && e.slug !== filters.cliente) return false;
      if (filters.tipos.size > 0 && (!e.entity_type || !filters.tipos.has(e.entity_type))) return false;
      if (filters.acoes.size > 0 && (!e.action || !filters.acoes.has(e.action))) return false;
      if (cutoff > 0) {
        const t = new Date(e.ts).getTime();
        if (Number.isNaN(t) || t < cutoff) return false;
      }
      if (actorLow && !(e.actor || '').toLowerCase().includes(actorLow)) return false;
      return true;
    });
  }, [entries, filters]);

  const visible = filtered.slice(0, shown);

  const handleExport = () => {
    const header = ['ts', 'slug', 'cliente', 'actor', 'entity_type', 'entity_id', 'entity_name', 'action', 'factor', 'ok', 'error'];
    const rows: string[][] = filtered.map((e) => [
      e.ts,
      e.slug,
      nomeCli(e.slug),
      e.actor ?? '',
      e.entity_type ?? '',
      e.entity_id ?? '',
      e.entity_name ?? '',
      e.action ?? '',
      e.factor != null ? String(e.factor) : '',
      e.ok ? 'ok' : 'erro',
      e.error ?? '',
    ]);
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadCsv(`audit-fenice-${stamp}.csv`, [header, ...rows]);
  };

  return (
    <div className="fen-audit-table">
      <div className="fen-audit-table__head">
        <div className="fen-audit-table__title-row">
          <div className="fen-audit-table__title">
            Linha do tempo · {filtered.length} eventos
            {filtered.length !== entries.length && (
              <span style={{ color: 'var(--fen-muted)', fontWeight: 500 }}> (de {entries.length})</span>
            )}
          </div>
          <button type="button" className="fen-audit-export-btn" onClick={handleExport}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
            </svg>
            Exportar CSV
          </button>
        </div>

        <div className="fen-audit-table__filters">
          <div className="fen-audit-filter-group">
            <span className="fen-audit-filter-group__label">Cliente</span>
            <select
              className="fen-audit-select"
              value={filters.cliente}
              onChange={(e) => setFilters({ ...filters, cliente: e.target.value })}
            >
              <option value="">Todos</option>
              {CLIENTES_FENICE.map((c) => (
                <option key={c.slug} value={c.slug}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div className="fen-audit-filter-group">
            <span className="fen-audit-filter-group__label">Tipo</span>
            {TIPOS.map((t) => (
              <button
                key={t}
                type="button"
                className={`fen-audit-chip${filters.tipos.has(t) ? ' is-on' : ''}`}
                onClick={() => toggleTipo(t)}
              >
                {TIPO_LABEL[t]}
              </button>
            ))}
          </div>

          <div className="fen-audit-filter-group">
            <span className="fen-audit-filter-group__label">Ação</span>
            {ACOES.map((a) => (
              <button
                key={a}
                type="button"
                className={`fen-audit-chip${filters.acoes.has(a) ? ' is-on' : ''}`}
                onClick={() => toggleAcao(a)}
              >
                {ACTION_LABEL[a]}
              </button>
            ))}
          </div>

          <div className="fen-audit-filter-group">
            <span className="fen-audit-filter-group__label">Período</span>
            {PERIODOS.map((p) => (
              <button
                key={p}
                type="button"
                className={`fen-audit-chip${filters.periodo === p ? ' is-on' : ''}`}
                onClick={() => setFilters({ ...filters, periodo: p })}
              >
                {PERIODO_LABEL[p]}
              </button>
            ))}
          </div>

          <div className="fen-audit-filter-group">
            <span className="fen-audit-filter-group__label">Actor</span>
            <input
              className="fen-audit-input"
              placeholder="filtrar por actor…"
              value={filters.actor}
              onChange={(e) => setFilters({ ...filters, actor: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="fen-audit-row is-header">
        <div>Quando</div>
        <div>Cliente</div>
        <div>Actor</div>
        <div>Ação</div>
        <div>Entidade</div>
        <div style={{ textAlign: 'center' }}>Status</div>
      </div>

      {visible.length === 0 ? (
        <div className="fen-audit-table__empty">Nenhum evento bate com os filtros atuais.</div>
      ) : (
        <div className="fen-audit-table__list">
          {visible.map((e, idx) => {
            const when = relativeWhen(e.ts);
            const cor = corCli(e.slug);
            const actionClass = e.action ? `fen-audit-action--${e.action}` : 'fen-audit-action--null';
            const factor =
              (e.action === 'budget_up' || e.action === 'budget_down') && e.factor != null
                ? ` ×${e.factor}`
                : '';
            return (
              <div
                key={`${e.ts}-${idx}`}
                className="fen-audit-row"
                style={{ borderLeftColor: cor }}
              >
                <div className="fen-audit-row__when" title={when.full}>
                  <strong>{when.rel}</strong>
                </div>
                <div className="fen-audit-row__cliente" title={e.slug}>
                  <i style={{ background: cor }} />
                  <strong>{nomeCli(e.slug)}</strong>
                </div>
                <div className="fen-audit-row__actor" style={{ color: 'var(--fen-muted)' }}>
                  {e.actor || '—'}
                </div>
                <div className="fen-audit-row__action">
                  <span className={`fen-audit-action ${actionClass}`}>
                    {e.action ? ACTION_LABEL[e.action] : '—'}
                    {factor}
                  </span>
                </div>
                <div className="fen-audit-row__entity">
                  <div className="fen-audit-entity">
                    {e.entity_name || e.entity_id || '—'}
                    {e.entity_type && <small>{TIPO_LABEL[e.entity_type]}</small>}
                  </div>
                </div>
                <div className="fen-audit-row__status" style={{ textAlign: 'center' }}>
                  {e.ok ? (
                    <span className="fen-audit-status is-ok" title="Sucesso">✓</span>
                  ) : (
                    <span className="fen-audit-status is-err" title={e.error || 'Erro'}>⚠</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length > shown && (
        <div className="fen-audit-table__more">
          <button
            type="button"
            className="fen-audit-table__more-btn"
            onClick={() => setShown((n) => n + PAGE)}
          >
            Mais {Math.min(PAGE, filtered.length - shown)} (de {filtered.length - shown} restantes)
          </button>
        </div>
      )}
    </div>
  );
}
