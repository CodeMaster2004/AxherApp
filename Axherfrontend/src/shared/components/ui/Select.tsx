import React from "react";
import formStyles from "@/shared/styles/shared/Form.module.css";

export interface SelectOption {
  value: string | number | undefined;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string | number | undefined;
  onChange: (value: string | number | undefined) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  name?: string;
}

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  required = false,
  error,
  disabled = false,
  name,
}: SelectProps) {
  return (
    <div className={formStyles.formGroup}>
      {label && (
        <label className={required ? formStyles.required : undefined}>{label}</label>
      )}
      <select
        className={formStyles.input}
        value={value ?? ""}
        onChange={e => {
          const val = e.target.value;
          onChange(val === "" ? undefined : isNaN(Number(val)) ? val : Number(val));
        }}
        required={required}
        disabled={disabled}
        name={name}
      >
        {options.every(opt => opt.value !== "") && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={String(opt.value)} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className={formStyles.errorMessage}>{error}</span>}
    </div>
  );
}