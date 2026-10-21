import React, { useState, useMemo, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { FilterToolbar } from '@/components/layout/FilterToolbar';
import { Column } from '@/components/kanban/Column';
import { TaskCard } from '@/components/kanban/TaskCard';
import { TaskFormModal, TaskFormSubmitData } from '@/components/kanban/TaskFormModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DEFAULT_COLUMNS, COLUMN_IDS } from '@/constants/columns';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { useTaskFilter } from '@/hooks/useTaskFilter';
import { ColumnId, Task } from '@/types/kanban';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  Announcements,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export default function App(): React.JSX.Element {
  const {
    state,
    addTask,
    editTask,
    deleteTask,
    moveTask,
    getColumnTasks,
    getColumnCount,
    totalTaskCount,
  } = useKanbanBoard();

  const {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    isFilterActive,
    resetFilters,
    filterTasks,
  } = useTaskFilter();

  // Task form modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formDefaultColumnId, setFormDefaultColumnId] = useState<ColumnId>('todo');

  // Delete confirmation dialog state
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Active dragging task state for DragOverlay
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Configure DND sensors with distance/delay constraints to prevent accidental drag on click
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });

  // Disable dragging sensors completely when filters are active
  const sensors = useSensors(
    pointerSensor,
    touchSensor,
    keyboardSensor
  );

  const activeSensors = isFilterActive ? [] : sensors;

  // Custom screen-reader announcements
  const announcements: Announcements = useMemo(
    () => ({
      onDragStart({ active }) {
        const task = state.tasks[String(active.id)];
        return task
          ? `Picked up task "${task.title}" in column ${task.columnId}. Use arrow keys to move, Space to drop.`
          : 'Picked up task.';
      },
      onDragOver({ active, over }) {
        if (!over) return 'Task moved away from drop target.';
        const task = state.tasks[String(active.id)];
        const overId = String(over.id);
        const overColumn = COLUMN_IDS.includes(overId as ColumnId)
          ? overId
          : state.tasks[overId]?.columnId;
        return task && overColumn
          ? `Task "${task.title}" is over column ${overColumn}.`
          : 'Task is over a new position.';
      },
      onDragEnd({ active, over }) {
        const task = state.tasks[String(active.id)];
        if (!over) {
          return task ? `Dragging cancelled. Task "${task.title}" was not moved.` : 'Drag cancelled.';
        }
        const overId = String(over.id);
        const targetColumn = COLUMN_IDS.includes(overId as ColumnId)
          ? overId
          : state.tasks[overId]?.columnId;
        return task && targetColumn
          ? `Task "${task.title}" dropped into column ${targetColumn}.`
          : 'Task dropped.';
      },
      onDragCancel({ active }) {
        const task = state.tasks[String(active.id)];
        return task
          ? `Dragging cancelled. Task "${task.title}" returned to original position.`
          : 'Drag cancelled.';
      },
    }),
    [state.tasks]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = state.tasks[String(event.active.id)];
      if (task) {
        setActiveTask(task);
      }
    },
    [state.tasks]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const activeId = String(active.id);
      const overId = String(over.id);

      if (activeId === overId) return;

      const activeTaskItem = state.tasks[activeId];
      if (!activeTaskItem) return;

      // Case A: Dropped directly over a column container / empty column
      if (COLUMN_IDS.includes(overId as ColumnId)) {
        const targetColumnId = overId as ColumnId;
        const targetColumnList = state.columns[targetColumnId] ?? [];
        moveTask(activeId, targetColumnId, targetColumnList.length);
        return;
      }

      // Case B: Dropped over another task
      const overTaskItem = state.tasks[overId];
      if (overTaskItem) {
        const targetColumnId = overTaskItem.columnId;
        const targetIndex = (state.columns[targetColumnId] ?? []).indexOf(overId);
        moveTask(activeId, targetColumnId, targetIndex >= 0 ? targetIndex : undefined);
      }
    },
    [state.tasks, state.columns, moveTask]
  );

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
  }, []);

  const handleOpenCreateTask = (columnId: ColumnId = 'todo'): void => {
    setEditingTask(null);
    setFormDefaultColumnId(columnId);
    setIsFormModalOpen(true);
  };

  const handleOpenEditTask = (task: Task): void => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = (): void => {
    setIsFormModalOpen(false);
    setEditingTask(null);
  };

  const handleFormSubmit = (data: TaskFormSubmitData): void => {
    if (editingTask) {
      editTask(editingTask.id, data.title, data.description, data.priority, data.columnId);
    } else {
      addTask(data.title, data.description, data.priority, data.columnId);
    }
  };

  const handlePromptDeleteTask = (task: Task): void => {
    setDeletingTask(task);
  };

  const handleConfirmDelete = (): void => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  // Derive all filtered tasks count across the board
  const totalFilteredCount = useMemo(() => {
    let count = 0;
    for (const col of DEFAULT_COLUMNS) {
      const rawTasks = getColumnTasks(col.id);
      count += filterTasks(rawTasks).length;
    }
    return count;
  }, [getColumnTasks, filterTasks]);

  return (
    <div className="min-h-screen bg-canvas-light text-content-primary-light dark:bg-canvas-dark dark:text-content-primary-dark transition-colors duration-200 flex flex-col">
      {/* Primary Top Header */}
      <Header onNewTaskClick={() => handleOpenCreateTask('todo')} />

      {/* Main Board Surface */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {/* Workspace Title & Live Context */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-border-subtle-light/60 dark:border-border-subtle-dark/60 pb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-content-primary-light dark:text-content-primary-dark">
              Personal Workspace
            </h2>
            <p className="text-xs text-content-secondary-light dark:text-content-secondary-dark mt-0.5">
              Focus on one task at a time. Drag and drop to reorder, or use the task menu.
            </p>
          </div>
          <span className="text-xs font-mono text-content-secondary-light dark:text-content-secondary-dark">
            {totalTaskCount} {totalTaskCount === 1 ? 'task' : 'tasks'} &bull; 3 columns
          </span>
        </div>

        {/* Real-Time Search & Priority Filter Toolbar */}
        <FilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          isFilterActive={isFilterActive}
          onResetFilters={resetFilters}
          filteredCount={totalFilteredCount}
          totalCount={totalTaskCount}
        />

        {/* DND Context wrapping Kanban Columns */}
        <DndContext
          sensors={activeSensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          accessibility={{ announcements }}
        >
          {/* Board Track - Scrollable on mobile, flex row on desktop */}
          <div className="flex-1 flex gap-6 overflow-x-auto pb-6 items-start scroll-smooth">
            {DEFAULT_COLUMNS.map((col) => {
              const rawColumnTasks = getColumnTasks(col.id);
              const visibleTasks = filterTasks(rawColumnTasks);
              const totalColCount = getColumnCount(col.id);

              return (
                <Column
                  key={col.id}
                  column={col}
                  tasks={visibleTasks}
                  totalCount={totalColCount}
                  onAddTask={(colId) => handleOpenCreateTask(colId)}
                  onTaskClick={handleOpenEditTask}
                  onEditTask={handleOpenEditTask}
                  onDeleteTask={handlePromptDeleteTask}
                  onMoveTask={moveTask}
                  isDragDisabled={isFilterActive}
                  isFiltered={isFilterActive}
                  onResetFilters={resetFilters}
                />
              );
            })}
          </div>

          {/* Drag Overlay with tactile elevation & tilt */}
          <DragOverlay dropAnimation={null}>
            {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-border-subtle-light dark:border-border-subtle-dark py-4 px-4 sm:px-6 lg:px-8 bg-surface-light/40 dark:bg-surface-dark/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-content-secondary-light dark:text-content-secondary-dark">
          <p>© MiniKanban — Mindful Personal Task Manager</p>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Production Ready &bull; MIT License</span>
          </div>
        </div>
      </footer>

      {/* Create / Edit Task Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
        defaultColumnId={formDefaultColumnId}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
        isDestructive
      />
    </div>
  );
}
