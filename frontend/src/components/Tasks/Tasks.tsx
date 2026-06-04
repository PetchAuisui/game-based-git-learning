// src/components/Tasks/Tasks.tsx
'use client';

import React from 'react';
import styles from './Tasks.module.css';

interface TasksProps {
  isInitialized: boolean;
  hasFiles: boolean;
  score: number;
}

const Tasks: React.FC<TasksProps> = ({ isInitialized, hasFiles, score }) => {
  const tasksList = [
    {
      id: 'firewall',
      label: 'Bypass Firewall',
      completed: isInitialized,
    },
    {
      id: 'dat_files',
      label: 'Download .DAT files',
      completed: hasFiles,
    },
    {
      id: 'audit_logs',
      label: 'Erase audit logs',
      completed: score >= 2,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>≈</span>
        <span className={styles.headerTitle}>Tasks</span>
      </div>

      <div className={styles.taskList}>
        {tasksList.map(task => (
          <div
            key={task.id}
            className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}
          >
            <span className={styles.checkbox}>
              {task.completed ? '✓' : ''}
            </span>
            <span className={styles.label}>{task.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
