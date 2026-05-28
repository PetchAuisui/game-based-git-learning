// src/components/FileExplorer/FileExplorer.tsx
import React from 'react';
import { FileState } from '@/hooks/useGameState';
import styles from './FileExplorer.module.css';

interface FileExplorerProps {
  files: FileState[];
}

const STATUS_ICON: Record<string, string> = {
  untracked: '📄',
  staged:    '📋',
  committed: '✅',
  modified:  '✏️',
  deleted:   '🗑️',
};

const STATUS_LABEL: Record<string, string> = {
  untracked: 'Untracked',
  staged:    'Staged',
  committed: 'Committed',
  modified:  'Modified',
  deleted:   'Deleted',
};

const FileExplorer: React.FC<FileExplorerProps> = ({ files }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>📁</span>
        <span className={styles.headerTitle}>FILES</span>
        <span className={styles.headerCount}>{files.length}</span>
      </div>

      <div className={styles.path}>~/project</div>

      <div className={styles.fileList}>
        {files.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🗂️</div>
            <div className={styles.emptyText}>No files yet</div>
            <div className={styles.emptyHint}>try: touch file.txt</div>
          </div>
        )}

        {files.map((file) => (
          <div key={file.name} className={`${styles.fileItem} ${styles[file.status] || ''}`}>
            <div className={styles.fileIcon}>{STATUS_ICON[file.status] || '📄'}</div>
            <div className={styles.fileInfo}>
              <div className={styles.fileName}>{file.name}</div>
              <div className={`${styles.fileStatus} ${styles[`status_${file.status}`] || ''}`}>
                {STATUS_LABEL[file.status] || file.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;
