"use client";

import { useState } from "react";

export function SettingToggle({ defaultChecked = false, label, onChange }: { defaultChecked?: boolean; label: string; onChange: () => void }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <button
      className={`setting-toggle ${checked ? "is-on" : ""}`}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => {
        setChecked((current) => !current);
        onChange();
      }}
    >
      <i />
    </button>
  );
}
