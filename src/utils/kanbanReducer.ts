import { BoardState, ColumnId, Priority, Task } from '@/types/kanban';
import { generateTaskId } from './id';

export type KanbanAction =
  | {
      type: 'ADD_TASK';
      payload: {
        title: string;
        description?: string;
        priority: Priority;
        columnId: ColumnId;
      };
    }
  | {
      type: 'EDIT_TASK';
      payload: {
        id: string;
        title: string;
        description?: string;
        priority: Priority;
        columnId: ColumnId;
      };
    }
  | {
      type: 'DELETE_TASK';
      payload: {
        id: string;
      };
    }
  | {
      type: 'MOVE_TASK';
      payload: {
        taskId: string;
        targetColumnId: ColumnId;
        targetIndex?: number;
      };
    }
  | {
      type: 'SET_BOARD';
      payload: {
        state: BoardState;
      };
    };

export function kanbanReducer(state: BoardState, action: KanbanAction): BoardState {
  switch (action.type) {
    case 'ADD_TASK': {
      const { title, description, priority, columnId } = action.payload;
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        return state;
      }

      const newId = generateTaskId();
      const now = Date.now();
      const newTask: Task = {
        id: newId,
        title: trimmedTitle,
        description: description?.trim() ? description.trim() : undefined,
        priority,
        columnId,
        createdAt: now,
        updatedAt: now,
      };

      const existingColumnTasks = state.columns[columnId] ?? [];

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [newId]: newTask,
        },
        columns: {
          ...state.columns,
          [columnId]: [...existingColumnTasks, newId],
        },
      };
    }

    case 'EDIT_TASK': {
      const { id, title, description, priority, columnId } = action.payload;
      const existingTask = state.tasks[id];
      if (!existingTask) {
        return state;
      }

      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        return state;
      }

      const now = Date.now();
      const updatedTask: Task = {
        ...existingTask,
        title: trimmedTitle,
        description: description?.trim() ? description.trim() : undefined,
        priority,
        columnId,
        updatedAt: now,
      };

      const oldColumnId = existingTask.columnId;
      const isColumnChanged = oldColumnId !== columnId;

      if (!isColumnChanged) {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [id]: updatedTask,
          },
        };
      }

      // Column changed: remove from old column and append to new column
      const oldColumnTasks = (state.columns[oldColumnId] ?? []).filter((taskId) => taskId !== id);
      const newColumnTasks = [...(state.columns[columnId] ?? []).filter((taskId) => taskId !== id), id];

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [id]: updatedTask,
        },
        columns: {
          ...state.columns,
          [oldColumnId]: oldColumnTasks,
          [columnId]: newColumnTasks,
        },
      };
    }

    case 'DELETE_TASK': {
      const { id } = action.payload;
      if (!state.tasks[id]) {
        return state;
      }

      const nextTasks = { ...state.tasks };
      delete nextTasks[id];

      // Remove from all column arrays to prevent orphaned references
      const nextColumns: Record<ColumnId, string[]> = {
        todo: (state.columns.todo ?? []).filter((taskId) => taskId !== id),
        'in-progress': (state.columns['in-progress'] ?? []).filter((taskId) => taskId !== id),
        done: (state.columns.done ?? []).filter((taskId) => taskId !== id),
      };

      return {
        ...state,
        tasks: nextTasks,
        columns: nextColumns,
      };
    }

    case 'MOVE_TASK': {
      const { taskId, targetColumnId, targetIndex } = action.payload;
      const task = state.tasks[taskId];
      if (!task) {
        return state;
      }

      const sourceColumnId = task.columnId;
      const sourceList = [...(state.columns[sourceColumnId] ?? [])];

      // If moving within the same column
      if (sourceColumnId === targetColumnId) {
        const currentIndex = sourceList.indexOf(taskId);
        if (currentIndex === -1) {
          return state;
        }

        const destinationIndex = targetIndex ?? sourceList.length - 1;
        if (currentIndex === destinationIndex) {
          return state;
        }

        // Reorder within the same list
        sourceList.splice(currentIndex, 1);
        sourceList.splice(destinationIndex, 0, taskId);

        return {
          ...state,
          columns: {
            ...state.columns,
            [sourceColumnId]: sourceList,
          },
        };
      }

      // Moving to a different column
      const targetList = [...(state.columns[targetColumnId] ?? [])];

      // Remove from source
      const filteredSourceList = sourceList.filter((id) => id !== taskId);

      // Clean existing target if already present (deduplication)
      const filteredTargetList = targetList.filter((id) => id !== taskId);

      // Insert at targetIndex or append to end
      if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= filteredTargetList.length) {
        filteredTargetList.splice(targetIndex, 0, taskId);
      } else {
        filteredTargetList.push(taskId);
      }

      const updatedTask: Task = {
        ...task,
        columnId: targetColumnId,
        updatedAt: Date.now(),
      };

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: updatedTask,
        },
        columns: {
          ...state.columns,
          [sourceColumnId]: filteredSourceList,
          [targetColumnId]: filteredTargetList,
        },
      };
    }

    case 'SET_BOARD': {
      return action.payload.state;
    }

    default:
      return state;
  }
}
