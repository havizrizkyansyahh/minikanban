import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  validateBoardState,
  loadBoardState,
  saveBoardState,
  STORAGE_KEY,
  STORAGE_BACKUP_PREFIX,
} from '@/utils/storage';
import { BoardState } from '@/types/kanban';
import { INITIAL_BOARD_STATE } from '@/constants/initialData';

describe('Storage Utility & Validation', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const validState: BoardState = {
    version: 1,
    tasks: {
      't-1': {
        id: 't-1',
        title: 'Task 1',
        description: 'Details',
        priority: 'high',
        columnId: 'todo',
        createdAt: 1000,
        updatedAt: 1000,
      },
    },
    columns: {
      todo: ['t-1'],
      'in-progress': [],
      done: [],
    },
  };

  describe('validateBoardState', () => {
    it('accepts a valid BoardState object', () => {
      const result = validateBoardState(validState);
      expect(result).not.toBeNull();
      expect(result?.tasks['t-1']?.title).toBe('Task 1');
      expect(result?.columns.todo).toEqual(['t-1']);
    });

    it('rejects non-object or null input', () => {
      expect(validateBoardState(null)).toBeNull();
      expect(validateBoardState('string')).toBeNull();
      expect(validateBoardState(123)).toBeNull();
    });

    it('rejects data with incompatible schema version', () => {
      const wrongVersion = { ...validState, version: 99 };
      expect(validateBoardState(wrongVersion)).toBeNull();
    });

    it('rejects data with missing columns structure', () => {
      const missingCols = { ...validState, columns: null };
      expect(validateBoardState(missingCols)).toBeNull();
    });

    it('sanitizes orphaned tasks and synchronizes column IDs', () => {
      const desyncedState = {
        version: 1,
        tasks: {
          't-1': {
            id: 't-1',
            title: 'Task 1',
            priority: 'low',
            columnId: 'todo',
            createdAt: 100,
            updatedAt: 100,
          },
        },
        columns: {
          todo: [], // Not listed in todo column
          'in-progress': ['t-1'], // Listed in in-progress column
          done: [],
        },
      };

      const result = validateBoardState(desyncedState);
      expect(result).not.toBeNull();
      // Should align columnId with column list
      expect(result?.tasks['t-1']?.columnId).toBe('in-progress');
      expect(result?.columns['in-progress']).toEqual(['t-1']);
    });

    it('globally deduplicates tasks that appear across multiple columns in corrupt data (M-1)', () => {
      const duplicateColumnState = {
        version: 1,
        tasks: {
          't-1': {
            id: 't-1',
            title: 'Task 1',
            priority: 'low',
            columnId: 'todo',
            createdAt: 100,
            updatedAt: 100,
          },
        },
        columns: {
          todo: ['t-1'],
          'in-progress': ['t-1'], // Corrupt duplicate reference
          done: ['t-1'],        // Corrupt duplicate reference
        },
      };

      const result = validateBoardState(duplicateColumnState);
      expect(result).not.toBeNull();
      // Should assign to the first encountered column and reject duplicates in subsequent columns
      expect(result?.columns.todo).toEqual(['t-1']);
      expect(result?.columns['in-progress']).toEqual([]);
      expect(result?.columns.done).toEqual([]);
      expect(result?.tasks['t-1']?.columnId).toBe('todo');
    });
  });

  describe('loadBoardState', () => {
    it('returns INITIAL_BOARD_STATE when storage is empty', () => {
      const state = loadBoardState();
      expect(state).toEqual(INITIAL_BOARD_STATE);
    });

    it('restores valid state from localStorage', () => {
      saveBoardState(validState);
      const loaded = loadBoardState();
      expect(loaded).toEqual(validState);
    });

    it('backs up corrupted data and returns INITIAL_BOARD_STATE without throwing', () => {
      const corruptJson = '{"version": 999, "corrupt": true}';
      localStorage.setItem(STORAGE_KEY, corruptJson);

      const loaded = loadBoardState();
      expect(loaded).toEqual(INITIAL_BOARD_STATE);

      // Check backup key was created
      const allKeys = Object.keys(localStorage);
      const backupKey = allKeys.find((k) => k.startsWith(STORAGE_BACKUP_PREFIX));
      expect(backupKey).toBeDefined();
      expect(localStorage.getItem(backupKey!)).toBe(corruptJson);
    });

    it('handles localStorage exceptions gracefully', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError: Access Denied');
      });

      const loaded = loadBoardState();
      expect(loaded).toEqual(INITIAL_BOARD_STATE);
    });
  });

  describe('saveBoardState', () => {
    it('persists serialized state to localStorage and returns true', () => {
      const success = saveBoardState(validState);
      expect(success).toBe(true);
      expect(localStorage.getItem(STORAGE_KEY)).toContain('"t-1"');
    });

    it('handles QuotaExceededError gracefully and returns false', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const success = saveBoardState(validState);
      expect(success).toBe(false);
    });
  });
});
