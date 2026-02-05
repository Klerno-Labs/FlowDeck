'use client';

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { Home, Download, Mail } from 'lucide-react';
import { productSpecs } from '@/data/productSpecs';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId as string;
  const productLineId = params.productLineId as string;
  const productId = params.productId as string;

  // Map category slugs to codes
  const categoryMap: Record<string, string> = {
    'liquid-solid': 'LS',
    'liquid-liquid': 'LL',
    'gas-liquid': 'GL',
    'gas-solid': 'GS',
  };

  const categoryCode = categoryMap[categoryId] || 'LS';
  const categoryName = categoryId.toUpperCase().replace('-', ' | ');

  const product = productSpecs[productId] || {
    name: productId.toUpperCase().replace(/-/g, ' '),
    image: '/images/products/clarify/Clarify430_B&W.png',
    specs: {},
  };

  return (
    <div className="fixed inset-0 bg-ftc-lightBlue overflow-hidden">
      <div className="h-full w-full flex items-center justify-center p-8">
        {/* Main Tablet Container */}
        <div className="w-full max-w-7xl h-[90vh] relative z-20">
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
                  <h2 className="text-2xl font-bold text-white tracking-wider">
                    {productLineId.toUpperCase()}
                  </h2>
                </div>
              </div>

              {/* Top Right - Product Name */}
              <div className="absolute top-8 right-8 z-10 max-w-md">
                <h1 className="text-3xl font-bold text-white tracking-wide text-right leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Main Content - Product Details */}
              <div className="h-full w-full flex p-8 pt-28 pb-24 gap-8">
                {/* Left: Product Image */}
                <div className="w-[28%] flex items-center justify-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={280}
                    height={400}
                    className="object-contain w-full h-auto max-h-[60vh]"
                  />
                </div>

                {/* Right: Specifications */}
                <div className="flex-1 overflow-y-auto pr-4">
                  <div className="space-y-3 text-white">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-[45%_55%] gap-4 text-sm">
                        <div className="font-semibold text-right pr-4">
                          {key}
                        </div>
                        <div className="pl-4 border-l-2 border-white/20">
                          {Array.isArray(value) ? (
                            <div className="space-y-0.5">
                              {value.map((item, idx) => (
                                <div key={idx}>{item}</div>
                              ))}
                            </div>
                          ) : (
                            String(value)
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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

              {/* Navigation & Actions - Bottom Right */}
              <div className="absolute bottom-6 right-6 z-10 flex items-center gap-3">
                <button
                  onClick={() => {/* PDF download functionality */}}
                  className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all flex items-center gap-2"
                  aria-label="Download PDF"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-semibold">PDF</span>
                </button>
                <button
                  onClick={() => {/* Email functionality */}}
                  className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all flex items-center gap-2"
                  aria-label="Email Content"
                >
                  <Mail className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-semibold">Email Content</span>
                </button>
                <button
                  onClick={() => router.push('/home')}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center"
                  aria-label="Home"
                >
                  <Home className="w-5 h-5 text-white" />
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
