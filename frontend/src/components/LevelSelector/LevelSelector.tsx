// src/components/LevelSelector/LevelSelector.tsx
'use client';

import React, { useState } from 'react';
import { LevelConfig } from '@/hooks/useGameState';
import styles from './LevelSelector.module.css';

interface LevelSelectorProps {
  levels: LevelConfig[];
  onSelectLevel: (level: LevelConfig) => void;
  onBackToMenu: () => void;
}

const commandColors: Record<string, string> = {
  'git init':     '#56d364',
  'git add':      '#79c0ff',
  'git commit':   '#d2a8ff',
  'git branch':   '#ffa657',
  'git merge':    '#ff7b72',
  'git push':     '#f0e68c',
  'git pull':     '#39d5d5',
  'git checkout': '#ffa657',
  'git rebase':   '#ff7b72',
};

function getCommandColor(cmd: string): string {
  for (const [key, color] of Object.entries(commandColors)) {
    if (cmd.toLowerCase().startsWith(key)) return color;
  }
  return '#8b949e';
}

const difficultyMap: Record<number, { label: string; color: string }> = {
  1: { label: 'Beginner',     color: '#56d364' },
  2: { label: 'Easy',         color: '#79c0ff' },
  3: { label: 'Intermediate', color: '#ffa657' },
  4: { label: 'Advanced',     color: '#ff7b72' },
  5: { label: 'Expert',       color: '#d2a8ff' },
};

function getDifficulty(tasks: number) {
  if (tasks <= 2) return difficultyMap[1];
  if (tasks <= 4) return difficultyMap[2];
  if (tasks <= 6) return difficultyMap[3];
  if (tasks <= 8) return difficultyMap[4];
  return difficultyMap[5];
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  onSelectLevel,
  onBackToMenu,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      {/* Background decoration */}
      <div className={styles.bgGlow} />
      <div className={styles.grid} />

      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBackToMenu} id="btn-back-to-menu">
          <span className={styles.backArrow}>←</span>
          Back
        </button>
        <div className={styles.headerCenter}>
          <span className={styles.headerTag}>// MISSION SELECT</span>
          <h1 className={styles.headerTitle}>เลือกด่านการเรียนรู้</h1>
        </div>
        <div className={styles.headerStats}>
          <span className={styles.statBadge}>
            <span className={styles.statNum}>{levels.length}</span>
            <span className={styles.statLabel}>Missions</span>
          </span>
        </div>
      </header>

      {/* Content */}
      <main className={styles.content}>
        {levels.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <p className={styles.intro}>
              🎯 เลือกด่านที่ต้องการฝึก — แต่ละด่านจะสอน Git command ที่ต่างกัน
            </p>
            <div className={styles.grid2}>
              {levels.map((lvl, idx) => {
                const diff = getDifficulty(lvl.tasks.length);
                const cmdColor = getCommandColor(lvl.command);
                const isHovered = hoveredId === lvl.levelId;

                return (
                  <div
                    key={lvl.levelId}
                    id={`level-card-${lvl.levelId}`}
                    className={`${styles.card} ${isHovered ? styles.cardHovered : ''}`}
                    onClick={() => onSelectLevel(lvl)}
                    onMouseEnter={() => setHoveredId(lvl.levelId)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{ '--card-color': cmdColor, '--anim-delay': `${idx * 0.08}s` } as React.CSSProperties}
                  >
                    {/* Card glow */}
                    <div className={styles.cardGlow} />

                    {/* Card top row */}
                    <div className={styles.cardTop}>
                      <div className={styles.levelNumBadge}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className={styles.cmdBadge} style={{ color: cmdColor, borderColor: `${cmdColor}44`, background: `${cmdColor}12` }}>
                        <code>{lvl.command}</code>
                      </div>
                    </div>

                    {/* Name */}
                    <h2 className={styles.cardTitle}>{lvl.levelName}</h2>

                    {/* Description */}
                    <p className={styles.cardDesc}>{lvl.description}</p>

                    {/* Footer */}
                    <div className={styles.cardFooter}>
                      <div className={styles.cardMeta}>
                        <span className={styles.tasksCount}>
                          <span className={styles.tasksIcon}>◈</span>
                          {lvl.tasks.length} ภารกิจย่อย
                        </span>
                        <span
                          className={styles.diffBadge}
                          style={{ color: diff.color, borderColor: `${diff.color}50`, background: `${diff.color}10` }}
                        >
                          {diff.label}
                        </span>
                      </div>
                      <div className={styles.playBtn}>
                        <span>เล่น</span>
                        <span className={styles.playArrow}>→</span>
                      </div>
                    </div>

                    {/* Task preview dots */}
                    <div className={styles.taskDots}>
                      {lvl.tasks.map((_, i) => (
                        <span key={i} className={styles.taskDot} style={{ background: cmdColor, opacity: 0.35 + (i / lvl.tasks.length) * 0.65 }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

function EmptyState() {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyTerminal}>
        <div className={styles.emptyTermDots}>
          <span style={{ background: '#ff5f57' }} />
          <span style={{ background: '#ffbd2e' }} />
          <span style={{ background: '#28c840' }} />
        </div>
        <div className={styles.emptyTermContent}>
          <div className={styles.emptyTermLine}>
            <span className={styles.emptyPrompt}>$</span>
            <span className={styles.emptyCmd}> ls backend/levels/</span>
          </div>
          <div className={styles.emptyTermOutput}>
            <span className={styles.emptyError}>No files found.</span>
          </div>
          <div className={styles.emptyTermLine}>
            <span className={styles.emptyPrompt}>$</span>
            <span className={styles.emptyCursor} />
          </div>
        </div>
      </div>
      <h3 className={styles.emptyTitle}>ไม่พบด่านในระบบ</h3>
      <p className={styles.emptyText}>
        ใส่ไฟล์ด่าน <code className={styles.emptyCode}>.json</code> ลงในโฟลเดอร์{' '}
        <code className={styles.emptyCode}>backend/levels/</code>{' '}
        เพื่อเริ่มต้นใช้งาน
      </p>
    </div>
  );
}

export default LevelSelector;
