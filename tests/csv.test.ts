import { describe, expect, it } from 'vitest';
import { buildCSV, parseCSV } from '@/lib/csv';
import { CONVERSION_RATES } from '@/lib/constants';
import type { BankAccount, LoyaltyAccount } from '@/types';

const banks: BankAccount[] = [
  { id: 'b1', bankName: 'DBS', cardName: 'DBS Altitude Visa', points: 90000, expiryDate: '2027-01-31' },
  // Comma + quotes in the card name exercises CSV escaping.
  { id: 'b2', bankName: 'UOB', cardName: 'PRVI, "Miles"', points: 12345 },
  // A bank with no transfer rate to the selected programme.
  { id: 'b3', bankName: 'Maybank', cardName: 'World Mastercard', points: 5000, expiryDate: '2026-09-15' },
];

const loyalty: LoyaltyAccount[] = [
  { id: 'l1', programmeName: 'KrisFlyer', miles: 40000, expiryDate: '2026-12-01' },
  { id: 'l2', programmeName: 'Asia Miles', miles: 8000 },
];

describe('CSV export/import round-trip', () => {
  it('recovers all account content (ids excluded — not stored in CSV)', () => {
    const csv = buildCSV(banks, loyalty, 'KrisFlyer');
    const parsed = parseCSV(csv);

    const bankContent = (b: BankAccount) => ({
      bankName: b.bankName,
      cardName: b.cardName,
      points: b.points,
      expiryDate: b.expiryDate,
    });
    const loyaltyContent = (l: LoyaltyAccount) => ({
      programmeName: l.programmeName,
      miles: l.miles,
      expiryDate: l.expiryDate,
    });

    expect(parsed.banks.map(bankContent)).toEqual(banks.map(bankContent));
    expect(parsed.loyalty.map(loyaltyContent)).toEqual(loyalty.map(loyaltyContent));
  });

  it('assigns fresh ids to imported rows', () => {
    const parsed = parseCSV(buildCSV(banks, loyalty, 'KrisFlyer'));
    for (const b of parsed.banks) expect(b.id).toBeTruthy();
    expect(new Set(parsed.banks.map((b) => b.id)).size).toBe(parsed.banks.length);
  });

  it('writes the miles-equivalent column using the conversion rate', () => {
    const csv = buildCSV(banks, loyalty, 'KrisFlyer');
    const lines = csv.split('\n');

    expect(lines[0]).toContain('KrisFlyer Miles Equivalent');

    // DBS 90000 pts at 3 pts/mile → 30000 miles.
    const rate = CONVERSION_RATES.DBS.KrisFlyer;
    expect(Math.floor(90000 / rate)).toBe(30000);
    expect(lines[1]).toContain('"30000"');

    // Maybank has no KrisFlyer rate → empty equivalent, but points still preserved.
    const maybank = parseCSV(csv).banks.find((b) => b.bankName === 'Maybank');
    expect(maybank?.points).toBe(5000);
  });

  it('ignores the header row and blank lines when parsing', () => {
    const csv = buildCSV([], [], 'KrisFlyer') + '\n';
    const parsed = parseCSV(csv);
    expect(parsed.banks).toEqual([]);
    expect(parsed.loyalty).toEqual([]);
  });
});
