const { vol } = require('memfs');
vol.writeFileSync('/test.txt', Buffer.from('hello'));
const json = vol.toJSON();
console.log(json);
