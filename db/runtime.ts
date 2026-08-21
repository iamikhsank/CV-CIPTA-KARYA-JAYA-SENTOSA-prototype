import baselineSql from "../drizzle/0000_glossy_ironclad.sql?raw";
import reportingSql from "../drizzle/0001_reporting_views.sql?raw";

const migrations = [
  { id: "0000_glossy_ironclad", sql: baselineSql },
  { id: "0001_reporting_views", sql: reportingSql },
];

const splitStatements = (source: string) =>
  source
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim())
    .filter(Boolean);

export async function ensureDatabase(db: D1Database) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS _ckjs_migrations (
        id TEXT PRIMARY KEY NOT NULL,
        applied_at INTEGER NOT NULL DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )`,
    )
    .run();

  for (const migration of migrations) {
    const applied = await db
      .prepare("SELECT id FROM _ckjs_migrations WHERE id = ?")
      .bind(migration.id)
      .first();
    if (applied) continue;

    const statements = splitStatements(migration.sql).map((statement) => db.prepare(statement));
    statements.push(
      db.prepare("INSERT INTO _ckjs_migrations (id) VALUES (?)").bind(migration.id),
    );
    await db.batch(statements);
  }

  await db.prepare("PRAGMA optimize").run();
}

export async function databaseStatus(db: D1Database) {
  const migrations = await db.prepare("SELECT id, applied_at FROM _ckjs_migrations ORDER BY id").all();
  const counts = await db
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM companies) AS companies,
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM projects) AS projects,
        (SELECT COUNT(*) FROM contacts) AS contacts,
        (SELECT COUNT(*) FROM accounts) AS accounts,
        (SELECT COUNT(*) FROM cash_accounts) AS cash_accounts,
        (SELECT COUNT(*) FROM transactions) AS transactions,
        (SELECT COUNT(*) FROM transaction_lines) AS transaction_lines,
        (SELECT COUNT(*) FROM ap_ar_items) AS ap_ar_items,
        (SELECT COUNT(*) FROM audit_logs) AS audit_logs`,
    )
    .first();
  return { migrations: migrations.results, counts };
}
