"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDataTransferHorizontalIcon from "@hugeicons/core-free-icons/ArrowDataTransferHorizontalIcon";
import ArrowDownRight01Icon from "@hugeicons/core-free-icons/ArrowDownRight01Icon";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";
import Book01Icon from "@hugeicons/core-free-icons/Book01Icon";
import Building03Icon from "@hugeicons/core-free-icons/Building03Icon";
import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import RotateClockwiseIcon from "@hugeicons/core-free-icons/RotateClockwiseIcon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import Tag01Icon from "@hugeicons/core-free-icons/Tag01Icon";
import UserIcon from "@hugeicons/core-free-icons/UserIcon";
import Wallet02Icon from "@hugeicons/core-free-icons/Wallet02Icon";
import { LocationLiveClock } from "../components/LocationLiveClock";
import {
  BulkSelectionBar,
  RowActionMenu,
  TableCheckbox,
  TableToolbar,
} from "../components/TableSuite";
import { CustomDropdown, DEFAULT_PERIOD_OPTIONS, FilterBar, StatusBadge } from "../components/ui";
import { formatIDR } from "../data";
import type { CashAccount, Transaction } from "../types";

export function CashAccountDetail({
  account,
  transactions,
  transfer,
  back,
}: {
  account: CashAccount;
  transactions: Transaction[];
  transfer: () => void;
  back: () => void;
}) {
  const [tab, setTab] = useState<"Overview" | "Transactions" | "Ledger" | "Reconciliation">("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [periodFilter, setPeriodFilter] = useState("Agustus 2026");
  const [reconDone, setReconDone] = useState(false);
  const [txSortKey, setTxSortKey] = useState("date");
  const [txSortDir, setTxSortDir] = useState<"asc" | "desc">("desc");
  const [txDensity, setTxDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [selectedTxIds, setSelectedTxIds] = useState<string[]>([]);
  const [txVisibleColumns, setTxVisibleColumns] = useState<string[]>([
    "date",
    "description",
    "project",
    "category",
    "amount",
    "status",
  ]);

  // Filter transactions belonging or related to this account
  const related = transactions.filter(
    (t) =>
      t.account === account.name ||
      t.account.toLowerCase().includes(account.name.split(" ")[0].toLowerCase())
  );
  const visibleTransactions = related.length ? related : transactions.slice(0, 4);

  const filteredTransactions = visibleTransactions
    .filter((tx) => {
      const matchesSearch =
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.contact.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        typeFilter === "All" ||
        (typeFilter === "Income" && tx.type === "Income") ||
        (typeFilter === "Expense" && tx.type === "Expense") ||
        (typeFilter === "Transfer" && tx.type === "Transfer");
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comp = 0;
      if (txSortKey === "amount") comp = a.amount - b.amount;
      else if (txSortKey === "description") comp = a.description.localeCompare(b.description);
      else comp = a.date.localeCompare(b.date);
      return txSortDir === "asc" ? comp : -comp;
    });

  const opening = account.balance - 55000000;
  const ledgerRows = [
    {
      date: "01 Agu 2026",
      ref: "OPEN-202608",
      description: "Saldo Awal Buku Besar (Opening Balance)",
      counterparty: "Saldo Periode Sebelumnya",
      debit: 0,
      credit: 0,
      balance: opening,
      status: "POSTED",
    },
    {
      date: "05 Agu 2026",
      ref: "TX-202608-0018",
      description: "Penerimaan termin II pekerjaan proyek",
      counterparty: "PT Aruna Hospitality",
      debit: 120000000,
      credit: 0,
      balance: opening + 120000000,
      status: "POSTED",
    },
    {
      date: "12 Agu 2026",
      ref: "TX-202608-0033",
      description: "Pembayaran pengadaan material struktur baja",
      counterparty: "UD Sinar Baja",
      debit: 0,
      credit: 24500000,
      balance: opening + 95500000,
      status: "POSTED",
    },
    {
      date: "18 Agu 2026",
      ref: "TX-202608-0038",
      description: "Transfer drop dana kas operasional lapangan",
      counterparty: "Kas Kantor Sentosa",
      debit: 0,
      credit: 40500000,
      balance: account.balance,
      status: "POSTED",
    },
  ];

  // Bank institution code tag helper
  const getBankBadge = () => {
    if (account.name.includes("BCA")) return { code: "BCA", name: "PT Bank Central Asia Tbk", gl: "1-1010" };
    if (account.name.includes("Mandiri")) return { code: "MND", name: "PT Bank Mandiri (Persero) Tbk", gl: "1-1020" };
    if (account.type === "GIRO") return { code: "GIRO", name: "Rekening Giro Operasional", gl: "1-1015" };
    return { code: "KAS", name: "Kas Operasional Lapangan", gl: "1-1030" };
  };

  const bankMeta = getBankBadge();

  return (
    <div className="treasury-account-view">
      {/* Navigation Breadcrumb Bar */}
      <nav className="treasury-breadcrumbs" aria-label="Breadcrumb">
        <button className="treasury-back-btn" onClick={back} type="button">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={15} strokeWidth={2} />
          <span>Kembali ke Rekening Kas</span>
        </button>
        <span className="crumb-separator">/</span>
        <span className="crumb-parent">Manajemen Kas & Bank</span>
        <span className="crumb-separator">/</span>
        <span className="crumb-current">{account.name}</span>
      </nav>

      {/* Enterprise Account Header Card */}
      <header className="treasury-header-card">
        <div className="treasury-header-main">
          <div className="treasury-bank-emblem">
            <span className="emblem-code">{bankMeta.code}</span>
          </div>
          <div className="treasury-header-meta">
            <div className="treasury-meta-top">
              <span className="account-type-pill">{account.type}</span>
              <span className="gl-mapping-tag">COA GL: {bankMeta.gl}</span>
            </div>
            <h1 className="treasury-account-name">{account.name}</h1>
            <div className="treasury-meta-details">
              <span className="detail-item">
                <HugeiconsIcon icon={Building03Icon} size={14} strokeWidth={1.8} />
                <span>{bankMeta.name}</span>
              </span>
              <span className="detail-bullet">•</span>
              <span className="detail-item">
                <strong>No. Rek:</strong>
                <span className="mono-num">{account.no}</span>
              </span>
              <span className="detail-bullet">•</span>
              <span className="detail-item">
                <strong>Entitas:</strong>
                <span>{account.project}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="treasury-header-actions">
          <LocationLiveClock />
          <CustomDropdown
            ariaLabel="Pilih Periode"
            icon={Calendar03Icon}
            onChange={setPeriodFilter}
            options={DEFAULT_PERIOD_OPTIONS}
            value={periodFilter}
          />
          <button
            className="treasury-action-btn secondary"
            type="button"
            onClick={() => setTab("Reconciliation")}
            title="Verifikasi saldo dengan rekening koran"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={1.8} />
            <span>Rekonsiliasi Bank</span>
          </button>
          <button
            className="treasury-action-btn secondary"
            type="button"
            onClick={() => alert(`Mengekspor laporan mutasi rekening ${account.name}...`)}
            title="Download rekening koran dalam format PDF / Excel"
          >
            <HugeiconsIcon icon={Download01Icon} size={16} strokeWidth={1.8} />
            <span>Export Statement</span>
          </button>
          <button
            className="treasury-action-btn primary"
            onClick={transfer}
            type="button"
          >
            <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={16} strokeWidth={2} />
            <span>Transfer Dana</span>
          </button>
        </div>
      </header>

      {/* 4-Column Professional KPI Metric Deck (Tech-Utility Standard) */}
      <section className="treasury-kpi-deck">
        <article className="treasury-kpi-card">
          <div className="kpi-eyebrow">
            <span>SALDO BUKU KAS (POSTED)</span>
            <span className="kpi-tag-status">AKTIF</span>
          </div>
          <div className="kpi-metric-tabular">
            {formatIDR(account.balance)}
          </div>
          <div className="kpi-footnote">
            <span>Posisi per 20 Agu 2026 · Sinkron GL {bankMeta.gl}</span>
          </div>
        </article>

        <article className="treasury-kpi-card">
          <div className="kpi-eyebrow">
            <span>TOTAL PENERIMAAN (DEBIT)</span>
            <span className="kpi-delta-pill positive">
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} strokeWidth={2.2} />
              +14.5%
            </span>
          </div>
          <div className="kpi-metric-tabular text-positive">
            +{formatIDR(120000000)}
          </div>
          <div className="kpi-footnote">
            <span>1 Transaksi masuk periode berjalan</span>
          </div>
        </article>

        <article className="treasury-kpi-card">
          <div className="kpi-eyebrow">
            <span>TOTAL PENGELUARAN (KREDIT)</span>
            <span className="kpi-delta-pill neutral">
              <HugeiconsIcon icon={ArrowDownRight01Icon} size={12} strokeWidth={2.2} />
              −8.2%
            </span>
          </div>
          <div className="kpi-metric-tabular text-negative">
            −{formatIDR(65000000)}
          </div>
          <div className="kpi-footnote">
            <span>2 Transaksi keluar terverifikasi</span>
          </div>
        </article>

        <article className="treasury-kpi-card">
          <div className="kpi-eyebrow">
            <span>PERUBAHAN BERSIH (NET CASH)</span>
            <span className="kpi-delta-pill positive">Surplus</span>
          </div>
          <div className="kpi-metric-tabular text-positive">
            +{formatIDR(55000000)}
          </div>
          <div className="kpi-footnote">
            <span>Rasio Kas Masuk/Keluar: <strong>1.85x</strong></span>
          </div>
        </article>
      </section>

      {/* Structured Workbench Tabs */}
      <div className="treasury-tab-nav">
        <button
          className={`treasury-tab-item ${tab === "Overview" ? "active" : ""}`}
          onClick={() => setTab("Overview")}
          type="button"
        >
          <span>Ringkasan Rekening</span>
        </button>
        <button
          className={`treasury-tab-item ${tab === "Transactions" ? "active" : ""}`}
          onClick={() => setTab("Transactions")}
          type="button"
        >
          <span>Daftar Transaksi</span>
          <span className="tab-count-badge">{visibleTransactions.length}</span>
        </button>
        <button
          className={`treasury-tab-item ${tab === "Ledger" ? "active" : ""}`}
          onClick={() => setTab("Ledger")}
          type="button"
        >
          <span>Buku Pembantu Rekening</span>
          <span className="tab-count-badge">{ledgerRows.length}</span>
        </button>
        <button
          className={`treasury-tab-item ${tab === "Reconciliation" ? "active" : ""}`}
          onClick={() => setTab("Reconciliation")}
          type="button"
        >
          <span>Rekonsiliasi Bank</span>
          <span className="tab-pill-state">100% Cocok</span>
        </button>
      </div>

      {/* Tab 1: Ringkasan Rekening (Overview) */}
      {tab === "Overview" && (
        <div className="treasury-overview-grid">
          {/* Left Card: Account Specification & Metadata */}
          <article className="treasury-card">
            <div className="treasury-card-header">
              <div>
                <h2 className="treasury-card-title">Spesifikasi & Identitas Rekening</h2>
                <p className="treasury-card-desc">Parameter akuntansi, limit perbankan, dan otorisasi</p>
              </div>
              <StatusBadge status="ACTIVE" />
            </div>

            <div className="treasury-table-kv">
              <div className="kv-row">
                <span className="kv-key">Nama Akun Bank</span>
                <span className="kv-val font-semibold">{account.name}</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Nomor Rekening / IBAN</span>
                <span className="kv-val mono-num font-semibold">{account.no}</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Lembaga Perbankan</span>
                <span className="kv-val">{bankMeta.name}</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Kantor Cabang (KCP)</span>
                <span className="kv-val">KCP Sudirman Jakarta (Cabang 0067)</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Kode Akun Buku Besar (COA)</span>
                <span className="kv-val">
                  <code className="coa-code">{bankMeta.gl}</code>
                  <span className="coa-desc">Kas & Setara Kas</span>
                </span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Alokasi Entitas / Cost Center</span>
                <span className="kv-val">{account.project} (Operasional Holding)</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Mata Uang Fungsional</span>
                <span className="kv-val">IDR — Rupiah Indonesia</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Batas Transaksi Harian</span>
                <span className="kv-val mono-num">Rp 500.000.000 / hari</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Pejabat Otorisasi</span>
                <span className="kv-val">Direktur Utama & Finance Lead</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Terakhir Direkonsiliasi</span>
                <span className="kv-val text-muted">20 Agu 2026, 17:00 WIB</span>
              </div>
            </div>
          </article>

          {/* Right Card: Recent Financial Transactions */}
          <article className="treasury-card">
            <div className="treasury-card-header">
              <div>
                <h2 className="treasury-card-title">Aktivitas Transaksi Terakhir</h2>
                <p className="treasury-card-desc">Mutasi arus kas masuk dan keluar terposting</p>
              </div>
              <button
                className="treasury-link-action"
                onClick={() => setTab("Transactions")}
                type="button"
              >
                Lihat Seluruh Mutasi →
              </button>
            </div>

            <div className="treasury-activity-list">
              {visibleTransactions.map((tx) => {
                const isIncome = tx.type === "Income";
                const isTransfer = tx.type === "Transfer";
                return (
                  <div key={tx.id} className="treasury-activity-row">
                    <div className={`activity-icon-badge ${isIncome ? "income" : isTransfer ? "transfer" : "expense"}`}>
                      {isIncome ? (
                        <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={2.2} />
                      ) : isTransfer ? (
                        <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={16} strokeWidth={2} />
                      ) : (
                        <HugeiconsIcon icon={ArrowDownRight01Icon} size={16} strokeWidth={2.2} />
                      )}
                    </div>

                    <div className="activity-info">
                      <div className="activity-title-line">
                        <span className="activity-desc">{tx.description}</span>
                      </div>
                      <div className="activity-sub-line">
                        <span className="activity-date">{tx.date}</span>
                        <span className="sub-bullet">•</span>
                        <code className="activity-ref-code">{tx.id}</code>
                        {tx.contact && (
                          <>
                            <span className="sub-bullet">•</span>
                            <span className="activity-party">{tx.contact}</span>
                          </>
                        )}
                        <span className="sub-bullet">•</span>
                        <span className="activity-cat-tag">{tx.category}</span>
                      </div>
                    </div>

                    <div className="activity-amount-col">
                      <span className={`activity-amount mono-num ${isIncome ? "text-positive" : isTransfer ? "text-blue" : "text-negative"}`}>
                        {isIncome ? "+" : isTransfer ? "" : "−"}{formatIDR(tx.amount)}
                      </span>
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="treasury-card-footer">
              <div className="ledger-balance-audit-note">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={2} />
                <span>Seluruh transaksi telah terposting ke Buku Besar tanpa selisih.</span>
              </div>
            </div>
          </article>
        </div>
      )}

      {/* Tab 2: Transactions Table View */}
      {tab === "Transactions" && (
        <article className="treasury-card full-workbench">
          <TableToolbar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Cari transaksi berdasarkan deskripsi, kode ref, kontak..."
            sortOptions={[
              { label: "Tanggal Transaksi", value: "date" },
              { label: "Nominal (Amount)", value: "amount" },
              { label: "Deskripsi", value: "description" },
            ]}
            currentSort={txSortKey}
            sortDirection={txSortDir}
            onSortChange={setTxSortKey}
            onSortDirectionChange={setTxSortDir}
            filterGroups={[
              {
                id: "type",
                label: "Tipe Transaksi",
                options: [
                  { label: "Semua Tipe", value: "All" },
                  { label: "Penerimaan (Income)", value: "Income" },
                  { label: "Pengeluaran (Expense)", value: "Expense" },
                  { label: "Transfer Kas", value: "Transfer" },
                ],
              },
            ]}
            activeFilters={{ type: typeFilter }}
            onFilterChange={(_, val) => setTypeFilter(val)}
            onResetFilters={() => {
              setTypeFilter("All");
              setSearchQuery("");
            }}
            displayDensity={txDensity}
            onDensityChange={setTxDensity}
            columns={[
              { id: "date", label: "Tanggal & No. Ref" },
              { id: "description", label: "Deskripsi & Pihak Terkait" },
              { id: "project", label: "Alokasi Proyek" },
              { id: "category", label: "Kategori COA" },
              { id: "amount", label: "Jumlah (IDR)" },
              { id: "status", label: "Status" },
            ]}
            visibleColumns={txVisibleColumns}
            onToggleColumn={(colId) =>
              setTxVisibleColumns((curr) =>
                curr.includes(colId) ? curr.filter((id) => id !== colId) : [...curr, colId],
              )
            }
            onAddNew={() => alert("Tambah transaksi baru untuk rekening ini...")}
            addNewLabel="New Transaction"
          />

          <BulkSelectionBar
            selectedCount={selectedTxIds.length}
            onClear={() => setSelectedTxIds([])}
            onExport={() => alert(`Mengekspor ${selectedTxIds.length} transaksi...`)}
            onDelete={() => {
              alert(`Menghapus ${selectedTxIds.length} transaksi.`);
              setSelectedTxIds([]);
            }}
          />

          <div className="treasury-table-container">
            <table className={`treasury-data-table density-${txDensity}`}>
              <thead>
                <tr>
                  <th style={{ width: "42px", textAlign: "center" }}>
                    <TableCheckbox
                      checked={
                        filteredTransactions.length > 0 &&
                        selectedTxIds.length === filteredTransactions.length
                      }
                      indeterminate={
                        selectedTxIds.length > 0 &&
                        selectedTxIds.length < filteredTransactions.length
                      }
                      onChange={(chk) => {
                        if (chk) setSelectedTxIds(filteredTransactions.map((t) => t.id));
                        else setSelectedTxIds([]);
                      }}
                      ariaLabel="Select all transactions"
                    />
                  </th>
                  {txVisibleColumns.includes("date") && <th style={{ width: "18%" }}>Tanggal & No. Ref</th>}
                  {txVisibleColumns.includes("description") && (
                    <th style={{ width: "30%" }}>Deskripsi & Pihak Terkait</th>
                  )}
                  {txVisibleColumns.includes("project") && <th style={{ width: "16%" }}>Alokasi Proyek</th>}
                  {txVisibleColumns.includes("category") && <th style={{ width: "14%" }}>Kategori COA</th>}
                  {txVisibleColumns.includes("amount") && (
                    <th style={{ width: "14%", textAlign: "right" }}>Jumlah (IDR)</th>
                  )}
                  {txVisibleColumns.includes("status") && (
                    <th style={{ width: "10%", textAlign: "center" }}>Status</th>
                  )}
                  <th style={{ width: "46px", textAlign: "center" }}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={txVisibleColumns.length + 2}
                      className="table-empty-row"
                      style={{ textAlign: "center", padding: "36px" }}
                    >
                      Tidak ada transaksi yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isIncome = tx.type === "Income";
                    const isSelected = selectedTxIds.includes(tx.id);
                    return (
                      <tr
                        key={tx.id}
                        className={`treasury-table-row clickable-row ${isSelected ? "selected-row" : ""}`}
                      >
                        <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                          <TableCheckbox
                            checked={isSelected}
                            onChange={(chk) => {
                              if (chk) setSelectedTxIds((curr) => [...curr, tx.id]);
                              else setSelectedTxIds((curr) => curr.filter((i) => i !== tx.id));
                            }}
                            ariaLabel={`Select ${tx.id}`}
                          />
                        </td>
                        {txVisibleColumns.includes("date") && (
                          <td>
                            <div className="cell-date font-semibold">{tx.date}</div>
                            <code className="cell-ref-id">{tx.id}</code>
                          </td>
                        )}
                        {txVisibleColumns.includes("description") && (
                          <td>
                            <div className="cell-desc font-semibold">{tx.description}</div>
                            <div className="cell-contact text-muted">{tx.contact || "—"}</div>
                          </td>
                        )}
                        {txVisibleColumns.includes("project") && (
                          <td>
                            <span className="project-allocation-tag">{tx.project}</span>
                          </td>
                        )}
                        {txVisibleColumns.includes("category") && (
                          <td>
                            <span className="category-tag">{tx.category}</span>
                          </td>
                        )}
                        {txVisibleColumns.includes("amount") && (
                          <td style={{ textAlign: "right" }}>
                            <span
                              className={`mono-num font-semibold ${isIncome ? "text-positive" : "text-negative"}`}
                            >
                              {isIncome ? "+" : "−"}
                              {formatIDR(tx.amount)}
                            </span>
                          </td>
                        )}
                        {txVisibleColumns.includes("status") && (
                          <td style={{ textAlign: "center" }}>
                            <StatusBadge status={tx.status} />
                          </td>
                        )}
                        <td style={{ textAlign: "center" }}>
                          <RowActionMenu
                            onView={() => alert(`Lihat rincian transaksi ${tx.id}`)}
                            onEdit={() => alert(`Edit transaksi ${tx.id}`)}
                            onDelete={() => alert(`Hapus transaksi ${tx.id}`)}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="treasury-table-footer">
            <div className="footer-count">
              Menampilkan <strong>{filteredTransactions.length}</strong> dari{" "}
              <strong>{visibleTransactions.length}</strong> transaksi rekening
            </div>
            <div className="footer-actions">
              <button className="treasury-action-btn secondary sm" type="button">
                <HugeiconsIcon icon={Download01Icon} size={14} strokeWidth={1.8} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </article>
      )}

      {/* Tab 3: Buku Pembantu Kas (Ledger & Running Balance) */}
      {tab === "Ledger" && (
        <article className="treasury-card full-workbench">
          <div className="treasury-card-header toolbar-border">
            <div>
              <h2 className="treasury-card-title">Buku Pembantu Rekening Kas & Bank</h2>
              <p className="treasury-card-desc">Rekapitulasi mutasi debit/kredit dan kalkulasi saldo berjalan berdasarkan jurnal terposting</p>
            </div>
            <div className="treasury-header-actions">
              <select className="treasury-select">
                <option>Agustus 2026</option>
                <option>Juli 2026</option>
              </select>
              <button
                className="treasury-action-btn secondary"
                type="button"
                onClick={() => alert("Mengunduh Buku Pembantu Rekening...")}
              >
                <HugeiconsIcon icon={Download01Icon} size={16} strokeWidth={1.8} />
                <span>Export Buku Pembantu</span>
              </button>
            </div>
          </div>

          <div className="treasury-table-container">
            <table className="treasury-data-table ledger-mode">
              <thead>
                <tr>
                  <th style={{ width: "16%" }}>Tanggal & No. Bukti</th>
                  <th style={{ width: "32%" }}>Keterangan Transaksi & Pihak Terkait</th>
                  <th style={{ width: "16%", textAlign: "right" }}>Debit (Penerimaan)</th>
                  <th style={{ width: "16%", textAlign: "right" }}>Kredit (Pengeluaran)</th>
                  <th style={{ width: "20%", textAlign: "right" }}>Saldo Berjalan (IDR)</th>
                </tr>
              </thead>
              <tbody>
                {ledgerRows.map((row) => (
                  <tr key={row.ref} className="treasury-table-row">
                    <td>
                      <div className="cell-date font-semibold">{row.date}</div>
                      <code className="cell-ref-id">{row.ref}</code>
                    </td>
                    <td>
                      <div className="cell-desc font-semibold">{row.description}</div>
                      <div className="cell-contact text-muted">{row.counterparty}</div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="mono-num text-positive font-semibold">
                        {row.debit ? formatIDR(row.debit) : "—"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="mono-num text-negative font-semibold">
                        {row.credit ? formatIDR(row.credit) : "—"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="mono-num font-bold text-ink">
                        {formatIDR(row.balance)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="ledger-summary-row">
                  <td colSpan={2} className="summary-label font-bold">
                    Total Mutasi & Saldo Akhir Periode
                  </td>
                  <td style={{ textAlign: "right" }} className="mono-num font-bold text-positive">
                    +{formatIDR(120000000)}
                  </td>
                  <td style={{ textAlign: "right" }} className="mono-num font-bold text-negative">
                    −{formatIDR(65000000)}
                  </td>
                  <td style={{ textAlign: "right" }} className="mono-num font-extrabold text-brand-dark">
                    {formatIDR(account.balance)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="treasury-table-footer">
            <div className="ledger-balance-audit-note">
              <span>
                <strong>Buku Pembantu Kas Seimbang:</strong> Seluruh entri debit dan kredit dihasilkan secara otomatis dari transaksi yang telah diposting.
              </span>
            </div>
          </div>
        </article>
      )}

      {/* Tab 4: Rekonsiliasi Bank (Bank Reconciliation) */}
      {tab === "Reconciliation" && (
        <article className="treasury-card full-workbench">
          <div className="treasury-card-header toolbar-border">
            <div>
              <h2 className="treasury-card-title">Rekonsiliasi Bank Otomatis</h2>
              <p className="treasury-card-desc">Verifikasi kesesuaian antara Rekening Koran Perbankan dengan Saldo Buku Besar (General Ledger)</p>
            </div>
            <div className="treasury-header-actions">
              <button
                className="treasury-action-btn primary"
                onClick={() => setReconDone(true)}
                type="button"
              >
                <HugeiconsIcon icon={RotateClockwiseIcon} size={16} strokeWidth={2} />
                <span>{reconDone ? "Terekonsiliasi Ulang" : "Jalankan Rekonsiliasi"}</span>
              </button>
            </div>
          </div>

          <div className="reconciliation-summary-grid">
            <div className="recon-metric-box">
              <span className="recon-box-label">Saldo Rekening Koran (Bank)</span>
              <strong className="recon-box-val mono-num">{formatIDR(account.balance)}</strong>
              <small className="recon-box-sub">Statement per 20 Agu 2026, 17:00 WIB</small>
            </div>
            <div className="recon-metric-box">
              <span className="recon-box-label">Saldo Buku Besar (General Ledger)</span>
              <strong className="recon-box-val mono-num">{formatIDR(account.balance)}</strong>
              <small className="recon-box-sub">COA GL {bankMeta.gl} (Posted)</small>
            </div>
            <div className="recon-metric-box highlight-matched">
              <span className="recon-box-label">Selisih Rekonsiliasi (Variance)</span>
              <strong className="recon-box-val mono-num text-positive">Rp 0</strong>
              <small className="recon-box-sub text-positive">100% Cocok (Zero Discrepancy)</small>
            </div>
          </div>

          <div className="reconciliation-checklist">
            <h3 className="checklist-heading">Item Pemeriksaan Rekonsiliasi</h3>
            <div className="checklist-items">
              <div className="check-item-row">
                <div className="check-icon-matched">✓</div>
                <div className="check-text">
                  <strong>Setoran Dalam Perjalanan (Deposit in Transit)</strong>
                  <span>Tidak ada setoran tertunda yang belum tercatat pada rekening koran.</span>
                </div>
                <span className="check-value mono-num">Rp 0</span>
              </div>
              <div className="check-item-row">
                <div className="check-icon-matched">✓</div>
                <div className="check-text">
                  <strong>Cek / Bilyet Giro Beredar (Outstanding Checks)</strong>
                  <span>Semua transaksi pengeluaran telah berhasil ditarik dan dibukukan.</span>
                </div>
                <span className="check-value mono-num">Rp 0</span>
              </div>
              <div className="check-item-row">
                <div className="check-icon-matched">✓</div>
                <div className="check-text">
                  <strong>Biaya Administrasi & Pajak Bunga Bank</strong>
                  <span>Telah dicatat dan dialokasikan ke pos beban administrasi bank.</span>
                </div>
                <span className="check-value mono-num">Tercatat</span>
              </div>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
