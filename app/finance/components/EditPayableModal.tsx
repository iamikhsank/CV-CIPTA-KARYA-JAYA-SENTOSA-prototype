"use client";

import { useId, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
import { formatIDR } from "../data";
import { EntityAvatar } from "./TableSuite";
import { SmartCurrencyInput } from "./SmartCurrencyInput";
import { StatusBadge } from "./ui";
import type { LedgerRecord } from "../types";

const defaultVendors = [
  "UD Sinar Baja",
  "PT Beton Perkasa",
  "PT Holcim Indonesia",
  "CV Mandor Abadi",
  "UD Cahaya Terang",
  "PT Tiga Roda Semen",
  "UD Kayu Lestari",
];

const defaultProjects = [
  "Hotel Gamelan",
  "Villa Ubud",
  "Warehouse Cikande",
  "Corporate / Kantor Pusat",
];

const expenseCategories = [
  "5-1101 · Biaya Material Konstruksi",
  "5-1201 · Biaya Upah & Mandor Proyek",
  "5-2104 · BESI BETON, Wmesh & Bondek",
  "5-2110 · Semen PC & Perekat Hebel",
  "5-2120 · Ready Mix Beton & Sewa Pompa",
  "5-2121 · Bekisting & Kayu Proyek",
  "6-1001 · Beban Kantor & Operasional",
];

export function EditPayableModal({
  record,
  close,
  submit,
  projectsList,
  existingVendors,
}: {
  record: LedgerRecord;
  close: () => void;
  submit: (updatedRecord: LedgerRecord) => void;
  projectsList?: string[];
  existingVendors?: string[];
}) {
  const availableProjects = projectsList && projectsList.length > 0 ? projectsList : defaultProjects;
  const availableVendors = existingVendors && existingVendors.length > 0 ? existingVendors : defaultVendors;

  const [ref, setRef] = useState(record.ref);
  const [party, setParty] = useState(record.party);
  const [project, setProject] = useState(record.project);
  const [category, setCategory] = useState(expenseCategories[0] || "5-1101 · Biaya Material Konstruksi");
  const [total, setTotal] = useState(record.total);
  const [due, setDue] = useState(record.due);
  const [description, setDescription] = useState("");
  const [poRef, setPoRef] = useState("");

  const refId = useId();
  const partyId = useId();
  const projectId = useId();
  const categoryId = useId();
  const totalId = useId();
  const dueId = useId();
  const descId = useId();
  const poId = useId();

  // Quick Terms of Payment handler
  const setQuickDueDays = (days: number) => {
    const base = new Date();
    base.setDate(base.getDate() + days);
    setDue(base.toISOString().slice(0, 10));
  };

  const paid = record.paid || 0;
  const outstanding = Math.max(0, total - paid);
  const computedStatus = paid >= total ? "PAID" : paid > 0 ? "PARTIAL" : "OUTSTANDING";

  // Calculate days until due
  const today = new Date().toISOString().slice(0, 10);
  const daysDiff = Math.ceil((new Date(due).getTime() - new Date(today).getTime()) / (1000 * 3600 * 24));

  const isValid = total >= paid && total > 0 && party.trim().length >= 2 && ref.trim().length >= 3 && due.length >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const updatedRecord: LedgerRecord = {
      ...record,
      ref: ref.trim(),
      party: party.trim(),
      project: project.trim(),
      total: Number(total),
      paid,
      due,
      status: computedStatus,
    };

    submit(updatedRecord);
    close();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="edit-payable-modal-title">
      <div className="modal-card transaction-modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">EDIT ACCOUNTS PAYABLE · PERUBAHAN HUTANG USAHA</span>
            <h2 id="edit-payable-modal-title">Edit Tagihan Hutang: {record.ref}</h2>
            <p>Pembaruan rincian tagihan vendor, termin pembayaran, alokasi proyek, dan batas jatuh tempo.</p>
          </div>
          <button onClick={close} aria-label="Tutup modal" type="button">
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Left Column: Form Grid */}
            <div className="form-section">
              <div className="form-grid">
                <label htmlFor={refId}>
                  <span className="field-label-text">
                    <span>
                      Nomor Dokumen / Invoice <span className="req-star">*</span>
                    </span>
                    <span className="field-hint">No. Faktur Tagihan</span>
                  </span>
                  <input
                    id={refId}
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    placeholder="Contoh: INV-2026-0089 atau TAG-SB-04"
                    required
                  />
                </label>

                <label htmlFor={projectId}>
                  <span className="field-label-text">
                    <span>Alokasi Proyek</span>
                  </span>
                  <select id={projectId} value={project} onChange={(e) => setProject(e.target.value)}>
                    {availableProjects.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>

                <label htmlFor={partyId} className="full">
                  <span className="field-label-text">
                    <span>
                      Rekanan Vendor / Supplier <span className="req-star">*</span>
                    </span>
                  </span>
                  <input
                    id={partyId}
                    list="edit-vendor-suggestions"
                    value={party}
                    onChange={(e) => setParty(e.target.value)}
                    placeholder="Nama Vendor / Supplier / Mandor"
                    required
                  />
                  <datalist id="edit-vendor-suggestions">
                    {availableVendors.map((v) => (
                      <option key={v} value={v} />
                    ))}
                  </datalist>
                </label>

                <label htmlFor={categoryId} className="full">
                  <span className="field-label-text">
                    <span>Pos Kategori Beban (COA)</span>
                    <span className="field-hint">Akun Buku Besar Terkait</span>
                  </span>
                  <select id={categoryId} value={category} onChange={(e) => setCategory(e.target.value)}>
                    {expenseCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>

                <label htmlFor={totalId} className="full">
                  <span className="field-label-text">
                    <span>
                      Nilai Total Tagihan <span className="req-star">*</span>
                    </span>
                    {paid > 0 && <span className="field-hint">Minimal {formatIDR(paid)} (sudah terbayar)</span>}
                  </span>
                  <div className="currency-input-wrap">
                    <span className="currency-prefix">Rp</span>
                    <SmartCurrencyInput
                      id={totalId}
                      value={total}
                      onChange={setTotal}
                      min={paid || 1}
                    />
                  </div>
                </label>

                <label htmlFor={dueId} className="full">
                  <span className="field-label-text">
                    <span>
                      Batas Jatuh Tempo Pembayaran <span className="req-star">*</span>
                    </span>
                  </span>
                  <input
                    id={dueId}
                    type="date"
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                    required
                  />
                </label>

                {/* Quick TOP Terms Selector */}
                <div className="full" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginTop: "-4px" }}>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 500 }}>Ubah Tempo (TOP):</span>
                  {[
                    { label: "Net 7", days: 7 },
                    { label: "Net 14", days: 14 },
                    { label: "Net 30", days: 30 },
                    { label: "Net 45", days: 45 },
                    { label: "Net 60", days: 60 },
                  ].map((top) => (
                    <button
                      key={top.label}
                      type="button"
                      className="text-button"
                      style={{
                        padding: "3px 8px",
                        fontSize: "11px",
                        borderRadius: "4px",
                        background: "var(--surface-muted, #f8fafc)",
                        color: "var(--ink)",
                        border: "1px solid var(--line)",
                        fontWeight: 500,
                      }}
                      onClick={() => setQuickDueDays(top.days)}
                    >
                      +{top.label}
                    </button>
                  ))}
                </div>

                <label htmlFor={poId}>
                  <span className="field-label-text">
                    <span>No. PO / Surat Jalan</span>
                  </span>
                  <input
                    id={poId}
                    value={poRef}
                    onChange={(e) => setPoRef(e.target.value)}
                    placeholder="PO-2026-0042 / SJ-8891"
                  />
                </label>

                <label htmlFor={descId}>
                  <span className="field-label-text">
                    <span>Rincian Pekerjaan / Material</span>
                  </span>
                  <input
                    id={descId}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Contoh: Pengadaan Besi Beton Ulir 16mm"
                  />
                </label>
              </div>
            </div>

            {/* Right Column: Payables Liability Preview */}
            <aside className="journal-preview" aria-label="Pratinjau Kewajiban Hutang">
              <div className="journal-head">
                <div>
                  <h3>Pratinjau Data Tagihan</h3>
                  <p>Validasi jadwal pembayaran dan arus kas proyek</p>
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
                <EntityAvatar name={party || "Vendor"} size={40} />
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
                    {party || "Nama Vendor Belum Diisi"}
                  </strong>
                  <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginTop: "2px" }}>
                    {ref} · {project}
                  </span>
                </div>
                <StatusBadge status={computedStatus} />
              </div>

              {/* Parameter Analysis Table */}
              <div className="project-financial-analysis-box">
                <div className="analysis-row header-row">
                  <span className="col-label">Parameter Hutang</span>
                  <span className="col-val">Nilai & Ketentuan</span>
                </div>

                <div className="analysis-row item-row">
                  <div className="param-meta">
                    <b className="param-title">Total Tagihan Bruto</b>
                    <small className="param-sub">Kewajiban Pokok</small>
                  </div>
                  <span className="col-val font-bold text-ink" style={{ fontSize: "14px", color: "#e11d48" }}>
                    {formatIDR(total)}
                  </span>
                </div>

                {paid > 0 && (
                  <div className="analysis-row item-row">
                    <div className="param-meta">
                      <b className="param-title">Sudah Dibayar (Paid)</b>
                      <small className="param-sub">Realisasi Kas Keluar</small>
                    </div>
                    <span className="col-val font-bold text-green">
                      {formatIDR(paid)}
                    </span>
                  </div>
                )}

                <div className="analysis-row item-row">
                  <div className="param-meta">
                    <b className="param-title">Sisa Hutang (Outstanding)</b>
                    <small className="param-sub">Wajib Dilunasi</small>
                  </div>
                  <span className={`col-val font-bold ${outstanding > 0 ? "text-amber" : "text-green"}`}>
                    {formatIDR(outstanding)}
                  </span>
                </div>

                <div className="analysis-row item-row">
                  <div className="param-meta">
                    <b className="param-title">Batas Jatuh Tempo</b>
                    <small className="param-sub">Target Pembayaran</small>
                  </div>
                  <span className="col-val font-bold text-ink">
                    {due} {daysDiff > 0 ? `(${daysDiff} hari)` : daysDiff === 0 ? "(Hari Ini)" : "(Lewat Tempo)"}
                  </span>
                </div>

                <div className="analysis-row item-row">
                  <div className="param-meta">
                    <b className="param-title">Alokasi Biaya Proyek</b>
                    <small className="param-sub">Cost Center Proyek</small>
                  </div>
                  <span className="col-val font-bold text-ink">{project}</span>
                </div>

                <div className="analysis-row footer-row">
                  <div className="param-meta">
                    <b className="param-title">Status Tagihan</b>
                    <small className="param-sub">Buku Pembantu Hutang</small>
                  </div>
                  <span className="col-val">
                    <StatusBadge status={computedStatus} />
                  </span>
                </div>
              </div>

              <div className="journal-audit-note">
                <HugeiconsIcon icon={InformationCircleIcon} size={16} strokeWidth={2} />
                <span>
                  Perubahan data tagihan akan secara otomatis memperbarui Buku Pembantu Hutang (AP) dan mempengaruhi
                  analisis serapan biaya proyek terkait.
                </span>
              </div>
            </aside>
          </div>

          <div className="modal-actions">
            <button className="text-button" onClick={close} type="button">
              Batal
            </button>
            <button className="primary-button" disabled={!isValid} type="submit">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={2.2} />
              <span>Simpan Perubahan Tagihan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
