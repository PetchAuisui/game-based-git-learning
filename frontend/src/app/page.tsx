// src/app/page.tsx
'use client';

import React, { useState, useCallback } from 'react';
import TitleScreen from '@/components/TitleScreen/TitleScreen';
import Cutscene from '@/components/Cutscene/Cutscene';
import GameSimulator from '@/components/GameSimulator/GameSimulator';
import LevelSelection from '@/components/LevelSelection/LevelSelection';
import api from '@/utils/api';
import styles from './page.module.css';

export default function GamePage() {
  const [screen, setScreen] = useState<'title' | 'cutscene' | 'game' | 'levels'>('title');

  const handleStartGame = useCallback(async () => {
    try {
      const res = await api.get('/user/progress');
      const maxIdx = res.data?.currentHighestLevel ?? 0;
      if (maxIdx > 0) {
        setScreen('game');
      } else {
        setScreen('cutscene');
      }
    } catch (e) {
      // Fallback: if backend is unreachable, go to cutscene (first-time experience)
      setScreen('cutscene');
    }
  }, []);

  return (
    <main className={styles.main}>
      {screen === 'title' && (
        <TitleScreen 
          onStart={handleStartGame} 
          onAllLevels={() => setScreen('levels')}
        />
      )}
      
      {screen === 'levels' && (
        <LevelSelection 
          onStartLevel={() => setScreen('game')} 
          onBack={() => setScreen('title')}
        />
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
