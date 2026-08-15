/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        primary: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#D32F2F",
          700: "#B71C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          DEFAULT: "#D32F2F",
          hover: "#B71C1C",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#18181B",
        },
        darkbg: {
          900: "#090D16",
          800: "#0F172A",
          700: "#1E293B",
          600: "#334155",
        }
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-x": "gradient-x 10s ease infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "gradient-x": {
          "0%, 100%": { "background-size": "200% 200%", "background-position": "left center" },
          "50%": { "background-size": "200% 200%", "background-position": "right center" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      boxShadow: {
        "glow-red": "0 0 25px -5px rgba(211, 47, 47, 0.4)",
        "glow-red-lg": "0 0 50px -10px rgba(211, 47, 47, 0.35)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
