"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import Invoice01Icon from "@hugeicons/core-free-icons/Invoice01Icon";
import AnalyticsUpIcon from "@hugeicons/core-free-icons/AnalyticsUpIcon";
import MoneySend01Icon from "@hugeicons/core-free-icons/MoneySend01Icon";
import DollarCircleIcon from "@hugeicons/core-free-icons/DollarCircleIcon";
import { formatIDR, projectRows } from "../../data";
import { ReportLine } from "./ReportLine";

export function ProfitLossReport() {
  const totalRevenue = 1284000000;
  const totalCogs = 744750000;
  const grossProfit = totalRevenue - totalCogs; // 539,250,000
  const totalOpex = 102000000;
  const netProfit = grossProfit - totalOpex; // 437,250,000
  const grossMargin = ((grossProfit / totalRevenue) * 100).toFixed(1);
  const netMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="formal-report profit-loss-report-container">
      {/* 4-Column P&L KPI Metric Grid with vertically centered icons */}
      <section className="pl-kpi-grid">
        <article className="pl-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Total Pendapatan Usaha</span>
            <div className="kpi-card-value font-bold text-positive">
              {formatIDR(totalRevenue)}
            </div>
            <span className="kpi-footnote text-muted">
              4 kontrak proyek berjalan
            </span>
          </div>
          <div className="kpi-icon-pill positive">
            <HugeiconsIcon icon={Invoice01Icon} size={20} strokeWidth={1.9} />
          </div>
        </article>

        <article className="pl-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Laba Kotor Proyek (Gross)</span>
            <div className="kpi-card-value font-bold text-positive">
              {formatIDR(grossProfit)}
            </div>
            <span className="kpi-footnote text-muted">
              Gross Profit Margin {grossMargin}%
            </span>
          </div>
          <div className="kpi-icon-pill positive">
            <HugeiconsIcon icon={AnalyticsUpIcon} size={20} strokeWidth={1.9} />
          </div>
        </article>

        <article className="pl-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Beban Usaha & OPEX</span>
            <div className="kpi-card-value font-bold text-negative">
              ({formatIDR(totalOpex)})
            </div>
            <span className="kpi-footnote text-muted">
              7,9% rasio beban kantor
            </span>
          </div>
          <div className="kpi-icon-pill negative">
            <HugeiconsIcon icon={MoneySend01Icon} size={20} strokeWidth={1.9} />
          </div>
        </article>

        <article className="pl-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Laba Bersih Usaha (Net)</span>
            <div className="kpi-card-value font-bold text-positive">
              {formatIDR(netProfit)}
            </div>
            <span className="kpi-footnote text-muted">
              Net Profit Margin {netMargin}%
            </span>
          </div>
          <div className="kpi-icon-pill positive">
            <HugeiconsIcon icon={DollarCircleIcon} size={20} strokeWidth={1.9} />
          </div>
        </article>
      </section>

      {/* Visual P&L Margin Bridge Waterfall Bar */}
      <div className="pl-waterfall-bar">
        <div className="waterfall-step">
          <small>Pendapatan Usaha</small>
          <b>{formatIDR(totalRevenue)}</b>
        </div>
        <span className="waterfall-operator">−</span>
        <div className="waterfall-step negative">
          <small>HPP / COGS Proyek</small>
          <b>−{formatIDR(totalCogs)}</b>
        </div>
        <span className="waterfall-operator">=</span>
        <div className="waterfall-step positive">
          <small>Laba Kotor ({grossMargin}%)</small>
          <b>{formatIDR(grossProfit)}</b>
        </div>
        <span className="waterfall-operator">−</span>
        <div className="waterfall-step negative">
          <small>OPEX Kantor</small>
          <b>−{formatIDR(totalOpex)}</b>
        </div>
        <span className="waterfall-operator">=</span>
        <div className="waterfall-step total">
          <small>Laba Bersih ({netMargin}%)</small>
          <b>{formatIDR(netProfit)}</b>
        </div>
      </div>

      {/* Formal Multi-Step P&L Statement (PSAK 1 / Standar Akuntansi Kontraktor) */}
      <div className="pl-statement-body">
        <section>
          <h3>I. PENDAPATAN USAHA KONTRAKTUAL (OPERATING REVENUE)</h3>
          <ReportLine label="Pendapatan Termin — Proyek Hotel Gamelan (PRJ-026)" amount="Rp 480.000.000" indent />
          <ReportLine label="Pendapatan Termin — Proyek Villa Ubud (PRJ-024)" amount="Rp 364.000.000" indent />
          <ReportLine label="Pendapatan Termin — Proyek Kantor Sentosa (PRJ-019)" amount="Rp 280.000.000" indent />
          <ReportLine label="Pendapatan Termin — Pekerjaan Gudang Karya (PRJ-015)" amount="Rp 160.000.000" indent />
          <ReportLine label="TOTAL PENDAPATAN USAHA (GROSS REVENUE)" amount="Rp 1.284.000.000" total />
        </section>

        <section>
          <h3>II. BEBAN POKOK PENDAPATAN / HPP PROYEK (COST OF GOODS SOLD - COGS)</h3>
          <ReportLine label="Biaya Pembelian Material & Bahan Bangunan Konstruksi" amount="(Rp 412.500.000)" indent />
          <ReportLine label="Biaya Upah Tenaga Kerja Langsung & Mandor Lapangan" amount="(Rp 218.250.000)" indent />
          <ReportLine label="Sewa Alat Berat, Peralatan Proyek & Logistik Pendukung" amount="(Rp 114.000.000)" indent />
          <ReportLine label="TOTAL BEBAN POKOK PENDAPATAN (TOTAL COGS)" amount="(Rp 744.750.000)" subtotal />
        </section>

        <section>
          <h3>III. LABA KOTOR PROYEK (GROSS PROFIT)</h3>
          <ReportLine label="LABA KOTOR USAHA (GROSS PROFIT — MARGIN 42,0%)" amount="Rp 539.250.000" total />
        </section>

        <section>
          <h3>IV. BEBAN USAHA, UMUM & ADMINISTRASI (OPEX OVERHEAD)</h3>
          <ReportLine label="Beban Gaji Manajemen & Staf Administrasi Kantor" amount="(Rp 64.000.000)" indent />
          <ReportLine label="Beban Utilitas Kantor, Internet, Listrik & Komunikasi" amount="(Rp 21.500.000)" indent />
          <ReportLine label="Beban Perizinan Usaha, Legalitas, Asuransi & Pajak Korporat" amount="(Rp 16.500.000)" indent />
          <ReportLine label="TOTAL BEBAN USAHA & ADMINISTRASI (TOTAL OPEX)" amount="(Rp 102.000.000)" subtotal />
        </section>

        <section>
          <h3>V. LABA BERSIH SEBELUM PAJAK (NET INCOME / EBIT)</h3>
          <ReportLine label="LABA BERSIH USAHA PERIODE BERJALAN (NET PROFIT)" amount="Rp 437.250.000" total />
        </section>
      </div>

      {/* Matriks Kontribusi Laba Per Proyek (Project Contribution Roster) */}
      <section className="pl-project-matrix">
        <h3>KONTRIBUSI PROFITABILITAS PER PROYEK AKTIF</h3>
        <div className="pl-project-grid">
          {projectRows.map((proj) => {
            const marginVal = proj.revenue - proj.expense;
            const marginPct = ((marginVal / proj.revenue) * 100).toFixed(1);
            return (
              <article key={proj.code} className="pl-project-card">
                <div className="pl-project-header">
                  <span className="pl-project-name">{proj.name}</span>
                  <span className="pl-project-code">{proj.code}</span>
                </div>
                <div className="pl-project-metrics">
                  <div className="pl-metric-item">
                    <small>Pendapatan</small>
                    <span className="mono-num">{formatIDR(proj.revenue)}</span>
                  </div>
                  <div className="pl-metric-item">
                    <small>Biaya HPP</small>
                    <span className="mono-num text-negative">({formatIDR(proj.expense)})</span>
                  </div>
                  <div className="pl-metric-item highlight">
                    <small>Laba Proyek</small>
                    <b className="mono-num text-positive">{formatIDR(marginVal)} ({marginPct}%)</b>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Executive Net Profit Banner */}
      <div className="statement-profit">
        <span>
          <b>NET PROFIT BERSIH PERIODE BERJALAN: {formatIDR(netProfit)}</b>
          <small>Net Profit Margin {netMargin}% · Realisasi Target Anggaran Perusahaan Tercapai</small>
        </span>
        <strong className="mono-num">{formatIDR(netProfit)}</strong>
      </div>

      {/* Audit Compliance Verification */}
      <div className="balance-check">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} strokeWidth={1.8} />
        <span>
          <b>Laporan Laba Rugi Mengacu PSAK 1 & Standar Akuntansi Konstruksi SAK EMKM</b>
          <small>
            Pengakuan pendapatan menggunakan metode persentase penyelesaian (*Percentage of Completion*) terverifikasi hingga kontrak dan faktur sumber.
          </small>
        </span>
      </div>
    </div>
  );
}
