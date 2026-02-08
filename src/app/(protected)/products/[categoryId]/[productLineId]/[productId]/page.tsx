import Image from 'next/image';
import Link from 'next/link';
import * as db from '@/lib/db/products';
import ProductActions from './ProductActions';

export default async function ProductDetailPage({
  params,
}: {
  params: { categoryId: string; productLineId: string; productId: string };
}) {
  const { categoryId, productLineId, productId } = params;

  // Fetch product with specifications from database
  let productData;
  try {
    productData = await db.getProductWithSpecsBySlug(productId);
  } catch (error) {
    console.error('Error fetching product:', error);
    productData = null;
  }

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
  const hexColor = bgColor.replace('bg-[', '').replace(']', '');

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
                  <span className="text-2xl font-bold" style={{ color: hexColor }}>
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

                {/* Right: Specifications */}
                <div className="flex-1 overflow-y-auto bg-white/10 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/20">
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Product Specifications</h3>
                    {productData?.specs && productData.specs.length > 0 ? (
                      <div className="space-y-4">
                        {productData.specs.map((spec, index) => {
                          let value;
                          try {
                            value = JSON.parse(spec.spec_value);
                          } catch {
                            value = spec.spec_value;
                          }

                          return (
                            <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                              <div className="font-semibold text-gray-900 mb-2">{spec.spec_key}</div>
                              <div className="text-gray-700">
                                {Array.isArray(value) ? (
                                  <ul className="list-disc list-inside space-y-1">
                                    {value.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>{String(value)}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500">No specifications available for this product.</p>
                    )}
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

              {/* Navigation & Actions - Bottom Right (Client Component) */}
              <ProductActions
                bgColor={bgColor}
                categoryId={categoryId}
                productLineId={productLineId}
              />
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
