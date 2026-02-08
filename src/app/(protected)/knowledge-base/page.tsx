'use client';

import { useState } from 'react';
import { FlowDeckPage } from '@/components/layout/FlowDeckPage';
import { FTCLogo } from '@/components/branding/FTCLogo';
import Image from 'next/image';

export default function KnowledgeBasePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'total-cost-of-filtration',
      layout: 'content-left' as const,
      content: {
        title: 'Total Cost of Filtration:',
        subtitle: 'What does it mean?',
        items: [
          'Initial equipment prices for cartridges',
          'Differential pressure',
          'Downtime',
          'Labor',
          'Disposal',
          'Shipping',
          'Warehousing cost and handling',
          'Transactional cost',
          'Financial product quality',
          'Impact on downstream equipment',
        ],
      },
      image: '/images/knowledge-base/bad-tattoo.jpg',
      quote: "There's always\nsomeone who will\ndo it cheaper.",
    },
    {
      id: 'why-do-we-filter',
      layout: 'content-right' as const,
      content: {
        title: 'Why do we filter?',
        items: [
          'Removal of Unwanted Contaminants',
          'Ensure better life/quality (Product must meet the LossLoadable Powder Specification)',
          'Protection of equipment (turbines, electric grids, etc.)',
          'Recovery of Manufactured Product (Minimum Cakewash Necessary)',
          'Reduce Operating Costs',
          'Protect downstream equipment (Plugged)',
          '(Exchangers, Pumps, Tower Trays, Spray Nozzles, Control Valves, etc.)',
        ],
      },
      image: '/images/knowledge-base/filter-vessel.png',
    },
  ];

  const currentSlideData = slides[currentSlide];

  return (
    <FlowDeckPage
      section="knowledge-base"
      showHome={true}
      showBack={false}
      showLogo={false}
      showDots={true}
      currentSlide={currentSlide}
      totalSlides={slides.length}
      onDotClick={setCurrentSlide}
      showPrevNext={true}
      onPrevious={() => setCurrentSlide(prev => prev - 1)}
      onNext={() => setCurrentSlide(prev => prev + 1)}
      disablePrevious={currentSlide === 0}
      disableNext={currentSlide === slides.length - 1}
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
                  {currentSlideData.content.title}
                </h1>
                {'subtitle' in currentSlideData.content && currentSlideData.content.subtitle && (
                  <h2 className="text-2xl text-gray-600">{currentSlideData.content.subtitle}</h2>
                )}

                <ul className="space-y-3 text-gray-700 mt-8">
                  {currentSlideData.content.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Panel - Image */}
            <div className="w-1/2 relative bg-gray-900">
              <Image
                src={currentSlideData.image}
                alt={currentSlideData.content.title}
                fill
                className="object-cover"
                priority
              />
              {'quote' in currentSlideData && currentSlideData.quote && (
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
                src={currentSlideData.image}
                alt={currentSlideData.content.title}
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
                  {currentSlideData.content.title}
                </h1>

                <ul className="space-y-4 text-gray-700 text-lg">
                  {currentSlideData.content.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3 mt-2 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                      <span className={item.startsWith('(') ? 'text-sm' : ''}>{item}</span>
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
