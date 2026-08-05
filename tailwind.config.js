/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D32F2F",
          hover: "#B71C1C",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#242424",
        },
      },
    },
  },
  plugins: [],
};
