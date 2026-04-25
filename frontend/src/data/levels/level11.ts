import { Level } from '../levels';

export const level11: Level = {
  lvl: 11,
  tag: 'LV.11',
  name: 'git switch',
  sections: [
    {
      id: "11.1",
      conversations: [{ speaker: 'หัวหน้า', text: 'คุณอยู่หลักอยู่ ย้ายไปสาขา feature-login ด้วย git switch' }],
      quest: 'สลับไปใช้งานสาขา feature-login', hint: 'พิมพ์ "git switch feature-login"', expectedCommand: /^git switch feature-login$/i, action: 'GIT_SWITCH'
    },
    {
      id: "11.2",
      conversations: [{ speaker: 'หัวหน้า', text: 'ลองสร้างสาขาใหม่ feature-ui พร้อมย้ายไปในตัวด้วย -c' }],
      quest: 'สร้างสาขาและย้ายทันที', hint: 'พิมพ์ "git switch -c feature-ui"', expectedCommand: /^git switch -c feature-ui$/i, action: 'GIT_SWITCH'
    }
  ]
};
