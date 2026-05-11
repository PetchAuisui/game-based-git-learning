import { useState, useCallback, useEffect } from 'react';
import { Level, LevelSection, FileState, ValidateCommandResponse } from '@/types/types';
import api from '@/utils/api';

export interface GameStats {
  score: number;
  hp: number;
  streak: number;
  timeLeft: number;
  mistakes: number;
}

const STORAGE_KEY = 'devlab_git_game_state';

export function useGameState() {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [maxLevelIdx, setMaxLevelIdx] = useState(0);
  const [totalLevels, setTotalLevels] = useState(16);
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

  // Level data fetched from backend (null while loading)
  const [level, setLevel] = useState<Level | null>(null);
  const [isLoadingLevel, setIsLoadingLevel] = useState(true);
  const [levelError, setLevelError] = useState<string | null>(null);

  // Derived: current section
  const section: LevelSection | null = level
    ? level.sections[currentSectionIdx] || level.sections[0]
    : null;

  // ─── Fetch a specific level from the backend ───
  const fetchLevel = useCallback(async (levelIdx: number) => {
    setIsLoadingLevel(true);
    setLevelError(null);
    try {
      const res = await api.get(`/levels/${levelIdx}`);
      const data: Level = res.data;
      setLevel(data);
      setTotalLevels(data.totalLevels);
      setIsLoadingLevel(false);
    } catch (e: any) {
      console.error('Failed to fetch level', e);
      setLevelError(e?.response?.data?.error || 'Failed to load level data');
      setIsLoadingLevel(false);
    }
  }, []);

  // ─── Load initial state on mount ───
  useEffect(() => {
    const loadState = async () => {
      try {
        const response = await api.get('/user/progress');
        const progress = response.data;
        if (progress) {
          setMaxLevelIdx(progress.currentHighestLevel || 0);
          setTotalCoins(progress.stats?.totalCoins || 0);
          setTotalScore(progress.stats?.totalScore || 0);

          // Try loading transient mid-level state from localStorage
          const saved = localStorage.getItem(STORAGE_KEY);
          let startIdx = progress.currentHighestLevel || 0;
          if (saved) {
            const parsed = JSON.parse(saved);
            startIdx = parsed.currentLevelIdx ?? startIdx;
            setCurrentSectionIdx(parsed.currentSectionIdx || 0);
            if (parsed.stats) setStats(prev => ({ ...prev, ...parsed.stats }));
          }
          setCurrentLevelIdx(startIdx);
          // Fetch the level data for this index
          await fetchLevel(startIdx);
        }
      } catch (e) {
        console.error('Failed to load game state from backend', e);
        // Fallback: try to load level 0
        await fetchLevel(0);
      }
    };
    loadState();
  }, [fetchLevel]);

  // ─── Persist transient state to localStorage ───
  useEffect(() => {
    const stateToSave = {
      currentLevelIdx,
      currentSectionIdx,
      stats: {
        score: stats.score,
        hp: stats.hp,
        streak: stats.streak,
        mistakes: stats.mistakes
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [currentLevelIdx, currentSectionIdx, stats]);

  const startLevel = useCallback(() => {
    setShowLevelIntro(false);
  }, []);

  const advanceSection = useCallback(() => {
    if (!level) return;
    if (currentSectionIdx + 1 < level.sections.length) {
      setCurrentSectionIdx(prev => prev + 1);
    } else {
      setIsObserving(true);
    }
  }, [currentSectionIdx, level]);

  const triggerLevelComplete = useCallback(() => {
    setIsObserving(false);
    setIsLevelComplete(true);

    const earnedCoins = stats.score;
    setTotalCoins(prev => prev + earnedCoins);
    setTotalScore(prev => prev + stats.score);
  }, [stats.score]);

  const advanceLevel = useCallback(async () => {
    setIsLevelComplete(false);
    setIsObserving(false);

    // Save completion to backend
    try {
      await api.post('/user/progress', {
        completedLevel: currentLevelIdx,
        score: stats.score,
        coins: stats.score
      });
    } catch (e) {
      console.error('Failed to save progress to backend', e);
    }

    if (currentLevelIdx + 1 < totalLevels) {
      const nextLevel = currentLevelIdx + 1;
      setCurrentLevelIdx(nextLevel);
      setMaxLevelIdx(prev => Math.max(prev, nextLevel));
      setCurrentSectionIdx(0);
      setShowLevelIntro(true);
      setStats({
        score: 100,
        hp: 5,
        streak: 0,
        timeLeft: 60,
        mistakes: 0
      });
      setFiles([]);

      // Fetch next level data from the backend
      await fetchLevel(nextLevel);

      // Auto logic for level starts (level 4 = git status, needs a file)
      // We check using the fetched data, but we can also check by idx
      if (nextLevel === 3) { // levelIdx 3 = lvl 4 = git status
        setFiles([{ id: '1', name: 'index.html', status: 'untracked' }]);
      }
    }
  }, [currentLevelIdx, stats.score, totalLevels, fetchLevel]);

  /**
   * processCommand: sends the player's command to the backend for validation.
   * Returns a promise with { success, output }.
   */
  const processCommand = useCallback(async (cmd: string): Promise<{ success: boolean; output: string[] }> => {
    if (!section || !level) {
      return { success: false, output: ['Error: Level not loaded'] };
    }

    try {
      const res = await api.post<ValidateCommandResponse>(`/levels/${currentLevelIdx}/validate`, {
        sectionId: section.id,
        command: cmd,
        currentFiles: files
      });

      const { correct, output, newFiles } = res.data;

      if (correct) {
        setStats(prev => ({
          ...prev,
          streak: prev.streak + 1,
        }));

        if (newFiles) {
          setFiles(newFiles);
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

      return { success: correct, output };
    } catch (e) {
      console.error('Failed to validate command', e);
      return { success: false, output: ['Error: Could not connect to server'] };
    }
  }, [section, level, currentLevelIdx, files, advanceSection]);

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
    isLoadingLevel,
    levelError,
    startLevel,
    processCommand,
    advanceLevel,
    triggerLevelComplete,
    setTimer
  };
}
