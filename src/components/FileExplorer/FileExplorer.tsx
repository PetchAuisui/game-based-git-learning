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

const FileExplorer: React.FC<FileExplorerProps> = ({ files }) => {
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>C:\Users\GitUser\Project</div>
      <div className={styles.fileList}>
        {files.map(file => (
          <div key={file.id} className={styles.fileItem}>
            <div className={styles.icon}>📄</div>
            <div className={`${styles.name} ${styles[file.status]}`}>
              {file.name}
            </div>
            <div className={styles.statusLabel}>
              ({file.status.toUpperCase()})
            </div>
          </div>
        ))}
        {files.length === 0 && <div className={styles.empty}>Directory is empty</div>}
      </div>
    </div>
  );
};

export default FileExplorer;
