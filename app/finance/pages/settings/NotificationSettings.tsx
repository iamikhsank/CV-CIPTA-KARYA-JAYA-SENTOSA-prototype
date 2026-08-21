"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import Notification03Icon from "@hugeicons/core-free-icons/Notification03Icon";
import { SettingToggle } from "./SettingToggle";

const notifications = [
  ["Payment due reminders", "Ingatkan 7 hari dan 1 hari sebelum jatuh tempo.", true],
  ["Large transaction alerts", "Kirim notifikasi untuk transaksi di atas Rp 100 juta.", true],
  ["Draft transaction digest", "Ringkasan draft yang belum diposting setiap sore.", true],
  ["Cash balance warning", "Peringatan saat saldo pos kas berada di bawah batas minimum.", false],
  ["Monthly report ready", "Informasi ketika laporan bulanan siap diunduh.", true],
] as const;

export function NotificationSettings({ onChange }: { onChange: () => void }) {
  return (
    <>
      <header className="settings-section-head">
        <div className="settings-section-icon"><HugeiconsIcon icon={Notification03Icon} size={21} strokeWidth={1.8} /></div>
        <div><h2>Notifications</h2><p>Pilih kejadian penting yang perlu diberitahukan kepada tim.</p></div>
      </header>

      <section className="settings-block setting-switch-list">
        <div className="settings-block-title"><h3>Financial alerts</h3><p>Notifikasi akan tampil di aplikasi dan dikirim melalui email.</p></div>
        {notifications.map(([title, description, enabled]) => <div key={title}><span><b>{title}</b><small>{description}</small></span><SettingToggle defaultChecked={enabled} label={title} onChange={onChange} /></div>)}
      </section>

      <section className="settings-block">
        <div className="settings-block-title"><h3>Delivery schedule</h3><p>Tentukan kapan ringkasan berkala dikirim.</p></div>
        <div className="settings-form-grid three-columns">
          <label>Daily digest<select defaultValue="17" onChange={onChange}><option value="17">17:00 WIB</option><option value="18">18:00 WIB</option></select></label>
          <label>Weekly summary<select defaultValue="monday" onChange={onChange}><option value="monday">Monday</option><option value="friday">Friday</option></select></label>
          <label>Delivery channel<select defaultValue="both" onChange={onChange}><option value="both">In-app + Email</option><option value="app">In-app only</option></select></label>
        </div>
      </section>
    </>
  );
}
