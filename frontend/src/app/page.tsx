// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import TitleScreen from '@/components/TitleScreen/TitleScreen';
import Cutscene from '@/components/Cutscene/Cutscene';
import GameSimulator from '@/components/GameSimulator/GameSimulator';
import LevelSelection from '@/components/LevelSelection/LevelSelection';
import styles from './page.module.css';

export default function GamePage() {
  const [screen, setScreen] = useState<'title' | 'cutscene' | 'game' | 'levels'>('title');

  const handleStartGame = () => {
    let maxIdx = 0;
    try {
      const saved = localStorage.getItem('devlab_git_game_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        maxIdx = parsed.maxLevelIdx ?? parsed.currentLevelIdx ?? 0;
      }
    } catch(e) {}
    
    if (maxIdx > 0) {
      setScreen('game');
    } else {
      setScreen('cutscene');
    }
  };

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
