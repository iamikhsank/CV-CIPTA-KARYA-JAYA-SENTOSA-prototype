"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

/* ==========================================================================
   Indonesian Smart Currency Formatter Utilities
   ========================================================================== */

/**
 * Formats a clean digit string (e.g. "10000000") into dot-separated thousands (e.g. "10.000.000")
 */
export function formatThousandsIDR(digitStr: string): string {
  if (!digitStr) return "";
  // Remove leading zeros if more than 1 digit (e.g. "05" -> "5", but "0" -> "0")
  const normalized = digitStr.replace(/^0+(?=\d)/, "");
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Formats a number or string into Indonesian currency format (e.g. 10000000 -> "10.000.000")
 */
export function formatSmartCurrency(val: number | string | null | undefined): string {
  if (val === null || val === undefined || val === "") return "";
  const num = typeof val === "number" ? val : parseSmartCurrency(String(val));
  if (isNaN(num)) return "";
  if (num === 0) return "0";

  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const str = absNum.toString();

  if (str.includes(".")) {
    const [intPart, decPart] = str.split(".");
    return `${isNegative ? "-" : ""}${formatThousandsIDR(intPart)},${decPart}`;
  }

  return `${isNegative ? "-" : ""}${formatThousandsIDR(str)}`;
}

/**
 * Parses user input string into a standard Javascript number
 */
export function parseSmartCurrency(input: string | number): number {
  if (typeof input === "number") return isNaN(input) ? 0 : input;
  if (!input) return 0;

  let str = input.trim();
  // Strip currency prefixes and whitespace
  str = str.replace(/^(rp\.?|idr)\s*/i, "").replace(/\s+/g, "");

  // Handle shorthand multipliers: k/rb = 1.000, m/jt = 1.000.000, b/mly = 1.000.000.000
  let multiplier = 1;
  if (/k$/i.test(str) || /rb$/i.test(str)) {
    multiplier = 1_000;
    str = str.replace(/k$/i, "").replace(/rb$/i, "");
  } else if (/jt$/i.test(str)) {
    multiplier = 1_000_000;
    str = str.replace(/jt$/i, "");
  } else if (/m$/i.test(str) && !/\d+m\d+/i.test(str)) {
    multiplier = 1_000_000;
    str = str.replace(/m$/i, "");
  } else if (/b$/i.test(str) || /mly$/i.test(str)) {
    multiplier = 1_000_000_000;
    str = str.replace(/b$/i, "").replace(/mly$/i, "");
  }

  // Check if string contains comma as decimal separator
  if (str.includes(",")) {
    const [intPart, ...decParts] = str.split(",");
    const intDigits = intPart.replace(/\D/g, "");
    const decDigits = decParts.join("").replace(/\D/g, "");
    if (!intDigits && !decDigits) return 0;
    const numStr = decDigits ? `${intDigits || "0"}.${decDigits}` : intDigits || "0";
    const parsed = parseFloat(numStr);
    return isNaN(parsed) ? 0 : parsed * multiplier;
  }

  // Pure integer or dot-separated thousands: all dots are thousand separators
  const intDigits = str.replace(/\D/g, "");
  if (!intDigits) return 0;
  const parsed = parseInt(intDigits, 10);
  return isNaN(parsed) ? 0 : parsed * multiplier;
}

/* ==========================================================================
   Smart Currency Input Component
   ========================================================================== */

export interface SmartCurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export function SmartCurrencyInput({
  value,
  onChange,
  max,
  min = 0,
  placeholder = "0",
  autoFocus = false,
  className = "payment-amount-input",
  id,
  name,
  disabled = false,
  ariaLabel = "Nominal",
}: SmartCurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Maintain display string locally
  const [displayValue, setDisplayValue] = useState<string>(() => {
    return value !== undefined && value !== null && value !== 0
      ? formatSmartCurrency(value)
      : "";
  });

  // Synchronize when value changes externally (e.g. initial load or shortcut buttons)
  useEffect(() => {
    const currentNumeric = parseSmartCurrency(displayValue);
    if (currentNumeric !== value) {
      setDisplayValue(value ? formatSmartCurrency(value) : "");
    }
  }, [value]);

  const processInputString = (raw: string, cursorRawPos: number) => {
    const inputElem = inputRef.current;

    if (!raw.trim()) {
      setDisplayValue("");
      onChange(0);
      return;
    }

    // Count how many significant digits/commas occurred BEFORE cursor in raw string
    const beforeCursorSub = raw.slice(0, cursorRawPos);
    const digitsBeforeCursor = beforeCursorSub.replace(/\./g, "").length;

    // Split by comma for decimals
    let formatted = "";
    let numericValue = 0;

    if (raw.includes(",")) {
      const [intPart, ...decParts] = raw.split(",");
      const intDigits = intPart.replace(/\D/g, "");
      const decDigits = decParts.join("").replace(/\D/g, "");

      const formattedInt = intDigits ? formatThousandsIDR(intDigits) : "0";

      if (raw.endsWith(",") && decParts.length === 1 && !decParts[0]) {
        // User just typed trailing comma
        formatted = `${formattedInt},`;
      } else {
        formatted = `${formattedInt},${decDigits}`;
      }

      numericValue = decDigits
        ? Number(`${intDigits || "0"}.${decDigits}`)
        : Number(intDigits || 0);
    } else {
      // Pure integer: strip all dots and reformat
      const intDigits = raw.replace(/\D/g, "");
      formatted = formatThousandsIDR(intDigits);
      numericValue = intDigits ? parseInt(intDigits, 10) : 0;
    }

    setDisplayValue(formatted);
    onChange(numericValue);

    // Reposition cursor accurately after formatting
    requestAnimationFrame(() => {
      if (!inputElem) return;

      let newPos = 0;
      let count = 0;

      for (let i = 0; i < formatted.length; i++) {
        if (formatted[i] !== ".") {
          count++;
        }
        if (count === digitsBeforeCursor) {
          newPos = i + 1;
          break;
        }
      }

      if (count < digitsBeforeCursor) {
        newPos = formatted.length;
      }

      inputElem.setSelectionRange(newPos, newPos);
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cursorPos = e.target.selectionStart ?? raw.length;
    processInputString(raw, cursorPos);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    if (!pastedText) return;

    let clean = pastedText.trim().replace(/^(rp\.?|idr)\s*/i, "");

    // If pasted text has international commas (e.g. "10,000,000") and no dots, convert commas to dots
    if (clean.includes(",") && !clean.includes(".")) {
      const parts = clean.split(",");
      if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
        clean = clean.replace(/,/g, "");
      }
    }

    const numeric = parseSmartCurrency(clean);
    const formatted = formatSmartCurrency(numeric);
    setDisplayValue(formatted);
    onChange(numeric);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Multiplier shortcuts:
    // 'k' or 'r' -> multiplies current value by 1.000
    // 'm' or 'j' -> multiplies current value by 1.000.000
    if ((e.key === "k" || e.key === "K" || e.key === "r" || e.key === "R") && value > 0) {
      e.preventDefault();
      const multiplied = value * 1_000;
      const finalVal = max ? Math.min(multiplied, max) : multiplied;
      setDisplayValue(formatSmartCurrency(finalVal));
      onChange(finalVal);
    } else if (
      (e.key === "m" || e.key === "M" || e.key === "j" || e.key === "J") &&
      value > 0
    ) {
      e.preventDefault();
      const multiplied = value * 1_000_000;
      const finalVal = max ? Math.min(multiplied, max) : multiplied;
      setDisplayValue(formatSmartCurrency(finalVal));
      onChange(finalVal);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    let numeric = parseSmartCurrency(displayValue);
    if (min !== undefined && numeric < min) numeric = min;
    if (max !== undefined && numeric > max) numeric = max;

    setDisplayValue(numeric ? formatSmartCurrency(numeric) : "");
    onChange(numeric);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      id={id}
      name={name}
      value={displayValue}
      onChange={handleChange}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
      autoFocus={autoFocus}
      disabled={disabled}
      aria-label={ariaLabel}
      className={className}
    />
  );
}
