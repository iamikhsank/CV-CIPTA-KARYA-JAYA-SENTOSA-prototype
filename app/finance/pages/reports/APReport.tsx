"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import Invoice01Icon from "@hugeicons/core-free-icons/Invoice01Icon";
import MoneySend01Icon from "@hugeicons/core-free-icons/MoneySend01Icon";
import HourglassIcon from "@hugeicons/core-free-icons/HourglassIcon";
import { StatusBadge } from "../../components/ui";
import { formatIDR, payables } from "../../data";
import { ReportLine } from "./ReportLine";

export function APReport() {
  const totalGross = payables.reduce((sum, p) => sum + p.total, 0);
  const totalPaid = payables.reduce((sum, p) => sum + p.paid, 0);
  const totalOutstanding = totalGross - totalPaid;

  return (
    <div className="formal-report subledger-report">
      {/* 3-Column Executive Summary */}
      <section className="subledger-summary-grid">
        <article className="subledger-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Total Tagihan Hutang (AP)</span>
            <div className="kpi-card-value font-bold text-ink">
              {formatIDR(totalGross)}
            </div>
            <span className="kpi-footnote text-muted">
              3 tagihan supplier / vendor masuk
            </span>
          </div>
          <div className="kpi-icon-pill">
            <HugeiconsIcon icon={Invoice01Icon} size={20} strokeWidth={1.9} />
          </div>
        </article>

        <article className="subledger-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Realisasi Pelunasan Kas</span>
            <div className="kpi-card-value font-bold text-positive">
              {formatIDR(totalPaid)}
            </div>
            <span className="kpi-footnote text-muted">
              {Math.round((totalPaid / totalGross) * 100)}% dari kewajiban telah terbayar
            </span>
          </div>
          <div className="kpi-icon-pill positive">
            <HugeiconsIcon icon={MoneySend01Icon} size={20} strokeWidth={1.9} />
          </div>
        </article>

        <article className="subledger-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Sisa Kewajiban Hutang Terbuka</span>
            <div className="kpi-card-value font-bold text-negative">
              {formatIDR(totalOutstanding)}
            </div>
            <span className="kpi-footnote text-muted">
              Kewajiban aktif jatuh tempo bertahap
            </span>
          </div>
          <div className="kpi-icon-pill negative">
            <HugeiconsIcon icon={HourglassIcon} size={20} strokeWidth={1.9} />
          </div>
        </article>
      </section>

      {/* Rekonsiliasi Mutasi Saldo Buku Pembantu Hutang */}
      <section className="subledger-movement-section">
        <h3>REKONSILIASI MUTASI BUKU PEMBANTU HUTANG (ACCOUNTS PAYABLE MOVEMENT)</h3>
        <ReportLine label="Saldo Awal Hutang Usaha (Opening AP Balance — 01 Agu 2026)" amount="Rp 30.000.000" indent />
        <ReportLine label="Penambahan Tagihan Supplier & Subkon Baru (+Credits)" amount="Rp 205.000.000" indent />
        <ReportLine label="Pembayaran Kas & Pengeluaran Rekening (−Debits)" amount="(Rp 166.500.000)" indent />
        <ReportLine label="SALDO AKHIR HUTANG USAHA (CLOSING AP BALANCE)" amount="Rp 68.500.000" total />
      </section>

      {/* Rincian Jadwal Aging Hutang (Aging Schedule Table) */}
      <section className="subledger-table-section">
        <h3>JADWAL UMUR & RINCIAN TAGIHAN SUPPLIER (AP AGING SCHEDULE)</h3>
        <div className="gl-table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: "16%" }}>No. Dokumen</th>
                <th style={{ width: "24%" }}>Vendor / Supplier</th>
                <th style={{ width: "18%" }}>Proyek</th>
                <th style={{ width: "14%" }}>Jatuh Tempo</th>
                <th style={{ width: "14%", textAlign: "right" }}>Nilai Tagihan</th>
                <th style={{ width: "14%", textAlign: "right" }}>Sisa Hutang</th>
                <th style={{ width: "12%", textAlign: "center" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payables.map((p) => {
                const outstanding = p.total - p.paid;
                return (
                  <tr key={p.ref}>
                    <td>
                      <code className="cell-ref-id">{p.ref}</code>
                    </td>
                    <td>
                      <b>{p.party}</b>
                    </td>
                    <td>
                      <span className="project-allocation-tag">{p.project}</span>
                    </td>
                    <td>
                      <span className="cell-date">{p.due}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="mono-num">{formatIDR(p.total)}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className={`mono-num font-bold ${outstanding > 0 ? "text-negative" : "text-ink"}`}>
                        {formatIDR(outstanding)}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>TOTAL HUTANG USAHA (AP)</td>
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
          <b>Buku Pembantu Hutang Terverifikasi & Seimbang</b>
          <small>
            Total sisa hutang Rp 68.500.000 identik dengan akun Neraca 2-1100 (Accounts Payable) pada Buku Besar Umum.
          </small>
        </span>
      </div>
    </div>
  );
}
