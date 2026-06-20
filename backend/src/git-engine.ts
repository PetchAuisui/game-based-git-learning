import git from 'isomorphic-git';
import { promises as fs, existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';
import { vol } from 'memfs';
import { v4 as uuidv4 } from 'uuid';

interface Commit {
  id: string;
  message: string;
  hash: string;
  parent: string | null;
  timestamp: number;
}

interface GitGraph {
  nodes: Array<{
    id: string;
    label: string;
    hash: string;
    parent: string | null;
  }>;
  branches: Record<string, string>;
  head: string;
  currentBranch: string;
}

interface CommandResult {
  success: boolean;
  output: string;
  error?: string;
  gitGraph?: GitGraph;
  files?: Array<{ path: string; content: string; status: 'untracked' | 'staged' | 'committed' | 'modified' | 'deleted' }>;
}

function getGitStatus(head: number, workdir: number, stage: number): 'untracked' | 'staged' | 'committed' | 'modified' | 'deleted' {
  if (head === 0) {
    if (stage === 0) return 'untracked';
    if (stage === 2) return 'staged';
  }
  if (head === 1) {
    if (workdir === 0) {
      if (stage === 0) return 'staged';
      return 'deleted';
    }
    if (workdir === 1 && stage === 1) {
      return 'committed';
    }
    if (workdir === 2) {
      if (stage === 1) return 'modified';
      if (stage === 2) return 'staged';
    }
  }
  return 'untracked';
}

export class GitEngine {
  private memfs = vol; // In-memory file system
  private gitDir = '/.git';
  private commits: Map<string, Commit> = new Map();
  private currentBranch = 'main';
  private branches: Map<string, string> = new Map();
  private HEAD = 'detached';
  private commitCounter = 0;
  private stateFilePath = path.join(process.cwd(), 'data', 'sandbox-state.json');
  private isGitInitialized = false;

  constructor() {
    this.initialize();
  }

  get isInitialized(): boolean {
    return this.isGitInitialized;
  }

  private loadState(): boolean {
    try {
      if (existsSync(this.stateFilePath)) {
        const stateStr = readFileSync(this.stateFilePath, 'utf8');
        const state = JSON.parse(stateStr);
        this.memfs.fromJSON(state.fs);
        
        this.commits = new Map(state.commits);
        this.branches = new Map(state.branches);
        this.currentBranch = state.currentBranch;
        this.commitCounter = state.commitCounter;
        this.isGitInitialized = state.isGitInitialized ?? true;
        return true;
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
    return false;
  }

  private saveState(): void {
    try {
      const state = {
        fs: this.memfs.toJSON(),
        commits: Array.from(this.commits.entries()),
        branches: Array.from(this.branches.entries()),
        currentBranch: this.currentBranch,
        commitCounter: this.commitCounter,
        isGitInitialized: this.isGitInitialized
      };
      
      const dir = path.dirname(this.stateFilePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      
      writeFileSync(this.stateFilePath, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  private async initialize() {
    if (this.loadState()) {
      return;
    }

    // Set up memfs with initial structure
    this.memfs.reset();
    this.isGitInitialized = false;
  }

  async executeCommand(command: string): Promise<CommandResult> {
    const trimmed = command.trim();
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];

    try {
      let result: CommandResult;
      if (cmd === 'git') {
        result = await this.handleGitCommand(parts.slice(1));
      } else if (cmd === 'echo' || cmd === 'touch' || cmd === 'mkdir') {
        result = await this.handleFileCommand(parts);
      } else if (cmd === 'ls' || cmd === 'pwd') {
        result = await this.handleShellCommand(parts);
      } else {
        result = {
          success: false,
          output: '',
          error: `Unknown command: ${cmd}`,
        };
      }
      
      if (result.success && cmd !== 'ls' && cmd !== 'pwd' && cmd !== 'git log' && cmd !== 'git status' && cmd !== 'git show' && cmd !== 'git branch' && cmd !== 'git version') {
         // Some commands don't mutate state, but it's safe to just save if it's a success
         this.saveState();
      }
      return result;
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async handleGitCommand(args: string[]): Promise<CommandResult> {
    const subcommand = args[0];

    if (!this.isGitInitialized && subcommand !== 'init') {
      return {
        success: false,
        output: '',
        error: 'fatal: not a git repository (or any of the parent directories): .git',
      };
    }

    switch (subcommand) {
      case 'init':
        return await this.gitInit();
      case 'add':
        return await this.gitAdd(args.slice(1));
      case 'commit':
        return await this.gitCommit(args.slice(1));
      case 'log':
        return await this.gitLog(args.slice(1));
      case 'status':
        return await this.gitStatus();
      case 'branch':
        return await this.gitBranch(args.slice(1));
      case 'checkout':
        return await this.gitCheckout(args.slice(1));
      case 'show':
        return await this.gitShow(args.slice(1));
      case 'version':
        return {
          success: true,
          output: 'git version 2.39.2 (Sandbox Engine)',
          gitGraph: this.getGitGraph(),
          files: await this.getFiles(),
        };
      default:
        return {
          success: false,
          output: '',
          error: `Unknown git subcommand: ${subcommand}`,
        };
    }
  }

  private async gitInit(): Promise<CommandResult> {
    try {
      await git.init({
        fs: this.memfs as any,
        dir: '/',
      });

      this.isGitInitialized = true;
      this.branches.set('main', 'HEAD~0');

      return {
        success: true,
        output: 'Initialized empty Git repository',
        gitGraph: this.getGitGraph(),
        files: await this.getFiles(),
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: 'Repository already initialized',
      };
    }
  }

  private async gitAdd(args: string[]): Promise<CommandResult> {
    try {
      const filePattern = args[0] || '.';

      if (filePattern === '.') {
        // Add all files
        const files = await this.getAllFiles('/');
        for (const file of files) {
          if (!file.startsWith('/.git')) {
            await git.add({
              fs: this.memfs as any,
              dir: '/',
              filepath: file.substring(1),
            });
          }
        }
        return {
          success: true,
          output: `Added ${files.length} files to staging area`,
          gitGraph: this.getGitGraph(),
          files: await this.getFiles(),
        };
      } else {
        // Add specific file
        await git.add({
          fs: this.memfs as any,
          dir: '/',
          filepath: filePattern,
        });

        return {
          success: true,
          output: `Added '${filePattern}' to staging area`,
          gitGraph: this.getGitGraph(),
          files: await this.getFiles(),
        };
      }
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Failed to add files',
      };
    }
  }

  private async gitCommit(args: string[]): Promise<CommandResult> {
    try {
      let message = 'Commit';
      const mIndex = args.indexOf('-m');

      if (mIndex !== -1 && args[mIndex + 1]) {
        message = args[mIndex + 1].replace(/^["']|["']$/g, '');
      }

      const sha = await git.commit({
        fs: this.memfs as any,
        dir: '/',
        message: message,
        author: {
          name: 'Sandbox User',
          email: 'user@sandbox.local',
        },
      });

      const commitId = sha.substring(0, 8);
      const currentPointer = this.branches.get(this.currentBranch);
      const parentId = currentPointer === 'HEAD~0' ? null : (currentPointer || null);
      
      this.commits.set(commitId, {
        id: commitId,
        message: message,
        hash: commitId,
        parent: parentId,
        timestamp: Date.now(),
      });

      // Update the branch to point to the new commit
      this.branches.set(this.currentBranch, commitId);

      return {
        success: true,
        output: `[${this.currentBranch} ${commitId.substring(0, 7)}] ${message}`,
        gitGraph: this.getGitGraph(),
        files: await this.getFiles(),
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Failed to commit',
      };
    }
  }

  private async gitLog(args: string[]): Promise<CommandResult> {
    try {
      const commits = await git.log({
        fs: this.memfs as any,
        dir: '/',
        depth: 10,
      });

      let output = '';
      commits.forEach((commit: any, index: number) => {
        output += `commit ${commit.oid}\n`;
        output += `Author: Sandbox User <user@sandbox.local>\n`;
        output += `Date: ${new Date(commit.commit.committer.timestamp * 1000).toLocaleString()}\n\n`;
        output += `    ${commit.commit.message}\n\n`;
      });

      return {
        success: true,
        output: output || 'No commits yet',
        gitGraph: this.getGitGraph(),
        files: await this.getFiles(),
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Failed to get log',
      };
    }
  }

  private async gitStatus(): Promise<CommandResult> {
    try {
      const status = await git.statusMatrix({
        fs: this.memfs as any,
        dir: '/',
      });

      let output = `On branch ${this.currentBranch}\n\n`;
      let untracked: string[] = [];
      let modified: string[] = [];
      let staged: string[] = [];

      status.forEach(([filepath, headStatus, workdirStatus, stageStatus]) => {
        // [0, 2, 0] untracked
        if (headStatus === 0 && workdirStatus === 2 && stageStatus === 0) {
          untracked.push(filepath);
        } 
        // [0, 2, 2] added and staged
        else if (headStatus === 0 && stageStatus === 2) {
          staged.push(filepath);
        }
        // [1, 2, 1] modified but unstaged
        else if (headStatus === 1 && workdirStatus === 2 && stageStatus === 1) {
          modified.push(filepath);
        }
        // [1, 2, 2] modified and staged
        else if (headStatus === 1 && stageStatus === 2) {
          staged.push(filepath);
        }
        // [1, 0, 1] deleted but unstaged
        else if (headStatus === 1 && workdirStatus === 0 && stageStatus === 1) {
          modified.push(filepath);
        }
        // [1, 0, 0] deleted and staged
        else if (headStatus === 1 && workdirStatus === 0 && stageStatus === 0) {
          staged.push(filepath);
        }
      });

      if (staged.length > 0) {
        output += `Changes to be committed:\n`;
        staged.forEach((f) => (output += `  new file: ${f}\n`));
        output += '\n';
      }

      if (modified.length > 0) {
        output += `Changes not staged for commit:\n`;
        modified.forEach((f) => (output += `  modified: ${f}\n`));
        output += '\n';
      }

      if (untracked.length > 0) {
        output += `Untracked files:\n`;
        untracked.forEach((f) => (output += `  ${f}\n`));
      }

      return {
        success: true,
        output: output || 'nothing to commit, working tree clean',
        gitGraph: this.getGitGraph(),
        files: await this.getFiles(),
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Failed to get status',
      };
    }
  }

  private async gitBranch(args: string[]): Promise<CommandResult> {
    try {
      if (args.length === 0) {
        // List branches
        let output = '';
        for (const [branch, _] of this.branches) {
          const prefix = branch === this.currentBranch ? '* ' : '  ';
          output += `${prefix}${branch}\n`;
        }
        return {
          success: true,
          output: output || 'No branches',
          gitGraph: this.getGitGraph(),
          files: await this.getFiles(),
        };
      } else {
        // Create new branch
        const newBranch = args[0];
        const currentPointer = this.branches.get(this.currentBranch) || 'HEAD~0';
        this.branches.set(newBranch, currentPointer);
        return {
          success: true,
          output: `Created branch '${newBranch}'`,
          gitGraph: this.getGitGraph(),
          files: await this.getFiles(),
        };
      }
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Failed to execute branch command',
      };
    }
  }

  private async gitCheckout(args: string[]): Promise<CommandResult> {
    try {
      const target = args[0];

      if (!target) {
        return {
          success: false,
          output: '',
          error: 'checkout requires a branch name',
        };
      }

      if (args.includes('-b')) {
        // Create and checkout new branch
        const currentPointer = this.branches.get(this.currentBranch) || 'HEAD~0';
        this.branches.set(target, currentPointer);
        this.currentBranch = target;
      } else if (this.branches.has(target)) {
        this.currentBranch = target;
      } else {
        return {
          success: false,
          output: '',
          error: `Branch '${target}' not found`,
        };
      }

      return {
        success: true,
        output: `Switched to branch '${target}'`,
        gitGraph: this.getGitGraph(),
        files: await this.getFiles(),
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Failed to checkout',
      };
    }
  }

  private async gitShow(args: string[]): Promise<CommandResult> {
    try {
      const log = await git.log({
        fs: this.memfs as any,
        dir: '/',
        depth: 1,
      });

      if (log.length === 0) {
        return {
          success: false,
          output: '',
          error: 'No commits yet',
        };
      }

      const commit = log[0];
      let output = `commit ${commit.oid}\n`;
      output += `Author: Sandbox User <user@sandbox.local>\n`;
      output += `Date: ${new Date(commit.commit.committer.timestamp * 1000).toLocaleString()}\n\n`;
      output += `    ${commit.commit.message}\n`;

      return {
        success: true,
        output,
        gitGraph: this.getGitGraph(),
        files: await this.getFiles(),
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Failed to show commit',
      };
    }
  }

  private async handleFileCommand(parts: string[]): Promise<CommandResult> {
    const cmd = parts[0];

    if (cmd === 'touch') {
      const filename = parts[1];
      if (!filename) {
        return { success: false, output: '', error: 'Filename required' };
      }
      this.writeFile(filename, '');
      return {
        success: true,
        output: `Created file '${filename}'`,
        files: await this.getFiles(),
      };
    } else if (cmd === 'echo') {
      let content = parts.slice(1).join(' ');
      const redirectIndex = content.indexOf('>');

      if (redirectIndex !== -1) {
        const filename = content.substring(redirectIndex + 1).trim();
        content = content.substring(0, redirectIndex).trim().replace(/^['"]|['"]$/g, '');
        this.writeFile(filename, content);
        return {
          success: true,
          output: `Written to '${filename}'`,
          files: await this.getFiles(),
        };
      }

      return { success: true, output: content, files: await this.getFiles() };
    } else if (cmd === 'mkdir') {
      const dirname = parts[1];
      if (!dirname) {
        return { success: false, output: '', error: 'Directory name required' };
      }
      // In memfs, directories are implicit when creating files
      return {
        success: true,
        output: `Created directory '${dirname}'`,
        files: await this.getFiles(),
      };
    }

    return { success: false, output: '', error: `Unknown file command: ${cmd}` };
  }

  private async handleShellCommand(parts: string[]): Promise<CommandResult> {
    const cmd = parts[0];

    if (cmd === 'ls') {
      const dir = parts[1] || '/';
      try {
        const entries = this.memfs.readdirSync(dir) as string[];
        const output = entries.filter((e) => !e.startsWith('.')).join('\n');
        return { success: true, output, files: await this.getFiles() };
      } catch (error) {
        return {
          success: false,
          output: '',
          error: `ls: cannot access '${dir}': No such file or directory`,
        };
      }
    } else if (cmd === 'pwd') {
      return { success: true, output: '/', files: await this.getFiles() };
    }

    return { success: false, output: '', error: `Unknown command: ${cmd}` };
  }

  private async getAllFiles(dir: string): Promise<string[]> {
    const files: string[] = [];

    const traverse = (path: string) => {
      const entries = this.memfs.readdirSync(path) as string[];

      entries.forEach((entry) => {
        const fullPath = `${path}${path === '/' ? '' : '/'}${entry}`;

        if (!entry.startsWith('.')) {
          const stat = this.memfs.statSync(fullPath);
          if (stat.isDirectory?.()) {
            traverse(fullPath);
          } else {
            files.push(fullPath);
          }
        }
      });
    };

    traverse(dir);
    return files;
  }

  async getFiles(): Promise<Array<{ path: string; content: string; status: 'untracked' | 'staged' | 'committed' | 'modified' | 'deleted' }>> {
    const files: Array<{ path: string; content: string; status: any }> = [];

    try {
      const allFiles = await this.getAllFiles('/');
      const statusMap: Record<string, 'untracked' | 'staged' | 'committed' | 'modified' | 'deleted'> = {};

      if (this.isGitInitialized) {
        try {
          const matrix = await git.statusMatrix({
            fs: this.memfs as any,
            dir: '/',
          });

          matrix.forEach(([filepath, head, workdir, stage]) => {
            statusMap[filepath] = getGitStatus(head, workdir, stage);
          });
        } catch (e) {
          console.error('Error getting status matrix:', e);
        }
      }

      // Add all files currently present in workspace
      for (const file of allFiles) {
        const relativePath = file.startsWith('/') ? file.substring(1) : file;
        let content = '';
        try {
          content = this.memfs.readFileSync(file, 'utf-8') as string;
        } catch (e) {}

        const status = this.isGitInitialized ? (statusMap[relativePath] || 'untracked') : 'untracked';
        files.push({
          path: file,
          content,
          status,
        });
      }

      // Add files that were deleted but are still in index/HEAD
      if (this.isGitInitialized) {
        Object.entries(statusMap).forEach(([filepath, status]) => {
          if (status === 'deleted' || (status === 'staged' && !allFiles.some(f => (f.startsWith('/') ? f.substring(1) : f) === filepath))) {
            const displayStatus = status === 'staged' ? 'staged' : 'deleted';
            files.push({
              path: filepath.startsWith('/') ? filepath : `/${filepath}`,
              content: '',
              status: displayStatus,
            });
          }
        });
      }

    } catch (error) {
      console.error('Error reading files:', error);
    }

    return files;
  }

  getFileContent(path: string): string {
    try {
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      return this.memfs.readFileSync(normalizedPath, 'utf-8') as string;
    } catch (error) {
      throw new Error(`File not found: ${path}`);
    }
  }

  writeFile(path: string, content: string): void {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const dir = normalizedPath.substring(0, normalizedPath.lastIndexOf('/')) || '/';

    // Ensure directory exists - create recursively
    if (dir !== '/' && !this.memfs.existsSync(dir)) {
      const parts = dir.split('/').filter(Boolean);
      let currentPath = '';
      for (const part of parts) {
        currentPath += `/${part}`;
        if (!this.memfs.existsSync(currentPath)) {
          this.memfs.mkdirSync(currentPath);
        }
      }
    }

    this.memfs.writeFileSync(normalizedPath, content);
    this.saveState();
  }

  deleteFile(path: string): void {
    try {
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      if (this.memfs.existsSync(normalizedPath)) {
        this.memfs.unlinkSync(normalizedPath);
        this.saveState();
      }
    } catch (error) {
      console.error(`Error deleting file ${path}:`, error);
    }
  }

  private getGitGraph(): GitGraph {
    return {
      nodes: Array.from(this.commits.values()).map((commit) => ({
        id: commit.id,
        label: commit.message,
        hash: commit.hash,
        parent: commit.parent,
      })),
      branches: Object.fromEntries(this.branches),
      head: 'HEAD',
      currentBranch: this.currentBranch,
    };
  }

  async getState() {
    return {
      files: await this.getFiles(),
      gitGraph: this.getGitGraph(),
      currentBranch: this.currentBranch,
      branches: Array.from(this.branches.keys()),
      isInitialized: this.isGitInitialized,
    };
  }

  async setupLevelState(initialState: { isInitialized: boolean; files?: Array<{ path: string; content: string }>; commands?: string[] }): Promise<void> {
    this.reset();

    if (initialState.files && Array.isArray(initialState.files)) {
      for (const file of initialState.files) {
        this.writeFile(file.path, file.content || '');
      }
    }

    if (initialState.isInitialized && (!initialState.commands || initialState.commands.length === 0)) {
      await this.gitInit();
    }

    if (initialState.commands && Array.isArray(initialState.commands)) {
      for (const cmd of initialState.commands) {
        await this.executeCommand(cmd);
      }
    }

    this.saveState();
  }

  reset(): void {
    this.memfs.reset();
    this.commits.clear();
    this.branches.clear();
    this.currentBranch = 'main';
    this.HEAD = 'detached';
    this.commitCounter = 0;
    this.isGitInitialized = false;
    
    try {
      if (existsSync(this.stateFilePath)) {
        require('fs').unlinkSync(this.stateFilePath);
      }
    } catch(e) {
      console.error('Error deleting state file:', e);
    }
    
    this.initialize();
  }
}
