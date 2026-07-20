import React from "react";
import hamburgerStyles from "@/shared/components/ui/Hamburger.module.css";

interface HamburgerButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  isOpen,
  onToggle,
  className = "",
}) => {
  return (
    <label
      className={`${hamburgerStyles.hamburger} ${hamburgerStyles.hamburgerGlobal} ${className}`}
    >
      <input
        type="checkbox"
        checked={isOpen}
        onChange={onToggle}
        aria-label="Abrir menú"
      />

      <svg viewBox="0 0 32 32">
        <path
          className={`${hamburgerStyles.line} ${hamburgerStyles.lineTopBottom}`}
          d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
        />
        <path
          className={hamburgerStyles.line}
          d="M7 16 27 16"
        />
      </svg>
    </label>
  );
};

export default HamburgerButton;