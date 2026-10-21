import React from 'react';
import { PriorityFilterOption } from '@/hooks/useTaskFilter';
import { Search, X, RotateCcw, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priorityFilter: PriorityFilterOption;
  onPriorityChange: (priority: PriorityFilterOption) => void;
  isFilterActive: boolean;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

const PRIORITY_OPTIONS: { label: string; value: PriorityFilterOption }[] = [
  { label: 'All', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

export function FilterToolbar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  isFilterActive,
  onResetFilters,
  filteredCount,
  totalCount,
}: FilterToolbarProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 mb-6 bg-surface-light dark:bg-surface-dark border border-border-subtle-light dark:border-border-subtle-dark rounded-xl p-3.5 sm:p-4 shadow-card transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-content-muted">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            aria-label="Search tasks"
            className={cn(
              'w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-md transition-colors',
              'bg-canvas-light/60 dark:bg-canvas-dark/60 text-content-primary-light dark:text-content-primary-dark',
              'border border-border-strong-light dark:border-border-strong-dark',
              'placeholder:text-content-muted placeholder:opacity-80',
              'focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20'
            )}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-content-muted hover:text-content-primary-light dark:hover:text-content-primary-dark"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Priority Filter Pills & Reset */}
        <div className="flex items-center flex-wrap gap-2">
          <div
            role="group"
            aria-label="Filter tasks by priority"
            className="flex items-center gap-1 bg-column-light dark:bg-column-dark p-1 rounded-lg border border-border-subtle-light dark:border-border-subtle-dark"
          >
            {PRIORITY_OPTIONS.map((opt) => {
              const isSelected = priorityFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onPriorityChange(opt.value)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage',
                    isSelected
                      ? 'bg-surface-light dark:bg-surface-dark text-sage dark:text-sage-dark shadow-xs font-semibold'
                      : 'text-content-secondary-light dark:text-content-secondary-dark hover:text-content-primary-light dark:hover:text-content-primary-dark hover:bg-subtle-light/70 dark:hover:bg-subtle-dark/70'
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {isFilterActive && (
            <button
              type="button"
              onClick={onResetFilters}
              aria-label="Reset all filters"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-content-secondary-light dark:text-content-secondary-dark hover:text-content-primary-light dark:hover:text-content-primary-dark rounded-md hover:bg-subtle-light dark:hover:bg-subtle-dark border border-border-subtle-light dark:border-border-subtle-dark transition-colors"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Status & Notice Banner when Active */}
      {isFilterActive && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-border-subtle-light/70 dark:border-border-subtle-dark/70 text-xs">
          <div className="flex items-center gap-1.5 text-content-secondary-light dark:text-content-secondary-dark font-medium">
            <span>
              Showing {filteredCount} of {totalCount} {totalCount === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 px-2.5 py-0.5 rounded-md font-medium">
            <Info className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span>Drag-and-drop reordering is paused while filters are active.</span>
          </div>
        </div>
      )}
    </div>
  );
}
