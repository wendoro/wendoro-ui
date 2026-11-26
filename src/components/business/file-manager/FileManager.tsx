import * as React from 'react';
import {
  Archive,
  Download,
  File,
  FileText,
  Film,
  Folder,
  FolderPlus,
  Image as ImageIcon,
  LayoutGrid,
  List as ListIcon,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Breadcrumb, type BreadcrumbItem } from '../../ui/breadcrumb';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import { SegmentedControl } from '../../ui/controls';
import { EmptyState } from '../../ui/empty-state';
import { ErrorState } from '../../ui/feedback';
import { Skeleton } from '../../ui/skeleton';
import { ContextualDetailPanel } from '../shell';
import { StatusBadge } from '../status-badge';

export type FileAssetKind = 'folder' | 'document' | 'image' | 'media' | 'archive';

export interface FileManagerItem {
  id: string;
  name: string;
  kind: FileAssetKind;
  sizeBytes?: number;
  sizeLabel: string;
  updatedAt: string;
  owner: string;
  mimeType?: string;
  shared?: boolean;
  tags?: string[];
  path?: string;
}

export interface FileManagerProps {
  items: FileManagerItem[];
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onOpenFolder?: (item: FileManagerItem) => void;
  onSelectItem?: (item: FileManagerItem | null) => void;
  onCreateFolder?: () => void;
  onUploadFiles?: (files: File[]) => void;
  onBulkAction?: (action: 'download' | 'delete', ids: string[]) => void;
  className?: string;
}

function getFileIcon(kind: FileAssetKind) {
  switch (kind) {
    case 'folder':
      return <Folder className="h-4 w-4 text-primary-active" aria-hidden="true" />;
    case 'image':
      return <ImageIcon className="h-4 w-4 text-foreground" aria-hidden="true" />;
    case 'media':
      return <Film className="h-4 w-4 text-foreground" aria-hidden="true" />;
    case 'archive':
      return <Archive className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
    case 'document':
      return <FileText className="h-4 w-4 text-foreground" aria-hidden="true" />;
    default:
      return <File className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
  }
}

