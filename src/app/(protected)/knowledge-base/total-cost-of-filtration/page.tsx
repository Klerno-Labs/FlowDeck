'use client';

import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function TotalCostOfFiltrationPage() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-ftc-lightBlue overflow-hidden">
      <div className="h-full w-full flex items-center justify-center p-8">
        {/* Main Tablet Container */}
        <div className="w-full max-w-6xl h-[90vh] relative z-20">
          {/* Tablet Frame */}
          <div className="bg-black rounded-[2.5rem] p-2 h-full">
            {/* Screen */}
            <div className="bg-white rounded-[2rem] overflow-hidden h-full flex relative">
              {/* Navigation - Bottom Right */}
              <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4">
                <button
                  onClick={() => router.push('/knowledge-base')}
                  className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center"
                  aria-label="Back to knowledge base"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  onClick={() => router.push('/home')}
                  className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center"
                  aria-label="Home"
                >
                  <Home className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* Left Panel - Article Content */}
              <div className="w-1/2 p-12 overflow-y-auto">
                {/* FTC Logo */}
                <div className="mb-8">
                  <Image
                    src="/logos/ftc/FTC_LogoNotag.png"
                    alt="FTC Logo"
                    width={80}
                    height={40}
                    className="h-10 w-auto"
                    priority
                  />
                </div>

                {/* Article Content */}
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    Total Cost of Filtration:
                  </h1>
                  <h2 className="text-2xl text-gray-600">What does it mean?</h2>

                  <ul className="space-y-3 text-gray-700 mt-8">
                    <li className="flex items-start">
                      <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Initial equipment prices for cartridges</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Differential pressure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Downtime</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Labor</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Disposal</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Shipping</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Warehousing cost and handling</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Transactional cost</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Financial product quality</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Impact on downstream equipment</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Panel - Featured Image with Quote */}
              <div className="w-1/2 relative bg-gray-900">
                <Image
                  src="/images/john-paraskeva.jpg"
                  alt="Total Cost of Filtration"
                  fill
                  className="object-cover"
                  priority
                />

                {/* Quote Overlay */}
                <div className="absolute top-8 left-8 right-8">
                  <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-start gap-3">
                      <div className="text-white/60 text-4xl leading-none">&ldquo;</div>
                      <div>
                        <p className="text-white text-lg font-medium leading-relaxed">
                          There&apos;s always<br />
                          someone who will<br />
                          do it cheaper.&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Play Button (Video Preview) */}
                <button className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center hover:bg-white/30 transition-all">
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
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
