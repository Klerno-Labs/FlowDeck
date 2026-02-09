'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, ChevronRight, Plus, Trash2, Save, Upload, GripVertical, Eye, EyeOff, Sparkles, History, Send } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdminFlowDeckPage } from '@/components/layout/AdminFlowDeckPage';
import { Button } from '@/components/ui/Button';
import { TipTapEditor } from '@/components/content-editor/TipTapEditor';
import { DraftIndicator } from '@/components/content-editor/DraftIndicator';
import { VersionHistory } from '@/components/content-editor/VersionHistory';

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

        {/* Color Picker */}
        <div className="flex gap-1">
          {BULLET_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onUpdate(item.id, 'bullet_color', color.value)}
              className={`w-8 h-8 rounded-full ${color.bg} transition-all ${
                item.bullet_color === color.value
                  ? 'ring-2 ring-offset-2 ring-gray-800 scale-110'
                  : 'opacity-50 hover:opacity-100 hover:scale-105'
              }`}
              title={color.name}
            />
          ))}
        </div>

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchSlides();
  }, []);

  // Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (expandedSlideId && !saving && !autoSaving) {
        handleAutoSave(expandedSlideId);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [expandedSlideId, slides, saving, autoSaving]);

  async function fetchSlides() {
    try {
      const res = await fetch('/api/content-editor/intro');
      if (!res.ok) throw new Error('Failed to fetch slides');
      const data = await res.json();
      setSlides(data.slides || []);
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

      if (res.ok) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setAutoSaving(false);
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
        <Button
          onClick={() => setPreviewVisible(!previewVisible)}
          variant="ghost"
          size="md"
        >
          {previewVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          {previewVisible ? 'Hide' : 'Show'} Preview
        </Button>
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

      {/* Content */}
      <div className={`grid ${previewVisible ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {/* Editor */}
        <div className="space-y-4">
          {slides.map(slide => {
            const isExpanded = expandedSlideId === slide.id;

            return (
              <div
                key={slide.id}
                className="rounded-2xl border-2 border-gray-200 overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all"
              >
                {/* Slide Header */}
                <button
                  onClick={() => setExpandedSlideId(isExpanded ? null : slide.id)}
                  className="w-full p-6 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      {isExpanded ? (
                        <ChevronDown className="w-6 h-6 text-white" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold text-gray-800">{slide.title}</h3>
                      <p className="text-sm text-gray-600">{slide.items.length} bullet points</p>
                    </div>
                  </div>
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </button>

                {/* Slide Content */}
                {isExpanded && (
                  <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white">
                    {/* Heading */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Heading <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={slide.heading}
                        onChange={(e) => updateSlideField(slide.id, 'heading', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg font-semibold"
                        placeholder="Enter heading..."
                      />
                    </div>

                    {/* Paragraph */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Paragraph <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={slide.paragraph}
                        onChange={(e) => updateSlideField(slide.id, 'paragraph', e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
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

                    {/* Save Button */}
                    <div className="pt-6 border-t-2 border-gray-200">
                      <button
                        onClick={() => handleSave(slide.id)}
                        disabled={saving || autoSaving}
                        className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                      >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save & Publish'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Preview */}
        {previewVisible && (
          <div className="sticky top-6">
            <div className="rounded-2xl border-4 border-gray-300 overflow-hidden shadow-2xl bg-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-white text-sm font-semibold">Live Preview</span>
                <Eye className="w-5 h-5 text-white" />
              </div>
              <iframe
                src="/intro-presentation"
                className="w-full h-[600px] bg-white"
                title="Live Preview"
              />
            </div>
          </div>
        )}
      </div>
      </div>
    </AdminFlowDeckPage>
  );
}
