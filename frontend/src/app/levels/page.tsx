// src/app/levels/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LevelSelector from '@/components/LevelSelector/LevelSelector';
import { LevelConfig } from '@/hooks/useGameState';
import styles from '../page.module.css';

export default function LevelsPage() {
  const router = useRouter();
  const [levels, setLevels] = useState<LevelConfig[]>([]);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    fetch(`${API_URL}/api/levels`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLevels(data);
        }
      })
      .catch(err => console.error('Failed to load levels:', err));
  }, []);

  return (
    <main className={styles.main}>
      <LevelSelector
        levels={levels}
        onSelectLevel={level => router.push(`/game/${level.levelId}`)}
        onBackToMenu={() => router.push('/')}
      />
    </main>
  );
}
