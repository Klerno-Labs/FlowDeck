'use client';

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { Home } from 'lucide-react';

export default function ProductLineDetailPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId as string;
  const productLineId = params.productLineId as string;

  // Map category slugs to codes
  const categoryMap: Record<string, string> = {
    'liquid-solid': 'LS',
    'liquid-liquid': 'LL',
    'gas-liquid': 'GL',
    'gas-solid': 'GS',
  };

  const categoryCode = categoryMap[categoryId] || 'LS';
  const categoryName = categoryId.toUpperCase().replace('-', ' | ');

  // CLARIFY products - hardcoded for now
  const clarifyProducts = [
    {
      id: 'clarify-250',
      name: 'CLARIFY 250',
      image: '/images/products/clarify/Clarify430_B&W.png', // placeholder
    },
    {
      id: 'clarify-300',
      name: 'CLARIFY 300',
      image: '/images/products/clarify/Clarify430_B&W.png', // placeholder
    },
    {
      id: 'clarify-380',
      name: 'CLARIFY 380',
      image: '/images/products/clarify/Clarify430_B&W.png', // placeholder
    },
    {
      id: 'clarify-430',
      name: 'CLARIFY 430',
      image: '/images/products/clarify/Clarify430_B&W.png',
    },
    {
      id: 'clarify-500',
      name: 'CLARIFY 500',
      image: '/images/products/clarify/Clarify430_B&W.png', // placeholder
    },
    {
      id: 'clarify-740-premium',
      name: 'CLARIFY 740 Premium',
      image: '/images/products/clarify/pdp740_pair_full_B&W.png',
    },
    {
      id: 'clarify-740-platinum-select',
      name: 'CLARIFY 740 Platinum Select®',
      image: '/images/products/clarify/pss740_platinum_select_polypro_full_B&W.png',
    },
    {
      id: 'clarify-740-nsf',
      name: 'CLARIFY 740 Platinum Select® NSF/ANSI 61 Certified',
      image: '/images/products/clarify/pss740_platinum_select_polypro_full_B&W.png',
    },
    {
      id: 'clarify-940-platinum',
      name: 'CLARIFY 940 Platinum®',
      image: '/images/products/clarify/ps940_series_cellulose_full_B&W.png',
    },
    {
      id: 'clarify-2040-platinum',
      name: 'CLARIFY 2040 Platinum®',
      image: '/images/products/clarify/ps2040_sereis_full_cross_B&W.png',
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
            <div className="bg-[#9ca3af] rounded-[2rem] overflow-hidden h-full flex flex-col relative">
              {/* Top Left - Product Line Logo and Name */}
              <div className="absolute top-8 left-8 z-10 flex items-center gap-4">
                {/* Filtration Icon */}
                <div className="flex flex-col items-center">
                  <svg
                    width="60"
                    height="40"
                    viewBox="0 0 80 50"
                    className="mb-1"
                  >
                    <circle cx="15" cy="25" r="8" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="15" cy="25" r="3" fill="white" />
                    <circle cx="40" cy="25" r="10" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="40" cy="25" r="4" fill="white" />
                    <line x1="35" y1="25" x2="45" y2="25" stroke="white" strokeWidth="1.5" />
                    <line x1="40" y1="20" x2="40" y2="30" stroke="white" strokeWidth="1.5" />
                    <circle cx="65" cy="25" r="8" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="65" cy="25" r="3" fill="white" />
                    <line x1="23" y1="25" x2="32" y2="25" stroke="white" strokeWidth="1.5" />
                    <line x1="48" y1="25" x2="57" y2="25" stroke="white" strokeWidth="1.5" />
                  </svg>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-700">{categoryCode}</span>
                  </div>
                </div>

                {/* Product Line Name */}
                <div className="border-l-2 border-white pl-4">
                  <h1 className="text-2xl font-bold text-white tracking-wider">
                    {productLineId.toUpperCase()}
                  </h1>
                </div>
              </div>

              {/* Main Content - Products Grid */}
              <div className="h-full w-full p-8 pt-32 pb-24">
                <div className="grid grid-cols-5 grid-rows-2 gap-6 h-full">
                  {clarifyProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => router.push(`/products/${categoryId}/${productLineId}/${product.id}`)}
                      className="bg-transparent flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 touch-manipulation"
                    >
                      <div className="relative w-full h-full flex items-center justify-center mb-2">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={120}
                          height={180}
                          className="object-contain h-full w-auto"
                        />
                      </div>
                      <p className="text-white text-xs font-semibold text-center leading-tight">
                        {product.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* FTC Logo - Bottom Left */}
              <div className="absolute bottom-6 left-6 z-10">
                <Image
                  src="/logos/ftc/FTC_LogoNotag.png"
                  alt="FTC"
                  width={80}
                  height={30}
                  className="h-8 w-auto opacity-80"
                />
              </div>

              {/* Navigation - Bottom Right */}
              <div className="absolute bottom-6 right-6 z-10 flex items-center gap-4">
                <button
                  onClick={() => router.push('/home')}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center"
                  aria-label="Home"
                >
                  <Home className="w-5 h-5 text-white" />
                </button>
                <div className="text-white text-sm font-semibold tracking-wider">
                  <button onClick={() => router.push('/home')} className="hover:underline">TOP</button>
                  {' | '}
                  <button onClick={() => router.push('/products')} className="hover:underline">CAT</button>
                  {' | '}
                  <span>{categoryName}</span>
                </div>
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
