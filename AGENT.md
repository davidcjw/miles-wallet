# Agent Guide — Miles Wallet

## What this project does

Miles Wallet is a client-side-only web app for tracking airline miles and credit card reward points. It helps users understand:

1. How many bank points they have across multiple cards
2. The equivalent miles value of those points (at user-configured conversion rates)
3. When points and miles expire

All data is persisted in `localStorage`. There is no backend.

## How to run it

```bash
cd miles-wallet
npm install
npm run dev       # dev server at localhost:3000
npm run build     # production build
npm run lint      # ESLint
```

## Key data flows

```
useWallet (hook)
  ├── reads localStorage on mount
  ├── writes localStorage on every state change
  ├── exposes: banks[], loyalty[], addBank, updateBank, deleteBank, addLoyalty, updateLoyalty, deleteLoyalty
  └── used in page.tsx

useDarkMode (hook)
  ├── reads localStorage + prefers-color-scheme on mount
  ├── toggles .dark class on <html>
  └── used in Header.tsx

exportToCSV (lib/csv.ts)
  └── called from Header (desktop) and page.tsx (mobile)
```

## Extending this app

**Adding a new bank or loyalty programme**: edit `app/lib/constants.ts` — add to `SUGGESTED_BANKS`, `SUGGESTED_LOYALTY_PROGRAMMES`, or `SUGGESTED_RATES`.

**Changing the conversion rate formula**: `milesFromPoints` in `app/lib/utils.ts` — currently `floor(points / rate)`.

**Adding a new field to BankAccount**: update `app/types.ts`, the modal form in `app/components/AddBankModal.tsx`, the card display in `app/components/BankCard.tsx`, and `app/lib/csv.ts` for CSV export.
