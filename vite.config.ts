import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import cesium from "vite-plugin-cesium";
export default defineConfig({
  plugins: [tailwindcss(), react(), cesium()],
});
