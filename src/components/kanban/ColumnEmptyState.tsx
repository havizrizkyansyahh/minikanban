import React from 'react';
import { Plus, RotateCcw } from 'lucide-react';

export interface ColumnEmptyStateProps {
  onAddTask?: () => void;
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

export function ColumnEmptyState({
  onAddTask,
  isFiltered = false,
  onResetFilters,
}: ColumnEmptyStateProps): React.JSX.Element {
  return (
    <div className="border border-dashed border-border-strong-light dark:border-border-strong-dark/70 rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2 bg-surface-light/40 dark:bg-surface-dark/40 transition-colors">
      <p className="text-xs text-content-secondary-light dark:text-content-secondary-dark font-medium">
        {isFiltered ? 'No tasks match current filters' : 'No tasks here yet'}
      </p>

      {isFiltered && onResetFilters ? (
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 text-xs text-sage dark:text-sage-dark hover:underline font-medium px-2 py-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        >
          <RotateCcw className="w-3 h-3" aria-hidden="true" />
          <span>Reset filters</span>
        </button>
      ) : onAddTask ? (
        <button
          type="button"
          onClick={onAddTask}
          className="inline-flex items-center gap-1.5 text-xs text-sage dark:text-sage-dark hover:text-sage-hover font-medium px-2 py-1 rounded hover:bg-sage-soft dark:hover:bg-sage-dark-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Add a task</span>
        </button>
      ) : null}
    </div>
  );
}
