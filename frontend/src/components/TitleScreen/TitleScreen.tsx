// src/components/TitleScreen/TitleScreen.tsx
import React, { useEffect, useRef } from 'react';
import styles from './TitleScreen.module.css';

interface TitleScreenProps {
  onStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      s: Math.random() * 2 + 1,
      sp: Math.random() * 0.5 + 0.1,
      b: Math.random(),
    }));

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.b += s.sp * 0.02;
        const alpha = 0.3 + Math.abs(Math.sin(s.b)) * 0.7;
        ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.s, s.s);
      });
      animationFrameId = requestAnimationFrame(drawStars);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawStars();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={styles.screen}>
      <canvas ref={canvasRef} className={styles.starsCanvas} />

      <div className={styles.content}>
        <div className={styles.pixelBuilding}>
          <div className={styles.pbAntenna} />
          <div className={styles.pbLight} />
          <div className={styles.pbRoof} />
          <div className={styles.pbBody}>
            <div className={`${styles.pbWindow} ${styles.pw1}`} />
            <div className={`${styles.pbWindow} ${styles.pw2}`} />
            <div className={`${styles.pbWindow} ${styles.pw3}`} />
            <div className={`${styles.pbWindow} ${styles.pw4}`} />
            <div className={`${styles.pbWindow} ${styles.pw5}`} />
            <div className={`${styles.pbWindow} ${styles.pw6}`} />
            <div className={styles.pbSign}>DevLab Studio</div>
            <div className={styles.pbDoor} />
          </div>
        </div>

        <div className={styles.titleLogo}>
          <span className={styles.t1}>GIT DI WAA!</span>
          <span className={styles.t2}>กิตดีว้าว!</span>
        </div>
        <div className={styles.titleSub}>
          เรียนรู้ Git ผ่านสถานการณ์จำลองการทำงานจริง<br />
          ในบริษัทซอฟต์แวร์ DevLab Studio
        </div>

        <div className={styles.titleBtns}>
          <button className={`${styles.btnGame} px-btn`} onClick={onStart}>
            ▶ START GAME
          </button>
        </div>
        
        <div className={styles.infoRow}>
           <div className={styles.infoCol}>
             <div className={styles.infoValGold}>15</div>
             <div className={styles.infoLbl}>คำสั่ง</div>
           </div>
           <div className={styles.infoCol}>
             <div className={styles.infoValCyan}>3</div>
             <div className={styles.infoLbl}>RANK</div>
           </div>
           <div className={styles.infoCol}>
             <div className={styles.infoValGreen}>∞</div>
             <div className={styles.infoLbl}>ลองผิดได้</div>
           </div>
        </div>

      </div>
      <div className={styles.credits}>© 2026 DevLab Studio - GIT DI WAA v1.0</div>
    </div>
  );
};

export default TitleScreen;
