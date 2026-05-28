# Frontend Documentation

## Overview

The Git Sandbox Frontend is a Next.js application providing an interactive interface for Git learning. It features a terminal, file explorer, and Git visualization.

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── _app.tsx          # Next.js app wrapper
│   │   └── index.tsx         # Main page
│   ├── components/
│   │   ├── Terminal.tsx      # Terminal UI & input
│   │   ├── FileExplorer.tsx  # File tree browser
│   │   ├── GitGraph.tsx      # Commit graph visualization
│   │   └── Header.tsx        # Header with stats
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   └── styles/
│       └── globals.css       # Dark theme styling
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## Components

### Terminal Component

**File:** `src/components/Terminal.tsx`

Interactive terminal that sends commands to the backend.

**Features:**
- Command input with placeholder suggestions
- Command history navigation (↑/↓)
- Real-time output display
- Color-coded output (success, error, input)
- Auto-scroll to latest output

**Props:**
```typescript
interface TerminalProps {
  onExecuteCommand: (command: string) => void;
  terminalOutput: Array<{
    type: 'input' | 'output' | 'error';
    text: string;
  }>;
}
```

**Usage:**
```tsx
<Terminal 
  onExecuteCommand={executeCommand} 
  terminalOutput={appState.terminalOutput} 
/>
```

---

### FileExplorer Component

**File:** `src/components/FileExplorer.tsx`

Displays a collapsible file tree of the sandbox.

**Features:**
- Hierarchical file tree display
- Expand/collapse directories
- File size indicators
- Tree building from flat file array

**Props:**
```typescript
interface FileExplorerProps {
  files: Array<{
    path: string;
    content: string;
  }>;
}
```

**Implementation Details:**
- Parses file paths to build tree structure
- Each node tracks `name`, `path`, `isDirectory`, `children`, `size`
- Recursive rendering with indentation

---

### GitGraph Component

**File:** `src/components/GitGraph.tsx`

SVG-based visualization of Git commit graph.

**Features:**
- Draws commit nodes as circles
- Lines connecting parent-child commits
- Hover effect on nodes
- Click for commit details
- Dark theme with accent colors

**Props:**
```typescript
interface GitGraphProps {
  gitGraph: {
    nodes: Array<{
      id: string;
      label: string;
      hash: string;
      parent: string | null;
    }>;
    branches: Record<string, string>;
    head: string;
    currentBranch: string;
  };
}
```

**Rendering Algorithm:**
1. Calculates node positions based on commit depth
2. Draws connecting lines (parent → child)
3. Renders commit circles with labels
4. Adds interactivity

---

### Header Component

**File:** `src/components/Header.tsx`

Top navigation with game stats.

**Features:**
- Level display
- Score tracking
- Timer (shows elapsed time)
- Game title

**State:**
- `level`: Current level (default 1)
- `score`: Current score (default 0)
- `time`: Formatted elapsed time

---

## Pages

### Index Page (Home)

**File:** `src/pages/index.tsx`

Main application page with layout composition.

**Layout Structure:**
```
┌─────────────────────────────────────────┐
│ Header                                  │
├─────────────────────────────────────────┤
│        │                     │           │
│ Files  │  Git Graph          │  Info    │
│ (250px)│  (flex)             │ (250px)  │
│        │                     │           │
├─────────────────────────────────────────┤
│ Terminal (200px)                        │
└─────────────────────────────────────────┘
```

**State Management:**
```typescript
const [appState, setAppState] = useState<AppState>({
  files: [],
  gitGraph: { /* ... */ },
  terminalOutput: [],
});
```

**Key Functions:**
- `executeCommand()`: Sends command to backend, updates state
- `fetchInitialState()`: Gets initial sandbox state on mount

---

## Types

**File:** `src/types/index.ts`

```typescript
interface GitNode {
  id: string;
  label: string;
  hash: string;
  parent: string | null;
}

interface GitGraphData {
  nodes: GitNode[];
  branches: Record<string, string>;
  head: string;
  currentBranch: string;
}

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  text: string;
}

interface AppState {
  files: Array<{ path: string; content: string }>;
  gitGraph: GitGraphData;
  terminalOutput: TerminalLine[];
}
```

