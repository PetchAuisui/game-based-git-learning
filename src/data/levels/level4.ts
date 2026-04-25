import { Level } from '../levels';

export const level4: Level = {
  lvl: 4,
  tag: 'LV.04',
  name: 'git status',
  sections: [
    {
      id: "4.1",
      conversations: [
        { speaker: 'หัวหน้า', text: 'Git เริ่มทำงานแล้ว! ลองเช็คดูสิว่ามันมองเห็นไฟล์งานของเราไหม พิมพ์ git status เพื่อดูสถานะเลย' }
      ],
      quest: 'ตรวจสอบสถานะของไฟล์ในโปรเจกต์',
      hint: 'พิมพ์ "git status"',
      expectedCommand: /^git status$/i,
      action: 'CMD'
    }
  ]
};
