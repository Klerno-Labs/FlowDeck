'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';

export default function KnowledgeBasePage() {
  const router = useRouter();

  const articles = [
    {
      id: 'total-cost-of-filtration',
      title: 'Total Cost of Filtration',
      excerpt: 'What does it mean?',
      image: '/images/john-paraskeva.jpg',
    },
    {
      id: 'why-do-we-filter',
      title: 'Why do we filter?',
      excerpt: 'Understanding filtration importance',
      image: '/images/products/filter-vessel.png',
    },
  ];

  return (
    <div className="fixed inset-0 bg-ftc-lightBlue overflow-hidden">
      <div className="h-full w-full flex items-center justify-center p-8">
        {/* Main Tablet Container */}
        <div className="w-full max-w-6xl h-[90vh] relative z-20">
          {/* Tablet Frame */}
          <div className="bg-black rounded-[2.5rem] p-2 h-full">
            {/* Screen */}
            <div className="bg-white rounded-[2rem] overflow-hidden h-full flex flex-col relative">
              {/* Navigation - Bottom Right */}
              <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4">
                <button
                  onClick={() => router.push('/home')}
                  className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center"
                  aria-label="Home"
                >
                  <Home className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* Back Button - Top Left */}
              <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 z-20 p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>

              {/* FTC Logo - Top Center */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <Image
                  src="/logos/ftc/FTC_LogoNotag.png"
                  alt="FTC Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              </div>

              {/* Main Content */}
              <div className="h-full w-full p-12 pt-24 pb-20 overflow-y-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">Knowledge Base</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/knowledge-base/${article.id}`}
                      className="group no-underline"
                    >
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden touch-manipulation h-full border border-gray-200">
                        <div className="aspect-video overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                          <Image
                            src={article.image}
                            alt={article.title}
                            width={600}
                            height={338}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-gray-600">{article.excerpt}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Breadcrumb - Bottom Left */}
              <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 text-sm text-gray-500">
                <span>TOP</span>
                <span>/</span>
                <span className="font-semibold">KNOWLEDGE BASE</span>
              </div>
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
