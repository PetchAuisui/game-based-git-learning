import { Level } from '../levels';

export const level14: Level = {
  lvl: 14,
  tag: 'LV.14',
  name: 'git pull',
  sections: [
    {
      id: "14.1",
      conversations: [{ speaker: 'หัวหน้า', text: 'มีคนอัปเดตเซิร์ฟ ให้ใช้ git pull พร้อม --rebase ให้ประวัติเป็นเส้นตรง' }],
      quest: 'คำสั่ง pull และ rebase', hint: 'พิมพ์ "git pull origin main --rebase"', expectedCommand: /^git pull origin main --rebase$/i, action: 'CMD'
    }
  ]
};
