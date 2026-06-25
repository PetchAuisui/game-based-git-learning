import express, { Request, Response } from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import * as path from 'path';
import { GitEngine } from './git-engine';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Git Engine
const gitEngine = new GitEngine();

// API Routes

/**
 * Execute a Git command in the sandbox
 * POST /api/execute
 * Body: { command: string }
 */
app.post('/api/execute', async (req: Request, res: Response) => {
  try {
    const { command } = req.body;
    
    if (!command || typeof command !== 'string') {
      return res.status(400).json({ error: 'Command is required' });
    }

    const result = await gitEngine.executeCommand(command);
    
    res.json({
      success: result.success,
      output: result.output,
      error: result.error,
      gitGraph: result.gitGraph,
      files: result.files,
      isInitialized: gitEngine.isInitialized,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get current state (files, git graph, HEAD, etc.)
 * GET /api/state
 */
app.get('/api/state', async (req: Request, res: Response) => {
  try {
    const state = await gitEngine.getState();
    res.json(state);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Setup level state
 * POST /api/level/setup
 * Body: { initialState: { isInitialized: boolean, files?: Array<{ path, content }>, commands?: string[] } }
 */
app.post('/api/level/setup', async (req: Request, res: Response) => {
  try {
    const { initialState } = req.body;
    if (!initialState) {
      return res.status(400).json({ error: 'initialState is required' });
    }
    await gitEngine.setupLevelState(initialState);
    const state = await gitEngine.getState();
    res.json({ success: true, ...state });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get all levels configuration from backend levels folder
 * GET /api/levels
 */
app.get('/api/levels', async (req: Request, res: Response) => {
  try {
    const levelsDir = path.join(process.cwd(), 'levels');
    const { existsSync, mkdirSync } = require('fs');
    
    if (!existsSync(levelsDir)) {
      mkdirSync(levelsDir, { recursive: true });
    }
    
    const files = await fs.readdir(levelsDir);
    const levels = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(levelsDir, file);
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          const config = JSON.parse(content);
          if (config.levelId && config.levelName) {
            levels.push(config);
          }
        } catch (err) {
          console.error(`Error parsing level file ${file}:`, err);
        }
      }
    }
    
    levels.sort((a, b) => a.levelId.localeCompare(b.levelId, undefined, { numeric: true, sensitivity: 'base' }));
    res.json(levels);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Reset the sandbox (start fresh)
 * POST /api/reset
 */
app.post('/api/reset', (req: Request, res: Response) => {
  try {
    gitEngine.reset();
    res.json({ success: true, message: 'Sandbox reset' });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get file content
 * GET /api/file
 * Query: { path: string }
 */
app.get('/api/file', (req: Request, res: Response) => {
  try {
    const { path } = req.query;
    
    if (!path || typeof path !== 'string') {
      return res.status(400).json({ error: 'Path is required' });
    }

    const content = gitEngine.getFileContent(path);
    res.json({ path, content });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Create or update a file
 * POST /api/file
 * Body: { path: string, content: string }
 */
app.post('/api/file', async (req: Request, res: Response) => {
  try {
    const { path, content } = req.body;
    
    if (!path || typeof path !== 'string') {
      return res.status(400).json({ error: 'Path is required' });
    }

    gitEngine.writeFile(path, content || '');
    const files = await gitEngine.getFiles();
    
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Delete a file
 * DELETE /api/file
 * Query: { path: string }
 */
app.delete('/api/file', async (req: Request, res: Response) => {
  try {
    const { path } = req.query;
    
    if (!path || typeof path !== 'string') {
      return res.status(400).json({ error: 'Path is required' });
    }

    gitEngine.deleteFile(path);
    const files = await gitEngine.getFiles();
    
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Git Sandbox Backend running on http://localhost:${PORT}`);
});
