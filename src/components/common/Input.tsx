import React, { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-content-primary-light dark:text-content-primary-dark select-none"
          >
            {label}
            {props.required && <span className="text-priority-urgent-fg ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            'w-full px-3 py-2 text-sm rounded-md transition-colors duration-150',
            'bg-surface-light dark:bg-surface-dark',
            'text-content-primary-light dark:text-content-primary-dark',
            'placeholder:text-stone-400 dark:placeholder:text-stone-500',
            'border border-border-strong-light dark:border-border-strong-dark',
            'focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 dark:focus:ring-sage-dark/20',
            'disabled:opacity-50 disabled:bg-subtle-light dark:disabled:bg-subtle-dark disabled:cursor-not-allowed',
            error && 'border-priority-urgent-border focus:border-priority-urgent-fg focus:ring-priority-urgent-fg/20',
            className
          )}
          {...props}
        />

        {error ? (
          <p id={errorId} role="alert" className="text-xs text-priority-urgent-fg font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-content-secondary-light dark:text-content-secondary-dark">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
