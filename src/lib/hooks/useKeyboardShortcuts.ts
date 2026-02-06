'use client';

import { useEffect } from 'react';

export interface Shortcut {
  key: string;
  ctrl?: boolean;
  cmd?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      for (const shortcut of shortcuts) {
        const ctrlKey = shortcut.ctrl || shortcut.cmd;
        const isCtrlPressed = e.ctrlKey || e.metaKey;

        const matches =
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (ctrlKey ? isCtrlPressed : !isCtrlPressed) &&
          (shortcut.shift ? e.shiftKey : !e.shiftKey);

        if (matches) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function getShortcutDisplay(shortcut: Shortcut): string {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const parts: string[] = [];

  if (shortcut.ctrl || shortcut.cmd) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (shortcut.shift) {
    parts.push('Shift');
  }
  parts.push(shortcut.key.toUpperCase());

  return parts.join(' + ');
}
