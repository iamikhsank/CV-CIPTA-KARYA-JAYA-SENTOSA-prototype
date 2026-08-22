"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDataTransferHorizontalIcon from "@hugeicons/core-free-icons/ArrowDataTransferHorizontalIcon";
import ArrowDownRight01Icon from "@hugeicons/core-free-icons/ArrowDownRight01Icon";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import {
  BulkSelectionBar,
  RowActionMenu,
  TableCheckbox,
  TableToolbar,
} from "../components/TableSuite";
import { PageIntro, StatusBadge } from "../components/ui";
import { formatIDR } from "../data";
import type { Transaction } from "../types";

type TransactionTab = "All Transactions" | Transaction["type"];

const transactionTabs: TransactionTab[] = ["All Transactions", "Income", "Expense", "Transfer"];

function TransactionTypeIcon({ type }: { type: Transaction["type"] }) {
  const icon =
    type === "Income"
      ? ArrowUpRight01Icon
      : type === "Expense"
      ? ArrowDownRight01Icon
      : ArrowDataTransferHorizontalIcon;

  return (
    <i className={`transaction-type-icon ${type.toLowerCase()}`} aria-hidden="true">
      <HugeiconsIcon icon={icon} size={18} strokeWidth={2} />
    </i>
  );
}

function signedAmount(transaction: Transaction) {
  if (transaction.type === "Income") return `+${formatIDR(transaction.amount)}`;
  if (transaction.type === "Expense") return `−${formatIDR(transaction.amount)}`;
  return formatIDR(transaction.amount);
}

