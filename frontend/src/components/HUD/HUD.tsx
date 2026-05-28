// src/components/HUD/HUD.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styles from './HUD.module.css';

interface HUDProps {
  score: number;
  timerStart: number;
  onReset?: () => void;
}

const HUD: React.FC<HUDProps> = ({ score, timerStart, onReset }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const update = () => setElapsed(Math.max(0, Math.floor((Date.now() - timerStart) / 1000)));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [timerStart]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className={styles.hud}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>⬡</span>
        <span className={styles.brandName}>GIT SANDBOX</span>
      </div>

      <div className={styles.hudSection}>
        <div className={styles.hudLabel}>COMMITS</div>
        <div className={`${styles.hudVal} ${styles.gold}`}>{score.toString().padStart(3, '0')}</div>
      </div>

      <div className={styles.hudSection}>
        <div className={styles.hudLabel}>STATUS</div>
        <div className={`${styles.hudVal} ${styles.green}`}>● LIVE</div>
      </div>

      <div className={styles.hudSection}>
        <div className={styles.hudLabel}>ELAPSED</div>
        <div className={`${styles.hudVal} ${styles.timer}`}>{fmt(elapsed)}</div>
      </div>

      <div className={styles.controls}>
        {onReset && (
          <button
            className={styles.resetBtn}
            onClick={() => {
              if (window.confirm('Reset the entire sandbox? All commits and files will be deleted.')) {
                onReset();
              }
            }}
          >
            ⟳ Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default HUD;