export function FileManager({
  items,
  breadcrumbs,
  title = 'Asset & File Repository',
  loading = false,
  error,
  onRetry,
  onOpenFolder,
  onSelectItem,
  onCreateFolder,
  onUploadFiles,
  onBulkAction,
  className,
}: FileManagerProps) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [query, setQuery] = React.useState('');
  const [kindFilter, setKindFilter] = React.useState<'all' | FileAssetKind>('all');
  const [sortBy, setSortBy] = React.useState<'name' | 'updated' | 'size'>('name');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [inspectedId, setInspectedId] = React.useState<string | null>(null);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);

  const visibleItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = items.filter((item) => {
      if (kindFilter !== 'all' && item.kind !== kindFilter) return false;
      if (!q) return true;
      return `${item.name} ${item.owner} ${(item.tags ?? []).join(' ')}`.toLowerCase().includes(q);
    });
    return [...filtered].sort((a, b) => {
      if (a.kind === 'folder' && b.kind !== 'folder') return -1;
      if (a.kind !== 'folder' && b.kind === 'folder') return 1;
      if (sortBy === 'size') return (b.sizeBytes ?? 0) - (a.sizeBytes ?? 0);
      if (sortBy === 'updated') return a.updatedAt.localeCompare(b.updatedAt);
      return a.name.localeCompare(b.name);
    });
  }, [items, kindFilter, query, sortBy]);

  const inspectedItem = items.find((item) => item.id === inspectedId) ?? null;

  const toggleSelection = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? Array.from(new Set([...prev, id])) : prev.filter((item) => item !== id)
    );
  };

  const inspectItem = (item: FileManagerItem) => {
    setInspectedId(item.id);
    onSelectItem?.(item);
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3.5">
        <div className="min-w-0 space-y-1">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onUploadFiles && (
            <>
              <input
                ref={uploadInputRef}
                type="file"
                multiple
                aria-label="Upload files"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.length > 0) {
                    onUploadFiles(files);
                  }
                  e.target.value = '';
                }}
              />
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Upload className="h-3.5 w-3.5" />}
                onClick={() => uploadInputRef.current?.click()}
              >
                Upload
              </Button>
            </>
          )}
          {onCreateFolder && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<FolderPlus className="h-3.5 w-3.5" />}
              onClick={onCreateFolder}
            >
              New folder
            </Button>
          )}
          <SegmentedControl
            size="sm"
            aria-label="File view mode"
            value={viewMode}
            onValueChange={(v) => setViewMode(v === 'list' ? 'list' : 'grid')}
            options={[
              { value: 'grid', label: 'Grid', icon: <LayoutGrid className="h-3.5 w-3.5" /> },
              { value: 'list', label: 'List', icon: <ListIcon className="h-3.5 w-3.5" /> },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="pointer-events-none absolute start-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              aria-label="Filter files and folders"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files, owners, tags…"
              className="h-9 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface ps-8 pe-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <select
            aria-label="Filter by asset type"
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value as 'all' | FileAssetKind)}
            className="h-9 rounded-[var(--wdr-radius-md)] border border-input bg-surface px-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All types</option>
            <option value="folder">Folders</option>
            <option value="document">Documents</option>
            <option value="image">Images</option>
            <option value="media">Media</option>
            <option value="archive">Archives</option>
          </select>

          <select
            aria-label="Sort files"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'updated' | 'size')}
            className="h-9 rounded-[var(--wdr-radius-md)] border border-input bg-surface px-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="name">Sort: Name</option>
            <option value="updated">Sort: Updated</option>
            <option value="size">Sort: Size</option>
          </select>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2" role="region" aria-label="Bulk file actions">
            <span className="text-xs font-semibold tabular-nums text-foreground">
              {selectedIds.length} selected
            </span>
            {onBulkAction && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Download className="h-3.5 w-3.5" />}
                  onClick={() => onBulkAction('download', selectedIds)}
                >
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  onClick={() => {
                    onBulkAction('delete', selectedIds);
                    setSelectedIds([]);
                  }}
                >
                  Delete
                </Button>
              </>
            )}
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
              Clear
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="min-w-0 flex-1 p-4">
          {error ? (
            <ErrorState title="Unable to load repository" description={error} onRetry={onRetry} />
          ) : loading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading files">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="rounded-[var(--wdr-radius-md)] border border-border p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : visibleItems.length === 0 ? (
            <EmptyState
              title="No matching files or folders"
              description="Adjust your search filter or upload new assets into this workspace folder."
              action={
                query || kindFilter !== 'all' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setQuery('');
                      setKindFilter('all');
                    }}
                  >
                    Reset filters
                  </Button>
                ) : undefined
              }
            />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {visibleItems.map((item) => {
                const selected = selectedIds.includes(item.id);
                const inspected = inspectedId === item.id;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'rounded-[var(--wdr-radius-md)] border bg-surface p-3.5 transition-colors space-y-2.5',
                      inspected ? 'border-foreground ring-1 ring-ring' : 'border-border hover:border-foreground/40'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          inspectItem(item);
                          if (item.kind === 'folder') onOpenFolder?.(item);
                        }}
                        className="flex min-w-0 flex-1 items-center gap-2.5 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      >
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--wdr-radius-sm)] bg-muted">
                          {getFileIcon(item.kind)}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate text-xs font-semibold text-foreground">{item.name}</div>
                          <div className="truncate text-[11px] text-muted-foreground tabular-nums">
                            {item.sizeLabel} · {item.updatedAt}
                          </div>
                        </div>
                      </button>
                      <Checkbox
                        aria-label={`Select ${item.name}`}
                        checked={selected}
                        onCheckedChange={(checked) => toggleSelection(item.id, Boolean(checked))}
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
                      <span className="truncate">{item.owner}</span>
                      {item.shared && <StatusBadge status="active" label="Shared" />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border text-start text-muted-foreground">
                    <th className="w-8 py-2 pe-2">
                      <Checkbox
                        aria-label="Select all visible files"
                        checked={visibleItems.length > 0 && visibleItems.every((i) => selectedIds.includes(i.id))}
                        onCheckedChange={(checked) =>
                          setSelectedIds(checked ? visibleItems.map((i) => i.id) : [])
                        }
                      />
                    </th>
                    <th className="py-2 pe-3 font-medium">Name</th>
                    <th className="py-2 pe-3 font-medium">Owner</th>
                    <th className="py-2 pe-3 font-medium">Size</th>
                    <th className="py-2 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {visibleItems.map((item) => {
                    const selected = selectedIds.includes(item.id);
                    const inspected = inspectedId === item.id;
                    return (
                      <tr key={item.id} className={cn(inspected && 'bg-primary-subtle/30')}>
                        <td className="py-2.5 pe-2">
                          <Checkbox
                            aria-label={`Select ${item.name}`}
                            checked={selected}
                            onCheckedChange={(checked) => toggleSelection(item.id, Boolean(checked))}
                          />
                        </td>
                        <td className="py-2.5 pe-3">
                          <button
                            type="button"
                            onClick={() => {
                              inspectItem(item);
                              if (item.kind === 'folder') onOpenFolder?.(item);
                            }}
                            className="inline-flex items-center gap-2 font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                          >
                            {getFileIcon(item.kind)}
                            <span>{item.name}</span>
                          </button>
                        </td>
                        <td className="py-2.5 pe-3 text-muted-foreground">{item.owner}</td>
                        <td className="py-2.5 pe-3 tabular-nums text-muted-foreground">{item.sizeLabel}</td>
                        <td className="py-2.5 tabular-nums text-muted-foreground">{item.updatedAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <ContextualDetailPanel
          open={Boolean(inspectedItem)}
          onOpenChange={(open) => {
            if (!open) {
              setInspectedId(null);
              onSelectItem?.(null);
            }
          }}
          title={inspectedItem?.name ?? 'File inspector'}
          subtitle={inspectedItem ? `${inspectedItem.kind.toUpperCase()} · ${inspectedItem.sizeLabel}` : undefined}
        >
          {inspectedItem && (
            <div className="space-y-4 text-xs">
              <dl className="space-y-2 rounded-[var(--wdr-radius-md)] border border-border bg-muted/20 p-3">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Owner</dt>
                  <dd className="font-medium text-foreground">{inspectedItem.owner}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd className="font-medium tabular-nums text-foreground">{inspectedItem.updatedAt}</dd>
                </div>
                {inspectedItem.mimeType && (
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Format</dt>
                    <dd className="font-mono text-foreground">{inspectedItem.mimeType}</dd>
                  </div>
                )}
                {inspectedItem.path && (
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Path</dt>
                    <dd className="truncate font-mono text-foreground">{inspectedItem.path}</dd>
                  </div>
                )}
              </dl>
              {inspectedItem.tags && inspectedItem.tags.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-semibold text-foreground">Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectedItem.tags.map((tag) => (
                      <span key={tag} className="rounded bg-muted px-2 py-0.5 text-[11px] text-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ContextualDetailPanel>
      </div>
    </Card>
  );
}
