'use client';

import { Surface, Text, Eyebrow } from 'rawhouse-ds';
import { BankAccount, LoyaltyAccount } from '@/types';
import { CONVERSION_RATES, SUPPORTED_PROGRAMMES } from '@/lib/constants';
import { milesFromPoints, fmt, getDaysUntilExpiry, getExpiryStatus } from '@/lib/utils';

interface Props {
  banks: BankAccount[];
  loyalty: LoyaltyAccount[];
  selectedProgramme: string;
  onSelectProgramme: (p: string) => void;
}

export default function SummaryStats({ banks, loyalty, selectedProgramme, onSelectProgramme }: Props) {
  const bankMiles = banks.reduce((sum, b) => {
    const rate = CONVERSION_RATES[b.bankName]?.[selectedProgramme];
    return sum + (rate ? milesFromPoints(b.points, rate) : 0);
  }, 0);

  const loyaltyMiles = loyalty
    .filter((l) => l.programmeName === selectedProgramme)
    .reduce((sum, l) => sum + l.miles, 0);

  const totalMiles = bankMiles + loyaltyMiles;

  const allExpiries = [
    ...banks.filter((b) => b.expiryDate).map((b) => ({ label: b.cardName || b.bankName, date: b.expiryDate! })),
    ...loyalty.filter((l) => l.expiryDate).map((l) => ({ label: l.programmeName, date: l.expiryDate! })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const nextExpiry = allExpiries[0];
  const nextDays = nextExpiry ? getDaysUntilExpiry(nextExpiry.date) : null;
  const nextStatus = nextExpiry ? getExpiryStatus(nextExpiry.date) : null;

  if (banks.length === 0 && loyalty.length === 0) return null;

  const expiryUrgent = nextStatus === 'expired' || nextStatus === 'urgent';
  const expiryWarning = nextStatus === 'warning';
  const chipBg = expiryUrgent ? 'var(--rh-coral)' : expiryWarning ? 'var(--rh-yellow)' : 'var(--rh-white)';
  const chipFg = expiryUrgent ? 'var(--rh-white)' : 'var(--rh-black)';

  return (
    <Surface
      tone="black"
      radius="xl"
      sticker
      bordered
      className="mb-10"
      style={{ padding: '32px 28px' }}
    >
      {/* Programme selector */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <Eyebrow tone="green">Total miles in</Eyebrow>
        <div className="relative inline-flex">
          <select
            value={selectedProgramme}
            onChange={(e) => onSelectProgramme(e.target.value)}
            aria-label="Selected loyalty programme"
            style={{
              appearance: 'none',
              background: 'var(--rh-coral)',
              color: 'var(--rh-white)',
              border: 'var(--rh-border-width) solid var(--rh-white)',
              borderRadius: 'var(--rh-r-pill)',
              padding: '6px 32px 6px 16px',
              fontFamily: 'var(--rh-font)',
              fontSize: 'var(--rh-fs-label)',
              fontWeight: 'var(--rh-weight-bold)',
              letterSpacing: 'var(--rh-track-label)',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {SUPPORTED_PROGRAMMES.map((p) => (
              <option key={p} value={p} style={{ background: '#fff', color: '#000', textTransform: 'none', letterSpacing: 'normal' }}>
                {p}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--rh-white)' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      {/* Hero number */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
        <Text as="p" size="hero" weight="extrabold" className="tabular-nums" style={{ lineHeight: 0.95 }}>
          {fmt(totalMiles)}
        </Text>

        {nextExpiry && nextDays !== null && (
          <span
            className="self-start sm:self-auto inline-flex items-center"
            style={{
              background: chipBg,
              color: chipFg,
              border: 'var(--rh-border-width) solid var(--rh-white)',
              borderRadius: 'var(--rh-r-pill)',
              padding: '8px 16px',
              fontFamily: 'var(--rh-font)',
              fontSize: 'var(--rh-fs-small)',
              fontWeight: 'var(--rh-weight-bold)',
            }}
          >
            Next: {nextExpiry.label}{' '}
            {nextDays < 0 ? '(expired)' : nextDays === 0 ? 'today' : `in ${nextDays}d`}
          </span>
        )}
      </div>

      {/* Breakdown */}
      {(bankMiles > 0 || loyaltyMiles > 0) && (
        <div
          className="mt-7 pt-5 flex flex-wrap gap-x-8 gap-y-3"
          style={{ borderTop: 'var(--rh-border-width) solid rgba(255,255,255,0.2)' }}
        >
          {bankMiles > 0 && (
            <div className="flex flex-col gap-1">
              <Eyebrow tone="muted">From bank points</Eyebrow>
              <Text as="p" size="title" weight="extrabold" className="tabular-nums">{fmt(bankMiles)}</Text>
            </div>
          )}
          {loyaltyMiles > 0 && (
            <div className="flex flex-col gap-1">
              <Eyebrow tone="muted">{selectedProgramme} balance</Eyebrow>
              <Text as="p" size="title" weight="extrabold" className="tabular-nums">{fmt(loyaltyMiles)}</Text>
            </div>
          )}
        </div>
      )}
    </Surface>
  );
}
