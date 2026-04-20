// src/components/Character/Character.tsx
import React from 'react';
import styles from './Character.module.css';

interface CharacterProps {
  type: 'boss' | 'player';
  label: string;
  isBobbing?: boolean;
}

const Character: React.FC<CharacterProps> = ({ type, label, isBobbing }) => {
  return (
    <div className={`${styles.pxChar} ${styles[type]} ${isBobbing ? styles.bobbing : ''}`}>
      <div className={styles.charHead}>
        {type === 'boss' && (
          <>
            <div className={styles.bossHair} />
            <div className={styles.bossGlasses} />
          </>
        )}
        {type === 'player' && (
          <>
            <div className={styles.playerHair} />
            <div className={styles.playerEyes}>
              <div className={styles.playerEye} />
              <div className={styles.playerEye} />
            </div>
            <div className={styles.playerSweat} />
          </>
        )}
      </div>
      <div className={styles.charBody}>
        {type === 'boss' && <div className={styles.bossTie} />}
      </div>
      <div className={styles.charLegs}>
        <div className={styles.charLeg} />
        <div className={styles.charLeg} />
      </div>
      <div className={styles.charLabel}>{label}</div>
    </div>
  );
};

export default Character;
