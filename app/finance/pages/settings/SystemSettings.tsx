"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import DatabaseIcon from "@hugeicons/core-free-icons/DatabaseIcon";
import DatabaseBackupIcon from "@hugeicons/core-free-icons/DatabaseBackupIcon";
import SecurityCheckIcon from "@hugeicons/core-free-icons/SecurityCheckIcon";
import { SettingToggle } from "./SettingToggle";
import type { AppTheme } from "../../../CKJSApp";

export function SystemSettings({
  onChange,
  notify,
  theme,
  onThemeChange,
}: {
  onChange: () => void;
  notify: (message: string) => void;
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}) {
  return (
    <>
      <header className="settings-section-head">
        <div className="settings-section-icon"><HugeiconsIcon icon={DatabaseIcon} size={21} strokeWidth={1.8} /></div>
        <div><h2>System & data</h2><p>Kelola keamanan, cadangan data, dan informasi aplikasi.</p></div>
      </header>

      <section className="system-health-grid">
        <article><i className="healthy"><HugeiconsIcon icon={DatabaseBackupIcon} size={19} strokeWidth={1.8} /></i><span><b>Last backup</b><small>Today, 02:00 WIB</small></span><em>SUCCESS</em></article>
        <article><i className="healthy"><HugeiconsIcon icon={SecurityCheckIcon} size={19} strokeWidth={1.8} /></i><span><b>Audit log</b><small>All events recorded</small></span><em>ACTIVE</em></article>
      </section>

      <section className="settings-block">
        <div className="settings-block-title">
          <h3>Appearance</h3>
          <p>Pilih tampilan yang nyaman. Tema diterapkan dan disimpan otomatis di perangkat ini.</p>
        </div>
        <div className="theme-mode-picker" role="radiogroup" aria-label="Tema tampilan">
          <button
            aria-checked={theme === "light"}
            className={theme === "light" ? "active" : ""}
            onClick={() => onThemeChange("light")}
            role="radio"
            type="button"
          >
            <span className="theme-preview theme-preview-light" aria-hidden="true">
              <i /><em><b /><b /><b /></em>
            </span>
            <span><b>Light mode</b><small>Tampilan terang dan bersih</small></span>
            <i className="theme-choice-dot" aria-hidden="true" />
          </button>
          <button
            aria-checked={theme === "dark"}
            className={theme === "dark" ? "active" : ""}
            onClick={() => onThemeChange("dark")}
            role="radio"
            type="button"
          >
            <span className="theme-preview theme-preview-dark" aria-hidden="true">
              <i /><em><b /><b /><b /></em>
            </span>
            <span><b>Dark mode</b><small>Redup dengan kontras nyaman</small></span>
            <i className="theme-choice-dot" aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="settings-block">
        <div className="settings-block-title"><h3>Backup & retention</h3><p>Atur jadwal dan periode penyimpanan data keuangan.</p></div>
        <div className="settings-form-grid">
          <label>Automatic backup<select defaultValue="daily" onChange={onChange}><option value="daily">Daily at 02:00 WIB</option><option value="weekly">Weekly</option></select></label>
          <label>Data retention<select defaultValue="7years" onChange={onChange}><option value="7years">7 years</option><option value="10years">10 years</option></select></label>
        </div>
        <button className="secondary-button backup-now" type="button" onClick={() => notify("Backup manual berhasil dijadwalkan.")}><HugeiconsIcon icon={DatabaseBackupIcon} size={16} strokeWidth={1.8} /> Run backup now</button>
      </section>

      <section className="settings-block setting-switch-list">
        <div className="settings-block-title"><h3>Security</h3><p>Perlindungan tambahan untuk akun dan aktivitas sensitif.</p></div>
        <div><span><b>Two-step verification</b><small>Wajibkan verifikasi tambahan untuk Owner dan Finance Admin.</small></span><SettingToggle defaultChecked label="Two-step verification" onChange={onChange} /></div>
        <div><span><b>Login activity alerts</b><small>Beritahu Owner saat ada login dari perangkat baru.</small></span><SettingToggle defaultChecked label="Login activity alerts" onChange={onChange} /></div>
        <div><span><b>Automatic session timeout</b><small>Keluar otomatis setelah 30 menit tidak aktif.</small></span><SettingToggle defaultChecked label="Automatic session timeout" onChange={onChange} /></div>
      </section>

      <section className="settings-about"><span><b>CKJS Finance</b><small>Version 1.0 · Production-ready prototype</small></span><span>Last updated 21 Aug 2026</span></section>
    </>
  );
}
