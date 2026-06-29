import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        mib: {
          DEFAULT: "#588425",
          dark: "#44601c",
          light: "#6a9a2e",
          lime: "#8ec63f",
          deep: "#16240c",
          ink: "#0c1207",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(88,132,37,0.15), 0 18px 40px -12px rgba(88,132,37,0.35)",
        "glow-lg": "0 0 0 1px rgba(88,132,37,0.18), 0 30px 60px -18px rgba(88,132,37,0.45)",
        card: "0 1px 2px rgba(16,24,7,0.04), 0 8px 24px -12px rgba(16,24,7,0.12)",
        "card-hover": "0 2px 4px rgba(16,24,7,0.06), 0 24px 48px -16px rgba(88,132,37,0.30)",
      },
      backgroundImage: {
        "mib-gradient": "linear-gradient(135deg, #6a9a2e 0%, #588425 45%, #44601c 100%)",
        "mib-radial": "radial-gradient(circle at 30% 20%, rgba(110,154,46,0.18), transparent 60%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-20px) translateX(10px)" },
        },
        shine: {
          "0%": { transform: "translateX(-120%) skewX(-12deg)" },
          "100%": { transform: "translateX(220%) skewX(-12deg)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "70%, 100%": { transform: "scale(1.8)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-slow": "float-slow 11s ease-in-out infinite",
        shine: "shine 1.1s ease-in-out",
        "gradient-pan": "gradient-pan 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [typography],
};
export default config;
