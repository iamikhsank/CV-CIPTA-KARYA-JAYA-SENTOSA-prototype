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

const coaClassifications = [
  { value: "ASSET", label: "Aset / Harta (1-0000)", defaultPrefix: "1-1301" },
  { value: "LIABILITY", label: "Liabilitas / Kewajiban (2-0000)", defaultPrefix: "2-1101" },
  { value: "EQUITY", label: "Ekuitas / Modal (3-0000)", defaultPrefix: "3-1101" },
  { value: "REVENUE", label: "Pendapatan / Omset (4-0000)", defaultPrefix: "4-1101" },
  { value: "EXPENSE", label: "Beban & Biaya Operasional (5-0000 & 6-0000)", defaultPrefix: "5-1102" },
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

export function NewMasterModal({
  type,
  close,
  submit,
  existingCodes = [],
}: {
  type: MasterRecordType;
  close: () => void;
  submit: (newRow: string[]) => void;
  existingCodes?: string[];
}) {
  // COA State
  const [coaCode, setCoaCode] = useState("1-1301");
  const [coaName, setCoaName] = useState("");
  const [coaClass, setCoaClass] = useState("ASSET");
  const [coaSubheader, setCoaSubheader] = useState("Cash & Bank");
  const [coaScope, setCoaScope] = useState("Corporate");

  // Contact State
  const [contactName, setContactName] = useState("");
  const [contactType, setContactType] = useState("VENDOR");
  const [contactProject, setContactProject] = useState("Hotel Gamelan");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPic, setContactPic] = useState("");

  // Category State
  const [catName, setCatName] = useState("");
  const [catType, setCatType] = useState("EXPENSE");
  const [catCoa, setCatCoa] = useState("5-1101 · Biaya Material");
  const [catScope, setCatScope] = useState("Project");

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

  const handleClassChange = (selectedClass: string) => {
    setCoaClass(selectedClass);
    const preset = coaClassifications.find((c) => c.value === selectedClass);
    if (
      preset &&
      (!coaCode ||
        coaCode === "1-1301" ||
        coaCode.startsWith("1-") ||
        coaCode.startsWith("2-") ||
        coaCode.startsWith("3-") ||
        coaCode.startsWith("4-") ||
        coaCode.startsWith("5-"))
    ) {
      setCoaCode(preset.defaultPrefix);
    }
  };

  const isValid =
    type === "COA"
      ? coaCode.trim().length >= 3 && coaName.trim().length >= 3
      : type === "CONTACT"
      ? contactName.trim().length >= 3
      : catName.trim().length >= 3;

  const handleSave = () => {
    if (!isValid) return;
    if (type === "COA") {
      submit([coaCode.trim(), coaName.trim(), coaClass, coaSubheader, coaScope]);
    } else if (type === "CONTACT") {
      submit([contactName.trim(), contactType, contactProject, "Rp 0"]);
    } else {
      submit([catName.trim(), catType, catCoa, catScope]);
    }
  };

  const modalTitle =
    type === "COA"
      ? "Pendaftaran Akun Bagan Baru"
      : type === "CONTACT"
      ? "Pendaftaran Rekanan Baru"
      : "Tambah Kategori Transaksi";

  const modalSubtitle =
    type === "COA"
      ? "Registrasi kode akun buku besar, klasifikasi neraca, dan alokasi entitas."
      : type === "CONTACT"
      ? "Registrasi rekanan mitra usaha, klasifikasi relasi, dan personil narahubung."
      : "Registrasi klasifikasi pengeluaran/penerimaan dan pemetaan akun COA otomatis.";

  const displayName =
    type === "COA" ? coaName : type === "CONTACT" ? contactName : catName;

  const displaySubtitle =
    type === "COA"
      ? `${coaCode || "Kode COA"} · ${coaClass} · ${coaScope}`
      : type === "CONTACT"
      ? `${contactType} · ${contactProject}`
      : `${catType} · ${catScope}`;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="new-master-title">
      <div className="modal-card transaction-modal master-edit-modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">
              NEW MASTER RECORD · {type === "COA" ? "CHART OF ACCOUNTS" : type === "CONTACT" ? "CONTACTS" : "CATEGORIES"}
            </span>
            <h2 id="new-master-title">{modalTitle}</h2>
            <p>{modalSubtitle}</p>
          </div>
          <button onClick={close} aria-label="Tutup modal" type="button">
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="modal-body">
          {/* Left Column: Form Grid */}
          <div className="form-section">
            <div className="form-grid">
              {type === "COA" && (
                <>
                  <label htmlFor={codeId}>
                    <span className="field-label-text">
                      <span>
                        Nomor / Kode Akun <span className="req-star">*</span>
                      </span>
                      <span className="field-hint">Awalan otomatis</span>
                    </span>
                    <input
                      id={codeId}
                      value={coaCode}
                      onChange={(e) => setCoaCode(e.target.value)}
                      placeholder="Contoh: 1-1301"
                      required
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
                      onChange={(e) => handleClassChange(e.target.value)}
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
                      placeholder="Contoh: PT Varia Usaha Beton"
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
                      placeholder="Nama PIC rekanan"
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
                      placeholder="Contoh: Biaya Sewa Alat Berat & Scaffolding"
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
                  <option value="INACTIVE">INACTIVE — Dinonaktifkan sementara</option>
                </select>
              </label>
            </div>
          </div>

          {/* Right Column: Master Data Preview Card */}
          <aside className="journal-preview" aria-label="Pratinjau Master Data Baru">
            <div className="journal-head">
              <div>
                <h3>Pratinjau Data Master</h3>
                <p>Validasi hierarki relasi data dan konsistensi sistem pembukuan</p>
              </div>
              <span className="balanced">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2.2} />
                SIAP DIDAFTARKAN
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
                name={displayName || "Data Baru"}
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
                  {displayName || "Nama Belum Diisi"}
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
                  ? "Akun baru akan langsung tersedia pada formulir pencatatan jurnal transaksi dan buku besar CV. Cipta Karya Jaya Sentosa."
                  : type === "CONTACT"
                  ? "Rekanan baru akan langsung dapat dipilih pada pencatatan transaksi pembelian material dan pembayaran termin."
                  : "Kategori baru mempermudah staf kasir memilih klasifikasi pengeluaran tanpa perlu mengingat nomor akun COA."}
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
            disabled={!isValid}
            onClick={handleSave}
            type="button"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={2.2} />
            <span>
              Tambahkan {type === "COA" ? "Akun COA" : type === "CONTACT" ? "Rekanan Kontak" : "Kategori"} Baru
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
