"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

type Props = {
  /** Nilai akhir */
  value: number;
  /** Teks sebelum angka */
  prefix?: string;
  /** Teks setelah angka, mis. "+" atau "%" */
  suffix?: string;
  /** Durasi hitung (detik) */
  duration?: number;
};

export function StatCounter({ value, prefix = "", suffix = "", duration = 1.6 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {Math.round(display).toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}
