import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import { STORAGE_KEY } from '@/utils/storage';

describe('App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders application header and title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /MiniKanban/i, level: 1 })).toBeInTheDocument();
  });

  it('renders all three default Kanban columns with seeded tasks', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /To Do/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /In Progress/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Done/i, level: 3 })).toBeInTheDocument();

    // Verify seed tasks exist
    expect(screen.getByText('Review project architectural requirements')).toBeInTheDocument();
    expect(screen.getByText('Establish design tokens and typography')).toBeInTheDocument();
    expect(screen.getByText('Implement accessible drag-and-drop interactions')).toBeInTheDocument();
  });

  it('creates a new task via the New Task modal, updates board, and persists to localStorage', () => {
    render(<App />);

    // Open modal
    const newTaskBtn = screen.getByRole('button', { name: /Create a new task/i });
    fireEvent.click(newTaskBtn);

    const modal = screen.getByRole('dialog', { name: /Create New Task/i });

    // Fill out form
    const titleInput = within(modal).getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Write end-to-end tests' } });

    const descInput = within(modal).getByLabelText(/Description/i);
    fireEvent.change(descInput, { target: { value: 'Ensure coverage for all CRUD operations' } });

    // Select Urgent/High priority within modal
    const highPriorityBtn = within(modal).getByRole('button', { name: /^High$/i });
    fireEvent.click(highPriorityBtn);

    // Select target column: In Progress
    const columnSelect = within(modal).getByLabelText(/Column/i);
    fireEvent.change(columnSelect, { target: { value: 'in-progress' } });

    // Submit form
    const submitBtn = within(modal).getByRole('button', { name: /Create Task/i });
    fireEvent.click(submitBtn);

    // Modal should close
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Task should now appear in document
    expect(screen.getByText('Write end-to-end tests')).toBeInTheDocument();
    expect(screen.getByText('Ensure coverage for all CRUD operations')).toBeInTheDocument();

    // Verify persistent storage
    const storedRaw = localStorage.getItem(STORAGE_KEY);
    expect(storedRaw).toBeDefined();
    expect(storedRaw).toContain('Write end-to-end tests');
  });

  it('filters tasks in real-time by search query', () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText(/Search tasks by title or description/i);

    // Type query matching only one task
    fireEvent.change(searchInput, { target: { value: 'typography' } });

    // Matching task should remain visible
    expect(screen.getByText('Establish design tokens and typography')).toBeInTheDocument();

    // Non-matching tasks should not be in the visible board
    expect(screen.queryByText('Review project architectural requirements')).not.toBeInTheDocument();
    expect(screen.queryByText('Implement accessible drag-and-drop interactions')).not.toBeInTheDocument();

    // Clear search
    const clearBtn = screen.getByRole('button', { name: /Clear search query/i });
    fireEvent.click(clearBtn);

    // All tasks restored
    expect(screen.getByText('Review project architectural requirements')).toBeInTheDocument();
    expect(screen.getByText('Implement accessible drag-and-drop interactions')).toBeInTheDocument();
  });

  it('filters tasks by priority and displays notice when active', () => {
    render(<App />);

    // Click "Low" priority button in filter toolbar
    const lowPill = screen.getByRole('button', { name: /^Low$/i });
    fireEvent.click(lowPill);

    // Only low priority task should be visible
    expect(screen.getByText('Implement accessible drag-and-drop interactions')).toBeInTheDocument();
    expect(screen.queryByText('Review project architectural requirements')).not.toBeInTheDocument();

    // Notice that drag-and-drop is paused should be visible
    expect(screen.getByText(/Drag-and-drop reordering is paused while filters are active/i)).toBeInTheDocument();

    // Click "Reset"
    const resetBtn = screen.getByRole('button', { name: /Reset all filters/i });
    fireEvent.click(resetBtn);

    // Notice removed and all tasks restored
    expect(screen.queryByText(/Drag-and-drop reordering is paused while filters are active/i)).not.toBeInTheDocument();
    expect(screen.getByText('Review project architectural requirements')).toBeInTheDocument();
  });

  it('edits an existing task when clicked', () => {
    render(<App />);

    // Click on seed task
    const cardTitle = screen.getByText('Establish design tokens and typography');
    fireEvent.click(cardTitle);

    // Modal opens in Edit mode
    expect(screen.getByRole('dialog', { name: /Edit Task/i })).toBeInTheDocument();
    const titleInput = screen.getByLabelText(/Title/i);
    expect(titleInput).toHaveValue('Establish design tokens and typography');

    // Update title
    fireEvent.change(titleInput, { target: { value: 'Refined design tokens and typography' } });

    // Save changes
    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtn);

    // Verify updated title renders on board
    expect(screen.getByText('Refined design tokens and typography')).toBeInTheDocument();
  });

  it('moves task between columns using the accessible action menu', () => {
    render(<App />);

    // Open action menu for "Implement accessible drag-and-drop interactions"
    const menuBtn = screen.getByRole('button', {
      name: /Task actions for Implement accessible drag-and-drop interactions/i,
    });
    fireEvent.click(menuBtn);

    // Click "Done" menuitem
    const moveToDoneBtn = screen.getByRole('menuitem', { name: /^Done$/i });
    fireEvent.click(moveToDoneBtn);

    // The task should now be moved to Done column
    const doneColumn = screen.getByRole('heading', { name: /Done/i, level: 3 }).closest('section');
    expect(doneColumn).toContainElement(
      screen.getByText('Implement accessible drag-and-drop interactions')
    );
  });

  it('deletes a task with confirmation safeguard', () => {
    render(<App />);

    const taskTitle = 'Review project architectural requirements';
    expect(screen.getByText(taskTitle)).toBeInTheDocument();

    // Open action menu
    const menuBtn = screen.getByRole('button', {
      name: new RegExp(`Task actions for ${taskTitle}`, 'i'),
    });
    fireEvent.click(menuBtn);

    // Click "Delete task" menuitem
    const deleteMenuBtn = screen.getByRole('menuitem', { name: /Delete task/i });
    fireEvent.click(deleteMenuBtn);

    // Confirmation dialog appears
    expect(screen.getByRole('dialog', { name: /Delete Task/i })).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`Are you sure you want to delete "${taskTitle}"`, 'i'))
    ).toBeInTheDocument();

    // Click confirm delete
    const confirmBtn = screen.getByRole('button', { name: /^Delete Task$/i });
    fireEvent.click(confirmBtn);

    // Dialog closes and task is gone
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText(taskTitle)).not.toBeInTheDocument();
  });

  it('toggles dark mode theme', () => {
    render(<App />);
    const toggleButton = screen.getByRole('button', {
      name: /Switch to dark theme|Switch to light theme/i,
    });

    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
