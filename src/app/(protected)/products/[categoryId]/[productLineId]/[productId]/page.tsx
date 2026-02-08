import Image from 'next/image';
import Link from 'next/link';
import { Home, Download, Mail } from 'lucide-react';
import * as db from '@/lib/db/products';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Mapping of product lines to their specification sheet images
const specificationSheets: Record<string, string> = {
  'clarify': '/images/specifications/clarify-specs.jpg',
  'sieva': '/images/specifications/sieva-torrent-specs.jpg',
  'torrent': '/images/specifications/torrent-maxout-specs.jpg',
  'invicta': '/images/specifications/sieva-torrent-specs.jpg',
  'strata': '/images/specifications/clarify-specs.jpg',
  'cyphon': '/images/specifications/gas-specs.jpg',
  'tersus': '/images/specifications/seprum-tersus-specs.jpg',
  'seprum': '/images/specifications/seprum-tersus-specs.jpg',
  'vessels': '/images/specifications/clarify-specs.jpg', // Default for vessels
};

export default async function ProductDetailPage({
  params,
}: {
  params: { categoryId: string; productLineId: string; productId: string };
}) {
  const { categoryId, productLineId, productId } = params;

  // Temporarily bypass database to isolate rendering issue
  let productData = null;

  // TODO: Re-enable database query after testing
  // try {
  //   productData = await db.getProductBySlug(productId);
  // } catch (error) {
  //   console.error('Error fetching product:', error);
  //   productData = null;
  // }

  // Map category slugs to codes
  const categoryMap: Record<string, string> = {
    'liquid-solid': 'LS',
    'liquid-liquid': 'LL',
    'gas-liquid': 'GL',
    'gas-solid': 'GS',
  };

  const categoryCode = categoryMap[categoryId] || 'LS';

  // Map category to background colors
  const categoryColors: Record<string, string> = {
    'liquid-solid': 'bg-[#F17A2C]',
    'liquid-liquid': 'bg-[#00B4D8]',
    'gas-liquid': 'bg-[#4169E1]',
    'gas-solid': 'bg-[#7AC142]',
  };

  const bgColor = categoryColors[categoryId] || 'bg-gray-400';

  // Get the specification sheet for this product line
  const specSheet = specificationSheets[productLineId] || specificationSheets['clarify'];

  // Provide fallback data if product not in database
  const product = productData || {
    name: productId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    image_path: null,
  };

  return (
    <div className="fixed inset-0 bg-ftc-lightBlue overflow-hidden">
      <div className="h-full w-full flex items-center justify-center p-8">
        {/* Main Tablet Container */}
        <div className="w-full max-w-7xl h-[90vh] relative z-20">
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
                  <h2 className="text-3xl font-bold text-white tracking-wider drop-shadow-lg">
                    {productLineId.toUpperCase()}
                  </h2>
                </div>
              </div>

              {/* Top Right - Product Name */}
              <div className="absolute top-10 right-10 z-10 max-w-xl">
                <h1 className="text-4xl font-bold text-white tracking-wide text-right leading-tight drop-shadow-lg">
                  {product.name}
                </h1>
              </div>

              {/* Main Content - Product Details */}
              <div className="h-full w-full flex p-12 pt-32 pb-32 gap-10">
                {/* Left: Product Image */}
                <div className="w-[30%] flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/20">
                  {product.image_path ? (
                    <Image
                      src={product.image_path}
                      alt={product.name}
                      width={320}
                      height={450}
                      className="object-contain w-full h-auto max-h-[65vh] drop-shadow-2xl"
                    />
                  ) : (
                    <div className="text-white/50 text-center">No image</div>
                  )}
                </div>

                {/* Right: Specifications Sheet */}
                <div className="flex-1 overflow-y-auto bg-white/10 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/20">
                  <div className="bg-white rounded-2xl p-4 shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={specSheet}
                      alt={`${productLineId.toUpperCase()} Specifications`}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
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

              {/* Navigation & Actions - Bottom Right */}
              <div className="absolute bottom-8 right-8 z-10 flex items-center gap-4">
                <button
                  onClick={() => {/* PDF download functionality */}}
                  className="px-6 py-3 rounded-xl bg-white/90 hover:bg-white shadow-lg transition-all flex items-center gap-3"
                  aria-label="Download PDF"
                >
                  <Download className="w-5 h-5" style={{ color: bgColor.replace('bg-[', '').replace(']', '') }} />
                  <span className="font-bold text-sm" style={{ color: bgColor.replace('bg-[', '').replace(']', '') }}>PDF</span>
                </button>
                <button
                  onClick={() => {/* Email functionality */}}
                  className="px-6 py-3 rounded-xl bg-white/90 hover:bg-white shadow-lg transition-all flex items-center gap-3"
                  aria-label="Email Content"
                >
                  <Mail className="w-5 h-5" style={{ color: bgColor.replace('bg-[', '').replace(']', '') }} />
                  <span className="font-bold text-sm" style={{ color: bgColor.replace('bg-[', '').replace(']', '') }}>Email</span>
                </button>
                <Link
                  href="/home"
                  className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center"
                  aria-label="Home"
                >
                  <Home className="w-6 h-6" style={{ color: bgColor.replace('bg-[', '').replace(']', '') }} />
                </Link>
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
