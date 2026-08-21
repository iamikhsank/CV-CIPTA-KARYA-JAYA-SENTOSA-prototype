import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text, uniqueIndex, type AnySQLiteColumn } from "drizzle-orm/sqlite-core";

const id = (name = "id") => text(name).primaryKey().$defaultFn(() => crypto.randomUUID());
const timestamp = (name: string) => integer(name, { mode: "timestamp_ms" }).notNull().defaultNow();
const bool = (name: string, defaultValue = true) => integer(name, { mode: "boolean" }).notNull().default(defaultValue);
const amount = (name: string) => integer(name).notNull().default(0);

export const companies = sqliteTable("companies", {
  id: id(), name: text("name").notNull(), address: text("address"), phone: text("phone"), email: text("email"),
  defaultCurrency: text("default_currency").notNull().default("IDR"), timezone: text("timezone").notNull().default("Asia/Jakarta"),
  isActive: bool("is_active"), createdAt: timestamp("created_at"), updatedAt: timestamp("updated_at"),
});

export const users = sqliteTable("users", {
  id: id(), companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }),
  name: text("name").notNull(), emailOrUsername: text("email_or_username").notNull(), passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["OWNER"] }).notNull().default("OWNER"), isActive: bool("is_active"),
  lastLoginAt: integer("last_login_at", { mode: "timestamp_ms" }), createdAt: timestamp("created_at"), updatedAt: timestamp("updated_at"),
}, (t) => [uniqueIndex("uq_users_company_login").on(t.companyId, t.emailOrUsername)]);

export const contacts = sqliteTable("contacts", {
  id: id(), companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }), code: text("code").notNull(),
  name: text("name").notNull(), contactType: text("contact_type", { enum: ["CLIENT", "VENDOR", "EMPLOYEE", "OTHER"] }).notNull(),
  phone: text("phone"), email: text("email"), address: text("address"), isActive: bool("is_active"),
  createdAt: timestamp("created_at"), updatedAt: timestamp("updated_at"),
}, (t) => [uniqueIndex("uq_contacts_company_code").on(t.companyId, t.code), index("idx_contacts_company_type").on(t.companyId, t.contactType)]);

export const projects = sqliteTable("projects", {
  id: id(), companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }), projectCode: text("project_code").notNull(),
  name: text("name").notNull(), clientContactId: text("client_contact_id").references(() => contacts.id, { onDelete: "restrict" }), location: text("location"),
  contractValue: amount("contract_value"), startDate: text("start_date"), endDate: text("end_date"),
  status: text("status", { enum: ["ACTIVE", "COMPLETED", "ON_HOLD"] }).notNull().default("ACTIVE"), notes: text("notes"),
  createdAt: timestamp("created_at"), updatedAt: timestamp("updated_at"),
}, (t) => [uniqueIndex("uq_projects_company_code").on(t.companyId, t.projectCode), index("idx_projects_company_status").on(t.companyId, t.status)]);

export const accounts = sqliteTable("accounts", {
  id: id(), companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }), code: text("code").notNull(),
  name: text("name").notNull(), parentAccountId: text("parent_account_id").references((): AnySQLiteColumn => accounts.id, { onDelete: "restrict" }),
  accountGroup: text("account_group", { enum: ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "DIRECT_COST", "OVERHEAD"] }).notNull(),
  normalBalance: text("normal_balance", { enum: ["DEBIT", "CREDIT"] }), reportType: text("report_type", { enum: ["BALANCE_SHEET", "PROFIT_LOSS"] }),
  isPostable: bool("is_postable"), isActive: bool("is_active"), displayOrder: integer("display_order").notNull().default(0), notes: text("notes"),
  createdAt: timestamp("created_at"), updatedAt: timestamp("updated_at"),
}, (t) => [uniqueIndex("uq_accounts_company_code").on(t.companyId, t.code), index("idx_accounts_company_report_order").on(t.companyId, t.reportType, t.displayOrder), check("ck_accounts_postable_metadata", sql`${t.isPostable} = 0 OR (${t.normalBalance} IS NOT NULL AND ${t.reportType} IS NOT NULL)`)]);

