"use client";

import { useId, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Book01Icon from "@hugeicons/core-free-icons/Book01Icon";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
import Tag01Icon from "@hugeicons/core-free-icons/Tag01Icon";
import UserIcon from "@hugeicons/core-free-icons/UserIcon";
import { EntityAvatar } from "./TableSuite";
import { StatusBadge } from "./ui";

export type MasterRecordType = "COA" | "CONTACT" | "CATEGORY";

export interface MasterRecordData {
  type: MasterRecordType;
  row: string[];
}

const coaClassifications = [
  { value: "ASSET", label: "Aset / Harta (1-0000)" },
  { value: "LIABILITY", label: "Liabilitas / Kewajiban (2-0000)" },
  { value: "EQUITY", label: "Ekuitas / Modal (3-0000)" },
  { value: "REVENUE", label: "Pendapatan / Omset (4-0000)" },
  { value: "EXPENSE", label: "Beban & Biaya Operasional (5-0000 & 6-0000)" },
];

const coaSubheaders = [
  "Cash & Bank",
  "Petty Cash",
  "Accounts Receivable",
  "Inventory & Material",
  "Fixed Assets",
  "Accounts Payable",
  "Owner Equity",
  "Project Revenue",
  "Direct Cost",
  "Corporate Expense",
];

const contactTypes = [
  { value: "CLIENT", label: "Klien / Pemberi Kerja" },
  { value: "VENDOR", label: "Vendor Material / Supplier" },
  { value: "SUBCONTRACTOR", label: "Mandor / Subkontraktor" },
  { value: "EMPLOYEE", label: "Karyawan / Personil" },
];

const categoryTypes = [
  { value: "EXPENSE", label: "Beban Pengeluaran (Expense)" },
  { value: "INCOME", label: "Pendapatan Proyek (Income)" },
  { value: "TRANSFER", label: "Transfer Antar Kas (Transfer)" },
];

const coaListOptions = [
  "1-1101 · Bank Operasional BCA",
  "1-1201 · Kas Proyek",
  "1-1400 · Rekening Giro Anton",
  "4-1001 · Pendapatan Termin",
  "4-2000 · Pendapatan Lain-lain",
  "5-1000 · Biaya Upah Pekerja",
  "5-1101 · Biaya Material",
  "5-2104 · BESI BETON, Wmesh & Bondek",
  "6-1001 · Beban Kantor",
  "6-3000 · Biaya Operasional Direksi",
];

export function MasterEditModal({
  data,
  close,
  submit,
}: {
  data: MasterRecordData;
  close: () => void;
  submit: (updatedRow: string[]) => void;
}) {
  const { type, row } = data;

  // COA State
  const [coaCode, setCoaCode] = useState(row[0] || "");
  const [coaName, setCoaName] = useState(row[1] || "");
  const [coaClass, setCoaClass] = useState(row[2] || "ASSET");
  const [coaSubheader, setCoaSubheader] = useState(row[3] || "Cash & Bank");
  const [coaScope, setCoaScope] = useState(row[4] || "Corporate");

  // Contact State
  const [contactName, setContactName] = useState(row[0] || "");
  const [contactType, setContactType] = useState(row[1] || "CLIENT");
  const [contactProject, setContactProject] = useState(row[2] || "Hotel Gamelan");
  const [contactBalance, setContactBalance] = useState(row[3] || "Rp 0");
  const [contactPhone, setContactPhone] = useState("0812-8899-7700");
  const [contactEmail, setContactEmail] = useState("admin@mitra.co.id");
  const [contactPic, setContactPic] = useState("Bambang Hermanto");

  // Category State
  const [catName, setCatName] = useState(row[0] || "");
  const [catType, setCatType] = useState(row[1] || "EXPENSE");
  const [catCoa, setCatCoa] = useState(row[2] || "5-1101 · Biaya Material");
  const [catScope, setCatScope] = useState(row[3] || "Project");

  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  const codeId = useId();
  const nameId = useId();
  const classId = useId();
  const subheaderId = useId();
  const scopeId = useId();
  const statusId = useId();
  const phoneId = useId();
  const emailId = useId();
  const picId = useId();
  const coaLinkId = useId();

  const handleSave = () => {
    if (type === "COA") {
      submit([coaCode, coaName.trim(), coaClass, coaSubheader, coaScope]);
    } else if (type === "CONTACT") {
      submit([contactName.trim(), contactType, contactProject, contactBalance]);
    } else {
      submit([catName.trim(), catType, catCoa, catScope]);
    }
  };

  const modalTitle =
    type === "COA"
      ? "Edit Akun Bagan (COA)"
      : type === "CONTACT"
      ? "Edit Rekanan Kontak"
      : "Edit Kategori Transaksi";

  const modalSubtitle =
    type === "COA"
      ? "Perbarui nama akun, klasifikasi neraca, dan alokasi entitas buku besar."
      : type === "CONTACT"
      ? "Perbarui identitas rekanan, jenis relasi, narahubung PIC, dan proyek terkait."
      : "Perbarui pengelompokan transaksi dan pemetaan akun COA otomatis.";

  const displayName =
    type === "COA" ? coaName : type === "CONTACT" ? contactName : catName;

  const displaySubtitle =
    type === "COA"
      ? `${coaCode} · ${coaClass} · ${coaScope}`
      : type === "CONTACT"
      ? `${contactType} · ${contactProject}`
      : `${catType} · ${catScope}`;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="master-edit-title">
      <div className="modal-card transaction-modal master-edit-modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">
              MASTER DATA · {type === "COA" ? coaCode : type === "CONTACT" ? contactType : catType}
            </span>
            <h2 id="master-edit-title">{modalTitle}</h2>
            <p>{modalSubtitle}</p>
          </div>
          <button onClick={close} aria-label="Tutup modal" type="button">
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="modal-body">
          {/* Form Fields Section */}
          <div className="form-section">
            <div className="form-grid">
              {type === "COA" && (
                <>
                  <label htmlFor={codeId}>
                    <span className="field-label-text">
                      <span>Nomor / Kode Akun</span>
                      <span className="field-badge-locked">Terkunci (Permanen)</span>
                    </span>
                    <input
                      id={codeId}
                      value={coaCode}
                      disabled
                      style={{ background: "var(--surface-muted, #f8fafc)", fontWeight: 600, color: "var(--ink)" }}
                    />
                  </label>

                  <label htmlFor={classId}>
                    <span className="field-label-text">
                      <span>Klasifikasi Akuntansi</span>
                      <span className="field-hint">Standar Akuntansi</span>
                    </span>
                    <select
                      id={classId}
                      value={coaClass}
                      onChange={(e) => setCoaClass(e.target.value)}
                    >
                      {coaClassifications.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label htmlFor={nameId} className="full">
                    <span className="field-label-text">
                      <span>
                        Nama Akun Buku Besar <span className="req-star">*</span>
                      </span>
                    </span>
                    <input
                      id={nameId}
                      value={coaName}
                      onChange={(e) => setCoaName(e.target.value)}
                      placeholder="Contoh: Bank Mandiri Giro Operasional"
                      required
                    />
                  </label>

                  <label htmlFor={subheaderId}>
                    <span className="field-label-text">
                      <span>Sub-Kategori / Kelompok</span>
                    </span>
                    <select
                      id={subheaderId}
                      value={coaSubheader}
                      onChange={(e) => setCoaSubheader(e.target.value)}
                    >
                      {coaSubheaders.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label htmlFor={scopeId}>
                    <span className="field-label-text">
                      <span>Lingkup Entitas</span>
                    </span>
                    <select
                      id={scopeId}
                      value={coaScope}
                      onChange={(e) => setCoaScope(e.target.value)}
                    >
                      <option value="Corporate">Corporate / Kantor Pusat</option>
                      <option value="Project">Project Level (Beban Proyek)</option>
                    </select>
                  </label>
                </>
              )}

              {type === "CONTACT" && (
                <>
                  <label htmlFor={nameId} className="full">
                    <span className="field-label-text">
                      <span>
                        Nama Rekanan / Perusahaan <span className="req-star">*</span>
                      </span>
                    </span>
                    <input
                      id={nameId}
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Contoh: PT Semen Tiga Roda"
                      required
                    />
                  </label>

                  <label htmlFor={classId}>
                    <span className="field-label-text">
                      <span>Jenis Relasi Bisnis</span>
                    </span>
                    <select
                      id={classId}
                      value={contactType}
                      onChange={(e) => setContactType(e.target.value)}
                    >
                      {contactTypes.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label htmlFor={scopeId}>
                    <span className="field-label-text">
                      <span>Proyek Terkait</span>
                    </span>
                    <select
                      id={scopeId}
                      value={contactProject}
                      onChange={(e) => setContactProject(e.target.value)}
                    >
                      <option value="Hotel Gamelan">Hotel Gamelan</option>
                      <option value="Villa Ubud">Villa Ubud</option>
                      <option value="Warehouse Cikande">Warehouse Cikande</option>
                      <option value="Corporate">Corporate / Umum</option>
                    </select>
                  </label>

                  <label htmlFor={picId}>
                    <span className="field-label-text">
                      <span>Nama PIC / Narahubung</span>
                    </span>
                    <input
                      id={picId}
                      value={contactPic}
                      onChange={(e) => setContactPic(e.target.value)}
                      placeholder="Nama PIC proyek"
                    />
                  </label>

                  <label htmlFor={phoneId}>
                    <span className="field-label-text">
                      <span>No. Telepon / WhatsApp</span>
                    </span>
                    <input
                      id={phoneId}
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                    />
                  </label>

                  <label htmlFor={emailId} className="full">
                    <span className="field-label-text">
                      <span>Email Resmi Rekanan</span>
                    </span>
                    <input
                      id={emailId}
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="finance@vendor.co.id"
                    />
                  </label>
                </>
              )}

              {type === "CATEGORY" && (
                <>
                  <label htmlFor={nameId} className="full">
                    <span className="field-label-text">
                      <span>
                        Nama Kategori Transaksi <span className="req-star">*</span>
                      </span>
                    </span>
                    <input
                      id={nameId}
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      placeholder="Contoh: Biaya Material Baja & Besi"
                      required
                    />
                  </label>

                  <label htmlFor={classId}>
                    <span className="field-label-text">
                      <span>Arah Aliran Dana</span>
                    </span>
                    <select
                      id={classId}
                      value={catType}
                      onChange={(e) => setCatType(e.target.value)}
                    >
                      {categoryTypes.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label htmlFor={scopeId}>
                    <span className="field-label-text">
                      <span>Lingkup Alokasi</span>
                    </span>
                    <select
                      id={scopeId}
                      value={catScope}
                      onChange={(e) => setCatScope(e.target.value)}
                    >
                      <option value="Project">Project (Beban Proyek)</option>
                      <option value="Corporate">Corporate (Beban Umum Kantor)</option>
                    </select>
                  </label>

                  <label htmlFor={coaLinkId} className="full">
                    <span className="field-label-text">
                      <span>Pemetaan Akun Bagan (COA)</span>
                      <span className="field-hint">Akun Buku Besar Terkait</span>
                    </span>
                    <select
                      id={coaLinkId}
                      value={catCoa}
                      onChange={(e) => setCatCoa(e.target.value)}
                    >
                      {coaListOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}

              <label htmlFor={statusId} className="full">
                <span className="field-label-text">
                  <span>Status Master Data</span>
                  <span className="field-hint">Kontrol Sistem</span>
                </span>
                <select
                  id={statusId}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                >
                  <option value="ACTIVE">ACTIVE — Tersedia pada pilihan dropdown transaksi</option>
                  <option value="INACTIVE">INACTIVE — Dinonaktifkan sementara dari input transaksi baru</option>
                </select>
              </label>
            </div>
          </div>

          {/* Right Column: Master Data Preview Card */}
          <aside className="journal-preview" aria-label="Pratinjau Master Data">
            <div className="journal-head">
              <div>
                <h3>Pratinjau Data Master</h3>
                <p>Validasi hierarki relasi data dan konsistensi sistem pembukuan</p>
              </div>
              <span className="balanced">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2.2} />
                TERVALIDASI
              </span>
            </div>

            {/* Entity Monogram Identity Card */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                background: "var(--surface-muted, #f8fafc)",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                marginBottom: "12px",
              }}
            >
              <EntityAvatar
                name={displayName || "Data Master"}
                code={type === "COA" ? coaCode : undefined}
                size={40}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <strong
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 700,
                    color: "var(--ink)",
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {displayName}
                </strong>
                <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginTop: "2px" }}>
                  {displaySubtitle}
                </span>
              </div>
              <StatusBadge status={status} />
            </div>

            {/* Parameter Analysis Table */}
            <div className="project-financial-analysis-box">
              <div className="analysis-row header-row">
                <span className="col-label">Parameter Master</span>
                <span className="col-val">Konfigurasi Sistem</span>
              </div>

              {type === "COA" && (
                <>
                  <div className="analysis-row item-row">
                    <div className="param-meta">
                      <b className="param-title">Klasifikasi Akuntansi</b>
                      <small className="param-sub">Laporan Neraca / Laba Rugi</small>
                    </div>
                    <span className="col-val">
                      <span className={`type-pill type-pill-${coaClass.toLowerCase()}`}>
                        {coaClass}
                      </span>
                    </span>
                  </div>

                  <div className="analysis-row item-row">
                    <div className="param-meta">
                      <b className="param-title">Sub-Kelompok Akun</b>
                      <small className="param-sub">Hierarki Buku Besar</small>
                    </div>
                    <span className="col-val font-bold text-ink">{coaSubheader}</span>
                  </div>

                  <div className="analysis-row item-row">
                    <div className="param-meta">
                      <b className="param-title">Alokasi Entitas</b>
                      <small className="param-sub">Pusat vs Lapangan Proyek</small>
                    </div>
                    <span className="col-val font-bold text-ink">{coaScope}</span>
                  </div>
                </>
              )}

              {type === "CONTACT" && (
                <>
                  <div className="analysis-row item-row">
                    <div className="param-meta">
                      <b className="param-title">Tipe Rekanan</b>
                      <small className="param-sub">Klasifikasi Bisnis</small>
                    </div>
                    <span className="col-val">
                      <span className={`type-pill type-pill-${contactType.toLowerCase()}`}>
                        {contactType}
                      </span>
                    </span>
                  </div>

                  <div className="analysis-row item-row">
                    <div className="param-meta">
                      <b className="param-title">Proyek Terkait</b>
                      <small className="param-sub">Afiliasi Biaya</small>
                    </div>
                    <span className="col-val font-bold text-ink">{contactProject}</span>
                  </div>

                  <div className="analysis-row item-row">
                    <div className="param-meta">
                      <b className="param-title">Narahubung PIC</b>
                      <small className="param-sub">Kontak Lapangan</small>
                    </div>
                    <span className="col-val font-bold text-ink">{contactPic || "—"}</span>
                  </div>

                  <div className="analysis-row item-row">
                    <div className="param-meta">
                      <b className="param-title">Saldo Buku Pembantu</b>
                      <small className="param-sub">Posisi Kewajiban / Piutang</small>
                    </div>
                    <span className="col-val font-bold text-ink">{contactBalance}</span>
                  </div>
                </>
              )}

              {type === "CATEGORY" && (
                <>
                  <div className="analysis-row item-row">
                    <div className="param-meta">
                      <b className="param-title">Tipe Transaksi</b>
                      <small className="param-sub">Arah Aliran Dana</small>
                    </div>
                    <span className="col-val">
                      <span className={`type-pill type-pill-${catType.toLowerCase()}`}>
                        {catType}
                      </span>
                    </span>
                  </div>

                  <div className="analysis-row item-row">
                    <div className="param-meta">
                      <b className="param-title">Akun Buku Besar</b>
                      <small className="param-sub">Pemetaan Jurnal Transaksi</small>
                    </div>
                    <span className="col-val font-bold text-ink" style={{ fontSize: "11.5px" }}>
                      {catCoa}
                    </span>
                  </div>

                  <div className="analysis-row item-row">
                    <div className="param-meta">
                      <b className="param-title">Lingkup Alokasi</b>
                      <small className="param-sub">Scope Pengeluaran</small>
                    </div>
                    <span className="col-val font-bold text-ink">{catScope}</span>
                  </div>
                </>
              )}

              <div className="analysis-row footer-row">
                <div className="param-meta">
                  <b className="param-title">Status Ketersediaan</b>
                  <small className="param-sub">Dropdown Pencatatan Transaksi</small>
                </div>
                <span className="col-val">
                  <StatusBadge status={status} />
                </span>
              </div>
            </div>

            <div className="journal-audit-note">
              <HugeiconsIcon icon={InformationCircleIcon} size={16} strokeWidth={2} />
              <span>
                {type === "COA"
                  ? "Pembaruan akun buku besar akan langsung tersinkronisasi pada filter laporan Laba Rugi, Neraca, dan Buku Kas."
                  : type === "CONTACT"
                  ? "Pembaruan data rekanan akan memutakhirkan buku pembantu Hutang/Piutang dan histori transaksi terkait."
                  : "Kategori transaksi memudahkan penginputan kasir dengan memetakan secara otomatis ke akun COA yang telah ditentukan."}
              </span>
            </div>
          </aside>
        </div>

        <div className="modal-actions">
          <button className="text-button" onClick={close} type="button">
            Batal
          </button>
          <button
            className="primary-button"
            onClick={handleSave}
            type="button"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={2.2} />
            <span>Simpan Perubahan Master Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
