import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExpiryBadge from '@/components/ExpiryBadge';

const NOW = '2026-07-01T00:00:00Z';

describe('ExpiryBadge thresholds', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });
  afterEach(() => vi.useRealTimers());

  it('renders nothing without an expiry date', () => {
    const { container } = render(<ExpiryBadge />);
    expect(container.firstChild).toBeNull();
  });

  it('shows "Expired" (coral) for a past date', () => {
    render(<ExpiryBadge expiryDate="2026-06-30" />);
    const el = screen.getByText('Expired');
    expect(el.style.background).toBe('var(--rh-coral)');
  });

  it('shows "Expires today" at 0 days (expiring soon → coral)', () => {
    render(<ExpiryBadge expiryDate="2026-07-01" />);
    const el = screen.getByText('Expires today');
    expect(el.style.background).toBe('var(--rh-coral)');
  });

  it('shows "Nd left" and coral within the 30-day urgent window', () => {
    render(<ExpiryBadge expiryDate="2026-07-31" />);
    const el = screen.getByText('30d left');
    expect(el.style.background).toBe('var(--rh-coral)');
  });

  it('uses the yellow warning tone between 31 and 180 days', () => {
    render(<ExpiryBadge expiryDate="2026-08-01" />);
    const el = screen.getByText('31d left');
    expect(el.style.background).toBe('var(--rh-yellow)');
  });

  it('uses the green ok tone beyond 180 days', () => {
    render(<ExpiryBadge expiryDate="2026-12-29" />);
    const el = screen.getByText('181d left');
    expect(el.style.background).toBe('var(--rh-green)');
  });
});
