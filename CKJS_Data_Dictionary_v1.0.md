# CKJS Data Dictionary v1.0

**Status:** M1 Database Baseline - Final under Assumption A1

**Assumption A1:** seluruh 15 Excel proyek + 1 Excel perusahaan memiliki struktur dasar yang sama dengan `Keuangan Proyek A.xlsx`.

## `companies`
Profil legal/operasional perusahaan. Phase 1 tetap single-company; tabel ini bukan berarti UI multi-company dibangun.

| Field | Datatype | Key | Nullable | Constraint | Example | Description |
|---|---|---|---|---|---|---|
| id | UUID | PK | NO | DEFAULT gen_random_uuid() | 3db1... | Primary key perusahaan. |
| name | VARCHAR(160) |  | NO |  | CV. CIPTA KARYA JAYA SENTOSA | Nama perusahaan yang tampil pada sistem/laporan. |
| address | TEXT |  | YES |  | Jl. Contoh No. 1 | Alamat perusahaan. |
| phone | VARCHAR(40) |  | YES |  |  | Nomor telepon kantor bila diperlukan. |
| email | VARCHAR(160) |  | YES |  |  | Email perusahaan. |
| default_currency | CHAR(3) |  | NO | DEFAULT 'IDR' | IDR | Mata uang default. |
| timezone | VARCHAR(64) |  | NO | DEFAULT 'Asia/Jakarta' | Asia/Jakarta | Zona waktu aplikasi. |
| is_active | BOOLEAN |  | NO | DEFAULT TRUE | true | Flag aktif. |
| created_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() | 2026-08-21 10:00+07 | Waktu pembuatan. |
| updated_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() | 2026-08-21 10:00+07 | Waktu perubahan terakhir. |

## `users`
Akun pengguna aplikasi. Phase 1: Bpk. Jason dan 1 co-owner dengan role OWNER.

| Field | Datatype | Key | Nullable | Constraint | Example | Description |
|---|---|---|---|---|---|---|
| id | UUID | PK | NO | DEFAULT gen_random_uuid() |  | Primary key user. |
| company_id | UUID | FK | NO | FK -> companies.id; ON DELETE RESTRICT |  | Perusahaan user. |
| name | VARCHAR(120) |  | NO |  | Jason | Nama pengguna. |
| email_or_username | VARCHAR(150) | UQ | NO | UNIQUE(company_id,email_or_username) | jason@example.com | Identifier login. |
| password_hash | TEXT |  | NO |  | <argon2/bcrypt hash> | Hash password, tidak pernah plaintext. |
| role | user_role |  | NO | DEFAULT 'OWNER' | OWNER | Role. UI Phase 1 hanya OWNER. |
| is_active | BOOLEAN |  | NO | DEFAULT TRUE | true | User inactive tidak dapat login. |
| last_login_at | TIMESTAMPTZ |  | YES |  |  | Login terakhir. |
| created_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu pembuatan. |
| updated_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu perubahan terakhir. |

## `contacts`
Master rekanan/kode bantu: client, vendor, karyawan, atau relasi lain untuk sub-ledger.

| Field | Datatype | Key | Nullable | Constraint | Example | Description |
|---|---|---|---|---|---|---|
| id | UUID | PK | NO | DEFAULT gen_random_uuid() |  | Primary key contact. |
| company_id | UUID | FK | NO | FK -> companies.id; ON DELETE RESTRICT |  | Pemilik master. |
| code | VARCHAR(30) | UQ | NO | UNIQUE(company_id,code) | H002 | Kode bantu existing. |
| name | VARCHAR(150) |  | NO |  | SATRIA Leveransir | Nama rekanan. |
| contact_type | contact_type |  | NO |  | VENDOR | CLIENT / VENDOR / EMPLOYEE / OTHER. |
| phone | VARCHAR(40) |  | YES |  |  | Kontak telepon. |
| email | VARCHAR(160) |  | YES |  |  | Email. |
| address | TEXT |  | YES |  |  | Alamat. |
| is_active | BOOLEAN |  | NO | DEFAULT TRUE | true | Soft disable, tidak hard-delete bila sudah dipakai. |
| created_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu pembuatan. |
| updated_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu perubahan terakhir. |

## `projects`
Master multi-project. Satu baris menggantikan konsep satu file Excel per proyek.

