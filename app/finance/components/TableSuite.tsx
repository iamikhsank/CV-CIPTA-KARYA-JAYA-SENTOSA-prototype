"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import ArrowUp01Icon from "@hugeicons/core-free-icons/ArrowUp01Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import FilterHorizontalIcon from "@hugeicons/core-free-icons/FilterHorizontalIcon";
import GridViewIcon from "@hugeicons/core-free-icons/GridViewIcon";
import MoreVerticalIcon from "@hugeicons/core-free-icons/MoreVerticalIcon";
import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import Sorting01Icon from "@hugeicons/core-free-icons/Sorting01Icon";

/* ==========================================================================
   Table Checkbox Component (Circular Style Matching Enterprise Suite)
   ========================================================================== */

export function TableCheckbox({
  checked,
  onChange,
  indeterminate = false,
  ariaLabel = "Select row",
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  ariaLabel?: string;
}) {
  return (
    <label
      className={`table-checkbox-label ${checked ? "checked" : ""} ${indeterminate ? "indeterminate" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={ariaLabel}
      />
      <span className="table-checkbox-custom" aria-hidden="true">
        {checked && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: "10px", height: "10px" }}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {indeterminate && !checked && <span className="indeterminate-bar" />}
      </span>
    </label>
  );
}

/* ==========================================================================
   Entity Monogram Avatar
   ========================================================================== */

export function EntityAvatar({
  name,
  code,
  color,
  size = 30,
}: {
  name: string;
  code?: string;
  color?: string;
  size?: number;
}) {
  const initials = (code || name)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const deterministicColors = [
    { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
    { bg: "#eaf7f2", text: "#168b67", border: "#c7ece0" },
    { bg: "#fef3c7", text: "#d97706", border: "#fde68a" },
    { bg: "#f3e8ff", text: "#7c3aed", border: "#ddd6fe" },
    { bg: "#fff1f2", text: "#e11d48", border: "#fecdd3" },
  ];

  const charCode = name.charCodeAt(0) || 0;
  const palette = color
    ? { bg: `${color}18`, text: color, border: `${color}40` }
    : deterministicColors[charCode % deterministicColors.length];

  return (
    <span
      className="table-avatar-monogram"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: palette.bg,
        color: palette.text,
        borderColor: palette.border,
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

/* ==========================================================================
   Table Row Action Menu (3-dots vertical)
   ========================================================================== */

export function RowActionMenu({
  onView,
  onEdit,
  onDelete,
  customActions,
}: {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  customActions?: { label: string; action: () => void; destructive?: boolean }[];
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="row-action-menu-wrap" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <button
        className={`row-action-btn ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Row actions"
        type="button"
      >
        <HugeiconsIcon icon={MoreVerticalIcon} size={17} strokeWidth={1.9} />
      </button>

      {open && (
        <div className="row-action-dropdown">
          {onView && (
            <button
              onClick={() => {
                setOpen(false);
                onView();
              }}
              type="button"
            >
              View Details
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              type="button"
            >
              Edit Record
            </button>
          )}
          {customActions?.map((item, idx) => (
            <button
              key={idx}
              className={item.destructive ? "destructive" : ""}
              onClick={() => {
                setOpen(false);
                item.action();
              }}
              type="button"
            >
              {item.label}
            </button>
          ))}
          {onDelete && (
            <button
              className="destructive"
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              type="button"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Table Toolbar Suite Component
   ========================================================================== */

export type SortOption = {
  label: string;
  value: string;
};

export type FilterOptionGroup = {
  id: string;
  label: string;
  options: { label: string; value: string }[];
};

export function TableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  sortOptions = [],
  currentSort,
  sortDirection = "desc",
  onSortChange,
  onSortDirectionChange,
  filterGroups = [],
  activeFilters = {},
  onFilterChange,
  onResetFilters,
  displayDensity = "comfortable",
  onDensityChange,
  columns = [],
  visibleColumns = [],
  onToggleColumn,
  onAddNew,
  addNewLabel = "Add New",
  extraActions,
}: {
  search: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  sortOptions?: SortOption[];
  currentSort?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (sortKey: string) => void;
  onSortDirectionChange?: (dir: "asc" | "desc") => void;
  filterGroups?: FilterOptionGroup[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (groupId: string, val: string) => void;
  onResetFilters?: () => void;
  displayDensity?: "compact" | "comfortable" | "spacious";
  onDensityChange?: (density: "compact" | "comfortable" | "spacious") => void;
  columns?: { id: string; label: string }[];
  visibleColumns?: string[];
  onToggleColumn?: (columnId: string) => void;
  onAddNew?: () => void;
  addNewLabel?: string;
  extraActions?: ReactNode;
}) {
  const [openDropdown, setOpenDropdown] = useState<"display" | "sort" | "filter" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const activeFilterCount = Object.values(activeFilters).filter((v) => v && v !== "All").length;

  return (
    <div className="table-suite-toolbar" ref={containerRef}>
      {/* Search Input (Left) */}
      <div className="table-toolbar-search">
        <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.9} />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
        {search && (
          <button
            className="table-search-clear"
            onClick={() => onSearchChange("")}
            type="button"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Action Controls (Right) */}
      <div className="table-toolbar-actions">
        {/* 1. Display Options Popover */}
        {(onDensityChange || onToggleColumn) && (
          <div className="toolbar-popover-wrap">
            <button
              className={`table-toolbar-btn ${openDropdown === "display" ? "active" : ""}`}
              onClick={() => setOpenDropdown(openDropdown === "display" ? null : "display")}
              type="button"
            >
              <HugeiconsIcon icon={GridViewIcon} size={15} strokeWidth={1.8} />
              <span>Display Options</span>
              <HugeiconsIcon icon={ArrowDown01Icon} size={13} strokeWidth={2} />
            </button>

            {openDropdown === "display" && (
              <div className="toolbar-popover-menu display-menu">
                {onDensityChange && (
                  <div className="popover-section">
                    <span className="popover-title">Kerapatan Baris (Density)</span>
                    <div className="density-toggle-group">
                      {([
                        { id: "compact" as const, label: "Compact" },
                        { id: "comfortable" as const, label: "Comfortable" },
                        { id: "spacious" as const, label: "Spacious" },
                      ]).map((item) => (
                        <button
                          key={item.id}
                          className={`density-btn ${displayDensity === item.id ? "active" : ""}`}
                          onClick={() => onDensityChange(item.id)}
                          title={`Mode kerapatan baris: ${item.label}`}
                          type="button"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {columns.length > 0 && onToggleColumn && (
                  <div className="popover-section">
                    <span className="popover-title">Columns</span>
                    <div className="column-checkbox-list">
                      {columns.map((col) => {
                        const isVisible = visibleColumns.includes(col.id);
                        return (
                          <label key={col.id} className="column-toggle-row">
                            <input
                              type="checkbox"
                              checked={isVisible}
                              onChange={() => onToggleColumn(col.id)}
                            />
                            <span>{col.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. Sort By Popover */}
        {sortOptions.length > 0 && onSortChange && (
          <div className="toolbar-popover-wrap">
            <button
              className={`table-toolbar-btn ${openDropdown === "sort" ? "active" : ""}`}
              onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
              type="button"
            >
              <HugeiconsIcon icon={Sorting01Icon} size={15} strokeWidth={1.8} />
              <span>Sort by</span>
              <HugeiconsIcon icon={ArrowDown01Icon} size={13} strokeWidth={2} />
            </button>

            {openDropdown === "sort" && (
              <div className="toolbar-popover-menu sort-menu">
                <div className="popover-section">
                  <span className="popover-title">Sort Column</span>
                  <div className="popover-options-list">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        className={`popover-option-item ${currentSort === opt.value ? "selected" : ""}`}
                        onClick={() => {
                          onSortChange(opt.value);
                          setOpenDropdown(null);
                        }}
                        type="button"
                      >
                        <span>{opt.label}</span>
                        {currentSort === opt.value && (
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} strokeWidth={2.4} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {onSortDirectionChange && (
                  <div className="popover-section direction-section">
                    <span className="popover-title">Order</span>
                    <div className="density-toggle-group">
                      <button
                        className={sortDirection === "asc" ? "active" : ""}
                        onClick={() => onSortDirectionChange("asc")}
                        type="button"
                      >
                        Ascending
                      </button>
                      <button
                        className={sortDirection === "desc" ? "active" : ""}
                        onClick={() => onSortDirectionChange("desc")}
                        type="button"
                      >
                        Descending
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 3. Filters Popover */}
        {filterGroups.length > 0 && onFilterChange && (
          <div className="toolbar-popover-wrap">
            <button
              className={`table-toolbar-btn ${openDropdown === "filter" ? "active" : ""} ${activeFilterCount > 0 ? "has-filters" : ""}`}
              onClick={() => setOpenDropdown(openDropdown === "filter" ? null : "filter")}
              type="button"
            >
              <HugeiconsIcon icon={FilterHorizontalIcon} size={15} strokeWidth={1.8} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="filter-count-badge">{activeFilterCount}</span>
              )}
              <HugeiconsIcon icon={ArrowDown01Icon} size={13} strokeWidth={2} />
            </button>

            {openDropdown === "filter" && (
              <div className="toolbar-popover-menu filters-menu">
                {filterGroups.map((group) => (
                  <div key={group.id} className="popover-section">
                    <span className="popover-title">{group.label}</span>
                    <div className="popover-options-list">
                      {group.options.map((opt) => {
                        const isSelected = (activeFilters[group.id] || "All") === opt.value;
                        return (
                          <button
                            key={opt.value}
                            className={`popover-option-item ${isSelected ? "selected" : ""}`}
                            onClick={() => onFilterChange(group.id, opt.value)}
                            type="button"
                          >
                            <span>{opt.label}</span>
                            {isSelected && (
                              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} strokeWidth={2.4} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {onResetFilters && activeFilterCount > 0 && (
                  <div className="popover-footer">
                    <button className="reset-filters-btn" onClick={onResetFilters} type="button">
                      Reset all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {extraActions}

        {/* 4. Primary CTA Button */}
        {onAddNew && (
          <button className="table-primary-add-btn" onClick={onAddNew} type="button">
            <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2.2} />
            <span>{addNewLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   Bulk Selection Action Floating Bar
   ========================================================================== */

export function BulkSelectionBar({
  selectedCount,
  onClear,
  onDelete,
  onExport,
}: {
  selectedCount: number;
  onClear: () => void;
  onDelete?: () => void;
  onExport?: () => void;
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="bulk-selection-bar" role="alert" aria-live="polite">
      <div className="bulk-selection-info">
        <span className="bulk-count-pill">{selectedCount}</span>
        <span>item{selectedCount > 1 ? "s" : ""} selected</span>
      </div>

      <div className="bulk-selection-actions">
        {onExport && (
          <button className="bulk-btn" onClick={onExport} type="button">
            <HugeiconsIcon icon={Download01Icon} size={14} strokeWidth={1.8} />
            <span>Export Selected</span>
          </button>
        )}
        {onDelete && (
          <button className="bulk-btn destructive" onClick={onDelete} type="button">
            <HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={1.8} />
            <span>Delete</span>
          </button>
        )}
        <button className="bulk-btn-clear" onClick={onClear} type="button">
          Deselect All
        </button>
      </div>
    </div>
  );
}
