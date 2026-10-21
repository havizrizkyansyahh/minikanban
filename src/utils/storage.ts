import { BoardState, ColumnId, Priority, Task } from '@/types/kanban';
import { INITIAL_BOARD_STATE } from '@/constants/initialData';

export const STORAGE_KEY = 'minikanban_state_v1';
export const STORAGE_BACKUP_PREFIX = 'minikanban_backup_';
export const CURRENT_SCHEMA_VERSION = 1;

const VALID_PRIORITIES = new Set<Priority>(['low', 'medium', 'high']);
const VALID_COLUMNS = new Set<ColumnId>(['todo', 'in-progress', 'done']);

/**
 * Validates untrusted or malformed stored data at runtime.
 * Returns a normalized BoardState if valid, or null if corrupt / incompatible.
 */
export function validateBoardState(raw: unknown): BoardState | null {
  if (typeof raw !== 'object' || raw === null) {
    return null;
  }

  const candidate = raw as Partial<BoardState>;

  // Check version compatibility
  if (candidate.version !== CURRENT_SCHEMA_VERSION) {
    return null;
  }

  if (typeof candidate.tasks !== 'object' || candidate.tasks === null) {
    return null;
  }

  if (typeof candidate.columns !== 'object' || candidate.columns === null) {
    return null;
  }

  // Validate columns structure
  const rawColumns = candidate.columns as Record<string, unknown>;
  if (!Array.isArray(rawColumns.todo) || !Array.isArray(rawColumns['in-progress']) || !Array.isArray(rawColumns.done)) {
    return null;
  }

  // Validate tasks dictionary
  const validTasks: Record<string, Task> = {};
  for (const [id, taskRaw] of Object.entries(candidate.tasks)) {
    if (typeof taskRaw !== 'object' || taskRaw === null) {
      continue;
    }
    const t = taskRaw as Partial<Task>;
    if (
      typeof t.id === 'string' &&
      typeof t.title === 'string' &&
      t.title.trim().length > 0 &&
      typeof t.priority === 'string' &&
      VALID_PRIORITIES.has(t.priority as Priority) &&
      typeof t.columnId === 'string' &&
      VALID_COLUMNS.has(t.columnId as ColumnId) &&
      typeof t.createdAt === 'number' &&
      typeof t.updatedAt === 'number'
    ) {
      validTasks[id] = {
        id: t.id,
        title: t.title.trim(),
        description: typeof t.description === 'string' ? t.description : undefined,
        priority: t.priority as Priority,
        columnId: t.columnId as ColumnId,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      };
    }
  }

  // Reconstruct column arrays ensuring referential integrity and global deduplication
  const globalSeen = new Set<string>();
  const sanitizeColumn = (colId: ColumnId, ids: unknown[]): string[] => {
    const sanitized: string[] = [];
    for (const item of ids) {
      if (typeof item === 'string' && validTasks[item] && !globalSeen.has(item)) {
        globalSeen.add(item);
        // Ensure task columnId matches current column
        const task = validTasks[item];
        if (task) {
          task.columnId = colId;
        }
        sanitized.push(item);
      }
    }
    return sanitized;
  };

  const cleanColumns: Record<ColumnId, string[]> = {
    todo: sanitizeColumn('todo', rawColumns.todo),
    'in-progress': sanitizeColumn('in-progress', rawColumns['in-progress']),
    done: sanitizeColumn('done', rawColumns.done),
  };

  // Ensure any orphaned valid tasks are placed into their column
  for (const [id, task] of Object.entries(validTasks)) {
    const colList = cleanColumns[task.columnId];
    if (!colList.includes(id)) {
      colList.push(id);
    }
  }

  return {
    version: CURRENT_SCHEMA_VERSION,
    tasks: validTasks,
    columns: cleanColumns,
  };
}

/**
 * Loads board state from localStorage with validation.
 * Falls back to INITIAL_BOARD_STATE if empty or corrupted.
 * Preserves corrupt data in a backup key.
 */
export function loadBoardState(storage: Storage = localStorage): BoardState {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_BOARD_STATE;
    }

    const parsed: unknown = JSON.parse(raw);
    const validated = validateBoardState(parsed);

    if (validated) {
      return validated;
    }

    // Incompatible or corrupt data found: preserve in backup before falling back
    try {
      const backupKey = `${STORAGE_BACKUP_PREFIX}${Date.now()}`;
      storage.setItem(backupKey, raw);
      console.warn(`[MiniKanban] Corrupt or incompatible storage state preserved to ${backupKey}.`);
    } catch {
      // Ignore backup save error if storage is full
    }

    return INITIAL_BOARD_STATE;
  } catch (error) {
    console.warn('[MiniKanban] Failed to load board state from storage:', error);
    return INITIAL_BOARD_STATE;
  }
}

/**
 * Persists board state to localStorage safely.
 */
export function saveBoardState(state: BoardState, storage: Storage = localStorage): boolean {
  try {
    const serialized = JSON.stringify(state);
    storage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.warn('[MiniKanban] Failed to persist board state to storage:', error);
    return false;
  }
}
