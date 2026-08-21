import { databaseStatus, ensureDatabase } from "../db/runtime";
import { CKJS_IDS, seedDatabase } from "../db/seed";

type ApiEnv = { DB: D1Database };
type JsonRecord = Record<string, unknown>;

const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "cache-control": "no-store" } });
const fail = (message: string, status = 400, details?: unknown) =>
  json({ ok: false, error: message, details }, status);
const now = () => Date.now();
const asText = (value: unknown, name: string, required = true) => {
  if (value == null && !required) return null;
  if (typeof value !== "string" || (required && !value.trim())) throw new Error(`${name} wajib diisi.`);
  return value.trim();
};
const asAmount = (value: unknown, name: string, allowZero = false) => {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < (allowZero ? 0 : 1)) {
    throw new Error(`${name} harus berupa bilangan bulat Rupiah yang valid.`);
  }
  return value;
};
const bodyOf = async (request: Request) => {
  try {
    return (await request.json()) as JsonRecord;
  } catch {
    throw new Error("Body JSON tidak valid.");
  }
};

async function actorFor(request: Request, db: D1Database, write = false) {
  const email = request.headers.get("oai-authenticated-user-email");
  if (!email) {
    const host = new URL(request.url).hostname;
    if (host === "localhost" || host === "127.0.0.1") return CKJS_IDS.ownerJason;
    if (write) throw new Response("Authentication required", { status: 401 });
    return null;
  }
  const actor = await db
    .prepare("SELECT id FROM users WHERE company_id = ? AND lower(email_or_username) = lower(?) AND is_active = 1")
    .bind(CKJS_IDS.company, email)
    .first<{ id: string }>();
  if (!actor && write) throw new Response("User is not authorized for CKJS", { status: 403 });
  return actor?.id ?? null;
}

function sourceIp(request: Request) {
  return request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}

