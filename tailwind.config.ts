import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1e3a5f",
          dark: "#152a45",
          light: "#2a4f7a",
        },
        secondary: {
          DEFAULT: "#4a90d9",
          light: "#6ba5e3",
          dark: "#3577be",
        },
        surface: "#f8fafc",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(30, 58, 95, 0.18)",
        card: "0 8px 24px -8px rgba(30, 58, 95, 0.12)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(74, 144, 217, 0.35), transparent 60%), linear-gradient(135deg, #152a45 0%, #1e3a5f 45%, #2a4f7a 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
