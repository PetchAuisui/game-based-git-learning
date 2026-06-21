// src/app/game/[levelId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import GameSimulator from '@/components/GameSimulator/GameSimulator';
import { LevelConfig } from '@/hooks/useGameState';
import styles from '../../page.module.css';

export default function GameLevelPage() {
  const router = useRouter();
  const params = useParams();
  const rawLevelId = params?.levelId;
  const levelId = Array.isArray(rawLevelId) ? rawLevelId[0] : rawLevelId;
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!levelId) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    fetch(`${API_URL}/api/levels`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;

        const level = data.find((item: LevelConfig) => item.levelId === levelId);
        if (level) {
          setSelectedLevel(level);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      })
      .catch(err => {
        console.error('Failed to load level:', err);
        setNotFound(true);
      });
  }, [levelId]);

  if (notFound) {
    return (
      <main className={styles.main}>
        <div style={{ padding: 24 }}>
          ไม่พบด่านนี้
          <button type="button" onClick={() => router.push('/levels')}>
            กลับไปเลือกด่าน
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <GameSimulator
        selectedLevel={selectedLevel}
        onReturnMenu={() => router.push('/levels')}
      />
    </main>
  );
}
