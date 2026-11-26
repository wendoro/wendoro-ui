import * as React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Database,
  Filter,
  FunctionSquare,
  Grid3X3,
  Plus,
  Table2,
  Trash2,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { StatusBadge } from '../status-badge';

/* -------------------------------------------------------------------------- */
/* SpreadsheetGrid (Keyboard-navigable tabular grid + formula bar)            */
/* -------------------------------------------------------------------------- */

export interface SpreadsheetColumn {
  key: string;
  label: string;
  align?: 'left' | 'right';
}

export interface SpreadsheetGridProps {
  columns: SpreadsheetColumn[];
  rows: Array<Record<string, string | number>>;
  onCellChange?: (rowIndex: number, columnKey: string, value: string) => void;
  title?: string;
  className?: string;
}

export function SpreadsheetGrid({
  columns,
  rows,
  onCellChange,
  title = 'Spreadsheet grid',
  className,
}: SpreadsheetGridProps) {
  const [activeCell, setActiveCell] = React.useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [draft, setDraft] = React.useState('');
  const cellRefs = React.useRef<Record<string, HTMLInputElement | null>>({});

  const activeColumn = columns[activeCell.col];
  const currentCellValue =
    activeColumn && rows[activeCell.row]
      ? String(rows[activeCell.row][activeColumn.key] ?? '')
      : '';

  React.useEffect(() => {
    setDraft(currentCellValue);
  }, [currentCellValue, activeCell.row, activeCell.col]);

  const focusCell = (row: number, col: number) => {
    const r = Math.max(0, Math.min(rows.length - 1, row));
    const c = Math.max(0, Math.min(columns.length - 1, col));
    setActiveCell({ row: r, col: c });
    cellRefs.current[`${r}-${c}`]?.focus();
  };

  const coordLabel = activeColumn
    ? `${String.fromCharCode(65 + (activeCell.col % 26))}${activeCell.row + 1}`
    : 'A1';

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Grid3X3 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>{title}</span>
        </div>
        <div className="flex flex-1 min-w-[220px] max-w-md items-center gap-2">
          <span className="rounded border border-border bg-surface px-2 py-1 font-mono text-[11px] font-semibold text-foreground">
            {coordLabel}
          </span>
          <input
            type="text"
            aria-label="Formula or cell value bar"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              if (activeColumn) onCellChange?.(activeCell.row, activeColumn.key, e.target.value);
            }}
            className="h-8 flex-1 rounded-[var(--wdr-radius-sm)] border border-input bg-surface px-2.5 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table role="grid" aria-label={title} className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground">
              <th className="w-10 border border-border px-2 py-1.5 text-center font-mono">#</th>
              {columns.map((col, colIdx) => (
                <th key={col.key} className="border border-border px-3 py-1.5 text-left font-semibold text-foreground">
                  {col.label} ({String.fromCharCode(65 + (colIdx % 26))})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <th className="border border-border bg-muted/30 px-2 py-1 text-center font-mono text-[11px] text-muted-foreground tabular-nums">
                  {rowIdx + 1}
                </th>
                {columns.map((col, colIdx) => {
                  const isActive = activeCell.row === rowIdx && activeCell.col === colIdx;
                  const val = String(row[col.key] ?? '');
                  return (
                    <td
                      key={col.key}
                      className={cn(
                        'border border-border p-0',
                        isActive && 'ring-2 ring-inset ring-primary bg-primary-subtle/20'
                      )}
                    >
                      <input
                        ref={(el) => {
                          cellRefs.current[`${rowIdx}-${colIdx}`] = el;
                        }}
                        type="text"
                        aria-label={`Row ${rowIdx + 1} ${col.label}`}
                        value={val}
                        onFocus={() => setActiveCell({ row: rowIdx, col: colIdx })}
                        onChange={(e) => onCellChange?.(rowIdx, col.key, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown' || e.key === 'Enter') {
                            e.preventDefault();
                            focusCell(rowIdx + 1, colIdx);
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            focusCell(rowIdx - 1, colIdx);
                          } else if (e.key === 'ArrowRight') {
                            e.preventDefault();
                            focusCell(rowIdx, colIdx + 1);
                          } else if (e.key === 'ArrowLeft') {
                            e.preventDefault();
                            focusCell(rowIdx, colIdx - 1);
                          }
                        }}
                        className={cn(
                          'h-8 w-full bg-transparent px-2.5 text-xs text-foreground tabular-nums focus:outline-none',
                          col.align === 'right' && 'text-right'
                        )}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* PivotTable                                                                 */
/* -------------------------------------------------------------------------- */

export interface PivotTableProps {
  data: Array<Record<string, string | number>>;
  rowField: string;
  columnField: string;
  valueField: string;
  aggregator?: 'sum' | 'avg' | 'count';
  title?: string;
  formatValue?: (val: number) => string;
  className?: string;
}

export function PivotTable({
  data,
  rowField,
  columnField,
  valueField,
  aggregator = 'sum',
  title = 'Pivot summary',
  formatValue = (v) => v.toLocaleString(),
  className,
}: PivotTableProps) {
  const rowKeys = Array.from(new Set(data.map((d) => String(d[rowField] ?? 'Other'))));
  const colKeys = Array.from(new Set(data.map((d) => String(d[columnField] ?? 'Other'))));

  const computeCell = (rKey: string, cKey: string) => {
    const matches = data.filter(
      (d) => String(d[rowField] ?? 'Other') === rKey && String(d[columnField] ?? 'Other') === cKey
    );
    if (matches.length === 0) return 0;
    if (aggregator === 'count') return matches.length;
    const sum = matches.reduce((acc, item) => acc + (Number(item[valueField]) || 0), 0);
    return aggregator === 'avg' ? Math.round((sum / matches.length) * 10) / 10 : sum;
  };

  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Table2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>{title}</span>
        </div>
        <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
          {aggregator.toUpperCase()}({valueField})
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-2 text-left font-semibold text-foreground">
                {rowField} / {columnField}
              </th>
              {colKeys.map((cKey) => (
                <th key={cKey} className="px-3 py-2 text-right font-semibold text-foreground">
                  {cKey}
                </th>
              ))}
              <th className="px-3 py-2 text-right font-semibold text-foreground">Total</th>
            </tr>
          </thead>
          <tbody>
            {rowKeys.map((rKey) => {
              const vals = colKeys.map((cKey) => computeCell(rKey, cKey));
              const total = vals.reduce((a, b) => a + b, 0);
              return (
                <tr key={rKey} className="border-b border-border/60">
                  <th className="px-3 py-2 text-left font-medium text-foreground">{rKey}</th>
                  {vals.map((v, idx) => (
                    <td key={colKeys[idx]} className="px-3 py-2 text-right tabular-nums text-foreground">
                      {formatValue(v)}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right font-semibold tabular-nums text-foreground">
                    {formatValue(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* QueryBuilder & FormulaEditor                                               */
/* -------------------------------------------------------------------------- */

export interface QueryConditionItem {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt';
  value: string;
}

export interface QueryBuilderProps {
  fields: string[];
  combinator: 'AND' | 'OR';
  onCombinatorChange: (combinator: 'AND' | 'OR') => void;
  conditions: QueryConditionItem[];
  onChange: (conditions: QueryConditionItem[]) => void;
  title?: string;
  className?: string;
}

export function QueryBuilder({
  fields,
  combinator,
  onCombinatorChange,
  conditions,
  onChange,
  title = 'Query builder',
  className,
}: QueryBuilderProps) {
  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-[var(--wdr-radius-sm)] border border-border bg-muted p-0.5 text-xs">
            {(['AND', 'OR'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={combinator === mode}
                onClick={() => onCombinatorChange(mode)}
                className={cn(
                  'rounded px-2.5 py-1 font-semibold',
                  combinator === mode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                )}
              >
                {mode}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() =>
              onChange([
                ...conditions,
                {
                  id: `qc-${Date.now().toString(36)}`,
                  field: fields[0] ?? 'status',
                  operator: 'equals',
                  value: '',
                },
              ])
            }
          >
            Add condition
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {conditions.map((cond, idx) => (
          <div key={cond.id} className="grid grid-cols-1 gap-2 sm:grid-cols-12 items-center">
            <span className="sm:col-span-1 text-[11px] font-semibold text-muted-foreground">
              {idx === 0 ? 'WHERE' : combinator}
            </span>
            <select
              aria-label={`Condition ${idx + 1} field`}
              value={cond.field}
              onChange={(e) =>
                onChange(conditions.map((c) => (c.id === cond.id ? { ...c, field: e.target.value } : c)))
              }
              className="sm:col-span-4 h-9 rounded-[var(--wdr-radius-sm)] border border-input bg-surface px-2.5 text-xs text-foreground"
            >
              {fields.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <select
              aria-label={`Condition ${idx + 1} operator`}
              value={cond.operator}
              onChange={(e) =>
                onChange(
                  conditions.map((c) =>
                    c.id === cond.id ? { ...c, operator: e.target.value as QueryConditionItem['operator'] } : c
                  )
                )
              }
              className="sm:col-span-3 h-9 rounded-[var(--wdr-radius-sm)] border border-input bg-surface px-2.5 text-xs text-foreground"
            >
              <option value="equals">equals</option>
              <option value="contains">contains</option>
              <option value="gt">greater than</option>
              <option value="lt">less than</option>
            </select>
            <input
              type="text"
              aria-label={`Condition ${idx + 1} value`}
              value={cond.value}
              placeholder="Value…"
              onChange={(e) =>
                onChange(conditions.map((c) => (c.id === cond.id ? { ...c, value: e.target.value } : c)))
              }
              className="sm:col-span-3 h-9 rounded-[var(--wdr-radius-sm)] border border-input bg-surface px-2.5 text-xs text-foreground"
            />
            <button
              type="button"
              aria-label={`Remove condition ${idx + 1}`}
              onClick={() => onChange(conditions.filter((c) => c.id !== cond.id))}
              className="sm:col-span-1 inline-flex h-9 items-center justify-center rounded border border-border text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function FormulaEditor({
  value,
  onChange,
  variables = ['amount', 'quantity', 'discount', 'taxRate'],
  functions = ['SUM', 'AVG', 'ROUND', 'IF'],
  title = 'Formula expression',
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  variables?: string[];
  functions?: string[];
  title?: string;
  className?: string;
}) {
  const parenDelta =
    (value.match(/\(/g)?.length ?? 0) - (value.match(/\)/g)?.length ?? 0);
  const balanced = parenDelta === 0;

  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FunctionSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>{title}</span>
        </div>
        <StatusBadge
          status={balanced ? 'completed' : 'warning'}
          label={balanced ? 'Syntax balanced' : 'Unclosed parenthesis'}
        />
      </div>

      <textarea
        rows={3}
        aria-label={title}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[var(--wdr-radius-md)] border border-input bg-background p-3 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-muted-foreground mr-1">Insert:</span>
        {functions.map((fn) => (
          <button
            key={fn}
            type="button"
            onClick={() => onChange(`${value}${value ? ' ' : ''}${fn}()`)}
            className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground hover:bg-primary hover:text-primary-foreground"
          >
            {fn}()
          </button>
        ))}
        {variables.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(`${value}${value ? ' ' : ''}${v}`)}
            className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[11px] text-foreground hover:bg-muted"
          >
            {v}
          </button>
        ))}
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* DataImportMapper & DataRelationshipDiagram                                 */
/* -------------------------------------------------------------------------- */

export interface ImportColumnMapping {
  sourceColumn: string;
  sampleValue: string;
  targetField: string;
  required?: boolean;
}

export function DataImportMapper({
  mappings,
  targetFields,
  onChangeMapping,
  validationWarnings = [],
  onConfirmImport,
  className,
}: {
  mappings: ImportColumnMapping[];
  targetFields: string[];
  onChangeMapping: (sourceColumn: string, targetField: string) => void;
  validationWarnings?: string[];
  onConfirmImport?: () => void;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">Data Import & Field Mapping</h3>
          <p className="text-xs text-muted-foreground">Match incoming columns to target schema fields.</p>
        </div>
        {onConfirmImport && (
          <Button size="sm" variant="primary" onClick={onConfirmImport}>
            Validate & preview import
          </Button>
        )}
      </div>

      {validationWarnings.length > 0 && (
        <div
          role="alert"
          className="rounded-[var(--wdr-radius-md)] border border-warning/40 bg-warning-subtle p-3 text-xs text-warning-subtle-foreground space-y-1"
        >
          <div className="flex items-center gap-1.5 font-semibold">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{validationWarnings.length} validation notice(s)</span>
          </div>
          <ul className="list-disc pl-5 space-y-0.5">
            {validationWarnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        {mappings.map((m) => (
          <div
            key={m.sourceColumn}
            className="grid grid-cols-1 gap-2 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3 sm:grid-cols-12 items-center text-xs"
          >
            <div className="sm:col-span-4">
              <div className="font-semibold text-foreground">{m.sourceColumn}</div>
              <div className="truncate font-mono text-[11px] text-muted-foreground">e.g. {m.sampleValue}</div>
            </div>
            <div className="sm:col-span-1 flex justify-center text-muted-foreground">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="sm:col-span-5">
              <select
                aria-label={`Target field for ${m.sourceColumn}`}
                value={m.targetField}
                onChange={(e) => onChangeMapping(m.sourceColumn, e.target.value)}
                className="h-9 w-full rounded-[var(--wdr-radius-sm)] border border-input bg-surface px-2.5 text-xs text-foreground"
              >
                <option value="">Skip column</option>
                {targetFields.map((tf) => (
                  <option key={tf} value={tf}>
                    {tf}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 text-right">
              <StatusBadge
                status={m.targetField ? 'completed' : m.required ? 'warning' : 'draft'}
                label={m.targetField ? 'Mapped' : m.required ? 'Required' : 'Skipped'}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export interface DataEntitySchema {
  id: string;
  name: string;
  fields: Array<{ name: string; type: string; keyKind?: 'PK' | 'FK' }>;
}

export interface DataEntityRelation {
  fromEntity: string;
  toEntity: string;
  cardinality: '1:1' | '1:N' | 'N:M';
}

export function DataRelationshipDiagram({
  entities,
  relations,
  title = 'Entity Relationship Overview',
  className,
}: {
  entities: DataEntitySchema[];
  relations: DataEntityRelation[];
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Database className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span>{title}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {entities.map((ent) => (
          <div
            key={ent.id}
            className="rounded-[var(--wdr-radius-md)] border border-border bg-surface overflow-hidden"
          >
            <div className="border-b border-border bg-muted/60 px-3 py-2 text-xs font-bold text-foreground">
              {ent.name}
            </div>
            <ul className="divide-y divide-border/50 text-xs">
              {ent.fields.map((f) => (
                <li key={f.name} className="flex items-center justify-between gap-2 px-3 py-1.5">
                  <div className="flex items-center gap-1.5 font-mono text-foreground">
                    {f.keyKind && (
                      <span className="rounded bg-primary px-1 py-0.5 text-[10px] font-bold text-primary-foreground">
                        {f.keyKind}
                      </span>
                    )}
                    <span>{f.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">{f.type}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {relations.length > 0 && (
        <ul className="flex flex-wrap gap-2 border-t border-border pt-3 text-xs">
          {relations.map((rel, idx) => (
            <li
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-[var(--wdr-radius-sm)] border border-border bg-muted/40 px-2.5 py-1 font-mono text-foreground"
            >
              <span>{rel.fromEntity}</span>
              <span className="rounded bg-surface px-1 font-bold text-primary-active">{rel.cardinality}</span>
              <span>{rel.toEntity}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
