const fs = require('fs');
let content = fs.readFileSync('src/data/products.ts', 'utf8');

// The text is stored in the TS file literally as \n, so we can just replace the string.
const toRemove1 = "(84 - 24) 37 47 47 00thangtq2@eurowindow.bizTòa nhà Văn phòng Eurowindow Office Building, Số 39 Bis Mạc Đĩnh Chi, Kim Liên, Hà Nội";
const toRemove2 = "(84 - 24) 37 47 47 00cskhhn@eurowindowdoor.comDự án quốc tế và xuất khẩu+84 -903 41 55 52export@eurowindowdoor.com";

// Remove \n\n followed by the string, or just the string
content = content.split('\\n\\n' + toRemove1).join('');
content = content.split(toRemove1).join('');

content = content.split('\\n\\n' + toRemove2).join('');
content = content.split(toRemove2).join('');

fs.writeFileSync('src/data/products.ts', content);
console.log("Replaced using string split/join.");
