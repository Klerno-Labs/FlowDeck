'use client';

import { PageElement } from '@/types/page-builder';
import { Trash2, AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Plus, X as XIcon, Palette, Link as LinkIcon, Unlink } from 'lucide-react';
import { SketchPicker } from 'react-color';
import { useState, useEffect } from 'react';
import { AnimationGradientPanel } from './AnimationGradientPanel';
import { ImageUploader } from './ImageUploader';
import '@/styles/animations.css';

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
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [paddingLinked, setPaddingLinked] = useState(true);
  const [marginLinked, setMarginLinked] = useState(true);

  // Load saved colors from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('page-builder-color-palette');
    if (stored) {
      try {
        setSavedColors(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load color palette:', e);
      }
    }
  }, []);

  // Save colors to localStorage
  const saveColorToPalette = (color: string) => {
    if (!savedColors.includes(color)) {
      const updated = [...savedColors, color];
      setSavedColors(updated);
      localStorage.setItem('page-builder-color-palette', JSON.stringify(updated));
    }
  };

  // Remove color from palette
  const removeColorFromPalette = (color: string) => {
    const updated = savedColors.filter((c) => c !== color);
    setSavedColors(updated);
    localStorage.setItem('page-builder-color-palette', JSON.stringify(updated));
  };

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

        {/* Image Upload */}
        {element.type === 'image' && (
          <ImageUploader
            currentImage={element.content || undefined}
            onImageUploaded={(url) => onUpdate({ content: url })}
          />
        )}

        {/* Icon Selector */}
        {element.type === 'icon' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon Type</label>
            <select
              value={element.content || 'star'}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="star">Star</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="heart">Heart</option>
              <option value="sparkles">Sparkles</option>
            </select>
          </div>
        )}

        {/* Video URL */}
        {element.type === 'video' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
            <input
              type="text"
              value={element.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="YouTube, Vimeo, or direct video URL"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supports YouTube, Vimeo, and direct video URLs
            </p>
          </div>
        )}

        {/* Shape Type */}
        {element.type === 'shape' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shape Type</label>
            <select
              value={element.content || 'rectangle'}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
            </select>
          </div>
        )}

        {/* Link/URL (for buttons, text, and images) */}
        {(element.type === 'button' || element.type === 'text' || element.type === 'image') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link URL (Optional)
            </label>
            <input
              type="text"
              value={element.styles.link || ''}
              onChange={(e) =>
                onUpdate({
                  styles: { ...element.styles, link: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
            {element.styles.link && (
              <div className="mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={element.styles.linkTarget === '_blank'}
                    onChange={(e) =>
                      onUpdate({
                        styles: {
                          ...element.styles,
                          linkTarget: e.target.checked ? '_blank' : '_self',
                        },
                      })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  Open in new tab
                </label>
              </div>
            )}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
              <select
                value={element.styles.fontFamily || 'system-ui'}
                onChange={(e) =>
                  onUpdate({
                    styles: { ...element.styles, fontFamily: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="system-ui, -apple-system, sans-serif">System (Default)</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
                <option value="'Times New Roman', Times, serif">Times New Roman</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Courier New', Courier, monospace">Courier New</option>
                <option value="'Comic Sans MS', cursive">Comic Sans</option>
                <option value="Impact, sans-serif">Impact</option>
                <option value="'Trebuchet MS', sans-serif">Trebuchet</option>
                <option value="Verdana, sans-serif">Verdana</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Line Height</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="3"
                  step="0.1"
                  value={parseFloat(element.styles.lineHeight || '1.5')}
                  onChange={(e) =>
                    onUpdate({
                      styles: { ...element.styles, lineHeight: e.target.value },
                    })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm">ratio</span>
              </div>
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
                <button
                  onClick={() =>
                    onUpdate({ styles: { ...element.styles, textAlign: 'justify' } })
                  }
                  className={`flex-1 p-2 rounded border ${
                    element.styles.textAlign === 'justify'
                      ? 'bg-blue-50 border-blue-500'
                      : 'border-gray-300'
                  }`}
                  title="Justify"
                >
                  <AlignJustify className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>

            {/* Advanced Text Formatting */}
            <div className="border-2 border-indigo-200 rounded-xl p-4 bg-gradient-to-br from-indigo-50 to-violet-50">
              <label className="block text-sm font-bold text-indigo-900 uppercase tracking-wide mb-3">
                Advanced Text Formatting
              </label>

              {/* Letter Spacing */}
              <div className="mb-3">
                <label className="text-xs text-indigo-700 mb-1 block font-medium">Letter Spacing</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="-5"
                    max="20"
                    step="0.5"
                    value={parseFloat(element.styles.letterSpacing || '0')}
                    onChange={(e) =>
                      onUpdate({
                        styles: { ...element.styles, letterSpacing: `${e.target.value}px` },
                      })
                    }
                    className="flex-1 px-2 py-1.5 border border-indigo-300 rounded text-sm"
                  />
                  <span className="px-3 py-1.5 bg-indigo-100 rounded text-sm">px</span>
                </div>
              </div>

              {/* Text Transform */}
              <div className="mb-3">
                <label className="text-xs text-indigo-700 mb-1 block font-medium">Text Transform</label>
                <select
                  value={element.styles.textTransform || 'none'}
                  onChange={(e) =>
                    onUpdate({
                      styles: { ...element.styles, textTransform: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1.5 border border-indigo-300 rounded text-sm"
                >
                  <option value="none">None</option>
                  <option value="uppercase">UPPERCASE</option>
                  <option value="lowercase">lowercase</option>
                  <option value="capitalize">Capitalize Each Word</option>
                </select>
              </div>

              {/* Text Decoration */}
              <div className="mb-3">
                <label className="text-xs text-indigo-700 mb-1 block font-medium">Text Decoration</label>
                <select
                  value={element.styles.textDecoration || 'none'}
                  onChange={(e) =>
                    onUpdate({
                      styles: { ...element.styles, textDecoration: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1.5 border border-indigo-300 rounded text-sm"
                >
                  <option value="none">None</option>
                  <option value="underline">Underline</option>
                  <option value="line-through">Line Through (Strikethrough)</option>
                  <option value="overline">Overline</option>
                  <option value="underline overline">Underline + Overline</option>
                </select>
              </div>

              {/* Text Shadow */}
              <div>
                <label className="text-xs text-indigo-700 mb-1 block font-medium">Text Shadow</label>
                <select
                  value={element.styles.textShadow || 'none'}
                  onChange={(e) =>
                    onUpdate({
                      styles: { ...element.styles, textShadow: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1.5 border border-indigo-300 rounded text-sm"
                >
                  <option value="none">None</option>
                  <option value="1px 1px 2px rgba(0,0,0,0.3)">Subtle</option>
                  <option value="2px 2px 4px rgba(0,0,0,0.4)">Medium</option>
                  <option value="3px 3px 6px rgba(0,0,0,0.5)">Strong</option>
                  <option value="0 0 10px rgba(0,0,0,0.8)">Glow</option>
                  <option value="2px 2px 0px #000000">Bold Outline</option>
                </select>
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

        {/* Color Palette Manager */}
        <div className="border-2 border-purple-200 rounded-xl p-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" />
              <label className="text-sm font-bold text-purple-900 uppercase tracking-wide">
                Color Palette
              </label>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  if (element.styles.backgroundColor) {
                    saveColorToPalette(element.styles.backgroundColor);
                  }
                }}
                className="p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                title="Save Background Color"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  if (element.styles.color) {
                    saveColorToPalette(element.styles.color);
                  }
                }}
                className="p-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
                title="Save Text Color"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {savedColors.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p className="text-xs">No saved colors yet</p>
              <p className="text-[10px] mt-1">Click + to save current colors</p>
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-2">
              {savedColors.map((color, index) => (
                <div key={index} className="relative group">
                  <div
                    onClick={() => {
                      // Apply to background color on single click
                      onUpdate({
                        styles: { ...element.styles, backgroundColor: color },
                      });
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      // Apply to text color on right click
                      onUpdate({
                        styles: { ...element.styles, color: color },
                      });
                    }}
                    className="w-full aspect-square rounded-lg border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={`Left click: Background\nRight click: Text\nColor: ${color}`}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeColorFromPalette(color);
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove color"
                  >
                    <XIcon className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-purple-200">
            <p className="text-[10px] text-purple-700">
              💡 <strong>Left click</strong> = Background • <strong>Right click</strong> = Text
            </p>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Rotation</label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={parseInt(element.styles.rotation || '0')}
              onChange={(e) =>
                onUpdate({
                  styles: {
                    ...element.styles,
                    rotation: e.target.value,
                    transform: `rotate(${e.target.value}deg)`,
                  },
                })
              }
              className="w-full"
            />
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                max="360"
                value={parseInt(element.styles.rotation || '0')}
                onChange={(e) => {
                  const value = Math.min(360, Math.max(0, parseInt(e.target.value) || 0));
                  onUpdate({
                    styles: {
                      ...element.styles,
                      rotation: value.toString(),
                      transform: `rotate(${value}deg)`,
                    },
                  });
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium">degrees</span>
              <button
                onClick={() =>
                  onUpdate({
                    styles: {
                      ...element.styles,
                      rotation: '0',
                      transform: 'rotate(0deg)',
                    },
                  })
                }
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
                title="Reset rotation"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Border</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="20"
                placeholder="Width"
                value={parseInt(element.styles.borderWidth || '0')}
                onChange={(e) =>
                  onUpdate({
                    styles: {
                      ...element.styles,
                      borderWidth: `${e.target.value}px`,
                      border: `${e.target.value}px ${element.styles.borderStyle || 'solid'} ${element.styles.borderColor || '#000000'}`,
                    },
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm">px</span>
            </div>
            <div className="flex gap-2">
              <select
                value={element.styles.borderStyle || 'solid'}
                onChange={(e) =>
                  onUpdate({
                    styles: {
                      ...element.styles,
                      borderStyle: e.target.value,
                      border: `${element.styles.borderWidth || '1px'} ${e.target.value} ${element.styles.borderColor || '#000000'}`,
                    },
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
              </select>
              <input
                type="color"
                value={element.styles.borderColor || '#000000'}
                onChange={(e) =>
                  onUpdate({
                    styles: {
                      ...element.styles,
                      borderColor: e.target.value,
                      border: `${element.styles.borderWidth || '1px'} ${element.styles.borderStyle || 'solid'} ${e.target.value}`,
                    },
                  })
                }
                className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
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

        {/* Padding & Margin Controls */}
        <div className="border-2 border-blue-200 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-blue-900 uppercase tracking-wide">
              Padding
            </label>
            <button
              onClick={() => setPaddingLinked(!paddingLinked)}
              className={`p-1.5 rounded-lg transition-colors ${
                paddingLinked ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
              title={paddingLinked ? 'Unlink sides' : 'Link all sides'}
            >
              {paddingLinked ? <LinkIcon className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
            </button>
          </div>

          <div className="relative">
            {/* Visual Box Indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 border-2 border-dashed border-blue-300 rounded-lg"></div>
            </div>

            {/* Padding Controls */}
            <div className="grid grid-cols-3 gap-2 relative z-10">
              {/* Top */}
              <div className="col-start-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Top"
                  value={parseInt(element.styles.paddingTop || '0')}
                  onChange={(e) => {
                    if (paddingLinked) {
                      const val = `${e.target.value}px`;
                      onUpdate({
                        styles: {
                          ...element.styles,
                          paddingTop: val,
                          paddingRight: val,
                          paddingBottom: val,
                          paddingLeft: val,
                          padding: `${e.target.value}px`,
                        },
                      });
                    } else {
                      onUpdate({
                        styles: {
                          ...element.styles,
                          paddingTop: `${e.target.value}px`,
                        },
                      });
                    }
                  }}
                  className="w-full px-2 py-1.5 border border-blue-300 rounded text-sm text-center bg-white"
                />
              </div>

              {/* Left, Center (visual), Right */}
              <div className="col-start-1">
                <input
                  type="number"
                  min="0"
                  placeholder="Left"
                  value={parseInt(element.styles.paddingLeft || '0')}
                  onChange={(e) => {
                    if (paddingLinked) {
                      const val = `${e.target.value}px`;
                      onUpdate({
                        styles: {
                          ...element.styles,
                          paddingTop: val,
                          paddingRight: val,
                          paddingBottom: val,
                          paddingLeft: val,
                          padding: `${e.target.value}px`,
                        },
                      });
                    } else {
                      onUpdate({
                        styles: {
                          ...element.styles,
                          paddingLeft: `${e.target.value}px`,
                        },
                      });
                    }
                  }}
                  className="w-full px-2 py-1.5 border border-blue-300 rounded text-sm text-center bg-white"
                />
              </div>
              <div className="col-start-3">
                <input
                  type="number"
                  min="0"
                  placeholder="Right"
                  value={parseInt(element.styles.paddingRight || '0')}
                  onChange={(e) => {
                    if (paddingLinked) {
                      const val = `${e.target.value}px`;
                      onUpdate({
                        styles: {
                          ...element.styles,
                          paddingTop: val,
                          paddingRight: val,
                          paddingBottom: val,
                          paddingLeft: val,
                          padding: `${e.target.value}px`,
                        },
                      });
                    } else {
                      onUpdate({
                        styles: {
                          ...element.styles,
                          paddingRight: `${e.target.value}px`,
                        },
                      });
                    }
                  }}
                  className="w-full px-2 py-1.5 border border-blue-300 rounded text-sm text-center bg-white"
                />
              </div>

              {/* Bottom */}
              <div className="col-start-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Bottom"
                  value={parseInt(element.styles.paddingBottom || '0')}
                  onChange={(e) => {
                    if (paddingLinked) {
                      const val = `${e.target.value}px`;
                      onUpdate({
                        styles: {
                          ...element.styles,
                          paddingTop: val,
                          paddingRight: val,
                          paddingBottom: val,
                          paddingLeft: val,
                          padding: `${e.target.value}px`,
                        },
                      });
                    } else {
                      onUpdate({
                        styles: {
                          ...element.styles,
                          paddingBottom: `${e.target.value}px`,
                        },
                      });
                    }
                  }}
                  className="w-full px-2 py-1.5 border border-blue-300 rounded text-sm text-center bg-white"
                />
              </div>
            </div>
          </div>

          <p className="text-[10px] text-blue-700 mt-2 text-center">
            {paddingLinked ? '🔗 All sides linked' : '🔓 Individual sides'}
          </p>
        </div>

        <div className="border-2 border-green-200 rounded-xl p-4 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-green-900 uppercase tracking-wide">
              Margin
            </label>
            <button
              onClick={() => setMarginLinked(!marginLinked)}
              className={`p-1.5 rounded-lg transition-colors ${
                marginLinked ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
              title={marginLinked ? 'Unlink sides' : 'Link all sides'}
            >
              {marginLinked ? <LinkIcon className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
            </button>
          </div>

          <div className="relative">
            {/* Visual Box Indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 border-2 border-dashed border-green-300 rounded-lg"></div>
            </div>

            {/* Margin Controls */}
            <div className="grid grid-cols-3 gap-2 relative z-10">
              {/* Top */}
              <div className="col-start-2">
                <input
                  type="number"
                  placeholder="Top"
                  value={parseInt(element.styles.marginTop || '0')}
                  onChange={(e) => {
                    if (marginLinked) {
                      const val = `${e.target.value}px`;
                      onUpdate({
                        styles: {
                          ...element.styles,
                          marginTop: val,
                          marginRight: val,
                          marginBottom: val,
                          marginLeft: val,
                          margin: `${e.target.value}px`,
                        },
                      });
                    } else {
                      onUpdate({
                        styles: {
                          ...element.styles,
                          marginTop: `${e.target.value}px`,
                        },
                      });
                    }
                  }}
                  className="w-full px-2 py-1.5 border border-green-300 rounded text-sm text-center bg-white"
                />
              </div>

              {/* Left, Center (visual), Right */}
              <div className="col-start-1">
                <input
                  type="number"
                  placeholder="Left"
                  value={parseInt(element.styles.marginLeft || '0')}
                  onChange={(e) => {
                    if (marginLinked) {
                      const val = `${e.target.value}px`;
                      onUpdate({
                        styles: {
                          ...element.styles,
                          marginTop: val,
                          marginRight: val,
                          marginBottom: val,
                          marginLeft: val,
                          margin: `${e.target.value}px`,
                        },
                      });
                    } else {
                      onUpdate({
                        styles: {
                          ...element.styles,
                          marginLeft: `${e.target.value}px`,
                        },
                      });
                    }
                  }}
                  className="w-full px-2 py-1.5 border border-green-300 rounded text-sm text-center bg-white"
                />
              </div>
              <div className="col-start-3">
                <input
                  type="number"
                  placeholder="Right"
                  value={parseInt(element.styles.marginRight || '0')}
                  onChange={(e) => {
                    if (marginLinked) {
                      const val = `${e.target.value}px`;
                      onUpdate({
                        styles: {
                          ...element.styles,
                          marginTop: val,
                          marginRight: val,
                          marginBottom: val,
                          marginLeft: val,
                          margin: `${e.target.value}px`,
                        },
                      });
                    } else {
                      onUpdate({
                        styles: {
                          ...element.styles,
                          marginRight: `${e.target.value}px`,
                        },
                      });
                    }
                  }}
                  className="w-full px-2 py-1.5 border border-green-300 rounded text-sm text-center bg-white"
                />
              </div>

              {/* Bottom */}
              <div className="col-start-2">
                <input
                  type="number"
                  placeholder="Bottom"
                  value={parseInt(element.styles.marginBottom || '0')}
                  onChange={(e) => {
                    if (marginLinked) {
                      const val = `${e.target.value}px`;
                      onUpdate({
                        styles: {
                          ...element.styles,
                          marginTop: val,
                          marginRight: val,
                          marginBottom: val,
                          marginLeft: val,
                          margin: `${e.target.value}px`,
                        },
                      });
                    } else {
                      onUpdate({
                        styles: {
                          ...element.styles,
                          marginBottom: `${e.target.value}px`,
                        },
                      });
                    }
                  }}
                  className="w-full px-2 py-1.5 border border-green-300 rounded text-sm text-center bg-white"
                />
              </div>
            </div>
          </div>

          <p className="text-[10px] text-green-700 mt-2 text-center">
            {marginLinked ? '🔗 All sides linked' : '🔓 Individual sides'}
          </p>
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

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Animation & Gradient Panel */}
        <AnimationGradientPanel
          currentAnimation={element.styles.animation}
          currentBackground={element.styles.backgroundImage || element.styles.backgroundColor}
          onAnimationChange={(animation) => {
            onUpdate({
              styles: {
                ...element.styles,
                animation: animation || undefined,
                animationDuration: animation ? '1s' : undefined,
              },
            });
          }}
          onGradientChange={(gradient) => {
            if (gradient) {
              onUpdate({
                styles: {
                  ...element.styles,
                  backgroundImage: gradient,
                  backgroundColor: undefined,
                },
              });
            } else {
              onUpdate({
                styles: {
                  ...element.styles,
                  backgroundImage: undefined,
                  backgroundColor: element.styles.backgroundColor || '#FFFFFF',
                },
              });
            }
          }}
        />

        {/* Keyboard Shortcuts Hint */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-xs font-semibold text-blue-900 mb-2 uppercase tracking-wide">
            💡 Keyboard Shortcuts
          </h3>
          <div className="space-y-1 text-xs text-blue-800">
            <div className="flex justify-between">
              <span>Arrow Keys</span>
              <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">↑ ↓ ← →</span>
            </div>
            <div className="text-blue-600 text-[10px] mb-2">Move element by 1px</div>

            <div className="flex justify-between">
              <span>Shift + Arrows</span>
              <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">⇧ + ↑↓←→</span>
            </div>
            <div className="text-blue-600 text-[10px] mb-2">Move element by 10px</div>

            <div className="flex justify-between">
              <span>Copy / Paste</span>
              <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">Ctrl+C / V</span>
            </div>

            <div className="flex justify-between">
              <span>Delete</span>
              <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">Del</span>
            </div>

            <div className="border-t border-blue-200 my-2" />

            <div className="flex justify-between">
              <span>Bring Forward</span>
              <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">Ctrl+]</span>
            </div>

            <div className="flex justify-between">
              <span>Send Backward</span>
              <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">Ctrl+[</span>
            </div>

            <div className="flex justify-between">
              <span>To Front / Back</span>
              <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-[10px]">⇧+]|[</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
