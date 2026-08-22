"use client";

import { useMemo, useState } from "react";
import { MasterEditModal, type MasterRecordData, type MasterRecordType } from "../components/MasterEditModal";
import { NewMasterModal } from "../components/NewMasterModal";
import {
  BulkSelectionBar,
  EntityAvatar,
  RowActionMenu,
  TableCheckbox,
  TableToolbar,
} from "../components/TableSuite";
import { PageIntro, StatusBadge } from "../components/ui";

const initialAccounts = [
  ["1-1101", "Bank Operasional BCA", "ASSET", "Cash & Bank", "Corporate"],
  ["1-1201", "Kas Proyek", "ASSET", "Petty Cash", "Project"],
  ["4-1001", "Pendapatan Termin", "REVENUE", "Project Revenue", "Project"],
  ["5-1101", "Biaya Material", "EXPENSE", "Direct Cost", "Project"],
  ["6-1001", "Beban Kantor", "EXPENSE", "Corporate Expense", "Corporate"],
];

const initialContacts = [
  ["PT Aruna Hospitality", "CLIENT", "Hotel Gamelan", "Rp 100.000.000"],
  ["Nusantara Living", "CLIENT", "Villa Ubud", "Rp 120.000.000"],
  ["UD Sinar Baja", "VENDOR", "Hotel Gamelan", "Rp 24.500.000"],
  ["PT Beton Perkasa", "VENDOR", "Villa Ubud", "Rp 44.000.000"],
];

const initialCategories = [
  ["Pendapatan Termin", "INCOME", "4-1001 · Pendapatan Termin", "Project"],
  ["Biaya Material", "EXPENSE", "5-1101 · Biaya Material", "Project"],
  ["Tenaga Kerja", "EXPENSE", "5-1201 · Tenaga Kerja", "Project"],
  ["Beban Kantor", "EXPENSE", "6-1001 · Beban Kantor", "Corporate"],
];

