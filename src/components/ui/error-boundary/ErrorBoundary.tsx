import * as React from 'react';
import { AlertOctagon, Home, RotateCcw } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../button';
import { Card } from '../card';

export interface RecoveryScreenProps {
  title?: string;
  description?: string;
  errorCode?: string;
  details?: string;
  showDetails?: boolean;
  onRetry?: () => void;
  retryLabel?: string;
  onResetHome?: () => void;
  homeLabel?: string;
  className?: string;
}

export function RecoveryScreen({
  title = 'Something interrupted this module',
  description = 'The workspace boundary caught an unexpected UI error safely. Other modules remain unaffected.',
  errorCode,
  details,
  showDetails = false,
  onRetry,
  retryLabel = 'Try again',
  onResetHome,
  homeLabel = 'Return to overview',
  className,
}: RecoveryScreenProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Card
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex flex-col items-center justify-center gap-4 border-destructive/30 p-8 text-center',
        className
      )}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive-subtle text-destructive-subtle-foreground">
        <AlertOctagon className="h-6 w-6" aria-hidden="true" />
      </span>

      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">{description}</p>
        {errorCode && (
          <div className="pt-1">
            <span className="inline-block rounded border border-border bg-muted px-2 py-0.5 font-mono text-[11px] text-foreground">
              Reference: {errorCode}
            </span>
          </div>
        )}
      </div>

      {showDetails && details && (
        <div className="w-full max-w-lg text-left">
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            {expanded ? 'Hide diagnostic details' : 'View diagnostic details'}
          </button>
          {expanded && (
            <pre className="mt-2 max-h-36 overflow-auto rounded-[var(--wdr-radius-md)] border border-border bg-muted/60 p-3 font-mono text-[11px] text-foreground whitespace-pre-wrap">
              {details}
            </pre>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        {onRetry && (
          <Button
            variant="primary"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            {retryLabel}
          </Button>
        )}
        {onResetHome && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetHome}
            leftIcon={<Home className="h-3.5 w-3.5" />}
          >
            {homeLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  fallbackRender?: (ctx: { error: Error; reset: () => void }) => React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
  title?: string;
  description?: string;
  showDetails?: boolean;
  className?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

function areResetKeysEqual(a?: unknown[], b?: unknown[]): boolean {
  if (!a || !b) return a === b;
  if (a.length !== b.length) return false;
  return a.every((item, idx) => Object.is(item, b[idx]));
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (
      this.state.error &&
      this.props.resetKeys &&
      !areResetKeysEqual(prevProps.resetKeys, this.props.resetKeys)
    ) {
      this.setState({ error: null });
    }
  }

  reset = (): void => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render(): React.ReactNode {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    if (this.props.fallbackRender) {
      return this.props.fallbackRender({ error, reset: this.reset });
    }
    if (this.props.fallback !== undefined) {
      return this.props.fallback;
    }

    return (
      <RecoveryScreen
        title={this.props.title}
        description={this.props.description}
        details={error.message}
        showDetails={this.props.showDetails}
        onRetry={this.reset}
        className={this.props.className}
      />
    );
  }
}
