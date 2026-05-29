<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Overview

Miles Wallet is a Next.js 16 / React 19 / Tailwind CSS v4 web app for tracking Singapore bank credit card points and loyalty programme miles. All data is stored in `localStorage` — no backend, no API routes.

**Live:** https://miles-wallet.vercel.app | **Repo:** https://github.com/davidcjw/miles-wallet

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

### Tailwind v4 Dark Mode
Uses `@variant dark (&:where(.dark, .dark *))` in `globals.css`. The `.dark` class is toggled on `<html>`. An inline script in `layout.tsx` sets the class before hydration to prevent flash.

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
| `app/hooks/useDarkMode.ts` | Dark mode toggle, syncs `.dark` class on `<html>` |
| `app/page.tsx` | Main client page — mounts all sections and modals |
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
