"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Invoice01Icon from "@hugeicons/core-free-icons/Invoice01Icon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import { FilterBar, PageIntro, StatusBadge } from "../components/ui";
import { formatIDR } from "../data";
import type { CashAccount, LedgerRecord, PaymentInput } from "../types";
import { LedgerRecordDetail } from "./LedgerRecordDetail";

type LedgerType = "AR" | "AP";

export function LedgerView({ type, rows, accounts, recordPayment }: { type: LedgerType; rows: LedgerRecord[]; accounts: CashAccount[]; recordPayment: (type: LedgerType, target: LedgerRecord, payment: PaymentInput) => void }) {
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [recordedPayments, setRecordedPayments] = useState<Record<string, PaymentInput[]>>({});
  const selected = rows.find((row) => row.ref === selectedRef) ?? null;
  const isAR = type === "AR";
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const paid = rows.reduce((sum, row) => sum + row.paid, 0);
  if (selected) return <LedgerRecordDetail type={type} row={selected} accounts={accounts} recordedPayments={recordedPayments[selected.ref] ?? []} back={() => setSelectedRef(null)} recordPayment={(payment) => { setRecordedPayments((current) => ({ ...current, [selected.ref]: [...(current[selected.ref] ?? []), payment] })); recordPayment(type, selected, payment); }} />;
  return <><PageIntro title={isAR ? "Receivables" : "Payables"} description={isAR ? "Pantau piutang outstanding per klien dan proyek." : "Pantau hutang outstanding per vendor dan proyek."} action={<button className="primary-button" type="button"><HugeiconsIcon icon={Invoice01Icon} size={18} strokeWidth={1.8} />{isAR ? "New Receivable" : "New Payable"}</button>} /><section className="mini-kpi-grid"><article><span>Total {isAR ? "Receivable" : "Payable"}</span><strong>{formatIDR(total)}</strong><small>{rows.length} records</small></article><article><span>Paid</span><strong className="text-green">{formatIDR(paid)}</strong><small>{Math.round((paid / total) * 100)}% settled</small></article><article><span>Outstanding</span><strong className="text-amber">{formatIDR(total - paid)}</strong><small>{rows.filter((row) => row.status !== "PAID").length} records require action</small></article></section><article className="panel list-panel"><FilterBar><div className="search-box"><HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.7} /><input placeholder={`Search ${isAR ? "client" : "vendor"} or reference...`} /></div><select><option>All Projects</option><option>Hotel Gamelan</option></select><select><option>All Status</option><option>Outstanding</option><option>Partially Paid</option><option>Paid</option></select><select><option>All Due Dates</option><option>Due this month</option></select></FilterBar><div className="table-wrap full-table"><table><thead><tr><th>{isAR ? "Client" : "Vendor"}</th><th>Project / Reference</th><th>Total</th><th>Paid</th><th>Outstanding</th><th>Due Date</th><th>Status</th></tr></thead><tbody>{rows.map((row) => <tr className="clickable-row" onClick={() => setSelectedRef(row.ref)} key={row.ref}><td><b>{row.party}</b><small>{isAR ? "Client" : "Vendor"}</small></td><td><b>{row.project}</b><small>{row.ref}</small></td><td>{formatIDR(row.total)}</td><td className="profit">{formatIDR(row.paid)}</td><td><b>{formatIDR(row.total - row.paid)}</b></td><td>{row.due}</td><td><StatusBadge status={row.status} /></td></tr>)}</tbody></table></div></article></>;
}
