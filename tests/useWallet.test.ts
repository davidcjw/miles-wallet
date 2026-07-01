import { beforeEach, describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWallet } from '@/hooks/useWallet';
import type { BankAccount, LoyaltyAccount } from '@/types';

const KEY = 'miles-wallet-data';
const PROG_KEY = 'miles-wallet-programme';

const bank = (id: string): BankAccount => ({
  id,
  bankName: 'DBS',
  cardName: 'DBS Altitude Visa',
  points: 50000,
  expiryDate: '2027-01-01',
});

const loyaltyAcct = (id: string): LoyaltyAccount => ({
  id,
  programmeName: 'KrisFlyer',
  miles: 10000,
});

describe('useWallet', () => {
  beforeEach(() => localStorage.clear());

  it('starts empty and ready with the default programme', () => {
    const { result } = renderHook(() => useWallet());
    expect(result.current.ready).toBe(true);
    expect(result.current.banks).toEqual([]);
    expect(result.current.selectedProgramme).toBe('KrisFlyer');
  });

  it('adds a bank and persists it to localStorage', () => {
    const { result } = renderHook(() => useWallet());

    act(() => result.current.addBank(bank('b1')));

    expect(result.current.banks).toHaveLength(1);
    expect(result.current.banks[0].id).toBe('b1');

    const persisted = JSON.parse(localStorage.getItem(KEY)!);
    expect(persisted.banks).toHaveLength(1);
    expect(persisted.banks[0].bankName).toBe('DBS');
  });

  it('removes a bank', () => {
    const { result } = renderHook(() => useWallet());

    act(() => {
      result.current.addBank(bank('b1'));
      result.current.addBank(bank('b2'));
    });
    expect(result.current.banks).toHaveLength(2);

    act(() => result.current.deleteBank('b1'));

    expect(result.current.banks.map((b) => b.id)).toEqual(['b2']);
    const persisted = JSON.parse(localStorage.getItem(KEY)!);
    expect(persisted.banks.map((b: BankAccount) => b.id)).toEqual(['b2']);
  });

  it('hydrates existing state from localStorage on mount', () => {
    localStorage.setItem(KEY, JSON.stringify({ banks: [bank('seed')], loyalty: [loyaltyAcct('l1')] }));
    localStorage.setItem(PROG_KEY, 'Asia Miles');

    const { result } = renderHook(() => useWallet());

    expect(result.current.banks.map((b) => b.id)).toEqual(['seed']);
    expect(result.current.loyalty.map((l) => l.id)).toEqual(['l1']);
    expect(result.current.selectedProgramme).toBe('Asia Miles');
  });

  it('persists the selected programme when it changes', () => {
    const { result } = renderHook(() => useWallet());

    act(() => result.current.setSelectedProgramme('Avios'));

    expect(result.current.selectedProgramme).toBe('Avios');
    expect(localStorage.getItem(PROG_KEY)).toBe('Avios');
  });
});
