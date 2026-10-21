import { describe, it, expect } from 'vitest';
import { kanbanReducer } from '@/utils/kanbanReducer';
import { BoardState } from '@/types/kanban';

const createBaseState = (): BoardState => ({
  version: 1,
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Initial Task',
      description: 'Initial Description',
      priority: 'medium',
      columnId: 'todo',
      createdAt: 1000,
      updatedAt: 1000,
    },
  },
  columns: {
    todo: ['task-1'],
    'in-progress': [],
    done: [],
  },
});

describe('kanbanReducer', () => {
  describe('ADD_TASK', () => {
    it('creates a task with stable ID and appends to the target column', () => {
      const state = createBaseState();
      const nextState = kanbanReducer(state, {
        type: 'ADD_TASK',
        payload: {
          title: 'New Feature Work',
          description: 'Detailed specs',
          priority: 'high',
          columnId: 'in-progress',
        },
      });

      const taskIds = Object.keys(nextState.tasks);
      expect(taskIds).toHaveLength(2);

      const newTaskId = taskIds.find((id) => id !== 'task-1');
      expect(newTaskId).toBeDefined();

      const newTask = nextState.tasks[newTaskId!];
      expect(newTask).toMatchObject({
        title: 'New Feature Work',
        description: 'Detailed specs',
        priority: 'high',
        columnId: 'in-progress',
      });
      expect(nextState.columns['in-progress']).toContain(newTaskId);
    });

    it('ignores tasks with empty or whitespace-only titles', () => {
      const state = createBaseState();
      const nextState = kanbanReducer(state, {
        type: 'ADD_TASK',
        payload: {
          title: '   ',
          priority: 'low',
          columnId: 'todo',
        },
      });

      expect(nextState).toBe(state);
    });
  });

  describe('EDIT_TASK', () => {
    it('updates task properties within the same column', () => {
      const state = createBaseState();
      const nextState = kanbanReducer(state, {
        type: 'EDIT_TASK',
        payload: {
          id: 'task-1',
          title: 'Updated Title',
          description: 'Updated Description',
          priority: 'high',
          columnId: 'todo',
        },
      });

      expect(nextState.tasks['task-1']?.title).toBe('Updated Title');
      expect(nextState.tasks['task-1']?.description).toBe('Updated Description');
      expect(nextState.columns.todo).toEqual(['task-1']);
    });

    it('moves task between columns when columnId is changed during edit', () => {
      const state = createBaseState();
      const nextState = kanbanReducer(state, {
        type: 'EDIT_TASK',
        payload: {
          id: 'task-1',
          title: 'Moved to Done',
          priority: 'low',
          columnId: 'done',
        },
      });

      expect(nextState.tasks['task-1']?.columnId).toBe('done');
      expect(nextState.columns.todo).toEqual([]);
      expect(nextState.columns.done).toEqual(['task-1']);
    });

    it('returns unchanged state if task id is not found', () => {
      const state = createBaseState();
      const nextState = kanbanReducer(state, {
        type: 'EDIT_TASK',
        payload: {
          id: 'non-existent',
          title: 'Foo',
          priority: 'low',
          columnId: 'todo',
        },
      });

      expect(nextState).toBe(state);
    });
  });

  describe('DELETE_TASK', () => {
    it('removes task from dictionary and all column order arrays', () => {
      const state = createBaseState();
      const nextState = kanbanReducer(state, {
        type: 'DELETE_TASK',
        payload: { id: 'task-1' },
      });

      expect(nextState.tasks['task-1']).toBeUndefined();
      expect(nextState.columns.todo).toEqual([]);
    });

    it('returns unchanged state if task to delete does not exist', () => {
      const state = createBaseState();
      const nextState = kanbanReducer(state, {
        type: 'DELETE_TASK',
        payload: { id: 'unknown-task' },
      });

      expect(nextState).toBe(state);
    });
  });

  describe('MOVE_TASK', () => {
    it('moves task across columns cleanly', () => {
      const state = createBaseState();
      const nextState = kanbanReducer(state, {
        type: 'MOVE_TASK',
        payload: {
          taskId: 'task-1',
          targetColumnId: 'in-progress',
        },
      });

      expect(nextState.tasks['task-1']?.columnId).toBe('in-progress');
      expect(nextState.columns.todo).toEqual([]);
      expect(nextState.columns['in-progress']).toEqual(['task-1']);
    });

    it('reorders task within the same column at specified index', () => {
      const multiState: BoardState = {
        version: 1,
        tasks: {
          a: { id: 'a', title: 'A', priority: 'low', columnId: 'todo', createdAt: 0, updatedAt: 0 },
          b: { id: 'b', title: 'B', priority: 'low', columnId: 'todo', createdAt: 0, updatedAt: 0 },
          c: { id: 'c', title: 'C', priority: 'low', columnId: 'todo', createdAt: 0, updatedAt: 0 },
        },
        columns: {
          todo: ['a', 'b', 'c'],
          'in-progress': [],
          done: [],
        },
      };

      // Move 'a' to index 2 (end of array)
      const nextState = kanbanReducer(multiState, {
        type: 'MOVE_TASK',
        payload: {
          taskId: 'a',
          targetColumnId: 'todo',
          targetIndex: 2,
        },
      });

      expect(nextState.columns.todo).toEqual(['b', 'c', 'a']);
    });

    it('handles moving non-existent task gracefully', () => {
      const state = createBaseState();
      const nextState = kanbanReducer(state, {
        type: 'MOVE_TASK',
        payload: {
          taskId: 'ghost-task',
          targetColumnId: 'done',
        },
      });

      expect(nextState).toBe(state);
    });
  });
});
