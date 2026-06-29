"use client";

import { motion } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "none";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Penundaan animasi (detik) */
  delay?: number;
  /** Geser vertikal awal (px) — dipakai saat from = up/down */
  y?: number;
  /** Arah masuk */
  from?: Direction;
  /** Mulai sedikit lebih kecil lalu membesar */
  scale?: boolean;
  /** Durasi animasi (detik) */
  duration?: number;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 28,
  from = "up",
  scale = false,
  duration = 0.6,
}: Props) {
  const offset = (() => {
    switch (from) {
      case "up":
        return { y };
      case "down":
        return { y: -y };
      case "left":
        return { x: -y };
      case "right":
        return { x: y };
      default:
        return {};
    }
  })();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset, ...(scale ? { scale: 0.94 } : {}) }}
      whileInView={{ opacity: 1, x: 0, y: 0, ...(scale ? { scale: 1 } : {}) }}
      viewport={{ once: true, margin: "0px 0px -12% 0px", amount: 0.12 }}
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
