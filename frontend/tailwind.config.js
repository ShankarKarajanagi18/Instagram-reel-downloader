/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        coral: {
          400: "#ff7f6e",
          500: "#ff6b56",
          600: "#e85d4a",
        },
        ink: {
          900: "#080810",
          800: "#0e0e1a",
          700: "#14142a",
          600: "#1c1c35",
          500: "#252540",
        },
        slate: {
          850: "#111827",
        },
      },
      backgroundImage: {
        "mesh-gradient": "radial-gradient(ellipse at 20% 50%, #1a1040 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #0f2040 0%, transparent 40%)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 60%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      boxShadow: {
        "glow-coral": "0 0 30px rgba(255, 107, 86, 0.3)",
        "glow-purple": "0 0 40px rgba(139, 92, 246, 0.2)",
        "card": "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
};
