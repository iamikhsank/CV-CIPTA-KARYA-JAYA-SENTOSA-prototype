"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDownRight01Icon from "@hugeicons/core-free-icons/ArrowDownRight01Icon";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import ArrowDataTransferHorizontalIcon from "@hugeicons/core-free-icons/ArrowDataTransferHorizontalIcon";
import Chart01Icon from "@hugeicons/core-free-icons/Chart01Icon";
import Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";
import MoneyReceive01Icon from "@hugeicons/core-free-icons/MoneyReceive01Icon";
import MoneySend01Icon from "@hugeicons/core-free-icons/MoneySend01Icon";
import TransactionIcon from "@hugeicons/core-free-icons/TransactionIcon";
import Wallet02Icon from "@hugeicons/core-free-icons/Wallet02Icon";
import { formatIDR, projectRows } from "../data";
import type { CashAccount, View } from "../types";

type DashboardViewProps = {
  go: (view: View) => void;
  newTransaction: () => void;
  transfer: () => void;
  cashAccounts: CashAccount[];
};

export function DashboardView({ go, newTransaction, transfer, cashAccounts }: DashboardViewProps) {
  const kpis = [
    { label: "Total Cash", value: formatIDR(cashAccounts.reduce((sum, item) => sum + item.balance, 0)), delta: "+8,4%", changeType: "positive", tone: "green", meta: "vs Jul 2026", icon: Wallet02Icon },
    { label: "Revenue", value: "Rp 1.284.000.000", delta: "+12,5%", changeType: "positive", tone: "blue", meta: "vs Jul 2026", icon: MoneyReceive01Icon },
    { label: "Expense", value: "Rp 846.750.000", delta: "+4,2%", changeType: "negative", tone: "amber", meta: "vs Jul 2026", icon: MoneySend01Icon },
    { label: "Net Profit", value: "Rp 437.250.000", delta: "+34,1%", changeType: "positive", tone: "purple", meta: "margin periode ini", icon: Chart01Icon },
  ];
  return <>
    <section className="dashboard-welcome">
      <div className="dashboard-welcome-top"><div><p>Thursday, 20 August 2026</p><h1>Good Evening, Jason</h1></div><div className="heading-actions"><label className="select-control">Periode<select defaultValue="aug"><option value="aug">Agustus 2026</option><option>Juli 2026</option></select></label><label className="select-control">Project<select defaultValue="all"><option value="all">All Projects</option><option>Hotel Gamelan</option><option>Villa Ubud</option></select></label><button className="primary-button" onClick={newTransaction} type="button"><span>＋</span> New Transaction</button></div></div>
    </section>
    <div className="quick-row"><button className="quick-action transaction" onClick={newTransaction} type="button"><i><HugeiconsIcon icon={TransactionIcon} size={21} strokeWidth={1.8} /></i><span><b>Catat transaksi</b><small>Catat pemasukan atau pengeluaran</small></span><HugeiconsIcon className="quick-arrow" icon={ArrowRight01Icon} size={18} strokeWidth={1.8} /></button><button className="quick-action transfer" onClick={transfer} type="button"><i><HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={21} strokeWidth={1.8} /></i><span><b>Transfer dana</b><small>Pindahkan saldo antar-pos kas</small></span><HugeiconsIcon className="quick-arrow" icon={ArrowRight01Icon} size={18} strokeWidth={1.8} /></button><button className="quick-action project" onClick={() => go("Projects")} type="button"><i><HugeiconsIcon icon={Folder01Icon} size={21} strokeWidth={1.8} /></i><span><b>Kelola proyek</b><small>Lihat dan kelola proyek aktif</small></span><HugeiconsIcon className="quick-arrow" icon={ArrowRight01Icon} size={18} strokeWidth={1.8} /></button></div>
    <section className="kpi-grid" aria-label="Ringkasan keuangan">{kpis.map((item) => <article className={`kpi-card ${item.tone}`} key={item.label}><div className="kpi-body"><div className="kpi-top"><span>{item.label}</span><i><HugeiconsIcon icon={item.icon} size={17} strokeWidth={1.7} /></i></div><div className="kpi-value"><strong>{item.value}</strong></div><div className={`kpi-trend ${item.changeType}`}><HugeiconsIcon icon={item.delta.startsWith("-") ? ArrowDownRight01Icon : ArrowUpRight01Icon} size={14} strokeWidth={2} /><b>{item.delta}</b><span>{item.meta}</span></div></div><button className="kpi-footer" onClick={() => go(item.label === "Total Cash" ? "Cash Accounts" : item.label === "Expense" ? "Transactions" : "Reports")} type="button">View more <span>→</span></button></article>)}</section>
    <section className="dashboard-grid">
      <article className="panel cash-panel"><div className="panel-head"><div><h2>Cash Position</h2><p>Saldo berdasarkan pos dana</p></div><button onClick={() => go("Cash Accounts")} type="button">View accounts →</button></div><div className="cash-total"><span>Total liquidity</span><strong>{formatIDR(cashAccounts.reduce((sum, item) => sum + item.balance, 0))}</strong></div><div className="cash-rows"><div><i className="account-icon bank">B</i><span><b>Bank Operasional</b><small>2 accounts</small></span><strong>{formatIDR(cashAccounts.filter((a) => a.type === "BANK").reduce((s, a) => s + a.balance, 0))}</strong></div><div><i className="account-icon giro">G</i><span><b>Giro</b><small>1 account</small></span><strong>{formatIDR(cashAccounts.filter((a) => a.type === "GIRO").reduce((s, a) => s + a.balance, 0))}</strong></div><div><i className="account-icon cash">K</i><span><b>Kas Proyek</b><small>3 active projects</small></span><strong>{formatIDR(cashAccounts.filter((a) => a.type === "PETTY CASH").reduce((s, a) => s + a.balance, 0))}</strong></div></div></article>
      <RevenueExpenseChart openReport={() => go("Reports")} />
      <article className="panel category-panel"><div className="panel-head"><div><h2>Expense by Category</h2><p>Distribusi bulan berjalan</p></div><button type="button">•••</button></div><div className="donut-layout"><div className="donut"><div><strong>Rp 846,7 jt</strong><span>Total expense</span></div></div><div className="category-list"><span><i className="cat-1" />Material <b>42%</b></span><span><i className="cat-2" />Tenaga Kerja <b>28%</b></span><span><i className="cat-3" />Operasional <b>18%</b></span><span><i className="cat-4" />Lainnya <b>12%</b></span></div></div></article>
    </section>
    <article className="panel performance-panel"><div className="panel-head"><div><h2>Project Performance</h2><p>Profitabilitas project aktif periode ini</p></div><button onClick={() => go("Projects")} type="button">View all projects →</button></div><div className="table-wrap"><table className="performance-table"><thead><tr><th>Project</th><th>Revenue</th><th>Expense</th><th>Net Profit</th><th>Margin</th></tr></thead><tbody>{projectRows.slice(0, 3).map((project) => { const profit = project.revenue - project.expense; return <tr key={project.name}><td><i className="project-dot" style={{ background: project.color }} /><span><b>{project.name}</b><small>{project.client}</small></span></td><td>{formatIDR(project.revenue)}</td><td>{formatIDR(project.expense)}</td><td className="profit-value">{formatIDR(profit)}</td><td><span className="margin-value">{Math.round((profit / project.revenue) * 100)}%</span></td></tr>; })}</tbody></table></div></article>
  </>;
}

