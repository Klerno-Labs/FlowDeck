import Image from 'next/image';
import { Mail, ChevronRight } from 'lucide-react';
import { FlowDeckPage } from '@/components/layout/FlowDeckPage';
import { getSlideByKey } from '@/lib/db/presentation-content';
import { IntroSlideButtons } from '@/components/intro/IntroSlideButtons';

export default async function IntroductionPage() {
  // Fetch slide data from database
  const slide = await getSlideByKey('company-overview');

  // Fallback to default content if database fetch fails
  const heading = slide?.heading || 'Company Overview';
  const paragraph = slide?.paragraph || 'Founded by John Paraskeva in 1987...';
  const imagePath = slide?.image_path || '/images/john-paraskeva.jpg';
  const items = slide?.items || [];

  return (
    <FlowDeckPage
      section="intro"
      showHome={false}
      showBack={true}
      backgroundColor="bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Slide Container */}
      <div className="h-full flex items-center justify-center p-8">
        <div className="relative w-full max-w-6xl aspect-[16/10] bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Interactive Circle Buttons - top right */}
          <IntroSlideButtons nextPage="/intro-presentation/what-we-guarantee" />

          {/* Main Content */}
          <div className="h-full flex items-center gap-8 pt-20 pb-12 px-12">
            {/* Left Side - Image */}
            <div className="w-[40%] flex-shrink-0 flex items-center justify-center">
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={imagePath}
                  alt={heading}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold text-gray-800 mb-6 border-l-4 border-cyan-400 pl-4">
                {heading}
              </h1>

              <div className="space-y-4 text-gray-700">
                <p className="text-sm leading-relaxed">
                  {paragraph}
                </p>

                <div className="pt-4">
                  <p className="text-sm font-semibold text-gray-800 mb-3">
                    We offer a wide range of products, including:
                  </p>
                  <ul className="space-y-2 text-sm">
                    {items.map((item) => (
                      <li key={item.id} className="flex items-start">
                        <span
                          className="font-bold mr-2"
                          style={{ color: item.bullet_color || '#00B4D8' }}
                        >
                          •
                        </span>
                        <span>{item.content}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative circles - bottom left */}
          <div className="absolute bottom-8 left-8 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 opacity-70"></div>
            <div className="w-8 h-8 rounded-full bg-blue-700 opacity-70"></div>
            <div className="w-8 h-8 rounded-full bg-green-500 opacity-70"></div>
          </div>

          {/* Colorful accent bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-2 flex">
            <div className="flex-1 bg-cyan-400"></div>
            <div className="flex-1 bg-blue-700"></div>
            <div className="flex-1 bg-green-500"></div>
            <div className="flex-1 bg-orange-500"></div>
          </div>
        </div>
      </div>
    </FlowDeckPage>
  );
}
