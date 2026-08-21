"use client";

import { useMemo, useState, type FormEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import BookOpen01Icon from "@hugeicons/core-free-icons/BookOpen01Icon";
import BubbleChatQuestionIcon from "@hugeicons/core-free-icons/BubbleChatQuestionIcon";
import CallIcon from "@hugeicons/core-free-icons/CallIcon";
import Chart01Icon from "@hugeicons/core-free-icons/Chart01Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import Clock01Icon from "@hugeicons/core-free-icons/Clock01Icon";
import CustomerSupportIcon from "@hugeicons/core-free-icons/CustomerSupportIcon";
import Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import TransactionIcon from "@hugeicons/core-free-icons/TransactionIcon";
import Wallet02Icon from "@hugeicons/core-free-icons/Wallet02Icon";
import { PageIntro } from "../components/ui";

type SupportCategory = "All" | "Getting Started" | "Transactions" | "Cash & Payments" | "Reports";

const categories = [
  { label: "Getting Started", description: "Workspace, proyek, dan setup awal", articles: 6, icon: BookOpen01Icon },
  { label: "Transactions", description: "Pencatatan, posting, dan reversal", articles: 9, icon: TransactionIcon },
  { label: "Cash & Payments", description: "Kas, transfer, AR, dan AP", articles: 8, icon: Wallet02Icon },
  { label: "Reports", description: "GL, cashflow, P&L, dan balance sheet", articles: 7, icon: Chart01Icon },
] as const;

const faqs: Array<{ category: Exclude<SupportCategory, "All">; question: string; answer: string }> = [
  { category: "Getting Started", question: "Bagaimana memulai pencatatan keuangan CKJS?", answer: "Lengkapi profil perusahaan, buat proyek aktif, lalu periksa Chart of Accounts dan pos kas. Setelah itu transaksi dapat dicatat dari tombol New Transaction di dashboard." },
  { category: "Transactions", question: "Apa perbedaan Draft, Posted, dan Reversed?", answer: "Draft masih dapat diedit dan belum memengaruhi laporan. Posted sudah masuk ke buku besar. Reversed mempertahankan audit trail dengan membuat jurnal pembalik, bukan menghapus transaksi lama." },
  { category: "Transactions", question: "Bagaimana memperbaiki transaksi yang sudah diposting?", answer: "Buka detail transaksi, pilih Reverse Transaction, lalu buat transaksi pengganti dengan nilai yang benar. Cara ini menjaga jejak audit tetap lengkap." },
  { category: "Cash & Payments", question: "Apakah transfer antar pos kas memengaruhi laba rugi?", answer: "Tidak. Transfer hanya memindahkan saldo antar akun kas. Total aset likuid dan nilai laba rugi tidak berubah." },
  { category: "Cash & Payments", question: "Bagaimana mencatat pembayaran piutang atau utang sebagian?", answer: "Buka Receivables atau Payables, pilih dokumen, lalu gunakan Record Payment. Sistem otomatis memperbarui status menjadi Partially Paid dan menyesuaikan saldo kas." },
  { category: "Reports", question: "Mengapa angka dashboard berbeda dengan laporan proyek?", answer: "Dashboard dapat menampilkan seluruh perusahaan, sedangkan laporan proyek mengikuti filter proyek dan periode. Samakan kedua filter untuk melakukan rekonsiliasi." },
  { category: "Reports", question: "Bagaimana memastikan General Ledger sudah seimbang?", answer: "Pilih periode laporan dan periksa total debit serta kredit pada footer General Ledger. Selisih harus bernilai Rp 0 sebelum periode ditutup." },
];

export function HelpSupportView({ notify }: { notify: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SupportCategory>("All");
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0].question);
  const [requestOpen, setRequestOpen] = useState(false);

  const filteredFaqs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return faqs.filter((item) => {
      const inCategory = category === "All" || item.category === category;
      const matchesQuery = !normalized || `${item.question} ${item.answer} ${item.category}`.toLowerCase().includes(normalized);
      return inCategory && matchesQuery;
    });
  }, [category, query]);

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestOpen(false);
    notify("Permintaan bantuan SUP-1042 berhasil dibuat. Tim support akan menghubungi Anda.");
  };

  return (
    <>
      <PageIntro
        title="Help & Support"
        description="Temukan panduan penggunaan atau hubungi tim support CKJS Finance."
        action={<button className="primary-button" onClick={() => setRequestOpen(true)} type="button"><HugeiconsIcon icon={CustomerSupportIcon} size={16} strokeWidth={1.8} /> New support request</button>}
      />

      <section className="support-hero">
        <div className="support-hero-copy"><span>CKJS KNOWLEDGE BASE</span><h2>How can we help?</h2><p>Cari jawaban untuk transaksi, pembayaran, laporan, dan pengaturan sistem.</p></div>
        <label className="support-search"><HugeiconsIcon icon={Search01Icon} size={19} strokeWidth={1.8} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search help articles..." aria-label="Search help articles" /><kbd>⌘ K</kbd></label>
      </section>

      <section className="support-category-grid" aria-label="Help categories">
        {categories.map((item) => (
          <button className={`support-category-card ${category === item.label ? "active" : ""}`} onClick={() => setCategory(category === item.label ? "All" : item.label)} key={item.label} type="button">
            <i><HugeiconsIcon icon={item.icon} size={21} strokeWidth={1.7} /></i>
            <span><b>{item.label}</b><small>{item.description}</small><em>{item.articles} articles</em></span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.8} />
          </button>
        ))}
      </section>

      {requestOpen && (
        <form className="panel support-request-form" onSubmit={submitRequest}>
          <div className="support-panel-head"><div><span>SUPPORT REQUEST</span><h2>Tell us what you need</h2><p>Sertakan konteks yang cukup agar tim kami dapat membantu lebih cepat.</p></div><button className="text-button" onClick={() => setRequestOpen(false)} type="button">Cancel</button></div>
          <div className="support-request-grid">
            <label className="full">Subject<input required placeholder="Contoh: Selisih saldo pada laporan kas" /></label>
            <label>Area<select defaultValue="Transactions"><option>Transactions</option><option>Cash & Payments</option><option>Reports</option><option>Settings</option></select></label>
            <label>Priority<select defaultValue="Normal"><option>Normal</option><option>High</option><option>Critical</option></select></label>
            <label className="full">Description<textarea required placeholder="Jelaskan masalah, langkah yang dilakukan, dan hasil yang Anda harapkan." /></label>
          </div>
          <div className="support-request-actions"><span>Response target: within 1 business day</span><button className="primary-button" type="submit">Submit request</button></div>
        </form>
      )}

      <div className="support-layout">
        <section className="panel support-faq">
          <div className="support-panel-head"><div><span>POPULAR GUIDES</span><h2>{category === "All" ? "Frequently asked questions" : category}</h2><p>{filteredFaqs.length} panduan yang sesuai dengan pilihan Anda.</p></div>{category !== "All" && <button className="text-button" onClick={() => setCategory("All")} type="button">View all</button>}</div>
          <div className="support-faq-list">
            {filteredFaqs.length ? filteredFaqs.map((item) => {
              const expanded = openFaq === item.question;
              return <article className={`support-faq-item ${expanded ? "is-open" : ""}`} key={item.question}><button onClick={() => setOpenFaq(expanded ? null : item.question)} aria-expanded={expanded} type="button"><span><small>{item.category}</small><b>{item.question}</b></span><HugeiconsIcon icon={ArrowDown01Icon} size={17} strokeWidth={1.8} /></button>{expanded && <p>{item.answer}</p>}</article>;
            }) : <div className="support-empty"><HugeiconsIcon icon={BubbleChatQuestionIcon} size={25} strokeWidth={1.6} /><b>No guide found</b><p>Coba kata kunci lain atau buat permintaan bantuan baru.</p></div>}
          </div>
        </section>

        <aside className="support-sidebar">
          <section className="panel support-contact-card">
            <i className="support-card-icon"><HugeiconsIcon icon={CustomerSupportIcon} size={23} strokeWidth={1.7} /></i>
            <h2>Need direct assistance?</h2><p>Tim support tersedia untuk masalah operasional dan kendala pada data keuangan.</p>
            <div className="support-channel"><HugeiconsIcon icon={Mail01Icon} size={17} strokeWidth={1.8} /><span><small>Email</small><b>support@ckjs.co.id</b></span></div>
            <div className="support-channel"><HugeiconsIcon icon={CallIcon} size={17} strokeWidth={1.8} /><span><small>Phone</small><b>+62 812 3456 7890</b></span></div>
            <div className="support-channel"><HugeiconsIcon icon={Clock01Icon} size={17} strokeWidth={1.8} /><span><small>Business hours</small><b>Mon–Fri, 08:00–17:00 WITA</b></span></div>
            <button className="secondary-button support-contact-action" onClick={() => setRequestOpen(true)} type="button">Contact support <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={1.8} /></button>
          </section>

          <section className="panel support-status-card">
            <div><HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} strokeWidth={1.9} /><span><b>All systems operational</b><small>Last checked just now</small></span></div>
            <button className="text-button" onClick={() => notify("Semua layanan CKJS Finance beroperasi normal.")} type="button">View status</button>
          </section>
        </aside>
      </div>
    </>
  );
}
