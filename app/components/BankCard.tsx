'use client';

import { Surface, Text } from 'rawhouse-ds';
import { BankAccount } from '@/types';
import { CONVERSION_RATES } from '@/lib/constants';
import { milesFromPoints, fmt } from '@/lib/utils';
import ExpiryBadge from './ExpiryBadge';

const BRAND_ACCENTS = [
  'var(--rh-coral)',
  'var(--rh-green)',
  'var(--rh-purple)',
  'var(--rh-yellow)',
  'var(--rh-black)',
];

const ICON_BTN =
  'p-1.5 rounded-full transition-colors hover:bg-[color:var(--rh-cream)] opacity-0 group-hover:opacity-100';

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
  const accent = BRAND_ACCENTS[index % BRAND_ACCENTS.length];

  return (
    <Surface
      tone="white"
      radius="xl"
      sticker
      bordered
      className="group flex flex-col gap-3"
      style={{ padding: 20 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 'var(--rh-r-pill)',
              background: accent,
              border: 'var(--rh-border-width) solid var(--rh-black)',
              flexShrink: 0,
              marginTop: 4,
            }}
          />
          <div>
            <Text as="p" size="lead" weight="extrabold" style={{ lineHeight: 1.1 }}>
              {account.bankName}
            </Text>
            {account.cardName && (
              <Text as="p" size="small" tone="muted" style={{ marginTop: 2 }}>
                {account.cardName}
              </Text>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(account)} className={ICON_BTN} aria-label="Edit">
            <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
              <path d="M9.5 1.5l2 2-8 8H1.5v-2l8-8zM8 3l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(account.id)}
            className={`${ICON_BTN} hover:text-[color:var(--rh-coral)]`}
            aria-label="Delete"
          >
            <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
              <path d="M2 3.5h9M4.5 3.5V2.5h4v1M5 6v4M8 6v4M2.5 3.5l.5 7.5h7l.5-7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div>
        <Text as="p" size="display" weight="extrabold" style={{ lineHeight: 1 }}>
          <span className="tabular-nums">{fmt(account.points)}</span>
          <Text as="span" size="small" tone="muted" weight="bold" style={{ marginLeft: 6 }}>
            pts
          </Text>
        </Text>
        {miles !== null ? (
          <Text as="p" size="small" tone="muted" style={{ marginTop: 4 }}>
            ≈{' '}
            <Text as="span" size="small" weight="extrabold" tone="green">
              {fmt(miles)} {selectedProgramme} miles
            </Text>{' '}
            <Text as="span" size="small" tone="muted">({rate}:1)</Text>
          </Text>
        ) : (
          <Text as="p" size="small" tone="muted" style={{ marginTop: 4 }}>
            No {selectedProgramme} transfer rate
          </Text>
        )}
      </div>

      <ExpiryBadge expiryDate={account.expiryDate} />
    </Surface>
  );
}
