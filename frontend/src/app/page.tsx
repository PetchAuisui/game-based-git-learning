// src/app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import MainMenu from '@/components/MainMenu/MainMenu';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();

  const handleStartLearning = () => {
    router.push('/levels');
  };

  return (
    <main className={styles.main}>
      <MainMenu onStartGame={handleStartLearning} />
    </main>
  );
}
