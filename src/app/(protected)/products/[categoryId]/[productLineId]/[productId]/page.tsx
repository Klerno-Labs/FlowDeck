import Image from 'next/image';
import { sanityClient } from '@/lib/sanity/client';
import { productDetailQuery } from '@/lib/sanity/queries';
import { Product } from '@/types';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { EmailSection } from '@/components/product/EmailSection';

export default async function ProductDetailPage({
  params,
}: {
  params: { categoryId: string; productLineId: string; productId: string };
}) {
  const product: Product = await sanityClient.fetch(productDetailQuery, {
    slug: params.productId,
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Above the fold - Product Image + Specs */}
      <div className="px-8 py-8">
        <Breadcrumbs
          items={[
            { label: 'TOP', href: '/home' },
            { label: 'CAT', href: '/products' },
            { label: 'PROD', href: `/products/${params.categoryId}` },
            {
              label: product.productLine?.category?.code?.toUpperCase() || '',
              href: `/products/${params.categoryId}/${params.productLineId}`,
            },
          ]}
        />

        <div className="grid grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Left: Product Image */}
          <div className="flex items-center justify-center">
            {product.imageColor && (
              <Image
                src={product.imageColor}
                alt={product.title}
                width={500}
                height={700}
                className="object-contain"
              />
            )}
          </div>

          {/* Right: Specifications Table */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">{product.title}</h1>

            <table className="spec-table">
              <tbody>
                {product.commonMarkets && product.commonMarkets.length > 0 && (
                  <tr>
                    <td>Common Markets</td>
                    <td>{product.commonMarkets.join(', ')}</td>
                  </tr>
                )}
                {product.applications && (
                  <tr>
                    <td>Common Applications</td>
                    <td>{product.applications}</td>
                  </tr>
                )}
                {product.flowDirection && (
                  <tr>
                    <td>Flow Direction</td>
                    <td>{product.flowDirection}</td>
                  </tr>
                )}
                {product.micronRatings && (
                  <tr>
                    <td>Micron Ratings</td>
                    <td>{product.micronRatings}</td>
                  </tr>
                )}
                {product.standardEfficiency && (
                  <tr>
                    <td>Standard Efficiency Rating</td>
                    <td>{product.standardEfficiency}</td>
                  </tr>
                )}
                {product.mediaOptions && product.mediaOptions.length > 0 && (
                  <tr>
                    <td>Standard Media Material Options</td>
                    <td>{product.mediaOptions.join(', ')}</td>
                  </tr>
                )}
                {product.hardwareOptions && product.hardwareOptions.length > 0 && (
                  <tr>
                    <td>Hardware Options</td>
                    <td>{product.hardwareOptions.join(', ')}</td>
                  </tr>
                )}
                {product.diameter && (
                  <tr>
                    <td>Diameter (inches)</td>
                    <td>{product.diameter}</td>
                  </tr>
                )}
                {product.standardLengths && (
                  <tr>
                    <td>Standard Lengths</td>
                    <td>{product.standardLengths}</td>
                  </tr>
                )}
                {(product.flowRateMin || product.flowRateMax) && (
                  <tr>
                    <td>Recommended flow rate for optimal Dirt Loading</td>
                    <td>
                      {product.flowRateMin && `${product.flowRateMin} gpm`}
                      {product.flowRateMax && `, ${product.flowRateMax} m³/hr`}
                    </td>
                  </tr>
                )}
                {(product.dirtLoadingMin || product.dirtLoadingMax) && (
                  <tr>
                    <td>Dirt Loading (lbs, grams)</td>
                    <td>
                      {product.dirtLoadingMin && `Up to ${product.dirtLoadingMin} lbs`}
                      {product.dirtLoadingMax && `, Up to ${product.dirtLoadingMax} grams`}
                    </td>
                  </tr>
                )}
                {product.surfaceArea && (
                  <tr>
                    <td>Surface Area (ft², m²)</td>
                    <td>{product.surfaceArea}</td>
                  </tr>
                )}
                {product.maxDifferentialPressure && (
                  <tr>
                    <td>Max Recommended Differential Pressure (PSID, bar)</td>
                    <td>{product.maxDifferentialPressure}</td>
                  </tr>
                )}
                {product.vesselTechnology && (
                  <tr>
                    <td>Vessel Technology</td>
                    <td>{product.vesselTechnology}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Below the fold - Email Section */}
      <EmailSection product={product} />

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="text-center text-ftc-gray-400 text-sm uppercase tracking-wider">
          INTRO PRESENTATION | PRODUCTS | KNOWLEDGE BASE
        </div>
      </div>
    </div>
  );
}
