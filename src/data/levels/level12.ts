import { Level } from '../levels';

export const level12: Level = {
  lvl: 12,
  tag: 'LV.12',
  name: 'git merge',
  sections: [
    {
      id: "12.1",
      conversations: [{ speaker: 'หัวหน้า', text: 'รวมงานจาก feature-ui มาที่ main ให้ที' }],
      quest: 'รวมงานจาก feature-ui', hint: 'พิมพ์ "git merge feature-ui"', expectedCommand: /^git merge feature-ui$/i, action: 'GIT_MERGE'
    },
    {
      id: "12.2",
      conversations: [{ speaker: 'หัวหน้า', text: 'เดี๋ยวก่อน โค้ดชนกันเป็น Conflict แบบนี้ ยกเลิก merge กลางคันด่วน แบบ --abort' }],
      quest: 'ยกเลิก merge ทิ้ง', hint: 'พิมพ์ "git merge --abort"', expectedCommand: /^git merge --abort$/i, action: 'CMD'
    }
  ]
};
