import React, { useEffect, useState } from 'react';
import styles from './LevelSelection.module.css';
import api from '@/utils/api';
import { LevelMeta } from '@/types/types';

interface LevelSelectionProps {
  onStartLevel: (levelIdx: number) => void;
  onBack: () => void;
}

const STORAGE_KEY = 'devlab_git_game_state';

const LevelSelection: React.FC<LevelSelectionProps> = ({ onStartLevel, onBack }) => {
  const [levels, setLevels] = useState<LevelMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get('/levels');
        setLevels(res.data);
      } catch (e: any) {
        console.error('Failed to load level states', e);
        setError('ไม่สามารถโหลดรายการด่านได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLevels();
  }, []);

  const handleLevelClick = (idx: number) => {
    const lvl = levels.find(l => l.levelIdx === idx);
    if (lvl && lvl.isUnlocked) {
      // Save the selected level as current locally for transient state
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

  // ─── Loading State ───
  if (isLoading) {
    return (
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={onBack}>
          ◀ BACK TO MENU
        </button>
        <div className={styles.header}>
          <h1 className={styles.title}>LEVEL SELECTION</h1>
          <p className={styles.subtitle}>Loading missions...</p>
        </div>
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`${styles.card} ${styles.skeleton}`}>
              <div className={styles.skeletonLine} style={{ width: '40%' }} />
              <div className={styles.skeletonLine} style={{ width: '70%' }} />
              <div className={styles.skeletonLine} style={{ width: '30%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Error State ───
  if (error) {
    return (
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={onBack}>
          ◀ BACK TO MENU
        </button>
        <div className={styles.header}>
          <h1 className={styles.title}>LEVEL SELECTION</h1>
        </div>
        <div className={styles.errorBox}>
          <p className={styles.errorText}>⚠️ {error}</p>
          <button className={styles.retryBtn} onClick={() => window.location.reload()}>
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  // ─── Normal Render ───
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
        {levels.map((level) => {
          const isUnlocked = level.isUnlocked;
          return (
            <div
              key={level.levelIdx}
              className={`${styles.card} ${isUnlocked ? styles.unlocked : styles.locked}`}
              onClick={() => handleLevelClick(level.levelIdx)}
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
