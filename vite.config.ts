import { defineConfig } from "vite";

export default defineConfig({
  base: "/FahrlaessigkeitPMLP/",
  build: {
    sourcemap: true,
  },
  server: {
    port: 5173,
  },
});
