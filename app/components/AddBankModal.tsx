'use client';

import { useEffect, useState } from 'react';
import { BankAccount } from '@/types';
import { SUGGESTED_BANKS, SUGGESTED_LOYALTY_PROGRAMMES, SUGGESTED_RATES } from '@/lib/constants';
import { uid } from '@/lib/utils';

interface Props {
  initial?: BankAccount;
  onSave: (a: BankAccount) => void;
  onClose: () => void;
}

const empty = (): Omit<BankAccount, 'id'> => ({
  bankName: '',
  cardName: '',
  points: 0,
  loyaltyProgramme: '',
  conversionRate: 1,
  expiryDate: '',
});

export default function AddBankModal({ initial, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<BankAccount, 'id'>>(initial ?? empty());

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  // Auto-suggest conversion rate when bank + programme are set
  useEffect(() => {
    if (!initial) {
      const suggested = SUGGESTED_RATES[form.bankName]?.[form.loyaltyProgramme];
      if (suggested) setForm((f) => ({ ...f, conversionRate: suggested }));
    }
  }, [form.bankName, form.loyaltyProgramme, initial]);

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: initial?.id ?? uid() });
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
            {initial ? 'Edit Bank Account' : 'Add Bank Account'}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Bank
              </label>
              <input
                list="bank-list"
                value={form.bankName}
                onChange={(e) => set('bankName', e.target.value)}
                placeholder="e.g. DBS"
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
              />
              <datalist id="bank-list">
                {SUGGESTED_BANKS.map((b) => <option key={b} value={b} />)}
              </datalist>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Card Name
              </label>
              <input
                value={form.cardName}
                onChange={(e) => set('cardName', e.target.value)}
                placeholder="e.g. DBS Altitude"
                className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Points Balance
            </label>
            <input
              type="number"
              min={0}
              value={form.points || ''}
              onChange={(e) => set('points', Number(e.target.value))}
              placeholder="0"
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Loyalty Programme
            </label>
            <input
              list="loyalty-list"
              value={form.loyaltyProgramme}
              onChange={(e) => set('loyaltyProgramme', e.target.value)}
              placeholder="e.g. KrisFlyer"
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
            />
            <datalist id="loyalty-list">
              {SUGGESTED_LOYALTY_PROGRAMMES.map((l) => <option key={l} value={l} />)}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Conversion Rate
              <span className="font-normal text-neutral-400 ml-1">(points per 1 mile)</span>
            </label>
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={form.conversionRate || ''}
              onChange={(e) => set('conversionRate', Number(e.target.value))}
              placeholder="e.g. 3"
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
            />
            {form.points > 0 && form.conversionRate > 0 && (
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                = {Math.floor(form.points / form.conversionRate).toLocaleString()} miles
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Points Expiry Date
              <span className="font-normal text-neutral-400 ml-1">(optional)</span>
            </label>
            <input
              type="date"
              value={form.expiryDate ?? ''}
              onChange={(e) => set('expiryDate', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
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
              {initial ? 'Save Changes' : 'Add Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
