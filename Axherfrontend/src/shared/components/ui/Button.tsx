import React from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'danger' | 'animated' | 'delete' | 'edit';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode; // opcional para el signo
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  loadingText,
  disabled,
  icon,
  className = '',
  type = 'button',
  ...rest
}: Props) {
  const isAnimated = variant === 'animated';
  const isDelete = variant === 'delete';
  const isEdit = variant === 'edit';
  const isDisabled = disabled || loading;

  // clases base
  const variantClass = isAnimated
    ? styles.animated
    : isDelete
    ? styles.deleteRoot
    : isEdit
    ? styles.editRoot
    : (variant === 'secondary' ? styles.secondary : variant === 'danger' ? styles.danger : styles.primary);
  const classes = `${styles.btn} ${variantClass} ${className}`.trim();
  const disabledClass = isDelete && isDisabled ? styles.deleteDisabled : '';
  const editDisabledClass = isEdit && isDisabled ? styles.editDisabled : '';

  return (
    <button
      type={type}
      className={`${classes} ${disabledClass} ${editDisabledClass}`.trim()}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...rest}
    >
      {isDelete ? (
        // Botón de eliminar animado reutilizable
        <>
          <span className={styles.deleteText}>{children}</span>
          <span className={styles.deleteIcon} aria-hidden>
            {icon ?? (
              // SVG por defecto (papelera)
              <svg className={styles.deleteSvg} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/>
                <line x1="80" y1="112" x2="432" y2="112" stroke="#fff" strokeLinecap="round" strokeWidth="32"/>
                <path d="M192,112V72a24,24,0,0,1,24-24h80a24,24,0,0,1,24,24v40" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/>
                <line x1="256" y1="176" x2="256" y2="400" stroke="#fff" strokeLinecap="round" strokeWidth="32"/>
                <line x1="184" y1="176" x2="192" y2="400" stroke="#fff" strokeLinecap="round" strokeWidth="32"/>
                <line x1="328" y1="176" x2="320" y2="400" stroke="#fff" strokeLinecap="round" strokeWidth="32"/>
              </svg>
            )}
          </span>
        </>
      ) : isEdit ? (
        // Botón de editar animado reutilizable
        <>
          <span className={styles.editText}>{children}</span>
          <span className={styles.editIcon} aria-hidden>
            {icon ?? (
              // SVG por defecto (lápiz)
              <svg className={styles.editSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M290.74,93.24l128,128L142.06,498.94a32,32,0,0,1-17.93,10.33L32,528l18.73-92.09a32,32,0,0,1,10.33-17.93L290.74,93.24m45.25-45.25L352,31.11a48,48,0,0,0-33.94,14.06L284.69,79.6l128-128L336,48Z" fill="#fff"/>
              </svg>
            )}
          </span>
        </>
      ) : (
        <>
          {isAnimated ? (
            <>
              <div className={styles.sign}>{icon ?? '+'}</div>
              <div className={styles.text}>{loading ? (loadingText ?? (children ? `${children}` : '...')) : children}</div>
            </>
          ) : (
            <>
              {loading ? <div className={styles.spinner} /> : null}
              <span>{loading ? (loadingText ?? children) : children}</span>
            </>
          )}
        </>
      )}
    </button>
  );
}
