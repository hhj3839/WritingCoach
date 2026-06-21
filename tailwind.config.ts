import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        skywash: "#eaf7ff",
        leaf: "#2f8f5b",
        coral: "#f56f58"
      },
      boxShadow: {
        panel: "0 18px 60px rgba(23, 33, 43, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
