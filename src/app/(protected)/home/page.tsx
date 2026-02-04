'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, Mail } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleAdminClick = () => {
    router.push('/admin/users');
  };

  const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'dev';

  return (
    <div className="fixed inset-0 bg-ftc-lightBlue overflow-hidden">
      {/* iPad Horizontal Optimized Container */}
      <div className="relative h-full w-full flex items-center justify-center">
        {/* Left Side Text - FTC FLOWDECK */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10">
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

        {/* Main Content Area - Optimized for iPad Landscape */}
        <div className="w-[95vw] h-[90vh] max-w-[1400px] max-h-[900px]">
          {/* Tablet Frame - iPad Aspect Ratio */}
          <div className="bg-black rounded-[2.5rem] p-2 h-full w-full overflow-hidden">
            {/* Screen */}
            <div className="bg-white rounded-[2rem] h-full flex flex-col relative">
              {/* Top Right Icons - Touch Optimized */}
              <div className="absolute top-4 right-4 flex gap-3 z-20">
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

              {/* Main Content - Vertically Centered */}
              <div className="flex-1 flex flex-col items-center justify-center px-12 py-8">
                {/* FTC Logo - Optimized Loading */}
                <div className="mb-6">
                  <Image
                    src="/logos/ftc/FTC_LogoNotag.png"
                    alt="FTC Logo"
                    width={280}
                    height={93}
                    className="h-20 w-auto"
                    priority
                    quality={90}
                  />
                </div>

                {/* Tagline */}
                <h1 className="text-gray-400 text-base tracking-[0.3em] mb-12 uppercase text-center">
                  Revolutionary Filtration Technology
                </h1>

                {/* Three Main Buttons - Touch Optimized */}
                <div className="flex gap-5 w-full max-w-[900px]">
                  <Link
                    href="/intro-presentation"
                    className="flex-1 py-5 px-8 text-center bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium uppercase tracking-wide transition-all touch-manipulation rounded-lg min-h-[60px] flex items-center justify-center no-underline cursor-pointer"
                  >
                    <span className="text-sm ipad:text-base whitespace-nowrap">Intro Presentation</span>
                  </Link>

                  <Link
                    href="/products"
                    className="flex-1 py-5 px-8 text-center bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium uppercase tracking-wide transition-all touch-manipulation rounded-lg min-h-[60px] flex items-center justify-center no-underline cursor-pointer"
                  >
                    <span className="text-sm ipad:text-base whitespace-nowrap">Products</span>
                  </Link>

                  <Link
                    href="/knowledge-base"
                    className="flex-1 py-5 px-8 text-center bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium uppercase tracking-wide transition-all touch-manipulation rounded-lg min-h-[60px] flex items-center justify-center no-underline cursor-pointer"
                  >
                    <span className="text-sm ipad:text-base whitespace-nowrap">Knowledge Base</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Bar - User Controls */}
              <div className="px-5 py-3 flex items-center justify-between bg-gray-50/80 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="font-medium">{session?.user?.name}</span>
                  <span className="text-gray-300">|</span>
                  <span className="capitalize px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                    {session?.user?.role}
                  </span>
                </div>
                <div className="flex gap-3">
                  {isAdmin && (
                    <button
                      onClick={handleAdminClick}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors touch-manipulation px-3 py-2 rounded hover:bg-gray-100 active:bg-gray-200"
                    >
                      User Management
                    </button>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors touch-manipulation px-3 py-2 rounded hover:bg-gray-100 active:bg-gray-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right Color Bars - Responsive */}
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
