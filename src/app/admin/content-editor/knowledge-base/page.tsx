'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Save,
  Upload,
  GripVertical,
  Sparkles,
  Eye,
  RefreshCw,
  History,
  Send,
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { TipTapEditor } from '@/components/content-editor/TipTapEditor';
import { DraftIndicator } from '@/components/content-editor/DraftIndicator';
import { VersionHistory } from '@/components/content-editor/VersionHistory';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdminFlowDeckPage } from '@/components/layout/AdminFlowDeckPage';

interface KnowledgeSlideItem {
  id: string;
  slide_id: string;
  content: string;
  display_order: number;
}

interface KnowledgeSlide {
  id: string;
  slide_key: string;
  title: string;
  subtitle: string | null;
  layout: 'content-left' | 'content-right';
  image_path: string;
  quote: string | null;
  display_order: number;
  items: KnowledgeSlideItem[];
}

// Sortable Item Component for Drag & Drop
function SortableContentItem({
  item,
  slideId,
  index,
  onUpdate,
  onRemove,
}: {
  item: KnowledgeSlideItem;
  slideId: string;
  index: number;
  onUpdate: (itemId: string, field: keyof KnowledgeSlideItem, value: any) => void;
  onRemove: (itemId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragging ? 'z-50 opacity-50' : 'opacity-100'}`}
    >
      <div className="flex items-start gap-3 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all p-3 shadow-sm hover:shadow-md">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-3 p-1 touch-manipulation cursor-grab active:cursor-grabbing text-gray-400 hover:text-blue-600 transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Content Input */}
        <div className="flex-1">
          <input
            type="text"
            value={item.content}
            onChange={(e) => onUpdate(item.id, 'content', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none bg-gray-50 transition-all"
            placeholder={`Item ${index + 1}...`}
          />
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="mt-3 p-2 rounded-lg hover:bg-red-100 text-red-600 transition-all opacity-0 group-hover:opacity-100 touch-manipulation"
          title="Remove item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function KnowledgeBaseEditorPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<KnowledgeSlide[]>([]);
  const [expandedSlideId, setExpandedSlideId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  // Draft & version management
  const [hasDraft, setHasDraft] = useState(false);
  const [draftStatus, setDraftStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  async function fetchSlides() {
    try {
      const res = await fetch('/api/content-editor/knowledge-base');
      if (!res.ok) throw new Error('Failed to fetch slides');
      const data = await res.json();
      setSlides(data.slides || []);
      // Auto-expand first slide
      if (data.slides && data.slides.length > 0) {
        setExpandedSlideId(data.slides[0].id);
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
      const res = await fetch(`/api/drafts/knowledge_slide/${slideId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftData: {
            title: slide.title,
            subtitle: slide.subtitle,
            layout: slide.layout,
            image_path: slide.image_path,
            quote: slide.quote,
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
      const res = await fetch(`/api/versions/knowledge_slide/${slideId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          versionData: {
            title: slide.title,
            subtitle: slide.subtitle,
            layout: slide.layout,
            image_path: slide.image_path,
            quote: slide.quote,
            items: slide.items,
          },
          changeSummary: `Published changes to ${slide.title}`,
        }),
      });

      if (!res.ok) throw new Error('Failed to publish');

      // Also update the published content
      const updateRes = await fetch('/api/content-editor/knowledge-base', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideId: slide.id,
          data: {
            title: slide.title,
            subtitle: slide.subtitle,
            layout: slide.layout,
            image_path: slide.image_path,
            quote: slide.quote,
          },
          items: slide.items,
        }),
      });

      if (!updateRes.ok) throw new Error('Failed to update content');

      setHasDraft(false);
      showToast('Slide published successfully! ✨', 'success');
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
      const res = await fetch(`/api/versions/knowledge_slide/${expandedSlideId}?version=${versionNumber}`);
      if (!res.ok) throw new Error('Failed to fetch version');

      const data = await res.json();
      const versionData = data.version.version_data;

      // Restore to current editing state
      setSlides(prev => prev.map(slide =>
        slide.id === expandedSlideId
          ? {
              ...slide,
              title: versionData.title,
              subtitle: versionData.subtitle,
              layout: versionData.layout,
              image_path: versionData.image_path,
              quote: versionData.quote,
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

      const res = await fetch('/api/content-editor/knowledge-base', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideId: slide.id,
          data: {
            title: slide.title,
            subtitle: slide.subtitle,
            layout: slide.layout,
            image_path: slide.image_path,
            quote: slide.quote,
          },
          items: slide.items,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      setHasChanges(false);
      setLastSaved(new Date());
      setPreviewKey((prev) => prev + 1);
      showToast('Slide saved successfully', 'success');
      router.refresh();
    } catch (error) {
      console.error('Error saving slide:', error);
      showToast('Failed to save slide', 'error');
    } finally {
      setSaving(false);
    }
  }

  // Handle drag end for reordering content items
  function handleDragEnd(event: DragEndEvent, slideId: string) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSlides((prev) =>
        prev.map((slide) => {
          if (slide.id !== slideId) return slide;

          const oldIndex = slide.items.findIndex((item) => item.id === active.id);
          const newIndex = slide.items.findIndex((item) => item.id === over.id);

          const reorderedItems = arrayMove(slide.items, oldIndex, newIndex).map(
            (item, index) => ({
              ...item,
              display_order: index + 1,
            })
          );

          return { ...slide, items: reorderedItems };
        })
      );
      setHasChanges(true);
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
        slide.id === slideId
          ? { ...slide, image_path: data.url }
          : slide
      ));

      showToast('Image uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  }

  function updateSlideField(slideId: string, field: keyof KnowledgeSlide, value: any) {
    setSlides(prev => prev.map(slide =>
      slide.id === slideId ? { ...slide, [field]: value } : slide
    ));
    setHasChanges(true);
  }

  function updateSlideItem(slideId: string, itemId: string, field: keyof KnowledgeSlideItem, value: any) {
    setSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;
      return {
        ...slide,
        items: slide.items.map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      };
    }));
    setHasChanges(true);
  }

  function addSlideItem(slideId: string) {
    setSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;
      const maxOrder = Math.max(0, ...slide.items.map(i => i.display_order));
      return {
        ...slide,
        items: [
          ...slide.items,
          {
            id: `temp-${Date.now()}`,
            slide_id: slideId,
            content: '',
            display_order: maxOrder + 1,
          },
        ],
      };
    }));
    setHasChanges(true);
  }

  function removeSlideItem(slideId: string, itemId: string) {
    setSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;
      return {
        ...slide,
        items: slide.items.filter(item => item.id !== itemId),
      };
    }));
    setHasChanges(true);
  }

  function refreshPreview() {
    setPreviewKey((prev) => prev + 1);
  }

  if (loading) {
    return (
      <AdminFlowDeckPage
        title="Edit Knowledge Base"
        subtitle="Loading..."
        showHome={true}
        showBack={true}
        backTo="/admin/content-editor"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading slides...</p>
          </div>
        </div>
      </AdminFlowDeckPage>
    );
  }

  return (
    <AdminFlowDeckPage
      title="Edit Knowledge Base"
      subtitle="Edit carousel slides for the Knowledge Base section"
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
            onClick={refreshPreview}
            variant="ghost"
            size="md"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Preview
          </Button>
        </div>
      }
    >
      <div className="flex gap-6 h-[calc(100vh-12rem)]">
        {/* Left Panel - Editor */}
        <div className="w-1/2 overflow-y-auto">

        {/* Slides */}
        <div className="space-y-4 pr-2">
          {slides.map((slide) => {
            const isExpanded = expandedSlideId === slide.id;

            return (
              <div
                key={slide.id}
                className="rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-all"
              >
                {/* Slide Header */}
                <button
                  onClick={() => setExpandedSlideId(isExpanded ? null : slide.id)}
                  className="w-full p-5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-cyan-50 flex items-center justify-between transition-all touch-manipulation group"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-6 h-6 text-blue-600" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
                    )}
                    <Sparkles className="w-5 h-5 text-cyan-500" />
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {slide.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                      {slide.items.length} items
                    </span>
                  </div>
                </button>

                {/* Slide Content */}
                {isExpanded && (
                  <div className="p-6 space-y-6 bg-gradient-to-br from-white to-gray-50">
                    {/* Title */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <span>Title</span>
                        <span className="text-xs text-gray-400 font-normal">({slide.title.length} chars)</span>
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => updateSlideField(slide.id, 'title', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none text-lg font-semibold transition-all"
                        placeholder="Enter title..."
                      />
                    </div>

                    {/* Subtitle */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Subtitle <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={slide.subtitle || ''}
                        onChange={(e) =>
                          updateSlideField(slide.id, 'subtitle', e.target.value || null)
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                        placeholder="Enter subtitle..."
                      />
                    </div>

                    {/* Layout Toggle */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Layout</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => updateSlideField(slide.id, 'layout', 'content-left')}
                          className={`p-4 rounded-xl border-2 transition-all touch-manipulation ${
                            slide.layout === 'content-left'
                              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700 shadow-md scale-105'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="font-bold">📝 Content Left</div>
                          <div className="text-sm mt-1 opacity-75">Image on right</div>
                        </button>
                        <button
                          onClick={() => updateSlideField(slide.id, 'layout', 'content-right')}
                          className={`p-4 rounded-xl border-2 transition-all touch-manipulation ${
                            slide.layout === 'content-right'
                              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700 shadow-md scale-105'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="font-bold">📝 Content Right</div>
                          <div className="text-sm mt-1 opacity-75">Image on left</div>
                        </button>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Image</label>
                      {slide.image_path && (
                        <div className="relative mb-4 rounded-xl overflow-hidden group">
                          <Image
                            src={slide.image_path}
                            alt={slide.title}
                            width={400}
                            height={250}
                            className="w-full object-cover"
                          />
                          <label className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex items-center justify-center">
                            <div className="text-center text-white">
                              <Upload className="w-10 h-10 mx-auto mb-2" />
                              <span className="font-semibold">Change Image</span>
                            </div>
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
                      )}
                      {!slide.image_path && (
                        <label className="block w-full p-8 border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl cursor-pointer transition-all text-center bg-gray-50 hover:bg-blue-50 touch-manipulation">
                          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                          <span className="font-semibold text-blue-600">
                            {uploading ? 'Uploading...' : 'Upload Image'}
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
                      )}
                    </div>

                    {/* Quote Overlay */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Quote Overlay <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        value={slide.quote || ''}
                        onChange={(e) =>
                          updateSlideField(slide.id, 'quote', e.target.value || null)
                        }
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none resize-none transition-all"
                        placeholder={`Enter quote text to display over image (e.g., "There's always someone who will do it cheaper.")`}
                      />
                    </div>

                    {/* Content Items - Drag & Drop */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                        <span>Content Items</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Drag to reorder
                        </span>
                      </label>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(event) => handleDragEnd(event, slide.id)}
                      >
                        <SortableContext
                          items={slide.items.map((item) => item.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-3">
                            {slide.items.map((item, index) => (
                              <SortableContentItem
                                key={item.id}
                                item={item}
                                slideId={slide.id}
                                index={index}
                                onUpdate={updateSlideItem.bind(null, slide.id)}
                                onRemove={removeSlideItem.bind(null, slide.id)}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                      <button
                        onClick={() => addSlideItem(slide.id)}
                        className="mt-4 w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-blue-600 font-semibold flex items-center justify-center gap-2 transition-all touch-manipulation group"
                      >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Add Content Item
                      </button>
                    </div>

                    {/* Save Button */}
                    <div className="pt-6 border-t-2 border-gray-200">
                      <button
                        onClick={() => handleSave(slide.id)}
                        disabled={saving}
                        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 touch-manipulation"
                      >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="w-1/2 sticky top-0 h-full">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Live Preview</h2>
            </div>
            <button
              onClick={refreshPreview}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors touch-manipulation"
              title="Refresh preview"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow-inner overflow-hidden">
            <iframe
              key={previewKey}
              src="/knowledge-base"
              className="w-full h-full border-0"
              title="Knowledge Base Preview"
            />
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            💡 Save your changes to see them reflected in the preview
          </p>
        </div>
      </div>
      </div>

      {/* Version History Modal */}
      {showVersionHistory && expandedSlideId && (
        <VersionHistory
          contentType="knowledge_slide"
          contentId={expandedSlideId}
          onRestore={handleRestoreVersion}
          onClose={() => setShowVersionHistory(false)}
        />
      )}
    </AdminFlowDeckPage>
  );
}
