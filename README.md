# Miles Wallet

A minimalist web app for tracking bank credit card points and loyalty programme miles — all in one place, stored locally in your browser.

## Features

- **Bank Points** — Add multiple bank accounts with points balance, target loyalty programme, conversion rate, and expiry date
- **Loyalty Miles** — Track direct miles balances (e.g. KrisFlyer, Asia Miles) with expiry dates
- **Miles Equivalent** — Automatic conversion from bank points to miles at your specified rate
- **Expiry Alerts** — Color-coded expiry badges (green → amber → orange → red as expiry approaches)
- **Summary Dashboard** — Total miles equivalent across all accounts, grouped by loyalty programme
- **Dark Mode** — Toggleable dark/light theme, persisted to `localStorage`
- **CSV Export** — Download all your data as a spreadsheet
- **Zero backend** — All data lives in your browser's `localStorage`; nothing is sent to any server

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **TypeScript**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data Model

**Bank Account**

| Field | Description |
|---|---|
| `bankName` | e.g. DBS, Citibank |
| `cardName` | e.g. DBS Altitude |
| `points` | Current points balance |
| `loyaltyProgramme` | Target programme (e.g. KrisFlyer) |
| `conversionRate` | Points needed per 1 mile (e.g. 3 means 3 pts = 1 mile) |
| `expiryDate` | When the bank points expire |

**Loyalty Account**

| Field | Description |
|---|---|
| `programmeName` | e.g. KrisFlyer, Asia Miles |
| `miles` | Current miles balance |
| `expiryDate` | When the miles expire |

## Deployment

Deployed via Vercel. Push to `main` triggers automatic deployment.

## Privacy

No analytics, no tracking, no server. Your data stays in your browser.
