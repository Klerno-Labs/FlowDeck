'use client';

import { FlowDeckLayout } from '@/components/layout/FlowDeckLayout';
import Image from 'next/image';

export default function IntroductionPage() {
  return (
    <FlowDeckLayout showBackButton={true}>
      <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
        {/* Slide Container */}
        <div className="relative w-full max-w-6xl aspect-[16/10] bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Decorative circles - top right */}
          <div className="absolute top-8 right-8 flex gap-3">
            <div className="w-12 h-12 rounded-full bg-cyan-400 opacity-70"></div>
            <div className="w-12 h-12 rounded-full bg-blue-700 opacity-70"></div>
            <div className="w-12 h-12 rounded-full bg-green-500 opacity-70"></div>
          </div>

          {/* FTC Logo - top center */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
            <Image
              src="/logos/ftc/FTC_LogoNotag.png"
              alt="FTC Logo"
              width={160}
              height={53}
              className="h-12 w-auto"
              priority
            />
          </div>

          {/* Main Content */}
          <div className="h-full flex items-center gap-8 pt-20 pb-12 px-12">
            {/* Left Side - Image */}
            <div className="w-[40%] flex-shrink-0 flex items-center justify-center">
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/john-paraskeva.jpg"
                  alt="John Paraskeva"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold text-gray-800 mb-6 border-l-4 border-cyan-400 pl-4">
                Company Overview
              </h1>

              <div className="space-y-4 text-gray-700">
                <p className="text-sm leading-relaxed">
                  Founded by John Paraskeva in 1987, Filtration Technology Corporation (FTC)
                  started as a technical service company. Since then, FTC has evolved into a
                  vertically integrated manufacturer producing one industry&apos;s widest selections
                  of high-end industrial filtration products. Today FTC specializes in
                  innovative filter designs with developmental capabilities to provide custom
                  solutions in fluid removal, filtration and reclamation.
                </p>

                <div className="pt-4">
                  <p className="text-sm font-semibold text-gray-800 mb-3">
                    We offer a wide range of products, including:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 font-bold mr-2">•</span>
                      <span>Process clarification</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-700 font-bold mr-2">•</span>
                      <span>Process monitoring</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 font-bold mr-2">•</span>
                      <span>Efficient filtration</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 font-bold mr-2">•</span>
                      <span>Better process control</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 font-bold mr-2">•</span>
                      <span>Water treatment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative circles - bottom left */}
          <div className="absolute bottom-8 left-8 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 opacity-70"></div>
            <div className="w-8 h-8 rounded-full bg-blue-700 opacity-70"></div>
            <div className="w-8 h-8 rounded-full bg-green-500 opacity-70"></div>
          </div>

          {/* Colorful accent bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-2 flex">
            <div className="flex-1 bg-cyan-400"></div>
            <div className="flex-1 bg-blue-700"></div>
            <div className="flex-1 bg-green-500"></div>
            <div className="flex-1 bg-orange-500"></div>
          </div>
        </div>
      </div>
    </FlowDeckLayout>
  );
}
