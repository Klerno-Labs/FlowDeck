'use client';

import { PageConfig } from '@/types/page-builder';
import { X, Check } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  config: PageConfig;
}

const templates: Template[] = [
  {
    id: 'hero-section',
    name: 'Hero Section',
    description: 'Large heading with button',
    preview: '🎯',
    config: {
      elements: [
        {
          id: 'hero-heading',
          type: 'heading',
          content: 'Welcome to FlowDeck',
          position: { x: 100, y: 100, width: 600, height: 80 },
          styles: {
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#1F2937',
            textAlign: 'center',
          },
          visible: true,
        },
        {
          id: 'hero-text',
          type: 'text',
          content: 'Create amazing presentations with our powerful tools',
          position: { x: 100, y: 200, width: 600, height: 60 },
          styles: {
            fontSize: '20px',
            color: '#6B7280',
            textAlign: 'center',
          },
          visible: true,
        },
        {
          id: 'hero-button',
          type: 'button',
          content: 'Get Started',
          position: { x: 300, y: 300, width: 200, height: 60 },
          styles: {
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: 'semibold',
            borderRadius: '12px',
          },
          visible: true,
        },
      ],
      styles: {
        backgroundColor: '#F9FAFB',
      },
    },
  },
  {
    id: 'feature-grid',
    name: 'Feature Grid',
    description: '3-column feature layout',
    preview: '📊',
    config: {
      elements: [
        {
          id: 'feature-1',
          type: 'container',
          content: null,
          position: { x: 50, y: 50, width: 200, height: 250 },
          styles: {
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            padding: '24px',
          },
          visible: true,
        },
        {
          id: 'feature-2',
          type: 'container',
          content: null,
          position: { x: 280, y: 50, width: 200, height: 250 },
          styles: {
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            padding: '24px',
          },
          visible: true,
        },
        {
          id: 'feature-3',
          type: 'container',
          content: null,
          position: { x: 510, y: 50, width: 200, height: 250 },
          styles: {
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            padding: '24px',
          },
          visible: true,
        },
      ],
      styles: {
        backgroundColor: '#F3F4F6',
      },
    },
  },
  {
    id: 'cta-banner',
    name: 'CTA Banner',
    description: 'Call-to-action with gradient',
    preview: '🎨',
    config: {
      elements: [
        {
          id: 'cta-heading',
          type: 'heading',
          content: 'Ready to Get Started?',
          position: { x: 150, y: 150, width: 500, height: 60 },
          styles: {
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center',
          },
          visible: true,
        },
        {
          id: 'cta-button',
          type: 'button',
          content: 'Start Free Trial',
          position: { x: 300, y: 250, width: 200, height: 60 },
          styles: {
            backgroundColor: '#FFFFFF',
            color: '#3B82F6',
            fontSize: '18px',
            fontWeight: 'semibold',
            borderRadius: '30px',
          },
          visible: true,
        },
      ],
      styles: {
        backgroundColor: '#3B82F6',
      },
    },
  },
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    description: 'Image with description',
    preview: '🖼️',
    config: {
      elements: [
        {
          id: 'product-image',
          type: 'image',
          content: '/placeholder.png',
          position: { x: 50, y: 50, width: 350, height: 350 },
          styles: {
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          },
          visible: true,
        },
        {
          id: 'product-title',
          type: 'heading',
          content: 'Our Product',
          position: { x: 450, y: 100, width: 300, height: 60 },
          styles: {
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
          },
          visible: true,
        },
        {
          id: 'product-description',
          type: 'text',
          content: 'Discover the amazing features that make our product stand out from the competition.',
          position: { x: 450, y: 180, width: 300, height: 100 },
          styles: {
            fontSize: '16px',
            color: '#4B5563',
          },
          visible: true,
        },
      ],
      styles: {
        backgroundColor: '#FFFFFF',
      },
    },
  },
];

interface TemplateLibraryProps {
  onSelectTemplate: (config: PageConfig) => void;
  onClose: () => void;
}

export function TemplateLibrary({ onSelectTemplate, onClose }: TemplateLibraryProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">Template Library</h2>
              <p className="text-blue-100 mt-1">Start with a pre-made design</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/20 transition-all active:scale-95"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-2 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template.config)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-gray-100 hover:border-blue-500 overflow-hidden active:scale-95"
              >
                <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-8xl">
                  {template.preview}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Use Template</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
            >
              Start from Scratch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
