import { Priority } from '@/types/kanban';
import type { BadgeVariant } from '@/components/common/Badge';

/**
 * Maps task priority to corresponding Badge variant.
 */
export function getPriorityBadgeVariant(priority: Priority): BadgeVariant {
  switch (priority) {
    case 'high':
      return 'priority-high';
    case 'medium':
      return 'priority-medium';
    case 'low':
      return 'priority-low';
  }
}
