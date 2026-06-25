<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Overview

Miles Wallet is a Next.js 16 / React 19 / Tailwind CSS v4 web app for tracking Singapore bank credit card points and loyalty programme miles. All data is stored in `localStorage` — no backend, no API routes.

**Live:** https://miles-wallet.davidcjw.com | **Repo:** https://github.com/davidcjw/miles-wallet

## Key Architecture Decisions

### Global Programme Selector
There is a single "selected loyalty programme" (e.g. KrisFlyer) that determines how all bank points are converted for display. It lives in `useWallet.selectedProgramme` and is persisted to `localStorage` under key `miles-wallet-programme`.

### Conversion Rates
`CONVERSION_RATES` in `app/lib/constants.ts` is the single source of truth for bank → programme conversion rates (points per 1 mile). It is **not** stored on the `BankAccount` object. When displaying miles, always look up:
```ts
const rate = CONVERSION_RATES[account.bankName]?.[selectedProgramme];
```
If `undefined`, the bank doesn't support that programme — show raw points with a "no transfer rate" note.

### BankAccount Schema
`BankAccount` has **no** `loyaltyProgramme` or `conversionRate` fields. The modal only collects: `bankName`, `cardName` (optional), `points`, `expiryDate` (optional).

### Design System (rawhouse-ds)
Visual identity comes from **`rawhouse-ds`** — a standalone React design system ([source](https://github.com/davidcjw/rawhouse-ds)) consumed as a **vendored, compiled package** at `vendor/rawhouse-ds` (dependency `"rawhouse-ds": "file:./vendor/rawhouse-ds"`). It is vendored — not installed from the source repo — because that repo gitignores `dist/` and has no prepare script, and Vercel only clones this repo. Regenerate the vendored build with `./scripts/sync-ds.sh`. Its compiled tokens, Manrope font and component CSS are pulled in once via `@import "rawhouse-ds/styles.css"` in `globals.css`. Components import primitives directly (`import { Surface, Text, Button, IconButton, Heading, Eyebrow } from 'rawhouse-ds'`).

- The app adopts the brand's light section: a warm-stone (`--rh-cream`) page with chunky Manrope type, white **sticker-shadow** cards, a black hero, and coral (primary) + green (secondary) accents.
- Tokens are `--rh-*` CSS custom properties. Use them (not Tailwind colour utilities) for any brand colour/border/radius/shadow. **Tailwind is kept for layout only** (flex / grid / spacing / responsive).
- The DS has **no input primitive** — native `<input>`/`<select>` use the `.rh-field` / `.rh-label` helpers in `globals.css`.
- The DS has **no yellow Surface tone**, so `ExpiryBadge` keeps a token-styled chip to preserve the coral/yellow/green severity scale.

### No dark mode
There is **no dark-mode toggle** — the DS uses fixed brand tones (high-contrast black & white *sections*, not a switchable neutral theme). `useDarkMode` and the pre-hydration theme script were removed when adopting the DS.

### Progressive Web App
The app is an installable, offline-capable PWA. It deliberately implements **only the install + offline pillars** — there are **no push notifications** (push needs a backend / stored subscriptions, which contradicts the `localStorage`-only, no-API-route architecture).

- **Manifest:** `app/manifest.ts` (served at `/manifest.webmanifest`) — `display: standalone`, theme `#000000`, four PNG icons (`any` + `maskable`, 192/512).
- **Icons:** `public/icon-{192,512}.png`, `public/icon-maskable-{192,512}.png`, `public/apple-touch-icon.png` — on-brand coral card glyph (mirrors the Header logo). Regenerate with the sharp script pattern in commit history if the brand mark changes; maskable variants keep the card inside the 80% safe zone.
- **Service worker:** `public/sw.js` — precaches the app shell on install; **network-first** for navigations (falls back to cached `/`), **stale-while-revalidate** for hashed static assets and the manifest. Bump `CACHE_VERSION` on any SW change to invalidate old caches. Same-origin GET only; cross-origin and non-GET pass through untouched.
- **Registration + UI:** `app/components/Pwa.tsx` (mounted in `layout.tsx`) registers the SW **in production only** (avoids dev HMR conflicts), shows a dismissible install prompt (`beforeinstallprompt` on Chromium, manual Share→Add hint on iOS Safari), and surfaces an "update available → Refresh" banner when a new SW is waiting.
- **Headers/CSP:** `next.config.ts` serves `/sw.js` with `no-cache` + `Service-Worker-Allowed: /`, and the CSP allows `worker-src 'self'` / `manifest-src 'self'`.
- **Testing locally:** the SW is prod-only, so use `npm run build && npm start` — `localhost` is a secure context, so install/offline work there.

### Path Alias
`@/*` resolves to `./app/*` — configured in `tsconfig.json` (not the project root).

## File Map

| Path | Purpose |
|---|---|
| `app/types.ts` | `BankAccount` and `LoyaltyAccount` interfaces |
| `app/lib/constants.ts` | `SUGGESTED_BANKS`, `CARD_SUGGESTIONS`, `CONVERSION_RATES`, `SUPPORTED_PROGRAMMES` |
| `app/lib/utils.ts` | `getDaysUntilExpiry`, `getExpiryStatus`, `milesFromPoints`, `fmt`, `uid` |
| `app/lib/csv.ts` | CSV export — accepts `selectedProgramme` as third arg |
| `app/hooks/useWallet.ts` | All wallet state + `selectedProgramme`; reads/writes `localStorage` |
| `app/page.tsx` | Main client page — mounts all sections and modals |
| `app/layout.tsx` | Root layout — metadata (icons, `appleWebApp`, manifest), mounts `<Pwa />` |
| `app/manifest.ts` | Web app manifest (`/manifest.webmanifest`) |
| `public/sw.js` | Service worker — offline app-shell precache + runtime caching |
| `app/components/Pwa.tsx` | SW registration (prod), install prompt, update banner (client) |
| `app/components/SummaryStats.tsx` | Hero card with programme selector and total miles |
| `app/components/BankCard.tsx` | Single bank account card — looks up conversion rate at render |
| `app/components/AddBankModal.tsx` | Simplified modal: Bank + Card + Points + Expiry only |
| `app/components/SelectWithOther.tsx` | Reusable select with "Other…" option revealing a text input |
| `app/components/SyncModal.tsx` | QR code encode/decode for cross-device sync |

## Conventions

- All components are client components (`'use client'`)
- Icons are inline SVG — no icon library
- `conversionRate` is always **points per mile** (e.g. 3 → 3 pts = 1 mile; `miles = floor(pts / rate)`)
- Expiry thresholds: expired (<0d), urgent (0–30d), warning (31–180d), good (>180d)
