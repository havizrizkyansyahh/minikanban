import React from 'react';
import { Button } from '@/components/common/Button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Plus } from 'lucide-react';

export interface HeaderProps {
  onNewTaskClick: () => void;
}

export function Header({ onNewTaskClick }: HeaderProps): React.JSX.Element {
  return (
    <header className="border-b border-border-subtle-light dark:border-border-subtle-dark bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-xs sticky top-0 z-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center text-white font-semibold text-sm shadow-xs select-none">
            M
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-content-primary-light dark:text-content-primary-dark leading-none">
              MiniKanban
            </h1>
            <p className="text-xs text-content-secondary-light dark:text-content-secondary-dark mt-1 hidden sm:block">
              Mindful personal task manager
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Button
            variant="primary"
            size="sm"
            onClick={onNewTaskClick}
            aria-label="Create a new task"
            className="font-medium shadow-xs"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>New Task</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