export const cashAccounts = sqliteTable("cash_accounts", {
  id: id(), companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }), code: text("code").notNull(), name: text("name").notNull(),
  cashType: text("cash_type", { enum: ["GIRO", "BANK", "PROJECT_CASH"] }).notNull(), ledgerAccountId: text("ledger_account_id").notNull().references(() => accounts.id, { onDelete: "restrict" }),
  projectId: text("project_id").references(() => projects.id, { onDelete: "restrict" }), bankName: text("bank_name"), accountNumber: text("account_number"),
  currency: text("currency").notNull().default("IDR"), isActive: bool("is_active"), createdAt: timestamp("created_at"), updatedAt: timestamp("updated_at"),
}, (t) => [uniqueIndex("uq_cash_accounts_company_code").on(t.companyId, t.code), index("idx_cash_accounts_project").on(t.projectId), check("ck_cash_accounts_project", sql`${t.cashType} != 'PROJECT_CASH' OR ${t.projectId} IS NOT NULL`)]);

export const migrationBatches = sqliteTable("migration_batches", {
  id: id(), companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }), projectId: text("project_id").references(() => projects.id, { onDelete: "restrict" }),
  fileRole: text("file_role", { enum: ["PROJECT", "COMPANY"] }).notNull(), sourceFileName: text("source_file_name").notNull(), sourceFileChecksum: text("source_file_checksum").notNull(),
  sourcePeriodStart: text("source_period_start"), sourcePeriodEnd: text("source_period_end"), status: text("status", { enum: ["PENDING", "VALIDATING", "IMPORTING", "COMPLETED", "FAILED"] }).notNull().default("PENDING"),
  totalRows: amount("total_rows"), importedTransactions: amount("imported_transactions"), importedLines: amount("imported_lines"), failedRows: amount("failed_rows"),
  startedAt: integer("started_at", { mode: "timestamp_ms" }), completedAt: integer("completed_at", { mode: "timestamp_ms" }), notes: text("notes"),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }), createdAt: timestamp("created_at"),
}, (t) => [uniqueIndex("uq_migration_batches_checksum").on(t.companyId, t.sourceFileChecksum)]);

export const transactions = sqliteTable("transactions", {
  id: id(), companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }), txNumber: text("tx_number").notNull().unique(), txDate: text("tx_date").notNull(),
  txType: text("tx_type", { enum: ["PROJECT_INCOME", "PROJECT_EXPENSE", "CORPORATE_INCOME", "CORPORATE_EXPENSE", "INTERNAL_TRANSFER", "AP_PAYMENT", "AR_RECEIPT", "REVERSAL"] }).notNull(),
  businessScope: text("business_scope", { enum: ["PROJECT", "CORPORATE", "INTERNAL"] }).notNull(), projectId: text("project_id").references(() => projects.id, { onDelete: "restrict" }),
  referenceNo: text("reference_no"), description: text("description").notNull(), status: text("status", { enum: ["DRAFT", "POSTED", "REVERSED"] }).notNull().default("DRAFT"),
  source: text("source", { enum: ["MANUAL", "MIGRATION", "SYSTEM"] }).notNull().default("MANUAL"), createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  postedBy: text("posted_by").references(() => users.id, { onDelete: "set null" }), postedAt: integer("posted_at", { mode: "timestamp_ms" }),
  reversalOfTransactionId: text("reversal_of_transaction_id").unique().references((): AnySQLiteColumn => transactions.id, { onDelete: "restrict" }), migrationBatchId: text("migration_batch_id").references(() => migrationBatches.id, { onDelete: "restrict" }),
  legacyReference: text("legacy_reference"), createdAt: timestamp("created_at"), updatedAt: timestamp("updated_at"),
}, (t) => [index("idx_transactions_company_date").on(t.companyId, t.txDate), index("idx_transactions_company_status").on(t.companyId, t.status), index("idx_transactions_project_date").on(t.projectId, t.txDate), check("ck_transactions_project_scope", sql`${t.businessScope} != 'PROJECT' OR ${t.projectId} IS NOT NULL`)]);

