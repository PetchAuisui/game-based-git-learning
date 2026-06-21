// src/components/MainMenu/MainMenu.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styles from './MainMenu.module.css';

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [showHowTo, setShowHowTo] = useState(false);
  const [theme, setTheme]   = useState<'light' | 'dark'>('dark');
  const [typedText, setTypedText] = useState('');
  const [charIdx, setCharIdx] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);

  const fullText = 'git init --learn --sandbox';

  // typing
  useEffect(() => {
    if (charIdx > fullText.length) return;
    const t = setTimeout(() => {
      setTypedText(fullText.slice(0, charIdx));
      setCharIdx(i => i + 1);
    }, 65);
    return () => clearTimeout(t);
  }, [charIdx]);

  // blink cursor
  useEffect(() => {
    const t = setInterval(() => setCursorOn(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  // load saved theme
  useEffect(() => {
    const saved = localStorage.getItem('game-theme') as 'light' | 'dark';
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('game-theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  };

  return (
    // ⚠️  NO decorative overlay divs here — backgrounds are CSS-only (::before)
    <div className={styles.container}>

      {/* Theme toggle */}
      <button
        type="button"
        className={styles.themeBtn}
        onClick={toggleTheme}
        title="Switch Theme"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* ─── Hero card ─── */}
      <div className={styles.hero}>

        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          INTERACTIVE GIT LEARNING
        </div>

        <pre className={styles.asciiLogo}>{`
   ██████╗ ██╗████████╗
  ██╔════╝ ██║╚══██╔══╝
  ██║  ███╗██║   ██║   
  ██║   ██║██║   ██║   
  ╚██████╔╝██║   ██║   
   ╚═════╝ ╚═╝   ╚═╝   
     SANDBOX`}</pre>

        <h1 className={styles.title}>
          <span className={styles.git}>GIT</span>{' '}SANDBOX
        </h1>

        <p className={styles.sub}>
          เรียนรู้ Git ผ่านระบบจำลองเชิงเกม · Learn Git through interactive gameplay
        </p>

        {/* Terminal preview (decorative — no user input) */}
        <div className={styles.term}>
          <div className={styles.termBar}>
            <span className={styles.dot} data-color="red"  />
            <span className={styles.dot} data-color="yellow" />
            <span className={styles.dot} data-color="green" />
            <span className={styles.termPath}>~/sandbox</span>
          </div>
          <div className={styles.termBody}>
            <span className={styles.prompt}>$ </span>
            <span>{typedText}</span>
            <span className={cursorOn ? styles.cursorOn : styles.cursorOff}>_</span>
          </div>
        </div>

        {/* ── BUTTONS ── */}
        <div className={styles.btnGroup}>
          <button
            id="btn-start-learning"
            type="button"
            className={styles.btnPrimary}
            onClick={onStartGame}
          >
            🚀&nbsp; เริ่มต้นเรียนรู้
            <span className={styles.arrow}>→</span>
          </button>

          <button
            id="btn-how-to-play"
            type="button"
            className={styles.btnSecondary}
            onClick={() => setShowHowTo(v => !v)}
          >
            📖&nbsp; วิธีการเล่น
          </button>
        </div>

        {showHowTo && (
          <div className={styles.howTo}>
            <p className={styles.howToTitle}>⌨️ วิธีการใช้งาน</p>
            <ol className={styles.steps}>
              <li>เลือกด่านจากหน้า Mission Select</li>
              <li>อ่านภารกิจในแถบด้านซ้าย</li>
              <li>พิมพ์คำสั่ง Git ใน Terminal</li>
              <li>สังเกต Git Graph แบบ Real-time</li>
            </ol>
            <button type="button" className={styles.closeBtn} onClick={() => setShowHowTo(false)}>
              ✕ ปิด
            </button>
          </div>
        )}

        <p className={styles.footer}>GIT SANDBOX v1.0 · Interactive Learning Platform</p>
      </div>
    </div>
  );
};

export default MainMenu;
