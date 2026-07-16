import { VitePWA } from "vite-plugin-pwa";

/**
 * All RemmiNext PWA configuration lives here, isolated from vite.config.ts.
 * Icons and the web manifest are emitted under public/pwa (see scripts/generate-pwa-icons.mjs
 * for how the icons are generated from src/assets/logo.png).
 *
 * Note: the generated service worker itself (sw.js) is intentionally kept at the
 * site root by the plugin — a service worker can only control paths at or below
 * its own location, so nesting it under /pwa/ would limit offline support to
 * that subpath instead of the whole app.
 */
export const pwaPlugin = VitePWA({
  registerType: "autoUpdate",
  manifestFilename: "pwa/manifest.webmanifest",
  includeManifestIcons: false,
  devOptions: {
    // Lets the service worker + manifest be exercised against `npm run dev`,
    // not just a production build.
    enabled: true,
    type: "module",
  },
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
    navigateFallbackDenylist: [/^\/api\//],
  },
  manifest: {
    id: "/",
    name: "RemmiNext",
    short_name: "RemmiNext",
    description: "Send money, pay household bills, and build savings & DPS back home in Bangladesh — all in one app.",
    theme_color: "#0057B3",
    background_color: "#F8FAFC",
    display: "standalone",
    orientation: "portrait",
    start_url: "/",
    scope: "/",
    lang: "en",
    categories: ["finance", "business"],
    icons: [
      { src: "/pwa/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  },
});
