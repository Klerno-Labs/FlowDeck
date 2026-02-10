'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Save,
  Upload,
  GripVertical,
  Eye,
  EyeOff,
  Sparkles,
  History,
  Send,
  FileText,
  BookOpen,
  Package,
  Loader2,
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdminFlowDeckPage } from '@/components/layout/AdminFlowDeckPage';
import { Button } from '@/components/ui/Button';
import { TipTapEditor } from '@/components/content-editor/TipTapEditor';
import { DraftIndicator } from '@/components/content-editor/DraftIndicator';
import { VersionHistory } from '@/components/content-editor/VersionHistory';
import { ColorPickerPopover } from '@/components/content-editor/ColorPickerPopover';
import { celebratePublish } from '@/lib/utils/confetti';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

interface CategoryData {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

const BULLET_COLORS = [
  { value: '#00B4D8', name: 'Cyan', bg: 'bg-cyan-400' },
  { value: '#1E5AA8', name: 'Blue', bg: 'bg-blue-600' },
  { value: '#8DC63F', name: 'Green', bg: 'bg-green-500' },
  { value: '#F17A2C', name: 'Orange', bg: 'bg-orange-500' },
  { value: '#4169E1', name: 'Royal Blue', bg: 'bg-blue-500' },
];

const INITIAL_CATEGORIES: CategoryData[] = [
  {
    id: 'gas-liquid',
    name: 'Gas Liquid',
    description: 'Gas-liquid separation products',
    color: '#4169E1',
    icon: '💨💧',
  },
  {
    id: 'gas-solid',
    name: 'Gas Solid',
    description: 'Gas-solid filtration products',
    color: '#7AC142',
    icon: '💨🔧',
  },
  {
    id: 'liquid-liquid',
    name: 'Liquid Liquid',
    description: 'Liquid-liquid separation products',
    color: '#00B4D8',
    icon: '💧💧',
  },
  {
    id: 'liquid-solid',
    name: 'Liquid Solid',
    description: 'Liquid-solid filtration products',
    color: '#F17A2C',
    icon: '💧🔧',
  },
];

// ============================================================================
// SORTABLE COMPONENTS
// ============================================================================

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
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-manipulation"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={item.content}
          onChange={(e) => onUpdate(item.id, 'content', e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-50 rounded-lg border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Enter bullet point..."
        />

        {item.bullet_color !== undefined && (
          <ColorPickerPopover
            color={item.bullet_color || '#00B4D8'}
            onChange={(color) => onUpdate(item.id, 'bullet_color', color)}
            presetColors={BULLET_COLORS.map(c => c.value)}
          />
        )}

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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AllSlidesUnifiedEditor() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [draftStatus, setDraftStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Section expansion
  const [expandedSections, setExpandedSections] = useState<string[]>(['intro', 'knowledge-base', 'categories']);
  const [expandedSlideId, setExpandedSlideId] = useState<string | null>(null);

  // Data
  const [introSlides, setIntroSlides] = useState<PresentationSlide[]>([]);
  const [knowledgeSlides, setKnowledgeSlides] = useState<KnowledgeSlide[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>(INITIAL_CATEGORIES);

  // Version history
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionContentType, setVersionContentType] = useState<'intro_slide' | 'knowledge_slide'>('intro_slide');
  const [versionContentId, setVersionContentId] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchAllContent();
  }, []);

  // Auto-save every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (expandedSlideId && !saving && !autoSaving) {
        handleAutoSave();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [expandedSlideId, introSlides, knowledgeSlides, saving, autoSaving]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      meta: true,
      ctrl: true,
      callback: () => {
        if (expandedSlideId && !saving) {
          handleSave();
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
        if (expandedSlideId) {
          handlePublish();
        }
      },
      description: 'Publish slide',
    },
  ]);

  async function fetchAllContent() {
    try {
      // Fetch intro slides
      const introRes = await fetch('/api/content-editor/intro');
      if (introRes.ok) {
        const introData = await introRes.json();
        setIntroSlides(introData.slides || []);
      }

      // Fetch knowledge base slides
      const kbRes = await fetch('/api/content-editor/knowledge-base');
      if (kbRes.ok) {
        const kbData = await kbRes.json();
        setKnowledgeSlides(kbData.slides || []);
      }

      // Set first slide as expanded
      const firstIntroSlide = introSlides[0] || knowledgeSlides[0];
      if (firstIntroSlide) {
        setExpandedSlideId(firstIntroSlide.id);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      showToast('Failed to load content', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleAutoSave() {
    setAutoSaving(true);
    setDraftStatus('saving');
    try {
      // Determine slide type and save
      const introSlide = introSlides.find(s => s.id === expandedSlideId);
      const knowledgeSlide = knowledgeSlides.find(s => s.id === expandedSlideId);

      if (introSlide) {
        await fetch(`/api/drafts/intro_slide/${introSlide.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            draftData: {
              heading: introSlide.heading,
              paragraph: introSlide.paragraph,
              image_path: introSlide.image_path,
              items: introSlide.items,
            },
          }),
        });
      } else if (knowledgeSlide) {
        await fetch(`/api/drafts/knowledge_slide/${knowledgeSlide.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            draftData: {
              title: knowledgeSlide.title,
              subtitle: knowledgeSlide.subtitle,
              layout: knowledgeSlide.layout,
              image_path: knowledgeSlide.image_path,
              quote: knowledgeSlide.quote,
              items: knowledgeSlide.items,
            },
          }),
        });
      }

      setLastSaved(new Date());
      setDraftStatus('saved');
    } catch (error) {
      console.error('Auto-save error:', error);
      setDraftStatus('error');
    } finally {
      setAutoSaving(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const introSlide = introSlides.find(s => s.id === expandedSlideId);
      const knowledgeSlide = knowledgeSlides.find(s => s.id === expandedSlideId);

      if (introSlide) {
        const res = await fetch('/api/content-editor/intro', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slideId: introSlide.id,
            data: {
              heading: introSlide.heading,
              paragraph: introSlide.paragraph,
              image_path: introSlide.image_path,
            },
            items: introSlide.items,
          }),
        });

        if (!res.ok) throw new Error('Failed to save');
      } else if (knowledgeSlide) {
        const res = await fetch('/api/content-editor/knowledge-base', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slideId: knowledgeSlide.id,
            data: {
              title: knowledgeSlide.title,
              subtitle: knowledgeSlide.subtitle,
              layout: knowledgeSlide.layout,
              image_path: knowledgeSlide.image_path,
              quote: knowledgeSlide.quote,
            },
            items: knowledgeSlide.items,
          }),
        });

        if (!res.ok) throw new Error('Failed to save');
      }

      setLastSaved(new Date());
      showToast('Saved successfully! ✨', 'success');
      router.refresh();
    } catch (error) {
      console.error('Error saving:', error);
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!confirm('Publish this slide? This will create a new version and update the live content.')) {
      return;
    }

    try {
      const introSlide = introSlides.find(s => s.id === expandedSlideId);
      const knowledgeSlide = knowledgeSlides.find(s => s.id === expandedSlideId);

      if (introSlide) {
        await fetch(`/api/versions/intro_slide/${introSlide.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'publish',
            versionData: {
              heading: introSlide.heading,
              paragraph: introSlide.paragraph,
              image_path: introSlide.image_path,
              items: introSlide.items,
            },
            changeSummary: `Published changes to ${introSlide.title}`,
          }),
        });

        await fetch('/api/content-editor/intro', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slideId: introSlide.id,
            data: {
              heading: introSlide.heading,
              paragraph: introSlide.paragraph,
              image_path: introSlide.image_path,
            },
            items: introSlide.items,
          }),
        });
      } else if (knowledgeSlide) {
        await fetch(`/api/versions/knowledge_slide/${knowledgeSlide.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'publish',
            versionData: {
              title: knowledgeSlide.title,
              subtitle: knowledgeSlide.subtitle,
              layout: knowledgeSlide.layout,
              image_path: knowledgeSlide.image_path,
              quote: knowledgeSlide.quote,
              items: knowledgeSlide.items,
            },
            changeSummary: `Published changes to ${knowledgeSlide.title}`,
          }),
        });

        await fetch('/api/content-editor/knowledge-base', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slideId: knowledgeSlide.id,
            data: {
              title: knowledgeSlide.title,
              subtitle: knowledgeSlide.subtitle,
              layout: knowledgeSlide.layout,
              image_path: knowledgeSlide.image_path,
              quote: knowledgeSlide.quote,
            },
            items: knowledgeSlide.items,
          }),
        });
      }

      showToast('Published successfully! ✨', 'success');
      celebratePublish();
      router.refresh();
    } catch (error) {
      console.error('Error publishing:', error);
      showToast('Failed to publish', 'error');
    }
  }

  function toggleSection(section: string) {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  }

  function updateIntroSlideField(slideId: string, field: keyof PresentationSlide, value: any) {
    setIntroSlides(prev => prev.map(slide =>
      slide.id === slideId ? { ...slide, [field]: value } : slide
    ));
  }

  function updateKnowledgeSlideField(slideId: string, field: keyof KnowledgeSlide, value: any) {
    setKnowledgeSlides(prev => prev.map(slide =>
      slide.id === slideId ? { ...slide, [field]: value } : slide
    ));
  }

  function updateIntroItem(slideId: string, itemId: string, field: keyof SlideItem, value: any) {
    setIntroSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;
      return {
        ...slide,
        items: slide.items.map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      };
    }));
  }

  function updateKnowledgeItem(slideId: string, itemId: string, field: keyof KnowledgeSlideItem, value: any) {
    setKnowledgeSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;
      return {
        ...slide,
        items: slide.items.map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      };
    }));
  }

  function addIntroItem(slideId: string) {
    setIntroSlides(prev => prev.map(slide => {
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

  function addKnowledgeItem(slideId: string) {
    setKnowledgeSlides(prev => prev.map(slide => {
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
  }

  function removeIntroItem(slideId: string, itemId: string) {
    setIntroSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;
      return {
        ...slide,
        items: slide.items.filter(item => item.id !== itemId),
      };
    }));
  }

  function removeKnowledgeItem(slideId: string, itemId: string) {
    setKnowledgeSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;
      return {
        ...slide,
        items: slide.items.filter(item => item.id !== itemId),
      };
    }));
  }

  function handleDragEnd(event: any, slideId: string, contentType: 'intro' | 'knowledge') {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    if (contentType === 'intro') {
      setIntroSlides(prev => prev.map(slide => {
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
    } else {
      setKnowledgeSlides(prev => prev.map(slide => {
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
  }

  if (loading) {
    return (
      <AdminFlowDeckPage
        title="Content Editor"
        subtitle="Loading..."
        showHome={true}
        showBack={true}
        backTo="/admin"
      >
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-spin" />
            <p className="text-gray-600 font-medium">Loading all slides...</p>
          </div>
        </div>
      </AdminFlowDeckPage>
    );
  }

  const sectionConfig = {
    intro: {
      title: 'Intro Presentation',
      icon: <FileText className="w-6 h-6" />,
      color: 'from-cyan-600 to-blue-600',
      bg: 'from-cyan-50 to-blue-50',
      count: introSlides.length,
    },
    'knowledge-base': {
      title: 'Knowledge Base',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-green-600 to-teal-600',
      bg: 'from-green-50 to-teal-50',
      count: knowledgeSlides.length,
    },
    categories: {
      title: 'Product Categories',
      icon: <Package className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-600',
      bg: 'from-purple-50 to-pink-50',
      count: categories.length,
    },
  };

  return (
    <AdminFlowDeckPage
      title="Content Editor"
      subtitle="Edit all presentation slides in one unified interface"
      showHome={true}
      showBack={true}
      backTo="/admin"
      rightActions={
        <div className="flex items-center gap-3">
          <DraftIndicator status={draftStatus} lastSaved={lastSaved} />

          {expandedSlideId && (
            <>
              <Button
                onClick={handlePublish}
                disabled={saving || autoSaving}
                variant="primary"
                size="md"
              >
                <Send className="w-4 h-4" />
                Publish
              </Button>

              <Button
                onClick={() => {
                  const introSlide = introSlides.find(s => s.id === expandedSlideId);
                  if (introSlide) {
                    setVersionContentType('intro_slide');
                    setVersionContentId(introSlide.id);
                  } else {
                    setVersionContentType('knowledge_slide');
                    setVersionContentId(expandedSlideId);
                  }
                  setShowVersionHistory(true);
                }}
                variant="secondary"
                size="md"
              >
                <History className="w-4 h-4" />
                History
              </Button>
            </>
          )}
        </div>
      }
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Stats */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border-2 border-cyan-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{introSlides.length}</div>
                <div className="text-sm text-gray-600">Intro Slides</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{knowledgeSlides.length}</div>
                <div className="text-sm text-gray-600">Knowledge Base</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{categories.length}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* INTRO SLIDES SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-xl"
        >
          <button
            onClick={() => toggleSection('intro')}
            className="w-full p-6 bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-between transition-all hover:opacity-90"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white">Intro Presentation</h2>
                <p className="text-sm text-white/80">{introSlides.length} slides</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.includes('intro') ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedSections.includes('intro') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {introSlides.map((slide, slideIndex) => {
                    const isExpanded = expandedSlideId === slide.id;

                    return (
                      <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: slideIndex * 0.05 }}
                        className="group relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500" />
                        <div className="relative rounded-3xl border-2 border-gray-200 overflow-hidden bg-white shadow-xl hover:shadow-2xl hover:border-cyan-300 transition-all duration-300">
                          <button
                            onClick={() => setExpandedSlideId(isExpanded ? null : slide.id)}
                            className="w-full p-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 flex items-center justify-between transition-all duration-300"
                          >
                            <div className="flex items-center gap-4">
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                              >
                                {isExpanded ? <ChevronDown className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
                              </motion.div>
                              <div className="text-left">
                                <h3 className="text-xl font-bold text-white">{slide.title}</h3>
                                <p className="text-sm text-white/80">{slide.items.length} bullet points</p>
                              </div>
                            </div>
                            <Sparkles className="w-6 h-6 text-white/90" />
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="p-8 space-y-6 bg-gradient-to-br from-cyan-50/50 via-blue-50/30 to-white">
                                  {/* Heading */}
                                  <div>
                                    <label className="block text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3">
                                      Heading <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={slide.heading}
                                      onChange={(e) => updateIntroSlideField(slide.id, 'heading', e.target.value)}
                                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all text-lg font-semibold shadow-sm"
                                      placeholder="Enter heading..."
                                    />
                                  </div>

                                  {/* Paragraph - TipTap */}
                                  <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                      Paragraph <span className="text-red-500">*</span>
                                    </label>
                                    <TipTapEditor
                                      content={slide.paragraph}
                                      onChange={(content) => updateIntroSlideField(slide.id, 'paragraph', content)}
                                      placeholder="Enter paragraph text..."
                                    />
                                    <p className="mt-2 text-sm text-gray-500">{slide.paragraph.length} characters</p>
                                  </div>

                                  {/* Image */}
                                  {slide.image_path && (
                                    <div className="mb-4">
                                      <Image
                                        src={slide.image_path}
                                        alt={slide.title}
                                        width={400}
                                        height={300}
                                        className="rounded-xl object-cover shadow-lg"
                                      />
                                    </div>
                                  )}

                                  {/* Bullet Points */}
                                  <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">
                                      Bullet Points <span className="text-gray-500 font-normal">(drag to reorder)</span>
                                    </label>
                                    <DndContext
                                      sensors={sensors}
                                      collisionDetection={closestCenter}
                                      onDragEnd={(event) => handleDragEnd(event, slide.id, 'intro')}
                                    >
                                      <SortableContext items={slide.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                                        <div className="space-y-3">
                                          {slide.items.map((item) => (
                                            <SortableItem
                                              key={item.id}
                                              item={item}
                                              slideId={slide.id}
                                              onUpdate={updateIntroItem.bind(null, slide.id)}
                                              onRemove={removeIntroItem.bind(null, slide.id)}
                                            />
                                          ))}
                                        </div>
                                      </SortableContext>
                                    </DndContext>

                                    <button
                                      onClick={() => addIntroItem(slide.id)}
                                      className="mt-4 w-full px-4 py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-cyan-500 hover:bg-cyan-50 text-cyan-600 font-bold flex items-center justify-center gap-2 transition-all"
                                    >
                                      <Plus className="w-5 h-5" />
                                      Add Bullet Point
                                    </button>
                                  </div>

                                  {/* Save Button */}
                                  <div className="pt-6 border-t-2 border-gray-200/50">
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleSave()}
                                      disabled={saving || autoSaving}
                                      className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
                                    >
                                      <Save className="w-5 h-5" />
                                      {saving ? 'Saving...' : 'Save Changes'}
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* KNOWLEDGE BASE SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-xl"
        >
          <button
            onClick={() => toggleSection('knowledge-base')}
            className="w-full p-6 bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-between transition-all hover:opacity-90"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
                <p className="text-sm text-white/80">{knowledgeSlides.length} slides</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.includes('knowledge-base') ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedSections.includes('knowledge-base') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {knowledgeSlides.map((slide, slideIndex) => {
                    const isExpanded = expandedSlideId === slide.id;

                    return (
                      <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: slideIndex * 0.05 }}
                        className="group relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500" />
                        <div className="relative rounded-3xl border-2 border-gray-200 overflow-hidden bg-white shadow-xl hover:shadow-2xl hover:border-green-300 transition-all duration-300">
                          <button
                            onClick={() => setExpandedSlideId(isExpanded ? null : slide.id)}
                            className="w-full p-6 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 flex items-center justify-between transition-all duration-300"
                          >
                            <div className="flex items-center gap-4">
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                              >
                                {isExpanded ? <ChevronDown className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
                              </motion.div>
                              <div className="text-left">
                                <h3 className="text-xl font-bold text-white">{slide.title}</h3>
                                <p className="text-sm text-white/80">{slide.items.length} content items</p>
                              </div>
                            </div>
                            <Sparkles className="w-6 h-6 text-white/90" />
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="p-8 space-y-6 bg-gradient-to-br from-green-50/50 via-teal-50/30 to-white">
                                  {/* Title */}
                                  <div>
                                    <label className="block text-sm font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
                                      Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={slide.title}
                                      onChange={(e) => updateKnowledgeSlideField(slide.id, 'title', e.target.value)}
                                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-lg font-semibold shadow-sm"
                                      placeholder="Enter title..."
                                    />
                                  </div>

                                  {/* Subtitle */}
                                  <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Subtitle</label>
                                    <input
                                      type="text"
                                      value={slide.subtitle || ''}
                                      onChange={(e) => updateKnowledgeSlideField(slide.id, 'subtitle', e.target.value)}
                                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all shadow-sm"
                                      placeholder="Enter subtitle..."
                                    />
                                  </div>

                                  {/* Layout */}
                                  <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Layout</label>
                                    <select
                                      value={slide.layout}
                                      onChange={(e) => updateKnowledgeSlideField(slide.id, 'layout', e.target.value)}
                                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all shadow-sm"
                                    >
                                      <option value="content-left">Content Left, Image Right</option>
                                      <option value="content-right">Content Right, Image Left</option>
                                    </select>
                                  </div>

                                  {/* Quote */}
                                  {slide.quote && (
                                    <div>
                                      <label className="block text-sm font-bold text-gray-700 mb-3">Quote Overlay</label>
                                      <input
                                        type="text"
                                        value={slide.quote || ''}
                                        onChange={(e) => updateKnowledgeSlideField(slide.id, 'quote', e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all shadow-sm italic"
                                        placeholder="Enter quote..."
                                      />
                                    </div>
                                  )}

                                  {/* Image */}
                                  {slide.image_path && (
                                    <div className="mb-4">
                                      <Image
                                        src={slide.image_path}
                                        alt={slide.title}
                                        width={400}
                                        height={300}
                                        className="rounded-xl object-cover shadow-lg"
                                      />
                                    </div>
                                  )}

                                  {/* Content Items */}
                                  <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">
                                      Content Items <span className="text-gray-500 font-normal">(drag to reorder)</span>
                                    </label>
                                    <DndContext
                                      sensors={sensors}
                                      collisionDetection={closestCenter}
                                      onDragEnd={(event) => handleDragEnd(event, slide.id, 'knowledge')}
                                    >
                                      <SortableContext items={slide.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                                        <div className="space-y-3">
                                          {slide.items.map((item) => (
                                            <SortableItem
                                              key={item.id}
                                              item={item}
                                              slideId={slide.id}
                                              onUpdate={updateKnowledgeItem.bind(null, slide.id)}
                                              onRemove={removeKnowledgeItem.bind(null, slide.id)}
                                            />
                                          ))}
                                        </div>
                                      </SortableContext>
                                    </DndContext>

                                    <button
                                      onClick={() => addKnowledgeItem(slide.id)}
                                      className="mt-4 w-full px-4 py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 text-green-600 font-bold flex items-center justify-center gap-2 transition-all"
                                    >
                                      <Plus className="w-5 h-5" />
                                      Add Content Item
                                    </button>
                                  </div>

                                  {/* Save Button */}
                                  <div className="pt-6 border-t-2 border-gray-200/50">
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleSave()}
                                      disabled={saving || autoSaving}
                                      className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
                                    >
                                      <Save className="w-5 h-5" />
                                      {saving ? 'Saving...' : 'Save Changes'}
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* PRODUCT CATEGORIES SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-xl"
        >
          <button
            onClick={() => toggleSection('categories')}
            className="w-full p-6 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-between transition-all hover:opacity-90"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <Package className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white">Product Categories</h2>
                <p className="text-sm text-white/80">{categories.length} categories</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.includes('categories') ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedSections.includes('categories') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((category, index) => (
                      <motion.a
                        key={category.id}
                        href={`/admin/categories?category=${category.id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all group cursor-pointer"
                        style={{ borderLeftColor: category.color, borderLeftWidth: '6px' }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="text-4xl">{category.icon}</div>
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <div className="mt-4 text-sm text-purple-600 font-semibold group-hover:text-purple-700">
                          Edit category →
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Version History Modal */}
      {showVersionHistory && (
        <VersionHistory
          contentType={versionContentType}
          contentId={versionContentId}
          onRestore={() => {}}
          onClose={() => setShowVersionHistory(false)}
        />
      )}
    </AdminFlowDeckPage>
  );
}
