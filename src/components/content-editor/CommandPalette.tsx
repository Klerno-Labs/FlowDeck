'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'cmdk';
import {
  Search,
  Save,
  Send,
  History,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RotateCw,
  Sparkles,
  Keyboard,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
  availableCommands: {
    id: string;
    label: string;
    icon: React.ReactNode;
    shortcut?: string;
    category: string;
  }[];
}

/**
 * Elite Command Palette
 * Cmd+K quick actions for power users
 */
export function CommandPalette({
  isOpen,
  onClose,
  onCommand,
  availableCommands,
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, onClose]);

  const handleSelect = (commandId: string) => {
    onCommand(commandId);
    onClose();
    setSearch('');
  };

  const categories = Array.from(
    new Set(availableCommands.map((cmd) => cmd.category))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-start justify-center z-[100] p-4 pt-[20vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Command
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
              label="Command Menu"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 bg-white/5">
                <Search className="w-5 h-5 text-gray-400" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-lg"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-400 bg-white/10 border border-white/20 rounded">
                    ESC
                  </kbd>
                </div>
              </div>

              {/* Commands List */}
              <Command.List className="max-h-[400px] overflow-y-auto p-2">
                <Command.Empty className="py-12 text-center text-gray-400">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p>No commands found</p>
                  <p className="text-sm mt-1">Try a different search</p>
                </Command.Empty>

                {categories.map((category) => (
                  <Command.Group
                    key={category}
                    heading={category}
                    className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-2"
                  >
                    {availableCommands
                      .filter((cmd) => cmd.category === category)
                      .map((command) => (
                        <Command.Item
                          key={command.id}
                          value={command.label}
                          onSelect={() => handleSelect(command.id)}
                          className="flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer hover:bg-white/10 transition-all group data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-blue-600/20 data-[selected=true]:to-purple-600/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 group-hover:text-white group-data-[selected=true]:bg-gradient-to-r group-data-[selected=true]:from-blue-600 group-data-[selected=true]:to-purple-600 transition-all">
                              {command.icon}
                            </div>
                            <span className="text-white font-medium">
                              {command.label}
                            </span>
                          </div>
                          {command.shortcut && (
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-400 bg-white/10 border border-white/20 rounded">
                              {command.shortcut}
                            </kbd>
                          )}
                        </Command.Item>
                      ))}
                  </Command.Group>
                ))}
              </Command.List>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/5">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Keyboard className="w-4 h-4" />
                    <span>Navigate with arrows</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-[10px]">
                      ⏎
                    </kbd>
                    <span>to select</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded mr-1">
                    ⌘K
                  </kbd>
                  to toggle
                </div>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
