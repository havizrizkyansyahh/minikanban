import React from 'react';
import { Column as ColumnType, ColumnId, Task } from '@/types/kanban';
import { TaskCard } from './TaskCard';
import { ColumnEmptyState } from './ColumnEmptyState';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  totalCount?: number;
  onAddTask?: (columnId: ColumnType['id']) => void;
  onTaskClick?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onMoveTask?: (taskId: string, targetColumnId: ColumnId) => void;
  isDragDisabled?: boolean;
  isFiltered?: boolean;
  onResetFilters?: () => void;
  className?: string;
}

export function Column({
  column,
  tasks,
  totalCount,
  onAddTask,
  onTaskClick,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  isDragDisabled = false,
  isFiltered = false,
  onResetFilters,
  className,
}: ColumnProps): React.JSX.Element {
  const headerId = `column-header-${column.id}`;
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const taskIds = tasks.map((t) => t.id);
  const countDisplay =
    typeof totalCount === 'number' && totalCount !== tasks.length
      ? `${tasks.length} / ${totalCount}`
      : `${tasks.length}`;

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headerId}
      className={cn(
        'w-full md:w-[320px] shrink-0 flex flex-col',
        'bg-column-light dark:bg-column-dark',
        'border border-border-subtle-light dark:border-border-subtle-dark',
        'rounded-xl p-4 transition-all duration-200',
        isOver && !isDragDisabled && 'border-dashed border-sage bg-sage-soft/30 dark:bg-sage-dark-soft/30 ring-2 ring-sage/20',
        className
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-border-subtle-light/70 dark:border-border-subtle-dark/70">
        <div className="flex items-center gap-2">
          <h3
            id={headerId}
            className="text-xs font-semibold uppercase tracking-wider text-content-primary-light dark:text-content-primary-dark"
          >
            {column.title}
          </h3>
          <span
            className="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-subtle-light dark:bg-subtle-dark text-content-secondary-light dark:text-content-secondary-dark"
            aria-label={`${countDisplay} tasks`}
          >
            {countDisplay}
          </span>
        </div>

        {onAddTask && (
          <button
            type="button"
            onClick={() => onAddTask(column.id)}
            aria-label={`Add task to ${column.title}`}
            className="p-1 rounded text-content-secondary-light dark:text-content-secondary-dark hover:text-content-primary-light dark:hover:text-content-primary-dark hover:bg-subtle-light dark:hover:bg-subtle-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Task List / Empty State with Sortable Context */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 min-h-[120px] flex-1">
          {tasks.length === 0 ? (
            <ColumnEmptyState
              isFiltered={isFiltered}
              onResetFilters={onResetFilters}
              onAddTask={onAddTask ? () => onAddTask(column.id) : undefined}
            />
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={onTaskClick}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onMove={onMoveTask}
                isDragDisabled={isDragDisabled}
              />
            ))
          )}
        </div>
      </SortableContext>
    </section>
  );
}
