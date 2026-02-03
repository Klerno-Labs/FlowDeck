import Link from 'next/link';
import { sanityClient } from '@/lib/sanity/client';
import { productLinesByCategoryQuery, categoriesQuery } from '@/lib/sanity/queries';
import { ProductLine, Category } from '@/types';
import { ProductLineCard } from '@/components/product/ProductLineCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export default async function ProductLinesPage({
  params,
}: {
  params: { categoryId: string };
}) {
  // Get category info
  const categories: Category[] = await sanityClient.fetch(categoriesQuery);
  const category = categories.find((c) => c.slug.current === params.categoryId);

  if (!category) {
    return <div>Category not found</div>;
  }

  // Get product lines
  const productLines: ProductLine[] = await sanityClient.fetch(productLinesByCategoryQuery, {
    categoryId: category._id,
  });

  return (
    <div className="min-h-screen px-8 py-8">
      <Breadcrumbs
        items={[
          { label: 'TOP', href: '/home' },
          { label: category.code.toUpperCase() },
        ]}
      />

      <div className="flex flex-col items-center justify-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-16">{category.title}</h1>

        <div className="grid-product-lines max-w-6xl w-full">
          {productLines.map((line) => (
            <Link key={line._id} href={`/products/${params.categoryId}/${line.slug.current}`}>
              <ProductLineCard productLine={line} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
