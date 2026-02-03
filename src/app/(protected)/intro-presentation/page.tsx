import Link from 'next/link';
import { sanityClient } from '@/lib/sanity/client';
import { slidesQuery } from '@/lib/sanity/queries';
import { Slide } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default async function IntroductionPage() {
  const slides: Slide[] = await sanityClient.fetch(slidesQuery);

  return (
    <div className="min-h-screen px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Intro Presentation
        </h1>

        <div className="grid grid-cols-2 ipad:grid-cols-3 gap-6">
          {slides.map((slide, index) => (
            <Link key={slide._id} href={`/intro-presentation/${slide.slug.current}`}>
              <Card className="card-touch h-full">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {index + 1}. {slide.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {slide.backgroundImage && (
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={slide.backgroundImage}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
