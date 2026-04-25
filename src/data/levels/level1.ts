import { Level } from '../levels';

export const level1: Level = {
  lvl: 1,
  tag: 'LV.01',
  name: 'git version',
  sections: [
    {
      id: "1.1",
      conversations: [
        { speaker: 'หัวหน้า', text: 'คอมเครื่องนี้เป็นของคุณแล้วในการทำงานที่นี้ ลองดูสิว่าคอมคุณมี git ไหม ลองพิมพ์ git version ดูสิ' }
      ],
      quest: 'ตรวจสอบเวอร์ชันของ Git ในเครื่องเพื่อให้แน่ใจว่าพร้อมทำงาน',
      hint: 'พิมพ์ "git version"',
      expectedCommand: /^git version$/i,
      action: 'CMD'
    }
  ]
};
