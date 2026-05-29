'use client';

import { BankAccount, LoyaltyAccount } from '@/types';
import { milesFromPoints, fmt, getDaysUntilExpiry, getExpiryStatus } from '@/lib/utils';

interface Props {
  banks: BankAccount[];
  loyalty: LoyaltyAccount[];
}

export default function SummaryStats({ banks, loyalty }: Props) {
  // Group bank miles by loyalty programme
  const byProgramme: Record<string, number> = {};
  for (const b of banks) {
    const miles = milesFromPoints(b.points, b.conversionRate);
    byProgramme[b.loyaltyProgramme] = (byProgramme[b.loyaltyProgramme] ?? 0) + miles;
  }
  for (const l of loyalty) {
    byProgramme[l.programmeName] = (byProgramme[l.programmeName] ?? 0) + l.miles;
  }

  const totalMiles = Object.values(byProgramme).reduce((a, b) => a + b, 0);

  // Next expiry across all accounts
  const allExpiries = [
    ...banks.filter((b) => b.expiryDate).map((b) => ({ label: b.cardName || b.bankName, date: b.expiryDate! })),
    ...loyalty.filter((l) => l.expiryDate).map((l) => ({ label: l.programmeName, date: l.expiryDate! })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const nextExpiry = allExpiries[0];
  const nextDays = nextExpiry ? getDaysUntilExpiry(nextExpiry.date) : null;
  const nextStatus = nextExpiry ? getExpiryStatus(nextExpiry.date) : null;

  const programmes = Object.entries(byProgramme).sort((a, b) => b[1] - a[1]);

  if (banks.length === 0 && loyalty.length === 0) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Total Miles Equivalent</p>
          <p className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            {fmt(totalMiles)}
          </p>
        </div>
        {nextExpiry && nextDays !== null && (
          <div
            className={`text-sm px-3 py-2 rounded-xl border ${
              nextStatus === 'expired' || nextStatus === 'urgent'
                ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-900 dark:text-red-400'
                : nextStatus === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-400'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400'
            }`}
          >
            <span className="font-medium">Next expiry:</span>{' '}
            {nextExpiry.label}{' '}
            {nextDays < 0 ? '(expired)' : nextDays === 0 ? '(today)' : `in ${nextDays}d`}
          </div>
        )}
      </div>

      {programmes.length > 1 && (
        <div className="mt-5 pt-5 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-4">
          {programmes.map(([name, miles]) => (
            <div key={name}>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{name}</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {fmt(miles)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
