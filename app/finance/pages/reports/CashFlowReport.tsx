"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import MoneyReceive01Icon from "@hugeicons/core-free-icons/MoneyReceive01Icon";
import MoneySend01Icon from "@hugeicons/core-free-icons/MoneySend01Icon";
import AnalyticsUpIcon from "@hugeicons/core-free-icons/AnalyticsUpIcon";
import BankIcon from "@hugeicons/core-free-icons/BankIcon";
import { cashSeed, formatIDR } from "../../data";
import { ReportLine } from "./ReportLine";

export function CashFlowReport() {
  const endingTotal = cashSeed.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="formal-report cashflow-report-container">
      {/* 4-Column Cashflow KPI Metric Grid */}
      <section className="cashflow-kpi-grid">
        <article className="cashflow-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Arus Kas Operasi (OCF)</span>
            <div className="kpi-card-value font-bold text-positive">
              +{formatIDR(498000000)}
            </div>
            <span className="kpi-footnote text-muted">
              38,8% dari total pendapatan termin
            </span>
          </div>
          <div className="kpi-icon-pill positive">
            <HugeiconsIcon icon={MoneyReceive01Icon} size={20} strokeWidth={1.9} />
          </div>
        </article>

        <article className="cashflow-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Arus Kas Investasi (ICF)</span>
            <div className="kpi-card-value font-bold text-negative">
              −{formatIDR(34000000)}
            </div>
            <span className="kpi-footnote text-muted">
              Belanja aset & alat proyek
            </span>
          </div>
          <div className="kpi-icon-pill negative">
            <HugeiconsIcon icon={MoneySend01Icon} size={20} strokeWidth={1.9} />
          </div>
        </article>

        <article className="cashflow-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Kenaikan Bersih Kas (Net)</span>
            <div className="kpi-card-value font-bold text-positive">
              +{formatIDR(464000000)}
            </div>
            <span className="kpi-footnote text-muted">
              Surplus likuiditas periode berjalan
            </span>
          </div>
          <div className="kpi-icon-pill positive">
            <HugeiconsIcon icon={AnalyticsUpIcon} size={20} strokeWidth={1.9} />
          </div>
        </article>

        <article className="cashflow-kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-card-label">Saldo Kas & Setara Kas</span>
            <div className="kpi-card-value font-bold text-positive">
              {formatIDR(endingTotal)}
            </div>
            <span className="kpi-footnote text-muted">
              Tersedia di 6 rekening kas & bank
            </span>
          </div>
          <div className="kpi-icon-pill positive">
            <HugeiconsIcon icon={BankIcon} size={20} strokeWidth={1.9} />
          </div>
        </article>
      </section>

      {/* Visual Cash Flow Waterfall Step Bar */}
      <div className="cashflow-waterfall-bar">
        <div className="waterfall-step">
          <small>Kas Awal (01 Agu)</small>
          <b>{formatIDR(1974500000)}</b>
        </div>
        <span className="waterfall-operator">+</span>
        <div className="waterfall-step positive">
          <small>Kas Operasi (OCF)</small>
          <b>+{formatIDR(498000000)}</b>
        </div>
        <span className="waterfall-operator">−</span>
        <div className="waterfall-step negative">
          <small>Kas Investasi (ICF)</small>
          <b>−{formatIDR(34000000)}</b>
        </div>
        <span className="waterfall-operator">=</span>
        <div className="waterfall-step total">
          <small>Kas Akhir (20 Agu)</small>
          <b>{formatIDR(endingTotal)}</b>
        </div>
      </div>

      {/* Formal Cash Flow Statement (Metode Langsung / Direct Method - PSAK 2) */}
      <div className="cashflow-statement-body">
        <section>
          <h3>1. ARUS KAS DARI AKTIVITAS OPERASI (CASH FLOWS FROM OPERATING ACTIVITIES)</h3>
          <ReportLine label="Penerimaan kas dari pelanggan (Termin & Project Billing)" amount="Rp 1.284.000.000" indent />
          <ReportLine label="Pembayaran kas kepada pemasok material & logistik" amount="(Rp 558.500.000)" indent />
          <ReportLine label="Pembayaran upah tenaga kerja & mandor lapangan" amount="(Rp 159.500.000)" indent />
          <ReportLine label="Pembayaran beban operasional kantor & administrasi umum" amount="(Rp 68.000.000)" indent />
          <ReportLine label="Arus kas bersih yang dihasilkan dari aktivitas operasi (Net OCF)" amount="Rp 498.000.000" subtotal />
        </section>

        <section>
          <h3>2. ARUS KAS DARI AKTIVITAS INVESTASI (CASH FLOWS FROM INVESTING ACTIVITIES)</h3>
          <ReportLine label="Perolehan alat kerja proyek, mesin cetak & inventaris kantor" amount="(Rp 34.000.000)" indent />
          <ReportLine label="Arus kas bersih yang digunakan untuk aktivitas investasi (Net ICF)" amount="(Rp 34.000.000)" subtotal />
        </section>

        <section>
          <h3>3. ARUS KAS DARI AKTIVITAS PENDANAAN (CASH FLOWS FROM FINANCING ACTIVITIES)</h3>
          <ReportLine label="Setoran modal pemilik / Penarikan prive pemegang saham" amount="—" indent />
          <ReportLine label="Pembayaran cicilan pokok liabilitas jangka panjang" amount="—" indent />
          <ReportLine label="Arus kas bersih dari aktivitas pendanaan (Net FCF)" amount="Rp 0" subtotal />
        </section>

        <section className="cash-reconciliation">
          <h3>4. REKONSILIASI KAS & POSISI SALDO AKHIR</h3>
          <ReportLine label="KENAIKAN BERSIH KAS DAN SETARA KAS" amount="Rp 464.000.000" total />
          <ReportLine label="Saldo kas dan setara kas pada awal periode (01 Agustus 2026)" amount="Rp 1.974.500.000" indent />
          <ReportLine label="SALDO KAS DAN SETARA KAS PADA AKHIR PERIODE (20 AGUSTUS 2026)" amount="Rp 2.438.500.000" total />
        </section>
      </div>

      {/* Rincian Komposisi Likuiditas Per Pos Rekening */}
      <section className="cash-accounts-distribution">
        <h3>RINCIAN POS REKENING KAS & BANK PENOPANG SALDO AKHIR</h3>
        <div className="cash-roster-grid">
          {cashSeed.map((acc) => (
            <article key={acc.name} className="cash-roster-card">
              <div className="cash-roster-top">
                <span className="cash-roster-name">{acc.name}</span>
                <span className="cash-roster-type">{acc.type}</span>
              </div>
              <div className="cash-roster-val mono-num font-bold text-ink">
                {formatIDR(acc.balance)}
              </div>
              <div className="cash-roster-sub text-muted">
                {acc.project} · {acc.no}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Audit Compliance Verification */}
      <div className="balance-check">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} strokeWidth={1.8} />
        <span>
          <b>Laporan Arus Kas Sesuai Standar Akuntansi Keuangan (PSAK 2 / SAK EMKM)</b>
          <small>
            Total kas & setara kas akhir Rp 2.438.500.000 telah terekonsiliasi 100% dengan fisik saldo 6 buku pembantu kas & bank.
          </small>
        </span>
      </div>
    </div>
  );
}
