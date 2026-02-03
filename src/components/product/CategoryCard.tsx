'use client';

import Image from 'next/image';
import { Category } from '@/types';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const bgColor = category.backgroundColor || '#6B7280';

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="card-touch h-64 flex flex-col items-center justify-center text-center"
      style={{ backgroundColor: bgColor }}
    >
      {category.icon && (
        <div className="mb-4">
          <Image src={category.icon} alt={category.title} width={80} height={80} />
        </div>
      )}

      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-3xl font-bold text-white bg-white/20 px-4 py-2 rounded-lg">
          {category.code.toUpperCase()}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-white">{category.title}</h2>

      {category.description && (
        <p className="text-sm text-white/80 mt-2 max-w-xs">{category.description}</p>
      )}
    </motion.div>
  );
}