export function MastersView({
  notify,
  tab,
  setTab,
}: {
  notify: (message: string) => void;
  tab: string;
  setTab: (tab: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState("All");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [density, setDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [accounts, setAccounts] = useState<string[][]>(initialAccounts);
  const [contacts, setContacts] = useState<string[][]>(initialContacts);
  const [categories, setCategories] = useState<string[][]>(initialCategories);
  const [editingMaster, setEditingMaster] = useState<MasterRecordData | null>(null);
  const [newMasterType, setNewMasterType] = useState<MasterRecordType | null>(null);

  const handleCreateMaster = (newRow: string[]) => {
    if (!newMasterType) return;
    if (newMasterType === "COA") {
      setAccounts((prev) => [newRow, ...prev]);
      notify(`Akun bagan ${newRow[1]} (${newRow[0]}) berhasil didaftarkan.`);
    } else if (newMasterType === "CONTACT") {
      setContacts((prev) => [newRow, ...prev]);
      notify(`Rekanan baru ${newRow[0]} berhasil didaftarkan.`);
    } else {
      setCategories((prev) => [newRow, ...prev]);
      notify(`Kategori transaksi ${newRow[0]} berhasil didaftarkan.`);
    }
    setNewMasterType(null);
  };

  const handleSaveMaster = (updatedRow: string[]) => {
    if (!editingMaster) return;
    if (editingMaster.type === "COA") {
      setAccounts((prev) => prev.map((r) => (r[0] === updatedRow[0] ? updatedRow : r)));
      notify(`Akun bagan ${updatedRow[1]} (${updatedRow[0]}) berhasil diperbarui.`);
    } else if (editingMaster.type === "CONTACT") {
      setContacts((prev) => prev.map((r) => (r[0] === editingMaster.row[0] ? updatedRow : r)));
      notify(`Data rekanan ${updatedRow[0]} berhasil diperbarui.`);
    } else {
      setCategories((prev) => prev.map((r) => (r[0] === editingMaster.row[0] ? updatedRow : r)));
      notify(`Kategori transaksi ${updatedRow[0]} berhasil diperbarui.`);
    }
    setEditingMaster(null);
  };

  const activeTabList =
    tab === "Chart of Accounts"
      ? accounts
      : tab === "Contacts"
      ? contacts
      : categories;

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activeTabList.filter((row) => {
      const matchSearch = !q || row.some((cell) => cell.toLowerCase().includes(q));
      const matchScope =
        scopeFilter === "All" || row.some((cell) => cell.toLowerCase() === scopeFilter.toLowerCase());
      return matchSearch && matchScope;
    });
  }, [activeTabList, scopeFilter, search]);

  const allSelected = filteredData.length > 0 && selectedIds.length === filteredData.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < filteredData.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredData.map((row) => row[0]));
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
        title="Master Data"
        description="Kelola akun bagan (COA), data rekanan kontak, dan kategori transaksi perusahaan."
      />

      {/* Segmented Tab Navigation with Vertical Dividers */}
      <div className="treasury-tab-nav" style={{ marginBottom: "14px" }} role="tablist">
        {["Chart of Accounts", "Contacts", "Transaction Categories"].map((item) => (
          <button
            className={`treasury-tab-item ${tab === item ? "active" : ""}`}
            role="tab"
            aria-selected={tab === item}
            onClick={() => {
              setTab(item);
              setSelectedIds([]);
            }}
            key={item}
            type="button"
          >
            <span>{item}</span>
          </button>
        ))}
      </div>

      <article className="panel list-panel">
        {/* TableSuite Standard Toolbar */}
        <TableToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={`Search ${tab.toLowerCase()}...`}
          sortOptions={[
            { label: "Nama / Deskripsi", value: "name" },
            { label: "Kode / Tipe", value: "code" },
          ]}
          currentSort={sortKey}
          sortDirection={sortDir}
          onSortChange={setSortKey}
          onSortDirectionChange={setSortDir}
          filterGroups={[
            {
              id: "scope",
              label: "Lingkup (Scope)",
              options: [
                { label: "Semua Lingkup", value: "All" },
                { label: "Corporate", value: "Corporate" },
                { label: "Project", value: "Project" },
              ],
            },
          ]}
          activeFilters={{ scope: scopeFilter }}
          onFilterChange={(_, val) => setScopeFilter(val)}
          onResetFilters={() => {
            setScopeFilter("All");
            setSearch("");
          }}
          displayDensity={density}
          onDensityChange={setDensity}
          onAddNew={() => {
            const t: MasterRecordType =
              tab === "Chart of Accounts"
                ? "COA"
                : tab === "Contacts"
                ? "CONTACT"
                : "CATEGORY";
            setNewMasterType(t);
          }}
          addNewLabel={`Add ${tab === "Chart of Accounts" ? "Account" : tab === "Contacts" ? "Contact" : "Category"}`}
        />

        {/* Bulk Selection Action Bar */}
        <BulkSelectionBar
          selectedCount={selectedIds.length}
          onClear={() => setSelectedIds([])}
          onExport={() => notify(`Mengekspor ${selectedIds.length} data terpilih...`)}
          onDelete={() => {
            notify(`Menghapus ${selectedIds.length} data terpilih.`);
            setSelectedIds([]);
          }}
        />

        <div className="table-wrap full-table">
          <table className={`masters-table density-${density}`}>
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
                {tab === "Chart of Accounts" ? (
                  <>
                    <th>Kode Akun</th>
                    <th>Nama Akun</th>
                    <th>Tipe</th>
                    <th>Kategori COA</th>
                    <th>Lingkup</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                  </>
                ) : tab === "Contacts" ? (
                  <>
                    <th>Nama Kontak / Rekanan</th>
                    <th>Tipe</th>
                    <th>Proyek Terkait</th>
                    <th style={{ textAlign: "right" }}>Outstanding</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                  </>
                ) : (
                  <>
                    <th>Kategori Transaksi</th>
                    <th>Tipe Arus</th>
                    <th>Akun Mapping COA</th>
                    <th>Lingkup</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                  </>
                )}
                <th className="col-actions">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", padding: "36px", color: "var(--muted)" }}
                  >
                    Tidak ada data master yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : tab === "Chart of Accounts" ? (
                filteredData.map((row) => {
                  const isSelected = selectedIds.includes(row[0]);
                  return (
                    <tr
                      key={row[0]}
                      className={`clickable-row ${isSelected ? "selected-row" : ""}`}
                    >
                      <td className="col-checkbox" onClick={(e) => e.stopPropagation()}>
                        <TableCheckbox
                          checked={isSelected}
                          onChange={(chk) => handleToggleSelect(row[0], chk)}
                          ariaLabel={`Select ${row[1]}`}
                        />
                      </td>
                      <td>
                        <code className="cell-ref-id">{row[0]}</code>
                      </td>
                      <td>
                        <b>{row[1]}</b>
                      </td>
                      <td>
                        <span className={`type-pill type-pill-${row[2].toLowerCase()}`}>
                          {row[2]}
                        </span>
                      </td>
                      <td>{row[3]}</td>
                      <td>{row[4]}</td>
                      <td style={{ textAlign: "center" }}>
                        <StatusBadge status="ACTIVE" />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <RowActionMenu
                          onView={() => notify(`Rincian akun ${row[1]} (${row[0]})`)}
                          onEdit={() => setEditingMaster({ type: "COA", row })}
                          onDelete={() => notify(`Hapus akun ${row[1]}`)}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : tab === "Contacts" ? (
                filteredData.map((row) => {
                  const isSelected = selectedIds.includes(row[0]);
                  return (
                    <tr
                      key={row[0]}
                      className={`clickable-row ${isSelected ? "selected-row" : ""}`}
                    >
                      <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                        <TableCheckbox
                          checked={isSelected}
                          onChange={(chk) => handleToggleSelect(row[0], chk)}
                          ariaLabel={`Select ${row[0]}`}
                        />
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <EntityAvatar name={row[0]} size={30} />
                          <b>{row[0]}</b>
                        </div>
                      </td>
                      <td>
                        <span className={`type-pill type-pill-${row[1].toLowerCase()}`}>
                          {row[1]}
                        </span>
                      </td>
                      <td>{row[2]}</td>
                      <td style={{ textAlign: "right" }}>
                        <span className="mono-num font-bold text-ink">{row[3]}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <StatusBadge status="ACTIVE" />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <RowActionMenu
                          onView={() => notify(`Rincian kontak ${row[0]}`)}
                          onEdit={() => setEditingMaster({ type: "CONTACT", row })}
                          onDelete={() => notify(`Hapus kontak ${row[0]}`)}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                filteredData.map((row) => {
                  const isSelected = selectedIds.includes(row[0]);
                  return (
                    <tr
                      key={row[0]}
                      className={`clickable-row ${isSelected ? "selected-row" : ""}`}
                    >
                      <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                        <TableCheckbox
                          checked={isSelected}
                          onChange={(chk) => handleToggleSelect(row[0], chk)}
                          ariaLabel={`Select ${row[0]}`}
                        />
                      </td>
                      <td>
                        <b>{row[0]}</b>
                      </td>
                      <td>
                        <span className={`type-pill type-pill-${row[1].toLowerCase()}`}>
                          {row[1]}
                        </span>
                      </td>
                      <td>
                        <code className="cell-ref-id">{row[2]}</code>
                      </td>
                      <td>{row[3]}</td>
                      <td style={{ textAlign: "center" }}>
                        <StatusBadge status="ACTIVE" />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <RowActionMenu
                          onView={() => notify(`Rincian kategori ${row[0]}`)}
                          onEdit={() => setEditingMaster({ type: "CATEGORY", row })}
                          onDelete={() => notify(`Hapus kategori ${row[0]}`)}
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

      {newMasterType && (
        <NewMasterModal
          type={newMasterType}
          close={() => setNewMasterType(null)}
          submit={handleCreateMaster}
          existingCodes={accounts.map((a) => a[0])}
        />
      )}

      {editingMaster && (
        <MasterEditModal
          data={editingMaster}
          close={() => setEditingMaster(null)}
          submit={handleSaveMaster}
        />
      )}
    </>
  );
}
