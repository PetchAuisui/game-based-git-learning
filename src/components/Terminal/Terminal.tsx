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
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim());
      setInput('');
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div
      className={styles.container}
      onClick={() => document.getElementById('term-input')?.focus()}
    >
      {/* macOS-style chrome bar */}
      <div className={styles.termBar}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
        <span className={styles.termTitle}>git-simulator — bash</span>
      </div>

      {/* Scrollable body */}
      <div className={styles.termBody}>
        <div className={styles.output}>
          <div className={styles.welcome}>
            <span style={{ color: 'var(--cyan)' }}>Git Simulator</span>{' '}
            <span style={{ color: 'var(--gray)' }}>v1.0.0 — type a command to start</span>
          </div>

          {history.map((line, i) => {
            const isStr  = typeof line === 'string';
            const isError = isStr && (line as string).startsWith('Error:');
            const isCmd   = isStr && (line as string).startsWith('devlab@git');
            return (
              <div
                key={i}
                className={
                  isError ? styles.errorLine
                  : isCmd  ? styles.cmdLine
                  : styles.line
                }
              >
                {line}
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className={styles.inputArea}>
          <span className={styles.prompt}>~/project $</span>
          <input
            id="term-input"
            type="text"
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            placeholder="type a git command..."
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
