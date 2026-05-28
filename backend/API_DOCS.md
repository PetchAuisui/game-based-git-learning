# Backend API Documentation

## Overview

The Git Sandbox Backend is an Express.js server that provides a RESTful API for executing Git commands and file operations in an in-memory sandbox environment.

## Architecture

### Core Components

1. **GitEngine** (`src/git-engine.ts`)
   - Manages virtual file system using memfs
   - Handles Git operations via isomorphic-git
   - Maintains commit history and branches
   - Parses and executes commands

2. **Express Server** (`src/server.ts`)
   - REST API endpoints
   - Request/response handling
   - CORS configuration

## API Endpoints

### POST /api/execute

Execute any Git, file, or shell command.

**Request:**
```json
{
  "command": "git commit -m \"Initial commit\""
}
```

**Response:**
```json
{
  "success": true,
  "output": "[main a1b2c3d] Initial commit",
  "error": null,
  "gitGraph": {
    "nodes": [
      {
        "id": "uuid-abc",
        "label": "Initial commit",
        "hash": "a1b2c3d",
        "parent": null
      }
    ],
    "branches": {
      "main": "HEAD~0"
    },
    "head": "HEAD",
    "currentBranch": "main"
  },
  "files": [
    {
      "path": "/README.md",
      "content": "# My Project\n"
    }
  ]
}
```

**Supported Commands:**
- Git: `git init`, `git add`, `git commit`, `git log`, `git status`, `git branch`, `git checkout`
- Files: `echo`, `touch`, `mkdir`
- Shell: `ls`, `pwd`

---

### GET /api/state

Get the current sandbox state.

**Response:**
```json
{
  "files": [
    {
      "path": "/README.md",
      "content": "# Project\n"
    }
  ],
  "gitGraph": {
    "nodes": [],
    "branches": { "main": "HEAD~0" },
    "head": "HEAD",
    "currentBranch": "main"
  },
  "currentBranch": "main",
  "branches": ["main"]
}
```

---

### POST /api/reset

Reset the entire sandbox to initial state (clears all files and commits).

**Response:**
```json
{
  "success": true,
  "message": "Sandbox reset"
}
```

---

### GET /api/file

Retrieve content of a specific file.

**Query Parameters:**
- `path` (required): Path to file (e.g., `/README.md` or `README.md`)

**Response:**
```json
{
  "path": "/README.md",
  "content": "# My Project\n\nThis is my project."
}
```

**Error Response (404):**
```json
{
  "error": "File not found: /nonexistent.txt"
}
```

---

### POST /api/file

Create or update a file.

**Request:**
```json
{
  "path": "/newfile.txt",
  "content": "File contents here"
}
```

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "path": "/newfile.txt",
      "content": "File contents here"
    }
  ]
}
```

---

## Git Commands Implementation

### git init
Initializes a new Git repository.

```bash
$ git init
Initialized empty Git repository
```

### git add
Stages files for commit.

```bash
$ git add .
Added 3 files to staging area

$ git add README.md
Added 'README.md' to staging area
```

### git commit
Creates a commit.

```bash
$ git commit -m "Initial commit"
[main a1b2c3d] Initial commit
```

### git log
Shows commit history.

```bash
$ git log
commit a1b2c3d
Author: Sandbox User <user@sandbox.local>
Date: Thu Aug 17 10:30:45 2024

    Initial commit
```

### git status
Shows repository status.

```bash
$ git status
On branch main

Changes to be committed:
  new file: README.md

Untracked files:
  .gitignore
```

### git branch
List or create branches.

```bash
$ git branch
* main

$ git branch feature/new-ui
Created branch 'feature/new-ui'
```

### git checkout
Switch branches or create new ones.

```bash
$ git checkout feature/new-ui
Switched to branch 'feature/new-ui'

$ git checkout -b feature/another
Switched to branch 'feature/another'
```

### git show
Display commit details.

```bash
$ git show
Shows the latest commit details
```

---

## File System Commands

### echo
Write content to file.

```bash
$ echo "Hello World" > hello.txt
Written to 'hello.txt'

$ echo "Line 1" > file.txt
$ echo "Line 2" >> file.txt
```

### touch
Create empty file.

```bash
$ touch newfile.txt
Created file 'newfile.txt'
```

### mkdir
Create directory.

```bash
$ mkdir src
Created directory 'src'
```

### ls
List files in directory.

```bash
$ ls
README.md
src/
config.json

$ ls src
index.ts
utils.ts
```

### pwd
Print working directory (always `/` in sandbox).

```bash
$ pwd
/
```

---

## Data Structures

### GitGraph

```typescript
interface GitGraph {
  nodes: Array<{
    id: string;           // UUID identifier
    label: string;        // Commit message
    hash: string;         // Git hash (truncated)
    parent: string | null; // Parent commit ID
  }>;
  branches: Record<string, string>;  // Branch names to refs
  head: string;                       // HEAD reference
  currentBranch: string;              // Active branch
}
```

### File Entry

```typescript
interface File {
  path: string;    // e.g., "/README.md"
  content: string; // File contents
}
```

---

## Error Handling

All errors return appropriate HTTP status codes:

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 400 | Bad request (missing parameters) |
| 500 | Server error |

**Error Response Format:**
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## Rate Limiting & Constraints

- No built-in rate limiting (suitable for local development)
- Max file size: Limited by Node.js memory
- Max commits: Limited by available memory
- Command timeout: 30 seconds (adjust in code if needed)

---

## Environment Variables

```bash
PORT=5000                    # Server port
NODE_ENV=development         # Environment
```

---

## Performance Notes

- In-memory filesystem is extremely fast
- No disk I/O operations
- Suitable for hundreds of files
- Commit operations are near-instant
- Memory usage grows with file size and commit count

---

## Security Notes

- ⚠️ Backend runs locally only
- No authentication/authorization (not needed for local dev)
- No input sanitization (commands parsed directly)
- Safe for local use only - do not expose to public internet

---

## Development

### Adding New Commands

In `git-engine.ts`:

```typescript
case 'mycommand':
  return await this.handleMyCommand(args);

private async handleMyCommand(args: string[]): Promise<CommandResult> {
  // Implementation
  return {
    success: true,
    output: 'Command executed',
    gitGraph: this.getGitGraph(),
    files: this.getFiles(),
  };
}
```

### Testing Commands

Use curl or Postman:

```bash
curl -X POST http://localhost:5000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"command": "git init"}'
```

---

**Last Updated:** August 2024
