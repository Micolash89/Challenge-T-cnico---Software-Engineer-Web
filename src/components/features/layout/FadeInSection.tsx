"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { variantsNormalUpDown } from "@/lib/animation-variants";

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
}

export function FadeInSection({ children, className }: FadeInSectionProps) {
  return (
    <motion.div
      variants={variantsNormalUpDown}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}
