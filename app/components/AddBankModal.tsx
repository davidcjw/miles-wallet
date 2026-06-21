'use client';

import { useState } from 'react';
import { Surface, Text, Button, IconButton } from 'rawhouse-ds';
import { BankAccount } from '@/types';
import { SUGGESTED_BANKS, CARD_SUGGESTIONS } from '@/lib/constants';
import { uid } from '@/lib/utils';
import SelectWithOther from './SelectWithOther';

interface Props {
  initial?: BankAccount;
  onSave: (a: BankAccount) => void;
  onClose: () => void;
}

export default function AddBankModal({ initial, onSave, onClose }: Props) {
  const [bankName, setBankName] = useState(initial?.bankName ?? '');
  const [cardName, setCardName] = useState(initial?.cardName ?? '');
  const [points, setPoints] = useState(initial?.points ?? 0);
  const [expiryDate, setExpiryDate] = useState(initial?.expiryDate ?? '');

  const cardOptions = bankName ? (CARD_SUGGESTIONS[bankName] ?? []) : [];

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
      expiryDate: expiryDate || undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Surface tone="white" radius="xl" bordered sticker className="w-full max-w-md" style={{ padding: 0 }}>
        <div className="flex items-center justify-between" style={{ padding: '20px 24px', borderBottom: 'var(--rh-border-width) solid var(--rh-black)' }}>
          <Text as="h2" size="title" weight="extrabold">
            {initial ? 'Edit Bank Account' : 'Add Bank Account'}
          </Text>
          <IconButton aria-label="Close" variant="outline" size={36} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </IconButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" style={{ padding: 24 }}>
          <div>
            <label className="rh-label">Bank</label>
            <SelectWithOther
              value={bankName}
              onChange={handleBankChange}
              options={SUGGESTED_BANKS}
              placeholder="Select bank…"
              customPlaceholder="Enter bank name"
              required
            />
          </div>

          <div>
            <label className="rh-label">Card Name (optional)</label>
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
                className="rh-field"
              />
            )}
          </div>

          <div>
            <label className="rh-label">Points Balance</label>
            <input
              type="number"
              min={0}
              value={points || ''}
              onChange={(e) => setPoints(Number(e.target.value))}
              placeholder="0"
              required
              className="rh-field"
            />
          </div>

          <div>
            <label className="rh-label">Points Expiry Date (optional)</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="rh-field"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button as="button" type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button as="button" type="submit" variant="coral" className="flex-1">
              {initial ? 'Save Changes' : 'Add Account'}
            </Button>
          </div>
        </form>
      </Surface>
    </div>
  );
}
