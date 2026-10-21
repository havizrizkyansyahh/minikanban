import { useState, useMemo, useCallback } from 'react';
import { Priority, Task } from '@/types/kanban';

export type PriorityFilterOption = 'all' | Priority;

export interface UseTaskFilterReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priorityFilter: PriorityFilterOption;
  setPriorityFilter: (priority: PriorityFilterOption) => void;
  isFilterActive: boolean;
  resetFilters: () => void;
  filterTasks: (tasks: Task[]) => Task[];
}

export function useTaskFilter(): UseTaskFilterReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilterOption>('all');

  const isFilterActive = useMemo(() => {
    return searchQuery.trim().length > 0 || priorityFilter !== 'all';
  }, [searchQuery, priorityFilter]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setPriorityFilter('all');
  }, []);

  const filterTasks = useCallback(
    (tasks: Task[]): Task[] => {
      const query = searchQuery.trim().toLowerCase();

      return tasks.filter((task) => {
        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
          return false;
        }

        // Text query search
        if (query) {
          const titleMatch = task.title.toLowerCase().includes(query);
          const descMatch = task.description ? task.description.toLowerCase().includes(query) : false;
          if (!titleMatch && !descMatch) {
            return false;
          }
        }

        return true;
      });
    },
    [searchQuery, priorityFilter]
  );

  return {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    isFilterActive,
    resetFilters,
    filterTasks,
  };
}
