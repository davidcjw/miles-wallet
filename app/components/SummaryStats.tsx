'use client';

import { BankAccount, LoyaltyAccount } from '@/types';
import { milesFromPoints, fmt, getDaysUntilExpiry, getExpiryStatus } from '@/lib/utils';

interface Props {
  banks: BankAccount[];
  loyalty: LoyaltyAccount[];
}

export default function SummaryStats({ banks, loyalty }: Props) {
  const byProgramme: Record<string, number> = {};
  for (const b of banks) {
    const miles = milesFromPoints(b.points, b.conversionRate);
    byProgramme[b.loyaltyProgramme] = (byProgramme[b.loyaltyProgramme] ?? 0) + miles;
  }
  for (const l of loyalty) {
    byProgramme[l.programmeName] = (byProgramme[l.programmeName] ?? 0) + l.miles;
  }

  const totalMiles = Object.values(byProgramme).reduce((a, b) => a + b, 0);

  const allExpiries = [
    ...banks.filter((b) => b.expiryDate).map((b) => ({ label: b.cardName || b.bankName, date: b.expiryDate! })),
    ...loyalty.filter((l) => l.expiryDate).map((l) => ({ label: l.programmeName, date: l.expiryDate! })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const nextExpiry = allExpiries[0];
  const nextDays = nextExpiry ? getDaysUntilExpiry(nextExpiry.date) : null;
  const nextStatus = nextExpiry ? getExpiryStatus(nextExpiry.date) : null;

  const programmes = Object.entries(byProgramme).sort((a, b) => b[1] - a[1]);

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
        {/* Label */}
        <p className="text-blue-200 text-xs font-medium tracking-widest uppercase mb-3">
          Total Miles Equivalent
        </p>

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

        {/* Programme breakdown */}
        {programmes.length > 0 && (
          <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-3">
            {programmes.map(([name, miles]) => (
              <div key={name} className="flex flex-col gap-0.5">
                <p className="text-blue-200 text-xs">{name}</p>
                <p className="text-white font-semibold text-xl tabular-nums leading-tight">
                  {fmt(miles)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
