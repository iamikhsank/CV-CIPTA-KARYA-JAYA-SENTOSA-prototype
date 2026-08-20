"use client";

import { Children, cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";

export function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}><i />{status === "PARTIAL" ? "PARTIALLY PAID" : status}</span>;
}

export function PageIntro({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div><h1>{title}</h1><p>{description}</p></div>{action && <div className="heading-actions">{action}</div>}</div>;
}

type SelectOptionProps = { children?: ReactNode; value?: string };
type SelectProps = { children?: ReactNode; defaultValue?: string; value?: string; onChange?: (event: { target: { value: string } }) => void };

function FilterDropdown({ select }: { select: ReactElement<SelectProps> }) {
  const options = Children.toArray(select.props.children)
    .filter((option): option is ReactElement<SelectOptionProps> => isValidElement<SelectOptionProps>(option))
    .map((option) => ({ label: option.props.children, value: option.props.value ?? String(option.props.children ?? "") }));
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(select.props.defaultValue ?? options[0]?.value ?? "");
  const value = select.props.value ?? internalValue;
  const selected = options.find((option) => option.value === value) ?? options[0];
  const choose = (next: string) => { setInternalValue(next); select.props.onChange?.({ target: { value: next } }); setOpen(false); };
  return <div className={`filter-dropdown ${open ? "is-open" : ""}`} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false); }}><button className="filter-dropdown-trigger" onClick={() => setOpen((current) => !current)} aria-haspopup="listbox" aria-expanded={open} type="button"><span>{selected?.label}</span><HugeiconsIcon icon={ArrowDown01Icon} size={15} strokeWidth={1.8} /></button>{open && <div className="filter-dropdown-menu" role="listbox">{options.map((option) => <button className={option.value === value ? "selected" : ""} onClick={() => choose(option.value)} role="option" aria-selected={option.value === value} key={String(option.value)} type="button"><span>{option.label}</span>{option.value === value && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={2} />}</button>)}</div>}</div>;
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