---

## Styling

**File:** `src/styles/globals.css`

Dark terminal theme with customizable colors.

### Color Scheme

```css
--bg-primary: #231916;      /* Dark brown background */
--bg-secondary: #2d2420;    /* Slightly lighter background */
--border-color: #4d3a35;    /* Brown borders */
--accent-yellow: #ffff66;   /* Yellow for headers/prompts */
--accent-green: #a3be8c;    /* Green for success/info */
--text-primary: #ffffff;    /* White text */
--text-secondary: #b0a8a0;  /* Gray secondary text */
```

### Key Classes

| Class | Purpose |
|-------|---------|
| `.app-container` | Main flex container |
| `.main-layout` | Three-column layout |
| `.sidebar` | Left/right sidebars |
| `.content-area` | Center Git graph area |
| `.terminal-container` | Bottom terminal |
| `.file-tree` | Nested file list |
| `.git-graph-canvas` | SVG canvas |

### Responsive Design

- **Desktop (>1024px)**: Full 3-column layout
- **Tablet (768-1024px)**: Adjusted sidebar widths
- **Mobile (<768px)**: Stacked layout

---

## API Integration

### Setup

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const response = await axios.post(`${API_URL}/api/execute`, {
  command: 'git commit -m "message"'
});
```

### Environment Variables

**`.env.local` (create this file):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Axios Usage

```typescript
try {
  const response = await axios.post(url, data);
  // Handle success
} catch (error) {
  if (axios.isAxiosError(error)) {
    const errorMsg = error.response?.data?.error;
  }
}
```

---

## User Interactions

### Terminal Input Flow

1. User types command
2. Press Enter
3. `handleKeyDown()` checks for Enter key
4. Stores command in history
5. Calls `onExecuteCommand(input)`
6. Clears input

### Command History Navigation

- **↑ Arrow**: Go to previous command
- **↓ Arrow**: Go to next command (or clear if at beginning)
- Maintained in component state

### File Explorer

- Click folder icon to expand/collapse
- Shows file size for individual files
- Hierarchical indentation

### Git Graph

- Hover over circle for highlight
- Click circle to see commit details
- Automatically updates on new commits

---

## Development Workflow

### Running Development Server

```bash
npm run dev
```

Opens on `http://localhost:3000`

### Hot Module Replacement

- Changes to components auto-refresh
- Preserves state during development
- Fast iteration

### Building for Production

```bash
npm run build
npm start
```

---

## Common Tasks

### Add New Terminal Command Support

1. Update backend `git-engine.ts`
2. Frontend automatically receives new output
3. No frontend changes needed

### Customize Colors

Edit `globals.css` CSS variables:

```css
:root {
  --accent-yellow: #ffff00;  /* Changed to pure yellow */
}
```

### Add New Component

1. Create file in `src/components/`
2. Define TypeScript interface for props
3. Import and use in `pages/index.tsx`

### Change Layout

Modify `main-layout` grid in `globals.css`:

```css
.main-layout {
  display: grid;
  grid-template-columns: 250px 1fr 250px; /* Adjust widths */
}
```

---

## Debugging

### Browser DevTools

1. Open Chrome DevTools (F12)
2. Network tab: See API calls
3. Console: Check errors
4. Components tab: Inspect React state

### Common Issues

**API not responding:**
- Check backend running on port 5000
- Verify `NEXT_PUBLIC_API_URL` env var
- Check browser console for CORS errors

**Terminal not updating:**
- Ensure `useEffect` dependency array includes `terminalOutput`
- Check state updates in parent component

**Git graph not rendering:**
- Inspect SVG in DevTools
- Check console for SVG rendering errors
- Verify `gitGraph` data structure

---

## Performance Optimization

### Lazy Loading
Currently all components load on main page. Could split into code-split chunks:

```typescript
const GitGraph = dynamic(() => import('@/components/GitGraph'));
```

### Memoization

Components that receive stable props can be memoized:

```typescript
export default React.memo(FileExplorer);
```

### Virtual Scrolling

For very large file trees, implement virtual scrolling (future enhancement).

---

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported (ES2020 target)

---

**Last Updated:** August 2024
