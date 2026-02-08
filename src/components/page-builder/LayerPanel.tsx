'use client';

import { PageElement } from '@/types/page-builder';
import { Eye, EyeOff, Lock, Unlock, Trash2, Copy } from 'lucide-react';

interface LayerPanelProps {
  elements: PageElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
}

export function LayerPanel({
  elements,
  selectedElementId,
  onSelectElement,
  onToggleVisibility,
  onToggleLock,
  onDeleteElement,
  onDuplicateElement,
}: LayerPanelProps) {
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
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {elements.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No elements yet</p>
            <p className="text-xs mt-1">Add elements to see them here</p>
          </div>
        ) : (
          <div className="space-y-1">
            {elements.map((element, index) => (
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {element.content || element.type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {element.type} • {Math.round(element.position.x)}, {Math.round(element.position.y)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(element.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title={element.visible ? 'Hide' : 'Show'}
                  >
                    {element.visible ? (
                      <Eye className="w-3.5 h-3.5 text-gray-600" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLock(element.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title={element.locked ? 'Unlock' : 'Lock'}
                  >
                    {element.locked ? (
                      <Lock className="w-3.5 h-3.5 text-gray-600" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateElement(element.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElement(element.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
