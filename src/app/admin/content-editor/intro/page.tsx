'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Plus, Trash2, Save, Upload, GripVertical, Eye, EyeOff, Sparkles, History, Send, Palette, Command as CommandIcon } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdminFlowDeckPage } from '@/components/layout/AdminFlowDeckPage';
import { Button } from '@/components/ui/Button';
import { TipTapEditor } from '@/components/content-editor/TipTapEditor';
import { DraftIndicator } from '@/components/content-editor/DraftIndicator';
import { VersionHistory } from '@/components/content-editor/VersionHistory';
import { CommandPalette } from '@/components/content-editor/CommandPalette';
import { ColorPickerPopover } from '@/components/content-editor/ColorPickerPopover';
import { celebratePublish } from '@/lib/utils/confetti';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface SlideItem {
  id: string;
  slide_id: string;
  content: string;
  bullet_color: string | null;
  display_order: number;
}

interface PresentationSlide {
  id: string;
  slide_key: string;
  title: string;
  heading: string;
  paragraph: string;
  image_path: string | null;
  display_order: number;
  items: SlideItem[];
}

const BULLET_COLORS = [
  { value: '#00B4D8', name: 'Cyan', bg: 'bg-cyan-400' },
  { value: '#1E5AA8', name: 'Blue', bg: 'bg-blue-600' },
  { value: '#8DC63F', name: 'Green', bg: 'bg-green-500' },
  { value: '#F17A2C', name: 'Orange', bg: 'bg-orange-500' },
  { value: '#4169E1', name: 'Royal Blue', bg: 'bg-blue-500' },
];

