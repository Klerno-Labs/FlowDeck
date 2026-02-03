import Link from 'next/link';
import { sanityClient } from '@/lib/sanity/client';
import { categoriesQuery } from '@/lib/sanity/queries';
import { Category } from '@/types';
import { CategoryCard } from '@/components/product/CategoryCard';

export default async function ProductsPage() {
  const categories: Category[] = await sanityClient.fetch(categoriesQuery);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-16">Select Filtration Type</h1>

      <div className="grid-categories max-w-4xl w-full">
        {categories.map((category) => (
          <Link key={category._id} href={`/products/${category.slug.current}`}>
            <CategoryCard category={category} />
          </Link>
        ))}
      </div>
    </div>
  );
}
