'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Home, Mail, ArrowLeft } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();

  const categories = [
    {
      id: 'ls',
      code: 'LS',
      name: 'LIQUID | SOLID',
      slug: 'liquid-solid',
      bgColor: 'bg-gray-300',
    },
    {
      id: 'll',
      code: 'LL',
      name: 'LIQUID | LIQUID',
      slug: 'liquid-liquid',
      bgColor: 'bg-gray-100',
    },
    {
      id: 'gl',
      code: 'GL',
      name: 'GAS | LIQUID',
      slug: 'gas-liquid',
      bgColor: 'bg-gray-200',
    },
    {
      id: 'gs',
      code: 'GS',
      name: 'GAS | SOLID',
      slug: 'gas-solid',
      bgColor: 'bg-gray-400',
    },
  ];

  return (
    <div className="fixed inset-0 bg-ftc-lightBlue overflow-hidden">
      <div className="h-full w-full flex items-center justify-center p-8">
        {/* Main Tablet Container */}
        <div className="w-full max-w-6xl h-[90vh] relative z-20">
          {/* Tablet Frame */}
          <div className="bg-black rounded-[2.5rem] p-2 h-full">
            {/* Screen */}
            <div className="bg-white rounded-[2rem] overflow-hidden h-full flex flex-col relative">
              {/* Back Button - Top Left */}
              <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 z-20 p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>

              {/* Top Right Navigation Buttons */}
              <div className="absolute top-4 right-4 flex gap-3 z-20">
                <button
                  onClick={() => router.push('/home')}
                  className="w-12 h-12 rounded-full bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-600 transition-all flex items-center justify-center touch-manipulation"
                  aria-label="Home"
                >
                  <Home className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => {/* Email functionality */}}
                  className="w-12 h-12 rounded-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900 transition-all flex items-center justify-center touch-manipulation"
                  aria-label="Email"
                >
                  <Mail className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* FTC Logo - Top Center */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <Image
                  src="/logos/ftc/FTC_LogoNotag.png"
                  alt="FTC Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              </div>

              {/* Main Content - 2x2 Grid */}
              <div className="h-full w-full p-8 pt-20 pb-16">
                <div className="h-full w-full grid grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => router.push(`/products/${category.slug}`)}
                      className={`${category.bgColor} rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98] touch-manipulation group relative overflow-hidden`}
                    >
                      {/* Filtration Icon/Diagram */}
                      <div className="mb-6">
                        <svg
                          width="80"
                          height="80"
                          viewBox="0 0 80 80"
                          className="opacity-70 group-hover:opacity-90 transition-opacity"
                        >
                          {/* Simple filtration flow diagram */}
                          <circle cx="20" cy="20" r="8" fill="white" stroke="currentColor" strokeWidth="2" className="text-gray-600" />
                          <circle cx="40" cy="40" r="12" fill="white" stroke="currentColor" strokeWidth="2" className="text-gray-600" />
                          <circle cx="60" cy="20" r="8" fill="white" stroke="currentColor" strokeWidth="2" className="text-gray-600" />
                          <line x1="20" y1="28" x2="32" y2="36" stroke="currentColor" strokeWidth="2" className="text-gray-600" />
                          <line x1="48" y1="36" x2="60" y2="28" stroke="currentColor" strokeWidth="2" className="text-gray-600" />
                        </svg>
                      </div>

                      {/* Category Code */}
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-700">
                            {category.code}
                          </span>
                        </div>
                      </div>

                      {/* Category Name */}
                      <h2 className="text-lg font-semibold text-gray-700 tracking-wider">
                        {category.name}
                      </h2>
                    </button>
                  ))}
                </div>
              </div>

              {/* FTC Logo - Bottom Left */}
              <div className="absolute bottom-4 left-4 z-10">
                <Image
                  src="/logos/ftc/FTC_LogoNotag.png"
                  alt="FTC"
                  width={60}
                  height={20}
                  className="h-6 w-auto opacity-50"
                />
              </div>
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
