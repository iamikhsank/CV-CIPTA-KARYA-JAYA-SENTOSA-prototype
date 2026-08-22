"use client";

import { useId, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDownRight01Icon from "@hugeicons/core-free-icons/ArrowDownRight01Icon";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";
import ArrowDataTransferHorizontalIcon from "@hugeicons/core-free-icons/ArrowDataTransferHorizontalIcon";
import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
import Invoice03Icon from "@hugeicons/core-free-icons/Invoice03Icon";
import PackageIcon from "@hugeicons/core-free-icons/PackageIcon";
import { formatIDR } from "../data";
import { SmartCurrencyInput } from "./SmartCurrencyInput";
import type { Transaction } from "../types";

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
  // Match 5-2000 series accounts or keywords
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

export function NewTransactionModal({
  close,
  submit,
}: {
  close: () => void;
  submit: (tx: Omit<Transaction, "id" | "date">, post: boolean) => void;
}) {
  const [type, setType] = useState<"Income" | "Expense" | "Transfer">("Expense");
  const [scope, setScope] = useState<"Project" | "Corporate">("Project");
  const [project, setProject] = useState("Hotel Gamelan");
  const [category, setCategory] = useState("5-2104 BESI BETON, Wmesh & Bondek");
  const [account, setAccount] = useState("1-1400 Rekening Giro Anton");
  const [contact, setContact] = useState('H002 - "SATRIA Leveransir" (Hutang Vendor)');
  const [description, setDescription] = useState("Pembelian Besi Beton Proyek Gamelan");
  const [amount, setAmount] = useState(10000000);
  const [txDate, setTxDate] = useState("2026-08-20");
  const [materialVolume, setMaterialVolume] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [notes, setNotes] = useState("");

  const scopeId = useId();
  const projectId = useId();
  const categoryId = useId();
  const accountId = useId();
  const contactId = useId();
  const descId = useId();
  const amountId = useId();
  const dateId = useId();
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
    submit(
      {
        type,
        project: scope === "Corporate" ? "Corporate" : project,
        category,
        account,
        contact,
        description,
        amount,
        status: post ? "POSTED" : "DRAFT",
        materialVolume: isMaterial && materialVolume.trim() ? materialVolume.trim() : undefined,
        dueDate: dueDate ? dueDate : undefined,
        referenceNo: referenceNo.trim() ? referenceNo.trim() : undefined,
        notes: notes.trim() ? notes.trim() : undefined,
      },
      post
    );
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card transaction-modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">NEW TRANSACTION</span>
            <h2 id="modal-title">Record Financial Transaction</h2>
            <p>Pencatatan transaksi akuntansi proyek sesuai standar buku besar CKJS.</p>
          </div>
          <button onClick={close} aria-label="Tutup modal" type="button">
            ×
          </button>
        </div>

        <div className="transaction-type">
          {(["Income", "Expense", "Transfer"] as const).map((item) => (
            <button
              className={type === item ? "active" : ""}
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
                <b>{item === "Income" ? "Pemasukan (Income)" : item === "Expense" ? "Pengeluaran (Expense)" : "Transfer Dana"}</b>
                <small>
                  {item === "Income"
                    ? "Penerimaan termin klien / pendapatan"
                    : item === "Expense"
                    ? "Beban material, upah & operasional"
                    : "Pindah buku antar kas & bank"}
                </small>
              </span>
            </button>
          ))}
        </div>

        <div className="modal-body">
          <div className="form-section">
            <h3>Detail Transaksi</h3>
            <div className="form-grid">
              <fieldset className="full allocation-field">
                <legend id={scopeId}>Alokasi Beban / Ruang Lingkup</legend>
                <div className="segmented" role="group" aria-labelledby={scopeId}>
                  <button
                    className={scope === "Project" ? "active" : ""}
                    onClick={() => setScope("Project")}
                    type="button"
                  >
                    Project Context (Beban Proyek)
                  </button>
                  <button
                    className={scope === "Corporate" ? "active" : ""}
                    onClick={() => setScope("Corporate")}
                    type="button"
                  >
                    Corporate / Kantor Pusat
                  </button>
                </div>
              </fieldset>

              {scope === "Project" && (
                <label htmlFor={projectId}>
                  Proyek
                  <select id={projectId} value={project} onChange={(e) => setProject(e.target.value)}>
                    {projectOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label htmlFor={categoryId}>
                {type === "Income" ? "Kategori Pendapatan (COA)" : "Kategori Beban (COA 5xxx / 6xxx)"}
                <select id={categoryId} value={category} onChange={(e) => setCategory(e.target.value)}>
                  {(type === "Income" ? incomeCategories : expenseCategories).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor={accountId}>
                Pos Rekening Kas / Bank
                <select id={accountId} value={account} onChange={(e) => setAccount(e.target.value)}>
                  {cashAccountOptions.map((acc) => (
                    <option key={acc} value={acc}>
                      {acc}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor={contactId}>
                {type === "Income" ? "Klien / Sumber Dana" : "Rekanan / Kode Bantu (Vendor/Subkon/Karyawan)"}
                <select id={contactId} value={contact} onChange={(e) => setContact(e.target.value)}>
                  {contactOptions.map((cnt) => (
                    <option key={cnt} value={cnt}>
                      {cnt}
                    </option>
                  ))}
                </select>
              </label>

              {/* Tahap 1 Peningkatan 1: Input Volume Material (Untuk Akun 5-2100 s/d 5-2220) */}
              {isMaterial && (
                <label htmlFor={volumeId} className="full highlight-field">
                  <span className="field-label-wrap">
                    <HugeiconsIcon icon={PackageIcon} size={15} strokeWidth={2} />
                    <b>Volume Material (Satuan/Kuantitas)</b>
                    <small className="badge-pill">Akun Biaya Material 5-2xxx</small>
                  </span>
                  <input
                    id={volumeId}
                    placeholder="Contoh: 125 m3, 450 btg, 200 sak semen, 80 m2"
                    value={materialVolume}
                    onChange={(e) => setMaterialVolume(e.target.value)}
                  />
                  <span className="field-hint">
                    Menyimpan volume fisik material untuk sinkronisasi kolom Volume Material pada Jurnal Excel.
                  </span>
                </label>
              )}

              {/* Tahap 1 Peningkatan 2: Input Tanggal Jatuh Tempo (Untuk Rekanan Kode Bantu Hutang/Piutang) */}
              <label htmlFor={dueDateId} className={isCreditContact ? "highlight-field" : ""}>
                <span className="field-label-wrap">
                  <HugeiconsIcon icon={Calendar03Icon} size={15} strokeWidth={2} />
                  <b>Tanggal Jatuh Tempo</b>
                  {isCreditContact && <small className="badge-pill warn">Kode Bantu Hutang/Piutang</small>}
                </span>
                <input
                  id={dueDateId}
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <span className="field-hint">
                  {isCreditContact
                    ? "Wajib dicatat untuk pelacakan umur piutang/hutang pada sub-ledger AP/AR."
                    : "Opsional untuk transaksi tempo."}
                </span>
              </label>

              <label htmlFor={refId}>
                No. Bukti / Invoice / Bilyet Giro
                <input
                  id={refId}
                  placeholder="Contoh: BKT-001, INV-2026/08/01"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                />
              </label>

              <label htmlFor={descId} className="full">
                Keterangan Transaksi
                <input
                  id={descId}
                  placeholder="Deskripsi ringkas mutasi keuangan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>

              <label htmlFor={amountId}>
                Nominal Transaksi (IDR)
                <SmartCurrencyInput id={amountId} value={amount} onChange={setAmount} min={1} />
              </label>

              <label htmlFor={dateId}>
                Tanggal Transaksi
                <input id={dateId} type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} />
              </label>

              <label htmlFor={notesId} className="full">
                Catatan Tambahan &amp; Memo
                <textarea
                  id={notesId}
                  placeholder="Catatan tambahan untuk rekonsiliasi audit internal..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>
            </div>
          </div>

          <aside className="journal-preview" aria-label="Pratinjau Jurnal Otomatis">
            <div className="journal-head">
              <div>
                <h3>Automatic Journal Preview</h3>
                <p>Pratinjau ayat jurnal berimbang otomatis</p>
              </div>
              <span className={valid ? "balanced" : "unbalanced"}>
                {valid ? "✓ BALANCED" : "PERIKSA INPUT"}
              </span>
            </div>

            <div className="journal-lines">
              <div className="journal-label">
                <span>Akun Jurnal</span>
                <span>Debit</span>
                <span>Kredit</span>
              </div>
              <div>
                <span>
                  <b>{debitAccount}</b>
                  <small>{scope === "Project" ? project : "Corporate Overhead"}</small>
                </span>
                <strong>{formatIDR(amount)}</strong>
                <strong>—</strong>
              </div>
              <div>
                <span>
                  <b>{creditAccount}</b>
                  <small>{type === "Expense" ? account : contact}</small>
                </span>
                <strong>—</strong>
                <strong>{formatIDR(amount)}</strong>
              </div>
            </div>

            <div className="journal-total">
              <span>Total Debit / Kredit</span>
              <strong>{formatIDR(amount)}</strong>
              <strong>{formatIDR(amount)}</strong>
            </div>

            {(materialVolume || dueDate) && (
              <div className="journal-metadata-summary">
                {materialVolume && (
                  <div>
                    <HugeiconsIcon icon={PackageIcon} size={14} strokeWidth={2} />
                    <span>Vol: <b>{materialVolume}</b></span>
                  </div>
                )}
                {dueDate && (
                  <div>
                    <HugeiconsIcon icon={Calendar03Icon} size={14} strokeWidth={2} />
                    <span>Tempo: <b>{dueDate}</b></span>
                  </div>
                )}
              </div>
            )}

            <div className="journal-rule">
              <i>
                <HugeiconsIcon icon={InformationCircleIcon} size={15} strokeWidth={2} />
              </i>
              <p>
                Sistem secara otomatis mengkonstruksi jurnal <i>double-entry</i> yang seimbang dan siap audit. Transaksi hanya dapat diposting bila status valid.
              </p>
            </div>
          </aside>
        </div>

        <div className="modal-actions">
          <button className="text-button" onClick={close} type="button">
            Batal
          </button>
          <button className="secondary-button" disabled={!valid} onClick={() => handleSend(false)} type="button">
            Simpan sebagai Draft
          </button>
          <button className="primary-button" disabled={!valid} onClick={() => handleSend(true)} type="button">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={2.2} />
            <span>Posting Transaksi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
