import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF8",
        ink: {
          DEFAULT: "#17171A",
          soft: "#4A4A52",
          faint: "#8B8B92",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          sunken: "#F3F2EF",
        },
        line: "#E8E7E2",
        accent: {
          DEFAULT: "#2447F5",
          soft: "#EEF1FE",
          deep: "#152F9E",
        },
        success: {
          DEFAULT: "#1F9D64",
          soft: "#E8F7EF",
        },
        danger: {
          DEFAULT: "#D64545",
          soft: "#FBEAEA",
        },
        mastery: "#B5852E",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jbmono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "20px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23, 23, 26, 0.04), 0 8px 24px -12px rgba(23, 23, 26, 0.08)",
        raised: "0 2px 4px rgba(23, 23, 26, 0.06), 0 16px 40px -16px rgba(23, 23, 26, 0.14)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
