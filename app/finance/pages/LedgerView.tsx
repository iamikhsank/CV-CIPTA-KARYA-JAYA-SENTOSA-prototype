"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Invoice01Icon from "@hugeicons/core-free-icons/Invoice01Icon";
import {
  BulkSelectionBar,
  EntityAvatar,
  RowActionMenu,
  TableCheckbox,
  TableToolbar,
} from "../components/TableSuite";
import { PageIntro, StatusBadge } from "../components/ui";
import { formatIDR } from "../data";
import type { CashAccount, LedgerRecord, PaymentInput } from "../types";
import { LedgerRecordDetail } from "./LedgerRecordDetail";

type LedgerType = "AR" | "AP";

export function LedgerView({
  type,
  rows,
  accounts,
  recordPayment,
}: {
  type: LedgerType;
  rows: LedgerRecord[];
  accounts: CashAccount[];
  recordPayment: (type: LedgerType, target: LedgerRecord, payment: PaymentInput) => void;
}) {
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<string>("due");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [density, setDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [selectedRefs, setSelectedRefs] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "party",
    "project",
    "total",
    "paid",
    "outstanding",
    "due",
    "status",
  ]);
  const [recordedPayments, setRecordedPayments] = useState<Record<string, PaymentInput[]>>({});

  const selected = rows.find((row) => row.ref === selectedRef) ?? null;
  const isAR = type === "AR";

  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const paid = rows.reduce((sum, row) => sum + row.paid, 0);
  const settledPercent = Math.round((paid / (total || 1)) * 100);
  const outstandingPercent = Math.max(0, 100 - settledPercent);

  const projects = useMemo(() => {
    return Array.from(new Set(rows.map((r) => r.project)));
  }, [rows]);

  const filterGroups = useMemo(
    () => [
      {
        id: "status",
        label: "Status Pembayaran",
        options: [
          { label: "Semua Status", value: "All" },
          { label: "Outstanding", value: "OUTSTANDING" },
          { label: "Partially Paid", value: "PARTIAL" },
          { label: "Paid", value: "PAID" },
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
    { label: "Jatuh Tempo (Due Date)", value: "due" },
    { label: "Nominal Total", value: "total" },
    { label: "Nominal Terbayar (Paid)", value: "paid" },
    { label: "Sisa Piutang/Hutang (Outstanding)", value: "outstanding" },
    { label: isAR ? "Nama Klien" : "Nama Vendor", value: "party" },
  ];

  const columns = [
    { id: "party", label: isAR ? "Client" : "Vendor" },
    { id: "project", label: "Project / Reference" },
    { id: "total", label: "Total" },
    { id: "paid", label: "Paid" },
    { id: "outstanding", label: "Outstanding" },
    { id: "due", label: "Due Date" },
    { id: "status", label: "Status" },
  ];

  const handleFilterChange = (groupId: string, val: string) => {
    if (groupId === "status") setStatusFilter(val);
    if (groupId === "project") setProjectFilter(val);
  };

  const handleResetFilters = () => {
    setStatusFilter("All");
    setProjectFilter("All");
    setSearch("");
  };

  const handleToggleColumn = (colId: string) => {
    setVisibleColumns((curr) =>
      curr.includes(colId) ? curr.filter((id) => id !== colId) : [...curr, colId],
    );
  };

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = rows.filter((row) => {
      const matchSearch =
        !q ||
        row.party.toLowerCase().includes(q) ||
        row.ref.toLowerCase().includes(q) ||
        row.project.toLowerCase().includes(q);
      const matchProject = projectFilter === "All" || row.project === projectFilter;
      const matchStatus = statusFilter === "All" || row.status === statusFilter;
      return matchSearch && matchProject && matchStatus;
    });

    list.sort((a, b) => {
      let comp = 0;
      if (sortKey === "total") comp = a.total - b.total;
      else if (sortKey === "paid") comp = a.paid - b.paid;
      else if (sortKey === "outstanding") comp = (a.total - a.paid) - (b.total - b.paid);
      else if (sortKey === "party") comp = a.party.localeCompare(b.party);
      else comp = a.due.localeCompare(b.due);
      return sortDir === "asc" ? comp : -comp;
    });

    return list;
  }, [projectFilter, rows, search, sortDir, sortKey, statusFilter]);

  const allSelected = filteredRows.length > 0 && selectedRefs.length === filteredRows.length;
  const isIndeterminate = selectedRefs.length > 0 && selectedRefs.length < filteredRows.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRefs(filteredRows.map((r) => r.ref));
    } else {
      setSelectedRefs([]);
    }
  };

  const handleToggleSelect = (ref: string, checked: boolean) => {
    if (checked) {
      setSelectedRefs((curr) => [...curr, ref]);
    } else {
      setSelectedRefs((curr) => curr.filter((r) => r !== ref));
    }
  };

  if (selected) {
    return (
      <LedgerRecordDetail
        type={type}
        row={selected}
        accounts={accounts}
        recordedPayments={recordedPayments[selected.ref] ?? []}
        back={() => setSelectedRef(null)}
        recordPayment={(payment) => {
          setRecordedPayments((current) => ({
            ...current,
            [selected.ref]: [...(current[selected.ref] ?? []), payment],
          }));
          recordPayment(type, selected, payment);
        }}
      />
    );
  }

  return (
    <>
      <PageIntro
        title={isAR ? "Receivables" : "Payables"}
        description={
          isAR
            ? "Pantau piutang outstanding per klien dan proyek."
            : "Pantau hutang outstanding per vendor dan proyek."
        }
        action={
          <button
            className="primary-button"
            onClick={() => alert(`Buat ${isAR ? "piutang" : "hutang"} baru...`)}
            type="button"
          >
            <HugeiconsIcon icon={Invoice01Icon} size={18} strokeWidth={1.8} />
            <span>{isAR ? "New Receivable" : "New Payable"}</span>
          </button>
        }
      />

      <section className="mini-kpi-grid" aria-label="Ringkasan Buku Pembantu">
        <article className="ledger-total-card">
          <div className="ledger-total-copy">
            <span>Total {isAR ? "Receivable" : "Payable"}</span>
            <strong>{formatIDR(total)}</strong>
            <small>{rows.length} records</small>
          </div>
          <div
            className="ledger-summary-donut"
            style={{
              background: `conic-gradient(var(--ledger-donut-blue, var(--brand)) 0 ${settledPercent}%, var(--ledger-donut-track, var(--brand-soft)) ${settledPercent}% 100%)`,
            }}
            role="img"
            aria-label={`${settledPercent}% dari total telah dibayar`}
          >
            <div className="ledger-donut-center" aria-hidden="true">
              <b>{settledPercent}%</b>
              <small>settled</small>
            </div>
          </div>
        </article>
        <article className="ledger-total-card">
          <div className="ledger-total-copy">
            <span>Paid</span>
            <strong className="text-green">{formatIDR(paid)}</strong>
            <small>{settledPercent}% settled</small>
          </div>
          <div
            className="ledger-summary-donut is-paid"
            style={{
              background: `conic-gradient(var(--ledger-donut-green, #168b67) 0 ${settledPercent}%, var(--ledger-donut-track-paid, #eaf7f2) ${settledPercent}% 100%)`,
            }}
            role="img"
            aria-label={`${settledPercent}% telah dibayar`}
          >
            <div className="ledger-donut-center" aria-hidden="true">
              <b>{settledPercent}%</b>
              <small>paid</small>
            </div>
          </div>
        </article>
        <article className="ledger-total-card">
          <div className="ledger-total-copy">
            <span>Outstanding</span>
            <strong className="text-amber">{formatIDR(total - paid)}</strong>
            <small>{rows.filter((row) => row.status !== "PAID").length} records require action</small>
          </div>
          <div
            className="ledger-summary-donut is-outstanding"
            style={{
              background: `conic-gradient(var(--ledger-donut-amber, #d97706) 0 ${outstandingPercent}%, var(--ledger-donut-track-outstanding, #fff4df) ${outstandingPercent}% 100%)`,
            }}
            role="img"
            aria-label={`${outstandingPercent}% masih outstanding`}
          >
            <div className="ledger-donut-center" aria-hidden="true">
              <b>{outstandingPercent}%</b>
              <small>open</small>
            </div>
          </div>
        </article>
      </section>

      <article className="panel list-panel">
        {/* TableSuite Standard Toolbar */}
        <TableToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={`Search ${isAR ? "client" : "vendor"} or reference...`}
          sortOptions={sortOptions}
          currentSort={sortKey}
          sortDirection={sortDir}
          onSortChange={setSortKey}
          onSortDirectionChange={setSortDir}
          filterGroups={filterGroups}
          activeFilters={{ status: statusFilter, project: projectFilter }}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          displayDensity={density}
          onDensityChange={setDensity}
          columns={columns}
          visibleColumns={visibleColumns}
          onToggleColumn={handleToggleColumn}
          onAddNew={() => alert(`Buat ${isAR ? "Piutang" : "Hutang"} baru...`)}
          addNewLabel={isAR ? "New Receivable" : "New Payable"}
        />

        {/* Bulk Selection Action Bar */}
        <BulkSelectionBar
          selectedCount={selectedRefs.length}
          onClear={() => setSelectedRefs([])}
          onExport={() => alert(`Mengekspor ${selectedRefs.length} data terpilih...`)}
          onDelete={() => {
            alert(`Menghapus ${selectedRefs.length} data terpilih.`);
            setSelectedRefs([]);
          }}
        />

        <div className="table-wrap full-table">
          <table className={`ledger-table density-${density}`}>
            <thead>
              <tr>
                <th className="col-checkbox">
                  <TableCheckbox
                    checked={allSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                    ariaLabel="Select all rows"
                  />
                </th>
                {visibleColumns.includes("party") && <th>{isAR ? "Client" : "Vendor"}</th>}
                {visibleColumns.includes("project") && <th>Project / Reference</th>}
                {visibleColumns.includes("total") && <th style={{ textAlign: "right" }}>Total</th>}
                {visibleColumns.includes("paid") && <th style={{ textAlign: "right" }}>Paid</th>}
                {visibleColumns.includes("outstanding") && (
                  <th style={{ textAlign: "right" }}>Outstanding</th>
                )}
                {visibleColumns.includes("due") && <th>Due Date</th>}
                {visibleColumns.includes("status") && (
                  <th style={{ textAlign: "center" }}>Status</th>
                )}
                <th className="col-actions">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 2}
                    style={{ textAlign: "center", padding: "36px", color: "var(--muted)" }}
                  >
                    Tidak ada data yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const outstanding = row.total - row.paid;
                  const isSelected = selectedRefs.includes(row.ref);
                  return (
                    <tr
                      className={`clickable-row ${isSelected ? "selected-row" : ""}`}
                      onClick={() => setSelectedRef(row.ref)}
                      key={row.ref}
                    >
                      <td className="col-checkbox" onClick={(e) => e.stopPropagation()}>
                        <TableCheckbox
                          checked={isSelected}
                          onChange={(chk) => handleToggleSelect(row.ref, chk)}
                          ariaLabel={`Select ${row.party}`}
                        />
                      </td>
                      {visibleColumns.includes("party") && (
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <EntityAvatar name={row.party} size={30} />
                            <div>
                              <b>{row.party}</b>
                              <small>{isAR ? "Client" : "Vendor"}</small>
                            </div>
                          </div>
                        </td>
                      )}
                      {visibleColumns.includes("project") && (
                        <td>
                          <b>{row.project}</b>
                          <small className="cell-ref-code">{row.ref}</small>
                        </td>
                      )}
                      {visibleColumns.includes("total") && (
                        <td style={{ textAlign: "right" }}>
                          <span className="mono-num">{formatIDR(row.total)}</span>
                        </td>
                      )}
                      {visibleColumns.includes("paid") && (
                        <td style={{ textAlign: "right" }}>
                          <span className="mono-num text-green font-semibold">
                            {row.paid ? formatIDR(row.paid) : "Rp 0"}
                          </span>
                        </td>
                      )}
                      {visibleColumns.includes("outstanding") && (
                        <td style={{ textAlign: "right" }}>
                          <span
                            className={`mono-num font-bold ${outstanding ? "text-ink" : "text-green"}`}
                          >
                            {formatIDR(outstanding)}
                          </span>
                        </td>
                      )}
                      {visibleColumns.includes("due") && (
                        <td>
                          <span>{row.due}</span>
                        </td>
                      )}
                      {visibleColumns.includes("status") && (
                        <td style={{ textAlign: "center" }}>
                          <StatusBadge status={row.status} />
                        </td>
                      )}
                      <td style={{ textAlign: "center" }}>
                        <RowActionMenu
                          onView={() => setSelectedRef(row.ref)}
                          onEdit={() => alert(`Edit catatan ${row.ref}`)}
                          onDelete={() => alert(`Hapus catatan ${row.ref}`)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}