function RevenueExpenseChart({ openReport }: { openReport: () => void }) {
  const data = [
    { month: "Mar", revenue: 760, expense: 540 },
    { month: "Apr", revenue: 880, expense: 610 },
    { month: "Mei", revenue: 820, expense: 590 },
    { month: "Jun", revenue: 1040, expense: 720 },
    { month: "Jul", revenue: 960, expense: 680 },
    { month: "Agu", revenue: 1284, expense: 846.75 },
  ];
  const maximum = 1400;
  return <article className="panel chart-panel revenue-expense-card"><div className="panel-head"><div><h2>Revenue vs Expense</h2><p>Perbandingan pendapatan dan pengeluaran · 6 bulan terakhir</p></div><button onClick={openReport} type="button">View report →</button></div><ul className="chart-metrics" aria-label="Ringkasan Revenue dan Expense"><li><div className="chart-series-label"><i className="revenue" /><span>Revenue</span></div><div><strong>Rp 5,74 M</strong><small className="positive">+12,5%</small></div></li><li><div className="chart-series-label"><i className="expense" /><span>Expense</span></div><div><strong>Rp 3,99 M</strong><small className="negative">+4,2%</small></div></li></ul><div className="grouped-chart" role="img" aria-label="Revenue dan expense bulanan dari Maret hingga Agustus 2026 dalam juta rupiah"><div className="chart-y-axis" aria-hidden="true"><span>Rp 1,4 M</span><span>Rp 1,0 M</span><span>Rp 700 Jt</span><span>Rp 350 Jt</span><span>Rp 0</span></div><div className="chart-plot"><div className="chart-grid-lines" aria-hidden="true"><i /><i /><i /><i /><i /></div><div className="chart-groups">{data.map((item) => <div className="chart-month" key={item.month}><div className="chart-bar-pair"><i className="revenue-bar" style={{ height: `${(item.revenue / maximum) * 100}%` }} title={`${item.month} · Revenue Rp ${item.revenue} juta`} /><i className="expense-bar" style={{ height: `${(item.expense / maximum) * 100}%` }} title={`${item.month} · Expense Rp ${item.expense} juta`} /></div><span>{item.month}</span></div>)}</div></div></div></article>;
}
