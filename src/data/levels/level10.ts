import { Level } from '../levels';

export const level10: Level = {
  lvl: 10,
  tag: 'LV.10',
  name: 'git branch',
  sections: [
    {
      id: "10.1",
      conversations: [{ speaker: 'หัวหน้า', text: 'ดูสิว่ามีสาขาอะไรบ้าง พิมพ์แค่ git branch' }],
      quest: 'ดูรายชื่อสาขาทั้งหมดที่มีในเครื่อง', hint: 'พิมพ์ "git branch"', expectedCommand: /^git branch$/i, action: 'CMD'
    },
    {
      id: "10.2",
      conversations: [{ speaker: 'หัวหน้า', text: 'สร้างสาขาใหม่ชื่อ feature-login ขึ้นมาเลย' }],
      quest: 'สร้างสาขาใหม่ชื่อ feature-login', hint: 'พิมพ์ "git branch feature-login"', expectedCommand: /^git branch feature-login$/i, action: 'GIT_BRANCH'
    },
    {
      id: "10.3",
      conversations: [{ speaker: 'หัวหน้า', text: 'สาขา old-test ไม่ได้ใช้แล้ว ลบมันทิ้งไปด้วย -d' }],
      quest: 'ลบสาขาเก่า old-test', hint: 'พิมพ์ "git branch -d old-test"', expectedCommand: /^git branch -d old-test$/i, action: 'GIT_BRANCH'
    }
  ]
};
