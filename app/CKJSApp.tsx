"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Book01Icon from "@hugeicons/core-free-icons/Book01Icon";
import Chart01Icon from "@hugeicons/core-free-icons/Chart01Icon";
import DashboardSquare01Icon from "@hugeicons/core-free-icons/DashboardSquare01Icon";
import Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";
import HelpCircleIcon from "@hugeicons/core-free-icons/HelpCircleIcon";
import HourglassIcon from "@hugeicons/core-free-icons/HourglassIcon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import Clock01Icon from "@hugeicons/core-free-icons/Clock01Icon";
import Menu01Icon from "@hugeicons/core-free-icons/Menu01Icon";
import MoneyReceive01Icon from "@hugeicons/core-free-icons/MoneyReceive01Icon";
import MoneySend01Icon from "@hugeicons/core-free-icons/MoneySend01Icon";
import Notification03Icon from "@hugeicons/core-free-icons/Notification03Icon";
import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";
import TransactionIcon from "@hugeicons/core-free-icons/TransactionIcon";
import Upload01Icon from "@hugeicons/core-free-icons/Upload01Icon";
import Wallet02Icon from "@hugeicons/core-free-icons/Wallet02Icon";

type View = "Dashboard" | "Projects" | "Transactions" | "Cash Accounts" | "Receivables" | "Payables" | "Reports" | "Masters" | "Migration" | "Settings";
type TransactionStatus = "DRAFT" | "POSTED" | "REVERSED";
type Transaction = {
  id: string;
  date: string;
  description: string;
  project: string;
  category: string;
  account: string;
  contact: string;
  amount: number;
  type: "Income" | "Expense" | "Transfer";
  status: TransactionStatus;
};

const navItems = [
  { icon: DashboardSquare01Icon, label: "Dashboard", group: "workspace" },
  { icon: Folder01Icon, label: "Projects", group: "workspace" },
  { icon: TransactionIcon, label: "Transactions", group: "workspace" },
  { icon: Wallet02Icon, label: "Cash Accounts", group: "workspace" },
  { icon: MoneyReceive01Icon, label: "Receivables", group: "workspace" },
  { icon: MoneySend01Icon, label: "Payables", group: "workspace" },
  { icon: Chart01Icon, label: "Reports", group: "workspace" },
  { icon: Book01Icon, label: "Masters", group: "system" },
  { icon: Upload01Icon, label: "Migration", group: "workspace" },
  { icon: Settings01Icon, label: "Settings", group: "system" },
] as const;

const projectRows = [
  { name: "Hotel Gamelan", code: "PRJ-026", client: "PT Aruna Hospitality", start: "10 Jan 2026", end: "20 Nov 2026", revenue: 480000000, expense: 302500000, status: "ACTIVE", color: "#3764e8" },
  { name: "Villa Ubud", code: "PRJ-024", client: "Nusantara Living", start: "08 Feb 2026", end: "12 Okt 2026", revenue: 364000000, expense: 248250000, status: "ACTIVE", color: "#10a57a" },
  { name: "Kantor Sentosa", code: "PRJ-019", client: "CV Karya Mandiri", start: "18 Mar 2026", end: "28 Des 2026", revenue: 280000000, expense: 194000000, status: "ACTIVE", color: "#8a56d7" },
  { name: "Gudang Karya", code: "PRJ-015", client: "PT Logistik Jaya", start: "05 Sep 2025", end: "30 Jun 2026", revenue: 160000000, expense: 102000000, status: "COMPLETED", color: "#e59430" },
];

const initialTransactions: Transaction[] = [
  { id: "TX-202608-0038", date: "18 Agu 2026", description: "Pembelian material baja ringan", project: "Hotel Gamelan", category: "Material", account: "Kas Gamelan", contact: "UD Sinar Baja", amount: 24500000, type: "Expense", status: "POSTED" },
  { id: "TX-202608-0037", date: "17 Agu 2026", description: "Penerimaan termin pekerjaan II", project: "Villa Ubud", category: "Pendapatan Termin", account: "Giro BCA", contact: "Nusantara Living", amount: 120000000, type: "Income", status: "POSTED" },
  { id: "TX-202608-0036", date: "16 Agu 2026", description: "Drop dana operasional lapangan", project: "Kantor Sentosa", category: "Transfer Internal", account: "Bank Mandiri", contact: "—", amount: 40000000, type: "Transfer", status: "POSTED" },
  { id: "TX-202608-0035", date: "15 Agu 2026", description: "Sewa kendaraan proyek", project: "Hotel Gamelan", category: "Operasional Proyek", account: "Kas Gamelan", contact: "CV Prima Transport", amount: 8500000, type: "Expense", status: "DRAFT" },
  { id: "TX-202608-0034", date: "14 Agu 2026", description: "Internet dan utilitas kantor", project: "Corporate", category: "Beban Kantor", account: "Bank BCA", contact: "PT Telkom Indonesia", amount: 2850000, type: "Expense", status: "POSTED" },
  { id: "TX-202608-0033", date: "12 Agu 2026", description: "Koreksi pembayaran material", project: "Villa Ubud", category: "Material", account: "Kas Villa Ubud", contact: "Toko Bangunan Bali", amount: 6200000, type: "Expense", status: "REVERSED" },
];

const cashSeed = [
  { name: "Bank Operasional BCA", no: "067 883 2901", type: "BANK", project: "Corporate", balance: 826500000, tone: "blue" },
  { name: "Bank Mandiri", no: "145 008 7620", type: "BANK", project: "Corporate", balance: 600000000, tone: "blue" },
  { name: "Giro BCA", no: "067 018 4226", type: "GIRO", project: "Corporate", balance: 684000000, tone: "green" },
  { name: "Kas Gamelan", no: "Kas Proyek", type: "PETTY CASH", project: "Hotel Gamelan", balance: 148000000, tone: "amber" },
  { name: "Kas Villa Ubud", no: "Kas Proyek", type: "PETTY CASH", project: "Villa Ubud", balance: 106000000, tone: "amber" },
  { name: "Kas Kantor Sentosa", no: "Kas Proyek", type: "PETTY CASH", project: "Kantor Sentosa", balance: 74000000, tone: "amber" },
];

const receivables = [
  { party: "PT Aruna Hospitality", project: "Hotel Gamelan", ref: "INV/HG/08/026", total: 180000000, paid: 80000000, due: "30 Agu 2026", status: "PARTIAL" },
  { party: "Nusantara Living", project: "Villa Ubud", ref: "INV/VU/08/019", total: 120000000, paid: 0, due: "05 Sep 2026", status: "OUTSTANDING" },
  { party: "CV Karya Mandiri", project: "Kantor Sentosa", ref: "INV/KS/07/012", total: 95000000, paid: 95000000, due: "12 Agu 2026", status: "PAID" },
];

