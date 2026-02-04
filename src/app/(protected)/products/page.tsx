import Link from 'next/link';
import { sanityClient } from '@/lib/sanity/client';
import { categoriesQuery } from '@/lib/sanity/queries';
import { Category } from '@/types';
import { CategoryCard } from '@/components/product/CategoryCard';
import { FlowDeckLayout } from '@/components/layout/FlowDeckLayout';

export default async function ProductsPage() {
  const categories: Category[] = await sanityClient.fetch(categoriesQuery);

  return (
    <FlowDeckLayout showBackButton={true}>
      <div className="flex flex-col items-center justify-center px-12 py-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Select Filtration Type</h1>

        <div className="grid-categories max-w-4xl w-full">
          {categories.map((category) => (
            <Link key={category._id} href={`/products/${category.slug.current}`} className="no-underline">
              <CategoryCard category={category} />
            </Link>
          ))}
        </div>
      </div>
    </FlowDeckLayout>
  );
}
