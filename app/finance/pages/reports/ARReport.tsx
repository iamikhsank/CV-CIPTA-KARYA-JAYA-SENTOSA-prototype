"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import Invoice01Icon from "@hugeicons/core-free-icons/Invoice01Icon";
import MoneyReceive01Icon from "@hugeicons/core-free-icons/MoneyReceive01Icon";
import HourglassIcon from "@hugeicons/core-free-icons/HourglassIcon";
import { StatusBadge } from "../../components/ui";
import { formatIDR, receivables } from "../../data";
import { ReportLine } from "./ReportLine";

export function ARReport() {
  const totalGross = receivables.reduce((sum, r) => sum + r.total, 0);
  const totalPaid = receivables.reduce((sum, r) => sum + r.paid, 0);
  const totalOutstanding = totalGross - totalPaid;

  return (
    <div className="formal-report subledger-report">
      {/* 3-Column Executive Summary */}
      <section className="subledger-summary-grid">
        <article className="subledger-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Total Tagihan Piutang (AR)</span>
            <div className="kpi-card-value font-bold text-ink">
              {formatIDR(totalGross)}
            </div>
            <span className="kpi-footnote text-muted">
              3 invoice terbit periode berjalan
            </span>
          </div>
          <div className="kpi-icon-pill">
            <HugeiconsIcon icon={Invoice01Icon} size={20} strokeWidth={1.9} />
          </div>
        </article>

        <article className="subledger-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Realisasi Penerimaan Kas</span>
            <div className="kpi-card-value font-bold text-positive">
              {formatIDR(totalPaid)}
            </div>
            <span className="kpi-footnote text-muted">
              {Math.round((totalPaid / totalGross) * 100)}% dari total piutang tertagih
            </span>
          </div>
          <div className="kpi-icon-pill positive">
            <HugeiconsIcon icon={MoneyReceive01Icon} size={20} strokeWidth={1.9} />
          </div>
        </article>

        <article className="subledger-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Sisa Saldo Piutang Terbuka</span>
            <div className="kpi-card-value font-bold text-negative">
              {formatIDR(totalOutstanding)}
            </div>
            <span className="kpi-footnote text-muted">
              Klaim berjalan belum jatuh tempo
            </span>
          </div>
          <div className="kpi-icon-pill negative">
            <HugeiconsIcon icon={HourglassIcon} size={20} strokeWidth={1.9} />
          </div>
        </article>
      </section>

      {/* Rekonsiliasi Mutasi Saldo Buku Pembantu */}
      <section className="subledger-movement-section">
        <h3>REKONSILIASI MUTASI BUKU PEMBANTU PIUTANG (ACCOUNTS RECEIVABLE MOVEMENT)</h3>
        <ReportLine label="Saldo Awal Piutang (Opening AR Balance — 01 Agu 2026)" amount="Rp 100.000.000" indent />
        <ReportLine label="Penambahan Piutang Baru / Invoice Terbit (+Debits)" amount="Rp 300.000.000" indent />
        <ReportLine label="Penerimaan Kas & Pelunasan Pelanggan (−Credits)" amount="(Rp 180.000.000)" indent />
        <ReportLine label="SALDO AKHIR PIUTANG USAHA (CLOSING AR BALANCE)" amount="Rp 220.000.000" total />
      </section>

      {/* Rincian Jadwal Aging Piutang (Aging Schedule Table) */}
      <section className="subledger-table-section">
        <h3>JADWAL UMUR & RINCIAN INVOICE PELANGGAN (AR AGING SCHEDULE)</h3>
        <div className="gl-table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: "16%" }}>No. Dokumen</th>
                <th style={{ width: "24%" }}>Pelanggan / Klien</th>
                <th style={{ width: "18%" }}>Proyek</th>
                <th style={{ width: "14%" }}>Jatuh Tempo</th>
                <th style={{ width: "14%", textAlign: "right" }}>Nilai Tagihan</th>
                <th style={{ width: "14%", textAlign: "right" }}>Sisa Piutang</th>
                <th style={{ width: "12%", textAlign: "center" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {receivables.map((r) => {
                const outstanding = r.total - r.paid;
                return (
                  <tr key={r.ref}>
                    <td>
                      <code className="cell-ref-id">{r.ref}</code>
                    </td>
                    <td>
                      <b>{r.party}</b>
                    </td>
                    <td>
                      <span className="project-allocation-tag">{r.project}</span>
                    </td>
                    <td>
                      <span className="cell-date">{r.due}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="mono-num">{formatIDR(r.total)}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className={`mono-num font-bold ${outstanding > 0 ? "text-negative" : "text-ink"}`}>
                        {formatIDR(outstanding)}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>TOTAL PIUTANG USAHA (AR)</td>
                <td style={{ textAlign: "right" }}>{formatIDR(totalGross)}</td>
                <td style={{ textAlign: "right" }}>{formatIDR(totalOutstanding)}</td>
                <td style={{ textAlign: "center" }}>3 Dokumen</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Audit Trail Note */}
      <div className="balance-check">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} strokeWidth={1.8} />
        <span>
          <b>Buku Pembantu Piutang Terverifikasi & Seimbang</b>
          <small>
            Total sisa piutang Rp 220.000.000 identik dengan akun Neraca 1-1300 (Accounts Receivable) pada Buku Besar Umum.
          </small>
        </span>
      </div>
    </div>
  );
}
