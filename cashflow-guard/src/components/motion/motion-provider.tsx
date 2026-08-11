"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * reducedMotion="user" nechá framer-motion automaticky vypnout posuny
 * a rotace uživatelům, kteří mají v systému zapnuté omezení animací.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
