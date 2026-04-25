import { Level } from '../levels';

export const level13: Level = {
  lvl: 13,
  tag: 'LV.13',
  name: 'git clone',
  sections: [
    {
      id: "13.1",
      conversations: [{ speaker: 'หัวหน้า', text: 'ดึงโค้ดโปรเจกต์จาก Remote Repository มาลงเครื่องตัวเองด้วย git clone url' }],
      quest: 'ดึง Repository ลงมา', hint: 'พิมพ์ "git clone https://repo.url"', expectedCommand: /^git clone https?:\/\/.+$/i, action: 'CMD'
    }
  ]
};
