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
| `app/page.tsx` | Main client page — mounts all sections and modals |

## Design System

UI is built on **`rawhouse-ds`** (installed via `file:../design-systems/rawhouse-ds`). Tokens, Manrope font and component CSS load via `@import "rawhouse-ds/styles.css"` in `globals.css`; primitives are imported per-component (`Surface`, `Text`, `Button`, `IconButton`, `Heading`, `Eyebrow`). Use `--rh-*` tokens (not Tailwind colour utilities) for brand colour/border/radius/shadow; Tailwind is layout-only. Native inputs use the `.rh-field` / `.rh-label` helpers. See `AGENTS.md` for full details. There is **no dark mode** — the DS uses fixed brand tones.

## Conventions

- All components are client components (`'use client'`)
- Icons are inline SVG — no icon library dependency
- Forms use native HTML `<datalist>` for suggestions, not a combobox library
- Conversion rate is stored as **points per mile** (not miles per point)
