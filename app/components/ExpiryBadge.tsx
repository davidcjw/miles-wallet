'use client';

import { getDaysUntilExpiry, getExpiryStatus } from '@/lib/utils';

/* DS has no yellow Surface tone, so expiry status keeps a token-styled
   chip to preserve the coral / yellow / green severity scale. */
const TONES: Record<string, { bg: string; fg: string }> = {
  expired: { bg: 'var(--rh-coral)', fg: 'var(--rh-white)' },
  urgent: { bg: 'var(--rh-coral)', fg: 'var(--rh-white)' },
  warning: { bg: 'var(--rh-yellow)', fg: 'var(--rh-black)' },
  good: { bg: 'var(--rh-green)', fg: 'var(--rh-black)' },
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
    status === 'expired' ? 'Expired' : days === 0 ? 'Expires today' : `${days}d left`;
  const tone = TONES[status];

  return (
    <span
      className={`inline-flex items-center self-start ${className}`}
      style={{
        background: tone.bg,
        color: tone.fg,
        border: 'var(--rh-border-width) solid var(--rh-black)',
        borderRadius: 'var(--rh-r-pill)',
        padding: '3px 12px',
        fontFamily: 'var(--rh-font)',
        fontSize: 'var(--rh-fs-label)',
        fontWeight: 'var(--rh-weight-bold)',
        letterSpacing: 'var(--rh-track-label)',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  );
}
