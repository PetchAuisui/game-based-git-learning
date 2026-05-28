import express, { Request, Response } from 'express';
import cors from 'cors';
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
app.get('/api/state', (req: Request, res: Response) => {
  try {
    const state = gitEngine.getState();
    res.json(state);
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
app.post('/api/file', (req: Request, res: Response) => {
  try {
    const { path, content } = req.body;
    
    if (!path || typeof path !== 'string') {
      return res.status(400).json({ error: 'Path is required' });
    }

    gitEngine.writeFile(path, content || '');
    const files = gitEngine.getFiles();
    
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
