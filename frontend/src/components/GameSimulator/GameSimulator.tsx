// src/components/GameSimulator/GameSimulator.tsx
'use client';

import React, { useState, useCallback, useRef } from 'react';
import HUD from '@/components/HUD/HUD';
import Terminal from '@/components/Terminal/Terminal';
import FileExplorer from '@/components/FileExplorer/FileExplorer';
import GitGraph from '@/components/GitGraph/GitGraph';
import { useGameState } from '@/hooks/useGameState';
import styles from './GameSimulator.module.css';

interface GameSimulatorProps {
  onReturnMenu: () => void;
}

const GameSimulator: React.FC<GameSimulatorProps> = ({ onReturnMenu }) => {
  const [history, setHistory] = useState<React.ReactNode[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

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
  } = useGameState();

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
            Make sure the backend server is running on port 3001.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameWrapper}>
      <HUD
        score={score}
        timerStart={timerStart}
        onReset={handleReset}
      />

      <div className={styles.mainContent}>
        {/* Left Sidebar: File Explorer */}
        <div className={styles.leftCol}>
          <FileExplorer 
            files={files} 
            onCreateFile={createOrUpdateFile}
            onUpdateFile={createOrUpdateFile}
            onDeleteFile={deleteFile}
          />
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
    </div>
  );
};

export default GameSimulator;