const payables = [
  { party: "UD Sinar Baja", project: "Hotel Gamelan", ref: "SB-882/2026", total: 68000000, paid: 43500000, due: "28 Agu 2026", status: "PARTIAL" },
  { party: "PT Beton Perkasa", project: "Villa Ubud", ref: "BP-1008-44", total: 44000000, paid: 0, due: "02 Sep 2026", status: "OUTSTANDING" },
  { party: "CV Prima Transport", project: "Corporate", ref: "PT-0826-18", total: 8500000, paid: 8500000, due: "20 Agu 2026", status: "PAID" },
];

const formatIDR = (amount: number) => `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;

function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}><i />{status === "PARTIAL" ? "PARTIALLY PAID" : status}</span>;
}

function PageIntro({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div><h1>{title}</h1><p>{description}</p></div>{action && <div className="heading-actions">{action}</div>}</div>;
}

function FilterBar({ children }: { children: React.ReactNode }) {
  return <div className="filter-bar">{children}</div>;
}

export function CKJSApp() {
  const [view, setView] = useState<View>("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [cashAccounts, setCashAccounts] = useState(cashSeed);
  const [newTxOpen, setNewTxOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [selectedProject, setSelectedProject] = useState<(typeof projectRows)[number] | null>(null);
  const [toast, setToast] = useState("");
  const commandSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusCommandSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        commandSearchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusCommandSearch);
    return () => window.removeEventListener("keydown", focusCommandSearch);
  }, []);

  const go = (next: View) => { setView(next); setSidebarOpen(false); setSelectedProject(null); };
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };

  const createTransaction = (transaction: Omit<Transaction, "id" | "date">, post: boolean) => {
    const nextNumber = String(transactions.length + 39).padStart(4, "0");
    const newTransaction: Transaction = { ...transaction, id: `TX-202608-${nextNumber}`, date: "20 Agu 2026", status: post ? "POSTED" : "DRAFT" };
    setTransactions((items) => [newTransaction, ...items]);
    setNewTxOpen(false);
    notify(post ? "Transaksi berhasil diposting dan jurnal sudah seimbang." : "Transaksi disimpan sebagai draft.");
  };

  const reverseTransaction = (target: Transaction) => {
    setTransactions((items) => items.map((item) => item.id === target.id ? { ...item, status: "REVERSED" } : item));
    setSelectedTx(null);
    notify(`${target.id} berhasil direverse. Transaksi pembalik telah dibuat.`);
  };

  const transferFunds = (from: string, to: string, amount: number) => {
    setCashAccounts((items) => items.map((account) => account.name === from ? { ...account, balance: account.balance - amount } : account.name === to ? { ...account, balance: account.balance + amount } : account));
    const transfer: Transaction = { id: `TX-202608-${String(transactions.length + 39).padStart(4, "0")}`, date: "20 Agu 2026", description: `Transfer ${from} ke ${to}`, project: "Corporate", category: "Transfer Internal", account: from, contact: "—", amount, type: "Transfer", status: "POSTED" };
    setTransactions((items) => [transfer, ...items]);
    setTransferOpen(false);
    notify("Transfer berhasil diposting. Total aset likuid dan P&L tidak berubah.");
  };

  return (
    <main className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="brand"><div className="brand-word">CKJS Finance</div></div>
        <nav className="sidebar-nav" aria-label="Navigasi utama">
          {navItems.filter((item) => item.group === "workspace").map((item) => <button className={`nav-item ${view === item.label ? "active" : ""}`} onClick={() => go(item.label)} key={item.label} type="button"><HugeiconsIcon className="nav-symbol" icon={item.icon} size={18} strokeWidth={1.7} />{item.label}</button>)}
        </nav>
        <section className="sidebar-projects" aria-label="Proyek aktif">
          <div className="sidebar-section-head"><strong>Projects</strong><button onClick={() => go("Projects")} aria-label="Tambah atau lihat proyek" type="button"><HugeiconsIcon icon={PlusSignIcon} size={17} strokeWidth={2} /></button></div>
          {projectRows.slice(0, 3).map((project) => <button className={`project-shortcut ${selectedProject?.name === project.name ? "active" : ""}`} onClick={() => { setView("Projects"); setSelectedProject(project); setSidebarOpen(false); }} key={project.name} type="button"><i style={{ background: project.color }} />{project.name}</button>)}
        </section>
        <div className="sidebar-footer">
          {navItems.filter((item) => item.group === "system").map((item) => <button className={`nav-item ${view === item.label ? "active" : ""}`} onClick={() => go(item.label)} key={item.label} type="button"><HugeiconsIcon className="nav-symbol" icon={item.icon} size={18} strokeWidth={1.7} />{item.label}</button>)}
          <button className="nav-item help-item" onClick={() => notify("Pusat bantuan CKJS siap membantu Anda.")} type="button"><HugeiconsIcon className="nav-symbol" icon={HelpCircleIcon} size={18} strokeWidth={1.7} />Help &amp; Support<span className="help-badge">2</span></button>
        </div>
      </aside>

      <section className="content-shell">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Buka navigasi" type="button"><HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={1.8} /></button>
          <label className="global-command"><HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={1.7} /><input ref={commandSearchRef} placeholder="Search or type a command" aria-label="Search or type a command" /><kbd>⌘ F</kbd></label>
          <div className="topbar-actions"><button className="icon-button notification" aria-label="Notifikasi" type="button"><HugeiconsIcon icon={Notification03Icon} size={17} strokeWidth={1.7} /><i /></button><div className="top-avatar">JI</div></div>
        </header>

        <div className="page">
          {view === "Dashboard" && <DashboardView go={go} newTransaction={() => setNewTxOpen(true)} transfer={() => setTransferOpen(true)} cashAccounts={cashAccounts} />}
          {view === "Projects" && (selectedProject ? <ProjectDetail project={selectedProject} transactions={transactions} back={() => setSelectedProject(null)} /> : <ProjectsView openProject={setSelectedProject} />)}
          {view === "Transactions" && <TransactionsView transactions={transactions} newTransaction={() => setNewTxOpen(true)} selectTransaction={setSelectedTx} />}
          {view === "Cash Accounts" && <CashAccountsView accounts={cashAccounts} transfer={() => setTransferOpen(true)} />}
          {view === "Receivables" && <LedgerView type="AR" rows={receivables} />}
          {view === "Payables" && <LedgerView type="AP" rows={payables} />}
          {view === "Reports" && <ReportsView notify={notify} />}
          {view === "Masters" && <MastersView notify={notify} />}
          {view === "Migration" && <MigrationView notify={notify} />}
          {view === "Settings" && <SettingsView notify={notify} />}
        </div>
      </section>

      {sidebarOpen && <button className="overlay" onClick={() => setSidebarOpen(false)} aria-label="Tutup navigasi" type="button" />}
      {newTxOpen && <NewTransactionModal close={() => setNewTxOpen(false)} submit={createTransaction} />}
      {transferOpen && <TransferModal accounts={cashAccounts} close={() => setTransferOpen(false)} submit={transferFunds} />}
      {selectedTx && <TransactionDetail transaction={selectedTx} close={() => setSelectedTx(null)} reverse={reverseTransaction} />}
      {toast && <div className="toast"><i>✓</i>{toast}</div>}
    </main>
  );
}

function DashboardView({ go, newTransaction, transfer, cashAccounts }: { go: (view: View) => void; newTransaction: () => void; transfer: () => void; cashAccounts: typeof cashSeed }) {
  const kpis = [
    { label: "Total Cash", value: formatIDR(cashAccounts.reduce((sum, item) => sum + item.balance, 0)), delta: "+8,4%", tone: "green", meta: "dari bulan lalu" },
    { label: "Revenue", value: "Rp 1.284.000.000", delta: "+12,5%", tone: "blue", meta: "periode ini" },
    { label: "Expense", value: "Rp 846.750.000", delta: "+4,2%", tone: "amber", meta: "periode ini" },
    { label: "Net Profit", value: "Rp 437.250.000", delta: "34,1%", tone: "purple", meta: "profit margin" },
  ];
  return <>
    <section className="dashboard-welcome">
      <div className="dashboard-welcome-top"><div><p>Thursday, 20th August</p><h1>Good Evening! Jason,</h1></div><div className="heading-actions"><label className="select-control">Periode<select defaultValue="aug"><option value="aug">Agustus 2026</option><option>Juli 2026</option></select></label><label className="select-control">Project<select defaultValue="all"><option value="all">All Projects</option><option>Hotel Gamelan</option><option>Villa Ubud</option></select></label><button className="primary-button" onClick={newTransaction} type="button"><span>＋</span> New Transaction</button></div></div>
      <div className="welcome-stats"><span><HugeiconsIcon icon={Clock01Icon} size={17} strokeWidth={1.8} /><b>12hrs</b> Time Saved</span><span><HugeiconsIcon icon={CheckmarkCircle02Icon} size={17} strokeWidth={1.8} /><b>1</b> Project Completed</span><span><HugeiconsIcon icon={HourglassIcon} size={17} strokeWidth={1.8} /><b>3</b> Projects In-progress</span></div>
    </section>
    <div className="quick-row"><button onClick={newTransaction} type="button"><i>＋</i><span><b>Catat transaksi</b><small>Income atau expense</small></span></button><button onClick={transfer} type="button"><i>↔</i><span><b>Transfer dana</b><small>Antar pos kas</small></span></button><button onClick={() => go("Projects")} type="button"><i>▱</i><span><b>Kelola proyek</b><small>Project aktif</small></span></button></div>
    <section className="kpi-grid" aria-label="Ringkasan keuangan">{kpis.map((item) => <article className={`kpi-card ${item.tone}`} key={item.label}><div className="kpi-top"><span>{item.label}</span><i>↗</i></div><strong>{item.value}</strong><p><b>{item.delta}</b> {item.meta}</p></article>)}</section>
    <section className="dashboard-grid">
      <article className="panel cash-panel"><div className="panel-head"><div><h2>Cash Position</h2><p>Saldo berdasarkan pos dana</p></div><button onClick={() => go("Cash Accounts")} type="button">View accounts →</button></div><div className="cash-total"><span>Total liquidity</span><strong>{formatIDR(cashAccounts.reduce((sum, item) => sum + item.balance, 0))}</strong></div><div className="cash-rows"><div><i className="account-icon bank">B</i><span><b>Bank Operasional</b><small>2 accounts</small></span><strong>{formatIDR(cashAccounts.filter((a) => a.type === "BANK").reduce((s, a) => s + a.balance, 0))}</strong></div><div><i className="account-icon giro">G</i><span><b>Giro</b><small>1 account</small></span><strong>{formatIDR(cashAccounts.filter((a) => a.type === "GIRO").reduce((s, a) => s + a.balance, 0))}</strong></div><div><i className="account-icon cash">K</i><span><b>Kas Proyek</b><small>3 active projects</small></span><strong>{formatIDR(cashAccounts.filter((a) => a.type === "PETTY CASH").reduce((s, a) => s + a.balance, 0))}</strong></div></div></article>
      <article className="panel chart-panel"><div className="panel-head"><div><h2>Revenue vs Expense</h2><p>6 bulan terakhir</p></div><div className="legend"><span><i className="rev" />Revenue</span><span><i className="exp" />Expense</span></div></div><div className="bar-chart" aria-label="Grafik revenue dan expense 6 bulan">{[52, 68, 61, 78, 70, 90].map((height, index) => <div className="bar-group" key={index}><div className="bars"><i className="bar-rev" style={{ height: `${height}%` }} /><i className="bar-exp" style={{ height: `${height - 18}%` }} /></div><span>{["Mar", "Apr", "Mei", "Jun", "Jul", "Agu"][index]}</span></div>)}</div></article>
      <article className="panel category-panel"><div className="panel-head"><div><h2>Expense by Category</h2><p>Distribusi bulan berjalan</p></div><button type="button">•••</button></div><div className="donut-layout"><div className="donut"><div><strong>Rp 846,7 jt</strong><span>Total expense</span></div></div><div className="category-list"><span><i className="cat-1" />Material <b>42%</b></span><span><i className="cat-2" />Tenaga Kerja <b>28%</b></span><span><i className="cat-3" />Operasional <b>18%</b></span><span><i className="cat-4" />Lainnya <b>12%</b></span></div></div></article>
    </section>
    <article className="panel performance-panel"><div className="panel-head"><div><h2>Project Performance</h2><p>Profitabilitas project aktif periode ini</p></div><button onClick={() => go("Projects")} type="button">View all projects →</button></div><div className="table-wrap"><table><thead><tr><th>Project</th><th>Revenue</th><th>Expense</th><th>Net Profit</th><th>Margin</th></tr></thead><tbody>{projectRows.slice(0, 3).map((project) => { const profit = project.revenue - project.expense; return <tr key={project.name}><td><i style={{ background: project.color }} /><span><b>{project.name}</b><small>{project.client}</small></span></td><td>{formatIDR(project.revenue)}</td><td>{formatIDR(project.expense)}</td><td className="profit">{formatIDR(profit)}</td><td><span className="margin-pill">{Math.round((profit / project.revenue) * 100)}%</span></td></tr>; })}</tbody></table></div></article>
  </>;
}

function ProjectsView({ openProject }: { openProject: (project: (typeof projectRows)[number]) => void }) {
  const [search, setSearch] = useState("");
  const rows = projectRows.filter((project) => `${project.name} ${project.client}`.toLowerCase().includes(search.toLowerCase()));
  return <><PageIntro title="Projects" description="Kelola dan pantau performa seluruh proyek perusahaan." action={<button className="primary-button" type="button"><span>＋</span> Add Project</button>} /><section className="mini-kpi-grid"><article><span>Active Projects</span><strong>3</strong><small>Total kontrak Rp 1,12 M</small></article><article><span>Combined Revenue</span><strong>Rp 1,28 M</strong><small className="text-green">+12,5% bulan ini</small></article><article><span>Net Project Profit</span><strong>Rp 437,2 Jt</strong><small>Margin rata-rata 34,1%</small></article></section><article className="panel list-panel"><FilterBar><div className="search-box">⌕<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search project or client..." /></div><select><option>All Status</option><option>Active</option><option>Completed</option></select><select><option>All Clients</option><option>PT Aruna Hospitality</option></select><button className="filter-button" type="button">≡ More filters</button></FilterBar><div className="table-wrap full-table"><table><thead><tr><th>Project</th><th>Client</th><th>Timeline</th><th>Revenue</th><th>Expense</th><th>Profit</th><th>Status</th></tr></thead><tbody>{rows.map((project) => <tr key={project.code} onClick={() => openProject(project)} className="clickable-row"><td><i style={{ background: project.color }} /><span><b>{project.name}</b><small>{project.code}</small></span></td><td>{project.client}</td><td><b>{project.start}</b><small>s.d. {project.end}</small></td><td>{formatIDR(project.revenue)}</td><td>{formatIDR(project.expense)}</td><td className="profit">{formatIDR(project.revenue - project.expense)}</td><td><StatusBadge status={project.status} /></td></tr>)}</tbody></table></div></article></>;
}

function ProjectDetail({ project, transactions, back }: { project: (typeof projectRows)[number]; transactions: Transaction[]; back: () => void }) {
  const [tab, setTab] = useState("Overview");
  const projectTransactions = transactions.filter((item) => item.project === project.name);
  const profit = project.revenue - project.expense;
  return <><button className="back-button" onClick={back} type="button">← Back to Projects</button><div className="detail-hero"><div className="project-monogram" style={{ background: project.color }}>{project.name.split(" ").map((word) => word[0]).join("")}</div><div><span className="eyebrow">{project.code}</span><h1>{project.name}</h1><p>{project.client} · {project.start} – {project.end}</p></div><StatusBadge status={project.status} /></div><div className="tabs">{["Overview", "Transactions", "Cash", "P&L", "Ledger"].map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item} type="button">{item}</button>)}</div>{tab === "Overview" && <><section className="mini-kpi-grid project-kpis"><article><span>Contract Revenue</span><strong>{formatIDR(project.revenue)}</strong><small>100% contract value</small></article><article><span>Total Expense</span><strong>{formatIDR(project.expense)}</strong><small>{Math.round((project.expense / project.revenue) * 100)}% of revenue</small></article><article><span>Net Profit</span><strong className="text-green">{formatIDR(profit)}</strong><small>Margin {Math.round((profit / project.revenue) * 100)}%</small></article></section><div className="two-column"><article className="panel"><div className="panel-head"><div><h2>Financial Progress</h2><p>Ringkasan realisasi proyek</p></div></div><div className="progress-row"><span>Revenue recognized <b>{formatIDR(project.revenue)}</b></span><div><i style={{ width: "78%" }} /></div><small>78% dari nilai kontrak</small></div><div className="progress-row expense-progress"><span>Expense realized <b>{formatIDR(project.expense)}</b></span><div><i style={{ width: "63%" }} /></div><small>63% dari estimasi operasional</small></div></article><article className="panel"><div className="panel-head"><div><h2>Recent Activity</h2><p>Transaksi terbaru proyek</p></div></div><div className="activity-list">{projectTransactions.slice(0, 3).map((tx) => <div key={tx.id}><i className={tx.type.toLowerCase()}>{tx.type === "Income" ? "+" : "−"}</i><span><b>{tx.description}</b><small>{tx.date} · {tx.account}</small></span><strong>{tx.type === "Income" ? "+" : "−"}{formatIDR(tx.amount).replace("Rp ", "Rp")}</strong></div>)}</div></article></div></>}{tab !== "Overview" && <article className="panel section-placeholder"><div className="section-icon">{tab === "P&L" ? "▥" : tab === "Cash" ? "▣" : "↕"}</div><h2>{tab} — {project.name}</h2><p>Data {tab.toLowerCase()} sudah terhubung ke project dan periode aktif.</p>{tab === "P&L" && <div className="statement compact"><div><span>Revenue</span><strong>{formatIDR(project.revenue)}</strong></div><div><span>Project expenses</span><strong>({formatIDR(project.expense)})</strong></div><div className="statement-total"><span>Net project profit</span><strong>{formatIDR(profit)}</strong></div></div>}</article>}</>;
}

function TransactionsView({ transactions, newTransaction, selectTransaction }: { transactions: Transaction[]; newTransaction: () => void; selectTransaction: (tx: Transaction) => void }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const filtered = transactions.filter((tx) => `${tx.id} ${tx.description} ${tx.project}`.toLowerCase().includes(search.toLowerCase()) && (status === "All Status" || tx.status === status));
  return <><PageIntro title="Transactions" description="Semua transaksi kas, beban, pendapatan, dan transfer internal." action={<button className="primary-button" onClick={newTransaction} type="button"><span>＋</span> New Transaction</button>} /><article className="panel list-panel"><FilterBar><div className="search-box wide">⌕<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search transaction, reference, or description..." /></div><select><option>Agustus 2026</option><option>Juli 2026</option></select><select><option>All Projects</option><option>Corporate</option><option>Hotel Gamelan</option></select><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All Status</option><option>DRAFT</option><option>POSTED</option><option>REVERSED</option></select></FilterBar><div className="table-wrap full-table"><table><thead><tr><th>Date / Reference</th><th>Description</th><th>Project</th><th>Category</th><th>Cash Account</th><th>Amount</th><th>Status</th></tr></thead><tbody>{filtered.map((tx) => <tr className="clickable-row" onClick={() => selectTransaction(tx)} key={tx.id}><td><b>{tx.date}</b><small>{tx.id}</small></td><td><b>{tx.description}</b><small>{tx.contact}</small></td><td>{tx.project}</td><td>{tx.category}</td><td>{tx.account}</td><td className={tx.type === "Income" ? "profit" : ""}><b>{tx.type === "Income" ? "+" : tx.type === "Expense" ? "−" : ""}{formatIDR(tx.amount)}</b><small>{tx.type}</small></td><td><StatusBadge status={tx.status} /></td></tr>)}</tbody></table></div><div className="table-footer"><span>Showing {filtered.length} of {transactions.length} transactions</span><div><button type="button">←</button><button className="active" type="button">1</button><button type="button">2</button><button type="button">→</button></div></div></article></>;
}

function CashAccountsView({ accounts, transfer }: { accounts: typeof cashSeed; transfer: () => void }) {
  const total = accounts.reduce((sum, account) => sum + account.balance, 0);
  return <><PageIntro title="Cash Accounts" description="Pantau saldo Bank, Giro, dan Kas Proyek dalam satu tampilan." action={<button className="primary-button" onClick={transfer} type="button">↔ Transfer Funds</button>} /><section className="cash-summary"><div><span>Total Liquidity</span><strong>{formatIDR(total)}</strong><small>Ledger balance · 20 Agu 2026</small></div><div><span>Bank</span><strong>{formatIDR(accounts.filter((a) => a.type === "BANK").reduce((s, a) => s + a.balance, 0))}</strong><small>2 active accounts</small></div><div><span>Giro</span><strong>{formatIDR(accounts.filter((a) => a.type === "GIRO").reduce((s, a) => s + a.balance, 0))}</strong><small>1 active account</small></div><div><span>Kas Proyek</span><strong>{formatIDR(accounts.filter((a) => a.type === "PETTY CASH").reduce((s, a) => s + a.balance, 0))}</strong><small>3 active projects</small></div></section><FilterBar><select><option>All Account Types</option><option>Bank</option><option>Giro</option><option>Petty Cash</option></select><select><option>All Projects</option><option>Corporate</option><option>Hotel Gamelan</option></select></FilterBar><section className="account-grid">{accounts.map((account) => <article className="account-card" key={account.name}><div className={`account-card-icon ${account.tone}`}>{account.type === "BANK" ? "B" : account.type === "GIRO" ? "G" : "K"}</div><StatusBadge status="ACTIVE" /><h2>{account.name}</h2><p>{account.no} · {account.project}</p><span>Current Balance</span><strong>{formatIDR(account.balance)}</strong><div><small>Updated from posted ledger</small><button type="button">View ledger →</button></div></article>)}</section></>;
}

function LedgerView({ type, rows }: { type: "AR" | "AP"; rows: typeof receivables }) {
  const isAR = type === "AR";
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const paid = rows.reduce((sum, row) => sum + row.paid, 0);
  return <><PageIntro title={isAR ? "Receivables" : "Payables"} description={isAR ? "Pantau piutang outstanding per klien dan proyek." : "Pantau hutang outstanding per vendor dan proyek."} action={<button className="primary-button" type="button"><span>＋</span>{isAR ? "New Receivable" : "New Payable"}</button>} /><section className="mini-kpi-grid"><article><span>Total {isAR ? "Receivable" : "Payable"}</span><strong>{formatIDR(total)}</strong><small>3 open records</small></article><article><span>Paid</span><strong className="text-green">{formatIDR(paid)}</strong><small>{Math.round((paid / total) * 100)}% settled</small></article><article><span>Outstanding</span><strong className="text-amber">{formatIDR(total - paid)}</strong><small>Action required</small></article></section><article className="panel list-panel"><FilterBar><div className="search-box">⌕<input placeholder={`Search ${isAR ? "client" : "vendor"} or reference...`} /></div><select><option>All Projects</option><option>Hotel Gamelan</option></select><select><option>All Status</option><option>Outstanding</option><option>Partially Paid</option><option>Paid</option></select><select><option>All Due Dates</option><option>Due this month</option></select></FilterBar><div className="table-wrap full-table"><table><thead><tr><th>{isAR ? "Client" : "Vendor"}</th><th>Project / Reference</th><th>Total</th><th>Paid</th><th>Outstanding</th><th>Due Date</th><th>Status</th></tr></thead><tbody>{rows.map((row) => <tr key={row.ref}><td><b>{row.party}</b><small>{isAR ? "Client" : "Vendor"}</small></td><td><b>{row.project}</b><small>{row.ref}</small></td><td>{formatIDR(row.total)}</td><td className="profit">{formatIDR(row.paid)}</td><td><b>{formatIDR(row.total - row.paid)}</b></td><td>{row.due}</td><td><StatusBadge status={row.status} /></td></tr>)}</tbody></table></div></article></>;
}

function ReportsView({ notify }: { notify: (message: string) => void }) {
  const [report, setReport] = useState("P&L");
  const reportTabs = ["Cashflow", "P&L", "Balance Sheet", "General Ledger", "AR", "AP"];
  return <><PageIntro title="Financial Reports" description="Laporan real-time yang dapat ditelusuri hingga transaksi sumber." action={<><button className="secondary-button" onClick={() => notify("Laporan Excel siap diunduh.")} type="button">⇩ Export Excel</button><button className="primary-button" onClick={() => notify("Laporan PDF siap diunduh.")} type="button">⇩ Export PDF</button></>} /><div className="tabs report-tabs">{reportTabs.map((tab) => <button className={report === tab ? "active" : ""} onClick={() => setReport(tab)} key={tab} type="button">{tab}</button>)}</div><FilterBar><label className="select-control">Periode<select><option>01–20 Agustus 2026</option><option>Juli 2026</option></select></label><label className="select-control">Scope<select><option>All Projects + Corporate</option><option>Project only</option><option>Corporate only</option></select></label><label className="select-control">Project<select><option>All Projects</option><option>Hotel Gamelan</option><option>Villa Ubud</option></select></label><button className="filter-apply" type="button">Apply Filters</button></FilterBar><article className="panel report-sheet"><div className="report-heading"><div className="report-logo">CK</div><div><h2>CV. Cipta Karya Jaya Sentosa</h2><p>{report === "P&L" ? "Profit & Loss Statement" : `${report} Report`}</p><small>Periode 01–20 Agustus 2026 · All Projects + Corporate</small></div><span className="live-chip"><i />REAL-TIME</span></div>{report === "P&L" ? <div className="statement"><h3>REVENUE</h3><div><span>Project Revenue — Hotel Gamelan</span><strong>Rp 480.000.000</strong></div><div><span>Project Revenue — Villa Ubud</span><strong>Rp 364.000.000</strong></div><div><span>Project Revenue — Kantor Sentosa</span><strong>Rp 280.000.000</strong></div><div className="statement-subtotal"><span>Total Project Revenue</span><strong>Rp 1.124.000.000</strong></div><div><span>Other Corporate Revenue</span><strong>Rp 160.000.000</strong></div><div className="statement-total revenue-total"><span>TOTAL REVENUE</span><strong>Rp 1.284.000.000</strong></div><h3>EXPENSES</h3><div><span>Project Expenses</span><strong>Rp 744.750.000</strong></div><div><span>Corporate / Office Expenses</span><strong>Rp 102.000.000</strong></div><div className="statement-total"><span>TOTAL EXPENSES</span><strong>(Rp 846.750.000)</strong></div><div className="statement-profit"><span><b>NET PROFIT</b><small>Profit margin 34,1%</small></span><strong>Rp 437.250.000</strong></div></div> : <ReportPlaceholder report={report} />}</article></>;
}

function ReportPlaceholder({ report }: { report: string }) {
  const lines = report === "Cashflow" ? [["Opening Cash Balance", "Rp 1.974.500.000"], ["Cash Inflow", "Rp 1.284.000.000"], ["Cash Outflow", "(Rp 820.000.000)"], ["Closing Cash Balance", "Rp 2.438.500.000"]] : report === "Balance Sheet" ? [["Cash & Bank", "Rp 2.438.500.000"], ["Accounts Receivable", "Rp 200.000.000"], ["Accounts Payable", "(Rp 68.500.000)"], ["Net Liquid Assets", "Rp 2.570.000.000"]] : [["Opening balance", "Rp 1.974.500.000"], ["Posted debits", "Rp 1.284.000.000"], ["Posted credits", "(Rp 820.000.000)"], ["Closing balance", "Rp 2.438.500.000"]];
  return <div className="statement placeholder-statement"><h3>{report.toUpperCase()}</h3>{lines.map(([label, value], index) => <div className={index === lines.length - 1 ? "statement-profit" : ""} key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}

function MastersView({ notify }: { notify: (message: string) => void }) {
  const [tab, setTab] = useState("Chart of Accounts");
  const accounts = [["1-1101", "Bank Operasional BCA", "ASSET", "Cash & Bank", "Corporate"], ["1-1201", "Kas Proyek", "ASSET", "Petty Cash", "Project"], ["4-1001", "Pendapatan Termin", "REVENUE", "Project Revenue", "Project"], ["5-1101", "Biaya Material", "EXPENSE", "Direct Cost", "Project"], ["6-1001", "Beban Kantor", "EXPENSE", "Corporate Expense", "Corporate"]];
  const contacts = [["PT Aruna Hospitality", "CLIENT", "Hotel Gamelan", "Rp 100.000.000"], ["Nusantara Living", "CLIENT", "Villa Ubud", "Rp 120.000.000"], ["UD Sinar Baja", "VENDOR", "Hotel Gamelan", "Rp 24.500.000"], ["PT Beton Perkasa", "VENDOR", "Villa Ubud", "Rp 44.000.000"]];
  return <><PageIntro title="Master Data" description="Kelola chart of accounts dan daftar rekanan perusahaan." action={<button className="primary-button" onClick={() => notify(`Form tambah ${tab.toLowerCase()} dibuka.`)} type="button"><span>＋</span> Add {tab === "Chart of Accounts" ? "Account" : "Contact"}</button>} /><div className="tabs">{["Chart of Accounts", "Contacts"].map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item} type="button">{item}</button>)}</div><article className="panel list-panel"><FilterBar><div className="search-box wide">⌕<input placeholder={`Search ${tab.toLowerCase()}...`} /></div><select><option>All Types</option><option>Asset</option><option>Expense</option></select><select><option>Active</option><option>Inactive</option></select></FilterBar><div className="table-wrap full-table"><table><thead><tr>{(tab === "Chart of Accounts" ? ["Code", "Account Name", "Type", "Category", "Scope", "Status"] : ["Contact", "Type", "Related Project", "Outstanding", "Status", "Action"]).map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{tab === "Chart of Accounts" ? accounts.map((row) => <tr key={row[0]}><td><b>{row[0]}</b></td><td><b>{row[1]}</b></td><td><span className="type-pill">{row[2]}</span></td><td>{row[3]}</td><td>{row[4]}</td><td><StatusBadge status="ACTIVE" /></td></tr>) : contacts.map((row) => <tr key={row[0]}><td><b>{row[0]}</b></td><td><span className="type-pill">{row[1]}</span></td><td>{row[2]}</td><td><b>{row[3]}</b></td><td><StatusBadge status="ACTIVE" /></td><td><button className="row-action" type="button">•••</button></td></tr>)}</tbody></table></div></article></>;
}

function MigrationView({ notify }: { notify: (message: string) => void }) {
  const [step, setStep] = useState(0);
  const steps = ["Upload", "Validate", "Mapping", "Preview", "Import", "Reconciliation"];
  const advance = () => { if (step < steps.length - 1) setStep(step + 1); if (step === 4) notify("Import selesai. 1.248 baris berhasil diproses."); };
  return <><PageIntro title="Data Migration" description="Migrasi file Excel historis dengan validasi dan rekonsiliasi terkontrol." /><div className="migration-stepper">{steps.map((item, index) => <div className={`${index === step ? "active" : ""} ${index < step ? "done" : ""}`} key={item}><i>{index < step ? "✓" : index + 1}</i><span>{item}</span>{index < steps.length - 1 && <b />}</div>)}</div><article className="panel migration-card">{step === 0 && <div className="upload-zone"><div className="upload-cloud">⇧</div><h2>Upload your Excel files</h2><p>Tarik file ke area ini atau pilih dari komputer. Mendukung .xlsx dan .xls.</p><label className="primary-button file-button">Choose Files<input type="file" accept=".xlsx,.xls" onChange={() => setStep(1)} /></label><small>Maksimum 25 MB per file · Struktur asli tidak akan diubah</small></div>}{step === 1 && <MigrationValidation />}{step === 2 && <MigrationMapping />}{step === 3 && <MigrationPreview />}{step === 4 && <MigrationImport />}{step === 5 && <MigrationReconciliation />}{step > 0 && <div className="migration-actions"><button className="secondary-button" onClick={() => setStep(Math.max(0, step - 1))} type="button">← Previous</button>{step < 5 && <button className="primary-button" onClick={advance} type="button">{step === 4 ? "Import Data" : "Continue"} →</button>} {step === 5 && <button className="primary-button" onClick={() => setStep(0)} type="button">Finish Migration</button>}</div>}</article></>;
}

function MigrationValidation() { return <div className="migration-content"><div className="migration-title"><i className="success-ring">✓</i><div><h2>File structure validated</h2><p>3 workbook berhasil dibaca dan siap dipetakan.</p></div></div><div className="file-list"><div><span>Rekap_Keuangan_2025.xlsx<small>8 sheets · 824 rows</small></span><StatusBadge status="VALID" /></div><div><span>Cashflow_Project_2026.xlsx<small>5 sheets · 312 rows</small></span><StatusBadge status="VALID" /></div><div><span>Data_Hutang_Piutang.xlsx<small>2 sheets · 112 rows</small></span><StatusBadge status="WARNING" /></div></div><div className="warning-box">! 4 nama akun belum ditemukan pada Chart of Accounts dan perlu dipetakan.</div></div>; }
function MigrationMapping() { return <div className="migration-content"><div className="migration-title"><div><h2>Account & category mapping</h2><p>Padankan kolom Excel dengan master data sistem.</p></div><span className="mapping-progress">12 / 16 mapped</span></div><div className="mapping-table"><div className="mapping-head"><span>Excel value</span><span>System account</span><span>Status</span></div>{[["Biaya Tukang", "5-1201 · Tenaga Kerja", "MAPPED"], ["Besi & Baja", "5-1101 · Biaya Material", "MAPPED"], ["Kas Proyek GML", "1-1201 · Kas Proyek", "MAPPED"], ["Biaya Lain-Lain", "Select account...", "UNMAPPED"]].map((row) => <div key={row[0]}><b>{row[0]}</b><select defaultValue={row[1]}><option>{row[1]}</option><option>5-1901 · Biaya Lainnya</option></select><StatusBadge status={row[2]} /></div>)}</div></div>; }
function MigrationPreview() { return <div className="migration-content"><div className="migration-title"><div><h2>Import preview</h2><p>Periksa ringkasan data sebelum dimasukkan ke sistem.</p></div><span className="live-chip"><i />BALANCED</span></div><section className="mini-kpi-grid migration-kpis"><article><span>Transactions</span><strong>1.248</strong><small>1.104 posted · 144 draft</small></article><article><span>Total Debit</span><strong>Rp 8,42 M</strong><small>Across 1.248 records</small></article><article><span>Total Credit</span><strong>Rp 8,42 M</strong><small className="text-green">Difference Rp 0</small></article></section><div className="preview-table"><span>01 Jan 2025</span><b>Penerimaan termin proyek</b><span>Hotel Gamelan</span><strong>Rp 180.000.000</strong><StatusBadge status="READY" /></div><div className="preview-table"><span>03 Jan 2025</span><b>Pembelian material awal</b><span>Hotel Gamelan</span><strong>Rp 46.500.000</strong><StatusBadge status="READY" /></div></div>; }
function MigrationImport() { return <div className="migration-content import-state"><div className="import-art">⇩</div><h2>Ready to import 1.248 transactions</h2><p>Proses akan membuat jurnal berimbang, project allocation, dan audit log untuk setiap baris.</p><div className="impact-list"><span><i>✓</i> 1.248 transaction headers</span><span><i>✓</i> 2.496 balanced journal lines</span><span><i>✓</i> 16 cash accounts reconciled</span></div></div>; }
function MigrationReconciliation() { return <div className="migration-content"><div className="reconcile-hero"><div className="success-ring large">✓</div><h2>Migration completed & balanced</h2><p>Data sumber dan ledger sistem telah direkonsiliasi.</p></div><div className="reconcile-grid"><article><span>Source Total</span><strong>Rp 8.420.750.000</strong><small>Excel source · 1.248 rows</small></article><article><span>System Total</span><strong>Rp 8.420.750.000</strong><small>Posted ledger · 1.248 records</small></article><article className="balanced-card"><span>Difference</span><strong>Rp 0</strong><small>✓ Reconciliation balanced</small></article></div><div className="audit-note"><b>Audit package ready</b><span>Import log, mapping results, dan data mismatch report telah dibuat.</span><button type="button">Download package ⇩</button></div></div>; }

function SettingsView({ notify }: { notify: (message: string) => void }) {
  const [tab, setTab] = useState("Company");
  return <><PageIntro title="Settings" description="Konfigurasi profil perusahaan, pengguna, dan preferensi dasar." /><div className="settings-layout"><aside>{["Company", "Users", "Accounting", "System"].map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item} type="button">{item}</button>)}</aside><article className="panel settings-card"><h2>{tab} Settings</h2><p>Kelola konfigurasi {tab.toLowerCase()} untuk aplikasi CKJS Finance.</p>{tab === "Company" ? <div className="form-grid"><label className="full">Company Name<input defaultValue="CV. Cipta Karya Jaya Sentosa" /></label><label>Business Type<input defaultValue="Construction & Contractor" /></label><label>Tax ID / NPWP<input defaultValue="—" /></label><label>Phone<input defaultValue="+62 812 3456 7890" /></label><label>Email<input defaultValue="finance@ckjs.co.id" /></label><label className="full">Address<textarea defaultValue="Denpasar, Bali, Indonesia" /></label></div> : tab === "Users" ? <div className="user-list"><div><div className="avatar">JI</div><span><b>Jason Ibrahim</b><small>jason@ckjs.co.id · Owner / Director</small></span><StatusBadge status="ACTIVE" /></div><div><div className="avatar second">CO</div><span><b>Co-Owner CKJS</b><small>owner2@ckjs.co.id · Owner / Director</small></span><StatusBadge status="ACTIVE" /></div><div className="future-role">Finance/Admin dan Site Supervisor tersedia sebagai future-ready role, tanpa workflow Phase 1.</div></div> : <div className="setting-options"><label><span><b>Accounting basis</b><small>Metode pengakuan pendapatan sistem</small></span><select><option>Cash basis</option></select></label><label><span><b>Transaction numbering</b><small>Format nomor transaksi otomatis</small></span><input defaultValue="TX-YYYYMM-####" /></label><label><span><b>Default currency</b><small>Mata uang untuk semua laporan</small></span><select><option>IDR — Indonesian Rupiah</option></select></label></div>}<div className="settings-save"><button className="primary-button" onClick={() => notify(`${tab} settings berhasil disimpan.`)} type="button">Save Changes</button></div></article></div></>;
}

function NewTransactionModal({ close, submit }: { close: () => void; submit: (tx: Omit<Transaction, "id" | "date">, post: boolean) => void }) {
  const [type, setType] = useState<"Income" | "Expense" | "Transfer">("Expense");
  const [scope, setScope] = useState("Project");
  const [project, setProject] = useState("Hotel Gamelan");
  const [category, setCategory] = useState("Biaya Material");
  const [account, setAccount] = useState("Kas Gamelan");
  const [contact, setContact] = useState("UD Sinar Baja");
  const [description, setDescription] = useState("Pembelian material proyek");
  const [amount, setAmount] = useState(10000000);
  const debitAccount = type === "Expense" ? category : account;
  const creditAccount = type === "Expense" ? account : "Pendapatan Termin";
  const valid = amount > 0 && description.trim().length > 2;
  const send = (post: boolean) => { if (valid) submit({ type, project: scope === "Corporate" ? "Corporate" : project, category, account, contact, description, amount, status: post ? "POSTED" : "DRAFT" }, post); };
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="New transaction"><div className="modal-card transaction-modal"><div className="modal-head"><div><span className="eyebrow">NEW TRANSACTION</span><h2>Record a financial transaction</h2><p>Isi dalam bahasa bisnis. Sistem membuat jurnal otomatis.</p></div><button onClick={close} aria-label="Tutup" type="button">×</button></div><div className="transaction-type">{(["Income", "Expense", "Transfer"] as const).map((item) => <button className={type === item ? "active" : ""} onClick={() => setType(item)} key={item} type="button"><i>{item === "Income" ? "↓" : item === "Expense" ? "↑" : "↔"}</i><span><b>{item}</b><small>{item === "Income" ? "Money received" : item === "Expense" ? "Money spent" : "Move funds"}</small></span></button>)}</div><div className="modal-body"><div className="form-section"><h3>Transaction details</h3><div className="form-grid"><label className="full">Allocation<div className="segmented"><button className={scope === "Project" ? "active" : ""} onClick={() => setScope("Project")} type="button">Project Expense</button><button className={scope === "Corporate" ? "active" : ""} onClick={() => setScope("Corporate")} type="button">Corporate / Office</button></div></label>{scope === "Project" && <label>Project<select value={project} onChange={(e) => setProject(e.target.value)}><option>Hotel Gamelan</option><option>Villa Ubud</option><option>Kantor Sentosa</option></select></label>}<label>{type === "Income" ? "Revenue Category" : "Expense Category"}<select value={category} onChange={(e) => setCategory(e.target.value)}><option>{type === "Income" ? "Pendapatan Termin" : "Biaya Material"}</option><option>{type === "Income" ? "Pendapatan Lainnya" : "Tenaga Kerja"}</option><option>Operasional Proyek</option><option>Beban Kantor</option></select></label><label>Source Cash Account<select value={account} onChange={(e) => setAccount(e.target.value)}><option>Kas Gamelan</option><option>Bank Operasional BCA</option><option>Giro BCA</option></select></label><label>{type === "Income" ? "Client" : "Vendor / Contact"}<select value={contact} onChange={(e) => setContact(e.target.value)}><option>UD Sinar Baja</option><option>PT Aruna Hospitality</option><option>Nusantara Living</option></select></label><label className="full">Description<input value={description} onChange={(e) => setDescription(e.target.value)} /></label><label>Amount (IDR)<input type="number" min="1" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></label><label>Transaction Date<input type="date" defaultValue="2026-08-20" /></label><label className="full">Notes<textarea placeholder="Optional notes or reference..." /></label></div></div><aside className="journal-preview"><div className="journal-head"><div><h3>Automatic Journal Preview</h3><p>Generated by transaction rules</p></div><span className={valid ? "balanced" : "unbalanced"}>{valid ? "✓ BALANCED" : "CHECK INPUT"}</span></div><div className="journal-lines"><div className="journal-label"><span>Account</span><span>Debit</span><span>Credit</span></div><div><span><b>{debitAccount}</b><small>{scope === "Project" ? project : "Corporate"}</small></span><strong>{formatIDR(amount)}</strong><strong>—</strong></div><div><span><b>{creditAccount}</b><small>{account}</small></span><strong>—</strong><strong>{formatIDR(amount)}</strong></div></div><div className="journal-total"><span>Total</span><strong>{formatIDR(amount)}</strong><strong>{formatIDR(amount)}</strong></div><div className="journal-rule"><i>i</i><p>User tidak perlu memilih debit/kredit. Jurnal terbentuk otomatis dan hanya bisa diposting saat total seimbang.</p></div></aside></div><div className="modal-actions"><button className="text-button" onClick={close} type="button">Cancel</button><button className="secondary-button" disabled={!valid} onClick={() => send(false)} type="button">Save as Draft</button><button className="primary-button" disabled={!valid} onClick={() => send(true)} type="button">Post Transaction</button></div></div></div>;
}

function TransferModal({ accounts, close, submit }: { accounts: typeof cashSeed; close: () => void; submit: (from: string, to: string, amount: number) => void }) {
  const [from, setFrom] = useState("Giro BCA");
  const [to, setTo] = useState("Bank Operasional BCA");
  const [amount, setAmount] = useState(30000000);
  const fromAccount = accounts.find((account) => account.name === from)!;
  const toAccount = accounts.find((account) => account.name === to)!;
  const valid = from !== to && amount > 0 && amount <= fromAccount.balance;
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Transfer funds"><div className="modal-card transfer-modal"><div className="modal-head"><div><span className="eyebrow">INTERNAL TRANSFER</span><h2>Transfer Funds</h2><p>Pindahkan dana antar Bank, Giro, dan Kas Proyek.</p></div><button onClick={close} aria-label="Tutup" type="button">×</button></div><div className="transfer-flow"><label>FROM ACCOUNT<select value={from} onChange={(e) => setFrom(e.target.value)}>{accounts.map((account) => <option key={account.name}>{account.name}</option>)}</select><span>Available balance <b>{formatIDR(fromAccount.balance)}</b></span></label><i>→</i><label>TO ACCOUNT<select value={to} onChange={(e) => setTo(e.target.value)}>{accounts.map((account) => <option key={account.name}>{account.name}</option>)}</select><span>Current balance <b>{formatIDR(toAccount.balance)}</b></span></label></div><div className="form-grid transfer-form"><label>Transfer Amount (IDR)<input type="number" min="1" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></label><label>Transfer Date<input type="date" defaultValue="2026-08-20" /></label><label className="full">Description<input defaultValue="Pencairan Giro ke Bank Operasional" /></label></div><div className="impact-preview"><h3>Impact Preview</h3><div><span>{from}<b>{formatIDR(fromAccount.balance)} → {formatIDR(fromAccount.balance - amount)}</b></span><strong className="text-red">−{formatIDR(amount)}</strong></div><div><span>{to}<b>{formatIDR(toAccount.balance)} → {formatIDR(toAccount.balance + amount)}</b></span><strong className="text-green">+{formatIDR(amount)}</strong></div><footer><span><i>✓</i>Total liquid assets</span><b>No change</b><span><i>✓</i>Profit & Loss</span><b>No impact</b></footer></div>{!valid && <div className="error-box">Periksa akun tujuan dan saldo yang tersedia.</div>}<div className="modal-actions"><button className="text-button" onClick={close} type="button">Cancel</button><button className="primary-button" disabled={!valid} onClick={() => submit(from, to, amount)} type="button">Confirm Transfer</button></div></div></div>;
}

function TransactionDetail({ transaction, close, reverse }: { transaction: Transaction; close: () => void; reverse: (tx: Transaction) => void }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Transaction detail"><div className="modal-card detail-modal"><div className="modal-head"><div><span className="eyebrow">{transaction.id}</span><h2>Transaction Detail</h2><p>{transaction.date} · Created by Jason Ibrahim</p></div><button onClick={close} aria-label="Tutup" type="button">×</button></div><div className="detail-status-row"><StatusBadge status={transaction.status} /><span>{transaction.type}</span></div><div className="detail-amount"><span>Total Amount</span><strong>{formatIDR(transaction.amount)}</strong><p>{transaction.description}</p></div><dl className="detail-grid"><div><dt>Project / Scope</dt><dd>{transaction.project}</dd></div><div><dt>Category</dt><dd>{transaction.category}</dd></div><div><dt>Cash Account</dt><dd>{transaction.account}</dd></div><div><dt>Contact</dt><dd>{transaction.contact}</dd></div></dl><div className="journal-preview detail-journal"><div className="journal-head"><div><h3>Journal Entry</h3><p>Automatic double-entry lines</p></div><span className="balanced">✓ BALANCED</span></div><div className="journal-lines"><div className="journal-label"><span>Account</span><span>Debit</span><span>Credit</span></div><div><span><b>{transaction.type === "Expense" ? transaction.category : transaction.account}</b><small>{transaction.project}</small></span><strong>{formatIDR(transaction.amount)}</strong><strong>—</strong></div><div><span><b>{transaction.type === "Expense" ? transaction.account : transaction.category}</b><small>{transaction.contact}</small></span><strong>—</strong><strong>{formatIDR(transaction.amount)}</strong></div></div><div className="journal-total"><span>Total</span><strong>{formatIDR(transaction.amount)}</strong><strong>{formatIDR(transaction.amount)}</strong></div></div><div className="audit-strip"><i>✓</i><span><b>Audit trail verified</b><small>Posted 18 Agu 2026, 10:42 WIB by Jason Ibrahim</small></span></div><div className="modal-actions">{transaction.status === "DRAFT" && <button className="secondary-button" type="button">Edit Draft</button>}{transaction.status === "POSTED" && <button className="danger-button" onClick={() => reverse(transaction)} type="button">Reverse Transaction</button>}<button className="primary-button" onClick={close} type="button">Close</button></div></div></div>;
}
