import React, { useEffect, useRef, useId } from 'react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps): React.JSX.Element | null {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Handle focus restore & escape key & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the modal, deliberate autofocus target, or first focusable element
    const focusTimer = setTimeout(() => {
      if (!dialogRef.current) return;

      // 1. If an element inside dialog already has focus (e.g. from React autoFocus), preserve it
      if (
        document.activeElement &&
        dialogRef.current.contains(document.activeElement) &&
        document.activeElement !== dialogRef.current
      ) {
        return;
      }

      // 2. Prioritize explicit autofocus attribute within dialog
      const autoFocusTarget = dialogRef.current.querySelector<HTMLElement>(
        '[autofocus], [data-autofocus]'
      );
      if (autoFocusTarget) {
        autoFocusTarget.focus();
        return;
      }

      // 3. Fallback to first focusable element or dialog container
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length > 0) {
        focusable[0]?.focus();
      } else {
        dialogRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      // Focus trap
      if (event.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement && lastElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement && firstElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/40 backdrop-blur-[2px] transition-opacity duration-200"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Dialog card */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative w-full max-w-lg bg-surface-light dark:bg-surface-dark',
          'border border-border-subtle-light dark:border-border-subtle-dark',
          'rounded-xl shadow-modal p-6 text-content-primary-light dark:text-content-primary-dark',
          'transition-all duration-150 motion-reduce:transform-none',
          'focus:outline-none',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 id={titleId} className="text-base font-semibold tracking-tight leading-snug">
              {title}
            </h2>
            {description && (
              <p
                id={descriptionId}
                className="text-xs text-content-secondary-light dark:text-content-secondary-dark mt-1"
              >
                {description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-content-muted hover:text-content-primary-light dark:hover:text-content-primary-dark h-8 w-8 p-0"
          >
            ✕
          </Button>
        </div>

        {/* Content */}
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
