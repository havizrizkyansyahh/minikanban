import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { BoardState } from '@/types/kanban';

const testInitialState: BoardState = {
  version: 1,
  tasks: {
    'task-init': {
      id: 'task-init',
      title: 'Initial Task',
      priority: 'low',
      columnId: 'todo',
      createdAt: 100,
      updatedAt: 100,
    },
  },
  columns: {
    todo: ['task-init'],
    'in-progress': [],
    done: [],
  },
};

describe('useKanbanBoard Hook', () => {
  it('initializes with provided state and derives counts correctly', () => {
    const { result } = renderHook(() => useKanbanBoard(testInitialState));

    expect(result.current.totalTaskCount).toBe(1);
    expect(result.current.getColumnCount('todo')).toBe(1);
    expect(result.current.getColumnCount('in-progress')).toBe(0);
    expect(result.current.getColumnTasks('todo')).toHaveLength(1);
  });

  it('adds a task via addTask', () => {
    const { result } = renderHook(() => useKanbanBoard(testInitialState));

    act(() => {
      result.current.addTask('Second Task', 'Description', 'high', 'in-progress');
    });

    expect(result.current.totalTaskCount).toBe(2);
    expect(result.current.getColumnCount('in-progress')).toBe(1);
    const inProgressTasks = result.current.getColumnTasks('in-progress');
    expect(inProgressTasks[0]?.title).toBe('Second Task');
    expect(inProgressTasks[0]?.priority).toBe('high');
  });

  it('edits an existing task via editTask', () => {
    const { result } = renderHook(() => useKanbanBoard(testInitialState));

    act(() => {
      result.current.editTask('task-init', 'Edited Title', 'New description', 'medium', 'done');
    });

    expect(result.current.getColumnCount('todo')).toBe(0);
    expect(result.current.getColumnCount('done')).toBe(1);
    const doneTasks = result.current.getColumnTasks('done');
    expect(doneTasks[0]?.title).toBe('Edited Title');
    expect(doneTasks[0]?.priority).toBe('medium');
  });

  it('deletes an existing task via deleteTask', () => {
    const { result } = renderHook(() => useKanbanBoard(testInitialState));

    act(() => {
      result.current.deleteTask('task-init');
    });

    expect(result.current.totalTaskCount).toBe(0);
    expect(result.current.getColumnCount('todo')).toBe(0);
    expect(result.current.getColumnTasks('todo')).toEqual([]);
  });

  it('moves task between columns via moveTask', () => {
    const { result } = renderHook(() => useKanbanBoard(testInitialState));

    act(() => {
      result.current.moveTask('task-init', 'in-progress');
    });

    expect(result.current.getColumnCount('todo')).toBe(0);
    expect(result.current.getColumnCount('in-progress')).toBe(1);
  });
});
