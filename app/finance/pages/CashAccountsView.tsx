"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDataTransferHorizontalIcon from "@hugeicons/core-free-icons/ArrowDataTransferHorizontalIcon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";
import Wallet02Icon from "@hugeicons/core-free-icons/Wallet02Icon";
import { CustomDropdown, PageIntro, StatusBadge } from "../components/ui";
import { formatIDR } from "../data";
import type { CashAccount, Transaction } from "../types";
import { CashAccountDetail } from "./CashAccountDetail";

const typeOptions = [
  { label: "All Account Types", value: "All" },
  { label: "Bank Operasional", value: "BANK" },
  { label: "Giro", value: "GIRO" },
  { label: "Kas Proyek", value: "PETTY CASH" },
];

const projectOptions = [
  { label: "All Projects", value: "All" },
  { label: "Corporate", value: "Corporate" },
  { label: "Hotel Gamelan", value: "Hotel Gamelan" },
  { label: "Villa Ubud", value: "Villa Ubud" },
  { label: "Kantor Sentosa", value: "Kantor Sentosa" },
];

export function CashAccountsView({
  accounts,
  transactions,
  transfer,
  onEditTransaction,
  onSelectTransaction,
}: {
  accounts: CashAccount[];
  transactions: Transaction[];
  transfer: () => void;
  onEditTransaction?: (tx: Transaction) => void;
  onSelectTransaction?: (tx: Transaction) => void;
}) {
  const [selectedAccount, setSelectedAccount] = useState<CashAccount | null>(null);
  const [accountType, setAccountType] = useState("All");
  const [projectScope, setProjectScope] = useState("All");

  const total = accounts.reduce((sum, account) => sum + account.balance, 0);
  const bankTotal = accounts.filter((a) => a.type === "BANK").reduce((s, a) => s + a.balance, 0);
  const giroTotal = accounts.filter((a) => a.type === "GIRO").reduce((s, a) => s + a.balance, 0);
  const pettyTotal = accounts.filter((a) => a.type === "PETTY CASH").reduce((s, a) => s + a.balance, 0);

  const filteredAccounts = accounts.filter((account) => {
    const matchType = accountType === "All" || account.type === accountType;
    const matchProject = projectScope === "All" || account.project === projectScope;
    return matchType && matchProject;
  });

  if (selectedAccount) {
    return (
      <CashAccountDetail
        account={accounts.find((item) => item.name === selectedAccount.name) ?? selectedAccount}
        transactions={transactions}
        transfer={transfer}
        back={() => setSelectedAccount(null)}
        onEditTransaction={onEditTransaction}
        onSelectTransaction={onSelectTransaction}
      />
    );
  }

  return (
    <>
      <PageIntro
        title="Cash Accounts"
        description="Pantau saldo Bank, Giro, dan Kas Proyek dalam satu tampilan."
        action={
          <button className="primary-button" onClick={transfer} type="button">
            <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={18} strokeWidth={1.8} />
            <span>Transfer Funds</span>
          </button>
        }
      />

      <section className="cash-summary" aria-label="Ringkasan Likuiditas">
        <div>
          <span>Total Liquidity</span>
          <strong>{formatIDR(total)}</strong>
          <small>Ledger balance · 20 Agu 2026</small>
        </div>
        <div>
          <span>Bank</span>
          <strong>{formatIDR(bankTotal)}</strong>
          <small>{accounts.filter((a) => a.type === "BANK").length} active accounts</small>
        </div>
        <div>
          <span>Giro</span>
          <strong>{formatIDR(giroTotal)}</strong>
          <small>{accounts.filter((a) => a.type === "GIRO").length} active account</small>
        </div>
        <div>
          <span>Kas Proyek</span>
          <strong>{formatIDR(pettyTotal)}</strong>
          <small>{accounts.filter((a) => a.type === "PETTY CASH").length} active projects</small>
        </div>
      </section>

      <div className="cash-accounts-filter-bar">
        <CustomDropdown
          ariaLabel="Filter Tipe Akun"
          icon={Wallet02Icon}
          onChange={setAccountType}
          options={typeOptions}
          value={accountType}
        />
        <CustomDropdown
          ariaLabel="Filter Proyek"
          icon={Folder01Icon}
          onChange={setProjectScope}
          options={projectOptions}
          value={projectScope}
        />
      </div>

      <section className="account-grid" aria-label="Daftar Rekening Kas">
        {filteredAccounts.map((account) => (
          <button
            className="account-card clickable-account"
            onClick={() => setSelectedAccount(account)}
            key={account.name}
            type="button"
          >
            <div className="account-card-header">
              <div className={`account-card-icon ${account.tone}`}>
                {account.type === "BANK" ? "B" : account.type === "GIRO" ? "G" : "K"}
              </div>
              <div className="account-card-meta">
                <h2>{account.name}</h2>
                <p>{account.no} · {account.project}</p>
              </div>
              <StatusBadge status="ACTIVE" />
            </div>

            <div className="account-card-balance-box">
              <span>Current Balance</span>
              <strong>{formatIDR(account.balance)}</strong>
            </div>

            <div className="account-card-footer">
              <small>Updated from posted ledger</small>
              <span className="account-card-link">
                View details <HugeiconsIcon icon={ArrowRight01Icon} size={13} strokeWidth={2} />
              </span>
            </div>
          </button>
        ))}
      </section>
    </>
  );
}
