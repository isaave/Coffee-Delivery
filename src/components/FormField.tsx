import type { ReactNode } from 'react'
import './FormField.css'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  children: ReactNode
  className?: string
}

/** Rótulo + controle + erro associados — usado por todos os campos do checkout. */
export function FormField({
  id,
  label,
  error,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`form-field ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <span className="form-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
