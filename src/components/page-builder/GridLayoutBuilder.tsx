'use client';

import { useState } from 'react';
import { X, Grid3x3, Rows, Columns, Plus, Minus, AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import { PageElement } from '@/types/page-builder';

interface GridLayoutBuilderProps {
  onClose: () => void;
  onApplyLayout: (containerElement: Omit<PageElement, 'id' | 'position'>) => void;
}

type LayoutType = 'grid' | 'flex';
type FlexDirection = 'row' | 'column';
type AlignItems = 'flex-start' | 'center' | 'flex-end' | 'stretch';
type JustifyContent = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';

interface GridPreset {
  name: string;
  description: string;
  columns: number;
  rows: number;
  gap: number;
  template?: string;
}

export function GridLayoutBuilder({ onClose, onApplyLayout }: GridLayoutBuilderProps) {
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');

  // Grid settings
  const [gridColumns, setGridColumns] = useState(3);
  const [gridRows, setGridRows] = useState(3);
  const [gridGap, setGridGap] = useState(16);
  const [gridAutoFlow, setGridAutoFlow] = useState<'row' | 'column' | 'dense'>('row');

  // Flex settings
  const [flexDirection, setFlexDirection] = useState<FlexDirection>('row');
  const [flexWrap, setFlexWrap] = useState<'wrap' | 'nowrap'>('wrap');
  const [alignItems, setAlignItems] = useState<AlignItems>('stretch');
  const [justifyContent, setJustifyContent] = useState<JustifyContent>('flex-start');
  const [flexGap, setFlexGap] = useState(16);

  // Container settings
  const [containerWidth, setContainerWidth] = useState(800);
  const [containerHeight, setContainerHeight] = useState(600);
  const [containerPadding, setContainerPadding] = useState(16);
  const [containerBgColor, setContainerBgColor] = useState('#F3F4F6');

  const gridPresets: GridPreset[] = [
    { name: '2-Column', description: 'Two equal columns', columns: 2, rows: 1, gap: 16 },
    { name: '3-Column', description: 'Three equal columns', columns: 3, rows: 1, gap: 16 },
    { name: '4-Column', description: 'Four equal columns', columns: 4, rows: 1, gap: 16 },
    { name: 'Sidebar Left', description: '1:3 ratio layout', columns: 2, rows: 1, gap: 16, template: '1fr 3fr' },
    { name: 'Sidebar Right', description: '3:1 ratio layout', columns: 2, rows: 1, gap: 16, template: '3fr 1fr' },
    { name: '2x2 Grid', description: 'Four equal cells', columns: 2, rows: 2, gap: 16 },
    { name: '3x3 Grid', description: 'Nine equal cells', columns: 3, rows: 3, gap: 16 },
    { name: 'Masonry 3-Col', description: 'Three columns auto rows', columns: 3, rows: 1, gap: 16 },
  ];

  const flexPresets = [
    { name: 'Horizontal Row', direction: 'row' as FlexDirection, wrap: 'wrap' as const, align: 'stretch' as AlignItems, justify: 'flex-start' as JustifyContent },
    { name: 'Centered Row', direction: 'row' as FlexDirection, wrap: 'wrap' as const, align: 'center' as AlignItems, justify: 'center' as JustifyContent },
    { name: 'Space Between', direction: 'row' as FlexDirection, wrap: 'wrap' as const, align: 'center' as AlignItems, justify: 'space-between' as JustifyContent },
    { name: 'Vertical Column', direction: 'column' as FlexDirection, wrap: 'nowrap' as const, align: 'stretch' as AlignItems, justify: 'flex-start' as JustifyContent },
    { name: 'Centered Column', direction: 'column' as FlexDirection, wrap: 'nowrap' as const, align: 'center' as AlignItems, justify: 'center' as JustifyContent },
  ];

  const applyGridPreset = (preset: GridPreset) => {
    setGridColumns(preset.columns);
    setGridRows(preset.rows);
    setGridGap(preset.gap);
    showToast(`${preset.name} preset applied`, 'success');
  };

  const applyFlexPreset = (preset: typeof flexPresets[0]) => {
    setFlexDirection(preset.direction);
    setFlexWrap(preset.wrap);
    setAlignItems(preset.align);
    setJustifyContent(preset.justify);
    showToast(`${preset.name} preset applied`, 'success');
  };

  const generateGridStyles = () => {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
      gridTemplateRows: `repeat(${gridRows}, 1fr)`,
      gap: `${gridGap}px`,
      gridAutoFlow: gridAutoFlow,
      padding: `${containerPadding}px`,
      backgroundColor: containerBgColor,
      borderRadius: '12px',
      border: '2px solid #E5E7EB',
    };
  };

  const generateFlexStyles = () => {
    return {
      display: 'flex',
      flexDirection: flexDirection,
      flexWrap: flexWrap,
      alignItems: alignItems,
      justifyContent: justifyContent,
      gap: `${flexGap}px`,
      padding: `${containerPadding}px`,
      backgroundColor: containerBgColor,
      borderRadius: '12px',
      border: '2px solid #E5E7EB',
    };
  };

  const handleApply = () => {
    const styles = layoutType === 'grid' ? generateGridStyles() : generateFlexStyles();

    const containerElement: Omit<PageElement, 'id' | 'position'> = {
      type: 'container',
      content: '',
      styles: {
        ...styles,
        backgroundColor: containerBgColor,
        padding: `${containerPadding}px`,
        borderRadius: '12px',
        border: '2px solid #E5E7EB',
      },
      visible: true,
      meta: {
        layoutType,
        ...(layoutType === 'grid'
          ? { gridColumns, gridRows, gridGap, gridAutoFlow }
          : { flexDirection, flexWrap, alignItems, justifyContent, flexGap }),
      },
    };

    onApplyLayout(containerElement);
    onClose();
    showToast(`${layoutType === 'grid' ? 'Grid' : 'Flex'} layout added to canvas`, 'success');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex">
        {/* Left Panel - Settings */}
        <div className="w-96 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Grid3x3 className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Grid Layout Builder</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-white/90">Create responsive layouts with CSS Grid or Flexbox</p>
          </div>

          {/* Layout Type Selector */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
              Layout Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setLayoutType('grid')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  layoutType === 'grid'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
                CSS Grid
              </button>
              <button
                onClick={() => setLayoutType('flex')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  layoutType === 'flex'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <Rows className="w-4 h-4" />
                Flexbox
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {layoutType === 'grid' ? (
              <>
                {/* Grid Presets */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                    Quick Presets
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {gridPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyGridPreset(preset)}
                        className="p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
                      >
                        <p className="text-sm font-semibold text-gray-900">{preset.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{preset.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Columns */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Columns
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGridColumns(Math.max(1, gridColumns - 1))}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={gridColumns}
                      onChange={(e) => setGridColumns(parseInt(e.target.value) || 1)}
                      className="flex-1 px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-lg"
                    />
                    <button
                      onClick={() => setGridColumns(Math.min(12, gridColumns + 1))}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Grid Rows */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rows
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGridRows(Math.max(1, gridRows - 1))}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={gridRows}
                      onChange={(e) => setGridRows(parseInt(e.target.value) || 1)}
                      className="flex-1 px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-lg"
                    />
                    <button
                      onClick={() => setGridRows(Math.min(12, gridRows + 1))}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Grid Gap */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gap: {gridGap}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="64"
                    step="4"
                    value={gridGap}
                    onChange={(e) => setGridGap(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Grid Auto Flow */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto Flow
                  </label>
                  <select
                    value={gridAutoFlow}
                    onChange={(e) => setGridAutoFlow(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="row">Row</option>
                    <option value="column">Column</option>
                    <option value="dense">Dense</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                {/* Flex Presets */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                    Quick Presets
                  </label>
                  <div className="space-y-2">
                    {flexPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyFlexPreset(preset)}
                        className="w-full p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
                      >
                        <p className="text-sm font-semibold text-gray-900">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flex Direction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Direction
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFlexDirection('row')}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        flexDirection === 'row'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Columns className="w-4 h-4" />
                      Row
                    </button>
                    <button
                      onClick={() => setFlexDirection('column')}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        flexDirection === 'column'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Rows className="w-4 h-4" />
                      Column
                    </button>
                  </div>
                </div>

                {/* Flex Wrap */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wrap
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFlexWrap('nowrap')}
                      className={`flex-1 px-3 py-2 rounded-lg transition-all ${
                        flexWrap === 'nowrap'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      No Wrap
                    </button>
                    <button
                      onClick={() => setFlexWrap('wrap')}
                      className={`flex-1 px-3 py-2 rounded-lg transition-all ${
                        flexWrap === 'wrap'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Wrap
                    </button>
                  </div>
                </div>

                {/* Align Items */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Align Items
                  </label>
                  <select
                    value={alignItems}
                    onChange={(e) => setAlignItems(e.target.value as AlignItems)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                    <option value="stretch">Stretch</option>
                  </select>
                </div>

                {/* Justify Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Justify Content
                  </label>
                  <select
                    value={justifyContent}
                    onChange={(e) => setJustifyContent(e.target.value as JustifyContent)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                    <option value="space-between">Space Between</option>
                    <option value="space-around">Space Around</option>
                    <option value="space-evenly">Space Evenly</option>
                  </select>
                </div>

                {/* Flex Gap */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gap: {flexGap}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="64"
                    step="4"
                    value={flexGap}
                    onChange={(e) => setFlexGap(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {/* Container Settings */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Container Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width: {containerWidth}px
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="1200"
                    step="50"
                    value={containerWidth}
                    onChange={(e) => setContainerWidth(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height: {containerHeight}px
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="800"
                    step="50"
                    value={containerHeight}
                    onChange={(e) => setContainerHeight(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Padding: {containerPadding}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="48"
                    step="4"
                    value={containerPadding}
                    onChange={(e) => setContainerPadding(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={containerBgColor}
                      onChange={(e) => setContainerBgColor(e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={containerBgColor}
                      onChange={(e) => setContainerBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleApply}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add Layout to Canvas
            </button>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col bg-gray-100">
          <div className="p-6 border-b border-gray-200 bg-white">
            <h3 className="text-xl font-bold text-gray-900">Live Preview</h3>
            <p className="text-sm text-gray-500 mt-1">
              See how your layout will look on the canvas
            </p>
          </div>

          <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
            <div
              style={{
                ...((layoutType === 'grid' ? generateGridStyles() : generateFlexStyles()) as React.CSSProperties),
                width: `${containerWidth}px`,
                height: `${containerHeight}px`,
              }}
            >
              {layoutType === 'grid'
                ? Array.from({ length: gridColumns * gridRows }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                    >
                      <span className="text-gray-400 text-sm font-medium">Cell {i + 1}</span>
                    </div>
                  ))
                : Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center"
                      style={{
                        width: flexDirection === 'row' ? '150px' : 'auto',
                        height: flexDirection === 'column' ? '80px' : 'auto',
                      }}
                    >
                      <span className="text-gray-400 text-sm font-medium">Item {i + 1}</span>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
