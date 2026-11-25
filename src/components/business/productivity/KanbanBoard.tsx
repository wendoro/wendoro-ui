import * as React from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  GripVertical,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Alert } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { EmptyState } from '../../ui/empty-state';
import { Skeleton } from '../../ui/skeleton';

export interface KanbanCardItem {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
}

export interface KanbanColumnSpec {
  id: string;
  title: string;
  wipLimit?: number;
}

export interface KanbanBoardProps {
  columns: KanbanColumnSpec[];
  cards: KanbanCardItem[];
  onMoveCard?: (cardId: string, toColumnId: string, toIndex: number) => void;
  onCardSelect?: (card: KanbanCardItem) => void;
  onAddCard?: (columnId: string) => void;
  loading?: boolean;
  error?: React.ReactNode;
  onRetry?: () => void;
  className?: string;
}

const PRIORITY_CLASSES: Record<NonNullable<KanbanCardItem['priority']>, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning-subtle text-warning-subtle-foreground',
  high: 'bg-destructive-subtle text-destructive-subtle-foreground',
};

export interface KanbanCardProps {
  card: KanbanCardItem;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onSelect?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function KanbanCard({
  card,
  canMoveLeft,
  canMoveRight,
  canMoveUp,
  canMoveDown,
  onMoveLeft,
  onMoveRight,
  onMoveUp,
  onMoveDown,
  onSelect,
  onDragStart,
}: KanbanCardProps) {
  return (
    <div
      draggable={Boolean(onDragStart)}
      onDragStart={onDragStart}
      className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3.5 shadow-[var(--wdr-shadow-sm)] transition-shadow hover:shadow-[var(--wdr-shadow-md)]"
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={onSelect}
          className="min-w-0 flex-1 text-left text-sm font-semibold text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[var(--wdr-radius-sm)]"
        >
          {card.title}
        </button>
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </div>

      {card.description && (
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{card.description}</p>
      )}

      {card.tags && card.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[var(--wdr-radius-sm)] border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {(card.priority || card.dueDate || card.assignee) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] tabular-nums">
          {card.priority && (
            <span className={cn('rounded px-1.5 py-0.5 font-medium capitalize', PRIORITY_CLASSES[card.priority])}>
              {card.priority}
            </span>
          )}
          {card.assignee && <span className="text-muted-foreground">{card.assignee}</span>}
          {card.dueDate && <span className="text-muted-foreground">{card.dueDate}</span>}
        </div>
      )}

      {(canMoveLeft || canMoveRight || canMoveUp || canMoveDown) && (
        <div className="mt-3 flex items-center gap-1 border-t border-border pt-2" aria-label={`Reorder controls for ${card.title}`}>
          {canMoveLeft && (
            <button
              type="button"
              aria-label={`Move ${card.title} to previous column`}
              onClick={onMoveLeft}
              className="inline-flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
          {canMoveUp && (
            <button
              type="button"
              aria-label={`Move ${card.title} up`}
              onClick={onMoveUp}
              className="inline-flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowUp className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
          {canMoveDown && (
            <button
              type="button"
              aria-label={`Move ${card.title} down`}
              onClick={onMoveDown}
              className="inline-flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowDown className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
          {canMoveRight && (
            <button
              type="button"
              aria-label={`Move ${card.title} to next column`}
              onClick={onMoveRight}
              className="inline-flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export interface KanbanColumnProps {
  column: KanbanColumnSpec;
  count: number;
  onDropCard?: (cardId: string) => void;
  onAddCard?: () => void;
  children: React.ReactNode;
}

export function KanbanColumn({ column, count, onDropCard, onAddCard, children }: KanbanColumnProps) {
  const overWip = column.wipLimit !== undefined && count > column.wipLimit;

  return (
    <Card
      aria-label={`${column.title} column, ${count} items`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const cardId = e.dataTransfer?.getData('text/plain');
        if (cardId) onDropCard?.(cardId);
      }}
      className="flex min-w-[260px] flex-1 flex-col bg-muted/35 p-3"
    >
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'rounded-[var(--wdr-radius-sm)] px-2 py-0.5 text-xs font-medium tabular-nums border',
              overWip
                ? 'border-destructive/40 bg-destructive-subtle text-destructive-subtle-foreground'
                : 'border-border bg-surface text-muted-foreground'
            )}
          >
            {count}
            {column.wipLimit !== undefined ? ` / ${column.wipLimit}` : ''}
          </span>
          {onAddCard && (
            <button
              type="button"
              aria-label={`Add card to ${column.title}`}
              onClick={onAddCard}
              className="inline-flex h-6 w-6 items-center justify-center rounded border border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 space-y-2.5">{children}</div>
    </Card>
  );
}

export function KanbanBoard({
  columns,
  cards,
  onMoveCard,
  onCardSelect,
  onAddCard,
  loading = false,
  error,
  onRetry,
  className,
}: KanbanBoardProps) {
  const [liveStatus, setLiveStatus] = React.useState('');

  if (loading) {
    return (
      <div role="status" aria-label="Loading board" className={cn('grid grid-cols-1 gap-4 md:grid-cols-3', className)}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} height={220} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        variant="destructive"
        title="Unable to load board"
        icon={<AlertCircle className="h-4 w-4" />}
        action={
          onRetry ? (
            <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
              Retry
            </Button>
          ) : undefined
        }
        className={className}
      >
        {error}
      </Alert>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="sr-only" role="status" aria-live="polite">
        {liveStatus}
      </div>
      <div className="flex flex-col gap-4 overflow-x-auto pb-2 lg:flex-row">
        {columns.map((col, colIdx) => {
          const colCards = cards.filter((c) => c.columnId === col.id);

          return (
            <KanbanColumn
              key={col.id}
              column={col}
              count={colCards.length}
              onAddCard={onAddCard ? () => onAddCard(col.id) : undefined}
              onDropCard={(cardId) => {
                onMoveCard?.(cardId, col.id, colCards.length);
                setLiveStatus(`Moved card to ${col.title}`);
              }}
            >
              {colCards.length === 0 ? (
                <EmptyState title="No items" description="Drag or move cards into this stage." className="p-4" />
              ) : (
                colCards.map((card, cardIdx) => {
                  const prevCol = colIdx > 0 ? columns[colIdx - 1] : undefined;
                  const nextCol = colIdx < columns.length - 1 ? columns[colIdx + 1] : undefined;

                  return (
                    <KanbanCard
                      key={card.id}
                      card={card}
                      canMoveLeft={Boolean(onMoveCard && prevCol)}
                      canMoveRight={Boolean(onMoveCard && nextCol)}
                      canMoveUp={Boolean(onMoveCard && cardIdx > 0)}
                      canMoveDown={Boolean(onMoveCard && cardIdx < colCards.length - 1)}
                      onMoveLeft={
                        prevCol
                          ? () => {
                              onMoveCard?.(card.id, prevCol.id, 0);
                              setLiveStatus(`Moved ${card.title} to ${prevCol.title}`);
                            }
                          : undefined
                      }
                      onMoveRight={
                        nextCol
                          ? () => {
                              onMoveCard?.(card.id, nextCol.id, 0);
                              setLiveStatus(`Moved ${card.title} to ${nextCol.title}`);
                            }
                          : undefined
                      }
                      onMoveUp={
                        cardIdx > 0
                          ? () => {
                              onMoveCard?.(card.id, col.id, cardIdx - 1);
                              setLiveStatus(`Moved ${card.title} up in ${col.title}`);
                            }
                          : undefined
                      }
                      onMoveDown={
                        cardIdx < colCards.length - 1
                          ? () => {
                              onMoveCard?.(card.id, col.id, cardIdx + 1);
                              setLiveStatus(`Moved ${card.title} down in ${col.title}`);
                            }
                          : undefined
                      }
                      onSelect={() => onCardSelect?.(card)}
                      onDragStart={(e) => {
                        e.dataTransfer?.setData('text/plain', card.id);
                      }}
                    />
                  );
                })
              )}
            </KanbanColumn>
          );
        })}
      </div>
    </div>
  );
}
