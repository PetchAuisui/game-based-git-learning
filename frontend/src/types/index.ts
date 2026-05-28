export interface GitNode {
  id: string;
  label: string;
  hash: string;
  parent: string | null;
}

export interface GitGraphData {
  nodes: GitNode[];
  branches: Record<string, string>;
  head: string;
  currentBranch: string;
}

export interface TerminalLine {
  type: 'input' | 'output' | 'error';
  text: string;
}

export interface AppState {
  files: Array<{ path: string; content: string }>;
  gitGraph: GitGraphData;
  terminalOutput: TerminalLine[];
}
