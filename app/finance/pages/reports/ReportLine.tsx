export function ReportLine({
  label,
  amount,
  indent,
  subtotal,
  total,
}: {
  label: string;
  amount: string;
  indent?: boolean;
  subtotal?: boolean;
  total?: boolean;
}) {
  return (
    <div
      className={`formal-report-line ${indent ? "indent" : ""} ${
        subtotal ? "subtotal" : ""
      } ${total ? "grand-total" : ""}`}
    >
      <span className="report-line-label">{label}</span>
      <strong className="report-line-amount">{amount}</strong>
    </div>
  );
}
