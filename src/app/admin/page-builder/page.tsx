'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Layers,
  Save,
  Rocket,
  Loader2,
  Plus,
  Image as ImageIcon,
  Type,
  Square,
  MousePointer2,
  Palette,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import { PageConfigRecord, PageElement, PageConfig } from '@/types/page-builder';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { DraggableElement } from '@/components/page-builder/DraggableElement';
import { LayerPanel } from '@/components/page-builder/LayerPanel';
import { AdvancedPropertyPanel } from '@/components/page-builder/AdvancedPropertyPanel';
import { TemplateLibrary } from '@/components/page-builder/TemplateLibrary';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useAutoSave } from '@/hooks/useAutoSave';

export default function EnhancedPageBuilder() {
  const [pages, setPages] = useState<PageConfigRecord[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageConfigRecord | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [activePanel, setActivePanel] = useState<'layers' | 'properties'>('layers');

  // Undo/Redo for page config
  const {
    state: pageConfig,
    set: setPageConfig,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetHistory,
  } = useUndoRedo<PageConfig>(
    selectedPage?.config || { elements: [], styles: {} }
  );

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

  useEffect(() => {
    if (selectedPage) {
      resetHistory(selectedPage.config);
    }
  }, [selectedPage, resetHistory]);

  // Auto-save
  const { isSaving: isAutoSaving, lastSaved } = useAutoSave(
    pageConfig,
    async (config) => {
      if (!selectedPage) return;
      await savePageConfig(config);
    },
    3000,
    !!selectedPage
  );

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

  const savePageConfig = async (config: PageConfig) => {
    if (!selectedPage) return;

    try {
      const response = await fetch(`/api/page-builder/pages/${selectedPage.page_key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });

      if (!response.ok) throw new Error('Failed to save page');
    } catch (error) {
      console.error('Error saving page:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!selectedPage) return;

    try {
      setSaving(true);
      await savePageConfig(pageConfig);
      showToast('Page saved successfully', 'success');
      fetchPages();
    } catch (error) {
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
      showToast('Failed to publish page', 'error');
    }
  };

  const updatePageConfig = useCallback(
    (updates: Partial<PageConfig>) => {
      setPageConfig({
        ...pageConfig,
        ...updates,
      });
    },
    [pageConfig, setPageConfig]
  );

  const updateSelectedElement = useCallback(
    (updates: Partial<PageElement>) => {
      if (!selectedElementId) return;

      const updatedElements = pageConfig.elements.map((el) =>
        el.id === selectedElementId ? { ...el, ...updates } : el
      );

      updatePageConfig({ elements: updatedElements });
    },
    [selectedElementId, pageConfig, updatePageConfig]
  );

  const addElement = useCallback(
    (type: PageElement['type']) => {
      const newElement: PageElement = {
        id: `el-${Date.now()}`,
        type,
        content: type === 'image' ? '/placeholder.png' : type === 'button' ? 'Click Me' : 'New Element',
        position: {
          x: 100 + pageConfig.elements.length * 20,
          y: 100 + pageConfig.elements.length * 20,
          width: type === 'button' ? 200 : 300,
          height: type === 'button' ? 60 : type === 'image' ? 200 : 100,
        },
        styles: {
          backgroundColor: type === 'button' ? '#3B82F6' : type === 'container' ? '#F3F4F6' : 'transparent',
          color: type === 'button' ? '#FFFFFF' : '#000000',
          fontSize: type === 'heading' ? '32px' : '16px',
          fontWeight: type === 'heading' ? 'bold' : 'normal',
          padding: type === 'button' ? '12px 24px' : type === 'container' ? '16px' : '0',
          borderRadius: type === 'button' ? '8px' : type === 'container' ? '12px' : '0',
        },
        visible: true,
      };

      updatePageConfig({
        elements: [...pageConfig.elements, newElement],
      });

      setSelectedElementId(newElement.id);
      showToast(`${type} element added`, 'success');
    },
    [pageConfig, updatePageConfig]
  );

  const deleteElement = useCallback(
    (id?: string) => {
      const elementId = id || selectedElementId;
      if (!elementId) return;

      const updatedElements = pageConfig.elements.filter((el) => el.id !== elementId);

      updatePageConfig({ elements: updatedElements });
      if (elementId === selectedElementId) {
        setSelectedElementId(null);
      }
      showToast('Element deleted', 'success');
    },
    [selectedElementId, pageConfig, updatePageConfig]
  );

  const duplicateElement = useCallback(
    (id: string) => {
      const element = pageConfig.elements.find((el) => el.id === id);
      if (!element) return;

      const newElement: PageElement = {
        ...element,
        id: `el-${Date.now()}`,
        position: {
          ...element.position,
          x: element.position.x + 20,
          y: element.position.y + 20,
        },
      };

      updatePageConfig({
        elements: [...pageConfig.elements, newElement],
      });

      setSelectedElementId(newElement.id);
      showToast('Element duplicated', 'success');
    },
    [pageConfig, updatePageConfig]
  );

  const toggleElementVisibility = useCallback(
    (id: string) => {
      const updatedElements = pageConfig.elements.map((el) =>
        el.id === id ? { ...el, visible: !el.visible } : el
      );
      updatePageConfig({ elements: updatedElements });
    },
    [pageConfig, updatePageConfig]
  );

  const toggleElementLock = useCallback(
    (id: string) => {
      const updatedElements = pageConfig.elements.map((el) =>
        el.id === id ? { ...el, locked: !el.locked } : el
      );
      updatePageConfig({ elements: updatedElements });
    },
    [pageConfig, updatePageConfig]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;
      const elementId = active.id as string;

      const updatedElements = pageConfig.elements.map((el) => {
        if (el.id === elementId) {
          return {
            ...el,
            position: {
              ...el.position,
              x: Math.round(el.position.x + delta.x / zoom),
              y: Math.round(el.position.y + delta.y / zoom),
            },
          };
        }
        return el;
      });

      updatePageConfig({ elements: updatedElements });
    },
    [pageConfig, updatePageConfig, zoom]
  );

  const handleSelectTemplate = useCallback(
    (config: PageConfig) => {
      setPageConfig(config);
      setShowTemplateLibrary(false);
      showToast('Template applied', 'success');
    },
    [setPageConfig]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z / Cmd+Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      // Ctrl+Y / Cmd+Shift+Z - Redo
      if (((e.ctrlKey || e.metaKey) && e.key === 'y') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        if (canRedo) redo();
      }
      // Delete - Delete selected element
      if (e.key === 'Delete' && selectedElementId) {
        e.preventDefault();
        deleteElement();
      }
      // Ctrl+D / Cmd+D - Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElementId) {
        e.preventDefault();
        duplicateElement(selectedElementId);
      }
      // Ctrl+S / Cmd+S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo, selectedElementId, deleteElement, duplicateElement, handleSave]);

  const selectedElement = pageConfig.elements.find((el) => el.id === selectedElementId);

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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Page Builder</h1>
          </div>
          {selectedPage && (
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{selectedPage.page_title}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
            <button
              onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium px-2 min-w-[4rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.25))}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded transition-colors ${
              showGrid ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="Toggle Grid"
          >
            <Grid3x3 className="w-4 h-4" />
          </button>

          {/* Auto-save indicator */}
          {isAutoSaving && (
            <div className="flex items-center gap-2 text-sm text-gray-600 border-l border-gray-200 pl-3">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Saving...</span>
            </div>
          )}
          {!isAutoSaving && lastSaved && (
            <div className="flex items-center gap-2 text-sm text-green-600 border-l border-gray-200 pl-3">
              <CheckCircle2 className="w-3 h-3" />
              <span>Saved</span>
            </div>
          )}

          {/* Save & Publish */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Rocket className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Pages */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
              Pages
            </h2>
            <button
              onClick={() => setShowTemplateLibrary(true)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              Templates
            </button>
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
              <div className="mb-4 bg-white rounded-lg shadow-sm p-3 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => addElement('text')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                >
                  <Type className="w-4 h-4" />
                  Text
                </button>
                <button
                  onClick={() => addElement('heading')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                >
                  <Type className="w-4 h-4 font-bold" />
                  Heading
                </button>
                <button
                  onClick={() => addElement('button')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                >
                  <Square className="w-4 h-4" />
                  Button
                </button>
                <button
                  onClick={() => addElement('image')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                >
                  <ImageIcon className="w-4 h-4" />
                  Image
                </button>
                <button
                  onClick={() => addElement('container')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                >
                  <Square className="w-4 h-4" />
                  Container
                </button>
              </div>

              {/* Canvas */}
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div
                  className="relative min-h-[800px] rounded-lg shadow-2xl overflow-hidden transition-transform"
                  style={{
                    backgroundColor: pageConfig.styles.backgroundColor || '#FFFFFF',
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                    backgroundImage: showGrid
                      ? 'linear-gradient(#00000010 1px, transparent 1px), linear-gradient(90deg, #00000010 1px, transparent 1px)'
                      : 'none',
                    backgroundSize: showGrid ? '20px 20px' : 'auto',
                  }}
                  onClick={() => setSelectedElementId(null)}
                >
                  {pageConfig.elements
                    .filter((el) => el.visible !== false)
                    .map((element) => (
                      <DraggableElement
                        key={element.id}
                        element={element}
                        isSelected={selectedElementId === element.id}
                        onClick={() => setSelectedElementId(element.id)}
                        zoom={zoom}
                      />
                    ))}

                  {pageConfig.elements.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
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

        {/* Right Sidebar - Tabs */}
        <div className="w-80 bg-white border-l border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActivePanel('layers')}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                activePanel === 'layers'
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Layers
            </button>
            <button
              onClick={() => setActivePanel('properties')}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                activePanel === 'properties'
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              disabled={!selectedElement}
            >
              Properties
            </button>
          </div>

          {activePanel === 'layers' && (
            <LayerPanel
              elements={pageConfig.elements}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onToggleVisibility={toggleElementVisibility}
              onToggleLock={toggleElementLock}
              onDeleteElement={deleteElement}
              onDuplicateElement={duplicateElement}
            />
          )}

          {activePanel === 'properties' && selectedElement && (
            <AdvancedPropertyPanel
              element={selectedElement}
              onUpdate={updateSelectedElement}
              onDelete={() => deleteElement()}
            />
          )}
        </div>
      </div>

      {/* Template Library Modal */}
      {showTemplateLibrary && (
        <TemplateLibrary
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplateLibrary(false)}
        />
      )}
    </div>
  );
}
