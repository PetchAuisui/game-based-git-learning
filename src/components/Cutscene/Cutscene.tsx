// src/components/Cutscene/Cutscene.tsx
import React, { useState } from 'react';
import Character from '../Character/Character';
import styles from './Cutscene.module.css';

interface CutsceneProps {
  onComplete: () => void;
}

const dialogs = [
  { spk: 'หัวหน้า', txt: 'ยินดีต้อนรับสู่ DevLab Studio! 🎉<br/>คุณคือนักพัฒนารุ่นใหม่ที่เราตามหา' },
  { spk: 'หัวหน้า', txt: 'ที่นี่เราใช้ <strong>Git</strong> ในการควบคุม<br/>ทุก line ของโค้ดในโปรเจกต์' },
  { spk: 'คุณ', txt: 'Git... ผมเคยได้ยินแต่ยังไม่เคยใช้จริงๆ<br/>จะทำได้ไหมครับ? 😅' },
  { spk: 'หัวหน้า', txt: 'ไม่ต้องกังวล! เราจะสอนผ่านภารกิจ<br/>ทำได้ทีละขั้น เริ่มจากง่ายไปยาก' },
];

const Cutscene: React.FC<CutsceneProps> = ({ onComplete }) => {
  const [dialogIdx, setDialogIdx] = useState(0);

  const nextDialog = () => {
    if (dialogIdx + 1 >= dialogs.length) {
      onComplete();
    } else {
      setDialogIdx(dialogIdx + 1);
    }
  };

  const currentDialog = dialogs[dialogIdx];

  return (
    <div className={styles.screen}>
      <div className={styles.officeScene}>
        <div className={styles.ambientLight} />
        <div className={styles.officeBg} />
        
        {/* Large Panoramic Window */}
        <div className={styles.panoramicWindow}>
           <div className={styles.cityscape}>
              <div className={styles.moon} />
              <div className={styles.cityBuildings} />
           </div>
        </div>

        <div className={styles.officeFloor} />

        {/* Office Elements */}
        <div className={styles.whiteboard}>
           <div className={styles.wbText}>Git Workflow<br/>- pull<br/>- commit<br/>- push</div>
        </div>

        <div className={styles.officePlant}>🌵</div>
        
        <div className={styles.officeDesk}>
           <div className={styles.deskTop} />
           <div className={styles.deskLegLeft} />
           <div className={styles.deskLegRight} />
           <div className={styles.deskGlow} />
        </div>
        
        <div className={styles.officeMonitor}>
          <div className={styles.monitorScreen}>
            <div className={styles.monitorText}>
              $ git status<br/>$ git add .<br/>$ git commit -m "feat"<br/>$ git push
            </div>
          </div>
        </div>
        <div className={styles.monitorStand} />

        {/* Characters */}
        <div className={styles.sceneChars}>
          <div className={`${styles.bossWrapper} ${currentDialog.spk === 'หัวหน้า' ? styles.speaking : ''}`}>
             <Character type="boss" label="หัวหน้า" />
          </div>
          <div className={`${styles.playerWrapper} ${currentDialog.spk === 'คุณ' ? styles.speaking : ''}`}>
             <Character type="player" label="คุณ" />
          </div>
        </div>

        {/* Speech Bubble Position Changes Based on Speaker */}
        <div className={`${styles.speechBubble} ${currentDialog.spk === 'หัวหน้า' ? styles.bubbleBoss : styles.bubblePlayer}`}>
          <span className={styles.bubbleName}>{currentDialog.spk}</span>
          <span dangerouslySetInnerHTML={{ __html: currentDialog.txt }} />
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.chapterInfo}>
          <div className={styles.chLabel}>CHAPTER 1</div>
          <div className={styles.chTitle}>วันแรกในบริษัท</div>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.dots}>
            {dialogs.map((_, i) => (
              <div 
                key={i} 
                className={`${styles.dot} ${i === dialogIdx ? styles.dotActive : ''}`} 
              />
            ))}
          </div>
          <button className={`${styles.btnNext} px-btn`} onClick={nextDialog}>
            ถัดไป ▶
          </button>
          <button className={`${styles.btnSkip} px-btn`} onClick={onComplete}>
            ข้าม
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cutscene;
