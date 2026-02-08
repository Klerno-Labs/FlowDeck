'use client';

import { useState, useEffect } from 'react';
import {
  Layers,
  Save,
  Eye,
  Rocket,
  Loader2,
  Plus,
  Image as ImageIcon,
  Type,
  Square,
  MousePointer2,
  Palette,
  Move,
  Trash2,
  Undo,
  Redo,
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import { PageConfigRecord, PageElement, PageConfig } from '@/types/page-builder';
import { SketchPicker } from 'react-color';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';

export default function PageBuilderPage() {
  const [pages, setPages] = useState<PageConfigRecord[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageConfigRecord | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState<'bg' | 'text' | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/page-builder/pages');
      if (!response.ok) throw new Error('Failed to fetch pages');
      const data = await response.json();
      setPages(data.pages);
      if (data.pages.length > 0 && !selectedPage) {
        setSelectedPage(data.pages[0]);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      showToast('Failed to load pages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPage) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/page-builder/pages/${selectedPage.page_key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: selectedPage.config }),
      });

      if (!response.ok) throw new Error('Failed to save page');

      showToast('Page saved successfully', 'success');
      fetchPages();
    } catch (error) {
      console.error('Error saving page:', error);
      showToast('Failed to save page', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedPage) return;

    try {
      const response = await fetch(`/api/page-builder/pages/${selectedPage.page_key}/publish`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to publish page');

      showToast('Page published successfully', 'success');
      fetchPages();
    } catch (error) {
      console.error('Error publishing page:', error);
      showToast('Failed to publish page', 'error');
    }
  };

  const updatePageConfig = (updates: Partial<PageConfig>) => {
    if (!selectedPage) return;

    setSelectedPage({
      ...selectedPage,
      config: {
        ...selectedPage.config,
        ...updates,
      },
    });
  };

  const updatePageBackgroundColor = (color: string) => {
    if (!selectedPage) return;

    updatePageConfig({
      styles: {
        ...selectedPage.config.styles,
        backgroundColor: color,
      },
    });
  };

  const updateSelectedElement = (updates: Partial<PageElement>) => {
    if (!selectedPage || !selectedElementId) return;

    const updatedElements = selectedPage.config.elements.map((el) =>
      el.id === selectedElementId ? { ...el, ...updates } : el
    );

    updatePageConfig({ elements: updatedElements });
  };

  const addElement = (type: PageElement['type']) => {
    if (!selectedPage) return;

    const newElement: PageElement = {
      id: `el-${Date.now()}`,
      type,
      content: type === 'image' ? '/placeholder.png' : 'New Element',
      position: { x: 100, y: 100, width: type === 'button' ? 200 : 300, height: type === 'button' ? 60 : 100 },
      styles: {
        backgroundColor: type === 'button' ? '#3B82F6' : 'transparent',
        color: type === 'button' ? '#FFFFFF' : '#000000',
        fontSize: type === 'heading' ? '32px' : '16px',
        fontWeight: type === 'heading' ? 'bold' : 'normal',
        padding: type === 'button' ? '12px 24px' : '0',
        borderRadius: type === 'button' ? '8px' : '0',
      },
      visible: true,
    };

    updatePageConfig({
      elements: [...selectedPage.config.elements, newElement],
    });

    setSelectedElementId(newElement.id);
    showToast(`${type} element added`, 'success');
  };

  const deleteElement = () => {
    if (!selectedPage || !selectedElementId) return;

    const updatedElements = selectedPage.config.elements.filter(
      (el) => el.id !== selectedElementId
    );

    updatePageConfig({ elements: updatedElements });
    setSelectedElementId(null);
    showToast('Element deleted', 'success');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!selectedPage) return;

    const { active, delta } = event;
    const elementId = active.id as string;

    const updatedElements = selectedPage.config.elements.map((el) => {
      if (el.id === elementId) {
        return {
          ...el,
          position: {
            ...el.position,
            x: el.position.x + delta.x,
            y: el.position.y + delta.y,
          },
        };
      }
      return el;
    });

    updatePageConfig({ elements: updatedElements });
  };

  const selectedElement = selectedPage?.config.elements.find(
    (el) => el.id === selectedElementId
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Page Builder</h1>
          </div>
          {selectedPage && (
            <div className="text-sm text-gray-600">
              Editing: <span className="font-semibold">{selectedPage.page_title}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !selectedPage}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={!selectedPage}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Rocket className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Page List */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Pages
            </h2>
          </div>
          <div className="p-2 space-y-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => {
                  setSelectedPage(page);
                  setSelectedElementId(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedPage?.id === page.id
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{page.page_title}</span>
                  {page.is_published && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                      Live
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          {selectedPage ? (
            <div className="max-w-6xl mx-auto">
              {/* Element Toolbar */}
              <div className="mb-4 bg-white rounded-lg shadow-sm p-4 flex items-center gap-2">
                <button
                  onClick={() => addElement('text')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Add Text"
                >
                  <Type className="w-4 h-4" />
                  Text
                </button>
                <button
                  onClick={() => addElement('heading')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Add Heading"
                >
                  <Type className="w-4 h-4 font-bold" />
                  Heading
                </button>
                <button
                  onClick={() => addElement('button')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Add Button"
                >
                  <Square className="w-4 h-4" />
                  Button
                </button>
                <button
                  onClick={() => addElement('image')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Add Image"
                >
                  <ImageIcon className="w-4 h-4" />
                  Image
                </button>

                <div className="flex-1" />

                <button
                  onClick={() => {
                    setShowColorPicker(true);
                    setColorPickerTarget('bg');
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Page Background"
                >
                  <Palette className="w-4 h-4" />
                  Background
                </button>
              </div>

              {/* Canvas */}
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div
                  className="relative min-h-[800px] rounded-lg shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: selectedPage.config.styles.backgroundColor || '#FFFFFF',
                  }}
                >
                  {selectedPage.config.elements.map((element) => (
                    <div
                      key={element.id}
                      onClick={() => setSelectedElementId(element.id)}
                      className={`absolute cursor-move ${
                        selectedElementId === element.id
                          ? 'ring-2 ring-blue-500 ring-offset-2'
                          : ''
                      }`}
                      style={{
                        left: element.position.x,
                        top: element.position.y,
                        width: element.position.width,
                        height: element.position.height,
                        ...element.styles,
                      }}
                    >
                      {element.type === 'text' || element.type === 'heading' ? (
                        <div>{element.content}</div>
                      ) : element.type === 'button' ? (
                        <button className="w-full h-full">{element.content}</button>
                      ) : element.type === 'image' ? (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      ) : null}
                    </div>
                  ))}

                  {selectedPage.config.elements.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <MousePointer2 className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-lg font-semibold">Start building your page</p>
                        <p className="text-sm">Add elements from the toolbar above</p>
                      </div>
                    </div>
                  )}
                </div>
              </DndContext>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Layers className="w-16 h-16 mx-auto mb-4" />
                <p className="text-xl font-semibold">Select a page to edit</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties */}
        {selectedElement && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Properties
              </h2>
              <button
                onClick={deleteElement}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Element"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Content */}
              {(selectedElement.type === 'text' ||
                selectedElement.type === 'heading' ||
                selectedElement.type === 'button') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <input
                    type="text"
                    value={selectedElement.content || ''}
                    onChange={(e) =>
                      updateSelectedElement({ content: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600">X</label>
                    <input
                      type="number"
                      value={selectedElement.position.x}
                      onChange={(e) =>
                        updateSelectedElement({
                          position: {
                            ...selectedElement.position,
                            x: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Y</label>
                    <input
                      type="number"
                      value={selectedElement.position.y}
                      onChange={(e) =>
                        updateSelectedElement({
                          position: {
                            ...selectedElement.position,
                            y: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600">Width</label>
                    <input
                      type="number"
                      value={selectedElement.position.width as number}
                      onChange={(e) =>
                        updateSelectedElement({
                          position: {
                            ...selectedElement.position,
                            width: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Height</label>
                    <input
                      type="number"
                      value={selectedElement.position.height as number}
                      onChange={(e) =>
                        updateSelectedElement({
                          position: {
                            ...selectedElement.position,
                            height: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <input
                  type="text"
                  value={selectedElement.styles.backgroundColor || ''}
                  onChange={(e) =>
                    updateSelectedElement({
                      styles: {
                        ...selectedElement.styles,
                        backgroundColor: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#FFFFFF or transparent"
                />
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <input
                  type="text"
                  value={selectedElement.styles.color || ''}
                  onChange={(e) =>
                    updateSelectedElement({
                      styles: {
                        ...selectedElement.styles,
                        color: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#000000"
                />
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <input
                  type="text"
                  value={selectedElement.styles.fontSize || ''}
                  onChange={(e) =>
                    updateSelectedElement({
                      styles: {
                        ...selectedElement.styles,
                        fontSize: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="16px"
                />
              </div>

              {/* Border Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Border Radius
                </label>
                <input
                  type="text"
                  value={selectedElement.styles.borderRadius || ''}
                  onChange={(e) =>
                    updateSelectedElement({
                      styles: {
                        ...selectedElement.styles,
                        borderRadius: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0px or 8px"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Color Picker Modal */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h3 className="text-lg font-bold mb-4">
              {colorPickerTarget === 'bg' ? 'Page Background Color' : 'Text Color'}
            </h3>
            <SketchPicker
              color={
                colorPickerTarget === 'bg'
                  ? selectedPage?.config.styles.backgroundColor || '#FFFFFF'
                  : '#000000'
              }
              onChange={(color) => {
                if (colorPickerTarget === 'bg') {
                  updatePageBackgroundColor(color.hex);
                }
              }}
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setShowColorPicker(false);
                  setColorPickerTarget(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
