import * as React from 'react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  children: React.ReactElement;
  className?: string;
}

const placementClasses: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({ content, placement = 'top', children, className }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const tooltipId = useStableId(undefined, 'wdr-tooltip');
  const existingDescribedBy = (children.props as Record<string, unknown>)['aria-describedby'] as
    | string
    | undefined;
  const describedBy = visible
    ? [existingDescribedBy, tooltipId].filter(Boolean).join(' ')
    : existingDescribedBy;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && visible) {
          setVisible(false);
        }
      }}
    >
      {React.cloneElement(children, {
        'aria-describedby': describedBy,
      })}
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 whitespace-nowrap rounded-[var(--wdr-radius-sm)] bg-accent px-2.5 py-1.5 text-xs font-medium text-accent-foreground shadow-[var(--wdr-shadow-md)]',
            placementClasses[placement],
            className
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
