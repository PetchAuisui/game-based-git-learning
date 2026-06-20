// src/components/HUD/HUD.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styles from './HUD.module.css';

interface HUDProps {
  score: number;
  timerStart: number;
  onReset?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onReturnMenu?: () => void;
}

const HUD: React.FC<HUDProps> = ({ score, timerStart, onReset, theme, onToggleTheme, onReturnMenu }) => {
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
      <div className={styles.brandSection}>
        {onReturnMenu && (
          <button className={styles.backBtn} onClick={onReturnMenu} title="กลับสู่หน้าเลือกด่าน">
            ← BACK
          </button>
        )}
        <span className={styles.brandName}>COZY_CMD.EXE</span>
        <span className={styles.lvlBadge}>LVL 14</span>
      </div>

      <div className={styles.controls}>
        {/* Coins / Commits score */}
        <div className={styles.scoreSection}>
          <span className={styles.coinIcon}>🪙</span>
          <span className={styles.scoreVal}>{(score * 128).toLocaleString()} c</span>
        </div>

        {/* Timer Badge */}
        <div className={styles.timerBadge}>
          <span className={styles.clockIcon}>🕒</span>
          <span className={styles.timerText}>{fmt(elapsed)}</span>
        </div>

        {/* Theme Toggle Button */}
        <button className={styles.themeBtn} onClick={onToggleTheme} title="Toggle Theme">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        {/* Reset Button */}
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
