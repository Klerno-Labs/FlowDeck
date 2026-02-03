import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-8">
      {/* FTC Logo */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-32 h-32 bg-ftc-blue rounded-2xl flex items-center justify-center">
            <span className="text-6xl font-bold text-white">FTC</span>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <h1 className="text-2xl text-ftc-gray-400 tracking-wider mb-16 uppercase">
        Revolutionary Filtration Technology
      </h1>

      {/* Three Large Buttons */}
      <div className="flex gap-8 max-w-5xl w-full">
        <Link href="/intro-presentation" className="flex-1">
          <Button variant="secondary" size="xl" className="w-full h-24 text-xl">
            INTRO PRESENTATION
          </Button>
        </Link>

        <Link href="/products" className="flex-1">
          <Button variant="primary" size="xl" className="w-full h-24 text-xl">
            PRODUCTS
          </Button>
        </Link>

        <Link href="/knowledge-base" className="flex-1">
          <Button variant="secondary" size="xl" className="w-full h-24 text-xl">
            KNOWLEDGE BASE
          </Button>
        </Link>
      </div>
    </div>
  );
}
