export function ReportLine({ label, amount, indent, subtotal, total }: { label: string; amount: string; indent?: boolean; subtotal?: boolean; total?: boolean }) {
  return <div className={`formal-report-line ${indent ? "indent" : ""} ${subtotal ? "subtotal" : ""} ${total ? "grand-total" : ""}`}><span>{label}</span><strong>{amount}</strong></div>;
}
