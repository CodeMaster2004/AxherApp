import React, { forwardRef, ReactNode } from "react";
import styles from "./AuthCard.module.css";

interface AuthInputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  icon?: ReactNode;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // ✅ keyDown
  className?: string;
}

// ✅ forwardRef para que podamos pasar ref desde el OTP
const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      type = "text",
      placeholder,
      value,
      onChange,
      disabled = false,
      required = false,
      autoFocus = false,
      icon,
      onKeyDown,
      className
    },
    ref
  ) => {
    return (
      <div className={styles.field}>
        {icon}
        <input
          className={`${styles.inputField} ${className || ""}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          ref={ref} // ✅ aquí pasa el ref
          onKeyDown={onKeyDown} // ✅ keyDown funciona
        />
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;