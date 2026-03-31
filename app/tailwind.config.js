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
          bg: "var(--blv-bg)",
          card: "var(--blv-card)",
          "bg-secondary": "var(--blv-bg-secondary)",
          border: "var(--blv-border)",
          text: "var(--blv-text-primary)",
          "text-primary": "var(--blv-text-primary)",
          "text-secondary": "var(--blv-text-secondary)",
          "text-tertiary": "var(--blv-text-tertiary)",
          accent: "var(--blv-accent)",
          green: "var(--blv-green)",
          red: "var(--blv-red)",
          blue: "var(--blv-blue)",
          amber: "var(--blv-amber)",
          purple: "var(--blv-purple)",
        },
      },
      spacing: {
        "blv-xs": "var(--blv-xs)",
        "blv-sm": "var(--blv-sm)",
        "blv-md": "var(--blv-md)",
        "blv-lg": "var(--blv-lg)",
        "blv-xl": "var(--blv-xl)",
        "blv-2xl": "var(--blv-2xl)",
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
        "blv-sm": "var(--blv-radius-sm)",
        "blv-md": "var(--blv-radius-md)",
        "blv-lg": "var(--blv-radius-lg)",
        "blv-xl": "var(--blv-radius-xl)",
        "blv-2xl": "var(--blv-radius-2xl)",
      },
    },
  },
  plugins: [],
};
