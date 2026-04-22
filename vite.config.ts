import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  // Default to root for local dev/preview; allow overriding for subpath deployments.
  const base = process.env.VITE_BASE_PATH ?? "/";

  return {
    base: command === "serve" ? "/" : base,
    build: {
      sourcemap: true,
    },
    server: {
      port: 5173,
    },
  };
});
