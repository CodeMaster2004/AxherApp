import styles from "./AuthCard.module.css";
import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primaryText?: string;
  secondaryText?: string;
  onSecondaryClick?: () => void;
  onForgotClick?: () => void;
  loading?: boolean;
  loadingText?: string;
}

export default function AuthButtons({
  primaryText,
  secondaryText,
  onSecondaryClick,
  onForgotClick,
  loading = false,
  loadingText,
  children,
  ...primaryBtnProps
}: Props) {
  const label = primaryText ?? (children as React.ReactNode) ?? "Enviar";
  return (
    <>
      <div className={styles.btn}>
        <button type={primaryBtnProps.type ?? "submit"} className={styles.button1} {...primaryBtnProps}>
          {loading ? (loadingText ?? label) : label}
        </button>

        {secondaryText && (
          <button
            type="button"
            onClick={onSecondaryClick}
            className={styles.button2}
          >
            {secondaryText}
          </button>
        )}
      </div>

      {onForgotClick && (
        <button
          type="button"
          onClick={onForgotClick}
          className={styles.button3}
        >
          Forgot Password
        </button>
      )}
    </>
  );
}