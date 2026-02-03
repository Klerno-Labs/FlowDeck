import Link from 'next/link';
import { sanityClient } from '@/lib/sanity/client';
import { articlesQuery } from '@/lib/sanity/queries';
import { Article } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default async function KnowledgeBasePage() {
  const articles: Article[] = await sanityClient.fetch(articlesQuery);

  // Group by category
  const categories = [...new Set(articles.map((a) => a.category).filter(Boolean))];

  return (
    <div className="min-h-screen px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">Knowledge Base</h1>

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
                    <Link key={article._id} href={`/knowledge-base/${article.slug.current}`}>
                      <Card className="card-touch h-full">
                        {article.featuredImage && (
                          <div className="aspect-video overflow-hidden rounded-t-xl">
                            <img
                              src={article.featuredImage}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle>{article.title}</CardTitle>
                          <CardDescription>{article.excerpt}</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid grid-cols-1 ipad:grid-cols-2 gap-6">
            {articles.map((article) => (
              <Link key={article._id} href={`/knowledge-base/${article.slug.current}`}>
                <Card className="card-touch h-full">
                  {article.featuredImage && (
                    <div className="aspect-video overflow-hidden rounded-t-xl">
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>{article.excerpt}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
