"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import UserGroupIcon from "@hugeicons/core-free-icons/UserGroupIcon";
import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
import { StatusBadge } from "../../components/ui";

const users = [
  { initials: "JI", name: "Jason Ibrahim", email: "jason@ciptakaryajaya.co.id", role: "Owner / Director", status: "ACTIVE", tone: "blue" },
  { initials: "CO", name: "Co-Owner Sentosa", email: "owner2@ciptakaryajaya.co.id", role: "Owner / Director", status: "ACTIVE", tone: "green" },
  { initials: "FA", name: "Finance Admin", email: "finance.admin@ciptakaryajaya.co.id", role: "Finance / Admin", status: "INVITED", tone: "purple" },
];

export function UsersSettings({ notify }: { notify: (message: string) => void }) {
  return (
    <>
      <header className="settings-section-head">
        <div className="settings-section-icon"><HugeiconsIcon icon={UserGroupIcon} size={21} strokeWidth={1.8} /></div>
        <div><h2>Users & roles</h2><p>Atur anggota tim dan hak akses berdasarkan tanggung jawab keuangan.</p></div>
        <button className="primary-button" type="button" onClick={() => notify("Form undangan pengguna baru dibuka.")}><HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.9} /> Invite user</button>
      </header>

      <section className="settings-stat-grid">
        <article><span>Active users</span><strong>2</strong><small>Dari 5 seat tersedia</small></article>
        <article><span>Pending invitation</span><strong>1</strong><small>Finance Admin</small></article>
        <article><span>Last sign-in</span><strong>Today</strong><small>09:42 WIB</small></article>
      </section>

      <section className="settings-block user-management-list">
        <div className="settings-block-title"><h3>Team members</h3><p>Pengguna yang memiliki atau sedang menunggu akses ke sistem keuangan.</p></div>
        {users.map((user) => (
          <article key={user.email}>
            <div className={`settings-avatar ${user.tone}`}>{user.initials}</div>
            <div className="settings-user-copy"><b>{user.name}</b><span>{user.email}</span></div>
            <span className="settings-role">{user.role}</span>
            <StatusBadge status={user.status} />
            <button className="row-action" type="button" aria-label={`Opsi ${user.name}`}>•••</button>
          </article>
        ))}
      </section>

      <section className="settings-block permissions-matrix">
        <div className="settings-block-title"><h3>Role permissions</h3><p>Ringkasan akses utama. Owner tetap memiliki kontrol penuh.</p></div>
        <div className="table-wrap"><table><thead><tr><th>Capability</th><th>Owner</th><th>Finance / Admin</th><th>Site Supervisor</th></tr></thead><tbody>
          <tr><td>View financial dashboard</td><td>Full</td><td>Full</td><td>Project only</td></tr>
          <tr><td>Create & post transaction</td><td>Full</td><td>Full</td><td>Draft only</td></tr>
          <tr><td>Export financial reports</td><td>Full</td><td>Full</td><td>—</td></tr>
          <tr><td>Manage users & settings</td><td>Full</td><td>—</td><td>—</td></tr>
        </tbody></table></div>
      </section>
    </>
  );
}
