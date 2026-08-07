/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#020207",
        paper: "#f8fbff",
        // Terhubung ke variabel palet di styles.css supaya kelas seperti
        // bg-signal/60 ikut berubah saat tema diganti.
        moss: "rgb(var(--c-moss) / <alpha-value>)",
        signal: "rgb(var(--c-signal) / <alpha-value>)",
        ember: "rgb(var(--c-ember) / <alpha-value>)",
        brass: "rgb(var(--c-brass) / <alpha-value>)",
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
