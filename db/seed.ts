export const CKJS_IDS = {
  company: "00000000-0000-4000-8000-000000000001",
  ownerJason: "00000000-0000-4000-8000-000000000011",
  ownerSecond: "00000000-0000-4000-8000-000000000012",
  contacts: {
    aruna: "00000000-0000-4000-8000-000000000101",
    nusantara: "00000000-0000-4000-8000-000000000102",
    sinar: "00000000-0000-4000-8000-000000000103",
    beton: "00000000-0000-4000-8000-000000000104",
  },
  projects: {
    gamelan: "00000000-0000-4000-8000-000000000201",
    ubud: "00000000-0000-4000-8000-000000000202",
    sentosa: "00000000-0000-4000-8000-000000000203",
  },
  accounts: {
    cash: "00000000-0000-4000-8000-000000000301",
    receivable: "00000000-0000-4000-8000-000000000302",
    payable: "00000000-0000-4000-8000-000000000303",
    equity: "00000000-0000-4000-8000-000000000304",
    revenue: "00000000-0000-4000-8000-000000000305",
    material: "00000000-0000-4000-8000-000000000306",
    labour: "00000000-0000-4000-8000-000000000307",
    operations: "00000000-0000-4000-8000-000000000308",
    overhead: "00000000-0000-4000-8000-000000000309",
  },
};

export async function seedDatabase(db: D1Database) {
  const exists = await db.prepare("SELECT id FROM companies WHERE id = ?").bind(CKJS_IDS.company).first();
  if (exists) return false;

  const { company, ownerJason, ownerSecond, contacts, projects, accounts } = CKJS_IDS;
  const statements = [
    db.prepare("INSERT INTO companies (id, name, default_currency, timezone) VALUES (?, ?, 'IDR', 'Asia/Jakarta')").bind(company, "CV. Cipta Karya Jaya Sentosa"),
    db.prepare("INSERT INTO users (id, company_id, name, email_or_username, password_hash, role) VALUES (?, ?, ?, ?, ?, 'OWNER')").bind(ownerJason, company, "Jason Ibrahim", "jason@ckjs.co.id", "$platform-auth$workspace-identity"),
    db.prepare("INSERT INTO users (id, company_id, name, email_or_username, password_hash, role) VALUES (?, ?, ?, ?, ?, 'OWNER')").bind(ownerSecond, company, "Co-owner CKJS", "owner@ckjs.co.id", "$platform-auth$workspace-identity"),
    ...[
      [contacts.aruna, "C001", "PT Aruna Hospitality", "CLIENT"],
      [contacts.nusantara, "C002", "Nusantara Living", "CLIENT"],
      [contacts.sinar, "V001", "UD Sinar Baja", "VENDOR"],
      [contacts.beton, "V002", "PT Beton Perkasa", "VENDOR"],
    ].map((row) => db.prepare("INSERT INTO contacts (id, company_id, code, name, contact_type) VALUES (?, ?, ?, ?, ?)").bind(row[0], company, row[1], row[2], row[3])),
    db.prepare("INSERT INTO projects (id, company_id, project_code, name, client_contact_id, location, contract_value, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')").bind(projects.gamelan, company, "PRJ-026", "Hotel Gamelan", contacts.aruna, "Gamelan", 480000000, "2026-01-10", "2026-11-20"),
    db.prepare("INSERT INTO projects (id, company_id, project_code, name, client_contact_id, location, contract_value, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')").bind(projects.ubud, company, "PRJ-024", "Villa Ubud", contacts.nusantara, "Ubud", 364000000, "2026-02-08", "2026-10-12"),
    db.prepare("INSERT INTO projects (id, company_id, project_code, name, location, contract_value, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')").bind(projects.sentosa, company, "PRJ-019", "Kantor Sentosa", "Sentosa", 280000000, "2026-03-18", "2026-12-28"),
    ...[
      [accounts.cash, "1-1101", "Cash and Bank", "ASSET", "DEBIT", "BALANCE_SHEET", 10],
      [accounts.receivable, "1-1300", "Accounts Receivable", "ASSET", "DEBIT", "BALANCE_SHEET", 20],
      [accounts.payable, "2-1100", "Accounts Payable", "LIABILITY", "CREDIT", "BALANCE_SHEET", 30],
      [accounts.equity, "3-1000", "Owner's Capital", "EQUITY", "CREDIT", "BALANCE_SHEET", 40],
      [accounts.revenue, "4-1001", "Pendapatan Termin", "REVENUE", "CREDIT", "PROFIT_LOSS", 50],
      [accounts.material, "5-1101", "Biaya Material", "DIRECT_COST", "DEBIT", "PROFIT_LOSS", 60],
      [accounts.labour, "5-1201", "Tenaga Kerja", "DIRECT_COST", "DEBIT", "PROFIT_LOSS", 70],
      [accounts.operations, "5-1301", "Operasional Proyek", "OVERHEAD", "DEBIT", "PROFIT_LOSS", 80],
      [accounts.overhead, "6-1001", "Beban Kantor", "OVERHEAD", "DEBIT", "PROFIT_LOSS", 90],
    ].map((row) => db.prepare("INSERT INTO accounts (id, company_id, code, name, account_group, normal_balance, report_type, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(row[0], company, row[1], row[2], row[3], row[4], row[5], row[6])),
    ...[
      ["00000000-0000-4000-8000-000000000401", "BANK-BCA", "Bank Operasional BCA", "BANK", null, "BCA", "0678832901"],
      ["00000000-0000-4000-8000-000000000402", "BANK-MANDIRI", "Bank Mandiri", "BANK", null, "Mandiri", "1450087620"],
      ["00000000-0000-4000-8000-000000000403", "GIRO-BCA", "Giro BCA", "GIRO", null, "BCA", "0670184226"],
      ["00000000-0000-4000-8000-000000000404", "CASH-GAMELAN", "Kas Gamelan", "PROJECT_CASH", projects.gamelan, null, null],
      ["00000000-0000-4000-8000-000000000405", "CASH-UBUD", "Kas Villa Ubud", "PROJECT_CASH", projects.ubud, null, null],
      ["00000000-0000-4000-8000-000000000406", "CASH-SENTOSA", "Kas Kantor Sentosa", "PROJECT_CASH", projects.sentosa, null, null],
    ].map((row) => db.prepare("INSERT INTO cash_accounts (id, company_id, code, name, cash_type, ledger_account_id, project_id, bank_name, account_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(row[0], company, row[1], row[2], row[3], accounts.cash, row[4], row[5], row[6])),
    db.prepare("INSERT INTO audit_logs (id, company_id, actor_user_id, action, entity_type, entity_id, new_value) VALUES (?, ?, ?, 'BOOTSTRAP', 'company', ?, ?)").bind(crypto.randomUUID(), company, ownerJason, company, JSON.stringify({ source: "CKJS_Data_Dictionary_v1.0" })),
  ];
  await db.batch(statements);
  return true;
}
