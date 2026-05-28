# Git Sandbox - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

Run from project root:
```bash
bash setup.sh
```

Or manually:
```bash
# Backend
cd backend && npm install && cd ..

# Frontend  
cd frontend && npm install && cd ..
```

### 2. Start Backend

Open **Terminal 1:**
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Git Sandbox Backend running on http://localhost:5001
```

### 3. Start Frontend

Open **Terminal 2:**
```bash
cd frontend
npm run dev
```

Expected output:
```
▲ Next.js 13.5.0
  - Local:        http://localhost:3000
  - Environments: .env.local
```

### 4. Open in Browser

Navigate to **http://localhost:3000**

You should see:
- 🎮 Git Sandbox header
- File explorer (left sidebar)
- Git graph area (center)
- Terminal (bottom)

---

## 📚 First Commands to Try

### Create Your First Repository

```bash
# Initialize git repo
git init

# Create a file
echo "Hello Git!" > hello.txt

# Check status
git status

# Stage the file
git add .

# Create first commit
git commit -m "Initial commit"

# View history
git log
```

### Create a Branch

```bash
# List branches
git branch

# Create new branch
git branch feature/new-feature

# Switch to it
git checkout feature/new-feature

# Create another file
echo "New feature" > feature.txt

# Commit
git add .
git commit -m "Add new feature"

# Switch back to main
git checkout main

# See the difference - feature.txt won't exist here!
```

---

## 🎯 Common Commands Reference

| Task | Command |
|------|---------|
| Initialize repo | `git init` |
| Create file | `echo 'content' > filename.txt` |
| View files | `ls` |
| Stage files | `git add .` or `git add filename.txt` |
| Commit | `git commit -m "message"` |
| View history | `git log` |
| Check status | `git status` |
| List branches | `git branch` |
| Create branch | `git branch branch-name` |
| Switch branch | `git checkout branch-name` |
| Create & switch | `git checkout -b branch-name` |

---

## 🐛 Troubleshooting

### "Cannot connect to API"

**Problem:** Terminal shows errors about API connection

**Solution:**
1. Check backend is running on Terminal 1
2. Verify `http://localhost:5001` responds:
   ```bash
   curl http://localhost:5001/api/state
   ```
3. Check frontend `.env.local` has correct URL

### "Port 3000/5000 already in use"

**Solution:** Kill the process using the port

**macOS/Linux:**
```bash
lsof -i :3000    # Find process
kill -9 <PID>    # Kill it

# Or change port
npm run dev -- -p 3001
```

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Node modules missing errors"

**Solution:**
```bash
rm -rf backend/node_modules frontend/node_modules
npm install --prefix backend
npm install --prefix frontend
```

### "Command not recognized"

**Supported commands:**
- Git: `git init`, `git add`, `git commit`, `git log`, `git status`, `git branch`, `git checkout`
- Files: `echo`, `touch`, `mkdir`, `ls`, `pwd`

Try: `git status` (if not initialized, run `git init` first)

---

## 💡 Tips & Tricks

### Clear Terminal Output

The terminal doesn't have a `clear` command, but you can:
1. Use browser DevTools console
2. Or refresh the page to reset

### Save Your Progress

Everything is in-memory, so refreshing the page will reset the sandbox.

**Future feature:** Export repository snapshot

### Experiment Freely

This is a sandbox - you can't break anything! Try:
- Complex commit histories
- Multiple branches
- All git commands

### View File Contents

After creating a file, you can examine it:
1. Look in the File Explorer (left sidebar)
2. Files show their size in bytes

---

## 📖 Learning Path

### Beginner (Start here!)
1. ✅ Create file → git init → git add → git commit
2. ✅ Learn `git status` and `git log`
3. ✅ Create a branch with `git branch`

### Intermediate
4. ✅ Switch between branches with `git checkout`
5. ✅ Create commits on different branches
6. ✅ Visualize branching in Git graph

### Advanced (Future)
7. 🔜 Merge branches (coming soon)
8. 🔜 Resolve conflicts (coming soon)
9. 🔜 Rebase operations (coming soon)

---

## 🔗 Resources

- **Git Official Docs:** https://git-scm.com/doc
- **Git Cheat Sheet:** https://github.github.com/training-kit/
- **Interactive Git Learning:** https://learngitbranching.js.org/

---

## 📝 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Execute command |
| ↑ | Previous command |
| ↓ | Next command |
| Ctrl+C | Stop command (on some terminals) |

---

## 🎓 What You'll Learn

By using Git Sandbox, you'll understand:
- ✅ How Git tracks changes
- ✅ What the staging area is
- ✅ How commits work
- ✅ Branch creation and switching
- ✅ Git history and log
- ✅ Repository state

---

**Need help?** Check the [Backend API Docs](backend/API_DOCS.md) or [Frontend Docs](frontend/FRONTEND_DOCS.md)

**Happy Git learning! 🚀**
