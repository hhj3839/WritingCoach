import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        skywash: "#e7f6ff",
        leaf: "#42a66f",
        coral: "#ff7f73",
        peach: "#fff0df",
        mint: "#e9f9ef",
        butter: "#fff7c8",
        lilac: "#f2ecff"
      },
      boxShadow: {
        panel: "0 20px 50px rgba(60, 72, 88, 0.13)",
        soft: "0 12px 28px rgba(66, 166, 111, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
