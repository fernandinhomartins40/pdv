import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        ink: "0 20px 80px rgba(18, 14, 10, 0.14)",
        float: "0 28px 90px rgba(24, 12, 8, 0.22)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(17, 24, 39, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(17, 24, 39, 0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
