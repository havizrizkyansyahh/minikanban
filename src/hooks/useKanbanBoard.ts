import { useReducer, useCallback, useMemo, useEffect } from 'react';
import { BoardState, ColumnId, Priority, Task } from '@/types/kanban';
import { kanbanReducer } from '@/utils/kanbanReducer';
import { loadBoardState, saveBoardState } from '@/utils/storage';

export interface UseKanbanBoardReturn {
  state: BoardState;
  addTask: (title: string, description: string | undefined, priority: Priority, columnId: ColumnId) => void;
  editTask: (id: string, title: string, description: string | undefined, priority: Priority, columnId: ColumnId) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetColumnId: ColumnId, targetIndex?: number) => void;
  getColumnTasks: (columnId: ColumnId) => Task[];
  getColumnCount: (columnId: ColumnId) => number;
  totalTaskCount: number;
}

export function useKanbanBoard(initialState?: BoardState): UseKanbanBoardReturn {
  const [state, dispatch] = useReducer(
    kanbanReducer,
    initialState,
    (init) => init ?? loadBoardState()
  );

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveBoardState(state);
  }, [state]);

  const addTask = useCallback(
    (title: string, description: string | undefined, priority: Priority, columnId: ColumnId) => {
      dispatch({
        type: 'ADD_TASK',
        payload: { title, description, priority, columnId },
      });
    },
    []
  );

  const editTask = useCallback(
    (id: string, title: string, description: string | undefined, priority: Priority, columnId: ColumnId) => {
      dispatch({
        type: 'EDIT_TASK',
        payload: { id, title, description, priority, columnId },
      });
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    dispatch({
      type: 'DELETE_TASK',
      payload: { id },
    });
  }, []);

  const moveTask = useCallback((taskId: string, targetColumnId: ColumnId, targetIndex?: number) => {
    dispatch({
      type: 'MOVE_TASK',
      payload: { taskId, targetColumnId, targetIndex },
    });
  }, []);

  const getColumnTasks = useCallback(
    (columnId: ColumnId): Task[] => {
      const taskIds = state.columns[columnId] ?? [];
      const tasks: Task[] = [];
      for (const id of taskIds) {
        const task = state.tasks[id];
        if (task) {
          tasks.push(task);
        }
      }
      return tasks;
    },
    [state.columns, state.tasks]
  );

  const getColumnCount = useCallback(
    (columnId: ColumnId): number => {
      return (state.columns[columnId] ?? []).length;
    },
    [state.columns]
  );

  const totalTaskCount = useMemo(() => {
    return Object.keys(state.tasks).length;
  }, [state.tasks]);

  return {
    state,
    addTask,
    editTask,
    deleteTask,
    moveTask,
    getColumnTasks,
    getColumnCount,
    totalTaskCount,
  };
}
