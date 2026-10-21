import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskCard } from '@/components/kanban/TaskCard';
import { Task } from '@/types/kanban';

const mockTask: Task = {
  id: 'task-1',
  title: 'Sample task for testing',
  description: 'Detailed description for testing card',
  priority: 'high',
  columnId: 'todo',
  createdAt: 1000,
  updatedAt: 2000,
};

describe('TaskCard Presentation', () => {
  it('renders task title, priority, and description', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Sample task for testing')).toBeInTheDocument();
    expect(screen.getByText('Detailed description for testing card')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('triggers onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<TaskCard task={mockTask} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('article'));
    expect(handleClick).toHaveBeenCalledWith(mockTask);
  });

  it('triggers onClick on Enter keypress for keyboard accessibility', () => {
    const handleClick = vi.fn();
    render(<TaskCard task={mockTask} onClick={handleClick} />);
    const card = screen.getByRole('article');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledWith(mockTask);
  });
});
