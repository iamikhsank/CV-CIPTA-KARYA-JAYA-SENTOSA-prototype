"use client";

import { useState } from "react";
import { FilterBar, PageIntro, StatusBadge } from "../components/ui";
import { formatIDR } from "../data";
import type { Transaction } from "../types";

export function TransactionsView({ transactions, newTransaction, selectTransaction }: { transactions: Transaction[]; newTransaction: () => void; selectTransaction: (tx: Transaction) => void }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const filtered = transactions.filter((tx) => `${tx.id} ${tx.description} ${tx.project}`.toLowerCase().includes(search.toLowerCase()) && (status === "All Status" || tx.status === status));
  return <><PageIntro title="Transactions" description="Semua transaksi kas, beban, pendapatan, dan transfer internal." action={<button className="primary-button" onClick={newTransaction} type="button"><span>＋</span> New Transaction</button>} /><article className="panel list-panel"><FilterBar><div className="search-box wide">⌕<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search transaction, reference, or description..." /></div><select><option>Agustus 2026</option><option>Juli 2026</option></select><select><option>All Projects</option><option>Corporate</option><option>Hotel Gamelan</option></select><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All Status</option><option>DRAFT</option><option>POSTED</option><option>REVERSED</option></select></FilterBar><div className="table-wrap full-table"><table><thead><tr><th>Date / Reference</th><th>Description</th><th>Project</th><th>Category</th><th>Cash Account</th><th>Amount</th><th>Status</th></tr></thead><tbody>{filtered.map((tx) => <tr className="clickable-row" onClick={() => selectTransaction(tx)} key={tx.id}><td><b>{tx.date}</b><small>{tx.id}</small></td><td><b>{tx.description}</b><small>{tx.contact}</small></td><td>{tx.project}</td><td>{tx.category}</td><td>{tx.account}</td><td className={tx.type === "Income" ? "profit" : ""}><b>{tx.type === "Income" ? "+" : tx.type === "Expense" ? "−" : ""}{formatIDR(tx.amount)}</b><small>{tx.type}</small></td><td><StatusBadge status={tx.status} /></td></tr>)}</tbody></table></div><div className="table-footer"><span>Showing {filtered.length} of {transactions.length} transactions</span><div><button type="button">←</button><button className="active" type="button">1</button><button type="button">2</button><button type="button">→</button></div></div></article></>;
}
