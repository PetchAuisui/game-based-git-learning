// src/components/Terminal/Terminal.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './Terminal.module.css';

interface TerminalProps {
  onCommand: (cmd: string) => void;
  history: React.ReactNode[];
}

const Terminal: React.FC<TerminalProps> = ({ onCommand, history }) => {
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setCmdHistory(prev => [trimmed, ...prev].slice(0, 100));
    setHistoryIdx(-1);
    onCommand(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(nextIdx);
      setInput(cmdHistory[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(nextIdx);
      setInput(nextIdx === -1 ? '' : cmdHistory[nextIdx] || '');
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className={styles.container} onClick={() => inputRef.current?.focus()}>
      {/* macOS chrome bar */}
      <div className={styles.termBar}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
        <span className={styles.termTitle}>git-sandbox — bash</span>
      </div>

      {/* Scrollable body */}
      <div className={styles.termBody}>
        <div className={styles.output}>
          <div className={styles.welcome}>
            <span style={{ color: '#ffff66' }}>Git Sandbox</span>{' '}
            <span style={{ color: '#a58e87' }}>v1.0 — free-play mode</span>
          </div>
          <div className={styles.welcomeHint}>
            Try: <span style={{ color: '#a3be8c' }}>git init</span> → <span style={{ color: '#a3be8c' }}>touch file.txt</span> → <span style={{ color: '#a3be8c' }}>git add .</span> → <span style={{ color: '#a3be8c' }}>git commit -m "hello"</span>
          </div>

          {history.map((line, i) => {
            const isStr = typeof line === 'string';
            const isCmd = isStr && (line as string).startsWith('~/project $');
            const isError = isStr && (
              (line as string).startsWith('Error:') ||
              (line as string).startsWith('fatal:') ||
              (line as string).startsWith('bash:') ||
              (line as string).startsWith('git:')
            );
            return (
              <div
                key={i}
                className={isError ? styles.errorLine : isCmd ? styles.cmdLine : styles.line}
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
            ref={inputRef}
            type="text"
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            placeholder="type a command..."
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
