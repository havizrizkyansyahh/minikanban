import React, { useState, useRef, useEffect } from 'react';
import { ColumnId, Task } from '@/types/kanban';
import { DEFAULT_COLUMNS } from '@/constants/columns';
import { MoreHorizontal, Edit2, ArrowRight, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface TaskActionMenuProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (taskId: string, targetColumnId: ColumnId) => void;
}

export function TaskActionMenu({
  task,
  onEdit,
  onDelete,
  onMove,
}: TaskActionMenuProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const otherColumns = DEFAULT_COLUMNS.filter((col) => col.id !== task.columnId);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        aria-label={`Task actions for ${task.title}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={cn(
          'p-1 rounded text-content-secondary-light dark:text-content-secondary-dark',
          'hover:text-content-primary-light dark:hover:text-content-primary-dark',
          'hover:bg-subtle-light dark:hover:bg-subtle-dark',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage',
          isOpen && 'bg-subtle-light dark:bg-subtle-dark text-content-primary-light'
        )}
      >
        <MoreHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={`Actions for ${task.title}`}
          className={cn(
            'absolute right-0 top-full mt-1 w-44 z-30',
            'bg-surface-light dark:bg-surface-dark',
            'border border-border-strong-light dark:border-border-strong-dark',
            'rounded-md shadow-modal py-1',
            'text-xs text-content-primary-light dark:text-content-primary-dark'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Edit action */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onEdit(task);
            }}
            className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-subtle-light dark:hover:bg-subtle-dark focus-visible:bg-subtle-light dark:focus-visible:bg-subtle-dark focus-visible:outline-none transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-content-secondary-light" aria-hidden="true" />
            <span>Edit task</span>
          </button>

          {/* Move actions */}
          {otherColumns.length > 0 && (
            <div className="border-t border-border-subtle-light dark:border-border-subtle-dark my-1 pt-1">
              <span className="block px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-content-muted select-none">
                Move to
              </span>
              {otherColumns.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    onMove(task.id, col.id);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-subtle-light dark:hover:bg-subtle-dark focus-visible:bg-subtle-light dark:focus-visible:bg-subtle-dark focus-visible:outline-none transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-sage" aria-hidden="true" />
                  <span>{col.title}</span>
                </button>
              ))}
            </div>
          )}

          {/* Delete action */}
          <div className="border-t border-border-subtle-light dark:border-border-subtle-dark my-1 pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                onDelete(task);
              }}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-priority-urgent-fg hover:bg-orange-50 dark:hover:bg-orange-950/40 focus-visible:bg-orange-50 dark:focus-visible:bg-orange-950/40 focus-visible:outline-none transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Delete task</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
