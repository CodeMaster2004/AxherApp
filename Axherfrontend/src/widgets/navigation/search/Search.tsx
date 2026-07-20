"use client";

import React from "react";
import { Search as SearchIcon } from "lucide-react";
import styles from "@/widgets/navigation/search/search.module.css";
interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  containerClassName?: string; // 👈 NUEVO
   inputClassName?: string;
  autoFocus?: boolean;
}

export default function Search({
  value,
  onChange,
  placeholder = "Buscar películas o series...",
  className = "",
  autoFocus = false,
  containerClassName,
  inputClassName
}: SearchProps) {
  return (
    <div className={`${styles.searchContainer} ${className} ${containerClassName || ""}`}>
      <input
        type="text"
        placeholder={placeholder}
        className={`${styles.searchInput} ${inputClassName || ""}`}
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className={styles.searchIcon}>
        <SearchIcon size={22} />
      </span>
    </div>
  );
}