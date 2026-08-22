"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import BuildingIcon from "@hugeicons/core-free-icons/BuildingIcon";
import Chart01Icon from "@hugeicons/core-free-icons/Chart01Icon";
import DatabaseIcon from "@hugeicons/core-free-icons/DatabaseIcon";
import Notification03Icon from "@hugeicons/core-free-icons/Notification03Icon";
import UserGroupIcon from "@hugeicons/core-free-icons/UserGroupIcon";
import { PageIntro } from "../components/ui";
import { AccountingSettings } from "./settings/AccountingSettings";
import { CompanySettings } from "./settings/CompanySettings";
import { NotificationSettings } from "./settings/NotificationSettings";
import { SystemSettings } from "./settings/SystemSettings";
import { UsersSettings } from "./settings/UsersSettings";
import type { AppTheme } from "../../CKJSApp";

type SettingsTab = "Company" | "Users" | "Accounting" | "Notifications" | "System";
type AppLanguage = "id" | "en";

const tabs = [
  { label: "Company", description: "Profile & regional", icon: BuildingIcon },
  { label: "Users", description: "Team & permissions", icon: UserGroupIcon },
  { label: "Accounting", description: "Defaults & controls", icon: Chart01Icon },
  { label: "Notifications", description: "Alerts & delivery", icon: Notification03Icon },
  { label: "System", description: "Security & backup", icon: DatabaseIcon },
] as const;

export function SettingsView({
  notify,
  theme,
  onThemeChange,
}: {
  notify: (message: string) => void;
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}) {
  const [tab, setTab] = useState<SettingsTab>("Company");
  const [dirty, setDirty] = useState(false);
  const [revision, setRevision] = useState(0);
  const [savedLanguage, setSavedLanguage] = useState<AppLanguage>("id");
  const [pendingLanguage, setPendingLanguage] = useState<AppLanguage>("id");
  const markDirty = () => setDirty(true);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("ckjs-language");
    const initialLanguage: AppLanguage = storedLanguage === "en" ? "en" : "id";
    setSavedLanguage(initialLanguage);
    setPendingLanguage(initialLanguage);
    document.documentElement.lang = initialLanguage;
  }, []);

  const discardChanges = () => {
    setPendingLanguage(savedLanguage);
    setRevision((current) => current + 1);
    setDirty(false);
    notify("Perubahan yang belum disimpan telah dibatalkan.");
  };

  const saveChanges = () => {
    setSavedLanguage(pendingLanguage);
    window.localStorage.setItem("ckjs-language", pendingLanguage);
    document.documentElement.lang = pendingLanguage;
    setDirty(false);
    notify("Pengaturan sistem keuangan berhasil disimpan.");
  };

  return (
    <>
      <PageIntro
        title="Settings"
        description="Kelola identitas perusahaan, akses tim, aturan akuntansi, dan keamanan sistem."
      />

      <div className="settings-shell">
        <aside className="panel settings-navigation">
          <div className="settings-company-summary">
            <div className="settings-company-mark">CK</div>
            <span><b>Cipta Karya Jaya Sentosa</b><small>Workspace settings</small></span>
          </div>
          <nav aria-label="Settings navigation">
            {tabs.map((item) => (
              <button
                className={tab === item.label ? "active" : ""}
                key={item.label}
                onClick={() => setTab(item.label)}
                type="button"
              >
                <i><HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.8} /></i>
                <span><b>{item.label}</b><small>{item.description}</small></span>
                <HugeiconsIcon className="settings-nav-arrow" icon={ArrowRight01Icon} size={15} strokeWidth={1.8} />
              </button>
            ))}
          </nav>
        </aside>

        <section className="panel settings-content">
          <div className="settings-content-body" key={revision}>
            <div hidden={tab !== "Company"}>
              <CompanySettings
                language={pendingLanguage}
                onLanguageChange={(language) => {
                  setPendingLanguage(language);
                  markDirty();
                }}
                onChange={markDirty}
                notify={notify}
              />
            </div>
            <div hidden={tab !== "Users"}><UsersSettings notify={notify} /></div>
            <div hidden={tab !== "Accounting"}><AccountingSettings onChange={markDirty} /></div>
            <div hidden={tab !== "Notifications"}><NotificationSettings onChange={markDirty} /></div>
            <div hidden={tab !== "System"}>
              <SystemSettings onChange={markDirty} notify={notify} theme={theme} onThemeChange={onThemeChange} />
            </div>
          </div>
          <footer className="settings-action-bar">
            <span className={dirty ? "settings-unsaved is-dirty" : "settings-unsaved"}>
              <i />{dirty ? "You have unsaved changes" : "All changes saved"}
            </span>
            <div>
              <button className="secondary-button" disabled={!dirty} onClick={discardChanges} type="button">Discard</button>
              <button className="primary-button" disabled={!dirty} onClick={saveChanges} type="button">Save changes</button>
            </div>
          </footer>
        </section>
      </div>
    </>
  );
}
