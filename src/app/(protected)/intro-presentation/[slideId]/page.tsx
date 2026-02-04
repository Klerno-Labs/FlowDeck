import Link from 'next/link';
import { sanityClient } from '@/lib/sanity/client';
import { slideBySlugQuery, slidesQuery } from '@/lib/sanity/queries';
import { Slide } from '@/types';
import { PortableText } from '@portabletext/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default async function SlidePage({ params }: { params: { slideId: string } }) {
  const slide: Slide = await sanityClient.fetch(slideBySlugQuery, { slug: params.slideId });
  const allSlides: Slide[] = await sanityClient.fetch(slidesQuery);

  if (!slide) {
    return <div>Slide not found</div>;
  }

  const currentIndex = allSlides.findIndex((s) => s._id === slide._id);
  const prevSlide = currentIndex > 0 ? allSlides[currentIndex - 1] : null;
  const nextSlide = currentIndex < allSlides.length - 1 ? allSlides[currentIndex + 1] : null;

  const bgStyle = slide.backgroundImage
    ? {
        backgroundImage: `url(${slide.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { backgroundColor: slide.backgroundColor || '#ffffff' };

  return (
    <div className="min-h-screen" style={bgStyle}>
      {/* Slide Content */}
      <div className="min-h-screen flex items-center justify-center px-8 py-16">
        <div className="max-w-5xl w-full bg-white/95 rounded-2xl p-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">{slide.title}</h1>

          {slide.content && (
            <div className="prose prose-lg max-w-none">
              <PortableText value={slide.content} />
            </div>
          )}

          {slide.videoUrl && (
            <div className="mt-8 aspect-video">
              <iframe
                src={slide.videoUrl}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 left-0 right-0 flex items-center justify-center gap-4">
        {prevSlide && (
          <Link href={`/intro-presentation/${prevSlide.slug.current}`}>
            <Button variant="secondary" size="lg">
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
          </Link>
        )}

        <Link href="/intro-presentation">
          <Button variant="ghost" size="lg">
            All Slides
          </Button>
        </Link>

        {nextSlide && (
          <Link href={`/intro-presentation/${nextSlide.slug.current}`}>
            <Button variant="secondary" size="lg">
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
