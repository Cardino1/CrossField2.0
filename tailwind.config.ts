import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f7ff",
          100: "#e6efff",
          200: "#c4d8ff",
          300: "#9bbaff",
          400: "#6d96ff",
          500: "#3f71ff",
          600: "#2650d6",
          700: "#1d3aa8",
          800: "#172e82",
          900: "#10215c"
        }
      },
      boxShadow: {
        soft: "0 20px 40px -20px rgba(15, 23, 42, 0.25)",
      }
    }
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
