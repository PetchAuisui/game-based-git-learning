import React, { useState, useRef, useEffect } from 'react';

interface TerminalProps {
  onExecuteCommand: (command: string) => void;
  terminalOutput: Array<{ type: 'input' | 'output' | 'error'; text: string }>;
}

export default function Terminal({ onExecuteCommand, terminalOutput }: TerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) {
        onExecuteCommand(input);
        setHistory([...history, input]);
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(newIndex);
      if (newIndex >= 0) {
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      if (newIndex >= 0) {
        setInput(history[history.length - 1 - newIndex]);
      } else {
        setInput('');
      }
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <span className="terminal-title">Terminal</span>
        <div className="terminal-controls">
          <button className="terminal-btn minimize">_</button>
          <button className="terminal-btn maximize">□</button>
          <button className="terminal-btn close">✕</button>
        </div>
      </div>

      <div className="terminal-output" ref={outputRef}>
        {terminalOutput.map((line, idx) => (
          <div key={idx} className={`terminal-line terminal-${line.type}`}>
            {line.type === 'input' && <span className="prompt">$ </span>}
            {line.type === 'error' && <span className="prompt">✗ </span>}
            <span className="text">{line.text}</span>
          </div>
        ))}
      </div>

      <div className="terminal-input-area">
        <span className="prompt">$ </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a command (e.g., git add ., git commit -m 'message')"
          className="terminal-input"
          autoFocus
        />
      </div>
    </div>
  );
}
