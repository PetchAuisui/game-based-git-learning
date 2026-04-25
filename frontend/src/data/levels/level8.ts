import { Level } from '../levels';

export const level8: Level = {
  lvl: 8,
  tag: 'LV.08',
  name: 'git restore',
  sections: [
    {
      id: "8.1",
      conversations: [{ speaker: 'หัวหน้า', text: 'เผลอพิมพ์พลาด ให้ใช้คำสั่ง restore เพื่อดึงไฟล์กลับมา' }],
      quest: 'ยกเลิกการแก้ไขในไฟล์ index.html', hint: 'พิมพ์ "git restore index.html"', expectedCommand: /^git restore index\.html$/i, action: 'GIT_RESTORE'
    },
    {
      id: "8.2",
      conversations: [{ speaker: 'หัวหน้า', text: 'เผลอสั่ง add ลง staging ให้ใช้ --staged ดึงมันออกมา' }],
      quest: 'ยกเลิกการนำไฟล์เข้า Staging Area', hint: 'พิมพ์ "git restore --staged index.html"', expectedCommand: /^git restore --staged index\.html$/i, action: 'GIT_RESTORE'
    }
  ]
};
