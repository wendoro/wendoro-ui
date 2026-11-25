import * as React from 'react';

export interface UndoState<T> {
  current: T;
  canUndo: boolean;
  canRedo: boolean;
  lastActionLabel?: string;
  commit: (next: T, actionLabel?: string) => void;
  undo: () => void;
  redo: () => void;
  reset: (value: T) => void;
}

export function useUndoAction<T>(initialValue: T): UndoState<T> {
  const [history, setHistory] = React.useState<{
    past: Array<{ value: T; label?: string }>;
    present: T;
    future: Array<{ value: T; label?: string }>;
    lastLabel?: string;
  }>({
    past: [],
    present: initialValue,
    future: [],
    lastLabel: undefined,
  });

  const commit = React.useCallback((next: T, actionLabel?: string) => {
    setHistory((prev) => ({
      past: [...prev.past, { value: prev.present, label: prev.lastLabel }],
      present: next,
      future: [],
      lastLabel: actionLabel,
    }));
  }, []);

  const undo = React.useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      return {
        past: prev.past.slice(0, -1),
        present: previous.value,
        future: [{ value: prev.present, label: prev.lastLabel }, ...prev.future],
        lastLabel: previous.label,
      };
    });
  }, []);

  const redo = React.useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      return {
        past: [...prev.past, { value: prev.present, label: prev.lastLabel }],
        present: next.value,
        future: prev.future.slice(1),
        lastLabel: next.label,
      };
    });
  }, []);

  const reset = React.useCallback((value: T) => {
    setHistory({
      past: [],
      present: value,
      future: [],
      lastLabel: undefined,
    });
  }, []);

  return {
    current: history.present,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    lastActionLabel: history.lastLabel,
    commit,
    undo,
    redo,
    reset,
  };
}
