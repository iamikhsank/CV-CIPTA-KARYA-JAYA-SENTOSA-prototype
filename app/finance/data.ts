import type { CashAccount, LedgerRecord, Project, Transaction } from "./types";

export const projectRows: Project[] = [
  { name: "Hotel Gamelan", code: "PRJ-026", client: "PT Aruna Hospitality", start: "10 Jan 2026", end: "20 Nov 2026", revenue: 480000000, expense: 302500000, status: "ACTIVE", color: "#3764e8" },
  { name: "Villa Ubud", code: "PRJ-024", client: "Nusantara Living", start: "08 Feb 2026", end: "12 Okt 2026", revenue: 364000000, expense: 248250000, status: "ACTIVE", color: "#10a57a" },
  { name: "Kantor Sentosa", code: "PRJ-019", client: "CV Karya Mandiri", start: "18 Mar 2026", end: "28 Des 2026", revenue: 280000000, expense: 194000000, status: "ACTIVE", color: "#8a56d7" },
  { name: "Gudang Karya", code: "PRJ-015", client: "PT Logistik Jaya", start: "05 Sep 2025", end: "30 Jun 2026", revenue: 160000000, expense: 102000000, status: "COMPLETED", color: "#e59430" },
];

export const initialTransactions: Transaction[] = [
  { id: "TX-202608-0038", date: "18 Agu 2026", description: "Pembelian material baja ringan", project: "Hotel Gamelan", category: "Material", account: "Kas Gamelan", contact: "UD Sinar Baja", amount: 24500000, type: "Expense", status: "POSTED" },
  { id: "TX-202608-0037", date: "17 Agu 2026", description: "Penerimaan termin pekerjaan II", project: "Villa Ubud", category: "Pendapatan Termin", account: "Giro BCA", contact: "Nusantara Living", amount: 120000000, type: "Income", status: "POSTED" },
  { id: "TX-202608-0036", date: "16 Agu 2026", description: "Drop dana operasional lapangan", project: "Kantor Sentosa", category: "Transfer Internal", account: "Bank Mandiri", contact: "—", amount: 40000000, type: "Transfer", status: "POSTED" },
  { id: "TX-202608-0035", date: "15 Agu 2026", description: "Sewa kendaraan proyek", project: "Hotel Gamelan", category: "Operasional Proyek", account: "Kas Gamelan", contact: "CV Prima Transport", amount: 8500000, type: "Expense", status: "DRAFT" },
  { id: "TX-202608-0034", date: "14 Agu 2026", description: "Internet dan utilitas kantor", project: "Corporate", category: "Beban Kantor", account: "Bank BCA", contact: "PT Telkom Indonesia", amount: 2850000, type: "Expense", status: "POSTED" },
  { id: "TX-202608-0033", date: "12 Agu 2026", description: "Koreksi pembayaran material", project: "Villa Ubud", category: "Material", account: "Kas Villa Ubud", contact: "Toko Bangunan Bali", amount: 6200000, type: "Expense", status: "REVERSED" },
];

export const cashSeed: CashAccount[] = [
  { name: "Bank Operasional BCA", no: "067 883 2901", type: "BANK", project: "Corporate", balance: 826500000, tone: "blue" },
  { name: "Bank Mandiri", no: "145 008 7620", type: "BANK", project: "Corporate", balance: 600000000, tone: "blue" },
  { name: "Giro BCA", no: "067 018 4226", type: "GIRO", project: "Corporate", balance: 684000000, tone: "green" },
  { name: "Kas Gamelan", no: "Kas Proyek", type: "PETTY CASH", project: "Hotel Gamelan", balance: 148000000, tone: "amber" },
  { name: "Kas Villa Ubud", no: "Kas Proyek", type: "PETTY CASH", project: "Villa Ubud", balance: 106000000, tone: "amber" },
  { name: "Kas Kantor Sentosa", no: "Kas Proyek", type: "PETTY CASH", project: "Kantor Sentosa", balance: 74000000, tone: "amber" },
];

export const receivables: LedgerRecord[] = [
  { party: "PT Aruna Hospitality", project: "Hotel Gamelan", ref: "INV/HG/08/026", total: 180000000, paid: 80000000, due: "30 Agu 2026", status: "PARTIAL" },
  { party: "Nusantara Living", project: "Villa Ubud", ref: "INV/VU/08/019", total: 120000000, paid: 0, due: "05 Sep 2026", status: "OUTSTANDING" },
  { party: "CV Karya Mandiri", project: "Kantor Sentosa", ref: "INV/KS/07/012", total: 95000000, paid: 95000000, due: "12 Agu 2026", status: "PAID" },
];

export const payables: LedgerRecord[] = [
  { party: "UD Sinar Baja", project: "Hotel Gamelan", ref: "SB-882/2026", total: 68000000, paid: 43500000, due: "28 Agu 2026", status: "PARTIAL" },
  { party: "PT Beton Perkasa", project: "Villa Ubud", ref: "BP-1008-44", total: 44000000, paid: 0, due: "02 Sep 2026", status: "OUTSTANDING" },
  { party: "CV Prima Transport", project: "Corporate", ref: "PT-0826-18", total: 8500000, paid: 8500000, due: "20 Agu 2026", status: "PAID" },
];

export const formatIDR = (amount: number) => `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;
