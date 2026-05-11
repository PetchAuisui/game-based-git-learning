// backend/controllers/levelController.js
const UserProgress = require('../models/UserProgress');
const LEVELS = require('../data/levelsData');

/**
 * Helper: strip sensitive fields (expectedCommand) from a level before sending to client.
 */
function sanitizeLevel(level) {
  return {
    lvl: level.lvl,
    tag: level.tag,
    name: level.name,
    sections: level.sections.map(s => ({
      id: s.id,
      conversations: s.conversations,
      quest: s.quest,
      hint: s.hint,
      action: s.action
      // NOTE: expectedCommand is intentionally omitted — never sent to the frontend
    }))
  };
}

/**
 * Helper: generate simulated git output for a correct command.
 * This is the server-side equivalent of the old frontend gitEngine.
 */
function simulateGitOutput(cmd, section, currentFiles) {
  const cleanCmd = cmd.trim();
  let output = [];
  let nextFiles = currentFiles ? [...currentFiles] : [];

  if (cleanCmd.startsWith('git version')) {
    output = ['git version 2.40.1.windows.1'];
  } else if (cleanCmd.startsWith('git config')) {
    output = [];
  } else if (cleanCmd.startsWith('git init')) {
    output = ['Initialized empty Git repository in C:/Project/.git/'];
  } else if (cleanCmd.startsWith('git status')) {
    output = ['On branch main', '', 'No commits yet', ''];
    const untracked = nextFiles.filter(f => f.status === 'untracked');
    const staged = nextFiles.filter(f => f.status === 'staged');
    if (staged.length > 0) {
      output.push('Changes to be committed:');
      output.push('  (use "git rm --cached <file>..." to unstage)');
      staged.forEach(f => output.push(`        new file:   ${f.name}`));
      output.push('');
    }
    if (untracked.length > 0) {
      output.push('Untracked files:');
      output.push('  (use "git add <file>..." to include in what will be committed)');
      untracked.forEach(f => output.push(`        <span style="color:red">${f.name}</span>`));
      output.push('');
      output.push('nothing added to commit but untracked files present (use "git add" to track)');
    } else if (staged.length === 0) {
      output.push('nothing to commit (create/copy files and use "git add" to track)');
    }
  } else if (section.action === 'GIT_ADD' || section.action === 'GIT_ADD_ALL') {
    output = [];
    nextFiles = nextFiles.map(f => ({ ...f, status: 'staged' }));
  } else if (section.action === 'GIT_COMMIT') {
    const msg = cleanCmd.includes('-m') ? cleanCmd.split('-m')[1] : 'Initial commit';
    output = [
      `[main (root-commit) 1a2b3c4] ${msg}`,
      ` 1 file changed, 10 insertions(+)`,
      ` create mode 100644 index.html`
    ];
    nextFiles = nextFiles.map(f => f.status === 'staged' ? { ...f, status: 'committed' } : f);
  } else if (section.action === 'GIT_RESTORE') {
    output = [];
    if (cleanCmd.includes('--staged')) {
      nextFiles = nextFiles.map(f => f.status === 'staged' ? { ...f, status: 'untracked' } : f);
    } else {
      nextFiles = nextFiles.map(f => f.name === 'index.html' ? { ...f, status: 'committed' } : f);
    }
  } else if (section.action === 'GIT_RESET') {
    output = ['Unstaged changes after reset:'];
    if (cleanCmd.includes('--mixed')) nextFiles = nextFiles.map(f => ({ ...f, status: 'untracked' }));
    if (cleanCmd.includes('--hard')) {
      output = ['HEAD is now at 1a2b3c4 Initial commit'];
      nextFiles = [];
    }
  } else {
    // Generic success output for commands like git log, git branch, etc.
    output = [`Command executed successfully.`];
  }

  return { output, newFiles: nextFiles };
}

/**
 * GET /api/levels
 * Returns metadata-only array with isUnlocked flag. No solutions included.
 */
exports.getLevels = async (req, res) => {
  try {
    const userId = req.user.id;
    let progress = await UserProgress.findOne({ userId });
    const highestLevel = progress ? progress.currentHighestLevel : 0;

    const levelsResponse = LEVELS.map((level, index) => ({
      levelIdx: index,
      lvl: level.lvl,
      tag: level.tag,
      name: level.name,
      sectionCount: level.sections.length,
      isUnlocked: index <= highestLevel
    }));

    res.json(levelsResponse);
  } catch (error) {
    console.error('Error fetching levels:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /api/levels/:levelId
 * Returns full level data for rendering (without expectedCommand).
 * Validates that the user has unlocked this level.
 */
exports.getLevelById = async (req, res) => {
  try {
    const levelIdx = parseInt(req.params.levelId, 10);
    if (isNaN(levelIdx) || levelIdx < 0 || levelIdx >= LEVELS.length) {
      return res.status(404).json({ error: 'Level not found' });
    }

    // Access control: check if user has unlocked this level
    const userId = req.user.id;
    let progress = await UserProgress.findOne({ userId });
    const highestLevel = progress ? progress.currentHighestLevel : 0;

    if (levelIdx > highestLevel) {
      return res.status(403).json({ error: 'Level not unlocked yet' });
    }

    const level = LEVELS[levelIdx];
    const sanitized = sanitizeLevel(level);

    // Also include total level count so frontend knows when the game ends
    res.json({
      ...sanitized,
      levelIdx,
      totalLevels: LEVELS.length
    });
  } catch (error) {
    console.error('Error fetching level:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * POST /api/levels/:levelId/validate
 * Validates a player's command against the stored regex pattern.
 * Body: { sectionId: string, command: string, currentFiles?: FileState[] }
 * Returns: { correct: boolean, output: string[], newFiles?: FileState[] }
 */
exports.validateCommand = async (req, res) => {
  try {
    const levelIdx = parseInt(req.params.levelId, 10);
    if (isNaN(levelIdx) || levelIdx < 0 || levelIdx >= LEVELS.length) {
      return res.status(404).json({ error: 'Level not found' });
    }

    const { sectionId, command, currentFiles } = req.body;
    if (!sectionId || !command) {
      return res.status(400).json({ error: 'Missing sectionId or command' });
    }

    const level = LEVELS[levelIdx];
    const section = level.sections.find(s => s.id === sectionId);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    // Build RegExp from stored string pattern
    const regex = new RegExp(section.expectedCommand, section.expectedCommandFlags || 'i');
    const cleanCmd = command.trim();
    const isCorrect = regex.test(cleanCmd);

    if (isCorrect) {
      const { output, newFiles } = simulateGitOutput(cleanCmd, section, currentFiles || []);
      return res.json({ correct: true, output, newFiles });
    } else {
      // Generate error output
      let errorOutput = ['fatal: Not a git repository'];
      if (cleanCmd.startsWith('git')) {
        errorOutput = [`git: '${cleanCmd.split(' ')[1]}' is not a git command. See 'git --help'.`];
      }
      return res.json({ correct: false, output: errorOutput });
    }
  } catch (error) {
    console.error('Error validating command:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
