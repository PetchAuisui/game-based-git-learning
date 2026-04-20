// src/components/HUD/HUD.tsx
import React from 'react';
import styles from './HUD.module.css';

interface HUDProps {
  stage: string;
  hp: number;
  score: number;
  streak: number;
  timeLeft: number;
  isObserving?: boolean;
  onCompleteStage?: () => void;
  onReturnMenu?: () => void;
}

const HUD: React.FC<HUDProps> = ({ stage, hp, score, streak, timeLeft, isObserving, onCompleteStage, onReturnMenu }) => {
  return (
    <div className={styles.hud}>
      <div className={styles.hudSection}>
        <div className={styles.hudLabel}>STAGE</div>
        <div className={`${styles.hudVal} ${styles.cyan}`}>{stage}</div>
      </div>
      
      <div className={styles.hudSection}>
        <div className={styles.hudLabel}>HP</div>
        <div className={styles.hpHearts}>
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`${styles.heart} ${i >= hp ? styles.lost : ''}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      <div className={styles.hudSection}>
        <div className={styles.hudLabel}>SCORE</div>
        <div className={`${styles.hudVal} ${styles.gold}`}>
          {score.toString().padStart(3, '0')}
        </div>
      </div>

      <div className={styles.hudSection}>
        <div className={styles.hudLabel}>STREAK</div>
        <div className={`${styles.hudVal} ${styles.orange}`}>×{streak}</div>
      </div>

      <div className={`${styles.hudSection} ${styles.timerSection}`}>
        <div className={styles.timerNum}>{timeLeft}</div>
        <div className={styles.hudLabel}>SEC</div>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
        {isObserving && (
          <button 
            className="px-btn" 
            onClick={onCompleteStage} 
            style={{ background: 'var(--gold)', color: '#000', padding: '10px 20px', fontSize: '14px' }}
          >
            รับผลสรุปคะแนน 🌟
          </button>
        )}
        <button 
          className="px-btn" 
          onClick={onReturnMenu} 
          style={{ background: 'transparent', border: '2px solid var(--gray)', color: 'var(--gray)', padding: '10px 15px', fontSize: '12px' }}
        >
          กลับเมนูหลัก ⏏
        </button>
      </div>
    </div>
  );
};

export default HUD;
