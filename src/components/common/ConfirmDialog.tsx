import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
}: ConfirmDialogProps): React.JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-content-secondary-light dark:text-content-secondary-dark leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-subtle-light dark:border-border-subtle-dark">
          <Button variant="secondary" size="sm" onClick={onClose} autoFocus>
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={
              isDestructive
                ? 'bg-priority-urgent-fg hover:bg-orange-800 text-white border-transparent'
                : undefined
            }
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
