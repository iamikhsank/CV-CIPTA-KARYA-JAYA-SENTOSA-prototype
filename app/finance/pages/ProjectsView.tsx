"use client";

import { useState } from "react";
import { FilterBar, PageIntro, StatusBadge } from "../components/ui";
import { formatIDR, projectRows } from "../data";
import type { Project } from "../types";

export function ProjectsView({ openProject }: { openProject: (project: Project) => void }) {
  const [search, setSearch] = useState("");
  const rows = projectRows.filter((project) => `${project.name} ${project.client}`.toLowerCase().includes(search.toLowerCase()));
  return <><PageIntro title="Projects" description="Kelola dan pantau performa seluruh proyek perusahaan." action={<button className="primary-button" type="button"><span>＋</span> Add Project</button>} /><section className="mini-kpi-grid"><article><span>Active Projects</span><strong>3</strong><small>Total kontrak Rp 1,12 M</small></article><article><span>Combined Revenue</span><strong>Rp 1,28 M</strong><small className="text-green">+12,5% bulan ini</small></article><article><span>Net Project Profit</span><strong>Rp 437,2 Jt</strong><small>Margin rata-rata 34,1%</small></article></section><article className="panel list-panel"><FilterBar><div className="search-box">⌕<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search project or client..." /></div><select><option>All Status</option><option>Active</option><option>Completed</option></select><select><option>All Clients</option><option>PT Aruna Hospitality</option></select><button className="filter-button" type="button">≡ More filters</button></FilterBar><div className="table-wrap full-table"><table><thead><tr><th>Project</th><th>Client</th><th>Timeline</th><th>Revenue</th><th>Expense</th><th>Profit</th><th>Status</th></tr></thead><tbody>{rows.map((project) => <tr key={project.code} onClick={() => openProject(project)} className="clickable-row"><td><i style={{ background: project.color }} /><span><b>{project.name}</b><small>{project.code}</small></span></td><td>{project.client}</td><td><b>{project.start}</b><small>s.d. {project.end}</small></td><td>{formatIDR(project.revenue)}</td><td>{formatIDR(project.expense)}</td><td className="profit">{formatIDR(project.revenue - project.expense)}</td><td><StatusBadge status={project.status} /></td></tr>)}</tbody></table></div></article></>;
}
