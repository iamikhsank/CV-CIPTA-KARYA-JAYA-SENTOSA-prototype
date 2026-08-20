import { HugeiconsIcon } from "@hugeicons/react";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import { formatIDR } from "../../data";

export function GeneralLedgerReport() {
  const rows = [
    ["1-1100", "Cash and Bank", "Rp 1.974.500.000 Dr", 1284000000, 820000000, "Rp 2.438.500.000 Dr"],
    ["1-1300", "Accounts Receivable", "Rp 100.000.000 Dr", 300000000, 180000000, "Rp 220.000.000 Dr"],
    ["2-1100", "Accounts Payable", "Rp 30.000.000 Cr", 205000000, 243500000, "Rp 68.500.000 Cr"],
    ["2-1900", "Other Current Liabilities", "—", 0, 108250000, "Rp 108.250.000 Cr"],
    ["3-1000", "Owner's Capital", "Rp 2.044.500.000 Cr", 0, 0, "Rp 2.044.500.000 Cr"],
    ["4-1000", "Project Revenue", "—", 0, 1284000000, "Rp 1.284.000.000 Cr"],
    ["5-1000", "Project and Corporate Expenses", "—", 846750000, 0, "Rp 846.750.000 Dr"],
  ] as const;
  return <div className="general-ledger-report"><div className="gl-summary"><span><small>Opening balance</small><b>Rp 2.074.500.000 Dr = Cr</b></span><span><small>Period debits</small><b>Rp 2.635.750.000</b></span><span><small>Period credits</small><b>Rp 2.635.750.000</b></span><span><small>Difference</small><b>Rp 0</b></span></div><div className="gl-table-wrap"><table><thead><tr><th>Account</th><th>Account Name</th><th>Opening Balance</th><th>Debit</th><th>Credit</th><th>Closing Balance</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}><td><b>{row[0]}</b></td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3] ? formatIDR(row[3]) : "—"}</td><td>{row[4] ? formatIDR(row[4]) : "—"}</td><td><b>{row[5]}</b></td></tr>)}</tbody><tfoot><tr><td colSpan={2}>TOTAL</td><td>Rp 2.074.500.000 Dr = Cr</td><td>Rp 2.635.750.000</td><td>Rp 2.635.750.000</td><td>Rp 3.505.250.000 Dr = Cr</td></tr></tfoot></table></div><div className="balance-check gl-check"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} strokeWidth={1.8} /><span><b>Ledger is balanced</b><small>Period debit equals period credit · Difference Rp 0</small></span></div></div>;
}
