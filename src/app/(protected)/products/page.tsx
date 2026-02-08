'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FlowDeckPage } from '@/components/layout/FlowDeckPage';

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
    <FlowDeckPage
      section="products"
      showHome={true}
      showBack={true}
      logoPosition="bottom-left"
      logoSize="sm"
    >
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
                    className="h-36 w-auto drop-shadow-2xl brightness-0 invert"
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
                    className="h-36 w-auto drop-shadow-2xl brightness-0 invert"
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
                    className="h-36 w-auto drop-shadow-2xl brightness-0 invert"
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
                    className="h-36 w-auto drop-shadow-2xl brightness-0 invert"
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
    </FlowDeckPage>
  );
}
