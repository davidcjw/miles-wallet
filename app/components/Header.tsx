'use client';

import { useDarkMode } from '@/hooks/useDarkMode';
import { exportToCSV } from '@/lib/csv';
import { BankAccount, LoyaltyAccount } from '@/types';

interface Props {
  banks: BankAccount[];
  loyalty: LoyaltyAccount[];
}

export default function Header({ banks, loyalty }: Props) {
  const { isDark, toggle } = useDarkMode();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 4.5C2 3.4 2.9 2.5 4 2.5h6c1.1 0 2 .9 2 2V9c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4.5z"
                fill="white"
                opacity="0.9"
              />
              <path d="M4.5 6.5h5M4.5 8.5h3" stroke="rgb(37 99 235)" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M2 5.5h10" stroke="rgb(37 99 235)" strokeWidth="1.2" />
            </svg>
          </div>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Miles Wallet
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(banks, loyalty)}
            disabled={banks.length === 0 && loyalty.length === 0}
            className="hidden sm:flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1v8M4 6l3 3 3-3M2 10v1.5A1.5 1.5 0 003.5 13h7A1.5 1.5 0 0012 11.5V10"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Export CSV
          </button>

          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isDark ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06M8 5a3 3 0 100 6 3 3 0 000-6z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 8.53A6 6 0 117.47 2 4.67 4.67 0 0014 8.53z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
