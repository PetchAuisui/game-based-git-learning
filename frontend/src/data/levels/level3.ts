import { Level } from '../levels';

export const level3: Level = {
  lvl: 3,
  tag: 'LV.03',
  name: 'git init',
  sections: [
    {
      id: "3.1",
      conversations: [
        { speaker: 'หัวหน้า', text: 'โปรเจกต์นี้ยังไม่มีระบบ Git คอยดูแลเลย! พิมพ์ git init เพื่อเริ่มต้นระบบ และให้มันเริ่มจับตาดูไฟล์ของเรากันเถอะ' }
      ],
      quest: 'เริ่มต้นสร้าง Git Repository ให้กับโปรเจกต์ปัจจุบันเพื่อให้ Git เริ่มติดตามการเปลี่ยนแปลง',
      hint: 'พิมพ์ "git init"',
      expectedCommand: /^git init$/i,
      action: 'GIT_INIT'
    }
  ]
};
