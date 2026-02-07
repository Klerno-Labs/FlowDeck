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
      name: 'LIQUID SOLID',
      slug: 'liquid-solid',
      bgColor: 'bg-[#F17A2C]',
      customLayout: true,
      subtitle: 'FILTRATION',
    },
    {
      id: 'll',
      code: 'LL',
      name: 'LIQUID LIQUID',
      slug: 'liquid-liquid',
      bgColor: 'bg-[#00B4D8]',
      customLayout: true,
      subtitle: 'SEPARATION',
    },
    {
      id: 'gl',
      code: 'GL',
      name: 'GAS LIQUID',
      slug: 'gas-liquid',
      bgColor: 'bg-[#4169E1]',
      customLayout: true,
      subtitle: 'SEPARATION',
    },
    {
      id: 'gs',
      code: 'GS',
      name: 'GAS SOLID',
      slug: 'gas-solid',
      bgColor: 'bg-[#7AC142]',
      customLayout: true,
      subtitle: 'FILTRATION',
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
              <div className="h-full w-full p-12 pt-24 pb-20">
                <div className="h-full w-full grid grid-cols-2 gap-6">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => router.push(`/products/${category.slug}`)}
                      className={`${category.bgColor} rounded-3xl flex flex-row items-center justify-between px-12 py-10 transition-all hover:scale-[1.02] active:scale-[0.98] touch-manipulation group relative overflow-hidden shadow-2xl`}
                    >
                      {/* Left Side - Brand Logo */}
                      <div className="flex items-center justify-center">
                        {category.id === 'ls' && (
                          <Image
                            src="/logos/brands/ClarifyColor-Edited.png"
                            alt="Clarify"
                            width={400}
                            height={150}
                            className="h-36 w-auto brightness-0 invert drop-shadow-2xl"
                            quality={100}
                            priority
                          />
                        )}
                        {category.id === 'll' && (
                          <Image
                            src="/logos/brands/StrataColor-Edited.png"
                            alt="Strata"
                            width={400}
                            height={150}
                            className="h-36 w-auto brightness-0 invert drop-shadow-2xl"
                            quality={100}
                            priority
                          />
                        )}
                        {category.id === 'gl' && (
                          <Image
                            src="/logos/brands/CyphonColor-Edited.png"
                            alt="Cyphon"
                            width={400}
                            height={150}
                            className="h-36 w-auto brightness-0 invert drop-shadow-2xl"
                            quality={100}
                            priority
                          />
                        )}
                        {category.id === 'gs' && (
                          <Image
                            src="/logos/brands/SeprumColor-Edited.png"
                            alt="Seprum"
                            width={400}
                            height={150}
                            className="h-36 w-auto brightness-0 invert drop-shadow-2xl"
                            quality={100}
                            priority
                          />
                        )}
                      </div>

                      {/* Right Side - Text */}
                      <div className="flex-1 text-right pr-4">
                        <h2 className="text-4xl font-black text-white tracking-[0.15em] leading-none mb-3">
                          {category.name}
                        </h2>
                        <p className="text-xl font-bold text-white tracking-[0.2em]">
                          {category.subtitle || 'FILTRATION'}
                        </p>
                      </div>
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
