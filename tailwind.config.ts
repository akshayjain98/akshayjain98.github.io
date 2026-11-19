import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Apple-style palette
        apple: {
          ink: "#1d1d1f",
          muted: "#6e6e73",
          gray: "#f5f5f7",
          chip: "#e8e8ed",
          line: "#d2d2d7",
          blue: "#0071e3",
          "blue-hover": "#0077ed",
          link: "#0066cc",
          "link-dark": "#2997ff",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", '"SF Pro Display"', '"SF Pro Text"', '"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
