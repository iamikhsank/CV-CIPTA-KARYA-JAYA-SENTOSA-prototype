CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`parent_account_id` text,
	`account_group` text NOT NULL,
	`normal_balance` text,
	`report_type` text,
	`is_postable` integer DEFAULT true NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`parent_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_accounts_postable_metadata" CHECK("accounts"."is_postable" = 0 OR ("accounts"."normal_balance" IS NOT NULL AND "accounts"."report_type" IS NOT NULL))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_accounts_company_code` ON `accounts` (`company_id`,`code`);--> statement-breakpoint
CREATE INDEX `idx_accounts_company_report_order` ON `accounts` (`company_id`,`report_type`,`display_order`);--> statement-breakpoint
CREATE TABLE `ap_ar_items` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`item_type` text NOT NULL,
	`contact_id` text NOT NULL,
	`project_id` text,
	`reference_no` text NOT NULL,
	`description` text,
	`issue_date` text NOT NULL,
	`due_date` text,
	`original_amount` integer NOT NULL,
	`recognized_transaction_id` text,
	`migration_batch_id` text,
	`is_cancelled` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`recognized_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`migration_batch_id`) REFERENCES `migration_batches`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_ap_ar_positive" CHECK("ap_ar_items"."original_amount" > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_ap_ar_company_reference` ON `ap_ar_items` (`company_id`,`item_type`,`reference_no`);--> statement-breakpoint
