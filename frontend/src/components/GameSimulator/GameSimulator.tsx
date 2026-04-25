// src/components/GameSimulator/GameSimulator.tsx
'use client';

import React, { useState, useEffect } from 'react';
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
  const {
    level,
    section,
    stats,
    files,
    isLevelComplete,
    isObserving,
    showLevelIntro,
    startLevel,
    processCommand,
    advanceLevel,
    triggerLevelComplete,
    setTimer
  } = useGameState();

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isLevelComplete && !isObserving && !showLevelIntro) {
      timer = setInterval(() => {
        setTimer(stats.timeLeft > 0 ? stats.timeLeft - 1 : 0);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLevelComplete, isObserving, showLevelIntro, stats.timeLeft, setTimer]);

  const handleCommand = (cmd: string) => {
    if (isLevelComplete || isObserving || showLevelIntro) return;
    
    const { success, output } = processCommand(cmd);

    setHistory((prev) => {
       const newHistory = [...prev, `devlab@git:~$ ${cmd}`];
       output.forEach(line => {
          if (line.includes('<span style="color:red">')) {
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
        <div className={styles.leftCol}>
          <div className={styles.graphWrapper}>
            <GitGraph type={level.lvl === 1 ? 'none' : 'init'} />
          </div>
          <div className={styles.terminalWrapper}>
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
