'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  duration = 2,
  className = '',
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    let currentValue = 0;
    const increment = value / (duration * 60);

    const timer = setInterval(() => {
      currentValue += increment;

      if (currentValue >= value) {
        currentValue = value;
        clearInterval(timer);
      }

      setDisplayValue(
        `${prefix}${Math.floor(currentValue).toLocaleString()}${suffix}`,
      );
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value, duration, prefix, suffix]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {displayValue}
    </motion.span>
  );
}
