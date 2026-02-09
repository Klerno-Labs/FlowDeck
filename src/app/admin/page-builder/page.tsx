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
  Magnet,
  Minus,
  Star,
  Video,
  Circle,
  Monitor,
  Tablet,
  Smartphone,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyCenter,
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
  ArrowDownToLine,
  Download,
  Code,
  FileJson,
  Image as ImageIconDownload,
  Copy,
  Keyboard,
  X,
  ArrowLeftRight,
  ArrowUpDown,
  Maximize2,
  Minimize2,
  Clock,
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import { PageConfigRecord, PageElement, PageConfig } from '@/types/page-builder';
import { DndContext, DragEndEvent, DragMoveEvent, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { DraggableElement } from '@/components/page-builder/DraggableElement';
import { ResizableElement } from '@/components/page-builder/ResizableElement';
import { LayerPanel } from '@/components/page-builder/LayerPanel';
import { AdvancedPropertyPanel } from '@/components/page-builder/AdvancedPropertyPanel';
import { TemplateLibrary } from '@/components/page-builder/TemplateLibrary';
import { PresetsLibrary } from '@/components/page-builder/PresetsLibrary';
import { VersionHistory } from '@/components/page-builder/VersionHistory';
import { AssetManager } from '@/components/page-builder/AssetManager';
import { GridLayoutBuilder } from '@/components/page-builder/GridLayoutBuilder';
import { AnimationBuilder } from '@/components/page-builder/AnimationBuilder';
import { AlignmentGuides, detectAlignments } from '@/components/page-builder/AlignmentGuides';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useAutoSave } from '@/hooks/useAutoSave';

