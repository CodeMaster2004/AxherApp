import React, { useState, useRef, useEffect } from "react";
import styles from "./MultiSelect.module.css";

export interface MultiSelectOption {
  value: string | number;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  selected: Array<string | number>;
  onChange: (selected: Array<string | number>) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export default function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = "Seleccionar...",
  disabled = false,
  multiple = true,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const handleSelect = (value: string | number) => {
    if (multiple) {
      if (selected.includes(value)) {
        onChange(selected.filter((v) => v !== value));
      } else {
        onChange([...selected, value]);
      }
      setOpen(false);
    } else {
      onChange([value]);
      setOpen(false);
    }
  };

  const handleRemove = (value: string | number) => {
    onChange(selected.filter((v) => v !== value));
  };

  const selectedOptions = options.filter((opt) => selected.includes(opt.value));
  const availableOptions = options.filter((opt) => !selected.includes(opt.value));

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.selectedArea}>
        {selectedOptions.map((opt) => (
          <span key={opt.value} className={styles.chip}>
            {opt.label}
            {multiple && (
              <button
                type="button"
                className={styles.chipRemove}
                onClick={() => handleRemove(opt.value)}
                aria-label={`Quitar ${opt.label}`}
              >
                ×
              </button>
            )}
          </span>
        ))}
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => setOpen((v) => !v)}
          disabled={disabled}
        >
          {placeholder}
        </button>
      </div>
      {open && (
        <div className={styles.menu} ref={menuRef}>
          {availableOptions.length === 0 ? (
            <div className={styles.menuItemDisabled}>Sin opciones</div>
          ) : (
            availableOptions.map((opt) => (
              <div
                key={opt.value}
                className={styles.menuItem}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
