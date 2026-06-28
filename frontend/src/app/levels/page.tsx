// src/app/levels/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import LevelSelector from '@/components/LevelSelector/LevelSelector';
import { LevelConfig } from '@/hooks/useGameState';
import styles from '../page.module.css';

export default function LevelsPage() {
  const router = useRouter();
  const [levels, setLevels] = useState<LevelConfig[]>([]);

  useEffect(() => {
    api.get('/levels')
      .then(res => {
        if (Array.isArray(res.data)) {
          setLevels(res.data);
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