export function TransactionsView({
  transactions,
  newTransaction,
  selectTransaction,
  onEditTransaction,
}: {
  transactions: Transaction[];
  newTransaction: () => void;
  selectTransaction: (tx: Transaction) => void;
  onEditTransaction?: (transaction: Transaction) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [project, setProject] = useState("All");
  const [activeTab, setActiveTab] = useState<TransactionTab>("All Transactions");
  const [sortKey, setSortKey] = useState<string>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [density, setDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "date",
    "description",
    "project",
    "category",
    "account",
    "amount",
    "status",
  ]);

  const projects = useMemo(
    () => Array.from(new Set(transactions.map((transaction) => transaction.project))),
    [transactions],
  );

  const filterGroups = useMemo(
    () => [
      {
        id: "status",
        label: "Status Transaksi",
        options: [
          { label: "Semua Status", value: "All" },
          { label: "DRAFT", value: "DRAFT" },
          { label: "POSTED", value: "POSTED" },
          { label: "REVERSED", value: "REVERSED" },
        ],
      },
      {
        id: "project",
        label: "Alokasi Proyek",
        options: [
          { label: "Semua Proyek", value: "All" },
          ...projects.map((p) => ({ label: p, value: p })),
        ],
      },
    ],
    [projects],
  );

  const sortOptions = [
    { label: "Tanggal Transaksi", value: "date" },
    { label: "Nominal (Amount)", value: "amount" },
    { label: "Deskripsi", value: "description" },
    { label: "Kategori", value: "category" },
  ];

  const columns = [
    { id: "date", label: "Date / Reference" },
    { id: "description", label: "Description" },
    { id: "project", label: "Project" },
    { id: "category", label: "Category" },
    { id: "account", label: "Cash Account" },
    { id: "amount", label: "Amount" },
    { id: "status", label: "Status" },
  ];

  const handleFilterChange = (groupId: string, val: string) => {
    if (groupId === "status") setStatus(val);
    if (groupId === "project") setProject(val);
  };

  const handleResetFilters = () => {
    setStatus("All");
    setProject("All");
    setSearch("");
  };

  const handleToggleColumn = (colId: string) => {
    setVisibleColumns((curr) =>
      curr.includes(colId) ? curr.filter((id) => id !== colId) : [...curr, colId],
    );
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = transactions.filter((transaction) => {
      const searchable = [
        transaction.id,
        transaction.description,
        transaction.contact,
        transaction.project,
        transaction.category,
        transaction.account,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!query || searchable.includes(query)) &&
        (status === "All" || transaction.status === status) &&
        (project === "All" || transaction.project === project) &&
        (activeTab === "All Transactions" || transaction.type === activeTab)
      );
    });

    list.sort((a, b) => {
      let comp = 0;
      if (sortKey === "amount") comp = a.amount - b.amount;
      else if (sortKey === "description") comp = a.description.localeCompare(b.description);
      else if (sortKey === "category") comp = a.category.localeCompare(b.category);
      else comp = a.date.localeCompare(b.date);
      return sortDir === "asc" ? comp : -comp;
    });

    return list;
  }, [activeTab, project, search, sortDir, sortKey, status, transactions]);

  const allSelected = filtered.length > 0 && selectedIds.length === filtered.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < filtered.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filtered.map((tx) => tx.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((curr) => [...curr, id]);
    } else {
      setSelectedIds((curr) => curr.filter((i) => i !== id));
    }
  };

  return (
    <>
      <PageIntro
        title="Transactions"
        description="Semua transaksi kas, beban, pendapatan, dan transfer internal."
        action={
          <div className="transactions-heading-actions">
            <button
              className="transactions-export-button"
              onClick={() => alert("Mengekspor seluruh transaksi ke format Excel/CSV...")}
              type="button"
            >
              <HugeiconsIcon icon={Download01Icon} size={17} strokeWidth={1.8} />
              <span>Export</span>
            </button>
          </div>
        }
      />

      <article className="panel transactions-list-card">
        {/* TableSuite Standard Toolbar */}
        <TableToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search transaction, reference, or description..."
          sortOptions={sortOptions}
          currentSort={sortKey}
          sortDirection={sortDir}
          onSortChange={setSortKey}
          onSortDirectionChange={setSortDir}
          filterGroups={filterGroups}
          activeFilters={{ status, project }}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          displayDensity={density}
          onDensityChange={setDensity}
          columns={columns}
          visibleColumns={visibleColumns}
          onToggleColumn={handleToggleColumn}
          onAddNew={newTransaction}
          addNewLabel="New Transaction"
        />

        {/* Tab Segments with Vertical Dividers */}
        <div className="treasury-tab-nav" style={{ margin: "12px 16px 8px" }} role="tablist">
          {transactionTabs.map((tab) => (
            <button
              className={`treasury-tab-item ${activeTab === tab ? "active" : ""}`}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              key={tab}
              type="button"
            >
              <span>{tab}</span>
            </button>
          ))}
        </div>

        {/* Bulk Selection Action Bar */}
        <BulkSelectionBar
          selectedCount={selectedIds.length}
          onClear={() => setSelectedIds([])}
          onExport={() => alert(`Mengekspor ${selectedIds.length} transaksi terpilih...`)}
          onDelete={() => {
            alert(`Menghapus ${selectedIds.length} transaksi terpilih.`);
            setSelectedIds([]);
          }}
        />

        {/* Table Container */}
        <div className="transactions-table-wrap">
          <table className={`transactions-table density-${density}`}>
            <thead>
              <tr>
                <th className="col-checkbox">
                  <TableCheckbox
                    checked={allSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                    ariaLabel="Select all transactions"
                  />
                </th>
                {visibleColumns.includes("date") && <th>Date / Reference</th>}
                {visibleColumns.includes("description") && <th>Description</th>}
                {visibleColumns.includes("project") && <th>Project</th>}
                {visibleColumns.includes("category") && <th>Category</th>}
                {visibleColumns.includes("account") && <th>Cash Account</th>}
                {visibleColumns.includes("amount") && <th style={{ textAlign: "right" }}>Amount</th>}
                {visibleColumns.includes("status") && <th style={{ textAlign: "center" }}>Status</th>}
                <th className="col-actions">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((transaction) => {
                const isSelected = selectedIds.includes(transaction.id);
                return (
                  <tr
                    className={`clickable-row ${isSelected ? "selected-row" : ""}`}
                    onClick={() => selectTransaction(transaction)}
                    key={transaction.id}
                  >
                    <td className="col-checkbox" onClick={(e) => e.stopPropagation()}>
                      <TableCheckbox
                        checked={isSelected}
                        onChange={(chk) => handleToggleSelect(transaction.id, chk)}
                        ariaLabel={`Select ${transaction.id}`}
                      />
                    </td>
                    {visibleColumns.includes("date") && (
                      <td>
                        <div className="transaction-cell-date">
                          <TransactionTypeIcon type={transaction.type} />
                          <span>
                            <b>{transaction.date}</b>
                            <small>{transaction.id}</small>
                          </span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.includes("description") && (
                      <td>
                        <b>{transaction.description}</b>
                        <small>{transaction.contact || "—"}</small>
                      </td>
                    )}
                    {visibleColumns.includes("project") && <td>{transaction.project}</td>}
                    {visibleColumns.includes("category") && <td>{transaction.category}</td>}
                    {visibleColumns.includes("account") && <td>{transaction.account}</td>}
                    {visibleColumns.includes("amount") && (
                      <td
                        style={{ textAlign: "right" }}
                        className={`transaction-amount ${transaction.type.toLowerCase()}`}
                      >
                        <b>{signedAmount(transaction)}</b>
                        <small>{transaction.type}</small>
                      </td>
                    )}
                    {visibleColumns.includes("status") && (
                      <td style={{ textAlign: "center" }}>
                        <StatusBadge status={transaction.status} />
                      </td>
                    )}
                    <td className="col-actions">
                      <RowActionMenu
                        onView={() => selectTransaction(transaction)}
                        onEdit={() => onEditTransaction?.(transaction)}
                        onDelete={() => alert(`Hapus transaksi ${transaction.id}`)}
                      />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    className="transactions-empty"
                    colSpan={visibleColumns.length + 2}
                    style={{ textAlign: "center", padding: "36px" }}
                  >
                    Tidak ada transaksi yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="transactions-list-footer">
          <span>
            Showing {filtered.length} of {transactions.length} transactions
          </span>
          <nav aria-label="Transaction pagination">
            <button aria-label="Previous page" disabled type="button">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={15} strokeWidth={2} />
            </button>
            <button className="active" aria-current="page" type="button">
              1
            </button>
            <button aria-label="Next page" disabled type="button">
              <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2} />
            </button>
          </nav>
        </footer>
      </article>
    </>
  );
}
