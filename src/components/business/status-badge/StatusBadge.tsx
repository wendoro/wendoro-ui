import * as React from 'react';
import {
  Archive,
  CheckCircle2,
  Clock,
  FileEdit,
  AlertTriangle,
  XCircle,
  Zap,
} from 'lucide-react';
import { cn } from '../../../utils/cn';

export type BusinessStatus =
  | 'active'
  | 'pending'
  | 'warning'
  | 'error'
  | 'completed'
  | 'draft'
  | 'archived';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: BusinessStatus;
  label?: string;
}

const statusMap: Record<
  BusinessStatus,
  { defaultLabel: string; icon: React.ReactNode; classes: string }
> = {
  active: {
    defaultLabel: 'Active',
    icon: <Zap className="h-3 w-3" aria-hidden="true" />,
    classes: 'bg-success-subtle text-success-subtle-foreground border-success/30',
  },
  completed: {
    defaultLabel: 'Completed',
    icon: <CheckCircle2 className="h-3 w-3" aria-hidden="true" />,
    classes: 'bg-success-subtle text-success-subtle-foreground border-success/30',
  },
  pending: {
    defaultLabel: 'Pending',
    icon: <Clock className="h-3 w-3" aria-hidden="true" />,
    classes: 'bg-primary-subtle text-primary-subtle-foreground border-primary/40',
  },
  warning: {
    defaultLabel: 'Attention',
    icon: <AlertTriangle className="h-3 w-3" aria-hidden="true" />,
    classes: 'bg-warning-subtle text-warning-subtle-foreground border-warning/35',
  },
  error: {
    defaultLabel: 'Failed',
    icon: <XCircle className="h-3 w-3" aria-hidden="true" />,
    classes: 'bg-destructive-subtle text-destructive-subtle-foreground border-destructive/35',
  },
  draft: {
    defaultLabel: 'Draft',
    icon: <FileEdit className="h-3 w-3" aria-hidden="true" />,
    classes: 'bg-muted text-muted-foreground border-border',
  },
  archived: {
    defaultLabel: 'Archived',
    icon: <Archive className="h-3 w-3" aria-hidden="true" />,
    classes: 'bg-muted text-muted-foreground border-border',
  },
};

export function StatusBadge({ status, label, className, ...props }: StatusBadgeProps) {
  const cfg = statusMap[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[var(--wdr-radius-small,4px)] border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        cfg.classes,
        className
      )}
      {...props}
    >
      {cfg.icon}
      <span>{label ?? cfg.defaultLabel}</span>
    </span>
  );
}