function auditStatement(db: D1Database, actorId: string | null, action: string, entityType: string, entityId: string, oldValue: unknown, newValue: unknown, request: Request) {
  return db
    .prepare("INSERT INTO audit_logs (id, company_id, actor_user_id, action, entity_type, entity_id, old_value, new_value, source_ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(crypto.randomUUID(), CKJS_IDS.company, actorId, action, entityType, entityId, oldValue == null ? null : JSON.stringify(oldValue), newValue == null ? null : JSON.stringify(newValue), sourceIp(request));
}

const listQueries: Record<string, string> = {
  projects: `SELECT p.*, c.name AS client_name FROM projects p LEFT JOIN contacts c ON c.id = p.client_contact_id WHERE p.company_id = ? ORDER BY p.project_code`,
  contacts: `SELECT * FROM contacts WHERE company_id = ? ORDER BY code`,
  accounts: `SELECT a.*, p.code AS parent_code FROM accounts a LEFT JOIN accounts p ON p.id = a.parent_account_id WHERE a.company_id = ? ORDER BY a.display_order, a.code`,
  "cash-accounts": `SELECT ca.*, p.name AS project_name, a.code AS ledger_account_code, COALESCE(v.balance, 0) AS balance FROM cash_accounts ca JOIN accounts a ON a.id = ca.ledger_account_id LEFT JOIN projects p ON p.id = ca.project_id LEFT JOIN vw_cash_balances v ON v.cash_account_id = ca.id WHERE ca.company_id = ? ORDER BY ca.cash_type, ca.name`,
  "migration-batches": `SELECT * FROM migration_batches WHERE company_id = ? ORDER BY created_at DESC`,
  "audit-logs": `SELECT al.*, u.name AS actor_name FROM audit_logs al LEFT JOIN users u ON u.id = al.actor_user_id WHERE al.company_id = ? ORDER BY al.created_at DESC LIMIT 250`,
};

async function listResource(resource: string, db: D1Database) {
  const query = listQueries[resource];
  if (!query) return null;
  const result = await db.prepare(query).bind(CKJS_IDS.company).all();
  return result.results;
}

async function createMaster(resource: string, request: Request, db: D1Database) {
  const body = await bodyOf(request);
  const actorId = await actorFor(request, db, true);
  const entityId = crypto.randomUUID();
  let statement: D1PreparedStatement;

  if (resource === "contacts") {
    const type = asText(body.contactType, "contactType");
    if (!["CLIENT", "VENDOR", "EMPLOYEE", "OTHER"].includes(type!)) throw new Error("contactType tidak valid.");
    statement = db.prepare("INSERT INTO contacts (id, company_id, code, name, contact_type, phone, email, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(entityId, CKJS_IDS.company, asText(body.code, "code"), asText(body.name, "name"), type, asText(body.phone, "phone", false), asText(body.email, "email", false), asText(body.address, "address", false));
  } else if (resource === "projects") {
    statement = db.prepare("INSERT INTO projects (id, company_id, project_code, name, client_contact_id, location, contract_value, start_date, end_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(entityId, CKJS_IDS.company, asText(body.projectCode, "projectCode"), asText(body.name, "name"), asText(body.clientContactId, "clientContactId", false), asText(body.location, "location", false), asAmount(body.contractValue ?? 0, "contractValue", true), asText(body.startDate, "startDate", false), asText(body.endDate, "endDate", false), asText(body.status ?? "ACTIVE", "status"), asText(body.notes, "notes", false));
  } else if (resource === "accounts") {
    const group = asText(body.accountGroup, "accountGroup");
    const normal = asText(body.normalBalance, "normalBalance", false);
    const report = asText(body.reportType, "reportType", false);
    const postable = body.isPostable !== false;
    if (postable && (!normal || !report)) throw new Error("Akun posting memerlukan normalBalance dan reportType.");
    statement = db.prepare("INSERT INTO accounts (id, company_id, code, name, parent_account_id, account_group, normal_balance, report_type, is_postable, display_order, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(entityId, CKJS_IDS.company, asText(body.code, "code"), asText(body.name, "name"), asText(body.parentAccountId, "parentAccountId", false), group, normal, report, postable ? 1 : 0, asAmount(body.displayOrder ?? 0, "displayOrder", true), asText(body.notes, "notes", false));
  } else if (resource === "cash-accounts") {
    const cashType = asText(body.cashType, "cashType");
    const projectId = asText(body.projectId, "projectId", false);
    if (cashType === "PROJECT_CASH" && !projectId) throw new Error("projectId wajib untuk PROJECT_CASH.");
    statement = db.prepare("INSERT INTO cash_accounts (id, company_id, code, name, cash_type, ledger_account_id, project_id, bank_name, account_number, currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(entityId, CKJS_IDS.company, asText(body.code, "code"), asText(body.name, "name"), cashType, asText(body.ledgerAccountId, "ledgerAccountId"), projectId, asText(body.bankName, "bankName", false), asText(body.accountNumber, "accountNumber", false), asText(body.currency ?? "IDR", "currency"));
  } else {
    return null;
  }

  await db.batch([statement, auditStatement(db, actorId, "CREATE", resource, entityId, null, body, request)]);
  return { id: entityId };
}

async function mutateMaster(resource: string, id: string, request: Request, db: D1Database) {
  const table = ({ projects: "projects", contacts: "contacts", accounts: "accounts", "cash-accounts": "cash_accounts" } as Record<string, string>)[resource];
  if (!table) return null;
  const actorId = await actorFor(request, db, true);
  const existing = await db.prepare(`SELECT * FROM ${table} WHERE id = ? AND company_id = ?`).bind(id, CKJS_IDS.company).first();
  if (!existing) throw new Response("Not found", { status: 404 });

  if (request.method === "DELETE") {
    await db.batch([
      db.prepare(`UPDATE ${table} SET is_active = 0, updated_at = ? WHERE id = ? AND company_id = ?`).bind(now(), id, CKJS_IDS.company),
      auditStatement(db, actorId, "DISABLE", resource, id, existing, { is_active: false }, request),
    ]);
    return { id, isActive: false };
  }

  const body = await bodyOf(request);
  const allowed: Record<string, Record<string, string>> = {
    projects: { name: "name", location: "location", contractValue: "contract_value", startDate: "start_date", endDate: "end_date", status: "status", notes: "notes", clientContactId: "client_contact_id" },
    contacts: { name: "name", contactType: "contact_type", phone: "phone", email: "email", address: "address", isActive: "is_active" },
    accounts: { name: "name", accountGroup: "account_group", normalBalance: "normal_balance", reportType: "report_type", displayOrder: "display_order", notes: "notes", isActive: "is_active" },
    "cash-accounts": { name: "name", bankName: "bank_name", accountNumber: "account_number", currency: "currency", isActive: "is_active" },
  };
  const entries = Object.entries(body).filter(([key]) => allowed[resource][key]);
  if (!entries.length) throw new Error("Tidak ada field yang dapat diperbarui.");
  const setSql = entries.map(([key]) => `${allowed[resource][key]} = ?`).join(", ");
  const values = entries.map(([, value]) => typeof value === "boolean" ? (value ? 1 : 0) : value);
  await db.batch([
    db.prepare(`UPDATE ${table} SET ${setSql}, updated_at = ? WHERE id = ? AND company_id = ?`).bind(...values, now(), id, CKJS_IDS.company),
    auditStatement(db, actorId, "UPDATE", resource, id, existing, body, request),
  ]);
  return { id };
}

type JournalLineInput = { accountId: string; projectId?: string | null; cashAccountId?: string | null; contactId?: string | null; debit: number; credit: number; quantity?: number | null; memo?: string | null };

async function validateLines(db: D1Database, raw: unknown): Promise<JournalLineInput[]> {
  if (!Array.isArray(raw) || raw.length < 2) throw new Error("Minimal dua journal line diperlukan.");
  const lines = raw.map((value, index) => {
    const line = value as JsonRecord;
    const debit = asAmount(line.debit ?? 0, `lines[${index}].debit`, true);
    const credit = asAmount(line.credit ?? 0, `lines[${index}].credit`, true);
    if ((debit > 0) === (credit > 0)) throw new Error(`Journal line ${index + 1} harus debit atau kredit, bukan keduanya.`);
    return { accountId: asText(line.accountId, `lines[${index}].accountId`)!, projectId: asText(line.projectId, "projectId", false), cashAccountId: asText(line.cashAccountId, "cashAccountId", false), contactId: asText(line.contactId, "contactId", false), debit, credit, quantity: typeof line.quantity === "number" ? line.quantity : null, memo: asText(line.memo, "memo", false) };
  });
  const debit = lines.reduce((sum, line) => sum + line.debit, 0);
  const credit = lines.reduce((sum, line) => sum + line.credit, 0);
  if (debit <= 0 || debit !== credit) throw new Error(`Jurnal tidak seimbang. Debit ${debit}, kredit ${credit}.`);

  for (const line of lines) {
    const account = await db.prepare("SELECT id, is_postable FROM accounts WHERE id = ? AND company_id = ? AND is_active = 1").bind(line.accountId, CKJS_IDS.company).first<{ id: string; is_postable: number }>();
    if (!account?.is_postable) throw new Error(`Akun ${line.accountId} tidak valid atau bukan akun posting.`);
    if (line.cashAccountId) {
      const cash = await db.prepare("SELECT ledger_account_id FROM cash_accounts WHERE id = ? AND company_id = ? AND is_active = 1").bind(line.cashAccountId, CKJS_IDS.company).first<{ ledger_account_id: string }>();
      if (!cash || cash.ledger_account_id !== line.accountId) throw new Error("cashAccountId tidak cocok dengan ledger account pada journal line.");
    }
  }
  return lines;
}

async function createTransaction(request: Request, db: D1Database) {
  const body = await bodyOf(request);
  const actorId = await actorFor(request, db, true);
  const lines = await validateLines(db, body.lines);
  const scope = asText(body.businessScope, "businessScope")!;
  const projectId = asText(body.projectId, "projectId", false);
  if (scope === "PROJECT" && !projectId) throw new Error("projectId wajib untuk transaksi PROJECT.");
  const txDate = asText(body.txDate, "txDate")!;
  const transactionId = crypto.randomUUID();
  const txNumber = `TX-${txDate.replaceAll("-", "")}-${transactionId.slice(0, 8).toUpperCase()}`;
  const status = body.status === "POSTED" ? "POSTED" : "DRAFT";
  const statements = [
    db.prepare("INSERT INTO transactions (id, company_id, tx_number, tx_date, tx_type, business_scope, project_id, reference_no, description, status, source, created_by, posted_by, posted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(transactionId, CKJS_IDS.company, txNumber, txDate, asText(body.txType, "txType"), scope, projectId, asText(body.referenceNo, "referenceNo", false), asText(body.description, "description"), status, asText(body.source ?? "MANUAL", "source"), actorId, status === "POSTED" ? actorId : null, status === "POSTED" ? now() : null),
    ...lines.map((line, index) => db.prepare("INSERT INTO transaction_lines (id, transaction_id, line_no, account_id, project_id, cash_account_id, contact_id, debit, credit, quantity, memo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), transactionId, index + 1, line.accountId, line.projectId ?? projectId, line.cashAccountId ?? null, line.contactId ?? null, line.debit, line.credit, line.quantity ?? null, line.memo ?? null)),
    auditStatement(db, actorId, status === "POSTED" ? "CREATE_POSTED" : "CREATE_DRAFT", "transaction", transactionId, null, { txNumber, status }, request),
  ];
  await db.batch(statements);
  return { id: transactionId, txNumber, status };
}

async function listTransactions(url: URL, db: D1Database) {
  const status = url.searchParams.get("status");
  const projectId = url.searchParams.get("projectId");
  const result = await db.prepare(`SELECT t.*, p.name AS project_name,
    (SELECT SUM(debit) FROM transaction_lines WHERE transaction_id = t.id) AS amount,
    (SELECT COUNT(*) FROM transaction_lines WHERE transaction_id = t.id) AS line_count
    FROM transactions t LEFT JOIN projects p ON p.id = t.project_id
    WHERE t.company_id = ? AND (? IS NULL OR t.status = ?) AND (? IS NULL OR t.project_id = ?)
    ORDER BY t.tx_date DESC, t.created_at DESC LIMIT 500`)
    .bind(CKJS_IDS.company, status, status, projectId, projectId).all();
  return result.results;
}

async function postTransaction(id: string, request: Request, db: D1Database) {
  const actorId = await actorFor(request, db, true);
  const tx = await db.prepare("SELECT * FROM transactions WHERE id = ? AND company_id = ?").bind(id, CKJS_IDS.company).first<JsonRecord>();
  if (!tx) throw new Response("Not found", { status: 404 });
  if (tx.status !== "DRAFT") throw new Error("Hanya transaksi DRAFT yang dapat diposting.");
  const totals = await db.prepare("SELECT SUM(debit) AS debit, SUM(credit) AS credit, COUNT(*) AS lines FROM transaction_lines WHERE transaction_id = ?").bind(id).first<{ debit: number; credit: number; lines: number }>();
  if (!totals || totals.lines < 2 || totals.debit !== totals.credit || totals.debit <= 0) throw new Error("Transaksi tidak memiliki jurnal yang seimbang.");
  await db.batch([
    db.prepare("UPDATE transactions SET status = 'POSTED', posted_by = ?, posted_at = ?, updated_at = ? WHERE id = ?").bind(actorId, now(), now(), id),
    auditStatement(db, actorId, "POST", "transaction", id, { status: "DRAFT" }, { status: "POSTED" }, request),
  ]);
  return { id, status: "POSTED" };
}

async function reverseTransaction(id: string, request: Request, db: D1Database) {
  const actorId = await actorFor(request, db, true);
  const tx = await db.prepare("SELECT * FROM transactions WHERE id = ? AND company_id = ?").bind(id, CKJS_IDS.company).first<JsonRecord>();
  if (!tx) throw new Response("Not found", { status: 404 });
  if (tx.status !== "POSTED") throw new Error("Hanya transaksi POSTED yang dapat direversal.");
  const existing = await db.prepare("SELECT id FROM transactions WHERE reversal_of_transaction_id = ?").bind(id).first();
  if (existing) throw new Error("Transaksi sudah pernah direversal.");
  const lines = await db.prepare("SELECT * FROM transaction_lines WHERE transaction_id = ? ORDER BY line_no").bind(id).all<JsonRecord>();
  const reversalId = crypto.randomUUID();
  const txNumber = `RV-${String(tx.tx_number).slice(3)}-${reversalId.slice(0, 4).toUpperCase()}`;
  const statements = [
    db.prepare("INSERT INTO transactions (id, company_id, tx_number, tx_date, tx_type, business_scope, project_id, reference_no, description, status, source, created_by, posted_by, posted_at, reversal_of_transaction_id) VALUES (?, ?, ?, ?, 'REVERSAL', ?, ?, ?, ?, 'POSTED', 'SYSTEM', ?, ?, ?, ?)")
      .bind(reversalId, CKJS_IDS.company, txNumber, new Date().toISOString().slice(0, 10), tx.business_scope, tx.project_id, tx.reference_no, `Reversal: ${tx.description}`, actorId, actorId, now(), id),
    ...lines.results.map((line) => db.prepare("INSERT INTO transaction_lines (id, transaction_id, line_no, account_id, project_id, cash_account_id, contact_id, debit, credit, quantity, memo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), reversalId, line.line_no, line.account_id, line.project_id, line.cash_account_id, line.contact_id, line.credit, line.debit, line.quantity, `Reversal: ${line.memo ?? ""}`)),
    db.prepare("UPDATE transactions SET status = 'REVERSED', updated_at = ? WHERE id = ?").bind(now(), id),
    auditStatement(db, actorId, "REVERSE", "transaction", id, { status: "POSTED" }, { status: "REVERSED", reversalId }, request),
  ];
  await db.batch(statements);
  return { id, status: "REVERSED", reversalId, reversalTxNumber: txNumber };
}

async function listLedgerItems(url: URL, db: D1Database) {
  const type = url.searchParams.get("type");
  if (type && !["AP", "AR"].includes(type)) throw new Error("type harus AP atau AR.");
  const result = await db.prepare("SELECT * FROM vw_ap_ar_outstanding WHERE company_id = ? AND (? IS NULL OR item_type = ?) ORDER BY due_date, reference_no").bind(CKJS_IDS.company, type, type).all();
  return result.results;
}

async function createLedgerItem(request: Request, db: D1Database) {
  const body = await bodyOf(request);
  const actorId = await actorFor(request, db, true);
  const id = crypto.randomUUID();
  const type = asText(body.itemType, "itemType")!;
  if (!["AP", "AR"].includes(type)) throw new Error("itemType harus AP atau AR.");
  await db.batch([
    db.prepare("INSERT INTO ap_ar_items (id, company_id, item_type, contact_id, project_id, reference_no, description, issue_date, due_date, original_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(id, CKJS_IDS.company, type, asText(body.contactId, "contactId"), asText(body.projectId, "projectId", false), asText(body.referenceNo, "referenceNo"), asText(body.description, "description", false), asText(body.issueDate, "issueDate"), asText(body.dueDate, "dueDate", false), asAmount(body.originalAmount, "originalAmount")),
    auditStatement(db, actorId, "CREATE", "ap_ar_item", id, null, body, request),
  ]);
  return { id };
}

async function settleLedgerItem(id: string, request: Request, db: D1Database) {
  const body = await bodyOf(request);
  const actorId = await actorFor(request, db, true);
  const item = await db.prepare("SELECT * FROM vw_ap_ar_outstanding WHERE id = ? AND company_id = ?").bind(id, CKJS_IDS.company).first<JsonRecord>();
  if (!item) throw new Response("Not found", { status: 404 });
  const amount = asAmount(body.amount, "amount");
  if (amount > Number(item.outstanding_amount)) throw new Error("Pembayaran melebihi outstanding.");
  const cashAccountId = asText(body.cashAccountId, "cashAccountId")!;
  const cash = await db.prepare("SELECT ledger_account_id FROM cash_accounts WHERE id = ? AND company_id = ? AND is_active = 1").bind(cashAccountId, CKJS_IDS.company).first<{ ledger_account_id: string }>();
  if (!cash) throw new Error("Cash account tidak valid.");
  const offsetAccountId = asText(body.offsetAccountId, "offsetAccountId")!;
  const transactionId = crypto.randomUUID();
  const settlementId = crypto.randomUUID();
  const date = asText(body.settlementDate, "settlementDate")!;
  const txNumber = `${item.item_type === "AR" ? "RC" : "PY"}-${date.replaceAll("-", "")}-${transactionId.slice(0, 8).toUpperCase()}`;
  const ar = item.item_type === "AR";
  await db.batch([
    db.prepare("INSERT INTO transactions (id, company_id, tx_number, tx_date, tx_type, business_scope, project_id, reference_no, description, status, source, created_by, posted_by, posted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'POSTED', 'MANUAL', ?, ?, ?)")
      .bind(transactionId, CKJS_IDS.company, txNumber, date, ar ? "AR_RECEIPT" : "AP_PAYMENT", item.project_id ? "PROJECT" : "CORPORATE", item.project_id, item.reference_no, `${ar ? "Penerimaan" : "Pembayaran"} ${item.reference_no}`, actorId, actorId, now()),
    db.prepare("INSERT INTO transaction_lines (id, transaction_id, line_no, account_id, project_id, cash_account_id, contact_id, debit, credit, memo) VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), transactionId, ar ? cash.ledger_account_id : offsetAccountId, item.project_id, ar ? cashAccountId : null, item.contact_id, ar ? amount : 0, ar ? 0 : amount, "Settlement counterparty"),
    db.prepare("INSERT INTO transaction_lines (id, transaction_id, line_no, account_id, project_id, cash_account_id, contact_id, debit, credit, memo) VALUES (?, ?, 2, ?, ?, ?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), transactionId, ar ? offsetAccountId : cash.ledger_account_id, item.project_id, ar ? null : cashAccountId, item.contact_id, ar ? 0 : amount, ar ? amount : 0, "Settlement cash"),
    db.prepare("INSERT INTO ap_ar_settlements (id, ap_ar_item_id, transaction_id, settlement_date, amount, notes) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(settlementId, id, transactionId, date, amount, asText(body.notes, "notes", false)),
    auditStatement(db, actorId, "SETTLE", "ap_ar_item", id, { outstanding: item.outstanding_amount }, { amount, transactionId }, request),
  ]);
  return { id: settlementId, transactionId, txNumber };
}

async function dashboard(db: D1Database) {
  const [cash, projects, pnl, receivables, payables, recent] = await Promise.all([
    db.prepare("SELECT * FROM vw_cash_balances WHERE company_id = ? ORDER BY cash_type, name").bind(CKJS_IDS.company).all(),
    db.prepare("SELECT * FROM vw_project_pnl WHERE company_id = ? ORDER BY project_code").bind(CKJS_IDS.company).all(),
    db.prepare("SELECT * FROM vw_company_pnl WHERE company_id = ?").bind(CKJS_IDS.company).first(),
    db.prepare("SELECT * FROM vw_ap_ar_outstanding WHERE company_id = ? AND item_type = 'AR'").bind(CKJS_IDS.company).all(),
    db.prepare("SELECT * FROM vw_ap_ar_outstanding WHERE company_id = ? AND item_type = 'AP'").bind(CKJS_IDS.company).all(),
    db.prepare("SELECT id, tx_number, tx_date, tx_type, description, status FROM transactions WHERE company_id = ? ORDER BY tx_date DESC, created_at DESC LIMIT 10").bind(CKJS_IDS.company).all(),
  ]);
  return { cashAccounts: cash.results, projects: projects.results, pnl, receivables: receivables.results, payables: payables.results, recentTransactions: recent.results };
}

async function report(name: string, db: D1Database) {
  const query = ({
    "general-ledger": "SELECT * FROM vw_general_ledger WHERE company_id = ? ORDER BY account_code, tx_date, transaction_id, line_no",
    "cash-balances": "SELECT * FROM vw_cash_balances WHERE company_id = ? ORDER BY cash_type, name",
    "project-pnl": "SELECT * FROM vw_project_pnl WHERE company_id = ? ORDER BY project_code",
    "company-pnl": "SELECT * FROM vw_company_pnl WHERE company_id = ?",
    "balance-sheet": "SELECT * FROM vw_balance_sheet_accounts WHERE company_id = ? ORDER BY code",
    cashflow: "SELECT * FROM vw_cashflow_lines WHERE company_id = ? ORDER BY tx_date, transaction_id",
    "ap-ar-outstanding": "SELECT * FROM vw_ap_ar_outstanding WHERE company_id = ? ORDER BY item_type, due_date",
  } as Record<string, string>)[name];
  if (!query) return null;
  return (await db.prepare(query).bind(CKJS_IDS.company).all()).results;
}

export async function handleApi(request: Request, env: ApiEnv): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/")) return null;
  if (!env.DB) return fail("D1 binding DB belum tersedia.", 503);

  try {
    await ensureDatabase(env.DB);
    await seedDatabase(env.DB);

    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({ ok: true, service: "ckjs-finance-api", database: await databaseStatus(env.DB) });
    }
    if (url.pathname === "/api/v1/bootstrap" && request.method === "GET") {
      return json({ ok: true, data: await dashboard(env.DB) });
    }
    if (url.pathname === "/api/v1/dashboard" && request.method === "GET") {
      return json({ ok: true, data: await dashboard(env.DB) });
    }

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] !== "api" || parts[1] !== "v1") return fail("Endpoint tidak ditemukan.", 404);
    const resource = parts[2];
    const id = parts[3];
    const action = parts[4];

    if (resource === "transactions") {
      if (!id && request.method === "GET") return json({ ok: true, data: await listTransactions(url, env.DB) });
      if (!id && request.method === "POST") return json({ ok: true, data: await createTransaction(request, env.DB) }, 201);
      if (id && action === "post" && request.method === "POST") return json({ ok: true, data: await postTransaction(id, request, env.DB) });
      if (id && action === "reverse" && request.method === "POST") return json({ ok: true, data: await reverseTransaction(id, request, env.DB) });
    }
    if (resource === "ledger-items") {
      if (!id && request.method === "GET") return json({ ok: true, data: await listLedgerItems(url, env.DB) });
      if (!id && request.method === "POST") return json({ ok: true, data: await createLedgerItem(request, env.DB) }, 201);
      if (id && action === "settlements" && request.method === "POST") return json({ ok: true, data: await settleLedgerItem(id, request, env.DB) }, 201);
    }
    if (resource === "reports" && id && request.method === "GET") {
      const data = await report(id, env.DB);
      return data ? json({ ok: true, data }) : fail("Laporan tidak ditemukan.", 404);
    }
    if (!id && request.method === "GET") {
      const data = await listResource(resource, env.DB);
      if (data) return json({ ok: true, data });
    }
    if (!id && request.method === "POST") {
      const data = await createMaster(resource, request, env.DB);
      if (data) return json({ ok: true, data }, 201);
    }
    if (id && (request.method === "PATCH" || request.method === "DELETE")) {
      const data = await mutateMaster(resource, id, request, env.DB);
      if (data) return json({ ok: true, data });
    }
    return fail("Endpoint tidak ditemukan.", 404);
  } catch (error) {
    if (error instanceof Response) return error;
    const message = error instanceof Error ? error.message : "Kesalahan backend tidak dikenal.";
    const conflict = /UNIQUE constraint failed/i.test(message);
    const constraint = /constraint failed|foreign key/i.test(message);
    return fail(message, conflict ? 409 : constraint ? 422 : 400);
  }
}
