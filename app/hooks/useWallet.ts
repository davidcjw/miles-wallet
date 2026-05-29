'use client';

import { useState, useEffect } from 'react';
import { BankAccount, LoyaltyAccount } from '@/types';

const KEY = 'miles-wallet-data';

export function useWallet() {
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltyAccount[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setBanks(data.banks ?? []);
        setLoyalty(data.loyalty ?? []);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify({ banks, loyalty }));
  }, [banks, loyalty, ready]);

  return {
    banks,
    loyalty,
    ready,
    addBank: (a: BankAccount) => setBanks((p) => [...p, a]),
    updateBank: (a: BankAccount) => setBanks((p) => p.map((x) => (x.id === a.id ? a : x))),
    deleteBank: (id: string) => setBanks((p) => p.filter((x) => x.id !== id)),
    addLoyalty: (a: LoyaltyAccount) => setLoyalty((p) => [...p, a]),
    updateLoyalty: (a: LoyaltyAccount) => setLoyalty((p) => p.map((x) => (x.id === a.id ? a : x))),
    deleteLoyalty: (id: string) => setLoyalty((p) => p.filter((x) => x.id !== id)),
  };
}
