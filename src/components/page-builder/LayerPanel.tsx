'use client';

import { PageElement } from '@/types/page-builder';
import { Eye, EyeOff, Lock, Unlock, Trash2, Copy, Search } from 'lucide-react';
import { useState, useMemo, memo } from 'react';
import { useDebounce } from '@/lib/performance';

interface LayerPanelProps {
  elements: PageElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
}

export const LayerPanel = memo(function LayerPanel({
  elements,
  selectedElementId,
  onSelectElement,
  onToggleVisibility,
  onToggleLock,
  onDeleteElement,
  onDuplicateElement,
}: LayerPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200); // Debounce search

  // Memoize filtered elements for performance
  const filteredElements = useMemo(() => {
    if (!debouncedSearchQuery) return elements;
    const query = debouncedSearchQuery.toLowerCase();
    return elements.filter((element) =>
      element.type.toLowerCase().includes(query) ||
      (element.content && element.content.toLowerCase().includes(query))
    );
  }, [elements, debouncedSearchQuery]);

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return '📝';
      case 'heading':
        return '📰';
      case 'button':
        return '🔘';
      case 'image':
        return '🖼️';
      case 'container':
        return '📦';
      case 'divider':
        return '➖';
      case 'icon':
        return '⭐';
      case 'video':
        return '🎬';
      case 'shape':
        return '🔷';
      default:
        return '⬜';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          Layers
        </h2>
        <p className="text-xs text-gray-500 mt-1">{elements.length} elements</p>

        {/* Search Input */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {elements.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No elements yet</p>
            <p className="text-xs mt-1">Add elements to see them here</p>
          </div>
        ) : filteredElements.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No results found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredElements.map((element, index) => (
              <div
                key={element.id}
                onClick={() => onSelectElement(element.id)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  selectedElementId === element.id
                    ? 'bg-blue-50 ring-2 ring-blue-500'
                    : 'hover:bg-gray-50'
                } ${!element.visible ? 'opacity-50' : ''}`}
              >
                <span className="text-lg">{getElementIcon(element.type)}</span>
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                  {elements.indexOf(element) + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {element.content || element.type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {element.type} • {Math.round(element.position.x)}, {Math.round(element.position.y)}
                  </p>
                </div>

                {/* Actions - Touch Friendly */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(element.id);
                    }}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 rounded-lg touch-manipulation"
                    title={element.visible ? 'Hide' : 'Show'}
                  >
                    {element.visible ? (
                      <Eye className="w-4 h-4 text-gray-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLock(element.id);
                    }}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 rounded-lg touch-manipulation"
                    title={element.locked ? 'Unlock' : 'Lock'}
                  >
                    {element.locked ? (
                      <Lock className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Unlock className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateElement(element.id);
                    }}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 rounded-lg touch-manipulation"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElement(element.id);
                    }}
                    className="w-9 h-9 flex items-center justify-center hover:bg-red-100 rounded-lg touch-manipulation"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