function SortableItem({ item, slideId, onUpdate, onRemove }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`group relative ${isDragging ? 'z-50' : ''}`}>
      <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-manipulation"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Input */}
        <input
          type="text"
          value={item.content}
          onChange={(e) => onUpdate(item.id, 'content', e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-50 rounded-lg border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Enter bullet point..."
        />

        {/* Elite Color Picker */}
        <ColorPickerPopover
          color={item.bullet_color || '#00B4D8'}
          onChange={(color) => onUpdate(item.id, 'bullet_color', color)}
          presetColors={BULLET_COLORS.map(c => c.value)}
        />

        {/* Delete */}
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 rounded-lg hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all touch-manipulation"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function IntroEditorPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<PresentationSlide[]>([]);
  const [expandedSlideId, setExpandedSlideId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewVisible, setPreviewVisible] = useState(true);

  // Draft & version management
  const [hasDraft, setHasDraft] = useState(false);
  const [draftStatus, setDraftStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Elite features
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchSlides();
  }, []);

  // Auto-save every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (expandedSlideId && !saving && !autoSaving) {
        handleAutoSave(expandedSlideId);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [expandedSlideId, slides, saving, autoSaving]);

  // Elite keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      meta: true,
      ctrl: true,
      callback: () => setShowCommandPalette(true),
      description: 'Open command palette',
    },
    {
      key: 's',
      meta: true,
      ctrl: true,
      callback: () => {
        if (expandedSlideId && !saving) {
          handleSave(expandedSlideId);
        }
      },
      description: 'Save slide',
    },
    {
      key: 's',
      meta: true,
      ctrl: true,
      shift: true,
      callback: () => {
        if (expandedSlideId && !publishing) {
          handlePublish(expandedSlideId);
        }
      },
      description: 'Publish slide',
    },
  ]);

  // Command palette handler
  const handleCommand = (commandId: string) => {
    switch (commandId) {
      case 'save':
        if (expandedSlideId) handleSave(expandedSlideId);
        break;
      case 'publish':
        if (expandedSlideId) handlePublish(expandedSlideId);
        break;
      case 'history':
        setShowVersionHistory(true);
        break;
      case 'toggle-preview':
        setPreviewVisible(!previewVisible);
        break;
    }
  };

  // Define available commands
  const availableCommands = [
    {
      id: 'save',
      label: 'Save Draft',
      icon: <Save className="w-4 h-4" />,
      shortcut: '⌘S',
      category: 'Actions',
    },
    {
      id: 'publish',
      label: 'Publish Slide',
      icon: <Send className="w-4 h-4" />,
      shortcut: '⌘⇧S',
      category: 'Actions',
    },
    {
      id: 'history',
      label: 'View Version History',
      icon: <History className="w-4 h-4" />,
      category: 'Actions',
    },
    {
      id: 'toggle-preview',
      label: previewVisible ? 'Hide Preview' : 'Show Preview',
      icon: previewVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />,
      category: 'View',
    },
  ];

  async function fetchSlides() {
    try {
      const res = await fetch('/api/content-editor/intro');
      if (!res.ok) throw new Error('Failed to fetch slides');
      const data = await res.json();
      setSlides(data.slides || []);
      if (data.slides && data.slides.length > 0) {
        setExpandedSlideId(data.slides[0].id);

        // Check for drafts for each slide
        for (const slide of data.slides) {
          const draftRes = await fetch(`/api/drafts/intro_slide/${slide.id}`);
          if (draftRes.ok) {
            const draftData = await draftRes.json();
            if (draftData.hasDraft && draftData.draft) {
              setHasDraft(true);
              // Optionally load draft data into editor
              // For now, just indicate that drafts exist
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
      showToast('Failed to load slides', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleAutoSave(slideId: string) {
    setAutoSaving(true);
    setDraftStatus('saving');
    try {
      const slide = slides.find(s => s.id === slideId);
      if (!slide) return;

      // Save to draft API instead of direct publish
      const res = await fetch(`/api/drafts/intro_slide/${slideId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftData: {
            heading: slide.heading,
            paragraph: slide.paragraph,
            image_path: slide.image_path,
            items: slide.items,
          },
        }),
      });

      if (res.ok) {
        setLastSaved(new Date());
        setHasDraft(true);
        setDraftStatus('saved');
      } else {
        setDraftStatus('error');
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      setDraftStatus('error');
    } finally {
      setAutoSaving(false);
    }
  }

  async function handlePublish(slideId: string) {
    if (!confirm('Publish this slide? This will create a new version and update the live content.')) {
      return;
    }

    setPublishing(true);
    try {
      const slide = slides.find(s => s.id === slideId);
      if (!slide) return;

      // Publish creates a version snapshot
      const res = await fetch(`/api/versions/intro_slide/${slideId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          versionData: {
            heading: slide.heading,
            paragraph: slide.paragraph,
            image_path: slide.image_path,
            items: slide.items,
          },
          changeSummary: `Published changes to ${slide.title}`,
        }),
      });

      if (!res.ok) throw new Error('Failed to publish');

      // Also update the published content
      const updateRes = await fetch('/api/content-editor/intro', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideId: slide.id,
          data: {
            heading: slide.heading,
            paragraph: slide.paragraph,
            image_path: slide.image_path,
          },
          items: slide.items,
        }),
      });

      if (!updateRes.ok) throw new Error('Failed to update content');

      setHasDraft(false);
      showToast('Slide published successfully! ✨', 'success');
      celebratePublish(); // 🎉 Elite confetti celebration!
      router.refresh();
    } catch (error) {
      console.error('Error publishing slide:', error);
      showToast('Failed to publish slide', 'error');
    } finally {
      setPublishing(false);
    }
  }

  async function handleRestoreVersion(versionNumber: number) {
    try {
      const res = await fetch(`/api/versions/intro_slide/${expandedSlideId}?version=${versionNumber}`);
      if (!res.ok) throw new Error('Failed to fetch version');

      const data = await res.json();
      const versionData = data.version.version_data;

      // Restore to current editing state
      setSlides(prev => prev.map(slide =>
        slide.id === expandedSlideId
          ? {
              ...slide,
              heading: versionData.heading,
              paragraph: versionData.paragraph,
              image_path: versionData.image_path,
              items: versionData.items,
            }
          : slide
      ));

      showToast(`Version ${versionNumber} restored to editor`, 'success');
    } catch (error) {
      console.error('Error restoring version:', error);
      showToast('Failed to restore version', 'error');
    }
  }

  async function handleSave(slideId: string) {
    setSaving(true);
    try {
      const slide = slides.find(s => s.id === slideId);
      if (!slide) return;

      const res = await fetch('/api/content-editor/intro', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideId: slide.id,
          data: {
            heading: slide.heading,
            paragraph: slide.paragraph,
            image_path: slide.image_path,
          },
          items: slide.items,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      setLastSaved(new Date());
      showToast('Slide saved successfully! ✨', 'success');
      router.refresh();
    } catch (error) {
      console.error('Error saving slide:', error);
      showToast('Failed to save slide', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(slideId: string, file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();

      setSlides(prev => prev.map(slide =>
        slide.id === slideId ? { ...slide, image_path: data.url } : slide
      ));

      showToast('Image uploaded successfully! 🖼️', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  }

  function updateSlideField(slideId: string, field: keyof PresentationSlide, value: any) {
    setSlides(prev => prev.map(slide =>
      slide.id === slideId ? { ...slide, [field]: value } : slide
    ));
  }

  function updateSlideItem(slideId: string, itemId: string, field: keyof SlideItem, value: any) {
    setSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;
      return {
        ...slide,
        items: slide.items.map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      };
    }));
  }

  function addSlideItem(slideId: string) {
    setSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;
      const maxOrder = Math.max(0, ...slide.items.map(i => i.display_order));
      const colorIndex = slide.items.length % BULLET_COLORS.length;
      return {
        ...slide,
        items: [
          ...slide.items,
          {
            id: `temp-${Date.now()}`,
            slide_id: slideId,
            content: '',
            bullet_color: BULLET_COLORS[colorIndex].value,
            display_order: maxOrder + 1,
          },
        ],
      };
    }));
  }

  function removeSlideItem(slideId: string, itemId: string) {
    setSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;
      return {
        ...slide,
        items: slide.items.filter(item => item.id !== itemId),
      };
    }));
  }

  function handleDragEnd(event: any, slideId: string) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;

      const oldIndex = slide.items.findIndex(item => item.id === active.id);
      const newIndex = slide.items.findIndex(item => item.id === over.id);

      return {
        ...slide,
        items: arrayMove(slide.items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          display_order: index + 1,
        })),
      };
    }));
  }

  if (loading) {
    return (
      <AdminFlowDeckPage
        title="Edit Intro Slides"
        subtitle="Loading..."
        showHome={true}
        showBack={true}
        backTo="/admin/content-editor"
      >
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading slides...</p>
          </div>
        </div>
      </AdminFlowDeckPage>
    );
  }

  return (
    <AdminFlowDeckPage
      title="Edit Intro Slides"
      subtitle="Edit Company Overview and What We Guarantee presentation content"
      showHome={true}
      showBack={true}
      backTo="/admin/content-editor"
      rightActions={
        <div className="flex items-center gap-3">
          <DraftIndicator status={draftStatus} lastSaved={lastSaved} />

          {expandedSlideId && (
            <>
              <Button
                onClick={() => handlePublish(expandedSlideId)}
                disabled={publishing || autoSaving}
                variant="primary"
                size="md"
              >
                <Send className="w-4 h-4" />
                {publishing ? 'Publishing...' : 'Publish'}
              </Button>

              <Button
                onClick={() => setShowVersionHistory(true)}
                variant="secondary"
                size="md"
              >
                <History className="w-4 h-4" />
                History
              </Button>
            </>
          )}

          <Button
            onClick={() => setPreviewVisible(!previewVisible)}
            variant="ghost"
            size="md"
          >
            {previewVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            {previewVisible ? 'Hide' : 'Show'} Preview
          </Button>
        </div>
      }
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">

        {/* Auto-save indicator */}
        {lastSaved && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            {autoSaving ? (
              <>
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Last saved {lastSaved.toLocaleTimeString()}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content - Elite Split View */}
      <div className={`grid ${previewVisible ? 'grid-cols-2' : 'grid-cols-1'} gap-8`}>
        {/* Editor Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {slides.map((slide, index) => {
            const isExpanded = expandedSlideId === slide.id;

            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500" />
                <div className="relative rounded-3xl border-2 border-gray-200 overflow-hidden bg-white shadow-xl hover:shadow-2xl hover:border-blue-300 transition-all duration-300">
                {/* Elite Slide Header */}
                <button
                  onClick={() => setExpandedSlideId(isExpanded ? null : slide.id)}
                  className="w-full p-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center justify-between transition-all duration-300 group/header"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover/header:bg-white/30 transition-all"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-6 h-6 text-white" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-white" />
                      )}
                    </motion.div>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">{slide.title}</h3>
                      <p className="text-sm text-white/80 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-white/60"></span>
                        {slide.items.length} bullet points
                      </p>
                    </div>
                  </div>
                  <Sparkles className="w-7 h-7 text-white/90 group-hover/header:text-white group-hover/header:rotate-12 transition-all duration-300" />
                </button>

                {/* Elite Slide Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-8 space-y-6 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-white backdrop-blur-sm">
                    {/* Elite Heading Input */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Heading <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={slide.heading}
                        onChange={(e) => updateSlideField(slide.id, 'heading', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300 transition-all text-lg font-semibold shadow-sm hover:shadow-md"
                        placeholder="Enter heading..."
                      />
                    </motion.div>

                    {/* Paragraph */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Paragraph <span className="text-red-500">*</span>
                      </label>
                      <TipTapEditor
                        content={slide.paragraph}
                        onChange={(content) => updateSlideField(slide.id, 'paragraph', content)}
                        placeholder="Enter paragraph text..."
                      />
                      <p className="mt-2 text-sm text-gray-500">{slide.paragraph.length} characters</p>
                    </div>

                    {/* Image */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Image</label>
                      {slide.image_path && (
                        <div className="mb-4 relative group">
                          <Image
                            src={slide.image_path}
                            alt={slide.title}
                            width={400}
                            height={300}
                            className="rounded-xl object-cover shadow-lg"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-xl flex items-center justify-center">
                            <label className="opacity-0 group-hover:opacity-100 cursor-pointer px-4 py-2 bg-white rounded-lg font-semibold transition-all">
                              <Upload className="w-5 h-5 inline mr-2" />
                              Change Image
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(slide.id, file);
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                      <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl cursor-pointer hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl active:scale-95">
                        <Upload className="w-5 h-5" />
                        <span className="font-semibold">
                          {uploading ? 'Uploading...' : slide.image_path ? 'Replace Image' : 'Upload Image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(slide.id, file);
                          }}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Bullet Points */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Bullet Points <span className="text-gray-500 font-normal">(drag to reorder)</span>
                      </label>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(event) => handleDragEnd(event, slide.id)}
                      >
                        <SortableContext items={slide.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-3">
                            {slide.items.map((item) => (
                              <SortableItem
                                key={item.id}
                                item={item}
                                slideId={slide.id}
                                onUpdate={updateSlideItem.bind(null, slide.id)}
                                onRemove={removeSlideItem.bind(null, slide.id)}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>

                      <button
                        onClick={() => addSlideItem(slide.id)}
                        className="mt-4 w-full px-4 py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600 font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                        Add Bullet Point
                      </button>
                    </div>

                    {/* Elite Save Button */}
                    <div className="pt-6 border-t-2 border-gray-200/50">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSave(slide.id)}
                        disabled={saving || autoSaving}
                        className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                      >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save & Publish'}
                      </motion.button>
                    </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Elite Live Preview */}
        <AnimatePresence>
          {previewVisible && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="sticky top-6"
            >
              <div className="rounded-3xl border-2 border-gray-200 overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-50">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400 shadow-lg"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-lg"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg"></div>
                    </div>
                    <div className="w-px h-6 bg-white/20"></div>
                    <span className="text-white text-sm font-bold flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Live Preview
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-500/50"></div>
                </div>
                <div className="p-4 bg-white">
                  <iframe
                    src="/intro-presentation"
                    className="w-full h-[600px] rounded-2xl border-2 border-gray-200"
                    title="Live Preview"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>

      {/* Version History Modal */}
      {showVersionHistory && expandedSlideId && (
        <VersionHistory
          contentType="intro_slide"
          contentId={expandedSlideId}
          onRestore={handleRestoreVersion}
          onClose={() => setShowVersionHistory(false)}
        />
      )}

      {/* Elite Command Palette (⌘K) */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onCommand={handleCommand}
        availableCommands={availableCommands}
      />
    </AdminFlowDeckPage>
  );
}