export const transactionLines = sqliteTable("transaction_lines", {
  id: id(), transactionId: text("transaction_id").notNull().references(() => transactions.id, { onDelete: "cascade" }), lineNo: integer("line_no").notNull(),
  accountId: text("account_id").notNull().references(() => accounts.id, { onDelete: "restrict" }), projectId: text("project_id").references(() => projects.id, { onDelete: "restrict" }),
  cashAccountId: text("cash_account_id").references(() => cashAccounts.id, { onDelete: "restrict" }), contactId: text("contact_id").references(() => contacts.id, { onDelete: "restrict" }),
  debit: amount("debit"), credit: amount("credit"), quantity: integer("quantity"), memo: text("memo"), legacyRowNo: integer("legacy_row_no"), createdAt: timestamp("created_at"),
}, (t) => [uniqueIndex("uq_transaction_lines_number").on(t.transactionId, t.lineNo), index("idx_transaction_lines_account").on(t.accountId), index("idx_transaction_lines_project").on(t.projectId), index("idx_transaction_lines_cash_account").on(t.cashAccountId), check("ck_transaction_lines_side", sql`(${t.debit} > 0 AND ${t.credit} = 0) OR (${t.credit} > 0 AND ${t.debit} = 0)`)]);

export const apArItems = sqliteTable("ap_ar_items", {
  id: id(), companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }), itemType: text("item_type", { enum: ["AP", "AR"] }).notNull(),
  contactId: text("contact_id").notNull().references(() => contacts.id, { onDelete: "restrict" }), projectId: text("project_id").references(() => projects.id, { onDelete: "restrict" }),
  referenceNo: text("reference_no").notNull(), description: text("description"), issueDate: text("issue_date").notNull(), dueDate: text("due_date"), originalAmount: integer("original_amount").notNull(),
  recognizedTransactionId: text("recognized_transaction_id").references(() => transactions.id, { onDelete: "restrict" }), migrationBatchId: text("migration_batch_id").references(() => migrationBatches.id, { onDelete: "restrict" }),
  isCancelled: bool("is_cancelled", false), createdAt: timestamp("created_at"), updatedAt: timestamp("updated_at"),
}, (t) => [uniqueIndex("uq_ap_ar_company_reference").on(t.companyId, t.itemType, t.referenceNo), index("idx_ap_ar_company_type_due").on(t.companyId, t.itemType, t.dueDate), check("ck_ap_ar_positive", sql`${t.originalAmount} > 0`)]);

export const apArSettlements = sqliteTable("ap_ar_settlements", {
  id: id(), apArItemId: text("ap_ar_item_id").notNull().references(() => apArItems.id, { onDelete: "restrict" }), transactionId: text("transaction_id").notNull().references(() => transactions.id, { onDelete: "restrict" }),
  settlementDate: text("settlement_date").notNull(), amount: integer("amount").notNull(), notes: text("notes"), createdAt: timestamp("created_at"),
}, (t) => [index("idx_ap_ar_settlements_item").on(t.apArItemId), uniqueIndex("uq_ap_ar_settlements_transaction").on(t.transactionId, t.apArItemId), check("ck_ap_ar_settlement_positive", sql`${t.amount} > 0`)]);

export const migrationIssues = sqliteTable("migration_issues", {
  id: id(), migrationBatchId: text("migration_batch_id").notNull().references(() => migrationBatches.id, { onDelete: "cascade" }), sheetName: text("sheet_name"), legacyRowNo: integer("legacy_row_no"),
  issueType: text("issue_type").notNull(), severity: text("severity", { enum: ["INFO", "WARNING", "ERROR", "BLOCKER"] }).notNull().default("ERROR"), message: text("message").notNull(),
  sourcePayload: text("source_payload", { mode: "json" }), resolutionStatus: text("resolution_status", { enum: ["OPEN", "RESOLVED", "IGNORED"] }).notNull().default("OPEN"), resolutionNotes: text("resolution_notes"),
  resolvedBy: text("resolved_by").references(() => users.id, { onDelete: "set null" }), resolvedAt: integer("resolved_at", { mode: "timestamp_ms" }), createdAt: timestamp("created_at"),
}, (t) => [index("idx_migration_issues_batch_status").on(t.migrationBatchId, t.resolutionStatus)]);

export const auditLogs = sqliteTable("audit_logs", {
  id: id(), companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }), actorUserId: text("actor_user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(), entityType: text("entity_type").notNull(), entityId: text("entity_id").notNull(), oldValue: text("old_value", { mode: "json" }), newValue: text("new_value", { mode: "json" }),
  sourceIp: text("source_ip"), createdAt: timestamp("created_at"),
}, (t) => [index("idx_audit_logs_company_created").on(t.companyId, t.createdAt), index("idx_audit_logs_entity").on(t.entityType, t.entityId)]);
