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
  {
    id: 'pricing-table',
    name: 'Pricing Table',
    description: '3-tier pricing layout',
    preview: '💰',
    config: {
      elements: [
        {
          id: 'price-card-1',
          type: 'container',
          content: null,
          position: { x: 50, y: 50, width: 220, height: 400 },
          styles: {
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            padding: '24px',
          },
          visible: true,
        },
        {
          id: 'price-heading-1',
          type: 'heading',
          content: 'Basic',
          position: { x: 100, y: 80, width: 120, height: 40 },
          styles: { fontSize: '24px', fontWeight: 'bold', color: '#111827', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'price-amount-1',
          type: 'heading',
          content: '$9/mo',
          position: { x: 90, y: 130, width: 140, height: 50 },
          styles: { fontSize: '32px', fontWeight: 'bold', color: '#3B82F6', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'price-card-2',
          type: 'container',
          content: null,
          position: { x: 300, y: 50, width: 220, height: 400 },
          styles: {
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            padding: '24px',
          },
          visible: true,
        },
        {
          id: 'price-heading-2',
          type: 'heading',
          content: 'Pro',
          position: { x: 350, y: 80, width: 120, height: 40 },
          styles: { fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'price-amount-2',
          type: 'heading',
          content: '$29/mo',
          position: { x: 340, y: 130, width: 140, height: 50 },
          styles: { fontSize: '32px', fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'price-card-3',
          type: 'container',
          content: null,
          position: { x: 550, y: 50, width: 220, height: 400 },
          styles: {
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            padding: '24px',
          },
          visible: true,
        },
        {
          id: 'price-heading-3',
          type: 'heading',
          content: 'Enterprise',
          position: { x: 580, y: 80, width: 160, height: 40 },
          styles: { fontSize: '24px', fontWeight: 'bold', color: '#111827', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'price-amount-3',
          type: 'heading',
          content: '$99/mo',
          position: { x: 590, y: 130, width: 140, height: 50 },
          styles: { fontSize: '32px', fontWeight: 'bold', color: '#3B82F6', textAlign: 'center' },
          visible: true,
        },
      ],
      styles: { backgroundColor: '#F9FAFB' },
    },
  },
  {
    id: 'testimonial',
    name: 'Testimonial Card',
    description: 'Customer testimonial design',
    preview: '💬',
    config: {
      elements: [
        {
          id: 'testimonial-container',
          type: 'container',
          content: null,
          position: { x: 150, y: 100, width: 500, height: 300 },
          styles: {
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            padding: '40px',
          },
          visible: true,
        },
        {
          id: 'testimonial-quote',
          type: 'text',
          content: '"This product has transformed the way we work. Highly recommended!"',
          position: { x: 190, y: 150, width: 420, height: 100 },
          styles: { fontSize: '20px', color: '#374151', fontStyle: 'italic', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'testimonial-author',
          type: 'text',
          content: '- Sarah Johnson, CEO',
          position: { x: 190, y: 260, width: 420, height: 40 },
          styles: { fontSize: '14px', color: '#6B7280', fontWeight: 'semibold', textAlign: 'center' },
          visible: true,
        },
      ],
      styles: { backgroundColor: '#F3F4F6' },
    },
  },
  {
    id: 'stats-section',
    name: 'Stats Display',
    description: 'Key metrics showcase',
    preview: '📈',
    config: {
      elements: [
        {
          id: 'stat-1-number',
          type: 'heading',
          content: '10K+',
          position: { x: 100, y: 100, width: 150, height: 60 },
          styles: { fontSize: '48px', fontWeight: 'bold', color: '#3B82F6', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'stat-1-label',
          type: 'text',
          content: 'Active Users',
          position: { x: 100, y: 170, width: 150, height: 30 },
          styles: { fontSize: '14px', color: '#6B7280', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'stat-2-number',
          type: 'heading',
          content: '99.9%',
          position: { x: 300, y: 100, width: 150, height: 60 },
          styles: { fontSize: '48px', fontWeight: 'bold', color: '#10B981', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'stat-2-label',
          type: 'text',
          content: 'Uptime',
          position: { x: 300, y: 170, width: 150, height: 30 },
          styles: { fontSize: '14px', color: '#6B7280', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'stat-3-number',
          type: 'heading',
          content: '$2M+',
          position: { x: 500, y: 100, width: 150, height: 60 },
          styles: { fontSize: '48px', fontWeight: 'bold', color: '#F59E0B', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'stat-3-label',
          type: 'text',
          content: 'Revenue',
          position: { x: 500, y: 170, width: 150, height: 30 },
          styles: { fontSize: '14px', color: '#6B7280', textAlign: 'center' },
          visible: true,
        },
      ],
      styles: { backgroundColor: '#FFFFFF' },
    },
  },
  {
    id: 'team-grid',
    name: 'Team Grid',
    description: '4-person team layout',
    preview: '👥',
    config: {
      elements: [
        {
          id: 'team-member-1',
          type: 'container',
          content: null,
          position: { x: 50, y: 50, width: 180, height: 250 },
          styles: {
            backgroundColor: '#F9FAFB',
            borderRadius: '16px',
            padding: '16px',
          },
          visible: true,
        },
        {
          id: 'team-name-1',
          type: 'heading',
          content: 'John Doe',
          position: { x: 60, y: 180, width: 160, height: 30 },
          styles: { fontSize: '18px', fontWeight: 'bold', color: '#111827', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'team-role-1',
          type: 'text',
          content: 'CEO',
          position: { x: 60, y: 210, width: 160, height: 25 },
          styles: { fontSize: '14px', color: '#6B7280', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'team-member-2',
          type: 'container',
          content: null,
          position: { x: 250, y: 50, width: 180, height: 250 },
          styles: {
            backgroundColor: '#F9FAFB',
            borderRadius: '16px',
            padding: '16px',
          },
          visible: true,
        },
        {
          id: 'team-name-2',
          type: 'heading',
          content: 'Jane Smith',
          position: { x: 260, y: 180, width: 160, height: 30 },
          styles: { fontSize: '18px', fontWeight: 'bold', color: '#111827', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'team-role-2',
          type: 'text',
          content: 'CTO',
          position: { x: 260, y: 210, width: 160, height: 25 },
          styles: { fontSize: '14px', color: '#6B7280', textAlign: 'center' },
          visible: true,
        },
      ],
      styles: { backgroundColor: '#FFFFFF' },
    },
  },
  {
    id: 'newsletter',
    name: 'Newsletter Signup',
    description: 'Email capture form',
    preview: '📧',
    config: {
      elements: [
        {
          id: 'newsletter-container',
          type: 'container',
          content: null,
          position: { x: 200, y: 150, width: 400, height: 200 },
          styles: {
            backgroundImage: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '20px',
            padding: '32px',
          },
          visible: true,
        },
        {
          id: 'newsletter-heading',
          type: 'heading',
          content: 'Subscribe to Our Newsletter',
          position: { x: 220, y: 180, width: 360, height: 50 },
          styles: { fontSize: '28px', fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'newsletter-text',
          type: 'text',
          content: 'Get the latest updates and news delivered to your inbox',
          position: { x: 220, y: 235, width: 360, height: 40 },
          styles: { fontSize: '14px', color: '#F0F9FF', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'newsletter-button',
          type: 'button',
          content: 'Sign Up',
          position: { x: 350, y: 285, width: 100, height: 45 },
          styles: {
            backgroundColor: '#FFFFFF',
            color: '#0891B2',
            fontSize: '16px',
            fontWeight: 'semibold',
            borderRadius: '10px',
          },
          visible: true,
        },
      ],
      styles: { backgroundColor: '#F9FAFB' },
    },
  },
  {
    id: 'faq-section',
    name: 'FAQ Section',
    description: 'Frequently asked questions',
    preview: '❓',
    config: {
      elements: [
        {
          id: 'faq-heading',
          type: 'heading',
          content: 'Frequently Asked Questions',
          position: { x: 150, y: 50, width: 500, height: 60 },
          styles: { fontSize: '36px', fontWeight: 'bold', color: '#111827', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'faq-item-1',
          type: 'container',
          content: null,
          position: { x: 150, y: 150, width: 500, height: 80 },
          styles: {
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            padding: '16px',
          },
          visible: true,
        },
        {
          id: 'faq-question-1',
          type: 'heading',
          content: 'How does it work?',
          position: { x: 170, y: 165, width: 460, height: 30 },
          styles: { fontSize: '18px', fontWeight: 'semibold', color: '#111827' },
          visible: true,
        },
        {
          id: 'faq-answer-1',
          type: 'text',
          content: 'Simply sign up and start using our platform immediately.',
          position: { x: 170, y: 195, width: 460, height: 25 },
          styles: { fontSize: '14px', color: '#6B7280' },
          visible: true,
        },
        {
          id: 'faq-item-2',
          type: 'container',
          content: null,
          position: { x: 150, y: 250, width: 500, height: 80 },
          styles: {
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            padding: '16px',
          },
          visible: true,
        },
        {
          id: 'faq-question-2',
          type: 'heading',
          content: 'Is there a free trial?',
          position: { x: 170, y: 265, width: 460, height: 30 },
          styles: { fontSize: '18px', fontWeight: 'semibold', color: '#111827' },
          visible: true,
        },
        {
          id: 'faq-answer-2',
          type: 'text',
          content: 'Yes! We offer a 14-day free trial with no credit card required.',
          position: { x: 170, y: 295, width: 460, height: 25 },
          styles: { fontSize: '14px', color: '#6B7280' },
          visible: true,
        },
      ],
      styles: { backgroundColor: '#FFFFFF' },
    },
  },
  {
    id: 'contact-form',
    name: 'Contact Section',
    description: 'Contact information layout',
    preview: '📞',
    config: {
      elements: [
        {
          id: 'contact-heading',
          type: 'heading',
          content: 'Get In Touch',
          position: { x: 250, y: 80, width: 300, height: 60 },
          styles: { fontSize: '36px', fontWeight: 'bold', color: '#111827', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'contact-text',
          type: 'text',
          content: 'Have questions? We\'d love to hear from you.',
          position: { x: 200, y: 150, width: 400, height: 40 },
          styles: { fontSize: '16px', color: '#6B7280', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'contact-email',
          type: 'text',
          content: 'Email: hello@example.com',
          position: { x: 250, y: 220, width: 300, height: 30 },
          styles: { fontSize: '16px', color: '#3B82F6', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'contact-phone',
          type: 'text',
          content: 'Phone: +1 (555) 123-4567',
          position: { x: 250, y: 260, width: 300, height: 30 },
          styles: { fontSize: '16px', color: '#3B82F6', textAlign: 'center' },
          visible: true,
        },
        {
          id: 'contact-button',
          type: 'button',
          content: 'Send Message',
          position: { x: 300, y: 320, width: 200, height: 60 },
          styles: {
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 'semibold',
            borderRadius: '12px',
          },
          visible: true,
        },
      ],
      styles: { backgroundColor: '#F9FAFB' },
    },
  },
  {
    id: 'video-hero',
    name: 'Video Hero',
    description: 'Hero with video background',
    preview: '🎥',
    config: {
      elements: [
        {
          id: 'video-bg',
          type: 'video',
          content: '',
          position: { x: 0, y: 0, width: 800, height: 500 },
          styles: {
            opacity: 0.7,
          },
          visible: true,
        },
        {
          id: 'video-hero-heading',
          type: 'heading',
          content: 'Transform Your Business',
          position: { x: 200, y: 180, width: 400, height: 70 },
          styles: {
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center',
            zIndex: 10,
            textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
          },
          visible: true,
        },
        {
          id: 'video-hero-button',
          type: 'button',
          content: 'Watch Demo',
          position: { x: 300, y: 280, width: 200, height: 60 },
          styles: {
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '30px',
            zIndex: 10,
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
          },
          visible: true,
        },
      ],
      styles: { backgroundColor: '#000000' },
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
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 rounded-t-3xl">
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
