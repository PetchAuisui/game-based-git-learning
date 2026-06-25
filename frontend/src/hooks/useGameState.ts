// src/hooks/useGameState.ts
import { useState, useCallback, useEffect } from 'react';
import api from '@/utils/api';

// ── Frontend types ──

export interface FileState {
  name: string;
  status: 'untracked' | 'staged' | 'committed' | 'modified' | 'deleted';
  content?: string;
}

export interface GitGraphNode {
  id: string;
  label: string;
  parents: string[];
  branches: string[];
  isHead: boolean;
  timestamp: number;
}

export interface GitGraphData {
  nodes: GitGraphNode[];
  head: string | null;
  branch: string;
  branches: Record<string, string>;
}

// ── Backend types (raw API response) ──

interface BackendFile {
  path: string;
  content: string;
  status?: 'untracked' | 'staged' | 'committed' | 'modified' | 'deleted';
}

interface BackendCommitNode {
  id: string;
  label: string;
  hash: string;
  parent: string | null; // single parent
}

interface BackendGitGraph {
  nodes: BackendCommitNode[];
  branches: Record<string, string>;
  head: string;        // "HEAD" or hash
  currentBranch: string;
}

interface BackendState {
  files: BackendFile[];
  gitGraph: BackendGitGraph;
  currentBranch: string;
  branches: string[];  // branch names array
  isInitialized?: boolean;
}

// ── Transform helpers ──

