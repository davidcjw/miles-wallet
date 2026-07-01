import { BankAccount, LoyaltyAccount } from '@/types';
import { CONVERSION_RATES } from './constants';
import { getDaysUntilExpiry, milesFromPoints, uid } from './utils';

function row(cells: string[]): string {
  return cells.map((c) => `"${c.replace(/"/g, '""')}"`).join(',');
}

/**
 * Build the CSV text for the current wallet. Pure — no DOM — so it can be
 * unit-tested and round-tripped through `parseCSV`.
 */
export function buildCSV(
  banks: BankAccount[],
  loyalty: LoyaltyAccount[],
  selectedProgramme: string
): string {
  const headers = [
    'Type',
    'Institution',
    'Card / Programme',
    'Points / Miles',
    `${selectedProgramme} Miles Equivalent`,
    'Expiry Date',
    'Days Until Expiry',
  ];

  const bankRows = banks.map((b) => {
    const rate = CONVERSION_RATES[b.bankName]?.[selectedProgramme];
    const miles = rate ? milesFromPoints(b.points, rate) : '';
    return row([
      'Bank Points',
      b.bankName,
      b.cardName,
      String(b.points),
      String(miles),
      b.expiryDate ?? '',
      b.expiryDate ? String(getDaysUntilExpiry(b.expiryDate)) : '',
    ]);
  });

  const loyaltyRows = loyalty.map((l) =>
    row([
      'Loyalty Miles',
      l.programmeName,
      '',
      String(l.miles),
      l.programmeName === selectedProgramme ? String(l.miles) : '',
      l.expiryDate ?? '',
      l.expiryDate ? String(getDaysUntilExpiry(l.expiryDate)) : '',
    ])
  );

  return [row(headers), ...bankRows, ...loyaltyRows].join('\n');
}

/** Split one CSV line into cells, unescaping the doubled-quote encoding `row` emits. */
function parseLine(line: string): string[] {
  const cells: string[] = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      cells.push(cell);
      cell = '';
    } else {
      cell += ch;
    }
  }
  cells.push(cell);
  return cells;
}

/**
 * Parse CSV text produced by `buildCSV` back into wallet accounts. The `id`
 * isn't stored in the CSV, so imported rows get freshly-minted ids.
 */
export function parseCSV(csv: string): { banks: BankAccount[]; loyalty: LoyaltyAccount[] } {
  const banks: BankAccount[] = [];
  const loyalty: LoyaltyAccount[] = [];

  for (const line of csv.split('\n')) {
    if (!line.trim()) continue;
    const cells = parseLine(line);
    const [type, institution, card, amount, , expiry] = cells;
    if (type === 'Type' || !type) continue; // header row

    const expiryDate = expiry ? expiry : undefined;
    if (type === 'Bank Points') {
      banks.push({ id: uid(), bankName: institution, cardName: card, points: Number(amount), expiryDate });
    } else if (type === 'Loyalty Miles') {
      loyalty.push({ id: uid(), programmeName: institution, miles: Number(amount), expiryDate });
    }
  }

  return { banks, loyalty };
}

export function exportToCSV(banks: BankAccount[], loyalty: LoyaltyAccount[], selectedProgramme: string) {
  const csv = buildCSV(banks, loyalty, selectedProgramme);
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
