import * as React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Card } from '../../ui/card';

export interface TreeNode {
  id: string;
  label: string;
  meta?: string;
  children?: TreeNode[];
}

export interface TreeItemProps {
  node: TreeNode;
  level?: number;
  expandedIds: Set<string>;
  selectedId?: string;
  onToggle: (id: string) => void;
  onSelect?: (node: TreeNode) => void;
}

export function TreeItem({
  node,
  level = 1,
  expandedIds,
  selectedId,
  onToggle,
  onSelect,
}: TreeItemProps) {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <li
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-2 rounded-[var(--wdr-radius-sm)] px-2 py-1.5 text-sm transition-colors',
          isSelected ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground hover:bg-muted'
        )}
        style={{ paddingLeft: `${level * 14 - 6}px` }}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          {hasChildren ? (
            <button
              type="button"
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${node.label}`}
              onClick={() => onToggle(node.id)}
              className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-background/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
          ) : (
            <span className="inline-block w-5 shrink-0" aria-hidden="true" />
          )}
          <button
            type="button"
            onClick={() => onSelect?.(node)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
                e.preventDefault();
                onToggle(node.id);
              } else if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
                e.preventDefault();
                onToggle(node.id);
              }
            }}
            className="truncate text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            {node.label}
          </button>
        </div>
        {node.meta && (
          <span className={cn('text-xs shrink-0', isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
            {node.meta}
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <ul role="group" className="space-y-0.5">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export interface TreeViewProps {
  nodes: TreeNode[];
  defaultExpandedIds?: string[];
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
  'aria-label'?: string;
  className?: string;
}

export function TreeView({
  nodes,
  defaultExpandedIds = [],
  selectedId,
  onSelect,
  'aria-label': ariaLabel = 'Hierarchy tree',
  className,
}: TreeViewProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set(defaultExpandedIds));

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <ul role="tree" aria-label={ariaLabel} className={cn('space-y-0.5 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-2', className)}>
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          expandedIds={expanded}
          selectedId={selectedId}
          onToggle={toggle}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

export function NestedList(props: TreeViewProps) {
  return <TreeView {...props} />;
}

export function HierarchyView({
  title,
  nodes,
  defaultExpandedIds,
  selectedId,
  onSelect,
  className,
}: TreeViewProps & { title?: string }) {
  return (
    <Card className={cn('p-4 space-y-3', className)}>
      {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
      <TreeView
        nodes={nodes}
        defaultExpandedIds={defaultExpandedIds}
        selectedId={selectedId}
        onSelect={onSelect}
        className="border-0 p-0"
      />
    </Card>
  );
}
