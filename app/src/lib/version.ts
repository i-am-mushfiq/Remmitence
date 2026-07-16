/**
 * Single source of truth for the app's displayed version is package.json's
 * `version` field — injected at build time via the `__APP_VERSION__` define
 * in vite.config.ts. See VERSIONING.md for the bump process across web +
 * Android.
 */
export const APP_VERSION = __APP_VERSION__;
