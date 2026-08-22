"use client";

import { useId, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDownRight01Icon from "@hugeicons/core-free-icons/ArrowDownRight01Icon";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";
import ArrowDataTransferHorizontalIcon from "@hugeicons/core-free-icons/ArrowDataTransferHorizontalIcon";
import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
import Invoice03Icon from "@hugeicons/core-free-icons/Invoice03Icon";
import PackageIcon from "@hugeicons/core-free-icons/PackageIcon";
import { formatIDR } from "../data";
import { SmartCurrencyInput } from "./SmartCurrencyInput";
import type { Transaction } from "../types";

function TreeBranchCurve() {
  return (
    <svg
      className="tree-branch-svg"
      width="20"
      height="24"
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 0V9C3 13.4183 6.58172 17 11 17H18M18 17L13.5 12.5M18 17L13.5 21.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const incomeCategories = [
  "4-1000 Pembayaran Termin",
  "4-2000 Pendapatan Lain-lain",
];

const expenseCategories = [
  // 5-1000 Upah & Tenaga Kerja
  "5-1000 Biaya Upah Pekerja",
  "5-1001 Fee Arsitek, Marketing, Site Manager",
  "5-1002 Konsumsi Pekerja",
  // 5-2000 Biaya Bahan & Material Konstruksi (5-2100 s/d 5-2220)
  "5-2100 BAJA Profil & Perlengkapannya",
  "5-2101 Upah Borong Kerja BAJA",
  "5-2102 Vendor Woods, Cladding & Besi Profil",
  "5-2103 Biaya Koordinasi, Keamanan, Tips",
  "5-2104 BESI BETON, Wmesh & Bondek",
  "5-2105 Kawat, Paku & Material Lainnya",
  "5-2110 Semen PC & Perekat Hebel",
  "5-2111 Semen Acian Mortar & Coating",
  "5-2120 Ready Mix Beton & Sewa Pompa",
  "5-2121 Bekisting (papan, kaso, bambu, triplek)",
  "5-2130 Pas. Dinding Bata / Bata Ringan",
  "5-2131 Penutup Plafond",
  "5-2140 Vendor Vinyl, Jasa Bor, Membran, dll",
  "5-2142 Batu Belah Pondasi & Urugan",
  "5-2144 PASIR & SPLIT",
  "5-2150 Paving Block, Glassblock, Roster",
  "5-2151 Cat Tembok & Cat Waterproofing",
  "5-2160 Penutup Atap",
  "5-2170 Granit/Keramik Lantai & Dinding",
  "5-2171 Pek.Kanopi, Railing, Pagar, Teralis",
  "5-2180 Asesories Sanitair",
  "5-2190 Pintu, Jendela & Asesoriesnya",
  "5-2200 Elektrikal",
  "5-2201 Pemipaan",
  "5-2210 Perlengkapan Kerja (aset)",
  "5-2220 Upah Buang Puing",
  "Biaya Material",
  // 6-0000 Biaya Overhead & Operasional
  "6-1000 Cicilan & Bunga Modal Proyek",
  "6-2000 ATK, Pulsa, Listrik & Obat-obatan",
  "6-3000 Biaya Operasional Direksi",
  "6-5000 Biaya Transportasi Operasional",
  "6-6000 Biaya SEWA Peralatan & Kos Pekerja",
  "6-8000 Komisi dan Success Fee",
  "6-9000 Biaya Lain-lain",
  "Operasional Proyek",
  "Beban Kantor",
];

const contactOptions = [
  // Hutang / Vendors (Kode Bantu Hxxx)
  'H001 - "PT WTP" Daniel (Hutang Vendor)',
  'H002 - "SATRIA Leveransir" (Hutang Vendor)',
  'H003 - "TB Surya Putra Lembang" (Hutang Vendor)',
  "UD Sinar Baja (Vendor Material)",
  "PT Semen Tiga Roda (Vendor)",
  // Piutang / Clients (Kode Bantu Pxxx)
  "P001 - CV. CIPTA KARYA (Piutang Klien)",
  "P002 - Klien Gamelan House (Piutang Klien)",
  "PT Aruna Hospitality (Klien)",
  "Nusantara Living (Klien)",
  // Karyawan (Kode Bantu Kxxx)
  "K001 - Karyawan (Kasbon / Piutang Karyawan)",
];

const cashAccountOptions = [
  "1-1400 Rekening Giro Anton",
  "1-1100 Kas Proyek Gamelan",
  "1-1200 Bank Operasional BCA",
  "1-1201 Bank Mandiri Operasional",
];

const projectOptions = [
  "Hotel Gamelan",
  "Villa Ubud",
  "Warehouse Cikande",
  "Kantor Sentosa",
];

function isMaterialCostAccount(accountName: string): boolean {
  if (!accountName) return false;
  if (accountName.startsWith("5-2") || accountName.includes("5-2")) return true;
  const lower = accountName.toLowerCase();
  return (
    lower.includes("material") ||
    lower.includes("bahan") ||
    lower.includes("beton") ||
    lower.includes("besi") ||
    lower.includes("semen") ||
    lower.includes("pasir") ||
    lower.includes("bata") ||
    lower.includes("keramik") ||
    lower.includes("cat") ||
    lower.includes("atap") ||
    lower.includes("baja") ||
    lower.includes("pipa") ||
    lower.includes("elektrikal")
  );
}

function isSubledgerCreditContact(contactName: string): boolean {
  if (!contactName) return false;
  return (
    contactName.includes("H00") ||
    contactName.includes("P00") ||
    contactName.includes("K00") ||
    contactName.toLowerCase().includes("hutang") ||
    contactName.toLowerCase().includes("piutang") ||
    contactName.toLowerCase().includes("kasbon")
  );
}

export function EditTransactionModal({
  transaction,
  close,
  submit,
  projectsList,
}: {
  transaction: Transaction;
  close: () => void;
  submit: (updatedTx: Transaction, post: boolean) => void;
  projectsList?: string[];
}) {
  const availableProjects = projectsList && projectsList.length > 0 ? projectsList : projectOptions;
  const [type, setType] = useState<"Income" | "Expense" | "Transfer">(transaction.type);
  const [scope, setScope] = useState<"Project" | "Corporate">(transaction.project === "Corporate" ? "Corporate" : "Project");
  const [project, setProject] = useState(transaction.project && transaction.project !== "Corporate" ? transaction.project : availableProjects[0]);
  const [category, setCategory] = useState(transaction.category);
  const [account, setAccount] = useState(transaction.account);
  const [contact, setContact] = useState(transaction.contact || "");
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount);
  const [materialVolume, setMaterialVolume] = useState(transaction.materialVolume || "");
  const [dueDate, setDueDate] = useState(transaction.dueDate || "");
  const [referenceNo, setReferenceNo] = useState(transaction.referenceNo || "");
  const [notes, setNotes] = useState(transaction.notes || "");

  const scopeId = useId();
  const projectId = useId();
  const categoryId = useId();
  const accountId = useId();
  const contactId = useId();
  const descId = useId();
  const amountId = useId();
  const volumeId = useId();
  const dueDateId = useId();
  const refId = useId();
  const notesId = useId();

  const isMaterial = type === "Expense" && isMaterialCostAccount(category);
  const isCreditContact = isSubledgerCreditContact(contact);

  const debitAccount = type === "Expense" ? category : account;
  const creditAccount = type === "Expense" ? account : category;

  const valid = amount > 0 && description.trim().length >= 3;

  const handleSend = (post: boolean) => {
    if (!valid) return;
    const updated: Transaction = {
      ...transaction,
      type,
      project: scope === "Corporate" ? "Corporate" : project,
      category,
      account,
      contact: contact.trim() || "—",
      description: description.trim(),
      amount: Number(amount) || 0,
      status: post ? "POSTED" : transaction.status === "REVERSED" ? "REVERSED" : "DRAFT",
      materialVolume: isMaterial && materialVolume.trim() ? materialVolume.trim() : undefined,
      dueDate: dueDate ? dueDate : undefined,
      referenceNo: referenceNo.trim() ? referenceNo.trim() : undefined,
      notes: notes.trim() ? notes.trim() : undefined,
    };
    submit(updated, post);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="edit-tx-modal-title">
      <div className="modal-card transaction-modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">EDIT TRANSACTION · {transaction.id}</span>
            <h2 id="edit-tx-modal-title">Pembaruan Jurnal Transaksi</h2>
            <p>Perbarui rincian rekening sumber, alokasi beban/pendapatan, rekanan, dan nilai transaksi.</p>
          </div>
          <button onClick={close} aria-label="Tutup modal" type="button">
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="transaction-type">
          {(["Income", "Expense", "Transfer"] as const).map((item) => {
            const itemKey = item.toLowerCase();
            return (
              <button
                className={`type-btn ${itemKey} ${type === item ? "active" : ""}`}
                onClick={() => {
                  setType(item);
                  if (item === "Income") {
                    setCategory("4-1000 Pembayaran Termin");
                  } else if (item === "Expense") {
                    setCategory("5-2104 BESI BETON, Wmesh & Bondek");
                  }
                }}
                key={item}
                type="button"
              >
                <i>
                  <HugeiconsIcon
                    icon={
                      item === "Income"
                        ? ArrowUpRight01Icon
                        : item === "Expense"
                        ? ArrowDownRight01Icon
                        : ArrowDataTransferHorizontalIcon
                    }
                    size={20}
                    strokeWidth={2}
                  />
                </i>
                <span>
                  <b>{item === "Income" ? "Penerimaan (Income)" : item === "Expense" ? "Pengeluaran (Expense)" : "Transfer Kas"}</b>
                  <small>
                    {item === "Income"
                      ? "Penerimaan termin klien / pendapatan"
                      : item === "Expense"
                      ? "Beban material, upah & operasional"
                      : "Pindah buku antar kas & bank"}
                  </small>
                </span>
              </button>
            );
          })}
        </div>

        <div className="modal-body">
          {/* Left Column: Input Form */}
          <div className="form-section">
            <div className="form-grid">
              <label htmlFor={scopeId}>
                <span className="field-label-text">
                  <span>Alokasi Entitas</span>
                </span>
                <select
                  id={scopeId}
                  value={scope}
                  onChange={(e) => setScope(e.target.value as "Project" | "Corporate")}
                >
                  <option value="Project">Biaya / Termin Proyek</option>
                  <option value="Corporate">Beban Umum Kantor (Corporate)</option>
                </select>
              </label>

              {scope === "Project" ? (
                <label htmlFor={projectId}>
                  <span className="field-label-text">
                    <span>Nama Proyek</span>
                  </span>
                  <select
                    id={projectId}
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                  >
                    {availableProjects.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <label>
                  <span className="field-label-text">Alokasi Biaya</span>
                  <input value="Kantor Pusat Sentosa" disabled style={{ background: "#f8fafc" }} />
                </label>
              )}

              <label htmlFor={accountId}>
                <span className="field-label-text">
                  <span>Rekening Kas / Bank</span>
                </span>
                <select
                  id={accountId}
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                >
                  {cashAccountOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor={categoryId}>
                <span className="field-label-text">
                  <span>Kategori Akun (COA)</span>
                </span>
                <select
                  id={categoryId}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {(type === "Income" ? incomeCategories : expenseCategories).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor={contactId} className="full">
                <span className="field-label-text">
                  <span>Kontak Rekanan / Vendor / Klien</span>
                  {isCreditContact && <span className="field-hint">Kewajiban Tempo</span>}
                </span>
                <input
                  id={contactId}
                  list="edit-contact-suggestions"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Ketik kode (H00x, P00x) atau nama rekanan..."
                />
                <datalist id="edit-contact-suggestions">
                  {contactOptions.map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
              </label>

              <label htmlFor={descId} className="full">
                <span className="field-label-text">Keterangan / Uraian Pekerjaan</span>
                <input
                  id={descId}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Pembelian Besi Beton Ulir 12mm 50 Batang"
                  required
                />
              </label>

              <label htmlFor={amountId} className="full">
                <span className="field-label-text">
                  <span>Nominal Transaksi (IDR)</span>
                </span>
                <div className="currency-input-wrap">
                  <span className="currency-prefix">Rp</span>
                  <SmartCurrencyInput
                    id={amountId}
                    value={amount}
                    onChange={setAmount}
                    min={1}
                  />
                </div>
              </label>

              {isMaterial && (
                <label htmlFor={volumeId}>
                  <span className="field-label-text">
                    <span>Volume Material</span>
                    <span className="field-hint">Opname Fisik</span>
                  </span>
                  <input
                    id={volumeId}
                    value={materialVolume}
                    onChange={(e) => setMaterialVolume(e.target.value)}
                    placeholder="Contoh: 12.5 m3 / 50 btg"
                  />
                </label>
              )}

              <label htmlFor={refId}>
                <span className="field-label-text">
                  <span>No. Faktur / Bukti Fisik</span>
                </span>
                <input
                  id={refId}
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="INV/2026/08/..."
                />
              </label>

              <label htmlFor={dueDateId}>
                <span className="field-label-text">
                  <span>Jatuh Tempo (Jika Tempo)</span>
                  {isCreditContact && <span className="field-hint">Termin Pembayaran</span>}
                </span>
                <input
                  id={dueDateId}
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </label>

              <label htmlFor={notesId} className="full">
                <span className="field-label-text">Catatan Internal Kasir / Site Manager</span>
                <input
                  id={notesId}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan tambahan opname fisik atau kesepakatan pembayaran..."
                />
              </label>
            </div>
          </div>

          {/* Right Column: Double Entry Journal Preview */}
          <aside className="journal-preview" aria-label="Pratinjau Jurnal Akuntansi">
            <div className="journal-head">
              <div>
                <h3>Pratinjau Jurnal Berpasangan</h3>
                <p>Pemetaan otomatis debit dan kredit standar pembukuan perusahaan</p>
              </div>
              <span className="balanced">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2.2} />
                DEBIT = KREDIT SEIMBANG
              </span>
            </div>

            <div className="journal-ledger-box">
              <div className="journal-row journal-header">
                <span className="col-account">Akun Buku Besar</span>
                <span className="col-amount">Debit</span>
                <span className="col-amount">Kredit</span>
              </div>

              {/* Debit Row */}
              <div className="journal-row debit-row">
                <div className="account-cell">
                  <div className="account-meta">
                    <b className="account-name">{debitAccount}</b>
                    <small className="account-sub">
                      {type === "Expense"
                        ? (scope === "Project" ? `Alokasi Beban Proyek · ${project}` : "Beban Kantor / Corporate")
                        : type === "Income"
                        ? `Penerimaan Kas · ${project}`
                        : "Rekening Kas Tujuan"}
                    </small>
                  </div>
                </div>
                <span className="col-amount debit-val">{formatIDR(amount)}</span>
                <span className="col-amount muted-dash">—</span>
              </div>

              {/* Credit Row */}
              <div className="journal-row credit-row">
                <div className="account-cell credit-cell">
                  <TreeBranchCurve />
                  <div className="account-meta">
                    <b className="account-name">{creditAccount}</b>
                    <small className="account-sub">
                      {type === "Expense"
                        ? (isCreditContact ? `Kewajiban Tempo · ${contact}` : `Pembayaran Kas · ${account}`)
                        : type === "Income"
                        ? `Pendapatan Termin · ${category}`
                        : "Rekening Kas Asal"}
                    </small>
                  </div>
                </div>
                <span className="col-amount muted-dash">—</span>
                <span className="col-amount credit-val">{formatIDR(amount)}</span>
              </div>

              {/* Journal Balance Footer */}
              <div className="journal-row journal-footer">
                <span className="col-account total-label">
                  <b>Total Keseimbangan Jurnal</b>
                </span>
                <span className="col-amount total-val">{formatIDR(amount)}</span>
                <span className="col-amount total-val">{formatIDR(amount)}</span>
              </div>
            </div>

            {/* Audit Notes */}
            <div className="journal-audit-note">
              <HugeiconsIcon icon={InformationCircleIcon} size={16} strokeWidth={2} />
              <span>
                {isCreditContact ? (
                  <>
                    Transaksi mencatat <b>Kewajiban Tempo</b> pada kontak rekanan. Saldo buku pembantu
                    akan tersinkronisasi otomatis pada modul <b>Hutang/Piutang</b>.
                  </>
                ) : (
                  <>
                    Transaksi tunai/bank langsung memotong saldo kas likuid <b>{account}</b> dan
                    memperbarui laporan <b>Laba Rugi (P&amp;L)</b> proyek.
                  </>
                )}
              </span>
            </div>
          </aside>
        </div>

        <div className="modal-actions">
          <button className="text-button" onClick={close} type="button">
            Batal
          </button>
          {transaction.status === "DRAFT" && (
            <button
              className="secondary-button"
              disabled={!valid}
              onClick={() => handleSend(false)}
              type="button"
            >
              Simpan sebagai Draft
            </button>
          )}
          <button
            className="primary-button"
            disabled={!valid}
            onClick={() => handleSend(true)}
            type="button"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={2.2} />
            <span>Perbarui &amp; Posting Transaksi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
