'use client';

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { Home, Mail, ArrowLeft } from 'lucide-react';

export default function CategoryProductsPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId as string;

  // Map category slugs to display names
  const categoryNames: Record<string, string> = {
    'liquid-solid': 'LIQUID | SOLID',
    'liquid-liquid': 'LIQUID | LIQUID',
    'gas-liquid': 'GAS | LIQUID',
    'gas-solid': 'GAS | SOLID',
  };

  // Product lines by category
  const productLinesByCategory: Record<string, Array<any>> = {
    'liquid-solid': [
      {
        id: 'clarify',
        name: 'CLARIFY',
        slug: 'clarify',
        hasIcon: true,
      },
      {
        id: 'sieva',
        name: 'SIEVA',
        slug: 'sieva',
        hasIcon: true,
      },
      {
        id: 'torrent',
        name: 'TORRENT',
        slug: 'torrent',
        hasIcon: true,
      },
      {
        id: 'invicta',
        name: 'INVICTA',
        slug: 'invicta',
        hasLogo: true,
      },
    ],
    'liquid-liquid': [
      {
        id: 'strata',
        name: 'STRATA',
        slug: 'strata',
        hasIcon: true,
      },
    ],
    'gas-liquid': [
      {
        id: 'cyphon',
        name: 'CYPHON',
        slug: 'cyphon',
        hasIcon: true,
      },
    ],
    'gas-solid': [
      {
        id: 'tersus',
        name: 'TERSUS',
        slug: 'tersus',
        hasIcon: true,
      },
      {
        id: 'seprum',
        name: 'SEPRUM',
        slug: 'seprum',
        hasIcon: true,
      },
    ],
  };

  const productLines = productLinesByCategory[categoryId] || [];

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

              {/* Main Content */}
              <div className="h-full w-full p-8 pt-20 pb-16">
                {categoryId === 'gas-solid' ? (
                  /* Gas-Solid: 2 Brands (left) + Vessels (right) */
                  <div className="h-full w-full flex gap-6">
                    {/* Left: 2 Brands (TERSUS & SEPRUM) */}
                    <div className="flex-1 flex flex-col gap-6">
                      {productLines.map((line) => (
                        <button
                          key={line.id}
                          onClick={() => router.push(`/products/${categoryId}/${line.slug}`)}
                          className="flex-1 bg-white rounded-3xl flex flex-col items-center justify-center transition-all hover:scale-[1.03] active:scale-[0.97] touch-manipulation group relative overflow-hidden shadow-lg hover:shadow-xl border-4 border-gray-100 hover:border-gray-200 p-8"
                        >
                          <Image
                            src={`/logos/brands/${line.name.charAt(0)}${line.name.slice(1).toLowerCase()}Color.png`}
                            alt={line.name}
                            width={220}
                            height={80}
                            className="h-20 w-auto"
                          />
                        </button>
                      ))}
                    </div>

                    {/* Right: VESSELS */}
                    <button
                      onClick={() => router.push(`/products/${categoryId}/vessels`)}
                      className="flex-1 bg-white rounded-3xl flex flex-col items-center justify-center transition-all hover:scale-[1.03] active:scale-[0.97] touch-manipulation group relative overflow-hidden shadow-lg hover:shadow-xl border-4 border-gray-100 hover:border-gray-200"
                    >
                      <div className="w-full h-full flex items-center justify-center p-8 relative">
                        <svg
                          width="180"
                          height="260"
                          viewBox="0 0 160 240"
                          className="opacity-40"
                        >
                          <rect x="40" y="50" width="80" height="140" fill="#374151" stroke="#374151" strokeWidth="3" rx="6" />
                          <ellipse cx="80" cy="50" rx="40" ry="12" fill="#374151" />
                          <rect x="45" y="195" width="70" height="30" fill="#374151" />
                          <circle cx="60" cy="90" r="12" fill="none" stroke="#374151" strokeWidth="3" />
                          <circle cx="100" cy="130" r="12" fill="none" stroke="#374151" strokeWidth="3" />
                          <line x1="70" y1="140" x2="100" y2="140" stroke="#374151" strokeWidth="4" />
                        </svg>
                        <span className="absolute bottom-12 text-gray-700 text-3xl font-bold tracking-wider">
                          VESSELS
                        </span>
                      </div>
                    </button>
                  </div>
                ) : (categoryId === 'liquid-liquid' || categoryId === 'gas-liquid') ? (
                  /* Liquid-Liquid & Gas-Liquid: Split Screen (Product Line + VESSELS) */
                  <div className="h-full w-full flex gap-6">
                    {/* Left: Product Line (STRATA or CYPHON) */}
                    {productLines.map((line) => (
                      <button
                        key={line.id}
                        onClick={() => router.push(`/products/${categoryId}/${line.slug}`)}
                        className="flex-1 bg-white rounded-3xl flex flex-col items-center justify-center transition-all hover:scale-[1.03] active:scale-[0.97] touch-manipulation group relative overflow-hidden shadow-lg hover:shadow-xl border-4 border-gray-100 hover:border-gray-200 p-12"
                      >
                        <Image
                          src={`/logos/brands/${line.name.charAt(0)}${line.name.slice(1).toLowerCase()}Color.png`}
                          alt={line.name}
                          width={280}
                          height={100}
                          className="h-24 w-auto"
                        />
                      </button>
                    ))}

                    {/* Right: VESSELS */}
                    <button
                      onClick={() => router.push(`/products/${categoryId}/vessels`)}
                      className="flex-1 bg-white rounded-3xl flex flex-col items-center justify-center transition-all hover:scale-[1.03] active:scale-[0.97] touch-manipulation group relative overflow-hidden shadow-lg hover:shadow-xl border-4 border-gray-100 hover:border-gray-200"
                    >
                      <div className="w-full h-full flex items-center justify-center p-8 relative">
                        <svg
                          width="180"
                          height="260"
                          viewBox="0 0 160 240"
                          className="opacity-40"
                        >
                          <rect x="40" y="50" width="80" height="140" fill="#374151" stroke="#374151" strokeWidth="3" rx="6" />
                          <ellipse cx="80" cy="50" rx="40" ry="12" fill="#374151" />
                          <rect x="45" y="195" width="70" height="30" fill="#374151" />
                          <circle cx="60" cy="90" r="12" fill="none" stroke="#374151" strokeWidth="3" />
                          <circle cx="100" cy="130" r="12" fill="none" stroke="#374151" strokeWidth="3" />
                          <line x1="70" y1="140" x2="100" y2="140" stroke="#374151" strokeWidth="4" />
                        </svg>
                        <span className="absolute bottom-12 text-gray-700 text-3xl font-bold tracking-wider">
                          VESSELS
                        </span>
                      </div>
                    </button>
                  </div>
                ) : (
                  /* Other categories: 2x2 Grid + Vessels */
                  <div className="h-full w-full flex gap-6">
                    <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-6">
                      {productLines.map((line) => (
                      <button
                        key={line.id}
                        onClick={() => router.push(`/products/${categoryId}/${line.slug}`)}
                        className="bg-white rounded-3xl flex flex-col items-center justify-center transition-all hover:scale-[1.03] active:scale-[0.97] touch-manipulation group relative overflow-hidden shadow-lg hover:shadow-xl border-4 border-gray-100 hover:border-gray-200 p-8"
                      >
                        <Image
                          src={`/logos/brands/${line.name.charAt(0)}${line.name.slice(1).toLowerCase()}Color.png`}
                          alt={line.name}
                          width={160}
                          height={60}
                          className="h-14 w-auto"
                        />
                      </button>
                    ))}
                    </div>
                    <button
                      onClick={() => router.push(`/products/${categoryId}/vessels`)}
                      className="w-1/3 bg-white rounded-3xl flex flex-col items-center justify-center transition-all hover:scale-[1.03] active:scale-[0.97] touch-manipulation group relative overflow-hidden shadow-lg hover:shadow-xl border-4 border-gray-100 hover:border-gray-200"
                    >
                      <div className="w-full h-full flex items-center justify-center p-8 relative">
                        <svg
                          width="160"
                          height="240"
                          viewBox="0 0 160 240"
                          className="opacity-40"
                        >
                          <rect x="40" y="50" width="80" height="140" fill="#374151" stroke="#374151" strokeWidth="3" rx="6" />
                          <ellipse cx="80" cy="50" rx="40" ry="12" fill="#374151" />
                          <rect x="45" y="195" width="70" height="30" fill="#374151" />
                          <circle cx="60" cy="90" r="12" fill="none" stroke="#374151" strokeWidth="3" />
                          <circle cx="100" cy="130" r="12" fill="none" stroke="#374151" strokeWidth="3" />
                          <line x1="70" y1="140" x2="100" y2="140" stroke="#374151" strokeWidth="4" />
                        </svg>
                        <span className="absolute bottom-12 text-gray-700 text-2xl font-bold tracking-wider">
                          VESSELS
                        </span>
                      </div>
                    </button>
                  </div>
                )}
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

              {/* Category Name - Bottom Right */}
              <div className="absolute bottom-4 right-4 z-10">
                <span className="text-xs text-gray-400 font-semibold tracking-wider">
                  {categoryNames[categoryId] || categoryId.toUpperCase()}
                </span>
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
