// @lovable.dev/vite-tanstack-config already includes the common TanStack/React/Tailwind plugins.
// Keep the project's server entry explicit for the SSR error wrapper.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Netlify is the deployment target for this build.
  // Nitro's Netlify preset emits the server as a Netlify Function and static assets for Netlify.
  nitro: {
    preset: "netlify",
  },
});
