"use client";

import { useState } from "react";
import { formatIDR } from "../data";
import type { CashAccount } from "../types";

export function TransferModal({ accounts, close, submit }: { accounts: CashAccount[]; close: () => void; submit: (from: string, to: string, amount: number) => void }) {
  const [from, setFrom] = useState("Giro BCA");
  const [to, setTo] = useState("Bank Operasional BCA");
  const [amount, setAmount] = useState(30000000);
  const fromAccount = accounts.find((account) => account.name === from)!;
  const toAccount = accounts.find((account) => account.name === to)!;
  const valid = from !== to && amount > 0 && amount <= fromAccount.balance;
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Transfer funds"><div className="modal-card transfer-modal"><div className="modal-head"><div><span className="eyebrow">INTERNAL TRANSFER</span><h2>Transfer Funds</h2><p>Pindahkan dana antar Bank, Giro, dan Kas Proyek.</p></div><button onClick={close} aria-label="Tutup" type="button">×</button></div><div className="transfer-flow"><label>FROM ACCOUNT<select value={from} onChange={(e) => setFrom(e.target.value)}>{accounts.map((account) => <option key={account.name}>{account.name}</option>)}</select><span>Available balance <b>{formatIDR(fromAccount.balance)}</b></span></label><i>→</i><label>TO ACCOUNT<select value={to} onChange={(e) => setTo(e.target.value)}>{accounts.map((account) => <option key={account.name}>{account.name}</option>)}</select><span>Current balance <b>{formatIDR(toAccount.balance)}</b></span></label></div><div className="form-grid transfer-form"><label>Transfer Amount (IDR)<input type="number" min="1" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></label><label>Transfer Date<input type="date" defaultValue="2026-08-20" /></label><label className="full">Description<input defaultValue="Pencairan Giro ke Bank Operasional" /></label></div><div className="impact-preview"><h3>Impact Preview</h3><div><span>{from}<b>{formatIDR(fromAccount.balance)} → {formatIDR(fromAccount.balance - amount)}</b></span><strong className="text-red">−{formatIDR(amount)}</strong></div><div><span>{to}<b>{formatIDR(toAccount.balance)} → {formatIDR(toAccount.balance + amount)}</b></span><strong className="text-green">+{formatIDR(amount)}</strong></div><footer><span><i>✓</i>Total liquid assets</span><b>No change</b><span><i>✓</i>Profit & Loss</span><b>No impact</b></footer></div>{!valid && <div className="error-box">Periksa akun tujuan dan saldo yang tersedia.</div>}<div className="modal-actions"><button className="text-button" onClick={close} type="button">Cancel</button><button className="primary-button" disabled={!valid} onClick={() => submit(from, to, amount)} type="button">Confirm Transfer</button></div></div></div>;
}
