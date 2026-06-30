export const variantsNormalUpDown = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export const variantsNormalDownUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export const variantsFast = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut" as const,
    },
  },
};

export const variantsParams = (
  axis: string,
  duration: number,
  delay: number,
  value: number,
) => {
  const hiddenOffset = axis === "x" ? { x: value } : { y: value };

  return {
    hidden: { opacity: 0, ...hiddenOffset },
    visible: {
      opacity: 1,
      ...(axis === "x" ? { x: 0 } : { y: 0 }),
      transition: {
        duration,
        delay,
        ease: "easeOut" as const,
      },
    },
  };
};

export const containerVariantsCascade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};
