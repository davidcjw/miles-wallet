'use client';

import { useState } from 'react';
import { Surface, Text, Heading, Button } from 'rawhouse-ds';
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

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: 6 }}>
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SectionHead({
  eyebrow,
  count,
  noun,
  onAdd,
  variant,
}: {
  eyebrow: string;
  count: number;
  noun: [string, string];
  onAdd: () => void;
  variant: 'coral' | 'green';
}) {
  return (
    <div className="flex items-end justify-between mb-4">
      <Heading level="h" eyebrow={`${count} ${count === 1 ? noun[0] : noun[1]}`} eyebrowTone="muted">
        {eyebrow}
      </Heading>
      <Button variant={variant} size="sm" onClick={onAdd}>
        <PlusIcon />
        Add
      </Button>
    </div>
  );
}

function AddTile({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full"
      style={{
        padding: '32px 16px',
        borderRadius: 'var(--rh-r-xl)',
        border: '2px dashed var(--rh-muted)',
        background: 'transparent',
        color: 'var(--rh-stone)',
        fontFamily: 'var(--rh-font)',
        fontWeight: 'var(--rh-weight-bold)',
        fontSize: 'var(--rh-fs-small)',
        cursor: 'pointer',
      }}
    >
      + {label}
    </button>
  );
}

export default function Page() {
  const wallet = useWallet();
  const [bankModal, setBankModal] = useState<BankModal>({ open: false });
  const [loyaltyModal, setLoyaltyModal] = useState<LoyaltyModal>({ open: false });
  const [syncOpen, setSyncOpen] = useState(false);

  if (!wallet.ready) return null;

  const isEmpty = wallet.banks.length === 0 && wallet.loyalty.length === 0;

  return (
    <div className="min-h-screen">
      <Header
        banks={wallet.banks}
        loyalty={wallet.loyalty}
        selectedProgramme={wallet.selectedProgramme}
        onSync={() => setSyncOpen(true)}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="sr-only">Miles Wallet — track bank credit card points and loyalty miles</h1>
        <SummaryStats
          banks={wallet.banks}
          loyalty={wallet.loyalty}
          selectedProgramme={wallet.selectedProgramme}
          onSelectProgramme={wallet.setSelectedProgramme}
        />

        {isEmpty && (
          <Surface
            tone="white"
            radius="xl"
            sticker
            bordered
            pad={6}
            className="flex flex-col items-center text-center"
            style={{ marginTop: 8 }}
          >
            <Surface
              tone="coral"
              radius="lg"
              bordered
              className="flex items-center justify-center"
              style={{ width: 56, height: 56, marginBottom: 20 }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="7" width="22" height="16" rx="3" stroke="white" strokeWidth="2" />
                <path d="M3 12h22" stroke="white" strokeWidth="2" />
                <path d="M8 17h4M18 17h2" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Surface>
            <Heading level="h" center>Your wallet is empty</Heading>
            <Text size="body" tone="muted" center className="max-w-xs" style={{ margin: '12px 0 24px' }}>
              Add your bank points and loyalty miles to start tracking them in one place.
            </Text>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="coral" onClick={() => setBankModal({ open: true })}>
                Add Bank Points
              </Button>
              <Button variant="outline" onClick={() => setLoyaltyModal({ open: true })}>
                Add Loyalty Miles
              </Button>
            </div>
          </Surface>
        )}

        {!isEmpty && (
          <div className="space-y-10">
            {/* Bank Accounts */}
            <section>
              <SectionHead
                eyebrow="Bank Points"
                count={wallet.banks.length}
                noun={['account', 'accounts']}
                onAdd={() => setBankModal({ open: true })}
                variant="coral"
              />

              {wallet.banks.length === 0 ? (
                <AddTile label="Add your first bank account" onClick={() => setBankModal({ open: true })} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
              <SectionHead
                eyebrow="Loyalty Miles"
                count={wallet.loyalty.length}
                noun={['programme', 'programmes']}
                onAdd={() => setLoyaltyModal({ open: true })}
                variant="green"
              />

              {wallet.loyalty.length === 0 ? (
                <AddTile label="Add your first loyalty programme" onClick={() => setLoyaltyModal({ open: true })} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
            <div className="sm:hidden">
              <Button
                variant="black"
                className="w-full"
                onClick={() => exportToCSV(wallet.banks, wallet.loyalty, wallet.selectedProgramme)}
              >
                Export to CSV
              </Button>
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
