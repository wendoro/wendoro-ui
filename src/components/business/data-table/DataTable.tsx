import * as React from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Columns3,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
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

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  accessor?: (row: T) => string | number | boolean | null | undefined;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: Array<{ label: string; value: string }>;
  defaultHidden?: boolean;
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
  columnResizable?: boolean;
  stickyHeader?: boolean;
  bulkActions?: DataTableBulkAction<T>[];
  renderExpandedRow?: (row: T) => React.ReactNode;
  rowActions?: (row: T) => React.ReactNode;
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
  columnResizable = false,
  stickyHeader = false,
  bulkActions,
  renderExpandedRow,
  rowActions,
  renderToolbar,
  renderPagination,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search query or clearing active filters.',
  emptyAction,
  'aria-label': ariaLabel,
  className,
}: DataTableProps<T>) {
  const [sortRules, setSortRules] = React.useState<DataTableSortRule[]>([]);
  const [page, setPage] = React.useState(1);
  const [currentPageSize, setCurrentPageSize] = React.useState(Math.max(1, pageSize));
  const [searchQuery, setSearchQuery] = React.useState('');
  const [columnFilters, setColumnFilters] = React.useState<Record<string, string>>({});
  const [hiddenCols, setHiddenCols] = React.useState<Set<string>>(
    () => new Set(columns.filter((c) => c.defaultHidden).map((c) => c.key))
  );
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());
  const [colWidths, setColWidths] = React.useState<Record<string, number>>({});
  const [colMenuOpen, setColMenuOpen] = React.useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = React.useState('');
  const [internalSelectedIds, setInternalSelectedIds] = React.useState<string[]>([]);
  const isSelectionControlled = controlledSelectedIds !== undefined;
  const selectedIds = isSelectionControlled ? controlledSelectedIds : internalSelectedIds;

  React.useEffect(() => {
    setCurrentPageSize(Math.max(1, pageSize));
  }, [pageSize]);

  const safePageSize = Math.max(1, currentPageSize);

  const visibleColumns = React.useMemo(
    () => columns.filter((col) => !hiddenCols.has(col.key)),
    [columns, hiddenCols]
  );

  const filterableColumns = React.useMemo(
    () => columns.filter((c) => c.filterable && c.accessor),
    [columns]
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

  const totalPages = Math.max(1, Math.ceil(sortedData.length / safePageSize));
  const safePage = Math.min(page, totalPages);
  const pageData = React.useMemo(() => {
    const start = (safePage - 1) * safePageSize;
    return sortedData.slice(start, start + safePageSize);
  }, [safePage, safePageSize, sortedData]);

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

  const selectedRows = React.useMemo(
    () => data.filter((row) => selectedIds.includes(getRowId(row))),
    [data, getRowId, selectedIds]
  );

  const activeFilterEntries = Object.entries(columnFilters).filter(([, v]) => Boolean(v));
  const hasAdvancedToolbar = Boolean(
    searchable ||
      columnVisibilityToggle ||
      filterableColumns.length > 0 ||
      renderToolbar ||
      (bulkActions && selectedIds.length > 0)
  );

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

  return (
    <div className={cn('space-y-3', className)}>
      <div className="sr-only" role="status" aria-live="polite">
        {liveAnnouncement}
      </div>

      {hasAdvancedToolbar && (
        <div className="space-y-2">
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

              {columnVisibilityToggle && (
                <Popover
                  open={colMenuOpen}
                  onOpenChange={setColMenuOpen}
                  aria-label="Toggle columns"
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
                  <div className="w-48 space-y-2 p-2">
                    <div className="text-xs font-semibold text-foreground">Visible columns</div>
                    {columns.map((col) => {
                      const visible = !hiddenCols.has(col.key);
                      const label = typeof col.header === 'string' ? col.header : col.key;
                      return (
                        <label key={col.key} className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
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
                          <span>{label}</span>
                        </label>
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
      ) : (
        <div className={cn(stickyHeader && 'max-h-[460px] overflow-auto rounded-[var(--wdr-radius-lg)]')}>
          <Table aria-label={ariaLabel}>
            <TableHeader className={cn(stickyHeader && 'sticky top-0 z-10 bg-muted')}>
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
              {pageData.map((row) => {
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
                      {visibleColumns.map((col) => (
                        <TableCell
                          key={col.key}
                          className={cn(
                            col.align === 'right' && 'text-right',
                            col.pin === 'left' && 'sticky left-0 bg-surface',
                            col.pin === 'right' && 'sticky right-0 bg-surface'
                          )}
                        >
                          {col.cell(row)}
                        </TableCell>
                      ))}
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
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {(totalPages > 1 || (pageSizeOptions && pageSizeOptions.length > 0)) && filteredData.length > 0 && (
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
