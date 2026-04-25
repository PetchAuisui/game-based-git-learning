// src/utils/gitEngine.ts
import { LevelSection } from '@/data/levels';

export interface FileState {
  id: string;
  name: string;
  status: 'untracked' | 'staged' | 'committed' | 'deleted';
}

export interface CommandResult {
  success: boolean;
  output: string[];
  newFiles?: FileState[];
}

/**
 * GitEngine (Logic Layer / "Backend")
 * Handles the simulation logic for Git commands and VFS updates.
 */
export const processGitCommand = (
  cmd: string, 
  section: LevelSection, 
  currentFiles: FileState[]
): CommandResult => {
  const cleanCmd = cmd.trim();
  let isCorrect = false;

  if (typeof section.expectedCommand === 'string') {
    isCorrect = cleanCmd === section.expectedCommand;
  } else {
    isCorrect = section.expectedCommand.test(cleanCmd);
  }

  if (isCorrect) {
    let output: string[] = [];
    let nextFiles = [...currentFiles];

    // Simulated Git output and VFS Effects
    if (cleanCmd.startsWith('git version')) {
      output = ['git version 2.40.1.windows.1'];
    } else if (cleanCmd.startsWith('git config')) {
      output = [];
    } else if (cleanCmd.startsWith('git init')) {
      output = ['Initialized empty Git repository in C:/Project/.git/'];
    } else if (cleanCmd.startsWith('git status')) {
      output = ['On branch main', '', 'No commits yet', ''];
      
      const untracked = nextFiles.filter(f => f.status === 'untracked');
      const staged = nextFiles.filter(f => f.status === 'staged');
      
      if (staged.length > 0) {
        output.push('Changes to be committed:');
        output.push('  (use "git rm --cached <file>..." to unstage)');
        staged.forEach(f => output.push(`        new file:   ${f.name}`));
        output.push('');
      }
      
      if (untracked.length > 0) {
        output.push('Untracked files:');
        output.push('  (use "git add <file>..." to include in what will be committed)');
        untracked.forEach(f => output.push(`        <span style="color:red">${f.name}</span>`));
        output.push('');
        output.push('nothing added to commit but untracked files present (use "git add" to track)');
      } else if (staged.length === 0) {
        output.push('nothing to commit (create/copy files and use "git add" to track)');
      }
    } else if (section.action === 'GIT_ADD' || section.action === 'GIT_ADD_ALL') {
      output = [];
      nextFiles = nextFiles.map(f => ({ ...f, status: 'staged' }));
    } else if (section.action === 'GIT_COMMIT') {
      output = [`[main (root-commit) 1a2b3c4] ${cleanCmd.includes('-m') ? cleanCmd.split('-m')[1] : 'Initial commit'}`, ` 1 file changed, 10 insertions(+)`, ` create mode 100644 index.html`];
      nextFiles = nextFiles.map(f => f.status === 'staged' ? { ...f, status: 'committed' } : f);
    } else if (section.action === 'GIT_RESTORE') {
      output = [];
      if (cleanCmd.includes('--staged')) {
        nextFiles = nextFiles.map(f => f.status === 'staged' ? { ...f, status: 'untracked' } : f);
      } else {
        nextFiles = nextFiles.map(f => f.name === 'index.html' ? { ...f, status: 'committed' } : f);
      }
    } else if (section.action === 'GIT_RESET') {
      output = ['Unstaged changes after reset:'];
      if (cleanCmd.includes('--mixed')) nextFiles = nextFiles.map(f => ({ ...f, status: 'untracked' }));
      if (cleanCmd.includes('--hard')) {
        output = ['HEAD is now at 1a2b3c4 Initial commit'];
        nextFiles = [];
      }
    }
    
    return { success: true, output, newFiles: nextFiles };
  } else {
    let errorOutput = [`fatal: Not a git repository`];
    if (cleanCmd.startsWith('git')) {
       errorOutput = [`git: '${cleanCmd.split(' ')[1]}' is not a git command. See 'git --help'.`];
    }
    return { success: false, output: errorOutput };
  }
};
