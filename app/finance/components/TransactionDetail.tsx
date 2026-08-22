"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDataTransferHorizontalIcon from "@hugeicons/core-free-icons/ArrowDataTransferHorizontalIcon";
import ArrowDownRight01Icon from "@hugeicons/core-free-icons/ArrowDownRight01Icon";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";
import Building03Icon from "@hugeicons/core-free-icons/Building03Icon";
import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import Invoice03Icon from "@hugeicons/core-free-icons/Invoice03Icon";
import PackageIcon from "@hugeicons/core-free-icons/PackageIcon";
import RotateClockwiseIcon from "@hugeicons/core-free-icons/RotateClockwiseIcon";
import Tag01Icon from "@hugeicons/core-free-icons/Tag01Icon";
import UserIcon from "@hugeicons/core-free-icons/UserIcon";
import Wallet01Icon from "@hugeicons/core-free-icons/Wallet01Icon";
import { formatIDR } from "../data";
import type { Transaction } from "../types";
import { StatusBadge } from "./ui";

function transactionIcon(type: Transaction["type"]) {
  if (type === "Income") return ArrowUpRight01Icon;
  if (type === "Expense") return ArrowDownRight01Icon;
  return ArrowDataTransferHorizontalIcon;
}

function journalAccounts(transaction: Transaction) {
  if (transaction.type === "Expense") {
    return {
      debit: { name: transaction.category, detail: transaction.project },
      credit: { name: transaction.account, detail: transaction.contact },
    };
  }

  if (transaction.type === "Income") {
    return {
      debit: { name: transaction.account, detail: transaction.project },
      credit: { name: transaction.category, detail: transaction.contact },
    };
  }

  return {
    debit: { name: transaction.category, detail: transaction.project },
    credit: { name: transaction.account, detail: transaction.contact },
  };
}

