'use client';

import { BankAccount } from '@/types';
import { CONVERSION_RATES } from '@/lib/constants';
import { milesFromPoints, fmt } from '@/lib/utils';
import ExpiryBadge from './ExpiryBadge';

const ACCENT_COLORS = [
  'bg-blue-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-indigo-500',
];

interface Props {
  account: BankAccount;
  index: number;
  selectedProgramme: string;
  onEdit: (a: BankAccount) => void;
  onDelete: (id: string) => void;
}

export default function BankCard({ account, index, selectedProgramme, onEdit, onDelete }: Props) {
  const rate = CONVERSION_RATES[account.bankName]?.[selectedProgramme];
  const miles = rate ? milesFromPoints(account.points, rate) : null;
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <div className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${accent} mt-0.5 shrink-0`} />
          <div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
              {account.bankName}
            </p>
            {account.cardName && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{account.cardName}</p>
            )}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(account)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Edit"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M9.5 1.5l2 2-8 8H1.5v-2l8-8zM8 3l2 2"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(account.id)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            aria-label="Delete"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M2 3.5h9M4.5 3.5V2.5h4v1M5 6v4M8 6v4M2.5 3.5l.5 7.5h7l.5-7.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold tabular-nums tracking-tight text-neutral-900 dark:text-neutral-50">
          {fmt(account.points)}
          <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400 ml-1.5">pts</span>
        </p>
        {miles !== null ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            ≈{' '}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {fmt(miles)} {selectedProgramme} miles
            </span>{' '}
            <span className="text-xs">({rate}:1)</span>
          </p>
        ) : (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
            No {selectedProgramme} transfer rate
          </p>
        )}
      </div>

      <ExpiryBadge expiryDate={account.expiryDate} />
    </div>
  );
}
