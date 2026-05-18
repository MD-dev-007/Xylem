import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A2E",
        accent: "#C9A84C",
        surface: "#F5F0E8"
      }
    }
  },
  plugins: []
};

export default config;
