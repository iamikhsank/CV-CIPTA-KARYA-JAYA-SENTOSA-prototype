"use client";

import "@fontsource-variable/inter";
import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import Book01Icon from "@hugeicons/core-free-icons/Book01Icon";
import Chart01Icon from "@hugeicons/core-free-icons/Chart01Icon";
import DashboardSquare01Icon from "@hugeicons/core-free-icons/DashboardSquare01Icon";
import Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";
import HelpCircleIcon from "@hugeicons/core-free-icons/HelpCircleIcon";
import Logout03Icon from "@hugeicons/core-free-icons/Logout03Icon";
import MoneyReceive01Icon from "@hugeicons/core-free-icons/MoneyReceive01Icon";
import MoneySend01Icon from "@hugeicons/core-free-icons/MoneySend01Icon";
import Notification03Icon from "@hugeicons/core-free-icons/Notification03Icon";
import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";
import TransactionIcon from "@hugeicons/core-free-icons/TransactionIcon";
import Upload01Icon from "@hugeicons/core-free-icons/Upload01Icon";
import Wallet02Icon from "@hugeicons/core-free-icons/Wallet02Icon";
import { NewTransactionModal } from "./finance/components/NewTransactionModal";
import { TransactionDetail } from "./finance/components/TransactionDetail";
import { TransferModal } from "./finance/components/TransferModal";
import { cashSeed, initialTransactions, payables, projectRows, receivables } from "./finance/data";
import { CashAccountsView } from "./finance/pages/CashAccountsView";
import { DashboardView } from "./finance/pages/DashboardView";
import { LedgerView } from "./finance/pages/LedgerView";
import { LoginView } from "./finance/pages/LoginView";
import { MastersView } from "./finance/pages/MastersView";
import { MigrationView } from "./finance/pages/MigrationView";
import { ProjectDetail } from "./finance/pages/ProjectDetail";
import { ProjectsView } from "./finance/pages/ProjectsView";
import { ReportsView } from "./finance/pages/ReportsView";
import { SettingsView } from "./finance/pages/SettingsView";
import { TransactionsView } from "./finance/pages/TransactionsView";
import type { CashAccount, LedgerRecord, PaymentInput, Project, Transaction, View } from "./finance/types";

const navItems = [
  { icon: DashboardSquare01Icon, label: "Dashboard", group: "workspace" },
  { icon: Folder01Icon, label: "Projects", group: "workspace" },
  { icon: TransactionIcon, label: "Transactions", group: "workspace" },
  { icon: Wallet02Icon, label: "Cash Accounts", group: "workspace" },
  { icon: MoneyReceive01Icon, label: "Receivables", group: "workspace" },
  { icon: MoneySend01Icon, label: "Payables", group: "workspace" },
  { icon: Chart01Icon, label: "Reports", group: "workspace" },
  { icon: Book01Icon, label: "Masters", group: "workspace" },
  { icon: Upload01Icon, label: "Migration", group: "workspace" },
  { icon: Settings01Icon, label: "Settings", group: "system" },
] as const;

const nestedNav: Partial<Record<View, string[]>> = {
  Reports: ["Cashflow", "P&L", "Balance Sheet", "General Ledger", "AR", "AP"],
  Masters: ["Chart of Accounts", "Contacts", "Transaction Categories"],
};

