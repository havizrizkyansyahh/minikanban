import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterToolbar } from '@/components/layout/FilterToolbar';

describe('FilterToolbar Component', () => {
  it('renders search input and priority filter pills', () => {
    render(
      <FilterToolbar
        searchQuery=""
        onSearchChange={vi.fn()}
        priorityFilter="all"
        onPriorityChange={vi.fn()}
        isFilterActive={false}
        onResetFilters={vi.fn()}
        filteredCount={3}
        totalCount={3}
      />
    );

    expect(screen.getByPlaceholderText(/Search tasks by title or description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^All$/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /^High$/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('triggers onSearchChange when user types in search box', () => {
    const handleSearch = vi.fn();
    render(
      <FilterToolbar
        searchQuery=""
        onSearchChange={handleSearch}
        priorityFilter="all"
        onPriorityChange={vi.fn()}
        isFilterActive={false}
        onResetFilters={vi.fn()}
        filteredCount={3}
        totalCount={3}
      />
    );

    const input = screen.getByPlaceholderText(/Search tasks by title or description/i);
    fireEvent.change(input, { target: { value: 'roadmap' } });
    expect(handleSearch).toHaveBeenCalledWith('roadmap');
  });

  it('triggers onPriorityChange when priority pill is clicked', () => {
    const handlePriority = vi.fn();
    render(
      <FilterToolbar
        searchQuery=""
        onSearchChange={vi.fn()}
        priorityFilter="all"
        onPriorityChange={handlePriority}
        isFilterActive={false}
        onResetFilters={vi.fn()}
        filteredCount={3}
        totalCount={3}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /^High$/i }));
    expect(handlePriority).toHaveBeenCalledWith('high');
  });

  it('renders reset button and DnD paused notice when filters are active', () => {
    const handleReset = vi.fn();
    render(
      <FilterToolbar
        searchQuery="bug"
        onSearchChange={vi.fn()}
        priorityFilter="high"
        onPriorityChange={vi.fn()}
        isFilterActive={true}
        onResetFilters={handleReset}
        filteredCount={1}
        totalCount={5}
      />
    );

    expect(screen.getByText(/Drag-and-drop reordering is paused while filters are active/i)).toBeInTheDocument();
    expect(screen.getByText(/Showing 1 of 5 tasks/i)).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /Reset all filters/i });
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
