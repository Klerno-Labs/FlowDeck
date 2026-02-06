import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Package, Layers, Settings } from 'lucide-react';
import { ToastContainer } from '@/components/ui/Toast';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="fixed inset-0 bg-ftc-lightBlue overflow-hidden">
      <ToastContainer />
      <div className="h-full w-full flex items-center justify-center p-8">
        {/* Main Tablet Container - Optimized for iPad (2048x1536) */}
        <div className="w-full max-w-[1920px] h-[95vh] relative z-20">
          {/* Tablet Frame */}
          <div className="bg-black rounded-[2.5rem] p-2 h-full shadow-2xl">
            {/* Screen */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-[2rem] overflow-hidden h-full flex flex-col relative">

              {/* Top Navigation Bar with Gradient */}
              <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-lg">
                <div className="px-8 py-6">
                  <div className="flex justify-between items-center">
                    {/* Left: Logo and Nav */}
                    <div className="flex items-center gap-8">
                      <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                          <Settings className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-3xl font-bold text-white tracking-wide drop-shadow-lg">
                          FlowDeck Admin
                        </span>
                      </Link>

                      {/* Navigation Tabs */}
                      <div className="flex items-center gap-2 ml-8">
                        <NavTab href="/admin" icon={<Home className="w-5 h-5" />} label="Dashboard" />
                        <NavTab href="/admin/products" icon={<Package className="w-5 h-5" />} label="Products" />
                        <NavTab href="/admin/categories" icon={<Layers className="w-5 h-5" />} label="Categories" />
                        <NavTab href="/admin/product-lines" icon={<Layers className="w-5 h-5" />} label="Product Lines" />
                      </div>
                    </div>

                    {/* Right: User Info and Exit */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-white/90">{session.user.name}</div>
                        <div className="text-xs text-white/70">{session.user.role}</div>
                      </div>
                      <Link
                        href="/home"
                        className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center group"
                        title="Exit to App"
                      >
                        <Home className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area with Scroll */}
              <div className="flex-1 overflow-y-auto">
                <main className="p-10">
                  {children}
                </main>
              </div>

              {/* FTC Logo - Bottom Left */}
              <div className="absolute bottom-8 left-8 z-10">
                <Image
                  src="/logos/ftc/FTC_LogoNotag.png"
                  alt="FTC"
                  width={100}
                  height={40}
                  className="h-10 w-auto opacity-60 drop-shadow-lg"
                />
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

function NavTab({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all border border-white/20 hover:border-white/30 active:scale-95 touch-manipulation"
    >
      <span className="text-white/90">{icon}</span>
      <span className="text-sm font-bold text-white tracking-wide">{label}</span>
    </Link>
  );
}
