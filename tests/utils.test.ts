import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getDaysUntilExpiry,
  getExpiryStatus,
  milesFromPoints,
  fmt,
  uid,
} from '@/lib/utils';

// TZ is pinned to UTC in vitest.config.ts so the date math below is deterministic.
const NOW = '2026-07-01T00:00:00Z';

describe('getDaysUntilExpiry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });
  afterEach(() => vi.useRealTimers());

  it('returns null when no date given', () => {
    expect(getDaysUntilExpiry(undefined)).toBeNull();
  });

  it('returns 0 for today', () => {
    expect(getDaysUntilExpiry('2026-07-01')).toBe(0);
  });

  it('returns a negative count for a past date', () => {
    expect(getDaysUntilExpiry('2026-06-30')).toBe(-1);
  });

  it('returns the whole-day count for a future date', () => {
    expect(getDaysUntilExpiry('2026-07-31')).toBe(30);
    expect(getDaysUntilExpiry('2026-12-29')).toBe(181);
  });
});

describe('getExpiryStatus thresholds', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });
  afterEach(() => vi.useRealTimers());

  it('null without a date', () => {
    expect(getExpiryStatus(undefined)).toBeNull();
  });

  it('expired when already past', () => {
    expect(getExpiryStatus('2026-06-30')).toBe('expired');
  });

  it('urgent from today through 30 days (expiring soon)', () => {
    expect(getExpiryStatus('2026-07-01')).toBe('urgent'); // 0d
    expect(getExpiryStatus('2026-07-31')).toBe('urgent'); // 30d boundary
  });

  it('warning from 31 through 180 days', () => {
    expect(getExpiryStatus('2026-08-01')).toBe('warning'); // 31d
    expect(getExpiryStatus('2026-12-28')).toBe('warning'); // 180d boundary
  });

  it('good beyond 180 days (ok)', () => {
    expect(getExpiryStatus('2026-12-29')).toBe('good'); // 181d
  });
});

describe('milesFromPoints', () => {
  it('floors points divided by the points-per-mile rate', () => {
    expect(milesFromPoints(10000, 2.5)).toBe(4000);
    expect(milesFromPoints(999, 3)).toBe(333); // 333.0
    expect(milesFromPoints(1000, 3)).toBe(333); // floored from 333.33
  });

  it('returns 0 for a non-positive rate', () => {
    expect(milesFromPoints(1000, 0)).toBe(0);
    expect(milesFromPoints(1000, -1)).toBe(0);
  });
});

describe('fmt / uid', () => {
  it('formats numbers with en-SG grouping', () => {
    expect(fmt(1234567)).toBe('1,234,567');
  });

  it('generates unique-ish ids', () => {
    const a = uid();
    const b = uid();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[a-z0-9]+$/);
  });
});
