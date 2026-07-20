"use client";

import React, { useState } from 'react';
import styles from '@/shared/styles/shared/Form.module.css';

export interface InputProps {
  /** Etiqueta del campo */
  label: string;
  /** Valor actual del input */
  value: string;
  /** Función que se ejecuta al cambiar el valor */
  onChange: (value: string) => void;
  /** Tipo de input */
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel' | 'date' ;
  /** Texto de placeholder */
  placeholder?: string;
  /** Si el campo está deshabilitado */
  disabled?: boolean;
  /** Si el campo es requerido */
  required?: boolean;
  /** Mensaje de error para mostrar */
  error?: string;
  /** ID personalizado del input */
  id?: string;
  /** Nombre del campo para formularios */
  name?: string;
  /** Autocompletar del navegador */
  autoComplete?: string;
  /** Autoenfoque al cargar */
  autoFocus?: boolean;
  /** Longitud máxima */
  maxLength?: number;
  /** Valor mínimo (para type="number") */
  min?: number;
  /** Valor máximo (para type="number") */
  max?: number;
  step?: number | string;
}

/**
 * Componente de Input reutilizable con label y manejo de errores
 * 
 * @example
 * ```tsx
 * <Input 
 *   label="Nombre" 
 *   value={nombre} 
 *   onChange={setNombre}
 *   required
 *   error={errors.nombre}
 * />
 * ```
 */
export default function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  required = false,
  error,
  id,
  name,
  autoComplete,
  autoFocus = false,
  maxLength,
  min,
  max,
}: InputProps) {
  // Generar ID único si no se proporciona
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const [lengthError, setLengthError] = useState<string | null>(null);

  const finalError = error || lengthError;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    

    if(maxLength && val.length > maxLength){
      setLengthError(`No puede ingresar mas de ${maxLength} caracteres`);
      return;
    }

      setLengthError(null);
      onChange(val);
  };

  return (
    <div className={styles.formGroup}>
      <label 
        htmlFor={inputId} 
        className={required ? styles.required : ''}
      >
        {label}
      </label>
      <input
        id={inputId}
        name={name || inputId}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        min={min}
        max={max}
        className={finalError ? styles.inputError : styles.input}
        aria-invalid={!!finalError}
        aria-describedby={finalError ? `${inputId}-error` : undefined}
      />
      {finalError && (
        <span 
          id={`${inputId}-error`} 
          className={styles.errorMessage}
          role="alert"
        >
          {finalError}
        </span>
      )}

      

    </div>
  );
}
