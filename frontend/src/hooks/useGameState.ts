import { useState, useCallback, useEffect } from 'react';
import { LEVELS, Level, LevelSection } from '@/data/levels';
import { processGitCommand, FileState } from '@/utils/gitEngine';

export interface GameStats {
  score: number;
  hp: number;
  streak: number;
  timeLeft: number;
  mistakes: number;
}

const STORAGE_KEY = 'devlab_git_game_state';

export function useGameState() {
  // Initialize state from localStorage if available
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [stats, setStats] = useState<GameStats>({
    score: 100,
    hp: 5,
    streak: 0,
    timeLeft: 60,
    mistakes: 0
  });
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isObserving, setIsObserving] = useState(false);
  const [showLevelIntro, setShowLevelIntro] = useState(true);
  const [files, setFiles] = useState<FileState[]>([]);

  // Load state on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentLevelIdx(parsed.currentLevelIdx || 0);
        setCurrentSectionIdx(parsed.currentSectionIdx || 0);
        setTotalCoins(parsed.totalCoins || 0);
        setTotalScore(parsed.totalScore || 0);
        setStats(prev => ({ ...prev, ...parsed.stats }));
        // Note: we don't restore files or intro state to avoid confusing level restarts
      } catch (e) {
        console.error("Failed to load game state", e);
      }
    }
  }, []);

  // Save state whenever important values change
  useEffect(() => {
    const stateToSave = {
      currentLevelIdx,
      currentSectionIdx,
      totalCoins,
      totalScore,
      stats: {
        score: stats.score,
        hp: stats.hp,
        streak: stats.streak,
        mistakes: stats.mistakes
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [currentLevelIdx, currentSectionIdx, totalCoins, totalScore, stats]);

  const level: Level = LEVELS[currentLevelIdx] || LEVELS[0];
  const section: LevelSection = level.sections[currentSectionIdx] || level.sections[0];
  
  const startLevel = useCallback(() => {
    setShowLevelIntro(false);
  }, []);

  const advanceSection = useCallback(() => {
    if (currentSectionIdx + 1 < level.sections.length) {
      setCurrentSectionIdx(prev => prev + 1);
    } else {
      setIsObserving(true);
    }
  }, [currentSectionIdx, level.sections.length]);

  const triggerLevelComplete = useCallback(() => {
    setIsObserving(false);
    setIsLevelComplete(true);
    
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
      if (LEVELS[currentLevelIdx + 1].lvl === 4) {
        setFiles([{ id: '1', name: 'index.html', status: 'untracked' }]);
      }
    }
  }, [currentLevelIdx]);

  const processCommand = useCallback((cmd: string) => {
    const result = processGitCommand(cmd, section, files);

    if (result.success) {
      setStats(prev => ({
        ...prev,
        streak: prev.streak + 1,
      }));

      if (result.newFiles) {
        setFiles(result.newFiles);
      }

      advanceSection();
    } else {
      setStats(prev => ({
        ...prev,
        hp: Math.max(0, prev.hp - 1),
        streak: 0,
        mistakes: prev.mistakes + 1,
        score: Math.max(0, prev.score - 10)
      }));
    }

    return { success: result.success, output: result.output };
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
