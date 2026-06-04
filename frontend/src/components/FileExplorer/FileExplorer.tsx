// src/components/FileExplorer/FileExplorer.tsx
import React, { useState } from 'react';
import { FileState } from '@/hooks/useGameState';
import styles from './FileExplorer.module.css';

interface FileExplorerProps {
  files: FileState[];
  onCreateFile?: (name: string, content: string) => Promise<boolean>;
  onUpdateFile?: (name: string, content: string) => Promise<boolean>;
  onDeleteFile?: (name: string) => Promise<boolean>;
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

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onCreateFile, onUpdateFile, onDeleteFile }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim() && onCreateFile) {
      await onCreateFile(newFileName.trim(), '');
      setNewFileName('');
      setIsCreating(false);
    }
  };

  const handleEditClick = (file: FileState) => {
    setEditingFile(file.name);
    setEditContent(file.content || '');
  };

  const handleEditSave = async () => {
    if (editingFile && onUpdateFile) {
      await onUpdateFile(editingFile, editContent);
      setEditingFile(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>📁</span>
          <span className={styles.headerTitle}>FILES</span>
          <span className={styles.headerCount}>{files.length}</span>
        </div>
        {onCreateFile && (
          <button className={styles.newBtn} onClick={() => setIsCreating(true)} title="New File">
            +
          </button>
        )}
      </div>

      <div className={styles.path}>~/project</div>

      <div className={styles.fileList}>
        {isCreating && (
          <form className={styles.createForm} onSubmit={handleCreateSubmit}>
            <span className={styles.fileIcon}>📄</span>
            <input 
              type="text" 
              className={styles.createInput} 
              placeholder="filename.txt" 
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              autoFocus
              onBlur={() => { if(!newFileName) setIsCreating(false); }}
            />
          </form>
        )}

        {files.length === 0 && !isCreating && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🗂️</div>
            <div className={styles.emptyText}>No files yet</div>
            <div className={styles.emptyHint}>try: touch file.txt</div>
          </div>
        )}

        {files.map((file) => (
          <div key={file.name} className={styles.fileWrapper}>
            <div className={`${styles.fileItem} ${styles[file.status] || ''}`}>
              <div className={styles.fileIcon}>{STATUS_ICON[file.status] || '📄'}</div>
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>{file.name}</div>
                <div className={`${styles.fileStatus} ${styles[`status_${file.status}`] || ''}`}>
                  {STATUS_LABEL[file.status] || file.status}
                </div>
              </div>
              <div className={styles.fileActions}>
                {onUpdateFile && (
                  <button className={styles.actionBtn} onClick={() => handleEditClick(file)} title="Edit">✏️</button>
                )}
                {onDeleteFile && (
                  <button className={styles.actionBtn} onClick={() => onDeleteFile(file.name)} title="Delete">🗑️</button>
                )}
              </div>
            </div>
            
            {editingFile === file.name && (
              <div className={styles.editorBox}>
                <textarea 
                  className={styles.editorTextarea}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  spellCheck={false}
                />
                <div className={styles.editorActions}>
                  <button className={styles.cancelBtn} onClick={() => setEditingFile(null)}>Cancel</button>
                  <button className={styles.saveBtn} onClick={handleEditSave}>Save</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;
