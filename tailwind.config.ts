import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "var(--ink)",
          raised: "var(--ink-raised)",
          line: "var(--ink-line)",
        },
        paper: {
          DEFAULT: "var(--paper)",
          mute: "var(--paper-mute)",
        },
        ember: {
          DEFAULT: "var(--ember)",
          dim: "var(--ember-dim)",
        },
        felt: "var(--felt)",
        chalk: "var(--chalk)",
      },
      fontFamily: {
        display: ["var(--font-industry)", "Arial Narrow", "sans-serif"],
        body: ["var(--font-industry)", "Arial Narrow", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        brand: "0.18em",
      },
      maxWidth: {
        site: "1280px",
      },
      animation: {
        "spin-slow": "spin 28s linear infinite",
        "dust-drift": "dust-drift 18s linear infinite",
      },
      keyframes: {
        "dust-drift": {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-4%, -2%, 0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
