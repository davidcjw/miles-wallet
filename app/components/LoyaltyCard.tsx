'use client';

import { Surface, Text } from 'rawhouse-ds';
import { LoyaltyAccount } from '@/types';
import { fmt } from '@/lib/utils';
import ExpiryBadge from './ExpiryBadge';

const ICON_BTN =
  'p-1.5 rounded-full transition-colors hover:bg-[color:var(--rh-cream)] opacity-0 group-hover:opacity-100';

interface Props {
  account: LoyaltyAccount;
  onEdit: (a: LoyaltyAccount) => void;
  onDelete: (id: string) => void;
}

export default function LoyaltyCard({ account, onEdit, onDelete }: Props) {
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
          <Surface
            tone="green"
            radius="md"
            bordered
            className="flex items-center justify-center shrink-0"
            style={{ width: 32, height: 32 }}
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M7 1l1.5 3.5L12 5l-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5L7 1z" stroke="black" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Surface>
          <Text as="p" size="lead" weight="extrabold" style={{ lineHeight: 1.1 }}>
            {account.programmeName}
          </Text>
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
          <span className="tabular-nums">{fmt(account.miles)}</span>
          <Text as="span" size="small" tone="muted" weight="bold" style={{ marginLeft: 6 }}>
            miles
          </Text>
        </Text>
      </div>

      <ExpiryBadge expiryDate={account.expiryDate} />
    </Surface>
  );
}
