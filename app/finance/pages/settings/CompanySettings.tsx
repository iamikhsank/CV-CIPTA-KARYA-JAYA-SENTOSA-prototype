"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import BuildingIcon from "@hugeicons/core-free-icons/BuildingIcon";
import Upload01Icon from "@hugeicons/core-free-icons/Upload01Icon";

export function CompanySettings({
  language,
  onLanguageChange,
  onChange,
  notify,
}: {
  language: "id" | "en";
  onLanguageChange: (language: "id" | "en") => void;
  onChange: () => void;
  notify: (message: string) => void;
}) {
  return (
    <>
      <header className="settings-section-head">
        <div className="settings-section-icon"><HugeiconsIcon icon={BuildingIcon} size={21} strokeWidth={1.8} /></div>
        <div><h2>Company profile</h2><p>Identitas perusahaan yang digunakan pada invoice, laporan, dan dokumen resmi.</p></div>
      </header>

      <section className="settings-block company-brand-block">
        <div className="company-logo-preview" style={{ borderRadius: "50%", overflow: "hidden", border: "1.5px solid var(--line)" }}>
          <img src="/logo-ckjs.jpg" alt="Logo Perusahaan" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
        </div>
        <div><h3>Company logo</h3><p>PNG atau JPG, maksimal 2 MB. Logo akan tampil pada laporan yang diekspor.</p><button className="secondary-button" type="button" onClick={() => notify("Pemilih logo perusahaan dibuka.")}><HugeiconsIcon icon={Upload01Icon} size={16} strokeWidth={1.8} /> Upload logo</button></div>
      </section>

      <section className="settings-block">
        <div className="settings-block-title"><h3>Legal information</h3><p>Pastikan sesuai dengan dokumen legal perusahaan.</p></div>
        <div className="settings-form-grid">
          <label>Company name<input defaultValue="CV. Cipta Karya Jaya Sentosa" onChange={onChange} /></label>
          <label>Trading name<input defaultValue="Cipta Karya Jaya Sentosa" onChange={onChange} /></label>
          <label>Business type<select defaultValue="construction" onChange={onChange}><option value="construction">Construction & Contractor</option><option value="services">Professional Services</option></select></label>
          <label>NPWP<input defaultValue="—" placeholder="Masukkan NPWP perusahaan" onChange={onChange} /></label>
          <label>Company email<input type="email" defaultValue="finance@ciptakaryajaya.co.id" onChange={onChange} /></label>
          <label>Phone number<input defaultValue="+62 812 3456 7890" onChange={onChange} /></label>
          <label className="full">Registered address<textarea defaultValue="Denpasar, Bali, Indonesia" onChange={onChange} /></label>
        </div>
      </section>

      <section className="settings-block">
        <div className="settings-block-title"><h3>Regional preferences</h3><p>Digunakan sebagai format default di seluruh aplikasi.</p></div>
        <div className="settings-form-grid three-columns">
          <label>Timezone<select defaultValue="asia-jakarta" onChange={onChange}><option value="asia-jakarta">Asia/Jakarta (WIB)</option><option value="asia-makassar">Asia/Makassar (WITA)</option></select></label>
          <label>Application language<select value={language} onChange={(event) => onLanguageChange(event.target.value as "id" | "en")}><option value="id">Bahasa Indonesia (Default)</option><option value="en">English</option></select></label>
          <label>Date format<select defaultValue="dmy" onChange={onChange}><option value="dmy">DD MMM YYYY</option><option value="iso">YYYY-MM-DD</option></select></label>
        </div>
      </section>
    </>
  );
}
