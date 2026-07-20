"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MoreMenu.module.css";

type MenuItem = {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger"; // danger aplica estilo rojo para acciones destructivas
};

type Props = {
  items: MenuItem[]; // elementos del menú contextual
  ariaLabel?: string; // etiqueta accesible del botón de tres puntos
};

export default function MoreMenu({ items, ariaLabel = "Más acciones" }: Props) {
  const [open, setOpen] = useState(false); // controla visibilidad del menú
  const ref = useRef<HTMLDivElement | null>(null); // referencia para detectar click fuera

  useEffect(() => {
    // Cerrar el menú al hacer click fuera o al presionar Escape.
    const onClickOutside = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Ejecuta la acción y cierra el menú
  const handleItemClick = (cb: () => void) => {
    setOpen(false);
    cb();
  };

  return (
    <div className={styles.container} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)} // toggle abrir/cerrar menú
      >
        {/* Símbolo de tres puntos */}
        <span style={{ fontSize: 20, lineHeight: 1 }}>⋯</span>
      </button>

      {open && (
        <div role="menu" className={styles.menu}>
          {items.map((it, idx) => (
            <button
              key={`${it.label}-${idx}`}
              type="button"
              role="menuitem"
              className={`${styles.item} ${it.variant === "danger" ? styles.danger : ""}`.trim()} // danger resalta eliminar
              onClick={() => handleItemClick(it.onClick)}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
