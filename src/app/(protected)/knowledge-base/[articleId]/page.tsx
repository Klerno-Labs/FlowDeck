import { sanityClient } from '@/lib/sanity/client';
import { articleBySlugQuery } from '@/lib/sanity/queries';
import { Article } from '@/types';
import { PortableText } from '@portabletext/react';
import { FileText } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export default async function ArticlePage({ params }: { params: { articleId: string } }) {
  const article: Article = await sanityClient.fetch(articleBySlugQuery, {
    slug: params.articleId,
  });

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="min-h-screen px-8 py-8">
      <Breadcrumbs
        items={[
          { label: 'TOP', href: '/home' },
          { label: 'KNOWLEDGE BASE', href: '/knowledge-base' },
          { label: article.category?.toUpperCase() || 'ARTICLE' },
        ]}
      />

      <article className="max-w-4xl mx-auto py-8">
        {article.featuredImage && (
          <div className="aspect-video mb-8 rounded-xl overflow-hidden">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="text-5xl font-bold text-gray-900 mb-4">{article.title}</h1>

        {article.excerpt && (
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">{article.excerpt}</p>
        )}

        {article.content && (
          <div className="prose prose-lg max-w-none">
            <PortableText value={article.content} />
          </div>
        )}

        {/* Related PDFs */}
        {article.relatedPdfs && article.relatedPdfs.length > 0 && (
          <div className="mt-12 p-8 bg-ftc-gray-50 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Downloads</h2>
            <div className="grid grid-cols-1 ipad:grid-cols-2 gap-4">
              {article.relatedPdfs.map((pdf) => (
                <a
                  key={pdf._id}
                  href={pdf.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <FileText className="w-8 h-8 text-ftc-blue" />
                  <div>
                    <p className="font-semibold text-gray-900">{pdf.title}</p>
                    {pdf.description && (
                      <p className="text-sm text-gray-600">{pdf.description}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
