import Link from 'next/link';
import { sanityClient } from '@/lib/sanity/client';
import { slidesQuery } from '@/lib/sanity/queries';
import { Slide } from '@/types';
import { FlowDeckLayout } from '@/components/layout/FlowDeckLayout';
import Image from 'next/image';

export default async function IntroductionPage() {
  const slides: Slide[] = await sanityClient.fetch(slidesQuery);

  return (
    <FlowDeckLayout>
      <div className="px-12 py-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Intro Presentation
        </h1>

        <div className="grid grid-cols-2 ipad:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {slides.map((slide, index) => (
            <Link
              key={slide._id}
              href={`/intro-presentation/${slide.slug.current}`}
              className="group no-underline"
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 active:scale-95 overflow-hidden touch-manipulation">
                {slide.backgroundImage && (
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <Image
                      src={slide.backgroundImage}
                      alt={slide.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      priority={index < 6}
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    <span className="text-blue-600">{index + 1}.</span> {slide.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </FlowDeckLayout>
  );
}
