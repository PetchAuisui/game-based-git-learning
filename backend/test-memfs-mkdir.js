const { vol, createFsFromVolume } = require('memfs');
const fs = createFsFromVolume(vol);
fs.mkdirSync('/a/b/c', { recursive: true });
fs.writeFileSync('/a/b/c/d.txt', Buffer.from('hello', 'utf8'));
console.log(fs.readFileSync('/a/b/c/d.txt', 'utf8'));
