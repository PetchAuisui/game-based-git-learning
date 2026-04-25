// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import TitleScreen from '@/components/TitleScreen/TitleScreen';
import Cutscene from '@/components/Cutscene/Cutscene';
import GameSimulator from '@/components/GameSimulator/GameSimulator';
import styles from './page.module.css';

export default function GamePage() {
  const [screen, setScreen] = useState<'title' | 'cutscene' | 'game'>('title');

  return (
    <main className={styles.main}>
      {screen === 'title' && (
        <TitleScreen onStart={() => setScreen('cutscene')} />
      )}
      
      {screen === 'cutscene' && (
        <Cutscene onComplete={() => setScreen('game')} />
      )}
      
      {screen === 'game' && (
        <GameSimulator onReturnMenu={() => setScreen('title')} />
      )}
    </main>
  );
}
