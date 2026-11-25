import * as React from 'react';

export interface KeyboardShortcutBinding {
  key: string;
  ctrlOrMeta?: boolean;
  shift?: boolean;
  alt?: boolean;
  allowInInputs?: boolean;
  handler: (event: KeyboardEvent) => void;
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    target.isContentEditable
  );
}

export function useKeyboardShortcuts(
  bindings: KeyboardShortcutBinding[],
  enabled = true
) {
  const bindingsRef = React.useRef(bindings);
  bindingsRef.current = bindings;

  React.useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const binding of bindingsRef.current) {
        if (!binding.allowInInputs && isEditableElement(event.target)) {
          continue;
        }
        const keyMatches = event.key.toLowerCase() === binding.key.toLowerCase();
        const modMatches = binding.ctrlOrMeta
          ? event.ctrlKey || event.metaKey
          : !event.ctrlKey && !event.metaKey;
        const shiftMatches = binding.shift ? event.shiftKey : !event.shiftKey;
        const altMatches = binding.alt ? event.altKey : !event.altKey;

        if (keyMatches && modMatches && shiftMatches && altMatches) {
          event.preventDefault();
          binding.handler(event);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
