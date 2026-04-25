import { Level } from '../levels';

export const level2: Level = {
  lvl: 2,
  tag: 'LV.02',
  name: 'git config',
  sections: [
    {
      id: "2.1",
      conversations: [
        { speaker: 'หัวหน้า', text: 'เครื่องคุณมี Git แล้ว ก่อนอื่นให้ตั้งชื่อของคุณก่อน จากนั้นค่อยระบุอีเมล ตามทีหลัง' }
      ],
      quest: 'ตั้งชื่อให้กับ git ของคุณ',
      hint: 'พิมพ์ git config --global user.name "ชื่อของคุณ"',
      expectedCommand: /^git config --global user\.name (["']?)[a-zA-Z0-9_ ]+\1$/i,
      action: 'CMD'
    },
    {
      id: "2.2",
      conversations: [
        { speaker: 'หัวหน้า', text: 'เรียบร้อย ต่อไปตั้งค่าอีเมลของคุณให้เสร็จเลย' }
      ],
      quest: 'ตั้งอีเมลให้กับ git ของคุณ',
      hint: 'พิมพ์ git config --global user.email "อีเมลของคุณ"',
      expectedCommand: /^git config --global user\.email (["']?)[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\.\-]+\1$/i,
      action: 'CMD'
    }
  ]
};
