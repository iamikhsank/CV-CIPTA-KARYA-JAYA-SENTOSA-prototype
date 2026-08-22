"use client";

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
import { EditProjectModal } from "./finance/components/EditProjectModal";
import { EditTransactionModal } from "./finance/components/EditTransactionModal";
import { NewProjectModal } from "./finance/components/NewProjectModal";
import { NewTransactionModal } from "./finance/components/NewTransactionModal";
import { TransactionDetail } from "./finance/components/TransactionDetail";
import { TransferModal } from "./finance/components/TransferModal";
import { cashSeed, initialTransactions, payables, projectRows, receivables } from "./finance/data";
import { CashAccountsView } from "./finance/pages/CashAccountsView";
import { DashboardView } from "./finance/pages/DashboardView";
import { HelpSupportView } from "./finance/pages/HelpSupportView";
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

export type AppTheme = "light" | "dark";

export function CKJSApp() {
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState<View>("Dashboard");
  const [subPage, setSubPage] = useState("P&L");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarProjectsOpen, setSidebarProjectsOpen] = useState(true);
  const [theme, setTheme] = useState<AppTheme>("light");
  const [projects, setProjects] = useState<Project[]>(projectRows);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>(cashSeed);
  const [receivableRecords, setReceivableRecords] = useState<LedgerRecord[]>(receivables);
  const [payableRecords, setPayableRecords] = useState<LedgerRecord[]>(payables);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newTxOpen, setNewTxOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [toast, setToast] = useState("");
  const commandSearchRef = useRef<HTMLInputElement>(null);
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "Termin Tagihan Jatuh Tempo",
      message: "Termin Proyek Hotel Gamelan Rp 250.000.000 jatuh tempo dalam 3 hari.",
      time: "10 mnt lalu",
      read: false,
      type: "warning",
      actionView: "Receivables" as View,
    },
    {
      id: "notif-2",
      title: "Pembayaran Material Terposting",
      message: "Pembayaran beban PT Semen Tiga Roda Rp 45.200.000 masuk jurnal umum.",
      time: "1 jam lalu",
      read: false,
      type: "success",
      actionView: "Transactions" as View,
    },
    {
      id: "notif-3",
      title: "Peringatan Saldo Kas Proyek",
      message: "Kas Proyek Warehouse Cikande mendekati batas minimum limit operasional.",
      time: "3 jam lalu",
      read: false,
      type: "alert",
      actionView: "Cash Accounts" as View,
    },
  ]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedTheme: AppTheme = window.localStorage.getItem("ckjs-theme") === "dark" ? "dark" : "light";
    setTheme(storedTheme);
    document.documentElement.dataset.theme = storedTheme;
  }, []);

  const updateTheme = (nextTheme: AppTheme) => {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("ckjs-theme", nextTheme);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const focusCommandSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && (event.key.toLowerCase() === "k" || event.key.toLowerCase() === "f")) {
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

  const updateTransaction = (updatedTx: Transaction, post: boolean) => {
    setTransactions((items) => items.map((t) => (t.id === updatedTx.id ? updatedTx : t)));
    if (selectedTx && selectedTx.id === updatedTx.id) {
      setSelectedTx(updatedTx);
    }
    setEditingTx(null);
    notify(post ? `Transaksi ${updatedTx.id} berhasil diperbarui dan diposting.` : `Draft transaksi ${updatedTx.id} berhasil diperbarui.`);
  };

  const createProject = (newProject: Project) => {
    setProjects((items) => [newProject, ...items]);
    notify(`Proyek ${newProject.name} (${newProject.code}) berhasil didaftarkan.`);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects((items) => items.map((p) => (p.code === updatedProject.code ? updatedProject : p)));
    if (selectedProject && selectedProject.code === updatedProject.code) {
      setSelectedProject(updatedProject);
    }
    setEditingProject(null);
    notify(`Data proyek ${updatedProject.name} (${updatedProject.code}) berhasil diperbarui.`);
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

  const addPayableRecord = (newRecord: LedgerRecord) => {
    setPayableRecords((prev) => [newRecord, ...prev]);
    notify(`Tagihan ${newRecord.ref} (${newRecord.party}) berhasil didaftarkan ke Buku Hutang.`);
  };

  const addReceivableRecord = (newRecord: LedgerRecord) => {
    setReceivableRecords((prev) => [newRecord, ...prev]);
    notify(`Piutang ${newRecord.ref} (${newRecord.party}) berhasil didaftarkan ke Buku Piutang.`);
  };

  const updatePayableRecord = (updatedRecord: LedgerRecord) => {
    setPayableRecords((prev) =>
      prev.map((item) => (item.ref === updatedRecord.ref ? updatedRecord : item))
    );
    notify(`Perubahan tagihan hutang ${updatedRecord.ref} berhasil disimpan.`);
  };

  const updateReceivableRecord = (updatedRecord: LedgerRecord) => {
    setReceivableRecords((prev) =>
      prev.map((item) => (item.ref === updatedRecord.ref ? updatedRecord : item))
    );
    notify(`Perubahan piutang ${updatedRecord.ref} berhasil disimpan.`);
  };

  if (!authenticated) return <LoginView onLogin={() => { setAuthenticated(true); setView("Dashboard"); }} />;

  return <main className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? "is-open" : ""} ${sidebarCollapsed ? "is-collapsed" : ""}`}>
      <div className="brand">
        <div className="brand-main">
          <div className="brand-logo-slot" title="Logo CV. Cipta Karya Jaya Sentosa">
            <div className="brand-mark" style={{ borderRadius: "50%", overflow: "hidden" }}>
              <img
                src="/logo-ckjs.jpg"
                alt="Logo CV. Cipta Karya Jaya Sentosa"
                className="brand-logo-img"
              />
            </div>
          </div>
          <div className="brand-copy">
            <div className="brand-word">Financial Management</div>
            <span>Cipta Karya Jaya Sentosa</span>
          </div>
        </div>
        {!sidebarCollapsed && (
          <button
            className={`sidebar-toggle ${sidebarOpen ? "is-mobile-open" : ""}`}
            onClick={toggleSidebar}
            aria-label="Tutup sidebar"
            title="Tutup sidebar"
            type="button"
          >
            <HugeiconsIcon className="sidebar-close-icon" icon={ArrowLeft01Icon} size={20} strokeWidth={2} />
            <HugeiconsIcon className="sidebar-open-icon" icon={ArrowRight01Icon} size={20} strokeWidth={2} />
          </button>
        )}
      </div>
      <nav className="sidebar-nav" aria-label="Navigasi utama">
        {navItems.filter((item) => item.group === "workspace").map((item) => <div className={`nav-group ${nestedNav[item.label] ? "has-children" : ""}`} key={item.label}><button className={`nav-item ${view === item.label ? "active" : ""}`} onClick={() => go(item.label, nestedNav[item.label]?.[0])} type="button"><HugeiconsIcon className="nav-symbol" icon={item.icon} size={18} strokeWidth={1.7} />{item.label}{nestedNav[item.label] && <HugeiconsIcon className={`nav-chevron ${view === item.label ? "open" : ""}`} icon={ArrowDown01Icon} size={14} strokeWidth={1.8} />}</button>{nestedNav[item.label] && view === item.label && <div className="nav-children">{nestedNav[item.label]!.map((child) => <button className={subPage === child ? "active" : ""} onClick={() => go(item.label, child)} key={child} type="button"><i />{child}</button>)}</div>}</div>)}
      </nav>
      <section className={`sidebar-projects ${sidebarProjectsOpen ? "" : "is-collapsed"}`} aria-label="Proyek aktif">
        <div className="sidebar-section-head">
          <strong>Projects</strong>
          <div className="sidebar-section-actions">
            <button
              className={`sidebar-section-toggle ${sidebarProjectsOpen ? "is-open" : ""}`}
              onClick={() => setSidebarProjectsOpen((open) => !open)}
              aria-label={sidebarProjectsOpen ? "Sembunyikan daftar proyek" : "Tampilkan daftar proyek"}
              aria-expanded={sidebarProjectsOpen}
              title={sidebarProjectsOpen ? "Sembunyikan proyek" : "Tampilkan proyek"}
              type="button"
            >
              <HugeiconsIcon icon={ArrowDown01Icon} size={15} strokeWidth={2} />
            </button>
            <button onClick={() => setNewProjectOpen(true)} aria-label="Tambah proyek baru" title="Daftarkan proyek baru" type="button">
              <HugeiconsIcon icon={PlusSignIcon} size={17} strokeWidth={2} />
            </button>
          </div>
        </div>
        {sidebarProjectsOpen && (
          <div className="sidebar-project-list">
            {projects.slice(0, 6).map((project) => (
              <button
                className={`project-shortcut ${selectedProject?.name === project.name ? "active" : ""}`}
                onClick={() => {
                  setView("Projects");
                  setSelectedProject(project);
                  setSidebarOpen(false);
                }}
                key={project.code}
                type="button"
              >
                <i style={{ background: project.color }} />
                {project.name}
              </button>
            ))}
          </div>
        )}
      </section>
      <div className="sidebar-footer">
        {navItems.filter((item) => item.group === "system").map((item) => <button className={`nav-item ${view === item.label ? "active" : ""}`} onClick={() => go(item.label)} key={item.label} type="button"><HugeiconsIcon className="nav-symbol" icon={item.icon} size={18} strokeWidth={1.7} />{item.label}</button>)}
        <button className={`nav-item help-item ${view === "Help & Support" ? "active" : ""}`} onClick={() => go("Help & Support")} type="button"><HugeiconsIcon className="nav-symbol" icon={HelpCircleIcon} size={18} strokeWidth={1.7} />Help &amp; Support<span className="help-badge">2</span></button>
        <button className="nav-item logout-item" onClick={() => setAuthenticated(false)} type="button"><HugeiconsIcon className="nav-symbol" icon={Logout03Icon} size={18} strokeWidth={1.7} />Sign out</button>
      </div>
    </aside>

    <section className={`content-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <header className="topbar">
        {sidebarCollapsed && (
          <button
            className="sidebar-toggle topbar-sidebar-toggle is-collapsed"
            onClick={toggleSidebar}
            aria-label="Buka sidebar"
            title="Buka sidebar"
            type="button"
          >
            <HugeiconsIcon className="sidebar-close-icon" icon={ArrowLeft01Icon} size={18} strokeWidth={2} />
            <HugeiconsIcon className="sidebar-open-icon" icon={ArrowRight01Icon} size={18} strokeWidth={2} />
          </button>
        )}
        <label className="global-command">
          <HugeiconsIcon icon={Search01Icon} size={17} strokeWidth={1.8} />
          <input ref={commandSearchRef} placeholder="Search or type a command" aria-label="Search or type a command" />
          <kbd>Ctrl K</kbd>
        </label>

        <div className="topbar-actions">
          {/* Notification Popover Button & Dropdown */}
          <div className="topbar-popover-anchor" ref={notifRef}>
            <button
              className={`icon-button notification ${notifDropdownOpen ? "active" : ""}`}
              onClick={() => {
                setNotifDropdownOpen((open) => !open);
                setUserDropdownOpen(false);
              }}
              aria-label="Notifikasi"
              title="Pusat Notifikasi"
              type="button"
            >
              <HugeiconsIcon icon={Notification03Icon} size={18} strokeWidth={1.8} />
              {notifications.some((n) => !n.read) && <i className="notif-ping" />}
            </button>

            {notifDropdownOpen && (
              <div className="topbar-dropdown notif-dropdown">
                <div className="dropdown-head">
                  <div className="dropdown-head-title">
                    <strong>Pemberitahuan</strong>
                    <span className="notif-count-pill">{notifications.filter((n) => !n.read).length} baru</span>
                  </div>
                  <button
                    className="dropdown-text-btn"
                    onClick={() => {
                      setNotifications((items) => items.map((n) => ({ ...n, read: true })));
                      notify("Semua notifikasi telah ditandai dibaca.");
                    }}
                    type="button"
                  >
                    Tandai dibaca
                  </button>
                </div>
                <div className="notif-list">
                  {notifications.map((item) => (
                    <button
                      key={item.id}
                      className={`notif-item ${item.read ? "read" : "unread"}`}
                      onClick={() => {
                        setNotifications((items) => items.map((n) => n.id === item.id ? { ...n, read: true } : n));
                        go(item.actionView);
                        setNotifDropdownOpen(false);
                      }}
                      type="button"
                    >
                      <div className={`notif-indicator ${item.type}`} />
                      <div className="notif-content">
                        <div className="notif-title-row">
                          <strong className="notif-title">{item.title}</strong>
                          <span className="notif-time">{item.time}</span>
                        </div>
                        <p className="notif-message">{item.message}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <button
                    className="dropdown-footer-btn"
                    onClick={() => {
                      go("Reports");
                      setNotifDropdownOpen(false);
                    }}
                    type="button"
                  >
                    Buka Laporan Aktivitas Keuangan →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Dropdown */}
          <div className="topbar-popover-anchor" ref={userMenuRef}>
            <button
              className={`top-user-pill ${userDropdownOpen ? "active" : ""}`}
              onClick={() => {
                setUserDropdownOpen((open) => !open);
                setNotifDropdownOpen(false);
              }}
              aria-label="Profil Pengguna"
              type="button"
            >
              <div className="top-avatar">
                <span>JK</span>
                <i className="avatar-status-online" />
              </div>
              <div className="top-user-meta">
                <strong className="user-name">Jason Kamal</strong>
                <span className="user-role">Finance Director</span>
              </div>
              <HugeiconsIcon className={`user-dropdown-chevron ${userDropdownOpen ? "open" : ""}`} icon={ArrowDown01Icon} size={14} strokeWidth={2} />
            </button>

            {userDropdownOpen && (
              <div className="topbar-dropdown user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-dropdown-avatar">JK</div>
                  <div className="user-dropdown-details">
                    <strong>Jason Kamal</strong>
                    <span>jason.kamal@ckjs.co.id</span>
                    <span className="role-tag">Finance Director · Admin</span>
                  </div>
                </div>
                <div className="user-dropdown-divider" />
                <div className="user-dropdown-menu">
                  <button
                    className="user-menu-item"
                    onClick={() => {
                      go("Settings");
                      setUserDropdownOpen(false);
                    }}
                    type="button"
                  >
                    <HugeiconsIcon icon={Settings01Icon} size={16} strokeWidth={1.8} />
                    Pengaturan Akun &amp; Sistem
                  </button>
                  <button
                    className="user-menu-item"
                    onClick={() => {
                      go("Help & Support");
                      setUserDropdownOpen(false);
                    }}
                    type="button"
                  >
                    <HugeiconsIcon icon={HelpCircleIcon} size={16} strokeWidth={1.8} />
                    Bantuan &amp; Dokumentasi
                  </button>
                </div>
                <div className="user-dropdown-divider" />
                <div className="user-dropdown-footer">
                  <button
                    className="user-menu-item logout"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setAuthenticated(false);
                    }}
                    type="button"
                  >
                    <HugeiconsIcon icon={Logout03Icon} size={16} strokeWidth={1.8} />
                    Keluar (Sign out)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="page">
        {view === "Dashboard" && <DashboardView go={go} newTransaction={() => setNewTxOpen(true)} transfer={() => setTransferOpen(true)} cashAccounts={cashAccounts} />}
        {view === "Projects" && (selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            transactions={transactions}
            back={() => setSelectedProject(null)}
            newTransaction={() => setNewTxOpen(true)}
            selectTransaction={setSelectedTx}
            onEditProject={(p) => setEditingProject(p)}
          />
        ) : (
          <ProjectsView
            projects={projects}
            openProject={setSelectedProject}
            onAddNewProject={() => setNewProjectOpen(true)}
            onEditProject={(p) => setEditingProject(p)}
          />
        ))}
        {view === "Transactions" && (
          <TransactionsView
            transactions={transactions}
            newTransaction={() => setNewTxOpen(true)}
            selectTransaction={setSelectedTx}
            onEditTransaction={(tx) => setEditingTx(tx)}
          />
        )}
        {view === "Cash Accounts" && (
          <CashAccountsView
            accounts={cashAccounts}
            transactions={transactions}
            transfer={() => setTransferOpen(true)}
            onEditTransaction={(tx) => setEditingTx(tx)}
            onSelectTransaction={setSelectedTx}
          />
        )}
        {view === "Receivables" && <LedgerView type="AR" rows={receivableRecords} accounts={cashAccounts} recordPayment={recordLedgerPayment} onAddRecord={addReceivableRecord} onUpdateRecord={updateReceivableRecord} />}
        {view === "Payables" && <LedgerView type="AP" rows={payableRecords} accounts={cashAccounts} recordPayment={recordLedgerPayment} onAddRecord={addPayableRecord} onUpdateRecord={updatePayableRecord} />}
        {view === "Reports" && <ReportsView notify={notify} report={subPage} setReport={setSubPage} />}
        {view === "Masters" && <MastersView notify={notify} tab={subPage} setTab={setSubPage} />}
        {view === "Migration" && <MigrationView notify={notify} />}
        {view === "Settings" && <SettingsView notify={notify} theme={theme} onThemeChange={updateTheme} />}
        {view === "Help & Support" && <HelpSupportView notify={notify} />}
      </div>
    </section>

    {sidebarOpen && <button className="overlay" onClick={() => setSidebarOpen(false)} aria-label="Tutup navigasi" type="button" />}
    {newProjectOpen && <NewProjectModal close={() => setNewProjectOpen(false)} submit={createProject} existingProjects={projects} />}
    {editingProject && <EditProjectModal project={editingProject} close={() => setEditingProject(null)} submit={updateProject} existingProjects={projects} />}
    {newTxOpen && <NewTransactionModal close={() => setNewTxOpen(false)} submit={createTransaction} projectsList={projects.map((p) => p.name)} />}
    {editingTx && <EditTransactionModal transaction={editingTx} close={() => setEditingTx(null)} submit={updateTransaction} projectsList={projects.map((p) => p.name)} />}
    {transferOpen && <TransferModal accounts={cashAccounts} close={() => setTransferOpen(false)} submit={transferFunds} />}
    {selectedTx && <TransactionDetail transaction={selectedTx} close={() => setSelectedTx(null)} reverse={reverseTransaction} onEdit={(tx) => setEditingTx(tx)} />}
    {toast && <div className="toast"><i>✓</i>{toast}</div>}
  </main>;
}
