import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import App from '@/App';
import { TaskCard } from '@/components/kanban/TaskCard';
import { FilterToolbar } from '@/components/layout/FilterToolbar';
import { Modal } from '@/components/common/Modal';
import { Task } from '@/types/kanban';

const mockTask: Task = {
  id: 'task-a11y-1',
  title: 'Audit interface accessibility for WCAG 2.2 AA compliance',
  description: 'Ensure color contrast, focus visible rings, and screen-reader accessibility.',
  priority: 'high',
  columnId: 'in-progress',
  createdAt: 1000,
  updatedAt: 1000,
};

describe('Accessibility Automated Audits (WCAG 2.2 AA)', () => {
  it('App main view has no detectable accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it('TaskCard component has no accessibility violations', async () => {
    const { container } = render(<TaskCard task={mockTask} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it('FilterToolbar component has no accessibility violations', async () => {
    const { container } = render(
      <FilterToolbar
        searchQuery=""
        onSearchChange={() => {}}
        priorityFilter="all"
        onPriorityChange={() => {}}
        isFilterActive={false}
        onResetFilters={() => {}}
        filteredCount={3}
        totalCount={3}
      />
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it('FilterToolbar with active filters has no accessibility violations', async () => {
    const { container } = render(
      <FilterToolbar
        searchQuery="audit"
        onSearchChange={() => {}}
        priorityFilter="high"
        onPriorityChange={() => {}}
        isFilterActive={true}
        onResetFilters={() => {}}
        filteredCount={1}
        totalCount={3}
      />
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it('Modal component has no accessibility violations when open', async () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} title="Accessible Modal Test" description="Demonstrating focus trap and ARIA labels.">
        <p>Modal body content</p>
      </Modal>
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
