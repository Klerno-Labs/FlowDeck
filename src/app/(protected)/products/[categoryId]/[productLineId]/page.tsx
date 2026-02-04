import Link from 'next/link';
import { sanityClient } from '@/lib/sanity/client';
import { productsByLineQuery, categoriesQuery, productLinesByCategoryQuery } from '@/lib/sanity/queries';
import { Product, Category, ProductLine } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export default async function ProductsGridPage({
  params,
}: {
  params: { categoryId: string; productLineId: string };
}) {
  // Get category and product line info
  const categories: Category[] = await sanityClient.fetch(categoriesQuery);
  const category = categories.find((c) => c.slug.current === params.categoryId);

  if (!category) {
    return <div>Category not found</div>;
  }

  const productLines: ProductLine[] = await sanityClient.fetch(productLinesByCategoryQuery, {
    categoryId: category._id,
  });
  const productLine = productLines.find((pl) => pl.slug.current === params.productLineId);

  if (!productLine) {
    return <div>Product line not found</div>;
  }

  // Get products
  const products: Product[] = await sanityClient.fetch(productsByLineQuery, {
    productLineId: productLine._id,
  });

  return (
    <div className="min-h-screen px-8 py-8">
      <Breadcrumbs
        items={[
          { label: 'TOP', href: '/home' },
          { label: 'CAT', href: '/products' },
          { label: category.code.toUpperCase(), href: `/products/${params.categoryId}` },
          { label: productLine.title },
        ]}
      />

      <div className="flex flex-col items-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-16">{productLine.title}</h1>

        <div className="grid-products max-w-7xl w-full">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/products/${params.categoryId}/${params.productLineId}/${product.slug.current}`}
              className="no-underline"
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
