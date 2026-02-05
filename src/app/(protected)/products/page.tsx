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
      bgColor: 'bg-[#F17A2C]',
      customLayout: true,
      subtitle: 'FILTRATION',
    },
    {
      id: 'll',
      code: 'LL',
      name: 'LIQUID | LIQUID',
      slug: 'liquid-liquid',
      bgColor: 'bg-[#00B4D8]',
      customLayout: true,
      subtitle: 'SEPARATION',
    },
    {
      id: 'gl',
      code: 'GL',
      name: 'GAS | LIQUID',
      slug: 'gas-liquid',
      bgColor: 'bg-[#4169E1]',
      customLayout: true,
      subtitle: 'SEPARATION',
    },
    {
      id: 'gs',
      code: 'GS',
      name: 'GAS | SOLID',
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
              <div className="h-full w-full p-8 pt-20 pb-16">
                <div className="h-full w-full grid grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => router.push(`/products/${category.slug}`)}
                      className={`${category.bgColor} rounded-2xl flex ${category.customLayout ? 'flex-row items-center justify-start px-8' : 'flex-col items-center justify-center'} transition-all hover:scale-[1.02] active:scale-[0.98] touch-manipulation group relative overflow-hidden`}
                    >
                      {category.customLayout ? (
                        /* Custom Category Layouts */
                        <>
                          {/* Left Side - Brand Logos and Badge */}
                          <div className="flex flex-col items-center gap-3 mr-8">
                            {/* Brand Logos */}
                            <div className="flex flex-wrap items-center justify-center gap-3 max-w-[200px]">
                              {category.id === 'ls' && (
                                /* Liquid | Solid - Multiple brands */
                                <>
                                  <Image src="/logos/brands/ClarifyColor.png" alt="Clarify" width={80} height={30} className="h-6 w-auto" />
                                  <Image src="/logos/brands/SievaColor.png" alt="Sieva" width={80} height={30} className="h-6 w-auto" />
                                  <Image src="/logos/brands/TorrentColor.png" alt="Torrent" width={80} height={30} className="h-6 w-auto" />
                                  <Image src="/logos/brands/InvictaColor.png" alt="Invicta" width={80} height={30} className="h-6 w-auto" />
                                </>
                              )}
                              {category.id === 'll' && (
                                /* Liquid | Liquid - Strata */
                                <Image src="/logos/brands/StrataColor.png" alt="Strata" width={100} height={40} className="h-8 w-auto" />
                              )}
                              {category.id === 'gl' && (
                                /* Gas | Liquid - Cyphon */
                                <Image src="/logos/brands/CyphonColor.png" alt="Cyphon" width={100} height={40} className="h-8 w-auto" />
                              )}
                              {category.id === 'gs' && (
                                /* Gas | Solid - Tersus & Seprum */
                                <>
                                  <Image src="/logos/brands/TersusColor.png" alt="Tersus" width={90} height={35} className="h-7 w-auto" />
                                  <Image src="/logos/brands/SeprumColor.png" alt="Seprum" width={90} height={35} className="h-7 w-auto" />
                                </>
                              )}
                            </div>

                            {/* Category Badge */}
                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                              <span className="text-2xl font-bold" style={{ color: category.bgColor.replace('bg-[', '').replace(']', '') }}>
                                {category.code}
                              </span>
                            </div>
                          </div>

                          {/* Right Side - Text */}
                          <div className="flex-1 text-left">
                            <h2 className="text-4xl font-bold text-white tracking-wider leading-tight">
                              {category.name} {category.subtitle || 'FILTRATION'}
                            </h2>
                          </div>
                        </>
                      ) : (
                        /* Default Layout for Other Categories */
                        <>
                          {/* Filtration Icon/Diagram */}
                          <div className="mb-6">
                            <svg
                              width="100"
                              height="60"
                              viewBox="0 0 100 60"
                              className="opacity-60 group-hover:opacity-80 transition-opacity"
                            >
                              {/* Input circle */}
                              <circle cx="15" cy="30" r="10" fill="none" stroke="white" strokeWidth="2.5" />
                              <circle cx="15" cy="30" r="4" fill="white" />

                              {/* Filter/Process circle (center) */}
                              <circle cx="50" cy="30" r="14" fill="none" stroke="white" strokeWidth="2.5" />
                              <circle cx="50" cy="30" r="6" fill="white" />
                              <line x1="43" y1="30" x2="57" y2="30" stroke="white" strokeWidth="1.5" />
                              <line x1="50" y1="23" x2="50" y2="37" stroke="white" strokeWidth="1.5" />

                              {/* Output circle */}
                              <circle cx="85" cy="30" r="10" fill="none" stroke="white" strokeWidth="2.5" />
                              <circle cx="85" cy="30" r="4" fill="white" />

                              {/* Connection lines with arrows */}
                              <line x1="25" y1="30" x2="36" y2="30" stroke="white" strokeWidth="2" />
                              <polygon points="36,30 31,27 31,33" fill="white" />

                              <line x1="64" y1="30" x2="75" y2="30" stroke="white" strokeWidth="2" />
                              <polygon points="75,30 70,27 70,33" fill="white" />
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
                        </>
                      )}
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
