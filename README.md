# Git Sandbox Learning Application

A web-based Git learning environment where users can practice Git commands in a safe sandbox without affecting their real file system.

## Features

✅ **Git Simulation Engine**: Uses `isomorphic-git` with in-memory filesystem (memfs)  
✅ **Interactive Terminal**: Execute Git commands directly in the browser  
✅ **Real-time Git Graph Visualization**: See commits and branches as you create them  
✅ **File Explorer**: View and manage files in your sandbox  
✅ **Command History**: Navigate previous commands with arrow keys  
✅ **No Side Effects**: Everything runs in memory - safe to experiment!  

## Tech Stack

- **Frontend**: Next.js 13 + React 18 + TypeScript
- **Backend**: Express.js + Node.js
- **Git Engine**: isomorphic-git + memfs
- **Styling**: Custom CSS with dark terminal theme

## Project Structure

```
game-based-git-learning/
├── backend/
│   ├── src/
│   │   ├── server.ts          # Express server & API routes
│   │   └── git-engine.ts      # Git simulation logic
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── index.tsx       # Main app page
    │   │   └── _app.tsx        # Next.js app wrapper
    │   ├── components/
    │   │   ├── Terminal.tsx    # Terminal component
    │   │   ├── FileExplorer.tsx # File explorer
    │   │   ├── GitGraph.tsx    # Commit graph visualization
    │   │   └── Header.tsx      # Header with stats
    │   ├── types/
    │   │   └── index.ts        # TypeScript types
    │   └── styles/
    │       └── globals.css     # Dark theme styling
    ├── package.json
    ├── next.config.js
    └── tsconfig.json
```

## Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

**API Endpoints:**
- `POST /api/execute` - Execute a Git command
- `GET /api/state` - Get current sandbox state
- `POST /api/reset` - Reset the sandbox
- `GET /api/file` - Get file content
- `POST /api/file` - Create/update files

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Usage Guide

### Getting Started

1. **Create a file:**
   ```
   echo 'Hello World' > README.md
   ```

2. **Initialize Git:**
   ```
   git init
   ```

3. **Stage your files:**
   ```
   git add .
   ```

4. **Make your first commit:**
   ```
   git commit -m "Initial commit"
   ```

5. **View commit history:**
   ```
   git log
   ```

### Supported Git Commands

| Command | Example |
|---------|---------|
| `git init` | Initialize repository |
| `git add` | `git add file.txt` or `git add .` |
| `git commit` | `git commit -m "message"` |
| `git log` | View commit history |
| `git status` | Check working tree status |
| `git branch` | List/create branches |
| `git checkout` | Switch branches or create new |
| `git show` | Display commit details |

### File Commands

| Command | Example |
|---------|---------|
| `echo` | `echo 'content' > file.txt` |
| `touch` | `touch newfile.txt` |
| `mkdir` | `mkdir dirname` |
| `ls` | List files |
| `pwd` | Print working directory |

## Architecture Overview

### Backend Flow

1. Frontend sends command string via `POST /api/execute`
2. Backend parses command with regex
3. GitEngine processes Git/File/Shell commands
4. isomorphic-git interacts with memfs (in-memory filesystem)
5. Response includes:
   - Command output/error message
   - Updated Git graph (JSON)
   - Current files state
6. Frontend re-renders with new data

### Frontend Flow

1. Terminal receives user input
2. Sends to backend API
3. Receives updated state
4. Updates AppState
5. Components re-render:
   - Terminal shows command output
   - FileExplorer refreshes file tree
   - GitGraph draws new commit visualization

## Customization

### Styling

Edit `frontend/src/styles/globals.css` to customize colors:

```css
:root {
  --bg-primary: #231916;      /* Main background */
  --accent-yellow: #ffff66;   /* Headers & prompts */
  --accent-green: #a3be8c;    /* Success/info */
}
```

### Adding Commands

Edit `backend/src/git-engine.ts` to add new commands:

```typescript
case 'git':
  return await this.handleGitCommand(parts.slice(1));
// Add new command handlers here
```

## Limitations & Future Features

### Current Limitations
- ⚠️ Merge conflicts not yet implemented
- ⚠️ Remote operations (push/pull) simulated only
- ⚠️ No diff visualization yet
- ⚠️ Stash functionality not implemented

### Planned Features
- 🚀 Merge visualization and conflict resolution
- 🚀 Rebase operations
- 🚀 Interactive rebase UI
- 🚀 Diff viewer
- 🚀 Blame view
- 🚀 Tag support
- 🚀 Pre-built lesson scenarios

## Development

### Build for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

### Troubleshooting

**Port already in use:**
```bash
# Change backend port in backend/src/server.ts
# Change frontend port: npm run dev -- -p 3001
```

**CORS issues:**
- Backend is configured with CORS enabled
- Check `NEXT_PUBLIC_API_URL` in frontend environment

**Memory filesystem not working:**
- Ensure memfs is installed: `npm install memfs`
- Check Node.js version (16+)

## License

MIT - Feel free to use and modify

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

Built with ❤️ for Git learners