| Field | Datatype | Key | Nullable | Constraint | Example | Description |
|---|---|---|---|---|---|---|
| id | UUID | PK | NO | DEFAULT gen_random_uuid() |  | Primary key project. |
| company_id | UUID | FK | NO | FK -> companies.id; ON DELETE RESTRICT |  | Perusahaan. |
| project_code | VARCHAR(30) | UQ | NO | UNIQUE(company_id,project_code) | PRJ-GML-001 | Kode project. |
| name | VARCHAR(180) |  | NO |  | GAMELAN HOUSE - Gamelan No. 8 | Nama proyek dari Data Perusahaan. |
| client_contact_id | UUID | FK | YES | FK -> contacts.id; ON DELETE RESTRICT |  | Client bila sudah tervalidasi. |
| location | TEXT |  | YES |  | Gamelan No. 8 | Lokasi proyek. |
| contract_value | NUMERIC(18,2) |  | NO | DEFAULT 0; CHECK >= 0 | 2516000000.00 | Nilai kontrak/manajemen; bukan saldo ledger. |
| start_date | DATE |  | YES |  | 2024-03-31 | Tanggal mulai. |
| end_date | DATE |  | YES |  | 2025-11-19 | Tanggal selesai. |
| status | project_status |  | NO | DEFAULT 'ACTIVE' | ACTIVE | ACTIVE / COMPLETED / ON_HOLD. |
| notes | TEXT |  | YES |  |  | Catatan. |
| created_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu pembuatan. |
| updated_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu perubahan terakhir. |

## `accounts`
Chart of Accounts dinamis. Mendukung akun header/group dan akun posting, sehingga akun baru otomatis dapat masuk laporan berdasarkan metadata.

| Field | Datatype | Key | Nullable | Constraint | Example | Description |
|---|---|---|---|---|---|---|
| id | UUID | PK | NO | DEFAULT gen_random_uuid() |  | Primary key akun. |
| company_id | UUID | FK | NO | FK -> companies.id; ON DELETE RESTRICT |  | Perusahaan. |
| code | VARCHAR(30) | UQ | NO | UNIQUE(company_id,code) | 5-2104 | Kode akun existing. |
| name | VARCHAR(180) |  | NO |  | BESI BETON, Wmesh & Bondek | Nama akun. |
| parent_account_id | UUID | FK | YES | SELF FK -> accounts.id; ON DELETE RESTRICT |  | Hierarchy COA. |
| account_group | account_group |  | NO |  | DIRECT_COST | ASSET / LIABILITY / EQUITY / REVENUE / DIRECT_COST / OVERHEAD. |
| normal_balance | normal_balance |  | YES | Required bila is_postable=TRUE | DEBIT | DEBIT / CREDIT. Header boleh NULL. |
| report_type | report_type |  | YES | Required bila is_postable=TRUE | PROFIT_LOSS | BALANCE_SHEET / PROFIT_LOSS. Header boleh NULL. |
| is_postable | BOOLEAN |  | NO | DEFAULT TRUE | true | FALSE untuk header seperti 5-0000 / 5-2000. |
| is_active | BOOLEAN |  | NO | DEFAULT TRUE | true | Akun lama dinonaktifkan, bukan hard-delete. |
| display_order | INTEGER |  | NO | DEFAULT 0 | 42 | Urutan tampilan/report. |
| notes | TEXT |  | YES |  |  | Catatan validasi/mapping. |
| created_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu pembuatan. |
| updated_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu perubahan terakhir. |

## `cash_accounts`
Sub-ledger pos dana nyata: Giro, Bank Operasional, dan Kas Proyek. Beberapa cash account boleh memakai satu akun COA generik yang sama.

| Field | Datatype | Key | Nullable | Constraint | Example | Description |
|---|---|---|---|---|---|---|
| id | UUID | PK | NO | DEFAULT gen_random_uuid() |  | Primary key pos dana. |
| company_id | UUID | FK | NO | FK -> companies.id; ON DELETE RESTRICT |  | Perusahaan. |
| code | VARCHAR(40) | UQ | NO | UNIQUE(company_id,code) | CASH-GAMELAN | Kode pos dana. |
| name | VARCHAR(160) |  | NO |  | Kas Proyek Gamelan | Nama display. |
| cash_type | cash_account_type |  | NO |  | PROJECT_CASH | GIRO / BANK / PROJECT_CASH. |
| ledger_account_id | UUID | FK | NO | FK -> accounts.id; must be postable asset | 1-1100 | COA pengendali. BUKAN unique; banyak kas proyek dapat share 1-1100. |
| project_id | UUID | FK | YES | FK -> projects.id; required if PROJECT_CASH | PRJ-GML-001 | Project pemilik kas lapangan. |
| bank_name | VARCHAR(100) |  | YES |  | BCA | Nama bank bila relevan. |
| account_number | VARCHAR(80) |  | YES |  |  | Nomor rekening; tampilkan masked di UI jika diperlukan. |
| currency | CHAR(3) |  | NO | DEFAULT 'IDR' | IDR | Mata uang. |
| is_active | BOOLEAN |  | NO | DEFAULT TRUE | true | Flag aktif. |
| created_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu pembuatan. |
| updated_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu perubahan terakhir. |

