"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon";
import Download04Icon from "@hugeicons/core-free-icons/Download04Icon";
import MoneyReceive01Icon from "@hugeicons/core-free-icons/MoneyReceive01Icon";
import MoneySend01Icon from "@hugeicons/core-free-icons/MoneySend01Icon";
import PencilEdit02Icon from "@hugeicons/core-free-icons/PencilEdit02Icon";
import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import TransactionIcon from "@hugeicons/core-free-icons/TransactionIcon";
import { LocationLiveClock } from "../components/LocationLiveClock";
import { CustomDropdown, DEFAULT_PERIOD_OPTIONS, StatusBadge } from "../components/ui";
import { formatIDR } from "../data";
import type { Project, Transaction } from "../types";

export function ProjectDetail({
  project,
  transactions,
  back,
  newTransaction,
  selectTransaction,
  onEditProject,
}: {
  project: Project;
  transactions: Transaction[];
  back: () => void;
  newTransaction: () => void;
  selectTransaction: (transaction: Transaction) => void;
  onEditProject?: (project: Project) => void;
}) {
  const [tab, setTab] = useState("Overview");
  const [period, setPeriod] = useState("Agustus 2026");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionType, setTransactionType] = useState<"All" | Transaction["type"]>("All");
  const [transactionStatus, setTransactionStatus] = useState("All");
  const projectTransactions = transactions.filter((item) => item.project === project.name);
  const filteredProjectTransactions = projectTransactions.filter((item) => {
    const query = transactionSearch.trim().toLowerCase();
    const matchesSearch = !query || [item.id, item.description, item.contact, item.category, item.account]
      .some((value) => value.toLowerCase().includes(query));
    const matchesType = transactionType === "All" || item.type === transactionType;
    const matchesStatus = transactionStatus === "All" || item.status === transactionStatus;
    return matchesSearch && matchesType && matchesStatus;
  });
  const totalIncome = projectTransactions.filter((item) => item.type === "Income").reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = projectTransactions.filter((item) => item.type === "Expense").reduce((sum, item) => sum + item.amount, 0);
  const profit = project.revenue - project.expense;

  const exportProjectTransactions = () => {
    const escapeCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = [
      ["Reference", "Date", "Description", "Contact", "Category", "Account", "Type", "Status", "Amount"],
      ...filteredProjectTransactions.map((item) => [
        item.id,
        item.date,
        item.description,
        item.contact,
        item.category,
        item.account,
        item.type,
        item.status,
        item.amount,
      ]),
    ];
    const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${project.code}-transactions.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="detail-top-nav" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "12px" }}>
        <button className="back-button" onClick={back} type="button" style={{ margin: 0 }}>
          ← Back to Projects
        </button>
        <div className="heading-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <LocationLiveClock />
          <CustomDropdown
            ariaLabel="Pilih Periode"
            icon={Calendar03Icon}
            onChange={setPeriod}
            options={DEFAULT_PERIOD_OPTIONS}
            value={period}
          />
        </div>
      </div>
      <div className="detail-hero">
        <div className="project-monogram" style={{ background: project.color }}>
          {project.name.split(" ").map((word) => word[0]).join("")}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="eyebrow">{project.code}</span>
          <h1>{project.name}</h1>
          <p>{project.client} · {project.start} – {project.end}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <StatusBadge status={project.status} />
          {onEditProject && (
            <button
              className="secondary-button"
              onClick={() => onEditProject(project)}
              type="button"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "32px", fontSize: "12px", padding: "0 12px" }}
            >
              <HugeiconsIcon icon={PencilEdit02Icon} size={14} strokeWidth={2} />
              <span>Edit Proyek</span>
            </button>
          )}
        </div>
      </div>
      <div className="tabs">
        {["Overview", "Transactions", "Cash", "P&L", "Ledger"].map((item) => (
          <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item} type="button">
            {item}
          </button>
        ))}
      </div>
      {tab === "Overview" && (
        <>
          <section className="mini-kpi-grid project-kpis">
            <article>
              <span>Contract Revenue</span>
              <strong>{formatIDR(project.revenue)}</strong>
              <small>100% contract value</small>
            </article>
            <article>
              <span>Total Expense</span>
              <strong>{formatIDR(project.expense)}</strong>
              <small>{Math.round((project.expense / project.revenue) * 100)}% of revenue</small>
            </article>
            <article>
              <span>Net Profit</span>
              <strong className="text-green">{formatIDR(profit)}</strong>
              <small>Margin {Math.round((profit / project.revenue) * 100)}%</small>
            </article>
          </section>
          <div className="two-column">
            <article className="panel">
              <div className="panel-head">
                <div>
                  <h2>Financial Progress</h2>
                  <p>Ringkasan realisasi proyek</p>
                </div>
              </div>
              <div className="progress-row">
                <span>Revenue recognized <b>{formatIDR(project.revenue)}</b></span>
                <div><i style={{ width: "78%" }} /></div>
                <small>78% dari nilai kontrak</small>
              </div>
              <div className="progress-row expense-progress">
                <span>Expense realized <b>{formatIDR(project.expense)}</b></span>
                <div><i style={{ width: "63%" }} /></div>
                <small>63% dari estimasi operasional</small>
              </div>
            </article>
            <article className="panel">
              <div className="panel-head">
                <div>
                  <h2>Recent Activity</h2>
                  <p>Transaksi terbaru proyek</p>
                </div>
              </div>
              <div className="activity-list">
                {projectTransactions.slice(0, 3).map((tx) => (
                  <div key={tx.id}>
                    <i className={tx.type.toLowerCase()}>{tx.type === "Income" ? "+" : "−"}</i>
                    <span>
                      <b>{tx.description}</b>
                      <small>{tx.date} · {tx.account}</small>
                    </span>
                    <strong className={tx.type.toLowerCase()}>{tx.type === "Income" ? "+" : "−"}{formatIDR(tx.amount).replace("Rp ", "Rp")}</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </>
      )}
      {tab === "Transactions" && (
        <section className="project-transactions-workbench">
          <header className="project-transactions-head">
            <div>
              <span className="project-workbench-eyebrow">Project activity</span>
              <h2>Transactions</h2>
              <p>Semua pemasukan, pengeluaran, dan transfer yang dialokasikan ke {project.name}.</p>
            </div>
            <div className="project-transactions-actions">
              <button className="secondary-button" disabled={filteredProjectTransactions.length === 0} onClick={exportProjectTransactions} type="button">
                <HugeiconsIcon icon={Download04Icon} size={16} strokeWidth={1.8} /> Export CSV
              </button>
              <button className="primary-button" onClick={newTransaction} type="button">
                <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} /> New transaction
              </button>
            </div>
          </header>

          <div className="project-transaction-summary">
            <article>
              <i className="neutral"><HugeiconsIcon icon={TransactionIcon} size={18} strokeWidth={1.8} /></i>
              <span><small>Total transactions</small><strong>{projectTransactions.length}</strong></span>
            </article>
            <article>
              <i className="income"><HugeiconsIcon icon={MoneyReceive01Icon} size={18} strokeWidth={1.8} /></i>
              <span><small>Money in</small><strong className="text-green">{formatIDR(totalIncome)}</strong></span>
            </article>
            <article>
              <i className="expense"><HugeiconsIcon icon={MoneySend01Icon} size={18} strokeWidth={1.8} /></i>
              <span><small>Money out</small><strong className="text-red">{formatIDR(totalExpense)}</strong></span>
            </article>
            <article>
              <i className="net"><HugeiconsIcon icon={TransactionIcon} size={18} strokeWidth={1.8} /></i>
              <span><small>Net movement</small><strong>{formatIDR(totalIncome - totalExpense)}</strong></span>
            </article>
          </div>

          <div className="project-transactions-toolbar">
            <label className="project-transaction-search">
              <HugeiconsIcon icon={Search01Icon} size={17} strokeWidth={1.8} />
              <input
                aria-label="Cari transaksi proyek"
                onChange={(event) => setTransactionSearch(event.target.value)}
                placeholder="Search reference, description, or account..."
                value={transactionSearch}
              />
            </label>
            <div className="project-transaction-type-filter" aria-label="Filter tipe transaksi" role="group">
              {(["All", "Income", "Expense", "Transfer"] as const).map((type) => (
                <button className={transactionType === type ? "active" : ""} key={type} onClick={() => setTransactionType(type)} type="button">
                  {type}
                </button>
              ))}
            </div>
            <CustomDropdown
              ariaLabel="Filter status transaksi"
              className="project-status-filter"
              onChange={setTransactionStatus}
              options={[
                { label: "All statuses", value: "All" },
                { label: "Posted", value: "POSTED" },
                { label: "Draft", value: "DRAFT" },
                { label: "Reversed", value: "REVERSED" },
              ]}
              value={transactionStatus}
            />
          </div>

          <div className="project-transactions-table-wrap">
            <table className="project-transactions-table">
              <thead>
                <tr>
                  <th>Date &amp; reference</th>
                  <th>Transaction</th>
                  <th>Category</th>
                  <th>Account</th>
                  <th>Status</th>
                  <th className="amount-column">Amount</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filteredProjectTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="project-transaction-reference"><b>{transaction.date}</b><small>{transaction.id}</small></td>
                    <td>
                      <div className="project-transaction-identity">
                        <i className={transaction.type.toLowerCase()}>{transaction.type === "Income" ? "+" : transaction.type === "Expense" ? "−" : "↔"}</i>
                        <span><b>{transaction.description}</b><small>{transaction.contact}</small></span>
                      </div>
                    </td>
                    <td><span className="project-transaction-category">{transaction.category}</span></td>
                    <td className="project-transaction-account">{transaction.account}</td>
                    <td><StatusBadge iconPosition="none" status={transaction.status} /></td>
                    <td className={`project-transaction-amount ${transaction.type.toLowerCase()}`}>
                      {transaction.type === "Income" ? "+" : transaction.type === "Expense" ? "−" : ""}{formatIDR(transaction.amount)}
                    </td>
                    <td>
                      <button className="project-transaction-open" aria-label={`Buka ${transaction.id}`} onClick={() => selectTransaction(transaction)} type="button">
                        <HugeiconsIcon icon={ArrowRight01Icon} size={17} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProjectTransactions.length === 0 && (
              <div className="project-transaction-empty">
                <i><HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={1.8} /></i>
                <b>No transactions found</b>
                <p>Coba ubah kata pencarian atau filter yang sedang digunakan.</p>
                <button className="secondary-button" onClick={() => { setTransactionSearch(""); setTransactionType("All"); setTransactionStatus("All"); }} type="button">Reset filters</button>
              </div>
            )}
          </div>

          <footer className="project-transactions-footer">
            <span>Showing <b>{filteredProjectTransactions.length}</b> of <b>{projectTransactions.length}</b> project transactions</span>
            <small>Period: {period}</small>
          </footer>
        </section>
      )}
      {tab !== "Overview" && tab !== "Transactions" && (
        <article className="panel section-placeholder">
          <div className="section-icon">{tab === "P&L" ? "▥" : tab === "Cash" ? "▣" : "↕"}</div>
          <h2>{tab} — {project.name}</h2>
          <p>Data {tab.toLowerCase()} sudah terhubung ke project dan periode aktif.</p>
          {tab === "P&L" && (
            <div className="statement compact">
              <div><span>Revenue</span><strong>{formatIDR(project.revenue)}</strong></div>
              <div><span>Project expenses</span><strong>({formatIDR(project.expense)})</strong></div>
              <div className="statement-total"><span>Net project profit</span><strong>{formatIDR(profit)}</strong></div>
            </div>
          )}
        </article>
      )}
    </>
  );
}
