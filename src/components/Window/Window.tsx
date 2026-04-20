// src/components/Window/Window.tsx
import React from 'react';
import styles from './Window.module.css';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  height?: string;
  width?: string;
}

const Window: React.FC<WindowProps> = ({ title, children, height, width }) => {
  return (
    <div className={styles.window} style={{ height, width }}>
      <div className={styles.titleBar}>
        <div className={styles.titleText}>{title}</div>
        <div className={styles.titleButtons}>
          <button className={styles.winButton}>_</button>
          <button className={styles.winButton}>x</button>
        </div>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default Window;
