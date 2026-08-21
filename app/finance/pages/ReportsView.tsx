"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import { FilterBar, PageIntro } from "../components/ui";
import { APReport } from "./reports/APReport";
import { ARReport } from "./reports/ARReport";
import { BalanceSheetReport } from "./reports/BalanceSheetReport";
import { CashFlowReport } from "./reports/CashFlowReport";
import { GeneralLedgerReport } from "./reports/GeneralLedgerReport";
import { ProfitLossReport } from "./reports/ProfitLossReport";
import { ReportPlaceholder } from "./reports/ReportPlaceholder";

const reportTabs = ["Cashflow", "P&L", "Balance Sheet", "General Ledger", "AR", "AP"];

export function ReportsView({
  notify,
  report,
  setReport,
}: {
  notify: (message: string) => void;
  report: string;
  setReport: (report: string) => void;
}) {
  const [selectedPeriod, setSelectedPeriod] = useState("01–20 Agustus 2026");
  const [scope, setScope] = useState("All Projects + Corporate");
  const [project, setProject] = useState("All Projects");

  const titles: Record<string, string> = {
    Cashflow: "Statement of Cash Flows",
    "P&L": "Profit & Loss Statement",
    "Balance Sheet": "Statement of Financial Position",
    "General Ledger": "General Ledger",
    AR: "Accounts Receivable (Buku Piutang & Aging)",
    AP: "Accounts Payable (Buku Hutang & Aging)",
  };
  const period =
    report === "Balance Sheet"
      ? "As of 20 August 2026"
      : "For the period 01–20 August 2026";

  return (
    <>
      <PageIntro
        title="Financial Reports"
        description="Laporan formal yang dapat ditelusuri hingga transaksi sumber."
        action={
          <>
            <button
              className="secondary-button"
              onClick={() => notify("Laporan Excel siap diunduh.")}
              type="button"
            >
              <HugeiconsIcon icon={Download01Icon} size={17} strokeWidth={1.8} />
              <span>Export Excel</span>
            </button>
            <button
              className="primary-button"
              onClick={() => notify("Laporan PDF siap diunduh.")}
              type="button"
            >
              <HugeiconsIcon icon={Download01Icon} size={17} strokeWidth={1.8} />
              <span>Export PDF</span>
            </button>
          </>
        }
      />

      <div className="treasury-tab-nav" style={{ marginBottom: "14px" }} role="tablist" aria-label="Jenis laporan keuangan">
        {reportTabs.map((item) => (
          <button
            className={`treasury-tab-item ${report === item ? "active" : ""}`}
            role="tab"
            aria-selected={report === item}
            onClick={() => setReport(item)}
            key={item}
            type="button"
          >
            <span>{item}</span>
          </button>
        ))}
      </div>

      <FilterBar>
        <label className="select-control">
          Periode
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="01–20 Agustus 2026">01–20 Agustus 2026</option>
            <option value="Juli 2026">Juli 2026</option>
            <option value="Juni 2026">Juni 2026</option>
            <option value="Tahun 2026 (YTD)">Tahun 2026 (YTD)</option>
          </select>
        </label>
        <label className="select-control">
          Scope
          <select value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="All Projects + Corporate">All Projects + Corporate</option>
            <option value="Project only">Project only</option>
            <option value="Corporate only">Corporate only</option>
          </select>
        </label>
        <label className="select-control">
          Project
          <select value={project} onChange={(e) => setProject(e.target.value)}>
            <option value="All Projects">All Projects</option>
            <option value="Hotel Gamelan">Hotel Gamelan</option>
            <option value="Villa Ubud">Villa Ubud</option>
            <option value="Kantor Sentosa">Kantor Sentosa</option>
          </select>
        </label>
        <button className="filter-apply" onClick={() => notify("Filter laporan diterapkan.")} type="button">
          Apply Filters
        </button>
      </FilterBar>

      <article className={`panel report-sheet ${report === "General Ledger" ? "gl-sheet" : ""}`}>
        <div className="report-heading">
          <div className="report-logo">CK</div>
          <div>
            <h2>CV. Cipta Karya Jaya Sentosa</h2>
            <p>{titles[report] ?? `${report} Report`}</p>
            <small>{period} · All Projects + Corporate · IDR</small>
          </div>
          <span className="report-basis">UNAUDITED</span>
        </div>
        {report === "P&L" ? (
          <ProfitLossReport />
        ) : report === "Cashflow" ? (
          <CashFlowReport />
        ) : report === "Balance Sheet" ? (
          <BalanceSheetReport />
        ) : report === "General Ledger" ? (
          <GeneralLedgerReport />
        ) : report === "AR" ? (
          <ARReport />
        ) : report === "AP" ? (
          <APReport />
        ) : (
          <ReportPlaceholder report={report} />
        )}
      </article>
    </>
  );
}
