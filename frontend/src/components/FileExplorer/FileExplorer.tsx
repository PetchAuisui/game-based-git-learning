// src/components/FileExplorer/FileExplorer.tsx
import React from 'react';
import styles from './FileExplorer.module.css';

interface FileItem {
  id: string;
  name: string;
  status: 'untracked' | 'staged' | 'committed';
}

interface FileExplorerProps {
  files: FileItem[];
}

const statusLabel: Record<string, string> = {
  untracked: 'New',
  staged:    'Staged',
  committed: 'Saved',
};

const FileExplorer: React.FC<FileExplorerProps> = ({ files }) => {
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>~/project</div>
      <div className={styles.fileList}>
        {files.map(file => (
          <div key={file.id} className={`${styles.fileItem} ${styles[file.status]}`}>
            <div className={styles.icon}>📄</div>
            <div className={styles.name}>{file.name}</div>
            <div className={styles.statusLabel}>
              {statusLabel[file.status] ?? file.status}
            </div>
          </div>
        ))}
        {files.length === 0 && (
          <div className={styles.empty}>Directory is empty</div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
