import * as React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Checkbox } from '../../ui/checkbox';
import { EmptyState } from '../../ui/empty-state';
import { Pagination } from '../../ui/pagination';
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
  align?: 'left' | 'right';
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  loading?: boolean;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  'aria-label'?: string;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T>({
  data,
  columns,
  getRowId,
  loading = false,
  selectable = false,
  selectedIds = [],
  onSelectedIdsChange,
  pageSize = 10,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search query or clearing active filters.',
  emptyAction,
  'aria-label': ariaLabel,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDirection>(null);
  const [page, setPage] = React.useState(1);

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDir) return data;
    const column = columns.find((c) => c.key === sortKey);
    if (!column?.accessor) return data;

    const copy = [...data];
    copy.sort((a, b) => {
      const valA = column.accessor!(a) ?? '';
      const valB = column.accessor!(b) ?? '';
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return sortDir === 'asc' ? -1 : 1;
      if (strA > strB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [columns, data, sortDir, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageData = React.useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [pageSize, safePage, sortedData]);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  };

  const pageIds = pageData.map(getRowId);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const somePageSelected = pageIds.some((id) => selectedIds.includes(id)) && !allPageSelected;

  const toggleAllOnPage = (checked: boolean) => {
    if (!onSelectedIdsChange) return;
    if (checked) {
      const merged = Array.from(new Set([...selectedIds, ...pageIds]));
      onSelectedIdsChange(merged);
    } else {
      onSelectedIdsChange(selectedIds.filter((id) => !pageIds.includes(id)));
    }
  };

  const toggleRow = (id: string, checked: boolean) => {
    if (!onSelectedIdsChange) return;
    if (checked) {
      onSelectedIdsChange([...selectedIds, id]);
    } else {
      onSelectedIdsChange(selectedIds.filter((item) => item !== id));
    }
  };

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

  return (
    <div className={cn('space-y-3', className)}>
      <Table aria-label={ariaLabel}>
        <TableHeader>
          <TableRow>
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
            {columns.map((col) => {
              const isSorted = sortKey === col.key;
              const ariaSort = isSorted
                ? sortDir === 'asc'
                  ? 'ascending'
                  : 'descending'
                : undefined;

              return (
                <TableHead
                  key={col.key}
                  aria-sort={ariaSort}
                  style={{ width: col.width }}
                  className={cn(col.align === 'right' && 'text-right')}
                >
                  {col.sortable && col.accessor ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={cn(
                        'inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[var(--wdr-radius-small,4px)]',
                        col.align === 'right' && 'flex-row-reverse'
                      )}
                    >
                      <span>{col.header}</span>
                      {isSorted && sortDir === 'asc' ? (
                        <ArrowUp className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                      ) : isSorted && sortDir === 'desc' ? (
                        <ArrowDown className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-55" aria-hidden="true" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageData.map((row) => {
            const id = getRowId(row);
            const isSelected = selectedIds.includes(id);

            return (
              <TableRow key={id} data-selected={isSelected}>
                {selectable && (
                  <TableCell className="w-11">
                    <Checkbox
                      aria-label={`Select row ${id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => toggleRow(id, checked)}
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key} className={cn(col.align === 'right' && 'text-right')}>
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground tabular-nums">
            Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sortedData.length)} of{' '}
            {sortedData.length} records
          </p>
          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
