export function getDaysUntilExpiry(expiryDate: string | undefined): number | null {
  if (!expiryDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export type ExpiryStatus = 'good' | 'warning' | 'urgent' | 'expired';

export function getExpiryStatus(expiryDate: string | undefined): ExpiryStatus | null {
  const days = getDaysUntilExpiry(expiryDate);
  if (days === null) return null;
  if (days < 0) return 'expired';
  if (days <= 30) return 'urgent';
  if (days <= 180) return 'warning';
  return 'good';
}

export function milesFromPoints(points: number, rate: number): number {
  if (rate <= 0) return 0;
  return Math.floor(points / rate);
}

export function fmt(n: number): string {
  return n.toLocaleString('en-SG');
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
