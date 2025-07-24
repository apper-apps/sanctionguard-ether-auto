/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A5F",
        secondary: "#2C5282",
        accent: "#4299E1",
        surface: "#1A202C",
        background: "#0F1419",
        success: "#48BB78",
        warning: "#ED8936",
        error: "#E53E3E",
        info: "#4299E1"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        spin: 'spin 1s linear infinite',
      }
    },
  },
  plugins: [],
}