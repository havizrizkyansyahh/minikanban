import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-sage text-white hover:bg-sage-hover active:bg-sage-hover border border-transparent shadow-xs dark:bg-sage dark:hover:bg-sage-hover',
  secondary:
    'bg-surface-light dark:bg-surface-dark text-content-primary-light dark:text-content-primary-dark border border-border-strong-light dark:border-border-strong-dark hover:bg-subtle-light dark:hover:bg-subtle-dark active:bg-border-subtle-light dark:active:bg-border-subtle-dark shadow-xs',
  ghost:
    'bg-transparent text-content-secondary-light dark:text-content-secondary-dark hover:bg-subtle-light dark:hover:bg-subtle-dark hover:text-content-primary-light dark:hover:text-content-primary-dark border border-transparent',
  icon:
    'bg-transparent text-content-secondary-light dark:text-content-secondary-dark hover:bg-subtle-light dark:hover:bg-subtle-dark hover:text-content-primary-light dark:hover:text-content-primary-dark border border-border-subtle-light/70 dark:border-border-subtle-dark/70 rounded-md p-1.5 aspect-square',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-2.5 py-1.5 h-8 gap-1.5 rounded-md',
  md: 'text-sm px-3.5 py-2 h-9 gap-2 rounded-md',
  lg: 'text-sm px-4.5 py-2.5 h-11 gap-2.5 rounded-md font-medium',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      type = 'button',
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer touch-manipulation',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-light dark:focus-visible:ring-offset-canvas-dark',
          'active:scale-[0.985] motion-reduce:transform-none',
          'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:shadow-none',
          variant !== 'icon' && sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
