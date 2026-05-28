import React, { useState, useEffect } from 'react';

export default function Header() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;
      setTime(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <h1>🎮 Git Sandbox</h1>
        <p className="subtitle">Learn Git in a safe environment</p>
      </div>

      <div className="header-right">
        <div className="header-item">
          <label>Level:</label>
          <span className="value">{level}</span>
        </div>
        <div className="header-item">
          <label>Score:</label>
          <span className="value">{score}</span>
        </div>
        <div className="header-item">
          <label>Time:</label>
          <span className="value timer">{time}</span>
        </div>
      </div>
    </header>
  );
}
