# RemmiNext Versioning

One version number, two places it needs to match, plus one Android-only build counter.

## Source of truth

**`app/package.json` → `"version"`** is the single source of truth for the app's displayed version (semver: `MAJOR.MINOR.PATCH`).

It's injected into the web/PWA bundle at build time via `vite.config.ts` (`define: { __APP_VERSION__ }`) and surfaced in the UI at **Account → RemmiNext v{version}** (`src/lib/version.ts`). Nothing else in the web app should hardcode a version string.

## Bumping a release

1. Bump `app/package.json` → `"version"` (e.g. `1.0.0` → `1.1.0`).
2. Mirror it into the Android wrapper, `android-twa/twa-manifest.json`:
   - `appVersionName` → same semver string (`"1.1.0"`)
   - `appVersionCode` → **increment by exactly 1** from whatever it was (this is a separate, Play-Store-mandated monotonically increasing integer — it does *not* reset or map 1:1 to the semver number)
   - `appVersion` → same semver string (kept in sync for display only)
3. Mirror the same two fields into `android-twa/app/build.gradle` (`versionCode`, `versionName`) — normally `bubblewrap update` regenerates this file from `twa-manifest.json` for you; editing both by hand is only needed if you're skipping that regeneration step.
4. Rebuild and redeploy (see `app/ASSUMPTIONS.md` → "Deployment & Android packaging" for the exact commands).
5. Tag the release once it's confirmed working: `git tag v1.1.0 && git push origin v1.1.0`.

## When to bump what (semver)

- **PATCH** (`1.0.x`): bug fixes, copy tweaks, visual polish — no user-facing behavior change.
- **MINOR** (`1.x.0`): new features or screens (e.g. a new module, a new flow) that don't break existing ones.
- **MAJOR** (`x.0.0`): breaking changes to data shape/flows — e.g. once a real backend replaces the mock store, that migration is a MAJOR bump.

## Current version

`1.0.0` — first tagged baseline, covers everything through the Cloudflare Pages deployment + signed Android APK.
