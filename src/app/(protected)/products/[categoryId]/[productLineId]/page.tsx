import Image from 'next/image';
import Link from 'next/link';
import { Home } from 'lucide-react';
import * as db from '@/lib/db/products';

export default async function ProductLineDetailPage({
  params,
}: {
  params: { categoryId: string; productLineId: string };
}) {
  const { categoryId, productLineId } = params;

  // Fetch products from database
  // For vessels, we need to find the vessels product line for this specific category
  const products = productLineId === 'vessels'
    ? await db.getProductsByLineTitleAndCategory('Vessels', categoryId)
    : await db.getProductsByLineSlug(productLineId);

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

  // Filter out products without images
  const productList = products
    .filter(product => product.image_path && product.image_path.trim() !== '')
    .map((product) => ({
      id: product.slug,
      name: product.name,
      image: product.image_path!,
    }));

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
                    productList.length === 2 ? 'grid-cols-2' :
                    productList.length === 3 ? 'grid-cols-3' :
                    'grid-cols-2 grid-rows-2'
                  }`}>
                    {productList.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${categoryId}/${productLineId}/${product.id}`}
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
                      </Link>
                    ))}
                  </div>
                ) : (
                  /* Regular Products Layout - 5x2 grid */
                  <div className="grid grid-cols-5 grid-rows-2 gap-6 h-full">
                    {productList.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${categoryId}/${productLineId}/${product.id}`}
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
                      </Link>
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
