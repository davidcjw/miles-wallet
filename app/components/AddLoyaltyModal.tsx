'use client';

import { useState } from 'react';
import { LoyaltyAccount } from '@/types';
import { SUGGESTED_LOYALTY_PROGRAMMES } from '@/lib/constants';
import { uid } from '@/lib/utils';
import SelectWithOther from './SelectWithOther';

interface Props {
  initial?: LoyaltyAccount;
  onSave: (a: LoyaltyAccount) => void;
  onClose: () => void;
}

const INPUT_CLASS =
  'w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors';

export default function AddLoyaltyModal({ initial, onSave, onClose }: Props) {
  const [programmeName, setProgrammeName] = useState(initial?.programmeName ?? '');
  const [miles, setMiles] = useState(initial?.miles ?? 0);
  const [expiryDate, setExpiryDate] = useState(initial?.expiryDate ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initial?.id ?? uid(),
      programmeName,
      miles,
      expiryDate: expiryDate || undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
            {initial ? 'Edit Loyalty Account' : 'Add Loyalty Miles'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Loyalty Programme
            </label>
            <SelectWithOther
              value={programmeName}
              onChange={setProgrammeName}
              options={SUGGESTED_LOYALTY_PROGRAMMES}
              placeholder="Select programme…"
              customPlaceholder="Enter programme name"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Miles Balance
            </label>
            <input
              type="number"
              min={0}
              value={miles || ''}
              onChange={(e) => setMiles(Number(e.target.value))}
              placeholder="0"
              required
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Miles Expiry Date
              <span className="font-normal text-neutral-400 ml-1">(optional)</span>
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              {initial ? 'Save Changes' : 'Add Miles'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
