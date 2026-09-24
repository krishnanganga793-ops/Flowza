/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#0f172a",
        surface: "#f8fafc",
        coral: "#f43f5e",
        mint: "#10b981",
        amber: "#f59e0b",
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          900: "#312e81"
        }
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(15, 23, 42, 0.05)",
        "soft-lg": "0 20px 40px -15px rgba(15, 23, 42, 0.08)",
        glow: "0 0 25px -5px rgba(99, 102, 241, 0.25)",
        "glow-mint": "0 0 25px -5px rgba(16, 185, 129, 0.25)"
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.85 }
        },
        "slide-up": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      },
      animation: {
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
        "slide-up": "slide-up 0.25s ease-out forwards"
      }
    }
  },
  plugins: []
};

