import { ReportLine } from "./ReportLine";

export function ReportPlaceholder({ report }: { report: string }) {
  const lines =
    report === "Cashflow"
      ? [
          ["Opening Cash Balance", "Rp 1.974.500.000"],
          ["Cash Inflow", "Rp 1.284.000.000"],
          ["Cash Outflow", "(Rp 820.000.000)"],
          ["Closing Cash Balance", "Rp 2.438.500.000"],
        ]
      : report === "Balance Sheet"
      ? [
          ["Cash & Bank", "Rp 2.438.500.000"],
          ["Accounts Receivable", "Rp 200.000.000"],
          ["Accounts Payable", "(Rp 68.500.000)"],
          ["Net Liquid Assets", "Rp 2.570.000.000"],
        ]
      : [
          ["Opening balance", "Rp 1.974.500.000"],
          ["Posted debits", "Rp 1.284.000.000"],
          ["Posted credits", "(Rp 820.000.000)"],
          ["Closing balance", "Rp 2.438.500.000"],
        ];

  return (
    <div className="formal-report placeholder-statement">
      <section>
        <h3>{report.toUpperCase()} SUMMARY</h3>
        {lines.slice(0, -1).map(([label, value]) => (
          <ReportLine key={label} label={label} amount={value} indent />
        ))}
        {lines.length > 0 && (
          <ReportLine
            label={lines[lines.length - 1][0]}
            amount={lines[lines.length - 1][1]}
            total
          />
        )}
      </section>
    </div>
  );
}
