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
        ink: "0 22px 68px rgba(39, 66, 108, 0.14)",
        float: "0 30px 92px rgba(28, 52, 92, 0.18)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(16, 23, 38, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 23, 38, 0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
