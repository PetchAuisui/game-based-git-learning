// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import MainMenu from '@/components/MainMenu/MainMenu';
import LevelSelector from '@/components/LevelSelector/LevelSelector';
import GameSimulator from '@/components/GameSimulator/GameSimulator';
import { LevelConfig } from '@/hooks/useGameState';
import styles from './page.module.css';

export default function GamePage() {
  const [activeView, setActiveView] = useState<'home' | 'levels' | 'simulator'>('home');
  const [levels, setLevels] = useState<LevelConfig[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    fetch(`${API_URL}/api/levels`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLevels(data);
        }
      })
      .catch(err => console.error('Failed to load levels in main page:', err));
  }, []);

  const handleStartLearning = () => {
    setActiveView('levels');
  };

  const handleSelectLevel = (level: LevelConfig) => {
    setSelectedLevel(level);
    setActiveView('simulator');
  };

  const handleBackToMenu = () => {
    setActiveView('home');
  };

  const handleReturnMenu = () => {
    setSelectedLevel(null);
    setActiveView('levels');
  };

  return (
    <main className={styles.main}>
      {activeView === 'home' && (
        <MainMenu onStartGame={handleStartLearning} />
      )}
      
      {activeView === 'levels' && (
        <LevelSelector 
          levels={levels} 
          onSelectLevel={handleSelectLevel} 
          onBackToMenu={handleBackToMenu} 
        />
      )}
      
      {activeView === 'simulator' && (
        <GameSimulator 
          selectedLevel={selectedLevel} 
          onReturnMenu={handleReturnMenu} 
        />
      )}
    </main>
  );
}
