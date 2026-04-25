import { Level } from '../levels';

export const level5: Level = {
  lvl: 5,
  tag: 'LV.05',
  name: 'git add',
  sections: [
    {
      id: "5.1",
      conversations: [
        { speaker: 'หัวหน้า', text: 'เห็นไฟล์สีแดงนั่นไหม? มันยังไม่ถูกเตรียมบันทึกนะ ใช้คำสั่ง add เพื่อส่งมันไปที่ Staging Area ก่อน (เช่น git add index.html)' }
      ],
      quest: 'นำไฟล์ index.html เข้าสู่พื้นที่เตรียมบันทึก (Staging Area)',
      hint: 'พิมพ์ "git add index.html"',
      expectedCommand: /^git add index\.html$/i,
      action: 'GIT_ADD'
    },
    {
      id: "5.2",
      conversations: [
        { speaker: 'หัวหน้า', text: 'จำไว้ให้ดีนะ! git add . จะกวาดไฟล์เฉพาะในโฟลเดอร์ที่เรายืนอยู่เท่านั้น ถ้าคุณมุดเข้าไปทำงานในโฟลเดอร์ย่อยลึกๆ แล้วอยาก add ไฟล์ที่อยู่ข้างนอกด้วย จุดจะเอาไม่อยู่!' }
      ],
      quest: 'เพิ่มไฟล์ที่มีการเปลี่ยนแปลงทั้งหมดในโปรเจกต์ เข้าสู่ Staging Area ด้วย จุด',
      hint: 'พิมพ์ "git add ."',
      expectedCommand: /^git add \.$/i,
      action: 'GIT_ADD_ALL'
    },
    {
      id: "5.3",
      conversations: [
        { speaker: 'หัวหน้า', text: 'คุณอาจใช้ --all เพื่อกวาดการเปลี่ยนแปลงทั้งหมดเข้า Staging รวดเดียวเลยสิ ข้อดีของมันคือมันจะเก็บกวาดจุดอื่นๆด้วย' }
      ],
      quest: 'เพิ่มการเปลี่ยนแปลงทั้งหมดเข้าสู่ Staging Area ด้วย --all',
      hint: 'พิมพ์ "git add --all"',
      expectedCommand: /^git add --all$/i,
      action: 'GIT_ADD_ALL'
    }
  ]
};
