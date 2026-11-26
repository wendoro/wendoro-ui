import * as React from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronRight,
  Columns3,
  Download,
  Pencil,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useBreakpoint } from '../../../hooks/use-breakpoint';
import { Alert } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { EmptyState } from '../../ui/empty-state';
import { Pagination } from '../../ui/pagination';
import { Popover } from '../../ui/popover';
import { Skeleton } from '../../ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { SavedViewsBar, type SavedViewSpec } from '../../ui/ux-patterns';

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  accessor?: (row: T) => string | number | boolean | null | undefined;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: Array<{ label: string; value: string }>;
  defaultHidden?: boolean;
  editable?: boolean;
  pin?: 'left' | 'right';
  align?: 'left' | 'right';
  width?: string;
  minWidth?: number;
}

export interface DataTableSortRule {
  key: string;
  direction: 'asc' | 'desc';
}

export interface DataTableBulkAction<T> {
  id: string;
  label: string;
  onAction: (selectedRows: T[], selectedIds: string[]) => void;
  variant?: 'default' | 'destructive';
}

export interface DataTableSavedView extends SavedViewSpec {
  searchQuery?: string;
  columnFilters?: Record<string, string>;
  sortRules?: DataTableSortRule[];
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  getRowLabel?: (row: T) => string;
  loading?: boolean;
  error?: React.ReactNode | boolean;
  errorTitle?: string;
  onRetry?: () => void;
  retryLabel?: string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  multiSort?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  columnVisibilityToggle?: boolean;
  columnReorderable?: boolean;
  columnResizable?: boolean;
  stickyHeader?: boolean;
  bulkActions?: DataTableBulkAction<T>[];
  renderExpandedRow?: (row: T) => React.ReactNode;
  rowActions?: (row: T) => React.ReactNode;
  onCellEdit?: (rowId: string, columnKey: string, nextValue: string) => void;
  groupBy?: string;
  groupSummary?: (groupValue: string, groupRows: T[]) => React.ReactNode;
  summaryRow?: (context: { visibleColumns: DataTableColumn<T>[]; rows: T[] }) => Record<string, React.ReactNode>;
  summaryLabel?: string;
  savedViews?: DataTableSavedView[];
  activeViewId?: string;
  onSelectView?: (view: DataTableSavedView) => void;
  onSaveView?: (name: string, state: { searchQuery: string; columnFilters: Record<string, string>; sortRules: DataTableSortRule[] }) => void;
  enableExport?: boolean;
  onExport?: (rows: T[]) => void;
  exportFileName?: string;
  renderMobileCard?: (row: T, ctx: { selected: boolean; onToggleSelect: (checked: boolean) => void }) => React.ReactNode;
  responsiveCardMode?: 'auto' | 'table' | 'cards';
  virtualized?: boolean;
  rowHeight?: number;
  virtualViewportHeight?: number;
  renderToolbar?: (context: {
    totalCount: number;
    filteredCount: number;
    selectedCount: number;
  }) => React.ReactNode;
  renderPagination?: (context: {
    page: number;
    totalPages: number;
    onPageChange: (nextPage: number) => void;
  }) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  'aria-label'?: string;
  className?: string;
}