export function TransactionDetail({
  transaction,
  close,
  reverse,
}: {
  transaction: Transaction;
  close: () => void;
  reverse: (tx: Transaction) => void;
}) {
  const journal = journalAccounts(transaction);
  const tone = transaction.type.toLowerCase();

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="transaction-detail-title">
      <div className={`modal-card transaction-detail-modal ${tone}`}>
        <header className="transaction-detail-head">
          <div>
            <span className="transaction-detail-id">{transaction.id}</span>
            <h2 id="transaction-detail-title">Transaction Detail</h2>
            <p>{transaction.date} · Created by Jason Ibrahim</p>
            <div className="transaction-detail-badges">
              <StatusBadge status={transaction.status} />
              <span className={`transaction-kind-badge ${tone}`}>{transaction.type}</span>
            </div>
          </div>
          <button className="transaction-detail-close" onClick={close} aria-label="Close transaction detail" type="button">
            <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={1.8} />
          </button>
        </header>

        <div className="transaction-detail-layout">
          <section className="transaction-detail-left" aria-label="Transaction summary">
            <div className={`transaction-amount-card ${tone}`}>
              <i aria-hidden="true">
                <HugeiconsIcon icon={transactionIcon(transaction.type)} size={30} strokeWidth={1.9} />
              </i>
              <div>
                <span>Total Amount</span>
                <strong>{formatIDR(transaction.amount)}</strong>
                <p>{transaction.description}</p>
              </div>
            </div>

            <section className="transaction-info-card">
              <header>
                <HugeiconsIcon icon={Invoice03Icon} size={17} strokeWidth={1.9} />
                <h3>Transaction Information</h3>
              </header>
              <dl>
                <div>
                  <i><HugeiconsIcon icon={Building03Icon} size={17} strokeWidth={1.8} /></i>
                  <span><dt>Project / Scope</dt><dd>{transaction.project}</dd></span>
                </div>
                <div>
                  <i><HugeiconsIcon icon={Tag01Icon} size={17} strokeWidth={1.8} /></i>
                  <span><dt>Category</dt><dd>{transaction.category}</dd></span>
                </div>
                {transaction.materialVolume && (
                  <div>
                    <i><HugeiconsIcon icon={PackageIcon} size={17} strokeWidth={1.8} /></i>
                    <span><dt>Volume Material</dt><dd>{transaction.materialVolume}</dd></span>
                  </div>
                )}
                <div>
                  <i><HugeiconsIcon icon={Wallet01Icon} size={17} strokeWidth={1.8} /></i>
                  <span><dt>Cash Account</dt><dd>{transaction.account}</dd></span>
                </div>
                <div>
                  <i><HugeiconsIcon icon={UserIcon} size={17} strokeWidth={1.8} /></i>
                  <span><dt>Contact</dt><dd>{transaction.contact}</dd></span>
                </div>
                {transaction.dueDate && (
                  <div>
                    <i><HugeiconsIcon icon={Calendar03Icon} size={17} strokeWidth={1.8} /></i>
                    <span><dt>Due Date (Tempo)</dt><dd>{transaction.dueDate}</dd></span>
                  </div>
                )}
                {transaction.referenceNo && (
                  <div>
                    <i><HugeiconsIcon icon={Invoice03Icon} size={17} strokeWidth={1.8} /></i>
                    <span><dt>Reference / Bukti</dt><dd>{transaction.referenceNo}</dd></span>
                  </div>
                )}
              </dl>
            </section>

            <div className="transaction-audit-card">
              <i aria-hidden="true"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} strokeWidth={1.9} /></i>
              <span>
                <b>Audit trail verified</b>
                <small>Posted 18 Agu 2026, 10:42 WIB by Jason Ibrahim</small>
              </span>
            </div>
          </section>

          <section className="transaction-journal-card" aria-label="Journal entry">
            <header>
              <div className="transaction-journal-title">
                <i><HugeiconsIcon icon={Invoice03Icon} size={18} strokeWidth={1.9} /></i>
                <span>
                  <h3>Journal Entry</h3>
                  <p>Automatic double-entry lines</p>
                </span>
              </div>
              <span className="journal-balanced-badge">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} strokeWidth={2} />
                Balanced
              </span>
            </header>

            <div className="transaction-journal-table">
              <div className="transaction-journal-row head">
                <span>Account</span><span>Debit</span><span>Credit</span>
              </div>
              <div className="transaction-journal-row">
                <span><b>{journal.debit.name}</b><small>{journal.debit.detail}</small></span>
                <strong>{formatIDR(transaction.amount)}</strong>
                <strong>—</strong>
              </div>
              <div className="transaction-journal-row">
                <span><b>{journal.credit.name}</b><small>{journal.credit.detail}</small></span>
                <strong>—</strong>
                <strong>{formatIDR(transaction.amount)}</strong>
              </div>
              <div className="transaction-journal-row total">
                <span>Total</span>
                <strong>{formatIDR(transaction.amount)}</strong>
                <strong>{formatIDR(transaction.amount)}</strong>
              </div>
            </div>

            <div className="journal-balance-confirmation">
              <span>Debit and credit are balanced</span>
              <b><HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} strokeWidth={2} /> Balanced</b>
            </div>
          </section>
        </div>

        <footer className="transaction-detail-footer">
          <p>
            {transaction.status === "POSTED"
              ? "This transaction has been posted and cannot be edited."
              : transaction.status === "REVERSED"
                ? "This transaction has been reversed and is retained for audit history."
                : "This transaction is still a draft and can be edited."}
          </p>
          <div>
            {transaction.status === "DRAFT" && <button className="secondary-button" type="button">Edit Draft</button>}
            {transaction.status === "POSTED" && (
              <button className="transaction-reverse-button" onClick={() => reverse(transaction)} type="button">
                <HugeiconsIcon icon={RotateClockwiseIcon} size={17} strokeWidth={1.9} />
                Reverse Transaction
              </button>
            )}
            <button className="primary-button" onClick={close} type="button">Close</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
