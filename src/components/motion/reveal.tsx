"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Sdílené varianty pro najetí obsahu zdola. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/** Zhoupnutí ikony — spouští se z hoveru na rodičovské kartě. */
export const iconWiggle: Variants = {
  hover: {
    rotate: [0, -12, 9, -5, 0],
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Fade-in-up při scrollování. Přehraje se jen jednou. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      data-reveal=""
      className={className}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
