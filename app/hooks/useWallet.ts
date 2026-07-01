'use client';

import { useState, useEffect } from 'react';
import { BankAccount, LoyaltyAccount } from '@/types';

const KEY = 'miles-wallet-data';
const PROG_KEY = 'miles-wallet-programme';

export function useWallet() {
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltyAccount[]>([]);
  const [selectedProgramme, setSelectedProgramme] = useState('KrisFlyer');
  const [ready, setReady] = useState(false);

  // One-time hydration from localStorage, which is unavailable during SSR, so
  // the setState calls must happen in an effect (rule is a false positive here).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setBanks(data.banks ?? []);
        setLoyalty(data.loyalty ?? []);
      }
      const prog = localStorage.getItem(PROG_KEY);
      if (prog) setSelectedProgramme(prog);
    } catch {}
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify({ banks, loyalty }));
  }, [banks, loyalty, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(PROG_KEY, selectedProgramme);
  }, [selectedProgramme, ready]);

  return {
    banks,
    loyalty,
    selectedProgramme,
    setSelectedProgramme,
    ready,
    addBank: (a: BankAccount) => setBanks((p) => [...p, a]),
    updateBank: (a: BankAccount) => setBanks((p) => p.map((x) => (x.id === a.id ? a : x))),
    deleteBank: (id: string) => setBanks((p) => p.filter((x) => x.id !== id)),
    addLoyalty: (a: LoyaltyAccount) => setLoyalty((p) => [...p, a]),
    updateLoyalty: (a: LoyaltyAccount) => setLoyalty((p) => p.map((x) => (x.id === a.id ? a : x))),
    deleteLoyalty: (id: string) => setLoyalty((p) => p.filter((x) => x.id !== id)),
    replaceAll: (b: BankAccount[], l: LoyaltyAccount[]) => { setBanks(b); setLoyalty(l); },
  };
}
