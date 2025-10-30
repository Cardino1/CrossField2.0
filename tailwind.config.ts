import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        border: "0 0 0 1px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    }
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
