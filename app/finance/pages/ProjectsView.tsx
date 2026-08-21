"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";
import Briefcase01Icon from "@hugeicons/core-free-icons/Briefcase01Icon";
import ChartIncreaseIcon from "@hugeicons/core-free-icons/ChartIncreaseIcon";
import GridViewIcon from "@hugeicons/core-free-icons/GridViewIcon";
import ListViewIcon from "@hugeicons/core-free-icons/ListViewIcon";
import PieChartIcon from "@hugeicons/core-free-icons/PieChartIcon";
import {
  BulkSelectionBar,
  EntityAvatar,
  ProjectMiniTrend,
  RowActionMenu,
  TableCheckbox,
  TableToolbar,
} from "../components/TableSuite";
import { PageIntro, StatusBadge } from "../components/ui";
import { formatIDR, projectRows } from "../data";
import type { Project } from "../types";

const projectProgress: Record<string, number> = {
  "PRJ-026": 78,
  "PRJ-024": 68,
  "PRJ-019": 54,
  "PRJ-015": 100,
};

const compactIDR = (amount: number) => {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} M`;
  }
  return `Rp ${(amount / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Jt`;
};

export function ProjectsView({ openProject }: { openProject: (project: Project) => void }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [client, setClient] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortKey, setSortKey] = useState<string>("revenue");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [density, setDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "project",
    "client",
    "timeline",
    "revenue",
    "expense",
    "profit",
    "status",
  ]);

  const activeProjects = projectRows.filter((project) => project.status === "ACTIVE");
  const combinedRevenue = projectRows.reduce((sum, project) => sum + project.revenue, 0);
  const combinedProfit = projectRows.reduce(
    (sum, project) => sum + project.revenue - project.expense,
    0,
  );
  const activeContract = activeProjects.reduce((sum, project) => sum + project.revenue, 0);
  const averageMargin = Math.round((combinedProfit / (combinedRevenue || 1)) * 1000) / 10;

  const clients = useMemo(
    () => Array.from(new Set(projectRows.map((p) => p.client))),
    [],
  );

  const filterGroups = useMemo(
    () => [
      {
        id: "status",
        label: "Status Proyek",
        options: [
          { label: "Semua Status", value: "All" },
          { label: "Active", value: "ACTIVE" },
          { label: "Completed", value: "COMPLETED" },
        ],
      },
      {
        id: "client",
        label: "Klien / Pemberi Kerja",
        options: [
          { label: "Semua Klien", value: "All" },
          ...clients.map((c) => ({ label: c, value: c })),
        ],
      },
    ],
    [clients],
  );

  const sortOptions = [
    { label: "Nilai Pendapatan (Revenue)", value: "revenue" },
    { label: "Total Beban (Expense)", value: "expense" },
    { label: "Laba Bersih (Profit)", value: "profit" },
    { label: "Nama Proyek", value: "name" },
  ];

  const columns = [
    { id: "project", label: "Proyek", sortable: true },
    { id: "client", label: "Klien", sortable: true },
    { id: "timeline", label: "Timeline", sortable: false },
    { id: "revenue", label: "Revenue", align: "right" as const, sortable: true },
    { id: "expense", label: "Expense", align: "right" as const, sortable: true },
    { id: "profit", label: "Profit", align: "right" as const, sortable: true },
    { id: "status", label: "Status", sortable: true },
  ];

  const rows = useMemo(() => {
    let result = [...projectRows];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.client.toLowerCase().includes(q),
      );
    }

    if (status !== "All") {
      result = result.filter((p) => p.status === status);
    }

    if (client !== "All") {
      result = result.filter((p) => p.client === client);
    }

    result.sort((a, b) => {
      let valA: any = a[sortKey as keyof Project];
      let valB: any = b[sortKey as keyof Project];

      if (sortKey === "profit") {
        valA = a.revenue - a.expense;
        valB = b.revenue - b.expense;
      }

      if (typeof valA === "string") {
        return sortDir === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDir === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [search, status, client, sortKey, sortDir]);

  const allSelected = rows.length > 0 && selectedCodes.length === rows.length;
  const isIndeterminate = selectedCodes.length > 0 && selectedCodes.length < rows.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCodes(rows.map((p) => p.code));
    } else {
      setSelectedCodes([]);
    }
  };

  const handleToggleSelect = (code: string, checked: boolean) => {
    if (checked) {
      setSelectedCodes((curr) => [...curr, code]);
    } else {
      setSelectedCodes((curr) => curr.filter((c) => c !== code));
    }
  };

  const handleFilterChange = (groupId: string, val: string) => {
    if (groupId === "status") setStatus(val);
    if (groupId === "client") setClient(val);
  };

  const handleResetFilters = () => {
    setStatus("All");
    setClient("All");
    setSearch("");
  };

  const handleToggleColumn = (colId: string) => {
    setVisibleColumns((curr) =>
      curr.includes(colId) ? curr.filter((id) => id !== colId) : [...curr, colId],
    );
  };

  const activeProjectsHistory = [
    { month: "Mar", current: 1, previous: 1 },
    { month: "Apr", current: 2, previous: 1 },
    { month: "Mei", current: 2, previous: 2 },
    { month: "Jun", current: 3, previous: 2 },
    { month: "Jul", current: 2, previous: 2 },
    { month: "Agu", current: activeProjects.length, previous: 2 },
  ];

  const kpis = [
    {
      label: "Active Projects",
      value: String(activeProjects.length),
      unit: "Proyek Berjalan",
      delta: "+50%",
      deltaSub: "YoY",
      meta: `Total kontrak ${compactIDR(activeContract)}`,
      icon: Briefcase01Icon,
      tone: "blue",
      chartType: "bar" as const,
      barData: activeProjectsHistory,
      trend: [24, 42, 35, 57, 46, 64, 88],
    },
    {
      label: "Combined Revenue",
      value: compactIDR(combinedRevenue),
      unit: null,
      delta: "+12,5%",
      deltaSub: null,
      meta: "vs bulan lalu",
      icon: ChartIncreaseIcon,
      tone: "green",
      chartType: "line" as const,
      barData: null,
      trend: [21, 39, 35, 54, 71, 66, 91],
    },
    {
      label: "Net Project Profit",
      value: compactIDR(combinedProfit),
      unit: null,
      delta: `${averageMargin.toString().replace(".", ",")}%`,
      deltaSub: null,
      meta: "rata-rata margin",
      icon: PieChartIcon,
      tone: "green",
      chartType: "line" as const,
      barData: null,
      trend: [18, 34, 31, 49, 67, 60, 88],
    },
  ];

  return (
    <>
      <PageIntro
        title="Projects"
        description="Kelola dan pantau performa seluruh proyek portofolio perusahaan."
        action={
          <button
            className="primary-button"
            onClick={() => alert("Membuka form penambahan proyek baru...")}
            type="button"
          >
            + Add Project
          </button>
        }
      />

      <section className="projects-summary-grid" aria-label="Ringkasan proyek">
        {kpis.map((item) => (
          <article className="panel projects-summary-card" key={item.label}>
            <div className="projects-summary-top">
              <span className="projects-summary-label">{item.label}</span>
              <div className="projects-summary-icon">
                <HugeiconsIcon icon={item.icon} size={17} strokeWidth={1.8} />
              </div>
            </div>
            <div className="projects-summary-value">
              <strong>{item.value}</strong>
              {item.unit && <span className="projects-summary-unit">{item.unit}</span>}
            </div>
            <div className="projects-summary-bottom">
              <div className="projects-summary-trend">
                {item.delta && (
                  <span className={`projects-trend-pill ${item.tone}`}>
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} strokeWidth={2.2} />
                    <b>{item.delta}</b>
                    {item.deltaSub && <small className="projects-trend-sub">{item.deltaSub}</small>}
                  </span>
                )}
                <span className="projects-summary-meta">{item.meta}</span>
              </div>
              {item.chartType === "bar" && item.barData ? (
                <ProjectMiniBars data={item.barData} tone={item.tone} />
              ) : (
                <ProjectMiniTrend points={item.trend} tone={item.tone} />
              )}
            </div>
          </article>
        ))}
      </section>

      <article className="panel projects-list-card">
        {/* TableSuite Standard Toolbar */}
        <TableToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search project or client..."
          sortOptions={sortOptions}
          currentSort={sortKey}
          sortDirection={sortDir}
          onSortChange={setSortKey}
          onSortDirectionChange={setSortDir}
          filterGroups={filterGroups}
          activeFilters={{ status, client }}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          displayDensity={density}
          onDensityChange={setDensity}
          columns={columns}
          visibleColumns={visibleColumns}
          onToggleColumn={handleToggleColumn}
          onAddNew={() => alert("Tambah proyek baru...")}
          addNewLabel="Add Project"
          extraActions={
            <div className="projects-view-toggle" aria-label="Project view mode">
              <button
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
                aria-label="List view"
                type="button"
              >
                <HugeiconsIcon icon={ListViewIcon} size={15} strokeWidth={1.8} />
              </button>
              <button
                className={viewMode === "grid" ? "active" : ""}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                type="button"
              >
                <HugeiconsIcon icon={GridViewIcon} size={15} strokeWidth={1.8} />
              </button>
            </div>
          }
        />

        {/* Bulk Selection Action Bar */}
        <BulkSelectionBar
          selectedCount={selectedCodes.length}
          onClear={() => setSelectedCodes([])}
          onExport={() => alert(`Mengekspor ${selectedCodes.length} proyek terpilih...`)}
          onDelete={() => {
            alert(`Menghapus ${selectedCodes.length} proyek terpilih.`);
            setSelectedCodes([]);
          }}
        />

        {viewMode === "list" ? (
          <div className="projects-table-wrap">
            <table className={`projects-table density-${density}`}>
              <thead>
                <tr>
                  <th className="col-checkbox">
                    <TableCheckbox
                      checked={allSelected}
                      indeterminate={isIndeterminate}
                      onChange={handleSelectAll}
                      ariaLabel="Select all projects"
                    />
                  </th>
                  {visibleColumns.includes("project") && <th className="col-project">Project</th>}
                  {visibleColumns.includes("client") && <th className="col-client">Client</th>}
                  {visibleColumns.includes("timeline") && <th className="col-timeline">Timeline</th>}
                  {visibleColumns.includes("revenue") && <th className="col-revenue">Revenue</th>}
                  {visibleColumns.includes("expense") && <th className="col-expense">Expense</th>}
                  {visibleColumns.includes("profit") && <th className="col-profit">Profit</th>}
                  {visibleColumns.includes("status") && <th className="col-status">Status</th>}
                  <th className="col-actions">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((project) => {
                  const progress = projectProgress[project.code] ?? 50;
                  const isSelected = selectedCodes.includes(project.code);
                  return (
                    <tr
                      key={project.code}
                      onClick={() => openProject(project)}
                      className={`clickable-row ${isSelected ? "selected-row" : ""}`}
                    >
                      <td className="col-checkbox" onClick={(e) => e.stopPropagation()}>
                        <TableCheckbox
                          checked={isSelected}
                          onChange={(chk) => handleToggleSelect(project.code, chk)}
                          ariaLabel={`Select ${project.name}`}
                        />
                      </td>
                      {visibleColumns.includes("project") && (
                        <td className="col-project">
                          <div className="project-cell-name">
                            <EntityAvatar
                              name={project.name}
                              code={project.code}
                              color={project.color}
                              size={32}
                            />
                            <span>
                              <b>{project.name}</b>
                              <small>{project.code}</small>
                            </span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.includes("client") && <td className="col-client">{project.client}</td>}
                      {visibleColumns.includes("timeline") && (
                        <td className="col-timeline">
                          <b>{project.start}</b>
                          <small>s.d. {project.end}</small>
                          <span className="project-timeline-track">
                            <i style={{ width: `${progress}%`, background: project.color }} />
                          </span>
                        </td>
                      )}
                      {visibleColumns.includes("revenue") && (
                        <td className="col-revenue">{formatIDR(project.revenue)}</td>
                      )}
                      {visibleColumns.includes("expense") && (
                        <td className="col-expense">{formatIDR(project.expense)}</td>
                      )}
                      {visibleColumns.includes("profit") && (
                        <td className="col-profit project-profit">
                          {formatIDR(project.revenue - project.expense)}
                        </td>
                      )}
                      {visibleColumns.includes("status") && (
                        <td className="col-status">
                          <StatusBadge status={project.status} />
                        </td>
                      )}
                      <td className="col-actions">
                        <RowActionMenu
                          onView={() => openProject(project)}
                          onEdit={() => alert(`Edit proyek ${project.name}`)}
                          onDelete={() => alert(`Hapus proyek ${project.name}`)}
                        />
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td
                      className="projects-empty"
                      colSpan={visibleColumns.length + 2}
                      style={{ textAlign: "center", padding: "36px" }}
                    >
                      Tidak ada proyek yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="projects-card-grid">
            {rows.map((project) => {
              const profit = project.revenue - project.expense;
              const progress = projectProgress[project.code] ?? 50;
              return (
                <div
                  className="project-overview-card"
                  onClick={() => openProject(project)}
                  role="button"
                  tabIndex={0}
                  key={project.code}
                >
                  <div className="project-card-header">
                    <EntityAvatar
                      name={project.name}
                      code={project.code}
                      color={project.color}
                      size={38}
                    />
                    <div className="project-card-info">
                      <strong className="project-card-title">{project.name}</strong>
                      <span className="project-card-subtitle">
                        {project.code} · {project.client}
                      </span>
                    </div>
                    <div className="project-card-badge">
                      <StatusBadge status={project.status} />
                    </div>
                  </div>

                  <div className="project-card-progress-section">
                    <div className="project-card-progress-head">
                      <span className="progress-label">Progress Pengerjaan</span>
                      <span className="progress-value">{progress}%</span>
                    </div>
                    <div className="project-card-timeline">
                      <i style={{ width: `${progress}%`, background: project.color || "var(--accent-green)" }} />
                    </div>
                  </div>

                  <div className="project-card-values">
                    <div className="project-val-item">
                      <small>Revenue</small>
                      <b>{formatIDR(project.revenue)}</b>
                    </div>
                    <div className="project-val-item">
                      <small>Expense</small>
                      <b>{formatIDR(project.expense)}</b>
                    </div>
                    <div className="project-val-item">
                      <small>Profit</small>
                      <b className="positive">{formatIDR(profit)}</b>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <footer className="projects-list-footer">
          <span>
            Showing 1–{rows.length} of {rows.length} projects
          </span>
          <nav aria-label="Project pagination">
            <button disabled aria-label="Previous page" type="button">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={1.8} />
            </button>
            <button className="active" type="button">
              1
            </button>
            <button disabled aria-label="Next page" type="button">
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={1.8} />
            </button>
          </nav>
        </footer>
      </article>
    </>
  );
}

function ProjectMiniTrend({ points, tone }: { points: number[]; tone: string }) {
  const width = 96;
  const height = 48;
  const padding = 3;
  const step = (width - padding * 2) / (points.length - 1);
  const coordinates = points
    .map(
      (point, index) =>
        `${padding + index * step},${height - padding - (point / 100) * (height - padding * 2)}`,
    );
  const linePoints = coordinates.join(" ");
  const areaPoints = `${padding},${height - padding} ${linePoints} ${width - padding},${height - padding}`;
  const lastPoint = points[points.length - 1];
  const lastX = width - padding;
  const lastY = height - padding - (lastPoint / 100) * (height - padding * 2);

  return (
    <div className={`projects-mini-trend-wrap ${tone}`} role="img" aria-label="Tren performa">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polygon className="projects-trend-area" points={areaPoints} />
        <polyline className="projects-trend-line" points={linePoints} />
        <circle className="projects-trend-dot" cx={lastX} cy={lastY} r="3" />
      </svg>
    </div>
  );
}

function ProjectMiniBars({
  data,
  tone = "blue",
}: {
  data: { month: string; current: number; previous: number }[];
  tone?: string;
}) {
  const allValues = data.flatMap((d) => [d.current, d.previous]);
  const maxValue = Math.max(...allValues, 3);
  const width = 96;
  const height = 48;
  const barWidth = 5.5;
  const innerGap = 1.5;
  const groupWidth = barWidth * 2 + innerGap;
  const groupGap = (width - groupWidth * data.length) / (data.length - 1);

  return (
    <div
      className={`projects-mini-bars-wrap ${tone}`}
      role="img"
      aria-label="Perbandingan proyek 6 bulan terakhir: Tahun Ini vs Tahun Lalu"
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="projects-mini-bars-svg">
        {data.map((d, index) => {
          const groupX = index * (groupWidth + groupGap);
          const prevHeight = Math.max(7, (d.previous / maxValue) * (height - 2));
          const currHeight = Math.max(7, (d.current / maxValue) * (height - 2));
          const prevY = height - prevHeight;
          const currY = height - currHeight;
          const isLatest = index === data.length - 1;

          return (
            <g key={d.month} className={`mini-bar-pair ${isLatest ? "is-latest-month" : ""}`}>
              <title>{`${d.month}: ${d.current} Proyek (Tahun Ini) vs ${d.previous} Proyek (Tahun Lalu)`}</title>
              {/* Previous Year Bar (Tahun Lalu) */}
              <rect
                x={groupX}
                y={prevY}
                width={barWidth}
                height={prevHeight}
                rx={2}
                className="mini-bar bar-prev-year"
              />
              {/* Current Year Bar (Tahun Ini) */}
              <rect
                x={groupX + barWidth + innerGap}
                y={currY}
                width={barWidth}
                height={currHeight}
                rx={2}
                className={`mini-bar bar-curr-year ${isLatest ? "is-latest" : ""}`}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
