// src/components/GameSimulator/GameSimulator.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import HUD from '@/components/HUD/HUD';
import Terminal from '@/components/Terminal/Terminal';
import FileExplorer from '@/components/FileExplorer/FileExplorer';
import GitGraph from '@/components/GitGraph/GitGraph';
import Tasks from '@/components/Tasks/Tasks';
import { useGameState, LevelConfig } from '@/hooks/useGameState';
import styles from './GameSimulator.module.css';

interface GameSimulatorProps {
  selectedLevel: LevelConfig | null;
  onReturnMenu: () => void;
}

const GameSimulator: React.FC<GameSimulatorProps> = ({ selectedLevel, onReturnMenu }) => {
  const [history, setHistory] = useState<React.ReactNode[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('game-theme') as 'light' | 'dark';
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('game-theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  const {
    files,
    gitGraph,
    isInitialized,
    score,
    timerStart,
    isLoading,
    error,
    executeCommand,
    resetSandbox,
    createOrUpdateFile,
    deleteFile,
    currentLevel,
    completedTasks,
    isLevelCompleted,
    loadLevel,
    unloadLevel,
    levels,
  } = useGameState();

  // Load level on mount or when selectedLevel changes
  useEffect(() => {
    if (selectedLevel) {
      loadLevel(selectedLevel);
    }
  }, [selectedLevel, loadLevel]);

  // Resizable splitter between graph and terminal
  const [splitterHeight, setSplitterHeight] = useState(55);
  const rightColRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback((e: MouseEvent) => {
    if (!rightColRef.current) return;
    const rect = rightColRef.current.getBoundingClientRect();
    let newHeight = ((e.clientY - rect.top) / rect.height) * 100;
    if (newHeight < 20) newHeight = 20;
    if (newHeight > 80) newHeight = 80;
    setSplitterHeight(newHeight);
  }, []);

  const handleSplitterMouseDown = useCallback(() => {
    const moveHandler = (e: MouseEvent) => handleDrag(e);
    const upHandler = () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
    };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  }, [handleDrag]);

  const handleCommand = useCallback(async (cmd: string) => {
    if (isExecuting) return;

    // Add command to history immediately
    setHistory(prev => [...prev, `~/project $ ${cmd}`]);

    // Handle clear locally
    if (cmd.trim() === 'clear') {
      setHistory([]);
      return;
    }

    setIsExecuting(true);
    const { output } = await executeCommand(cmd);
    setIsExecuting(false);

    setHistory(prev => {
      const newHistory = [...prev];
      output.forEach(line => {
        if (typeof line === 'string' && line.includes('<span')) {
          newHistory.push(<span key={Math.random()} dangerouslySetInnerHTML={{ __html: line }} />);
        } else {
          newHistory.push(line);
        }
      });
      return newHistory;
    });
  }, [isExecuting, executeCommand]);

  const handleReset = useCallback(async () => {
    await resetSandbox();
    setHistory([]);
  }, [resetSandbox]);

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className={styles.gameWrapper}>
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Connecting to Sandbox...</p>
        </div>
      </div>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <div className={styles.gameWrapper}>
        <div className={styles.loadingOverlay}>
          <p className={styles.loadingText}>⚠️ {error}</p>
          <p className={styles.loadingText} style={{ fontSize: '12px', marginTop: '8px', opacity: 0.6 }}>
            Make sure the backend server is running on port 5001.
          </p>
        </div>
      </div>
    );
  }

  const levelIndex = levels.findIndex(l => l.levelId === currentLevel?.levelId);
  const levelNumber = levelIndex !== -1 ? levelIndex + 1 : null;

  return (
    <div className={styles.gameWrapper}>
      <HUD
        score={score}
        timerStart={timerStart}
        onReset={handleReset}
        theme={theme}
        onToggleTheme={toggleTheme}
        onReturnMenu={onReturnMenu}
        levelNumber={levelNumber}
      />

      <div className={styles.mainContent}>
        {/* Left Sidebar: Tasks + File Explorer */}
        <div className={styles.leftCol}>
          <div className={styles.tasksCard}>
            <Tasks
              levels={levels}
              currentLevel={currentLevel}
              completedTasks={completedTasks}
              onLoadLevel={loadLevel}
            />
          </div>
          <div className={styles.filesCard}>
            <FileExplorer 
              files={files} 
              onCreateFile={createOrUpdateFile}
              onUpdateFile={createOrUpdateFile}
              onDeleteFile={deleteFile}
            />
          </div>
        </div>

        {/* Right Main Area: Git Graph (top) + Terminal (bottom) */}
        <div className={styles.rightCol} ref={rightColRef}>
          {/* Git Graph */}
          <div className={styles.graphWrapper} style={{ height: `${splitterHeight}%` }}>
            <GitGraph data={gitGraph} isInitialized={isInitialized} />
          </div>

          {/* Resizable Splitter */}
          <div
            className={styles.splitter}
            onMouseDown={handleSplitterMouseDown}
          />

          {/* Terminal */}
          <div className={styles.terminalWrapper} style={{ height: `${100 - splitterHeight}%` }}>
            <Terminal
              onCommand={handleCommand}
              history={history}
            />
          </div>
        </div>
      </div>

      {/* Executing indicator */}
      {isExecuting && (
        <div className={styles.validatingBanner}>
          Executing...
        </div>
      )}

      {/* Success Modal */}
      {isLevelCompleted && currentLevel && (
        <div className={styles.successOverlay}>
          <div className={styles.successModal}>
            <div className={styles.successIcon}>🎉</div>
            <h2 className={styles.successTitle}>ยินดีด้วย! คุณผ่านด่านแล้ว</h2>
            <div className={styles.successLevelName}>{currentLevel.levelName}</div>
            {currentLevel.completionMessage ? (
              <p className={styles.successDesc}>
                {currentLevel.completionMessage}
              </p>
            ) : (
              <p className={styles.successDesc}>
                คุณได้เรียนรู้และเข้าใจการใช้งานคำสั่ง <code>{currentLevel.command}</code> เป็นที่เรียบร้อยแล้ว
              </p>
            )}
            <div className={styles.successActions}>
              <button className={styles.successBtnSecondary} onClick={handleReset}>
                เล่นอีกครั้ง (Reset)
              </button>
              <button className={styles.successBtnPrimary} onClick={onReturnMenu}>
                เลือกด่านใหม่ (New Level)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSimulator;
