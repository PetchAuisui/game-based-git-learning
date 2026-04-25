/* src/components/QuestPanel/QuestPanel.tsx */
import React from 'react';
import styles from './QuestPanel.module.css';

interface QuestPanelProps {
  quest: string;
  hint: string;
}

const QuestPanel: React.FC<QuestPanelProps> = ({ quest, hint }) => {
  return (
    <div className={styles.container}>
      <div className={styles.qBlock}>
        <div className={`${styles.qTitle} ${styles.green}`}>
          <span>▸</span> Mission Objectives
        </div>
        <p>{quest}</p>
      </div>

      <div className={styles.qBlock}>
        <div className={`${styles.qTitle} ${styles.gold}`}>
          <span>⚡</span> Hint
        </div>
        <p className={styles.goldText}>{hint}</p>
      </div>
    </div>
  );
};

export default QuestPanel;
