import Link from 'next/link';
import Image from 'next/image';
import { sanityClient } from '@/lib/sanity/client';
import { articlesQuery } from '@/lib/sanity/queries';
import { Article } from '@/types';
import { FlowDeckLayout } from '@/components/layout/FlowDeckLayout';

export default async function KnowledgeBasePage() {
  const articles: Article[] = await sanityClient.fetch(articlesQuery);

  // Group by category
  const categories = [...new Set(articles.map((a) => a.category).filter(Boolean))];

  return (
    <FlowDeckLayout>
      <div className="px-12 py-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Knowledge Base</h1>

        {categories.length > 0 ? (
          categories.map((category) => {
            const categoryArticles = articles.filter((a) => a.category === category);

            return (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 capitalize">
                  {category?.replace('-', ' ')}
                </h2>

                <div className="grid grid-cols-1 ipad:grid-cols-2 gap-6">
                  {categoryArticles.map((article) => (
                    <Link key={article._id} href={`/knowledge-base/${article.slug.current}`} className="group no-underline">
                      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 active:scale-95 overflow-hidden touch-manipulation h-full">
                        {article.featuredImage && (
                          <div className="aspect-video overflow-hidden">
                            <Image
                              src={article.featuredImage}
                              alt={article.title}
                              width={600}
                              height={338}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-gray-600 line-clamp-2">{article.excerpt}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid grid-cols-1 ipad:grid-cols-2 gap-6">
            {articles.map((article) => (
              <Link key={article._id} href={`/knowledge-base/${article.slug.current}`} className="group no-underline">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 active:scale-95 overflow-hidden touch-manipulation h-full">
                  {article.featuredImage && (
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        width={600}
                        height={338}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{article.excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </FlowDeckLayout>
  );
}