export default function EnhancedPageBuilder() {
  const [pages, setPages] = useState<PageConfigRecord[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageConfigRecord | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showPresetsLibrary, setShowPresetsLibrary] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showAssetManager, setShowAssetManager] = useState(false);
  const [showGridLayoutBuilder, setShowGridLayoutBuilder] = useState(false);
  const [showAnimationBuilder, setShowAnimationBuilder] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [activePanel, setActivePanel] = useState<'layers' | 'properties'>('layers');
  const [alignmentGuides, setAlignmentGuides] = useState<{ type: 'vertical' | 'horizontal'; position: number }[]>([]);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedElement, setCopiedElement] = useState<PageElement | null>(null);

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

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showExportMenu && !(e.target as Element).closest('.export-menu-container')) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showExportMenu]);

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

  // Save version to history
  const saveVersionToHistory = useCallback(
    (description: string, changeType: 'create' | 'update' | 'delete' | 'restore' = 'update') => {
      if (!selectedPage) return;

      const versionSnapshot = {
        id: `version-${Date.now()}`,
        pageKey: selectedPage.page_key,
        config: JSON.parse(JSON.stringify(pageConfig)), // Deep copy
        timestamp: new Date().toISOString(),
        description,
        changeType,
      };

      const stored = localStorage.getItem(`page-builder-history-${selectedPage.page_key}`);
      const versions = stored ? JSON.parse(stored) : [];
      const updated = [versionSnapshot, ...versions].slice(0, 50); // Keep last 50 versions
      localStorage.setItem(`page-builder-history-${selectedPage.page_key}`, JSON.stringify(updated));
    },
    [selectedPage, pageConfig]
  );

  // Restore version from history
  const restoreVersion = useCallback(
    (config: PageConfig) => {
      setPageConfig(config);
      showToast('Version restored successfully', 'success');
    },
    [setPageConfig]
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
      let defaultContent = 'New Element';
      let defaultWidth = 300;
      let defaultHeight = 100;
      let defaultStyles: any = {
        backgroundColor: 'transparent',
        color: '#000000',
        fontSize: '16px',
        fontWeight: 'normal',
        padding: '0',
        borderRadius: '0',
      };

      // Set defaults based on element type
      switch (type) {
        case 'image':
          defaultContent = '/placeholder.png';
          defaultWidth = 300;
          defaultHeight = 200;
          break;
        case 'button':
          defaultContent = 'Click Me';
          defaultWidth = 200;
          defaultHeight = 60;
          defaultStyles = {
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 'semibold',
            padding: '12px 24px',
            borderRadius: '8px',
          };
          break;
        case 'heading':
          defaultContent = 'Heading';
          defaultStyles = {
            ...defaultStyles,
            fontSize: '32px',
            fontWeight: 'bold',
          };
          break;
        case 'text':
          defaultContent = 'Text content';
          break;
        case 'container':
          defaultContent = '';
          defaultWidth = 400;
          defaultHeight = 300;
          defaultStyles = {
            ...defaultStyles,
            backgroundColor: '#F3F4F6',
            padding: '16px',
            borderRadius: '12px',
          };
          break;
        case 'divider':
          defaultContent = '';
          defaultWidth = 400;
          defaultHeight = 2;
          defaultStyles = {
            ...defaultStyles,
            backgroundColor: '#E5E7EB',
            height: '2px',
          };
          break;
        case 'icon':
          defaultContent = 'star';
          defaultWidth = 80;
          defaultHeight = 80;
          defaultStyles = {
            ...defaultStyles,
            color: '#3B82F6',
          };
          break;
        case 'video':
          defaultContent = '';
          defaultWidth = 640;
          defaultHeight = 360;
          defaultStyles = {
            ...defaultStyles,
            backgroundColor: '#000000',
          };
          break;
        case 'shape':
          defaultContent = 'rectangle';
          defaultWidth = 200;
          defaultHeight = 200;
          defaultStyles = {
            ...defaultStyles,
            backgroundColor: '#3B82F6',
            borderRadius: '0',
          };
          break;
      }

      const newElement: PageElement = {
        id: `el-${Date.now()}`,
        type,
        content: defaultContent,
        position: {
          x: 100 + pageConfig.elements.length * 20,
          y: 100 + pageConfig.elements.length * 20,
          width: defaultWidth,
          height: defaultHeight,
        },
        styles: defaultStyles,
        visible: true,
      };

      updatePageConfig({
        elements: [...pageConfig.elements, newElement],
      });

      setSelectedElementId(newElement.id);
      showToast(`${type} element added`, 'success');

      // Save version to history
      saveVersionToHistory(`Added ${type} element`, 'create');
    },
    [pageConfig, updatePageConfig, saveVersionToHistory]
  );

  const deleteElement = useCallback(
    (id?: string) => {
      const elementId = id || selectedElementId;
      if (!elementId) return;

      const element = pageConfig.elements.find((el) => el.id === elementId);
      const updatedElements = pageConfig.elements.filter((el) => el.id !== elementId);

      updatePageConfig({ elements: updatedElements });
      if (elementId === selectedElementId) {
        setSelectedElementId(null);
      }
      showToast('Element deleted', 'success');

      // Save version to history
      if (element) {
        saveVersionToHistory(`Deleted ${element.type} element`, 'delete');
      }
    },
    [selectedElementId, pageConfig, updatePageConfig, saveVersionToHistory]
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

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const { active, delta } = event;
      const elementId = active.id as string;

      // Find the dragging element
      const draggingElement = pageConfig.elements.find((el) => el.id === elementId);
      if (!draggingElement) return;

      // Create a temporary element with the new position
      const tempElement: PageElement = {
        ...draggingElement,
        position: {
          ...draggingElement.position,
          x: draggingElement.position.x + delta.x / zoom,
          y: draggingElement.position.y + delta.y / zoom,
        },
      };

      // Detect alignments
      const { guides } = detectAlignments(tempElement, pageConfig.elements, snapToGrid, 20);
      setAlignmentGuides(guides);
    },
    [pageConfig.elements, zoom, snapToGrid]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;
      const elementId = active.id as string;

      const draggingElement = pageConfig.elements.find((el) => el.id === elementId);
      if (!draggingElement) return;

      // Create temporary element with new position
      const tempElement: PageElement = {
        ...draggingElement,
        position: {
          ...draggingElement.position,
          x: draggingElement.position.x + delta.x / zoom,
          y: draggingElement.position.y + delta.y / zoom,
        },
      };

      // Get snapped position
      const { snappedPosition } = detectAlignments(tempElement, pageConfig.elements, snapToGrid, 20);

      const updatedElements = pageConfig.elements.map((el) => {
        if (el.id === elementId) {
          return {
            ...el,
            position: {
              ...el.position,
              x: Math.round(snappedPosition.x),
              y: Math.round(snappedPosition.y),
            },
          };
        }
        return el;
      });

      updatePageConfig({ elements: updatedElements });
      setAlignmentGuides([]); // Clear guides after drag
    },
    [pageConfig, updatePageConfig, zoom, snapToGrid]
  );

  const handleSelectTemplate = useCallback(
    (config: PageConfig) => {
      setPageConfig(config);
      setShowTemplateLibrary(false);
      showToast('Template applied', 'success');
    },
    [setPageConfig]
  );

  // Apply preset
  const applyPreset = useCallback(
    (presetElement: Omit<PageElement, 'id' | 'position'>) => {
      const newElement: PageElement = {
        ...presetElement,
        id: `el-${Date.now()}`,
        position: {
          x: 100 + pageConfig.elements.length * 20,
          y: 100 + pageConfig.elements.length * 20,
          width: 300,
          height: 100,
        },
      };

      updatePageConfig({
        elements: [...pageConfig.elements, newElement],
      });

      setSelectedElementId(newElement.id);
      setShowPresetsLibrary(false);
      showToast('Preset applied', 'success');
    },
    [pageConfig, updatePageConfig]
  );

  // Add asset from Asset Manager
  const addAssetToCanvas = useCallback(
    (assetUrl: string) => {
      const newElement: PageElement = {
        id: `el-${Date.now()}`,
        type: 'image',
        content: assetUrl,
        position: {
          x: 100 + pageConfig.elements.length * 20,
          y: 100 + pageConfig.elements.length * 20,
          width: 300,
          height: 200,
        },
        styles: {
          borderRadius: '0',
          backgroundColor: 'transparent',
        },
        visible: true,
      };

      updatePageConfig({
        elements: [...pageConfig.elements, newElement],
      });

      setSelectedElementId(newElement.id);
      setShowAssetManager(false);
    },
    [pageConfig, updatePageConfig]
  );

  // Apply grid layout from Grid Layout Builder
  const applyGridLayout = useCallback(
    (containerElement: Omit<PageElement, 'id' | 'position'>) => {
      const newElement: PageElement = {
        ...containerElement,
        id: `el-${Date.now()}`,
        position: {
          x: 100 + pageConfig.elements.length * 20,
          y: 100 + pageConfig.elements.length * 20,
          width: 800,
          height: 600,
        },
      };

      updatePageConfig({
        elements: [...pageConfig.elements, newElement],
      });

      setSelectedElementId(newElement.id);
      setShowGridLayoutBuilder(false);
    },
    [pageConfig, updatePageConfig]
  );

  // Apply animation from Animation Builder
  const applyAnimation = useCallback(
    (animation: any) => {
      if (!selectedElementId) return;

      const updatedElements = pageConfig.elements.map((el) =>
        el.id === selectedElementId
          ? {
              ...el,
              styles: {
                ...el.styles,
                animation: `${animation.name} ${animation.duration}s ${animation.timingFunction} ${animation.delay}s ${animation.iterationCount} ${animation.direction} ${animation.fillMode}`,
                animationDuration: `${animation.duration}s`,
                animationDelay: `${animation.delay}s`,
                animationIterationCount: animation.iterationCount,
              },
            }
          : el
      );

      updatePageConfig({ elements: updatedElements });
      showToast('Animation applied to element', 'success');
    },
    [selectedElementId, pageConfig, updatePageConfig]
  );

  // Multi-select and alignment functions
  const alignSelectedElements = useCallback(
    (alignment: 'left' | 'right' | 'center' | 'top' | 'bottom' | 'middle') => {
      if (selectedElementIds.length < 2) {
        showToast('Select at least 2 elements to align', 'error');
        return;
      }

      const selectedElements = pageConfig.elements.filter((el) => selectedElementIds.includes(el.id));

      let updatedElements = [...pageConfig.elements];

      if (alignment === 'left') {
        const minX = Math.min(...selectedElements.map((el) => el.position.x));
        updatedElements = updatedElements.map((el) =>
          selectedElementIds.includes(el.id) ? { ...el, position: { ...el.position, x: minX } } : el
        );
      } else if (alignment === 'right') {
        const maxRight = Math.max(...selectedElements.map((el) => el.position.x + (el.position.width as number)));
        updatedElements = updatedElements.map((el) =>
          selectedElementIds.includes(el.id)
            ? { ...el, position: { ...el.position, x: maxRight - (el.position.width as number) } }
            : el
        );
      } else if (alignment === 'center') {
        const avgCenterX = selectedElements.reduce((sum, el) => sum + el.position.x + (el.position.width as number) / 2, 0) / selectedElements.length;
        updatedElements = updatedElements.map((el) =>
          selectedElementIds.includes(el.id)
            ? { ...el, position: { ...el.position, x: avgCenterX - (el.position.width as number) / 2 } }
            : el
        );
      } else if (alignment === 'top') {
        const minY = Math.min(...selectedElements.map((el) => el.position.y));
        updatedElements = updatedElements.map((el) =>
          selectedElementIds.includes(el.id) ? { ...el, position: { ...el.position, y: minY } } : el
        );
      } else if (alignment === 'bottom') {
        const maxBottom = Math.max(...selectedElements.map((el) => el.position.y + (el.position.height as number)));
        updatedElements = updatedElements.map((el) =>
          selectedElementIds.includes(el.id)
            ? { ...el, position: { ...el.position, y: maxBottom - (el.position.height as number) } }
            : el
        );
      } else if (alignment === 'middle') {
        const avgCenterY = selectedElements.reduce((sum, el) => sum + el.position.y + (el.position.height as number) / 2, 0) / selectedElements.length;
        updatedElements = updatedElements.map((el) =>
          selectedElementIds.includes(el.id)
            ? { ...el, position: { ...el.position, y: avgCenterY - (el.position.height as number) / 2 } }
            : el
        );
      }

      updatePageConfig({ elements: updatedElements });
      showToast(`Aligned ${alignment}`, 'success');
    },
    [selectedElementIds, pageConfig, updatePageConfig]
  );

  // Smart distribution and sizing functions
  const distributeHorizontally = useCallback(() => {
    if (selectedElementIds.length < 3) {
      showToast('Select at least 3 elements to distribute', 'error');
      return;
    }

    const selectedElements = pageConfig.elements
      .filter((el) => selectedElementIds.includes(el.id))
      .sort((a, b) => a.position.x - b.position.x);

    const first = selectedElements[0];
    const last = selectedElements[selectedElements.length - 1];
    const totalSpace = last.position.x - (first.position.x + (first.position.width as number));
    const elementsWidth = selectedElements.slice(1, -1).reduce((sum, el) => sum + (el.position.width as number), 0);
    const gap = (totalSpace - elementsWidth) / (selectedElements.length - 1);

    let currentX = first.position.x + (first.position.width as number) + gap;
    const updatedElements = pageConfig.elements.map((el) => {
      if (el.id === first.id || el.id === last.id) return el;
      if (selectedElementIds.includes(el.id)) {
        const index = selectedElements.findIndex((sel) => sel.id === el.id);
        if (index > 0 && index < selectedElements.length - 1) {
          const newEl = { ...el, position: { ...el.position, x: currentX } };
          currentX += (el.position.width as number) + gap;
          return newEl;
        }
      }
      return el;
    });

    updatePageConfig({ elements: updatedElements });
    showToast('Distributed horizontally', 'success');
  }, [selectedElementIds, pageConfig, updatePageConfig]);

  const distributeVertically = useCallback(() => {
    if (selectedElementIds.length < 3) {
      showToast('Select at least 3 elements to distribute', 'error');
      return;
    }

    const selectedElements = pageConfig.elements
      .filter((el) => selectedElementIds.includes(el.id))
      .sort((a, b) => a.position.y - b.position.y);

    const first = selectedElements[0];
    const last = selectedElements[selectedElements.length - 1];
    const totalSpace = last.position.y - (first.position.y + (first.position.height as number));
    const elementsHeight = selectedElements.slice(1, -1).reduce((sum, el) => sum + (el.position.height as number), 0);
    const gap = (totalSpace - elementsHeight) / (selectedElements.length - 1);

    let currentY = first.position.y + (first.position.height as number) + gap;
    const updatedElements = pageConfig.elements.map((el) => {
      if (el.id === first.id || el.id === last.id) return el;
      if (selectedElementIds.includes(el.id)) {
        const index = selectedElements.findIndex((sel) => sel.id === el.id);
        if (index > 0 && index < selectedElements.length - 1) {
          const newEl = { ...el, position: { ...el.position, y: currentY } };
          currentY += (el.position.height as number) + gap;
          return newEl;
        }
      }
      return el;
    });

    updatePageConfig({ elements: updatedElements });
    showToast('Distributed vertically', 'success');
  }, [selectedElementIds, pageConfig, updatePageConfig]);

  const makeEqualWidth = useCallback(() => {
    if (selectedElementIds.length < 2) {
      showToast('Select at least 2 elements', 'error');
      return;
    }

    const selectedElements = pageConfig.elements.filter((el) => selectedElementIds.includes(el.id));
    const avgWidth = selectedElements.reduce((sum, el) => sum + (el.position.width as number), 0) / selectedElements.length;

    const updatedElements = pageConfig.elements.map((el) =>
      selectedElementIds.includes(el.id)
        ? { ...el, position: { ...el.position, width: Math.round(avgWidth) } }
        : el
    );

    updatePageConfig({ elements: updatedElements });
    showToast('Made equal width', 'success');
  }, [selectedElementIds, pageConfig, updatePageConfig]);

  const makeEqualHeight = useCallback(() => {
    if (selectedElementIds.length < 2) {
      showToast('Select at least 2 elements', 'error');
      return;
    }

    const selectedElements = pageConfig.elements.filter((el) => selectedElementIds.includes(el.id));
    const avgHeight = selectedElements.reduce((sum, el) => sum + (el.position.height as number), 0) / selectedElements.length;

    const updatedElements = pageConfig.elements.map((el) =>
      selectedElementIds.includes(el.id)
        ? { ...el, position: { ...el.position, height: Math.round(avgHeight) } }
        : el
    );

    updatePageConfig({ elements: updatedElements });
    showToast('Made equal height', 'success');
  }, [selectedElementIds, pageConfig, updatePageConfig]);

  // Resize handler
  const handleResize = useCallback(
    (elementId: string, newPosition: { x: number; y: number; width: number; height: number }) => {
      const updatedElements = pageConfig.elements.map((el) =>
        el.id === elementId
          ? {
              ...el,
              position: {
                x: newPosition.x,
                y: newPosition.y,
                width: newPosition.width,
                height: newPosition.height,
              },
            }
          : el
      );

      updatePageConfig({ elements: updatedElements });
    },
    [pageConfig, updatePageConfig]
  );

  // Copy/Paste handlers
  const copyElement = useCallback(() => {
    if (!selectedElementId) return;
    const element = pageConfig.elements.find((el) => el.id === selectedElementId);
    if (element) {
      setCopiedElement(element);
      showToast('Element copied', 'success');
    }
  }, [selectedElementId, pageConfig.elements]);

  const pasteElement = useCallback(() => {
    if (!copiedElement) {
      showToast('No element to paste', 'error');
      return;
    }

    const newElement: PageElement = {
      ...copiedElement,
      id: `el-${Date.now()}`,
      position: {
        ...copiedElement.position,
        x: copiedElement.position.x + 20,
        y: copiedElement.position.y + 20,
      },
    };

    updatePageConfig({
      elements: [...pageConfig.elements, newElement],
    });

    setSelectedElementId(newElement.id);
    showToast('Element pasted', 'success');
  }, [copiedElement, pageConfig, updatePageConfig]);

  // Nudge element with arrow keys
  const nudgeElement = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right', shiftKey: boolean) => {
      if (!selectedElementId) return;

      const element = pageConfig.elements.find((el) => el.id === selectedElementId);
      if (!element || element.locked) return;

      const distance = shiftKey ? 10 : 1; // 10px with Shift, 1px without
      let newX = element.position.x;
      let newY = element.position.y;

      switch (direction) {
        case 'up':
          newY -= distance;
          break;
        case 'down':
          newY += distance;
          break;
        case 'left':
          newX -= distance;
          break;
        case 'right':
          newX += distance;
          break;
      }

      const updatedElements = pageConfig.elements.map((el) =>
        el.id === selectedElementId
          ? { ...el, position: { ...el.position, x: newX, y: newY } }
          : el
      );

      updatePageConfig({
        elements: updatedElements,
      });
    },
    [selectedElementId, pageConfig, updatePageConfig]
  );

  // Z-Index / Layer Control Functions
  const bringToFront = useCallback(() => {
    if (!selectedElementId) return;

    const elementIndex = pageConfig.elements.findIndex((el) => el.id === selectedElementId);
    if (elementIndex === -1 || elementIndex === pageConfig.elements.length - 1) return;

    const element = pageConfig.elements[elementIndex];
    const updatedElements = [
      ...pageConfig.elements.slice(0, elementIndex),
      ...pageConfig.elements.slice(elementIndex + 1),
      element, // Move to end (front)
    ];

    updatePageConfig({ elements: updatedElements });
    showToast('Brought to front', 'success');
  }, [selectedElementId, pageConfig, updatePageConfig]);

  const sendToBack = useCallback(() => {
    if (!selectedElementId) return;

    const elementIndex = pageConfig.elements.findIndex((el) => el.id === selectedElementId);
    if (elementIndex === -1 || elementIndex === 0) return;

    const element = pageConfig.elements[elementIndex];
    const updatedElements = [
      element, // Move to start (back)
      ...pageConfig.elements.slice(0, elementIndex),
      ...pageConfig.elements.slice(elementIndex + 1),
    ];

    updatePageConfig({ elements: updatedElements });
    showToast('Sent to back', 'success');
  }, [selectedElementId, pageConfig, updatePageConfig]);

  const bringForward = useCallback(() => {
    if (!selectedElementId) return;

    const elementIndex = pageConfig.elements.findIndex((el) => el.id === selectedElementId);
    if (elementIndex === -1 || elementIndex === pageConfig.elements.length - 1) return;

    const updatedElements = [...pageConfig.elements];
    [updatedElements[elementIndex], updatedElements[elementIndex + 1]] =
      [updatedElements[elementIndex + 1], updatedElements[elementIndex]];

    updatePageConfig({ elements: updatedElements });
    showToast('Moved forward', 'success');
  }, [selectedElementId, pageConfig, updatePageConfig]);

  const sendBackward = useCallback(() => {
    if (!selectedElementId) return;

    const elementIndex = pageConfig.elements.findIndex((el) => el.id === selectedElementId);
    if (elementIndex === -1 || elementIndex === 0) return;

    const updatedElements = [...pageConfig.elements];
    [updatedElements[elementIndex], updatedElements[elementIndex - 1]] =
      [updatedElements[elementIndex - 1], updatedElements[elementIndex]];

    updatePageConfig({ elements: updatedElements });
    showToast('Moved backward', 'success');
  }, [selectedElementId, pageConfig, updatePageConfig]);

  // Export Functions
  const exportAsHTML = useCallback(() => {
    // Generate static HTML/CSS
    const css = pageConfig.elements.map((el, index) => {
      const styles = Object.entries(el.styles)
        .map(([key, value]) => {
          // Convert camelCase to kebab-case
          const kebabKey = key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
          return `  ${kebabKey}: ${value};`;
        })
        .join('\n');

      return `#element-${index} {
  position: absolute;
  left: ${el.position.x}px;
  top: ${el.position.y}px;
  width: ${el.position.width}px;
  height: ${el.position.height}px;
${styles}
}`;
    }).join('\n\n');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${selectedPage?.page_title || 'Page'}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .page-container {
      position: relative;
      min-height: 100vh;
      background-color: ${pageConfig.styles.backgroundColor || '#FFFFFF'};
      ${pageConfig.styles.backgroundImage ? `background-image: url(${pageConfig.styles.backgroundImage});` : ''}
      ${pageConfig.styles.backgroundSize ? `background-size: ${pageConfig.styles.backgroundSize};` : ''}
      ${pageConfig.styles.backgroundPosition ? `background-position: ${pageConfig.styles.backgroundPosition};` : ''}
      background-repeat: no-repeat;
    }

${css}
  </style>
</head>
<body>
  <div class="page-container">
${pageConfig.elements.filter((el) => el.visible !== false).map((el, index) => {
  let content = '';
  switch (el.type) {
    case 'text':
      content = `<p id="element-${index}">${el.content}</p>`;
      break;
    case 'heading':
      content = `<h2 id="element-${index}">${el.content}</h2>`;
      break;
    case 'button':
      content = `<button id="element-${index}">${el.content}</button>`;
      break;
    case 'image':
      content = `<img id="element-${index}" src="${el.content}" alt="" />`;
      break;
    case 'container':
      content = `<div id="element-${index}"></div>`;
      break;
    case 'divider':
      content = `<div id="element-${index}"></div>`;
      break;
    case 'shape':
      content = `<div id="element-${index}"></div>`;
      break;
    case 'video':
      if (el.content && el.content.includes('youtube')) {
        content = `<iframe id="element-${index}" src="${el.content.replace('watch?v=', 'embed/')}" frameborder="0" allowfullscreen></iframe>`;
      } else if (el.content && el.content.includes('vimeo')) {
        content = `<iframe id="element-${index}" src="${el.content.replace('vimeo.com/', 'player.vimeo.com/video/')}" frameborder="0" allowfullscreen></iframe>`;
      } else if (el.content) {
        content = `<video id="element-${index}" src="${el.content}" controls></video>`;
      }
      break;
    default:
      content = `<div id="element-${index}">${el.content}</div>`;
  }
  return `    ${content}`;
}).join('\n')}
  </div>
</body>
</html>`;

    // Download HTML file
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPage?.page_key || 'page'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('HTML exported successfully', 'success');
    setShowExportMenu(false);
  }, [pageConfig, selectedPage]);

  const exportAsJSON = useCallback(() => {
    const json = JSON.stringify(pageConfig, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPage?.page_key || 'page'}-config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('JSON exported successfully', 'success');
    setShowExportMenu(false);
  }, [pageConfig, selectedPage]);

  const exportAsPNG = useCallback(async () => {
    try {
      // Use html2canvas if available, otherwise show instruction
      const html2canvas = (window as any).html2canvas;
      if (!html2canvas) {
        showToast('PNG export requires html2canvas library. Install it to enable this feature.', 'error');
        return;
      }

      const canvas = document.querySelector('.page-container');
      if (!canvas) {
        showToast('Canvas not found', 'error');
        return;
      }

      const canvasImage = await html2canvas(canvas);
      const url = canvasImage.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedPage?.page_key || 'page'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast('PNG exported successfully', 'success');
      setShowExportMenu(false);
    } catch (error) {
      showToast('Failed to export as PNG', 'error');
      console.error(error);
    }
  }, [selectedPage]);

  const copyHTMLToClipboard = useCallback(async () => {
    // Generate the same HTML as exportAsHTML
    const css = pageConfig.elements.map((el, index) => {
      const styles = Object.entries(el.styles)
        .map(([key, value]) => {
          const kebabKey = key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
          return `  ${kebabKey}: ${value};`;
        })
        .join('\n');

      return `#element-${index} {
  position: absolute;
  left: ${el.position.x}px;
  top: ${el.position.y}px;
  width: ${el.position.width}px;
  height: ${el.position.height}px;
${styles}
}`;
    }).join('\n\n');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${selectedPage?.page_title || 'Page'}</title>
  <style>
    body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    .page-container {
      position: relative;
      min-height: 100vh;
      background-color: ${pageConfig.styles.backgroundColor || '#FFFFFF'};
      ${pageConfig.styles.backgroundImage ? `background-image: url(${pageConfig.styles.backgroundImage});` : ''}
      ${pageConfig.styles.backgroundSize ? `background-size: ${pageConfig.styles.backgroundSize};` : ''}
      ${pageConfig.styles.backgroundPosition ? `background-position: ${pageConfig.styles.backgroundPosition};` : ''}
    }
${css}
  </style>
</head>
<body>
  <div class="page-container">
${pageConfig.elements.filter((el) => el.visible !== false).map((el, index) => {
  let content = '';
  switch (el.type) {
    case 'text':
      content = `<p id="element-${index}">${el.content}</p>`;
      break;
    case 'heading':
      content = `<h2 id="element-${index}">${el.content}</h2>`;
      break;
    case 'button':
      content = `<button id="element-${index}">${el.content}</button>`;
      break;
    case 'image':
      content = `<img id="element-${index}" src="${el.content}" alt="" />`;
      break;
    default:
      content = `<div id="element-${index}">${el.content}</div>`;
  }
  return `    ${content}`;
}).join('\n')}
  </div>
</body>
</html>`;

    try {
      await navigator.clipboard.writeText(html);
      showToast('HTML copied to clipboard', 'success');
      setShowExportMenu(false);
    } catch (error) {
      showToast('Failed to copy HTML', 'error');
      console.error(error);
    }
  }, [pageConfig, selectedPage]);

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
      // Ctrl+C / Cmd+C - Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElementId) {
        e.preventDefault();
        copyElement();
      }
      // Ctrl+V / Cmd+V - Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        pasteElement();
      }
      // Arrow keys - Nudge element (1px or 10px with Shift)
      if (selectedElementId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Don't nudge if user is typing in an input field
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }

        e.preventDefault();
        const direction = e.key.replace('Arrow', '').toLowerCase() as 'up' | 'down' | 'left' | 'right';
        nudgeElement(direction, e.shiftKey);
      }
      // Ctrl+] / Cmd+] - Bring Forward
      if ((e.ctrlKey || e.metaKey) && e.key === ']' && !e.shiftKey && selectedElementId) {
        e.preventDefault();
        bringForward();
      }
      // Ctrl+[ / Cmd+[ - Send Backward
      if ((e.ctrlKey || e.metaKey) && e.key === '[' && !e.shiftKey && selectedElementId) {
        e.preventDefault();
        sendBackward();
      }
      // Ctrl+Shift+] / Cmd+Shift+] - Bring to Front
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '}' && selectedElementId) {
        e.preventDefault();
        bringToFront();
      }
      // Ctrl+Shift+[ / Cmd+Shift+[ - Send to Back
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '{' && selectedElementId) {
        e.preventDefault();
        sendToBack();
      }
      // ? or Ctrl+/ - Show Keyboard Shortcuts Help
      if (e.key === '?' || ((e.ctrlKey || e.metaKey) && e.key === '/')) {
        e.preventDefault();
        setShowShortcutsHelp(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo, selectedElementId, deleteElement, duplicateElement, handleSave, copyElement, pasteElement, nudgeElement, bringToFront, sendToBack, bringForward, sendBackward]);

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
          <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-5 h-5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
            <button
              onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
              className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium px-3 min-w-[4rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.25))}
              className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`w-11 h-11 flex items-center justify-center rounded-lg transition-colors ${
              showGrid ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="Toggle Grid"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>

          {/* Snap to Grid Toggle */}
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`w-11 h-11 flex items-center justify-center rounded-lg transition-colors ${
              snapToGrid ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-100'
            }`}
            title={snapToGrid ? 'Snap to Grid: ON' : 'Snap to Grid: OFF'}
          >
            <Magnet className="w-5 h-5" />
          </button>

          {/* Viewport Selector */}
          <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
            <button
              onClick={() => setViewport('desktop')}
              className={`w-11 h-11 flex items-center justify-center rounded-lg transition-colors ${
                viewport === 'desktop' ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100'
              }`}
              title="Desktop View (Full Width)"
            >
              <Monitor className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`w-11 h-11 flex items-center justify-center rounded-lg transition-colors ${
                viewport === 'tablet' ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`w-11 h-11 flex items-center justify-center rounded-lg transition-colors ${
                viewport === 'mobile' ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-5 h-5" />
            </button>
          </div>

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

          {/* Keyboard Shortcuts Help Button */}
          <button
            onClick={() => setShowShortcutsHelp(true)}
            className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors border-l border-gray-200 ml-3"
            title="Keyboard Shortcuts (? or Ctrl+/)"
          >
            <Keyboard className="w-5 h-5" />
          </button>

          {/* Export Menu */}
          <div className="relative export-menu-container">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 export-menu-container">
                <button
                  onClick={exportAsHTML}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <Code className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Export as HTML</div>
                    <div className="text-xs text-gray-500">Static HTML/CSS file</div>
                  </div>
                </button>
                <button
                  onClick={exportAsJSON}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <FileJson className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Export as JSON</div>
                    <div className="text-xs text-gray-500">Page configuration</div>
                  </div>
                </button>
                <button
                  onClick={exportAsPNG}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <ImageIconDownload className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Export as PNG</div>
                    <div className="text-xs text-gray-500">Screenshot image</div>
                  </div>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={copyHTMLToClipboard}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <Copy className="w-4 h-4 text-orange-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Copy HTML</div>
                    <div className="text-xs text-gray-500">To clipboard</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Save & Publish */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 min-h-[44px]"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span className="font-medium">Save</span>
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors min-h-[44px]"
          >
            <Rocket className="w-5 h-5" />
            <span className="font-medium">Publish</span>
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
              className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold mb-2 min-h-[44px]"
            >
              <Sparkles className="w-5 h-5" />
              Templates
            </button>
            <button
              onClick={() => setShowPresetsLibrary(true)}
              className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold mb-2 min-h-[44px]"
            >
              <Plus className="w-5 h-5" />
              Element Presets
            </button>
            <button
              onClick={() => setShowVersionHistory(true)}
              className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold mb-2 min-h-[44px]"
            >
              <Clock className="w-5 h-5" />
              Version History
            </button>
            <button
              onClick={() => setShowAssetManager(true)}
              className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold mb-2 min-h-[44px]"
            >
              <ImageIcon className="w-5 h-5" />
              Asset Manager
            </button>
            <button
              onClick={() => setShowGridLayoutBuilder(true)}
              className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold mb-2 min-h-[44px]"
            >
              <Grid3x3 className="w-5 h-5" />
              Grid Layout
            </button>
            <button
              onClick={() => setShowAnimationBuilder(true)}
              disabled={!selectedElementId}
              className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold mb-2 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              title={!selectedElementId ? 'Select an element first' : 'Add animations'}
            >
              <Sparkles className="w-5 h-5" />
              Animations
            </button>
            <button
              onClick={() => setShowPageSettings(true)}
              className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold min-h-[44px]"
            >
              <Palette className="w-5 h-5" />
              Page Settings
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
            <div className="mx-auto" style={{
              maxWidth: viewport === 'desktop' ? '1200px' : viewport === 'tablet' ? '768px' : '375px',
              transition: 'max-width 0.3s ease-in-out'
            }}>
              {/* Viewport Indicator */}
              <div className="mb-2 text-center">
                <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm">
                  {viewport === 'desktop' ? 'Desktop (1200px)' : viewport === 'tablet' ? 'Tablet (768px)' : 'Mobile (375px)'}
                </span>
              </div>

              {/* Alignment Toolbar (shown when multiple elements selected) */}
              {selectedElementIds.length >= 2 && (
                <div className="mb-4 space-y-2">
                  {/* Alignment Row */}
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-3 flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-semibold mr-2">{selectedElementIds.length} elements • Align</span>
                    <div className="w-px h-6 bg-white/30" />
                    <button
                      onClick={() => alignSelectedElements('left')}
                      className="w-11 h-11 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                      title="Align Left"
                    >
                      <AlignHorizontalJustifyStart className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => alignSelectedElements('center')}
                      className="w-11 h-11 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                      title="Align Center"
                    >
                      <AlignHorizontalJustifyCenter className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => alignSelectedElements('right')}
                      className="w-11 h-11 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                      title="Align Right"
                    >
                      <AlignHorizontalJustifyEnd className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-white/30" />
                    <button
                      onClick={() => alignSelectedElements('top')}
                      className="w-11 h-11 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                      title="Align Top"
                    >
                      <AlignVerticalJustifyStart className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => alignSelectedElements('middle')}
                      className="w-11 h-11 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                      title="Align Middle"
                    >
                      <AlignVerticalJustifyCenter className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => alignSelectedElements('bottom')}
                      className="w-11 h-11 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                      title="Align Bottom"
                    >
                      <AlignVerticalJustifyEnd className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-white/30" />
                    <button
                      onClick={() => setSelectedElementIds([])}
                      className="px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm font-medium min-h-[44px]"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Smart Guides & Distribution Row */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg shadow-lg p-3 flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-semibold mr-2">Smart Tools</span>
                    <div className="w-px h-6 bg-white/30" />
                    {selectedElementIds.length >= 3 && (
                      <>
                        <button
                          onClick={distributeHorizontally}
                          className="flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm font-medium min-h-[44px]"
                          title="Distribute Horizontally"
                        >
                          <ArrowLeftRight className="w-5 h-5" />
                          Distribute H
                        </button>
                        <button
                          onClick={distributeVertically}
                          className="flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm font-medium min-h-[44px]"
                          title="Distribute Vertically"
                        >
                          <ArrowUpDown className="w-5 h-5" />
                          Distribute V
                        </button>
                        <div className="w-px h-6 bg-white/30" />
                      </>
                    )}
                    <button
                      onClick={makeEqualWidth}
                      className="flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm font-medium min-h-[44px]"
                      title="Make Equal Width"
                    >
                      <Maximize2 className="w-5 h-5" />
                      Equal Width
                    </button>
                    <button
                      onClick={makeEqualHeight}
                      className="flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm font-medium min-h-[44px]"
                      title="Make Equal Height"
                    >
                      <Minimize2 className="w-5 h-5" />
                      Equal Height
                    </button>
                  </div>
                </div>
              )}

              {/* Element Toolbar */}
              <div className="mb-4 bg-white rounded-lg shadow-sm p-3 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => addElement('text')}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium min-h-[44px]"
                >
                  <Type className="w-5 h-5" />
                  Text
                </button>
                <button
                  onClick={() => addElement('heading')}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium min-h-[44px]"
                >
                  <Type className="w-5 h-5 font-bold" />
                  Heading
                </button>
                <button
                  onClick={() => addElement('button')}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium min-h-[44px]"
                >
                  <Square className="w-5 h-5" />
                  Button
                </button>
                <button
                  onClick={() => addElement('image')}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium min-h-[44px]"
                >
                  <ImageIcon className="w-5 h-5" />
                  Image
                </button>
                <button
                  onClick={() => addElement('container')}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium min-h-[44px]"
                >
                  <Square className="w-5 h-5" />
                  Container
                </button>
                <div className="w-px h-6 bg-gray-300" />
                <button
                  onClick={() => addElement('divider')}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium min-h-[44px]"
                >
                  <Minus className="w-5 h-5" />
                  Divider
                </button>
                <button
                  onClick={() => addElement('icon')}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium min-h-[44px]"
                >
                  <Star className="w-5 h-5" />
                  Icon
                </button>
                <button
                  onClick={() => addElement('video')}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium min-h-[44px]"
                >
                  <Video className="w-5 h-5" />
                  Video
                </button>
                <button
                  onClick={() => addElement('shape')}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium min-h-[44px]"
                >
                  <Circle className="w-5 h-5" />
                  Shape
                </button>
              </div>

              {/* Layer Control Toolbar (shown when element is selected) */}
              {selectedElementId && (
                <div className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-sm p-3 flex items-center gap-2 flex-wrap">
                  <span className="text-white text-sm font-semibold mr-2">Layer Order</span>
                  <div className="w-px h-6 bg-white/30" />
                  <button
                    onClick={bringToFront}
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm font-medium"
                    title="Bring to Front (Ctrl+Shift+])"
                  >
                    <ArrowUpToLine className="w-4 h-4" />
                    To Front
                  </button>
                  <button
                    onClick={bringForward}
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm font-medium"
                    title="Bring Forward (Ctrl+])"
                  >
                    <ArrowUp className="w-4 h-4" />
                    Forward
                  </button>
                  <button
                    onClick={sendBackward}
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm font-medium"
                    title="Send Backward (Ctrl+[)"
                  >
                    <ArrowDown className="w-4 h-4" />
                    Backward
                  </button>
                  <button
                    onClick={sendToBack}
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm font-medium"
                    title="Send to Back (Ctrl+Shift+[)"
                  >
                    <ArrowDownToLine className="w-4 h-4" />
                    To Back
                  </button>
                  <div className="w-px h-6 bg-white/30" />
                  <span className="text-white/80 text-xs">
                    Position: {pageConfig.elements.findIndex((el) => el.id === selectedElementId) + 1} of {pageConfig.elements.length}
                  </span>
                </div>
              )}

              {/* Canvas */}
              <DndContext sensors={sensors} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
                <div
                  className="relative min-h-[800px] rounded-lg shadow-2xl overflow-hidden transition-transform"
                  style={{
                    backgroundColor: pageConfig.styles.backgroundColor || '#FFFFFF',
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                    backgroundImage: [
                      showGrid ? 'linear-gradient(#00000010 1px, transparent 1px), linear-gradient(90deg, #00000010 1px, transparent 1px)' : null,
                      pageConfig.styles.backgroundImage ? `url(${pageConfig.styles.backgroundImage})` : null,
                    ].filter(Boolean).join(', ') || 'none',
                    backgroundSize: [
                      showGrid ? '20px 20px' : null,
                      pageConfig.styles.backgroundSize || 'cover',
                    ].filter(Boolean).join(', ') || 'auto',
                    backgroundPosition: pageConfig.styles.backgroundPosition || 'center',
                    backgroundRepeat: 'repeat, no-repeat',
                  }}
                  onClick={() => setSelectedElementId(null)}
                >
                  {/* Alignment Guides */}
                  <AlignmentGuides
                    guides={alignmentGuides}
                    canvasWidth={2000}
                    canvasHeight={2000}
                    zoom={zoom}
                  />

                  {pageConfig.elements
                    .filter((el) => el.visible !== false)
                    .map((element) => (
                      <ResizableElement
                        key={element.id}
                        element={element}
                        isSelected={selectedElementId === element.id}
                        onResize={handleResize}
                      >
                        <DraggableElement
                          element={element}
                          isSelected={selectedElementId === element.id}
                          onClick={() => setSelectedElementId(element.id)}
                          zoom={zoom}
                        />
                      </ResizableElement>
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

      {/* Presets Library Modal */}
      {showPresetsLibrary && (
        <PresetsLibrary
          onClose={() => setShowPresetsLibrary(false)}
          onApplyPreset={applyPreset}
          selectedElement={selectedElement}
        />
      )}

      {/* Version History Modal */}
      {showVersionHistory && selectedPage && (
        <VersionHistory
          onClose={() => setShowVersionHistory(false)}
          currentPageKey={selectedPage.page_key}
          currentConfig={pageConfig}
          onRestore={restoreVersion}
        />
      )}

      {/* Asset Manager Modal */}
      {showAssetManager && (
        <AssetManager
          onClose={() => setShowAssetManager(false)}
          onSelectAsset={addAssetToCanvas}
        />
      )}

      {/* Grid Layout Builder Modal */}
      {showGridLayoutBuilder && (
        <GridLayoutBuilder
          onClose={() => setShowGridLayoutBuilder(false)}
          onApplyLayout={applyGridLayout}
        />
      )}

      {/* Animation Builder Modal */}
      {showAnimationBuilder && (
        <AnimationBuilder
          onClose={() => setShowAnimationBuilder(false)}
          onApplyAnimation={applyAnimation}
          currentElement={selectedElement}
        />
      )}

      {/* Page Settings Modal */}
      {showPageSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Page Settings</h2>
              <button
                onClick={() => setShowPageSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={pageConfig.styles.backgroundColor || '#FFFFFF'}
                    onChange={(e) =>
                      updatePageConfig({
                        styles: { ...pageConfig.styles, backgroundColor: e.target.value },
                      })
                    }
                    className="w-20 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={pageConfig.styles.backgroundColor || '#FFFFFF'}
                    onChange={(e) =>
                      updatePageConfig({
                        styles: { ...pageConfig.styles, backgroundColor: e.target.value },
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>

              {/* Background Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image URL
                </label>
                <input
                  type="text"
                  value={pageConfig.styles.backgroundImage || ''}
                  onChange={(e) =>
                    updatePageConfig({
                      styles: { ...pageConfig.styles, backgroundImage: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Background Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Size
                </label>
                <select
                  value={pageConfig.styles.backgroundSize || 'cover'}
                  onChange={(e) =>
                    updatePageConfig({
                      styles: { ...pageConfig.styles, backgroundSize: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="auto">Auto</option>
                  <option value="100% 100%">Stretch</option>
                </select>
              </div>

              {/* Background Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Position
                </label>
                <select
                  value={pageConfig.styles.backgroundPosition || 'center'}
                  onChange={(e) =>
                    updatePageConfig({
                      styles: { ...pageConfig.styles, backgroundPosition: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="top left">Top Left</option>
                  <option value="top right">Top Right</option>
                  <option value="bottom left">Bottom Left</option>
                  <option value="bottom right">Bottom Right</option>
                </select>
              </div>

              {/* Preview */}
              {pageConfig.styles.backgroundImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div
                    className="w-full h-48 rounded-lg border-2 border-gray-300"
                    style={{
                      backgroundColor: pageConfig.styles.backgroundColor || '#FFFFFF',
                      backgroundImage: `url(${pageConfig.styles.backgroundImage})`,
                      backgroundSize: pageConfig.styles.backgroundSize || 'cover',
                      backgroundPosition: pageConfig.styles.backgroundPosition || 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  updatePageConfig({
                    styles: {
                      backgroundColor: '#FFFFFF',
                      backgroundImage: '',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    },
                  });
                  showToast('Page settings reset', 'success');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
              >
                Reset to Default
              </button>
              <button
                onClick={() => setShowPageSettings(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help Modal */}
      {showShortcutsHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500">
              <div className="flex items-center gap-3">
                <Keyboard className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={() => setShowShortcutsHelp(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-500 rounded"></div>
                    General
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Save page</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl+S</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Show shortcuts</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">? or Ctrl+/</kbd>
                    </div>
                  </div>
                </div>

                {/* Editing */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-green-500 rounded"></div>
                    Editing
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Undo</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl+Z</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Redo</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl+Y</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Delete element</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Delete</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Duplicate element</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl+D</kbd>
                    </div>
                  </div>
                </div>

                {/* Copy & Paste */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-orange-500 rounded"></div>
                    Copy & Paste
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Copy element</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl+C</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Paste element</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl+V</kbd>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-purple-500 rounded"></div>
                    Navigation
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Nudge 1px</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Arrow Keys</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Nudge 10px</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Shift+Arrows</kbd>
                    </div>
                  </div>
                </div>

                {/* Layers */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-indigo-500 rounded"></div>
                    Layers
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Bring to front</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl+Shift+]</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Bring forward</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl+]</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Send backward</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl+[</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Send to back</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl+Shift+[</kbd>
                    </div>
                  </div>
                </div>

                {/* Resize */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-pink-500 rounded"></div>
                    Resize
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">Maintain aspect ratio</span>
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Shift+Drag</kbd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Pro Tips
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Hold <kbd className="px-1.5 py-0.5 bg-white rounded text-xs font-mono">Shift</kbd> while resizing to maintain aspect ratio</li>
                  <li>• Use arrow keys for precise positioning (1px or 10px with Shift)</li>
                  <li>• Press <kbd className="px-1.5 py-0.5 bg-white rounded text-xs font-mono">?</kbd> anytime to see this shortcuts panel</li>
                  <li>• All shortcuts work with <kbd className="px-1.5 py-0.5 bg-white rounded text-xs font-mono">Cmd</kbd> on Mac instead of Ctrl</li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowShortcutsHelp(false)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors font-semibold"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
