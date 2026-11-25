import * as React from 'react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Select, type SelectOption } from '../../ui/select';
import { SearchBar } from '../search-bar';

export interface FilterGroup {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterGroup[];
  onReset?: () => void;
  activeFilterCount?: number;
  actions?: React.ReactNode;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Filter records…',
  filters = [],
  onReset,
  activeFilterCount = 0,
  actions,
  className,
  ...props
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-3',
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
        {onSearchChange !== undefined && (
          <SearchBar
            value={searchValue ?? ''}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            className="w-full sm:w-64"
          />
        )}
        {filters.map((filter) => (
          <div key={filter.id} className="w-full sm:w-44">
            <Select
              aria-label={filter.label}
              value={filter.value}
              onValueChange={filter.onChange}
              options={filter.options}
              placeholder={filter.label}
            />
          </div>
        ))}
        {onReset && activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            Reset ({activeFilterCount})
          </Button>
        )}
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
