"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import { FilterBar, PageIntro } from "../components/ui";
import { BalanceSheetReport } from "./reports/BalanceSheetReport";
import { CashFlowReport } from "./reports/CashFlowReport";
import { GeneralLedgerReport } from "./reports/GeneralLedgerReport";
import { ProfitLossReport } from "./reports/ProfitLossReport";
import { ReportPlaceholder } from "./reports/ReportPlaceholder";

export function ReportsView({ notify, report }: { notify: (message: string) => void; report: string }) {
  const titles: Record<string, string> = { Cashflow: "Statement of Cash Flows", "P&L": "Profit & Loss Statement", "Balance Sheet": "Statement of Financial Position", "General Ledger": "General Ledger" };
  const period = report === "Balance Sheet" ? "As of 20 August 2026" : "For the period 01–20 August 2026";
  return <><PageIntro title="Financial Reports" description="Laporan formal yang dapat ditelusuri hingga transaksi sumber." action={<><button className="secondary-button" onClick={() => notify("Laporan Excel siap diunduh.")} type="button"><HugeiconsIcon icon={Download01Icon} size={17} strokeWidth={1.8} /> Export Excel</button><button className="primary-button" onClick={() => notify("Laporan PDF siap diunduh.")} type="button"><HugeiconsIcon icon={Download01Icon} size={17} strokeWidth={1.8} /> Export PDF</button></>} /><FilterBar><label className="select-control">Periode<select><option>01–20 Agustus 2026</option><option>Juli 2026</option></select></label><label className="select-control">Scope<select><option>All Projects + Corporate</option><option>Project only</option><option>Corporate only</option></select></label><label className="select-control">Project<select><option>All Projects</option><option>Hotel Gamelan</option><option>Villa Ubud</option></select></label><button className="filter-apply" type="button">Apply Filters</button></FilterBar><article className={`panel report-sheet ${report === "General Ledger" ? "gl-sheet" : ""}`}><div className="report-heading"><div className="report-logo">CK</div><div><h2>CV. Cipta Karya Jaya Sentosa</h2><p>{titles[report] ?? `${report} Report`}</p><small>{period} · All Projects + Corporate · IDR</small></div><span className="report-basis">UNAUDITED</span></div>{report === "P&L" ? <ProfitLossReport /> : report === "Cashflow" ? <CashFlowReport /> : report === "Balance Sheet" ? <BalanceSheetReport /> : report === "General Ledger" ? <GeneralLedgerReport /> : <ReportPlaceholder report={report} />}</article></>;
}
