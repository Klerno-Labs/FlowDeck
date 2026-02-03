'use client';

import Image from 'next/image';
import { ProductLine } from '@/types';
import { motion } from 'framer-motion';

interface ProductLineCardProps {
  productLine: ProductLine;
}

export function ProductLineCard({ productLine }: ProductLineCardProps) {
  const bgColor = productLine.backgroundColor || '#E5E7EB';

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="card-touch h-56 flex flex-col items-center justify-center text-center"
      style={{ backgroundColor: bgColor }}
    >
      {productLine.logoColor && (
        <div className="mb-4">
          <Image
            src={productLine.logoColor}
            alt={productLine.title}
            width={120}
            height={60}
            className="object-contain"
          />
        </div>
      )}

      <h2 className="text-3xl font-bold text-gray-900">{productLine.title}</h2>

      {productLine.description && (
        <p className="text-sm text-gray-600 mt-2 max-w-xs px-4">{productLine.description}</p>
      )}
    </motion.div>
  );
}
