'use client';

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

  return (
    <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-br from-blue-600 to-indigo-700">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/[0.03]" />

      <div className="relative px-7 pt-8 pb-7">
        {/* Programme selector */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
            <select
              value={selectedProgramme}
              onChange={(e) => onSelectProgramme(e.target.value)}
              className="appearance-none bg-white/15 hover:bg-white/20 text-white text-xs font-semibold tracking-widest uppercase pr-7 pl-3 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors"
            >
              {SUPPORTED_PROGRAMMES.map((p) => (
                <option key={p} value={p} className="bg-indigo-700 text-white normal-case tracking-normal font-normal">
                  {p}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/60">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <span className="text-blue-200 text-xs font-medium tracking-widest uppercase">Miles</span>
        </div>

        {/* Hero number */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <p className="text-6xl sm:text-7xl font-bold tracking-tight tabular-nums text-white leading-none">
            {fmt(totalMiles)}
          </p>

          {/* Next expiry chip */}
          {nextExpiry && nextDays !== null && (
            <div
              className={`self-start sm:self-auto flex items-center gap-2 text-sm px-3.5 py-2 rounded-xl font-medium ${
                expiryUrgent
                  ? 'bg-red-500/20 text-red-200 ring-1 ring-red-400/30'
                  : expiryWarning
                    ? 'bg-amber-400/20 text-amber-200 ring-1 ring-amber-300/30'
                    : 'bg-white/10 text-blue-100 ring-1 ring-white/10'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  expiryUrgent ? 'bg-red-400' : expiryWarning ? 'bg-amber-300' : 'bg-blue-300'
                }`}
              />
              <span>
                <span className="opacity-75">Next expiry: </span>
                {nextExpiry.label}{' '}
                {nextDays < 0 ? '(expired)' : nextDays === 0 ? 'today' : `in ${nextDays}d`}
              </span>
            </div>
          )}
        </div>

        {/* Breakdown: bank points converted + loyalty balance */}
        {(bankMiles > 0 || loyaltyMiles > 0) && (
          <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-3">
            {bankMiles > 0 && (
              <div className="flex flex-col gap-0.5">
                <p className="text-blue-200 text-xs">From bank points</p>
                <p className="text-white font-semibold text-xl tabular-nums leading-tight">{fmt(bankMiles)}</p>
              </div>
            )}
            {loyaltyMiles > 0 && (
              <div className="flex flex-col gap-0.5">
                <p className="text-blue-200 text-xs">{selectedProgramme} balance</p>
                <p className="text-white font-semibold text-xl tabular-nums leading-tight">{fmt(loyaltyMiles)}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
