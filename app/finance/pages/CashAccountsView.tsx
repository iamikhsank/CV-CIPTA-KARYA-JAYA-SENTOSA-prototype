"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDataTransferHorizontalIcon from "@hugeicons/core-free-icons/ArrowDataTransferHorizontalIcon";
import { FilterBar, PageIntro, StatusBadge } from "../components/ui";
import { formatIDR } from "../data";
import type { CashAccount, Transaction } from "../types";
import { CashAccountDetail } from "./CashAccountDetail";

export function CashAccountsView({ accounts, transactions, transfer }: { accounts: CashAccount[]; transactions: Transaction[]; transfer: () => void }) {
  const [selectedAccount, setSelectedAccount] = useState<CashAccount | null>(null);
  const total = accounts.reduce((sum, account) => sum + account.balance, 0);
  if (selectedAccount) return <CashAccountDetail account={accounts.find((item) => item.name === selectedAccount.name) ?? selectedAccount} transactions={transactions} transfer={transfer} back={() => setSelectedAccount(null)} />;
  return <><PageIntro title="Cash Accounts" description="Pantau saldo Bank, Giro, dan Kas Proyek dalam satu tampilan." action={<button className="primary-button" onClick={transfer} type="button"><HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={18} strokeWidth={1.8} /> Transfer Funds</button>} /><section className="cash-summary"><div><span>Total Liquidity</span><strong>{formatIDR(total)}</strong><small>Ledger balance · 20 Agu 2026</small></div><div><span>Bank</span><strong>{formatIDR(accounts.filter((a) => a.type === "BANK").reduce((s, a) => s + a.balance, 0))}</strong><small>2 active accounts</small></div><div><span>Giro</span><strong>{formatIDR(accounts.filter((a) => a.type === "GIRO").reduce((s, a) => s + a.balance, 0))}</strong><small>1 active account</small></div><div><span>Kas Proyek</span><strong>{formatIDR(accounts.filter((a) => a.type === "PETTY CASH").reduce((s, a) => s + a.balance, 0))}</strong><small>3 active projects</small></div></section><FilterBar><select><option>All Account Types</option><option>Bank</option><option>Giro</option><option>Petty Cash</option></select><select><option>All Projects</option><option>Corporate</option><option>Hotel Gamelan</option></select></FilterBar><section className="account-grid">{accounts.map((account) => <button className="account-card clickable-account" onClick={() => setSelectedAccount(account)} key={account.name} type="button"><div className={`account-card-icon ${account.tone}`}>{account.type === "BANK" ? "B" : account.type === "GIRO" ? "G" : "K"}</div><StatusBadge status="ACTIVE" /><h2>{account.name}</h2><p>{account.no} · {account.project}</p><span>Current Balance</span><strong>{formatIDR(account.balance)}</strong><div><small>Updated from posted ledger</small><span className="account-card-link">View details →</span></div></button>)}</section></>;
}