function transformFiles(backendFiles: BackendFile[]): FileState[] {
  return (backendFiles || []).map(f => ({
    name: f.path.replace(/^\//, ''), // strip leading slash
    status: f.status || 'untracked',
    content: f.content,
  }));
}

function transformGraph(bg: BackendGitGraph | undefined, currentBranch: string): GitGraphData {
  if (!bg) return { nodes: [], head: null, branch: currentBranch || 'main', branches: {} };

  const nodes: GitGraphNode[] = (bg.nodes || []).map(node => ({
    id: node.hash || node.id,
    label: node.label || node.id,
    parents: node.parent ? [node.parent] : [],
    branches: Object.entries(bg.branches || {})
      .filter(([_, v]) => v === node.id || v === node.hash)
      .map(([k]) => k),
    isHead: bg.head === node.id || bg.head === node.hash,
    timestamp: Date.now(), // backend doesn't provide per-commit timestamps
  }));

  return {
    nodes,
    head: bg.head || null,
    branch: bg.currentBranch || currentBranch || 'main',
    branches: bg.branches || {},
  };
}

// ── Level Interfaces ──

export interface TaskConfig {
  id: string;
  label: string;
  check: {
    type: 'git_initialized' | 'file_exists' | 'file_contains' | 'file_staged' | 'file_committed' | 'current_branch' | 'branch_exists' | 'commit_count_min' | 'commit_message_contains' | 'file_modified' | 'has_no_untracked';
    params?: Record<string, any>;
  };
}

export interface LevelConfig {
  levelId: string;
  levelName: string;
  command: string;
  description: string;
  completionMessage?: string;
  initialState: {
    isInitialized: boolean;
    files?: Array<{ path: string; content: string }>;
    commands?: string[];
  };
  tasks: TaskConfig[];
}

// ── Check Evaluation Engine ──

function evaluateTaskCheck(
  check: TaskConfig['check'],
  files: FileState[],
  gitGraph: GitGraphData,
  isInitialized: boolean
): boolean {
  const params = check.params || {};
  const cleanPath = (p: string) => (p || '').replace(/^\//, '');

  switch (check.type) {
    case 'git_initialized':
      return isInitialized;

    case 'file_exists': {
      const target = cleanPath(params.path);
      return files.some(f => f.name === target && f.status !== 'deleted');
    }

    case 'file_contains': {
      const target = cleanPath(params.path);
      const content = params.content || '';
      const file = files.find(f => f.name === target && f.status !== 'deleted');
      return !!file && (file.content || '').includes(content);
    }

    case 'file_staged': {
      const target = cleanPath(params.path);
      const file = files.find(f => f.name === target);
      return !!file && file.status === 'staged';
    }

    case 'file_committed': {
      const target = cleanPath(params.path);
      const file = files.find(f => f.name === target);
      return !!file && file.status === 'committed';
    }

    case 'current_branch': {
      return gitGraph.branch === params.branch;
    }

    case 'branch_exists': {
      return Object.keys(gitGraph.branches).includes(params.branch);
    }

    case 'commit_count_min': {
      return gitGraph.nodes.length >= (params.count || 1);
    }

    case 'commit_message_contains': {
      if (gitGraph.nodes.length === 0) return false;
      const headNode = gitGraph.nodes.find(n => n.isHead) || gitGraph.nodes[0];
      return headNode ? headNode.label.includes(params.message || '') : false;
    }

    case 'file_modified': {
      const target = cleanPath(params.path);
      const file = files.find(f => f.name === target);
      return !!file && file.status === 'modified';
    }

    case 'has_no_untracked': {
      return !files.some(f => f.status === 'untracked');
    }

    default:
      return false;
  }
}

// ── Hook ──

const EMPTY_GRAPH: GitGraphData = { nodes: [], head: null, branch: 'main', branches: {} };

export function useGameState() {
  const [files, setFiles] = useState<FileState[]>([]);
  const [gitGraph, setGitGraph] = useState<GitGraphData>(EMPTY_GRAPH);
  const [currentBranch, setCurrentBranch] = useState<string>('main');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timerStart, setTimerStart] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Level State
  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isLevelCompleted, setIsLevelCompleted] = useState<boolean>(false);
  const [levels, setLevels] = useState<LevelConfig[]>([]);

  const applyStateUpdate = useCallback((data: BackendState & { success?: boolean; output?: any }) => {
    const branch = data.currentBranch || data.gitGraph?.currentBranch || 'main';
    const transformedFiles = transformFiles(data.files || []);
    const transformedGraph = transformGraph(data.gitGraph, branch);
    
    setFiles(transformedFiles);
    setGitGraph(transformedGraph);
    setCurrentBranch(branch);
    
    setIsInitialized(data.isInitialized ?? false);
    
    // Score = commit count
    setScore(transformedGraph.nodes.length);
  }, []);

  const fetchState = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/state');
      applyStateUpdate(res.data);
      setIsLoading(false);
    } catch (e: any) {
      console.error('Failed to load sandbox state', e);
      setError('Could not connect to backend on port 5001. Start it with: cd backend && npm run dev');
      setIsLoading(false);
    }
  }, [applyStateUpdate]);

  const fetchLevels = useCallback(async () => {
    try {
      const res = await api.get('/levels');
      if (Array.isArray(res.data)) {
        setLevels(res.data);
      }
    } catch (e) {
      console.error('Failed to load levels', e);
    }
  }, []);

  useEffect(() => {
    setTimerStart(Date.now());
    fetchState();
    fetchLevels();
  }, [fetchState, fetchLevels]);

  // Dynamic task verification hook
  useEffect(() => {
    if (!currentLevel) {
      setCompletedTasks([]);
      setIsLevelCompleted(false);
      return;
    }

    const completed: string[] = [];
    currentLevel.tasks.forEach(task => {
      if (evaluateTaskCheck(task.check, files, gitGraph, isInitialized)) {
        completed.push(task.id);
      }
    });

    setCompletedTasks(completed);

    if (currentLevel.tasks.length > 0 && completed.length === currentLevel.tasks.length) {
      setIsLevelCompleted(true);
    } else {
      setIsLevelCompleted(false);
    }
  }, [currentLevel, files, gitGraph, isInitialized]);

  const loadLevel = useCallback(async (config: LevelConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post('/level/setup', { initialState: config.initialState });
      if (res.data && res.data.success) {
        const data = res.data;
        const branch = data.currentBranch || data.gitGraph?.currentBranch || 'main';
        const transformedFiles = transformFiles(data.files || []);
        const transformedGraph = transformGraph(data.gitGraph, branch);
        
        setFiles(transformedFiles);
        setGitGraph(transformedGraph);
        setCurrentBranch(branch);
        setIsInitialized(data.isInitialized ?? false);
        setScore(0);
        
        setCurrentLevel(config);
        setCompletedTasks([]);
        setIsLevelCompleted(false);
      } else {
        throw new Error(res.data.error || 'Failed to initialize level state');
      }
    } catch (e: any) {
      console.error('Error loading level:', e);
      setError(e.message || 'Failed to load level configuration');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unloadLevel = useCallback(() => {
    setCurrentLevel(null);
    setCompletedTasks([]);
    setIsLevelCompleted(false);
  }, []);

  const executeCommand = useCallback(async (cmd: string): Promise<{ success: boolean; output: string[] }> => {
    try {
      const res = await api.post('/execute', { command: cmd });
      const data = res.data;

      if (data.files !== undefined || data.gitGraph !== undefined) {
        applyStateUpdate({ ...data, currentBranch: data.gitGraph?.currentBranch || currentBranch });
      }

      let lines: string[] = [];
      if (Array.isArray(data.output)) {
        lines = data.output;
      } else if (typeof data.output === 'string' && data.output) {
        lines = data.output.split('\n').filter((l: string) => l !== '');
      }
      
      if (data.error) {
        lines = lines.length ? lines : [data.error];
      }

      return { success: data.success !== false, output: lines };
    } catch (e: any) {
      const errMsg = e?.response?.data?.error || 'Error: Failed to execute command';
      return { success: false, output: [errMsg] };
    }
  }, [applyStateUpdate, currentBranch]);

  const resetSandbox = useCallback(async () => {
    setIsLoading(true);
    try {
      if (currentLevel) {
        await loadLevel(currentLevel);
      } else {
        await api.post('/reset');
        const res = await api.get('/state');
        applyStateUpdate(res.data);
        setScore(0);
      }
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error('Failed to reset sandbox', e);
      setIsLoading(false);
      return false;
    }
  }, [currentLevel, loadLevel, applyStateUpdate]);

  const createOrUpdateFile = useCallback(async (path: string, content: string = '') => {
    try {
      const res = await api.post('/file', { path, content });
      if (res.data && res.data.files) {
        setFiles(transformFiles(res.data.files));
      }
      return true;
    } catch (e) {
      console.error('Failed to create/update file', e);
      return false;
    }
  }, []);

  const deleteFile = useCallback(async (path: string) => {
    try {
      const res = await api.delete(`/file?path=${encodeURIComponent(path)}`);
      if (res.data && res.data.files) {
        setFiles(transformFiles(res.data.files));
      }
      return true;
    } catch (e) {
      console.error('Failed to delete file', e);
      return false;
    }
  }, []);

  return {
    files,
    gitGraph,
    currentBranch,
    isInitialized,
    score,
    timerStart,
    isLoading,
    error,
    executeCommand,
    resetSandbox,
    fetchState,
    createOrUpdateFile,
    deleteFile,
    currentLevel,
    completedTasks,
    isLevelCompleted,
    loadLevel,
    unloadLevel,
    levels,
    fetchLevels,
  };
}
