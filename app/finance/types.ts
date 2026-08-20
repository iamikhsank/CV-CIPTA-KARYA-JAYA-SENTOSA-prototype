export type View = "Dashboard" | "Projects" | "Transactions" | "Cash Accounts" | "Receivables" | "Payables" | "Reports" | "Masters" | "Migration" | "Settings";

export type TransactionStatus = "DRAFT" | "POSTED" | "REVERSED";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  project: string;
  category: string;
  account: string;
  contact: string;
  amount: number;
  type: "Income" | "Expense" | "Transfer";
  status: TransactionStatus;
};

export type Project = {
  name: string;
  code: string;
  client: string;
  start: string;
  end: string;
  revenue: number;
  expense: number;
  status: string;
  color: string;
};

export type CashAccount = {
  name: string;
  no: string;
  type: string;
  project: string;
  balance: number;
  tone: string;
};

export type LedgerRecordStatus = "OUTSTANDING" | "PARTIAL" | "PAID";

export type LedgerRecord = {
  party: string;
  project: string;
  ref: string;
  total: number;
  paid: number;
  due: string;
  status: LedgerRecordStatus;
};

export type PaymentInput = {
  amount: number;
  account: string;
  date: string;
  reference: string;
  notes: string;
};

export type PaymentHistoryRow = {
  date: string;
  reference: string;
  account: string;
  amount: number;
};
