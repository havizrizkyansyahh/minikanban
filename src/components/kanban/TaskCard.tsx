import React from 'react';
import { ColumnId, Task } from '@/types/kanban';
import { Badge } from '@/components/common/Badge';
import { TaskActionMenu } from './TaskActionMenu';
import { getPriorityBadgeVariant } from '@/utils/priority';
import { cn } from '@/utils/cn';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onMove?: (taskId: string, targetColumnId: ColumnId) => void;
  isDragDisabled?: boolean;
  isOverlay?: boolean;
  className?: string;
}

export function TaskCard({
  task,
  onClick,
  onEdit,
  onDelete,
  onMove,
  isDragDisabled = false,
  isOverlay = false,
  className,
}: TaskCardProps): React.JSX.Element {
  // Sortable hook only used for in-tree cards, not overlay
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: isDragDisabled || isOverlay,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      // Don't trigger if key originates from inside action menu
      if ((event.target as HTMLElement).closest('button')) {
        return;
      }
      event.preventDefault();
      onClick?.(task);
    }
  };

  return (
    <article
      ref={isOverlay ? undefined : setNodeRef}
      style={isOverlay ? undefined : style}
      aria-label={`Task: ${task.title}`}
      onClick={() => onClick?.(task)}
      onKeyDown={handleKeyDown}
      {...(isOverlay || isDragDisabled ? {} : attributes)}
      {...(isOverlay || isDragDisabled ? {} : listeners)}
      tabIndex={isOverlay ? -1 : 0}
      role="article"
      className={cn(
        'group relative bg-surface-light dark:bg-surface-dark',
        'border border-border-strong-light/80 dark:border-border-strong-dark/80',
        'hover:border-border-strong-light dark:hover:border-border-strong-dark',
        'rounded-lg p-3.5 shadow-card hover:shadow-card-hover',
        'transition-all duration-150 ease-out select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-column-light dark:focus-visible:ring-offset-column-dark',
        isDragDisabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-40 border-2 border-dashed border-border-strong-light dark:border-border-strong-dark',
        isOverlay && 'shadow-modal rotate-1 scale-[1.02] border-sage dark:border-sage opacity-95 cursor-grabbing z-50',
        className
      )}
    >
      {/* Top Header: Priority Badge + Accessible Action Menu */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <Badge variant={getPriorityBadgeVariant(task.priority)}>
          {task.priority.toUpperCase()}
        </Badge>

        {!isOverlay && onEdit && onDelete && onMove && (
          <TaskActionMenu
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        )}
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-medium tracking-tight text-content-primary-light dark:text-content-primary-dark leading-snug mb-1">
        {task.title}
      </h4>

      {/* Optional Description */}
      {task.description && (
        <p className="text-xs text-content-secondary-light dark:text-content-secondary-dark line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}
    </article>
  );
}