## `migration_batches`
Satu batch untuk satu file Excel/import. Menjaga traceability, idempotency, dan rekonsiliasi 16 file historis.

| Field | Datatype | Key | Nullable | Constraint | Example | Description |
|---|---|---|---|---|---|---|
| id | UUID | PK | NO | DEFAULT gen_random_uuid() |  | Primary key batch. |
| company_id | UUID | FK | NO | FK -> companies.id; ON DELETE RESTRICT |  | Perusahaan. |
| project_id | UUID | FK | YES | FK -> projects.id; NULL untuk file perusahaan |  | Project sumber bila file proyek. |
| file_role | migration_file_role |  | NO |  | PROJECT | PROJECT / COMPANY. |
| source_file_name | VARCHAR(255) |  | NO |  | Keuangan Proyek A.xlsx | Nama file sumber. |
| source_file_checksum | VARCHAR(64) |  | NO |  | sha256... | Checksum untuk deteksi file sama. |
| source_period_start | DATE |  | YES |  | 2024-03-31 | Periode data sumber. |
| source_period_end | DATE |  | YES |  | 2025-11-19 | Periode akhir sumber. |
| status | migration_status |  | NO | DEFAULT 'PENDING' | VALIDATING | Lifecycle batch. |
| total_rows | INTEGER |  | NO | DEFAULT 0; CHECK >= 0 | 2935 | Jumlah row jurnal yang diperiksa. |
| imported_transactions | INTEGER |  | NO | DEFAULT 0; CHECK >= 0 | 1250 | Jumlah transaction header hasil import. |
| imported_lines | INTEGER |  | NO | DEFAULT 0; CHECK >= 0 | 2500 | Jumlah journal lines hasil import. |
| failed_rows | INTEGER |  | NO | DEFAULT 0; CHECK >= 0 | 4 | Jumlah row gagal/mismatch. |
| started_at | TIMESTAMPTZ |  | YES |  |  | Waktu mulai. |
| completed_at | TIMESTAMPTZ |  | YES |  |  | Waktu selesai. |
| notes | TEXT |  | YES |  |  | Catatan batch. |
| created_by | UUID | FK | YES | FK -> users.id; ON DELETE SET NULL |  | User yang menjalankan import. |
| created_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu record dibuat. |

## `transactions`
Header transaksi bisnis. Satu transaksi dapat mempunyai 2 atau banyak journal lines.

| Field | Datatype | Key | Nullable | Constraint | Example | Description |
|---|---|---|---|---|---|---|
| id | UUID | PK | NO | DEFAULT gen_random_uuid() |  | Primary key transaksi. |
| company_id | UUID | FK | NO | FK -> companies.id; ON DELETE RESTRICT |  | Perusahaan. |
| tx_number | VARCHAR(40) | UQ | NO | UNIQUE | TX-2026-000001 | Nomor transaksi business-friendly, dibuat service. |
| tx_date | DATE |  | NO |  | 2024-06-01 | Tanggal transaksi. |
| tx_type | transaction_type |  | NO |  | PROJECT_EXPENSE | Jenis transaksi terpandu. |
| business_scope | transaction_scope |  | NO |  | PROJECT | PROJECT / CORPORATE / INTERNAL. |
| project_id | UUID | FK | YES | FK -> projects.id; required for scope PROJECT | PRJ-GML-001 | Primary project context. |
| reference_no | VARCHAR(100) |  | YES |  | Bukti-001 | Nomor bukti/invoice/termin jika ada. |
| description | TEXT |  | NO |  | Pembelian Besi Beton | Keterangan transaksi. |
| status | transaction_status |  | NO | DEFAULT 'DRAFT' | POSTED | DRAFT / POSTED / REVERSED. |
| source | transaction_source |  | NO | DEFAULT 'MANUAL' | MIGRATION | MANUAL / MIGRATION / SYSTEM. |
| created_by | UUID | FK | YES | FK -> users.id; ON DELETE SET NULL |  | Pembuat; boleh NULL untuk proses migrasi sistem. |
| posted_by | UUID | FK | YES | FK -> users.id; ON DELETE SET NULL |  | User posting. |
| posted_at | TIMESTAMPTZ |  | YES |  |  | Waktu posting. |
| reversal_of_transaction_id | UUID | FK/UQ | YES | SELF FK; UNIQUE |  | Jika transaksi ini adalah reversal, menunjuk transaksi original. |
| migration_batch_id | UUID | FK | YES | FK -> migration_batches.id; ON DELETE RESTRICT |  | Traceability file sumber. |
| legacy_reference | VARCHAR(120) |  | YES |  | Jurnal!12:13 | Lokasi row Excel sumber. |
| created_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu pembuatan. |
| updated_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu perubahan terakhir. |

