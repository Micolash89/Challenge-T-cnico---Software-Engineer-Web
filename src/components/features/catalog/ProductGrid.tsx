"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Product } from '@/types/product.types';
import { ProductCard } from './ProductCard';
import ButtonUp from '../layout/ButtonUp';

interface ProductGridProps {
  products: Product[];
}

function ProductCardWrapper({ product, index }: { product: Product; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const delay = (index % 4) * 0.15;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      <ProductCard product={product} />
    </motion.div>
  );
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-20 text-center text-body text-graphite">
        No se encontraron productos.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCardWrapper key={product.id} product={product} index={index} />
      ))}
      <ButtonUp />
    </div>
  );
}
