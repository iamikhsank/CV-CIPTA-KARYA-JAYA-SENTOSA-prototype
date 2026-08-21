"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import BankIcon from "@hugeicons/core-free-icons/BankIcon";
import Book01Icon from "@hugeicons/core-free-icons/Book01Icon";
import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import Invoice01Icon from "@hugeicons/core-free-icons/Invoice01Icon";
import MoneyReceive01Icon from "@hugeicons/core-free-icons/MoneyReceive01Icon";
import MoneySend01Icon from "@hugeicons/core-free-icons/MoneySend01Icon";
import Payment01Icon from "@hugeicons/core-free-icons/Payment01Icon";
import { LocationLiveClock } from "../components/LocationLiveClock";
import { CustomDropdown, DEFAULT_PERIOD_OPTIONS, StatusBadge } from "../components/ui";
import { SmartCurrencyInput } from "../components/SmartCurrencyInput";
import { formatIDR, payables, receivables } from "../data";
import type { CashAccount, LedgerRecord, PaymentHistoryRow, PaymentInput } from "../types";

type LedgerType = "AR" | "AP";

export function LedgerRecordDetail({
  type,
  row,
  accounts,
  recordedPayments,
  back,
  recordPayment,
}: {
  type: LedgerType;
  row: LedgerRecord;
  accounts: CashAccount[];
  recordedPayments: PaymentInput[];
  back: () => void;
  recordPayment: (payment: PaymentInput) => void;
}) {
  const [tab, setTab] = useState<"Overview" | "Payment History" | "Journal">("Overview");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const isAR = type === "AR";
  const outstanding = row.total - row.paid;
  const settled = Math.round((row.paid / (row.total || 1)) * 100);
  const seed = (isAR ? receivables : payables).find((item) => item.ref === row.ref);

  const formatPaymentDate = (value: string) => {
    const [year, month, day] = value.split("-");
    return `${day} ${
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ][Number(month) - 1]
    } ${year}`;
  };

  const paymentRows: PaymentHistoryRow[] = [
    ...(seed && seed.paid > 0
      ? [
          {
            date: "12 Agu 2026",
            reference: `PAY-${row.ref.replace(/\W/g, "").slice(-8)}-01`,
            account: isAR ? "Giro BCA" : "Bank Operasional BCA",
            amount: seed.paid,
          },
        ]
      : []),
    ...recordedPayments.map((payment) => ({
      date: formatPaymentDate(payment.date),
      reference: payment.reference,
      account: payment.account,
      amount: payment.amount,
    })),
  ];

  const submitPayment = (payment: PaymentInput) => {
    recordPayment(payment);
    setPaymentOpen(false);
  };

  return (
    <div
      className={`ledger-detail-wrapper ${isAR ? "ledger-detail-receivable" : "ledger-detail-payable"}`}
    >
      {/* Back Button */}
      <button className="ledger-back-btn" onClick={back} type="button">
        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} />
        <span>Kembali ke {isAR ? "Receivables (Piutang)" : "Payables (Hutang)"}</span>
      </button>

      {/* Hero Header Card */}
      <section className="ledger-header-card">
        <div className="ledger-header-main">
          <div className={`ledger-doc-emblem ${isAR ? "receivable" : "payable"}`}>
            <HugeiconsIcon
              icon={isAR ? MoneyReceive01Icon : MoneySend01Icon}
              size={24}
              strokeWidth={2}
            />
          </div>
          <div className="ledger-header-meta">
            <div className="ledger-meta-top">
              <span className={`ledger-type-tag ${isAR ? "receivable" : "payable"}`}>
                {isAR ? "ACCOUNTS RECEIVABLE" : "ACCOUNTS PAYABLE"}
              </span>
              <span className="gl-mapping-tag">{row.project}</span>
            </div>
            <h1 className="ledger-doc-title">{row.ref}</h1>
            <p className="ledger-doc-subtitle">
              {row.party} · {row.project}
            </p>
          </div>
        </div>

        <div className="ledger-header-actions">
          <LocationLiveClock />
          <CustomDropdown
            ariaLabel="Pilih Periode"
            icon={Calendar03Icon}
            onChange={() => {}}
            options={DEFAULT_PERIOD_OPTIONS}
            value="Agustus 2026"
          />
          <StatusBadge status={row.status} />
          <button
            className="primary-button"
            disabled={outstanding === 0}
            onClick={() => setPaymentOpen(true)}
            type="button"
          >
            <HugeiconsIcon icon={Payment01Icon} size={16} strokeWidth={2} />
            <span>Record Payment</span>
          </button>
        </div>
      </section>

      {/* 4-Column KPI Grid */}
      <section className="ledger-kpi-grid" aria-label="Ringkasan Nilai Tagihan">
        <article className="ledger-kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Nilai Tagihan Dokumen</span>
          </div>
          <strong className="kpi-card-val">{formatIDR(row.total)}</strong>
          <small className="kpi-card-sub">Nilai invoice resmi</small>
        </article>

        <article className="ledger-kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Sudah Dibayar (Paid)</span>
            <span className="kpi-tag-status">{settled}% Lunas</span>
          </div>
          <strong className="kpi-card-val text-green">{formatIDR(row.paid)}</strong>
          <small className="kpi-card-sub">{settled}% telah diselesaikan</small>
        </article>

        <article className="ledger-kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Sisa Belum Dibayar</span>
          </div>
          <strong className={`kpi-card-val ${outstanding > 0 ? "text-red" : "text-green"}`}>
            {formatIDR(outstanding)}
          </strong>
          <small className="kpi-card-sub">
            {outstanding > 0 ? `Jatuh tempo ${row.due}` : "Lunas sepenuhnya"}
          </small>
        </article>

        <article className="ledger-kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Progres Pelunasan</span>
            <strong className="mono-num" style={{ fontSize: "12px", color: "var(--ink)" }}>
              {settled}%
            </strong>
          </div>
          <strong className="kpi-card-val">{settled}%</strong>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${settled}%` }} />
          </div>
        </article>
      </section>

      {/* Segmented Tab Navigation with Vertical Dividers */}
      <div className="treasury-tab-nav" role="tablist">
        <button
          className={`treasury-tab-item ${tab === "Overview" ? "active" : ""}`}
          role="tab"
          aria-selected={tab === "Overview"}
          onClick={() => setTab("Overview")}
          type="button"
        >
          <span>Ringkasan Dokumen</span>
        </button>
        <button
          className={`treasury-tab-item ${tab === "Payment History" ? "active" : ""}`}
          role="tab"
          aria-selected={tab === "Payment History"}
          onClick={() => setTab("Payment History")}
          type="button"
        >
          <span>Riwayat Pembayaran</span>
          <span className="tab-count-badge">{paymentRows.length}</span>
        </button>
        <button
          className={`treasury-tab-item ${tab === "Journal" ? "active" : ""}`}
          role="tab"
          aria-selected={tab === "Journal"}
          onClick={() => setTab("Journal")}
          type="button"
        >
          <span>Jurnal Otomatis</span>
          <span className="tab-pill-state">Seimbang</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {tab === "Overview" && (
        <LedgerOverview
          type={type}
          row={row}
          outstanding={outstanding}
          settled={settled}
          openPayment={() => setPaymentOpen(true)}
        />
      )}

      {/* Tab 2: Payment History */}
      {tab === "Payment History" && (
        <PaymentHistory
          row={row}
          payments={paymentRows}
          outstanding={outstanding}
          openPayment={() => setPaymentOpen(true)}
        />
      )}

      {/* Tab 3: Automatic Journal */}
      {tab === "Journal" && (
        <PaymentJournal type={type} row={row} paymentCount={paymentRows.length} />
      )}

      {/* Record Payment Modal */}
      {paymentOpen && (
        <RecordPaymentModal
          type={type}
          row={row}
          accounts={accounts}
          close={() => setPaymentOpen(false)}
          submit={submitPayment}
        />
      )}
    </div>
  );
}

function LedgerOverview({
  type,
  row,
  outstanding,
  settled,
  openPayment,
}: {
  type: LedgerType;
  row: LedgerRecord;
  outstanding: number;
  settled: number;
  openPayment: () => void;
}) {
  const isAR = type === "AR";
  return (
    <div className="ledger-overview-grid">
      {/* Left Card: Document Information */}
      <article className="ledger-card">
        <div className="ledger-card-header">
          <div>
            <h2 className="ledger-card-title">Informasi Dokumen & Rekanan</h2>
            <p className="ledger-card-desc">Detail identitas tagihan dan pihak rekanan terkait</p>
          </div>
        </div>

        <div className="treasury-table-kv">
          <div className="kv-row">
            <span className="kv-key">Nomor Referensi</span>
            <span className="kv-val font-semibold">
              <code className="cell-ref-id">{row.ref}</code>
            </span>
          </div>
          <div className="kv-row">
            <span className="kv-key">{isAR ? "Nama Klien (Debitur)" : "Nama Vendor (Kreditur)"}</span>
            <span className="kv-val font-bold text-ink">{row.party}</span>
          </div>
          <div className="kv-row">
            <span className="kv-key">Alokasi Proyek</span>
            <span className="kv-val font-semibold">{row.project}</span>
          </div>
          <div className="kv-row">
            <span className="kv-key">Tanggal Penerbitan</span>
            <span className="kv-val">01 Agu 2026</span>
          </div>
          <div className="kv-row">
            <span className="kv-key">Tanggal Jatuh Tempo</span>
            <span className="kv-val font-semibold">{row.due}</span>
          </div>
          <div className="kv-row">
            <span className="kv-key">Status Dokumen</span>
            <span className="kv-val">
              <StatusBadge status={row.status} />
            </span>
          </div>
        </div>
      </article>

      {/* Right Card: Payment Summary */}
      <article className="ledger-card">
        <div className="ledger-card-header">
          <div>
            <h2 className="ledger-card-title">Posisi Pembayaran & Saldo</h2>
            <p className="ledger-card-desc">Rincian mutasi pelunasan dan sisa tagihan berjalan</p>
          </div>
        </div>

        <div className="settlement-summary-box">
          <div className="settlement-row">
            <span className="text-muted">Total Nilai Dokumen:</span>
            <span className="mono-num font-bold">{formatIDR(row.total)}</span>
          </div>
          <div className="settlement-row">
            <span className="text-muted">Pembayaran Terposting:</span>
            <span className="mono-num font-bold text-green">{formatIDR(row.paid)}</span>
          </div>
          <div className="settlement-row highlight">
            <span>Sisa Tagihan (Outstanding):</span>
            <span className={`mono-num font-extrabold ${outstanding > 0 ? "text-red" : "text-green"}`}>
              {formatIDR(outstanding)}
            </span>
          </div>
        </div>

        {outstanding > 0 && (
          <button className="ledger-action-callout" onClick={openPayment} type="button">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                className="ledger-action-icon"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#1a2332",
                  color: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <HugeiconsIcon icon={Payment01Icon} size={18} strokeWidth={2} />
              </div>
              <span>
                <b>Catat Pembayaran Dokumen</b>
                <small>Maksimal penerimaan {formatIDR(outstanding)}</small>
              </span>
            </div>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
          </button>
        )}
      </article>
    </div>
  );
}

function PaymentHistory({
  row,
  payments,
  outstanding,
  openPayment,
}: {
  row: LedgerRecord;
  payments: PaymentHistoryRow[];
  outstanding: number;
  openPayment: () => void;
}) {
  return (
    <article className="ledger-card full-workbench">
      <div className="treasury-toolbar">
        <div>
          <h2 className="ledger-card-title">Riwayat Pembayaran</h2>
          <p className="ledger-card-desc">Seluruh transaksi pelunasan yang diterapkan ke dokumen ini</p>
        </div>
        {outstanding > 0 && (
          <button className="primary-button" onClick={openPayment} type="button">
            <HugeiconsIcon icon={Payment01Icon} size={16} strokeWidth={2} />
            <span>Record Payment</span>
          </button>
        )}
      </div>

      <div className="table-wrap full-table" style={{ margin: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Tanggal Pembayaran</th>
              <th>No. Referensi Pembayaran</th>
              <th>Rekening Kas / Bank</th>
              <th>Metode</th>
              <th style={{ textAlign: "right" }}>Nominal (IDR)</th>
              <th style={{ textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length ? (
              payments.map((payment) => (
                <tr key={payment.reference}>
                  <td>
                    <b>{payment.date}</b>
                  </td>
                  <td>
                    <b>{payment.reference}</b>
                    <small>Diterapkan ke {row.ref}</small>
                  </td>
                  <td>{payment.account}</td>
                  <td>Bank Transfer</td>
                  <td style={{ textAlign: "right" }} className="profit">
                    <b>{formatIDR(payment.amount)}</b>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <StatusBadge status="POSTED" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "36px", color: "var(--muted)" }}>
                  Belum ada catatan pembayaran untuk dokumen ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function PaymentJournal({
  type,
  row,
  paymentCount,
}: {
  type: LedgerType;
  row: LedgerRecord;
  paymentCount: number;
}) {
  const isAR = type === "AR";
  return (
    <article className="ledger-card full-workbench">
      <div className="treasury-toolbar">
        <div>
          <h2 className="ledger-card-title">Jurnal Akuntansi Otomatis</h2>
          <p className="ledger-card-desc">Jurnal terbentuk otomatis dari siklus dokumen dan pembayaran</p>
        </div>
        <span className="kpi-tag-status">BALANCED</span>
      </div>

      <div className="table-wrap full-table" style={{ margin: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Tanggal / No. Bukti</th>
              <th>Akun Perkiraan (COA)</th>
              <th>Keterangan Jurnal</th>
              <th style={{ textAlign: "right" }}>Debit (IDR)</th>
              <th style={{ textAlign: "right" }}>Kredit (IDR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <b>01 Agu 2026</b>
                <small>{row.ref}</small>
              </td>
              <td>
                <b>{isAR ? "1-1301 · Piutang Usaha" : "5-1101 · Beban Proyek"}</b>
                <small>{row.project}</small>
              </td>
              <td>Pengakuan Dokumen Tagihan</td>
              <td style={{ textAlign: "right" }} className="text-green font-bold">
                {formatIDR(row.total)}
              </td>
              <td style={{ textAlign: "right" }}>—</td>
            </tr>
            <tr>
              <td>
                <b>01 Agu 2026</b>
                <small>{row.ref}</small>
              </td>
              <td>
                <b>{isAR ? "4-1001 · Pendapatan Proyek" : "2-1101 · Hutang Usaha"}</b>
                <small>{row.project}</small>
              </td>
              <td>Pengakuan Dokumen Tagihan</td>
              <td style={{ textAlign: "right" }}>—</td>
              <td style={{ textAlign: "right" }} className="text-red font-bold">
                {formatIDR(row.total)}
              </td>
            </tr>
            {row.paid > 0 && (
              <>
                <tr>
                  <td>
                    <b>Mutasi Pembayaran</b>
                    <small>{paymentCount} transaksi posted</small>
                  </td>
                  <td>
                    <b>{isAR ? "1-1101 · Kas & Bank" : "2-1101 · Hutang Usaha"}</b>
                  </td>
                  <td>Pelunasan Pembayaran Dokumen</td>
                  <td style={{ textAlign: "right" }} className="text-green font-bold">
                    {formatIDR(row.paid)}
                  </td>
                  <td style={{ textAlign: "right" }}>—</td>
                </tr>
                <tr>
                  <td>
                    <b>Mutasi Pembayaran</b>
                    <small>Auto-generated</small>
                  </td>
                  <td>
                    <b>{isAR ? "1-1301 · Piutang Usaha" : "1-1101 · Kas & Bank"}</b>
                  </td>
                  <td>Pelunasan Pembayaran Dokumen</td>
                  <td style={{ textAlign: "right" }}>—</td>
                  <td style={{ textAlign: "right" }} className="text-red font-bold">
                    {formatIDR(row.paid)}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="treasury-card-footer" style={{ padding: "14px 18px" }}>
        <div className="ledger-balance-audit-note">
          <HugeiconsIcon icon={Book01Icon} size={16} strokeWidth={2} />
          <span>
            <strong>Jurnal Seimbang (Balanced):</strong> Seluruh entri debit dan kredit terbentuk otomatis tanpa selisih.
          </span>
        </div>
      </div>
    </article>
  );
}

function RecordPaymentModal({
  type,
  row,
  accounts,
  close,
  submit,
}: {
  type: LedgerType;
  row: LedgerRecord;
  accounts: CashAccount[];
  close: () => void;
  submit: (payment: PaymentInput) => void;
}) {
  const outstanding = row.total - row.paid;
  const isAR = type === "AR";
  const [amount, setAmount] = useState(outstanding);
  const [account, setAccount] = useState(accounts[0]?.name ?? "Bank Operasional BCA");
  const [date, setDate] = useState("2026-08-21");
  const [reference, setReference] = useState(`PAY-${row.ref.replace(/\W/g, "").slice(-8)}-02`);
  const [notes, setNotes] = useState("");

  const valid = amount > 0 && amount <= outstanding && reference.trim().length > 2;

  const post = (event: FormEvent) => {
    event.preventDefault();
    if (valid) submit({ amount, account, date, reference, notes });
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Record payment">
      <form className="modal-card payment-modal" onSubmit={post}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">{isAR ? "RECEIVE PAYMENT" : "RECORD PAYMENT"}</span>
            <h2>{isAR ? "Catat Pembayaran Piutang" : "Catat Pembayaran Hutang"}</h2>
            <p>Terapkan pembayaran ke dokumen {row.ref} dan posting jurnal otomatis.</p>
          </div>
          <button onClick={close} className="modal-close-btn" aria-label="Tutup" type="button">
            ×
          </button>
        </div>

        <div className="payment-modal-body">
          {/* Redesigned Clean Enterprise Document Card (No Slop / No Cartoon Icon) */}
          <div className="payment-doc-card">
            <div className="doc-card-main">
              <div className="doc-ref-row">
                <span className="doc-tag">{isAR ? "INV" : "BILL"}</span>
                <span className="doc-ref-code">{row.ref}</span>
                <span className="doc-party-title">{row.party}</span>
              </div>
              <div className="doc-project-sub">{row.project}</div>
            </div>

            <div className="doc-card-stat">
              <span className="doc-stat-label">Sisa Outstanding</span>
              <strong className="doc-stat-val">{formatIDR(outstanding)}</strong>
            </div>
          </div>

          {/* Payment Amount Input with Smart Indonesian Separator Formatter */}
          <div className="payment-form-group">
            <label>Payment Amount (IDR)</label>
            <div className="payment-amount-box">
              <span className="payment-amount-prefix">Rp</span>
              <SmartCurrencyInput
                value={amount}
                onChange={setAmount}
                max={outstanding}
                min={1}
                autoFocus
                className="payment-amount-input"
                ariaLabel="Payment Amount"
              />
            </div>
            {amount > outstanding && (
              <small className="field-error">
                Nominal pembayaran tidak boleh melebihi sisa outstanding.
              </small>
            )}
          </div>

          {/* Form Grid (2 Columns) */}
          <div className="payment-grid-2col">
            <div className="payment-form-group">
              <label>Tanggal Pembayaran</label>
              <div className="payment-input-wrap">
                <i className="payment-input-icon">
                  <HugeiconsIcon icon={Calendar03Icon} size={16} strokeWidth={2} />
                </i>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="payment-form-input has-icon"
                />
              </div>
            </div>

            <div className="payment-form-group">
              <label>Rekening Kas / Bank</label>
              <div className="payment-input-wrap">
                <i className="payment-input-icon">
                  <HugeiconsIcon icon={BankIcon} size={16} strokeWidth={2} />
                </i>
                <select
                  value={account}
                  onChange={(event) => setAccount(event.target.value)}
                  className="payment-form-input has-icon"
                >
                  {accounts.map((item) => (
                    <option key={item.name}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="payment-form-group">
              <label>Metode Pembayaran</label>
              <select defaultValue="Bank Transfer" className="payment-form-input">
                <option>Bank Transfer</option>
                <option>Cash</option>
                <option>Giro</option>
              </select>
            </div>

            <div className="payment-form-group">
              <label>Nomor Referensi Pembayaran</label>
              <input
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                className="payment-form-input"
              />
            </div>
          </div>

          {/* Notes Full Width */}
          <div className="payment-form-group">
            <label>Catatan Pembayaran (Opsional)</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Catatan tambahan..."
              className="payment-textarea"
            />
          </div>

          {/* Payment Impact Summary Card */}
          <div className="payment-impact-card">
            <div className="payment-impact-row">
              <div className="payment-impact-lead">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={16}
                  strokeWidth={2}
                  className="text-green"
                />
                <div>
                  <b>Setelah Pembayaran Ini</b>
                  <small>Estimasi sisa tagihan berikutnya</small>
                </div>
              </div>
              <strong className="mono-num text-ink font-bold" style={{ fontSize: "14px" }}>
                {formatIDR(Math.max(0, outstanding - amount))}
              </strong>
            </div>
            <p className="payment-impact-footnote">
              Pembayaran akan otomatis mengupdate saldo kas, status invoice, riwayat transaksi, dan jurnal buku besar.
            </p>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="modal-actions-bar">
          <button className="modal-cancel-btn" onClick={close} type="button">
            Batal
          </button>
          <button className="primary-button" disabled={!valid} type="submit">
            <HugeiconsIcon icon={Payment01Icon} size={16} strokeWidth={2} />
            <span>Post Payment</span>
          </button>
        </div>
      </form>
    </div>
  );
}
