// src/components/Terminal/Terminal.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './Terminal.module.css';

interface TerminalProps {
  onCommand: (cmd: string) => void;
  history: React.ReactNode[];
}

const Terminal: React.FC<TerminalProps> = ({ onCommand, history }) => {
  const [input, setInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim());
      setInput('');
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className={styles.container} ref={terminalRef} onClick={() => document.getElementById('term-input')?.focus()}>
      <div className={styles.output}>
        <div className={styles.welcome}>Git Simulator v1.0.0 [Release 95]</div>
        {history.map((line, i) => (
          <div key={i} className={line.startsWith('Error:') ? styles.errorLine : styles.line}>
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.inputArea}>
        <span className={styles.prompt}>C:\PROJECT&gt;</span>
        <input
          id="term-input"
          type="text"
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default Terminal;
