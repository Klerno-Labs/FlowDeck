'use client';

import { useState, useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import { Shortcut, getShortcutDisplay } from '@/lib/hooks/useKeyboardShortcuts';

export function KeyboardShortcutsModal({ shortcuts }: { shortcuts: Shortcut[] }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center justify-center group"
        title="Keyboard Shortcuts (Shift + ?)"
      >
        <Keyboard className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-700 font-medium">{shortcut.description}</span>
              <kbd className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-mono font-bold text-sm shadow-sm">
                {getShortcutDisplay(shortcut)}
              </kbd>
            </div>
          ))}

          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> Press <kbd className="px-2 py-1 bg-white border border-blue-300 rounded font-mono text-xs">Shift + ?</kbd> anytime to toggle this help dialog
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
