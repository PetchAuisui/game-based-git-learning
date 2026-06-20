// src/components/LevelSelector/LevelSelector.tsx
'use client';

import React from 'react';
import { LevelConfig } from '@/hooks/useGameState';
import styles from './LevelSelector.module.css';

interface LevelSelectorProps {
  levels: LevelConfig[];
  onSelectLevel: (level: LevelConfig) => void;
  onBackToMenu: () => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  onSelectLevel,
  onBackToMenu,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBackToMenu}>
          ← ย้อนกลับ (Back)
        </button>
        <h1 className={styles.headerTitle}>ภารกิจจำลองการเรียนรู้ GIT</h1>
      </div>

      <div className={styles.content}>
        <p className={styles.intro}>กรุณาเลือกด่านที่คุณต้องการเริ่มเรียนรู้และฝึกปฏิบัติการใช้งานคำสั่ง Git:</p>

        {levels.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📂</div>
            <h3 className={styles.emptyTitle}>ไม่พบด่านจำลองในระบบ</h3>
            <p className={styles.emptyText}>
              กรุณาใส่ไฟล์ด่าน <code>.json</code> ลงในโฟลเดอร์ <code>backend/levels/</code> เพื่อสร้างด่านการเรียนรู้ของคุณ
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {levels.map((lvl) => (
              <div key={lvl.levelId} className={styles.card} onClick={() => onSelectLevel(lvl)}>
                <div className={styles.cardHeader}>
                  <span className={styles.levelName}>{lvl.levelName}</span>
                  <span className={styles.levelCmd}><code>{lvl.command}</code></span>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.levelDesc}>{lvl.description}</p>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.startBtn}>👉 เริ่มต้นทำภารกิจ</span>
                  <span className={styles.tasksCount}>{lvl.tasks.length} ภารกิจย่อย</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelSelector;
