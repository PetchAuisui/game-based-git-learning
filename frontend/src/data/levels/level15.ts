import { Level } from '../levels';

export const level15: Level = {
  lvl: 15,
  tag: 'LV.15',
  name: 'git push',
  sections: [
    {
      id: "15.1",
      conversations: [{ speaker: 'หัวหน้า', text: 'ดันงานพุชขึ้น origin ในกิ่ง main' }],
      quest: 'ส่งข้อมูลไป Remote Repository', hint: 'พิมพ์ "git push origin main"', expectedCommand: /^git push origin main$/i, action: 'CMD'
    },
    {
      id: "15.2",
      conversations: [{ speaker: 'หัวหน้า', text: 'ถ้าตั้ง -u ไว้ คราวหลังก็พิมพ์ push สั้นๆ ได้เลย' }],
      quest: 'ตั้งค่า Upstream เพื่อความสะดวกคราวหน้า', hint: 'พิมพ์ "git push -u origin main"', expectedCommand: /^git push -u origin main$/i, action: 'CMD'
    },
    {
      id: "15.3",
      conversations: [{ speaker: 'หัวหน้า', text: 'ประวัติชนกันเละเทะ บังคับเขียนทับด้วย -f เลย (ระวังด้วยนะ)' }],
      quest: 'บังคับทับ (Force push)', hint: 'พิมพ์ "git push -f origin main"', expectedCommand: /^git push -f origin main$/i, action: 'CMD'
    }
  ]
};
