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

  // Product data by product line
  const productData: Record<string, Array<{ id: string; name: string; image: string }>> = {
    clarify: [
      {
        id: 'clarify-250',
        name: 'CLARIFY 250',
        image: '/images/products/clarify/Clarify430_B&W.png',
      },
      {
        id: 'clarify-300',
        name: 'CLARIFY 300',
        image: '/images/products/clarify/Clarify430_B&W.png',
      },
      {
        id: 'clarify-380',
        name: 'CLARIFY 380',
        image: '/images/products/clarify/Clarify430_B&W.png',
      },
      {
        id: 'clarify-430',
        name: 'CLARIFY 430',
        image: '/images/products/clarify/Clarify430_B&W.png',
      },
      {
        id: 'clarify-500',
        name: 'CLARIFY 500',
        image: '/images/products/clarify/Clarify430_B&W.png',
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
    ],
    sieva: [
      {
        id: 'sieva-100',
        name: 'SIEVA 100 Series',
        image: '/images/products/sieva/sieva_100.jpg',
      },
      {
        id: 'sieva-550',
        name: 'SIEVA 550 Series',
        image: '/images/products/sieva/sieva_550.jpg',
      },
      {
        id: 'sieva-600-ht',
        name: 'SIEVA 600 HT Series',
        image: '/images/products/sieva/sieva_600ht.jpg',
      },
      {
        id: 'sieva-650',
        name: 'SIEVA 650 Series',
        image: '/images/products/sieva/sieva_650.jpg',
      },
      {
        id: 'sieva-maxout',
        name: 'SIEVA Max Out Series',
        image: '/images/products/sieva/sieva_maxout.jpg',
      },
      {
        id: 'sieva-maxout-basket',
        name: 'SIEVA Max-Out Basket',
        image: '/images/products/sieva/sieva_maxout_basket.jpg',
      },
    ],
    torrent: [
      {
        id: 'torrent-600',
        name: 'TORRENT 600 Series',
        image: '/images/products/torrent/torrent_600.jpg',
      },
      {
        id: 'torrent-700',
        name: 'TORRENT 700 Series',
        image: '/images/products/torrent/torrent_700.jpg',
      },
    ],
    invicta: [
      {
        id: 'invicta-ab-series',
        name: 'INVICTA AB Series',
        image: '/images/products/invicta/ab_series_SOE_222_full_B&W.png',
      },
      {
        id: 'invicta-ab500',
        name: 'INVICTA AB500 Series',
        image: '/images/products/invicta/ab500_series_pair_full_B&W.png',
      },
      {
        id: 'invicta-abp',
        name: 'INVICTA ABP Series',
        image: '/images/products/invicta/abp_series_full_1_B&W.png',
      },
      {
        id: 'invicta-aby',
        name: 'INVICTA ABY Series',
        image: '/images/products/invicta/aby_series_full_2_B&W.png',
      },
    ],
    strata: [
      {
        id: 'strata-37',
        name: 'STRATA 37 Series',
        image: '/images/products/strata/strata_37_B&W.png',
      },
      {
        id: 'strata-60',
        name: 'STRATA 60 Series',
        image: '/images/products/strata/strata_60_B&W.png',
      },
      {
        id: 'strata-emerald-240',
        name: 'STRATA Emerald 240 Series',
        image: '/images/products/strata/strata_emerald_240_B&W.png',
      },
      {
        id: 'strata-emerald-740',
        name: 'STRATA Emerald 740 Series',
        image: '/images/products/strata/strata_emerald_740_B&W.png',
      },
    ],
    cyphon: [
      {
        id: 'cyphon-28',
        name: 'CYPHON 28 Series',
        image: '/images/products/cyphon/cyphon_28_B&W.png',
      },
      {
        id: 'cyphon-45',
        name: 'CYPHON 45 Series',
        image: '/images/products/cyphon/cyphon_45_B&W.png',
      },
      {
        id: 'cyphon-47',
        name: 'CYPHON 47 Series',
        image: '/images/products/cyphon/cyphon_47_B&W.png',
      },
      {
        id: 'cyphon-55',
        name: 'CYPHON 55 Series',
        image: '/images/products/cyphon/cyphon_55_B&W.png',
      },
      {
        id: 'cyphon-60',
        name: 'CYPHON 60 Series',
        image: '/images/products/cyphon/cyphon_60_B&W.png',
      },
    ],
    tersus: [
      {
        id: 'tersus-380',
        name: 'TERSUS 380 Series',
        image: '/images/products/tersus/tersus_380_B&W.png',
      },
      {
        id: 'tersus-450',
        name: 'TERSUS 450 Series',
        image: '/images/products/tersus/tersus_450_B&W.png',
      },
      {
        id: 'tersus-600',
        name: 'TERSUS 600 Series',
        image: '/images/products/tersus/tersus_600_B&W.png',
      },
    ],
    seprum: [
      {
        id: 'seprum-450',
        name: 'SEPRUM 450 Series',
        image: '/images/products/seprum/seprum_450_B&W.png',
      },
    ],
  };

  // Category-specific vessels data
  const vesselsByCategory: Record<string, Array<{ id: string; name: string; image: string }>> = {
    'liquid-solid': [
      {
        id: 'clarify-vessels',
        name: 'Clarify Cartridge Filter Vessels',
        image: '/images/products/vessels/clarify_vessels.jpg',
      },
      {
        id: 'sieva-vessels',
        name: 'Sieva Bag Filter Vessels',
        image: '/images/products/vessels/sieva_vessels.jpg',
      },
      {
        id: 'torrent-vessels',
        name: 'Torrent High Flow Vessels',
        image: '/images/products/vessels/torrent_vessels.jpg',
      },
      {
        id: 'invicta-vessels',
        name: 'Invicta Filter Vessels',
        image: '/images/products/vessels/invicta_vessels.jpg',
      },
    ],
    'liquid-liquid': [
      {
        id: 'strata-emerald-absorption-vessels',
        name: 'STRATA Emerald Hydrocarbon Absorption Vessels',
        image: '/images/products/vessels/strata_emerald_absorption.jpg',
      },
      {
        id: 'strata-coalescer-vessels',
        name: 'STRATA Liquid-Liquid Coalescer Vessels',
        image: '/images/products/vessels/strata_coalescer.jpg',
      },
    ],
    'gas-liquid': [
      {
        id: 'cyphon-gas-coalescer-vessels',
        name: 'CYPHON Gas Coalescer Vessels',
        image: '/images/products/vessels/cyphon_coalescer.jpg',
      },
    ],
    'gas-solid': [
      {
        id: 'tersus-gas-filtration-vessels',
        name: 'TERSUS Gas Filtration Vessels',
        image: '/images/products/vessels/tersus_gas_filtration.jpg',
      },
      {
        id: 'seprum-gas-filtration-vessels',
        name: 'SEPRUM Gas Filtration Vessels',
        image: '/images/products/vessels/seprum_gas_filtration.jpg',
      },
    ],
  };

  // Get products based on product line and category
  let products: Array<{ id: string; name: string; image: string }> = [];
  if (productLineId === 'vessels') {
    products = vesselsByCategory[categoryId] || [];
  } else {
    products = productData[productLineId] || [];
  }

  // Map category to background colors
  const categoryColors: Record<string, string> = {
    'liquid-solid': 'bg-[#F17A2C]',
    'liquid-liquid': 'bg-[#00B4D8]',
    'gas-liquid': 'bg-[#4169E1]',
    'gas-solid': 'bg-[#7AC142]',
  };

  const bgColor = categoryColors[categoryId] || 'bg-gray-400';

  return (
    <div className="fixed inset-0 bg-ftc-lightBlue overflow-hidden">
      <div className="h-full w-full flex items-center justify-center p-8">
        {/* Main Tablet Container */}
        <div className="w-full max-w-6xl h-[90vh] relative z-20">
          {/* Tablet Frame */}
          <div className="bg-black rounded-[2.5rem] p-2 h-full">
            {/* Screen */}
            <div className={`${bgColor} rounded-[2rem] overflow-hidden h-full flex flex-col relative`}>
              {/* Top Left - Product Line Logo and Name */}
              <div className="absolute top-10 left-10 z-10 flex items-center gap-6">
                {/* Category Badge */}
                <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <span className="text-2xl font-bold" style={{ color: bgColor.replace('bg-[', '').replace(']', '') }}>
                    {categoryCode}
                  </span>
                </div>

                {/* Product Line Name */}
                <div className="border-l-4 border-white/50 pl-6">
                  <h1 className="text-4xl font-bold text-white tracking-wider drop-shadow-lg">
                    {productLineId.toUpperCase()}
                  </h1>
                </div>
              </div>

              {/* Main Content - Products Grid */}
              <div className="h-full w-full p-12 pt-32 pb-28">
                {productLineId === 'vessels' ? (
                  /* Vessels Layout - Larger grid for fewer items */
                  <div className={`grid gap-10 h-full ${
                    products.length === 2 ? 'grid-cols-2' :
                    products.length === 3 ? 'grid-cols-3' :
                    'grid-cols-2 grid-rows-2'
                  }`}>
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => router.push(`/products/${categoryId}/${productLineId}/${product.id}`)}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105 hover:bg-white/20 active:scale-95 touch-manipulation p-6 border-2 border-white/20"
                      >
                        <div className="relative w-full h-full flex items-center justify-center mb-4">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={300}
                            height={400}
                            className="object-contain h-full w-auto max-h-[50vh] drop-shadow-xl"
                          />
                        </div>
                        <p className="text-white text-base font-bold text-center leading-tight drop-shadow-lg">
                          {product.name}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Regular Products Layout - 5x2 grid */
                  <div className="grid grid-cols-5 grid-rows-2 gap-6 h-full">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => router.push(`/products/${categoryId}/${productLineId}/${product.id}`)}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105 hover:bg-white/20 active:scale-95 touch-manipulation p-4 border-2 border-white/20"
                      >
                        <div className="relative w-full h-full flex items-center justify-center mb-3">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={140}
                            height={200}
                            className="object-contain h-full w-auto drop-shadow-xl"
                          />
                        </div>
                        <p className="text-white text-xs font-bold text-center leading-tight drop-shadow-lg">
                          {product.name}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* FTC Logo - Bottom Left */}
              <div className="absolute bottom-8 left-8 z-10">
                <Image
                  src="/logos/ftc/FTC_LogoNotag.png"
                  alt="FTC"
                  width={100}
                  height={40}
                  className="h-10 w-auto opacity-90 drop-shadow-lg"
                />
              </div>

              {/* Navigation - Bottom Right */}
              <div className="absolute bottom-8 right-8 z-10 flex items-center gap-4">
                <button
                  onClick={() => router.push('/home')}
                  className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center"
                  aria-label="Home"
                >
                  <Home className="w-6 h-6" style={{ color: bgColor.replace('bg-[', '').replace(']', '') }} />
                </button>
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
