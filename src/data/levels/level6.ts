import { Level } from '../levels';

export const level6: Level = {
  lvl: 6,
  tag: 'LV.06',
  name: 'git commit',
  sections: [
    {
      id: "6.1",
      conversations: [
        { speaker: 'หัวหน้า', text: 'ไฟล์สีเขียวพร้อมแล้ว! ถึงเวลาบันทึกการเปลี่ยนแปลงไว้ในประวัติ Git แล้ว! ลองพิมพ์คำสั่ง git commit เฉยๆ ดูสิ' }
      ],
      quest: 'เปิด Text Editor สำหรับเขียนข้อความ commit (พิมพ์แค่ git commit)',
      hint: 'พิมพ์ "git commit"',
      expectedCommand: /^git commit$/i,
      action: 'GIT_COMMIT'
    },
    {
      id: "6.2",
      conversations: [
        { speaker: 'หัวหน้า', text: 'ถ้าไม่อยากเปิด Text Editor ลองใช้ git commit -m พร้อมข้อความอธิบายต่อท้ายได้เลย รวดเร็วกว่าเยอะ!' }
      ],
      quest: 'บันทึกไฟล์ลงใน Git Repository พร้อมข้อความอธิบาย',
      hint: 'พิมพ์ git commit -m "คำอธิบาย"',
      expectedCommand: /^git commit -m (["']?).+\1$/i,
      action: 'GIT_COMMIT'
    },
    {
      id: "6.3",
      conversations: [
        { speaker: 'หัวหน้า', text: 'ใช้ git commit -am เพื่อ add และ commit ไฟล์ที่ติดตามอยู่แล้วพร้อมกันในคำสั่งเดียวเลย (หรือ -a -m)' }
      ],
      quest: 'บันทึกไฟล์ที่แก้ไขทั้งหมดในคำสั่งเดียว',
      hint: 'พิมพ์ git commit -am "คำอธิบาย"',
      expectedCommand: /^git commit -(am|a -m) (["']?).+\1$/i,
      action: 'GIT_COMMIT'
    },
    {
      id: "6.4",
      conversations: [
        { speaker: 'หัวหน้า', text: 'โอ้โห! เพิ่ง commit ไปแต่ลืมอะไรไป ใช้ git commit --amend เพื่อแก้ไข commit ล่าสุดสิ' }
      ],
      quest: 'แก้ไขข้อความของ commit ล่าสุดโดยไม่สร้าง commit ใหม่',
      hint: 'พิมพ์ git commit --amend -m "คำอธิบายใหม่"',
      expectedCommand: /^git commit --amend -m (["']?).+\1$/i,
      action: 'GIT_COMMIT'
    }
  ]
};
