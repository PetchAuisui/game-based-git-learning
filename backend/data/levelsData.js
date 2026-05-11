// backend/data/levelsData.js
// All level definitions. expectedCommand is stored as a string regex pattern (never sent to client).
// expectedCommandFlags stores regex flags (e.g. 'i' for case-insensitive).

const LEVELS = [
  // ── Level 1: git version ──
  {
    lvl: 1,
    tag: 'LV.01',
    name: 'git version',
    sections: [
      {
        id: '1.1',
        conversations: [
          { speaker: 'หัวหน้า', text: 'คอมเครื่องนี้เป็นของคุณแล้วในการทำงานที่นี้ ลองดูสิว่าคอมคุณมี git ไหม ลองพิมพ์ git version ดูสิ' }
        ],
        quest: 'ตรวจสอบเวอร์ชันของ Git ในเครื่องเพื่อให้แน่ใจว่าพร้อมทำงาน',
        hint: 'พิมพ์ "git version"',
        expectedCommand: '^git version$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      }
    ]
  },

  // ── Level 2: git config ──
  {
    lvl: 2,
    tag: 'LV.02',
    name: 'git config',
    sections: [
      {
        id: '2.1',
        conversations: [
          { speaker: 'หัวหน้า', text: 'เครื่องคุณมี Git แล้ว ก่อนอื่นให้ตั้งชื่อของคุณก่อน จากนั้นค่อยระบุอีเมล ตามทีหลัง' }
        ],
        quest: 'ตั้งชื่อให้กับ git ของคุณ',
        hint: 'พิมพ์ git config --global user.name "ชื่อของคุณ"',
        expectedCommand: '^git config --global user\\.name (["\']?)[a-zA-Z0-9_ ]+\\1$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      },
      {
        id: '2.2',
        conversations: [
          { speaker: 'หัวหน้า', text: 'เรียบร้อย ต่อไปตั้งค่าอีเมลของคุณให้เสร็จเลย' }
        ],
        quest: 'ตั้งอีเมลให้กับ git ของคุณ',
        hint: 'พิมพ์ git config --global user.email "อีเมลของคุณ"',
        expectedCommand: '^git config --global user\\.email (["\']?)[a-zA-Z0-9_\\.\\-]+@[a-zA-Z0-9\\-]+\\.[a-zA-Z0-9\\.\\-]+\\1$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      }
    ]
  },

  // ── Level 3: git init ──
  {
    lvl: 3,
    tag: 'LV.03',
    name: 'git init',
    sections: [
      {
        id: '3.1',
        conversations: [
          { speaker: 'หัวหน้า', text: 'โปรเจกต์นี้ยังไม่มีระบบ Git คอยดูแลเลย! พิมพ์ git init เพื่อเริ่มต้นระบบ และให้มันเริ่มจับตาดูไฟล์ของเรากันเถอะ' }
        ],
        quest: 'เริ่มต้นสร้าง Git Repository ให้กับโปรเจกต์ปัจจุบันเพื่อให้ Git เริ่มติดตามการเปลี่ยนแปลง',
        hint: 'พิมพ์ "git init"',
        expectedCommand: '^git init$',
        expectedCommandFlags: 'i',
        action: 'GIT_INIT'
      }
    ]
  },

  // ── Level 4: git status ──
  {
    lvl: 4,
    tag: 'LV.04',
    name: 'git status',
    sections: [
      {
        id: '4.1',
        conversations: [
          { speaker: 'หัวหน้า', text: 'Git เริ่มทำงานแล้ว! ลองเช็คดูสิว่ามันมองเห็นไฟล์งานของเราไหม พิมพ์ git status เพื่อดูสถานะเลย' }
        ],
        quest: 'ตรวจสอบสถานะของไฟล์ในโปรเจกต์',
        hint: 'พิมพ์ "git status"',
        expectedCommand: '^git status$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      }
    ]
  },

  // ── Level 5: git add ──
  {
    lvl: 5,
    tag: 'LV.05',
    name: 'git add',
    sections: [
      {
        id: '5.1',
        conversations: [
          { speaker: 'หัวหน้า', text: 'เห็นไฟล์สีแดงนั่นไหม? มันยังไม่ถูกเตรียมบันทึกนะ ใช้คำสั่ง add เพื่อส่งมันไปที่ Staging Area ก่อน (เช่น git add index.html)' }
        ],
        quest: 'นำไฟล์ index.html เข้าสู่พื้นที่เตรียมบันทึก (Staging Area)',
        hint: 'พิมพ์ "git add index.html"',
        expectedCommand: '^git add index\\.html$',
        expectedCommandFlags: 'i',
        action: 'GIT_ADD'
      },
      {
        id: '5.2',
        conversations: [
          { speaker: 'หัวหน้า', text: 'จำไว้ให้ดีนะ! git add . จะกวาดไฟล์เฉพาะในโฟลเดอร์ที่เรายืนอยู่เท่านั้น ถ้าคุณมุดเข้าไปทำงานในโฟลเดอร์ย่อยลึกๆ แล้วอยาก add ไฟล์ที่อยู่ข้างนอกด้วย จุดจะเอาไม่อยู่!' }
        ],
        quest: 'เพิ่มไฟล์ที่มีการเปลี่ยนแปลงทั้งหมดในโปรเจกต์ เข้าสู่ Staging Area ด้วย จุด',
        hint: 'พิมพ์ "git add ."',
        expectedCommand: '^git add \\.$',
        expectedCommandFlags: 'i',
        action: 'GIT_ADD_ALL'
      },
      {
        id: '5.3',
        conversations: [
          { speaker: 'หัวหน้า', text: 'คุณอาจใช้ --all เพื่อกวาดการเปลี่ยนแปลงทั้งหมดเข้า Staging รวดเดียวเลยสิ ข้อดีของมันคือมันจะเก็บกวาดจุดอื่นๆด้วย' }
        ],
        quest: 'เพิ่มการเปลี่ยนแปลงทั้งหมดเข้าสู่ Staging Area ด้วย --all',
        hint: 'พิมพ์ "git add --all"',
        expectedCommand: '^git add --all$',
        expectedCommandFlags: 'i',
        action: 'GIT_ADD_ALL'
      }
    ]
  },

  // ── Level 6: git commit ──
  {
    lvl: 6,
    tag: 'LV.06',
    name: 'git commit',
    sections: [
      {
        id: '6.1',
        conversations: [
          { speaker: 'หัวหน้า', text: 'ไฟล์สีเขียวพร้อมแล้ว! ถึงเวลาบันทึกการเปลี่ยนแปลงไว้ในประวัติ Git แล้ว! ลองพิมพ์คำสั่ง git commit เฉยๆ ดูสิ' }
        ],
        quest: 'เปิด Text Editor สำหรับเขียนข้อความ commit (พิมพ์แค่ git commit)',
        hint: 'พิมพ์ "git commit"',
        expectedCommand: '^git commit$',
        expectedCommandFlags: 'i',
        action: 'GIT_COMMIT'
      },
      {
        id: '6.2',
        conversations: [
          { speaker: 'หัวหน้า', text: 'ถ้าไม่อยากเปิด Text Editor ลองใช้ git commit -m พร้อมข้อความอธิบายต่อท้ายได้เลย รวดเร็วกว่าเยอะ!' }
        ],
        quest: 'บันทึกไฟล์ลงใน Git Repository พร้อมข้อความอธิบาย',
        hint: 'พิมพ์ git commit -m "คำอธิบาย"',
        expectedCommand: '^git commit -m (["\']?).+\\1$',
        expectedCommandFlags: 'i',
        action: 'GIT_COMMIT'
      },
      {
        id: '6.3',
        conversations: [
          { speaker: 'หัวหน้า', text: 'ใช้ git commit -am เพื่อ add และ commit ไฟล์ที่ติดตามอยู่แล้วพร้อมกันในคำสั่งเดียวเลย (หรือ -a -m)' }
        ],
        quest: 'บันทึกไฟล์ที่แก้ไขทั้งหมดในคำสั่งเดียว',
        hint: 'พิมพ์ git commit -am "คำอธิบาย"',
        expectedCommand: '^git commit -(am|a -m) (["\']?).+\\1$',
        expectedCommandFlags: 'i',
        action: 'GIT_COMMIT'
      },
      {
        id: '6.4',
        conversations: [
          { speaker: 'หัวหน้า', text: 'โอ้โห! เพิ่ง commit ไปแต่ลืมอะไรไป ใช้ git commit --amend เพื่อแก้ไข commit ล่าสุดสิ' }
        ],
        quest: 'แก้ไขข้อความของ commit ล่าสุดโดยไม่สร้าง commit ใหม่',
        hint: 'พิมพ์ git commit --amend -m "คำอธิบายใหม่"',
        expectedCommand: '^git commit --amend -m (["\']?).+\\1$',
        expectedCommandFlags: 'i',
        action: 'GIT_COMMIT'
      }
    ]
  },

  // ── Level 7: git log ──
  {
    lvl: 7,
    tag: 'LV.07',
    name: 'git log',
    sections: [
      {
        id: '7.1',
        conversations: [{ speaker: 'หัวหน้า', text: 'พิมพ์ คำสั่ง git log ระบบจะแสดงประวัติทั้งหมดออกมาให้ดู' }],
        quest: 'เรียกดูประวัติการ commit ทั้งหมดแบบละเอียด',
        hint: 'พิมพ์ "git log"',
        expectedCommand: '^git log$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      },
      {
        id: '7.2',
        conversations: [{ speaker: 'หัวหน้า', text: 'อยากดูแค่สรุปสั้นๆ ให้พิมพ์ --oneline ต่อท้ายดูสิ ประวัติจะบีบเหลือบรรทัดเดียว' }],
        quest: 'เรียกดูประวัติการ commit ทั้งหมดในรูปแบบย่อ',
        hint: 'พิมพ์ "git log --oneline"',
        expectedCommand: '^git log --oneline$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      },
      {
        id: '7.3',
        conversations: [{ speaker: 'หัวหน้า', text: 'อยากดูแค่งานล่าสุด ให้ใช้ -n ตามด้วยตัวเลข ดูสิ เช่น อยากดูแค่ 2 งานล่าสุด' }],
        quest: 'เรียกดูประวัติการ commit แบบย่อ 2 รายการล่าสุด',
        hint: 'พิมพ์ "git log --oneline -n 2"',
        expectedCommand: '^git log --oneline -n *2$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      },
      {
        id: '7.4',
        conversations: [{ speaker: 'หัวหน้า', text: 'ลองใช้ --graph คู่กับ --all ดู มันจะวาดแผนผังต้นไม้' }],
        quest: 'เรียกดูประวัติการ commit ของทุกสาขาแบบย่อ พร้อมกราฟ',
        hint: 'พิมพ์ "git log --oneline --graph --all"',
        expectedCommand: '^git log --oneline --graph --all$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      }
    ]
  },

  // ── Level 8: git restore ──
  {
    lvl: 8,
    tag: 'LV.08',
    name: 'git restore',
    sections: [
      {
        id: '8.1',
        conversations: [{ speaker: 'หัวหน้า', text: 'เผลอพิมพ์พลาด ให้ใช้คำสั่ง restore เพื่อดึงไฟล์กลับมา' }],
        quest: 'ยกเลิกการแก้ไขในไฟล์ index.html',
        hint: 'พิมพ์ "git restore index.html"',
        expectedCommand: '^git restore index\\.html$',
        expectedCommandFlags: 'i',
        action: 'GIT_RESTORE'
      },
      {
        id: '8.2',
        conversations: [{ speaker: 'หัวหน้า', text: 'เผลอสั่ง add ลง staging ให้ใช้ --staged ดึงมันออกมา' }],
        quest: 'ยกเลิกการนำไฟล์เข้า Staging Area',
        hint: 'พิมพ์ "git restore --staged index.html"',
        expectedCommand: '^git restore --staged index\\.html$',
        expectedCommandFlags: 'i',
        action: 'GIT_RESTORE'
      }
    ]
  },

  // ── Level 9: git reset ──
  {
    lvl: 9,
    tag: 'LV.09',
    name: 'git reset',
    sections: [
      {
        id: '9.1',
        conversations: [{ speaker: 'หัวหน้า', text: '--soft จะย้อน Commit กลับไป แต่ไฟล์ที่เราแก้ไว้จะยังอยู่ในตะกร้า (Staging) (ให้สมมติ commit_id คือ 1a2b3c)' }],
        quest: 'ย้อนกลับ Commit โดยรักษาสถานะ Staged',
        hint: 'พิมพ์ "git reset --soft 1a2b3c"',
        expectedCommand: '^git reset --soft [a-zA-Z0-9]+$',
        expectedCommandFlags: 'i',
        action: 'GIT_RESET'
      },
      {
        id: '9.2',
        conversations: [{ speaker: 'หัวหน้า', text: 'ถ้าใช้ --mixed จะย้อนกลับและเอาออกจากตะกร้าให้ด้วย' }],
        quest: 'ย้อนกลับ Commit และ Unstage ไฟล์',
        hint: 'พิมพ์ "git reset --mixed 1a2b3c" หรือละ --mixed ไว้',
        expectedCommand: '^git reset (--mixed )?[a-zA-Z0-9]+$',
        expectedCommandFlags: 'i',
        action: 'GIT_RESET'
      },
      {
        id: '9.3',
        conversations: [{ speaker: 'หัวหน้า', text: 'ถ้าใช้ --hard ทุกอย่างจะหายวับไปกับตา ลบเนื้อหาทิ้งถาวร' }],
        quest: 'ย้อนกลับ Commit และล้างไฟล์ทิ้งทั้งหมด',
        hint: 'พิมพ์ "git reset --hard 1a2b3c"',
        expectedCommand: '^git reset --hard [a-zA-Z0-9]+$',
        expectedCommandFlags: 'i',
        action: 'GIT_RESET'
      }
    ]
  },

  // ── Level 10: git branch ──
  {
    lvl: 10,
    tag: 'LV.10',
    name: 'git branch',
    sections: [
      {
        id: '10.1',
        conversations: [{ speaker: 'หัวหน้า', text: 'ดูสิว่ามีสาขาอะไรบ้าง พิมพ์แค่ git branch' }],
        quest: 'ดูรายชื่อสาขาทั้งหมดที่มีในเครื่อง',
        hint: 'พิมพ์ "git branch"',
        expectedCommand: '^git branch$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      },
      {
        id: '10.2',
        conversations: [{ speaker: 'หัวหน้า', text: 'สร้างสาขาใหม่ชื่อ feature-login ขึ้นมาเลย' }],
        quest: 'สร้างสาขาใหม่ชื่อ feature-login',
        hint: 'พิมพ์ "git branch feature-login"',
        expectedCommand: '^git branch feature-login$',
        expectedCommandFlags: 'i',
        action: 'GIT_BRANCH'
      },
      {
        id: '10.3',
        conversations: [{ speaker: 'หัวหน้า', text: 'สาขา old-test ไม่ได้ใช้แล้ว ลบมันทิ้งไปด้วย -d' }],
        quest: 'ลบสาขาเก่า old-test',
        hint: 'พิมพ์ "git branch -d old-test"',
        expectedCommand: '^git branch -d old-test$',
        expectedCommandFlags: 'i',
        action: 'GIT_BRANCH'
      }
    ]
  },

  // ── Level 11: git switch ──
  {
    lvl: 11,
    tag: 'LV.11',
    name: 'git switch',
    sections: [
      {
        id: '11.1',
        conversations: [{ speaker: 'หัวหน้า', text: 'คุณอยู่หลักอยู่ ย้ายไปสาขา feature-login ด้วย git switch' }],
        quest: 'สลับไปใช้งานสาขา feature-login',
        hint: 'พิมพ์ "git switch feature-login"',
        expectedCommand: '^git switch feature-login$',
        expectedCommandFlags: 'i',
        action: 'GIT_SWITCH'
      },
      {
        id: '11.2',
        conversations: [{ speaker: 'หัวหน้า', text: 'ลองสร้างสาขาใหม่ feature-ui พร้อมย้ายไปในตัวด้วย -c' }],
        quest: 'สร้างสาขาและย้ายทันที',
        hint: 'พิมพ์ "git switch -c feature-ui"',
        expectedCommand: '^git switch -c feature-ui$',
        expectedCommandFlags: 'i',
        action: 'GIT_SWITCH'
      }
    ]
  },

  // ── Level 12: git merge ──
  {
    lvl: 12,
    tag: 'LV.12',
    name: 'git merge',
    sections: [
      {
        id: '12.1',
        conversations: [{ speaker: 'หัวหน้า', text: 'รวมงานจาก feature-ui มาที่ main ให้ที' }],
        quest: 'รวมงานจาก feature-ui',
        hint: 'พิมพ์ "git merge feature-ui"',
        expectedCommand: '^git merge feature-ui$',
        expectedCommandFlags: 'i',
        action: 'GIT_MERGE'
      },
      {
        id: '12.2',
        conversations: [{ speaker: 'หัวหน้า', text: 'เดี๋ยวก่อน โค้ดชนกันเป็น Conflict แบบนี้ ยกเลิก merge กลางคันด่วน แบบ --abort' }],
        quest: 'ยกเลิก merge ทิ้ง',
        hint: 'พิมพ์ "git merge --abort"',
        expectedCommand: '^git merge --abort$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      }
    ]
  },

  // ── Level 13: git clone ──
  {
    lvl: 13,
    tag: 'LV.13',
    name: 'git clone',
    sections: [
      {
        id: '13.1',
        conversations: [{ speaker: 'หัวหน้า', text: 'ดึงโค้ดโปรเจกต์จาก Remote Repository มาลงเครื่องตัวเองด้วย git clone url' }],
        quest: 'ดึง Repository ลงมา',
        hint: 'พิมพ์ "git clone https://repo.url"',
        expectedCommand: '^git clone https?:\\/\\/.+$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      }
    ]
  },

  // ── Level 14: git pull ──
  {
    lvl: 14,
    tag: 'LV.14',
    name: 'git pull',
    sections: [
      {
        id: '14.1',
        conversations: [{ speaker: 'หัวหน้า', text: 'มีคนอัปเดตเซิร์ฟ ให้ใช้ git pull พร้อม --rebase ให้ประวัติเป็นเส้นตรง' }],
        quest: 'คำสั่ง pull และ rebase',
        hint: 'พิมพ์ "git pull origin main --rebase"',
        expectedCommand: '^git pull origin main --rebase$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      }
    ]
  },

  // ── Level 15: git push ──
  {
    lvl: 15,
    tag: 'LV.15',
    name: 'git push',
    sections: [
      {
        id: '15.1',
        conversations: [{ speaker: 'หัวหน้า', text: 'ดันงานพุชขึ้น origin ในกิ่ง main' }],
        quest: 'ส่งข้อมูลไป Remote Repository',
        hint: 'พิมพ์ "git push origin main"',
        expectedCommand: '^git push origin main$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      },
      {
        id: '15.2',
        conversations: [{ speaker: 'หัวหน้า', text: 'ถ้าตั้ง -u ไว้ คราวหลังก็พิมพ์ push สั้นๆ ได้เลย' }],
        quest: 'ตั้งค่า Upstream เพื่อความสะดวกคราวหน้า',
        hint: 'พิมพ์ "git push -u origin main"',
        expectedCommand: '^git push -u origin main$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      },
      {
        id: '15.3',
        conversations: [{ speaker: 'หัวหน้า', text: 'ประวัติชนกันเละเทะ บังคับเขียนทับด้วย -f เลย (ระวังด้วยนะ)' }],
        quest: 'บังคับทับ (Force push)',
        hint: 'พิมพ์ "git push -f origin main"',
        expectedCommand: '^git push -f origin main$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      }
    ]
  },

  // ── Level 16: git push (advanced) ──
  {
    lvl: 16,
    tag: 'LV.16',
    name: 'git push',
    sections: [
      {
        id: '16.1',
        conversations: [{ speaker: 'หัวหน้า', text: 'ดันงานพุชขึ้น origin ในกิ่ง main' }],
        quest: 'ส่งข้อมูลไป Remote Repository',
        hint: 'พิมพ์ "git push origin main"',
        expectedCommand: '^git push origin main$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      },
      {
        id: '16.2',
        conversations: [{ speaker: 'หัวหน้า', text: 'ถ้าตั้ง -u ไว้ คราวหลังก็พิมพ์ push สั้นๆ ได้เลย' }],
        quest: 'ตั้งค่า Upstream เพื่อความสะดวกคราวหน้า',
        hint: 'พิมพ์ "git push -u origin main"',
        expectedCommand: '^git push -u origin main$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      },
      {
        id: '16.3',
        conversations: [{ speaker: 'หัวหน้า', text: 'ประวัติชนกันเละเทะ บังคับเขียนทับด้วย -f เลย (ระวังด้วยนะ)' }],
        quest: 'บังคับทับ (Force push)',
        hint: 'พิมพ์ "git push -f origin main"',
        expectedCommand: '^git push -f origin main$',
        expectedCommandFlags: 'i',
        action: 'CMD'
      }
    ]
  }
];

module.exports = LEVELS;
