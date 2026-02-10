'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  BookOpen,
  Package,
  Sparkles,
  Save,
  Command as CommandIcon,
  Loader2,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import { AdminFlowDeckPage } from '@/components/layout/AdminFlowDeckPage';
import { Button } from '@/components/ui/Button';
import { celebratePublish } from '@/lib/utils/confetti';

interface Slide {
  id: string;
  section: 'intro' | 'knowledge-base' | 'products';
  title: string;
  subtitle?: string;
  type: string;
  editUrl: string;
  previewUrl: string;
  lastUpdated: string;
}

const ALL_SLIDES: Slide[] = [
  // Intro Section
  {
    id: 'company-overview',
    section: 'intro',
    title: 'Company Overview',
    subtitle: 'Founded by John Paraskeva in 1987',
    type: 'Intro Slide',
    editUrl: '/admin/content-editor/intro',
    previewUrl: '/intro-presentation',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'what-we-guarantee',
    section: 'intro',
    title: 'What We Guarantee',
    subtitle: 'SQF Version 9 - HACCP Standards',
    type: 'Intro Slide',
    editUrl: '/admin/content-editor/intro',
    previewUrl: '/intro-presentation/what-we-guarantee',
    lastUpdated: '1 day ago',
  },

  // Knowledge Base Section
  {
    id: 'total-cost-filtration',
    section: 'knowledge-base',
    title: 'Total Cost of Filtration',
    subtitle: 'What does it mean?',
    type: 'Knowledge Base',
    editUrl: '/admin/content-editor/knowledge-base',
    previewUrl: '/knowledge-base/total-cost-of-filtration',
    lastUpdated: '3 days ago',
  },
  {
    id: 'why-filter',
    section: 'knowledge-base',
    title: 'Why Do We Filter?',
    subtitle: '7 key reasons for filtration',
    type: 'Knowledge Base',
    editUrl: '/admin/content-editor/knowledge-base',
    previewUrl: '/knowledge-base/why-do-we-filter',
    lastUpdated: '3 days ago',
  },

  // Product Categories
  {
    id: 'gas-liquid',
    section: 'products',
    title: 'Gas Liquid Category',
    subtitle: 'Gas-liquid separation products',
    type: 'Product Category',
    editUrl: '/admin/categories?category=gas-liquid',
    previewUrl: '/products/gas-liquid',
    lastUpdated: '5 days ago',
  },
  {
    id: 'gas-solid',
    section: 'products',
    title: 'Gas Solid Category',
    subtitle: 'Gas-solid filtration products',
    type: 'Product Category',
    editUrl: '/admin/categories?category=gas-solid',
    previewUrl: '/products/gas-solid',
    lastUpdated: '5 days ago',
  },
  {
    id: 'liquid-liquid',
    section: 'products',
    title: 'Liquid Liquid Category',
    subtitle: 'Liquid-liquid separation products',
    type: 'Product Category',
    editUrl: '/admin/categories?category=liquid-liquid',
    previewUrl: '/products/liquid-liquid',
    lastUpdated: '5 days ago',
  },
  {
    id: 'liquid-solid',
    section: 'products',
    title: 'Liquid Solid Category',
    subtitle: 'Liquid-solid filtration products',
    type: 'Product Category',
    editUrl: '/admin/categories?category=liquid-solid',
    previewUrl: '/products/liquid-solid',
    lastUpdated: '5 days ago',
  },
];

/**
 * All Slides Content Editor
 * Unified view of all editable slides across the entire FlowDeck
 */
export default function AllSlidesEditor() {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<string[]>(['intro', 'knowledge-base', 'products']);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const slidesBySection = {
    intro: ALL_SLIDES.filter(s => s.section === 'intro'),
    'knowledge-base': ALL_SLIDES.filter(s => s.section === 'knowledge-base'),
    products: ALL_SLIDES.filter(s => s.section === 'products'),
  };

  const sectionConfig = {
    intro: {
      title: 'Intro Presentation',
      icon: <FileText className="w-6 h-6" />,
      color: 'from-cyan-600 to-blue-600',
      bg: 'from-cyan-50 to-blue-50',
      count: slidesBySection.intro.length,
    },
    'knowledge-base': {
      title: 'Knowledge Base',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-green-600 to-teal-600',
      bg: 'from-green-50 to-teal-50',
      count: slidesBySection['knowledge-base'].length,
    },
    products: {
      title: 'Product Categories',
      icon: <Package className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-600',
      bg: 'from-purple-50 to-pink-50',
      count: slidesBySection.products.length,
    },
  };

  return (
    <AdminFlowDeckPage
      title="All Slides Editor"
      subtitle="Manage all presentation slides in one place"
      showHome={true}
      showBack={true}
      backTo="/admin"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Stats */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border-2 border-cyan-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {slidesBySection.intro.length}
                  </div>
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
                  <div className="text-3xl font-bold text-gray-900">
                    {slidesBySection['knowledge-base'].length}
                  </div>
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
                  <div className="text-3xl font-bold text-gray-900">
                    {slidesBySection.products.length}
                  </div>
                  <div className="text-sm text-gray-600">Product Categories</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* All Sections */}
        <div className="space-y-6">
          {Object.entries(sectionConfig).map(([sectionKey, config], sectionIndex) => {
            const section = sectionKey as 'intro' | 'knowledge-base' | 'products';
            const isExpanded = expandedSections.includes(section);
            const slides = slidesBySection[section];

            return (
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-xl"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section)}
                  className={`w-full p-6 bg-gradient-to-r ${config.color} flex items-center justify-between transition-all hover:opacity-90`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                      {config.icon}
                    </div>
                    <div className="text-left">
                      <h2 className="text-2xl font-bold text-white">
                        {config.title}
                      </h2>
                      <p className="text-sm text-white/80">
                        {config.count} slides
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6 text-white" />
                  </motion.div>
                </button>

                {/* Slides List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 space-y-4">
                        {slides.map((slide, slideIndex) => (
                          <motion.div
                            key={slide.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: slideIndex * 0.05 }}
                            className={`group relative rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                              selectedSlide?.id === slide.id
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                            }`}
                          >
                            <div className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {slide.title}
                                  </h3>
                                  {slide.subtitle && (
                                    <p className="text-sm text-gray-600">
                                      {slide.subtitle}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 mt-3">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                      {slide.type}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Updated {slide.lastUpdated}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-3">
                                <Button
                                  onClick={() => router.push(slide.editUrl)}
                                  variant="primary"
                                  size="md"
                                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                  <FileText className="w-4 h-4" />
                                  Edit Slide
                                </Button>
                                <Button
                                  onClick={() => window.open(slide.previewUrl, '_blank')}
                                  variant="secondary"
                                  size="md"
                                  className="flex-1"
                                >
                                  <Eye className="w-4 h-4" />
                                  Preview
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-xl font-bold text-white">
                  Quick Tip
                </h3>
                <p className="text-white/80 text-sm">
                  Click on any slide to edit its content. Changes are auto-saved every 3 seconds.
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/admin/page-builder')}
              variant="secondary"
              size="md"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Open Page Builder
            </Button>
          </div>
        </motion.div>
      </div>
    </AdminFlowDeckPage>
  );
}
