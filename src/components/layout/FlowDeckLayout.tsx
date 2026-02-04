'use client';

import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Mail, ArrowLeft } from 'lucide-react';

interface FlowDeckLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  title?: string;
}

export function FlowDeckLayout({ children, showBackButton = false, title }: FlowDeckLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    if (paths.includes('intro-presentation')) {
      breadcrumbs.push('INTRO PRESENTATION');
    } else if (paths.includes('products')) {
      breadcrumbs.push('PRODUCTS');
    } else if (paths.includes('knowledge-base')) {
      breadcrumbs.push('KNOWLEDGE BASE');
    }

    return breadcrumbs.join(' | ');
  };

  return (
    <div className="fixed inset-0 bg-ftc-lightBlue overflow-hidden">
      <div className="h-full w-full flex items-center justify-center p-8">
        {/* Left Side Text - FTC FLOWDECK */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
          <div className="flex flex-col items-center gap-8">
            <div className="transform -rotate-90 origin-center">
              <span className="text-white text-[4.5vw] font-light tracking-[0.2em] opacity-90 whitespace-nowrap">
                FTC
              </span>
            </div>
            <div className="transform -rotate-90 origin-center -mt-16">
              <span className="text-white text-[7vw] font-light tracking-[0.15em] whitespace-nowrap">
                FLOWDECK
              </span>
            </div>
          </div>
        </div>

        {/* Main Tablet Container */}
        <div className="w-full max-w-6xl h-[90vh]">
          {/* Tablet Frame */}
          <div className="bg-black rounded-[2.5rem] p-2 h-full">
            {/* Screen */}
            <div className="bg-white rounded-[2rem] overflow-hidden h-full flex flex-col relative">
              {/* Top Navigation Bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                {/* Back Button */}
                {showBackButton && (
                  <button
                    onClick={() => router.back()}
                    className="p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                  </button>
                )}

                {/* Spacer */}
                {!showBackButton && <div />}

                {/* Right Icons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push('/home')}
                    className="p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Home"
                  >
                    <Home className="w-6 h-6 text-gray-400" />
                  </button>
                  <button
                    onClick={() => {/* Email functionality */}}
                    className="p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Email"
                  >
                    <Mail className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-auto pt-20 pb-16">
                {children}
              </div>

              {/* Bottom Breadcrumb Bar */}
              <div className="px-6 py-3 bg-gray-50/80 backdrop-blur-sm">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Home className="w-4 h-4" />
                    <span>TOP</span>
                    {getBreadcrumbs() && (
                      <>
                        <span>|</span>
                        <span className="font-medium text-gray-700">{getBreadcrumbs()}</span>
                      </>
                    )}
                  </div>
                  {title && (
                    <span className="text-gray-600 font-medium">{title}</span>
                  )}
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
