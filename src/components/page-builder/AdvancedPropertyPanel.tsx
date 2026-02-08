'use client';

import { PageElement } from '@/types/page-builder';
import { Trash2, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';
import { SketchPicker } from 'react-color';
import { useState } from 'react';

interface AdvancedPropertyPanelProps {
  element: PageElement;
  onUpdate: (updates: Partial<PageElement>) => void;
  onDelete: () => void;
}

export function AdvancedPropertyPanel({
  element,
  onUpdate,
  onDelete,
}: AdvancedPropertyPanelProps) {
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          Properties
        </h2>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Element"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Content */}
        {(element.type === 'text' || element.type === 'heading' || element.type === 'button') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={element.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
        )}

        {/* Image URL */}
        {element.type === 'image' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              value={element.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        )}

        {/* Position & Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Position & Size</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">X Position</label>
              <input
                type="number"
                value={Math.round(element.position.x)}
                onChange={(e) =>
                  onUpdate({
                    position: { ...element.position, x: Number(e.target.value) },
                  })
                }
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Y Position</label>
              <input
                type="number"
                value={Math.round(element.position.y)}
                onChange={(e) =>
                  onUpdate({
                    position: { ...element.position, y: Number(e.target.value) },
                  })
                }
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Width</label>
              <input
                type="number"
                value={element.position.width as number}
                onChange={(e) =>
                  onUpdate({
                    position: { ...element.position, width: Number(e.target.value) },
                  })
                }
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Height</label>
              <input
                type="number"
                value={element.position.height as number}
                onChange={(e) =>
                  onUpdate({
                    position: { ...element.position, height: Number(e.target.value) },
                  })
                }
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Typography */}
        {(element.type === 'text' || element.type === 'heading' || element.type === 'button') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={parseInt(element.styles.fontSize || '16')}
                  onChange={(e) =>
                    onUpdate({
                      styles: { ...element.styles, fontSize: `${e.target.value}px` },
                    })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm">px</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
              <select
                value={element.styles.fontWeight || 'normal'}
                onChange={(e) =>
                  onUpdate({
                    styles: { ...element.styles, fontWeight: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="semibold">Semibold</option>
                <option value="bold">Bold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Align</label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    onUpdate({ styles: { ...element.styles, textAlign: 'left' } })
                  }
                  className={`flex-1 p-2 rounded border ${
                    element.styles.textAlign === 'left'
                      ? 'bg-blue-50 border-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  <AlignLeft className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() =>
                    onUpdate({ styles: { ...element.styles, textAlign: 'center' } })
                  }
                  className={`flex-1 p-2 rounded border ${
                    element.styles.textAlign === 'center'
                      ? 'bg-blue-50 border-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  <AlignCenter className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() =>
                    onUpdate({ styles: { ...element.styles, textAlign: 'right' } })
                  }
                  className={`flex-1 p-2 rounded border ${
                    element.styles.textAlign === 'right'
                      ? 'bg-blue-50 border-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  <AlignRight className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
          <div className="relative">
            <div
              onClick={() => setShowBgColorPicker(!showBgColorPicker)}
              className="w-full h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
              style={{ backgroundColor: element.styles.backgroundColor || 'transparent' }}
            />
            {showBgColorPicker && (
              <div className="absolute top-12 left-0 z-50">
                <div
                  className="fixed inset-0"
                  onClick={() => setShowBgColorPicker(false)}
                />
                <SketchPicker
                  color={element.styles.backgroundColor || '#FFFFFF'}
                  onChange={(color) =>
                    onUpdate({
                      styles: { ...element.styles, backgroundColor: color.hex },
                    })
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
          <div className="relative">
            <div
              onClick={() => setShowTextColorPicker(!showTextColorPicker)}
              className="w-full h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
              style={{ backgroundColor: element.styles.color || '#000000' }}
            />
            {showTextColorPicker && (
              <div className="absolute top-12 left-0 z-50">
                <div
                  className="fixed inset-0"
                  onClick={() => setShowTextColorPicker(false)}
                />
                <SketchPicker
                  color={element.styles.color || '#000000'}
                  onChange={(color) =>
                    onUpdate({
                      styles: { ...element.styles, color: color.hex },
                    })
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Border & Effects */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={parseInt(element.styles.borderRadius || '0')}
              onChange={(e) =>
                onUpdate({
                  styles: { ...element.styles, borderRadius: `${e.target.value}px` },
                })
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm">px</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={element.styles.opacity || 1}
            onChange={(e) =>
              onUpdate({
                styles: { ...element.styles, opacity: parseFloat(e.target.value) },
              })
            }
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-center">
            {Math.round((element.styles.opacity || 1) * 100)}%
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Box Shadow</label>
          <select
            value={element.styles.boxShadow || 'none'}
            onChange={(e) =>
              onUpdate({
                styles: { ...element.styles, boxShadow: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="none">None</option>
            <option value="0 1px 2px 0 rgb(0 0 0 / 0.05)">Small</option>
            <option value="0 4px 6px -1px rgb(0 0 0 / 0.1)">Medium</option>
            <option value="0 10px 15px -3px rgb(0 0 0 / 0.1)">Large</option>
            <option value="0 20px 25px -5px rgb(0 0 0 / 0.1)">Extra Large</option>
          </select>
        </div>

        {/* Padding */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
          <input
            type="text"
            value={element.styles.padding || '0'}
            onChange={(e) =>
              onUpdate({
                styles: { ...element.styles, padding: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., 10px or 10px 20px"
          />
        </div>

        {/* Z-Index */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Layer (Z-Index)</label>
          <input
            type="number"
            value={element.styles.zIndex || 0}
            onChange={(e) =>
              onUpdate({
                styles: { ...element.styles, zIndex: Number(e.target.value) },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
