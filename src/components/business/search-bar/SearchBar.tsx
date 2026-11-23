import { Search, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Input } from '../../ui/input';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  shortcutHint?: string;
  'aria-label'?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search…',
  shortcutHint,
  'aria-label': ariaLabel = 'Search',
  className,
}: SearchBarProps) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
      className={cn('relative w-full', className)}
    >
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        leftAdornment={<Search className="h-4 w-4" aria-hidden="true" />}
        rightAdornment={
          value ? (
            <button
              type="button"
              onClick={() => onChange('')}
              aria-label="Clear search"
              className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : shortcutHint ? (
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
              {shortcutHint}
            </kbd>
          ) : undefined
        }
      />
    </form>
  );
}
