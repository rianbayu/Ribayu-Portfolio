/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#020207",
        paper: "#f8fbff",
        moss: "#7dffdd",
        signal: "#0ba4e0",
        ember: "#6000ff",
        brass: "#cdd7ff",
        graphite: "#0b0d19",
      },
      boxShadow: {
        focus: "0 0 0 1px rgba(11, 164, 224, 0.45), 0 24px 80px rgba(0, 0, 0, 0.28)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: [
          "Satoshi",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
