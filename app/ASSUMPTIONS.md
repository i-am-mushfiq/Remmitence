# RemmiNext Prototype — Assumptions & Interpretations

This file records every place the BRS or DesignSystem.md left a decision to us, per the instruction to "never silently invent business logic." Nothing here reflects a business decision — these are prototype-scoping calls made to ship a coherent demo.

## Scope
- **Customer App only.** The BRS describes two applications (Customer App + internal Ops Console) with separate Figma files. Only DesignSystem.md (mobile-first customer app) was provided, so this prototype implements the Customer App exclusively — Modules 2–8, 10, and 12 from BRS Section 7. Module 1 (Platform Configuration), 9 (Compliance back-office), and 11 (Reports/MIS) are internal Ops Console tooling and are out of scope here.
- **Responsive website, not a packaged mobile app.** Per your direction, this is a browser-based responsive site: a desktop sidebar layout that collapses to the design system's specified 5-tab bottom nav (Home/Send/Bills/Savings/Account) below the `md` breakpoint. Beneficiaries, Nest Egg, and Support are reachable from the desktop sidebar and from within relevant flows on mobile, since the design system fixes the mobile bottom nav at 5 items.

## Data & backend
- **No real backend.** All data (user, beneficiaries, transactions, billers, savings/DPS, notifications, tickets) is seeded mock data held in a Zustand store, persisted to `localStorage` so state survives a page reload. There is no server, database, or real KYC/payment/FX integration.
- **OTP and biometric verification are simulated.** Any 6-digit code succeeds; document/selfie "capture" is a staged animation, not a real camera integration.
- **FX rate is a fixed constant** (19.8452 MYR/BDT) rather than a live treasury feed. The "refresh rate" action in the Confirm step resets the 90-second lock countdown rather than fetching a new rate.
- **Commission tiers and the 2.5% government incentive** (`src/lib/pricing.ts`) are illustrative flat-tier figures for demo purposes, not sourced from an actual BNM/Bangladesh Bank schedule.

## Design interpretation
- **"Liquid Balance" vs. "Total Savings (Incl. DPS)"** on the Balance Summary Card: DesignSystem.md specifies this split without defining it for a remittance-only platform that never holds customer funds. We interpreted **Liquid Balance = combined linked Bangladesh savings account balance** (withdrawable any time) and **Total Savings (Incl. DPS) = savings balance + DPS contributed-to-date** (partially locked). Total Net Worth = the sum of both.
- **Language switcher is UI-only.** Account → Language lets the user pick Bengali/English/Bahasa Malaysia and persists the choice, but the interface copy itself is not translated in this prototype — a production build would run all copy through an i18n layer.

## Out of scope for this pass
- Ops Console / back-office (compliance queues, payout-partner config, MIS reporting).
- Real document OCR, liveliness detection, sanctions/PEP screening, and payment gateway integrations.

## Deployment & Android packaging
- **Live at https://remminext.pages.dev** — deployed via Cloudflare Pages (`wrangler pages deploy`). `public/_redirects` gives the SPA a catch-all fallback to `index.html` so deep links (e.g. `/login`) work on a static host.
- **Installable as a PWA** directly from Chrome/Edge ("Install app") or iOS Safari ("Add to Home Screen") — no app-store account needed.
- **An Android `.apk` also exists** at `RemmiNext.apk` (project root), generated via Bubblewrap (Trusted Web Activity) wrapping the deployed URL. The wrapper project lives in `android-twa/` (sibling to `app/`), kept separate since it's a native build artifact, not part of the web source.
- **The signing keystore (`android-twa/android.keystore`, password `bubblewrap123`) is a throwaway dev key**, not a securely-generated production one. It's fine for sideloading/testing; it must **not** be used to publish to Play Store — a real release key needs to be generated deliberately and its private key backed up, since losing it means you can never update the app under the same listing again.
- `public/.well-known/assetlinks.json` declares this APK's signing fingerprint as the verified owner of `remminext.pages.dev`, so Android opens it full-screen (no browser URL bar) rather than as a plain Custom Tab.
- To rebuild the APK after a code change: `cd app && npm run build && npx wrangler pages deploy dist --project-name=remminext`, then in `android-twa/`: `npx @bubblewrap/cli update` followed by `./gradlew.bat assembleRelease`, then re-run `zipalign`/`apksigner` (see shell history) or re-sign with the existing `android.keystore`.
