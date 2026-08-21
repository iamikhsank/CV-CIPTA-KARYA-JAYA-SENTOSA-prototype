"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import { LocationLiveClock } from "./LocationLiveClock";

export const DEFAULT_PERIOD_OPTIONS = [
  { label: "Agustus 2026", value: "Agustus 2026" },
  { label: "Juli 2026", value: "Juli 2026" },
  { label: "Juni 2026", value: "Juni 2026" },
  { label: "Mei 2026", value: "Mei 2026" },
  { label: "April 2026", value: "April 2026" },
  { label: "Maret 2026", value: "Maret 2026" },
  { label: "Semua Periode (2026)", value: "2026" },
];

export function StatusBadge({
  status,
  iconPosition,
}: {
  status: string;
  iconPosition?: "leading" | "trailing" | "none";
}) {
  const normalized = status.trim().toUpperCase();
  const isComplete = ["POSTED", "ACTIVE", "VALID", "PAID", "COMPLETED", "MAPPED", "READY"].includes(normalized);
  const displayText = status === "PARTIAL" ? "PARTIALLY PAID" : status;

  const tone = [
    "POSTED",
    "ACTIVE",
    "VALID",
    "READY",
    "MAPPED",
    "COMPLETED",
  ].includes(normalized)
    ? "green"
    : ["DRAFT", "WARNING", "PARTIAL", "PARTIALLY PAID"].includes(normalized)
    ? "amber"
    : ["REVERSED", "UNMAPPED", "OUTSTANDING", "FAILED"].includes(normalized)
    ? "red"
    : ["PAID", "IN_PROGRESS", "PROCESSING"].includes(normalized)
    ? "blue"
    : "slate";

  const showTrailingCheck = iconPosition === "trailing" || (!iconPosition && isComplete);
  const showLeadingRing = iconPosition === "leading" || (!iconPosition && !isComplete && iconPosition !== "none");

  return (
    <span className={`status-badge tone-${tone}`}>
      {showLeadingRing && <span className="status-badge-ring" aria-hidden="true" />}
      <span className="status-badge-text">{displayText}</span>
      {showTrailingCheck && (
        <svg
          className="status-badge-check"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 6.5L4.5 9L10 3" />
        </svg>
      )}
    </span>
  );
}

export function PageIntro({
  title,
  description,
  action,
  showClock = true,
  showPeriod = true,
  period = "Agustus 2026",
  onPeriodChange,
  periodOptions = DEFAULT_PERIOD_OPTIONS,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  showClock?: boolean;
  showPeriod?: boolean;
  period?: string;
  onPeriodChange?: (p: string) => void;
  periodOptions?: { label: string; value: string }[];
}) {
  const [internalPeriod, setInternalPeriod] = useState(period);
  const activePeriod = onPeriodChange ? period : internalPeriod;
  const handlePeriodChange = (val: string) => {
    if (onPeriodChange) {
      onPeriodChange(val);
    } else {
      setInternalPeriod(val);
    }
  };

  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="heading-actions">
        {showClock && <LocationLiveClock />}
        {showPeriod && (
          <CustomDropdown
            ariaLabel="Pilih Periode"
            icon={Calendar03Icon}
            onChange={handlePeriodChange}
            options={periodOptions}
            value={activePeriod}
          />
        )}
        {action}
      </div>
    </div>
  );
}

export type DropdownOption = {
  label: string;
  value: string;
  badge?: string;
};

export function CustomDropdown({
  options,
  value,
  onChange,
  icon: Icon,
  placeholder,
  className = "",
  ariaLabel,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
  icon?: any;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const selected = options.find((opt) => opt.value === value) ?? options[0];

  return (
    <div
      ref={containerRef}
      className={`custom-dropdown ${open ? "is-open" : ""} ${className}`}
    >
      <button
        type="button"
        className="custom-dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        {Icon && <HugeiconsIcon icon={Icon} size={15} strokeWidth={1.8} className="dropdown-leading-icon" />}
        <span className="dropdown-label">{selected ? selected.label : placeholder}</span>
        <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={2} className="dropdown-chevron" />
      </button>

      {open && (
        <div className="custom-dropdown-menu" role="listbox">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`custom-dropdown-item ${isSelected ? "is-selected" : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} strokeWidth={2} className="item-check" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

type SelectOptionProps = { children?: ReactNode; value?: string };
type SelectProps = { children?: ReactNode; defaultValue?: string; value?: string; onChange?: (event: { target: { value: string } }) => void };

function FilterDropdown({ select }: { select: ReactElement<SelectProps> }) {
  const options = Children.toArray(select.props.children)
    .filter((option): option is ReactElement<SelectOptionProps> => isValidElement<SelectOptionProps>(option))
    .map((option) => ({ label: String(option.props.children ?? ""), value: option.props.value ?? String(option.props.children ?? "") }));
  const [internalValue, setInternalValue] = useState(select.props.defaultValue ?? options[0]?.value ?? "");
  const value = select.props.value ?? internalValue;
  const choose = (next: string) => {
    setInternalValue(next);
    select.props.onChange?.({ target: { value: next } });
  };
  return <CustomDropdown options={options} value={value} onChange={choose} />;
}

export function FilterBar({ children }: { children: ReactNode }) {
  const enhance = (child: ReactNode): ReactNode => {
    if (!isValidElement(child)) return child;
    if (child.type === "select") return <FilterDropdown select={child as ReactElement<SelectProps>} />;
    if (child.type === "label") {
      const label = child as ReactElement<{ children?: ReactNode }>;
      return cloneElement(label, {}, Children.map(label.props.children, enhance));
    }
    return child;
  };
  return <div className="filter-bar">{Children.map(children, enhance)}</div>;
}
