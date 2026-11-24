/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Plant Shop Color Scheme
        'plant-dark': '#1A4D2E',
        'plant-green': '#4CAF50',
        'plant-yellow': '#FFD700',
        'plant-light': '#F8F8F8',
        'plant-gray': '#6B7280',
        'plant-white': '#FFFFFF',
        'plant-black': '#1F2937',
        
        // Legacy colors for compatibility
        emerald: {
          50: "#effcf6",
          100: "#d9f7ea",
          200: "#b6efd6",
          300: "#86e2bd",
          400: "#4fcd9c",
          500: "#22c17f",
          600: "#1A4D2E",
          700: "#1A4D2E",
          800: "#1A4D2E",
          900: "#1A4D2E",
        },
        stone: {
          50: "#F8F8F8",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        plant: {
          green: "#1A4D2E",
          "green-light": "#4CAF50",
          "green-dark": "#1A4D2E",
          cream: "#F8F8F8",
          beige: "#F3F4F6",
          orange: "#FFD700",
          "orange-dark": "#E5B800",
        },
        brand: {
          primary: "#1A4D2E",
          primaryDark: "#1A4D2E",
          accent: "#FFD700",
          surface: "#ffffff",
          background: "#F8F8F8",
        },
      },
      boxShadow: {
        soft: "0 4px 18px rgba(16, 24, 40, 0.06)",
        "plant-card": "0 4px 20px rgba(0, 0, 0, 0.08)",
        "plant-card-hover": "0 12px 40px rgba(0, 0, 0, 0.15)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'leaf-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23E5E7EB\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}
