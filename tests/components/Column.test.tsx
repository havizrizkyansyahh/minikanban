import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Column } from '@/components/kanban/Column';
import { Column as ColumnType, Task } from '@/types/kanban';

const mockColumn: ColumnType = {
  id: 'todo',
  title: 'To Do',
  description: 'Tasks pending',
};

const mockTasks: Task[] = [
  {
    id: 't-1',
    title: 'First task',
    priority: 'low',
    columnId: 'todo',
    createdAt: 100,
    updatedAt: 200,
  },
  {
    id: 't-2',
    title: 'Second task',
    priority: 'medium',
    columnId: 'todo',
    createdAt: 300,
    updatedAt: 400,
  },
];

describe('Column Component', () => {
  it('renders column title and task count', () => {
    render(<Column column={mockColumn} tasks={mockTasks} />);
    expect(screen.getByRole('heading', { name: /To Do/i })).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
  });

  it('renders empty state when tasks array is empty', () => {
    render(<Column column={mockColumn} tasks={[]} />);
    expect(screen.getByText(/No tasks here yet/i)).toBeInTheDocument();
  });

  it('calls onAddTask when quick add button is clicked', () => {
    const handleAdd = vi.fn();
    render(<Column column={mockColumn} tasks={mockTasks} onAddTask={handleAdd} />);
    const addBtn = screen.getByRole('button', { name: /Add task to To Do/i });
    fireEvent.click(addBtn);
    expect(handleAdd).toHaveBeenCalledWith('todo');
  });
});
