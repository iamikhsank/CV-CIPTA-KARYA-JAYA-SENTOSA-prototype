"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import ArrowDownRight01Icon from "@hugeicons/core-free-icons/ArrowDownRight01Icon";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import ArrowDataTransferHorizontalIcon from "@hugeicons/core-free-icons/ArrowDataTransferHorizontalIcon";
import ArrowExpand01Icon from "@hugeicons/core-free-icons/ArrowExpand01Icon";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon";
import Chart01Icon from "@hugeicons/core-free-icons/Chart01Icon";
import Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";
import MoneyReceive01Icon from "@hugeicons/core-free-icons/MoneyReceive01Icon";
import MoneySend01Icon from "@hugeicons/core-free-icons/MoneySend01Icon";
import MoreVerticalIcon from "@hugeicons/core-free-icons/MoreVerticalIcon";
import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
import TransactionIcon from "@hugeicons/core-free-icons/TransactionIcon";
import Wallet02Icon from "@hugeicons/core-free-icons/Wallet02Icon";
import { useEffect, useState } from "react";
import { LocationLiveClock } from "../components/LocationLiveClock";
import { CustomDropdown, StatusBadge } from "../components/ui";
import { formatIDR, projectRows } from "../data";
import type { CashAccount, View } from "../types";

type DashboardViewProps = {
  go: (view: View) => void;
  newTransaction: () => void;
  transfer: () => void;
  cashAccounts: CashAccount[];
};

function getGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  }
  if (hour >= 12 && hour < 18) {
    return "Good Afternoon";
  }
  return "Good Evening";
}

function getFormattedDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function DashboardView({ go, newTransaction, transfer, cashAccounts }: DashboardViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  useEffect(() => {
    const updateTime = () => setCurrentDate(new Date());
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const greeting = getGreeting(currentDate);
  const formattedDate = getFormattedDate(currentDate);

  const [period, setPeriod] = useState("aug");
  const [project, setProject] = useState("all");

  const periodOptions = [
    { label: "Agustus 2026", value: "aug" },
    { label: "Juli 2026", value: "jul" },
    { label: "Juni 2026", value: "jun" },
  ];

  const projectOptions = [
    { label: "All Projects", value: "all" },
    { label: "Hotel Gamelan", value: "p1" },
    { label: "Villa Ubud", value: "p2" },
    { label: "Warehouse Cikande", value: "p3" },
  ];

  const [activeCashSegment, setActiveCashSegment] = useState<{
    name: string;
    balance: number;
    percentage: number;
    tone: string;
    centerPct: number;
  } | null>(null);

  const cashTotal = cashAccounts.reduce((sum, item) => sum + item.balance, 0);
  const rawGroups = [
    { name: "Bank Operasional", code: "B", tone: "bank", accounts: cashAccounts.filter((account) => account.type === "BANK"), detail: "accounts" },
    { name: "Giro", code: "G", tone: "giro", accounts: cashAccounts.filter((account) => account.type === "GIRO"), detail: "account" },
    { name: "Kas Proyek", code: "K", tone: "cash", accounts: cashAccounts.filter((account) => account.type === "PETTY CASH"), detail: "active projects" },
  ];

  let cumulativePct = 0;
  const cashPositionGroups = rawGroups.map((group) => {
    const balance = group.accounts.reduce((sum, account) => sum + account.balance, 0);
    const percentage = cashTotal ? (balance / cashTotal) * 100 : 0;
    const centerPct = cumulativePct + percentage / 2;
    cumulativePct += percentage;
    return {
      ...group,
      balance,
      percentage,
      centerPct,
    };
  });
  const kpis = [
    { label: "Total Cash", value: formatIDR(cashTotal), delta: "+8,4%", changeType: "positive", meta: "vs Jul 2026", icon: Wallet02Icon, destination: "Cash Accounts" as View, spark: [28, 42, 40, 50, 63, 75, 90] },
    { label: "Revenue", value: "Rp 1.284.000.000", delta: "+12,5%", changeType: "positive", meta: "vs Jul 2026", icon: MoneyReceive01Icon, destination: "Reports" as View, spark: [32, 36, 51, 48, 69, 72, 94] },
    { label: "Expense", value: "Rp 842.000.000", delta: "-3,1%", changeType: "positive", meta: "vs Jul 2026", icon: MoneySend01Icon, destination: "Reports" as View, spark: [40, 38, 52, 49, 45, 41, 38] },
    { label: "Net Margin", value: "34,4%", delta: "+4,8%", changeType: "positive", meta: "vs Jul 2026", icon: Chart01Icon, destination: "Reports" as View, spark: [22, 25, 27, 29, 31, 33, 34] },
  ];
  const [activeExpenseCategory, setActiveExpenseCategory] = useState<{
    label: string;
    value: number;
    amount: number;
    tone: string;
    color: string;
  } | null>(null);

  const expenseCategories = [
    { label: "Material", value: 42, amount: 355635000, tone: "material", color: "#2563eb" },
    { label: "Tenaga Kerja", value: 28, amount: 237090000, tone: "labor", color: "#2f9e5b" },
    { label: "Operasional", value: 18, amount: 152415000, tone: "operational", color: "#d97706" },
    { label: "Lainnya", value: 12, amount: 101610000, tone: "other", color: "#94a3b8" },
  ];
  return <>
    <section className="dashboard-welcome">
      <div className="dashboard-welcome-top">
        <div>
          <p>{formattedDate}</p>
          <h1>{greeting}, Jason</h1>
        </div>
        <div className="heading-actions">
          <LocationLiveClock />
          <CustomDropdown
            ariaLabel="Pilih Periode"
            icon={Calendar03Icon}
            onChange={setPeriod}
            options={periodOptions}
            value={period}
            />
          <CustomDropdown
            ariaLabel="Pilih Proyek"
            icon={Folder01Icon}
            onChange={setProject}
            options={projectOptions}
            value={project}
          />
          <button className="primary-button" onClick={newTransaction} type="button">
            <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2.2} />
            <span>New Transaction</span>
          </button>
        </div>
      </div>
    </section>
    <div className="quick-row"><button className="quick-action transaction" onClick={newTransaction} type="button"><i><HugeiconsIcon icon={TransactionIcon} size={21} strokeWidth={1.8} /></i><span><b>Catat transaksi</b><small>Catat pemasukan atau pengeluaran</small></span><HugeiconsIcon className="quick-arrow" icon={ArrowRight01Icon} size={18} strokeWidth={1.8} /></button><button className="quick-action transfer" onClick={transfer} type="button"><i><HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={21} strokeWidth={1.8} /></i><span><b>Transfer dana</b><small>Pindahkan saldo antar-pos kas</small></span><HugeiconsIcon className="quick-arrow" icon={ArrowRight01Icon} size={18} strokeWidth={1.8} /></button><button className="quick-action project" onClick={() => go("Projects")} type="button"><i><HugeiconsIcon icon={Folder01Icon} size={21} strokeWidth={1.8} /></i><span><b>Kelola proyek</b><small>Lihat dan kelola proyek aktif</small></span><HugeiconsIcon className="quick-arrow" icon={ArrowRight01Icon} size={18} strokeWidth={1.8} /></button></div>
    <section className="kpi-grid" aria-label="Ringkasan keuangan">
      {kpis.map((item) => (
        <article className={`kpi-card dashboard-kpi-card ${item.changeType}`} key={item.label}>
          <div className="kpi-body">
            <div className="kpi-top">
              <div className="kpi-title-wrap"><i /><span>{item.label}</span></div>
              <i className="kpi-icon"><HugeiconsIcon icon={item.icon} size={21} strokeWidth={1.7} /></i>
            </div>
            <div className="kpi-value"><strong>{item.value}</strong></div>
            <div className="kpi-support-row">
              <div className={`kpi-trend ${item.changeType}`}>
                <span className="kpi-trend-pill"><HugeiconsIcon icon={item.delta.startsWith("-") ? ArrowDownRight01Icon : ArrowUpRight01Icon} size={16} strokeWidth={2.2} /><b>{item.delta}</b></span>
                <span className="kpi-meta">{item.meta}</span>
              </div>
              <KpiLineChart points={item.spark} negative={item.changeType === "negative"} />
            </div>
            <button className="kpi-footer" onClick={() => go(item.destination)} type="button">View details <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={1.9} /></button>
          </div>
        </article>
      ))}
    </section>
    <section className="dashboard-grid">
      <article className="panel cash-panel cash-position-card">
        <div className="panel-head"><div><h2>Cash Position</h2><p>Saldo berdasarkan pos dana</p></div><button onClick={() => go("Cash Accounts")} type="button">View accounts <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={1.9} /></button></div>
        <div className="cash-liquidity-summary">
          <span>Total liquidity</span>
          <strong>{formatIDR(cashTotal)}</strong>
          <div className="cash-allocation-bar-wrap">
            <div className="cash-allocation-bar" aria-label="Distribusi saldo berdasarkan pos dana">
              {cashPositionGroups.map((group) => (
                <i
                  className={`${group.tone} ${activeCashSegment?.name === group.name ? "active" : ""}`}
                  key={group.name}
                  style={{ flexGrow: Math.max(group.balance, 1) }}
                  onMouseEnter={() => setActiveCashSegment(group)}
                  onMouseLeave={() => setActiveCashSegment(null)}
                  tabIndex={0}
                  role="img"
                  aria-label={`${group.name}: ${formatIDR(group.balance)} (${group.percentage.toFixed(1)}%)`}
                />
              ))}
            </div>
            {activeCashSegment && (
              <div
                className="cash-bar-floating-tooltip"
                style={{
                  left: `${Math.max(22, Math.min(78, activeCashSegment.centerPct))}%`,
                }}
              >
                <span className="tooltip-label">{activeCashSegment.name}</span>
                <div className="tooltip-metrics">
                  <span className="tooltip-value">{formatIDR(activeCashSegment.balance)}</span>
                  <span className={`tooltip-badge ${activeCashSegment.tone}`}>
                    {activeCashSegment.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="cash-position-rows">
          {cashPositionGroups.map((group) => (
            <button
              className={`cash-position-row ${activeCashSegment?.name === group.name ? "is-hovered" : ""}`}
              onClick={() => go("Cash Accounts")}
              onMouseEnter={() => setActiveCashSegment(group)}
              onMouseLeave={() => setActiveCashSegment(null)}
              type="button"
              key={group.name}
            >
              <i className={`account-icon ${group.tone}`}>{group.code}</i>
              <span className="cash-position-name"><b>{group.name}</b><small>{group.accounts.length} {group.detail}</small></span>
              <span className="cash-position-balance"><strong>{formatIDR(group.balance)}</strong><i><b className={group.tone} style={{ width: `${group.percentage}%` }} /></i></span>
            </button>
          ))}
        </div>
      </article>
      <RevenueExpenseChart openReport={() => go("Reports")} />
      <article className="panel category-panel expense-category-card">
        <div className="panel-head">
          <div>
            <h2>Expense by Category</h2>
            <p>Distribusi bulan berjalan</p>
          </div>
          <button
            aria-label="Opsi Expense by Category"
            onClick={() => go("Reports")}
            title="Lihat Laporan Pengeluaran Lengkap"
            type="button"
          >
            <HugeiconsIcon icon={MoreVerticalIcon} size={18} strokeWidth={1.8} />
          </button>
        </div>
        <div className="expense-donut-wrap">
          {activeExpenseCategory && (
            <div className="tremor-chart-tooltip tremor-donut-tooltip">
              <p className="tremor-tooltip-label">Expense Category</p>
              <p className="tremor-tooltip-value" style={{ color: activeExpenseCategory.color }}>
                {activeExpenseCategory.label}
              </p>
              <div className="tremor-tooltip-diff">
                <span className="diff-percentage" style={{ color: activeExpenseCategory.color }}>
                  {formatIDR(activeExpenseCategory.amount)}
                </span>
                <span className="diff-context">({activeExpenseCategory.value}% dari total)</span>
              </div>
            </div>
          )}
          <div className="expense-donut-box">
            <svg
              className="expense-donut-svg"
              viewBox="0 0 160 160"
              role="img"
              aria-label="Distribusi pengeluaran berdasarkan kategori"
            >
              <g transform="rotate(-90 80 80)">
                {(() => {
                  let accumulated = 0;
                  const r = 58;
                  const c = 2 * Math.PI * r;
                  return expenseCategories.map((category) => {
                    const strokeLen = (category.value / 100) * c - 2;
                    const offset = -(accumulated / 100) * c;
                    accumulated += category.value;
                    const isActive = activeExpenseCategory?.label === category.label;
                    return (
                      <circle
                        key={category.label}
                        cx="80"
                        cy="80"
                        r={r}
                        fill="transparent"
                        stroke={category.color}
                        strokeWidth={isActive ? 28 : 24}
                        strokeDasharray={`${strokeLen} ${c - strokeLen}`}
                        strokeDashoffset={offset}
                        className={`donut-slice ${isActive ? "active" : ""}`}
                        onMouseEnter={() => setActiveExpenseCategory(category)}
                        onMouseLeave={() => setActiveExpenseCategory(null)}
                        tabIndex={0}
                        role="graphics-symbol"
                        aria-label={`${category.label}: ${category.value}% (${formatIDR(category.amount)})`}
                      />
                    );
                  });
                })()}
              </g>
            </svg>
            <div className="expense-donut-center">
              <strong>
                {activeExpenseCategory
                  ? activeExpenseCategory.amount >= 1000000000
                    ? `Rp ${(activeExpenseCategory.amount / 1000000000).toFixed(2).replace(".", ",")} M`
                    : `Rp ${(activeExpenseCategory.amount / 1000000).toFixed(1).replace(".", ",")} jt`
                  : "Rp 846,7 jt"}
              </strong>
              <span>
                {activeExpenseCategory
                  ? `${activeExpenseCategory.label} (${activeExpenseCategory.value}%)`
                  : "Total expense"}
              </span>
            </div>
          </div>
        </div>
        <div className="expense-category-grid">
          {expenseCategories.map((category) => {
            const isHovered = activeExpenseCategory?.label === category.label;
            return (
              <div
                className={`expense-category-item ${isHovered ? "active" : ""}`}
                key={category.label}
                onMouseEnter={() => setActiveExpenseCategory(category)}
                onMouseLeave={() => setActiveExpenseCategory(null)}
                role="button"
                tabIndex={0}
              >
                <div className="category-item-head">
                  <span className="category-item-name">
                    <i className="category-dot" style={{ backgroundColor: category.color }} />
                    {category.label}
                  </span>
                  <strong className="category-item-pct">{category.value}%</strong>
                </div>
                <span className="expense-category-progress">
                  <i
                    style={{
                      width: `${category.value}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </span>
              </div>
            );
          })}
        </div>
      </article>
    </section>
    <article className="panel performance-panel">
      <div className="panel-head">
        <div>
          <h2>Project Financial Performance</h2>
          <p>Profitabilitas dan realisasi margin proyek aktif periode berjalan</p>
        </div>
        <button className="treasury-link-action" onClick={() => go("Projects")} type="button">
          Lihat Seluruh Proyek ({projectRows.length}) →
        </button>
      </div>
      <div className="table-wrap">
        <table className="performance-table">
          <thead>
            <tr>
              <th style={{ width: "24%" }}>Proyek & Klien</th>
              <th style={{ width: "15%" }}>Status & Durasi</th>
              <th style={{ width: "16%", textAlign: "right" }}>Pendapatan (Revenue)</th>
              <th style={{ width: "15%", textAlign: "right" }}>Beban (Expense)</th>
              <th style={{ width: "16%", textAlign: "right" }}>Laba Bersih (Net Profit)</th>
              <th style={{ width: "14%", textAlign: "right" }}>Margin (%)</th>
            </tr>
          </thead>
          <tbody>
            {projectRows.slice(0, 3).map((project) => {
              const profit = project.revenue - project.expense;
              const marginPct = Math.round((profit / project.revenue) * 100);
              const costPct = Math.round((project.expense / project.revenue) * 100);
              return (
                <tr
                  key={project.name}
                  className="performance-row"
                  onClick={() => go("Projects")}
                  title={`Klik untuk membuka modul detail ${project.name}`}
                >
                  <td>
                    <div className="project-cell-meta">
                      <div className="project-name-line">
                        <span className="project-code-tag">{project.code}</span>
                        <strong className="project-name">{project.name}</strong>
                      </div>
                      <span className="project-client-name">{project.client}</span>
                    </div>
                  </td>
                  <td>
                    <div className="project-status-cell">
                      <StatusBadge status={project.status} />
                      <span className="project-date-range">{project.start.split(" ")[1]} – {project.end.split(" ")[1]} 2026</span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="finance-cell">
                      <strong className="mono-num font-semibold text-ink">{formatIDR(project.revenue)}</strong>
                      <span className="finance-sub-label">Termin terposting</span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="finance-cell">
                      <span className="mono-num text-negative font-semibold">{formatIDR(project.expense)}</span>
                      <span className="finance-sub-label">{costPct}% dari revenue</span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="finance-cell">
                      <strong className="mono-num text-positive font-bold">+{formatIDR(profit)}</strong>
                      <span className="finance-sub-label">Laba operasional</span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className="project-margin-badge">{marginPct}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="performance-summary-row">
              <td colSpan={2}>
                <div className="summary-title">
                  <strong>Total Portofolio Aktif</strong>
                  <span>3 proyek konstruksi berjalan</span>
                </div>
              </td>
              <td style={{ textAlign: "right" }}>
                <strong className="mono-num text-ink">{formatIDR(1124000000)}</strong>
              </td>
              <td style={{ textAlign: "right" }}>
                <strong className="mono-num text-negative">{formatIDR(744750000)}</strong>
              </td>
              <td style={{ textAlign: "right" }}>
                <strong className="mono-num text-positive font-bold">+{formatIDR(379250000)}</strong>
              </td>
              <td style={{ textAlign: "right" }}>
                <span className="project-margin-badge aggregate">33,7% Avg</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </article>
  </>;
}

function KpiLineChart({ points, negative }: { points: number[]; negative: boolean }) {
  const width = 116;
  const height = 48;
  const padding = 4;
  const step = (width - (padding * 2)) / (points.length - 1);
  const coordinates = points.map((point, index) => ({ x: padding + (index * step), y: height - padding - ((point / 100) * (height - (padding * 2))) }));
  const linePoints = coordinates.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = `${padding},${height - padding} ${linePoints} ${width - padding},${height - padding}`;

  return (
    <div className={`kpi-linechart ${negative ? "negative" : ""}`} role="img" aria-label={`Tren ${negative ? "kenaikan biaya" : "pertumbuhan"} tujuh periode terakhir`}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polygon className="kpi-line-area" points={areaPoints} />
        <polyline className="kpi-line-path" points={linePoints} />
      </svg>
    </div>
  );
}

type PeriodRange = "7D" | "30D" | "3M" | "6M" | "1Y" | "2026" | "2025" | "2024";

interface ChartDataItem {
  month: string;
  monthFull: string;
  revenue: number; // in Juta
  expense: number; // in Juta
}

const multiPeriodData: Record<PeriodRange, { label: string; data: ChartDataItem[] }> = {
  "7D": {
    label: "7 Hari Terakhir (15 – 21 Agu 2026)",
    data: [
      { month: "15 Agu", monthFull: "15 Agustus 2026", revenue: 45, expense: 28 },
      { month: "16 Agu", monthFull: "16 Agustus 2026", revenue: 38, expense: 32 },
      { month: "17 Agu", monthFull: "17 Agustus 2026", revenue: 62, expense: 41 },
      { month: "18 Agu", monthFull: "18 Agustus 2026", revenue: 54, expense: 36 },
      { month: "19 Agu", monthFull: "19 Agustus 2026", revenue: 71, expense: 48 },
      { month: "20 Agu", monthFull: "20 Agustus 2026", revenue: 84, expense: 52 },
      { month: "21 Agu", monthFull: "21 Agustus 2026", revenue: 95, expense: 63 },
    ],
  },
  "30D": {
    label: "30 Hari Terakhir (Agustus 2026)",
    data: [
      { month: "Mgg 1", monthFull: "1 – 7 Agustus 2026", revenue: 280, expense: 190 },
      { month: "Mgg 2", monthFull: "8 – 14 Agustus 2026", revenue: 320, expense: 215 },
      { month: "Mgg 3", monthFull: "15 – 21 Agustus 2026", revenue: 410, expense: 265 },
      { month: "Mgg 4", monthFull: "22 – 31 Agustus 2026 (Est)", revenue: 274, expense: 176.75 },
    ],
  },
  "3M": {
    label: "3 Bulan Terakhir (Jun – Agu 2026)",
    data: [
      { month: "Jun", monthFull: "Juni 2026", revenue: 1040, expense: 720 },
      { month: "Jul", monthFull: "Juli 2026", revenue: 960, expense: 680 },
      { month: "Agu", monthFull: "Agustus 2026", revenue: 1284, expense: 846.75 },
    ],
  },
  "6M": {
    label: "6 Bulan Terakhir (Mar – Agu 2026)",
    data: [
      { month: "Mar", monthFull: "Maret 2026", revenue: 760, expense: 540 },
      { month: "Apr", monthFull: "April 2026", revenue: 880, expense: 610 },
      { month: "Mei", monthFull: "Mei 2026", revenue: 820, expense: 590 },
      { month: "Jun", monthFull: "Juni 2026", revenue: 1040, expense: 720 },
      { month: "Jul", monthFull: "Juli 2026", revenue: 960, expense: 680 },
      { month: "Agu", monthFull: "Agustus 2026", revenue: 1284, expense: 846.75 },
    ],
  },
  "1Y": {
    label: "1 Tahun Terakhir (Sep 2025 – Agu 2026)",
    data: [
      { month: "Sep 25", monthFull: "September 2025", revenue: 650, expense: 480 },
      { month: "Okt 25", monthFull: "Oktober 2025", revenue: 720, expense: 510 },
      { month: "Nov 25", monthFull: "November 2025", revenue: 690, expense: 490 },
      { month: "Des 25", monthFull: "Desember 2025", revenue: 850, expense: 590 },
      { month: "Jan 26", monthFull: "Januari 2026", revenue: 680, expense: 490 },
      { month: "Feb 26", monthFull: "Februari 2026", revenue: 710, expense: 500 },
      { month: "Mar 26", monthFull: "Maret 2026", revenue: 760, expense: 540 },
      { month: "Apr 26", monthFull: "April 2026", revenue: 880, expense: 610 },
      { month: "Mei 26", monthFull: "Mei 2026", revenue: 820, expense: 590 },
      { month: "Jun 26", monthFull: "Juni 2026", revenue: 1040, expense: 720 },
      { month: "Jul 26", monthFull: "Juli 2026", revenue: 960, expense: 680 },
      { month: "Agu 26", monthFull: "Agustus 2026", revenue: 1284, expense: 846.75 },
    ],
  },
  "2026": {
    label: "Tahun Anggaran 2026 (YTD Jan – Agu)",
    data: [
      { month: "Jan", monthFull: "Januari 2026", revenue: 680, expense: 490 },
      { month: "Feb", monthFull: "Februari 2026", revenue: 710, expense: 500 },
      { month: "Mar", monthFull: "Maret 2026", revenue: 760, expense: 540 },
      { month: "Apr", monthFull: "April 2026", revenue: 880, expense: 610 },
      { month: "Mei", monthFull: "Mei 2026", revenue: 820, expense: 590 },
      { month: "Jun", monthFull: "Juni 2026", revenue: 1040, expense: 720 },
      { month: "Jul", monthFull: "Juli 2026", revenue: 960, expense: 680 },
      { month: "Agu", monthFull: "Agustus 2026", revenue: 1284, expense: 846.75 },
    ],
  },
  "2025": {
    label: "Tahun Buku 2025 (12 Bulan)",
    data: [
      { month: "Jan", monthFull: "Januari 2025", revenue: 520, expense: 380 },
      { month: "Feb", monthFull: "Februari 2025", revenue: 550, expense: 410 },
      { month: "Mar", monthFull: "Maret 2025", revenue: 610, expense: 430 },
      { month: "Apr", monthFull: "April 2025", revenue: 580, expense: 420 },
      { month: "Mei", monthFull: "Mei 2025", revenue: 640, expense: 460 },
      { month: "Jun", monthFull: "Juni 2025", revenue: 700, expense: 510 },
      { month: "Jul", monthFull: "Juli 2025", revenue: 680, expense: 490 },
      { month: "Agu", monthFull: "Agustus 2025", revenue: 740, expense: 530 },
      { month: "Sep", monthFull: "September 2025", revenue: 650, expense: 480 },
      { month: "Okt", monthFull: "Oktober 2025", revenue: 720, expense: 510 },
      { month: "Nov", monthFull: "November 2025", revenue: 690, expense: 490 },
      { month: "Des", monthFull: "Desember 2025", revenue: 850, expense: 590 },
    ],
  },
  "2024": {
    label: "Tahun Buku 2024 (12 Bulan)",
    data: [
      { month: "Jan", monthFull: "Januari 2024", revenue: 380, expense: 290 },
      { month: "Feb", monthFull: "Februari 2024", revenue: 410, expense: 310 },
      { month: "Mar", monthFull: "Maret 2024", revenue: 450, expense: 330 },
      { month: "Apr", monthFull: "April 2024", revenue: 430, expense: 320 },
      { month: "Mei", monthFull: "Mei 2024", revenue: 480, expense: 350 },
      { month: "Jun", monthFull: "Juni 2024", revenue: 520, expense: 390 },
      { month: "Jul", monthFull: "Juli 2024", revenue: 510, expense: 380 },
      { month: "Agu", monthFull: "Agustus 2024", revenue: 560, expense: 410 },
      { month: "Sep", monthFull: "September 2024", revenue: 530, expense: 390 },
      { month: "Okt", monthFull: "Oktober 2024", revenue: 570, expense: 420 },
      { month: "Nov", monthFull: "November 2024", revenue: 550, expense: 400 },
      { month: "Des", monthFull: "Desember 2024", revenue: 680, expense: 490 },
    ],
  },
};

function calculateChartScale(maxVal: number) {
  if (maxVal <= 100) {
    return {
      maximum: 100,
      ticks: [
        { value: 100, label: "Rp 100 Jt" },
        { value: 75, label: "Rp 75 Jt" },
        { value: 50, label: "Rp 50 Jt" },
        { value: 25, label: "Rp 25 Jt" },
        { value: 0, label: "Rp 0" },
      ],
    };
  }
  if (maxVal <= 500) {
    return {
      maximum: 500,
      ticks: [
        { value: 500, label: "Rp 500 Jt" },
        { value: 375, label: "Rp 375 Jt" },
        { value: 250, label: "Rp 250 Jt" },
        { value: 125, label: "Rp 125 Jt" },
        { value: 0, label: "Rp 0" },
      ],
    };
  }
  if (maxVal <= 800) {
    return {
      maximum: 800,
      ticks: [
        { value: 800, label: "Rp 800 Jt" },
        { value: 600, label: "Rp 600 Jt" },
        { value: 400, label: "Rp 400 Jt" },
        { value: 200, label: "Rp 200 Jt" },
        { value: 0, label: "Rp 0" },
      ],
    };
  }
  if (maxVal <= 1200) {
    return {
      maximum: 1200,
      ticks: [
        { value: 1200, label: "Rp 1,2 M" },
        { value: 900, label: "Rp 900 Jt" },
        { value: 600, label: "Rp 600 Jt" },
        { value: 300, label: "Rp 300 Jt" },
        { value: 0, label: "Rp 0" },
      ],
    };
  }
  return {
    maximum: 1600,
    ticks: [
      { value: 1600, label: "Rp 1,6 M" },
      { value: 1200, label: "Rp 1,2 M" },
      { value: 800, label: "Rp 800 Jt" },
      { value: 400, label: "Rp 400 Jt" },
      { value: 0, label: "Rp 0" },
    ],
  };
}

function RevenueExpenseChart({ openReport }: { openReport: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<{
    month: string;
    series: "Revenue" | "Expense";
    value: number;
    growth: number | null;
    columnIndex: number;
  } | null>(null);

  const data = multiPeriodData["6M"].data;
  const maximum = 1600;
  const yTicks = [
    { value: 1600, label: "Rp 1,6 M" },
    { value: 1200, label: "Rp 1,2 M" },
    { value: 800, label: "Rp 800 Jt" },
    { value: 400, label: "Rp 400 Jt" },
    { value: 0, label: "Rp 0" },
  ];

  return (
    <>
      <article className="panel chart-panel revenue-expense-card">
        <div className="panel-head">
          <div>
            <h2>Revenue vs Expense</h2>
            <p>Perbandingan pendapatan dan pengeluaran · 6 bulan terakhir</p>
          </div>
          <div className="panel-head-actions">
            <button
              className="chart-expand-action-btn"
              onClick={() => setIsExpanded(true)}
              type="button"
              title="Perbesar visual & pilih rentang waktu"
            >
              <HugeiconsIcon icon={ArrowExpand01Icon} size={14} strokeWidth={2.2} />
              <span>Expand</span>
            </button>
            <button onClick={openReport} type="button">
              View report →
            </button>
          </div>
        </div>
        <ul className="chart-metrics" aria-label="Ringkasan Revenue dan Expense">
          <li>
            <div className="chart-series-label">
              <i className="revenue" />
              <span>Revenue</span>
            </div>
            <div>
              <strong>Rp 5,74 M</strong>
              <small className="positive">+12,5%</small>
            </div>
          </li>
          <li>
            <div className="chart-series-label">
              <i className="expense" />
              <span>Expense</span>
            </div>
            <div>
              <strong>Rp 3,99 M</strong>
              <small className="negative">+4,2%</small>
            </div>
          </li>
        </ul>
        <div
          className="grouped-chart"
          role="img"
          aria-label="Revenue dan expense bulanan dari Maret hingga Agustus 2026 dalam juta rupiah"
        >
          <div className="chart-canvas">
            <div className="chart-grid-ticks" aria-hidden="true">
              {yTicks.map((tick, idx) => {
                const topPct = (idx / (yTicks.length - 1)) * 100;
                return (
                  <div
                    className="chart-grid-row"
                    key={tick.value}
                    style={{ top: `${topPct}%` }}
                  >
                    <span className="chart-y-label">{tick.label}</span>
                    <i className="chart-grid-line" />
                  </div>
                );
              })}
            </div>
            <div className="chart-plot-area">
              {activeTooltip && (
                <div
                  className="tremor-chart-tooltip"
                  style={{
                    left: `${Math.max(18, Math.min(82, ((activeTooltip.columnIndex + 0.5) / data.length) * 100))}%`,
                  }}
                >
                  <p className="tremor-tooltip-label">
                    {activeTooltip.month} · {activeTooltip.series}
                  </p>
                  <p className="tremor-tooltip-value">
                    {formatIDR(activeTooltip.value)}
                  </p>
                  <div className="tremor-tooltip-diff">
                    {activeTooltip.growth !== null ? (
                      <span
                        className={`diff-percentage ${
                          activeTooltip.growth > 0
                            ? activeTooltip.series === "Revenue"
                              ? "positive"
                              : "negative"
                            : activeTooltip.series === "Revenue"
                            ? "negative"
                            : "positive"
                        }`}
                      >
                        {activeTooltip.growth > 0 ? "+" : ""}
                        {activeTooltip.growth.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="diff-empty">--</span>
                    )}
                    <span className="diff-context">from previous month</span>
                  </div>
                </div>
              )}
              <div className="chart-groups">
                {data.map((item, index) => {
                  const prev = index > 0 ? data[index - 1] : null;
                  const revGrowth = prev ? ((item.revenue - prev.revenue) / prev.revenue) * 100 : null;
                  const expGrowth = prev ? ((item.expense - prev.expense) / prev.expense) * 100 : null;

                  return (
                    <div className="chart-month" key={item.month}>
                      <div className="chart-bar-pair">
                        <i
                          className={`revenue-bar ${
                            activeTooltip?.columnIndex === index && activeTooltip?.series === "Revenue"
                              ? "active"
                              : ""
                          }`}
                          style={{ height: `${(item.revenue / maximum) * 100}%` }}
                          onMouseEnter={() =>
                            setActiveTooltip({
                              month: item.monthFull,
                              series: "Revenue",
                              value: item.revenue * 1000000,
                              growth: revGrowth,
                              columnIndex: index,
                            })
                          }
                          onMouseLeave={() => setActiveTooltip(null)}
                          tabIndex={0}
                          role="img"
                          aria-label={`${item.monthFull} Revenue: ${formatIDR(item.revenue * 1000000)}`}
                        />
                        <i
                          className={`expense-bar ${
                            activeTooltip?.columnIndex === index && activeTooltip?.series === "Expense"
                              ? "active"
                              : ""
                          }`}
                          style={{ height: `${(item.expense / maximum) * 100}%` }}
                          onMouseEnter={() =>
                            setActiveTooltip({
                              month: item.monthFull,
                              series: "Expense",
                              value: item.expense * 1000000,
                              growth: expGrowth,
                              columnIndex: index,
                            })
                          }
                          onMouseLeave={() => setActiveTooltip(null)}
                          tabIndex={0}
                          role="img"
                          aria-label={`${item.monthFull} Expense: ${formatIDR(item.expense * 1000000)}`}
                        />
                      </div>
                      <span className="chart-month-label">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Expanded Modal Dialog */}
      <ExpandedRevenueExpenseModal
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        openReport={openReport}
      />
    </>
  );
}

interface ExpandedRevenueExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  openReport?: () => void;
}

function ExpandedRevenueExpenseModal({ isOpen, onClose, openReport }: ExpandedRevenueExpenseModalProps) {
  const [selectedRange, setSelectedRange] = useState<PeriodRange>("6M");
  const [activeTooltip, setActiveTooltip] = useState<{
    month: string;
    series: "Revenue" | "Expense";
    value: number;
    growth: number | null;
    columnIndex: number;
  } | null>(null);

  // Lock body scroll and close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentDataset = multiPeriodData[selectedRange];
  const chartData = currentDataset.data;
  const highestValue = Math.max(...chartData.map((d) => Math.max(d.revenue, d.expense)));
  const { maximum, ticks } = calculateChartScale(highestValue);

  // Aggregated metrics
  const totalRevenue = chartData.reduce((acc, d) => acc + d.revenue, 0) * 1000000;
  const totalExpense = chartData.reduce((acc, d) => acc + d.expense, 0) * 1000000;
  const netProfit = totalRevenue - totalExpense;
  const netMarginPct = totalRevenue ? Math.round((netProfit / totalRevenue) * 1000) / 10 : 0;
  const monthlyAvgRevenue = totalRevenue / chartData.length;

  const filterOptions: { label: string; value: PeriodRange }[] = [
    { label: "7D", value: "7D" },
    { label: "30D", value: "30D" },
    { label: "3M", value: "3M" },
    { label: "6M", value: "6M" },
    { label: "1Y", value: "1Y" },
    { label: "2026", value: "2026" },
    { label: "2025", value: "2025" },
    { label: "2024", value: "2024" },
  ];

  return (
    <div className="modal-backdrop chart-expand-modal-backdrop" onClick={onClose}>
      <div
        className="modal-content chart-expand-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chart-modal-title"
      >
        {/* Modal Header */}
        <div className="chart-modal-header">
          <div className="chart-modal-title-wrap">
            <h2 id="chart-modal-title">Revenue vs Expense Multi-Periode</h2>
            <p>{currentDataset.label} · Analisis komparatif kinerja portofolio keuangan</p>
          </div>
          <button className="chart-modal-close-btn" onClick={onClose} type="button" aria-label="Tutup Dialog">
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Filter Controls Row matching user's segmented control design */}
        <div className="chart-modal-controls-row">
          <div className="segmented-period-control" role="tablist" aria-label="Pilih Rentang Waktu">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`segmented-period-btn ${selectedRange === opt.value ? "active" : ""}`}
                onClick={() => {
                  setSelectedRange(opt.value);
                  setActiveTooltip(null);
                }}
                role="tab"
                aria-selected={selectedRange === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="chart-series-legend">
            <div className="chart-series-label">
              <i className="revenue" />
              <span>Revenue (Pendapatan)</span>
            </div>
            <div className="chart-series-label">
              <i className="expense" />
              <span>Expense (Beban Proyek)</span>
            </div>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="chart-modal-kpi-grid">
          <div className="chart-modal-kpi-card">
            <div className="kpi-micro-head">
              <HugeiconsIcon icon={MoneyReceive01Icon} size={16} strokeWidth={1.8} />
              <span>Total Revenue</span>
            </div>
            <strong>{formatIDR(totalRevenue)}</strong>
            <small className="positive">+12,5% YoY Growth</small>
          </div>
          <div className="chart-modal-kpi-card">
            <div className="kpi-micro-head">
              <HugeiconsIcon icon={MoneySend01Icon} size={16} strokeWidth={1.8} />
              <span>Total Expense</span>
            </div>
            <strong>{formatIDR(totalExpense)}</strong>
            <small className="negative">+4,2% Cost Ratio</small>
          </div>
          <div className="chart-modal-kpi-card">
            <div className="kpi-micro-head">
              <HugeiconsIcon icon={Wallet02Icon} size={16} strokeWidth={1.8} />
              <span>Laba Operasional</span>
            </div>
            <strong className="text-positive">+{formatIDR(netProfit)}</strong>
            <small className="neutral">Net Cash Generated</small>
          </div>
          <div className="chart-modal-kpi-card">
            <div className="kpi-micro-head">
              <HugeiconsIcon icon={Chart01Icon} size={16} strokeWidth={1.8} />
              <span>Net Margin</span>
            </div>
            <strong>{netMarginPct}%</strong>
            <small className="positive">Avg {formatIDR(monthlyAvgRevenue)} / bln</small>
          </div>
        </div>

        {/* Main Expanded Grouped Bar Chart */}
        <div className="expanded-chart-container">
          <div className="expanded-chart-canvas">
            {/* Gridlines & Y-labels */}
            <div className="chart-grid-ticks" aria-hidden="true">
              {ticks.map((tick, idx) => {
                const topPct = (idx / (ticks.length - 1)) * 100;
                return (
                  <div className="chart-grid-row" key={tick.value} style={{ top: `${topPct}%` }}>
                    <span className="chart-y-label">{tick.label}</span>
                    <i className="chart-grid-line" />
                  </div>
                );
              })}
            </div>

            {/* Plot Area with Interactive Tooltips */}
            <div className="chart-plot-area">
              {activeTooltip && (
                <div
                  className="tremor-chart-tooltip"
                  style={{
                    left: `${Math.max(14, Math.min(86, ((activeTooltip.columnIndex + 0.5) / chartData.length) * 100))}%`,
                  }}
                >
                  <p className="tremor-tooltip-label">
                    {activeTooltip.month} · {activeTooltip.series}
                  </p>
                  <p className="tremor-tooltip-value">{formatIDR(activeTooltip.value)}</p>
                  <div className="tremor-tooltip-diff">
                    {activeTooltip.growth !== null ? (
                      <span
                        className={`diff-percentage ${
                          activeTooltip.growth > 0
                            ? activeTooltip.series === "Revenue"
                              ? "positive"
                              : "negative"
                            : activeTooltip.series === "Revenue"
                            ? "negative"
                            : "positive"
                        }`}
                      >
                        {activeTooltip.growth > 0 ? "+" : ""}
                        {activeTooltip.growth.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="diff-empty">--</span>
                    )}
                    <span className="diff-context">from previous period</span>
                  </div>
                </div>
              )}

              <div className="chart-groups">
                {chartData.map((item, index) => {
                  const prev = index > 0 ? chartData[index - 1] : null;
                  const revGrowth = prev ? ((item.revenue - prev.revenue) / prev.revenue) * 100 : null;
                  const expGrowth = prev ? ((item.expense - prev.expense) / prev.expense) * 100 : null;

                  return (
                    <div className="chart-month" key={item.month}>
                      <div className="chart-bar-pair">
                        <i
                          className={`revenue-bar ${
                            activeTooltip?.columnIndex === index && activeTooltip?.series === "Revenue" ? "active" : ""
                          }`}
                          style={{ height: `${(item.revenue / maximum) * 100}%` }}
                          onMouseEnter={() =>
                            setActiveTooltip({
                              month: item.monthFull,
                              series: "Revenue",
                              value: item.revenue * 1000000,
                              growth: revGrowth,
                              columnIndex: index,
                            })
                          }
                          onMouseLeave={() => setActiveTooltip(null)}
                          tabIndex={0}
                          role="img"
                          aria-label={`${item.monthFull} Revenue: ${formatIDR(item.revenue * 1000000)}`}
                        />
                        <i
                          className={`expense-bar ${
                            activeTooltip?.columnIndex === index && activeTooltip?.series === "Expense" ? "active" : ""
                          }`}
                          style={{ height: `${(item.expense / maximum) * 100}%` }}
                          onMouseEnter={() =>
                            setActiveTooltip({
                              month: item.monthFull,
                              series: "Expense",
                              value: item.expense * 1000000,
                              growth: expGrowth,
                              columnIndex: index,
                            })
                          }
                          onMouseLeave={() => setActiveTooltip(null)}
                          tabIndex={0}
                          role="img"
                          aria-label={`${item.monthFull} Expense: ${formatIDR(item.expense * 1000000)}`}
                        />
                      </div>
                      <span className="chart-month-label">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tabular Breakdown Table */}
        <div className="chart-modal-table-wrap">
          <div className="table-header-row">
            <h3>Rincian Kinerja Finansial ({chartData.length} Periode)</h3>
          </div>
          <table className="chart-modal-table">
            <thead>
              <tr>
                <th>Periode</th>
                <th style={{ textAlign: "right" }}>Revenue</th>
                <th style={{ textAlign: "right" }}>Expense</th>
                <th style={{ textAlign: "right" }}>Laba Operasional</th>
                <th style={{ textAlign: "right" }}>Margin %</th>
                <th style={{ textAlign: "right" }}>MoM Growth</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, idx) => {
                const prev = idx > 0 ? chartData[idx - 1] : null;
                const profit = (item.revenue - item.expense) * 1000000;
                const margin = Math.round((profit / (item.revenue * 1000000)) * 1000) / 10;
                const growth = prev ? ((item.revenue - prev.revenue) / prev.revenue) * 100 : null;

                return (
                  <tr key={item.month}>
                    <td>
                      <strong>{item.monthFull}</strong>
                    </td>
                    <td style={{ textAlign: "right" }} className="mono-num text-ink">
                      {formatIDR(item.revenue * 1000000)}
                    </td>
                    <td style={{ textAlign: "right" }} className="mono-num text-negative">
                      {formatIDR(item.expense * 1000000)}
                    </td>
                    <td style={{ textAlign: "right" }} className="mono-num text-positive font-bold">
                      +{formatIDR(profit)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="margin-pill">{margin}%</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {growth !== null ? (
                        <span className={`growth-indicator ${growth >= 0 ? "positive" : "negative"}`}>
                          <HugeiconsIcon
                            icon={growth >= 0 ? ArrowUpRight01Icon : ArrowDownRight01Icon}
                            size={14}
                            strokeWidth={2}
                          />
                          {growth > 0 ? "+" : ""}
                          {growth.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="growth-indicator neutral">--</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="chart-modal-footer">
          <button className="secondary-button" onClick={onClose} type="button">
            Tutup
          </button>
          {openReport && (
            <button
              className="primary-button"
              onClick={() => {
                onClose();
                openReport();
              }}
              type="button"
            >
              <span>Buka Modul Laporan Keuangan</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
