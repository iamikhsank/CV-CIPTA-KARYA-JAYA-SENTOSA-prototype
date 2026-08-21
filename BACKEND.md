# CKJS Finance Backend

Backend menggunakan Cloudflare D1 (SQLite) dengan Drizzle sebagai definisi schema. Baseline mengikuti `CKJS_Data_Dictionary_v1.0.md`.

## Database

- 13 tabel inti: company, user, master data, transaction ledger, AP/AR, migration, dan audit.
- Nominal uang disimpan sebagai integer Rupiah agar tidak terkena floating-point rounding.
- Journal line adalah source of truth. Transaksi hanya dapat diposting ketika total debit sama dengan kredit.
- Delete master data dilakukan sebagai soft-disable untuk menjaga referential integrity.
- Migration otomatis bersifat idempotent dan dijalankan saat API pertama kali diakses.
- Bootstrap awal membuat satu company, dua owner, master proyek/kontak/COA, dan enam cash account.

## Reporting views

- `vw_posted_lines`
- `vw_general_ledger`
- `vw_cash_balances`
- `vw_project_pnl`
- `vw_company_pnl`
- `vw_balance_sheet_accounts`
- `vw_cashflow_lines`
- `vw_ap_ar_outstanding`

## API

Base URL: `/api/v1`

| Method | Endpoint | Kegunaan |
|---|---|---|
| GET | `/api/health` | Status service, migration, dan jumlah record |
| GET | `/bootstrap` | Payload awal dashboard |
| GET | `/dashboard` | Ringkasan kas, proyek, P&L, AP/AR, dan transaksi terbaru |
| GET/POST | `/projects` | Daftar/tambah proyek |
| GET/POST | `/contacts` | Daftar/tambah kontak |
| GET/POST | `/accounts` | Daftar/tambah COA |
| GET/POST | `/cash-accounts` | Daftar/tambah pos dana |
| PATCH/DELETE | `/{master}/{id}` | Ubah atau soft-disable master |
| GET/POST | `/transactions` | Daftar/buat draft atau posted transaction |
| POST | `/transactions/{id}/post` | Posting draft yang seimbang |
| POST | `/transactions/{id}/reverse` | Membuat reversal otomatis dan immutable |
| GET/POST | `/ledger-items?type=AR|AP` | Daftar/buat dokumen piutang atau hutang |
| POST | `/ledger-items/{id}/settlements` | Catat partial/full settlement dan jurnalnya |
| GET | `/migration-batches` | Daftar batch migrasi |
| GET | `/audit-logs` | Audit trail terbaru |
| GET | `/reports/{name}` | Data laporan dari reporting view |

Nama laporan: `general-ledger`, `cash-balances`, `project-pnl`, `company-pnl`, `balance-sheet`, `cashflow`, dan `ap-ar-outstanding`.

## Authorization

Pada Sites hosted, write API membaca identity header dari platform dan hanya mengizinkan owner aktif yang terdaftar. Pada localhost, owner Jason digunakan sebagai actor pengembangan. Password plaintext tidak disimpan; kolom hash bootstrap ditandai sebagai identity yang dikelola platform.

## Menjalankan lokal

```bash
npm run dev
```

Database lokal tersimpan dalam state Miniflare/Wrangler di workspace. Buka `http://localhost:3000/api/health` untuk memicu migration dan memeriksa statusnya.
