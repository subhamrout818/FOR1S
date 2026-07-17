import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#101010",
        foreground: "#FFFFFF",
        muted: "#BEBEBE",
        accent: {
          DEFAULT: "#E63946",
          dim: "#B22A35",
          soft: "rgba(230, 57, 70, 0.12)",
        },
        hairline: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "fluid-hero": "clamp(3.25rem, 9vw, 9.5rem)",
        "fluid-xl": "clamp(2.5rem, 6vw, 6rem)",
        "fluid-lg": "clamp(1.75rem, 3.4vw, 3.25rem)",
        "fluid-md": "clamp(1.25rem, 2vw, 1.75rem)",
      },
      letterSpacing: {
        tightest: "-0.06em",
        wideish: "0.14em",
        widest: "0.32em",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to))",
        grain: "url('/noise.svg')",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
        smooth: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "grain-shift": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -4%)" },
          "20%": { transform: "translate(-6%, 2%)" },
          "30%": { transform: "translate(2%, -6%)" },
          "40%": { transform: "translate(-4%, 6%)" },
          "50%": { transform: "translate(-6%, 4%)" },
          "60%": { transform: "translate(6%, 0)" },
          "70%": { transform: "translate(0, 6%)" },
          "80%": { transform: "translate(-4%, 0)" },
          "90%": { transform: "translate(4%, 4%)" },
        },
        morph: {
          "0%, 100%": {
            borderRadius: "42% 58% 65% 35% / 45% 40% 60% 55%",
            transform: "rotate(0deg) scale(1)",
          },
          "33%": {
            borderRadius: "60% 40% 30% 70% / 55% 65% 35% 45%",
            transform: "rotate(6deg) scale(1.05)",
          },
          "66%": {
            borderRadius: "35% 65% 55% 45% / 40% 50% 50% 60%",
            transform: "rotate(-5deg) scale(0.97)",
          },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        grain: "grain-shift 1.2s steps(8) infinite",
        morph: "morph 16s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
