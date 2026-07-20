"use client";

import React, { useState } from "react";
import styles from "@/shared/styles/layout/Header.module.css";
import { Search as SearchIcon, X } from "lucide-react";
import  mobileStyles  from "@/widgets/navigation/search/SearchMobile.module.css"

interface MobileSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MobileSearchOverlay({
  value,
  onChange,
}: MobileSearchProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={styles.mobileSearchButton}
        aria-label="Buscar"
        onClick={() => setIsOpen(true)}
      >
        <SearchIcon size={24} />
      </button>

      {isOpen && (
        <div className={mobileStyles.overlay}>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Buscar películas o series..."
            autoFocus
            className={mobileStyles.input}
            />
          <button
            className={mobileStyles.close}
            aria-label="Cerrar búsqueda"
            onClick={() => setIsOpen(false)}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