function escapeCsvField(val: unknown): string {
  const str = String(val ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  getRowLabel,
  loading = false,
  error = false,
  errorTitle = 'Unable to load records',
  onRetry,
  retryLabel = 'Retry',
  selectable = false,
  selectedIds: controlledSelectedIds,
  onSelectedIdsChange,
  pageSize = 10,
  pageSizeOptions,
  onPageSizeChange,
  multiSort = false,
  searchable = false,
  searchPlaceholder = 'Search records…',
  columnVisibilityToggle = false,
  columnReorderable = false,
  columnResizable = false,
  stickyHeader = false,
  bulkActions,
  renderExpandedRow,
  rowActions,
  onCellEdit,
  groupBy,
  groupSummary,
  summaryRow,
  summaryLabel = 'Summary',
  savedViews,
  activeViewId,
  onSelectView,
  onSaveView,
  enableExport = false,
  onExport,
  exportFileName = 'wendoro-export.csv',
  renderMobileCard,
  responsiveCardMode = 'table',
  virtualized = false,
  rowHeight = 44,
  virtualViewportHeight = 360,
  renderToolbar,
  renderPagination,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search query or clearing active filters.',
  emptyAction,
  'aria-label': ariaLabel,
  className,
}: DataTableProps<T>) {
  const { isMobile } = useBreakpoint();
  const [sortRules, setSortRules] = React.useState<DataTableSortRule[]>([]);
  const [page, setPage] = React.useState(1);
  const [currentPageSize, setCurrentPageSize] = React.useState(Math.max(1, pageSize));
  const [searchQuery, setSearchQuery] = React.useState('');
  const [columnFilters, setColumnFilters] = React.useState<Record<string, string>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() => columns.map((c) => c.key));
  const [hiddenCols, setHiddenCols] = React.useState<Set<string>>(
    () => new Set(columns.filter((c) => c.defaultHidden).map((c) => c.key))
  );
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(new Set());
  const [editingCell, setEditingCell] = React.useState<{ rowId: string; colKey: string; draft: string } | null>(null);
  const [colWidths, setColWidths] = React.useState<Record<string, number>>({});
  const [colMenuOpen, setColMenuOpen] = React.useState(false);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [liveAnnouncement, setLiveAnnouncement] = React.useState('');
  const [internalSelectedIds, setInternalSelectedIds] = React.useState<string[]>([]);
  const isSelectionControlled = controlledSelectedIds !== undefined;
  const selectedIds = isSelectionControlled ? controlledSelectedIds : internalSelectedIds;

  React.useEffect(() => {
    setCurrentPageSize(Math.max(1, pageSize));
  }, [pageSize]);

  React.useEffect(() => {
    const incomingKeys = columns.map((c) => c.key);
    setColumnOrder((prev) => {
      const kept = prev.filter((k) => incomingKeys.includes(k));
      const added = incomingKeys.filter((k) => !kept.includes(k));
      return [...kept, ...added];
    });
  }, [columns]);

  const orderedColumns = React.useMemo(() => {
    const map = new Map(columns.map((c) => [c.key, c]));
    return columnOrder.map((k) => map.get(k)).filter((c): c is DataTableColumn<T> => Boolean(c));
  }, [columnOrder, columns]);

  const safePageSize = Math.max(1, currentPageSize);

  const visibleColumns = React.useMemo(
    () => orderedColumns.filter((col) => !hiddenCols.has(col.key)),
    [orderedColumns, hiddenCols]
  );

  const filterableColumns = React.useMemo(
    () => orderedColumns.filter((c) => c.filterable && c.accessor),
    [orderedColumns]
  );

  const filteredData = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.filter((row) => {
      if (q) {
        const matched = columns.some((col) => {
          const val = col.accessor ? col.accessor(row) : undefined;
          return val !== undefined && val !== null && String(val).toLowerCase().includes(q);
        });
        if (!matched) return false;
      }

      for (const [key, filterVal] of Object.entries(columnFilters)) {
        if (!filterVal) continue;
        const col = columns.find((c) => c.key === key);
        if (!col?.accessor) continue;
        const cellVal = String(col.accessor(row) ?? '').toLowerCase();
        if (cellVal !== filterVal.toLowerCase()) return false;
      }
      return true;
    });
  }, [columnFilters, columns, data, searchQuery]);

  const sortedData = React.useMemo(() => {
    if (sortRules.length === 0) return filteredData;
    const copy = [...filteredData];
    copy.sort((a, b) => {
      for (const rule of sortRules) {
        const col = columns.find((c) => c.key === rule.key);
        if (!col?.accessor) continue;
        const valA = col.accessor(a) ?? '';
        const valB = col.accessor(b) ?? '';
        let cmp = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          cmp = valA - valB;
        } else {
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          cmp = strA < strB ? -1 : strA > strB ? 1 : 0;
        }
        if (cmp !== 0) return rule.direction === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
    return copy;
  }, [columns, filteredData, sortRules]);

  const totalPages = virtualized ? 1 : Math.max(1, Math.ceil(sortedData.length / safePageSize));
  const safePage = Math.min(page, totalPages);
  const pageData = React.useMemo(() => {
    if (virtualized) return sortedData;
    const start = (safePage - 1) * safePageSize;
    return sortedData.slice(start, start + safePageSize);
  }, [safePage, safePageSize, sortedData, virtualized]);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const toggleSort = (key: string, shiftKey = false) => {
    setSortRules((prev) => {
      const existing = prev.find((r) => r.key === key);
      let next: DataTableSortRule[];

      if (!multiSort || !shiftKey) {
        if (!existing) next = [{ key, direction: 'asc' }];
        else if (existing.direction === 'asc') next = [{ key, direction: 'desc' }];
        else next = [];
      } else {
        if (!existing) next = [...prev, { key, direction: 'asc' }];
        else if (existing.direction === 'asc') {
          next = prev.map((r) => (r.key === key ? { key, direction: 'desc' } : r));
        } else {
          next = prev.filter((r) => r.key !== key);
        }
      }

      if (next.length === 0) {
        setLiveAnnouncement(`Sorted order cleared`);
      } else {
        const ruleSummary = next.map((r) => `${r.key} ${r.direction === 'asc' ? 'ascending' : 'descending'}`).join(', ');
        setLiveAnnouncement(`Sorted by ${ruleSummary}`);
      }
      return next;
    });
  };

  const pageIds = pageData.map(getRowId);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const somePageSelected = pageIds.some((id) => selectedIds.includes(id)) && !allPageSelected;

  const updateSelectedIds = React.useCallback(
    (next: string[]) => {
      if (!isSelectionControlled) {
        setInternalSelectedIds(next);
      }
      onSelectedIdsChange?.(next);
      setLiveAnnouncement(`${next.length} rows selected`);
    },
    [isSelectionControlled, onSelectedIdsChange]
  );

  const toggleAllOnPage = (checked: boolean) => {
    if (checked) {
      const merged = Array.from(new Set([...selectedIds, ...pageIds]));
      updateSelectedIds(merged);
    } else {
      const next = selectedIds.filter((id) => !pageIds.includes(id));
      updateSelectedIds(next);
    }
  };

  const toggleRow = (id: string, checked: boolean) => {
    const next = checked
      ? Array.from(new Set([...selectedIds, id]))
      : selectedIds.filter((item) => item !== id);
    updateSelectedIds(next);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const moveColumnOrder = (key: string, dir: -1 | 1) => {
    setColumnOrder((prev) => {
      const idx = prev.indexOf(key);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  };

  const handleExport = () => {
    if (onExport) {
      onExport(sortedData);
      return;
    }
    if (typeof document === 'undefined' || typeof Blob === 'undefined') return;
    const headers = visibleColumns.map((c) => escapeCsvField(typeof c.header === 'string' ? c.header : c.key));
    const lines = [
      headers.join(','),
      ...sortedData.map((row) =>
        visibleColumns
          .map((c) => escapeCsvField(c.accessor ? c.accessor(row) : ''))
          .join(',')
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedRows = React.useMemo(
    () => data.filter((row) => selectedIds.includes(getRowId(row))),
    [data, getRowId, selectedIds]
  );

  const activeFilterEntries = Object.entries(columnFilters).filter(([, v]) => Boolean(v));
  const hasAdvancedToolbar = Boolean(
    searchable ||
      columnVisibilityToggle ||
      columnReorderable ||
      enableExport ||
      savedViews ||
      filterableColumns.length > 0 ||
      renderToolbar ||
      (bulkActions && selectedIds.length > 0)
  );

  const useCards =
    responsiveCardMode === 'cards' || (responsiveCardMode === 'auto' && isMobile);

  const groupColumn = groupBy ? columns.find((c) => c.key === groupBy) : undefined;
  const groupedEntries = React.useMemo(() => {
    if (!groupColumn?.accessor) return null;
    const map = new Map<string, T[]>();
    for (const row of pageData) {
      const val = String(groupColumn.accessor(row) ?? 'Other');
      const list = map.get(val) ?? [];
      list.push(row);
      map.set(val, list);
    }
    return Array.from(map.entries());
  }, [groupColumn, pageData]);

  // Virtualization calculations (when enabled and not grouped)
  const visibleSlice = React.useMemo(() => {
    if (!virtualized || groupedEntries) {
      return { rows: pageData, topPad: 0, bottomPad: 0 };
    }
    const overscan = 4;
    const startIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visibleCount = Math.ceil(virtualViewportHeight / rowHeight) + overscan * 2;
    const endIdx = Math.min(pageData.length, startIdx + visibleCount);
    return {
      rows: pageData.slice(startIdx, endIdx),
      topPad: startIdx * rowHeight,
      bottomPad: Math.max(0, (pageData.length - endIdx) * rowHeight),
    };
  }, [groupedEntries, pageData, rowHeight, scrollTop, virtualViewportHeight, virtualized]);

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading table data"
        className={cn('space-y-2 rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-4', className)}
      >
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} height={40} className="w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    const errorMessage =
      typeof error === 'boolean'
        ? 'An error occurred while loading table records.'
        : error;
    return (
      <Alert
        variant="destructive"
        title={errorTitle}
        icon={<AlertCircle className="h-4 w-4 shrink-0" />}
        action={
          onRetry ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              {retryLabel}
            </Button>
          ) : undefined
        }
        className={className}
      >
        {errorMessage}
      </Alert>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        className={className}
      />
    );
  }

  const totalColCount =
    visibleColumns.length +
    (selectable ? 1 : 0) +
    (renderExpandedRow ? 1 : 0) +
    (rowActions ? 1 : 0);

  const renderDataRow = (row: T) => {
    const id = getRowId(row);
    const rowLabel = getRowLabel ? getRowLabel(row) : id;
    const isSelected = selectedIds.includes(id);
    const isExpanded = expandedIds.has(id);

    return (
      <React.Fragment key={id}>
        <TableRow data-selected={isSelected}>
          {renderExpandedRow && (
            <TableCell className="w-9">
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} row ${rowLabel}`}
                onClick={() => toggleExpand(id)}
                className="inline-flex h-6 w-6 items-center justify-center rounded-[var(--wdr-radius-sm)] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </TableCell>
          )}
          {selectable && (
            <TableCell className="w-11">
              <Checkbox
                aria-label={`Select row ${rowLabel}`}
                checked={isSelected}
                onCheckedChange={(checked) => toggleRow(id, checked)}
              />
            </TableCell>
          )}
          {visibleColumns.map((col) => {
            const isEditing = editingCell?.rowId === id && editingCell?.colKey === col.key;
            const rawVal = col.accessor ? String(col.accessor(row) ?? '') : '';
            return (
              <TableCell
                key={col.key}
                className={cn(
                  col.align === 'right' && 'text-right',
                  col.pin === 'left' && 'sticky left-0 bg-surface',
                  col.pin === 'right' && 'sticky right-0 bg-surface'
                )}
              >
                {col.editable && onCellEdit ? (
                  isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        autoFocus
                        aria-label={`Edit ${typeof col.header === 'string' ? col.header : col.key} for ${rowLabel}`}
                        value={editingCell.draft}
                        onChange={(e) =>
                          setEditingCell((prev) => (prev ? { ...prev, draft: e.target.value } : null))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            onCellEdit(id, col.key, editingCell.draft);
                            setEditingCell(null);
                          } else if (e.key === 'Escape') {
                            setEditingCell(null);
                          }
                        }}
                        className="h-7 w-full min-w-[90px] rounded border border-input bg-surface px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <button
                        type="button"
                        aria-label="Save cell edit"
                        onClick={() => {
                          onCellEdit(id, col.key, editingCell.draft);
                          setEditingCell(null);
                        }}
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground"
                      >
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <div className="group inline-flex items-center gap-1.5">
                      <span>{col.cell(row)}</span>
                      <button
                        type="button"
                        aria-label={`Edit ${typeof col.header === 'string' ? col.header : col.key} for ${rowLabel}`}
                        onClick={() => setEditingCell({ rowId: id, colKey: col.key, draft: rawVal })}
                        className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground opacity-70 hover:bg-muted hover:text-foreground hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Pencil className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </div>
                  )
                ) : (
                  col.cell(row)
                )}
              </TableCell>
            );
          })}
          {rowActions && (
            <TableCell className="text-right">{rowActions(row)}</TableCell>
          )}
        </TableRow>
        {renderExpandedRow && isExpanded && (
          <TableRow>
            <TableCell colSpan={totalColCount} className="bg-muted/35 p-4">
              {renderExpandedRow(row)}
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="sr-only" role="status" aria-live="polite">
        {liveAnnouncement}
      </div>

      {hasAdvancedToolbar && (
        <div className="space-y-2.5">
          {savedViews && savedViews.length > 0 && (
            <SavedViewsBar
              views={savedViews}
              activeViewId={activeViewId ?? savedViews[0].id}
              onSelectView={(id) => {
                const found = savedViews.find((v) => v.id === id);
                if (!found) return;
                if (found.searchQuery !== undefined) setSearchQuery(found.searchQuery);
                if (found.columnFilters !== undefined) setColumnFilters(found.columnFilters);
                if (found.sortRules !== undefined) setSortRules(found.sortRules);
                setPage(1);
                onSelectView?.(found);
              }}
              onSaveView={
                onSaveView
                  ? (name) => onSaveView(name, { searchQuery, columnFilters, sortRules })
                  : undefined
              }
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {searchable && (
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    className="h-9 w-56 rounded-[var(--wdr-radius-md)] border border-input bg-surface pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              )}

              {filterableColumns.map((col) => {
                const options =
                  col.filterOptions ??
                  Array.from(
                    new Set(
                      data
                        .map((r) => col.accessor?.(r))
                        .filter((v): v is string | number | boolean => v !== undefined && v !== null)
                        .map((v) => String(v))
                    )
                  ).map((v) => ({ label: v, value: v }));

                return (
                  <select
                    key={col.key}
                    aria-label={`Filter by ${typeof col.header === 'string' ? col.header : col.key}`}
                    value={columnFilters[col.key] ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setColumnFilters((prev) => ({ ...prev, [col.key]: val }));
                      setPage(1);
                    }}
                    className="h-9 rounded-[var(--wdr-radius-md)] border border-input bg-surface px-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">All {typeof col.header === 'string' ? col.header : col.key}</option>
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {renderToolbar?.({
                totalCount: data.length,
                filteredCount: filteredData.length,
                selectedCount: selectedIds.length,
              })}

              {enableExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  leftIcon={<Download className="h-3.5 w-3.5" aria-hidden="true" />}
                >
                  Export
                </Button>
              )}

              {(columnVisibilityToggle || columnReorderable) && (
                <Popover
                  open={colMenuOpen}
                  onOpenChange={setColMenuOpen}
                  aria-label="Toggle and reorder columns"
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Columns3 className="h-3.5 w-3.5" aria-hidden="true" />}
                    >
                      Columns
                    </Button>
                  }
                >
                  <div className="w-60 space-y-2 p-2">
                    <div className="text-xs font-semibold text-foreground">Visible & ordered columns</div>
                    {orderedColumns.map((col, idx) => {
                      const visible = !hiddenCols.has(col.key);
                      const label = typeof col.header === 'string' ? col.header : col.key;
                      return (
                        <div key={col.key} className="flex items-center justify-between gap-2 text-xs text-foreground">
                          <label className="flex cursor-pointer items-center gap-2 truncate">
                            <input
                              type="checkbox"
                              checked={visible}
                              disabled={visible && visibleColumns.length <= 1}
                              onChange={(e) => {
                                setHiddenCols((prev) => {
                                  const next = new Set(prev);
                                  if (e.target.checked) next.delete(col.key);
                                  else next.add(col.key);
                                  return next;
                                });
                              }}
                            />
                            <span className="truncate">{label}</span>
                          </label>
                          {columnReorderable && (
                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                aria-label={`Move ${label} column left`}
                                onClick={() => moveColumnOrder(col.key, -1)}
                                className="inline-flex h-6 w-6 items-center justify-center rounded border border-border hover:bg-muted disabled:opacity-40"
                              >
                                <ArrowUp className="h-3 w-3" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === orderedColumns.length - 1}
                                aria-label={`Move ${label} column right`}
                                onClick={() => moveColumnOrder(col.key, 1)}
                                className="inline-flex h-6 w-6 items-center justify-center rounded border border-border hover:bg-muted disabled:opacity-40"
                              >
                                <ArrowDown className="h-3 w-3" aria-hidden="true" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Popover>
              )}
            </div>
          </div>

          {(activeFilterEntries.length > 0 || searchQuery.trim()) && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1 rounded-[var(--wdr-radius-small,4px)] border border-border bg-muted px-2 py-0.5 text-foreground hover:bg-muted/80"
                >
                  <span>Search: {searchQuery}</span>
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              )}
              {activeFilterEntries.map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setColumnFilters((prev) => ({ ...prev, [key]: '' }))}
                  className="inline-flex items-center gap-1 rounded-[var(--wdr-radius-small,4px)] border border-border bg-muted px-2 py-0.5 text-foreground hover:bg-muted/80"
                >
                  <span>
                    {key}: {val}
                  </span>
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}

          {bulkActions && selectedIds.length > 0 && (
            <div
              role="region"
              aria-label="Bulk selection actions"
              className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--wdr-radius-md)] border border-border bg-primary-subtle px-3 py-2 text-xs"
            >
              <span className="font-semibold text-primary-subtle-foreground tabular-nums">
                {selectedIds.length} selected
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {bulkActions.map((act) => (
                  <Button
                    key={act.id}
                    variant={act.variant === 'destructive' ? 'destructive' : 'secondary'}
                    size="sm"
                    onClick={() => act.onAction(selectedRows, selectedIds)}
                  >
                    {act.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {filteredData.length === 0 ? (
        <EmptyState
          title="No matching records"
          description="Clear search or active column filters to see all records."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setColumnFilters({});
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : useCards ? (
        <div className="space-y-2.5" role="list" aria-label={ariaLabel ?? 'Mobile record list'}>
          {pageData.map((row) => {
            const id = getRowId(row);
            const rowLabel = getRowLabel ? getRowLabel(row) : id;
            const isSelected = selectedIds.includes(id);
            if (renderMobileCard) {
              return (
                <div key={id} role="listitem">
                  {renderMobileCard(row, {
                    selected: isSelected,
                    onToggleSelect: (checked) => toggleRow(id, checked),
                  })}
                </div>
              );
            }
            return (
              <div
                key={id}
                role="listitem"
                data-selected={isSelected}
                className={cn(
                  'rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-3.5 shadow-[var(--wdr-shadow-sm)] space-y-2',
                  isSelected && 'border-primary bg-primary-subtle/30'
                )}
              >
                {(selectable || rowActions) && (
                  <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
                    {selectable ? (
                      <Checkbox
                        aria-label={`Select row ${rowLabel}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => toggleRow(id, checked)}
                      />
                    ) : (
                      <span />
                    )}
                    {rowActions && <div className="flex items-center gap-1">{rowActions(row)}</div>}
                  </div>
                )}
                <dl className="grid grid-cols-1 gap-1.5 text-xs">
                  {visibleColumns.map((col) => (
                    <div key={col.key} className="flex items-start justify-between gap-3">
                      <dt className="font-medium text-muted-foreground">{col.header}</dt>
                      <dd className="text-right text-foreground">{col.cell(row)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          onScroll={virtualized ? (e) => setScrollTop(e.currentTarget.scrollTop) : undefined}
          style={virtualized ? { maxHeight: `${virtualViewportHeight}px` } : undefined}
          className={cn(
            (stickyHeader || virtualized) && 'max-h-[460px] overflow-auto rounded-[var(--wdr-radius-lg)]'
          )}
        >
          <Table aria-label={ariaLabel}>
            <TableHeader className={cn((stickyHeader || virtualized) && 'sticky top-0 z-10 bg-muted')}>
              <TableRow>
                {renderExpandedRow && <TableHead className="w-9" />}
                {selectable && (
                  <TableHead className="w-11">
                    <Checkbox
                      aria-label="Select all rows on page"
                      checked={allPageSelected}
                      indeterminate={somePageSelected}
                      onCheckedChange={toggleAllOnPage}
                    />
                  </TableHead>
                )}
                {visibleColumns.map((col) => {
                  const rule = sortRules.find((r) => r.key === col.key);
                  const ariaSort = rule
                    ? rule.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined;
                  const resolvedWidth = colWidths[col.key] ? `${colWidths[col.key]}px` : col.width;

                  return (
                    <TableHead
                      key={col.key}
                      aria-sort={ariaSort}
                      style={{ width: resolvedWidth }}
                      className={cn(
                        'relative',
                        col.align === 'right' && 'text-right',
                        col.pin === 'left' && 'sticky left-0 z-10 bg-muted',
                        col.pin === 'right' && 'sticky right-0 z-10 bg-muted'
                      )}
                    >
                      {col.sortable && col.accessor ? (
                        <button
                          type="button"
                          onClick={(e) => toggleSort(col.key, e.shiftKey)}
                          className={cn(
                            'inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[var(--wdr-radius-small,4px)]',
                            col.align === 'right' && 'flex-row-reverse'
                          )}
                        >
                          <span>{col.header}</span>
                          {rule?.direction === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                          ) : rule?.direction === 'desc' ? (
                            <ArrowDown className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-55" aria-hidden="true" />
                          )}
                        </button>
                      ) : (
                        col.header
                      )}
                      {columnResizable && (
                        <button
                          type="button"
                          aria-label={`Widen ${typeof col.header === 'string' ? col.header : col.key} column`}
                          onClick={() =>
                            setColWidths((prev) => ({
                              ...prev,
                              [col.key]: (prev[col.key] ?? col.minWidth ?? 140) + 24,
                            }))
                          }
                          className="absolute right-0 top-1 bottom-1 w-1.5 cursor-col-resize hover:bg-primary/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      )}
                    </TableHead>
                  );
                })}
                {rowActions && <TableHead className="w-20 text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedEntries ? (
                groupedEntries.map(([groupVal, groupRows]) => {
                  const collapsed = collapsedGroups.has(groupVal);
                  return (
                    <React.Fragment key={groupVal}>
                      <TableRow className="bg-muted/50 hover:bg-muted/60">
                        <TableCell colSpan={totalColCount} className="font-semibold text-xs text-foreground">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <button
                              type="button"
                              aria-expanded={!collapsed}
                              onClick={() =>
                                setCollapsedGroups((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(groupVal)) next.delete(groupVal);
                                  else next.add(groupVal);
                                  return next;
                                })
                              }
                              className="inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                            >
                              {collapsed ? (
                                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                              )}
                              <span>{groupVal}</span>
                              <span className="rounded bg-surface px-1.5 py-0.5 text-[11px] text-muted-foreground tabular-nums">
                                {groupRows.length}
                              </span>
                            </button>
                            {groupSummary && (
                              <div className="text-xs font-normal text-muted-foreground tabular-nums">
                                {groupSummary(groupVal, groupRows)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      {!collapsed && groupRows.map(renderDataRow)}
                    </React.Fragment>
                  );
                })
              ) : (
                <>
                  {visibleSlice.topPad > 0 && (
                    <tr aria-hidden="true">
                      <td colSpan={totalColCount} style={{ height: `${visibleSlice.topPad}px`, padding: 0 }} />
                    </tr>
                  )}
                  {visibleSlice.rows.map(renderDataRow)}
                  {visibleSlice.bottomPad > 0 && (
                    <tr aria-hidden="true">
                      <td colSpan={totalColCount} style={{ height: `${visibleSlice.bottomPad}px`, padding: 0 }} />
                    </tr>
                  )}
                </>
              )}
              {summaryRow && (
                <TableRow className="border-t-2 border-border bg-muted/40 font-semibold">
                  {renderExpandedRow && <TableCell />}
                  {selectable && <TableCell />}
                  {(() => {
                    const summaryValues = summaryRow({ visibleColumns, rows: sortedData });
                    return visibleColumns.map((col, idx) => (
                      <TableCell
                        key={col.key}
                        className={cn(col.align === 'right' && 'text-right tabular-nums')}
                      >
                        {summaryValues[col.key] ?? (idx === 0 ? summaryLabel : null)}
                      </TableCell>
                    ));
                  })()}
                  {rowActions && <TableCell />}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {!virtualized && (totalPages > 1 || (pageSizeOptions && pageSizeOptions.length > 0)) && filteredData.length > 0 && (
        renderPagination ? (
          renderPagination({ page: safePage, totalPages, onPageChange: setPage })
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-xs text-muted-foreground tabular-nums">
                Showing {(safePage - 1) * safePageSize + 1}–{Math.min(safePage * safePageSize, sortedData.length)} of{' '}
                {sortedData.length} records
              </p>
              {pageSizeOptions && pageSizeOptions.length > 0 && (
                <select
                  aria-label="Rows per page"
                  value={safePageSize}
                  onChange={(e) => {
                    const nextSize = Number(e.target.value);
                    setCurrentPageSize(nextSize);
                    setPage(1);
                    onPageSizeChange?.(nextSize);
                  }}
                  className="h-8 rounded-[var(--wdr-radius-sm)] border border-input bg-surface px-2 text-xs text-foreground"
                >
                  {pageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt} / page
                    </option>
                  ))}
                </select>
              )}
            </div>
            {totalPages > 1 && (
              <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
            )}
          </div>
        )
      )}
    </div>
  );
}
