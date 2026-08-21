"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import { formatIDR } from "../../data";

export function GeneralLedgerReport() {
  const rows = [
    ["1-1100", "Kas & Bank (Cash & Bank Equivalents)", "Rp 1.974.500.000 Dr", 1284000000, 820000000, "Rp 2.438.500.000 Dr"],
    ["1-1300", "Piutang Usaha (Accounts Receivable)", "Rp 100.000.000 Dr", 300000000, 180000000, "Rp 220.000.000 Dr"],
    ["2-1100", "Hutang Usaha (Accounts Payable)", "Rp 30.000.000 Cr", 205000000, 243500000, "Rp 68.500.000 Cr"],
    ["2-1900", "Liabilitas Lancar Lainnya (Other Current Liabilities)", "—", 0, 108250000, "Rp 108.250.000 Cr"],
    ["3-1000", "Modal Disetor Pemilik (Owner's Capital)", "Rp 2.044.500.000 Cr", 0, 0, "Rp 2.044.500.000 Cr"],
    ["4-1000", "Pendapatan Kontraktual Proyek (Project Revenue)", "—", 0, 1284000000, "Rp 1.284.000.000 Cr"],
    ["5-1000", "Beban Pokok Proyek & Beban Kantor (Expenses)", "—", 846750000, 0, "Rp 846.750.000 Dr"],
  ] as const;

  return (
    <div className="general-ledger-report">
      {/* 4-Column GL KPI Metric Grid (without icons) */}
      <section className="gl-kpi-grid">
        <article className="gl-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Saldo Awal Buku Besar</span>
            <div className="kpi-card-value font-bold text-ink">
              Rp 2.074.500.000
            </div>
            <span className="kpi-footnote text-muted">
              Debit = Kredit Seimbang
            </span>
          </div>
        </article>

        <article className="gl-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Total Mutasi Debet</span>
            <div className="kpi-card-value font-bold text-positive">
              Rp 2.635.750.000
            </div>
            <span className="kpi-footnote text-muted">
              Total entri debit diposting
            </span>
          </div>
        </article>

        <article className="gl-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Total Mutasi Kredit</span>
            <div className="kpi-card-value font-bold text-negative">
              Rp 2.635.750.000
            </div>
            <span className="kpi-footnote text-muted">
              Total entri kredit diposting
            </span>
          </div>
        </article>

        <article className="gl-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Selisih Rekonsiliasi GL</span>
            <div className="kpi-card-value font-bold text-positive">
              Rp 0 (SEIMBANG)
            </div>
            <span className="kpi-footnote text-muted">
              Double-entry audit lolos
            </span>
          </div>
        </article>
      </section>

      {/* General Ledger Master Table */}
      <div className="gl-table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: "10%" }}>No. Akun</th>
              <th style={{ width: "26%" }}>Nama Akun Buku Besar</th>
              <th style={{ width: "16%" }}>Saldo Awal</th>
              <th style={{ width: "16%", textAlign: "right" }}>Debet</th>
              <th style={{ width: "16%", textAlign: "right" }}>Kredit</th>
              <th style={{ width: "16%", textAlign: "right" }}>Saldo Akhir</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                <td>
                  <code className="cell-ref-id">{row[0]}</code>
                </td>
                <td>
                  <b>{row[1]}</b>
                </td>
                <td>
                  <span className="mono-num">{row[2]}</span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="mono-num">{row[3] ? formatIDR(row[3]) : "—"}</span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="mono-num">{row[4] ? formatIDR(row[4]) : "—"}</span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <b className="mono-num">{row[5]}</b>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>TOTAL BUKU BESAR (GENERAL LEDGER)</td>
              <td>Rp 2.074.500.000 Dr = Cr</td>
              <td style={{ textAlign: "right" }}>Rp 2.635.750.000</td>
              <td style={{ textAlign: "right" }}>Rp 2.635.750.000</td>
              <td style={{ textAlign: "right" }}>Rp 3.505.250.000 Dr = Cr</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Audit Balance Verification */}
      <div className="balance-check gl-check">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} strokeWidth={1.8} />
        <span>
          <b>Buku Besar Umum Tersinkronisasi Sempurna (Double-Entry Balanced)</b>
          <small>
            Total debet periode berjalan sama persis dengan total kredit (Rp 2.635.750.000) · Selisih Rp 0.
          </small>
        </span>
      </div>
    </div>
  );
}
