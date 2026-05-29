@AGENTS.md

# Miles Wallet — Project Instructions

## Architecture

- **Framework**: Next.js 16, App Router, React 19, Tailwind CSS v4, TypeScript
- **State**: `localStorage` only — no database, no API routes needed
- **Path alias**: `@/*` → `./app/*` (configured in `tsconfig.json`)

## Key Files

| Path | Purpose |
|---|---|
| `app/types.ts` | `BankAccount` and `LoyaltyAccount` interfaces |
| `app/lib/utils.ts` | `getDaysUntilExpiry`, `getExpiryStatus`, `milesFromPoints`, `fmt`, `uid` |
| `app/lib/constants.ts` | Suggested banks, loyalty programmes, default conversion rates |
| `app/lib/csv.ts` | CSV export logic |
| `app/hooks/useWallet.ts` | All wallet state, reads/writes `localStorage` |
| `app/hooks/useDarkMode.ts` | Dark mode toggle, syncs `.dark` class on `<html>` |
| `app/page.tsx` | Main client page — mounts all sections and modals |

## Tailwind v4 Dark Mode

Dark mode uses a `.dark` class on `<html>`. Configured via `@variant dark` in `globals.css`.
The inline script in `layout.tsx` sets `.dark` before hydration to prevent flash.

## Conventions

- All components are client components (`'use client'`)
- Icons are inline SVG — no icon library dependency
- Forms use native HTML `<datalist>` for suggestions, not a combobox library
- Conversion rate is stored as **points per mile** (not miles per point)
