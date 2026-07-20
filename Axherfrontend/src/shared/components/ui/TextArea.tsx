"use client";

import React from 'react';
import styles from '@/shared/styles/shared/Form.module.css';

export interface TextAreaProps {
  /** Etiqueta del campo */
  label: string;
  /** Valor actual del textarea */
  value: string;
  /** Función que se ejecuta al cambiar el valor */
  onChange: (value: string) => void;
  /** Texto de placeholder */
  placeholder?: string;
  /** Si el campo está deshabilitado */
  disabled?: boolean;
  /** Si el campo es requerido */
  required?: boolean;
  /** Mensaje de error para mostrar */
  error?: string;
  /** Número de filas visibles */
  rows?: number;
  /** ID personalizado del textarea */
  id?: string;
  /** Nombre del campo para formularios */
  name?: string;
  /** Longitud máxima */
  maxLength?: number;
  /** Autoenfoque al cargar */
  autoFocus?: boolean;
}

/**
 * Componente de TextArea reutilizable con label y manejo de errores
 * 
 * @example
 * ```tsx
 * <TextArea 
 *   label="Descripción" 
 *   value={descripcion} 
 *   onChange={setDescripcion}
 *   rows={4}
 *   required
 *   error={errors.descripcion}
 * />
 * ```
 */
export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  error,
  rows = 4,
  id,
  name,
  maxLength,
  autoFocus = false,
}: TextAreaProps) {
  // Generar ID único si no se proporciona
  const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.formGroup}>
      <label 
        htmlFor={textareaId} 
        className={required ? styles.required : ''}
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        name={name || textareaId}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        autoFocus={autoFocus}
        className={error ? styles.textareaError : styles.textarea}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
      />
      {error && (
        <span 
          id={`${textareaId}-error`} 
          className={styles.errorMessage}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}
