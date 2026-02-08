'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';

export default function KnowledgeBasePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'total-cost-of-filtration',
      layout: 'content-left', // Content on left, image on right
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
      image: '/images/john-paraskeva.jpg',
      quote: "There's always\nsomeone who will\ndo it cheaper.",
    },
    {
      id: 'why-do-we-filter',
      layout: 'content-right', // Image on left, content on right
      content: {
        title: 'Why do we filter?',
        subtitle: null,
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
      image: '/images/products/filter-vessel.png',
      quote: null,
    },
  ];

  const currentSlideData = slides[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="fixed inset-0 bg-ftc-lightBlue overflow-hidden">
      <div className="h-full w-full flex items-center justify-center p-8">
        {/* Main Tablet Container */}
        <div className="w-full max-w-6xl h-[90vh] relative z-20">
          {/* Tablet Frame */}
          <div className="bg-black rounded-[2.5rem] p-2 h-full">
            {/* Screen */}
            <div className="bg-white rounded-[2rem] overflow-hidden h-full flex relative">
              {/* Navigation Dots - Top Right */}
              <div className="absolute top-8 right-8 z-20 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide ? 'bg-gray-400' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Home Button - Bottom Right */}
              <div className="absolute bottom-8 right-8 z-20">
                <button
                  onClick={() => router.push('/home')}
                  className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center"
                  aria-label="Home"
                >
                  <Home className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* Slide Content */}
              {currentSlideData.layout === 'content-left' ? (
                <>
                  {/* Left Panel - Content */}
                  <div className="w-1/2 p-12 overflow-y-auto bg-white">
                    <div className="mb-8">
                      <Image
                        src="/logos/ftc/FTC_LogoNotag.png"
                        alt="FTC Logo"
                        width={80}
                        height={40}
                        className="h-10 w-auto"
                        priority
                      />
                    </div>

                    <div className="space-y-6">
                      <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                        {currentSlideData.content.title}
                      </h1>
                      {currentSlideData.content.subtitle && (
                        <h2 className="text-2xl text-gray-600">{currentSlideData.content.subtitle}</h2>
                      )}

                      <ul className="space-y-3 text-gray-700 mt-8">
                        {currentSlideData.content.items.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
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
                      src={currentSlideData.image}
                      alt={currentSlideData.content.title}
                      fill
                      className="object-contain p-12"
                      priority
                    />
                  </div>

                  {/* Right Panel - Content */}
                  <div className="w-1/2 p-12 overflow-y-auto bg-white flex flex-col">
                    <div className="mb-12 flex justify-center">
                      <Image
                        src="/logos/ftc/FTC_LogoNotag.png"
                        alt="FTC Logo"
                        width={100}
                        height={40}
                        className="h-12 w-auto"
                        priority
                      />
                    </div>

                    <div className="space-y-8 flex-1">
                      <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
                        {currentSlideData.content.title}
                      </h1>

                      <ul className="space-y-4 text-gray-700 text-lg">
                        {currentSlideData.content.items.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-3 mt-2 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
                            <span className={item.startsWith('(') ? 'text-sm' : ''}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {/* Previous Button */}
              {currentSlide > 0 && (
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
              )}

              {/* Next Button */}
              {currentSlide < slides.length - 1 && (
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Right Color Bars */}
        <div className="absolute bottom-0 right-0 flex h-12 w-[40vw] max-w-[500px]">
          <div className="flex-1 bg-orange-500"></div>
          <div className="flex-1 bg-blue-700"></div>
          <div className="flex-1 bg-green-500"></div>
          <div className="flex-1 bg-cyan-400"></div>
        </div>
      </div>
    </div>
  );
}
