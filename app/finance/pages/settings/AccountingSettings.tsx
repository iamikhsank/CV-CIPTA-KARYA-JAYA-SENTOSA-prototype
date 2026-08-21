"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import Chart01Icon from "@hugeicons/core-free-icons/Chart01Icon";
import { SettingToggle } from "./SettingToggle";

export function AccountingSettings({ onChange }: { onChange: () => void }) {
  return (
    <>
      <header className="settings-section-head">
        <div className="settings-section-icon"><HugeiconsIcon icon={Chart01Icon} size={21} strokeWidth={1.8} /></div>
        <div><h2>Accounting preferences</h2><p>Atur periode, penomoran, dan kontrol posting transaksi.</p></div>
      </header>

      <section className="settings-block">
        <div className="settings-block-title"><h3>Financial defaults</h3><p>Nilai berikut menjadi default untuk transaksi dan laporan baru.</p></div>
        <div className="settings-form-grid">
          <label>Accounting basis<select defaultValue="cash" onChange={onChange}><option value="cash">Cash basis</option><option value="accrual">Accrual basis</option></select></label>
          <label>Fiscal year starts<select defaultValue="january" onChange={onChange}><option value="january">January</option><option value="april">April</option></select></label>
          <label>Default currency<select defaultValue="idr" onChange={onChange}><option value="idr">IDR — Indonesian Rupiah</option></select></label>
          <label>Default project scope<select defaultValue="all" onChange={onChange}><option value="all">All Projects + Corporate</option><option value="project">Project only</option></select></label>
        </div>
      </section>

      <section className="settings-block">
        <div className="settings-block-title"><h3>Document numbering</h3><p>Format nomor unik untuk transaksi dan dokumen pembayaran.</p></div>
        <div className="numbering-list">
          <label aria-label="Transaction numbering" htmlFor="settings-transaction-number"><span><b>Transaction</b><small>Contoh: TX-202608-0038</small></span><input id="settings-transaction-number" defaultValue="TX-YYYYMM-####" onChange={onChange} /></label>
          <label aria-label="Receivable invoice numbering" htmlFor="settings-invoice-number"><span><b>Receivable invoice</b><small>Contoh: INV/HG/08/026</small></span><input id="settings-invoice-number" defaultValue="INV/{PROJECT}/MM/###" onChange={onChange} /></label>
          <label aria-label="Payment reference numbering" htmlFor="settings-payment-number"><span><b>Payment reference</b><small>Contoh: PAY-0826-001</small></span><input id="settings-payment-number" defaultValue="PAY-YYMM-###" onChange={onChange} /></label>
        </div>
      </section>

      <section className="settings-block setting-switch-list">
        <div className="settings-block-title"><h3>Posting controls</h3><p>Kontrol untuk menjaga integritas dan audit trail.</p></div>
        <div><span><b>Require balanced journal</b><small>Cegah posting jika debit dan kredit tidak seimbang.</small></span><SettingToggle defaultChecked label="Require balanced journal" onChange={onChange} /></div>
        <div><span><b>Lock closed periods</b><small>Transaksi pada periode yang ditutup tidak dapat diedit.</small></span><SettingToggle defaultChecked label="Lock closed periods" onChange={onChange} /></div>
        <div><span><b>Require reference for payments</b><small>Nomor referensi wajib diisi saat mencatat pembayaran.</small></span><SettingToggle defaultChecked label="Require reference for payments" onChange={onChange} /></div>
      </section>
    </>
  );
}
