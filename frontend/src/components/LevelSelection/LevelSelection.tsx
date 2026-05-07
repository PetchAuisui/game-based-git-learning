// src/components/LevelSelection/LevelSelection.tsx
import React, { useEffect, useState } from 'react';
import { LEVELS } from '@/data/levels';
import styles from './LevelSelection.module.css';

interface LevelSelectionProps {
  onStartLevel: (levelIdx: number) => void;
  onBack: () => void;
}

const STORAGE_KEY = 'devlab_git_game_state';

const LevelSelection: React.FC<LevelSelectionProps> = ({ onStartLevel, onBack }) => {
  const [maxLevelIdx, setMaxLevelIdx] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMaxLevelIdx(parsed.maxLevelIdx ?? parsed.currentLevelIdx ?? 0);
      } catch (e) {
        console.error("Failed to load game state", e);
      }
    }
  }, []);

  const handleLevelClick = (idx: number) => {
    if (idx <= maxLevelIdx) {
      // Save the selected level as current
      const saved = localStorage.getItem(STORAGE_KEY);
      let parsed = {};
      if (saved) {
        try {
          parsed = JSON.parse(saved);
        } catch (e) {}
      }
      
      const stateToSave = {
        ...parsed,
        currentLevelIdx: idx,
        currentSectionIdx: 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      onStartLevel(idx);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={onBack}>
        ◀ BACK TO MENU
      </button>
      <div className={styles.header}>
        <h1 className={styles.title}>LEVEL SELECTION</h1>
        <p className={styles.subtitle}>Choose your mission</p>
      </div>
      
      <div className={styles.grid}>
        {LEVELS.map((level, idx) => {
          const isUnlocked = idx <= maxLevelIdx;
          return (
            <div 
              key={idx}
              className={`${styles.card} ${isUnlocked ? styles.unlocked : styles.locked}`}
              onClick={() => handleLevelClick(idx)}
            >
              <div className={styles.levelNumber}>LVL {level.lvl}</div>
              <div className={styles.levelName}>{level.name}</div>
              <div className={styles.levelTag}>{level.tag}</div>
              {!isUnlocked && <div className={styles.lockIcon}>🔒</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelection;
