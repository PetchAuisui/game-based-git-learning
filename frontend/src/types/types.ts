// src/types/types.ts
// Shared TypeScript interfaces for level data (fetched from backend API).
// These replace the old imports from '@/data/levels'.

export type ActionType =
  | 'CMD'
  | 'GIT_INIT'
  | 'GIT_ADD'
  | 'GIT_ADD_ALL'
  | 'GIT_COMMIT'
  | 'GIT_BRANCH'
  | 'GIT_SWITCH'
  | 'GIT_RESET'
  | 'GIT_RESTORE'
  | 'GIT_MERGE';

/**
 * A single section within a level (as returned by GET /api/levels/:id).
 * NOTE: expectedCommand is never included — validation is server-side only.
 */
export interface LevelSection {
  id: string;
  conversations: { speaker: string; text: string }[];
  quest: string;
  hint: string;
  action: ActionType;
}

/**
 * Full level data as returned by GET /api/levels/:id.
 */
export interface Level {
  lvl: number;
  tag: string;
  name: string;
  sections: LevelSection[];
  levelIdx: number;
  totalLevels: number;
}

/**
 * Level metadata as returned by GET /api/levels (list view).
 */
export interface LevelMeta {
  levelIdx: number;
  lvl: number;
  tag: string;
  name: string;
  sectionCount: number;
  isUnlocked: boolean;
}

/**
 * File state for the virtual file system.
 */
export interface FileState {
  id: string;
  name: string;
  status: 'untracked' | 'staged' | 'committed' | 'deleted';
}

/**
 * Response from POST /api/levels/:id/validate
 */
export interface ValidateCommandResponse {
  correct: boolean;
  output: string[];
  newFiles?: FileState[];
}