export function CKJSApp() {
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState<View>("Dashboard");
  const [subPage, setSubPage] = useState("P&L");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>(cashSeed);
  const [receivableRecords, setReceivableRecords] = useState<LedgerRecord[]>(receivables);
  const [payableRecords, setPayableRecords] = useState<LedgerRecord[]>(payables);
  const [newTxOpen, setNewTxOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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

  const go = (next: View, child?: string) => {
    setView(next);
    if (child) setSubPage(child);
    setSidebarOpen(false);
    setSelectedProject(null);
  };

  const toggleSidebar = () => {
    if (window.matchMedia("(max-width: 760px)").matches) {
      setSidebarCollapsed(false);
      setSidebarOpen((open) => !open);
    } else {
      setSidebarCollapsed((collapsed) => !collapsed);
    }
  };

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

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

  const recordLedgerPayment = (type: "AR" | "AP", target: LedgerRecord, payment: PaymentInput) => {
    const setter = type === "AR" ? setReceivableRecords : setPayableRecords;
    setter((items) => items.map((item) => {
      if (item.ref !== target.ref) return item;
      const nextPaid = Math.min(item.total, item.paid + payment.amount);
      return { ...item, paid: nextPaid, status: nextPaid >= item.total ? "PAID" : "PARTIAL" };
    }));
    setCashAccounts((items) => items.map((account) => account.name === payment.account ? { ...account, balance: account.balance + (type === "AR" ? payment.amount : -payment.amount) } : account));
    const [paymentYear, paymentMonth, paymentDay] = payment.date.split("-");
    const transaction: Transaction = {
      id: `TX-202608-${String(transactions.length + 39).padStart(4, "0")}`,
      date: `${paymentDay} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][Number(paymentMonth) - 1]} ${paymentYear}`,
      description: `${type === "AR" ? "Penerimaan" : "Pembayaran"} ${target.ref}`,
      project: target.project,
      category: type === "AR" ? "Pelunasan Piutang" : "Pelunasan Hutang",
      account: payment.account,
      contact: target.party,
      amount: payment.amount,
      type: type === "AR" ? "Income" : "Expense",
      status: "POSTED",
    };
    setTransactions((items) => [transaction, ...items]);
    notify(`${type === "AR" ? "Penerimaan" : "Pembayaran"} ${target.ref} berhasil dicatat dan jurnal otomatis sudah diposting.`);
  };

  if (!authenticated) return <LoginView onLogin={() => { setAuthenticated(true); setView("Dashboard"); }} />;

  return <main className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? "is-open" : ""} ${sidebarCollapsed ? "is-collapsed" : ""}`}>
      <div className="brand"><div className="brand-copy"><div className="brand-word">CKJS Finance</div><span>Financial Management</span></div>{!sidebarCollapsed && <button className={`sidebar-toggle ${sidebarOpen ? "is-mobile-open" : ""}`} onClick={toggleSidebar} aria-label="Tutup sidebar" title="Tutup sidebar" type="button"><HugeiconsIcon className="sidebar-close-icon" icon={ArrowLeft01Icon} size={20} strokeWidth={2} /><HugeiconsIcon className="sidebar-open-icon" icon={ArrowRight01Icon} size={20} strokeWidth={2} /></button>}</div>
      <nav className="sidebar-nav" aria-label="Navigasi utama">
        {navItems.filter((item) => item.group === "workspace").map((item) => <div className={`nav-group ${nestedNav[item.label] ? "has-children" : ""}`} key={item.label}><button className={`nav-item ${view === item.label ? "active" : ""}`} onClick={() => go(item.label, nestedNav[item.label]?.[0])} type="button"><HugeiconsIcon className="nav-symbol" icon={item.icon} size={18} strokeWidth={1.7} />{item.label}{nestedNav[item.label] && <HugeiconsIcon className={`nav-chevron ${view === item.label ? "open" : ""}`} icon={ArrowDown01Icon} size={14} strokeWidth={1.8} />}</button>{nestedNav[item.label] && view === item.label && <div className="nav-children">{nestedNav[item.label]!.map((child) => <button className={subPage === child ? "active" : ""} onClick={() => go(item.label, child)} key={child} type="button"><i />{child}</button>)}</div>}</div>)}
      </nav>
      <section className="sidebar-projects" aria-label="Proyek aktif">
        <div className="sidebar-section-head"><strong>Projects</strong><button onClick={() => go("Projects")} aria-label="Tambah atau lihat proyek" type="button"><HugeiconsIcon icon={PlusSignIcon} size={17} strokeWidth={2} /></button></div>
        {projectRows.slice(0, 3).map((project) => <button className={`project-shortcut ${selectedProject?.name === project.name ? "active" : ""}`} onClick={() => { setView("Projects"); setSelectedProject(project); setSidebarOpen(false); }} key={project.name} type="button"><i style={{ background: project.color }} />{project.name}</button>)}
      </section>
      <div className="sidebar-footer">
        {navItems.filter((item) => item.group === "system").map((item) => <button className={`nav-item ${view === item.label ? "active" : ""}`} onClick={() => go(item.label)} key={item.label} type="button"><HugeiconsIcon className="nav-symbol" icon={item.icon} size={18} strokeWidth={1.7} />{item.label}</button>)}
        <button className="nav-item help-item" onClick={() => notify("Pusat bantuan CKJS siap membantu Anda.")} type="button"><HugeiconsIcon className="nav-symbol" icon={HelpCircleIcon} size={18} strokeWidth={1.7} />Help &amp; Support<span className="help-badge">2</span></button>
        <button className="nav-item logout-item" onClick={() => setAuthenticated(false)} type="button"><HugeiconsIcon className="nav-symbol" icon={Logout03Icon} size={18} strokeWidth={1.7} />Sign out</button>
      </div>
    </aside>

    <section className={`content-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <header className="topbar">
        {sidebarCollapsed && <button className="sidebar-toggle topbar-sidebar-toggle is-collapsed" onClick={toggleSidebar} aria-label="Buka sidebar" title="Buka sidebar" type="button"><HugeiconsIcon className="sidebar-close-icon" icon={ArrowLeft01Icon} size={20} strokeWidth={2} /><HugeiconsIcon className="sidebar-open-icon" icon={ArrowRight01Icon} size={20} strokeWidth={2} /></button>}
        <label className="global-command"><HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={1.7} /><input ref={commandSearchRef} placeholder="Search or type a command" aria-label="Search or type a command" /><kbd>⌘ F</kbd></label>
        <div className="topbar-actions"><button className="icon-button notification" aria-label="Notifikasi" type="button"><HugeiconsIcon icon={Notification03Icon} size={17} strokeWidth={1.7} /><i /></button><div className="top-avatar">JI</div></div>
      </header>

      <div className="page">
        {view === "Dashboard" && <DashboardView go={go} newTransaction={() => setNewTxOpen(true)} transfer={() => setTransferOpen(true)} cashAccounts={cashAccounts} />}
        {view === "Projects" && (selectedProject ? <ProjectDetail project={selectedProject} transactions={transactions} back={() => setSelectedProject(null)} /> : <ProjectsView openProject={setSelectedProject} />)}
        {view === "Transactions" && <TransactionsView transactions={transactions} newTransaction={() => setNewTxOpen(true)} selectTransaction={setSelectedTx} />}
        {view === "Cash Accounts" && <CashAccountsView accounts={cashAccounts} transactions={transactions} transfer={() => setTransferOpen(true)} />}
        {view === "Receivables" && <LedgerView type="AR" rows={receivableRecords} accounts={cashAccounts} recordPayment={recordLedgerPayment} />}
        {view === "Payables" && <LedgerView type="AP" rows={payableRecords} accounts={cashAccounts} recordPayment={recordLedgerPayment} />}
        {view === "Reports" && <ReportsView notify={notify} report={subPage} />}
        {view === "Masters" && <MastersView notify={notify} tab={subPage} setTab={setSubPage} />}
        {view === "Migration" && <MigrationView notify={notify} />}
        {view === "Settings" && <SettingsView notify={notify} />}
      </div>
    </section>

    {sidebarOpen && <button className="overlay" onClick={() => setSidebarOpen(false)} aria-label="Tutup navigasi" type="button" />}
    {newTxOpen && <NewTransactionModal close={() => setNewTxOpen(false)} submit={createTransaction} />}
    {transferOpen && <TransferModal accounts={cashAccounts} close={() => setTransferOpen(false)} submit={transferFunds} />}
    {selectedTx && <TransactionDetail transaction={selectedTx} close={() => setSelectedTx(null)} reverse={reverseTransaction} />}
    {toast && <div className="toast"><i>✓</i>{toast}</div>}
  </main>;
}
