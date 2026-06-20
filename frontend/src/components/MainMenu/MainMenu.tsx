// src/components/MainMenu/MainMenu.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styles from './MainMenu.module.css';

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [showHowTo, setShowHowTo] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('game-theme') as 'light' | 'dark';
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('game-theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  };

  const asciiLogo = `
  +-+-+-+-+ +-+-+-+-+-+-+-+
  |G|I|T| |S|A|N|D|B|O|X|
  +-+-+-+-+ +-+-+-+-+-+-+-+
  `;

  return (
    <div className={styles.container}>
      <div className={styles.themeToggleArea}>
        <button className={styles.themeBtn} onClick={toggleTheme} title="สลับธีม">
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>

      <div className={styles.menuBox}>
        <pre className={styles.logo}>{asciiLogo}</pre>
        
        <h1 className={styles.title}>GIT SANDBOX LEARNING</h1>
        <p className={styles.subtitle}>เรียนรู้การใช้งาน Git ผ่านระบบจำลองแซนด์บ็อกซ์ในรูปแบบเกม</p>

        <div className={styles.buttonList}>
          <button className={styles.menuBtnPrimary} onClick={onStartGame}>
            🎯 เริ่มต้นเรียนรู้ (Start Learning)
          </button>
          
          <button className={styles.menuBtnSecondary} onClick={() => setShowHowTo(!showHowTo)}>
            📖 วิธีการเล่น (How to Play)
          </button>
        </div>

        {showHowTo && (
          <div className={styles.howToCard}>
            <h3 className={styles.howToTitle}>⌨️ วิธีการใช้งาน & เป้าหมายการเรียนรู้</h3>
            <ol className={styles.howToList}>
              <li><strong>เลือกด่านที่ต้องการเล่น</strong>: ด่านจะถูกดึงมาจากโฟลเดอร์ใน Backend ของคุณโดยอัตโนมัติ</li>
              <li><strong>อ่านรายละเอียดภารกิจ</strong>: ภารกิจย่อยในแต่ละด่านจะแสดงอยู่ที่แถบด้านซ้าย</li>
              <li><strong>ใช้ Terminal ในการรันคำสั่ง</strong>: พิมพ์คำสั่ง Git ลงในช่อง Terminal เพื่อทำงาน (เช่น <code>git init</code>, <code>git add .</code>)</li>
              <li><strong>สังเกตประวัติกิ่งสาขา (Git Graph)</strong>: แผนภาพกราฟตรงกลางจะวาดโหนดประวัติการทำ Commit และกิ่งสาขาขึ้นมาแบบเรียลไทม์!</li>
              <li><strong>ทำภารกิจให้ครบ</strong>: เมื่อภารกิจย่อยครบทั้งหมด ด่านนั้นจะผ่านทันที!</li>
            </ol>
            <button className={styles.closeHowToBtn} onClick={() => setShowHowTo(false)}>
              ปิดหน้าต่างช่วยเหลือ
            </button>
          </div>
        )}

        <div className={styles.footer}>
          COZY_CMD.EXE • Version 1.0.0
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
