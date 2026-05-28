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
}

// ── Transform helpers ──

function transformFiles(backendFiles: BackendFile[]): FileState[] {
  return (backendFiles || []).map(f => ({
    name: f.path.replace(/^\//, ''), // strip leading slash
    status: 'committed' as const,    // backend doesn't track staging status; treat as committed for now
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

  const applyStateUpdate = useCallback((data: BackendState & { success?: boolean; output?: any }) => {
    const branch = data.currentBranch || data.gitGraph?.currentBranch || 'main';
    const transformedFiles = transformFiles(data.files || []);
    const transformedGraph = transformGraph(data.gitGraph, branch);
    
    setFiles(transformedFiles);
    setGitGraph(transformedGraph);
    setCurrentBranch(branch);
    
    // isInitialized = true whenever there's a .git directory (git init has been run).
    // We detect this by checking if gitGraph exists with even an empty nodes array 
    // but with branches. The backend always initializes git, so we mark it as true 
    // once we've confirmed we can talk to the backend.
    setIsInitialized(true);
    
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

  useEffect(() => {
    setTimerStart(Date.now());
    fetchState();
  }, [fetchState]);

  const executeCommand = useCallback(async (cmd: string): Promise<{ success: boolean; output: string[] }> => {
    try {
      const res = await api.post('/execute', { command: cmd });
      const data = res.data;

      // Update state if we got file/graph updates back
      if (data.files !== undefined || data.gitGraph !== undefined) {
        applyStateUpdate({ ...data, currentBranch: data.gitGraph?.currentBranch || currentBranch });
      }

      // Extract output lines
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
      await api.post('/reset');
      // Re-fetch fresh state after reset
      const res = await api.get('/state');
      applyStateUpdate(res.data);
      setScore(0);
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error('Failed to reset sandbox', e);
      setIsLoading(false);
      return false;
    }
  }, [applyStateUpdate]);

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
  };
}
