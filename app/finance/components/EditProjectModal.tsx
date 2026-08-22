"use client";

import { useId, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
import { formatIDR } from "../data";
import type { Project } from "../types";
import { SmartCurrencyInput } from "./SmartCurrencyInput";
import { EntityAvatar } from "./TableSuite";
import { StatusBadge } from "./ui";

const presetColors = [
  { id: "#168b67", label: "Emerald Green", hex: "#168b67" },
  { id: "#2563eb", label: "Corporate Blue", hex: "#2563eb" },
  { id: "#d97706", label: "Warm Amber", hex: "#d97706" },
  { id: "#4f46e5", label: "Deep Indigo", hex: "#4f46e5" },
  { id: "#e11d48", label: "Crimson Rose", hex: "#e11d48" },
  { id: "#0891b2", label: "Cyan Teal", hex: "#0891b2" },
  { id: "#7c3aed", label: "Royal Purple", hex: "#7c3aed" },
];

export function EditProjectModal({
  project,
  close,
  submit,
  existingProjects = [],
}: {
  project: Project;
  close: () => void;
  submit: (project: Project) => void;
  existingProjects?: Project[];
}) {
  const codeId = useId();
  const nameId = useId();
  const clientId = useId();
  const revenueId = useId();
  const expenseId = useId();
  const startId = useId();
  const endId = useId();
  const statusId = useId();

  const existingClients = useMemo(() => {
    return Array.from(new Set(existingProjects.map((p) => p.client).filter(Boolean)));
  }, [existingProjects]);

  const [name, setName] = useState(project.name);
  const [client, setClient] = useState(project.client);
  const [revenue, setRevenue] = useState(project.revenue);
  const [expense, setExpense] = useState(project.expense);
  const [start, setStart] = useState(project.start);
  const [end, setEnd] = useState(project.end);
  const [status, setStatus] = useState(project.status);
  const [color, setColor] = useState(project.color || "#168b67");

  const isCustom = !presetColors.some((c) => c.hex.toLowerCase() === color.toLowerCase());

  // Real-time financial calculations
  const projectedProfit = revenue - expense;
  const marginPercentage = revenue > 0 ? ((projectedProfit / revenue) * 100).toFixed(1) : "0.0";
  const isValid = name.trim().length > 0 && client.trim().length > 0 && revenue > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const updatedProject: Project = {
      ...project,
      name: name.trim(),
      client: client.trim(),
      revenue: Number(revenue) || 0,
      expense: Number(expense) || 0,
      start,
      end,
      status,
      color,
    };

    submit(updatedProject);
    close();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="edit-project-modal-title">
      <div className="modal-card transaction-modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">EDIT PROYEK · {project.code}</span>
            <h2 id="edit-project-modal-title">Pembaruan Data & Anggaran Proyek</h2>
            <p>Perbarui parameter nilai kontrak, batas pagu anggaran (RAB), jadwal pelaksanaan, dan status proyek.</p>
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
                <label htmlFor={codeId}>
                  <span className="field-label-text">
                    <span>Kode Proyek</span>
                    <span className="field-badge-locked">Terkunci (Permanen)</span>
                  </span>
                  <input
                    id={codeId}
                    value={project.code}
                    disabled
                    readOnly
                    style={{ background: "#f1f5f9", cursor: "not-allowed", fontWeight: 600 }}
                  />
                </label>

                <label htmlFor={statusId}>
                  <span className="field-label-text">
                    <span>Status Pelaksanaan</span>
                  </span>
                  <select
                    id={statusId}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="ACTIVE">ACTIVE (Sedang Berjalan)</option>
                    <option value="PLANNING">PLANNING (Tahap Persiapan)</option>
                    <option value="COMPLETED">COMPLETED (Selesai)</option>
                  </select>
                </label>

                <label htmlFor={nameId} className="full">
                  <span className="field-label-text">
                    <span>
                      Nama Proyek / Pekerjaan <span className="req-star">*</span>
                    </span>
                  </span>
                  <input
                    id={nameId}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Pembangunan Ruko 3 Lantai Gatot Subroto"
                    required
                  />
                </label>

                <label htmlFor={clientId} className="full">
                  <span className="field-label-text">
                    <span>
                      Nama Klien / Pemilik Proyek <span className="req-star">*</span>
                    </span>
                  </span>
                  <input
                    id={clientId}
                    list="edit-client-suggestions"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Contoh: PT Bali Paradise Resort / Bpk. Wayan Sudarma"
                    required
                  />
                  <datalist id="edit-client-suggestions">
                    {existingClients.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </label>

                <label htmlFor={revenueId}>
                  <span className="field-label-text">
                    <span>
                      Nilai Kontrak Proyek (Revenue) <span className="req-star">*</span>
                    </span>
                  </span>
                  <div className="currency-input-wrap">
                    <span className="currency-prefix">Rp</span>
                    <SmartCurrencyInput
                      id={revenueId}
                      value={revenue}
                      onChange={setRevenue}
                      min={0}
                    />
                  </div>
                </label>

                <label htmlFor={expenseId}>
                  <span className="field-label-text">
                    <span>Anggaran Biaya (RAB Expense)</span>
                  </span>
                  <div className="currency-input-wrap">
                    <span className="currency-prefix">Rp</span>
                    <SmartCurrencyInput
                      id={expenseId}
                      value={expense}
                      onChange={setExpense}
                      min={0}
                    />
                  </div>
                </label>

                <label htmlFor={startId}>
                  <span className="field-label-text">
                    <span>Tanggal Mulai Kontrak</span>
                  </span>
                  <input
                    id={startId}
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </label>

                <label htmlFor={endId}>
                  <span className="field-label-text">
                    <span>Target Selesai Proyek</span>
                  </span>
                  <input
                    id={endId}
                    type="date"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </label>

                <div className="full project-color-picker-group">
                  <span className="field-label-text">
                    <span>Tema Warna Identifikasi Proyek</span>
                    <span className="field-hint">{color.toUpperCase()}</span>
                  </span>
                  <div className="color-swatches-grid">
                    {presetColors.map((opt) => (
                      <button
                        key={opt.hex}
                        type="button"
                        className={`color-swatch-btn ${color.toLowerCase() === opt.hex.toLowerCase() ? "selected" : ""}`}
                        onClick={() => setColor(opt.hex)}
                        title={opt.label}
                      >
                        <span className="swatch-dot" style={{ backgroundColor: opt.hex }} />
                        <span className="swatch-name">{opt.label}</span>
                      </button>
                    ))}

                    {isCustom ? (
                      <div className="color-swatch-btn custom-color-picker-pill selected custom-active">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="native-color-picker-input"
                          aria-label="Ubah warna kustom"
                          title="Klik untuk mengubah warna kustom"
                        />
                        <div className="custom-color-inner-content">
                          <span className="swatch-dot" style={{ backgroundColor: color }} />
                          <span className="swatch-name">{color.toUpperCase()}</span>
                        </div>
                        <button
                          type="button"
                          className="custom-color-reset-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setColor("#168b67");
                          }}
                          title="Reset ke warna default (Emerald Green)"
                          aria-label="Batalkan warna kustom"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                    ) : (
                      <div className="color-swatch-btn custom-color-picker-pill">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="native-color-picker-input"
                          aria-label="Pilih warna kustom"
                          title="Klik untuk memilih warna kustom dari spektrum warna"
                        />
                        <div className="custom-color-inner-content">
                          <span className="swatch-dot" style={{ backgroundColor: color }} />
                          <span className="swatch-name">Warna Kustom</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Financial Feasibility Summary */}
            <aside className="journal-preview" aria-label="Analisis Finansial Proyek">
              <div className="journal-head">
                <div>
                  <h3>Analisis Kelayakan Finansial</h3>
                  <p>Estimasi margin dan batas serapan anggaran proyek</p>
                </div>
                <span className={Number(marginPercentage) >= 15 ? "balanced" : "unbalanced"}>
                  {Number(marginPercentage) >= 15 ? `MARGIN ${marginPercentage}%` : `MARGIN ${marginPercentage}%`}
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
                <EntityAvatar name={name || project.name} code={project.code} size={40} />
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
                    {name || project.name}
                  </strong>
                  <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginTop: "2px" }}>
                    {client || project.client} · {project.code}
                  </span>
                </div>
                <StatusBadge status={status} />
              </div>

              {/* Financial Analysis Table */}
              <div className="project-financial-analysis-box">
                <div className="analysis-row header-row">
                  <span className="col-label">Parameter Finansial</span>
                  <span className="col-val">Estimasi Nilai (IDR)</span>
                </div>
                <div className="analysis-row item-row">
                  <div className="param-meta">
                    <b className="param-title">Nilai Kontrak Proyek</b>
                    <small className="param-sub">Target Penerimaan Bruto</small>
                  </div>
                  <span className="col-val revenue-val">{formatIDR(revenue)}</span>
                </div>
                <div className="analysis-row item-row">
                  <div className="param-meta">
                    <b className="param-title">Estimasi Pagu Biaya (RAB)</b>
                    <small className="param-sub">Batas Serapan Beban Pokok</small>
                  </div>
                  <span className="col-val expense-val">{formatIDR(expense)}</span>
                </div>
                <div className="analysis-row item-row">
                  <div className="param-meta">
                    <b className="param-title">Estimasi Laba Kotor</b>
                    <small className="param-sub">Gross Profit Proyek</small>
                  </div>
                  <span
                    className="col-val profit-val"
                    style={{ color: projectedProfit >= 0 ? "#168b67" : "#e11d48" }}
                  >
                    {formatIDR(projectedProfit)}
                  </span>
                </div>
                <div className="analysis-row footer-row">
                  <div className="param-meta">
                    <b className="param-title">Status Pelaksanaan</b>
                    <small className="param-sub">Fase Operasional</small>
                  </div>
                  <span className="col-val">
                    <StatusBadge status={status} />
                  </span>
                </div>
              </div>

              <div className="journal-audit-note">
                <HugeiconsIcon icon={InformationCircleIcon} size={16} strokeWidth={2} />
                <span>
                  Perubahan nilai pagu anggaran dan omset kontrak akan langsung memperbarui kalkulasi
                  realisasi biaya dan margin laba pada seluruh laporan laba rugi proyek.
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
              <span>Simpan Perubahan Proyek</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
