'use client';

import { useState } from 'react';
import { Surface, Text, Button, IconButton } from 'rawhouse-ds';
import { LoyaltyAccount } from '@/types';
import { SUGGESTED_LOYALTY_PROGRAMMES } from '@/lib/constants';
import { uid } from '@/lib/utils';
import SelectWithOther from './SelectWithOther';

interface Props {
  initial?: LoyaltyAccount;
  onSave: (a: LoyaltyAccount) => void;
  onClose: () => void;
}

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Surface tone="white" radius="xl" bordered sticker className="w-full max-w-md" style={{ padding: 0 }}>
        <div className="flex items-center justify-between" style={{ padding: '20px 24px', borderBottom: 'var(--rh-border-width) solid var(--rh-black)' }}>
          <Text as="h2" size="title" weight="extrabold">
            {initial ? 'Edit Loyalty Account' : 'Add Loyalty Miles'}
          </Text>
          <IconButton aria-label="Close" variant="outline" size={36} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </IconButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" style={{ padding: 24 }}>
          <div>
            <label className="rh-label">Loyalty Programme</label>
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
            <label className="rh-label">Miles Balance</label>
            <input
              type="number"
              min={0}
              value={miles || ''}
              onChange={(e) => setMiles(Number(e.target.value))}
              placeholder="0"
              required
              className="rh-field"
            />
          </div>

          <div>
            <label className="rh-label">Miles Expiry Date (optional)</label>
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
            <Button as="button" type="submit" variant="green" className="flex-1">
              {initial ? 'Save Changes' : 'Add Miles'}
            </Button>
          </div>
        </form>
      </Surface>
    </div>
  );
}