CREATE INDEX `idx_ap_ar_company_type_due` ON `ap_ar_items` (`company_id`,`item_type`,`due_date`);--> statement-breakpoint
CREATE TABLE `ap_ar_settlements` (
	`id` text PRIMARY KEY NOT NULL,
	`ap_ar_item_id` text NOT NULL,
	`transaction_id` text NOT NULL,
	`settlement_date` text NOT NULL,
	`amount` integer NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`ap_ar_item_id`) REFERENCES `ap_ar_items`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_ap_ar_settlement_positive" CHECK("ap_ar_settlements"."amount" > 0)
);
--> statement-breakpoint
CREATE INDEX `idx_ap_ar_settlements_item` ON `ap_ar_settlements` (`ap_ar_item_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_ap_ar_settlements_transaction` ON `ap_ar_settlements` (`transaction_id`,`ap_ar_item_id`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`actor_user_id` text,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`old_value` text,
	`new_value` text,
	`source_ip` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_audit_logs_company_created` ON `audit_logs` (`company_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_audit_logs_entity` ON `audit_logs` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE TABLE `cash_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`cash_type` text NOT NULL,
	`ledger_account_id` text NOT NULL,
	`project_id` text,
	`bank_name` text,
	`account_number` text,
	`currency` text DEFAULT 'IDR' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`ledger_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_cash_accounts_project" CHECK("cash_accounts"."cash_type" != 'PROJECT_CASH' OR "cash_accounts"."project_id" IS NOT NULL)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_cash_accounts_company_code` ON `cash_accounts` (`company_id`,`code`);--> statement-breakpoint
CREATE INDEX `idx_cash_accounts_project` ON `cash_accounts` (`project_id`);--> statement-breakpoint
CREATE TABLE `companies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`address` text,
	`phone` text,
	`email` text,
	`default_currency` text DEFAULT 'IDR' NOT NULL,
	`timezone` text DEFAULT 'Asia/Jakarta' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`contact_type` text NOT NULL,
	`phone` text,
	`email` text,
	`address` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_contacts_company_code` ON `contacts` (`company_id`,`code`);--> statement-breakpoint
CREATE INDEX `idx_contacts_company_type` ON `contacts` (`company_id`,`contact_type`);--> statement-breakpoint
CREATE TABLE `migration_batches` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`project_id` text,
	`file_role` text NOT NULL,
	`source_file_name` text NOT NULL,
	`source_file_checksum` text NOT NULL,
	`source_period_start` text,
	`source_period_end` text,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`total_rows` integer DEFAULT 0 NOT NULL,
	`imported_transactions` integer DEFAULT 0 NOT NULL,
	`imported_lines` integer DEFAULT 0 NOT NULL,
	`failed_rows` integer DEFAULT 0 NOT NULL,
	`started_at` integer,
	`completed_at` integer,
	`notes` text,
	`created_by` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_migration_batches_checksum` ON `migration_batches` (`company_id`,`source_file_checksum`);--> statement-breakpoint
CREATE TABLE `migration_issues` (
	`id` text PRIMARY KEY NOT NULL,
	`migration_batch_id` text NOT NULL,
	`sheet_name` text,
	`legacy_row_no` integer,
	`issue_type` text NOT NULL,
	`severity` text DEFAULT 'ERROR' NOT NULL,
	`message` text NOT NULL,
	`source_payload` text,
	`resolution_status` text DEFAULT 'OPEN' NOT NULL,
	`resolution_notes` text,
	`resolved_by` text,
	`resolved_at` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`migration_batch_id`) REFERENCES `migration_batches`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`resolved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_migration_issues_batch_status` ON `migration_issues` (`migration_batch_id`,`resolution_status`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`project_code` text NOT NULL,
	`name` text NOT NULL,
	`client_contact_id` text,
	`location` text,
	`contract_value` integer DEFAULT 0 NOT NULL,
	`start_date` text,
	`end_date` text,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`client_contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_projects_company_code` ON `projects` (`company_id`,`project_code`);--> statement-breakpoint
CREATE INDEX `idx_projects_company_status` ON `projects` (`company_id`,`status`);--> statement-breakpoint
CREATE TABLE `transaction_lines` (
	`id` text PRIMARY KEY NOT NULL,
	`transaction_id` text NOT NULL,
	`line_no` integer NOT NULL,
	`account_id` text NOT NULL,
	`project_id` text,
	`cash_account_id` text,
	`contact_id` text,
	`debit` integer DEFAULT 0 NOT NULL,
	`credit` integer DEFAULT 0 NOT NULL,
	`quantity` integer,
	`memo` text,
	`legacy_row_no` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`cash_account_id`) REFERENCES `cash_accounts`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_transaction_lines_side" CHECK(("transaction_lines"."debit" > 0 AND "transaction_lines"."credit" = 0) OR ("transaction_lines"."credit" > 0 AND "transaction_lines"."debit" = 0))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_transaction_lines_number` ON `transaction_lines` (`transaction_id`,`line_no`);--> statement-breakpoint
CREATE INDEX `idx_transaction_lines_account` ON `transaction_lines` (`account_id`);--> statement-breakpoint
CREATE INDEX `idx_transaction_lines_project` ON `transaction_lines` (`project_id`);--> statement-breakpoint
CREATE INDEX `idx_transaction_lines_cash_account` ON `transaction_lines` (`cash_account_id`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`tx_number` text NOT NULL,
	`tx_date` text NOT NULL,
	`tx_type` text NOT NULL,
	`business_scope` text NOT NULL,
	`project_id` text,
	`reference_no` text,
	`description` text NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`source` text DEFAULT 'MANUAL' NOT NULL,
	`created_by` text,
	`posted_by` text,
	`posted_at` integer,
	`reversal_of_transaction_id` text,
	`migration_batch_id` text,
	`legacy_reference` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`posted_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`reversal_of_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`migration_batch_id`) REFERENCES `migration_batches`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_transactions_project_scope" CHECK("transactions"."business_scope" != 'PROJECT' OR "transactions"."project_id" IS NOT NULL)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_tx_number_unique` ON `transactions` (`tx_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_reversal_of_transaction_id_unique` ON `transactions` (`reversal_of_transaction_id`);--> statement-breakpoint
CREATE INDEX `idx_transactions_company_date` ON `transactions` (`company_id`,`tx_date`);--> statement-breakpoint
CREATE INDEX `idx_transactions_company_status` ON `transactions` (`company_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_transactions_project_date` ON `transactions` (`project_id`,`tx_date`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`name` text NOT NULL,
	`email_or_username` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'OWNER' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`last_login_at` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_users_company_login` ON `users` (`company_id`,`email_or_username`);