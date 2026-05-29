import { BankAccount, LoyaltyAccount } from '@/types';
import { getDaysUntilExpiry, milesFromPoints } from './utils';

function row(cells: string[]): string {
  return cells.map((c) => `"${c.replace(/"/g, '""')}"`).join(',');
}

export function exportToCSV(banks: BankAccount[], loyalty: LoyaltyAccount[]) {
  const headers = [
    'Type',
    'Institution',
    'Card / Programme',
    'Points / Miles',
    'Conversion Rate (pts per mile)',
    'Miles Equivalent',
    'Expiry Date',
    'Days Until Expiry',
  ];

  const bankRows = banks.map((b) =>
    row([
      'Bank Points',
      b.bankName,
      b.cardName,
      String(b.points),
      String(b.conversionRate),
      String(milesFromPoints(b.points, b.conversionRate)),
      b.expiryDate ?? '',
      b.expiryDate ? String(getDaysUntilExpiry(b.expiryDate)) : '',
    ])
  );

  const loyaltyRows = loyalty.map((l) =>
    row([
      'Loyalty Miles',
      l.programmeName,
      '',
      String(l.miles),
      '1',
      String(l.miles),
      l.expiryDate ?? '',
      l.expiryDate ? String(getDaysUntilExpiry(l.expiryDate)) : '',
    ])
  );

  const csv = [row(headers), ...bankRows, ...loyaltyRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `miles-wallet-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
