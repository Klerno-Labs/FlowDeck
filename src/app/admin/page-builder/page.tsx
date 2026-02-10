'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Layers,
  Image as ImageIcon,
  Type,
  Square,
  Palette,
  Download,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Plus,
  Trash2,
  Copy,
  Maximize2,
  FileImage,
  Scissors,
  Command as CommandIcon,
  Loader2,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import { celebratePublish } from '@/lib/utils/confetti';
import { AdminFlowDeckPage } from '@/components/layout/AdminFlowDeckPage';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { CommandPalette } from '@/components/content-editor/CommandPalette';

// Import Canva-level components
import { BrandKit } from '@/components/page-builder/BrandKit';
import { MagicResize } from '@/components/page-builder/MagicResize';
import { StockPhotos } from '@/components/page-builder/StockPhotos';
import { BackgroundRemover } from '@/components/page-builder/BackgroundRemover';
import { AdvancedExport } from '@/components/page-builder/AdvancedExport';

interface PageElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  content?: string;
  src?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  styles?: {
    backgroundColor?: string;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    borderRadius?: number;
    opacity?: number;
  };
}

interface DesignPage {
  id: string;
  name: string;
  width: number;
  height: number;
  elements: PageElement[];
}

/**
 * Elite Page Builder
 * Canva-level design tool with professional UI/UX
 */
