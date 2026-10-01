// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  // GitHub Pages serves this repository as a project site under /pixel-perfect-showcase-6631/.
  // Keep local/Lovable development at the normal root URL.
  vite: {
    base: isGitHubPages ? "/pixel-perfect-showcase-6631/" : "/",
  },
  tanstackStart: {
    // The site is intended to run as a static SPA on GitHub Pages.
    // Supabase is accessed directly from the browser, so the registration and admin UI
    // do not require a running SSR server at runtime.
    spa: {
      enabled: true,
      prerender: {
        outputPath: "/index.html",
        retryCount: 2,
      },
    },
    // Keep the server entry for local/Lovable/full-stack builds.
    server: { entry: "server" },
  },
});
