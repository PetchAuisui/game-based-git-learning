import { useState, useCallback } from 'react';
import { LEVELS, Level, LevelSection, ActionType } from '@/data/levels';

export interface GameStats {
  score: number;
  hp: number;
  streak: number;
  timeLeft: number;
  mistakes: number;
}

export function useGameState() {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  
  // Stats for the current section/level
  const [stats, setStats] = useState<GameStats>({
    score: 100, // Starts at 100 for the level
    hp: 5,
    streak: 0,
    timeLeft: 60,
    mistakes: 0
  });

  const [totalCoins, setTotalCoins] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const level: Level = LEVELS[currentLevelIdx] || LEVELS[0];
  const section: LevelSection = level.sections[currentSectionIdx] || level.sections[0];
  
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isObserving, setIsObserving] = useState(false);
  const [showLevelIntro, setShowLevelIntro] = useState(true);

  // VFS (Virtual File System)
  const [files, setFiles] = useState<{ id: string; name: string; status: 'untracked' | 'staged' | 'committed' | 'deleted' }[]>([]);

  const startLevel = useCallback(() => {
    setShowLevelIntro(false);
  }, []);

  const advanceSection = useCallback(() => {
    if (currentSectionIdx + 1 < level.sections.length) {
      setCurrentSectionIdx(prev => prev + 1);
    } else {
      // Level is complete! Let user observe first
      setIsObserving(true);
    }
  }, [currentSectionIdx, level.sections.length]);

  const triggerLevelComplete = useCallback(() => {
    setIsObserving(false);
    setIsLevelComplete(true);
    
    const earnedStars = stats.score === 100 ? 3 : stats.score >= 90 ? 2 : 1;
    const earnedCoins = stats.score;
    
    setTotalCoins(prev => prev + earnedCoins);
    setTotalScore(prev => prev + stats.score);
  }, [stats.score]);

  const advanceLevel = useCallback(() => {
    setIsLevelComplete(false);
    setIsObserving(false);
    if (currentLevelIdx + 1 < LEVELS.length) {
      setCurrentLevelIdx(prev => prev + 1);
      setCurrentSectionIdx(0);
      setShowLevelIntro(true);
      setStats({
        score: 100,
        hp: 5,
        streak: 0,
        timeLeft: 60,
        mistakes: 0
      });
      
      
      // Auto logic for level starts
      if (LEVELS[currentLevelIdx + 1].lvl === 4) { // Status level: prep untracked file
        setFiles([{ id: '1', name: 'index.html', status: 'untracked' }]);
      }
    }
  }, [currentLevelIdx]);

  const processCommand = useCallback((cmd: string) => {
    const cleanCmd = cmd.trim();
    let isCorrect = false;

    if (typeof section.expectedCommand === 'string') {
      isCorrect = cleanCmd === section.expectedCommand;
    } else {
      isCorrect = section.expectedCommand.test(cleanCmd);
    }

    if (isCorrect) {
      setStats(prev => ({
        ...prev,
        score: prev.score,
        streak: prev.streak + 1,
      }));

      let output: string[] = [];

      // Simulated Git output and VFS Effects
      if (cleanCmd.startsWith('git version')) {
        output = ['git version 2.40.1.windows.1'];
      } else if (cleanCmd.startsWith('git config')) {
        output = []; // no output for successful config
      } else if (cleanCmd.startsWith('git init')) {
        output = ['Initialized empty Git repository in C:/Project/.git/'];
      } else if (cleanCmd.startsWith('git status')) {
        output = ['On branch main', '', 'No commits yet', ''];
        
        const untracked = files.filter(f => f.status === 'untracked');
        const staged = files.filter(f => f.status === 'staged');
        
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
        setFiles(prev => prev.map(f => ({ ...f, status: 'staged' })));
      } else if (section.action === 'GIT_COMMIT') {
        output = [`[main (root-commit) 1a2b3c4] ${cleanCmd.includes('-m') ? cleanCmd.split('-m')[1] : 'Initial commit'}`, ` 1 file changed, 10 insertions(+)`, ` create mode 100644 index.html`];
        setFiles(prev => prev.map(f => f.status === 'staged' ? { ...f, status: 'committed' } : f));
      } else if (section.action === 'GIT_RESTORE') {
        output = [];
        if (cleanCmd.includes('--staged')) {
           setFiles(prev => prev.map(f => f.status === 'staged' ? { ...f, status: 'untracked' } : f));
        } else {
           setFiles(prev => prev.map(f => f.name === 'index.html' ? { ...f, status: 'committed' } : f));
        }
      } else if (section.action === 'GIT_RESET') {
        output = ['Unstaged changes after reset:']; // simplified
        if (cleanCmd.includes('--mixed')) setFiles(prev => prev.map(f => ({ ...f, status: 'untracked' })));
        if (cleanCmd.includes('--hard')) {
           output = ['HEAD is now at 1a2b3c4 Initial commit'];
           setFiles([]);
        }
      }
      
      // Default to empty array if no specific matches
      if (!output) output = [];

      advanceSection();
      return { success: true, output };
    } else {
      setStats(prev => ({
        ...prev,
        hp: Math.max(0, prev.hp - 1),
        streak: 0,
        mistakes: prev.mistakes + 1,
        score: Math.max(0, prev.score - 10)
      }));
      
      let errorOutput = [`fatal: Not a git repository`];
      if (cleanCmd.startsWith('git')) {
         errorOutput = [`git: '${cleanCmd.split(' ')[1]}' is not a git command. See 'git --help'.`];
      }
      return { success: false, output: errorOutput };
    }
  }, [section, advanceSection, files]);

  const setTimer = (timeLeft: number) => setStats(prev => ({ ...prev, timeLeft }));

  return {
    level,
    section,
    stats,
    totalCoins,
    totalScore,
    isLevelComplete,
    isObserving,
    showLevelIntro,
    files,
    startLevel,
    processCommand,
    advanceLevel,
    triggerLevelComplete,
    setTimer
  };
}
