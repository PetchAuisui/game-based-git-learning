const UserProgress = require('../models/UserProgress');

exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    let progress = await UserProgress.findOne({ userId });
    
    if (!progress) {
      progress = await UserProgress.create({ userId });
    }
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { completedLevel, score, coins } = req.body;
    
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
       progress = await UserProgress.create({ userId });
    }
    
    // Anti-Cheat
    if (completedLevel > progress.currentHighestLevel + 1) {
      return res.status(403).json({ error: 'Cheat detected: Invalid level jump.' });
    }

    if (completedLevel === progress.currentHighestLevel) {
      progress.currentHighestLevel += 1;
    }

    progress.stats.totalScore += (score || 0);
    progress.stats.totalCoins += (coins || 0);

    await progress.save();
    res.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { splitterHeight, preset } = req.body;
    
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
       progress = await UserProgress.create({ userId });
    }
    
    if (splitterHeight !== undefined) progress.layoutPreferences.splitterHeight = splitterHeight;
    if (preset !== undefined) progress.layoutPreferences.preset = preset;

    await progress.save();
    res.json({ success: true, layoutPreferences: progress.layoutPreferences });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
