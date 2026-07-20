"use client";

import styles from "@/shared/styles/shared/Form.module.css";

interface FileInputProps {
  label: string;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  required?: boolean;
  accept?: string;
}

export default function FileInput({
  label,
  onChange,
  disabled = false,
  autoFocus = false,
  required = false,
  accept,
}: FileInputProps) {
  const id = `file-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={styles.formGroup}>
      <label htmlFor={id} className={required ? styles.required : ""}>
        {label}
      </label>
      <input
        id={id}
        type="file"
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className={styles.input}
      />
    </div>
  );
}
