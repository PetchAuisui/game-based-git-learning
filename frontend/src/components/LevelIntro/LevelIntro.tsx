import React from 'react';
import styles from './LevelIntro.module.css';
import { Level, LevelSection } from '@/data/levels';

interface LevelIntroProps {
  level: Level;
  section: LevelSection;
  onStart: () => void;
}

export default function LevelIntro({ level, section, onStart }: LevelIntroProps) {
  // Try to use a robot or the boss icon. The user liked the robot image, 
  // but we are using 8-bit theme. Let's use a nice CSS glowing box to match the premium theme.
  
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Left Character Area */}
        <div className={styles.leftPane}>
          <div className={styles.avatarContainer}>
            {/* Simple pixel sprite placeholder using CSS */}
            <div className={styles.pixelAvatar}></div>
            <div className={styles.levelBadge}>{level.tag}</div>
          </div>
        </div>

        {/* Right Info Area */}
        <div className={styles.rightPane}>
          <div className={styles.badge}>MISSION BRIEFING</div>
          
          <h1 className={styles.title}>
            ด่านที่ {level.lvl} : {level.name}
          </h1>
          
          <h2 className={styles.subtitle}>
            State {section.id} : {section.quest}
          </h2>
          
          <div className={styles.quoteBox}>
            <p>"{section.conversations[0]?.text}"</p>
          </div>
          
          <button className={`px-btn ${styles.startBtn}`} onClick={onStart}>
            เริ่มเรียนรู้เลย →
          </button>
        </div>
      </div>
    </div>
  );
}
