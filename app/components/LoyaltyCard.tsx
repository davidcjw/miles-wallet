'use client';

import { LoyaltyAccount } from '@/types';
import { fmt } from '@/lib/utils';
import ExpiryBadge from './ExpiryBadge';

interface Props {
  account: LoyaltyAccount;
  onEdit: (a: LoyaltyAccount) => void;
  onDelete: (id: string) => void;
}

export default function LoyaltyCard({ account, onEdit, onDelete }: Props) {
  return (
    <div className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1l1.5 3.5L12 5l-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5L7 1z"
                stroke="#3b82f6"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">{account.programmeName}</p>
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
          {fmt(account.miles)}
          <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400 ml-1.5">miles</span>
        </p>
      </div>

      <ExpiryBadge expiryDate={account.expiryDate} />
    </div>
  );
}
