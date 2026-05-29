'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { exportToCSV } from '@/lib/csv';
import { BankAccount, LoyaltyAccount } from '@/types';
import Header from '@/components/Header';
import SummaryStats from '@/components/SummaryStats';
import BankCard from '@/components/BankCard';
import LoyaltyCard from '@/components/LoyaltyCard';
import AddBankModal from '@/components/AddBankModal';
import AddLoyaltyModal from '@/components/AddLoyaltyModal';
import SyncModal from '@/components/SyncModal';

type BankModal = { open: false } | { open: true; editing?: BankAccount };
type LoyaltyModal = { open: false } | { open: true; editing?: LoyaltyAccount };

export default function Page() {
  const wallet = useWallet();
  const [bankModal, setBankModal] = useState<BankModal>({ open: false });
  const [loyaltyModal, setLoyaltyModal] = useState<LoyaltyModal>({ open: false });
  const [syncOpen, setSyncOpen] = useState(false);

  if (!wallet.ready) return null;

  const isEmpty = wallet.banks.length === 0 && wallet.loyalty.length === 0;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Header
        banks={wallet.banks}
        loyalty={wallet.loyalty}
        selectedProgramme={wallet.selectedProgramme}
        onSync={() => setSyncOpen(true)}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <SummaryStats
          banks={wallet.banks}
          loyalty={wallet.loyalty}
          selectedProgramme={wallet.selectedProgramme}
          onSelectProgramme={wallet.setSelectedProgramme}
        />

        {isEmpty && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="7" width="22" height="16" rx="3" stroke="#3b82f6" strokeWidth="1.8" />
                <path d="M3 12h22" stroke="#3b82f6" strokeWidth="1.8" />
                <path d="M8 17h4M18 17h2" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Your wallet is empty
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-xs mx-auto">
              Add your bank points and loyalty miles to start tracking them in one place.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setBankModal({ open: true })}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Add Bank Points
              </button>
              <button
                onClick={() => setLoyaltyModal({ open: true })}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Add Loyalty Miles
              </button>
            </div>
          </div>
        )}

        {!isEmpty && (
          <div className="space-y-8">
            {/* Bank Accounts */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Bank Points</h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {wallet.banks.length} {wallet.banks.length === 1 ? 'account' : 'accounts'}
                  </p>
                </div>
                <button
                  onClick={() => setBankModal({ open: true })}
                  className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Add
                </button>
              </div>

              {wallet.banks.length === 0 ? (
                <button
                  onClick={() => setBankModal({ open: true })}
                  className="w-full py-8 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 text-sm text-neutral-400 hover:border-blue-300 hover:text-blue-500 dark:hover:border-blue-800 dark:hover:text-blue-400 transition-colors"
                >
                  + Add your first bank account
                </button>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wallet.banks.map((b, i) => (
                    <BankCard
                      key={b.id}
                      account={b}
                      index={i}
                      selectedProgramme={wallet.selectedProgramme}
                      onEdit={(a) => setBankModal({ open: true, editing: a })}
                      onDelete={wallet.deleteBank}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Loyalty Accounts */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Loyalty Miles</h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {wallet.loyalty.length} {wallet.loyalty.length === 1 ? 'programme' : 'programmes'}
                  </p>
                </div>
                <button
                  onClick={() => setLoyaltyModal({ open: true })}
                  className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Add
                </button>
              </div>

              {wallet.loyalty.length === 0 ? (
                <button
                  onClick={() => setLoyaltyModal({ open: true })}
                  className="w-full py-8 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 text-sm text-neutral-400 hover:border-blue-300 hover:text-blue-500 dark:hover:border-blue-800 dark:hover:text-blue-400 transition-colors"
                >
                  + Add your first loyalty programme
                </button>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wallet.loyalty.map((l) => (
                    <LoyaltyCard
                      key={l.id}
                      account={l}
                      onEdit={(a) => setLoyaltyModal({ open: true, editing: a })}
                      onDelete={wallet.deleteLoyalty}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Mobile export */}
            <div className="sm:hidden pt-2 pb-4">
              <button
                onClick={() => exportToCSV(wallet.banks, wallet.loyalty, wallet.selectedProgramme)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1v8M4 6l3 3 3-3M2 10v1.5A1.5 1.5 0 003.5 13h7A1.5 1.5 0 0012 11.5V10"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Export to CSV
              </button>
            </div>
          </div>
        )}
      </main>

      {bankModal.open && (
        <AddBankModal
          initial={'editing' in bankModal ? bankModal.editing : undefined}
          onSave={'editing' in bankModal && bankModal.editing ? wallet.updateBank : wallet.addBank}
          onClose={() => setBankModal({ open: false })}
        />
      )}

      {loyaltyModal.open && (
        <AddLoyaltyModal
          initial={'editing' in loyaltyModal ? loyaltyModal.editing : undefined}
          onSave={'editing' in loyaltyModal && loyaltyModal.editing ? wallet.updateLoyalty : wallet.addLoyalty}
          onClose={() => setLoyaltyModal({ open: false })}
        />
      )}

      {syncOpen && (
        <SyncModal
          banks={wallet.banks}
          loyalty={wallet.loyalty}
          onImport={(b, l) => wallet.replaceAll(b, l)}
          onClose={() => setSyncOpen(false)}
        />
      )}
    </div>
  );
}
