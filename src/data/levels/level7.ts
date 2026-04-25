import { Level } from '../levels';

export const level7: Level = {
  lvl: 7,
  tag: 'LV.07',
  name: 'git log',
  sections: [
    {
      id: "7.1",
      conversations: [{ speaker: 'หัวหน้า', text: 'พิมพ์ คำสั่ง git log ระบบจะแสดงประวัติทั้งหมดออกมาให้ดู' }],
      quest: 'เรียกดูประวัติการ commit ทั้งหมดแบบละเอียด', hint: 'พิมพ์ "git log"', expectedCommand: /^git log$/i, action: 'CMD'
    },
    {
      id: "7.2",
      conversations: [{ speaker: 'หัวหน้า', text: 'อยากดูแค่สรุปสั้นๆ ให้พิมพ์ --oneline ต่อท้ายดูสิ ประวัติจะบีบเหลือบรรทัดเดียว' }],
      quest: 'เรียกดูประวัติการ commit ทั้งหมดในรูปแบบย่อ', hint: 'พิมพ์ "git log --oneline"', expectedCommand: /^git log --oneline$/i, action: 'CMD'
    },
    {
      id: "7.3",
      conversations: [{ speaker: 'หัวหน้า', text: 'อยากดูแค่งานล่าสุด ให้ใช้ -n ตามด้วยตัวเลข ดูสิ เช่น อยากดูแค่ 2 งานล่าสุด' }],
      quest: 'เรียกดูประวัติการ commit แบบย่อ 2 รายการล่าสุด', hint: 'พิมพ์ "git log --oneline -n 2"', expectedCommand: /^git log --oneline -n *2$/i, action: 'CMD'
    },
    {
      id: "7.4",
      conversations: [{ speaker: 'หัวหน้า', text: 'ลองใช้ --graph คู่กับ --all ดู มันจะวาดแผนผังต้นไม้' }],
      quest: 'เรียกดูประวัติการ commit ของทุกสาขาแบบย่อ พร้อมกราฟ', hint: 'พิมพ์ "git log --oneline --graph --all"', expectedCommand: /^git log --oneline --graph --all$/i, action: 'CMD'
    }
  ]
};
