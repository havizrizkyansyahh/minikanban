import { Column, ColumnId } from '@/types/kanban';

export const DEFAULT_COLUMNS: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    description: 'Tasks captured and ready to start',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    description: 'Tasks currently actively worked on',
  },
  {
    id: 'done',
    title: 'Done',
    description: 'Completed tasks',
  },
];

export const COLUMN_IDS: ColumnId[] = ['todo', 'in-progress', 'done'];
