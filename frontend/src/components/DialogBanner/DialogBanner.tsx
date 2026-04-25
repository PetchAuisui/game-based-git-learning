// src/components/DialogBanner/DialogBanner.tsx
import React from 'react';
import Character from '../Character/Character';
import styles from './DialogBanner.module.css';

interface DialogBannerProps {
  npcLine: string;
}

const DialogBanner: React.FC<DialogBannerProps> = ({ npcLine }) => {
  return (
    <div className={styles.banner}>
      <div className={styles.avatar}>
        <Character type="boss" label="หัวหน้า" isBobbing />
      </div>
      <div className={styles.dialogBox}>
        <div className={styles.speaker}>หัวหน้า:</div>
        <div className={styles.typewriterWrapper}>
          <p className={styles.typewriterText} dangerouslySetInnerHTML={{ __html: npcLine }} />
        </div>
      </div>
    </div>
  );
};

export default DialogBanner;
