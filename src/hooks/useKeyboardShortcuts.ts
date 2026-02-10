/**
 * Elite Keyboard Shortcuts Hook
 * Canva-level keyboard shortcuts for power users
 */

import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
        const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        // Check if all modifiers match
        const modifiersMatch =
          (shortcut.ctrl || shortcut.meta ? (event.ctrlKey || event.metaKey) : true) &&
          (shortcut.shift ? shiftMatch : !event.shiftKey) &&
          (shortcut.alt ? altMatch : !event.altKey);

        if (keyMatch && modifiersMatch) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Common keyboard shortcuts for content editors
 */
export const commonShortcuts = {
  save: {
    key: 's',
    meta: true,
    ctrl: true,
    description: 'Save draft',
  },
  publish: {
    key: 's',
    meta: true,
    ctrl: true,
    shift: true,
    description: 'Publish changes',
  },
  undo: {
    key: 'z',
    meta: true,
    ctrl: true,
    description: 'Undo',
  },
  redo: {
    key: 'z',
    meta: true,
    ctrl: true,
    shift: true,
    description: 'Redo',
  },
  commandPalette: {
    key: 'k',
    meta: true,
    ctrl: true,
    description: 'Open command palette',
  },
  escape: {
    key: 'Escape',
    description: 'Close modal',
  },
};
