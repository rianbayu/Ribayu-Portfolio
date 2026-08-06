import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Port dikunci agar tidak bentrok dengan project Vite lain yang sedang
  // berjalan. strictPort membuat Vite berhenti dengan pesan jelas kalau port
  // ini terpakai, bukan diam-diam pindah ke port lain.
  server: {
    port: 5183,
    strictPort: true,
  },
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
