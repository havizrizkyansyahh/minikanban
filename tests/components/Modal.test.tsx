import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '@/components/common/Modal';

describe('Modal Primitive', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Dialog">
        Content
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title, description and content when isOpen is true', () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Test Dialog"
        description="Helper instructions"
      >
        <p>Dialog Body</p>
      </Modal>
    );
    expect(screen.getByRole('dialog', { name: /Test Dialog/i })).toBeInTheDocument();
    expect(screen.getByText('Helper instructions')).toBeInTheDocument();
    expect(screen.getByText('Dialog Body')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Dialog">
        Body
      </Modal>
    );
    const closeBtn = screen.getByRole('button', { name: /Close dialog/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Dialog">
        Body
      </Modal>
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('prioritizes element with autofocus over the close button (M-2)', async () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Dialog">
        <input type="text" placeholder="Title" autoFocus data-testid="autofocus-input" />
      </Modal>
    );

    // Wait for the focus timer (50ms) to execute
    await new Promise((resolve) => setTimeout(resolve, 75));
    expect(screen.getByTestId('autofocus-input')).toHaveFocus();
  });

  it('restores focus to previous active element on close', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Open';
    document.body.appendChild(trigger);
    trigger.focus();
    expect(trigger).toHaveFocus();

    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Dialog">
        <p>Content</p>
      </Modal>
    );

    rerender(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Dialog">
        <p>Content</p>
      </Modal>
    );

    expect(trigger).toHaveFocus();
    document.body.removeChild(trigger);
  });
});
