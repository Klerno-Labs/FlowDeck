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
    <div className="min-h-screen bg-ftc-lightBlue flex items-center justify-center p-8 relative">
      {/* Left Side Text - FTC FLOWDECK */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="flex flex-col items-start space-y-2">
          <div className="transform -rotate-90 origin-center whitespace-nowrap">
            <span className="text-white text-[80px] font-light tracking-[0.2em] opacity-90">
              FTC
            </span>
          </div>
          <div className="transform -rotate-90 origin-center whitespace-nowrap -ml-8">
            <span className="text-white text-[120px] font-light tracking-[0.15em]">
              FLOWDECK
            </span>
          </div>
        </div>
      </div>

      {/* Main Tablet Container */}
      <div className="relative w-full max-w-6xl">
        {/* Tablet Frame */}
        <div className="bg-black rounded-[3rem] p-4 shadow-2xl">
          {/* Screen */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden min-h-[600px] flex flex-col relative">
            {/* Top Right Icons */}
            <div className="absolute top-6 right-6 flex gap-4 z-10">
              <button
                onClick={() => router.push('/home')}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Home"
              >
                <Home className="w-6 h-6 text-gray-400" />
              </button>
              <button
                onClick={() => {/* Email functionality */}}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-16 py-12">
              {/* FTC Logo */}
              <div className="mb-8">
                <Image
                  src="/logos/ftc/FTC_LogoNotag.png"
                  alt="FTC Logo"
                  width={300}
                  height={100}
                  className="h-24 w-auto"
                  priority
                />
              </div>

              {/* Tagline */}
              <h1 className="text-gray-400 text-lg tracking-[0.3em] mb-16 uppercase text-center">
                Revolutionary Filtration Technology
              </h1>

              {/* Three Main Buttons */}
              <div className="flex gap-6 w-full max-w-3xl">
                <Link
                  href="/intro-presentation"
                  className="flex-1 py-6 px-8 text-center bg-gray-100 hover:bg-gray-200 text-gray-600 uppercase tracking-wider transition-colors rounded-md border border-gray-300"
                >
                  Intro Presentation
                </Link>

                <Link
                  href="/products"
                  className="flex-1 py-6 px-8 text-center bg-gray-100 hover:bg-gray-200 text-gray-600 uppercase tracking-wider transition-colors rounded-md border border-gray-300"
                >
                  Products
                </Link>

                <Link
                  href="/knowledge-base"
                  className="flex-1 py-6 px-8 text-center bg-gray-100 hover:bg-gray-200 text-gray-600 uppercase tracking-wider transition-colors rounded-md border border-gray-300"
                >
                  Knowledge Base
                </Link>
              </div>
            </div>

            {/* Bottom Navigation/Admin Controls */}
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Welcome, {session?.user?.name}</span>
                <span className="text-gray-300">|</span>
                <span className="capitalize text-blue-600">{session?.user?.role}</span>
              </div>
              <div className="flex gap-4">
                {isAdmin && (
                  <button
                    onClick={handleAdminClick}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    User Management
                  </button>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Color Bars */}
      <div className="absolute bottom-0 right-0 flex h-16 w-[600px]">
        <div className="flex-1 bg-orange-500"></div>
        <div className="flex-1 bg-blue-700"></div>
        <div className="flex-1 bg-green-500"></div>
        <div className="flex-1 bg-cyan-400"></div>
      </div>
    </div>
  );
}
