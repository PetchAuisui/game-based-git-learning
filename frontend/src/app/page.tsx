// src/app/page.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

const GameSimulator = dynamic(() => import('@/components/GameSimulator/GameSimulator'), {
  ssr: false,
  loading: () => <div style={{ color: '#fff', padding: '20px' }}>Loading Sandbox...</div>
});

export default function GamePage() {
  return (
    <main className={styles.main}>
      <GameSimulator onReturnMenu={() => {}} />
    </main>
  );
}
