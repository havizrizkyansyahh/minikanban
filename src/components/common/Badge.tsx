import React from 'react';
import { cn } from '@/utils/cn';

export type BadgeVariant =
  | 'priority-urgent'
  | 'priority-high'
  | 'priority-medium'
  | 'priority-low'
  | 'done'
  | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  'priority-urgent':
    'bg-priority-urgent-bg text-priority-urgent-fg border-priority-urgent-border',
  'priority-high':
    'bg-priority-high-bg text-priority-high-fg border-priority-high-border',
  'priority-medium':
    'bg-priority-medium-bg text-priority-medium-fg border-priority-medium-border',
  'priority-low':
    'bg-priority-low-bg text-priority-low-fg border-priority-low-border',
  done:
    'bg-priority-done-bg text-priority-done-fg border-priority-done-border',
  neutral:
    'bg-subtle-light text-content-secondary-light border-border-subtle-light dark:bg-subtle-dark dark:text-content-secondary-dark dark:border-border-subtle-dark',
};

export function Badge({
  variant = 'neutral',
  className,
  children,
  ...props
}: BadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-medium tracking-tight border',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
