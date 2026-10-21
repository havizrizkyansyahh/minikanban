import { BoardState } from '@/types/kanban';

export const INITIAL_BOARD_STATE: BoardState = {
  version: 1,
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Review project architectural requirements',
      description: 'Go through AGENTS.md and DESIGN.md to align on engineering standards.',
      priority: 'high',
      columnId: 'done',
      createdAt: Date.now() - 3600000 * 24,
      updatedAt: Date.now() - 3600000 * 20,
    },
    'task-2': {
      id: 'task-2',
      title: 'Establish design tokens and typography',
      description: 'Ensure warm off-white canvas and charcoal text tokens match specifications.',
      priority: 'medium',
      columnId: 'in-progress',
      createdAt: Date.now() - 3600000 * 12,
      updatedAt: Date.now() - 3600000 * 2,
    },
    'task-3': {
      id: 'task-3',
      title: 'Implement accessible drag-and-drop interactions',
      description: 'Verify keyboard navigation alternatives and pointer touch support.',
      priority: 'low',
      columnId: 'todo',
      createdAt: Date.now() - 3600000 * 4,
      updatedAt: Date.now() - 3600000 * 4,
    },
  },
  columns: {
    todo: ['task-3'],
    'in-progress': ['task-2'],
    done: ['task-1'],
  },
};
