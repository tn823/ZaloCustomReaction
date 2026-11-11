const fs = require('node:fs');
const path = require('node:path');
const {zaloReactions} = require('../src/zalo-custom-reaction.js');
const rows = zaloReactions.map(item => `| ${item.name} | \`${item.code.replaceAll('|', '\\|')}\` | ${item.type} |`).join('\n');
fs.writeFileSync(path.join(__dirname, '../REACTIONS.md'), '# Mã reaction Zalo\n\n54 mã có bảng rType từ zca-js/zcago; :p do người dùng ghi nhận, dùng type -1 thử nghiệm. Chưa xác minh toàn bộ trên máy chủ.\n\n| Tên | Mã gửi nguyên văn | rType |\n| --- | --- | --- |\n' + rows + '\n\nNguồn: https://github.com/RFS-ADRENO/zca-js/blob/main/src/apis/addReaction.ts\n');