export default function ElitePageBuilder() {
  const [currentPage, setCurrentPage] = useState<DesignPage>({
    id: '1',
    name: 'Untitled Design',
    width: 1080,
    height: 1080,
    elements: [],
  });

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.8);
  const [history, setHistory] = useState<DesignPage[]>([currentPage]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draftStatus, setDraftStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Canva feature modals
  const [showBrandKit, setShowBrandKit] = useState(false);
  const [showMagicResize, setShowMagicResize] = useState(false);
  const [showStockPhotos, setShowStockPhotos] = useState(false);
  const [showBackgroundRemover, setShowBackgroundRemover] = useState(false);
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const selectedElement = currentPage.elements.find(el => el.id === selectedElementId);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'k', meta: true, ctrl: true, callback: () => setShowCommandPalette(true) },
    { key: 's', meta: true, ctrl: true, callback: () => handleSave() },
    { key: 'z', meta: true, ctrl: true, callback: () => undo() },
    { key: 'z', meta: true, ctrl: true, shift: true, callback: () => redo() },
    { key: 'Delete', callback: () => deleteElement() },
    { key: 'Backspace', callback: () => deleteElement() },
  ]);

  // Add element to canvas
  const addElement = (type: 'text' | 'image' | 'shape') => {
    const newElement: PageElement = {
      id: `${type}-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : 150,
      height: type === 'text' ? 50 : 150,
      content: type === 'text' ? 'Double click to edit' : undefined,
      styles: {
        backgroundColor: type === 'shape' ? '#00B4D8' : undefined,
        color: type === 'text' ? '#000000' : undefined,
        fontSize: type === 'text' ? 18 : undefined,
        fontFamily: type === 'text' ? 'Inter, sans-serif' : undefined,
        borderRadius: type === 'shape' ? 8 : 0,
        opacity: 1,
      },
    };

    const updatedPage = {
      ...currentPage,
      elements: [...currentPage.elements, newElement],
    };

    setCurrentPage(updatedPage);
    pushHistory(updatedPage);
    setSelectedElementId(newElement.id);
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} added!`, 'success');
  };

  // Delete element
  const deleteElement = () => {
    if (!selectedElementId) return;

    const updatedPage = {
      ...currentPage,
      elements: currentPage.elements.filter(el => el.id !== selectedElementId),
    };

    setCurrentPage(updatedPage);
    pushHistory(updatedPage);
    setSelectedElementId(null);
    showToast('Element deleted', 'success');
  };

  // Duplicate element
  const duplicateElement = () => {
    if (!selectedElement) return;

    const newElement: PageElement = {
      ...selectedElement,
      id: `${selectedElement.type}-${Date.now()}`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20,
    };

    const updatedPage = {
      ...currentPage,
      elements: [...currentPage.elements, newElement],
    };

    setCurrentPage(updatedPage);
    pushHistory(updatedPage);
    setSelectedElementId(newElement.id);
    showToast('Element duplicated!', 'success');
  };

  // History management
  const pushHistory = (page: DesignPage) => {
    const newHistory = [...history.slice(0, historyIndex + 1), page];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPage(history[historyIndex - 1]);
      showToast('Undo', 'success');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPage(history[historyIndex + 1]);
      showToast('Redo', 'success');
    }
  };

  // Save design
  const handleSave = async () => {
    setSaving(true);
    setDraftStatus('saving');
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setDraftStatus('saved');
    celebratePublish();
    showToast('Design saved successfully! ✨', 'success');
  };

  // Command palette actions
  const commandPaletteActions = [
    {
      id: 'save',
      label: 'Save Design',
      icon: <Save className="w-5 h-5" />,
      shortcut: '⌘S',
      category: 'Actions',
    },
    {
      id: 'export',
      label: 'Export Design',
      icon: <Download className="w-5 h-5" />,
      shortcut: '⌘E',
      category: 'Actions',
    },
    {
      id: 'brand-kit',
      label: 'Open Brand Kit',
      icon: <Palette className="w-5 h-5" />,
      shortcut: '⌘B',
      category: 'Tools',
    },
    {
      id: 'magic-resize',
      label: 'Magic Resize',
      icon: <Maximize2 className="w-5 h-5" />,
      shortcut: '⌘R',
      category: 'Tools',
    },
    {
      id: 'stock-photos',
      label: 'Stock Photos',
      icon: <FileImage className="w-5 h-5" />,
      shortcut: '⌘I',
      category: 'Tools',
    },
    {
      id: 'undo',
      label: 'Undo',
      icon: <Undo className="w-5 h-5" />,
      shortcut: '⌘Z',
      category: 'Edit',
    },
    {
      id: 'redo',
      label: 'Redo',
      icon: <Redo className="w-5 h-5" />,
      shortcut: '⌘⇧Z',
      category: 'Edit',
    },
  ];

  const handleCommand = (commandId: string) => {
    switch (commandId) {
      case 'save':
        handleSave();
        break;
      case 'export':
        setShowAdvancedExport(true);
        break;
      case 'brand-kit':
        setShowBrandKit(true);
        break;
      case 'magic-resize':
        setShowMagicResize(true);
        break;
      case 'stock-photos':
        setShowStockPhotos(true);
        break;
      case 'undo':
        undo();
        break;
      case 'redo':
        redo();
        break;
    }
  };

  return (
    <AdminFlowDeckPage
      title="Page Builder"
      subtitle="Create stunning designs with Canva-level features"
      showHome={true}
      showBack={true}
      backTo="/admin"
    >
      <div className="max-w-full h-full flex flex-col">
        {/* Top Toolbar - Matching Content Editor Style */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-white">{currentPage.name}</h2>
              </div>
              <div className="text-sm text-gray-600">
                {currentPage.width} × {currentPage.height}px • {currentPage.elements.length} elements
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Draft Status */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-gray-200">
                {draftStatus === 'saving' ? (
                  <>
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-sm font-semibold text-blue-600">Saving...</span>
                  </>
                ) : draftStatus === 'saved' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">All changes saved</span>
                  </>
                ) : null}
              </div>

              <Button
                onClick={() => setShowCommandPalette(true)}
                variant="secondary"
                size="md"
                className="bg-white border-2 border-gray-300 hover:border-gray-400"
              >
                <CommandIcon className="w-5 h-5" />
                Commands
              </Button>

              <Button
                onClick={() => setShowAdvancedExport(true)}
                variant="primary"
                size="md"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/50"
              >
                <Download className="w-5 h-5" />
                Export
              </Button>
            </div>
          </div>

          {/* Secondary Toolbar - Canva Features */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Edit Tools */}
            <div className="flex items-center gap-2 p-2 bg-white rounded-2xl border-2 border-gray-200 shadow-md">
              <Button
                onClick={undo}
                disabled={historyIndex === 0}
                variant="ghost"
                size="sm"
                title="Undo (Cmd+Z)"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                variant="ghost"
                size="sm"
                title="Redo (Cmd+Shift+Z)"
              >
                <Redo className="w-4 h-4" />
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <Button
                onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
                variant="ghost"
                size="sm"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <div className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </div>
              <Button
                onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                variant="ghost"
                size="sm"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <Button
                onClick={() => setShowGrid(!showGrid)}
                variant="ghost"
                size="sm"
                className={showGrid ? 'bg-blue-50 text-blue-600' : ''}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
            </div>

            {/* Canva Features */}
            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-md">
              <Button
                onClick={() => setShowBrandKit(true)}
                variant="ghost"
                size="sm"
                className="hover:bg-white/80"
              >
                <Palette className="w-4 h-4" />
                Brand Kit
              </Button>
              <Button
                onClick={() => setShowMagicResize(true)}
                variant="ghost"
                size="sm"
                className="hover:bg-white/80"
              >
                <Maximize2 className="w-4 h-4" />
                Magic Resize
              </Button>
              <Button
                onClick={() => setShowStockPhotos(true)}
                variant="ghost"
                size="sm"
                className="hover:bg-white/80"
              >
                <FileImage className="w-4 h-4" />
                Stock Photos
              </Button>
              {selectedElement?.type === 'image' && (
                <Button
                  onClick={() => setShowBackgroundRemover(true)}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/80"
                >
                  <Scissors className="w-4 h-4" />
                  Remove BG
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Left Sidebar - Add Elements */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-80 space-y-6"
          >
            {/* Add Elements Card */}
            <div className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-xl">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Elements
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addElement('text')}
                  className="w-full group p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all shadow-md hover:shadow-xl"
                >
                  <Type className="w-8 h-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-base font-bold text-blue-900">Add Text</div>
                  <div className="text-xs text-blue-600 mt-1">Create headings & paragraphs</div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowStockPhotos(true)}
                  className="w-full group p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition-all shadow-md hover:shadow-xl"
                >
                  <ImageIcon className="w-8 h-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-base font-bold text-purple-900">Add Image</div>
                  <div className="text-xs text-purple-600 mt-1">Millions of free stock photos</div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addElement('shape')}
                  className="w-full group p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border-2 border-green-200 hover:border-green-400 transition-all shadow-md hover:shadow-xl"
                >
                  <Square className="w-8 h-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-base font-bold text-green-900">Add Shape</div>
                  <div className="text-xs text-green-600 mt-1">Rectangles, circles & more</div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBrandKit(true)}
                  className="w-full group p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200 hover:border-orange-400 transition-all shadow-md hover:shadow-xl"
                >
                  <Sparkles className="w-8 h-8 text-orange-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-base font-bold text-orange-900">Brand Assets</div>
                  <div className="text-xs text-orange-600 mt-1">Colors, fonts & logos</div>
                </motion.button>
              </div>
            </div>

            {/* Layers Card */}
            <div className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-xl">
              <div className="p-6 bg-gradient-to-r from-green-600 to-teal-600">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Layers ({currentPage.elements.length})
                </h3>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                {currentPage.elements.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No elements yet</p>
                    <p className="text-xs mt-1">Add elements to get started</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentPage.elements.map((element, index) => (
                      <motion.button
                        key={element.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedElementId(element.id)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                          selectedElementId === element.id
                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {element.type === 'text' && <Type className="w-5 h-5 text-blue-600" />}
                          {element.type === 'image' && <ImageIcon className="w-5 h-5 text-purple-600" />}
                          {element.type === 'shape' && <Square className="w-5 h-5 text-green-600" />}
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-gray-900 truncate">
                              {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {element.width} × {element.height}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Center Canvas */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 bg-gray-100/50 rounded-3xl p-12 overflow-auto"
          >
            <div className="flex items-center justify-center min-h-full">
              <div
                className="relative bg-white rounded-2xl shadow-2xl border-4 border-gray-300"
                style={{
                  width: currentPage.width * zoom,
                  height: currentPage.height * zoom,
                }}
                onClick={() => setSelectedElementId(null)}
              >
                {/* Grid */}
                {showGrid && (
                  <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden" style={{
                    backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
                    backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                  }} />
                )}

                {/* Elements */}
                <AnimatePresence>
                  {currentPage.elements.map((element) => (
                    <motion.div
                      key={element.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`absolute cursor-move ${selectedElementId === element.id ? 'ring-4 ring-purple-500 ring-offset-2 shadow-2xl z-10' : 'hover:ring-2 hover:ring-blue-300'}`}
                      style={{
                        left: element.x * zoom,
                        top: element.y * zoom,
                        width: element.width * zoom,
                        height: element.height * zoom,
                        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElementId(element.id);
                      }}
                    >
                      {element.type === 'text' && (
                        <div
                          className="w-full h-full flex items-center justify-center px-4"
                          style={{
                            color: element.styles?.color,
                            fontSize: (element.styles?.fontSize || 18) * zoom,
                            fontFamily: element.styles?.fontFamily,
                            opacity: element.styles?.opacity,
                          }}
                        >
                          {element.content}
                        </div>
                      )}
                      {element.type === 'shape' && (
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundColor: element.styles?.backgroundColor,
                            borderRadius: (element.styles?.borderRadius || 0) * zoom,
                            opacity: element.styles?.opacity,
                          }}
                        />
                      )}
                      {element.type === 'image' && element.src && (
                        <img
                          src={element.src}
                          alt="Element"
                          className="w-full h-full object-cover"
                          style={{
                            borderRadius: (element.styles?.borderRadius || 0) * zoom,
                            opacity: element.styles?.opacity,
                          }}
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Empty State */}
                {currentPage.elements.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        Start Creating
                      </h3>
                      <p className="text-gray-600 text-lg">
                        Add elements from the sidebar to begin
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar - Properties */}
          <AnimatePresence>
            {selectedElement && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="w-80 space-y-6"
              >
                {/* Properties Card */}
                <div className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-xl">
                  <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600">
                    <h3 className="text-lg font-bold text-white">Properties</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={duplicateElement}
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4" />
                        Duplicate
                      </Button>
                      <Button
                        onClick={deleteElement}
                        variant="secondary"
                        size="sm"
                        className="flex-1 text-red-600 hover:bg-red-50 border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>

                    {/* Element Info */}
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                      <div className="text-sm font-bold text-purple-900 mb-2">
                        {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Element
                      </div>
                      <div className="space-y-1 text-xs text-purple-700">
                        <div>Position: {selectedElement.x}, {selectedElement.y}</div>
                        <div>Size: {selectedElement.width} × {selectedElement.height}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Canva Feature Modals */}
      <BrandKit
        isOpen={showBrandKit}
        onClose={() => setShowBrandKit(false)}
        onApplyColor={(color) => {
          if (selectedElement?.type === 'shape') {
            // Apply color logic
          }
        }}
      />

      <MagicResize
        isOpen={showMagicResize}
        onClose={() => setShowMagicResize(false)}
        currentWidth={currentPage.width}
        currentHeight={currentPage.height}
        onResize={(width, height) => {
          setCurrentPage({ ...currentPage, width, height });
          showToast(`Resized to ${width}×${height}!`, 'success');
        }}
      />

      <StockPhotos
        isOpen={showStockPhotos}
        onClose={() => setShowStockPhotos(false)}
        onSelectPhoto={(photoUrl) => {
          const newElement: PageElement = {
            id: `image-${Date.now()}`,
            type: 'image',
            src: photoUrl,
            x: 100,
            y: 100,
            width: 300,
            height: 200,
            styles: { opacity: 1 },
          };
          setCurrentPage({
            ...currentPage,
            elements: [...currentPage.elements, newElement],
          });
        }}
      />

      <BackgroundRemover
        isOpen={showBackgroundRemover}
        onClose={() => setShowBackgroundRemover(false)}
        imageUrl={selectedElement?.src || ''}
        onComplete={(processedUrl) => {
          // Update logic
        }}
      />

      <AdvancedExport
        isOpen={showAdvancedExport}
        onClose={() => setShowAdvancedExport(false)}
        canvasElement={document.querySelector('.canvas-container') as HTMLElement}
        fileName={currentPage.name}
      />

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onCommand={handleCommand}
        availableCommands={commandPaletteActions}
      />
    </AdminFlowDeckPage>
  );
}
