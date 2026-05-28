// src/components/GitGraph/GitGraph.tsx
'use client';

import React from 'react';
import { GitGraphData } from '@/hooks/useGameState';
import styles from './GitGraph.module.css';

interface GitGraphProps {
  data: GitGraphData;
  isInitialized: boolean;
}

const LANE_COLORS = [
  '#a3be8c', // Lane 0 (main) - Green
  '#e59866', // Lane 1 - Orange
  '#85c1e9', // Lane 2 - Light Blue
  '#bb8fce', // Lane 3 - Purple
  '#ec7063', // Lane 4 - Coral
];

const getLaneColor = (lane: number) => LANE_COLORS[lane % LANE_COLORS.length];

const GitGraph: React.FC<GitGraphProps> = ({ data, isInitialized }) => {
  if (!isInitialized) {
    return (
      <div className={styles.container}>
        <div className={styles.label}>GIT GRAPH</div>
        <div className={styles.emptyMsg}>
          <div className={styles.emptyTitle}>REPOSITORY NOT INITIALIZED</div>
          <div className={styles.emptyDesc}>
            Type <code className={styles.code}>git init</code> in the terminal to start tracking commits.
          </div>
        </div>
      </div>
    );
  }

  const { nodes, head, branch, branches } = data;

  if (!nodes || nodes.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.label}>GIT GRAPH</div>
        <div className={styles.emptyMsg}>
          <div className={styles.emptyTitle}>NO COMMITS YET</div>
          <div className={styles.emptyDesc}>
            Create files, stage them, then run{' '}
            <code className={styles.code}>git commit -m "your message"</code>
          </div>
        </div>
      </div>
    );
  }

  // ── Assign lanes to commits ──
  const branchNames = Object.keys(branches || {});
  const branchLanes: Record<string, number> = {};
  let laneCounter = 0;

  if (branchNames.includes('main')) {
    branchLanes['main'] = 0;
    laneCounter = 1;
  }
  branchNames.forEach(b => {
    if (b !== 'main') {
      branchLanes[b] = laneCounter++;
    }
  });

  const commitLanes: Record<string, number> = {};

  // First pass: assign via branch tags
  nodes.forEach(node => {
    if (node.branches && node.branches.length > 0) {
      for (const b of node.branches) {
        if (branchLanes[b] !== undefined) {
          commitLanes[node.id] = branchLanes[b];
          break;
        }
      }
    }
  });

  // Second pass: inherit from child
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i];
    if (commitLanes[node.id] === undefined) {
      const children = nodes.filter(n => n.parents.includes(node.id));
      commitLanes[node.id] = children.length > 0
        ? (commitLanes[children[0].id] ?? 0)
        : 0;
    }
  }

  // ── SVG layout ──
  const commitSpacingY = 80;
  const paddingY = 60;
  const svgHeight = Math.max(300, nodes.length * commitSpacingY + paddingY * 2);
  const svgWidth = 600;

  const coordsMap: Record<string, { x: number; y: number }> = {};
  nodes.forEach((node, idx) => {
    const lane = commitLanes[node.id] ?? 0;
    const x = 60 + lane * 50;
    const y = svgHeight - (paddingY + idx * commitSpacingY);
    coordsMap[node.id] = { x, y };
  });

  const edges: { from: { x: number; y: number }; to: { x: number; y: number }; color: string }[] = [];
  nodes.forEach(node => {
    const childCoords = coordsMap[node.id];
    const nodeParents = Array.isArray(node.parents) ? node.parents : [];
    nodeParents.forEach(parentId => {
      const parentCoords = coordsMap[parentId];
      if (parentCoords && childCoords) {
        edges.push({
          from: parentCoords,
          to: childCoords,
          color: getLaneColor(commitLanes[parentId] ?? 0)
        });
      }
    });
  });

  return (
    <div className={styles.container}>
      <div className={styles.label}>GIT GRAPH</div>
      <div className={styles.graphBody}>
        <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={styles.svg}>
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <style>{`
              @keyframes pulseHead {
                0%   { r: 7;  opacity: 1;   }
                50%  { r: 13; opacity: 0.35; }
                100% { r: 7;  opacity: 1;   }
              }
              .pulse-circle { animation: pulseHead 2s infinite ease-in-out; }
            `}</style>
          </defs>

          {/* Edges */}
          {edges.map((edge, i) => {
            const { from, to, color } = edge;
            const mid = (from.y + to.y) / 2;
            const d = `M ${from.x} ${from.y} C ${from.x} ${mid}, ${to.x} ${mid}, ${to.x} ${to.y}`;
            return (
              <g key={`edge-${i}`}>
                <path d={d} fill="none" stroke="#1c1311" strokeWidth={6} />
                <path d={d} fill="none" stroke={color} strokeWidth={2.5} filter="url(#glow)" />
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const coords = coordsMap[node.id];
            if (!coords) return null;
            const { x, y } = coords;
            const lane = commitLanes[node.id] ?? 0;
            const color = getLaneColor(lane);
            const isHead = node.isHead;

            // Compute branch pill x positions
            let pillX = x + 120;

            return (
              <g key={node.id}>
                {/* HEAD pulse ring */}
                {isHead && (
                  <circle cx={x} cy={y} r={10} fill="none" stroke="#ffff66" strokeWidth={2} className="pulse-circle" />
                )}

                {/* Outer ring */}
                <circle cx={x} cy={y} r={8} fill="#231916" stroke={isHead ? '#ffff66' : color} strokeWidth={2.5} />

                {/* Inner dot */}
                <circle cx={x} cy={y} r={4} fill={isHead ? '#ffff66' : color} />

                {/* Hash */}
                <text x={x + 16} y={y + 4} fill="#ffff66" className={styles.hashText}>
                  {node.id}
                </text>

                {/* Message */}
                <text x={x + 75} y={y + 4} fill="#f5ecea" className={styles.msgText}>
                  {node.label.length > 26 ? node.label.substring(0, 26) + '…' : node.label}
                </text>

                {/* Branch pills */}
                {node.branches.map((bName) => {
                  const isCurrent = bName === branch;
                  const pillW = bName.length * 7 + 16;
                  const currentPillX = pillX;
                  pillX += pillW + 8;
                  return (
                    <g key={`pill-${bName}`} transform={`translate(${currentPillX}, ${y - 8})`}>
                      <rect width={pillW} height={16} rx={4} fill={isCurrent ? '#a3be8c' : '#4d3a35'} stroke={isCurrent ? '#ffff66' : '#7c625a'} strokeWidth={1} />
                      <text x={pillW / 2} y={11} textAnchor="middle" fill={isCurrent ? '#231916' : '#f5ecea'} className={styles.tagText} fontWeight="bold">
                        {bName}
                      </text>
                    </g>
                  );
                })}

                {/* Detached HEAD label */}
                {isHead && !branch && (
                  <g transform={`translate(${pillX}, ${y - 8})`}>
                    <rect width={50} height={16} rx={4} fill="#ffff66" />
                    <text x={25} y={11} textAnchor="middle" fill="#231916" className={styles.tagText} fontWeight="bold">HEAD</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default GitGraph;
