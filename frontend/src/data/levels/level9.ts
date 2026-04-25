import { Level } from '../levels';

export const level9: Level = {
  lvl: 9,
  tag: 'LV.09',
  name: 'git reset',
  sections: [
    {
      id: "9.1",
      conversations: [{ speaker: 'หัวหน้า', text: '--soft จะย้อน Commit กลับไป แต่ไฟล์ที่เราแก้ไว้จะยังอยู่ในตะกร้า (Staging) (ให้สมมติ commit_id คือ 1a2b3c)' }],
      quest: 'ย้อนกลับ Commit โดยรักษาสถานะ Staged', hint: 'พิมพ์ "git reset --soft 1a2b3c"', expectedCommand: /^git reset --soft [a-zA-Z0-9]+$/i, action: 'GIT_RESET'
    },
    {
      id: "9.2",
      conversations: [{ speaker: 'หัวหน้า', text: 'ถ้าใช้ --mixed จะย้อนกลับและเอาออกจากตะกร้าให้ด้วย' }],
      quest: 'ย้อนกลับ Commit และ Unstage ไฟล์', hint: 'พิมพ์ "git reset --mixed 1a2b3c" หรือละ --mixed ไว้', expectedCommand: /^git reset (--mixed )?[a-zA-Z0-9]+$/i, action: 'GIT_RESET'
    },
    {
      id: "9.3",
      conversations: [{ speaker: 'หัวหน้า', text: 'ถ้าใช้ --hard ทุกอย่างจะหายวับไปกับตา ลบเนื้อหาทิ้งถาวร' }],
      quest: 'ย้อนกลับ Commit และล้างไฟล์ทิ้งทั้งหมด', hint: 'พิมพ์ "git reset --hard 1a2b3c"', expectedCommand: /^git reset --hard [a-zA-Z0-9]+$/i, action: 'GIT_RESET'
    }
  ]
};
