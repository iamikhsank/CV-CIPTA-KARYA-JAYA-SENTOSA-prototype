CREATE VIEW vw_posted_lines AS
SELECT
  t.company_id,
  t.id AS transaction_id,
  t.tx_number,
  t.tx_date,
  t.tx_type,
  t.business_scope,
  t.status,
  t.description,
  tl.id AS line_id,
  tl.line_no,
  tl.account_id,
  a.code AS account_code,
  a.name AS account_name,
  a.account_group,
  a.normal_balance,
  a.report_type,
  tl.project_id,
  tl.cash_account_id,
  tl.contact_id,
  tl.debit,
  tl.credit,
  tl.quantity,
  tl.memo
FROM transactions t
JOIN transaction_lines tl ON tl.transaction_id = t.id
JOIN accounts a ON a.id = tl.account_id
WHERE t.status IN ('POSTED', 'REVERSED');
--> statement-breakpoint
CREATE VIEW vw_general_ledger AS
SELECT
  pl.*,
  CASE
    WHEN pl.normal_balance = 'CREDIT'
      THEN SUM(pl.credit - pl.debit) OVER (PARTITION BY pl.account_id ORDER BY pl.tx_date, pl.transaction_id, pl.line_no)
    ELSE SUM(pl.debit - pl.credit) OVER (PARTITION BY pl.account_id ORDER BY pl.tx_date, pl.transaction_id, pl.line_no)
  END AS running_balance
FROM vw_posted_lines pl;
--> statement-breakpoint
CREATE VIEW vw_cash_balances AS
SELECT
  ca.company_id,
  ca.id AS cash_account_id,
  ca.code,
  ca.name,
  ca.cash_type,
  ca.project_id,
  ca.currency,
  COALESCE(SUM(pl.debit - pl.credit), 0) AS balance
FROM cash_accounts ca
LEFT JOIN vw_posted_lines pl ON pl.cash_account_id = ca.id
GROUP BY ca.id;
--> statement-breakpoint
CREATE VIEW vw_project_pnl AS
SELECT
  p.company_id,
  p.id AS project_id,
  p.project_code,
  p.name AS project_name,
  COALESCE(SUM(CASE WHEN pl.account_group = 'REVENUE' THEN pl.credit - pl.debit ELSE 0 END), 0) AS revenue,
  COALESCE(SUM(CASE WHEN pl.account_group = 'DIRECT_COST' THEN pl.debit - pl.credit ELSE 0 END), 0) AS direct_cost,
  COALESCE(SUM(CASE WHEN pl.account_group = 'OVERHEAD' THEN pl.debit - pl.credit ELSE 0 END), 0) AS project_overhead,
  COALESCE(SUM(CASE WHEN pl.account_group = 'REVENUE' THEN pl.credit - pl.debit WHEN pl.account_group IN ('DIRECT_COST', 'OVERHEAD') THEN pl.credit - pl.debit ELSE 0 END), 0) AS net_profit
FROM projects p
LEFT JOIN vw_posted_lines pl ON pl.project_id = p.id AND pl.report_type = 'PROFIT_LOSS'
GROUP BY p.id;
--> statement-breakpoint
CREATE VIEW vw_company_pnl AS
SELECT
  c.id AS company_id,
  COALESCE(SUM(CASE WHEN pl.account_group = 'REVENUE' THEN pl.credit - pl.debit ELSE 0 END), 0) AS revenue,
  COALESCE(SUM(CASE WHEN pl.account_group = 'DIRECT_COST' THEN pl.debit - pl.credit ELSE 0 END), 0) AS direct_cost,
  COALESCE(SUM(CASE WHEN pl.account_group = 'OVERHEAD' AND pl.project_id IS NOT NULL THEN pl.debit - pl.credit ELSE 0 END), 0) AS project_overhead,
  COALESCE(SUM(CASE WHEN pl.account_group = 'OVERHEAD' AND pl.project_id IS NULL THEN pl.debit - pl.credit ELSE 0 END), 0) AS corporate_overhead,
  COALESCE(SUM(CASE WHEN pl.account_group = 'REVENUE' THEN pl.credit - pl.debit WHEN pl.account_group IN ('DIRECT_COST', 'OVERHEAD') THEN pl.credit - pl.debit ELSE 0 END), 0) AS net_profit
FROM companies c
LEFT JOIN vw_posted_lines pl ON pl.company_id = c.id AND pl.report_type = 'PROFIT_LOSS'
GROUP BY c.id;
--> statement-breakpoint
CREATE VIEW vw_balance_sheet_accounts AS
SELECT
  a.company_id,
  a.id AS account_id,
  a.code,
  a.name,
  a.account_group,
  a.normal_balance,
  COALESCE(SUM(CASE WHEN a.normal_balance = 'CREDIT' THEN pl.credit - pl.debit ELSE pl.debit - pl.credit END), 0) AS balance
FROM accounts a
LEFT JOIN vw_posted_lines pl ON pl.account_id = a.id
WHERE a.report_type = 'BALANCE_SHEET' AND a.is_postable = 1
GROUP BY a.id;
--> statement-breakpoint
CREATE VIEW vw_cashflow_lines AS
SELECT
  pl.company_id,
  pl.transaction_id,
  pl.tx_number,
  pl.tx_date,
  pl.tx_type,
  pl.business_scope,
  pl.project_id,
  pl.cash_account_id,
  pl.description,
  pl.debit - pl.credit AS cash_change,
  CASE WHEN pl.tx_type = 'INTERNAL_TRANSFER' THEN 1 ELSE 0 END AS is_internal_transfer
FROM vw_posted_lines pl
WHERE pl.cash_account_id IS NOT NULL;
--> statement-breakpoint
CREATE VIEW vw_ap_ar_outstanding AS
SELECT
  i.company_id,
  i.id,
  i.item_type,
  i.contact_id,
  c.code AS contact_code,
  c.name AS contact_name,
  i.project_id,
  p.project_code,
  p.name AS project_name,
  i.reference_no,
  i.description,
  i.issue_date,
  i.due_date,
  i.original_amount,
  COALESCE(SUM(s.amount), 0) AS settled_amount,
  i.original_amount - COALESCE(SUM(s.amount), 0) AS outstanding_amount,
  CASE
    WHEN i.is_cancelled = 1 THEN 'CANCELLED'
    WHEN COALESCE(SUM(s.amount), 0) = 0 THEN 'OUTSTANDING'
    WHEN COALESCE(SUM(s.amount), 0) < i.original_amount THEN 'PARTIALLY_PAID'
    ELSE 'PAID'
  END AS status
FROM ap_ar_items i
JOIN contacts c ON c.id = i.contact_id
LEFT JOIN projects p ON p.id = i.project_id
LEFT JOIN ap_ar_settlements s ON s.ap_ar_item_id = i.id
GROUP BY i.id;
