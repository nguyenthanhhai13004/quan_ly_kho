import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      "@syncfusion/ej2-base",
      "@syncfusion/ej2-data",
      "@syncfusion/ej2-react-base",
      "@syncfusion/ej2-react-spreadsheet"
    ]
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    allowedHosts:["dissuasively-unwitherable-keith.ngrok-free.dev"]
  },
});
