"use client";

import React from 'react';
import styles from '@/shared/styles/shared/Form.module.css';

export interface FormGroupProps {
  /** Etiqueta del campo */
  label: string;
  /** Contenido del FormGroup (input, select, etc.) */
  children: React.ReactNode;
  /** Si el campo es requerido */
  required?: boolean;
  /** Mensaje de error para mostrar */
  error?: string;
  /** ID del elemento hijo (para asociar label) */
  htmlFor?: string;
}

/**
 * Componente FormGroup para agrupar label + campo + error
 * Útil cuando necesitas más control sobre el input
 * 
 * @example
 * ```tsx
 * <FormGroup label="Categoría" required error={errors.categoria}>
 *   <select value={categoria} onChange={...}>
 *     <option value="">Seleccionar...</option>
 *   </select>
 * </FormGroup>
 * ```
 */
export default function FormGroup({
  label,
  children,
  required = false,
  error,
  htmlFor,
}: FormGroupProps) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;

  return (
    <div className={styles.formGroup}>
      <label 
        htmlFor={htmlFor}
        className={required ? styles.required : ''}
      >
        {label}
      </label>
      {children}
      {error && (
        <span 
          id={errorId} 
          className={styles.errorMessage}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}
