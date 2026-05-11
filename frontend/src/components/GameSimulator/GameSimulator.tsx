// src/components/GameSimulator/GameSimulator.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';
import api from '@/utils/api';
import HUD from '@/components/HUD/HUD';
import QuestPanel from '@/components/QuestPanel/QuestPanel';
import Terminal from '@/components/Terminal/Terminal';
import FileExplorer from '@/components/FileExplorer/FileExplorer';
import GitGraph from '@/components/GitGraph/GitGraph';
import DialogBanner from '@/components/DialogBanner/DialogBanner';
import LevelIntro from '@/components/LevelIntro/LevelIntro';
import { useGameState } from '@/hooks/useGameState';
import styles from './GameSimulator.module.css';

interface GameSimulatorProps {
  onReturnMenu: () => void;
}

const GameSimulator: React.FC<GameSimulatorProps> = ({ onReturnMenu }) => {
  const [history, setHistory] = useState<React.ReactNode[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const {
    level,
    section,
    stats,
    files,
    isLevelComplete,
    isObserving,
    showLevelIntro,
    isLoadingLevel,
    levelError,
    startLevel,
    processCommand,
    advanceLevel,
    triggerLevelComplete,
    setTimer
  } = useGameState();

  const [splitterHeight, setSplitterHeight] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load initial settings
  useEffect(() => {
    api.get('/user/progress').then(res => {
       if (res.data && res.data.layoutPreferences && res.data.layoutPreferences.splitterHeight) {
          setSplitterHeight(res.data.layoutPreferences.splitterHeight);
       }
    }).catch(() => {});
  }, []);

  const debouncedSaveSettings = useCallback(
    debounce(async (newHeight: number) => {
      try {
        await api.put('/user/settings', { splitterHeight: newHeight });
      } catch (err) {
        console.error('Failed to save settings');
      }
    }, 1000),
    []
  );

  const handleDrag = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const containerHeight = containerRef.current.getBoundingClientRect().height;
    const containerTop = containerRef.current.getBoundingClientRect().top;
    let newHeight = ((e.clientY - containerTop) / containerHeight) * 100;

    if (newHeight < 20) newHeight = 20;
    if (newHeight > 80) newHeight = 80;

    setSplitterHeight(newHeight);
    debouncedSaveSettings(newHeight);
  };

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isLevelComplete && !isObserving && !showLevelIntro && !isLoadingLevel) {
      timer = setInterval(() => {
        setTimer(stats.timeLeft > 0 ? stats.timeLeft - 1 : 0);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLevelComplete, isObserving, showLevelIntro, isLoadingLevel, stats.timeLeft, setTimer]);

  const handleCommand = async (cmd: string) => {
    if (isLevelComplete || isObserving || showLevelIntro || isValidating) return;

    setIsValidating(true);
    const { success, output } = await processCommand(cmd);
    setIsValidating(false);

    setHistory((prev) => {
       const newHistory = [...prev, `devlab@git:~$ ${cmd}`];
       output.forEach(line => {
          if (typeof line === 'string' && line.includes('<span style="color:red">')) {
             newHistory.push(<span dangerouslySetInnerHTML={{ __html: line }} />);
          } else {
             newHistory.push(line);
          }
       });
       if (!success) {
          newHistory.push(``);
       }
       return newHistory;
    });
  };

  const handleNextLevel = () => {
    advanceLevel();
    setHistory([]);
  };

  // ─── Loading State ───
  if (isLoadingLevel) {
    return (
      <div className={styles.gameWrapper}>
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Loading level data...</p>
        </div>
      </div>
    );
  }

  // ─── Error State ───
  if (levelError || !level || !section) {
    return (
      <div className={styles.gameWrapper}>
        <div className={styles.loadingOverlay}>
          <p className={styles.loadingText}>⚠️ {levelError || 'Failed to load level'}</p>
          <button
            style={{ marginTop: '16px', padding: '10px 20px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #555', background: '#222', color: '#fff' }}
            onClick={onReturnMenu}
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameWrapper}>
      {showLevelIntro && <LevelIntro level={level} section={section} onStart={startLevel} />}

      <HUD
        stage={level.tag}
        hp={stats.hp}
        score={stats.score}
        streak={stats.streak}
        timeLeft={stats.timeLeft}
        isObserving={isObserving}
        onCompleteStage={triggerLevelComplete}
        onReturnMenu={onReturnMenu}
      />

      <DialogBanner npcLine={isObserving ? 'ภารกิจสำเร็จ! ✨ ลองสังเกตผลที่เกิดขึ้นในหน้าต่าง Terminal หรือ File Explorer ก่อนสิครับ!' : (section.conversations[0]?.text || '')} />

      <div className={styles.mainContent}>
        {/* Left Column: GitGraph and Terminal */}
        <div className={styles.leftCol} ref={containerRef} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={styles.graphWrapper} style={{ height: `${splitterHeight}%` }}>
            <GitGraph type={level.lvl === 1 ? 'none' : 'init'} />
          </div>

          <div
             className={styles.splitter}
             style={{ height: '8px', cursor: 'row-resize', backgroundColor: '#333' }}
             onMouseDown={(e) => {
                const moveHandler = (ev: MouseEvent) => handleDrag(ev as unknown as React.MouseEvent);
                const upHandler = () => {
                   document.removeEventListener('mousemove', moveHandler);
                   document.removeEventListener('mouseup', upHandler);
                };
                document.addEventListener('mousemove', moveHandler);
                document.addEventListener('mouseup', upHandler);
             }}
          />

          <div className={styles.terminalWrapper} style={{ height: `${100 - splitterHeight}%` }}>
            <Terminal onCommand={handleCommand} history={history} />
          </div>
        </div>

        {/* Right Column: Quests and Files */}
        <div className={styles.rightCol}>
          <div className={styles.questWrapper}>
            <QuestPanel
              quest={section.quest}
              hint={section.hint}
            />
          </div>
          <div className={styles.explorerWrapper}>
            <FileExplorer files={files} />
          </div>
        </div>
      </div>

      {/* Validating indicator */}
      {isValidating && (
        <div className={styles.validatingBanner}>
          Checking...
        </div>
      )}

      {/* Level Complete Overlay */}
      {isLevelComplete && (
        <div className={styles.levelCompleteOverlay}>
           <div className={styles.lcBox}>
             <h2>STAGE CLEARED!</h2>
             <div className={styles.lcScore}>Score: {stats.score}</div>
             <div className={styles.lcStars}>
               {stats.score === 100 ? '⭐️⭐️⭐️' : stats.score >= 90 ? '⭐️⭐️' : '⭐️'}
             </div>
             <button className={styles.lcBtn} onClick={handleNextLevel}>NEXT STAGE ▶</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default GameSimulator;
