'use client';

import { useEffect, useState } from 'react';
import { BankAccount } from '@/types';
import {
  SUGGESTED_BANKS,
  SUGGESTED_LOYALTY_PROGRAMMES,
  SUGGESTED_RATES,
  CARD_SUGGESTIONS,
} from '@/lib/constants';
import { uid } from '@/lib/utils';
import SelectWithOther from './SelectWithOther';

interface Props {
  initial?: BankAccount;
  defaultLoyaltyProgramme?: string;
  existingLoyaltyProgrammes?: string[];
  onSave: (a: BankAccount) => void;
  onClose: () => void;
}

const INPUT_CLASS =
  'w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors';

export default function AddBankModal({
  initial,
  defaultLoyaltyProgramme = 'KrisFlyer',
  existingLoyaltyProgrammes = [],
  onSave,
  onClose,
}: Props) {
  const [bankName, setBankName] = useState(initial?.bankName ?? '');
  const [cardName, setCardName] = useState(initial?.cardName ?? '');
  const [points, setPoints] = useState(initial?.points ?? 0);
  const [loyaltyProgramme, setLoyaltyProgramme] = useState(
    initial?.loyaltyProgramme ?? defaultLoyaltyProgramme
  );
  const [conversionRate, setConversionRate] = useState(initial?.conversionRate ?? 1);
  const [expiryDate, setExpiryDate] = useState(initial?.expiryDate ?? '');

  // Merge user's own programmes (first) with standard suggestions (deduped)
  const loyaltyOptions = [
    ...existingLoyaltyProgrammes,
    ...SUGGESTED_LOYALTY_PROGRAMMES.filter((p) => !existingLoyaltyProgrammes.includes(p)),
  ];

  const cardOptions = bankName ? (CARD_SUGGESTIONS[bankName] ?? []) : [];

  // Auto-fill conversion rate when bank + loyalty combo is known
  useEffect(() => {
    if (!initial) {
      const suggested = SUGGESTED_RATES[bankName]?.[loyaltyProgramme];
      if (suggested) setConversionRate(suggested);
    }
  }, [bankName, loyaltyProgramme, initial]);

  // Reset card name when bank changes (stale card names from another bank)
  const prevBank = initial?.bankName;
  const handleBankChange = (v: string) => {
    setBankName(v);
    if (v !== prevBank) setCardName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initial?.id ?? uid(),
      bankName,
      cardName,
      points,
      loyaltyProgramme,
      conversionRate,
      expiryDate: expiryDate || undefined,
    });
    onClose();
  };

  const milesPreview = points > 0 && conversionRate > 0
    ? Math.floor(points / conversionRate).toLocaleString()
    : null;

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
          {/* Bank */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Bank
            </label>
            <SelectWithOther
              value={bankName}
              onChange={handleBankChange}
              options={SUGGESTED_BANKS}
              placeholder="Select bank…"
              customPlaceholder="Enter bank name"
              required
            />
          </div>

          {/* Card name — dropdown if bank has suggestions, otherwise text */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Card Name
              <span className="font-normal text-neutral-400 ml-1">(optional)</span>
            </label>
            {cardOptions.length > 0 ? (
              <SelectWithOther
                value={cardName}
                onChange={setCardName}
                options={cardOptions}
                placeholder="Select card…"
                customPlaceholder="Enter card name"
              />
            ) : (
              <input
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="e.g. DBS Altitude"
                className={INPUT_CLASS}
              />
            )}
          </div>

          {/* Points */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Points Balance
            </label>
            <input
              type="number"
              min={0}
              value={points || ''}
              onChange={(e) => setPoints(Number(e.target.value))}
              placeholder="0"
              required
              className={INPUT_CLASS}
            />
          </div>

          {/* Loyalty programme */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Loyalty Programme
            </label>
            <SelectWithOther
              value={loyaltyProgramme}
              onChange={setLoyaltyProgramme}
              options={loyaltyOptions}
              placeholder="Select programme…"
              customPlaceholder="Enter programme name"
              required
            />
          </div>

          {/* Conversion rate */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Conversion Rate
              <span className="font-normal text-neutral-400 ml-1">(points per 1 mile)</span>
            </label>
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={conversionRate || ''}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              required
              className={INPUT_CLASS}
            />
            {milesPreview && (
              <p className="mt-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
                = {milesPreview} {loyaltyProgramme || 'miles'}
              </p>
            )}
          </div>

          {/* Expiry */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Points Expiry Date
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
              {initial ? 'Save Changes' : 'Add Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
