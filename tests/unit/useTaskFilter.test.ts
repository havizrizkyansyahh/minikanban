import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTaskFilter } from '@/hooks/useTaskFilter';
import { Task } from '@/types/kanban';

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Deploy Vite application',
    description: 'Ensure asset hashing and production minify',
    priority: 'high',
    columnId: 'done',
    createdAt: 100,
    updatedAt: 100,
  },
  {
    id: '2',
    title: 'Write unit tests',
    description: 'Cover reducer edge cases with Vitest',
    priority: 'medium',
    columnId: 'in-progress',
    createdAt: 200,
    updatedAt: 200,
  },
  {
    id: '3',
    title: 'Improve accessibility contrast',
    description: 'Check color tokens against WCAG AA standards',
    priority: 'low',
    columnId: 'todo',
    createdAt: 300,
    updatedAt: 300,
  },
];

describe('useTaskFilter Hook', () => {
  it('returns all tasks when no filters are active', () => {
    const { result } = renderHook(() => useTaskFilter());

    expect(result.current.isFilterActive).toBe(false);
    expect(result.current.filterTasks(sampleTasks)).toHaveLength(3);
  });

  it('filters tasks by title case-insensitively', () => {
    const { result } = renderHook(() => useTaskFilter());

    act(() => {
      result.current.setSearchQuery('deploy');
    });

    expect(result.current.isFilterActive).toBe(true);
    const filtered = result.current.filterTasks(sampleTasks);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.title).toBe('Deploy Vite application');
  });

  it('filters tasks by description case-insensitively', () => {
    const { result } = renderHook(() => useTaskFilter());

    act(() => {
      result.current.setSearchQuery('wcag');
    });

    expect(result.current.isFilterActive).toBe(true);
    const filtered = result.current.filterTasks(sampleTasks);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.title).toBe('Improve accessibility contrast');
  });

  it('filters tasks by priority', () => {
    const { result } = renderHook(() => useTaskFilter());

    act(() => {
      result.current.setPriorityFilter('high');
    });

    expect(result.current.isFilterActive).toBe(true);
    const filtered = result.current.filterTasks(sampleTasks);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.priority).toBe('high');
  });

  it('combines search query and priority filter', () => {
    const { result } = renderHook(() => useTaskFilter());

    act(() => {
      result.current.setSearchQuery('test');
      result.current.setPriorityFilter('medium');
    });

    expect(result.current.isFilterActive).toBe(true);
    const filtered = result.current.filterTasks(sampleTasks);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.title).toBe('Write unit tests');
  });

  it('resets all filters when resetFilters is called', () => {
    const { result } = renderHook(() => useTaskFilter());

    act(() => {
      result.current.setSearchQuery('test');
      result.current.setPriorityFilter('low');
    });
    expect(result.current.isFilterActive).toBe(true);

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.isFilterActive).toBe(false);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.priorityFilter).toBe('all');
    expect(result.current.filterTasks(sampleTasks)).toHaveLength(3);
  });
});
