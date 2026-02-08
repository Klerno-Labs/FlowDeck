'use client';

import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function WhyDoWeFilterPage() {
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

              {/* Left Panel - Product Image */}
              <div className="w-1/2 relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-12">
                <Image
                  src="/images/products/filter-vessel.png"
                  alt="Filter Vessel"
                  width={400}
                  height={600}
                  className="object-contain w-full h-auto max-h-[80vh] drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Right Panel - Article Content */}
              <div className="w-1/2 p-12 overflow-y-auto flex flex-col">
                {/* FTC Logo */}
                <div className="mb-12 flex justify-center">
                  <Image
                    src="/logos/ftc/FTC_LogoNotag.png"
                    alt="FTC Logo"
                    width={100}
                    height={40}
                    className="h-12 w-auto"
                    priority
                  />
                </div>

                {/* Article Content */}
                <div className="space-y-8 flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
                    Why do we filter?
                  </h1>

                  <ul className="space-y-4 text-gray-700 text-lg">
                    <li className="flex items-start">
                      <span className="mr-3 mt-2 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Removal of Unwanted Contaminants</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-2 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Ensure better life/quality (Product must meet the LossLoadable Powder Specification)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-2 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Protection of equipment (turbines, electric grids, etc.)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-2 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Recovery of Manufactured Product (Minimum Cakewash Necessary)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-2 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Reduce Operating Costs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-2 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>Protect downstream equipment (Plugged)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-2 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span className="text-sm">(Exchangers, Pumps, Tower Trays, Spray Nozzles, Control Valves, etc.)</span>
                    </li>
                  </ul>
                </div>

                {/* Decorative circles - matching screenshot */}
                <div className="absolute top-8 right-8 flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>
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
