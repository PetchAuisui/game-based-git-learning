// src/data/levels.ts
import { level1 } from './levels/level1';
import { level2 } from './levels/level2';
import { level3 } from './levels/level3';
import { level4 } from './levels/level4';
import { level5 } from './levels/level5';
import { level6 } from './levels/level6';
import { level7 } from './levels/level7';
import { level8 } from './levels/level8';
import { level9 } from './levels/level9';
import { level10 } from './levels/level10';
import { level11 } from './levels/level11';
import { level12 } from './levels/level12';
import { level13 } from './levels/level13';
import { level14 } from './levels/level14';
import { level15 } from './levels/level15';

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

export interface LevelSection {
  id: string; // e.g. "1.1"
  conversations: { speaker: string, text: string }[];
  quest: string;
  hint: string;
  expectedCommand: RegExp | string;
  action: ActionType;
  vfsEffect?: any; // Virtual File System updates after success
}

export interface Level {
  lvl: number;
  tag: string;
  name: string;
  sections: LevelSection[];
}

export const LEVELS: Level[] = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
  level12,
  level13,
  level14,
  level15
];
