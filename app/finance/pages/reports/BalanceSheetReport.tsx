"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import Building03Icon from "@hugeicons/core-free-icons/Building03Icon";
import Shield02Icon from "@hugeicons/core-free-icons/Shield02Icon";
import Coins01Icon from "@hugeicons/core-free-icons/Coins01Icon";
import AnalyticsUpIcon from "@hugeicons/core-free-icons/AnalyticsUpIcon";
import { formatIDR } from "../../data";
import { ReportLine } from "./ReportLine";

export function BalanceSheetReport() {
  const totalAssets = 3003500000;
  const currentAssets = 2703500000;
  const nonCurrentAssets = 300000000;
  const totalLiabilities = 120500000;
  const totalEquity = 2883000000;
  const netWorkingCapital = currentAssets - totalLiabilities; // 2,583,000,000
  const currentRatio = (currentAssets / totalLiabilities).toFixed(1);
  const derRatio = ((totalLiabilities / totalEquity) * 100).toFixed(1);

  return (
    <div className="formal-report balance-report-container">
      {/* 4-Column Balance Sheet KPI Metric Grid with vertically centered icons */}
      <section className="bs-kpi-grid">
        <article className="bs-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Total Aset / Aktiva</span>
            <div className="kpi-card-value font-bold text-positive">
              {formatIDR(totalAssets)}
            </div>
            <span className="kpi-footnote text-muted">
              89,9% merupakan aset lancar
            </span>
          </div>
          <div className="kpi-icon-pill positive">
            <HugeiconsIcon icon={Building03Icon} size={20} strokeWidth={1.9} />
          </div>
        </article>

        <article className="bs-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Total Liabilitas / Kewajiban</span>
            <div className="kpi-card-value font-bold text-negative">
              {formatIDR(totalLiabilities)}
            </div>
            <span className="kpi-footnote text-muted">
              DER {derRatio}% (Solvabilitas prima)
            </span>
          </div>
          <div className="kpi-icon-pill negative">
            <HugeiconsIcon icon={Shield02Icon} size={20} strokeWidth={1.9} />
          </div>
        </article>

        <article className="bs-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Total Ekuitas Bersih</span>
            <div className="kpi-card-value font-bold text-positive">
              {formatIDR(totalEquity)}
            </div>
            <span className="kpi-footnote text-muted">
              Nilai buku bersih perusahaan
            </span>
          </div>
          <div className="kpi-icon-pill positive">
            <HugeiconsIcon icon={Coins01Icon} size={20} strokeWidth={1.9} />
          </div>
        </article>

        <article className="bs-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Modal Kerja Bersih (NWC)</span>
            <div className="kpi-card-value font-bold text-positive">
              {formatIDR(netWorkingCapital)}
            </div>
            <span className="kpi-footnote text-muted">
              Current Ratio {currentRatio}x (Sangat kuat)
            </span>
          </div>
          <div className="kpi-icon-pill positive">
            <HugeiconsIcon icon={AnalyticsUpIcon} size={20} strokeWidth={1.9} />
          </div>
        </article>
      </section>

      {/* Visual Balance Equation Bar */}
      <div className="bs-balance-bar">
        <div className="waterfall-step">
          <small>Aset Lancar</small>
          <b>{formatIDR(currentAssets)}</b>
        </div>
        <span className="waterfall-operator">+</span>
        <div className="waterfall-step">
          <small>Aset Tidak Lancar</small>
          <b>{formatIDR(nonCurrentAssets)}</b>
        </div>
        <span className="waterfall-operator">=</span>
        <div className="waterfall-step total">
          <small>Total Aset</small>
          <b>{formatIDR(totalAssets)}</b>
        </div>
        <span className="waterfall-operator">≡</span>
        <div className="waterfall-step positive">
          <small>Liabilitas + Ekuitas</small>
          <b>{formatIDR(totalLiabilities + totalEquity)}</b>
        </div>
      </div>

      {/* Formal Dual-Column Balance Sheet (T-Account Format) */}
      <div className="balance-columns">
        {/* Left Column: ASSETS */}
        <section className="balance-column-section">
          <h3>ASET / AKTIVA (ASSETS)</h3>
          
          <h4>Aset Lancar (Current Assets)</h4>
          <ReportLine label="Kas dan Setara Kas (6 Rekening Kas & Bank)" amount="Rp 2.438.500.000" indent />
          <ReportLine label="Piutang Usaha / Tagihan Pelanggan (AR)" amount="Rp 220.000.000" indent />
          <ReportLine label="Uang Muka Proyek & Biaya Dibayar Dimuka" amount="Rp 45.000.000" indent />
          <ReportLine label="Total Aset Lancar" amount="Rp 2.703.500.000" subtotal />

          <h4>Aset Tidak Lancar (Non-Current Assets)</h4>
          <ReportLine label="Peralatan Kerja, Mesin Proyek & Inventaris" amount="Rp 365.000.000" indent />
          <ReportLine label="Akumulasi Penyusutan Aset Tetap" amount="(Rp 65.000.000)" indent />
          <ReportLine label="Total Aset Tidak Lancar (Nilai Buku)" amount="Rp 300.000.000" subtotal />

          <div style={{ marginTop: "auto", paddingTop: "14px" }}>
            <ReportLine label="TOTAL ASET (TOTAL ASSETS)" amount="Rp 3.003.500.000" total />
          </div>
        </section>

        {/* Right Column: LIABILITIES & EQUITY */}
        <section className="balance-column-section">
          <h3>LIABILITAS & EKUITAS (LIABILITIES & EQUITY)</h3>
          
          <h4>Liabilitas Jangka Pendek (Current Liabilities)</h4>
          <ReportLine label="Hutang Usaha / Tagihan Pemasok (AP)" amount="Rp 68.500.000" indent />
          <ReportLine label="Beban Akrual, Gaji Terhutang & Pajak" amount="Rp 52.000.000" indent />
          <ReportLine label="Total Liabilitas Jangka Pendek" amount="Rp 120.500.000" subtotal />

          <h4>Ekuitas Pemilik (Owner's Equity)</h4>
          <ReportLine label="Modal Disetor Pemilik (Owner's Paid-in Capital)" amount="Rp 2.445.750.000" indent />
          <ReportLine label="Laba Bersih Periode Berjalan (Sync P&L)" amount="Rp 437.250.000" indent />
          <ReportLine label="Total Ekuitas Pemilik" amount="Rp 2.883.000.000" subtotal />

          <div style={{ marginTop: "auto", paddingTop: "14px" }}>
            <ReportLine label="TOTAL LIABILITAS & EKUITAS" amount="Rp 3.003.500.000" total />
          </div>
        </section>
      </div>

      {/* Financial Health & Solvency Roster */}
      <section className="bs-ratios-section">
        <h3>INDIKATOR KESEHATAN KEUANGAN & SOLVABILITAS (FINANCIAL RATIOS)</h3>
        <div className="bs-ratios-grid">
          <article className="bs-ratio-card">
            <div className="bs-ratio-header">
              <span className="bs-ratio-title">Current Ratio</span>
              <span className="bs-ratio-badge healthy">PRIMA</span>
            </div>
            <div className="bs-ratio-val mono-num font-bold text-ink">
              {currentRatio}x
            </div>
            <small className="bs-ratio-desc text-muted">
              Aset lancar menutup liabilitas jangka pendek {currentRatio} kali lipat (Batas sehat: &gt;1.5x)
            </small>
          </article>

          <article className="bs-ratio-card">
            <div className="bs-ratio-header">
              <span className="bs-ratio-title">Quick Ratio (Acid Test)</span>
              <span className="bs-ratio-badge healthy">PRIMA</span>
            </div>
            <div className="bs-ratio-val mono-num font-bold text-ink">
              22.1x
            </div>
            <small className="bs-ratio-desc text-muted">
              Kemampuan likuiditas instan kas + piutang tanpa persediaan
            </small>
          </article>

          <article className="bs-ratio-card">
            <div className="bs-ratio-header">
              <span className="bs-ratio-title">Debt to Equity (DER)</span>
              <span className="bs-ratio-badge healthy">LEVERAGE RENDAH</span>
            </div>
            <div className="bs-ratio-val mono-num font-bold text-positive">
              {derRatio}%
            </div>
            <small className="bs-ratio-desc text-muted">
              Struktur permodalan didominasi ekuitas mandiri, minim risiko gagal bayar
            </small>
          </article>
        </div>
      </section>

      {/* Audit Compliance Verification */}
      <div className="balance-check">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} strokeWidth={1.8} />
        <span>
          <b>Neraca Keuangan Seimbang Sempurna (Balanced Statement)</b>
          <small>
            Total Aset (Rp 3.003.500.000) identik dengan Total Liabilitas dan Ekuitas (Rp 3.003.500.000) · Selisih Rp 0. Tersinkronisasi dengan Buku Besar & Laba Rugi.
          </small>
        </span>
      </div>
    </div>
  );
}
