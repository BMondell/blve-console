/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blv: {
          bg: "#0F1115",
          "bg-secondary": "#1A1D22",
          border: "rgba(255,255,255,0.05)",
          text: "#E5E7EB",
          "text-secondary": "#9CA3AF",
          "text-tertiary": "#6B7280",
          accent: "#7C3AED", // Purple for BLVΞ identity
        },
      },
      spacing: {
        "blv-xs": "0.25rem",
        "blv-sm": "0.5rem",
        "blv-md": "1rem",
        "blv-lg": "1.5rem",
        "blv-xl": "2rem",
        "blv-2xl": "3rem",
      },
      fontSize: {
        "blv-xs": ["0.75rem", { lineHeight: "1rem" }],
        "blv-sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "blv-base": ["1rem", { lineHeight: "1.5rem" }],
        "blv-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "blv-xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "blv-2xl": ["1.5rem", { lineHeight: "2rem" }],
        "blv-3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      boxShadow: {
        "blv-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "blv-md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        "blv-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        "blv-glow": "0 0 20px rgba(124, 58, 237, 0.3)",
      },
      borderRadius: {
        "blv-sm": "0.375rem",
        "blv-md": "0.5rem",
        "blv-lg": "0.75rem",
        "blv-xl": "1rem",
        "blv-2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
