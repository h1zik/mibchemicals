"use client";

import { motion } from "framer-motion";

const ITEM_DELAYS = [0, 1.6, 3.2, 4.8];
const CYCLE = 6.4;

export function HeroManufacturingVisual() {
  return (
    <div
      className="relative mx-auto aspect-[4/3] w-full max-w-[520px]"
      aria-hidden
    >
      <svg viewBox="0 0 480 360" className="relative h-full w-full">
        <defs>
          <linearGradient id="hv-mib" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0771BF" />
            <stop offset="1" stopColor="#0a4d80" />
          </linearGradient>
          <linearGradient id="hv-silo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cbd5e1" />
            <stop offset="1" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="hv-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7dd3fc" />
            <stop offset="1" stopColor="#0771BF" />
          </linearGradient>
          <clipPath id="hv-belt-clip">
            <rect x="60" y="270" width="360" height="18" rx="9" />
          </clipPath>
        </defs>

        {/* SILO */}
        <g>
          <rect x="50" y="80" width="60" height="100" rx="6" fill="white" stroke="#0771BF" strokeWidth="2" />
          <motion.rect
            x="54"
            width="52"
            fill="url(#hv-silo)"
            animate={{ y: [92, 110, 92], height: [76, 58, 76] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            initial={{ y: 92, height: 76 }}
          />
          <path d="M 50 180 L 80 220 L 110 180 Z" fill="white" stroke="#0771BF" strokeWidth="2" />
          <rect x="76" y="220" width="8" height="50" fill="white" stroke="#0771BF" strokeWidth="2" />

          {[0, 1.0, 2.0, 3.0].map((d, i) => (
            <motion.circle
              key={i}
              cx="80"
              r="2.4"
              fill="#64748b"
              initial={{ cy: 222, opacity: 0 }}
              animate={{ cy: [222, 268], opacity: [0, 1, 0] }}
              transition={{ duration: 1.4, delay: d, repeat: Infinity, ease: "easeIn" }}
            />
          ))}
        </g>

        {/* REACTOR */}
        <g>
          {[0, 0.7, 1.4].map((d, i) => (
            <motion.circle
              key={i}
              cx={236 + i * 6}
              fill="white"
              initial={{ cy: 130, r: 4, opacity: 0 }}
              animate={{ cy: [130, 70], r: [4, 12], opacity: [0, 0.55, 0] }}
              transition={{ duration: 2.6, delay: d, repeat: Infinity, ease: "easeOut" }}
            />
          ))}

          <path
            d="M 110 200 Q 150 200 200 195"
            stroke="#0771BF"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.35"
          />

          <rect x="195" y="130" width="90" height="120" rx="14" fill="white" stroke="#0771BF" strokeWidth="2.5" />

          <motion.rect
            x="195"
            y="130"
            width="90"
            height="120"
            rx="14"
            fill="none"
            stroke="#0771BF"
            strokeWidth="3"
            animate={{ opacity: [0.15, 0.55, 0.15] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />

          <rect x="203" y="180" width="74" height="62" rx="6" fill="url(#hv-liquid)" opacity="0.7" />
          <motion.path
            d="M 203 184 Q 222 178 240 184 T 277 184"
            fill="none"
            stroke="#0771BF"
            strokeWidth="1.5"
            opacity="0.7"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {[
            { cx: 215, delay: 0 },
            { cx: 235, delay: 0.6 },
            { cx: 255, delay: 1.2 },
            { cx: 270, delay: 1.8 },
          ].map((b, i) => (
            <motion.circle
              key={i}
              cx={b.cx}
              r="2.5"
              fill="white"
              initial={{ cy: 240, opacity: 0 }}
              animate={{ cy: [240, 185], opacity: [0, 1, 0] }}
              transition={{ duration: 2.0, delay: b.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}

          <circle cx="240" cy="155" r="9" fill="#0a4d80" />
          <circle cx="240" cy="155" r="6" fill="white" />
          <motion.line
            x1="240"
            y1="155"
            x2="240"
            y2="151"
            stroke="#0771BF"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ transformOrigin: "240px 155px" }}
            animate={{ rotate: [-30, 60, 20, 75, -30] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.rect
            x="232"
            y="250"
            width="16"
            height="20"
            fill="url(#hv-mib)"
            animate={{ opacity: [0.25, 0.9, 0.25], scaleY: [0.9, 1.1, 0.9] }}
            style={{ transformOrigin: "240px 250px" }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>

        {/* CONVEYOR BELT */}
        <g clipPath="url(#hv-belt-clip)">
          <rect x="60" y="270" width="360" height="18" fill="#1e293b" />
          <motion.g
            animate={{ x: [0, -24] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 22 }).map((_, i) => (
              <rect key={i} x={60 + i * 24} y={270} width="6" height="18" fill="#475569" />
            ))}
          </motion.g>
        </g>

        <circle cx="60" cy="287" r="14" fill="#0f172a" stroke="#0771BF" strokeWidth="2" />
        <motion.line
          x1="60"
          y1="287"
          x2="60"
          y2="275"
          stroke="#0771BF"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transformOrigin: "60px 287px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        <circle cx="420" cy="287" r="14" fill="#0f172a" stroke="#0771BF" strokeWidth="2" />
        <motion.line
          x1="420"
          y1="287"
          x2="420"
          y2="275"
          stroke="#0771BF"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transformOrigin: "420px 287px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />

        <rect x="50" y="300" width="20" height="38" fill="#0f172a" />
        <rect x="410" y="300" width="20" height="38" fill="#0f172a" />

        {/* ITEMS travelling and transforming */}
        {ITEM_DELAYS.map((delay, i) => (
          <motion.g
            key={i}
            initial={{ x: 0 }}
            animate={{ x: 320 }}
            transition={{ duration: CYCLE, delay, repeat: Infinity, ease: "linear" }}
          >
            <motion.rect
              x="80"
              y="252"
              width="16"
              height="18"
              rx="3"
              strokeWidth="1.5"
              animate={{
                fill: ["#94a3b8", "#94a3b8", "#34d399", "#34d399"],
                stroke: ["#475569", "#475569", "#059669", "#059669"],
              }}
              transition={{ duration: CYCLE, delay, repeat: Infinity, ease: "linear", times: [0, 0.46, 0.54, 1] }}
            />
            <motion.circle
              cx="88"
              cy="261"
              r="9"
              fill="#fde68a"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 0, 0.9, 0, 0], scale: [0.6, 0.6, 1.4, 0.8, 0.6] }}
              transition={{ duration: CYCLE, delay, repeat: Infinity, ease: "easeOut", times: [0, 0.45, 0.5, 0.58, 1] }}
            />
          </motion.g>
        ))}

        {/* FINISHED BIN */}
        <g>
          <rect x="425" y="245" width="46" height="50" rx="6" fill="#dcfce7" stroke="#059669" strokeWidth="2" />
          <motion.path
            d="M 433 270 L 442 279 L 463 258"
            stroke="#059669"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.85, 1] }}
          />
        </g>
      </svg>
    </div>
  );
}
