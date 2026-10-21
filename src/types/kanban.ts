export type Priority = 'low' | 'medium' | 'high';

export type ColumnId = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  columnId: ColumnId;
  createdAt: number;
  updatedAt: number;
}

export interface Column {
  id: ColumnId;
  title: string;
  description?: string;
}

export interface BoardState {
  version: number;
  tasks: Record<string, Task>;
  columns: Record<ColumnId, string[]>;
}

export interface TaskFilter {
  searchQuery: string;
  priorityFilter: Priority | 'all';
}
