// src/components/Tasks/Tasks.tsx
'use client';

import React from 'react';
import { LevelConfig } from '@/hooks/useGameState';
import styles from './Tasks.module.css';

interface TasksProps {
  levels: LevelConfig[];
  currentLevel: LevelConfig | null;
  completedTasks: string[];
  onLoadLevel: (config: LevelConfig) => Promise<void>;
  onUnloadLevel: () => void;
}

function getShortTaskLabel(label: string) {
  return label.replace(/\s*\([^)]*\)\s*$/u, '').trim();
}

const Tasks: React.FC<TasksProps> = ({
  levels,
  currentLevel,
  completedTasks,
  onLoadLevel,
  onUnloadLevel
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.headerIcon}>≈</span>
          <span className={styles.headerTitle}>Tasks</span>
        </div>
        {currentLevel && (
          <button className={styles.clearBtn} onClick={onUnloadLevel} title="Unload level">
            Clear Level
          </button>
        )}
      </div>

      {!currentLevel ? (
        <div className={styles.levelListContainer}>
          <div className={styles.levelListTitle}>กรุณาเลือกด่านเพื่อเริ่มต้น:</div>
          
          {levels.length === 0 ? (
            <div className={styles.emptyLevels}>
              <div className={styles.emptyIcon}>📁</div>
              <div className={styles.emptyText}>ไม่พบไฟล์ด่านในระบบ</div>
              <div className={styles.emptyHint}>กรุณาใส่ไฟล์ด่าน .json ลงในโฟลเดอร์ <code>backend/levels/</code></div>
            </div>
          ) : (
            <div className={styles.levelList}>
              {levels.map(lvl => (
                <button
                  key={lvl.levelId}
                  className={styles.levelCard}
                  onClick={() => onLoadLevel(lvl)}
                >
                  <div className={styles.levelCardHeader}>
                    <span className={styles.levelCardName}>{lvl.levelName}</span>
                    <span className={styles.levelCardCmd}><code>{lvl.command}</code></span>
                  </div>
                  <div className={styles.levelCardDesc}>{lvl.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.levelContent}>
          <div className={styles.levelHeader}>
            <div className={styles.levelName}>Tasks</div>
            <div className={styles.taskSummary}>
              ทั้งหมด {currentLevel.tasks.length} tasks
            </div>
          </div>

          <div className={styles.taskList}>
            {currentLevel.tasks.map((task, index) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <div
                  key={task.id}
                  className={`${styles.taskItem} ${isCompleted ? styles.completed : ''}`}
                >
                  <span className={styles.checkbox}>
                    {isCompleted ? '✓' : ''}
                  </span>
                  <span className={styles.taskNumber}>{index + 1}.</span>
                  <span className={styles.label}>{getShortTaskLabel(task.label)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
