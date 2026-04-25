// src/components/GitGraph/GitGraph.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import styles from './GitGraph.module.css';

interface GitGraphProps {
  type: 'none' | 'init' | 'commits';
}

const GitGraph: React.FC<GitGraphProps> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    if (type === 'none') {
      ctx.fillStyle = '#1e3a1e';
      ctx.font = '10px "Press Start 2P"';
      ctx.fillText('(ยังไม่มี commit)', 20, canvas.height / 2);
    } else if (type === 'init') {
      const cy = canvas.height / 2;
      // Branch line
      ctx.strokeStyle = '#00aa55';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(40, cy);
      ctx.lineTo(canvas.width - 40, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Node
      drawNode(ctx, 60, cy, '#00ff87', 'HEAD→main');
    }
  }, [type]);

  const drawNode = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label: string) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(x - 9, y - 9, 18, 18);
    ctx.fillStyle = color;
    ctx.fillRect(x - 7, y - 7, 14, 14);
    
    ctx.fillStyle = '#fff';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText(label, x + 15, y + 4);
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>GIT GRAPH</div>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default GitGraph;
