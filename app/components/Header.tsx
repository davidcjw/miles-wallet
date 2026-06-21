'use client';

import { Surface, Text, Button, IconButton } from 'rawhouse-ds';
import { exportToCSV } from '@/lib/csv';
import { BankAccount, LoyaltyAccount } from '@/types';

interface Props {
  banks: BankAccount[];
  loyalty: LoyaltyAccount[];
  selectedProgramme: string;
  onSync: () => void;
}

export default function Header({ banks, loyalty, selectedProgramme, onSync }: Props) {
  const isEmpty = banks.length === 0 && loyalty.length === 0;

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'var(--rh-cream)',
        borderBottom: 'var(--rh-border-width) solid var(--rh-black)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Surface
            tone="coral"
            radius="md"
            bordered
            className="flex items-center justify-center"
            style={{ width: 36, height: 36 }}
          >
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 4.5C2 3.4 2.9 2.5 4 2.5h6c1.1 0 2 .9 2 2V9c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4.5z"
                fill="white"
                opacity="0.95"
              />
              <path d="M4.5 6.5h5M4.5 8.5h3" stroke="var(--rh-coral)" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M2 5.5h10" stroke="var(--rh-coral)" strokeWidth="1.2" />
            </svg>
          </Surface>
          <Text as="span" size="title" weight="extrabold">
            Miles Wallet
          </Text>
        </div>

        <div className="flex items-center gap-2">
          <IconButton aria-label="Sync wallet" variant="outline" size={40} onClick={onSync}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.6" />
              <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.6" />
              <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.6" />
              <path d="M9 11.5h2M11 9.5v2M13 11.5h.5M11 13.5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </IconButton>

          {!isEmpty && (
            <span className="hidden sm:inline-flex">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToCSV(banks, loyalty, selectedProgramme)}
              >
                Export CSV
              </Button>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
