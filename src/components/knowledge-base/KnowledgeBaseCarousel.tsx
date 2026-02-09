'use client';

import { useState } from 'react';
import { FlowDeckPage } from '@/components/layout/FlowDeckPage';
import { FTCLogo } from '@/components/branding/FTCLogo';
import Image from 'next/image';

interface KnowledgeSlideItem {
  id: string;
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
  items: KnowledgeSlideItem[];
}

interface KnowledgeBaseCarouselProps {
  slides: KnowledgeSlide[];
}

export function KnowledgeBaseCarousel({ slides }: KnowledgeBaseCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fallback to empty array if no slides
  const slideData = slides.length > 0 ? slides : [];
  const currentSlideData = slideData[currentSlide];

  // If no slides, show error state
  if (!currentSlideData) {
    return (
      <FlowDeckPage section="knowledge-base" showHome={true} showBack={false}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-600">
            <p className="text-2xl font-bold mb-2">No slides available</p>
            <p>Please add knowledge base slides in the admin panel.</p>
          </div>
        </div>
      </FlowDeckPage>
    );
  }

  return (
    <FlowDeckPage
      section="knowledge-base"
      showHome={true}
      showBack={false}
      showLogo={false}
      showDots={true}
      currentSlide={currentSlide}
      totalSlides={slideData.length}
      onDotClick={setCurrentSlide}
      showPrevNext={true}
      onPrevious={() => setCurrentSlide(prev => prev - 1)}
      onNext={() => setCurrentSlide(prev => prev + 1)}
      disablePrevious={currentSlide === 0}
      disableNext={currentSlide === slideData.length - 1}
    >
      {/* Slide Content */}
      <div className="h-full flex relative">
        {currentSlideData.layout === 'content-left' ? (
          <>
            {/* Left Panel - Content */}
            <div className="w-1/2 p-12 overflow-y-auto bg-white">
              <FTCLogo position="center" size="md" className="mb-8" />

              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {currentSlideData.title}
                </h1>
                {currentSlideData.subtitle && (
                  <h2 className="text-2xl text-gray-600">{currentSlideData.subtitle}</h2>
                )}

                <ul className="space-y-3 text-gray-700 mt-8">
                  {currentSlideData.items.map((item) => (
                    <li key={item.id} className="flex items-start">
                      <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                      <span>{item.content}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Panel - Image */}
            <div className="w-1/2 relative bg-gray-900">
              <Image
                src={currentSlideData.image_path}
                alt={currentSlideData.title}
                fill
                className="object-cover"
                priority
              />
              {currentSlideData.quote && (
                <div className="absolute top-8 left-8 right-8">
                  <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-start gap-3">
                      <div className="text-white/60 text-4xl leading-none">&ldquo;</div>
                      <div>
                        <p className="text-white text-lg font-medium leading-relaxed whitespace-pre-line">
                          {currentSlideData.quote}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Left Panel - Image */}
            <div className="w-1/2 relative bg-gradient-to-br from-gray-50 to-gray-100">
              <Image
                src={currentSlideData.image_path}
                alt={currentSlideData.title}
                fill
                className="object-contain p-12"
                priority
              />
            </div>

            {/* Right Panel - Content */}
            <div className="w-1/2 p-12 overflow-y-auto bg-white flex flex-col">
              <FTCLogo position="center" size="lg" className="mb-12" />

              <div className="space-y-8 flex-1">
                <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
                  {currentSlideData.title}
                </h1>

                <ul className="space-y-4 text-gray-700 text-lg">
                  {currentSlideData.items.map((item) => (
                    <li key={item.id} className="flex items-start">
                      <span className="mr-3 mt-2 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                      <span className={item.content.startsWith('(') ? 'text-sm' : ''}>
                        {item.content}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </FlowDeckPage>
  );
}
