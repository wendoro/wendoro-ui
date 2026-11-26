import * as React from 'react';

export interface UseClipboardResult {
  copied: boolean;
  error: Error | null;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

export function useClipboard(resetAfterMs = 2000): UseClipboardResult {
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingTimer = React.useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      clearPendingTimer();
    };
  }, [clearPendingTimer]);

  const reset = React.useCallback(() => {
    clearPendingTimer();
    setCopied(false);
    setError(null);
  }, [clearPendingTimer]);

  const copy = React.useCallback(
    async (text: string) => {
      clearPendingTimer();
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else if (typeof document !== 'undefined') {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.setAttribute('readonly', '');
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        } else {
          throw new Error('Clipboard API is unavailable in this environment.');
        }

        setCopied(true);
        setError(null);

        if (resetAfterMs > 0) {
          timerRef.current = setTimeout(() => {
            setCopied(false);
            timerRef.current = null;
          }, resetAfterMs);
        }
        return true;
      } catch (err) {
        const nextErr = err instanceof Error ? err : new Error('Failed to copy to clipboard.');
        setCopied(false);
        setError(nextErr);
        return false;
      }
    },
    [clearPendingTimer, resetAfterMs]
  );

  return { copied, error, copy, reset };
}