## `transaction_lines`
Ledger/journal lines sebagai source of truth saldo. Ini menggantikan sheet Jurnal dan menjadi basis GL, P&L, Neraca, Cashflow.

| Field | Datatype | Key | Nullable | Constraint | Example | Description |
|---|---|---|---|---|---|---|
| id | UUID | PK | NO | DEFAULT gen_random_uuid() |  | Primary key line. |
| transaction_id | UUID | FK | NO | FK -> transactions.id; ON DELETE CASCADE |  | Header transaksi. |
| line_no | SMALLINT | UQ | NO | UNIQUE(transaction_id,line_no); CHECK > 0 | 1 | Urutan line. |
| account_id | UUID | FK | NO | FK -> accounts.id; account must be postable | 5-2104 | COA debit/kredit. |
| project_id | UUID | FK | YES | FK -> projects.id | PRJ-GML-001 | Allocation dimension. Inilah yang membedakan project overhead vs corporate overhead. |
| cash_account_id | UUID | FK | YES | FK -> cash_accounts.id | CASH-GAMELAN | Diisi pada line akun kas/bank/giro; ledger account harus cocok dengan cash_accounts.ledger_account_id. |
| contact_id | UUID | FK | YES | FK -> contacts.id | H002 | Vendor/client/karyawan bila relevan. |
| debit | NUMERIC(18,2) |  | NO | DEFAULT 0; CHECK >= 0 | 10000000.00 | Nilai debit. |
| credit | NUMERIC(18,2) |  | NO | DEFAULT 0; CHECK >= 0 | 0.00 | Nilai kredit. |
| quantity | NUMERIC(18,4) |  | YES | CHECK >= 0 | 125.0000 | Preservasi kolom Volume Material existing. |
| memo | TEXT |  | YES |  | Besi Beton | Memo line. |
| legacy_row_no | INTEGER |  | YES | CHECK > 0 | 29 | Row jurnal sumber saat migrasi. |
| created_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu pembuatan. |

## `ap_ar_items`
Header kewajiban/tagihan untuk AP/AR bila pola tersebut digunakan. Outstanding tidak disimpan manual; dihitung dari settlements.

| Field | Datatype | Key | Nullable | Constraint | Example | Description |
|---|---|---|---|---|---|---|
| id | UUID | PK | NO | DEFAULT gen_random_uuid() |  | Primary key item. |
| company_id | UUID | FK | NO | FK -> companies.id; ON DELETE RESTRICT |  | Perusahaan. |
| item_type | ap_ar_type |  | NO |  | AR | AP / AR. |
| contact_id | UUID | FK | NO | FK -> contacts.id; ON DELETE RESTRICT | P001 | Vendor/client. |
| project_id | UUID | FK | YES | FK -> projects.id |  | Project; NULL untuk corporate AP. |
| reference_no | VARCHAR(100) |  | NO |  | TERM-05 | Nomor termin/invoice/referensi. |
| description | TEXT |  | YES |  | Termin 5 Project Gamelan | Keterangan. |
| issue_date | DATE |  | NO |  | 2025-01-15 | Tanggal pengakuan item. |
| due_date | DATE |  | YES |  | 2025-02-15 | Jatuh tempo. |
| original_amount | NUMERIC(18,2) |  | NO | CHECK > 0 | 200000000.00 | Nilai awal. |
| recognized_transaction_id | UUID | FK | YES | FK -> transactions.id; ON DELETE RESTRICT |  | Jurnal recognition bila accrual dipakai. |
| migration_batch_id | UUID | FK | YES | FK -> migration_batches.id; ON DELETE RESTRICT |  | Asal migrasi. |
| is_cancelled | BOOLEAN |  | NO | DEFAULT FALSE | false | Pembatalan administratif. |
| created_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu pembuatan. |
| updated_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu perubahan terakhir. |

## `ap_ar_settlements`
Pembayaran/penerimaan terhadap AP/AR. Satu item dapat memiliki banyak settlement untuk partial payment.

