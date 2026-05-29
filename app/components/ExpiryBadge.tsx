'use client';

import { getDaysUntilExpiry, getExpiryStatus } from '@/lib/utils';

const styles = {
  expired: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  urgent: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  good: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
};

export default function ExpiryBadge({
  expiryDate,
  className = '',
}: {
  expiryDate?: string;
  className?: string;
}) {
  const days = getDaysUntilExpiry(expiryDate);
  const status = getExpiryStatus(expiryDate);

  if (status === null) return null;

  const label =
    status === 'expired'
      ? 'Expired'
      : days === 0
        ? 'Expires today'
        : `${days}d left`;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${styles[status]} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'expired'
            ? 'bg-red-500'
            : status === 'urgent'
              ? 'bg-orange-500'
              : status === 'warning'
                ? 'bg-amber-500'
                : 'bg-emerald-500'
        }`}
      />
      {label}
    </span>
  );
}
