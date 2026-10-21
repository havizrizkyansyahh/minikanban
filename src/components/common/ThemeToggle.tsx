import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from './Button';
import { Sun, Moon } from 'lucide-react';

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps): React.JSX.Element {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={className}
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
          <span className="text-xs">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" aria-hidden="true" />
          <span className="text-xs">Dark</span>
        </>
      )}
    </Button>
  );
}