| Field | Datatype | Key | Nullable | Constraint | Example | Description |
|---|---|---|---|---|---|---|
| id | UUID | PK | NO | DEFAULT gen_random_uuid() |  | Primary key settlement. |
| ap_ar_item_id | UUID | FK | NO | FK -> ap_ar_items.id; ON DELETE RESTRICT |  | Item AP/AR. |
| transaction_id | UUID | FK | NO | FK -> transactions.id; ON DELETE RESTRICT |  | Transaksi pembayaran/penerimaan. |
| settlement_date | DATE |  | NO |  | 2025-02-01 | Tanggal settlement. |
| amount | NUMERIC(18,2) |  | NO | CHECK > 0 | 50000000.00 | Nominal settlement. |
| notes | TEXT |  | YES |  | Pembayaran tahap 1 | Catatan. |
| created_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu record dibuat. |

## `migration_issues`
Data Mismatch Log di database. Menahan anomali agar data tidak dipaksakan masuk tanpa review.

| Field | Datatype | Key | Nullable | Constraint | Example | Description |
|---|---|---|---|---|---|---|
| id | UUID | PK | NO | DEFAULT gen_random_uuid() |  | Primary key issue. |
| migration_batch_id | UUID | FK | NO | FK -> migration_batches.id; ON DELETE CASCADE |  | Batch terkait. |
| sheet_name | VARCHAR(100) |  | YES |  | Jurnal | Sheet sumber. |
| legacy_row_no | INTEGER |  | YES | CHECK > 0 | 64 | Row sumber. |
| issue_type | VARCHAR(60) |  | NO |  | UNKNOWN_ACCOUNT | Kategori mismatch. |
| severity | issue_severity |  | NO | DEFAULT 'ERROR' | ERROR | INFO / WARNING / ERROR / BLOCKER. |
| message | TEXT |  | NO |  | Kode akun tidak terdaftar | Deskripsi. |
| source_payload | JSONB |  | YES |  | {"account":"5-9999"} | Snapshot data sumber untuk review. |
| resolution_status | issue_resolution_status |  | NO | DEFAULT 'OPEN' | OPEN | OPEN / RESOLVED / IGNORED. |
| resolution_notes | TEXT |  | YES |  |  | Cara penyelesaian. |
| resolved_by | UUID | FK | YES | FK -> users.id; ON DELETE SET NULL |  | User resolver. |
| resolved_at | TIMESTAMPTZ |  | YES |  |  | Waktu resolved. |
| created_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu issue dibuat. |

## `audit_logs`
Jejak immutable aktivitas penting. Dipakai untuk create/update/post/reverse/import/login dan perubahan master.

| Field | Datatype | Key | Nullable | Constraint | Example | Description |
|---|---|---|---|---|---|---|
| id | UUID | PK | NO | DEFAULT gen_random_uuid() |  | Primary key log. |
| company_id | UUID | FK | NO | FK -> companies.id; ON DELETE RESTRICT |  | Perusahaan. |
| actor_user_id | UUID | FK | YES | FK -> users.id; ON DELETE SET NULL |  | Pelaku; NULL untuk system job. |
| action | VARCHAR(40) |  | NO |  | POST | Nama aksi extensible. |
| entity_type | VARCHAR(60) |  | NO |  | transaction | Tipe entity. |
| entity_id | UUID |  | NO |  | <transaction uuid> | ID entity generic, tidak FK karena polymorphic. |
| old_value | JSONB |  | YES |  | {"status":"DRAFT"} | Snapshot sebelum. |
| new_value | JSONB |  | YES |  | {"status":"POSTED"} | Snapshot sesudah. |
| source_ip | INET |  | YES |  | 192.168.1.10 | IP bila tersedia. |
| created_at | TIMESTAMPTZ |  | NO | DEFAULT NOW() |  | Waktu event. |

## Reporting Views
- `vw_posted_lines`: Base view untuk semua journal lines yang pernah mempengaruhi ledger. Memasukkan status POSTED dan REVERSED; DRAFT dikecualikan.
- `vw_general_ledger`: Mutasi per akun dengan running balance berdasarkan normal_balance.
- `vw_cash_balances`: Saldo per Giro/Bank/Kas Proyek dari SUM(debit-credit) pada cash_account_id.
- `vw_project_pnl`: Revenue, direct cost, project overhead, dan net profit per project.
- `vw_company_pnl`: Total revenue - direct cost - seluruh overhead, plus breakdown project vs corporate overhead.
- `vw_balance_sheet_accounts`: Saldo akun BALANCE_SHEET berdasarkan ledger dan normal_balance.
- `vw_cashflow_lines`: Perubahan kas per pos dana; TRANSFER_INTERNAL diberi flag agar consolidated cashflow tidak double count.
- `vw_ap_ar_outstanding`: Outstanding = original_amount - SUM(settlement); status dihitung OUTSTANDING/PARTIALLY_PAID/PAID.