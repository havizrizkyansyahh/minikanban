import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Button } from '@/components/common/Button';
import { Priority, ColumnId, Task } from '@/types/kanban';
import { DEFAULT_COLUMNS } from '@/constants/columns';
import { cn } from '@/utils/cn';

export interface TaskFormSubmitData {
  title: string;
  description?: string;
  priority: Priority;
  columnId: ColumnId;
}

export interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormSubmitData) => void;
  initialTask?: Task | null;
  defaultColumnId?: ColumnId;
}

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  defaultColumnId = 'todo',
}: TaskFormModalProps): React.JSX.Element {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [columnId, setColumnId] = useState<ColumnId>(defaultColumnId);
  const [titleError, setTitleError] = useState<string | null>(null);

  const isEditMode = Boolean(initialTask);

  // Sync form values when initialTask or defaultColumnId changes
  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setTitle(initialTask.title);
        setDescription(initialTask.description ?? '');
        setPriority(initialTask.priority);
        setColumnId(initialTask.columnId);
      } else {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setColumnId(defaultColumnId);
      }
      setTitleError(null);
    }
  }, [isOpen, initialTask, defaultColumnId]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Task title is required');
      return;
    }

    onSubmit({
      title: trimmedTitle,
      description: description.trim() ? description.trim() : undefined,
      priority,
      columnId,
    });

    onClose();
  };

  const handleClose = (): void => {
    setTitleError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Task' : 'Create New Task'}
      description={
        isEditMode
          ? 'Update task details, priority, or column location.'
          : 'Capture a new task to organize your workspace.'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title Input */}
        <Input
          label="Title"
          required
          placeholder="e.g. Write integration test suite"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError(null);
          }}
          error={titleError ?? undefined}
          autoFocus
        />

        {/* Description Input */}
        <Textarea
          label="Description (optional)"
          placeholder="Add context, subtasks, or reference links..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        {/* Priority Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-content-primary-light dark:text-content-primary-dark select-none">
            Priority
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as const).map((p) => {
              const isSelected = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    'py-1.5 px-3 rounded-md text-xs font-medium border text-center transition-all cursor-pointer',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage',
                    isSelected
                      ? 'border-sage bg-sage-soft text-sage dark:bg-sage-dark-soft dark:text-sage-dark font-semibold'
                      : 'border-border-strong-light dark:border-border-strong-dark bg-surface-light dark:bg-surface-dark text-content-secondary-light dark:text-content-secondary-dark hover:bg-subtle-light dark:hover:bg-subtle-dark'
                  )}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Column Target Selector */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="column-select"
            className="text-xs font-semibold text-content-primary-light dark:text-content-primary-dark select-none"
          >
            Column
          </label>
          <select
            id="column-select"
            value={columnId}
            onChange={(e) => setColumnId(e.target.value as ColumnId)}
            className="w-full px-3 py-2 text-sm rounded-md bg-surface-light dark:bg-surface-dark text-content-primary-light dark:text-content-primary-dark border border-border-strong-light dark:border-border-strong-dark focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 cursor-pointer"
          >
            {DEFAULT_COLUMNS.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-subtle-light dark:border-border-subtle-dark mt-2">
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {isEditMode ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
