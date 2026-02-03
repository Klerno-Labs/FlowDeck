'use client';

import Image from 'next/image';
import { Product } from '@/types';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="card-touch flex flex-col items-center p-6 h-full"
    >
      {product.image && (
        <div className="mb-4 flex-1 flex items-center justify-center">
          <Image
            src={product.image}
            alt={product.title}
            width={200}
            height={300}
            className="object-contain"
          />
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900 text-center">{product.title}</h3>

      {product.sku && <p className="text-sm text-gray-500 mt-1">{product.sku}</p>}
    </motion.div>
  );
}
