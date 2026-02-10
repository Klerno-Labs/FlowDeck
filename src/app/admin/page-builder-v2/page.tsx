'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Layers,
  Image as ImageIcon,
  Type,
  Square,
  Circle,
  Palette,
  Download,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Eye,
  Settings,
  Plus,
  Trash2,
  Copy,
  ArrowLeft,
  Maximize2,
  FileImage,
  Scissors,
  Star,
  History,
  Play,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import { celebrateSuccess } from '@/lib/utils/confetti';

// Import our elite Canva-level components
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
    fontWeight?: string;
    borderRadius?: number;
    opacity?: number;
  };
}

interface Page {
  id: string;
  name: string;
  width: number;
  height: number;
  elements: PageElement[];
}

/**
 * Elite Page Builder V2
 * Complete UI/UX overhaul with Canva-level features
 */
export default function PageBuilderV2() {
  const [currentPage, setCurrentPage] = useState<Page>({
    id: '1',
    name: 'Untitled Design',
    width: 1080,
    height: 1080,
    elements: [],
  });

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<Page[]>([currentPage]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [saving, setSaving] = useState(false);

  // Canva feature modals
  const [showBrandKit, setShowBrandKit] = useState(false);
  const [showMagicResize, setShowMagicResize] = useState(false);
  const [showStockPhotos, setShowStockPhotos] = useState(false);
  const [showBackgroundRemover, setShowBackgroundRemover] = useState(false);
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);

  const selectedElement = currentPage.elements.find(el => el.id === selectedElementId);

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

  // Delete selected element
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
  const pushHistory = (page: Page) => {
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
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    celebrateSuccess();
    showToast('Design saved successfully! ✨', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Top Toolbar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-lg"
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left - Back & Page Info */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => window.location.href = '/admin'}
                variant="ghost"
                size="md"
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </Button>
              <div className="h-8 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{currentPage.name}</h1>
                <p className="text-xs text-gray-500">
                  {currentPage.width} × {currentPage.height}px
                </p>
              </div>
            </div>

            {/* Center - Main Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={undo}
                disabled={historyIndex === 0}
                variant="ghost"
                size="md"
                className="hover:bg-gray-100"
                title="Undo (Cmd+Z)"
              >
                <Undo className="w-5 h-5" />
              </Button>
              <Button
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                variant="ghost"
                size="md"
                className="hover:bg-gray-100"
                title="Redo (Cmd+Shift+Z)"
              >
                <Redo className="w-5 h-5" />
              </Button>
              <div className="h-8 w-px bg-gray-300 mx-2" />
              <Button
                onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
                variant="ghost"
                size="md"
                className="hover:bg-gray-100"
              >
                <ZoomOut className="w-5 h-5" />
              </Button>
              <div className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </div>
              <Button
                onClick={() => setZoom(Math.min(4, zoom + 0.25))}
                variant="ghost"
                size="md"
                className="hover:bg-gray-100"
              >
                <ZoomIn className="w-5 h-5" />
              </Button>
            </div>

            {/* Right - Save & Export */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                variant="secondary"
                size="md"
                className="bg-white border-2 border-gray-300 hover:border-gray-400"
              >
                {saving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Save className="w-5 h-5" />
                    </motion.div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowAdvancedExport(true)}
                variant="primary"
                size="md"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50"
              >
                <Download className="w-5 h-5" />
                Export
              </Button>
            </div>
          </div>

          {/* Secondary Toolbar - Canva Features */}
          <div className="flex items-center gap-2 px-6 py-3 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-2 flex-1">
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
              <Button
                onClick={() => setShowBackgroundRemover(true)}
                variant="ghost"
                size="sm"
                className="hover:bg-white/80"
                disabled={!selectedElement || selectedElement.type !== 'image'}
              >
                <Scissors className="w-4 h-4" />
                Remove BG
              </Button>
              <div className="h-6 w-px bg-gray-300 mx-2" />
              <Button
                onClick={() => setShowGrid(!showGrid)}
                variant="ghost"
                size="sm"
                className={showGrid ? 'bg-white/80' : 'hover:bg-white/80'}
              >
                <Grid3x3 className="w-4 h-4" />
                Grid
              </Button>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-purple-200">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-purple-900">
                {currentPage.elements.length} elements
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Elements & Tools */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-80 bg-white/80 backdrop-blur-xl border-r border-gray-200 shadow-xl overflow-y-auto"
          >
            <div className="p-6">
              {/* Add Elements Section */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Elements
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addElement('text')}
                    className="group p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all"
                  >
                    <Type className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-blue-900">Text</div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowStockPhotos(true)}
                    className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition-all"
                  >
                    <ImageIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-purple-900">Image</div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addElement('shape')}
                    className="group p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border-2 border-green-200 hover:border-green-400 transition-all"
                  >
                    <Square className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-green-900">Shape</div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowBrandKit(true)}
                    className="group p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200 hover:border-orange-400 transition-all"
                  >
                    <Sparkles className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-orange-900">Brand</div>
                  </motion.button>
                </div>
              </div>

              {/* Layers Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Layers ({currentPage.elements.length})
                </h3>
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
                        className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                          selectedElementId === element.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {element.type === 'text' && <Type className="w-4 h-4 text-blue-600" />}
                          {element.type === 'image' && <ImageIcon className="w-4 h-4 text-purple-600" />}
                          {element.type === 'shape' && <Square className="w-4 h-4 text-green-600" />}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-gray-900 truncate">
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
          <div className="flex-1 overflow-auto bg-gray-100/50 p-12">
            <div className="flex items-center justify-center min-h-full">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative bg-white rounded-2xl shadow-2xl"
                style={{
                  transform: `scale(${zoom})`,
                  width: currentPage.width,
                  height: currentPage.height,
                }}
              >
                {/* Grid */}
                {showGrid && (
                  <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
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
                      className={`absolute cursor-move ${selectedElementId === element.id ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
                      style={{
                        left: element.x,
                        top: element.y,
                        width: element.width,
                        height: element.height,
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
                            fontSize: element.styles?.fontSize,
                            fontFamily: element.styles?.fontFamily,
                            fontWeight: element.styles?.fontWeight,
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
                            borderRadius: element.styles?.borderRadius,
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
                            borderRadius: element.styles?.borderRadius,
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
                        <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Start Creating
                      </h3>
                      <p className="text-gray-600">
                        Add elements from the sidebar to begin
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Right Sidebar - Properties */}
          <AnimatePresence>
            {selectedElement && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="w-80 bg-white/80 backdrop-blur-xl border-l border-gray-200 shadow-xl overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Properties</h3>
                    <Button
                      onClick={() => setSelectedElementId(null)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-6">
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
                      className="flex-1 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>

                  {/* Element Info */}
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                      <div className="text-sm font-semibold text-purple-900 mb-2">
                        {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Element
                      </div>
                      <div className="space-y-1 text-xs text-purple-700">
                        <div>Position: {selectedElement.x}, {selectedElement.y}</div>
                        <div>Size: {selectedElement.width} × {selectedElement.height}</div>
                      </div>
                    </div>

                    {/* More properties would go here */}
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
            // Apply color to selected shape
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
          if (selectedElement && selectedElement.type === 'image') {
            // Update element with processed image
          }
        }}
      />

      <AdvancedExport
        isOpen={showAdvancedExport}
        onClose={() => setShowAdvancedExport(false)}
        canvasElement={document.querySelector('.canvas-container') as HTMLElement}
        fileName={currentPage.name}
      />
    </div>
  );
}
